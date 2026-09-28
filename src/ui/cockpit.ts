// 조종석: 떠다니는 자음·모음을 끌어다 음절 조립틀에 넣는다.
// - 끌어서 놓기만 된다: 탭으로는 넣지 않는다 (2026-09-28 사용자 지시). 놓인 자모를 탭하면 되돌아간다.
// - 순서대로만: 음절 차례대로, 한 음절 안에서는 초성(자음) → 중성(모음) → 종성(받침).
//   지금 차례인 칸 위에 놓아야 들어가고, 다른 칸이나 칸 밖에 놓으면 부드럽게 돌아간다.
// - 칸이 다 차면 바로 판정한다 (제출 버튼 없음).
// - 자모는 조합 영역 안에서만 천천히 떠다니고, 서로 겹치지 않고, 회전하지 않는다. 손을 대면 멈춘다.
import { canHold, cellsOf, checkFrame, nextEmptyCell, type CellRole, type FrameFill, type FrameResult, type FrameSpec } from '../core/assembly';
import { ICONS } from './icons';
import { sfx } from '../game/services';

export interface CockpitSetup {
  frames: FrameSpec[];
  /** 틀마다 흐린 자모를 보여줄지 */
  ghost: boolean[];
  /** 한 음절씩 조립 (다음 틀의 자모는 앞 틀이 끝난 뒤 공급) */
  sequential: boolean;
  /** 틀별로 공급할 자모 (필요한 자모 + 방해 자모) */
  supply: string[][];
  motion: boolean;
}

export interface CockpitCallbacks {
  onPlaced: (filledFraction: number) => void;
  onFrameResult: (index: number, result: FrameResult) => void;
  onWordComplete: () => void;
  onInteract: () => void;
  /** 끌지 않고 탭만 했을 때 (넣지 않는다) */
  onTapOnly: () => void;
}

interface JamoChip {
  id: string;
  jamo: string;
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  placed: { frame: number; role: CellRole } | null;
  frozenUntil: number;
}

interface FrameView {
  spec: FrameSpec;
  el: HTMLElement;
  cells: Partial<Record<CellRole, HTMLElement>>;
  fill: FrameFill;
  chips: Partial<Record<CellRole, JamoChip>>;
  done: boolean;
}

const DRAG_THRESHOLD = 8;
/** 차례인 칸 둘레로 이만큼 벗어나 놓아도 그 칸으로 친다 (아이 손가락) */
const DROP_TOLERANCE = 16;
/** 계속 막혀도 함정(방해) 자모는 이만큼은 남긴다 */
export const MIN_TRAPS = 1;

export class Cockpit {
  private framesEl: HTMLElement;
  private zone: HTMLElement;
  private handEl: HTMLElement;
  private frames: FrameView[] = [];
  private chips: JamoChip[] = [];
  private setupData: CockpitSetup | null = null;
  private activeFrame = 0;
  private activeCell: CellRole | null = null;
  private locked = true;
  private paused = false;
  private busy = false;
  private seq = 0;
  private raf = 0;
  private lastT = 0;
  private globalFreezeUntil = 0;
  private handTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(root: HTMLElement, private cb: CockpitCallbacks) {
    this.framesEl = root.querySelector('#frames')!;
    this.zone = root.querySelector('#zone')!;
    this.handEl = document.getElementById('hand')!;
    this.handEl.innerHTML = ICONS.hand;
  }

  // ───────────── 준비 ─────────────

  setup(s: CockpitSetup): void {
    this.stopLoop();
    this.hideHand();
    this.setupData = s;
    this.framesEl.innerHTML = '';
    this.zone.innerHTML = '';
    this.chips = [];
    this.frames = s.frames.map((spec, i) => this.makeFrame(spec, s.ghost[i]));
    this.framesEl.classList.remove('connected', 'count-1', 'count-2', 'count-3');
    this.framesEl.classList.add(`count-${Math.min(3, s.frames.length)}`);
    this.activeFrame = 0;
    this.activeCell = this.frames[0] ? nextEmptyCell(this.frames[0].spec, {}) : null;
    this.refreshFrameStates();
    // 칩 공급: 한 음절씩이면 첫 틀 것만, 아니면 전부
    const first = (s.sequential ? s.supply[0] : s.supply.flat()) ?? [];
    this.locked = true;
    this.busy = false;
    if (!this.frames.length) return;
    requestAnimationFrame(() => {
      this.spawnChips(first);
      this.startLoop();
    });
    this.locked = true;
    this.busy = false;
  }

  private makeFrame(spec: FrameSpec, ghost: boolean): FrameView {
    const el = document.createElement('div');
    el.className = `frame ${spec.shape === 'horizontal' ? 'h' : 'v'} ${spec.hasJong ? 'jong' : ''}`;
    const cells: FrameView['cells'] = {};
    for (const role of cellsOf(spec)) {
      const c = document.createElement('div');
      c.className = `cell ${role}`;
      c.dataset.role = role;
      const g = document.createElement('span');
      g.className = 'ghost';
      g.textContent = ghost ? spec[role] : '';
      c.appendChild(g);
      el.appendChild(c);
      cells[role] = c;
    }
    const made = document.createElement('div');
    made.className = 'made';
    made.textContent = spec.syllable;
    el.appendChild(made);
    this.framesEl.appendChild(el);
    const view: FrameView = { spec, el, cells, fill: {}, chips: {}, done: false };
    for (const role of cellsOf(spec)) {
      cells[role]!.addEventListener('pointerup', (e) => {
        if (e.target !== cells[role] && !(e.target as HTMLElement).classList.contains('ghost')) return;
        this.tapCell(view, role);
      });
    }
    return view;
  }

  setGhost(frameIndex: number, on: boolean): void {
    const f = this.frames[frameIndex];
    if (!f) return;
    for (const role of cellsOf(f.spec)) {
      const g = f.cells[role]!.querySelector('.ghost')!;
      g.textContent = on ? f.spec[role] : '';
    }
  }

  unlock(): void {
    this.locked = false;
  }

  lock(): void {
    this.locked = true;
    this.hideHand();
  }

  setPaused(p: boolean): void {
    this.paused = p;
    if (p) this.cancelDrag();
    this.lastT = 0;
  }

  setMotion(on: boolean): void {
    if (this.setupData) this.setupData.motion = on;
  }

  private canAct(): boolean {
    return !this.locked && !this.paused && !this.busy;
  }

  frameRects(): DOMRect[] {
    return this.frames.map((f) => f.el.getBoundingClientRect());
  }

  get currentFrame(): number {
    return this.activeFrame;
  }

  get frameCount(): number {
    return this.frames.length;
  }

  // ───────────── 떠다니는 칩 ─────────────

  private chipSize(): number {
    // 칸에 들어간 칩은 크기가 달라서, 떠다니는 칩으로 잰다
    const probe = this.chips.find((c) => !c.placed)?.el;
    return probe ? probe.offsetWidth : 64;
  }

  private spawnChips(list: string[]): void {
    const zw = this.zone.clientWidth;
    const zh = this.zone.clientHeight;
    const made = list.map((jamo) => this.makeChip(jamo));
    const size = this.chipSize();
    // 격자 자리에 겹치지 않게 흩어 놓는다
    const gap = 10;
    // 칩 사이에만 간격을 둔다 (가장자리 여백까지 빼면 360px 폰에서 한 줄 4칸뿐이라 칩이 겹쳤다)
    const cols = Math.max(1, Math.floor((zw + gap) / (size + gap)));
    const rows = Math.max(1, Math.floor((zh + gap) / (size + gap)));
    const taken = new Set(this.chips.filter((c) => !c.placed && !made.includes(c)).map((c) => this.slotOf(c, cols, rows, size, gap)));
    const slots = [...Array(cols * rows).keys()].filter((i) => !taken.has(i));
    // 칩을 작게 줄이지 않는다: 자리가 모자라면 방해 자모부터 뺀다 (정답 자모는 항상 남긴다)
    while (made.length > slots.length && this.dropSpare(made)) {
      /* dropSpare가 하나씩 뺀다 */
    }
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    const padX = (zw - cols * (size + gap) + gap) / 2;
    const padY = (zh - rows * (size + gap) + gap) / 2;
    made.forEach((c, i) => {
      const s = slots[i % Math.max(1, slots.length)] ?? 0;
      c.x = padX + (s % cols) * (size + gap);
      c.y = padY + Math.floor(s / cols) * (size + gap);
      const a = Math.random() * Math.PI * 2;
      const sp = 9 + Math.random() * 7;
      c.vx = Math.cos(a) * sp;
      c.vy = Math.sin(a) * sp;
      this.render(c);
      c.el.classList.add('fresh');
    });
  }

  private slotOf(c: JamoChip, cols: number, rows: number, size: number, gap: number): number {
    const col = Math.min(cols - 1, Math.max(0, Math.round(c.x / (size + gap))));
    const row = Math.min(rows - 1, Math.max(0, Math.round(c.y / (size + gap))));
    return row * cols + col;
  }

  private makeChip(jamo: string): JamoChip {
    const el = document.createElement('button');
    el.className = 'jamo-chip';
    el.textContent = jamo;
    el.dataset.jamo = jamo;
    el.setAttribute('aria-label', jamo);
    const c: JamoChip = { id: `j${++this.seq}`, jamo, el, x: 0, y: 0, vx: 0, vy: 0, placed: null, frozenUntil: 0 };
    el.dataset.id = c.id;
    this.zone.appendChild(el);
    this.bindPointer(c);
    this.chips.push(c);
    return c;
  }

  private render(c: JamoChip, dx = 0, dy = 0): void {
    c.el.style.transform = `translate(${c.x + dx}px, ${c.y + dy}px)`;
  }

  private startLoop(): void {
    this.stopLoop();
    this.lastT = 0;
    const step = (t: number) => {
      this.raf = requestAnimationFrame(step);
      const dt = this.lastT ? Math.min(0.05, (t - this.lastT) / 1000) : 0;
      this.lastT = t;
      if (this.paused || !this.setupData?.motion || dt === 0 || t < this.globalFreezeUntil || this.drag) return;
      this.stepMotion(dt, t);
    };
    this.raf = requestAnimationFrame(step);
  }

  stopLoop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private stepMotion(dt: number, now: number): void {
    const zw = this.zone.clientWidth;
    const zh = this.zone.clientHeight;
    const size = this.chipSize();
    const free = this.chips.filter((c) => !c.placed);
    for (const c of free) {
      if (now < c.frozenUntil) continue;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      if (c.x < 0) (c.x = 0), (c.vx = Math.abs(c.vx));
      if (c.y < 0) (c.y = 0), (c.vy = Math.abs(c.vy));
      if (c.x > zw - size) (c.x = zw - size), (c.vx = -Math.abs(c.vx));
      if (c.y > zh - size) (c.y = zh - size), (c.vy = -Math.abs(c.vy));
    }
    // 서로 겹치지 않게 밀어낸다
    const minD = size + 8;
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = free[i];
        const b = free[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d < minD) {
          const push = (minD - d) / 2;
          const nx = dx / d;
          const ny = dy / d;
          const aFrozen = now < a.frozenUntil;
          const bFrozen = now < b.frozenUntil;
          if (!aFrozen) (a.x -= nx * push * (bFrozen ? 2 : 1)), (a.y -= ny * push * (bFrozen ? 2 : 1));
          if (!bFrozen) (b.x += nx * push * (aFrozen ? 2 : 1)), (b.y += ny * push * (aFrozen ? 2 : 1));
          [a.vx, b.vx] = [b.vx, a.vx];
          [a.vy, b.vy] = [b.vy, a.vy];
        }
      }
    }
    for (const c of free) {
      c.x = Math.max(0, Math.min(zw - size, c.x));
      c.y = Math.max(0, Math.min(zh - size, c.y));
      this.render(c);
    }
  }

  // ───────────── 넣기·빼기 ─────────────

  private tapChip(c: JamoChip): void {
    if (!this.canAct()) return;
    this.cb.onInteract();
    if (c.placed) {
      if (this.frames[c.placed.frame]?.done) return;
      this.unplace(c);
      sfx.play('unplace');
      return;
    }
    // 탭만으로는 넣지 않는다: 칩을 살짝 흔들고 차례인 칸을 깜빡여 끌어다 놓을 곳을 알려준다
    this.nudge(c.el);
    this.blinkExpected();
    this.cb.onTapOnly();
  }

  private nudge(el: HTMLElement): void {
    el.classList.remove('nope');
    void el.offsetWidth;
    el.classList.add('nope');
    setTimeout(() => el.classList.remove('nope'), 500);
  }

  private blinkExpected(): void {
    const e = this.expected();
    if (!e) return;
    const cell = this.frames[e.frame].cells[e.role]!;
    cell.classList.remove('blink');
    void cell.offsetWidth;
    cell.classList.add('blink');
    setTimeout(() => cell.classList.remove('blink'), 900);
  }

  /** 다음에 넣을 칸: 음절 차례대로, 한 음절 안에서는 초성 → 중성 → 종성 */
  private expected(): { frame: number; role: CellRole } | null {
    const fi = this.frames.findIndex((f, i) => !f.done && this.frameEnabled(i));
    if (fi < 0) return null;
    const f = this.frames[fi];
    const role = cellsOf(f.spec).find((r) => !f.fill[r]);
    return role ? { frame: fi, role } : null;
  }

  private tapCell(f: FrameView, role: CellRole): void {
    if (!this.canAct() || f.done) return;
    const idx = this.frames.indexOf(f);
    if (!this.frameEnabled(idx)) return;
    this.cb.onInteract();
    const occupant = f.chips[role];
    if (occupant) {
      this.unplace(occupant);
      sfx.play('unplace');
    } else this.blinkExpected();
    this.refreshFrameStates();
  }

  private frameEnabled(i: number): boolean {
    if (!this.setupData) return false;
    if (this.frames[i]?.done) return false;
    if (!this.setupData.sequential) return true;
    return i === this.firstUndone();
  }

  private firstUndone(): number {
    return this.frames.findIndex((f) => !f.done);
  }

  private place(c: JamoChip, frameIndex: number, role: CellRole): void {
    const f = this.frames[frameIndex];
    const old = f.chips[role];
    if (old && old !== c) this.unplace(old, true);
    if (c.placed) this.clearPlacement(c);
    const from = c.el.getBoundingClientRect();
    c.placed = { frame: frameIndex, role };
    f.chips[role] = c;
    f.fill[role] = c.jamo;
    c.el.style.transform = '';
    c.el.classList.add('in-cell');
    c.el.classList.remove('pulse');
    f.cells[role]!.appendChild(c.el);
    this.flip(c.el, from);
    sfx.play('snap');
    this.hideHand();
    this.activeFrame = frameIndex;
    this.activeCell = nextEmptyCell(f.spec, f.fill);
    this.refreshFrameStates();
    this.cb.onPlaced(this.filledFraction());
    const result = checkFrame(f.spec, f.fill);
    if (result.kind !== 'incomplete') void this.resolveFrame(frameIndex, result);
  }

  private clearPlacement(c: JamoChip): void {
    if (!c.placed) return;
    const f = this.frames[c.placed.frame];
    delete f.chips[c.placed.role];
    delete f.fill[c.placed.role];
    c.placed = null;
  }

  private unplace(c: JamoChip, silent = false): void {
    if (!c.placed) return;
    const from = c.el.getBoundingClientRect();
    const fi = c.placed.frame;
    const role = c.placed.role;
    this.clearPlacement(c);
    c.el.classList.remove('in-cell');
    this.zone.appendChild(c.el);
    // 영역 안 빈 자리로 돌아간다
    const zr = this.zone.getBoundingClientRect();
    const size = this.chipSize();
    c.x = Math.max(0, Math.min(this.zone.clientWidth - size, from.left - zr.left));
    c.y = Math.max(0, Math.min(this.zone.clientHeight - size, this.zone.clientHeight - size));
    c.frozenUntil = performance.now() + 500;
    this.render(c);
    this.flip(c.el, from);
    if (!silent) {
      this.activeFrame = fi;
      this.activeCell = role;
    }
    this.refreshFrameStates();
    this.cb.onPlaced(this.filledFraction());
  }

  private filledFraction(): number {
    const total = this.frames.reduce((n, f) => n + cellsOf(f.spec).length, 0);
    const filled = this.frames.reduce((n, f) => n + (f.done ? cellsOf(f.spec).length : Object.keys(f.fill).length), 0);
    return total ? filled / total : 0;
  }

  private refreshFrameStates(): void {
    // 활성 칸은 언제나 순서상 차례인 칸
    const e = this.expected();
    this.activeFrame = e ? e.frame : this.activeFrame;
    this.activeCell = e ? e.role : null;
    this.frames.forEach((f, i) => {
      const enabled = this.frameEnabled(i);
      f.el.classList.toggle('waiting', !enabled && !f.done);
      f.el.classList.toggle('active', enabled && i === this.activeFrame);
      for (const role of cellsOf(f.spec)) {
        f.cells[role]!.classList.toggle('active', enabled && i === this.activeFrame && role === this.activeCell && !f.fill[role]);
        f.cells[role]!.classList.toggle('filled', !!f.fill[role]);
      }
    });
  }

  private flip(el: HTMLElement, from: DOMRect): void {
    const to = el.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    if (Math.abs(dx) + Math.abs(dy) < 1) return;
    const base = el.style.transform || '';
    el.animate([{ transform: `translate(${dx}px, ${dy}px) ${base}` }, { transform: `translate(0px, 0px) ${base}` }], { duration: 220, easing: 'cubic-bezier(.2,.9,.3,1.15)' });
  }

  // ───────────── 판정 ─────────────

  private async resolveFrame(i: number, result: FrameResult): Promise<void> {
    const f = this.frames[i];
    this.cb.onFrameResult(i, result);
    if (result.kind === 'correct') {
      // 맞은 음절은 바로 잠그고 다음 음절로 넘어간다: 아이가 쉬지 않고 이어서 끌어 넣어도 입력을 버리지 않는다
      f.done = true;
      const next = this.firstUndone();
      if (next >= 0) {
        this.activeFrame = next;
        this.activeCell = nextEmptyCell(this.frames[next].spec, this.frames[next].fill);
      } else this.busy = true;
      this.refreshFrameStates();
      await delay(180);
      // 올바른 완성형 글자로 정돈된다
      f.el.classList.add('done');
      sfx.play('energy');
      await delay(260);
      if (next < 0) {
        this.busy = false;
        this.cb.onWordComplete();
        return;
      }
      if (this.setupData?.sequential && this.firstUndone() === next) {
        // 앞 음절의 남은 방해 자모를 치우고 다음 음절 자모를 공급한다
        for (const c of this.chips.filter((x) => !x.placed)) this.removeChip(c);
        this.spawnChips(this.setupData.supply[next]);
      }
      this.refreshFrameStates();
      return;
    }
    this.busy = true;
    // 다른 글자: 벌점 없이 살짝 흔들고 자모를 돌려보낸다
    sfx.play('reject');
    f.el.classList.remove('shake');
    void f.el.offsetWidth;
    f.el.classList.add('shake');
    await delay(650);
    f.el.classList.remove('shake');
    for (const role of cellsOf(f.spec)) {
      const c = f.chips[role];
      if (c) this.unplace(c, true);
    }
    this.activeFrame = i;
    this.activeCell = nextEmptyCell(f.spec, f.fill);
    this.refreshFrameStates();
    this.busy = false;
  }

  showConnected(color: string): void {
    this.framesEl.style.setProperty('--c', color);
    this.framesEl.classList.add('connected');
    sfx.play('connect');
  }

  /** list 안에서 지금 필요 없는 칩(방해 자모) 하나를 치운다 */
  private dropSpare(list: JamoChip[]): boolean {
    const counts = new Map<string, number>();
    for (const j of this.neededNow()) counts.set(j, (counts.get(j) ?? 0) + 1);
    for (const c of this.chips.filter((x) => !x.placed && !list.includes(x))) {
      const n = counts.get(c.jamo) ?? 0;
      if (n > 0) counts.set(c.jamo, n - 1);
    }
    const spare = list.filter((c) => {
      const n = counts.get(c.jamo) ?? 0;
      if (n > 0) {
        counts.set(c.jamo, n - 1);
        return false;
      }
      return true;
    });
    // 화면이 좁아도 함정은 남긴다 (칩이 조금 겹쳐 떠다니는 편이 함정이 없는 것보다 낫다)
    if (spare.length <= MIN_TRAPS) return false;
    const victim = spare[spare.length - 1];
    list.splice(list.indexOf(victim), 1);
    this.removeChip(victim);
    return true;
  }

  /** 남은 방해 자모 하나를 치운다 (계속 막힐 때) */
  reduceChoices(): boolean {
    const needed = this.neededNow();
    // 틀린 칸에 잠깐 들어가 있는 함정(판정 뒤 돌아올 칩)도 함정 수에 센다
    const wrongPlaced = (c: JamoChip) => !!c.placed && this.frames[c.placed.frame]?.spec[c.placed.role] !== c.jamo;
    const spare = [...this.chips.filter((c) => !c.placed), ...this.chips.filter(wrongPlaced)];
    const counts = new Map<string, number>();
    for (const j of needed) counts.set(j, (counts.get(j) ?? 0) + 1);
    const extra = spare.filter((c) => {
      const n = counts.get(c.jamo) ?? 0;
      if (n > 0) {
        counts.set(c.jamo, n - 1);
        return false;
      }
      return true;
    });
    // 함정은 모두 치우지 않는다 (사용자 지시: 함정이 꼭 몇 개는 나오게)
    const victim = extra.find((c) => !c.placed);
    if (extra.length <= MIN_TRAPS || !victim) return false;
    this.removeChip(victim);
    return true;
  }

  private neededNow(): string[] {
    const idx = this.setupData?.sequential ? [this.firstUndone()] : this.frames.map((_, i) => i);
    return idx
      .filter((i) => i >= 0 && !this.frames[i].done)
      .flatMap((i) => {
        const f = this.frames[i];
        return cellsOf(f.spec).filter((r) => f.fill[r] !== f.spec[r]).map((r) => f.spec[r]);
      });
  }

  private removeChip(c: JamoChip): void {
    this.chips = this.chips.filter((x) => x !== c);
    c.el.classList.add('leaving');
    setTimeout(() => c.el.remove(), 300);
  }

  // ───────────── 도움: 다음 자모 강조 + 손가락 시범 ─────────────

  /** 다음에 넣을 자모와 칸을 알려준다. 알려줬으면 true. */
  showNextHint(): boolean {
    const fi = this.firstUndone();
    const f = this.frames[fi];
    if (!f) return false;
    // 잘못 놓인 칸이 있으면 먼저 그 칸을 비우게 한다
    let role = cellsOf(f.spec).find((r) => f.fill[r] && f.fill[r] !== f.spec[r]) ?? null;
    if (role) {
      const c = f.chips[role]!;
      this.pointHand(c.el, null);
      return true;
    }
    role = cellsOf(f.spec).find((r) => !f.fill[r]) ?? null;
    if (!role) return false;
    const want = f.spec[role];
    const chip = this.chips.find((c) => !c.placed && c.jamo === want);
    if (!chip) return false;
    this.refreshFrameStates();
    chip.frozenUntil = performance.now() + 4000;
    chip.el.classList.add('pulse');
    this.pointHand(chip.el, f.cells[role]!);
    return true;
  }

  private pointHand(fromEl: HTMLElement, toEl: HTMLElement | null): void {
    const place = () => {
      const a = fromEl.getBoundingClientRect();
      const b = (toEl ?? fromEl).getBoundingClientRect();
      this.handEl.style.setProperty('--x0', `${a.left + a.width * 0.5 - 22}px`);
      this.handEl.style.setProperty('--y0', `${a.top + a.height * 0.5 - 8}px`);
      this.handEl.style.setProperty('--x1', `${b.left + b.width * 0.5 - 22}px`);
      this.handEl.style.setProperty('--y1', `${b.top + b.height * 0.5 - 8}px`);
      this.handEl.classList.toggle('drag-demo', !!toEl);
    };
    this.handEl.hidden = false;
    place();
    if (this.handTimer) clearTimeout(this.handTimer);
    const follow = () => {
      if (this.handEl.hidden) return;
      place();
      this.handTimer = setTimeout(follow, 300);
    };
    this.handTimer = setTimeout(follow, 300);
  }

  hideHand(): void {
    this.handEl.hidden = true;
    if (this.handTimer) clearTimeout(this.handTimer);
    this.handTimer = null;
    this.chips.forEach((c) => c.el.classList.remove('pulse'));
  }

  // ───────────── 끌어서 놓기 ─────────────

  private drag: { chip: JamoChip; pointerId: number; sx: number; sy: number; active: boolean } | null = null;

  private bindPointer(c: JamoChip): void {
    const el = c.el;
    el.addEventListener('pointerdown', (e) => {
      if (!this.canAct() || this.drag) return;
      if (c.placed && this.frames[c.placed.frame]?.done) return;
      e.preventDefault();
      // 손을 대면 이 칩은 즉시 멈추고, 주변 칩도 잠시 멈춘다
      c.frozenUntil = Number.POSITIVE_INFINITY;
      this.globalFreezeUntil = performance.now() + 100000;
      this.drag = { chip: c, pointerId: e.pointerId, sx: e.clientX, sy: e.clientY, active: false };
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d || d.pointerId !== e.pointerId) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.active && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        d.active = true;
        el.classList.add('dragging');
        if (c.placed) {
          // 칸에 있던 칩을 끌어내면 영역으로 옮긴 뒤 이어서 끈다
          const r = el.getBoundingClientRect();
          this.unplace(c, true);
          const zr = this.zone.getBoundingClientRect();
          c.x = r.left - zr.left;
          c.y = r.top - zr.top;
          d.sx = e.clientX;
          d.sy = e.clientY;
        }
      }
      if (d.active) {
        this.render(c, e.clientX - d.sx, e.clientY - d.sy);
        this.highlightDrop(e.clientX, e.clientY, c.jamo);
      }
    });
    const end = (e: PointerEvent, cancelled: boolean) => {
      const d = this.drag;
      if (!d || d.pointerId !== e.pointerId) return;
      this.drag = null;
      el.classList.remove('dragging');
      this.clearDropHighlight();
      this.releaseFreeze(c);
      if (!d.active) {
        if (!cancelled) this.tapChip(c);
        return;
      }
      const moved = { dx: e.clientX - d.sx, dy: e.clientY - d.sy };
      if (!cancelled && this.canAct()) {
        this.cb.onInteract();
        const target = this.dropTarget(e.clientX, e.clientY, c.jamo);
        if (target) {
          this.place(c, target.frame, target.role);
          return;
        }
        // 차례가 아닌 칸이나 맞지 않는 칸에 놓았으면: 돌려보내고 차례인 칸을 알려준다
        if (this.overFrames(e.clientX, e.clientY)) {
          sfx.play('reject');
          this.blinkExpected();
        }
      }
      // 칸 밖이면 취소: 영역 안 제자리로 부드럽게 돌아간다
      const from = el.getBoundingClientRect();
      this.render(c);
      void moved;
      this.flip(el, from);
    };
    el.addEventListener('pointerup', (e) => end(e, false));
    el.addEventListener('pointercancel', (e) => end(e, true));
  }

  private releaseFreeze(c: JamoChip): void {
    const now = performance.now();
    c.frozenUntil = now + 1200;
    this.globalFreezeUntil = now + 700;
  }

  private cancelDrag(): void {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    d.chip.el.classList.remove('dragging');
    this.clearDropHighlight();
    this.releaseFreeze(d.chip);
    if (!d.chip.placed) this.render(d.chip);
  }

  /** 차례인 칸 위(조금 벗어난 곳까지)에, 그 칸이 받을 수 있는 자모(자음/모음)를 놓았을 때만 그 칸 */
  private dropTarget(x: number, y: number, jamo: string): { frame: number; role: CellRole } | null {
    const e = this.expected();
    if (!e || !canHold(e.role, jamo)) return null;
    const r = this.frames[e.frame].cells[e.role]!.getBoundingClientRect();
    const t = DROP_TOLERANCE;
    return x >= r.left - t && x <= r.right + t && y >= r.top - t && y <= r.bottom + t ? e : null;
  }

  private overFrames(x: number, y: number): boolean {
    return this.frames.some((f) => {
      const r = f.el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
  }

  private highlightDrop(x: number, y: number, jamo: string): void {
    const t = this.dropTarget(x, y, jamo);
    this.frames.forEach((f, i) => {
      for (const role of cellsOf(f.spec)) f.cells[role]!.classList.toggle('drop-hover', !!t && t.frame === i && t.role === role);
    });
  }

  private clearDropHighlight(): void {
    this.frames.forEach((f) => cellsOf(f.spec).forEach((r) => f.cells[r]!.classList.remove('drop-hover')));
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
