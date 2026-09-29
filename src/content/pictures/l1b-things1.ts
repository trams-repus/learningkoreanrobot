// 그림 묶음: 부엌·집안 물건·옷·신발 (l1b). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(병·물병 / 돈·동전 / 봉투·편지 / 전등·손전등 / 슬리퍼·샌들·부츠 / 셔츠·티셔츠 / 우비·코트)는 색·실루엣을 다르게 했다.
import { INK, HL, dot, sparkle, tube, drop, moodFace, cheeks } from '../pictureKit.ts';

const steam = (x: number, y: number) =>
  `<path d="M${x - 8} ${y}c-5-5 5-9 0-15M${x + 6} ${y - 2}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 동전 하나 (앞면) */
const coin = (x: number, y: number, r: number, fill = '#ffc933', inner = '#f2a900') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><circle cx="${x}" cy="${y}" r="${r * 0.66}" stroke="${inner}" stroke-width="3"/>` +
  `<path d="M${x - r * 0.45} ${y - r * 0.35}q${r * 0.2} ${-r * 0.3} ${r * 0.5} ${-r * 0.35}" stroke="#fff4b0" stroke-width="3"/>`;

/** 옆에서 본 동전 한 닢 (쌓기용) */
const coinSide = (x: number, y: number, w: number) =>
  `<path d="M${x - w} ${y}v6c0 4 ${w * 2} 4 ${w * 2} 0v-6" fill="#f2a900"/><ellipse cx="${x}" cy="${y}" rx="${w}" ry="4" fill="#ffc933"/>`;

/** 지폐 한 장 */
const bill = (t: string) =>
  `<g transform="${t}"><rect x="0" y="0" width="60" height="32" rx="3" fill="#7cc97a"/>` +
  `<rect x="5" y="5" width="50" height="22" rx="2" stroke="#3a9e47" stroke-width="2.5"/>` +
  `<circle cx="30" cy="16" r="7" fill="#b8e6b0" stroke="#3a9e47" stroke-width="2.5"/></g>`;

/** 슬리퍼 한 짝 (위에서 봄, 앞이 위) */
const slipper = (x: number, rot: number) =>
  `<g transform="translate(${x} 52) rotate(${rot})">` +
  `<path d="M0 -38C12 -38 16 -26 15 -12C14 4 12 20 12 28C12 38 -12 38 -12 28C-12 20 -14 4 -15 -12C-16 -26 -12 -38 0 -38Z" fill="#ffd23f"/>` +
  `<path d="M-16 -18C-16 -32 16 -32 16 -18L16 -8C8 -12 -8 -12 -16 -8Z" fill="#3b8fe0"/>` +
  `<path d="M-8 -22h16" stroke="#fff" stroke-width="3"/>` +
  `</g>`;

/** 부츠 한 짝 (목 긴 갈색, 오른쪽을 봄) */
const tallBoot = (t: string) =>
  `<g transform="${t}">` +
  `<path d="M0 0H26V48C26 52 30 54 38 56C48 58 52 62 52 70V76H0Z" fill="#9a5b2e"/>` +
  `<path d="M0 74H52V80H10V84H0Z" fill="#5a3b24"/>` +
  `<rect x="-3" y="-4" width="32" height="12" rx="5" fill="#f5e6c8"/>` +
  `<path d="M7 16V50" stroke="#c98b4f" stroke-width="4"/>` +
  `</g>`;

export const PICS: Record<string, string> = {
  국자:
    tube('M58 58L86 10', '#8a96b0', 6) +
    `<circle cx="86" cy="10" r="5" fill="#8a96b0"/>` +
    `<path d="M12 56C12 78 26 90 40 90S68 78 68 56Z" fill="#dfe8f5"/>` +
    `<ellipse cx="40" cy="56" rx="28" ry="9" fill="#e0a050"/>` +
    `<circle cx="32" cy="55" r="3.5" fill="#7cc242" stroke-width="2"/><rect x="44" y="52" width="7" height="6" rx="1" fill="#fffdf2" stroke-width="2"/>` +
    `<path d="M22 68C24 76 30 82 36 84" stroke="#fff" stroke-width="4"/>` +
    steam(40, 42),
  주전자:
    `<path d="M26 64L8 42L14 38L32 56Z" fill="#e8553d"/>` +
    `<path d="M5 42L12 34L17 39L10 46Z" fill="#c9412e"/>` +
    tube('M30 44C30 14 70 14 70 44', '#3b4a6b', 6) +
    `<path d="M18 86C14 62 28 42 50 42S86 62 82 86Z" fill="#e8553d"/>` +
    `<rect x="14" y="82" width="72" height="8" rx="4" fill="#c9412e"/>` +
    `<ellipse cx="50" cy="42" rx="16" ry="5" fill="#ff8a65"/><circle cx="50" cy="35" r="4.5" fill="#3b4a6b"/>` +
    `<path d="M30 60C28 66 28 72 29 78" stroke="#ff9a8a" stroke-width="4"/>` +
    `<path d="M8 30c-5-5 3-8-1-14M16 26c-5-5 3-8-1-14" stroke="#9aa6c4" stroke-width="3"/>`,
  프라이팬:
    tube('M74 56L96 50', '#5a3b24', 7) +
    `<path d="M6 52C6 72 20 80 40 80S74 72 74 52Z" fill="#30354f"/>` +
    `<ellipse cx="40" cy="52" rx="34" ry="20" fill="#4a5068"/>` +
    `<ellipse cx="40" cy="52" rx="27" ry="15" fill="#6a7390" stroke="none"/>` +
    `<path d="M24 52C22 42 34 38 42 42C52 38 60 46 56 54C58 62 46 66 38 62C28 64 22 58 24 52Z" fill="#fff"/>` +
    `<ellipse cx="41" cy="51" rx="8" ry="6" fill="${HL}"/><path d="M37 49q2-2 4-2" stroke="#fff4b0" stroke-width="2.5"/>` +
    `<path d="M20 26c-4-4 4-7 0-11M38 22c-4-4 4-7 0-11M56 26c-4-4 4-7 0-11" stroke="#9aa6c4" stroke-width="3"/>`,
  밥솥:
    `<rect x="14" y="46" width="72" height="42" rx="14" fill="#fff"/>` +
    `<path d="M16 52C16 30 30 24 50 24S84 30 84 52Z" fill="#ff9aa8"/>` +
    `<rect x="36" y="18" width="28" height="9" rx="4" fill="#e85d9a"/>` +
    `<rect x="30" y="58" width="40" height="20" rx="6" fill="#30354f"/>` +
    `<circle cx="42" cy="68" r="5" fill="#e8553d" stroke-width="2"/><circle cx="58" cy="68" r="3.5" fill="#5fc24a" stroke-width="2"/>` +
    `<path d="M22 64V78" stroke="#dfe8f5" stroke-width="4"/>` +
    `<rect x="18" y="86" width="12" height="6" rx="2" fill="#8a96b0"/><rect x="70" y="86" width="12" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M66 22c-4-4 4-7 0-11M76 24c-4-4 4-7 0-11" stroke="#9aa6c4" stroke-width="3"/>`,
  쟁반:
    `<ellipse cx="50" cy="72" rx="46" ry="18" fill="#9a5b2e"/>` +
    `<ellipse cx="50" cy="69" rx="38" ry="12" fill="#c98b4f"/>` +
    `<ellipse cx="10" cy="72" rx="3" ry="5" fill="#5a3b24" stroke="none"/><ellipse cx="90" cy="72" rx="3" ry="5" fill="#5a3b24" stroke="none"/>` +
    tube('M58 44C70 44 70 60 58 60', '#3b8fe0', 5) +
    `<path d="M34 34H60V64C60 70 56 72 50 72H44C38 72 34 70 34 64Z" fill="#3b8fe0"/>` +
    `<ellipse cx="47" cy="34" rx="13" ry="4" fill="#2a6fc4"/>` +
    `<path d="M39 42V64" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M42 26c-3-3 3-6 0-9M52 26c-3-3 3-6 0-9" stroke="#9aa6c4" stroke-width="3"/>`,
  병:
    `<rect x="42" y="6" width="16" height="12" rx="3" fill="#c98b4f"/>` +
    `<path d="M44 18V30C44 36 30 40 30 52V84C30 90 34 92 40 92H60C66 92 70 90 70 84V52C70 40 56 36 56 30V18Z" fill="#aee0c0"/>` +
    `<path d="M44 20H56" stroke-width="3"/>` +
    `<path d="M38 54V82" stroke="#fff" stroke-width="5"/><path d="M47 30V36" stroke="#fff" stroke-width="3"/>` +
    sparkle(80, 30, 7) +
    sparkle(20, 70, 5),
  물병:
    `<path d="M40 22C40 10 60 10 60 22" stroke-width="9"/><path d="M40 22C40 10 60 10 60 22" stroke="#43b04a" stroke-width="3"/>` +
    `<rect x="34" y="18" width="32" height="14" rx="4" fill="#43b04a"/>` +
    `<rect x="28" y="30" width="44" height="62" rx="12" fill="#dff4ff"/>` +
    `<path d="M29 52H71V80C71 86 66 91 60 91H40C34 91 29 86 29 80Z" fill="#7ec8f0" stroke="none"/><path d="M29 52H71"/>` +
    `<rect x="28" y="30" width="44" height="62" rx="12"/>` +
    `<path d="M36 38V48M36 58V80" stroke="#fff" stroke-width="4"/>` +
    drop(56, 60, 1.2),
  빨대:
    `<path d="M50 72V34L68 10" stroke-width="12"/>` +
    `<path d="M50 72V34L68 10" stroke="#fff" stroke-width="6"/>` +
    `<path d="M50 72V34L68 10" stroke="#e8553d" stroke-width="6" stroke-dasharray="6 6" stroke-linecap="butt"/>` +
    `<path d="M24 50L30 92H70L76 50Z" fill="#f4fbff"/>` +
    `<path d="M26 60L31 90H69L74 60Z" fill="#a45cf0" stroke="none"/><path d="M26 60H74"/>` +
    `<path d="M24 50L30 92H70L76 50Z"/>` +
    `<path d="M50 60V72" stroke-width="12" stroke="${INK}"/><path d="M50 60V72" stroke="#fff" stroke-width="6"/>` +
    `<path d="M34 64L36 84" stroke="#d6b5ff" stroke-width="4"/>` +
    dot(60, 72, 2.5, '#fff') +
    dot(64, 80, 2, '#fff'),
  휴지:
    `<path d="M44 60H84V88L80 84L76 88L72 84L68 88L64 84L60 88L56 84L52 88L48 84L44 88Z" fill="#fff"/>` +
    `<path d="M46 74H82" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="3 4"/>` +
    `<path d="M26 14H74A14 24 0 0 1 74 62H26Z" fill="#fff"/>` +
    `<ellipse cx="26" cy="38" rx="14" ry="24" fill="#eef3fb"/>` +
    `<ellipse cx="26" cy="38" rx="6" ry="10" fill="#c98b4f"/>` +
    `<path d="M40 22H70M40 54H70" stroke="#dfe8f5" stroke-width="3"/>` +
    dot(54, 38, 2.5, '#8fd3ff') +
    dot(66, 32, 2.5, '#8fd3ff') +
    dot(64, 46, 2.5, '#8fd3ff'),
  봉투:
    `<rect x="8" y="24" width="84" height="56" rx="4" fill="#fff"/>` +
    `<path d="M8 76L42 50M92 76L58 50" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M10 26L50 56L90 26" fill="#f5f0e0"/>` +
    `<rect x="70" y="30" width="14" height="16" rx="1" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<circle cx="50" cy="56" r="7" fill="#e8553d"/>`,
  쓰레기통:
    `<path d="M22 32L28 90H72L78 32Z" fill="#43b04a"/>` +
    `<path d="M38 40L40 82M50 40V82M62 40L60 82" stroke="#2f7f38" stroke-width="3.5"/>` +
    `<rect x="16" y="24" width="68" height="10" rx="4" fill="#3a9e47"/>` +
    `<path d="M20 24C20 12 80 12 80 24Z" fill="#5fc24a"/>` +
    `<rect x="42" y="8" width="16" height="8" rx="4" fill="#2f7f38"/>` +
    `<path d="M30 40L34 80" stroke="#8fd98a" stroke-width="4"/>`,
  빗자루:
    tube('M76 8L50 58', '#c98b4f', 6) +
    `<path d="M44 52L60 60L52 76Z" fill="#e8553d"/>` +
    `<path d="M40 58L60 68L50 96L10 78Z" fill="#f2c14e"/>` +
    `<path d="M44 66L28 86M50 70L36 92M36 64L18 80" stroke="#c99a2e" stroke-width="3"/>` +
    `<path d="M42 62L60 71" stroke="#e8553d" stroke-width="5"/>` +
    dot(76, 88, 2.5, '#9aa6c4') +
    dot(84, 84, 2, '#9aa6c4') +
    dot(70, 92, 2, '#9aa6c4'),
  양동이:
    `<path d="M16 38C16 4 84 4 84 38" stroke-width="5"/>` +
    `<path d="M18 38L26 88H74L82 38Z" fill="#3b8fe0"/>` +
    `<ellipse cx="50" cy="38" rx="32" ry="9" fill="#7ec8f0"/>` +
    `<path d="M22 58Q50 66 78 58" stroke="#2a6fc4" stroke-width="3.5"/>` +
    `<path d="M28 48L32 82" stroke="#bfe6ff" stroke-width="4"/>` +
    `<circle cx="18" cy="40" r="4" fill="#8a96b0"/><circle cx="82" cy="40" r="4" fill="#8a96b0"/>`,
  바가지:
    `<g transform="rotate(-18 50 50)">` +
    `<path d="M10 44C10 76 30 88 50 88S90 76 90 44Z" fill="#e8c870"/>` +
    `<ellipse cx="50" cy="44" rx="40" ry="14" fill="#fff4d0"/>` +
    `<ellipse cx="50" cy="46" rx="31" ry="9" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M24 58C28 72 38 80 48 82" stroke="#fff4b0" stroke-width="4"/>` +
    `<path d="M50 88v5" stroke="#9a5b2e" stroke-width="5"/>` +
    `</g>` +
    drop(88, 60, 1) +
    drop(92, 78, 0.8),
  샴푸:
    `<path d="M44 20H74V28H70" stroke-width="10"/><path d="M44 20H74V28" stroke="#fff" stroke-width="4"/>` +
    `<rect x="42" y="14" width="10" height="16" rx="2" fill="#fff"/>` +
    `<rect x="36" y="28" width="22" height="10" rx="3" fill="#8e4fc9"/>` +
    `<path d="M22 50C22 40 30 36 47 36S72 40 72 50V84C72 90 68 92 62 92H32C26 92 22 90 22 84Z" fill="#a45cf0"/>` +
    `<rect x="30" y="54" width="34" height="24" rx="5" fill="#fff"/>` +
    `<path d="M47 60C42 60 38 64 40 70C41 72 44 73 47 73C51 73 54 70 54 66C54 62 50 60 47 60Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M28 58V84" stroke="#d6b5ff" stroke-width="4"/>` +
    `<g fill="#eaf6ff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="16" cy="30" r="8"/><circle cx="12" cy="46" r="5"/><circle cx="82" cy="46" r="7"/><circle cx="88" cy="62" r="5"/><circle cx="24" cy="16" r="4"/></g>`,
  반창고:
    `<g transform="rotate(-35 50 50)">` +
    `<rect x="4" y="34" width="92" height="32" rx="16" fill="#f0c090"/>` +
    `<rect x="36" y="36" width="28" height="28" rx="4" fill="#fbe3c6"/>` +
    [
      [16, 44],
      [24, 50],
      [16, 56],
      [84, 44],
      [76, 50],
      [84, 56],
      [44, 44],
      [56, 44],
      [44, 56],
      [56, 56],
      [50, 50],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#c98b4f'))
      .join('') +
    `</g>`,
  체온계:
    `<g transform="rotate(40 50 50)">` +
    `<rect x="41" y="4" width="18" height="74" rx="9" fill="#f4fbff"/>` +
    `<circle cx="50" cy="82" r="12" fill="#e8553d"/>` +
    `<path d="M50 78V36" stroke="${INK}" stroke-width="10"/><path d="M50 78V36" stroke="#e8553d" stroke-width="5"/>` +
    `<circle cx="50" cy="82" r="12" fill="#e8553d"/>` +
    `<path d="M59 18h-5M59 28h-5M59 38h-5M59 48h-5M59 58h-5" stroke-width="2.5"/>` +
    `<path d="M45 12V24" stroke="#fff" stroke-width="3"/><circle cx="46" cy="78" r="3" fill="#ff9a8a" stroke="none"/>` +
    `</g>`,
  약:
    `<rect x="16" y="12" width="40" height="14" rx="4" fill="#fff"/>` +
    `<path d="M18 26H54V84C54 88 52 90 48 90H24C20 90 18 88 18 84Z" fill="#ff9f1a"/>` +
    `<rect x="22" y="40" width="28" height="30" rx="4" fill="#fff"/>` +
    `<path d="M36 46V64M27 55H45" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M22 30V36" stroke="#ffc97a" stroke-width="3"/>` +
    `<g transform="rotate(-30 76 46)"><rect x="62" y="38" width="28" height="16" rx="8" fill="#fff"/><path d="M76 38V54H84C90 54 90 38 84 38Z" fill="#e8553d"/><rect x="62" y="38" width="28" height="16" rx="8"/></g>` +
    `<circle cx="72" cy="78" r="9" fill="#fff"/><path d="M66 78H78" stroke-width="2.5"/>` +
    `<circle cx="86" cy="66" r="6" fill="#7ec8f0"/>`,
  마스크:
    moodFace(dot(38, 50) + dot(62, 50) + cheeks(56, 22)) +
    `<path d="M22 60L20 58M78 60L80 58" stroke-width="3"/>` +
    `<path d="M30 58L18 52M70 58L82 52M30 76L20 72M70 76L80 72" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M30 56C40 52 60 52 70 56L70 76C62 86 38 86 30 76Z" fill="#dff4ff"/>` +
    `<path d="M32 64C42 61 58 61 68 64M32 71C42 68 58 68 68 71" stroke="#7ec8f0" stroke-width="3"/>`,
  우비:
    `<path d="M30 30L14 42L8 70L20 72L26 52Z" fill="#ffd23f"/><path d="M70 30L86 42L92 70L80 72L74 52Z" fill="#ffd23f"/>` +
    `<path d="M30 28L22 90H78L70 28Z" fill="#ffd23f"/>` +
    `<path d="M30 30C26 6 74 6 70 30C66 40 34 40 30 30Z" fill="#ffc933"/>` +
    `<path d="M36 28C38 16 62 16 64 28C58 32 42 32 36 28Z" fill="#e0a800"/>` +
    `<path d="M50 36V88" stroke="#e0a800" stroke-width="3"/>` +
    dot(56, 48, 3, '#3b78e6') +
    dot(56, 62, 3, '#3b78e6') +
    dot(56, 76, 3, '#3b78e6') +
    drop(10, 12, 0.9) +
    drop(90, 10, 0.9) +
    drop(92, 80, 0.8) +
    drop(8, 80, 0.8),
  지갑:
    `<rect x="20" y="22" width="30" height="20" rx="2" fill="#7cc97a" transform="rotate(-12 35 32)"/>` +
    `<rect x="44" y="18" width="30" height="22" rx="3" fill="#3b8fe0" transform="rotate(10 59 29)"/>` +
    `<rect x="10" y="34" width="80" height="54" rx="10" fill="#9a5b2e"/>` +
    `<path d="M10 48C10 40 16 34 24 34H76C84 34 90 40 90 48V60H56V48Z" fill="#c98b4f"/>` +
    `<path d="M50 60H92V72H56C52 72 50 70 50 66Z" fill="#c98b4f"/>` +
    `<circle cx="80" cy="66" r="4" fill="${HL}"/>` +
    `<path d="M18 80H44" stroke="#6b3e26" stroke-width="3" stroke-dasharray="4 4"/>`,
  돈:
    bill('translate(12 14) rotate(-10)') +
    bill('translate(20 36) rotate(6)') +
    bill('translate(14 56) rotate(-4)') +
    coin(76, 74, 14) +
    coin(58, 86, 9, '#dfe8f5', '#8a96b0'),
  동전:
    coinSide(28, 84, 16) +
    coinSide(28, 76, 16) +
    coinSide(28, 68, 16) +
    coinSide(28, 60, 16) +
    coinSide(28, 52, 16) +
    coin(70, 66, 20) +
    coin(64, 26, 15, '#dfe8f5', '#8a96b0') +
    sparkle(88, 40, 6),
  달력:
    `<rect x="12" y="16" width="76" height="76" rx="6" fill="#fff"/>` +
    `<path d="M12 22C12 18 15 16 18 16H82C85 16 88 18 88 22V36H12Z" fill="#e8553d"/>` +
    `<path d="M12 36H88"/>` +
    `<path d="M16 50H84M16 64H84M16 78H84M28 40V88M42 40V88M58 40V88M72 40V88" stroke="#b8c6da" stroke-width="2.5"/>` +
    `<rect x="44" y="52" width="12" height="10" rx="2" fill="${HL}" stroke="none"/>` +
    `<rect x="30" y="8" width="7" height="16" rx="3.5" fill="#8a96b0"/><rect x="63" y="8" width="7" height="16" rx="3.5" fill="#8a96b0"/>`,
  사진:
    `<g transform="rotate(-6 50 50)">` +
    `<rect x="10" y="16" width="80" height="70" rx="3" fill="#fff"/>` +
    `<rect x="18" y="24" width="64" height="44" fill="#8fd3ff"/>` +
    `<circle cx="66" cy="36" r="7" fill="#ffd23f"/>` +
    `<path d="M18 68L36 42L48 56L58 46L82 68Z" fill="#43b04a"/>` +
    `<path d="M32 48L36 42L40 48Z" fill="#fff" stroke-width="2"/>` +
    `<rect x="18" y="24" width="64" height="44"/>` +
    `</g>` +
    `<rect x="38" y="6" width="24" height="10" fill="#ffe7a0" opacity=".6" stroke="none" transform="rotate(-6 50 11)"/>`,
  편지:
    `<g transform="rotate(-8 50 50)">` +
    `<rect x="18" y="8" width="64" height="84" rx="3" fill="#fff5f0"/>` +
    `<path d="M28 58H72M28 68H72M28 78H60" stroke="#b8c6da" stroke-width="3"/>` +
    `<path d="M50 50C32 38 30 22 40 20C46 19 49 23 50 27C51 23 54 19 60 20C70 22 68 38 50 50Z" fill="#ff5c70"/>` +
    `<path d="M40 26q2-3 5-2" stroke="#ffb3c0" stroke-width="3"/>` +
    `</g>`,
  선물:
    `<rect x="14" y="44" width="72" height="46" rx="3" fill="#e8553d"/>` +
    `<rect x="10" y="34" width="80" height="14" rx="3" fill="#ff5c70"/>` +
    `<path d="M44 34H56V90H44Z" fill="${HL}"/>` +
    `<path d="M50 34C38 14 18 18 24 28C28 34 40 34 50 34Z" fill="${HL}"/>` +
    `<path d="M50 34C62 14 82 18 76 28C72 34 60 34 50 34Z" fill="${HL}"/>` +
    `<circle cx="50" cy="32" r="5" fill="#f2c14e"/>` +
    `<path d="M20 52V82" stroke="#ff9a8a" stroke-width="4"/>`,
  초:
    `<circle cx="50" cy="22" r="16" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    `<ellipse cx="50" cy="88" rx="34" ry="7" fill="#f2c14e"/>` +
    `<rect x="34" y="38" width="32" height="48" rx="3" fill="#ff9aa8"/>` +
    `<path d="M34 42C34 38 66 38 66 42V46C62 46 62 54 58 54S56 46 50 46S44 58 40 58S38 46 34 46Z" fill="#fff"/>` +
    `<path d="M50 38V30" stroke-width="3"/>` +
    `<path d="M50 10C42 20 42 30 50 30S58 20 50 10Z" fill="#ff9f1a"/><path d="M50 18C47 23 47 27 50 27S53 23 50 18Z" fill="${HL}" stroke="none"/>` +
    `<path d="M40 62V80" stroke="#ffd0d6" stroke-width="4"/>`,
  전등:
    `<path d="M20 5H80" stroke-width="5"/><path d="M50 6V26" stroke-width="3"/>` +
    `<path d="M26 72L20 84M40 76L38 90M60 76L62 90M74 72L80 84" stroke="${HL}" stroke-width="5"/>` +
    `<circle cx="50" cy="60" r="12" fill="#fff1b8"/>` +
    `<path d="M14 62C14 38 30 26 50 26S86 38 86 62Z" fill="#3b8fe0"/>` +
    `<rect x="44" y="22" width="12" height="8" rx="2" fill="#8a96b0"/>` +
    `<path d="M26 54C28 44 34 38 42 35" stroke="#8fd3ff" stroke-width="4"/>`,
  손전등:
    `<path d="M58 40L96 12V88L58 60Z" fill="#fff1b8" stroke="none"/>` +
    `<path d="M66 50H90M64 36L86 22M64 64L86 78" stroke="${HL}" stroke-width="4"/>` +
    `<rect x="6" y="40" width="42" height="20" rx="5" fill="#e8553d"/>` +
    `<path d="M44 38L58 32V68L44 62Z" fill="#c9412e"/>` +
    `<ellipse cx="58" cy="50" rx="4" ry="18" fill="#ffd23f"/>` +
    `<rect x="22" y="44" width="10" height="6" rx="2" fill="#30354f"/>` +
    `<path d="M12 56H38" stroke="#ff9a8a" stroke-width="3"/>`,
  텔레비전:
    `<path d="M40 22L28 6M60 22L72 6" stroke-width="3.5"/>` +
    dot(28, 6, 3.5) +
    dot(72, 6, 3.5) +
    `<path d="M26 82L20 92M74 82L80 92" stroke-width="5"/>` +
    `<rect x="8" y="22" width="84" height="62" rx="10" fill="#e8862e"/>` +
    `<rect x="16" y="30" width="54" height="46" rx="8" fill="#4a90e2"/>` +
    `<path d="M24 40L32 36M24 50L42 38" stroke="#bfe6ff" stroke-width="4"/>` +
    `<circle cx="81" cy="40" r="5" fill="#ffd23f"/><circle cx="81" cy="56" r="5" fill="#ffd23f"/>` +
    `<path d="M76 68H86M76 74H86" stroke-width="2.5"/>`,
  라디오:
    `<path d="M70 26L84 6" stroke-width="3.5"/>` +
    dot(84, 6, 3.5) +
    `<path d="M26 30V20C26 16 28 14 32 14H68C72 14 74 16 74 20V30" stroke-width="6"/>` +
    `<rect x="8" y="28" width="84" height="56" rx="10" fill="#43b04a"/>` +
    `<circle cx="32" cy="58" r="17" fill="#30354f"/><circle cx="32" cy="58" r="8" fill="#6a7390"/>` +
    `<rect x="56" y="38" width="28" height="14" rx="3" fill="#fff7c0"/><path d="M68 40V50" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="62" cy="68" r="5" fill="#ffd23f"/><circle cx="78" cy="68" r="5" fill="#ffd23f"/>` +
    `<path d="M88 92c0-4 0-10 0-14l6-2" stroke-width="3"/><ellipse cx="85" cy="92" rx="4" ry="3" fill="${INK}" stroke="none"/>`,
  카메라:
    `<path d="M30 30L36 20H56L62 30Z" fill="#30354f"/>` +
    `<rect x="8" y="28" width="84" height="56" rx="8" fill="#4a5068"/>` +
    `<rect x="8" y="42" width="84" height="30" fill="#6a7390" stroke="none"/><path d="M8 42H92M8 72H92"/>` +
    `<circle cx="50" cy="57" r="22" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="57" r="14" fill="#3b78e6"/>` +
    `<circle cx="50" cy="57" r="6" fill="#1d2340"/>` +
    `<circle cx="44" cy="51" r="3" fill="#fff" stroke="none"/>` +
    `<rect x="72" y="32" width="12" height="7" rx="2" fill="#fff7c0" stroke-width="2.5"/>` +
    `<rect x="16" y="22" width="12" height="6" rx="2" fill="#e8553d" stroke-width="2.5"/>`,
  리모컨:
    `<path d="M56 10c6-4 12-4 18 0M60 4c4-3 10-3 14 0" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g transform="rotate(12 50 54)">` +
    `<rect x="32" y="16" width="36" height="80" rx="12" fill="#4a5068"/>` +
    `<circle cx="50" cy="28" r="5.5" fill="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="50" cy="48" r="9" fill="#8a96b0" stroke-width="2.5"/>` +
    [
      [42, 66],
      [58, 66],
      [42, 78],
      [58, 78],
    ]
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${['#ffd23f', '#43b04a', '#3b8fe0', '#ff9aa8'][i]}" stroke-width="2.5"/>`)
      .join('') +
    `</g>`,
  선풍기:
    `<path d="M50 60V84" stroke-width="10"/><path d="M50 60V84" stroke="#8fd3ff" stroke-width="4"/>` +
    `<ellipse cx="50" cy="88" rx="24" ry="7" fill="#3b8fe0"/>` +
    `<circle cx="50" cy="38" r="32" fill="#eef8ff"/>` +
    `<path d="M50 38C40 20 50 10 58 16C64 22 58 30 50 38Z" fill="#7ec8f0"/>` +
    `<path d="M50 38C70 36 76 48 70 54C64 60 56 52 50 38Z" fill="#7ec8f0"/>` +
    `<path d="M50 38C38 54 26 50 26 42C26 34 36 34 50 38Z" fill="#7ec8f0"/>` +
    `<circle cx="50" cy="38" r="6" fill="#3b8fe0"/>` +
    `<circle cx="50" cy="38" r="32"/><path d="M50 6V70M18 38H82M27 15L73 61M73 15L27 61" stroke="#b8c6da" stroke-width="1.5"/>`,
  청소기:
    `<path d="M34 56C34 26 58 18 62 32" stroke-width="10"/><path d="M34 56C34 26 58 18 62 32" stroke="#8a96b0" stroke-width="4"/>` +
    tube('M62 30L74 84', '#dfe8f5', 4) +
    `<rect x="56" y="22" width="12" height="14" rx="3" fill="#43b04a" transform="rotate(-12 62 29)"/>` +
    `<path d="M58 82H92C94 82 94 90 92 90H58C56 90 56 82 58 82Z" fill="#43b04a"/>` +
    `<path d="M8 80C8 62 20 50 34 50S56 62 56 80Z" fill="#e8553d"/>` +
    `<circle cx="18" cy="82" r="8" fill="#30354f"/><circle cx="46" cy="82" r="8" fill="#30354f"/>` +
    `<path d="M20 62C24 58 28 56 32 56" stroke="#ff9a8a" stroke-width="4"/>` +
    dot(86, 74, 2, '#9aa6c4') +
    dot(92, 70, 1.8, '#9aa6c4'),
  옷걸이:
    `<path d="M50 34V26C50 20 56 18 58 14C60 8 54 4 49 6C46 7 44 10 44 12" stroke-width="5"/>` +
    `<path d="M50 32L8 66C4 70 6 76 12 76H88C94 76 96 70 92 66Z" fill="#c98b4f"/>` +
    `<path d="M50 42L22 64H78Z" fill="#fff7e0"/>` +
    `<rect x="46" y="28" width="8" height="8" rx="2" fill="#8a96b0"/>`,
  머리띠:
    `<path d="M16 84C8 50 24 18 50 18S92 50 84 84" stroke-width="18"/>` +
    `<path d="M16 84C8 50 24 18 50 18S92 50 84 84" stroke="#ff9aa8" stroke-width="10"/>` +
    dot(18, 56, 2.5, '#fff') +
    dot(30, 30, 2.5, '#fff') +
    dot(70, 30, 2.5, '#fff') +
    dot(82, 56, 2.5, '#fff') +
    `<path d="M66 26C60 6 86 2 90 16C92 26 76 30 66 26Z" fill="#e85d9a"/>` +
    `<path d="M66 26C50 20 34 36 44 44C52 48 62 38 66 26Z" fill="#e85d9a"/>` +
    `<circle cx="66" cy="26" r="6" fill="#c23f7c"/>`,
  슬리퍼: slipper(30, -8) + slipper(70, 8),
  샌들:
    `<path d="M6 70C6 64 10 62 16 62H82C92 62 96 66 94 72L92 76H8Z" fill="#f5d6a8"/>` +
    `<path d="M8 76H92C92 82 88 86 84 86H14C10 86 8 82 8 76Z" fill="#9a5b2e"/>` +
    `<path d="M60 64C60 42 88 42 88 64" stroke-width="13"/><path d="M60 64C60 42 88 42 88 64" stroke="#ff9f1a" stroke-width="7"/>` +
    `<path d="M18 64V34" stroke-width="13"/><path d="M18 64V34" stroke="#ff9f1a" stroke-width="7"/>` +
    `<path d="M18 38C30 38 40 46 46 64" stroke-width="13"/><path d="M18 38C30 38 40 46 46 64" stroke="#ff9f1a" stroke-width="7"/>` +
    `<rect x="11" y="30" width="14" height="14" rx="3" fill="${HL}"/><path d="M18 34V40" stroke-width="2.5"/>`,
  부츠: tallBoot('translate(46 10)') + tallBoot('translate(10 14) scale(.95)'),
  조끼:
    `<path d="M26 12L40 12L50 46L60 12L74 12C74 22 78 30 86 34V88H54L50 84L46 88H14V34C22 30 26 22 26 12Z" fill="#43b04a"/>` +
    `<path d="M40 12L50 46L60 12" stroke-width="3.5"/>` +
    `<path d="M50 46V84" stroke-width="2.5"/>` +
    dot(56, 56, 3, HL) +
    dot(56, 68, 3, HL) +
    dot(56, 80, 3, HL) +
    `<path d="M22 64H38M62 64H78" stroke="#2f7f38" stroke-width="3.5"/>` +
    `<path d="M20 40V60" stroke="#8fd98a" stroke-width="4"/>`,
  코트:
    `<path d="M34 8L18 14L8 70L20 72L28 36Z" fill="#c98b4f"/><path d="M66 8L82 14L92 70L80 72L72 36Z" fill="#c98b4f"/>` +
    `<path d="M34 8H66L74 94H26Z" fill="#c98b4f"/>` +
    `<path d="M34 8L50 40L66 8" fill="#f5e6c8"/>` +
    `<path d="M34 8L42 34L36 38L50 40L44 20Z" fill="#9a5b2e"/><path d="M66 8L58 34L64 38L50 40L56 20Z" fill="#9a5b2e"/>` +
    `<path d="M50 40V94" stroke-width="2.5"/>` +
    `<path d="M27 58H73" stroke="#6b3e26" stroke-width="6"/>` +
    dot(42, 48, 2.8) +
    dot(58, 48, 2.8) +
    dot(42, 70, 2.8) +
    dot(58, 70, 2.8),
  셔츠:
    `<path d="M36 12L20 16L6 64L18 68L28 36V90H72V36L82 68L94 64L80 16L64 12Z" fill="#8fd3ff"/>` +
    `<path d="M36 12L50 22L64 12" stroke-width="3"/>` +
    `<path d="M36 12L34 26L50 22Z" fill="#fff"/><path d="M64 12L66 26L50 22Z" fill="#fff"/>` +
    `<path d="M50 22V90" stroke-width="2.5"/>` +
    dot(54, 36, 2.5, '#fff') +
    dot(54, 52, 2.5, '#fff') +
    dot(54, 68, 2.5, '#fff') +
    `<rect x="32" y="38" width="12" height="12" rx="2" stroke-width="2.5"/>` +
    `<path d="M8 60L18 64M92 60L82 64" stroke-width="3"/>`,
  티셔츠:
    `<path d="M34 16L20 20L6 38L19 50L27 42V88H73V42L81 50L94 38L80 20L66 16C62 26 38 26 34 16Z" fill="#e8553d"/>` +
    `<path d="M34 16C38 26 62 26 66 16" stroke-width="4"/>` +
    `<path d="M13 45L26 34M87 45L74 34" stroke="#ff9a8a" stroke-width="3"/>` +
    `<path d="M50 44L54 53L63 54L56 60L58 69L50 64L42 69L44 60L37 54L46 53Z" fill="#fff" stroke-width="2.5"/>`,
  청바지:
    `<path d="M24 10H76L84 92H58L50 40L42 92H16Z" fill="#3b78e6"/>` +
    `<path d="M24 10H76L77 20H23Z" fill="#2a58b0"/>` +
    `<circle cx="50" cy="15" r="2.8" fill="${HL}" stroke-width="2"/>` +
    `<path d="M28 22C30 30 36 34 42 34M72 22C70 30 64 34 58 34" stroke="#bfd6ff" stroke-width="2.5"/>` +
    `<path d="M50 20V40" stroke="#bfd6ff" stroke-width="2.5"/>` +
    `<path d="M24 84H40M60 84H76" stroke="#bfd6ff" stroke-width="2.5"/>`,
  원피스:
    `<path d="M38 10L30 14L22 28L32 34L36 28Z" fill="#e85d9a"/><path d="M62 10L70 14L78 28L68 34L64 28Z" fill="#e85d9a"/>` +
    `<path d="M38 10C42 18 58 18 62 10L66 42L88 90C62 96 38 96 12 90L34 42Z" fill="#ff9aa8"/>` +
    `<path d="M34 42H66" stroke="#e85d9a" stroke-width="6"/>` +
    [
      [44, 28],
      [56, 28],
      [34, 60],
      [50, 62],
      [66, 60],
      [26, 80],
      [42, 78],
      [58, 78],
      [74, 80],
    ]
      .map(([x, y]) => dot(x, y, 3, '#fff'))
      .join(''),
};
