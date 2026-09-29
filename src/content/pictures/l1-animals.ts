// 동물 그림 묶음 1 (소·말·양 … 가재). 그림 규칙은 docs/picture-style.md.
import { INK, HL, dot, blob, cheeks, tube } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5.5, p = 3) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` + dot(x, y + 0.5, p);

/** 가운데 (cx, cy)에서 뾰족뾰족 도는 가시 덩어리 (고슴도치) */
function spikes(cx: number, cy: number, rin: number, rout: number, a0: number, a1: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= n * 2; i++) {
    const [x, y] = pt(cx, cy, i % 2 ? rout : rin, a0 + ((a1 - a0) * i) / (n * 2));
    pts.push(`${x} ${y}`);
  }
  return `M${pts.join('L')}L${cx} ${cy}Z`;
}

/** 다섯 팔 별 (불가사리) */
function star(cx: number, cy: number, ro: number, ri: number): string {
  let d = '';
  for (let k = 0; k < 5; k++) {
    const [ox, oy] = pt(cx, cy, ro, -90 + 72 * k);
    const [ix, iy] = pt(cx, cy, ri, -54 + 72 * k);
    const [px, py] = pt(cx, cy, ri, -126 + 72 * k);
    d += `${k ? 'L' : 'M'}${px} ${py}Q${r1((px + ox) / 2 + (cx - (px + ox) / 2) * 0.08)} ${r1((py + oy) / 2 + (cy - (py + oy) / 2) * 0.08)} ${ox} ${oy}`;
    d += `Q${r1((ix + ox) / 2 + (cx - (ix + ox) / 2) * 0.08)} ${r1((iy + oy) / 2 + (cy - (iy + oy) / 2) * 0.08)} ${ix} ${iy}`;
  }
  return d + 'Z';
}

/** 부채꼴 조개 (가장자리 물결) */
function scallop(cx: number, cy: number, r: number, half: number, n: number): { d: string; ribs: string } {
  const P = Array.from({ length: n + 1 }, (_, k) => pt(cx, cy, r, -90 - half + (2 * half * k) / n));
  const chord = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]);
  let d = `M${cx} ${cy}L${P[0][0]} ${P[0][1]}`;
  for (let k = 1; k <= n; k++) d += `A${r1(chord * 0.55)} ${r1(chord * 0.55)} 0 0 1 ${P[k][0]} ${P[k][1]}`;
  d += 'Z';
  let ribs = '';
  for (let k = 1; k < n; k++) {
    const [ax, ay] = pt(cx, cy, r * 0.22, -90 - half + (2 * half * k) / n);
    const [bx, by] = pt(cx, cy, r * 0.9, -90 - half + (2 * half * k) / n);
    ribs += `M${ax} ${ay}L${bx} ${by}`;
  }
  return { d, ribs };
}

/** 거미줄 */
function web(cx: number, cy: number, rs: number[]): string {
  let d = '';
  for (let k = 0; k < 8; k++) {
    const [x, y] = pt(cx, cy, rs[rs.length - 1], k * 45 + 22.5);
    d += `M${cx} ${cy}L${x} ${y}`;
  }
  for (const r of rs) {
    const ps = Array.from({ length: 8 }, (_, k) => pt(cx, cy, r, k * 45 + 22.5).join(' '));
    d += `M${ps.join('L')}Z`;
  }
  return `<path d="${d}" stroke="#9aa6c4" stroke-width="2"/>`;
}

const SC = scallop(50, 82, 62, 40, 6);
const OT = scallop(60, 52, 17, 42, 4);

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '') =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

export const PICS: Record<string, string> = {
  소:
    `<g transform="translate(-2 2)">` +
    `<path d="M18 44C12 48 11 58 12 66"/><path d="M8 64L12 74L16 64Z" fill="${INK}"/>` +
    legs([22, 33, 56, 66], 58, 9, 28, '#fff', '#3d3530') +
    `<path d="M38 66C38 77 52 77 52 66Z" fill="#ffb3c4"/>` +
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
    `</g>`,

  말:
    `<path d="M20 46C8 48 6 64 10 76C14 66 16 58 22 54Z" fill="#5a3b24"/>` +
    legs([22, 31, 52, 61], 58, 8, 30, '#b0703a', '#3d3530') +
    `<ellipse cx="42" cy="52" rx="27" ry="15" fill="#b0703a"/>` +
    `<path d="M65 18L65 7L73 15Z" fill="#b0703a"/>` +
    `<path d="M54 50L61 24C62 16 71 12 77 16L91 30C94 34 91 40 86 39L76 36L71 54Z" fill="#b0703a"/>` +
    `<path d="M62 18C55 26 51 36 49 46L57 45C59 36 61 29 67 22Z" fill="#5a3b24"/>` +
    dot(74, 24, 3) +
    dot(88, 33, 1.8),

  양:
    legs([30, 40, 58, 68], 62, 7, 24, '#4a4556') +
    blob('#fff', [
      [30, 50, 13],
      [45, 43, 14],
      [60, 45, 13],
      [67, 58, 12],
      [52, 62, 13],
      [36, 63, 13],
      [24, 60, 10],
    ]) +
    `<ellipse cx="66" cy="40" rx="8" ry="4" fill="#4a4556" transform="rotate(20 66 40)"/><ellipse cx="88" cy="40" rx="8" ry="4" fill="#4a4556" transform="rotate(-20 88 40)"/>` +
    `<ellipse cx="77" cy="44" rx="11" ry="13" fill="#4a4556"/>` +
    blob('#fff', [
      [72, 32, 6],
      [79, 30, 6],
      [85, 33, 5],
    ]) +
    dot(72, 44, 3, '#fff') +
    dot(82, 44, 3, '#fff') +
    dot(72, 44.5, 1.6) +
    dot(82, 44.5, 1.6) +
    `<path d="M74 51q3 2 6 0" stroke="#fff" stroke-width="2"/>`,

  돼지:
    `<path d="M24 38L20 12L44 26Z" fill="#ff9aa8"/><path d="M76 38L80 12L56 26Z" fill="#ff9aa8"/>` +
    `<circle cx="50" cy="55" r="32" fill="#ffb8c6"/>` +
    `<ellipse cx="50" cy="64" rx="16" ry="11" fill="#ff8fa8"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="44" cy="64" rx="3" ry="4.5"/><ellipse cx="56" cy="64" rx="3" ry="4.5"/></g>` +
    dot(37, 46) +
    dot(63, 46) +
    `<path d="M44 80q6 4 12 0"/>` +
    cheeks(60, 26),

  쥐:
    tube('M72 72C90 76 96 60 88 50C82 44 74 50 80 56', '#ff9aa8', 3) +
    `<ellipse cx="30" cy="77" rx="6" ry="3.5" fill="#ff9aa8"/><ellipse cx="58" cy="77" rx="6" ry="3.5" fill="#ff9aa8"/>` +
    `<circle cx="38" cy="32" r="12" fill="#a9b1c4"/><circle cx="38" cy="32" r="6.5" fill="#ffb3c4" stroke="none"/>` +
    `<path d="M10 62C14 46 34 38 52 42C70 46 80 60 75 71C71 78 30 78 20 75C14 73 9 68 10 62Z" fill="#a9b1c4"/>` +
    dot(26, 54, 3.3) +
    `<circle cx="11" cy="61" r="3.8" fill="#ff7a9c"/>` +
    `<path d="M18 64L6 70M18 60L6 56" stroke-width="2"/>` +
    `<path d="M20 67q4 3 8 1" stroke-width="2.5"/>`,

  뱀:
    tube('M14 84C34 92 70 90 74 76C78 60 30 64 28 48C26 34 44 28 56 30', '#5fc24a', 13) +
    `<g fill="#3a9e47" stroke="none"><circle cx="30" cy="87" r="3"/><circle cx="52" cy="87" r="3"/><circle cx="70" cy="80" r="3"/><circle cx="54" cy="64" r="3"/><circle cx="32" cy="54" r="3"/></g>` +
    `<path d="M80 32L88 34M88 34L93 30M88 34L93 38" stroke="#e8553d" stroke-width="2.5"/>` +
    `<ellipse cx="66" cy="30" rx="15" ry="11" fill="#5fc24a"/>` +
    eye(61, 26, 5, 2.8) +
    eye(73, 26, 5, 2.8) +
    `<path d="M62 35q6 4 12 0" stroke-width="2.5"/>`,

  새:
    `<path d="M43 70L40 86L50 80L60 86L57 70Z" fill="#2f74c0"/>` +
    `<path d="M34 50C24 36 12 28 5 30C5 42 14 56 32 64Z" fill="#2f74c0"/><path d="M66 50C76 36 88 28 95 30C95 42 86 56 68 64Z" fill="#2f74c0"/>` +
    `<path d="M14 38L28 52M10 46L26 56M86 38L72 52M90 46L74 56" stroke="#7ec8f0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="54" r="21" fill="#3b8fe0"/>` +
    `<ellipse cx="50" cy="64" rx="12" ry="9" fill="#dff3ff" stroke="none"/>` +
    dot(43, 48) +
    dot(57, 48) +
    `<path d="M45 54L55 54L50 60Z" fill="#ff9f1a" stroke-width="2.5"/>`,

  벌:
    `<ellipse cx="48" cy="30" rx="9" ry="15" fill="#dff3ff" transform="rotate(-25 48 30)"/><ellipse cx="64" cy="30" rx="9" ry="15" fill="#dff3ff" transform="rotate(25 64 30)"/>` +
    `<path d="M78 56L91 60L78 64Z" fill="${INK}"/>` +
    `<ellipse cx="56" cy="60" rx="24" ry="18" fill="#ffd23f"/>` +
    `<path d="M50 42.6Q53.5 42 57 42V78Q53.5 78 50 77.4ZM64 43Q67.5 44.5 71 46V74Q67.5 75.5 64 77Z" fill="${INK}" stroke="none"/>` +
    `<ellipse cx="56" cy="60" rx="24" ry="18"/>` +
    `<path d="M26 44C24 36 20 32 15 31M34 43C36 35 39 31 44 29"/>` +
    dot(15, 31, 3) +
    dot(44, 29, 3) +
    `<circle cx="30" cy="57" r="15" fill="#ffd23f"/>` +
    dot(25, 54) +
    dot(36, 54) +
    `<path d="M26 62q4 4 9 0" stroke-width="2.5"/>` +
    cheeks(61, 10, 30),

  게:
    [
      'M30 60L14 60L8 68',
      'M30 67L16 74L12 84',
      'M35 73L26 82L26 90',
      'M70 60L86 60L92 68',
      'M70 67L84 74L88 84',
      'M65 73L74 82L74 90',
    ]
      .map((d) => tube(d, '#e8553d', 3))
      .join('') +
    tube('M32 54L20 38', '#e8553d', 5) +
    tube('M68 54L80 38', '#e8553d', 5) +
    `<path d="M20 42C8 42 5 26 11 17L17 27L24 19C29 27 29 40 20 42Z" fill="#e8553d"/>` +
    `<path d="M80 42C92 42 95 26 89 17L83 27L76 19C71 27 71 40 80 42Z" fill="#e8553d"/>` +
    `<path d="M42 50V36M58 50V36"/>` +
    eye(42, 34, 6, 3) +
    eye(58, 34, 6, 3) +
    `<ellipse cx="50" cy="62" rx="26" ry="17" fill="#e8553d"/>` +
    `<path d="M43 64q7 5 14 0"/>` +
    cheeks(60, 14),

  문어:
    [0, 7, 1, 6, 2, 5, 3, 4]
      .map((i) => {
        const sx = r1(30 + (i * 40) / 7);
        const ex = r1(10 + (i * 80) / 7);
        const ey = r1(84 - Math.abs(i - 3.5) * 4);
        const s = i < 4 ? -1 : 1;
        return tube(`M${sx} 56C${sx} 70 ${ex - s * 6} ${ey + 8} ${ex} ${ey}q${s * 3} -4 ${s * -1} -8`, '#ff7a9c', 6);
      })
      .join('') +
    `<path d="M22 56C18 28 32 10 50 10S82 28 78 56C76 66 24 66 22 56Z" fill="#ff7a9c"/>` +
    `<g fill="#ffb3c4" stroke="none"><circle cx="34" cy="24" r="3.5"/><circle cx="64" cy="20" r="3"/><circle cx="70" cy="32" r="2.5"/></g>` +
    dot(40, 40, 4) +
    dot(60, 40, 4) +
    `<path d="M44 50q6 5 12 0"/>` +
    cheeks(48, 20),

  상어:
    `<path d="M20 50L6 30C10 42 10 48 12 52C10 58 8 64 6 72Z" fill="#8a96b0"/>` +
    `<path d="M42 38L52 12C58 20 62 28 64 36Z" fill="#8a96b0"/>` +
    `<path d="M14 52C26 38 52 32 74 36C86 38 94 46 94 52C94 58 84 64 68 66C48 68 28 64 14 52Z" fill="#8a96b0"/>` +
    `<path d="M26 56C46 56 76 56 93 54C88 62 76 66 64 66C48 67 34 62 26 56Z" fill="#fff" stroke="none"/>` +
    `<path d="M14 52C26 38 52 32 74 36C86 38 94 46 94 52C94 58 84 64 68 66C48 68 28 64 14 52Z"/>` +
    `<path d="M50 62L42 80L62 64Z" fill="#8a96b0"/>` +
    `<path d="M64 43q-2 5 0 10M70 43q-2 5 0 10" stroke-width="2.5"/>` +
    dot(80, 45, 3.3) +
    `<path d="M80 56q6 3 11 -2" stroke-width="3"/>` +
    `<circle cx="86" cy="28" r="3.5" fill="#dff3ff" stroke-width="2.5"/><circle cx="80" cy="18" r="2.5" fill="#dff3ff" stroke-width="2"/>`,

  펭귄:
    `<ellipse cx="40" cy="88" rx="9" ry="4" fill="#ff9f1a"/><ellipse cx="60" cy="88" rx="9" ry="4" fill="#ff9f1a"/>` +
    `<path d="M27 46C15 56 13 68 18 74C23 68 27 62 30 56Z" fill="#2a2f45"/><path d="M73 46C85 56 87 68 82 74C77 68 73 62 70 56Z" fill="#2a2f45"/>` +
    `<ellipse cx="50" cy="54" rx="25" ry="34" fill="#2a2f45"/>` +
    `<path d="M50 30C39 24 31 32 33 42C29 54 32 76 50 84C68 76 71 54 67 42C69 32 61 24 50 30Z" fill="#fff" stroke="none"/>` +
    dot(42, 40) +
    dot(58, 40) +
    `<path d="M44 46L56 46L50 54Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    cheeks(50, 14),

  부엉이:
    tube('M6 84H94', '#8b5a2b', 7) +
    `<ellipse cx="86" cy="76" rx="8" ry="4" fill="#43b04a" transform="rotate(-30 86 76)"/>` +
    `<path d="M28 34L23 11L42 25Z" fill="#9a5b2e"/><path d="M72 34L77 11L58 25Z" fill="#9a5b2e"/>` +
    `<ellipse cx="50" cy="54" rx="26" ry="30" fill="#9a5b2e"/>` +
    `<ellipse cx="50" cy="67" rx="15" ry="15" fill="#e8c49a" stroke="none"/>` +
    `<path d="M43 62l3 3l3-3M51 62l3 3l3-3M47 71l3 3l3-3" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M24 50C18 62 20 76 30 80C28 70 28 60 31 52Z" fill="#6b3e26"/><path d="M76 50C82 62 80 76 70 80C72 70 72 60 69 52Z" fill="#6b3e26"/>` +
    `<circle cx="39" cy="40" r="10" fill="#fff"/><circle cx="61" cy="40" r="10" fill="#fff"/>` +
    `<circle cx="39" cy="40" r="6" fill="${HL}" stroke="none"/><circle cx="61" cy="40" r="6" fill="${HL}" stroke="none"/>` +
    dot(39, 40, 3.5) +
    dot(61, 40, 3.5) +
    `<path d="M46 48L54 48L50 56Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<ellipse cx="42" cy="83" rx="5" ry="3" fill="#ff9f1a" stroke-width="2.5"/><ellipse cx="58" cy="83" rx="5" ry="3" fill="#ff9f1a" stroke-width="2.5"/>`,

  늑대:
    `<circle cx="82" cy="16" r="11" fill="#ffd23f"/><circle cx="79" cy="13" r="3" fill="#ffe98a" stroke="none"/><circle cx="86" cy="20" r="2.2" fill="#ffe98a" stroke="none"/>` +
    `<path d="M30 84C14 86 6 74 10 62C16 70 22 74 32 74Z" fill="#8a96b0"/>` +
    `<path d="M26 90C22 72 26 56 38 48L56 46C62 60 64 76 62 90Z" fill="#8a96b0"/>` +
    `<path d="M50 52C58 60 60 72 58 84C54 74 50 64 46 58Z" fill="#dfe8f5" stroke="none"/>` +
    `<path d="M52 72V90M26 90H64" stroke-width="3"/>` +
    `<path d="M36 32L30 14L46 26Z" fill="#8a96b0"/>` +
    `<circle cx="45" cy="38" r="14" fill="#8a96b0"/>` +
    `<path d="M47 28L59 17C63 14 67 18 65 22L56 38Z" fill="#8a96b0"/>` +
    dot(63, 18, 3) +
    `<path d="M38 36q3-3 6 0" stroke-width="2.5"/>` +
    `<path d="M57 32C60 30 62 28 63 25" stroke-width="2.5"/>` +
    `<path d="M68 26q3 3 7 2M66 32q4 3 9 1" stroke="#9aa6c4" stroke-width="2.5"/>`,

  판다:
    tube('M78 92L88 44', '#5fc24a', 6) +
    `<path d="M88 44q8 -4 8 -12q-8 2 -8 12ZM86 54q-8 -2 -12 -8q8 -2 12 8Z" fill="#5fc24a" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="80" rx="27" ry="15" fill="#fff"/>` +
    `<ellipse cx="26" cy="76" rx="9" ry="12" fill="#2a2f45"/><ellipse cx="76" cy="74" rx="9" ry="12" fill="#2a2f45"/>` +
    `<circle cx="26" cy="20" r="10" fill="#2a2f45"/><circle cx="74" cy="20" r="10" fill="#2a2f45"/>` +
    `<circle cx="50" cy="44" r="28" fill="#fff"/>` +
    `<g fill="#2a2f45" stroke="none"><ellipse cx="38" cy="44" rx="7" ry="10" transform="rotate(30 38 44)"/><ellipse cx="62" cy="44" rx="7" ry="10" transform="rotate(-30 62 44)"/></g>` +
    dot(39, 42, 2.8, '#fff') +
    dot(61, 42, 2.8, '#fff') +
    `<ellipse cx="50" cy="56" rx="5" ry="3.5" fill="${INK}"/><path d="M50 59v3M45 63q5 4 10 0" stroke-width="2.5"/>`,

  원숭이:
    `<g transform="translate(-6 -4)">` +
    `<circle cx="22" cy="42" r="8" fill="#9a5b2e"/><circle cx="78" cy="42" r="8" fill="#9a5b2e"/>` +
    dot(22, 42, 4, '#f2d2a0') +
    dot(78, 42, 4, '#f2d2a0') +
    `<ellipse cx="50" cy="82" rx="20" ry="13" fill="#9a5b2e"/>` +
    `<circle cx="50" cy="44" r="27" fill="#9a5b2e"/>` +
    `<path d="M50 34C44 24 28 26 30 44C30 62 39 69 50 69C61 69 70 62 70 44C72 26 56 24 50 34Z" fill="#f2d2a0"/>` +
    dot(42, 44) +
    dot(58, 44) +
    dot(47, 53, 1.6) +
    dot(53, 53, 1.6) +
    `<path d="M42 59q8 7 16 0"/>` +
    `<path d="M46 17C47 11 53 11 54 17" stroke-width="3"/>` +
    `</g>` +
    `<path d="M68 56L69 49H74L74 56" fill="#8b5a2b"/>` +
    `<path d="M67 58C62 76 72 92 90 90C95 89 95 84 90 84C78 83 73 72 75 58C75 53 67 53 67 58Z" fill="#ffd23f"/>` +
    `<path d="M71 62C70 74 76 82 86 86" stroke="#e0a800" stroke-width="2.5"/>` +
    `<circle cx="68" cy="66" r="6" fill="#9a5b2e"/>`,

  코알라:
    `<rect x="62" y="6" width="18" height="88" rx="4" fill="#9a5b2e"/>` +
    `<path d="M68 14v10M74 40v12M68 70v10" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<ellipse cx="44" cy="66" rx="18" ry="22" fill="#9aa3b8"/>` +
    `<ellipse cx="44" cy="70" rx="10" ry="14" fill="#dfe3ec" stroke="none"/>` +
    `<circle cx="24" cy="24" r="12" fill="#9aa3b8"/><circle cx="60" cy="22" r="12" fill="#9aa3b8"/>` +
    dot(24, 24, 6.5, '#eef1f7') +
    dot(60, 22, 6.5, '#eef1f7') +
    `<circle cx="42" cy="38" r="19" fill="#9aa3b8"/>` +
    `<ellipse cx="42" cy="44" rx="6.5" ry="8" fill="#3d3a45"/>` +
    dot(33, 35, 3) +
    dot(51, 35, 3) +
    tube('M52 54L72 56', '#9aa3b8', 8) +
    tube('M54 76L72 78', '#9aa3b8', 8) +
    `<circle cx="73" cy="56" r="5.5" fill="#9aa3b8"/><circle cx="73" cy="78" r="5.5" fill="#9aa3b8"/>`,

  낙타:
    `<path d="M16 54C10 58 10 64 12 68"/>` +
    legs([24, 33, 56, 64], 60, 7, 28, '#d9a55a') +
    `<path d="M16 62C14 50 20 42 27 44C29 28 41 28 43 42C47 28 59 30 60 44C68 44 72 50 72 58C72 64 66 66 60 66H24C18 66 16 64 16 62Z" fill="#d9a55a"/>` +
    `<path d="M64 52C72 50 74 40 74 30L86 28L84 38C82 50 78 60 68 64Z" fill="#d9a55a"/>` +
    `<path d="M74 22L76 16L80 22Z" fill="#d9a55a"/>` +
    `<ellipse cx="84" cy="28" rx="11" ry="7.5" fill="#d9a55a"/>` +
    dot(82, 25, 2.8) +
    dot(93, 27, 1.6) +
    `<path d="M86 32q4 2 7 0" stroke-width="2.5"/>`,

  거미:
    web(50, 46, [14, 27, 40]) +
    `<path d="M50 6V44" stroke-width="2.5"/>` +
    `<path d="M37 54L24 46L20 54M35 60L22 58L16 66M36 66L26 72L22 80M40 72L34 80L32 88M63 54L76 46L80 54M65 60L78 58L84 66M64 66L74 72L78 80M60 72L66 80L68 88" stroke-width="4"/>` +
    `<circle cx="50" cy="60" r="16" fill="#5a4a78"/>` +
    eye(44, 57, 5, 2.6) +
    eye(56, 57, 5, 2.6) +
    `<path d="M45 66q5 4 10 0" stroke="#fff" stroke-width="2.5"/>`,

  모기:
    `<path d="M28 44L8 60" stroke-width="3"/>` +
    `<path d="M44 50L30 72L24 90M48 52L46 74L40 92M52 50L62 72L70 90" stroke-width="3"/>` +
    `<ellipse cx="58" cy="28" rx="18" ry="7" fill="#dff3ff" transform="rotate(-25 58 28)"/><ellipse cx="66" cy="34" rx="15" ry="6" fill="#dff3ff" transform="rotate(-5 66 34)"/>` +
    `<g transform="rotate(25 70 52)"><ellipse cx="70" cy="52" rx="20" ry="7" fill="#6b6f80"/><path d="M62 46v12M70 45v14M78 46v12" stroke="#fff" stroke-width="2.5"/><ellipse cx="70" cy="52" rx="20" ry="7"/></g>` +
    `<ellipse cx="48" cy="44" rx="9" ry="8" fill="#6b6f80"/>` +
    `<path d="M32 34L24 22M36 33L34 20" stroke-width="2.5"/>` +
    `<circle cx="33" cy="40" r="8" fill="#6b6f80"/>` +
    eye(32, 38, 3.5, 2),

  파리:
    `<path d="M40 48L26 40L22 32M39 56L22 58L16 64M41 64L28 76L26 84M60 48L74 40L78 32M61 56L78 58L84 64M59 64L72 76L74 84" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="66" rx="13" ry="17" fill="#3d4a5c"/>` +
    `<circle cx="50" cy="46" r="11" fill="#4a5a6c"/>` +
    `<ellipse cx="34" cy="58" rx="11" ry="21" fill="#dff3ff" fill-opacity=".6" transform="rotate(35 34 58)"/><ellipse cx="66" cy="58" rx="11" ry="21" fill="#dff3ff" fill-opacity=".6" transform="rotate(-35 66 58)"/>` +
    `<path d="M40 50L26 70M60 50L74 70" stroke="#9aa6c4" stroke-width="2"/>` +
    `<circle cx="50" cy="30" r="10" fill="#3d4a5c"/>` +
    `<circle cx="41" cy="27" r="8" fill="#e8553d"/><circle cx="59" cy="27" r="8" fill="#e8553d"/>` +
    dot(39, 24, 2.4, '#fff') +
    dot(57, 24, 2.4, '#fff'),

  다람쥐:
    blob('#d9974f', [
      [72, 78, 10],
      [81, 66, 11],
      [83, 51, 11],
      [78, 37, 10],
      [68, 30, 8],
    ]) +
    `<path d="M76 74C84 62 84 46 74 36" stroke="#8b5a2b" stroke-width="3"/>` +
    `<ellipse cx="50" cy="68" rx="19" ry="21" fill="#d9974f"/>` +
    `<path d="M60 52C66 60 67 72 62 82" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="45" cy="72" rx="11" ry="14" fill="#f7e3c4" stroke="none"/>` +
    `<ellipse cx="34" cy="24" rx="5" ry="6" fill="#d9974f"/><ellipse cx="52" cy="24" rx="5" ry="6" fill="#d9974f"/>` +
    `<circle cx="43" cy="39" r="16" fill="#d9974f"/>` +
    dot(37, 36, 3) +
    dot(49, 36, 3) +
    dot(43, 44, 2.5) +
    `<path d="M40 48q3 2 6 0" stroke-width="2.5"/>` +
    `<ellipse cx="43" cy="68" rx="7" ry="8" fill="#b5672a"/>` +
    `<path d="M35 64C35 56 51 56 51 64Z" fill="#6b3e26"/><path d="M43 57V53" stroke-width="3"/>` +
    `<circle cx="34" cy="68" r="4" fill="#d9974f"/><circle cx="52" cy="68" r="4" fill="#d9974f"/>`,

  앵무새:
    tube('M8 74H92', '#8b5a2b', 7) +
    `<path d="M42 64L32 94L46 88Z" fill="#3b78e6"/><path d="M48 66L52 95L58 70Z" fill="#ffd23f"/>` +
    `<ellipse cx="50" cy="52" rx="17" ry="22" fill="#e8553d"/>` +
    `<path d="M40 42C30 52 32 70 44 78C52 68 52 54 46 44Z" fill="#ffd23f"/>` +
    `<path d="M36 62C36 70 40 76 44 78C49 72 50 66 49 60C44 62 40 62 36 62Z" fill="#3b78e6"/>` +
    `<circle cx="56" cy="28" r="14" fill="#e8553d"/>` +
    `<ellipse cx="60" cy="28" rx="7" ry="6" fill="#fff" stroke="none"/>` +
    dot(60, 27, 3) +
    `<path d="M66 26C78 22 84 34 78 44C76 38 72 36 67 36Z" fill="#f2e3c8"/>` +
    `<path d="M67 36C71 38 73 42 70 44Z" fill="${INK}"/>` +
    `<ellipse cx="46" cy="74" rx="4" ry="3" fill="#8a96b0" stroke-width="2.5"/><ellipse cx="56" cy="74" rx="4" ry="3" fill="#8a96b0" stroke-width="2.5"/>`,

  까치:
    `<path d="M30 56L4 70L8 78L34 66Z" fill="#2e4a8a"/>` +
    `<path d="M50 70V86M58 70V86M45 86h9M53 86h9" stroke-width="3"/>` +
    `<ellipse cx="50" cy="58" rx="22" ry="15" fill="#232a40"/>` +
    `<ellipse cx="57" cy="63" rx="12" ry="7" fill="#fff" stroke="none"/>` +
    `<path d="M30 54C38 46 54 48 58 56C50 62 38 62 30 54Z" fill="#2e4a8a"/>` +
    `<ellipse cx="43" cy="54" rx="7" ry="3.5" fill="#fff" stroke="none"/>` +
    `<circle cx="72" cy="42" r="11" fill="#232a40"/>` +
    `<path d="M81 39L94 43L81 47Z" fill="${INK}"/>` +
    dot(75, 40, 2.8, '#fff') +
    dot(75.5, 40, 1.5),

  비둘기:
    `<path d="M24 56L6 60L8 68L28 64Z" fill="#7b86a0"/>` +
    tube('M42 74V84', '#ff7a9c', 3) +
    tube('M54 74V84', '#ff7a9c', 3) +
    `<path d="M36 86h10M48 86h10" stroke="#ff7a9c" stroke-width="4"/>` +
    `<ellipse cx="46" cy="62" rx="24" ry="16" fill="#b8c2d6"/>` +
    `<path d="M26 58C36 50 54 52 60 62C50 70 34 70 26 58Z" fill="#8a96b0"/>` +
    `<path d="M38 60q8 4 16 2M34 64q8 3 16 2" stroke="#4a5068" stroke-width="2.5"/>` +
    `<ellipse cx="66" cy="50" rx="9" ry="9" fill="#5fb08a"/>` +
    `<path d="M58 54C62 60 70 58 74 52C70 54 64 56 58 54Z" fill="#a45cf0" stroke="none"/>` +
    `<circle cx="72" cy="36" r="11" fill="#8a96b0"/>` +
    `<path d="M82 35L91 38L82 41Z" fill="#3d3530"/>` +
    `<circle cx="75" cy="34" r="3" fill="#ff9f1a" stroke-width="1.5"/>` +
    dot(75, 34, 1.4),

  독수리:
    `<path d="M40 48C28 34 14 28 4 30L10 38L5 44L14 48L9 54L20 56L17 62L34 60Z" fill="#6b3e26"/>` +
    `<path d="M60 48C72 34 86 28 96 30L90 38L95 44L86 48L91 54L80 56L83 62L66 60Z" fill="#6b3e26"/>` +
    `<path d="M42 72L38 90L50 86L62 90L58 72Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="58" rx="14" ry="20" fill="#6b3e26"/>` +
    `<ellipse cx="44" cy="78" rx="5" ry="3.5" fill="${HL}"/><ellipse cx="56" cy="78" rx="5" ry="3.5" fill="${HL}"/>` +
    `<circle cx="50" cy="32" r="13" fill="#fff"/>` +
    dot(44, 30, 2.8) +
    dot(56, 30, 2.8) +
    `<path d="M44 36H56C56 42 53 48 50 50C47 48 44 42 44 36Z" fill="${HL}"/>`,

  얼룩말:
    `<path d="M18 46C10 50 10 60 12 68"/><path d="M8 66L12 76L16 66Z" fill="${INK}"/>` +
    legs([22, 31, 52, 61], 58, 8, 30, '#fff', INK) +
    `<path d="M22 66h8M22 73h8M31 66h8M31 73h8M52 66h8M52 73h8M61 66h8M61 73h8" stroke-width="3"/>` +
    `<ellipse cx="42" cy="52" rx="27" ry="15" fill="#fff"/>` +
    `<path d="M26 40C23 48 28 56 25 64M36 38C33 46 38 56 35 66M46 38C43 46 48 56 45 67M56 39C53 46 58 56 55 66" stroke-width="5"/>` +
    `<path d="M54 50L61 24C62 16 71 12 77 16L91 30C94 34 91 40 86 39L76 36L71 54Z" fill="#fff"/>` +
    `<path d="M60 30L72 34M58 38L74 42M56 46L72 48M72 20L78 28" stroke-width="4.5"/>` +
    `<path d="M84 26L91 30C94 34 91 40 86 39L82 38Z" fill="#3d3a45"/>` +
    `<path d="M62 19C57 27 54 36 53 45L57 45C59 36 61 29 66 22Z" fill="${INK}"/>` +
    `<path d="M65 18L65 7L73 15Z" fill="#fff"/>` +
    dot(74, 24, 3),

  코뿔소:
    `<path d="M18 48C12 50 10 56 12 60"/>` +
    legs([22, 33, 54, 65], 60, 11, 24, '#9aa3b8') +
    `<ellipse cx="44" cy="54" rx="30" ry="20" fill="#9aa3b8"/>` +
    `<path d="M30 40C28 50 30 62 34 70M56 38C58 50 58 62 56 70" stroke="#6b7390" stroke-width="2.5"/>` +
    `<path d="M66 40L64 26L73 35Z" fill="#9aa3b8"/>` +
    `<path d="M62 42C68 34 80 36 86 44L94 58C96 64 90 68 84 66L64 62Z" fill="#9aa3b8"/>` +
    `<path d="M82 50C83 38 86 28 88 22C92 32 93 44 90 54Z" fill="#f2e3c8"/>` +
    `<path d="M74 44L76 34L80 44Z" fill="#f2e3c8"/>` +
    dot(74, 50, 3) +
    `<path d="M80 62q5 2 9-1" stroke-width="2.5"/>`,

  고릴라:
    `<path d="M16 92C12 64 22 44 50 42C78 44 88 64 84 92Z" fill="#4a4658"/>` +
    `<path d="M32 58C40 54 60 54 68 58C72 70 66 84 50 84C34 84 28 70 32 58Z" fill="#8a8290"/>` +
    tube('M24 54C16 70 22 80 34 74', '#4a4658', 9) +
    tube('M76 54C84 70 78 80 66 74', '#4a4658', 9) +
    `<rect x="30" y="62" width="17" height="14" rx="6" fill="#4a4658"/><rect x="53" y="62" width="17" height="14" rx="6" fill="#4a4658"/>` +
    `<path d="M35 62v5M40 62v5M60 62v5M65 62v5" stroke-width="2.5"/>` +
    `<path d="M12 58l-7-2M12 66H4M12 74l-7 2M88 58l7-2M88 66h8M88 74l7 2" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="31" cy="30" r="5" fill="#4a4658"/><circle cx="69" cy="30" r="5" fill="#4a4658"/>` +
    `<path d="M30 38C28 16 40 8 50 8C60 8 72 16 70 38C70 52 30 52 30 38Z" fill="#4a4658"/>` +
    `<path d="M36 32C36 22 64 22 64 32C66 44 58 48 50 48C42 48 34 44 36 32Z" fill="#8a8290"/>` +
    `<path d="M36 27q7-4 14 0q7-4 14 0" stroke-width="3"/>` +
    dot(43, 31, 2.8) +
    dot(57, 31, 2.8) +
    dot(47, 38, 1.6) +
    dot(53, 38, 1.6) +
    `<path d="M44 42q6 4 12 0" stroke-width="2.5"/>`,

  물고기:
    `<path d="M30 50L8 30C13 42 13 58 8 70Z" fill="#ff9f1a"/>` +
    `<path d="M42 32C48 18 64 18 70 32Z" fill="#e8862e"/>` +
    `<path d="M50 70L46 80L60 72Z" fill="#e8862e"/>` +
    `<ellipse cx="54" cy="50" rx="30" ry="22" fill="#ff9f1a"/>` +
    `<path d="M40 38q5 6 0 12M40 52q5 6 0 12M50 44q5 6 0 12" stroke="#e8862e" stroke-width="2.5"/>` +
    `<path d="M56 54C62 50 68 54 66 62C62 60 58 58 56 54Z" fill="#ffc94d" stroke-width="2.5"/>` +
    eye(72, 44, 6, 3) +
    `<path d="M76 58q4 2 7-2" stroke-width="2.5"/>` +
    `<circle cx="92" cy="30" r="3.5" fill="#dff3ff" stroke-width="2.5"/><circle cx="88" cy="18" r="2.5" fill="#dff3ff" stroke-width="2"/>`,

  조개:
    `<path d="${SC.d}" fill="#ffb38a"/>` +
    `<path d="${SC.ribs}" stroke="#e8862e" stroke-width="3"/>` +
    `<path d="M38 78H62L58 88H42Z" fill="#ffb38a"/>`,

  새우:
    tube('M22 48C12 38 10 26 16 12', '#ff8a5c', 1.5) +
    tube('M24 46C22 34 28 22 38 14', '#ff8a5c', 1.5) +
    `<path d="M40 70l-4 8M48 72l-2 9M56 72l0 9M63 70l3 8" stroke-width="3"/>` +
    `<path d="M76 70L64 88L76 84L86 90Z" fill="#ff8a5c"/>` +
    [
      [78, 64, 8],
      [79, 52, 9.5],
      [73, 40, 10.5],
      [62, 32, 11.5],
      [48, 32, 12],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff8a5c"/>`)
      .join('') +
    `<path d="M28 52C20 44 24 34 34 32L50 34C54 44 54 58 46 68C38 70 32 62 28 52Z" fill="#ff8a5c"/>` +
    `<path d="M28 50L14 54L26 56Z" fill="#ff8a5c" stroke-width="2.5"/>` +
    `<path d="M52 24q4 8 0 16M64 22q5 8 2 18" stroke="#ffc2a0" stroke-width="2.5"/>` +
    eye(34, 44, 4.5, 2.4),

  해파리:
    [30, 40, 50, 60, 70]
      .map((x, i) => tube(`M${x} 54q${i % 2 ? 5 : -5} 8 0 14t0 14${i === 2 ? 't0 8' : ''}`, '#ffb3d1', 4))
      .join('') +
    `<path d="M16 54C16 30 30 14 50 14S84 30 84 54C78 49 74 58 67 54C62 50 58 58 50 54C42 58 38 50 33 54C26 58 22 49 16 54Z" fill="#ffc9e0"/>` +
    `<ellipse cx="34" cy="28" rx="7" ry="4" fill="#fff" stroke="none" opacity=".6" transform="rotate(-30 34 28)"/>` +
    dot(40, 38) +
    dot(60, 38) +
    `<path d="M44 44q6 5 12 0" stroke-width="3"/>` +
    cheeks(44, 18),

  거위:
    tube('M44 74V86', '#ff9f1a', 3) +
    tube('M54 74V86', '#ff9f1a', 3) +
    `<path d="M38 90L48 90L44 84ZM48 90L58 90L54 84Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    tube('M58 58C60 46 62 36 64 28', '#fff', 10) +
    `<path d="M8 50L16 52C24 46 42 48 52 52C60 54 66 58 66 64C66 74 54 80 38 78C24 76 14 68 8 50Z" fill="#fff"/>` +
    `<path d="M22 58C30 52 46 54 52 62C42 68 30 66 22 58Z" fill="#dfe8f5"/>` +
    `<ellipse cx="68" cy="24" rx="11" ry="9" fill="#fff"/>` +
    `<path d="M77 19L92 25L77 30Z" fill="#ff9f1a"/>` +
    dot(70, 21, 2.8),

  염소:
    `<path d="M18 42L10 32L20 40Z" fill="#fff"/>` +
    legs([24, 33, 55, 63], 58, 7, 28, '#fff', '#3d3530') +
    `<rect x="16" y="38" width="58" height="26" rx="13" fill="#fff"/>` +
    tube('M73 26C70 16 62 12 56 16', '#c9b89a', 5) +
    tube('M79 25C78 14 72 8 64 9', '#c9b89a', 5) +
    `<path d="M84 48L85 66L90 48Z" fill="#dfe8f5"/>` +
    `<path d="M66 46C64 32 71 24 80 26C86 28 93 38 93 45C93 51 87 53 82 51L72 52Z" fill="#fff"/>` +
    `<ellipse cx="66" cy="34" rx="8" ry="3.5" fill="#fff" transform="rotate(25 66 34)"/>` +
    dot(80, 34, 3) +
    dot(90, 42, 1.6),

  두더지:
    `<path d="M6 90C12 64 30 58 50 58S88 64 94 90Z" fill="#a0653a"/>` +
    `<ellipse cx="50" cy="74" rx="25" ry="8" fill="#4a2e1c"/>` +
    `<path d="M28 76C26 50 36 30 50 30S74 50 72 76Z" fill="#5d5a6e"/>` +
    `<path d="M24 74C32 84 68 84 76 74C82 76 90 82 94 90H6C10 82 18 76 24 74Z" fill="#a0653a"/>` +
    `<g fill="#ff9aa8"><ellipse cx="30" cy="74" rx="8" ry="6"/><ellipse cx="70" cy="74" rx="8" ry="6"/></g>` +
    `<path d="M26 70v4M30 69v4M34 70v4M66 70v4M70 69v4M74 70v4" stroke-width="2"/>` +
    dot(42, 44, 2.6) +
    dot(58, 44, 2.6) +
    `<ellipse cx="50" cy="52" rx="7" ry="5" fill="#ff7a9c"/>` +
    `<path d="M45 60q5 3 10 0" stroke-width="2.5"/>` +
    `<g fill="#a0653a"><circle cx="16" cy="54" r="3"/><circle cx="84" cy="50" r="3.5"/><circle cx="88" cy="62" r="2.5"/></g>`,

  개:
    tube('M20 50C12 44 10 36 14 28', '#c98b4f', 7) +
    legs([20, 30, 52, 62], 58, 9, 28, '#c98b4f') +
    `<rect x="14" y="40" width="58" height="26" rx="13" fill="#c98b4f"/>` +
    `<path d="M54 44C60 50 64 58 62 64C56 62 52 54 54 44Z" fill="#f2d2a0" stroke="none"/>` +
    tube('M60 38L66 50', '#e8553d', 4) +
    `<circle cx="70" cy="30" r="15" fill="#c98b4f"/>` +
    `<ellipse cx="82" cy="37" rx="11" ry="8" fill="#f2d2a0"/>` +
    `<ellipse cx="90" cy="33" rx="4" ry="3.2" fill="${INK}"/>` +
    `<path d="M80 44C80 51 87 51 87 44Z" fill="#ff7a9c" stroke-width="2.5"/>` +
    `<ellipse cx="60" cy="32" rx="6" ry="12" fill="#8a5a30" transform="rotate(20 60 32)"/>` +
    dot(72, 26, 3) +
    `<circle cx="66" cy="52" r="3.5" fill="${HL}" stroke-width="2.5"/>`,

  메뚜기:
    `<path d="M66 58L62 74L58 76M74 58L76 72L80 74" stroke-width="3"/>` +
    `<ellipse cx="48" cy="54" rx="28" ry="11" fill="#5fc24a"/>` +
    `<path d="M28 46C40 38 60 40 72 48L30 54Z" fill="#3a9e47"/>` +
    `<path d="M32 58v6M40 60v5" stroke-width="2.5"/>` +
    tube('M50 54L28 30', '#3a9e47', 9) +
    tube('M28 30L16 74L26 76', '#3a9e47', 3) +
    `<path d="M80 40C84 26 78 16 70 10M86 40C92 28 92 18 88 10" stroke-width="2.5"/>` +
    `<ellipse cx="80" cy="50" rx="11" ry="13" fill="#5fc24a"/>` +
    eye(82, 46, 5, 2.8) +
    `<path d="M82 58q4 2 7-1" stroke-width="2.5"/>`,

  잠자리:
    `<ellipse cx="28" cy="36" rx="23" ry="7" fill="#d6ecfa" transform="rotate(-8 28 36)"/><ellipse cx="72" cy="36" rx="23" ry="7" fill="#d6ecfa" transform="rotate(8 72 36)"/>` +
    `<ellipse cx="30" cy="50" rx="21" ry="6.5" fill="#d6ecfa" transform="rotate(12 30 50)"/><ellipse cx="70" cy="50" rx="21" ry="6.5" fill="#d6ecfa" transform="rotate(-12 70 50)"/>` +
    `<path d="M12 37L44 36M56 36L88 37M14 47L44 45M56 45L86 47" stroke="#9aa6c4" stroke-width="2"/>` +
    tube('M50 46V90', '#e8553d', 7) +
    `<path d="M46 58h8M46 68h8M46 78h8" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="38" rx="8" ry="10" fill="#e8553d"/>` +
    `<circle cx="43" cy="20" r="8" fill="#e8553d"/><circle cx="57" cy="20" r="8" fill="#e8553d"/>` +
    dot(43, 20, 3.3) +
    dot(57, 20, 3.3) +
    dot(41, 18, 1.4, '#fff') +
    dot(55, 18, 1.4, '#fff'),

  무당벌레:
    `<path d="M24 46L12 40M22 60H8M26 74L14 82M76 46L88 40M78 60H92M74 74L86 82" stroke-width="4"/>` +
    `<path d="M44 16C40 8 34 6 30 8M56 16C60 8 66 6 70 8"/>` +
    `<circle cx="50" cy="26" r="13" fill="#2a2f45"/>` +
    dot(44, 22, 3.2, '#fff') +
    dot(56, 22, 3.2, '#fff') +
    dot(44, 22.5, 1.6) +
    dot(56, 22.5, 1.6) +
    `<circle cx="50" cy="60" r="30" fill="#e8553d"/>` +
    `<path d="M50 30V90"/>` +
    `<g fill="${INK}" stroke="none"><circle cx="37" cy="46" r="5.5"/><circle cx="63" cy="46" r="5.5"/><circle cx="31" cy="64" r="5.5"/><circle cx="69" cy="64" r="5.5"/><circle cx="41" cy="79" r="5"/><circle cx="59" cy="79" r="5"/></g>` +
    `<ellipse cx="36" cy="36" rx="5" ry="3" fill="#fff" stroke="none" opacity=".5" transform="rotate(-35 36 36)"/>`,

  고슴도치:
    `<ellipse cx="36" cy="86" rx="6" ry="3.5" fill="#f2d2a0"/><ellipse cx="62" cy="86" rx="6" ry="3.5" fill="#f2d2a0"/>` +
    `<ellipse cx="50" cy="66" rx="36" ry="20" fill="#f2d2a0"/>` +
    `<path d="${spikes(46, 70, 26, 40, 165, 330, 9)}" fill="#8b5a2b"/>` +
    `<circle cx="72" cy="50" r="4" fill="#f2d2a0" stroke-width="2.5"/>` +
    dot(76, 60, 3) +
    `<circle cx="88" cy="66" r="3.5" fill="${INK}"/>` +
    `<path d="M76 72q5 3 9 0" stroke-width="2.5"/>` +
    `<circle cx="72" cy="68" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>`,

  캥거루:
    tube('M40 78C30 84 18 88 8 88', '#c98b4f', 9) +
    `<ellipse cx="60" cy="87" rx="15" ry="5" fill="#c98b4f"/>` +
    `<path d="M34 84C26 70 30 46 44 38C54 34 62 40 64 52C66 64 64 78 58 86Z" fill="#c98b4f"/>` +
    `<path d="M51 53L49 44L55 50ZM59 50L62 42L63 51Z" fill="#e0a868" stroke-width="2.5"/>` +
    `<ellipse cx="56" cy="57" rx="7" ry="6" fill="#e0a868"/>` +
    dot(53, 56, 1.8) +
    dot(59, 56, 1.8) +
    `<path d="M44 62C50 67 58 67 64 63C63 80 44 78 44 62Z" fill="#e8c49a"/>` +
    tube('M60 44L70 52', '#c98b4f', 4) +
    `<ellipse cx="48" cy="14" rx="4" ry="10" fill="#c98b4f" transform="rotate(-15 48 14)"/><ellipse cx="57" cy="12" rx="4" ry="10" fill="#c98b4f" transform="rotate(10 57 12)"/>` +
    `<path d="M46 30C46 20 56 16 64 20L78 26C82 28 80 34 76 34L56 38C50 38 46 36 46 30Z" fill="#c98b4f"/>` +
    dot(58, 26, 2.8) +
    dot(78, 29, 2),

  햄스터:
    `<circle cx="28" cy="26" r="9" fill="#f2a65a"/><circle cx="72" cy="26" r="9" fill="#f2a65a"/>` +
    dot(28, 26, 4.5, '#ffb3c4') +
    dot(72, 26, 4.5, '#ffb3c4') +
    `<ellipse cx="50" cy="58" rx="32" ry="31" fill="#f2a65a"/>` +
    `<ellipse cx="50" cy="72" rx="20" ry="16" fill="#fff5e6" stroke="none"/>` +
    `<circle cx="25" cy="62" r="12" fill="#fff5e6"/><circle cx="75" cy="62" r="12" fill="#fff5e6"/>` +
    `<circle cx="25" cy="64" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="75" cy="64" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    dot(40, 48, 3.8) +
    dot(60, 48, 3.8) +
    `<path d="M47 55h6l-3 3z" fill="#ff7a9c" stroke-width="2"/><path d="M50 58v2M46 62q4 3 8 0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="77" rx="5" ry="8" fill="#3d3a45"/><path d="M50 72v10" stroke="#fff" stroke-width="2"/>` +
    `<circle cx="43" cy="77" r="4" fill="#ffb3c4"/><circle cx="57" cy="77" r="4" fill="#ffb3c4"/>`,

  수달:
    `<ellipse cx="88" cy="54" rx="4.5" ry="8" fill="#8b5a2b" transform="rotate(-30 88 54)"/>` +
    `<ellipse cx="58" cy="62" rx="28" ry="14" fill="#8b5a2b"/>` +
    `<ellipse cx="60" cy="56" rx="18" ry="6" fill="#c98b4f" stroke="none"/>` +
    `<path d="${OT.d}" fill="#ffb3c4"/><path d="${OT.ribs}" stroke-width="2"/>` +
    `<circle cx="46" cy="49" r="5.5" fill="#8b5a2b"/><circle cx="74" cy="49" r="5.5" fill="#8b5a2b"/>` +
    `<circle cx="11" cy="43" r="4" fill="#8b5a2b"/><circle cx="37" cy="43" r="4" fill="#8b5a2b"/>` +
    `<ellipse cx="24" cy="55" rx="18" ry="15" fill="#8b5a2b"/>` +
    `<ellipse cx="24" cy="60" rx="14" ry="9" fill="#f2dcc0"/>` +
    `<ellipse cx="24" cy="57" rx="4" ry="3" fill="${INK}"/>` +
    dot(16, 50, 2.8) +
    dot(32, 50, 2.8) +
    `<path d="M21 62q3 2 6 0M14 60H5M14 63L6 67M34 60H43M34 63L42 67" stroke-width="2"/>` +
    `<path d="M4 70q7-5 14 0t14 0t14 0t14 0t14 0t14 0t10 0V92H4Z" fill="#7ec8f0"/>` +
    `<path d="M16 82q6-4 12 0M60 84q6-4 12 0" stroke="#dff3ff" stroke-width="3"/>`,

  백조:
    tube('M32 62C20 50 26 38 34 30C40 24 36 16 28 16', '#fff', 9) +
    `<path d="M20 70C18 58 34 52 50 58C62 48 78 46 88 38C86 58 80 72 60 76H28C22 76 20 74 20 70Z" fill="#fff"/>` +
    `<path d="M44 64C54 54 70 52 80 50C76 64 62 70 48 70Z" fill="#dfe8f5"/>` +
    `<circle cx="28" cy="18" r="8" fill="#fff"/>` +
    `<path d="M21 16L8 24L22 23Z" fill="#ff9f1a"/>` +
    dot(22, 18, 2.6) +
    dot(29, 16, 2.4) +
    `<path d="M4 74q8-6 16 0t16 0t16 0t16 0t16 0t12 0V92H4Z" fill="#7ec8f0"/>` +
    `<path d="M18 84q6-4 12 0M62 86q6-4 12 0" stroke="#dff3ff" stroke-width="3"/>`,

  표범:
    tube('M18 50C8 52 6 66 12 74', '#f2c14e', 6) +
    legs([22, 31, 56, 65], 56, 8, 28, '#f2c14e') +
    `<rect x="14" y="38" width="62" height="24" rx="12" fill="#f2c14e"/>` +
    `<g fill="${INK}" stroke="none"><circle cx="24" cy="46" r="3"/><circle cx="34" cy="54" r="3"/><circle cx="42" cy="44" r="3"/><circle cx="52" cy="54" r="3"/><circle cx="60" cy="44" r="3"/><circle cx="26" cy="72" r="2.5"/><circle cx="60" cy="72" r="2.5"/><circle cx="69" cy="54" r="2.5"/></g>` +
    `<circle cx="72" cy="26" r="5.5" fill="#f2c14e"/><circle cx="90" cy="26" r="5.5" fill="#f2c14e"/>` +
    `<circle cx="81" cy="38" r="14" fill="#f2c14e"/>` +
    `<ellipse cx="81" cy="45" rx="8" ry="6" fill="#fff"/>` +
    dot(75, 35, 3) +
    dot(87, 35, 3) +
    `<path d="M78 41h6l-3 3z" fill="${INK}" stroke-width="2"/>` +
    `<g fill="${INK}" stroke="none"><circle cx="73" cy="28" r="1.8"/><circle cx="89" cy="28" r="1.8"/><circle cx="81" cy="27" r="2"/></g>`,

  불가사리:
    `<path d="${star(50, 54, 45, 20)}" fill="#ff9f1a"/>` +
    `<g fill="#ffd08a" stroke="none"><circle cx="50" cy="22" r="3"/><circle cx="21" cy="46" r="3"/><circle cx="79" cy="46" r="3"/><circle cx="32" cy="78" r="3"/><circle cx="68" cy="78" r="3"/></g>` +
    dot(43, 50, 3.3) +
    dot(57, 50, 3.3) +
    `<path d="M44 58q6 5 12 0" stroke-width="3"/>` +
    cheeks(58, 13),

  가재:
    [
      'M40 44L28 44L24 50',
      'M40 50L28 54L26 60',
      'M41 56L30 62L30 68',
      'M60 44L72 44L76 50',
      'M60 50L72 54L74 60',
      'M59 56L70 62L70 68',
    ]
      .map((d) => tube(d, '#c8452e', 2.5))
      .join('') +
    tube('M42 32L30 24', '#c8452e', 5) +
    tube('M58 32L70 24', '#c8452e', 5) +
    `<path d="M30 28C18 30 12 18 14 6L21 14L25 4C32 10 36 24 30 28Z" fill="#c8452e"/>` +
    `<path d="M70 28C82 30 88 18 86 6L79 14L75 4C68 10 64 24 70 28Z" fill="#c8452e"/>` +
    `<path d="M50 84L38 94L46 95L50 90L54 95L62 94Z" fill="#c8452e"/>` +
    `<ellipse cx="50" cy="80" rx="8" ry="5" fill="#c8452e"/><ellipse cx="50" cy="72" rx="9.5" ry="5" fill="#c8452e"/><ellipse cx="50" cy="64" rx="11" ry="5" fill="#c8452e"/>` +
    `<ellipse cx="50" cy="44" rx="13" ry="17" fill="#c8452e"/>` +
    eye(44, 34, 4, 2.2) +
    eye(56, 34, 4, 2.2) +
    `<path d="M45 44q5 4 10 0" stroke-width="2.5"/>`,
};
