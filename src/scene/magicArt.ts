// 마법소녀 테마 그림 (자체 제작 임시 에셋). 로봇과 같은 자리·같은 구도:
// 뒷모습 3/4 시점으로 왼쪽 아래에 서서 오른쪽 위의 적에게 마법봉을 겨눈다. 좌표는 발바닥(0,0) 기준.
import Phaser from 'phaser';

type G = Phaser.GameObjects.Graphics;
type C = Phaser.GameObjects.Container;

export const MAG = {
  outline: 0x16203a,
  dress: 0x6f4bd8,
  dressDeep: 0x4b31a8,
  dressLight: 0xb9a6ff,
  cape: 0x1f9fb8,
  capeDeep: 0x157a8f,
  gold: 0xffc933,
  ribbon: 0xff5fa2,
  skin: 0xffd6bf,
  hair: 0x2f2c5e,
  hairHi: 0x4f4a92,
  white: 0xf7f4ff,
  glow: 0xfff0a8,
  magic: 0xff7ad9,
  magic2: 0x8fe8ff,
};

const V = (x: number, y: number) => new Phaser.Math.Vector2(x, y);

function blob(g: G, pts: [number, number][], fill: number, lw = 3, line = MAG.outline) {
  const closed = [...pts, pts[0], pts[1]];
  const p = new Phaser.Curves.Spline(closed.map(([x, y]) => V(x, y))).getPoints(pts.length * 10).slice(0, -8);
  g.fillStyle(fill, 1);
  g.fillPoints(p, true);
  if (lw > 0) {
    g.lineStyle(lw, line, 1);
    g.strokePoints(p, true);
  }
}

function rrect(g: G, x: number, y: number, w: number, h: number, r: number, fill: number, lw = 3) {
  g.fillStyle(fill, 1);
  g.fillRoundedRect(x, y, w, h, r);
  if (lw > 0) {
    g.lineStyle(lw, MAG.outline, 1);
    g.strokeRoundedRect(x, y, w, h, r);
  }
}

function circle(g: G, x: number, y: number, r: number, fill: number, lw = 3) {
  g.fillStyle(fill, 1);
  g.fillCircle(x, y, r);
  if (lw > 0) {
    g.lineStyle(lw, MAG.outline, 1);
    g.strokeCircle(x, y, r);
  }
}

function starPoints(cx: number, cy: number, r1: number, r2: number, n = 5, rot = -Math.PI / 2): Phaser.Math.Vector2[] {
  const pts: Phaser.Math.Vector2[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = rot + (i * Math.PI) / n;
    pts.push(V(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
  }
  return pts;
}

export function star(g: G, cx: number, cy: number, r: number, fill: number, lw = 2.5) {
  const pts = starPoints(cx, cy, r, r * 0.45);
  g.fillStyle(fill, 1);
  g.fillPoints(pts, true);
  if (lw > 0) {
    g.lineStyle(lw, MAG.outline, 1);
    g.strokePoints(pts, true);
  }
}

// ───────────────────────── 마법소녀 (뒷모습 3/4) ─────────────────────────

export interface MagicParts {
  root: C;
  body: C;
  head: C;
  ponytail: C;
  cape: G;
  /** 마법봉 팔: 어깨 축으로 회전. 0이면 아래(+y)를 향한다 (로봇 대포 팔과 같은 약속) */
  arm: C;
  armShoulder: { x: number; y: number };
  /** 팔 좌표계에서 마법봉 끝 */
  tipLocal: { x: number; y: number };
  tipGlow: G;
  leftArm: C;
  /** 발밑 마법진 게이지 (자모를 넣을수록 칸이 켜진다) */
  gauge: G;
  /** 에너지가 들어가는 곳: 허리 리본의 보석 */
  gemCenter: { x: number; y: number };
  gem: G;
}

export function makeMagicGirl(scene: Phaser.Scene): MagicParts {
  const root = scene.add.container(0, 0);
  const gauge = scene.add.graphics();
  const body = scene.add.container(0, 0);

  // 다리와 부츠 (아래쪽은 화면 밖으로 잘린다)
  const legs = scene.add.graphics();
  rrect(legs, -30, -72, 20, 74, 9, MAG.white);
  rrect(legs, 10, -72, 20, 74, 9, MAG.white);
  rrect(legs, -33, -34, 26, 36, 9, MAG.dressDeep);
  rrect(legs, 7, -34, 26, 36, 9, MAG.dressDeep);
  legs.fillStyle(MAG.gold, 1);
  legs.fillRect(-31, -32, 22, 5);
  legs.fillRect(9, -32, 22, 5);

  // 왼팔 (화면 왼쪽, 주먹 쥐고 힘 있게)
  const leftArm = scene.add.container(-36, -172);
  const la = scene.add.graphics();
  circle(la, 0, 6, 12, MAG.dressLight);
  rrect(la, -8, 12, 16, 34, 8, MAG.white);
  circle(la, 0, 50, 9, MAG.white);
  leftArm.add(la);
  leftArm.setAngle(14);

  // 치마 (두 겹, 뒤에서 본 모습)
  const skirt = scene.add.graphics();
  blob(skirt, [[-34, -124], [34, -124], [62, -74], [34, -60], [0, -66], [-34, -60], [-62, -74]], MAG.dressLight, 3);
  blob(skirt, [[-30, -126], [30, -126], [54, -82], [26, -72], [0, -78], [-26, -72], [-54, -82]], MAG.dress, 3);
  skirt.lineStyle(2.5, MAG.dressDeep, 0.9);
  skirt.lineBetween(-18, -118, -30, -80);
  skirt.lineBetween(0, -120, 0, -80);
  skirt.lineBetween(18, -118, 30, -80);

  // 몸통 뒤 (재킷)
  const torso = scene.add.graphics();
  blob(torso, [[-34, -184], [0, -190], [34, -184], [30, -150], [26, -122], [-26, -122], [-30, -150]], MAG.dress, 3);
  torso.fillStyle(MAG.gold, 1);
  torso.fillRoundedRect(-27, -130, 54, 7, 3);

  // 허리 리본 (가운데 보석이 충전 표시)
  const bow = scene.add.graphics();
  blob(bow, [[-4, -126], [-40, -148], [-46, -118], [-8, -118]], MAG.ribbon, 3);
  blob(bow, [[4, -126], [40, -148], [46, -118], [8, -118]], MAG.ribbon, 3);
  blob(bow, [[-6, -118], [-20, -84], [-10, -80], [0, -114]], MAG.ribbon, 2.5);
  blob(bow, [[6, -118], [22, -86], [12, -80], [0, -114]], MAG.ribbon, 2.5);
  const gem = scene.add.graphics();
  const gemCenter = { x: 0, y: -124 };
  const drawGem = (color: number) => {
    gem.clear();
    gem.fillStyle(color, 1);
    gem.fillPoints([V(0, -134), V(9, -124), V(0, -113), V(-9, -124)], true);
    gem.lineStyle(2.5, MAG.outline, 1);
    gem.strokePoints([V(0, -134), V(9, -124), V(0, -113), V(-9, -124)], true);
    gem.fillStyle(0xffffff, 0.8);
    gem.fillCircle(-3, -127, 2.5);
  };
  drawGem(MAG.magic2);

  // 짧은 망토 (어깨 위)
  const cape = scene.add.graphics();
  blob(cape, [[-40, -188], [0, -196], [40, -188], [48, -150], [22, -140], [0, -146], [-22, -140], [-48, -150]], MAG.cape, 3);
  cape.lineStyle(3, MAG.gold, 1);
  cape.beginPath();
  cape.arc(0, -120, 50, Phaser.Math.DegToRad(-150), Phaser.Math.DegToRad(-30));
  cape.strokePath();
  star(cape, -26, -160, 6, MAG.gold, 2);
  star(cape, 26, -160, 6, MAG.gold, 2);

  // 머리 (뒤통수 + 오른쪽 볼이 조금 보인다) + 높이 묶은 포니테일
  const head = scene.add.container(6, -200);
  const ponytail = scene.add.container(-10, -40);
  const pt = scene.add.graphics();
  blob(pt, [[-6, -6], [10, -4], [4, 30], [-10, 62], [-28, 74], [-24, 46], [-18, 18]], MAG.hair, 3);
  pt.lineStyle(3, MAG.hairHi, 1);
  pt.lineBetween(-2, 8, -14, 50);
  ponytail.add(pt);
  const hg = scene.add.graphics();
  // 볼과 귀 (3/4 시점)
  circle(hg, 24, -14, 9, MAG.skin, 2.5);
  blob(hg, [[-30, -10], [-28, -40], [-2, -56], [26, -46], [32, -20], [22, 0], [-14, 4]], MAG.hair, 3);
  hg.lineStyle(3, MAG.hairHi, 1);
  hg.beginPath();
  hg.arc(-2, -24, 22, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(290));
  hg.strokePath();
  // 머리끈과 별 머리핀
  circle(hg, -10, -42, 6, MAG.ribbon, 2.5);
  star(hg, 14, -46, 8, MAG.gold, 2.5);
  // 목
  rrect(hg, -8, 0, 16, 10, 4, MAG.skin, 2.5);
  head.add([ponytail, hg]);

  // 마법봉 팔 (어깨를 축으로 적을 향해 든다)
  const armShoulder = { x: 34, y: -174 };
  const arm = scene.add.container(armShoulder.x, armShoulder.y);
  const ag = scene.add.graphics();
  circle(ag, 0, 6, 12, MAG.dressLight);
  rrect(ag, -8, 12, 16, 36, 8, MAG.white);
  circle(ag, 0, 52, 9, MAG.white);
  // 마법봉: 금색 막대 + 별 머리
  rrect(ag, -3.5, 50, 7, 46, 3, MAG.gold, 2.5);
  circle(ag, 0, 58, 5, MAG.magic, 2);
  star(ag, 0, 106, 15, MAG.gold, 3);
  circle(ag, 0, 106, 5, MAG.magic2, 2);
  const tipLocal = { x: 0, y: 106 };
  const tipGlow = scene.add.graphics();
  tipGlow.fillStyle(MAG.glow, 0.9);
  tipGlow.fillCircle(0, 0, 16);
  tipGlow.fillStyle(0xffffff, 1);
  tipGlow.fillCircle(0, 0, 7);
  tipGlow.setPosition(tipLocal.x, tipLocal.y).setAlpha(0);
  arm.add([ag, tipGlow]);

  body.add([legs, leftArm, skirt, torso, bow, gem, cape, head, arm]);
  root.add([gauge, body]);
  root.setScale(1.08);

  return { root, body, head, ponytail, cape, arm, armShoulder, tipLocal, tipGlow, leftArm, gauge, gemCenter, gem };
}

/** 발밑 마법진: 자모를 넣을수록 조각이 켜진다 (로봇 등 게이지와 같은 역할) */
export function drawMagicGauge(g: G, frac: number, color = MAG.magic2): void {
  g.clear();
  const segs = 5;
  const lit = Math.round(Math.max(0, Math.min(1, frac)) * segs);
  g.lineStyle(3, 0xffffff, 0.35);
  g.strokeEllipse(0, -4, 150, 40);
  for (let i = 0; i < segs; i++) {
    const a0 = Phaser.Math.DegToRad(200 + i * 30);
    const a1 = a0 + Phaser.Math.DegToRad(24);
    g.lineStyle(6, i < lit ? color : 0x3a4470, i < lit ? 1 : 0.6);
    g.beginPath();
    // 타원 위의 호를 점으로 잇는다
    for (let k = 0; k <= 8; k++) {
      const a = a0 + ((a1 - a0) * k) / 8;
      const x = Math.cos(a) * 75;
      const y = -4 + Math.sin(a) * 20;
      if (k === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.strokePath();
  }
}

// ───────────────────────── 마법 효과 ─────────────────────────

/** 마법진 (룬 대신 점과 별 무늬). 납작하게 눕히거나 세워서 쓴다. */
export function makeMagicCircle(scene: Phaser.Scene, r: number, color = MAG.magic, color2 = MAG.magic2): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(color, 0.16);
  g.fillCircle(0, 0, r);
  g.lineStyle(Math.max(2, r * 0.06), color, 1);
  g.strokeCircle(0, 0, r);
  g.lineStyle(Math.max(1.5, r * 0.035), color2, 1);
  g.strokeCircle(0, 0, r * 0.78);
  // 바깥 고리의 작은 점들
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    g.fillStyle(i % 3 === 0 ? MAG.glow : color2, 1);
    g.fillCircle(Math.cos(a) * r * 0.89, Math.sin(a) * r * 0.89, Math.max(1.5, r * (i % 3 === 0 ? 0.07 : 0.04)));
  }
  // 가운데 8각 별꽃 무늬
  const pts = starPoints(0, 0, r * 0.6, r * 0.3, 8, 0);
  g.lineStyle(Math.max(1.5, r * 0.035), 0xffffff, 0.9);
  g.strokePoints(pts, true);
  g.fillStyle(MAG.glow, 0.9);
  g.fillCircle(0, 0, r * 0.12);
  c.add(g);
  return c;
}

/** 빛의 탄환: 하얀 핵 + 색 고리 + 네 갈래 반짝임 */
export function makeStarBullet(scene: Phaser.Scene, color = MAG.magic, size = 1): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(color, 0.35);
  g.fillCircle(0, 0, 16 * size);
  g.fillStyle(color, 1);
  g.fillCircle(0, 0, 9 * size);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(0, 0, 5 * size);
  const s = scene.add.graphics();
  s.fillStyle(0xffffff, 1);
  s.fillPoints(starPoints(0, 0, 20 * size, 3.5 * size, 4, 0), true);
  c.add([g, s]);
  scene.tweens.add({ targets: s, angle: 360, duration: 500, repeat: -1 });
  return c;
}

/** 유성: 빛나는 별 모양 돌 */
export function makeMeteor(scene: Phaser.Scene, size = 1): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(MAG.glow, 0.4);
  g.fillCircle(0, 0, 20 * size);
  star(g, 0, 0, 15 * size, MAG.gold, 2.5);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(-3 * size, -3 * size, 4 * size);
  c.add(g);
  scene.tweens.add({ targets: c, angle: 360, duration: 700, repeat: -1 });
  return c;
}

/** 원형 마법 보호막 */
export function makeMagicShield(scene: Phaser.Scene): C {
  const c = scene.add.container(0, 0);
  // 바깥 상자는 세로로 긴 모양, 안쪽 무늬만 돈다 (회전하며 찌그러지지 않게)
  const holder = scene.add.container(0, 0);
  const ring = makeMagicCircle(scene, 92, MAG.magic, MAG.magic2);
  ring.setAlpha(0.85);
  holder.add(ring);
  holder.setScale(0.8, 1);
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.12);
  g.fillEllipse(0, 0, 150, 184);
  c.add([g, holder]);
  scene.tweens.add({ targets: ring, angle: 360, duration: 6000, repeat: -1 });
  return c;
}

/** 회복 문양: 바닥에 눕힌 초록·금색 꽃 모양 원 */
export function makeHealSigil(scene: Phaser.Scene): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(0x7dffb0, 0.22);
  g.fillCircle(0, 0, 80);
  g.lineStyle(5, 0x7dffb0, 1);
  g.strokeCircle(0, 0, 80);
  g.lineStyle(3, MAG.gold, 1);
  g.strokeCircle(0, 0, 62);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.fillStyle(0xb8ffd4, 0.9);
    g.fillEllipse(Math.cos(a) * 36, Math.sin(a) * 36, 30, 30);
  }
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(-6, -20, 12, 40, 4);
  g.fillRoundedRect(-20, -6, 40, 12, 4);
  c.add(g);
  c.setScale(1, 0.3);
  return c;
}
