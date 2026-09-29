// 그림 묶음: 물놀이·캠핑 물건, 모자·옷·한복, 가방, 필기구 (l2). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(한복·저고리·두루마기 / 운동복·체육복 / 잠바·패딩 / 스웨터·가디건 / 속옷·팬티 / 배낭·책가방 / 펜 다섯)는 색·실루엣을 다르게 했다.
import { INK, SKIN, HL, dot, sparkle, tube, drop, blob, cheeks } from '../pictureKit.ts';

/** 물결 (아래를 채운 물) */
const water = (y: number, fill = '#7ec8f0') =>
  `<path d="M4 ${y}q6-5 12 0t12 0t12 0t12 0t12 0t12 0t12 0t8 0V96H4Z" fill="${fill}"/>`;

/** 색동 줄 (소매 위 가로 띠) */
const saekdong = (lines: [string, string][]) => lines.map(([d, c]) => `<path d="${d}" stroke="${c}" stroke-width="5"/>`).join('');

/** 고름 (한복 가슴의 긴 리본) */
const goreum = (x: number, y: number, c: string) =>
  `<path d="M${x} ${y}L${x - 8} ${y + 26}L${x - 2} ${y + 27}L${x + 2} ${y + 4}Z" fill="${c}" stroke-width="2.5"/>` +
  `<path d="M${x} ${y}L${x + 6} ${y + 30}L${x + 12} ${y + 28}L${x + 4} ${y + 2}Z" fill="${c}" stroke-width="2.5"/>` +
  `<ellipse cx="${x + 1}" cy="${y + 1}" rx="6" ry="4" fill="${c}" stroke-width="2.5"/>`;

/** 벙어리장갑 한 짝 ((x,y)는 손목 아래 가운데) */
const mitten = (x: number, y: number, rot: number, flip: boolean) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)">` +
  `<path d="M-13 -26C-27 -26 -29 -44 -20 -46C-16 -47 -14 -43 -13 -39Z" fill="#e8553d"/>` +
  `<path d="M-15 -14V-50C-15 -68 15 -68 15 -50V-14Z" fill="#e8553d"/>` +
  `<rect x="-17" y="-16" width="34" height="16" rx="4" fill="#fff"/>` +
  `<path d="M-9 -12V-4M-3 -12V-4M3 -12V-4M9 -12V-4" stroke="#dfe8f5" stroke-width="2.5"/>` +
  `<circle cx="0" cy="-40" r="6" fill="#fff" stroke-width="2.5"/>` +
  `</g>`;

/** 가로로 누운 펜을 (50,50)에 두고 돌린다 (끝이 +x쪽) */
const pen = (rot: number, inner: string, dx = 0, dy = 0) =>
  `<g transform="translate(${50 + dx} ${50 + dy}) rotate(${rot})">${inner}</g>`;

export const PICS: Record<string, string> = {
  무릎보호대:
    tube('M20 20L62 44L46 84', SKIN, 22) +
    `<path d="M22 4C34 6 44 12 47 16L32 44C20 42 10 38 4 30Z" fill="#3b78e6"/>` +
    `<path d="M34 80H54C66 80 78 84 78 94H34Z" fill="#e8553d"/>` +
    `<rect x="52" y="26" width="26" height="38" rx="12" fill="#30354f" transform="rotate(-20 65 45)"/>` +
    `<ellipse cx="67" cy="45" rx="8" ry="12" fill="#e8553d" transform="rotate(-20 67 45)"/>` +
    sparkle(88, 22, 6),
  구명조끼:
    `<path d="M26 8H40L50 40L60 8H74C72 22 76 32 84 38V90H16V38C24 32 28 22 26 8Z" fill="#ff9f1a"/>` +
    `<path d="M50 40V90" stroke-width="3"/>` +
    `<path d="M29 12H39M61 12H71" stroke="#dfe8f5" stroke-width="5"/>` +
    `<path d="M22 44V86M78 44V86" stroke="#ffc46b" stroke-width="3"/>` +
    `<rect x="16" y="54" width="68" height="8" fill="#30354f"/><rect x="16" y="72" width="68" height="8" fill="#30354f"/>` +
    `<rect x="43" y="51" width="14" height="14" rx="3" fill="${HL}"/><rect x="43" y="69" width="14" height="14" rx="3" fill="${HL}"/>`,
  튜브:
    water(78, '#bfe6ff') +
    `<circle cx="50" cy="48" r="38" fill="#e8553d"/>` +
    `<circle cx="50" cy="48" r="27" stroke="#fff" stroke-width="18" stroke-dasharray="21.2 21.2"/>` +
    `<circle cx="50" cy="48" r="16" fill="#bfe6ff"/>` +
    `<path d="M24 30C28 24 34 20 40 18" stroke="#fff" stroke-width="4" opacity=".6"/>`,
  물안경:
    tube('M8 52C8 26 92 26 92 52', '#3b8fe0', 6) +
    `<ellipse cx="29" cy="52" rx="21" ry="17" fill="#3b8fe0"/><ellipse cx="71" cy="52" rx="21" ry="17" fill="#3b8fe0"/>` +
    `<ellipse cx="29" cy="52" rx="15" ry="11" fill="#bfe6ff"/><ellipse cx="71" cy="52" rx="15" ry="11" fill="#bfe6ff"/>` +
    `<path d="M47 50Q50 44 53 50" stroke-width="5"/>` +
    `<path d="M20 48q3-5 8-5M62 48q3-5 8-5" stroke="#fff" stroke-width="3.5"/>` +
    drop(18, 76, 0.8) +
    drop(84, 74, 0.8),
  수영모:
    water(84) +
    `<circle cx="22" cy="60" r="6" fill="${SKIN}"/><circle cx="78" cy="60" r="6" fill="${SKIN}"/>` +
    `<circle cx="50" cy="58" r="28" fill="${SKIN}"/>` +
    `<path d="M20 58C16 26 32 12 50 12S84 26 80 58C72 50 62 46 50 46S28 50 20 58Z" fill="#ff5c70"/>` +
    `<path d="M32 24C36 20 42 18 48 18" stroke="#fff" stroke-width="4"/>` +
    sparkle(62, 30, 7, '#fff') +
    dot(41, 62) +
    dot(59, 62) +
    `<path d="M43 71q7 6 14 0"/>` +
    cheeks(70, 15) +
    water(84),
  오리발:
    [
      [32, -14],
      [68, 14],
    ]
      .map(
        ([x, r]) =>
          `<g transform="translate(${x} 50) rotate(${r}) scale(.72)">` +
          `<path d="M-14 -50C-14 -60 14 -60 14 -50L16 -14L40 44C30 56 -30 56 -40 44L-16 -14Z" fill="#ffd23f"/>` +
          `<path d="M-14 -50C-14 -60 14 -60 14 -50L16 -12H-16Z" fill="#3b8fe0"/>` +
          `<ellipse cx="0" cy="-50" rx="9" ry="5" fill="#1d4f8a"/>` +
          `<path d="M-8 -4L-22 40M0 -4V46M8 -4L22 40" stroke="#e0a800" stroke-width="4"/>` +
          `</g>`,
      )
      .join(''),
  스노클:
    tube('M60 80C74 80 78 74 78 66V14', '#ff9f1a', 8) +
    `<rect x="71" y="6" width="14" height="10" rx="3" fill="#3b8fe0"/>` +
    `<circle cx="44" cy="66" r="28" fill="${SKIN}"/>` +
    `<path d="M16 62C14 42 28 36 44 36S74 42 72 62C66 52 56 48 44 48S22 52 16 62Z" fill="#5a3b24"/>` +
    `<path d="M14 58H74" stroke="#3b8fe0" stroke-width="5"/>` +
    `<rect x="24" y="50" width="40" height="18" rx="8" fill="#3b8fe0"/><rect x="29" y="54" width="30" height="10" rx="5" fill="#bfe6ff"/>` +
    `<path d="M33 58q3-3 6-3" stroke="#fff" stroke-width="3"/>` +
    `<path d="M68 60H76" stroke="#3b8fe0" stroke-width="5"/>` +
    water(74),
  부표:
    `<path d="M50 4V10M36 10L40 14M64 10L60 14" stroke="${HL}" stroke-width="4"/>` +
    `<circle cx="50" cy="22" r="7" fill="${HL}"/>` +
    `<rect x="45" y="28" width="10" height="16" fill="#8a96b0"/>` +
    `<path d="M24 74L32 42H68L76 74Z" fill="#e8553d"/>` +
    `<path d="M28 58L30 52H70L72 58Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="74" rx="30" ry="8" fill="#c9412e"/>` +
    water(76),
  침낭:
    `<path d="M70 12a8 8 0 1 0 8 10a6 6 0 1 1 -8 -10Z" fill="${HL}"/>` +
    sparkle(52, 16, 5) +
    sparkle(90, 34, 4) +
    `<rect x="6" y="38" width="88" height="42" rx="21" fill="#43b04a"/>` +
    `<path d="M50 40V78M64 40V78M78 40V78" stroke="#2f8a3a" stroke-width="3"/>` +
    `<path d="M40 44H88" stroke="${HL}" stroke-width="3" stroke-dasharray="4 3"/>` +
    `<circle cx="27" cy="59" r="17" fill="#2f8a3a"/>` +
    `<circle cx="27" cy="60" r="12" fill="${SKIN}"/>` +
    `<path d="M15 57C15 47 22 46 27 46S39 47 39 57C35 53 31 52 27 52S19 53 15 57Z" fill="#5a3b24"/>` +
    `<path d="M20 61q3 2 5 0M29 61q3 2 5 0" stroke-width="2.5"/><path d="M25 67q2 1 4 0" stroke-width="2.5"/>` +
    `<path d="M10 62C12 76 44 78 48 68" stroke="#e8f7e0" stroke-width="3"/>`,
  랜턴:
    `<circle cx="50" cy="48" r="42" fill="#fff4c2" stroke="none" opacity=".6"/>` +
    `<path d="M36 20C36 4 64 4 64 20" stroke-width="5"/>` +
    `<path d="M28 24L36 14H64L72 24Z" fill="#3a9e47"/>` +
    `<rect x="30" y="24" width="40" height="46" rx="8" fill="#fff1b8"/>` +
    `<path d="M50 34C42 46 42 56 50 58C58 56 58 46 50 34Z" fill="#ff9f1a"/>` +
    `<path d="M50 44C46 50 47 55 50 55C53 55 54 50 50 44Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M38 26V68M62 26V68" stroke="#3a9e47" stroke-width="3"/>` +
    `<rect x="24" y="70" width="52" height="18" rx="5" fill="#3a9e47"/>` +
    `<path d="M12 40H20M80 40H88M16 22L22 28M84 22L78 28" stroke="${HL}" stroke-width="4"/>`,
  버너:
    `<path d="M38 42C32 32 40 26 40 16C46 26 48 34 42 42Z" fill="#4a90e2"/>` +
    `<path d="M50 42C44 30 50 22 50 10C56 22 58 32 52 42Z" fill="#4a90e2"/>` +
    `<path d="M62 42C56 32 60 26 60 16C66 26 68 34 62 42Z" fill="#4a90e2"/>` +
    `<path d="M48 40C46 34 50 30 50 26C52 30 54 34 52 40Z" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M14 42H34M66 42H86" stroke="#8a96b0" stroke-width="6"/><path d="M14 42H34M66 42H86" stroke-width="2" stroke="${INK}"/>` +
    `<rect x="28" y="40" width="44" height="10" rx="3" fill="#8a96b0"/>` +
    `<rect x="30" y="50" width="40" height="40" rx="9" fill="#e8553d"/>` +
    `<path d="M30 60H70" stroke-width="3"/>` +
    `<path d="M38 66V82" stroke="#ff9a8a" stroke-width="4"/>` +
    `<circle cx="76" cy="56" r="6" fill="#30354f"/>`,
  돗자리:
    `<path d="M16 42H84L96 86H4Z" fill="#fff"/>` +
    `<g stroke="none" fill="#3b8fe0" opacity=".5"><path d="M27 42H38L32 86H14Z"/><path d="M50 42H61L68 86H50Z"/><path d="M73 42H84L96 86H86Z"/>` +
    `<path d="M13 54H87L90 64H10Z"/><path d="M8 72H92L95 82H5Z"/></g>` +
    `<path d="M16 42H84L96 86H4Z"/>` +
    `<rect x="12" y="30" width="76" height="16" rx="8" fill="#fff"/>` +
    `<path d="M28 30V46M50 30V46M72 30V46" stroke="#3b8fe0" stroke-width="5" opacity=".5"/>` +
    `<rect x="12" y="30" width="76" height="16" rx="8"/>` +
    `<circle cx="20" cy="38" r="5" fill="#dfe8f5"/>` +
    `<path d="M6 94l3-7l3 7M88 94l3-7l3 7" stroke="#43b04a" stroke-width="3"/>`,
  파라솔:
    `<ellipse cx="50" cy="90" rx="36" ry="6" fill="#f2c14e"/>` +
    tube('M50 40V88', '#9a5b2e', 4) +
    `<path d="M6 46C12 22 30 12 50 12S88 22 94 46Q87 52 80 46Q73 52 65 46Q58 52 50 46Q43 52 35 46Q28 52 20 46Q13 52 6 46Z" fill="#e8553d"/>` +
    `<path d="M50 12L65 46Q58 52 50 46Z" fill="#fff"/><path d="M50 12L20 46Q28 52 35 46Z" fill="#fff"/><path d="M50 12Q80 20 94 46Q87 52 80 46Z" fill="#fff"/>` +
    `<circle cx="50" cy="9" r="4" fill="${HL}"/>` +
    `<path d="M80 72a7 7 0 1 0 0.1 0Z" fill="${HL}" stroke="none"/>`,
  선글라스:
    `<path d="M10 38L4 34M90 38L96 34" stroke-width="5"/>` +
    `<path d="M8 34H46C48 34 48 40 47 46C45 62 38 68 27 68C16 68 9 60 8 48C7 40 6 34 8 34Z" fill="#30354f"/>` +
    `<path d="M92 34H54C52 34 52 40 53 46C55 62 62 68 73 68C84 68 91 60 92 48C93 40 94 34 92 34Z" fill="#30354f"/>` +
    `<path d="M46 40Q50 34 54 40" stroke-width="5"/>` +
    `<path d="M16 42L26 52M20 40L34 54M62 42L72 52M66 40L80 54" stroke="#7ec8f0" stroke-width="3.5"/>` +
    sparkle(84, 20, 7) +
    sparkle(16, 80, 5),
  야구모자:
    `<path d="M10 72C10 40 26 26 46 26S82 40 82 72Z" fill="#3b78e6"/>` +
    `<path d="M46 26C38 40 36 56 38 72M46 26C58 40 64 56 64 72" stroke="#2a58b0" stroke-width="3"/>` +
    `<path d="M10 72H82" stroke-width="5"/>` +
    `<path d="M60 70C74 64 90 64 95 70C97 76 90 80 80 80H56Z" fill="#e8553d"/>` +
    `<circle cx="46" cy="25" r="5" fill="#e8553d"/>` +
    `<circle cx="26" cy="54" r="7" fill="#fff" stroke-width="3"/>`,
  밀짚모자:
    `<ellipse cx="50" cy="64" rx="46" ry="18" fill="#f2c14e"/>` +
    `<ellipse cx="50" cy="64" rx="36" ry="12" stroke="#c98b4f" stroke-width="2.5" stroke-dasharray="5 4"/>` +
    `<path d="M26 64C26 30 36 22 50 22S74 30 74 64C62 70 38 70 26 64Z" fill="#ffd23f"/>` +
    `<path d="M36 34L64 60M44 28L70 50M30 44L52 64M60 30L32 58M68 40L44 64" stroke="#e0a800" stroke-width="2.5"/>` +
    `<path d="M26 50C38 56 62 56 74 50V62C62 68 38 68 26 62Z" fill="#e8553d"/>` +
    `<path d="M68 58L80 74L72 76Z" fill="#e8553d" stroke-width="2.5"/>`,
  털모자:
    blob('#fff', [
      [50, 18, 9],
      [42, 14, 6],
      [58, 14, 6],
      [44, 23, 6],
      [56, 23, 6],
    ]) +
    `<path d="M18 72C18 36 32 26 50 26S82 36 82 72Z" fill="#e8553d"/>` +
    `<path d="M24 52l7-7l7 7l6-7l6 7l6-7l6 7l7-7l7 7" stroke="#fff" stroke-width="4"/>` +
    `<rect x="14" y="64" width="72" height="24" rx="9" fill="#c9412e"/>` +
    `<path d="M24 68V84M32 68V84M40 68V84M48 68V84M56 68V84M64 68V84M72 68V84" stroke="#ff8a7a" stroke-width="3"/>`,
  귀마개:
    tube('M22 56C20 14 80 14 78 56', '#8e4fc9', 7) +
    blob('#ff9aa8', [
      [20, 62, 14],
      [11, 55, 8],
      [29, 55, 8],
      [11, 70, 8],
      [29, 70, 8],
      [20, 49, 8],
      [20, 76, 8],
    ]) +
    blob('#ff9aa8', [
      [80, 62, 14],
      [71, 55, 8],
      [89, 55, 8],
      [71, 70, 8],
      [89, 70, 8],
      [80, 49, 8],
      [80, 76, 8],
    ]) +
    `<circle cx="20" cy="62" r="7" fill="#ffd0dc" stroke="none"/><circle cx="80" cy="62" r="7" fill="#ffd0dc" stroke="none"/>`,
  스카프:
    `<path d="M8 96V70C8 58 24 52 50 52S92 58 92 70V96Z" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="30" r="20" fill="${SKIN}"/>` +
    `<path d="M30 28C28 10 40 8 50 8S72 10 70 28C66 20 58 18 50 18S34 20 30 28Z" fill="#5a3b24"/>` +
    dot(43, 31, 2.6) +
    dot(57, 31, 2.6) +
    `<path d="M45 38q5 4 10 0" stroke-width="2.8"/>` +
    `<path d="M28 46C38 58 62 58 72 46L74 56C62 70 38 70 26 56Z" fill="#ff9f1a"/>` +
    `<path d="M58 60L46 94L58 90L66 62Z" fill="#ff9f1a"/>` +
    `<path d="M62 60L80 88L88 78L68 58Z" fill="#ff9f1a"/>` +
    `<circle cx="62" cy="60" r="7" fill="#e8862e"/>` +
    dot(38, 60, 2.6, '#fff') +
    dot(50, 63, 2.6, '#fff') +
    dot(56, 80, 2.6, '#fff') +
    dot(78, 78, 2.6, '#fff'),
  넥타이:
    `<path d="M22 4L42 12L46 28L28 22Z" fill="#fff"/><path d="M78 4L58 12L54 28L72 22Z" fill="#fff"/>` +
    `<path d="M44 26H56L68 76L50 94L32 76Z" fill="#3b78e6"/>` +
    `<path d="M40 14H60L56 28H44Z" fill="#3b78e6"/>` +
    `<path d="M40 42L60 34M36 60L64 48M34 78L66 64" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M44 26H56L68 76L50 94L32 76Z"/>`,
  나비넥타이:
    `<path d="M44 44L14 28C7 25 5 32 5 50S7 75 14 72L44 56Z" fill="#e8553d"/>` +
    `<path d="M56 44L86 28C93 25 95 32 95 50S93 75 86 72L56 56Z" fill="#e8553d"/>` +
    `<path d="M20 40L38 48M20 60L38 52M80 40L62 48M80 60L62 52" stroke="#c9412e" stroke-width="3"/>` +
    `<rect x="42" y="38" width="16" height="24" rx="5" fill="#c9412e"/>` +
    dot(16, 50, 3, '#fff') +
    dot(84, 50, 3, '#fff') +
    dot(28, 36, 2.6, '#fff') +
    dot(72, 36, 2.6, '#fff') +
    dot(28, 64, 2.6, '#fff') +
    dot(72, 64, 2.6, '#fff'),
  벨트:
    `<g transform="rotate(-8 50 50)">` +
    `<path d="M24 40H86L96 50L86 60H24Z" fill="#9a5b2e"/>` +
    `<path d="M28 44H84" stroke="#c98b4f" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    dot(62, 50, 2.8) +
    dot(70, 50, 2.8) +
    dot(78, 50, 2.8) +
    `<rect x="36" y="37" width="10" height="26" rx="2" fill="#6b3e26"/>` +
    `<rect x="4" y="30" width="28" height="40" rx="6" fill="${HL}"/>` +
    `<rect x="11" y="37" width="14" height="26" rx="3" fill="#9a5b2e"/>` +
    `<path d="M18 50H34" stroke-width="4"/>` +
    `</g>`,
  멜빵:
    `<path d="M32 10L18 14L8 34L20 42L28 32V58H72V32L80 42L92 34L82 14L68 10C64 18 36 18 32 10Z" fill="#fff1b8"/>` +
    `<path d="M26 54H74L80 94H56L50 72L44 94H20Z" fill="#3b78e6"/>` +
    `<path d="M26 54H74" stroke-width="4"/>` +
    tube('M34 12L36 58', '#e8553d', 7) +
    tube('M66 12L64 58', '#e8553d', 7) +
    `<rect x="30" y="52" width="12" height="9" rx="2" fill="${HL}"/><rect x="58" y="52" width="12" height="9" rx="2" fill="${HL}"/>`,
  양복:
    `<path d="M32 10L16 16L8 80L20 82L28 38Z" fill="#4a5068"/><path d="M68 10L84 16L92 80L80 82L72 38Z" fill="#4a5068"/>` +
    `<path d="M32 10H68L76 92H24Z" fill="#4a5068"/>` +
    `<path d="M34 10L50 46L66 10Z" fill="#fff"/>` +
    `<path d="M46 14H54L56 38L50 46L44 38Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M33 10L42 36L36 40L50 48L42 18Z" fill="#30354f"/><path d="M67 10L58 36L64 40L50 48L58 18Z" fill="#30354f"/>` +
    `<path d="M50 48V92" stroke-width="2.5"/>` +
    `<path d="M60 56L66 52L70 56Z" fill="#fff" stroke-width="2.5"/>` +
    dot(45, 64, 2.8, '#fff') +
    dot(45, 76, 2.8, '#fff'),
  한복:
    `<path d="M32 38L10 94H90L68 38Z" fill="#e85d9a"/>` +
    `<path d="M40 50L30 92M60 50L70 92M50 48V94" stroke="#c7437f" stroke-width="3"/>` +
    `<path d="M36 10L14 18C6 28 6 42 12 46L30 40L34 24Z" fill="#fff"/>` +
    `<path d="M64 10L86 18C94 28 94 42 88 46L70 40L66 24Z" fill="#fff"/>` +
    saekdong([
      ['M14 22V41', '#e8553d'],
      ['M20 19V40', '#43b04a'],
      ['M26 16V38', '#3b8fe0'],
      ['M86 22V41', '#e8553d'],
      ['M80 19V40', '#43b04a'],
      ['M74 16V38', '#3b8fe0'],
    ]) +
    `<path d="M36 10L14 18C6 28 6 42 12 46L30 40L34 24Z"/><path d="M64 10L86 18C94 28 94 42 88 46L70 40L66 24Z"/>` +
    `<path d="M36 8H64L68 40H32Z" fill="#ffd23f"/>` +
    `<path d="M40 8L58 32" stroke="#3b78e6" stroke-width="7"/><path d="M40 8L58 32" stroke="#fff" stroke-width="2.5"/>` +
    goreum(57, 31, '#e8553d'),
  저고리:
    `<path d="M34 20L10 30C3 44 5 60 14 64L30 60L32 36Z" fill="#ff9aa8"/>` +
    `<path d="M66 20L90 30C97 44 95 60 86 64L70 60L68 36Z" fill="#ff9aa8"/>` +
    saekdong([
      ['M16 30V61', '#e8553d'],
      ['M22 28V60', '#ffd23f'],
      ['M28 25V58', '#43b04a'],
      ['M84 30V61', '#e8553d'],
      ['M78 28V60', '#ffd23f'],
      ['M72 25V58', '#43b04a'],
    ]) +
    `<path d="M34 20L10 30C3 44 5 60 14 64L30 60L32 36Z"/><path d="M66 20L90 30C97 44 95 60 86 64L70 60L68 36Z"/>` +
    `<path d="M34 18H66L70 74C60 78 40 78 30 74Z" fill="#43b04a"/>` +
    `<path d="M40 18L60 48" stroke="#8e4fc9" stroke-width="8"/><path d="M40 18L60 48" stroke="#fff" stroke-width="3"/>` +
    goreum(59, 47, '#8e4fc9'),
  두루마기:
    `<path d="M34 10L10 20C4 34 4 50 10 56L28 52L30 30Z" fill="#8a96b0"/>` +
    `<path d="M66 10L90 20C96 34 96 50 90 56L72 52L70 30Z" fill="#8a96b0"/>` +
    `<path d="M34 8H66L80 94H20Z" fill="#aab4c8"/>` +
    `<path d="M10 50L28 46M90 50L72 46" stroke="#fff" stroke-width="4"/>` +
    `<path d="M38 8L58 40" stroke="#4a5068" stroke-width="8"/><path d="M38 8L58 40" stroke="#fff" stroke-width="3"/>` +
    `<path d="M58 40L66 94" stroke-width="3"/>` +
    goreum(58, 40, '#4a5068'),
  버선:
    `<path d="M16 16H44V48C54 58 68 60 82 52C88 48 92 42 94 34C98 60 88 86 62 88H30C18 88 12 80 12 68C12 60 16 56 16 50Z" fill="#fff"/>` +
    `<rect x="14" y="10" width="32" height="12" rx="4" fill="#dfe8f5"/>` +
    `<path d="M44 58C54 66 70 68 82 62" stroke="#c3cde0" stroke-width="3"/>` +
    `<circle cx="66" cy="74" r="5" fill="#ff9aa8" stroke-width="2.5"/>` +
    dot(66, 74, 2, HL) +
    `<path d="M58 76q-4-4-8 0M74 76q4-4 8 0" stroke="#43b04a" stroke-width="3"/>`,
  고무신:
    `<g transform="translate(-4 -24) scale(.9)">` +
    `<path d="M6 56C6 70 14 80 30 80H66C82 80 92 66 96 44C90 52 82 54 74 52L28 46C16 46 6 46 6 56Z" fill="#ffd0dc"/>` +
    `<path d="M10 52C14 44 44 42 54 50C44 57 20 58 10 52Z" fill="#c7437f"/>` +
    `</g>` +
    `<path d="M6 60C6 76 14 88 30 88H66C82 88 92 72 96 48C90 56 82 58 74 56L28 50C16 50 6 50 6 60Z" fill="#ff9aa8"/>` +
    `<path d="M10 56C14 48 44 46 54 54C44 61 20 62 10 56Z" fill="#c7437f"/><path d="M54 54C66 58 78 58 90 54" stroke="#e85d9a" stroke-width="3"/>` +
    `<path d="M12 74C16 80 22 82 30 82H66" stroke="#ffd0dc" stroke-width="3"/>` +
    `<circle cx="80" cy="66" r="5" fill="#fff" stroke-width="2.5"/>` +
    dot(80, 66, 2, HL),
  운동복:
    `<path d="M30 52H70L76 94H54L50 66L46 94H24Z" fill="#3b78e6"/>` +
    `<path d="M29 58L25 92M71 58L75 92" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 6L18 12L6 50L18 54L28 30V56H72V30L82 54L94 50L82 12L66 6C62 14 38 14 34 6Z" fill="#3b78e6"/>` +
    `<path d="M20 14L10 50M26 14L16 52M80 14L90 50M74 14L84 52" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 6C38 14 62 14 66 6L62 2H38Z" fill="#2a58b0"/>` +
    `<path d="M50 12V56" stroke="#fff" stroke-width="3"/>` +
    `<rect x="47" y="16" width="6" height="8" rx="2" fill="${HL}" stroke-width="2"/>`,
  체육복:
    `<path d="M26 56H74L80 90H56L50 76L44 90H20Z" fill="#3b8fe0"/>` +
    `<path d="M28 60L24 88M72 60L76 88" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 8L20 12L6 30L19 42L27 34V60H73V34L81 42L94 30L80 12L66 8C62 18 38 18 34 8Z" fill="#fff"/>` +
    `<path d="M34 8C38 18 62 18 66 8" stroke="#3b8fe0" stroke-width="5"/>` +
    `<path d="M11 36L24 25M89 36L76 25" stroke="#3b8fe0" stroke-width="4"/>` +
    `<rect x="54" y="28" width="14" height="7" rx="2" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M28 58H72" stroke="#3b8fe0" stroke-width="4"/>`,
  교복:
    `<path d="M30 56H70L82 94H18Z" fill="#8a96b0"/>` +
    `<path d="M38 56L32 94M50 56V94M62 56L68 94" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M24 70H76M22 82H78" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M34 6L20 12L12 54L22 56L28 32V60H72V32L78 56L88 54L80 12L66 6Z" fill="#3b4a6b"/>` +
    `<path d="M36 6L50 38L64 6Z" fill="#fff"/>` +
    `<path d="M35 6L42 30L37 34L50 40L43 16Z" fill="#2a3452"/><path d="M65 6L58 30L63 34L50 40L57 16Z" fill="#2a3452"/>` +
    `<path d="M42 16L50 22L58 16L58 26L50 22L42 26Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="62" cy="44" r="4.5" fill="${HL}" stroke-width="2.5"/>` +
    `<path d="M50 40V60" stroke-width="2.5"/>`,
  비옷:
    drop(12, 10, 0.9) +
    drop(88, 12, 0.9) +
    drop(10, 52, 0.8) +
    drop(90, 56, 0.8) +
    `<path d="M32 40L16 50L12 76L24 78L28 60Z" fill="#5fc24a"/><path d="M68 40L84 50L88 76L76 78L72 60Z" fill="#5fc24a"/>` +
    `<path d="M32 38L24 94H76L68 38Z" fill="#5fc24a"/>` +
    `<path d="M26 40C22 4 78 4 74 40C66 48 34 48 26 40Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="30" r="14" fill="${SKIN}"/>` +
    dot(45, 30, 2.4) +
    dot(55, 30, 2.4) +
    `<path d="M46 36q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M50 46V92" stroke="#3a9e47" stroke-width="3"/>` +
    dot(56, 58, 3, HL) +
    dot(56, 72, 3, HL) +
    dot(56, 86, 3, HL),
  잠바:
    `<path d="M34 12L18 18L8 70L20 74L28 40V82H72V40L80 74L92 70L82 18L66 12Z" fill="#3a9e47"/>` +
    `<path d="M34 12C38 20 62 20 66 12L64 6H36Z" fill="#6b3e26"/>` +
    `<rect x="26" y="78" width="48" height="12" rx="4" fill="#6b3e26"/>` +
    `<path d="M6 68L20 72L20 80L6 76Z" fill="#6b3e26"/><path d="M94 68L80 72L80 80L94 76Z" fill="#6b3e26"/>` +
    `<path d="M50 16V78" stroke="${HL}" stroke-width="3"/>` +
    `<rect x="47" y="22" width="6" height="9" rx="2" fill="${HL}" stroke-width="2"/>` +
    `<path d="M34 50L40 64M66 50L60 64" stroke-width="3"/>`,
  패딩:
    `<path d="M32 18C26 0 74 0 68 18Z" fill="#c9412e"/>` +
    `<path d="M24 22C12 24 8 30 8 40V80C8 86 22 86 22 80Z" fill="#e8553d"/>` +
    `<path d="M76 22C88 24 92 30 92 40V80C92 86 78 86 78 80Z" fill="#e8553d"/>` +
    `<path d="M30 14C22 14 20 20 20 26V88C20 94 80 94 80 88V26C80 20 78 14 70 14Z" fill="#e8553d"/>` +
    `<path d="M20 34Q50 40 80 34M20 50Q50 56 80 50M20 66Q50 72 80 66M20 80Q50 86 80 80" stroke-width="3"/>` +
    `<path d="M8 46Q15 49 22 46M8 62Q15 65 22 62M78 46Q85 49 92 46M78 62Q85 65 92 62" stroke-width="3"/>` +
    `<path d="M50 16V92" stroke="#fff" stroke-width="3"/>` +
    `<path d="M28 26C28 36 30 60 30 80" stroke="#ff9a8a" stroke-width="3"/>`,
  스웨터:
    `<path d="M36 12L20 16L8 72L20 76L28 38V84H72V38L80 76L92 72L80 16L64 12C60 20 40 20 36 12Z" fill="#4a90e2"/>` +
    `<path d="M36 12C40 22 60 22 64 12" stroke="#2a6fc4" stroke-width="7"/><path d="M36 12C40 22 60 22 64 12" stroke-width="3" transform="translate(0 4)"/>` +
    `<path d="M30 48l5-6l5 6l5-6l5 6l5-6l5 6l5-6l5 6" stroke="#fff" stroke-width="4"/>` +
    `<path d="M30 60H70" stroke="#fff" stroke-width="3" stroke-dasharray="3 4"/>` +
    `<rect x="26" y="76" width="48" height="12" rx="3" fill="#2a6fc4"/>` +
    `<path d="M32 78V86M38 78V86M44 78V86M50 78V86M56 78V86M62 78V86M68 78V86" stroke="#9ec7f5" stroke-width="2.5"/>` +
    `<path d="M7 68L21 72L19 82L5 78Z" fill="#2a6fc4"/><path d="M93 68L79 72L81 82L95 78Z" fill="#2a6fc4"/>`,
  가디건:
    `<path d="M36 12L50 50L64 12Z" fill="#fff"/>` +
    `<path d="M36 12L20 16L8 72L20 76L28 38V88H50V50Z" fill="#3a9e47"/>` +
    `<path d="M64 12L80 16L92 72L80 76L72 38V88H50V50Z" fill="#3a9e47"/>` +
    `<path d="M36 12L50 50L64 12" stroke="#2f7a38" stroke-width="3"/>` +
    dot(46, 58, 3.2, HL) +
    dot(46, 68, 3.2, HL) +
    dot(46, 78, 3.2, HL) +
    `<rect x="31" y="64" width="11" height="12" rx="2" fill="#2f7a38" stroke-width="2.5"/><rect x="58" y="64" width="11" height="12" rx="2" fill="#2f7a38" stroke-width="2.5"/>` +
    `<path d="M28 84H72" stroke="#2f7a38" stroke-width="4"/>` +
    `<path d="M50 50V88"/>`,
  블라우스:
    `<path d="M36 14C26 12 16 16 12 26C10 34 16 42 22 40L28 36Z" fill="#ffd0dc"/>` +
    `<path d="M64 14C74 12 84 16 88 26C90 34 84 42 78 40L72 36Z" fill="#ffd0dc"/>` +
    `<path d="M36 14H64L72 36L74 90H26L28 36Z" fill="#ffd0dc"/>` +
    `<path d="M18 38q3 4 6 0M76 38q3 4 6 0" stroke="#e85d9a" stroke-width="3"/>` +
    `<path d="M36 14Q30 22 36 26Q34 32 42 32Q44 38 50 34Q56 38 58 32Q66 32 64 26Q70 22 64 14Z" fill="#fff"/>` +
    `<path d="M44 32L50 26L56 32L50 38Z" fill="#e85d9a" stroke-width="2.5"/>` +
    dot(50, 50, 2.8, '#e85d9a') +
    dot(50, 62, 2.8, '#e85d9a') +
    dot(50, 74, 2.8, '#e85d9a') +
    `<path d="M50 38V90" stroke="#e85d9a" stroke-width="2"/>`,
  반바지:
    `<path d="M16 18H84L92 76H58L50 44L42 76H8Z" fill="#ff9f1a"/>` +
    `<rect x="16" y="18" width="68" height="12" fill="#e8862e"/>` +
    `<path d="M46 30L42 40M54 30L58 40" stroke-width="3"/>` +
    `<path d="M22 36C26 44 32 46 38 46M78 36C74 44 68 46 62 46" stroke="#ffd08a" stroke-width="3"/>` +
    `<path d="M10 66H42M58 66H90" stroke="#e8862e" stroke-width="4"/>`,
  레깅스:
    `<path d="M28 8H72C74 26 70 40 66 56C64 70 64 82 62 94H52L50 40L48 94H38C36 82 36 70 34 56C30 40 26 26 28 8Z" fill="#8e4fc9"/>` +
    `<path d="M28 8H72L72 16H28Z" fill="#6a36a0"/>` +
    `<path d="M40 22C42 40 44 60 44 86M60 22C58 40 56 60 56 86" stroke="#b884f0" stroke-width="3"/>` +
    sparkle(38, 44, 4, '#fff') +
    sparkle(62, 62, 4, '#fff'),
  속옷:
    `<path d="M16 12H24C26 24 36 24 38 12H46C46 26 50 30 50 38V88H12V38C12 30 16 26 16 12Z" fill="#fff"/>` +
    `<path d="M24 12C26 24 36 24 38 12" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M54 46H96L94 58C88 60 82 68 80 80H70C68 68 62 60 56 58Z" fill="#fff"/>` +
    `<rect x="54" y="44" width="42" height="8" rx="2" fill="#7ec8f0"/>`,
  팬티:
    `<path d="M10 24H90L86 42C74 46 62 58 58 78H42C38 58 26 46 14 42Z" fill="#ff9aa8"/>` +
    `<rect x="10" y="20" width="80" height="10" rx="3" fill="#e85d9a"/>` +
    `<path d="M14 42C26 46 38 58 42 78M86 42C74 46 62 58 58 78" stroke="#e85d9a" stroke-width="3"/>` +
    dot(32, 38, 3.5, '#fff') +
    dot(50, 42, 3.5, '#fff') +
    dot(68, 38, 3.5, '#fff') +
    dot(50, 60, 3.5, '#fff') +
    `<path d="M46 32l4-4l4 4l-4 4Z" fill="${HL}" stroke-width="2"/>`,
  벙어리장갑:
    `<path d="M30 88C36 98 64 98 70 88" stroke="#3b8fe0" stroke-width="3"/>` + mitten(30, 90, -12, false) + mitten(70, 90, 12, true),
  손수건:
    `<g transform="rotate(-8 50 50)">` +
    `<path d="M14 14H86V86H14Z" fill="#7ec8f0"/>` +
    `<path d="M22 22H78V78H22Z" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/>` +
    dot(36, 36, 4, '#fff') +
    dot(64, 36, 4, '#fff') +
    dot(50, 50, 4, '#fff') +
    dot(36, 64, 4, '#fff') +
    `<path d="M86 60V86H60Z" fill="#bfe6ff"/>` +
    `<path d="M86 60L60 86" />` +
    `</g>`,
  배낭:
    tube('M40 18C40 6 60 6 60 18', '#2f7a38', 4) +
    `<rect x="16" y="40" width="12" height="36" rx="5" fill="#2f7a38"/><rect x="72" y="40" width="12" height="36" rx="5" fill="#2f7a38"/>` +
    `<rect x="24" y="18" width="52" height="76" rx="16" fill="#43b04a"/>` +
    `<path d="M24 36C24 20 76 20 76 36V48C60 54 40 54 24 48Z" fill="#2f7a38"/>` +
    `<path d="M38 50V64M62 50V64" stroke="#6b3e26" stroke-width="5"/>` +
    `<rect x="34" y="60" width="8" height="8" rx="1" fill="${HL}" stroke-width="2.5"/><rect x="58" y="60" width="8" height="8" rx="1" fill="${HL}" stroke-width="2.5"/>` +
    `<rect x="34" y="70" width="32" height="18" rx="6" fill="#2f7a38"/>`,
  책가방:
    `<rect x="28" y="10" width="12" height="26" rx="2" fill="#e8553d"/>` +
    `<rect x="40" y="14" width="10" height="22" rx="2" fill="${HL}"/>` +
    `<rect x="50" y="8" width="12" height="28" rx="2" fill="#43b04a"/>` +
    `<path d="M66 32V14L70 6L74 14V32Z" fill="#ffd23f"/>` +
    `<rect x="16" y="28" width="68" height="64" rx="12" fill="#3b8fe0"/>` +
    `<path d="M16 34H84" stroke="#2a6fc4" stroke-width="4"/>` +
    `<rect x="28" y="54" width="44" height="30" rx="8" fill="#7ec8f0"/>` +
    `<path d="M32 60H68" stroke="${HL}" stroke-width="3"/>` +
    `<circle cx="50" cy="72" r="5" fill="#ff9aa8" stroke-width="2.5"/>`,
  서류가방:
    tube('M38 34V24C38 18 62 18 62 24V34', '#6b3e26', 5) +
    `<rect x="8" y="32" width="84" height="56" rx="7" fill="#9a5b2e"/>` +
    `<path d="M8 50H92" stroke-width="3"/>` +
    `<path d="M14 38H86" stroke="#c98b4f" stroke-width="3"/>` +
    `<rect x="24" y="44" width="12" height="12" rx="2" fill="${HL}"/><rect x="64" y="44" width="12" height="12" rx="2" fill="${HL}"/>`,
  여행가방:
    `<path d="M40 30V10M60 30V10" stroke-width="5"/><path d="M40 30V10M60 30V10" stroke="#8a96b0" stroke-width="2"/>` +
    `<rect x="34" y="4" width="32" height="9" rx="4" fill="#30354f"/>` +
    `<circle cx="32" cy="90" r="5" fill="#30354f"/><circle cx="68" cy="90" r="5" fill="#30354f"/>` +
    `<rect x="20" y="28" width="60" height="60" rx="9" fill="#ff9f1a"/>` +
    `<path d="M34 34V82M50 34V82M66 34V82" stroke="#e8862e" stroke-width="3"/>` +
    `<circle cx="38" cy="52" r="6" fill="#3b8fe0" stroke-width="2.5"/>` +
    `<rect x="54" y="62" width="14" height="10" rx="2" fill="#43b04a" stroke-width="2.5"/>`,
  손가방:
    tube('M32 46C32 14 68 14 68 46', '#c7437f', 5) +
    `<path d="M18 44H82L90 90H10Z" fill="#e85d9a"/>` +
    `<path d="M18 44H82L78 62C64 68 36 68 22 62Z" fill="#c7437f"/>` +
    `<circle cx="50" cy="64" r="5" fill="${HL}"/>` +
    `<path d="M22 80H78" stroke="#ff9aa8" stroke-width="3"/>`,
  연필깎이:
    `<g transform="rotate(8 20 44)">` +
    `<path d="M6 35H32V53H6Z" fill="#ffd23f"/>` +
    `<rect x="2" y="35" width="10" height="18" rx="3" fill="#ff9aa8"/>` +
    `<path d="M12 44H30" stroke="#e0a800" stroke-width="2.5"/>` +
    `</g>` +
    `<rect x="28" y="22" width="50" height="68" rx="12" fill="#3b8fe0"/>` +
    `<rect x="32" y="62" width="42" height="24" rx="5" fill="#bfe6ff"/>` +
    `<path d="M38 80c3-6 7-6 8 0c2-6 7-6 9 0c2-6 7-6 8 0" stroke="#c98b4f" stroke-width="3"/>` +
    `<circle cx="36" cy="44" r="7" fill="#30354f"/>` +
    `<circle cx="78" cy="42" r="6" fill="#8a96b0"/>` +
    tube('M78 42L90 22', '#8a96b0', 4) +
    `<circle cx="90" cy="20" r="5" fill="#e8553d"/>`,
  샤프:
    pen(
      135,
      `<rect x="-48" y="-5" width="12" height="10" rx="2" fill="#dfe8f5"/>` +
        `<rect x="-38" y="-8" width="54" height="16" rx="3" fill="#4a90e2"/>` +
        `<rect x="-34" y="-14" width="24" height="6" rx="2" fill="#dfe8f5"/>` +
        `<rect x="14" y="-8.5" width="16" height="17" rx="3" fill="#30354f"/>` +
        `<path d="M19 -6V6M24 -6V6" stroke="#8a96b0" stroke-width="2"/>` +
        `<path d="M30 -7L42 -2V2L30 7Z" fill="#dfe8f5"/>` +
        `<path d="M42 0H50" stroke-width="2.5"/>`,
      4,
      -4,
    ) +
    `<path d="M26 92c8-8 14 4 22-4" stroke="#8a96b0" stroke-width="2.5"/>`,
  볼펜:
    pen(
      135,
      `<rect x="-52" y="-5" width="10" height="10" rx="2" fill="#3b78e6"/>` +
        `<rect x="-44" y="-8" width="66" height="16" rx="4" fill="#fff"/>` +
        `<rect x="-40" y="-14" width="26" height="6" rx="2" fill="#3b78e6"/>` +
        `<rect x="18" y="-8.5" width="12" height="17" rx="2" fill="#3b78e6"/>` +
        `<path d="M30 -7L44 -2V2L30 7Z" fill="#dfe8f5"/>` +
        dot(47, 0, 2.4),
      4,
      -4,
    ) +
    `<path d="M34 88c-8 0-10-8-4-10c8-2 10 10 2 12c-6 2-10-2-10-6" stroke="#3b78e6" stroke-width="3"/>`,
  사인펜:
    `<g transform="rotate(-10 26 52)">` +
    `<rect x="19" y="36" width="14" height="54" rx="4" fill="#fff"/>` +
    `<rect x="18" y="10" width="16" height="30" rx="5" fill="#e8553d"/>` +
    `<rect x="20" y="82" width="12" height="8" rx="2" fill="#e8553d"/>` +
    `</g>` +
    `<g transform="rotate(10 74 52)">` +
    `<rect x="67" y="36" width="14" height="54" rx="4" fill="#fff"/>` +
    `<rect x="66" y="10" width="16" height="30" rx="5" fill="#43b04a"/>` +
    `<rect x="68" y="82" width="12" height="8" rx="2" fill="#43b04a"/>` +
    `</g>` +
    `<rect x="43" y="30" width="14" height="62" rx="4" fill="#fff"/>` +
    `<rect x="44" y="84" width="12" height="8" rx="2" fill="#3b78e6"/>` +
    `<path d="M44 30L47 20H53L56 30Z" fill="#dfe8f5"/>` +
    `<path d="M47 20C47 12 53 12 53 20Z" fill="#3b78e6"/>` +
    `<rect x="47" y="40" width="6" height="36" rx="2" fill="#3b78e6" stroke="none" opacity=".5"/>`,
  형광펜:
    `<path d="M8 64H46M8 80H60M8 94H40" stroke="#c3cde0" stroke-width="5"/>` +
    `<rect x="4" y="55" width="44" height="18" rx="2" fill="#fff27a" stroke="none" opacity=".6"/>` +
    pen(
      140,
      `<rect x="-30" y="-13" width="40" height="26" rx="8" fill="#ffd23f"/>` +
        `<path d="M10 -11L22 -9V9L10 11Z" fill="#ffc933"/>` +
        `<path d="M22 -6L32 -3L30 6H22Z" fill="#fff27a"/>` +
        `<path d="M-24 -6H0" stroke="#fff4b0" stroke-width="4"/>`,
      18,
      -14,
    ),
  만년필:
    pen(
      135,
      `<rect x="-46" y="-9" width="54" height="18" rx="8" fill="#30354f"/>` +
        `<rect x="-2" y="-9.5" width="6" height="19" fill="${HL}"/>` +
        `<rect x="-40" y="-15" width="26" height="6" rx="2" fill="${HL}"/>` +
        `<path d="M8 -7L18 -6V6L8 7Z" fill="#30354f"/>` +
        `<path d="M18 -9C28 -9 40 -4 50 0C40 4 28 9 18 9Z" fill="${HL}"/>` +
        `<path d="M34 0H48" stroke-width="2"/>` +
        dot(31, 0, 2.4),
      4,
      -4,
    ) +
    `<path d="M26 92c6-8 14-2 20-8" stroke="#3b78e6" stroke-width="3"/>` +
    drop(12, 70, 0.7),
};
