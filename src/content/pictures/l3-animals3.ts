// 동물 그림 묶음 L3-3 (시조새·개 품종·고양이·곰·토끼·사슴 무리·낙타·말 등: 품종·종마다 무늬·귀·뿔·몸 모양으로 구별). 그림 규칙은 docs/picture-style.md.
import { INK, dot, blob, cheeks, tube, sparkle, halo } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5, p = 2.8, c = '#fff') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke-width="2.5"/>` + dot(x, y + 0.3, p);

/** 짙은 털 위의 눈 (흰 테 + 눈동자) */
const darkEye = (x: number, y: number, r = 3) => dot(x, y, r + 1.4, '#fff') + dot(x, y, r);

/** 가시 덩어리 (가시두더지) */
function spikes(cx: number, cy: number, rin: number, rout: number, a0: number, a1: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= n * 2; i++) {
    const [x, y] = pt(cx, cy, i % 2 ? rout : rin, a0 + ((a1 - a0) * i) / (n * 2));
    pts.push(`${x} ${y}`);
  }
  return `M${pts.join('L')}L${cx} ${cy}Z`;
}

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '') =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

/** 오른쪽 반을 왼쪽에 거울로 */
const mirror = (s: string) => s + `<g transform="translate(100 0) scale(-1 1)">${s}</g>`;

/** 눈송이 (하늘색 선) */
const flake = (x: number, y: number, r = 4) =>
  `<path d="M${x - r} ${y}H${x + r}M${r1(x - r * 0.5)} ${r1(y - r * 0.87)}L${r1(x + r * 0.5)} ${r1(y + r * 0.87)}M${r1(x - r * 0.5)} ${r1(y + r * 0.87)}L${r1(x + r * 0.5)} ${r1(y - r * 0.87)}" stroke="#7ec8f0" stroke-width="2"/>`;

/** 옆모습 개 (오른쪽을 본다). 무늬·귀·꼬리·몸 길이로 품종을 가른다 */
interface Dog {
  c: string;
  ear: 'drop' | 'up' | 'round';
  earC?: string;
  head?: string;
  snout?: string;
  tail: string;
  marks?: string;
  headMarks?: string;
  legC?: string;
  x0?: number;
  x1?: number;
  top?: number;
  bot?: number;
  lh?: number;
  sn?: number;
}
function dog(o: Dog): string {
  const x0 = o.x0 ?? 16;
  const x1 = o.x1 ?? 66;
  const top = o.top ?? 42;
  const bot = o.bot ?? 64;
  const lh = o.lh ?? 22;
  const sn = o.sn ?? 9;
  const hx = x1 + 6;
  const hy = top - 8;
  const head = o.head ?? o.c;
  const earC = o.earC ?? head;
  const ear =
    o.ear === 'drop'
      ? `<ellipse cx="${hx - 5}" cy="${hy + 5}" rx="6" ry="12" fill="${earC}" transform="rotate(15 ${hx - 5} ${hy + 5})"/>`
      : o.ear === 'up'
        ? `<path d="M${hx - 11} ${hy - 4}L${hx - 7} ${hy - 25}L${hx + 3} ${hy - 9}Z" fill="${earC}"/>`
        : `<circle cx="${hx - 6}" cy="${hy - 12}" r="8.5" fill="${earC}"/><circle cx="${hx - 6}" cy="${hy - 12}" r="4" fill="#ffb3c4" stroke="none"/>`;
  return (
    o.tail +
    legs([x0 + 5, x0 + 15, x1 - 19, x1 - 9], bot - 8, 8, lh + 8, o.legC ?? o.c) +
    `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" rx="${(bot - top) / 2}" fill="${o.c}"/>` +
    (o.marks ?? '') +
    (o.ear === 'drop' ? '' : ear) +
    `<circle cx="${hx}" cy="${hy}" r="12" fill="${head}"/>` +
    `<ellipse cx="${hx + sn + 3}" cy="${hy + 5}" rx="${sn}" ry="6.5" fill="${o.snout ?? head}"/>` +
    (o.headMarks ?? '') +
    dot(hx + 2 * sn + 2, hy + 2, 3.2) +
    dot(hx + 2, hy - 3, 2.8) +
    `<path d="M${hx + sn} ${hy + 11}q4 2 8 -1" stroke-width="2.5"/>` +
    (o.ear === 'drop' ? ear : '')
  );
}

/** 옆모습 사슴 무리 (노루·꽃사슴): 몸·목·머리 */
function deer(c: string, marks: string, antler: string, rump = ''): string {
  return (
    `<path d="M22 44l-5 -4" stroke-width="4"/>` +
    legs([28, 37, 58, 66], 54, 6, 32, c, '#3d3530') +
    `<ellipse cx="46" cy="50" rx="25" ry="13" fill="${c}"/>` +
    rump +
    marks +
    `<path d="M60 44L70 22L82 24L74 52Z" fill="${c}"/>` +
    antler +
    `<ellipse cx="70" cy="20" rx="7" ry="3.8" fill="${c}" transform="rotate(-25 70 20)"/>` +
    `<ellipse cx="81" cy="25" rx="11" ry="8" fill="${c}" transform="rotate(15 81 25)"/>` +
    `<ellipse cx="88" cy="30" rx="4" ry="3" fill="#f2e3c8" stroke="none"/>` +
    dot(91, 27, 2.6) +
    dot(80, 22, 2.6)
  );
}

/** 옆모습 말 (백마·경주마) */
const horseHead = (c: string, mane: string) =>
  `<path d="M65 18L65 7L73 15Z" fill="${c}"/>` +
  `<path d="M54 50L61 24C62 16 71 12 77 16L91 30C94 34 91 40 86 39L76 36L71 54Z" fill="${c}"/>` +
  `<path d="M62 18C55 26 51 36 49 46L57 45C59 36 61 29 67 22Z" fill="${mane}"/>` +
  dot(74, 24, 3) +
  dot(88, 33, 1.8);

/** 작은 물고기 (송사리) */
const minnow = (x: number, y: number, s: number, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" stroke-width="${r1(3 / s)}">` +
  `<path d="M-10 0L-18 -6L-17 0L-18 6Z" fill="#9fb49a"/>` +
  `<path d="M-2 -5L2 -9L5 -5Z" fill="#9fb49a"/>` +
  `<path d="M-12 0C-6 -6 8 -7 13 -2L14 0L13 2C8 6 -6 6 -12 0Z" fill="#cfdcc8"/>` +
  `<path d="M-8 1H9" stroke="#8aa2c8" stroke-width="${r1(2 / s)}"/>` +
  `<circle cx="8" cy="-1.2" r="3" fill="#fff" stroke-width="${r1(1.6 / s)}"/>` +
  `<circle cx="8.3" cy="-1" r="1.7" fill="${INK}" stroke="none"/>` +
  `</g>`;

/** 고양이 앞얼굴 틀: 귀 색, 얼굴 색, 무늬, 눈 */
const catFace = (earL: string, earR: string, c: string, marks: string, eyeC: string, extra = '') =>
  `<path d="M24 44L25 13L46 29Z" fill="${earL}"/><path d="M76 44L75 13L54 29Z" fill="${earR}"/>` +
  `<ellipse cx="50" cy="56" rx="31" ry="27" fill="${c}"/>` +
  marks +
  `<ellipse cx="39" cy="51" rx="5.5" ry="6.5" fill="${eyeC}" stroke-width="2.5"/><ellipse cx="61" cy="51" rx="5.5" ry="6.5" fill="${eyeC}" stroke-width="2.5"/>` +
  `<g fill="${INK}" stroke="none"><ellipse cx="39" cy="51.5" rx="2" ry="4.5"/><ellipse cx="61" cy="51.5" rx="2" ry="4.5"/></g>` +
  `<path d="M46 61h8l-4 4z" fill="#ff7a9c"/>` +
  extra +
  `<path d="M14 60H30M16 70L30 66M86 60H70M84 70L70 66" stroke-width="2.5"/>`;

/** 광어 가장자리 지느러미 살 */
const finRays = Array.from({ length: 22 }, (_, k) => {
  const a = (k / 22) * 360 + 8;
  if (Math.abs(a - 0) < 20 || Math.abs(a - 360) < 20) return '';
  const [ax, ay] = [r1(46 + 33 * Math.cos((a * Math.PI) / 180)), r1(52 + 22 * Math.sin((a * Math.PI) / 180))];
  const [bx, by] = [r1(46 + 38 * Math.cos((a * Math.PI) / 180)), r1(52 + 27 * Math.sin((a * Math.PI) / 180))];
  return `M${ax} ${ay}L${bx} ${by}`;
}).join('');

export const PICS: Record<string, string> = {
  시조새:
    // 깃털 달린 긴 꼬리 + 날개 끝 발톱 + 이빨 없는 긴 주둥이
    `<path d="M34 56C24 62 14 70 6 82C16 82 28 74 38 64Z" fill="#3a9e47"/>` +
    `<path d="M32 60L22 60M27 65L17 67M22 70L12 74M30 62L30 70M24 67L25 76M18 72L19 81" stroke="#2f6a2a" stroke-width="3"/>` +
    `<path d="M46 62L44 78M44 78L38 82M44 78L48 83M54 62L55 78M55 78L50 83M55 78L60 82" stroke="#e8862e" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="54" rx="18" ry="11" fill="#43b04a"/>` +
    `<ellipse cx="52" cy="58" rx="11" ry="6" fill="#ffd23f" stroke="none"/>` +
    `<path d="M44 48C36 30 44 14 62 8C60 16 60 20 64 24C58 26 56 30 60 34C54 36 54 42 56 48Z" fill="#3b8fe0"/>` +
    `<path d="M50 40L58 36M48 32L58 26M50 22L60 16" stroke="#2a6fc0" stroke-width="2.5"/>` +
    `<path d="M62 8C64 4 69 5 69 9M64 11C68 9 72 12 70 15M62 14C66 14 68 18 66 20" stroke-width="3"/>` +
    `<path d="M62 50C64 42 68 38 74 38L76 50Z" fill="#43b04a"/>` +
    `<circle cx="76" cy="38" r="9" fill="#43b04a"/>` +
    `<path d="M82 34L96 39L94 42L82 44Z" fill="#43b04a"/>` +
    `<path d="M84 43L86 40L88 43L90 40L92 42" stroke-width="1.8"/>` +
    dot(77, 35, 2.6),

  공룡알:
    `<ellipse cx="50" cy="84" rx="40" ry="10" fill="#c98b4f"/>` +
    `<path d="M40 22C38 8 62 8 60 22L55 18L50 23L45 18Z" fill="#eef4d6"/>` +
    `<circle cx="50" cy="30" r="12" fill="#5cc26b"/>` +
    dot(45, 28, 2.6) +
    dot(55, 28, 2.6) +
    `<path d="M46 34q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M26 40L33 33L39 41L45 33L51 41L57 33L63 41L69 33L74 40C80 52 80 72 72 82C64 92 36 92 28 82C20 72 20 52 26 40Z" fill="#eef4d6"/>` +
    `<g fill="#8fbf5a" stroke="none"><ellipse cx="38" cy="54" rx="6" ry="5"/><ellipse cx="60" cy="50" rx="5" ry="4"/><ellipse cx="54" cy="68" rx="7" ry="5.5"/><ellipse cx="34" cy="72" rx="4" ry="3.5"/><ellipse cx="68" cy="70" rx="4" ry="4"/></g>` +
    `<path d="M10 82C18 96 82 96 90 82C78 88 22 88 10 82Z" fill="#a0653a"/>` +
    `<path d="M18 86l8 3M34 89l8 1M58 90l8 -1M74 89l8 -3" stroke="#6b3e26" stroke-width="2.5"/>`,

  푸들:
    // 털을 동글동글 다듬은 머리·귀·가슴·발목·꼬리
    `<path d="M26 46L20 28" stroke-width="3.5"/>` +
    blob('#ffc2d8', [[19, 24, 7]]) +
    legs([28, 37, 57, 65], 52, 5, 30, '#ffe1ec') +
    blob('#ffc2d8', [
      [30, 84, 5.5],
      [39, 84, 5.5],
      [59, 84, 5.5],
      [67, 84, 5.5],
    ]) +
    `<rect x="28" y="44" width="34" height="14" rx="7" fill="#ffe1ec"/>` +
    blob('#ffc2d8', [
      [30, 52, 10],
      [62, 50, 12],
      [58, 42, 9],
    ]) +
    `<ellipse cx="82" cy="35" rx="9" ry="5.5" fill="#ffe1ec"/>` +
    blob('#ffc2d8', [
      [70, 30, 10],
      [70, 17, 8],
      [63, 21, 6],
      [77, 19, 6],
    ]) +
    dot(90, 33, 2.8) +
    dot(74, 29, 2.6) +
    blob('#ffc2d8', [
      [64, 36, 6],
      [63, 45, 6],
    ]) +
    `<path d="M52 40l6 -6l0 8z" fill="#e8553d" stroke-width="2"/>`,

  불도그:
    // 넓적한 얼굴, 접힌 작은 귀, 늘어진 볼, 아래턱이 앞으로 나와 이빨 두 개
    `<path d="M12 40C8 26 18 18 30 24L28 36Z" fill="#a0653a"/><path d="M88 40C92 26 82 18 70 24L72 36Z" fill="#a0653a"/>` +
    `<path d="M10 54C10 30 30 24 50 24S90 30 90 54C90 74 72 86 50 86S10 74 10 54Z" fill="#fff"/>` +
    `<path d="M56 26C70 26 84 34 86 48C78 50 68 46 62 40C58 36 56 32 56 26Z" fill="#c98b4f" stroke="none"/>` +
    darkEye(32, 46, 3.2) +
    dot(68, 46, 3.2) +
    `<path d="M36 52q14 -8 28 0" stroke-width="2.5"/>` +
    `<path d="M32 72C32 90 68 90 68 72Z" fill="#ff8fa8"/>` +
    `<ellipse cx="37" cy="64" rx="15" ry="11" fill="#fff"/><ellipse cx="63" cy="64" rx="15" ry="11" fill="#fff"/>` +
    `<path d="M37 76L39 66L43 75Z" fill="#fff" stroke-width="2"/><path d="M63 76L61 66L57 75Z" fill="#fff" stroke-width="2"/>` +
    `<ellipse cx="50" cy="57" rx="9" ry="6" fill="${INK}"/>`,

  달마티안: dog({
    c: '#fff',
    ear: 'drop',
    earC: '#2a2f45',
    tail: tube('M18 48C10 44 8 36 10 28', '#fff', 4),
    marks:
      `<g fill="${INK}" stroke="none"><ellipse cx="26" cy="50" rx="4" ry="3.5"/><ellipse cx="38" cy="57" rx="3.5" ry="3"/><ellipse cx="44" cy="47" rx="4.5" ry="3.5"/><ellipse cx="56" cy="54" rx="3.5" ry="3"/>` +
      `<ellipse cx="33" cy="72" rx="2.5" ry="3"/><ellipse cx="53" cy="78" rx="2.5" ry="3"/><ellipse cx="60" cy="68" rx="2.5" ry="3"/><ellipse cx="23" cy="78" rx="2.5" ry="3"/></g>`,
    headMarks: `<g fill="${INK}" stroke="none"><ellipse cx="74" cy="25" rx="3" ry="2.5"/><ellipse cx="80" cy="42" rx="2" ry="2"/></g>`,
  }),

  비글: dog({
    c: '#fff',
    ear: 'drop',
    earC: '#a0653a',
    head: '#c98b4f',
    snout: '#fff',
    tail: tube('M18 48C12 42 12 34 14 26', '#3d3530', 4) + `<circle cx="14" cy="24" r="4" fill="#fff"/>`,
    marks:
      `<path d="M26 42H56C60 42 62 46 60 50C54 54 34 54 24 50C21 47 22 42 26 42Z" fill="#3d3530"/>` +
      `<path d="M16 52C16 46 20 43 24 46C26 50 24 56 18 58Z" fill="#c98b4f" stroke="none"/>` +
      `<path d="M56 46C62 44 66 46 66 52C62 56 58 54 56 50Z" fill="#c98b4f" stroke="none"/>`,
    headMarks: `<path d="M77 22C75 28 76 34 80 38H84C82 34 80 28 80 22Z" fill="#fff" stroke="none"/>`,
  }),

  허스키:
    // 뾰족한 귀, 흰 얼굴에 회색 가면, 파란 눈
    `<path d="M22 40L22 8L46 26Z" fill="#5f6b82"/><path d="M78 40L78 8L54 26Z" fill="#5f6b82"/>` +
    `<path d="M26 32L26 16L38 26Z" fill="#fff" stroke="none"/><path d="M74 32L74 16L62 26Z" fill="#fff" stroke="none"/>` +
    `<path d="M14 90C14 72 26 66 50 66S86 72 86 90Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="52" rx="31" ry="29" fill="#fff"/>` +
    `<path d="M19 52C18 34 32 23 50 23S82 34 81 52C76 46 71 40 63 40C57 40 53 44 50 54C47 44 43 40 37 40C29 40 24 46 19 52Z" fill="#5f6b82"/>` +
    `<ellipse cx="38" cy="36" rx="4" ry="2.5" fill="#fff" stroke="none"/><ellipse cx="62" cy="36" rx="4" ry="2.5" fill="#fff" stroke="none"/>` +
    `<circle cx="38" cy="50" r="5.5" fill="#6ec0f5" stroke-width="2.5"/><circle cx="62" cy="50" r="5.5" fill="#6ec0f5" stroke-width="2.5"/>` +
    dot(38, 50.5, 2.5) +
    dot(62, 50.5, 2.5) +
    `<ellipse cx="50" cy="63" rx="6.5" ry="4.5" fill="${INK}"/>` +
    `<path d="M50 67v4M43 72q7 5 14 0"/>` +
    `<path d="M47 73C46 81 54 81 53 73" fill="#ff7a9c"/>`,

  셰퍼드: dog({
    c: '#c98b4f',
    ear: 'up',
    earC: '#3d3530',
    snout: '#3d3530',
    sn: 10,
    tail: `<path d="M20 46C10 50 6 62 8 74C12 72 16 62 22 54Z" fill="#c98b4f"/><path d="M20 46C12 50 9 56 8 64C12 58 16 54 22 52Z" fill="#3d3530" stroke="none"/>`,
    marks: `<path d="M20 50C20 43 26 42 30 42H58C64 42 66 48 60 52C50 56 30 56 22 54C20 53 20 52 20 50Z" fill="#3d3530"/>`,
    headMarks: `<path d="M66 32C68 24 74 22 78 24C76 28 72 32 66 32Z" fill="#3d3530" stroke="none"/>`,
  }),

  치와와:
    // 몸보다 훨씬 큰 귀, 큰 눈, 작은 몸
    `<path d="M38 38L6 8L20 52Z" fill="#e8b77a"/><path d="M33 36L13 17L22 45Z" fill="#ffb3c4" stroke="none"/>` +
    `<path d="M62 38L94 8L80 52Z" fill="#e8b77a"/><path d="M67 36L87 17L78 45Z" fill="#ffb3c4" stroke="none"/>` +
    `<rect x="40" y="76" width="6" height="16" rx="3" fill="#e8b77a"/><rect x="54" y="76" width="6" height="16" rx="3" fill="#e8b77a"/>` +
    `<ellipse cx="50" cy="76" rx="15" ry="10" fill="#e8b77a"/>` +
    `<circle cx="50" cy="50" r="22" fill="#e8b77a"/>` +
    `<ellipse cx="50" cy="60" rx="10" ry="7.5" fill="#f7e0bc"/>` +
    dot(40, 47, 5.2) +
    dot(60, 47, 5.2) +
    dot(41.5, 45, 1.6, '#fff') +
    dot(61.5, 45, 1.6, '#fff') +
    `<ellipse cx="50" cy="57" rx="3.5" ry="2.6" fill="${INK}"/>` +
    `<path d="M46 63q4 3 8 0" stroke-width="2.5"/>`,

  닥스훈트: dog({
    c: '#a0653a',
    ear: 'drop',
    earC: '#6b3e26',
    x0: 8,
    x1: 68,
    top: 50,
    bot: 70,
    lh: 10,
    tail: tube('M10 56C4 52 4 46 6 42', '#a0653a', 4),
  }),

  샴고양이: catFace(
    '#5a3b24',
    '#5a3b24',
    '#f5e8d0',
    `<path d="M50 38C62 38 70 48 70 60C70 74 60 82 50 82C40 82 30 74 30 60C30 48 38 38 50 38Z" fill="#6b4a36" stroke="none"/>`,
    '#5aaef0',
    `<path d="M50 65q-4 5-8 2M50 65q4 5 8 2" stroke="#fff" stroke-width="2.5"/>`,
  ),

  얼룩고양이: catFace(
    '#ff9f1a',
    '#3d3530',
    '#fff',
    `<path d="M22 50C20 36 28 30 40 30C46 34 48 42 44 48C38 52 30 56 22 50Z" fill="#ff9f1a" stroke="none"/>` +
      `<path d="M78 48C80 36 72 30 62 30C56 32 54 40 58 46C64 50 72 54 78 48Z" fill="#3d3530" stroke="none"/>` +
      `<path d="M62 74C68 70 76 66 79 60C80 68 74 76 66 80Z" fill="#ff9f1a" stroke="none"/>`,
    '#8fd14f',
    `<path d="M50 65q-4 5-8 2M50 65q4 5 8 2"/>`,
  ),

  새끼고양이:
    // 엄마 고양이 옆 작은 새끼 (새끼 쪽에 노란 빛)
    `<path d="M88 84C98 80 98 66 90 62" stroke="#e8862e" stroke-width="7"/>` +
    `<path d="M88 84C98 80 98 66 90 62" stroke="#ffab5c" stroke-width="3"/>` +
    `<path d="M56 88C54 70 60 52 72 50C84 52 90 70 88 88Z" fill="#ffab5c"/>` +
    `<path d="M62 30L62 12L72 22Z" fill="#ffab5c"/><path d="M84 30L84 12L74 22Z" fill="#ffab5c"/>` +
    `<circle cx="73" cy="34" r="14" fill="#ffab5c"/>` +
    `<path d="M68 42q5 3 10 0" stroke-width="2.5"/>` +
    `<path d="M66 32q2 -2 4 0M76 32q2 -2 4 0" stroke-width="2.5"/>` +
    halo(32, 92, 1.05) +
    `<ellipse cx="32" cy="80" rx="13" ry="10" fill="#ffab5c"/>` +
    `<path d="M20 58L20 40L31 50Z" fill="#ffab5c"/><path d="M44 58L44 40L33 50Z" fill="#ffab5c"/>` +
    `<circle cx="32" cy="60" r="14" fill="#ffab5c"/>` +
    `<path d="M32 46V51M27 47L28 51M37 47L36 51" stroke="#d9772a" stroke-width="2.5"/>` +
    dot(26, 59, 3.5) +
    dot(38, 59, 3.5) +
    dot(27, 57.6, 1.2, '#fff') +
    dot(39, 57.6, 1.2, '#fff') +
    `<path d="M30 65h4l-2 2z" fill="#ff7a9c" stroke-width="2"/>` +
    `<path d="M32 67q-2 3 -4 1M32 67q2 3 4 1" stroke-width="2"/>` +
    sparkle(12, 44, 5) +
    sparkle(50, 38, 4),

  퓨마:
    // 무늬 없는 황갈색 큰 고양이, 긴 꼬리 끝이 짙다
    tube('M18 50C6 54 4 70 10 78C14 84 22 82 22 74', '#d9a55a', 6) +
    `<circle cx="22" cy="73" r="4.5" fill="#6b4a36"/>` +
    legs([24, 34, 56, 66], 56, 9, 30, '#d9a55a') +
    `<rect x="16" y="38" width="60" height="26" rx="13" fill="#d9a55a"/>` +
    `<path d="M28 62C38 66 56 66 66 62" stroke="#f5e6cc" stroke-width="4"/>` +
    `<path d="M68 32C66 22 70 16 76 22L78 28Z" fill="#d9a55a"/><path d="M71 26L72 21L75 24Z" fill="#6b4a36" stroke="none"/>` +
    `<circle cx="80" cy="38" r="13" fill="#d9a55a"/>` +
    `<ellipse cx="87" cy="45" rx="8" ry="6" fill="#f5e6cc"/>` +
    `<path d="M84 42L90 41L88 44Z" fill="#c96a6a" stroke-width="2"/>` +
    dot(83, 34, 2.6) +
    `<path d="M82 49q5 2 10 -1" stroke-width="2.5"/>` +
    `<path d="M84 46L74 48M84 48L75 52" stroke-width="1.6"/>`,

  스라소니:
    // 귀 끝 검은 털뭉치 + 뺨의 긴 털 + 점무늬
    `<path d="M24 20L20 4M76 20L80 4" stroke-width="4.5"/>` +
    `<path d="M22 44L24 18L44 32Z" fill="#c9a27a"/><path d="M78 44L76 18L56 32Z" fill="#c9a27a"/>` +
    `<path d="M24 24L25 18L31 23ZM76 24L75 18L69 23Z" fill="${INK}" stroke="none"/>` +
    `<path d="M22 50L6 74L22 72L16 88L34 78L50 88L66 78L84 88L78 72L94 74L78 50Z" fill="#f3e6d0"/>` +
    `<ellipse cx="50" cy="54" rx="29" ry="25" fill="#c9a27a"/>` +
    `<g fill="#7a5a3a" stroke="none"><circle cx="30" cy="48" r="2.2"/><circle cx="70" cy="48" r="2.2"/><circle cx="44" cy="36" r="2"/><circle cx="56" cy="36" r="2"/><circle cx="50" cy="42" r="2"/><circle cx="28" cy="60" r="2"/><circle cx="72" cy="60" r="2"/></g>` +
    `<ellipse cx="50" cy="66" rx="12" ry="9" fill="#f3e6d0"/>` +
    `<circle cx="39" cy="52" r="5" fill="#d9c24a" stroke-width="2.5"/><circle cx="61" cy="52" r="5" fill="#d9c24a" stroke-width="2.5"/>` +
    dot(39, 52.5, 2.4) +
    dot(61, 52.5, 2.4) +
    `<path d="M46 61h8l-4 4z" fill="#e87a8a" stroke-width="2"/>` +
    `<path d="M50 65q-4 4-7 2M50 65q4 4 7 2" stroke-width="2.5"/>`,

  개코원숭이:
    // 개처럼 길쭉한 분홍 주둥이 + 어깨의 회색 갈기
    tube('M28 80C12 82 8 66 14 56', '#a89a6a', 4) +
    `<ellipse cx="42" cy="68" rx="22" ry="19" fill="#a89a6a"/>` +
    `<ellipse cx="34" cy="86" rx="10" ry="4" fill="#a89a6a"/>` +
    blob('#c8c0ae', [
      [48, 40, 16],
      [38, 48, 13],
      [58, 52, 11],
    ]) +
    tube('M60 60L64 84', '#a89a6a', 7) +
    `<ellipse cx="66" cy="86" rx="6" ry="3.5" fill="#a89a6a"/>` +
    `<path d="M54 30C62 26 80 28 90 38C94 42 93 49 86 51C76 53 62 50 56 46Z" fill="#e8a0a0"/>` +
    `<path d="M56 30C60 28 66 28 70 31" stroke-width="3"/>` +
    dot(64, 35, 2.8) +
    dot(89, 42, 1.8) +
    `<path d="M76 49q6 1 10 -2" stroke-width="2.2"/>`,

  친칠라:
    // 회색 솜털 공 + 크고 둥근 귀 + 긴 수염 + 복슬 꼬리
    blob('#9aa2b2', [
      [80, 76, 8],
      [86, 66, 7],
      [88, 55, 6],
    ]) +
    `<circle cx="31" cy="23" r="13" fill="#b8bfcc"/><circle cx="69" cy="23" r="13" fill="#b8bfcc"/>` +
    `<circle cx="31" cy="23" r="7" fill="#ffc6d3" stroke="none"/><circle cx="69" cy="23" r="7" fill="#ffc6d3" stroke="none"/>` +
    `<ellipse cx="50" cy="70" rx="27" ry="22" fill="#b8bfcc"/>` +
    `<ellipse cx="50" cy="74" rx="15" ry="15" fill="#eceff4" stroke="none"/>` +
    `<circle cx="50" cy="44" r="20" fill="#b8bfcc"/>` +
    dot(41, 42, 4.2) +
    dot(59, 42, 4.2) +
    dot(42.2, 40.5, 1.4, '#fff') +
    dot(60.2, 40.5, 1.4, '#fff') +
    `<path d="M47 50h6l-3 3z" fill="#ff9aa8" stroke-width="2"/>` +
    `<path d="M40 52L8 46M40 55L10 60M60 52L92 46M60 55L90 60" stroke-width="1.8"/>` +
    `<ellipse cx="43" cy="68" rx="5" ry="4" fill="#eceff4"/><ellipse cx="57" cy="68" rx="5" ry="4" fill="#eceff4"/>` +
    `<ellipse cx="38" cy="92" rx="7" ry="3.5" fill="#eceff4"/><ellipse cx="62" cy="92" rx="7" ry="3.5" fill="#eceff4"/>`,

  페럿:
    // 가늘고 긴 몸 + 눈가 검은 띠 + 짙은 다리·꼬리
    tube('M20 62C8 64 6 74 10 82', '#6b4a36', 6) +
    legs([22, 32, 58, 67], 64, 8, 18, '#6b4a36') +
    `<rect x="14" y="50" width="66" height="20" rx="10" fill="#f2e3c8"/>` +
    `<circle cx="74" cy="41" r="5" fill="#f2e3c8"/>` +
    `<path d="M70 52C70 42 76 38 84 40C90 42 94 48 95 52C92 56 86 58 78 58C74 58 70 56 70 52Z" fill="#f2e3c8"/>` +
    `<path d="M74 43C80 40 88 42 91 47C86 50 78 50 73 48Z" fill="#6b4a36" stroke="none"/>` +
    darkEye(82, 46, 2.2) +
    `<circle cx="95" cy="51" r="2.6" fill="#e87a8a"/>` +
    `<path d="M82 55q5 2 9 0" stroke-width="2.2"/>`,

  날다람쥐:
    // 팔다리 사이 넓은 막을 펴고 활공, 큰 눈, 넓적한 꼬리
    `<path d="M4 44h8M4 56h6M96 44h-8M96 56h-6" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M44 72C38 84 42 94 50 96C58 94 62 84 56 72Z" fill="#8f7058"/>` +
    `<path d="M50 30C62 30 76 26 88 28C86 44 86 60 82 78C70 72 60 74 50 76C40 74 30 72 18 78C14 60 14 44 12 28C24 26 38 30 50 30Z" fill="#b0907a"/>` +
    `<path d="M50 34C58 34 62 44 62 54C62 66 58 74 50 74C42 74 38 66 38 54C38 44 42 34 50 34Z" fill="#f0e2d0"/>` +
    `<circle cx="12" cy="28" r="4" fill="#f0e2d0"/><circle cx="88" cy="28" r="4" fill="#f0e2d0"/><circle cx="18" cy="78" r="4" fill="#f0e2d0"/><circle cx="82" cy="78" r="4" fill="#f0e2d0"/>` +
    `<circle cx="39" cy="14" r="5" fill="#b0907a"/><circle cx="61" cy="14" r="5" fill="#b0907a"/>` +
    `<circle cx="50" cy="26" r="14" fill="#b0907a"/>` +
    `<circle cx="43" cy="24" r="5.5" fill="#fff" stroke-width="2.5"/><circle cx="57" cy="24" r="5.5" fill="#fff" stroke-width="2.5"/>` +
    dot(43, 24.5, 3.8) +
    dot(57, 24.5, 3.8) +
    `<ellipse cx="50" cy="32" rx="2.6" ry="1.8" fill="#e87a8a" stroke="none"/>`,

  황제펭귄:
    // 머리 옆 노란 무늬의 큰 펭귄 + 발밑의 회색 솜털 새끼
    `<ellipse cx="34" cy="90" rx="8" ry="3.5" fill="#ff9f1a"/><ellipse cx="50" cy="90" rx="8" ry="3.5" fill="#ff9f1a"/>` +
    `<path d="M20 44C10 56 10 70 14 76C18 70 21 62 24 56Z" fill="#2a2f45"/><path d="M64 44C74 56 74 70 70 76C66 70 63 62 60 56Z" fill="#2a2f45"/>` +
    `<ellipse cx="42" cy="54" rx="23" ry="36" fill="#2a2f45"/>` +
    `<path d="M42 32C30 32 25 46 25 60C25 76 32 87 42 87S59 76 59 60C59 46 54 32 42 32Z" fill="#fff" stroke="none"/>` +
    `<path d="M29 44Q42 52 55 44Q52 36 42 36Q32 36 29 44Z" fill="#ffe28a" stroke="none"/>` +
    `<ellipse cx="28" cy="34" rx="5" ry="8" fill="#ffb020" transform="rotate(-15 28 34)"/><ellipse cx="56" cy="34" rx="5" ry="8" fill="#ffb020" transform="rotate(15 56 34)"/>` +
    dot(36, 24) +
    dot(48, 24) +
    `<path d="M38 28L46 28L42 40Z" fill="#e8862e" stroke-width="2.5"/>` +
    blob('#c4cad6', [
      [78, 78, 12],
      [72, 84, 7],
      [84, 84, 7],
    ]) +
    `<circle cx="78" cy="62" r="10" fill="#3d3d4a"/>` +
    `<ellipse cx="78" cy="64" rx="7" ry="6" fill="#fff" stroke="none"/>` +
    dot(75, 63, 2.2) +
    dot(81, 63, 2.2) +
    `<path d="M76 67L80 67L78 70Z" fill="#3d3d4a" stroke-width="1.8"/>`,

  왜가리:
    // 물가의 긴 다리·긴 목, 머리 뒤 검은 깃, 노란 긴 부리
    `<path d="M6 88q7-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M44 62L42 86M52 62L54 86" stroke="#d9a55a" stroke-width="4"/>` +
    `<path d="M26 46L8 62L28 56Z" fill="#7a869c"/>` +
    `<path d="M22 44C30 36 52 38 62 46C66 54 60 64 48 66C36 66 26 58 22 44Z" fill="#aab4c4"/>` +
    `<path d="M28 46C36 42 48 44 54 50C50 56 40 58 30 52Z" fill="#7a869c"/>` +
    tube('M58 48C66 42 58 32 62 24C64 18 70 16 74 18', '#e8edf4', 6) +
    `<path d="M74 14L56 8L70 20Z" fill="${INK}"/>` +
    `<circle cx="76" cy="18" r="7" fill="#e8edf4"/>` +
    `<path d="M72 15L80 15" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M82 16L97 20L82 22Z" fill="#ffc933"/>` +
    dot(78, 18, 2),

  잉꼬:
    // 초록 몸, 노란 머리, 검은 물결무늬, 긴 파란 꼬리 (횃대 위)
    `<path d="M40 66L28 94L36 95L48 68Z" fill="#3b78e6"/>` +
    `<ellipse cx="52" cy="56" rx="17" ry="22" fill="#5fc24a" transform="rotate(15 52 56)"/>` +
    `<path d="M40 44C34 52 34 66 42 74C50 70 54 58 52 46Z" fill="#ffe14d"/>` +
    `<path d="M40 52q4 -3 8 0M38 58q5 -3 10 0M39 64q4 -3 8 0M41 70q3 -2 6 0" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="58" cy="30" r="14" fill="#ffe14d"/>` +
    `<path d="M46 26q3 -3 6 0M47 20q3 -3 6 0M52 16q3 -2 6 0" stroke="${INK}" stroke-width="2.5"/>` +
    `<ellipse cx="68" cy="31" rx="3.5" ry="2.5" fill="#4a90e2" stroke-width="2"/>` +
    `<path d="M68 34C74 34 74 40 70 42C68 40 66 38 66 35Z" fill="#e8b77a" stroke-width="2.5"/>` +
    dot(61, 28, 2.8) +
    `<g fill="${INK}" stroke="none"><circle cx="58" cy="43" r="1.8"/><circle cx="64" cy="42" r="1.8"/></g>` +
    tube('M8 80H92', '#9a5b2e', 6) +
    `<path d="M50 76v6M58 76v6" stroke="#e8862e" stroke-width="3.5"/>`,

  우파루파:
    // 분홍 몸, 머리 양옆 깃털 같은 아가미 세 쌍, 웃는 입
    mirror(
      `<path d="M28 34L10 24" stroke="#e8467a" stroke-width="5"/><path d="M26 42L8 40" stroke="#e8467a" stroke-width="5"/><path d="M28 50L12 58" stroke="#e8467a" stroke-width="5"/>` +
        `<path d="M22 28l-2 -5M16 25l-2 -5M22 30l-1 4M16 27l-1 4M20 41l0 -5M14 41l0 -5M20 41l0 5M14 41l0 5M22 53l-2 -5M16 56l-2 -5M22 54l3 4M16 57l3 4" stroke="#ff8fb0" stroke-width="3"/>`,
    ) +
    `<path d="M62 80C76 90 92 84 94 72C84 76 74 74 66 70Z" fill="#ffc9d6"/>` +
    `<ellipse cx="30" cy="76" rx="5" ry="7" fill="#ffb8c6" transform="rotate(30 30 76)"/><ellipse cx="70" cy="76" rx="5" ry="7" fill="#ffb8c6" transform="rotate(-30 70 76)"/>` +
    `<ellipse cx="50" cy="72" rx="18" ry="14" fill="#ffb8c6"/>` +
    `<ellipse cx="50" cy="42" rx="25" ry="19" fill="#ffb8c6"/>` +
    dot(37, 38, 3.2) +
    dot(63, 38, 3.2) +
    `<path d="M36 48q14 9 28 0" stroke-width="3"/>` +
    cheeks(48, 20),

  광어:
    // 위에서 본 넓적한 몸 + 두 눈이 한쪽에 몰림 + 가장자리 지느러미
    `<path d="M80 52L96 36L94 68Z" fill="#d9b88a"/>` +
    `<ellipse cx="46" cy="52" rx="40" ry="29" fill="#d9b88a"/>` +
    `<path d="${finRays}" stroke="#b8905e" stroke-width="2.2"/>` +
    `<ellipse cx="46" cy="52" rx="32" ry="21" fill="#9a7a5a"/>` +
    `<g fill="#6b4a36" stroke="none"><circle cx="50" cy="44" r="4"/><circle cx="62" cy="56" r="3.5"/><circle cx="44" cy="62" r="3.5"/><circle cx="68" cy="44" r="3"/><circle cx="34" cy="50" r="2.5"/></g>` +
    eye(22, 46, 5, 2.8) +
    eye(32, 38, 5, 2.8) +
    `<path d="M14 56q4 3 8 1" stroke-width="2.5"/>`,

  송사리:
    // 개울 속 작은 물고기 떼
    `<path d="M4 14q8-5 15 0t15 0t15 0t15 0t15 0t15 0" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M14 94C12 84 16 78 12 70M20 94C22 86 18 80 22 74M86 94C84 86 88 80 84 72" stroke="#43b04a" stroke-width="4"/>` +
    minnow(32, 32, 1.3) +
    minnow(70, 40, 1.3) +
    minnow(42, 62, 1.3) +
    minnow(74, 74, 1.1) +
    `<circle cx="60" cy="22" r="2.5" fill="#dff3ff" stroke-width="2"/><circle cx="88" cy="28" r="2" fill="#dff3ff" stroke-width="2"/>`,

  꼴뚜기:
    // 작은 오징어: 세모 지느러미, 짧은 다리, 점무늬
    `<path d="M42 70C40 80 38 86 34 90M46 72C46 82 44 88 42 92M50 72V92M54 72C54 82 56 88 58 92M58 70C60 80 62 86 66 90" stroke="#e88a6a" stroke-width="5"/>` +
    `<path d="M40 68C34 76 28 84 24 94M60 68C66 76 72 84 76 94" stroke="#e88a6a" stroke-width="3.5"/>` +
    `<path d="M44 22L26 38L42 42Z" fill="#e88a6a"/><path d="M56 22L74 38L58 42Z" fill="#e88a6a"/>` +
    `<path d="M50 8C62 20 64 40 62 58H38C36 40 38 20 50 8Z" fill="#f2a07a"/>` +
    `<g fill="#c9563f" stroke="none"><circle cx="46" cy="28" r="2"/><circle cx="54" cy="36" r="2.2"/><circle cx="46" cy="44" r="2"/><circle cx="55" cy="50" r="1.8"/><circle cx="50" cy="20" r="1.8"/></g>` +
    `<ellipse cx="50" cy="64" rx="14" ry="9" fill="#f2a07a"/>` +
    eye(43, 63, 4.5, 2.6) +
    eye(57, 63, 4.5, 2.6),

  천산갑:
    // 솔방울 같은 비늘로 덮인 몸 + 긴 꼬리 + 뾰족한 작은 머리
    `<path d="M26 52C10 56 4 72 12 86C16 90 24 88 22 82C18 74 22 66 32 64Z" fill="#c08a55"/>` +
    `<path d="M14 80q3 -4 6 0M12 72q3 -4 6 0M16 64q3 -4 6 0" stroke="#7a5236" stroke-width="2.5"/>` +
    legs([28, 38, 60, 68], 62, 7, 16, '#a0653a') +
    `<path d="M20 68C20 46 36 34 54 36C68 38 76 48 78 58L78 68Z" fill="#c08a55"/>` +
    `<path d="M24 64q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0M28 55q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0M34 46q4-6 8 0q4-6 8 0q4-6 8 0q4-6 8 0M44 39q4-5 8 0q4-5 8 0" stroke="#7a5236" stroke-width="2.5"/>` +
    `<path d="M72 50C80 48 90 54 95 62C90 67 80 66 72 64Z" fill="#e8c49a"/>` +
    dot(80, 55, 2.4) +
    `<path d="M28 78l-2 3M31 78l0 3M60 78l-2 3M63 78l0 3" stroke-width="2"/>`,

  오카피:
    // 초콜릿색 몸, 기린 같은 머리, 엉덩이·다리의 흰 줄무늬
    `<path d="M20 44C14 50 14 56 16 62" stroke-width="3"/>` +
    legs([26, 36, 58, 68], 56, 8, 30, '#fff', '#3d3530') +
    `<path d="M26 64h8M26 70h8M26 76h8M36 64h8M36 70h8M36 76h8M58 72h8M68 72h8" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="18" y="38" width="58" height="26" rx="12" fill="#5a3b24"/>` +
    `<path d="M22 40C20 46 19 54 22 62H36V40Z" fill="#fff" stroke="none"/>` +
    `<path d="M21 46H36M20 52H36M21 58H36" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M62 44L70 18L82 22L76 52Z" fill="#5a3b24"/>` +
    `<path d="M71 14L70 8M76 14L77 8" stroke-width="3"/>` +
    `<ellipse cx="68" cy="13" rx="7" ry="4" fill="#5a3b24" transform="rotate(-30 68 13)"/>` +
    `<ellipse cx="82" cy="21" rx="12" ry="8" fill="#e8c49a" transform="rotate(15 82 21)"/>` +
    dot(91, 25, 2.2) +
    dot(79, 18, 2.6),

  맥:
    // 앞쪽·다리는 검고 등·엉덩이는 흰 몸, 아래로 늘어진 짧은 코
    legs([22, 32, 56, 66], 58, 9, 28, '#3d3d4a') +
    `<rect x="14" y="36" width="66" height="30" rx="15" fill="#3d3d4a"/>` +
    `<path d="M48 36H29C20 36 14 43 14 51C14 59 20 66 29 66H48C50 56 50 46 48 36Z" fill="#fff"/>` +
    `<circle cx="74" cy="31" r="5.5" fill="#fff"/><circle cx="74" cy="31" r="3" fill="#3d3d4a" stroke="none"/>` +
    `<ellipse cx="80" cy="44" rx="12" ry="11" fill="#3d3d4a"/>` +
    `<path d="M88 40C96 44 97 56 93 62C90 60 89 55 86 52Z" fill="#3d3d4a"/>` +
    darkEye(81, 41, 2.2),

  말레이곰:
    // 작은 검은 곰, 가슴의 큰 주황 반달 무늬, 밝은 주둥이
    `<rect x="32" y="74" width="13" height="18" rx="5" fill="#3d3d4a"/><rect x="55" y="74" width="13" height="18" rx="5" fill="#3d3d4a"/>` +
    tube('M30 58C20 54 14 46 16 38', '#3d3d4a', 9) +
    tube('M70 58C80 54 86 46 84 38', '#3d3d4a', 9) +
    `<ellipse cx="50" cy="64" rx="24" ry="22" fill="#3d3d4a"/>` +
    `<path d="M32 50C35 70 65 70 68 50C60 60 40 60 32 50Z" fill="#ffb347"/>` +
    `<circle cx="35" cy="15" r="6" fill="#3d3d4a"/><circle cx="65" cy="15" r="6" fill="#3d3d4a"/>` +
    `<circle cx="50" cy="30" r="18" fill="#3d3d4a"/>` +
    `<ellipse cx="50" cy="37" rx="10" ry="8" fill="#e8b77a"/>` +
    `<ellipse cx="50" cy="34" rx="4" ry="3" fill="${INK}"/>` +
    `<path d="M46 41q4 3 8 0" stroke-width="2.5"/>` +
    darkEye(42, 25, 2.2) +
    darkEye(58, 25, 2.2),

  흑곰:
    // 네 발로 걷는 까만 곰
    legs([22, 34, 56, 66], 58, 11, 28, '#33333f') +
    `<path d="M16 60C14 44 28 36 46 36C62 36 72 42 74 52L72 68H20C17 66 16 63 16 60Z" fill="#33333f"/>` +
    `<circle cx="72" cy="33" r="5.5" fill="#33333f"/>` +
    `<circle cx="78" cy="46" r="13" fill="#33333f"/>` +
    `<ellipse cx="88" cy="50" rx="8" ry="6.5" fill="#c9a27a"/>` +
    `<ellipse cx="93" cy="48" rx="3" ry="2.5" fill="${INK}"/>` +
    darkEye(79, 42, 2.4) +
    `<path d="M14 50l-4 -2" stroke-width="4"/>`,

  회색곰:
    // 어깨가 불룩 솟은 큰 곰, 등 털끝이 희끗
    legs([20, 32, 56, 66], 60, 12, 26, '#8a6a52') +
    `<path d="M29 86h4M60 86h4M70 86h4" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M12 62C10 46 22 38 38 38C46 38 52 28 62 28C72 28 76 38 76 50L74 70H16C13 68 12 65 12 62Z" fill="#8a6a52"/>` +
    `<path d="M36 40C46 40 52 30 62 30C69 30 73 35 74 42C66 38 58 40 52 45C46 42 40 42 36 40Z" fill="#cdb49a" stroke="none"/>` +
    `<circle cx="74" cy="42" r="5.5" fill="#8a6a52"/>` +
    `<circle cx="80" cy="54" r="13" fill="#8a6a52"/>` +
    `<ellipse cx="89" cy="58" rx="8" ry="6.5" fill="#cdb49a"/>` +
    `<ellipse cx="94" cy="56" rx="3" ry="2.5" fill="${INK}"/>` +
    dot(81, 50, 2.6),

  북극토끼:
    // 눈밭의 하얀 토끼, 귀 끝만 검다
    `<path d="M4 84C20 76 80 76 96 84V94H4Z" fill="#dfe8f5"/>` +
    flake(14, 20) +
    flake(86, 18) +
    flake(88, 50, 3) +
    flake(12, 56, 3) +
    `<path d="M36 36C30 24 32 8 40 6C47 8 46 24 44 36Z" fill="#fff"/>` +
    `<path d="M33.5 16C33 10 36 6 40 6C44 6 46 10 45.5 16C42 14 37 14 33.5 16Z" fill="${INK}"/>` +
    `<path d="M64 36C70 24 68 8 60 6C53 8 54 24 56 36Z" fill="#fff"/>` +
    `<path d="M66.5 16C67 10 64 6 60 6C56 6 54 10 54.5 16C58 14 63 14 66.5 16Z" fill="${INK}"/>` +
    `<ellipse cx="50" cy="68" rx="24" ry="18" fill="#fff"/>` +
    `<circle cx="50" cy="46" r="17" fill="#fff"/>` +
    dot(43, 44) +
    dot(57, 44) +
    `<path d="M47 51h6l-3 3z" fill="#ff7a9c" stroke-width="2"/>` +
    cheeks(53, 12) +
    `<ellipse cx="40" cy="84" rx="7" ry="4" fill="#fff"/><ellipse cx="60" cy="84" rx="7" ry="4" fill="#fff"/>`,

  산토끼:
    // 들판을 뛰는 갈색 토끼 (긴 뒷다리, 뒤로 누운 긴 귀)
    `<path d="M4 90C30 80 70 80 96 90V96H4Z" fill="#8fce6a"/>` +
    `<path d="M6 60h10M4 68h8" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M30 64C20 70 12 74 8 80L20 82C26 78 32 74 38 70Z" fill="#a0764a"/>` +
    tube('M62 64L78 74', '#a0764a', 6) +
    `<ellipse cx="44" cy="56" rx="23" ry="14" fill="#a0764a" transform="rotate(-12 44 56)"/>` +
    `<circle cx="22" cy="52" r="5.5" fill="#fff"/>` +
    `<path d="M62 36C54 26 50 14 52 8C58 10 64 22 68 34Z" fill="#a0764a"/>` +
    `<path d="M68 34C66 22 68 10 72 6C76 10 76 24 74 34Z" fill="#a0764a"/>` +
    `<path d="M71 12C73 10 74 14 73 18" stroke="#ffb3c4" stroke-width="2.5"/>` +
    `<ellipse cx="74" cy="42" rx="13" ry="10" fill="#a0764a"/>` +
    dot(77, 39, 2.8) +
    `<circle cx="86" cy="44" r="2.2" fill="#ff7a9c"/>` +
    `<path d="M50 66l4 2" stroke-width="2"/>`,

  집토끼:
    // 늘어진 귀, 얼룩 무늬 흰 토끼가 당근을 들고 있다
    `<ellipse cx="50" cy="72" rx="25" ry="19" fill="#fff"/>` +
    `<path d="M62 62C70 60 76 66 74 76C68 78 62 72 62 62Z" fill="#c98b4f" stroke="none"/>` +
    `<circle cx="50" cy="44" r="19" fill="#fff"/>` +
    `<path d="M54 30C64 28 70 36 68 46C62 48 54 42 54 30Z" fill="#c98b4f" stroke="none"/>` +
    `<ellipse cx="29" cy="48" rx="8" ry="17" fill="#c98b4f" transform="rotate(20 29 48)"/><ellipse cx="71" cy="48" rx="8" ry="17" fill="#c98b4f" transform="rotate(-20 71 48)"/>` +
    dot(43, 42) +
    dot(58, 42) +
    `<path d="M47 49h6l-3 3z" fill="#ff7a9c" stroke-width="2"/>` +
    `<path d="M50 52q-3 3-6 1M50 52q3 3 6 1" stroke-width="2.2"/>` +
        `<path d="M58 62C62 54 68 54 70 58M60 60C60 52 64 50 66 52" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M34 90L52 60C58 58 64 62 62 68Z" fill="#ff9f1a"/><path d="M44 78l4 2M50 70l3 2" stroke="#d9772a" stroke-width="2.5"/>` +
    `<ellipse cx="46" cy="70" rx="5" ry="4" fill="#fff"/><ellipse cx="60" cy="72" rx="5" ry="4" fill="#fff"/>` +
    `<ellipse cx="34" cy="90" rx="8" ry="4" fill="#fff"/><ellipse cx="66" cy="90" rx="8" ry="4" fill="#fff"/>`,

  코주부원숭이:
    // 입을 덮을 만큼 크게 늘어진 코
    `<path d="M14 96C14 76 30 68 50 68S86 76 86 96Z" fill="#e8a060"/>` +
    `<circle cx="22" cy="44" r="6" fill="#f5c9a0"/><circle cx="78" cy="44" r="6" fill="#f5c9a0"/>` +
    `<circle cx="50" cy="42" r="28" fill="#d98a4a"/>` +
    `<ellipse cx="50" cy="48" rx="19" ry="20" fill="#f5c9a0"/>` +
    `<path d="M40 18C44 12 56 12 60 18C56 16 44 16 40 18Z" fill="#b86a30"/>` +
    dot(42, 38, 2.8) +
    dot(58, 38, 2.8) +
    `<path d="M45 42C43 52 36 62 38 70C40 78 60 78 62 70C64 62 57 52 55 42Z" fill="#f08a6a"/>` +
    `<path d="M44 72q2 -3 4 0M52 72q2 -3 4 0" stroke-width="2"/>`,

  들쥐:
    // 풀밭에서 이삭을 든 갈색 쥐
    `<path d="M4 94C8 86 6 80 10 74M14 94C14 86 18 82 16 76M86 94C84 86 88 80 84 74M94 94C94 88 92 84 94 78" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M68 90C70 70 70 40 74 18" stroke="#d9a55a" stroke-width="3.5"/>` +
    `<g fill="#f2c14e"><ellipse cx="72" cy="22" rx="3.5" ry="6" transform="rotate(-20 72 22)"/><ellipse cx="78" cy="26" rx="3.5" ry="6" transform="rotate(30 78 26)"/><ellipse cx="70" cy="32" rx="3.5" ry="6" transform="rotate(-30 70 32)"/><ellipse cx="78" cy="36" rx="3.5" ry="6" transform="rotate(30 78 36)"/><ellipse cx="75" cy="14" rx="3" ry="5"/></g>` +
    tube('M24 76C10 78 6 66 12 58', '#e0a8a0', 2.5) +
    `<ellipse cx="46" cy="84" rx="6" ry="3.5" fill="#e0a8a0"/>` +
    `<circle cx="36" cy="40" r="10" fill="#a0764a"/><circle cx="36" cy="40" r="5" fill="#ffb3c4" stroke="none"/>` +
    `<path d="M22 72C20 56 30 46 44 46C56 46 62 54 62 64C62 76 54 82 42 82C30 82 23 78 22 72Z" fill="#a0764a"/>` +
    `<ellipse cx="46" cy="68" rx="10" ry="11" fill="#e8c49a" stroke="none"/>` +
    `<circle cx="52" cy="40" r="12" fill="#a0764a"/>` +
    `<circle cx="46" cy="30" r="7" fill="#a0764a"/><circle cx="46" cy="30" r="3.5" fill="#ffb3c4" stroke="none"/>` +
    dot(55, 38, 2.8) +
    `<circle cx="63" cy="42" r="2.6" fill="#ff7a9c"/>` +
    tube('M54 58C60 54 64 50 68 50', '#a0764a', 4),

  생쥐:
    // 치즈 조각 옆의 작은 흰 쥐
    `<path d="M56 88L90 70L90 88Z" fill="#ffd23f"/><path d="M56 70L90 60L90 70L56 88Z" fill="#ffe680"/>` +
    `<circle cx="70" cy="80" r="3" fill="#f2b82e" stroke="none"/><circle cx="82" cy="76" r="2.5" fill="#f2b82e" stroke="none"/>` +
    tube('M20 80C8 80 6 68 12 62', '#ffb3c4', 2.5) +
    `<ellipse cx="28" cy="87" rx="5" ry="3" fill="#ffb3c4"/><ellipse cx="46" cy="87" rx="5" ry="3" fill="#ffb3c4"/>` +
    `<circle cx="40" cy="50" r="10" fill="#eceef4"/><circle cx="40" cy="50" r="5.5" fill="#ffb3c4" stroke="none"/>` +
    `<path d="M16 76C16 62 28 54 40 56C52 58 58 68 56 78C55 86 22 86 18 84C16 82 16 79 16 76Z" fill="#eceef4"/>` +
    `<circle cx="54" cy="56" r="11" fill="#eceef4"/>` +
    `<circle cx="50" cy="46" r="8" fill="#eceef4"/><circle cx="50" cy="46" r="4" fill="#ffb3c4" stroke="none"/>` +
    dot(57, 54, 2.8) +
    `<circle cx="65" cy="58" r="2.6" fill="#ff7a9c"/>` +
    `<path d="M62 62L72 64M62 60L72 58" stroke-width="1.8"/>`,

  가시두더지:
    // 가시 덮인 둥근 몸 + 가늘고 긴 부리 같은 코
    tube('M72 64C82 66 90 70 96 74', '#6b4a36', 5) +
    `<rect x="26" y="70" width="10" height="12" rx="4" fill="#6b4a36"/><rect x="58" y="70" width="10" height="12" rx="4" fill="#6b4a36"/>` +
    `<path d="M24 82l-2 3M28 82l0 3M60 82l-2 3M64 82l0 3" stroke-width="2"/>` +
    `<ellipse cx="46" cy="66" rx="30" ry="16" fill="#6b4a36"/>` +
    `<path d="${spikes(44, 68, 22, 34, 170, 350, 10)}" fill="#f2e3c8"/>` +
    `<ellipse cx="68" cy="64" rx="9" ry="8" fill="#6b4a36"/>` +
    darkEye(70, 61, 2),

  들개: dog({
    c: '#c9a36a',
    ear: 'round',
    earC: '#3d3530',
    snout: '#3d3530',
    tail: tube('M18 48C10 50 8 58 8 66', '#3d3530', 4) + `<circle cx="8" cy="68" r="4" fill="#fff"/>`,
    legC: '#c9a36a',
    marks:
      `<g stroke="none"><path d="M24 44C30 42 34 48 30 54C26 56 20 52 24 44Z" fill="#3d3530"/><path d="M40 50C46 46 52 50 50 58C44 62 38 58 40 50Z" fill="#fff"/>` +
      `<path d="M52 42C58 42 60 46 56 50C52 50 50 46 52 42Z" fill="#3d3530"/><path d="M32 56C36 56 38 60 34 62C30 62 30 58 32 56Z" fill="#fff"/><path d="M58 54C62 52 64 58 60 60Z" fill="#3d3530"/></g>` +
      `<path d="M26 72h6M36 78h6M52 74h6M62 70h6" stroke="#3d3530" stroke-width="3"/>`,
  }),

  승냥이: dog({
    c: '#d9763a',
    ear: 'round',
    earC: '#d9763a',
    snout: '#f2c49a',
    tail: `<path d="M20 46C8 48 4 60 6 72C8 76 14 76 16 70C18 62 20 56 24 52Z" fill="#3d3530"/>`,
    marks: `<path d="M26 60C36 64 52 64 62 60" stroke="#f5e6cc" stroke-width="4"/>`,
  }),

  눈표범:
    // 눈밭 바위 위의 연회색 표범, 둥근 고리 무늬, 굵고 긴 꼬리
    `<path d="M4 86C10 76 30 74 50 76C70 74 90 78 96 88V96H4Z" fill="#dfe8f5"/>` +
    flake(86, 14, 3.5) +
    flake(50, 10, 3) +
    tube('M22 54C8 54 4 36 12 26C18 18 28 20 28 28', '#e6e9ee', 9) +
    `<g fill="none" stroke="#5a6070" stroke-width="2.5"><circle cx="10" cy="40" r="3"/><circle cx="14" cy="27" r="3"/></g>` +
    legs([26, 36, 58, 68], 56, 9, 24, '#e6e9ee') +
    `<rect x="20" y="38" width="58" height="26" rx="13" fill="#e6e9ee"/>` +
    `<g fill="none" stroke="#5a6070" stroke-width="2.5"><circle cx="30" cy="48" r="3.5"/><circle cx="42" cy="54" r="3.5"/><circle cx="46" cy="44" r="3.5"/><circle cx="58" cy="52" r="3.5"/><circle cx="64" cy="44" r="3"/><circle cx="32" cy="58" r="2.5"/></g>` +
    `<circle cx="74" cy="27" r="5" fill="#e6e9ee"/>` +
    `<circle cx="80" cy="38" r="12" fill="#e6e9ee"/>` +
    `<ellipse cx="86" cy="44" rx="7" ry="5.5" fill="#fff"/>` +
    `<path d="M85 41L90 40L88 43Z" fill="#e87a8a" stroke-width="2"/>` +
    `<circle cx="82" cy="34" r="3" fill="#a8d08a" stroke-width="2"/>` +
    dot(82, 34.3, 1.5) +
    dot(74, 40, 1.8, '#5a6070') +
    dot(78, 29, 1.6, '#5a6070'),

  흰호랑이:
    // 흰 털에 검은 줄무늬, 파란 눈
    `<circle cx="26" cy="30" r="11" fill="#f7f5f0"/><circle cx="74" cy="30" r="11" fill="#f7f5f0"/>` +
    dot(26, 30, 5, '#ffc6d3') +
    dot(74, 30, 5, '#ffc6d3') +
    `<circle cx="50" cy="56" r="31" fill="#f7f5f0"/>` +
    `<path d="M50 26V36M40 28L43 36M60 28L57 36M19 50h9M20 60h8M81 50h-9M80 60h-8M36 40l4 4M64 40l-4 4" stroke-width="4.5"/>` +
    `<ellipse cx="50" cy="70" rx="17" ry="12" fill="#fff"/>` +
    `<circle cx="39" cy="50" r="5" fill="#6ec0f5" stroke-width="2.5"/><circle cx="61" cy="50" r="5" fill="#6ec0f5" stroke-width="2.5"/>` +
    dot(39, 50.5, 2.4) +
    dot(61, 50.5, 2.4) +
    `<path d="M45 62h10l-5 5z" fill="#ff9aa8"/><path d="M50 67v3M43 72q7 5 14 0"/>`,

  아기코끼리:
    // 엄마 코끼리 옆의 작은 아기 (엄마 코가 아기 등을 쓰다듬는다)
    `<path d="M6 36l-3 10" stroke-width="3"/>` +
    legs([8, 19, 34, 44], 48, 10, 38, '#9fb0c8') +
    `<ellipse cx="28" cy="38" rx="25" ry="20" fill="#9fb0c8"/>` +
    `<circle cx="52" cy="28" r="14" fill="#9fb0c8"/>` +
    `<ellipse cx="45" cy="30" rx="9" ry="13" fill="#8497b4"/>` +
    tube('M61 32C70 38 72 48 68 56', '#9fb0c8', 7) +
    dot(56, 24, 2.6) +
    legs([60, 68, 78, 86], 76, 7, 14, '#c4d0e2') +
    `<ellipse cx="73" cy="71" rx="17" ry="12" fill="#c4d0e2"/>` +
    `<circle cx="85" cy="60" r="11" fill="#c4d0e2"/>` +
    `<ellipse cx="80" cy="61" rx="6.5" ry="8.5" fill="#aebed6"/>` +
    tube('M94 62C96 68 95 74 91 75', '#c4d0e2', 5) +
    dot(88, 57, 2.4) +
    `<circle cx="90" cy="64" r="3" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    sparkle(90, 42, 5) +
    sparkle(76, 48, 3.5),

  물소:
    // 물에 몸을 담근 짙은 회색 소, 뒤로 휘는 커다란 뿔
    `<ellipse cx="50" cy="72" rx="34" ry="18" fill="#5a6070"/>` +
    `<path d="M36 40C22 42 8 34 6 18C14 26 24 30 38 32Z" fill="#e0d6c4"/><path d="M64 40C78 42 92 34 94 18C86 26 76 30 62 32Z" fill="#e0d6c4"/>` +
    `<ellipse cx="30" cy="46" rx="8" ry="4" fill="#6a7080" transform="rotate(20 30 46)"/><ellipse cx="70" cy="46" rx="8" ry="4" fill="#6a7080" transform="rotate(-20 70 46)"/>` +
    `<path d="M34 42C34 30 42 28 50 28S66 30 66 42C66 58 60 70 50 70S34 58 34 42Z" fill="#6a7080"/>` +
    `<ellipse cx="50" cy="62" rx="11" ry="8" fill="#9aa2b2"/>` +
    dot(46, 62, 1.8) +
    dot(54, 62, 1.8) +
    darkEye(42, 45, 2.4) +
    darkEye(58, 45, 2.4) +
    `<path d="M4 78C14 74 22 80 32 76S50 80 60 76S78 80 88 76L96 78V96H4Z" fill="#7ec8f0"/>` +
    `<path d="M14 86q6 -3 12 0M60 88q6 -3 12 0" stroke="#fff" stroke-width="2.5"/>`,

  야크:
    // 땅에 닿을 듯 긴 털, 위로 휜 뿔
    tube('M16 48C8 52 8 62 10 70', '#4a3a30', 4) +
    `<path d="M10 70l-3 6h8z" fill="#4a3a30"/>` +
    `<rect x="24" y="80" width="8" height="10" rx="2" fill="#2e2620"/><rect x="36" y="80" width="8" height="10" rx="2" fill="#2e2620"/><rect x="58" y="80" width="8" height="10" rx="2" fill="#2e2620"/><rect x="68" y="80" width="8" height="10" rx="2" fill="#2e2620"/>` +
    `<path d="M14 52C14 38 26 34 40 36C48 26 62 28 68 36L76 44L78 72L74 84L68 78L62 86L56 78L50 86L44 78L38 86L32 78L26 86L20 78L14 70Z" fill="#5a4636"/>` +
    `<path d="M24 50V70M34 46V74M46 44V74M58 42V74M68 46V72" stroke="#7a6452" stroke-width="2.5"/>` +
    `<path d="M76 42C70 36 70 26 76 22C76 30 80 36 84 40Z" fill="#efe6d6"/><path d="M88 42C96 36 96 26 90 22C90 30 88 36 84 40Z" fill="#efe6d6"/>` +
    `<ellipse cx="82" cy="54" rx="12" ry="13" fill="#5a4636"/>` +
    `<path d="M72 46C76 40 88 40 92 46C88 48 76 48 72 46Z" fill="#3d3028"/>` +
    `<ellipse cx="84" cy="62" rx="8" ry="5.5" fill="#8a7462"/>` +
    darkEye(78, 52, 2.2) +
    darkEye(88, 52, 2.2),

  가젤:
    // 날씬한 황갈색 몸, 옆구리 검은 띠, 흰 배, 고리 무늬 긴 뿔
    `<path d="M22 44l-5 -3" stroke-width="4"/>` +
    legs([28, 36, 58, 66], 52, 5, 34, '#d9a55a', '#3d3530') +
    `<ellipse cx="46" cy="48" rx="26" ry="12" fill="#d9a55a"/>` +
    `<path d="M24 52C32 60 60 60 70 52C66 58 56 60 46 60C36 60 28 58 24 52Z" fill="#fff"/>` +
    `<path d="M24 50C34 54 58 54 70 50" stroke="#5a3b24" stroke-width="4"/>` +
    `<path d="M60 44L70 22L80 24L72 50Z" fill="#d9a55a"/>` +
    tube('M72 20C64 16 62 10 64 5', '#5a3b24', 2.5) +
    tube('M77 20C70 15 70 9 72 5', '#5a3b24', 2.5) +
    `<ellipse cx="68" cy="22" rx="6" ry="3" fill="#d9a55a" transform="rotate(-25 68 22)"/>` +
    `<ellipse cx="81" cy="26" rx="10" ry="6.5" fill="#d9a55a" transform="rotate(20 81 26)"/>` +
    `<path d="M78 24L88 32" stroke="#fff" stroke-width="2.5"/>` +
    dot(89, 31, 2) +
    dot(79, 23, 2.4),

  누:
    // 앞이 높고 뒤가 낮은 회색 소, 목의 검은 갈기와 턱수염, 옆으로 휜 뿔
    tube('M18 50C10 56 10 66 12 72', '#3d4050', 2.5) +
    `<path d="M12 72l-3 8h7z" fill="#2e3140"/>` +
    legs([24, 33, 58, 67], 58, 7, 28, '#5a6070', '#2e3140') +
    `<path d="M16 58C14 48 20 44 30 44C44 42 56 34 68 34L76 60C62 68 30 68 20 66C17 64 16 62 16 58Z" fill="#7a8494"/>` +
    `<path d="M50 42L52 60M58 38L60 60M66 36L68 58" stroke="#5a6070" stroke-width="3"/>` +
    `<path d="M68 48L64 66L72 62L74 52Z" fill="#2e3140"/>` +
    `<path d="M60 34L66 26L68 32L72 24L74 30L78 24L78 32Z" fill="#2e3140"/>` +
    `<path d="M70 30C74 24 82 22 86 26L95 50C96 56 88 58 86 52L76 42Z" fill="#4a5060"/>` +
    tube('M78 26C70 24 68 16 74 12', '#e0d6c4', 3) +
    tube('M86 24C92 22 94 14 90 10', '#e0d6c4', 3) +
    darkEye(82, 32, 2.2) +
    dot(93, 52, 1.8, '#fff'),

  고라니:
    // 뿔 없는 작은 사슴, 큰 둥근 귀, 입가의 작은 송곳니 두 개
    `<ellipse cx="24" cy="32" rx="13" ry="9" fill="#c9a070" transform="rotate(-25 24 32)"/><ellipse cx="76" cy="32" rx="13" ry="9" fill="#c9a070" transform="rotate(25 76 32)"/>` +
    `<ellipse cx="24" cy="32" rx="7" ry="4.5" fill="#f2dcc0" stroke="none" transform="rotate(-25 24 32)"/><ellipse cx="76" cy="32" rx="7" ry="4.5" fill="#f2dcc0" stroke="none" transform="rotate(25 76 32)"/>` +
    `<path d="M30 38C30 26 40 22 50 22S70 26 70 38C70 56 60 78 50 80C40 78 30 56 30 38Z" fill="#c9a070"/>` +
    `<path d="M40 62C44 58 56 58 60 62C60 72 56 78 50 79C44 78 40 72 40 62Z" fill="#f2e3c8" stroke="none"/>` +
    dot(41, 46, 3.5) +
    dot(59, 46, 3.5) +
    dot(42.2, 44.6, 1.2, '#fff') +
    dot(60.2, 44.6, 1.2, '#fff') +
    `<ellipse cx="50" cy="70" rx="6" ry="4.5" fill="${INK}"/>` +
    `<path d="M44 76L43 88L48 78Z" fill="#fff" stroke-width="2.2"/><path d="M56 76L57 88L52 78Z" fill="#fff" stroke-width="2.2"/>`,

  노루: deer(
    '#b08a60',
    '',
    `<path d="M72 18L70 4M71 10L65 7M76 18L80 5M79 11L84 9" stroke="#6b4a36" stroke-width="3.5"/>`,
    `<ellipse cx="24" cy="48" rx="7" ry="9" fill="#fff"/>`,
  ),

  꽃사슴: deer(
    '#b0703a',
    `<g fill="#fff" stroke="none"><circle cx="30" cy="46" r="2.6"/><circle cx="38" cy="42" r="2.6"/><circle cx="46" cy="44" r="2.6"/><circle cx="54" cy="42" r="2.6"/><circle cx="34" cy="52" r="2.4"/><circle cx="42" cy="50" r="2.4"/><circle cx="50" cy="50" r="2.4"/><circle cx="58" cy="48" r="2.4"/><circle cx="62" cy="44" r="2.2"/></g>`,
    `<path d="M70 18C66 12 64 8 62 4M66 11L58 10M74 18C78 10 82 8 86 4M80 10L88 12M83 7L82 2" stroke="#6b4a36" stroke-width="3.5"/>`,
  ),

  단봉낙타:
    // 혹이 하나
    `<path d="M16 54C10 58 10 64 12 68"/>` +
    legs([24, 33, 56, 64], 60, 7, 28, '#e0b870') +
    `<path d="M16 62C14 50 20 44 28 44C32 26 54 24 58 42C66 42 72 50 72 58C72 64 66 66 60 66H24C18 66 16 64 16 62Z" fill="#e0b870"/>` +
    `<path d="M64 52C72 50 74 40 74 30L86 28L84 38C82 50 78 60 68 64Z" fill="#e0b870"/>` +
    `<path d="M74 22L76 16L80 22Z" fill="#e0b870"/>` +
    `<ellipse cx="84" cy="28" rx="11" ry="7.5" fill="#e0b870"/>` +
    dot(82, 25, 2.8) +
    dot(93, 27, 1.6) +
    `<path d="M86 32q4 2 7 0" stroke-width="2.5"/>`,

  쌍봉낙타:
    // 혹이 둘, 혹과 목에 복슬한 털
    `<path d="M16 54C10 58 10 64 12 68"/>` +
    legs([24, 33, 56, 64], 60, 7, 28, '#a0764a') +
    `<path d="M16 62C14 50 18 44 24 44C24 24 40 24 40 42C42 24 58 24 58 44C66 42 72 50 72 58C72 64 66 66 60 66H24C18 66 16 64 16 62Z" fill="#a0764a"/>` +
    blob('#7a5236', [
      [30, 30, 5],
      [34, 29, 5],
      [48, 30, 5],
      [52, 29, 5],
    ]) +
    `<path d="M64 52C72 50 74 40 74 30L86 28L84 38C82 50 78 60 68 64Z" fill="#a0764a"/>` +
    `<path d="M66 60C62 56 64 50 70 50C72 54 72 58 66 60Z" fill="#7a5236"/>` +
    `<path d="M74 22L76 16L80 22Z" fill="#a0764a"/>` +
    `<ellipse cx="84" cy="28" rx="11" ry="7.5" fill="#a0764a"/>` +
    dot(82, 25, 2.8) +
    dot(93, 27, 1.6) +
    `<path d="M86 32q4 2 7 0" stroke-width="2.5"/>`,

  라마:
    // 긴 목, 바나나 모양 귀, 복슬한 털, 등에 알록달록 담요
    `<path d="M20 50l-4 -4" stroke-width="4"/>` +
    legs([28, 37, 56, 64], 58, 7, 30, '#fff', '#8a7462') +
    blob('#fff', [
      [30, 52, 11],
      [44, 48, 12],
      [58, 50, 11],
      [66, 56, 9],
      [48, 60, 9],
      [30, 60, 8],
    ]) +
    `<rect x="36" y="38" width="22" height="12" rx="2" fill="#e8553d"/>` +
    `<path d="M36 44H58" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M38 52v4M47 52v4M56 52v4" stroke="#3b78e6" stroke-width="3"/>` +
    blob('#fff', [
      [68, 46, 7],
      [69, 36, 7],
      [70, 26, 7],
    ]) +
    `<path d="M66 16C62 10 62 4 64 4C68 6 70 10 70 16Z" fill="#fff"/><path d="M74 16C76 10 78 6 80 6C82 8 80 14 77 18Z" fill="#fff"/>` +
    `<ellipse cx="74" cy="20" rx="8" ry="7" fill="#fff"/>` +
    `<ellipse cx="82" cy="24" rx="7" ry="5" fill="#fff"/>` +
    dot(74, 19, 2.6) +
    dot(87, 23, 1.6),

  경주마:
    // 기수를 태우고 달리는 말 (쭉 뻗은 다리, 휘날리는 꼬리)
    `<path d="M4 50h8M6 60h8M4 70h6" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M24 54C14 50 8 54 6 62C12 60 16 60 22 62Z" fill="#3d2a1c"/>` +
    tube('M30 62L14 72L8 70', '#9a5b2e', 6) +
    tube('M34 64L30 82', '#9a5b2e', 6) +
    tube('M64 62L80 70L90 68', '#9a5b2e', 6) +
    tube('M60 64L66 82', '#9a5b2e', 6) +
    `<ellipse cx="46" cy="56" rx="26" ry="12" fill="#9a5b2e"/>` +
    `<path d="M62 50L70 32C72 26 80 24 84 28L94 38C96 42 92 46 88 44L80 40L72 58Z" fill="#9a5b2e"/>` +
    `<path d="M68 32L68 24L74 30Z" fill="#9a5b2e"/>` +
    `<path d="M66 36C62 42 60 48 58 54L64 52C66 46 68 42 72 38Z" fill="#3d2a1c"/>` +
    dot(80, 32, 2.6) +
    `<rect x="36" y="48" width="18" height="12" rx="2" fill="#fff"/>` +
    `<path d="M37 57H53" stroke="#3b78e6" stroke-width="3"/>` +
    tube('M44 46L52 52L50 58', '#fff', 5) +
    tube('M44 44L58 30', '#ffd23f', 9) +
    `<path d="M50 38L54 34L58 38L54 42Z" fill="#e8553d" stroke="none"/>` +
    tube('M56 34L66 40L74 36', '#ffd23f', 4) +
    `<circle cx="62" cy="24" r="6.5" fill="#ffd6ad"/>` +
    `<path d="M55 23C55 15 69 15 69 23Z" fill="#e8553d"/><path d="M66 22H72" stroke-width="3"/>`,

  백마:
    // 하얀 말, 은빛 갈기
    `<path d="M20 46C8 48 6 64 10 76C14 66 16 58 22 54Z" fill="#c8d2e4"/>` +
    legs([22, 31, 52, 61], 58, 8, 30, '#fff', '#9aa2b2') +
    `<ellipse cx="42" cy="52" rx="27" ry="15" fill="#fff"/>` +
    horseHead('#fff', '#c8d2e4') +
    `<circle cx="84" cy="36" r="3" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    sparkle(12, 24, 5) +
    sparkle(90, 58, 4),
};
