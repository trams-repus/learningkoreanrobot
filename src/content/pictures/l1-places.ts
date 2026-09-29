// 탈것·장소·직업 그림 묶음 (1단계). 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, blob, sparkle, tube, person, cheeks } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, '#dfe8f5');

/** 옆모습 승용차 (자동차·택시·경찰차). extra는 차체 위 무늬 */
const car = (body: string, extra = '') =>
  `<path d="M8 66V56C8 50 12 47 20 46L32 31C35 27 40 25 46 25H62C68 25 72 27 75 31L86 46C92 47 94 51 94 57V66Z" fill="${body}"/>` +
  extra +
  `<path d="M36 45L44 32H55V45Z" fill="#8fd3ff"/><path d="M61 45V32H70L78 45Z" fill="#8fd3ff"/>` +
  `<rect x="86" y="48" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
  wheel(28, 68, 11) +
  wheel(74, 68, 11);

/** 5각 별 (가운데 x,y, 바깥 반지름 r) */
const star = (x: number, y: number, r: number, fill: string, sw = 2) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    pts.push(`${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
};

/** 빨간 십자 (가운데 x,y, 팔 길이 반 l, 굵기 반 w) */
const cross = (x: number, y: number, l: number, w: number, sw = 3) =>
  `<path d="M${x - w} ${y - l}H${x + w}V${y - w}H${x + l}V${y + w}H${x + w}V${y + l}H${x - w}V${y + w}H${x - l}V${y - w}H${x - w}Z" fill="#e8553d" stroke-width="${sw}"/>`;

export const PICS: Record<string, string> = {
  // ── 탈것 ──
  자동차: car('#3b78e6', `<path d="M58 47V62" stroke-width="2.5"/>`),
  버스:
    `<rect x="8" y="20" width="84" height="54" rx="9" fill="#ffd23f"/>` +
    [14, 31, 48, 65]
      .map((x) => `<rect x="${x}" y="28" width="13" height="16" rx="2" fill="#8fd3ff"/>`)
      .join('') +
    `<path d="M82 28H86C88 28 89 30 89 32V44H82Z" fill="#8fd3ff"/>` +
    `<rect x="9.5" y="52" width="81" height="6" fill="#ff9f1a" stroke="none"/>` +
    `<rect x="84" y="62" width="6" height="5" rx="2" fill="#fff" stroke-width="2"/>` +
    wheel(28, 74, 10) +
    wheel(72, 74, 10),
  기차:
    blob('#dfe8f5', [
      [64, 26, 6],
      [74, 18, 8],
      [86, 15, 6],
    ]) +
    `<path d="M60 44V32H70V44Z" fill="#4a4f66"/><rect x="57" y="29" width="16" height="5" rx="1.5" fill="#4a4f66"/>` +
    `<rect x="36" y="44" width="50" height="28" rx="6" fill="#3b78e6"/><path d="M48 44a6 6 0 0 1 12 0Z" fill="#ffd23f"/>` +
    `<path d="M74 45V71" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M82 72H90L94 84H82Z" fill="#e8553d"/>` +
    `<rect x="10" y="32" width="30" height="40" fill="#e8553d"/><rect x="6" y="26" width="38" height="8" rx="3" fill="#4a4f66"/>` +
    `<rect x="16" y="38" width="18" height="14" rx="2" fill="#8fd3ff"/>` +
    `<path d="M4 90H96" stroke-width="4"/>` +
    wheel(24, 78, 10) +
    wheel(50, 80, 8) +
    wheel(70, 80, 8),
  비행기:
    blob('#fff', [
      [72, 20, 6],
      [80, 16, 7],
      [88, 20, 5],
    ]) +
    blob('#fff', [
      [70, 82, 6],
      [78, 78, 7],
      [86, 82, 6],
    ]) +
    `<path d="M44 40L56 40L48 22H40Z" fill="#2a6fc4"/>` +
    `<path d="M14 42L8 20H20L32 40Z" fill="#3b78e6"/>` +
    `<path d="M12 46C12 41 16 38 22 38H78C88 38 94 44 94 50C94 56 88 60 78 60H22C16 60 12 57 12 52Z" fill="#fff"/>` +
    `<path d="M80 40C86 41 90 45 91 49H80Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    [30, 40, 50, 60, 70].map((x) => `<circle cx="${x}" cy="48" r="3" fill="#8fd3ff" stroke-width="2"/>`).join('') +
    `<path d="M38 55L58 55L46 84H34Z" fill="#3b78e6"/>`,
  트럭:
    `<rect x="6" y="62" width="62" height="10" fill="#8a96b0"/>` +
    `<rect x="10" y="40" width="26" height="22" fill="#c98b4f"/><rect x="38" y="40" width="26" height="22" fill="#d9a066"/><rect x="22" y="18" width="26" height="22" fill="#d9a066"/>` +
    `<path d="M23 42V60M51 42V60M35 20V38" stroke="#f5e3b8" stroke-width="4"/>` +
    `<path d="M66 72V38C66 34 68 32 72 32H82C86 32 88 34 90 38L94 52V72Z" fill="#43b04a"/>` +
    `<path d="M72 38H82L86 50H72Z" fill="#8fd3ff"/>` +
    wheel(24, 76, 10) +
    wheel(78, 76, 10),
  택시: car(
    '#ffd23f',
    `<rect x="44" y="14" width="20" height="11" rx="3" fill="#ff9f1a"/>` +
      `<rect x="11" y="53" width="80" height="7" fill="#fff" stroke-width="2"/>` +
      [11, 23, 35, 47, 59, 71, 83].map((x) => `<rect x="${x}" y="53" width="6" height="7" fill="${INK}" stroke="none"/>`).join(''),
  ),
  오토바이:
    wheel(22, 70, 15) +
    wheel(78, 70, 15) +
    tube('M78 70L68 34', '#8a96b0', 4) +
    `<path d="M24 60L36 46H62L72 56L58 66H34Z" fill="#e8553d"/>` +
    `<rect x="38" y="58" width="18" height="14" rx="2" fill="#8a96b0"/>` +
    `<path d="M26 46C28 38 46 38 50 46Z" fill="#4a4f66"/>` +
    tube('M60 32H74', '#4a4f66', 4) +
    `<circle cx="78" cy="44" r="6" fill="#ffd23f"/>`,
  로켓:
    sparkle(18, 22, 7) +
    sparkle(82, 30, 6) +
    sparkle(16, 58, 5) +
    sparkle(86, 64, 6) +
    `<path d="M40 76C40 86 46 88 50 94C54 88 60 86 60 76Z" fill="#ff9f1a"/><path d="M45 77C45 83 48 85 50 89C52 85 55 83 55 77Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M36 52L22 70V82L36 74Z" fill="#e8553d"/><path d="M64 52L78 70V82L64 74Z" fill="#e8553d"/>` +
    `<rect x="40" y="72" width="20" height="6" fill="#8a96b0"/>` +
    `<path d="M50 6C62 16 66 32 66 52V74H34V52C34 32 38 16 50 6Z" fill="#fff"/>` +
    `<path d="M50 6C57 12 61 19 63 26H37C39 19 43 12 50 6Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="44" r="9" fill="#8fd3ff" stroke-width="4"/>` +
    `<path d="M50 60V74" stroke-width="4"/>`,
  헬리콥터:
    `<path d="M62 50H88V58H62Z" fill="#e8553d"/>` +
    `<path d="M90 42V66" stroke-width="4"/><circle cx="90" cy="54" r="4" fill="#ffd23f"/>` +
    `<path d="M26 76V86M56 76V86" stroke-width="4"/><path d="M14 82C14 86 16 86 20 86H68" stroke-width="5"/>` +
    `<ellipse cx="42" cy="56" rx="28" ry="20" fill="#e8553d"/>` +
    `<path d="M15 52C17 43 26 37 36 36V56H15Z" fill="#8fd3ff" stroke-width="3"/>` +
    `<path d="M42 36V26" stroke-width="5"/><path d="M8 24H80" stroke-width="6"/><rect x="36" y="20" width="12" height="8" rx="3" fill="#4a4f66"/>`,
  킥보드:
    tube('M76 80L64 20', '#3b8fe0', 6) +
    tube('M52 20H74', '#4a4f66', 5) +
    `<rect x="16" y="70" width="60" height="10" rx="5" fill="#3b8fe0"/>` +
    `<path d="M14 76C14 70 20 66 26 68" stroke-width="4"/>` +
    wheel(24, 84, 8) +
    wheel(78, 84, 8),
  보트:
    `<path d="M0 70q8-6 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#3b8fe0"/>` +
    person(50, 58, 0.85, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    tube('M42 54L10 80', '#9a5b2e', 3) +
    tube('M58 54L90 80', '#9a5b2e', 3) +
    `<ellipse cx="12" cy="79" rx="7" ry="4" fill="#9a5b2e" transform="rotate(-38 12 79)"/>` +
    `<ellipse cx="88" cy="79" rx="7" ry="4" fill="#9a5b2e" transform="rotate(38 88 79)"/>` +
    `<path d="M12 54H88L78 76H22Z" fill="#e8862e"/><path d="M17 64H83" stroke-width="2.5"/>` +
    `<path d="M0 86q8-6 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#2a6fc4"/>`,
  소방차:
    `<rect x="6" y="40" width="62" height="34" rx="3" fill="#e8553d"/>` +
    `<path d="M66 74V36C66 32 68 30 72 30H80C84 30 86 32 88 36L94 50V74Z" fill="#e8553d"/>` +
    `<path d="M72 36H80L85 48H72Z" fill="#8fd3ff"/>` +
    `<rect x="72" y="22" width="10" height="8" rx="2" fill="#3b8fe0"/>` +
    `<rect x="46" y="32" width="12" height="8" fill="#8a96b0"/>` +
    `<path d="M8 30L64 20V30L8 40Z" fill="#fff"/>` +
    `<path d="M17 28.4V38.4M27 26.6V36.6M37 24.8V34.8M47 23V33M57 21.2V31.2" stroke-width="2.5"/>` +
    `<path d="M9 60H65" stroke="#fff" stroke-width="5"/>` +
    wheel(22, 76, 10) +
    wheel(78, 76, 10),
  경찰차: car(
    '#fff',
    `<path d="M10 54H92V64H10Z" fill="#3b78e6" stroke="none"/>` +
      `<rect x="38" y="15" width="13" height="10" rx="3" fill="#e8553d"/><rect x="51" y="15" width="13" height="10" rx="3" fill="#3b78e6"/>` +
      `<path d="M30 12L35 16M72 12L67 16M28 21H34M74 21H68" stroke="#ffc933" stroke-width="3"/>`,
  ),
  구급차:
    `<rect x="8" y="26" width="58" height="48" rx="4" fill="#fff"/>` +
    `<path d="M64 74V42C64 38 66 36 70 36H78C82 36 85 38 87 42L94 56V74Z" fill="#fff"/>` +
    `<path d="M70 42H79L85 54H70Z" fill="#8fd3ff"/>` +
    `<path d="M11 64H91" stroke="#e8553d" stroke-width="5"/>` +
    cross(37, 45, 13, 5) +
    `<rect x="30" y="17" width="14" height="9" rx="3" fill="#e8553d"/>` +
    wheel(24, 76, 10) +
    wheel(78, 76, 10),
  지하철:
    `<rect x="4" y="26" width="92" height="68" rx="6" fill="#b07a4a"/>` +
    `<rect x="4" y="21" width="92" height="8" rx="3" fill="#5fc24a"/>` +
    `<path d="M14 22L15 10H21L22 22Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [[18, 10, 7]]) +
    `<rect x="68" y="10" width="18" height="12" fill="#ffe7a8"/><path d="M64 12L77 3L90 12Z" fill="#e8553d"/>` +
    `<rect x="8" y="38" width="84" height="50" rx="18" fill="#3a3f55"/>` +
    `<path d="M10 82H90" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M12 80V52C12 48 14 46 18 46H74C84 46 90 56 90 66V80Z" fill="#dfe8f5"/>` +
    [18, 32, 46, 60].map((x) => `<rect x="${x}" y="52" width="10" height="12" rx="2" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<path d="M74 52H79C83 52 86 58 87 64H74Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="13.8" y="69" width="75" height="5" fill="#43b04a" stroke="none"/>`,
  우주선:
    sparkle(14, 16, 6) +
    sparkle(86, 20, 7) +
    sparkle(84, 84, 5) +
    sparkle(16, 82, 5) +
    `<path d="M38 68L26 92H74L62 68Z" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    `<path d="M28 50C28 22 72 22 72 50Z" fill="#8fd3ff"/><path d="M36 38C38 32 42 30 46 29" stroke="#fff" stroke-width="3"/>` +
    `<ellipse cx="50" cy="56" rx="44" ry="14" fill="#a45cf0"/>` +
    `<path d="M10 52C24 46 76 46 90 52" stroke-width="2.5"/>` +
    [
      [20, '#ffd23f'],
      [35, '#5fc24a'],
      [50, '#ff5c70'],
      [65, '#5fc24a'],
      [80, '#ffd23f'],
    ]
      .map(([x, c]) => `<circle cx="${x}" cy="59" r="4" fill="${c}" stroke-width="2"/>`)
      .join(''),
  잠수함:
    `<circle cx="16" cy="30" r="4" fill="#bfe6ff" stroke-width="2.5"/><circle cx="24" cy="18" r="5" fill="#bfe6ff" stroke-width="2.5"/><circle cx="14" cy="44" r="3" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M62 30V14H72" stroke-width="5"/>` +
    `<path d="M42 46V30C42 27 44 26 47 26H63C66 26 68 27 68 30V46Z" fill="#ffd23f"/>` +
    `<ellipse cx="11" cy="54" rx="3" ry="7" fill="#ff9f1a"/><ellipse cx="11" cy="70" rx="3" ry="7" fill="#ff9f1a"/><path d="M11 62H18"/>` +
    `<ellipse cx="56" cy="62" rx="38" ry="20" fill="#ffd23f"/>` +
    [42, 58, 74].map((x) => `<circle cx="${x}" cy="62" r="6" fill="#8fd3ff"/>`).join(''),

  // ── 장소 ──
  병원:
    `<rect x="10" y="18" width="80" height="8" rx="2" fill="#7ec8f0"/>` +
    `<rect x="14" y="26" width="72" height="64" fill="#fff"/>` +
    cross(50, 46, 16, 6, 3.5) +
    [
      [19, 33],
      [71, 33],
      [19, 53],
      [71, 53],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="10" fill="#8fd3ff" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M40 90V72H60V90Z" fill="#8fd3ff"/><path d="M50 72V90" stroke-width="2.5"/>` +
    `<path d="M6 90H94"/>`,
  공원:
    `<path d="M4 72C24 66 76 66 96 72V92H4Z" fill="#8fd67a"/>` +
    `<path d="M25 82L27 46H33L35 82Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [30, 30, 16],
      [19, 42, 10],
      [41, 42, 10],
    ]) +
    `<path d="M58 50V72M86 50V72M58 73V86M86 73V86" stroke-width="4"/>` +
    `<rect x="54" y="50" width="36" height="6" rx="2" fill="#e8862e"/><rect x="54" y="58" width="36" height="6" rx="2" fill="#e8862e"/>` +
    `<rect x="52" y="68" width="40" height="7" rx="2" fill="#e8862e"/>` +
    `<circle cx="46" cy="84" r="3.5" fill="#ff9aa8" stroke-width="2"/><circle cx="14" cy="86" r="3.5" fill="#ffd23f" stroke-width="2"/>`,
  놀이터:
    `<rect x="4" y="84" width="92" height="10" rx="4" fill="#f2d58a"/>` +
    tube('M8 86L14 22H40L46 86', '#e8553d', 4) +
    `<path d="M21 24V62M33 24V62" stroke-width="2.5"/>` +
    `<rect x="16" y="60" width="22" height="7" rx="2" fill="#ffd23f"/>` +
    `<path d="M54 86V30M64 86V30" stroke-width="4"/><path d="M54 42H64M54 54H64M54 66H64M54 78H64" stroke-width="3"/>` +
    tube('M66 32C80 34 80 76 94 80', '#43b04a', 8) +
    `<rect x="52" y="26" width="18" height="7" rx="2" fill="#3b78e6"/>`,
  도서관:
    `<path d="M8 34L50 10L92 34Z" fill="#3b78e6"/>` +
    `<rect x="12" y="34" width="76" height="54" fill="#fff4d0"/>` +
    `<rect x="18" y="40" width="64" height="42" rx="3" fill="#fff"/>` +
    [
      [21, 44, '#e8553d'],
      [28, 46, '#3b78e6'],
      [35, 43, '#ffd23f'],
      [42, 47, '#43b04a'],
      [53, 44, '#8e4fc9'],
      [60, 46, '#ff9f1a'],
      [67, 43, '#3b78e6'],
      [74, 47, '#e85d9a'],
      [21, 67, '#43b04a'],
      [28, 65, '#ff9f1a'],
      [35, 68, '#e85d9a'],
      [45, 66, '#3b78e6'],
      [52, 65, '#e8553d'],
      [59, 68, '#ffd23f'],
      [66, 66, '#8e4fc9'],
      [73, 65, '#43b04a'],
    ]
      .map(([x, y, c]) => {
        const bottom = (y as number) < 60 ? 61 : 82;
        return `<rect x="${x}" y="${y}" width="7" height="${bottom - (y as number)}" fill="${c}" stroke-width="2.5"/>`;
      })
      .join('') +
    `<path d="M18 61H82" stroke-width="3.5"/>` +
    `<rect x="18" y="40" width="64" height="42" rx="3"/>` +
    `<rect x="8" y="88" width="84" height="5" rx="2" fill="#dfe8f5"/>`,
  경찰서:
    `<rect x="39" y="14" width="11" height="10" rx="3" fill="#e8553d"/><rect x="50" y="14" width="11" height="10" rx="3" fill="#3b78e6"/>` +
    `<rect x="8" y="24" width="84" height="10" rx="2" fill="#3b78e6"/>` +
    `<rect x="12" y="34" width="76" height="56" fill="#fff"/>` +
    `<rect x="18" y="42" width="12" height="12" fill="#8fd3ff" stroke-width="2.5"/><rect x="70" y="42" width="12" height="12" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M50 38L66 44V54C66 63 58 68 50 72C42 68 34 63 34 54V44Z" fill="#ffc933"/>` +
    star(50, 54, 10, '#3b78e6') +
    `<path d="M42 90V76H58V90Z" fill="#3b78e6"/>` +
    `<path d="M6 90H94"/>`,
  소방서:
    `<rect x="46" y="8" width="18" height="18" fill="#e8553d"/><path d="M42 10L55 2L68 10Z" fill="#6b3e26"/>` +
    `<rect x="8" y="26" width="84" height="64" fill="#e8553d"/>` +
    `<rect x="4" y="22" width="92" height="8" rx="2" fill="#6b3e26"/>` +
    `<path d="M20 90V52C20 44 26 40 34 40H66C74 40 80 44 80 52V90Z" fill="#4a4f66"/>` +
    `<rect x="30" y="52" width="40" height="38" rx="4" fill="#ff5c70"/>` +
    `<rect x="45" y="46" width="10" height="6" rx="2" fill="#3b8fe0"/>` +
    `<rect x="34" y="57" width="32" height="12" rx="2" fill="#8fd3ff"/>` +
    `<path d="M40 76H60M40 81H60" stroke-width="2.5"/>` +
    dot(36, 79, 3.5, '#ffd23f') +
    dot(64, 79, 3.5, '#ffd23f') +
    `<path d="M4 90H96"/>`,
  동물원:
    `<ellipse cx="33" cy="64" rx="15" ry="10" fill="#ffd23f"/>` +
    `<path d="M22 64L20 22L30 20L34 60Z" fill="#ffd23f"/>` +
    `<path d="M20 12V8M27 11V7" stroke-width="3"/>` +
    `<ellipse cx="24" cy="17" rx="10" ry="7" fill="#ffd23f"/>` +
    dot(26, 15, 2.2) +
    [
      [25, 32],
      [27, 44],
      [24, 52],
      [30, 64],
      [40, 60],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#e8862e" stroke="none"/>`)
      .join('') +
    `<ellipse cx="74" cy="62" rx="20" ry="16" fill="#a9b4c9"/>` +
    tube('M52 54C46 60 46 70 50 74', '#a9b4c9', 7) +
    `<circle cx="58" cy="50" r="12" fill="#a9b4c9"/>` +
    `<ellipse cx="66" cy="50" rx="8" ry="11" fill="#c3cbdb"/>` +
    dot(54, 47, 2.2) +
    `<path d="M4 72H96M4 84H96" stroke-width="3"/>` +
    [6, 17, 28, 39, 50, 61, 72, 83]
      .map((x) => `<rect x="${x}" y="66" width="7" height="26" rx="2" fill="#c98b4f" stroke-width="2.5"/>`)
      .join(''),
  수영장:
    `<rect x="6" y="18" width="88" height="74" rx="8" fill="#dfe8f5"/>` +
    `<rect x="14" y="28" width="72" height="56" rx="4" fill="#4aa8f0"/>` +
    `<path d="M20 44q5-4 10 0t10 0M44 76q5-4 10 0t10 0" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="34" cy="62" r="11" fill="#ff5c70"/><circle cx="34" cy="62" r="4.5" fill="#4aa8f0"/>` +
    `<path d="M24 58L28 60M44 58L40 60M26 70L29 67M42 70L39 67" stroke="#fff" stroke-width="3"/>` +
    `<path d="M64 36H78M64 46H78" stroke="#8a96b0" stroke-width="3"/>` +
    tube('M64 50V22Q64 14 56 14', '#dfe8f5', 3) +
    tube('M78 50V22Q78 14 70 14', '#dfe8f5', 3),
  빵집:
    `<rect x="10" y="30" width="80" height="60" fill="#ffe7a8"/>` +
    `<path d="M6 18H94L90 34H10Z" fill="#c98b4f"/><path d="M22 19L20 33M38 19L37 33M54 19V33M70 19L71 33M84 19L85 33" stroke="#fff4d0" stroke-width="5"/>` +
    `<path d="M10 34q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0q5 6 10 0" fill="#c98b4f"/>` +
    `<rect x="14" y="44" width="72" height="42" rx="3" fill="#fff"/>` +
    `<path d="M14 76H86" stroke-width="3"/>` +
    `<ellipse cx="28" cy="66" rx="11" ry="9" fill="#d98a3c"/><path d="M22 62L26 66M28 60L32 64" stroke="#fff4d0" stroke-width="2.5"/>` +
    `<path d="M40 72C38 56 62 56 60 72C57 68 54 66 50 66S43 68 40 72Z" fill="#f2b04a"/><path d="M46 60L47 67M54 60L53 67" stroke-width="2.5"/>` +
    `<rect x="62" y="60" width="24" height="10" rx="5" fill="#e8a85c" transform="rotate(-24 74 65)"/>` +
    `<path d="M68 66L71 62M74 63L77 59M80 60L82 57" stroke="#fff4d0" stroke-width="2.5"/>` +
    `<path d="M6 90H94"/>`,
  식당:
    `<path d="M4 40L18 18H82L96 40Z" fill="#e8862e"/>` +
    `<rect x="10" y="40" width="80" height="50" fill="#fff4d0"/>` +
    `<circle cx="50" cy="64" r="18" fill="#fff"/><circle cx="50" cy="64" r="11" fill="#fff" stroke="#9fb3d9" stroke-width="2.5"/>` +
    `<circle cx="46" cy="62" r="5" fill="#e8553d" stroke-width="2"/><circle cx="54" cy="66" r="4.5" fill="#43b04a" stroke-width="2"/><circle cx="52" cy="58" r="3.5" fill="#ffd23f" stroke-width="2"/>` +
    tube('M24 70V56', '#dfe8f5', 3) +
    `<ellipse cx="24" cy="50" rx="6" ry="8" fill="#dfe8f5"/>` +
    tube('M73 46L75 82', '#c98b4f', 2.5) +
    tube('M79 46L77 82', '#c98b4f', 2.5) +
    `<path d="M6 90H94"/>`,
  바닷가:
    `<circle cx="80" cy="16" r="9" fill="#ffd23f"/>` +
    `<path d="M4 30H96V56H4Z" fill="#3b8fe0"/>` +
    `<path d="M4 52q7.7-6 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0V94H4Z" fill="#f2d58a"/>` +
    `<path d="M4 52q7.7-6 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0" stroke="#fff" stroke-width="5"/>` +
    `<path d="M4 52q7.7-6 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0" stroke-width="2.5"/>` +
    `<path d="M34 86L20 72C22 62 46 62 48 72Z" fill="#ff9aa8"/><path d="M34 86L27 66M34 86V64M34 86L41 66" stroke-width="2.5"/>` +
    star(70, 76, 14, '#ff9f1a', 3.5),
  성:
    `<rect x="28" y="44" width="44" height="46" fill="#fff4d0"/>` +
    `<path d="M28 44V38H34V44H40V38H46V44H54V38H60V44H66V38H72V44" fill="#fff4d0"/>` +
    `<rect x="10" y="36" width="20" height="54" fill="#ffe0ea"/><rect x="70" y="36" width="20" height="54" fill="#ffe0ea"/>` +
    `<path d="M6 38L20 14L34 38Z" fill="#8e4fc9"/><path d="M66 38L80 14L94 38Z" fill="#8e4fc9"/>` +
    `<path d="M20 14V6M80 14V6" stroke-width="3"/><path d="M20 6H28L25 9L28 12H20Z" fill="#e85d9a" stroke-width="2"/><path d="M80 6H88L85 9L88 12H80Z" fill="#e85d9a" stroke-width="2"/>` +
    `<path d="M16 58V52a4 4 0 0 1 8 0V58Z" fill="#4a4f66" stroke-width="2.5"/><path d="M76 58V52a4 4 0 0 1 8 0V58Z" fill="#4a4f66" stroke-width="2.5"/>` +
    `<path d="M40 90V72a10 10 0 0 1 20 0V90Z" fill="#9a5b2e"/>` +
    `<path d="M4 90H96"/>`,
  등대:
    `<path d="M58 22L94 10V36Z" fill="#ffe680" stroke="none" opacity=".6"/><path d="M42 22L6 10V36Z" fill="#ffe680" stroke="none" opacity=".6"/>` +
    `<path d="M24 88C24 78 34 74 50 74S76 78 76 88Z" fill="#8a96b0"/>` +
    `<path d="M38 80L42 34H58L62 80Z" fill="#fff"/>` +
    `<path d="M41 46H59L60 56H40Z" fill="#e8553d" stroke="none"/><path d="M39.2 66H60.8L61.7 76H38.3Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M38 80L42 34H58L62 80Z"/>` +
    `<path d="M46 80V73a4 4 0 0 1 8 0V80" fill="#9a5b2e"/>` +
    `<rect x="36" y="30" width="28" height="6" rx="2" fill="#e8553d"/>` +
    `<rect x="42" y="18" width="16" height="12" fill="#ffd23f"/>` +
    `<path d="M38 18L50 8L62 18Z" fill="#e8553d"/>` +
    `<path d="M4 86q8-6 16 0t16 0t16 0t16 0t16 0t12 0V94H4Z" fill="#3b8fe0"/>`,
  텐트:
    sparkle(18, 24, 6) +
    sparkle(82, 20, 7) +
    `<rect x="4" y="82" width="92" height="10" rx="4" fill="#8fd67a"/>` +
    `<path d="M50 20V10" stroke-width="3"/><path d="M50 10H61L58 13.5L61 17H50Z" fill="#e8553d" stroke-width="2"/>` +
    `<path d="M10 84L50 20L90 84Z" fill="#ff9f1a"/>` +
    `<path d="M50 38L38 84H62Z" fill="#5a3b24"/>` +
    `<path d="M50 38L38 84H28Z" fill="#ffd23f"/>` +
    `<path d="M10 84L4 90M90 84L96 90" stroke-width="2.5"/>`,
  탑:
    `<rect x="18" y="84" width="64" height="8" rx="1" fill="#a3aabb"/>` +
    `<rect x="32" y="70" width="36" height="14" fill="#c9ccd6"/>` +
    `<path d="M16 66L24 62H76L84 66L80 70H20Z" fill="#8a96b0"/>` +
    `<rect x="35" y="54" width="30" height="8" fill="#c9ccd6"/>` +
    `<path d="M20 50L27 46H73L80 50L76 54H24Z" fill="#8a96b0"/>` +
    `<rect x="38" y="40" width="24" height="6" fill="#c9ccd6"/>` +
    `<path d="M24 36L30 32H70L76 36L72 40H28Z" fill="#8a96b0"/>` +
    `<rect x="41" y="26" width="18" height="6" fill="#c9ccd6"/>` +
    `<path d="M28 22L34 18H66L72 22L68 26H32Z" fill="#8a96b0"/>` +
    `<path d="M50 18V6" stroke-width="4"/><circle cx="50" cy="11" r="3.5" fill="#ffc933" stroke-width="2.5"/>`,
  모래성:
    `<path d="M50 30V10" stroke-width="3"/><path d="M50 10H64L60 14L64 18H50Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M40 86V30H44V34H48V30H52V34H56V30H60V86Z" fill="#f2d58a"/>` +
    `<path d="M14 86V48H18V52H22V48H26V52H30V48H34V86Z" fill="#f2d58a"/>` +
    `<path d="M66 86V48H70V52H74V48H78V52H82V48H86V86Z" fill="#f2d58a"/>` +
    `<rect x="34" y="62" width="6" height="24" fill="#f2d58a"/><rect x="60" y="62" width="6" height="24" fill="#f2d58a"/>` +
    `<path d="M44 86V76a6 6 0 0 1 12 0V86Z" fill="#c99a52"/>` +
    `<path d="M20 64V60a4 4 0 0 1 4 -4a4 4 0 0 1 4 4V64Z" fill="#c99a52" stroke-width="2.5"/><path d="M72 64V60a4 4 0 0 1 4 -4a4 4 0 0 1 4 4V64Z" fill="#c99a52" stroke-width="2.5"/>` +
    `<path d="M4 94C8 84 92 84 96 94Z" fill="#e8c77a"/>` +
    `<circle cx="50" cy="48" r="3.5" fill="#ff9aa8" stroke-width="2"/>`,

  // ── 사람·직업 ──
  의사:
    person(50, 96, 1.7, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M43 63L50 78L57 63Z" fill="#7ec8f0" stroke-width="2.5"/><path d="M50 78V96" stroke-width="2.5"/>` +
    `<path d="M32 26C38 20 62 20 68 26" stroke-width="3"/><circle cx="50" cy="22" r="6" fill="#dfe8f5" stroke-width="3"/>` +
    tube('M39 65C37 78 42 84 48 84', '#5a6378', 2.5) +
    tube('M61 65C63 74 62 80 60 84', '#5a6378', 2.5) +
    `<circle cx="60" cy="86" r="5" fill="#dfe8f5" stroke-width="3"/>` +
    `<circle cx="48" cy="84" r="2" fill="#5a6378" stroke="none"/>`,
  경찰:
    person(50, 96, 1.7, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M48 63H52L53.5 76L50 80L46.5 76Z" fill="#26356b" stroke-width="2"/>` +
    `<path d="M26 26C24 14 76 14 74 26L70 32H30Z" fill="#26356b"/>` +
    `<rect x="30" y="29" width="40" height="6" fill="#1d2340"/>` +
    `<path d="M32 35C38 41 62 41 68 35Z" fill="#1d2340"/>` +
    star(50, 23, 6, '#ffc933') +
    star(64, 78, 6, '#ffc933'),
  소방관:
    `<path d="M74 58Q84 34 94 38" stroke="#4aa8f0" stroke-width="5"/>` +
    `<path d="M80 26q-2 4 0 5q2-1 0-5M88 24q-2 4 0 5q2-1 0-5" fill="#4aa8f0" stroke-width="2"/>` +
    person(42, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#e8862e' }) +
    `<path d="M20 84H64M19 90H65" stroke="#ffd23f" stroke-width="4"/>` +
    tube('M96 92C82 92 70 88 70 70', '#ffd23f', 6) +
    `<path d="M66 70L70 56L76 58L74 72Z" fill="#4a4f66"/>` +
    `<circle cx="68" cy="72" r="5" fill="${SKIN}"/>` +
    `<path d="M16 44C22 38 62 38 70 44L68 48C60 44 24 44 16 48Z" fill="#e8553d"/>` +
    `<path d="M22 42C22 18 62 18 62 42Z" fill="#e8553d"/>` +
    `<path d="M37 18H47V28L42 32L37 28Z" fill="#ffc933" stroke-width="2.5"/>`,
  요리사:
    blob('#fff', [
      [40, 25, 8],
      [50, 20, 9],
      [60, 25, 8],
    ]) +
    person(50, 96, 1.3, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<rect x="36" y="28" width="28" height="11" rx="2" fill="#fff"/>` +
    `<path d="M43 70H57L50 79Z" fill="#e8553d" stroke-width="2.5"/>` +
    dot(44, 84, 2) +
    dot(56, 84, 2) +
    dot(44, 91, 2) +
    dot(56, 91, 2),
  선생님:
    `<rect x="6" y="10" width="60" height="42" rx="3" fill="#2f6a4a" stroke="#9a5b2e" stroke-width="5"/>` +
    `<circle cx="22" cy="33" r="8" fill="#e8553d" stroke="#fff" stroke-width="2.5"/><path d="M22 25Q24 19 29 19Q27 24 22 25Z" fill="#5fc24a" stroke="#fff" stroke-width="2"/>` +
    star(44, 30, 10, '#ffd23f', 2) +
    `<path d="M4 56H68" stroke="#9a5b2e" stroke-width="4"/>` +
    person(74, 96, 1.35, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a', glasses: true }) +
    `<path d="M56 66L42 40" stroke="#9a5b2e" stroke-width="3.5"/>` +
    tube('M62 82L57 68', '#e85d9a', 5) +
    `<circle cx="56" cy="66" r="4.5" fill="${SKIN}"/>`,
  아이:
    sparkle(12, 20, 6) +
    sparkle(88, 20, 6) +
    tube('M36 72L22 50', '#ffd23f', 7) +
    tube('M64 72L78 50', '#ffd23f', 7) +
    `<circle cx="20" cy="46" r="6" fill="${SKIN}"/><circle cx="80" cy="46" r="6" fill="${SKIN}"/>` +
    person(50, 96, 1.55, { hair: '#2f2a26', style: 'pony', shirt: '#ffd23f' }) +
    cheeks(50, 12),
  공주:
    sparkle(16, 24, 6) +
    sparkle(84, 30, 6) +
    person(50, 96, 1.65, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    `<path d="M40 22V12L45 17L50 9L55 17L60 12V22Z" fill="#ffc933" stroke-width="2.5"/>` +
    dot(50, 18, 2, '#ff5c70') +
    `<path d="M40 64Q50 72 60 64" stroke="#fff" stroke-width="3"/>`,
  왕:
    `<path d="M12 96L22 64C30 60 70 60 78 64L88 96Z" fill="#e8553d"/>` +
    person(50, 96, 1.65, { hair: '#5a3b24', style: 'short', shirt: '#8e4fc9', beard: '#5a3b24', mustache: true }) +
    blob('#fff', [
      [30, 66, 5],
      [38, 64, 5],
      [62, 64, 5],
      [70, 66, 5],
    ]) +
    `<path d="M32 26V8L41 16L50 5L59 16L68 8V26Z" fill="#ffc933"/>` +
    dot(50, 19, 3, '#e8553d') +
    dot(40, 21, 2.2, '#3b78e6') +
    dot(60, 21, 2.2, '#3b78e6'),
  해적:
    person(50, 96, 1.65, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M29 76H71M27 86H73" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M16 30C22 22 32 26 36 12C44 16 56 16 64 12C68 26 78 22 84 30C70 36 30 36 16 30Z" fill="#2f2a26"/>` +
    `<path d="M24 30Q50 36 76 30" stroke="#ffc933" stroke-width="2.5"/>` +
    `<path d="M31 36Q46 40 68 44" stroke-width="2.5"/>` +
    `<ellipse cx="57.4" cy="43.4" rx="5.5" ry="5" fill="#2f2a26"/>`,
  우주인:
    sparkle(12, 14, 6) +
    sparkle(88, 18, 7) +
    sparkle(90, 56, 5) +
    sparkle(10, 60, 5) +
    `<rect x="24" y="50" width="52" height="30" rx="6" fill="#dfe8f5"/>` +
    `<path d="M20 96C20 72 32 60 50 60S80 72 80 96Z" fill="#fff"/>` +
    `<rect x="40" y="70" width="20" height="14" rx="2" fill="#dfe8f5"/>` +
    dot(45, 77, 2.5, '#e8553d') +
    dot(55, 77, 2.5, '#3b78e6') +
    `<circle cx="50" cy="36" r="24" fill="#fff"/>` +
    `<circle cx="50" cy="38" r="17" fill="#8fd3ff"/>` +
    `<circle cx="50" cy="40" r="11" fill="${SKIN}" stroke-width="2.5"/>` +
    dot(46, 39, 1.8) +
    dot(54, 39, 1.8) +
    `<path d="M46 44q4 3 8 0" stroke-width="2"/>` +
    `<path d="M38 28C40 25 43 23 46 22" stroke="#fff" stroke-width="3"/>`,
  농부:
    tube('M80 18V70', '#9a5b2e', 4) +
    `<path d="M74 18H86" stroke-width="6"/>` +
    `<path d="M72 70H88V82C88 88 84 91 80 93C76 91 72 88 72 82Z" fill="#8a96b0"/>` +
    person(44, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
    `<path d="M34 96V74H54V96" fill="#3b78e6"/><path d="M36 74L32 66M52 74L56 66" stroke="#3b78e6" stroke-width="4"/>` +
    dot(37, 78, 1.8, '#ffd23f') +
    dot(51, 78, 1.8, '#ffd23f') +
    `<ellipse cx="44" cy="28" rx="28" ry="6" fill="#f2c14e"/>` +
    `<path d="M31 28C31 10 57 10 57 28Z" fill="#f2c14e"/>` +
    `<path d="M32 22C40 25 48 25 56 22" stroke="#e8553d" stroke-width="4"/>`,
  간호사:
    person(50, 96, 1.7, { hair: '#6b3e26', style: 'long', shirt: '#ff9aa8' }) +
    `<path d="M42 63L50 72L58 63" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M31 28L34 8H66L69 28Z" fill="#fff"/>` +
    cross(50, 18, 7, 2.8, 2),
  광대:
    blob('#ff9f1a', [
      [28, 36, 8],
      [27, 48, 7],
      [72, 36, 8],
      [73, 48, 7],
    ]) +
    person(50, 96, 1.65, { hair: '#ff9f1a', style: 'bald', shirt: '#43b04a' }) +
    [
      [36, 80, '#ffd23f'],
      [50, 88, '#ff5c70'],
      [63, 78, '#ffd23f'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke-width="2"/>`)
      .join('') +
    blob('#fff', [
      [36, 65, 5],
      [44, 67, 5],
      [50, 68, 5],
      [56, 67, 5],
      [64, 65, 5],
    ]) +
    `<path d="M36 25L50 8L64 25Z" fill="#8e4fc9"/>` +
    dot(46, 20, 2, '#ffd23f') +
    dot(54, 17, 2, '#ffd23f') +
    `<circle cx="50" cy="8" r="4" fill="#ff5c70" stroke-width="2.5"/>` +
    `<path d="M40 53Q50 62 60 53" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="50" cy="47" r="5.5" fill="#e8403a" stroke-width="2.5"/>`,
  마술사:
    sparkle(88, 40, 6) +
    sparkle(78, 30, 4) +
    sparkle(92, 58, 4) +
    `<path d="M16 96L24 64H68L76 96Z" fill="#2f2a26"/>` +
    person(46, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#8e4fc9', mustache: true }) +
    `<path d="M39 64L46 67L53 64V71L46 67L39 71Z" fill="#e8553d" stroke-width="2"/>` +
    `<rect x="24" y="24" width="44" height="6" rx="3" fill="#2f2a26"/>` +
    `<rect x="32" y="6" width="28" height="19" fill="#2f2a26"/>` +
    `<rect x="33.8" y="17" width="24.4" height="5" fill="#e8553d" stroke="none"/>` +
    `<path d="M68 82L84 58" stroke-width="7"/><path d="M81 62.5L84 58" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="68" cy="82" r="5" fill="${SKIN}"/>`,
};
