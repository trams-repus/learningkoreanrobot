// 그림 묶음: 9세 이상 자연 2 (하늘과 우주·땅속과 보석·꽃과 풀·밭·나무·먼 땅). 그림 규칙은 docs/picture-style.md.
import { SKIN, dot, blob, ring, sparkle, tube, drop, torso, cheeks } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);
const BARK = '#9a5b2e';
const STRAW = '#ecc96a';
const STRAW_LINE = '#b88d34';

/** 둥근 칸 바탕 (하늘·물·동굴) */
const bg = (fill: string) => `<rect x="5" y="5" width="90" height="90" rx="14" fill="${fill}"/>`;
/** 칸 아래쪽 땅 (y부터 바닥까지, 둥근 모서리에 맞춰) */
const ground = (y: number, fill: string, top = `H95`) =>
  `<path d="M5 ${y}${top}V81Q95 95 81 95H19Q5 95 5 81Z" fill="${fill}"/>`;

/** 꽃잎 n장을 (cx, cy) 둘레에 */
function petals(cx: number, cy: number, n: number, d: number, rx: number, ry: number, fill: string, turn = 0, sw = 3): string {
  return Array.from({ length: n }, (_, k) => {
    const a = turn + (k * 360) / n;
    const rad = (a * Math.PI) / 180;
    const x = f1(cx + d * Math.cos(rad));
    const y = f1(cy + d * Math.sin(rad));
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="${sw}" transform="rotate(${f1(a)} ${x} ${y})"/>`;
  }).join('');
}

/** 다섯 잎 꽃 하나 */
function flower(x: number, y: number, r: number, fill: string, center = '#ffd23f', sw = 2.5): string {
  return petals(x, y, 5, f1(r * 0.55), f1(r * 0.5), f1(r * 0.36), fill, -90, sw) + `<circle cx="${x}" cy="${y}" r="${f1(r * 0.3)}" fill="${center}" stroke-width="${sw}"/>`;
}

/** 단풍잎 하나 */
function maple(x: number, y: number, s: number, fill: string, turn = 0): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s}) translate(-50 -45)" stroke-width="${f1(3.5 / s)}">` +
    `<path d="M50 6L57 24L72 16L68 36L92 34L80 50L88 60L66 64L70 76L54 70L50 74L46 70L30 76L34 64L12 60L20 50L8 34L32 36L28 16L43 24Z" fill="${fill}"/>` +
    `</g>`
  );
}

/** 나무 기둥 */
function trunk(x: number, top: number, w: number, fill = BARK, bottom = 92): string {
  return `<path d="M${x - w / 2} ${top}L${x - w / 2 - 3} ${bottom}H${x + w / 2 + 3}L${x + w / 2} ${top}Z" fill="${fill}"/>`;
}

/** 3차 베지어 위의 점과 방향 */
function bez(p: number[], t: number): [number, number, number, number] {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
  const u = 1 - t;
  const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
  const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
  const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2);
  const dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2);
  const l = Math.hypot(dx, dy) || 1;
  return [x, y, dx / l, dy / l];
}
const bezPath = (p: number[]) => `M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`;

/** 밤하늘 별 */
const stars = (ps: [number, number, number][]) => ps.map(([x, y, r]) => sparkle(x, y, r, '#fff1b8')).join('');

/** 보석 (위가 넓고 아래가 뾰족한 모양) */
function gem(x: number, y: number, s: number, fill: string, light: string): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3.2 / s)}">` +
    `<path d="M-20 -8L-10 -20H10L20 -8L0 22Z" fill="${fill}"/>` +
    `<path d="M-10 -20L-6 -8L0 22L6 -8L10 -20Z" fill="${light}" stroke-width="${f1(2.2 / s)}"/>` +
    `<path d="M-20 -8H20" stroke-width="${f1(2.2 / s)}"/>` +
    `<path d="M-14 -12L-10 -16" stroke="#fff" stroke-width="${f1(3 / s)}"/>` +
    `</g>`
  );
}

/** 덩이 (금·은 막대) */
function ingot(x: number, y: number, s: number, front: string, top: string, side: string): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3.2 / s)}">` +
    `<path d="M14 -12L20 0L25 -6L19 -18Z" fill="${side}"/>` +
    `<path d="M-14 -12L-9 -18H19L14 -12Z" fill="${top}"/>` +
    `<path d="M-20 0L-14 -12H14L20 0Z" fill="${front}"/>` +
    `<path d="M-10 -4L-7 -9" stroke="#fff" stroke-width="${f1(2.6 / s)}"/>` +
    `</g>`
  );
}

/** 과일나무 바탕 (기둥+둥근 잎) */
const fruitTree = (leaf: string) =>
  trunk(50, 60, 12) +
  blob(leaf, [
    [50, 34, 22],
    [28, 44, 16],
    [72, 44, 16],
    [36, 22, 14],
    [64, 22, 14],
  ]);

/** 포도송이 */
function grapes(x: number, y: number, s: number): string {
  const rows = [
    [-6, 0, 6],
    [-3, 3],
    [-6, 0, 6],
    [-3, 3],
    [0],
  ];
  const balls = rows
    .flatMap((row, i) => row.map((dx) => `<circle cx="${f1(x + dx * s)}" cy="${f1(y + i * 5.5 * s)}" r="${f1(4 * s)}" fill="#8e4fc9" stroke-width="2.2"/>`))
    .join('');
  return `<path d="M${x} ${y - 3 * s}V${f1(y - 9 * s)}" stroke-width="3"/>` + balls;
}

/** 포도잎 */
function vineLeaf(x: number, y: number, s: number, turn = 0): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s})" stroke-width="${f1(3 / s)}">` +
    `<path d="M0 10C-6 8 -14 6 -16 -2C-12 -4 -12 -8 -14 -12C-8 -12 -6 -14 -4 -18C0 -14 4 -14 4 -18C6 -14 8 -12 14 -12C12 -8 12 -4 16 -2C14 6 6 8 0 10Z" fill="#5fc24a"/>` +
    `<path d="M0 8V-10M0 0L-8 -6M0 0L8 -6" stroke="#2f8a3a" stroke-width="${f1(2 / s)}"/>` +
    `</g>`
  );
}

/** 이삭 (보리·밀): (x, y) 이삭 아래, 줄기는 땅(94)까지 */
function ear(x: number, y: number, s: number, kernel: string, stalk: string, awn: number, turn = 0): string {
  const ks = Array.from({ length: 5 }, (_, i) =>
    [-1, 1]
      .map((side) => {
        const kx = f1(side * 4);
        const ky = f1(-i * 7);
        const a = side * 28;
        const aw =
          awn > 0
            ? `<path d="M${kx} ${ky - 4}L${f1(kx + side * awn * 0.35)} ${f1(ky - 4 - awn)}" stroke="#8a7a2a" stroke-width="${f1(1.8 / s)}"/>`
            : '';
        return aw + `<ellipse cx="${kx}" cy="${ky}" rx="4" ry="6.5" fill="${kernel}" stroke-width="${f1(2.4 / s)}" transform="rotate(${a} ${kx} ${ky})"/>`;
      })
      .join(''),
  ).join('');
  const top = awn > 0 ? `<path d="M0 -32V${-32 - awn}" stroke="#8a7a2a" stroke-width="${f1(1.8 / s)}"/>` : '';
  return (
    tube(`M${x} 94C${x} ${f1((94 + y) / 2)} ${x} ${y + 8} ${x} ${y + 4}`, stalk, 3) +
    `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s})">` +
    top +
    ks +
    `<ellipse cx="0" cy="-31" rx="3.5" ry="5.5" fill="${kernel}" stroke-width="${f1(2.4 / s)}"/>` +
    `</g>`
  );
}

/** 해바라기 머리 */
function sunflower(x: number, y: number, s: number): string {
  return petals(x, y, 12, f1(11 * s), f1(6.5 * s), f1(3.6 * s), '#ffd23f', 0, 2.4) + `<circle cx="${x}" cy="${y}" r="${f1(8 * s)}" fill="#6b3e26" stroke-width="2.6"/>` + dot(x - 2 * s, y - 2 * s, 1.6 * s, '#9a5b2e');
}

/** 민들레 씨 하나 (갓털 우산) */
function seed(x: number, y: number, s: number, turn = 0): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s})" stroke-width="${f1(1.8 / s)}">` +
    `<path d="M0 0V14" stroke-width="${f1(2 / s)}"/>` +
    `<path d="M-9 -4A9.5 9.5 0 0 1 9 -4L0 0Z" fill="#fff"/>` +
    `<path d="M0 0L-5 -7M0 0V-8M0 0L5 -7" stroke="#9aa6c4" stroke-width="${f1(1.5 / s)}"/>` +
    `<ellipse cx="0" cy="16" rx="1.8" ry="3.4" fill="#9a5b2e"/>` +
    `</g>`
  );
}

/** 네잎클로버 잎 하나 (끝이 가운데) */
const heartLeaf = `<path d="M0 0C-6 -6 -18 -10 -18 -22C-18 -30 -8 -32 0 -24C8 -32 18 -30 18 -22C18 -10 6 -6 0 0Z" fill="#43b04a"/><path d="M0 -4V-20" stroke="#8fe08a" stroke-width="3"/>`;

/** 가시 난 줄기: 곡선을 따라 가시 삼각형 */
function thornStem(p: number[], n: number, fill: string): string {
  const thorns = Array.from({ length: n }, (_, i) => {
    const [x, y, tx, ty] = bez(p, (i + 0.5) / n);
    const side = i % 2 ? 1 : -1;
    const nx = -ty * side;
    const ny = tx * side;
    const a = `${f1(x - tx * 3 + nx * 2)} ${f1(y - ty * 3 + ny * 2)}`;
    const b = `${f1(x + tx * 3 + nx * 2)} ${f1(y + ty * 3 + ny * 2)}`;
    const c = `${f1(x + tx * 2 + nx * 9)} ${f1(y + ty * 2 + ny * 9)}`;
    return `<path d="M${a}L${c}L${b}Z" fill="#e8d8b0" stroke-width="2.2"/>`;
  }).join('');
  return thorns + tube(bezPath(p), fill, 4);
}

/** 펭귄 */
function penguin(x: number, y: number, s: number): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3 / s)}">` +
    `<path d="M-6 0L-12 3H-2ZM6 0L12 3H2Z" fill="#ff9f1a"/>` +
    `<path d="M-12 -18L-19 -4L-11 -10Z" fill="#2a2f45"/><path d="M12 -18L19 -4L11 -10Z" fill="#2a2f45"/>` +
    `<ellipse cx="0" cy="-18" rx="13" ry="19" fill="#2a2f45"/>` +
    `<ellipse cx="0" cy="-14" rx="8.5" ry="13" fill="#fff" stroke="none"/>` +
    `<circle cx="-4" cy="-28" r="3.4" fill="#fff" stroke="none"/><circle cx="4" cy="-28" r="3.4" fill="#fff" stroke="none"/>` +
    dot(-4, -28, 1.8) +
    dot(4, -28, 1.8) +
    `<path d="M-3 -23L0 -19L3 -23Z" fill="#ff9f1a" stroke-width="${f1(1.8 / s)}"/>` +
    `</g>`
  );
}

export const PICS: Record<string, string> = {
  // ── 하늘·우주 ──
  그믐달:
    bg('#27305a') +
    `<path d="M5 78Q50 68 95 78V81Q95 95 81 95H19Q5 95 5 81Z" fill="#ffb27a" stroke="none"/>` +
    `<path d="M5 86Q30 78 52 86T95 84V81Q95 95 81 95H19Q5 95 5 81Z" fill="#3a2f55"/>` +
    `<path d="M58 10A34 34 0 0 0 58 78A42 42 0 0 1 58 10Z" fill="#ffe27a"/>` +
    stars([
      [76, 24, 5],
      [84, 50, 4],
      [66, 44, 3.5],
      [20, 18, 3.5],
    ]),
  명왕성:
    bg('#27305a') +
    stars([
      [16, 16, 4],
      [88, 58, 4],
      [84, 88, 3.5],
      [14, 84, 3.5],
    ]) +
    `<circle cx="46" cy="54" r="32" fill="#d9a878"/>` +
    `<path d="M56 80C40 70 38 56 47 53C52 51 56 56 56 58C56 56 60 51 65 53C74 56 72 70 56 80Z" fill="#f7e7cf" stroke-width="2.5"/>` +
    `<circle cx="30" cy="44" r="5" fill="#b27d52" stroke="none"/><circle cx="42" cy="32" r="3.5" fill="#b27d52" stroke="none"/><circle cx="26" cy="62" r="3.5" fill="#b27d52" stroke="none"/>` +
    `<circle cx="80" cy="22" r="8" fill="#b8b2ac"/>` +
    dot(78, 20, 1.8, '#8a8480'),
  우주복:
    bg('#27305a') +
    stars([
      [14, 16, 4],
      [88, 20, 4],
      [12, 64, 3.5],
      [90, 70, 3.5],
    ]) +
    `<rect x="27" y="46" width="46" height="30" rx="6" fill="#b8c4dc"/>` +
    tube('M43 76V86', '#fff', 11) +
    tube('M57 76V86', '#fff', 11) +
    `<rect x="34" y="84" width="16" height="9" rx="3" fill="#8a96b0"/><rect x="50" y="84" width="16" height="9" rx="3" fill="#8a96b0"/>` +
    tube('M34 54L22 70', '#fff', 10) +
    tube('M66 54L78 70', '#fff', 10) +
    `<circle cx="21" cy="72" r="6" fill="#8a96b0"/><circle cx="79" cy="72" r="6" fill="#8a96b0"/>` +
    `<rect x="32" y="46" width="36" height="34" rx="9" fill="#fff"/>` +
    `<rect x="41" y="56" width="18" height="12" rx="2" fill="#dfe8f5"/>` +
    dot(46, 62, 2.4, '#e8553d') +
    dot(54, 62, 2.4, '#3b78e6') +
    `<circle cx="50" cy="29" r="21" fill="#fff"/>` +
    `<circle cx="50" cy="31" r="15" fill="#bfe3f7"/>` +
    `<circle cx="50" cy="33" r="10" fill="${SKIN}" stroke-width="2.5"/>` +
    `<path d="M40 31C40 23 60 23 60 31C56 27 44 27 40 31Z" fill="#5a3b24" stroke-width="2"/>` +
    dot(46, 33, 1.8) +
    dot(54, 33, 1.8) +
    `<path d="M47 37q3 2 6 0" stroke-width="2"/>` +
    `<path d="M38 24Q41 19 46 18" stroke="#fff" stroke-width="3"/>`,

  // ── 땅의 힘 ──
  화산재:
    `<path d="M42 58Q44 48 40 40H60Q56 48 58 58Z" fill="#8a93a8"/>` +
    blob('#9aa3b5', [
      [50, 36, 13],
      [34, 30, 12],
      [66, 30, 12],
      [44, 18, 12],
      [60, 17, 11],
      [24, 20, 9],
      [78, 20, 9],
    ]) +
    `<path d="M8 92L36 58H64L92 92Z" fill="#8a5a3a"/>` +
    `<path d="M36 58L28 68Q34 64 38 69Q44 64 50 69Q56 64 62 69Q66 64 72 68L64 58Z" fill="#c4cad6"/>` +
    `<ellipse cx="50" cy="58" rx="14" ry="3.5" fill="#6b3e26"/>` +
    [
      [18, 42],
      [12, 56],
      [22, 62],
      [82, 42],
      [88, 56],
      [78, 60],
      [28, 50],
      [72, 50],
      [14, 74],
      [86, 74],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#6f7890" stroke="none"/>`)
      .join(''),
  온천:
    [22, 50, 78]
      .map((x, i) => `<path d="M${x} ${i === 1 ? 26 : 40}c-5 -5 5 -9 0 -14s5 -9 0 -14" stroke="#aab6cc" stroke-width="4"/>`)
      .join('') +
    `<circle cx="16" cy="58" r="9" fill="#a4adc0"/><circle cx="84" cy="58" r="9" fill="#a4adc0"/><circle cx="30" cy="52" r="7" fill="#b8c4dc"/><circle cx="70" cy="52" r="7" fill="#b8c4dc"/>` +
    `<ellipse cx="50" cy="70" rx="42" ry="20" fill="#7ec8f0"/>` +
    `<circle cx="50" cy="58" r="14" fill="${SKIN}"/>` +
    `<path d="M37 55C36 45 43 43 50 43S64 45 63 55C59 50 55 49 50 49S41 50 37 55Z" fill="#5a3b24"/>` +
    `<rect x="38" y="36" width="24" height="9" rx="3" fill="#fff"/>` +
    `<path d="M42 59q3 -3 6 0M52 59q3 -3 6 0" stroke-width="2.5"/>` +
    cheeks(64, 9) +
    `<path d="M8 71C20 65 80 65 92 71C90 83 72 90 50 90S10 83 8 71Z" fill="#7ec8f0"/>` +
    `<path d="M26 76q6 -3 12 0M62 76q6 -3 12 0M44 84q6 -3 12 0" stroke="#fff" stroke-width="3"/>`,
  간헐천:
    bg('#cfeaf8') +
    ground(76, '#c9b79a') +
    `<path d="M18 86Q34 70 50 72Q66 70 82 86Z" fill="#e0d6c4"/>` +
    `<path d="M44 76C42 58 40 42 36 26H64C60 42 58 58 56 76Z" fill="#7ec8f0"/>` +
    `<path d="M50 70V34" stroke="#fff" stroke-width="3"/>` +
    blob('#e6f4fc', [
      [50, 22, 13],
      [35, 22, 9],
      [65, 22, 9],
      [42, 12, 8],
      [58, 12, 8],
    ]) +
    drop(24, 38, 0.9) +
    drop(76, 40, 0.9) +
    drop(28, 56, 0.7) +
    drop(72, 58, 0.7) +
    `<circle cx="24" cy="86" r="5" fill="#8a96b0"/><circle cx="78" cy="88" r="4" fill="#8a96b0"/>`,
  종유석:
    bg('#5b4d6e') +
    `<path d="M5 22V19Q5 5 19 5H81Q95 5 95 19V22Q72 28 50 22Q28 28 5 22Z" fill="#8a7a96"/>` +
    [
      'M10 21Q18 48 22 66Q26 48 34 23Z',
      'M36 22Q44 54 50 78Q56 54 62 22Z',
      'M62 23Q68 40 71 54Q74 40 80 24Z',
      'M79 24Q84 44 87 62Q90 44 94 22Z',
    ]
      .map((d) => `<path d="${d}" fill="#efe2c4"/>`)
      .join('') +
    `<path d="M16 32H28M42 34H58M44 48H56M66 34H76M82 34H91" stroke="#cdb88e" stroke-width="3"/>` +
    drop(22, 70, 0.6) +
    drop(50, 81, 0.6) +
    drop(87, 66, 0.55),
  석순:
    bg('#5b4d6e') +
    `<path d="M5 16V19Q5 5 19 5H81Q95 5 95 19V16Q72 20 50 16Q28 20 5 16Z" fill="#8a7a96"/>` +
    `<path d="M46 17L50 24L54 17Z" fill="#efe2c4" stroke-width="2.5"/>` +
    drop(50, 26, 0.55) +
    ground(80, '#8a7a96', `Q30 74 50 80T95 80`) +
    [
      'M10 84Q16 60 22 40Q28 60 34 82Z',
      'M34 84Q42 58 50 40Q58 58 66 82Z',
      'M64 82Q70 64 76 50Q82 64 90 84Z',
    ]
      .map((d) => `<path d="${d}" fill="#efe2c4"/>`)
      .join('') +
    `<path d="M16 66H28M40 66H60M44 54H56M68 72H84M71 62H81" stroke="#cdb88e" stroke-width="3"/>`,
  조개화석:
    `<path d="M10 50C8 30 26 12 50 12C76 12 92 30 90 52C88 76 70 90 48 90C24 90 12 72 10 50Z" fill="#c2b8a3"/>` +
    `<path d="M18 30L24 36M80 70L74 74M76 24L70 30" stroke="#9d917a" stroke-width="3"/>` +
    `<g transform="translate(50 50) scale(.72) translate(-50 -58)" stroke-width="4.6">` +
    `<path d="M40 80L34 92H66L60 80Z" fill="#a89c84"/>` +
    `<path d="M50 86L10.2 52.6A9.5 9.5 0 0 1 24 41A9.5 9.5 0 0 1 41 34.8A9.5 9.5 0 0 1 59 34.8A9.5 9.5 0 0 1 76 41A9.5 9.5 0 0 1 89.8 52.6Z" fill="#b3a78f"/>` +
    `<path d="M50 82L25 45M50 82L42 38M50 82L58 38M50 82L75 45" stroke="#7d7260" stroke-width="4.6"/>` +
    `</g>` +
    `<path d="M28 34Q30 28 36 26" stroke="#e8e0d0" stroke-width="3"/>`,
  공룡화석:
    `<path d="M8 26C8 18 14 14 22 15L80 13C88 13 93 18 92 26L90 76C90 84 85 88 78 88H20C12 88 8 83 8 76Z" fill="#b8ab92"/>` +
    `<path d="M14 80L20 76M84 22L80 26" stroke="#8f8370" stroke-width="3"/>` +
    tube('M38 56L32 78M46 56L48 78M62 52L60 78M70 50L74 78', '#f5ecd4', 4) +
    tube('M14 72C24 68 30 56 42 54C54 50 62 54 68 46C72 40 72 34 74 30', '#f5ecd4', 5) +
    [32, 40, 48, 56, 64]
      .map((x, i) => tube(`M${x} ${[57, 55, 53, 52, 51][i]}C${x - 3} 62 ${x - 1} 66 ${x + 2} 68`, '#f5ecd4', 3))
      .join('') +
    `<path d="M68 28C68 20 76 18 84 20C90 22 92 28 86 32C80 34 70 34 68 28Z" fill="#f5ecd4"/>` +
    dot(78, 25, 2.4) +
    `<path d="M80 30H87" stroke-width="2.4"/>`,

  // ── 보석·쇠붙이 ──
  자수정:
    `<path d="M10 90C12 76 26 70 50 72C74 70 88 76 90 90Z" fill="#8a96b0"/>` +
    [
      [20, 84, 10, 14, -38],
      [80, 84, 10, 14, 38],
      [32, 80, 14, 26, -22],
      [68, 80, 14, 28, 20],
      [50, 80, 18, 40, 0],
    ]
      .map(
        ([x, y, w, h, a]) =>
          `<g transform="rotate(${a} ${x} ${y})">` +
          `<path d="M${x - w / 2} ${y}V${y - h}L${x} ${f1(y - h - w * 0.7)}L${x + w / 2} ${y - h}V${y}Z" fill="#8e4fc9"/>` +
          `<path d="M${x - w / 2} ${y}V${y - h}L${x} ${f1(y - h - w * 0.7)}V${y}Z" fill="#b98ae8" stroke-width="2.5"/>` +
          `</g>`,
      )
      .join('') +
    sparkle(84, 30, 6) +
    sparkle(16, 44, 5),
  보석:
    gem(50, 42, 1.3, '#ff5c70', '#ff9aa8') +
    `<g transform="translate(22 72)"><path d="M-8 -12H8L13 -7V7L8 12H-8L-13 7V-7Z" fill="#43b04a"/><rect x="-6" y="-6" width="12" height="12" fill="#8fe08a" stroke-width="2.4"/></g>` +
    `<ellipse cx="78" cy="72" rx="12" ry="14" fill="#3b78e6"/><ellipse cx="78" cy="72" rx="5.5" ry="7" fill="#7eb0f5" stroke-width="2.4"/>` +
    `<path d="M40 86L46 80L52 86L46 92Z" fill="#ffd23f"/>` +
    sparkle(20, 22, 7) +
    sparkle(82, 20, 6) +
    sparkle(62, 88, 4),
  에메랄드:
    `<path d="M32 14H68L82 28V72L68 86H32L18 72V28Z" fill="#3a9e47"/>` +
    `<path d="M38 26H62L70 34V66L62 74H38L30 66V34Z" fill="#5fc24a" stroke-width="2.6"/>` +
    `<path d="M32 14L38 26M68 14L62 26M82 28L70 34M82 72L70 66M68 86L62 74M32 86L38 74M18 72L30 66M18 28L30 34" stroke-width="2.4"/>` +
    `<rect x="42" y="36" width="16" height="28" rx="2" fill="#8fe08a" stroke-width="2.4"/>` +
    `<path d="M24 32L30 26" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(86, 12, 6) +
    sparkle(12, 88, 5),
  사파이어:
    `<ellipse cx="50" cy="50" rx="30" ry="36" fill="#3b78e6"/>` +
    `<path d="M50 14L42 32L50 50L58 32ZM20 50L36 42L50 50L36 58ZM80 50L64 42L50 50L64 58ZM50 86L42 68L50 50L58 68Z" fill="#5a92ec" stroke-width="2.2"/>` +
    `<ellipse cx="50" cy="50" rx="14" ry="18" fill="#7eb0f5" stroke-width="2.6"/>` +
    `<path d="M30 32Q34 24 42 20" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(86, 16, 6) +
    sparkle(14, 84, 5),
  금덩이:
    ingot(30, 86, 1.15, '#ffc933', '#ffe27a', '#e8a21a') +
    ingot(68, 86, 1.15, '#ffc933', '#ffe27a', '#e8a21a') +
    ingot(48, 64, 1.15, '#ffc933', '#ffe27a', '#e8a21a') +
    sparkle(26, 42, 7) +
    sparkle(76, 36, 8) +
    sparkle(54, 22, 5),
  다시마:
    bg('#7ec8f0') +
    ground(84, '#f2d49b') +
    `<path d="M24 88C14 70 32 56 22 38C16 26 22 16 28 10C34 18 32 28 36 38C44 56 30 72 38 88Z" fill="#8a7a34"/>` +
    `<path d="M44 88C38 68 56 52 48 32C44 22 48 14 52 8C58 16 58 24 60 32C66 52 54 70 58 88Z" fill="#6f6a2a"/>` +
    `<path d="M64 88C60 72 74 60 70 44C68 36 72 28 76 22C82 30 82 38 82 46C84 62 74 74 78 88Z" fill="#9a8a3e"/>` +
    `<path d="M29 80C24 66 34 54 28 36M51 80C48 64 58 50 53 28M71 80C69 68 77 58 76 40" stroke="#b8a860" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="88" rx="30" ry="5" fill="#8a96b0"/>` +
    `<circle cx="84" cy="16" r="4" fill="#d7eefb" stroke-width="2.4"/><circle cx="88" cy="28" r="2.8" fill="#d7eefb" stroke-width="2"/><circle cx="14" cy="18" r="3" fill="#d7eefb" stroke-width="2"/>`,
  독버섯:
    `<path d="M14 92C24 86 76 86 86 92" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M40 56L37 88H63L60 56Z" fill="#fff4e0"/>` +
    `<path d="M36 64Q50 72 64 64L63 71Q50 78 37 71Z" fill="#fff"/>` +
    `<path d="M12 58C12 30 30 12 50 12S88 30 88 58Z" fill="#e8553d"/>` +
    `<path d="M12 58Q50 68 88 58" fill="#f5d9c0"/>` +
    [
      [30, 38, 6],
      [50, 26, 6],
      [68, 36, 6],
      [42, 48, 4.5],
      [60, 50, 4],
      [22, 52, 3.5],
      [80, 50, 3.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke-width="2.4"/>`)
      .join('') +
    `<path d="M24 88l3 -8l3 8M70 88l3 -8l3 8" stroke="#43b04a" stroke-width="3"/>`,
  밤송이:
    Array.from({ length: 30 }, (_, k) => {
      const a = (k * 12 * Math.PI) / 180;
      return `<path d="M${f1(50 + 20 * Math.cos(a))} ${f1(56 + 20 * Math.sin(a))}L${f1(50 + 37 * Math.cos(a))} ${f1(56 + 37 * Math.sin(a))}" stroke="#4f9a2c" stroke-width="3"/>`;
    }).join('') +
    `<circle cx="50" cy="56" r="27" fill="#8fd14f"/>` +
    [
      [36, 64],
      [50, 72],
      [64, 64],
      [42, 76],
      [58, 78],
      [30, 52],
      [70, 52],
    ]
      .map(([x, y]) => `<path d="M${x - 3} ${y + 3}L${x} ${y - 3}L${x + 3} ${y + 3}" stroke="#4f9a2c" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M28 46C34 32 66 32 72 46C62 52 38 52 28 46Z" fill="#f2e0b0"/>` +
    [
      [40, 44, -18],
      [60, 44, 18],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a}) scale(1.25)" stroke-width="2.6">` +
          `<path d="M-10 6C-12 -4 -6 -14 0 -16C6 -14 12 -4 10 6Z" fill="#8a4a24"/>` +
          `<path d="M-10 6C-10 1 10 1 10 6C8 9 -8 9 -10 6Z" fill="#e0bd84"/>` +
          `<path d="M-5 -8Q-3 -11 0 -12" stroke="#fff" stroke-width="2.4"/></g>`,
      )
      .join(''),

  // ── 꽃 ──
  꽃가루:
    petals(38, 64, 8, 16, 11, 7.5, '#ff9aa8') +
    `<circle cx="38" cy="64" r="11" fill="#ffd23f"/>` +
    dot(34, 62, 1.8, '#e8862e') +
    dot(41, 60, 1.8, '#e8862e') +
    dot(39, 67, 1.8, '#e8862e') +
    `<path d="M50 50Q58 42 62 34M54 58Q66 52 74 46" stroke="#9aa6c4" stroke-width="2.5"/>` +
    ring(74, 26, 18, 16) +
    [
      [66, 20],
      [76, 14],
      [84, 24],
      [72, 30],
      [80, 36],
      [64, 34],
      [86, 12],
      [58, 42],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#ffd23f" stroke-width="2"/>`)
      .join(''),
  꽃바구니:
    tube('M24 56C24 14 76 14 76 56', '#c98a45', 5) +
    `<ellipse cx="30" cy="52" rx="10" ry="5" fill="#43b04a" transform="rotate(-25 30 52)"/><ellipse cx="72" cy="52" rx="10" ry="5" fill="#43b04a" transform="rotate(25 72 52)"/>` +
    flower(40, 36, 20, '#a45cf0') +
    flower(62, 34, 20, '#ff9f1a') +
    flower(28, 48, 22, '#ff5c70') +
    flower(50, 46, 24, '#ffd23f', '#e8862e') +
    flower(72, 48, 22, '#e85d9a') +
    `<path d="M20 58H80L73 90H27Z" fill="#c98a45"/>` +
    `<path d="M23 70H77M25 80H75M38 58L40 90M50 58V90M62 58L60 90" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="15" y="54" width="70" height="8" rx="4" fill="#b57536"/>`,
  화환:
    tube('M50 50L30 94M50 50L70 94M50 50V94', BARK, 3) +
    `<circle cx="50" cy="40" r="23" stroke-width="20"/><circle cx="50" cy="40" r="23" stroke="#3a9e47" stroke-width="13"/>` +
    Array.from({ length: 8 }, (_, k) => {
      const a = ((-90 + k * 45) * Math.PI) / 180;
      const cols = ['#ff5c70', '#fff', '#ffd23f', '#e85d9a'];
      return flower(f1(50 + 23 * Math.cos(a)), f1(40 + 23 * Math.sin(a)), 17, cols[k % 4], k % 4 === 2 ? '#e8862e' : '#ffd23f', 2.2);
    }).join('') +
    `<path d="M44 66L36 86L42 84L46 90L50 68ZM56 66L64 86L58 84L54 90L50 68Z" fill="#ff5c70"/>` +
    `<circle cx="50" cy="66" r="4.5" fill="#ff5c70"/>`,
  꽃목걸이: torso(
    Array.from({ length: 9 }, (_, k) => {
      const t = (k / 8) * Math.PI;
      const cols = ['#ff5c70', '#ffd23f', '#e85d9a', '#fff', '#ff9f1a'];
      return flower(f1(50 + 22 * Math.cos(t)), f1(44 + 30 * Math.sin(t)), 12, cols[k % 5], cols[k % 5] === '#ffd23f' ? '#e8862e' : '#ffd23f', 2);
    }).join(''),
  ),
  꽃반지:
    tube('M32 80L16 60', SKIN, 12) +
    [
      [36, 30],
      [49, 22],
      [62, 26],
      [74, 36],
    ]
      .map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="50" rx="6" fill="${SKIN}"/>`)
      .join('') +
    `<path d="M26 60H82V88Q82 96 74 96H34Q26 96 26 88Z" fill="${SKIN}" stroke="none"/>` +
    `<path d="M26 62V96M81 62V96" />` +
    `<path d="M55 50Q62 55 69 50" stroke="#43b04a" stroke-width="5"/>` +
    flower(62, 44, 24, '#fff') +
    sparkle(84, 20, 6) +
    sparkle(22, 30, 5),

  // ── 풀 ──
  잡초:
    `<path d="M5 62H95V81Q95 95 81 95H19Q5 95 5 81Z" fill="#6b5a4a"/>` +
    `<rect x="6" y="64" width="26" height="14" rx="3" fill="#c9cfdb"/><rect x="37" y="64" width="26" height="14" rx="3" fill="#c9cfdb"/><rect x="68" y="64" width="26" height="14" rx="3" fill="#c9cfdb"/>` +
    `<rect x="8" y="82" width="36" height="12" rx="3" fill="#c9cfdb"/><rect x="50" y="82" width="42" height="12" rx="3" fill="#c9cfdb"/>` +
    `<path d="M34 66C30 50 20 40 10 36C22 38 30 46 34 56C34 40 30 26 22 14C36 24 40 40 38 56C42 42 50 34 60 30C52 40 44 50 40 66Z" fill="#5fc24a"/>` +
    `<path d="M35 66L18 56L24 54L16 48L26 48L24 42L36 58ZM37 66L52 56L46 54L54 48L44 48L46 42L36 58Z" fill="#43b04a"/>` +
    `<path d="M66 66C64 56 60 48 54 44C62 46 66 52 68 58C70 48 74 42 80 38C76 46 72 54 70 66Z" fill="#5fc24a"/>` +
    tube('M66 64C66 46 70 30 76 18M76 18L72 12M76 18L80 12M74 26L70 22M72 34L76 30', '#8fb840', 2) +
    `<path d="M47 94C46 88 44 84 40 82C44 82 47 84 48 88C50 84 52 82 56 82C52 84 50 88 50 94Z" fill="#5fc24a" stroke-width="2.6"/>`,
  풀잎:
    `<path d="M40 94C36 64 38 34 60 8C48 38 50 66 54 94Z" fill="#5fc24a"/>` +
    `<path d="M46 90C44 64 46 40 58 14" stroke="#9ee07a" stroke-width="2.5"/>` +
    `<path d="M52 94C58 70 70 48 90 38C74 56 66 72 66 94Z" fill="#43b04a"/>` +
    `<path d="M28 94C24 80 18 70 10 62C24 66 34 76 40 94Z" fill="#3a9e47"/>` +
    `<path d="M50 8C54 7 56 4 57 1" stroke="none"/>` +
    drop(47, 40, 1.1) +
    `<path d="M45 48q-1 3 1 5" stroke="#fff" stroke-width="2"/>`,
  풀밭:
    bg('#cfeaf8') +
    blob('#fff', [
      [28, 20, 7],
      [36, 16, 8],
      [44, 20, 6],
    ]) +
    ground(44, '#6cc24a', `Q30 38 50 44T95 42`) +
    [
      [16, 62],
      [34, 56],
      [58, 60],
      [80, 54],
      [24, 80],
      [46, 76],
      [70, 78],
      [86, 70],
      [12, 50],
      [40, 88],
      [62, 90],
    ]
      .map(([x, y]) => `<path d="M${x - 6} ${y}L${x - 4} ${y - 8}L${x - 1} ${y}L${x + 1} ${y - 10}L${x + 3} ${y}L${x + 6} ${y - 7}" stroke="#2f8a3a" stroke-width="3"/>`)
      .join('') +
    flower(26, 68, 11, '#fff', '#ffd23f', 2) +
    flower(66, 66, 11, '#ffd23f', '#e8862e', 2) +
    flower(52, 86, 10, '#ff9aa8', '#ffd23f', 2) +
    flower(84, 86, 10, '#fff', '#ffd23f', 2),
  잔디밭:
    bg('#cfeaf8') +
    ground(48, '#6cc24a') +
    [
      [23, 41],
      [59, 77],
    ]
      .map(([a, b]) => `<path d="M${f1(50 + (a - 50) * 0.6)} 48L${a} 95H${b}L${f1(50 + (b - 50) * 0.6)} 48Z" fill="#43b04a" stroke="none"/>`)
      .join('') +
    `<path d="M5 48H95" />` +
    `<path d="M8 40H92M8 32H92" stroke-width="3"/>` +
    [12, 24, 36, 48, 60, 72, 84]
      .map((x) => `<path d="M${x - 3} 48V28L${x} 24L${x + 3} 28V48Z" fill="#fff" stroke-width="2.4"/>`)
      .join('') +
    `<path d="M5 48H95V81Q95 95 81 95H19Q5 95 5 81Z" />`,

  // ── 밭 ──
  보리밭:
    bg('#cfeaf8') +
    ground(62, '#8fcf5a', `Q50 56 95 62`) +
    [14, 26, 74, 86]
      .map((x) => `<path d="M${x} 74V60M${x - 3} 62L${x - 5} 54M${x + 3} 62L${x + 5} 54" stroke="#5a9a2e" stroke-width="3"/>`)
      .join('') +
    ear(32, 52, 1, '#c7d96a', '#6aa03a', 16, -10) +
    ear(52, 44, 1.1, '#c7d96a', '#6aa03a', 18, 0) +
    ear(70, 54, 1, '#c7d96a', '#6aa03a', 16, 12),
  밀밭:
    bg('#cfeaf8') +
    `<circle cx="84" cy="18" r="8" fill="#ffb347"/>` +
    ground(62, '#f5d77a', `Q50 56 95 62`) +
    [14, 26, 74, 86]
      .map((x) => `<path d="M${x} 74V60M${x - 3} 62L${x - 5} 54M${x + 3} 62L${x + 5} 54" stroke="#c9a040" stroke-width="3"/>`)
      .join('') +
    ear(32, 54, 1.15, '#f2c14e', '#d9a93a', 0, -10) +
    ear(52, 46, 1.25, '#f2c14e', '#d9a93a', 0, 0) +
    ear(70, 56, 1.15, '#f2c14e', '#d9a93a', 0, 12),
  옥수수밭:
    bg('#cfeaf8') +
    [12, 50, 88].map((x) => tube(`M${x} 70V40`, '#8fd14f', 3) + `<path d="M${x} 50L${x - 8} 44M${x} 56L${x + 8} 50" stroke="#5fc24a" stroke-width="3"/>`).join('') +
    ground(70, '#9a6b3e') +
    [30, 70]
      .map((x) => {
        const s = x < 50 ? 1 : -1;
        return (
          tube(`M${x} 92V16`, '#5fc24a', 5) +
          `<path d="M${x} 16L${x - 6} 6M${x} 16L${x} 4M${x} 16L${x + 6} 6" stroke="#e0b050" stroke-width="3"/>` +
          `<path d="M${x} 74C${x - s * 8} 64 ${x - s * 18} 64 ${x - s * 22} 74C${x - s * 14} 70 ${x - s * 8} 72 ${x} 78Z" fill="#43b04a"/>` +
          `<path d="M${x} 36C${x - s * 8} 26 ${x - s * 16} 26 ${x - s * 20} 34C${x - s * 12} 32 ${x - s * 6} 34 ${x} 40Z" fill="#43b04a"/>` +
          `<g transform="rotate(${s * 16} ${x} 64)">` +
          `<ellipse cx="${x + s * 11}" cy="46" rx="8" ry="16" fill="#ffd23f"/>` +
          [38, 45, 52]
            .map((y) => `<path d="M${x + s * 8} ${y}h0M${x + s * 14} ${y}h0" stroke="#e8a21a" stroke-width="4"/>`)
            .join('') +
          `<path d="M${x + s * 2} 64C${x} 52 ${x + s * 2} 44 ${x + s * 5} 38C${x + s * 6} 50 ${x + s * 9} 56 ${x + s * 16} 62Z" fill="#8fd14f"/>` +
          `<path d="M${x + s * 11} 30Q${x + s * 14} 24 ${x + s * 18} 24" stroke="#9a5b2e" stroke-width="2.5"/>` +
          `</g>`
        );
      })
      .join(''),
  해바라기밭:
    bg('#cfeaf8') +
    ground(58, '#5fc24a', `Q50 52 95 58`) +
    [14, 50, 86].map((x) => tube(`M${x} 70V38`, '#43b04a', 3)).join('') +
    [14, 50, 86].map((x) => sunflower(x, 32, 0.62)).join('') +
    [28, 72].map((x) => tube(`M${x} 94V56`, '#43b04a', 4)).join('') +
    `<ellipse cx="20" cy="74" rx="9" ry="4.5" fill="#43b04a" transform="rotate(-30 20 74)"/><ellipse cx="80" cy="74" rx="9" ry="4.5" fill="#43b04a" transform="rotate(30 80 74)"/>` +
    [28, 72].map((x) => sunflower(x, 52, 1)).join(''),
  유채꽃:
    bg('#cfeaf8') +
    `<path d="M5 50Q26 34 48 46Q70 32 95 46V60H5Z" fill="#8fcf5a" stroke="none"/>` +
    ground(58, '#ffd23f', `Q50 52 95 58`) +
    [
      [26, 30],
      [50, 22],
      [74, 32],
    ]
      .map(([x, y]) => {
        const fl = [
          [0, 0],
          [-6, 7],
          [6, 7],
          [-8, 16],
          [0, 14],
          [8, 16],
          [-5, 24],
          [5, 24],
        ]
          .map(([dx, dy]) => petals(x + dx, y + dy, 4, 3.2, 3.4, 2.6, '#ffd23f', 45, 2) + dot(x + dx, y + dy, 1.4, '#e8862e'))
          .join('');
        return tube(`M${x} 94V${y + 24}`, '#43b04a', 3) + `<circle cx="${x}" cy="${y - 6}" r="2.6" fill="#8fd14f" stroke-width="2"/>` + fl;
      })
      .join(''),
  메밀꽃:
    bg('#27305a') +
    `<circle cx="80" cy="20" r="10" fill="#fff1b8"/>` +
    ground(62, '#2f5a3a', `Q50 56 95 62`) +
    [
      [16, 60],
      [30, 64],
      [70, 64],
      [86, 60],
      [50, 66],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke="none"/><circle cx="${x + 5}" cy="${y + 2}" r="2.5" fill="#fff" stroke="none"/>`)
      .join('') +
    [
      [26, 40, -8],
      [50, 30, 0],
      [74, 42, 8],
    ]
      .map(
        ([x, y, a]) =>
          tube(`M${x} 94C${x} 74 ${x + a} 60 ${x + a} ${y + 6}`, '#e0506a', 3) +
          `<path d="M${x} 76C${x - 12} 72 ${x - 14} 64 ${x - 10} 60C${x - 6} 64 ${x - 2} 68 ${x} 76Z" fill="#43b04a" stroke-width="2.5"/>` +
          blob('#fff', [
            [x + a, y, 6],
            [x + a - 7, y + 5, 5],
            [x + a + 7, y + 5, 5],
            [x + a - 4, y - 5, 5],
            [x + a + 5, y - 4, 5],
          ]) +
          dot(x + a - 3, y, 1.5, '#ff9aa8') +
          dot(x + a + 4, y + 3, 1.5, '#ff9aa8') +
          dot(x + a, y - 5, 1.5, '#ff9aa8'),
      )
      .join(''),
  벼:
    bg('#cfeaf8') +
    ground(74, '#7ec8f0') +
    `<path d="M14 84q6 -3 12 0M60 88q6 -3 12 0M40 80q6 -3 12 0" stroke="#fff" stroke-width="3"/>` +
    [
      [26, [26, 80, 26, 50, 26, 34, 32, 26], [32, 26, 42, 20, 50, 30, 50, 46]],
      [56, [56, 80, 56, 46, 56, 30, 62, 22], [62, 22, 72, 16, 80, 26, 82, 44]],
    ]
      .map(([x, st, pan]) => {
        const s = st as number[];
        const p = pan as number[];
        const grains = [0.2, 0.35, 0.5, 0.65, 0.8, 0.95]
          .map((t) => {
            const [gx, gy, tx, ty] = bez(p, t);
            const a = f1((Math.atan2(ty, tx) * 180) / Math.PI);
            return [-1, 1]
              .map((side) => {
                const ex = f1(gx - ty * side * 4);
                const ey = f1(gy + tx * side * 4);
                return `<ellipse cx="${ex}" cy="${ey}" rx="4.5" ry="3" fill="#f2c14e" stroke-width="2" transform="rotate(${a} ${ex} ${ey})"/>`;
              })
              .join('');
          })
          .join('');
        const xx = x as number;
        return (
          `<path d="M${xx} 82C${xx - 8} 66 ${xx - 14} 56 ${xx - 18} 50M${xx} 82C${xx + 6} 68 ${xx + 12} 60 ${xx + 16} 56" stroke="#43b04a" stroke-width="4"/>` +
          tube(bezPath(s), '#b8b040', 2.5) +
          tube(bezPath(p), '#b8b040', 2) +
          grains
        );
      })
      .join(''),
  짚단: [
    [22, 92, 1, -12],
    [78, 92, 1, 12],
    [50, 92, 1.3, 0],
  ]
    .map(
      ([x, y, s, a]) =>
        `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" stroke-width="${f1(3.2 / s)}">` +
        `<path d="M-13 0L-6 -26L-16 -50C-10 -60 10 -60 16 -50L6 -26L13 0Z" fill="${STRAW}"/>` +
        `<path d="M-7 -4L-3 -26L-9 -50M0 -2V-56M7 -4L3 -26L9 -50" stroke="${STRAW_LINE}" stroke-width="${f1(2.4 / s)}"/>` +
        `<rect x="-8" y="-31" width="16" height="9" rx="2" fill="#9a5b2e"/>` +
        `</g>`,
    )
    .join(''),

  // ── 나무의 부분 ──
  나무껍질:
    `<path d="M14 6H66V94H14Z" fill="#8a5530"/>` +
    `<path d="M22 6C26 26 20 46 24 66S22 88 24 94M36 6C32 22 38 42 34 60S38 84 34 94M50 6C54 20 48 38 52 50" stroke="#5a3520" stroke-width="4"/>` +
    `<path d="M44 56H66V92H46C48 80 44 68 44 56Z" fill="#f2d49b"/>` +
    `<path d="M52 64V86M60 62V88" stroke="#d9b27a" stroke-width="3"/>` +
    `<path d="M64 54L84 46C88 58 90 74 88 88L70 94C72 80 70 66 64 54Z" fill="#8a5530"/>` +
    `<path d="M72 54C76 64 78 76 78 88M80 52C82 62 84 74 84 84" stroke="#5a3520" stroke-width="3.5"/>` +
    ring(74, 70, 20, 28),
  나무뿌리:
    blob('#43b04a', [
      [50, 20, 15],
      [34, 26, 11],
      [66, 26, 11],
    ]) +
    `<path d="M5 50H95V81Q95 95 81 95H19Q5 95 5 81Z" fill="#c49a6c"/>` +
    trunk(50, 30, 12, BARK, 54) +
    tube('M50 52C44 62 32 66 22 64M50 52C46 66 44 76 36 86M50 52C54 66 58 76 66 86M50 52C58 62 70 64 80 62M28 65L20 74M74 63L84 72', BARK, 4) +
    `<path d="M5 50H95" />` +
    `<circle cx="16" cy="84" r="3" fill="#a07a50" stroke="none"/><circle cx="86" cy="84" r="3" fill="#a07a50" stroke="none"/>` +
    ring(50, 72, 38, 20),
  나무줄기:
    `<path d="M10 92H90" stroke="#43b04a" stroke-width="5"/>` +
    trunk(50, 30, 18) +
    `<path d="M46 50C44 58 48 66 46 76M56 44C58 54 54 62 56 70" stroke="#6b3e26" stroke-width="3"/>` +
    blob('#43b04a', [
      [50, 22, 16],
      [30, 28, 12],
      [70, 28, 12],
    ]) +
    ring(50, 64, 20, 28),
  단풍잎:
    tube('M52 72L60 92', '#b8452e', 3) +
    maple(50, 44, 0.84, '#e8553d', 0) +
    `<path d="M50 72V20M50 52L24 34M50 52L76 34M50 60L30 64M50 60L70 64" stroke="#b8452e" stroke-width="2.6"/>` +
    maple(84, 80, 0.2, '#ff9f1a', 20) +
    maple(16, 82, 0.18, '#ffd23f', -25),
  솔잎:
    [
      [22, 76],
      [34, 64],
      [46, 52],
      [58, 40],
      [70, 28],
    ]
      .map(([x, y]) =>
        [
          [-24, -18],
          [-14, -26],
          [18, 20],
          [26, 12],
        ]
          .map(([dx, dy]) => `<path d="M${x} ${y}L${x + dx} ${y + dy}" stroke="#2f8a3a" stroke-width="3"/>`)
          .join(''),
      )
      .join('') +
    tube('M14 88L86 16', '#9a5b2e', 4) +
    `<g transform="rotate(20 80 70)"><ellipse cx="80" cy="72" rx="9" ry="13" fill="#9a5b2e"/><path d="M72 66H88M71 74H89M74 82H86M80 60V84" stroke="#6b3e26" stroke-width="2.4"/></g>` +
    tube('M78 58L76 50', '#9a5b2e', 2),

  // ── 나무 ──
  바오바브나무:
    bg('#ffd9a0') +
    `<circle cx="22" cy="30" r="9" fill="#ff9f1a" stroke="none"/>` +
    ground(80, '#e0c080') +
    tube('M40 36L28 22M45 34L40 16M50 34V14M55 34L62 16M60 36L74 22', '#b08060', 5) +
    blob('#5fc24a', [
      [28, 20, 6],
      [40, 14, 6],
      [50, 12, 6],
      [62, 14, 6],
      [74, 20, 6],
    ]) +
    `<path d="M34 86C28 64 32 44 38 34H62C68 44 72 64 66 86Z" fill="#b08060"/>` +
    `<path d="M44 44C42 56 44 70 42 80M56 44C58 58 56 70 58 80" stroke="#8a6040" stroke-width="3"/>`,
  올리브나무:
    `<path d="M44 92C46 80 38 72 44 62C48 56 42 52 44 48H56C58 54 52 58 56 64C62 72 54 80 58 92Z" fill="#8a7a60"/>` +
    blob('#a8c47a', [
      [50, 32, 20],
      [28, 40, 15],
      [72, 40, 15],
      [36, 22, 13],
      [64, 22, 13],
    ]) +
    `<path d="M22 40Q28 36 34 38M60 22Q66 18 70 22M44 46Q50 42 56 46" stroke="#6e8a4a" stroke-width="2.5"/>` +
    [
      [30, 30, '#3f6a2a'],
      [52, 22, '#5a3a6a'],
      [70, 34, '#3f6a2a'],
      [42, 42, '#5a3a6a'],
      [62, 46, '#3f6a2a'],
      [22, 48, '#5a3a6a'],
      [78, 48, '#5a3a6a'],
    ]
      .map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="5.5" fill="${c}" stroke-width="2.2"/>` + dot((x as number) - 1.5, (y as number) - 2, 1.2, '#fff'))
      .join(''),
  복숭아나무:
    fruitTree('#4caf50') +
    [
      [30, 44],
      [52, 26],
      [70, 48],
      [46, 52],
      [72, 28],
      [26, 28],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x + 5}" cy="${y - 7}" rx="4" ry="2.2" fill="#3a9e47" stroke-width="1.8" transform="rotate(-30 ${x + 5} ${y - 7})"/>` +
          `<path d="M${x} ${y + 7}C${x - 9} ${y + 5} ${x - 9} ${y - 7} ${x} ${y - 6}C${x + 9} ${y - 7} ${x + 9} ${y + 5} ${x} ${y + 7}Z" fill="#ffb0a0" stroke-width="2.4"/>` +
          `<path d="M${x} ${y - 5}Q${x - 3} ${y} ${x} ${y + 6}" stroke="#e8736a" stroke-width="2"/>` +
          `<circle cx="${x + 3}" cy="${y}" r="3" fill="#ff7a8a" stroke="none" opacity=".6"/>`,
      )
      .join(''),
  귤나무:
    trunk(50, 70, 10) +
    blob('#2f8a3a', [
      [50, 44, 26],
      [28, 50, 18],
      [72, 50, 18],
      [36, 30, 16],
      [64, 30, 16],
    ]) +
    [
      [26, 50],
      [40, 40],
      [56, 32],
      [70, 44],
      [50, 56],
      [34, 26],
      [66, 60],
      [80, 54],
      [20, 38],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.6" fill="#ff9f1a" stroke-width="2.4"/>` + dot(x, y - 5, 1.4, '#3a9e47') + dot(x - 2, y - 1, 1.2, '#fff'))
      .join(''),
  포도나무:
    `<path d="M10 92H90" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M44 92C40 80 50 72 46 60C44 52 48 46 50 40H58C56 48 54 54 56 62C60 74 50 82 54 92Z" fill="${BARK}"/>` +
    [
      [30, 26, 1.1, -20],
      [50, 18, 1.2, 0],
      [70, 26, 1.1, 20],
      [18, 36, 0.9, -40],
      [82, 36, 0.9, 40],
    ]
      .map(([x, y, s, a]) => vineLeaf(x, y, s, a))
      .join('') +
    grapes(28, 42, 1.1) +
    grapes(72, 42, 1.1) +
    grapes(50, 36, 1),
  가시덤불:
    `<path d="M10 92H90" stroke="#8a7a50" stroke-width="5"/>` +
    thornStem([40, 92, 30, 70, 14, 56, 12, 36], 5, '#6b4a2e') +
    thornStem([50, 92, 50, 60, 62, 30, 84, 22], 6, '#7a5a34') +
    thornStem([58, 92, 70, 76, 86, 66, 90, 48], 4, '#6b4a2e') +
    thornStem([44, 92, 40, 66, 30, 36, 44, 14], 5, '#7a5a34') +
    [
      [22, 46, -30],
      [60, 40, 20],
      [80, 58, 40],
      [36, 62, -20],
    ]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.4" fill="#5fc24a" stroke-width="2.4" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    `<circle cx="70" cy="30" r="4" fill="#8e4fc9" stroke-width="2.2"/><circle cx="18" cy="30" r="4" fill="#8e4fc9" stroke-width="2.2"/>`,
  다육식물:
    petals(50, 50, 7, 17, 12, 7, '#8fcfa0', -180 + 12, 3) +
    petals(50, 48, 6, 9, 10, 6.5, '#a9dcb3', -90, 3) +
    `<ellipse cx="50" cy="46" rx="6" ry="5" fill="#c6ecc8"/>` +
    `<path d="M26 60H74L68 92H32Z" fill="#e8862e"/>` +
    `<rect x="22" y="56" width="56" height="10" rx="3" fill="#e8862e"/>` +
    petals(50, 58, 3, 14, 11, 7, '#8fcfa0', 30 + 30, 3) +
    [
      [28, 38],
      [72, 38],
      [50, 26],
    ]
      .map(([x, y]) => dot(x, y, 2.2, '#ff9aa8'))
      .join(''),
  민들레씨:
    bg('#cfeaf8') +
    tube('M30 94C30 76 32 66 30 52', '#43b04a', 3) +
    `<circle cx="30" cy="40" r="17" fill="#fff"/>` +
    Array.from({ length: 12 }, (_, k) => {
      const a = (k * 30 * Math.PI) / 180;
      return `<path d="M30 40L${f1(30 + 14 * Math.cos(a))} ${f1(40 + 14 * Math.sin(a))}" stroke="#b8c4dc" stroke-width="2"/>`;
    }).join('') +
    `<circle cx="30" cy="40" r="3.5" fill="#9a8a3e" stroke-width="2"/>` +
    `<path d="M52 50Q62 46 70 48M56 62Q64 58 72 62" stroke="#9aa6c4" stroke-width="2.5"/>` +
    seed(66, 22, 1.5, 20) +
    seed(84, 44, 1.3, 35) +
    seed(80, 72, 1.1, 50),
  철쭉:
    blob('#3a9e47', [
      [50, 76, 18],
      [26, 78, 14],
      [74, 78, 14],
      [38, 64, 12],
      [62, 64, 12],
    ]) +
    flower(22, 70, 18, '#e85d9a', '#fff1f6', 2.2) +
    flower(78, 72, 18, '#e85d9a', '#fff1f6', 2.2) +
    flower(50, 82, 16, '#ff7ab8', '#fff1f6', 2.2) +
    petals(50, 40, 5, 14, 14, 11, '#ff7ab8', -90, 3) +
    `<circle cx="50" cy="40" r="6" fill="#fff1f6"/>` +
    dot(46, 30, 1.8, '#c2336e') +
    dot(50, 28, 1.8, '#c2336e') +
    dot(54, 30, 1.8, '#c2336e') +
    `<path d="M50 40C52 32 58 24 66 20M50 40C54 34 62 30 70 30M50 40C50 32 50 24 54 16" stroke="#c2336e" stroke-width="2"/>` +
    dot(66, 20, 2.4, '#ffd23f') +
    dot(70, 30, 2.4, '#ffd23f') +
    dot(54, 16, 2.4, '#ffd23f'),
  선인장꽃:
    `<path d="M32 80H68L64 94H36Z" fill="#e8862e"/>` +
    `<rect x="29" y="76" width="42" height="8" rx="3" fill="#e8862e"/>` +
    tube('M36 62H28V50', '#43b04a', 8) +
    `<path d="M36 78V44C36 34 64 34 64 44V78Z" fill="#43b04a"/>` +
    `<path d="M45 42V76M55 42V76" stroke="#2f8a3a" stroke-width="3"/>` +
    `<path d="M40 54l-3 -2M40 66l-3 -2M60 52l3 -2M60 64l3 -2M50 50l0 -3M50 64l0 -3" stroke="#fff" stroke-width="2"/>` +
    petals(50, 26, 8, 11, 10, 6, '#ff5c70', -90, 3) +
    petals(50, 26, 8, 7, 6, 4, '#ff9aa8', -67.5, 2.4) +
    `<circle cx="50" cy="26" r="5" fill="#ffd23f"/>` +
    sparkle(82, 20, 6) +
    sparkle(18, 30, 5),
  네잎클로버:
    tube('M52 52C58 66 60 80 66 92', '#43b04a', 3) +
    [0, 90, 180, 270].map((a) => `<g transform="translate(50 44) rotate(${a + 45}) scale(.95)">${heartLeaf}</g>`).join('') +
    sparkle(86, 14, 7) +
    sparkle(14, 84, 5) +
    sparkle(88, 70, 4),
  수초:
    bg('#7ec8f0') +
    ground(82, '#f2d49b') +
    `<path d="M20 86C14 66 26 50 18 28C24 44 30 60 26 86Z" fill="#43b04a"/>` +
    `<path d="M28 86C30 64 22 44 30 16C32 40 38 60 34 86Z" fill="#5fc24a"/>` +
    tube('M54 86V20', '#3a9e47', 2.5) +
    [26, 36, 46, 56, 66, 76]
      .map((y) => `<path d="M54 ${y}L44 ${y - 6}M54 ${y}L64 ${y - 6}M54 ${y}L46 ${y + 2}M54 ${y}L62 ${y + 2}" stroke="#3a9e47" stroke-width="3"/>`)
      .join('') +
    `<path d="M76 86C80 70 72 58 80 40C82 58 90 70 84 86Z" fill="#4caf50"/>` +
    `<path d="M70 86C66 76 72 68 68 58C74 66 78 76 76 86Z" fill="#8fd14f" stroke-width="2.6"/>` +
    `<path d="M76 24C80 18 88 18 90 24C88 30 80 30 76 24ZM76 24L72 20V28Z" fill="#ff9f1a" stroke-width="2.2"/>` +
    `<circle cx="40" cy="20" r="3" fill="#d7eefb" stroke-width="2"/><circle cx="44" cy="12" r="2.3" fill="#d7eefb" stroke-width="1.8"/>`,

  // ── 먼 땅 ──
  북극:
    bg('#27305a') +
    `<path d="M8 28C24 16 40 32 56 20S82 14 92 22" stroke="#5fe0a0" stroke-width="7"/>` +
    `<path d="M8 40C24 30 42 42 58 32S82 28 92 34" stroke="#8fd1f0" stroke-width="4"/>` +
    stars([
      [18, 14, 3.5],
      [70, 10, 3.5],
      [86, 46, 3],
    ]) +
    ground(66, '#3b78e6') +
    `<path d="M8 80L16 72H86L94 80L82 88H18Z" fill="#dff3ff"/>` +
    `<g stroke-width="3">` +
    `<rect x="26" y="58" width="9" height="18" rx="4" fill="#eef3fa"/><rect x="54" y="58" width="9" height="18" rx="4" fill="#eef3fa"/>` +
    `<ellipse cx="44" cy="56" rx="22" ry="12" fill="#fff"/>` +
    `<rect x="34" y="60" width="9" height="17" rx="4" fill="#fff"/><rect x="62" y="58" width="9" height="19" rx="4" fill="#fff"/>` +
    `<circle cx="70" cy="42" r="4" fill="#fff"/>` +
    `<path d="M62 52C60 44 66 40 74 42C82 43 86 48 84 52C82 56 66 58 62 52Z" fill="#fff"/>` +
    `</g>` +
    dot(73, 47, 1.8) +
    dot(84, 50, 2.2) +
    `<path d="M22 92q6 -3 12 0M66 92q6 -3 12 0" stroke="#fff" stroke-width="3"/>`,
  남극:
    bg('#cfeaf8') +
    `<path d="M50 60L62 24L74 36L82 20L94 60Z" fill="#fff"/>` +
    `<path d="M62 24L66 40L74 36M82 20L84 38" stroke="#9fd0ee" stroke-width="3"/>` +
    ground(62, '#eef6fc', `Q50 56 95 62`) +
    penguin(36, 86, 1.45) +
    penguin(66, 88, 1.05) +
    `<circle cx="14" cy="18" r="2.4" fill="#fff" stroke-width="1.6"/><circle cx="30" cy="12" r="2" fill="#fff" stroke-width="1.6"/><circle cx="46" cy="22" r="2.4" fill="#fff" stroke-width="1.6"/>`,
  열대우림:
    bg('#2f6a3a') +
    `<path d="M22 5V95M78 5V95" stroke="#6b3e26" stroke-width="10"/>` +
    `<path d="M22 5V95M78 5V95" stroke="#8a5a30" stroke-width="5"/>` +
    `<path d="M36 5C34 20 40 32 36 46M60 5C62 18 56 28 60 40" stroke="#8fd14f" stroke-width="3"/>` +
    [
      [36, 22],
      [37, 36],
      [60, 16],
      [59, 30],
    ]
      .map(([x, y]) => `<ellipse cx="${x + 3}" cy="${y}" rx="4" ry="2.4" fill="#8fd14f" stroke-width="2"/>`)
      .join('') +
    `<path d="M6 60C14 44 34 44 44 58C34 56 22 60 12 72Z" fill="#5fc24a"/>` +
    `<path d="M94 58C86 42 66 42 56 56C66 54 78 58 88 70Z" fill="#43b04a"/>` +
    `<path d="M50 95C42 80 20 72 8 78C18 84 30 88 40 95Z" fill="#4caf50"/>` +
    `<path d="M50 95C58 80 80 72 92 78C82 84 70 88 60 95Z" fill="#5fc24a"/>` +
    `<path d="M50 95C44 80 46 66 50 58C54 66 56 80 50 95Z" fill="#8fd14f"/>` +
    `<path d="M14 58L24 54M86 56L74 52" stroke="#2f8a3a" stroke-width="2.5"/>` +
    tube('M40 44H64', '#8a5a30', 3) +
    `<path d="M52 44C46 44 44 34 48 28C50 22 58 22 60 28C62 32 60 38 58 44Z" fill="#e8553d"/>` +
    `<path d="M50 44L46 60L54 50Z" fill="#3b78e6"/>` +
    `<path d="M52 32C50 38 54 42 58 40" fill="#ffd23f" stroke-width="2.4"/>` +
    `<path d="M60 26L66 30L60 32Z" fill="#ffd23f" stroke-width="2.4"/>` +
    dot(56, 27, 1.8),
  사바나:
    bg('#ffe2a0') +
    `<circle cx="80" cy="22" r="10" fill="#ff9f1a" stroke="none"/>` +
    ground(64, '#e8c060', `Q50 58 95 64`) +
    tube('M30 90V48M30 60L18 44M30 56L42 42', '#8a5a30', 3) +
    blob('#6a9e3a', [
      [30, 38, 8],
      [16, 40, 7],
      [44, 40, 7],
      [22, 34, 7],
      [38, 33, 7],
    ]) +
    `<path d="M62 64L60 84M66 64L66 84M78 64L78 84M82 62L84 84" stroke-width="3.5"/>` +
    `<path d="M60 66C58 56 70 54 84 56C88 58 88 66 84 68C76 70 64 70 60 66Z" fill="#f2c14e"/>` +
    `<path d="M80 58L84 30L90 30L88 60Z" fill="#f2c14e"/>` +
    `<path d="M82 32C82 24 92 22 94 28L94 32Z" fill="#f2c14e"/>` +
    `<path d="M85 24V20M89 24V20" stroke-width="2.5"/>` +
    [
      [66, 60],
      [74, 62],
      [80, 60],
      [86, 42],
      [86, 52],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#b8742e" stroke="none"/>`)
      .join('') +
    dot(90, 28, 1.4) +
    [
      [16, 80],
      [48, 74],
      [44, 88],
    ]
      .map(([x, y]) => `<path d="M${x - 5} ${y}L${x - 3} ${y - 7}L${x} ${y}L${x + 2} ${y - 8}L${x + 5} ${y}" stroke="#b8942e" stroke-width="3"/>`)
      .join(''),
};
