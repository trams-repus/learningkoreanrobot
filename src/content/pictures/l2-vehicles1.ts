// 탈것 그림 묶음 (2단계: 버스·기차·일하는 차·배·하늘 탈것·자동차·옛 탈것). 그림 규칙은 docs/picture-style.md.
// 비슷한 것끼리 색·모양·표시로 구별한다.
//  버스: 통학(노란 승합차+아이 얼굴) · 관광(흰 차+보라 물결 무늬) · 마을(작고 둥근 초록) · 시내(긴 파랑+문 두 개) · 고속(은색 유선형+속도선+도로) · 이층(빨강 두 줄 창)
//  기차: 전동차(은색 칸+초록 띠+전깃줄) · 고속열차(뾰족한 코+속도선) · 증기기관차(검은 몸+연기+빨간 바퀴) · 화물열차(컨테이너 칸)
//  배: 화물선(컨테이너) · 여객선(흰 여러 층+동그란 창) · 어선(그물+물고기) · 돛단배(나무배+네모 돛) · 구조선(주황+구명 튜브)
import { INK, SKIN, dot, blob, tube, person, stick } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number, hub = '#dfe8f5') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, hub);

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝까지) */
const waves = (y: number, fill = '#7ec8f0') =>
  `<path d="M2 ${y}q8-6 16 0t16 0t16 0t16 0t16 0t16 0V98H2Z" fill="${fill}"/>`;

/** 창문 (하늘색) */
const win = (x: number, y: number, w: number, h: number, fill = '#8fd3ff') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke-width="2.5"/>`;

/** 트럭 앞머리 (오른쪽을 봄, x는 왼쪽 끝, 바닥 y=72) */
const cab = (x: number, fill: string) =>
  `<path d="M${x} 72V40C${x} 36 ${x + 2} 34 ${x + 6} 34H${x + 16}C${x + 20} 34 ${x + 22} 36 ${x + 24} 40L${x + 30} 54V72Z" fill="${fill}"/>` +
  `<path d="M${x + 6} 40H${x + 16}L${x + 21} 52H${x + 6}Z" fill="#8fd3ff"/>`;

/** 창 속 아이 얼굴 (가운데 x, 창 아래 y) */
const kid = (x: number, y: number, hair = '#5a3b24') =>
  `<circle cx="${x}" cy="${y - 6}" r="5" fill="${SKIN}" stroke-width="2"/>` +
  `<path d="M${x - 5} ${y - 7}C${x - 5} ${y - 13} ${x + 5} ${y - 13} ${x + 5} ${y - 7}C${x + 2} ${y - 9} ${x - 2} ${y - 9} ${x - 5} ${y - 7}Z" fill="${hair}" stroke-width="2"/>`;

/** 속도선 (왼쪽 뒤) */
const speed = (ys: number[], x1 = 2, x2 = 12) =>
  `<path d="${ys.map((y) => `M${x1} ${y}H${x2}`).join('')}" stroke="#9aa6c4" stroke-width="3"/>`;

/** 선로 */
const rail = (y: number) => `<path d="M2 ${y}H98" stroke-width="3"/>`;

/** 옆모습 승용차 (자동차 모양, 0~100 칸 기준). extra는 차체 위 무늬 */
const car = (body: string, extra = '') =>
  `<path d="M8 66V56C8 50 12 47 20 46L32 31C35 27 40 25 46 25H62C68 25 72 27 75 31L86 46C92 47 94 51 94 57V66Z" fill="${body}"/>` +
  extra +
  `<path d="M36 45L44 32H55V45Z" fill="#8fd3ff"/><path d="M61 45V32H70L78 45Z" fill="#8fd3ff"/>` +
  `<rect x="86" y="48" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
  wheel(28, 68, 11) +
  wheel(74, 68, 11);

/** 번개 모양 (전기) */
const bolt = (x: number, y: number, s: number, fill = '#ffd23f') =>
  `<path d="M${x + 2 * s} ${y - 10 * s}L${x - 5 * s} ${y + 1 * s}H${x}L${x - 2 * s} ${y + 10 * s}L${x + 5 * s} ${y - 1 * s}H${x}Z" fill="${fill}" stroke-width="2.5"/>`;

/** 구명 튜브 (빨강·흰 줄) */
const lifeRing = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` +
  `<path d="M${x - r} ${y}A${r} ${r} 0 0 1 ${x} ${y - r}V${y - r * 0.5}A${r * 0.5} ${r * 0.5} 0 0 0 ${x - r * 0.5} ${y}Z" fill="#e8553d" stroke="none"/>` +
  `<path d="M${x + r} ${y}A${r} ${r} 0 0 1 ${x} ${y + r}V${y + r * 0.5}A${r * 0.5} ${r * 0.5} 0 0 0 ${x + r * 0.5} ${y}Z" fill="#e8553d" stroke="none"/>` +
  `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#fff7e0" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  // ── 버스 ──
  통학버스:
    `<path d="M6 72V32C6 27 9 24 14 24H64C70 24 73 27 77 33L88 48C92 50 94 54 94 58V72Z" fill="#ffd23f"/>` +
    win(11, 30, 16, 18) +
    win(31, 30, 16, 18) +
    win(51, 30, 14, 18) +
    kid(19, 48) +
    kid(39, 48, '#9a5b2e') +
    kid(58, 48) +
    `<path d="M68 30C70 30 72 31 74 34L82 48H68Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="7.8" y="56" width="84.4" height="6" fill="${INK}" stroke="none"/>` +
    `<rect x="86" y="62" width="7" height="5" rx="2" fill="#fff" stroke-width="2"/>` +
    wheel(26, 74, 10) +
    wheel(74, 74, 10),
  관광버스:
    `<rect x="4" y="16" width="92" height="58" rx="8" fill="#fff"/>` +
    `<path d="M5.8 60C24 44 44 70 64 54S88 46 94.2 50V66H5.8Z" fill="#a45cf0" stroke="none"/>` +
    `<path d="M5.8 68C28 58 50 74 94.2 60V72H5.8Z" fill="#e85d9a" stroke="none"/>` +
    `<rect x="4" y="16" width="92" height="58" rx="8"/>` +
    `<rect x="10" y="22" width="68" height="20" rx="3" fill="#3b4a6b"/>` +
    `<path d="M28 22V42M46 22V42M64 22V42" stroke="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M82 22H86C89 22 90 24 90 27V48H82Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="88" y="58" width="6" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(24, 76, 10) +
    wheel(76, 76, 10),
  마을버스:
    `<rect x="14" y="16" width="70" height="58" rx="14" fill="#43b04a"/>` +
    win(22, 26, 18, 18) +
    win(44, 26, 18, 18) +
    `<path d="M66 26H74C77 26 78 28 78 31V52H66Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="15.8" y="54" width="66.4" height="6" fill="#ffd23f" stroke="none"/>` +
    `<rect x="36" y="8" width="26" height="8" rx="3" fill="#fff" stroke-width="2.5"/>` +
    wheel(32, 76, 10) +
    wheel(68, 76, 10),
  시내버스:
    `<rect x="4" y="18" width="92" height="56" rx="7" fill="#3b78e6"/>` +
    `<rect x="18" y="26" width="13" height="44" rx="2" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<rect x="60" y="26" width="13" height="44" rx="2" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M24.5 26V70M66.5 26V70" stroke-width="2"/>` +
    win(8, 26, 8, 18) +
    win(34, 26, 11, 18) +
    win(47, 26, 11, 18) +
    win(76, 26, 8, 18) +
    `<path d="M86 26H89C91 26 92 28 92 30V46H86Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="5.8" y="56" width="11" height="5" fill="#fff" stroke="none"/><rect x="33" y="56" width="26" height="5" fill="#fff" stroke="none"/><rect x="75" y="56" width="19.2" height="5" fill="#fff" stroke="none"/>` +
    wheel(42, 76, 9) +
    wheel(84, 76, 9),
  고속버스:
    speed([30, 42, 54], 2, 12) +
    `<path d="M16 74V26C16 22 18 20 22 20H74C80 20 84 22 88 28L96 46V74Z" fill="#dfe8f5"/>` +
    `<rect x="22" y="26" width="52" height="16" rx="3" fill="#3b4a6b"/>` +
    `<path d="M80 26C83 26 85 28 87 31L92 44H80Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    `<rect x="17.8" y="50" width="76.4" height="8" fill="#3b78e6" stroke="none"/>` +
    `<path d="M17.8 50H94" stroke-width="2"/><path d="M17.8 58H94.2" stroke-width="2"/>` +
    wheel(32, 76, 10) +
    wheel(80, 76, 10) +
    `<path d="M4 92H20M34 92H50M64 92H80" stroke="#8a96b0" stroke-width="4"/>`,
  이층버스:
    `<rect x="14" y="8" width="72" height="72" rx="8" fill="#e8553d"/>` +
    win(20, 16, 18, 16) +
    win(41, 16, 18, 16) +
    win(62, 16, 18, 16) +
    `<rect x="15.8" y="37" width="68.4" height="5" fill="#fff2d6" stroke="none"/>` +
    win(20, 46, 18, 16) +
    win(41, 46, 18, 16) +
    `<rect x="64" y="46" width="14" height="30" rx="2" fill="#8fd3ff" stroke-width="2.5"/>` +
    wheel(30, 82, 10) +
    wheel(70, 82, 10),

  // ── 기차 ──
  전동차:
    `<path d="M4 10H96" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M40 26L50 12L60 26M44 12H56" stroke-width="2.5"/>` +
    `<rect x="4" y="26" width="92" height="48" rx="6" fill="#dfe8f5"/>` +
    [14, 44, 74]
      .map((x) => `<rect x="${x}" y="32" width="12" height="40" rx="1.5" fill="#b8c4d8" stroke-width="2.5"/>` + win(x + 2, 35, 8, 14))
      .join('') +
    win(29, 34, 12, 16) +
    win(59, 34, 12, 16) +
    `<rect x="5.8" y="58" width="8" height="6" fill="#43b04a" stroke="none"/><rect x="27.5" y="58" width="15" height="6" fill="#43b04a" stroke="none"/><rect x="57.5" y="58" width="15" height="6" fill="#43b04a" stroke="none"/><rect x="87.5" y="58" width="6.7" height="6" fill="#43b04a" stroke="none"/>` +
    wheel(16, 80, 6) +
    wheel(30, 80, 6) +
    wheel(70, 80, 6) +
    wheel(84, 80, 6) +
    rail(88),
  고속열차:
    speed([28, 40], 2, 14) +
    `<path d="M4 72V38C4 34 6 32 10 32H54C70 32 88 44 95 62C97 67 94 72 89 72Z" fill="#fff"/>` +
    `<path d="M62 36C72 38 80 44 84 50H66Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    [10, 24, 38, 52].map((x) => win(x, 40, 10, 10)).join('') +
    `<path d="M5.8 58H92" stroke="#3b78e6" stroke-width="6"/>` +
    `<path d="M5.8 64H94" stroke="#e8553d" stroke-width="3"/>` +
    wheel(20, 78, 6) +
    wheel(36, 78, 6) +
    wheel(66, 78, 6) +
    wheel(80, 78, 6) +
    rail(86),
  증기기관차:
    blob('#dfe8f5', [
      [70, 16, 7],
      [58, 12, 8],
      [44, 12, 7],
      [32, 16, 5],
    ]) +
    `<path d="M66 40L63 22H79L76 40Z" fill="#30354f"/>` +
    `<rect x="36" y="38" width="50" height="28" rx="6" fill="#30354f"/>` +
    `<path d="M48 38a6 6 0 0 1 12 0Z" fill="#ffc933"/>` +
    `<path d="M40 52H84" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="88" cy="46" r="4" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="8" y="28" width="32" height="42" fill="#30354f"/><rect x="4" y="22" width="40" height="8" rx="3" fill="#e8553d"/>` +
    win(15, 36, 18, 14, '#ffd23f') +
    `<path d="M84 66L96 82H84Z" fill="#e8553d"/>` +
    wheel(24, 76, 12, '#e8553d') +
    wheel(52, 78, 10, '#e8553d') +
    wheel(74, 78, 10, '#e8553d') +
    `<path d="M24 76L74 78" stroke="#dfe8f5" stroke-width="3"/>` +
    rail(90),
  화물열차:
    `<rect x="4" y="18" width="34" height="22" fill="#ff9f1a"/>` +
    `<rect x="4" y="40" width="34" height="24" fill="#e8553d"/>` +
    `<rect x="40" y="40" width="30" height="24" fill="#3b78e6"/>` +
    `<path d="M12 22V36M21 22V36M30 22V36M12 44V60M21 44V60M30 44V60M48 44V60M55 44V60M62 44V60" stroke-width="2.5"/>` +
    `<rect x="4" y="64" width="34" height="6" fill="#4a4f66"/><rect x="40" y="64" width="30" height="6" fill="#4a4f66"/>` +
    `<path d="M72 70V40C72 36 74 34 78 34H86L96 48V70Z" fill="#43b04a"/>` +
    win(77, 39, 10, 10) +
    `<path d="M38 67H40M70 67H72" stroke-width="3"/>` +
    wheel(12, 76, 6) +
    wheel(30, 76, 6) +
    wheel(47, 76, 6) +
    wheel(63, 76, 6) +
    wheel(80, 76, 6) +
    wheel(92, 76, 5) +
    rail(84),

  // ── 일하는 차 ──
  레미콘:
    `<path d="M8 44C8 30 18 24 32 24L58 30C64 32 64 56 58 58L32 64C18 64 8 58 8 44Z" fill="#dfe8f5"/>` +
    `<path d="M22 26L30 62M36 25L44 62M50 28L56 59" stroke="#ff9f1a" stroke-width="5"/>` +
    `<path d="M8 44C8 30 18 24 32 24L58 30C64 32 64 56 58 58L32 64C18 64 8 58 8 44Z"/>` +
    `<path d="M10 56L4 70" stroke-width="5"/>` +
    `<rect x="6" y="62" width="58" height="8" fill="#8a96b0"/>` +
    cab(64, '#ff9f1a') +
    wheel(20, 76, 10) +
    wheel(44, 76, 10) +
    wheel(80, 76, 10),
  지게차:
    `<rect x="70" y="8" width="8" height="74" rx="2" fill="#4a4f66"/>` +
    `<path d="M78 62H96V67H78Z" fill="#4a4f66"/>` +
    `<rect x="78" y="36" width="18" height="26" rx="1" fill="#d9a066"/><path d="M87 36V48" stroke="#f5e3b8" stroke-width="4"/>` +
    tube('M26 50V20H60V50', '#8a96b0', 3) +
    `<path d="M32 50V40C32 36 34 34 38 34H44V50Z" fill="#3b4a6b"/>` +
    `<path d="M6 82V56C6 52 8 50 12 50H70V82Z" fill="#ffc933"/>` +
    `<path d="M10 56H22V76H10Z" fill="#e8b800" stroke-width="2.5"/>` +
    wheel(22, 82, 11) +
    wheel(58, 82, 11),
  굴착기:
    blob('#9a5b2e', [
      [78, 86, 10],
      [90, 84, 8],
      [66, 90, 7],
    ]) +
    `<rect x="4" y="74" width="54" height="18" rx="9" fill="#4a4f66"/>` +
    [14, 25, 36, 47].map((x) => dot(x, 83, 4, '#a9b4c9')).join('') +
    `<rect x="6" y="56" width="50" height="18" rx="3" fill="#ff9f1a"/>` +
    `<path d="M10 56V28H32L38 56Z" fill="#ff9f1a"/>` +
    `<path d="M15 33H29L33 51H15Z" fill="#8fd3ff"/>` +
    tube('M44 60L64 16', '#ff9f1a', 9) +
    tube('M64 16L84 56', '#ff9f1a', 8) +
    `<path d="M74 56H94L90 72C86 78 76 76 72 70Z" fill="#8a96b0"/>` +
    blob('#9a5b2e', [
      [80, 58, 5],
      [88, 57, 4],
    ]) +
    dot(64, 16, 3, '#4a4f66'),
  살수차:
    `<rect x="10" y="28" width="54" height="34" rx="15" fill="#3b8fe0"/>` +
    `<path d="M24 29V61M50 29V61" stroke="#2a6fc4" stroke-width="3"/>` +
    `<rect x="6" y="62" width="60" height="8" fill="#8a96b0"/>` +
    cab(64, '#43b04a') +
    `<path d="M8 66H4" stroke-width="4"/>` +
    `<path d="M4 64C-2 70 0 82 4 90M4 66C8 74 12 82 10 92M4 66C14 70 20 80 22 90" stroke="#4aa8f0" stroke-width="3"/>` +
    [
      [6, 94],
      [16, 94],
      [24, 94],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#4aa8f0'))
      .join('') +
    wheel(26, 76, 10) +
    wheel(46, 76, 10) +
    wheel(80, 76, 10),
  제설차:
    `<path d="M2 86Q30 80 50 86T98 84V98H2Z" fill="#fff"/>` +
    `<rect x="8" y="34" width="46" height="30" rx="3" fill="#ff9f1a"/>` +
    `<path d="M8 44H54" stroke="#fff" stroke-width="4"/>` +
    `<rect x="6" y="62" width="56" height="8" fill="#8a96b0"/>` +
    cab(56, '#ff9f1a') +
    `<rect x="64" y="24" width="12" height="8" rx="2" fill="#ffd23f" stroke-width="2.5"/>` +
    blob('#fff', [
      [96, 70, 8],
      [92, 80, 7],
    ]) +
    `<path d="M84 50L96 44V84L84 80Z" fill="#ffd23f"/><path d="M84 60L96 58M84 70L96 70" stroke="${INK}" stroke-width="2.5"/>` +
    wheel(22, 76, 10) +
    wheel(70, 76, 10) +
    [
      [20, 14],
      [42, 20],
      [34, 8],
      [60, 12],
      [84, 18],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke-width="2"/>`)
      .join(''),
  사다리차:
    `<rect x="72" y="4" width="26" height="46" fill="#f5e3b8"/>` +
    win(78, 12, 14, 16) +
    `<path d="M20 62L78 18M28 64L84 22" stroke-width="7"/><path d="M20 62L78 18M28 64L84 22" stroke="#dfe8f5" stroke-width="3"/>` +
    [0.15, 0.3, 0.45, 0.6, 0.75, 0.9]
      .map((f) => {
        const x1 = 20 + 58 * f;
        const y1 = 62 - 44 * f;
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${(x1 + 7).toFixed(1)} ${(y1 + 3).toFixed(1)}" stroke-width="2.5"/>`;
      })
      .join('') +
    `<rect x="46" y="28" width="14" height="12" fill="#d9a066" transform="rotate(-37 53 34)"/>` +
    `<rect x="6" y="62" width="58" height="8" fill="#8a96b0"/>` +
    `<rect x="12" y="56" width="22" height="8" rx="2" fill="#ffc933"/>` +
    cab(64, '#ffc933') +
    wheel(20, 76, 10) +
    wheel(44, 76, 10) +
    wheel(80, 76, 10),
  이삿짐차:
    `<rect x="8" y="16" width="16" height="40" rx="2" fill="#9a5b2e"/><path d="M16 18V54" stroke-width="2.5"/>` +
    `<rect x="26" y="36" width="18" height="20" fill="#d9a066"/><path d="M35 36V46" stroke="#f5e3b8" stroke-width="3"/>` +
    `<rect x="28" y="22" width="14" height="14" fill="#c98b4f"/>` +
    `<path d="M48 56V34H62V42" fill="none" stroke="#e8553d" stroke-width="5"/><path d="M48 46H62V56" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M4 56H66V70H4Z" fill="#3b78e6"/>` +
    `<path d="M4 50V56M66 50V56" stroke-width="3"/>` +
    cab(64, '#3b78e6') +
    wheel(20, 76, 10) +
    wheel(80, 76, 10),
  택배차:
    `<rect x="4" y="20" width="60" height="50" rx="3" fill="#fff"/>` +
    `<path d="M20 34L34 28L48 34V54L34 60L20 54Z" fill="#d9a066"/>` +
    `<path d="M20 34L34 40L48 34M34 40V60" stroke-width="2.5"/>` +
    `<path d="M27 31L41 37" stroke="#f5e3b8" stroke-width="3"/>` +
    `<rect x="5.8" y="62" width="56.4" height="6" fill="#3b78e6" stroke="none"/>` +
    cab(64, '#3b78e6') +
    wheel(20, 76, 10) +
    wheel(80, 76, 10),
  우편차:
    `<path d="M6 72V30C6 26 8 24 12 24H62C68 24 72 27 76 32L88 46C92 48 94 52 94 56V72Z" fill="#e8553d"/>` +
    `<path d="M66 30C69 30 71 32 73 35L81 46H66Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="14" y="32" width="38" height="26" rx="2" fill="#fff"/>` +
    `<path d="M14 33L33 48L52 33" stroke-width="3"/>` +
    `<rect x="86" y="58" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(24, 74, 10) +
    wheel(74, 74, 10),
  경운기:
    `<rect x="4" y="48" width="42" height="22" rx="2" fill="#9a5b2e"/>` +
    `<path d="M4 58H46" stroke="#c98b4f" stroke-width="3"/>` +
    wheel(22, 78, 9) +
    `<path d="M46 62H58" stroke-width="5"/>` +
    tube('M60 42L32 20', '#8a96b0', 3) +
    `<path d="M26 16L34 22" stroke-width="6"/>` +
    `<path d="M78 34V20" stroke-width="5"/>` +
    `<rect x="58" y="34" width="34" height="28" rx="3" fill="#3b78e6"/>` +
    `<circle cx="84" cy="44" r="9" fill="#dfe8f5"/>` +
    dot(84, 44, 3) +
    `<path d="M62 40H74M62 48H74M62 56H74" stroke="#2a6fc4" stroke-width="3"/>` +
    `<circle cx="72" cy="78" r="16" fill="${INK}"/>` +
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        return `<circle cx="${(72 + 16 * Math.cos(t)).toFixed(1)}" cy="${(78 + 16 * Math.sin(t)).toFixed(1)}" r="3" fill="${INK}" stroke="none"/>`;
      })
      .join('') +
    dot(72, 78, 7, '#e8553d'),

  // ── 배 ──
  화물선:
    [
      [12, 44, '#e8553d'],
      [26, 44, '#3b78e6'],
      [40, 44, '#43b04a'],
      [54, 44, '#ffd23f'],
      [12, 30, '#ff9f1a'],
      [26, 30, '#43b04a'],
      [40, 30, '#e8553d'],
      [54, 30, '#3b78e6'],
    ]
      .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="14" height="14" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
    `<rect x="72" y="24" width="16" height="34" fill="#fff"/>` +
    win(75, 28, 10, 6) +
    `<rect x="76" y="14" width="8" height="10" fill="#e8553d"/>` +
    `<path d="M4 58H96L88 80H12Z" fill="#30354f"/>` +
    `<path d="M6 64H94" stroke="#e8553d" stroke-width="4"/>` +
    waves(82),
  여객선:
    `<rect x="60" y="8" width="10" height="16" fill="#e8553d"/><path d="M60 13H70" stroke="#fff" stroke-width="3"/>` +
    `<rect x="32" y="22" width="40" height="12" rx="2" fill="#fff"/>` +
    [36, 46, 56, 66].map((x) => win(x, 25, 6, 6)).join('') +
    `<rect x="18" y="34" width="66" height="14" rx="2" fill="#fff"/>` +
    [22, 32, 42, 52, 62, 72].map((x) => win(x, 37, 7, 7)).join('') +
    `<path d="M4 48H96L88 76H12Z" fill="#3b78e6"/>` +
    [18, 30, 42, 54, 66, 78].map((x) => `<circle cx="${x}" cy="58" r="3.5" fill="#fff" stroke-width="2"/>`).join('') +
    `<path d="M8 66H92" stroke="#fff" stroke-width="3"/>` +
    waves(80),
  어선:
    `<path d="M26 16V58" stroke-width="4"/>` +
    `<path d="M26 18L10 48" stroke-width="3"/>` +
    `<path d="M10 48L4 58H26Z" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M26 16L36 20L26 24" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M26 18L6 50L24 54Z" fill="#fff" fill-opacity=".5" stroke-width="2"/>` +
    `<path d="M10 42L22 46M8 46L24 50M14 34L24 36M18 28L25 29" stroke-width="1.8"/>` +
    `<rect x="52" y="30" width="28" height="24" rx="2" fill="#fff"/>` +
    win(56, 35, 8, 8) +
    win(68, 35, 8, 8) +
    `<path d="M4 54H96L88 76H14Z" fill="#43b04a"/>` +
    `<path d="M8 62H92" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 42C40 34 50 36 52 42C50 48 40 50 34 42ZM34 42L28 36V48Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    dot(46, 41, 1.8) +
    waves(80),
  돛단배:
    `<path d="M50 8V70" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M24 12H78L82 62H20Z" fill="#fff2d6"/>` +
    `<path d="M23 26H79M22 40H80M21 52H81" stroke="#c98b4f" stroke-width="3"/>` +
    `<path d="M8 64H92L80 84H20Z" fill="#9a5b2e"/>` +
    `<path d="M12 72H88" stroke="#6b3e26" stroke-width="3"/>` +
    waves(84),
  카누:
    `<path d="M6 58C20 74 80 74 94 58C92 66 88 72 80 76H20C12 72 8 66 6 58Z" fill="#e8553d"/>` +
    `<path d="M6 58C20 64 80 64 94 58" stroke-width="3"/>` +
    `<path d="M34 60V44C34 38 38 36 42 36H52C56 36 58 40 58 44V60Z" fill="#43b04a"/>` +
    `<circle cx="46" cy="26" r="9" fill="${SKIN}"/>` +
    `<path d="M37 24C37 16 55 16 55 24C51 20 41 20 37 24Z" fill="#5a3b24"/>` +
    tube('M44 44L66 50', SKIN, 3) +
    tube('M64 22L76 76', '#9a5b2e', 3) +
    `<path d="M72 64L80 62L86 86L78 88Z" fill="#ffc933"/>` +
    waves(80),
  카약:
    `<path d="M2 64C20 56 80 56 98 64C80 72 20 72 2 64Z" fill="#ffd23f"/>` +
    `<ellipse cx="50" cy="60" rx="14" ry="4" fill="#4a4f66" stroke-width="2.5"/>` +
    `<path d="M40 60V44C40 38 44 36 48 36H52C56 36 60 38 60 44V60Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="26" r="9" fill="${SKIN}"/>` +
    `<path d="M41 24C41 14 59 14 59 24Z" fill="#3b78e6"/>` +
    `<path d="M16 72L84 20" stroke-width="7"/><path d="M16 72L84 20" stroke="#8a96b0" stroke-width="3"/>` +
    `<ellipse cx="88" cy="17" rx="4" ry="9" fill="#3b78e6" transform="rotate(53 88 17)"/>` +
    `<ellipse cx="12" cy="75" rx="4" ry="9" fill="#3b78e6" transform="rotate(53 12 75)"/>` +
    `<circle cx="38" cy="55" r="4" fill="${SKIN}" stroke-width="2.5"/><circle cx="62" cy="38" r="4" fill="${SKIN}" stroke-width="2.5"/>` +
    waves(80),
  고무보트:
    `<path d="M10 70H90L84 78H16Z" fill="#8a96b0"/>` +
    `<path d="M6 56C6 46 12 42 22 42H74C88 42 96 46 96 54C96 64 88 70 78 70H18C10 70 6 64 6 56Z" fill="#ff9f1a"/>` +
    `<path d="M14 50q7 8 14 0t14 0t14 0t14 0t14 0" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M64 26L40 66" stroke-width="6"/><path d="M64 26L40 66" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M58 22L70 28L64 36L54 30Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M50 42V32" stroke-width="3"/><path d="M86 44L90 30" stroke-width="3"/>` +
    waves(78),
  모터보트:
    `<path d="M12 50V70" stroke-width="3"/><rect x="4" y="44" width="14" height="14" rx="3" fill="#4a4f66"/>` +
    `<path d="M16 50H70C80 50 90 54 96 60L86 74H22L16 64Z" fill="#fff"/>` +
    `<path d="M17 62H92" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M50 50L58 36H66L68 50Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="30" y="42" width="14" height="8" rx="2" fill="#e8553d"/>` +
    blob('#fff', [
      [8, 76, 5],
      [16, 72, 6],
      [26, 76, 5],
    ]) +
    waves(80) +
    `<path d="M40 88H70M60 94H88" stroke="#fff" stroke-width="3"/>`,
  수상스키:
    `<path d="M96 18L62 49" stroke="#4a4f66" stroke-width="2"/>` +
    stick(44, 28, 'M0 10L-4 32M-1 16L18 21M-4 32L8 42L4 54M-4 32L-12 42L-8 54', 1.05) +
    tube('M43 40L40 58', '#ff9f1a', 7) +
    tube('M61 44L63 54', '#e8553d', 3) +
    `<path d="M22 86L76 82" stroke-width="8"/><path d="M22 86L76 82" stroke="#ffd23f" stroke-width="4"/>` +
    blob('#fff', [
      [14, 80, 6],
      [10, 70, 5],
      [20, 74, 4],
    ]) +
    waves(86),
  제트스키:
    blob('#fff', [
      [10, 64, 6],
      [8, 52, 5],
      [16, 58, 5],
    ]) +
    `<path d="M14 62H70C80 62 90 64 96 70L88 78H20Z" fill="#ffd23f"/>` +
    `<path d="M16 70H92" stroke="#3b78e6" stroke-width="5"/>` +
    `<path d="M50 62L58 46H72L76 62Z" fill="#3b78e6"/>` +
    `<path d="M30 62C30 56 34 54 40 54H50V62Z" fill="#4a4f66"/>` +
    person(40, 56, 0.95, { hair: '#5a3b24', style: 'short', shirt: '#e8553d' }) +
    tube('M44 40L62 46', SKIN, 3) +
    tube('M60 42L64 50', '#4a4f66', 2) +
    waves(80),
  잠수정:
    `<rect x="4" y="4" width="92" height="92" rx="10" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 86q10-6 20 0t20 0t20 0t20 0t12 0V96H4Z" fill="#f2c14e" stroke-width="2.5"/>` +
    `<path d="M14 50L4 40V60Z" fill="#ff9f1a"/>` +
    `<rect x="38" y="20" width="18" height="14" rx="3" fill="#ffc933"/>` +
    `<ellipse cx="50" cy="50" rx="38" ry="20" fill="#ffc933"/>` +
    `<circle cx="72" cy="48" r="11" fill="#8fd3ff"/><path d="M68 42C70 40 74 40 76 42" stroke="#fff" stroke-width="2.5"/>` +
    `<circle cx="36" cy="48" r="5" fill="#8fd3ff" stroke-width="2.5"/><circle cx="50" cy="48" r="5" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M47 20V12H56" stroke-width="3"/>` +
    [
      [84, 22, 3],
      [90, 14, 2.5],
      [80, 10, 2],
      [18, 22, 2.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke-width="1.8"/>`)
      .join(''),
  구조선:
    `<rect x="50" y="10" width="10" height="6" rx="2" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M30 52V26C30 20 34 16 40 16H66C72 16 76 22 78 30L82 52Z" fill="#fff"/>` +
    win(38, 22, 12, 10) +
    win(54, 22, 12, 10) +
    lifeRing(46, 42, 9) +
    `<path d="M4 52H96L86 78H12Z" fill="#ff9f1a"/>` +
    `<path d="M8 62H90" stroke="#fff" stroke-width="4"/>` +
    waves(80),

  // ── 하늘 ──
  여객기:
    `<g transform="rotate(-14 50 50)">` +
    `<path d="M16 46L6 22H16L30 44Z" fill="#e8553d"/>` +
    `<path d="M40 50L60 50L50 30H42Z" fill="#dfe8f5"/>` +
    `<path d="M6 50C6 44 12 42 20 42H82C92 42 98 46 98 52C98 58 92 60 82 60H20C12 60 6 56 6 50Z" fill="#fff"/>` +
    `<path d="M84 44C89 45 93 48 94 51H84Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    [24, 31, 38, 45, 52, 59, 66, 73].map((x) => dot(x, 49, 2, '#3b78e6')).join('') +
    `<path d="M8 55H90" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M40 56L62 56L46 86H36Z" fill="#dfe8f5"/>` +
    `<rect x="44" y="66" width="16" height="8" rx="4" fill="#8a96b0"/>` +
    `</g>`,
  경비행기:
    `<path d="M20 44L12 26H22L30 44Z" fill="#ffd23f"/>` +
    `<path d="M14 50C14 44 20 42 28 42H72C80 42 86 46 86 52C86 58 80 60 72 60H28C20 60 14 56 14 50Z" fill="#e8553d"/>` +
    `<path d="M50 42L56 30H70L74 42Z" fill="#8fd3ff"/>` +
    `<rect x="30" y="24" width="56" height="7" rx="3" fill="#ffd23f"/>` +
    `<path d="M60 31L58 42M78 31L76 42" stroke-width="2.5"/>` +
    `<path d="M86 50H90" stroke-width="4"/>` +
    `<ellipse cx="92" cy="50" rx="3" ry="18" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M40 60L36 72M72 60L74 72" stroke-width="3"/>` +
    wheel(36, 74, 5) +
    wheel(74, 74, 5) +
    `<path d="M16 52H4" stroke-width="3"/>`,
  패러글라이더:
    `<path d="M8 32C14 10 86 10 92 32C80 26 20 26 8 32Z" fill="#ff9f1a"/>` +
    `<path d="M30 16C28 22 28 26 28 28M50 12V27M70 16C72 22 72 26 72 28" stroke-width="2.5"/>` +
    `<path d="M29 17C37 13 44 12 50 12V27C43 27 36 27 29 28Z" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M71 17C78 20 86 24 92 32C85 30 78 29 71 28Z" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M10 32L46 62M30 28L46 62M70 28L54 62M90 32L54 62" stroke="#9aa6c4" stroke-width="1.8"/>` +
    `<path d="M40 64H60V78C60 82 56 84 50 84S40 82 40 78Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="54" r="8" fill="${SKIN}"/>` +
    `<path d="M42 52C42 44 58 44 58 52Z" fill="#e8553d"/>` +
    `<path d="M46 84L42 94M54 84L58 94" stroke-width="4"/>`,
  비행선:
    blob('#fff', [
      [14, 80, 6],
      [24, 76, 7],
      [34, 80, 5],
    ]) +
    `<path d="M14 36L4 22H16L22 38Z" fill="#e8553d"/>` +
    `<path d="M14 54L4 68H16L22 52Z" fill="#e8553d"/>` +
    `<ellipse cx="52" cy="45" rx="42" ry="20" fill="#dfe8f5"/>` +
    `<path d="M14 45H94" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M30 28C36 34 36 56 30 62M72 28C66 34 66 56 72 62" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M40 64H64L62 72H42Z" fill="#ff9f1a"/>` +
    win(46, 65, 5, 4) +
    win(54, 65, 5, 4),
  드론:
    `<path d="M14 42H86" stroke-width="7"/><path d="M14 42H86" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M26 36H74" stroke-width="6"/><path d="M26 36H74" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M14 42V34M86 42V34M26 36V28M74 36V28" stroke-width="4"/>` +
    `<ellipse cx="26" cy="26" rx="14" ry="3.5" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<ellipse cx="74" cy="26" rx="14" ry="3.5" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<ellipse cx="14" cy="32" rx="14" ry="4" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<ellipse cx="86" cy="32" rx="14" ry="4" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<rect x="36" y="34" width="28" height="18" rx="7" fill="#fff"/>` +
    `<path d="M40 52L34 66M60 52L66 66M28 66H40M60 66H72" stroke-width="3.5"/>` +
    `<circle cx="50" cy="58" r="6" fill="#4a4f66"/>` +
    dot(50, 58, 2.5, '#8fd3ff') +
    dot(44, 42, 2, '#43b04a'),

  // ── 자동차 ──
  전기차:
    `<rect x="4" y="28" width="14" height="52" rx="3" fill="#43b04a"/>` +
    `<rect x="7" y="34" width="8" height="10" rx="1.5" fill="#bfe6ff" stroke-width="2"/>` +
    bolt(11, 56, 0.7) +
    `<path d="M18 62C28 62 26 50 32 50" stroke-width="3.5"/>` +
    `<g transform="translate(20 16) scale(0.8)">` +
    car('#7ec8f0', bolt(54, 54, 1)) +
    `</g>` +
    `<rect x="28" y="46" width="6" height="8" rx="2" fill="#4a4f66" stroke-width="2"/>`,
  스포츠카:
    speed([40, 52], 2, 10) +
    `<path d="M10 42L8 34H22L22 44" fill="#e8553d"/>` +
    `<path d="M6 68V58C6 52 10 50 16 50L36 40C42 37 48 36 56 36H64C72 36 78 40 84 46L94 54C96 56 96 60 96 62V68Z" fill="#e8553d"/>` +
    `<path d="M40 49L50 40H60V49Z" fill="#3b4a6b" stroke-width="2.5"/><path d="M64 49V40C70 41 74 44 78 49Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    `<path d="M8 58H94" stroke="#fff" stroke-width="3"/>` +
    wheel(26, 68, 11, '#ffd23f') +
    wheel(78, 68, 11, '#ffd23f'),
  오픈카:
    person(46, 54, 1.05, { hair: '#5a3b24', style: 'long', shirt: '#ffd23f', glasses: true }) +
    `<path d="M24 28C18 30 14 36 12 42" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M62 50L70 32" stroke-width="4"/><path d="M62 50L68 34H72L66 50Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M6 70V56C6 52 8 50 12 50H84C90 50 94 54 94 60V70Z" fill="#e85d9a"/>` +
    `<path d="M8 58H92" stroke="#fff" stroke-width="3"/>` +
    `<rect x="86" y="52" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(24, 72, 11) +
    wheel(76, 72, 11),
  지프:
    `<circle cx="10" cy="46" r="10" fill="${INK}"/>` +
    dot(10, 46, 4.5, '#8a96b0') +
    `<path d="M12 70V26C12 22 14 20 18 20H62C66 20 68 22 70 26L74 40H88C92 40 94 42 94 46V70Z" fill="#3a9e47"/>` +
    win(18, 26, 18, 14) +
    win(40, 26, 18, 14) +
    `<path d="M62 26L68 40H62Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M60 26V64" stroke-width="2.5"/>` +
    `<path d="M92 50V66H98" stroke-width="3"/>` +
    `<rect x="86" y="44" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(30, 72, 13) +
    wheel(78, 72, 13),
  버기카:
    `<path d="M2 88Q30 76 60 84T98 80V98H2Z" fill="#f2c14e"/>` +
    tube('M24 58L34 26H64L74 56', '#ff9f1a', 3) +
    tube('M34 26L42 56', '#ff9f1a', 3) +
    `<circle cx="52" cy="40" r="8" fill="#3b78e6"/><path d="M48 38H58" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M12 60H88L84 68H16Z" fill="#ff9f1a"/>` +
    `<circle cx="24" cy="72" r="15" fill="${INK}"/>` +
    [0, 60, 120, 180, 240, 300]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        return `<circle cx="${(24 + 15 * Math.cos(t)).toFixed(1)}" cy="${(72 + 15 * Math.sin(t)).toFixed(1)}" r="3" fill="${INK}" stroke="none"/>`;
      })
      .join('') +
    dot(24, 72, 6, '#ff9f1a') +
    wheel(80, 74, 12, '#ff9f1a'),
  카트:
    `<path d="M4 40H20V48H4Z" fill="${INK}" stroke-width="2"/>` +
    [4, 12].map((x) => `<rect x="${x}" y="40" width="4" height="4" fill="#fff" stroke="none"/><rect x="${x + 4}" y="44" width="4" height="4" fill="#fff" stroke="none"/>`).join('') +
    `<path d="M4 40V70" stroke-width="3"/>` +
    person(46, 64, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M33 32C33 16 59 16 59 32Z" fill="#ffd23f"/>` +
    `<path d="M40 30H58" stroke="#3b4a6b" stroke-width="5"/>` +
    tube('M60 50L66 56', '#4a4f66', 3) +
    `<path d="M18 64H88L94 72H24Z" fill="#e8553d"/>` +
    `<path d="M26 72H90" stroke-width="3"/>` +
    wheel(32, 76, 10) +
    wheel(80, 76, 10),
  인력거:
    `<path d="M10 20C10 12 16 8 26 8H44C44 20 44 30 42 44H14C12 36 10 28 10 20Z" fill="#30354f"/>` +
    `<path d="M14 28H42" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M10 44H50V58H10Z" fill="#e8553d"/>` +
    `<path d="M50 56L82 52" stroke-width="7"/><path d="M50 56L82 52" stroke="#9a5b2e" stroke-width="3"/>` +
    `<circle cx="30" cy="72" r="20" fill="#fff7e0"/>` +
    `<path d="M30 52V92M10 72H50M16 58L44 86M44 58L16 86" stroke-width="2"/>` +
    `<circle cx="30" cy="72" r="20"/>` +
    dot(30, 72, 4) +
    stick(78, 24, 'M0 10L-4 34M-2 16L4 28L6 30M-4 34L6 46L4 60M-4 34L-12 46L-18 56', 1) +
    `<path d="M68 12C68 6 88 6 88 12Z" fill="#f2c14e" stroke-width="2.5"/>`,
  가마:
    `<path d="M20 26L50 8L80 26Z" fill="#6b3e26"/>` +
    `<path d="M18 26H82" stroke-width="5"/>` +
    `<rect x="28" y="26" width="44" height="42" fill="#e8553d"/>` +
    `<rect x="37" y="32" width="26" height="24" rx="2" fill="#ffd23f"/>` +
    `<path d="M44 32V56M50 32V56M56 32V56" stroke="#e8a800" stroke-width="2.5"/>` +
    `<path d="M28 62H72" stroke="#ffd23f" stroke-width="3"/>` +
    person(15, 98, 0.95, { hair: '#5a3b24', style: 'short', shirt: '#dfe8f5' }) +
    person(85, 98, 0.95, { hair: '#5a3b24', style: 'short', shirt: '#dfe8f5' }) +
    tube('M2 76H98', '#9a5b2e', 4),
};
