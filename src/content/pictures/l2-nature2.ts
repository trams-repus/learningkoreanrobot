// 그림 묶음: 7~8세 자연 2 (나무·꽃·풀·돌과 땔감·구름과 비·바다 속). 그림 규칙은 docs/picture-style.md.
import { INK, HL, dot, blob, ring, sparkle, tube, drop } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);
const BARK = '#9a5b2e';
const WOOD = '#f2c98a';

/** 꽃잎 n장을 (cx, cy) 둘레에 (rx가 바깥쪽 길이) */
function petals(cx: number, cy: number, n: number, d: number, rx: number, ry: number, fill: string, turn = 0, sw = 3): string {
  return Array.from({ length: n }, (_, k) => {
    const a = turn + (k * 360) / n;
    const rad = (a * Math.PI) / 180;
    const x = f1(cx + d * Math.cos(rad));
    const y = f1(cy + d * Math.sin(rad));
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="${sw}" transform="rotate(${f1(a)} ${x} ${y})"/>`;
  }).join('');
}

/** 별 (크리스마스트리 꼭대기) */
function star(x: number, y: number, r: number, fill: string): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}"/>`;
}

/** 단풍잎 하나: (x, y) 가운데, s 크기 */
function maple(x: number, y: number, s: number, fill: string, turn = 0): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s}) translate(-50 -45)" stroke-width="${f1(3.5 / s)}">` +
    `<path d="M50 6L57 24L72 16L68 36L92 34L80 50L88 60L66 64L70 76L54 70L50 74L46 70L30 76L34 64L12 60L20 50L8 34L32 36L28 16L43 24Z" fill="${fill}"/>` +
    `</g>`
  );
}

/** 나무 기둥 (아래가 조금 넓게) */
function trunk(x: number, top: number, w: number, fill = BARK): string {
  return `<path d="M${x - w / 2} ${top}L${x - w / 2 - 3} 92H${x + w / 2 + 3}L${x + w / 2} ${top}Z" fill="${fill}"/>`;
}

/** 층층이 뾰족한 나무 (전나무·트리) */
function fir(fill: string, top = 6): string {
  return (
    `<path d="M50 ${top + 34}L86 ${top + 72}H14Z" fill="${fill}"/>` +
    `<path d="M50 ${top + 16}L78 ${top + 50}H22Z" fill="${fill}"/>` +
    `<path d="M50 ${top}L70 ${top + 28}H30Z" fill="${fill}"/>`
  );
}

/** 물 칸 (바다 속·연못) */
const water = (fill = '#7ec8f0') => `<rect x="5" y="5" width="90" height="90" rx="14" fill="${fill}"/>`;

/** 도토리 */
function acorn(x: number, y: number, s: number): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3 / s)}">` +
    `<path d="M-8 0C-8 10 -4 16 0 18C4 16 8 10 8 0Z" fill="#c98a45"/>` +
    `<path d="M-10 1C-11 -6 -6 -9 0 -9S11 -6 10 1Z" fill="#6b3e26"/>` +
    `<path d="M0 -9V-13"/></g>`
  );
}

export const PICS: Record<string, string> = {
  // ── 땅속·바다 ──
  석탄:
    `<path d="M6 92H94" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M8 50L42 50L44 38L60 40L92 50L84 80H16Z" fill="#2f3447"/>` +
    `<path d="M22 50L28 34L42 30L50 38L46 50Z" fill="#3d4359"/>` +
    `<path d="M50 44L58 28L74 30L80 46Z" fill="#2f3447"/>` +
    `<path d="M34 32L38 22L50 20L54 30L44 36Z" fill="#454c64"/>` +
    `<path d="M28 42L32 36M60 36L64 32M40 26L44 24" stroke="#fff" stroke-width="3"/>` +
    `<path d="M10 52H90L82 80H18Z" fill="#8a96b0"/>` +
    `<path d="M14 62H86" stroke="#5f6a85" stroke-width="3"/>` +
    `<circle cx="30" cy="84" r="7" fill="#5f6a85"/><circle cx="70" cy="84" r="7" fill="#5f6a85"/>` +
    dot(30, 84, 2.2, '#dfe8f5') +
    dot(70, 84, 2.2, '#dfe8f5'),
  공룡뼈:
    `<path d="M4 90C20 84 80 84 96 90Z" fill="#f2d49b"/>` +
    tube('M34 58L30 88M42 58L44 88M62 54L60 88M70 54L74 88', '#f5ecd4', 5) +
    tube('M6 76C18 70 26 54 40 50C54 46 62 50 68 40C72 32 72 24 74 18', '#f5ecd4', 6) +
    [30, 38, 46, 54, 62]
      .map((x, i) => tube(`M${x} ${[54, 51, 49, 48, 48][i]}C${x - 4} ${62} ${x - 2} ${68} ${x + 2} ${70}`, '#f5ecd4', 3.5))
      .join('') +
    `<path d="M68 18C68 10 76 8 84 10C92 12 94 18 88 22C82 24 72 24 68 18Z" fill="#f5ecd4"/>` +
    dot(78, 14, 2.5) +
    `<path d="M82 20H90" stroke-width="2.5"/>` +
    sparkle(18, 24, 6) +
    sparkle(92, 40, 4),
  조개껍데기:
    `<path d="M40 80L34 92H66L60 80Z" fill="#ff9aa8"/>` +
    `<path d="M50 86L10.2 52.6A9.5 9.5 0 0 1 24 41A9.5 9.5 0 0 1 41 34.8A9.5 9.5 0 0 1 59 34.8A9.5 9.5 0 0 1 76 41A9.5 9.5 0 0 1 89.8 52.6Z" fill="#ffb5a0"/>` +
    `<path d="M50 82L25 45M50 82L42 38M50 82L58 38M50 82L75 45" stroke="#e8736a" stroke-width="3"/>` +
    `<path d="M22 54C24 48 28 44 32 42" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(84, 20, 6),
  산호초:
    water() +
    `<path d="M5 78C24 72 76 72 95 78V85C95 91 91 95 85 95H15C9 95 5 91 5 85Z" fill="#f2d49b"/>` +
    tube('M30 84V62M30 68C22 62 20 52 20 40M30 64C38 56 40 46 38 34M20 50C14 46 12 40 12 32M38 44C44 40 46 34 46 26', '#ff7a8a', 7) +
    tube('M66 84V66M66 70C60 64 58 56 60 46M66 70C74 64 78 56 76 44M76 54C82 50 86 44 86 36', '#ff9f1a', 7) +
    blob('#a45cf0', [
      [48, 80, 8],
      [55, 76, 7],
      [42, 76, 6],
    ]) +
    `<path d="M58 22C64 16 74 16 78 22C74 28 64 28 58 22ZM78 22L86 16V28Z" fill="#ffd23f"/>` +
    dot(64, 21, 1.8) +
    `<circle cx="22" cy="16" r="3" fill="#fff" stroke-width="2"/><circle cx="16" cy="24" r="2" fill="#fff" stroke-width="1.8"/>`,
  해초:
    water() +
    `<path d="M5 82C24 76 76 76 95 82V85C95 91 91 95 85 95H15C9 95 5 91 5 85Z" fill="#f2d49b"/>` +
    tube('M30 86C22 74 38 64 30 52C22 40 38 30 30 16', '#3a9e47', 8) +
    tube('M50 86C58 72 42 62 50 48C58 36 44 28 50 22', '#5fc24a', 8) +
    tube('M70 86C62 74 78 66 70 54C62 42 76 36 72 26', '#43b04a', 8) +
    `<circle cx="84" cy="30" r="4" fill="#fff" stroke-width="2.5"/><circle cx="88" cy="18" r="2.8" fill="#fff" stroke-width="2"/>` +
    `<circle cx="16" cy="40" r="3" fill="#fff" stroke-width="2"/>`,
  이끼:
    `<path d="M6 90H94"/>` +
    `<path d="M8 90C6 66 20 44 48 42C76 40 94 62 92 90Z" fill="#8a96b0"/>` +
    blob('#5fc24a', [
      [18, 64, 10],
      [30, 52, 12],
      [46, 46, 12],
      [62, 46, 12],
      [76, 54, 11],
      [84, 66, 8],
      [50, 58, 10],
    ]) +
    [
      [34, 40, 30],
      [50, 34, 22],
      [66, 36, 26],
    ]
      .map(([x, y, t]) => `<path d="M${x} ${y + 8}C${x} ${y + 2} ${x + 1} ${y - 4} ${x + 2} ${t}" stroke="#3a9e47" stroke-width="2.5"/>` + dot(x + 2, t - 2, 3, '#9a5b2e'))
      .join('') +
    `<path d="M24 60C28 56 32 54 38 54M56 54C60 52 66 52 70 54" stroke="#9be08f" stroke-width="3"/>`,

  // ── 풀·꽃 ──
  강아지풀:
    `<path d="M20 92C22 76 22 64 18 52M80 92C78 78 80 66 86 56" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M40 92C40 70 42 50 40 34M56 92C58 72 64 54 74 40M46 92C40 76 30 60 20 52" stroke="#3a9e47" stroke-width="3.5"/>` +
    [
      [40, 22, -4],
      [78, 30, 36],
      [18, 42, -50],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M0 -18L-3 -21M-7 -12L-11 -14M-7 -2L-11 -3M-6 8L-10 10M7 -12L11 -14M7 -2L11 -3M6 8L10 10" stroke="#8fae3a" stroke-width="2.5"/>` +
          `<path d="M0 -20C-8 -18 -8 4 -6 10C-4 14 4 14 6 10C8 4 8 -18 0 -20Z" fill="#c6d95a"/>` +
          `<path d="M-2 -12V6" stroke="#e6f0a0" stroke-width="2.5"/></g>`,
      )
      .join(''),
  토끼풀:
    tube('M40 92C40 76 38 60 40 44', '#43b04a', 4) +
    tube('M64 92C64 82 66 74 70 68', '#3a9e47', 3) +
    [0, 120, 240]
      .map(
        (a) =>
          `<g transform="translate(70 66) rotate(${a})"><path d="M0 0C-12 -4 -14 -18 -6 -22C-2 -24 0 -20 0 -18C0 -20 2 -24 6 -22C14 -18 12 -4 0 0Z" fill="#43b04a"/>` +
          `<path d="M-5 -13L0 -9L5 -13" stroke="#e8ffe0" stroke-width="2.5"/></g>`,
      )
      .join('') +
    petals(40, 30, 14, 12, 7, 4, '#fff', 0, 2.5) +
    petals(40, 30, 10, 5, 5, 3.5, '#fff', 18, 2.5) +
    `<circle cx="40" cy="30" r="4" fill="#fff4c8" stroke-width="2"/>`,
  들꽃:
    `<path d="M4 92C20 82 80 82 96 92Z" fill="#5fc24a"/>` +
    `<path d="M24 90V52M50 90V34M76 90V56M36 90C38 80 36 72 32 66M64 90C62 82 66 74 70 70" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<path d="M10 92L14 76L18 92M84 92L88 78L92 92M44 92L46 80L50 92" fill="#43b04a"/>` +
    petals(24, 46, 5, 7, 6, 4.5, '#ffd23f', -90) +
    dot(24, 46, 3.5, '#e8862e') +
    petals(50, 28, 6, 8, 7, 4.5, '#a45cf0', -90) +
    dot(50, 28, 4, HL) +
    petals(76, 50, 5, 7, 6, 4.5, '#fff', -90) +
    dot(76, 50, 3.5, HL) +
    `<circle cx="32" cy="64" r="5" fill="#ff9aa8" stroke-width="2.5"/><circle cx="70" cy="68" r="5" fill="#7ec8f0" stroke-width="2.5"/>`,
  꽃잎:
    `<path d="M14 30q8-6 16 0M66 16q8-6 16 0M70 86q8-6 16 0" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 5"/>` +
    [
      [44, 50, -20, 1.2, '#ff9aa8'],
      [76, 38, 40, 0.8, '#f07fae'],
      [24, 76, -70, 0.75, '#ffb8c6'],
    ]
      .map(
        ([x, y, a, s, c]) =>
          `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" stroke-width="${f1(3.5 / (s as number))}">` +
          `<path d="M0 26C-16 20 -20 -6 -10 -24Q-5 -20 0 -24Q5 -20 10 -24C20 -6 16 20 0 26Z" fill="${c}"/>` +
          `<path d="M0 20V-8" stroke="#fff" stroke-width="${f1(3 / (s as number))}" opacity=".7"/></g>`,
      )
      .join(''),
  꽃봉오리:
    tube('M50 92V52', '#43b04a', 5) +
    `<path d="M50 84C34 84 22 72 22 60C36 60 48 70 50 84Z" fill="#43b04a"/>` +
    `<path d="M50 76C64 76 76 66 78 54C64 54 52 62 50 76Z" fill="#43b04a"/>` +
    `<path d="M50 56C34 50 30 30 38 16C42 10 46 8 50 6C54 8 58 10 62 16C70 30 66 50 50 56Z" fill="#ff5c70"/>` +
    `<path d="M50 56C44 44 44 24 50 8" stroke="#c62f3f" stroke-width="2.5"/>` +
    `<path d="M50 58C38 58 32 50 32 38C40 44 46 46 50 44C54 46 60 44 68 38C68 50 62 58 50 58Z" fill="#5fc24a"/>`,
  꽃다발:
    `<path d="M36 48L30 30M50 48V24M64 48L72 30M42 48L22 42M58 48L80 44" stroke="#3a9e47" stroke-width="4"/>` +
    `<path d="M22 44C14 36 18 26 26 28C26 36 24 40 22 44ZM78 44C86 36 82 26 74 28C74 36 76 40 78 44Z" fill="#43b04a"/>` +
    petals(30, 24, 6, 8, 7, 5, '#ff5c70', -90) +
    dot(30, 24, 4, HL) +
    petals(70, 24, 6, 8, 7, 5, '#ffd23f', -90) +
    dot(70, 24, 4, '#e8862e') +
    petals(50, 18, 6, 9, 8, 5.5, '#e85d9a', -90) +
    dot(50, 18, 4.5, HL) +
    `<path d="M18 42L82 42L56 94H44Z" fill="#7ec8f0"/>` +
    `<path d="M18 42L34 50L50 42L66 50L82 42" fill="#bfe6ff"/>` +
    `<path d="M40 70C32 64 28 70 32 76C36 78 40 74 40 70ZM60 70C68 64 72 70 68 76C64 78 60 74 60 70Z" fill="#ff5c70"/>` +
    `<path d="M44 72L38 84M56 72L62 84" stroke="#ff5c70" stroke-width="4"/>` +
    `<circle cx="50" cy="71" r="5" fill="#ff5c70"/>`,
  꽃밭:
    `<rect x="5" y="52" width="90" height="42" rx="10" fill="#9a5b2e"/>` +
    `<path d="M5 72H95" stroke="#7a4522" stroke-width="3"/>` +
    [
      [20, 26, '#ff5c70'],
      [50, 26, '#ffd23f'],
      [80, 26, '#a45cf0'],
      [35, 50, '#e85d9a'],
      [65, 50, '#fff'],
      [20, 72, '#ffd23f'],
      [50, 72, '#ff5c70'],
      [80, 72, '#ff9f1a'],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M${x} ${y}V${(y as number) + 18}" stroke="#3a9e47" stroke-width="3.5"/>` +
          `<path d="M${x} ${(y as number) + 16}C${(x as number) - 8} ${(y as number) + 14} ${(x as number) - 10} ${(y as number) + 8} ${(x as number) - 10} ${(y as number) + 6}C${(x as number) - 4} ${(y as number) + 6} ${x} ${(y as number) + 10} ${x} ${(y as number) + 16}Z" fill="#43b04a" stroke-width="2.5"/>` +
          petals(x as number, y as number, 5, 7, 6.5, 5, c as string, -90, 2.5) +
          dot(x as number, y as number, 3.5, c === '#ffd23f' ? '#e8862e' : HL),
      )
      .join(''),
  꽃씨:
    `<g transform="rotate(-18 40 44)">` +
    `<rect x="18" y="12" width="44" height="58" rx="5" fill="#fff"/>` +
    `<path d="M18 12H62V22H18Z" fill="#ff9f1a"/>` +
    `<path d="M40 60V44" stroke="#43b04a" stroke-width="3"/>` +
    petals(40, 38, 6, 7, 6, 4, '#ff5c70', -90, 2.5) +
    dot(40, 38, 3.5, HL) +
    `</g>` +
    `<path d="M50 72C60 76 70 80 76 88" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 5"/>` +
    [
      [58, 80, 20],
      [68, 74, 60],
      [74, 86, -30],
      [84, 78, 40],
      [62, 90, 80],
      [86, 90, -10],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -6C4 -6 5 0 3 4C2 6 -2 6 -3 4C-5 0 -4 -6 0 -6Z" fill="#6b3e26" stroke-width="2"/></g>`,
      )
      .join(''),
  떡잎:
    `<path d="M8 92C12 72 88 72 92 92Z" fill="#9a5b2e"/>` +
    dot(28, 84, 2.5, '#6b3e26') +
    dot(70, 86, 2.5, '#6b3e26') +
    tube('M50 80C50 68 48 58 50 48', '#8fd67a', 6) +
    `<path d="M50 48C42 32 22 28 12 38C16 54 38 58 50 48Z" fill="#8fd67a"/>` +
    `<path d="M50 48C58 32 78 28 88 38C84 54 62 58 50 48Z" fill="#8fd67a"/>` +
    `<path d="M46 46C38 42 28 40 20 40M54 46C62 42 72 40 80 40" stroke="#4caf50" stroke-width="2.5"/>`,
  가시:
    tube('M22 94C30 70 50 46 80 8', '#43b04a', 10) +
    [
      [30, 70, -115],
      [44, 52, 35],
      [55, 40, -125],
      [70, 22, 35],
    ]
      .map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-8 -5L0 -24L8 -5Z" fill="#c0503a"/></g>`)
      .join('') +
    `<path d="M38 62C26 58 14 62 8 72C22 76 32 72 38 62Z" fill="#43b04a"/>` +
    `<path d="M64 32C76 28 86 32 92 42C80 46 70 42 64 32Z" fill="#43b04a"/>` +
    ring(52, 38, 17),
  덩굴:
    `<rect x="44" y="6" width="12" height="88" rx="4" fill="#c98a45"/>` +
    `<path d="M32 94H68" stroke-width="4"/>` +
    `<path d="M50 92C66 84 66 76 50 70C34 64 34 56 50 50C66 44 66 36 50 30C34 24 34 16 50 10" stroke="#3a9e47" stroke-width="7"/>` +
    `<path d="M50 92C66 84 66 76 50 70C34 64 34 56 50 50C66 44 66 36 50 30C34 24 34 16 50 10" stroke="#5fc24a" stroke-width="3"/>` +
    [
      [64, 80, 30],
      [36, 62, -150],
      [64, 42, 20],
      [36, 24, -160],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C6 -10 20 -10 22 0C20 8 10 12 0 0Z" fill="#43b04a"/></g>`,
      )
      .join('') +
    `<path d="M68 60c6 0 8 6 4 8s-6-2-2-4M30 44c-6 0-8 6-4 8s6-2 2-4M68 22c6 0 8 6 4 8s-6-2-2-4" stroke="#3a9e47" stroke-width="2.5"/>`,
  통나무:
    `<path d="M6 84H94" stroke-width="3"/>` +
    `<path d="M24 36H80C90 36 94 48 94 58S90 80 80 80H24Z" fill="${BARK}"/>` +
    `<path d="M42 48H66M52 68H80M72 44H84" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="24" cy="58" rx="16" ry="22" fill="${WOOD}"/>` +
    `<ellipse cx="24" cy="58" rx="10" ry="14" stroke="#c48a4a" stroke-width="2.5"/>` +
    `<ellipse cx="24" cy="58" rx="4" ry="6" stroke="#c48a4a" stroke-width="2.5"/>` +
    tube('M62 36C62 28 66 22 72 20', BARK, 4) +
    `<path d="M72 20C74 12 82 10 88 12C86 20 80 22 72 20Z" fill="#43b04a"/>`,
  장작:
    `<path d="M6 92H94" stroke-width="3"/>` +
    [
      [18, 81], [40, 81], [62, 81], [84, 81],
      [29, 62], [51, 62], [73, 62],
      [40, 43], [62, 43],
      [51, 24],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="10.5" fill="${BARK}"/><circle cx="${x}" cy="${y}" r="6.5" fill="${WOOD}" stroke="none"/>` +
          `<circle cx="${x}" cy="${y}" r="3" stroke="#c48a4a" stroke-width="2"/><path d="M${x} ${y - 6}V${y - 2}" stroke="#6b3e26" stroke-width="2"/>`,
      )
      .join(''),
  숯:
    `<path d="M36 26q-4-5 0-9t0-9M50 24q-4-5 0-9t0-9M64 26q-4-5 0-9t0-9" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M10 58H90L82 84H18Z" fill="#8a96b0"/>` +
    `<path d="M24 84L20 94M76 84L80 94" stroke-width="4"/>` +
    [
      [26, 52, 12, 9],
      [48, 48, 13, 11],
      [72, 52, 12, 9],
      [37, 38, 10, 8],
      [61, 38, 11, 8],
    ]
      .map(
        ([x, y, rx, ry]) =>
          `<path d="M${x - rx} ${y + 2}L${x - rx + 3} ${y - ry}L${x + 2} ${y - ry - 2}L${x + rx} ${y - ry + 3}L${x + rx - 1} ${y + ry - 2}L${x - 2} ${y + ry}Z" fill="#2f3447"/>` +
          `<path d="M${x - rx / 2} ${y - 1}L${x - 1} ${y + 3}L${x + rx / 2} ${y - 2}" stroke="#ff7a3a" stroke-width="3"/>`,
      )
      .join('') +
    `<path d="M10 58H90" stroke-width="4"/>` +
    dot(48, 40, 2.5, '#ffd23f') +
    dot(26, 46, 2.2, '#ffd23f') +
    dot(70, 46, 2.2, '#ffd23f'),
  은행잎:
    tube('M50 58C50 72 46 84 40 94', '#b8a032', 4) +
    `<path d="M50 60C40 52 18 42 10 26C12 18 26 10 38 12C44 13 47 18 48 26L50 30L52 26C53 18 56 13 62 12C74 10 88 18 90 26C82 42 60 52 50 60Z" fill="#ffd23f"/>` +
    `<path d="M50 58L22 24M50 58L34 18M50 58L44 24M50 58L56 24M50 58L66 18M50 58L78 24" stroke="#e8b420" stroke-width="2.5"/>` +
    sparkle(84, 72, 5) +
    sparkle(18, 64, 4),

  // ── 나무 ──
  단풍나무:
    trunk(50, 58, 12) +
    tube('M50 66L36 54M50 62L64 52', BARK, 4) +
    blob('#e8553d', [
      [50, 34, 22],
      [28, 44, 16],
      [72, 44, 16],
      [36, 24, 14],
      [64, 24, 14],
    ]) +
    maple(34, 38, 0.22, '#ff9f1a', -20) +
    maple(62, 30, 0.22, '#ffd23f', 15) +
    maple(50, 50, 0.2, '#ff9f1a', 0) +
    maple(16, 80, 0.2, '#e8553d', -30) +
    maple(84, 84, 0.18, '#ff9f1a', 25),
  버드나무:
    `<path d="M4 92C20 86 80 86 96 92Z" fill="#7ec8f0"/>` +
    trunk(50, 40, 12) +
    blob('#5fc24a', [
      [50, 22, 16],
      [32, 28, 14],
      [68, 28, 14],
    ]) +
    [18, 28, 38, 62, 72, 82, 46, 54]
      .map((x, i) => {
        const y = [34, 38, 36, 36, 38, 34, 34, 34][i];
        const end = [78, 72, 82, 82, 72, 78, 70, 70][i];
        const bend = x < 50 ? -4 : 4;
        return (
          `<path d="M${x} ${y}C${x + bend} ${(y + end) / 2} ${x} ${end - 8} ${x + bend} ${end}" stroke="${INK}" stroke-width="7"/>` +
          `<path d="M${x} ${y}C${x + bend} ${(y + end) / 2} ${x} ${end - 8} ${x + bend} ${end}" stroke="#8fd67a" stroke-width="3.5"/>`
        );
      })
      .join(''),
  사과나무:
    trunk(50, 60, 12) +
    blob('#43b04a', [
      [50, 34, 22],
      [28, 44, 16],
      [72, 44, 16],
      [36, 22, 14],
      [64, 22, 14],
    ]) +
    [
      [34, 44],
      [54, 26],
      [66, 50],
      [44, 56],
      [74, 32],
      [24, 30],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e8553d" stroke-width="2.5"/><path d="M${x} ${y - 6}V${y - 9}" stroke-width="2"/>` + dot(x - 2, y - 2, 1.4, '#fff'))
      .join(''),
  감나무:
    trunk(50, 60, 12) +
    tube('M50 70L30 54M50 64L72 50M46 62L40 40M54 60L62 36', BARK, 4) +
    blob('#3a9e47', [
      [50, 30, 18],
      [30, 40, 13],
      [70, 40, 13],
    ]) +
    [
      [26, 54],
      [74, 50],
      [40, 42],
      [60, 32],
      [36, 26],
      [52, 50],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y + 1}" rx="7.5" ry="6.5" fill="#ff8a1a" stroke-width="2.5"/>` +
          `<path d="M${x - 5} ${y - 5}L${x} ${y - 3}L${x + 5} ${y - 5}L${x + 2} ${y - 7}L${x} ${y - 9}L${x - 2} ${y - 7}Z" fill="#2f7a34" stroke-width="1.8"/>`,
      )
      .join(''),
  전나무:
    `<rect x="45" y="76" width="10" height="16" fill="${BARK}"/>` +
    fir('#2f8a3a', 6) +
    `<path d="M38 26L44 22M58 46L66 42M30 64L38 60M62 70L70 66" stroke="#5fc24a" stroke-width="3"/>` +
    `<path d="M26 92H74" stroke-width="3"/>`,
  크리스마스트리:
    `<path d="M38 80H62L58 94H42Z" fill="#e8553d"/>` +
    fir('#3a9e47', 12) +
    `<path d="M32 50Q50 58 70 46M24 72Q50 82 78 66" stroke="${HL}" stroke-width="3.5"/>` +
    dot(38, 38, 4, '#e8553d') +
    dot(60, 40, 4, '#3b78e6') +
    dot(44, 62, 4.5, '#3b78e6') +
    dot(66, 58, 4.5, '#e8553d') +
    dot(30, 76, 4.5, '#ff9aa8') +
    dot(56, 76, 4.5, HL) +
    star(50, 12, 10, HL) +
    `<rect x="72" y="80" width="18" height="14" rx="2" fill="#a45cf0"/><path d="M81 80V94" stroke="${HL}" stroke-width="3"/>` +
    `<rect x="10" y="84" width="16" height="10" rx="2" fill="#3b8fe0"/><path d="M18 84V94" stroke="#fff" stroke-width="3"/>`,
  자작나무:
    `<path d="M6 92H94" stroke-width="3"/>` +
    [
      [30, 30, 10],
      [58, 20, 12],
      [80, 40, 8],
    ]
      .map(
        ([x, top, w]) =>
          `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${92 - top}" rx="3" fill="#fff"/>` +
          `<path d="M${x - w / 2 + 1} ${top + 12}h${w * 0.5}M${x + 1} ${top + 26}h${w * 0.4}M${x - w / 2 + 1} ${top + 40}h${w * 0.6}M${x} ${top + 52}h${w * 0.45}` +
          `M${x - w / 2 + 1} ${top + 62}h${w * 0.4}" stroke="${INK}" stroke-width="3.5"/>`,
      )
      .join('') +
    blob('#c6d95a', [
      [30, 22, 12],
      [22, 30, 8],
      [38, 30, 8],
    ]) +
    blob('#a8cf4a', [
      [58, 14, 11],
      [48, 22, 8],
      [68, 22, 8],
    ]) +
    blob('#ffd23f', [
      [80, 34, 9],
      [74, 40, 6],
      [86, 40, 6],
    ]),
  참나무:
    trunk(50, 58, 16) +
    blob('#3a9e47', [
      [50, 30, 20],
      [26, 38, 17],
      [74, 38, 17],
      [34, 20, 13],
      [66, 20, 13],
    ]) +
    tube('M36 54V60M64 54V60', '#6b3e26', 2.5) +
    acorn(36, 70, 1.25) +
    acorn(64, 70, 1.25) +
    acorn(16, 86, 0.8) +
    acorn(84, 86, 0.8),
  알로에:
    `<path d="M24 66H76L70 94H30Z" fill="#e8862e"/>` +
    `<rect x="20" y="60" width="60" height="10" rx="3" fill="#ff9f1a"/>` +
    [
      [0, 1.1],
      [-26, 1],
      [26, 1],
      [-52, 0.85],
      [52, 0.85],
    ]
      .map(
        ([a, s]) =>
          `<g transform="translate(50 62) rotate(${a}) scale(${s})" stroke-width="${f1(3.5 / s)}">` +
          `<path d="M-8 0C-8 -20 -4 -40 0 -54C4 -40 8 -20 8 0Z" fill="#8fc98a"/>` +
          `<path d="M-8 -12l-3 -2M-7 -26l-3 -2M8 -12l3 -2M7 -26l3 -2" stroke-width="${f1(2.5 / s)}"/>` +
          `<circle cx="-2" cy="-16" r="1.6" fill="#fff" stroke="none"/><circle cx="2" cy="-30" r="1.6" fill="#fff" stroke="none"/></g>`,
      )
      .join(''),
  코스모스:
    `<path d="M34 92C34 74 30 60 30 44M66 92C66 80 70 68 70 58" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M32 78L22 72M22 72L18 66M22 72L16 74M33 66L42 60M42 60L46 54M42 60L48 62M68 80L78 74M78 74L82 68M78 74L84 76" stroke="#43b04a" stroke-width="2.5"/>` +
    [
      [30, 32, 1, '#ff9aa8'],
      [70, 50, 0.8, '#e85d9a'],
    ]
      .map(([x, y, s, c]) => {
        const sc = s as number;
        return (
          `<g transform="translate(${x} ${y}) scale(${sc})" stroke-width="${f1(3 / sc)}">` +
          Array.from(
            { length: 8 },
            (_, k) => `<path d="M0 0L-6 -14L-4 -22L0 -19L4 -22L6 -14Z" fill="${c}" transform="rotate(${k * 45})"/>`,
          ).join('') +
          `<circle r="6" fill="${HL}"/></g>`
        );
      })
      .join(''),
  봉숭아:
    tube('M50 94V20', '#8fc94a', 5) +
    [
      [30, 28, -40],
      [70, 40, 40],
      [28, 56, -50],
      [72, 70, 50],
      [32, 80, -60],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -20C8 -10 8 10 0 20C-8 10 -8 -10 0 -20Z" fill="#43b04a"/>` +
          `<path d="M0 -14V14" stroke="#2a7a34" stroke-width="2"/></g>`,
      )
      .join('') +
    [
      [58, 30, '#ff5c70'],
      [42, 44, '#e85d9a'],
      [58, 58, '#ff5c70'],
      [42, 70, '#e8553d'],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M50 ${y}L${x} ${(y as number) + 2}" stroke="#8fc94a" stroke-width="2.5"/>` +
          `<g transform="translate(${x} ${(y as number) + 6})">` +
          `<path d="M0 -4C-8 -4 -10 4 -6 8C-3 10 0 8 0 6C0 8 3 10 6 8C10 4 8 -4 0 -4Z" fill="${c}" stroke-width="2.5"/>` +
          `<path d="M-4 -2C-7 -8 -2 -10 0 -6C2 -10 7 -8 4 -2Z" fill="${c}" stroke-width="2.5"/></g>`,
      )
      .join(''),
  카네이션:
    tube('M50 54V94', '#6fae6a', 5) +
    `<path d="M50 76C40 70 30 66 20 66M50 86C60 80 70 76 80 76" stroke="#6fae6a" stroke-width="4"/>` +
    `<path d="M40 44L42 60C44 64 56 64 58 60L60 44Z" fill="#6fae6a"/>` +
    `<path d="M18 36L22 26L28 32L32 20L38 28L44 14L50 24L56 14L62 28L68 20L72 32L78 26L82 36C76 46 62 50 50 50S24 46 18 36Z" fill="#e8553d"/>` +
    `<path d="M26 40L32 34L38 40L44 32L50 40L56 32L62 40L68 34L74 40" stroke="#b8322a" stroke-width="2.5"/>` +
    `<path d="M36 30L40 24M60 24L64 30" stroke="#ff8a78" stroke-width="3"/>`,
  안개꽃:
    `<path d="M50 94V60M50 60L30 34M50 60L70 34M50 60V24M30 34L18 22M30 34L32 18M70 34L84 22M70 34L66 16M50 40L40 28M50 40L60 30M50 74L26 58M50 74L76 58" stroke="#6fae6a" stroke-width="2.5"/>` +
    [
      [18, 20], [24, 16], [14, 26], [32, 14], [28, 22], [36, 18],
      [50, 20], [46, 14], [54, 14], [42, 26], [38, 30], [62, 28], [58, 22],
      [66, 12], [72, 16], [84, 20], [88, 26], [78, 24], [72, 30],
      [26, 56], [20, 60], [30, 52], [76, 56], [82, 60], [70, 52], [44, 34], [56, 34],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#fff" stroke-width="2.2"/>`)
      .join('') +
    `<path d="M40 76L60 76L56 88H44Z" fill="#ff9aa8"/>`,
  국화:
    tube('M50 60V94', '#43b04a', 5) +
    `<path d="M50 80C40 76 30 76 22 82C28 88 42 88 50 80ZM50 72C58 66 70 66 78 70C74 78 60 80 50 72Z" fill="#43b04a"/>` +
    petals(50, 36, 18, 20, 11, 3.8, '#ffc933', 0, 2.5) +
    petals(50, 36, 14, 13, 8, 3.4, '#ffd23f', 12, 2.5) +
    petals(50, 36, 10, 7, 5, 3, '#ffe57a', 5, 2.2) +
    `<circle cx="50" cy="36" r="4" fill="#f2b21e" stroke-width="2"/>`,
  연잎:
    water('#3b8fe0') +
    `<path d="M14 84q6-4 12 0M72 20q6-4 12 0M18 24q6-4 12 0" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M50 56L60 20C82 24 94 42 88 62C82 82 62 90 42 86C20 82 8 62 16 42C22 28 36 20 48 20Z" fill="#43b04a"/>` +
    `<path d="M50 56L30 32M50 56L18 56M50 56L30 80M50 56L58 86M50 56L82 72M50 56L86 44" stroke="#2a7a34" stroke-width="2.5"/>` +
    `<path d="M50 56L60 20M50 56L48 20" stroke-width="3"/>` +
    dot(50, 56, 3, '#2a7a34') +
    `<circle cx="66" cy="60" r="7" fill="#bfe6ff" stroke-width="2.5"/>` +
    dot(64, 58, 2, '#fff'),

  // ── 하늘 ──
  먹구름:
    `<path d="M30 70L26 84M46 72L42 88M62 70L58 86M76 68L72 80" stroke="#4a90e2" stroke-width="3.5"/>` +
    blob('#5f6a85', [
      [30, 50, 16],
      [48, 38, 20],
      [68, 44, 17],
      [82, 54, 11],
      [16, 58, 10],
      [50, 58, 14],
    ]) +
    `<path d="M36 44C38 38 42 34 48 32" stroke="#8a96b0" stroke-width="3.5"/>`,
  뭉게구름:
    `<rect x="5" y="5" width="90" height="90" rx="14" fill="#7ec8f0"/>` +
    blob('#fff', [
      [50, 34, 16],
      [34, 44, 14],
      [66, 44, 14],
      [22, 60, 12],
      [78, 60, 12],
      [40, 60, 14],
      [60, 60, 14],
      [50, 50, 14],
    ]) +
    `<path d="M14 70H86" stroke="#fff" stroke-width="10"/>` +
    `<path d="M30 38C32 32 36 28 42 26" stroke="#dfe8f5" stroke-width="3.5"/>`,
  눈송이:
    tube(
      [0, 60, 120]
        .map((a) => {
          const r = (a * Math.PI) / 180;
          const dx = f1(38 * Math.cos(r));
          const dy = f1(38 * Math.sin(r));
          return `M${f1(50 - dx)} ${f1(50 - dy)}L${f1(50 + dx)} ${f1(50 + dy)}`;
        })
        .join('') +
        [0, 60, 120, 180, 240, 300]
          .map((a) => {
            const pt = (d: number, off: number) => {
              const r = ((a + off) * Math.PI) / 180;
              return `${f1(50 + d * Math.cos(r))} ${f1(50 + d * Math.sin(r))}`;
            };
            const base = (d: number) => {
              const r = (a * Math.PI) / 180;
              return `${f1(50 + d * Math.cos(r))} ${f1(50 + d * Math.sin(r))}`;
            };
            return `M${pt(34, 16)}L${base(24)}L${pt(34, -16)}`;
          })
          .join(''),
      '#bfe6ff',
      5,
    ) +
    `<circle cx="50" cy="50" r="7" fill="#fff"/>`,
  빗방울:
    blob('#dfe8f5', [
      [34, 20, 12],
      [52, 16, 14],
      [68, 22, 11],
      [22, 26, 7],
      [80, 28, 7],
    ]) +
    drop(30, 40, 1.8) +
    drop(58, 36, 2.1) +
    drop(44, 64, 1.9) +
    drop(76, 60, 1.7) +
    `<path d="M14 90q4-6 8 0M64 92q4-6 8 0M40 92h8" stroke="#4a90e2" stroke-width="3"/>`,
  해돋이:
    `<rect x="5" y="5" width="90" height="90" rx="14" fill="#ffe2a0"/>` +
    `<path d="M50 20V10M26 30L20 22M74 30L80 22M16 50H8M84 50H92" stroke="#ff9f1a" stroke-width="5"/>` +
    `<path d="M20 62A30 30 0 0 1 80 62Z" fill="#ff9f1a"/>` +
    `<path d="M40 44L50 34L60 44" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M5 62H95V81C95 89 89 95 81 95H19C11 95 5 89 5 81Z" fill="#3b8fe0"/>` +
    `<path d="M36 70H64M42 78H58M46 86H54" stroke="#ffd23f" stroke-width="4"/>`,
};
