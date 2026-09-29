// L3 동물 그림 묶음 2 (바다 동물·새·파충류·곤충·옛 동물: 그 동물만의 모양·무늬를 크게). 그림 규칙은 docs/picture-style.md.
import { INK, dot, blob, tube, sparkle, cheeks } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, rad: number): [number, number] => [
  r1(cx + r * Math.cos(rad)),
  r1(cy + r * Math.sin(rad)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5, p = 2.8) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke-width="2.5"/>` + dot(x + 0.3, y + 0.3, p);

/** 오른쪽 조각을 왼쪽에 거울로 */
const mirror = (s: string) => s + `<g transform="translate(100 0) scale(-1 1)">${s}</g>`;

const smile = (x: number, y: number, w = 4) => `<path d="M${x - w} ${y}q${w} ${r1(w * 0.8)} ${w * 2} 0" stroke-width="2.5"/>`;

const WAVE = (y: number) =>
  `<path d="M4 ${y}q7-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0" stroke="#3b8fe0" stroke-width="3"/>`;
const SEA = (y: number) =>
  `<path d="M4 ${y}q7-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0V96H4Z" fill="#bfe3f7" stroke="none"/>` + WAVE(y);
const bubbles = (xs: [number, number, number][]) =>
  xs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#dff3ff" stroke-width="2.5"/>`).join('');

/** 가지 */
const BRANCH = (y = 80) => tube(`M4 ${y}C30 ${y - 3} 60 ${y + 2} 96 ${y - 4}`, '#9a5b2e', 6);

/** 나선 (앵무조개·암모나이트): 로그 나선 점 */
function spiralPts(cx: number, cy: number, rmax: number, turns: number, grow: number) {
  const b = Math.log(grow) / (2 * Math.PI);
  const tmax = turns * 2 * Math.PI;
  const r = (t: number) => rmax * Math.exp(b * (t - tmax));
  const at = (t: number) => pt(cx, cy, r(t), t + Math.PI * 0.5);
  return { r, at, tmax };
}
function spiralPath(cx: number, cy: number, rmax: number, turns: number, grow: number) {
  const s = spiralPts(cx, cy, rmax, turns, grow);
  const pts: string[] = [];
  for (let t = 0; t <= s.tmax + 1e-6; t += Math.PI / 12) pts.push(s.at(t).join(' '));
  return `M${pts.join('L')}`;
}
function ammoniteRibs(cx: number, cy: number, rmax: number, turns: number, grow: number) {
  const s = spiralPts(cx, cy, rmax, turns, grow);
  let d = '';
  for (let t = s.tmax - 2 * Math.PI + Math.PI / 9; t < s.tmax - 0.05; t += Math.PI / 9) {
    const [ax, ay] = s.at(t - 2 * Math.PI);
    const [bx, by] = s.at(t);
    d += `M${ax} ${ay}L${bx} ${by}`;
  }
  for (let t = s.tmax - 4 * Math.PI + Math.PI / 6; t < s.tmax - 2 * Math.PI; t += Math.PI / 6) {
    const [ax, ay] = s.at(t - 2 * Math.PI);
    const [bx, by] = s.at(t);
    d += `M${ax} ${ay}L${bx} ${by}`;
  }
  return d;
}

/** 3차 베지어 위의 점 (뱀 무늬 놓기) */
type P = [number, number];
function bez(p0: P, p1: P, p2: P, p3: P, t: number): P {
  const u = 1 - t;
  return [
    r1(u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]),
    r1(u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]),
  ];
}

/** 게 다리 (오른쪽 네 개, 거울로 왼쪽) */
function crabLegs(roots: P[], knees: P[], feet: P[], fill: string, w: number) {
  return roots.map((r, i) => tube(`M${r[0]} ${r[1]}L${knees[i][0]} ${knees[i][1]}L${feet[i][0]} ${feet[i][1]}`, fill, w)).join('');
}

/** 옆모습 작은 새 (오른쪽 봄). c: 몸·날개·머리·배 색, extra: 머리 무늬 등 */
function songbird(c: { body: string; wing: string; head: string; belly?: string; tail?: string }, extra = '', bill = '') {
  return (
    `<path d="M32 62L10 80L17 86L38 70Z" fill="${c.tail ?? c.wing}"/>` +
    `<ellipse cx="46" cy="58" rx="23" ry="17" transform="rotate(-18 46 58)" fill="${c.body}"/>` +
    (c.belly ? `<path d="M30 70C42 78 62 72 68 54C60 62 46 68 30 70Z" fill="${c.belly}"/>` : '') +
    `<path d="M28 56C34 46 50 46 58 52C52 64 40 68 28 66Z" fill="${c.wing}"/>` +
    `<path d="M36 56l8 6M42 52l8 6" stroke="${INK}" stroke-width="2"/>` +
    `<circle cx="64" cy="38" r="14" fill="${c.head}"/>` +
    extra +
    (bill || `<path d="M77 34L88 38L77 42Z" fill="#3a3a44"/>`) +
    `<circle cx="68" cy="36" r="3.4" fill="#fff" stroke-width="2"/>` +
    dot(68.6, 36.3, 2)
  );
}
const FEET = `<path d="M44 72L42 80M52 72L52 80" stroke-width="3"/>`;

// 비단뱀 몸 곡선
const PY: [P, P, P, P][] = [
  [
    [8, 60],
    [16, 34],
    [34, 30],
    [44, 46],
  ],
  [
    [44, 46],
    [52, 60],
    [58, 70],
    [70, 64],
  ],
  [
    [70, 64],
    [82, 58],
    [80, 40],
    [72, 32],
  ],
];
const pyPath = `M${PY[0][0].join(' ')}` + PY.map((s) => `C${s[1].join(' ')} ${s[2].join(' ')} ${s[3].join(' ')}`).join('');
const pySpots = PY.flatMap((s, i) =>
  [0.2, 0.5, 0.8].map((t, k) => {
    const [x, y] = bez(...s, t);
    return `<ellipse cx="${x}" cy="${y}" rx="4" ry="3.2" fill="${(i + k) % 2 ? '#6b3e26' : '#9a5b2e'}" stroke="none"/>`;
  }),
).join('');

export const PICS: Record<string, string> = {
  // ── 바다 동물 ──
  매너티:
    bubbles([
      [90, 24, 3],
      [94, 15, 2.2],
    ]) +
    `<path d="M22 56C14 42 4 44 4 56C4 70 16 74 24 62Z" fill="#8791a6"/>` +
    `<path d="M18 58C18 40 40 32 60 33C76 34 88 42 90 54C91 64 84 70 72 69C58 73 34 73 24 67C20 64 18 61 18 58Z" fill="#a3acbf"/>` +
    `<path d="M60 64C56 74 60 82 67 80C71 76 70 70 68 64Z" fill="#8791a6"/>` +
    `<path d="M36 40q-3 8 0 16M46 37q-3 8 0 16" stroke="#8791a6" stroke-width="2.5"/>` +
    `<ellipse cx="83" cy="57" rx="9" ry="7.5" fill="#c6ccd9"/>` +
    dot(80, 55, 1.2) +
    dot(84, 54, 1.2) +
    dot(86, 58, 1.2) +
    dot(73, 46, 2.8) +
    `<path d="M78 63q4 2 8-1" stroke-width="2.5"/>`,

  물범:
    `<path d="M6 82L14 72H86L94 82L90 92H10Z" fill="#e3f2ff"/>` +
    `<path d="M16 74L4 64L6 76L4 86L16 80Z" fill="#aab2c4"/>` +
    `<path d="M12 76C14 62 28 58 44 58C56 58 62 50 64 42C66 32 72 28 78 28C88 28 94 36 92 48C90 62 82 72 72 78C60 82 26 82 14 80Z" fill="#c9cfdb"/>` +
    [
      [28, 68],
      [40, 64],
      [50, 72],
      [36, 74],
      [62, 66],
      [70, 56],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#7f889e'))
      .join('') +
    `<path d="M66 68C64 78 70 82 78 80C77 75 74 70 70 66Z" fill="#aab2c4"/>` +
    `<circle cx="78" cy="38" r="15" fill="#c9cfdb"/>` +
    dot(72, 35, 3.8) +
    dot(85, 35, 3.8) +
    dot(73, 34, 1.2, '#fff') +
    dot(86, 34, 1.2, '#fff') +
    `<ellipse cx="75.5" cy="45" rx="4" ry="3" fill="#eef1f7" stroke-width="2"/><ellipse cx="81.5" cy="45" rx="4" ry="3" fill="#eef1f7" stroke-width="2"/>` +
    dot(78.5, 42, 2) +
    `<path d="M71 45h-8M71 47l-7 3M86 45h8M86 47l7 3" stroke-width="1.8"/>`,

  향유고래:
    WAVE(88) +
    `<path d="M17 26C15 18 11 14 6 12M17 26C17 17 19 11 24 7M17 26C13 20 8 20 4 22" stroke="#4a90e2" stroke-width="3.5"/>` +
    `<path d="M8 40C8 30 14 28 24 28H56C70 28 78 38 84 46L93 36C97 40 96 48 92 52C96 56 97 64 93 68L84 58C76 66 66 70 54 70H24C14 70 8 64 8 56Z" fill="#6f7c93"/>` +
    `<path d="M14 60C22 67 36 67 48 64" stroke-width="3"/>` +
    `<path d="M62 36q-2 5 0 10M70 40q-2 5 0 10" stroke="#55607a" stroke-width="2.5"/>` +
    dot(44, 50, 2.6) +
    `<path d="M62 64L68 74L72 66Z" fill="#5d6982"/>`,

  혹등고래:
    WAVE(90) +
    `<path d="M16 46C12 38 7 32 3 28C9 27 14 31 18 38C20 31 25 27 30 26C26 33 22 41 20 48Z" fill="#34405e"/>` +
    `<path d="M16 46C26 40 40 36 56 36C72 36 84 42 94 52C84 58 70 60 52 60C36 60 24 56 16 46Z" fill="#34405e"/>` +
    `<path d="M58 58C72 59 84 57 94 52C86 62 72 64 58 62Z" fill="#dfe8f5"/>` +
    `<path d="M66 60.5L86 58" stroke="#8a96b0" stroke-width="2"/>` +
    `<path d="M40 38L46 32L50 37Z" fill="#34405e"/>` +
    `<path d="M58 56C52 68 42 80 26 88C34 91 48 84 58 72C64 66 66 60 64 56Z" fill="#fff"/>` +
    `<path d="M44 76q2 2 4 0M36 82q2 2 4 0" stroke-width="2"/>` +
    dot(76, 43, 2.2, '#8a96b0') +
    dot(82, 46, 2.2, '#8a96b0') +
    dot(70, 41, 2.2, '#8a96b0') +
    dot(78, 51, 2.3, '#fff'),

  흰수염고래:
    WAVE(88) +
    `<path d="M22 36V18" stroke="#4a90e2" stroke-width="5"/>` +
    `<circle cx="22" cy="13" r="5" fill="#cfeeff" stroke-width="2.5"/><circle cx="15" cy="17" r="4" fill="#cfeeff" stroke-width="2.5"/><circle cx="29" cy="17" r="4" fill="#cfeeff" stroke-width="2.5"/>` +
    `<path d="M4 50C6 43 14 38 26 38C48 38 70 42 82 48L90 39C95 42 96 49 92 52C96 55 95 62 90 65L82 56C70 62 46 66 26 66C14 66 6 60 4 54Z" fill="#4d7fbf"/>` +
    `<path d="M5 52C14 53 22 52 30 49" stroke-width="3"/>` +
    `<path d="M9 53v5M14 53v5M19 52v5M24 51v5" stroke="#fff" stroke-width="2.4"/>` +
    `<path d="M10 60C24 64 40 64 54 61" stroke="#a8c8f0" stroke-width="2.5"/>` +
    `<path d="M66 44L71 38L73 45Z" fill="#4d7fbf"/>` +
    [
      [40, 46],
      [52, 49],
      [62, 52],
      [46, 55],
    ]
      .map(([x, y]) => dot(x, y, 2.2, '#8fb3e0'))
      .join('') +
    dot(28, 46, 2.3),

  벨루가:
    `<circle cx="50" cy="52" r="44" fill="#bfe3f7" stroke="none"/>` +
    `<path d="M16 62L6 50L8 62L6 74Z" fill="#f7fafd"/>` +
    `<path d="M12 62C16 50 30 44 46 44C56 44 60 32 72 28C86 25 95 36 94 48C93 58 85 64 74 64C58 70 32 72 18 68Z" fill="#f7fafd"/>` +
    `<path d="M58 64C56 74 60 79 67 77C67 72 65 68 63 64Z" fill="#e3ebf5"/>` +
    dot(76, 45, 2.8) +
    `<path d="M80 55q6 4 13-1" stroke-width="2.5"/>` +
    `<circle cx="72" cy="54" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    bubbles([
      [86, 16, 3],
      [92, 22, 2],
    ]),

  고래상어:
    `<path d="M14 50L4 28C10 30 14 38 18 46Z" fill="#4a5f88"/><path d="M14 52L6 68C11 66 15 60 18 56Z" fill="#4a5f88"/>` +
    `<path d="M12 50C20 44 30 42 40 42L50 40L56 28L64 40C74 40 86 42 94 48C96 52 96 56 92 58C80 62 60 64 42 62C30 62 18 58 12 50Z" fill="#4a5f88"/>` +
    `<path d="M40 61C60 63 80 61 93 57C84 64 60 66 42 64Z" fill="#dfe8f5"/>` +
    `<path d="M80 55H94" stroke-width="3"/>` +
    `<path d="M62 58L58 72L70 60Z" fill="#3e5078"/>` +
    [
      [24, 49],
      [32, 46],
      [30, 54],
      [40, 49],
      [48, 45],
      [46, 55],
      [56, 50],
      [64, 46],
      [66, 55],
      [74, 50],
      [38, 57],
      [56, 58],
    ]
      .map(([x, y]) => dot(x, y, 2.3, '#fff'))
      .join('') +
    dot(84, 49, 2.3) +
    bubbles([
      [90, 30, 3],
      [84, 22, 2.2],
    ]),

  망치상어:
    `<path d="M50 80L38 96H48L50 90L52 96H62Z" fill="#8a9bb8"/>` +
    mirror(`<path d="M55 48L76 62L56 60Z" fill="#8a9bb8"/>`) +
    `<path d="M44 34C40 50 42 66 46 82H54C58 66 60 50 56 34Z" fill="#8a9bb8"/>` +
    `<path d="M50 52L50 66" stroke="#6b7c9a" stroke-width="2.5"/>` +
    `<path d="M10 26C10 18 30 15 50 15C70 15 90 18 90 26C90 34 78 33 66 31C60 31 56 34 56 40H44C44 34 40 31 34 31C22 33 10 34 10 26Z" fill="#8a9bb8"/>` +
    eye(14, 25, 4.5, 2.6) +
    eye(86, 25, 4.5, 2.6) +
    `<path d="M40 24q10 6 20 0" stroke-width="2.5"/>`,

  톱상어:
    `<path d="M84 48L96 34L94 50L96 64Z" fill="#9aa9c0"/>` +
    `<path d="M34 50C42 42 56 40 68 42L72 32L78 43C84 45 88 47 88 50C88 54 80 58 68 58C54 60 42 58 34 50Z" fill="#9aa9c0"/>` +
    `<path d="M40 55C52 58 66 58 78 55C70 60 52 62 40 58Z" fill="#dfe8f5"/>` +
    `<path d="M56 56L52 68L62 58Z" fill="#8a9bb8"/>` +
    Array.from({ length: 6 }, (_, i) => {
      const x = 8 + i * 5.5;
      return `<path d="M${x} 46L${x + 2} 40L${x + 4} 46Z" fill="#fff" stroke-width="2"/><path d="M${x} 53L${x + 2} 59L${x + 4} 53Z" fill="#fff" stroke-width="2"/>`;
    }).join('') +
    `<rect x="4" y="45.5" width="38" height="8" rx="4" fill="#c9b48a"/>` +
    eye(44, 47, 3.6, 2) +
    `<path d="M40 52q3 2 6 0" stroke-width="2"/>`,

  쥐가오리:
    `<path d="M50 76C50 84 48 90 52 97" stroke-width="3"/>` +
    mirror(
      `<path d="M50 26C60 26 70 34 95 50C76 54 62 62 54 76L50 80Z" fill="#3e4b6b"/>` +
        `<path d="M54 26C56 18 58 14 62 12C64 18 62 24 58 30Z" fill="#3e4b6b"/>` +
        `<path d="M66 40C74 44 80 47 84 49C76 49 70 47 64 44Z" fill="#fff"/>`,
    ) +
    `<path d="M50 30V74" stroke="#56648a" stroke-width="2.5"/>` +
    eye(42, 32, 3.4, 2) +
    eye(58, 32, 3.4, 2) +
    smile(50, 40, 5),

  전기뱀장어:
    `<path d="M26 12L18 30H26L20 44L36 24H28L34 12Z" fill="#ffd23f"/>` +
    `<path d="M74 70L66 84H73L68 96L82 80H75L80 70Z" fill="#ffd23f"/>` +
    tube('M8 76C18 58 32 58 42 66S62 78 72 60C76 52 78 46 80 42', '#6b6a3a', 12) +
    `<path d="M10 79C20 63 32 63 42 71S62 83 74 65" stroke="#e8862e" stroke-width="3"/>` +
    `<ellipse cx="82" cy="38" rx="11" ry="9" transform="rotate(-30 82 38)" fill="#6b6a3a"/>` +
    dot(84, 34, 2.4) +
    `<path d="M84 43q4 0 7-4" stroke-width="2.2"/>` +
    sparkle(58, 40, 5) +
    sparkle(94, 22, 4),

  곰치:
    `<path d="M4 94V30C4 18 14 12 24 14C36 16 42 28 42 40V94Z" fill="#8a7a6a"/>` +
    `<path d="M12 86q6-4 10 0M28 30q4-4 8 0" stroke="#6b5e50" stroke-width="2.5"/>` +
    `<ellipse cx="26" cy="60" rx="11" ry="15" fill="#3a2e28"/>` +
    tube('M26 64C40 66 50 58 58 48', '#a8b04a', 15) +
    `<path d="M50 44C56 30 76 28 86 36C93 41 93 50 86 54C78 58 64 58 55 56Z" fill="#a8b04a"/>` +
    `<path d="M70 53C77 55 84 53 90 48C86 52 78 58 70 55Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    eye(70, 40, 4.6, 2.6) +
    [
      [60, 36],
      [80, 34],
      [58, 48],
      [46, 58],
      [38, 64],
      [80, 45],
    ]
      .map(([x, y]) => dot(x, y, 2.2, '#5a5e24'))
      .join(''),

  아귀:
    `<circle cx="50" cy="52" r="45" fill="#2c3f6b" stroke="none"/>` +
    `<path d="M24 56L8 42L11 56L8 70Z" fill="#b07a4a"/>` +
    `<path d="M20 56C20 38 36 30 54 32C72 34 86 46 86 60C86 74 72 82 52 82C34 82 20 74 20 56Z" fill="#c08850"/>` +
    `<path d="M50 70C46 78 38 80 34 76C38 72 44 70 50 70Z" fill="#a06a3c"/>` +
    `<path d="M56 64Q72 78 88 58" stroke-width="3.5"/>` +
    `<path d="M62 67l2 4l2-3M70 70l2 4l2-4M78 68l2 3l1-4" fill="#fff" stroke-width="1.8"/>` +
    eye(66, 48, 5.5, 3.2) +
    `<path d="M58 33C56 18 70 10 80 18" stroke-width="3"/>` +
    `<circle cx="80" cy="22" r="10" fill="#fff1b8" stroke="none" opacity=".5"/>` +
    `<circle cx="80" cy="22" r="6" fill="#ffd23f"/>` +
    sparkle(92, 12, 4),

  앵무조개:
    `<circle cx="42" cy="50" r="33" fill="#fff6e8"/>` +
    `<path d="M42 17C34 26 32 36 36 44M26 22C20 32 22 44 30 50M13 36C12 46 16 56 26 60M11 56C16 64 24 70 34 70M22 76C28 80 38 82 46 80" stroke="#c8581e" stroke-width="5"/>` +
    `<path d="M52 18C56 26 56 34 52 42" stroke="#c8581e" stroke-width="4.5"/>` +
    `<path d="M68 30C82 36 86 54 80 68C74 78 62 82 52 80C62 72 68 58 68 30Z" fill="#8a5236"/>` +
    `<circle cx="48" cy="52" r="7" fill="#fff6e8" stroke-width="3"/><path d="M48 52a3 3 0 1 1 3 -3" stroke-width="2.5"/>` +
    `<path d="M78 72q8 3 14 0M74 76q6 8 15 9M68 78q2 10 10 14M82 66q7 0 12-4" stroke="#e8b48a" stroke-width="4.5"/>` +
    `<circle cx="74" cy="60" r="4" fill="#fff" stroke-width="2"/>` +
    dot(74.5, 60.3, 2.2),

  투구게:
    tube('M50 74L50 97', '#6b4a28', 4) +
    `<path d="M28 52H72L66 72C60 77 40 77 34 72Z" fill="#8a643a"/>` +
    mirror(`<path d="M69 58l6 1M67 66l6 1" stroke-width="3"/>`) +
    `<path d="M40 56V70M50 56V74M60 56V70" stroke="#6b4a28" stroke-width="2.5"/>` +
    `<path d="M8 52C8 26 28 12 50 12S92 26 92 52C84 56 68 54 50 54S16 56 8 52Z" fill="#a0784a"/>` +
    `<path d="M50 16V52M24 44C26 32 36 24 46 22M76 44C74 32 64 24 54 22" stroke="#7a5a34" stroke-width="2.5"/>` +
    `<ellipse cx="32" cy="34" rx="4.5" ry="3" fill="${INK}" stroke="none"/><ellipse cx="68" cy="34" rx="4.5" ry="3" fill="${INK}" stroke="none"/>`,

  집게:
    `<ellipse cx="25" cy="70" rx="15" ry="6.5" transform="rotate(-48 25 70)" fill="#c8583a"/>` +
    `<path d="M16 76l4-4M28 64l4-4" stroke="#8a3a22" stroke-width="2"/>` +
    tube('M84 14L40 74', '#b8c2d6', 6) +
    tube('M84 14L14 58', '#b8c2d6', 6) +
    tube('M84 14L66 38', '#e8553d', 7) +
    tube('M84 14L60 30', '#e8553d', 7) +
    `<circle cx="84" cy="14" r="6" fill="#8a96b0"/>` +
    `<path d="M34 72L44 80L48 74L38 68Z" fill="#b8c2d6"/><path d="M10 54L16 64L20 58L14 50Z" fill="#b8c2d6"/>`,

  대게:
    mirror(
      crabLegs(
        [
          [62, 42],
          [64, 48],
          [63, 54],
          [60, 58],
        ],
        [
          [78, 28],
          [86, 44],
          [84, 60],
          [74, 72],
        ],
        [
          [93, 38],
          [96, 62],
          [90, 80],
          [80, 92],
        ],
        '#e8862e',
        3.5,
      ) + tube('M56 36L62 24L60 16', '#e8862e', 4) + `<path d="M56 16L60 10L64 16L60 20Z" fill="#e8862e" stroke-width="2.5"/>`,
    ) +
    `<ellipse cx="50" cy="47" rx="16" ry="15" fill="#e8862e"/>` +
    `<path d="M40 44q2-3 4 0M56 44q2-3 4 0" stroke="#b85a1a" stroke-width="2"/>` +
    dot(44, 36, 2.8) +
    dot(56, 36, 2.8) +
    smile(50, 52, 4),

  킹크랩:
    mirror(
      crabLegs(
        [
          [64, 50],
          [66, 58],
          [62, 66],
        ],
        [
          [80, 38],
          [88, 58],
          [82, 76],
        ],
        [
          [94, 50],
          [96, 76],
          [86, 94],
        ],
        '#b8323a',
        8,
      ) +
        [
          [72, 44],
          [86, 44],
          [78, 58],
          [92, 66],
          [74, 70],
          [85, 85],
        ]
          .map(([x, y]) => dot(x, y, 1.6, '#fff'))
          .join('') +
        tube('M58 40L70 26', '#b8323a', 9) +
        `<path d="M64 24C66 12 80 10 84 18C80 20 76 22 74 26C78 26 82 28 82 32C76 34 68 32 64 24Z" fill="#b8323a"/>`,
    ) +
    `<path d="M50 30L58 34L66 40L68 50L66 60L58 68H42L34 60L32 50L34 40L42 34Z" fill="#b8323a"/>` +
    [
      [44, 42],
      [56, 42],
      [50, 52],
      [42, 58],
      [58, 58],
      [50, 62],
    ]
      .map(([x, y]) => `<path d="M${x - 3} ${y + 2}L${x} ${y - 3}L${x + 3} ${y + 2}Z" fill="#e8807a" stroke-width="1.8"/>`)
      .join('') +
    dot(45, 32, 2.8) +
    dot(55, 32, 2.8),

  따개비:
    `<path d="M4 4H96V80H4Z" fill="#bfe3f7" stroke="none"/>` +
    `<path d="M4 96C6 82 14 74 30 74H74C88 74 96 82 96 96Z" fill="#8a96b0"/>` +
    [
      [20, 82, 13, 18],
      [80, 82, 13, 18],
      [50, 80, 19, 30],
    ]
      .map(
        ([x, base, w, h]) =>
          `<path d="M${x - w} ${base}C${x - w} ${base - h * 0.6} ${x - w * 0.6} ${base - h} ${x - w * 0.4} ${base - h}H${x + w * 0.4}C${x + w * 0.6} ${base - h} ${x + w} ${base - h * 0.6} ${x + w} ${base}Z" fill="#eef0f4"/>` +
          `<path d="M${x - w * 0.5} ${base}L${x - w * 0.3} ${base - h}M${x} ${base}V${base - h}M${x + w * 0.5} ${base}L${x + w * 0.3} ${base - h}" stroke="#aab2c4" stroke-width="2.5"/>` +
          `<ellipse cx="${x}" cy="${base - h}" rx="${r1(w * 0.42)}" ry="3.2" fill="#5a4a3a"/>`,
      )
      .join('') +
    `<path d="M50 48C44 38 36 34 28 36M50 48C48 36 48 26 52 18M50 48C56 38 64 34 72 36M50 48C54 36 60 28 66 24M50 48C44 38 40 30 38 22" stroke="#f2c14e" stroke-width="3.2"/>` +
    bubbles([
      [20, 22, 3],
      [82, 20, 3.5],
      [78, 32, 2.2],
    ]),

  장수거북:
    mirror(
      `<path d="M62 36C76 28 90 30 96 40C86 42 76 46 66 52Z" fill="#3a4660"/>` + `<path d="M58 76C66 78 72 84 72 90C64 88 58 84 55 80Z" fill="#3a4660"/>`,
    ) +
    `<circle cx="50" cy="16" r="10" fill="#3a4660"/>` +
    `<path d="M50 22C65 22 73 34 73 50C73 68 61 84 50 93C39 84 27 68 27 50C27 34 35 22 50 22Z" fill="#3a4660"/>` +
    `<path d="M50 26V88M40 28C35 44 37 64 45 82M60 28C65 44 63 64 55 82" stroke="#7a8aaa" stroke-width="3"/>` +
    [
      [34, 44],
      [66, 44],
      [44, 60],
      [56, 60],
      [36, 62],
      [64, 62],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#dfe8f5'))
      .join('') +
    dot(45.5, 14, 2.4, '#fff') +
    dot(54.5, 14, 2.4, '#fff') +
    dot(45.8, 14.3, 1.3) +
    dot(54.8, 14.3, 1.3),

  // ── 새 ──
  가마우지:
    `<rect x="42" y="76" width="16" height="20" rx="2" fill="#9a5b2e"/>` +
    mirror(
      `<path d="M56 50C68 40 84 36 96 42L92 46L96 50L90 52L93 57L86 57L88 62C78 58 66 60 56 64Z" fill="#2a2e3a"/>`,
    ) +
    `<ellipse cx="50" cy="58" rx="12" ry="19" fill="#2a2e3a"/>` +
    `<path d="M44 76L42 80M50 77V80M56 76L58 80" stroke="#2a2e3a" stroke-width="3"/>` +
    tube('M50 44C48 36 50 30 52 26', '#2a2e3a', 7) +
    `<circle cx="53" cy="23" r="9" fill="#2a2e3a"/>` +
    `<path d="M57 20H74Q79 21 77 27L75 24H59Z" fill="#8a8a92"/>` +
    `<path d="M56 26Q60 33 65 28Z" fill="#ff9f1a" stroke-width="2"/>` +
    `<circle cx="55" cy="21" r="2.6" fill="#3fc0a0" stroke="none"/>` +
    dot(55.2, 21.2, 1.2),

  앨버트로스:
    WAVE(86) +
    mirror(`<path d="M56 46C68 38 84 36 97 40C92 44 84 46 76 48C68 50 62 52 56 54Z" fill="#4a5470"/>` + `<path d="M58 51C66 49 72 48 78 47" stroke="#fff" stroke-width="2.5"/>`) +
    `<ellipse cx="50" cy="54" rx="11" ry="14" fill="#fff"/>` +
    `<path d="M44 66L50 74L56 66Z" fill="#fff"/>` +
    `<circle cx="50" cy="38" r="9" fill="#fff"/>` +
    `<path d="M47 41L50 54L53 41Z" fill="#f2b86a" stroke-width="2.5"/>` +
    `<path d="M48 51.5L50 55L52 51.5" stroke-width="2"/>` +
    `<path d="M42 36q3-2 5 0M53 36q3-2 5 0" stroke="#8a96b0" stroke-width="2.5"/>` +
    dot(45, 38, 1.9) +
    dot(55, 38, 1.9),

  코뿔새:
    BRANCH(82) +
    `<path d="M28 66L14 94L26 95L36 70Z" fill="#fff"/><path d="M20 82L30 84" stroke-width="5"/>` +
    `<ellipse cx="38" cy="58" rx="18" ry="16" transform="rotate(-25 38 58)" fill="#2a2e3a"/>` +
    `<path d="M26 62C34 56 46 56 52 62C46 70 34 72 26 68Z" fill="#3e4252"/>` +
    `<path d="M36 74L34 82M44 72L44 82" stroke-width="3"/>` +
    `<circle cx="56" cy="40" r="11" fill="#2a2e3a"/>` +
    `<path d="M62 36C76 36 88 42 95 56C87 52 76 48 62 47Z" fill="#ffd23f"/>` +
    `<path d="M58 32C63 20 80 20 88 32C92 36 92 40 88 40C80 36 70 36 60 36Z" fill="#e8553d"/>` +
    `<circle cx="56" cy="40" r="3.3" fill="#fff" stroke-width="2"/>` +
    dot(56.4, 40.2, 1.8),

  큰부리새:
    BRANCH(82) +
    `<path d="M32 72L24 94H34L40 74Z" fill="#1e222e"/>` +
    `<ellipse cx="40" cy="58" rx="16" ry="22" transform="rotate(-10 40 58)" fill="#1e222e"/>` +
    `<path d="M40 76C44 80 50 80 52 76C48 72 44 72 40 76Z" fill="#e8553d"/>` +
    `<circle cx="46" cy="32" r="12" fill="#1e222e"/>` +
    `<path d="M46 40C56 42 56 54 50 62C44 56 40 46 46 40Z" fill="#fff4c2"/>` +
    `<path d="M54 25C66 18 84 20 95 32C93 38 88 42 80 42C72 43 62 42 54 40Z" fill="#ff9f1a"/>` +
    `<path d="M56 26C68 21 82 22 90 29" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M87 28C91 30 95 32 95 32C93 38 89 41 84 42C86 38 87 33 87 28Z" fill="#1e222e"/>` +
    `<circle cx="48" cy="29" r="5" fill="#7ec8f0"/>` +
    dot(48.3, 29.3, 2.2) +
    `<path d="M40 76L38 82M46 76L46 82" stroke-width="3"/>`,

  극락조:
    tube('M4 36L96 50', '#9a5b2e', 5) +
    `<path d="M44 52C30 62 18 76 12 92C24 84 36 72 46 60Z" fill="#ff9f1a"/>` +
    `<path d="M46 54C40 68 38 82 40 96C48 84 52 70 52 58Z" fill="#e8553d"/>` +
    `<path d="M48 54C52 68 60 80 70 90C68 76 62 64 54 54Z" fill="#ffc933"/>` +
    `<path d="M50 56C58 70 60 82 54 94" stroke-width="2.2"/><circle cx="52" cy="93" r="3" fill="${INK}" stroke="none"/>` +
    `<path d="M52 56C64 66 70 76 72 94" stroke-width="2.2"/><circle cx="72" cy="94" r="3" fill="${INK}" stroke="none"/>` +
    `<ellipse cx="48" cy="44" rx="12" ry="14" fill="#7a3b2a"/>` +
    `<circle cx="54" cy="27" r="9" fill="#ffd23f"/>` +
    `<path d="M50 34C54 42 62 40 62 32Z" fill="#3a9e47"/>` +
    `<path d="M61 24L69 27L61 30Z" fill="#8a96b0"/>` +
    dot(57, 25, 2.2),

  금계:
    `<path d="M40 62L4 84L8 92L44 72Z" fill="#c8a060"/>` +
    [
      [12, 82],
      [20, 78],
      [28, 73],
      [36, 68],
    ]
      .map(([x, y]) => dot(x, y, 2, '#5a3b24'))
      .join('') +
    `<path d="M44 74L42 90M58 74L60 90" stroke="#e8a24a" stroke-width="3.5"/>` +
    `<ellipse cx="52" cy="62" rx="19" ry="14" fill="#e8412d"/>` +
    `<path d="M38 56C44 50 54 50 60 54C56 60 46 62 38 60Z" fill="#3b78e6"/>` +
    `<path d="M64 36C58 44 58 54 64 58C72 54 80 50 80 40C76 44 70 42 64 36Z" fill="#ff9f1a"/>` +
    `<path d="M64 44C68 46 74 45 78 42M63 50C68 52 74 50 79 46" stroke-width="2.5"/>` +
    `<path d="M66 30C60 22 50 22 42 28C50 30 58 32 66 36Z" fill="#ffd23f"/>` +
    `<circle cx="72" cy="32" r="8" fill="#ffd23f"/>` +
    `<path d="M79 31L86 33L79 36Z" fill="#f2c14e"/>` +
    dot(75, 30, 2.2),

  수리부엉이:
    tube('M4 88H96', '#9a5b2e', 6) +
    `<path d="M24 60C24 36 34 22 50 22S76 36 76 60C76 78 64 88 50 88S24 78 24 60Z" fill="#a8743e"/>` +
    mirror(`<path d="M62 28L78 6L68 34Z" fill="#6b4226"/>`) +
    `<path d="M27 42C27 30 38 26 50 32C62 26 73 30 73 42C73 54 62 58 50 56C38 58 27 54 27 42Z" fill="#d9a86a"/>` +
    `<circle cx="39" cy="42" r="9" fill="#ff9f1a"/><circle cx="61" cy="42" r="9" fill="#ff9f1a"/>` +
    dot(39, 42, 4.5) +
    dot(61, 42, 4.5) +
    `<path d="M46 50L50 58L54 50Z" fill="#3a2a20"/>` +
    `<path d="M40 64v6M50 62v8M60 64v6M44 74v6M56 74v6" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M40 88v-4M46 88v-4M54 88v-4M60 88v-4" stroke-width="3"/>`,

  흰올빼미:
    `<circle cx="50" cy="52" r="45" fill="#cfe6f7" stroke="none"/>` +
    `<path d="M22 62C22 38 34 24 50 24S78 38 78 62C78 82 64 92 50 92S22 82 22 62Z" fill="#fff"/>` +
    `<circle cx="40" cy="46" r="7.5" fill="#ffd23f"/><circle cx="60" cy="46" r="7.5" fill="#ffd23f"/>` +
    dot(40, 46, 3.6) +
    dot(60, 46, 3.6) +
    `<path d="M47 53L50 59L53 53Z" fill="#555a66"/>` +
    `<path d="M32 66q3 2 6 0M44 72q3 2 6 0M58 68q3 2 6 0M36 80q3 2 6 0M54 82q3 2 6 0M64 76q3 2 6 0M40 30q3 2 6 0M56 30q3 2 6 0" stroke="${INK}" stroke-width="2.5"/>`,

  콘도르:
    mirror(
      `<path d="M58 44C70 36 86 34 97 40L94 44L97 48L93 50L95 54L90 55L91 59C80 58 68 60 58 62Z" fill="#22252e"/>` +
        `<path d="M62 50C72 48 82 48 90 50" stroke="#fff" stroke-width="4"/>`,
    ) +
    `<path d="M44 70L42 84L50 80L58 84L56 70Z" fill="#22252e"/>` +
    `<ellipse cx="50" cy="58" rx="11" ry="16" fill="#22252e"/>` +
    blob('#fff', [
      [43, 42, 5],
      [50, 44, 5],
      [57, 42, 5],
    ]) +
    `<circle cx="50" cy="30" r="9" fill="#d98a7a"/>` +
    `<path d="M47 34L50 43L53 34Z" fill="#f2e0c8" stroke-width="2.5"/>` +
    dot(46, 29, 1.9) +
    dot(54, 29, 1.9),

  황조롱이:
    BRANCH(84) +
    `<path d="M32 66L16 94L26 96L40 72Z" fill="#8a96b0"/><path d="M18 88L27 92" stroke-width="5"/>` +
    `<path d="M30 72C24 58 30 40 46 36C60 32 72 40 72 54C72 66 62 76 46 78Z" fill="#c8682e"/>` +
    `<path d="M58 44C68 52 68 66 56 76C62 66 62 54 58 44Z" fill="#fbe8c8"/>` +
    [
      [38, 50],
      [46, 46],
      [36, 60],
      [44, 58],
      [52, 54],
      [42, 68],
    ]
      .map(([x, y]) => dot(x, y, 2.2))
      .join('') +
    `<path d="M50 78L50 84M58 76L58 84" stroke="#e8a24a" stroke-width="3.5"/>` +
    `<circle cx="64" cy="32" r="12" fill="#8a96b0"/>` +
    `<path d="M60 38C62 44 70 46 75 40Z" fill="#fff"/>` +
    `<path d="M63 35L61 45" stroke-width="3.5"/>` +
    `<path d="M75 29C80 29 82 32 80 36L75 35Z" fill="#555a66"/>` +
    `<circle cx="68" cy="30" r="3.6" fill="#ffd23f" stroke-width="2"/>` +
    dot(68.4, 30.3, 2),

  물수리:
    SEA(86) +
    mirror(
      `<path d="M56 42C62 32 74 26 84 30C90 32 94 36 97 42C88 40 80 42 74 48C68 50 62 52 56 52Z" fill="#6b3e26"/>` + `<path d="M62 46C68 44 74 42 80 38" stroke="#fff" stroke-width="2.5"/>`,
    ) +
    `<ellipse cx="50" cy="50" rx="9.5" ry="14" fill="#fff"/>` +
    `<path d="M46 62L44 72M54 62L56 72" stroke-width="3"/>` +
    `<path d="M34 74L26 68L28 74L26 80Z" fill="#7ec8f0"/>` +
    `<ellipse cx="48" cy="74" rx="16" ry="6" fill="#7ec8f0"/>` +
    dot(58, 73, 1.8) +
    `<path d="M42 70q2 4 4 0M52 70q2 4 4 0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="31" r="9" fill="#fff"/>` +
    `<path d="M41 29L47 31M59 29L53 31" stroke="#5a3b24" stroke-width="3.5"/>` +
    `<path d="M47 34L50 41L53 34Z" fill="#3a3a44"/>` +
    dot(46, 29, 1.9) +
    dot(54, 29, 1.9),

  저어새:
    `<path d="M4 80H96V96H4Z" fill="#bfe3f7" stroke="none"/>` +
    WAVE(80) +
    `<path d="M40 70L38 86M48 70L50 86" stroke-width="3.5"/>` +
    `<path d="M16 58C16 44 30 38 44 40C56 42 62 50 60 58C58 68 46 72 32 70C22 68 16 64 16 58Z" fill="#fff"/>` +
    `<path d="M16 58L6 62L18 64Z" fill="#fff"/>` +
    tube('M54 48C58 38 58 30 60 26', '#fff', 8) +
    `<path d="M56 20C50 18 46 22 44 26C50 26 54 25 58 24Z" fill="#f2c14e"/>` +
    `<circle cx="62" cy="24" r="8.5" fill="#fff"/>` +
    `<path d="M62 16.5C68 17 71 21 71 25C69 29 65 30 62 28Z" fill="#2a2e3a"/>` +
    `<path d="M70 21L82 23C84 17 96 17 96 25C96 33 84 33 82 28L70 27Z" fill="#2a2e3a"/>` +
    dot(65, 22, 1.6, '#fff'),

  따오기:
    `<path d="M34 70L32 88M44 70L46 88" stroke="#e8553d" stroke-width="3.5"/>` +
    `<path d="M14 56C14 42 28 36 42 38C54 40 60 48 58 56C56 66 44 70 30 68C20 66 14 62 14 56Z" fill="#fdecea"/>` +
    `<path d="M20 54C28 46 44 46 54 52C48 62 34 66 20 62Z" fill="#f4a6a0"/>` +
    `<path d="M14 56L4 62L16 64Z" fill="#f4a6a0"/>` +
    tube('M52 46C56 38 56 32 58 28', '#fdecea', 8) +
    `<path d="M56 26L40 20L48 28L38 32L52 32Z" fill="#fdecea"/>` +
    `<circle cx="62" cy="28" r="8.5" fill="#fdecea"/>` +
    `<path d="M62 22C68 21 72 25 71 31C67 34 63 33 62 29Z" fill="#e8553d"/>` +
    `<path d="M70 28C80 30 88 38 93 52" stroke-width="5.5"/>` +
    `<path d="M90 45L93 52" stroke="#e8553d" stroke-width="3"/>` +
    dot(66, 26, 1.8),

  논병아리:
    SEA(72) +
    `<path d="M16 68C16 54 28 48 44 48C54 48 58 42 62 36C70 28 86 30 86 42C86 50 80 54 76 58C76 66 68 74 50 74C32 74 16 74 16 68Z" fill="#6b4a32"/>` +
    blob('#f4ede0', [
      [20, 62, 6],
      [26, 56, 5],
    ]) +
    `<path d="M64 38C70 44 74 52 70 62C66 58 62 52 60 44Z" fill="#b8502a"/>` +
    `<path d="M34 56C40 52 50 52 56 56" stroke="#4a3222" stroke-width="3"/>` +
    `<path d="M85 40L95 43L85 46Z" fill="#2a2e3a"/>` +
    dot(84, 43, 2.2, '#ffd23f') +
    `<circle cx="77" cy="38" r="3.4" fill="#ffd23f" stroke-width="2"/>` +
    dot(77.3, 38.3, 1.8) +
    `<path d="M4 72q7-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0" stroke="#3b8fe0" stroke-width="3"/>`,

  곤줄박이:
    BRANCH(80) +
    FEET +
    songbird(
      { body: '#d9782e', wing: '#8a96b0', head: '#fff4dc' },
      `<path d="M50 38C50 26 60 22 70 24C74 26 76 28 77 31C70 30 62 32 56 42Z" fill="#2a2e3a"/>` +
        `<path d="M74 42C74 48 70 52 62 52C64 48 66 46 68 42Z" fill="#2a2e3a"/>` +
        `<path d="M50 44C52 50 56 52 58 52C56 48 54 44 52 40Z" fill="#d9782e"/>`,
    ),

  동고비:
    `<rect x="4" y="4" width="30" height="92" rx="4" fill="#9a5b2e"/>` +
    `<path d="M12 14v14M24 36v16M14 60v14M26 78v12" stroke="#6b3e26" stroke-width="3"/>` +
    `<g transform="rotate(72 50 52) translate(4 0)">` +
    songbird(
      { body: '#7a8fb8', wing: '#6a7ca6', head: '#7a8fb8', belly: '#f4ede0' },
      `<path d="M52 44C56 44 58 40 62 40C66 40 70 44 74 44C72 50 62 50 54 48Z" fill="#f4ede0"/>` +
        `<path d="M54 36C60 34 70 34 80 38" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M36 72C44 74 50 72 54 68" stroke="#e8862e" stroke-width="4"/>`,
      `<path d="M77 35L90 38L77 41Z" fill="#3a3a44"/>`,
    ) +
    `</g>` +
    `<path d="M36 34L32 30M40 44L34 44" stroke-width="3"/>`,

  직박구리:
    BRANCH(80) +
    `<path d="M88 78v6" stroke-width="3"/>` +
    `<circle cx="88" cy="58" r="10" fill="#ff9f1a"/>` +
    `<path d="M84 48C86 44 90 44 92 48C90 50 86 50 84 48Z" fill="#43b04a"/>` +
    `<path d="M88 48V44" stroke-width="2.5"/>` +
    FEET +
    songbird(
      { body: '#8a96b0', wing: '#6b7690', head: '#9aa4bc', tail: '#6b7690' },
      `<path d="M52 32L48 22L56 28L56 18L62 26L66 18L68 26Z" fill="#9aa4bc"/>` +
        `<ellipse cx="64" cy="44" rx="6" ry="4" fill="#9a5b2e" stroke="none"/>`,
    ),

  휘파람새:
    BRANCH(82) +
    `<path d="M44 74L42 82M52 74L52 82" stroke-width="3"/>` +
    `<g transform="rotate(-12 50 60)">` +
    songbird(
      { body: '#a89a5a', wing: '#8a7a3e', head: '#a89a5a', belly: '#e8e0c0' },
      `<path d="M60 31C66 29 72 30 76 33" stroke="#f4ede0" stroke-width="3"/>`,
      `<path d="M77 33L90 29L77 38Z" fill="#555a66"/><path d="M77 39L90 43L77 42Z" fill="#555a66"/>`,
    ) +
    `</g>` +
    [
      [80, 16],
      [92, 30],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.5" transform="rotate(-20 ${x} ${y})" fill="#3b78e6" stroke="#3b78e6"/>` +
          `<path d="M${x + 4} ${y - 1}V${y - 13}l5 3" stroke="#3b78e6" stroke-width="3"/>`,
      )
      .join(''),

  물떼새:
    `<path d="M4 82Q50 76 96 82V96H4Z" fill="#f2d9a0" stroke="none"/>` +
    `<path d="M4 82Q50 76 96 82" stroke="#d9b070" stroke-width="3"/>` +
    `<path d="M40 64L34 78L28 80M52 64L56 78L62 78" stroke="#e8a24a" stroke-width="3.5"/>` +
    `<path d="M10 50L22 46L24 54Z" fill="#b08a5a"/>` +
    `<ellipse cx="44" cy="52" rx="24" ry="16" fill="#fff"/>` +
    `<path d="M20 50C22 38 40 34 58 36C64 38 68 40 70 44C60 46 40 48 20 52Z" fill="#b08a5a"/>` +
    `<circle cx="68" cy="34" r="11" fill="#fff"/>` +
    `<path d="M57 32C58 24 66 22 72 24C76 26 78 28 78 30C70 28 64 28 57 32Z" fill="#b08a5a"/>` +
    `<path d="M58 42C62 50 74 50 78 42" stroke-width="5"/>` +
    `<path d="M64 33H76" stroke-width="3.5"/>` +
    `<circle cx="70" cy="33" r="3.8" fill="#ffd23f" stroke-width="2"/>` +
    dot(70.3, 33.3, 2) +
    `<path d="M78 33L86 35L78 37Z" fill="#2a2e3a"/>` +
    `<path d="M8 62h10M6 70h10" stroke="#9aa6c4" stroke-width="3"/>`,

  도요새:
    `<path d="M4 74H96V96H4Z" fill="#c9a878" stroke="none"/>` +
    `<path d="M4 74q8-3 16 0t16 0t16 0t16 0t16 0t12 0" stroke="#9a7a4e" stroke-width="3"/>` +
    `<path d="M34 58L30 80M44 58L48 80" stroke="#6b8a4a" stroke-width="3"/>` +
    `<path d="M22 50L6 46L10 54Z" fill="#8a643a"/>` +
    `<ellipse cx="38" cy="48" rx="20" ry="13" fill="#b08a5a"/>` +
    `<path d="M22 54C30 62 48 62 56 52" stroke="none" fill="#f4ede0"/>` +
    `<path d="M22 54C30 62 48 62 56 52" stroke-width="2"/>` +
    [
      [28, 44],
      [36, 42],
      [44, 44],
      [32, 50],
      [40, 49],
      [48, 48],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#5a3b24'))
      .join('') +
    `<circle cx="58" cy="36" r="9" fill="#b08a5a"/>` +
    `<path d="M65 38L92 76" stroke-width="4.5"/>` +
    `<path d="M88 78q4 2 8 0" stroke="#9a7a4e" stroke-width="2.5"/>` +
    dot(60, 34, 2.2),

  // ── 파충류 ──
  방울뱀:
    `<ellipse cx="50" cy="80" rx="36" ry="12" fill="#d9b070"/>` +
    tube('M22 78C12 68 14 56 20 48', '#d9b070', 7) +
    `<ellipse cx="20" cy="43" rx="5" ry="3.5" fill="#e8d4a0" stroke-width="2.5"/><ellipse cx="20" cy="37" rx="4.5" ry="3.2" fill="#e8d4a0" stroke-width="2.5"/><ellipse cx="20" cy="31.5" rx="4" ry="2.8" fill="#e8d4a0" stroke-width="2.5"/>` +
    `<path d="M10 30q-3 5 0 10M30 30q3 5 0 10M6 26q-4 8 0 16" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<ellipse cx="54" cy="68" rx="27" ry="10" fill="#d9b070"/>` +
    tube('M60 64C64 52 54 42 62 34', '#d9b070', 12) +
    `<path d="M54 28C60 20 76 20 84 28C84 35 74 38 62 36C57 34 54 32 54 28Z" fill="#d9b070"/>` +
    [
      [28, 82],
      [44, 86],
      [62, 86],
      [76, 80],
      [40, 70],
      [56, 72],
      [70, 68],
    ]
      .map(([x, y]) => `<path d="M${x - 5} ${y}L${x} ${y - 3}L${x + 5} ${y}L${x} ${y + 3}Z" fill="#8a5a2e" stroke="none"/>`)
      .join('') +
    dot(66, 27, 2.4) +
    dot(76, 27, 2.4) +
    `<path d="M68 32q4 2 7 0" stroke-width="2.2"/>` +
    `<path d="M84 30l6 1l3-2M90 31l3 2" stroke="#e8553d" stroke-width="2"/>`,

  비단뱀:
    tube('M4 30C30 24 60 36 96 26', '#9a5b2e', 6) +
    `<path d="M88 22L96 14M76 28L80 18" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M80 18C84 12 92 12 94 16C90 20 84 20 80 18Z" fill="#43b04a"/>` +
    tube(pyPath, '#e0c060', 12) +
    pySpots +
    `<path d="M62 30C62 22 76 20 82 26C86 30 84 36 78 38C70 40 62 36 62 30Z" fill="#e0c060"/>` +
    dot(70, 28, 2.2) +
    dot(78, 28, 2.2) +
    `<path d="M70 34q4 2 8 0" stroke-width="2.2"/>` +
    `<path d="M8 60C6 70 10 78 16 82" stroke-width="3"/>`,

  뿔도마뱀:
    tube('M50 74C50 84 52 90 50 96', '#d9a86a', 6) +
    mirror(
      tube('M66 46L80 38L86 42', '#d9a86a', 5) +
        tube('M68 66L82 76L86 72', '#d9a86a', 5) +
        [
          [72, 48],
          [74, 56],
          [72, 64],
        ]
          .map(([x, y]) => `<path d="M${x - 1} ${y - 3}L${x + 6} ${y}L${x - 1} ${y + 3}Z" fill="#e8c890" stroke-width="2"/>`)
          .join('') +
        `<path d="M58 30L66 14L62 34Z" fill="#e8c890" stroke-width="2.5"/>` +
        `<path d="M54 26L56 12L58 28Z" fill="#e8c890" stroke-width="2.5"/>` +
        `<path d="M62 36L74 26L64 40Z" fill="#e8c890" stroke-width="2.5"/>`,
    ) +
    `<ellipse cx="50" cy="58" rx="22" ry="19" fill="#d9a86a"/>` +
    [
      [42, 52],
      [58, 52],
      [50, 62],
      [40, 64],
      [60, 64],
    ]
      .map(([x, y]) => dot(x, y, 2.6, '#8a5a2e'))
      .join('') +
    `<path d="M36 42C36 30 42 24 50 24S64 30 64 42Z" fill="#d9a86a"/>` +
    dot(44, 34, 2.4) +
    dot(56, 34, 2.4) +
    smile(50, 38, 3),

  목도리도마뱀:
    `<path d="M40 86L30 92M60 86L70 92" stroke-width="4"/>` +
    `<path d="M56 84C66 88 76 90 86 86" stroke-width="3.5"/>` +
    `<path d="M42 60C40 72 42 82 50 88C58 82 60 72 58 60Z" fill="#b89a6a"/>` +
    `<path d="M42 66L32 74M58 66L68 74" stroke-width="4"/>` +
    (() => {
      let d = '';
      const n = 12;
      for (let i = 0; i <= n; i++) {
        const a = Math.PI * 0.95 + (i / n) * Math.PI * 1.1;
        const [x, y] = pt(50, 42, 34, a);
        if (i === 0) d = `M${x} ${y}`;
        else d += `A5.5 5.5 0 0 1 ${x} ${y}`;
      }
      return `<path d="${d}C70 76 30 76 ${pt(50, 42, 34, Math.PI * 0.95).join(' ')}Z" fill="#ff9f1a"/>`;
    })() +
    `<path d="M50 42L22 30M50 42L28 16M50 42L50 10M50 42L72 16M50 42L78 30M50 42L20 50M50 42L80 50" stroke="#e8553d" stroke-width="3"/>` +
    `<ellipse cx="50" cy="44" rx="12" ry="14" fill="#b89a6a"/>` +
    `<ellipse cx="50" cy="50" rx="6" ry="5" fill="#ff9aa8"/>` +
    dot(44, 38, 2.6) +
    dot(56, 38, 2.6),

  // ── 곤충 ──
  물장군:
    `<circle cx="50" cy="52" r="45" fill="#bfe3f7" stroke="none"/>` +
    mirror(
      tube('M60 30C72 26 76 18 72 10', '#6b4a28', 5) +
        tube('M64 50C76 50 84 56 88 64', '#6b4a28', 4) +
        tube('M64 64C74 70 80 80 82 92', '#6b4a28', 4) +
        `<ellipse cx="86" cy="86" rx="3" ry="7" transform="rotate(-20 86 86)" fill="#6b4a28" stroke-width="2"/>`,
    ) +
    `<path d="M50 20C62 20 68 34 68 54C68 74 60 88 50 90C40 88 32 74 32 54C32 34 38 20 50 20Z" fill="#8a643a"/>` +
    `<path d="M42 24L50 12L58 24Z" fill="#6b4a28"/>` +
    dot(44, 24, 2.6) +
    dot(56, 24, 2.6) +
    `<path d="M50 34V88" stroke="#6b4a28" stroke-width="2.5"/>` +
    [
      [44, 46],
      [50, 44],
      [56, 46],
      [42, 53],
      [50, 52],
      [58, 53],
      [44, 60],
      [50, 60],
      [56, 60],
      [47, 67],
      [53, 67],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="3.6" fill="#fff4d6" stroke-width="1.8"/>`)
      .join(''),

  대벌레:
    tube('M4 84C30 80 60 84 96 78', '#9a5b2e', 6) +
    `<path d="M88 78C92 70 96 68 96 68C94 74 92 78 88 78Z" fill="#43b04a"/>` +
    [
      'M30 58L24 70L20 80',
      'M40 58L40 70L36 81',
      'M60 56L62 68L64 80',
      'M70 55L76 68L80 79',
      'M78 50L88 60',
      'M22 60L14 70L10 82',
    ]
      .map((d) => `<path d="${d}" stroke="#3a9e47" stroke-width="3"/>`)
      .join('') +
    tube('M10 60L80 52', '#6ecf5a', 5) +
    `<ellipse cx="84" cy="51" rx="6" ry="4.5" fill="#6ecf5a"/>` +
    `<path d="M88 48L96 34M89 50L97 42" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M26 58.5V61M42 56.5V59M58 54.5V57" stroke="#3a9e47" stroke-width="2"/>` +
    dot(86, 50, 1.8),

  배추흰나비:
    blob('#9ad06a', [
      [50, 84, 16],
      [30, 88, 12],
      [70, 88, 12],
    ]) +
    `<path d="M50 70V94M50 80C42 78 36 82 32 88M50 80C58 78 64 82 68 88" stroke="#5a9e3a" stroke-width="3"/>` +
    mirror(
      `<path d="M52 42C60 28 76 20 86 24C92 34 84 46 53 50Z" fill="#fff"/>` +
        `<path d="M86 24C80 20 72 22 70 26C76 28 82 30 88 32Z" fill="#2a2e3a"/>` +
        dot(70, 38, 3.2) +
        `<path d="M53 50C66 50 76 56 72 64C64 68 56 62 51 54Z" fill="#fff"/>`,
    ) +
    `<ellipse cx="50" cy="48" rx="3" ry="12" fill="#2a2e3a"/>` +
    `<path d="M49 37C46 30 42 26 38 24M51 37C54 30 58 26 62 24" stroke-width="2.2"/>` +
    dot(38, 24, 2.2) +
    dot(62, 24, 2.2),

  제비나비:
    mirror(
      `<path d="M52 44C60 26 78 14 92 20C95 34 84 46 53 52Z" fill="#22252e"/>` +
        `<path d="M60 40C68 32 78 26 86 26" stroke="#8fd4c8" stroke-width="3"/>` +
        `<path d="M53 52C66 52 78 58 76 68C74 74 70 76 66 74L66 90L58 76C54 70 51 62 51 56Z" fill="#22252e"/>` +
        `<ellipse cx="64" cy="62" rx="6" ry="4" fill="#3fb0a0" stroke="none"/>` +
        dot(70, 72, 2.8, '#e8553d'),
    ) +
    `<ellipse cx="50" cy="50" rx="3" ry="14" fill="#22252e"/>` +
    `<path d="M49 37C46 30 42 26 38 22M51 37C54 30 58 26 62 22" stroke-width="2.2"/>` +
    dot(38, 22, 2.2) +
    dot(62, 22, 2.2),

  호박벌:
    `<ellipse cx="44" cy="30" rx="12" ry="8" transform="rotate(-25 44 30)" fill="#dff3ff"/>` +
    `<ellipse cx="60" cy="28" rx="11" ry="7" transform="rotate(20 60 28)" fill="#dff3ff"/>` +
    `<path d="M36 70L32 80M48 74L48 84M62 70L66 80" stroke-width="3"/>` +
    blob('#ff9f1a', [
      [26, 56, 13],
      [22, 50, 8],
    ]) +
    blob('#2a2e3a', [
      [44, 56, 17],
      [40, 44, 9],
      [46, 70, 8],
    ]) +
    blob('#ffd23f', [
      [62, 50, 14],
      [58, 38, 8],
    ]) +
    `<circle cx="78" cy="50" r="10" fill="#2a2e3a"/>` +
    `<path d="M80 41C82 32 86 28 90 26M76 41C76 32 74 28 70 24" stroke-width="2.2"/>` +
    dot(82, 48, 2.4, '#fff') +
    `<path d="M80 55q3 2 6-1" stroke="#fff" stroke-width="2"/>`,

  하루살이:
    `<path d="M4 84q8-5 16 0t16 0t16 0t16 0t16 0t12 0" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M24 58C16 50 10 40 6 26M24 58C14 54 8 48 4 40M24 58C18 46 16 36 16 22" stroke-width="2"/>` +
    `<path d="M50 56L38 12C52 10 64 22 66 52Z" fill="#eaf6ff"/>` +
    `<path d="M50 54L44 22M56 52L54 20M61 52L62 28" stroke="#9aa6c4" stroke-width="2"/>` +
    `<path d="M60 56L58 42C64 40 70 46 68 56Z" fill="#eaf6ff"/>` +
    tube('M24 58C40 62 58 60 72 50', '#e0c080', 5) +
    `<circle cx="76" cy="47" r="6.5" fill="#e0c080"/>` +
    dot(78, 45, 2) +
    `<path d="M80 44L92 34M52 60L50 72L46 76M62 58L66 70L70 74M72 52L80 64L84 66" stroke-width="2.2"/>`,

  흰개미:
    `<path d="M46 76C48 58 52 42 58 26C60 18 66 16 68 24C70 30 72 28 75 24C79 20 83 26 83 36C83 46 86 52 88 60C90 66 92 72 94 76Z" fill="#c8864a"/>` +
    [
      [62, 36],
      [72, 34],
      [66, 52],
      [80, 56],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.6" fill="#6b3e26" stroke="none"/>`)
      .join('') +
    `<path d="M4 90H96" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M26 78L16 90M38 76L36 90M52 76L60 90M44 70L36 62M54 70L64 64M52 78L66 84" stroke-width="3"/>` +
    `<ellipse cx="24" cy="74" rx="18" ry="11" fill="#fff0d6"/>` +
    `<path d="M16 66v16M24 63v22M32 66v16" stroke="#e8c8a0" stroke-width="2.5"/>` +
    `<ellipse cx="46" cy="72" rx="8" ry="7" fill="#fff0d6"/>` +
    `<circle cx="62" cy="68" r="10" fill="#e8a24a"/>` +
    `<path d="M66 59L72 50L78 48M69 62L80 56L86 56" stroke-width="2.5"/>` +
    dot(67, 66, 2.4) +
    smile(64, 73, 3),

  // ── 옛 동물 ──
  매머드:
    `<rect x="26" y="66" width="11" height="26" rx="4" fill="#6b3e26"/><rect x="58" y="66" width="11" height="26" rx="4" fill="#6b3e26"/>` +
    blob('#8a4f2a', [
      [42, 52, 22],
      [24, 58, 14],
      [60, 46, 17],
      [66, 34, 13],
    ]) +
    `<path d="M20 70L24 80L28 70L32 80L36 70L40 80L44 70L48 80L52 70L56 80L60 70L64 78L68 68" fill="#8a4f2a" stroke-width="3"/>` +
    `<path d="M40 40q-4 8 0 16M50 38q-4 8 0 16M30 50q-4 8 0 14" stroke="#6b3e26" stroke-width="2.5"/>` +
    tube('M76 44C86 52 88 66 84 78C82 84 76 84 76 78', '#8a4f2a', 8) +
    `<path d="M70 52C80 64 78 82 62 84C58 84 58 80 62 79C72 76 72 64 66 54Z" fill="#fff8e8"/>` +
    `<ellipse cx="58" cy="40" rx="6" ry="9" fill="#6b3e26"/>` +
    dot(72, 36, 2.4),

  검치호랑이:
    `<circle cx="24" cy="24" r="10" fill="#e0a860"/><circle cx="76" cy="24" r="10" fill="#e0a860"/>` +
    dot(24, 24, 4.5, '#c8864a') +
    dot(76, 24, 4.5, '#c8864a') +
    `<circle cx="50" cy="48" r="32" fill="#e0a860"/>` +
    `<path d="M44 20l2 8M50 18v9M56 20l-2 8M20 46l8 2M80 46l-8 2" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M40 66L42 90C43 93 47 93 47 90L48 66Z" fill="#fff"/><path d="M60 66L58 90C57 93 53 93 53 90L52 66Z" fill="#fff"/>` +
    `<ellipse cx="41" cy="62" rx="11" ry="8" fill="#fff4dc"/><ellipse cx="59" cy="62" rx="11" ry="8" fill="#fff4dc"/>` +
    `<path d="M45 52H55L50 58Z" fill="#b8502a"/>` +
    `<path d="M50 58V62" stroke-width="2.5"/>` +
    `<path d="M34 42q4-4 8 0M58 42q4-4 8 0" stroke-width="3"/>` +
    cheeks(58, 22),

  익룡:
    mirror(
      `<path d="M54 46C64 36 80 30 97 32C92 38 88 46 86 54L80 50L76 56L70 52L66 58C62 56 58 56 54 58Z" fill="#e8862e"/>` +
        `<path d="M58 48C68 42 80 36 94 34" stroke="#b85a1a" stroke-width="2.5"/>`,
    ) +
    `<ellipse cx="50" cy="56" rx="7" ry="13" fill="#f2b04e"/>` +
    `<path d="M46 68L44 76M54 68L56 76" stroke-width="3"/>` +
    `<path d="M48 32L20 16L28 26L46 38Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="38" r="7.5" fill="#f2b04e"/>` +
    `<path d="M54 34L88 30L56 42Z" fill="#f2c14e"/>` +
    dot(51, 36, 2),

  삼엽충:
    mirror(`<path d="M76 38L86 62L70 42Z" fill="#b89a70"/>`) +
    `<path d="M22 38H78L72 76H28Z" fill="#b89a70"/>` +
    `<path d="M28 76C32 92 68 92 72 76Z" fill="#b89a70"/>` +
    `<rect x="42" y="38" width="16" height="40" rx="6" fill="#d9c09a"/>` +
    Array.from({ length: 6 }, (_, i) => {
      const y = 44 + i * 5.5;
      return `<path d="M${r1(23 + i * 0.8)} ${y}H42M58 ${y}H${r1(77 - i * 0.8)}" stroke="#7a6444" stroke-width="2.5"/>`;
    }).join('') +
    `<path d="M16 40C16 22 32 12 50 12S84 22 84 40Z" fill="#b89a70"/>` +
    `<path d="M42 40C40 30 44 20 50 18C56 20 60 30 58 40Z" fill="#d9c09a"/>` +
    `<path d="M30 30q4-5 8 0M62 30q4-5 8 0" stroke-width="3.5"/>` +
    dot(34, 30, 2.4) +
    dot(66, 30, 2.4),

  암모나이트:
    `<path d="M8 32C14 12 44 6 64 10C88 14 96 34 94 56C92 82 70 94 46 93C20 92 4 76 5 54Z" fill="#b8b2a6"/>` +
    `<path d="M14 80l6-4M84 22l-4 5" stroke="#8a8478" stroke-width="2.5"/>` +
    `<circle cx="50" cy="52" r="36" fill="#d9b07a"/>` +
    `<path d="${ammoniteRibs(50, 52, 36, 3, 2.3)}" stroke="#9a6a3a" stroke-width="2.5"/>` +
    `<path d="${spiralPath(50, 52, 36, 3, 2.3)}" stroke-width="3"/>`,
};
