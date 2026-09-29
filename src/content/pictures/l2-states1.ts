// L2 상태·느낌 묶음 (가늘다·매끄럽다·달콤하다·쌀쌀하다·반갑다·어지럽다 …). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, ring, stick, person, moodFace, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

/** 표정 얼굴 (moodFace 모양)을 (x, y)에 s배로. inner는 moodFace 좌표(가운데 50,54)로 쓴다 */
const hd = (x: number, y: number, s: number, inner: string, skin = SKIN) =>
  `<g transform="translate(${x} ${y}) scale(${s}) translate(-50 -54)" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<circle cx="50" cy="54" r="32" fill="${skin}"/>` +
  `<path d="M18 50C17 26 33 20 50 20S83 26 82 50C76 40 64 35 50 35S24 40 18 50Z" fill="#5a3b24"/>` +
  inner +
  `</g>`;

/** 웃는 눈 ^ ^ */
const happyEyes = `<path d="M34 56q6-8 12 0M54 56q6-8 12 0" stroke-width="4"/>`;
/** 감은 눈 (편안한 눈) */
const calmEyes = `<path d="M34 55q6 6 12 0M54 55q6 6 12 0" stroke-width="4"/>`;
/** 꼭 감은 눈 > < */
const squeeze = `<path d="M33 49l11 6-11 6M67 49l-11 6 11 6" stroke-width="4"/>`;
/** 크게 웃는 입 */
const bigSmile = `<path d="M36 66H64C64 84 36 84 36 66Z" fill="#c62f3f"/>`;
/** 작은 웃음 */
const smile = `<path d="M40 70q10 9 20 0" stroke-width="4"/>`;
/** 걱정 눈썹 (안쪽이 올라감) */
const worryBrows = `<path d="M30 44l12-5M70 44l-12-5" stroke-width="3.5"/>`;
/** 동그란 눈 */
const eyes = dot(40, 56, 3.6) + dot(60, 56, 3.6);

/** 하트 (가운데 x, y, 크기 s) */
const heart = (x: number, y: number, s: number, fill: string) =>
  `<path d="M${x} ${y + 0.9 * s}C${x - 1.4 * s} ${y + 0.05 * s} ${x - 0.95 * s} ${y - 0.95 * s} ${x} ${y - 0.35 * s}` +
  `C${x + 0.95 * s} ${y - 0.95 * s} ${x + 1.4 * s} ${y + 0.05 * s} ${x} ${y + 0.9 * s}Z" fill="${fill}"/>`;

/** 별 (가운데 x, y, 바깥 반지름 r) */
const star = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${Array.from({ length: 10 }, (_, k) => {
    const a = (k * Math.PI) / 5 - Math.PI / 2;
    const rr = k % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join('L')}Z" fill="${fill}"/>`;

/** 윗옷 몸통 (어깨 가운데 x, 어깨 높이 y, 반너비 w, 아래 끝 y2) */
const shirt = (x: number, y: number, w: number, y2: number, fill: string) =>
  `<path d="M${x - w} ${y2}V${y + 10}C${x - w} ${y + 2} ${x - w * 0.5} ${y} ${x} ${y}S${x + w} ${y + 2} ${x + w} ${y + 10}V${y2}Z" fill="${fill}"/>`;

/** 손 (동그라미) */
const hand = (x: number, y: number, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`;

/** 바람 선 */
const wind = (x: number, y: number, w: number) =>
  `<path d="M${x} ${y}H${x + w}c6 0 6-8 0-8" stroke="#7ec8f0" stroke-width="3.5"/>`;

/** 나뭇잎 */
const leaf = (x: number, y: number, a: number, fill: string) =>
  `<path d="M${x - 7} ${y}Q${x} ${y - 7} ${x + 7} ${y}Q${x} ${y + 7} ${x - 7} ${y}Z" fill="${fill}" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`;

/** 컵 (위 가운데 x, 위 y, 물 높이 비율 f, 물 색) */
const glass = (x: number, y: number, f: number, water: string) => {
  const h = 44;
  const wy = y + h * (1 - f);
  const top = 12;
  const bot = 9;
  const wl = top - (top - bot) * (1 - f);
  return (
    `<path d="M${x - top} ${y}H${x + top}L${x + bot} ${y + h}H${x - bot}Z" fill="#fff"/>` +
    (f > 0 ? `<path d="M${x - wl} ${wy}H${x + wl}L${x + bot} ${y + h}H${x - bot}Z" fill="${water}"/>` : '') +
    `<path d="M${x - top} ${y}H${x + top}L${x + bot} ${y + h}H${x - bot}Z"/>`
  );
};

/** 쌓기 나무 한 줄 (왼쪽 x, 아래 y) */
const blocks = (x: number, y: number, w: number, h: number) =>
  ['#e8553d', '#ffd23f', '#3b78e6', '#43b04a']
    .map((c, k) => `<rect x="${x}" y="${y - h * (k + 1)}" width="${w}" height="${h}" rx="2" fill="${c}"/>`)
    .join('');

export const PICS: Record<string, string> = {
  // ── 모양·만짐 ──
  가늘다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    `<rect x="12" y="22" width="30" height="68" rx="6" fill="#9a5b2e"/><path d="M22 32V50M32 58V80" stroke="#6b3e26" stroke-width="3"/>` +
    `<rect x="66" y="22" width="6" height="68" rx="3" fill="#9a5b2e"/>` +
    ring(69, 56, 14, 40) +
    sparkle(88, 14, 6),
  헐렁하다:
    tube('M27 50L13 82', '#3b78e6', 15) +
    tube('M73 50L87 82', '#3b78e6', 15) +
    tube('M44 88V95', SKIN, 5) +
    tube('M56 88V95', SKIN, 5) +
    shirt(50, 40, 32, 90, '#3b78e6') +
    `<path d="M36 41Q50 60 64 41Z" fill="#2a5fb8"/>` +
    `<path d="M32 66q5 8 0 18M68 66q-5 8 0 18M48 70q3 6 0 14" stroke="#2a5fb8" stroke-width="3"/>` +
    hd(50, 27, 0.48, dot(40, 56, 4.5) + dot(60, 56, 4.5) + `<ellipse cx="50" cy="74" rx="6" ry="7" fill="#c62f3f"/>`),
  똑바르다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    blocks(16, 90, 24, 16) +
    `<g transform="rotate(13 68 90)">${blocks(57, 90, 22, 16)}</g>` +
    `<path d="M10 8V90" stroke="#3b78e6" stroke-width="2.5" stroke-dasharray="5 5"/>` +
    ring(28, 56, 20, 40) +
    sparkle(28, 10, 6),
  비뚤다:
    `<path d="M27 16L12 34M27 16L42 34M73 16L60 36M73 16L84 38" stroke="#9a5b2e" stroke-width="2.5"/>` +
    dot(27, 16, 3) +
    dot(73, 16, 3) +
    `<rect x="9" y="34" width="36" height="30" rx="2" fill="#9a5b2e"/><rect x="14" y="39" width="26" height="20" fill="#bfe6ff"/><path d="M14 59L24 47L32 55L36 51L40 55V59Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<g transform="rotate(22 73 16)"><rect x="55" y="34" width="36" height="30" rx="2" fill="#9a5b2e"/><rect x="60" y="39" width="26" height="20" fill="#bfe6ff"/><path d="M60 59L70 47L78 55L82 51L86 55V59Z" fill="#43b04a" stroke-width="2.5"/></g>` +
    `<path d="M50 80H94" stroke="#3b78e6" stroke-width="2.5" stroke-dasharray="5 5"/>` +
    ring(70, 52, 25, 27),
  구불구불하다:
    `<rect x="4" y="4" width="92" height="92" rx="6" fill="#8fd16a"/>` +
    tube('M30 92C30 74 76 78 76 62S24 46 24 32S62 18 66 8', '#d9c49a', 14) +
    `<path d="M30 92C30 74 76 78 76 62S24 46 24 32S62 18 66 8" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 6"/>` +
    blob('#43b04a', [
      [86, 88, 7],
      [80, 30, 7],
    ]) +
    blob('#43b04a', [[12, 70, 7]]),
  울퉁불퉁하다:
    `<path d="M4 96V74Q12 58 20 74Q28 62 36 74Q44 56 52 74Q60 62 68 74Q76 56 84 74Q90 62 96 74V96Z" fill="#b5793a"/>` +
    `<ellipse cx="28" cy="86" rx="6" ry="4" fill="#8a96b0"/><ellipse cx="66" cy="88" rx="7" ry="4" fill="#8a96b0"/>` +
    `<g transform="rotate(-14 50 44)"><path d="M36 38L41 26H59L66 38Z" fill="#bfe6ff"/><rect x="26" y="37" width="48" height="17" rx="6" fill="#e8553d"/>` +
    `<circle cx="37" cy="55" r="7" fill="#3a3f55"/><circle cx="63" cy="55" r="7" fill="#3a3f55"/>${dot(37, 55, 2.5, '#dfe8f5')}${dot(63, 55, 2.5, '#dfe8f5')}</g>` +
    `<path d="M18 30q-4 6 0 12M84 18q4 6 0 12M30 70l-4 4M74 60l4 3" stroke="#9aa6c4" stroke-width="3"/>`,
  매끄럽다:
    `<ellipse cx="46" cy="66" rx="40" ry="24" fill="#9fb3d9"/>` +
    `<path d="M20 58Q34 46 56 46" stroke="#fff" stroke-width="5"/>` +
    `<ellipse cx="66" cy="54" rx="5" ry="3" fill="#fff" stroke="none" opacity=".6"/>` +
    tube('M96 16L72 38', SKIN, 10) +
    `<ellipse cx="64" cy="40" rx="13" ry="6" fill="${SKIN}" transform="rotate(-8 64 40)"/>` +
    `<path d="M80 28h12M84 36h10" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(14, 40, 6) +
    sparkle(30, 82, 5, '#fff') +
    sparkle(76, 74, 5, '#fff'),
  거칠다:
    `<rect x="12" y="4" width="54" height="92" fill="#9a5b2e"/>` +
    `<path d="M22 8l5 10-5 10 5 10-5 10 5 10-5 10 5 10-5 10M38 6l-5 12 5 10-5 12 5 10-5 12 5 12-5 10M54 10l5 10-5 10 5 10-5 10 5 12-5 10 5 10" stroke="#5a3b24" stroke-width="3.5"/>` +
    tube('M96 60H80', SKIN, 12) +
    `<ellipse cx="72" cy="58" rx="8" ry="13" fill="${SKIN}"/><path d="M68 50h-4M68 58h-4M68 66h-4" stroke-width="2.5"/>` +
    `<path d="M78 34l4 4 4-4 4 4M78 84l4 4 4-4 4 4" stroke="#ff9f1a" stroke-width="3"/>`,
  끈적끈적하다:
    `<path d="M6 86C6 76 30 74 50 76S94 76 94 86C94 95 6 95 6 86Z" fill="#f2b233"/>` +
    tube('M50 4V16', SKIN, 16) +
    `<path d="M26 38C24 20 34 14 50 14S76 20 74 38Z" fill="${SKIN}"/>` +
    `<path d="M26 36H74C74 44 26 44 26 36Z" fill="#f2b233"/>` +
    `<path d="M32 42C28 56 36 64 30 80M50 44C54 58 46 66 50 78M68 42C72 56 64 66 70 80" stroke="#f2b233" stroke-width="5"/>` +
    `<path d="M32 42C28 56 36 64 30 80M50 44C54 58 46 66 50 78M68 42C72 56 64 66 70 80" stroke="${INK}" stroke-width="1.5" opacity=".5"/>` +
    `<ellipse cx="30" cy="86" rx="5" ry="2" fill="#fff" opacity=".6" stroke="none"/>`,
  미끄럽다:
    `<ellipse cx="50" cy="88" rx="44" ry="7" fill="#bfe6ff"/><path d="M20 87h12M60 89h16" stroke="#fff" stroke-width="3"/>` +
    stick(36, 30, 'M0 10L14 34M14 34L38 24M14 34L26 56M4 18L-16 10M4 18L20 2', 1) +
    dot(33, 28, 1.8) +
    dot(40, 27, 1.8) +
    `<circle cx="37" cy="34" r="2.5" fill="#c62f3f" stroke-width="1.5"/>` +
    `<path d="M70 70l10-6M72 80h12M62 20q8-4 12 4" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(86, 84, 5, '#fff'),
  폭신하다:
    `<path d="M10 50Q8 38 20 42Q50 34 80 42Q92 38 90 50Q96 66 90 82Q92 94 80 88Q50 96 20 88Q8 94 10 82Q4 66 10 50Z" fill="#ffc3dd"/>` +
    `<ellipse cx="50" cy="62" rx="26" ry="10" fill="#f5a3c7" stroke="none"/>` +
    hd(50, 44, 0.56, calmEyes + smile + cheeks(66, 20)) +
    `<path d="M20 66q6 6 14 4M80 66q-6 6-14 4" stroke="#e585b0" stroke-width="3"/>` +
    sparkle(14, 20, 6) +
    sparkle(86, 18, 5) +
    sparkle(84, 30, 3, '#fff'),
  단단하다:
    `<rect x="12" y="44" width="76" height="48" rx="5" fill="#8a96b0"/>` +
    `<path d="M16 48H84" stroke="#b8c2d6" stroke-width="3"/>` +
    dot(20, 84, 3, '#5d6780') +
    dot(80, 84, 3, '#5d6780') +
    dot(20, 54, 3, '#5d6780') +
    dot(80, 54, 3, '#5d6780') +
    tube('M62 4L54 20', SKIN, 12) +
    `<rect x="36" y="18" width="28" height="22" rx="8" fill="${SKIN}"/><path d="M43 26v8M50 26v8M57 26v8" stroke-width="2.5"/>` +
    `<path d="M30 40l-8-6M70 40l8-6M26 50h-0" stroke="#ff9f1a" stroke-width="4"/>` +
    sparkle(30, 68, 7, '#fff') +
    sparkle(70, 72, 5, '#fff'),
  물렁하다:
    `<path d="M14 62C14 40 30 32 46 33C54 34 58 44 64 46C72 42 86 46 86 62C86 82 72 92 50 92S14 82 14 62Z" fill="#ff9f1a"/>` +
    `<path d="M40 34C34 26 42 22 46 28C48 20 58 24 52 32Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<ellipse cx="30" cy="54" rx="5" ry="9" fill="#fff" opacity=".5" stroke="none"/>` +
    tube('M92 6L70 38', SKIN, 11) +
    `<ellipse cx="68" cy="42" rx="7" ry="6" fill="${SKIN}"/>` +
    `<path d="M6 56q-3 7 0 14M94 66q3 7 0 14M58 52q6 4 14 0" stroke="#9aa6c4" stroke-width="3"/>`,
  촉촉하다:
    `<path d="M12 86C10 48 40 16 88 12C90 58 60 88 12 86Z" fill="#43b04a"/>` +
    `<path d="M14 84L78 22M34 64L30 44M50 48L48 30M34 64L54 68M50 48L70 52" stroke="#2f8a3a" stroke-width="3"/>` +
    [
      [40, 50, 6],
      [62, 36, 5],
      [58, 62, 7],
      [30, 72, 4.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#bfe6ff"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.3, '#fff'))
      .join('') +
    sparkle(20, 22, 6) +
    sparkle(84, 78, 6, '#7ec8f0'),
  축축하다:
    `<path d="M4 18H96" stroke="#9aa6c4"/>` +
    `<path d="M24 16H76V62L70 66L64 62L58 68L52 62L46 67L40 62L34 66L28 62L24 64Z" fill="#4a7fc9"/>` +
    `<path d="M24 28H76M24 50H76" stroke="#7ec8f0" stroke-width="4"/>` +
    `<ellipse cx="40" cy="38" rx="7" ry="5" fill="#35609e" stroke="none"/><ellipse cx="62" cy="44" rx="6" ry="4" fill="#35609e" stroke="none"/>` +
    `<rect x="30" y="10" width="6" height="14" rx="2" fill="#e8553d" stroke-width="2.5"/><rect x="64" y="10" width="6" height="14" rx="2" fill="#e8553d" stroke-width="2.5"/>` +
    drop(34, 70, 0.6) +
    drop(58, 72, 0.6) +
    drop(46, 80, 0.5) +
    drop(70, 80, 0.45) +
    `<ellipse cx="52" cy="93" rx="30" ry="3.5" fill="#7ec8f0"/>`,
  바삭하다:
    `<path d="M10 28H46L40 40L48 52L40 64L46 76H10Z" fill="#f2c14e"/>` +
    `<g transform="translate(8 -4) rotate(10 70 52)"><path d="M50 28H86V76H50L44 64L52 52L44 40Z" fill="#f2c14e"/>` +
    dot(62, 40, 2.2, '#c98a2a') +
    dot(74, 40, 2.2, '#c98a2a') +
    dot(66, 52, 2.2, '#c98a2a') +
    dot(78, 56, 2.2, '#c98a2a') +
    dot(64, 66, 2.2, '#c98a2a') +
    `</g>` +
    dot(20, 40, 2.2, '#c98a2a') +
    dot(32, 40, 2.2, '#c98a2a') +
    dot(24, 52, 2.2, '#c98a2a') +
    dot(20, 64, 2.2, '#c98a2a') +
    dot(32, 64, 2.2, '#c98a2a') +
    `<g fill="#f2c14e" stroke-width="2"><path d="M44 84l5-2 2 5-5 2Z"/><path d="M58 90l4-3 3 4-4 3Z"/><path d="M34 88l4 0 0 4-4 0Z"/><path d="M54 14l4-2 2 4-4 2Z"/></g>` +
    `<path d="M40 8l4 6 4-6 4 6M72 90l4-5 4 5 4-5M14 88l4-4" stroke="#ff9f1a" stroke-width="3.5"/>`,
  쫄깃하다:
    `<path d="M38 58C50 64 62 64 70 54L74 72C62 66 50 70 38 72Z" fill="#fff4dc"/>` +
    `<path d="M42 62C52 66 60 66 70 60" stroke="#e8d4a8" stroke-width="2.5"/>` +
    hd(24, 52, 0.6, calmEyes + `<ellipse cx="50" cy="75" rx="10" ry="8" fill="#fff4dc"/>` + cheeks(66, 22)) +
    `<rect x="68" y="50" width="24" height="24" rx="7" fill="#fff4dc"/>` +
    `<g fill="#e8c870" stroke="none"><circle cx="76" cy="58" r="2"/><circle cx="84" cy="64" r="2"/><circle cx="78" cy="68" r="2"/></g>` +
    tube('M96 94L86 78', SKIN, 10) +
    `<ellipse cx="84" cy="76" rx="9" ry="7" fill="${SKIN}"/>` +
    `<path d="M66 34H90M84 28l6 6-6 6" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M48 48l4-4M58 46l3-5M48 84l4 4M58 84l3 5" stroke="#9aa6c4" stroke-width="3"/>`,
  // ── 맛·냄새 ──
  달콤하다:
    tube('M76 58V94', '#fff', 5) +
    `<circle cx="76" cy="40" r="19" fill="#ff8ac2"/>` +
    `<path d="M76 40m0-3a3 3 0 0 1 3 3a6 6 0 0 1-6 6a9 9 0 0 1-9-9a12 12 0 0 1 12-12a15 15 0 0 1 15 15" stroke="#fff" stroke-width="3.5"/>` +
    hd(33, 56, 0.66, happyEyes + `<path d="M40 68q10 8 20 0" stroke-width="4"/><path d="M52 71C54 82 64 80 62 70Z" fill="#ff5c70"/>` + cheeks(66, 22)) +
    heart(14, 16, 7, '#ff5c70') +
    heart(52, 12, 5, '#ff8ac2') +
    sparkle(92, 76, 5),
  새콤하다:
    `<circle cx="74" cy="66" r="21" fill="#ff9f1a"/><circle cx="74" cy="66" r="15" fill="#ffd27a" stroke-width="2.5"/>` +
    `<path d="M74 51V81M59 66H89M63 55L85 77M85 55L63 77" stroke="#ff9f1a" stroke-width="3"/>` +
    hd(
      34,
      44,
      0.66,
      dot(40, 55, 4) +
        `<path d="M56 50l10 5-10 5" stroke-width="4"/>` +
        `<circle cx="52" cy="73" r="5" fill="#c62f3f"/>` +
        cheeks(66, 22),
    ) +
    `<path d="M62 20l6-4M66 30h8" stroke="#ffd23f" stroke-width="3.5"/>` +
    sparkle(12, 86, 6) +
    sparkle(90, 22, 5),
  고소하다:
    hd(34, 40, 0.62, calmEyes + smile + cheeks(66, 22)) +
    `<path d="M58 44c4-4-2-8 2-12M66 50c4-4-2-8 2-12M74 44c4-4-2-8 2-12" stroke="#c98a2a" stroke-width="3.5"/>` +
    `<g transform="rotate(-20 62 78)">${blob('#e0b878', [
      [52, 78, 10],
      [68, 78, 10],
    ])}<path d="M48 74l4 4M54 72l4 4M64 74l4 4M70 72l4 4" stroke="#b48a4a" stroke-width="2.5"/></g>` +
    `<g transform="rotate(25 30 84)">${blob('#e0b878', [
      [22, 84, 8],
      [36, 84, 8],
    ])}</g>` +
    sparkle(88, 60, 5) +
    sparkle(12, 70, 4),
  싱겁다:
    `<path d="M16 64H84C84 84 70 92 50 92S16 84 16 64Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="64" rx="34" ry="6" fill="#f5e7b8"/>` +
    hd(
      32,
      30,
      0.52,
      `<path d="M32 56h12M56 56h12" stroke-width="4"/><path d="M30 44l12 2M58 42q6-6 12 0" stroke-width="3.5"/><path d="M42 74h16" stroke-width="4"/>`,
    ) +
    `<g transform="rotate(35 78 28)"><rect x="70" y="18" width="16" height="22" rx="3" fill="#fff"/><path d="M70 22C70 10 86 10 86 22Z" fill="#8a96b0"/></g>` +
    `<g fill="#fff" stroke-width="2"><rect x="64" y="42" width="3.5" height="3.5"/><rect x="60" y="50" width="3.5" height="3.5"/><rect x="66" y="54" width="3.5" height="3.5"/></g>`,
  향기롭다:
    tube('M24 58V94', '#43b04a', 5) +
    `<path d="M24 80q-12-2-14-12q12 0 14 12Z" fill="#43b04a" stroke-width="2.5"/>` +
    [0, 72, 144, 216, 288]
      .map((a) => `<ellipse cx="24" cy="36" rx="8" ry="11" fill="#ff8ac2" transform="rotate(${a} 24 47)"/>`)
      .join('') +
    `<circle cx="24" cy="47" r="7" fill="#ffd23f"/>` +
    `<path d="M40 38q6-5 12 0t12 0M40 50q6-5 12 0M42 62q6-5 12 0" stroke="#e85d9a" stroke-width="3"/>` +
    hd(74, 58, 0.58, calmEyes + smile + cheeks(66, 20)) +
    heart(78, 16, 6, '#ff8ac2') +
    sparkle(52, 20, 5),
  냄새나다:
    `<path d="M10 58H30V78C30 84 36 86 44 86V94H18C12 94 10 90 10 84Z" fill="#fff"/>` +
    `<path d="M10 64H30M10 70H30" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M14 50c5-5-3-9 2-14M24 48c5-5-3-9 2-14M34 52c5-5-3-9 2-14M40 70c5-5-3-9 2-14" stroke="#7cb342" stroke-width="3.5"/>` +
    hd(70, 50, 0.64, squeeze + `<path d="M38 78q6-6 12 0t12 0" stroke-width="4"/>` + worryBrows) +
    hand(70, 58, 6.5),
  // ── 빛·날씨·온도 ──
  환하다:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#fff4b8"/>` +
    `<path d="M50 8v8M20 20l6 6M80 20l-6 6M8 46h8M84 46h8M18 72l6-4M82 72l-6-4" stroke="#ff9f1a" stroke-width="4"/>` +
    `<circle cx="50" cy="44" r="22" fill="#ffd23f"/><path d="M42 60H58V70H42Z" fill="#ffd23f" stroke="none"/>` +
    `<rect x="40" y="66" width="20" height="14" rx="3" fill="#8a96b0"/><path d="M40 72H60" stroke-width="2.5"/><path d="M46 80Q50 88 54 80Z" fill="#5d6780"/>` +
    `<path d="M40 36q2-8 10-10" stroke="#fff" stroke-width="4"/>` +
    sparkle(18, 88, 5) +
    sparkle(84, 88, 5),
  캄캄하다:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#0e1228"/>` +
    `<ellipse cx="38" cy="50" rx="9" ry="11" fill="#fff" stroke="#0e1228"/><ellipse cx="62" cy="50" rx="9" ry="11" fill="#fff" stroke="#0e1228"/>` +
    dot(40, 52, 4.5) +
    dot(64, 52, 4.5) +
    `<path d="M30 34q8-6 16 0M54 34q8-6 16 0" stroke="#4a5a96" stroke-width="3"/>` +
    `<path d="M28 80C22 76 16 76 12 78M72 80C78 76 84 76 88 78" stroke="#4a5a96" stroke-width="4"/>` +
    `<circle cx="11" cy="78" r="5" fill="#26305a" stroke="#4a5a96" stroke-width="2.5"/><circle cx="89" cy="78" r="5" fill="#26305a" stroke="#4a5a96" stroke-width="2.5"/>`,
  흐리다:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#c9d3e3"/>` +
    `<circle cx="70" cy="30" r="15" fill="#f2c14e"/>` +
    blob('#b8c2d6', [
      [70, 44, 13],
      [84, 46, 10],
      [58, 48, 9],
    ]) +
    blob('#8a96b0', [
      [44, 58, 18],
      [26, 64, 13],
      [62, 64, 13],
      [36, 48, 12],
      [76, 70, 9],
      [16, 72, 8],
    ]) +
    `<path d="M20 86h14M46 88h16M70 86h12" stroke="#8a96b0" stroke-width="3"/>`,
  화창하다:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#9fdcff"/>` +
    `<path d="M4.5 76Q30 64 56 72T95.5 70V88C95.5 93 93 95.5 88 95.5H12C7 95.5 4.5 93 4.5 88Z" fill="#5fc24a"/>` +
    `<path d="M4.5 76Q30 64 56 72T95.5 70"/>` +
    `<path d="M44 8v6M44 60v6M18 36h6M64 36h6M26 18l4 4M62 18l-4 4M26 54l4-4M62 54l-4-4" stroke="#ff9f1a" stroke-width="4"/>` +
    `<circle cx="44" cy="36" r="15" fill="#ffd23f"/>` +
    blob('#fff', [
      [80, 26, 7],
      [88, 28, 5],
      [73, 29, 5],
    ]) +
    `<circle cx="22" cy="84" r="4" fill="#ff8ac2" stroke-width="2.5"/><circle cx="74" cy="84" r="4" fill="#ffd23f" stroke-width="2.5"/>`,
  쌀쌀하다:
    shirt(52, 58, 22, 94, '#8e4fc9') +
    tube('M34 70L64 78', '#7a3fb0', 9) +
    tube('M70 70L40 78', '#7a3fb0', 9) +
    hand(64, 78, 5) +
    hand(40, 78, 5) +
    `<path d="M40 58Q52 66 64 58L64 54H40Z" fill="#43b04a" stroke-width="3"/>` +
    hd(52, 36, 0.6, `<path d="M32 48l12 6M68 48l-12 6" stroke-width="3.5"/>` + dot(40, 58) + dot(60, 58) + `<path d="M38 74l4-4 4 4 4-4 4 4 4-4 4 4" stroke-width="3.5"/>`, '#ffe0c7') +
    `<path d="M22 30q-4 6 0 12M82 30q4 6 0 12M20 70q-4 6 0 12M84 70q4 6 0 12" stroke="#9aa6c4" stroke-width="3"/>` +
    wind(4, 16, 12) +
    leaf(84, 14, 30, '#e8862e') +
    leaf(10, 54, -20, '#e8553d'),
  포근하다:
    `<path d="M50 30C20 30 12 60 12 88C12 94 88 94 88 88C88 60 80 30 50 30Z" fill="#ff9aa8"/>` +
    `<g fill="#fff" stroke="none">${dot(28, 70, 4, '#fff')}${dot(50, 80, 4, '#fff')}${dot(72, 70, 4, '#fff')}${dot(38, 86, 3, '#fff')}${dot(64, 86, 3, '#fff')}</g>` +
    hd(50, 48, 0.5, calmEyes + smile + cheeks(66, 20)) +
    `<path d="M26 62Q50 72 74 62L74 58Q50 70 26 58Z" fill="#ff7a8a"/>` +
    heart(14, 18, 7, '#ff5c70') +
    heart(86, 18, 7, '#ff5c70') +
    sparkle(86, 44, 4),
  무덥다:
    `<path d="M84 4v6M96 16h-6M72 8l3 4M94 28l-4-2" stroke="#ff9f1a" stroke-width="3.5"/>` +
    `<circle cx="84" cy="16" r="9" fill="#ff9f1a"/>` +
    hd(44, 50, 0.76, `<path d="M32 56h12M56 56h12" stroke-width="4"/>` + `<path d="M40 70H60C60 80 40 80 40 70Z" fill="#c62f3f"/><path d="M45 74C45 88 57 88 57 74Z" fill="#ff8aa0"/>` + cheeks(66, 22), '#ffb89a') +
    drop(14, 22, 0.7) +
    drop(72, 36, 0.6) +
    drop(76, 60, 0.6) +
    drop(10, 56, 0.6) +
    `<path d="M20 94c4-4-4-6 0-10M44 96c4-4-4-6 0-10M68 94c4-4-4-6 0-10M88 94c4-4-4-6 0-10" stroke="#ff9f1a" stroke-width="3"/>`,
  선선하다:
    hd(58, 54, 0.72, calmEyes + smile + cheeks(66, 22)) +
    `<path d="M36 34q-8-2-10 4M40 28q-8-4-12 0" stroke="#5a3b24" stroke-width="4"/>` +
    wind(4, 40, 14) +
    wind(8, 62, 10) +
    wind(4, 82, 16) +
    leaf(84, 18, 30, '#e8862e') +
    leaf(24, 20, -30, '#ffc933') +
    leaf(90, 84, 60, '#e8553d'),
  미지근하다:
    glass(18, 38, 0.7, '#ff7a5c') +
    `<path d="M12 30c4-4-4-8 0-12M22 30c4-4-4-8 0-12" stroke="#e8553d" stroke-width="3"/>` +
    glass(50, 38, 0.7, '#ffd27a') +
    glass(82, 38, 0.7, '#7ec8f0') +
    `<rect x="74" y="54" width="8" height="8" rx="1.5" fill="#fff" stroke-width="2.5"/><rect x="83" y="60" width="7" height="7" rx="1.5" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M82 22v10M77 27h10M78 23l8 8M86 23l-8 8" stroke="#3b78e6" stroke-width="2.5"/>` +
    ring(50, 60, 17, 28),
  // ── 양·거리 ──
  가득하다:
    glass(28, 40, 0.35, '#7ec8f0') +
    glass(70, 40, 1, '#7ec8f0') +
    `<path d="M58 40Q70 34 82 40" fill="#7ec8f0"/>` +
    drop(84, 44, 0.55) +
    ring(70, 60, 18, 30) +
    sparkle(90, 22, 6) +
    `<path d="M4 88H96" stroke="#c9b28a"/>`,
  얕다:
    `<rect x="4" y="36" width="92" height="60" rx="4" fill="#b5793a"/><path d="M4.5 36H95.5" stroke="#43b04a" stroke-width="6"/>` +
    `<path d="M10 36V88H40V36Z" fill="#4a90e2"/><path d="M10 36V88H40V36" stroke-width="3"/>` +
    `<path d="M56 36V48H90V36Z" fill="#4a90e2"/><path d="M56 36V48H90V36" stroke-width="3"/>` +
    `<path d="M16 50q4-3 8 0t8 0M16 66q4-3 8 0t8 0" stroke="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M60 40q4-3 8 0t8 0 8 0" stroke="#bfe6ff" stroke-width="2.5"/>` +
    ring(73, 42, 22, 16) +
    sparkle(73, 18, 6),
  가깝다:
    `<rect x="4" y="4" width="92" height="92" rx="6" fill="#bfe6ff"/>` +
    `<path d="M4.5 44H95.5V90C95.5 94 94 95.5 90 95.5H10C6 95.5 4.5 94 4.5 90Z" fill="#8fd16a" stroke="none"/><path d="M4 44H96"/>` +
    `<rect x="76" y="37" width="7" height="7" fill="#fff" stroke-width="2"/><path d="M74 38L79.5 33L85 38Z" fill="#e8553d" stroke-width="2"/>` +
    `<rect x="14" y="54" width="36" height="32" fill="#fff"/><path d="M8 56L32 34L56 56Z" fill="#e8553d"/><rect x="26" y="68" width="12" height="18" fill="#9a5b2e"/>` +
    person(64, 88, 1.0, { hair: '#5a3b24', style: 'short', shirt: '#ffd23f' }) +
    ring(40, 62, 34, 32),
  // ── 마음 ──
  반갑다:
    tube('M40 74L48 50', SKIN, 6) +
    tube('M60 74L52 50', SKIN, 6) +
    person(28, 94, 1.35, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    person(72, 94, 1.35, { hair: '#6b3e26', style: 'pony', shirt: '#e8553d' }) +
    hand(48, 48, 5) +
    hand(52, 48, 5) +
    `<path d="M40 40l-4-6M60 40l4-6" stroke="#9aa6c4" stroke-width="3"/>` +
    heart(50, 24, 9, '#ff5c70') +
    sparkle(14, 18, 5) +
    sparkle(86, 18, 5),
  고맙다:
    person(24, 94, 1.3, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    tube('M34 76L44 70', SKIN, 6) +
    `<rect x="40" y="58" width="18" height="16" rx="2" fill="#e8553d"/><path d="M49 58V74M40 66H58" stroke="#ffd23f" stroke-width="3"/><path d="M49 58q-6-8-8-2q2 4 8 2q6-8 8-2q-2 4-8 2" fill="#ffd23f" stroke-width="2"/>` +
    `<g transform="rotate(14 76 94)">${person(76, 94, 1.3, { hair: '#6b3e26', style: 'long', shirt: '#8e4fc9' })}</g>` +
    tube('M64 78L58 70', SKIN, 6) +
    heart(82, 18, 8, '#ff5c70') +
    sparkle(58, 20, 5),
  미안하다:
    hd(40, 44, 0.72, worryBrows + `<path d="M34 58q6-4 12 0M54 58q6-4 12 0" stroke-width="4"/><path d="M42 76q8-6 16 0" stroke-width="4"/>` + cheeks(68, 22)) +
    drop(76, 14, 0.7) +
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<path d="M48 92C46 86 60 84 70 86C80 84 92 86 94 92Z" fill="#fff"/>` +
    `<g transform="rotate(-100 76 78)"><path d="M86 74q10 0 10 8t-10 8" stroke-width="4.5"/><path d="M66 68H86V90C86 94 66 94 66 90Z" fill="#e8553d"/></g>` +
    `<path d="M80 60q4-4 8 0M84 50l2-4" stroke="#9aa6c4" stroke-width="3"/>`,
  속상하다:
    hd(40, 40, 0.66, `<path d="M32 42l12 4M68 42l-12 4" stroke-width="3.5"/>` + `<path d="M34 58q6-5 12 0M54 58q6-5 12 0" stroke-width="4"/>` + `<path d="M40 80q10-9 20 0" stroke-width="4"/>` + `<path d="M38 60q-2 8 0 14M62 60q2 8 0 14" stroke="#4aa8f0" stroke-width="4"/>`) +
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    blob('#ff9aa8', [
      [66, 86, 7],
      [78, 84, 10],
      [90, 87, 6],
    ]) +
    `<path d="M66 82L76 56L86 82Z" fill="#e8a64a"/><path d="M71 72l8 8M73 66l10 10M81 72l-8 8M79 66l-10 10" stroke="#b5793a" stroke-width="2"/>` +
    `<g stroke="none">${dot(62, 88, 1.8, '#3b78e6')}${dot(92, 86, 1.8, '#43b04a')}${dot(84, 90, 1.8, '#ffd23f')}</g>` +
    drop(12, 60, 0.6) +
    drop(20, 76, 0.5),
  창피하다:
    moodFace(
      `<ellipse cx="30" cy="68" rx="11" ry="7" fill="#ff5c70" opacity=".6" stroke="none"/><ellipse cx="70" cy="68" rx="11" ry="7" fill="#ff5c70" opacity=".6" stroke="none"/>` +
        `<path d="M42 78q4-3 8 0t8 0" stroke-width="3.5"/>`,
    ) +
    `<path d="M24 64C18 50 22 36 32 34C40 32 48 42 48 52C48 62 32 70 24 64Z" fill="${SKIN}"/>` +
    `<path d="M76 64C82 50 78 36 68 34C60 32 52 42 52 52C52 62 68 70 76 64Z" fill="${SKIN}"/>` +
    `<path d="M32 40l6 10M40 38l4 10M68 40l-6 10M60 38l-4 10" stroke-width="2.5"/>` +
    drop(88, 20, 0.8) +
    drop(10, 30, 0.6) +
    `<path d="M4 64h8M88 64h8M8 84l6-4M92 84l-6-4" stroke="#e8553d" stroke-width="3"/>`,
  자랑스럽다:
    `<path d="M36 6H64V14C64 24 58 28 50 28S36 24 36 14Z" fill="#ffd23f"/><path d="M36 10H30C30 18 34 20 38 20M64 10H70C70 18 66 20 62 20" stroke="#e8a620" stroke-width="3"/>` +
    `<rect x="44" y="28" width="12" height="5" fill="#e8a620" stroke-width="2.5"/>` +
    tube('M34 72L32 44L42 30', SKIN, 7) +
    tube('M66 72L68 44L58 30', SKIN, 7) +
    shirt(50, 66, 18, 96, '#e8553d') +
    hd(50, 52, 0.46, happyEyes + bigSmile + cheeks(66, 22)) +
    `<circle cx="50" cy="84" r="6" fill="#ffd23f"/><path d="M44 70L50 78L56 70" stroke="#3b78e6" stroke-width="3"/>` +
    sparkle(16, 20, 7) +
    sparkle(84, 20, 7) +
    sparkle(14, 56, 5) +
    sparkle(86, 56, 5),
  용감하다:
    `<path d="M36 48L14 90H86L64 48Z" fill="#e8553d"/>` +
    `<path d="M26 96L30 86H70L74 96Z" fill="#8a96b0"/>` +
    tube('M44 76V86M56 76V86', '#3b78e6', 7) +
    shirt(50, 46, 14, 78, '#3b78e6') +
    star(50, 62, 8, '#ffd23f') +
    tube('M38 52L30 66L38 72', SKIN, 6) +
    tube('M62 52L72 40L74 26', SKIN, 6) +
    hand(74, 24, 5.5) +
    hd(50, 30, 0.44, `<path d="M32 44l12 5M68 44l-12 5" stroke-width="4"/>` + eyes + `<path d="M40 70q10 8 20 0" stroke-width="4"/>`) +
    sparkle(14, 20, 6) +
    sparkle(88, 50, 5),
  씩씩하다:
    `<rect x="54" y="38" width="16" height="22" rx="4" fill="#ff9f1a"/>` +
    stick(50, 26, 'M0 10L0 38M0 16L-16 30M0 16L14 4M0 38L-14 56M0 38L12 48L22 50', 1.05) +
    `<path d="M48 17q5-3 9 2" stroke-width="2.5"/>` +
    dot(47, 24, 1.8) +
    dot(55, 24, 1.8) +
    `<path d="M46 30q5 4 10 0" stroke-width="2.5"/>` +
    `<path d="M8 50h10M6 62h14M10 74h10" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    sparkle(86, 16, 6),
  착하다:
    drop(10, 20, 0.6) +
    drop(24, 8, 0.5) +
    drop(92, 44, 0.5) +
    drop(8, 50, 0.5) +
    `<path d="M40 44C40 22 94 22 94 44Q87 40 81 44Q74 40 67 44Q60 40 53 44Q46 40 40 44Z" fill="#43b04a"/>` +
    `<path d="M67 24V16" stroke-width="3"/><path d="M52 44L42 72" stroke="#6b3e26" stroke-width="3.5"/>` +
    person(28, 94, 1.3, { hair: '#5a3b24', style: 'pony', shirt: '#ff9aa8' }) +
    tube('M36 76L42 72', SKIN, 6) +
    `<ellipse cx="72" cy="80" rx="13" ry="9" fill="#e8b27a"/><circle cx="72" cy="64" r="10" fill="#e8b27a"/>` +
    `<ellipse cx="63" cy="64" rx="4" ry="8" fill="#9a5b2e"/><ellipse cx="81" cy="64" rx="4" ry="8" fill="#9a5b2e"/>` +
    dot(68, 63, 2) +
    dot(76, 63, 2) +
    dot(72, 68, 2.2) +
    `<path d="M62 94V86M82 94V86" stroke-width="4"/>` +
    heart(50, 12, 7, '#ff5c70'),
  부지런하다:
    `<path d="M4 78H96" stroke="#c9b28a"/>` +
    `<path d="M4 78A14 14 0 0 1 32 78Z" fill="#ffd23f"/><path d="M18 58v-6M4 62l-2-3M32 62l3-4" stroke="#ff9f1a" stroke-width="3.5"/>` +
    person(56, 80, 1.3, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    tube('M48 62L70 88', '#c98a2a', 4) +
    tube('M64 62L68 72', SKIN, 5) +
    `<path d="M66 86L80 80L86 94L72 96Z" fill="#ffd23f"/><path d="M72 88l6 6M77 85l5 8" stroke="#c98a2a" stroke-width="2"/>` +
    `<path d="M88 72l6-4M90 82h6" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g fill="#c9b28a" stroke="none"><circle cx="92" cy="90" r="2.5"/><circle cx="88" cy="94" r="2"/></g>` +
    drop(74, 24, 0.5) +
    sparkle(30, 20, 6),
  게으르다:
    `<rect x="6" y="42" width="88" height="24" rx="8" fill="#8e4fc9"/>` +
    `<rect x="6" y="60" width="88" height="24" rx="6" fill="#a45cf0"/>` +
    `<path d="M14 84V92M86 84V92" stroke-width="5"/>` +
    tube('M36 60H80', '#ffd23f', 14) +
    `<circle cx="84" cy="58" r="6" fill="${SKIN}"/>` +
    hd(24, 52, 0.4, `<path d="M32 58h12M56 58h12" stroke-width="5"/><path d="M42 74q8 4 16 0" stroke-width="5"/>`) +
    `<path d="M40 88L48 82L56 90L48 96Z" fill="#e8553d"/>` +
    `<g fill="#f2c14e" stroke-width="2"><circle cx="64" cy="92" r="3"/><circle cx="72" cy="94" r="2.5"/></g>` +
    `<path d="M22 32q4-6 10-4M34 24q4-6 10-4" stroke="#9aa6c4" stroke-width="3"/>`,
  튼튼하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<rect x="34" y="46" width="56" height="46" fill="#e8553d"/>` +
    `<path d="M34 56H90M34 66H90M34 76H90M34 86H90M48 46V56M66 46V56M80 46V56M42 56V66M58 56V66M74 56V66M48 66V76M66 66V76M80 66V76M42 76V86M74 76V86M48 86V92M80 86V92" stroke="#b83a2a" stroke-width="2"/>` +
    `<path d="M28 48L62 18L96 48Z" fill="#6b3e26"/>` +
    `<rect x="54" y="70" width="14" height="22" fill="#9a5b2e"/>` +
    wind(4, 36, 16) +
    wind(4, 58, 18) +
    wind(6, 80, 14) +
    sparkle(62, 8, 6) +
    sparkle(92, 60, 4, '#fff'),
  약하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    shirt(50, 56, 15, 80, '#7ec8f0') +
    tube('M44 80L40 92M56 80L60 92', '#3b78e6', 6) +
    tube('M38 62L32 78', SKIN, 5) +
    tube('M62 62L68 78', SKIN, 5) +
    tube('M28 82H72', '#8a96b0', 4) +
    `<rect x="18" y="72" width="10" height="20" rx="3" fill="#5d6780"/><rect x="72" y="72" width="10" height="20" rx="3" fill="#5d6780"/>` +
    hd(50, 36, 0.5, worryBrows + squeeze + `<path d="M40 76q5-4 10 0t10 0" stroke-width="4"/>`) +
    drop(76, 22, 0.6) +
    drop(24, 30, 0.5) +
    `<path d="M22 58l-4 3 4 3-4 3M78 58l4 3-4 3 4 3" stroke="#9aa6c4" stroke-width="3"/>`,
  강하다:
    tube('M8 14H92', '#8a96b0', 5) +
    `<rect x="4" y="4" width="14" height="22" rx="4" fill="#5d6780"/><rect x="82" y="4" width="14" height="22" rx="4" fill="#5d6780"/>` +
    tube('M34 56L26 34L28 18', SKIN, 8) +
    tube('M66 56L74 34L72 18', SKIN, 8) +
    `<ellipse cx="27" cy="38" rx="6" ry="4" fill="${SKIN}" stroke="none"/><ellipse cx="73" cy="38" rx="6" ry="4" fill="${SKIN}" stroke="none"/>` +
    `<path d="M22 38q5-6 10 0M68 38q5-6 10 0" stroke-width="2.5"/>` +
    shirt(50, 52, 17, 84, '#e8553d') +
    tube('M42 84L38 94M58 84L62 94', '#3b78e6', 7) +
    hd(50, 38, 0.46, happyEyes + bigSmile + cheeks(66, 22)) +
    sparkle(10, 50, 6) +
    sparkle(90, 50, 6),
  건강하다:
    `<ellipse cx="50" cy="93" rx="18" ry="3" fill="#d0d6e6" stroke="none"/>` +
    `<path d="M26 72C8 40 20 4 50 4S92 40 74 72" stroke="#e8553d" stroke-width="3.5"/>` +
    tube('M40 58L28 70', SKIN, 5) +
    tube('M60 58L72 70', SKIN, 5) +
    `<rect x="22" y="68" width="6" height="10" rx="2" fill="#ffd23f"/><rect x="72" y="68" width="6" height="10" rx="2" fill="#ffd23f"/>` +
    shirt(50, 52, 13, 78, '#43b04a') +
    tube('M44 78L40 88M56 78L60 88', SKIN, 5) +
    hd(50, 36, 0.44, happyEyes + bigSmile + cheeks(66, 22)) +
    heart(88, 20, 7, '#ff5c70') +
    sparkle(12, 20, 6) +
    `<path d="M34 94h-6M66 94h6" stroke="#9aa6c4" stroke-width="3"/>`,
  지루하다:
    `<circle cx="82" cy="20" r="13" fill="#fff"/><path d="M82 20V11M82 20L88 23" stroke-width="3"/>` +
    `<rect x="4" y="84" width="92" height="12" rx="3" fill="#b5793a"/>` +
    hd(42, 52, 0.72, `<path d="M32 56h12M56 56h12" stroke-width="4"/><path d="M32 60q6 4 12 0M56 60q6 4 12 0" stroke-width="3"/><ellipse cx="50" cy="76" rx="8" ry="10" fill="#c62f3f"/>`) +
    tube('M48 86L46 80', SKIN, 10) +
    `<ellipse cx="44" cy="80" rx="10" ry="6" fill="${SKIN}"/>` +
    drop(70, 44, 0.5) +
    `<path d="M76 56q6 2 10-2M78 66q6 2 10-2" stroke="#9aa6c4" stroke-width="3"/>`,
  설레다:
    shirt(50, 68, 20, 96, '#8e4fc9') +
    `<rect x="36" y="72" width="28" height="22" rx="3" fill="#ff5c70"/><path d="M50 72V94M36 82H64" stroke="#ffd23f" stroke-width="3.5"/>` +
    `<path d="M50 72q-8-10-11-3q3 5 11 3q8-10 11-3q-3 5-11 3" fill="#ffd23f" stroke-width="2.5"/>` +
    hand(36, 84, 5) +
    hand(64, 84, 5) +
    hd(
      50,
      46,
      0.62,
      `<circle cx="38" cy="55" r="8" fill="${INK}"/><circle cx="62" cy="55" r="8" fill="${INK}"/>` +
        dot(41, 52, 3, '#fff') +
        dot(65, 52, 3, '#fff') +
        dot(36, 59, 1.6, '#fff') +
        dot(60, 59, 1.6, '#fff') +
        smile +
        cheeks(68, 22),
    ) +
    heart(86, 20, 8, '#ff5c70') +
    `<path d="M74 12l-4-4M74 26l-4 4M98 20h-4" stroke="#ff5c70" stroke-width="3"/>` +
    heart(14, 26, 6, '#ff8ac2') +
    sparkle(14, 56, 5),
  긴장하다:
    moodFace(
      `<circle cx="38" cy="55" r="8" fill="#fff"/><circle cx="62" cy="55" r="8" fill="#fff"/>` +
        dot(38, 55, 2.5) +
        dot(62, 55, 2.5) +
        worryBrows +
        `<rect x="36" y="68" width="28" height="12" rx="3" fill="#fff"/><path d="M43 68v12M50 68v12M57 68v12M36 74h28" stroke-width="2"/>`,
      ) +
    drop(86, 22, 0.8) +
    drop(14, 30, 0.7) +
    drop(88, 60, 0.6) +
    `<path d="M4 50l4 3-4 3 4 3M96 50l-4 3 4 3-4 3" stroke="#9aa6c4" stroke-width="3"/>`,
  걱정하다:
    hd(40, 58, 0.74, worryBrows + eyes + `<path d="M40 76q5-4 10 0t10 0" stroke-width="4"/>`) +
    tube('M14 96L20 80', SKIN, 10) +
    `<ellipse cx="20" cy="74" rx="7" ry="9" fill="${SKIN}"/>` +
    `<g fill="#fff"><circle cx="70" cy="44" r="3"/><circle cx="76" cy="36" r="4"/></g>` +
    blob('#fff', [
      [80, 18, 12],
      [68, 20, 9],
      [91, 22, 7],
    ]) +
    blob('#8a96b0', [
      [80, 16, 6],
      [74, 18, 5],
      [86, 19, 5],
    ]) +
    `<path d="M76 24l-2 4M84 24l-2 4" stroke="#4a90e2" stroke-width="2.5"/>`,
  외롭다:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#c9d3ee"/>` +
    `<circle cx="80" cy="20" r="9" fill="#fff6c4"/>` +
    `<rect x="10" y="62" width="80" height="8" rx="2" fill="#9a5b2e"/><path d="M16 70V88M84 70V88" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M4.5 88H95.5" stroke="#8a96b0"/>` +
    shirt(26, 44, 11, 64, '#8a96b0') +
    tube('M22 64L22 80M30 64L30 80', '#3b78e6', 5) +
    hd(26, 32, 0.36, `<path d="M34 50l10 4M66 50l-10 4" stroke-width="5"/><path d="M34 60q6 4 12 0M54 60q6 4 12 0" stroke-width="5"/><path d="M42 78q8-6 16 0" stroke-width="5"/>`) +
    leaf(64, 44, 30, '#e8862e') +
    leaf(52, 30, -20, '#c98a2a'),
  부럽다:
    hd(30, 54, 0.6, `<circle cx="42" cy="55" r="7" fill="#fff"/><circle cx="64" cy="55" r="7" fill="#fff"/>` + dot(46, 54, 3.5) + dot(68, 54, 3.5) + `<circle cx="54" cy="74" r="5" fill="#c62f3f"/>`) +
    tube('M16 96L22 80', SKIN, 8) +
    `<circle cx="22" cy="76" r="5" fill="${SKIN}"/>` +
    person(76, 96, 1.2, { hair: '#6b3e26', style: 'pony', shirt: '#43b04a' }) +
    tube('M64 74L60 62', SKIN, 5) +
    `<path d="M54 44L60 62L66 44Z" fill="#e8a64a"/>` +
    blob('#ff9aa8', [
      [60, 38, 8],
      [56, 30, 6],
      [64, 30, 6],
    ]) +
    sparkle(84, 36, 5) +
    sparkle(90, 50, 4) +
    `<g fill="#fff"><circle cx="36" cy="22" r="2.5"/><circle cx="42" cy="14" r="3.5"/></g>`,
  뿌듯하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<rect x="62" y="80" width="24" height="12" rx="2" fill="#e8553d"/><rect x="66" y="68" width="18" height="12" rx="2" fill="#ffd23f"/><rect x="62" y="56" width="24" height="12" rx="2" fill="#3b78e6"/><rect x="66" y="44" width="18" height="12" rx="2" fill="#43b04a"/><rect x="68" y="32" width="14" height="12" rx="2" fill="#ff9aa8"/><path d="M68 32L75 22L82 32Z" fill="#8e4fc9"/>` +
    shirt(32, 56, 14, 80, '#ff9f1a') +
    tube('M20 62L14 72L22 78', SKIN, 5) +
    tube('M44 62L50 72L42 78', SKIN, 5) +
    tube('M26 80L24 92M38 80L40 92', '#3b78e6', 6) +
    hd(32, 38, 0.48, happyEyes + smile + cheeks(66, 22)) +
    sparkle(90, 18, 6) +
    sparkle(60, 22, 5) +
    sparkle(92, 50, 4),
  편안하다:
    `<path d="M8 20V94M92 20V94" stroke="#9a5b2e" stroke-width="7"/>` +
    blob('#43b04a', [
      [8, 14, 10],
      [92, 14, 10],
    ]) +
    `<path d="M10 40C24 80 76 80 90 40" stroke="#c9b28a" stroke-width="2.5"/>` +
    tube('M40 54H76', '#3b78e6', 13) +
    hd(30, 44, 0.46, calmEyes + `<path d="M40 70q10 8 20 0" stroke-width="4"/>` + cheeks(66, 20)) +
    `<path d="M14 44C28 66 72 66 86 44C80 72 20 72 14 44Z" fill="#ff9f1a"/>` +
    `<path d="M26 62l4 6M40 66l2 6M56 66l-1 6M70 62l-3 6" stroke="#e8862e" stroke-width="2.5"/>` +
    sparkle(58, 30, 5) +
    sparkle(74, 36, 4),
  답답하다:
    `<path d="M30 30C20 10 40 4 48 16C54 2 78 8 70 24C84 22 80 40 66 34C58 44 40 40 38 32C26 38 18 28 30 30Z" fill="#dfe8f5"/>` +
    `<path d="M36 26c6-10 14 4 8 8s-10-10 2-12 12 10 6 12-8-8 0-10 12 6 6 10" stroke="#5d6780" stroke-width="2.5"/>` +
    hd(46, 68, 0.64, `<path d="M32 46l12 6M68 46l-12 6" stroke-width="4"/>` + eyes + `<path d="M40 78q10-6 20 0" stroke-width="4"/>`) +
    tube('M84 96L78 82', SKIN, 10) +
    `<rect x="70" y="70" width="16" height="14" rx="5" fill="${SKIN}"/>` +
    `<path d="M88 64l4-4M92 74h4" stroke="#ff9f1a" stroke-width="3"/>`,
  // ── 몸의 느낌 ──
  어지럽다:
    `<g transform="rotate(-10 50 58)">` +
    hd(
      50,
      60,
      0.76,
      `<path d="M38 55m0-1a1 1 0 0 1 1 1a2 2 0 0 1-2 2a3 3 0 0 1-3-3a5 5 0 0 1 5-5a7 7 0 0 1 7 7" stroke-width="3"/>` +
        `<path d="M62 55m0-1a1 1 0 0 1 1 1a2 2 0 0 1-2 2a3 3 0 0 1-3-3a5 5 0 0 1 5-5a7 7 0 0 1 7 7" stroke-width="3"/>` +
        `<path d="M38 76q4-4 8 0t8 0 8 0" stroke-width="4"/>`,
    ) +
    `</g>` +
    `<ellipse cx="50" cy="20" rx="34" ry="9" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="6 5"/>` +
    star(18, 20, 7, HL) +
    star(80, 14, 6, HL) +
    star(62, 29, 5, '#ff9aa8'),
  간지럽다:
    hd(42, 50, 0.76, squeeze + `<path d="M34 66H66C66 86 34 86 34 66Z" fill="#c62f3f"/>` + cheeks(66, 24)) +
    `<g transform="rotate(-35 80 70)"><path d="M80 44C90 56 90 82 80 96C70 82 70 56 80 44Z" fill="#7ec8f0"/><path d="M80 48V98M80 60l-6-4M80 70l6-4M80 80l-6-4" stroke="#3b78e6" stroke-width="2.5"/></g>` +
    `<path d="M62 86q-4 4 0 8M8 40l-4-4M8 56H2M78 26l4-6" stroke="#9aa6c4" stroke-width="3"/>` +
    sparkle(86, 30, 5),
  가렵다:
    tube('M4 60H74', SKIN, 20) +
    `<circle cx="42" cy="60" r="6" fill="#ff7a8a" stroke="#e8553d" stroke-width="2.5"/>` +
    tube('M72 96L56 74', SKIN, 10) +
    `<path d="M48 62C44 54 50 48 56 50L62 60L56 72C50 72 48 68 48 62Z" fill="${SKIN}"/>` +
    `<path d="M50 56h6M50 62h6" stroke-width="2"/>` +
    `<path d="M30 46l4-4M30 76l4 4M40 42l0-6" stroke="#e8553d" stroke-width="3"/>` +
    `<g transform="translate(72 22)"><ellipse cx="0" cy="0" rx="7" ry="4" fill="#5d6780"/><ellipse cx="-3" cy="-7" rx="5" ry="3" fill="#dfe8f5" stroke-width="2"/><ellipse cx="4" cy="-7" rx="5" ry="3" fill="#dfe8f5" stroke-width="2"/><path d="M-7 1l-7 4M-3 4l-3 6M3 4l2 6" stroke-width="2"/>${dot(4, -1, 1.4, '#fff')}</g>` +
    `<path d="M84 34q6 2 8 8" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="3 4"/>`,
  따갑다:
    `<path d="M24 76H60L56 94H28Z" fill="#e8862e"/>` +
    `<path d="M32 76V34C32 20 52 20 52 34V76Z" fill="#43b04a"/>` +
    `<path d="M24 58V48C24 42 32 42 32 48M52 50V42C52 36 60 36 60 42V54" fill="#43b04a"/>` +
    `<path d="M36 36l-5-2M48 30l5-2M36 50l-5-2M48 46l5-2M36 64l-5-2M48 62l5-2M42 26v-5" stroke-width="2.5"/>` +
    tube('M96 48L74 42', SKIN, 9) +
    `<ellipse cx="70" cy="40" rx="8" ry="6" fill="${SKIN}"/>` +
    `<path d="M66 26l-2-6M76 26l2-6M84 36l6-2M62 54l-4 4" stroke="#ff9f1a" stroke-width="3.5"/>`,
  쓰리다:
    tube('M4 44H52', SKIN, 20) +
    tube('M52 44L60 92', SKIN, 20) +
    `<ellipse cx="54" cy="48" rx="15" ry="9" fill="#f5c99a" transform="rotate(-30 54 48)"/>` +
    dot(50, 46, 1.5, '#c98a2a') +
    dot(56, 44, 1.5, '#c98a2a') +
    dot(54, 52, 1.5, '#c98a2a') +
    `<path d="M72 34l6-4M76 46h8M72 58l6 4M40 26l-2-6M52 22v-6" stroke="#ff5c70" stroke-width="3.5"/>` +
    hd(20, 16, 0.3, `<path d="M32 50l10 6-10 6M68 50l-10 6 10 6" stroke-width="6"/><path d="M40 76q10-6 20 0" stroke-width="6"/>`),
  저리다:
    tube('M4 70H66', '#3b78e6', 18) +
    `<path d="M62 56C62 50 72 50 74 56L82 74C84 80 80 84 74 84H60Z" fill="${SKIN}"/>` +
    `<path d="M80 50l6-8-4 0 6-8M90 64l8-2-3-3 6-3M88 84l8 4-3 2 6 4M58 44l-2-8" stroke="#ffc933" stroke-width="3.5"/>` +
    `<g fill="#ffc933" stroke="none"><circle cx="66" cy="44" r="2.5"/><circle cx="92" cy="76" r="2.5"/><circle cx="74" cy="92" r="2.5"/></g>` +
    hd(22, 32, 0.52, worryBrows + squeeze + `<path d="M38 76q4-4 8 0t8 0 8 0" stroke-width="4"/>`),
};
