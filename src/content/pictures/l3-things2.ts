// 그림 묶음: 병원·안전 물건, 과학 실험 도구, 옛 시계, 빛·힘 도구, 난방·냉방 기구, 주방 기계 (l3). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(비상벨·화재경보기·사이렌·경광등 / 비커·플라스크·시험관 / 볼록렌즈·오목거울 / 난로·벽난로·온풍기·보일러 /
// 핫팩·손난로 / 와플기계·와플팬)는 실루엣·색·곁들인 장면을 다르게 했다.
import { SKIN, HL, dot, blob, sparkle, tube, face, torso, drop, person } from '../pictureKit.ts';

const GLASS = '#e6f5ff';

/** 김 (위로 오르는 세 줄) */
const steam = (x: number, y: number, gap = 12) =>
  `<path d="M${x - gap} ${y}c-5-5 5-9 0-15M${x} ${y - 2}c-5-5 5-9 0-15M${x + gap} ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 따뜻한 기운 (주황 물결 세 줄) */
const heat = (x: number, y: number, gap = 12, c = '#ff9f1a') =>
  `<path d="M${x - gap} ${y}c-5-5 5-9 0-15M${x} ${y - 3}c-5-5 5-9 0-15M${x + gap} ${y}c-5-5 5-9 0-15" stroke="${c}" stroke-width="4"/>`;

/** 눈송이 (선 세 개) */
const flake = (x: number, y: number, r: number, c = '#3b8fe0', w = 3.5) => {
  const a = (r * 0.87).toFixed(1);
  const b = (r * 0.5).toFixed(1);
  return `<path d="M${x} ${y - r}V${y + r}M${x - Number(a)} ${y - Number(b)}L${x + Number(a)} ${y + Number(b)}M${x - Number(a)} ${y + Number(b)}L${x + Number(a)} ${y - Number(b)}" stroke="${c}" stroke-width="${w}"/>`;
};

/** 소리 퍼지는 선 (양쪽) */
const waves = (x1: number, x2: number, y: number, c = '#ff9f1a') =>
  `<path d="M${x1} ${y - 9}q-6 9 0 18M${x1 - 9} ${y - 16}q-10 16 0 32M${x2} ${y - 9}q6 9 0 18M${x2 + 9} ${y - 16}q10 16 0 32" stroke="${c}" stroke-width="4"/>`;

/** 불꽃 (x, 아래 y, 높이 h) */
const flame = (x: number, y: number, h: number) =>
  `<path d="M${x} ${y - h}C${x - h * 0.55} ${y - h * 0.45} ${x - h * 0.45} ${y} ${x} ${y}S${x + h * 0.55} ${y - h * 0.45} ${x} ${y - h}Z" fill="#ff9f1a"/>` +
  `<path d="M${x} ${y - h * 0.55}C${x - h * 0.25} ${y - h * 0.25} ${x - h * 0.2} ${y} ${x} ${y}S${x + h * 0.25} ${y - h * 0.25} ${x} ${y - h * 0.55}Z" fill="${HL}" stroke="none"/>`;

/** 와플 격자 (사각 영역 안에 줄) */
const grid = (x: number, y: number, w: number, h: number, n: number, c: string) => {
  let d = '';
  for (let i = 1; i < n; i++) d += `M${x + (w * i) / n} ${y}V${y + h}M${x} ${y + (h * i) / n}H${x + w}`;
  return `<path d="${d}" stroke="${c}" stroke-width="3"/>`;
};

export const PICS: Record<string, string> = {
  약병:
    `<rect x="36" y="8" width="28" height="16" rx="4" fill="#fff"/><path d="M40 13V19M46 13V19M52 13V19M58 13V19" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<rect x="41" y="23" width="18" height="8" fill="#c7702a"/>` +
    `<rect x="22" y="30" width="56" height="62" rx="14" fill="#e8862e"/>` +
    `<rect x="29" y="44" width="42" height="34" rx="5" fill="#fff"/>` +
    `<rect x="46" y="49" width="8" height="24" rx="1.5" fill="#43b04a" stroke="none"/><rect x="38" y="57" width="24" height="8" rx="1.5" fill="#43b04a" stroke="none"/>` +
    `<path d="M29 36V40" stroke="#ffc07a" stroke-width="4"/>`,

  깁스: torso(
    `<path d="M40 40L24 60M60 40L78 60" stroke="#ff9aa8" stroke-width="6"/>` +
      `<path d="M18 58Q48 84 84 60V70Q48 96 18 70Z" fill="#ff9aa8"/>` +
      `<rect x="14" y="50" width="66" height="24" rx="12" fill="#fff"/>` +
      `<path d="M26 52V72M36 52V72M46 52V72M56 52V72M66 52V72" stroke="#c8d2e2" stroke-width="3"/>` +
      `<path d="M78 56Q92 52 92 62T80 70Z" fill="${SKIN}"/><path d="M84 56l6-4M86 60l7-2" stroke-width="3"/>`,
  ),

  안대: face(
    `<path d="M31 53L21 50M49 52Q62 46 78 49" stroke="#8a96b0" stroke-width="2.5"/>` +
      `<ellipse cx="40" cy="55" rx="11" ry="9" fill="#fff"/>` +
      `<ellipse cx="40" cy="55" rx="7" ry="5.5" stroke="#dfe8f5" stroke-width="2.5"/>`,
  ),

  들것:
    person(16, 97, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    person(84, 97, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    tube('M8 80H92', '#8a96b0', 4) +
    `<rect x="26" y="70" width="48" height="10" rx="3" fill="#43b04a"/>` +
    `<ellipse cx="34" cy="68" rx="7" ry="3.5" fill="#fff"/>` +
    `<circle cx="34" cy="60" r="8" fill="${SKIN}"/><path d="M27 57C28 50 39 50 41 56C37 54 31 54 27 57Z" fill="#5a3b24"/>` +
    `<path d="M42 70C42 58 50 56 58 57S72 60 72 70Z" fill="#7ec8f0"/>` +
    `<circle cx="10" cy="80" r="4.5" fill="${SKIN}"/><circle cx="90" cy="80" r="4.5" fill="${SKIN}"/>`,

  소화전:
    `<path d="M10 91H90" stroke-width="4"/>` +
    `<rect x="44" y="7" width="12" height="9" rx="2" fill="#c7402c"/>` +
    `<path d="M32 30Q32 14 50 14T68 30Z" fill="#e8553d"/>` +
    `<rect x="16" y="45" width="18" height="16" rx="3" fill="#c7402c"/><rect x="66" y="45" width="18" height="16" rx="3" fill="#c7402c"/>` +
    `<rect x="31" y="30" width="38" height="54" fill="#e8553d"/>` +
    `<rect x="26" y="26" width="48" height="8" rx="3" fill="#c7402c"/>` +
    `<circle cx="50" cy="56" r="10" fill="#c7402c"/><circle cx="50" cy="56" r="4" fill="#8a2a1c"/>` +
    `<rect x="24" y="80" width="52" height="11" rx="3" fill="#c7402c"/>` +
    `<path d="M37 40V74" stroke="#ff9a8a" stroke-width="4"/>`,

  비상벨:
    waves(20, 80, 52, '#e8553d') +
    `<path d="M36 22Q36 6 50 6T64 22Z" fill="${HL}"/><circle cx="50" cy="6" r="3" fill="${HL}"/>` +
    `<rect x="20" y="22" width="60" height="68" rx="8" fill="#e8553d"/>` +
    `<circle cx="50" cy="52" r="22" fill="#fff"/><circle cx="50" cy="52" r="15" fill="#ff5c70"/>` +
    `<circle cx="50" cy="52" r="8" fill="#e8553d" stroke="none"/>` +
    `<path d="M42 44Q46 40 50 40" stroke="#ffc0c8" stroke-width="3"/>` +
    `<rect x="36" y="80" width="28" height="5" rx="2.5" fill="#fff" stroke="none"/>`,

  화재경보기:
    `<path d="M4 10H96" stroke-width="5"/>` +
    `<path d="M20 12H80V20Q80 34 50 34T20 20Z" fill="#fff"/>` +
    `<path d="M32 22Q50 28 68 22" stroke="#dfe8f5" stroke-width="3"/>` +
    dot(50, 27, 4, '#e8553d') +
    `<path d="M14 26l-8 4M86 26l8 4M16 36l-8 8M84 36l8 8" stroke="#e8553d" stroke-width="4"/>` +
    blob('#b8c1d4', [
      [50, 48, 8],
      [42, 58, 9],
      [56, 64, 10],
      [46, 74, 9],
    ]) +
    `<path d="M36 94H64" stroke="#9a5b2e" stroke-width="6"/>` +
    flame(50, 92, 16),

  사이렌:
    `<path d="M4 20q-4 10 0 20M10 14q-7 16 0 32M96 20q4 10 0 20M90 14q7 16 0 32" stroke="#ff9f1a" stroke-width="4"/>` +
    `<rect x="46" y="40" width="8" height="52" fill="#8a96b0"/><path d="M34 93H66" stroke-width="5"/>` +
    `<path d="M42 24L16 12V48L42 36Z" fill="#dfe8f5"/><path d="M58 24L84 12V48L58 36Z" fill="#dfe8f5"/>` +
    `<ellipse cx="16" cy="30" rx="5" ry="18" fill="#5a6378"/><ellipse cx="84" cy="30" rx="5" ry="18" fill="#5a6378"/>` +
    `<rect x="40" y="20" width="20" height="22" rx="4" fill="#e8553d"/>` +
    `<path d="M40 64l-10 6M60 64l10 6" stroke-width="3"/>`,

  경광등:
    `<path d="M50 4V13M22 14l7 7M78 14l-7 7M8 42H18M82 42H92M14 26l9 5M86 26l-9 5" stroke="${HL}" stroke-width="6"/>` +
    `<path d="M30 70V44Q30 22 50 22T70 44V70Z" fill="#ff5c70"/>` +
    `<ellipse cx="50" cy="52" rx="10" ry="12" fill="${HL}"/>` +
    `<path d="M37 40Q38 32 44 29" stroke="#ffc0c8" stroke-width="4"/>` +
    `<rect x="20" y="68" width="60" height="18" rx="5" fill="#5a6378"/>` +
    `<path d="M30 77H70" stroke="#8a96b0" stroke-width="3"/>`,

  비커:
    `<path d="M28 20V80Q28 88 36 88H64Q72 88 72 80V20Z" fill="${GLASS}"/>` +
    `<path d="M30 52H70V80Q70 86 64 86H36Q30 86 30 80Z" fill="#4aa8f0" stroke="none"/>` +
    `<path d="M30 52H70" stroke="#2f7fcc" stroke-width="3"/>` +
    `<path d="M28 20V80Q28 88 36 88H64Q72 88 72 80V20" />` +
    `<path d="M20 14L28 20H74" stroke-width="4.5"/>` +
    `<path d="M58 30H70M62 40H70M58 50H70M62 62H70M58 72H70" stroke="#5a6378" stroke-width="2.5"/>` +
    `<circle cx="40" cy="70" r="3" fill="#fff" stroke="none"/><circle cx="48" cy="62" r="2.5" fill="#fff" stroke="none"/><circle cx="42" cy="44" r="2.5" stroke="#4aa8f0" stroke-width="2"/>` +
    `<path d="M34 28V44" stroke="#fff" stroke-width="4"/>`,

  플라스크:
    `<path d="M42 14V38L18 80Q14 88 24 88H76Q86 88 82 80L58 38V14Z" fill="${GLASS}"/>` +
    `<path d="M30 60H70L80 80Q83 86 76 86H24Q17 86 20 80Z" fill="#5fc24a" stroke="none"/>` +
    `<path d="M30 60H70" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M42 14V38L18 80Q14 88 24 88H76Q86 88 82 80L58 38V14"/>` +
    `<rect x="38" y="8" width="24" height="7" rx="3" fill="${GLASS}"/>` +
    `<circle cx="44" cy="74" r="3" fill="#fff" stroke="none"/><circle cx="58" cy="70" r="2.5" fill="#fff" stroke="none"/>` +
    `<circle cx="50" cy="50" r="3" stroke="#5fc24a" stroke-width="2.5"/><circle cx="54" cy="40" r="2.5" stroke="#5fc24a" stroke-width="2.5"/><circle cx="48" cy="30" r="2" stroke="#5fc24a" stroke-width="2.5"/>`,

  시험관:
    `<rect x="16" y="64" width="6" height="26" fill="#9a5b2e"/><rect x="78" y="64" width="6" height="26" fill="#9a5b2e"/>` +
    [
      [28, '#ff5c70'],
      [50, '#43b04a'],
      [72, '#3b8fe0'],
    ]
      .map(
        ([x, c]) =>
          `<path d="M${Number(x) - 7} 12V78a7 7 0 0 0 14 0V12Z" fill="${GLASS}"/>` +
          `<path d="M${Number(x) - 5} 46V78a5 5 0 0 0 10 0V46Z" fill="${c}" stroke="none"/>` +
          `<path d="M${Number(x) - 7} 12V78a7 7 0 0 0 14 0V12"/><path d="M${Number(x) - 10} 12H${Number(x) + 10}" stroke-width="4.5"/>`,
      )
      .join('') +
    `<rect x="10" y="56" width="80" height="11" rx="3" fill="#c98b4f"/>`,

  스포이트:
    `<ellipse cx="50" cy="22" rx="14" ry="16" fill="#e8553d"/><path d="M42 16Q44 11 48 10" stroke="#ff9a8a" stroke-width="3.5"/>` +
    `<rect x="40" y="36" width="20" height="7" rx="2" fill="#c7402c"/>` +
    `<path d="M44 43V70L50 80L56 70V43Z" fill="${GLASS}"/>` +
    `<path d="M46 58V70L50 77L54 70V58Z" fill="#8e4fc9" stroke="none"/>` +
    `<path d="M44 43V70L50 80L56 70V43"/>` +
    drop(50, 82, 0.9) +
    `<path d="M32 96H68" stroke="#9aa6c4" stroke-width="3"/>`,

  핀셋:
    `<g transform="rotate(38 50 50)">` +
    tube('M48 8L37 52L47 84', '#dfe8f5', 6) +
    tube('M52 8L63 52L53 84', '#dfe8f5', 6) +
    `<path d="M44 8H56" stroke="#dfe8f5" stroke-width="6"/>` +
    `<path d="M39 34l4 1M38 40l4 1M61 34l-4 1M62 40l-4 1" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="90" r="6" fill="#e8553d"/>` +
    `</g>`,

  습도계:
    `<circle cx="50" cy="50" r="40" fill="#3b8fe0"/><circle cx="50" cy="50" r="32" fill="#fff"/>` +
    `<path d="M28 56A23 23 0 0 1 50 33" stroke="#ff9f1a" stroke-width="6"/><path d="M50 33A23 23 0 0 1 72 56" stroke="#3b8fe0" stroke-width="6"/>` +
    `<path d="M50 56L64 40" stroke="#e8553d" stroke-width="4"/>` +
    dot(50, 56, 4.5) +
    drop(50, 63, 1.2),

  풍향계:
    `<path d="M4 72h14M2 82h10M6 62h8" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="47" y="40" width="6" height="52" fill="#5a6378"/>` +
    `<path d="M26 64H74M40 70L60 58" stroke="#5a6378" stroke-width="4"/>` +
    `<circle cx="26" cy="64" r="4" fill="${HL}"/><circle cx="74" cy="64" r="4" fill="${HL}"/><circle cx="40" cy="70" r="3.5" fill="${HL}"/><circle cx="60" cy="58" r="3.5" fill="${HL}"/>` +
    `<path d="M16 40H80" stroke-width="5"/>` +
    `<path d="M8 40L22 30V50Z" fill="#e8553d"/>` +
    `<path d="M76 40L92 28V52Z" fill="#ffd23f"/>` +
    `<path d="M36 34Q34 20 46 18L50 14Q54 10 58 14Q62 18 58 22L60 30Q58 36 50 36H40Z" fill="#fff"/>` +
    `<path d="M54 12Q54 6 58 8Q60 4 62 9" fill="#e8553d" stroke-width="2.5"/><path d="M60 18L65 20L60 22" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M36 34Q26 30 30 20Q34 26 38 26" fill="#43b04a" stroke-width="2.5"/>` +
    dot(56, 16, 1.8),

  해시계:
    `<path d="M84 4V9M84 23V28M72 16H77M91 16H96M76 8l3 3M92 8l-3 3M76 24l3-3M92 24l-3-3" stroke="#ff9f1a" stroke-width="3"/>` +
    `<circle cx="84" cy="16" r="6" fill="#ffd23f"/>` +
    `<path d="M10 64V74Q10 92 50 92T90 74V64Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="64" rx="40" ry="18" fill="#dfe8f5"/>` +
    `<path d="M50 50V54M22 58l3 1.5M78 58l-3 1.5M16 66H20M84 66H80M24 74l3-1.5M76 74l-3-1.5M50 80V76" stroke="#5a6378" stroke-width="3"/>` +
    `<path d="M50 66L20 72L22 69Z" fill="#5a6378" stroke="#5a6378" stroke-width="3"/>` +
    `<path d="M48 66V32L72 66Z" fill="#e8862e"/>`,

  프리즘:
    `<path d="M50 16L84 76H16Z" fill="${GLASS}"/>` +
    tube('M4 60L32 48', '#fff', 5) +
    `<path d="M32 48L72 56" stroke="#fff" stroke-width="4"/>` +
    [
      ['#e8553d', 36],
      ['#ff9f1a', 46],
      ['#ffd23f', 56],
      ['#43b04a', 66],
      ['#3b8fe0', 76],
      ['#8e4fc9', 86],
    ]
      .map(([c, y]) => `<path d="M72 56L96 ${y}" stroke="${c}" stroke-width="4.5"/>`)
      .join('') +
    `<path d="M50 16L84 76H16Z"/><path d="M48 26L32 54" stroke="#fff" stroke-width="3.5"/>`,

  볼록렌즈:
    `<path d="M4 28H44M4 50H44M4 72H44" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M50 10Q72 50 50 90Q28 50 50 10Z" fill="#bfe6ff"/>` +
    `<path d="M44 28L56 28L86 50M44 50H86M44 72L56 72L86 50" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M50 10Q72 50 50 90Q28 50 50 10Z"/>` +
    `<path d="M44 26Q42 36 42 46" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(88, 50, 10, '#ff9f1a'),

  오목거울:
    `<path d="M4 26H64M4 50H60M4 74H64" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M64 26L34 50L64 74M60 50H34" stroke="#ff9f1a" stroke-width="4" stroke-dasharray="6 5"/>` +
    `<path d="M66 8Q52 50 66 92H82Q70 50 82 8Z" fill="#8a96b0"/>` +
    `<path d="M66 8Q52 50 66 92" stroke="#dfe8f5" stroke-width="5"/>` +
    `<path d="M66 8Q52 50 66 92H82Q70 50 82 8Z"/>` +
    sparkle(32, 50, 10, '#ff9f1a'),

  발전기:
    `<path d="M54 74Q72 84 76 60" stroke-width="3"/>` +
    `<path d="M80 6V12M62 14l4 4M94 14l-4 4" stroke="#ff9f1a" stroke-width="3.5"/>` +
    `<circle cx="78" cy="32" r="14" fill="#ffd23f"/><path d="M73 36l3-6l4 6l3-6" stroke="#e8862e" stroke-width="2.5"/>` +
    `<rect x="71" y="45" width="14" height="10" rx="2" fill="#8a96b0"/>` +
    `<rect x="8" y="44" width="48" height="42" rx="7" fill="#3b8fe0"/>` +
    `<path d="M36 50L26 66H34L28 80L42 60H34L38 50Z" fill="${HL}" stroke-width="2.5"/>` +
    tube('M14 56L22 30', '#8a96b0', 5) +
    `<circle cx="14" cy="56" r="5" fill="#5a6378"/><rect x="16" y="18" width="12" height="14" rx="5" fill="#e8553d"/>` +
    `<path d="M4 38q2-10 10-14" stroke="#9aa6c4" stroke-width="3"/>`,

  로봇팔:
    `<rect x="10" y="84" width="44" height="10" rx="3" fill="#5a6378"/>` +
    `<rect x="22" y="70" width="20" height="16" rx="3" fill="#ff9f1a"/>` +
    tube('M32 72L38 36', '#ff9f1a', 12) +
    tube('M38 36L72 26', '#ff9f1a', 10) +
    tube('M72 26L78 46', '#ff9f1a', 7) +
    `<circle cx="32" cy="72" r="8" fill="#8a96b0"/><circle cx="38" cy="36" r="8" fill="#8a96b0"/><circle cx="72" cy="26" r="6" fill="#8a96b0"/>` +
    dot(32, 72, 2.5) +
    dot(38, 36, 2.5) +
    `<rect x="70" y="44" width="16" height="7" rx="2" fill="#5a6378"/>` +
    `<path d="M71 51V64M85 51V64" stroke-width="5"/>` +
    `<rect x="70" y="58" width="16" height="16" rx="2" fill="#3b8fe0"/>`,

  도르래:
    `<rect x="18" y="4" width="64" height="7" rx="2" fill="#9a5b2e"/>` +
    `<path d="M50 11V26" stroke-width="5"/>` +
    `<path d="M35 26V70M65 26V72" stroke="#c98b4f" stroke-width="3.5"/>` +
    `<circle cx="50" cy="26" r="15" fill="#dfe8f5"/><circle cx="50" cy="26" r="5" fill="#8a96b0"/>` +
    `<path d="M35 26A15 15 0 0 1 65 26" stroke="#c98b4f" stroke-width="3.5"/>` +
    `<path d="M24 70Q35 58 46 70" stroke-width="3"/>` +
    `<path d="M22 70H48L44 92H26Z" fill="#3b8fe0"/>` +
    `<circle cx="65" cy="76" r="7" fill="${SKIN}"/>` +
    `<path d="M84 52V80M78 74L84 82L90 74" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M12 84V56M6 62L12 54L18 62" stroke="#3b78e6" stroke-width="4"/>`,

  지렛대:
    `<path d="M4 90H96" stroke-width="4"/>` +
    `<path d="M40 90L50 70L60 90Z" fill="#8a96b0"/>` +
    tube('M8 55L92 84', '#c98b4f', 5) +
    blob('#9aa6c4', [
      [20, 42, 11],
      [30, 46, 8],
    ]) +
    `<path d="M20 20V30M14 26L20 20L26 26" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M84 50V72M78 66L84 74L90 66" stroke="#3b78e6" stroke-width="4"/>`,

  용수철:
    `<path d="M50 6V14M50 86V94" stroke-width="5"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7, 8]
      .map(
        (i) =>
          `<ellipse cx="50" cy="${16 + i * 8.5}" rx="24" ry="7" stroke-width="9"/><ellipse cx="50" cy="${16 + i * 8.5}" rx="24" ry="7" stroke="#aab4c8" stroke-width="3.5"/>`,
      )
      .join('') +
    `<path d="M14 36V64M86 36V64" stroke="#9aa6c4" stroke-width="3"/>`,

  배터리:
    `<rect x="42" y="10" width="16" height="12" rx="3" fill="#dfe8f5"/>` +
    `<rect x="28" y="20" width="44" height="72" rx="8" fill="#2e3450"/>` +
    `<path d="M28 42V28Q28 20 36 20H64Q72 20 72 28V42Z" fill="#ff9f1a"/>` +
    `<path d="M54 48L40 68H50L44 84L62 60H52L58 48Z" fill="${HL}" stroke-width="2.5"/>` +
    `<path d="M34 50V80" stroke="#5a6378" stroke-width="4"/>`,

  형광등:
    `<path d="M4 6H96" stroke-width="5"/><path d="M22 8V28M78 8V28" stroke-width="3"/>` +
    `<ellipse cx="50" cy="50" rx="46" ry="16" fill="#fff1b8" stroke="none"/>` +
    `<rect x="8" y="26" width="84" height="12" rx="3" fill="#dfe8f5"/>` +
    `<rect x="12" y="40" width="76" height="13" rx="6.5" fill="#fff"/>` +
    `<rect x="6" y="40" width="9" height="13" rx="2" fill="#8a96b0"/><rect x="85" y="40" width="9" height="13" rx="2" fill="#8a96b0"/>` +
    `<path d="M22 64L16 78M36 64L33 80M50 64V82M64 64L67 80M78 64L84 78" stroke="${HL}" stroke-width="5"/>`,

  촛불:
    `<circle cx="50" cy="30" r="22" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    `<ellipse cx="50" cy="88" rx="30" ry="7" fill="#ff9f1a"/>` +
    `<rect x="36" y="46" width="28" height="42" rx="4" fill="#e8553d"/>` +
    `<path d="M36 52Q36 60 40 60T44 52" fill="#e8553d"/><path d="M42 52V80" stroke="#ff9a8a" stroke-width="4"/>` +
    `<path d="M50 46V38" stroke-width="3"/>` +
    flame(50, 40, 28),

  부싯돌:
    `<path d="M8 72L18 50L38 44L46 58L40 76L20 80Z" fill="#5a6378"/><path d="M18 58L32 54" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M92 72L82 50L62 44L54 58L60 76L80 80Z" fill="#9aa6c4"/><path d="M82 58L68 54" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M50 40L50 30M42 42L34 30M58 42L66 30M40 50L28 44M60 50L72 44" stroke="#ff9f1a" stroke-width="3.5"/>` +
    sparkle(50, 20, 8, '#ff9f1a') +
    sparkle(30, 22, 6) +
    sparkle(70, 22, 6) +
    sparkle(50, 50, 5) +
    `<path d="M24 92Q34 84 50 88T76 92" fill="#f2c14e"/><path d="M34 88l-4-6M50 87v-6M66 88l4-6" stroke="#c98b4f" stroke-width="2.5"/>`,

  난로:
    `<rect x="60" y="4" width="11" height="34" fill="#8a96b0"/>` +
    `<path d="M30 80V92M70 80V92" stroke-width="6"/>` +
    `<rect x="22" y="38" width="56" height="44" rx="6" fill="#5a6378"/>` +
    `<rect x="18" y="34" width="64" height="8" rx="3" fill="#3d4459"/>` +
    `<rect x="32" y="50" width="36" height="24" rx="4" fill="#2e3450"/>` +
    flame(44, 72, 18) +
    flame(56, 72, 14) +
    `<path d="M26 20Q26 14 38 14T50 20V34H26Z" fill="#3b8fe0"/><path d="M26 22L18 16" stroke-width="4"/><path d="M32 14Q38 6 44 14" stroke-width="3"/>` +
    steam(28, 8, 8).replace(/stroke-width="3"/, 'stroke-width="2.5"'),

  벽난로:
    `<rect x="12" y="22" width="76" height="70" fill="#c7402c"/>` +
    `<path d="M12 36H26M74 36H88M12 50H24M76 50H88M12 64H26M74 64H88M12 78H24M76 78H88M20 22V36M80 22V36M18 50V64M82 50V64M40 22V34M60 22V34" stroke="#8a2a1c" stroke-width="2.5"/>` +
    `<rect x="6" y="14" width="88" height="10" rx="2" fill="#9a5b2e"/>` +
    `<path d="M26 92V56Q26 36 50 36T74 56V92Z" fill="#2e3450"/>` +
    flame(42, 84, 30) +
    flame(58, 84, 24) +
    `<path d="M30 86L70 90M30 90L70 86" stroke="#9a5b2e" stroke-width="7"/>` +
    `<path d="M4 94H96" stroke-width="4"/>`,

  보일러:
    `<path d="M4 96H96" stroke="#9aa6c4" stroke-width="3"/>` +
    tube('M34 64V94', '#e8553d', 5) +
    tube('M44 64V94', '#e8553d', 5) +
    tube('M56 64V94', '#3b8fe0', 5) +
    tube('M66 64V94', '#3b8fe0', 5) +
    `<rect x="24" y="6" width="52" height="62" rx="6" fill="#fff"/>` +
    `<rect x="30" y="12" width="40" height="12" rx="3" fill="#7ec8f0"/>` +
    `<rect x="30" y="28" width="10" height="5" rx="2" fill="#dfe8f5" stroke-width="2"/><rect x="45" y="28" width="10" height="5" rx="2" fill="#dfe8f5" stroke-width="2"/><rect x="60" y="28" width="10" height="5" rx="2" fill="#dfe8f5" stroke-width="2"/>` +
    `<rect x="38" y="42" width="24" height="18" rx="3" fill="#2e3450"/>` +
    flame(50, 57, 12) +
    heat(88, 58, 7),

  에어컨:
    `<path d="M4 12H96" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="6" y="16" width="88" height="34" rx="10" fill="#fff"/>` +
    `<path d="M14 40H86" stroke="#8a96b0" stroke-width="3"/><path d="M18 46H82" stroke-width="3"/>` +
    dot(82, 26, 3, '#43b04a') +
    `<path d="M24 56q-6 8 0 16t0 16M40 56q-6 8 0 16t0 16M60 56q6 8 0 16t0 16M76 56q6 8 0 16t0 16" stroke="#7ec8f0" stroke-width="4"/>` +
    flake(50, 74, 12),

  온풍기:
    `<path d="M4 44q8-6 16 0t16 0M2 58q8-6 16 0t16 0M4 72q8-6 16 0t16 0" stroke="#ff9f1a" stroke-width="4.5"/>` +
    `<path d="M4 44q8-6 16 0t16 0" stroke="#e8553d" stroke-width="2" opacity=".5"/>` +
    `<rect x="40" y="20" width="52" height="66" rx="10" fill="#fff"/>` +
    `<circle cx="66" cy="50" r="20" fill="#ff9f1a"/>` +
    `<circle cx="66" cy="50" r="12" stroke="#e8553d" stroke-width="3"/><circle cx="66" cy="50" r="4" fill="#e8553d"/>` +
    `<path d="M46 50H86M66 30V70" stroke="#e8553d" stroke-width="2.5"/>` +
    `<rect x="52" y="76" width="28" height="5" rx="2" fill="#dfe8f5"/>` +
    `<path d="M46 86V92M86 86V92" stroke-width="5"/>`,

  전기장판:
    heat(52, 40, 16) +
    `<path d="M8 70L28 46H92L74 70Z" fill="#ff9aa8"/>` +
    `<path d="M8 70V76H74L92 52V46L74 70Z" fill="#e85d9a"/>` +
    `<path d="M22 62L38 52H84M34 66L50 52M54 66L66 52" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M40 74Q40 88 60 88H70" stroke-width="3"/>` +
    `<rect x="68" y="80" width="24" height="14" rx="4" fill="#fff"/><circle cx="76" cy="87" r="3" fill="#e8553d"/><path d="M82 87H88" stroke="#8a96b0" stroke-width="3"/>`,

  핫팩:
    `<g transform="rotate(-10 50 56)">` +
    `<rect x="26" y="28" width="48" height="60" rx="8" fill="#fff"/>` +
    `<rect x="31" y="33" width="38" height="50" rx="5" stroke="#8a96b0" stroke-width="2" stroke-dasharray="4 3"/>` +
    `<circle cx="50" cy="58" r="12" fill="#ff9f1a"/>` +
    `<path d="M50 38V42M50 74V78M30 58H34M66 58H70M36 44l3 3M64 44l-3 3M36 72l3-3M64 72l-3-3" stroke="#ff9f1a" stroke-width="3.5"/>` +
    `</g>` +
    heat(50, 22, 14, '#e8553d') +
    flake(14, 80, 8, '#7ec8f0', 3) +
    flake(88, 84, 6, '#7ec8f0', 3),

  텀블러:
    steam(52, 12, 8) +
    `<path d="M30 28L35 86Q35 92 42 92H58Q65 92 65 86L70 28Z" fill="#3b8fe0"/>` +
    `<path d="M32 56H68" stroke="#7ec8f0" stroke-width="7"/>` +
    `<path d="M38 36L41 80" stroke="#8fd3ff" stroke-width="4"/>` +
    `<rect x="26" y="16" width="48" height="14" rx="5" fill="#5a6378"/>` +
    `<rect x="44" y="18" width="16" height="5" rx="2" fill="#2e3450" stroke="none"/>`,

  아이스박스:
    tube('M28 34V22H72V34', '#8a96b0', 4) +
    `<rect x="10" y="44" width="80" height="46" rx="6" fill="#3b8fe0"/>` +
    `<rect x="6" y="32" width="88" height="15" rx="5" fill="#fff"/>` +
    `<rect x="44" y="44" width="12" height="10" rx="2" fill="#dfe8f5"/>` +
    flake(50, 72, 12, '#fff', 4) +
    `<rect x="4" y="68" width="10" height="10" rx="2" fill="#dff3ff" transform="rotate(12 9 73)"/>` +
    `<rect x="84" y="76" width="12" height="12" rx="2" fill="#dff3ff" transform="rotate(-10 90 82)"/>`,

  얼음틀:
    `<path d="M8 50L18 36H92L82 50Z" fill="#7ec8f0"/>` +
    `<rect x="8" y="50" width="74" height="30" rx="4" fill="#4a90e2"/>` +
    `<path d="M82 50L92 36V64L82 80Z" fill="#3b78e6"/>` +
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<rect x="${13 + i * 17}" y="54" width="14" height="10" rx="2" fill="#dff3ff" stroke-width="2.5"/><rect x="${13 + i * 17}" y="66" width="14" height="10" rx="2" fill="#dff3ff" stroke-width="2.5"/>`,
      )
      .join('') +
    `<rect x="30" y="14" width="16" height="16" rx="3" fill="#dff3ff" transform="rotate(-12 38 22)"/>` +
    `<rect x="58" y="8" width="14" height="14" rx="3" fill="#dff3ff" transform="rotate(14 65 15)"/>` +
    sparkle(86, 20, 6, '#fff') +
    sparkle(20, 24, 5, '#7ec8f0') +
    `<path d="M20 90H74" stroke="#9aa6c4" stroke-width="3"/>`,

  빙수기:
    tube('M50 16V8H76', '#8a96b0', 4) +
    `<circle cx="78" cy="8" r="5" fill="#e8553d"/>` +
    `<rect x="14" y="88" width="72" height="8" rx="3" fill="#4a90e2"/>` +
    `<rect x="18" y="16" width="10" height="74" fill="#4a90e2"/><rect x="72" y="16" width="10" height="74" fill="#4a90e2"/>` +
    `<rect x="16" y="14" width="68" height="10" rx="3" fill="#3b78e6"/>` +
    `<rect x="36" y="26" width="28" height="18" rx="3" fill="#dff3ff"/>` +
    `<rect x="30" y="44" width="40" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M42 54l-1 4M50 54v5M58 54l1 4" stroke="#7ec8f0" stroke-width="3"/>` +
    blob('#fff', [
      [50, 70, 11],
      [42, 74, 8],
      [58, 74, 8],
    ]) +
    `<path d="M44 66Q50 62 56 68" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M32 76H68L64 88H36Z" fill="#ffd23f"/>`,

  솜사탕기계:
    tube('M52 46L80 6', '#e0b070', 3) +
    `<ellipse cx="50" cy="52" rx="42" ry="10" fill="#8a96b0"/>` +
    blob('#ff9aa8', [
      [50, 34, 16],
      [36, 42, 12],
      [64, 42, 12],
      [44, 26, 10],
      [58, 26, 10],
    ]) +
    `<path d="M38 34q6-6 12 0t12 0M40 44q6-6 12 0t12 0" stroke="#e85d9a" stroke-width="2.5"/>` +
    `<path d="M8 52Q10 76 50 78T92 52Q92 60 50 62T8 52Z" fill="#dfe8f5"/>` +
    `<rect x="36" y="76" width="28" height="12" rx="3" fill="#e85d9a"/>` +
    `<rect x="26" y="86" width="48" height="8" rx="3" fill="#8e4fc9"/>`,

  팝콘기계:
    `<rect x="16" y="6" width="68" height="14" rx="5" fill="#e8553d"/>` +
    `<rect x="20" y="20" width="60" height="50" fill="${GLASS}"/>` +
    blob('#fff6d6', [
      [28, 62, 7],
      [40, 60, 8],
      [52, 62, 7],
      [64, 60, 8],
      [74, 62, 6],
      [34, 52, 6],
      [48, 52, 7],
      [62, 52, 6],
    ]) +
    `<path d="M40 22V28M60 22V28" stroke-width="2.5"/><path d="M38 28H62L60 38H40Z" fill="#8a96b0"/>` +
    `<circle cx="32" cy="36" r="4" fill="#fff6d6" stroke-width="2.5"/><circle cx="68" cy="34" r="4" fill="#fff6d6" stroke-width="2.5"/><circle cx="50" cy="44" r="3.5" fill="#fff6d6" stroke-width="2.5"/>` +
    `<rect x="20" y="20" width="60" height="50"/><path d="M50 20V38" stroke-width="2"/>` +
    `<rect x="18" y="68" width="64" height="20" rx="3" fill="#e8553d"/><path d="M26 74H74" stroke="#fff" stroke-width="3" stroke-dasharray="6 5"/>` +
    `<circle cx="28" cy="91" r="5" fill="#5a6378"/><circle cx="72" cy="91" r="5" fill="#5a6378"/>`,

  와플기계:
    `<path d="M88 76Q96 88 84 94" stroke-width="3"/>` +
    `<rect x="18" y="8" width="64" height="44" rx="12" fill="#5a6378"/>` +
    `<rect x="24" y="14" width="52" height="32" rx="8" fill="#3d4459"/>` +
    grid(24, 14, 52, 32, 4, '#5a6378') +
    `<rect x="10" y="52" width="80" height="34" rx="12" fill="#5a6378"/>` +
    `<rect x="18" y="56" width="64" height="22" rx="6" fill="#f2c14e"/>` +
    grid(18, 56, 64, 22, 4, '#d9a030') +
    dot(50, 82, 2.5, '#e8553d'),

  전골냄비:
    steam(50, 24, 16) +
    `<rect x="18" y="80" width="64" height="12" rx="4" fill="#5a6378"/>` +
    `<path d="M4 50H14M86 50H96" stroke-width="7"/>` +
    `<path d="M10 48V62Q10 82 50 82T90 62V48Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="48" rx="40" ry="13" fill="#e0703a"/>` +
    `<path d="M28 44Q24 36 32 36T36 44Z" fill="#fff"/><path d="M62 42Q58 34 66 34T70 42Z" fill="#fff"/>` +
    `<ellipse cx="46" cy="52" rx="8" ry="4" fill="#43b04a"/><ellipse cx="72" cy="52" rx="7" ry="4" fill="#43b04a"/>` +
    `<rect x="42" y="38" width="12" height="8" rx="2" fill="#fffdf2"/>` +
    `<ellipse cx="26" cy="52" rx="7" ry="4" fill="#9a5b2e"/>` +
    `<path d="M20 64Q50 74 80 64" stroke="#b8c1d4" stroke-width="3"/>`,

  찜기:
    steam(46, 28, 14) +
    `<path d="M62 30L92 20L94 30L66 40Z" fill="#e0b070"/>` +
    `<path d="M14 48V84Q14 92 50 92T86 84V48Z" fill="#e0b070"/>` +
    `<path d="M14 66Q50 76 86 66" stroke="#b8864a" stroke-width="3"/><path d="M26 58V88M40 60V90M60 60V90M74 58V88" stroke="#b8864a" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="48" rx="36" ry="11" fill="#c98b4f"/>` +
    `<path d="M24 50Q26 38 36 38T48 50Z" fill="#fff"/><path d="M52 50Q54 38 64 38T76 50Z" fill="#fff"/>` +
    `<path d="M32 42l2 4M36 40v5M40 42l-2 4M60 42l2 4M64 40v5M68 42l-2 4" stroke="#dfe8f5" stroke-width="2"/>`,

  뒤집개:
    `<path d="M26 28Q20 16 30 8M54 30Q62 18 54 8" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g transform="rotate(-20 42 20)">` +
    blob('#fff', [
      [36, 20, 11],
      [48, 20, 10],
      [42, 14, 8],
    ]) +
    `<circle cx="42" cy="20" r="7" fill="#ffc933"/>` +
    `</g>` +
    tube('M60 60L88 92', '#9a5b2e', 7) +
    `<g transform="rotate(-40 44 46)">` +
    `<rect x="26" y="36" width="36" height="24" rx="4" fill="#8a96b0"/>` +
    `<path d="M34 42V54M44 42V54M54 42V54" stroke="#3d4459" stroke-width="3"/>` +
    `</g>` +
    `<path d="M56 62L64 58" stroke-width="5"/>`,
};

