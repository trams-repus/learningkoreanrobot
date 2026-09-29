// 그림 묶음: 부엌·방 살림, 옷·장신구, 문구, 상상 속 동물·마법 물건, 기사 차림, 사무 기기, 길 위 시설, 차례상·돌잡이 (l3). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(드레스·웨딩드레스 / 머플러·넥워머 / 요술봉·마법봉 / 불사조·봉황 / 표지판·이정표·전광판 / 투구·갑옷·방패)는
// 색·실루엣·곁들인 소품을 다르게 했다.
import { INK, SKIN, HL, dot, blob, sparkle, tube, person, cheeks, stick, drop } from '../pictureKit.ts';

/** 별 (꼭짓점 다섯) */
const star = (cx: number, cy: number, R: number, fill: string, extra = '') => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.45 : R;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}"${extra}/>`;
};

/** 불꽃 (x, y는 불꽃 밑동 가운데) */
const flame = (x: number, y: number, s = 1) =>
  `<path d="M${x} ${y}c${-6 * s} 0 ${-8 * s} ${-6 * s} ${-5 * s} ${-11 * s}c${2 * s} ${-4 * s} ${5 * s} ${-6 * s} ${5 * s} ${-12 * s}c${3 * s} ${4 * s} ${8 * s} ${8 * s} ${6 * s} ${14 * s}c${-1 * s} ${5 * s} ${-3 * s} ${9 * s} ${-6 * s} ${9 * s}z" fill="#ff9f1a"/>` +
  `<path d="M${x} ${y - 2 * s}c${-3 * s} 0 ${-4 * s} ${-4 * s} ${-2 * s} ${-7 * s}l${2 * s} ${-4 * s}c${2 * s} ${3 * s} ${4 * s} ${6 * s} ${2 * s} ${9 * s}c${-1 * s} ${1 * s} ${-1 * s} ${2 * s} ${-2 * s} ${2 * s}z" fill="#ffd23f" stroke="none"/>`;

/** 작은 옆모습 자동차 (x, y 바퀴 밑 가운데) */
const car = (x: number, y: number, fill: string, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  `<path d="M-20 -6V-14Q-20 -18 -15 -18L-10 -26Q-8 -29 -4 -29H6Q10 -29 12 -26L16 -18Q20 -18 20 -14V-6Z" fill="${fill}"/>` +
  `<path d="M-7 -25H-1V-19H-11Z M3 -25H8L12 -19H3Z" fill="#bfe0ff" stroke-width="2"/>` +
  `<circle cx="-11" cy="-5" r="5" fill="${INK}"/><circle cx="11" cy="-5" r="5" fill="${INK}"/></g>`;

/** 둥근 과일 쌓기 (피라미드) */
const pile = (cx: number, base: number, r: number, fill: string, rows: number) => {
  let s = '';
  for (let row = 0; row < rows; row++) {
    const n = rows - row;
    for (let i = 0; i < n; i++) {
      const x = cx - ((n - 1) * r) + i * 2 * r;
      s += `<circle cx="${x}" cy="${base - r - row * r * 1.6}" r="${r}" fill="${fill}" stroke-width="2.5"/>`;
    }
  }
  return s;
};

/** 굽 높은 제기 접시 */
const dish = (cx: number, y: number, w: number) =>
  `<path d="M${cx - 4} ${y}L${cx - 6} ${y + 8}H${cx + 6}L${cx + 4} ${y}Z" fill="#c98b4f" stroke-width="2.5"/>` +
  `<rect x="${cx - w / 2}" y="${y - 3}" width="${w}" height="5" rx="2" fill="#c98b4f" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  밀방망이:
    `<ellipse cx="50" cy="70" rx="44" ry="17" fill="#fbe7b5"/>` +
    `<path d="M22 70q4-3 8 0M62 78q4-3 8 0M70 62q4-3 8 0" stroke="#e0c890" stroke-width="2.5"/>` +
    `<g transform="rotate(-16 50 50)">` +
    `<rect x="4" y="45" width="20" height="11" rx="5.5" fill="#9a5b2e"/><rect x="76" y="45" width="20" height="11" rx="5.5" fill="#9a5b2e"/>` +
    `<rect x="20" y="38" width="60" height="25" rx="12" fill="#e0a458"/>` +
    `<path d="M32 46H52M44 55H66" stroke="#c98b4f" stroke-width="3"/></g>`,
  감자칼:
    `<ellipse cx="32" cy="68" rx="25" ry="20" fill="#c98b4f"/>` +
    `<path d="M20 56C28 50 44 50 52 58C50 70 38 74 26 70C20 66 18 60 20 56Z" fill="#f5dc9a" stroke="none"/>` +
    dot(22, 76, 2, '#6b3e26') +
    dot(40, 80, 2, '#6b3e26') +
    `<path d="M52 58C60 50 58 42 50 44C44 46 48 54 56 50" stroke="#c98b4f" stroke-width="5"/>` +
    tube('M76 94L70 60', '#43b04a', 11) +
    tube('M70 60L54 34M70 60L90 38', '#8a96b0', 5) +
    `<path d="M52 34L92 38" stroke-width="12"/><path d="M52 34L92 38" stroke="#dfe8f5" stroke-width="6"/>` +
    `<path d="M60 35L84 37" stroke="#8a96b0" stroke-width="2"/>`,
  샹들리에:
    `<path d="M50 4V18" stroke-width="4"/><path d="M40 6H60" stroke-width="5"/>` +
    `<rect x="45" y="18" width="10" height="34" rx="4" fill="#f2c14e"/>` +
    tube('M50 56C36 68 16 64 14 46', '#f2c14e', 4) +
    tube('M50 56C64 68 84 64 86 46', '#f2c14e', 4) +
    tube('M50 50C42 58 32 56 32 42', '#f2c14e', 4) +
    tube('M50 50C58 58 68 56 68 42', '#f2c14e', 4) +
    `<path d="M34 54Q50 78 66 54Z" fill="#f2c14e"/>` +
    [
      [14, 46],
      [32, 42],
      [68, 42],
      [86, 46],
    ]
      .map(([x, y]) => `<rect x="${x - 3}" y="${y - 12}" width="6" height="12" fill="#fff" stroke-width="2.5"/><ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="#f2c14e" stroke-width="2.5"/>` + flame(x, y - 12, 0.55))
      .join('') +
    [
      [22, 72],
      [36, 76],
      [50, 88],
      [64, 76],
      [78, 72],
    ]
      .map(([x, y]) => `<path d="M${x} ${y - 10}V${y - 6}" stroke-width="2"/><path d="M${x} ${y - 6}L${x + 4} ${y}L${x} ${y + 6}L${x - 4} ${y}Z" fill="#bfe0ff" stroke-width="2.5"/>`)
      .join('') +
    sparkle(8, 70, 5) +
    sparkle(92, 70, 5),
  방석:
    `<path d="M4 86H96" stroke="#c9b48a" stroke-width="4"/>` +
    `<path d="M8 66H92V74Q50 80 8 74Z" fill="#b8352a"/>` +
    `<path d="M22 36Q50 33 78 36L92 66Q50 70 8 66Z" fill="#e8553d"/>` +
    `<path d="M31 42Q50 40 69 42L78 60Q50 63 22 60Z" fill="#ffd23f"/>` +
    `<path d="M50 44L62 51L50 58L38 51Z" fill="#3b8fe0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="51" r="3.5" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M22 36L14 32M78 36L86 32M8 67L2 70M92 67L98 70" stroke="#ffd23f" stroke-width="4"/>`,
  매트리스:
    `<path d="M26 28H92L78 52H8Z" fill="#fff"/>` +
    `<path d="M8 52H78V76H8Z" fill="#7ec8f0"/>` +
    `<path d="M78 52L92 28V52L78 76Z" fill="#4a90e2"/>` +
    `<path d="M8 52H78M8 76H78" stroke-width="5"/>` +
    [
      [30, 34],
      [50, 34],
      [70, 34],
      [24, 44],
      [44, 44],
      [64, 44],
    ]
      .map(([x, y]) => `<path d="M${x - 5} ${y}L${x} ${y - 3}L${x + 6} ${y}L${x} ${y + 3}Z" stroke="#9ac0e0" stroke-width="2"/>`)
      .join('') +
    `<path d="M14 64q6-5 12 0t12 0t12 0t12 0t12 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M12 76V84M74 76V84" stroke-width="5"/>`,
  해먹:
    `<rect x="7" y="20" width="9" height="74" rx="3" fill="#9a5b2e"/><rect x="84" y="20" width="9" height="74" rx="3" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [8, 16, 9],
      [18, 12, 8],
    ]) +
    blob('#43b04a', [
      [92, 16, 9],
      [82, 12, 8],
    ]) +
    `<path d="M16 38L26 52M16 38L30 50M84 38L74 52M84 38L70 50" stroke-width="2.5"/>` +
    `<path d="M24 50Q50 90 76 50Q50 68 24 50Z" fill="#ff9f1a"/>` +
    `<path d="M32 58Q50 78 68 58M40 64L44 72M50 66V76M60 64L56 72" stroke="#fff" stroke-width="3"/>` +
    `<path d="M4 94H96" stroke="#43b04a" stroke-width="5"/>`,
  흔들의자:
    `<path d="M10 80Q48 100 90 76" stroke-width="14"/><path d="M10 80Q48 100 90 76" stroke="#9a5b2e" stroke-width="7"/>` +
    tube('M28 86L32 60M70 84L68 60', '#9a5b2e', 6) +
    `<path d="M20 60L12 14Q20 8 30 12L36 60Z" fill="#c98b4f"/>` +
    `<path d="M19 22L30 20M21 34L32 32M22 46L34 44" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="20" y="54" width="58" height="10" rx="4" fill="#c98b4f"/>` +
    `<rect x="30" y="46" width="42" height="10" rx="5" fill="#e8553d"/>` +
    tube('M28 38H64L66 52', '#9a5b2e', 5) +
    `<path d="M6 60q-4 8 0 14M94 58q4 8 0 14" stroke="#9aa6c4" stroke-width="3"/>`,
  무드등:
    `<circle cx="50" cy="44" r="40" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    `<circle cx="50" cy="44" r="27" fill="#ffe27a"/>` +
    `<circle cx="42" cy="36" r="5" fill="#f2c14e" stroke="none"/><circle cx="58" cy="50" r="7" fill="#f2c14e" stroke="none"/><circle cx="46" cy="56" r="3.5" fill="#f2c14e" stroke="none"/>` +
    `<path d="M32 34Q34 26 40 22" stroke="#fff" stroke-width="4"/>` +
    `<path d="M38 70H62L68 84H32Z" fill="#c98b4f"/>` +
    `<path d="M68 80C80 80 84 88 94 88" stroke-width="3"/>` +
    sparkle(12, 18, 6) +
    sparkle(88, 16, 5) +
    sparkle(86, 64, 4),
  카펫:
    `<path d="M20 26H80L96 78H4Z" fill="#e8553d"/>` +
    `<path d="M26 32H74L86 72H14Z" fill="#ffd23f"/>` +
    `<path d="M31 37H69L79 67H21Z" fill="#b8352a"/>` +
    `<path d="M50 40L64 52L50 64L36 52Z" fill="#ffd23f"/>` +
    `<circle cx="50" cy="52" r="4" fill="#3b8fe0" stroke-width="2.5"/>` +
    `<path d="M30 46L34 50L30 54M70 46L66 50L70 54" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M8 78V86M16 78V86M24 78V86M32 78V86M40 78V86M48 78V86M56 78V86M64 78V86M72 78V86M80 78V86M88 78V86" stroke-width="3"/>` +
    `<path d="M24 26V20M34 26V20M44 26V20M54 26V20M64 26V20M74 26V20" stroke-width="3"/>`,
  발판:
    `<path d="M4 92H96" stroke="#c9b48a" stroke-width="4"/>` +
    `<path d="M70 44H98V92H70Z" fill="#dfe8f5"/><path d="M66 40H98V48H66Z" fill="#fff"/>` +
    tube('M84 40V30H74', '#8a96b0', 4) +
    drop(74, 36, 0.6) +
    `<path d="M16 70V90H26V82H56V90H66V70Z" fill="#2a6fc0"/>` +
    `<path d="M20 58H62L68 70H14Z" fill="#3b8fe0"/>` +
    `<path d="M14 70H68" stroke-width="4"/>` +
    stick(40, 18, 'M0 10V32M0 32L-6 44M0 32L6 44M0 16L14 20L26 20M0 16L-10 26', 1) +
    `<path d="M30 62H38M42 62H50" stroke-width="5"/>`,
  턱시도:
    `<path d="M16 94V42Q16 28 34 24L50 30L66 24Q84 28 84 42V94Z" fill="#2a2f4a"/>` +
    `<path d="M38 25L50 30L62 25L56 94H44Z" fill="#fff"/>` +
    `<path d="M34 24L50 66L40 30Z" fill="#454b6e"/><path d="M66 24L50 66L60 30Z" fill="#454b6e"/>` +
    `<path d="M50 34L38 27V41Z" fill="${INK}"/><path d="M50 34L62 27V41Z" fill="${INK}"/><circle cx="50" cy="34" r="3.5" fill="${INK}"/>` +
    dot(50, 50, 2.2) +
    dot(50, 76, 2.2, '#fff') +
    dot(50, 86, 2.2, '#fff') +
    `<path d="M62 50L74 48L73 55Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M16 62H24M76 62H84" stroke="#454b6e" stroke-width="3"/>`,
  드레스:
    `<path d="M38 8V18M62 8V18" stroke="#e85d9a" stroke-width="4"/>` +
    `<path d="M36 18Q50 26 64 18L62 44H38Z" fill="#ff5c70"/>` +
    `<path d="M38 44Q22 66 10 90Q50 100 90 90Q78 66 62 44Z" fill="#ff5c70"/>` +
    `<path d="M44 52Q36 70 30 90M56 52Q64 70 70 90M50 52V94" stroke="#e8455a" stroke-width="3"/>` +
    `<rect x="36" y="40" width="28" height="8" rx="3" fill="#ffd23f"/>` +
    `<path d="M50 44L40 36V52Z M50 44L60 36V52Z" fill="#ffd23f" stroke-width="2.5"/><circle cx="50" cy="44" r="3" fill="#ffd23f" stroke-width="2.5"/>` +
    sparkle(18, 30, 6) +
    sparkle(84, 32, 5),
  웨딩드레스:
    `<path d="M50 10C36 14 26 40 22 72C34 66 40 50 42 34Z" fill="#e7f2ff" opacity=".9"/>` +
    `<path d="M50 10C64 14 74 40 78 72C66 66 60 50 58 34Z" fill="#e7f2ff" opacity=".9"/>` +
    `<path d="M38 36Q50 42 62 36L60 56H40Z" fill="#fff"/>` +
    `<path d="M40 56Q22 74 10 94H90Q78 74 60 56Z" fill="#fff"/>` +
    `<path d="M14 90q6 5 12 0t12 0t12 0t12 0t12 0t12 0" stroke="#c7d6ec" stroke-width="3"/>` +
    `<path d="M44 36V30H56V36" fill="${SKIN}"/>` +
    `<circle cx="50" cy="20" r="11" fill="${SKIN}"/>` +
    `<path d="M39 20C38 10 44 7 50 7S62 10 61 20C57 14 43 14 39 20Z" fill="#6b3e26"/>` +
    `<path d="M42 10L45 4L50 8L55 4L58 10Z" fill="${HL}" stroke-width="2"/>` +
    dot(46, 21, 1.8) +
    dot(54, 21, 1.8) +
    `<path d="M47 25q3 2 6 0" stroke-width="2"/>` +
    blob('#ff9aa8', [
      [44, 58, 5],
      [52, 56, 5],
      [58, 60, 5],
      [48, 63, 5],
    ]) +
    dot(47, 58, 2, '#e85d9a') +
    dot(55, 59, 2, '#e85d9a') +
    `<path d="M48 67L46 76M54 66L56 76" stroke="#43b04a" stroke-width="3"/>`,
  머플러:
    `<path d="M24 96V76C24 62 36 56 50 56S76 62 76 76V96Z" fill="#3b78e6"/>` +
    `<circle cx="50" cy="30" r="17" fill="${SKIN}"/>` +
    `<path d="M33 28C32 14 42 10 50 10S68 14 67 28C62 20 56 18 50 18S38 20 33 28Z" fill="#5a3b24"/>` +
    dot(44, 31, 2.4) +
    dot(56, 31, 2.4) +
    `<path d="M46 38q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M30 50Q50 60 70 50L72 60Q50 70 28 60Z" fill="#e8553d"/>` +
    `<path d="M58 60L66 90H52L50 62Z" fill="#e8553d"/>` +
    `<path d="M54 70L64 70M55 78L65 78" stroke="#fff" stroke-width="4"/>` +
    `<path d="M53 90V96M57 90V97M61 90V96M65 90V96" stroke-width="2.5"/>` +
    `<path d="M40 54L42 64M60 54L58 64" stroke="#fff" stroke-width="4"/>`,
  넥워머:
    `<path d="M24 96V78C24 66 36 62 50 62S76 66 76 78V96Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="32" r="18" fill="${SKIN}"/>` +
    `<path d="M32 30C31 14 42 10 50 10S69 14 68 30C63 22 57 20 50 20S37 22 32 30Z" fill="#5a3b24"/>` +
    dot(44, 32, 2.4) +
    dot(56, 32, 2.4) +
    `<path d="M30 46Q50 52 70 46V70Q50 76 30 70Z" fill="#8e4fc9"/>` +
    `<ellipse cx="50" cy="46" rx="20" ry="5" fill="#a45cf0"/>` +
    `<path d="M36 52V70M43 53V72M50 54V73M57 53V72M64 52V70" stroke="#6b35a0" stroke-width="3"/>`,
  멜빵바지:
    `<path d="M32 36L24 6M68 36L76 6" stroke-width="13"/><path d="M32 36L24 6M68 36L76 6" stroke="#2a6fc0" stroke-width="6"/>` +
    `<path d="M30 30H70V50H78L76 94H54L50 70L46 94H24L22 50H30Z" fill="#4a90e2"/>` +
    `<rect x="40" y="36" width="20" height="12" rx="2" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<circle cx="34" cy="36" r="4" fill="${HL}" stroke-width="2.5"/><circle cx="66" cy="36" r="4" fill="${HL}" stroke-width="2.5"/>` +
    `<path d="M22 54H78" stroke="#2a6fc0" stroke-width="3"/>` +
    `<path d="M30 94V88M70 94V88" stroke="#fff" stroke-width="3"/>`,
  귀걸이:
    `<circle cx="18" cy="44" r="7" fill="${SKIN}"/><circle cx="82" cy="44" r="7" fill="${SKIN}"/>` +
    `<circle cx="50" cy="42" r="30" fill="${SKIN}"/>` +
    `<path d="M20 38C18 16 34 8 50 8S82 16 80 38C74 28 64 22 50 22S26 28 20 38Z" fill="#5a3b24"/>` +
    dot(40, 44) +
    dot(60, 44) +
    `<path d="M42 58q8 6 16 0" />` +
    cheeks(54, 18) +
    `<path d="M18 50V60M82 50V60" stroke="${HL}" stroke-width="3"/>` +
    `<circle cx="18" cy="62" r="3.5" fill="${HL}" stroke-width="2"/><circle cx="82" cy="62" r="3.5" fill="${HL}" stroke-width="2"/>` +
    `<path d="M18 66L27 78L18 94L9 78Z" fill="#3b8fe0"/><path d="M82 66L91 78L82 94L73 78Z" fill="#3b8fe0"/>` +
    `<path d="M14 76L18 72" stroke="#fff" stroke-width="2.5"/><path d="M78 76L82 72" stroke="#fff" stroke-width="2.5"/>` +
    sparkle(32, 86, 5) +
    sparkle(68, 86, 5),
  팔찌:
    `<path d="M36 98V56H64V98Z" fill="${SKIN}"/>` +
    `<path d="M34 58C30 42 32 20 40 16C42 10 48 10 50 14C52 8 58 8 60 14C66 14 70 22 68 40L66 58Z" fill="${SKIN}"/>` +
    `<path d="M34 44C26 40 20 30 24 26C28 24 32 30 36 34" fill="${SKIN}"/>` +
    `<path d="M44 18V30M52 16V30M60 18V30" stroke="#e0a080" stroke-width="2.5"/>` +
    [
      [34, 66, '#e8553d'],
      [41, 69, '#ff9f1a'],
      [48, 70, '#ffd23f'],
      [55, 70, '#43b04a'],
      [62, 69, '#3b8fe0'],
      [67, 66, '#8e4fc9'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M48 75L52 82L48 88L44 82Z" fill="${HL}" stroke-width="2.5"/>` +
    sparkle(80, 60, 6) +
    sparkle(20, 76, 5),
  풀:
    `<path d="M8 76L20 40L56 46L48 86Z" fill="#fff"/>` +
    `<path d="M20 58Q30 52 40 62" stroke="#dfe8f5" stroke-width="7"/>` +
    `<rect x="46" y="22" width="22" height="16" rx="6" fill="#fff"/>` +
    `<rect x="42" y="34" width="30" height="58" rx="5" fill="#ffd23f"/>` +
    `<rect x="42" y="50" width="30" height="20" fill="#3b8fe0"/>` +
    `<rect x="42" y="82" width="30" height="10" rx="3" fill="#e8a800"/>` +
    `<g transform="rotate(24 84 30)"><rect x="72" y="14" width="24" height="28" rx="5" fill="#ffd23f"/><path d="M72 22H96" stroke-width="2.5"/></g>`,
  자:
    `<g transform="rotate(-28 50 50)">` +
    `<rect x="2" y="37" width="96" height="26" rx="3" fill="#ffd23f"/>` +
    [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 94]
      .map((x, i) => `<path d="M${x} 37V${i % 2 ? 44 : 50}" stroke-width="2.5"/>`)
      .join('') +
    `</g>`,
  유니콘:
    `<path d="M58 96C56 76 52 64 44 58C34 52 22 60 14 52C8 46 12 36 20 32C30 26 40 20 52 20C68 20 80 34 80 54C80 72 82 84 86 96Z" fill="#fff"/>` +
    `<path d="M40 24L34 2L52 20Z" fill="${HL}"/><path d="M37 13L45 11M39 19L48 17" stroke="#e0a800" stroke-width="2.5"/>` +
    `<path d="M58 22L64 8L68 24Z" fill="#fff"/>` +
    blob('#ff5c70', [[70, 22, 8]]) +
    blob('#ff9f1a', [[80, 32, 8]]) +
    blob('#ffd23f', [[84, 46, 8]]) +
    blob('#43b04a', [[86, 60, 8]]) +
    blob('#3b8fe0', [[88, 74, 8]]) +
    blob('#a45cf0', [[90, 88, 7]]) +
    blob('#ff9aa8', [[56, 18, 6]]) +
    dot(42, 36, 3.5) +
    `<path d="M16 46q2 2 5 0" stroke-width="2.5"/>` +
    `<path d="M20 54q8 4 14-2" stroke-width="2.5"/>` +
    `<circle cx="30" cy="46" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    sparkle(12, 18, 6) +
    sparkle(24, 84, 5),
  불사조:
    `<path d="M44 52C30 52 10 42 6 16C16 24 20 20 20 10C26 22 30 20 32 12C38 26 44 34 48 44Z" fill="#e8553d"/>` +
    `<path d="M56 52C70 52 90 42 94 16C84 24 80 20 80 10C74 22 70 20 68 12C62 26 56 34 52 44Z" fill="#e8553d"/>` +
    `<path d="M42 46C32 44 22 36 18 26C26 32 32 30 34 26C36 34 40 38 44 40Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M58 46C68 44 78 36 82 26C74 32 68 30 66 26C64 34 60 38 56 40Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M42 66C36 78 28 84 22 96C36 90 42 94 50 84C58 94 64 90 78 96C72 84 64 78 58 66Z" fill="#e8553d"/>` +
    `<path d="M45 70C42 78 38 84 34 90C42 86 46 88 50 80C54 88 58 86 66 90C62 84 58 78 55 70Z" fill="#ffd23f" stroke="none"/>` +
    `<ellipse cx="50" cy="54" rx="12" ry="17" fill="#ff9f1a"/>` +
    `<path d="M45 24C42 14 48 10 50 3C53 11 58 14 55 24Z" fill="#ffd23f"/>` +
    `<circle cx="50" cy="32" r="10" fill="#ff9f1a"/>` +
    dot(46, 31, 2) +
    dot(54, 31, 2) +
    `<path d="M47 36L50 41L53 36Z" fill="${HL}" stroke-width="2"/>`,
  봉황:
    `<path d="M58 52C74 54 84 70 80 86C78 94 70 94 70 88C70 84 76 84 76 88" stroke="${INK}" stroke-width="11"/>` +
    `<path d="M58 52C74 54 84 70 80 86C78 94 70 94 70 88C70 84 76 84 76 88" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M56 50C76 44 92 52 94 66C95 74 88 76 86 70" stroke="${INK}" stroke-width="11"/>` +
    `<path d="M56 50C76 44 92 52 94 66C95 74 88 76 86 70" stroke="#3b8fe0" stroke-width="5"/>` +
    `<path d="M54 56C60 72 56 86 44 92C38 94 34 88 40 86" stroke="${INK}" stroke-width="11"/>` +
    `<path d="M54 56C60 72 56 86 44 92C38 94 34 88 40 86" stroke="#43b04a" stroke-width="5"/>` +
    `<circle cx="76" cy="88" r="5" fill="#ffd23f" stroke-width="2.5"/><circle cx="86" cy="70" r="5" fill="#ffd23f" stroke-width="2.5"/><circle cx="40" cy="86" r="5" fill="#ffd23f" stroke-width="2.5"/>` +
    `<ellipse cx="44" cy="50" rx="18" ry="11" fill="#ffd23f" transform="rotate(-20 44 50)"/>` +
    `<path d="M40 44C44 26 58 16 76 14C70 22 72 26 64 30C66 34 58 40 52 46Z" fill="#e8553d"/>` +
    `<path d="M48 40C54 32 60 28 66 26" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M32 44C28 36 24 32 24 26" stroke-width="10"/><path d="M32 44C28 36 24 32 24 26" stroke="#3b8fe0" stroke-width="5"/>` +
    `<circle cx="24" cy="24" r="8" fill="#3b8fe0"/>` +
    `<path d="M22 16C18 8 22 4 26 6M24 16C26 8 32 6 34 10" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M16 23L8 27L17 28Z" fill="${HL}" stroke-width="2"/>` +
    dot(23, 22, 2) +
    blob('#fff', [
      [14, 80, 7],
      [22, 76, 7],
      [28, 82, 6],
    ]),
  해태:
    `<path d="M24 94C22 70 30 58 50 58S78 70 76 94Z" fill="#f2c14e"/>` +
    `<path d="M40 70Q50 64 60 70L58 86Q50 90 42 86Z" fill="#ffe7a0" stroke-width="2.5"/>` +
    `<path d="M44 76q3 3 6 0t6 0M44 82q3 3 6 0t6 0" stroke="#e0a800" stroke-width="2"/>` +
    `<rect x="26" y="84" width="16" height="10" rx="5" fill="#f2c14e"/><rect x="58" y="84" width="16" height="10" rx="5" fill="#f2c14e"/>` +
    blob('#3a9e47', [
      [26, 22, 9],
      [22, 36, 9],
      [24, 50, 9],
      [74, 22, 9],
      [78, 36, 9],
      [76, 50, 9],
      [38, 14, 8],
      [62, 14, 8],
      [50, 12, 8],
    ]) +
    `<path d="M46 12L50 0L54 12Z" fill="#e0a800"/>` +
    `<circle cx="50" cy="38" r="22" fill="#f2c14e"/>` +
    dot(42, 35, 3.3) +
    dot(58, 35, 3.3) +
    `<path d="M36 28q5-4 10 0M54 28q5-4 10 0" stroke="#3a9e47" stroke-width="3"/>` +
    `<ellipse cx="50" cy="45" rx="6" ry="4" fill="#9a5b2e"/>` +
    `<path d="M40 50Q50 58 60 50" stroke-width="3"/>` +
    cheeks(48, 15) +
    `<path d="M36 50q-6 4-10 2M64 50q6 4 10 2" stroke="#3a9e47" stroke-width="3"/>` +
    `<circle cx="50" cy="64" r="6" fill="${HL}"/><path d="M47 66h6" stroke-width="2"/>`,
  구미호:
    Array.from({ length: 9 }, (_, i) => -96 + i * 24)
      .map(
        (a) =>
          `<g transform="rotate(${a} 50 66)"><path d="M50 66C43 54 42 38 45 22C47 14 53 14 55 22C58 38 57 54 50 66Z" fill="#ff9f1a"/>` +
          `<path d="M45.5 26C46 16 54 16 54.5 26C52 28 48 28 45.5 26Z" fill="#fff" stroke-width="2.5"/></g>`,
      )
      .join('') +
    `<ellipse cx="50" cy="82" rx="16" ry="14" fill="#ff9f1a"/>` +
    `<path d="M42 74Q50 70 58 74L56 92H44Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M36 56L34 38L46 48Z" fill="#ff9f1a"/><path d="M64 56L66 38L54 48Z" fill="#ff9f1a"/>` +
    `<path d="M36 52C34 64 42 72 50 72S66 64 64 52C62 46 56 44 50 44S38 46 36 52Z" fill="#ff9f1a"/>` +
    `<path d="M40 62C44 70 56 70 60 62C56 66 44 66 40 62Z" fill="#fff" stroke-width="2"/>` +
    `<path d="M41 56q3-3 6 0M53 56q3-3 6 0" stroke-width="2.5"/>` +
    dot(50, 64, 2.4),
  도깨비방망이:
    `<g transform="rotate(30 50 54)">` +
    `<rect x="44" y="62" width="12" height="36" rx="6" fill="#9a5b2e"/>` +
    `<path d="M38 66C30 40 34 12 50 8C66 12 70 40 62 66Z" fill="#c98b4f"/>` +
    [
      [40, 52],
      [60, 52],
      [40, 34],
      [60, 34],
      [50, 20],
      [50, 44],
      [50, 60],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#e0a458" stroke-width="2.5"/>`)
      .join('') +
    `</g>` +
    [
      [16, 22],
      [30, 10],
      [14, 44],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${HL}"/><rect x="${x - 2}" y="${y - 2}" width="4" height="4" fill="#e0a800" stroke-width="1.5"/>`)
      .join('') +
    sparkle(84, 14, 6) +
    sparkle(26, 64, 5) +
    sparkle(88, 40, 4),
  요술램프:
    blob('#d6c2f5', [
      [80, 42, 7],
      [72, 32, 8],
      [60, 24, 9],
      [48, 16, 8],
    ]) +
    `<path d="M22 70C22 58 36 52 50 52C62 52 70 58 76 60L94 52C92 60 86 66 78 70C76 80 64 84 50 84C34 84 22 80 22 70Z" fill="${HL}"/>` +
    `<path d="M40 84H60L66 92H34Z" fill="#e0a800"/>` +
    tube('M24 64C8 60 8 82 26 78', '#e0a800', 4) +
    `<ellipse cx="46" cy="53" rx="14" ry="4" fill="#e0a800"/>` +
    `<path d="M40 52C40 44 52 44 52 52" fill="${HL}"/>` +
    `<path d="M32 70Q50 76 70 68" stroke="#e0a800" stroke-width="3"/>` +
    sparkle(30, 22, 6) +
    sparkle(90, 24, 5) +
    sparkle(14, 42, 4),
  요술봉:
    `<path d="M20 92L56 46" stroke-width="13"/><path d="M20 92L56 46" stroke="#ff9aa8" stroke-width="6"/>` +
    `<path d="M50 56Q40 66 44 80M54 56Q62 70 56 82" stroke="#a45cf0" stroke-width="4"/>` +
    star(62, 34, 26, '#ffd23f') +
    `<circle cx="62" cy="36" r="6" fill="#ff5c70" stroke-width="2.5"/>` +
    sparkle(22, 20, 7, '#ff9aa8') +
    sparkle(90, 66, 6) +
    sparkle(84, 8, 4, '#a45cf0'),
  수정구슬:
    `<path d="M26 76H74L80 92H20Z" fill="#9a5b2e"/>` +
    `<path d="M20 92H80" stroke-width="5"/>` +
    `<circle cx="50" cy="44" r="34" fill="#c9b8f0"/>` +
    `<path d="M32 50C38 30 62 30 64 46C66 58 50 62 46 52C44 46 52 42 54 48" stroke="#e7ddff" stroke-width="5"/>` +
    `<path d="M26 34Q30 22 42 16" stroke="#fff" stroke-width="5"/>` +
    sparkle(62, 26, 5, '#fff') +
    sparkle(36, 62, 4, '#fff') +
    sparkle(66, 62, 3, '#fff') +
    `<ellipse cx="50" cy="78" rx="22" ry="5" fill="#c98b4f"/>` +
    sparkle(88, 14, 6) +
    sparkle(10, 20, 5),
  마법책:
    `<ellipse cx="50" cy="40" rx="34" ry="26" fill="#fff1b8" stroke="none" opacity=".7"/>` +
    `<path d="M50 66C36 58 20 58 6 62V90C20 86 36 86 50 94C64 86 80 86 94 90V62C80 58 64 58 50 66Z" fill="#8e4fc9"/>` +
    `<path d="M50 62C38 54 22 54 10 58V84C22 80 38 80 50 88Z" fill="#fff"/>` +
    `<path d="M50 62C62 54 78 54 90 58V84C78 80 62 80 50 88Z" fill="#fff"/>` +
    `<path d="M50 62V88" stroke-width="3"/>` +
    `<path d="M18 66Q28 63 40 67M18 74Q28 71 40 75M60 67Q72 63 82 66M60 75Q72 71 82 74" stroke="#c7b8e0" stroke-width="3"/>` +
    `<path d="M50 58C44 48 56 40 50 30C44 22 54 16 52 8" stroke="#a45cf0" stroke-width="4" stroke-dasharray="6 5"/>` +
    star(30, 32, 10, '#ffd23f') +
    star(70, 22, 8, '#ff9aa8') +
    sparkle(76, 44, 6) +
    sparkle(22, 12, 5, '#3b8fe0') +
    sparkle(58, 10, 5),
  보물섬:
    `<ellipse cx="50" cy="78" rx="47" ry="16" fill="#4a90e2"/>` +
    `<path d="M8 80q5-4 10 0M80 86q5-4 10 0M30 90q5-4 10 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M14 76Q24 48 50 46Q78 48 86 76Q50 84 14 76Z" fill="#f2c14e"/>` +
    tube('M34 66Q28 44 34 18', '#9a5b2e', 6) +
    `<path d="M34 18C24 10 12 14 8 22C18 18 26 20 34 18Z" fill="#43b04a"/>` +
    `<path d="M34 18C44 8 58 10 62 18C52 16 44 18 34 18Z" fill="#43b04a"/>` +
    `<path d="M34 18C28 20 20 28 20 36C26 28 30 24 34 18Z" fill="#43b04a"/>` +
    `<path d="M34 18C42 22 48 30 48 38C42 30 38 26 34 18Z" fill="#43b04a"/>` +
    `<circle cx="34" cy="22" r="3" fill="#6b3e26"/>` +
    `<path d="M54 52L78 46L82 52Z" fill="#9a5b2e"/>` +
    `<path d="M54 54C60 48 76 48 82 54Z" fill="${HL}"/>` +
    `<rect x="54" y="54" width="28" height="16" rx="2" fill="#9a5b2e"/>` +
    `<path d="M54 60H82" stroke="#e0a800" stroke-width="3"/><rect x="65" y="57" width="6" height="7" fill="${HL}" stroke-width="2"/>` +
    sparkle(68, 40, 6) +
    sparkle(88, 50, 4),
  투구:
    `<path d="M50 14C52 4 64 0 72 4C66 8 60 12 56 18Z" fill="#e8553d"/>` +
    `<path d="M22 90V52C22 28 34 16 50 16S78 28 78 52V90Q50 96 22 90Z" fill="#b8c4d8"/>` +
    `<path d="M50 16V40" stroke="#8a96b0" stroke-width="5"/>` +
    `<rect x="28" y="46" width="44" height="10" rx="4" fill="${INK}"/>` +
    `<path d="M50 56V88" stroke="#8a96b0" stroke-width="4"/>` +
    [66, 74, 82].map((y) => dot(38, y, 2.2) + dot(62, y, 2.2)).join('') +
    `<path d="M30 30Q36 22 44 20" stroke="#fff" stroke-width="4"/>`,
  갑옷:
    `<path d="M40 18H60V26H40Z" fill="#8a96b0"/>` +
    `<path d="M26 28Q50 20 74 28L70 70H30Z" fill="#dfe8f5"/>` +
    `<path d="M50 26V68" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M32 40Q50 48 68 40" stroke="#8a96b0" stroke-width="3"/>` +
    `<ellipse cx="20" cy="34" rx="14" ry="11" fill="#b8c4d8"/><ellipse cx="80" cy="34" rx="14" ry="11" fill="#b8c4d8"/>` +
    `<path d="M8 38Q20 32 32 38M68 38Q80 32 92 38" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="28" y="66" width="44" height="8" rx="2" fill="#9a5b2e"/><rect x="46" y="66" width="8" height="8" fill="${HL}" stroke-width="2.5"/>` +
    `<path d="M28 74H72L76 84H24Z" fill="#b8c4d8"/><path d="M24 84H76L80 94H20Z" fill="#b8c4d8"/>` +
    dot(34, 32, 2.2) +
    dot(66, 32, 2.2) +
    `<path d="M36 50Q38 40 44 34" stroke="#fff" stroke-width="4"/>`,
  방패:
    `<path d="M14 12H86V44C86 70 68 86 50 94C32 86 14 70 14 44Z" fill="#f2c14e"/>` +
    `<path d="M22 20H78V44C78 64 64 78 50 85C36 78 22 64 22 44Z" fill="#3b78e6"/>` +
    star(50, 48, 20, '#ffd23f') +
    dot(20, 17, 2.2) +
    dot(80, 17, 2.2) +
    dot(50, 90, 2.2) +
    `<path d="M28 28V44" stroke="#7ec8f0" stroke-width="4"/>`,
  망토:
    `<path d="M36 62H62C74 58 86 46 96 34C92 56 92 78 90 96H18C14 82 20 70 36 62Z" fill="#e8553d"/>` +
    `<path d="M64 66C74 62 84 54 92 44M70 80C78 74 86 66 92 58" stroke="#b8352a" stroke-width="3"/>` +
    person(44, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M34 64L44 70L54 64" stroke="${HL}" stroke-width="4"/><circle cx="44" cy="70" r="3.5" fill="${HL}" stroke-width="2"/>` +
    `<path d="M4 44h10M6 56h8M4 68h10" stroke="#9aa6c4" stroke-width="3"/>`,
  왕좌:
    `<path d="M22 60V20L31 8L41 18L50 4L59 18L69 8L78 20V60Z" fill="#f2c14e"/>` +
    `<path d="M31 58V26L50 18L69 26V58Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="12" r="3.5" fill="#3b8fe0" stroke-width="2"/><circle cx="31" cy="15" r="3" fill="#e8553d" stroke-width="2"/><circle cx="69" cy="15" r="3" fill="#e8553d" stroke-width="2"/>` +
    `<rect x="10" y="44" width="14" height="30" rx="5" fill="#f2c14e"/><rect x="76" y="44" width="14" height="30" rx="5" fill="#f2c14e"/>` +
    `<rect x="18" y="58" width="64" height="12" rx="5" fill="#e8553d"/>` +
    `<rect x="18" y="70" width="64" height="12" fill="#f2c14e"/>` +
    `<rect x="20" y="82" width="10" height="12" rx="2" fill="#e0a800"/><rect x="70" y="82" width="10" height="12" rx="2" fill="#e0a800"/>` +
    `<path d="M50 30L55 40L50 50L45 40Z" fill="${HL}" stroke-width="2.5"/>`,
  스캐너:
    `<path d="M24 50L34 12H96L86 50Z" fill="#8a96b0"/>` +
    `<path d="M30 46L38 18H90L82 46Z" fill="#b8c4d8" stroke-width="2.5"/>` +
    `<path d="M8 66L24 50H86L70 66Z" fill="#7ec8f0"/>` +
    `<path d="M26 60L36 52H58L48 60Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M36 58L41 54L44 57L47 55" stroke="#43b04a" stroke-width="2"/>` +
    `<path d="M50 66L66 50" stroke="#5fe06a" stroke-width="7"/>` +
    `<path d="M8 66H70V82H8Z" fill="#dfe8f5"/>` +
    `<path d="M70 66L86 50V66L70 82Z" fill="#b8c4d8"/>` +
    `<circle cx="60" cy="74" r="3.5" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M16 74H40" stroke="#8a96b0" stroke-width="3"/>`,
  복사기:
    `<path d="M18 26H80V34H18Z" fill="#8a96b0"/>` +
    `<rect x="16" y="34" width="66" height="58" rx="3" fill="#dfe8f5"/>` +
    `<rect x="52" y="20" width="26" height="8" rx="2" fill="#3a4060"/>` +
    `<circle cx="56" cy="24" r="1.8" fill="#5fe06a" stroke="none"/><circle cx="62" cy="24" r="1.8" fill="#ff9f1a" stroke="none"/>` +
    `<path d="M16 52H82M16 72H82" stroke-width="3"/>` +
    `<rect x="40" y="58" width="18" height="6" rx="2" fill="#8a96b0" stroke-width="2.5"/><rect x="40" y="78" width="18" height="6" rx="2" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M82 40L96 44V52L82 50Z" fill="#8a96b0"/>` +
    `<path d="M84 26L96 32V46L84 42Z" fill="#fff" stroke-width="2.5"/><path d="M78 20L92 26V40L78 36Z" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="85" cy="29" r="2.5" fill="#ff9f1a" stroke-width="1.5"/>` +
    `<path d="M4 44H14V60H4Z" fill="#fff" stroke-width="2.5"/><circle cx="9" cy="50" r="2.5" fill="#ff9f1a" stroke-width="1.5"/>` +
    `<path d="M20 30L36 26" stroke="#b8c4d8" stroke-width="2"/>`,
  전광판: (() => {
    const heart = ['...XX.XX...', '..XXXXXXX..', '..XXXXXXX..', '...XXXXX...', '....XXX....', '.....X.....'];
    let d = '';
    heart.forEach((row, r) =>
      [...row].forEach((c, i) => {
        d += c === 'X' ? dot(15 + i * 7, 22 + r * 7, 3, '#ff5c70') : dot(15 + i * 7, 22 + r * 7, 2, '#4a5580');
      }),
    );
    return (
      `<rect x="22" y="66" width="8" height="28" fill="#8a96b0"/><rect x="70" y="66" width="8" height="28" fill="#8a96b0"/>` +
      `<rect x="6" y="12" width="88" height="56" rx="5" fill="#8a96b0"/>` +
      `<rect x="10" y="16" width="80" height="48" rx="2" fill="#1d2340"/>` +
      d +
      [15, 29, 43, 57, 71, 85].map((x) => dot(x, 64 - 5, 2.4, '#ffd23f')).join('')
    );
  })(),
  표지판:
    `<rect x="46" y="54" width="8" height="42" fill="#8a96b0"/>` +
    `<path d="M50 6L92 70H8Z" fill="#e8553d" stroke-width="4"/>` +
    `<path d="M50 20L80 64H20Z" fill="#fff" stroke="none"/>` +
    `<circle cx="44" cy="36" r="4" fill="${INK}" stroke="none"/><circle cx="58" cy="42" r="3.2" fill="${INK}" stroke="none"/>` +
    `<path d="M44 42L42 52L36 60M42 52L48 60M44 44L38 50M44 44L50 48" stroke-width="3.5"/>` +
    `<path d="M58 47L57 54L53 60M57 54L61 60M58 48L54 52M58 48L62 51" stroke-width="3"/>` +
    `<path d="M28 60H72" stroke-width="3"/>`,
  이정표:
    `<path d="M4 94Q50 86 96 94" stroke="#43b04a" stroke-width="6"/>` +
    `<rect x="45" y="10" width="10" height="84" rx="2" fill="#9a5b2e"/>` +
    `<path d="M50 14H86L96 24L86 34H50Z" fill="#e0a458"/>` +
    `<path d="M50 40H14L4 50L14 60H50Z" fill="#e0a458"/>` +
    `<path d="M50 64H80L90 73L80 82H50Z" fill="#e0a458"/>` +
    `<path d="M58 24H80M18 50H42M58 73H76" stroke="#9a5b2e" stroke-width="3.5"/>` +
    dot(50, 24, 2.2) +
    dot(50, 50, 2.2) +
    dot(50, 73, 2.2),
  과속방지턱: (() => {
    const f = (x: number) => 76 - 26 * (1 - ((x - 60) / 28) ** 2);
    let s = '';
    for (let i = 0; i < 7; i++) {
      const x0 = 32 + 8 * i;
      const x1 = x0 + 8;
      const xm = (x0 + x1) / 2;
      s += `<path d="M${x0} 76V${f(x0).toFixed(1)}L${xm} ${f(xm).toFixed(1)}L${x1} ${f(x1).toFixed(1)}V76Z" fill="${i % 2 ? INK : '#ffd23f'}" stroke="none"/>`;
    }
    return (
      `<rect x="2" y="76" width="96" height="16" fill="#8a96b0"/>` +
      `<path d="M8 84H20M40 84H52M70 84H82" stroke="#fff" stroke-width="3"/>` +
      s +
      `<path d="M32 76Q60 24 88 76" />` +
      car(18, 76, '#e8553d', 0.8) +
      `<path d="M26 42q4-6 8 0" stroke="#9aa6c4" stroke-width="3"/>`
    );
  })(),
  차단기:
    `<path d="M2 90H98" stroke="#8a96b0" stroke-width="5"/>` +
    `<rect x="8" y="40" width="20" height="50" rx="3" fill="#ffd23f"/>` +
    `<path d="M8 60H28M8 76H28" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="22" y="44" width="74" height="10" rx="4" fill="#fff"/>` +
    [34, 58, 82].map((x) => `<rect x="${x - 6}" y="44" width="12" height="10" fill="#e8553d" stroke="none"/>`).join('') +
    `<rect x="22" y="44" width="74" height="10" rx="4"/>` +
    `<circle cx="18" cy="48" r="5" fill="#e8553d"/>` +
    car(72, 88, '#3b8fe0', 0.9),
  가드레일:
    `<path d="M2 78L98 64V96H2Z" fill="#8a96b0"/>` +
    `<path d="M10 90L30 87M50 84L70 81M86 78L96 77" stroke="#fff" stroke-width="3"/>` +
    [
      [14, 76],
      [40, 72],
      [64, 68],
      [86, 65],
    ]
      .map(([x, y], i) => `<rect x="${x - 3.5 + i * 0.5}" y="${y - 38 + i * 4}" width="${7 - i}" height="${38 - i * 4}" fill="#5a6580"/>`)
      .join('') +
    `<path d="M2 32L98 44V58L2 58Z" fill="#dfe8f5"/>` +
    `<path d="M2 40L98 48M2 50L98 53" stroke="#8a96b0" stroke-width="3"/>` +
    [14, 40, 64, 86].map((x, i) => `<rect x="${x - 3}" y="${40 + i * 2.4}" width="6" height="6" fill="#ff9f1a" stroke-width="1.5"/>`).join('') +
    `<path d="M2 20Q30 10 54 22T98 26" stroke="#43b04a" stroke-width="4"/>`,
  알코올램프:
    `<path d="M26 90C20 90 16 86 16 80C16 66 28 54 38 52V44H62V52C72 54 84 66 84 80C84 86 80 90 74 90Z" fill="#e7f5ff"/>` +
    `<path d="M18 74C30 70 70 70 82 74V80C82 86 80 88 74 88H26C20 88 18 86 18 80Z" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<path d="M26 64Q30 58 36 56" stroke="#fff" stroke-width="4"/>` +
    `<rect x="36" y="38" width="28" height="10" rx="2" fill="#8a96b0"/>` +
    `<path d="M50 38V30" stroke="#fff7e0" stroke-width="5"/><path d="M50 38V30" stroke-width="2"/>` +
    `<path d="M50 30c-9 0-12-8-8-15c3-5 7-8 7-15c4 5 11 10 9 18c-1 7-4 12-8 12z" fill="#ff9f1a"/>` +
    `<path d="M50 28c-4 0-5-4-3-8l3-5c2 3 5 7 3 10c-1 2-1 3-3 3z" fill="#7ec8f0" stroke="none"/>`,
  차례상:
    `<rect x="8" y="10" width="84" height="38" rx="2" fill="#f5e6c8"/>` +
    `<path d="M29 10V48M50 10V48M71 10V48" stroke="#c9b48a" stroke-width="2.5"/>` +
    `<path d="M14 34q6-8 12 0M56 30q6-8 12 0" stroke="#c9b48a" stroke-width="2.5"/>` +
    `<rect x="4" y="62" width="92" height="8" rx="2" fill="#9a3b2a"/>` +
    `<path d="M10 70V92M90 70V92M10 84Q50 90 90 84" stroke="#9a3b2a" stroke-width="6"/>` +
    dish(22, 55, 20) +
    pile(22, 52, 5, '#e8553d', 3) +
    dish(42, 55, 20) +
    pile(42, 52, 5, '#f2c14e', 3) +
    dish(62, 55, 20) +
    pile(62, 52, 5, '#ff9f1a', 3) +
    dish(80, 55, 16) +
    `<rect x="72" y="36" width="16" height="6" rx="2" fill="#fff" stroke-width="2"/><rect x="72" y="42" width="16" height="6" rx="2" fill="#ff9aa8" stroke-width="2"/><rect x="72" y="48" width="16" height="5" rx="2" fill="#fff" stroke-width="2"/>` +
    `<rect x="4" y="44" width="5" height="18" fill="#e8553d" stroke-width="2"/>` +
    flame(6.5, 44, 0.45) +
    `<rect x="91" y="44" width="5" height="18" fill="#e8553d" stroke-width="2"/>` +
    flame(93.5, 44, 0.45),
  돌잡이:
    `<path d="M24 66C24 48 34 42 50 42S76 48 76 66Z" fill="#ff5c70"/>` +
    `<path d="M26 56L14 68M74 56L86 68" stroke-width="14"/>` +
    `<path d="M26 56L14 68" stroke="#ffd23f" stroke-width="7"/><path d="M74 56L86 68" stroke="#43b04a" stroke-width="7"/>` +
    `<path d="M22 60L18 64M78 60L82 64" stroke="#3b8fe0" stroke-width="7"/>` +
    `<circle cx="13" cy="69" r="5" fill="${SKIN}"/><circle cx="87" cy="69" r="5" fill="${SKIN}"/>` +
    `<path d="M44 44L50 56L56 44" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="50" cy="28" r="15" fill="${SKIN}"/>` +
    `<path d="M34 26C34 10 44 6 50 6S66 10 66 26C62 18 58 16 50 16S38 18 34 26Z" fill="${INK}"/>` +
    `<path d="M62 18L72 28" stroke="${INK}" stroke-width="5"/>` +
    dot(45, 29, 2.2) +
    dot(55, 29, 2.2) +
    `<path d="M47 35q3 3 6 0" stroke-width="2.5"/>` +
    cheeks(33, 10) +
    `<rect x="4" y="74" width="92" height="9" rx="2" fill="#e8553d"/>` +
    `<path d="M12 83V94M88 83V94" stroke="#e8553d" stroke-width="7"/>` +
    `<path d="M8 72L22 68" stroke-width="6"/><path d="M8 72L22 68" stroke="#ffd23f" stroke-width="3"/>` +
    `<ellipse cx="38" cy="70" rx="8" ry="4" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="54" y="66" width="16" height="8" rx="1" fill="#7cc97a" stroke-width="2.5"/>` +
    `<circle cx="80" cy="69" r="5" fill="#3b8fe0" stroke-width="2.5"/>`,
};
