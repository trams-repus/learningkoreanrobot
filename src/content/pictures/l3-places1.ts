// 장소 그림 묶음 (3단계: 시설·전통 집·시장·가게·운동장). 그림 규칙은 docs/picture-style.md.
// 가게는 간판 글자 대신 파는 물건을 크게 앞에 두고 차양 색을 가게마다 다르게 했다.
// 비슷한 말끼리(한옥·초가집·기와집 / 수목원·식물원 / 전통시장·야시장·벼룩시장·꽃시장 / 제과점·케이크가게 / 뷔페·푸드코트 / 활주로·관제탑)는 주인공 소품을 다르게 했다.
import { INK, SKIN, HL, dot, blob, sparkle, tube, person } from '../pictureKit.ts';

/** 줄무늬 차양 (가게 앞): 위 y, 폭 w, 아래 물결 끝은 y+20 */
const awning = (x: number, y: number, w: number, c1: string, c2: string, n = 6) => {
  const sw = w / n;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="12" fill="${c1}"/>`;
  for (let i = 1; i < n; i += 2) s += `<rect x="${x + i * sw}" y="${y}" width="${sw}" height="12" fill="${c2}"/>`;
  let scal = '';
  for (let i = 0; i < n; i++) scal += `q${sw / 2} 8 ${sw} 0`;
  return s + `<path d="M${x} ${y + 12}${scal}Z" fill="${c1}"/><rect x="${x}" y="${y}" width="${w}" height="12"/>`;
};

/** 가게: 흰 벽 + 줄무늬 차양 + 파는 물건(크게) + 바닥선 */
const shop = (c1: string, c2: string, goods: string) =>
  `<rect x="10" y="18" width="80" height="74" fill="#fff"/>` + awning(6, 8, 88, c1, c2) + goods + `<path d="M4 92H96"/>`;

/** 둥근 나무 (줄기 밑 x,y, 크기 s) */
const tree = (x: number, y: number, s: number, c = '#43b04a') =>
  `<path d="M${x} ${y}V${y - 20 * s}" stroke="#6b3e26" stroke-width="${(6 * s).toFixed(1)}"/>` +
  blob(c, [
    [x, y - 32 * s, 13 * s],
    [x - 10 * s, y - 24 * s, 9 * s],
    [x + 10 * s, y - 24 * s, 9 * s],
  ]);


/** 물고기 옆모습 (머리가 오른쪽) */
const fish = (x: number, y: number, s: number, c: string, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-14 0L-24 -9V9Z" fill="${c}"/>` +
  `<path d="M-16 0C-8 -12 10 -12 18 0C10 12 -8 12 -16 0Z" fill="${c}"/>` +
  `<circle cx="10" cy="-2" r="2.4" fill="${INK}" stroke="none"/>` +
  `</g>`;

/** 꽃 한 송이 (가운데 x,y) */
const flower = (x: number, y: number, r: number, c: string) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const t = (a * Math.PI) / 180;
      return `<circle cx="${(x + Math.sin(t) * r).toFixed(1)}" cy="${(y - Math.cos(t) * r).toFixed(1)}" r="${r}" fill="${c}" stroke-width="2.5"/>`;
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.8).toFixed(1)}" fill="${HL}" stroke-width="2.5"/>`;

/** 비행기 옆모습 (코가 오른쪽) */
const plane = (x: number, y: number, s: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-30 -4L-36 -18H-28L-18 -6Z" fill="#3b78e6"/>` +
  `<path d="M-32 -6H22C30 -6 34 -2 34 0S30 6 22 6H-28C-32 6 -34 2 -32 -6Z" fill="#fff"/>` +
  `<path d="M-6 2L-18 18H-10L8 2Z" fill="#3b78e6"/>` +
  `<path d="M22 -5C26 -5 30 -3 31 -1H22Z" fill="#8fd3ff" stroke-width="${(2 / s).toFixed(2)}"/>` +
  [-20, -12, -4, 4, 12].map((dx) => `<circle cx="${dx}" cy="-1" r="1.8" fill="#8fd3ff" stroke="none"/>`).join('') +
  `</g>`;

/** 전통 기와지붕 (처마 끝이 올라감): 가운데 x, 처마 y, 반폭 w */
const tileRoof = (x: number, y: number, w: number, c: string) =>
  `<path d="M${x - w} ${y - 8}Q${x - w + 8} ${y} ${x - w + 18} ${y}H${x + w - 18}Q${x + w - 8} ${y} ${x + w} ${y - 8}L${x + w - 22} ${y - 24}H${x - w + 22}Z" fill="${c}"/>` +
  `<path d="M${x - w + 16} ${y - 25}H${x + w - 16}" stroke-width="5"/>`;

/** 가로등 전구 줄 */
const bulbs = (xs: number[], y: number) =>
  `<path d="M4 ${y - 4}Q50 ${y + 6} 96 ${y - 4}" stroke-width="2.5"/>` +
  xs.map((x) => `<circle cx="${x}" cy="${y + 3 - Math.abs(x - 50) / 10}" r="4" fill="${HL}" stroke-width="2"/>`).join('');

/** 시계 얼굴 (숫자 없이 눈금 점) */
const clock = (x: number, y: number, r: number, c: string, h = -60, m = 90) => {
  const hand = (a: number, l: number, w: number) => {
    const t = (a * Math.PI) / 180;
    return `<path d="M${x} ${y}L${(x + Math.cos(t) * l).toFixed(1)} ${(y + Math.sin(t) * l).toFixed(1)}" stroke-width="${w}"/>`;
  };
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${(r * 0.72).toFixed(1)}" fill="#fff" stroke-width="2"/>` +
    hand(h, r * 0.4, 3) +
    hand(m, r * 0.6, 2.5) +
    dot(x, y, 1.8)
  );
};

export const PICS: Record<string, string> = {
  // ── 시설 ──
  방앗간:
    `<path d="M4 30L50 6L96 30Z" fill="#9a5b2e"/><rect x="8" y="30" width="84" height="62" fill="#f2d7a6"/>` +
    `<path d="M24 36H50L44 50H30Z" fill="#8a96b0"/><path d="M28 36C30 32 44 32 46 36Z" fill="#fffaf0"/>` +
    `<rect x="18" y="50" width="38" height="32" rx="3" fill="#e8553d"/><circle cx="30" cy="66" r="6" fill="#fff" stroke-width="2.5"/><path d="M30 62V66H33" stroke-width="2"/>` +
    `<path d="M18 82V90M56 82V90" stroke-width="4"/>` +
    `<rect x="56" y="58" width="10" height="12" fill="#8a96b0"/>` +
    `<rect x="66" y="59" width="26" height="5" rx="2.5" fill="#fff" stroke-width="2.5"/><rect x="66" y="65" width="24" height="5" rx="2.5" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M60 90V80H94V90Z" fill="#7ec8f0"/>` +
    `<path d="M70 56c-3-4 3-6 0-10M80 56c-3-4 3-6 0-10" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,
  댐:
    `<path d="M4 10H96V60H4Z" fill="#8fd3ff" stroke="none"/>` +
    `<path d="M4 34L20 14L34 26L42 18L42 60H4Z" fill="#43b04a"/><path d="M96 30L80 12L66 28L60 20V60H96Z" fill="#43b04a"/>` +
    `<path d="M20 44H80" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M16 38Q50 30 84 38L80 82Q50 76 20 82Z" fill="#dfe8f5"/>` +
    `<path d="M16 38Q50 30 84 38" stroke-width="5"/>` +
    [30, 44, 58, 72].map((x) => `<rect x="${x - 4}" y="52" width="9" height="12" rx="2" fill="#8a96b0" stroke-width="2.5"/>`).join('') +
    `<path d="M22 80Q50 74 78 80L96 96H4Z" fill="#4a90e2"/>` +
    [30, 44, 58, 72].map((x) => `<path d="M${x} 64Q${x + 1} 74 ${x} 82" stroke="#fff" stroke-width="5"/>`).join('') +
    `<path d="M20 90q6-4 12 0t12 0M56 90q6-4 12 0t12 0" stroke="#fff" stroke-width="3"/>`,
  발전소:
    `<path d="M16 92C22 72 22 52 14 30H42C34 52 34 72 40 92Z" fill="#dfe8f5"/>` +
    `<path d="M20 50H36" stroke="#e8553d" stroke-width="4"/>` +
    blob('#fff', [
      [26, 20, 9],
      [36, 14, 8],
      [18, 12, 6],
    ]) +
    `<rect x="44" y="50" width="48" height="42" fill="#ffd23f"/>` +
    `<rect x="52" y="30" width="8" height="20" fill="#8a96b0"/>` +
    [52, 64, 76].map((x) => `<rect x="${x}" y="60" width="8" height="10" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<path d="M72 26L62 44H70L64 60L80 38H72L78 26Z" fill="#ff9f1a" transform="translate(4 30) scale(.9)"/>` +
    `<path d="M4 92H96"/>`,
  풍력발전기:
    `<path d="M4 92C20 78 40 74 56 80S86 78 96 72V96H4Z" fill="#5fc24a"/>` +
    `<path d="M47 90L49 40H53L55 90Z" fill="#fff"/>` +
    `<path d="M51 38L48 6C50 2 54 4 54 8Z" fill="#fff"/>` +
    `<path d="M51 38L80 52C82 56 78 58 75 56Z" fill="#fff"/>` +
    `<path d="M51 38L22 52C20 56 24 58 27 55Z" fill="#fff"/>` +
    `<circle cx="51" cy="38" r="5" fill="#8a96b0"/>` +
    `<path d="M6 30q8-5 16 0M10 40q8-5 16 0M74 72q8-5 16 0" stroke="#9aa6c4" stroke-width="3"/>`,
  천문대:
    `<rect x="4" y="4" width="92" height="88" rx="4" fill="#2c3570" stroke="none"/>` +
    sparkle(16, 16, 5) +
    sparkle(84, 14, 4) +
    sparkle(22, 40, 3.5) +
    sparkle(76, 36, 3.5) +
    `<path d="M66 14A10 10 0 1 0 76 26A8 8 0 0 1 66 14Z" fill="${HL}"/>` +
    `<rect x="20" y="62" width="60" height="30" fill="#fff"/><rect x="44" y="72" width="12" height="20" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M18 62C18 36 82 36 82 62Z" fill="#dfe8f5"/>` +
    `<path d="M46 40L54 40L56 62H44Z" fill="#4a4f66"/>` +
    `<path d="M46 50L68 28" stroke-width="12"/><path d="M46 50L68 28" stroke="#3b78e6" stroke-width="6"/>` +
    `<path d="M4 92H96"/>`,
  전망대:
    `<path d="M4 94C18 80 34 76 50 76S82 80 96 94Z" fill="#43b04a"/>` +
    `<path d="M45 78L47 34H53L55 78Z" fill="#dfe8f5"/>` +
    `<path d="M22 28H78L70 40H30Z" fill="#3b78e6"/>` +
    `<rect x="28" y="18" width="44" height="10" rx="2" fill="#8fd3ff"/>` +
    [36, 46, 56, 64].map((x) => `<path d="M${x} 18V28" stroke-width="2.5"/>`).join('') +
    `<path d="M26 18H74L66 12H34Z" fill="#e8553d"/>` +
    `<path d="M50 12V4" stroke-width="3"/>` +
    person(28, 94, 0.8, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    `<rect x="30" y="64" width="12" height="7" rx="3" fill="#4a4f66" stroke-width="2.5"/>` +
    `<path d="M40 60L50 44" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 4"/>`,
  갯벌:
    `<rect x="4" y="6" width="92" height="22" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 22q8-5 16 0t16 0t16 0t16 0t16 0t12 0V34H4Z" fill="#4a90e2"/>` +
    `<path d="M4 32Q50 26 96 32V94H4Z" fill="#8a6a4a"/>` +
    `<path d="M12 50q8 3 16 0M60 44q8 3 16 0M20 76q8 3 16 0" stroke="#6b4e34" stroke-width="3"/>` +
    [
      [30, 60],
      [72, 60],
      [50, 84],
      [82, 82],
      [14, 88],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.5" fill="#4a3522" stroke="none"/>`)
      .join('') +
    `<g transform="translate(50 64)">` +
    `<path d="M-14 6L-22 12M-12 10L-18 16M14 6L22 12M12 10L18 16" stroke-width="3"/>` +
    `<path d="M-12 -8L-20 -18L-10 -16Z" fill="#e8553d"/><path d="M12 -8L20 -18L10 -16Z" fill="#e8553d"/>` +
    `<ellipse cx="0" cy="4" rx="16" ry="11" fill="#e8553d"/>` +
    `<path d="M-5 -6V-11M5 -6V-11" stroke-width="2.5"/>` +
    dot(-5, -12, 2.6) +
    dot(5, -12, 2.6) +
    `<path d="M-4 6q4 3 8 0" stroke-width="2.5"/></g>` +
    `<path d="M70 76C70 70 84 70 84 76Z" fill="#fffaf0"/><path d="M73 74L75 71M78 74L79 71" stroke-width="2"/>` +
    `<path d="M16 64C16 58 30 58 30 64Z" fill="#ffc97a"/>`,

  // ── 전통 집 ──
  한옥:
    `<rect x="4" y="80" width="92" height="12" fill="#c9ccd6"/><path d="M4 86H96" stroke-width="2.5"/>` +
    `<rect x="14" y="44" width="72" height="36" fill="#fff4d0"/>` +
    [
      [18, 32],
      [40, 60],
      [64, 82],
    ]
      .map(
        ([a, b]) =>
          `<rect x="${a}" y="48" width="${b - a}" height="28" fill="#fffaf0" stroke-width="2.5"/>` +
          `<path d="M${a} 57H${b}M${a} 66H${b}M${(a + b) / 2} 48V76" stroke="#9a5b2e" stroke-width="2"/>`,
      )
      .join('') +
    [14, 36, 64, 86].map((x) => `<rect x="${x - 2.5}" y="42" width="5" height="38" fill="#9a5b2e" stroke-width="2"/>`).join('') +
    tileRoof(50, 44, 48, '#4a4f66') +
    `<path d="M18 38H82" stroke="#8a96b0" stroke-width="3"/><path d="M26 30H74" stroke="#8a96b0" stroke-width="3"/>`,
  초가집:
    `<rect x="18" y="50" width="64" height="40" fill="#e3c9a0"/>` +
    `<rect x="44" y="62" width="14" height="28" fill="#fffaf0" stroke-width="2.5"/><path d="M44 72H58M44 81H58M51 62V90" stroke="#9a5b2e" stroke-width="2"/>` +
    `<rect x="24" y="60" width="12" height="12" fill="#fffaf0" stroke-width="2.5"/><path d="M30 60V72M24 66H36" stroke="#9a5b2e" stroke-width="2"/>` +
    `<rect x="66" y="60" width="10" height="30" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M6 54C6 26 28 16 50 16S94 26 94 54C80 50 20 50 6 54Z" fill="#f2c14e"/>` +
    `<path d="M20 30Q50 22 80 30M12 42Q50 34 88 42" stroke="#c9922a" stroke-width="3"/>` +
    `<path d="M14 54l-2 5M26 52l-1 5M40 51v5M54 51v5M68 52l1 5M82 53l2 5" stroke="#c9922a" stroke-width="3"/>` +
    `<path d="M4 90H96"/>`,
  성문:
    `<rect x="4" y="48" width="18" height="44" fill="#c9ccd6"/><rect x="78" y="48" width="18" height="44" fill="#c9ccd6"/>` +
    `<path d="M4 48h5v-5h5v5h8M78 48h5v-5h5v5h8" stroke-width="2.5"/>` +
    `<path d="M20 92V52H80V92Z" fill="#dfe8f5"/>` +
    `<path d="M20 62H80M20 74H34M66 74H80M28 62V74M72 62V74M20 86H34M66 86H80" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M36 92V74C36 62 64 62 64 74V92Z" fill="#4a4f66"/>` +
    `<path d="M50 66V92" stroke="#9a5b2e" stroke-width="2"/>` +
    `<rect x="28" y="36" width="44" height="16" fill="#e8553d"/>` +
    [34, 44, 56, 66].map((x) => `<path d="M${x} 36V52" stroke="#43b04a" stroke-width="3"/>`).join('') +
    tileRoof(50, 36, 42, '#4a4f66') +
    `<path d="M4 92H96"/>`,
  동상:
    `<rect x="28" y="70" width="44" height="22" fill="#dfe8f5"/><rect x="22" y="86" width="56" height="8" fill="#c9ccd6"/>` +
    `<path d="M32 76H68" stroke="#8a96b0" stroke-width="3"/>` +
    `<g fill="#6fb5a0">` +
    `<path d="M38 70L40 48H60L62 70Z"/>` +
    `<path d="M40 50C40 40 60 40 60 50Z"/>` +
    `<path d="M58 44L74 14" stroke-width="12"/>` +
    `<circle cx="50" cy="28" r="11"/>` +
    `</g>` +
    `<path d="M58 44L74 14" stroke="#6fb5a0" stroke-width="5"/>` +
    `<path d="M40 50L34 66" stroke-width="10"/><path d="M40 50L34 66" stroke="#6fb5a0" stroke-width="4"/>` +
    `<circle cx="75" cy="12" r="5" fill="#6fb5a0"/>` +
    `<path d="M50 46V70" stroke="#4e9482" stroke-width="3"/>` +
    `<path d="M44 26h4M52 26h4" stroke="#4e9482" stroke-width="2.5"/>` +
    sparkle(22, 30, 6) +
    sparkle(84, 50, 5),

  // ── 공항 ──
  활주로:
    `<rect x="4" y="4" width="92" height="36" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="4" y="40" width="92" height="56" fill="#8fd67a" stroke="none"/>` +
    `<path d="M38 40H62L96 96H4Z" fill="#6b7288"/>` +
    [
      [44, 50],
      [60, 72],
    ]
      .map(([a, b]) => {
        const w = (y: number) => 1 + ((y - 40) / 56) * 3;
        return `<path d="M${50 - w(a)} ${a}H${50 + w(a)}L${50 + w(b)} ${b}H${50 - w(b)}Z" fill="#fff" stroke="none"/>`;
      })
      .join('') +
    `<path d="M47 82H53L54 96H46Z" fill="#fff" stroke="none"/>` +
    `<path d="M38 40L4 96M62 40L96 96" stroke="#fff" stroke-width="3"/>` +
    [
      [30, 52],
      [70, 52],
      [22, 66],
      [78, 66],
      [12, 82],
      [88, 82],
    ]
      .map(([x, y]) => dot(x, y, 2.2, HL))
      .join('') +
    plane(56, 22, 0.95, -12),
  관제탑:
    `<path d="M4 94H96" stroke-width="3.5"/><rect x="4" y="84" width="92" height="10" fill="#6b7288" stroke="none"/>` +
    `<path d="M4 89H14M24 89H34M44 89H54M64 89H74M84 89H94" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M40 84L43 40H57L60 84Z" fill="#dfe8f5"/>` +
    `<path d="M46 50H54M46 62H54M46 74H54" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M26 26H74L66 42H34Z" fill="#8fd3ff"/>` +
    `<path d="M38 26L40 42M50 26V42M62 26L60 42" stroke-width="2.5"/>` +
    `<path d="M24 20H76V26H24Z" fill="#3b78e6"/>` +
    `<path d="M50 20V12" stroke-width="3"/><path d="M40 6Q50 16 60 6Z" fill="#fff"/>` +
    `<path d="M64 8q4 2 4 6M68 4q6 3 6 10" stroke="#9aa6c4" stroke-width="2.5"/>` +
    plane(78, 60, 0.5, -8),

  // ── 구경하는 곳 ──
  식물원:
    `<path d="M10 90V56C10 28 90 28 90 56V90Z" fill="#cdeeff"/>` +
    `<path d="M50 34V90M26 40Q30 60 30 90M74 40Q70 60 70 90M10 64H90" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M50 14C40 14 40 30 50 32C60 30 60 14 50 14Z" fill="#cdeeff"/><path d="M50 14V8" stroke-width="3"/>` +
    `<path d="M40 90C42 72 42 60 40 50" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M40 50C32 42 20 44 16 50C26 48 32 50 40 50ZM40 50C46 40 58 40 62 46C52 46 46 48 40 50ZM40 50C36 38 42 30 50 30C44 36 42 42 40 50Z" fill="#43b04a"/>` +
    `<path d="M62 90V62C62 56 70 56 70 62V90Z" fill="#5fc24a"/><path d="M62 74H58C54 74 54 66 58 66V70H62M70 70H74V64C78 64 78 72 74 72H70" fill="#5fc24a" stroke-width="3"/>` +
    flower(24, 80, 4, '#ff5c70') +
    flower(80, 80, 4, '#a45cf0') +
    `<path d="M10 90V56C10 28 90 28 90 56V90Z"/><path d="M4 90H96"/>`,
  사파리:
    `<rect x="4" y="4" width="92" height="56" fill="#ffe7a8" stroke="none"/>` +
    `<path d="M4 58Q50 50 96 58V96H4Z" fill="#e3c070"/>` +
    `<path d="M80 60V38" stroke="#6b3e26" stroke-width="4"/><path d="M64 38Q80 26 96 38Z" fill="#43b04a"/>` +
    `<g fill="#ffc933">` +
    `<path d="M22 58V20L30 16L34 22L30 26V58Z"/>` +
    `</g>` +
    `<path d="M24 14l1-6M30 14l2-6" stroke-width="3"/>` +
    `<path d="M20 20C20 12 36 12 36 18L38 22C34 24 26 24 22 22Z" fill="#ffc933"/>` +
    dot(30, 17, 2) +
    [
      [26, 30],
      [29, 40],
      [25, 50],
    ]
      .map(([x, y]) => dot(x, y, 2.6, '#c9822a'))
      .join('') +
    `<rect x="34" y="52" width="58" height="26" rx="4" fill="#5fa84a"/>` +
    `<path d="M40 52V40H80L86 52" fill="#fff" stroke-width="3"/>` +
    `<rect x="44" y="42" width="14" height="10" fill="#8fd3ff" stroke-width="2.5"/><rect x="62" y="42" width="14" height="10" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M36 36H84" stroke-width="4"/><path d="M40 36V52M80 36V52" stroke-width="3"/>` +
    `<path d="M44 60H54M68 60H78" stroke="#3a7a36" stroke-width="3"/>` +
    `<circle cx="46" cy="80" r="9" fill="${INK}"/>` +
    dot(46, 80, 3.8, '#dfe8f5') +
    `<circle cx="80" cy="80" r="9" fill="${INK}"/>` +
    dot(80, 80, 3.8, '#dfe8f5') +
    `<rect x="90" y="56" width="5" height="6" rx="2" fill="#ffd23f" stroke-width="2"/>`,
  아쿠아리움:
    `<rect x="4" y="4" width="92" height="92" fill="#2c3570" stroke="none"/>` +
    `<path d="M10 92V44C10 16 90 16 90 44V92Z" fill="#4aa8f0"/>` +
    `<path d="M10 80Q50 72 90 80V92H10Z" fill="#f2d7a6"/>` +
    `<path d="M20 82C16 70 24 64 20 54M26 82C30 72 24 66 28 58" stroke="#43b04a" stroke-width="4"/>` +
    fish(44, 38, 0.8, '#ff9f1a') +
    fish(70, 54, 0.65, '#ffd23f', true) +
    fish(40, 62, 0.55, '#ff5c70') +
    `<path d="M64 28C78 22 88 30 86 36C80 34 74 34 64 28Z" fill="#8a96b0"/>` +
    `<circle cx="60" cy="18" r="2.5" fill="#fff" stroke-width="1.5"/><circle cx="56" cy="26" r="3" fill="#fff" stroke-width="1.5"/>` +
    `<path d="M10 92V44C10 16 90 16 90 44V92Z" stroke-width="5"/>` +
    person(62, 96, 0.9, { hair: '#5a3b24', style: 'pony', shirt: '#ffd23f' }),
  자연사박물관:
    `<path d="M6 30L50 6L94 30Z" fill="#dfe8f5"/><rect x="8" y="30" width="84" height="6" fill="#c9ccd6"/>` +
    `<rect x="8" y="36" width="84" height="54" fill="#fffaf0"/>` +
    [16, 84].map((x) => `<rect x="${x - 4}" y="36" width="8" height="54" fill="#dfe8f5"/>`).join('') +
    `<rect x="4" y="88" width="92" height="6" fill="#c9ccd6"/>` +
    `<g transform="translate(50 60)">` +
    `<path d="M-26 20V8M-16 20V10M12 20V10M22 20V8" stroke-width="6"/>` +
    `<path d="M-26 20V8M-16 20V10M12 20V10M22 20V8" stroke="#6fb5a0" stroke-width="2.5"/>` +
    `<path d="M-30 10C-30 -4 -18 -8 -4 -8C8 -8 16 -12 18 -20L20 -34C21 -40 30 -40 31 -34C32 -30 28 -28 26 -26L24 -14C22 -2 18 10 -2 12C-14 13 -24 14 -34 16L-38 14Z" fill="#6fb5a0"/>` +
    dot(27, -33, 1.8) +
    `<path d="M-14 -4Q-6 -8 2 -4" stroke="#4e9482" stroke-width="2.5"/>` +
    `</g>` +
    `<rect x="18" y="78" width="64" height="4" fill="#c98b4f" stroke-width="2"/>`,
  우주센터:
    `<rect x="4" y="4" width="92" height="74" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M62 78V10" stroke-width="3"/><path d="M58 78V10H66V78" stroke="#8a96b0" stroke-width="3"/>` +
    [18, 30, 42, 54, 66].map((y) => `<path d="M58 ${y}L66 ${y + 10}" stroke="#8a96b0" stroke-width="2.5"/>`).join('') +
    `<path d="M58 30H50M58 50H50" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M40 10C32 20 30 34 30 44V70H50V44C50 34 48 20 40 10Z" fill="#fff"/>` +
    `<path d="M30 20C34 14 46 14 50 20" fill="none"/><path d="M36 20C38 14 42 14 44 20Z" fill="#e8553d"/>` +
    `<path d="M30 56L22 72H30ZM50 56L58 72H50Z" fill="#e8553d"/>` +
    `<circle cx="40" cy="34" r="5" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="34" y="70" width="12" height="4" fill="#8a96b0" stroke-width="2"/>` +
    `<rect x="4" y="78" width="92" height="18" fill="#c9ccd6"/>` +
    `<rect x="72" y="56" width="22" height="22" fill="#fff"/><path d="M76 64h14" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M83 56V48" stroke-width="2.5"/><path d="M76 46Q83 54 90 46Z" fill="#dfe8f5"/>` +
    `<path d="M4 78H96"/>`,

  // ── 교통 ──
  지하철역:
    `<rect x="4" y="4" width="92" height="42" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="4" y="46" width="92" height="50" fill="#c9b79c" stroke="none"/>` +
    `<path d="M4 46H96" stroke-width="3.5"/>` +
    `<path d="M20 46V28H56V46" fill="#fff"/><path d="M16 24H60V30H16Z" fill="#43b04a"/>` +
    `<path d="M24 46H52V58H24Z" fill="#8a96b0" stroke="none"/>` +
    [0, 1, 2, 3].map((i) => `<path d="M24 ${46 + i * 4}H52" stroke="#fff" stroke-width="2"/>`).join('') +
    `<path d="M24 46V58M52 46V58" stroke-width="2.5"/>` +
    `<path d="M74 46V16" stroke-width="3.5"/><circle cx="74" cy="16" r="10" fill="#43b04a"/><circle cx="74" cy="16" r="5" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="4" y="62" width="92" height="30" fill="#4a4f66" stroke="none"/>` +
    `<rect x="8" y="64" width="72" height="24" rx="6" fill="#dfe8f5"/>` +
    `<rect x="8" y="80" width="72" height="4" fill="#43b04a" stroke="none"/>` +
    [14, 32, 50].map((x) => `<rect x="${x}" y="68" width="12" height="9" rx="2" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<rect x="68" y="68" width="8" height="18" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M4 90H96" stroke-width="3"/>`,
  버스정류장:
    `<rect x="4" y="84" width="92" height="12" fill="#c9ccd6"/>` +
    `<path d="M8 20H56V26H8Z" fill="#3b78e6"/><path d="M12 26V84M52 26V84" stroke-width="4"/>` +
    `<rect x="16" y="28" width="32" height="32" fill="#cdeeff" stroke-width="2.5"/>` +
    `<rect x="14" y="66" width="36" height="6" rx="2" fill="#c98b4f"/><path d="M18 72V84M46 72V84" stroke-width="3"/>` +
    `<path d="M76 84V30" stroke-width="4"/><circle cx="76" cy="22" r="13" fill="#3b78e6"/>` +
    `<rect x="68" y="16" width="16" height="10" rx="2" fill="#fff" stroke-width="2.5"/><path d="M68 21H84" stroke-width="2"/>` +
    dot(71, 28, 2, '#fff') +
    dot(81, 28, 2, '#fff') +
    person(34, 86, 0.8, { hair: '#5a3b24', style: 'long', shirt: '#ff5c70' }) +
    person(62, 86, 1.05, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }),
  조선소:
    `<rect x="4" y="4" width="92" height="66" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M10 70V12H90V70" stroke-width="5"/><path d="M10 70V12H90V70" stroke="#ffd23f" stroke-width="2"/>` +
    `<rect x="6" y="8" width="88" height="8" fill="#ffd23f"/>` +
    `<rect x="56" y="16" width="12" height="8" fill="#e8553d" stroke-width="2.5"/><path d="M62 24V40" stroke-width="2"/>` +
    `<path d="M56 40H68V46H56Z" fill="#8a96b0" stroke-width="2"/>` +
    `<path d="M14 52H86L78 72H22Z" fill="#e8553d"/><path d="M18 60H82" stroke="#fff" stroke-width="3"/>` +
    `<rect x="30" y="42" width="24" height="10" fill="#fff"/><rect x="36" y="34" width="12" height="8" fill="#fff"/>` +
    `<rect x="34" y="44" width="4" height="4" fill="#8fd3ff" stroke="none"/><rect x="42" y="44" width="4" height="4" fill="#8fd3ff" stroke="none"/>` +
    `<path d="M28 72V80M50 72V80M72 72V80" stroke-width="4"/>` +
    `<rect x="4" y="80" width="92" height="16" fill="#8a96b0"/>` +
    `<path d="M4 88q8-4 16 0t16 0" stroke="#4a90e2" stroke-width="3"/>`,
  어촌:
    `<rect x="4" y="4" width="92" height="44" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 48H44L40 56H4Z" fill="#f2d7a6" stroke="none"/>` +
    `<path d="M4 50H48V96H4Z" fill="#f2d7a6" stroke="none"/>` +
    `<path d="M48 50Q56 56 52 96H96V50Z" fill="#4a90e2"/>` +
    `<path d="M10 40L22 28L34 40Z" fill="#3b78e6"/><rect x="12" y="40" width="20" height="16" fill="#fff"/><rect x="19" y="46" width="6" height="10" fill="#9a5b2e" stroke-width="2"/>` +
    `<path d="M30 60L40 50L50 60Z" fill="#e8553d"/><rect x="32" y="60" width="16" height="12" fill="#fff"/>` +
    `<path d="M8 74H40M12 74V84M24 74V84M36 74V84" stroke="#9a5b2e" stroke-width="3"/>` +
    [16, 28].map((x) => fish(x + 2, 80, 0.3, '#8a96b0')).join('') +
    `<path d="M58 72H92L86 84H64Z" fill="#fff"/><path d="M60 76H90" stroke="#e8553d" stroke-width="3"/>` +
    `<rect x="70" y="62" width="10" height="10" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M76 62V44" stroke-width="3"/><path d="M76 44L90 50L76 54Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M56 90q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="3"/>`,
  도시:
    `<rect x="4" y="4" width="92" height="88" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="8" y="40" width="20" height="52" fill="#8a96b0"/>` +
    `<rect x="30" y="10" width="22" height="82" fill="#3b78e6"/>` +
    `<path d="M41 10V4" stroke-width="3"/>` +
    `<rect x="54" y="28" width="18" height="64" fill="#ffd23f"/>` +
    `<rect x="74" y="50" width="20" height="42" fill="#ff9aa8"/>` +
    [46, 56, 66, 76].map((y) => `<rect x="12" y="${y}" width="5" height="5" fill="#fff" stroke="none"/><rect x="20" y="${y}" width="5" height="5" fill="#fff" stroke="none"/>`).join('') +
    [18, 28, 38, 48, 58, 68, 78].map((y) => `<rect x="34" y="${y}" width="5" height="5" fill="#cdeeff" stroke="none"/><rect x="43" y="${y}" width="5" height="5" fill="#cdeeff" stroke="none"/>`).join('') +
    [34, 44, 54, 64, 74].map((y) => `<rect x="58" y="${y}" width="10" height="5" fill="#fff" stroke="none"/>`).join('') +
    [56, 66, 76].map((y) => `<rect x="78" y="${y}" width="5" height="5" fill="#fff" stroke="none"/><rect x="86" y="${y}" width="5" height="5" fill="#fff" stroke="none"/>`).join('') +
    `<rect x="8" y="40" width="20" height="52"/><rect x="30" y="10" width="22" height="82"/><rect x="54" y="28" width="18" height="64"/><rect x="74" y="50" width="20" height="42"/>` +
    `<path d="M4 92H96"/>`,
  시골:
    `<rect x="4" y="4" width="92" height="50" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 54L28 22L46 40L64 18L96 54Z" fill="#6fb5a0"/>` +
    `<circle cx="84" cy="16" r="8" fill="${HL}"/>` +
    `<path d="M4 54H96V96H4Z" fill="#8fd67a"/>` +
    `<path d="M4 72H56L50 96H4Z" fill="#ffd23f"/>` +
    [14, 26, 38].map((x) => `<path d="M${x} 94l-2 -18M${x + 4} 94l2 -18" stroke="#c9922a" stroke-width="2.5"/>`).join('') +
    `<path d="M50 50L62 38L74 50Z" fill="#e8553d"/><rect x="52" y="50" width="20" height="18" fill="#fffaf0"/><rect x="59" y="56" width="7" height="12" fill="#9a5b2e" stroke-width="2"/>` +
    tree(86, 72, 0.8) +
    `<path d="M60 96Q66 84 62 68" stroke="#e3c9a0" stroke-width="6"/>` +
    `<path d="M4 72H56M50 96L56 72" stroke-width="2.5"/>`,
  골목:
    `<rect x="4" y="4" width="92" height="30" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 4H38V60L4 96Z" fill="#f2d7a6"/><path d="M96 4H62V60L96 96Z" fill="#ffe7a8"/>` +
    `<path d="M38 60H62L96 96H4Z" fill="#c9ccd6"/>` +
    `<path d="M38 34H62V60H38Z" fill="#fffaf0"/><path d="M44 60V44H56V60" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M34 30L50 20L66 30Z" fill="#e8553d"/>` +
    `<rect x="14" y="30" width="12" height="14" fill="#8fd3ff" stroke-width="2.5" transform="skewY(-8)"/>` +
    `<rect x="74" y="24" width="12" height="14" fill="#8fd3ff" stroke-width="2.5" transform="skewY(8)"/>` +
    `<path d="M4 4H38V60L4 96M96 4H62V60L96 96" stroke-width="3.5"/>` +
    `<path d="M20 20L38 18M62 18L80 20" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M46 60L40 96M54 60L60 96" stroke="#8a96b0" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<g transform="translate(58 84)">` +
    `<path d="M-10 6C-10 -4 10 -4 10 6Z" fill="#ff9f1a"/><circle cx="8" cy="-4" r="6" fill="#ff9f1a"/>` +
    `<path d="M4 -8L5 -13L8 -10M10 -10L12 -13L12 -8" fill="#ff9f1a" stroke-width="2"/>` +
    dot(7, -4, 1.3) +
    dot(10, -4, 1.3) +
    `<path d="M-10 2Q-18 0 -16 -8" stroke-width="3"/></g>`,

  // ── 시장 ──
  전통시장:
    `<rect x="4" y="4" width="92" height="30" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 30Q20 12 36 30Z" fill="#e8553d"/><path d="M34 26Q50 8 66 26Z" fill="#3b78e6"/><path d="M64 30Q80 12 96 30Z" fill="#ffd23f"/>` +
    `<path d="M20 30V58M50 26V58M80 30V58" stroke-width="3"/>` +
    person(50, 72, 1.05, { hair: '#dfe8f5', style: 'bun', shirt: '#a45cf0' }) +
    `<rect x="4" y="58" width="92" height="12" fill="#c98b4f"/>` +
    `<path d="M8 70L12 94H34L38 70Z" fill="#e3b577"/><path d="M62 70L66 94H88L92 70Z" fill="#e3b577"/>` +
    `<path d="M40 70L44 94H58L60 70Z" fill="#e3b577"/>` +
    `<path d="M10 78H36M64 78H90M42 80H58" stroke="#9a5b2e" stroke-width="2.5"/>` +
    [
      [12, 62],
      [20, 60],
      [28, 62],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e8553d" stroke-width="2.5"/>`)
      .join('') +
    `<ellipse cx="78" cy="60" rx="12" ry="6" fill="#43b04a" stroke-width="2.5"/><path d="M70 60H86" stroke="#c9f0a0" stroke-width="2"/>` +
    `<path d="M40 60L44 54L48 60L52 54L56 60L60 54" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M4 94H96"/>`,
  야시장:
    `<rect x="4" y="4" width="92" height="92" fill="#2c3570" stroke="none"/>` +
    sparkle(14, 12, 3.5, '#fff') +
    sparkle(86, 12, 3.5, '#fff') +
    `<path d="M76 8A8 8 0 1 0 86 18A6 6 0 0 1 76 8Z" fill="${HL}" transform="translate(-30 2)"/>` +
    bulbs([12, 28, 44, 56, 72, 88], 28) +
    `<path d="M14 44H86L80 52H20Z" fill="#e8553d"/><path d="M26 44L24 52M38 44V52M50 44V52M62 44V52M74 44L76 52" stroke="#fff" stroke-width="3"/>` +
    `<path d="M20 52V84M80 52V84" stroke-width="3"/>` +
    `<rect x="12" y="72" width="76" height="20" fill="#c98b4f"/>` +
    [30, 42, 54].map((x) => `<path d="M${x} 72V52" stroke="#9a5b2e" stroke-width="2.5"/><circle cx="${x}" cy="58" r="4" fill="#9a5b2e" stroke-width="2"/><circle cx="${x}" cy="66" r="4" fill="#e8862e" stroke-width="2"/>`).join('') +
    `<path d="M62 72C62 62 78 62 78 72Z" fill="#fff"/><path d="M66 60c-3-4 3-6 0-10M74 60c-3-4 3-6 0-10" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,
  벼룩시장:
    `<rect x="4" y="4" width="92" height="50" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="4" y="54" width="92" height="42" fill="#8fd67a" stroke="none"/>` +
    `<path d="M10 66H90L96 92H4Z" fill="#ff9aa8"/>` +
    `<path d="M20 66L14 92M40 66L38 92M60 66L62 92M80 66L86 92M8 78H92" stroke="#fff" stroke-width="2.5"/>` +
    `<g transform="translate(24 60)">` +
    `<circle cx="-8" cy="-22" r="5" fill="#c98b4f"/><circle cx="8" cy="-22" r="5" fill="#c98b4f"/>` +
    `<ellipse cx="0" cy="6" rx="12" ry="12" fill="#c98b4f"/><circle cx="0" cy="-14" r="11" fill="#c98b4f"/>` +
    dot(-4, -15, 1.8) +
    dot(4, -15, 1.8) +
    `<ellipse cx="0" cy="-10" rx="4" ry="3" fill="#f2d7a6" stroke-width="2"/>` +
    `<path d="M-4 0L4 8M4 0L-4 8" stroke="#8a96b0" stroke-width="2"/></g>` +
    `<rect x="40" y="56" width="20" height="8" fill="#3b78e6" stroke-width="2.5"/><rect x="42" y="48" width="18" height="8" fill="#43b04a" stroke-width="2.5"/><rect x="40" y="40" width="20" height="8" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M74 64V44" stroke-width="3"/><path d="M64 44L68 28H80L84 44Z" fill="#ffd23f"/><ellipse cx="74" cy="66" rx="8" ry="3" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M50 70L60 76L58 84L46 82Z" fill="#fff" stroke-width="2.5"/><circle cx="50" cy="74" r="1.6" fill="${INK}" stroke="none"/>` +
    `<path d="M48 70Q44 64 52 62" stroke-width="2"/>`,
  꽃시장:
    awning(4, 6, 92, '#e85d9a', '#fff', 8) +
    `<rect x="4" y="26" width="92" height="66" fill="#fffaf0" stroke="none"/>` +
    [
      [20, '#8a96b0'],
      [50, '#3b8fe0'],
      [80, '#8a96b0'],
    ]
      .map(([x]) => `<path d="M${x} 72V52M${Number(x) - 7} 72L${Number(x) - 10} 50M${Number(x) + 7} 72L${Number(x) + 10} 50" stroke="#3a9e47" stroke-width="3"/>`)
      .join('') +
    flower(20, 44, 5, '#ff5c70') +
    flower(10, 52, 4, '#ffd23f') +
    flower(30, 52, 4, '#fff') +
    flower(50, 40, 5, '#a45cf0') +
    flower(40, 50, 4, '#ff9aa8') +
    flower(60, 50, 4, '#ff9f1a') +
    flower(80, 44, 5, '#e85d9a') +
    flower(70, 52, 4, '#fff') +
    flower(90, 52, 4, '#ff5c70') +
    [20, 50, 80].map((x) => `<path d="M${x - 12} 66H${x + 12}L${x + 9} 90H${x - 9}Z" fill="#7ec8f0"/>`).join('') +
    `<path d="M4 92H96"/>`,

  // ── 먹는 곳 ──
  케이크가게:
    shop(
      '#ff9aa8',
      '#fff',
      `<rect x="16" y="36" width="68" height="54" rx="3" fill="#cdeeff"/>` +
        `<rect x="22" y="80" width="56" height="6" rx="2" fill="#dfe8f5"/>` +
        `<path d="M26 80V62H74V80Z" fill="#fff"/><path d="M26 70H74" stroke="#ff9aa8" stroke-width="5"/>` +
        `<path d="M34 62V48H66V62Z" fill="#ffc6d0"/><path d="M34 54H66" stroke="#fff" stroke-width="4"/>` +
        `<path d="M26 62q4 5 8 0t8 0t8 0t8 0t8 0t8 0M34 48q4 4 8 0t8 0t8 0t8 0" stroke="#fff" stroke-width="3"/>` +
        `<path d="M49 48V40" stroke="#7ec8f0" stroke-width="4"/><path d="M49 32C46 36 46 39 49 39S52 36 49 32Z" fill="#ff9f1a" stroke-width="2"/>` +
        [30, 42, 56, 68].map((x) => `<circle cx="${x}" cy="60" r="3.5" fill="#e8553d" stroke-width="2"/>`).join(''),
    ),
  반찬가게:
    shop(
      '#43b04a',
      '#fff',
      `<rect x="14" y="44" width="72" height="44" fill="#dfe8f5"/>` +
        [
          [18, 48, '#e8553d'],
          [40, 48, '#5fc24a'],
          [62, 48, '#5a3b24'],
          [18, 68, '#ffd23f'],
          [40, 68, '#ff9f1a'],
          [62, 68, '#fffaf0'],
        ]
          .map(
            ([x, y, c]) =>
              `<rect x="${x}" y="${y}" width="20" height="16" rx="2" fill="#fff" stroke-width="2.5"/><rect x="${Number(x) + 3}" y="${Number(y) + 3}" width="14" height="8" rx="2" fill="${c}" stroke="none"/>`,
          )
          .join('') +
        `<path d="M24 54L32 56M44 52L52 58M66 56h2M72 54h2M68 58h2" stroke="#fff" stroke-width="2"/>` +
        `<path d="M40 38L60 38" stroke="#9a5b2e" stroke-width="3"/><path d="M42 30L46 38M54 30L50 38" stroke="#9a5b2e" stroke-width="2.5"/>`,
    ),
  뷔페:
    `<rect x="4" y="4" width="92" height="92" fill="#fff4d0" stroke="none"/>` +
    `<rect x="4" y="54" width="92" height="12" fill="#fff"/><rect x="8" y="66" width="84" height="26" fill="#e8553d"/>` +
    `<path d="M8 72H92" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M8 54C8 40 34 40 34 54Z" fill="#dfe8f5"/><path d="M21 42V38" stroke-width="3"/>` +
    `<ellipse cx="50" cy="52" rx="14" ry="5" fill="#fff"/><path d="M40 50C42 42 58 42 60 50Z" fill="#ff9f1a"/>` +
    `<ellipse cx="80" cy="52" rx="14" ry="5" fill="#fff"/><circle cx="74" cy="48" r="4" fill="#43b04a" stroke-width="2"/><circle cx="82" cy="46" r="4" fill="#e8553d" stroke-width="2"/><circle cx="88" cy="49" r="3.5" fill="${HL}" stroke-width="2"/>` +
    person(52, 40, 0.95, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    `<ellipse cx="66" cy="28" rx="12" ry="4" fill="#fff"/>` +
    `<circle cx="62" cy="25" r="3" fill="#ff9f1a" stroke-width="2"/><circle cx="69" cy="25" r="3" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M58 30L60 36" stroke-width="3"/>` +
    [
      [18, 30],
      [84, 26],
    ]
      .map(([x, y]) => sparkle(x, y, 5))
      .join(''),
  푸드코트:
    `<rect x="4" y="4" width="92" height="92" fill="#fff4d0" stroke="none"/>` +
    [
      [4, '#e8553d'],
      [35, '#3b78e6'],
      [66, '#43b04a'],
    ]
      .map(([x, c]) => `<rect x="${x}" y="10" width="30" height="36" fill="#fff"/><rect x="${x}" y="10" width="30" height="10" fill="${c}"/>`)
      .join('') +
    `<ellipse cx="19" cy="34" rx="9" ry="6" fill="#ffd23f"/><path d="M12 32Q19 26 26 32" stroke="#e8862e" stroke-width="2.5"/>` +
    `<path d="M42 32H58V40H42Z" fill="#fff"/><path d="M42 32Q50 22 58 32" fill="#fffaf0"/><path d="M44 30L52 26" stroke="#9a5b2e" stroke-width="2"/>` +
    `<path d="M73 38L81 24L89 38Z" fill="#ffd23f"/><circle cx="80" cy="33" r="2" fill="#e8553d" stroke="none"/><circle cx="84" cy="35" r="1.8" fill="#e8553d" stroke="none"/>` +
    `<path d="M4 46H96" stroke-width="3.5"/>` +
    [28, 72]
      .map(
        (x) =>
          `<ellipse cx="${x}" cy="70" rx="18" ry="6" fill="#c98b4f"/><path d="M${x} 76V90" stroke-width="4"/>` +
          `<rect x="${x - 26}" y="74" width="7" height="12" rx="2" fill="#ff9f1a" stroke-width="2.5"/><rect x="${x + 19}" y="74" width="7" height="12" rx="2" fill="#ff9f1a" stroke-width="2.5"/>`,
      )
      .join('') +
    `<rect x="18" y="62" width="18" height="8" rx="2" fill="#7ec8f0" stroke-width="2.5"/><rect x="62" y="62" width="18" height="8" rx="2" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,

  // ── 가게 ──
  장난감가게:
    shop(
      '#a45cf0',
      '#ffd23f',
      `<g transform="translate(30 68)">` +
        `<circle cx="-9" cy="-24" r="5" fill="#c98b4f"/><circle cx="9" cy="-24" r="5" fill="#c98b4f"/>` +
        `<ellipse cx="0" cy="8" rx="13" ry="14" fill="#c98b4f"/><circle cx="0" cy="-14" r="12" fill="#c98b4f"/>` +
        dot(-4, -16, 2) +
        dot(4, -16, 2) +
        `<ellipse cx="0" cy="-10" rx="4.5" ry="3.5" fill="#f2d7a6" stroke-width="2"/>` +
        `<path d="M-6 -2L6 2L-6 6L6 -6Z" fill="#e8553d" stroke-width="2"/>` +
        `</g>` +
        `<rect x="54" y="38" width="22" height="18" rx="3" fill="#8a96b0"/>` +
        dot(60, 46, 2.5, '#7ec8f0') +
        dot(70, 46, 2.5, '#7ec8f0') +
        `<path d="M65 38V32" stroke-width="2.5"/><circle cx="65" cy="30" r="2.5" fill="#e8553d" stroke-width="2"/>` +
        `<rect x="56" y="58" width="18" height="16" rx="2" fill="#8a96b0"/><path d="M60 52H70" stroke-width="2"/>` +
        `<rect x="48" y="78" width="12" height="12" fill="#3b78e6"/><rect x="60" y="78" width="12" height="12" fill="#ffd23f"/><rect x="72" y="78" width="12" height="12" fill="#43b04a"/>` +
        `<circle cx="78" cy="68" r="7" fill="#ff5c70"/><path d="M71 68H85" stroke="#fff" stroke-width="2.5"/>`,
    ),
  시계방:
    `<rect x="6" y="6" width="88" height="86" fill="#f2d7a6"/>` +
    clock(26, 26, 14, '#e8553d', -80, 20) +
    clock(74, 24, 12, '#3b78e6', 200, -90) +
    `<path d="M40 44H60V78C60 84 40 84 40 78Z" fill="#9a5b2e"/>` +
    clock(50, 54, 9, '#c98b4f', -120, -30) +
    `<path d="M50 64V72" stroke-width="2.5"/><circle cx="50" cy="74" r="3.5" fill="${HL}" stroke-width="2"/>` +
    clock(24, 62, 10, '#43b04a', 0, -90) +
    `<rect x="66" y="50" width="10" height="36" rx="3" fill="#8a96b0"/>` +
    clock(71, 68, 9, '#ffd23f', -45, 60) +
    `<path d="M4 92H96"/><rect x="10" y="80" width="30" height="10" fill="#c98b4f" stroke-width="2.5"/>`,
  이발소:
    `<rect x="6" y="6" width="88" height="86" fill="#dff3ff"/>` +
    `<rect x="10" y="10" width="18" height="6" rx="3" fill="#8a96b0"/><rect x="10" y="72" width="18" height="6" rx="3" fill="#8a96b0"/>` +
    `<rect x="12" y="16" width="14" height="56" rx="3" fill="#fff"/>` +
    [18, 32, 46].map((y) => `<path d="M12 ${y + 6}L26 ${y}" stroke="#e8553d" stroke-width="4"/><path d="M12 ${y + 13}L26 ${y + 7}" stroke="#3b78e6" stroke-width="4"/>`).join('') +
    `<rect x="12" y="16" width="14" height="56" rx="3"/>` +
    `<path d="M20 78V92" stroke-width="4"/>` +
    `<path d="M44 92L50 80H78L84 92Z" fill="#8a96b0"/>` +
    `<path d="M46 80V62C46 58 50 56 54 56H74C78 56 82 58 82 62V80Z" fill="#e8553d"/>` +
    person(64, 72, 1, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<path d="M40 62C40 50 88 50 88 62L86 78H42Z" fill="#fff"/>` +
    `<g transform="translate(80 28) rotate(-30)">` +
    `<path d="M0 0L-14 -4M0 0L-14 4" stroke-width="3"/>` +
    `<circle cx="5" cy="-4" r="4" fill="#ffd23f" stroke-width="2.5"/><circle cx="5" cy="4" r="4" fill="#ffd23f" stroke-width="2.5"/></g>` +
    `<path d="M40 22L40 38" stroke="#9a5b2e" stroke-width="6"/><path d="M36 26H44M36 30H44M36 34H44" stroke-width="1.5"/>`,
  사진관:
    `<rect x="4" y="4" width="92" height="92" fill="#dfe8f5" stroke="none"/>` +
    `<rect x="48" y="10" width="44" height="62" fill="#7ec8f0"/>` +
    person(70, 72, 1.2, { hair: '#2f2a26', style: 'long', shirt: '#e85d9a' }) +
    `<rect x="48" y="10" width="44" height="62"/>` +
    `<path d="M24 60L14 94M24 60V94M24 60L34 94" stroke-width="3.5"/>` +
    `<rect x="8" y="36" width="32" height="24" rx="4" fill="#4a4f66"/>` +
    `<rect x="14" y="30" width="10" height="7" rx="2" fill="#4a4f66"/>` +
    `<circle cx="28" cy="48" r="8" fill="#8a96b0"/><circle cx="28" cy="48" r="4" fill="#3b78e6" stroke-width="2"/>` +
    `<path d="M40 40L46 36M42 48H48M40 56L46 60" stroke="${HL}" stroke-width="3"/>` +
    `<rect x="10" y="10" width="14" height="12" fill="#fff" stroke-width="2.5"/><path d="M12 20L17 14L22 20Z" fill="#43b04a" stroke-width="1.5"/>` +
    `<rect x="28" y="12" width="14" height="12" fill="#fff" stroke-width="2.5"/>` +
    dot(35, 17, 3, '#ffd6ad'),

  // ── 학교·운동 ──
  초등학교:
    `<rect x="4" y="4" width="92" height="56" fill="#bfe6ff" stroke="none"/>` +
    `<rect x="8" y="30" width="84" height="44" fill="#ffe7a8"/>` +
    `<path d="M36 30V20H64V30" fill="#ffe7a8"/><path d="M34 20L50 8L66 20Z" fill="#e8553d"/>` +
    clock(50, 22, 6, '#3b78e6', -90, 0) +
    [14, 26, 64, 76].map((x) => `<rect x="${x}" y="36" width="10" height="10" fill="#8fd3ff" stroke-width="2.5"/><rect x="${x}" y="54" width="10" height="10" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<path d="M42 74V52H58V74" fill="#9a5b2e"/><path d="M50 52V74" stroke-width="2"/>` +
    `<path d="M8 74H92" stroke-width="3.5"/><rect x="4" y="74" width="92" height="22" fill="#e3c9a0" stroke="none"/>` +
    person(24, 96, 0.72, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<rect x="11" y="78" width="6" height="12" rx="2" fill="#e8553d" stroke-width="2"/>` +
    person(76, 96, 0.72, { hair: '#5a3b24', style: 'pony', shirt: '#ff9aa8' }) +
    `<rect x="83" y="78" width="6" height="12" rx="2" fill="#3b78e6" stroke-width="2"/>`,
  태권도장:
    `<rect x="4" y="4" width="92" height="66" fill="#fff4d0" stroke="none"/>` +
    `<rect x="4" y="70" width="92" height="26" fill="#3b78e6"/><path d="M36 70L30 96M66 70L72 96" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 10A7 7 0 0 1 50 24A7 7 0 0 0 50 38A14 14 0 0 1 50 10Z" fill="#e8553d" transform="translate(28 0)"/><path d="M50 10A14 14 0 0 1 50 38A7 7 0 0 1 50 24A7 7 0 0 0 50 10Z" fill="#3b78e6" transform="translate(28 0)"/>` +
    `<g>` +
    tube('M40 60L32 84', '#fff', 7) +
    tube('M48 58L82 40', '#fff', 7) +
    `<path d="M30 50C30 38 52 36 54 50L54 62H34Z" fill="#fff"/>` +
    `<path d="M40 38L46 48L52 38" stroke-width="2.5"/>` +
    tube('M34 44L20 36', '#fff', 6) +
    tube('M50 44L60 30', '#fff', 6) +
    `<circle cx="18" cy="35" r="4" fill="${SKIN}" stroke-width="2.5"/><circle cx="61" cy="28" r="4" fill="${SKIN}" stroke-width="2.5"/>` +
    `<path d="M32 58H56" stroke="${INK}" stroke-width="5"/><path d="M44 58L40 66M44 58L48 66" stroke="${INK}" stroke-width="3.5"/>` +
    `<circle cx="84" cy="40" r="4" fill="${SKIN}" stroke-width="2.5"/><circle cx="32" cy="86" r="4" fill="${SKIN}" stroke-width="2.5"/>` +
    `<circle cx="42" cy="24" r="11" fill="${SKIN}"/><path d="M31 22C31 12 53 12 53 22C48 18 36 18 31 22Z" fill="#2f2a26"/>` +
    dot(38, 25, 1.8) +
    dot(46, 25, 1.8) +
    `<path d="M39 30q3 2 6 0" stroke-width="2"/>` +
    `</g>` +
    `<path d="M86 32l6 -4M88 44h6M86 52l6 3" stroke="#9aa6c4" stroke-width="2.5"/>`,
  경기장:
    `<rect x="4" y="4" width="92" height="92" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M10 20V8M90 20V8" stroke-width="3"/><rect x="4" y="4" width="12" height="6" rx="2" fill="${HL}" stroke-width="2.5"/><rect x="84" y="4" width="12" height="6" rx="2" fill="${HL}" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="56" rx="46" ry="34" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="58" rx="38" ry="26" fill="#dfe8f5"/>` +
    [
      [22, 40, '#e8553d'],
      [36, 34, '#ffd23f'],
      [50, 32, '#3b78e6'],
      [64, 34, '#43b04a'],
      [78, 40, '#ff9aa8'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}" stroke-width="2"/>`)
      .join('') +
    `<ellipse cx="50" cy="62" rx="30" ry="18" fill="#43b04a"/>` +
    `<ellipse cx="50" cy="62" rx="24" ry="13" stroke="#fff" stroke-width="2.5"/><path d="M50 49V75" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M4 86Q50 102 96 86" stroke-width="3"/>`,
  농구장:
    `<rect x="4" y="4" width="92" height="92" fill="#e8a85c" stroke="none"/>` +
    `<path d="M4 96V84Q50 60 96 84V96" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 96V70H66V96" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 96V66" stroke-width="4"/>` +
    `<rect x="26" y="10" width="48" height="32" rx="2" fill="#fff"/>` +
    `<rect x="40" y="22" width="20" height="14" fill="#fff" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 42V66" stroke-width="5"/>` +
    `<ellipse cx="50" cy="40" rx="11" ry="3.5" fill="#fff" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M39 41L43 54H57L61 41M43 42L48 54M57 42L52 54M50 43V54" stroke="#fff" stroke-width="2"/>` +
    `<circle cx="76" cy="62" r="12" fill="#ff9f1a"/><path d="M64 62H88M76 50V74M68 53Q74 62 68 71M84 53Q78 62 84 71" stroke-width="2.5"/>`,
  테니스장:
    `<rect x="4" y="4" width="92" height="92" fill="#43b04a" stroke="none"/>` +
    `<path d="M24 20H76L92 92H8Z" fill="#3b8fe0"/>` +
    `<path d="M24 20H76L92 92H8ZM30 20L20 92M70 20L80 92M27 44H73M50 44V70M16 70H84" stroke="#fff" stroke-width="2.5"/>` +
    `<rect x="10" y="50" width="80" height="12" fill="#fff" stroke="none" opacity=".6"/>` +
    `<path d="M10 50H90" stroke-width="3.5"/><path d="M10 62H90" stroke-width="2"/>` +
    [16, 24, 32, 40, 48, 56, 64, 72, 80].map((x) => `<path d="M${x} 50V62" stroke-width="1.5"/>`).join('') +
    `<path d="M10 46V64M90 46V64" stroke-width="4"/>` +
    `<g transform="translate(70 80) rotate(35)">` +
    tube('M0 0V14', '#e8553d', 4) +
    `<ellipse cx="0" cy="-12" rx="10" ry="13" fill="#fff" stroke-width="4"/>` +
    `<path d="M-6 -22V-2M0 -24V0M6 -22V-2M-9 -16H9M-10 -10H10M-8 -4H8" stroke="#9aa6c4" stroke-width="1.5"/>` +
    `</g>` +
    `<circle cx="36" cy="32" r="6" fill="#e8f542"/><path d="M31 29Q36 32 34 37" stroke="#fff" stroke-width="2"/>`,
  골프장:
    `<rect x="4" y="4" width="92" height="42" fill="#bfe6ff" stroke="none"/>` +
    `<path d="M4 48C24 40 40 42 56 46S84 44 96 40V96H4Z" fill="#43b04a"/>` +
    `<ellipse cx="54" cy="72" rx="36" ry="16" fill="#8fd67a"/>` +
    `<ellipse cx="18" cy="56" rx="10" ry="4" fill="#f2d7a6"/>` +
    `<ellipse cx="62" cy="74" rx="6" ry="2.5" fill="${INK}"/>` +
    `<path d="M62 74V16" stroke-width="3"/><path d="M62 16L84 24L62 32Z" fill="#e8553d"/>` +
    `<circle cx="36" cy="80" r="5" fill="#fff"/>` +
    `<path d="M40 76L56 74" stroke="#9aa6c4" stroke-width="2" stroke-dasharray="3 3"/>` +
    tube('M16 90L30 58', '#8a96b0', 3) +
    `<path d="M12 86C16 86 22 90 20 94H8C6 90 8 86 12 86Z" fill="#8a96b0"/>`,
};
