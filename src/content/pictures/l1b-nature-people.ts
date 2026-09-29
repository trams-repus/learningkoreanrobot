// 그림 묶음: 자연(날씨·꽃·나무·물가)과 사람(가족·직업·이야기 속 인물). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, blob, sparkle, tube, drop, cheeks, person, halo } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);

/** 별 (x, y 가운데, r 바깥 반지름) */
function star(x: number, y: number, r: number, fill: string, sw = 3): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

/** 손 */
const hand = (x: number, y: number, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`;

/** 음표 (가수) */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 둥근 원 꽃잎 여럿 (가운데 cx, cy에서 d만큼 떨어진 n장) */
function petals(cx: number, cy: number, n: number, d: number, rx: number, ry: number, fill: string, turn = 0, sw = 3): string {
  return Array.from({ length: n }, (_, k) => {
    const a = turn + (k * 360) / n;
    const rad = (a * Math.PI) / 180;
    const x = f1(cx + d * Math.cos(rad));
    const y = f1(cy + d * Math.sin(rad));
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="${sw}" transform="rotate(${f1(a)} ${x} ${y})"/>`;
  }).join('');
}

/** 끝이 갈라진 벚꽃 꽃잎 다섯 장 */
function blossom(x: number, y: number, s: number, fill: string): string {
  const petal = `<path d="M0 0C-8 -3 -11 -12 -7 -17L0 -14L7 -17C11 -12 8 -3 0 0Z" fill="${fill}"/>`;
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3 / s)}">` +
    [0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})">${petal}</g>`).join('') +
    `<circle cx="0" cy="0" r="3.5" fill="#e85d9a" stroke="none"/>` +
    `</g>`
  );
}

/** 잎 한 장 (낙엽·열매): x, y 가운데, rot 기울기 */
function leaf(x: number, y: number, rot: number, fill: string, s = 1, vein = '#6b3e26'): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" stroke-width="${f1(3 / s)}">` +
    `<path d="M0 -14C9 -8 9 8 0 14C-9 8 -9 -8 0 -14Z" fill="${fill}"/>` +
    `<path d="M0 -10V17" stroke="${vein}" stroke-width="${f1(2.5 / s)}"/>` +
    `</g>`
  );
}

/** 뾰족뾰족 솔잎 덩어리 */
function needles(cx: number, cy: number, rx: number, ry: number, fill: string): string {
  const n = 26;
  const pts = Array.from({ length: n }, (_, k) => {
    const a = (k * 2 * Math.PI) / n;
    const m = k % 2 ? 0.8 : 1;
    return `${f1(cx + rx * m * Math.cos(a))} ${f1(cy + ry * m * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}"/>`;
}

/** 고드름 한 개 */
const icicle = (x: number, w: number, len: number) =>
  `<path d="M${x - w} 28L${x} ${28 + len}L${x + w} 28Z" fill="#bfe6ff"/>` +
  `<path d="M${x - w / 2 + 1} 32L${x - 1} ${28 + len * 0.6}" stroke="#fff" stroke-width="2.5"/>`;

/** 소용돌이 선 (태풍) */
const spiral = (() => {
  const pts: string[] = [];
  const turns = 2.6;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = 4 + (36 * i) / steps;
    pts.push(`${f1(50 + r * Math.cos(t))} ${f1(50 + r * Math.sin(t))}`);
  }
  return `M${pts.join('L')}`;
})();

export const PICS: Record<string, string> = {
  // ── 날씨·하늘 ──
  안개:
    `<rect x="6" y="8" width="88" height="84" rx="14" fill="#c9d3e6"/>` +
    `<path d="M8 84C24 72 70 70 92 80V86H8Z" fill="#8fbf8f" stroke="none"/>` +
    `<rect x="26" y="46" width="8" height="32" fill="#a08670" stroke="none"/>` +
    `<g fill="#7fb489" stroke="none"><circle cx="30" cy="34" r="16"/><circle cx="20" cy="46" r="10"/><circle cx="40" cy="46" r="10"/></g>` +
    `<path d="M56 78V52L71 38L86 52V78Z" fill="#d9b99a" stroke="none"/><path d="M52 54L71 34L90 54" stroke="#b0907a" stroke-width="5"/>` +
    `<g fill="#f7f9fd" stroke="#9aa6c4" stroke-width="3">` +
    `<path d="M4 28H64a7 7 0 0 1 0 14H4Z"/><path d="M96 52H34a7 7 0 0 0 0 14H96Z"/><path d="M4 72H72a7 7 0 0 1 0 14H4Z"/></g>` +
    `<rect x="6" y="8" width="88" height="84" rx="14"/>`,
  태풍:
    `<circle cx="50" cy="50" r="44" fill="#dfe8f5" stroke="none"/>` +
    tube(spiral, '#4a90e2', 8) +
    `<circle cx="50" cy="50" r="6" fill="#fff"/>` +
    leaf(86, 22, 40, '#43b04a', 0.6, '#2a7a34') +
    leaf(14, 80, -30, '#43b04a', 0.55, '#2a7a34'),
  고드름:
    `<path d="M4 10H96V28H4Z" fill="#e8553d"/>` +
    `<path d="M4 20H96M20 10V20M40 10V20M60 10V20M80 10V20M30 20V28M50 20V28M70 20V28" stroke="#b8322a" stroke-width="2.5"/>` +
    `<path d="M4 4C14 10 22 2 32 7S50 3 60 7 80 3 96 6V12H4Z" fill="#fff"/>` +
    icicle(15, 6, 36) +
    icicle(32, 7, 58) +
    icicle(50, 8, 66) +
    icicle(68, 6, 46) +
    icicle(85, 7, 56) +
    drop(68, 80, 0.7),
  노을:
    `<rect x="6" y="8" width="88" height="84" rx="14" fill="#e8862e"/>` +
    `<path d="M6 22C6 14 12 8 20 8H80C88 8 94 14 94 22V32H6Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M6 46H94V60H6Z" fill="#ffb35c" stroke="none"/>` +
    `<path d="M32 60A18 18 0 0 1 68 60Z" fill="#ffe066"/>` +
    `<path d="M6 60H94V78C94 86 88 92 80 92H20C12 92 6 86 6 78Z" fill="#3b5aa8"/>` +
    `<path d="M36 67H64M42 75H58M47 83H53" stroke="#ffb35c" stroke-width="4"/>` +
    `<path d="M18 22q4-4 8 0q4-4 8 0M64 30q3-3 6 0q3-3 6 0" stroke-width="2.5"/>` +
    `<rect x="6" y="8" width="88" height="84" rx="14"/>`,
  별똥별:
    `<rect x="6" y="6" width="88" height="88" rx="14" fill="#26356b"/>` +
    tube('M58 42L14 84', '#ffd23f', 8) +
    tube('M52 36L22 58', '#ff9f1a', 4) +
    tube('M64 48L42 80', '#ff9f1a', 4) +
    star(64, 36, 22, '#ffd23f') +
    sparkle(20, 20, 5, '#fff') +
    sparkle(84, 76, 5, '#fff') +
    sparkle(34, 34, 3, '#fff') +
    sparkle(76, 88, 3, '#fff'),
  지구:
    sparkle(10, 14, 5) +
    sparkle(90, 86, 5) +
    `<circle cx="50" cy="50" r="40" fill="#3b8fe0"/>` +
    `<path d="M30 20C38 16 46 20 44 28C42 34 34 34 34 40C34 48 42 52 40 60C38 68 30 70 28 62C26 54 20 50 18 42C16 32 22 24 30 20Z" fill="#43b04a"/>` +
    `<path d="M60 28C66 24 76 28 80 36C84 44 78 48 72 48C66 48 70 58 66 66C62 74 54 72 54 64C54 56 58 52 56 46C54 38 54 32 60 28Z" fill="#43b04a"/>` +
    `<path d="M56 80C62 76 72 78 70 82C66 86 58 86 56 80Z" fill="#43b04a"/>` +
    `<path d="M20 70q6-4 12 0M62 16q5-3 10 0M76 58q4-3 8 0" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M22 34C26 24 32 18 40 14" stroke="#9fd0ff" stroke-width="3" opacity=".6"/>`,

  // ── 풀·나무·꽃 ──
  잔디:
    `<path d="M6 80H94V88C94 91 92 93 89 93H11C8 93 6 91 6 88Z" fill="#9a5b2e"/>` +
    `<path d="M6 80V40L12 56L18 26L24 52L30 34L36 54L42 22L48 50L54 30L60 54L66 24L72 50L78 34L84 54L90 28L94 46V80Z" fill="#5fc24a"/>` +
    `<path d="M10 80L14 62L20 72L26 58L32 74L38 60L44 72L50 56L56 74L62 60L68 72L74 56L80 72L86 60L90 80Z" fill="#43b04a"/>` +
    `<path d="M16 88h4M34 86h4M58 88h4M76 86h4" stroke="#6b3e26" stroke-width="2.5"/>`,
  나뭇잎:
    `<g transform="rotate(25 50 50)">` +
    tube('M50 80V96', '#3a9e47', 4) +
    `<path d="M50 6C76 22 82 56 50 84C18 56 24 22 50 6Z" fill="#5fc24a"/>` +
    `<g stroke="#2a7a34" stroke-width="3"><path d="M50 14V84"/><path d="M50 36L36 26M50 36L64 26M50 54L32 42M50 54L68 42M50 70L38 62M50 70L62 62"/></g>` +
    `</g>`,
  나뭇가지:
    tube('M34 62L28 36', '#9a5b2e', 5) +
    tube('M56 46L72 58', '#9a5b2e', 5) +
    tube('M70 36L62 14', '#9a5b2e', 4) +
    tube('M26 70L10 64', '#9a5b2e', 4) +
    tube('M8 90L92 18', '#9a5b2e', 9) +
    leaf(28, 30, -10, '#5fc24a', 0.7, '#2a7a34') +
    leaf(78, 62, 120, '#5fc24a', 0.7, '#2a7a34') +
    leaf(62, 10, -20, '#5fc24a', 0.6, '#2a7a34') +
    leaf(92, 14, 50, '#5fc24a', 0.6, '#2a7a34'),
  뿌리:
    `<path d="M4 34H96V88C96 92 94 94 90 94H10C6 94 4 92 4 88Z" fill="#9a5b2e"/>` +
    `<path d="M4 34H96"/>` +
    tube('M50 34V10', '#43b04a', 4) +
    `<path d="M50 16C42 18 32 14 30 4C40 2 48 8 50 16Z" fill="#5fc24a"/><path d="M50 14C58 16 68 12 70 2C60 0 52 6 50 14Z" fill="#5fc24a"/>` +
    tube('M50 36C50 52 48 66 50 86', '#f2d49a', 6) +
    tube('M50 46C40 50 30 54 22 66', '#f2d49a', 4) +
    tube('M50 50C60 54 70 58 78 70', '#f2d49a', 4) +
    tube('M49 64C42 70 36 76 32 86', '#f2d49a', 3) +
    tube('M50 66C58 72 64 78 66 88', '#f2d49a', 3) +
    tube('M30 58L20 54M72 62L84 58', '#f2d49a', 2.5) +
    dot(14, 82, 3, '#6b3e26') +
    dot(86, 84, 3, '#6b3e26') +
    dot(84, 44, 2.5, '#6b3e26'),
  새싹:
    `<path d="M8 92C12 70 88 70 92 92Z" fill="#9a5b2e"/>` +
    tube('M50 78V44', '#43b04a', 5) +
    `<path d="M50 46C46 28 24 22 10 32C18 50 40 54 50 46Z" fill="#5fc24a"/>` +
    `<path d="M50 46C54 28 76 22 90 32C82 50 60 54 50 46Z" fill="#5fc24a"/>` +
    `<path d="M46 42C38 36 28 34 20 34M54 42C62 36 72 34 80 34" stroke="#2a7a34" stroke-width="2.5"/>` +
    sparkle(22, 14, 5) +
    sparkle(80, 12, 5),
  튤립:
    tube('M50 54V94', '#43b04a', 6) +
    `<path d="M50 92C34 86 22 68 24 48C38 58 48 72 50 92Z" fill="#43b04a"/>` +
    `<path d="M50 86C64 80 76 62 76 44C62 54 52 68 50 86Z" fill="#43b04a"/>` +
    `<path d="M38 34C38 20 44 10 50 4C56 10 62 20 62 34Z" fill="#c62f3f"/>` +
    `<path d="M50 60C34 60 26 48 28 30C28 22 32 14 36 10C44 20 50 34 50 60Z" fill="#e8553d"/>` +
    `<path d="M50 60C66 60 74 48 72 30C72 22 68 14 64 10C56 20 50 34 50 60Z" fill="#ff5c70"/>`,
  민들레:
    tube('M50 48V92', '#43b04a', 5) +
    `<path d="M50 92L30 90L36 85L20 82L30 77L14 70C30 70 42 78 50 92Z" fill="#43b04a"/>` +
    `<path d="M50 92L70 90L64 85L80 82L70 77L86 70C70 70 58 78 50 92Z" fill="#43b04a"/>` +
    petals(50, 32, 16, 20, 9, 4, '#ffd23f', 0, 2.5) +
    petals(50, 32, 12, 12, 7, 3.5, '#ffc933', 15, 2.5) +
    `<circle cx="50" cy="32" r="7" fill="#f2b21e" stroke-width="2.5"/>`,
  개나리:
    tube('M10 92C14 64 30 40 58 22', '#8a5a34', 4) +
    tube('M22 92C34 70 56 56 90 50', '#8a5a34', 4) +
    tube('M30 56C40 58 50 66 56 78', '#8a5a34', 3) +
    [
      [20, 66, 0],
      [30, 46, 20],
      [44, 32, 40],
      [60, 20, 10],
      [36, 76, 30],
      [52, 62, 0],
      [70, 52, 25],
      [88, 48, 10],
      [56, 80, 45],
      [42, 58, 15],
    ]
      .map(([x, y, t]) => petals(x, y, 4, 5, 6, 3.8, '#ffd23f', t, 2.2) + dot(x, y, 1.6, '#e8862e'))
      .join(''),
  진달래:
    tube('M6 92C30 70 50 60 94 56', '#6b3e26', 4) +
    tube('M40 70C40 56 34 46 26 38', '#6b3e26', 3) +
    [
      [26, 30, 1],
      [60, 36, 1.15],
      [82, 70, 0.9],
    ]
      .map(
        ([x, y, s]) =>
          petals(x, y, 5, 9 * s, 10 * s, 8 * s, '#e85d9a', -90, 3) +
          `<circle cx="${x}" cy="${y}" r="${f1(6 * s)}" fill="#f7a8cb" stroke="none"/>` +
          `<path d="M${x} ${y}q${f1(4 * s)} ${f1(8 * s)} ${f1(10 * s)} ${f1(10 * s)}M${x} ${y}q${f1(-2 * s)} ${f1(9 * s)} ${f1(2 * s)} ${f1(14 * s)}" stroke="#a02c68" stroke-width="2"/>` +
          dot(x + 10 * s, y + 10 * s, 1.8, '#a02c68') +
          dot(x + 2 * s, y + 14 * s, 1.8, '#a02c68'),
      )
      .join(''),
  벚꽃:
    tube('M4 80C30 70 50 56 96 22', '#6b3e26', 6) +
    tube('M44 62C38 50 36 40 38 30', '#6b3e26', 3) +
    blossom(54, 46, 1.9, '#ffc4d4') +
    blossom(26, 28, 1.3, '#ffc4d4') +
    blossom(82, 44, 1.2, '#ffc4d4') +
    blossom(20, 74, 1, '#ffc4d4') +
    `<ellipse cx="72" cy="80" rx="4" ry="2.5" fill="#ffc4d4" stroke-width="2" transform="rotate(30 72 80)"/>` +
    `<ellipse cx="48" cy="88" rx="4" ry="2.5" fill="#ffc4d4" stroke-width="2" transform="rotate(-20 48 88)"/>`,
  무궁화:
    `<path d="M18 86C8 72 12 56 24 50C28 64 26 76 18 86Z" fill="#43b04a"/>` +
    `<path d="M84 88C94 76 92 60 80 54C76 66 76 80 84 88Z" fill="#43b04a"/>` +
    petals(50, 48, 5, 20, 19, 16, '#ff9aa8', -90, 3.5) +
    star(50, 48, 14, '#c62f3f', 0) +
    `<circle cx="50" cy="48" r="6" fill="#c62f3f" stroke="none"/>` +
    tube('M50 48L60 32', '#fff', 3) +
    `<circle cx="61" cy="30" r="4" fill="#ffd23f" stroke-width="2.5"/>`,
  연꽃:
    `<path d="M4 66C20 62 80 62 96 66V88C96 92 94 94 90 94H10C6 94 4 92 4 88Z" fill="#3b8fe0"/>` +
    `<path d="M14 80q6-4 12 0M70 84q6-4 12 0M40 88q6-4 12 0" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M4 72C4 64 22 62 28 70L18 72L22 78C12 80 4 78 4 72Z" fill="#43b04a"/>` +
    `<path d="M96 72C96 64 78 62 72 70L82 72L78 78C88 80 96 78 96 72Z" fill="#43b04a"/>` +
    [-58, 58, -30, 30, 0]
      .map(
        (a) =>
          `<path d="M50 70C38 58 38 30 50 12C62 30 62 58 50 70Z" fill="${Math.abs(a) > 40 ? '#f07fae' : '#ff9aa8'}" transform="rotate(${a} 50 70)"/>`,
      )
      .join('') +
    `<path d="M50 72C34 72 26 62 24 54C36 54 46 60 50 72Z" fill="#ffc4d4"/><path d="M50 72C66 72 74 62 76 54C64 54 54 60 50 72Z" fill="#ffc4d4"/>`,
  나팔꽃:
    tube('M20 94C14 80 30 72 26 58C22 46 34 40 40 50', '#43b04a', 4) +
    tube('M26 60C44 64 60 72 70 64', '#43b04a', 3) +
    `<path d="M16 84C6 82 4 70 10 66C14 70 18 70 22 66C26 72 24 82 16 84Z" fill="#43b04a"/>` +
    `<path d="M40 82C32 78 34 68 40 66C42 70 46 70 50 68C52 76 48 82 40 82Z" fill="#43b04a"/>` +
    `<path d="M70 64L78 76" stroke-width="3"/><path d="M76 72L86 92C80 94 72 90 70 84Z" fill="#a45cf0"/>` +
    `<circle cx="54" cy="34" r="28" fill="#8e4fc9"/>` +
    `<path d="M54 34L54 8M54 34L79 26M54 34L70 56M54 34L38 56M54 34L29 26" stroke="#c9a0f0" stroke-width="3"/>` +
    `<circle cx="54" cy="34" r="9" fill="#fff"/>` +
    dot(54, 34, 3, '#ffd23f'),
  클로버:
    tube('M50 50C54 66 56 80 66 94', '#3a9e47', 5) +
    [0, 90, 180, 270]
      .map(
        (a) =>
          `<g transform="translate(50 46) rotate(${a + 45})"><path d="M0 0C-16 -8 -20 -24 -11 -31C-5 -35 -1 -32 0 -27C1 -32 5 -35 11 -31C20 -24 16 -8 0 0Z" fill="#43b04a"/>` +
          `<path d="M-7 -20L0 -13L7 -20" stroke="#9be08f" stroke-width="3"/></g>`,
      )
      .join('') +
    sparkle(86, 14, 6) +
    sparkle(14, 86, 5),
  대나무:
    `<path d="M4 94H96" stroke="#9a5b2e"/>` +
    [
      [24, 24, 12],
      [50, 6, 14],
      [76, 18, 12],
    ]
      .map(
        ([x, top, w]) =>
          `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${94 - top}" rx="4" fill="#5fc24a"/>` +
          [0, 1, 2, 3]
            .map((k) => top + 16 + k * 20)
            .filter((y) => y < 90)
            .map((y) => `<path d="M${x - w / 2} ${y}H${x + w / 2}" stroke-width="4"/>`)
            .join(''),
      )
      .join('') +
    `<path d="M56 26C66 18 78 14 86 14C80 22 68 26 56 26Z" fill="#3a9e47"/>` +
    `<path d="M44 46C34 40 24 38 14 40C22 46 34 48 44 46Z" fill="#3a9e47"/>` +
    `<path d="M82 58C88 50 94 46 98 44C96 52 90 58 82 58Z" fill="#3a9e47"/>` +
    `<path d="M18 60C12 54 8 48 4 46C4 54 10 60 18 60Z" fill="#3a9e47"/>`,
  소나무:
    tube('M50 94C52 80 44 70 48 56C52 44 56 38 54 26', '#a0522d', 8) +
    tube('M49 60C40 58 32 56 26 50', '#a0522d', 5) +
    tube('M52 44C60 42 68 40 74 34', '#a0522d', 5) +
    needles(26, 46, 22, 10, '#2f8a3a') +
    needles(74, 32, 22, 10, '#2f8a3a') +
    needles(52, 18, 24, 12, '#3a9e47') +
    needles(62, 58, 18, 8, '#3a9e47') +
    `<ellipse cx="34" cy="62" rx="4.5" ry="6" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M20 94H80" stroke="#6b3e26"/>`,
  야자수:
    `<path d="M4 84C20 78 80 78 96 84V94H4Z" fill="#3b8fe0"/>` +
    `<path d="M18 86C22 72 70 70 78 86Z" fill="#ffe2a0"/>` +
    tube('M42 80C40 62 44 40 56 24', '#b5793a', 9) +
    `<path d="M40 70l7 1M40 58l7 2M43 46l7 3M48 36l6 3" stroke="#7a4f24" stroke-width="2.5"/>` +
    `<path d="M56 24C42 14 22 18 12 34C28 26 42 26 56 24Z" fill="#43b04a"/>` +
    `<path d="M56 24C50 8 36 2 22 6C36 10 46 16 56 24Z" fill="#5fc24a"/>` +
    `<path d="M56 24C62 6 78 2 92 8C78 10 66 16 56 24Z" fill="#43b04a"/>` +
    `<path d="M56 24C72 20 88 28 94 44C82 34 68 28 56 24Z" fill="#5fc24a"/>` +
    `<path d="M56 24C56 34 50 46 40 52C44 40 50 32 56 24Z" fill="#3a9e47"/>` +
    `<circle cx="52" cy="30" r="5" fill="#6b3e26"/><circle cx="61" cy="30" r="5" fill="#6b3e26"/><circle cx="57" cy="36" r="5" fill="#6b3e26"/>`,
  단풍:
    tube('M50 70V94', '#9a3a22', 4) +
    `<path d="M50 6L57 24L72 16L68 36L92 34L80 50L88 60L66 64L70 76L54 70L50 74L46 70L30 76L34 64L12 60L20 50L8 34L32 36L28 16L43 24Z" fill="#e8553d"/>` +
    `<path d="M50 72V18M50 60L78 40M50 60L22 40M50 64L64 70M50 64L36 70M50 44L64 26M50 44L36 26" stroke="#b8322a" stroke-width="2.5"/>`,
  낙엽:
    `<path d="M16 22q8 6 4 14M52 10q8 6 2 14M80 34q-6 6 0 12" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 5"/>` +
    leaf(26, 46, -40, '#ff9f1a', 1.1) +
    leaf(58, 36, 30, '#e8553d', 1.1) +
    leaf(80, 60, -70, '#f2c14e', 1) +
    `<path d="M10 92C14 80 30 76 50 78C70 76 86 80 90 92Z" fill="#b5793a"/>` +
    leaf(30, 82, 70, '#e8862e', 0.8) +
    leaf(50, 80, -80, '#ffd23f', 0.8) +
    leaf(70, 84, 60, '#e8553d', 0.8),
  솔방울:
    tube('M50 12V4', '#6b3e26', 4) +
    `<path d="M50 10C70 10 80 30 76 52C72 74 60 90 50 94C40 90 28 74 24 52C20 30 30 10 50 10Z" fill="#8a5a34"/>` +
    [
      [22, [38, 50, 62]],
      [36, [32, 44, 56, 68]],
      [50, [30, 42, 54, 66]],
      [64, [34, 46, 58, 70]],
      [78, [40, 50, 60]],
    ]
      .map(([y, xs]) =>
        (xs as number[])
          .map((x) => `<path d="M${x - 6} ${y}C${x - 6} ${(y as number) + 10} ${x + 6} ${(y as number) + 10} ${x + 6} ${y}Z" fill="#c98f52" stroke-width="2.5"/>`)
          .join(''),
      )
      .join(''),

  // ── 땅·물 ──
  웅덩이:
    `<path d="M4 88H96" stroke="#c9b28a"/>` +
    `<path d="M8 70C6 56 30 50 50 52C74 50 96 56 92 70C90 84 64 90 46 88C24 88 10 84 8 70Z" fill="#7ec8f0"/>` +
    `<ellipse cx="40" cy="70" rx="10" ry="4" stroke="#fff" stroke-width="3"/><ellipse cx="40" cy="70" rx="20" ry="9" stroke="#fff" stroke-width="2.5"/>` +
    `<ellipse cx="70" cy="64" rx="7" ry="3" stroke="#fff" stroke-width="2.5"/>` +
    drop(40, 30, 1.1) +
    drop(70, 20, 1.1) +
    drop(22, 12, 0.9) +
    `<circle cx="84" cy="14" r="8" fill="#ffd23f"/>`,
  조약돌:
    [
      [28, 80, 18, 11, '#b4bdd0'],
      [66, 80, 20, 12, '#d9c2a0'],
      [48, 62, 17, 11, '#8a96b0'],
      [20, 58, 11, 8, '#e8b8a0'],
      [80, 58, 12, 9, '#c9d3e6'],
      [40, 40, 13, 9, '#d9c2a0'],
      [64, 42, 11, 8, '#b4bdd0'],
    ]
      .map(
        ([x, y, rx, ry, c]) =>
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>` +
          `<path d="M${(x as number) - (rx as number) * 0.55} ${(y as number) - (ry as number) * 0.25}q${f1((rx as number) * 0.2)} ${f1(-(ry as number) * 0.45)} ${f1((rx as number) * 0.5)} ${f1(-(ry as number) * 0.5)}" stroke="#fff" stroke-width="3"/>`,
      )
      .join('') +
    `<path d="M4 92H96" stroke="#c9b28a"/>`,
  언덕:
    `<path d="M40 86C50 50 78 44 96 56V86Z" fill="#43b04a"/>` +
    `<path d="M4 90C8 44 30 30 52 30C72 30 88 50 92 90Z" fill="#5fc24a"/>` +
    `<rect x="47" y="14" width="6" height="18" fill="#9a5b2e"/>` +
    blob('#3a9e47', [
      [50, 14, 9],
      [43, 20, 6],
      [57, 20, 6],
    ]) +
    `<path d="M50 34C44 48 56 60 46 90" stroke="#f2d49a" stroke-width="5"/>` +
    dot(24, 62, 3, '#fff') +
    dot(30, 76, 3, '#ffd23f') +
    dot(72, 58, 3, '#ff9aa8') +
    dot(76, 74, 3, '#fff') +
    `<path d="M4 90H96"/>`,
  연기:
    `<rect x="46" y="56" width="10" height="16" fill="#b5793a"/>` +
    `<path d="M10 72L36 50L62 72Z" fill="#e8553d"/>` +
    `<rect x="16" y="72" width="40" height="22" fill="#ffe2a0"/>` +
    `<rect x="30" y="80" width="12" height="14" fill="#9a5b2e"/>` +
    blob('#c9d3e6', [
      [52, 48, 7],
      [58, 38, 9],
      [70, 28, 11],
      [82, 16, 10],
      [66, 18, 7],
    ]),
  그림자:
    `<circle cx="88" cy="14" r="8" fill="#ffd23f"/>` +
    `<path d="M4 88H96" stroke="#c9b28a"/>` +
    `<g transform="translate(62 88) matrix(1 0 0.75 0.42 0 0)" fill="#5f6a85" stroke="none">` +
    `<circle cx="0" cy="-68" r="13"/><path d="M-12 -56H12L14 -30H9L10 0H-10L-9 -30H-14Z"/></g>` +
    `<path d="M56 86L62 60M68 86L62 60" stroke="#3b78e6" stroke-width="7"/>` +
    `<path d="M52 36H72L74 62H50Z" fill="#e8553d"/>` +
    tube('M52 40L42 58M72 40L82 58', '#e8553d', 4) +
    `<circle cx="62" cy="24" r="11" fill="${SKIN}"/><path d="M51 22C51 12 73 12 73 22C68 18 56 18 51 22Z" fill="#5a3b24"/>` +
    dot(58, 25, 1.8) +
    dot(66, 25, 1.8) +
    `<path d="M59 30q3 2 6 0" stroke-width="2"/>`,
  열매:
    tube('M4 20C30 26 60 20 96 12', '#9a5b2e', 6) +
    leaf(30, 12, 70, '#43b04a', 0.8, '#2a7a34') +
    leaf(80, 26, -60, '#43b04a', 0.8, '#2a7a34') +
    [
      [22, 24, [[16, 50], [30, 54]]],
      [52, 22, [[44, 58], [58, 62], [50, 76]]],
      [80, 14, [[76, 46], [88, 52]]],
    ]
      .map(([x, y, bs]) =>
        (bs as number[][])
          .map(([bx, by]) => `<path d="M${x} ${y}L${bx} ${by - 8}" stroke="#6b3e26" stroke-width="2.5"/>`)
          .join('') +
        (bs as number[][]).map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="9" fill="#e8553d"/>` + dot(bx - 3, by - 3, 2.2, '#fff')).join(''),
      )
      .join(''),
  호수:
    `<path d="M4 52L26 18L46 52Z" fill="#8fb0d8"/><path d="M34 52L62 10L92 52Z" fill="#7aa0cc"/>` +
    `<path d="M54 22L62 10L70 22L66 20L62 24L58 20Z" fill="#fff"/>` +
    `<path d="M4 52H96V58H4Z" fill="#5fc24a"/>` +
    `<ellipse cx="50" cy="72" rx="44" ry="20" fill="#3b8fe0"/>` +
    `<path d="M30 68h14M58 76h16M40 82h10" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M14 58L20 42L26 58Z" fill="#3a9e47"/><path d="M80 58L86 40L92 58Z" fill="#3a9e47"/>`,
  연못:
    `<ellipse cx="50" cy="56" rx="44" ry="34" fill="#5fc24a"/>` +
    `<ellipse cx="50" cy="58" rx="36" ry="26" fill="#3b8fe0"/>` +
    [
      [12, 40],
      [20, 80],
      [84, 30],
      [90, 64],
      [50, 88],
      [36, 24],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#b4bdd0" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M40 50L28 44A15 11 0 1 0 42 56Z" fill="#8fe07a"/>` +
    `<path d="M68 70L60 60A14 10 0 1 0 72 66Z" fill="#8fe07a"/>` +
    `<path d="M28 44C22 34 26 28 31 28C36 28 38 34 32 44Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M56 44C60 40 66 40 70 44C66 48 60 48 56 44Z" fill="#ff9f1a" stroke-width="2.5"/><path d="M70 44L75 40V48Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M36 74q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>`,

  // ── 가족·사람 ──
  형:
    halo(64, 94, 1.35) +
    person(64, 94, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(26, 94, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }),
  고모:
    person(50, 96, 1.7, { hair: '#3a2418', style: 'bun', shirt: '#43b04a' }) +
    `<path d="M41 50Q50 60 59 50Z" fill="#c62f3f" stroke-width="2.5"/>` +
    cheeks(48, 13) +
    `<path d="M40 64L50 72L60 64" stroke="#fff" stroke-width="3"/>` +
    dot(29, 48, 2.5, '#fff') +
    dot(71, 48, 2.5, '#fff'),
  아줌마:
    blob('#3a2418', [
      [30, 34, 7],
      [30, 46, 6],
      [70, 34, 7],
      [70, 46, 6],
      [38, 22, 7],
      [50, 18, 7],
      [62, 22, 7],
    ]) +
    person(50, 96, 1.7, { hair: '#3a2418', style: 'short', shirt: '#e8862e' }) +
    `<path d="M36 68L40 64M64 68L60 64" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 70H66L68 96H32Z" fill="#fff"/>` +
    `<rect x="42" y="78" width="16" height="10" rx="2" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M42 50Q50 58 58 50" stroke-width="3"/>` +
    cheeks(48, 13),
  쌍둥이:
    person(29, 96, 1.25, { hair: '#2f2a26', style: 'pony', shirt: '#ffd23f' }) +
    person(71, 96, 1.25, { hair: '#2f2a26', style: 'pony', shirt: '#ffd23f' }) +
    tube('M44 84L56 84', SKIN, 4) +
    cheeks(60, 7, 29) +
    cheeks(60, 7, 71) +
    sparkle(50, 30, 6),
  가수:
    note(82, 26, '#8e4fc9') +
    note(88, 60, '#3b78e6') +
    person(40, 96, 1.6, { hair: '#6b3e26', style: 'long', shirt: '#8e4fc9' }) +
    `<ellipse cx="40" cy="55" rx="4.5" ry="5" fill="#c62f3f" stroke-width="2.5"/>` +
    tube('M58 60L62 80', '#2f2a26', 4) +
    `<circle cx="56" cy="54" r="8" fill="#8a96b0"/>` +
    `<path d="M50 52h12M52 57h8" stroke="#dfe8f5" stroke-width="2"/>` +
    hand(61, 74, 5.5),
  화가:
    tube('M60 60L54 94M84 60L90 94M72 60V94', '#9a5b2e', 3.5) +
    `<rect x="54" y="12" width="40" height="46" rx="2" fill="#fff"/>` +
    `<circle cx="84" cy="24" r="6" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M57 55C62 40 72 36 82 42C86 44 90 48 91 55Z" fill="#5fc24a" stroke-width="2.5"/>` +
    person(30, 96, 1.4, { hair: '#5a3b24', style: 'short', shirt: '#3b8fe0' }) +
    `<ellipse cx="28" cy="32" rx="15" ry="6" fill="#e8553d" transform="rotate(-10 28 32)"/><circle cx="30" cy="25" r="2.5" fill="#e8553d"/>` +
    tube('M44 80L58 46', '#9a5b2e', 3) +
    `<path d="M58 46L62 38" stroke="#3b78e6" stroke-width="6"/>` +
    hand(46, 76) +
    `<path d="M4 80C4 70 14 66 22 68C28 70 28 76 24 78C22 80 24 84 22 88C18 92 4 90 4 80Z" fill="#f2d49a"/>` +
    dot(10, 76, 2.8, '#e8553d') +
    dot(16, 72, 2.8, '#3b78e6') +
    dot(10, 84, 2.8, '#43b04a'),
  어부:
    `<path d="M4 66C2 80 10 92 24 92C34 92 38 84 36 72Z" fill="#f2d49a"/>` +
    `<path d="M8 70L32 88M4 80L22 92M18 68L36 82M10 88L36 72M6 76L24 66" stroke="#9a5b2e" stroke-width="2"/>` +
    person(50, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M28 34C28 16 72 16 72 34Z" fill="#ffd23f"/><path d="M24 36C34 30 66 30 76 36L78 40C66 36 34 36 22 40Z" fill="#ffd23f"/>` +
    tube('M64 72L74 54', '#3b78e6', 5) +
    `<path d="M74 44C84 36 94 42 94 54C94 64 84 70 74 62L66 70V36Z" fill="#ff9f1a"/>` +
    dot(86, 50, 2.2) +
    hand(73, 52, 5.5),
  목수:
    person(40, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#e8862e' }) +
    `<path d="M20 34C20 12 60 12 60 34Z" fill="#ffd23f"/><rect x="16" y="32" width="48" height="5" rx="2.5" fill="#ffd23f"/>` +
    `<rect x="6" y="80" width="64" height="12" rx="2" fill="#e0b27a"/><path d="M14 86h14M40 85h18" stroke="#b5793a" stroke-width="2.5"/>` +
    tube('M72 76L82 32', '#b5793a', 5) +
    `<rect x="68" y="20" width="26" height="12" rx="2" fill="#8a96b0" transform="rotate(13 81 26)"/>` +
    hand(74, 70, 5.5),
  우체부:
    person(44, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#43b04a', cap: '#e8553d' }) +
    `<path d="M28 66L66 90" stroke="#6b3e26" stroke-width="5"/>` +
    `<rect x="58" y="66" width="30" height="28" rx="3" fill="#b5793a"/>` +
    `<rect x="62" y="58" width="22" height="14" fill="#fff" transform="rotate(-10 73 65)"/>` +
    `<path d="M58 66H88V76C80 80 66 80 58 76Z" fill="#9a5b2e"/>` +
    `<rect x="4" y="40" width="22" height="16" fill="#fff"/><path d="M4 40L15 49L26 40" stroke-width="2.5"/>` +
    hand(15, 58, 5),
  제빵사:
    blob('#fff', [
      [40, 18, 8],
      [50, 13, 9],
      [60, 18, 8],
    ]) +
    person(50, 96, 1.4, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<rect x="35" y="21" width="30" height="11" rx="2" fill="#fff"/>` +
    `<rect x="20" y="70" width="58" height="16" rx="8" fill="#e0a458" transform="rotate(-18 49 78)"/>` +
    `<path d="M32 82l6-8M44 78l6-8M56 74l6-8" stroke="#a86a2c" stroke-width="3"/>` +
    `<path d="M68 94C66 80 80 76 90 80C98 84 96 94 94 94Z" fill="#c98f52"/>` +
    hand(24, 86) +
    hand(76, 70),
  미용사:
    person(32, 96, 1.5, { hair: '#6b3e26', style: 'long', shirt: '#8e4fc9' }) +
    `<path d="M22 70H42V96H22Z" fill="#2f2a26"/>` +
    `<rect x="4" y="38" width="8" height="28" rx="2" fill="#3b8fe0"/><path d="M12 42h5M12 48h5M12 54h5M12 60h5" stroke-width="2.5"/>` +
    `<path d="M72 50L86 16L77 52Z" fill="#dfe8f5"/><path d="M72 50L96 28L76 54Z" fill="#dfe8f5"/>` +
    `<circle cx="64" cy="60" r="6" fill="#fff" stroke="#e8553d" stroke-width="4"/><circle cx="72" cy="66" r="6" fill="#fff" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M67 56L73 51M70 62L75 54" stroke-width="3"/>` +
    hand(60, 70, 5),
  선장:
    person(50, 88, 1.45, { hair: '#fff', style: 'short', shirt: '#26356b', beard: '#fff' }) +
    `<path d="M30 30C28 16 72 16 70 30Z" fill="#fff"/><rect x="31" y="28" width="38" height="7" rx="2" fill="#26356b"/>` +
    `<path d="M34 35Q50 42 66 35" stroke="#1d2340" stroke-width="5"/>` +
    `<circle cx="50" cy="24" r="4" fill="#ffc933" stroke-width="2.5"/>` +
    [0, 45, 90, 135]
      .map((a) => `<path d="M50 56V96" stroke="#9a5b2e" stroke-width="5" transform="rotate(${a} 50 76)"/>`)
      .join('') +
    `<circle cx="50" cy="76" r="15" stroke-width="11"/><circle cx="50" cy="76" r="15" stroke="#b5793a" stroke-width="5"/>` +
    `<circle cx="50" cy="76" r="5" fill="#ffc933" stroke-width="2.5"/>`,
  조종사:
    `<path d="M62 22C70 16 86 14 94 16C94 22 86 24 80 24L66 28Z" fill="#fff"/>` +
    `<path d="M76 20L68 8H74L86 18Z" fill="#3b78e6"/><path d="M76 24L70 36H76L86 24Z" fill="#3b78e6"/>` +
    `<path d="M62 22L58 14H63L68 20Z" fill="#3b78e6"/>` +
    person(42, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M20 38C18 22 64 22 62 38Z" fill="#26356b"/><rect x="22" y="36" width="40" height="6" rx="2" fill="#1d2340"/>` +
    `<path d="M26 42Q42 48 58 42" stroke="#1d2340" stroke-width="5"/>` +
    `<path d="M32 30H52" stroke="#ffc933" stroke-width="4"/>` +
    dot(42, 30, 3.5, '#ffc933') +
    `<path d="M38 64L42 72L46 64Z" fill="#26356b" stroke-width="2.5"/><path d="M42 72V92" stroke="#26356b" stroke-width="4"/>` +
    `<path d="M20 70H30M54 70H64" stroke="#ffc933" stroke-width="4"/>`,
  발레리나:
    tube('M44 32C34 28 28 18 34 10C38 6 44 6 48 8', SKIN, 4) +
    tube('M56 32C66 28 72 18 66 10C62 6 56 6 52 8', SKIN, 4) +
    tube('M47 56L45 88', '#ffd6e0', 4) +
    tube('M53 56L55 88', '#ffd6e0', 4) +
    `<path d="M42 86L45 94L48 86Z" fill="#ff9aa8" stroke-width="2.5"/><path d="M52 86L55 94L58 86Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M20 56C30 46 70 46 80 56C74 62 26 62 20 56Z" fill="#ffc4d4"/>` +
    `<path d="M26 54q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0" stroke="#e85d9a" stroke-width="2"/>` +
    `<path d="M43 32H57L55 50H45Z" fill="#ff9aa8"/>` +
    `<circle cx="50" cy="12" r="5" fill="#6b3e26"/>` +
    `<circle cx="50" cy="22" r="10" fill="${SKIN}"/><path d="M40 20C40 12 60 12 60 20C56 16 44 16 40 20Z" fill="#6b3e26"/>` +
    dot(46, 23, 1.6) +
    dot(54, 23, 1.6) +
    `<path d="M47 27q3 2 6 0" stroke-width="2"/>` +
    sparkle(16, 30, 5) +
    sparkle(86, 34, 5),
  왕자:
    `<path d="M20 96L28 70C36 64 64 64 72 70L80 96Z" fill="#e8553d"/>` +
    person(50, 96, 1.5, { hair: '#6b3e26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M38 66L62 90" stroke="#ffc933" stroke-width="5"/>` +
    `<path d="M37 30V14L44 21L50 10L56 21L63 14V30Z" fill="#ffc933"/>` +
    dot(50, 24, 2.5, '#e8553d'),
  여왕:
    `<path d="M12 96L22 64C30 58 62 58 70 64L80 96Z" fill="#e8553d"/>` +
    person(46, 96, 1.6, { hair: '#6b3e26', style: 'long', shirt: '#8e4fc9' }) +
    blob('#fff', [
      [28, 66, 5],
      [36, 64, 5],
      [56, 64, 5],
      [64, 66, 5],
    ]) +
    `<path d="M38 70Q46 78 54 70" stroke="#ffc933" stroke-width="3"/>` +
    dot(46, 76, 3, '#e85d9a') +
    `<path d="M28 26V6L37 15L46 3L55 15L64 6V26Z" fill="#ffc933"/>` +
    dot(46, 19, 3, '#e8553d') +
    dot(36, 21, 2.2, '#3b78e6') +
    dot(56, 21, 2.2, '#3b78e6') +
    tube('M84 94L84 50', '#ffc933', 4) +
    `<circle cx="84" cy="44" r="7" fill="#e85d9a"/>` +
    hand(84, 74, 5),
  요정:
    `<ellipse cx="30" cy="46" rx="18" ry="12" fill="#d8f0ff" stroke="#7ec8f0" transform="rotate(-30 30 46)"/>` +
    `<ellipse cx="70" cy="46" rx="18" ry="12" fill="#d8f0ff" stroke="#7ec8f0" transform="rotate(30 70 46)"/>` +
    `<ellipse cx="32" cy="70" rx="12" ry="8" fill="#d8f0ff" stroke="#7ec8f0" transform="rotate(30 32 70)"/>` +
    `<ellipse cx="68" cy="70" rx="12" ry="8" fill="#d8f0ff" stroke="#7ec8f0" transform="rotate(-30 68 70)"/>` +
    person(50, 94, 1.3, { hair: '#ffc933', style: 'long', shirt: '#5fc24a' }) +
    `<path d="M34 94C38 84 62 84 66 94Z" fill="#5fc24a"/>` +
    tube('M64 80L80 30', '#fff', 3) +
    star(82, 22, 10, '#ffd23f') +
    hand(64, 80, 4.5) +
    sparkle(12, 20, 5) +
    sparkle(92, 50, 4) +
    sparkle(60, 12, 4),
  인어:
    `<path d="M4 90q8-6 16 0t16 0t16 0t16 0t16 0t12 0V96H4Z" fill="#3b8fe0"/>` +
    `<path d="M28 20C20 30 20 52 24 64L40 60L50 22Z" fill="#e8553d"/>` +
    `<path d="M30 56C28 72 36 84 54 86C64 86 72 82 76 76C68 80 58 78 54 72C50 66 50 60 50 56Z" fill="#3fb8a8"/>` +
    `<path d="M74 78C78 64 88 58 96 62C92 68 88 72 86 76C92 78 96 84 94 92C86 90 78 86 74 78Z" fill="#3fb8a8"/>` +
    `<path d="M36 66q4 4 8 0M40 76q4 4 8 0M52 80q4 4 8 0" stroke="#2a8a7e" stroke-width="2.5"/>` +
    `<path d="M32 56C30 46 34 38 40 38S50 46 48 56Z" fill="${SKIN}"/>` +
    `<circle cx="36" cy="46" r="4" fill="#a45cf0" stroke-width="2.5"/><circle cx="44" cy="46" r="4" fill="#a45cf0" stroke-width="2.5"/>` +
    tube('M47 42L60 28', SKIN, 4) +
    hand(62, 26, 4.5) +
    `<circle cx="40" cy="26" r="11" fill="${SKIN}"/>` +
    `<path d="M29 26C28 14 36 12 42 12S52 16 51 24C46 20 36 20 29 26Z" fill="#e8553d"/>` +
    dot(37, 27, 1.8) +
    dot(45, 27, 1.8) +
    `<path d="M38 32q3 2 6 0" stroke-width="2"/>` +
    `<circle cx="78" cy="20" r="4" fill="#dff4ff" stroke="#7ec8f0" stroke-width="2.5"/><circle cx="86" cy="34" r="3" fill="#dff4ff" stroke="#7ec8f0" stroke-width="2.5"/>`,
  거인:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    `<rect x="8" y="80" width="18" height="14" fill="#ffe2a0" stroke-width="2.5"/><path d="M5 81L17 71L29 81Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="15" y="86" width="5" height="8" fill="#9a5b2e" stroke-width="2"/>` +
    person(60, 94, 1.75, { hair: '#6b3e26', style: 'short', shirt: '#43b04a' }) +
    `<path d="M52 49Q60 56 68 49" stroke-width="3"/>`,
  도깨비:
    tube('M76 76L82 40', '#9a5b2e', 6) +
    `<path d="M74 44C70 30 76 12 86 10C96 10 98 28 92 44Z" fill="#b5793a"/>` +
    dot(80, 22, 3, '#ffd23f') +
    dot(90, 20, 3, '#ffd23f') +
    dot(84, 34, 3, '#ffd23f') +
    `<path d="M24 94C22 76 30 64 44 64S66 76 64 94Z" fill="#ffc933"/>` +
    `<path d="M30 76l6 4M52 74l-6 5M36 88l4-6M56 86l-4-5" stroke="#1d2340" stroke-width="3.5"/>` +
    `<path d="M40 14L44 2L48 14Z" fill="#fff1b8"/>` +
    `<circle cx="44" cy="38" r="24" fill="#6fb8e6"/>` +
    blob('#3a2418', [
      [30, 20, 7],
      [40, 15, 7],
      [50, 15, 7],
      [58, 20, 7],
    ]) +
    `<path d="M40 16L44 0L48 16Z" fill="#ffe066"/>` +
    `<circle cx="36" cy="36" r="6" fill="#fff"/><circle cx="52" cy="36" r="6" fill="#fff"/>` +
    dot(37, 37, 3) +
    dot(53, 37, 3) +
    `<path d="M32 48Q44 60 56 48Z" fill="#c62f3f" stroke-width="2.5"/><path d="M40 49V53H44V49" fill="#fff" stroke-width="1.5"/>` +
    hand(76, 76, 6),
  외계인:
    sparkle(10, 20, 5) +
    sparkle(90, 16, 5) +
    `<path d="M26 72C28 58 72 58 74 72Z" fill="#8a96b0"/>` +
    `<path d="M38 72C36 58 44 52 50 52S64 58 62 72Z" fill="#7ed957"/>` +
    tube('M60 60L74 44', '#7ed957', 4) +
    `<path d="M40 22L34 8M60 22L66 8" stroke-width="3"/>` +
    `<circle cx="34" cy="8" r="4" fill="#ffd23f" stroke-width="2.5"/><circle cx="66" cy="8" r="4" fill="#ffd23f" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="36" rx="22" ry="18" fill="#7ed957"/>` +
    `<ellipse cx="41" cy="36" rx="6" ry="8" fill="${INK}" transform="rotate(-20 41 36)"/><ellipse cx="59" cy="36" rx="6" ry="8" fill="${INK}" transform="rotate(20 59 36)"/>` +
    dot(42, 33, 1.8, '#fff') +
    dot(60, 33, 1.8, '#fff') +
    `<path d="M45 47q5 3 10 0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="76" rx="46" ry="12" fill="#b4bdd0"/>` +
    `<path d="M14 72C30 66 70 66 86 72" stroke="#8a96b0" stroke-width="3"/>` +
    dot(22, 80, 3.5, HL) +
    dot(38, 84, 3.5, HL) +
    dot(62, 84, 3.5, HL) +
    dot(78, 80, 3.5, HL) +
    `<path d="M36 88L30 96M50 88V96M64 88L70 96" stroke="#ffe066" stroke-width="4"/>`,
  학생:
    `<path d="M44 58C44 50 50 48 64 48H78C86 48 90 52 90 60V92C90 95 88 96 85 96H48Z" fill="#e8553d"/>` +
    `<path d="M44 58C54 62 80 62 90 58V70C80 74 54 74 44 70Z" fill="#c62f3f"/>` +
    `<rect x="68" y="78" width="16" height="12" rx="3" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M58 48C58 40 72 40 72 48" stroke-width="4"/>` +
    person(40, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f', cap: '#ffd23f' }) +
    `<path d="M50 68V96" stroke="#c62f3f" stroke-width="5"/><path d="M30 68V96" stroke="#c62f3f" stroke-width="5"/>`,
};
