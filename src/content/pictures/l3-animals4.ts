// L3 동물 묶음 4 (흑마·새끼양 … 바닷가재: 드문 동물, 동물의 집·물건, 동물 몸의 부분). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, blob, cheeks, tube, ring, sparkle, drop } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 5.5, p = 3) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` + dot(x, y + 0.3, p);

// 네 다리 (옆모습 동물)
const legs = (xs: number[], y: number, w: number, h: number, fill: string, hoof = '', hh = 6) =>
  xs
    .map(
      (x) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}"/>` +
        (hoof ? `<rect x="${x}" y="${y + h - hh}" width="${w}" height="${hh}" rx="2" fill="${hoof}"/>` : ''),
    )
    .join('');

/** 부채꼴 조개 */
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
const SHELL = scallop(40, 80, 40, 48, 7);

/** 거미줄 (바큇살 8개 + 둘레) */
function web(cx: number, cy: number, rs: number[]): string {
  let d = '';
  for (let k = 0; k < 8; k++) {
    const [x, y] = pt(cx, cy, rs[rs.length - 1] + 3, k * 45 + 22.5);
    d += `M${cx} ${cy}L${x} ${y}`;
  }
  for (const r of rs) {
    const ps = Array.from({ length: 8 }, (_, k) => pt(cx, cy, r, k * 45 + 22.5));
    d += `M${ps[0][0]} ${ps[0][1]}`;
    for (let k = 1; k <= 8; k++) {
      const b = ps[k % 8];
      const m = pt(cx, cy, r * 0.86, (k - 1) * 45 + 45);
      d += `Q${m[0]} ${m[1]} ${b[0]} ${b[1]}`;
    }
  }
  return `<path d="${d}" stroke="#5a6488" stroke-width="2.6"/>`;
}

/** 육각형 (벌집) */
const hex = (cx: number, cy: number, r: number, fill: string) =>
  `<path d="M${Array.from({ length: 6 }, (_, k) => pt(cx, cy, r, 30 + 60 * k).join(' ')).join('L')}Z" fill="${fill}"/>`;

/** 개미 (옆모습, 오른쪽을 봄). body: 몸 색, big: 배 크기 */
function ant(x: number, y: number, s: number, body: string, big = 1, extra = ''): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${r1(3.5 / s)}">` +
    `<path d="M-6 2L-16 16L-21 18M0 3L0 19L-3 21M5 2L15 16L20 18" stroke-width="${r1(4 / s)}"/>` +
    `<path d="M24 -13L29 -25L39 -24M17 -15L19 -28L29 -33" stroke-width="${r1(3 / s)}"/>` +
    `<ellipse cx="${-22 - 4 * (big - 1)}" cy="0" rx="${16 * big}" ry="${12 * big}" fill="${body}"/>` +
    `<ellipse cx="0" cy="-2" rx="9" ry="6.5" fill="${body}"/>` +
    `<circle cx="18" cy="-6" r="10" fill="${body}"/>` +
    `<circle cx="21" cy="-8" r="3.4" fill="#fff" stroke="none"/><circle cx="22" cy="-7.6" r="1.8" fill="${INK}" stroke="none"/>` +
    `<path d="M20 -1q4 2 7 -1" stroke-width="${r1(2.2 / s)}"/>` +
    extra +
    `</g>`
  );
}

/** 오른쪽을 보는 물고기 (몸의 부분 그림 바탕) */
const FISH_TAIL = `<path d="M24 52L6 32C4 44 4 60 6 72Z" fill="#ff9f1a"/>`;
const FISH_TOP = `<path d="M36 34C40 16 58 12 70 32Z" fill="#ff9f1a"/>`;
const fishBody = (fill = '#4a90e2') => `<ellipse cx="54" cy="52" rx="34" ry="22" fill="${fill}"/>`;
const FISH_FACE = eye(74, 46, 5.5, 3) + `<path d="M86 58q-4 2-7 0" stroke-width="2.5"/>`;
const FISH_PEC = `<path d="M54 60C60 58 66 64 62 72C56 70 52 66 54 60Z" fill="#ff9f1a"/>`;

/** 사람 발자국 (발가락 5개) */
const foot = (x: number, y: number, deg: number, flip = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${flip} 1)" fill="#9a5b2e" stroke="none">` +
  `<path d="M-6 -8C-8 -16 -2 -20 3 -18S9 -10 8 -2S6 12 1 13S-6 8 -6 0Z"/>` +
  `<circle cx="-5" cy="-22" r="2.8"/><circle cx="0" cy="-24" r="2.5"/><circle cx="4.5" cy="-23" r="2.2"/><circle cx="8" cy="-20.5" r="2"/><circle cx="10" cy="-16.5" r="1.8"/>` +
  `</g>`;

export const PICS: Record<string, string> = {
  흑마:
    `<path d="M20 46C8 48 6 64 10 76C14 66 16 58 22 54Z" fill="#1d2340"/>` +
    legs([22, 31, 52, 61], 58, 8, 30, '#3a3446', '#8a96b0') +
    `<ellipse cx="42" cy="52" rx="27" ry="15" fill="#3a3446"/>` +
    `<path d="M65 18L65 7L73 15Z" fill="#3a3446"/>` +
    `<path d="M54 50L61 24C62 16 71 12 77 16L91 30C94 34 91 40 86 39L76 36L71 54Z" fill="#3a3446"/>` +
    `<path d="M62 18C55 26 51 36 49 46L57 45C59 36 61 29 67 22Z" fill="#1d2340" stroke="#5a6488" stroke-width="2"/>` +
    `<path d="M76 20L86 31" stroke="#fff" stroke-width="3.5"/>` +
    dot(73, 25, 3.4, '#fff') +
    dot(73.6, 25.4, 1.8) +
    dot(88, 34, 1.6, '#fff') +
    `<path d="M30 48q10 -6 22 -2" stroke="#6a6480" stroke-width="3"/>`,

  새끼양:
    legs([30, 41, 55, 64], 62, 7, 20, '#f2d6c0') +
    blob('#fff', [
      [30, 58, 11],
      [42, 52, 12],
      [55, 54, 11],
      [60, 64, 10],
      [46, 66, 11],
      [32, 68, 10],
    ]) +
    `<ellipse cx="60" cy="42" rx="7" ry="4" fill="#ffc0c8" transform="rotate(25 60 42)"/><ellipse cx="88" cy="42" rx="7" ry="4" fill="#ffc0c8" transform="rotate(-25 88 42)"/>` +
    `<ellipse cx="74" cy="44" rx="14" ry="15" fill="#fff4e4"/>` +
    blob('#fff', [
      [68, 30, 5.5],
      [75, 28, 6],
      [81, 31, 5],
    ]) +
    dot(68, 45, 2.8) +
    dot(80, 45, 2.8) +
    `<path d="M71 53q3 3 6 0" stroke-width="2.5"/>` +
    cheeks(51, 9, 74) +
    `<path d="M62 58L66 52L72 58L66 62Z" fill="#ff5c70" stroke-width="2.5"/><path d="M76 58L80 52L86 58L80 62Z" fill="#ff5c70" stroke-width="2.5"/><circle cx="74" cy="57" r="3.5" fill="#ff5c70" stroke-width="2.5"/>`,

  새끼돼지:
    `<path d="M20 50c-9 -3 -9 -13 -2 -12s3 9 -4 8" stroke-width="3"/>` +
    legs([28, 38, 52, 62], 64, 8, 16, '#ffa2b4') +
    `<ellipse cx="44" cy="60" rx="25" ry="17" fill="#ffb8c6"/>` +
    `<path d="M62 36L62 22L74 32Z" fill="#ff9aa8"/>` +
    `<circle cx="72" cy="50" r="18" fill="#ffb8c6"/>` +
    `<ellipse cx="88" cy="54" rx="6" ry="8" fill="#ff8fa8"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="87" cy="51" rx="1.4" ry="2.2"/><ellipse cx="90" cy="56" rx="1.4" ry="2.2"/></g>` +
    dot(76, 45, 3) +
    `<path d="M74 60q4 3 8 0" stroke-width="2.5"/>` +
    `<circle cx="68" cy="56" r="5" fill="#ff7a90" stroke="none" opacity=".5"/>`,

  오골계:
    `<path d="M32 50C20 34 10 30 6 36C8 46 12 56 22 62Z" fill="#2b2838"/>` +
    `<path d="M30 48C22 26 16 20 12 22C14 36 18 48 26 58" stroke="#5a5670" stroke-width="3"/>` +
    `<path d="M40 76L38 90M54 76L56 90M32 90H44M50 90H62" stroke="#4a4556" stroke-width="5"/>` +
    `<ellipse cx="46" cy="60" rx="26" ry="20" fill="#2b2838"/>` +
    `<path d="M30 58q8 8 20 6M36 68q8 6 18 2" stroke="#5a5670" stroke-width="3"/>` +
    `<circle cx="68" cy="38" r="15" fill="#2b2838"/>` +
    blob('#3f3a52', [
      [62, 24, 6],
      [69, 21, 6.5],
      [76, 24, 5.5],
    ]) +
    `<path d="M80 36L92 40L80 44Z" fill="#8a96b0"/>` +
    `<path d="M78 46C82 50 82 56 78 56C76 54 76 50 78 46Z" fill="#8e2a4a"/>` +
    `<circle cx="66" cy="44" r="4" fill="#3bb0c9"/>` +
    dot(74, 34, 3.4, '#fff') +
    dot(74.6, 34.3, 1.8),

  메추리:
    `<path d="M24 56L8 50L12 64Z" fill="#8a6a40"/>` +
    `<path d="M42 78L40 88M56 78L58 88" stroke="#e8a060" stroke-width="4"/>` +
    `<ellipse cx="46" cy="60" rx="28" ry="20" fill="#b08a5a"/>` +
    `<path d="M30 70C40 80 58 80 70 66" fill="#e8d4b0" stroke="none"/>` +
    `<path d="M28 54q6 -4 12 0M42 50q6 -4 12 0M34 62q6 -4 12 0M50 60q6 -4 12 0" stroke="#fff" stroke-width="2.8"/>` +
    `<circle cx="70" cy="40" r="13" fill="#9a7650"/>` +
    `<path d="M60 34Q70 28 82 36" stroke="#fff" stroke-width="2.8"/>` +
    `<path d="M82 42L89 44L82 47Z" fill="#6b4a30" stroke-width="2.5"/>` +
    dot(74, 40, 2.5) +
    `<g stroke-width="2.5"><ellipse cx="80" cy="80" rx="7" ry="9" fill="#f2e3c8"/><ellipse cx="92" cy="84" rx="5" ry="6.5" fill="#f2e3c8"/></g>` +
    `<g fill="#6b4a30" stroke="none"><circle cx="78" cy="77" r="2"/><circle cx="83" cy="82" r="1.6"/><circle cx="78" cy="85" r="1.4"/><circle cx="92" cy="82" r="1.4"/></g>`,

  에뮤:
    `<path d="M40 62L34 90M52 62L58 90M26 92H38M54 92H66" stroke="#8a7a60" stroke-width="5"/>` +
    blob('#7a5a3a', [
      [26, 52, 12],
      [38, 44, 14],
      [52, 46, 13],
      [44, 58, 12],
      [30, 62, 9],
    ]) +
    `<path d="M26 46l-4 8M36 40l-3 10M48 42l-2 10M40 54l-2 8" stroke="#5a3e26" stroke-width="3"/>` +
    tube('M56 44C60 34 62 24 64 16', '#7e9ab8', 8) +
    `<ellipse cx="68" cy="14" rx="9" ry="7" fill="#7e9ab8"/>` +
    `<path d="M76 12L86 15L76 18Z" fill="#4a4556" stroke-width="2.5"/>` +
    dot(70, 12, 2.8, '#fff') +
    dot(70.5, 12.2, 1.5) +
    `<path d="M60 8q4 -4 8 -2" stroke="#5a3e26" stroke-width="3"/>`,

  문조:
    tube('M6 80H94', '#9a5b2e', 6) +
    `<path d="M36 64L16 84L28 86L42 70Z" fill="${INK}"/>` +
    `<ellipse cx="50" cy="60" rx="20" ry="19" fill="#9aa2b4"/>` +
    `<path d="M36 68C42 78 56 80 66 70C60 74 46 74 36 68Z" fill="#f2c8d0" stroke="none"/>` +
    `<path d="M44 78v6M54 78v6" stroke="#ff9aa8" stroke-width="3.5"/>` +
    `<circle cx="62" cy="36" r="16" fill="${INK}"/>` +
    `<ellipse cx="62" cy="43" rx="9" ry="6" fill="#fff" stroke="none"/>` +
    `<path d="M74 30C84 30 90 36 90 40C84 44 78 44 74 42Z" fill="#ff5c70"/>` +
    `<circle cx="66" cy="31" r="4" fill="#ff9aa8" stroke="none"/>` +
    dot(66, 31, 2.2),

  구피:
    `<path d="M50 50C62 30 84 12 94 18C96 40 96 62 94 82C84 88 62 70 50 50Z" fill="#ff9f1a"/>` +
    `<path d="M60 44C72 32 84 26 92 28M60 56C72 68 84 74 92 72" stroke="#3b8fe0" stroke-width="5"/>` +
    `<g fill="#e8553d" stroke="none"><circle cx="78" cy="40" r="3"/><circle cx="84" cy="54" r="3"/><circle cx="76" cy="62" r="3"/><circle cx="88" cy="36" r="2.5"/><circle cx="88" cy="66" r="2.5"/></g>` +
    `<path d="M28 42C32 30 42 32 44 42Z" fill="#7ec8f0"/>` +
    `<ellipse cx="32" cy="50" rx="22" ry="11" fill="#b8c8d8"/>` +
    `<path d="M36 44q6 6 0 12" stroke="#3b8fe0" stroke-width="3"/>` +
    eye(20, 47, 4.5, 2.5) +
    `<path d="M11 54q3 1 5 -1" stroke-width="2.2"/>`,

  베타:
    `<path d="M52 50C62 20 86 8 96 18C92 30 94 42 90 50C94 58 92 72 96 84C86 94 62 80 52 50Z" fill="#8e4fc9"/>` +
    `<path d="M62 42C74 30 84 24 92 22M62 58C74 70 84 76 92 80M64 50H90" stroke="#b886f0" stroke-width="3"/>` +
    `<path d="M26 40C28 20 44 8 62 14C58 24 56 32 52 42Z" fill="#3b58c8"/>` +
    `<path d="M28 60C28 78 40 94 60 92C56 80 54 68 50 58Z" fill="#3b58c8"/>` +
    `<ellipse cx="36" cy="50" rx="24" ry="13" fill="#3b78e6"/>` +
    `<path d="M40 60C44 68 42 76 36 80C34 72 34 66 40 60Z" fill="#e8553d"/>` +
    eye(22, 46, 4.5, 2.5) +
    `<path d="M13 55q3 1 5 -1" stroke-width="2.2"/>`,

  엔젤피시:
    `<path d="M44 30C50 14 66 6 84 4C74 14 64 24 58 36Z" fill="#e8eef6"/>` +
    `<path d="M44 70C50 86 66 94 84 96C74 86 64 76 58 64Z" fill="#e8eef6"/>` +
    `<path d="M34 64C32 76 30 86 26 94M38 66C38 78 38 86 36 94" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M64 50L84 34C86 44 86 56 84 66Z" fill="#dfe8f5"/>` +
    `<path d="M16 50C24 30 44 22 62 36C68 42 68 58 62 64C44 78 24 70 16 50Z" fill="#f4f7fb"/>` +
    `<path d="M30 30C34 44 34 58 30 70M46 26C50 42 50 60 46 74M60 36C62 44 62 56 60 64" stroke="${INK}" stroke-width="5.5"/>` +
    `<path d="M16 50C24 30 44 22 62 36C68 42 68 58 62 64C44 78 24 70 16 50Z"/>` +
    `<path d="M16 50C18 42 22 38 26 36" stroke="#ffd23f" stroke-width="4"/>` +
    eye(24, 46, 4.5, 2.5) +
    `<path d="M16 54q3 1 5 -1" stroke-width="2.2"/>`,

  바지락:
    `<g transform="rotate(-12 70 40)">` +
    `<path d="M50 44C50 30 62 22 70 22C78 22 90 30 90 44C90 52 82 56 70 56C58 56 50 52 50 44Z" fill="#bfae90"/>` +
    `<path d="M56 40l4 -4l4 4l4 -4l4 4l4 -4l4 4l4 -4M56 48l4 -4l4 4l4 -4l4 4l4 -4l4 4l4 -4" stroke="#6b4a30" stroke-width="2.5"/>` +
    `</g>` +
    `<path d="M10 66C10 44 28 32 42 32C56 32 74 44 74 66C74 78 60 84 42 84C24 84 10 78 10 66Z" fill="#d8c8a8"/>` +
    `<path d="M36 34C38 30 46 30 48 34Z" fill="#bfae90"/>` +
    `<path d="M18 60l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6M16 72l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6l6 6l6 -6" stroke="#6b4a30" stroke-width="3"/>` +
    `<path d="M16 78C30 84 54 84 68 78" stroke="#8a6a50" stroke-width="2.5"/>`,

  꼬막:
    (() => {
      const cockle = (cx: number, cy: number, r: number, fill: string) => {
        let ribs = '';
        for (let k = 1; k < 9; k++) {
          const [x, y] = pt(cx, cy, r - 1, 90 - 80 + (160 * k) / 9 + 0);
          ribs += `M${cx} ${cy - r + 4}L${x} ${y}`;
        }
        return (
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>` +
          `<path d="${ribs}" stroke="#8a5a30" stroke-width="3"/>` +
          `<path d="M${cx - 7} ${cy - r + 2}Q${cx} ${cy - r - 9} ${cx + 7} ${cy - r + 2}Z" fill="${fill}"/>`
        );
      };
      return cockle(68, 42, 20, '#c89a68') + cockle(40, 62, 27, '#f0dcc0');
    })(),

  대하:
    (() => {
      const segs: [number, number][] = [
        [70, 8.5],
        [40, 10],
        [10, 11],
        [-20, 12],
        [-50, 13],
        [-80, 14],
        [-110, 15],
      ];
      let s =
        `<path d="M22 38C8 48 4 70 10 92M22 34C4 32 2 50 4 64" stroke="#e8553d" stroke-width="2.5"/>` +
        `<path d="M34 52L28 64M40 58L36 70M48 62L46 74M56 64L56 74" stroke="#e8553d" stroke-width="3"/>` +
        `<path d="M58 78L46 90L56 94L62 84L68 94L76 88Z" fill="#ff8a5c"/>`;
      for (const [a, r] of segs) {
        const [x, y] = pt(52, 50, 28, a);
        s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9f6a"/>`;
      }
      s +=
        `<path d="M14 40C14 28 26 22 36 26C44 30 44 44 36 48C28 52 16 50 14 40Z" fill="#ff8a5c"/>` +
        `<path d="M16 36L6 30" stroke-width="3"/>` +
        dot(24, 34, 3.2) +
        dot(25, 33, 1.2, '#fff') +
        `<path d="M44 26q12 -6 22 -2M74 30q8 6 10 16M80 58q-2 8 -8 12" stroke="#fff" stroke-width="3" opacity=".6"/>`;
      return s;
    })(),

  코브라:
    `<ellipse cx="50" cy="82" rx="36" ry="11" fill="#d8a040"/>` +
    `<path d="M20 80C24 72 40 70 50 72C62 70 76 72 80 80" stroke="#b07a28" stroke-width="3"/>` +
    `<path d="M84 84C92 82 94 76 90 72" stroke-width="3.5"/>` +
    `<path d="M42 78C42 66 44 60 46 56H54C56 60 58 66 58 78Z" fill="#e0b050"/>` +
    `<path d="M50 12C24 12 10 34 16 50C22 60 40 64 50 64C60 64 78 60 84 50C90 34 76 12 50 12Z" fill="#e0b050"/>` +
    `<path d="M50 34C42 34 38 42 40 52C42 58 46 60 50 60C54 60 58 58 60 52C62 42 58 34 50 34Z" fill="#f6e0a0"/>` +
    `<circle cx="30" cy="40" r="5" fill="#f6e0a0" stroke="#9a6a28" stroke-width="3"/><circle cx="70" cy="40" r="5" fill="#f6e0a0" stroke="#9a6a28" stroke-width="3"/>` +
    `<path d="M50 32v4l-3 3M50 36l3 3" stroke="#ff5c70" stroke-width="2"/>` +
    `<ellipse cx="50" cy="22" rx="13" ry="10" fill="#e8c060"/>` +
    dot(45, 20, 3) +
    dot(55, 20, 3) +
    dot(45.8, 19.2, 1, '#fff') +
    dot(55.8, 19.2, 1, '#fff') +
    `<path d="M45 27q5 3 10 0" stroke-width="2.5"/>` +
    cheeks(26, 10) +
    `<path d="M46 72q4 -3 8 0M46 64q4 -3 8 0" stroke="#b07a28" stroke-width="2.5"/>`,

  황소개구리:
    `<path d="M14 86C6 72 16 60 28 66C22 74 24 80 32 86Z" fill="#5a8a30"/>` +
    `<path d="M86 86C94 72 84 60 72 66C78 74 76 80 68 86Z" fill="#5a8a30"/>` +
    `<ellipse cx="50" cy="60" rx="36" ry="28" fill="#6b9a3a"/>` +
    `<ellipse cx="50" cy="72" rx="22" ry="14" fill="#f2e0a0"/>` +
    `<g fill="#4a7a28" stroke="none"><circle cx="22" cy="58" r="4"/><circle cx="78" cy="58" r="4"/><circle cx="30" cy="46" r="3"/><circle cx="70" cy="46" r="3"/></g>` +
    `<circle cx="32" cy="32" r="11" fill="#6b9a3a"/><circle cx="68" cy="32" r="11" fill="#6b9a3a"/>` +
    eye(32, 31, 7, 3.8) +
    eye(68, 31, 7, 3.8) +
    `<circle cx="18" cy="46" r="7" fill="#9a7a40"/><circle cx="82" cy="46" r="7" fill="#9a7a40"/>` +
    `<path d="M22 56Q50 70 78 56" stroke-width="3.5"/>` +
    `<path d="M34 84L28 92M40 86L38 94M66 84L72 92M60 86L62 94" stroke="#5a8a30" stroke-width="5"/>`,

  불개미: ant(54, 58, 1.35, '#e8402a'),

  여왕개미:
    ant(
      56,
      62,
      1.15,
      '#9a4a2a',
      1.25,
      `<path d="M-2 -6C-20 -30 -44 -34 -52 -28C-46 -18 -24 -10 -2 -6Z" fill="#eef8ff" opacity=".9"/>` +
        `<path d="M2 -7C-8 -34 -26 -44 -34 -40C-32 -28 -16 -14 2 -7Z" fill="#eef8ff" opacity=".9"/>` +
        `<path d="M9 -15L10 -26L15 -20L19 -28L22 -20L27 -26L27 -15Z" fill="${HL}" stroke-width="2.5"/>` +
        `<circle cx="19" cy="-28" r="2" fill="#ff5c70" stroke="none"/>`,
    ),

  일개미:
    ant(
      46,
      64,
      1.2,
      '#3a3446',
      1,
      `<path d="M26 -10C28 -30 44 -36 52 -24C56 -14 46 -4 34 -4Z" fill="#f2c14e"/>` +
        `<g fill="#9a5b2e" stroke="none"><circle cx="40" cy="-22" r="2"/><circle cx="46" cy="-14" r="2"/><circle cx="36" cy="-12" r="1.8"/></g>`,
    ) +
    drop(28, 20, 0.8) +
    `<path d="M10 90H90" stroke="#9a5b2e" stroke-width="4"/>`,

  고추잠자리:
    `<g transform="rotate(-20 50 50)">` +
    `<path d="M58 46C52 26 36 14 22 16C22 30 40 42 56 48Z" fill="#e8f6ff"/>` +
    `<path d="M58 54C52 74 36 86 22 84C22 70 40 58 56 52Z" fill="#e8f6ff"/>` +
    `<path d="M64 46C66 24 80 12 92 16C90 30 78 42 66 48Z" fill="#e8f6ff"/>` +
    `<path d="M64 54C66 76 80 88 92 84C90 70 78 58 66 52Z" fill="#e8f6ff"/>` +
    `<path d="M30 22L56 46M30 78L56 54M86 20L66 46M86 80L66 54" stroke="#9aa6c4" stroke-width="2"/>` +
    tube('M8 50H54', '#e8553d', 7) +
    `<path d="M16 50h0M26 50h0M36 50h0M46 50h0" stroke="#b83a28" stroke-width="3" stroke-linecap="butt"/>` +
    `<ellipse cx="61" cy="50" rx="9" ry="7" fill="#e8553d"/>` +
    `<circle cx="74" cy="44" r="6.5" fill="#d63c2a"/><circle cx="74" cy="56" r="6.5" fill="#d63c2a"/>` +
    dot(76, 44, 1.8, '#fff') +
    dot(76, 56, 1.8, '#fff') +
    `</g>`,

  거미줄:
    web(50, 50, [9, 19, 30, 41]) +
    `<path d="M50 50V60" stroke-width="2"/>` +
    `<path d="M40 64l-6 -3M40 68l-7 1M60 64l6 -3M60 68l7 1M42 72l-5 5M58 72l5 5" stroke-width="3"/>` +
    `<circle cx="50" cy="70" r="10" fill="#3a3446"/>` +
    dot(46, 68, 2.4, '#fff') +
    dot(54, 68, 2.4, '#fff') +
    dot(46.3, 68.3, 1.2) +
    dot(54.3, 68.3, 1.2) +
    `<path d="M47 74q3 2 6 0" stroke="#fff" stroke-width="2"/>` +
    drop(80, 22, 0.55) +
    drop(20, 76, 0.55),

  지네:
    (() => {
      let s = '';
      const P: [number, number][] = [];
      for (let k = 0; k < 11; k++) {
        const x = 14 + k * 6.6;
        P.push([r1(x), r1(54 + 14 * Math.sin((k / 10) * Math.PI * 1.6 - 0.4))]);
      }
      for (let k = 0; k < 10; k++) {
        const [x, y] = P[k];
        s += `<path d="M${x} ${y}L${x - 3} ${y - 13}M${x} ${y}L${x - 3} ${y + 13}" stroke="#e8a040" stroke-width="3"/>`;
      }
      for (let k = 0; k < 10; k++) {
        const [x, y] = P[k];
        s += `<circle cx="${x}" cy="${y}" r="${k === 0 ? 6 : 7.5}" fill="${k % 2 ? '#c8642a' : '#d87a3a'}"/>`;
      }
      const [hx, hy] = P[10];
      s +=
        `<path d="M${hx + 4} ${hy - 8}Q${hx + 8} ${hy - 22} ${hx + 16} ${hy - 20}M${hx - 2} ${hy - 9}Q${hx - 2} ${hy - 24} ${hx + 4} ${hy - 28}" stroke-width="3"/>` +
        `<circle cx="${hx + 2}" cy="${hy}" r="11" fill="#e8553d"/>` +
        dot(hx - 1, hy - 2, 2.6, '#fff') +
        dot(hx + 6, hy - 2, 2.6, '#fff') +
        dot(hx - 0.7, hy - 1.6, 1.4) +
        dot(hx + 6.3, hy - 1.6, 1.4) +
        `<path d="M${hx} ${hy + 4}q3 2 6 0" stroke-width="2.2"/>` +
        cheeks(hy + 3, 7, hx + 2);
      return s;
    })(),

  번데기:
    tube('M8 14H92', '#9a5b2e', 6) +
    `<path d="M62 14C66 6 76 4 80 8C76 14 70 16 62 14Z" fill="#43b04a" stroke-width="3"/>` +
    `<path d="M50 14V22" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M50 22C64 24 70 40 66 58C64 72 58 84 52 92C44 84 36 72 34 58C30 40 36 24 50 22Z" fill="#b8864a"/>` +
    `<path d="M50 22C42 28 40 40 42 50C46 50 50 46 52 38C54 30 54 26 50 22Z" fill="#d8a868" stroke-width="2.5"/>` +
    `<path d="M36 60Q50 66 66 60M38 70Q50 76 63 70M42 80Q51 85 59 80" stroke="#7a5230" stroke-width="3"/>`,

  누에고치:
    `<path d="M6 80C20 60 60 56 94 70C80 90 30 96 6 80Z" fill="#5fc24a"/>` +
    `<path d="M14 80C40 74 64 72 88 72" stroke="#3a9e47" stroke-width="3"/>` +
    `<g transform="rotate(-12 70 42)">` +
    blob('#fff', [
      [62, 40, 11],
      [78, 40, 11],
    ]) +
    `<path d="M58 34l4 4M64 44l4 4M74 34l4 4M80 44l4 4" stroke="#c8ccd8" stroke-width="2.5"/>` +
    `</g>` +
    blob('#fff', [
      [34, 58, 15],
      [56, 58, 15],
    ]) +
    `<path d="M26 50l5 5M36 62l5 5M46 52l5 5M56 64l5 5M58 48l5 5M28 64l4 4" stroke="#c8ccd8" stroke-width="2.5"/>` +
    `<path d="M86 30q6 -8 2 -16M18 46q-8 -6 -6 -16" stroke="#c8ccd8" stroke-width="2"/>` +
    `<g fill="#f4f0e4" stroke-width="2.5"><circle cx="62" cy="80" r="4.5"/><circle cx="69" cy="79" r="5"/><circle cx="76" cy="77" r="5"/><circle cx="83" cy="74" r="5.5"/></g>` +
    dot(85, 73, 1.4),

  둥지:
    tube('M4 72L96 62', '#6b3e26', 6) +
    `<path d="M84 64C88 54 96 52 98 56C96 62 90 66 84 64Z" fill="#43b04a" stroke-width="3"/>` +
    `<ellipse cx="38" cy="44" rx="7" ry="9" fill="#9fd8e8"/><ellipse cx="52" cy="42" rx="7" ry="9" fill="#9fd8e8"/><ellipse cx="64" cy="45" rx="6.5" ry="8.5" fill="#9fd8e8"/>` +
    `<path d="M12 50Q50 60 88 50C86 76 72 86 50 86C28 86 14 76 12 50Z" fill="#b07a40"/>` +
    `<path d="M16 58C34 66 64 66 84 58M18 68C36 76 62 76 80 68M26 78C40 82 58 82 72 78" stroke="#6b4a2a" stroke-width="3"/>` +
    `<path d="M22 54l10 20M40 58l6 24M58 58l-4 24M76 54l-8 22" stroke="#6b4a2a" stroke-width="2.5"/>` +
    `<path d="M8 50C20 46 30 56 40 52M60 52C70 56 80 46 92 50" stroke="#9a5b2e" stroke-width="4"/>`,

  새알:
    `<path d="M10 80C30 72 70 72 90 80C80 92 20 92 10 80Z" fill="#e8c878"/>` +
    `<path d="M16 80l10 6M30 76l6 10M66 78l-4 10M80 78l-8 8" stroke="#b08a3a" stroke-width="2.5"/>` +
    `<ellipse cx="30" cy="58" rx="16" ry="21" fill="#9fd8e8"/>` +
    `<ellipse cx="68" cy="56" rx="16" ry="21" fill="#fff4e0"/>` +
    `<ellipse cx="49" cy="64" rx="17" ry="22" fill="#9fd8e8"/>` +
    `<g fill="#6b4a30" stroke="none"><circle cx="44" cy="54" r="2.2"/><circle cx="54" cy="62" r="2"/><circle cx="46" cy="72" r="2.4"/><circle cx="56" cy="76" r="1.8"/><circle cx="24" cy="50" r="2"/><circle cx="30" cy="64" r="1.8"/><circle cx="72" cy="46" r="2"/><circle cx="76" cy="60" r="2.2"/></g>` +
    `<path d="M42 50q2 -6 6 -8" stroke="#fff" stroke-width="3"/>`,

  개미집:
    `<path d="M4 34H96V94H4Z" fill="#d8a870" stroke="none"/>` +
    `<path d="M28 34C34 14 58 14 66 34Z" fill="#c8945a"/>` +
    `<path d="M4 34H28M66 34H96" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M47 22V40C47 48 30 50 30 60M47 44C54 50 68 50 70 60M30 66C30 74 44 78 50 82M70 66C72 74 62 80 56 82" stroke="#7a5230" stroke-width="7"/>` +
    `<ellipse cx="47" cy="22" rx="4" ry="3" fill="#7a5230"/>` +
    `<ellipse cx="24" cy="62" rx="12" ry="7" fill="#7a5230"/><ellipse cx="74" cy="62" rx="12" ry="7" fill="#7a5230"/><ellipse cx="52" cy="84" rx="16" ry="7" fill="#7a5230"/>` +
    `<g fill="#fff" stroke="none"><ellipse cx="46" cy="85" rx="3" ry="2"/><ellipse cx="53" cy="84" rx="3" ry="2"/><ellipse cx="60" cy="86" rx="3" ry="2"/></g>` +
    `<g fill="${INK}" stroke="none"><circle cx="20" cy="62" r="2.2"/><circle cx="25" cy="62" r="2.6"/><circle cx="30" cy="61.5" r="2.2"/><circle cx="70" cy="62" r="2.2"/><circle cx="75" cy="62" r="2.6"/><circle cx="80" cy="61.5" r="2.2"/><circle cx="41" cy="46" r="2"/><circle cx="45" cy="46" r="2.4"/></g>`,

  벌집:
    hex(34, 44, 13, HL) +
    hex(56.5, 44, 13, '#e8962e') +
    hex(45.2, 63.5, 13, HL) +
    hex(67.8, 63.5, 13, HL) +
    hex(22.7, 63.5, 13, '#e8962e') +
    hex(34, 83, 13, HL) +
    hex(56.5, 83, 13, HL) +
    `<path d="M50 90C50 94 54 96 54 90" fill="#e8962e" stroke-width="2.5"/>` +
    `<g transform="translate(78 22)">` +
    `<ellipse cx="-4" cy="-8" rx="7" ry="5" fill="#fff" opacity=".9" transform="rotate(-30 -4 -8)"/><ellipse cx="5" cy="-8" rx="7" ry="5" fill="#fff" opacity=".9" transform="rotate(30 5 -8)"/>` +
    `<ellipse cx="0" cy="2" rx="12" ry="9" fill="${HL}"/>` +
    `<path d="M-3 -6V10M4 -6V10" stroke="${INK}" stroke-width="3.5"/>` +
    dot(-7, 0, 1.8) +
    `</g>`,

  새장:
    `<path d="M50 8V14" stroke="#c89a30" stroke-width="3.5"/><circle cx="50" cy="8" r="4" fill="none" stroke="#c89a30"/>` +
    `<path d="M18 84V46C18 24 34 14 50 14S82 24 82 46V84Z" fill="#fdf3d8"/>` +
    tube('M28 64H72', '#9a5b2e', 3) +
    `<path d="M40 60L30 72L38 72L46 64Z" fill="#e8b830"/>` +
    `<ellipse cx="50" cy="54" rx="11" ry="10" fill="#ffd23f"/>` +
    `<circle cx="56" cy="44" r="7" fill="#ffd23f"/>` +
    `<path d="M62 43L67 45L62 47Z" fill="#ff9f1a" stroke-width="2"/>` +
    dot(57, 42, 1.8) +
    `<path d="M30 84V26M42 84V16M58 84V16M70 84V26" stroke="#c89a30" stroke-width="3"/>` +
    `<path d="M18 84V46C18 24 34 14 50 14S82 24 82 46V84" stroke="#c89a30" stroke-width="4.5"/>` +
    `<rect x="12" y="82" width="76" height="10" rx="3" fill="#c89a30"/>`,

  어항:
    `<path d="M26 22C8 36 8 70 24 84C34 94 66 94 76 84C92 70 92 36 74 22Z" fill="#e8f6ff"/>` +
    `<path d="M14 42C30 46 70 46 86 42C92 58 88 76 76 84C66 94 34 94 24 84C12 76 8 58 14 42Z" fill="#7ec8f0" stroke="none"/>` +
    `<path d="M14 42C30 46 70 46 86 42" stroke="#3b8fe0" stroke-width="3"/>` +
    `<path d="M22 84C28 78 40 80 50 82C62 80 72 78 78 84" fill="#c8b890" stroke-width="2.5"/>` +
    tube('M30 82C26 72 34 66 28 56', '#43b04a', 4) +
    `<path d="M68 62L78 54L78 70Z" fill="#ff9f1a"/>` +
    `<ellipse cx="56" cy="62" rx="14" ry="9" fill="#ff9f1a"/>` +
    dot(50, 60, 2.2) +
    `<circle cx="44" cy="52" r="2.5" fill="#fff" stroke-width="2"/><circle cx="40" cy="44" r="2" fill="#fff" stroke-width="2"/>` +
    `<path d="M26 22C8 36 8 70 24 84C34 94 66 94 76 84C92 70 92 36 74 22"/>` +
    `<ellipse cx="50" cy="22" rx="24" ry="5" fill="#e8f6ff"/>` +
    `<path d="M20 50C18 58 20 66 24 72" stroke="#fff" stroke-width="3.5"/>`,

  개집:
    `<path d="M20 44H80V88H20Z" fill="#c8864a"/>` +
    `<path d="M26 56H74M26 68H74M26 80H74" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M10 48L50 14L90 48L82 52L50 26L18 52Z" fill="#e8553d"/>` +
    `<path d="M36 88V70C36 58 64 58 64 70V88Z" fill="#3a2a20"/>` +
    `<ellipse cx="38" cy="76" rx="5" ry="10" fill="#9a5b2e" transform="rotate(20 38 76)"/><ellipse cx="62" cy="76" rx="5" ry="10" fill="#9a5b2e" transform="rotate(-20 62 76)"/>` +
    `<ellipse cx="50" cy="78" rx="12" ry="11" fill="#fff4e4"/>` +
    dot(45, 76, 2.4) +
    dot(55, 76, 2.4) +
    `<ellipse cx="50" cy="82" rx="3" ry="2" fill="${INK}"/>` +
    `<path d="M47 86q3 2 6 0" stroke-width="2"/>` +
    `<path d="M14 88H86" stroke="#43b04a" stroke-width="4"/>`,

  토끼장:
    `<path d="M22 78V92M78 78V92" stroke="#6b3e26" stroke-width="6"/>` +
    `<path d="M10 30L90 30L86 22L14 22Z" fill="#9a5b2e"/>` +
    `<rect x="14" y="30" width="72" height="50" rx="2" fill="#c8864a"/>` +
    `<rect x="22" y="36" width="56" height="38" fill="#fff7e0"/>` +
    `<ellipse cx="44" cy="46" rx="4" ry="11" fill="#fff" transform="rotate(-10 44 46)"/><ellipse cx="56" cy="46" rx="4" ry="11" fill="#fff" transform="rotate(10 56 46)"/>` +
    `<ellipse cx="50" cy="68" rx="15" ry="8" fill="#fff"/>` +
    `<circle cx="50" cy="60" r="9" fill="#fff"/>` +
    dot(46.5, 59, 1.8) +
    dot(53.5, 59, 1.8) +
    `<circle cx="50" cy="63" r="1.5" fill="#ff9aa8" stroke="none"/>` +
    `<path d="M30 36V74M38 36V74M62 36V74M70 36V74M22 46H78M22 56H40M60 56H78M22 66H78" stroke="#8a96b0" stroke-width="1.8"/>` +
    `<rect x="22" y="36" width="56" height="38"/>`,

  목줄:
    `<path d="M50 50C66 40 70 20 86 12" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M80 14C84 6 94 6 94 14C94 20 86 22 82 18Z" fill="${SKIN}"/>` +
    `<path d="M22 92C22 70 32 60 50 60S78 70 78 92Z" fill="#e8c890"/>` +
    `<ellipse cx="26" cy="38" rx="8" ry="15" fill="#9a5b2e" transform="rotate(20 26 38)"/><ellipse cx="74" cy="38" rx="8" ry="15" fill="#9a5b2e" transform="rotate(-20 74 38)"/>` +
    `<circle cx="50" cy="38" r="20" fill="#e8c890"/>` +
    `<ellipse cx="50" cy="46" rx="9" ry="7" fill="#fff4e4"/>` +
    dot(43, 34, 2.8) +
    dot(57, 34, 2.8) +
    `<ellipse cx="50" cy="42" rx="3.5" ry="2.5" fill="${INK}"/>` +
    `<path d="M46 48q4 3 8 0" stroke-width="2.2"/>` +
    `<path d="M30 56Q50 66 70 56" stroke="#e8553d" stroke-width="7"/>` +
    `<circle cx="50" cy="64" r="4" fill="${HL}" stroke-width="2.5"/>` +
    ring(50, 60, 26, 10),

  개밥그릇:
    `<g fill="#9a5b2e" stroke-width="2.5"><ellipse cx="34" cy="46" rx="7" ry="5"/><ellipse cx="48" cy="40" rx="7" ry="5"/><ellipse cx="62" cy="44" rx="7" ry="5"/><ellipse cx="42" cy="50" rx="7" ry="5"/><ellipse cx="58" cy="52" rx="7" ry="5"/><ellipse cx="70" cy="52" rx="6" ry="4.5"/><ellipse cx="28" cy="54" rx="6" ry="4.5"/></g>` +
    `<path d="M10 56H90L80 86H20Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="56" rx="40" ry="6" fill="#ff7a60"/>` +
    `<path d="M38 72H62" stroke-width="10"/><path d="M38 72H62" stroke="#fff" stroke-width="4"/>` +
    `<g fill="#fff"><circle cx="36" cy="68" r="3.8"/><circle cx="36" cy="76" r="3.8"/><circle cx="64" cy="68" r="3.8"/><circle cx="64" cy="76" r="3.8"/></g>` +
    `<path d="M38 72H62" stroke="#fff" stroke-width="5"/>` +
    `<path d="M16 88H84" stroke-width="3"/>`,

  발자국:
    foot(28, 82, -30, -1) + foot(44, 64, -20) + foot(56, 44, -30, -1) + foot(74, 24, -20),

  깃털:
    `<path d="M20 90L30 70" stroke-width="4"/>` +
    `<path d="M30 70C18 52 30 22 80 8C82 30 70 60 30 70Z" fill="#4a90e2"/>` +
    `<path d="M40 44L28 44M50 34L42 30" stroke="#fff7e0" stroke-width="4"/>` +
    `<path d="M30 70C44 54 60 32 80 8" stroke="#fff" stroke-width="3"/>` +
    `<path d="M40 56C48 54 58 50 64 44M34 50C36 40 42 30 50 24" stroke="#7ec8f0" stroke-width="3"/>`,

  비늘:
    FISH_TAIL +
    FISH_TOP +
    fishBody('#43b04a') +
    (() => {
      let s = '';
      for (const [y, xs] of [
        [40, [34, 44, 54, 64]],
        [50, [29, 39, 49, 59]],
        [60, [34, 44, 54, 64]],
      ] as [number, number[]][])
        for (const x of xs) s += `<path d="M${x} ${y - 6}A6 6 0 0 1 ${x} ${y + 6}" stroke="#bff0a0" stroke-width="3"/>`;
      return s;
    })() +
    fishBody('none') +
    FISH_FACE +
    ring(48, 50, 20, 15),

  뿔:
    `<path d="M34 30C26 20 24 8 32 4C32 14 36 20 42 24Z" fill="#f2e3c8"/>` +
    `<path d="M66 30C74 20 76 8 68 4C68 14 64 20 58 24Z" fill="#f2e3c8"/>` +
    `<ellipse cx="22" cy="42" rx="11" ry="6" fill="#b0703a" transform="rotate(20 22 42)"/><ellipse cx="78" cy="42" rx="11" ry="6" fill="#b0703a" transform="rotate(-20 78 42)"/>` +
    `<path d="M30 40C30 26 40 22 50 22S70 26 70 40L68 72C66 84 34 84 32 72Z" fill="#b0703a"/>` +
    `<ellipse cx="50" cy="74" rx="16" ry="11" fill="#e8c8a8"/>` +
    dot(44, 74, 2) +
    dot(56, 74, 2) +
    dot(41, 46, 3.2) +
    dot(59, 46, 3.2) +
    ring(33, 16, 12, 16) +
    ring(67, 16, 12, 16),

  날개:
    `<path d="M44 50C30 30 12 26 4 30C8 38 6 44 12 48C8 54 14 58 18 60C26 64 38 62 44 56Z" fill="#fff"/>` +
    `<path d="M56 50C70 30 88 26 96 30C92 38 94 44 88 48C92 54 86 58 82 60C74 64 62 62 56 56Z" fill="#fff"/>` +
    `<path d="M14 40q10 2 24 12M18 54q10 2 22 2M86 40q-10 2 -24 12M82 54q-10 2 -22 2" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M44 70L50 82L56 70Z" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="58" rx="9" ry="14" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="40" r="8" fill="#dfe8f5"/>` +
    `<path d="M47 43L50 48L53 43Z" fill="#ff9f1a" stroke-width="2"/>` +
    dot(46.5, 39, 1.6) +
    dot(53.5, 39, 1.6) +
    ring(24, 45, 22, 20) +
    ring(76, 45, 22, 20),

  부리:
    `<path d="M20 96C18 76 26 64 40 62" fill="#ffd23f" stroke="none"/>` +
    `<circle cx="42" cy="50" r="30" fill="#ffd23f"/>` +
    `<path d="M66 38C80 40 94 48 94 54C86 58 76 60 66 60Z" fill="#ff9f1a"/>` +
    `<path d="M68 50C78 50 88 52 94 54" stroke-width="3"/>` +
    eye(50, 40, 6, 3.4) +
    cheeks(56, 0, 40) +
    `<path d="M20 30C22 20 30 18 30 24" stroke-width="3"/>` +
    ring(80, 50, 17, 15),

  지느러미:
    FISH_TAIL +
    `<path d="M32 36C34 10 60 6 74 34Z" fill="#ff5c70"/>` +
    `<path d="M40 30L44 16M50 32L54 12M60 32L64 16" stroke="#fff" stroke-width="2.5"/>` +
    fishBody() +
    `<path d="M50 60C58 58 66 66 60 76C52 72 48 66 50 60Z" fill="#ff5c70"/>` +
    FISH_FACE +
    ring(52, 26, 26, 16),

  꼬리지느러미:
    `<path d="M28 52L4 24C2 42 2 62 4 80Z" fill="#ff5c70"/>` +
    `<path d="M20 44L8 34M20 52L6 52M20 60L8 70" stroke="#fff" stroke-width="2.5"/>` +
    FISH_TOP +
    fishBody() +
    FISH_PEC +
    FISH_FACE +
    ring(15, 52, 14, 30),

  아가미:
    FISH_TAIL +
    FISH_TOP +
    fishBody() +
    FISH_PEC +
    `<path d="M62 32C54 42 54 62 62 72" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M56 38C50 46 50 58 56 66" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M66 32C58 42 58 62 66 72" stroke-width="3.5"/>` +
    FISH_FACE +
    `<circle cx="92" cy="40" r="3" fill="#dff3ff" stroke-width="2.2"/><circle cx="94" cy="30" r="2.2" fill="#dff3ff" stroke-width="2"/>` +
    ring(60, 52, 12, 24),

  더듬이:
    `<path d="M42 36C36 22 28 14 18 12M58 36C64 22 72 14 82 12" stroke-width="4"/>` +
    `<circle cx="18" cy="12" r="5" fill="${INK}"/><circle cx="82" cy="12" r="5" fill="${INK}"/>` +
    `<ellipse cx="50" cy="84" rx="18" ry="12" fill="#8e4fc9"/>` +
    `<circle cx="50" cy="56" r="24" fill="#a45cf0"/>` +
    eye(40, 52, 7, 4) +
    eye(60, 52, 7, 4) +
    `<path d="M44 66q6 4 12 0" stroke-width="2.8"/>` +
    cheeks(62, 18) +
    ring(22, 16, 14, 12) +
    ring(78, 16, 14, 12),

  등껍질:
    `<ellipse cx="26" cy="74" rx="7" ry="9" fill="#8cc152"/><ellipse cx="68" cy="76" rx="7" ry="9" fill="#8cc152"/>` +
    `<path d="M12 64L4 68L12 70Z" fill="#8cc152"/>` +
    `<circle cx="84" cy="56" r="11" fill="#8cc152"/>` +
    dot(88, 53, 2.4) +
    `<path d="M86 61q3 2 5 0" stroke-width="2.2"/>` +
    `<path d="M12 66C12 34 30 22 48 22S78 34 78 66Z" fill="#3a9e47"/>` +
    `<path d="M36 36L48 30L60 36L60 50L48 56L36 50ZM36 50L24 58M60 50L72 58M48 56V66M36 36L28 30M60 36L68 30" stroke="#2a6e30" stroke-width="3"/>` +
    `<path d="M10 66H80" stroke-width="4"/>` +
    ring(45, 44, 40, 28),

  조개껍질:
    `<path d="M4 88C30 82 70 82 96 88V96H4Z" fill="#f2e0b0" stroke="none"/>` +
    `<path d="M34 80L28 88H52L46 80Z" fill="#ff9aa8"/>` +
    `<path d="${SHELL.d}" fill="#ffb8c6"/>` +
    `<path d="${SHELL.ribs}" stroke="#e85d9a" stroke-width="3"/>` +
    `<g transform="rotate(20 76 62)">` +
    `<path d="M66 50C72 34 84 34 86 48C88 62 80 80 72 86C66 76 62 62 66 50Z" fill="#f2c14e"/>` +
    `<path d="M68 52Q76 46 84 50M66 62Q76 56 86 60M68 72Q76 68 82 70" stroke="#b07a28" stroke-width="3"/>` +
    `</g>` +
    sparkle(86, 20, 5) +
    sparkle(14, 30, 4),

  갈기:
    blob('#b0603a', [
      [50, 18, 14],
      [30, 24, 14],
      [70, 24, 14],
      [18, 42, 14],
      [82, 42, 14],
      [18, 62, 13],
      [82, 62, 13],
      [30, 78, 13],
      [70, 78, 13],
      [50, 84, 13],
    ]) +
    `<circle cx="50" cy="52" r="24" fill="#ffc94d"/>` +
    `<circle cx="32" cy="32" r="5" fill="#ffc94d"/><circle cx="68" cy="32" r="5" fill="#ffc94d"/>` +
    dot(41, 48, 3) +
    dot(59, 48, 3) +
    `<ellipse cx="50" cy="62" rx="10" ry="8" fill="#fff4e4"/>` +
    `<path d="M46 56L54 56L50 60Z" fill="${INK}"/>` +
    `<path d="M50 60v3M45 65q5 3 10 0" stroke-width="2.5"/>` +
    ring(50, 52, 44, 44),

  발굽:
    `<path d="M22 36C12 38 10 50 12 60C16 52 18 46 24 44Z" fill="#5a3b24"/>` +
    legs([22, 31, 50, 59], 46, 9, 32, '#b0703a', '#3a2a20', 10) +
    `<ellipse cx="41" cy="42" rx="24" ry="13" fill="#b0703a"/>` +
    `<path d="M62 14L62 4L70 12Z" fill="#b0703a"/>` +
    `<path d="M52 40L58 20C60 12 68 8 74 12L88 26C91 30 88 36 83 35L73 32L68 48Z" fill="#b0703a"/>` +
    `<path d="M59 14C52 22 49 30 47 38L55 37C57 30 59 24 64 18Z" fill="#5a3b24"/>` +
    dot(71, 20, 2.8) +
    `<path d="M16 88H76" stroke="#9aa6c4" stroke-width="3"/>` +
    ring(32, 83, 16, 9) +
    ring(60, 83, 16, 9),

  프테라노돈:
    `<path d="M44 48C34 36 14 32 2 40C10 44 14 52 18 60C28 56 38 56 46 58Z" fill="#e8862e"/>` +
    `<path d="M56 48C66 36 86 32 98 40C90 44 86 52 82 60C72 56 62 56 54 58Z" fill="#e8862e"/>` +
    `<path d="M10 42L30 52M90 42L70 52" stroke="#b0602a" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="56" rx="9" ry="16" fill="#ff9f1a"/>` +
    `<path d="M44 70L40 78M56 70L60 78" stroke-width="3.5"/>` +
    `<path d="M50 34L82 26L52 44Z" fill="#ffd23f"/>` +
    `<path d="M48 36L26 12L42 34Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="38" r="9" fill="#ff9f1a"/>` +
    dot(53, 36, 2.8, '#fff') +
    dot(53.5, 36.3, 1.5),

  라쿤:
    `<path d="M66 82C86 80 94 64 90 48C88 42 84 42 82 48C84 60 80 70 66 74Z" fill="#8a8a96"/>` +
    `<path d="M91 54L83 54M89 64L80 62M84 72L76 68" stroke="#2e2a38" stroke-width="5"/>` +
    `<path d="M30 92C30 74 38 64 50 64S70 74 70 92Z" fill="#8a8a96"/>` +
    `<path d="M40 92C40 80 44 74 50 74S60 80 60 92Z" fill="#dfe0e6" stroke="none"/>` +
    `<path d="M24 34L22 12L40 24Z" fill="#8a8a96"/><path d="M76 34L78 12L60 24Z" fill="#8a8a96"/>` +
    `<ellipse cx="50" cy="44" rx="28" ry="23" fill="#9a9aa6"/>` +
    `<path d="M26 36C34 32 42 34 48 42C44 50 34 50 26 46Z" fill="#fff" stroke="none"/>` +
    `<path d="M74 36C66 32 58 34 52 42C56 50 66 50 74 46Z" fill="#fff" stroke="none"/>` +
    `<path d="M24 46C30 40 40 40 48 48C44 56 32 56 24 50ZM76 46C70 40 60 40 52 48C56 56 68 56 76 50Z" fill="#2e2a38" stroke="none"/>` +
    dot(38, 48, 2.8, '#fff') +
    dot(62, 48, 2.8, '#fff') +
    `<ellipse cx="50" cy="58" rx="9" ry="7" fill="#fff"/>` +
    `<ellipse cx="50" cy="55" rx="3.5" ry="2.5" fill="${INK}"/>` +
    `<path d="M46 61q4 3 8 0" stroke-width="2.2"/>`,

  바다표범:
    `<path d="M4 84C20 76 80 76 96 84L92 94H8Z" fill="#dff3ff"/>` +
    `<path d="M16 72L4 64L6 78Z" fill="#7a8298"/>` +
    `<path d="M14 72C14 56 34 50 56 52C68 52 74 60 76 70C74 80 30 84 14 72Z" fill="#9aa2b4"/>` +
    `<path d="M40 74C44 80 50 82 56 80C52 74 46 72 40 74Z" fill="#7a8298"/>` +
    `<circle cx="72" cy="48" r="17" fill="#9aa2b4"/>` +
    `<g fill="#5a6280" stroke="none"><circle cx="30" cy="62" r="2.5"/><circle cx="40" cy="58" r="2"/><circle cx="50" cy="64" r="2.5"/><circle cx="34" cy="70" r="2"/><circle cx="60" cy="58" r="2"/><circle cx="64" cy="38" r="1.8"/></g>` +
    eye(68, 44, 4.5, 3.2) +
    eye(80, 44, 4.5, 3.2) +
    `<ellipse cx="76" cy="54" rx="7" ry="5" fill="#c8ccd8"/>` +
    dot(76, 52, 2.2) +
    `<path d="M70 56L60 58M70 54L60 52M82 56L92 58M82 54L92 52" stroke-width="1.8"/>`,

  플라밍고:
    `<path d="M48 64L48 94M48 72L60 70L54 60" stroke="#ff7a9a" stroke-width="4"/>` +
    `<path d="M24 50L10 46L16 56Z" fill="#ff7a9a"/>` +
    `<ellipse cx="42" cy="54" rx="22" ry="14" fill="#ff9aa8"/>` +
    `<path d="M30 50q10 -6 22 0" stroke="#ff5c70" stroke-width="3"/>` +
    tube('M58 50C70 40 58 30 58 22C58 12 68 8 74 14', '#ff9aa8', 7) +
    `<circle cx="70" cy="14" r="7" fill="#ff9aa8"/>` +
    `<path d="M74 12C82 12 86 18 84 26C82 22 80 20 76 20Z" fill="#fff"/>` +
    `<path d="M84 26C82 22 81 21 79 20L83 18C85 20 85 23 84 26Z" fill="${INK}" stroke-width="2"/>` +
    dot(70, 12, 2),

  공작새:
    (() => {
      let s = `<path d="M50 70L8 52C4 26 24 6 50 6S96 26 92 52Z" fill="#3a9e47"/>`;
      for (const a of [-160, -130, -105, -75, -50, -20]) {
        const [x0, y0] = pt(50, 70, 18, a);
        const [x1, y1] = pt(50, 70, 50, a);
        s += `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="#2a7a34" stroke-width="2.5"/>`;
      }
      for (const [r, as] of [
        [50, [-160, -135, -110, -90, -70, -45, -20]],
        [32, [-145, -115, -65, -35]],
      ] as [number, number[]][])
        for (const a of as) {
          const [x, y] = pt(50, 70, r, a);
          s += `<circle cx="${x}" cy="${y}" r="6" fill="${HL}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3" fill="#3b58c8" stroke="none"/>`;
        }
      s +=
        `<path d="M42 92L42 84M56 92L56 84" stroke="#8a96b0" stroke-width="3.5"/>` +
        `<ellipse cx="49" cy="74" rx="12" ry="12" fill="#3b78e6"/>` +
        tube('M50 66C48 56 50 48 52 42', '#3b78e6', 7) +
        `<circle cx="53" cy="40" r="7" fill="#3b78e6"/>` +
        `<path d="M50 32L48 24M53 32L54 24M56 33L60 26" stroke-width="2"/>` +
        dot(48, 24, 2.2, '#3b78e6') +
        dot(54, 24, 2.2, '#3b78e6') +
        dot(60, 26, 2.2, '#3b78e6') +
        `<path d="M59 39L64 41L59 43Z" fill="#8a96b0" stroke-width="2"/>` +
        dot(55, 38, 1.8, '#fff') +
        dot(55.3, 38.3, 1);
      return s;
    })(),

  바닷가재:
    `<path d="M40 44C28 36 16 34 6 40M60 44C72 36 84 34 94 40" stroke="#8e2a24" stroke-width="2.5"/>` +
    ['M42 56L30 60L26 66', 'M42 62L30 68L28 74', 'M58 56L70 60L74 66', 'M58 62L70 68L72 74']
      .map((d) => tube(d, '#c83a28', 2.5))
      .join('') +
    tube('M42 46L28 40', '#c83a28', 6) +
    tube('M58 46L72 40', '#c83a28', 6) +
    `<path d="M30 42C12 50 2 34 8 16L16 26L20 12C34 18 38 36 30 42Z" fill="#c83a28"/>` +
    `<path d="M70 42C88 50 98 34 92 16L84 26L80 12C66 18 62 36 70 42Z" fill="#c83a28"/>` +
    `<path d="M50 90L38 98L46 98L50 94L54 98L62 98Z" fill="#c83a28"/>` +
    `<ellipse cx="50" cy="88" rx="7" ry="4.5" fill="#c83a28"/><ellipse cx="50" cy="81" rx="8.5" ry="4.5" fill="#c83a28"/><ellipse cx="50" cy="74" rx="10" ry="4.5" fill="#c83a28"/>` +
    `<ellipse cx="50" cy="54" rx="12" ry="17" fill="#c83a28"/>` +
    `<path d="M44 58q6 3 12 0" stroke="#8e2a24" stroke-width="2.5"/>` +
    eye(44, 44, 3.8, 2.2) +
    eye(56, 44, 3.8, 2.2),
};
