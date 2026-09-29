// 음식 그림 묶음 (2단계 어휘: 밥·국·찌개·면·빵·간식·마실 것). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리는 그릇과 색, 건더기로 구별한다:
//   찌개: 김치찌개(노란 양은냄비·빨간 국물·김치) / 된장찌개(갈색 뚝배기·두부·호박) / 부대찌개(넓은 은색 냄비·소시지·햄·라면·치즈)
//   국·탕: 된장국(흰 그릇·갈색 국물) / 갈비탕(놋그릇·뼈 붙은 갈비) / 삼계탕(검은 뚝배기·통닭) / 만둣국(만두 셋) / 떡만둣국(만두+떡)
//   면: 냉면(은색 그릇·얼음·달걀) / 콩국수(청자색 그릇·흰 콩물·오이) / 칼국수(넓은 면·조개) / 수제비(뜯은 반죽) / 짬뽕(빨간 국물·해물)
//       볶음면(젓가락으로 드는 가는 면) / 볶음우동(검은 팬·굵은 면) / 잡채(색색 채소 줄)
//   전: 부침개(노란 동그라미·부추) / 파전(긴 파 줄기) / 김치전(주황 빨강) / 동그랑땡(작고 동그란 여러 개)
//   빵: 크림빵(흰 크림 샌드) / 단팥빵(자른 면의 팥) / 소보로빵(울퉁불퉁 곰보) / 머핀(넘치는 갈색 머리) / 컵케이크(흰 크림 꼬깔)
//   핫케이크(두툼한 두 장+버터) / 팬케이크(얇게 높이 쌓고 딸기·크림)
//   달걀: 오믈렛(반달로 접힘) / 오므라이스(케첩 지그재그·안의 주황 밥)
//   마실 것: 코코아(머그·마시멜로) / 녹차(손잡이 없는 찻잔·초록·찻잎) / 보리차(유리컵·호박색·보리알) / 식혜(놋그릇·밥알·얼음)
import { INK, HL, dot, blob, sparkle, tube } from '../pictureKit.ts';

const f = (n: number) => Number(n.toFixed(1));

/** 그릇 (조금 내려다본 모양): 국물 면(soup) + 건더기(inner) + 앞쪽 몸통 + 굽. ry가 크면 속이 더 보인다 */
function bowl(cy: number, soup: string, body: string, inner = '', band = '', ry = 13): string {
  const k = f(ry * 0.55);
  return (
    `<path d="M38 ${cy + 36}L36 ${cy + 44}H64L62 ${cy + 36}" fill="${body}"/>` +
    `<ellipse cx="50" cy="${cy}" rx="38" ry="${ry}" fill="${soup}"/>` +
    inner +
    `<path d="M12 ${cy}C12 ${cy + 26} 30 ${cy + 40} 50 ${cy + 40}S88 ${cy + 26} 88 ${cy}C88 ${f(cy + k)} 71 ${cy + ry} 50 ${cy + ry}S12 ${f(cy + k)} 12 ${cy}Z" fill="${body}"/>` +
    (band ? `<path d="M19 ${cy + ry + 8}Q50 ${cy + ry + 18} 81 ${cy + ry + 8}" stroke="${band}" stroke-width="4"/>` : '')
  );
}

/** 뚝배기: 나무 받침 + 두꺼운 테 + 국물 + 둥근 몸통 */
function ttuk(cy: number, soup: string, inner: string, body = '#6b3e26', rim = '#8a5436'): string {
  return (
    `<ellipse cx="50" cy="${cy + 40}" rx="44" ry="7" fill="#d9a066"/>` +
    `<ellipse cx="50" cy="${cy}" rx="39" ry="14" fill="${rim}"/>` +
    `<ellipse cx="50" cy="${cy + 1}" rx="31" ry="10" fill="${soup}"/>` +
    inner +
    `<path d="M11 ${cy}C11 ${cy + 30} 26 ${cy + 40} 50 ${cy + 40}S89 ${cy + 30} 89 ${cy}C89 ${cy + 8} 71 ${cy + 14} 50 ${cy + 14}S11 ${cy + 8} 11 ${cy}Z" fill="${body}"/>` +
    `<path d="M20 ${cy + 20}Q50 ${cy + 30} 80 ${cy + 20}" stroke="${rim}" stroke-width="3"/>`
  );
}

/** 냄비 (곧은 옆면 + 양쪽 손잡이). 양은냄비는 노랑, 전골냄비는 넓고 얕은 은색 */
function pot(cy: number, soup: string, inner: string, body: string, rx = 36, depth = 30, handle = '#e0a800'): string {
  const l = 50 - rx;
  const r = 50 + rx;
  return (
    tube(`M${l} ${cy + 8}H${l - 9}`, handle, 4) +
    tube(`M${r} ${cy + 8}H${r + 9}`, handle, 4) +
    `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="12" fill="${soup}"/>` +
    inner +
    `<path d="M${l} ${cy}V${cy + depth}C${l} ${cy + depth + 9} ${r} ${cy + depth + 9} ${r} ${cy + depth}V${cy}C${r} ${cy + 7} ${r - 16} ${cy + 12} 50 ${cy + 12}S${l} ${cy + 7} ${l} ${cy}Z" fill="${body}"/>`
  );
}

/** 접시 (타원 + 안쪽 테) */
const plate = (cy: number, rx = 44, ry = 15, fill = '#fff', rim = '#dfe8f5') =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 5}" stroke="${rim}" stroke-width="3"/>`;

const steam = (y: number) =>
  `<path d="M36 ${y}c-5-5 5-9 0-15M50 ${y - 2}c-5-5 5-9 0-15M64 ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 테두리 있는 가는 채소 줄 (잡채·냉면 고명) */
const strip = (d: string, c: string) => `<path d="${d}" stroke-width="7"/><path d="${d}" stroke="${c}" stroke-width="4"/>`;

/** 곡식 한 알 (쌀·보리·현미) */
const grain = (x: number, y: number, a: number, fill = '#fff', rx = 3.4, ry = 2.1) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="1.6" transform="rotate(${a} ${x} ${y})"/>`;

/** 두부 조각 */
const tofu = (x: number, y: number, s = 9) =>
  `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="1.5" fill="#fffdf2" stroke-width="2.5"/>`;

/** 반달 호박 */
const zucchini = (x: number, y: number, a = 0) =>
  `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 7} ${y}A7 7 0 0 0 ${x + 7} ${y}Z" fill="#e8f5c8" stroke-width="2.5"/><path d="M${x - 6} ${y + 2}A6 6 0 0 0 ${x + 6} ${y + 2}" stroke="#43b04a" stroke-width="2.5"/></g>`;

/** 송송 썬 파 */
const onion = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3" fill="#7cc242" stroke-width="2"/>`;

/** 만두 (반달, 위에 주름) */
const mandu = (x: number, y: number, a = 0) =>
  `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 14} ${y + 5}C${x - 13} ${y - 12} ${x + 13} ${y - 12} ${x + 14} ${y + 5}C${x + 6} ${y + 9} ${x - 6} ${y + 9} ${x - 14} ${y + 5}Z" fill="#fffaf0"/>` +
  `<path d="M${x - 7} ${y - 5}l2 4M${x} ${y - 7}v4M${x + 7} ${y - 5}l-2 4" stroke="#c9b48a" stroke-width="2.5"/></g>`;

/** 가래떡 한 조각 (어슷 썬 타원) */
const tteok = (x: number, y: number, a = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="10" ry="5.5" fill="#fff" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`;

/** 층층 케이크 한 장 (옆면 + 윗면) */
function layer(y: number, h: number, rx: number, ry: number, side: string, top: string): string {
  return `<path d="M${50 - rx} ${y}V${y + h}A${rx} ${ry} 0 0 0 ${50 + rx} ${y + h}V${y}Z" fill="${side}"/><ellipse cx="50" cy="${y}" rx="${rx}" ry="${ry}" fill="${top}"/>`;
}

/** 타원 안을 가로지르는 줄 (파이 격자) */
function chord(cx: number, cy: number, rx: number, ry: number, px: number, py: number, dx: number, dy: number): string {
  const a = (dx / rx) ** 2 + (dy / ry) ** 2;
  const b = 2 * (((px - cx) * dx) / rx ** 2 + ((py - cy) * dy) / ry ** 2);
  const c = ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 - 1;
  const d = b * b - 4 * a * c;
  if (d <= 0) return '';
  const t1 = (-b - Math.sqrt(d)) / (2 * a);
  const t2 = (-b + Math.sqrt(d)) / (2 * a);
  return `M${f(px + t1 * dx)} ${f(py + t1 * dy)}L${f(px + t2 * dx)} ${f(py + t2 * dy)}`;
}

/** 밥그릇: 소복한 밥(dome) + 그릇 */
function riceBowl(rice: string, body: string, top: string, band = ''): string {
  return (
    `<path d="M38 86L36 92H64L62 86" fill="${body}"/>` +
    `<path d="M14 52C14 30 32 18 50 18S86 30 86 52Z" fill="${rice}"/>` +
    top +
    `<path d="M10 50C10 74 28 88 50 88S90 74 90 50C80 56 20 56 10 50Z" fill="${body}"/>` +
    (band ? `<path d="M17 66Q50 78 83 66" stroke="${band}" stroke-width="4"/>` : '')
  );
}

/** 동그란 전 (부침개·김치전) */
function jeon(fill: string, bits: string, rim = '#dfe8f5'): string {
  return (
    plate(66, 46, 22, '#fff', rim) +
    `<path d="M14 58C12 38 30 22 52 22C74 22 90 36 88 56C86 72 70 80 50 80C30 80 16 72 14 58Z" fill="${fill}"/>` +
    bits
  );
}

export const PICS: Record<string, string> = {
  비빔밥: bowl(
    46,
    '#fffaf0',
    '#4a5068',
    `<ellipse cx="27" cy="46" rx="10" ry="6.5" fill="#3a9e47" stroke-width="2.5"/>` +
      `<ellipse cx="73" cy="46" rx="10" ry="6.5" fill="#ff8c1a" stroke-width="2.5"/><path d="M67 44h11M68 48h9" stroke="#ffc07a" stroke-width="2"/>` +
      `<ellipse cx="38" cy="36" rx="10" ry="5.5" fill="#8a4e2a" stroke-width="2.5"/>` +
      `<ellipse cx="62" cy="36" rx="10" ry="5.5" fill="#fff4b0" stroke-width="2.5"/><path d="M56 36h4M62 34h4M63 38h4" stroke="#e0b800" stroke-width="2"/>` +
      `<ellipse cx="36" cy="56" rx="10" ry="5.5" fill="#b5e07a" stroke-width="2.5"/>` +
      `<ellipse cx="64" cy="56" rx="10" ry="5.5" fill="#e8403a" stroke-width="2.5"/>` +
      blob('#fff', [
        [50, 46, 9],
        [44, 49, 5],
        [57, 43, 5],
      ]) +
      `<circle cx="50" cy="46" r="5" fill="${HL}" stroke-width="2.5"/>`,
    '',
    17,
  ),
  볶음면:
    plate(76, 44, 14) +
    `<path d="M14 72C14 52 30 42 50 42S86 52 86 72C70 80 30 80 14 72Z" fill="#c9772f"/>` +
    `<path d="M22 64q4-5 8 0t8 0t8 0t8 0t8 0t8 0M26 55q4-5 8 0t8 0t8 0t8 0t8 0M20 72q4-5 8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#f0b060" stroke-width="3"/>` +
    `<rect x="30" y="58" width="9" height="6" rx="1.5" fill="#ff8c1a" stroke-width="2.5"/><circle cx="66" cy="66" r="4" fill="#43b04a" stroke-width="2.5"/><circle cx="44" cy="70" r="3.5" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M56 46C54 34 58 24 62 20M60 46C60 34 64 26 67 21M64 46C66 36 70 28 72 22" stroke-width="7"/>` +
    `<path d="M56 46C54 34 58 24 62 20M60 46C60 34 64 26 67 21M64 46C66 36 70 28 72 22" stroke="#e39445" stroke-width="3.5"/>` +
    `<path d="M50 24L92 6M56 30L94 16" stroke-width="9"/><path d="M50 24L92 6M56 30L94 16" stroke="#c98b4f" stroke-width="4"/>`,
  잡채:
    plate(72, 45, 18) +
    `<path d="M12 68C12 46 30 32 50 32S88 46 88 68C72 76 28 76 12 68Z" fill="#8a6a56"/>` +
    `<path d="M18 62q6-5 12 0t12 0t12 0t12 0t12 0M24 52q6-5 12 0t12 0t12 0t12 0M20 70q6-4 12 0t12 0t12 0t12 0t12 0M32 42q6-4 12 0t12 0t12 0" stroke="#c8aa90" stroke-width="2.5"/>` +
    strip('M26 50l12 8M60 40l12 6', '#ff8c1a') +
    strip('M44 40l-10 12M70 56l-12 8', '#3a9e47') +
    strip('M50 50l14-4M28 64l12 2', HL) +
    strip('M48 62l10 4M40 36l10 2', '#e8403a') +
    strip('M66 48l10 10', '#6b3e26') +
    dot(36, 46, 1.6, '#fff') +
    dot(58, 56, 1.6, '#fff') +
    dot(52, 38, 1.6, '#fff'),
  된장국:
    steam(28) +
    bowl(
      48,
      '#b07a3a',
      '#fff',
      tofu(32, 46) + tofu(58, 50) + tofu(50, 40, 8) + zucchini(70, 44, -10) + zucchini(40, 52) + onion(24, 48) + onion(62, 40) + onion(76, 52),
      '#9aa6c4',
    ),
  콩국수: bowl(
    48,
    '#fbf3dc',
    '#7cc9b4',
    `<path d="M26 52C28 34 40 26 50 26S72 34 74 52Z" fill="#fffdf5"/>` +
      `<path d="M32 48q4-4 8 0t8 0t8 0t8 0M36 40q4-4 7 0t7 0t7 0t7 0" stroke="#e0d2b0" stroke-width="2.5"/>` +
      strip('M40 30l8 6M46 28l8 6M52 28l6 6M56 30l6 5', '#43b04a') +
      `<path d="M58 44A8 8 0 0 1 74 44Z" fill="#e8403a" stroke-width="2.5"/>` +
      dot(30, 54, 1.8) +
      dot(70, 56, 1.8) +
      dot(44, 56, 1.8),
    '',
    14,
  ),
  냉면: bowl(
    46,
    '#cfeaf5',
    '#b8c2d6',
    `<path d="M28 50C28 34 40 26 50 26S72 34 72 50Z" fill="#7a6258"/>` +
      `<path d="M34 46q4-4 8 0t8 0t8 0t8 0M36 38q4-4 7 0t7 0t7 0t7 0" stroke="#a89088" stroke-width="2.5"/>` +
      strip('M34 32l8 4M36 28l8 5', '#43b04a') +
      `<ellipse cx="54" cy="28" rx="10" ry="7" fill="#fff"/><circle cx="54" cy="28" r="4" fill="${HL}" stroke-width="2.5"/>` +
      `<rect x="14" y="42" width="11" height="11" rx="2" fill="#f4fcff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(15 19 47)"/>` +
      `<rect x="75" y="42" width="11" height="11" rx="2" fill="#f4fcff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(-12 80 47)"/>` +
      `<path d="M60 48l10-6l4 6Z" fill="#fff8d8" stroke-width="2.5"/>`,
    '#dfe8f5',
    14,
  ),
  칼국수:
    steam(26) +
    bowl(
      46,
      '#efdcb0',
      '#e8862e',
      tube('M18 44C28 38 34 50 44 44S60 38 70 44', '#fff6dc', 5) +
        tube('M26 52C34 46 42 56 52 50S68 46 78 50', '#fff6dc', 5) +
        tube('M30 38C38 34 46 40 54 36', '#fff6dc', 5) +
        `<path d="M62 32C58 40 62 44 70 44C78 44 82 40 78 32Z" fill="#8a7aa8"/><path d="M66 34l2 8M72 34v9" stroke="#c8bce0" stroke-width="2"/>` +
        `<path d="M16 48C14 56 18 58 24 58C30 58 32 54 30 48Z" fill="#8a7aa8"/>` +
        zucchini(40, 54) +
        onion(58, 55),
      '#ffd23f',
      14,
    ),
  수제비:
    steam(26) +
    bowl(
      46,
      '#f2dfb0',
      '#4a90e2',
      `<path d="M20 44L30 38L38 42L34 50L24 52Z" fill="#fffaf0" stroke-width="2.5"/>` +
        `<path d="M42 34L54 32L58 40L50 46L42 42Z" fill="#fffaf0" stroke-width="2.5"/>` +
        `<path d="M60 46L72 42L78 50L68 56L60 54Z" fill="#fffaf0" stroke-width="2.5"/>` +
        `<path d="M38 50L48 48L52 56L40 58Z" fill="#fffaf0" stroke-width="2.5"/>` +
        `<rect x="62" y="34" width="9" height="8" rx="2" fill="#ffd98a" stroke-width="2.5"/>` +
        zucchini(28, 56, 10) +
        `<rect x="54" y="52" width="7" height="5" rx="1" fill="#ff8c1a" stroke-width="2"/>` +
        onion(44, 40) +
        onion(76, 40),
      '#8fd3ff',
      14,
    ),
  김치찌개:
    steam(24) +
    pot(
      44,
      '#e0452e',
      `<path d="M20 44C24 36 34 36 38 42C34 48 26 50 20 44Z" fill="#ff7a52" stroke-width="2.5"/><path d="M22 44C28 42 32 42 36 42" stroke="#ffe0d0" stroke-width="3"/>` +
        `<path d="M56 36C62 30 72 32 74 38C68 42 62 42 56 36Z" fill="#ff7a52" stroke-width="2.5"/><path d="M58 36C64 36 68 36 72 38" stroke="#ffe0d0" stroke-width="3"/>` +
        `<path d="M58 48C62 42 74 44 76 50C70 54 62 54 58 48Z" fill="#ff7a52" stroke-width="2.5"/><path d="M60 48C66 48 70 48 74 50" stroke="#ffe0d0" stroke-width="3"/>` +
        tofu(44, 48, 10) +
        tofu(42, 36, 8) +
        `<path d="M26 50h10l-2 5h-8Z" fill="#ffc0b0" stroke-width="2.5"/>` +
        onion(52, 40) +
        onion(32, 38),
      '#f2c14e',
    ),
  된장찌개:
    steam(24) +
    ttuk(
      46,
      '#a8702e',
      tofu(34, 44, 10) + tofu(58, 48, 9) + tofu(50, 38, 8) + zucchini(66, 42, 10) + zucchini(40, 52, -8) + onion(26, 48) + onion(74, 48) + `<circle cx="46" cy="46" r="2.5" stroke="#e8c890" stroke-width="2"/>`,
    ),
  부대찌개:
    steam(22) +
    pot(
      46,
      '#e0452e',
      `<rect x="36" y="32" width="24" height="14" rx="2" fill="${HL}" transform="rotate(-8 48 39)"/>` +
        `<path d="M40 36q3-3 6 0t6 0t6 0M40 41q3-3 6 0t6 0t6 0" stroke="#fff0b0" stroke-width="2.5" transform="rotate(-8 48 39)"/>` +
        `<rect x="44" y="40" width="14" height="13" rx="1" fill="#ffe14d" transform="rotate(12 51 46)"/>` +
        [
          [22, 46],
          [30, 38],
          [70, 38],
          [78, 48],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#f07e7e"/><circle cx="${x}" cy="${y}" r="2.5" fill="#ffc0b8" stroke="none"/>`)
          .join('') +
        `<rect x="60" y="44" width="12" height="10" rx="2" fill="#ff9aa8" stroke-width="2.5"/>` +
        onion(32, 52) +
        onion(66, 32),
      '#c5cede',
      42,
      22,
      '#8a96b0',
    ),
  갈비탕:
    steam(22) +
    bowl(
      50,
      '#f5e6c0',
      '#f2c14e',
      tube('M40 50L80 18', '#fffaf0', 7) +
        `<circle cx="80" cy="16" r="5" fill="#fffaf0"/><circle cx="85" cy="21" r="5" fill="#fffaf0"/>` +
        `<path d="M34 50C30 40 40 30 52 32C62 34 66 44 60 52Z" fill="#8a4e2a"/><path d="M42 38q6-3 12 0" stroke="#b8703e" stroke-width="3"/>` +
        onion(24, 50) +
        onion(70, 52) +
        onion(30, 44) +
        `<path d="M64 46q4-3 8 0t8 0" stroke="#fffaf0" stroke-width="2.5"/>`,
      '#e0a800',
    ),
  삼계탕:
    steam(22) +
    ttuk(
      46,
      '#fff4e0',
      tube('M44 42L36 28', '#f7dcb0', 5) +
        tube('M56 42L64 28', '#f7dcb0', 5) +
        `<circle cx="35" cy="26" r="5" fill="#fffaf0"/><circle cx="65" cy="26" r="5" fill="#fffaf0"/>` +
        `<ellipse cx="50" cy="46" rx="20" ry="11" fill="#f7dcb0"/><path d="M40 44q10 5 20 0" stroke="#e0b884" stroke-width="3"/>` +
        `<circle cx="26" cy="48" r="4.5" fill="#c8203a" stroke-width="2.5"/><circle cx="74" cy="46" r="4" fill="#c8203a" stroke-width="2.5"/>` +
        onion(30, 40) +
        onion(70, 38),
      '#3a3a48',
      '#5a5a6a',
    ),
  떡꼬치:
    `<g transform="rotate(-25 50 50)">` +
    tube('M50 94V4', '#e8c890', 4) +
    [16, 32, 48, 64]
      .map(
        (y) =>
          `<rect x="28" y="${y}" width="44" height="14" rx="7" fill="#e8553d"/>` +
          `<path d="M34 ${y + 4}h14" stroke="#ff9a7a" stroke-width="3"/>` +
          `<ellipse cx="58" cy="${y + 5}" rx="2" ry="1.3" fill="#fff" stroke="none"/><ellipse cx="44" cy="${y + 9}" rx="2" ry="1.3" fill="#fff" stroke="none"/><ellipse cx="64" cy="${y + 9}" rx="2" ry="1.3" fill="#fff" stroke="none"/>`,
      )
      .join('') +
    `</g>`,
  핫케이크:
    plate(78, 46, 14) +
    layer(58, 12, 36, 11, '#f7dca8', '#d98c3a') +
    layer(42, 12, 36, 11, '#f7dca8', '#d98c3a') +
    `<path d="M26 40C30 34 44 32 56 34C66 36 72 40 70 44C68 48 64 46 64 52C64 58 58 58 58 52C58 48 50 50 40 48C30 48 24 46 26 40Z" fill="#e8962e"/>` +
    `<rect x="42" y="30" width="16" height="11" rx="2" fill="#fff0a0" transform="rotate(-8 50 35)"/><path d="M45 32h6" stroke="#fff" stroke-width="2.5" transform="rotate(-8 50 35)"/>`,
  팬케이크:
    plate(84, 44, 12) +
    layer(70, 7, 32, 9, '#f7dca8', '#e0a458') +
    layer(60, 7, 32, 9, '#f7dca8', '#e0a458') +
    layer(50, 7, 32, 9, '#f7dca8', '#e0a458') +
    layer(40, 7, 32, 9, '#f7dca8', '#e0a458') +
    `<path d="M22 40C24 46 26 50 26 56a3 3 0 0 0 6 0C32 50 32 46 34 44M70 42C70 50 72 54 72 60a3 3 0 0 0 6 0C78 54 78 48 78 40" fill="#9a5b2e"/>` +
    blob('#fff', [
      [50, 34, 9],
      [42, 38, 6],
      [58, 38, 6],
      [50, 26, 6],
    ]) +
    `<path d="M32 30C28 24 32 18 38 20C44 18 46 26 40 32C38 34 34 34 32 30Z" fill="#e8403a"/><path d="M34 20l2-4l4 3" fill="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="64" cy="30" r="5" fill="#3b4ea0"/><circle cx="72" cy="36" r="4.5" fill="#3b4ea0"/>`,
  바게트:
    `<g transform="rotate(-38 50 50)">` +
    `<rect x="4" y="38" width="92" height="24" rx="12" fill="#d98c3a"/>` +
    [20, 38, 56, 74].map((x) => `<ellipse cx="${x}" cy="50" rx="7" ry="3.2" fill="#f7d890" stroke-width="2.5" transform="rotate(-35 ${x} 50)"/>`).join('') +
    `<path d="M14 44H84" stroke="#f0b060" stroke-width="3" opacity=".6"/>` +
    `</g>`,
  머핀:
    `<path d="M26 56L32 90H68L74 56Z" fill="#7ec8f0"/><path d="M36 60L39 88M44 60L45 88M52 60V88M60 60L59 88M67 60L64 88" stroke="#4a90e2" stroke-width="2.5"/>` +
    `<path d="M20 62C10 62 12 46 20 40C24 24 38 16 50 16S76 24 80 40C88 46 90 62 80 62Z" fill="#d9913a"/>` +
    `<path d="M30 34C34 28 40 24 46 23" stroke="#f5c070" stroke-width="4"/>` +
    [
      [40, 38],
      [58, 30],
      [66, 46],
      [30, 50],
      [50, 50],
      [72, 56],
    ]
      .map(([x, y]) => `<path d="M${x - 3.5} ${y + 2}L${x} ${y - 4}L${x + 3.5} ${y + 2}Z" fill="#5a3b24" stroke-width="2"/>`)
      .join(''),
  컵케이크:
    `<path d="M24 58L32 90H68L76 58Z" fill="#ff9aa8"/><path d="M34 60L38 88M44 60L46 88M56 60L54 88M66 60L62 88" stroke="#e85d9a" stroke-width="3"/>` +
    `<ellipse cx="50" cy="56" rx="30" ry="8" fill="#fffaf0"/>` +
    `<path d="M20 56C16 48 24 42 32 42C28 34 36 28 44 30C44 22 50 16 56 20C64 22 66 30 62 32C70 32 74 38 70 44C80 44 84 52 78 58C66 62 32 62 20 56Z" fill="#fffaf0"/>` +
    `<path d="M30 50C40 54 60 54 70 50M38 40C46 43 56 43 62 40" stroke="#e8dcc8" stroke-width="3"/>` +
    `<circle cx="56" cy="14" r="6" fill="#e8403a"/><path d="M58 8C60 4 64 2 68 2" stroke="#6b3e26" stroke-width="2.5"/>` +
    [
      [34, 46, '#3b8fe0', 20],
      [48, 48, '#43b04a', -30],
      [62, 46, '#ffd23f', 40],
      [44, 36, '#e85d9a', 70],
      [56, 30, '#3b8fe0', -10],
      [70, 52, '#e85d9a', 10],
    ]
      .map(([x, y, c, a]) => `<rect x="${Number(x) - 3.5}" y="${Number(y) - 1.5}" width="7" height="3" rx="1.5" fill="${c}" stroke-width="1.2" transform="rotate(${a} ${x} ${y})"/>`)
      .join(''),
  크림빵:
    `<ellipse cx="50" cy="56" rx="42" ry="28" fill="#d98c3a"/>` +
    `<path d="M20 40C28 32 38 30 46 30" stroke="#f7c67a" stroke-width="4"/>` +
    `<path d="M12 56C24 48 36 44 50 44S76 48 88 56C76 62 64 66 50 66S24 62 12 56Z" fill="#9a5b2e"/>` +
    `<path d="M14 56C18 48 26 50 28 54C30 44 40 44 42 52C44 40 56 40 58 52C60 44 70 44 72 54C74 50 82 48 86 56C76 64 64 68 50 68S24 64 14 56Z" fill="#fffaf0"/>` +
    `<path d="M28 60C40 63 60 63 72 60" stroke="#e8dcc8" stroke-width="3"/>` +
    `<path d="M24 76C36 82 64 82 76 76" stroke="#b8702e" stroke-width="3"/>`,
  단팥빵:
    `<path d="M8 76C8 50 26 34 50 34S92 50 92 76C80 82 20 82 8 76Z" fill="#a8582a"/>` +
    `<path d="M15 74C15 55 30 42 50 42S85 55 85 74C74 78 26 78 15 74Z" fill="#f7dca0" stroke-width="2.5"/>` +
    `<path d="M24 70C22 58 34 50 46 51C58 49 74 55 76 66C76 73 62 74 50 74C38 75 26 75 24 70Z" fill="#6a2a3a" stroke-width="2.5"/>` +
    [
      [36, 62],
      [48, 57],
      [60, 60],
      [44, 68],
      [58, 69],
      [68, 66],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2.2" fill="#8e3a4c" stroke="none"/>`)
      .join('') +
    `<path d="M24 44C30 40 36 38 42 37" stroke="#d98c5a" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="38" rx="2" ry="1.2" fill="${INK}" stroke="none"/><ellipse cx="44" cy="38.5" rx="2" ry="1.2" fill="${INK}" stroke="none"/><ellipse cx="56" cy="38.5" rx="2" ry="1.2" fill="${INK}" stroke="none"/>`,
  소보로빵:
    plate(80, 42, 11) +
    `<path d="M14 76C14 46 30 30 50 30S86 46 86 76C70 82 30 82 14 76Z" fill="#e0a04a"/>` +
    blob('#eab45a', [
      [22, 56, 7],
      [28, 44, 7],
      [38, 36, 7],
      [50, 33, 7],
      [62, 36, 7],
      [72, 44, 7],
      [78, 56, 7],
      [36, 52, 7],
      [50, 46, 7],
      [64, 52, 7],
      [44, 62, 6],
      [58, 64, 6],
    ]) +
    `<path d="M30 58l6-4M46 42l6 2M60 44l4 6M50 56l6-2M68 60l5-2M34 42l4 4" stroke="#b8702e" stroke-width="3"/>` +
    `<circle cx="42" cy="50" r="2.2" fill="#fff0b0" stroke="none"/><circle cx="56" cy="40" r="2.2" fill="#fff0b0" stroke="none"/><circle cx="70" cy="52" r="2.2" fill="#fff0b0" stroke="none"/><circle cx="28" cy="50" r="2.2" fill="#fff0b0" stroke="none"/>`,
  마카롱: [
    [50, 78, '#9fe0b0', '#6cc48a'],
    [50, 52, '#ff9ec4', '#e8709e'],
    [50, 26, '#ffd23f', '#e0a800'],
  ]
    .map(
      ([x, y, c, d]) =>
        `<path d="M${Number(x) - 26} ${Number(y) + 4}H${Number(x) + 26}C${Number(x) + 26} ${Number(y) + 14} ${Number(x) - 26} ${Number(y) + 14} ${Number(x) - 26} ${Number(y) + 4}Z" fill="${c}"/>` +
        `<rect x="${Number(x) - 24}" y="${Number(y) - 2}" width="48" height="7" rx="3" fill="#fffaf0"/>` +
        `<path d="M${Number(x) - 26} ${Number(y) - 2}C${Number(x) - 26} ${Number(y) - 16} ${Number(x) + 26} ${Number(y) - 16} ${Number(x) + 26} ${Number(y) - 2}Z" fill="${c}"/>` +
        `<path d="M${Number(x) - 22} ${Number(y) - 4}h44M${Number(x) - 22} ${Number(y) + 7}h44" stroke="${d}" stroke-width="2.5" stroke-dasharray="3 3"/>` +
        `<path d="M${Number(x) - 14} ${Number(y) - 9}q6-3 12-3" stroke="#fff" stroke-width="3" opacity=".6"/>`,
    )
    .join(''),
  파이:
    `<path d="M6 56C6 76 26 88 50 88S94 76 94 56Z" fill="#c9772f"/>` +
    `<ellipse cx="50" cy="56" rx="44" ry="24" fill="#e8a458"/>` +
    `<ellipse cx="50" cy="56" rx="35" ry="17" fill="#c8203a"/>` +
    [
      [30, 56, 0.35, 1],
      [50, 56, 0.35, 1],
      [70, 56, 0.35, 1],
      [50, 46, 1, 0],
      [50, 56, 1, 0],
      [50, 66, 1, 0],
    ]
      .map(([px, py, dx, dy]) => {
        const d = chord(50, 56, 35, 17, px, py, dx, dy);
        return `<path d="${d}" stroke-width="9.5"/><path d="${d}" stroke="#f2c26a" stroke-width="5"/>`;
      })
      .join('') +
    `<ellipse cx="50" cy="56" rx="35" ry="17"/>` +
    [
      [14, 50],
      [22, 40],
      [36, 34],
      [50, 32],
      [64, 34],
      [78, 40],
      [86, 50],
      [86, 62],
      [76, 72],
      [62, 78],
      [50, 79],
      [38, 78],
      [24, 72],
      [14, 62],
    ]
      .map(([x, y]) => dot(x, y, 2, '#c9772f'))
      .join(''),
  아이스바:
    `<rect x="43" y="66" width="14" height="28" rx="7" fill="#e8c890"/>` +
    `<path d="M24 72V30C24 12 36 8 48 8C52 8 54 12 58 12C60 18 66 18 68 16C74 20 76 26 76 32V72C76 78 72 80 66 80H34C28 80 24 78 24 72Z" fill="#ff5c70"/>` +
    `<path d="M24 58H76V72C76 78 72 80 66 80H34C28 80 24 78 24 72Z" fill="#fff"/>` +
    `<path d="M34 66V74M44 66V70" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M34 24V48" stroke="#ffb0bc" stroke-width="5"/>` +
    `<path d="M62 58C62 64 64 66 66 66S70 64 70 58" fill="#ff5c70"/>` +
    sparkle(86, 30, 6, '#7ec8f0') +
    sparkle(14, 50, 5, '#7ec8f0'),
  요거트:
    `<path d="M60 36L80 6" stroke-width="10"/><path d="M60 36L80 6" stroke="#dfe8f5" stroke-width="4.5"/>` +
    `<path d="M22 34L30 88H70L78 34Z" fill="#e6f5fb"/>` +
    `<path d="M24 40L31 86H69L76 40Z" fill="#fff" stroke="none"/>` +
    `<path d="M26 56H74L73 64H27Z" fill="#ff9aa8" stroke="none"/>` +
    `<path d="M28 72H72" stroke="#e0a458" stroke-width="5"/>` +
    `<path d="M22 34L30 88H70L78 34Z"/>` +
    `<path d="M22 34C22 22 78 22 78 34C66 38 34 38 22 34Z" fill="#fff"/>` +
    `<path d="M30 30C28 24 34 20 40 22C46 20 48 26 42 32C40 34 32 34 30 30Z" fill="#e8403a"/><path d="M34 22l2-3l3 2" stroke="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="52" cy="28" r="4.5" fill="#3b4ea0"/><circle cx="68" cy="30" r="4" fill="#3b4ea0"/>` +
    `<path d="M36 44L38 80" stroke="#dfe8f5" stroke-width="3"/>`,
  코코아:
    steam(22) +
    tube('M76 48C92 48 92 72 76 72', '#e8553d', 5) +
    `<path d="M22 36V78C22 86 30 90 49 90S76 86 76 78V36Z" fill="#e8553d"/>` +
    `<ellipse cx="49" cy="36" rx="27" ry="8" fill="#7a4a2a"/>` +
    `<rect x="32" y="28" width="11" height="9" rx="2" fill="#fff" transform="rotate(-10 37 32)"/><rect x="48" y="30" width="11" height="9" rx="2" fill="#ffd0e0" transform="rotate(12 53 34)"/><rect x="60" y="28" width="10" height="8" rx="2" fill="#fff" transform="rotate(-5 65 32)"/>` +
    `<path d="M30 52V74" stroke="#ff9a8a" stroke-width="4"/>` +
    `<path d="M36 62C40 58 46 58 50 62C54 58 60 58 62 62C60 68 52 72 49 74C46 72 38 68 36 62Z" fill="#fff" stroke="none"/>`,
  녹차:
    steam(26) +
    `<ellipse cx="50" cy="84" rx="40" ry="9" fill="#c98b4f"/>` +
    `<path d="M20 44C20 70 32 84 50 84S80 70 80 44Z" fill="#fffaf0"/>` +
    `<ellipse cx="50" cy="44" rx="30" ry="9" fill="#9ccc52"/>` +
    `<path d="M26 60C30 72 38 78 46 80" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M24 58Q50 66 76 58" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M70 40C74 28 86 24 94 26C90 36 80 42 70 40Z" fill="#43b04a"/><path d="M72 38C78 32 84 30 90 28" stroke="#b5e07a" stroke-width="2"/>` +
    `<path d="M12 40C8 30 12 22 20 18C24 26 22 36 12 40Z" fill="#3a9e47"/>`,
  보리차:
    `<path d="M26 18L32 86H68L74 18Z" fill="#eaf6fc"/>` +
    `<path d="M27.5 34L33 84H67L72.5 34Z" fill="#c98035" stroke="none"/>` +
    `<path d="M27.5 34H72.5" stroke-width="3"/>` +
    `<path d="M26 18L32 86H68L74 18Z"/>` +
    `<path d="M36 42L39 76" stroke="#e8b070" stroke-width="4"/>` +
    `<rect x="46" y="40" width="12" height="11" rx="2" fill="#e6c09a" stroke-width="2.5" transform="rotate(15 52 45)"/>` +
    [
      [14, 84, 20],
      [22, 90, -30],
      [84, 88, 40],
      [90, 80, -10],
      [12, 74, -60],
    ]
      .map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="5" ry="3.2" fill="#e8c070" stroke-width="2"/><path d="M${x - 3} ${y}h6" stroke="#b8862e" stroke-width="1.5"/></g>`)
      .join(''),
  식혜: bowl(
    46,
    '#f5ead0',
    '#f2c14e',
    [
      [26, 44, 20],
      [34, 40, -30],
      [44, 46, 10],
      [40, 52, -10],
      [52, 38, 40],
      [56, 50, -20],
      [30, 52, 30],
      [66, 42, 0],
      [70, 52, 25],
      [60, 56, -35],
      [48, 56, 15],
      [76, 46, -40],
    ]
      .map(([x, y, a]) => grain(x, y, a, '#fff'))
      .join('') +
      `<rect x="54" y="38" width="10" height="10" rx="2" fill="#f4fcff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(20 59 43)"/>` +
      `<rect x="30" y="34" width="9" height="9" rx="2" fill="#f4fcff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(-15 34 38)"/>` +
      `<path d="M46 40q2-4 4 0q-2 3-4 0Z" fill="#fff0c8" stroke-width="2"/>`,
    '#e0a800',
    14,
  ),
  오믈렛:
    plate(70, 46, 20) +
    `<path d="M16 66C14 44 32 30 52 30C72 30 86 44 84 62C68 70 32 72 16 66Z" fill="#ffd23f"/>` +
    `<path d="M20 64C36 56 64 54 82 60" stroke="#e8b400" stroke-width="3"/>` +
    `<path d="M32 42C38 36 46 34 54 34" stroke="#fff0a0" stroke-width="4"/>` +
    dot(46, 44, 2, '#3a9e47') +
    dot(58, 40, 2, '#3a9e47') +
    dot(66, 48, 2, '#3a9e47') +
    `<path d="M40 52C46 48 54 48 60 50" stroke="#e8403a" stroke-width="4"/>` +
    `<circle cx="84" cy="76" r="6" fill="#e8403a"/><circle cx="74" cy="82" r="5.5" fill="#e8403a"/>`,
  스테이크:
    `<ellipse cx="50" cy="66" rx="47" ry="26" fill="#9a5b2e"/>` +
    `<ellipse cx="50" cy="62" rx="42" ry="22" fill="#3a3f52"/>` +
    `<path d="M24 54C22 42 36 36 52 38C66 40 74 46 72 58C70 70 56 74 42 72C30 70 26 64 24 54Z" fill="#8a4a2a"/>` +
    `<path d="M24 54C22 42 36 36 52 38" stroke="#fff0d8" stroke-width="4"/>` +
    `<path d="M34 50l8-8M42 60l14-14M52 66l14-14M36 66l4-4" stroke="#4a2616" stroke-width="4"/>` +
    blob('#43b04a', [
      [80, 52, 6],
      [84, 60, 5],
      [76, 58, 5],
    ]) +
    `<path d="M70 72L80 64L86 72Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="16" y="64" width="12" height="6" rx="2" fill="#ff8c1a" stroke-width="2.5" transform="rotate(20 22 67)"/>`,
  돈가스:
    plate(62, 46, 28) +
    blob('#d8f0b0', [
      [22, 56, 9],
      [28, 48, 8],
      [20, 66, 7],
    ]) +
    `<path d="M16 54l12-6M18 62l12-4M22 70l8-4" stroke="#8fcf5a" stroke-width="2.5"/>` +
    `<g transform="rotate(-12 58 58)">` +
    `<rect x="32" y="40" width="54" height="36" rx="12" fill="#e0a040"/>` +
    `<path d="M46 40V76M59 40V76M72 40V76" stroke-width="3"/>` +
    [
      [38, 50],
      [40, 66],
      [52, 58],
      [54, 70],
      [64, 48],
      [66, 62],
      [79, 54],
      [78, 68],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#b8702e'))
      .join('') +
    `<path d="M34 50C44 44 54 56 64 48S80 46 84 50" stroke-width="9"/><path d="M34 50C44 44 54 56 64 48S80 46 84 50" stroke="#6b3e26" stroke-width="5"/>` +
    `</g>`,
  카레라이스:
    tube('M74 44L94 14', '#dfe8f5', 5) +
    plate(62, 46, 28, '#fff', '#8fd3ff') +
    `<path d="M46 40C62 36 82 44 84 58C86 72 70 80 54 78C44 76 42 68 46 60Z" fill="#e0a020"/>` +
    blob('#fff', [
      [26, 58, 14],
      [38, 48, 13],
      [36, 66, 12],
      [48, 58, 10],
    ]) +
    `<path d="M24 52q3-3 6 0M36 44q3-3 6 0M34 62q3-3 6 0" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<rect x="60" y="48" width="9" height="9" rx="2" fill="#ff8c1a" stroke-width="2.5"/><rect x="70" y="62" width="9" height="9" rx="2" fill="#fff0b0" stroke-width="2.5"/><rect x="56" y="64" width="8" height="8" rx="2" fill="#ff8c1a" stroke-width="2.5"/><rect x="74" y="50" width="7" height="7" rx="2" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M74 44C70 50 60 52 58 46C58 40 68 38 74 44Z" fill="#dfe8f5"/>`,
  오므라이스:
    tube('M80 58L96 36', '#dfe8f5', 5) +
    plate(68, 46, 24) +
    `<path d="M14 62C14 38 34 28 52 28C72 28 86 40 86 58C86 70 70 76 50 76C28 76 14 72 14 62Z" fill="#ffc933"/>` +
    `<path d="M70 72C74 62 80 56 86 58C86 68 80 74 70 72Z" fill="#f08a3a"/>` +
    dot(78, 66, 2, '#43b04a') +
    dot(82, 62, 2, '#43b04a') +
    `<path d="M26 46L34 38L42 50L50 36L58 50L66 38L72 48" stroke="#c8203a" stroke-width="5"/>` +
    `<path d="M22 58C26 64 34 68 42 68" stroke="#fff0a0" stroke-width="4"/>` +
    `<path d="M80 58C76 54 74 50 78 46C84 44 88 48 86 54Z" fill="#dfe8f5"/>`,
  볶음우동:
    tube('M80 56L97 44', '#6b3e26', 6) +
    `<ellipse cx="46" cy="60" rx="42" ry="26" fill="#3a3f52"/>` +
    `<ellipse cx="46" cy="58" rx="35" ry="20" fill="#4a5068" stroke-width="2.5"/>` +
    tube('M18 58C24 44 34 46 38 56S54 64 58 50S72 42 76 56', '#f0d49a', 7) +
    tube('M20 68C28 60 36 66 42 70S58 72 64 64S74 62 76 66', '#f0d49a', 7) +
    tube('M28 46C34 40 42 42 46 46S56 48 60 42', '#f0d49a', 7) +
    `<circle cx="36" cy="62" r="5" fill="#fff" stroke-width="2.5"/><path d="M34 60q2 2 4 0" stroke="#ff9aa8" stroke-width="2"/>` +
    `<rect x="60" y="54" width="9" height="5" rx="1.5" fill="#ff8c1a" stroke-width="2.5"/>` +
    onion(50, 56) +
    onion(66, 44) +
    onion(28, 54) +
    `<path d="M44 36c2-3 4 2 6-1M54 34c2-3 4 2 6-1" stroke="#b8702e" stroke-width="2.5"/>`,
  탕수육:
    plate(64, 46, 26) +
    [
      [30, 54, 10],
      [46, 46, 11],
      [64, 50, 10],
      [38, 68, 10],
      [58, 68, 11],
      [74, 64, 9],
    ]
      .map(
        ([x, y, r]) =>
          `<path d="M${x - r} ${y}C${x - r} ${y - r * 0.9} ${x + r} ${y - r} ${x + r} ${y + 1}C${x + r} ${y + r * 0.8} ${x - r * 0.8} ${y + r * 0.9} ${x - r} ${y}Z" fill="#e0a040"/>` +
          `<path d="M${x - r * 0.6} ${y - 1}C${x - r * 0.4} ${y - r * 0.6} ${x + r * 0.5} ${y - r * 0.6} ${x + r * 0.6} ${y}" stroke="#ff8c3a" stroke-width="4"/>`,
      )
      .join('') +
    `<circle cx="54" cy="58" r="5" fill="#7cc242" stroke-width="2.5"/><circle cx="54" cy="58" r="2" fill="#e8f5c8" stroke="none"/>` +
    `<path d="M26 64l6-6l5 7Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<ellipse cx="72" cy="48" rx="5" ry="3.5" fill="#ff8c1a" stroke-width="2.5"/>` +
    `<ellipse cx="48" cy="78" rx="5" ry="3.5" fill="#ff8c1a" stroke-width="2.5"/>` +
    `<path d="M40 58C42 60 46 60 48 58M66 76C68 78 72 78 74 76" stroke="#ff8c3a" stroke-width="3"/>`,
  짬뽕:
    steam(24) +
    bowl(
      46,
      '#e0452e',
      '#2a2f45',
      `<path d="M20 48q4-5 8 0t8 0M62 52q4-5 8 0t8 0" stroke="#ffe7a0" stroke-width="3.5"/>` +
        `<path d="M28 36C26 44 34 48 42 44C44 38 36 32 28 36Z" fill="#2a2a3a" stroke="#6a6a8a" stroke-width="2.5"/>` +
        `<path d="M58 38C62 30 76 32 76 42C72 44 70 40 66 42C64 46 58 44 58 38Z" fill="#ff9a6a" stroke-width="2.5"/><path d="M62 36l2 4M68 34l1 4" stroke="#fff" stroke-width="2"/>` +
        `<ellipse cx="46" cy="52" rx="7" ry="5" stroke-width="6.5"/><ellipse cx="46" cy="52" rx="7" ry="5" stroke="#fff" stroke-width="3"/>` +
        `<ellipse cx="54" cy="42" rx="5" ry="3.5" stroke-width="6.5"/><ellipse cx="54" cy="42" rx="5" ry="3.5" stroke="#fff" stroke-width="3"/>` +
        onion(34, 54) +
        onion(70, 50),
      '#e8553d',
      14,
    ),
  만둣국:
    steam(24) +
    bowl(
      46,
      '#fdf3dc',
      '#fff',
      mandu(30, 44, -8) + mandu(68, 44, 8) + mandu(50, 52) + strip('M44 36l8 2M56 36l6 2', HL) + onion(22, 52) + onion(78, 52),
      '#3b78e6',
      14,
    ),
  떡만둣국:
    steam(24) +
    bowl(
      46,
      '#fdf3dc',
      '#fff',
      tteok(26, 48, -15) + tteok(74, 48, 15) + tteok(50, 56, 5) + tteok(50, 37, -5) + mandu(36, 44, -6) + mandu(64, 44, 6) + onion(22, 40) + onion(78, 40),
      '#43b04a',
      14,
    ),
  부침개: jeon(
    '#f2c14e',
    strip('M26 44l10 4M44 34l12 2M62 40l10 6M30 62l12-2M56 60l12 4M46 48l8 6', '#3a9e47') +
      `<rect x="36" y="52" width="7" height="5" rx="1" fill="#ff8c1a" stroke-width="2"/><rect x="64" y="52" width="7" height="5" rx="1" fill="#ff8c1a" stroke-width="2"/>` +
      `<path d="M28 34q2-2 4 0M68 68q2-2 4 0" stroke="#fff0a0" stroke-width="3"/>`,
  ),
  파전:
    plate(64, 46, 26) +
    `<path d="M12 50C12 36 20 30 32 30H72C84 30 90 38 88 50C88 66 84 76 70 76H30C18 76 12 66 12 50Z" fill="#f0c050"/>` +
    [36, 46, 56, 66]
      .map((y) => strip(`M18 ${y}H66`, '#43b04a') + strip(`M66 ${y}H82`, '#f5fbe8'))
      .join('') +
    `<circle cx="30" cy="41" r="3.5" fill="#ff7a52" stroke-width="2"/><circle cx="54" cy="61" r="3.5" fill="#ff7a52" stroke-width="2"/><circle cx="42" cy="51" r="3.5" fill="#fff" stroke-width="2"/>`,
  김치전: jeon(
    '#f07a3a',
    [
      [32, 40, 20],
      [60, 36, -10],
      [42, 58, -20],
      [66, 58, 15],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 9} ${y}C${x - 6} ${y - 7} ${x + 6} ${y - 7} ${x + 9} ${y}C${x + 6} ${y + 6} ${x - 6} ${y + 6} ${x - 9} ${y}Z" fill="#d8402a" stroke-width="2.5"/><path d="M${x - 6} ${y}h12" stroke="#ffd8c8" stroke-width="2.5"/></g>`,
      )
      .join('') +
      onion(48, 44) +
      onion(26, 58) +
      onion(76, 46),
  ),
  동그랑땡:
    plate(66, 46, 24) +
    [
      [28, 50],
      [50, 46],
      [72, 50],
      [36, 70],
      [60, 70],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="14" ry="11" fill="#ffc933"/><ellipse cx="${x}" cy="${y}" rx="9" ry="6.5" fill="#f2a83a" stroke="none"/>` +
          dot(x - 4, y - 1, 1.8, '#e8403a') +
          dot(x + 3, y + 2, 1.8, '#3a9e47') +
          dot(x + 4, y - 3, 1.8, '#6b3e26'),
      )
      .join(''),
  잡곡밥: riceBowl(
    '#f3e6ee',
    '#fff',
    [
      [30, 40],
      [44, 30],
      [58, 36],
      [70, 44],
      [40, 46],
      [54, 24],
      [24, 48],
      [62, 48],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#2a2030" stroke-width="1.6"/>`)
      .join('') +
      [
        [36, 34],
        [50, 42],
        [66, 30],
        [76, 48],
        [30, 50],
      ]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.8" ry="2.6" fill="#a8283c" stroke-width="1.6"/>`)
        .join('') +
      [
        [42, 38],
        [60, 28],
        [48, 50],
        [72, 38],
        [22, 42],
        [56, 44],
      ]
        .map(([x, y]) => dot(x, y, 2.2, '#f2c14e'))
        .join(''),
    '#8e4fc9',
  ),
  현미밥: riceBowl(
    '#e9cf98',
    '#3b8fe0',
    [
      [30, 40, 20],
      [42, 32, -30],
      [56, 28, 10],
      [66, 38, -20],
      [74, 46, 30],
      [22, 48, -40],
      [38, 46, 50],
      [52, 40, -10],
      [62, 48, 25],
      [46, 24, 60],
      [34, 32, 0],
      [50, 50, 40],
    ]
      .map(([x, y, a]) => grain(x, y, a, '#d9a868', 3.8, 2.3))
      .join(''),
    '#8fd3ff',
  ),
  누룽지:
    `<path d="M10 52L16 34L30 24L46 22L60 20L76 28L88 40L90 58L82 72L66 80L50 82L32 80L18 70Z" fill="#d49a4c"/>` +
    `<path d="M26 46C32 40 40 40 44 44C42 52 34 56 28 54Z" fill="#a8652e" stroke="none"/><path d="M60 64C66 58 74 58 76 64C72 70 64 70 60 64Z" fill="#a8652e" stroke="none"/>` +
    Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => {
        const x = 18 + c * 8 + (r % 2) * 4;
        const y = 28 + r * 7;
        if (((x - 50) / 38) ** 2 + ((y - 51) / 28) ** 2 > 0.8) return '';
        return grain(x, y, ((r * 9 + c) * 37) % 90 - 45, '#f5d8a0', 3.4, 2);
      }).join(''),
    ).join('') +
    `<path d="M10 52L16 34L30 24L46 22L60 20L76 28L88 40L90 58L82 72L66 80L50 82L32 80L18 70Z"/>`,
  쌀:
    `<path d="M20 40C14 60 14 80 22 90H78C86 80 86 60 80 40Z" fill="#f2e6c8"/>` +
    `<path d="M22 50C20 64 20 76 24 84M78 50C80 64 80 76 76 84" stroke="#dccca0" stroke-width="3"/>` +
    `<path d="M24 36C28 20 40 14 50 14S72 20 76 36Z" fill="#fff"/>` +
    [
      [34, 26, 20],
      [44, 20, -20],
      [56, 21, 30],
      [66, 28, -10],
      [42, 30, 60],
      [54, 30, -40],
    ]
      .map(([x, y, a]) => grain(x, y, a, '#fff'))
      .join('') +
    `<path d="M16 40C16 32 84 32 84 40C84 46 16 46 16 40Z" fill="#e0cfa4"/>` +
    `<path d="M50 84V58" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M50 60C58 56 62 50 62 46" stroke="#43b04a" stroke-width="3"/>` +
    [
      [60, 48],
      [56, 54],
      [64, 52],
      [52, 62],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="${HL}" stroke-width="1.6"/>`)
      .join('') +
    `<path d="M50 70C44 66 40 68 38 72M50 76C56 72 60 74 62 78" stroke="#43b04a" stroke-width="3"/>` +
    [
      [86, 90, 20],
      [92, 84, -30],
      [90, 94, 60],
      [8, 92, -20],
    ]
      .map(([x, y, a]) => grain(x, y, a, '#fff'))
      .join(''),
};
