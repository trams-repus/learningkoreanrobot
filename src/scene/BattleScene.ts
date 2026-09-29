// 전투 장면 표현. 규칙(피해·체력)은 core/battle.ts가 정하고, 이 장면은 연출만 한다.
// 구도: 플레이어(로봇 또는 마법소녀) 뒷모습은 왼쪽 아래, 적 앞모습은 오른쪽 위. 플레이어 공격은 ↗, 적 공격은 ↙.
// 두 캐릭터는 같은 자리·같은 규칙을 쓰고 그림과 효과만 다르다. 연출 길이는 비슷하게 맞춘다.
// 모든 대기는 장면 시계(tween/delayedCall)를 쓰므로 일시정지하면 연출과 흐름이 함께 멈춘다.
import Phaser from 'phaser';
import type { FoeKind } from '../core/types';
import type { AttackTier, Hit } from '../core/types';
import { drawBackground, drawGauge, makeArmor, makeBoss, makeCharger, makeChief, makeDino, makeFoeShield, makeGuard, makeImp, makeImpactStar, makeMissile, makeRobot, makeTextures, makeWarning, PAL, type FoeParts, type RobotParts } from './art';
import { sfx, options } from '../game/services';
import type { CharacterTheme } from '../content/characters';
import { drawMagicGauge, makeHealSigil, makeMagicCircle, makeMagicGirl, makeMagicShield, makeMeteor, makeStarBullet, MAG, type MagicParts } from './magicArt';

const W = 400;
const H = 300;
const ROBOT = { x: 112, y: 330 };
const FOE = { x: 300, y: 128 };
const MAX_BLASTS = 14;
/** 적 자리: 무리 크기별 (첫 자리의 적부터 조준한다). s = 크기 배율 (뒤쪽 적은 작게) */
// 좁은 화면에서는 세계 양옆이 조금 잘리므로(최대 약 24) 오른쪽 적은 x 335 안쪽에 둔다
const SLOTS: { x: number; y: number; s: number }[][] = [
  [{ x: 300, y: 128, s: 1 }],
  [{ x: 256, y: 136, s: 0.9 }, { x: 330, y: 110, s: 0.78 }],
  [{ x: 280, y: 138, s: 0.86 }, { x: 218, y: 112, s: 0.7 }, { x: 330, y: 104, s: 0.66 }],
];
const BASE_SCALE: Record<FoeKind, number> = { dino: 0.95, imp: 0.9, charger: 0.95, armor: 0.95, chief: 1.05, boss: 0.7 };
/** 명중 세기: 0 = 작은 탄, 1 = 큰 탄, 2 = 필살기 마무리 */
type Power = 0 | 1 | 2;
/** 명중 순간 멈춤(ms, 실제 시간). 짧아야 손맛이 나고 길면 끊겨 보인다. 임시값 */
const HIT_STOP: Record<Power, number> = { 0: 35, 1: 70, 2: 130 };

const FOE_ART: Record<FoeKind, (s: Phaser.Scene) => FoeParts> = { dino: makeDino, imp: makeImp, charger: makeCharger, armor: makeArmor, chief: makeChief, boss: makeBoss };

interface SceneFoe {
  id: number;
  kind: FoeKind;
  parts: FoeParts;
  x: number;
  y: number;
  scale: number;
  idle: Phaser.Tweens.Tween[];
  warn: Phaser.GameObjects.Container | null;
  shieldFx: Phaser.GameObjects.Container | null;
}

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
  private foes = new Map<number, SceneFoe>();
  private targetId = -1;
  private reticle: Phaser.GameObjects.Graphics | null = null;
  /** 공격 연출 크기 배율 (전투 단계가 오를수록 화려하게) */
  fxScale = 1;
  private guardFx: Phaser.GameObjects.Container | null = null;
  private pending = new Set<() => void>();
  private robotIdle: Phaser.Tweens.Tween[] = [];
  private magic!: MagicParts;
  private magicIdle: Phaser.Tweens.Tween[] = [];
  theme: CharacterTheme = 'robot';
  private fxCam!: Phaser.Cameras.Scene2D.Camera;
  private k = 1;
  private dpr = 1;
  private rect = { x: 0, y: 0, w: 1, h: 1 };
  private blasts = 0;
  private chargeColor = PAL.visor;
  /** 히트 스톱이 풀리는 시각 (게임 반복 시계, 0 = 멈춤 없음). 장면 시계는 멈춤 동안 느려지므로 따로 잰다. */
  private stopUntil = 0;
  private loopNow = 0;
  /** 필살기 조명 막 (중간에 끊겨도 resetBattle이 치운다) */
  private dimRect: Phaser.GameObjects.Rectangle | null = null;
  /** 명중 말풍선(쾅!·펑!)을 차례로 고른다: 무작위 없이 같은 상황에 같은 결과 */
  private words = 0;
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
    this.magic = makeMagicGirl(this);
    this.magic.root.setPosition(ROBOT.x, ROBOT.y).setVisible(false);
    this.world.add(this.magic.root);
    drawMagicGauge(this.magic.gauge, 0);
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
    this.endHitStop();
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
    size *= this.fxScale;
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

  /**
   * 명중 순간 아주 짧게 멈춘다 (히트 스톱). 장면 시계를 거의 세우고, 게임 반복 시계(update의 time)로 푼다:
   * 장면 시계로 풀면 느려진 만큼 멈춤도 길어진다. 일시정지하면 반복도 멈추므로 함께 멈춘다. 효과 줄이기에서는 하지 않는다.
   */
  private hitStop(ms: number): void {
    if (this.reduceEffects || ms <= 0) return;
    const slow = 0.05 * options.speed;
    this.tweens.timeScale = slow;
    this.time.timeScale = slow;
    this.stopUntil = Math.max(this.stopUntil, this.loopNow + ms / options.speed);
  }

  private endHitStop(): void {
    this.stopUntil = 0;
    this.tweens.timeScale = options.speed;
    this.time.timeScale = options.speed;
  }

  update(time: number): void {
    this.loopNow = time;
    if (this.stopUntil && time >= this.stopUntil) this.endHitStop();
  }

  /** 부위 안의 한 점 → 세계 좌표 (관절이 몇 마디든 실제 그려진 자리) */
  private worldPoint(part: Phaser.GameObjects.Container, x: number, y: number): { x: number; y: number } {
    const p = part.getWorldTransformMatrix().transformPoint(x, y, { x: 0, y: 0 });
    return this.world.pointToContainer(p) as Phaser.Math.Vector2;
  }

  /**
   * 명중: 효과음·멈춤·명중 별·말풍선·폭발·적 피격이 모두 이 한 순간에 맞춰 나온다.
   * 큰 명중은 뒤따라 작은 폭발이 시간차로 두 번 더 터진다 (연출 전용: 피해는 이미 한 번만 계산됨).
   */
  private landHit(x: number, y: number, power: Power, id = this.targetId): void {
    const magic = this.theme === 'magicalGirl';
    const color = magic ? (power === 2 ? MAG.glow : MAG.magic) : 0xffd23f;
    if (magic) sfx.play(power === 2 ? 'bigExplode' : 'magicHit');
    else sfx.play(power === 2 ? 'bigExplode' : power === 1 ? 'explode' : 'hit');
    this.hitStop(HIT_STOP[power]);
    const size = [0.9, 1.4, 2][power];
    if (magic) this.magicBlast(x, y, size, power === 1 ? MAG.magic : MAG.magic2);
    else this.blast(x, y, size);
    this.hitReact(power > 0, id);
    if (this.reduceEffects) return;
    const star = makeImpactStar(this, color);
    star.setPosition(x, y).setScale(0.3 * (power + 1) * 0.6).setAngle((this.words * 23) % 45);
    this.world.add(star);
    this.tweens.add({ targets: star, scale: 0.55 + power * 0.35, duration: 70, ease: 'Quad.out', onComplete: () => this.tweens.add({ targets: star, alpha: 0, scale: star.scale * 1.2, duration: 140, onComplete: () => star.destroy() }) });
    if (power > 0) {
      const list = magic ? ['팡!', '반짝!', '샤랑!'] : ['쾅!', '펑!', '콰광!'];
      const word = this.add
        .text(x + 26, y - 30, list[this.words++ % list.length], { fontFamily: 'HDFont, sans-serif', fontStyle: '900', fontSize: `${22 + power * 8}px`, color: '#ffffff', stroke: magic ? '#b0307e' : '#c2403a', strokeThickness: 7 })
        .setOrigin(0.5)
        .setAngle(-12)
        .setScale(0.3);
      this.world.add(word);
      this.tweens.add({ targets: word, scale: 1, y: word.y - 10, duration: 160, ease: 'Back.out' });
      this.tweens.add({ targets: word, alpha: 0, duration: 220, delay: 380, onComplete: () => word.destroy() });
      // 시간차 폭발
      for (let i = 0; i < 2; i++) {
        this.time.delayedCall(90 + i * 100, () => {
          const dx = (i ? -1 : 1) * (14 + power * 6);
          const dy = (i ? 8 : -10) * (1 + power * 0.3);
          if (magic) this.magicBlast(x + dx, y + dy, 0.6 + power * 0.2, i ? MAG.magic2 : MAG.glow);
          else this.blast(x + dx, y + dy, 0.6 + power * 0.2);
          sfx.play(magic ? 'sparkle' : 'hit');
        });
      }
    }
  }

  // ───────────── 로봇 ─────────────

  /** 선택한 캐릭터만 보이게 한다. 기록·규칙과는 무관한 그림 전환. */
  setTheme(t: CharacterTheme): void {
    this.theme = t;
    if (!this.robot) return;
    this.robot.root.setVisible(t === 'robot');
    this.magic.root.setVisible(t === 'magicalGirl');
    this.guard(false);
    this.setCharge(0);
    this.startRobotIdle();
  }

  private startRobotIdle(): void {
    this.magicIdle.forEach((t) => t.remove());
    const m = this.magic;
    m.body.y = 0;
    this.magicIdle = [
      this.tweens.add({ targets: m.body, y: 3, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
      this.tweens.add({ targets: m.ponytail, angle: 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
      this.tweens.add({ targets: m.leftArm, angle: 20, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
    ];
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
    if (this.theme === 'magicalGirl') {
      // 발밑 마법진이 켜지고, 마법봉을 조금씩 들며 끝이 빛난다
      drawMagicGauge(this.magic.gauge, frac, this.chargeColor);
      this.tweens.add({ targets: this.magic.arm, rotation: -0.5 - 0.5 * frac, duration: 200 });
      this.magic.tipGlow.setAlpha(frac * 0.7).setScale(0.4 + frac * 0.5);
      return;
    }
    drawGauge(this.robot.gauge, frac, this.chargeColor);
    this.tweens.add({ targets: this.robot.gun, rotation: -0.25 * frac, duration: 200 });
    this.robot.barrel.setScale(1, 0.15 + frac * 0.35);
  }

  resetBattle(robotHp: number): void {
    this.abortAll();
    this.clearFoes();
    this.foeLayer.removeAll(true);
    this.guardFx?.destroy();
    this.guardFx = null;
    this.drop(this.dimRect);
    this.dimRect = null;
    this.fx.removeAll(true);
    this.blasts = 0;
    this.cameras.main.resetFX();
    const r = this.robot;
    r.root.setPosition(ROBOT.x, ROBOT.y).setAngle(0);
    r.gun.setRotation(0);
    r.forearm.setRotation(0);
    r.fins.setScale(0.2, 1);
    r.leftArm.setAngle(0);
    r.leftFore.setAngle(0);
    r.wristGlow.setAlpha(0);
    r.legs.setScale(1);
    r.body.setAngle(0);
    r.head.setAngle(0);
    r.barrel.setScale(1, 0.15);
    r.hatch.setAngle(0);
    r.muzzleGlow.setAlpha(0);
    r.thrustL.setAlpha(0);
    r.thrustR.setAlpha(0);
    r.visor.setAlpha(1);
    const m = this.magic;
    m.root.setPosition(ROBOT.x, ROBOT.y).setAngle(0);
    m.body.setPosition(0, 0).setAngle(0);
    m.arm.setRotation(-0.5);
    m.leftArm.setAngle(14);
    m.tipGlow.setAlpha(0);
    m.skirt.setScale(1);
    m.ponytail.setAngle(0);
    this.guarding = false;
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

  /** 포구 위치 (세계 좌표): 어깨·팔꿈치를 거친 실제 자리. 포신이 접혀 있으면 그만큼 당긴다. */
  private muzzle(): { x: number; y: number } {
    const r = this.robot;
    return this.worldPoint(r.forearm, 0, 22 + 66 * r.barrel.scaleY);
  }

  /** 왼손목 광선총 끝 (세계 좌표) */
  private wrist(): { x: number; y: number } {
    return this.worldPoint(this.robot.leftFore, 0, 50);
  }

  /** 왼팔을 적에게 겨누는 각도 (어깨 기준, 0 = 아래) */
  private leftAim(): number {
    const r = this.robot;
    const from = this.worldPoint(r.body, r.leftArm.x, r.leftArm.y);
    const to = this.foeCenter();
    return Phaser.Math.RadToDeg(Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2);
  }

  private get tf(): SceneFoe | undefined {
    return this.foes.get(this.targetId);
  }

  private foeCenter(id = this.targetId): { x: number; y: number } {
    const f = this.foes.get(id);
    if (!f) return { x: FOE.x, y: FOE.y - 50 };
    return { x: f.x, y: f.y - f.parts.height * 0.5 * f.scale };
  }

  // ───────────── 적 ─────────────

  /** 적 무리 등장: 위에서 쿵 떨어진다 (여럿이면 시간차로). 보스는 포효한다. */
  async spawnWave(list: { id: number; kind: FoeKind; shield?: number }[], hp: number, max: number): Promise<void> {
    this.clearFoes();
    const slots = SLOTS[Math.min(SLOTS.length, list.length) - 1];
    this.hooks.onFoeHp(hp, max);
    const entries = list.slice(0, SLOTS.length).map((f, i) => {
      const slot = slots[i];
      const parts = FOE_ART[f.kind](this);
      const scale = BASE_SCALE[f.kind] * slot.s;
      parts.root.setPosition(slot.x, slot.y - 260).setScale(scale);
      const sf: SceneFoe = { id: f.id, kind: f.kind, parts, x: slot.x, y: slot.y, scale, idle: [], warn: null, shieldFx: null };
      this.foes.set(f.id, sf);
      return { sf, i, shield: f.shield ?? 0 };
    });
    // 뒤쪽(화면 위쪽) 적부터 그려 앞의 적이 가리지 않게 한다
    [...entries].sort((p, q) => p.sf.y - q.sf.y).forEach((e) => this.foeLayer.add(e.sf.parts.root));
    this.targetId = entries[0]?.sf.id ?? -1;
    const big = (k: FoeKind) => k === 'boss' || k === 'chief';
    await Promise.all(
      entries.map(async ({ sf, i, shield }) => {
        if (i) await this.wait(i * 160);
        await this.tween({ targets: sf.parts.root, y: sf.y, duration: big(sf.kind) ? 700 : 480, ease: 'Bounce.out' });
        sfx.play('step');
        this.shake(big(sf.kind) ? 0.012 : 0.006, big(sf.kind) ? 350 : 160);
        this.burst('world', sf.x, sf.y, 'dot', { color: 0xd9c49a, count: 10, speed: 110, scale: 0.4, life: 500, gravity: -30 });
        if (shield) this.setShield(sf.id, shield);
      }),
    );
    const boss = entries.find((e) => big(e.sf.kind));
    if (boss) await this.roar(boss.sf, 800);
    entries.forEach((e) => this.startFoeIdle(e.sf));
    this.updateReticle();
  }

  /** 한 마리만 (연출 확인용) */
  spawnFoe(kind: FoeKind, hp: number, max: number): Promise<void> {
    return this.spawnWave([{ id: 0, kind }], hp, max);
  }

  /**
   * 반복(repeat -1) 트윈이 걸린 객체는 트윈을 먼저 끊고 없앤다. 객체만 없애면 트윈이 남아 공격·준비 때마다 쌓인다
   * (390 휴대폰 멈춤 조사 중 확인: 공격 한 바퀴마다 트윈이 하나씩 늘었다, 2026-09-28).
   */
  private drop(o: Phaser.GameObjects.GameObject | null | undefined): void {
    if (!o) return;
    this.tweens.killTweensOf(o);
    o.destroy();
  }

  private clearFoes(): void {
    for (const f of this.foes.values()) {
      f.idle.forEach((t) => t.remove());
      this.drop(f.warn);
      this.drop(f.shieldFx);
      this.tweens.killTweensOf([f.parts.aura, f.parts.root, f.parts.body, f.parts.head]);
      f.parts.root.destroy();
    }
    this.foes.clear();
    this.targetId = -1;
    this.drop(this.reticle);
    this.reticle = null;
  }

  /** 로봇이 겨누는 적 (앞의 적이 쓰러지면 다음 적) */
  setTarget(id: number): void {
    this.targetId = id;
    this.updateReticle();
  }

  /** 조준 표시: 적이 여럿일 때 겨누는 적 발밑에 노란 고리 */
  private updateReticle(): void {
    const t = this.tf;
    if (!t || this.foes.size < 2) {
      this.reticle?.setVisible(false);
      return;
    }
    if (!this.reticle) {
      const g = this.add.graphics();
      g.lineStyle(4, 0xffd23f, 1);
      g.strokeEllipse(0, 0, 96, 24);
      g.lineStyle(2, 0xffffff, 0.9);
      g.strokeEllipse(0, 0, 78, 17);
      this.foeLayer.addAt(g, 0);
      this.reticle = g;
      this.tweens.add({ targets: g, alpha: 0.45, duration: 500, yoyo: true, repeat: -1 });
    }
    this.reticle.setVisible(true).setPosition(t.x, t.y + 2).setScale(t.scale / 0.95);
  }

  /** 종류마다 다른 대기 동작: 작은 괴물은 통통 뛰고, 뿔공룡은 발을 구르고, 갑옷 공룡은 꼬리를 흔들고, 보스는 무겁게 숨 쉰다 */
  private startFoeIdle(f: SceneFoe): void {
    f.idle.forEach((t) => t.remove());
    const p = f.parts;
    p.body.setPosition(0, 0).setAngle(0).setScale(1);
    p.tail?.setAngle(0);
    const d = (f.id % 3) * 130;
    const head = this.tweens.add({ targets: p.head, angle: 3, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    switch (f.kind) {
      case 'imp':
        f.idle = [this.tweens.add({ targets: p.body, y: -9, scaleY: 1.06, duration: 230, delay: d, yoyo: true, repeat: -1, repeatDelay: 260, ease: 'Quad.out' }), head];
        break;
      case 'charger':
      case 'chief':
        f.idle = [
          this.tweens.add({ targets: p.body, angle: -3, x: -2, duration: 380, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
          this.tweens.add({ targets: p.head, y: p.head.y + 3, duration: 380, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
        ];
        break;
      case 'armor':
        f.idle = [
          this.tweens.add({ targets: p.body, scaleY: 1.02, duration: 1400, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
          this.tweens.add({ targets: p.tail!, angle: 12, duration: 700, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
        ];
        break;
      case 'boss':
        f.idle = [this.tweens.add({ targets: p.body, scaleY: 1.03, angle: 2, duration: 1300, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }), head];
        break;
      default:
        f.idle = [this.tweens.add({ targets: p.body, scaleY: 1.03, y: -2, duration: 800, delay: d, yoyo: true, repeat: -1, ease: 'Sine.inOut' }), head];
    }
  }

  private async roar(f: SceneFoe, ms: number): Promise<void> {
    const p = f.parts;
    sfx.play('roar');
    if (p.jaw) this.tweens.add({ targets: p.jaw, scaleY: 1, duration: 150, yoyo: true, hold: ms - 300 });
    this.tweens.add({ targets: p.head, y: p.head.y - 4, duration: 150, yoyo: true, hold: ms - 300 });
    this.shake(0.004, ms * 0.6);
    await this.wait(ms);
  }

  /**
   * 공격 준비 (예고): 빛나는 기운, 경고 표시, 입을 벌림. 다음에 움직일 적 하나에만 띄운다.
   * level 2 = 강공격 직전 (붉은 두 겹 경고, 더 빠르게 번쩍). 조합하는 동안 계속 보이지만 피해는 없다.
   */
  setCharging(id: number | null, level = 1): void {
    for (const f of this.foes.values()) {
      this.tweens.killTweensOf(f.parts.aura);
      f.parts.aura.setAlpha(0);
      this.drop(f.warn);
      f.warn = null;
      if (f.parts.jaw) f.parts.jaw.setScale(1, 0.4);
    }
    const f = id === null ? undefined : this.foes.get(id);
    if (!f || level <= 0) return;
    const heavy = level >= 2;
    const a = f.parts.aura;
    a.setAlpha(0.6);
    this.tweens.add({ targets: a, alpha: 1, scale: a.scale * (heavy ? 1.25 : 1.12), duration: heavy ? 240 : 420, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const k = 1 / f.scale;
    const w = makeWarning(this, heavy);
    w.setPosition(44 * k, -f.parts.height - 12 * k).setScale(k);
    f.parts.root.add(w);
    f.warn = w;
    this.tweens.add({ targets: w, y: w.y - 6 * k, duration: heavy ? 200 : 320, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    if (f.parts.jaw) this.tweens.add({ targets: f.parts.jaw, scaleY: 0.8, duration: 300 });
    if (heavy) {
      sfx.play('roar');
      this.shake(0.004, 220);
    }
  }

  /** 적 방패 (n > 0이면 보인다). 깨질 때는 조각이 튄다. */
  setShield(id: number, n: number): void {
    const f = this.foes.get(id);
    if (!f) return;
    if (n > 0 && !f.shieldFx) {
      const k = 1 / f.scale;
      const g = makeFoeShield(this, 118 * k * f.scale * (f.parts.height / 110), 132 * k * f.scale * (f.parts.height / 110));
      g.setPosition(0, -f.parts.height * 0.5).setScale(0.2).setAlpha(0);
      f.parts.root.add(g);
      f.shieldFx = g;
      this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 300, ease: 'Back.out' });
    } else if (n <= 0 && f.shieldFx) {
      const g = f.shieldFx;
      f.shieldFx = null;
      const c = this.foeCenter(id);
      sfx.play('block');
      this.burst('world', c.x, c.y, 'star', { color: [0x7fc8ff, 0xffffff, 0x3b8fd9], count: 16, speed: 200, scale: 0.35, life: 520, gravity: 200 });
      this.tweens.add({ targets: g, scale: 1.4, alpha: 0, duration: 260, onComplete: () => g.destroy() });
    }
  }

  /** 방패가 공격을 막았다: 번쩍이고 흔들린다 */
  private shieldBlock(id: number): void {
    const f = this.foes.get(id);
    if (!f?.shieldFx) return;
    sfx.play('block');
    this.tweens.add({ targets: f.shieldFx, alpha: 0.4, duration: 60, yoyo: true, repeat: 2 });
  }

  /** 아이가 오래 막혀 있으면 로봇이 방어막을 편다 (연출 전용) */
  guard(on: boolean): void {
    this.guardPose(on);
    if (on && !this.guardFx) {
      const magic = this.theme === 'magicalGirl';
      const g = magic ? makeMagicShield(this) : makeGuard(this);
      g.setPosition(ROBOT.x + 70, ROBOT.y - 150).setScale(0.2).setAlpha(0);
      this.world.add(g);
      this.guardFx = g;
      this.tweens.add({ targets: g, scale: 1, alpha: 1, duration: 400, ease: 'Back.out' });
      sfx.play(magic ? 'magicShield' : 'deploy');
    } else if (!on && this.guardFx) {
      const g = this.guardFx;
      this.guardFx = null;
      this.tweens.add({ targets: g, alpha: 0, scale: 1.2, duration: 300, onComplete: () => g.destroy() });
    }
  }

  /** 방어 자세: 로봇은 왼팔을 앞으로 들어 막고, 마법소녀는 마법봉을 가로로 들어 막는다 */
  private guarding = false;

  private guardPose(on: boolean): void {
    if (!this.robot || on === this.guarding) return;
    this.guarding = on;
    if (this.theme === 'magicalGirl') {
      const m = this.magic;
      this.tweens.add({ targets: m.arm, rotation: on ? -1.9 : -0.5, duration: 200, ease: 'Back.out' });
      this.tweens.add({ targets: m.leftArm, angle: on ? -60 : 14, duration: 200, ease: 'Back.out' });
      return;
    }
    const r = this.robot;
    this.tweens.add({ targets: r.leftArm, angle: on ? -115 : 0, duration: 200, ease: 'Back.out' });
    this.tweens.add({ targets: r.leftFore, angle: on ? -55 : 0, duration: 200, ease: 'Back.out' });
    this.tweens.add({ targets: r.body, angle: on ? 3 : 0, duration: 200 });
  }

  // ───────────── 단어 → 에너지 전송 ─────────────

  /** 조립틀의 글자가 한 단어로 합쳐진 뒤 에너지가 되어 로봇 등 게이지로 들어간다. */
  async playTransfer(text: string[], rects: DOMRect[], color: string): Promise<void> {
    const col = Phaser.Display.Color.HexStringToColor(color).color;
    const gc = this.theme === 'magicalGirl' ? { x: this.magic.gemCenter.x * this.magic.root.scaleX, y: this.magic.gemCenter.y * this.magic.root.scaleY } : this.robot.gaugeCenter;
    const target = this.toScreen(ROBOT.x + gc.x, ROBOT.y + gc.y);
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

  /**
   * 직접 쓴 필살기: 아이가 쓴 글자가 전투 한가운데 크게 떠올라 빛난 뒤 로봇(마법소녀)에게 모인다.
   * 끝나면 attack('ultimate')로 최고 필살기를 쏜다 (2026-09-28 사용자 지시: 가득 차면 더 화려한 공격).
   */
  async specialCutIn(text: string[], color: string): Promise<void> {
    const r = this.rect;
    const d = this.dpr;
    const n = text.length;
    const size = Math.min(r.w / (n + 0.6), r.h * 0.42);
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.5;
    const magic = this.theme === 'magicalGirl';
    const gold = magic ? MAG.glow : 0xffd23f;
    const shade = this.add.rectangle(r.x * d, r.y * d, r.w * d, r.h * d, 0x0b1020, 0.55).setOrigin(0).setAlpha(0);
    const rays = this.add.graphics();
    rays.fillStyle(gold, 0.35);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const L = Math.max(r.w, r.h) * d;
      rays.fillTriangle(0, 0, Math.cos(a - 0.09) * L, Math.sin(a - 0.09) * L, Math.cos(a + 0.09) * L, Math.sin(a + 0.09) * L);
    }
    rays.setPosition(cx * d, cy * d).setScale(0.1).setAlpha(0);
    const label = this.add
      .text(cx * d, (cy - size * 0.78) * d, '필살기!', {
        fontFamily: 'HDFont, sans-serif',
        fontStyle: '900',
        fontSize: `${Math.round(size * 0.36 * d)}px`,
        color: magic ? '#ffd6f5' : '#ffe066',
        stroke: '#16203a',
        strokeThickness: Math.max(4, size * 0.07 * d),
      })
      .setOrigin(0.5)
      .setScale(0.2);
    const glyphs = text.map((t, i) =>
      this.add
        .text((cx + (i - (n - 1) / 2) * size) * d, cy * d, t, {
          fontFamily: 'HDFont, sans-serif',
          fontStyle: '900',
          fontSize: `${Math.round(size * d)}px`,
          color: '#ffffff',
          stroke: color,
          strokeThickness: Math.max(6, size * 0.12 * d),
        })
        .setOrigin(0.5)
        .setScale(0.2),
    );
    const all = [shade, rays, label, ...glyphs];
    all.forEach((o) => this.fx.add(o));
    sfx.play('energy');
    if (!this.reduceEffects) {
      this.cameras.main.flash(160, 255, 240, 180);
      this.tweens.add({ targets: rays, angle: 40, duration: 1000 });
    }
    await Promise.all([
      this.tween({ targets: shade, alpha: 1, duration: 180 }),
      this.tween({ targets: rays, alpha: this.reduceEffects ? 0 : 1, scale: 1, duration: 320, ease: 'Quad.out' }),
      this.tween({ targets: label, scale: 1, duration: 280, ease: 'Back.out' }),
      ...glyphs.map((g, i) => this.tween({ targets: g, scale: 1, duration: 320, delay: i * 90, ease: 'Back.out' })),
    ]);
    sfx.play(magic ? 'sparkle' : 'chime');
    this.burst('fx', cx * d, cy * d, 'star', { color: [gold, 0xffffff], count: 18, speed: 260 * d, scale: 0.4, life: 600 });
    await this.wait(520);
    this.tweens.killTweensOf(rays);
    await this.tween({ targets: [shade, rays, label], alpha: 0, duration: 160 });
    all.forEach((o) => o.destroy());
    // 같은 자리에서 playTransfer가 글자를 다시 만들어 로봇에게 날린다 (글꼴 크기 = 높이 × 0.7)
    const rects = text.map((_, i) => new DOMRect(cx + (i - (n - 1) / 2) * size - size / 2, cy - size / 0.7 / 2, size, size / 0.7));
    await this.playTransfer(text, rects, color);
  }

  // ───────────── 로봇 공격 (콤보 단계별) ─────────────

  /**
   * 콤보 단계에 따라 눈에 띄게 다른 공격. 피해는 호출한 쪽이 이미 한 번 계산했고,
   * 여기서는 마지막 명중 순간에 체력 표시를 바꾼다.
   */
  async attack(tier: AttackTier, hits: Hit[], hp: number, max: number, combo = 0): Promise<void> {
    if (!this.tf) return;
    if (this.theme === 'magicalGirl') return this.magicAttack(tier, hits, hp, max, combo);
    this.robotIdle.forEach((t) => t.pause());
    this.guard(false);
    this.setCharging(null);
    await this.robotCharge(tier === 'finisher' || tier === 'ultimate' ? 2 : tier === 'missiles' ? 1 : 0);
    await this.robotDeploy();

    if (tier === 'basic') {
      await this.fireShell(1.1, true);
    } else if (tier === 'rapid') {
      // 콤보 2: 대포 + 손목 광선총 2연타 / 콤보 3 이상: 대포 → 손목 → 대포 3연타
      await this.fireShell(0.9, false, -10);
      await this.wristShot();
      if (combo >= 3) await this.fireShell(1, true, 10);
    } else if (tier === 'missiles') {
      // 콤보 4: 미사일 한 번 + 대포 / 콤보 5 이상: 미사일 두 번(엇갈려) + 대포
      await this.openPod(true);
      const shots = [this.fireMissiles(0), this.wait(150).then(() => this.fireShell(1.1, true))];
      if (combo >= 5) shots.push(this.wait(420).then(() => this.fireMissiles(1)));
      await Promise.all(shots);
      await this.stagger();
      await this.openPod(false);
    } else {
      await this.finisher(tier === 'ultimate');
    }

    await this.applyHits(hits, hp, max);
    await this.robotRecover();
    this.setCharge(0);
    this.robotIdle.forEach((t) => t.resume());
  }

  /** 충전: 무릎을 굽혀 몸을 낮추고, 등 추진기가 깜빡이며 힘을 모은다 (level이 높을수록 깊고 길게) */
  private async robotCharge(level: 0 | 1 | 2): Promise<void> {
    const r = this.robot;
    sfx.play('charge');
    const ms = [100, 160, 260][level];
    r.thrustL.setAlpha(0.5);
    r.thrustR.setAlpha(0.5);
    this.tweens.add({ targets: [r.thrustL, r.thrustR], alpha: 0.15, duration: 60, yoyo: true, repeat: Math.round(ms / 120) });
    this.burst('world', ROBOT.x, ROBOT.y - 10, 'dot', { color: [0xd9c49a, 0xffffff], count: 4 + level * 3, speed: 60 + level * 30, scale: 0.35, life: 400, gravity: -40 });
    await Promise.all([
      this.tween({ targets: r.body, y: 6 + level * 3, duration: ms, ease: 'Quad.out' }),
      this.tween({ targets: r.legs, scaleY: 0.93 - level * 0.02, duration: ms, ease: 'Quad.out' }),
      this.tween({ targets: r.head, angle: 6, duration: ms }),
    ]);
  }

  /** 무장 전개: 몸을 펴며 대포 팔을 들고, 굽힌 팔꿈치를 뻗으며 포신과 냉각 날개를 편다. 왼팔은 버틴다. */
  private async robotDeploy(): Promise<void> {
    const r = this.robot;
    sfx.play('deploy');
    r.forearm.setRotation(0.7);
    await Promise.all([
      this.tween({ targets: r.body, y: 0, duration: 130, ease: 'Back.out' }),
      this.tween({ targets: r.legs, scaleY: 1, duration: 130, ease: 'Back.out' }),
      this.tween({ targets: r.head, angle: -2, duration: 130 }),
      this.tween({ targets: r.gun, rotation: this.aimAngle(), duration: 160, ease: 'Back.out' }),
      this.tween({ targets: r.forearm, rotation: 0, duration: 160, delay: 40, ease: 'Back.out' }),
      this.tween({ targets: r.barrel, scaleY: 1, duration: 170, delay: 40, ease: 'Back.out' }),
      this.tween({ targets: r.fins, scaleX: 1, duration: 150, delay: 60, ease: 'Back.out' }),
      this.tween({ targets: r.leftArm, angle: -24, duration: 160, ease: 'Back.out' }),
      this.tween({ targets: r.leftFore, angle: -30, duration: 160, ease: 'Back.out' }),
    ]);
  }

  private async robotRecover(): Promise<void> {
    const r = this.robot;
    await Promise.all([
      this.tween({ targets: r.gun, rotation: 0, duration: 300, delay: 120 }),
      this.tween({ targets: r.forearm, rotation: 0, duration: 260, delay: 120 }),
      this.tween({ targets: r.barrel, scaleY: 0.15, duration: 300, delay: 120 }),
      this.tween({ targets: r.fins, scaleX: 0.2, duration: 220, delay: 120 }),
      this.tween({ targets: [r.leftArm, r.leftFore, r.head], angle: 0, duration: 300, delay: 120 }),
    ]);
    r.muzzleGlow.setAlpha(0);
    r.wristGlow.setAlpha(0);
  }

  /** 발사 반동: 아래팔이 튀어 오르고, 몸이 밀리며 무릎이 눌리고, 탄피가 튄다 */
  private recoil(size: number): void {
    const r = this.robot;
    const k = Math.min(1.6, size);
    this.tweens.add({ targets: r.root, x: ROBOT.x - 9 * k, y: ROBOT.y + 5 * k, duration: 70, yoyo: true, ease: 'Quad.out' });
    // 팔꿈치는 조금만 튀고, 포신이 뒤로 밀렸다 돌아온다 (팔꿈치가 크게 꺾이면 팔이 부러져 보인다)
    this.tweens.add({ targets: r.forearm, rotation: 0.14 * k, duration: 60, yoyo: true, ease: 'Quad.out' });
    this.tweens.add({ targets: r.barrel, scaleY: 0.72, duration: 55, yoyo: true, ease: 'Quad.out' });
    this.tweens.add({ targets: r.gun, rotation: r.gun.rotation + 0.12 * k, duration: 70, yoyo: true });
    this.tweens.add({ targets: r.legs, scaleY: 0.94, duration: 70, yoyo: true });
    this.tweens.add({ targets: r.head, angle: -6, duration: 70, yoyo: true });
    r.thrustL.setAlpha(1);
    r.thrustR.setAlpha(1);
    this.tweens.add({ targets: [r.thrustL, r.thrustR], alpha: 0, duration: 260 });
    this.shake(0.003 * k, 80);
    if (this.reduceEffects) return;
    // 탄피: 팔꿈치에서 뒤로 튀어 떨어진다
    const e = this.worldPoint(r.forearm, 0, 10);
    const shell = this.add.rectangle(e.x, e.y, 5, 10, 0xffc933).setStrokeStyle(1.5, PAL.outline);
    this.world.add(shell);
    this.tweens.add({ targets: shell, x: e.x - 30, angle: -260, duration: 420, ease: 'Linear' });
    this.tweens.add({ targets: shell, y: e.y - 24, duration: 160, ease: 'Quad.out', yoyo: true, hold: 0, onComplete: () => this.tweens.add({ targets: shell, y: e.y + 40, alpha: 0, duration: 200, onComplete: () => shell.destroy() }) });
  }

  private async fireShell(size: number, big: boolean, spread = 0): Promise<void> {
    const r = this.robot;
    r.muzzleGlow.setScale(0.3).setAlpha(1);
    sfx.play('charge');
    await this.tween({ targets: r.muzzleGlow, scale: 1.2, duration: big ? 150 : 90, ease: 'Quad.in' });
    sfx.play('cannon');
    r.muzzleGlow.setAlpha(0);
    const m = this.muzzle();
    this.burst('world', m.x, m.y, 'star', { color: [0xffffff, 0xffd23f], count: 8, speed: 130, scale: 0.3, life: 200 });
    this.muzzleFlash(m, 0xffd23f, size);
    this.recoil(size);

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
    await this.tween({ targets: shell, x: tx, y: ty, scale: 0.6, duration: 220, ease: 'Sine.in' });
    trail.stop();
    this.time.delayedCall(300, () => trail.destroy());
    shell.destroy();
    this.landHit(tx, ty, big ? 1 : 0);
  }

  /**
   * 필살기 조명: 배경만 어두워지고 캐릭터와 적은 밝게 남는다 (배경 바로 위, 적·캐릭터 아래에 깐다).
   * 끌 때는 켤 때 받은 막을 넘긴다.
   */
  private spotlight(on: true): Phaser.GameObjects.Rectangle | null;
  private spotlight(on: false, dim: Phaser.GameObjects.Rectangle | null): null;
  private spotlight(on: boolean, dim: Phaser.GameObjects.Rectangle | null = null): Phaser.GameObjects.Rectangle | null {
    if (!on) {
      if (dim) this.tweens.add({ targets: dim, alpha: 0, duration: 260, onComplete: () => dim.destroy() });
      return null;
    }
    if (this.reduceEffects) return null;
    this.drop(this.dimRect);
    const d = this.add.rectangle(-400, -600, W + 800, H + 1000, 0x0b1020, 1).setOrigin(0).setAlpha(0);
    this.world.addAt(d, 1);
    this.dimRect = d;
    this.tweens.add({ targets: d, alpha: 0.42, duration: 220 });
    return d;
  }

  /** 총구 불꽃: 명중 별과 같은 모양을 작게, 한 박자만 */
  private muzzleFlash(p: { x: number; y: number }, color: number, size = 1): void {
    if (this.reduceEffects) return;
    const f = makeImpactStar(this, color, 6);
    f.setPosition(p.x, p.y).setScale(0.25 * size).setAngle(this.words * 17);
    this.world.add(f);
    this.tweens.add({ targets: f, scale: 0.55 * size, alpha: 0, duration: 110, ease: 'Quad.out', onComplete: () => f.destroy() });
  }

  /** 왼손목 광선총: 왼팔을 높이 들어 적에게 뻗고 빠른 빛줄기를 쏜다 */
  private async wristShot(): Promise<void> {
    const r = this.robot;
    // 뒷모습에서 왼팔은 몸통 뒤에 그려진다. 쏘는 동안만 몸통 앞으로 올려 보이게 한다.
    const at = r.body.getIndex(r.leftArm);
    r.body.bringToTop(r.leftArm);
    await Promise.all([
      this.tween({ targets: r.leftArm, angle: this.leftAim(), duration: 120, ease: 'Back.out' }),
      this.tween({ targets: r.leftFore, angle: 0, duration: 120 }),
    ]);
    r.wristGlow.setScale(0.4).setAlpha(1);
    await this.tween({ targets: r.wristGlow, scale: 1.3, duration: 90, ease: 'Quad.in' });
    sfx.play('beam');
    const m = this.wrist();
    const t = this.foeCenter();
    const bolt = this.add.graphics();
    const len = Math.hypot(t.x - m.x, t.y - m.y);
    bolt.fillStyle(0x5cf2ff, 0.6);
    bolt.fillRoundedRect(0, -6, 46, 12, 6);
    bolt.fillStyle(0xffffff, 1);
    bolt.fillRoundedRect(4, -2.5, 38, 5, 2.5);
    bolt.setPosition(m.x, m.y).setRotation(Math.atan2(t.y - m.y, t.x - m.x));
    this.world.add(bolt);
    r.wristGlow.setAlpha(0);
    this.muzzleFlash(m, 0x5cf2ff, 0.8);
    this.tweens.add({ targets: r.leftArm, angle: r.leftArm.angle + 10, duration: 60, yoyo: true });
    this.tweens.add({ targets: r.root, x: ROBOT.x - 4, duration: 60, yoyo: true });
    await this.tween({ targets: bolt, x: m.x + Math.cos(bolt.rotation) * (len - 40), y: m.y + Math.sin(bolt.rotation) * (len - 40), duration: 150, ease: 'Linear' });
    bolt.destroy();
    this.landHit(t.x, t.y, 0);
    await this.tween({ targets: [r.leftArm, r.leftFore], angle: 0, duration: 140 });
    r.body.moveTo(r.leftArm, at);
  }

  private hitReact(big: boolean, id = this.targetId): void {
    const sf = this.foes.get(id);
    if (!sf) return;
    const f = sf.parts;
    sf.idle.forEach((t) => t.pause());
    f.body.setScale(1.1, 0.88);
    this.tweens.add({ targets: f.body, scaleX: 1, scaleY: 1, duration: 240, ease: 'Back.out' });
    // 맞으면 뒤(↗)로 살짝 밀린다
    this.tweens.add({ targets: f.root, x: sf.x + (big ? 14 : 7), y: sf.y - (big ? 6 : 3), duration: 80, yoyo: true, ease: 'Quad.out', onComplete: () => sf.idle.forEach((t) => t.resume()) });
    this.tweens.add({ targets: f.root, alpha: 0.5, duration: 50, yoyo: true, repeat: big ? 1 : 0 });
    // 고개가 뒤로 젖혀졌다 돌아온다
    this.tweens.add({ targets: f.head, angle: big ? -16 : -8, duration: 70, yoyo: true, ease: 'Quad.out' });
    if (big) this.shake(0.006, 140);
  }

  /** 조준한 적 말고 나머지 적 (범위 공격) */
  private others(): number[] {
    return [...this.foes.keys()].filter((id) => id !== this.targetId);
  }

  /** 범위 공격이 나머지 적에게도 번진다 (연출 전용) */
  private splash(size: number): void {
    this.others().forEach((id, i) => {
      this.time.delayedCall(90 + i * 110, () => {
        const c = this.foeCenter(id);
        if (this.theme === 'magicalGirl') this.magicBlast(c.x, c.y, size, i % 2 ? MAG.magic2 : MAG.magic);
        else this.blast(c.x, c.y, size);
        sfx.play('explode');
        this.hitReact(true, id);
      });
    });
  }

  /** 명중 결과를 화면에 반영: 방패, 체력 막대, 쓰러진 적 (피해는 이미 한 번만 계산됨) */
  private async applyHits(hits: Hit[], hp: number, max: number): Promise<void> {
    for (const h of hits) {
      if (h.blocked > 0) this.shieldBlock(h.id);
      if (h.shieldAfter <= 0) this.setShield(h.id, 0);
    }
    this.hooks.onFoeHp(hp, max);
    const down = hits.filter((h) => h.defeated).map((h) => h.id);
    if (down.length) await Promise.all(down.map((id) => this.defeatFoe(id)));
  }

  private async openPod(open: boolean): Promise<void> {
    sfx.play('deploy');
    await this.tween({ targets: this.robot.hatch, angle: open ? -110 : 0, duration: 200, ease: 'Back.out' });
  }

  /** salvo 1 = 두 번째 일제 사격: 반대쪽으로 휘어 들어가 다른 곳을 때린다 */
  private async fireMissiles(salvo = 0): Promise<void> {
    const r = this.robot;
    // 적이 여럿이면 미사일을 나눠 쏜다 (범위 공격)
    const ids = [this.targetId, ...this.others()];
    const flights = r.podMouths.map(async (mouth, i) => {
      const id = ids[i % ids.length];
      const t = this.foeCenter(id);
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
      const ex = t.x + (ids.length > 1 ? (i % 2 ? 8 : -8) : (i - 1.5) * 16);
      const ey = t.y + (i % 2 ? 10 : -12);
      const bend = salvo ? 60 - i * 40 : -40 + i * 40;
      const curve = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(sx, sy), new Phaser.Math.Vector2(sx + bend, sy - 150 - i * 15 - salvo * 40), new Phaser.Math.Vector2(ex + salvo * 10, ey - salvo * 14));
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
      this.hitStop(25);
      this.blast(ex + salvo * 10, ey - salvo * 14, 1);
      this.hitReact(false, id);
    });
    await Promise.all(flights);
  }

  private async stagger(): Promise<void> {
    const f = this.tf?.parts;
    if (!f) return;
    // 연속 타격으로 자세를 잃는다
    await this.tween({ targets: f.body, angle: 12, duration: 120, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
  }

  private async finisher(grand = false): Promise<void> {
    const r = this.robot;
    // 왼팔로 대포 팔을 받쳐 드는 자세
    this.tweens.add({ targets: r.leftArm, angle: -70, duration: 220, ease: 'Back.out' });
    this.tweens.add({ targets: r.leftFore, angle: -60, duration: 220, ease: 'Back.out' });
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
    const dim = this.spotlight(true);
    // 빛 덩어리가 적을 가리지 않게 크기를 묶는다
    await this.tween({ targets: r.muzzleGlow, scale: 1.6, duration: 650, ease: 'Quad.in' });
    // 대형 에너지 포격
    sfx.play('beam');
    const t = this.foeCenter();
    const beam = this.add.graphics();
    // 광선은 적을 뚫고 화면 끝까지 뻗는다
    const len = Math.hypot(t.x - m.x, t.y - m.y) + 220;
    beam.fillStyle(0x5cf2ff, 0.4);
    beam.fillRoundedRect(0, -24, len, 48, 24);
    beam.fillStyle(0x5cf2ff, 0.75);
    beam.fillRoundedRect(0, -15, len, 30, 15);
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
    this.splash(1.3);
    await this.wait(spots * 70 + 120);
    await this.tween({ targets: beam, scaleY: 0, alpha: 0, duration: 200 });
    beam.destroy();
    this.spotlight(false, dim);
    r.muzzleGlow.setAlpha(0);
    this.tweens.add({ targets: [r.thrustL, r.thrustR], alpha: 0, duration: 300 });
    // 마무리 충격파
    sfx.play('bigExplode');
    this.hitStop(HIT_STOP[2]);
    this.blast(t.x, t.y, 2);
    const ring = this.add.graphics();
    ring.lineStyle(6, 0xffffff, 1);
    ring.strokeEllipse(0, 0, 60, 24);
    ring.setPosition(this.tf?.x ?? FOE.x, this.tf?.y ?? FOE.y);
    this.world.add(ring);
    this.shake(0.012, 300);
    await Promise.all([this.tween({ targets: ring, scaleX: 4, scaleY: 3, alpha: 0, duration: 520, ease: 'Quad.out' }), this.stagger()]);
    ring.destroy();
    if (grand) await this.grandFinale();
    await this.openPod(false);
  }

  /**
   * 최고 필살기 마무리 (최종 보스의 마지막 일격): 화면이 번쩍이고 모든 적 위로 큰 폭발이 세 번,
   * 두 겹 충격파. 로봇·마법소녀 공통 뼈대에 색만 다르다.
   */
  private async grandFinale(): Promise<void> {
    const magic = this.theme === 'magicalGirl';
    sfx.play(magic ? 'magicBeam' : 'beam');
    if (!this.reduceEffects) this.cameras.main.flash(280, 255, 255, 255);
    const ids = [...this.foes.keys()];
    for (let k = 0; k < 3; k++) {
      sfx.play('bigExplode');
      this.hitStop(60);
      for (const id of ids) {
        const c = this.foeCenter(id);
        const dx = (k - 1) * 22;
        if (magic) this.magicBlast(c.x + dx, c.y - k * 10, 1.8, k % 2 ? MAG.magic2 : MAG.glow);
        else this.blast(c.x + dx, c.y - k * 10, 1.8);
        this.hitReact(true, id);
      }
      this.shake(0.016, 260);
      await this.wait(200);
    }
    const t = this.tf ?? { x: FOE.x, y: FOE.y };
    const rings = [0, 1].map((i) => {
      const g = this.add.graphics();
      g.lineStyle(8 - i * 3, magic ? (i ? MAG.magic2 : MAG.magic) : i ? 0xffd23f : 0xffffff, 1);
      g.strokeEllipse(0, 0, 70, 28);
      g.setPosition(t.x, t.y);
      this.world.add(g);
      return g;
    });
    this.burst('world', t.x, t.y - 40, 'star', { color: magic ? [MAG.glow, MAG.magic, 0xffffff] : [0xffd23f, 0xffffff, 0x5cf2ff], count: 30, speed: 260, scale: 0.4, life: 900, gravity: 220 });
    await Promise.all(rings.map((g, i) => this.tween({ targets: g, scaleX: 6 + i * 2, scaleY: 4 + i, alpha: 0, duration: 700 + i * 200, ease: 'Quad.out' })));
    rings.forEach((g) => g.destroy());
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

  private async defeatFoe(id: number): Promise<void> {
    const sf = this.foes.get(id);
    if (!sf) return;
    const f = sf.parts;
    this.foes.delete(id);
    sf.idle.forEach((t) => t.remove());
    this.drop(sf.warn);
    sf.warn = null;
    this.tweens.killTweensOf(f.aura);
    if (id === this.targetId) this.targetId = this.foes.keys().next().value ?? -1;
    this.updateReticle();
    sfx.play('pop');
    // 어지러운 별 → 뒤로 도망치며 사라진다 (피나 고통 표현 없음)
    const stars = this.add.container(0, -f.height - 10);
    for (let i = 0; i < 3; i++) stars.add(this.add.image(Math.cos((i * 2 * Math.PI) / 3) * 18, Math.sin((i * 2 * Math.PI) / 3) * 6, 'star').setScale(0.35).setTint(0xffe066));
    f.root.add(stars);
    this.tweens.add({ targets: stars, angle: 360, duration: 600, repeat: -1 });
    await this.tween({ targets: f.body, angle: -14, duration: 160, yoyo: true, repeat: 2 });
    await this.tween({ targets: f.root, x: sf.x + 140, y: sf.y - 50, scale: f.root.scaleX * 0.4, alpha: 0, duration: 700, ease: 'Quad.in' });
    this.tweens.killTweensOf(stars);
    f.root.destroy();
  }

  // ───────────── 적 공격 (↙) ─────────────

  async foeAttack(id: number, damage: number, hpAfter: number, heavy = false): Promise<void> {
    const sf = this.foes.get(id);
    if (!sf) return;
    const f = sf.parts;
    const kind = sf.kind;
    this.setCharging(null);
    sf.idle.forEach((t) => t.pause());
    this.foeLayer.bringToTop(f.root);
    const target = { x: ROBOT.x + 20, y: ROBOT.y - 120 };
    const impact = () => {
      if (damage <= 0) {
        // 튜토리얼 적: 방어막이 막는다
        this.guard(true);
        sfx.play(this.theme === 'magicalGirl' ? 'chime' : 'block');
        this.burst('world', target.x + 40, target.y, 'star', { color: [0xe6d4ff, 0xffffff], count: 12, speed: 150, scale: 0.3, life: 380 });
        this.time.delayedCall(500, () => this.guard(false));
        return;
      }
      sfx.play('robotHit');
      if (heavy) sfx.play('bigExplode');
      this.blast(target.x, target.y, heavy ? 1.5 : 1);
      this.shake(heavy ? 0.014 : 0.008, heavy ? 320 : 200);
      this.hitStop(heavy ? 90 : 45);
      const k = heavy ? 1.5 : 1;
      if (this.theme === 'magicalGirl') {
        // 몸이 비틀리고 포니테일과 망토가 휘날린다. 왼팔은 균형을 잡으려 벌어진다.
        const m = this.magic;
        this.tweens.add({ targets: m.root, x: ROBOT.x - 12 * k, y: ROBOT.y + 6 * k, duration: 90, yoyo: true });
        this.tweens.add({ targets: m.body, angle: -7 * k, duration: 90, yoyo: true, ease: 'Quad.out' });
        this.tweens.add({ targets: m.head, angle: -12 * k, duration: 90, yoyo: true });
        this.tweens.add({ targets: m.ponytail, angle: 34 * k, duration: 120, yoyo: true });
        this.tweens.add({ targets: m.leftArm, angle: 50, duration: 100, yoyo: true });
        this.tweens.add({ targets: m.skirt, scaleX: 1.08, duration: 90, yoyo: true });
        this.burst('world', target.x - 10, target.y + 10, 'star', { color: [MAG.magic, 0xffffff], count: 8, speed: 130, scale: 0.25, life: 320 });
      } else {
        // 몸통이 비틀리고 무릎이 꺾인다. 부딪힌 자리에서 불꽃이 튄다.
        const r = this.robot;
        this.tweens.add({ targets: r.root, x: ROBOT.x - 12 * k, y: ROBOT.y + 6 * k, duration: 90, yoyo: true });
        this.tweens.add({ targets: r.body, angle: -6 * k, duration: 90, yoyo: true, ease: 'Quad.out' });
        // 머리는 세게 맞아도 조금만 (크게 꺾이면 머리가 떨어져 나가 보인다)
        this.tweens.add({ targets: r.head, angle: -10, duration: 90, yoyo: true });
        this.tweens.add({ targets: r.legs, scaleY: 0.9, duration: 90, yoyo: true });
        this.tweens.add({ targets: r.leftArm, angle: 30, duration: 100, yoyo: true });
        this.tweens.add({ targets: r.gun, rotation: -0.35, duration: 100, yoyo: true });
        this.tweens.add({ targets: r.visor, alpha: 0.2, duration: 70, yoyo: true, repeat: 1 });
        this.burst('world', target.x - 10, target.y + 10, 'star', { color: [0xffd23f, 0xffffff, 0xff8c42], count: 10, speed: 160, scale: 0.22, life: 300, gravity: 300 });
      }
      this.hooks.onRobotHp(hpAfter);
    };

    const s0 = f.root.scaleX;
    if (kind === 'charger' || kind === 'chief') {
      // 돌진: 뒤로 몸을 젖혀 발을 구른 뒤(흙먼지), 속도선을 남기며 곧장 들이받는다
      await this.tween({ targets: f.body, angle: -12, duration: heavy ? 280 : 180, ease: 'Quad.out' });
      for (let i = 0; i < (heavy ? 3 : 2); i++) {
        sfx.play('step');
        this.burst('world', sf.x + 10, sf.y, 'dot', { color: 0xd9c49a, count: 6, speed: 90, scale: 0.35, life: 400, gravity: -20 });
        await this.tween({ targets: f.body, y: -6, duration: 70, yoyo: true });
      }
      const lines = this.speedLines(sf, target);
      await this.tween({ targets: f.root, x: target.x + 70, y: target.y + 60, scale: s0 * 1.4, angle: 8, duration: 200, ease: 'Quad.in' });
      impact();
      lines.forEach((l) => this.drop(l));
      await this.tween({ targets: f.root, x: sf.x, y: sf.y, scale: s0, angle: 0, duration: 420, ease: 'Quad.out' });
      f.body.setAngle(0);
    } else if (kind === 'dino') {
      // 물기: 몸을 웅크렸다 달려들어 턱을 크게 벌린다
      await this.tween({ targets: f.body, angle: -6, scaleY: 0.92, duration: heavy ? 260 : 150 });
      sfx.play('step');
      await this.tween({ targets: f.root, x: target.x + 70, y: target.y + 60, scale: s0 * 1.35, duration: 260, ease: 'Quad.in' });
      if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 1, duration: 80, yoyo: true });
      impact();
      await this.tween({ targets: f.root, x: sf.x, y: sf.y, scale: s0, duration: 380, ease: 'Quad.out' });
      f.body.setScale(1);
    } else if (kind === 'armor') {
      // 꼬리 곤봉: 크게 뒤로 감았다가 땅을 내리쳐 충격파를 보낸다
      const tail = f.tail!;
      await this.tween({ targets: tail, angle: -70, duration: heavy ? 320 : 220, ease: 'Quad.out' });
      await this.tween({ targets: tail, angle: 40, duration: 110, ease: 'Quad.in' });
      sfx.play('explode');
      this.shake(0.01, 200);
      this.burst('world', sf.x + 40 * s0, sf.y - 4, 'dot', { color: [0xd9c49a, 0xb7a98a], count: 12, speed: 140, scale: 0.4, life: 500, gravity: 80 });
      await this.groundWave(sf.x, sf.y, target, heavy);
      impact();
      await this.tween({ targets: tail, angle: 0, duration: 300 });
    } else {
      if (kind === 'boss') {
        // 쿵: 뛰어올랐다 내려찍어 땅을 흔든 뒤 불덩이를 뿜는다
        await this.tween({ targets: f.body, y: -26, duration: 200, ease: 'Quad.out' });
        await this.tween({ targets: f.body, y: 0, duration: 120, ease: 'Quad.in' });
        sfx.play('step');
        this.shake(0.012, 260);
        this.burst('world', sf.x, sf.y, 'dot', { color: 0xd9c49a, count: 14, speed: 150, scale: 0.45, life: 500, gravity: -20 });
      } else if (kind === 'imp') {
        // 통통 두 번 뛰고 입에서 쏜다. 옆의 작은 괴물들도 같이 뛴다 (무리)
        for (const o of this.foes.values()) if (o.id !== id && o.kind === 'imp') this.tweens.add({ targets: o.parts.body, y: -10, duration: 120, yoyo: true, repeat: 1 });
        for (let i = 0; i < 2; i++) await this.tween({ targets: f.body, y: -14, duration: 110, yoyo: true, ease: 'Quad.out' });
      }
      // 발사체: 입에서 ↙ 방향으로
      if (f.jaw) this.tweens.add({ targets: f.jaw, scaleY: 1, duration: 150, yoyo: true, hold: 200 });
      sfx.play('roar');
      await this.wait(200);
      const sx = sf.x + f.mouth.x * s0;
      const sy = sf.y + f.mouth.y * s0;
      const ball = this.add.graphics();
      ball.fillStyle(kind === 'boss' ? 0xff6a3d : 0xb06cff, 1);
      ball.fillCircle(0, 0, 12);
      ball.fillStyle(0xffe08a, 1);
      ball.fillCircle(-3, -3, 5);
      ball.setPosition(sx, sy).setScale(heavy ? 0.9 : 0.6);
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
    if (this.foes.has(id)) this.startFoeIdle(sf);
  }

  /** 돌진하는 적 뒤로 남는 속도선 (돌진이 끝나면 지운다) */
  private speedLines(sf: SceneFoe, target: { x: number; y: number }): Phaser.GameObjects.Graphics[] {
    if (this.reduceEffects) return [];
    const a = Math.atan2(target.y - sf.y, target.x - sf.x);
    return [-18, 0, 18].map((o, i) => {
      const g = this.add.graphics();
      g.lineStyle(4 - i, 0xffffff, 0.8);
      g.lineBetween(0, o, -60 - i * 14, o);
      g.setPosition(sf.x, sf.y - 40).setRotation(a);
      this.world.add(g);
      this.tweens.add({ targets: g, x: target.x + 40, y: target.y + 20, alpha: 0.2, duration: 200, ease: 'Quad.in' });
      return g;
    });
  }

  /** 땅을 타고 로봇 쪽으로 번지는 충격파 고리 */
  private async groundWave(x: number, y: number, target: { x: number; y: number }, heavy: boolean): Promise<void> {
    const g = this.add.graphics();
    g.lineStyle(6, 0xffd166, 1);
    g.strokeEllipse(0, 0, 60, 18);
    g.lineStyle(3, 0xffffff, 0.9);
    g.strokeEllipse(0, 0, 40, 11);
    g.setPosition(x, y);
    this.world.add(g);
    await this.tween({ targets: g, x: target.x + 20, y: target.y + 110, scaleX: heavy ? 2.6 : 2, scaleY: heavy ? 2.6 : 2, duration: 320, ease: 'Quad.in' });
    this.tweens.add({ targets: g, alpha: 0, scaleX: 3.2, duration: 160, onComplete: () => g.destroy() });
  }

  async reboot(hpAfter: number): Promise<void> {
    if (this.theme === 'magicalGirl') return this.magicHeal(hpAfter);
    const r = this.robot;
    this.robotIdle.forEach((t) => t.pause());
    await Promise.all([this.tween({ targets: r.body, y: 14, angle: -5, duration: 380 }), this.tween({ targets: r.visor, alpha: 0, duration: 300 })]);
    await this.wait(250);
    sfx.play('reboot');
    // 수리 장치: 불꽃이 튀며 장갑이 복구된다
    sfx.play('repair');
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 120, () => this.burst('world', ROBOT.x - 30 + i * 30, ROBOT.y - 130 + i * 10, 'star', { color: [0xffd23f, 0xffffff], count: 6, speed: 90, scale: 0.2, life: 260 }));
    }
    this.burst('world', ROBOT.x, ROBOT.y - 120, 'dot', { color: [0x7dffb0, 0xffffff], count: 16, speed: 70, scale: 0.3, life: 800, gravity: -120 });
    this.tweens.add({ targets: r.body, alpha: 0.6, duration: 90, yoyo: true, repeat: 2 });
    this.guard(true);
    this.hooks.onRobotHp(hpAfter);
    await Promise.all([this.tween({ targets: r.body, y: 0, angle: 0, duration: 350, ease: 'Back.out' }), this.tween({ targets: r.visor, alpha: 1, duration: 200 })]);
    this.time.delayedCall(700, () => this.guard(false));
    this.robotIdle.forEach((t) => t.resume());
  }

  /** 승리 동작. grand = 최종 보스를 이긴 큰 승리 (하늘 가득 불꽃) */
  async celebrate(grand = false): Promise<void> {
    if (grand) this.fireworks();
    if (this.theme === 'magicalGirl') return this.magicCelebrate();
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

  /** 큰 승리 불꽃: 하늘 여러 곳에서 시간차로 터진다 (연출 전용) */
  private fireworks(): void {
    const magic = this.theme === 'magicalGirl';
    const spots = this.reduceEffects ? 3 : 7;
    for (let i = 0; i < spots; i++) {
      this.time.delayedCall(i * 220, () => {
        const x = 60 + ((i * 97) % 300);
        const y = 30 + ((i * 53) % 90);
        sfx.play(i % 2 ? 'sparkle' : 'explode');
        this.burst('world', x, y, 'star', { color: magic ? [MAG.glow, MAG.magic, MAG.magic2, 0xffffff] : [0xffd23f, 0x5cf2ff, 0xff7ab6, 0x7dff9a], count: 22, speed: 180, scale: 0.32, life: 900, gravity: 120 });
      });
    }
  }

  // ───────────── 마법소녀 공격 (콤보 단계별) ─────────────
  // 로봇과 피해량·단계는 같고 연출만 다르다: 빛의 탄환 → 마법진 연사 → 유성 낙하 → 거대 마법 광선.

  private magicAim(): number {
    const m = this.magic;
    const k = m.root.scaleX;
    const from = { x: ROBOT.x + m.armShoulder.x * k, y: ROBOT.y + m.armShoulder.y * k };
    const to = this.foeCenter();
    return Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2;
  }

  /** 마법봉 끝 (세계 좌표) */
  private wandTip(): { x: number; y: number } {
    const m = this.magic;
    const k = m.root.scaleX;
    const r = m.arm.rotation;
    const L = m.tipLocal.y;
    return { x: ROBOT.x + (m.armShoulder.x - Math.sin(r) * L) * k, y: ROBOT.y + (m.body.y + m.armShoulder.y + Math.cos(r) * L) * k };
  }

  /** 마법 명중: 불꽃 대신 빛 고리·별 조각 (연출 전용) */
  private magicBlast(x: number, y: number, size = 1, color: number = MAG.magic): void {
    if (this.blasts >= MAX_BLASTS) return;
    size *= this.fxScale;
    this.blasts++;
    const g = this.add.graphics();
    g.lineStyle(6, color, 1);
    g.strokeCircle(0, 0, 14);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(0, 0, 9);
    g.setPosition(x, y).setScale(0.3 * size);
    this.world.add(g);
    this.tweens.add({
      targets: g,
      scale: 1.8 * size,
      alpha: 0,
      duration: 380,
      ease: 'Quad.out',
      onComplete: () => {
        g.destroy();
        this.blasts--;
      },
    });
    this.burst('world', x, y, 'star', { color: [0xffffff, MAG.glow, color, MAG.magic2], count: 9, speed: 170 * size, scale: 0.28 * size, life: 420 });
  }

  private async magicAttack(tier: AttackTier, hits: Hit[], hp: number, max: number, combo = 0): Promise<void> {
    const m = this.magic;
    this.magicIdle.forEach((t) => t.pause());
    this.guard(false);
    this.setCharging(null);
    await this.magicCharge(tier === 'finisher' || tier === 'ultimate' ? 2 : tier === 'missiles' ? 1 : 0);
    await this.magicTwirl();

    if (tier === 'basic') {
      await this.wandShot(1.15, true);
    } else if (tier === 'rapid') {
      // 콤보 2: 마법진 둘에서 3연사 / 콤보 3 이상: 마법진 셋에서 5연사
      await this.circleVolley(combo >= 3 ? 3 : 2);
    } else if (tier === 'missiles') {
      // 콤보 4: 유성 넷 / 콤보 5 이상: 유성 여섯
      const shot = this.wandShot(0.9, false);
      await this.wait(120);
      await Promise.all([shot, this.meteorShower(combo >= 5 ? 6 : 4)]);
      await this.stagger();
    } else {
      await this.magicFinisher(tier === 'ultimate');
    }

    await this.applyHits(hits, hp, max);
    await Promise.all([
      this.tween({ targets: m.arm, rotation: -0.5, duration: 300, delay: 120 }),
      this.tween({ targets: m.leftArm, angle: 14, duration: 300, delay: 120 }),
      this.tween({ targets: m.body, y: 0, duration: 320, delay: 120, ease: 'Quad.in' }),
      this.tween({ targets: m.ponytail, angle: 0, duration: 300, delay: 120 }),
    ]);
    m.tipGlow.setAlpha(0);
    this.setCharge(0);
    this.magicIdle.forEach((t) => t.resume());
  }

  /** 충전: 로봇과 반대로 몸이 살짝 떠오르고, 발밑에서 빛 알갱이가 솟으며 포니테일이 날린다 */
  private async magicCharge(level: 0 | 1 | 2): Promise<void> {
    const m = this.magic;
    sfx.play('sparkle');
    const ms = [120, 180, 280][level];
    this.burst('world', ROBOT.x, ROBOT.y - 20, 'star', { color: [MAG.glow, MAG.magic2, 0xffffff], count: 5 + level * 4, speed: 50 + level * 20, scale: 0.22, life: 600, gravity: -180 });
    this.tweens.add({ targets: m.gem, alpha: 0.4, duration: 70, yoyo: true, repeat: 1 + level });
    await Promise.all([
      this.tween({ targets: m.body, y: -8 - level * 4, duration: ms, ease: 'Sine.out' }),
      this.tween({ targets: m.ponytail, angle: -24, duration: ms, ease: 'Sine.out' }),
      this.tween({ targets: m.leftArm, angle: 55, duration: ms, ease: 'Sine.out' }),
      this.tween({ targets: m.skirt, scaleX: 1.06, duration: ms, yoyo: true }),
    ]);
  }

  /** 마법봉을 한 바퀴 돌려 겨눈다 (로봇의 무장 전개에 해당) */
  private async magicTwirl(): Promise<void> {
    const m = this.magic;
    sfx.play('chime');
    const aim = this.magicAim();
    m.tipGlow.setScale(0.5).setAlpha(0.8);
    // 한 바퀴 돌며 끝의 빛이 원을 그린다 (시계 방향으로 돌아 겨눈 자리에서 멈춘다)
    const trail = this.reduceEffects ? null : this.add.particles(0, 0, 'star', { lifespan: 260, scale: { start: 0.2, end: 0 }, tint: [MAG.glow, MAG.magic], frequency: 18 });
    if (trail) this.world.add(trail);
    await this.tween({
      targets: m.arm,
      rotation: aim + Math.PI * 2,
      duration: 240,
      ease: 'Cubic.out',
      onUpdate: () => {
        const p = this.wandTip();
        trail?.setPosition(p.x, p.y);
      },
    });
    m.arm.setRotation(aim);
    trail?.stop();
    if (trail) this.time.delayedCall(300, () => trail.destroy());
  }

  /** 빛의 탄환 한 발 (from이 없으면 마법봉 끝에서) */
  private async wandShot(size: number, big: boolean, from?: { x: number; y: number }, spread = 0): Promise<void> {
    const m = this.magic;
    if (!from) {
      m.tipGlow.setScale(0.3).setAlpha(1);
      await this.tween({ targets: m.tipGlow, scale: 1.2, duration: big ? 150 : 90, ease: 'Quad.in' });
      m.tipGlow.setAlpha(0);
      this.tweens.add({ targets: m.arm, rotation: m.arm.rotation + 0.25, duration: 70, yoyo: true });
      this.tweens.add({ targets: m.root, x: ROBOT.x - 6, y: ROBOT.y + 4, duration: 70, yoyo: true, ease: 'Quad.out' });
      this.tweens.add({ targets: m.skirt, scaleX: 1.07, duration: 80, yoyo: true });
      this.tweens.add({ targets: m.ponytail, angle: m.ponytail.angle - 12, duration: 90, yoyo: true });
    }
    const p = from ?? this.wandTip();
    sfx.play('magicShot');
    this.burst('world', p.x, p.y, 'star', { color: [0xffffff, MAG.glow], count: 6, speed: 110, scale: 0.25, life: 220 });
    const t = this.foeCenter();
    const tx = t.x + spread;
    const ty = t.y + spread * 0.5;
    const b = makeStarBullet(this, big ? MAG.magic : MAG.magic2, size);
    b.setPosition(p.x, p.y);
    this.world.add(b);
    const trail = this.add.particles(0, 0, 'star', { follow: b, lifespan: 260, scale: { start: 0.22 * size, end: 0 }, tint: [0xffffff, MAG.magic, MAG.magic2], frequency: this.reduceEffects ? 60 : 16, rotate: { min: 0, max: 360 } });
    this.world.add(trail);
    // 마법봉 끝이 적과 가까워도 날아가는 길이 보이게, 위로 솟았다가 휘어 내려 꽂힌다
    const arc = new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(p.x, p.y), new Phaser.Math.Vector2((p.x + tx) / 2 - 30, Math.min(p.y, ty) - 70), new Phaser.Math.Vector2(tx, ty));
    const k = { t: 0 };
    await this.tween({
      targets: k,
      t: 1,
      duration: 260,
      ease: 'Sine.in',
      onUpdate: () => {
        const q = arc.getPoint(k.t);
        b.setPosition(q.x, q.y).setScale(1 - 0.3 * k.t);
      },
    });
    trail.stop();
    this.time.delayedCall(300, () => trail.destroy());
    b.destroy();
    this.landHit(tx, ty, big ? 1 : 0);
  }

  /** 중간 콤보: 마법진 세 개가 펼쳐지고 별빛 탄환이 연달아 날아간다 */
  private async circleVolley(n: 2 | 3 = 3): Promise<void> {
    const tip = this.wandTip();
    const all = [
      { x: tip.x - 34, y: tip.y - 30 },
      { x: tip.x + 6, y: tip.y - 52 },
      { x: tip.x + 30, y: tip.y - 10 },
    ];
    const spots = n === 3 ? all : [all[0], all[2]];
    sfx.play('magicCircle');
    const circles = spots.map((s, i) => {
      const c = makeMagicCircle(this, 20, i === 1 ? MAG.magic : MAG.magic2, MAG.glow);
      c.setPosition(s.x, s.y).setScale(0).setAlpha(0.95);
      this.world.add(c);
      this.tweens.add({ targets: c, scale: 1, duration: 200, delay: i * 60, ease: 'Back.out' });
      this.tweens.add({ targets: c, angle: 360, duration: 1400, repeat: -1 });
      return c;
    });
    await this.wait(260);
    const order = n === 3 ? [0, 1, 2, 1, 0] : [0, 1, 0];
    const shots = order.map(async (ci, i) => {
      await this.wait(i * 110);
      await this.wandShot(0.8, i === order.length - 1, spots[ci], (ci - 1) * 12);
    });
    await Promise.all(shots);
    circles.forEach((c) => this.tweens.add({ targets: c, scale: 0, alpha: 0, duration: 200, onComplete: () => this.drop(c) }));
    await this.wait(120);
  }

  /** 높은 콤보: 적 위 하늘에 큰 마법진이 열리고 유성이 시간차로 떨어진다 */
  private async meteorShower(count: number): Promise<void> {
    const t = this.foeCenter();
    // 하늘에 눕힌 마법진: 바깥 상자는 납작하게, 안쪽 무늬만 돈다 (회전하며 찌그러지지 않게)
    const sky = this.add.container(t.x - 60, t.y - 120);
    const skyRing = makeMagicCircle(this, 58, MAG.magic, MAG.glow);
    sky.add(skyRing);
    sky.setScale(0, 0).setAlpha(0.9);
    this.world.add(sky);
    sfx.play('magicCircle');
    this.tweens.add({ targets: skyRing, angle: 360, duration: 2400, repeat: -1 });
    await this.tween({ targets: sky, scaleX: 1, scaleY: 0.45, duration: 260, ease: 'Back.out' });
    const n = this.reduceEffects ? Math.min(2, count) : count;
    // 적이 여럿이면 유성을 나눠 떨어뜨린다 (범위 공격)
    const ids = [this.targetId, ...this.others()];
    const falls = Array.from({ length: n }, async (_, i) => {
      await this.wait(i * 120);
      const id = ids[i % ids.length];
      const c = this.foeCenter(id);
      const sx = sky.x - 30 + i * 20;
      const sy = sky.y;
      const ex = ids.length > 1 ? c.x + (i % 2 ? 8 : -8) : t.x + (i - (n - 1) / 2) * 20;
      const ey = (ids.length > 1 ? c.y : t.y) + (i % 2 ? 12 : -8);
      const me = makeMeteor(this, 0.9);
      me.setPosition(sx, sy).setScale(0.5);
      this.world.add(me);
      sfx.play('meteor');
      const trail = this.add.particles(0, 0, 'dot', { follow: me, lifespan: 300, scale: { start: 0.3, end: 0 }, tint: [MAG.glow, MAG.magic, 0xffffff], frequency: this.reduceEffects ? 60 : 16 });
      this.world.add(trail);
      await this.tween({ targets: me, x: ex, y: ey, scale: 1.1, duration: 420, ease: 'Quad.in' });
      trail.stop();
      this.time.delayedCall(320, () => trail.destroy());
      me.destroy();
      sfx.play('magicHit');
      this.hitStop(25);
      this.magicBlast(ex, ey, 1.1, i % 2 ? MAG.magic2 : MAG.magic);
      this.hitReact(i === n - 1, id);
    });
    await Promise.all(falls);
    this.tweens.add({
      targets: sky,
      scaleX: 0,
      alpha: 0,
      duration: 220,
      onComplete: () => {
        this.drop(skyRing);
        sky.destroy();
      },
    });
  }

  /** 필살기: 큰 마법진에서 거대한 마법 광선 + 유성 + 연쇄 별빛 폭발 + 충격파 */
  private async magicFinisher(grand = false): Promise<void> {
    const m = this.magic;
    // 두 팔을 들어 올리는 필살 자세 (왼손도 하늘로)
    this.tweens.add({ targets: m.leftArm, angle: 160, duration: 260, ease: 'Back.out' });
    const tip = this.wandTip();
    const circle = makeMagicCircle(this, 44, MAG.magic, MAG.magic2);
    circle.setPosition(tip.x + 10, tip.y - 8).setScale(0).setAlpha(0.95);
    this.world.add(circle);
    sfx.play('magicCircle');
    this.tweens.add({ targets: circle, angle: 360, duration: 1200, repeat: -1 });
    await this.tween({ targets: circle, scale: 1, duration: 280, ease: 'Back.out' });
    // 힘 모으기: 빛 입자가 마법진으로 빨려 든다
    sfx.play('sparkle');
    m.tipGlow.setScale(0.2).setAlpha(1);
    for (let i = 0; i < (this.reduceEffects ? 4 : 10); i++) {
      const a = (i / 10) * Math.PI * 2;
      const d = this.add.image(circle.x + Math.cos(a) * 70, circle.y + Math.sin(a) * 70, 'star').setTint(i % 2 ? MAG.magic : MAG.glow).setScale(0.3);
      this.world.add(d);
      this.tweens.add({ targets: d, x: circle.x, y: circle.y, scale: 0.05, angle: 180, duration: 480, delay: i * 25, onComplete: () => d.destroy() });
    }
    const dim = this.spotlight(true);
    await this.tween({ targets: m.tipGlow, scale: 1.6, duration: 550, ease: 'Quad.in' });
    // 거대한 마법 광선 (여러 색 띠 + 하얀 중심)
    sfx.play('magicBeam');
    const t = this.foeCenter();
    const len = Math.hypot(t.x - circle.x, t.y - circle.y) + 220;
    const beam = this.add.graphics();
    beam.fillStyle(MAG.magic2, 0.45);
    beam.fillRoundedRect(0, -22, len, 44, 22);
    beam.fillStyle(MAG.magic, 0.8);
    beam.fillRoundedRect(0, -13, len, 26, 13);
    beam.fillStyle(0xffffff, 1);
    beam.fillRoundedRect(0, -5, len, 10, 5);
    beam.setPosition(circle.x, circle.y).setRotation(Math.atan2(t.y - circle.y, t.x - circle.x)).setScale(0, 1);
    this.world.add(beam);
    this.tweens.add({ targets: m.root, x: ROBOT.x - 12, y: ROBOT.y + 7, duration: 120, yoyo: true, hold: 500 });
    await this.tween({ targets: beam, scaleX: 1, duration: 150, ease: 'Quad.out' });
    void this.meteorShower(3);
    const spots = this.reduceEffects ? 4 : 8;
    for (let i = 0; i < spots; i++) {
      const a = (i / spots) * Math.PI * 2;
      this.time.delayedCall(i * 70, () => {
        sfx.play(i % 2 ? 'sparkle' : 'magicHit');
        this.magicBlast(t.x + Math.cos(a) * 34, t.y + Math.sin(a) * 26, 1.1, i % 2 ? MAG.magic2 : MAG.magic);
        this.hitReact(i === spots - 1);
      });
    }
    this.splash(1.3);
    await this.wait(spots * 70 + 120);
    await this.tween({ targets: beam, scaleY: 0, alpha: 0, duration: 200 });
    beam.destroy();
    this.spotlight(false, dim);
    m.tipGlow.setAlpha(0);
    this.tweens.add({ targets: circle, scale: 0, alpha: 0, duration: 200, onComplete: () => this.drop(circle) });
    // 마무리 충격파: 무지개빛 고리
    sfx.play('bigExplode');
    this.hitStop(HIT_STOP[2]);
    this.magicBlast(t.x, t.y, 2, MAG.glow);
    const ring = this.add.graphics();
    ring.lineStyle(6, MAG.magic, 1);
    ring.strokeEllipse(0, 0, 60, 24);
    ring.lineStyle(3, MAG.magic2, 1);
    ring.strokeEllipse(0, 0, 44, 16);
    ring.setPosition(this.tf?.x ?? FOE.x, this.tf?.y ?? FOE.y);
    this.world.add(ring);
    this.shake(0.012, 300);
    await Promise.all([this.tween({ targets: ring, scaleX: 4, scaleY: 3, alpha: 0, duration: 520, ease: 'Quad.out' }), this.stagger()]);
    ring.destroy();
    if (grand) await this.grandFinale();
  }

  /** 회복: 바닥에 회복 문양, 빛 입자가 올라오며 다시 일어선다 */
  private async magicHeal(hpAfter: number): Promise<void> {
    const m = this.magic;
    this.magicIdle.forEach((t) => t.pause());
    await this.tween({ targets: m.body, y: 14, angle: -5, duration: 380 });
    const sigil = makeHealSigil(this);
    sigil.setPosition(ROBOT.x, ROBOT.y - 6).setAlpha(0);
    this.world.addAt(sigil, this.world.getIndex(m.root));
    sfx.play('heal');
    await this.tween({ targets: sigil, alpha: 1, duration: 250 });
    this.tweens.add({ targets: sigil, angle: 90, duration: 900 });
    this.burst('world', ROBOT.x, ROBOT.y - 40, 'star', { color: [0x7dffb0, MAG.glow, 0xffffff], count: 18, speed: 60, scale: 0.28, life: 900, gravity: -160 });
    this.guard(true);
    this.hooks.onRobotHp(hpAfter);
    await this.tween({ targets: m.body, y: 0, angle: 0, duration: 350, ease: 'Back.out' });
    this.tweens.add({ targets: sigil, alpha: 0, duration: 400, delay: 200, onComplete: () => sigil.destroy() });
    this.time.delayedCall(700, () => this.guard(false));
    this.magicIdle.forEach((t) => t.resume());
  }

  private async magicCelebrate(): Promise<void> {
    const m = this.magic;
    sfx.play('victory');
    this.magicIdle.forEach((t) => t.pause());
    this.tweens.add({ targets: m.arm, rotation: Math.PI - 0.2, duration: 300, ease: 'Back.out' });
    this.tweens.add({ targets: m.leftArm, angle: 150, duration: 300, ease: 'Back.out' });
    for (let i = 0; i < 2; i++) await this.tween({ targets: m.root, y: ROBOT.y - 16, duration: 220, yoyo: true, ease: 'Quad.out' });
    this.burst('world', ROBOT.x + 30, ROBOT.y - 260, 'star', { color: [MAG.glow, MAG.magic, MAG.magic2, 0x7dff9a], count: 30, speed: 220, scale: 0.35, life: 1100, gravity: 250 });
    await this.wait(600);
    m.leftArm.setAngle(14);
    m.arm.setRotation(-0.5);
  }

  /** 선택 화면에서 고른 캐릭터의 짧은 동작 (로봇: 무장 전개·발사 준비 / 마법소녀: 마법봉 빛·마법진) */
  async pickDemo(t: CharacterTheme): Promise<void> {
    this.setTheme(t);
    if (t === 'robot') {
      const r = this.robot;
      sfx.play('deploy');
      await Promise.all([
        this.tween({ targets: r.gun, rotation: this.aimAngle(), duration: 220, ease: 'Back.out' }),
        this.tween({ targets: r.barrel, scaleY: 1, duration: 260, ease: 'Back.out' }),
        this.tween({ targets: r.hatch, angle: -110, duration: 220, ease: 'Back.out' }),
      ]);
      sfx.play('charge');
      r.muzzleGlow.setScale(0.3).setAlpha(1);
      await this.tween({ targets: r.muzzleGlow, scale: 1.6, duration: 400, yoyo: true });
      r.muzzleGlow.setAlpha(0);
      await Promise.all([
        this.tween({ targets: r.gun, rotation: 0, duration: 300, delay: 200 }),
        this.tween({ targets: r.barrel, scaleY: 0.15, duration: 300, delay: 200 }),
        this.tween({ targets: r.hatch, angle: 0, duration: 200, delay: 200 }),
      ]);
    } else {
      const m = this.magic;
      sfx.play('sparkle');
      await this.tween({ targets: m.arm, rotation: this.magicAim(), duration: 220, ease: 'Back.out' });
      const tip = this.wandTip();
      const c = makeMagicCircle(this, 34);
      c.setPosition(tip.x + 8, tip.y - 6).setScale(0);
      this.world.add(c);
      sfx.play('magicCircle');
      m.tipGlow.setScale(0.3).setAlpha(1);
      this.tweens.add({ targets: c, angle: 360, duration: 1200 });
      await Promise.all([this.tween({ targets: c, scale: 1, duration: 300, ease: 'Back.out' }), this.tween({ targets: m.tipGlow, scale: 1.6, duration: 400, yoyo: true })]);
      m.tipGlow.setAlpha(0);
      await this.tween({ targets: c, scale: 0, alpha: 0, duration: 250, delay: 300 });
      c.destroy();
      await this.tween({ targets: m.arm, rotation: -0.5, duration: 300 });
    }
  }
}
