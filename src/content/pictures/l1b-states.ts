// L1 상태·느낌·색·모양 묶음 (좁다·맵다·신나다·빨강·동그라미 …). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, ring, stick, person, moodFace, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

/** 표정 얼굴 (moodFace 모양)을 (x, y)에 s배로. inner는 moodFace 좌표(가운데 50,54)로 쓴다 */
const hd = (x: number, y: number, s: number, inner: string, skin = SKIN) =>
  `<g transform="translate(${x} ${y}) scale(${s}) translate(-50 -54)" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<circle cx="50" cy="54" r="32" fill="${skin}"/>` +
  `<path d="M18 50C17 26 33 20 50 20S83 26 82 50C76 40 64 35 50 35S24 40 18 50Z" fill="#5a3b24"/>` +
  inner +
  `</g>`;

/** 꼭 감은 눈 > < */
const squeeze = `<path d="M33 49l11 6-11 6M67 49l-11 6 11 6" stroke-width="4"/>`;
/** 웃는 눈 ^ ^ */
const happyEyes = `<path d="M34 56q6-8 12 0M54 56q6-8 12 0" stroke-width="4"/>`;

/** 하트 (가운데 x, y, 크기 s) */
const heart = (x: number, y: number, s: number, fill: string) =>
  `<path d="M${x} ${y + 0.9 * s}C${x - 1.4 * s} ${y + 0.05 * s} ${x - 0.95 * s} ${y - 0.95 * s} ${x} ${y - 0.35 * s}` +
  `C${x + 0.95 * s} ${y - 0.95 * s} ${x + 1.4 * s} ${y + 0.05 * s} ${x} ${y + 0.9 * s}Z" fill="${fill}"/>`;

/** 음표 */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 18}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 별 (가운데 x, y, 바깥 반지름 r) */
const star = (x: number, y: number, r: number, fill: string, sw = '') =>
  `<path d="M${Array.from({ length: 10 }, (_, k) => {
    const a = (k * Math.PI) / 5 - Math.PI / 2;
    const rr = k % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join('L')}Z" fill="${fill}"${sw}/>`;

/** 물감 얼룩 (색 이름) */
const splat = (fill: string) =>
  blob(fill, [
    [50, 52, 25],
    [30, 40, 12],
    [70, 35, 12],
    [75, 66, 12],
    [29, 69, 12],
    [52, 27, 10],
    [54, 78, 11],
    [22, 54, 8],
    [80, 50, 8],
  ]) +
  `<g fill="${fill}"><circle cx="13" cy="22" r="5.5"/><circle cx="88" cy="16" r="4.5"/><circle cx="89" cy="85" r="5.5"/><circle cx="13" cy="88" r="4"/><circle cx="92" cy="36" r="3"/></g>` +
  `<ellipse cx="40" cy="42" rx="8" ry="4.5" fill="#fff" opacity=".5" stroke="none" transform="rotate(-30 40 42)"/>`;

export const PICS: Record<string, string> = {
  // ── 크기·모양·느낌 ──
  좁다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    `<path d="M5 90V30H47V90H38V46H14V90Z" fill="#b8c2d6"/>` +
    `<circle cx="26" cy="80" r="9" fill="#e8553d"/>` +
    `<path d="M53 90V30H95V90H77V46H71V90Z" fill="#e8862e"/>` +
    `<circle cx="74" cy="21" r="9" fill="#e8553d"/>` +
    `<path d="M74 34V42M70 38l4 4 4-4" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M20 58l-4 4 4 4M32 58l4 4-4 4M17 62H35" stroke="#3b78e6" stroke-width="3"/>`,
  두껍다:
    `<path d="M4 86H96" stroke="#c9b28a"/>` +
    `<rect x="8" y="36" width="54" height="50" rx="4" fill="#e8553d"/><rect x="14" y="43" width="48" height="36" fill="#fff"/>` +
    `<path d="M20 52H58M20 61H58M20 70H58" stroke="#c9ced9" stroke-width="3"/>` +
    `<rect x="70" y="76" width="26" height="10" rx="2" fill="#3b78e6"/><rect x="74" y="79" width="22" height="4" fill="#fff" stroke-width="2"/>` +
    ring(35, 61, 31, 31),
  어둡다:
    `<rect x="6" y="6" width="88" height="88" rx="8" fill="#26305a"/>` +
    `<rect x="26" y="14" width="48" height="40" rx="4" fill="#3d4f8f" stroke="#10152e"/>` +
    `<path d="M56 20A14 14 0 1 0 66 44A11 11 0 1 1 56 20Z" fill="#ffd23f" stroke="#10152e"/>` +
    sparkle(36, 26, 4, '#fff6c4') +
    sparkle(40, 44, 3, '#fff6c4') +
    `<rect x="16" y="70" width="68" height="16" rx="5" fill="#34427a" stroke="#10152e"/>` +
    `<rect x="20" y="62" width="20" height="10" rx="5" fill="#4a5a96" stroke="#10152e"/>`,
  맵다:
    `<path d="M26 80C38 94 70 96 90 82C72 86 50 84 34 74Z" fill="#e8553d"/><path d="M30 77C26 72 22 70 18 72" stroke="#3a9e47" stroke-width="5"/>` +
    hd(36, 40, 0.78, squeeze + `<ellipse cx="50" cy="72" rx="10" ry="9" fill="#c62f3f"/>`, '#ffab94') +
    `<path d="M42 50C54 40 62 50 70 38C72 46 80 46 94 40C86 50 94 56 96 64C84 58 78 68 66 62C58 62 50 62 42 58Z" fill="#ff9f1a"/>` +
    `<path d="M48 53C58 48 64 52 72 46C72 52 80 53 86 52C76 58 66 58 48 56Z" fill="#ffd23f" stroke="none"/>` +
    drop(12, 10, 0.6) +
    drop(62, 8, 0.6),
  짜다:
    hd(
      38,
      48,
      0.8,
      squeeze +
        `<path d="M36 72q4-5 7 0t7 0 7 0 7 0" stroke-width="4"/><path d="M46 74C46 86 58 86 58 74Z" fill="#ff8aa0"/>`,
    ) +
    `<path d="M71 52H93L91 92H73Z" fill="#fff"/><path d="M71 52C71 36 93 36 93 52Z" fill="#8a96b0"/>` +
    dot(78, 45, 1.8) +
    dot(86, 45, 1.8) +
    dot(82, 40, 1.8) +
    `<g fill="#fff" stroke-width="2"><rect x="72" y="22" width="4" height="4"/><rect x="82" y="16" width="4" height="4"/><rect x="88" y="26" width="4" height="4"/></g>` +
    drop(16, 12, 0.6),
  시다:
    hd(
      38,
      48,
      0.8,
      squeeze +
        `<path d="M30 42l10 3M70 42l-10 3" stroke-width="3.5"/>` +
        `<circle cx="50" cy="74" r="5" fill="#c62f3f"/><path d="M42 70q-3 4 0 8M58 70q3 4 0 8" stroke-width="2.5"/>`,
      '#f7e6a0',
    ) +
    `<path d="M4 38l4 5-4 5 4 5M72 38l-4 5 4 5-4 5" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="78" cy="76" r="17" fill="#ffd23f"/><circle cx="78" cy="76" r="12" fill="#fff4a8" stroke-width="2.5"/>` +
    `<path d="M78 64V88M66 76H90M70 68L86 84M86 68L70 84" stroke="#ffd23f" stroke-width="2.5"/>`,
  딱딱하다:
    `<path d="M4 88H96" stroke="#c9b28a"/>` +
    `<path d="M8 88L16 46L40 24L66 26L90 52L93 88Z" fill="#8a96b0"/>` +
    `<path d="M40 24L66 26L58 50L42 52Z" fill="#b8c2d6" stroke="none"/><path d="M42 52L58 50L66 88M42 52L18 50M58 50L86 54M42 52L36 88" stroke-width="2.5"/>` +
    sparkle(30, 44, 6, '#fff') +
    sparkle(74, 60, 4, '#fff'),
  말랑하다:
    `<ellipse cx="50" cy="88" rx="42" ry="7" fill="#fff"/>` +
    `<path d="M18 86C14 62 22 40 38 38C44 38 46 45 52 45C58 45 60 38 66 38C80 40 86 62 82 86Z" fill="#5fc24a"/>` +
    `<ellipse cx="30" cy="58" rx="4" ry="9" fill="#fff" opacity=".6" stroke="none"/>` +
    dot(42, 64, 3) +
    dot(62, 64, 3) +
    `<path d="M46 72q6 5 12 0" stroke-width="3"/>` +
    tube('M52 4V32', SKIN, 11) +
    `<ellipse cx="52" cy="37" rx="9" ry="7.5" fill="${SKIN}"/>` +
    `<path d="M6 54q4 4 0 8t0 8M94 54q-4 4 0 8t0 8" stroke="#9aa6c4" stroke-width="3"/>`,
  부드럽다:
    `<path d="M50 70V96" stroke="#3a9e47" stroke-width="5"/>` +
    `<path d="M22 60L30 80L50 70L70 80L78 60C62 72 38 72 22 60Z" fill="#9a5b2e"/>` +
    blob('#fff', [
      [50, 46, 22],
      [30, 50, 15],
      [70, 50, 15],
      [38, 30, 14],
      [62, 30, 14],
      [50, 62, 14],
      [22, 38, 10],
      [78, 38, 10],
    ]) +
    `<path d="M36 46q4-3 8 0M56 46q4-3 8 0" stroke="#dfe8f5" stroke-width="3"/>` +
    sparkle(12, 16, 5) +
    sparkle(88, 14, 6) +
    sparkle(90, 72, 4),
  뾰족하다:
    `<g transform="translate(12 88) rotate(-45)">` +
    `<rect x="0" y="-10" width="14" height="20" rx="4" fill="#ff9aa8"/><rect x="12" y="-10" width="8" height="20" fill="#8a96b0"/>` +
    `<rect x="20" y="-10" width="50" height="20" fill="#ffd23f"/><path d="M20 -3H70" stroke="#e8a620" stroke-width="2.5"/>` +
    `<path d="M70 -10L98 0L70 10Z" fill="#f5c99a"/><path d="M89 -3.2L98 0L89 3.2Z" fill="${INK}" stroke-width="2"/>` +
    `</g>` +
    ring(81, 19, 12) +
    sparkle(92, 32, 5),
  둥글다:
    `<path d="M4 64h12M6 76h14M10 88h12" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="54" cy="52" r="36" fill="#e8553d"/>` +
    `<path d="M19 44Q54 58 89 44L89 60Q54 74 19 60Z" fill="#fff" stroke="none"/>` +
    `<path d="M19 44Q54 58 89 44M19 60Q54 74 89 60" stroke-width="3"/>` +
    `<circle cx="54" cy="52" r="36"/>` +
    `<ellipse cx="38" cy="30" rx="8" ry="5" fill="#fff" opacity=".55" stroke="none" transform="rotate(-35 38 30)"/>`,
  젖다:
    blob('#9fb3d9', [
      [30, 14, 9],
      [46, 11, 11],
      [62, 13, 10],
      [74, 17, 7],
    ]) +
    `<ellipse cx="50" cy="92" rx="38" ry="5" fill="#7ec8f0"/>` +
    person(50, 92, 1.25, { hair: '#5a3b24', style: 'short', shirt: '#ffd23f' }) +
    drop(12, 34, 0.7) +
    drop(86, 32, 0.7) +
    drop(20, 60, 0.6) +
    drop(82, 58, 0.6) +
    drop(34, 26, 0.5) +
    drop(66, 26, 0.5) +
    drop(8, 80, 0.5) +
    drop(92, 78, 0.5) +
    drop(35, 50, 0.45) +
    drop(65, 50, 0.45),
  배부르다:
    `<ellipse cx="38" cy="93" rx="9" ry="4" fill="#3b78e6"/><ellipse cx="62" cy="93" rx="9" ry="4" fill="#3b78e6"/>` +
    `<ellipse cx="50" cy="66" rx="33" ry="26" fill="#ff9f1a"/>` +
    `<ellipse cx="50" cy="72" rx="19" ry="15" fill="${SKIN}"/>` +
    `<circle cx="50" cy="27" r="17" fill="${SKIN}"/>` +
    `<path d="M33 26C32 12 42 9 50 9S68 12 67 26C63 19 57 17 50 17S37 19 33 26Z" fill="#5a3b24"/>` +
    `<path d="M41 28q3-4 6 0M53 28q3-4 6 0" stroke-width="3"/><path d="M44 34q6 5 12 0" stroke-width="3"/>` +
    cheeks(33, 12) +
    `<circle cx="33" cy="72" r="7.5" fill="${SKIN}"/><circle cx="67" cy="70" r="7.5" fill="${SKIN}"/>` +
    `<path d="M16 62l-8-4M14 72H4M16 82l-8 4M84 60l8-4M86 70H96M84 80l8 4" stroke="#9aa6c4" stroke-width="3"/>`,
  목마르다:
    `<circle cx="88" cy="12" r="7" fill="#ffd23f"/>` +
    hd(
      36,
      46,
      0.8,
      dot(44, 55) +
        dot(64, 55) +
        `<path d="M40 70C40 82 60 82 60 70Z" fill="#c62f3f"/><path d="M45 76C45 90 57 90 57 76Z" fill="#ff8aa0"/>`,
    ) +
    drop(14, 12, 0.6) +
    drop(62, 18, 0.5) +
    `<path d="M70 50H94L91 92H73Z" fill="#dfe8f5"/><path d="M71.3 66H92.7L91 92H73Z" fill="#7ec8f0" stroke="none"/><path d="M70 50H94L91 92H73Z"/>` +
    `<path d="M71.5 66H92.5" stroke-width="2.5"/>` +
    sparkle(82, 36, 6, '#7ec8f0'),
  피곤하다:
    moodFace(
      `<path d="M32 55h14M54 55h14" stroke-width="4"/><path d="M33 55q6 5 12 0M55 55q6 5 12 0" stroke-width="3"/>` +
        `<path d="M33 64q6 3 12 0M55 64q6 3 12 0" stroke="#a88cc8" stroke-width="3"/>` +
        `<path d="M38 38v8M46 37v9M54 37v9M62 38v8" stroke="#8e4fc9" stroke-width="3"/>` +
        `<ellipse cx="50" cy="76" rx="8" ry="9" fill="#c62f3f"/>`,
    ) + drop(84, 44, 0.6),
  // ── 마음 ──
  즐겁다:
    moodFace(
      happyEyes +
        `<path d="M32 64H68C68 88 32 88 32 64Z" fill="#c62f3f"/><path d="M40 78C44 83 56 83 60 78C56 75 44 75 40 78Z" fill="#ff8aa0" stroke="none"/>` +
        cheeks(64, 24),
    ) +
    note(10, 26, '#8e4fc9') +
    note(84, 22, '#3b78e6') +
    note(88, 80, '#e85d9a'),
  신나다:
    `<ellipse cx="50" cy="93" rx="16" ry="3.5" fill="#d0d6e6" stroke="none"/>` +
    stick(50, 26, 'M0 10L0 36M0 16L-15 4L-19 -12M0 16L15 4L19 -12M0 36L-12 46L-10 56M0 36L12 46L10 56', 1.05) +
    dot(46, 24, 1.8) +
    dot(54, 24, 1.8) +
    `<path d="M45 29q5 4 10 0" stroke-width="2.5"/>` +
    `<path d="M36 90l-4 3M64 90l4 3M50 86v0" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(16, 20, 7) +
    sparkle(84, 20, 7) +
    sparkle(14, 60, 5, '#ff9aa8') +
    sparkle(86, 60, 5, '#7ec8f0'),
  놀라다:
    moodFace(
      `<circle cx="38" cy="55" r="9" fill="#fff"/><circle cx="62" cy="55" r="9" fill="#fff"/>` +
        dot(38, 55, 4) +
        dot(62, 55, 4) +
        `<path d="M29 41q9-6 18 0M53 41q9-6 18 0" stroke-width="3"/>` +
        `<ellipse cx="50" cy="76" rx="7" ry="9" fill="#c62f3f"/>`,
    ) + `<path d="M10 26l7 6M50 4v9M90 26l-7 6M4 50h8M96 50h-8" stroke="#ff9f1a" stroke-width="4"/>`,
  부끄럽다:
    moodFace(
      `<path d="M34 55q6 5 12 0M54 55q6 5 12 0" stroke-width="4"/>` +
        `<ellipse cx="34" cy="66" rx="10" ry="6" fill="#ff5c70" opacity=".55" stroke="none"/><ellipse cx="66" cy="66" rx="10" ry="6" fill="#ff5c70" opacity=".55" stroke="none"/>` +
        `<path d="M29 68l4-5M35 68l4-5M61 68l4-5M67 68l4-5" stroke="#e8553d" stroke-width="2.5"/>` +
        `<path d="M43 76q3.5-3 7 0t7 0" stroke-width="3"/>` +
        `<ellipse cx="17" cy="72" rx="8" ry="12" fill="${SKIN}"/><ellipse cx="83" cy="72" rx="8" ry="12" fill="${SKIN}"/>`,
    ) +
    heart(12, 22, 6, '#ff9aa8') +
    heart(88, 20, 7, '#ff9aa8'),
  궁금하다:
    `<g transform="rotate(-14 46 54)">` +
    moodFace(
      dot(40, 52) +
        dot(60, 52) +
        `<path d="M30 44h12M56 42q8-7 16 0" stroke-width="3.5"/>` +
        `<path d="M44 73q6-3 12 1" stroke-width="3.5"/>` +
        cheeks(64, 20),
    ) +
    `</g>` +
    tube('M92 98L70 88', SKIN, 9) +
    `<circle cx="67" cy="87" r="7" fill="${SKIN}"/>` +
    `<g fill="#dfe8f5"><circle cx="80" cy="30" r="3.5"/><circle cx="86" cy="20" r="5"/><circle cx="90" cy="8" r="3.5"/></g>`,
  심심하다:
    `<rect x="4" y="84" width="92" height="12" rx="3" fill="#b5793a"/>` +
    `<g transform="rotate(10 50 46)">` +
    hd(
      48,
      44,
      0.85,
      `<path d="M31 54h14M55 54h14" stroke-width="4"/>` +
        dot(35, 58, 3) +
        dot(59, 58, 3) +
        `<path d="M42 74h14" stroke-width="4"/>`,
    ) +
    `</g>` +
    tube('M60 86V76', SKIN, 10) +
    `<ellipse cx="58" cy="72" rx="10" ry="8" fill="${SKIN}"/>` +
    blob('#dfe8f5', [
      [16, 66, 6],
      [10, 58, 4],
    ]),
  행복하다:
    moodFace(happyEyes + `<path d="M36 68q14 14 28 0" stroke-width="4"/>` + cheeks(66, 22)) +
    heart(13, 22, 9, '#ff5c70') +
    heart(87, 20, 10, '#ff5c70') +
    heart(88, 82, 7, '#ff8ac2') +
    heart(12, 82, 7, '#ff8ac2'),
  // ── 거리·소리·온도 ──
  멀다:
    `<rect x="4" y="4" width="92" height="92" rx="6" fill="#bfe6ff"/>` +
    `<path d="M4.5 44H95.5V90C95.5 94 94 95.5 90 95.5H10C6 95.5 4.5 94 4.5 90Z" fill="#8fd16a" stroke="none"/><path d="M4 44H96"/>` +
    `<path d="M22 96L48 44H54L80 96Z" fill="#d9c49a"/><path d="M51 50V92" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>` +
    `<rect x="45" y="34" width="12" height="10" fill="#fff" stroke-width="2.5"/><path d="M42 35L51 27L60 35Z" fill="#e8553d" stroke-width="2.5"/>` +
    ring(51, 36, 13, 12) +
    blob('#43b04a', [
      [14, 54, 9],
      [20, 46, 8],
    ]) +
    `<path d="M16 70V58" stroke="#9a5b2e" stroke-width="5"/>`,
  시끄럽다:
    hd(32, 40, 0.72, squeeze + `<path d="M38 74q4-6 8 0t8 0 8 0" stroke-width="4"/>`) +
    `<ellipse cx="9" cy="42" rx="6" ry="10" fill="${SKIN}"/><ellipse cx="55" cy="42" rx="6" ry="10" fill="${SKIN}"/>` +
    `<path d="M52 72V88C52 96 94 96 94 88V72Z" fill="#e8553d"/><path d="M52 76L62 92L73 76L84 92L94 76" stroke="#fff" stroke-width="3"/>` +
    `<ellipse cx="73" cy="72" rx="21" ry="6" fill="#fff"/>` +
    `<path d="M62 50L70 66M90 48L80 66" stroke="#9a5b2e" stroke-width="4"/><circle cx="62" cy="50" r="4" fill="#e8862e"/><circle cx="90" cy="48" r="4" fill="#e8862e"/>` +
    `<path d="M66 36l4-6 4 6 4-6M80 30l4-6 4 6 4-6M40 70l-6 2 2 6-6 2" stroke="#ff9f1a" stroke-width="3.5"/>`,
  따뜻하다:
    `<rect x="18" y="8" width="10" height="30" fill="#8a96b0"/>` +
    `<rect x="6" y="36" width="36" height="50" rx="8" fill="#6b7590"/><path d="M12 86V92M36 86V92" stroke-width="5"/>` +
    `<rect x="13" y="50" width="22" height="22" rx="5" fill="#ff9f1a"/><path d="M18 70C14 62 22 58 20 52C26 56 30 60 30 70Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M48 46c4-4-4-8 0-12M48 66c4-4-4-8 0-12" stroke="#ff9f1a" stroke-width="3.5"/>` +
    hd(74, 58, 0.64, `<path d="M34 55q6-7 12 0M54 55q6-7 12 0" stroke-width="4"/><path d="M40 70q10 8 20 0" stroke-width="4"/>` + `<circle cx="32" cy="66" r="7" fill="#ff7a8a" stroke="none" opacity=".6"/><circle cx="68" cy="66" r="7" fill="#ff7a8a" stroke="none" opacity=".6"/>`) +
    sparkle(86, 18, 5) +
    sparkle(64, 22, 4),
  시원하다:
    `<ellipse cx="26" cy="92" rx="16" ry="4" fill="#8a96b0"/><path d="M26 66V90" stroke-width="5"/>` +
    `<circle cx="26" cy="44" r="21" fill="#dfe8f5"/>` +
    [0, 120, 240]
      .map((a) => `<ellipse cx="26" cy="33" rx="6" ry="10" fill="#7ec8f0" transform="rotate(${a} 26 44)"/>`)
      .join('') +
    dot(26, 44, 4.5, '#3b78e6') +
    `<path d="M50 32q6-4 12 0t12 0M50 46q6-4 12 0M50 60q6-4 12 0t12 0" stroke="#4a90e2" stroke-width="3.5"/>` +
    hd(78, 58, 0.56, `<path d="M34 56q6-6 12 0M54 56q6-6 12 0" stroke-width="4"/><path d="M40 70q10 8 20 0" stroke-width="4"/>` + cheeks(66, 20)),
  귀엽다:
    `<path d="M24 46L20 14L46 30Z" fill="#ffb35c"/><path d="M76 46L80 14L54 30Z" fill="#ffb35c"/>` +
    `<path d="M26 34L24 20L36 28Z" fill="#ff9aa8" stroke="none"/><path d="M74 34L76 20L64 28Z" fill="#ff9aa8" stroke="none"/>` +
    `<ellipse cx="50" cy="58" rx="33" ry="29" fill="#ffb35c"/>` +
    `<path d="M44 30l2 8M56 30l-2 8" stroke="#e8862e" stroke-width="3"/>` +
    `<ellipse cx="37" cy="58" rx="6.5" ry="8" fill="${INK}" stroke="none"/><ellipse cx="63" cy="58" rx="6.5" ry="8" fill="${INK}" stroke="none"/>` +
    dot(39, 55, 2.6, '#fff') +
    dot(65, 55, 2.6, '#fff') +
    `<path d="M47 66h6l-3 3.5Z" fill="#ff7a8a" stroke-width="2"/><path d="M44 71q3 4 6 0q3 4 6 0" stroke-width="2.5"/>` +
    cheeks(68, 23) +
    heart(12, 80, 6, '#ff5c70') +
    heart(88, 80, 6, '#ff5c70') +
    heart(88, 14, 5, '#ff8ac2'),
  깊다:
    `<rect x="4" y="30" width="92" height="66" rx="4" fill="#b5793a"/><path d="M4.5 30H95.5" stroke="#43b04a" stroke-width="6"/>` +
    `<rect x="38" y="30" width="24" height="62" fill="#3a2f45"/><rect x="38" y="80" width="24" height="12" fill="#4a90e2"/>` +
    `<rect x="28" y="20" width="10" height="12" rx="2" fill="#8a96b0"/><rect x="62" y="20" width="10" height="12" rx="2" fill="#8a96b0"/>` +
    `<path d="M33 20V6M67 20V6" stroke="#6b3e26" stroke-width="4"/><path d="M28 7H72" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M50 8V76" stroke="#e0cfa6" stroke-width="2.5"/><path d="M44 74H56L54 84H46Z" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M82 40V86M75 79l7 7 7-7" stroke="#ffd23f" stroke-width="5"/>` +
    `<path d="M14 50h4M22 70h4M12 86h4" stroke="#8a5a2e" stroke-width="3"/>`,
  반짝이다:
    `<path d="M50 6v8M50 90v6M8 50h8M84 50h8M20 20l6 6M80 20l-6 6M20 82l6-6M80 82l-6-6" stroke="#ff9f1a" stroke-width="4"/>` +
    star(50, 52, 34, '#ffd23f') +
    `<path d="M40 38l4-8" stroke="#fff" stroke-width="4"/>` +
    sparkle(84, 34, 7) +
    sparkle(16, 70, 6) +
    sparkle(86, 72, 5, '#fff6c4'),
  // ── 색 ──
  빨강: splat('#e8553d'),
  노랑: splat('#ffd23f'),
  파랑: splat('#3b78e6'),
  초록: splat('#43b04a'),
  하양: splat('#fff'),
  검정: splat('#2a2d3a'),
  보라: splat('#8e4fc9'),
  분홍: splat('#ff8ac2'),
  주황: splat('#ff9f1a'),
  // ── 모양 ──
  동그라미: `<circle cx="50" cy="50" r="36" fill="#3b8fe0" stroke-width="5"/>`,
  네모: `<rect x="15" y="15" width="70" height="70" rx="3" fill="#43b04a" stroke-width="5"/>`,
  세모: `<path d="M50 12L90 84H10Z" fill="#ffd23f" stroke-width="5"/>`,
  하트: heart(50, 50, 38, '#ff5c70').replace('/>', ' stroke-width="5"/>'),
};
