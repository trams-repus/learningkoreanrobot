// 7~8세 몸의 부분(눈동자·앞니·가르마·약지…)과 몸에서 나는 일(딸꾹질·재채기·하품…). 그림 규칙은 docs/picture-style.md.
import { SKIN, HL, dot, ring, moodFace, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';
const MOUTH = '#b8405a';

/** 돌린 강조 고리 */
const tiltRing = (x: number, y: number, rx: number, ry: number, deg: number) =>
  `<g transform="rotate(${deg} ${x} ${y})">${ring(x, y, rx, ry)}</g>`;

/** 크게 본 눈 (가운데 (50, 56)) */
const bigEye = (iris = '#8a5a2e') =>
  `<path d="M6 56C26 24 74 24 94 56C74 88 26 88 6 56Z" fill="#fff"/>` +
  `<circle cx="50" cy="56" r="19" fill="${iris}"/>` +
  dot(50, 56, 9) +
  dot(56, 50, 4, '#fff');

/** 옆얼굴 (오른쪽을 봄, 코끝 (84, 62)) */
const profile = (eye = dot(62, 48), mouth = `<path d="M71 75q-4 2-8 0" stroke-width="3"/>`) =>
  `<path d="M30 97C30 88 38 84 50 84S70 88 70 97Z" fill="#3b78e6"/>` +
  `<path d="M46 22C62 22 72 30 74 42L84 60C86 64 84 66 80 66H75C76 72 74 78 68 82C60 88 40 90 28 80C16 70 14 40 24 30C30 25 38 22 46 22Z" fill="${SKIN}"/>` +
  `<path d="M74 38C72 22 58 14 44 14C26 14 13 28 13 48C13 58 17 66 23 72C27 64 30 58 34 54C36 44 44 36 56 34C64 33 70 35 74 38Z" fill="${HAIR}"/>` +
  `<circle cx="40" cy="58" r="7" fill="${SKIN}"/><path d="M38 55q4 3 0 6" stroke-width="2.5"/>` +
  eye +
  `<path d="M57 40q6-3 11 0" stroke-width="3"/>` +
  mouth;

/** 크게 벌린 입 (윗니 한 줄, 가운데 (50, 54)) */
function openMouth(gum = '#ff9aa8'): string {
  const teeth: [number, number, number, number, boolean][] = [
    // x, 너비, 윗끝, 높이, 뾰족
    [14, 10, 46, 14, false],
    [24, 8, 42, 19, true],
    [32, 8, 40, 18, false],
    [40, 10, 40, 21, false],
    [50, 10, 40, 21, false],
    [60, 8, 40, 18, false],
    [68, 8, 42, 19, true],
    [76, 10, 46, 14, false],
  ];
  const tooth = ([x, w, t, h, sharp]: [number, number, number, number, boolean]) =>
    sharp
      ? `<path d="M${x} ${t}H${x + w}V${t + h - 5}L${x + w / 2} ${t + h}L${x} ${t + h - 5}Z" fill="#fff" stroke-width="2.5"/>`
      : `<path d="M${x} ${t}H${x + w}V${t + h - 3}Q${x + w} ${t + h} ${x + w - 3} ${t + h}H${x + 3}Q${x} ${t + h} ${x} ${t + h - 3}Z" fill="#fff" stroke-width="2.5"/>`;
  return (
    `<path d="M4 54C14 12 86 12 96 54C86 94 14 94 4 54Z" fill="#ff7a8a"/>` +
    `<path d="M11 54C20 22 80 22 89 54C80 86 20 86 11 54Z" fill="${MOUTH}"/>` +
    `<path d="M26 76C32 64 68 64 74 76C64 83 36 83 26 76Z" fill="#ff9aa8"/>` +
    teeth.map(tooth).join('') +
    `<path d="M11 54C20 22 80 22 89 54C80 47 68 43 50 43S20 47 11 54Z" fill="${gum}"/>`
  );
}

/** 편 손 (손가락을 조금 벌림; 검지·중지·약지·새끼 = 0~3) */
const FINGERS: [number, number, number, number, number, number][] = [
  // x, 윗끝, 너비, 길이, 돌림, 돌림 중심 x
  [27, 18, 12, 40, -14, 33],
  [42, 8, 12, 48, -3, 48],
  [56, 12, 12, 44, 8, 62],
  [69, 26, 11, 32, 20, 74],
];
const finger = (i: number, extra: (x: number, t: number, w: number) => string = () => '') => {
  const [x, t, w, h, deg, cx] = FINGERS[i];
  return (
    `<g transform="rotate(${deg} ${cx} 58)"><rect x="${x}" y="${t}" width="${w}" height="${h}" rx="${w / 2}" fill="${SKIN}"/>` +
    extra(x, t, w) +
    `</g>`
  );
};
const nail = (x: number, t: number, w: number) =>
  `<rect x="${x + 2.5}" y="${t + 3}" width="${w - 5}" height="${w - 3}" rx="3" fill="#ffe3ea" stroke-width="2.5"/>`;
/** 강조할 손가락 둘레 고리 */
const fingerRing = (i: number) => {
  const [x, t, w, h, deg, cx] = FINGERS[i];
  return `<g transform="rotate(${deg} ${cx} 58)">${ring(x + w / 2, t + h / 2 - 4, w / 2 + 5, h / 2 + 3)}</g>`;
};
const palm =
  `<path d="M30 64C20 58 10 48 14 42C18 37 28 44 34 52Z" fill="${SKIN}"/>` +
  `<path d="M27 48H77V72C77 86 66 92 52 92S27 84 27 72Z" fill="${SKIN}"/>`;
function hand(nails = false, extra = ''): string {
  return [0, 1, 2, 3].map((i) => finger(i, nails ? nail : undefined)).join('') + palm + extra;
}

/** 옆에서 본 다리와 발 (발끝 오른쪽) */
const sideFoot =
  `<rect x="26" y="4" width="36" height="22" rx="4" fill="#3b78e6"/>` +
  `<path d="M32 24V68H56V24Z" fill="${SKIN}"/>` +
  `<path d="M30 62V80C30 88 34 92 42 92H84C93 92 95 81 86 78L58 64V62Z" fill="${SKIN}"/>` +
  `<path d="M86 81q-5 1-6 5" stroke-width="2.5"/>`;

/** 팔을 번쩍 든 아이 (민소매, 겨드랑이·옆구리) */
const armsUp =
  tube('M36 44L20 10', SKIN, 11) +
  tube('M64 44L80 10', SKIN, 11) +
  `<circle cx="19" cy="9" r="6" fill="${SKIN}"/><circle cx="81" cy="9" r="6" fill="${SKIN}"/>` +
  `<path d="M32 96V52C32 44 34 40 40 40H60C66 40 68 44 68 52V96Z" fill="#43b04a"/>` +
  `<path d="M40 40C40 50 60 50 60 40" fill="${SKIN}"/>` +
  `<circle cx="50" cy="26" r="13" fill="${SKIN}"/>` +
  `<path d="M37 24C37 12 44 10 50 10S63 12 63 24C59 18 55 17 50 17S41 18 37 24Z" fill="${HAIR}"/>` +
  dot(45, 27, 2.2) +
  dot(55, 27, 2.2) +
  `<path d="M45 32q5 4 10 0" stroke-width="2.5"/>`;

/** 윗몸 (얼굴이 큰 아이; 표정은 inner, 머리 가운데 (50, 38)) */
const bust = (inner: string, shirt = '#ff9f1a') =>
  `<path d="M16 97V84C16 70 30 64 50 64S84 70 84 84V97Z" fill="${shirt}"/>` +
  `<circle cx="50" cy="38" r="24" fill="${SKIN}"/>` +
  `<path d="M26 36C25 18 38 12 50 12S75 18 74 36C69 28 60 25 50 25S31 28 26 36Z" fill="${HAIR}"/>` +
  inner;

/** 음표 */
const note = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M5 0V-20L14 -16" stroke-width="${(4 / s).toFixed(2)}"/><ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#8e4fc9" transform="rotate(-20)"/></g>`;

export const PICS: Record<string, string> = {
  // ── 눈·코·입 ──
  눈동자: bigEye() + ring(50, 56, 25, 25),
  눈꺼풀:
    `<path d="M22 20q28-12 56 0" stroke="${HAIR}" stroke-width="7"/>` +
    bigEye('#5aa7e8') +
    `<path d="M6 56C26 22 74 22 94 56C74 44 26 44 6 56Z" fill="#ffc08e"/>` +
    `<path d="M20 50l-6 6M34 45l-3 8M50 44v8M66 45l3 8M80 50l6 6" stroke-width="3"/>` +
    ring(50, 40, 44, 15),
  콧등: profile() + tiltRing(79, 51, 7, 14, -29),
  입꼬리: moodFace(
    dot(38, 52) +
      dot(62, 52) +
      `<path d="M26 64C34 80 66 80 74 64C66 70 34 70 26 64Z" fill="#fff"/>` +
      `<path d="M22 64l4 0M78 64l-4 0" stroke-width="3"/>` +
      ring(25, 64, 8, 8) +
      ring(75, 64, 8, 8) +
      `<path d="M12 58V44M8 48l4-4 4 4M88 58V44M84 48l4-4 4 4" stroke="${ARROW}" stroke-width="3.5"/>`,
  ),
  앞니: openMouth() + ring(50, 52, 15, 15),
  어금니: openMouth() + ring(19, 54, 9, 11) + ring(81, 54, 9, 11),
  송곳니: openMouth() + ring(28, 52, 7, 14) + ring(72, 52, 7, 14),
  잇몸: openMouth('#ff5c85') + ring(50, 34, 36, 11),

  // ── 머리 ──
  뒤통수: profile() + ring(22, 48, 12, 20),
  정수리:
    `<g transform="translate(5 12) scale(.9)">` +
    `<circle cx="21" cy="56" r="7" fill="${SKIN}"/><circle cx="79" cy="56" r="7" fill="${SKIN}"/><circle cx="50" cy="54" r="29" fill="${SKIN}"/>` +
    `<path d="M21 50C19 27 35 20 50 20S81 27 79 50C74 40 63 34 50 34S26 40 21 50Z" fill="${HAIR}"/>` +
    dot(40, 55) +
    dot(60, 55) +
    `<path d="M50 58q-3 5 0 7"/><path d="M42 72q8 6 16 0"/>` +
    cheeks(66, 17) +
    `<path d="M50 27c4 0 5 4 1 5s-6-2-3-6" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `</g>` +
    ring(50, 32, 17, 8) +
    `<path d="M50 3V17M44 11l6 6 6-6" stroke="${ARROW}" stroke-width="4"/>`,
  턱수염: moodFace(
    dot(38, 50) +
      dot(62, 50) +
      `<path d="M50 54q-3 5 0 7"/>` +
      `<path d="M19 58C20 84 36 96 50 96S80 84 81 58C76 68 66 70 60 68C56 66 44 66 40 68C34 70 24 68 19 58Z" fill="#6b3e26"/>` +
      `<path d="M42 72q8 5 16 0" stroke="#fff" stroke-width="3"/>` +
      ring(50, 82, 26, 13),
  ),
  곱슬머리:
    blob('#9a5b2e', [
      [26, 30, 12],
      [40, 20, 12],
      [58, 19, 12],
      [74, 28, 12],
      [82, 44, 11],
      [18, 46, 11],
      [16, 62, 10],
      [84, 62, 10],
      [50, 28, 14],
    ]) +
    `<circle cx="50" cy="60" r="26" fill="${SKIN}"/>` +
    blob('#9a5b2e', [
      [32, 38, 8],
      [44, 34, 8],
      [56, 34, 8],
      [68, 38, 8],
    ]) +
    `<path d="M24 26q5-6 8 0t-6 3M52 16q5-5 8 1t-6 2M76 42q6-3 6 3t-6 1M18 58q6-3 7 3" stroke="#6b3e26" stroke-width="2.5"/>` +
    dot(41, 60) +
    dot(59, 60) +
    `<path d="M43 70q7 6 14 0"/>` +
    cheeks(68, 16),
  땋은머리:
    [22, 78]
      .map(
        (x) =>
          `<ellipse cx="${x}" cy="84" rx="6" ry="6" fill="#6b3e26"/><ellipse cx="${x}" cy="72" rx="7" ry="7" fill="#6b3e26"/><ellipse cx="${x}" cy="60" rx="7.5" ry="7.5" fill="#6b3e26"/>` +
          `<path d="M${x - 6} 91L${x} 88L${x + 6} 91L${x} 96Z" fill="#6b3e26"/>` +
          `<path d="M${x - 8} 87l8 2 8-2-2 6-6-3-6 3Z" fill="#ff5c70"/>`,
      )
      .join('') +
    `<circle cx="50" cy="50" r="27" fill="${SKIN}"/>` +
    `<path d="M22 56C18 30 32 18 50 18S82 30 78 56C74 44 64 36 50 36S26 44 22 56Z" fill="#6b3e26"/>` +
    dot(40, 54) +
    dot(60, 54) +
    `<path d="M43 64q7 6 14 0"/>` +
    cheeks(62, 17) +
    ring(22, 72, 12, 22) +
    ring(78, 72, 12, 22),
  앞머리:
    `<circle cx="50" cy="56" r="30" fill="${SKIN}"/>` +
    `<path d="M18 58C14 30 30 16 50 16S86 30 82 58L78 46L72 50L68 44L62 49L56 44L50 49L44 44L38 49L32 44L28 50L22 46Z" fill="${HAIR}"/>` +
    dot(40, 58) +
    dot(60, 58) +
    `<path d="M50 62q-3 5 0 7"/><path d="M42 74q8 6 16 0"/>` +
    cheeks(70, 18) +
    ring(50, 40, 34, 13),
  가르마:
    `<circle cx="50" cy="56" r="30" fill="${SKIN}"/>` +
    `<path d="M38 17C24 20 16 32 18 58C22 44 30 36 42 34Z" fill="${HAIR}"/>` +
    `<path d="M49 16C68 15 84 28 82 58C76 42 64 34 54 34Z" fill="${HAIR}"/>` +
    dot(40, 56) +
    dot(60, 56) +
    `<path d="M50 60q-3 5 0 7"/><path d="M42 72q8 6 16 0"/>` +
    cheeks(68, 18) +
    `<path d="M22 4L36 16M36 8V16H28" stroke="${ARROW}" stroke-width="4"/>`,

  // ── 몸 ──
  겨드랑이: armsUp + ring(32, 47, 11, 13),
  등뼈:
    `<path d="M14 97V70C14 56 30 50 50 50S86 56 86 70V97Z" fill="#7ec8f0"/>` +
    `<circle cx="50" cy="26" r="18" fill="${HAIR}"/><circle cx="31" cy="28" r="5" fill="${SKIN}"/><circle cx="69" cy="28" r="5" fill="${SKIN}"/>` +
    `<path d="M44 42H56V52H44Z" fill="${SKIN}"/>` +
    [54, 63, 72, 81, 90]
      .map((y) => `<rect x="42" y="${y - 3.5}" width="16" height="7" rx="3.5" fill="#fff4dc" stroke-width="2.5"/>`)
      .join('') +
    ring(50, 72, 13, 24),
  심장:
    `<path d="M16 97V60C16 46 30 40 50 40S84 46 84 60V97Z" fill="#3b78e6"/><path d="M42 40Q50 48 58 40" fill="${SKIN}"/>` +
    `<circle cx="50" cy="22" r="14" fill="${SKIN}"/><path d="M36 20C36 8 44 6 50 6S64 8 64 20C60 14 56 13 50 13S40 14 36 20Z" fill="${HAIR}"/>` +
    dot(45, 23, 2.2) +
    dot(55, 23, 2.2) +
    `<path d="M46 29q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M58 86C36 72 38 56 48 56C54 56 58 62 58 64C58 62 62 56 68 56C78 56 80 72 58 86Z" fill="#e8553d"/>` +
    `<path d="M50 62q-3 3-2 7" stroke="#fff" stroke-width="3"/>` +
    `<path d="M30 66h-8M30 76l-7 4M86 60l6-4M86 72h7" stroke="${MOVE}" stroke-width="3"/>`,
  옆구리: armsUp + ring(33, 74, 9, 16),

  // ── 손·발 ──
  손등:
    `<rect x="34" y="88" width="36" height="10" rx="3" fill="#3b78e6"/>` +
    hand(true, `<path d="M38 56q4-3 6 0M50 54q4-3 6 0M62 56q4-3 6 0" stroke-width="2.5"/>`) +
    ring(52, 72, 22, 16),
  손금:
    `<rect x="34" y="88" width="36" height="10" rx="3" fill="#3b78e6"/>` +
    hand(false, `<path d="M40 58q18 2 34-6M36 68q14 0 30-6M38 58q-6 16 10 30" stroke="#9a5b2e" stroke-width="4.5"/>`) +
    ring(52, 72, 24, 18),
  새끼손가락: hand() + fingerRing(3),
  검지: hand() + fingerRing(0),
  중지: hand() + fingerRing(1),
  약지: hand() + finger(2, (x, t, w) => `<rect x="${x - 1}" y="${t + 26}" width="${w + 2}" height="6" rx="3" fill="${HL}"/>`) + palm + fingerRing(2),
  발등: sideFoot + tiltRing(70, 72, 16, 9, 26),
  뒤꿈치: sideFoot + ring(34, 84, 10, 10),
  주근깨: moodFace(
    dot(38, 52) +
      dot(62, 52) +
      `<path d="M50 56q-3 5 0 7"/><path d="M42 72q8 6 16 0"/>` +
      [
        [28, 62],
        [34, 60],
        [31, 67],
        [37, 66],
        [25, 67],
        [72, 62],
        [66, 60],
        [69, 67],
        [63, 66],
        [75, 67],
        [46, 60],
        [54, 60],
      ]
        .map(([x, y]) => dot(x, y, 2.7, '#9a5b2e'))
        .join(''),
  ),

  // ── 몸에서 나는 일 ──
  딸꾹질: bust(
    `<circle cx="41" cy="40" r="5" fill="#fff" stroke-width="2.5"/><circle cx="59" cy="40" r="5" fill="#fff" stroke-width="2.5"/>` +
      dot(41, 40, 2.4) +
      dot(59, 40, 2.4) +
      `<ellipse cx="50" cy="52" rx="3.5" ry="4" fill="${MOUTH}" stroke-width="2.5"/>` +
      
      `<path d="M14 20q4-6 8 0M78 20q4-6 8 0M10 32q4-6 8 0M82 32q4-6 8 0" stroke="${MOVE}" stroke-width="3"/>` +
      `<circle cx="70" cy="56" r="3.5" fill="#dff2ff" stroke-width="2.5"/><circle cx="78" cy="48" r="5" fill="#dff2ff" stroke-width="2.5"/>`,
  ),
  재채기:
    `<g transform="translate(-14 0)">` +
    profile(`<path d="M58 49l7-3M58 49l7 3" stroke-width="3"/>`, `<ellipse cx="70" cy="75" rx="4" ry="5" fill="${MOUTH}" stroke-width="2.5"/>`) +
    `</g>` +
    `<path d="M76 58l18-12M78 66h18M76 74l18 12" stroke="${MOVE}" stroke-width="3.5"/>` +
    [
      [86, 54],
      [90, 64],
      [84, 70],
      [92, 76],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#7ec8f0'))
      .join(''),
  기침: moodFace(
    `<path d="M32 50l8 4-8 4M68 50l-8 4 8 4" stroke-width="3.5"/>` +
      `<path d="M46 56q-3 4 0 6"/>` +
      `<rect x="36" y="64" width="28" height="24" rx="10" fill="${SKIN}"/><path d="M43 66V78M50 65V78M57 66V78" stroke-width="2.5"/>` +
      `<rect x="40" y="86" width="20" height="11" rx="2" fill="#3b78e6"/>` +
      blob('#dfe8f5', [
        [80, 70, 6],
        [88, 64, 5],
        [88, 76, 5],
      ]) +
      blob('#dfe8f5', [
        [18, 72, 5],
        [12, 64, 4],
      ]),
  ),
  하품: moodFace(
    `<path d="M32 50q6 4 12 0M56 50q6 4 12 0" stroke-width="4"/>` +
      `<ellipse cx="50" cy="70" rx="11" ry="14" fill="${MOUTH}"/>` +
      `<path d="M42 78C44 72 56 72 58 78C54 82 46 82 42 78Z" fill="#ff9aa8" stroke-width="2.5"/>` +
      drop(72, 50, 0.8) +
      cheeks(64, 22),
  ),
  트림:
    `<path d="M34 94V84M58 94V84" stroke-width="12"/><path d="M34 94V84M58 94V84" stroke="#3b78e6" stroke-width="5"/>` +
    `<circle cx="46" cy="62" r="24" fill="${HL}"/>` +
    `<circle cx="46" cy="24" r="16" fill="${SKIN}"/><path d="M30 22C30 8 39 6 46 6S62 8 62 22C58 15 53 14 46 14S34 15 30 22Z" fill="${HAIR}"/>` +
    `<path d="M38 24q3 3 6 0M50 24q3 3 6 0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="32" rx="3.5" ry="3" fill="${MOUTH}" stroke-width="2.5"/>` +
    tube('M24 58C20 66 28 72 38 68', SKIN, 7) +
    `<path d="M36 60q6 4 12 0M40 70q6 4 12 0" stroke="#e8a020" stroke-width="3"/>` +
    blob('#dfe8f5', [
      [72, 26, 7],
      [82, 20, 7],
      [86, 32, 6],
    ]) +
    `<path d="M60 30l6-1" stroke="${MOVE}" stroke-width="3"/>` +
    sparkle(84, 50, 5),
  땀: moodFace(
    `<path d="M32 46l10 3M68 46l-10 3" stroke-width="3"/>` +
      dot(38, 55) +
      dot(62, 55) +
      `<path d="M40 74q10-6 20 0" stroke-width="4"/>` +
      cheeks(66, 20) +
      drop(66, 28, 1.2) +
      drop(12, 38, 1.4) +
      drop(90, 44, 1.4) +
      drop(30, 30, 1),
  ),
  콧노래:
    `<g transform="translate(-4 14) scale(.82)">` +
    moodFace(
      `<path d="M32 54q6-6 12 0M56 54q6-6 12 0" stroke-width="4"/>` +
        `<path d="M50 58q-3 5 0 7"/><path d="M44 74q6 3 12 0" stroke-width="4"/>` +
        cheeks(68, 20),
    ) +
    `</g>` +
    `<path d="M50 62q10-8 18-4" stroke="${MOVE}" stroke-width="3"/>` +
    note(74, 44, 1.2) +
    note(84, 20, 1),
};
