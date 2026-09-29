// 그림 묶음: 미술 재료·편지와 카드·행사 물건·전통 놀이와 춤·악기·운동 옷·연장·농기구·그릇 (l3). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(지점토·클레이 / 편지지·편지봉투·초대장 / 생일카드·크리스마스카드 / 상장·졸업장 / 이름표·배지 /
// 사물놀이·농악 / 스톱워치·초시계 / 대접·종지 / 곡괭이·쇠스랑·호미)는 색·실루엣·곁들인 소품을 다르게 했다.
import { INK, SKIN, HL, dot, sparkle, tube, person, blob, drop } from '../pictureKit.ts';

const f1 = (n: number) => n.toFixed(1);

/** 별 (cx, cy 가운데, 바깥 R, 안쪽 r) */
const star = (cx: number, cy: number, R: number, r: number, fill: string, sw = 3) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push(`${f1(cx + rr * Math.cos(a))} ${f1(cy + rr * Math.sin(a))}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
};

/** 부채꼴 (cx, cy 가운데, 반지름 r, 각도 a1→a2, 화면 기준 도) */
const sector = (cx: number, cy: number, r: number, a1: number, a2: number, fill: string) => {
  const p = (a: number) => `${f1(cx + r * Math.cos((a * Math.PI) / 180))} ${f1(cy + r * Math.sin((a * Math.PI) / 180))}`;
  return `<path d="M${cx} ${cy}L${p(a1)}A${r} ${r} 0 0 1 ${p(a2)}Z" fill="${fill}"/>`;
};

/** 세워 둔 카드 (앞면 색 + 앞면 그림) */
const card = (front: string, art: string) =>
  `<path d="M70 14L90 22V92L70 86Z" fill="#fff"/>` +
  `<rect x="12" y="14" width="58" height="72" rx="3" fill="${front}"/>` +
  art;

/** 괘 (태극기): 가운데 (x, y), 막대 셋이 꽉 찼는지(true) 끊겼는지 */
const trigram = (x: number, y: number, rot: number, bars: boolean[]) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})" stroke-width="3.4" stroke-linecap="butt">` +
  bars
    .map((solid, i) => {
      const yy = (i - 1) * 4.6;
      return solid ? `<path d="M-6.5 ${yy}H6.5"/>` : `<path d="M-6.5 ${yy}H-1.3M1.3 ${yy}H6.5"/>`;
    })
    .join('') +
  `</g>`;

/** 스톱워치 몸체 (cx, cy, 반지름, 테두리 색) */
const watch = (cx: number, cy: number, r: number, caseFill: string) => {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const r1 = r - 7;
    const r2 = i % 3 ? r - 10 : r - 12;
    return `M${f1(cx + r1 * Math.sin(a))} ${f1(cy - r1 * Math.cos(a))}L${f1(cx + r2 * Math.sin(a))} ${f1(cy - r2 * Math.cos(a))}`;
  }).join('');
  return (
    `<circle cx="${cx}" cy="${cy - r - 12}" r="5" stroke-width="3.5"/>` +
    `<rect x="${cx - 5}" y="${cy - r - 8}" width="10" height="10" rx="2" fill="#8a96b0"/>` +
    `<rect x="${cx - 9}" y="${cy - r - 10}" width="18" height="6" rx="3" fill="#dfe8f5"/>` +
    `<g transform="rotate(40 ${cx} ${cy})"><rect x="${cx - 4}" y="${cy - r - 7}" width="8" height="9" rx="2" fill="#dfe8f5"/></g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${caseFill}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="#fff"/>` +
    `<path d="${ticks}" stroke-width="2.5"/>` +
    `<path d="M${cx} ${cy}L${f1(cx + (r - 12) * 0.64)} ${f1(cy - (r - 12) * 0.77)}" stroke="#e8403a" stroke-width="3.5"/>` +
    `<path d="M${cx} ${cy}V${cy - r + 14}" stroke-width="3"/>` +
    dot(cx, cy, 3)
  );
};

/** 그릇 옆모습 (cx, 위 cy, 너비 반 rx, 깊이 d, 속 색, 겉 색, 띠) */
const bowlSide = (cx: number, cy: number, rx: number, d: number, inside: string, body: string, band = '', foot = 0.3) =>
  `<path d="M${cx - rx * foot} ${cy + d - 3}L${cx - rx * foot - 1} ${cy + d + 5}H${cx + rx * foot + 1}L${cx + rx * foot} ${cy + d - 3}" fill="${body}"/>` +
  `<path d="M${cx - rx} ${cy}C${cx - rx} ${cy + d * 0.8} ${cx - rx * 0.5} ${cy + d} ${cx} ${cy + d}S${cx + rx} ${cy + d * 0.8} ${cx + rx} ${cy}Z" fill="${body}"/>` +
  (band ? `<path d="M${cx - rx + 5} ${cy + d * 0.35}Q${cx} ${cy + d * 0.62} ${cx + rx - 5} ${cy + d * 0.35}" stroke="${band}" stroke-width="4"/>` : '') +
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f1(rx * 0.26)}" fill="${inside}"/>`;

export const PICS: Record<string, string> = {
  물통:
    tube('M62 20C80 18 80 44 66 46', '#8a96b0', 4) +
    `<path d="M40 22L44 8H56L60 22Z" fill="#43b04a"/>` +
    `<path d="M50 8V2" stroke-width="5"/>` +
    `<rect x="36" y="18" width="28" height="10" rx="3" fill="#43b04a"/>` +
    `<path d="M32 28H68C72 28 74 32 74 36V88C74 92 70 94 66 94H34C30 94 26 92 26 88V36C26 32 28 28 32 28Z" fill="#e6f5ff"/>` +
    `<path d="M27 52Q38 47 50 52T73 52V88C73 91 70 93 66 93H34C30 93 27 91 27 88Z" fill="#7ec8f0" stroke="none"/>` +
    `<path d="M32 28H68C72 28 74 32 74 36V88C74 92 70 94 66 94H34C30 94 26 92 26 88V36C26 32 28 28 32 28Z"/>` +
    `<path d="M26 44H74M26 76H74" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M34 58V70" stroke="#fff" stroke-width="4"/>` +
    drop(86, 66, 1.1) +
    drop(14, 58, 0.9),
  수채화:
    `<rect x="12" y="6" width="76" height="58" rx="2" fill="#fff"/>` +
    `<path d="M17 11H83V38C72 33 62 40 50 35S28 32 17 39Z" fill="#7ec8f0" stroke="none" opacity=".55"/>` +
    `<circle cx="67" cy="23" r="8" fill="#ffc933" stroke="none" opacity=".6"/>` +
    `<path d="M17 59C24 40 38 40 50 49S72 40 83 45V59Z" fill="#43b04a" stroke="none" opacity=".5"/>` +
    `<path d="M30 58C34 48 42 46 46 52" stroke="#e85d9a" stroke-width="5" opacity=".5"/>` +
    `<ellipse cx="36" cy="81" rx="28" ry="13" fill="#fff"/>` +
    dot(22, 80, 5, '#e8553d') +
    dot(34, 75, 5, '#ffd23f') +
    dot(46, 76, 5, '#43b04a') +
    dot(38, 86, 5, '#3b8fe0') +
    tube('M94 58L72 82', '#e8862e', 4) +
    `<path d="M74 78L68 86L63 81L69 74Z" fill="#8a96b0" stroke-width="3"/>` +
    `<path d="M65 83L56 94Q56 88 62 80Z" fill="#3b8fe0" stroke-width="3"/>`,
  지점토:
    `<path d="M10 86C8 64 16 50 34 48S60 56 60 72L58 86Z" fill="#fbf8f1"/>` +
    `<path d="M50 50C58 44 64 50 60 58C56 54 54 52 50 50Z" fill="#fbf8f1"/>` +
    `<path d="M20 66q5-4 10 0M30 76q6-4 12 0M40 60q4-3 8 0" stroke="#d8d0bf" stroke-width="3"/>` +
    `<path d="M4 90H96" stroke="#c9d3e6" stroke-width="3"/>` +
    `<path d="M64 88C62 74 66 66 78 66S94 74 92 88Z" fill="#fbf8f1"/>` +
    `<circle cx="78" cy="50" r="12" fill="#fbf8f1"/><circle cx="69" cy="40" r="4.5" fill="#fbf8f1"/><circle cx="87" cy="40" r="4.5" fill="#fbf8f1"/>` +
    dot(74, 50, 2) +
    dot(82, 50, 2) +
    `<path d="M76 55q2 2 4 0" stroke-width="2"/>` +
    tube('M44 10L22 40', '#c98b4f', 4) +
    `<path d="M20 38L16 46L24 42Z" fill="#8a96b0" stroke-width="2.5"/>` +
    sparkle(62, 20, 5, '#dfe8f5'),
  클레이:
    `<circle cx="24" cy="30" r="12" fill="#e8553d"/>` +
    `<circle cx="50" cy="22" r="11" fill="#ffd23f"/>` +
    `<circle cx="76" cy="30" r="12" fill="#3b8fe0"/>` +
    `<path d="M26 22q4-3 8 0" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    tube('M12 56Q22 48 32 56T52 56', '#a45cf0', 7) +
    `<path d="M40 88C40 80 48 76 60 76H92V88Z" fill="#5fc24a"/>` +
    `<circle cx="70" cy="66" r="17" fill="#ff9f1a"/>` +
    `<path d="M70 66m-4 0a4 4 0 1 1 8 0a8 8 0 1 1 -16 0a12 12 0 1 1 24 0" stroke="#c9601a" stroke-width="3"/>` +
    `<path d="M44 78L40 64M50 78L50 64" stroke-width="3"/>` +
    dot(40, 62, 3) +
    dot(50, 62, 3) +
    `<path d="M42 84q3 2 6 0" stroke-width="2.5"/>`,
  메모지:
    `<rect x="24" y="20" width="60" height="60" rx="2" fill="#ff9aa8" transform="rotate(8 54 50)"/>` +
    `<rect x="18" y="16" width="60" height="60" rx="2" fill="#8fd3ff" transform="rotate(-4 48 46)"/>` +
    `<path d="M14 18H74V64L60 80H14Z" fill="#ffe46b"/>` +
    `<path d="M74 64L60 80C60 72 64 66 74 64Z" fill="#f2c14e"/>` +
    `<path d="M14 18H74V28H14Z" fill="#ffd23f"/>` +
    `<path d="M22 40H66M22 51H66M22 62H52" stroke="#e0a800" stroke-width="3"/>` +
    `<g transform="rotate(35 80 60)"><rect x="75" y="30" width="10" height="48" rx="2" fill="#3b78e6"/><path d="M75 78L80 90L85 78Z" fill="#ffd6ad"/><path d="M78.5 86L80 90L81.5 86Z" fill="${INK}"/></g>`,
  스탬프:
    `<rect x="6" y="62" width="88" height="32" rx="3" fill="#fff"/>` +
    star(26, 78, 11, 5, '#e8403a', 0) +
    star(50, 80, 11, 5, '#e8403a', 0) +
    `<circle cx="66" cy="18" r="11" fill="#c98b4f"/>` +
    `<rect x="61" y="26" width="10" height="14" fill="#c98b4f"/>` +
    `<rect x="48" y="38" width="36" height="12" rx="3" fill="#e0b27a"/>` +
    `<rect x="52" y="50" width="28" height="6" rx="2" fill="#e8403a"/>` +
    `<path d="M62 14q3-3 6-2" stroke="#e8b27a" stroke-width="3"/>` +
    `<path d="M44 60V54M88 60V54" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="12" y="24" width="30" height="18" rx="3" fill="#3b78e6"/><rect x="16" y="27" width="22" height="11" rx="2" fill="#2a2f52" stroke="none"/>`,
  편지지:
    `<rect x="24" y="8" width="60" height="80" rx="2" fill="#ffe0e6" transform="rotate(8 54 48)"/>` +
    `<rect x="16" y="10" width="60" height="82" rx="2" fill="#fffdf2"/>` +
    `<path d="M24 34H68M24 46H68M24 58H68M24 70H68M24 82H56" stroke="#9fb3d9" stroke-width="2.5"/>` +
    blob('#ff9aa8', [
      [26, 20, 4],
      [33, 20, 4],
      [29.5, 14, 4],
      [29.5, 25, 4],
    ]) +
    dot(29.5, 20, 2.5, HL) +
    `<path d="M40 20q3-5 7 0" stroke="#43b04a" stroke-width="3"/>` +
    `<g transform="rotate(30 84 64)"><rect x="80" y="36" width="8" height="42" rx="2" fill="#e85d9a"/><path d="M80 78L84 88L88 78Z" fill="#dfe8f5"/></g>`,
  편지봉투:
    `<rect x="8" y="24" width="84" height="56" rx="4" fill="#fff4dc"/>` +
    `<path d="M10 78L42 52M90 78L58 52" stroke="#e0c890" stroke-width="3"/>` +
    `<path d="M8 28C8 26 10 24 12 24H88C90 24 92 26 92 28L54 58C51 60 49 60 46 58Z" fill="#ffeac0"/>` +
    `<path d="M50 50C44 42 36 48 42 55L50 62L58 55C64 48 56 42 50 50Z" fill="#e8403a"/>` +
    `<rect x="72" y="62" width="14" height="12" rx="1" fill="#8fd3ff" stroke-width="2.5"/>`,
  생일카드:
    card(
      '#ff9aa8',
      `<rect x="22" y="56" width="38" height="20" rx="3" fill="#fff"/>` +
        `<path d="M22 62Q31 68 41 62T60 62" stroke="#e8553d" stroke-width="4"/>` +
        `<rect x="30" y="44" width="5" height="12" fill="#7ec8f0" stroke-width="2.5"/><rect x="47" y="44" width="5" height="12" fill="${HL}" stroke-width="2.5"/>` +
        `<path d="M32.5 34c-3 4-3 7 0 7s3-3 0-7ZM49.5 34c-3 4-3 7 0 7s3-3 0-7Z" fill="#ff9f1a" stroke-width="2.5"/>` +
        `<ellipse cx="58" cy="28" rx="7" ry="9" fill="#3b8fe0" stroke-width="2.5"/><path d="M58 37q-3 5 1 9" stroke-width="2"/>` +
        `<ellipse cx="22" cy="28" rx="6" ry="8" fill="#ffd23f" stroke-width="2.5"/><path d="M22 36q3 4 0 8" stroke-width="2"/>`,
    ) + sparkle(82, 16, 6),
  크리스마스카드:
    card(
      '#e8403a',
      `<path d="M41 22L56 44H49L60 60H52L64 76H18L30 60H22L33 44H26Z" fill="#43b04a"/>` +
        `<rect x="37" y="76" width="8" height="6" fill="#9a5b2e" stroke-width="2.5"/>` +
        star(41, 22, 7, 3, HL, 2.5) +
        dot(36, 52, 2.6, HL) +
        dot(46, 64, 2.6, '#fff') +
        dot(32, 70, 2.6, HL) +
        dot(52, 70, 2.6, '#fff') +
        dot(18, 22, 2.2, '#fff') +
        dot(62, 30, 2.2, '#fff') +
        dot(20, 44, 2.2, '#fff'),
    ) + `<path d="M84 34L90 40" stroke="#43b04a" stroke-width="3"/>`,
  초대장:
    `<rect x="18" y="8" width="64" height="58" rx="3" fill="#fff" transform="rotate(-6 50 37)"/>` +
    `<path d="M26 20L74 15" stroke="#a45cf0" stroke-width="5" opacity=".5"/>` +
    `<path d="M28 34L70 30M29 44L62 41" stroke="#9fb3d9" stroke-width="3"/>` +
    `<path d="M8 52H92V90H8Z" fill="#a45cf0"/>` +
    `<path d="M8 52L50 76L92 52" fill="#8e4fc9"/>` +
    `<path d="M50 62C42 52 34 56 36 62S46 66 50 62C54 66 62 68 64 62S58 52 50 62Z" fill="${HL}"/>` +
    `<path d="M48 64L42 76M52 64L58 76" stroke="${HL}" stroke-width="5"/>` +
    dot(50, 62, 3.5, '#f2a000') +
    sparkle(14, 16, 6) +
    sparkle(88, 24, 5, '#ff9aa8'),
  상장:
    `<rect x="8" y="14" width="84" height="66" rx="2" fill="#fffdf2"/>` +
    `<rect x="14" y="20" width="72" height="54" rx="1" stroke="#e0a800" stroke-width="3"/>` +
    `<path d="M36 32H64" stroke-width="5"/>` +
    `<path d="M24 44H76M24 54H76M24 64H52" stroke="#9fb3d9" stroke-width="3"/>` +
    `<path d="M66 76L62 94L70 88L74 96L76 78Z" fill="#e8403a"/><path d="M78 76L82 94L74 88L72 96L70 78Z" fill="#3b78e6"/>` +
    `<circle cx="72" cy="70" r="12" fill="${HL}"/>` +
    star(72, 70, 7, 3.2, '#f2a000', 2),
  졸업장:
    `<path d="M50 6L88 20L50 34L12 20Z" fill="#3a3f5c"/>` +
    `<path d="M28 26V36C28 44 72 44 72 36V26L50 34Z" fill="#3a3f5c"/>` +
    `<path d="M50 20L80 30V44" stroke="${HL}" stroke-width="3"/><rect x="77" y="42" width="6" height="10" rx="2" fill="${HL}" stroke-width="2.5"/>` +
    `<g transform="rotate(-18 50 72)">` +
    `<rect x="12" y="62" width="76" height="20" rx="10" fill="#fffdf2"/>` +
    `<ellipse cx="82" cy="72" rx="6" ry="10" fill="#f2ead2"/>` +
    `<path d="M82 72m0-3a3 3 0 1 1 0 6" stroke-width="2.5"/>` +
    `<rect x="45" y="60" width="10" height="24" fill="#e8403a"/>` +
    `</g>` +
    `<path d="M50 70C40 60 34 66 38 72C42 76 48 74 50 70C52 74 58 76 62 72C66 66 60 60 50 70Z" fill="#e8403a"/>` +
    `<path d="M48 72L42 88M52 72L58 88" stroke="#e8403a" stroke-width="5"/>`,
  이름표:
    `<rect x="40" y="10" width="20" height="16" rx="3" fill="#8a96b0"/>` +
    `<path d="M44 16H56" stroke="#dfe8f5" stroke-width="3"/>` +
    `<rect x="10" y="24" width="80" height="54" rx="7" fill="#fff"/>` +
    `<path d="M10 38V31C10 27 13 24 17 24H83C87 24 90 27 90 31V38Z" fill="#3b8fe0"/>` +
    `<rect x="18" y="44" width="24" height="26" rx="3" fill="#dff1ff" stroke-width="2.5"/>` +
    `<circle cx="30" cy="56" r="7" fill="${SKIN}" stroke-width="2.5"/><path d="M23 55C22 47 38 47 37 55C34 51 26 51 23 55Z" fill="#5a3b24" stroke-width="2"/>` +
    `<path d="M22 70C22 64 38 64 38 70" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M50 50H80M50 62H72" stroke-width="5"/>`,
  배지:
    `<path d="M4 96V34L28 16H38Q50 30 62 16H72L96 34V96Z" fill="#7ec8f0"/>` +
    `<path d="M38 16L50 34L62 16" fill="#fff"/>` +
    `<path d="M50 34V96" stroke="#4a90e2" stroke-width="3"/>` +
    dot(50, 50, 2.5, '#fff') +
    dot(50, 70, 2.5, '#fff') +
    `<path d="M16 74H38V92H16Z" stroke="#4a90e2" stroke-width="3"/>` +
    `<circle cx="72" cy="58" r="20" fill="#e8403a"/>` +
    `<circle cx="72" cy="58" r="14" fill="${HL}" stroke-width="3"/>` +
    star(72, 58, 9, 4, '#fff', 2.5) +
    `<path d="M60 46q4-4 9-5" stroke="#ff9a8a" stroke-width="3"/>` +
    sparkle(90, 34, 5, '#fff'),
  태극기:
    `<path d="M10 10V96" stroke-width="9"/><path d="M10 10V96" stroke="#9a5b2e" stroke-width="3.5"/>` +
    `<circle cx="10" cy="8" r="4" fill="${HL}"/>` +
    `<rect x="14" y="16" width="80" height="54" fill="#fff"/>` +
    `<circle cx="54" cy="43" r="13.5" fill="#2f5fc4"/>` +
    `<path d="M67.5 43A13.5 13.5 0 0 0 40.5 43A6.75 6.75 0 0 0 54 43A6.75 6.75 0 0 1 67.5 43Z" fill="#e8403a" stroke="none"/>` +
    `<circle cx="54" cy="43" r="13.5"/>` +
    trigram(28, 25, -56, [true, true, true]) +
    trigram(80, 61, -56, [false, false, false]) +
    trigram(80, 25, 56, [false, true, false]) +
    trigram(28, 61, 56, [true, false, true]),
  만국기: (() => {
    const flags = [
      (x: number, y: number) =>
        `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="#fff"/><path d="M${x - 7} ${y + 3.7}h14M${x - 7} ${y + 7.4}h14" stroke="#e8403a" stroke-width="3.2" stroke-linecap="butt"/><rect x="${x - 7}" y="${y}" width="14" height="11"/>`,
      (x: number, y: number) => `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="#3b78e6"/><path d="M${x - 2} ${y}v11M${x - 7} ${y + 5.5}h14" stroke="${HL}" stroke-width="3" stroke-linecap="butt"/><rect x="${x - 7}" y="${y}" width="14" height="11"/>`,
      (x: number, y: number) => `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="#fff"/>` + dot(x, y + 5.5, 3.2, '#e8403a'),
      (x: number, y: number) =>
        `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="#fff"/><rect x="${x - 7}" y="${y}" width="4.7" height="11" fill="#43b04a" stroke="none"/><rect x="${x + 2.3}" y="${y}" width="4.7" height="11" fill="#e8403a" stroke="none"/><rect x="${x - 7}" y="${y}" width="14" height="11"/>`,
      (x: number, y: number) => `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="#43b04a"/>` + star(x, y + 5.5, 4.5, 2, HL, 0),
      (x: number, y: number) =>
        `<rect x="${x - 7}" y="${y}" width="14" height="11" fill="${HL}"/><rect x="${x - 7}" y="${y + 5.5}" width="14" height="5.5" fill="#3b8fe0" stroke="none"/><rect x="${x - 7}" y="${y}" width="14" height="11"/>`,
    ];
    const line = (y0: number, sag: number, xs: number[], k: number) => {
      const yAt = (x: number) => y0 + sag * (1 - ((x - 50) / 46) ** 2);
      return (
        `<path d="M4 ${y0}Q50 ${y0 + sag * 2} 96 ${y0}" stroke-width="2.5"/>` +
        xs.map((x, i) => flags[(i + k) % flags.length](x, yAt(x))).join('')
      );
    };
    return line(12, 12, [16, 33, 50, 67, 84], 0) + line(50, 12, [16, 33, 50, 67, 84], 3);
  })(),
  현수막:
    `<path d="M4 94H96" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M12 12V94M88 12V94" stroke-width="8"/><path d="M12 12V94M88 12V94" stroke="#c98b4f" stroke-width="3"/>` +
    `<path d="M12 22L18 26M88 22L82 26M12 56L18 54M88 56L82 54" stroke-width="2.5"/>` +
    `<rect x="17" y="24" width="66" height="32" rx="1" fill="#ffd23f"/>` +
    `<rect x="17" y="24" width="66" height="6" fill="#e8403a"/><rect x="17" y="50" width="66" height="6" fill="#e8403a"/>` +
    `<path d="M26 40H34M38 40H48M52 40H58M62 40H74" stroke="#3b3f8a" stroke-width="5"/>`,
  폭죽:
    `<g transform="rotate(-12 34 72)"><rect x="24" y="52" width="20" height="40" rx="3" fill="#e8403a"/><path d="M24 62H44M24 82H44" stroke="${HL}" stroke-width="4"/><rect x="24" y="52" width="20" height="40" rx="3"/></g>` +
    `<g transform="rotate(14 64 72)"><rect x="54" y="56" width="20" height="36" rx="3" fill="#3b8fe0"/><path d="M54 66H74M54 82H74" stroke="#fff" stroke-width="4"/><rect x="54" y="56" width="20" height="36" rx="3"/></g>` +
    `<path d="M32 52Q30 44 36 40" stroke-width="3"/><path d="M66 56Q70 48 64 44" stroke-width="3"/>` +
    sparkle(37, 38, 7, '#ff9f1a') +
    sparkle(63, 42, 7, '#ff9f1a') +
    `<path d="M50 30L50 18M40 26L32 16M60 26L68 16M30 34L18 30M70 34L82 30" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M50 12v0M26 12v0M74 12v0M14 22v0M86 22v0" stroke="#e85d9a" stroke-width="7"/>`,
  케이크초:
    `<path d="M6 76C6 70 94 70 94 76V96H6Z" fill="#fff"/>` +
    `<path d="M6 78C12 86 16 86 20 80C24 88 30 88 34 80C38 88 44 88 48 80C52 88 58 88 62 80C66 88 72 88 76 80C80 88 86 88 94 78V74H6Z" fill="#ff9aa8"/>` +
    [
      [26, 38, '#7ec8f0'],
      [50, 30, '#ffd23f'],
      [74, 38, '#a45cf0'],
    ]
      .map(
        ([x, top, c]) =>
          `<rect x="${Number(x) - 6}" y="${top}" width="12" height="${76 - Number(top)}" rx="2" fill="#fff"/>` +
          `<path d="M${Number(x) - 6} ${Number(top) + 10}l12 -6M${Number(x) - 6} ${Number(top) + 22}l12 -6M${Number(x) - 6} ${Number(top) + 34}l12 -6" stroke="${c}" stroke-width="4" stroke-linecap="butt"/>` +
          `<rect x="${Number(x) - 6}" y="${top}" width="12" height="${76 - Number(top)}" rx="2"/>` +
          `<path d="M${x} ${Number(top)}V${Number(top) - 4}" stroke-width="2.5"/>` +
          `<path d="M${x} ${Number(top) - 20}C${Number(x) - 8} ${Number(top) - 10} ${Number(x) - 5} ${Number(top) - 3} ${x} ${Number(top) - 3}S${Number(x) + 8} ${Number(top) - 10} ${x} ${Number(top) - 20}Z" fill="#ff9f1a"/>` +
          `<path d="M${x} ${Number(top) - 11}c-2 3-2 5 0 5s2-2 0-5Z" fill="${HL}" stroke="none"/>`,
      )
      .join(''),
  산타모자:
    `<path d="M16 70C18 42 36 18 60 14C76 12 86 22 88 42C82 34 76 30 70 32C74 44 78 56 84 70Z" fill="#e8403a"/>` +
    `<path d="M30 60C34 42 44 28 56 22" stroke="#ff7a6a" stroke-width="4"/>` +
    `<circle cx="86" cy="48" r="9" fill="#fff"/>` +
    `<rect x="8" y="64" width="84" height="22" rx="11" fill="#fff"/>` +
    `<path d="M20 72v0M34 78v0M48 72v0M62 78v0M76 72v0" stroke="#dfe8f5" stroke-width="5"/>`,
  호박등:
    `<path d="M50 24C50 16 52 10 58 6" stroke="#3a9e47" stroke-width="6"/>` +
    `<ellipse cx="30" cy="58" rx="22" ry="30" fill="#ff9f1a"/><ellipse cx="70" cy="58" rx="22" ry="30" fill="#ff9f1a"/>` +
    `<ellipse cx="50" cy="58" rx="20" ry="32" fill="#ffae33"/>` +
    `<path d="M30 42L38 52H22Z" fill="${HL}"/><path d="M70 42L78 52H62Z" fill="${HL}"/>` +
    `<path d="M50 56L54 62H46Z" fill="${HL}"/>` +
    `<path d="M24 68Q50 90 76 68Q72 72 66 72L62 76L58 72L50 78L42 72L38 76L34 72Q28 72 24 68Z" fill="${HL}"/>` +
    `<path d="M60 8C70 4 80 10 78 18C70 18 64 14 60 8Z" fill="#43b04a"/>` +
    sparkle(12, 20, 6) +
    sparkle(90, 24, 5),
  가면:
    `<path d="M20 36C14 24 16 12 22 6C26 16 28 26 26 36Z" fill="#43b04a"/>` +
    `<path d="M26 34C24 20 30 10 38 6C38 18 34 28 32 36Z" fill="#e85d9a"/>` +
    tube('M74 64L86 94', '#f2c14e', 4) +
    `<path d="M8 44C16 30 36 30 50 40C64 30 84 30 92 44C92 62 78 70 64 66C58 64 54 60 50 58C46 60 42 64 36 66C22 70 8 62 8 44Z" fill="#8e4fc9"/>` +
    `<path d="M14 46C22 36 36 36 46 44M86 46C78 36 64 36 54 44" stroke="${HL}" stroke-width="3"/>` +
    `<path d="M22 50C26 42 38 42 42 50C38 56 26 56 22 50Z" fill="#fff7e0"/>` +
    `<path d="M58 50C62 42 74 42 78 50C74 56 62 56 58 50Z" fill="#fff7e0"/>` +
    dot(50, 46, 3.5, HL) +
    sparkle(16, 60, 4, HL) +
    sparkle(84, 60, 4, HL),
  탈춤:
    tube('M40 50L26 34L20 20', '#4a90e2', 5) +
    tube('M20 20C10 16 4 24 10 30S6 42 12 46', '#fff', 7) +
    tube('M60 50L76 50L86 42', '#4a90e2', 5) +
    tube('M86 42C94 50 88 58 94 66S90 80 94 86', '#fff', 7) +
    tube('M44 74L40 92', '#fffdf2', 6) +
    tube('M56 74L68 80L64 92', '#fffdf2', 6) +
    `<path d="M50 44C38 44 34 52 34 60L30 80H70L66 60C66 52 62 44 50 44Z" fill="#4a90e2"/>` +
    `<path d="M34 64H66" stroke="#e8403a" stroke-width="5"/>` +
    `<path d="M32 30C30 8 70 8 68 30L70 44H30Z" fill="#2a2f52"/>` +
    `<path d="M36 24C36 14 42 10 50 10S64 14 64 24V32C64 38 58 40 50 40S36 38 36 32Z" fill="#f7e2b8"/>` +
    `<path d="M39 42C40 48 60 48 61 42C58 38 42 38 39 42Z" fill="#f7e2b8"/>` +
    `<path d="M39 22q4-5 8 0M53 22q4-5 8 0" stroke-width="3"/>` +
    `<path d="M40 31Q50 40 60 31" stroke-width="3"/>` +
    `<circle cx="40" cy="30" r="3" fill="#ff5c70" stroke="none" opacity=".6"/><circle cx="60" cy="30" r="3" fill="#ff5c70" stroke="none" opacity=".6"/>`,
  부채춤:
    sector(26, 52, 24, 175, 295, '#ff9aa8') +
    sector(74, 52, 24, 245, 365, '#ff9aa8') +
    `<path d="${(() => {
      const arc = (cx: number, a1: number, a2: number) => {
        const r = 20;
        const p = (a: number) => `${f1(cx + r * Math.cos((a * Math.PI) / 180))} ${f1(52 + r * Math.sin((a * Math.PI) / 180))}`;
        return `M${p(a1)}A${r} ${r} 0 0 1 ${p(a2)}`;
      };
      return arc(26, 178, 292) + arc(74, 248, 362);
    })()}" stroke="#e8403a" stroke-width="6"/>` +
    `<path d="M26 52L6 49M26 52L12 34M26 52L24 30M26 52L35 30M74 52L65 30M74 52L76 30M74 52L88 34M74 52L94 49" stroke="#e85d9a" stroke-width="2"/>` +
    `<path d="M40 56C36 70 24 90 22 94H78C76 90 64 70 60 56Z" fill="#e85d9a"/>` +
    `<path d="M34 94Q50 86 66 94" stroke="#ff9aa8" stroke-width="3"/>` +
    tube('M42 48L28 54', HL, 4) +
    tube('M58 48L72 54', HL, 4) +
    `<path d="M38 58C38 46 44 42 50 42S62 46 62 58Z" fill="${HL}"/>` +
    `<path d="M46 44L50 54L54 44" stroke="#e8403a" stroke-width="3"/>` +
    `<circle cx="50" cy="30" r="10" fill="${SKIN}"/>` +
    `<path d="M40 30C39 20 45 18 50 18S61 20 60 30C57 25 54 24 50 24S43 25 40 30Z" fill="#2a2f52"/><circle cx="50" cy="15" r="5" fill="#2a2f52"/>` +
    dot(46.5, 31, 1.6) +
    dot(53.5, 31, 1.6) +
    `<path d="M47 35q3 2 6 0" stroke-width="2"/>`,
  사물놀이:
    // 꽹과리 (작은 징, 왼쪽 위)
    `<circle cx="24" cy="26" r="15" fill="${HL}"/><circle cx="24" cy="26" r="10" fill="#f2c14e" stroke-width="2.5"/>` +
    tube('M36 12L44 6', '#c98b4f', 3) +
    `<circle cx="34" cy="14" r="3.5" fill="#c98b4f" stroke-width="2.5"/>` +
    // 징 (큰 징, 오른쪽 위)
    `<circle cx="72" cy="30" r="21" fill="#f2c14e"/><circle cx="72" cy="30" r="15" fill="${HL}" stroke-width="2.5"/>` +
    dot(72, 30, 4, '#e0a800') +
    tube('M88 52L96 62', '#c98b4f', 3) +
    `<circle cx="88" cy="50" r="5" fill="#e8403a"/>` +
    // 북 (왼쪽 아래)
    `<path d="M8 60V82C8 90 40 90 40 82V60Z" fill="#e8403a"/>` +
    `<ellipse cx="24" cy="60" rx="16" ry="6" fill="#fff4dc"/>` +
    dot(12, 68, 1.8) +
    dot(24, 72, 1.8) +
    dot(36, 68, 1.8) +
    // 장구 (오른쪽 아래)
    `<path d="M48 64L68 74L48 86Z" fill="#e8403a"/><path d="M92 64L72 74L92 86Z" fill="#3b78e6"/>` +
    `<rect x="66" y="71" width="8" height="6" fill="#e8403a"/>` +
    `<ellipse cx="48" cy="75" rx="5" ry="13" fill="#fff4dc"/><ellipse cx="92" cy="75" rx="5" ry="13" fill="#fff4dc"/>` +
    `<path d="M50 64L90 86M50 86L90 64" stroke="#fff" stroke-width="1.8"/>`,
  강강술래: (() => {
    const L = (x: number, y: number, s: number, c: string, style: 'long' | 'bun') =>
      person(x, y, s, { hair: '#2a2f52', style, shirt: c }) +
      `<path d="M${f1(x - 13 * s)} ${y}L${f1(x - 17 * s)} ${f1(y + 14 * s)}H${f1(x + 17 * s)}L${f1(x + 13 * s)} ${y}Z" fill="${c}" stroke-width="2.5"/>`;
    const arm = (d: string) => `<path d="${d}" stroke-width="7"/><path d="${d}" stroke="${SKIN}" stroke-width="3"/>`;
    return (
      `<circle cx="50" cy="15" r="11" fill="#ffe46b"/>` +
      sparkle(20, 12, 4) +
      sparkle(82, 12, 4) +
      L(30, 52, 0.62, '#3b8fe0', 'bun') +
      L(70, 52, 0.62, '#43b04a', 'bun') +
      arm('M36 42Q50 38 64 42') +
      arm('M26 44Q18 56 20 64') +
      arm('M74 44Q82 56 80 64') +
      L(16, 82, 0.8, '#ff9f1a', 'long') +
      L(84, 82, 0.8, '#a45cf0', 'long') +
      L(50, 86, 0.85, '#e85d9a', 'long') +
      arm('M24 68Q34 74 40 72') +
      arm('M76 68Q66 74 60 72')
    );
  })(),
  리코더:
    `<g transform="rotate(32 50 50)">` +
    `<path d="M44 8H56L55 22H45Z" fill="#fff2d6"/>` +
    `<rect x="43" y="20" width="14" height="10" rx="2" fill="#c98b4f"/>` +
    `<rect x="44" y="30" width="12" height="54" fill="#fff2d6"/>` +
    `<rect x="47" y="33" width="6" height="4" fill="${INK}" stroke="none"/>` +
    `<path d="M44 84L41 94H59L56 84Z" fill="#c98b4f"/>` +
    `<rect x="43" y="50" width="14" height="4" fill="#c98b4f" stroke-width="2.5"/>` +
    [42, 60, 67, 74].map((y) => dot(50, y, 2.6)).join('') +
    `<path d="M47 12V20" stroke="#fff" stroke-width="2.5"/>` +
    `</g>` +
    `<path d="M20 20q-6 6 0 12M12 14q-10 12 0 24" stroke="#ff9f1a" stroke-width="3.5"/>`,
  오카리나:
    `<path d="M16 58C16 40 36 30 58 32C76 34 92 44 92 56C92 70 74 80 52 78C30 76 16 72 16 58Z" fill="#7ec8f0"/>` +
    `<path d="M22 50L8 42L12 34L30 40Z" fill="#7ec8f0"/>` +
    `<rect x="28" y="44" width="8" height="5" rx="1" fill="#2a4f8e" stroke-width="2"/>` +
    [
      [46, 46, 3.4],
      [56, 44, 3.8],
      [66, 46, 3.8],
      [76, 50, 3.4],
      [52, 62, 3.2],
      [66, 64, 3.2],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2a4f8e" stroke-width="2"/>`)
      .join('') +
    `<path d="M26 64Q38 72 54 72" stroke="#c4e8ff" stroke-width="4"/>` +
    `<path d="M90 50C96 40 96 30 88 24" stroke="#e8403a" stroke-width="3"/>` +
    `<path d="M14 24q-4 6 0 12M6 18q-7 12 0 24" stroke="#ff9f1a" stroke-width="3.5"/>`,
  봉고:
    `<path d="M40 50H60V62H40Z" fill="#9a5b2e"/>` +
    `<path d="M10 40L16 86C16 92 44 92 44 86L50 40Z" fill="#c98b4f"/>` +
    `<path d="M56 46L60 84C60 90 84 90 84 84L88 46Z" fill="#e8862e"/>` +
    `<path d="M13 58H47M58 62H86" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="30" cy="40" rx="20" ry="7" fill="#fff4dc"/>` +
    `<ellipse cx="72" cy="46" rx="16" ry="6" fill="#fff4dc"/>` +
    `<path d="M10 40C10 44 50 44 50 40M56 46C56 50 88 50 88 46" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M22 22l4 8M34 20l-2 8M68 28l2 8M80 28l-3 8" stroke="#9aa6c4" stroke-width="3"/>`,
  스톱워치: watch(50, 60, 32, '#e8403a') + `<path d="M12 36q-6 6-6 14M88 36q6 6 6 14" stroke="#9aa6c4" stroke-width="3"/>`,
  잠수복:
    [
      [80, 30, 4],
      [86, 18, 5],
      [80, 7, 3],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e6f5ff" stroke-width="2.5"/>`)
      .join('') +
    tube('M36 40L22 64', '#33406b', 7) +
    tube('M64 40L78 64', '#33406b', 7) +
    `<path d="M40 82L26 96H48Z" fill="${HL}"/><path d="M60 82L74 96H52Z" fill="${HL}"/>` +
    tube('M43 66L40 84', '#33406b', 9) +
    tube('M57 66L60 84', '#33406b', 9) +
    `<rect x="32" y="34" width="36" height="38" rx="12" fill="#33406b"/>` +
    `<path d="M34 44V64M66 44V64" stroke="${HL}" stroke-width="4"/>` +
    `<path d="M50 36V66" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="22" r="14" fill="#33406b"/>` +
    `<rect x="38" y="15" width="24" height="13" rx="6" fill="#bfe6ff"/>` +
    dot(45, 21, 2.2) +
    dot(55, 21, 2.2) +
    `<path d="M62 22H68V6" stroke-width="7"/><path d="M62 22H68V6" stroke="#ff9f1a" stroke-width="3"/>`,
  도복:
    `<path d="M32 12L14 20L4 52L20 58L28 40V92H72V40L80 58L96 52L86 20L68 12L50 34Z" fill="#fff"/>` +
    `<path d="M32 12L50 34L68 12" stroke-width="3.5"/>` +
    `<path d="M32 12C40 22 46 30 50 34L66 88" stroke-width="3"/>` +
    `<path d="M14 20L28 40M86 20L72 40" stroke="#dfe8f5" stroke-width="3"/>` +
    `<rect x="26" y="58" width="48" height="9" rx="2" fill="#2a2f52"/>` +
    `<rect x="44" y="55" width="12" height="14" rx="3" fill="#2a2f52"/>` +
    `<path d="M47 68L40 88M53 68L60 88" stroke-width="8"/><path d="M47 68L40 88M53 68L60 88" stroke="#2a2f52" stroke-width="4"/>`,
  보호대:
    `<path d="M20 8H80L82 36H56L50 26L44 36H18Z" fill="#3b8fe0"/>` +
    tube('M36 34L34 84', SKIN, 12) +
    tube('M64 34L66 84', SKIN, 12) +
    `<path d="M22 86C22 80 30 80 36 82L42 84V92H22Z" fill="#fff"/><path d="M78 86C78 80 70 80 64 82L58 84V92H78Z" fill="#fff"/>` +
    `<path d="M22 92H42M58 92H78" stroke="#e8403a" stroke-width="4"/>` +
    [35, 65]
      .map(
        (x) =>
          `<rect x="${x - 14}" y="46" width="28" height="28" rx="9" fill="#2a2f52"/>` +
          `<ellipse cx="${x}" cy="60" rx="9" ry="10" fill="#e8403a"/>` +
          `<path d="M${x - 14} 50H${x - 10}M${x + 10} 50H${x + 14}M${x - 14} 70H${x - 10}M${x + 10} 70H${x + 14}" stroke="#8a96b0" stroke-width="3"/>` +
          `<path d="M${x - 4} 56q3-3 6-3" stroke="#ff9a8a" stroke-width="2.5"/>`,
      )
      .join(''),
  사포: (() => {
    const g: string[] = [];
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 6; c++) {
        const x = 20 + c * 9 + (r % 2) * 4.5;
        const y = 22 + r * 9;
        if (x > 64 && y < 34) continue;
        g.push(dot(x, y, 1.9, '#9a5b2e'));
      }
    return (
      `<path d="M12 14H64L76 26V86H12Z" fill="#e0a458"/>` +
      g.join('') +
      `<path d="M64 14C62 22 68 28 76 26L64 14Z" fill="#fffdf2"/>` +
      `<rect x="56" y="70" width="36" height="20" rx="3" fill="#f0d19a"/>` +
      `<path d="M62 76h12M68 84h16" stroke="#c98b4f" stroke-width="2.5"/>` +
      dot(52, 92, 2, '#c98b4f') +
      dot(46, 94, 1.6, '#c98b4f') +
      dot(94, 94, 2, '#c98b4f')
    );
  })(),
  니퍼:
    `<path d="M20 20H80" stroke="#e8862e" stroke-width="4"/>` +
    `<path d="M50 50C40 46 38 32 44 18L49 14L50 50Z" fill="#8a96b0"/>` +
    `<path d="M50 50C60 46 62 32 56 18L51 14L50 50Z" fill="#8a96b0"/>` +
    tube('M47 52C40 62 30 72 26 92', '#e8403a', 8) +
    tube('M53 52C60 62 70 72 74 92', '#e8403a', 8) +
    `<circle cx="50" cy="48" r="6" fill="#dfe8f5"/>` +
    dot(50, 48, 2) +
    `<path d="M60 10l4-6M66 16l6-2" stroke="${HL}" stroke-width="3"/>`,
  대패:
    `<rect x="4" y="68" width="92" height="16" rx="2" fill="#e0b27a"/>` +
    `<path d="M10 76H40M60 78H90" stroke="#c98b4f" stroke-width="2.5"/>` +
    `<path d="M50 44C44 30 56 18 66 24C74 28 70 40 62 38C56 36 58 28 64 30" fill="#fff2d6" stroke-width="3"/>` +
    `<path d="M40 48L46 30H54L50 48Z" fill="#8a96b0"/>` +
    `<rect x="20" y="46" width="56" height="22" rx="3" fill="#c98b4f"/>` +
    `<path d="M42 46L48 68" stroke="#6b3e26" stroke-width="3"/>` +
    tube('M10 52H90', '#9a5b2e', 6) +
    `<path d="M86 64C92 58 98 62 94 68Q90 64 86 64Z" fill="#fff2d6" stroke-width="2.5"/>` +
    `<path d="M4 40h8M2 48h6" stroke="#9aa6c4" stroke-width="3"/>`,
  곡괭이:
    `<path d="M4 94C8 80 20 74 32 80C40 72 54 72 60 82C68 76 86 78 96 94Z" fill="#8a96b0"/>` +
    `<circle cx="80" cy="88" r="4" fill="#b8c2d6" stroke-width="2.5"/><circle cx="20" cy="90" r="3" fill="#b8c2d6" stroke-width="2.5"/>` +
    tube('M52 20L46 82', '#c98b4f', 8) +
    `<path d="M8 40C22 16 70 8 94 22C80 18 64 20 54 26H48C36 26 20 30 8 40Z" fill="#b8c2d6"/>` +
    `<rect x="45" y="16" width="13" height="16" rx="3" fill="#6f7a94"/>`,
  쇠스랑:
    `<path d="M4 94C10 82 26 80 40 86C52 78 70 80 80 90L84 96H4Z" fill="#9a5b2e"/>` +
    `<circle cx="66" cy="82" r="5" fill="#6b3e26"/><circle cx="88" cy="90" r="4" fill="#6b3e26"/>` +
    tube('M92 8L48 44', '#c98b4f', 7) +
    `<rect x="18" y="40" width="40" height="10" rx="3" fill="#6f7a94"/>` +
    [24, 34, 44, 54]
      .map((x) => tube(`M${x} 48C${x} 64 ${x - 2} 74 ${x - 6} 86`, '#8a96b0', 4))
      .join(''),
  호미:
    tube('M60 28L92 14', '#c98b4f', 9) +
    `<rect x="52" y="24" width="12" height="10" rx="3" fill="#6f7a94"/>` +
    tube('M54 30C44 30 40 38 40 48', '#6f7a94', 4) +
    `<path d="M40 44L60 62L22 88Z" fill="#8a96b0"/>` +
    `<path d="M40 50L34 72" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M4 90C20 82 60 82 96 90V96H4Z" fill="#9a5b2e"/>` +
    `<path d="M76 84C74 74 70 70 66 68M76 84C78 74 84 70 88 70" stroke="#43b04a" stroke-width="4"/>`,
  쟁기:
    `<path d="M4 84H96V96H4Z" fill="#9a5b2e"/>` +
    `<path d="M40 90H94" stroke="#6b3e26" stroke-width="3"/>` +
    // 소
    tube('M16 60L14 82', '#b5763c', 5) +
    tube('M44 60L46 82', '#b5763c', 5) +
    `<path d="M54 48q6 4 2 14" stroke-width="3"/>` +
    `<ellipse cx="34" cy="54" rx="22" ry="13" fill="#b5763c"/>` +
    `<path d="M28 44C32 50 40 50 42 44" fill="#f2e3c6" stroke-width="2.5"/>` +
    tube('M26 62L24 84', '#9a5b2e', 5) +
    tube('M50 60L52 84', '#9a5b2e', 5) +
    `<path d="M10 30C4 26 4 18 8 16C8 22 12 26 16 28Z" fill="#fff2d6"/><path d="M26 30C32 26 32 18 28 16C28 22 24 26 20 28Z" fill="#fff2d6"/>` +
    `<ellipse cx="7" cy="36" rx="5" ry="3" fill="#b5763c"/><ellipse cx="29" cy="36" rx="5" ry="3" fill="#b5763c"/>` +
    `<circle cx="18" cy="40" r="11" fill="#b5763c"/>` +
    `<ellipse cx="18" cy="49" rx="8" ry="5" fill="#ffb3a7"/>` +
    dot(15, 48, 1.4) +
    dot(21, 48, 1.4) +
    dot(14, 38, 2) +
    dot(22, 38, 2) +
    // 쟁기
    `<path d="M36 46L66 64" stroke-width="3"/>` +
    tube('M64 62L88 24', '#c98b4f', 5) +
    tube('M64 62L70 86', '#c98b4f', 5) +
    tube('M84 30L94 34', '#c98b4f', 4) +
    `<path d="M66 80L82 88L66 90Z" fill="#8a96b0"/>`,
  깔때기:
    `<path d="M26 72H74V94H26Z" fill="#e6f5ff"/>` +
    `<path d="M26 82H74V94H26Z" fill="#7ec8f0" stroke="none"/><rect x="26" y="72" width="48" height="22"/>` +
    `<path d="M22 20C22 26 78 26 78 20L56 54V70H44V54Z" fill="#ff9f1a"/>` +
    `<ellipse cx="50" cy="20" rx="28" ry="7" fill="#7ec8f0"/>` +
    `<path d="M30 28L44 50" stroke="#ffc97a" stroke-width="4"/>` +
    `<path d="M50 70V82" stroke="#4aa8f0" stroke-width="4"/>` +
    drop(20, 36, 0.8) +
    drop(84, 36, 0.8),
  대접:
    bowlSide(50, 44, 44, 38, '#eef6ff', '#fff', '#3b78e6', 0.3) +
    `<ellipse cx="50" cy="48" rx="30" ry="6" fill="#dbe9fa" stroke="none"/>` +
    `<path d="M30 60q6 6 12 0t12 0t12 0" stroke="#7ec8f0" stroke-width="3"/>` +
    sparkle(84, 20, 6),
  종지:
    bowlSide(50, 66, 24, 18, '#5a3b24', '#fff', '#43b04a', 0.4) +
    `<path d="M40 66q10-4 20 0" stroke="#8a5a3a" stroke-width="2.5"/>` +
    `<path d="M50 60C40 60 34 52 38 44C42 40 46 44 50 40C54 44 58 40 62 44C66 52 60 60 50 60Z" fill="#fffdf2"/>` +
    `<path d="M44 46q2-3 3 0M49 44q2-3 3 0M54 46q2-3 3 0" stroke="#d8d0bf" stroke-width="2"/>` +
    tube('M92 8L60 46', '#c98b4f', 3) +
    tube('M96 16L64 50', '#c98b4f', 3),
  수저통:
    tube('M40 50L34 8', '#c98b4f', 3) +
    tube('M46 50L44 8', '#c98b4f', 3) +
    tube('M62 50L68 10', '#c98b4f', 3) +
    tube('M50 50L52 26', '#b8c2d6', 3) +
    `<ellipse cx="52" cy="18" rx="7" ry="10" fill="#dfe8f5"/>` +
    tube('M58 50L62 30', '#b8c2d6', 3) +
    `<ellipse cx="64" cy="22" rx="6" ry="9" fill="#dfe8f5" transform="rotate(12 64 22)"/>` +
    tube('M36 50L28 30', '#b8c2d6', 3) +
    `<ellipse cx="26" cy="22" rx="6" ry="9" fill="#dfe8f5" transform="rotate(-18 26 22)"/>` +
    `<path d="M26 48V88C26 94 74 94 74 88V48Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="48" rx="24" ry="6" fill="#dfe8f5"/>` +
    `<path d="M26 60Q50 68 74 60M26 78Q50 86 74 78" stroke="#3b78e6" stroke-width="4"/>` +
    dot(38, 70, 3, '#e85d9a') +
    dot(50, 72, 3, '#e85d9a') +
    dot(62, 70, 3, '#e85d9a'),
  컵받침:
    `<ellipse cx="50" cy="76" rx="44" ry="17" fill="#e85d9a"/>` +
    `<ellipse cx="50" cy="76" rx="36" ry="12" fill="#ff9aa8" stroke="#fff" stroke-width="3" stroke-dasharray="5 5"/>` +
    tube('M60 44C74 42 74 62 60 62', '#fff', 4) +
    `<path d="M32 30V66C32 74 62 74 62 66V30Z" fill="#fff"/>` +
    `<ellipse cx="47" cy="30" rx="15" ry="4.5" fill="#9a5b2e"/>` +
    `<path d="M36 44V58" stroke="#dfe8f5" stroke-width="4"/>` +
    `<path d="M42 22c-4-4 4-7 0-12M52 22c-4-4 4-7 0-12" stroke="#9aa6c4" stroke-width="3"/>`,
};
