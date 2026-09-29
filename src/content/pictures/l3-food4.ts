// 음식 그림 묶음 (3단계 어휘: 채소·버섯·과일·간식·음료). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 대파 굵은 한 줄기 / 쪽파 흰 알뿌리 다발 / 부추 뿌리 없는 가는 잎 다발(눕힘),
// 청양고추 가늘고 작은 초록+불꽃 / 풋고추 통통한 연두, 홍시 빨갛고 말랑(접시·숟가락) / 단감 주황 단단(조각),
// 청포도 연두 알 / 거봉 크고 짙은 보라 알, 팽이버섯 흰 가는 줄기+갈색 밑동 / 숙주 초록 작은 머리(접시), 팥빙수 팥이 산처럼.
import { dot, blob, sparkle, tube } from '../pictureKit.ts';

const f = (n: number) => n.toFixed(1);

/** 가장자리가 물결인 도형 (케일·양상추) */
function scallop(cx: number, cy: number, rx: number, ry: number, n: number, a: number, fill: string): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = t - Math.PI / n;
      d += `Q${f(cx + rx * (1 + a) * Math.cos(m))} ${f(cy + ry * (1 + a) * Math.sin(m))} ${f(x)} ${f(y)}`;
    }
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
}

/** 접시 */
const plate = (cy: number, rx = 44, ry = 11) =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 4}" stroke="#dfe8f5" stroke-width="2.5"/>`;

/** 알이 줄줄이 달린 송이 (포도·거봉): rows = 줄마다 알 수 */
function bunch(cx: number, top: number, rows: number[], r: number, fill: string, shine: string): string {
  let c = '';
  rows.forEach((n, j) => {
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * r * 1.75;
      const y = top + j * r * 1.55;
      c += `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}"/><path d="M${f(x - r * 0.5)} ${f(y - r * 0.1)}q${f(r * 0.1)} ${f(-r * 0.4)} ${f(r * 0.45)} ${f(-r * 0.5)}" stroke="${shine}" stroke-width="2.5"/>`;
    }
  });
  return c;
}

/** 작은 알갱이가 뭉친 열매 (라즈베리·블랙베리) */
function drupe(cx: number, top: number, rows: number[], r: number, fill: string, shine: string): string {
  let c = '';
  rows.forEach((n, j) => {
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * r * 1.7;
      const y = top + j * r * 1.5;
      c += `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke-width="2.5"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.28, shine);
    }
  });
  return c;
}

/** 고추 한 개: (x,y) 꼭지, len 길이, w 반폭, rot 기울기 */
function pepper(x: number, y: number, len: number, w: number, rot: number, fill: string): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    tube(`M0 4Q1 -6 8 -11`, '#3a7a30', 3) +
    `<path d="M${-w} 6C${-w} ${f(len * 0.5)} ${f(-w * 0.4)} ${f(len * 0.85)} ${f(w * 0.5)} ${len}C${f(w * 0.9)} ${f(len * 0.75)} ${w} ${f(len * 0.5)} ${w} 6Q0 1 ${-w} 6Z" fill="${fill}"/>` +
    `<path d="M${-w - 1} 7Q0 -1 ${w + 1} 7Q0 12 ${-w - 1} 7Z" fill="#3a7a30"/>` +
    `<path d="M${f(-w * 0.45)} 14C${f(-w * 0.5)} ${f(len * 0.4)} ${f(-w * 0.35)} ${f(len * 0.55)} ${f(-w * 0.2)} ${f(len * 0.65)}" stroke="#fff" stroke-width="2.5" opacity=".55"/>` +
    `</g>`
  );
}

/** 딸기 모양 (탕후루) */
function berry(x: number, y: number, fill: string): string {
  return (
    `<path d="M${x - 13} ${y - 7}C${x - 14} ${y + 6} ${x - 4} ${y + 14} ${x} ${y + 15}C${x + 4} ${y + 14} ${x + 14} ${y + 6} ${x + 13} ${y - 7}C${x + 8} ${y - 12} ${x - 8} ${y - 12} ${x - 13} ${y - 7}Z" fill="${fill}"/>` +
    [
      [-6, -2],
      [4, -3],
      [-2, 6],
      [7, 4],
    ]
      .map(([dx, dy]) => dot(x + dx, y + dy, 1.3, '#ffe28a'))
      .join('')
  );
}

export const PICS: Record<string, string> = {
  토란:
    `<path d="M60 44Q64 34 72 26" stroke-width="7"/><path d="M60 44Q64 34 72 26" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<path d="M72 30C60 28 50 18 54 7C60 11 66 12 72 16C78 11 86 8 93 11C95 22 85 29 72 30Z" fill="#43b04a"/><path d="M72 16V28" stroke="#8fd46a" stroke-width="2.5"/>` +
    `<g transform="rotate(-18 36 60)">` +
    `<ellipse cx="36" cy="60" rx="20" ry="26" fill="#8a5a3a"/>` +
    `<path d="M18 48Q36 55 54 48M16 60Q36 67 56 60M18 72Q36 79 54 72" stroke="#5a3b24" stroke-width="3"/>` +
    `<path d="M16 50l-5-2M15 62l-6 0M18 74l-5 3M56 50l5-2M57 62l6 0M54 74l5 3" stroke="#5a3b24" stroke-width="2.5"/>` +
    `<path d="M34 34q1-6 5-8" stroke="#ff9aa8" stroke-width="5"/></g>` +
    `<ellipse cx="68" cy="70" rx="18" ry="20" fill="#f6f0e4"/>` +
    `<path d="M50 66C52 52 84 52 86 66C80 60 56 60 50 66Z" fill="#8a5a3a"/>` +
    [
      [62, 72],
      [70, 78],
      [76, 70],
      [66, 84],
      [60, 80],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#a58ac4'))
      .join(''),
  참마:
    `<g transform="rotate(-35 50 52)">` +
    `<path d="M20 42C30 38 70 40 86 44C95 46 95 58 86 60C70 64 30 66 20 62Z" fill="#c9a27a"/>` +
    `<ellipse cx="20" cy="52" rx="6" ry="10" fill="#fbf7ef"/>` +
    `<path d="M40 40l-2-6M56 41l1-6M72 43l2-6M42 64l-1 6M60 63l1 6M78 60l3 5" stroke="#8a6440" stroke-width="2.5"/>` +
    [
      [36, 48],
      [50, 56],
      [64, 48],
      [78, 54],
      [46, 46],
    ]
      .map(([x, y]) => dot(x, y, 1.7, '#8a6440'))
      .join('') +
    `</g>` +
    `<ellipse cx="72" cy="80" rx="15" ry="10" fill="#c9a27a"/><ellipse cx="72" cy="78" rx="12" ry="7" fill="#fbf7ef" stroke-width="2.5"/>` +
    `<path d="M68 76q4-2 8 0" stroke="#e8e0cc" stroke-width="2.5"/>`,
  생강:
    blob('#e8c27a', [
      [34, 58, 15],
      [54, 54, 15],
      [72, 50, 11],
      [24, 42, 9],
      [44, 38, 10],
      [64, 34, 9],
      [80, 64, 9],
      [46, 72, 11],
    ]) +
    `<path d="M24 60q10-4 20 0M46 52q8 4 16 0M66 47q6 3 12 0M40 72q6 3 12 0M20 44q4 2 8 0M58 36q5 3 10 0" stroke="#b98a45" stroke-width="3"/>` +
    `<ellipse cx="24" cy="34" rx="4.5" ry="4" fill="#ff9aa8"/><ellipse cx="44" cy="29" rx="4.5" ry="4" fill="#ff9aa8"/><ellipse cx="64" cy="26" rx="4.5" ry="4" fill="#ff9aa8"/>` +
    `<circle cx="76" cy="82" r="11" fill="#e8c27a"/><circle cx="76" cy="82" r="8" fill="#f8e28a" stroke-width="2"/>` +
    dot(73, 80, 1.3, '#d8b050') +
    dot(79, 84, 1.3, '#d8b050') +
    dot(78, 78, 1.3, '#d8b050'),
  대파:
    `<path d="M44 58C40 38 30 20 14 8C28 10 44 22 52 54Z" fill="#3a9e47"/>` +
    `<path d="M50 54C56 30 70 16 88 8C78 22 64 36 58 58Z" fill="#5fc24a"/>` +
    `<path d="M42 60C42 38 45 20 50 4C55 20 58 38 58 60Z" fill="#43b04a"/>` +
    `<path d="M44 89l-7 7M50 90v7M56 89l7 7M47 90l-3 7M53 90l3 7" stroke-width="2.5"/>` +
    `<rect x="39" y="54" width="22" height="37" rx="9" fill="#fff"/>` +
    `<path d="M40.8 57H59.2V65H40.8Z" fill="#c8e6a0" stroke="none"/><rect x="39" y="54" width="22" height="37" rx="9"/>` +
    `<path d="M46 70V84M54 70V84" stroke="#dfe8f5" stroke-width="3"/>`,
  쪽파:
    Array.from({ length: 6 }, (_, i) => {
      const bx = 36 + i * 5.6;
      const tx = 18 + i * 12.8;
      const ty = 8 + Math.abs(i - 2.5) * 4;
      return tube(`M${f(bx)} 66Q${f(bx)} 40 ${f(tx)} ${f(ty)}`, i % 2 ? '#43b04a' : '#5fc24a', 3.5);
    }).join('') +
    Array.from({ length: 6 }, (_, i) => {
      const bx = 36 + i * 5.6;
      return tube(`M${f(bx)} 82V64`, '#fff', 3.5) + `<path d="M${f(bx)} 90l-2 5M${f(bx)} 90l2 5" stroke-width="2"/>`;
    }).join('') +
    Array.from({ length: 6 }, (_, i) => `<ellipse cx="${f(36 + i * 5.6)}" cy="85" rx="4.2" ry="5.5" fill="#fff"/>`).join('') +
    `<rect x="30" y="56" width="40" height="8" rx="3" fill="#e8553d"/>`,
  부추:
    Array.from({ length: 10 }, (_, i) => {
      const y0 = 40 + i * 2.4;
      const ty = 16 + i * 7.4;
      return tube(`M12 ${f(y0)}Q56 ${f(y0 + (i - 4.5) * 1.5)} 90 ${f(ty)}`, i % 2 ? '#3a9e47' : '#4caf50', 2.5);
    }).join('') +
    Array.from({ length: 10 }, (_, i) => `<path d="M12 ${f(40 + i * 2.4)}H20" stroke="#e2f4c0" stroke-width="2.5"/>`).join('') +
    `<rect x="30" y="34" width="9" height="34" rx="3" fill="#ffd23f"/>`,
  미나리:
    Array.from({ length: 5 }, (_, i) => {
      const bx = 44 + i * 3;
      const tx = 18 + i * 16;
      const ty = 34 + Math.abs(i - 2) * 4;
      return tube(`M${bx} 94Q${bx} 60 ${tx} ${ty}`, '#a6d86a', 3.5);
    }).join('') +
    Array.from({ length: 5 }, (_, i) => tube(`M${44 + i * 3} 94V87`, '#f0b0c8', 3.5)).join('') +
    Array.from({ length: 5 }, (_, i) => {
      const tx = 18 + i * 16;
      const ty = 34 + Math.abs(i - 2) * 4;
      return (
        `<ellipse cx="${tx - 7}" cy="${ty - 4}" rx="7" ry="5" fill="#43b04a" transform="rotate(-30 ${tx - 7} ${ty - 4})"/>` +
        `<ellipse cx="${tx + 7}" cy="${ty - 4}" rx="7" ry="5" fill="#43b04a" transform="rotate(30 ${tx + 7} ${ty - 4})"/>` +
        `<ellipse cx="${tx}" cy="${ty - 11}" rx="5" ry="7" fill="#5fc24a"/>`
      );
    }).join('') +
    `<rect x="38" y="70" width="26" height="7" rx="3" fill="#ffd23f"/>`,
  쑥갓:
    [-38, 38, 0]
      .map((a, k) => {
        const len = k === 2 ? 46 : 58;
        const cs: [number, number, number][] = [];
        for (let s = 8; s <= len; s += 8) {
          const sz = 3 + (s / len) * 3.5;
          cs.push([0, -s, 4]);
          if (s < len) cs.push([-sz - 3, -s - 2, sz], [sz + 3, -s - 2, sz]);
        }
        cs.push([0, -len - 4, 5]);
        return (
          `<g transform="translate(50 92) rotate(${a})">` +
          blob(k === 1 ? '#3a9e47' : '#43b04a', cs) +
          `<path d="M0 0V${-len}" stroke="#8fd46a" stroke-width="2.5"/></g>`
        );
      })
      .join('') +
    tube('M50 50V26', '#5fc24a', 3) +
    Array.from({ length: 10 }, (_, i) => {
      const t = (i * Math.PI) / 5;
      return `<ellipse cx="${f(50 + 10 * Math.cos(t))}" cy="${f(18 + 10 * Math.sin(t))}" rx="5" ry="3.2" fill="#ffd23f" stroke-width="2" transform="rotate(${f((t * 180) / Math.PI)} ${f(50 + 10 * Math.cos(t))} ${f(18 + 10 * Math.sin(t))})"/>`;
    }).join('') +
    `<circle cx="50" cy="18" r="6" fill="#e8862e" stroke-width="2.5"/>`,
  청경채:
    [-26, 26, -13, 13, 0]
      .map(
        (a) =>
          `<g transform="rotate(${a} 50 92)">` +
          `<ellipse cx="50" cy="36" rx="15" ry="22" fill="${a === 0 ? '#43b04a' : Math.abs(a) > 20 ? '#2f8a3e' : '#3a9e47'}"/>` +
          `<path d="M44 92C42 76 40 64 39 52C44 56 56 56 61 52C60 64 58 76 56 92Z" fill="#e2f4c0"/>` +
          `<path d="M50 54V22" stroke="#c8e6a0" stroke-width="3"/></g>`,
      )
      .join('') +
    `<path d="M40 92H60" stroke-width="4"/>`,
  케일:
    `<g transform="rotate(-18 50 50)">` +
    scallop(50, 42, 30, 30, 22, 0.1, '#3a8f5a') +
    `</g>` +
    tube('M50 70L54 94', '#9fd48a', 5) +
    scallop(50, 44, 34, 30, 24, 0.11, '#2e7d4f') +
    `<path d="M50 74V18M50 34L34 24M50 34L66 24M50 48L28 40M50 48L72 40M50 62L32 58M50 62L68 58" stroke="#8fcfa0" stroke-width="3"/>` +
    scallop(50, 44, 22, 18, 16, 0.14, 'none').replace('fill="none"', 'fill="none" stroke="#1f5a38" stroke-width="2.5"'),
  아스파라거스:
    [
      [38, 30, 16],
      [44, 40, 11],
      [56, 60, 11],
      [62, 70, 16],
      [50, 50, 8],
    ]
      .map(
        ([bx, tx, ty]) =>
          tube(`M${bx} 92L${tx} ${ty + 10}`, '#6ab04c', 6) +
          `<path d="M${tx - 5.5} ${ty + 12}Q${tx - 5} ${ty} ${tx} ${ty - 6}Q${tx + 5} ${ty} ${tx + 5.5} ${ty + 12}Q${tx} ${ty + 15} ${tx - 5.5} ${ty + 12}Z" fill="#4e8f3a"/>` +
          `<path d="M${f(tx - 3 + (bx - tx) * 0.35)} ${f(ty + 10 + (92 - ty - 10) * 0.35)}l3 -4l3 4M${f(tx - 3 + (bx - tx) * 0.6)} ${f(ty + 10 + (92 - ty - 10) * 0.6)}l3 -4l3 4" stroke="#3f7a30" stroke-width="2"/>` +
          `<ellipse cx="${bx}" cy="92" rx="5" ry="2.5" fill="#d9ecb0" stroke-width="2"/>`,
      )
      .join('') +
    `<rect x="30" y="70" width="40" height="8" rx="3" fill="#e8553d"/>`,
  콜리플라워:
    `<path d="M50 90C26 90 10 72 10 52C22 60 34 64 50 64S78 60 90 52C90 72 74 90 50 90Z" fill="#43b04a"/>` +
    blob('#fbf3dc', [
      [50, 44, 20],
      [31, 50, 14],
      [69, 50, 14],
      [38, 30, 13],
      [62, 30, 13],
      [50, 60, 14],
      [24, 38, 9],
      [76, 38, 9],
    ]) +
    `<path d="M36 36q4-4 8 0M56 36q4-4 8 0M44 50q6-4 12 0M26 50q4-4 8 0M66 50q4-4 8 0M46 24q4-3 8 0" stroke="#e0c890" stroke-width="3"/>` +
    `<path d="M10 58C24 56 40 66 46 90C28 92 12 78 10 58Z" fill="#3a9e47"/><path d="M90 58C76 56 60 66 54 90C72 92 88 78 90 58Z" fill="#3a9e47"/>` +
    `<path d="M20 64Q34 72 42 86M80 64Q66 72 58 86" stroke="#8fd46a" stroke-width="2.5"/>`,
  양상추:
    scallop(50, 56, 38, 34, 14, 0.09, '#a8d86a') +
    `<circle cx="50" cy="52" r="29" fill="#d4ee9a"/>` +
    `<path d="M24 50C30 30 70 30 76 50M28 64C32 42 68 42 72 64M34 40C40 22 60 22 66 40" stroke="#9cc95a" stroke-width="3"/>` +
    `<path d="M40 34Q50 26 60 34Q50 40 40 34Z" fill="#eef8c8" stroke-width="2.5"/>` +
    `<path d="M50 60V84M50 72L40 80M50 72L60 80" stroke="#eef8c8" stroke-width="3"/>`,
  비트:
    tube('M40 34Q34 20 26 10', '#c43a62', 3) +
    tube('M42 32Q44 18 46 6', '#c43a62', 3) +
    tube('M44 34Q52 22 62 14', '#c43a62', 3) +
    `<ellipse cx="22" cy="12" rx="6" ry="9" fill="#43b04a" transform="rotate(-40 22 12)"/><ellipse cx="46" cy="8" rx="6" ry="9" fill="#3a9e47"/><ellipse cx="65" cy="12" rx="6" ry="9" fill="#43b04a" transform="rotate(45 65 12)"/>` +
    `<path d="M42 32C28 32 16 42 16 58C16 74 34 80 42 90C50 80 68 74 68 58C68 42 56 32 42 32Z" fill="#a3244e"/>` +
    `<path d="M42 90Q44 95 48 97" stroke-width="3"/>` +
    `<path d="M24 52C26 46 30 42 36 40" stroke="#d86088" stroke-width="4"/>` +
    `<circle cx="74" cy="72" r="16" fill="#b8305e"/><circle cx="74" cy="72" r="10.5" stroke="#f08ab0" stroke-width="2.5"/><circle cx="74" cy="72" r="5" stroke="#f08ab0" stroke-width="2.5"/>`,
  순무:
    tube('M48 38Q40 22 28 12', '#5fa84a', 3) +
    tube('M52 38Q60 22 72 12', '#5fa84a', 3) +
    `<ellipse cx="24" cy="14" rx="8" ry="12" fill="#43b04a" transform="rotate(-50 24 14)"/><ellipse cx="76" cy="14" rx="8" ry="12" fill="#43b04a" transform="rotate(50 76 14)"/><ellipse cx="50" cy="16" rx="8" ry="13" fill="#3a9e47"/>` +
    tube('M50 38V24', '#5fa84a', 3) +
    `<path d="M50 90C46 84 18 80 18 60C18 44 34 36 50 36S82 44 82 60C82 80 54 84 50 90Z" fill="#fff"/>` +
    `<path d="M19.5 52C23 42 36 36 50 36S77 42 80.5 52C68 62 32 62 19.5 52Z" fill="#a45cb8" stroke="none"/>` +
    `<path d="M50 90C46 84 18 80 18 60C18 44 34 36 50 36S82 44 82 60C82 80 54 84 50 90Z"/>` +
    `<path d="M50 90Q51 95 54 98" stroke-width="3"/>` +
    `<path d="M30 66C32 72 36 76 42 78" stroke="#dfe8f5" stroke-width="4"/>`,
  열무:
    [
      [-42, 30, '#43b04a'],
      [42, 30, '#43b04a'],
      [-22, 34, '#3a9e47'],
      [22, 34, '#3a9e47'],
      [0, 36, '#5fc24a'],
    ]
      .map(([a, len, c]) => {
        const cs: [number, number, number][] = [];
        for (let s = 8; s <= (len as number); s += 7) cs.push([0, -s, 4], [-7, -s - 3, 5.5], [7, -s - 3, 5.5]);
        cs.push([0, -(len as number) - 6, 8]);
        return `<g transform="translate(50 60) rotate(${a})">${blob(c as string, cs)}<path d="M0 0V${-(len as number)}" stroke="#c8e6a0" stroke-width="2.5"/></g>`;
      })
      .join('') +
    [38, 46, 54, 62]
      .map((x, i) => `<path d="M${x - 4.5} 64Q${x - 4} ${80 + i % 2 * 4} ${x} ${88 + i % 2 * 4}Q${x + 4} ${80 + i % 2 * 4} ${x + 4.5} 64Z" fill="#fff"/>`)
      .join('') +
    `<rect x="32" y="58" width="36" height="8" rx="3" fill="#ffd23f"/>`,
  애호박:
    `<g transform="rotate(-28 50 46)">` +
    `<path d="M12 46C12 38 20 34 32 34H80C88 34 92 40 92 46C92 52 88 58 80 58H32C20 58 12 54 12 46Z" fill="#a6d15a"/>` +
    `<path d="M20 44C24 40 30 39 40 39" stroke="#dcefb0" stroke-width="4"/>` +
    [
      [34, 48],
      [48, 42],
      [60, 50],
      [72, 42],
      [82, 50],
      [44, 53],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" fill="#e2f2b8" stroke="none"/>`)
      .join('') +
    `<path d="M92 42H98V50H92Z" fill="#6b8e3a"/><circle cx="12" cy="46" r="3" fill="#e8d88a" stroke-width="2"/></g>` +
    `<circle cx="28" cy="78" r="15" fill="#a6d15a"/><circle cx="28" cy="78" r="11" fill="#f6f3d0" stroke="none"/>` +
    [
      [24, 74],
      [32, 74],
      [24, 82],
      [32, 82],
      [28, 78],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#e0d090" stroke="none"/>`)
      .join(''),
  단호박:
    `<path d="M46 34C46 24 48 16 56 12L62 16C56 20 54 26 54 34Z" fill="#8a6440"/>` +
    `<path d="M44 34C30 30 10 38 10 56C10 76 28 86 44 86S78 76 78 56C78 38 58 30 44 34Z" fill="#2f6b3a"/>` +
    `<path d="M44 34C34 46 34 74 44 86M44 34C54 46 54 74 44 86M40 34C18 40 16 76 38 85M48 34C70 40 72 76 50 85" stroke="#1e4a28" stroke-width="2.5"/>` +
    [
      [26, 52],
      [30, 70],
      [60, 50],
      [62, 68],
      [44, 60],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#8fc27a'))
      .join('') +
    `<path d="M62 92C66 76 78 66 94 66C94 82 82 92 62 92Z" fill="#ff9f1a"/>` +
    `<path d="M62 92C82 92 94 82 94 66" stroke="#2f6b3a" stroke-width="5"/><path d="M62 92C66 76 78 66 94 66C94 82 82 92 62 92Z"/>` +
    dot(76, 78, 1.8, '#fff2c8') +
    dot(82, 74, 1.8, '#fff2c8'),
  청양고추:
    pepper(30, 20, 60, 5.5, -18, '#2e9e3a') +
    pepper(52, 24, 58, 5.5, 8, '#259030') +
    `<path d="M78 58C66 54 64 40 72 28C74 36 78 36 78 30C88 38 90 54 78 58Z" fill="#ff6a2a"/>` +
    `<path d="M78 54C72 52 72 46 76 40C78 44 80 44 80 42C84 46 84 52 78 54Z" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M74 70q6-4 12 0M76 78q6-4 12 0" stroke="#ff6a2a" stroke-width="3"/>`,
  풋고추:
    pepper(36, 16, 74, 10, -22, '#6cc24a') + pepper(60, 18, 72, 10, 16, '#5fb540'),
  파프리카:
    `<g transform="translate(58 6) scale(.62)">` +
    `<path d="M50 30C34 26 18 34 18 54C18 74 28 88 38 88C42 88 46 84 50 84S58 88 62 88C72 88 82 74 82 54C82 34 66 26 50 30Z" fill="#ffd23f" stroke-width="5"/>` +
    `<path d="M40 32Q50 24 60 32Q50 36 40 32Z" fill="#3a9e47" stroke-width="5"/></g>` +
    `<g transform="translate(-6 8)">` +
    `<path d="M50 28C54 18 58 14 64 12" stroke-width="10"/><path d="M50 28C54 18 58 14 64 12" stroke="#3a9e47" stroke-width="4"/>` +
    `<path d="M50 30C34 26 18 34 18 54C18 74 28 88 38 88C42 88 46 84 50 84S58 88 62 88C72 88 82 74 82 54C82 34 66 26 50 30Z" fill="#e8403a"/>` +
    `<path d="M36 40C32 56 34 76 38 88M64 40C68 56 66 76 62 88" stroke="#c42a26" stroke-width="3"/>` +
    `<path d="M38 32Q50 22 62 32Q50 38 38 32Z" fill="#3a9e47"/>` +
    `<path d="M26 50C27 44 30 40 34 38" stroke="#ff9a8a" stroke-width="4"/></g>`,
  방울토마토:
    `<path d="M14 18Q50 6 86 16M34 14Q30 28 30 40M56 11Q58 22 56 32M72 13Q76 36 72 58M44 14Q42 40 42 62M22 16Q18 46 22 70" stroke="#3a9e47" stroke-width="3.5"/>` +
    [
      [30, 46, 12, '#e8403a'],
      [57, 40, 12, '#e8403a'],
      [72, 66, 13, '#e8403a'],
      [44, 70, 13, '#ff5c3a'],
      [22, 76, 11, '#ffb31a'],
    ]
      .map(
        ([x, y, r, c]) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>` +
          `<path d="M${(x as number) - 6} ${(y as number) - (r as number) + 2}L${x} ${(y as number) - (r as number) + 5}L${(x as number) + 6} ${(y as number) - (r as number) + 2}" stroke="#3a9e47" stroke-width="3"/>` +
          `<path d="M${(x as number) - (r as number) * 0.6} ${(y as number) - 1}q1-4 4-5" stroke="#fff" stroke-width="2.5" opacity=".6"/>`,
      )
      .join(''),
  표고버섯:
    `<path d="M42 50C42 68 38 82 36 90C44 94 56 94 64 90C62 82 58 68 58 50Z" fill="#f3e2c4"/>` +
    `<path d="M46 64l3 6M53 74l3 6" stroke="#d8c09a" stroke-width="2.5"/>` +
    `<path d="M10 50C10 26 28 14 50 14S90 26 90 50C90 57 84 60 76 57C60 53 40 53 24 57C16 60 10 57 10 50Z" fill="#8a4f2a"/>` +
    `<path d="M24 56C40 60 60 60 76 56" stroke="#f3e2c4" stroke-width="5"/>` +
    `<path d="M30 32L38 38L34 46M38 38L46 34M56 26L62 34L70 30M62 34L60 42M46 22L52 26M72 42L80 44M22 44L28 48M48 44L54 40" stroke="#f3e2c4" stroke-width="3.5"/>`,
  느타리버섯:
    [
      [50, 90, 28, 44, -28, 20],
      [50, 90, 70, 42, 26, 19],
      [50, 90, 50, 26, 2, 22],
      [50, 90, 36, 64, -12, 17],
      [50, 90, 64, 66, 14, 17],
    ]
      .map(([bx, by, x, y]) => tube(`M${bx} ${by}Q${(bx + x) / 2} ${by - 8} ${x} ${y + 4}`, '#f0ede4', 5))
      .join('') +
    [
      [28, 44, -28, 20],
      [70, 42, 26, 19],
      [50, 26, 2, 22],
      [36, 64, -12, 17],
      [64, 66, 14, 17],
    ]
      .map(
        ([x, y, a, r]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M${-r} 0A${r} ${r * 0.6} 0 0 1 ${r} 0Q0 ${r * 0.3} ${-r} 0Z" fill="#8f98ad"/>` +
          `<path d="M${-r} 0Q0 ${r * 0.3} ${r} 0Q0 ${r * 0.7} ${-r} 0Z" fill="#ebe6da"/>` +
          `<path d="M${-r * 0.5} ${r * 0.2}L0 ${r * 0.45}L${r * 0.5} ${r * 0.2}" stroke="#c8c0b0" stroke-width="2"/>` +
          `<path d="M${-r * 0.55} ${-r * 0.2}q${r * 0.2} ${-r * 0.25} ${r * 0.45} ${-r * 0.3}" stroke="#b8c0d4" stroke-width="2.5"/></g>`,
      )
      .join(''),
  팽이버섯:
    Array.from({ length: 13 }, (_, i) => {
      const bx = 42 + i * 1.3;
      const tx = 16 + i * 5.7;
      const ty = 12 + Math.abs(i - 6) * 2.2;
      return `<path d="M${f(bx)} 76Q${f((bx + tx) / 2)} 44 ${f(tx)} ${f(ty)}" stroke-width="5.5"/><path d="M${f(bx)} 76Q${f((bx + tx) / 2)} 44 ${f(tx)} ${f(ty)}" stroke="#fffdf4" stroke-width="2.5"/>`;
    }).join('') +
    Array.from({ length: 13 }, (_, i) => {
      const tx = 16 + i * 5.7;
      const ty = 12 + Math.abs(i - 6) * 2.2;
      return `<ellipse cx="${f(tx)}" cy="${f(ty - 1)}" rx="3.6" ry="2.8" fill="#fff6dc" stroke-width="2"/>`;
    }).join('') +
    `<path d="M36 70H64L61 90C55 94 45 94 39 90Z" fill="#f3e6c4"/>` +
    `<path d="M38.5 84C46 88 54 88 61.5 84L61 90C55 94 45 94 39 90Z" fill="#b08040"/>` +
    `<path d="M44 74V84M50 74V86M56 74V84" stroke="#dcc898" stroke-width="2.5"/>`,
  송이버섯:
    `<path d="M14 92L30 70M22 94L34 72M76 94L90 72M84 94L94 78" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M36 50C32 66 30 80 34 90C42 95 58 95 66 90C70 80 68 66 64 50Z" fill="#f5ecd8"/>` +
    `<path d="M38 64q4-3 8 0M52 70q4-3 8 0M40 80q4-3 8 0M56 82q4-3 8 0" stroke="#b08a60" stroke-width="2.5"/>` +
    `<path d="M26 54C26 30 38 16 50 16S74 30 74 54C64 60 36 60 26 54Z" fill="#8a5a3a"/>` +
    `<path d="M34 34q6-8 14-10" stroke="#b07a50" stroke-width="4"/>` +
    `<path d="M28 54C40 58 60 58 72 54" stroke="#f5ecd8" stroke-width="3"/>`,
  숙주:
    plate(80, 44, 12) +
    [
      'M16 74C30 60 52 56 70 64',
      'M20 70C36 52 58 50 80 60',
      'M26 76C44 64 64 64 84 72',
      'M22 66C34 46 54 40 70 48',
      'M30 62C44 42 66 42 82 54',
      'M18 78C36 70 56 72 76 78',
      'M40 58C50 38 70 36 84 44',
    ]
      .map((d) => tube(d, '#fffaf0', 3))
      .join('') +
    [
      [70, 64],
      [80, 60],
      [84, 72],
      [70, 48],
      [82, 54],
      [76, 78],
      [84, 44],
    ]
      .map(([x, y]) => `<ellipse cx="${x + 2}" cy="${y - 1}" rx="5" ry="4" fill="#f5ec80" stroke-width="2.5"/><path d="M${x + 1} ${y - 4}q5-1 6 3" stroke="#43b04a" stroke-width="3"/>`)
      .join(''),
  죽순:
    `<path d="M48 6C40 24 22 56 20 80C20 92 76 92 76 80C74 56 56 24 48 6Z" fill="#c9a06a"/>` +
    `<path d="M48 6C44 14 42 20 42 24C46 22 52 22 54 18C52 14 50 10 48 6Z" fill="#9fca4a"/>` +
    `<path d="M20 80C30 72 44 54 52 26M76 80C66 70 54 52 46 28M22 66C34 60 46 44 50 34M74 64C62 58 52 44 48 36" stroke="#8a5a3a" stroke-width="3"/>` +
    [
      [34, 72],
      [60, 70],
      [42, 52],
      [58, 50],
      [28, 82],
      [68, 82],
    ]
      .map(([x, y]) => dot(x, y, 2, '#6b3e26'))
      .join('') +
    `<path d="M20 80C20 92 76 92 76 80C66 86 30 86 20 80Z" fill="#fff4d8"/>`,
  더덕:
    `<path d="M50 30Q44 18 34 14" stroke="#3a9e47" stroke-width="3.5"/><path d="M50 30Q58 16 70 12" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<ellipse cx="30" cy="12" rx="8" ry="5" fill="#43b04a" transform="rotate(-20 30 12)"/><ellipse cx="74" cy="10" rx="8" ry="5" fill="#43b04a" transform="rotate(20 74 10)"/>` +
    `<ellipse cx="40" cy="22" rx="7" ry="4.5" fill="#5fc24a" transform="rotate(30 40 22)"/><ellipse cx="62" cy="20" rx="7" ry="4.5" fill="#5fc24a" transform="rotate(-30 62 20)"/>` +
    `<path d="M50 28C64 28 68 40 64 54C62 64 70 74 76 86C66 84 60 78 56 72C54 82 50 90 40 96C42 86 44 78 42 68C34 58 32 40 50 28Z" fill="#a89070"/>` +
    `<path d="M40 38q10 4 22 0M38 46q12 5 26 0M38 54q10 4 24 0M42 62q8 3 18 0M58 72q6 3 12 1M44 76q4 2 8 0M42 86q3 2 6 0" stroke="#6b5a44" stroke-width="2.5"/>` +
    `<path d="M36 50l-6 -2M66 44l6 -3M64 62l6 2M42 70l-6 3" stroke="#6b5a44" stroke-width="2"/>`,
  인삼:
    `<path d="M50 34V16" stroke-width="7"/><path d="M50 34V16" stroke="#3a9e47" stroke-width="3"/>` +
    [
      [30, 20],
      [70, 20],
    ]
      .map(([x, y]) =>
        [-60, -30, 0, 30, 60]
          .map((a) => `<ellipse cx="${x}" cy="${y - 8}" rx="3.8" ry="8" fill="#43b04a" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
          .join(''),
      )
      .join('') +
    `<path d="M50 20L32 20M50 20L68 20" stroke="#3a9e47" stroke-width="3"/>` +
    [
      [50, 10],
      [46, 14],
      [54, 14],
      [50, 16],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#e8403a" stroke-width="2"/>`)
      .join('') +
    `<path d="M30 92l-4 4M32 94l-1 4M70 90l4 4M68 92l1 5M40 58l-8 2M60 58l8 2" stroke="#b08a50" stroke-width="2"/>` +
    `<path d="M45 34C38 44 38 54 41 61C35 70 30 82 30 92C38 88 44 78 48 70C53 80 60 86 70 90C68 80 62 70 58 61C62 53 62 43 55 34Z" fill="#f0d9a8"/>` +
    `<rect x="45" y="28" width="10" height="9" rx="3" fill="#e0c088"/>` +
    `<path d="M42 44q8 3 16 0M41 52q9 3 18 0" stroke="#c9a06a" stroke-width="2.5"/>`,
  홍시:
    plate(82) +
    `<path d="M16 62C16 42 30 32 50 32S84 42 84 62C84 78 70 84 50 84S16 78 16 62Z" fill="#e3401c"/>` +
    `<ellipse cx="34" cy="52" rx="8" ry="5" fill="#fff" stroke="none" opacity=".5" transform="rotate(-30 34 52)"/>` +
    `<circle cx="28" cy="62" r="2.5" fill="#fff" stroke="none" opacity=".5"/>` +
    `<path d="M50 28Q57 36 76 36Q60 42 50 46Q40 42 24 36Q43 36 50 28Z" fill="#6b7a30"/>` +
    `<rect x="46" y="26" width="8" height="9" rx="3" fill="#5a3b24"/>` +
    tube('M72 92L90 74', '#dfe8f5', 4) +
    `<ellipse cx="68" cy="94" rx="8" ry="5" fill="#dfe8f5" transform="rotate(-45 68 94)"/>`,
  단감:
    `<path d="M10 54C10 36 24 28 44 28S78 36 78 54C78 74 64 82 44 82S10 74 10 54Z" fill="#ff9a1a"/>` +
    `<path d="M44 34V78M22 40C18 56 22 70 30 78M66 40C70 56 66 70 58 78" stroke="#ea7a10" stroke-width="3"/>` +
    `<path d="M20 52C21 46 24 42 30 40" stroke="#ffc97a" stroke-width="4"/>` +
    `<path d="M44 22Q52 30 70 32Q54 38 44 44Q34 38 18 32Q36 30 44 22Z" fill="#3a9e47"/>` +
    `<rect x="40" y="20" width="8" height="10" rx="3" fill="#6b3e26"/>` +
    `<path d="M60 92C60 76 72 64 92 62C94 80 82 92 60 92Z" fill="#ffc46a"/>` +
    `<path d="M92 62C94 80 82 92 60 92" stroke="#ff8a00" stroke-width="5"/><path d="M60 92C60 76 72 64 92 62C94 80 82 92 60 92Z"/>` +
    `<path d="M68 84L84 72" stroke="#fff0c8" stroke-width="2.5"/>`,
  풋사과:
    `<path d="M50 30C50 22 52 16 57 11" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M50 30C38 20 14 24 14 50C14 74 30 90 43 88C46 87 48 86 50 86S54 87 57 88C70 90 86 74 86 50C86 24 62 20 50 30Z" fill="#8fd13a"/>` +
    `<path d="M55 22C61 10 77 10 81 16C73 24 63 26 55 22Z" fill="#2f8a3e"/>` +
    `<path d="M26 44C27 38 31 34 36 33" stroke="#dcf5a8" stroke-width="4"/>` +
    `<path d="M66 70q6-4 8-12" stroke="#6cae28" stroke-width="3"/>`,
  청포도:
    `<path d="M52 20C60 8 78 6 84 12C76 22 62 24 52 20Z" fill="#43b04a"/>` +
    `<path d="M50 22V10" stroke="#6b3e26" stroke-width="4"/>` +
    bunch(50, 28, [5, 4, 4, 3, 2, 1], 7.8, '#b6dc4a', '#eaf8b0'),
  거봉:
    `<path d="M52 16C60 4 78 2 84 8C76 18 62 20 52 16Z" fill="#43b04a"/>` +
    `<path d="M50 18V6" stroke="#6b3e26" stroke-width="4"/>` +
    bunch(50, 30, [3, 3, 2, 1], 12, '#4a2a6a', '#9a7ac4'),
  천도복숭아:
    `<path d="M50 30C36 18 12 26 14 52C16 76 34 88 50 88S84 76 86 52C88 26 64 18 50 30Z" fill="#d8283a"/>` +
    `<path d="M62 70C66 62 76 58 84 60C82 74 72 84 62 86C58 80 58 76 62 70Z" fill="#ffc933" stroke="none"/>` +
    `<path d="M50 30C36 18 12 26 14 52C16 76 34 88 50 88S84 76 86 52C88 26 64 18 50 30Z"/>` +
    `<path d="M50 30C44 44 44 70 50 86" stroke="#a81c2a" stroke-width="3"/>` +
    `<ellipse cx="30" cy="46" rx="7" ry="10" fill="#fff" stroke="none" opacity=".55" transform="rotate(25 30 46)"/>` +
    `<path d="M50 30C52 20 56 16 60 14" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M54 22C58 10 72 6 80 10C74 20 64 24 54 22Z" fill="#43b04a"/>`,
  라즈베리:
    `<path d="M50 20C46 10 34 6 26 10C32 18 42 22 50 20Z" fill="#43b04a"/><path d="M50 20C56 10 70 8 76 12C70 20 58 22 50 20Z" fill="#3a9e47"/>` +
    drupe(50, 32, [5, 6, 6, 5, 4, 2], 6.2, '#e8305a', '#ffb0c4') +
    `<path d="M34 26L42 32L50 24L58 32L66 26Q50 36 34 26Z" fill="#5fc24a" stroke-width="2.5"/>`,
  블랙베리:
    `<path d="M50 20C46 10 34 6 26 10C32 18 42 22 50 20Z" fill="#43b04a"/><path d="M50 20C56 10 70 8 76 12C70 20 58 22 50 20Z" fill="#3a9e47"/>` +
    drupe(50, 32, [5, 6, 6, 5, 4, 2], 6.2, '#3a1f4f', '#b89ad8') +
    `<path d="M34 26L42 32L50 24L58 32L66 26Q50 36 34 26Z" fill="#5fc24a" stroke-width="2.5"/>`,
  한라봉:
    `<path d="M50 18C42 18 40 26 40 32C24 34 12 46 12 62C12 80 30 92 50 92S88 80 88 62C88 46 76 34 60 32C60 26 58 18 50 18Z" fill="#ff9f1a"/>` +
    `<path d="M40 34Q50 40 60 34" stroke="#e8862e" stroke-width="3"/>` +
    `<path d="M24 58C25 50 30 44 36 42" stroke="#ffc97a" stroke-width="4"/>` +
    [
      [34, 66],
      [48, 74],
      [62, 66],
      [72, 56],
      [56, 52],
      [42, 82],
      [62, 82],
      [74, 72],
      [50, 26],
    ]
      .map(([x, y]) => dot(x, y, 1.6, '#e8862e'))
      .join('') +
    `<path d="M50 18V12" stroke="#6b3e26" stroke-width="4"/><path d="M52 14C58 4 72 2 78 8C72 16 60 18 52 14Z" fill="#43b04a"/>`,
  망고스틴:
    `<circle cx="36" cy="52" r="27" fill="#5a2350"/>` +
    `<path d="M24 44C25 38 28 34 33 32" stroke="#8a4a80" stroke-width="4"/>` +
    [0, 90, 180, 270]
      .map((a) => `<ellipse cx="36" cy="18" rx="6" ry="9" fill="#5f8a3a" transform="rotate(${a + 45} 36 27)"/>`)
      .join('') +
    `<circle cx="36" cy="27" r="4" fill="#4a6e2a"/>` +
    `<circle cx="70" cy="70" r="22" fill="#8e2a5a"/><circle cx="70" cy="70" r="14" fill="#fffdf6"/>` +
    `<path d="M70 56V84M58 63L82 77M58 77L82 63" stroke="#e8e0d0" stroke-width="2.5"/><circle cx="70" cy="70" r="14"/>`,
  람부탄:
    Array.from({ length: 22 }, (_, i) => {
      const t = (i * 2 * Math.PI) / 22;
      const cx = 40;
      const cy = 50;
      const x1 = cx + 26 * Math.cos(t);
      const y1 = cy + 26 * Math.sin(t);
      const x2 = cx + 36 * Math.cos(t + 0.18);
      const y2 = cy + 36 * Math.sin(t + 0.18);
      return `<path d="M${f(x1)} ${f(y1)}Q${f(cx + 34 * Math.cos(t))} ${f(cy + 34 * Math.sin(t))} ${f(x2)} ${f(y2)}" stroke="#c42a26" stroke-width="3"/>` + dot(x2, y2, 1.8, '#6ab04c');
    }).join('') +
    `<circle cx="40" cy="50" r="27" fill="#e8403a"/>` +
    [
      [30, 40],
      [44, 36],
      [52, 48],
      [36, 56],
      [48, 62],
      [28, 64],
      [56, 34],
    ]
      .map(([x, y]) => `<path d="M${x} ${y}q3-4 7-3" stroke="#ff9a6a" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M58 84C58 72 90 72 90 84C90 92 58 92 58 84Z" fill="#e8403a"/>` +
    `<ellipse cx="74" cy="72" rx="12" ry="14" fill="#f8f4ec"/><path d="M68 66q2-4 6-4" stroke="#fff" stroke-width="3"/>` +
    `<path d="M58 84C58 92 90 92 90 84C84 80 64 80 58 84Z" fill="#e8403a"/>`,
  탕후루:
    `<path d="M50 96V8" stroke-width="7"/><path d="M50 96V8" stroke="#e0b070" stroke-width="3"/>` +
    berry(50, 24, '#e8305a') +
    `<circle cx="50" cy="48" r="11" fill="#9ad44a"/><path d="M44 44q2-4 6-5" stroke="#eaf8b0" stroke-width="2.5"/>` +
    berry(50, 70, '#e8305a') +
    `<path d="M40 18Q38 26 42 32M40 64Q38 72 42 78" stroke="#fff" stroke-width="3" opacity=".7"/>` +
    sparkle(70, 22, 6) +
    sparkle(30, 56, 5) +
    sparkle(68, 72, 5),
  계란말이:
    `<rect x="8" y="64" width="84" height="22" rx="8" fill="#fff"/><path d="M16 80H84" stroke="#dfe8f5" stroke-width="2.5"/>` +
    [
      [22, 50],
      [41, 48],
      [60, 50],
      [79, 48],
    ]
      .map(
        ([cx, cy]) =>
          `<rect x="${cx - 10}" y="${cy - 16}" width="20" height="32" rx="8" fill="#ffd23f"/>` +
          `<path d="M${cx} ${cy}a2 2 0 0 1 4 0a4 4 0 0 1 -8 0a6 6 0 0 1 12 0a7 8 0 0 1 -14 0" stroke="#e0a800" stroke-width="2.5"/>` +
          dot(cx - 5, cy - 11, 1.8, '#43b04a') +
          dot(cx + 5, cy + 11, 1.8, '#ff6a2a') +
          dot(cx + 4, cy - 10, 1.6, '#e8553d'),
      )
      .join(''),
  김말이:
    plate(78, 44, 12) +
    [
      [34, 44, -24],
      [60, 56, -24],
      [36, 70, -24],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<rect x="-24" y="-9" width="46" height="18" rx="9" fill="#e0a040"/>` +
          `<path d="M-14 -4l3 2M-4 3l3 2M6 -4l3 2" stroke="#b87a28" stroke-width="2.5"/>` +
          `<ellipse cx="21" cy="0" rx="6" ry="9" fill="#2a3530"/><ellipse cx="21" cy="0" rx="3.2" ry="5.5" fill="#d8c8a8" stroke-width="2"/></g>`,
      )
      .join(''),
  약밥:
    plate(80, 44, 12) +
    `<path d="M20 40L32 30H82L70 40Z" fill="#a8622e"/><path d="M70 40L82 30V64L70 76Z" fill="#6b3e1c"/>` +
    `<rect x="18" y="40" width="52" height="36" rx="3" fill="#8a4a24"/>` +
    [
      [26, 50],
      [40, 62],
      [56, 48],
      [30, 68],
      [62, 66],
      [48, 54],
    ]
      .map(([x, y]) => `<path d="M${x} ${y}h4" stroke="#b8723e" stroke-width="2.5"/>`)
      .join('') +
    `<ellipse cx="34" cy="52" rx="5" ry="4" fill="#b0302a"/><ellipse cx="58" cy="60" rx="5" ry="4" fill="#b0302a"/>` +
    `<path d="M44 66C44 60 54 60 54 66Z" fill="#f2c14e"/><path d="M22 60C22 55 30 55 30 60Z" fill="#f2c14e"/>` +
    `<ellipse cx="46" cy="35" rx="4" ry="3" fill="#b0302a" stroke-width="2.5"/><ellipse cx="66" cy="34" rx="3.5" ry="2.5" fill="#f2c14e" stroke-width="2.5"/>` +
    [
      [48, 46],
      [62, 50],
      [28, 72],
      [58, 36],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="2.8" fill="#fff2d0" stroke-width="1.8"/>`)
      .join(''),
  팥빙수:
    tube('M66 44L84 12', '#ff9f1a', 4) +
    `<path d="M40 88L38 94H62L60 88" fill="#bfe6ff"/>` +
    `<path d="M12 60C12 78 28 90 50 90S88 78 88 60Z" fill="#bfe6ff"/>` +
    blob('#fff', [
      [50, 52, 22],
      [30, 58, 12],
      [70, 58, 12],
      [40, 42, 12],
      [60, 42, 12],
    ]) +
    blob('#8a2e2e', [
      [50, 32, 13],
      [38, 40, 10],
      [62, 40, 10],
      [50, 44, 10],
      [50, 22, 8],
    ]) +
    [
      [44, 30],
      [54, 26],
      [58, 38],
      [42, 42],
      [50, 40],
      [48, 18],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.6" fill="#c25050" stroke="none"/>`)
      .join('') +
    `<rect x="22" y="50" width="9" height="9" rx="2" fill="#f2d27a" stroke-width="2.5"/><rect x="70" y="52" width="9" height="9" rx="2" fill="#f2d27a" stroke-width="2.5"/><rect x="31" y="60" width="9" height="9" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M12 60H88"/>`,
  콜라:
    tube('M56 36L64 8H78', '#e8553d', 3.5) +
    `<path d="M24 22L32 90H68L76 22Z" fill="#f4fbff"/>` +
    `<path d="M26.6 36L33.4 86H66.6L73.4 36Z" fill="#5a2a1a" stroke="none"/>` +
    `<path d="M26.6 36H73.4" stroke="#c89a70" stroke-width="5"/>` +
    `<rect x="36" y="40" width="13" height="13" rx="2" fill="#dff4ff" stroke-width="2.5" transform="rotate(-15 42 46)"/><rect x="52" y="44" width="13" height="13" rx="2" fill="#dff4ff" stroke-width="2.5" transform="rotate(12 58 50)"/>` +
    [
      [40, 66],
      [56, 72],
      [48, 80],
      [60, 62],
      [38, 78],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" stroke="#e8c8b0" stroke-width="1.8"/>`)
      .join('') +
    `<path d="M24 22L32 90H68L76 22Z"/>` +
    `<circle cx="34" cy="14" r="2.5" stroke-width="2"/><circle cx="44" cy="8" r="2" stroke-width="2"/><circle cx="84" cy="30" r="2.5" stroke-width="2"/>`,
  사이다:
    `<path d="M72 10H82V22C82 26 90 30 90 40V90H64V40C64 30 72 26 72 22Z" fill="#8fd67a"/>` +
    `<path d="M70 44V80" stroke="#d8f5c8" stroke-width="4"/><rect x="71" y="6" width="12" height="6" rx="2" fill="#43b04a"/>` +
    `<path d="M14 28L20 90H54L60 28Z" fill="#e6f7ff"/>` +
    [
      [26, 78, 2.5],
      [34, 66, 3],
      [44, 76, 2.5],
      [48, 56, 3],
      [30, 48, 2.5],
      [40, 42, 3],
      [50, 40, 2],
      [24, 60, 2],
      [40, 86, 2],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#7ec8f0" stroke-width="2"/>`)
      .join('') +
    `<path d="M16.6 36H57.4" stroke="#7ec8f0" stroke-width="3"/>` +
    `<circle cx="30" cy="18" r="3" stroke="#7ec8f0" stroke-width="2.5"/><circle cx="42" cy="12" r="2.5" stroke="#7ec8f0" stroke-width="2.5"/><circle cx="50" cy="22" r="2" stroke="#7ec8f0" stroke-width="2.5"/>`,
  배:
    `<path d="M48 24C48 18 50 12 56 8" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M54 16C60 6 74 4 80 10C74 18 62 20 54 16Z" fill="#43b04a"/>` +
    `<path d="M48 26C28 26 12 40 12 58C12 76 28 88 48 88S84 76 84 58C84 40 68 26 48 26Z" fill="#d9a54a"/>` +
    `<path d="M22 50C24 42 30 36 38 34" stroke="#f2d08a" stroke-width="4"/>` +
    [
      [30, 60],
      [42, 68],
      [56, 60],
      [66, 50],
      [50, 44],
      [34, 76],
      [60, 76],
      [72, 64],
      [40, 52],
    ]
      .map(([x, y]) => dot(x, y, 1.7, '#f5dca0'))
      .join('') +
    `<path d="M64 94C64 80 76 70 94 70C95 84 84 94 64 94Z" fill="#fffbe8"/>` +
    `<path d="M94 70C95 84 84 94 64 94" stroke="#d9a54a" stroke-width="5"/><path d="M64 94C64 80 76 70 94 70C95 84 84 94 64 94Z"/>`,
  죽:
    `<path d="M40 30c-5-5 5-9 0-15M54 28c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>` +
    tube('M64 50L84 20', '#dfe8f5', 4) +
    `<path d="M38 84L36 92H64L62 84" fill="#8a5a3a"/>` +
    `<ellipse cx="50" cy="48" rx="38" ry="11" fill="#fbf6e8"/>` +
    `<path d="M24 48q13-6 26 0t26 0M34 43q8-3 16 0" stroke="#eadcb8" stroke-width="3"/>` +
    `<ellipse cx="42" cy="51" rx="3" ry="2" fill="#f2d8a0" stroke-width="2"/><ellipse cx="58" cy="44" rx="3" ry="2" fill="#f2d8a0" stroke-width="2"/><ellipse cx="30" cy="45" rx="3" ry="2" fill="#f2d8a0" stroke-width="2"/>` +
    `<path d="M12 48C12 74 30 88 50 88S88 74 88 48C88 54 71 59 50 59S12 54 12 48Z" fill="#8a5a3a"/>` +
    `<path d="M19 68Q50 78 81 68" stroke="#c9905a" stroke-width="4"/>`,
};
