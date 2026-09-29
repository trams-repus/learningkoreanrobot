// 음식 그림 묶음 2 (1단계 어휘: 과일·견과·빵·분식·간식·채소·요리). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(식빵·토스트·빵 / 양배추·배추·상추 / 막대사탕·사탕 / 불고기·고기 / 미역국·국)는 색·그릇·실루엣을 다르게 했다.
import { dot, blob, sparkle, tube } from '../pictureKit.ts';

const f = (n: number) => n.toFixed(1);

/** 그릇 (위에서 조금 내려다본 모양): 국물 면(soup) + 속 재료(inner) + 그릇 몸통 + 굽 */
function bowl(cy: number, soup: string, body: string, inner = '', band = ''): string {
  return (
    `<path d="M38 ${cy + 36}L36 ${cy + 44}H64L62 ${cy + 36}" fill="${body}"/>` +
    `<ellipse cx="50" cy="${cy}" rx="38" ry="11" fill="${soup}"/>` +
    inner +
    `<path d="M12 ${cy}C12 ${cy + 26} 30 ${cy + 40} 50 ${cy + 40}S88 ${cy + 26} 88 ${cy}C88 ${cy + 6} 71 ${cy + 11} 50 ${cy + 11}S12 ${cy + 6} 12 ${cy}Z" fill="${body}"/>` +
    (band ? `<path d="M19 ${cy + 20}Q50 ${cy + 30} 81 ${cy + 20}" stroke="${band}" stroke-width="4"/>` : '')
  );
}

const steam = (y: number) =>
  `<path d="M36 ${y}c-5-5 5-9 0-15M50 ${y - 2}c-5-5 5-9 0-15M64 ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 타원 안을 가로지르는 줄 (파인애플 격자무늬) */
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

/** 소용돌이 (막대사탕) */
function spiral(cx: number, cy: number, rMax: number, turns: number): string {
  const pts: string[] = [];
  const end = turns * 2 * Math.PI;
  for (let t = 0; t <= end; t += 0.2) {
    const r = (rMax * t) / end;
    pts.push(`${f(cx + r * Math.cos(t))} ${f(cy + r * Math.sin(t))}`);
  }
  return `M${pts.join('L')}`;
}

/** 송편 한 개 (반달) */
const songpyeon = (x: number, y: number, fill: string) =>
  `<path d="M${x - 14} ${y + 6}C${x - 14} ${y - 11} ${x + 14} ${y - 11} ${x + 14} ${y + 6}Q${x} ${y + 10} ${x - 14} ${y + 6}Z" fill="${fill}"/>` +
  `<path d="M${x - 8} ${y - 3}Q${x - 4} ${y - 7} ${x + 1} ${y - 7}" stroke="#fff" stroke-width="3"/>`;

/** 네모 식빵 한 조각 (겉은 갈색 껍질, 속은 inside 색) */
const breadSlice = (dx: number, dy: number, inside: string, crust = '#c9782f') =>
  `<g transform="translate(${dx} ${dy})">` +
  `<path d="M20 86V44C11 43 10 22 26 19C34 12 62 12 70 19C86 22 85 43 76 44V86Z" fill="${crust}"/>` +
  `<path d="M27 80V39C19 37 20 26 30 25C37 19 59 19 66 25C76 26 77 37 69 39V80Z" fill="${inside}" stroke="none"/>` +
  `</g>`;

export const PICS: Record<string, string> = {
  오렌지:
    `<circle cx="38" cy="42" r="28" fill="#ff9f1a"/>` +
    `<path d="M38 14C40 8 46 5 54 6C51 12 45 15 38 14Z" fill="#43b04a"/>` +
    `<path d="M20 36C21 29 26 24 32 22" stroke="#ffc97a" stroke-width="4"/>` +
    `<circle cx="66" cy="67" r="26" fill="#ff9f1a"/>` +
    `<circle cx="66" cy="67" r="20" fill="#ffc45c" stroke="#fff3d0" stroke-width="3"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const t = (i * Math.PI) / 4 + 0.3;
        return `<path d="M66 67L${f(66 + 18 * Math.cos(t))} ${f(67 + 18 * Math.sin(t))}" stroke="#fff3d0" stroke-width="3"/>`;
      })
      .join('') +
    `<circle cx="66" cy="67" r="26"/>` +
    dot(66, 67, 3, '#fff3d0'),
  파인애플:
    `<path d="M36 40C30 32 24 26 20 18C30 20 37 25 42 31C39 23 39 14 44 5C48 13 50 21 50 30C52 21 56 13 62 7C63 15 61 23 58 31C64 25 71 21 80 18C76 27 70 34 64 40Z" fill="#43b04a"/>` +
    `<path d="M44 30L50 14M56 30L62 18" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="65" rx="25" ry="28" fill="#f2b92e"/>` +
    `<path d="${[-45, -33, -21, -9, 3, 15, 27, 39]
      .map((k) => chord(50, 65, 25, 28, 50 + k, 65, 1, 1.15) + chord(50, 65, 25, 28, 50 + k, 65, 1, -1.15))
      .join('')}" stroke="#c07a1a" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="65" rx="25" ry="28"/>`,
  블루베리:
    `<path d="M62 20C66 8 80 6 86 12C80 20 70 22 62 20Z" fill="#43b04a"/>` +
    [
      [34, 38, 17, '#4a6fe0'],
      [64, 36, 16, '#3b5bd6'],
      [26, 68, 17, '#3b5bd6'],
      [74, 66, 16, '#4a6fe0'],
      [50, 62, 19, '#2f4bb0'],
    ]
      .map(
        ([x, y, r, c]) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>` +
          `<path d="M${(x as number) - (r as number) * 0.6} ${(y as number) - (r as number) * 0.1}Q${(x as number) - (r as number) * 0.5} ${(y as number) - (r as number) * 0.6} ${(x as number) - (r as number) * 0.1} ${(y as number) - (r as number) * 0.65}" stroke="#a8c4ff" stroke-width="3"/>` +
          `<path d="M${x} ${(y as number) - 4}L${(x as number) + 1.5} ${(y as number) - 1}L${(x as number) + 4} ${y}L${(x as number) + 1.5} ${(y as number) + 1}L${x} ${(y as number) + 4}L${(x as number) - 1.5} ${(y as number) + 1}L${(x as number) - 4} ${y}L${(x as number) - 1.5} ${(y as number) - 1}Z" fill="#1d2a6a" stroke-width="2"/>`,
      )
      .join(''),
  대추:
    `<path d="M50 18C56 10 70 6 82 10C76 18 62 20 50 18Z" fill="#43b04a"/><path d="M58 14L74 12" stroke="#3a9e47" stroke-width="2.5"/>` +
    [
      [32, 56, -8, '#b8322a'],
      [68, 58, 10, '#a8261f'],
    ]
      .map(
        ([x, y, a, c]) =>
          `<g transform="rotate(${a} ${x} ${y})">` +
          `<path d="M${x} ${(y as number) - 30}v-6" stroke="#6b3e26" stroke-width="4"/>` +
          `<ellipse cx="${x}" cy="${y}" rx="18" ry="30" fill="${c}"/>` +
          `<path d="M${(x as number) - 6} ${(y as number) - 14}q6 5 12 0M${(x as number) - 8} ${(y as number) + 2}q8 6 16 0M${(x as number) - 6} ${(y as number) + 17}q6 4 12 0" stroke="#761a14" stroke-width="2.5"/>` +
          `<path d="M${(x as number) - 10} ${(y as number) - 4}C${(x as number) - 10} ${(y as number) - 14} ${(x as number) - 7} ${(y as number) - 20} ${(x as number) - 3} ${(y as number) - 23}" stroke="#ff8a7a" stroke-width="3.5"/>` +
          `</g>`,
      )
      .join(''),
  호두:
    `<path d="M50 10C70 14 86 32 86 54C86 74 70 90 50 90S14 74 14 54C14 32 30 14 50 10Z" fill="#c8955a"/>` +
    `<path d="M50 10C46 40 54 62 50 90" stroke="#8a5a2e" stroke-width="4"/>` +
    `<path d="M24 38q5-7 11 0t9 0M20 56q6 6 12 0t10 2M26 74q6-6 11 0t8-2M56 32q5 7 11 0t8 2M58 50q6-6 12 0t10 0M56 70q6 6 12 0t8-4" stroke="#8a5a2e" stroke-width="3"/>` +
    `<path d="M22 44C23 32 30 23 38 19" stroke="#e8c090" stroke-width="3.5"/>`,
  땅콩:
    `<g transform="rotate(-24 50 46)">` +
    `<path d="M10 48C10 32 22 26 33 28C42 30 46 36 51 36C57 36 60 28 71 28C84 28 91 38 91 48C91 60 83 68 71 68C60 68 57 60 51 60C46 60 42 66 33 68C21 70 10 62 10 48Z" fill="#e3b87a"/>` +
    [
      [22, 42],
      [30, 52],
      [20, 56],
      [38, 40],
      [36, 58],
      [64, 40],
      [74, 52],
      [82, 42],
      [66, 58],
      [80, 58],
      [72, 36],
    ]
      .map(([x, y]) => dot(x, y, 2, '#b8803e'))
      .join('') +
    `<path d="M20 40C22 35 26 32 31 31" stroke="#fce0b0" stroke-width="3"/>` +
    `</g>` +
    `<ellipse cx="58" cy="82" rx="10" ry="7" fill="#c8583a" transform="rotate(-10 58 82)"/>` +
    `<ellipse cx="80" cy="78" rx="10" ry="7" fill="#b84a2e" transform="rotate(20 80 78)"/>` +
    `<path d="M53 80q3-3 7-3M75 75q3-2 7-1" stroke="#ff9a7a" stroke-width="2.5"/>`,
  도토리:
    `<path d="M24 44C24 68 40 86 50 92C60 86 76 68 76 44Z" fill="#c98b4f"/>` +
    `<path d="M32 54C32 64 36 72 42 78" stroke="#e8b07a" stroke-width="4"/>` +
    `<path d="M50 20C50 12 53 7 58 4" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M16 44C16 28 32 18 50 18S84 28 84 44C84 51 16 51 16 44Z" fill="#8a5a2e"/>` +
    `<path d="M26 32l6 6l6-6l6 6l6-6l6 6l6-6l6 6l6-6M22 42l6-5l6 5l6-5l6 5l6-5l6 5l6-5l6 5l6-5" stroke="#5a3b24" stroke-width="2.5"/>`,
  식빵:
    breadSlice(-8, -8, '#ffe8b8') +
    breadSlice(6, 6, '#fff4d6') +
    [
      [42, 50],
      [58, 44],
      [66, 62],
      [48, 72],
      [60, 78],
      [40, 62],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#e8c890'))
      .join(''),
  우동:
    `<path d="M94 12L52 38M88 6L48 34" stroke="#9a5b2e" stroke-width="5"/>` +
    steam(26) +
    bowl(
      48,
      '#f3dca8',
      '#3b3f6b',
      tube('M20 50q5-8 10 0t10 0t10 0t10 0t10 0t10 0', '#fffaf0', 5) +
        tube('M26 42q5-7 10 0t10 0', '#fffaf0', 5) +
        `<circle cx="64" cy="42" r="10" fill="#fff"/><path d="M64 42a2.5 2.5 0 1 1 3 2a6 6 0 1 1-8-6" stroke="#ff5c8a" stroke-width="2.5"/>` +
        `<circle cx="48" cy="40" r="3.5" fill="#7cc242" stroke-width="2"/><circle cx="80" cy="47" r="3" fill="#7cc242" stroke-width="2"/>`,
      '#e8553d',
    ),
  짜장면:
    `<path d="M94 12L54 36M88 6L50 32" stroke="#9a5b2e" stroke-width="5"/>` +
    bowl(
      50,
      '#ffe27a',
      '#fff',
      `<path d="M16 50q4-5 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#e8c050" stroke-width="3"/>` +
        blob('#3a2a20', [
          [36, 44, 11],
          [50, 38, 14],
          [64, 44, 11],
        ]) +
        `<rect x="40" y="40" width="6" height="6" rx="1.5" fill="#8a6040" stroke-width="2"/><rect x="58" y="42" width="6" height="6" rx="1.5" fill="#8a6040" stroke-width="2"/>` +
        `<path d="M44 30L58 34M46 34L56 28M50 26L54 36" stroke="#6cc24a" stroke-width="3.5"/>`,
      '#3b78e6',
    ),
  순대:
    `<ellipse cx="50" cy="70" rx="44" ry="18" fill="#fff"/><ellipse cx="50" cy="70" rx="36" ry="12" stroke="#8fd3ff" stroke-width="3"/>` +
    tube('M16 46C30 30 64 28 84 42', '#4f3d58', 16) +
    `<path d="M24 40C36 32 56 30 70 34" stroke="#7a6484" stroke-width="3"/>` +
    [
      [24, 66],
      [42, 70],
      [60, 70],
      [78, 66],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="11" fill="#4f3d58"/>` +
          dot(x - 4, y - 3, 2, '#b8a0c0') +
          dot(x + 3, y - 4, 1.8, '#fff') +
          dot(x + 4, y + 3, 2, '#b8a0c0') +
          dot(x - 3, y + 4, 1.8, '#fff'),
      )
      .join(''),
  어묵:
    tube('M50 4V96', '#e8c9a0', 4) +
    [
      [12, 0],
      [30, 5],
      [48, 0],
      [66, 5],
    ]
      .map(
        ([y, dx]) =>
          `<path d="M${22 + dx} ${y}H${68 + dx}C${80 + dx} ${y} ${80 + dx} ${y + 20} ${68 + dx} ${y + 20}H${22 + dx}C${10 + dx} ${y + 20} ${10 + dx} ${y} ${22 + dx} ${y}Z" fill="#eab468"/>` +
          `<path d="M${22 + dx} ${y + 6}q4-3 8 0t8 0t8 0t8 0t8 0t8 0" stroke="#f8d49a" stroke-width="2.5"/>` +
          `<path d="M${22 + dx} ${y + 15}H${68 + dx}" stroke="#c98b3f" stroke-width="3"/>`,
      )
      .join('') +
    `<path d="M50 94V88" stroke-width="10"/><path d="M50 94V88" stroke="#e8c9a0" stroke-width="4"/>`,
  주먹밥:
    `<path d="M50 10C57 10 88 62 88 72C88 86 78 88 50 88S12 86 12 72C12 62 43 10 50 10Z" fill="#fff"/>` +
    `<path d="M34 56H66V88H34Z" fill="#1f3a2c" stroke="none"/><path d="M34 56V88M66 56V88M34 56H66"/>` +
    `<path d="M38 64H62M38 74H62" stroke="#3a5a48" stroke-width="2.5"/>` +
    `<path d="M40 30l3 3M56 36l3-2M30 52l3 2M72 58l2 3M48 44l3 1" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M50 10C57 10 88 62 88 72C88 86 78 88 50 88S12 86 12 72C12 62 43 10 50 10Z"/>`,
  초밥:
    `<path d="M14 80H86V88H14Z" fill="#c98b4f"/><path d="M20 88V94M80 88V94" stroke-width="5"/>` +
    `<rect x="20" y="46" width="60" height="34" rx="14" fill="#fff"/>` +
    `<path d="M30 68l3 2M46 72l3-1M62 68l3 2M70 74l2-2M38 76l3 0" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M12 52C12 30 30 22 50 22S90 30 88 52C80 46 64 44 50 44S20 46 12 52Z" fill="#ff8a5c"/>` +
    `<path d="M26 40L36 28M42 40L50 25M58 40L64 26M72 42L78 32" stroke="#ffd8c4" stroke-width="3.5"/>`,
  핫도그:
    `<g transform="rotate(14 50 50)">` +
    tube('M50 70V96', '#e8c9a0', 5) +
    `<rect x="32" y="8" width="36" height="68" rx="18" fill="#e0a040"/>` +
    [
      [42, 20],
      [58, 28],
      [40, 44],
      [60, 52],
      [44, 66],
      [56, 14],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#b8741e'))
      .join('') +
    `<path d="M38 22L62 32L38 42L62 52L38 62" stroke="#e8403a" stroke-width="5"/>` +
    `<path d="M40 24L60 32M40 44L60 52" stroke="#ffd23f" stroke-width="2.5"/>` +
    `</g>`,
  햄:
    `<path d="M24 20H62C70 20 74 30 74 38S70 56 62 56H24Z" fill="#f28a9c"/>` +
    `<ellipse cx="24" cy="38" rx="10" ry="18" fill="#ffc0c8"/>` +
    dot(22, 32, 2, '#fff') +
    dot(26, 44, 2, '#fff') +
    `<path d="M36 26H62" stroke="#ffb0bc" stroke-width="3"/>` +
    [
      [44, 72],
      [70, 68],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="19" fill="#f28a9c"/><circle cx="${x}" cy="${y}" r="14" fill="#ffc0c8" stroke="none"/>` +
          dot(x - 5, y - 4, 2.2, '#fff') +
          dot(x + 5, y + 2, 2.2, '#fff') +
          dot(x - 1, y + 7, 2, '#fff'),
      )
      .join(''),
  버터:
    `<ellipse cx="50" cy="72" rx="44" ry="16" fill="#7ec8f0"/><ellipse cx="50" cy="70" rx="34" ry="10" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M18 50L34 36H84L68 50Z" fill="#fff0a0"/>` +
    `<path d="M68 50L84 36V64L68 78Z" fill="#f2c94e"/>` +
    `<rect x="18" y="50" width="50" height="28" fill="#ffe27a"/>` +
    `<path d="M40 42C40 36 52 36 54 40C56 44 48 46 46 42" stroke="#fff" stroke-width="4"/>`,
  잼:
    `<rect x="22" y="36" width="56" height="54" rx="12" fill="#e8403a"/>` +
    `<path d="M30 46V78" stroke="#ff9a8a" stroke-width="4"/>` +
    `<ellipse cx="54" cy="64" rx="15" ry="13" fill="#fff"/>` +
    `<path d="M54 72C46 66 46 58 50 57C52 56 54 58 54 59C54 58 56 56 58 57C62 58 62 66 54 72Z" fill="#e8403a" stroke-width="2.5"/><path d="M51 56L54 52L57 56" stroke="#43b04a" stroke-width="3"/>` +
    `<rect x="24" y="28" width="52" height="10" rx="3" fill="#f2c14e"/>` +
    `<path d="M18 32C22 16 78 16 82 32L80 42Q74 38 68 42Q62 38 56 42Q50 38 44 42Q38 38 32 42Q26 38 20 42Z" fill="#fff"/>` +
    [
      [30, 26],
      [46, 22],
      [62, 24],
      [38, 34],
      [54, 32],
      [70, 34],
    ]
      .map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" fill="#ff5c70" stroke="none"/>`)
      .join('') +
    `<path d="M18 32C22 16 78 16 82 32L80 42Q74 38 68 42Q62 38 56 42Q50 38 44 42Q38 38 32 42Q26 38 20 42Z"/>`,
  시리얼:
    tube('M64 44L86 12', '#8a96b0', 5) +
    `<ellipse cx="87" cy="10" rx="7" ry="5" fill="#dfe8f5" transform="rotate(-55 87 10)"/>` +
    bowl(
      52,
      '#fffaf0',
      '#3b78e6',
      [
        [30, 50, '#ff9f1a'],
        [44, 54, '#ffd23f'],
        [60, 54, '#ff9aa8'],
        [72, 50, '#ffd23f'],
        [38, 42, '#ff9aa8'],
        [52, 38, '#ff9f1a'],
        [66, 42, '#ffd23f'],
        [46, 30, '#ffd23f'],
        [58, 28, '#ff9aa8'],
      ]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="2.2" fill="#fffaf0" stroke-width="2"/>`)
        .join(''),
      '#8fd3ff',
    ),
  두유:
    `<path d="M16 28L28 20H66L54 28Z" fill="#fbe9b8"/>` +
    `<path d="M54 28L66 20V80L54 88Z" fill="#e0bf6a"/>` +
    `<rect x="16" y="28" width="38" height="60" fill="#f5d98a"/>` +
    tube('M44 24L48 8L56 4', '#ff9aa8', 4) +
    `<ellipse cx="35" cy="60" rx="13" ry="15" fill="#fffaf0"/>` +
    `<path d="M26 66C24 56 32 48 42 50C46 58 38 70 26 66Z" fill="#6cc24a" stroke-width="2.5"/>` +
    [
      [74, 84, 0],
      [88, 76, 30],
      [80, 68, -20],
    ]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="6.5" fill="#f2d27a" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 3} ${y - 2}q2-2 5-2" stroke="#fff4c8" stroke-width="2.5"/>`)
      .join(''),
  초콜릿:
    `<g transform="rotate(-12 50 50)">` +
    `<rect x="22" y="10" width="56" height="80" rx="4" fill="#6b3a22"/>` +
    [0, 1]
      .map((c) =>
        [0, 1, 2]
          .map((r) => `<rect x="${27 + c * 25}" y="${15 + r * 17}" width="21" height="13" rx="2" fill="#8e5232" stroke-width="2.5"/><path d="M${30 + c * 25} ${18 + r * 17}h8" stroke="#b07048" stroke-width="2.5"/>`)
          .join(''),
      )
      .join('') +
    `<path d="M18 62L24 66L30 60L36 66L42 60L48 66L54 60L60 66L66 60L72 66L78 60L82 64V94H18Z" fill="#dfe8f5"/>` +
    `<rect x="18" y="70" width="64" height="24" fill="#e8553d"/>` +
    `<path d="M30 82H70" stroke="#ffd23f" stroke-width="4"/>` +
    `</g>`,
  껌:
    `<circle cx="50" cy="40" r="28" fill="#ffd6ad"/>` +
    `<path d="M22 38C20 16 36 10 50 10S80 16 78 38C72 28 62 24 50 24S28 28 22 38Z" fill="#5a3b24"/>` +
    `<circle cx="22" cy="42" r="6" fill="#ffd6ad"/><circle cx="78" cy="42" r="6" fill="#ffd6ad"/>` +
    `<path d="M22 38C20 16 36 10 50 10S80 16 78 38"/>` +
    dot(39, 38) +
    dot(61, 38) +
    `<circle cx="50" cy="70" r="24" fill="#ff7ab0"/>` +
    `<path d="M36 60C38 54 42 51 47 50" stroke="#ffd0e4" stroke-width="4"/>` +
    `<circle cx="36" cy="62" r="2.5" fill="#fff" stroke="none"/>`,
  와플:
    `<g transform="rotate(-8 50 50)">` +
    `<rect x="14" y="14" width="72" height="72" rx="12" fill="#f2b94e"/>` +
    [0, 1, 2, 3]
      .map((c) => [0, 1, 2, 3].map((r) => `<rect x="${20 + c * 16}" y="${20 + r * 16}" width="12" height="12" rx="2" fill="#d98f2e" stroke-width="2"/>`).join(''))
      .join('') +
    `</g>` +
    `<rect x="38" y="38" width="24" height="18" rx="4" fill="#fff4b0" transform="rotate(-8 50 47)"/>` +
    '',
  푸딩:
    `<ellipse cx="50" cy="80" rx="42" ry="11" fill="#dff3ff"/><ellipse cx="50" cy="79" rx="32" ry="7" stroke="#8fd3ff" stroke-width="3"/>` +
    `<path d="M22 78C22 70 28 46 32 36H68C72 46 78 70 78 78C78 84 22 84 22 78Z" fill="#ffd97a"/>` +
    `<path d="M32 36H68C69 40 70 44 70 46Q64 52 60 45Q55 54 49 46Q43 52 38 46Q34 50 30 46C30 43 31 39 32 36Z" fill="#9a5b2e"/>` +
    `<ellipse cx="50" cy="36" rx="18" ry="5" fill="#8a4a20"/>` +
    `<path d="M50 30C50 22 54 16 60 14" stroke="#3a9e47" stroke-width="3"/>` +
    `<circle cx="50" cy="26" r="7" fill="#e8403a"/><path d="M47 23q2-2 4-1" stroke="#ff9a8a" stroke-width="2.5"/>` +
    `<path d="M32 60C32 68 34 72 36 74" stroke="#fff0b8" stroke-width="4"/>` +
    `<path d="M12 50q-4 6 0 12M88 50q4 6 0 12" stroke="#9aa6c4" stroke-width="3"/>`,
  빙수:
    tube('M72 50L90 18', '#ff9f1a', 5) +
    blob('#fff', [
      [50, 44, 24],
      [30, 54, 14],
      [70, 54, 14],
    ]) +
    `<path d="M34 50l3 2M62 46l3-2M44 56l3 1M58 58l3 0M28 58l3-1" stroke="#9ed8f8" stroke-width="3"/>` +
    blob('#8a2f3a', [
      [50, 28, 12],
      [40, 34, 8],
      [60, 34, 8],
    ]) +
    dot(46, 26, 1.8, '#c05a66') +
    dot(54, 30, 1.8, '#c05a66') +
    dot(42, 34, 1.8, '#c05a66') +
    `<rect x="62" y="40" width="9" height="9" rx="2" fill="#ffd0dc" stroke-width="2.5"/><rect x="28" y="44" width="9" height="9" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M40 88H60L58 80H42Z" fill="#bfe6ff"/>` +
    `<path d="M12 60C12 74 28 84 50 84S88 74 88 60Z" fill="#bfe6ff"/>` +
    `<path d="M20 66C24 72 30 76 36 78" stroke="#fff" stroke-width="4"/>`,
  솜사탕:
    tube('M50 54L50 96', '#fff', 4) +
    blob('#ff9ec4', [
      [50, 26, 18],
      [30, 36, 16],
      [70, 36, 16],
      [36, 56, 16],
      [64, 56, 16],
      [50, 44, 20],
      [50, 62, 12],
    ]) +
    `<path d="M34 34q6-8 14-2M56 26q8-4 12 4M40 52q8 6 16 0M60 46q6 2 8 8" stroke="#ffd0e4" stroke-width="3.5"/>`,
  막대사탕:
    tube('M50 66V96', '#fff', 5) +
    `<circle cx="50" cy="38" r="30" fill="#ff5c8a"/>` +
    `<path d="${spiral(50, 38, 25, 3.2)}" stroke="#fff" stroke-width="6"/>` +
    `<path d="${spiral(50, 38, 25, 3.2)}" stroke="#ffd23f" stroke-width="2.5" transform="rotate(20 50 38)"/>` +
    `<circle cx="50" cy="38" r="30"/>` +
    `<path d="M50 72L40 66L42 78ZM50 72L60 66L58 78Z" fill="#3b8fe0"/>`,
  송편:
    `<ellipse cx="50" cy="74" rx="44" ry="16" fill="#dff3ff"/>` +
    `<path d="M16 72L28 62M20 78L34 70M72 64L84 72M66 70L80 80" stroke="#3a9e47" stroke-width="2.5"/>` +
    songpyeon(29, 70, '#fff') +
    songpyeon(50, 72, '#ffb3c8') +
    songpyeon(71, 70, '#a8d88a') +
    songpyeon(39, 54, '#ffe08a') +
    songpyeon(61, 54, '#fff') +
    songpyeon(50, 38, '#ffb3c8'),
  양배추:
    `<circle cx="50" cy="54" r="34" fill="#a8dc78"/>` +
    `<path d="M50 88C60 70 60 44 50 30M50 88C40 70 38 52 32 40M50 88C62 72 66 56 70 44" stroke="#e6f7d0" stroke-width="3.5"/>` +
    `<path d="M50 30C56 24 64 22 70 26" stroke="#6cb84a" stroke-width="3"/>` +
    `<path d="M50 90C22 90 12 66 16 46C19 32 28 22 38 18C28 36 28 64 50 90Z" fill="#5fb04a"/>` +
    `<path d="M50 90C78 90 88 66 84 46C81 32 72 22 62 18C72 36 72 64 50 90Z" fill="#4c9e3c"/>` +
    `<path d="M26 44C26 60 32 74 42 84M74 44C74 60 68 74 58 84" stroke="#9ed070" stroke-width="3"/>`,
  브로콜리:
    `<path d="M38 92L44 58H56L62 92Z" fill="#b9e08a"/>` +
    `<path d="M50 62L36 50M50 62L64 50M50 62V46" stroke="#b9e08a" stroke-width="9"/><path d="M44 60L36 50M56 60L64 50" stroke-width="2.5"/>` +
    blob('#3a9e47', [
      [30, 40, 16],
      [50, 30, 20],
      [70, 40, 16],
      [40, 52, 12],
      [60, 52, 12],
    ]) +
    [
      [26, 38],
      [34, 46],
      [44, 26],
      [56, 30],
      [50, 40],
      [66, 36],
      [74, 44],
      [60, 50],
      [40, 50],
      [48, 20],
    ]
      .map(([x, y]) => dot(x, y, 2.4, '#6cc24a'))
      .join(''),
  시금치:
    [-44, -22, 0, 22, 44]
      .map((a, i) => {
        const t = ((a - 90) * Math.PI) / 180;
        const lx = 50 + 40 * Math.cos(t);
        const ly = 80 + 44 * Math.sin(t);
        return (
          `<path d="M50 80L${f(50 + 20 * Math.cos(t))} ${f(80 + 22 * Math.sin(t))}" stroke="#7cc242" stroke-width="5"/>` +
          `<ellipse cx="${f(lx)}" cy="${f(ly)}" rx="12" ry="21" fill="${i % 2 ? '#43b04a' : '#3a9e47'}" transform="rotate(${a} ${f(lx)} ${f(ly)})"/>` +
          `<path d="M${f(50 + 26 * Math.cos(t))} ${f(80 + 28 * Math.sin(t))}L${f(50 + 52 * Math.cos(t))} ${f(80 + 56 * Math.sin(t))}" stroke="#8fd46a" stroke-width="2.5"/>`
        );
      })
      .join('') +
    `<rect x="40" y="70" width="20" height="10" rx="3" fill="#ff9f1a"/>` +
    `<path d="M44 80L42 90M50 80V92M56 80L58 90" stroke="#e85d9a" stroke-width="4"/>`,
  콩나물:
    [
      ['M46 92C44 70 20 50 22 28', 22, 26, -30],
      ['M48 92C46 66 34 40 36 18', 36, 16, -15],
      ['M50 92C50 64 52 36 52 14', 52, 12, 0],
      ['M52 92C54 66 66 42 68 20', 68, 18, 15],
      ['M54 92C56 70 80 52 80 32', 80, 30, 30],
      ['M48 92C44 76 30 60 28 46', 28, 44, -40],
      ['M52 92C56 76 64 62 64 40', 64, 38, 20],
    ]
      .map(([d]) => tube(d as string, '#fffaf0', 4))
      .join('') +
    [
      [22, 26, -30],
      [36, 16, -15],
      [52, 12, 0],
      [68, 18, 15],
      [80, 30, 30],
      [28, 44, -40],
      [64, 38, 20],
    ]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="6.5" fill="#ffd23f" transform="rotate(${a} ${x} ${y})"/>`)
      .join(''),
  마늘:
    `<path d="M50 6L46 16H54Z" fill="#f0e2d0"/>` +
    `<path d="M50 14C54 24 58 28 70 34C86 42 88 64 78 76C70 86 60 88 50 88S30 86 22 76C12 64 14 42 30 34C42 28 46 24 50 14Z" fill="#fff8ee"/>` +
    `<path d="M50 30C40 44 40 70 50 88M50 30C60 44 60 70 50 88M36 38C26 52 28 72 36 84M64 38C74 52 72 72 64 84" stroke="#c9a8d8" stroke-width="3"/>` +
    `<path d="M24 56C24 48 27 43 31 40" stroke="#fff" stroke-width="4"/>` +
    `<path d="M42 88L40 94M50 88V95M58 88L60 94" stroke="#b8a080" stroke-width="3"/>`,
  상추:
    `<path d="M46 94L50 68L54 94Z" fill="#d8f0b0"/>` +
    blob('#7cc242', [
      [50, 30, 20],
      [32, 40, 16],
      [68, 40, 16],
      [26, 58, 14],
      [74, 58, 14],
      [50, 54, 24],
      [36, 72, 13],
      [64, 72, 13],
      [50, 16, 10],
    ]) +
    `<path d="M50 92V20" stroke="#d8f0b0" stroke-width="4"/>` +
    `<path d="M50 40L32 30M50 40L68 30M50 56L28 48M50 56L72 48M50 70L34 64M50 70L66 64" stroke="#d8f0b0" stroke-width="3"/>`,
  생선:
    `<ellipse cx="50" cy="62" rx="46" ry="24" fill="#fff"/><ellipse cx="50" cy="62" rx="38" ry="17" stroke="#8fd3ff" stroke-width="3"/>` +
    `<path d="M68 56L90 40L86 56L90 72Z" fill="#c07a2a"/>` +
    `<path d="M12 56C22 36 56 34 72 56C56 76 22 76 12 56Z" fill="#e0a048"/>` +
    `<path d="M32 44Q28 56 32 68" stroke="#b86e28" stroke-width="3"/>` +
    `<path d="M42 44L50 66M52 42L60 64M62 46L66 58" stroke="#8a4a1e" stroke-width="4"/>` +
    `<circle cx="22" cy="53" r="4.5" fill="#fff"/>` +
    dot(22, 53, 2),
  불고기:
    steam(24) +
    `<ellipse cx="50" cy="62" rx="44" ry="28" fill="#4a5068"/><ellipse cx="50" cy="62" rx="36" ry="21" fill="#6a7390"/>` +
    `<path d="M20 58C26 48 36 54 42 48C48 54 54 46 60 52C58 62 48 64 42 68C34 72 24 68 20 58Z" fill="#8a4a2a"/>` +
    `<path d="M48 70C54 60 64 64 70 56C76 60 82 58 80 66C76 76 64 78 56 78C52 78 48 76 48 70Z" fill="#9a5530"/>` +
    `<path d="M50 50C56 42 68 44 72 50C68 56 58 58 50 50Z" fill="#7a3e22"/>` +
    `<path d="M28 56q6-4 12 0M58 70q6-4 12-2" stroke="#c07a4a" stroke-width="2.5"/>` +
    `<path d="M34 72q6 4 12 2M62 46q4-4 10-2" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M40 60l6-2M66 62l6 2M30 48l5 3" stroke="#6cc24a" stroke-width="3.5"/>` +
    dot(46, 56, 1.5, '#fff') +
    dot(66, 66, 1.5, '#fff') +
    dot(30, 62, 1.5, '#fff'),
  스파게티:
    `<ellipse cx="50" cy="76" rx="44" ry="15" fill="#fff"/><ellipse cx="50" cy="76" rx="36" ry="10" stroke="#8fd3ff" stroke-width="3"/>` +
    blob('#ffd98a', [
      [34, 68, 13],
      [52, 64, 16],
      [68, 70, 11],
    ]) +
    `<path d="M26 70q5-6 10 0t10 0t10 0t10 0M34 62q5-6 10 0t10 0" stroke="#e8b850" stroke-width="2.5"/>` +
    blob('#e8403a', [
      [48, 56, 10],
      [58, 60, 7],
      [40, 62, 6],
    ]) +
    dot(46, 54, 2, '#ff9a8a') +
    tube('M58 50L84 8', '#b8c2d8', 5) +
    `<ellipse cx="60" cy="46" rx="11" ry="7" fill="#ffd98a" transform="rotate(-58 60 46)"/>` +
    `<path d="M54 44q6-4 12 2M55 50q6-4 11 1" stroke="#e8b850" stroke-width="2.5"/>` +
    `<path d="M60 40q-4 4 0 8" stroke="#e8403a" stroke-width="4"/>` +
    `<circle cx="72" cy="58" r="3" fill="#43b04a" stroke-width="2"/>`,
  샌드위치:
    [
      [32, '#e8c080', ''],
      [24, '#ffd23f', ''],
      [17, '#e8403a', ''],
      [9, '#5fc24a', 'lettuce'],
      [0, '#fff1cf', 'top'],
    ]
      .map(([dy, c, k]) => {
        const y = dy as number;
        const tri = `M12 ${58 + y}L50 ${10 + y}L88 ${58 + y}Z`;
        if (k === 'lettuce')
          return `<path d="M7 ${62 + y}Q13 ${56 + y} 19 ${62 + y}T31 ${62 + y}T43 ${62 + y}T55 ${62 + y}T67 ${62 + y}T79 ${62 + y}T93 ${62 + y}L50 ${8 + y}Z" fill="${c}"/>`;
        if (k === 'top') return `<path d="${tri}" fill="#c9782f"/><path d="M23 52L50 18L77 52Z" fill="${c}" stroke="none"/>`;
        return `<path d="${tri}" fill="${c}"/>`;
      })
      .join(''),
  토스트:
    breadSlice(0, 0, '#f0b848', '#a0561f') +
    `<path d="M32 36q8-4 16 0t16 0M34 74q8-4 16 0t16 0" stroke="#d8942e" stroke-width="3"/>` +
    `<rect x="38" y="46" width="24" height="18" rx="4" fill="#fff4b0" transform="rotate(-10 50 55)"/>` +
    sparkle(84, 14, 7) +
    sparkle(14, 22, 5),
  미역국:
    tube('M70 40L90 10', '#b8c2d8', 5) +
    `<ellipse cx="91" cy="8" rx="7" ry="5" fill="#dff3ff" transform="rotate(-57 91 8)"/>` +
    steam(26) +
    bowl(
      48,
      '#d9c28e',
      '#fff',
      `<path d="M20 48q6-8 12 0t12 0t12 0M42 42q6-7 12 0t12 0t12 0M28 54q6-6 12 0t12 0t12 0t12 0" stroke="#2f6b3a" stroke-width="5"/>` +
        `<rect x="34" y="40" width="7" height="6" rx="1.5" fill="#9a5b2e" stroke-width="2"/><rect x="62" y="48" width="7" height="6" rx="1.5" fill="#9a5b2e" stroke-width="2"/>`,
      '#e8553d',
    ),
};
