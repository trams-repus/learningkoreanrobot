// 그림 묶음: 부엌 가전·그릇, 빨래·방 가구, 몸단장, 욕실, 구급 물건 (l2). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(전자레인지·오븐 / 머그컵·찻잔·유리컵·종이컵 / 깡통·캔 / 휴지통·재활용함 / 싱크대·세면대 / 로션·선크림·연고 / 옷장·찬장·서랍)는 색·실루엣을 다르게 했다.
import { HL, dot, sparkle, tube, drop } from '../pictureKit.ts';

const steam = (x: number, y: number) =>
  `<path d="M${x - 6} ${y}c-4-4 4-7 0-12M${x + 6} ${y}c-4-4 4-7 0-12" stroke="#9aa6c4" stroke-width="3"/>`;

/** 비눗방울 (속 빈 동그라미 + 반짝) */
const bubble = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#e6f6ff" stroke-width="2.5"/><path d="M${x - r * 0.5} ${y - r * 0.2}q0 ${-r * 0.35} ${r * 0.35} ${-r * 0.4}" stroke="#fff" stroke-width="2"/>`;

/** 둥근 손잡이 (문·서랍) */
const knob = (x: number, y: number, r = 3.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${HL}" stroke-width="2.5"/>`;

/** 흰 십자 (구급) */
const cross = (x: number, y: number, s: number) =>
  `<path d="M${x - s / 3} ${y - s}H${x + s / 3}V${y - s / 3}H${x + s}V${y + s / 3}H${x + s / 3}V${y + s}H${x - s / 3}V${y + s / 3}H${x - s}V${y - s / 3}H${x - s / 3}Z" fill="#fff"/>`;

/** 막대 옷걸이에 걸린 작은 옷 */
const tee = (x: number, y: number, fill: string) =>
  `<path d="M${x - 6} ${y}L${x - 14} ${y + 6}L${x - 10} ${y + 12}L${x - 7} ${y + 10}V${y + 26}H${x + 7}V${y + 10}L${x + 10} ${y + 12}L${x + 14} ${y + 6}L${x + 6} ${y}Q${x} ${y + 5} ${x - 6} ${y}Z" fill="${fill}"/>`;

export const PICS: Record<string, string> = {
  전자레인지:
    `<rect x="8" y="22" width="84" height="58" rx="7" fill="#dfe8f5"/>` +
    `<rect x="15" y="30" width="50" height="42" rx="4" fill="#ffe27a"/>` +
    `<path d="M22 60C22 52 30 50 40 50S58 52 58 60Z" fill="#e8553d"/><ellipse cx="40" cy="62" rx="20" ry="4" fill="#fff"/>` +
    steam(40, 46) +
    `<rect x="70" y="30" width="16" height="42" rx="3" fill="#fff"/>` +
    `<rect x="73" y="34" width="10" height="7" rx="1.5" fill="#30354f" stroke-width="2"/>` +
    dot(75, 50, 2.6) + dot(81, 50, 2.6) + dot(75, 57, 2.6) + dot(81, 57, 2.6) +
    `<circle cx="78" cy="66" r="3.5" fill="#43b04a" stroke-width="2"/>` +
    `<rect x="14" y="80" width="10" height="6" rx="2" fill="#8a96b0"/><rect x="76" y="80" width="10" height="6" rx="2" fill="#8a96b0"/>`,
  오븐:
    `<rect x="14" y="8" width="72" height="84" rx="6" fill="#fff"/>` +
    `<rect x="14" y="8" width="72" height="18" rx="6" fill="#30354f"/>` +
    `<circle cx="28" cy="17" r="4.5" fill="#dfe8f5" stroke-width="2.5"/><circle cx="42" cy="17" r="4.5" fill="#dfe8f5" stroke-width="2.5"/><circle cx="72" cy="17" r="4.5" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<rect x="54" y="14" width="10" height="6" rx="1.5" fill="#ff9f1a" stroke-width="2"/>` +
    tube('M26 36H74', '#8a96b0', 4) +
    `<rect x="22" y="44" width="56" height="38" rx="4" fill="#ff9f1a"/>` +
    `<path d="M28 72H72" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M32 70C32 60 40 56 50 56S68 60 68 70Z" fill="#c98b4f"/><path d="M40 62q3-3 6 0M52 62q3-3 6 0" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M26 48L32 54" stroke="#ffd9a0" stroke-width="3"/>`,
  토스터:
    `<g transform="rotate(-8 34 30)"><path d="M22 52V24C22 16 28 14 34 16C40 14 46 16 46 24V52Z" fill="#f5d08a"/><path d="M26 50V26C26 21 30 20 34 21C38 20 42 21 42 26V50Z" fill="#fff0c8" stroke="none"/></g>` +
    `<g transform="rotate(8 64 30)"><path d="M52 52V24C52 16 58 14 64 16C70 14 76 16 76 24V52Z" fill="#f5d08a"/><path d="M56 50V26C56 21 60 20 64 21C68 20 72 21 72 26V50Z" fill="#fff0c8" stroke="none"/></g>` +
    `<path d="M20 12l-4-5M50 8V2M80 12l4-5" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="10" y="44" width="80" height="44" rx="16" fill="#e8553d"/>` +
    `<rect x="24" y="44" width="22" height="5" rx="2" fill="#30354f" stroke-width="2"/><rect x="54" y="44" width="22" height="5" rx="2" fill="#30354f" stroke-width="2"/>` +
    `<path d="M20 56V76" stroke="#ff9a8a" stroke-width="4"/>` +
    `<rect x="84" y="56" width="10" height="7" rx="2" fill="#30354f"/>` +
    `<rect x="18" y="86" width="12" height="6" rx="2" fill="#30354f"/><rect x="70" y="86" width="12" height="6" rx="2" fill="#30354f"/>`,
  믹서:
    `<rect x="36" y="6" width="28" height="10" rx="4" fill="#30354f"/>` +
    `<path d="M30 16H70L64 64H36Z" fill="#dff3ff"/>` +
    `<path d="M33 36H67L64 64H36Z" fill="#ff7a9a"/>` +
    `<path d="M70 22H78C82 22 82 26 81 30L78 52C77 56 74 58 70 58" stroke-width="5"/>` +
    `<path d="M38 22L41 58" stroke="#fff" stroke-width="3.5"/>` +
    `<circle cx="50" cy="46" r="3" fill="#fff" stroke="none"/><circle cx="58" cy="54" r="2.5" fill="#fff" stroke="none"/>` +
    `<path d="M28 64H72L78 92H22Z" fill="#8e4fc9"/>` +
    `<circle cx="50" cy="78" r="7" fill="#fff"/><path d="M50 73V78" stroke-width="3"/>`,
  가스레인지:
    `<rect x="6" y="50" width="88" height="40" rx="6" fill="#dfe8f5"/>` +
    `<rect x="6" y="44" width="88" height="10" rx="4" fill="#8a96b0"/>` +
    `<path d="M20 44C18 34 26 30 24 22C30 26 32 20 30 14C40 22 42 32 38 44Z" fill="#3b8fe0"/><path d="M26 44C25 38 29 36 29 32C33 36 34 40 32 44Z" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M62 44C60 34 68 30 66 22C72 26 74 20 72 14C82 22 84 32 80 44Z" fill="#3b8fe0"/><path d="M68 44C67 38 71 36 71 32C75 36 76 40 74 44Z" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="14" y="60" width="72" height="22" rx="4" fill="#fff"/>` +
    `<circle cx="30" cy="71" r="6" fill="#30354f"/><path d="M30 66V71" stroke="#fff" stroke-width="2.5"/>` +
    `<circle cx="70" cy="71" r="6" fill="#30354f"/><path d="M70 66V71" stroke="#fff" stroke-width="2.5"/>` +
    `<circle cx="50" cy="71" r="3" fill="#e8553d" stroke-width="2"/>`,
  식탁:
    `<rect x="16" y="60" width="8" height="32" rx="2" fill="#9a5b2e"/><rect x="76" y="60" width="8" height="32" rx="2" fill="#9a5b2e"/>` +
    `<rect x="4" y="50" width="92" height="12" rx="3" fill="#c98b4f"/>` +
    `<path d="M10 53H90" stroke="#e8b27a" stroke-width="2.5"/>` +
    `<path d="M10 50C10 36 18 32 30 32S50 36 50 50Z" fill="#fff"/><path d="M14 36C18 24 42 24 46 36Z" fill="#fff"/>` +
    `<ellipse cx="70" cy="48" rx="20" ry="5" fill="#fff"/><path d="M58 46C58 38 64 36 70 40C76 36 82 38 82 46Z" fill="#ff9f1a"/>` +
    `<path d="M92 22V48M88 22V48" stroke-width="3"/>` +
    `<path d="M24 22c-3-3 3-6 0-9M36 22c-3-3 3-6 0-9" stroke="#9aa6c4" stroke-width="3"/>`,
  찬장:
    `<rect x="12" y="6" width="76" height="88" rx="4" fill="#c98b4f"/>` +
    `<rect x="18" y="12" width="30" height="42" rx="2" fill="#dff3ff"/><rect x="52" y="12" width="30" height="42" rx="2" fill="#dff3ff"/>` +
    `<path d="M18 33H48M52 33H82" stroke-width="3"/>` +
    `<ellipse cx="33" cy="26" rx="10" ry="5" fill="#fff" stroke-width="2.5"/><ellipse cx="33" cy="22" rx="10" ry="4" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M58 22H70V31H58Z" fill="#3b8fe0" stroke-width="2.5"/><path d="M70 24c4 0 4 5 0 5" stroke-width="2.5"/>` +
    `<path d="M24 40H42L40 51H26Z" fill="#43b04a" stroke-width="2.5"/><path d="M58 51C58 43 76 43 76 51Z" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="18" y="58" width="30" height="30" rx="2" fill="#9a5b2e"/><rect x="52" y="58" width="30" height="30" rx="2" fill="#9a5b2e"/>` +
    knob(43, 73) + knob(57, 73) + knob(43, 33, 2.5) + knob(57, 33, 2.5),
  싱크대:
    tube('M40 40V20C40 12 56 12 56 20V24', '#8a96b0', 5) +
    `<rect x="34" y="38" width="12" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M56 30V44" stroke="#4aa8f0" stroke-width="5"/>` +
    `<rect x="4" y="44" width="92" height="10" rx="3" fill="#dfe8f5"/>` +
    `<path d="M30 48H78" stroke-width="3"/>` +
    `<ellipse cx="68" cy="44" rx="10" ry="3" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="8" y="54" width="84" height="38" rx="2" fill="#7ec8f0"/>` +
    `<path d="M50 56V90" stroke-width="3"/>` +
    knob(44, 70) + knob(56, 70) +
    bubble(22, 36, 5) + bubble(84, 34, 4),
  수세미:
    `<rect x="16" y="46" width="68" height="34" rx="8" fill="#ffd23f"/>` +
    `<rect x="16" y="32" width="68" height="18" rx="6" fill="#43b04a"/>` +
    `<path d="M24 38l6 6M36 38l6 6M48 38l6 6M60 38l6 6M72 38l4 4" stroke="#2f7f38" stroke-width="3"/>` +
    `<circle cx="30" cy="62" r="3" fill="#f2b000" stroke="none"/><circle cx="50" cy="68" r="3.5" fill="#f2b000" stroke="none"/><circle cx="68" cy="60" r="3" fill="#f2b000" stroke="none"/><circle cx="42" cy="74" r="2.5" fill="#f2b000" stroke="none"/>` +
    bubble(26, 22, 7) + bubble(44, 16, 5) + bubble(64, 20, 8) + bubble(82, 26, 5) +
    bubble(88, 78, 5) + bubble(12, 84, 4),
  행주:
    `<path d="M2 70H98V92H2Z" fill="#c98b4f"/>` +
    `<path d="M8 74C30 70 70 70 92 74" stroke="#e8b27a" stroke-width="3"/>` +
    `<path d="M62 78C70 74 84 74 94 80M6 82C14 76 24 76 32 80" stroke="#fff" stroke-width="3"/>` +
    `<path d="M22 70C18 58 24 48 20 36C30 30 44 36 54 30C64 26 74 32 80 30C84 42 78 52 82 64C70 72 50 66 40 72C34 74 26 74 22 70Z" fill="#fff"/>` +
    `<path d="M34 34C36 46 32 58 36 70M50 32C52 44 48 56 52 68M66 30C68 42 64 54 68 66" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M22 46C34 42 50 46 80 40M22 60C36 56 54 58 82 54" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M22 70C18 58 24 48 20 36C30 30 44 36 54 30C64 26 74 32 80 30C84 42 78 52 82 64C70 72 50 66 40 72C34 74 26 74 22 70Z"/>` +
    sparkle(90, 20, 6) + sparkle(10, 22, 5),
  고무장갑:
    `<g transform="rotate(12 50 50)">` +
    `<path d="M32 94V64C24 58 20 46 22 38C23 34 28 34 29 38L31 46V20C31 14 39 14 39 20V40V14C39 8 47 8 47 14V40V16C47 10 55 10 55 16V42V24C55 18 63 18 63 24V58C63 64 60 66 58 68V94Z" fill="#ffd23f"/>` +
    `<rect x="28" y="80" width="34" height="10" rx="3" fill="#ffe27a"/>` +
    `<path d="M35 22V36" stroke="#fff4b0" stroke-width="3"/>` +
    `</g>`,
  머그컵:
    tube('M72 40C92 40 92 72 70 72', '#e85d9a', 8) +
    `<rect x="16" y="28" width="58" height="62" rx="8" fill="#e85d9a"/>` +
    `<ellipse cx="45" cy="30" rx="29" ry="6" fill="#6b3e26"/>` +
    `<circle cx="32" cy="52" r="5" fill="#fff" stroke="none"/><circle cx="54" cy="46" r="4" fill="#fff" stroke="none"/><circle cx="46" cy="70" r="5" fill="#fff" stroke="none"/><circle cx="62" cy="66" r="3.5" fill="#fff" stroke="none"/>` +
    steam(45, 18),
  찻잔:
    `<ellipse cx="50" cy="80" rx="42" ry="10" fill="#fff"/>` +
    `<ellipse cx="50" cy="78" rx="24" ry="5" fill="#dff3ff" stroke-width="2.5"/>` +
    tube('M76 46C94 46 92 66 72 64', '#fff', 5) +
    `<path d="M18 42H82C82 64 70 78 50 78S18 64 18 42Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="42" rx="32" ry="7" fill="#e8862e"/>` +
    `<path d="M26 52C34 56 66 56 74 52" stroke="#3b8fe0" stroke-width="4"/>` +
    `<circle cx="50" cy="64" r="4" fill="#3b8fe0" stroke="none"/>` +
    steam(50, 30),
  유리컵:
    `<path d="M22 12H78L70 88C70 91 68 92 64 92H36C32 92 30 91 30 88Z" fill="#e6f6ff"/>` +
    `<path d="M26 40H74L70 88C70 91 68 92 64 92H36C32 92 30 91 30 88Z" fill="#7ec8f0"/>` +
    `<ellipse cx="50" cy="40" rx="24" ry="4" fill="#a8dcf5" stroke-width="2.5"/>` +
    `<path d="M32 18L38 84" stroke="#fff" stroke-width="5"/><path d="M42 20L44 32" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="58" cy="60" r="3" fill="#fff" stroke-width="2"/><circle cx="62" cy="74" r="2.5" fill="#fff" stroke-width="2"/><circle cx="54" cy="50" r="2" fill="#fff" stroke-width="2"/>` +
    sparkle(86, 26, 6),
  보온병:
    `<rect x="36" y="4" width="28" height="18" rx="4" fill="#3b78e6"/>` +
    `<path d="M36 10H64" stroke="#2a5fc4" stroke-width="3"/>` +
    `<rect x="38" y="22" width="24" height="8" fill="#8a96b0"/>` +
    `<rect x="30" y="28" width="40" height="66" rx="10" fill="#3b78e6"/>` +
    `<rect x="30" y="54" width="40" height="14" fill="#8a96b0"/>` +
    `<path d="M38 36V48M38 74V86" stroke="#9fc2ff" stroke-width="4"/>` +
    steam(76, 22) + sparkle(18, 50, 6),
  도시락:
    `<rect x="6" y="18" width="88" height="68" rx="10" fill="#ff9aa8"/>` +
    `<rect x="12" y="24" width="76" height="56" rx="6" fill="#fff"/>` +
    `<path d="M50 24V80M50 52H88" stroke-width="3"/>` +
    `<circle cx="22" cy="36" r="3" fill="#fff" stroke-width="2"/><circle cx="32" cy="42" r="3" fill="#fff" stroke-width="2"/><circle cx="24" cy="56" r="3" fill="#fff" stroke-width="2"/><circle cx="38" cy="62" r="3" fill="#fff" stroke-width="2"/><circle cx="26" cy="70" r="3" fill="#fff" stroke-width="2"/><circle cx="40" cy="32" r="3" fill="#fff" stroke-width="2"/>` +
    `<circle cx="31" cy="52" r="5" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="56" y="30" width="26" height="9" rx="4.5" fill="#e8553d" stroke-width="2.5"/><rect x="58" y="40" width="22" height="8" rx="4" fill="#e8553d" stroke-width="2.5"/>` +
    `<ellipse cx="62" cy="66" rx="8" ry="9" fill="#fff" stroke-width="2.5"/><circle cx="62" cy="67" r="4" fill="${HL}" stroke="none"/>` +
    `<path d="M80 74V66" stroke="#2f7f38" stroke-width="3"/><circle cx="80" cy="63" r="6" fill="#43b04a" stroke-width="2.5"/>`,
  병따개:
    `<path d="M24 94V60C24 52 30 48 30 40V24H46V40C46 48 52 52 52 60V94Z" fill="#6ab04c"/>` +
    `<path d="M30 60V88" stroke="#b6e0a0" stroke-width="4"/>` +
    `<g transform="rotate(-22 38 16)"><rect x="26" y="12" width="24" height="9" rx="2" fill="${HL}"/><path d="M28 21v3M34 21v3M40 21v3M46 21v3" stroke-width="2.5"/></g>` +
    `<g transform="rotate(-30 58 30)">` +
    `<path d="M34 24C34 16 48 14 54 22H90C94 22 94 34 90 34H54C48 42 34 40 34 32Z" fill="#8a96b0"/>` +
    `<ellipse cx="44" cy="28" rx="6" ry="4" fill="#fff7e0"/>` +
    `<path d="M60 26H86" stroke="#dfe8f5" stroke-width="3"/>` +
    `</g>` +
    `<path d="M12 18l-6-4M14 10l-4-6M62 8l2-6" stroke="#9aa6c4" stroke-width="3"/>`,
  깡통:
    `<path d="M22 20V82C22 90 78 90 78 82V20Z" fill="#b8c6da"/>` +
    `<path d="M22 32C22 38 78 38 78 32M22 46C22 52 78 52 78 46M22 60C22 66 78 66 78 60M22 74C22 80 78 80 78 74" stroke="#8a96b0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="20" rx="28" ry="8" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="20" rx="22" ry="5" fill="#5a6480" stroke-width="2.5"/>` +
    `<path d="M28 38V78" stroke="#fff" stroke-width="4"/>` +
    sparkle(86, 40, 6) + sparkle(12, 66, 5),
  캔:
    `<path d="M28 20L32 12H68L72 20V84L68 90H32L28 84Z" fill="#e8553d"/>` +
    `<path d="M32 12H68L72 20H28Z" fill="#dfe8f5"/>` +
    `<path d="M28 84H72L68 90H32Z" fill="#dfe8f5"/>` +
    `<path d="M44 14H56C58 14 58 19 56 19H44C42 19 42 14 44 14Z" fill="#8a96b0" stroke-width="2"/>` +
    `<path d="M28 44C40 52 60 36 72 44V58C60 50 40 66 28 58Z" fill="#fff"/>` +
    `<path d="M34 26V40M34 66V80" stroke="#ff9a8a" stroke-width="4"/>` +
    `<circle cx="84" cy="30" r="3" fill="#fff" stroke-width="2"/><circle cx="88" cy="18" r="2.5" fill="#fff" stroke-width="2"/><circle cx="14" cy="24" r="3" fill="#fff" stroke-width="2"/>`,
  뚜껑:
    `<path d="M16 84C16 94 84 94 84 84V70H16Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="70" rx="34" ry="6" fill="#5a6480"/>` +
    `<path d="M12 72H4M88 72H96" stroke-width="6"/>` +
    `<g transform="rotate(-10 50 40)">` +
    `<path d="M10 50C10 30 30 22 50 22S90 30 90 50Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="50" rx="40" ry="6" fill="#c9412e"/>` +
    `<rect x="40" y="12" width="20" height="11" rx="5" fill="#30354f"/>` +
    `<path d="M22 42C24 36 30 32 36 30" stroke="#ff9a8a" stroke-width="4"/>` +
    `</g>` +
    `<path d="M40 64c-3-3 3-6 0-9M58 64c-3-3 3-6 0-9" stroke="#9aa6c4" stroke-width="3"/>`,
  비닐봉지:
    `<path d="M30 34C24 12 44 8 44 30M56 30C56 8 76 12 70 34" stroke-width="6"/>` +
    `<path d="M30 34C24 12 44 8 44 30M56 30C56 8 76 12 70 34" stroke="#f4f8ff" stroke-width="2.5"/>` +
    `<path d="M18 34H82L86 84C86 90 82 92 76 92H24C18 92 14 90 14 84Z" fill="#e8f2ff"/>` +
    `<path d="M40 34L44 26H56L60 34" fill="#e8f2ff"/>` +
    `<circle cx="34" cy="40" r="10" fill="#e8553d" opacity=".5" stroke="none"/><rect x="54" y="30" width="14" height="24" rx="4" fill="#43b04a" opacity=".5" stroke="none"/>` +
    `<path d="M28 56L34 78M50 58L50 82M70 56L66 78" stroke="#b8c6da" stroke-width="3"/>` +
    `<path d="M22 44L24 70" stroke="#fff" stroke-width="4"/>`,
  종이컵:
    `<path d="M20 20H80L70 90H30Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="20" rx="30" ry="6" fill="#f5e6c8"/>` +
    `<path d="M24 50H76L73 70H27Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="60" r="5" fill="#fff" stroke="none"/>` +
    `<path d="M30 28L34 46" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M20 22H80" stroke-width="3"/>`,
  휴지통:
    `<path d="M20 32H80L72 90H28Z" fill="#3b8fe0"/>` +
    `<path d="M32 42L36 82M44 42L46 82M56 42L54 82M68 42L64 82" stroke="#1f5fb0" stroke-width="3"/>` +
    `<path d="M26 60H74" stroke="#1f5fb0" stroke-width="3"/>` +
    `<path d="M28 32C24 22 34 14 42 20C46 12 58 14 58 22C66 18 74 24 72 32Z" fill="#fff"/>` +
    `<path d="M36 26l5 3M50 20l2 5M62 26l-4 2" stroke="#b8c6da" stroke-width="2.5"/>` +
    `<rect x="16" y="28" width="68" height="8" rx="4" fill="#2a6fc4"/>` +
    `<g transform="rotate(20 84 80)"><path d="M78 74C80 70 88 70 90 74C94 78 90 86 84 86C78 86 76 80 78 74Z" fill="#fff"/><path d="M80 78l6 2" stroke="#b8c6da" stroke-width="2.5"/></g>`,
  재활용함:
    `<rect x="6" y="40" width="28" height="50" rx="4" fill="#3b8fe0"/><rect x="36" y="40" width="28" height="50" rx="4" fill="#ffd23f"/><rect x="66" y="40" width="28" height="50" rx="4" fill="#43b04a"/>` +
    `<rect x="4" y="34" width="32" height="9" rx="3" fill="#2a6fc4"/><rect x="34" y="34" width="32" height="9" rx="3" fill="#f2b000"/><rect x="64" y="34" width="32" height="9" rx="3" fill="#3a9e47"/>` +
    `<path d="M14 34L12 18L28 14L30 34Z" fill="#fff"/><path d="M16 22L26 20M16 28L27 26" stroke="#b8c6da" stroke-width="2.5"/>` +
    `<path d="M42 34V24H56V34Z" fill="#b8c6da"/><ellipse cx="49" cy="24" rx="7" ry="2.5" fill="#dfe8f5"/>` +
    `<path d="M74 34V22C74 18 76 17 76 14V8H84V14C84 17 86 18 86 22V34Z" fill="#aee0c0"/>` +
    `<path d="M14 58l6-6 6 6M44 58l6-6 6 6M74 58l6-6 6 6" stroke="#fff" stroke-width="4"/><path d="M20 52V72M50 52V72M80 52V72" stroke="#fff" stroke-width="4"/>`,
  세탁기:
    `<rect x="12" y="6" width="76" height="88" rx="8" fill="#fff"/>` +
    `<path d="M12 24H88" stroke-width="3"/>` +
    `<rect x="18" y="11" width="20" height="8" rx="2" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<circle cx="66" cy="15" r="4.5" fill="#dfe8f5" stroke-width="2.5"/><circle cx="78" cy="15" r="3" fill="#43b04a" stroke-width="2"/>` +
    `<circle cx="50" cy="58" r="28" fill="#8a96b0"/>` +
    `<circle cx="50" cy="58" r="21" fill="#7ec8f0"/>` +
    `<path d="M34 66C38 56 50 60 56 52C60 56 64 64 62 72C54 76 42 76 34 66Z" fill="#e85d9a" stroke-width="2.5"/>` +
    `<path d="M40 50C42 44 52 44 54 48" stroke="#ffd23f" stroke-width="5"/>` +
    `<circle cx="42" cy="44" r="3" fill="#fff" stroke-width="2"/><circle cx="60" cy="46" r="2.5" fill="#fff" stroke-width="2"/>`,
  건조대:
    `<path d="M14 94L50 44L86 94M14 44L50 94L86 44" stroke-width="5"/>` +
    `<path d="M14 94L50 44L86 94M14 44L50 94L86 44" stroke="#dfe8f5" stroke-width="2"/>` +
    `<path d="M6 40H94" stroke-width="7"/><path d="M6 40H94" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M10 40H40V56H34V48H16V56H10Z" fill="#3b8fe0"/>` +
    `<path d="M44 40H62V60H44Z" fill="#fff"/><path d="M44 46H62M44 52H62" stroke="#ff5c70" stroke-width="3"/>` +
    `<path d="M68 40H76V56L82 60C84 64 78 66 74 62L68 58Z" fill="#ffd23f"/>` +
    `<path d="M80 40H88V56L94 60C96 64 90 66 86 62L80 58Z" fill="#ffd23f"/>`,
  빨래집게:
    `<path d="M2 18Q50 30 98 18" stroke-width="3"/>` +
    `<path d="M26 26H58V56C58 62 66 64 72 66C80 68 82 76 78 82C74 88 64 86 56 82L32 70C27 67 26 64 26 60Z" fill="#ff9aa8"/>` +
    `<path d="M26 34H58" stroke="#e85d9a" stroke-width="4"/>` +
    `<path d="M44 6H56V64C56 70 53 72 50 72C47 72 44 70 44 64Z" fill="#43b04a"/>` +
    `<rect x="38" y="26" width="24" height="12" rx="5" fill="#dfe8f5"/>` +
    `<path d="M40 32H60" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M50 12V22M50 44V62" stroke="#1f7a2c" stroke-width="2.5"/>` +
    `<path d="M47 44V60" stroke="#b8f0a8" stroke-width="2.5"/>`,
  다리미:
    `<path d="M8 82C12 58 34 44 62 44H86C90 44 92 46 92 50V82Z" fill="#e8553d"/>` +
    `<path d="M4 82H94V90H10C6 90 4 86 4 82Z" fill="#dfe8f5"/>` +
    tube('M40 44C40 24 46 22 56 22H80C84 22 86 26 86 30V44', '#30354f', 6) +
    `<circle cx="70" cy="64" r="6" fill="#fff" stroke-width="2.5"/><path d="M70 60V64" stroke-width="2.5"/>` +
    `<path d="M24 70C30 62 40 56 50 54" stroke="#ff9a8a" stroke-width="4"/>` +
    `<path d="M16 76c-4-4 4-8 0-13M26 72c-4-4 4-8 0-13" stroke="#9aa6c4" stroke-width="3" transform="translate(-8 -14)"/>`,
  다리미판:
    `<path d="M26 64L70 92M74 64L30 92" stroke-width="5"/><path d="M26 64L70 92M74 64L30 92" stroke="#b8c6da" stroke-width="2"/>` +
    `<path d="M14 52C14 46 18 44 24 44H72C84 44 96 48 96 54C96 60 84 64 72 64H24C18 64 14 62 14 58Z" fill="#7ec8f0"/>` +
    `<path d="M24 54H70" stroke="#fff" stroke-width="3" stroke-dasharray="4 5"/>` +
    `<path d="M28 44C30 36 36 32 44 32H54C56 32 57 33 57 35V44Z" fill="#e8553d"/>` +
    tube('M36 32C36 24 40 22 46 22H52C55 22 56 24 56 28', '#30354f', 4) +
    `<path d="M8 52l-4-4M8 44V38" stroke="#9aa6c4" stroke-width="3"/>`,
  빨래바구니:
    `<path d="M22 40C20 22 36 16 46 26C52 14 70 16 70 32C80 28 86 36 80 44Z" fill="#ff9aa8"/>` +
    `<path d="M40 34L62 30L66 42L38 44Z" fill="#7ec8f0"/>` +
    `<path d="M24 42C26 30 38 28 44 36Z" fill="#ffd23f"/>` +
    `<path d="M12 40H88L80 92H20Z" fill="#e8b27a"/>` +
    `<path d="M14 54H86M16 68H84M18 82H82" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M30 42L32 90M50 42V90M70 42L68 90" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="8" y="36" width="84" height="8" rx="4" fill="#c98b4f"/>` +
    `<path d="M4 48C4 60 12 60 14 58M96 48C96 60 88 60 86 58" stroke-width="4"/>`,
  옷장:
    `<rect x="10" y="4" width="80" height="84" rx="4" fill="#c98b4f"/>` +
    `<rect x="14" y="8" width="36" height="76" rx="2" fill="#fff7e0"/>` +
    `<path d="M14 18H50" stroke-width="3"/>` +
    tee(24, 18, '#e8553d') + tee(40, 18, '#3b8fe0') +
    `<path d="M50 8L66 12V84L50 88Z" fill="#9a5b2e"/>` +
    `<rect x="52" y="8" width="34" height="76" rx="2" fill="#9a5b2e"/>` +
    knob(58, 46) +
    `<path d="M60 16V36" stroke="#c98b4f" stroke-width="3"/>` +
    `<rect x="16" y="88" width="8" height="6" fill="#6b3e26"/><rect x="76" y="88" width="8" height="6" fill="#6b3e26"/>`,
  서랍:
    `<rect x="14" y="10" width="72" height="80" rx="4" fill="#9a5b2e"/>` +
    `<rect x="20" y="16" width="60" height="18" rx="2" fill="#c98b4f"/>` +
    `<rect x="20" y="66" width="60" height="18" rx="2" fill="#c98b4f"/>` +
    knob(50, 25) + knob(50, 75) +
    `<path d="M28 42C28 36 34 34 38 38C40 32 48 32 50 38C54 34 62 34 64 40Z" fill="#7ec8f0"/>` +
    `<path d="M50 38C52 30 60 30 62 38Z" fill="#ff9aa8"/>` +
    `<path d="M8 42H92V64H8Z" fill="#e8b27a"/>` +
    `<path d="M8 42L20 38H80L92 42" fill="#c98b4f"/>` +
    knob(50, 53, 4.5) +
    `<rect x="18" y="90" width="8" height="5" fill="#6b3e26"/><rect x="74" y="90" width="8" height="5" fill="#6b3e26"/>`,
  화장대:
    `<ellipse cx="50" cy="30" rx="24" ry="26" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="30" rx="18" ry="20" fill="#bfe6ff"/>` +
    `<path d="M40 20L48 12M40 30L56 16" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="46" y="54" width="8" height="8" fill="#9a5b2e"/>` +
    `<rect x="18" y="68" width="10" height="26" fill="#9a5b2e"/><rect x="72" y="68" width="10" height="26" fill="#9a5b2e"/>` +
    `<rect x="8" y="60" width="84" height="12" rx="3" fill="#c98b4f"/>` +
    `<rect x="30" y="72" width="40" height="12" rx="2" fill="#e8b27a"/>` + knob(50, 78, 2.8) +
    `<rect x="14" y="48" width="9" height="12" rx="2" fill="#e85d9a" stroke-width="2.5"/><rect x="16" y="43" width="5" height="5" fill="#30354f" stroke-width="2"/>` +
    `<path d="M74 60V52C74 48 84 48 84 52V60Z" fill="#a45cf0" stroke-width="2.5"/><circle cx="79" cy="45" r="3" fill="#ffd23f" stroke-width="2"/>`,
  머리빗:
    `<g transform="rotate(-35 50 50)">` +
    tube('M50 58V94', '#a45cf0', 9) +
    `<ellipse cx="50" cy="34" rx="22" ry="28" fill="#a45cf0"/>` +
    `<ellipse cx="50" cy="34" rx="16" ry="22" fill="#30354f"/>` +
    [[44, 20], [56, 20], [40, 30], [50, 30], [60, 30], [40, 40], [50, 40], [60, 40], [44, 50], [56, 50]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#fff" stroke="none"/>`)
      .join('') +
    `</g>`,
  헤어드라이어:
    `<path d="M40 50L34 88C34 94 48 94 48 88L56 54Z" fill="#ff5c70"/>` +
    `<rect x="40" y="62" width="8" height="10" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M26 22H62L66 26V52L62 56H26C14 56 8 48 8 39S14 22 26 22Z" fill="#ff5c70"/>` +
    `<circle cx="28" cy="39" r="10" fill="#ff9aa8"/><circle cx="28" cy="39" r="4" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="62" y="26" width="12" height="26" rx="3" fill="#30354f"/>` +
    `<path d="M80 30H94M80 39H96M80 48H94" stroke="#9aa6c4" stroke-width="3.5"/>`,
  면도기:
    `<g transform="rotate(-30 50 50)">` +
    tube('M50 42V94', '#3b78e6', 9) +
    `<path d="M46 62V86" stroke="#9fc2ff" stroke-width="3"/>` +
    `<rect x="44" y="34" width="12" height="10" rx="2" fill="#8a96b0"/>` +
    `<rect x="24" y="14" width="52" height="22" rx="6" fill="#dfe8f5"/>` +
    `<path d="M30 21H70M30 28H70" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="24" y="10" width="52" height="6" rx="3" fill="#43b04a"/>` +
    `</g>` +
    `<path d="M62 70C60 62 70 58 74 64C78 58 90 60 88 70C94 72 92 82 84 82H66C58 82 56 72 62 70Z" fill="#fff"/>`,
  로션:
    `<path d="M50 20V8H70V14" stroke-width="5"/><path d="M50 20V8H70V14" stroke="#fff" stroke-width="1.5"/>` +
    `<rect x="42" y="20" width="16" height="10" rx="2" fill="#fff"/>` +
    `<rect x="28" y="30" width="44" height="62" rx="12" fill="#ffd6e0"/>` +
    `<rect x="34" y="50" width="32" height="24" rx="4" fill="#fff"/>` +
    `<path d="M40 62C44 56 56 56 60 62C56 68 44 68 40 62Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M34 36V44" stroke="#fff" stroke-width="4"/>` +
    `<path d="M76 20C74 14 80 10 84 14C86 20 82 24 78 24Z" fill="#fff" stroke-width="2.5"/>`,
  선크림:
    `<path d="M30 30H70L74 88C74 92 72 94 68 94H32C28 94 26 92 26 88Z" fill="#ff9f1a"/>` +
    `<rect x="34" y="8" width="32" height="24" rx="5" fill="#fff"/>` +
    `<path d="M40 14H60" stroke-width="3"/>` +
    `<circle cx="50" cy="62" r="10" fill="${HL}"/>` +
    `<path d="M50 44V48M50 76V80M32 62H36M64 62H68M37 49l3 3M63 49l-3 3M37 75l3-3M63 75l-3-3" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M32 36V50" stroke="#ffd09a" stroke-width="4"/>` +
    sparkle(86, 30, 7) + sparkle(14, 50, 5),
  립밤:
    `<rect x="18" y="44" width="30" height="42" rx="5" fill="#fff"/>` +
    `<rect x="18" y="44" width="30" height="12" fill="#ff9aa8"/>` +
    `<path d="M24 44V30C24 22 42 22 42 30V44Z" fill="#ff5c70"/>` +
    `<path d="M29 32V40" stroke="#ffb0bc" stroke-width="3"/>` +
    `<rect x="60" y="54" width="26" height="36" rx="5" fill="#ff9aa8"/>` +
    `<path d="M60 64H86" stroke="#e85d9a" stroke-width="3"/>` +
    `<path d="M56 20C60 12 68 12 72 16C76 12 84 12 88 20C82 30 62 30 56 20Z" fill="#ff5c70"/><path d="M58 20C66 22 78 22 86 20" stroke-width="2.5"/>` +
    sparkle(90, 36, 5),
  향수:
    `<path d="M24 40C26 30 32 28 36 30" stroke-width="3"/>` +
    `<circle cx="20" cy="46" r="8" fill="#e85d9a"/>` +
    `<path d="M28 36H40" stroke-width="3"/>` +
    `<rect x="40" y="24" width="20" height="14" rx="3" fill="${HL}"/>` +
    `<path d="M46 38V44H54V38" fill="${HL}"/>` +
    `<path d="M30 58C30 48 40 44 50 44S70 48 70 58V82C70 90 64 92 58 92H42C36 92 30 90 30 82Z" fill="#c9a4f5"/>` +
    `<path d="M38 56V80" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="72" cy="22" r="2.5" fill="#c9a4f5" stroke="none"/><circle cx="80" cy="16" r="3" fill="#c9a4f5" stroke="none"/><circle cx="82" cy="28" r="2.5" fill="#c9a4f5" stroke="none"/><circle cx="90" cy="22" r="2" fill="#c9a4f5" stroke="none"/>` +
    sparkle(84, 50, 6) + sparkle(14, 76, 5),
  손거울:
    `<g transform="rotate(-25 50 50)">` +
    tube('M50 70V96', '#e85d9a', 9) +
    `<circle cx="50" cy="40" r="32" fill="#e85d9a"/>` +
    `<circle cx="50" cy="40" r="25" fill="#bfe6ff"/>` +
    `<path d="M36 34L46 22M38 46L58 24" stroke="#fff" stroke-width="4"/>` +
    `</g>` +
    sparkle(86, 18, 7),
  매니큐어:
    `<rect x="40" y="6" width="16" height="30" rx="3" fill="#30354f"/>` +
    `<path d="M34 38H62L66 44V82C66 88 62 90 58 90H38C34 90 30 88 30 82V44Z" fill="#ff5c70"/>` +
    `<rect x="36" y="34" width="24" height="7" rx="2" fill="#30354f"/>` +
    `<path d="M38 50V78" stroke="#ffb0bc" stroke-width="4"/>` +
    `<path d="M74 94V62C74 54 90 54 90 62V94Z" fill="#ffd6ad"/>` +
    `<path d="M77 70V63C77 58 87 58 87 63V70C87 72 77 72 77 70Z" fill="#ff5c70" stroke-width="2.5"/>` +
    sparkle(18, 24, 6),
  욕조:
    `<rect x="18" y="18" width="10" height="8" rx="2" fill="#8a96b0"/>` +
    tube('M14 22H28', '#8a96b0', 4) +
    `<path d="M22 30V40" stroke="#4aa8f0" stroke-width="4"/>` +
    bubble(30, 46, 7) + bubble(44, 40, 9) + bubble(60, 42, 8) + bubble(74, 46, 7) + bubble(52, 30, 5) +
    `<path d="M4 48H96V56C96 74 84 82 66 82H34C16 82 4 74 4 56Z" fill="#fff"/>` +
    `<rect x="2" y="46" width="96" height="8" rx="4" fill="#dfe8f5"/>` +
    `<path d="M20 82L16 92M80 82L84 92" stroke-width="6"/>` +
    `<path d="M14 62C16 70 22 74 30 76" stroke="#bfe6ff" stroke-width="4"/>` +
    `<path d="M76 40C76 32 84 30 88 34C92 32 94 36 92 38L88 40C92 44 88 48 82 48H78C74 48 72 44 76 40Z" fill="${HL}" stroke-width="2.5"/>` +
    dot(85, 36, 1.8),
  샤워기:
    tube('M16 96V30C16 16 28 10 40 14', '#8a96b0', 6) +
    `<path d="M36 6L78 28L68 44L28 22Z" fill="#dfe8f5"/>` +
    `<path d="M32 22L70 44" stroke-width="3"/>` +
    `<ellipse cx="54" cy="34" rx="22" ry="6" transform="rotate(28 54 34)" fill="#8a96b0"/>` +
    `<path d="M42 40L34 62M50 44L46 70M58 48L58 78M66 50L70 76M72 50L82 70" stroke="#4aa8f0" stroke-width="4"/>` +
    drop(40, 72, 1) + drop(60, 84, 1) + drop(82, 80, 0.9),
  변기:
    `<rect x="58" y="10" width="30" height="38" rx="5" fill="#fff"/>` +
    `<rect x="62" y="14" width="10" height="5" rx="2" fill="#8a96b0" stroke-width="2"/>` +
    `<path d="M12 50H66C66 64 58 72 48 74L52 90H26L30 74C18 70 12 62 12 50Z" fill="#fff"/>` +
    `<rect x="8" y="44" width="62" height="9" rx="4" fill="#7ec8f0"/>` +
    `<path d="M66 48H80V60C80 64 76 66 72 64" stroke-width="3"/><path d="M60 48H88" stroke-width="3"/>` +
    `<path d="M20 58C24 64 30 68 38 68" stroke="#dfe8f5" stroke-width="3.5"/>` +
    `<path d="M22 90H56" stroke-width="4"/>`,
  세면대:
    `<rect x="16" y="6" width="68" height="26" rx="8" fill="#bfe6ff"/><path d="M26 14L34 10M26 22L42 12" stroke="#fff" stroke-width="3"/>` +
    tube('M50 46V38H60', '#8a96b0', 4) +
    `<circle cx="42" cy="40" r="4" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M60 42V50" stroke="#4aa8f0" stroke-width="3.5"/>` +
    `<path d="M12 48H88C88 62 72 70 50 70S12 62 12 48Z" fill="#fff"/>` +
    `<rect x="10" y="44" width="80" height="8" rx="4" fill="#dfe8f5"/>` +
    `<path d="M42 68H58L56 94H44Z" fill="#fff"/>` +
    `<rect x="72" y="36" width="12" height="8" rx="3" fill="#ff9aa8" stroke-width="2.5"/>`,
  수도꼭지:
    `<rect x="4" y="30" width="14" height="30" rx="3" fill="#8a96b0"/>` +
    tube('M18 44H56C68 44 72 52 72 60', '#b8c6da', 12) +
    `<rect x="62" y="60" width="20" height="8" rx="3" fill="#8a96b0"/>` +
    `<rect x="34" y="28" width="8" height="12" fill="#8a96b0"/>` +
    `<rect x="22" y="18" width="32" height="10" rx="5" fill="#3b8fe0"/>` +
    `<path d="M24 42H50" stroke="#fff" stroke-width="3"/>` +
    drop(72, 72, 1.3) + drop(72, 88, 0.6),
  목욕가운:
    tube('M28 6Q50 -2 72 6', '#8a96b0', 3) +
    `<path d="M30 10L10 30L16 58L26 54V92H74V54L84 58L90 30L70 10Q50 16 30 10Z" fill="#fff"/>` +
    `<path d="M30 10L50 52L70 10" fill="#ff9aa8"/>` +
    `<path d="M50 52L38 92" stroke-width="3"/>` +
    `<rect x="24" y="54" width="52" height="8" rx="3" fill="#ff9aa8"/>` +
    `<path d="M50 60L44 78M50 60L58 76" stroke="#ff9aa8" stroke-width="6"/>` +
    `<path d="M16 50L26 46M84 50L74 46" stroke="#ff9aa8" stroke-width="5"/>` +
    `<rect x="58" y="68" width="12" height="12" rx="2" fill="#fff" stroke-width="2.5"/>`,
  체중계:
    `<rect x="10" y="14" width="80" height="78" rx="14" fill="#7ec8f0"/>` +
    `<rect x="26" y="22" width="48" height="24" rx="10" fill="#fff"/>` +
    `<path d="M32 38C36 28 64 28 68 38" stroke="#8a96b0" stroke-width="3" stroke-dasharray="2 5"/>` +
    `<path d="M50 42L58 30" stroke="#e8553d" stroke-width="3"/>` + dot(50, 42, 2.5) +
    `<path d="M24 56C24 52 40 52 40 58V82C40 86 24 86 24 82Z" fill="#bfe6ff"/>` +
    `<path d="M60 58C60 52 76 52 76 56V82C76 86 60 86 60 82Z" fill="#bfe6ff"/>`,
  구급상자:
    tube('M36 26V16C36 12 64 12 64 16V26', '#fff', 5) +
    `<rect x="8" y="26" width="84" height="64" rx="8" fill="#e8553d"/>` +
    `<path d="M8 40H92" stroke="#c9412e" stroke-width="3"/>` +
    `<rect x="44" y="36" width="12" height="8" rx="2" fill="#fff" stroke-width="2.5"/>` +
    cross(50, 66, 15) +
    `<path d="M16 50V80" stroke="#ff9a8a" stroke-width="4"/>`,
  붕대:
    `<path d="M50 60C62 62 74 64 90 60L92 84C76 90 62 86 50 86Z" fill="#fff"/>` +
    `<path d="M62 64V86M76 64V88" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M14 40C14 28 58 28 58 40V78C58 90 14 90 14 78Z" fill="#fff"/>` +
    `<ellipse cx="36" cy="40" rx="22" ry="9" fill="#fff"/>` +
    `<ellipse cx="36" cy="40" rx="15" ry="5.5" fill="#f5e6c8" stroke-width="2.5"/>` +
    `<ellipse cx="36" cy="40" rx="7" ry="2.5" fill="#fff7e0" stroke-width="2.5"/>` +
    `<path d="M20 52V76" stroke="#dfe8f5" stroke-width="4"/>` +
    `<rect x="84" y="60" width="4" height="26" fill="#dfe8f5" stroke="none"/>`,
  연고:
    `<g transform="rotate(-25 46 56)">` +
    `<path d="M10 40H20L64 48V64L20 72H10Z" fill="#fff"/>` +
    `<rect x="4" y="36" width="10" height="40" rx="2" fill="#43b04a"/>` +
    `<rect x="26" y="48" width="22" height="16" rx="2" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M37 51V61M32 56H42" stroke="#fff" stroke-width="3"/>` +
    `<rect x="64" y="51" width="8" height="10" fill="#fff"/>` +
    `<path d="M72 50C80 44 90 48 86 56C94 58 92 66 84 64C80 70 72 66 72 62Z" fill="#fff"/>` +
    `</g>` +
    sparkle(84, 22, 6) + sparkle(20, 86, 5),
  알약:
    `<g transform="rotate(-30 34 36)"><rect x="12" y="26" width="44" height="20" rx="10" fill="#fff"/><path d="M34 26V46H46C52 46 56 42 56 36S52 26 46 26Z" fill="#e8553d"/><rect x="12" y="26" width="44" height="20" rx="10"/><path d="M18 32H28" stroke="#dfe8f5" stroke-width="3"/></g>` +
    `<g transform="rotate(25 66 68)"><rect x="44" y="58" width="44" height="20" rx="10" fill="#fff"/><path d="M66 58V78H78C84 78 88 74 88 68S84 58 78 58Z" fill="#3b8fe0"/><rect x="44" y="58" width="44" height="20" rx="10"/><path d="M50 64H60" stroke="#dfe8f5" stroke-width="3"/></g>` +
    `<circle cx="72" cy="28" r="12" fill="#ffd23f"/><path d="M66 24q3-4 7-4" stroke="#fff4b0" stroke-width="3"/>` +
    `<circle cx="26" cy="74" r="12" fill="#fff"/><path d="M20 70q3-4 7-4" stroke="#dfe8f5" stroke-width="3"/>`,
  주사기:
    `<g transform="rotate(-40 50 50)">` +
    `<path d="M50 8V20" stroke-width="8"/><rect x="38" y="4" width="24" height="7" rx="3" fill="#8a96b0"/>` +
    `<path d="M50 8V20" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="30" y="20" width="40" height="7" rx="3" fill="#8a96b0"/>` +
    `<rect x="36" y="26" width="28" height="50" rx="4" fill="#fff"/>` +
    `<rect x="36" y="50" width="28" height="26" rx="4" fill="#7ec8f0"/>` +
    `<path d="M36 36H44M36 44H48M36 52H44M36 60H48" stroke-width="2.5"/>` +
    `<path d="M44 76H56L53 84H47Z" fill="#8a96b0"/>` +
    `<path d="M50 84V94" stroke-width="2.5"/>` +
    `</g>`,
  청진기:
    `<path d="M30 10C24 12 20 22 22 36C24 52 34 60 46 60C58 60 68 52 70 36C72 22 68 12 62 10" stroke-width="7"/>` +
    `<path d="M30 10C24 12 20 22 22 36C24 52 34 60 46 60C58 60 68 52 70 36C72 22 68 12 62 10" stroke="#3b8fe0" stroke-width="3"/>` +
    `<circle cx="32" cy="10" r="4.5" fill="#30354f"/><circle cx="60" cy="10" r="4.5" fill="#30354f"/>` +
    tube('M46 60C46 80 56 88 68 86', '#3b8fe0', 4) +
    `<circle cx="74" cy="80" r="14" fill="#8a96b0"/><circle cx="74" cy="80" r="8" fill="#dfe8f5"/>` +
    `<path d="M70 76l3-3" stroke="#fff" stroke-width="2.5"/>`,
};
