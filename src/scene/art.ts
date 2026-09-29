// 절차적 그래픽 (자체 제작 임시 에셋). 부위별 Graphics/Container로 나눠 애니메이션한다.
// 구도: 로봇은 뒷모습(왼쪽 아래), 적은 앞모습(오른쪽 위). 좌표는 발바닥(0,0) 기준.
import Phaser from 'phaser';

type G = Phaser.GameObjects.Graphics;
type C = Phaser.GameObjects.Container;

export const PAL = {
  outline: 0x16203a,
  armor: 0x3b78e6,
  armorDark: 0x2a54a6,
  armorDeep: 0x1f3f82,
  trim: 0xffc933,
  joint: 0x243150,
  white: 0xeef3fb,
  visor: 0x5cf2ff,
};

const V = (x: number, y: number) => new Phaser.Math.Vector2(x, y);

function smooth(points: [number, number][], seg = 48): Phaser.Math.Vector2[] {
  return new Phaser.Curves.Spline(points.map(([x, y]) => V(x, y))).getPoints(seg);
}

function blob(g: G, pts: [number, number][], fill: number, lw = 3, line = PAL.outline) {
  const closed = [...pts, pts[0], pts[1]];
  const p = smooth(closed, pts.length * 10).slice(0, -8);
  g.fillStyle(fill, 1);
  g.fillPoints(p, true);
  if (lw > 0) {
    g.lineStyle(lw, line, 1);
    g.strokePoints(p, true);
  }
}

function rrect(g: G, x: number, y: number, w: number, h: number, r: number, fill: number, lw = 3, line = PAL.outline) {
  g.fillStyle(fill, 1);
  g.fillRoundedRect(x, y, w, h, r);
  if (lw > 0) {
    g.lineStyle(lw, line, 1);
    g.strokeRoundedRect(x, y, w, h, r);
  }
}

function circle(g: G, x: number, y: number, r: number, fill: number, lw = 3, line = PAL.outline) {
  g.fillStyle(fill, 1);
  g.fillCircle(x, y, r);
  if (lw > 0) {
    g.lineStyle(lw, line, 1);
    g.strokeCircle(x, y, r);
  }
}

function tri(g: G, pts: number[], fill: number, lw = 2.5) {
  g.fillStyle(fill, 1);
  g.fillTriangle(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
  if (lw > 0) {
    g.lineStyle(lw, PAL.outline, 1);
    g.strokeTriangle(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
  }
}

// ───────────────────────── 배경 ─────────────────────────

export function drawBackground(scene: Phaser.Scene, enemyPad: { x: number; y: number }, robotPad: { x: number; y: number }): G {
  const g = scene.add.graphics();
  g.fillGradientStyle(0x5ab8ff, 0x5ab8ff, 0xcdeeff, 0xcdeeff, 1);
  g.fillRect(-1500, -1200, 3400, 1330);
  // 먼 산
  g.fillStyle(0x9cc3e8, 1);
  g.fillPoints([V(-400, 130), V(-20, 70), V(60, 95), V(150, 50), V(240, 90), V(330, 40), V(460, 95), V(900, 70), V(900, 140), V(-400, 140)], true);
  g.fillStyle(0x8a7a8f, 1);
  g.fillPoints([V(120, 120), V(160, 58), V(176, 58), V(220, 120)], true);
  g.fillStyle(0xff8c42, 1);
  g.fillRect(160, 55, 16, 5);
  // 들판 (위쪽은 멀리, 아래쪽은 가까이)
  g.fillGradientStyle(0x9fd67a, 0x9fd67a, 0x6fb24c, 0x6fb24c, 1);
  g.fillRect(-1500, 118, 3400, 1200);
  g.fillStyle(0x8cc86a, 1);
  for (const [x, y, w] of [[40, 160, 60], [210, 190, 80], [350, 230, 50], [20, 240, 70], [260, 270, 90]] as const) g.fillEllipse(x, y, w, w * 0.2);
  // 적 발판
  g.fillStyle(0x5a9a3c, 1);
  g.fillEllipse(enemyPad.x, enemyPad.y + 6, 190, 44);
  g.fillStyle(0xc9b27a, 1);
  g.fillEllipse(enemyPad.x, enemyPad.y, 176, 36);
  g.fillStyle(0xdac48c, 1);
  g.fillEllipse(enemyPad.x - 10, enemyPad.y - 3, 130, 20);
  // 로봇 발판
  g.fillStyle(0x4f8a34, 1);
  g.fillEllipse(robotPad.x, robotPad.y + 8, 280, 70);
  g.fillStyle(0xb9a06a, 1);
  g.fillEllipse(robotPad.x, robotPad.y, 262, 58);
  g.fillStyle(0xcab27a, 1);
  g.fillEllipse(robotPad.x - 16, robotPad.y - 6, 190, 30);
  // 풀
  g.fillStyle(0x4c8a36, 1);
  for (const x of [10, 70, 190, 240, 370, 390]) {
    const y = x < 200 ? 200 + (x % 30) : 170 + (x % 20);
    g.fillTriangle(x, y, x + 4, y - 12, x + 8, y);
    g.fillTriangle(x + 6, y, x + 11, y - 9, x + 15, y);
  }
  return g;
}

// ───────────────────────── 로봇 (뒷모습) ─────────────────────────

/**
 * 관절 단위로 나눈 로봇. 팔은 어깨(gun/leftArm) → 팔꿈치(forearm/leftFore) 두 마디라서
 * 충전(몸 낮춤) → 무장 전개(팔 들고 팔꿈치 폄) → 발사 반동(아래팔이 튐) → 피격(몸 비틀림)·방어(왼팔 올림)를 따로 움직인다.
 */
export interface RobotParts {
  root: C;
  body: C;
  /** 다리: 발바닥 기준으로 세로를 줄이면 무릎을 굽힌다 */
  legs: G;
  head: C;
  visor: G;
  /** 대포 팔 윗마디 (어깨 축) */
  gun: C;
  gunShoulder: { x: number; y: number };
  /** 대포 팔 아랫마디 (팔꿈치 축). 발사 반동이 여기서 튄다 */
  forearm: C;
  /** 아래팔 양옆 냉각 날개: 무장 전개 때 펼친다 */
  fins: G;
  barrel: C;
  muzzleGlow: G;
  /** 왼팔 윗마디 (어깨 축) */
  leftArm: C;
  /** 왼팔 아랫마디 (팔꿈치 축). 손목 광선총이 달려 있다 */
  leftFore: C;
  wristGlow: G;
  pod: C;
  hatch: G;
  podMouths: { x: number; y: number }[];
  gauge: G;
  thrustL: G;
  thrustR: G;
  gaugeCenter: { x: number; y: number };
}

export function makeRobot(scene: Phaser.Scene): RobotParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);

  // 다리 (뒤에서 본 모습, 아래는 화면 밖으로 잘린다)
  const legs = scene.add.graphics();
  rrect(legs, -52, -78, 38, 80, 12, PAL.armorDark);
  rrect(legs, 14, -78, 38, 80, 12, PAL.armorDark);
  legs.fillStyle(PAL.trim, 1);
  legs.fillRect(-48, -46, 30, 6);
  legs.fillRect(18, -46, 30, 6);
  rrect(legs, -30, -96, 60, 26, 8, PAL.joint);

  // 왼팔 (화면 왼쪽, 늘어뜨림): 어깨 → 팔꿈치 → 손목 광선총
  const leftArm = scene.add.container(-66, -150);
  const la = scene.add.graphics();
  rrect(la, -12, 4, 24, 36, 9, PAL.armorDark);
  circle(la, 0, 38, 8, PAL.joint, 2.5);
  const leftFore = scene.add.container(0, 38);
  const lf = scene.add.graphics();
  rrect(lf, -13, -2, 26, 36, 10, PAL.armor);
  lf.fillStyle(PAL.trim, 1);
  lf.fillRect(-13, 8, 26, 4);
  // 손목 광선총 (작은 총구)
  rrect(lf, -6, 30, 12, 10, 3, PAL.joint, 2.5);
  circle(lf, 0, 44, 10, PAL.white);
  const wristGlow = scene.add.graphics();
  wristGlow.fillStyle(0xfff3a0, 1);
  wristGlow.fillCircle(0, 0, 9);
  wristGlow.setPosition(0, 50).setAlpha(0);
  leftFore.add([lf, wristGlow]);
  leftArm.add([la, leftFore]);

  // 몸통 뒷면 + 등 추진기
  const torso = scene.add.graphics();
  blob(torso, [[-58, -170], [0, -182], [58, -170], [62, -110], [40, -86], [-40, -86], [-62, -110]], PAL.armor);
  rrect(torso, -38, -160, 76, 66, 14, PAL.armorDeep);
  torso.lineStyle(3, PAL.outline, 0.6);
  torso.lineBetween(-30, -104, -18, -104);
  torso.lineBetween(18, -104, 30, -104);
  // 추진기 노즐
  rrect(torso, -40, -98, 22, 16, 5, PAL.joint);
  rrect(torso, 18, -98, 22, 16, 5, PAL.joint);
  const thrustL = scene.add.graphics();
  const thrustR = scene.add.graphics();
  for (const [t, x] of [[thrustL, -29], [thrustR, 29]] as const) {
    t.fillStyle(0xffb13b, 1);
    t.fillTriangle(-8, 0, 8, 0, 0, 22);
    t.fillStyle(0xfff2a8, 1);
    t.fillTriangle(-4, 0, 4, 0, 0, 12);
    t.setPosition(x, -82);
    t.setAlpha(0);
  }
  // 에너지 게이지 (자모를 넣을 때마다 한 칸씩 켜진다)
  const gaugeBg = scene.add.graphics();
  rrect(gaugeBg, -12, -154, 24, 56, 8, 0x0c1426, 3);
  const gauge = scene.add.graphics();

  // 오른쪽 어깨 보호대 (대포 팔 위)
  const shoulderR = scene.add.graphics();
  blob(shoulderR, [[34, -176], [70, -182], [88, -160], [80, -136], [44, -138]], PAL.armor);
  shoulderR.fillStyle(PAL.trim, 1);
  shoulderR.fillRoundedRect(50, -172, 28, 6, 3);

  // 왼쪽 어깨 미사일 포드 (덮개가 열린다)
  const pod = scene.add.container(-58, -186);
  const pg = scene.add.graphics();
  rrect(pg, -26, -18, 52, 34, 8, PAL.armorDark);
  const podMouths = [
    { x: -14, y: -4 },
    { x: -4, y: -4 },
    { x: 6, y: -4 },
    { x: 16, y: -4 },
  ];
  for (const m of podMouths) circle(pg, m.x, m.y, 4, 0x0c1426, 2);
  const hatch = scene.add.graphics();
  rrect(hatch, 0, -8, 52, 18, 6, PAL.armor);
  hatch.fillStyle(PAL.trim, 1);
  hatch.fillRect(6, -2, 40, 4);
  hatch.setPosition(-26, -6);
  pod.add([pg, hatch]);
  pod.setScale(0.92);

  // 머리 (뒤통수, 오른쪽으로 살짝 돌아 바이저 끝이 보인다)
  const head = scene.add.container(10, -184);
  const hg = scene.add.graphics();
  rrect(hg, -8, -4, 16, 10, 4, PAL.joint);
  hg.lineStyle(3, PAL.outline, 1);
  hg.lineBetween(-12, -36, -18, -54);
  circle(hg, -18, -56, 5, PAL.trim, 2.5);
  blob(hg, [[-26, -8], [-28, -30], [-6, -44], [22, -38], [30, -18], [22, -2], [-10, 0]], PAL.white);
  hg.fillStyle(PAL.armor, 1);
  hg.fillRoundedRect(-20, -26, 26, 6, 3);
  const visor = scene.add.graphics();
  visor.fillStyle(PAL.visor, 1);
  visor.fillRoundedRect(22, -30, 7, 16, 3);
  head.add([hg, visor]);

  // 대포 팔: 어깨(윗마디)를 축으로 적을 향해 들고, 팔꿈치(아랫마디)에서 포신이 나온다
  const gunShoulder = { x: 62, y: -154 };
  const gun = scene.add.container(gunShoulder.x, gunShoulder.y);
  const ga = scene.add.graphics();
  rrect(ga, -12, 0, 24, 40, 9, PAL.armorDark);
  circle(ga, 0, 38, 9, PAL.joint, 2.5);
  const forearm = scene.add.container(0, 38);
  const fins = scene.add.graphics();
  fins.fillStyle(PAL.armorDeep, 1);
  fins.lineStyle(2.5, PAL.outline, 1);
  for (const s of [-1, 1]) {
    const pts = [V(s * 14, 2), V(s * 30, 10), V(s * 30, 24), V(s * 14, 30)];
    fins.fillPoints(pts, true);
    fins.strokePoints(pts, true);
    fins.fillStyle(PAL.visor, 1);
    fins.fillRect(s > 0 ? 18 : -26, 14, 8, 3);
    fins.fillStyle(PAL.armorDeep, 1);
  }
  fins.setScale(0.2, 1);
  const fa = scene.add.graphics();
  rrect(fa, -15, -4, 30, 40, 11, PAL.armor);
  fa.fillStyle(PAL.trim, 1);
  fa.fillRect(-15, 10, 30, 5);
  const barrel = scene.add.container(0, 22);
  const bg = scene.add.graphics();
  rrect(bg, -10, 0, 20, 58, 5, PAL.joint);
  bg.fillStyle(PAL.trim, 1);
  bg.fillRect(-10, 16, 20, 5);
  bg.fillRect(-10, 32, 20, 5);
  rrect(bg, -14, 52, 28, 12, 4, PAL.trim);
  barrel.add(bg);
  barrel.setScale(1, 0.15);
  const muzzleGlow = scene.add.graphics();
  muzzleGlow.fillStyle(0xfff3a0, 1);
  muzzleGlow.fillCircle(0, 0, 12);
  // 포신을 다 폈을 때의 포구 (포신이 접히면 muzzle()이 비율로 당긴다)
  muzzleGlow.setPosition(0, 88);
  muzzleGlow.setAlpha(0);
  forearm.add([fins, barrel, fa, muzzleGlow]);
  gun.add([ga, forearm]);

  body.add([legs, leftArm, torso, thrustL, thrustR, gaugeBg, gauge, pod, head, gun, shoulderR]);
  root.add(body);

  return {
    root,
    body,
    legs,
    head,
    visor,
    gun,
    gunShoulder,
    forearm,
    fins,
    barrel,
    muzzleGlow,
    leftArm,
    leftFore,
    wristGlow,
    pod,
    hatch,
    podMouths,
    gauge,
    thrustL,
    thrustR,
    gaugeCenter: { x: 0, y: -126 },
  };
}

export function drawGauge(g: G, frac: number, color = PAL.visor): void {
  g.clear();
  const segs = 5;
  const lit = Math.round(Math.max(0, Math.min(1, frac)) * segs);
  for (let i = 0; i < segs; i++) {
    const y = -106 - i * 10;
    g.fillStyle(i < lit ? color : 0x223252, 1);
    g.fillRoundedRect(-8, y, 16, 7, 2);
  }
}

// ───────────────────────── 적 (앞모습) ─────────────────────────

export interface FoeParts {
  root: C;
  body: C;
  head: C;
  jaw: G | null;
  aura: G;
  height: number;
  mouth: { x: number; y: number };
  /** 꼬리 곤봉 (갑옷 공룡만) */
  tail?: C;
}

function eye(g: G, x: number, y: number, r: number, look = -0.35) {
  circle(g, x, y, r, 0xffffff, 2.5);
  g.fillStyle(PAL.outline, 1);
  g.fillCircle(x + r * look, y + r * 0.3, r * 0.5);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(x + r * look - r * 0.15, y + r * 0.12, r * 0.16);
}

function makeAura(scene: Phaser.Scene, r: number, y: number): G {
  const a = scene.add.graphics();
  a.fillStyle(0xff6a3d, 0.25);
  a.fillCircle(0, y, r);
  a.fillStyle(0xffb13b, 0.25);
  a.fillCircle(0, y, r * 0.7);
  a.setAlpha(0);
  return a;
}

export function makeDino(scene: Phaser.Scene): FoeParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);
  const green = 0x5fc24a;
  const dark = 0x3f8f35;
  const aura = makeAura(scene, 62, -55);
  const g = scene.add.graphics();
  // 꼬리 (옆으로 살짝 보임)
  blob(g, [[20, -20], [48, -26], [64, -40], [50, -18], [24, -8]], dark);
  // 다리
  rrect(g, -26, -16, 18, 18, 7, dark);
  rrect(g, 8, -16, 18, 18, 7, dark);
  g.fillStyle(0xffffff, 1);
  for (const x of [-24, -18, -12, 10, 16, 22]) g.fillTriangle(x, 2, x + 3, 6, x + 5, 2);
  // 몸
  blob(g, [[-30, -14], [-34, -44], [-18, -66], [18, -66], [34, -44], [30, -14], [0, -6]], green);
  blob(g, [[-18, -16], [-20, -42], [0, -54], [20, -42], [18, -16], [0, -10]], 0xd6f2a8, 0);
  // 작은 팔
  g.lineStyle(7, dark, 1);
  g.lineBetween(-26, -46, -38, -38);
  g.lineBetween(26, -46, 38, -38);
  const head = scene.add.container(0, -74);
  const hg = scene.add.graphics();
  // 등 가시
  for (const x of [-18, -4, 10]) tri(hg, [x - 6, -26, x + 1, -44, x + 8, -26], 0xff9d2e);
  blob(hg, [[-34, -4], [-30, -28], [0, -38], [30, -28], [34, -4], [20, 12], [-20, 12]], green);
  eye(hg, -13, -16, 9);
  eye(hg, 13, -16, 9);
  // 화난 눈썹
  hg.lineStyle(4, PAL.outline, 1);
  hg.lineBetween(-22, -28, -6, -24);
  hg.lineBetween(22, -28, 6, -24);
  hg.fillStyle(PAL.outline, 1);
  hg.fillCircle(-6, 2, 2);
  hg.fillCircle(6, 2, 2);
  const jaw = scene.add.graphics();
  blob(jaw, [[-20, 0], [20, 0], [14, 14], [-14, 14]], 0xc2403a, 2.5);
  jaw.fillStyle(0xffffff, 1);
  for (let x = -16; x < 16; x += 8) jaw.fillTriangle(x, 0, x + 4, 6, x + 8, 0);
  jaw.setPosition(0, 6);
  jaw.setScale(1, 0.4);
  head.add([jaw, hg]);
  body.add([aura, g, head]);
  root.add(body);
  return { root, body, head, jaw, aura, height: 110, mouth: { x: 0, y: -64 } };
}

export function makeImp(scene: Phaser.Scene): FoeParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);
  const purple = 0xa45cf0;
  const aura = makeAura(scene, 52, -40);
  const g = scene.add.graphics();
  rrect(g, -24, -12, 16, 14, 6, 0x7a3fc0);
  rrect(g, 8, -12, 16, 14, 6, 0x7a3fc0);
  g.lineStyle(7, 0x7a3fc0, 1);
  g.lineBetween(-34, -40, -48, -30);
  g.lineBetween(34, -40, 48, -30);
  const head = scene.add.container(0, -40);
  const hg = scene.add.graphics();
  tri(hg, [-24, -28, -34, -54, -12, -34], 0xffe08a);
  tri(hg, [24, -28, 34, -54, 12, -34], 0xffe08a);
  blob(hg, [[-38, 0], [-34, -28], [0, -40], [34, -28], [38, 0], [20, 30], [-20, 30]], purple);
  eye(hg, 0, -8, 14);
  hg.lineStyle(3, PAL.outline, 1);
  hg.beginPath();
  hg.arc(0, 12, 10, 0.2, Math.PI - 0.2);
  hg.strokePath();
  hg.fillStyle(0xffffff, 1);
  hg.fillTriangle(-6, 15, -3, 20, 0, 15);
  hg.fillTriangle(2, 15, 5, 20, 8, 15);
  head.add(hg);
  body.add([aura, g, head]);
  root.add(body);
  return { root, body, head, jaw: null, aura, height: 84, mouth: { x: 0, y: -30 } };
}

export function makeCharger(scene: Phaser.Scene): FoeParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);
  const orange = 0xf07a3a;
  const dark = 0xc4552a;
  const aura = makeAura(scene, 70, -50);
  const g = scene.add.graphics();
  for (const x of [-40, -18, 6, 28]) rrect(g, x, -18, 16, 20, 6, dark);
  blob(g, [[-50, -14], [-52, -44], [0, -60], [52, -44], [50, -14], [0, -6]], orange);
  const head = scene.add.container(0, -58);
  const hg = scene.add.graphics();
  // 프릴
  blob(hg, [[-50, -10], [-40, -44], [0, -56], [40, -44], [50, -10], [0, 0]], 0xffd166);
  for (const [x, y] of [[-40, -30], [-20, -48], [0, -52], [20, -48], [40, -30]] as const) circle(hg, x, y, 4, 0xff9d2e, 2);
  blob(hg, [[-28, 6], [-30, -22], [0, -32], [30, -22], [28, 6], [0, 22]], orange);
  // 뿔 셋
  tri(hg, [-18, -22, -26, -58, -8, -26], 0xfff4d6);
  tri(hg, [18, -22, 26, -58, 8, -26], 0xfff4d6);
  tri(hg, [-6, 4, 0, -12, 6, 4], 0xfff4d6);
  eye(hg, -13, -10, 7);
  eye(hg, 13, -10, 7);
  hg.lineStyle(4, PAL.outline, 1);
  hg.lineBetween(-22, -20, -6, -15);
  hg.lineBetween(22, -20, 6, -15);
  head.add(hg);
  body.add([aura, g, head]);
  root.add(body);
  return { root, body, head, jaw: null, aura, height: 116, mouth: { x: 0, y: -50 } };
}

/**
 * 갑옷 공룡: 낮고 넓은 몸, 등딱지 판과 곤봉 꼬리. 다른 적보다 옆으로 넓고 키가 낮아 실루엣만으로 구별된다.
 * tail은 꼬리 곤봉 휘두르기 공격에 쓴다.
 */
export function makeArmor(scene: Phaser.Scene): FoeParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);
  const olive = 0x7c8f4a;
  const dark = 0x56663a;
  const plate = 0xb7a98a;
  const aura = makeAura(scene, 74, -40);
  // 곤봉 꼬리: 몸 뒤 오른쪽에서 흔든다 (축 = 꼬리 뿌리)
  const tail = scene.add.container(40, -30);
  const tg = scene.add.graphics();
  blob(tg, [[-4, -8], [26, -18], [44, -30], [48, -22], [28, -6], [0, 6]], dark);
  circle(tg, 50, -30, 12, plate);
  for (const a of [0, 1.6, 3.2, 4.8]) tri(tg, [50 + Math.cos(a) * 10, -30 + Math.sin(a) * 10, 50 + Math.cos(a + 0.4) * 19, -30 + Math.sin(a + 0.4) * 19, 50 + Math.cos(a + 0.8) * 10, -30 + Math.sin(a + 0.8) * 10], 0xfff4d6, 2);
  tail.add(tg);
  const g = scene.add.graphics();
  // 짧고 굵은 네 다리
  for (const x of [-48, -24, 6, 30]) rrect(g, x, -16, 20, 18, 7, dark);
  blob(g, [[-58, -12], [-60, -34], [0, -46], [60, -34], [58, -12], [0, -4]], olive);
  // 등딱지 판 (육각 무늬 + 가시)
  const shell = scene.add.graphics();
  blob(shell, [[-54, -30], [-44, -62], [0, -74], [44, -62], [54, -30], [0, -24]], plate, 3);
  shell.lineStyle(2.5, 0x8a7c5e, 1);
  for (const [x, y] of [[-30, -46], [0, -54], [30, -46], [-14, -36], [14, -36]] as const) {
    const pts: Phaser.Math.Vector2[] = [];
    for (let k = 0; k < 6; k++) pts.push(V(x + Math.cos((k * Math.PI) / 3) * 10, y + Math.sin((k * Math.PI) / 3) * 7));
    shell.strokePoints(pts, true);
  }
  for (const x of [-40, -20, 0, 20, 40]) tri(shell, [x - 6, -62 + Math.abs(x) * 0.28, x, -80 + Math.abs(x) * 0.34, x + 6, -62 + Math.abs(x) * 0.28], 0xfff4d6, 2);
  // 머리: 낮고 넓게, 투구 같은 이마 판
  const head = scene.add.container(0, -28);
  const hg = scene.add.graphics();
  blob(hg, [[-26, 6], [-28, -12], [0, -22], [28, -12], [26, 6], [0, 14]], olive);
  blob(hg, [[-24, -10], [-18, -22], [18, -22], [24, -10], [0, -14]], plate, 2.5);
  eye(hg, -11, -4, 6);
  eye(hg, 11, -4, 6);
  hg.lineStyle(4, PAL.outline, 1);
  hg.lineBetween(-18, -13, -5, -9);
  hg.lineBetween(18, -13, 5, -9);
  hg.fillStyle(PAL.outline, 1);
  hg.fillCircle(-4, 8, 2);
  hg.fillCircle(4, 8, 2);
  head.add(hg);
  body.add([aura, tail, g, shell, head]);
  root.add(body);
  return { root, body, head, jaw: null, aura, height: 84, mouth: { x: 0, y: -24 }, tail };
}

/** 만화풍 명중 별: 뾰족한 흰 별 + 색 테두리. 명중 순간 한 박자만 보인다. */
export function makeImpactStar(scene: Phaser.Scene, color = 0xffd23f, spikes = 8): G {
  const g = scene.add.graphics();
  const outer: Phaser.Math.Vector2[] = [];
  const inner: Phaser.Math.Vector2[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes + 0.2;
    const r = i % 2 === 0 ? (i % 4 === 0 ? 34 : 26) : 13;
    outer.push(V(Math.cos(a) * r, Math.sin(a) * r * 0.85));
    inner.push(V(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62 * 0.85));
  }
  g.fillStyle(color, 1);
  g.fillPoints(outer, true);
  g.lineStyle(3, PAL.outline, 1);
  g.strokePoints(outer, true);
  g.fillStyle(0xffffff, 1);
  g.fillPoints(inner, true);
  return g;
}

/** 중간 보스: 대장 뿔공룡 (뿔공룡에 금관과 어깨 갑옷, 더 크게) */
export function makeChief(scene: Phaser.Scene): FoeParts {
  const p = makeCharger(scene);
  const armor = scene.add.graphics();
  // 어깨 갑옷
  blob(armor, [[-56, -40], [-44, -58], [-24, -54], [-30, -34]], 0x8a94a8, 3);
  blob(armor, [[56, -40], [44, -58], [24, -54], [30, -34]], 0x8a94a8, 3);
  for (const x of [-42, 42]) circle(armor, x, -48, 3.5, 0xffd23f, 2);
  p.body.addAt(armor, 2);
  const crown = scene.add.graphics();
  // 금관: 프릴 위에 얹는다
  crown.fillStyle(0xffd23f, 1);
  crown.lineStyle(3, PAL.outline, 1);
  const pts = [V(-22, -52), V(-22, -66), V(-12, -58), V(0, -72), V(12, -58), V(22, -66), V(22, -52)];
  crown.fillPoints(pts, true);
  crown.strokePoints(pts, true);
  circle(crown, 0, -60, 3.5, 0xff5a8a, 2);
  p.head.add(crown);
  p.aura.setScale(1.15);
  return { ...p, height: 130 };
}

export function makeBoss(scene: Phaser.Scene): FoeParts {
  const root = scene.add.container(0, 0);
  const body = scene.add.container(0, 0);
  const teal = 0x2f8f7a;
  const dark = 0x1f6657;
  const aura = makeAura(scene, 110, -90);
  const g = scene.add.graphics();
  blob(g, [[50, -40], [96, -60], [118, -90], [96, -46], [56, -20]], dark);
  rrect(g, -52, -30, 34, 32, 10, dark);
  rrect(g, 18, -30, 34, 32, 10, dark);
  g.fillStyle(0xffffff, 1);
  for (const x of [-50, -40, -30, 20, 30, 40]) g.fillTriangle(x, 2, x + 4, 8, x + 8, 2);
  blob(g, [[-62, -24], [-70, -80], [-40, -126], [40, -126], [70, -80], [62, -24], [0, -12]], teal, 4);
  blob(g, [[-38, -26], [-44, -76], [0, -104], [44, -76], [38, -26], [0, -18]], 0xbfe8c4, 0);
  g.lineStyle(10, dark, 1);
  g.lineBetween(-50, -90, -70, -74);
  g.lineBetween(50, -90, 70, -74);
  const head = scene.add.container(0, -140);
  const hg = scene.add.graphics();
  for (const [x, y] of [[-40, -30], [-20, -46], [0, -52], [20, -46], [40, -30]] as const) tri(hg, [x - 9, y + 8, x, y - 16, x + 9, y + 8], 0x7b4ad6, 3);
  blob(hg, [[-56, 0], [-50, -34], [0, -46], [50, -34], [56, 0], [30, 16], [-30, 16]], teal, 4);
  // 빛나는 눈
  for (const x of [-22, 22]) {
    circle(hg, x, -16, 11, 0xfff06a, 3);
    hg.fillStyle(PAL.outline, 1);
    hg.fillEllipse(x - 3, -13, 5, 12);
  }
  hg.lineStyle(6, PAL.outline, 1);
  hg.lineBetween(-38, -32, -10, -24);
  hg.lineBetween(38, -32, 10, -24);
  hg.fillStyle(PAL.outline, 1);
  hg.fillCircle(-8, 4, 3);
  hg.fillCircle(8, 4, 3);
  const jaw = scene.add.graphics();
  blob(jaw, [[-40, 0], [40, 0], [30, 24], [-30, 24]], 0xa33a4a, 3);
  jaw.fillStyle(0xffffff, 1);
  for (let x = -36; x < 34; x += 10) jaw.fillTriangle(x, 0, x + 5, 9, x + 10, 0);
  jaw.setPosition(0, 10);
  jaw.setScale(1, 0.35);
  head.add([jaw, hg]);
  body.add([aura, g, head]);
  root.add(body);
  return { root, body, head, jaw, aura, height: 200, mouth: { x: 0, y: -126 } };
}

// ───────────────────────── 효과 ─────────────────────────

/** 공격 예고 표시. heavy = 강공격 직전 (붉은 두 겹 경고) */
export function makeWarning(scene: Phaser.Scene, heavy = false): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  const tri3 = (dx: number) => {
    g.fillStyle(heavy ? 0xff5a3d : 0xffd23f, 1);
    g.lineStyle(3, PAL.outline, 1);
    g.fillTriangle(dx, -16, dx + 16, 11, dx - 16, 11);
    g.strokeTriangle(dx, -16, dx + 16, 11, dx - 16, 11);
    g.fillStyle(heavy ? 0xffffff : PAL.outline, 1);
    g.fillRoundedRect(dx - 2.5, -8, 5, 11, 2);
    g.fillCircle(dx, 6.5, 2.6);
  };
  if (heavy) tri3(-12);
  tri3(heavy ? 12 : 0);
  c.add(g);
  return c;
}

/** 적 방패: 몸 앞의 푸른 돌 방패 막 (피해를 먼저 막고 깨진다) */
export function makeFoeShield(scene: Phaser.Scene, w: number, h: number): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(0x7fc8ff, 0.25);
  g.fillEllipse(0, 0, w, h);
  g.lineStyle(5, 0x3b8fd9, 0.95);
  g.strokeEllipse(0, 0, w, h);
  g.lineStyle(2, 0xffffff, 0.7);
  g.strokeEllipse(0, 0, w * 0.82, h * 0.82);
  // 반짝임
  g.fillStyle(0xffffff, 0.8);
  g.fillEllipse(-w * 0.22, -h * 0.28, w * 0.16, h * 0.08);
  c.add(g);
  return c;
}

export function makeGuard(scene: Phaser.Scene): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.fillStyle(0xc39bff, 0.22);
  g.fillEllipse(0, 0, 150, 190);
  g.lineStyle(4, 0xe6d4ff, 0.9);
  g.strokeEllipse(0, 0, 150, 190);
  g.lineStyle(1.5, 0xffffff, 0.45);
  for (let y = -70; y <= 70; y += 24) {
    for (let x = -50; x <= 50; x += 26) {
      const px = x + (((y + 70) / 24) % 2) * 13;
      const pts: Phaser.Math.Vector2[] = [];
      for (let k = 0; k < 6; k++) pts.push(V(px + Math.cos((k * Math.PI) / 3) * 9, y + Math.sin((k * Math.PI) / 3) * 9));
      g.strokePoints(pts, true);
    }
  }
  c.add(g);
  return c;
}

export function makeMissile(scene: Phaser.Scene): C {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  rrect(g, -4, -12, 8, 20, 3, PAL.white, 2);
  g.fillStyle(0xff5a5a, 1);
  g.fillTriangle(-4, -12, 4, -12, 0, -19);
  g.fillStyle(PAL.armor, 1);
  g.fillTriangle(-4, 6, -8, 10, -4, 2);
  g.fillTriangle(4, 6, 8, 10, 4, 2);
  c.add(g);
  return c;
}

/** 파티클용 작은 텍스처를 한 번 만든다. */
export function makeTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists('dot')) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(16, 16, 16);
  g.generateTexture('dot', 32, 32);
  g.clear();
  g.fillStyle(0xffffff, 1);
  const star: Phaser.Math.Vector2[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 16 : 7;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    star.push(V(16 + Math.cos(a) * r, 16 + Math.sin(a) * r));
  }
  g.fillPoints(star, true);
  g.generateTexture('star', 32, 32);
  g.destroy();
}
