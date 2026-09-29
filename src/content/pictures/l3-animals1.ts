// 동물 그림 묶음 L3-1 (스컹크·오소리 … 웜뱃·듀공: 드문 동물은 그 동물만의 무늬·뿔·귀·꼬리를 크게). 그림 규칙은 docs/picture-style.md.
import { INK, dot, blob, cheeks, tube, drop } from '../pictureKit.ts';

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 4.5, p = 2.6) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` + dot(x + 0.3, y + 0.3, p);

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '') =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

/** 물결 선 (x 4~95) */
const waveLine = (y: number, c = '#3b8fe0', w = 3) =>
  `<path d="M4 ${y}q6.5-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0" stroke="${c}" stroke-width="${w}"/>`;
/** 물결 위쪽을 가진 물 (아래 96까지) */
const water = (y: number, fill = '#7ec8f0') =>
  `<path d="M4 ${y}q6.5-5 13 0t13 0t13 0t13 0t13 0t13 0t13 0V96H4Z" fill="${fill}"/>`;

/** 무늬 띠 꼬리·몸 (굵은 선 위에 끊긴 선) */
const banded = (d: string, base: string, band: string, w: number, dash: string) =>
  tube(d, base, w) + `<path d="${d}" stroke="${band}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="butt"/>`;

/** 앉아 있는 큰 고양이 (앞모습) */
function bigCat(fur: string, muzzle: string, eyeC: string, bodyMarks = '', headMarks = ''): string {
  return (
    tube('M68 90C86 92 94 78 86 64', fur, 8) +
    `<path d="M24 94C20 72 30 58 50 58C70 58 80 72 76 94Z" fill="${fur}"/>` +
    bodyMarks +
    `<rect x="35" y="70" width="12" height="24" rx="5" fill="${fur}"/><rect x="53" y="70" width="12" height="24" rx="5" fill="${fur}"/>` +
    `<circle cx="30" cy="22" r="8" fill="${fur}"/><circle cx="70" cy="22" r="8" fill="${fur}"/>` +
    `<circle cx="50" cy="40" r="24" fill="${fur}"/>` +
    headMarks +
    `<ellipse cx="50" cy="51" rx="12" ry="8.5" fill="${muzzle}"/>` +
    `<path d="M45.5 45H54.5L50 50Z" fill="#e8858a" stroke-width="2"/>` +
    `<path d="M50 50v3M44 55q6 4 12 0" stroke-width="2.5"/>` +
    `<ellipse cx="40" cy="36" rx="5.5" ry="5" fill="${eyeC}"/><ellipse cx="60" cy="36" rx="5.5" ry="5" fill="${eyeC}"/>` +
    `<ellipse cx="40" cy="36.5" rx="1.8" ry="3.4" fill="${INK}" stroke="none"/><ellipse cx="60" cy="36.5" rx="1.8" ry="3.4" fill="${INK}" stroke="none"/>`
  );
}

const rosette = (x: number, y: number, r = 4.5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#d98a20" stroke="#3a2a20" stroke-width="2.8"/>` + dot(x, y, 1.4, '#3a2a20');

/** 나뭇가지 (새가 앉는 곳) */
const branch = (y: number) =>
  tube(`M6 ${y}H94`, '#9a5b2e', 6) + `<path d="M80 ${y}C84 ${y - 10} 92 ${y - 10} 94 ${y - 6}C90 ${y - 2} 86 ${y} 80 ${y}Z" fill="#43b04a"/>`;

/** 소리 선 */
const sing = (x: number, y: number) =>
  `<path d="M${x} ${y}q4 5 0 10M${x + 5} ${y - 4}q7 9 0 18" stroke="#9aa6c4" stroke-width="3"/>`;

/** 눈송이 */
const flake = (x: number, y: number, r = 4) =>
  `<path d="M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}M${x - r * 0.7} ${y - r * 0.7}l${1.4 * r} ${1.4 * r}M${x - r * 0.7} ${y + r * 0.7}l${1.4 * r} ${-1.4 * r}" stroke="#7ec8f0" stroke-width="2.5"/>`;

/** 기러기 한 마리 (날개 편 옆모습, 오른쪽을 봄) */
const goose =
  `<path d="M44 46C38 30 28 18 16 12C34 14 50 26 58 44Z" fill="#6b5a48"/>` +
  `<path d="M30 50L16 44L19 57Z" fill="#6b5a48"/>` +
  `<ellipse cx="50" cy="52" rx="24" ry="10" fill="#9a8a78"/>` +
  `<path d="M32 57C42 62 58 62 68 57" stroke="#e4d8c8" stroke-width="4"/>` +
  tube('M68 48C74 46 78 44 82 42', '#5a4a3a', 6) +
  `<circle cx="84" cy="40" r="6.5" fill="#5a4a3a"/>` +
  `<path d="M89 37L95 40L89 43Z" fill="#ff9f1a" stroke-width="2.5"/>` +
  dot(85, 38.5, 1.8, '#fff') +
  `<path d="M48 50C46 32 40 16 34 8C50 14 62 30 64 48Z" fill="#8a7a68"/>` +
  `<path d="M44 26L52 34M40 18L48 26" stroke="#6b5a48" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  스컹크:
    blob('#2f2a33', [
      [28, 62, 11],
      [19, 48, 12],
      [19, 32, 12],
      [28, 19, 10],
      [40, 13, 8],
    ]) +
    `<path d="M28 64C17 54 13 40 19 28C23 20 31 15 40 13" stroke="#fff" stroke-width="5"/>` +
    legs([36, 46, 62, 72], 70, 7, 16, '#2f2a33') +
    `<ellipse cx="54" cy="66" rx="26" ry="14" fill="#2f2a33"/>` +
    `<path d="M31 60C43 51 64 51 76 57" stroke="#fff" stroke-width="6"/>` +
    `<circle cx="74" cy="50" r="4.5" fill="#2f2a33"/>` +
    `<path d="M70 58C72 48 82 46 88 54L95 66C94 70 88 72 82 72C74 72 70 66 70 58Z" fill="#2f2a33"/>` +
    `<path d="M78 50L89 62" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="80" cy="61" r="3.4" fill="#fff" stroke="none"/>` +
    dot(80.5, 61.3, 1.9) +
    `<circle cx="93.5" cy="67" r="2.6" fill="#ff9aa8"/>`,

  오소리:
    `<ellipse cx="50" cy="72" rx="42" ry="19" fill="#9a9aa0"/>` +
    `<path d="M14 66q4 6 0 12M86 66q-4 6 0 12M24 58q3 5 0 10M76 58q-3 5 0 10" stroke="#6b6b72" stroke-width="2.5"/>` +
    `<rect x="28" y="76" width="13" height="18" rx="5" fill="#2f2a33"/><rect x="59" y="76" width="13" height="18" rx="5" fill="#2f2a33"/>` +
    `<circle cx="31" cy="24" r="6.5" fill="#fff"/><circle cx="69" cy="24" r="6.5" fill="#fff"/>` +
    `<path d="M50 76C39 76 29 58 29 40C29 26 39 17 50 17S71 26 71 40C71 58 61 76 50 76Z" fill="#fff"/>` +
    `<path d="M44 66C40 52 37 36 38 21M56 66C60 52 63 36 62 21" stroke="#2f2a33" stroke-width="8"/>` +
    dot(40, 42, 2.3, '#fff') +
    dot(60, 42, 2.3, '#fff') +
    `<ellipse cx="50" cy="69" rx="6" ry="4.5" fill="${INK}"/>`,

  족제비:
    tube('M18 72C10 74 5 68 5 58', '#c47a35', 8) +
    `<circle cx="5.5" cy="56" r="4.5" fill="#5a3b24"/>` +
    tube('M24 72L20 86', '#a8612a', 7) +
    tube('M34 74L36 88', '#a8612a', 7) +
    tube('M62 60L62 76', '#a8612a', 7) +
    tube('M70 56L74 70', '#a8612a', 7) +
    tube('M18 72C32 56 50 74 70 50', '#c47a35', 20) +
    `<circle cx="72" cy="29" r="5.5" fill="#c47a35"/>` +
    `<ellipse cx="80" cy="40" rx="15" ry="11.5" fill="#c47a35" transform="rotate(-15 80 40)"/>` +
    `<path d="M70 47C78 53 88 51 93 43C86 45 78 45 70 47Z" fill="#fff" stroke-width="2.5"/>` +
    dot(93, 36, 2.6) +
    dot(82, 36, 2.8),
  들소:
    `<path d="M16 58C10 62 8 70 9 76" stroke-width="3"/>` +
    `<ellipse cx="9" cy="78" rx="3.5" ry="5" fill="#3a2416"/>` +
    legs([22, 32], 64, 8, 24, '#6b4228', '#2a1a10') +
    legs([58, 68], 64, 8, 24, '#4a2e1c', '#2a1a10') +
    `<path d="M14 60C14 48 22 44 34 44H56V76C42 78 26 78 20 74C16 70 14 66 14 60Z" fill="#a8743f"/>` +
    `<path d="M36 50C36 26 56 14 70 20C80 26 82 42 80 56L78 78C68 84 56 82 50 76L40 66Z" fill="#5a3b24"/>` +
    `<path d="M50 32q-4 6 0 10M62 26q-4 6 0 10M46 52q-4 6 0 10M58 46q-4 6 0 10" stroke="#3a2416" stroke-width="2.5"/>` +
    `<path d="M74 40C70 34 71 27 78 26C76 31 78 36 81 40Z" fill="#f0e6cc"/>` +
    `<path d="M72 40C84 38 92 48 92 60C92 70 86 74 80 72C72 68 68 54 72 40Z" fill="#3a2416"/>` +
    `<path d="M76 68L80 88L88 70Z" fill="#3a2416"/>` +
    `<circle cx="83" cy="50" r="3.2" fill="#fff" stroke="none"/>` +
    dot(83.5, 50.3, 1.8),

  순록:
    `<path d="M4 96V90C30 84 70 84 96 90V96Z" fill="#fff"/>` +
    legs([22, 30], 60, 6, 30, '#7a5236', '#3a2a20') +
    legs([54, 62], 60, 6, 30, '#7a5236', '#3a2a20') +
    `<path d="M18 52l-7 1l5 6z" fill="#f4ecdc"/>` +
    `<ellipse cx="42" cy="58" rx="27" ry="14" fill="#9a6a40"/>` +
    `<path d="M56 52L66 34L80 38L72 62Z" fill="#9a6a40"/>` +
    `<path d="M60 58C56 48 62 40 70 40L74 60C70 66 62 64 60 58Z" fill="#f4ecdc"/>` +
    tube('M71 30C64 20 56 14 46 10', '#e6c98e', 4) +
    tube('M60 17L58 6', '#e6c98e', 4) +
    tube('M53 13L46 18', '#e6c98e', 4) +
    tube('M77 29C82 18 88 12 94 8', '#e6c98e', 4) +
    tube('M85 15L83 5', '#e6c98e', 4) +
    tube('M88 12L95 17', '#e6c98e', 4) +
    tube('M75 29L84 26', '#e6c98e', 4) +
    `<path d="M68 33L59 28L65 38Z" fill="#9a6a40"/>` +
    `<path d="M66 34C70 26 80 26 84 32L94 42C95 46 91 49 86 47L70 42Z" fill="#9a6a40"/>` +
    dot(78, 35, 2.4) +
    dot(93, 44, 2.3),

  하이에나:
    `<path d="M16 58C10 60 8 66 8 72" stroke-width="3"/>` +
    `<ellipse cx="8" cy="74" rx="3.5" ry="5" fill="#3a2a20"/>` +
    legs([20, 30], 66, 7, 22, '#c9a466', '#5a3b24') +
    legs([56, 66], 58, 7, 30, '#c9a466', '#5a3b24') +
    `<path d="M14 64C14 56 20 52 30 52L58 36C70 34 76 42 74 54L72 70C60 76 32 78 22 74C16 72 14 68 14 64Z" fill="#dbb877"/>` +
    `<path d="M30 50L60 34" stroke="#5a3b24" stroke-width="5"/>` +
    [
      [25, 62],
      [35, 58],
      [46, 53],
      [38, 67],
      [52, 62],
      [62, 50],
      [64, 62],
      [27, 70],
    ]
      .map(([x, y]) => dot(x, y, 3, '#6b4a2a'))
      .join('') +
    `<circle cx="66" cy="27" r="6" fill="#dbb877"/>` +
    dot(66, 27, 2.5, '#6b4a2a') +
    `<path d="M62 36C64 26 76 24 84 30L94 42C95 48 90 51 84 50L68 48C64 46 62 42 62 36Z" fill="#dbb877"/>` +
    `<path d="M84 31L94 42C95 48 90 51 84 50C82 44 82 37 84 31Z" fill="#5a3b24"/>` +
    dot(76, 36, 2.6) +
    `<path d="M72 46q7 5 14 2" stroke-width="2.5"/>`,

  재규어:
    `<path d="M4 96C6 84 12 78 18 76C16 84 16 90 20 96Z" fill="#43b04a"/><path d="M96 96C94 84 88 78 82 76C84 84 84 90 80 96Z" fill="#43b04a"/>` +
    bigCat(
      '#eba838',
      '#fbe7bf',
      '#c8d84a',
      rosette(31, 78, 5.5) + rosette(69, 76, 5.5) + rosette(50, 64, 4.5),
      rosette(34, 30, 3.5) + rosette(66, 30, 3.5) + rosette(50, 22, 3.5),
    ),

  흑표범:
    bigCat('#34303a', '#4a4550', '#d8e84a') +
    `<path d="M30 60l-6 8M70 60l6 8" stroke="#55505e" stroke-width="2.5"/>`,

  아르마딜로:
    `<path d="M18 70C12 72 8 76 5 84L10 82L20 76Z" fill="#b8987a"/>` +
    legs([26, 36, 60, 70], 70, 8, 16, '#b8987a') +
    `<path d="M14 74C14 50 32 36 50 36C68 36 84 50 84 74Z" fill="#c9ae8e"/>` +
    `<path d="M32 44V70M41 39V70M50 37V70M59 38V70M68 43V70" stroke="#8a6e50" stroke-width="3"/>` +
    `<path d="M15 68C30 72 68 72 83 68" stroke="#8a6e50" stroke-width="3"/>` +
    `<path d="M22 58L26 54M22 64L26 60M74 58L78 62M74 64L78 67" stroke="#8a6e50" stroke-width="2.5"/>` +
    `<path d="M80 60L78 47L87 55Z" fill="#e0b0a0"/>` +
    `<path d="M78 58C84 53 92 60 96 75L84 75C80 70 78 64 78 58Z" fill="#c9ae8e"/>` +
    dot(86, 63, 2.3) +
    dot(94.5, 74, 1.8),

  오리너구리:
    waveLine(90) +
    `<ellipse cx="18" cy="60" rx="14" ry="8" fill="#6b4228"/>` +
    `<path d="M10 57h14M10 63h14M15 54v12M21 54v12" stroke="#4a2e1c" stroke-width="2"/>` +
    `<path d="M32 70L25 81H40Z" fill="#3a3f4a"/><path d="M60 70L56 81H70Z" fill="#3a3f4a"/>` +
    `<ellipse cx="46" cy="60" rx="26" ry="14" fill="#9a6a40"/>` +
    `<path d="M28 67C38 73 56 73 66 67" stroke="#c9a070" stroke-width="3"/>` +
    `<circle cx="70" cy="54" r="12" fill="#9a6a40"/>` +
    `<path d="M77 48C87 45 96 49 96 56C96 63 87 65 77 61Z" fill="#3a3f4a"/>` +
    dot(90, 51, 1.4, '#9aa6c4') +
    dot(94, 52, 1.4, '#9aa6c4') +
    dot(70, 50, 2.5),

  기니피그:
    `<path d="M8 80C6 58 22 40 48 40C74 40 90 54 92 72C92 80 86 84 78 84H16C10 84 8 82 8 80Z" fill="#fff"/>` +
    `<path d="M8 80C6 58 22 40 40 40C45 54 42 70 34 84H16C10 84 8 82 8 80Z" fill="#e8862e"/>` +
    `<path d="M64 42C78 44 90 54 92 70L68 72C62 62 60 50 64 42Z" fill="#9a5b2e"/>` +
    `<path d="M60 46C57 36 68 32 72 42Z" fill="#d98a6a"/>` +
    dot(77, 56, 3.3) +
    dot(78.2, 54.8, 1, '#fff') +
    `<circle cx="90" cy="69" r="2.8" fill="#ff9aa8"/>` +
    `<path d="M88 75q-3 2-6 0" stroke-width="2"/>` +
    `<ellipse cx="30" cy="85" rx="6" ry="3" fill="#ff9aa8"/><ellipse cx="72" cy="85" rx="6" ry="3" fill="#ff9aa8"/>` +
    `<path d="M76 88C72 80 80 74 86 80C92 76 98 84 92 90Z" fill="#8fd35a"/>`,

  청설모:
    blob('#4a4550', [
      [28, 76, 12],
      [19, 60, 13],
      [20, 42, 13],
      [30, 27, 11],
      [42, 22, 7],
    ]) +
    `<path d="M34 90C28 72 36 54 52 52C64 52 70 64 68 90Z" fill="#5f5a66"/>` +
    `<path d="M50 88C46 76 50 64 58 62C64 66 64 78 62 88Z" fill="#e4dccf"/>` +
    `<ellipse cx="42" cy="90" rx="8" ry="4" fill="#4a4550"/><ellipse cx="62" cy="90" rx="8" ry="4" fill="#4a4550"/>` +
    `<path d="M50 30L44 7L59 24Z" fill="#2f2a33"/><path d="M62 25L67 5L73 27Z" fill="#2f2a33"/>` +
    `<circle cx="60" cy="38" r="14" fill="#5f5a66"/>` +
    `<ellipse cx="71" cy="43" rx="7" ry="5.5" fill="#5f5a66"/>` +
    dot(77, 42, 2.2) +
    `<circle cx="63" cy="35" r="3.8" fill="#fff" stroke="none"/>` +
    dot(63.5, 35.3, 2.3) +
    `<ellipse cx="77" cy="64" rx="8" ry="11" fill="#9a5b2e"/>` +
    `<path d="M70 59l7 4l7-4M70 66l7 4l7-4" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<circle cx="69" cy="61" r="4" fill="#5f5a66"/>`,

  해달:
    water(58) +
    `<ellipse cx="88" cy="46" rx="5" ry="8" fill="#5a3b24" transform="rotate(30 88 46)"/>` +
    `<path d="M22 58C24 46 50 42 72 46C84 48 90 54 88 62C80 70 40 72 24 66Z" fill="#7a5236"/>` +
    `<circle cx="11" cy="44" r="4" fill="#c9a88a"/><circle cx="29" cy="44" r="4" fill="#c9a88a"/>` +
    `<circle cx="20" cy="52" r="13" fill="#e4d0b4"/>` +
    `<path d="M12 50q3-3 6 0M22 50q3-3 6 0" stroke-width="2.5"/>` +
    `<ellipse cx="20" cy="55" rx="3.5" ry="2.5" fill="${INK}"/>` +
    `<path d="M16 59q4 3 8 0" stroke-width="2.2"/>` +
    `<path d="M39 48C37 38 45 31 50 31S63 38 61 48Z" fill="#ff9aa8"/>` +
    `<path d="M50 34V47M44 36L46 47M56 36L54 47" stroke="#e85d9a" stroke-width="2"/>` +
    `<circle cx="39" cy="48" r="4.5" fill="#5a3b24"/><circle cx="61" cy="48" r="4.5" fill="#5a3b24"/>` +
    waveLine(68),

  일각고래:
    waveLine(88) +
    `<path d="M14 62L4 52L7 62L4 72Z" fill="#b8c4dc"/>` +
    `<path d="M10 62C16 50 42 44 62 48C74 50 82 56 82 62C82 68 72 72 58 72C38 74 18 70 10 62Z" fill="#c8d2e4"/>` +
    [
      [28, 55],
      [38, 51],
      [49, 51],
      [34, 61],
      [58, 54],
      [45, 58],
      [22, 62],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#6a7a98'))
      .join('') +
    `<path d="M56 67L49 80L64 70Z" fill="#b8c4dc"/>` +
    `<path d="M76 53L96 14L81 56Z" fill="#fff5dc"/>` +
    `<path d="M80 47l4 2M84 39l3.5 2M88 31l3 2M91 24l2.5 1.5" stroke-width="2"/>` +
    dot(72, 58, 2.6) +
    `<path d="M71 64q5 3 9 0" stroke-width="2.5"/>`,

  두루미:
    `<path d="M42 66L40 93M52 66L54 93" stroke-width="3.5"/>` +
    `<path d="M33 94H46M48 94H61" stroke-width="3"/>` +
    `<path d="M22 54C12 58 8 68 12 78C18 74 26 68 30 62Z" fill="#2f2a33"/>` +
    `<path d="M18 56C22 44 42 40 58 44C66 46 68 54 64 60C56 68 36 70 26 66C20 64 18 60 18 56Z" fill="#fff"/>` +
    tube('M58 48C62 36 61 26 64 17', '#2f2a33', 7) +
    `<circle cx="66" cy="14" r="8" fill="#fff"/>` +
    `<path d="M59 16C59 22 67 24 73 17L66 17Z" fill="#2f2a33"/>` +
    `<path d="M61 9C62 5 70 5 71 9Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M73 12L91 16L73 18Z" fill="#c9b77a"/>` +
    dot(68, 12.5, 2),

  황새:
    `<path d="M42 64L40 92M52 64L54 92" stroke-width="7"/><path d="M42 64L40 92M52 64L54 92" stroke="#e8553d" stroke-width="3.5"/>` +
    `<path d="M32 93H46M48 93H62" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M16 50C20 40 40 36 56 40C64 42 66 50 62 56C54 64 34 66 24 62C18 60 16 54 16 50Z" fill="#fff"/>` +
    `<path d="M8 56C20 56 38 58 58 54C54 62 40 66 26 64C18 63 12 60 8 56Z" fill="#2f2a33"/>` +
    tube('M56 42C60 32 58 24 62 16', '#fff', 7) +
    `<circle cx="64" cy="14" r="8" fill="#fff"/>` +
    dot(66, 12, 2.2) +
    `<path d="M70 10L95 21L70 18Z" fill="#e8553d"/>`,

  백로:
    `<ellipse cx="48" cy="88" rx="42" ry="7" fill="#bfe6fa"/>` +
    `<path d="M30 88h8M56 88h10" stroke="#3b8fe0" stroke-width="2.5"/>` +
    `<path d="M44 64L42 88M52 64L54 88" stroke-width="3.5"/>` +
    `<path d="M22 56L8 64M24 60L10 70" stroke-width="2.5"/>` +
    `<path d="M18 52C22 42 40 38 56 44C64 46 66 54 60 60C52 66 34 66 24 62C20 60 18 56 18 52Z" fill="#fff"/>` +
    tube('M56 47C68 39 50 30 58 20', '#fff', 7) +
    `<ellipse cx="62" cy="17" rx="8" ry="6.5" fill="#fff"/>` +
    `<path d="M68 14L93 18L68 20Z" fill="#ffd23f"/>` +
    dot(64, 15.5, 2),

  원앙:
    water(80, '#bfe6fa') +
    `<path d="M18 62L6 56L12 68Z" fill="#5a3b24"/>` +
    `<path d="M12 68C14 56 30 52 50 54C64 56 72 62 72 70C66 78 30 80 16 74Z" fill="#e8a060"/>` +
    `<path d="M16 60C24 54 36 54 42 58C36 62 24 64 16 60Z" fill="#5a3b24"/>` +
    `<path d="M40 58L48 36C55 40 58 50 56 58Z" fill="#ff9f1a"/>` +
    `<path d="M47 42L52 56" stroke="#e8553d" stroke-width="2"/>` +
    `<path d="M58 56C68 58 74 64 72 72C68 76 62 76 58 74Z" fill="#6a3a7a"/>` +
    `<path d="M57 58L55 72" stroke="#fff" stroke-width="3"/>` +
    `<path d="M62 32L48 36L60 44Z" fill="#6a3a7a"/>` +
    `<circle cx="70" cy="40" r="11" fill="#3a6a50"/>` +
    `<path d="M63 44C60 54 70 58 80 50Z" fill="#ff9f1a"/>` +
    `<path d="M76 38C68 32 58 34 52 38" stroke="#fff" stroke-width="4.5"/>` +
    `<path d="M80 38L91 42L80 46Z" fill="#e8553d"/>` +
    dot(75, 39, 2.3),

  청둥오리:
    water(80, '#bfe6fa') +
    `<path d="M16 62L6 58L12 68Z" fill="#fff"/>` +
    `<path d="M20 58q-2-8 4-8" stroke-width="3"/>` +
    `<path d="M12 68C14 56 30 52 50 54C64 56 72 62 72 70C66 78 30 80 16 74Z" fill="#c8ccd4"/>` +
    `<path d="M12 68C13 61 16 57 22 56L26 76L16 74C13 72 12 70 12 68Z" fill="#2f2a33"/>` +
    `<path d="M28 60C38 56 50 58 56 62C48 66 36 66 28 60Z" fill="#9aa0ac"/>` +
    `<path d="M38 62h10" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M56 54C68 56 74 64 72 72C66 76 60 76 56 74C58 66 58 60 56 54Z" fill="#8a4a2a"/>` +
    `<path d="M60 54L62 40L74 40L72 56Z" fill="#3a9e47"/>` +
    `<circle cx="70" cy="36" r="11" fill="#3a9e47"/>` +
    `<path d="M60 52C64 55 70 55 74 52" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M79 34C86 34 92 38 92 40C88 43 84 42 79 41Z" fill="#ffd23f"/>` +
    dot(72, 33, 2.3),

  기러기:
    `<g transform="translate(2 58) scale(.36)" stroke-width="7">${goose}</g>` +
    `<g transform="translate(2 2) scale(.36)" stroke-width="7">${goose}</g>` +
    `<g transform="translate(4 14)">${goose}</g>`,

  딱따구리:
    `<rect x="6" y="4" width="28" height="92" rx="4" fill="#9a5b2e"/>` +
    `<path d="M14 12v12M26 58v14M14 76v12M26 14v8" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="20" cy="40" rx="4" ry="5" fill="#5a3b24"/>` +
    `<path d="M16 30l-5-4M18 50l-6 3M12 36l-5 1" stroke="#e0b88a" stroke-width="3.5"/>` +
    `<path d="M44 72L36 93L52 80Z" fill="#2f2a33"/>` +
    `<path d="M44 38C54 30 70 36 72 52C74 66 64 78 52 82C44 84 40 76 42 66C40 56 40 44 44 38Z" fill="#2f2a33"/>` +
    `<path d="M42 46C46 58 46 70 52 80C45 83 40 76 41 66C40 58 40 52 42 46Z" fill="#fff"/>` +
    `<path d="M56 50h9M58 58h9M58 66h8" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M45 80L50 88L54 80Z" fill="#e8553d"/>` +
    `<circle cx="48" cy="32" r="12" fill="#fff"/>` +
    `<path d="M37 28C38 21 44 19 50 20C52 24 56 27 59 29L48 29Z" fill="#2f2a33"/>` +
    `<path d="M50 20C58 19 62 25 60 32C56 30 53 25 50 20Z" fill="#e8553d"/>` +
    `<path d="M40 38C46 40 52 38 58 42" stroke="#2f2a33" stroke-width="3.5"/>` +
    dot(44, 31, 2.5) +
    `<path d="M37 30L20 34L37 37Z" fill="#8a96b0"/>`,

  뻐꾸기:
    branch(72) +
    `<path d="M30 62L10 88L22 90L38 68Z" fill="#6b7890"/>` +
    dot(18, 86, 1.8, '#fff') +
    dot(24, 79, 1.8, '#fff') +
    `<path d="M28 56C28 40 44 30 58 32C68 34 72 44 70 54C66 66 52 72 40 70C32 68 28 62 28 56Z" fill="#8a96b0"/>` +
    `<path d="M44 70C60 70 70 60 70 50C70 44 68 40 64 38C64 52 56 64 44 70Z" fill="#fff"/>` +
    `<path d="M52 66h9M57 60h10M61 54h8M64 48h6" stroke="#4a5060" stroke-width="2.5"/>` +
    `<path d="M31 50C39 44 51 46 55 54C49 62 37 62 31 50Z" fill="#6b7890"/>` +
    `<path d="M44 70v5M52 69v6" stroke="#f2c14e" stroke-width="3"/>` +
    `<circle cx="64" cy="28" r="11" fill="#8a96b0"/>` +
    `<circle cx="67" cy="26" r="3.8" fill="#ffd23f"/>` +
    dot(67.5, 26, 2) +
    `<path d="M74 25L84 28L74 31Z" fill="#3a3f4a"/>` +
    sing(86, 18),

  꾀꼬리:
    branch(72) +
    `<path d="M30 62L10 86L22 88L38 68Z" fill="#2f2a33"/>` +
    `<path d="M10 86L22 88L20 82Z" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M28 56C28 40 44 30 58 32C68 34 72 44 70 54C66 66 52 72 40 70C32 68 28 62 28 56Z" fill="#ffd23f"/>` +
    `<path d="M31 50C39 44 51 46 55 54C49 62 37 62 31 50Z" fill="#2f2a33"/>` +
    `<path d="M36 52C42 50 48 52 51 55" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M44 70v5M52 69v6" stroke="#8a96b0" stroke-width="3"/>` +
    `<circle cx="64" cy="28" r="11" fill="#ffd23f"/>` +
    `<path d="M53 26C58 22 68 22 76 28" stroke="#2f2a33" stroke-width="6"/>` +
    dot(67, 25, 1.5, '#fff') +
    `<path d="M74 28L86 31L74 35Z" fill="#ff7a9a"/>` +
    sing(86, 16),

  메추라기:
    `<ellipse cx="82" cy="82" rx="8" ry="10" fill="#f4e4c4"/>` +
    dot(79, 78, 2.2, '#6b4228') +
    dot(85, 84, 2.4, '#6b4228') +
    dot(80, 87, 1.6, '#6b4228') +
    dot(86, 76, 1.5, '#6b4228') +
    `<path d="M38 78v10M50 78v10M34 88h8M46 88h8" stroke="#e8a060" stroke-width="3"/>` +
    `<path d="M14 56L6 52L10 62Z" fill="#8a5a2e"/>` +
    `<ellipse cx="40" cy="58" rx="30" ry="23" fill="#b8864e"/>` +
    `<path d="M22 50q4 4 8 0M36 44q4 4 8 0M30 60q4 4 8 0M46 56q4 4 8 0M24 70q4 4 8 0M40 70q4 4 8 0" stroke="#6b4228" stroke-width="2.5"/>` +
    `<path d="M18 46L34 40M52 64L62 58" stroke="#f4e4c4" stroke-width="3"/>` +
    `<circle cx="62" cy="36" r="12" fill="#9a6a3a"/>` +
    `<path d="M53 32C57 27 66 27 71 31" stroke="#f4e4c4" stroke-width="3.5"/>` +
    dot(64, 37, 2.5) +
    `<path d="M73 38L80 40L73 43Z" fill="#6b4228" stroke-width="2.5"/>`,

  구렁이:
    tube('M16 84C8 80 6 74 8 68', '#c8a04a', 6) +
    banded('M14 82C22 94 46 94 52 82C58 70 36 64 38 50C40 36 60 38 66 30', '#c8a04a', '#6b4a1e', 15, '4 10') +
    `<ellipse cx="73" cy="25" rx="13" ry="9.5" fill="#c8a04a" transform="rotate(-25 73 25)"/>` +
    dot(73, 21, 2.6) +
    `<path d="M76 30q5 1 8-3" stroke-width="2.5"/>` +
    `<circle cx="70" cy="29" r="3.5" fill="#ff9aa8" stroke="none" opacity=".6"/>`,

  도롱뇽:
    `<ellipse cx="50" cy="94" rx="30" ry="3" fill="#bfe6fa" stroke="none"/>` +
    tube('M42 38C32 34 26 30 22 22', '#8a6a3a', 6) +
    tube('M58 38C68 34 74 30 78 22', '#8a6a3a', 6) +
    tube('M43 60C33 64 27 70 23 78', '#8a6a3a', 6) +
    tube('M57 60C67 64 73 70 77 78', '#8a6a3a', 6) +
    [
      [22, 21],
      [78, 21],
      [23, 79],
      [77, 79],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#8a6a3a" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M42 62C42 80 36 88 20 93C40 94 58 84 58 62Z" fill="#8a6a3a"/>` +
    `<ellipse cx="50" cy="48" rx="12" ry="20" fill="#8a6a3a"/>` +
    `<ellipse cx="50" cy="22" rx="15" ry="11" fill="#8a6a3a"/>` +
    [
      [46, 40],
      [55, 46],
      [45, 54],
      [54, 60],
      [48, 72],
      [40, 84],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#4a3a20'))
      .join('') +
    eye(41, 16, 3.8, 2.2) +
    eye(59, 16, 3.8, 2.2) +
    `<path d="M43 26q7 4 14 0" stroke-width="2.5"/>`,

  맹꽁이:
    `<ellipse cx="50" cy="84" rx="44" ry="9" fill="#7ec8f0"/>` +
    `<ellipse cx="20" cy="78" rx="11" ry="6" fill="#b89a44"/><ellipse cx="80" cy="78" rx="11" ry="6" fill="#b89a44"/>` +
    `<ellipse cx="50" cy="56" rx="33" ry="28" fill="#c8a84a"/>` +
    [
      [28, 50, 5],
      [70, 44, 5],
      [36, 70, 4],
      [72, 64, 5],
      [52, 36, 3.5],
    ]
      .map(([x, y, r]) => dot(x, y, r, '#6b7a3a'))
      .join('') +
    `<circle cx="38" cy="32" r="7" fill="#c8a84a"/><circle cx="62" cy="32" r="7" fill="#c8a84a"/>` +
    dot(38, 32, 3) +
    dot(62, 32, 3) +
    `<path d="M32 48q18 8 36 0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="66" rx="13" ry="10" fill="#f6efd0"/>` +
    `<ellipse cx="36" cy="83" rx="6" ry="3.5" fill="#b89a44"/><ellipse cx="64" cy="83" rx="6" ry="3.5" fill="#b89a44"/>` +
    drop(14, 10, 0.8) +
    drop(86, 12, 0.8),

  해삼:
    `<path d="M4 88C30 82 70 82 96 88V96H4Z" fill="#f2d49a"/>` +
    tube('M86 88C84 78 90 72 88 62', '#43b04a', 4) +
    [
      [16, 60],
      [26, 54],
      [37, 51],
      [48, 50],
      [59, 50],
      [70, 52],
      [80, 56],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#6b4a5a"/>`)
      .join('') +
    `<path d="M8 72C8 60 26 54 50 54C72 54 88 60 88 70C88 78 74 82 50 82C24 82 8 80 8 72Z" fill="#6b4a5a"/>` +
    [
      [20, 66],
      [32, 62],
      [45, 62],
      [58, 62],
      [72, 64],
      [28, 73],
      [52, 72],
      [66, 73],
      [40, 74],
    ]
      .map(([x, y]) => dot(x, y, 2.6, '#9a7688'))
      .join('') +
    `<path d="M88 64l5-3M89 70h5M88 76l5 3" stroke-width="3"/>` +
    `<circle cx="72" cy="32" r="3" fill="#dff3ff" stroke-width="2.5"/><circle cx="78" cy="22" r="4" fill="#dff3ff" stroke-width="2.5"/><circle cx="72" cy="12" r="3" fill="#dff3ff" stroke-width="2.5"/>`,
  멍게:
    `<path d="M14 94C16 84 30 80 50 80C70 80 84 84 86 94Z" fill="#8a96b0"/>` +
    [
      [24, 62],
      [25, 46],
      [33, 34],
      [76, 50],
      [77, 66],
      [71, 37],
      [26, 76],
      [74, 80],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e8553d"/>`)
      .join('') +
    `<path d="M40 30L37 16H50L49 30Z" fill="#ff7a4a"/>` +
    `<path d="M58 34L62 22L73 28L66 38Z" fill="#ff7a4a"/>` +
    `<path d="M30 86C20 70 22 42 40 30C46 26 58 26 64 32C80 44 80 70 70 86Z" fill="#e8553d"/>` +
    `<ellipse cx="43.5" cy="16" rx="6.5" ry="3" fill="#a8322a"/>` +
    `<ellipse cx="67.5" cy="25" rx="6" ry="3" fill="#a8322a" transform="rotate(28 67.5 25)"/>` +
    [
      [40, 46],
      [54, 42],
      [66, 52],
      [34, 60],
      [48, 58],
      [62, 66],
      [40, 74],
      [54, 76],
    ]
      .map(([x, y]) => dot(x, y, 3.2, '#ff9a7a'))
      .join(''),

  방아깨비:
    `<g transform="rotate(-28 50 54)">` +
    tube('M40 50L18 34', '#4caf50', 6) +
    tube('M18 34L10 58', '#4caf50', 3.5) +
    `<path d="M58 58L56 70M66 56L70 68" stroke-width="3"/>` +
    `<path d="M6 54C10 45 40 41 62 42L97 48L62 59C40 63 10 63 6 54Z" fill="#5fc24a"/>` +
    `<path d="M10 52C28 48 46 47 58 48" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M66 51L90 49" stroke="#ff9aa8" stroke-width="2.5"/>` +
    `<ellipse cx="74" cy="47" rx="3.8" ry="2.8" fill="#3a2a20"/>` +
    `<path d="M95 47L101 42M95 49L102 47" stroke-width="3"/>` +
    `</g>`,
  장수풍뎅이:
    tube('M24 68L16 86', '#3a2014', 4) +
    tube('M40 70L38 88', '#3a2014', 4) +
    tube('M60 66L68 86', '#3a2014', 4) +
    `<path d="M10 88h8M34 90h8M66 88h8" stroke-width="3"/>` +
    `<path d="M8 58C8 42 24 34 42 34C54 34 62 40 64 50V66C48 74 22 74 12 68C9 66 8 62 8 58Z" fill="#7a4428"/>` +
    `<path d="M12 54C28 50 48 50 62 54" stroke="#4a2a1a" stroke-width="2.5"/>` +
    `<path d="M20 42C28 38 38 38 44 40" stroke="#fff" stroke-width="3.5" opacity=".5"/>` +
    `<path d="M58 40C66 32 78 36 80 46L78 62L60 64Z" fill="#5a3020"/>` +
    `<path d="M68 36L86 28L78 42Z" fill="#5a3020"/>` +
    `<path d="M84 58C92 50 92 38 88 22L94 20L96 30C98 44 94 58 88 66Z" fill="#4a2a1a"/>` +
    `<path d="M88 22L85 15M94 20L96 13" stroke-width="4"/>` +
    `<ellipse cx="82" cy="62" rx="7" ry="6" fill="#4a2a1a"/>` +
    dot(82, 60, 1.8, '#fff'),

  소금쟁이:
    `<ellipse cx="50" cy="54" rx="46" ry="40" fill="#bfe6fa" stroke="none"/>` +
    [
      [12, 30],
      [88, 30],
      [16, 86],
      [84, 86],
      [36, 20],
      [64, 20],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" stroke="#3b8fe0" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M46 42C30 36 20 32 12 30M54 42C70 36 80 32 88 30" stroke-width="3"/>` +
    `<path d="M47 54C34 64 24 76 16 86M53 54C66 64 76 76 84 86" stroke-width="3"/>` +
    `<path d="M47 32L36 20M53 32L64 20" stroke-width="3"/>` +
    `<ellipse cx="50" cy="50" rx="5.5" ry="21" fill="#4a4050"/>` +
    `<circle cx="50" cy="28" r="5.5" fill="#4a4050"/>` +
    dot(47.5, 26, 1.5, '#fff') +
    dot(52.5, 26, 1.5, '#fff') +
    `<path d="M48 23L45 15M52 23L55 15" stroke-width="2.5"/>`,

  물방개:
    waveLine(8, '#7ec8f0', 3) +
    `<path d="M34 64C22 68 14 76 10 86L18 86C24 78 30 72 37 70Z" fill="#6b5a3a"/>` +
    `<path d="M66 64C78 68 86 76 90 86L82 86C76 78 70 72 63 70Z" fill="#6b5a3a"/>` +
    `<path d="M14 80l-4-2M18 76l-3-3M86 80l4-2M82 76l3-3" stroke-width="2.5"/>` +
    `<path d="M32 50L18 44M68 50L82 44" stroke-width="3"/>` +
    `<path d="M38 34L28 26M62 34L72 26" stroke-width="3"/>` +
    `<ellipse cx="50" cy="54" rx="22" ry="30" fill="#e8c040"/>` +
    `<ellipse cx="50" cy="56" rx="17" ry="25" fill="#2f3a2a" stroke="none"/>` +
    `<path d="M50 42V80" stroke="#1a2418" stroke-width="2.5"/>` +
    `<path d="M33 42C42 38 58 38 67 42" stroke="#e8c040" stroke-width="3"/>` +
    `<path d="M42 50C44 46 46 44 48 44" stroke="#fff" stroke-width="3" opacity=".5"/>` +
    `<path d="M38 28C40 20 60 20 62 28Z" fill="#2f3a2a"/>` +
    dot(44, 25, 1.8, '#fff') +
    dot(56, 25, 1.8, '#fff') +
    `<circle cx="50" cy="90" r="4" fill="#dff3ff" stroke-width="2.5"/>`,

  누에:
    `<path d="M6 82C10 52 44 40 76 52C70 78 42 94 6 82Z" fill="#5fc24a"/>` +
    `<path d="M8 82C30 72 52 60 74 53" stroke="#3a9e47" stroke-width="3"/>` +
    [
      [18, 74, 8],
      [28, 71, 9.5],
      [39, 67, 10.5],
      [50, 62, 10.5],
      [59, 54, 10],
      [65, 45, 9.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f6f2e6"/>`)
      .join('') +
    `<circle cx="70" cy="35" r="9.5" fill="#f6f2e6"/>` +
    `<path d="M36 63q3-3 6 0M47 58q3-3 6 0" stroke="#b8a888" stroke-width="2.5"/>` +
    dot(73, 32, 2.3) +
    `<path d="M73 40q3 1 5-2" stroke-width="2"/>` +
    `<ellipse cx="83" cy="80" rx="12" ry="8.5" fill="#fff" transform="rotate(-20 83 80)"/>` +
    `<path d="M73 81q10 1 19-6M75 86q9-4 17-7" stroke="#d8d0c0" stroke-width="2.2"/>`,
  당나귀:
    `<path d="M16 50C10 56 10 64 12 72" stroke-width="3"/>` +
    `<ellipse cx="12" cy="74" rx="3.5" ry="5" fill="#3a3540"/>` +
    legs([22, 30], 62, 7, 26, '#8a8690', '#3a3540') +
    legs([54, 62], 62, 7, 26, '#8a8690', '#3a3540') +
    `<ellipse cx="42" cy="58" rx="28" ry="14" fill="#9a96a0"/>` +
    `<path d="M26 67C36 72 50 72 60 67" stroke="#dcd8d0" stroke-width="4"/>` +
    `<path d="M56 52L64 34L76 38L70 62Z" fill="#9a96a0"/>` +
    `<path d="M59 46L66 31" stroke="#3a3540" stroke-width="5"/>` +
    `<path d="M67 31C62 20 62 9 66 4C71 8 73 18 72 31Z" fill="#9a96a0"/>` +
    `<path d="M73 32C75 20 80 11 85 9C87 16 83 25 78 34Z" fill="#9a96a0"/>` +
    `<path d="M67 26C66 20 66 14 67 10M76 28C78 22 80 18 82 15" stroke="#3a3540" stroke-width="2.5"/>` +
    `<path d="M64 34C68 28 78 28 82 34L92 48C94 54 88 58 82 56L68 44Z" fill="#9a96a0"/>` +
    `<path d="M84 42L92 48C94 54 88 58 82 56C80 50 80 46 84 42Z" fill="#eceae4"/>` +
    eye(75, 39, 3.6, 2) +
    dot(89, 51, 1.5),

  조랑말:
    blob('#f4dca4', [
      [16, 58, 6],
      [12, 68, 6],
      [13, 78, 5],
    ]) +
    legs([24, 34], 64, 10, 20, '#9a5b2e', '#3a2a20') +
    legs([56, 66], 64, 10, 20, '#9a5b2e', '#3a2a20') +
    `<ellipse cx="44" cy="58" rx="29" ry="16" fill="#b8783e"/>` +
    `<path d="M58 52L62 32L78 34L76 62Z" fill="#b8783e"/>` +
    `<path d="M64 30L64 20L72 26Z" fill="#b8783e"/>` +
    `<path d="M60 32C62 22 76 20 82 28L92 42C94 50 88 54 80 52L66 46Z" fill="#b8783e"/>` +
    `<path d="M84 38L92 42C94 50 88 54 80 52C80 46 81 41 84 38Z" fill="#8a5a36"/>` +
    blob('#f4dca4', [
      [60, 30, 6],
      [57, 39, 6],
      [56, 48, 5.5],
      [70, 25, 5],
    ]) +
    eye(74, 36, 4, 2.4) +
    dot(89, 47, 1.5),

  산양:
    `<path d="M6 96L24 72L40 78L54 66L68 74L94 96Z" fill="#c0c4d0"/>` +
    `<path d="M24 86L34 80M58 84L66 78" stroke="#7a8090" stroke-width="3"/>` +
    legs([28, 36], 50, 6, 26, '#6b5e52', '#2f2a33') +
    legs([54, 62], 48, 6, 24, '#6b5e52', '#2f2a33') +
    `<path d="M24 46l-6-2l4 7z" fill="#2f2a33"/>` +
    `<ellipse cx="44" cy="46" rx="24" ry="13" fill="#8a7a6a"/>` +
    `<path d="M22 44C30 38 50 36 62 38" stroke="#2f2a33" stroke-width="3"/>` +
    `<path d="M68 28C66 15 58 8 49 8C54 13 58 20 62 30Z" fill="#2f2a33"/>` +
    `<path d="M75 26C75 14 70 7 62 5C66 11 69 18 70 28Z" fill="#3a3540"/>` +
    `<path d="M60 42L66 26C72 21 82 24 82 32L80 44L66 50Z" fill="#8a7a6a"/>` +
    `<path d="M64 30L56 28L63 35Z" fill="#8a7a6a"/>` +
    `<path d="M68 42C72 46 77 46 80 42L78 50L68 50Z" fill="#fff"/>` +
    dot(73, 31, 2.4) +
    dot(81, 40, 1.6),

  진돗개:
    legs([24, 32], 58, 7, 30, '#e0a860') +
    legs([56, 64], 58, 7, 30, '#e0a860') +
    tube('M20 48C8 40 12 24 24 28C30 30 29 38 23 38', '#e0a860', 9) +
    `<ellipse cx="42" cy="54" rx="26" ry="13" fill="#e0a860"/>` +
    `<path d="M58 44L64 30L78 36L70 56Z" fill="#e0a860"/>` +
    `<path d="M58 46C66 48 70 58 66 66C62 62 58 56 58 46Z" fill="#f8e8c8"/>` +
    `<path d="M60 26L62 9L71 22Z" fill="#e0a860"/><path d="M71 22L77 7L81 24Z" fill="#e0a860"/>` +
    `<path d="M62.5 21L63 14L67 20ZM75 21L77 14L78.5 21Z" fill="#ff9aa8" stroke="none"/>` +
    `<circle cx="70" cy="34" r="13" fill="#e0a860"/>` +
    `<path d="M76 32C84 32 92 36 92 41C92 47 84 48 77 46Z" fill="#f8e8c8"/>` +
    dot(72, 31, 2.8) +
    dot(91, 39, 3) +
    `<path d="M80 46q5 2 9-1" stroke-width="2.2"/>`,

  삽살개:
    blob('#c8a060', [
      [50, 70, 26],
      [32, 80, 12],
      [68, 80, 12],
      [50, 86, 12],
    ]) +
    `<path d="M40 70q-2 6 0 10M60 70q2 6 0 10M50 76q-2 6 0 10M30 78q-2 5 0 8M70 78q2 5 0 8" stroke="#a07a44" stroke-width="3"/>` +
    `<ellipse cx="38" cy="91" rx="9" ry="4.5" fill="#c8a060"/><ellipse cx="62" cy="91" rx="9" ry="4.5" fill="#c8a060"/>` +
    blob('#a07a44', [
      [24, 42, 10],
      [22, 56, 9],
      [76, 42, 10],
      [78, 56, 9],
    ]) +
    blob('#c8a060', [
      [50, 40, 22],
      [36, 28, 10],
      [64, 28, 10],
      [50, 20, 12],
    ]) +
    `<path d="M29 40C33 29 44 30 50 34C56 30 67 29 71 40C66 45 58 43 50 45C42 43 34 45 29 40Z" fill="#a07a44"/>` +
    `<path d="M36 38l-1 5M44 38l-1 6M56 38l1 6M64 38l1 5" stroke="#7a5a30" stroke-width="2.5"/>` +
    blob('#e0c48a', [
      [44, 54, 7],
      [56, 54, 7],
    ]) +
    `<ellipse cx="50" cy="50" rx="6" ry="4.5" fill="${INK}"/>` +
    `<path d="M47 60q3 7 6 0Z" fill="#ff7a8a" stroke-width="2.5"/>`,

  불곰:
    water(84) +
    legs([20, 32], 60, 11, 26, '#7a4a28') +
    legs([58, 70], 60, 11, 26, '#7a4a28') +
    `<path d="M12 60C12 44 24 36 40 36C48 36 54 28 62 28C74 28 80 38 80 50L78 72C60 78 30 78 18 72C14 68 12 64 12 60Z" fill="#8a5a36"/>` +
    `<path d="M50 34q-3 5 0 9M60 32q-3 5 0 9" stroke="#6b4228" stroke-width="2.5"/>` +
    `<circle cx="73" cy="38" r="5.5" fill="#8a5a36"/>` +
    `<circle cx="80" cy="50" r="14" fill="#8a5a36"/>` +
    `<ellipse cx="90" cy="56" rx="7.5" ry="6.5" fill="#c9a070"/>` +
    dot(81, 46, 2.6) +
    dot(94, 54, 2.8) +
    `<path d="M86 61q4 3 8 0" stroke-width="2.2"/>` +
    waveLine(90),

  반달곰:
    `<ellipse cx="34" cy="90" rx="11" ry="6" fill="#2f2a33"/><ellipse cx="66" cy="90" rx="11" ry="6" fill="#2f2a33"/>` +
    `<path d="M20 90C16 66 30 52 50 52C70 52 84 66 80 90Z" fill="#2f2a33"/>` +
    `<path d="M26 58C35 73 45 77 50 77C55 77 65 73 74 58C64 65 57 67 50 67C43 67 36 65 26 58Z" fill="#fff"/>` +
    `<circle cx="28" cy="18" r="9" fill="#2f2a33"/><circle cx="72" cy="18" r="9" fill="#2f2a33"/>` +
    `<circle cx="50" cy="36" r="23" fill="#2f2a33"/>` +
    `<ellipse cx="50" cy="45" rx="11" ry="8" fill="#c9a070"/>` +
    `<ellipse cx="50" cy="41.5" rx="4.5" ry="3.2" fill="${INK}"/>` +
    `<path d="M46 48q4 3 8 0" stroke-width="2.2"/>` +
    eye(40, 31, 3.4, 2) +
    eye(60, 31, 3.4, 2),

  흰동가리:
    [14, 26, 38, 50, 62, 74, 86]
      .map((x, i) => tube(`M${x} 95C${x - 4} 88 ${x + 4} ${84 - (i % 2) * 4} ${x} ${78 - (i % 2) * 4}`, '#ff9aa8', 5))
      .join('') +
    `<path d="M22 50L8 36C5 45 5 55 8 64Z" fill="#ff9f1a"/>` +
    `<path d="M40 34C46 22 60 24 64 34Z" fill="#ff9f1a"/>` +
    `<path d="M44 66C48 76 58 76 60 66Z" fill="#ff9f1a"/>` +
    `<ellipse cx="52" cy="50" rx="32" ry="18" fill="#ff8a1a"/>` +
    [
      'M28 38.4Q31 50 28 61.6',
      'M50 32.2Q55 50 50 67.8',
      'M70 35.2Q74 50 70 64.8',
    ]
      .map((d) => `<path d="${d}" stroke="${INK}" stroke-width="10" stroke-linecap="butt"/><path d="${d}" stroke="#fff" stroke-width="5.5" stroke-linecap="butt"/>`)
      .join('') +
    `<ellipse cx="52" cy="50" rx="32" ry="18"/>` +
    eye(78, 46, 4.5, 2.6) +
    `<path d="M80 56q4 2 6-1" stroke-width="2.5"/>`,

  가시고기:
    [16, 30, 70, 84].map((x) => tube(`M${x} 95C${x - 5} 86 ${x + 5} 80 ${x} 70`, '#5fa84a', 4)).join('') +
    `<path d="M18 50L6 40L8 50L6 60Z" fill="#8ab070"/>` +
    `<path d="M40 38L38 14L48 36Z" fill="#dfe8f5"/>` +
    `<path d="M54 36L54 16L62 36Z" fill="#dfe8f5"/>` +
    `<path d="M66 38L69 24L73 40Z" fill="#dfe8f5"/>` +
    `<path d="M56 60L50 78L62 62Z" fill="#dfe8f5"/>` +
    `<path d="M14 50C28 36 60 32 80 42C88 46 90 50 86 54C74 64 38 66 22 56L14 50Z" fill="#8ab070"/>` +
    `<path d="M56 58C68 60 80 58 86 54C80 62 66 64 56 60Z" fill="#e8553d"/>` +
    `<path d="M24 50h6M34 52h6M44 52h6" stroke="#6a9050" stroke-width="2.5"/>` +
    `<circle cx="76" cy="45" r="5" fill="#fff"/>` +
    dot(76.5, 45.3, 2.8, '#3b78e6') +
    dot(76.5, 45.3, 1.3),

  날치:
    water(80) +
    drop(20, 66, 0.8) +
    drop(30, 72, 0.6) +
    `<g transform="rotate(-14 50 50)">` +
    `<path d="M44 44C40 26 52 12 72 8C64 22 60 34 56 44Z" fill="#9ad0f0"/>` +
    `<path d="M48 42L60 16M52 44L66 12" stroke="#5aa0d0" stroke-width="2.5"/>` +
    `<path d="M18 50L6 40L10 50L4 64Z" fill="#3b78e6"/>` +
    `<path d="M14 50C28 42 60 40 82 46C88 48 88 52 82 54C60 60 28 58 14 50Z" fill="#3b78e6"/>` +
    `<path d="M24 54C40 58 64 58 82 54C70 60 40 61 24 54Z" fill="#dfe8f5"/>` +
    `<path d="M46 52C40 66 44 78 58 84C58 70 60 60 60 52Z" fill="#9ad0f0"/>` +
    eye(76, 48, 3.5, 2) +
    `</g>`,

  개복치:
    `<path d="M26 30L30 6L44 26Z" fill="#9aa6c4"/>` +
    `<path d="M26 70L30 94L44 74Z" fill="#9aa6c4"/>` +
    `<path d="M22 26C12 30 14 38 9 44C13 48 9 54 11 58C9 62 13 68 22 74Z" fill="#9aa6c4"/>` +
    `<ellipse cx="52" cy="50" rx="34" ry="28" fill="#c8d2e4"/>` +
    `<path d="M60 52C66 48 72 52 70 58C66 60 62 58 60 52Z" fill="#9aa6c4"/>` +
    `<path d="M30 40q4 4 0 8M36 56q4 4 0 8" stroke="#9aa6c4" stroke-width="2.5"/>` +
    eye(74, 42, 5, 2.8) +
    `<ellipse cx="85" cy="53" rx="2.5" ry="3" fill="#6a7a98"/>` +
    cheeks(52, 0, 76),

  물총새:
    water(84) +
    tube('M6 70L62 66', '#9a5b2e', 6) +
    `<path d="M30 60L20 80L32 78L37 64Z" fill="#1a7aa8"/>` +
    `<path d="M26 52C26 38 40 30 54 32C64 34 66 44 64 52C60 62 48 66 38 64C30 62 26 58 26 52Z" fill="#2eaad8"/>` +
    `<path d="M38 64C50 66 60 60 64 50C64 44 62 40 58 38C60 50 52 60 38 64Z" fill="#ff9f1a"/>` +
    `<path d="M28 48C36 42 48 44 52 52C46 58 34 58 28 48Z" fill="#1a7aa8"/>` +
    dot(36, 49, 1.6, '#7ee0f0') +
    dot(42, 51, 1.6, '#7ee0f0') +
    `<path d="M42 64v4M50 63v4" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="58" cy="30" r="12" fill="#2eaad8"/>` +
    `<path d="M50 34C54 40 64 42 70 36C64 36 56 36 50 34Z" fill="#ff9f1a"/>` +
    `<path d="M62 40C64 43 68 43 70 39Z" fill="#fff" stroke-width="2"/>` +
    `<path d="M68 27L95 31L68 35Z" fill="#2f2a33"/>` +
    dot(62, 27, 2.5),

  사막여우:
    `<path d="M4 96V84C30 76 60 78 96 86V96Z" fill="#f2c97a"/>` +
    tube('M66 88C82 90 90 80 86 70', '#f0d8a8', 8) +
    `<circle cx="86" cy="68" r="4" fill="#5a3b24"/>` +
    `<path d="M30 92C26 72 36 60 50 60C64 60 74 72 70 92Z" fill="#f0d8a8"/>` +
    `<path d="M42 92C42 80 46 72 50 72C54 72 58 80 58 92" fill="#fff6e4" stroke="none"/>` +
    `<path d="M38 46C22 38 10 22 11 5C27 9 44 24 48 36Z" fill="#f0d8a8"/><path d="M62 46C78 38 90 22 89 5C73 9 56 24 52 36Z" fill="#f0d8a8"/>` +
    `<path d="M38 39C28 32 20 22 18 13C28 17 38 26 42 34Z" fill="#ffc8b8" stroke="none"/><path d="M62 39C72 32 80 22 82 13C72 17 62 26 58 34Z" fill="#ffc8b8" stroke="none"/>` +
    `<path d="M33 42C33 30 67 30 67 42C67 54 58 62 50 64C42 62 33 54 33 42Z" fill="#f0d8a8"/>` +
    dot(42, 44, 3) +
    dot(58, 44, 3) +
    dot(50, 57, 2.8) +
    cheeks(52, 13),

  북극여우:
    `<path d="M4 96V84C30 78 70 78 96 84V96Z" fill="#e8f4fc"/>` +
    flake(14, 16) +
    flake(86, 14) +
    flake(10, 50, 3) +
    blob('#fff', [
      [72, 84, 9],
      [82, 76, 9],
      [86, 64, 8],
    ]) +
    `<path d="M28 90C24 70 34 56 50 56C66 56 74 70 72 90Z" fill="#fff"/>` +
    `<path d="M44 70q-2 5 0 9M56 70q2 5 0 9" stroke="#b8c8dc" stroke-width="2.5"/>` +
    `<path d="M33 32L30 13L46 24Z" fill="#fff"/><path d="M67 32L70 13L54 24Z" fill="#fff"/>` +
    `<path d="M34 27L33 18L41 24Z" fill="#b8c8dc" stroke="none"/><path d="M66 27L67 18L59 24Z" fill="#b8c8dc" stroke="none"/>` +
    blob('#fff', [
      [50, 38, 17],
      [35, 46, 8],
      [65, 46, 8],
      [50, 50, 10],
    ]) +
    dot(43, 38, 2.8) +
    dot(57, 38, 2.8) +
    dot(50, 47, 2.8) +
    cheeks(46, 12),

  코요테:
    `<path d="M4 96V88C30 84 70 84 96 88V96Z" fill="#f2c97a"/>` +
    `<circle cx="18" cy="16" r="10" fill="#ffe89a"/>` +
    `<path d="M14 90V56M14 70C8 70 6 66 6 60M14 64C20 64 22 58 22 54" stroke-width="10"/>` +
    `<path d="M14 90V56M14 70C8 70 6 66 6 60M14 64C20 64 22 58 22 54" stroke="#43b04a" stroke-width="4"/>` +
    legs([36, 44], 60, 6, 28, '#b8946a', '#6b4a2a') +
    legs([64, 72], 58, 6, 30, '#b8946a', '#6b4a2a') +
    `<path d="M34 54C24 58 20 70 22 82C28 78 34 70 38 62Z" fill="#b89a78"/>` +
    `<path d="M22 82C21 78 22 74 23 72L28 76Z" fill="#3a2a20" stroke-width="2.5"/>` +
    `<ellipse cx="54" cy="57" rx="22" ry="11" fill="#c8a47a"/>` +
    `<path d="M64 54L70 38L82 42L78 62Z" fill="#c8a47a"/>` +
    `<path d="M68 58C72 50 76 46 80 44L80 62C76 64 70 62 68 58Z" fill="#f4e4c8"/>` +
    `<path d="M70 38L69 20L80 32Z" fill="#c8a47a"/>` +
    `<path d="M71.5 33L71 25L76 31Z" fill="#8a6a4a" stroke="none"/>` +
    `<path d="M68 40C68 30 78 27 84 31L95 40C96 44 92 46 88 46L74 48C70 46 68 44 68 40Z" fill="#c8a47a"/>` +
    `<path d="M82 45C86 47 91 47 94 44" stroke="#f4e4c8" stroke-width="2.5"/>` +
    dot(94.5, 40.5, 2.2) +
    dot(79, 36, 2.4),

  몽구스:
    `<g transform="translate(-6 -12) scale(1.12)">` +
    `<path d="M20 60C12 62 6 70 5 82C10 76 16 70 24 67Z" fill="#9a8a70"/>` +
    legs([28, 36, 58, 66], 62, 6, 18, '#6b5a48') +
    `<path d="M18 62C18 52 30 48 46 48C60 48 70 50 74 56L72 66C60 70 30 70 22 68C19 66 18 64 18 62Z" fill="#a8987c"/>` +
    `<path d="M30 50v10M38 49v11M46 48v11M54 49v11M62 50v10" stroke="#5a4a38" stroke-width="3.5"/>` +
    `<circle cx="72" cy="45" r="4.5" fill="#a8987c"/>` +
    `<path d="M66 50C70 42 80 42 86 48L95 56C95 60 90 62 86 60L70 60Z" fill="#a8987c"/>` +
    dot(94, 57, 2) +
    dot(79, 49, 2.5) +
    `</g>`,

  안경원숭이:
    tube('M24 4V96', '#9a5b2e', 9) +
    tube('M44 76C34 78 32 88 36 92', '#b8987a', 6) +
    `<ellipse cx="46" cy="66" rx="15" ry="19" fill="#b8987a"/>` +
    tube('M52 82C58 88 60 92 66 94', '#b8987a', 3) +
    tube('M38 58L28 52', '#b8987a', 5) +
    `<circle cx="27" cy="52" r="3.5" fill="#d8b89a" stroke-width="2.5"/><circle cx="28" cy="46" r="3" fill="#d8b89a" stroke-width="2.5"/>` +
    `<circle cx="34" cy="92" r="3.5" fill="#d8b89a" stroke-width="2.5"/><circle cx="29" cy="88" r="3" fill="#d8b89a" stroke-width="2.5"/>` +
    `<circle cx="41" cy="20" r="7" fill="#b8987a"/><circle cx="77" cy="20" r="7" fill="#b8987a"/>` +
    `<circle cx="59" cy="38" r="21" fill="#b8987a"/>` +
    `<circle cx="50" cy="37" r="9.5" fill="#f2c14e"/><circle cx="68" cy="37" r="9.5" fill="#f2c14e"/>` +
    dot(50, 37, 5.5) +
    dot(68, 37, 5.5) +
    dot(52, 34.5, 1.6, '#fff') +
    dot(70, 34.5, 1.6, '#fff') +
    dot(59, 49, 1.5) +
    `<path d="M55 53q4 3 8 0" stroke-width="2.2"/>`,

  여우원숭이:
    banded('M62 84C82 82 88 62 80 46C74 32 78 16 88 8', '#fff', '#2f2a33', 9, '6 6') +
    `<path d="M28 92C24 70 34 58 50 58C64 58 72 70 70 92Z" fill="#a8a8b0"/>` +
    `<path d="M40 92C40 80 44 70 50 70C56 70 60 80 60 92Z" fill="#fff"/>` +
    `<ellipse cx="38" cy="92" rx="8" ry="4" fill="#2f2a33"/><ellipse cx="62" cy="92" rx="8" ry="4" fill="#2f2a33"/>` +
    `<path d="M30 30L28 14L42 22Z" fill="#a8a8b0"/><path d="M70 30L72 14L58 22Z" fill="#a8a8b0"/>` +
    `<path d="M30 30C30 20 70 20 70 30C70 44 58 56 50 58C42 56 30 44 30 30Z" fill="#fff"/>` +
    `<path d="M33 28C38 20 62 20 67 28C60 26 40 26 33 28Z" fill="#a8a8b0" stroke-width="2.5"/>` +
    `<path d="M35 33C37 29 46 29 47 35C47 41 40 44 35 33Z" fill="#2f2a33"/><path d="M65 33C63 29 54 29 53 35C53 41 60 44 65 33Z" fill="#2f2a33"/>` +
    `<circle cx="42" cy="35" r="3" fill="#ff9f1a" stroke="none"/><circle cx="58" cy="35" r="3" fill="#ff9f1a" stroke="none"/>` +
    dot(42, 35, 1.4) +
    dot(58, 35, 1.4) +
    `<path d="M45 47C45 43 55 43 55 47L50 57Z" fill="#2f2a33"/>`,

  레서판다:
    banded('M64 86C84 88 94 72 86 56', '#c8581e', '#f0b070', 12, '6 6') +
    `<path d="M28 92C24 70 34 58 50 58C66 58 76 70 72 92Z" fill="#c8581e"/>` +
    `<path d="M38 92C36 78 42 70 50 70C58 70 64 78 62 92Z" fill="#4a2a1e"/>` +
    `<ellipse cx="38" cy="92" rx="8" ry="4" fill="#4a2a1e"/><ellipse cx="62" cy="92" rx="8" ry="4" fill="#4a2a1e"/>` +
    `<path d="M29 34C23 22 29 12 41 17Z" fill="#fff"/><path d="M71 34C77 22 71 12 59 17Z" fill="#fff"/>` +
    `<path d="M31 29C29 22 32 18 38 20Z" fill="#4a2a1e" stroke="none"/><path d="M69 29C71 22 68 18 62 20Z" fill="#4a2a1e" stroke="none"/>` +
    `<ellipse cx="50" cy="38" rx="23" ry="19" fill="#c8581e"/>` +
    `<ellipse cx="40" cy="29" rx="4.5" ry="2.8" fill="#fff" stroke="none"/><ellipse cx="60" cy="29" rx="4.5" ry="2.8" fill="#fff" stroke="none"/>` +
    `<path d="M35 44C37 38 45 38 50 42C55 38 63 38 65 44C63 52 57 56 50 56C43 56 37 52 35 44Z" fill="#fff"/>` +
    `<path d="M41 37L39 47M59 37L61 47" stroke="#8a3a14" stroke-width="3"/>` +
    dot(41, 35, 2.8) +
    dot(59, 35, 2.8) +
    `<ellipse cx="50" cy="45" rx="4" ry="3" fill="${INK}"/>` +
    `<path d="M47 50q3 2 6 0" stroke-width="2"/>`,

  웜뱃:
    `<path d="M4 96V88C30 84 70 84 96 88V96Z" fill="#a8c860"/>` +
    legs([22, 34, 54, 66], 66, 11, 22, '#6b5a4a') +
    `<path d="M10 64C10 44 28 34 50 34C68 34 80 44 82 58L80 74C62 82 30 82 16 76C12 72 10 68 10 64Z" fill="#9a8570"/>` +
    `<path d="M24 50q4 3 0 7M36 44q4 3 0 7M46 56q4 3 0 7" stroke="#7a6550" stroke-width="2.5"/>` +
    `<circle cx="69" cy="38" r="5" fill="#9a8570"/><circle cx="81" cy="37" r="5" fill="#9a8570"/>` +
    `<circle cx="77" cy="54" r="16" fill="#9a8570"/>` +
    `<path d="M84 50C90 48 96 52 95 58C94 63 88 64 84 60Z" fill="#3a3030"/>` +
    dot(76, 48, 2.6) +
    `<path d="M82 66q4 2 7-1" stroke-width="2.2"/>` +
    `<circle cx="72" cy="58" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>`,

  주머니쥐:
    tube('M6 14H94', '#9a5b2e', 7) +
    tube('M52 42C52 30 46 22 50 14C54 8 62 12 58 18', '#ffb0b8', 4) +
    `<ellipse cx="52" cy="56" rx="16" ry="20" fill="#b8b8c0"/>` +
    tube('M42 42L32 34', '#b8b8c0', 5) +
    tube('M62 42L72 34', '#b8b8c0', 5) +
    `<circle cx="31" cy="33" r="3.5" fill="#ffb0b8" stroke-width="2.5"/><circle cx="73" cy="33" r="3.5" fill="#ffb0b8" stroke-width="2.5"/>` +
    tube('M40 66L32 76', '#b8b8c0', 5) +
    tube('M64 66L72 76', '#b8b8c0', 5) +
    `<circle cx="31" cy="77" r="3.5" fill="#ffb0b8" stroke-width="2.5"/><circle cx="73" cy="77" r="3.5" fill="#ffb0b8" stroke-width="2.5"/>` +
    `<circle cx="39" cy="72" r="6.5" fill="#2f2a33"/><circle cx="65" cy="72" r="6.5" fill="#2f2a33"/>` +
    `<path d="M38 72C38 66 66 66 66 72C66 81 58 91 52 94C46 91 38 81 38 72Z" fill="#fff"/>` +
    dot(46, 79, 2.4) +
    dot(58, 79, 2.4) +
    `<circle cx="52" cy="92" r="2.8" fill="#ff9aa8"/>` +
    cheeks(84, 11, 52),

  듀공:
    tube('M60 96C58 86 64 80 62 72', '#43b04a', 4) +
    tube('M72 96C70 88 76 82 74 76', '#43b04a', 4) +
    tube('M86 96C84 88 90 84 88 78', '#43b04a', 4) +
    `<path d="M4 94C20 90 40 90 96 94V96H4Z" fill="#f2d49a"/>` +
    `<path d="M18 46L4 34L8 48L4 62Z" fill="#9aa6b8"/>` +
    `<path d="M12 48C20 34 50 28 70 34C82 38 90 46 90 54C90 62 82 66 72 66C50 68 26 62 12 48Z" fill="#a8b0c0"/>` +
    `<path d="M54 60L46 74L62 64Z" fill="#9aa6b8"/>` +
    `<path d="M78 50C86 48 94 54 94 62C92 69 84 71 78 67Z" fill="#c8ccd6"/>` +
    dot(84, 58, 1.2) +
    dot(88, 61, 1.2) +
    dot(86, 64, 1.2) +
    dot(73, 44, 2.4),
};
