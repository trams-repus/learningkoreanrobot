// 그림 묶음: 살림·도구·시계·정원·공구·수레·안전 물건 (l2). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, blob, sparkle, tube, drop, cheeks } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 바퀴살 n개 (가운데 cx,cy에서 반지름 r까지) */
function spokes(cx: number, cy: number, r: number, n: number, color: string, w: number, a0 = 0): string {
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + (k * 360) / n) * Math.PI) / 180;
    return `<path d="M${cx} ${cy}L${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}" stroke="${color}" stroke-width="${w}"/>`;
  }).join('');
}

/** 시계 눈금 (점 12개, 3시간마다 굵은 선) */
function ticks(cx: number, cy: number, r: number): string {
  return Array.from({ length: 12 }, (_, k) => {
    const a = ((k * 30 - 90) * Math.PI) / 180;
    const x = r1(cx + r * Math.cos(a));
    const y = r1(cy + r * Math.sin(a));
    if (k % 3) return dot(x, y, 1.8);
    const x2 = r1(cx + (r - 6) * Math.cos(a));
    const y2 = r1(cy + (r - 6) * Math.sin(a));
    return `<path d="M${x} ${y}L${x2} ${y2}" stroke-width="3.5"/>`;
  }).join('');
}

/** 시계 바늘 (10시 10분) */
const hands = (cx: number, cy: number, s: number) =>
  `<path d="M${cx} ${cy}L${r1(cx - 9 * s)} ${r1(cy - 6 * s)}" stroke-width="${r1(4.5 * s)}"/>` +
  `<path d="M${cx} ${cy}L${r1(cx + 8 * s)} ${r1(cy - 12 * s)}" stroke-width="${r1(3.5 * s)}"/>` +
  dot(cx, cy, r1(2.8 * s), '#e8553d');

/** 불꽃 (아래 가운데 x,y) */
const flame = (x: number, y: number, s = 1) =>
  `<path d="M${x} ${y}C${x - 6 * s} ${y} ${x - 7 * s} ${y - 6 * s} ${x - 4 * s} ${y - 10 * s}C${x - 2 * s} ${y - 13 * s} ${x} ${y - 15 * s} ${x} ${y - 18 * s}C${x + 3 * s} ${y - 14 * s} ${x + 7 * s} ${y - 10 * s} ${x + 6 * s} ${y - 5 * s}C${x + 5 * s} ${y - 1 * s} ${x + 3 * s} ${y} ${x} ${y}Z" fill="#ff9f1a" stroke-width="2.5"/>` +
  `<path d="M${x} ${y - 2 * s}C${x - 2 * s} ${y - 2 * s} ${x - 3 * s} ${y - 5 * s} ${x} ${y - 9 * s}C${x + 3 * s} ${y - 5 * s} ${x + 2 * s} ${y - 2 * s} ${x} ${y - 2 * s}Z" fill="#ffd23f" stroke="none"/>`;

/** 열쇠 (머리 가운데가 원점, 아래로) */
const key = (t: string, c: string) =>
  `<g transform="${t}">` +
  `<rect x="-3.5" y="6" width="7" height="30" rx="2" fill="${c}"/>` +
  `<path d="M3.5 22H9V26H3.5M3.5 30H8V34H3.5" fill="${c}"/>` +
  `<circle cx="0" cy="0" r="10" fill="${c}"/><circle cx="0" cy="0" r="3.5" fill="#fff7e0"/>` +
  `</g>`;

/** 책 한 권 세운 모양 */
const book = (x: number, y: number, w: number, h: number, c: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${c}"/><path d="M${x + 2} ${y + 6}H${x + w - 2}" stroke="#fff" stroke-width="2"/>`;

export const PICS: Record<string, string> = {
  휠체어:
    `<path d="M24 48L18 80H8" stroke-width="5"/>` +
    `<circle cx="20" cy="86" r="6" fill="#30354f"/>` +
    `<rect x="20" y="40" width="50" height="10" rx="4" fill="#3b78e6"/>` +
    `<rect x="62" y="12" width="10" height="36" rx="4" fill="#3b78e6"/>` +
    `<path d="M70 14H84" stroke-width="6"/>` +
    `<circle cx="54" cy="66" r="26" fill="#30354f"/><circle cx="54" cy="66" r="19" fill="#dfe8f5"/>` +
    spokes(54, 66, 19, 8, INK, 2.5) +
    `<circle cx="54" cy="66" r="5" fill="#8a96b0"/>`,
  목발: (() => {
    const c = (t: string) =>
      `<g transform="${t}">` +
      `<path d="M-8 6L-2 58M8 6L2 58" stroke-width="10"/><path d="M-8 6L-2 58M8 6L2 58" stroke="#8a96b0" stroke-width="4"/>` +
      tube('M0 58V84', '#8a96b0', 5) +
      `<rect x="-5" y="82" width="10" height="8" rx="3" fill="#30354f"/>` +
      `<rect x="-9" y="32" width="18" height="7" rx="3" fill="#30354f"/>` +
      `<rect x="-13" y="0" width="26" height="9" rx="4.5" fill="#3b8fe0"/>` +
      `</g>`;
    return c('translate(34 6) rotate(-6)') + c('translate(66 6) rotate(6)');
  })(),
  돋보기:
    tube('M60 60L86 86', '#9a5b2e', 11) +
    `<circle cx="40" cy="40" r="28" fill="#30354f"/><circle cx="40" cy="40" r="21" fill="#cdeeff"/>` +
    `<path d="M26 34C28 28 32 24 38 22" stroke="#fff" stroke-width="5"/>`,
  망원경:
    `<path d="M50 60L28 92M50 60L72 92M50 60V92" stroke-width="5"/>` +
    `<g transform="rotate(-25 50 52)">` +
    `<rect x="10" y="46" width="14" height="12" rx="2" fill="#30354f"/>` +
    `<rect x="22" y="43" width="46" height="18" rx="3" fill="#3b78e6"/>` +
    `<rect x="38" y="43" width="6" height="18" fill="#ffd23f"/>` +
    `<rect x="66" y="38" width="22" height="28" rx="3" fill="#3b78e6"/>` +
    `<rect x="84" y="36" width="6" height="32" rx="2" fill="#30354f"/>` +
    `</g>` +
    `<circle cx="50" cy="58" r="5" fill="#8a96b0"/>`,
  현미경:
    `<path d="M18 92H82V86C82 82 78 80 74 80H26C22 80 18 82 18 86Z" fill="#3b78e6"/>` +
    `<path d="M56 80V62C70 58 74 40 66 26L56 30C62 40 60 50 50 54V80Z" fill="#3b78e6"/>` +
    `<rect x="22" y="58" width="44" height="7" rx="2" fill="#30354f"/>` +
    `<rect x="32" y="53" width="22" height="5" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<g transform="rotate(-18 42 34)">` +
    `<rect x="38" y="42" width="9" height="10" fill="#8a96b0"/>` +
    `<rect x="35" y="16" width="15" height="28" rx="2" fill="#dfe8f5"/>` +
    `<rect x="33" y="6" width="19" height="10" rx="2" fill="#30354f"/>` +
    `</g>` +
    `<circle cx="66" cy="44" r="7" fill="#ffd23f"/>`,
  나침반:
    `<circle cx="50" cy="14" r="6"/>` +
    `<circle cx="50" cy="55" r="36" fill="#f2c14e"/><circle cx="50" cy="55" r="28" fill="#fff"/>` +
    `<path d="M50 30V35M50 75V80M25 55H30M70 55H75" stroke-width="3"/>` +
    `<g transform="rotate(25 50 55)">` +
    `<path d="M50 30L58 55H42Z" fill="#e8553d"/><path d="M50 80L58 55H42Z" fill="#dfe8f5"/>` +
    `</g>` +
    dot(50, 55, 4),
  지도:
    `<path d="M10 20L37 12L63 20L90 12V80L63 88L37 80L10 88Z" fill="#bfe6ff"/>` +
    `<path d="M16 36C22 24 36 24 40 32C46 40 56 30 62 36C68 44 58 56 50 58C40 60 36 72 26 70C16 68 12 48 16 36Z" fill="#5fc24a"/>` +
    `<path d="M66 60C70 54 80 54 84 60C86 68 78 74 72 72C66 70 64 66 66 60Z" fill="#5fc24a"/>` +
    `<path d="M37 12V80M63 20V88" stroke-width="2.5"/>` +
    `<path d="M24 58C30 48 40 50 46 44C52 40 60 50 72 62" stroke="#e8553d" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M74 64C68 56 68 48 74 46C80 48 80 56 74 64Z" fill="#e8553d" stroke-width="2.5"/>` +
    dot(74, 52, 2, '#fff'),
  지구본:
    `<path d="M50 80V88" stroke-width="5"/>` +
    `<path d="M30 92C30 86 40 84 50 84S70 86 70 92Z" fill="#9a5b2e"/>` +
    `<circle cx="48" cy="46" r="31" fill="#4a90e2"/>` +
    `<path d="M26 34C32 22 44 22 46 30C48 38 40 42 42 50C44 58 34 62 30 56C24 50 22 42 26 34Z" fill="#5fc24a"/>` +
    `<path d="M56 22C64 22 74 28 76 38C72 44 64 40 60 44C56 48 60 58 56 64C50 62 50 52 52 44C54 36 50 26 56 22Z" fill="#5fc24a"/>` +
    `<path d="M50 62C58 64 66 66 70 64C66 72 58 76 50 76Z" fill="#5fc24a"/>` +
    `<path d="M54 8A38 38 0 0 1 54 84" stroke-width="9"/><path d="M54 8A38 38 0 0 1 54 84" stroke="#f2c14e" stroke-width="4"/>`,
  자석:
    tube('M28 80V46A22 22 0 0 1 72 46V80', '#e8553d', 16) +
    tube('M28 80V68', '#dfe8f5', 16) +
    tube('M72 80V68', '#dfe8f5', 16) +
    `<path d="M20 92L16 96M28 94V98M36 92L40 96M64 92L60 96M72 94V98M80 92L84 96" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(86, 30, 6) + sparkle(14, 30, 5),
  건전지:
    `<rect x="43" y="10" width="14" height="10" rx="2" fill="#dfe8f5"/>` +
    `<rect x="30" y="18" width="40" height="74" rx="6" fill="#30354f"/>` +
    `<path d="M30 40V24C30 20 33 18 36 18H64C67 18 70 20 70 24V40Z" fill="#ff9f1a"/>` +
    `<path d="M54 48L42 66H50L46 82L60 62H52L56 48Z" fill="#ffd23f" stroke-width="2.5"/>`,
  전구:
    `<path d="M10 40H16M84 40H90M18 14L23 19M82 14L77 19M50 2V6" stroke="#ff9f1a" stroke-width="4"/>` +
    `<path d="M36 62C28 54 24 48 24 38A26 26 0 0 1 76 38C76 48 72 54 64 62V66H36Z" fill="#ffd23f"/>` +
    `<path d="M42 52L46 42L50 52L54 42L58 52" stroke="#e8862e" stroke-width="3"/><path d="M42 52V66M58 52V66" stroke-width="2.5"/>` +
    `<path d="M32 28C34 22 38 18 44 16" stroke="#fff" stroke-width="4"/>` +
    `<rect x="35" y="66" width="30" height="16" rx="3" fill="#8a96b0"/><path d="M36 72H64M36 77H64" stroke-width="2.5"/>` +
    `<path d="M42 82H58L55 90H45Z" fill="#30354f"/>`,
  콘센트:
    `<rect x="12" y="12" width="76" height="76" rx="12" fill="#fff"/>` +
    `<circle cx="50" cy="50" r="27" fill="#dfe8f5"/>` +
    `<rect x="45" y="22" width="10" height="6" rx="2" fill="#8a96b0" stroke-width="2.5"/><rect x="45" y="72" width="10" height="6" rx="2" fill="#8a96b0" stroke-width="2.5"/>` +
    dot(39, 50, 5.5) + dot(61, 50, 5.5) +
    dot(20, 20, 2, '#8a96b0') + dot(80, 80, 2, '#8a96b0'),
  플러그:
    tube('M50 70C50 86 30 84 26 96', '#fff', 6) +
    `<rect x="36" y="10" width="8" height="26" rx="4" fill="#dfe8f5"/><rect x="56" y="10" width="8" height="26" rx="4" fill="#dfe8f5"/>` +
    `<path d="M28 34H72V56C72 66 64 72 56 72H44C36 72 28 66 28 56Z" fill="#fff"/>` +
    `<path d="M28 34H72" stroke-width="3"/><path d="M38 48H62M38 56H62" stroke="#8a96b0" stroke-width="3"/>`,
  스위치:
    `<rect x="20" y="10" width="52" height="80" rx="7" fill="#fff"/>` +
    `<rect x="32" y="24" width="28" height="52" rx="5" fill="#dfe8f5"/>` +
    `<path d="M34 50H58" stroke-width="2.5"/><path d="M34 26H58V48H34Z" fill="#b8c6de" stroke="none"/>` +
    dot(46, 36, 2.5, '#43b04a') +
    tube('M86 52L60 40', SKIN, 9) +
    blob(SKIN, [[88, 60, 10], [82, 68, 8]]),
  초인종:
    `<rect x="30" y="12" width="40" height="76" rx="20" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="50" r="15" fill="#fff"/><circle cx="50" cy="50" r="9" fill="#ffd23f"/>` +
    `<path d="M22 40C18 46 18 54 22 60M14 34C8 44 8 56 14 66M78 40C82 46 82 54 78 60M86 34C92 44 92 56 86 66" stroke="#3b78e6" stroke-width="4"/>` +
    dot(50, 76, 3, '#8a96b0'),
  자물쇠:
    tube('M34 50V32A16 16 0 0 1 66 32V50', '#8a96b0', 8) +
    `<rect x="20" y="46" width="60" height="46" rx="8" fill="#ffd23f"/>` +
    `<path d="M26 56V82" stroke="#fff5c0" stroke-width="4"/>` +
    `<circle cx="50" cy="64" r="6" fill="${INK}"/><path d="M47 66L45 80H55L53 66Z" fill="${INK}"/>`,
  열쇠고리:
    `<circle cx="50" cy="24" r="16" stroke-width="10"/><circle cx="50" cy="24" r="16" stroke="#dfe8f5" stroke-width="4"/>` +
    key('translate(40 50) rotate(22)', '#ffd23f') +
    key('translate(60 50) rotate(-18)', '#8a96b0') +
    `<path d="M50 40V60" stroke-width="3"/>` +
    `<path d="M50 84C38 76 36 66 40 62C44 58 48 60 50 64C52 60 56 58 60 62C64 66 62 76 50 84Z" fill="#ff5c70"/>`,
  우편함:
    `<rect x="44" y="56" width="12" height="38" fill="#9a5b2e"/><path d="M30 94H70" stroke-width="4"/>` +
    `<g transform="rotate(-12 18 40)"><rect x="4" y="32" width="26" height="16" rx="1" fill="#fff"/><path d="M4 32L17 42L30 32" stroke-width="2.5"/></g>` +
    `<path d="M18 60V36C18 26 26 18 36 18H66C76 18 84 26 84 36V60Z" fill="#3b8fe0"/>` +
    `<path d="M26 60V36C26 30 30 26 34 26" stroke="#7ec8f0" stroke-width="4"/>` +
    `<path d="M76 36V14" stroke-width="4"/><path d="M76 14H92V24H76Z" fill="#e8553d"/>`,
  현관문:
    `<rect x="6" y="18" width="88" height="72" fill="#ffe0b8"/>` +
    `<path d="M16 24L50 6L84 24Z" fill="#e8553d"/>` +
    `<rect x="30" y="26" width="40" height="62" rx="3" fill="#3b8fe0"/>` +
    `<path d="M38 44C38 36 62 36 62 44Z" fill="#bfe6ff"/>` +
    `<rect x="37" y="52" width="26" height="28" rx="2" fill="#2f73c0" stroke-width="2.5"/>` +
    `<circle cx="62" cy="62" r="3.5" fill="#ffd23f"/>` +
    `<rect x="78" y="40" width="10" height="14" rx="3" fill="#ffd23f"/><path d="M83 34V40" stroke-width="3"/>` +
    `<rect x="22" y="88" width="56" height="7" rx="2" fill="#8a96b0"/>` +
    `<path d="M16 88V74C16 70 24 70 24 74V88Z" fill="#43b04a"/>`,
  블라인드:
    `<rect x="14" y="12" width="72" height="78" fill="#8fd3ff"/>` +
    `<path d="M14 90H86" stroke-width="4"/>` +
    [20, 28, 36, 44, 52, 60].map((y) => `<rect x="16" y="${y}" width="68" height="7" rx="1.5" fill="#fff" stroke-width="2.5"/>`).join('') +
    `<rect x="14" y="68" width="72" height="6" rx="2" fill="#dfe8f5"/>` +
    `<rect x="10" y="8" width="80" height="10" rx="3" fill="#dfe8f5"/>` +
    `<path d="M80 18V56" stroke-width="2"/>` +
    `<rect x="77" y="56" width="6" height="10" rx="3" fill="#ff9f1a" stroke-width="2"/>`,
  선반:
    `<rect x="16" y="40" width="16" height="18" rx="2" fill="#e8862e"/>` +
    blob('#43b04a', [[20, 32, 7], [28, 30, 7], [24, 24, 6]]) +
    book(38, 24, 8, 34, '#e8553d') + book(46, 28, 8, 30, '#3b8fe0') + book(54, 22, 8, 36, '#ffd23f') +
    `<path d="M66 44C66 38 70 36 76 36S86 38 86 44V56C86 58 84 58 82 58H70C68 58 66 58 66 56Z" fill="#dff3ff"/>` +
    `<rect x="68" y="30" width="16" height="7" rx="2" fill="#e85d9a"/>` +
    `<rect x="8" y="58" width="84" height="8" rx="2" fill="#c98b4f"/>` +
    `<path d="M18 66V84L34 66Z" fill="#9a5b2e"/><path d="M82 66V84L66 66Z" fill="#9a5b2e"/>`,
  책장:
    `<rect x="16" y="6" width="68" height="88" rx="2" fill="#9a5b2e"/>` +
    `<rect x="22" y="12" width="56" height="24" fill="#6b3e26"/><rect x="22" y="40" width="56" height="24" fill="#6b3e26"/><rect x="22" y="68" width="56" height="22" fill="#6b3e26"/>` +
    book(24, 16, 7, 20, '#e8553d') + book(31, 18, 7, 18, '#ffd23f') + book(38, 15, 8, 21, '#3b8fe0') + book(46, 19, 6, 17, '#43b04a') + book(58, 16, 7, 20, '#a45cf0') + book(65, 18, 7, 18, '#ff9f1a') +
    book(24, 44, 8, 20, '#43b04a') + book(32, 46, 7, 18, '#ff5c70') + book(39, 43, 7, 21, '#ffd23f') + book(52, 45, 7, 19, '#3b8fe0') + book(59, 44, 8, 20, '#e8862e') + book(67, 46, 7, 18, '#fff') +
    book(24, 71, 7, 19, '#3b8fe0') + book(31, 73, 8, 17, '#ffd23f') + book(39, 72, 7, 18, '#e8553d') + book(58, 72, 7, 18, '#a45cf0') + book(65, 71, 8, 19, '#43b04a'),
  책꽂이:
    `<path d="M4 88H96" stroke-width="4"/>` +
    book(28, 40, 9, 42, '#e8553d') + book(37, 34, 9, 48, '#3b8fe0') + book(46, 42, 8, 40, '#ffd23f') + book(54, 36, 9, 46, '#43b04a') +
    `<g transform="rotate(16 63 82)">` + book(63, 42, 9, 40, '#a45cf0') + `</g>` +
    `<path d="M14 84V36C14 32 16 30 20 30H26V84Z" fill="#ff9f1a"/>` +
    `<path d="M86 84V36C86 32 84 30 80 30H80V84Z" fill="#ff9f1a"/>` +
    `<rect x="12" y="80" width="76" height="8" rx="2" fill="#ff9f1a"/>`,
  액자:
    `<path d="M28 18L50 6L72 18" stroke-width="2.5"/>` + dot(50, 6, 3) +
    `<rect x="10" y="18" width="80" height="70" rx="3" fill="#f2c14e"/>` +
    `<rect x="20" y="28" width="60" height="50" fill="#bfe6ff"/>` +
    `<circle cx="66" cy="40" r="6" fill="#ffd23f"/>` +
    `<path d="M20 78V66L36 46L50 62L60 52L80 72V78Z" fill="#43b04a"/>` +
    `<rect x="20" y="28" width="60" height="50"/>`,
  벽시계:
    `<path d="M50 6V14" stroke-width="2.5"/>` + dot(50, 6, 3) +
    `<circle cx="50" cy="52" r="38" fill="#3b8fe0"/><circle cx="50" cy="52" r="31" fill="#fff"/>` +
    ticks(50, 52, 26) + hands(50, 52, 1.8),
  알람시계:
    `<path d="M16 34C10 26 14 14 26 12C32 11 36 14 38 18Z" fill="#ffd23f"/>` +
    `<path d="M84 34C90 26 86 14 74 12C68 11 64 14 62 18Z" fill="#ffd23f"/>` +
    `<path d="M50 24V16M44 14H56" stroke-width="4"/>` +
    `<path d="M30 80L22 92M70 80L78 92" stroke-width="6"/>` +
    `<circle cx="50" cy="56" r="32" fill="#e8553d"/><circle cx="50" cy="56" r="25" fill="#fff"/>` +
    ticks(50, 56, 21) + hands(50, 56, 1.4) +
    `<path d="M4 44L10 46M4 58H10M90 46L96 44M90 58H96" stroke="#9aa6c4" stroke-width="3"/>`,
  모래시계:
    `<path d="M26 16V84M74 16V84" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M30 16C30 36 45 42 45 50C45 58 30 64 30 84H70C70 64 55 58 55 50C55 42 70 36 70 16Z" fill="#dff3ff"/>` +
    `<path d="M36 30H64C62 38 54 42 50 46C46 42 38 38 36 30Z" fill="#f2c14e" stroke-width="2.5"/>` +
    `<path d="M50 48V72" stroke="#f2c14e" stroke-width="3"/>` +
    `<path d="M32 82C34 72 44 68 50 68S66 72 68 82Z" fill="#f2c14e" stroke-width="2.5"/>` +
    `<rect x="18" y="8" width="64" height="9" rx="3" fill="#9a5b2e"/><rect x="18" y="83" width="64" height="9" rx="3" fill="#9a5b2e"/>`,
  손목시계:
    `<path d="M36 6H64L62 32H38Z" fill="#9a5b2e"/><path d="M38 68H62L64 94H36Z" fill="#9a5b2e"/>` +
    dot(50, 78, 2.2) + dot(50, 86, 2.2) +
    `<rect x="70" y="45" width="8" height="10" rx="2" fill="#8a96b0"/>` +
    `<circle cx="50" cy="50" r="24" fill="#8a96b0"/><circle cx="50" cy="50" r="18" fill="#fff"/>` +
    ticks(50, 50, 14) + hands(50, 50, 1.1),
  스탠드:
    `<path d="M46 60L28 88H80L66 44Z" fill="#fff1b8" stroke="none" opacity=".7"/>` +
    `<path d="M4 90H96" stroke-width="4"/>` +
    tube('M28 84L22 52L52 24', '#8a96b0', 5) +
    `<circle cx="22" cy="52" r="5" fill="#dfe8f5"/>` +
    `<g transform="rotate(40 58 32)"><path d="M48 24H68L80 50H36Z" fill="#43b04a"/></g>` +
    `<circle cx="55" cy="54" r="6" fill="#ffd23f"/>` +
    `<path d="M10 90C10 82 18 80 28 80S46 82 46 90Z" fill="#43b04a"/>`,
  촛대:
    `<rect x="18" y="20" width="9" height="22" rx="1.5" fill="#fff"/><rect x="45.5" y="14" width="9" height="28" rx="1.5" fill="#fff"/><rect x="73" y="20" width="9" height="22" rx="1.5" fill="#fff"/>` +
    flame(22.5, 18, 0.8) + flame(50, 12, 0.8) + flame(77.5, 18, 0.8) +
    tube('M22 44C22 66 78 66 78 44', '#f2c14e', 5) +
    `<rect x="46" y="44" width="8" height="38" fill="#f2c14e"/>` +
    `<rect x="14" y="40" width="17" height="6" rx="2" fill="#f2c14e"/><rect x="41.5" y="40" width="17" height="6" rx="2" fill="#f2c14e"/><rect x="69" y="40" width="17" height="6" rx="2" fill="#f2c14e"/>` +
    `<path d="M30 92H70C70 86 60 82 54 80H46C40 82 30 86 30 92Z" fill="#f2c14e"/>`,
  향초:
    `<path d="M44 24C38 18 48 14 42 6M58 22C54 16 62 12 58 4" stroke="#a45cf0" stroke-width="3"/>` +
    `<rect x="24" y="40" width="52" height="52" rx="8" fill="#dff3ff"/>` +
    `<rect x="29" y="50" width="42" height="38" rx="5" fill="#ff9aa8"/>` +
    `<path d="M29 54C36 50 64 50 71 54" stroke="#ffc3cd" stroke-width="4"/>` +
    `<path d="M50 50V42" stroke-width="2.5"/>` + flame(50, 42, 0.9) +
    `<circle cx="50" cy="72" r="8" fill="#fff" stroke-width="2.5"/>` + dot(50, 72, 3, '#e85d9a'),
  화분:
    `<path d="M50 56C46 42 34 34 20 34C22 48 34 56 50 56Z" fill="#43b04a"/>` +
    `<path d="M50 56C54 42 66 34 80 34C78 48 66 56 50 56Z" fill="#5fc24a"/>` +
    `<path d="M50 56C42 42 42 24 50 12C58 24 58 42 50 56Z" fill="#3a9e47"/>` +
    `<path d="M50 56V20" stroke-width="2.5"/>` +
    `<path d="M28 60H72L66 92H34Z" fill="#e8862e"/>` +
    `<rect x="24" y="54" width="52" height="11" rx="3" fill="#e8862e"/>`,
  꽃병:
    `<path d="M50 40V22M50 40L32 24M50 40L68 24" stroke="#3a9e47" stroke-width="4"/>` +
    blob('#ff5c70', [[50, 16, 9]]) + dot(50, 16, 3.5, '#ffd23f') +
    blob('#ffd23f', [[30, 22, 8]]) + dot(30, 22, 3, '#ff9f1a') +
    blob('#a45cf0', [[70, 22, 8]]) + dot(70, 22, 3, '#fff') +
    `<path d="M40 46C24 56 24 84 34 92H66C76 84 76 56 60 46Z" fill="#3b8fe0"/>` +
    `<rect x="36" y="38" width="28" height="9" rx="3" fill="#3b8fe0"/>` +
    `<path d="M32 70Q41 64 50 70T68 70" stroke="#fff" stroke-width="4"/>`,
  물뿌리개:
    drop(90, 54, 0.7) + drop(82, 66, 0.7) + drop(94, 72, 0.7) +
    tube('M24 50C24 24 52 24 52 44', '#43b04a', 6) +
    tube('M54 76L80 44', '#43b04a', 7) +
    `<path d="M76 40L88 30L94 44L84 50Z" fill="#43b04a"/>` +
    `<path d="M16 46H60V84C60 88 58 90 54 90H22C18 90 16 88 16 84Z" fill="#43b04a"/>` +
    `<path d="M22 54V80" stroke="#8fdc8f" stroke-width="4"/>`,
  호스:
    `<ellipse cx="38" cy="66" rx="28" ry="22" stroke-width="15"/><ellipse cx="38" cy="66" rx="28" ry="22" stroke="#43b04a" stroke-width="8"/>` +
    `<ellipse cx="38" cy="62" rx="20" ry="15" stroke-width="15"/><ellipse cx="38" cy="62" rx="20" ry="15" stroke="#43b04a" stroke-width="8"/>` +
    tube('M64 58C72 50 70 40 68 36', '#43b04a', 8) +
    `<g transform="rotate(30 70 30)"><rect x="64" y="16" width="12" height="20" rx="3" fill="#ffd23f"/></g>` +
    `<path d="M78 18C82 12 88 10 94 10M80 24C86 20 92 20 96 22M74 14C76 8 80 5 84 4" stroke="#4aa8f0" stroke-width="3.5"/>`,
  갈퀴:
    tube('M50 6V56', '#c98b4f', 6) +
    `<path d="M40 50L50 60L60 50Z" fill="#8a96b0"/>` +
    [14, 23, 32, 41, 50, 59, 68, 77, 86].map((x) => `<path d="M50 56L${x} ${x === 50 ? 86 : 86 - Math.abs(x - 50) / 6}" stroke-width="3"/>`).join('') +
    `<path d="M20 72Q50 64 80 72" stroke-width="4"/>` +
    `<path d="M6 92C10 86 16 84 20 88C16 94 10 94 6 92Z" fill="#e8862e" stroke-width="2.5"/><path d="M80 94C84 88 90 88 94 90C90 96 84 96 80 94Z" fill="#ffd23f" stroke-width="2.5"/><path d="M60 94C62 88 68 88 70 90C68 96 62 96 60 94Z" fill="#e8553d" stroke-width="2.5"/><path d="M28 94C30 88 36 88 38 91C36 96 30 96 28 94Z" fill="#ffd23f" stroke-width="2.5"/>`,
  괭이:
    `<path d="M6 92C20 80 40 78 56 84C70 88 84 84 94 88V96H6Z" fill="#9a5b2e"/>` +
    `<path d="M82 84V74M82 76C78 70 74 70 72 72C76 76 80 76 82 76M82 76C86 70 90 70 92 72C88 76 84 76 82 76" stroke="#3a9e47" stroke-width="3"/>` +
    tube('M16 8L58 62', '#c98b4f', 7) +
    `<path d="M54 56L64 64L60 70L50 62Z" fill="#8a96b0"/>` +
    `<path d="M60 64L80 70L76 88L56 80Z" fill="#8a96b0"/>`,
  도끼:
    `<path d="M16 60V86C16 92 84 92 84 86V60Z" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="60" rx="34" ry="10" fill="#f5d6a8"/>` +
    `<ellipse cx="50" cy="60" rx="20" ry="5" stroke="#c98b4f" stroke-width="2.5"/>` +
    `<path d="M30 72V86M60 74V88" stroke="#9a5b2e" stroke-width="2.5"/>` +
    tube('M52 52L82 10', '#c98b4f', 8) +
    `<path d="M36 60L38 44L52 40L62 50L56 62Z" fill="#8a96b0"/>` +
    `<path d="M38 50L41 44L50 42" stroke="#fff" stroke-width="3"/>`,
  톱:
    `<g transform="rotate(-18 50 55)">` +
    `<path d="M8 58L64 44V72L10 66Z" fill="#dfe8f5"/>` +
    `<path d="M10 66L14 72L18 67L22 73L26 68L30 74L34 69L38 75L42 70L46 76L50 71L54 77L58 72L62 78L64 72" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M60 36H84C90 36 92 42 90 48L86 74C85 78 82 80 78 80H60Z" fill="#e8862e"/>` +
    `<rect x="68" y="46" width="12" height="22" rx="5" fill="#fff7e0"/>` +
    `</g>`,
  드라이버:
    `<g transform="rotate(-40 50 50)">` +
    `<rect x="54" y="45" width="30" height="10" fill="#8a96b0"/>` +
    `<path d="M84 45L94 47V53L84 55Z" fill="#8a96b0"/>` +
    `<rect x="10" y="35" width="40" height="30" rx="12" fill="#e8553d"/>` +
    `<path d="M20 43H40M20 50H40M20 57H40" stroke="#ff9aa8" stroke-width="3"/>` +
    `<rect x="48" y="40" width="8" height="20" rx="2" fill="#ffd23f"/>` +
    `</g>`,
  렌치:
    `<g transform="rotate(-40 50 50)">` +
    `<rect x="24" y="43" width="52" height="14" rx="6" fill="#8a96b0"/>` +
    `<path d="M70 38C74 34 82 34 88 36L80 44V56L88 64C82 66 74 66 70 62C66 58 66 42 70 38Z" fill="#8a96b0"/>` +
    `<circle cx="18" cy="50" r="14" fill="#8a96b0"/><circle cx="18" cy="50" r="6" fill="#fff7e0"/>` +
    `<path d="M32 47H64" stroke="#dfe8f5" stroke-width="3"/>` +
    `</g>`,
  펜치:
    tube('M46 48C40 62 34 76 30 92', '#8a96b0', 8) + tube('M54 48C60 62 66 76 70 92', '#8a96b0', 8) +
    tube('M40 62C36 72 33 82 31 90', '#e8553d', 9) + tube('M60 62C64 72 67 82 69 90', '#e8553d', 9) +
    `<path d="M41 46C38 32 42 18 47 8H53C58 18 62 32 59 46Z" fill="#8a96b0"/>` +
    `<path d="M50 10V40" stroke-width="2.5"/><path d="M44 22H56M44 30H56" stroke="#dfe8f5" stroke-width="2"/>` +
    `<circle cx="50" cy="47" r="7" fill="#dfe8f5"/>` + dot(50, 47, 2.5),
  줄자:
    `<rect x="52" y="60" width="42" height="14" fill="#fff1b8"/>` +
    `<path d="M58 60V66M64 60V70M70 60V66M76 60V70M82 60V66M88 60V70" stroke-width="2.5"/>` +
    `<rect x="91" y="58" width="5" height="18" rx="1" fill="#8a96b0"/>` +
    `<rect x="8" y="28" width="52" height="52" rx="14" fill="#ffd23f"/>` +
    `<circle cx="34" cy="54" r="14" fill="#30354f"/><circle cx="34" cy="54" r="5" fill="#8a96b0"/>` +
    `<rect x="26" y="20" width="16" height="10" rx="3" fill="#30354f"/>`,
  페인트:
    `<path d="M22 34C22 10 78 10 78 34" stroke-width="3.5"/>` +
    `<rect x="22" y="34" width="56" height="58" rx="4" fill="#dfe8f5"/>` +
    `<path d="M22 34H78V48C78 54 72 54 72 48C72 60 62 60 62 48C62 52 56 52 56 48H46C46 58 36 58 36 48C36 52 28 52 28 48C28 54 22 54 22 48Z" fill="#3b8fe0"/>` +
    `<rect x="32" y="64" width="36" height="20" rx="4" fill="#fff"/>` +
    `<path d="M42 74C38 68 46 66 50 70C54 66 62 68 58 74C56 80 44 80 42 74Z" fill="#3b8fe0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="34" rx="28" ry="8" fill="#3b8fe0"/>` +
    `<path d="M36 32C42 30 50 30 56 31" stroke="#7ec8f0" stroke-width="3"/>`,
  롤러:
    `<rect x="20" y="6" width="54" height="30" fill="#7ec8f0" stroke="none"/>` +
    `<path d="M76 42H86V60L50 66V72" stroke-width="5"/>` +
    `<rect x="16" y="30" width="62" height="22" rx="7" fill="#3b8fe0"/>` +
    `<path d="M22 36H60" stroke="#7ec8f0" stroke-width="3"/>` +
    `<rect x="43" y="70" width="14" height="26" rx="5" fill="#ff9f1a"/>`,
  공구함:
    `<g transform="rotate(-14 30 40)"><rect x="26" y="14" width="10" height="32" rx="4" fill="#ffd23f"/><rect x="29" y="4" width="4" height="12" fill="#8a96b0" stroke-width="2.5"/></g>` +
    `<g transform="rotate(20 70 40)"><rect x="66" y="12" width="9" height="34" rx="3" fill="#8a96b0"/><path d="M62 12C62 4 79 4 79 12L73 14H68Z" fill="#8a96b0"/></g>` +
    tube('M38 42V32H62V42', '#30354f', 5) +
    `<rect x="8" y="42" width="84" height="48" rx="5" fill="#e8553d"/>` +
    `<path d="M8 56H92" stroke-width="3"/>` +
    `<rect x="44" y="52" width="12" height="10" rx="2" fill="#ffd23f"/>` +
    `<path d="M16 64V82" stroke="#ff9aa8" stroke-width="4"/>`,
  수레:
    blob('#ffd23f', [[24, 36, 9], [36, 32, 10], [48, 32, 10], [60, 36, 9]]) +
    `<path d="M22 40L20 34M34 30L32 24M48 28L50 22M60 34L64 28" stroke="#e8a92e" stroke-width="3"/>` +
    tube('M70 52L94 64', '#9a5b2e', 5) +
    `<rect x="12" y="40" width="60" height="16" rx="2" fill="#c98b4f"/>` +
    `<path d="M26 40V56M42 40V56M58 40V56" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M14 56L10 80" stroke-width="5"/>` +
    `<circle cx="44" cy="70" r="22" fill="#c98b4f"/><circle cx="44" cy="70" r="16" fill="#fff7e0"/>` +
    spokes(44, 70, 16, 8, '#9a5b2e', 4) +
    `<circle cx="44" cy="70" r="16"/>` + `<circle cx="44" cy="70" r="5" fill="#9a5b2e"/>`,
  손수레:
    `<path d="M24 76L90 52" stroke-width="10"/><path d="M24 76L90 52" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M64 62L70 86H78" stroke-width="5"/>` +
    blob('#9a5b2e', [[40, 42, 10], [52, 38, 11], [64, 40, 10]]) +
    `<path d="M14 44H80L70 68H32Z" fill="#43b04a"/>` +
    `<path d="M24 50H72" stroke="#8fdc8f" stroke-width="4"/>` +
    `<rect x="84" y="46" width="12" height="10" rx="4" fill="#30354f" transform="rotate(-20 90 51)"/>` +
    `<circle cx="24" cy="78" r="13" fill="#30354f"/><circle cx="24" cy="78" r="5" fill="#dfe8f5"/>`,
  리어카:
    `<rect x="20" y="16" width="18" height="18" fill="#e8b36b"/><rect x="40" y="20" width="22" height="14" fill="#e8b36b"/>` +
    `<path d="M20 22H38M40 26H62" stroke="#9a5b2e" stroke-width="2.5"/>` +
    tube('M68 40H92V56', '#8a96b0', 4) +
    `<rect x="10" y="34" width="62" height="26" rx="2" fill="#3b8fe0"/>` +
    `<path d="M10 42H72M10 50H72" stroke="#2f73c0" stroke-width="3"/>` +
    `<path d="M90 56V86" stroke-width="4"/>` +
    `<circle cx="40" cy="74" r="18" fill="#30354f"/><circle cx="40" cy="74" r="12" fill="#dfe8f5"/>` +
    spokes(40, 74, 12, 12, '#8a96b0', 1.5) + `<circle cx="40" cy="74" r="12"/>` +
    `<circle cx="40" cy="74" r="4" fill="#8a96b0"/>`,
  바퀴:
    `<circle cx="50" cy="50" r="42" fill="#9a5b2e"/><circle cx="50" cy="50" r="33" fill="#fff7e0"/>` +
    spokes(50, 50, 33, 8, INK, 9, 22.5) + spokes(50, 50, 33, 8, '#c98b4f', 4, 22.5) +
    `<circle cx="50" cy="50" r="33"/>` +
    `<circle cx="50" cy="50" r="11" fill="#c98b4f"/>` + dot(50, 50, 3.5),
  타이어:
    `<circle cx="50" cy="50" r="42" fill="#30354f"/>` +
    Array.from({ length: 16 }, (_, k) => {
      const a = (k * 22.5 * Math.PI) / 180;
      return `<path d="M${r1(50 + 34 * Math.cos(a))} ${r1(50 + 34 * Math.sin(a))}L${r1(50 + 40 * Math.cos(a))} ${r1(50 + 40 * Math.sin(a))}" stroke="#5a6078" stroke-width="4"/>`;
    }).join('') +
    `<circle cx="50" cy="50" r="22" fill="#8a96b0"/><circle cx="50" cy="50" r="10" fill="#dfe8f5"/>` +
    dot(50, 40, 2.5) + dot(59, 53, 2.5) + dot(41, 53, 2.5) +
    `<path d="M22 34C26 24 34 16 44 12" stroke="#5a6078" stroke-width="4"/>`,
  핸들:
    `<circle cx="50" cy="50" r="38" stroke-width="16"/><circle cx="50" cy="50" r="38" stroke="#4a5070" stroke-width="9"/>` +
    tube('M14 52H86', '#8a96b0', 8) + tube('M50 52V86', '#8a96b0', 8) +
    `<circle cx="50" cy="52" r="15" fill="#8a96b0"/><circle cx="50" cy="52" r="7" fill="#dfe8f5"/>` +
    `<path d="M26 22C32 17 38 15 44 14" stroke="#8a96b0" stroke-width="3"/>`,
  안전모:
    `<path d="M20 66C20 36 34 22 50 22S80 36 80 66Z" fill="#ffd23f"/>` +
    `<path d="M43 24C42 36 42 52 43 66H57C58 52 58 36 57 24C53 22 47 22 43 24Z" fill="#ffe27a"/>` +
    `<rect x="8" y="64" width="84" height="12" rx="6" fill="#ffd23f"/>` +
    `<path d="M28 58C28 46 32 38 38 32" stroke="#fff5c0" stroke-width="4"/>`,
  안전벨트:
    `<rect x="32" y="6" width="36" height="20" rx="8" fill="#3b78e6"/>` +
    `<rect x="14" y="22" width="72" height="72" rx="14" fill="#3b78e6"/>` +
    `<path d="M26 94V74C26 62 36 56 50 56S74 62 74 74V94Z" fill="#ffd23f"/>` +
    `<circle cx="50" cy="40" r="14" fill="${SKIN}"/>` +
    `<path d="M36 38C36 26 44 24 50 24S64 26 64 38C60 32 56 31 50 31S40 32 36 38Z" fill="#5a3b24"/>` +
    dot(45, 41, 2.2) + dot(55, 41, 2.2) + `<path d="M46 47q4 3 8 0" stroke-width="2.5"/>` + cheeks(46, 10) +
    tube('M68 58L32 88', '#30354f', 6) + tube('M20 86H80', '#30354f', 6) +
    `<rect x="26" y="80" width="16" height="12" rx="2" fill="#dfe8f5"/><rect x="31" y="83" width="6" height="6" rx="1" fill="#e8553d" stroke-width="2"/>`,
  헬멧:
    `<path d="M28 68L50 88L76 68" stroke-width="3"/>` +
    `<rect x="44" y="84" width="12" height="8" rx="2" fill="#30354f"/>` +
    `<path d="M12 66C10 38 30 20 54 20C76 20 92 36 90 58C90 64 86 68 80 68H18C14 68 12 68 12 66Z" fill="#3b8fe0"/>` +
    `<path d="M12 66C22 58 36 56 46 58" stroke="#ffd23f" stroke-width="5"/>` +
    `<path d="M34 32Q44 26 54 28M40 44Q52 36 66 38M62 26Q72 28 80 36" stroke="#30354f" stroke-width="6"/>` +
    `<path d="M80 58H94C94 64 90 68 84 68H80Z" fill="#30354f"/>`,
};

