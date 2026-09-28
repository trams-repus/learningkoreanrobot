// 전투 장면 표현. 규칙(피해·체력)은 core/battle.ts가 정하고, 이 장면은 연출만 한다.
// 구도: 로봇 뒷모습은 왼쪽 아래, 적 앞모습은 오른쪽 위. 로봇 공격은 ↗, 적 공격은 ↙.
// 모든 대기는 장면 시계(tween/delayedCall)를 쓰므로 일시정지하면 연출과 흐름이 함께 멈춘다.
import Phaser from 'phaser';
import type { FoeKind } from '../core/types';
import type { AttackTier } from '../core/combo';
import { drawBackground, drawGauge, makeBoss, makeCharger, makeDino, makeGuard, makeImp, makeMissile, makeRobot, makeTextures, makeWarning, PAL, type FoeParts, type RobotParts } from './art';
import { sfx, options } from '../game/services';

const W = 400;
const H = 300;
const ROBOT = { x: 112, y: 330 };
const FOE = { x: 300, y: 128 };
const MAX_BLASTS = 14;

export interface SceneHooks {
  onRobotHp: (hp: number) => void;
  onFoeHp: (hp: number, max: number) => void;
}

export class BattleScene extends Phaser.Scene {
  hooks: SceneHooks = { onRobotHp: () => {}, onFoeHp: () => {} };
  reduceEffects = false;

  private world!: Phaser.GameObjects.Container;
  private fx!: Phaser.GameObjects.Container;
  private foeLayer!: Phaser.GameObjects.Container;
  private robot!: RobotParts;
  private foe: FoeParts | null = null;
  private foeKind: FoeKind = 'dino';
  private foeMax = 1;
  private foeIdle: Phaser.Tweens.Tween[] = [];
  private warn: Phaser.GameObjects.Container | null = null;
  private guardFx: Phaser.GameObjects.Container | null = null;
  private pending = new Set<() => void>();
  private robotIdle: Phaser.Tweens.Tween[] = [];
  private fxCam!: Phaser.Cameras.Scene2D.Camera;
  private k = 1;
  private dpr = 1;
  private rect = { x: 0, y: 0, w: 1, h: 1 };
  private blasts = 0;
  private chargeColor = PAL.visor;
  ready: Promise<void>;
  private markReady!: () => void;

  constructor() {
    super('battle');
    this.ready = new Promise((r) => (this.markReady = r));
  }

  create(): void {
    makeTextures(this);
    this.tweens.timeScale = options.speed;
    this.time.timeScale = options.speed;
    this.world = this.add.container(0, 0);
    this.fx = this.add.container(0, 0);
    this.fxCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.ignore(this.fx);
    this.fxCam.ignore(this.world);

    this.world.add(drawBackground(this, { x: FOE.x, y: FOE.y + 4 }, { x: ROBOT.x, y: ROBOT.y - 14 }));
    this.foeLayer = this.add.container(0, 0);
    this.world.add(this.foeLayer);
    this.robot = makeRobot(this);
    this.robot.root.setPosition(ROBOT.x, ROBOT.y);
    this.world.add(this.robot.root);
    drawGauge(this.robot.gauge, 0);
    this.startRobotIdle();
    this.markReady();
  }

  // ───────────── 배치 ─────────────

  /** 전투 영역(CSS px)에 맞춰 세계를 배치. 좌우는 조금 잘려도 되고, 로봇은 늘 아래에 붙는다. */
  layout(rect: { x: number; y: number; w: number; h: number }, dpr: number): void {
    if (!this.world) return;
    this.dpr = dpr;
    this.rect = rect;
    const bw = rect.w * dpr;
    const bh = rect.h * dpr;
    this.cameras.main.setViewport(Math.round(rect.x * dpr), Math.round(rect.y * dpr), Math.max(1, Math.round(bw)), Math.max(1, Math.round(bh)));
    this.fxCam.setViewport(0, 0, this.scale.width, this.scale.height);
    this.k = Math.min((bw * 1.12) / W, bh / H);
    this.world.setScale(this.k);
    this.world.setPosition((bw - W * this.k) / 2, bh - H * this.k);
  }

  /** 세계 좌표 → 캔버스 전체 좌표 (fx 층) */
  private toScreen(x: number, y: number): { x: number; y: number } {
    return { x: this.rect.x * this.dpr + this.world.x + x * this.k, y: this.rect.y * this.dpr + this.world.y + y * this.k };
  }

  // ───────────── 기다리기 도구 ─────────────

  wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const done = () => {
        this.pending.delete(done);
        resolve();
      };
      this.pending.add(done);
      this.time.delayedCall(ms, done);
    });
  }

  private tween(cfg: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
    return new Promise((resolve) => {
      const done = () => {
        this.pending.delete(done);
        resolve();
      };
      this.pending.add(done);
      this.tweens.add({ ...cfg, onComplete: done });
    });
  }

  /** 진행 중 연출을 모두 끊는다. 기다리던 흐름은 풀려나고, 호출한 쪽이 세대 번호로 무시한다. */
  abortAll(): void {
    this.tweens.killAll();
    this.time.removeAllEvents();
    const list = [...this.pending];
    this.pending.clear();
    list.forEach((f) => f());
  }

  private burst(layer: 'world' | 'fx', x: number, y: number, tex: string, o: { color: number | number[]; count: number; speed?: number; scale?: number; life?: number; gravity?: number }): void {
    const count = Math.max(1, this.reduceEffects ? Math.ceil(o.count / 3) : o.count);
    const e = this.add.particles(0, 0, tex, {
      speed: { min: (o.speed ?? 120) * 0.4, max: o.speed ?? 120 },
      scale: { start: (o.scale ?? 0.3) * (layer === 'fx' ? this.dpr : 1), end: 0 },
      lifespan: o.life ?? 500,
      tint: o.color,
      gravityY: o.gravity ?? 0,
      emitting: false,
    });
    (layer === 'fx' ? this.fx : this.world).add(e);
    e.explode(count, x, y);
    this.time.delayedCall((o.life ?? 500) + 100, () => e.destroy());
  }

  private shake(intensity = 0.005, ms = 150): void {
    if (this.reduceEffects) return;
    this.cameras.main.shake(ms, intensity);
  }

  /** 만화풍 폭발 (연출 전용: 피해 계산과 무관). 동시에 너무 많이 만들지 않는다. */
  private blast(x: number, y: number, size = 1): void {
    if (this.blasts >= MAX_BLASTS) return;
    this.blasts++;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xff7a2e, 1);
    g.fillCircle(0, 0, 16);
    g.fillStyle(0xffd23f, 1);
    g.fillCircle(0, 0, 11);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(0, 0, 5);
    c.add(g);
    c.setScale(0.2 * size);
    this.world.add(c);
    this.tweens.add({
      targets: c,
      scale: 1.3 * size,
      alpha: 0,
      duration: 380,
      ease: 'Quad.out',
      onComplete: () => {
        c.destroy();
        this.blasts--;
      },
    });
    this.burst('world', x, y, 'star', { color: [0xffffff, 0xffd23f, 0xff7a2e], count: 7, speed: 150 * size, scale: 0.25 * size, life: 360 });
    this.burst('world', x, y, 'dot', { color: [0x8a8a8a, 0xb0b0b0], count: 4, speed: 40, scale: 0.4 * size, life: 700, gravity: -60 });
  }

  // ───────────── 로봇 ─────────────

  private startRobotIdle(): void {
    this.robotIdle.forEach((t) => t.remove());
    const r = this.robot;
    r.body.y = 0;
    this.robotIdle = [
      this.tweens.add({ targets: r.body, y: 3, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
      this.tweens.add({ targets: r.head, angle: 3, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
      this.tweens.add({ targets: r.leftArm, angle: 3, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
    ];
  }

  /** 자모를 넣을수록 등 게이지가 차오른다 */
  setCharge(frac: number, color?: string): void {
    if (!this.robot) return;

    if (color) this.chargeColor = Phaser.Display.Color.HexStringToColor(color).color;
    drawGauge(this.robot.gauge, frac, this.chargeColor);
    this.tweens.add({ targets: this.robot.gun, rotation: -0.25 * frac, duration: 200 });
    this.robot.barrel.setScale(1, 0.15 + frac * 0.35);
  }

  resetBattle(robotHp: number): void {
    this.abortAll();
    this.foe?.root.destroy();
    this.foe = null;
    this.foeLayer.removeAll(true);
    this.warn = null;
    this.guardFx?.destroy();
    this.guardFx = null;
    this.fx.removeAll(true);
    this.blasts = 0;
    this.cameras.main.resetFX();
    const r = this.robot;
    r.root.setPosition(ROBOT.x, ROBOT.y).setAngle(0);
    r.gun.setRotation(0);
    r.barrel.setScale(1, 0.15);
    r.hatch.setAngle(0);
    r.muzzleGlow.setAlpha(0);
    r.thrustL.setAlpha(0);
    r.thrustR.setAlpha(0);
    r.visor.setAlpha(1);
    this.chargeColor = PAL.visor;
    this.setCharge(0);
    this.startRobotIdle();
    this.hooks.onRobotHp(robotHp);
  }

  private aimAngle(): number {
    const s = this.robot.gunShoulder;
    const from = { x: ROBOT.x + s.x, y: ROBOT.y + s.y };
    const to = this.foeCenter();
    return Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2;
  }

  /** 팔 방향으로 포구 위치 (세계 좌표) */
  private muzzle(): { x: number; y: number } {
    const s = this.robot.gunShoulder;
    const a = this.robot.gun.rotation + Math.PI / 2;
    const len = 122 * this.robot.barrel.scaleY + 62 * (1 - this.robot.barrel.scaleY);
    return { x: ROBOT.x + s.x + Math.cos(a) * len, y: ROBOT.y + this.robot.body.y + s.y + Math.sin(a) * len };
  }

  private foeCenter(): { x: number; y: number } {
    const f = this.foe;
    const scale = f ? f.root.scaleY : 1;
    return { x: FOE.x, y: FOE.y - (f ? f.height * 0.5 * scale : 50) };
  }

  // ───────────── 적 ─────────────

  async spawnFoe(kind: FoeKind, hp: number, max: number): Promise<void> {
    this.foe?.root.destroy();
    this.foeKind = kind;
    this.foeMax = max;
    const parts = kind === 'dino' ? makeDino(this) : kind === 'imp' ? makeImp(this) : kind === 'charger' ? makeCharger(this) : makeBoss(this);
    const scale = kind === 'boss' ? 0.7 : 0.95;
    parts.root.setPosition(FOE.x, FOE.y - 260).setScale(scale);
    this.foeLayer.add(parts.root);
    this.foe = parts;
    this.hooks.onFoeHp(hp, max);
    // 위에서 쿵 떨어지며 등장
    await this.tween({ targets: parts.root, y: FOE.y, duration: kind === 'boss' ? 700 : 480, ease: 'Bounce.out' });
    sfx.play('step');
    this.shake(kind === 'boss' ? 0.012 : 0.006, kind === 'boss' ? 350 : 160);
    this.burst('world', FOE.x, FOE.y, 'dot', { color: 0xd9c49a, count: 10, speed: 110, scale: 0.4, life: 500, gravity: -30 });
    if (kind === 'boss') await this.roar(800);
    this.startFoeIdle();
  }

  private startFoeIdle(): void {
    const f = this.foe;
    if (!f) return;
    this.foeIdle.forEach((t) => t.remove());
    f.body.setPosition(0, 0).setAngle(0).setScale(1);
    this.foeIdle = [
      this.tweens.add({ targets: f.body, scaleY: 1.03, y: -2, duration: this.foeKind === 'imp' ? 400 : 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
      this.tweens.add({ targets: f.head, angle: 3, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
    ];
  }

  private async roar(ms: number): Promise<void> {
    const f = this.foe;
    if (!f) return;
    sfx.play('roar');
    if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 1, duration: 150, yoyo: true, hold: ms - 300 });
    this.tweens.add({ targets: f.head, y: f.head.y - 4, duration: 150, yoyo: true, hold: ms - 300 });
    this.shake(0.004, ms * 0.6);
    await this.wait(ms);
  }

  /** 공격 준비 (예고): 빛나는 기운, 경고 표시, 몸을 웅크림. 조합하는 동안 계속 보이지만 피해는 없다. */
  setCharging(on: boolean): void {
    const f = this.foe;
    if (!f) return;
    this.tweens.killTweensOf(f.aura);
    this.warn?.destroy();
    this.warn = null;
    if (!on) {
      f.aura.setAlpha(0);
      if (f.jaw) f.jaw.setScale(1, 0.4);
      return;
    }
    f.aura.setAlpha(0.6);
    this.tweens.add({ targets: f.aura, alpha: 1, scale: 1.12, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const w = makeWarning(this);
    w.setPosition(FOE.x + 44, FOE.y - f.height * f.root.scaleY - 12);
    this.world.add(w);
    this.warn = w;
    this.tweens.add({ targets: w, y: w.y - 6, duration: 320, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 0.8, duration: 300 });
  }

  /** 아이가 오래 막혀 있으면 로봇이 방어막을 편다 (연출 전용) */
  guard(on: boolean): void {
    if (on && !this.guardFx) {
      const g = makeGuard(this);
      g.setPosition(ROBOT.x + 70, ROBOT.y - 150).setScale(0.2).setAlpha(0);
      this.world.add(g);
      this.guardFx = g;
      this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 400, ease: 'Back.out' });
      sfx.play('deploy');
    } else if (!on && this.guardFx) {
      const g = this.guardFx;
      this.guardFx = null;
      this.tweens.add({ targets: g, alpha: 0, scale: 1.2, duration: 300, onComplete: () => g.destroy() });
    }
  }

  // ───────────── 단어 → 에너지 전송 ─────────────

  /** 조립틀의 글자가 한 단어로 합쳐진 뒤 에너지가 되어 로봇 등 게이지로 들어간다. */
  async playTransfer(text: string[], rects: DOMRect[], color: string): Promise<void> {
    const col = Phaser.Display.Color.HexStringToColor(color).color;
    const target = this.toScreen(ROBOT.x + this.robot.gaugeCenter.x, ROBOT.y + this.robot.gaugeCenter.y);
    const glyphs = text.map((t, i) => {
      const r = rects[i];
      const size = Math.round(r.height * 0.7 * this.dpr);
      const tx = this.add
        .text((r.x + r.width / 2) * this.dpr, (r.y + r.height / 2) * this.dpr, t, {
          fontFamily: 'HDFont, sans-serif',
          fontStyle: '900',
          fontSize: `${size}px`,
          color: '#ffffff',
          stroke: color,
          strokeThickness: Math.max(4, size * 0.12),
        })
        .setOrigin(0.5);
      this.fx.add(tx);
      return tx;
    });
    const trail = this.add.particles(0, 0, 'dot', {
      follow: glyphs[0],
      lifespan: 320,
      scale: { start: 0.35 * this.dpr, end: 0 },
      tint: [col, 0xffffff],
      frequency: this.reduceEffects ? 60 : 16,
      speed: 20,
    });
    this.fx.add(trail);
    sfx.play('whoosh');
    await Promise.all(
      glyphs.map((g, i) =>
        this.tween({ targets: g, x: target.x + (i - (glyphs.length - 1) / 2) * 8, y: target.y, scale: 0.2, alpha: 0.7, duration: 420, ease: 'Cubic.in' }),
      ),
    );
    trail.stop();
    this.time.delayedCall(400, () => trail.destroy());
    glyphs.forEach((g) => g.destroy());
    this.burst('fx', target.x, target.y, 'dot', { color: [col, 0xffffff], count: 14, speed: 150 * this.dpr, scale: 0.3, life: 360 });
    this.setCharge(1);
  }

  // ───────────── 로봇 공격 (콤보 단계별) ─────────────

  /**
   * 콤보 단계에 따라 눈에 띄게 다른 공격. 피해는 호출한 쪽이 이미 한 번 계산했고,
   * 여기서는 마지막 명중 순간에 체력 표시를 바꾼다.
   */
  async attack(tier: AttackTier, hpAfter: number, defeated: boolean): Promise<void> {
    if (!this.foe) return;
    this.robotIdle.forEach((t) => t.pause());
    const r = this.robot;
    this.guard(false);
    this.setCharging(false);
    // 무장 전개: 팔을 적 쪽(↗)으로 들고 포신을 편다
    sfx.play('deploy');
    await Promise.all([
      this.tween({ targets: r.gun, rotation: this.aimAngle(), duration: 200, ease: 'Back.out' }),
      this.tween({ targets: r.barrel, scaleY: 1, duration: 240, ease: 'Back.out' }),
    ]);

    if (tier === 'basic') {
      await this.fireShell(1.1, true);
    } else if (tier === 'rapid') {
      for (let i = 0; i < 3; i++) {
        await this.fireShell(0.9, i === 2, i * 10 - 10);
        await this.wait(60);
      }
    } else if (tier === 'missiles') {
      await this.openPod(true);
      const shots = [this.fireMissiles(), this.wait(150).then(() => this.fireShell(1.1, false))];
      await Promise.all(shots);
      await this.stagger();
      await this.openPod(false);
    } else {
      await this.finisher();
    }

    this.hooks.onFoeHp(hpAfter, this.foeMax);
    if (defeated) await this.defeatFoe();
    await Promise.all([
      this.tween({ targets: r.gun, rotation: 0, duration: 300, delay: 120 }),
      this.tween({ targets: r.barrel, scaleY: 0.15, duration: 300, delay: 120 }),
    ]);
    r.muzzleGlow.setAlpha(0);
    this.setCharge(0);
    this.robotIdle.forEach((t) => t.resume());
  }

  private async fireShell(size: number, big: boolean, spread = 0): Promise<void> {
    const r = this.robot;
    r.muzzleGlow.setScale(0.3).setAlpha(1);
    sfx.play('charge');
    await this.tween({ targets: r.muzzleGlow, scale: 1.2, duration: big ? 220 : 110, ease: 'Quad.in' });
    sfx.play('cannon');
    r.muzzleGlow.setAlpha(0);
    const m = this.muzzle();
    this.burst('world', m.x, m.y, 'star', { color: [0xffffff, 0xffd23f], count: 8, speed: 130, scale: 0.3, life: 200 });
    // 발사 반동: 몸과 팔이 뒤로 밀린다 (뒷모습에서도 보이게 아래·왼쪽으로)
    this.tweens.add({ targets: r.root, x: ROBOT.x - 8, y: ROBOT.y + 5, duration: 70, yoyo: true, ease: 'Quad.out' });
    this.tweens.add({ targets: r.gun, rotation: r.gun.rotation + 0.18, duration: 70, yoyo: true });
    r.thrustL.setAlpha(1);
    r.thrustR.setAlpha(1);
    this.tweens.add({ targets: [r.thrustL, r.thrustR], alpha: 0, duration: 260 });
    this.shake(0.003, 80);

    const t = this.foeCenter();
    const tx = t.x + spread;
    const ty = t.y + spread * 0.5;
    const shell = this.add.container(m.x, m.y);
    const sg = this.add.graphics();
    sg.fillStyle(0x2a2f3a, 1);
    sg.fillCircle(0, 0, 7 * size);
    sg.fillStyle(0xffd23f, 1);
    sg.fillCircle(-2, -2, 3 * size);
    shell.add(sg);
    this.world.add(shell);
    const trail = this.add.particles(0, 0, 'dot', { follow: shell, lifespan: 200, scale: { start: 0.25 * size, end: 0 }, tint: [0xffd23f, 0xff8c42], frequency: this.reduceEffects ? 50 : 14 });
    this.world.add(trail);
    // 원근감: 멀어질수록 작아진다
    await this.tween({ targets: shell, x: tx, y: ty, scale: 0.6, duration: 260, ease: 'Sine.in' });
    trail.stop();
    this.time.delayedCall(300, () => trail.destroy());
    shell.destroy();
    sfx.play(big ? 'explode' : 'hit');
    this.blast(tx, ty, big ? 1.4 : 0.9);
    this.hitReact(big);
  }

  private hitReact(big: boolean): void {
    const f = this.foe;
    if (!f) return;
    this.foeIdle.forEach((t) => t.pause());
    f.body.setScale(1.1, 0.88);
    this.tweens.add({ targets: f.body, scaleX: 1, scaleY: 1, duration: 240, ease: 'Back.out' });
    // 맞으면 뒤(↗)로 살짝 밀린다
    this.tweens.add({ targets: f.root, x: FOE.x + (big ? 14 : 7), y: FOE.y - (big ? 6 : 3), duration: 80, yoyo: true, ease: 'Quad.out', onComplete: () => this.foeIdle.forEach((t) => t.resume()) });
    this.tweens.add({ targets: f.root, alpha: 0.5, duration: 50, yoyo: true, repeat: big ? 1 : 0 });
    if (big) this.shake(0.006, 140);
  }

  private async openPod(open: boolean): Promise<void> {
    sfx.play('deploy');
    await this.tween({ targets: this.robot.hatch, angle: open ? -110 : 0, duration: 200, ease: 'Back.out' });
  }

  private async fireMissiles(): Promise<void> {
    const r = this.robot;
    const t = this.foeCenter();
    const flights = r.podMouths.map(async (mouth, i) => {
      await this.wait(i * 110);
      const sx = ROBOT.x + r.pod.x + mouth.x * r.pod.scaleX;
      const sy = ROBOT.y + r.body.y + r.pod.y + mouth.y * r.pod.scaleY;
      const m = makeMissile(this);
      m.setPosition(sx, sy);
      this.world.add(m);
      sfx.play('missile');
      const trail = this.add.particles(0, 0, 'dot', { follow: m, lifespan: 260, scale: { start: 0.22, end: 0 }, tint: [0xffffff, 0xcfd6e6], frequency: this.reduceEffects ? 60 : 20 });
      this.world.add(trail);
      // 서로 다른 탄도: 위로 솟았다가 휘어 들어간다
      const ex = t.x + (i - 1.5) * 16;
      const ey = t.y + (i % 2 ? 10 : -12);
      const curve = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(sx, sy), new Phaser.Math.Vector2(sx - 40 + i * 40, sy - 150 - i * 15), new Phaser.Math.Vector2(ex, ey));
      const p = { t: 0 };
      await this.tween({
        targets: p,
        t: 1,
        duration: 520 + i * 40,
        ease: 'Sine.in',
        onUpdate: () => {
          const pt = curve.getPoint(p.t);
          const tan = curve.getTangent(p.t);
          m.setPosition(pt.x, pt.y);
          m.setRotation(Math.atan2(tan.y, tan.x) + Math.PI / 2);
          m.setScale(1 - p.t * 0.4);
        },
      });
      trail.stop();
      this.time.delayedCall(300, () => trail.destroy());
      m.destroy();
      sfx.play('explode');
      this.blast(ex, ey, 1);
      this.hitReact(false);
    });
    await Promise.all(flights);
  }

  private async stagger(): Promise<void> {
    const f = this.foe;
    if (!f) return;
    // 연속 타격으로 자세를 잃는다
    await this.tween({ targets: f.body, angle: 12, duration: 120, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
  }

  private async finisher(): Promise<void> {
    const r = this.robot;
    await this.openPod(true);
    // 힘 모으기: 에너지가 포구로 빨려 든다
    sfx.play('charge');
    const m = this.muzzle();
    r.muzzleGlow.setScale(0.2).setAlpha(1);
    for (let i = 0; i < (this.reduceEffects ? 4 : 10); i++) {
      const a = (i / 10) * Math.PI * 2;
      const d = this.add.image(m.x + Math.cos(a) * 60, m.y + Math.sin(a) * 60, 'dot').setTint(0x5cf2ff).setScale(0.3);
      this.world.add(d);
      this.tweens.add({ targets: d, x: m.x, y: m.y, scale: 0.05, duration: 500, delay: i * 25, onComplete: () => d.destroy() });
    }
    await this.tween({ targets: r.muzzleGlow, scale: 2.4, duration: 650, ease: 'Quad.in' });
    // 대형 에너지 포격
    sfx.play('beam');
    const t = this.foeCenter();
    const beam = this.add.graphics();
    const len = Math.hypot(t.x - m.x, t.y - m.y);
    beam.fillStyle(0x5cf2ff, 0.55);
    beam.fillRoundedRect(0, -16, len, 32, 16);
    beam.fillStyle(0xffffff, 1);
    beam.fillRoundedRect(0, -7, len, 14, 7);
    beam.setPosition(m.x, m.y).setRotation(Math.atan2(t.y - m.y, t.x - m.x)).setScale(0, 1);
    this.world.add(beam);
    this.tweens.add({ targets: r.root, x: ROBOT.x - 14, y: ROBOT.y + 8, duration: 120, yoyo: true, hold: 500 });
    r.thrustL.setAlpha(1);
    r.thrustR.setAlpha(1);
    await this.tween({ targets: beam, scaleX: 1, duration: 150, ease: 'Quad.out' });
    this.missilesFromPod(t);
    // 적 주변 연쇄 폭발 (피해는 이미 한 번만 계산됨)
    const spots = this.reduceEffects ? 4 : 8;
    for (let i = 0; i < spots; i++) {
      const a = (i / spots) * Math.PI * 2;
      this.time.delayedCall(i * 70, () => {
        sfx.play(i % 2 ? 'hit' : 'explode');
        this.blast(t.x + Math.cos(a) * 34, t.y + Math.sin(a) * 26, 1.1);
        this.hitReact(i === spots - 1);
      });
    }
    await this.wait(spots * 70 + 120);
    await this.tween({ targets: beam, scaleY: 0, alpha: 0, duration: 200 });
    beam.destroy();
    r.muzzleGlow.setAlpha(0);
    this.tweens.add({ targets: [r.thrustL, r.thrustR], alpha: 0, duration: 300 });
    // 마무리 충격파
    sfx.play('bigExplode');
    this.blast(t.x, t.y, 2);
    const ring = this.add.graphics();
    ring.lineStyle(6, 0xffffff, 1);
    ring.strokeEllipse(0, 0, 60, 24);
    ring.setPosition(FOE.x, FOE.y);
    this.world.add(ring);
    this.shake(0.012, 300);
    await Promise.all([this.tween({ targets: ring, scaleX: 4, scaleY: 3, alpha: 0, duration: 520, ease: 'Quad.out' }), this.stagger()]);
    ring.destroy();
    await this.openPod(false);
  }

  private missilesFromPod(t: { x: number; y: number }): void {
    // 필살기 중 보조 미사일 (연출만)
    const r = this.robot;
    r.podMouths.forEach((mouth, i) => {
      const sx = ROBOT.x + r.pod.x + mouth.x;
      const sy = ROBOT.y + r.pod.y + mouth.y;
      const m = makeMissile(this);
      m.setPosition(sx, sy);
      this.world.add(m);
      this.tweens.add({
        targets: m,
        x: t.x + (i - 1.5) * 22,
        y: t.y - 20 + (i % 2) * 30,
        scale: 0.6,
        duration: 380 + i * 50,
        ease: 'Sine.in',
        onComplete: () => {
          m.destroy();
          this.blast(t.x + (i - 1.5) * 22, t.y - 20 + (i % 2) * 30, 0.9);
        },
      });
    });
  }

  private async defeatFoe(): Promise<void> {
    const f = this.foe;
    if (!f) return;
    this.foe = null;
    this.foeIdle.forEach((t) => t.remove());
    this.setCharging(false);
    sfx.play('pop');
    // 어지러운 별 → 뒤로 도망치며 사라진다 (피나 고통 표현 없음)
    const stars = this.add.container(0, -f.height - 10);
    for (let i = 0; i < 3; i++) stars.add(this.add.image(Math.cos((i * 2 * Math.PI) / 3) * 18, Math.sin((i * 2 * Math.PI) / 3) * 6, 'star').setScale(0.35).setTint(0xffe066));
    f.root.add(stars);
    this.tweens.add({ targets: stars, angle: 360, duration: 600, repeat: -1 });
    await this.tween({ targets: f.body, angle: -14, duration: 160, yoyo: true, repeat: 2 });
    await this.tween({ targets: f.root, x: FOE.x + 140, y: FOE.y - 50, scale: f.root.scaleX * 0.4, alpha: 0, duration: 700, ease: 'Quad.in' });
    f.root.destroy();
  }

  // ───────────── 적 공격 (↙) ─────────────

  async foeAttack(damage: number, hpAfter: number): Promise<void> {
    const f = this.foe;
    if (!f) return;
    this.setCharging(false);
    this.foeIdle.forEach((t) => t.pause());
    const target = { x: ROBOT.x + 20, y: ROBOT.y - 120 };
    const impact = () => {
      if (damage <= 0) {
        // 튜토리얼 적: 방어막이 막는다
        this.guard(true);
        sfx.play('block');
        this.burst('world', target.x + 40, target.y, 'star', { color: [0xe6d4ff, 0xffffff], count: 12, speed: 150, scale: 0.3, life: 380 });
        this.time.delayedCall(500, () => this.guard(false));
        return;
      }
      sfx.play('robotHit');
      this.blast(target.x, target.y, 1);
      this.shake(0.008, 200);
      const r = this.robot;
      this.tweens.add({ targets: r.root, x: ROBOT.x - 12, y: ROBOT.y + 6, duration: 90, yoyo: true });
      this.tweens.add({ targets: r.head, angle: -12, duration: 90, yoyo: true });
      this.tweens.add({ targets: r.visor, alpha: 0.2, duration: 70, yoyo: true, repeat: 1 });
      this.hooks.onRobotHp(hpAfter);
    };

    if (this.foeKind === 'dino' || this.foeKind === 'charger') {
      // 돌진: 대각선 아래로 달려들었다 돌아간다 (가까워질수록 커진다)
      const s = f.root.scaleX;
      await this.tween({ targets: f.body, angle: this.foeKind === 'charger' ? 8 : -6, duration: 140 });
      sfx.play('step');
      await this.tween({ targets: f.root, x: target.x + 70, y: target.y + 60, scale: s * 1.35, duration: 260, ease: 'Quad.in' });
      if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 1, duration: 80, yoyo: true });
      impact();
      await this.tween({ targets: f.root, x: FOE.x, y: FOE.y, scale: s, duration: 380, ease: 'Quad.out' });
    } else {
      // 발사체: 입에서 ↙ 방향으로
      if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 1, duration: 150, yoyo: true, hold: 200 });
      sfx.play('roar');
      await this.wait(200);
      const s = f.root.scaleX;
      const sx = FOE.x + f.mouth.x * s;
      const sy = FOE.y + f.mouth.y * s;
      const ball = this.add.graphics();
      ball.fillStyle(this.foeKind === 'boss' ? 0xff6a3d : 0xb06cff, 1);
      ball.fillCircle(0, 0, 12);
      ball.fillStyle(0xffe08a, 1);
      ball.fillCircle(-3, -3, 5);
      ball.setPosition(sx, sy).setScale(0.6);
      this.world.add(ball);
      const trail = this.add.particles(0, 0, 'dot', { follow: ball, lifespan: 260, scale: { start: 0.3, end: 0 }, tint: [0xff9d2e, 0xffe08a], frequency: this.reduceEffects ? 60 : 18 });
      this.world.add(trail);
      await this.tween({ targets: ball, x: target.x, y: target.y, scale: 1.4, duration: 420, ease: 'Sine.in' });
      trail.stop();
      this.time.delayedCall(300, () => trail.destroy());
      ball.destroy();
      impact();
    }
    await this.wait(250);
    this.startFoeIdle();
  }

  async reboot(hpAfter: number): Promise<void> {
    const r = this.robot;
    this.robotIdle.forEach((t) => t.pause());
    await Promise.all([this.tween({ targets: r.body, y: 14, angle: -5, duration: 380 }), this.tween({ targets: r.visor, alpha: 0, duration: 300 })]);
    await this.wait(250);
    sfx.play('reboot');
    this.guard(true);
    this.hooks.onRobotHp(hpAfter);
    await Promise.all([this.tween({ targets: r.body, y: 0, angle: 0, duration: 350, ease: 'Back.out' }), this.tween({ targets: r.visor, alpha: 1, duration: 200 })]);
    this.time.delayedCall(700, () => this.guard(false));
    this.robotIdle.forEach((t) => t.resume());
  }

  async celebrate(): Promise<void> {
    const r = this.robot;
    sfx.play('victory');
    this.robotIdle.forEach((t) => t.pause());
    this.tweens.add({ targets: r.gun, rotation: Math.PI - 0.3, duration: 300, ease: 'Back.out' });
    this.tweens.add({ targets: r.leftArm, angle: 160, duration: 300, ease: 'Back.out' });
    for (let i = 0; i < 2; i++) await this.tween({ targets: r.root, y: ROBOT.y - 16, duration: 220, yoyo: true, ease: 'Quad.out' });
    this.burst('world', ROBOT.x, ROBOT.y - 220, 'star', { color: [0xffd23f, 0x5cf2ff, 0xff7ab6, 0x7dff9a], count: 30, speed: 220, scale: 0.35, life: 1100, gravity: 250 });
    await this.wait(600);
    r.leftArm.setAngle(0);
    r.gun.setRotation(0);
  }
}
