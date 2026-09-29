// 동물 그림 묶음 2 (멧돼지·오랑우탄 … 박새·종달새: 비슷한 동물끼리 무늬·부리·몸 모양으로 구별). 그림 규칙은 docs/picture-style.md.
import { INK, HL, dot, blob, cheeks, tube, drop } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5.5, p = 3) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` + dot(x, y + 0.3, p);

/** 가시 덩어리 (성게) */
function spikes(cx: number, cy: number, rin: number, rout: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const [x, y] = pt(cx, cy, i % 2 ? rout : rin, (360 * i) / (n * 2));
    pts.push(`${x} ${y}`);
  }
  return `M${pts.join('L')}Z`;
}

/** 부채꼴 조개 (가리비) */
function scallop(cx: number, cy: number, r: number, half: number, n: number): { d: string; ribs: string } {
  const P = Array.from({ length: n + 1 }, (_, k) => pt(cx, cy, r, -90 - half + (2 * half * k) / n));
  const chord = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]);
  let d = `M${cx} ${cy}L${P[0][0]} ${P[0][1]}`;
  for (let k = 1; k <= n; k++) d += `A${r1(chord * 0.55)} ${r1(chord * 0.55)} 0 0 1 ${P[k][0]} ${P[k][1]}`;
  d += 'Z';
  let ribs = '';
  for (let k = 1; k < n; k++) {
    const [ax, ay] = pt(cx, cy, r * 0.25, -90 - half + (2 * half * k) / n);
    const [bx, by] = pt(cx, cy, r * 0.9, -90 - half + (2 * half * k) / n);
    ribs += `M${ax} ${ay}L${bx} ${by}`;
  }
  return { d, ribs };
}
const SC = scallop(50, 78, 58, 46, 7);

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '') =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

/** 오른쪽 날개를 왼쪽에 거울로 */
const mirror = (s: string) => s + `<g transform="translate(100 0) scale(-1 1)">${s}</g>`;

/** 작은 멸치 한 마리 */
const anchovy = (x: number, y: number, s: number, deg = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${s})" stroke-width="${r1(3 / s)}">` +
  `<path d="M-12 0L-19 -6L-17 0L-19 6Z" fill="#b8c4dc"/>` +
  `<path d="M-14 0C-8 -6 8 -7 15 -2L17 0L15 2C8 7 -8 6 -14 0Z" fill="#eef3fa"/>` +
  `<path d="M-10 0H11" stroke="#6aa8d8" stroke-width="${r1(2.2 / s)}"/>` +
  `<circle cx="10" cy="-1.5" r="2.6" fill="#fff" stroke-width="${r1(1.6 / s)}"/>` +
  `<circle cx="10.3" cy="-1.3" r="1.4" fill="${INK}" stroke="none"/>` +
  `</g>`;

const WAVE = `<path d="M4 88q7-6 13 0t13 0t13 0t13 0t13 0t13 0t13 0" stroke="#3b8fe0" stroke-width="3"/>`;
const bubbles = (xs: [number, number, number][]) =>
  xs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#dff3ff" stroke-width="2.5"/>`).join('');

export const PICS: Record<string, string> = {
  멧돼지:
    `<path d="M17 52q-8-2-6 6" stroke-width="3"/>` +
    legs([24, 35, 55, 66], 62, 8, 24, '#5a3b24', INK) +
    `<path d="M20 42L24 30L30 38L35 27L41 35L46 25L51 34L56 27L60 36L64 31L66 42Z" fill="#3d2a1c"/>` +
    `<path d="M14 58C12 42 28 34 48 34C62 34 70 40 72 48L72 70C58 78 28 78 18 72C15 68 14 63 14 58Z" fill="#7a5236"/>` +
    `<path d="M62 38L63 25L72 35Z" fill="#5a3b24"/>` +
    `<path d="M58 42C68 32 82 40 88 52L91 58C92 66 86 69 78 68L60 66Z" fill="#7a5236"/>` +
    `<ellipse cx="90" cy="60" rx="4.5" ry="7" fill="#d9a08a"/>` +
    dot(89.5, 57, 1.5) +
    dot(89.5, 63, 1.5) +
    `<path d="M77 68C75 60 79 54 86 51C84 58 84 63 83 69Z" fill="#fff"/>` +
    dot(73, 47, 3) +
    `<path d="M28 50l-2 8M38 48l-2 8M48 50l-2 8" stroke="#5a3b24" stroke-width="2.5"/>`,

  오랑우탄:
    tube('M30 52C18 60 12 74 13 86', '#c8581e', 11) +
    tube('M70 52C82 60 88 74 87 86', '#c8581e', 11) +
    `<ellipse cx="13" cy="88" rx="7" ry="5" fill="#8a4a2a"/><ellipse cx="87" cy="88" rx="7" ry="5" fill="#8a4a2a"/>` +
    `<ellipse cx="37" cy="88" rx="11" ry="6" fill="#c8581e"/><ellipse cx="63" cy="88" rx="11" ry="6" fill="#c8581e"/>` +
    blob('#d9662b', [
      [50, 66, 21],
      [38, 78, 11],
      [62, 78, 11],
      [50, 50, 15],
    ]) +
    `<path d="M44 60l-3 8M56 60l3 8M50 70v8" stroke="#a8461a" stroke-width="2.5"/>` +
    blob('#d9662b', [
      [50, 30, 18],
      [40, 15, 6],
      [50, 12, 6],
      [60, 15, 6],
    ]) +
    `<path d="M36 30C36 20 64 20 64 30C64 44 58 50 50 50C42 50 36 44 36 30Z" fill="#e0a07a"/>` +
    dot(44, 30, 2.8) +
    dot(56, 30, 2.8) +
    dot(47.5, 38, 1.5) +
    dot(52.5, 38, 1.5) +
    `<path d="M43 44q7 4 14 0" stroke-width="2.5"/>`,

  침팬지:
    `<path d="M20 94C18 72 32 58 50 58C68 58 82 72 80 94Z" fill="#2f2a33"/>` +
    tube('M30 68C24 80 30 88 42 86', '#2f2a33', 9) +
    tube('M70 68C76 80 70 88 58 86', '#2f2a33', 9) +
    `<ellipse cx="43" cy="86" rx="6" ry="4.5" fill="#f0c8a0"/><ellipse cx="57" cy="86" rx="6" ry="4.5" fill="#f0c8a0"/>` +
    `<circle cx="22" cy="36" r="11" fill="#f0c8a0"/><circle cx="78" cy="36" r="11" fill="#f0c8a0"/>` +
    dot(22, 36, 4.5, '#d9a078') +
    dot(78, 36, 4.5, '#d9a078') +
    `<circle cx="50" cy="34" r="24" fill="#2f2a33"/>` +
    `<path d="M50 22C42 14 30 18 32 32C32 50 40 58 50 58C60 58 68 50 68 32C70 18 58 14 50 22Z" fill="#f0c8a0"/>` +
    `<path d="M36 28q7-5 14 0q7-5 14 0" stroke-width="3"/>` +
    dot(43, 33, 2.8) +
    dot(57, 33, 2.8) +
    `<ellipse cx="50" cy="48" rx="11" ry="8" fill="#e0b088"/>` +
    dot(47.5, 44, 1.5) +
    dot(52.5, 44, 1.5) +
    `<path d="M43 50q7 5 14 0" stroke-width="2.5"/>`,

  긴팔원숭이:
    tube('M4 13Q50 5 96 15', '#9a5b2e', 6) +
    `<path d="M70 10C74 2 84 2 86 8C80 10 76 12 70 10Z" fill="#43b04a"/>` +
    tube('M44 56C36 42 26 26 22 12', '#b89a6a', 7) +
    tube('M56 56C64 42 74 26 78 12', '#b89a6a', 7) +
    `<circle cx="22" cy="11" r="4.5" fill="#3d3530"/><circle cx="78" cy="11" r="4.5" fill="#3d3530"/>` +
    tube('M45 76C42 84 38 88 32 91', '#b89a6a', 7) +
    tube('M55 76C58 84 62 88 68 91', '#b89a6a', 7) +
    `<ellipse cx="50" cy="66" rx="12" ry="15" fill="#c9ad7e"/>` +
    `<circle cx="50" cy="44" r="13" fill="#c9ad7e"/>` +
    `<circle cx="50" cy="46" r="8.5" fill="#3d3530" stroke="#fff" stroke-width="3.5"/>` +
    `<circle cx="50" cy="46" r="11"/>` +
    dot(46.5, 45, 1.8, '#fff') +
    dot(53.5, 45, 1.8, '#fff') +
    `<path d="M47 50q3 2 6 0" stroke="#fff" stroke-width="2"/>`,

  바다사자:
    `<path d="M6 94C8 80 28 76 50 78C72 76 92 82 94 94Z" fill="#8a96b0"/>` +
    `<circle cx="78" cy="15" r="11" fill="#e8553d"/>` +
    `<path d="M68 12C73 18 83 18 88 12" stroke="#fff" stroke-width="4"/><path d="M71 22C75 26 81 26 85 22" stroke="#3b8fe0" stroke-width="3.5"/>` +
    `<circle cx="78" cy="15" r="11"/>` +
    `<path d="M30 86L12 92L38 94Z" fill="#6b4228"/>` +
    `<path d="M28 88C20 66 32 46 50 36L64 44C58 56 58 72 70 88Z" fill="#8a5a3a"/>` +
    `<path d="M54 62L44 80L62 74Z" fill="#6b4228"/>` +
    `<ellipse cx="60" cy="35" rx="14" ry="10" fill="#8a5a3a" transform="rotate(-35 60 35)"/>` +
    dot(56, 33, 2.8) +
    `<ellipse cx="70.5" cy="27" rx="3" ry="2.2" fill="${INK}" stroke="none"/>` +
    `<path d="M66 33l6 2M65 36l5 4" stroke-width="2"/>` +
    `<path d="M49 38q-3-2-4 0" stroke-width="2.5"/>`,

  바다코끼리:
    `<path d="M22 72L4 84L24 90Z" fill="#9a5b3e"/><path d="M78 72L96 84L76 90Z" fill="#9a5b3e"/>` +
    `<path d="M14 92C10 62 28 46 50 46C72 46 90 62 86 92Z" fill="#b87a5a"/>` +
    `<path d="M30 70q4 4 0 8M70 70q-4 4 0 8" stroke="#9a5b3e" stroke-width="2.5"/>` +
    `<circle cx="50" cy="36" r="22" fill="#b87a5a"/>` +
    `<path d="M42 52L39 86L47 55Z" fill="#fff"/><path d="M58 52L61 86L53 55Z" fill="#fff"/>` +
    `<ellipse cx="41" cy="48" rx="10.5" ry="8" fill="#d9a080"/><ellipse cx="59" cy="48" rx="10.5" ry="8" fill="#d9a080"/>` +
    `<g fill="#6b4228" stroke="none"><circle cx="37" cy="46" r="1.5"/><circle cx="42" cy="50" r="1.5"/><circle cx="36" cy="51" r="1.5"/><circle cx="63" cy="46" r="1.5"/><circle cx="58" cy="50" r="1.5"/><circle cx="64" cy="51" r="1.5"/></g>` +
    dot(42, 30, 2.8) +
    dot(58, 30, 2.8) +
    `<path d="M47 39h6" stroke-width="3"/>`,

  범고래:
    WAVE +
    `<path d="M44 38L50 12L62 36Z" fill="${INK}"/>` +
    `<path d="M16 56L4 44L8 56L3 68Z" fill="${INK}"/>` +
    `<path d="M10 56C20 38 60 30 84 44C92 49 91 57 83 60C60 67 30 68 14 60Z" fill="${INK}"/>` +
    `<path d="M32 61C50 67 70 65 86 57C84 63 72 71 52 70C44 69 37 66 32 61Z" fill="#fff" stroke="none"/>` +
    `<ellipse cx="70" cy="45" rx="7.5" ry="3.8" fill="#fff" stroke="none" transform="rotate(-12 70 45)"/>` +
    `<path d="M56 62L48 78L66 66Z" fill="${INK}" stroke="#fff" stroke-width="2"/>` +
    `<circle cx="78" cy="51" r="1.8" fill="#fff" stroke="none"/>` +
    `<path d="M80 57q4 0 7-3" stroke="#fff" stroke-width="2"/>`,

  매:
    tube('M6 84H94', '#9a5b2e', 6) +
    `<path d="M38 70L30 92L46 90L48 72Z" fill="#4a5878"/>` +
    `<ellipse cx="52" cy="58" rx="17" ry="24" fill="#f5ecd8"/>` +
    `<path d="M50 48l3 2l3-2M56 57l3 2l3-2M48 57l3 2l3-2M52 66l3 2l3-2M58 66l3 2l3-2M54 74l3 2l3-2" stroke="#4a5878" stroke-width="2.2"/>` +
    `<path d="M40 38C28 50 30 74 46 82C52 70 52 50 40 38Z" fill="#4a5878"/>` +
    `<path d="M38 52q6 6 8 16" stroke="#7a8aa8" stroke-width="2.5"/>` +
    `<circle cx="56" cy="30" r="14" fill="#f5ecd8"/>` +
    `<path d="M42 32C40 16 60 12 68 22C62 22 58 26 57 32C52 30 46 34 42 32Z" fill="#4a5878"/>` +
    `<path d="M57 32C55 38 55 42 57 46C62 42 62 36 60 32Z" fill="#4a5878"/>` +
    `<circle cx="62" cy="27" r="4.5" fill="${HL}"/>` +
    dot(62.5, 27, 2.4) +
    `<path d="M68 24C75 23 79 29 76 37L73 33L68 32Z" fill="#5a6070"/>` +
    `<path d="M47 80v6M57 80v6" stroke="${HL}" stroke-width="4"/>`,

  벌새:
    `<path d="M92 4C90 12 86 18 82 21" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M78 20L73 40Q81 45 89 40L86 20Z" fill="#ff5c70"/>` +
    `<path d="M73 40l-3 4M89 40l3 4" stroke-width="3"/>` +
    `<path d="M40 32l-6-8M48 30l2-10M30 38l-9-4" stroke="#9aa6c4" stroke-width="3"/>` +
    `<ellipse cx="40" cy="38" rx="7" ry="17" fill="#dff3ff" transform="rotate(-35 40 38)"/>` +
    `<path d="M28 68L10 86L22 88L34 74Z" fill="#3a9e47"/>` +
    `<ellipse cx="38" cy="62" rx="18" ry="11" fill="#43b04a" transform="rotate(-35 38 62)"/>` +
    `<path d="M40 64C44 70 50 70 54 62" fill="#fff" stroke="none"/>` +
    `<ellipse cx="46" cy="36" rx="6" ry="15" fill="#dff3ff" transform="rotate(20 46 36)"/>` +
    `<path d="M56 52L74 42" stroke-width="2.8"/>` +
    `<circle cx="52" cy="50" r="9" fill="#43b04a"/>` +
    `<path d="M46 55C48 60 56 60 59 53C55 56 50 56 46 55Z" fill="#e8553d" stroke-width="2"/>` +
    dot(54, 48, 2.3),

  카나리아:
    `<path d="M16 86V44C16 14 84 14 84 44V86" stroke="#b8a070" stroke-width="3"/>` +
    `<path d="M28 86V25M40 86V18.5M60 86V18.5M72 86V25" stroke="#d8c8a0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="12" r="4" stroke="#b8a070" stroke-width="3"/>` +
    `<rect x="10" y="84" width="80" height="9" rx="3" fill="#c89a3a"/>` +
    `<path d="M20 72H80" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M38 62L22 78L32 80L44 66Z" fill="#f2c14e"/>` +
    `<ellipse cx="50" cy="56" rx="17" ry="14" fill="#ffd23f"/>` +
    `<path d="M36 52C44 46 56 52 58 62C50 66 40 62 36 52Z" fill="#f2c14e"/>` +
    `<circle cx="62" cy="38" r="12" fill="#ffd23f"/>` +
    `<path d="M73 35L81 38L73 42Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    dot(66, 36, 2.8) +
    `<circle cx="65" cy="43" r="3.5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<path d="M47 69v4M55 69v4" stroke="#ff9f1a" stroke-width="3"/>`,

  꿩:
    `<path d="M40 58L3 80L7 88L45 70Z" fill="#c89a5a"/>` +
    `<path d="M14 75l4 7M22 70l4 7M30 65l4 7" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M50 72L48 88M60 72L62 88" stroke="#8a96b0" stroke-width="4"/>` +
    `<ellipse cx="54" cy="62" rx="20" ry="14" fill="#c0642a"/>` +
    `<path d="M38 58C46 52 60 54 64 62C56 70 44 70 38 58Z" fill="#9a5b2e"/>` +
    `<g fill="#f2e3c8" stroke="none"><circle cx="46" cy="60" r="1.8"/><circle cx="53" cy="62" r="1.8"/><circle cx="50" cy="66" r="1.8"/></g>` +
    `<path d="M62 54C64 44 66 36 68 30L80 32C78 40 76 48 74 58Z" fill="#2e7d5b"/>` +
    `<path d="M64 46Q70 49 77 47" stroke="#fff" stroke-width="4"/>` +
    `<path d="M69 20L64 11L73 18Z" fill="#2e7d5b"/>` +
    `<circle cx="74" cy="26" r="9" fill="#2e7d5b"/>` +
    `<ellipse cx="76" cy="26" rx="4.5" ry="6" fill="#e8553d" stroke="none"/>` +
    dot(76, 25, 1.8) +
    `<path d="M82 24L89 27L82 30Z" fill="#f2e3c8" stroke-width="2.5"/>`,

  자라:
    `<ellipse cx="22" cy="70" rx="9" ry="5" fill="#b8c078" transform="rotate(-25 22 70)"/>` +
    `<ellipse cx="62" cy="72" rx="9" ry="5" fill="#b8c078" transform="rotate(25 62 72)"/>` +
    `<path d="M12 55L4 59L12 62Z" fill="#b8c078"/>` +
    tube('M66 54C76 50 78 42 82 38', '#b8c078', 8) +
    `<ellipse cx="42" cy="56" rx="32" ry="17" fill="#8a9a5a"/>` +
    `<ellipse cx="42" cy="54" rx="24" ry="11" fill="#9eae6a" stroke="none"/>` +
    `<g fill="#6a7a44" stroke="none"><circle cx="32" cy="50" r="2.5"/><circle cx="44" cy="48" r="2.5"/><circle cx="54" cy="54" r="2.5"/><circle cx="38" cy="58" r="2.5"/><circle cx="26" cy="56" r="2"/></g>` +
    `<path d="M86 32L96 30L95 35L88 38Z" fill="#b8c078"/>` +
    `<ellipse cx="81" cy="36" rx="9" ry="7" fill="#b8c078"/>` +
    `<path d="M86 32L90 31" stroke="#b8c078" stroke-width="3"/>` +
    dot(82, 34, 2.2) +
    `<path d="M80 40q4 2 8-1" stroke-width="2"/>`,

  이구아나:
    tube('M4 82H96', '#9a5b2e', 6) +
    tube('M24 66C10 66 5 72 7 78C9 83 16 83 16 77', '#5fc24a', 6) +
    `<path d="M12 66v6M18 65v6" stroke="#3a9e47" stroke-width="3"/>` +
    tube('M32 70L26 82', '#5fc24a', 4) +
    tube('M60 70L66 82', '#5fc24a', 4) +
    `<path d="M28 58L31 49L35 56L39 46L43 54L47 44L51 52L55 43L59 51L63 42L66 50L70 41L72 50Z" fill="#3a9e47"/>` +
    `<path d="M20 66C26 56 48 50 70 54L72 70C54 76 34 74 20 66Z" fill="#5fc24a"/>` +
    `<path d="M38 57v13M48 56v14" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M71 60C68 73 80 78 84 62Z" fill="#9ad26a"/>` +
    `<path d="M66 54C70 42 86 40 92 50C94 56 90 60 84 61L68 64Z" fill="#5fc24a"/>` +
    `<circle cx="75" cy="57" r="3" fill="#dff3ff" stroke-width="2"/>` +
    eye(81, 49, 3.8, 2.2) +
    `<path d="M84 57q4 0 7-3" stroke-width="2.2"/>`,

  청개구리:
    drop(14, 8) +
    drop(86, 6) +
    tube('M4 86Q50 78 96 88', '#9a5b2e', 5) +
    `<ellipse cx="22" cy="72" rx="12" ry="8" fill="#5fc24a"/><ellipse cx="78" cy="72" rx="12" ry="8" fill="#5fc24a"/>` +
    `<ellipse cx="50" cy="62" rx="23" ry="18" fill="#7ed957"/>` +
    `<ellipse cx="50" cy="68" rx="13" ry="10" fill="#f0f8d0" stroke="none"/>` +
    `<ellipse cx="50" cy="44" rx="27" ry="16" fill="#7ed957"/>` +
    `<circle cx="32" cy="32" r="10" fill="#7ed957"/><circle cx="68" cy="32" r="10" fill="#7ed957"/>` +
    eye(32, 31, 6.5, 3.8) +
    eye(68, 31, 6.5, 3.8) +
    `<path d="M24 44L36 46M76 44L64 46" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M38 50q12 8 24 0" stroke-width="3"/>` +
    cheeks(52, 16) +
    `<path d="M36 72L34 82M64 72L66 82" stroke-width="5" stroke="#5fc24a"/>` +
    `<g fill="#7ed957"><circle cx="30" cy="84" r="3.5"/><circle cx="36" cy="85" r="3.5"/><circle cx="64" cy="85" r="3.5"/><circle cx="70" cy="84" r="3.5"/><circle cx="12" cy="80" r="3.5"/><circle cx="88" cy="81" r="3.5"/></g>`,

  고등어:
    `<path d="M22 50L6 36L11 50L6 64Z" fill="#2f7fa0"/>` +
    `<path d="M42 36L50 25L58 35Z" fill="#2f7fa0"/>` +
    `<path d="M46 64L50 72L58 64Z" fill="#dfe8f5"/>` +
    `<path d="M18 50C30 34 62 30 86 44C92 48 92 52 86 56C62 70 30 66 18 50Z" fill="#e8eef8"/>` +
    `<path d="M18 50C30 34 62 30 86 44C88 46 89 48 89 50C60 52 40 52 18 50Z" fill="#3a8fb0" stroke="none"/>` +
    `<path d="M30 43q3 3 0 6M38 39q3 4 0 10M46 37q3 5 0 12M54 36q3 5 0 13M62 37q3 5 0 12M70 40q3 4 0 9" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M18 50C30 34 62 30 86 44C92 48 92 52 86 56C62 70 30 66 18 50Z"/>` +
    `<path d="M76 43q-4 8 0 15" stroke-width="2.5"/>` +
    eye(82, 47, 4.5, 2.5) +
    `<path d="M66 55L56 60L66 60Z" fill="#8a96b0" stroke-width="2"/>`,

  꽁치:
    `<g transform="rotate(-18 50 50)">` +
    `<path d="M14 50L3 41L7 50L3 59Z" fill="#ffd23f"/>` +
    `<path d="M24 45L28 40L32 44ZM24 55L28 60L32 56Z" fill="#3b5fb0" stroke-width="2"/>` +
    `<path d="M9 50C24 40 64 38 82 44L96 49L82 54C64 62 24 60 9 50Z" fill="#eef3fa"/>` +
    `<path d="M9 50C24 40 64 38 82 44L96 49Q60 50 9 50Z" fill="#3b5fb0" stroke="none"/>` +
    `<path d="M9 50C24 40 64 38 82 44L96 49L82 54C64 62 24 60 9 50Z"/>` +
    `<path d="M88 50.5L96 49" stroke="${HL}" stroke-width="3"/>` +
    eye(78, 47.5, 3.8, 2.2) +
    `</g>`,

  멸치: anchovy(34, 24, 1.3, -8) + anchovy(70, 36, 1.3, 6) + anchovy(28, 54, 1.3, 4) + anchovy(66, 66, 1.3, -6) + anchovy(38, 82, 1.3, 2),

  갈치:
    `<path d="M93 30C86 18 72 20 60 29C44 40 38 58 24 64C16 68 10 71 5 74C12 79 20 80 30 76C46 68 52 54 68 46C78 41 86 42 93 37Z" fill="#eef3fa"/>` +
    `<path d="M64 31C52 38 44 50 36 58C30 64 20 68 10 72" stroke="#bcd4f0" stroke-width="3"/>` +
    `<path d="M93 31L96 33.5L93 36" stroke-width="2.5"/>` +
    eye(83, 30, 4.2, 2.4) +
    `<path d="M40 50l6-8M52 40l4-6" stroke="#fff" stroke-width="2.5"/>`,

  연어:
    `<path d="M2 84q8-7 16 0t16 0t16 0t16 0t16 0t16 0V96H2Z" fill="#7ec8f0"/>` +
    `<g transform="rotate(-28 50 50)">` +
    `<path d="M22 52L6 40L11 52L6 64Z" fill="#d9665a"/>` +
    `<path d="M48 38L54 29L60 38Z" fill="#d9665a"/>` +
    `<path d="M16 52C28 38 62 34 84 46C90 50 90 54 84 58C62 70 28 66 16 52Z" fill="#ff9a86"/>` +
    `<path d="M16 52C28 38 62 34 84 46C86 48 88 50 88 52C60 50 40 52 16 52Z" fill="#8a96b0" stroke="none"/>` +
    `<g fill="${INK}" stroke="none"><circle cx="36" cy="45" r="1.6"/><circle cx="46" cy="42" r="1.6"/><circle cx="56" cy="42" r="1.6"/><circle cx="66" cy="44" r="1.6"/><circle cx="42" cy="48" r="1.6"/><circle cx="60" cy="47" r="1.6"/></g>` +
    `<path d="M16 52C28 38 62 34 84 46C90 50 90 54 84 58C62 70 28 66 16 52Z"/>` +
    eye(79, 48, 4, 2.3) +
    `<path d="M86 56q2 4-3 5" stroke-width="2.5"/>` +
    `</g>` +
    drop(22, 70, 0.8) +
    drop(76, 70, 0.8),

  참치:
    `<path d="M18 50L4 26Q14 50 4 74Z" fill="#2a3f7a"/>` +
    `<path d="M36 38L44 25L52 36Z" fill="#2a3f7a"/>` +
    `<path d="M52 36L60 18L64 36Z" fill="${HL}"/>` +
    `<path d="M52 64L60 82L64 64Z" fill="${HL}"/>` +
    `<path d="M14 50C24 30 56 28 80 38C90 42 94 48 94 50C94 52 90 58 80 62C56 72 24 70 14 50Z" fill="#dfe8f5"/>` +
    `<path d="M14 50C24 30 56 28 80 38C90 42 94 48 94 50Q50 48 14 50Z" fill="#2a3f7a" stroke="none"/>` +
    `<path d="M14 50C24 30 56 28 80 38C90 42 94 48 94 50C94 52 90 58 80 62C56 72 24 70 14 50Z"/>` +
    `<g fill="${HL}" stroke-width="1.8"><path d="M22 41l3-5l2 5Z"/><path d="M29 37l3-5l2 5Z"/><path d="M22 59l3 5l2-5Z"/><path d="M29 63l3 5l2-5Z"/></g>` +
    `<path d="M66 52L52 58L66 56Z" fill="#2a3f7a" stroke-width="2.2"/>` +
    eye(82, 46, 4.5, 2.5) +
    `<path d="M86 55q4 0 7-3" stroke-width="2.2"/>`,

  붕어:
    `<path d="M28 50L8 34C12 44 12 56 8 66Z" fill="#a8822e"/>` +
    `<path d="M36 32C44 16 60 16 68 28Z" fill="#a8822e"/>` +
    `<path d="M48 72L44 84L60 74Z" fill="#a8822e"/>` +
    `<ellipse cx="54" cy="50" rx="30" ry="24" fill="#d9b04a"/>` +
    `<path d="M36 40q4 4 8 0q4 4 8 0q4 4 8 0M32 50q4 4 8 0q4 4 8 0q4 4 8 0M36 60q4 4 8 0q4 4 8 0q4 4 8 0" stroke="#a8822e" stroke-width="2.5"/>` +
    `<path d="M68 34q-5 16 0 32" stroke-width="2.5"/>` +
    eye(76, 44, 5, 2.8) +
    `<path d="M84 55q-3 2 0 4" stroke-width="2.5"/>` +
    bubbles([
      [92, 36, 3],
      [90, 24, 2.2],
    ]),

  잉어:
    `<path d="M20 50L4 36C8 44 8 56 4 64Z" fill="#fff"/>` +
    `<path d="M34 38C42 26 58 26 66 36Z" fill="#fff"/>` +
    `<path d="M14 50C24 36 62 32 82 42C90 46 90 54 82 58C62 68 24 64 14 50Z" fill="#fff"/>` +
    `<path d="M30 42C40 34 56 36 58 46C52 54 38 52 30 42Z" fill="#ff7a3a" stroke="none"/>` +
    `<path d="M64 37C72 38 80 41 84 45C80 50 72 49 66 46Z" fill="#ff7a3a" stroke="none"/>` +
    `<path d="M24 54C30 58 36 60 42 58" stroke="#ff7a3a" stroke-width="5"/>` +
    `<path d="M14 50C24 36 62 32 82 42C90 46 90 54 82 58C62 68 24 64 14 50Z"/>` +
    `<path d="M5 44L4 36C8 44 8 56 4 64L5 56" stroke="#ff7a3a" stroke-width="2.5"/>` +
    `<path d="M60 58L52 70L66 62Z" fill="#fff"/>` +
    `<path d="M86 54q5 4 3 11M84 56q0 7-5 10" stroke-width="2.5"/>` +
    eye(76, 46, 4, 2.3),

  메기:
    `<path d="M16 54L4 42V66Z" fill="#4a5060"/>` +
    `<path d="M22 60C36 72 50 72 62 64Z" fill="#4a5060"/>` +
    `<path d="M40 42L46 34L52 42Z" fill="#4a5060"/>` +
    `<path d="M12 54C18 44 40 40 60 40C76 38 90 44 92 54C92 62 80 66 64 66C40 66 20 64 12 54Z" fill="#6a7080"/>` +
    `<path d="M34 60C50 64 72 64 86 60" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M84 50C88 40 92 32 90 22M88 56C94 62 94 72 88 80M80 60C82 70 78 78 72 84" stroke-width="2.5"/>` +
    `<path d="M78 58q8 2 13-4" stroke-width="2.5"/>` +
    eye(78, 48, 3.5, 2),

  미꾸라지:
    `<path d="M4 90C20 80 80 80 96 90Z" fill="#9a7a4a"/>` +
    `<ellipse cx="12" cy="58" rx="6" ry="9" fill="#9a8448"/>` +
    tube('M16 58C26 46 36 68 48 58C58 50 66 46 78 50', '#b8a060', 12) +
    `<ellipse cx="80" cy="50" rx="9" ry="7.5" fill="#b8a060"/>` +
    `<g fill="#7a6630" stroke="none"><circle cx="24" cy="54" r="2"/><circle cx="36" cy="60" r="2"/><circle cx="46" cy="58" r="2"/><circle cx="58" cy="52" r="2"/><circle cx="68" cy="49" r="2"/></g>` +
    `<path d="M88 51l7 1M88 53l5 5M86 55l2 6" stroke-width="2"/>` +
    dot(82, 47, 2.2) +
    `<path d="M22 86l3-2M60 86l3-2M76 88l3-2" stroke="#6b5230" stroke-width="2.5"/>`,

  열대어:
    tube('M14 94C8 80 20 72 12 58', '#43b04a', 5) +
    tube('M88 94C94 82 84 76 90 66', '#43b04a', 5) +
    `<path d="M28 50L12 38V62Z" fill="#ff9f1a"/>` +
    `<path d="M38 32C40 14 56 6 64 28Z" fill="#ff9f1a"/>` +
    `<path d="M38 68C40 86 56 94 64 72Z" fill="#ff9f1a"/>` +
    `<ellipse cx="54" cy="50" rx="28" ry="22" fill="#ffd23f"/>` +
    `<path d="M40 34V66M60 31V69" stroke="#3b78e6" stroke-width="7"/>` +
    `<ellipse cx="54" cy="50" rx="28" ry="22"/>` +
    eye(72, 44, 5, 2.8) +
    `<path d="M80 56q-3 2 0 4" stroke-width="2.5"/>` +
    bubbles([
      [86, 28, 3],
      [82, 16, 2.2],
    ]),

  성게:
    `<path d="M4 88C20 82 80 82 96 88V93H4Z" fill="#f2e3c8"/>` +
    `<path d="${spikes(50, 54, 25, 39, 22)}" fill="#6a3a8a" stroke-width="2.5"/>` +
    `<circle cx="50" cy="54" r="26" fill="#8e4fc9"/>` +
    `<g fill="#b98ae0" stroke="none"><circle cx="40" cy="44" r="3"/><circle cx="54" cy="40" r="3"/><circle cx="62" cy="52" r="3"/><circle cx="44" cy="58" r="3"/><circle cx="56" cy="66" r="3"/><circle cx="36" cy="66" r="2.5"/></g>`,

  전복:
    `<path d="M8 62C8 44 28 30 54 30C78 30 94 44 92 60C90 78 68 88 44 86C24 84 8 76 8 62Z" fill="#f2dc9a"/>` +
    `<path d="M12 64q4 4 0 8M24 78q4 2 6 6M44 84q4-2 8 0M70 80q2-4 6-4M86 68q-2-4 2-8" stroke="#c8a860" stroke-width="2.5"/>` +
    `<path d="M14 58C12 40 32 28 56 30C76 32 88 42 86 56C84 72 66 80 46 78C28 76 15 70 14 58Z" fill="#8a8458"/>` +
    `<path d="M20 70C30 76 50 80 66 76" stroke="#8ad8d0" stroke-width="3.5"/>` +
    `<path d="M26 60C28 50 40 44 56 44C66 44 72 50 72 56M36 66C42 58 52 56 62 58" stroke="#6b6640" stroke-width="2.5"/>` +
    `<path d="M74 62c-4 0-6-4-3-7c4-4 10-1 10 4c0 7-9 10-14 6" stroke="#6b6640" stroke-width="2.5"/>` +
    [
      [22, 50],
      [28, 43],
      [36, 38],
      [45, 35],
      [54, 34],
      [63, 35],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#b8b080" stroke-width="2.5"/>` + dot(x, y, 1.8))
      .join(''),

  소라:
    `<path d="M52 8C64 18 78 34 81 50C84 66 76 82 58 86C42 90 26 84 22 70C20 60 28 52 36 50C40 36 45 22 52 8Z" fill="#c89a6a"/>` +
    `<path d="M45 28C52 30 57 28 59 24M37 46C51 50 65 46 72 38M28 62C46 70 70 66 81 56" stroke="#9a6a40" stroke-width="3"/>` +
    `<g fill="#e0b888" stroke-width="2.5"><path d="M60 26l8-4l-2 8Z"/><path d="M72 40l9-3l-4 8Z"/><path d="M80 56l10 0l-7 7Z"/><path d="M44 28l-6-4l1 8Z"/><path d="M36 46l-8-2l4 7Z"/></g>` +
    `<ellipse cx="38" cy="74" rx="13" ry="10" fill="#ffb3a0"/>` +
    `<ellipse cx="40" cy="75" rx="7" ry="5.5" fill="#e88a7a" stroke="none"/>`,

  홍합:
    `<path d="M18 14C28 8 40 16 46 30C54 48 52 70 42 78C32 84 22 76 20 62C18 46 12 24 18 14Z" fill="#2f3a5a"/>` +
    `<path d="M24 24C30 40 34 56 34 72M30 20C38 32 44 48 44 64" stroke="#5a6a8a" stroke-width="2.5"/>` +
    `<path d="M82 22C74 14 62 22 58 36C52 54 54 76 64 86C74 92 86 84 88 68C90 52 90 30 82 22Z" fill="#2f3a5a"/>` +
    `<path d="M80 30C72 28 66 38 64 48C62 62 64 76 70 81C78 85 83 76 83 64C85 50 85 34 80 30Z" fill="#ff9f5a"/>` +
    `<path d="M72 36C68 50 68 66 74 78" stroke="#e8763a" stroke-width="3"/>`,

  가리비:
    `<path d="M50 78L28 74L30 90L50 90Z" fill="#ff7a8a"/><path d="M50 78L72 74L70 90L50 90Z" fill="#ff7a8a"/>` +
    `<path d="${SC.d}" fill="#ff8a7a"/>` +
    `<path d="M22 44A40 40 0 0 1 78 44" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    `<path d="${SC.ribs}" stroke="#d8453d" stroke-width="3"/>` +
    `<path d="M30 80l2 8M70 80l-2 8" stroke="#d8453d" stroke-width="2.5"/>`,

  낙지:
    [
      'M46 50C34 58 20 56 10 66q-5 6 2 9',
      'M47 53C40 68 26 74 20 88q4 5 8 0',
      'M49 55C46 72 42 82 38 92',
      'M51 55C54 72 58 82 62 92',
      'M53 53C60 68 74 74 80 88q-4 5-8 0',
      'M54 50C66 58 80 56 90 66q5 6-2 9',
      'M52 48C66 44 80 40 92 46',
      'M48 48C34 44 20 40 8 46',
    ]
      .map((d) => tube(d, '#e07a50', 3.5))
      .join('') +
    `<ellipse cx="50" cy="26" rx="14" ry="20" fill="#e07a50"/>` +
    `<ellipse cx="50" cy="48" rx="13" ry="8" fill="#e07a50"/>` +
    eye(44, 46, 4, 2.2) +
    eye(56, 46, 4, 2.2) +
    `<g fill="#f2a88a" stroke="none"><circle cx="44" cy="18" r="3"/><circle cx="56" cy="26" r="2.5"/></g>`,

  주꾸미:
    [
      'M36 58C26 64 18 74 22 82q4 4 7 0',
      'M42 62C36 72 32 80 36 86q4 3 6-1',
      'M48 64C46 74 46 82 50 88',
      'M54 64C56 74 58 82 62 86q4 2 5-3',
      'M60 62C66 72 72 78 78 80q4-1 3-5',
      'M64 58C74 62 82 70 80 78',
    ]
      .map((d) => tube(d, '#a8705a', 6))
      .join('') +
    `<path d="M32 40C32 18 68 18 68 40C70 54 62 64 50 64C38 64 30 54 32 40Z" fill="#a8705a"/>` +
    `<circle cx="30" cy="58" r="6.5" fill="${HL}"/>` +
    dot(30, 58, 3) +
    `<circle cx="70" cy="58" r="6.5" fill="${HL}"/>` +
    dot(70, 58, 3) +
    eye(43, 48, 4.5, 2.4) +
    eye(57, 48, 4.5, 2.4) +
    `<g fill="#c8907a" stroke="none"><circle cx="44" cy="30" r="3"/><circle cx="56" cy="34" r="2.5"/></g>`,

  꽃게:
    [
      'M34 58L20 64L14 74',
      'M38 62L26 72L24 82',
      'M66 58L80 64L86 74',
      'M62 62L74 72L76 82',
    ]
      .map((d) => tube(d, '#6a7ab8', 3))
      .join('') +
    `<ellipse cx="30" cy="80" rx="7" ry="4" fill="#6a7ab8" transform="rotate(40 30 80)"/><ellipse cx="70" cy="80" rx="7" ry="4" fill="#6a7ab8" transform="rotate(-40 70 80)"/>` +
    tube('M34 44L24 28', '#6a7ab8', 5) +
    tube('M66 44L76 28', '#6a7ab8', 5) +
    `<path d="M24 30C12 30 8 18 12 8L18 16L22 6C30 12 32 26 24 30Z" fill="#6a7ab8"/>` +
    `<path d="M76 30C88 30 92 18 88 8L82 16L78 6C70 12 68 26 76 30Z" fill="#6a7ab8"/>` +
    `<path d="M12 8L18 16L22 6ZM88 8L82 16L78 6Z" fill="#e85d9a" stroke-width="2"/>` +
    `<path d="M44 38L42 30M56 38L58 30" stroke-width="3"/>` +
    `<path d="M4 44L20 40C32 32 68 32 80 40L96 44L82 50C76 64 62 70 50 70C38 70 24 64 18 50Z" fill="#7d8cc8"/>` +
    `<g fill="#c8d2f0" stroke="none"><circle cx="36" cy="48" r="3"/><circle cx="50" cy="44" r="3"/><circle cx="64" cy="48" r="3"/><circle cx="44" cy="58" r="2.5"/><circle cx="56" cy="58" r="2.5"/></g>` +
    eye(42, 30, 3.5, 2) +
    eye(58, 30, 3.5, 2),

  랍스터:
    `<path d="M44 34C34 44 16 56 8 84M56 34C66 44 84 56 92 84" stroke="#b83a28" stroke-width="3"/>` +
    [
      'M40 50L30 54L28 60',
      'M40 56L30 62L30 68',
      'M60 50L70 54L72 60',
      'M60 56L70 62L70 68',
    ]
      .map((d) => tube(d, '#d63c2a', 2.5))
      .join('') +
    tube('M42 40L32 32', '#d63c2a', 7) +
    tube('M58 40L68 32', '#d63c2a', 7) +
    `<path d="M34 36C16 42 4 26 8 6L18 16L24 3C38 10 44 30 34 36Z" fill="#d63c2a"/>` +
    `<path d="M66 36C84 42 96 26 92 6L82 16L76 3C62 10 56 30 66 36Z" fill="#d63c2a"/>` +
    `<path d="M50 86L38 96L46 96L50 92L54 96L62 96Z" fill="#d63c2a"/>` +
    `<ellipse cx="50" cy="84" rx="8" ry="5" fill="#d63c2a"/><ellipse cx="50" cy="76" rx="9.5" ry="5" fill="#d63c2a"/><ellipse cx="50" cy="68" rx="11" ry="5" fill="#d63c2a"/>` +
    `<ellipse cx="50" cy="48" rx="13" ry="17" fill="#d63c2a"/>` +
    eye(44, 38, 4, 2.2) +
    eye(56, 38, 4, 2.2) +
    `<path d="M45 48q5 4 10 0" stroke-width="2.5"/>`,

  산호:
    `<path d="M4 90C20 84 80 84 96 90V94H4Z" fill="#f2e3c8"/>` +
    tube('M50 88V62M50 74L34 58L30 38M34 58L18 48M50 62L64 44L62 24M64 44L80 36M58 54L50 40M30 38L22 26M62 24L72 14', '#ff7a8a', 9) +
    `<g fill="#ffc0c8" stroke="none"><circle cx="30" cy="38" r="2"/><circle cx="62" cy="24" r="2"/><circle cx="50" cy="72" r="2"/><circle cx="78" cy="37" r="2"/><circle cx="20" cy="49" r="2"/></g>` +
    blob('#ff9f1a', [
      [84, 80, 8],
      [90, 72, 5],
    ]) +
    blob('#a45cf0', [
      [14, 80, 7],
      [10, 72, 4],
    ]),

  말미잘:
    `<path d="M8 94C14 82 86 82 92 94Z" fill="#8a96b0"/>` +
    [
      'M30 52C18 46 12 36 16 24',
      'M36 50C30 38 30 26 36 16',
      'M44 48C42 34 44 22 48 10',
      'M52 48C56 34 58 24 56 12',
      'M60 50C66 38 70 28 66 16',
      'M68 52C80 46 86 36 84 24',
      'M28 56C16 56 8 50 6 40',
      'M72 56C84 56 92 50 94 40',
    ]
      .map((d) => tube(d, '#ff9aa8', 6))
      .join('') +
    `<path d="M30 88C32 72 28 62 26 54H74C72 62 68 72 70 88Z" fill="#ff7a5a"/>` +
    `<path d="M40 60V84M50 60V86M60 60V84" stroke="#e8553d" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="54" rx="25" ry="7" fill="#ffb3c4"/>` +
    `<ellipse cx="50" cy="54" rx="7" ry="2.5" fill="#e85d9a" stroke-width="2"/>`,

  말벌:
    `<ellipse cx="44" cy="30" rx="8" ry="20" fill="#dff3ff" transform="rotate(-40 44 30)"/>` +
    `<ellipse cx="56" cy="28" rx="7" ry="18" fill="#dff3ff" transform="rotate(-15 56 28)"/>` +
    `<path d="M52 64L46 80M58 64L60 82M64 62L72 78" stroke="${HL}" stroke-width="3"/>` +
    `<path d="M5 64L14 60L14 68Z" fill="${INK}"/>` +
    `<path d="M46 58C40 44 18 46 10 64C18 80 40 76 46 62Z" fill="#ffb020"/>` +
    `<path d="M20 51C22 60 22 70 20 77M30 48C32 58 32 70 30 78M39 49C41 56 41 66 39 73" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M46 58C40 44 18 46 10 64C18 80 40 76 46 62Z"/>` +
    `<ellipse cx="56" cy="58" rx="10" ry="9" fill="#5a3b24"/>` +
    `<path d="M76 44C78 34 84 30 90 30" stroke-width="2.5"/>` +
    `<circle cx="74" cy="54" r="11" fill="#e8862e"/>` +
    `<ellipse cx="77" cy="51" rx="4.5" ry="5.5" fill="${INK}" stroke="none"/>` +
    `<path d="M80 62q4-1 5-4" stroke-width="2.5"/>`,

  나방:
    `<path d="M86 6a9 9 0 1 0 8 14a7 7 0 1 1-8-14Z" fill="#ffd23f"/>` +
    mirror(
      `<path d="M54 40L92 26C96 40 90 54 80 58L54 56Z" fill="#c8a878"/>` +
        `<path d="M54 56L80 62C84 76 72 86 62 80L52 64Z" fill="#b8966a"/>` +
        `<path d="M60 44L84 36M60 50L86 48" stroke="#9a7a50" stroke-width="2.5"/>` +
        `<circle cx="76" cy="46" r="5" fill="#fff5e0"/>` +
        dot(76, 46, 2.5, '#6b4a30') +
        `<path d="M53 27C58 18 66 12 74 12C72 18 62 24 53 27Z" fill="#8a6a48" stroke-width="2.5"/>`,
    ) +
    `<ellipse cx="50" cy="54" rx="7" ry="22" fill="#8a6a48"/>` +
    `<path d="M44 50h12M44 58h12M45 66h10" stroke="#6b4a30" stroke-width="2.5"/>` +
    `<circle cx="50" cy="32" r="7" fill="#8a6a48"/>` +
    dot(47, 31, 1.8) +
    dot(53, 31, 1.8),

  귀뚜라미:
    `<path d="M78 46C68 22 44 10 16 16M82 46C80 24 66 10 48 6" stroke-width="2.5"/>` +
    `<path d="M16 58L4 52M16 62L4 68" stroke-width="2.5"/>` +
    `<path d="M60 64L58 78L54 80M70 62L74 76L78 78" stroke-width="3"/>` +
    `<ellipse cx="44" cy="60" rx="28" ry="12" fill="#4a3326"/>` +
    `<path d="M18 56C30 44 58 44 70 52L20 60Z" fill="#6b4a30"/>` +
    `<path d="M28 52l8 4M40 49l6 5M52 49l4 4" stroke="#9a7a50" stroke-width="2.5"/>` +
    tube('M44 62L28 40', '#3d2a20', 8) +
    tube('M28 40L18 80L28 82', '#3d2a20', 3) +
    `<circle cx="78" cy="56" r="12" fill="#3d2a20"/>` +
    eye(81, 52, 4, 2.2) +
    `<path d="M4 30q4-6 10-4M8 38q2-4 6-4" stroke="#9aa6c4" stroke-width="3"/>`,

  여치:
    `<path d="M80 40C76 18 56 6 30 10C18 12 10 20 12 30M84 42C86 22 78 8 62 4" stroke-width="2.5"/>` +
    `<path d="M58 68L54 84L50 86M68 66L72 82L76 84" stroke-width="3"/>` +
    `<ellipse cx="48" cy="60" rx="30" ry="15" fill="#7cc04a"/>` +
    `<path d="M30 50C40 42 62 42 72 50C64 58 40 60 30 50Z" fill="#b89058"/>` +
    `<g fill="#6b4a30" stroke="none"><circle cx="42" cy="50" r="2"/><circle cx="52" cy="48" r="2"/><circle cx="60" cy="51" r="2"/><circle cx="48" cy="54" r="1.8"/></g>` +
    `<path d="M26 64h10M22 58h8" stroke="#5aa03a" stroke-width="2.5"/>` +
    tube('M42 62L24 42', '#5aa03a', 8) +
    tube('M24 42L14 82L24 84', '#5aa03a', 3) +
    `<ellipse cx="80" cy="54" rx="12" ry="14" fill="#7cc04a"/>` +
    eye(83, 49, 4.5, 2.5) +
    `<path d="M82 62q4 2 7-1" stroke-width="2.5"/>`,

  사마귀:
    `<path d="M50 64L40 88M54 64L60 88M44 68L28 88M60 64L78 86" stroke-width="3"/>` +
    `<ellipse cx="36" cy="66" rx="24" ry="9" fill="#6cc04a" transform="rotate(-20 36 66)"/>` +
    `<path d="M14 72C26 60 44 56 58 58L20 76Z" fill="#4fa83a"/>` +
    tube('M54 62L64 32', '#6cc04a', 6) +
    `<path d="M64 20C60 10 58 6 52 4M70 20C74 10 80 6 86 6" stroke-width="2"/>` +
    `<path d="M56 20L80 18L68 34Z" fill="#6cc04a"/>` +
    `<circle cx="57" cy="20" r="4.5" fill="#b8e070"/><circle cx="79" cy="18" r="4.5" fill="#b8e070"/>` +
    dot(57, 20, 2.2) +
    dot(79, 18, 2.2) +
    tube('M63 40L78 52L70 60', '#6cc04a', 5) +
    tube('M60 42L72 56L64 64', '#5aa83a', 5),

  딱정벌레:
    `<path d="M30 52L14 46L8 36M28 64L12 66L6 76M32 76L20 86L20 94M70 52L86 46L92 36M72 64L88 66L94 76M68 76L80 86L80 94" stroke-width="3"/>` +
    `<path d="M44 20L38 8M56 20L62 8" stroke-width="2.5"/>` +
    dot(38, 8, 3) +
    dot(62, 8, 3) +
    `<path d="M26 46C26 78 40 92 50 92C60 92 74 78 74 46Z" fill="#2e9e7a"/>` +
    `<path d="M50 46V92" stroke-width="3"/>` +
    `<path d="M32 54C32 66 36 76 42 82M68 54C68 66 64 76 58 82" stroke="#9ae6c8" stroke-width="3" opacity=".6"/>` +
    `<ellipse cx="50" cy="40" rx="18" ry="9" fill="#1f5a4a"/>` +
    `<ellipse cx="50" cy="26" rx="10" ry="8" fill="#1f5a4a"/>` +
    dot(45, 24, 2.2, '#fff') +
    dot(55, 24, 2.2, '#fff'),

  민달팽이:
    `<path d="M4 84C30 72 72 72 96 82C72 94 30 94 4 84Z" fill="#43b04a"/>` +
    `<path d="M10 84C40 80 70 80 92 82" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M80 44L76 22M86 44L93 27" stroke-width="3.5"/>` +
    dot(76, 22, 4) +
    dot(93, 27, 4) +
    `<path d="M8 80C16 64 44 62 58 54C66 40 78 36 86 41C95 47 93 62 85 70C74 80 42 84 8 80Z" fill="#d9b890"/>` +
    `<path d="M40 68C44 56 58 50 70 52C72 62 60 68 40 68Z" fill="#c8a478"/>` +
    `<path d="M88 62l5 4M89 58l6 0" stroke-width="2.2"/>` +
    dot(83, 52, 2.4) +
    `<path d="M80 60q3 3 7 1" stroke-width="2.2"/>` +
    `<path d="M18 74q10-4 20-4" stroke="#fff" stroke-width="2.5" opacity=".6"/>`,

  젖소:
    `<g transform="translate(-2 -4)">` +
    `<path d="M18 44C12 48 11 58 12 66"/><path d="M8 64L12 74L16 64Z" fill="${INK}"/>` +
    legs([22, 33, 56, 66], 58, 9, 28, '#fff', '#3d3530') +
    `<path d="M38 66C38 78 52 78 52 66Z" fill="#ffb3c4"/>` +
    `<rect x="14" y="36" width="62" height="32" rx="15" fill="#fff"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="30" cy="47" rx="8" ry="6.5" transform="rotate(-20 30 47)"/><ellipse cx="54" cy="57" rx="9" ry="6.5" transform="rotate(15 54 57)"/><ellipse cx="60" cy="42" rx="6" ry="4.5"/></g>` +
    `<path d="M76 26C74 18 78 14 80 20Z" fill="#f2e3c8"/><path d="M90 26C92 18 88 14 86 20Z" fill="#f2e3c8"/>` +
    `<ellipse cx="71" cy="31" rx="8" ry="4.5" fill="${INK}" transform="rotate(-25 71 31)"/>` +
    `<ellipse cx="83" cy="38" rx="12" ry="14" fill="#fff"/>` +
    `<ellipse cx="84" cy="50" rx="11" ry="8" fill="#ffb3c4"/>` +
    dot(80, 50, 1.8) +
    dot(88, 50, 1.8) +
    dot(78, 36, 3) +
    dot(89, 36, 3) +
    `</g>` +
    `<path d="M36 84C36 76 58 76 58 84" stroke-width="3"/>` +
    `<path d="M34 82H60L57 96H37Z" fill="#b8c4dc"/>` +
    `<ellipse cx="47" cy="82" rx="13" ry="3" fill="#fff"/>` +
    `<path d="M43 76q1 3 0 4M50 76q1 3 0 4" stroke="#fff" stroke-width="3"/>`,

  황소:
    `<g transform="translate(-4 4)">` +
    `<path d="M18 44C12 48 11 58 12 66"/><path d="M8 64L12 76L16 64Z" fill="#5a3b24"/>` +
    legs([22, 33, 56, 66], 58, 10, 28, '#b8742a', '#3d3530') +
    `<path d="M14 52C14 40 22 34 34 34C44 34 54 26 66 28C76 30 78 40 76 50C76 64 70 68 60 68H28C18 68 14 62 14 52Z" fill="#c8862e"/>` +
    `<path d="M30 60q6 4 12 2M52 60q4 3 10 2" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M76 28C66 28 62 18 66 8C70 16 74 20 80 20Z" fill="#f2e3c8"/>` +
    `<path d="M90 28C100 28 102 18 98 8C94 16 90 20 84 20Z" fill="#f2e3c8"/>` +
    `<ellipse cx="72" cy="31" rx="7" ry="4" fill="#c8862e" transform="rotate(-25 72 31)"/>` +
    `<ellipse cx="84" cy="38" rx="12" ry="14" fill="#c8862e"/>` +
    `<path d="M78 26q6-4 12 0" stroke="#9a5b2e" stroke-width="3"/>` +
    `<ellipse cx="84" cy="50" rx="11" ry="8" fill="#e8b890"/>` +
    dot(80, 50, 1.8) +
    dot(88, 50, 1.8) +
    `<circle cx="84" cy="56" r="4.5" stroke="${HL}" stroke-width="3"/>` +
    dot(79, 36, 3) +
    dot(89, 36, 3) +
    `</g>`,

  소라게:
    [
      'M64 76L58 86L54 88',
      'M70 78L70 88L66 92',
      'M76 76L84 86L84 92',
    ]
      .map((d) => tube(d, '#e8553d', 3))
      .join('') +
    `<path d="M22 22L34 30L28 38Z" fill="#e8c9a0"/>` +
    `<circle cx="44" cy="52" r="28" fill="#e8c9a0"/>` +
    `<path d="M46 60c-7 0-10-8-4-12c7-4 15 1 14 9c-1 11-17 14-24 6c-8-9-3-24 10-27" stroke="#b08a60" stroke-width="3"/>` +
    `<ellipse cx="64" cy="70" rx="10" ry="8" fill="#6b4a30"/>` +
    `<ellipse cx="70" cy="70" rx="11" ry="8" fill="#e8553d"/>` +
    `<path d="M72 64L74 52M78 66L84 56" stroke-width="3"/>` +
    dot(74, 52, 3.2) +
    dot(84, 56, 3.2) +
    `<path d="M80 72C92 70 96 78 90 84C86 88 80 84 80 80Z" fill="#e8553d"/>` +
    `<path d="M90 84l-4-4" stroke-width="2.5"/>`,

  뱀장어:
    tube('M10 80C20 92 36 88 40 72C44 56 60 46 72 52C80 56 84 48 84 40', '#9aa6c4', 18) +
    `<path d="M10 80C20 92 36 88 40 72C44 56 60 46 72 52C80 56 84 48 84 40" stroke="#3d4a5c" stroke-width="12"/>` +
    `<ellipse cx="84" cy="34" rx="11" ry="8" fill="#3d4a5c" transform="rotate(-70 84 34)"/>` +
    `<path d="M82 48L92 52L84 56Z" fill="#9aa6c4" stroke-width="2.5"/>` +
    dot(82, 30, 2.8, '#fff') +
    dot(82.5, 30.3, 1.5) +
    `<path d="M88 26q2 4 0 7" stroke="#fff" stroke-width="2"/>` +
    bubbles([
      [92, 16, 3],
      [84, 10, 2.2],
      [62, 30, 2.5],
    ]),

  호랑나비:
    mirror(
      `<path d="M54 46L88 14C96 28 94 44 84 52L54 54Z" fill="#ffd23f" stroke-width="5"/>` +
        `<path d="M64 38L66 50M74 29L76 51M82 22L84 46" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M54 56L84 58C88 70 78 80 68 78L66 92L60 78L54 64Z" fill="#ffd23f" stroke-width="5"/>` +
        `<circle cx="76" cy="68" r="3" fill="#3b78e6" stroke="none"/>` +
        `<circle cx="60" cy="72" r="3.5" fill="#ff7a3a" stroke-width="2"/>`,
    ) +
    `<path d="M48 30C44 20 40 14 34 10M52 30C56 20 60 14 66 10" stroke-width="2.5"/>` +
    dot(34, 10, 3) +
    dot(66, 10, 3) +
    `<ellipse cx="50" cy="54" rx="4.5" ry="22" fill="${INK}"/>` +
    `<circle cx="50" cy="31" r="5.5" fill="${INK}"/>`,

  쇠똥구리:
    `<path d="M4 90H96" stroke="#9a5b2e" stroke-width="4"/>` +
    `<circle cx="32" cy="62" r="26" fill="#8b5a2b"/>` +
    `<g fill="#6b4222" stroke="none"><circle cx="22" cy="54" r="3"/><circle cx="36" cy="48" r="2.5"/><circle cx="28" cy="70" r="3"/><circle cx="42" cy="66" r="2.5"/></g>` +
    `<path d="M60 52L52 40M64 48L56 32" stroke-width="3.5"/>` +
    `<path d="M80 76L88 90M72 80L72 90M86 70L96 80" stroke-width="3.5"/>` +
    `<ellipse cx="70" cy="62" rx="20" ry="13" fill="#2f2a33" transform="rotate(45 70 62)"/>` +
    `<path d="M60 52l19 19" stroke="#5a5566" stroke-width="2.5"/>` +
    `<path d="M78 72C92 72 96 84 90 90C84 90 78 84 76 78Z" fill="#2f2a33"/>` +
    `<path d="M90 90l4-3M86 91l5 0" stroke-width="2"/>` +
    dot(85, 80, 2, '#fff'),

  하늘소:
    `<path d="M46 24C30 4 10 8 8 44M54 24C70 4 90 8 92 44" stroke-width="5"/>` +
    `<path d="M46 24C30 4 10 8 8 44M54 24C70 4 90 8 92 44" stroke="#bfe0f5" stroke-width="2.5" stroke-dasharray="4 5"/>` +
    `<path d="M36 50L22 44L18 34M36 62L20 66L14 76M38 74L28 86L28 94M64 50L78 44L82 34M64 62L80 66L86 76M62 74L72 86L72 94" stroke-width="3"/>` +
    `<path d="M34 42C34 74 42 92 50 92C58 92 66 74 66 42Z" fill="#2f2a33"/>` +
    `<path d="M50 44V92" stroke="#5a5566" stroke-width="2.5"/>` +
    `<g fill="#fff" stroke="none"><circle cx="41" cy="52" r="2.8"/><circle cx="58" cy="50" r="2.8"/><circle cx="44" cy="64" r="2.8"/><circle cx="57" cy="66" r="2.8"/><circle cx="42" cy="78" r="2.5"/><circle cx="56" cy="80" r="2.5"/></g>` +
    `<ellipse cx="50" cy="37" rx="12" ry="7" fill="#2f2a33"/>` +
    `<path d="M38 37h-4M62 37h4" stroke-width="3"/>` +
    `<ellipse cx="50" cy="26" rx="8" ry="7" fill="#2f2a33"/>` +
    dot(46, 25, 1.8, '#fff') +
    dot(54, 25, 1.8, '#fff'),

  바다거북:
    bubbles([
      [86, 12, 3],
      [92, 22, 2.2],
    ]) +
    `<g transform="rotate(20 50 54)">` +
    `<path d="M34 40C22 28 10 22 4 26C8 38 20 48 36 50Z" fill="#9ab880"/>` +
    `<path d="M66 40C78 28 90 22 96 26C92 38 80 48 64 50Z" fill="#9ab880"/>` +
    `<ellipse cx="34" cy="80" rx="10" ry="5" fill="#9ab880" transform="rotate(40 34 80)"/>` +
    `<ellipse cx="66" cy="80" rx="10" ry="5" fill="#9ab880" transform="rotate(-40 66 80)"/>` +
    `<ellipse cx="50" cy="24" rx="9" ry="10" fill="#9ab880"/>` +
    dot(45, 22, 2.4) +
    dot(55, 22, 2.4) +
    `<path d="M46 28q4 3 8 0" stroke-width="2.2"/>` +
    `<ellipse cx="50" cy="58" rx="24" ry="28" fill="#5a8a4a"/>` +
    `<path d="M44 46L56 46L60 58L56 70L44 70L40 58Z" fill="#7aa85e" stroke="#3f6a34" stroke-width="2.5"/>` +
    `<path d="M44 46L36 36M56 46L64 36M40 58H27M60 58H73M44 70L36 80M56 70L64 80" stroke="#3f6a34" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="58" rx="24" ry="28"/>` +
    `</g>`,

  박새:
    tube('M6 84H94', '#9a5b2e', 6) +
    `<path d="M36 64L20 82L30 84L42 70Z" fill="#4a5878"/>` +
    `<ellipse cx="52" cy="60" rx="18" ry="20" fill="#ffd23f"/>` +
    `<path d="M36 48C30 60 34 74 46 78C50 66 48 54 36 48Z" fill="#7a8aa8"/>` +
    `<path d="M38 60q4 4 7 4" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M58 46C62 56 62 68 58 78" stroke="${INK}" stroke-width="7"/>` +
    `<circle cx="60" cy="34" r="14" fill="${INK}"/>` +
    `<ellipse cx="61" cy="39" rx="8" ry="5.5" fill="#fff" stroke="none"/>` +
    dot(66, 30, 2.6, '#fff') +
    dot(66.5, 30.3, 1.4) +
    `<path d="M73 31L80 34L73 37Z" fill="${INK}"/>` +
    `<path d="M48 78v6M58 78v6" stroke="#8a96b0" stroke-width="3.5"/>`,

  종달새:
    `<path d="M84 16q6 4 4 10M90 8q9 8 4 20" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g transform="rotate(-30 50 54) translate(50 54) scale(1.12) translate(-48 -56)">` +
    `<path d="M28 56L8 46L10 66Z" fill="#9a7650"/>` +
    `<path d="M46 52C40 30 28 16 12 12C14 32 22 48 38 58Z" fill="#b08a5a"/>` +
    `<path d="M20 20l8 12M16 30l12 10M26 18l6 12" stroke="#8a6a40" stroke-width="2.5"/>` +
    `<ellipse cx="46" cy="58" rx="21" ry="12" fill="#c8a070"/>` +
    `<path d="M30 62C40 70 56 70 64 62" fill="#f2e3c8" stroke="none"/>` +
    `<path d="M40 52l2 3M48 50l2 3M56 52l2 3M44 60l2 3M52 60l2 3" stroke="#6b4a30" stroke-width="2.5"/>` +
    `<path d="M61 44L58 29L71 41Z" fill="#9a7650"/>` +
    `<circle cx="67" cy="51" r="10" fill="#c8a070"/>` +
    `<path d="M76 48L85 50L76 54Z" fill="#e8b890" stroke-width="2.5"/>` +
    dot(70, 49, 2.3) +
    `</g>`,
};
