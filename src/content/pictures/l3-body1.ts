// 9세 이상 몸의 부분(관자놀이·광대뼈·갈비뼈·정강이…)과 머리 모양(단발머리·포니테일·상투·댕기머리…). 그림 규칙은 docs/picture-style.md.
import { SKIN, HL, dot, ring, moodFace, sparkle, tube, cheeks, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';
const MOUTH = '#b8405a';
const BONE = '#fff4dc';

/** 돌린 강조 고리 */
const tiltRing = (x: number, y: number, rx: number, ry: number, deg: number) =>
  `<g transform="rotate(${deg} ${x} ${y})">${ring(x, y, rx, ry)}</g>`;

/** 앞에서 본 큰 얼굴 (가운데 (50, 54), 머리털은 hair로) */
const bigFace = (hair: string, extra = '', mouth = `<path d="M42 72q8 6 16 0"/>`) =>
  `<circle cx="21" cy="56" r="7" fill="${SKIN}"/><circle cx="79" cy="56" r="7" fill="${SKIN}"/>` +
  `<circle cx="50" cy="54" r="29" fill="${SKIN}"/>` +
  hair +
  dot(40, 55) +
  dot(60, 55) +
  `<path d="M50 58q-3 5 0 7"/>` +
  mouth +
  extra;
const SHORT = `<path d="M21 50C19 27 35 20 50 20S81 27 79 50C74 40 63 34 50 34S26 40 21 50Z" fill="${HAIR}"/>`;

/** 윗몸 (머리 모양 그림용; 얼굴 가운데 (50, 46)) — back은 얼굴 뒤, front는 얼굴 위 */
const bust = (back: string, front: string, extra = '', shirt = '#ff9f1a', ears = true) =>
  back +
  `<path d="M20 97V88C20 77 33 72 50 72S80 77 80 88V97Z" fill="${shirt}"/>` +
  (ears ? `<circle cx="26" cy="48" r="5" fill="${SKIN}"/><circle cx="74" cy="48" r="5" fill="${SKIN}"/>` : '') +
  `<circle cx="50" cy="46" r="24" fill="${SKIN}"/>` +
  front +
  dot(41, 48, 2.8) +
  dot(59, 48, 2.8) +
  `<path d="M50 51q-2.5 4 0 6" stroke-width="3"/>` +
  `<path d="M43 61q7 5 14 0" stroke-width="3"/>` +
  cheeks(58, 15) +
  extra;

/** 몸통 앞모습 (가슴 속을 보여 줄 때) */
const chest = (inner: string) =>
  `<path d="M14 97V60C14 47 30 41 50 41S86 47 86 60V97Z" fill="#7ec8f0"/><path d="M42 41Q50 49 58 41" fill="${SKIN}"/>` +
  `<circle cx="50" cy="22" r="14" fill="${SKIN}"/><path d="M36 20C36 8 44 6 50 6S64 8 64 20C60 14 56 13 50 13S40 14 36 20Z" fill="${HAIR}"/>` +
  dot(45, 23, 2.2) +
  dot(55, 23, 2.2) +
  `<path d="M46 29q4 3 8 0" stroke-width="2.5"/>` +
  inner;

/** 옆에서 본 다리와 발 (발끝 오른쪽) */
const sideLeg =
  `<rect x="26" y="4" width="36" height="22" rx="4" fill="#3b78e6"/>` +
  `<path d="M32 24V68H56V24Z" fill="${SKIN}"/>` +
  `<path d="M30 62V80C30 88 34 92 42 92H84C93 92 95 81 86 78L58 64V62Z" fill="${SKIN}"/>` +
  `<path d="M86 81q-5 1-6 5" stroke-width="2.5"/>`;

/** 크게 본 귀 (옆머리와 함께) */
const bigEar =
  `<path d="M36 22C50 6 78 12 80 40C82 56 70 62 66 72C62 82 60 94 46 94C36 94 32 86 34 80C36 72 44 70 44 62C44 54 30 46 30 36C30 30 32 26 36 22Z" fill="${SKIN}"/>` +
  `<path d="M42 30C52 20 70 26 70 42C70 52 60 56 57 66" stroke-width="3"/>` +
  `<path d="M52 42C60 42 62 52 57 58C53 62 49 56 51 50" fill="#ffc08e" stroke-width="3"/>`;

/** 엄지를 세운 주먹 */
const thumbsUp =
  `<rect x="28" y="84" width="36" height="12" rx="3" fill="#3b78e6"/>` +
  `<rect x="29" y="12" width="16" height="44" rx="8" fill="${SKIN}"/>` +
  `<rect x="28" y="42" width="34" height="46" rx="10" fill="${SKIN}"/>` +
  [42, 53, 64, 75].map((y) => `<rect x="44" y="${y}" width="32" height="11" rx="5.5" fill="${SKIN}"/>`).join('') +
  `<rect x="33" y="15" width="8" height="8" rx="3" fill="#ffe3ea" stroke-width="2.5"/>`;

/** 윗몸의 아이 머리 (팔뚝·근육) */
const kidHead = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="13" fill="${SKIN}"/><path d="M${x - 13} ${y - 2}C${x - 13} ${y - 14} ${x - 6} ${y - 16} ${x} ${y - 16}S${x + 13} ${y - 14} ${x + 13} ${y - 2}C${x + 9} ${y - 8} ${x + 5} ${y - 9} ${x} ${y - 9}S${x - 9} ${y - 8} ${x - 13} ${y - 2}Z" fill="${HAIR}"/>` +
  dot(x - 5, y + 1, 2.2) +
  dot(x + 5, y + 1, 2.2) +
  `<path d="M${x - 4} ${y + 6}q4 3 8 0" stroke-width="2.5"/>`;

const flexArm =
  tube('M18 64L20 32', SKIN, 13) +
  `<path d="M38 58C34 42 22 38 16 52L14 68C22 78 34 76 38 70Z" fill="${SKIN}"/>` +
  `<circle cx="20" cy="26" r="10" fill="${SKIN}"/><path d="M24 22q3 4 0 8" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  // ── 얼굴 ──
  광대뼈: bigFace(
    SHORT,
    `<path d="M27 66q7-7 16-5M73 66q-7-7-16-5" stroke="#e0925a" stroke-width="4"/>` + tiltRing(34, 64, 11, 7, -15) + tiltRing(66, 64, 11, 7, 15),
  ),
  구레나룻: bigFace(
    SHORT + `<path d="M23 44H33V66Q33 72 28 72Q23 72 23 66Z" fill="${HAIR}"/><path d="M67 44H77V66Q77 72 72 72Q67 72 67 66Z" fill="${HAIR}"/>`,
    ring(28, 60, 9, 16) + ring(72, 60, 9, 16),
  ),
  콧수염: moodFace(
    dot(38, 50) +
      dot(62, 50) +
      `<path d="M50 52q-3 5 0 8"/>` +
      `<path d="M50 66C44 60 34 60 28 66C24 70 18 68 18 64C18 72 26 76 34 74C42 72 48 70 50 68C52 70 58 72 66 74C74 76 82 72 82 64C82 68 76 70 72 66C66 60 56 60 50 66Z" fill="#3a2a20"/>` +
      `<path d="M42 80q8 5 16 0"/>` +
      ring(50, 67, 36, 12),
  ),
  주름: bust(
    `<circle cx="50" cy="14" r="9" fill="#dfe8f5"/>`,
    `<path d="M26 42C25 22 38 16 50 16S75 22 74 42C71 32 62 26 50 26S29 32 26 42Z" fill="#dfe8f5"/>` +
      `<path d="M36 31q7-4 14 0t14 0M38 38q6-3 12 0t12 0" stroke="#7a4a2a" stroke-width="4.5"/>` +
      `<path d="M31 44l-6-3M31 49l-6 1M69 44l6-3M69 49l6 1M36 58q-3 5 0 9M64 58q3 5 0 9" stroke="#9a5b2e" stroke-width="3"/>`,
    sparkle(84, 30, 5) + sparkle(16, 30, 5),
    '#8e4fc9',
  ),
  흰머리: bust(
    '',
    `<path d="M24 46C22 22 36 14 50 14S78 22 76 46C74 36 70 30 66 28C58 32 42 32 34 28C30 30 26 36 24 46Z" fill="#fff"/>` +
      `<path d="M36 20q6 4 12 2M54 20q6 4 12 0" stroke="${MOVE}" stroke-width="2.5"/>` +
      `<g stroke-width="2.2"><circle cx="41" cy="48" r="6"/><circle cx="59" cy="48" r="6"/><path d="M47 48h6"/></g>` +
      `<path d="M35 40h10M55 40h10" stroke="#dfe8f5" stroke-width="4"/>`,
    ring(50, 24, 30, 14),
    '#9a5b2e',
  ),

  // ── 입 ──
  젖니:
    `<circle cx="50" cy="54" r="34" fill="${SKIN}"/>` +
    `<path d="M50 20c-6-4-2-12 4-9" stroke="${HAIR}" stroke-width="4"/>` +
    dot(38, 48) +
    dot(62, 48) +
    `<path d="M32 60H68Q68 84 50 84Q32 84 32 60Z" fill="${MOUTH}"/>` +
    [33, 41, 50, 59].map((x) => `<rect x="${x}" y="60" width="8" height="8" rx="2.5" fill="#fff" stroke-width="2.5"/>`).join('') +
    `<path d="M40 78C44 72 56 72 60 78C56 82 44 82 40 78Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    cheeks(62, 24) +
    ring(50, 64, 22, 9),
  덧니: moodFace(
    dot(38, 50) +
      dot(62, 50) +
      `<path d="M50 52q-3 5 0 8"/>` +
      `<path d="M26 62H74C74 80 64 90 50 90S26 80 26 62Z" fill="${MOUTH}"/>` +
      [30, 39, 48, 66].map((x) => `<rect x="${x}" y="62" width="9" height="11" rx="3" fill="#fff" stroke-width="2.5"/>`).join('') +
      `<g transform="rotate(14 60 64)"><path d="M56 56H65V70L60.5 74L56 70Z" fill="#fff" stroke-width="2.5"/></g>` +
      ring(61, 65, 10, 13),
  ),
  혓바닥: moodFace(
    `<path d="M32 50q6-6 12 0M56 50q6-6 12 0" stroke-width="4"/>` +
      `<path d="M30 64C38 72 62 72 70 64C66 70 58 74 50 74S34 70 30 64Z" fill="${MOUTH}"/>` +
      `<path d="M37 68C44 71 56 71 63 68V84C63 96 37 96 37 84Z" fill="#ff7a8a"/>` +
      `<path d="M50 72V86" stroke-width="3"/>` +
      cheeks(62, 22) +
      ring(50, 82, 18, 13),
  ),

  // ── 귀·목 ──
  귓불: bigEar + ring(46, 84, 13, 11),
  목덜미:
    `<path d="M39 44H61V74H39Z" fill="${SKIN}"/>` +
    `<path d="M12 97V86C12 76 28 70 50 70S88 76 88 86V97Z" fill="#43b04a"/>` +
    `<circle cx="27" cy="34" r="6" fill="${SKIN}"/><circle cx="73" cy="34" r="6" fill="${SKIN}"/>` +
    `<circle cx="50" cy="28" r="23" fill="${HAIR}"/>` +
    `<path d="M36 18q6-4 12 0M52 14q6-2 10 2" stroke="#8a5a3a" stroke-width="3"/>` +
    ring(50, 60, 17, 11),

  // ── 몸 속 ──
  갈비뼈: chest(
    `<rect x="46" y="48" width="8" height="36" rx="4" fill="${BONE}" stroke-width="2.5"/>` +
      [53, 62, 71, 80]
        .map((y) => {
          const l = `M46 ${y}C38 ${y - 3} 28 ${y} 26 ${y + 7}`;
          const r = `M54 ${y}C62 ${y - 3} 72 ${y} 74 ${y + 7}`;
          return `<path d="${l}M${r.slice(1)}" stroke-width="7.5"/><path d="${l}M${r.slice(1)}" stroke="${BONE}" stroke-width="3.5"/>`;
        })
        .join('') +
      ring(50, 68, 32, 22),
  ),
  폐: chest(
    `<path d="M45 52C34 48 24 60 24 76C24 88 34 90 45 84Z" fill="#ff9aa8"/>` +
      `<path d="M55 52C66 48 76 60 76 76C76 88 66 90 55 84Z" fill="#ff9aa8"/>` +
      `<path d="M50 44V58M50 58L42 64M50 58L58 64" stroke-width="5"/>` +
      `<path d="M32 66q4-2 6 2M68 66q-4-2-6 2" stroke="#e85d9a" stroke-width="2.5"/>`,
  ),
  근육:
    `<path d="M34 97V64C34 58 40 54 50 54S66 58 66 64V97Z" fill="#43b04a"/>` +
    flexArm +
    `<g transform="translate(100 0) scale(-1 1)">${flexArm}</g>` +
    kidHead(50, 34) +
    ring(30, 52, 13, 11) +
    sparkle(34, 34, 6) +
    sparkle(70, 40, 5),
  팔뚝:
    `<path d="M6 97V70C6 58 12 52 22 52S38 58 38 70V97Z" fill="#ff9f1a"/>` +
    tube('M34 62H82', SKIN, 14) +
    `<circle cx="87" cy="62" r="8" fill="${SKIN}"/>` +
    `<path d="M26 56C34 54 40 58 40 66C40 72 34 74 26 72Z" fill="#ff9f1a"/>` +
    `<path d="M58 57v10" stroke-width="2.5"/>` +
    kidHead(22, 32) +
    ring(71, 62, 15, 12),

  // ── 손·발 ──
  손마디:
    `<rect x="30" y="84" width="40" height="12" rx="3" fill="#3b78e6"/>` +
    `<rect x="24" y="36" width="54" height="52" rx="14" fill="${SKIN}"/>` +
    [24, 38, 52, 66].map((x) => `<rect x="${x}" y="22" width="13" height="30" rx="6.5" fill="${SKIN}"/>`).join('') +
    [30.5, 44.5, 58.5, 72.5].map((x) => `<path d="M${x - 3} 30q3 3 6 0M${x - 3} 42q3 3 6 0" stroke-width="2.5"/>`).join('') +
    `<path d="M24 62C18 60 16 48 24 46" fill="${SKIN}"/>` +
    ring(51, 36, 31, 10),
  엄지손가락: thumbsUp + ring(37, 28, 12, 20),
  정강이: sideLeg + ring(51, 44, 10, 20) + `<path d="M76 44H64M68 40l-4 4 4 4" stroke="${ARROW}" stroke-width="4"/>`,
  복숭아뼈: sideLeg + `<circle cx="42" cy="66" r="5" fill="#ffc08e" stroke-width="2.5"/>` + ring(42, 66, 11, 11),
  엄지발가락:
    `<circle cx="56" cy="17" r="6" fill="${SKIN}"/><circle cx="66" cy="21" r="5.5" fill="${SKIN}"/><circle cx="74" cy="28" r="5" fill="${SKIN}"/><circle cx="79" cy="37" r="4.5" fill="${SKIN}"/>` +
    `<path d="M32 36C30 24 44 22 58 24C72 26 82 34 80 50C78 62 70 70 68 80C66 94 42 96 38 82C36 72 34 54 32 36Z" fill="${SKIN}"/>` +
    `<ellipse cx="40" cy="22" rx="10" ry="12" fill="${SKIN}"/>` +
    `<rect x="35" y="13" width="10" height="8" rx="3" fill="#ffe3ea" stroke-width="2.5"/>` +
    ring(40, 22, 15, 16),
  지문:
    `<rect x="24" y="8" width="52" height="92" rx="26" fill="${SKIN}"/>` +
    `<g stroke="#9a5b2e" stroke-width="3">` +
    `<path d="M50 40c-3 0-4 4-1 6s7-1 6-6-8-8-12-4"/>` +
    `<path d="M40 46c-2-10 6-16 13-14s12 8 10 16"/>` +
    `<path d="M34 50c-3-14 6-24 18-24s20 10 17 24"/>` +
    `<path d="M32 60c-6-16 0-34 18-38s28 10 24 34"/>` +
    `<path d="M44 52c2 6 10 6 12 0M38 58c4 10 20 10 24 0"/>` +
    `</g>` +
    ring(50, 42, 27, 26),

  // ── 머리 모양 ──
  단발머리: bust(
    `<path d="M18 46C18 18 34 12 50 12S82 18 82 46V70H18Z" fill="${HAIR}"/>`,
    `<path d="M25 38C26 22 36 17 50 17S74 22 75 38Z" fill="${HAIR}"/>`,
    '',
    '#e85d9a',
    false,
  ),
  긴머리: bust(
    `<path d="M20 44C20 16 34 10 50 10S80 16 80 44L86 96H14Z" fill="${HAIR}"/>`,
    `<path d="M26 44C24 22 38 16 50 16S76 22 74 44C70 32 60 26 48 28C40 30 32 36 26 44Z" fill="${HAIR}"/>`,
    `<path d="M30 97V88C30 80 38 76 50 76S70 80 70 88V97Z" fill="#e85d9a"/>`,
    '#e85d9a',
    false,
  ),
  양갈래머리: bust(
    `<path d="M28 30C12 24 2 40 6 60C8 70 16 70 16 60C16 48 20 40 30 38Z" fill="${HAIR}"/>` +
      `<path d="M72 30C88 24 98 40 94 60C92 70 84 70 84 60C84 48 80 40 70 38Z" fill="${HAIR}"/>`,
    `<path d="M26 44C24 22 38 16 50 16S76 22 74 44C70 32 60 27 50 27S30 32 26 44Z" fill="${HAIR}"/>` +
      `<circle cx="27" cy="33" r="5.5" fill="#ff5c70"/><circle cx="73" cy="33" r="5.5" fill="#ff5c70"/>`,
    '',
    '#4a90e2',
  ),
  포니테일:
    `<path d="M32 97V86C32 77 42 72 54 72S76 77 76 86V97Z" fill="#43b04a"/>` +
    `<path d="M34 26C16 20 6 40 8 62C10 78 20 84 20 72C20 58 24 44 38 38Z" fill="${HAIR}"/>` +
    `<circle cx="56" cy="46" r="24" fill="${SKIN}"/>` +
    `<path d="M32 50C30 28 42 20 56 20C68 20 76 26 79 38C70 32 62 32 56 36C50 42 48 50 50 58C42 58 36 56 32 50Z" fill="${HAIR}"/>` +
    `<circle cx="47" cy="50" r="5" fill="${SKIN}"/>` +
    `<circle cx="36" cy="31" r="6" fill="#ff5c70"/>` +
    `<path d="M79 44q6 3 1 7" fill="${SKIN}" stroke-width="3"/>` +
    dot(68, 45, 2.8) +
    `<path d="M66 58q5 3 9-1" stroke-width="3"/>` +
    `<circle cx="64" cy="54" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<path d="M12 42q-4 6-2 12M16 68q-3 4-2 8" stroke="${MOVE}" stroke-width="3"/>`,
  파마머리: bust(
    blob('#6b3e26', [
      [26, 28, 11],
      [38, 17, 11],
      [52, 14, 11],
      [66, 18, 11],
      [77, 30, 11],
      [81, 45, 10],
      [80, 60, 10],
      [20, 45, 10],
      [20, 60, 10],
      [50, 26, 14],
    ]),
    blob('#6b3e26', [
      [32, 32, 7],
      [43, 27, 7],
      [55, 27, 7],
      [67, 32, 7],
    ]) + `<path d="M22 28q4-5 8 0t-5 4M48 12q4-4 8 0t-5 4M74 26q5-2 6 3M18 56q5-3 6 2M80 56q-5-3-6 2M40 16q4-3 7 1" stroke="#b07a4a" stroke-width="2.5"/>`,
    `<circle cx="28" cy="62" r="3.5" fill="${HL}"/><circle cx="72" cy="62" r="3.5" fill="${HL}"/>`,
    '#a45cf0',
    false,
  ),
  까까머리: bust(
    '',
    `<path d="M26 44C25 24 38 20 50 20S75 24 74 44C70 38 62 34 50 34S30 38 26 44Z" fill="#8a7a6a"/>` +
      [
        [36, 28],
        [44, 25],
        [52, 24],
        [60, 26],
        [66, 31],
        [31, 35],
        [40, 31],
        [48, 29],
        [56, 29],
        [64, 36],
      ]
        .map(([x, y]) => dot(x, y, 1.6, '#4a3a2a'))
        .join(''),
    ring(50, 30, 28, 14),
    '#3b78e6',
  ),
  상투:
    `<g transform="translate(5 9) scale(.9)">` +
    bust(
      `<ellipse cx="50" cy="12" rx="8" ry="10" fill="#2a2320"/>`,
      `<path d="M26 44C25 22 38 18 50 18S75 22 74 44C70 36 62 32 50 32S30 36 26 44Z" fill="#2a2320"/>` +
        `<path d="M27 36C34 30 66 30 73 36" stroke="#2a2320" stroke-width="6"/>` +
        `<path d="M44 58C40 70 60 70 56 58" fill="#2a2320" stroke-width="2.5"/>`,
      `<path d="M36 76L50 92L64 76" fill="#fff"/>`,
      '#f4efe4',
    ) +
    `</g>` +
    `<path d="M38 20H62" stroke="${HL}" stroke-width="4"/>` +
    ring(50, 20, 14, 14),
  댕기머리: bust(
    `<path d="M22 44C22 18 36 12 50 12S78 18 78 44V60H22Z" fill="#2a2320"/>`,
    `<path d="M26 44C24 22 38 16 50 16S76 22 74 44C70 32 60 26 50 26S30 32 26 44Z" fill="#2a2320"/><path d="M50 17V26" stroke="${SKIN}" stroke-width="2.5"/>` +
      [58, 67, 76].map((y, i) => `<ellipse cx="${74 + i}" cy="${y}" rx="8" ry="6" fill="#2a2320"/>`).join(''),
    `<path d="M68 82H86L90 97H64Z" fill="#e8553d"/><path d="M36 74L50 90L64 74" fill="#fff"/><path d="M48 88l-8 9M48 88l4 9" stroke="#e8553d" stroke-width="4"/>`,
    '#ffd23f',
  ),
};
