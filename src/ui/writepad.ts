// 따라 쓰기 판: 필살기 에너지가 가득 찼을 때 끌어 넣기 대신 손가락으로 글자를 직접 쓴다 (2026-09-28 사용자 지시).
// 아이가 한글을 거의 모르므로 흐린 글자 위를 획 순서대로 따라 쓴다: 지금 획만 밝게, 시작점(초록 점)과 방향(화살표)을 보여 준다.
// 판정은 core/writing.ts. 같은 획을 여러 번 못 따라가면 대신 그려 주고 넘어간다 (진행을 막지 않는다).
import { judgeStroke, TRACE_CONFIG, syllableStrokes, type PlacedStroke, type Pt } from '../core/writing';
import { options, sfx } from '../game/services';

export interface WritePadCallbacks {
  /** 한 음절을 다 썼을 때 (그 음절 소리를 읽는다) */
  onSyllableDone: (index: number) => void;
  onWordDone: () => void;
  onInteract: () => void;
}

const SVGNS = 'http://www.w3.org/2000/svg';

interface WBox {
  el: SVGSVGElement;
  strokes: PlacedStroke[];
  guides: SVGPathElement[];
  ink: SVGGElement;
  marks: SVGGElement;
  demo: SVGCircleElement;
}

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const pathD = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');

export class WritePad {
  private boxes: WBox[] = [];
  private cur = 0;
  private k = 0;
  /** 지금 획을 위해 그은 선들 (한 획을 나눠 그어도 이어서 판정) */
  private segments: Pt[][] = [];
  private segPaths: SVGPathElement[] = [];
  private fails = 0;
  private locked = true;
  private drawing: { id: number; pts: Pt[]; path: SVGPathElement; unlisten: () => void } | null = null;
  private demoRaf = 0;
  /** 대신 그려 준 획 수 (도움 받음) */
  autoStrokes = 0;
  misses = 0;

  constructor(
    private root: HTMLElement,
    private cb: WritePadCallbacks,
  ) {
    root.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('resize', () => this.fit());
    window.addEventListener('hd-layout', () => this.fit());
  }

  /** 단어의 음절들로 판을 만든다. 쓸 수 없는 음절이 있으면 false. */
  setup(syllables: string[], color: string): boolean {
    const all = syllables.map((s) => syllableStrokes(s));
    if (all.some((x) => !x)) return false;
    this.stopDemo();
    this.cancelDraw();
    this.root.innerHTML = '';
    this.root.style.setProperty('--wc', color);
    this.boxes = all.map((strokes) => this.makeBox(strokes!));
    this.cur = 0;
    this.k = 0;
    this.segments = [];
    this.segPaths = [];
    this.fails = 0;
    this.autoStrokes = 0;
    this.misses = 0;
    this.locked = true;
    this.refresh();
    requestAnimationFrame(() => this.fit());
    return true;
  }

  private makeBox(strokes: PlacedStroke[]): WBox {
    const el = svg('svg', { viewBox: '-4 -4 108 108', class: 'wbox' });
    const grid = svg('g', { class: 'grid' });
    grid.append(svg('rect', { x: -2, y: -2, width: 104, height: 104, rx: 10 }), svg('path', { d: 'M50 -2V102M-2 50H102' }));
    const guideG = svg('g', { class: 'guides' });
    const guides = strokes.map((s) => {
      const p = svg('path', { d: pathD(s.pts) });
      guideG.append(p);
      return p;
    });
    const marks = svg('g', { class: 'marks' });
    const ink = svg('g', { class: 'ink' });
    const demo = svg('circle', { class: 'demo', r: 6, cx: -50, cy: -50 });
    el.append(grid, guideG, marks, ink, demo);
    this.root.append(el);
    return { el, strokes, guides, ink, marks, demo };
  }

  /** 음절 칸 크기: 판 높이와 너비 안에서 가장 크게 (음절이 많으면 작아진다) */
  fit(): void {
    const n = this.boxes.length;
    if (!n || this.root.hidden) return;
    const w = this.root.clientWidth;
    const h = this.root.clientHeight;
    const gap = 8;
    const size = Math.max(60, Math.floor(Math.min(h - 6, (w - gap * (n - 1)) / n, 240)));
    for (const b of this.boxes) {
      b.el.style.width = `${size}px`;
      b.el.style.height = `${size}px`;
    }
  }

  lock(): void {
    this.locked = true;
    this.cancelDraw();
    this.stopDemo();
  }

  unlock(): void {
    this.locked = false;
  }

  boxRects(): DOMRect[] {
    return this.boxes.map((b) => b.el.getBoundingClientRect());
  }

  get done(): boolean {
    return this.cur >= this.boxes.length;
  }

  private get stroke(): PlacedStroke | null {
    return this.boxes[this.cur]?.strokes[this.k] ?? null;
  }

  /** 자동 테스트용: 지금 획을 화면 좌표로 */
  strokeClientPoints(): { x: number; y: number }[] | null {
    const s = this.stroke;
    if (!s) return null;
    return s.pts.map((p) => this.toClient(p));
  }

  private toClient([x, y]: Pt): { x: number; y: number } {
    const r = this.boxes[this.cur].el.getBoundingClientRect();
    // viewBox가 -4~104 (108칸)
    return { x: r.left + ((x + 4) / 108) * r.width, y: r.top + ((y + 4) / 108) * r.height };
  }

  private toBox(cx: number, cy: number): Pt {
    const r = this.boxes[this.cur].el.getBoundingClientRect();
    return [((cx - r.left) / r.width) * 108 - 4, ((cy - r.top) / r.height) * 108 - 4];
  }

  // ───────────── 표시 ─────────────

  private refresh(): void {
    this.boxes.forEach((b, i) => {
      b.el.classList.toggle('now', i === this.cur);
      b.el.classList.toggle('done', i < this.cur);
      b.guides.forEach((g, j) => g.setAttribute('class', i < this.cur || (i === this.cur && j < this.k) ? 'done' : i === this.cur && j === this.k ? 'now' : 'todo'));
      b.marks.innerHTML = '';
    });
    const s = this.stroke;
    if (!s) return;
    const b = this.boxes[this.cur];
    // 시작점(초록 점)과 끝 방향 화살표. ㅇ처럼 닫힌 획은 시작점만.
    const [sx, sy] = s.pts[0];
    b.marks.append(svg('circle', { class: 'start', cx: sx, cy: sy, r: 6.5 }));
    if (!s.closed) {
      const a = s.pts[s.pts.length - 2];
      const e = s.pts[s.pts.length - 1];
      const ang = (Math.atan2(e[1] - a[1], e[0] - a[0]) * 180) / Math.PI;
      b.marks.append(svg('path', { class: 'arrow', d: 'M0 0L-9 -6L-9 6Z', transform: `translate(${e[0].toFixed(1)} ${e[1].toFixed(1)}) rotate(${ang.toFixed(0)})` }));
    }
  }

  /** 지금 획을 점이 따라가며 보여 준다 (처음, 틀렸을 때, 도움 버튼, 가만히 있을 때) */
  showDemo(): Promise<void> {
    this.stopDemo();
    const s = this.stroke;
    if (!s) return Promise.resolve();
    const dot = this.boxes[this.cur].demo;
    const pts = s.pts;
    const seg: number[] = [0];
    for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = seg[seg.length - 1] || 1;
    const dur = Math.max(450, total * 9) / options.speed;
    const t0 = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const d = Math.min(1, (now - t0) / dur) * total;
        let i = 1;
        while (i < seg.length - 1 && seg[i] < d) i++;
        const f = seg[i] - seg[i - 1] ? (d - seg[i - 1]) / (seg[i] - seg[i - 1]) : 1;
        dot.setAttribute('cx', (pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f).toFixed(1));
        dot.setAttribute('cy', (pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f).toFixed(1));
        dot.classList.add('on');
        if (d < total) this.demoRaf = requestAnimationFrame(step);
        else {
          this.demoRaf = requestAnimationFrame(() => dot.classList.remove('on'));
          resolve();
        }
      };
      this.demoRaf = requestAnimationFrame(step);
    });
  }

  private stopDemo(): void {
    cancelAnimationFrame(this.demoRaf);
    this.boxes.forEach((b) => b.demo.classList.remove('on'));
  }

  // ───────────── 손가락으로 쓰기 ─────────────

  private down(e: PointerEvent): void {
    if (this.locked || this.done || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    this.cancelDraw();
    this.stopDemo();
    const id = e.pointerId;
    const path = svg('path', { class: 'live' });
    this.boxes[this.cur].ink.append(path);
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== id || !this.drawing) return;
      const p = this.toBox(ev.clientX, ev.clientY);
      const last = this.drawing.pts[this.drawing.pts.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 1) return;
      this.drawing.pts.push(p);
      path.setAttribute('d', pathD(this.drawing.pts));
    };
    const up = (ev: PointerEvent) => ev.pointerId === id && this.up(false);
    const cancel = (ev: PointerEvent) => ev.pointerId === id && this.up(true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    const unlisten = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
    this.drawing = { id, pts: [this.toBox(e.clientX, e.clientY)], path, unlisten };
    path.setAttribute('d', pathD(this.drawing.pts));
    this.cb.onInteract();
  }

  private cancelDraw(): void {
    if (!this.drawing) return;
    this.drawing.unlisten();
    this.drawing.path.remove();
    this.drawing = null;
  }

  private up(cancelled: boolean): void {
    const d = this.drawing;
    if (!d) return;
    this.drawing = null;
    d.unlisten();
    const s = this.stroke;
    if (cancelled || this.locked || !s) {
      d.path.remove();
      return;
    }
    this.cb.onInteract();
    this.segments.push(d.pts);
    const v = judgeStroke(s, this.segments);
    if (v.kind === 'tap') {
      this.segments.pop();
      d.path.remove();
      void this.showDemo();
      return;
    }
    if (v.kind === 'miss') {
      this.segments.pop();
      this.misses++;
      this.fails++;
      d.path.setAttribute('class', 'bad');
      setTimeout(() => d.path.remove(), 380);
      sfx.play('reject');
      if (this.fails >= TRACE_CONFIG.maxFails) void this.autoStroke();
      else void this.showDemo();
      return;
    }
    this.segPaths.push(d.path);
    d.path.setAttribute('class', 'kept');
    if (v.kind === 'partial') {
      sfx.play('place');
      return;
    }
    sfx.play('snap');
    this.completeStroke();
  }

  /** 여러 번 못 따라간 획은 점이 그려 주고 넘어간다 */
  private async autoStroke(): Promise<void> {
    this.locked = true;
    this.autoStrokes++;
    await this.showDemo();
    this.locked = false;
    sfx.play('snap');
    this.completeStroke();
  }

  private completeStroke(): void {
    this.segPaths.forEach((p) => p.remove());
    this.segPaths = [];
    this.segments = [];
    this.fails = 0;
    this.k++;
    const b = this.boxes[this.cur];
    if (this.k >= b.strokes.length) {
      const i = this.cur;
      this.cur++;
      this.k = 0;
      this.refresh();
      b.el.classList.add('flash');
      this.cb.onSyllableDone(i);
      if (this.done) {
        this.locked = true;
        this.cb.onWordDone();
      }
      return;
    }
    this.refresh();
  }
}
