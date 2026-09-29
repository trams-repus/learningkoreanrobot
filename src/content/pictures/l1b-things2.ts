// 그림 묶음: 생활 물건·도구·학용품·장난감·악기·거리 물건 (l1b). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, sparkle, tube } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 정다각형 꼭짓점 (가운데 x,y, 반지름 r, 시작 각도 a0도) */
function poly(x: number, y: number, r: number, n: number, a0 = -90): string {
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + (k * 360) / n) * Math.PI) / 180;
    return `${r1(x + r * Math.cos(a))} ${r1(y + r * Math.sin(a))}`;
  }).join('L');
}

/** 연필 한 자루 (아래 끝이 원점, 위로 뾰족) */
const pencil = (t: string, c: string) =>
  `<g transform="${t}">` +
  `<rect x="-6" y="-44" width="12" height="44" rx="1.5" fill="${c}"/>` +
  `<path d="M-6 -44L0 -62L6 -44Z" fill="#f5d6a8"/><path d="M-2.4 -54.8L0 -62L2.4 -54.8Z" fill="${INK}" stroke-width="2"/>` +
  `</g>`;

/** 밧줄 소용돌이 점들 */
const coil = Array.from({ length: 64 }, (_, k) => {
  const a = (k / 64) * 3 * 2 * Math.PI;
  const rr = 6 + (k / 64) * 26;
  return `${r1(48 + rr * Math.cos(a))} ${r1(48 + rr * Math.sin(a) * 0.9)}`;
}).join('L');

/** 장난감 블록 한 개 (앞면 왼쪽 위 x,y, 한 변 s) */
const cube = (x: number, y: number, s: number, c: string, top: string, mark: string) =>
  `<path d="M${x} ${y}L${x + 8} ${y - 8}H${x + s + 8}L${x + s} ${y}Z" fill="${top}"/>` +
  `<path d="M${x + s} ${y}L${x + s + 8} ${y - 8}V${y + s - 8}L${x + s} ${y + s}Z" fill="${top}"/>` +
  `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${c}"/>` +
  mark;

export const PICS: Record<string, string> = {
  수영복:
    `<path d="M4 92q8-6 16 0t16 0t16 0t16 0t16 0t16 0" stroke="#3b8fe0" stroke-width="4"/>` +
    `<path d="M28 34C28 24 32 14 36 10H43C43 22 46 28 50 28S57 22 57 10H64C68 14 72 24 72 34C72 48 66 56 68 72C62 76 58 80 56 86H44C42 80 38 76 32 72C34 56 28 48 28 34Z" fill="#ff5c70"/>` +
    `<path d="M31 50C44 56 56 56 69 50" stroke="#ffd23f" stroke-width="5"/>` +
    dot(40, 40, 3.5, '#fff') + dot(60, 40, 3.5, '#fff') + dot(42, 66, 3.5, '#fff') + dot(58, 66, 3.5, '#fff') + dot(50, 74, 3, '#fff'),
  앞치마:
    `<path d="M38 22C36 4 64 4 62 22" stroke-width="5"/>` +
    tube('M24 46C16 48 12 54 8 60', '#ff9aa8', 4) + tube('M76 46C84 48 88 54 92 60', '#ff9aa8', 4) +
    `<path d="M36 20H64V44H76L79 84C79 88 77 90 73 90H27C23 90 21 88 21 84L24 44H36Z" fill="#ff9aa8"/>` +
    `<path d="M24 44H76" stroke-width="3"/>` +
    `<rect x="36" y="58" width="28" height="20" rx="4" fill="#fff"/><path d="M36 64H64" stroke="#ff9aa8" stroke-width="3"/>` +
    `<path d="M50 38C43 33 43 27 46 26C48 25 50 27 50 29C50 27 52 25 54 26C57 27 57 33 50 38Z" fill="#e8553d" stroke-width="2"/>`,
  기저귀:
    `<path d="M14 28H86C86 50 72 62 62 72C58 80 55 86 50 86C45 86 42 80 38 72C28 62 14 50 14 28Z" fill="#fff"/>` +
    `<path d="M20 46C28 60 34 66 38 72M80 46C72 60 66 66 62 72" stroke="#7ec8f0" stroke-width="3"/>` +
    `<rect x="14" y="26" width="72" height="12" rx="3" fill="#7ec8f0"/>` +
    `<rect x="8" y="30" width="14" height="12" rx="3" fill="#ffd23f"/><rect x="78" y="30" width="14" height="12" rx="3" fill="#ffd23f"/>` +
    dot(40, 50, 3.2, '#ffc933') + dot(60, 50, 3.2, '#ffc933') + dot(50, 60, 3.2, '#ffc933'),
  젖병:
    `<path d="M40 28C40 21 44 19 46 14C45 8 55 8 54 14C56 19 60 21 60 28Z" fill="#f5c98a"/>` +
    `<rect x="31" y="38" width="38" height="54" rx="9" fill="#eaf6ff"/>` +
    `<path d="M33 58H67V83C67 88 63 90 59 90H41C37 90 33 88 33 83Z" fill="#fff" stroke="none"/>` +
    `<rect x="31" y="38" width="38" height="54" rx="9"/>` +
    `<path d="M33 58H67" stroke="#9fb3d9" stroke-width="2.5"/>` +
    `<path d="M36 48H43M36 58H43M36 68H43M36 78H43" stroke="#3b8fe0" stroke-width="2.5"/>` +
    `<path d="M57 78C51 74 50 69 52 68C54 67 56 68 57 70C58 68 60 67 62 68C64 69 63 74 57 78Z" fill="#ff9aa8" stroke-width="2"/>` +
    `<rect x="27" y="26" width="46" height="14" rx="5" fill="#3b8fe0"/>`,
  유모차:
    `<path d="M40 70L32 82M60 70L68 82" stroke-width="4"/>` +
    tube('M78 48L90 24', '#8a96b0', 4) + tube('M86 24H96', '#30354f', 5) +
    `<circle cx="60" cy="45" r="9" fill="${SKIN}"/>` + dot(57, 45, 1.8) + dot(63, 45, 1.8) +
    `<path d="M16 46H82C82 62 70 72 54 72H38C26 72 16 62 16 46Z" fill="#3b8fe0"/>` +
    `<path d="M16 46A32 32 0 0 1 48 14V46Z" fill="#ff9aa8"/><path d="M48 46L25 23M48 46L36 17" stroke-width="2.5"/>` +
    `<circle cx="30" cy="84" r="9" fill="#30354f"/><circle cx="70" cy="84" r="9" fill="#30354f"/>` +
    dot(30, 84, 3, '#dfe8f5') + dot(70, 84, 3, '#dfe8f5'),
  담요:
    `<path d="M16 16H84V84H16Z" fill="#7ec8f0"/>` +
    `<g fill="#3b78e6" stroke="none" opacity=".55"><rect x="26" y="16" width="10" height="68"/><rect x="50" y="16" width="10" height="68"/><rect x="74" y="16" width="10" height="68"/>` +
    `<rect x="16" y="26" width="68" height="10"/><rect x="16" y="50" width="68" height="10"/><rect x="16" y="74" width="68" height="10"/></g>` +
    `<path d="M16 16H84V84H16Z"/>` +
    `<path d="M22 84V93M30 84V93M38 84V93M46 84V93M54 84V93M62 84V93M70 84V93M78 84V93M22 16V7M30 16V7M38 16V7M46 16V7M54 16V7M62 16V7M70 16V7M78 16V7" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M84 60L60 84H84Z" fill="#dff2ff"/>`,
  커튼:
    `<rect x="22" y="18" width="56" height="68" fill="#7ec8f0"/><path d="M50 18V86M22 52H78" stroke="#fff" stroke-width="4"/>` +
    `<rect x="22" y="18" width="56" height="68"/>` +
    `<path d="M8 14H36C32 36 28 50 34 60C30 70 28 80 26 92H8Z" fill="#e8553d"/><path d="M16 18V90M24 18C24 40 22 52 28 60" stroke="#ff8a7a" stroke-width="3"/>` +
    `<path d="M92 14H64C68 36 72 50 66 60C70 70 72 80 74 92H92Z" fill="#e8553d"/><path d="M84 18V90M76 18C76 40 78 52 72 60" stroke="#ff8a7a" stroke-width="3"/>` +
    `<rect x="24" y="56" width="12" height="7" rx="3" fill="#ffd23f"/><rect x="64" y="56" width="12" height="7" rx="3" fill="#ffd23f"/>` +
    `<path d="M6 12H94" stroke-width="6"/>` + dot(6, 12, 5, '#ffd23f') + dot(94, 12, 5, '#ffd23f'),
  쿠션:
    `<path d="M14 18Q50 26 86 18Q78 50 86 82Q50 74 14 82Q22 50 14 18Z" fill="#a45cf0"/>` +
    `<path d="M22 26L44 46M78 26L56 46M22 74L44 54M78 74L56 54" stroke="#7a3fc0" stroke-width="3"/>` +
    `<circle cx="50" cy="50" r="7" fill="#ffd23f"/>` +
    `<circle cx="12" cy="16" r="5" fill="#ffd23f"/><circle cx="88" cy="16" r="5" fill="#ffd23f"/><circle cx="12" cy="84" r="5" fill="#ffd23f"/><circle cx="88" cy="84" r="5" fill="#ffd23f"/>` +
    `<path d="M26 30C28 26 32 24 36 24" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  계단:
    `<path d="M8 90V74H26V58H44V42H62V26H80V10H92V90Z" fill="#e8862e"/>` +
    `<path d="M8 74H26M26 58H44M44 42H62M62 26H80M80 10H92" stroke="#ffc36b" stroke-width="4"/>` +
    `<path d="M8 90V74H26V58H44V42H62V26H80V10H92V90Z"/>` +
    `<path d="M17 74V56M35 58V40M53 42V24M71 26V8" stroke-width="3"/>` +
    `<path d="M17 56L71 8" stroke="#6b3e26" stroke-width="5"/>`,
  사다리:
    [22, 38, 54, 70].map((y) => `<rect x="30" y="${y}" width="40" height="7" rx="2" fill="#f2c14e"/>`).join('') +
    `<path d="M26 6H34L32 94H22Z" fill="#e8862e"/><path d="M66 6H74L78 94H68Z" fill="#e8862e"/>` +
    `<path d="M4 94H96" stroke="#43b04a" stroke-width="5"/>`,
  망치:
    `<g transform="rotate(-30 50 50)">` +
    `<rect x="44" y="30" width="12" height="62" rx="5" fill="#e8862e"/>` +
    `<rect x="42" y="72" width="16" height="20" rx="5" fill="#e8553d"/>` +
    `<path d="M22 14H62L78 20V28L62 34H22C20 34 18 32 18 30V18C18 16 20 14 22 14Z" fill="#8a96b0"/>` +
    `<rect x="12" y="12" width="10" height="24" rx="2" fill="#6b7890"/>` +
    `<path d="M28 20H56" stroke="#dfe8f5" stroke-width="3"/>` +
    `</g>`,
  못:
    `<g transform="rotate(12 50 60)">` +
    `<path d="M44 16H56V70L50 84L44 70Z" fill="#dfe8f5"/>` +
    `<path d="M44 24L56 26M44 30L56 32M44 36L56 38" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M48 42V66" stroke="#fff" stroke-width="3"/>` +
    `<ellipse cx="50" cy="14" rx="18" ry="6" fill="#b8c6da"/>` +
    `</g>` +
    `<rect x="8" y="76" width="84" height="16" rx="3" fill="#c98b4f"/><path d="M16 84H34M60 82H84" stroke="#9a5b2e" stroke-width="2.5"/>`,
  삽:
    `<g transform="rotate(20 50 50)">` +
    `<path d="M38 10H62C62 20 58 22 56 22H44C42 22 38 20 38 10Z" fill="#30354f"/><rect x="44" y="12" width="12" height="5" fill="#fff7e0" stroke-width="2"/>` +
    `<rect x="45" y="20" width="10" height="44" rx="3" fill="#e8862e"/>` +
    `<path d="M32 60H68V76C68 86 60 94 50 96C40 94 32 86 32 76Z" fill="#8a96b0"/>` +
    `<path d="M40 66V82" stroke="#dfe8f5" stroke-width="3"/>` +
    `</g>`,
  밧줄:
    `<path d="M${coil}" stroke-width="13"/><path d="M${coil}" stroke="#d9a55b" stroke-width="7"/>` +
    `<path d="M${coil}" stroke="#a8743a" stroke-width="7" stroke-dasharray="2 6"/>` +
    tube('M74 48C80 66 78 80 90 90', '#d9a55b', 7) +
    `<path d="M90 90L94 94M88 92L90 96M92 88L96 90" stroke-width="2.5"/>`,
  실:
    `<path d="M70 76C82 80 86 90 94 88" stroke="#e8553d" stroke-width="4"/>` +
    `<circle cx="46" cy="50" r="34" fill="#e8553d"/>` +
    `<path d="M16 36C34 30 60 40 74 60M14 52C34 44 60 56 70 74M22 70C36 60 54 70 58 82M30 22C46 26 70 34 80 46M46 16C52 28 68 34 78 34" stroke="#b83a2a" stroke-width="3"/>` +
    `<path d="M24 30C28 25 34 21 40 20" stroke="#ff9a8a" stroke-width="3"/>`,
  바늘:
    `<g transform="rotate(40 50 50)">` +
    `<path d="M50 4C55 4 56 8 56 12L54 82L50 96L46 82L44 12C44 8 45 4 50 4Z" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="13" rx="2.2" ry="5.5" fill="#fff7e0" stroke-width="2"/>` +
    `<path d="M52 30V74" stroke="#fff" stroke-width="2.5"/>` +
    `</g>` +
    `<path d="M50 10C44 18 38 30 26 30C12 30 10 48 22 52C34 56 32 72 18 84" stroke="#e8553d" stroke-width="4.5"/>` +
    `<path d="M50 10C56 16 60 18 66 16" stroke="#e8553d" stroke-width="4.5"/>`,
  필통:
    pencil('translate(30 64) rotate(-14)', '#ffd23f') +
    pencil('translate(50 62)', '#e8553d') +
    pencil('translate(68 64) rotate(14)', '#43b04a') +
    `<rect x="8" y="50" width="84" height="40" rx="14" fill="#3b8fe0"/>` +
    `<path d="M14 58H86" stroke-width="3"/><path d="M16 58H84" stroke="#dfe8f5" stroke-width="2.5" stroke-dasharray="3 3"/>` +
    `<rect x="78" y="58" width="8" height="16" rx="3" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M20 72C30 78 40 80 52 80" stroke="#7ec8f0" stroke-width="3"/>`,
  스케치북:
    `<rect x="20" y="16" width="66" height="76" rx="3" fill="#e8553d"/>` +
    `<rect x="14" y="12" width="66" height="76" rx="3" fill="#fff"/>` +
    [22, 32, 42, 52, 62, 72].map((x) => `<path d="M${x} 16C${x - 5} 16 ${x - 5} 6 ${x} 6" stroke-width="3"/>`).join('') +
    `<path d="M14 16H80" stroke-width="3"/>` +
    `<circle cx="62" cy="34" r="9" fill="#ffd23f"/>` +
    `<path d="M20 82C28 60 44 58 54 70C60 62 70 62 76 70V82Z" fill="#5fc24a" stroke-width="3"/>` +
    `<path d="M34 64V52" stroke="#3a9e47" stroke-width="3"/>` + `<circle cx="34" cy="48" r="5" fill="#ff5c70" stroke-width="2.5"/>`,
  물감:
    `<path d="M50 14C74 12 94 26 94 46C94 60 84 66 72 64C62 62 58 70 62 78C66 88 52 92 38 88C18 82 6 66 8 46C10 28 28 16 50 14Z" fill="#f5d6a8"/>` +
    `<circle cx="32" cy="66" r="6" fill="#fff7e0"/>` +
    `<circle cx="30" cy="40" r="7" fill="#e8553d" stroke-width="2.5"/><circle cx="48" cy="30" r="7" fill="#ffd23f" stroke-width="2.5"/>` +
    `<circle cx="68" cy="30" r="7" fill="#3b78e6" stroke-width="2.5"/><circle cx="80" cy="46" r="6" fill="#43b04a" stroke-width="2.5"/>` +
    `<g transform="rotate(-25 70 80)">` +
    `<path d="M52 72H84L88 76L84 88H52Z" fill="#fff"/><rect x="44" y="74" width="10" height="12" rx="2" fill="#8e4fc9"/>` +
    `<rect x="60" y="76" width="16" height="8" fill="#8e4fc9" stroke-width="2"/>` +
    `</g>` +
    `<path d="M38 94C34 92 36 86 42 86" stroke="#8e4fc9" stroke-width="5"/>`,
  붓:
    `<path d="M10 86C24 72 40 90 54 76" stroke="#3b78e6" stroke-width="9"/>` +
    `<g transform="rotate(40 50 50)">` +
    `<rect x="45" y="4" width="10" height="52" rx="5" fill="#e8553d"/>` +
    `<rect x="43" y="54" width="14" height="14" fill="#dfe8f5"/>` +
    `<path d="M43 68C40 78 44 88 50 96C56 88 60 78 57 68Z" fill="#6b3e26"/>` +
    `<path d="M45 84C47 90 49 94 50 96C52 94 54 90 55 84Z" fill="#3b78e6" stroke-width="2.5"/>` +
    `</g>`,
  종이:
    `<g transform="rotate(-6 50 50)">` +
    `<path d="M20 10H66L82 26V90H20Z" fill="#fff"/>` +
    `<path d="M66 10V26H82Z" fill="#dfe8f5"/>` +
    `</g>` + sparkle(86, 70, 6),
  종이비행기:
    `<path d="M6 84C18 76 20 88 32 80" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="5 6"/>` +
    `<path d="M94 16L8 44L40 56Z" fill="#fff"/>` +
    `<path d="M94 16L40 56L48 82Z" fill="#dfe8f5"/>` +
    `<path d="M94 16L40 56L38 68Z" fill="#b8c6da"/>`,
  연:
    `<path d="M50 70C40 76 60 80 50 86C42 90 54 94 48 98" stroke="#1d2340" stroke-width="3"/>` +
    `<path d="M44 80L50 78L46 74Z" fill="#ffd23f" stroke-width="2"/><path d="M56 84L50 82L54 88Z" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M50 6L82 38L50 72L18 38Z" fill="#ffd23f"/>` +
    `<path d="M50 6L82 38H50Z" fill="#e8553d"/><path d="M18 38L50 72V38Z" fill="#e8553d"/>` +
    `<path d="M50 6L82 38L50 72L18 38Z"/><path d="M50 6V72M18 38H82" stroke-width="2.5"/>` +
    `<path d="M50 50C62 60 74 70 94 96" stroke="#9aa6c4" stroke-width="2"/>`,
  팽이:
    `<path d="M14 30C8 38 8 50 14 58M86 30C92 38 92 50 86 58" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M4 44C4 36 8 30 14 26M96 44C96 36 92 30 86 26" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="45" y="8" width="10" height="22" rx="4" fill="#e8553d"/>` +
    `<path d="M16 42Q50 20 84 42Q76 64 54 84H46Q24 64 16 42Z" fill="#ffd23f"/>` +
    `<path d="M18 46Q50 38 82 46L78 54Q50 46 22 54Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M30 66Q50 60 70 66" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M46 84L50 94L54 84Z" fill="#8a96b0"/>`,
  구슬:
    `<circle cx="60" cy="60" r="28" fill="#7ec8f0"/>` +
    `<path d="M44 48C52 58 50 70 60 76C68 70 64 56 76 48C68 52 58 50 44 48Z" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M44 44C46 40 50 37 54 36" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="24" cy="34" r="16" fill="#ff9aa8"/>` +
    `<path d="M16 32C20 38 26 40 32 34C28 30 22 30 16 32Z" fill="#e85d9a" stroke-width="2"/>` +
    `<path d="M16 26C18 23 20 22 22 22" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="22" cy="78" r="12" fill="#8fe08a"/><path d="M16 74C17 72 18 71 20 71" stroke="#fff" stroke-width="3"/>`,
  블록:
    cube(12, 60, 30, '#e8553d', '#ff8a7a', `<circle cx="27" cy="75" r="8" fill="#fff" stroke="none"/>`) +
    cube(46, 60, 30, '#3b78e6', '#7ea8f0', `<path d="M61 66L70 83H52Z" fill="#fff" stroke="none"/>`) +
    cube(30, 26, 30, '#ffd23f', '#fff09a', `<rect x="37" y="33" width="16" height="16" fill="#fff" stroke="none"/>`),
  비눗방울:
    `<path d="M24 92L34 70" stroke="#ff9f1a" stroke-width="5"/><circle cx="38" cy="62" r="10" stroke="#ff9f1a" stroke-width="5"/>` +
    [[60, 40, 24], [30, 28, 14], [78, 76, 12], [52, 80, 7]]
      .map(
        ([x, y, r]) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="#eaf7ff" stroke="#3b8fe0" stroke-width="3"/>` +
          `<path d="M${r1(x - r * 0.6)} ${r1(y - r * 0.2)}A${r1(r * 0.65)} ${r1(r * 0.65)} 0 0 1 ${r1(x - r * 0.1)} ${r1(y - r * 0.6)}" stroke="#fff" stroke-width="3.5"/>` +
          `<path d="M${r1(x + r * 0.7)} ${r1(y + r * 0.2)}A${r1(r * 0.75)} ${r1(r * 0.75)} 0 0 1 ${r1(x + r * 0.2)} ${r1(y + r * 0.7)}" stroke="#ff9aa8" stroke-width="3"/>`,
      )
      .join(''),
  줄넘기:
    tube('M24 34C10 104 90 104 76 34', '#43b04a', 4) +
    `<rect x="17" y="8" width="14" height="30" rx="6" fill="#e8553d"/><rect x="69" y="8" width="14" height="30" rx="6" fill="#e8553d"/>` +
    `<path d="M21 14V30M73 14V30" stroke="#ff9a8a" stroke-width="3"/>`,
  썰매:
    `<path d="M4 88C30 80 70 80 96 88V96H4Z" fill="#fff"/>` +
    `<path d="M26 58V74M50 58V74M72 58V74" stroke-width="5"/>` +
    tube('M12 76H74C88 76 92 62 82 58', '#e8553d', 5) +
    `<rect x="14" y="46" width="68" height="14" rx="4" fill="#c98b4f"/><path d="M36 48V58M58 48V58" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M82 52C90 42 94 32 90 22" stroke="#e8862e" stroke-width="3"/>` +
    sparkle(20, 22, 5, '#9fd4f5') + sparkle(48, 14, 4, '#9fd4f5') + sparkle(70, 28, 5, '#9fd4f5'),
  축구공:
    `<defs><clipPath id="pk-l1b-soccer"><circle cx="50" cy="50" r="38"/></clipPath></defs>` +
    `<circle cx="50" cy="50" r="38" fill="#fff"/>` +
    `<g clip-path="url(#pk-l1b-soccer)">` +
    `<path d="M${poly(50, 50, 11, 5)}Z" fill="${INK}"/>` +
    Array.from({ length: 5 }, (_, k) => {
      const a = ((-90 + k * 72) * Math.PI) / 180;
      const ix = r1(50 + 11 * Math.cos(a));
      const iy = r1(50 + 11 * Math.sin(a));
      const ox = r1(50 + 44 * Math.cos(a));
      const oy = r1(50 + 44 * Math.sin(a));
      const pa = ((-90 + k * 72 + 36) * Math.PI) / 180;
      const px = r1(50 + 40 * Math.cos(pa));
      const py = r1(50 + 40 * Math.sin(pa));
      return `<path d="M${ix} ${iy}L${ox} ${oy}" stroke-width="3"/><path d="M${poly(px, py, 10, 5, -90 + k * 72 + 36 + 180)}Z" fill="${INK}"/>`;
    }).join('') +
    `</g>` +
    `<circle cx="50" cy="50" r="38"/>`,
  곰인형:
    `<ellipse cx="50" cy="68" rx="24" ry="22" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="72" rx="13" ry="12" fill="#f5d6a8"/>` +
    `<ellipse cx="24" cy="62" rx="8" ry="12" fill="#c98b4f" transform="rotate(30 24 62)"/><ellipse cx="76" cy="62" rx="8" ry="12" fill="#c98b4f" transform="rotate(-30 76 62)"/>` +
    `<ellipse cx="32" cy="88" rx="12" ry="8" fill="#c98b4f"/><ellipse cx="68" cy="88" rx="12" ry="8" fill="#c98b4f"/>` +
    `<circle cx="32" cy="89" r="4.5" fill="#f5d6a8" stroke-width="2.5"/><circle cx="68" cy="89" r="4.5" fill="#f5d6a8" stroke-width="2.5"/>` +
    `<circle cx="30" cy="16" r="9" fill="#c98b4f"/><circle cx="70" cy="16" r="9" fill="#c98b4f"/>` +
    `<circle cx="30" cy="16" r="4" fill="#f5d6a8" stroke="none"/><circle cx="70" cy="16" r="4" fill="#f5d6a8" stroke="none"/>` +
    `<circle cx="50" cy="32" r="21" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="39" rx="9" ry="7" fill="#f5d6a8"/>` +
    dot(42, 29, 3) + dot(58, 29, 3) + `<ellipse cx="50" cy="36" rx="3.5" ry="2.5" fill="${INK}" stroke="none"/><path d="M47 41q3 3 6 0" stroke-width="2.5"/>` +
    `<path d="M50 54L38 46V60Z" fill="#e8553d"/><path d="M50 54L62 46V60Z" fill="#e8553d"/><circle cx="50" cy="54" r="4" fill="#e8553d"/>`,
  호루라기:
    `<path d="M22 44C14 38 12 28 18 22C24 16 32 20 32 28" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M40 30H88C92 30 94 32 94 36V44C94 48 92 50 88 50H60Z" fill="#ff9f1a"/>` +
    `<circle cx="40" cy="58" r="26" fill="#ff9f1a"/>` +
    `<path d="M40 32H70V50H62" fill="#ff9f1a" stroke="none"/>` +
    `<path d="M40 32H70"/>` +
    `<rect x="54" y="26" width="12" height="7" rx="2" fill="${INK}"/>` +
    `<circle cx="28" cy="36" r="5" fill="#dfe8f5"/>` +
    `<path d="M28 54C28 48 32 44 38 42" stroke="#ffd48a" stroke-width="4"/>`,
  탬버린:
    `<path d="M88 22l6-6M90 34l8-2M78 12l2-8" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="48" cy="54" r="38" fill="#e8553d"/>` +
    `<circle cx="48" cy="54" r="28" fill="#fff2d6"/>` +
    Array.from({ length: 6 }, (_, k) => {
      const a = ((-90 + k * 60) * Math.PI) / 180;
      const x = r1(48 + 33 * Math.cos(a));
      const y = r1(54 + 33 * Math.sin(a));
      return `<circle cx="${x}" cy="${y}" r="6" fill="#ffd23f" stroke-width="2.5"/>` + dot(x, y, 1.5);
    }).join('') +
    `<path d="M30 42C34 36 40 32 46 32" stroke="#fff" stroke-width="3"/>`,
  실로폰:
    `<path d="M10 40L90 48M10 76L90 68" stroke="#6b3e26" stroke-width="6"/>` +
    [
      ['#e8553d', 26],
      ['#ff9f1a', 24],
      ['#ffd23f', 22],
      ['#43b04a', 20],
      ['#3b8fe0', 18],
      ['#8e4fc9', 16],
    ]
      .map(([c, h], k) => {
        const x = 12 + k * 13;
        const hh = h as number;
        return `<rect x="${x}" y="${58 - hh}" width="10" height="${hh * 2}" rx="2" fill="${c}"/>` + dot(x + 5, 58 - hh + 5, 1.8) + dot(x + 5, 58 + hh - 5, 1.8);
      })
      .join('') +
    tube('M30 6L52 24', '#c98b4f', 3) + `<circle cx="54" cy="26" r="5.5" fill="#e8553d"/>` +
    tube('M84 8L66 26', '#c98b4f', 3) + `<circle cx="64" cy="28" r="5.5" fill="#e8553d"/>`,
  하모니카:
    `<g transform="rotate(-10 50 50)">` +
    `<rect x="10" y="36" width="80" height="30" rx="3" fill="#c98b4f"/>` +
    [15, 27, 39, 51, 63, 75].map((x) => `<rect x="${x}" y="44" width="10" height="14" rx="2" fill="${INK}" stroke="none"/>`).join('') +
    `<path d="M6 26H94V40C94 42 92 44 90 44H10C8 44 6 42 6 40Z" fill="#dfe8f5"/>` +
    `<path d="M6 76H94V62C94 60 92 58 90 58H10C8 58 6 60 6 62Z" fill="#dfe8f5"/>` +
    `<path d="M14 32H86M14 70H86" stroke="#fff" stroke-width="3"/>` +
    `</g>` +
    `<path d="M70 14q4-6 8 0t8 0M72 92q4-6 8 0t8 0M8 12q4-6 8 0t8 0" stroke="#9aa6c4" stroke-width="3"/>`,
  바이올린:
    `<g transform="rotate(-28 46 54)">` +
    `<path d="M46 26C60 26 64 32 60 40C58 44 58 48 62 52C70 60 70 80 58 86C52 90 40 90 34 86C22 80 22 60 30 52C34 48 34 44 32 40C28 32 32 26 46 26Z" fill="#c9702e"/>` +
    `<path d="M38 58C34 62 38 68 36 72M54 58C58 62 54 68 56 72" stroke-width="2.5"/>` +
    `<rect x="42" y="6" width="8" height="54" rx="2" fill="${INK}"/>` +
    `<circle cx="46" cy="6" r="5" fill="#9a5b2e"/>` +
    `<rect x="38" y="74" width="16" height="4" rx="1" fill="#f2c14e" stroke-width="2"/>` +
    `<path d="M44 12V76M48 12V76" stroke="#fff" stroke-width="1.2"/>` +
    `</g>` +
    `<path d="M16 22L88 86" stroke="#9a5b2e" stroke-width="4"/><path d="M20 20L90 82" stroke="#fff2d6" stroke-width="2"/>` +
    `<rect x="10" y="16" width="10" height="8" rx="2" fill="${INK}" transform="rotate(42 15 20)"/>`,
  드럼:
    `<path d="M76 22V76M64 76H88" stroke="#8a96b0" stroke-width="4"/>` +
    `<ellipse cx="76" cy="20" rx="18" ry="5" fill="#ffd23f"/>` +
    `<circle cx="44" cy="64" r="28" fill="#e8553d"/><circle cx="44" cy="64" r="20" fill="#fff"/>` +
    `<path d="M24 92L30 84M64 92L58 84" stroke-width="4"/>` +
    `<path d="M66 60V84H90V60Z" fill="#3b78e6"/><ellipse cx="78" cy="60" rx="12" ry="4" fill="#dfe8f5"/>` +
    tube('M14 12L34 36', '#e8b86a', 3) + tube('M40 8L46 36', '#e8b86a', 3),
  마이크:
    `<path d="M50 88C50 96 70 96 72 86C74 78 86 80 90 86" stroke="#30354f" stroke-width="4"/>` +
    `<path d="M40 44H60L55 88C55 92 45 92 45 88Z" fill="#30354f"/>` +
    `<rect x="38" y="42" width="24" height="8" rx="2" fill="#8a96b0"/>` +
    `<circle cx="50" cy="28" r="20" fill="#b8c6da"/>` +
    `<path d="M36 22H64M32 30H68M36 38H64M44 10V46M56 10V46" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="28" r="20"/>` +
    `<path d="M38 20C40 16 44 13 48 12" stroke="#fff" stroke-width="3"/>` +
    `<rect x="47" y="60" width="6" height="8" rx="2" fill="#43b04a" stroke-width="2"/>`,
  종:
    `<path d="M16 42C10 50 10 60 14 66M84 42C90 50 90 60 86 66" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="42" y="4" width="16" height="26" rx="6" fill="#9a5b2e"/>` +
    `<circle cx="50" cy="84" r="7" fill="#e8b830"/>` +
    `<path d="M50 28C34 28 30 40 30 56C30 66 26 72 20 78H80C74 72 70 66 70 56C70 40 66 28 50 28Z" fill="#ffd23f"/>` +
    `<rect x="16" y="74" width="68" height="8" rx="4" fill="#f2b632"/>` +
    `<path d="M40 40C38 46 38 54 38 62" stroke="#fff5c0" stroke-width="4"/>`,
  깃발:
    `<path d="M20 92H44" stroke-width="6"/>` +
    `<rect x="28" y="12" width="8" height="80" rx="3" fill="#c98b4f"/>` +
    `<circle cx="32" cy="10" r="6" fill="#ffd23f"/>` +
    `<path d="M36 16C50 10 60 22 74 18C82 16 88 14 92 14V52C86 52 80 54 74 56C60 60 50 48 36 54Z" fill="#e8553d"/>` +
    `<path d="M36 36C50 30 60 42 74 38C82 36 88 34 92 34V44C86 44 80 46 74 48C60 52 50 40 36 46Z" fill="#fff" stroke="none"/>` +
    `<path d="M36 16C50 10 60 22 74 18C82 16 88 14 92 14V52C86 52 80 54 74 56C60 60 50 48 36 54Z"/>` +
    `<path d="M50 72H74M58 80H86" stroke="#9aa6c4" stroke-width="3"/>`,
  방울:
    `<path d="M44 20C44 12 56 12 56 20" stroke-width="5"/>` +
    `<circle cx="50" cy="56" r="34" fill="#ffd23f"/>` +
    `<path d="M16 52C34 58 66 58 84 52" stroke-width="4"/>` +
    `<path d="M50 66V84" stroke-width="5"/><circle cx="50" cy="66" r="6" fill="${INK}"/>` +
    `<path d="M28 36C32 30 38 26 44 25" stroke="#fff5c0" stroke-width="5"/>` +
    `<path d="M50 22L32 12L34 30Z" fill="#e8553d"/><path d="M50 22L68 12L66 30Z" fill="#e8553d"/><circle cx="50" cy="22" r="5" fill="#e8553d"/>`,
  우체통:
    `<rect x="26" y="80" width="48" height="12" rx="2" fill="#6b7890"/>` +
    `<path d="M20 36C20 16 34 10 50 10S80 16 80 36V82H20Z" fill="#e8553d"/>` +
    `<path d="M20 36H80" stroke-width="3"/>` +
    `<rect x="32" y="44" width="36" height="7" rx="3" fill="${INK}"/>` +
    `<g transform="rotate(-8 50 40)"><rect x="38" y="26" width="24" height="18" rx="2" fill="#fff"/><path d="M38 28L50 37L62 28" stroke-width="2.5"/></g>` +
    `<rect x="36" y="60" width="28" height="12" rx="3" fill="#fff"/><path d="M42 66H58" stroke="#e8553d" stroke-width="3"/>`,
  신호등:
    `<rect x="44" y="70" width="12" height="24" fill="#8a96b0"/>` +
    `<rect x="28" y="4" width="44" height="70" rx="10" fill="#30354f"/>` +
    `<circle cx="50" cy="19" r="10" fill="#e8553d"/><circle cx="50" cy="39" r="10" fill="#ffd23f"/><circle cx="50" cy="59" r="10" fill="#43b04a"/>` +
    `<path d="M45 15C46 13 48 12 50 12M45 35C46 33 48 32 50 32M45 55C46 53 48 52 50 52" stroke="#fff" stroke-width="2.5" opacity=".6"/>` +
    `<path d="M32 94H68" stroke-width="5"/>`,
  벤치:
    `<path d="M4 90H96" stroke="#43b04a" stroke-width="6"/>` +
    `<path d="M20 26V88M80 26V88M14 88H26M74 88H86" stroke="#30354f" stroke-width="5"/>` +
    `<rect x="10" y="24" width="80" height="12" rx="3" fill="#e8862e"/><rect x="10" y="40" width="80" height="12" rx="3" fill="#e8862e"/>` +
    `<path d="M8 58H92L96 68H4Z" fill="#c9702e"/><path d="M4 68H96V72H4Z" fill="#e8862e"/>`,
  장바구니:
    tube('M24 36C24 10 76 10 76 36', '#e8553d', 5) +
    tube('M36 44L58 8', '#5fc24a', 6) + `<path d="M52 12L60 2M58 8L66 6" stroke="#3a9e47" stroke-width="4"/>` +
    tube('M62 44L74 18', '#ff9f1a', 9) +
    `<path d="M74 18L72 8M74 18L82 12M74 18L84 20" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<circle cx="28" cy="44" r="12" fill="#43b04a"/><path d="M22 40C26 44 30 44 34 40" stroke="#8fe08a" stroke-width="3"/>` +
    `<circle cx="52" cy="46" r="9" fill="#e8553d"/>` +
    `<path d="M10 44H90L82 92H18Z" fill="#e8553d"/>` +
    `<g fill="#fff" stroke="none" opacity=".6"><rect x="22" y="54" width="10" height="8" rx="2"/><rect x="38" y="54" width="10" height="8" rx="2"/><rect x="54" y="54" width="10" height="8" rx="2"/><rect x="70" y="54" width="8" height="8" rx="2"/>` +
    `<rect x="24" y="70" width="10" height="8" rx="2"/><rect x="40" y="70" width="10" height="8" rx="2"/><rect x="56" y="70" width="10" height="8" rx="2"/></g>`,
};
