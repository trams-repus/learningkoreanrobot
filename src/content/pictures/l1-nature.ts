// 그림 묶음: 자연(꽃·산·강·돌 …)과 몸의 작은 부위(귀·이빨·혀·목·무릎 …).
// 규칙은 docs/picture-style.md. 몸 부위는 기존 코·이마·어깨처럼 노란 점선 고리(ring)로 그 자리를 가리킨다.
import { INK, SKIN, dot, blob, ring, face, cheeks, sparkle, tube } from '../pictureKit.ts';

const HAIR = '#5a3b24';

/** face()와 같은 얼굴이되 귀 크기와 입을 바꿀 수 있다 (귀·이빨·혀) */
function head(mouth: string, extra = '', earR = 7): string {
  return (
    `<circle cx="${28 - earR}" cy="56" r="${earR}" fill="${SKIN}"/><circle cx="${72 + earR}" cy="56" r="${earR}" fill="${SKIN}"/>` +
    `<circle cx="50" cy="54" r="29" fill="${SKIN}"/>` +
    `<path d="M21 50C19 27 35 20 50 20S81 27 79 50C74 40 63 34 50 34S26 40 21 50Z" fill="${HAIR}"/>` +
    dot(40, 55) +
    dot(60, 55) +
    `<path d="M50 58q-3 5 0 7"/>` +
    cheeks(66, 17) +
    mouth +
    extra
  );
}

/** 물방울 한 알: (x, y)는 뾰족한 끝, s는 크기 */
function waterDrop(x: number, y: number, s: number, fill: string): string {
  const r = 16 * s;
  const f = (n: number) => +n.toFixed(1);
  return (
    `<path d="M${x} ${y}C${f(x - 4 * s)} ${f(y + 10 * s)} ${f(x - r)} ${f(y + 20 * s)} ${f(x - r)} ${f(y + 32 * s)}` +
    `A${f(r)} ${f(r)} 0 0 0 ${f(x + r)} ${f(y + 32 * s)}C${f(x + r)} ${f(y + 20 * s)} ${f(x + 4 * s)} ${f(y + 10 * s)} ${x} ${y}Z" fill="${fill}"/>` +
    `<path d="M${f(x - 9 * s)} ${f(y + 32 * s)}C${f(x - 9 * s)} ${f(y + 38 * s)} ${f(x - 5 * s)} ${f(y + 42 * s)} ${f(x - 1 * s)} ${f(y + 43 * s)}" stroke="#fff" stroke-width="${f(Math.max(2.5, 4 * s))}"/>`
  );
}

/** 뾰족한 나무 (숲) */
function pine(x: number, top: number, h: number, fill: string): string {
  const w = h * 0.42;
  return (
    `<rect x="${x - 3}" y="${top + h - 4}" width="6" height="10" fill="#9a5b2e"/>` +
    `<path d="M${x} ${top + h * 0.3}L${x + w} ${top + h}H${x - w}Z" fill="${fill}"/>` +
    `<path d="M${x} ${top}L${x + w * 0.75} ${top + h * 0.55}H${x - w * 0.75}Z" fill="${fill}"/>`
  );
}

export const PICS: Record<string, string> = {
  // ── 자연 ──
  꽃:
    tube('M50 92V50', '#43b04a', 5) +
    `<path d="M50 86C36 86 26 74 28 62C40 62 48 72 50 86Z" fill="#43b04a"/><path d="M50 78C62 78 72 68 72 56C60 56 52 66 50 78Z" fill="#43b04a"/>` +
    `<path d="M28 14L40 26L50 10L60 26L72 14C78 36 68 54 50 54S22 36 28 14Z" fill="#ff5c70"/>` +
    `<path d="M40 26C39 38 43 48 50 54M60 26C61 38 57 48 50 54" stroke="#c62f3f" stroke-width="2.5"/>`,
  잎:
    tube('M24 78L10 92', '#3a9e47', 4) +
    `<path d="M22 80C16 46 40 16 88 12C90 52 62 84 22 80Z" fill="#43b04a"/>` +
    `<g stroke="#2a7a34" stroke-width="3"><path d="M22 80L78 22"/><path d="M36 66L32 48M36 66L54 70M50 51L48 32M50 51L68 55M64 37L64 22M64 37L78 40"/></g>`,
  산:
    `<path d="M38 88L68 28L96 88Z" fill="#3a9e47"/><path d="M4 88L36 18L72 88Z" fill="#5fc24a"/>` +
    `<path d="M28.7 34L36 18L43.3 32L40 30L36 35L32 31Z" fill="#fff"/>` +
    `<path d="M62.5 39L68 28L73.5 39L70.5 36.5L68 40L65 37Z" fill="#fff"/>` +
    `<path d="M4 88H96"/>`,
  강:
    `<rect x="5" y="6" width="90" height="88" rx="14" fill="#8fd67a"/>` +
    `<path d="M46 7C34 18 38 28 50 38C62 48 62 58 44 68C30 76 26 86 26 93H74C70 86 70 80 76 74C88 62 84 44 70 34C60 26 54 18 58 7Z" fill="#3b8fe0"/>` +
    `<path d="M40 84q5-4 10 0t10 0M60 52q4-3 8 0t8 0M50 22q3-3 6 0" stroke="#bfe6ff" stroke-width="3"/>` +
    blob('#3a9e47', [
      [20, 28, 7],
      [28, 24, 6],
    ]) +
    blob('#3a9e47', [
      [84, 84, 6],
      [78, 20, 5],
    ]),
  돌:
    `<path d="M6 88H94" />` +
    `<path d="M10 84C8 70 18 60 32 60C46 60 52 72 48 84Z" fill="#8a96b0"/>` +
    `<path d="M46 84C46 74 54 68 66 68C78 68 86 76 84 84Z" fill="#b4bdd0"/>` +
    `<path d="M30 60C28 48 36 40 46 40C58 40 64 48 60 58C54 62 40 62 30 60Z" fill="#a4aec4"/>` +
    `<path d="M80 84C80 78 84 74 89 74C94 74 96 80 94 84Z" fill="#8a96b0"/>` +
    `<path d="M16 72C18 67 22 65 26 64M36 48C38 45 41 44 44 44M54 76C56 73 59 72 62 72" stroke="#eef2f9" stroke-width="3"/>`,
  바위:
    `<path d="M6 88C6 66 14 46 30 34C42 22 62 20 76 32C90 44 94 66 94 88Z" fill="#8a96b0"/>` +
    `<path d="M50 36L58 50L52 60M72 58L80 70" stroke="#5f6a85" stroke-width="3"/>` +
    `<path d="M22 56C24 46 32 36 42 32" stroke="#dfe8f5" stroke-width="5"/>` +
    `<path d="M4 88H96"/>` +
    `<path d="M14 88l2-8 3 8 3-7 2 7M80 88l2-8 3 8 3-7 2 7" stroke="#3a9e47" stroke-width="3"/>`,
  섬:
    `<path d="M16 72C22 56 76 54 84 72Z" fill="#ffe2a0"/>` +
    tube('M44 64C44 48 50 34 58 26', '#9a5b2e', 6) +
    `<path d="M58 26C46 18 30 22 24 36C34 28 46 28 58 26Z" fill="#43b04a"/>` +
    `<path d="M58 26C52 12 40 6 30 10C42 14 50 18 58 26Z" fill="#43b04a"/>` +
    `<path d="M58 26C66 10 80 8 90 16C78 16 66 20 58 26Z" fill="#43b04a"/>` +
    `<path d="M58 26C72 24 86 30 90 44C80 36 68 30 58 26Z" fill="#43b04a"/>` +
    dot(54, 31, 4, '#6b3e26') +
    dot(62, 32, 4, '#6b3e26') +
    `<path d="M4 70q7.7-6 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0V92H4Z" fill="#3b8fe0"/>` +
    `<path d="M4 82q7.7-5 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0V92H4Z" fill="#2a6fc4"/>`,
  폭포:
    `<ellipse cx="50" cy="84" rx="44" ry="10" fill="#3b8fe0"/>` +
    `<rect x="30" y="14" width="40" height="70" fill="#4aa8f0"/>` +
    `<path d="M38 22V74M50 20V78M62 22V72" stroke="#dff4ff" stroke-width="3.5"/>` +
    `<path d="M4 84V22C10 14 22 12 32 16V84Z" fill="#8a96b0"/><path d="M96 84V22C90 14 78 12 68 16V84Z" fill="#8a96b0"/>` +
    `<path d="M4 24C10 14 22 12 32 16V22C22 18 12 20 4 28Z" fill="#43b04a"/><path d="M96 24C90 14 78 12 68 16V22C78 18 88 20 96 28Z" fill="#43b04a"/>` +
    `<path d="M14 44L22 52M80 56L88 48M16 68L24 64" stroke="#5f6a85" stroke-width="3"/>` +
    blob('#fff', [
      [34, 80, 7],
      [50, 78, 9],
      [66, 80, 7],
    ]),
  화산:
    blob('#c9d3e6', [
      [44, 28, 9],
      [56, 20, 10],
      [70, 15, 8],
    ]) +
    `<path d="M6 90L36 40H64L94 90Z" fill="#9a5b2e"/>` +
    `<path d="M36 40L41 49C43 53 47 52 47 46C49 55 55 55 55 47C57 51 61 50 62 44L64 40Z" fill="#e8553d"/>` +
    `<path d="M40 40H60" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M4 90H96"/>` +
    `<path d="M22 78L30 70M72 66L78 76" stroke="#6b3e26" stroke-width="3"/>`,
  숲:
    `<path d="M4 90C30 84 70 84 96 90V94H4Z" fill="#8fd67a"/>` +
    pine(20, 20, 64, '#3a9e47') +
    pine(80, 16, 68, '#3a9e47') +
    `<rect x="35" y="54" width="7" height="34" fill="#9a5b2e"/>` +
    blob('#5fc24a', [
      [38, 42, 15],
      [30, 54, 9],
      [46, 54, 9],
    ]) +
    `<rect x="59" y="52" width="7" height="36" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [62, 36, 16],
      [54, 50, 10],
      [72, 50, 10],
    ]) +
    pine(50, 50, 38, '#2f8a3a'),
  씨앗:
    `<path d="M4 50H96V88C96 92 94 94 90 94H10C6 94 4 92 4 88Z" fill="#9a5b2e"/>` +
    `<path d="M4 50H96"/>` +
    `<path d="M50 78V26" stroke="${INK}" stroke-width="10"/><path d="M50 78V26" stroke="#5fc24a" stroke-width="4"/>` +
    `<path d="M50 34C40 36 28 30 26 18C38 16 48 22 50 34Z" fill="#5fc24a"/><path d="M50 30C58 32 72 26 74 12C62 10 52 18 50 30Z" fill="#5fc24a"/>` +
    `<path d="M46 82L40 88M54 82L60 88" stroke="#f5deb3" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="78" rx="9" ry="6" fill="#f2c14e"/>` +
    `<ellipse cx="20" cy="74" rx="8" ry="5.5" fill="#f2c14e" transform="rotate(-25 20 74)"/>` +
    `<ellipse cx="80" cy="76" rx="8" ry="5.5" fill="#f2c14e" transform="rotate(20 80 76)"/>`,
  선인장:
    tube('M42 56H32Q26 56 26 50V36', '#43b04a', 11) +
    tube('M58 46H67Q73 46 73 40V26', '#43b04a', 11) +
    `<rect x="39" y="16" width="22" height="58" rx="11" fill="#43b04a"/>` +
    `<path d="M50 24V68" stroke="#2f8a3a" stroke-width="2.5"/>` +
    `<g stroke-width="2"><path d="M39 30h-4M39 44h-4M61 34h4M61 58h4M22 42h-3M77 32h3"/></g>` +
    `<circle cx="50" cy="13" r="5" fill="#ff5c8a"/>` +
    `<path d="M24 66H76V76H24Z" fill="#e8862e"/><path d="M28 76H72L66 94H34Z" fill="#e8862e"/>`,
  해바라기:
    tube('M50 62V94', '#43b04a', 6) +
    `<path d="M50 84C38 86 26 78 24 68C36 66 46 74 50 84Z" fill="#43b04a"/><path d="M50 78C62 80 74 72 76 62C64 60 54 68 50 78Z" fill="#43b04a"/>` +
    Array.from({ length: 12 }, (_, k) => {
      const a = (k * 360) / 12;
      const rad = (a * Math.PI) / 180;
      const x = +(50 + 21 * Math.cos(rad)).toFixed(1);
      const y = +(38 + 21 * Math.sin(rad)).toFixed(1);
      return `<ellipse cx="${x}" cy="${y}" rx="10" ry="5.5" fill="#ffd23f" transform="rotate(${a} ${x} ${y})"/>`;
    }).join('') +
    `<circle cx="50" cy="38" r="14" fill="#6b3e26"/>` +
    [
      [45, 33],
      [55, 33],
      [50, 39],
      [44, 43],
      [56, 43],
    ]
      .map(([x, y]) => dot(x, y, 2, '#c98b4f'))
      .join(''),
  장미:
    tube('M50 62V94', '#3a9e47', 6) +
    `<path d="M50 84C38 86 28 78 26 70C38 68 46 74 50 84Z" fill="#43b04a"/><path d="M50 76C62 78 72 70 74 62C62 60 54 66 50 76Z" fill="#43b04a"/>` +
    `<path d="M32 32C30 18 40 10 50 10S70 18 68 32Z" fill="#c62f3f"/>` +
    `<path d="M24 24C22 48 34 62 50 62S78 48 76 24C70 34 60 38 50 38S30 34 24 24Z" fill="#e8403a"/>` +
    `<path d="M38 36C38 26 46 20 52 22C58 24 58 32 52 32C48 32 48 28 50 27" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 38C42 44 40 54 44 61M50 38C58 44 60 54 56 61" stroke="#a82830" stroke-width="2.5"/>`,
  불:
    [
      [18, 88],
      [82, 88],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#8a96b0"/>`)
      .join('') +
    `<path d="M50 8C58 24 76 34 74 56C72 72 62 82 50 82S28 72 26 56C24 42 34 36 36 24C42 32 42 38 44 42C47 32 44 20 50 8Z" fill="#ff9f1a"/>` +
    `<path d="M50 36C57 46 63 54 61 64C59 73 55 78 50 78S41 73 39 64C39 56 46 50 50 36Z" fill="#ffd23f"/>` +
    tube('M24 90L76 74', '#9a5b2e', 9) +
    tube('M24 74L76 90', '#6b3e26', 9) +
    dot(20, 30, 2.8, '#ff9f1a') +
    dot(80, 22, 2.8, '#ffd23f') +
    dot(78, 40, 2.4, '#ff9f1a'),
  눈사람:
    `<circle cx="50" cy="52" r="44" fill="#dff1ff" stroke="none"/>` +
    `<path d="M30 68L14 54M18 57L10 58M18 57L16 49M70 68L86 54M82 57L90 58M82 57L84 49" stroke="#6b3e26" stroke-width="3.5"/>` +
    `<circle cx="50" cy="72" r="21" fill="#fff"/><circle cx="50" cy="40" r="16" fill="#fff"/>` +
    `<path d="M35 36C35 18 65 18 65 36Z" fill="#e8553d"/><rect x="33" y="31" width="34" height="7" rx="3" fill="#ffd23f"/>` +
    `<circle cx="50" cy="16" r="5" fill="#fff"/>` +
    dot(44, 43, 2.6) +
    dot(56, 43, 2.6) +
    `<path d="M50 47L62 50L50 52Z" fill="#ff8c1a"/>` +
    `<path d="M45 53q5 3 10 0" stroke-width="2.5"/>` +
    dot(50, 66, 2.6) +
    dot(50, 76, 2.6) +
    cheeks(50, 10),
  물방울:
    waterDrop(40, 12, 1.4, '#4aa8f0') +
    waterDrop(76, 44, 0.8, '#7ec8f0') +
    waterDrop(76, 10, 0.5, '#4aa8f0'),
  모래:
    `<path d="M10 66H30L27 90H13Z" fill="#ffd23f"/><path d="M12 66C12 56 28 56 28 66" stroke-width="2.5"/>` +
    `<path d="M20 90C28 62 42 48 58 48C74 48 88 64 94 90Z" fill="#f2c14e"/>` +
    [
      [44, 66],
      [58, 60],
      [70, 72],
      [52, 80],
      [80, 82],
      [36, 84],
      [64, 86],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#b8862a'))
      .join('') +
    tube('M72 14L62 44', '#e8553d', 5) +
    `<path d="M66 12H80" stroke-width="7"/><path d="M66 12H80" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M54 42L68 48L64 58C60 62 52 60 50 54Z" fill="#3b78e6"/>` +
    `<path d="M6 90H96"/>`,

  // ── 몸 ──
  귀: head(`<path d="M42 72q8 6 16 0"/>`, `<path d="M15 51q-3 5 0 10M85 51q3 5 0 10" stroke-width="2.5"/>` + ring(17, 56, 12, 15) + ring(83, 56, 12, 15), 10),
  이빨: head(
    `<path d="M32 66H68C66 80 58 86 50 86S34 80 32 66Z" fill="#c62f3f"/>` +
      `<path d="M34 66H66L65 75H35Z" fill="#fff"/><path d="M42 66V75M50 66V75M58 66V75" stroke-width="2"/>` +
      ring(50, 71, 22, 9) +
      sparkle(82, 78, 7),
  ),
  혀: head(
    `<path d="M35 66C40 75 60 75 65 66Z" fill="#c62f3f"/>` +
      `<path d="M40 70C38 92 62 92 60 70C54 73 46 73 40 70Z" fill="#ff5c70"/><path d="M50 74V83" stroke="#c62f3f" stroke-width="2.5"/>` +
      ring(50, 80, 17, 12),
  ),
  목:
    `<path d="M18 96V78C18 66 32 60 50 60S82 66 82 78V96Z" fill="#3b78e6"/>` +
    `<rect x="41" y="30" width="18" height="34" rx="4" fill="${SKIN}"/>` +
    `<path d="M40 62Q50 70 60 62" fill="#3b78e6"/>` +
    `<circle cx="50" cy="24" r="16" fill="${SKIN}"/>` +
    `<path d="M34 22C34 8 44 6 50 6S66 8 66 22C62 15 56 14 50 14S38 15 34 22Z" fill="${HAIR}"/>` +
    dot(44, 25, 2.4) +
    dot(56, 25, 2.4) +
    `<path d="M45 31q5 3 10 0" stroke-width="2.5"/>` +
    ring(50, 50, 15, 10),
  무릎:
    `<rect x="29" y="34" width="15" height="50" rx="5" fill="${SKIN}"/><rect x="56" y="34" width="15" height="50" rx="5" fill="${SKIN}"/>` +
    `<path d="M26 6H74L76 38H54L50 30L46 38H24Z" fill="#3b78e6"/>` +
    `<path d="M32 60q4.5 3 9 0M59 60q4.5 3 9 0" stroke-width="2.5"/>` +
    `<path d="M28 82H45V92H20C20 86 23 82 28 82Z" fill="#e8553d"/><path d="M55 82H72C77 82 80 86 80 92H55Z" fill="#e8553d"/>` +
    ring(36.5, 59, 12, 10) +
    ring(63.5, 59, 12, 10),
  발가락:
    `<path d="M36 40C30 54 30 68 34 80C38 92 58 94 64 82C68 72 64 64 66 54C68 44 64 38 56 36C48 34 40 34 36 40Z" fill="${SKIN}"/>` +
    [
      [38, 28, 8],
      [52, 22, 6.5],
      [62, 25, 5.5],
      [70, 31, 5],
      [75, 39, 4.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`)
      .join('') +
    `<path d="M35 24q3-2 6 0M50 19q2.5-1.5 5 0" stroke-width="2"/>` +
    ring(56, 29, 29, 17),
  손가락:
    `<rect x="30" y="18" width="10" height="32" rx="5" fill="${SKIN}"/><rect x="42" y="10" width="10" height="38" rx="5" fill="${SKIN}"/>` +
    `<rect x="54" y="12" width="10" height="36" rx="5" fill="${SKIN}"/><rect x="66" y="22" width="9" height="28" rx="4.5" fill="${SKIN}"/>` +
    `<path d="M30 60C20 54 12 44 16 39C20 35 28 42 34 50Z" fill="${SKIN}"/>` +
    `<path d="M28 44H76V70C76 84 66 90 52 90S28 82 28 70Z" fill="${SKIN}"/>` +
    ring(52, 28, 29, 22),
  손톱:
    `<rect x="38" y="10" width="22" height="52" rx="11" fill="${SKIN}"/>` +
    `<path d="M26 60C26 52 32 48 40 48H66C74 48 78 54 78 62V76C78 88 68 94 54 94H42C32 94 26 86 26 76Z" fill="${SKIN}"/>` +
    `<path d="M60 62H77M60 74H77" stroke-width="2.5"/>` +
    `<path d="M28 66C36 60 48 60 58 68" stroke-width="3"/>` +
    `<path d="M42 28V20C42 16 45 14 49 14S56 16 56 20V28C56 31 42 31 42 28Z" fill="#ffc2d1"/>` +
    `<path d="M46 18V23" stroke="#fff" stroke-width="2.5"/>` +
    ring(49, 22, 15, 15),
  머리카락:
    `<path d="M16 54C12 22 30 8 50 8S88 22 84 54L88 84C80 90 70 86 70 78H30C30 86 20 90 12 84Z" fill="#6b3e26"/>` +
    `<circle cx="50" cy="54" r="24" fill="${SKIN}"/>` +
    `<path d="M26 50C24 30 36 22 50 22S76 30 74 50C68 40 60 36 50 38C40 36 32 40 26 50Z" fill="#6b3e26"/>` +
    `<path d="M20 60L18 78M80 60L82 78M40 14C36 18 34 24 34 28M60 14C64 18 66 24 66 28" stroke="#9a6440" stroke-width="3"/>` +
    dot(42, 56) +
    dot(58, 56) +
    `<path d="M44 66q6 5 12 0"/>` +
    cheeks(64, 14) +
    ring(50, 22, 38, 16),
  턱: face(ring(50, 84, 16, 7)),
  볼: face(
    `<circle cx="33" cy="66" r="7" fill="#ff7a90" stroke="none" opacity=".6"/><circle cx="67" cy="66" r="7" fill="#ff7a90" stroke="none" opacity=".6"/>` +
      ring(32, 66, 10, 9) +
      ring(68, 66, 10, 9),
  ),
  입술: face(
    `<path d="M32 72C37 63 44 62 50 66C56 62 63 63 68 72C60 75 40 75 32 72Z" fill="#ff5c70"/>` +
      `<path d="M32 72C38 85 62 85 68 72C60 75 40 75 32 72Z" fill="#ff8aa0"/>` +
      `<path d="M55 78.5l5-1.5" stroke="#fff" stroke-width="2.5"/>` +
      ring(50, 73, 23, 12),
  ),
};

