// 그림 묶음: 부엌 도구·통과 병, 아기 물건, 전통 놀이·보드게임·장난감 (l3). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(소금통·설탕통·후추통 / 반찬통·김치통·도시락통 / 유리병·페트병·우유병 / 흔들침대·아기침대·요람 / 바둑판·체스판·윷판)는
// 속에 든 것·모양·색을 다르게 했다: 소금=구멍 뚜껑+흰 가루, 설탕=각설탕, 후추=후추 갈이; 흔들침대=매달린 침대, 아기침대=창살, 요람=나무 흔들 바구니.
import { INK, SKIN, HL, dot, sparkle, tube, drop, cheeks } from '../pictureKit.ts';

/** 쌀알 하나 */
const grain = (x: number, y: number, r = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2" fill="#fff" stroke-width="1.6" transform="rotate(${r} ${x} ${y})"/>`;

/** 아기 얼굴 (가운데 (x,y), 반지름 r) */
const baby = (x: number, y: number, r: number, sleep = false) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>` +
  `<path d="M${x - 2} ${y - r + 1}q2 -5 5 -2" stroke-width="2.5"/>` +
  (sleep
    ? `<path d="M${x - r * 0.5} ${y}q${r * 0.18} ${r * 0.15} ${r * 0.36} 0M${x + r * 0.14} ${y}q${r * 0.18} ${r * 0.15} ${r * 0.36} 0" stroke-width="2.2"/>`
    : dot(x - r * 0.36, y, r * 0.13) + dot(x + r * 0.36, y, r * 0.13)) +
  `<path d="M${x - r * 0.2} ${y + r * 0.4}q${r * 0.2} ${r * 0.18} ${r * 0.4} 0" stroke-width="2.2"/>` +
  `<circle cx="${x - r * 0.6}" cy="${y + r * 0.3}" r="${r * 0.18}" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
  `<circle cx="${x + r * 0.6}" cy="${y + r * 0.3}" r="${r * 0.18}" fill="#ff9aa8" stroke="none" opacity=".6"/>`;

/** 넓은 병 (잼병·꿀병): 뚜껑 색, 속 색, 속 위쪽 y */
const jar = (lid: string, fill: string, top: number, extra = '') =>
  `<path d="M24 34H76V84C76 90 72 94 66 94H34C28 94 24 90 24 84Z" fill="#e6f4fb"/>` +
  `<path d="M26 ${top}H74V84C74 89 71 92 66 92H34C29 92 26 89 26 84Z" fill="${fill}" stroke="none"/>` +
  `<path d="M24 34H76V84C76 90 72 94 66 94H34C28 94 24 90 24 84Z"/>` +
  `<rect x="20" y="20" width="60" height="16" rx="4" fill="${lid}"/>` +
  `<path d="M31 44V60" stroke="#fff" stroke-width="4" opacity=".6"/>` +
  extra;

/** 도미노 한 장 (가운데 (x,y), 기울기) */
const domino = (x: number, y: number, rot: number, top: number[][], bot: number[][]) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">` +
  `<rect x="-9" y="-19" width="18" height="38" rx="3" fill="#fff"/><path d="M-6 0H6" stroke-width="2.5"/>` +
  top.map(([a, b]) => dot(a, b - 10, 2.2)).join('') +
  bot.map(([a, b]) => dot(a, b + 10, 2.2)).join('') +
  `</g>`;

export const PICS: Record<string, string> = {
  주걱:
    `<path d="M14 66C14 88 30 94 50 94S86 88 86 66Z" fill="#7ec8f0"/>` +
    `<path d="M14 66C18 48 82 48 86 66Z" fill="#fff"/>` +
    grain(30, 60, 10) +
    grain(42, 56, -20) +
    grain(62, 58, 30) +
    grain(72, 62, -10) +
    grain(24, 64, 0) +
    `<path d="M30 80H70" stroke="#fff" stroke-width="3"/>` +
    `<g transform="rotate(35 50 40)">` +
    `<rect x="44" y="-4" width="12" height="40" rx="6" fill="#e8b877"/>` +
    `<path d="M36 30H64C68 30 70 34 70 38V52C70 62 62 66 50 66S30 62 30 52V38C30 34 32 30 36 30Z" fill="#f5e3c0"/>` +
    grain(42, 56, 20) +
    grain(52, 60, -10) +
    grain(58, 54, 40) +
    `</g>`,
  거품기:
    `<path d="M44 62C14 40 24 6 50 6S86 40 56 62" fill="none"/>` +
    `<path d="M44 62C14 40 24 6 50 6S86 40 56 62" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M45 62C28 40 34 6 50 6S72 40 55 62" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M50 62V6" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M44 62C14 40 24 6 50 6S86 40 56 62" stroke-width="1.5"/>` +
    `<rect x="42" y="60" width="16" height="8" rx="2" fill="#dfe8f5"/>` +
    `<rect x="43" y="67" width="14" height="28" rx="7" fill="#e8553d"/>` +
    `<circle cx="50" cy="88" r="2.5" fill="#fff" stroke="none"/>` +
    `<path d="M16 60c-8 0-10 8-4 10c-2 6 8 8 10 3c6 2 8-6 3-8c1-5-6-7-9-5z" fill="#fff"/>`,
  밀대:
    `<ellipse cx="50" cy="76" rx="42" ry="14" fill="#fff3d6"/>` +
    `<g transform="rotate(-12 50 50)">` +
    `<rect x="4" y="45" width="18" height="12" rx="6" fill="#c98a4a"/><rect x="78" y="45" width="18" height="12" rx="6" fill="#c98a4a"/>` +
    `<rect x="18" y="37" width="64" height="28" rx="10" fill="#e8b877"/>` +
    `<path d="M26 44H60" stroke="#fff" stroke-width="4" opacity=".6"/>` +
    `</g>`,
  계량컵:
    `<path d="M70 32C92 32 92 72 70 72" stroke-width="12"/><path d="M70 32C92 32 92 72 70 72" stroke="#e6f4fb" stroke-width="5"/>` +
    `<path d="M16 16H74L70 88C70 92 66 94 62 94H28C24 94 20 92 20 88L18 28L12 20Z" fill="#e6f4fb"/>` +
    `<path d="M19.4 52H71.6L70 88C70 92 66 94 62 94H28C24 94 20 92 20 88Z" fill="#7ec8f0" stroke="none"/>` +
    `<path d="M16 16H74L70 88C70 92 66 94 62 94H28C24 94 20 92 20 88L18 28L12 20Z"/>` +
    `<path d="M56 30H68M60 41H68M56 52H68M60 63H68M56 74H68" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M28 30V46" stroke="#fff" stroke-width="4" opacity=".7"/>`,
  타이머:
    `<path d="M14 26L22 32M86 26L78 32" stroke="#9aa6c4" stroke-width="3"/><path d="M8 40H16M92 40H84" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="42" y="8" width="16" height="10" rx="3" fill="#8a96b0"/>` +
    `<circle cx="50" cy="56" r="38" fill="#ff9f1a"/>` +
    `<circle cx="50" cy="56" r="28" fill="#fff"/>` +
    `<path d="M50 56V30A26 26 0 0 1 72.5 69Z" fill="#ff5c70" stroke="none"/>` +
    `<path d="M50 31V36M75 56H70M50 81V76M25 56H30M68 38L65 41M68 74L65 71M32 74L35 71M32 38L35 41" stroke-width="3"/>` +
    `<path d="M50 56L72.5 69" stroke-width="4"/>` +
    dot(50, 56, 4),
  요리책:
    `<rect x="18" y="10" width="64" height="82" rx="4" fill="#fff"/>` +
    `<rect x="14" y="8" width="62" height="82" rx="4" fill="#e8553d"/>` +
    `<path d="M24 8V90" stroke="#b83a26" stroke-width="5"/>` +
    `<path d="M76 14H80M76 24H80M76 34H80M76 44H80M76 54H80M76 64H80M76 74H80M76 84H80" stroke="#dfe8f5" stroke-width="2"/>` +
    `<path d="M34 22C34 12 44 12 46 16C48 10 58 10 58 16C64 14 68 22 62 26V32H38V26C34 26 32 24 34 22Z" fill="#fff"/>` +
    `<circle cx="50" cy="58" r="16" fill="#fff"/><circle cx="50" cy="58" r="10" fill="#ffd23f"/>` +
    `<path d="M30 42V74M27 42V50C27 53 33 53 33 50V42" stroke="#fff" stroke-width="3"/>` +
    `<path d="M70 42V74" stroke="#fff" stroke-width="3"/><ellipse cx="70" cy="47" rx="3.5" ry="6" fill="#fff" stroke="none"/>` +
    `<path d="M34 82H66" stroke="#ffd23f" stroke-width="4"/>`,
  오븐장갑:
    `<path d="M44 58C58 50 76 50 90 58" stroke="#9aa6c4" stroke-width="3" fill="none"/>` +
    `<path d="M60 12q-4 6 0 12t0 12M72 10q-4 6 0 12t0 12M84 12q-4 6 0 12t0 12" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M40 62H94V74C94 84 88 88 80 88H54C46 88 40 84 40 74Z" fill="#8a96b0"/>` +
    `<path d="M46 62C46 52 88 52 88 62Z" fill="#e8862e"/>` +
    `<g transform="rotate(-18 34 56)">` +
    `<path d="M16 88V38C16 16 50 16 50 38V60C58 52 66 56 62 64L50 80V88Z" fill="#e8553d"/>` +
    `<path d="M22 36L44 58M22 52L40 70M30 30L48 48M44 36L24 56M46 52L28 70M38 28L22 44" stroke="#fff" stroke-width="2.5" opacity=".7"/>` +
    `<rect x="12" y="84" width="42" height="12" rx="4" fill="#fff"/>` +
    `<path d="M16 90C8 94 8 100 14 100" stroke-width="3"/>` +
    `</g>`,
  식탁보:
    `<path d="M24 70V94M76 70V94" stroke-width="7"/><path d="M24 70V94M76 70V94" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M18 30H82L94 44V72q-7 5-14 0t-15 0t-15 0t-15 0t-15 0t-14 0V44Z" fill="#fff"/>` +
    `<path d="M6 44H94" stroke-width="3"/>` +
    `<g stroke="#ff5c70" stroke-width="6" opacity=".85"><path d="M21 44V71M36 44V73M50 44V73M64 44V73M79 44V71"/><path d="M8 52H92M8 64H92"/><path d="M34 30L28 44M50 30V44M66 30L72 44M16 37H84"/></g>` +
    `<path d="M18 30H82L94 44V72q-7 5-14 0t-15 0t-15 0t-15 0t-15 0t-14 0V44Z"/>` +
    `<path d="M6 44H94" stroke-width="3"/>`,
  냅킨:
    `<path d="M12 22H88V86H12Z" fill="#7ec8f0"/>` +
    `<path d="M18 28H82V80H18Z" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    `<path d="M88 22L60 22L88 50Z" fill="#bfe6ff"/>` +
    `<path d="M60 22L88 50" stroke-width="3"/>` +
    `<g transform="rotate(20 46 56)">` +
    `<path d="M46 50V92" stroke-width="10"/><path d="M46 50V92" stroke="#dfe8f5" stroke-width="4"/>` +
    `<path d="M36 16V36C36 46 56 46 56 36V16" fill="#dfe8f5"/>` +
    `<path d="M42 16V32M50 16V32" stroke-width="3"/>` +
    `<path d="M40 38Q46 52 52 38Z" fill="#dfe8f5" stroke="none"/>` +
    `</g>`,
  이쑤시개:
    `<g stroke-width="6"><path d="M36 58L28 10M44 58L42 6M52 58L56 8M60 58L68 14M48 58L48 14"/></g>` +
    `<g stroke="#f0cf8a" stroke-width="2.5"><path d="M36 58L28 10M44 58L42 6M52 58L56 8M60 58L68 14M48 58L48 14"/></g>` +
    `<path d="M26 54H70L66 92H30Z" fill="#3a9e47"/>` +
    `<ellipse cx="48" cy="54" rx="22" ry="5" fill="#2e7a38"/>` +
    `<path d="M32 70H64M33 80H63" stroke="#8fd694" stroke-width="3"/>` +
    `<path d="M72 92L94 60" stroke-width="7"/><path d="M72 92L94 60" stroke="#f0cf8a" stroke-width="3"/>`,
  도시락통:
    `<rect x="18" y="8" width="66" height="30" rx="8" fill="#3b8fe0" transform="rotate(-8 50 22)"/>` +
    `<rect x="38" y="16" width="26" height="10" rx="5" fill="#bfe6ff" transform="rotate(-8 50 22)"/>` +
    `<rect x="8" y="40" width="84" height="52" rx="10" fill="#ffd23f"/>` +
    `<rect x="14" y="46" width="38" height="40" rx="5" fill="#fff"/>` +
    `<rect x="56" y="46" width="30" height="18" rx="4" fill="#3a9e47"/>` +
    `<rect x="56" y="68" width="30" height="18" rx="4" fill="#fff7e0"/>` +
    grain(22, 54, 10) +
    grain(32, 58, -20) +
    grain(42, 54, 30) +
    grain(26, 68, -10) +
    grain(38, 72, 20) +
    grain(24, 80, 40) +
    `<circle cx="64" cy="55" r="5" fill="#5fc24a" stroke-width="2.5"/><circle cx="76" cy="54" r="5" fill="#5fc24a" stroke-width="2.5"/>` +
    `<ellipse cx="64" cy="77" rx="6" ry="5" fill="#fff" stroke-width="2.5"/><circle cx="64" cy="77" r="3" fill="${HL}" stroke="none"/>` +
    `<rect x="72" y="71" width="12" height="11" rx="5" fill="#e8553d" stroke-width="2.5"/>`,
  물티슈:
    `<rect x="10" y="40" width="80" height="50" rx="16" fill="#4a90e2"/>` +
    `<rect x="28" y="36" width="44" height="22" rx="8" fill="#bfe6ff"/>` +
    `<path d="M38 46C34 30 44 14 58 12C54 20 62 26 56 34C62 38 60 44 62 46Z" fill="#fff"/>` +
    `<path d="M44 40C44 32 50 24 54 20" stroke="#dfe8f5" stroke-width="2.5"/>` +
    drop(30, 64, 1.1) +
    drop(48, 66, 0.9) +
    drop(66, 64, 1.1) +
    `<path d="M20 84H80" stroke="#bfe6ff" stroke-width="3"/>`,
  화장지:
    `<path d="M20 58V92H70V58" fill="#fff"/>` +
    `<path d="M20 72H70M20 86H70" stroke="#b9c3d8" stroke-width="2.5" stroke-dasharray="3 4"/>` +
    `<path d="M20 58V92H70V58" />` +
    `<path d="M20 58H70V30" fill="#fff" stroke="none"/>` +
    `<rect x="20" y="30" width="50" height="28" fill="#fff" stroke="none"/>` +
    `<path d="M20 30V58M70 30V58"/>` +
    `<ellipse cx="45" cy="30" rx="25" ry="12" fill="#fff"/>` +
    `<ellipse cx="45" cy="30" rx="9" ry="4.5" fill="#e8b877"/>` +
    `<ellipse cx="45" cy="30" rx="4.5" ry="2.2" fill="#9a5b2e" stroke="none"/>` +
    `<path d="M70 30C80 30 84 40 84 50V94" stroke-width="3" fill="none"/>` +
    `<path d="M70 32C78 32 82 40 82 50V94H70Z" fill="#fff" stroke="none"/>` +
    `<path d="M70 58V92M82 50V94" stroke-width="3"/>` +
    `<path d="M72 70H82M72 84H82" stroke="#b9c3d8" stroke-width="2.5" stroke-dasharray="3 3"/>` +
    `<path d="M22 44C22 38 24 34 28 32" stroke="#dfe8f5" stroke-width="3"/>`,
  반찬통:
    `<rect x="14" y="40" width="72" height="50" rx="8" fill="#e6f4fb"/>` +
    `<rect x="20" y="52" width="60" height="32" rx="4" fill="#fff" stroke="none"/>` +
    `<circle cx="32" cy="66" r="9" fill="#ffd23f" stroke-width="2.5"/><circle cx="32" cy="66" r="4" fill="#ff9f1a" stroke="none"/>` +
    `<circle cx="50" cy="64" r="9" fill="#ffd23f" stroke-width="2.5"/><circle cx="50" cy="64" r="4" fill="#ff9f1a" stroke="none"/>` +
    `<circle cx="68" cy="66" r="9" fill="#ffd23f" stroke-width="2.5"/><circle cx="68" cy="66" r="4" fill="#ff9f1a" stroke="none"/>` +
    `<path d="M24 80q8-6 16 0t16 0t16 0" stroke="#43b04a" stroke-width="4"/>` +
    `<rect x="10" y="28" width="80" height="14" rx="5" fill="#43b04a"/>` +
    `<path d="M22 28V48H32V28M68 28V48H78V28" fill="#5fc24a"/>` +
    `<path d="M50 20V28" stroke-width="3"/><rect x="40" y="16" width="20" height="8" rx="4" fill="#5fc24a"/>` +
    `<path d="M18 50V80" stroke="#fff" stroke-width="3.5" opacity=".8"/>`,
  김치통:
    `<rect x="8" y="34" width="84" height="58" rx="8" fill="#fff"/>` +
    `<path d="M16 50C16 44 30 42 36 48C40 42 56 42 60 48C66 42 84 44 84 50V84H16Z" fill="#f6e7a8" stroke="none"/>` +
    `<path d="M16 50C16 44 30 42 36 48C40 42 56 42 60 48C66 42 84 44 84 50" stroke-width="3"/>` +
    `<path d="M16 58C30 54 36 64 50 58S70 54 84 60M16 72C28 66 40 76 52 70S74 66 84 74" stroke="#e8553d" stroke-width="7"/>` +
    `<path d="M16 84H84" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M24 50L28 76M48 50L46 78M70 50L72 78" stroke="#8fd694" stroke-width="3"/>` +
    `<rect x="8" y="34" width="84" height="58" rx="8"/>` +
    `<rect x="4" y="20" width="92" height="16" rx="6" fill="#c0392b"/>` +
    `<rect x="14" y="30" width="12" height="12" rx="3" fill="#e8553d"/><rect x="74" y="30" width="12" height="12" rx="3" fill="#e8553d"/>`,
  쌀통:
    `<path d="M16 30H84L80 92H20Z" fill="#9a5b2e"/>` +
    `<path d="M26 44H74M24 60H76M22 76H78" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M14 32C14 12 86 12 86 32Z" fill="#fff"/>` +
    grain(28, 26, 10) +
    grain(38, 20, -20) +
    grain(50, 16, 0) +
    grain(62, 21, 30) +
    grain(72, 26, -10) +
    grain(44, 27, 40) +
    grain(58, 28, -30) +
    `<path d="M62 20L82 2" stroke-width="10"/><path d="M62 20L82 2" stroke="#e8b877" stroke-width="4"/>` +
    `<path d="M50 20C48 30 70 32 72 22Z" fill="#ff9f1a" transform="rotate(-40 60 24)"/>` +
    `<rect x="12" y="28" width="76" height="6" rx="3" fill="#6b3e26"/>`,
  양념통:
    `<rect x="6" y="80" width="88" height="12" rx="4" fill="#9a5b2e"/>` +
    [
      [22, '#e8553d'],
      [50, '#f5e3c0'],
      [78, '#43b04a'],
    ]
      .map(
        ([x, c]) =>
          `<rect x="${Number(x) - 12}" y="34" width="24" height="46" rx="5" fill="#e6f4fb"/>` +
          `<rect x="${Number(x) - 10}" y="48" width="20" height="30" rx="3" fill="${c}" stroke="none"/>` +
          `<rect x="${Number(x) - 12}" y="34" width="24" height="46" rx="5"/>` +
          `<rect x="${Number(x) - 13}" y="22" width="26" height="13" rx="4" fill="#dfe8f5"/>`,
      )
      .join('') +
    dot(46, 56, 1.5, '#9a5b2e') +
    dot(54, 62, 1.5, '#9a5b2e') +
    dot(48, 70, 1.5, '#9a5b2e') +
    dot(18, 56, 1.4, '#9b2a1a') +
    dot(26, 66, 1.4, '#9b2a1a') +
    `<path d="M74 58l4-3M80 66l3-3M74 72l4-2" stroke="#2e7a38" stroke-width="2.5"/>` +
    `<path d="M36 8C40 18 44 22 52 20" stroke="#8a96b0" stroke-width="3"/><ellipse cx="34" cy="8" rx="5" ry="3.5" fill="#8a96b0"/>`,
  소금통:
    `<path d="M30 28H70L74 88C74 92 70 94 66 94H34C30 94 26 92 26 88Z" fill="#e6f4fb"/>` +
    `<path d="M29 48H71L74 88C74 92 70 94 66 94H34C30 94 26 92 26 88Z" fill="#fff" stroke="none"/>` +
    `<path d="M30 28H70L74 88C74 92 70 94 66 94H34C30 94 26 92 26 88Z"/>` +
    `<path d="M30 30C30 8 70 8 70 30Z" fill="#b9c3d8"/>` +
    dot(42, 20, 2.2) +
    dot(50, 16, 2.2) +
    dot(58, 20, 2.2) +
    dot(50, 24, 2.2) +
    `<path d="M34 56V80" stroke="#b9c3d8" stroke-width="3"/>` +
    `<g fill="#fff" stroke-width="1.5"><rect x="80" y="30" width="5" height="5" rx="1"/><rect x="86" y="44" width="5" height="5" rx="1"/><rect x="80" y="58" width="5" height="5" rx="1"/><rect x="88" y="70" width="5" height="5" rx="1"/><rect x="10" y="40" width="5" height="5" rx="1"/><rect x="14" y="60" width="5" height="5" rx="1"/></g>` +
    `<path d="M82 22L78 18M88 26l4-3" stroke="#9aa6c4" stroke-width="2.5"/>`,
  설탕통:
    `<path d="M16 38H84V84C84 90 80 94 74 94H26C20 94 16 90 16 84Z" fill="#ffd9e2"/>` +
    `<path d="M10 28C10 18 90 18 90 28V38H10Z" fill="#ff9aa8"/>` +
    `<circle cx="50" cy="16" r="7" fill="#ff5c70"/>` +
    `<path d="M16 62H84" stroke="#fff" stroke-width="4"/>` +
    `<g transform="rotate(-10 22 60)"><rect x="4" y="60" width="18" height="18" rx="2" fill="#fff"/><path d="M4 66L10 60M22 66" stroke-width="2"/></g>` +
    `<rect x="60" y="72" width="16" height="16" rx="2" fill="#fff"/>` +
    `<rect x="40" y="70" width="16" height="16" rx="2" fill="#fff" transform="rotate(12 48 78)"/>` +
    `<rect x="74" y="4" width="16" height="16" rx="2" fill="#fff" transform="rotate(20 82 12)"/>` +
    sparkle(30, 48, 5, '#fff') +
    sparkle(66, 50, 4, '#fff'),
  후추통:
    `<circle cx="50" cy="8" r="5" fill="#30354f"/>` +
    `<path d="M36 14C36 8 64 8 64 14V20H36Z" fill="#30354f"/>` +
    `<path d="M36 20H64C66 28 66 34 62 38C70 48 70 70 66 82H34C30 70 30 48 38 38C34 34 34 28 36 20Z" fill="#6b3e26"/>` +
    `<rect x="40" y="44" width="20" height="30" rx="6" fill="#e6f4fb"/>` +
    dot(45, 52, 2.6) +
    dot(54, 50, 2.6) +
    dot(50, 58, 2.6) +
    dot(45, 65, 2.6) +
    dot(55, 64, 2.6) +
    dot(50, 70, 2.6) +
    `<rect x="30" y="80" width="40" height="10" rx="4" fill="#30354f"/>` +
    dot(42, 96, 2.2) +
    dot(50, 98, 2.2) +
    dot(58, 96, 2.2) +
    dot(16, 70, 3.5, '#30354f') +
    dot(84, 62, 3.5, '#30354f') +
    dot(14, 86, 3, '#30354f') +
    dot(86, 82, 3, '#30354f') +
    `<path d="M76 16C84 10 90 16 86 22M24 22C16 16 18 8 26 12" stroke="#9aa6c4" stroke-width="3"/>`,
  간장병:
    `<path d="M40 8H56V24C68 30 72 40 72 50V88C72 92 68 94 64 94H32C28 94 24 92 24 88V50C24 40 28 30 40 24Z" fill="#4a2a1a"/>` +
    `<rect x="38" y="4" width="20" height="10" rx="3" fill="#e8553d"/>` +
    `<rect x="24" y="54" width="48" height="26" fill="#fff7e0"/>` +
    `<path d="M24 54H72M24 80H72" stroke-width="3"/>` +
    `<ellipse cx="48" cy="67" rx="10" ry="7" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M32 32C30 38 30 44 30 48" stroke="#fff" stroke-width="3.5" opacity=".5"/>` +
    `<ellipse cx="86" cy="86" rx="12" ry="5" fill="#fff"/><ellipse cx="86" cy="85" rx="7" ry="2.5" fill="#4a2a1a" stroke="none"/>` +
    `<path d="M86 60c-3 6-4 8-4 10a4 4 0 0 0 8 0c0-2-1-4-4-10z" fill="#4a2a1a"/>`,
  꿀병: jar(
    '#e8862e',
    '#ffb31a',
    44,
    `<path d="M20 34C22 42 26 42 28 36C30 46 36 46 36 36" fill="#ffb31a" stroke-width="3"/>` +
      `<g transform="rotate(25 70 40)"><path d="M70 0V50" stroke-width="8"/><path d="M70 0V50" stroke="#c98a4a" stroke-width="3"/>` +
      `<rect x="60" y="36" width="20" height="26" rx="8" fill="#e8b877"/>` +
      `<path d="M60 44H80M60 52H80" stroke-width="2.5"/></g>` +
      `<path d="M50 66C44 62 38 66 42 72C38 76 46 82 50 76C54 82 62 76 58 72C62 66 56 62 50 66Z" fill="none" stroke="#e8862e" stroke-width="3"/>`,
  ),
  잼병: jar(
    '#fff',
    '#d8283f',
    42,
    `<path d="M16 20L26 36M34 20L42 36M52 20L60 36M70 20L78 36" stroke="#ff5c70" stroke-width="4"/>` +
      `<path d="M16 36C24 44 34 40 38 36C44 44 56 44 62 36C68 42 78 44 84 36" stroke="#ff5c70" stroke-width="3"/>` +
      `<path d="M50 56C40 50 34 56 36 64C38 74 46 80 50 84C54 80 62 74 64 64C66 56 60 50 50 56Z" fill="#ff5c70" stroke-width="2.5"/>` +
      `<path d="M42 54L50 58L58 54L54 50H46Z" fill="#43b04a" stroke-width="2"/>` +
      dot(45, 64, 1.5, '#fff') +
      dot(55, 64, 1.5, '#fff') +
      dot(50, 72, 1.5, '#fff'),
  ),
  유리병:
    `<path d="M40 22H60V34C74 40 78 50 78 60V86C78 91 74 94 68 94H32C26 94 22 91 22 86V60C22 50 26 40 40 34Z" fill="#c9f0e4"/>` +
    `<rect x="41" y="6" width="18" height="18" rx="4" fill="#c98a4a"/>` +
    `<path d="M44 12H56M44 18H56" stroke="#9a5b2e" stroke-width="2"/>` +
    `<path d="M32 54C30 60 30 74 32 82" stroke="#fff" stroke-width="5"/>` +
    `<path d="M44 34V40" stroke="#fff" stroke-width="3"/>` +
    sparkle(66, 58, 7, '#fff') +
    sparkle(14, 30, 6) +
    sparkle(86, 36, 5),
  페트병:
    `<path d="M42 16H58V22C70 26 72 32 72 40V48C68 50 68 54 72 56V84C72 90 68 94 62 94H38C32 94 28 90 28 84V56C32 54 32 50 28 48V40C28 32 30 26 42 22Z" fill="#bfe6ff"/>` +
    `<rect x="40" y="6" width="20" height="12" rx="3" fill="#3b78e6"/>` +
    `<path d="M40 10H60M40 14H60" stroke="#1d4f8a" stroke-width="1.8"/>` +
    `<rect x="28" y="58" width="44" height="18" fill="#43b04a"/>` +
    `<path d="M28 58H72M28 76H72" stroke-width="3"/>` +
    `<path d="M29 84H71M28 40H72" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M36 28C34 32 34 38 36 42" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M50 62c-2 4-3 5-3 7a3 3 0 0 0 6 0c0-2-1-3-3-7z" fill="#fff" stroke-width="1.8"/>`,
  우유병:
    `<path d="M34 12H66V22C66 30 76 36 76 50V86C76 91 72 94 66 94H34C28 94 24 91 24 86V50C24 36 34 30 34 22Z" fill="#fff"/>` +
    `<path d="M34 10C34 4 66 4 66 10V16H34Z" fill="#3b78e6"/>` +
    `<path d="M34 16H66" stroke-width="3"/>` +
    `<path d="M26 44C34 40 40 48 50 44S66 40 74 44" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M24 58H76V78H24Z" fill="#7ec8f0"/>` +
    `<path d="M50 62C42 62 40 68 42 72C44 76 56 76 58 72C60 68 58 62 50 62Z" fill="#fff" stroke-width="2.2"/>` +
    `<path d="M44 62L42 58M56 62L58 58" stroke-width="2.2"/>` +
    dot(47, 68, 1.4) +
    dot(53, 68, 1.4) +
    `<path d="M30 28V36" stroke="#dfe8f5" stroke-width="3"/>`,
  빨대컵:
    `<path d="M26 62C10 62 10 84 26 84" stroke-width="12"/><path d="M26 62C10 62 10 84 26 84" stroke="#ffd23f" stroke-width="5"/>` +
    `<path d="M74 62C90 62 90 84 74 84" stroke-width="12"/><path d="M74 62C90 62 90 84 74 84" stroke="#ffd23f" stroke-width="5"/>` +
    `<path d="M26 44H74L70 88C70 92 66 94 62 94H38C34 94 30 92 30 88Z" fill="#ff9aa8"/>` +
    `<circle cx="42" cy="66" r="5" fill="#fff" stroke="none"/><circle cx="58" cy="76" r="4" fill="#fff" stroke="none"/><circle cx="54" cy="58" r="3" fill="#fff" stroke="none"/>` +
    `<path d="M54 36V12L66 4" stroke-width="10"/><path d="M54 36V12L66 4" stroke="#3b8fe0" stroke-width="4"/>` +
    `<path d="M22 44C22 32 78 32 78 44Z" fill="#3b8fe0"/>` +
    `<rect x="20" y="42" width="60" height="7" rx="3" fill="#3b8fe0"/>`,
  이유식:
    baby(72, 24, 17) +
    `<ellipse cx="71" cy="31" rx="4" ry="3" fill="#e8553d" stroke-width="2"/>` +
    `<path d="M16 56H80C80 78 66 90 48 90S16 78 16 56Z" fill="#7ec8f0"/>` +
    `<ellipse cx="48" cy="56" rx="32" ry="8" fill="#ffd28a"/>` +
    `<path d="M34 54q4 -3 8 0M52 56q4 -3 8 0" stroke="#e8a44a" stroke-width="2.5"/>` +
    `<path d="M28 70l6 6M60 76l6-6" stroke="#fff" stroke-width="3"/>` +
    `<path d="M36 52L56 34" stroke-width="10"/><path d="M36 52L56 34" stroke="#ff9f1a" stroke-width="4"/>` +
    `<ellipse cx="60" cy="31" rx="7" ry="4.5" fill="#ffd28a" transform="rotate(-40 60 31)"/>`,
  턱받이:
    baby(50, 20, 15) +
    `<path d="M22 14C14 14 10 24 12 32L14 38C8 50 10 80 50 92C90 80 92 50 86 38L88 32C90 24 86 14 78 14C70 14 66 20 66 26C66 34 58 40 50 40S34 34 34 26C34 20 30 14 22 14Z" fill="#7ec8f0"/>` +
    `<path d="M20 50C20 74 34 82 50 86C66 82 80 74 80 50" stroke="#fff" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<path d="M50 54C44 50 38 54 40 60C42 66 48 68 50 70C52 68 58 66 60 60C62 54 56 50 50 54Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<circle cx="24" cy="24" r="3.5" fill="#fff" stroke-width="2"/><circle cx="76" cy="24" r="3.5" fill="#fff" stroke-width="2"/>`,
  보행기:
    `<path d="M24 60L14 84M76 60L86 84M40 62L36 84M60 62L64 84" stroke-width="5"/>` +
    `<path d="M24 60L14 84M76 60L86 84" stroke="#8a96b0" stroke-width="2"/>` +
    `<ellipse cx="50" cy="84" rx="40" ry="8" fill="#ffd23f"/>` +
    `<circle cx="14" cy="90" r="5" fill="#30354f"/><circle cx="86" cy="90" r="5" fill="#30354f"/><circle cx="50" cy="94" r="5" fill="#30354f"/>` +
    `<path d="M36 56C36 40 64 40 64 56Z" fill="#ffd9e2"/>` +
    baby(50, 28, 15) +
    tube('M36 50L26 56', SKIN, 5) +
    tube('M64 50L74 56', SKIN, 5) +
    `<ellipse cx="50" cy="60" rx="38" ry="10" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="57" rx="16" ry="4" fill="#ffd9e2" stroke-width="2.5"/>` +
    `<circle cx="22" cy="60" r="4" fill="#ffd23f" stroke-width="2"/><circle cx="78" cy="60" r="4" fill="#43b04a" stroke-width="2"/>`,
  아기띠:
    `<path d="M14 96V60C14 46 28 40 50 40S86 46 86 60V96Z" fill="#43b04a"/>` +
    `<path d="M40 40Q50 48 60 40" fill="${SKIN}"/>` +
    `<circle cx="50" cy="20" r="14" fill="${SKIN}"/><path d="M36 18C36 6 44 4 50 4S64 6 64 18C60 12 56 11 50 11S40 12 36 18Z" fill="#5a3b24"/>` +
    dot(45, 21, 2.2) +
    dot(55, 21, 2.2) +
    `<path d="M46 27q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M30 42L30 66M70 42L70 66" stroke-width="12"/><path d="M30 42L30 66M70 42L70 66" stroke="#8e4fc9" stroke-width="6"/>` +
    baby(50, 58, 12, true) +
    `<path d="M28 64H72V86C72 92 66 96 60 96H40C34 96 28 92 28 86Z" fill="#a45cf0"/>` +
    `<path d="M34 72H66" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/>` +
    tube('M36 90L30 96', SKIN, 4) +
    tube('M64 90L70 96', SKIN, 4),
  아기침대:
    `<path d="M16 82V94M84 82V94" stroke-width="7"/>` +
    `<path d="M50 4V12" stroke-width="2.5"/><path d="M32 12H68" stroke-width="3"/>` +
    `<path d="M36 12V20M64 12V20" stroke-width="2"/>` +
    sparkle(36, 24, 5) +
    `<circle cx="64" cy="24" r="4" fill="#ff9aa8" stroke-width="2"/>` +
    `<rect x="14" y="56" width="72" height="12" rx="3" fill="#fff"/>` +
    baby(34, 52, 10, true) +
    `<path d="M40 60C44 48 78 48 82 58Z" fill="#7ec8f0" stroke-width="3"/>` +
    `<rect x="10" y="36" width="80" height="6" rx="3" fill="#f5e3c0"/>` +
    `<rect x="10" y="78" width="80" height="6" rx="3" fill="#f5e3c0"/>` +
    `<path d="M24 42V78M36 42V78M48 42V78M60 42V78M72 42V78" stroke-width="6"/>` +
    `<path d="M24 42V78M36 42V78M48 42V78M60 42V78M72 42V78" stroke="#f5e3c0" stroke-width="2.5"/>` +
    `<rect x="6" y="30" width="10" height="60" rx="4" fill="#e8b877"/><rect x="84" y="30" width="10" height="60" rx="4" fill="#e8b877"/>`,
  요람:
    `<path d="M8 78C28 96 72 96 92 78" stroke-width="10"/><path d="M8 78C28 96 72 96 92 78" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M26 82V90M74 82V90" stroke-width="5"/>` +
    `<path d="M12 44H88L82 76C80 82 76 84 70 84H30C24 84 20 82 18 76Z" fill="#c98a4a"/>` +
    `<path d="M14 54H86M16 64H84M18 74H82" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M10 44C10 22 38 14 44 44Z" fill="#e8b877"/>` +
    baby(32, 40, 10, true) +
    `<path d="M38 46C44 32 84 34 88 44Z" fill="#ff9aa8" stroke-width="3"/>` +
    `<rect x="8" y="42" width="84" height="6" rx="3" fill="#e8b877"/>` +
    `<path d="M4 60q-2 8 2 14M96 60q2 8-2 14" stroke="#9aa6c4" stroke-width="3"/>`,
  딸랑이:
    `<g transform="rotate(-30 50 50)">` +
    `<path d="M50 56V94" stroke-width="12"/><path d="M50 56V94" stroke="#43b04a" stroke-width="5"/>` +
    `<circle cx="50" cy="94" r="6" fill="#43b04a"/>` +
    `<circle cx="50" cy="56" r="7" fill="${HL}"/>` +
    `<circle cx="50" cy="32" r="24" fill="#bfe6ff"/>` +
    `<circle cx="42" cy="36" r="6" fill="#ff5c70" stroke-width="2.5"/><circle cx="56" cy="40" r="6" fill="#ffd23f" stroke-width="2.5"/><circle cx="52" cy="24" r="6" fill="#8e4fc9" stroke-width="2.5"/>` +
    `<path d="M34 22C36 16 40 13 44 12" stroke="#fff" stroke-width="3.5"/>` +
    `</g>` +
    `<path d="M76 8q6 4 4 12M86 4q8 8 4 20M12 26q-4 8 2 14" stroke="#9aa6c4" stroke-width="3"/>`,
  오뚝이:
    `<path d="M16 52q-6 14 0 26M84 52q6 14 0 26" stroke="#9aa6c4" stroke-width="3"/>` +
    `<ellipse cx="50" cy="94" rx="24" ry="3" fill="#dfe8f5" stroke="none"/>` +
    `<g transform="rotate(14 50 92)">` +
    `<circle cx="50" cy="66" r="27" fill="#e8553d"/>` +
    `<path d="M32 60C40 70 60 70 68 60" stroke="#ffd23f" stroke-width="4"/>` +
    `<circle cx="50" cy="28" r="17" fill="${SKIN}"/>` +
    `<path d="M33 28C32 10 68 10 67 28C62 18 38 18 33 28Z" fill="#30354f"/>` +
    dot(44, 30, 2.3) +
    dot(56, 30, 2.3) +
    `<path d="M46 36q4 3 8 0" stroke-width="2.5"/>` +
    cheeks(34, 10, 50) +
    `</g>`,
  공깃돌:
    `<path d="M24 62C26 34 50 18 66 22" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="5 5"/>` +
    [
      [76, 22, 20, '#ff5c70'],
      [22, 76, -10, '#ffd23f'],
      [46, 82, 15, '#3b8fe0'],
      [70, 74, -25, '#43b04a'],
      [44, 60, 40, '#a45cf0'],
    ]
      .map(
        ([x, y, r, c]) =>
          `<g transform="translate(${x} ${y}) rotate(${r})">` +
          `<path d="M0 -12C5 -12 13 6 11 9C9 12 -9 12 -11 9C-13 6 -5 -12 0 -12Z" fill="${c}"/>` +
          `<path d="M-3 -6C-5 -2 -6 1 -6 3" stroke="#fff" stroke-width="2.5" opacity=".7"/>` +
          `</g>`,
      )
      .join(''),
  윷:
    [
      [22, -14, true],
      [42, -4, false],
      [60, 6, true],
      [78, 16, false],
    ]
      .map(
        ([x, r, back]) =>
          `<g transform="translate(${x} 52) rotate(${r})">` +
          `<rect x="-8" y="-38" width="16" height="76" rx="7" fill="${back ? '#e8b877' : '#f5e3c0'}"/>` +
          (back
            ? `<path d="M-4 -22L4 -14M4 -22L-4 -14M-4 -4L4 4M4 -4L-4 4M-4 14L4 22M4 14L-4 22" stroke-width="2.5"/>`
            : `<path d="M-3 -30V30" stroke="#fff" stroke-width="3" opacity=".8"/>`) +
          `</g>`,
      )
      .join(''),
  윷판:
    `<rect x="8" y="8" width="84" height="84" rx="6" fill="#f5e3c0"/>` +
    `<path d="M18 18L82 82M82 18L18 82" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<rect x="18" y="18" width="64" height="64" stroke="#9a5b2e" stroke-width="2.5"/>` +
    [18, 30.8, 43.6, 56.4, 69.2, 82]
      .flatMap((v, i) =>
        i === 0 || i === 5
          ? []
          : [
              [v, 18],
              [v, 82],
              [18, v],
              [82, v],
            ],
      )
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke-width="2"/>`)
      .join('') +
    [
      [29, 29],
      [39, 39],
      [71, 29],
      [61, 39],
      [29, 71],
      [39, 61],
      [71, 71],
      [61, 61],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke-width="2"/>`)
      .join('') +
    [
      [18, 18],
      [82, 18],
      [18, 82],
      [82, 82],
      [50, 50],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#fff" stroke-width="2.5"/>`)
      .join('') +
    `<circle cx="82" cy="56.4" r="5" fill="#e8553d" stroke-width="2.5"/><circle cx="43.6" cy="18" r="5" fill="#3b78e6" stroke-width="2.5"/>`,
  바둑돌:
    `<path d="M4 58C4 90 44 90 44 58Z" fill="#9a5b2e"/><ellipse cx="24" cy="58" rx="20" ry="7" fill="#6b3e26"/>` +
    `<path d="M56 58C56 90 96 90 96 58Z" fill="#9a5b2e"/><ellipse cx="76" cy="58" rx="20" ry="7" fill="#6b3e26"/>` +
    `<ellipse cx="16" cy="54" rx="7" ry="4" fill="#30354f"/><ellipse cx="28" cy="52" rx="7" ry="4" fill="#30354f"/><ellipse cx="22" cy="46" rx="7" ry="4" fill="#30354f"/>` +
    `<ellipse cx="70" cy="54" rx="7" ry="4" fill="#fff"/><ellipse cx="82" cy="52" rx="7" ry="4" fill="#fff"/><ellipse cx="76" cy="46" rx="7" ry="4" fill="#fff"/>` +
    `<ellipse cx="40" cy="24" rx="13" ry="7" fill="#30354f"/><path d="M34 21q4-2 8-2" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<ellipse cx="62" cy="18" rx="13" ry="7" fill="#fff"/>` +
    `<ellipse cx="50" cy="92" rx="10" ry="5" fill="#30354f"/>`,
  바둑판:
    `<path d="M6 76V86C6 90 10 92 14 92H86C90 92 94 90 94 86V76Z" fill="#c98a4a"/>` +
    `<rect x="6" y="8" width="88" height="72" rx="4" fill="#e8b877"/>` +
    `<g stroke="#6b3e26" stroke-width="1.6"><path d="M16 16V72M28 16V72M40 16V72M52 16V72M64 16V72M76 16V72M86 16V72"/><path d="M16 16H86M16 28H86M16 40H86M16 52H86M16 64H86M16 72H86"/></g>` +
    dot(28, 28, 2, '#6b3e26') +
    dot(64, 64, 2, '#6b3e26') +
    `<circle cx="40" cy="40" r="5.5" fill="#30354f" stroke-width="2"/><circle cx="52" cy="40" r="5.5" fill="#fff" stroke-width="2"/>` +
    `<circle cx="52" cy="52" r="5.5" fill="#30354f" stroke-width="2"/><circle cx="64" cy="40" r="5.5" fill="#fff" stroke-width="2"/>` +
    `<circle cx="40" cy="52" r="5.5" fill="#fff" stroke-width="2"/><circle cx="28" cy="64" r="5.5" fill="#30354f" stroke-width="2"/>`,
  체스판:
    `<rect x="6" y="18" width="88" height="76" rx="3" fill="#fff"/>` +
    Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) =>
        (r + c) % 2
          ? `<rect x="${(10 + c * 10).toFixed(1)}" y="${(22 + r * 8.5).toFixed(1)}" width="10" height="8.5" fill="#6b3e26" stroke="none"/>`
          : '',
      ).join(''),
    ).join('') +
    `<rect x="10" y="22" width="80" height="68" stroke-width="2"/>` +
    `<path d="M30 40C30 34 34 30 38 30C38 24 42 24 42 30C48 32 50 40 48 50L50 58H28L32 50C28 48 26 44 30 40Z" fill="#fff" stroke-width="3"/>` +
    `<rect x="24" y="56" width="30" height="7" rx="2" fill="#fff" stroke-width="3"/>` +
    dot(39, 36, 1.8) +
    `<circle cx="70" cy="22" r="7" fill="#30354f" stroke-width="3"/>` +
    `<path d="M64 30H76L78 50H62Z" fill="#30354f" stroke-width="3"/>` +
    `<rect x="58" y="48" width="24" height="7" rx="2" fill="#30354f" stroke-width="3"/>`,
  퍼즐조각:
    `<path d="M10 22H30C28 14 32 8 38 8S48 14 46 22H62V38C70 36 76 40 76 46S70 56 62 54V72H46C48 80 44 84 38 84S28 80 30 72H10Z" fill="#3b8fe0"/>` +
    `<path d="M62 54C70 56 76 52 76 46S70 36 62 38V22H92V72H62Z" fill="#ffd23f"/>` +
    `<path d="M62 22V38C70 36 76 40 76 46S70 56 62 54V72" fill="none" stroke-width="3.5"/>` +
    `<path d="M16 30C18 28 22 28 24 30" stroke="#fff" stroke-width="3" opacity=".7"/>` +
    `<g transform="translate(24 78) rotate(-12)"><path d="M0 0H16C15 -6 18 -10 22 -10S29 -6 28 0H44V16H0Z" fill="#43b04a"/></g>`,
  큐브:
    (() => {
      const top = [
        ['#fff', '#ffd23f', '#fff'],
        ['#43b04a', '#fff', '#e8553d'],
        ['#fff', '#3b78e6', '#ffd23f'],
      ];
      const left = [
        ['#e8553d', '#e8553d', '#ff9f1a'],
        ['#43b04a', '#e8553d', '#e8553d'],
        ['#e8553d', '#ffd23f', '#e8553d'],
      ];
      const right = [
        ['#3b78e6', '#3b78e6', '#fff'],
        ['#3b78e6', '#43b04a', '#3b78e6'],
        ['#ff9f1a', '#3b78e6', '#3b78e6'],
      ];
      // 꼭짓점: 위 (50,8), 가운데 (50,48), 왼 (14,28), 오른 (86,28), 아래 (50,94)
      const quad = (o: number[], u: number[], v: number[], i: number, j: number, c: string) => {
        const p = (a: number, b: number) => `${(o[0] + u[0] * a + v[0] * b).toFixed(1)} ${(o[1] + u[1] * a + v[1] * b).toFixed(1)}`;
        return `<path d="M${p(i, j)}L${p(i + 1, j)}L${p(i + 1, j + 1)}L${p(i, j + 1)}Z" fill="${c}" stroke-width="2.5"/>`;
      };
      let s = `<path d="M50 8L86 28V72L50 94L14 72V28Z" fill="${INK}"/>`;
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
          s += quad([14, 28], [12, -6.67], [12, 6.67], j, i, top[i][j]);
          s += quad([14, 28], [12, 6.67], [0, 14.67], j, i, left[i][j]);
          s += quad([50, 48], [12, -6.67], [0, 14.67], j, i, right[i][j]);
        }
      return s + `<path d="M50 8L86 28V72L50 94L14 72V28Z" stroke-width="4"/><path d="M14 28L50 48L86 28M50 48V94" stroke-width="3.5"/>`;
    })(),
  도미노:
    `<path d="M4 90H96" stroke="#dfe8f5" stroke-width="3"/>` +
    domino(16, 70, 0, [[0, 0]], [[-4, -4], [4, 4]]) +
    domino(36, 70, 0, [[-4, -4], [4, 4], [0, 0]], [[-4, -4], [4, 4], [-4, 4], [4, -4]]) +
    domino(56, 72, 20, [[0, 0], [-4, 4], [4, -4]], [[0, 0]]) +
    domino(77, 80, 62, [[-4, -4], [4, 4]], [[-4, -4], [4, 4], [-4, 4], [4, -4], [0, 0]]) +
    `<path d="M50 40q6-8 14-6M62 50q8-6 14-2" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M80 40L90 54" stroke="#3b78e6" stroke-width="4"/><path d="M84 54H91V47" stroke="#3b78e6" stroke-width="4"/>`,
  인형집:
    `<path d="M50 4L94 36H6Z" fill="#e85d9a"/>` +
    `<rect x="12" y="36" width="76" height="58" fill="#ffd9e2"/>` +
    `<path d="M12 64H88M50 36V64" stroke-width="3"/>` +
    `<rect x="18" y="52" width="24" height="8" rx="2" fill="#7ec8f0" stroke-width="2.5"/><rect x="16" y="46" width="7" height="12" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="60" y="42" width="12" height="12" rx="2" fill="#bfe6ff" stroke-width="2.5"/><path d="M66 42V54M60 48H72" stroke-width="1.8"/>` +
    `<path d="M20 78H44M24 78V90M40 78V90" stroke-width="3"/><rect x="18" y="74" width="28" height="5" rx="2" fill="#e8b877" stroke-width="2.5"/>` +
    `<circle cx="68" cy="72" r="6" fill="${SKIN}" stroke-width="2.5"/><path d="M62 70C62 62 74 62 74 70Z" fill="#e8862e" stroke-width="2.5"/>` +
    `<path d="M60 92C60 80 76 80 76 92Z" fill="#a45cf0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="22" r="5" fill="#fff"/>`,
  봉제인형:
    `<circle cx="28" cy="20" r="11" fill="#c98a4a"/><circle cx="72" cy="20" r="11" fill="#c98a4a"/>` +
    `<circle cx="28" cy="20" r="5" fill="#f2c79a" stroke="none"/><circle cx="72" cy="20" r="5" fill="#f2c79a" stroke="none"/>` +
    `<ellipse cx="22" cy="86" rx="12" ry="9" fill="#c98a4a"/><ellipse cx="78" cy="86" rx="12" ry="9" fill="#c98a4a"/>` +
    `<ellipse cx="50" cy="72" rx="24" ry="22" fill="#c98a4a"/>` +
    `<ellipse cx="18" cy="64" rx="8" ry="12" fill="#c98a4a" transform="rotate(30 18 64)"/><ellipse cx="82" cy="64" rx="8" ry="12" fill="#c98a4a" transform="rotate(-30 82 64)"/>` +
    `<ellipse cx="50" cy="76" rx="13" ry="12" fill="#f2c79a"/>` +
    `<path d="M50 50V94" stroke="#6b3e26" stroke-width="2" stroke-dasharray="3 3"/>` +
    `<circle cx="50" cy="38" r="24" fill="#c98a4a"/>` +
    `<ellipse cx="50" cy="46" rx="10" ry="8" fill="#f2c79a"/>` +
    dot(41, 34, 3) +
    dot(59, 34, 3) +
    dot(50, 42, 3) +
    `<path d="M46 48q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M30 22L38 28M34 20L32 30" stroke="#6b3e26" stroke-width="2"/>` +
    `<rect x="62" y="60" width="12" height="12" rx="2" fill="#7ec8f0" stroke-width="2" transform="rotate(12 68 66)"/>` +
    `<path d="M64 62l8 8" stroke-width="1.6" stroke-dasharray="2 2"/>` +
    `<path d="M40 62L50 66L60 62L58 70L50 67L42 70Z" fill="#ff5c70" stroke-width="2.5"/>`,
  손인형:
    `<path d="M34 62H66L70 100H30Z" fill="${SKIN}"/>` +
    `<path d="M26 88H74L78 100H22Z" fill="#3b78e6"/>` +
    `<path d="M26 34C26 14 74 14 74 34V66H26Z" fill="#43b04a"/>` +
    tube('M10 44C16 48 20 52 26 56', '#43b04a', 8) +
    tube('M90 44C84 48 80 52 74 56', '#43b04a', 8) +
    `<circle cx="10" cy="42" r="6" fill="#5fc24a"/><circle cx="90" cy="42" r="6" fill="#5fc24a"/>` +
    `<circle cx="36" cy="18" r="11" fill="#fff"/><circle cx="64" cy="18" r="11" fill="#fff"/>` +
    dot(38, 19, 4.5) +
    dot(62, 19, 4.5) +
    `<path d="M36 40Q50 52 64 40" stroke-width="4"/>` +
    cheeks(42, 20) +
    `<path d="M24 66H76" stroke="#ffd23f" stroke-width="6"/><path d="M50 68V88" stroke="#e8b08a" stroke-width="2.5"/>` +
    `<path d="M50 48l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="${HL}" stroke-width="2"/>`,
  마리오네트:
    `<path d="M24 12H76M50 4V22" stroke-width="9"/><path d="M24 12H76M50 4V22" stroke="#c98a4a" stroke-width="4"/>` +
    `<g stroke="#8a96b0" stroke-width="1.8"><path d="M24 12L20 58M76 12L82 50M50 22V34M36 12L38 90M64 12L64 90"/></g>` +
    `<path d="M38 50H62L60 72H40Z" fill="#e8553d"/>` +
    `<path d="M40 60H60" stroke="#ffd23f" stroke-width="3"/>` +
    tube('M40 52L20 58', SKIN, 5) +
    tube('M60 52L82 50', SKIN, 5) +
    tube('M44 72L38 90', '#3b78e6', 6) +
    tube('M56 72L64 90', '#3b78e6', 6) +
    `<circle cx="50" cy="40" r="11" fill="${SKIN}"/>` +
    `<path d="M39 38C39 26 61 26 61 38C56 33 44 33 39 38Z" fill="#6b3e26"/>` +
    dot(46, 41, 1.8) +
    dot(54, 41, 1.8) +
    `<path d="M47 46q3 2 6 0" stroke-width="2"/>` +
    `<circle cx="42" cy="44" r="2.5" fill="#ff5c70" stroke="none" opacity=".6"/><circle cx="58" cy="44" r="2.5" fill="#ff5c70" stroke="none" opacity=".6"/>` +
    `<path d="M50 56V66" stroke-width="2" opacity=".5"/>`,
};
