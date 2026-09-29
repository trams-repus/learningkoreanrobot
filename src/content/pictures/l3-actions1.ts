// 9세 이상 동작 단어 (달려가다·다이빙하다·물구나무서다·토라지다·무너뜨리다…): 그 동작의 순간을 막대 사람·표정·손으로, 움직임 선과 화살표를 더해. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, stick, person, sparkle, tube, drop, blob, cheeks, moodFace, torso } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';

/** 땅 선 */
const ground = (y = 92) => `<path d="M4 ${y}H96" stroke="#c9b28a" stroke-width="3"/>`;
/** 움직임 선 (얇은 회청색) */
const mv = (d: string) => `<path d="${d}" stroke="${MOVE}" stroke-width="3"/>`;
/** 방향 화살표 (파랑) */
const arrow = (d: string, w = 5) => `<path d="${d}" stroke="${ARROW}" stroke-width="${w}"/>`;
/** 막대 사람 머리에 웃는 얼굴 */
const sf = (x: number, y: number) =>
  dot(x - 3.5, y, 1.6) + dot(x + 3.5, y, 1.6) + `<path d="M${x - 3} ${y + 4}q3 2.5 6 0" stroke-width="2"/>`;
/** 막대 사람 + 얼굴 */
const guy = (x: number, y: number, body: string, s = 1) => stick(x, y, body, s) + sf(x, y);
/** 음표 */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;
/** 큰 얼굴 (가운데 x,y, 반지름 r): 살색 동그라미 + 앞머리 */
const head = (x: number, y: number, r: number, skin = SKIN) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${skin}"/>` +
  `<path d="M${x - r} ${y - r * 0.12}C${x - r} ${y - r * 0.9} ${x - r * 0.5} ${y - r} ${x} ${y - r}S${x + r} ${y - r * 0.9} ${x + r} ${y - r * 0.12}C${x + r * 0.7} ${y - r * 0.5} ${x + r * 0.35} ${y - r * 0.6} ${x} ${y - r * 0.58}S${x - r * 0.7} ${y - r * 0.5} ${x - r} ${y - r * 0.12}Z" fill="${HAIR}"/>`;
/** 말풍선 (꼬리는 왼쪽 아래) */
const bubble = (x: number, y: number, w: number, h: number, tail: string, fill = '#fff') =>
  `<path d="M${x + 6} ${y}H${x + w - 6}Q${x + w} ${y} ${x + w} ${y + 6}V${y + h - 6}Q${x + w} ${y + h} ${x + w - 6} ${y + h}${tail}H${x + 6}Q${x} ${y + h} ${x} ${y + h - 6}V${y + 6}Q${x} ${y} ${x + 6} ${y}Z" fill="${fill}"/>`;
/** 흰 눈송이 (작은 별표 선) */
const flake = (x: number, y: number, r = 4) =>
  `<path d="M${x} ${y - r}V${y + r}M${x - r} ${y}H${x + r}M${x - r * 0.7} ${y - r * 0.7}L${x + r * 0.7} ${y + r * 0.7}M${x + r * 0.7} ${y - r * 0.7}L${x - r * 0.7} ${y + r * 0.7}" stroke="#7ec8f0" stroke-width="2.5"/>`;
/** 졸음 Z 모양 선 */
const zz = (x: number, y: number, s: number) =>
  `<path d="M${x} ${y}h${s}l${-s} ${s * 1.1}h${s}" stroke="${ARROW}" stroke-width="3.5"/>`;
/** 쌓기 블록 */
const block = (x: number, y: number, w: number, h: number, fill: string, rot = 0) =>
  `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="2" fill="${fill}" transform="rotate(${rot} ${x} ${y})"/>`;

export const PICS: Record<string, string> = {
  // ── 몸이 크게 움직이다 ──
  달려가다:
    ground() +
    mv('M4 38h10M6 52h8') +
    blob('#dfe8f5', [
      [12, 86, 4],
      [20, 84, 5],
    ]) +
    guy(34, 26, 'M4 10L-4 36M2 17L16 22L26 16M2 17L-10 26L-16 36M-4 36L10 48L6 66M-4 36L-20 52L-28 46') +
    arrow('M50 30H62M56 24l6 6-6 6', 4) +
    tube('M72 70L62 56', '#e85d9a', 5) +
    tube('M92 70L96 58', '#e85d9a', 5) +
    person(82, 92, 1.15, { hair: HAIR, style: 'pony', shirt: '#e85d9a' }) +
    `<circle cx="61" cy="54" r="4.5" fill="${SKIN}"/><circle cx="95" cy="55" r="4.5" fill="${SKIN}"/>`,
  뛰어오르다:
    ground() +
    `<ellipse cx="44" cy="91" rx="14" ry="3" fill="#d0d6e6" stroke="none"/>` +
    mv('M30 80v8M44 82v8M58 80v8') +
    guy(44, 20, 'M0 10V36M0 17L-14 6L-18 -6M0 17L14 6L18 -6M0 36L-10 48L-8 58M0 36L10 48L8 58') +
    arrow('M82 80V14M72 24l10-10 10 10'),
  뛰어내리다:
    `<rect x="4" y="44" width="30" height="48" fill="#e8862e"/><path d="M4 60H34M4 76H34M18 44V60M12 60V76M26 60V76M18 76V92" stroke-width="2.5"/>` +
    ground() +
    `<path d="M26 38C36 22 48 20 54 24" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    guy(58, 34, 'M0 10V34M0 17L-14 4M0 17L14 4M0 34L-10 48M0 34L10 48') +
    `<ellipse cx="58" cy="91" rx="12" ry="3" fill="#d0d6e6" stroke="none"/>` +
    arrow('M86 22V80M76 70l10 10 10-10'),
  기어오르다:
    `<rect x="36" y="6" width="58" height="88" rx="4" fill="#c9b28a"/>` +
    `<g stroke-width="2.5"><circle cx="46" cy="24" r="4.5" fill="#e8553d"/><circle cx="76" cy="22" r="4.5" fill="#3b78e6"/><circle cx="84" cy="54" r="4.5" fill="#43b04a"/>` +
    `<circle cx="48" cy="86" r="4.5" fill="#ffd23f"/><circle cx="74" cy="86" r="4.5" fill="#8e4fc9"/><circle cx="84" cy="12" r="4" fill="#ff9f1a"/><circle cx="44" cy="58" r="4" fill="#e85d9a"/></g>` +
    stick(62, 36, 'M0 10V36M0 16L-10 4L-16 -10M0 16L10 4L14 -12M0 36L-10 44L-14 50M0 36L10 46L12 50') +
    `<path d="M54 30q8 4 16 0" stroke="${HAIR}" stroke-width="4"/>` +
    arrow('M16 88V20M6 30l10-10 10 10'),
  잠수하다:
    `<path d="M4 20q11.5-6 23 0t23 0 23 0 23 0V94H4Z" fill="#7ec8f0"/>` +
    `<path d="M4 94V86C20 82 36 88 52 84S80 82 96 86V94Z" fill="#f2d59a"/>` +
    `<g transform="rotate(38 50 54)">` +
    `<path d="M10 48L22 54L10 60Z" fill="#ffd23f"/>` +
    tube('M20 54H36', '#3b78e6', 7) +
    `<ellipse cx="46" cy="54" rx="15" ry="9" fill="#3b78e6"/>` +
    tube('M52 50L84 48', SKIN, 5) +
    `<circle cx="68" cy="54" r="10" fill="${SKIN}"/><rect x="68" y="47" width="11" height="9" rx="3" fill="#bfe6fb"/>` +
    `<path d="M62 46V34H66" stroke="#ffd23f" stroke-width="4"/>` +
    `</g>` +
    `<g fill="#fff" stroke="#3b8fe0" stroke-width="2.5"><circle cx="46" cy="36" r="4"/><circle cx="52" cy="26" r="3"/><circle cx="84" cy="46" r="3.5"/></g>` +
    `<path d="M76 30C82 24 90 26 92 30C90 34 82 36 76 30ZM76 30L70 26V34Z" fill="#ff9f1a" stroke-width="2.5"/>`,
  다이빙하다:
    `<rect x="4" y="66" width="26" height="28" fill="#dfe8f5"/>` +
    `<path d="M30 68q8-5 16 0t16 0 16 0 16 0V94H30Z" fill="#7ec8f0"/>` +
    `<rect x="10" y="46" width="8" height="20" fill="#8a96b0"/><rect x="4" y="40" width="36" height="7" rx="2" fill="#3b78e6"/>` +
    `<path d="M36 34C40 14 50 8 58 12" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<path d="M66 44L56 30L44 18M56 30L40 24" stroke-width="6"/>` +
    `<path d="M66 44L80 64M66 44L84 60" stroke-width="5"/>` +
    `<circle cx="72" cy="46" r="8" fill="${SKIN}"/>` +
    `<path d="M76 68L70 58M86 66L90 56M94 70L98 62M66 70L60 64" stroke="#3b8fe0" stroke-width="3"/>`,
  미끄럼타다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M10 92V30M26 92V30M10 46H26M10 62H26M10 78H26" stroke="#8a96b0" stroke-width="4"/>` +
    `<rect x="6" y="26" width="28" height="7" rx="2" fill="#3b78e6"/>` +
    tube('M30 32C52 36 58 84 94 86', '#ff9f1a', 8) +
    guy(52, 32, 'M0 10L4 26M1 16L-8 4M1 16L12 4M4 26L20 34M4 26L18 40', 0.9) +
    mv('M34 44l6 4M30 54l6 4'),
  그네타다:
    `<path d="M12 94L24 8M88 94L76 8" stroke="#9a5b2e" stroke-width="7"/><path d="M18 10H82" stroke="#9a5b2e" stroke-width="7"/>` +
    `<path d="M44 12L60 64M56 12L76 62" stroke-width="2.5"/>` +
    `<path d="M20 70Q44 94 70 80" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<rect x="54" y="62" width="26" height="6" rx="2" fill="#e8553d" transform="rotate(-6 67 65)"/>` +
    guy(66, 36, 'M0 10V26M0 16L-6 24M0 16L8 22M0 26L14 26L22 38') +
    mv('M86 34l-4 6M90 46l-4 4'),
  썰매타다:
    `<path d="M4 38L96 84V96H4Z" fill="#fff"/>` +
    `<g transform="rotate(26.6 50 63)">` +
    `<rect x="26" y="52" width="46" height="8" rx="3" fill="#e8553d"/><path d="M28 64H72q8 0 8-10" stroke-width="4"/><path d="M36 60V64M62 60V64" stroke-width="3"/>` +
    `<circle cx="46" cy="18" r="11" fill="#3b78e6"/>` +
    guy(46, 26, 'M0 10V26M0 15L10 22L20 20M0 15L-6 24M0 26L18 26L24 24', 0.95) +
    `<path d="M36 22C36 12 56 12 56 22Z" fill="#3b78e6"/><circle cx="46" cy="12" r="4" fill="#fff"/>` +
    `</g>` +
    mv('M4 26l12 4M8 16l10 4') +
    flake(80, 14) +
    flake(90, 34) +
    flake(64, 8, 3),
  스키타다:
    `<path d="M4 30L96 76V96H4Z" fill="#fff"/>` +
    `<g transform="rotate(26.6 50 53)">` +
    `<path d="M18 60H80q8 0 10-6" stroke-width="7"/><path d="M18 60H80q8 0 10-6" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M30 42L26 60M68 34L74 58" stroke-width="3"/>` +
    `</g>` +
    guy(48, 22, 'M0 10L2 30M1 16L-12 26L-20 30M1 16L14 26L22 28M2 30L10 40L12 52M2 30L-6 42L-4 50') +
    `<path d="M38 18C38 8 58 8 58 18Z" fill="#ffd23f"/>` +
    blob('#dfe8f5', [
      [12, 40, 5],
      [18, 46, 4],
    ]) +
    flake(84, 14) +
    flake(70, 8, 3),
  줄넘기하다:
    ground() +
    `<ellipse cx="50" cy="91" rx="14" ry="3" fill="#d0d6e6" stroke="none"/>` +
    `<path d="M34 58C18 30 28 4 50 4S82 30 66 58" stroke="#e85d9a" stroke-width="4"/>` +
    `<path d="M34 60C28 94 72 94 66 60" stroke="${MOVE}" stroke-width="3" stroke-dasharray="4 5"/>` +
    guy(50, 28, 'M0 10V36M0 16L-14 30M0 16L14 30M0 36L-8 50L-6 56M0 36L8 50L6 56') +
    `<rect x="31" y="54" width="6" height="10" rx="2" fill="#ffd23f"/><rect x="63" y="54" width="6" height="10" rx="2" fill="#ffd23f"/>`,
  달리기하다:
    `<rect x="4" y="80" width="92" height="14" fill="#e8862e"/><path d="M4 87H96" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M88 80V14" stroke-width="4"/><rect x="66" y="14" width="22" height="16" fill="#fff"/><path d="M66 22H88M77 14V30" stroke-width="2.5"/>` +
    `<rect x="66" y="14" width="11" height="8" fill="${INK}"/><rect x="77" y="22" width="11" height="8" fill="${INK}"/>` +
    guy(20, 36, 'M2 10L-2 28M1 14L10 20L16 16M1 14L-8 20L-12 26M-2 28L6 36L4 46M-2 28L-12 40L-18 36', 0.85) +
    guy(50, 28, 'M4 10L-2 34M2 16L16 22L24 16M2 16L-10 24L-14 32M-2 34L10 44L8 54M-2 34L-16 48L-24 44') +
    `<rect x="47" y="42" width="8" height="8" rx="1" fill="#fff" stroke-width="2"/>` +
    mv('M4 44h8M6 56h6'),
  등산하다:
    `<path d="M40 64L68 14L96 52V64Z" fill="#8fbf6a"/><path d="M61 26L68 14L75 26L70 24L66 28Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M68 14V4" stroke-width="2.5"/><path d="M68 4L78 7L68 10Z" fill="#e8553d" stroke-width="2"/>` +
    `<path d="M4 96V90L96 48V96Z" fill="#5fc24a"/>` +
    `<rect x="26" y="30" width="14" height="22" rx="4" fill="#e8553d" transform="rotate(-12 33 41)"/>` +
    guy(44, 22, 'M2 10L0 36M1 16L12 26L16 30M1 16L-6 28M0 36L10 44L12 56M0 36L-6 48L-8 56', 0.95) +
    `<path d="M34 18C34 8 54 8 54 18Z" fill="#9a5b2e"/><path d="M30 18H58" stroke-width="3.5"/>` +
    `<path d="M60 16L56 70" stroke="#9a5b2e" stroke-width="3.5"/>` +
    arrow('M74 88L90 72M80 70H90V80', 4),
  캠핑하다:
    `<circle cx="86" cy="14" r="7" fill="#ffd23f"/>` +
    sparkle(66, 12, 4) +
    sparkle(12, 14, 4) +
    ground(88) +
    `<path d="M6 88L34 22L62 88Z" fill="#43b04a"/><path d="M34 22L64 30" stroke-width="3"/><path d="M34 44L24 88H44Z" fill="#2e6b33"/>` +
    `<path d="M68 88L90 76M68 76L90 88" stroke="#9a5b2e" stroke-width="6"/>` +
    `<path d="M79 80C68 72 72 60 78 50C80 58 86 58 86 52C92 62 90 76 79 80Z" fill="#ff9f1a"/><path d="M79 80C74 76 76 70 79 64C82 70 84 76 79 80Z" fill="#ffd23f" stroke-width="2.5"/>`,
  산책하다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<circle cx="84" cy="14" r="8" fill="#ffd23f"/>` +
    person(30, 92, 1.45, { hair: HAIR, style: 'short', shirt: '#3b78e6' }) +
    tube('M40 70L48 76', SKIN, 5) +
    `<path d="M50 76C60 70 64 64 68 64" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M88 72q8-4 8-12" stroke-width="4"/>` +
    `<ellipse cx="78" cy="76" rx="13" ry="8" fill="#f2c14e"/>` +
    `<path d="M70 80V90M76 82V90M84 82V90M88 80V90" stroke-width="4"/>` +
    `<circle cx="66" cy="66" r="9" fill="#f2c14e"/><path d="M60 60C56 62 56 70 60 72Z" fill="#9a5b2e"/>` +
    dot(66, 64, 2) +
    dot(59, 68, 2.2) +
    mv('M4 64h6M6 76h6'),
  여행하다:
    `<path d="M60 18L90 10L94 14L64 24Z" fill="#fff"/><path d="M74 16L70 6H76L82 14M72 20L76 28H82L80 18" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M10 22h12M16 30h14" stroke="${MOVE}" stroke-width="3"/>` +
    ground() +
    person(34, 92, 1.45, { hair: HAIR, style: 'long', shirt: '#43b04a', cap: '#e8553d' }) +
    tube('M46 70L56 58', SKIN, 5) +
    `<path d="M58 58V66M68 58V66M58 58H68" stroke-width="3.5"/>` +
    `<rect x="52" y="64" width="28" height="22" rx="4" fill="#3b78e6"/><path d="M52 74H80" stroke="#ffd23f" stroke-width="3"/>` +
    `<circle cx="58" cy="89" r="3" fill="${INK}"/><circle cx="74" cy="89" r="3" fill="${INK}"/>`,
  운동하다:
    ground() +
    guy(50, 34, 'M0 10V34M0 16L-16 12L-20 -4M0 16L16 12L20 -4M0 34L-10 58M0 34L10 58') +
    `<path d="M41 29H59" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M20 30H40M60 30H80" stroke-width="4"/>` +
    `<rect x="16" y="21" width="7" height="18" rx="2" fill="#5b6680"/><rect x="37" y="21" width="7" height="18" rx="2" fill="#5b6680"/>` +
    `<rect x="56" y="21" width="7" height="18" rx="2" fill="#5b6680"/><rect x="77" y="21" width="7" height="18" rx="2" fill="#5b6680"/>` +
    drop(22, 50, 0.6) +
    drop(78, 50, 0.6) +
    mv('M14 8l4 6M86 8l-4 6'),
  체조하다:
    ground() +
    `<rect x="14" y="86" width="72" height="6" rx="2" fill="#3b78e6"/>` +
    `<path d="M48 60L36 86M48 60L60 86" stroke-width="6"/>` +
    `<g transform="rotate(20 48 60)">` +
    `<path d="M48 60V34M48 40L32 12M48 40L64 12" stroke-width="6"/><circle cx="48" cy="26" r="10" fill="${SKIN}"/>` +
    sf(48, 26) +
    `</g>` +
    arrow('M74 18Q90 28 88 50M82 44l6 7 6-6', 4),
  물구나무서다:
    ground() +
    stick(50, 74, 'M0 -10V-40M0 -14L-12 16M0 -14L12 16M0 -40L-8 -64M0 -40L8 -64') +
    `<path d="M40 76C40 88 60 88 60 76C56 80 44 80 40 76Z" fill="${HAIR}"/>` +
    dot(46.5, 73, 1.6) +
    dot(53.5, 73, 1.6) +
    `<path d="M47 69q3 -2.5 6 0" stroke-width="2"/>` +
    mv('M30 14l-6-4M28 26h-8M70 14l6-4M72 26h8') +
    `<path d="M40 7l-2-4M60 7l2-4" stroke="${MOVE}" stroke-width="3"/>`,
  재주넘다:
    `<rect x="8" y="86" width="84" height="7" rx="2" fill="#3b78e6"/>` +
    `<path d="M22 78A34 34 0 1 1 80 76" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    arrow('M74 70l6 7 5-8', 4) +
    `<path d="M46 52V28L68 30L68 12" stroke-width="7"/>` +
    `<path d="M46 44L66 24" stroke-width="5"/>` +
    `<circle cx="46" cy="62" r="11" fill="${SKIN}"/><path d="M36 66C36 76 56 76 56 66C52 70 40 70 36 66Z" fill="${HAIR}"/>` +
    dot(42, 61, 1.7) +
    dot(50, 61, 1.7) +
    `<path d="M43 56q3-2.5 6 0" stroke-width="2"/>`,
  휘파람불다:
    head(40, 56, 30) +
    `<path d="M26 56q5-5 10 0M44 56q5-5 10 0" stroke-width="3.5"/>` +
    cheeks(66, 18, 40) +
    `<circle cx="48" cy="74" r="6" fill="#ff8aa0"/><circle cx="48" cy="74" r="2.6" fill="#c62f3f" stroke="none"/>` +
    mv('M58 72h8M58 80l7 4') +
    note(76, 38, '#8e4fc9') +
    note(86, 76, '#3b78e6'),
  피리불다:
    head(38, 36, 24) +
    `<path d="M26 38q5 4 10 0M40 38q5 4 10 0" stroke-width="3.5"/>` +
    cheeks(46, 15, 38) +
    tube('M42 52L62 92', '#f2c14e', 7) +
    `<ellipse cx="63" cy="92" rx="7" ry="4" fill="#f2c14e" transform="rotate(-27 63 92)"/>` +
    dot(50, 68, 1.8) +
    dot(53, 74, 1.8) +
    `<circle cx="47" cy="62" r="6" fill="${SKIN}"/><circle cx="57" cy="82" r="6" fill="${SKIN}"/>` +
    note(76, 32, '#8e4fc9') +
    note(88, 60, '#e85d9a'),
  북치다:
    `<path d="M18 52V82C18 94 82 94 82 82V52Z" fill="#e8553d"/>` +
    `<path d="M20 62L32 84L44 64L56 86L68 64L80 82" stroke="#ffd23f" stroke-width="3"/>` +
    `<ellipse cx="50" cy="52" rx="32" ry="11" fill="#fff1b8"/>` +
    tube('M14 14L40 48', '#b5793a', 4) +
    tube('M86 14L60 48', '#b5793a', 4) +
    `<circle cx="40" cy="48" r="4.5" fill="#fff"/><circle cx="60" cy="48" r="4.5" fill="#fff"/>` +
    `<circle cx="14" cy="14" r="7" fill="${SKIN}"/><circle cx="86" cy="14" r="7" fill="${SKIN}"/>` +
    `<path d="M50 34V24M40 34l-3-6M60 34l3-6" stroke="#ff9f1a" stroke-width="4"/>`,
  숙제하다:
    `<path d="M22 72C22 54 34 48 50 48S78 54 78 72Z" fill="#43b04a"/>` +
    head(50, 30, 17) +
    dot(44, 34, 2.2) +
    dot(56, 34, 2.2) +
    `<path d="M46 41q4 2 8 0" stroke-width="2.5"/>` +
    `<rect x="4" y="70" width="92" height="9" rx="2" fill="#b5793a"/><path d="M12 79V96M88 79V96" stroke="#9a5b2e" stroke-width="5"/>` +
    `<rect x="6" y="56" width="18" height="7" rx="1" fill="#3b78e6"/><rect x="8" y="63" width="18" height="7" rx="1" fill="#e8553d"/><rect x="6" y="48" width="16" height="8" rx="1" fill="#ffd23f"/>` +
    `<path d="M30 70L34 58H52V70Z" fill="#fff"/><path d="M52 70V58H70L74 70Z" fill="#fff"/>` +
    `<path d="M37 62h11M36 66h12M56 62h10" stroke="${ARROW}" stroke-width="2"/>` +
    tube('M62 68L74 48', '#ffd23f', 4) +
    `<circle cx="66" cy="62" r="5.5" fill="${SKIN}"/>`,
  질문하다:
    ground(94) +
    tube('M38 72L44 16', '#ff9f1a', 6) +
    person(28, 94, 1.5, { hair: HAIR, style: 'pony', shirt: '#ff9f1a' }) +
    `<circle cx="44" cy="12" r="7" fill="${SKIN}"/>` +
    `<path d="M18 38l5-2M29 36l6 1" stroke-width="2.5"/>` +
    person(82, 94, 1.2, { hair: '#3a2a20', style: 'short', shirt: '#3b78e6', glasses: true }) +
    bubble(52, 6, 36, 26, 'L60 40L60 32') +
    `<path d="M60 19h4M68 19h4M76 19h4" stroke-width="4"/>` +
    mv('M52 22l-4-2M52 30l-4 2'),
  대답하다:
    ground(94) +
    person(26, 94, 1.5, { hair: HAIR, style: 'pony', shirt: '#ff9f1a' }) +
    tube('M30 72L40 66', SKIN, 5) +
    person(84, 94, 1.2, { hair: '#3a2a20', style: 'short', shirt: '#3b78e6', glasses: true }) +
    tube('M74 70L62 62', SKIN, 5) +
    bubble(30, 6, 46, 30, 'L44 44L40 36') +
    `<path d="M38 16h30M38 26h22" stroke="${ARROW}" stroke-width="4"/>` +
    sparkle(12, 20, 6) +
    sparkle(68, 26, 4),
  손뼉치다:
    torso(
      tube('M26 76L34 68', '#3b78e6', 7) +
        tube('M74 76L66 68', '#3b78e6', 7) +
        `<ellipse cx="37" cy="60" rx="7" ry="13" fill="${SKIN}" transform="rotate(18 37 60)"/><ellipse cx="63" cy="60" rx="7" ry="13" fill="${SKIN}" transform="rotate(-18 63 60)"/>` +
        sparkle(50, 56, 9) +
        `<path d="M24 50q-6 8 0 16M76 50q6 8 0 16" stroke="${MOVE}" stroke-width="3"/>` +
        `<path d="M18 46q-8 12 0 24M82 46q8 12 0 24" stroke="${MOVE}" stroke-width="3"/>`,
    ) +
    sparkle(10, 24, 6) +
    sparkle(90, 24, 6),
  윙크하다:
    moodFace(
      dot(39, 56, 3.8) +
        `<path d="M32 46l12-2" stroke-width="3"/>` +
        `<path d="M54 57q7-7 14 0" stroke-width="4.5"/>` +
        `<path d="M36 70Q50 84 64 70Z" fill="#c62f3f"/>` +
        cheeks(68, 22),
    ) +
    sparkle(86, 40, 8) +
    sparkle(92, 24, 4),
  미소짓다:
    moodFace(`<path d="M32 58q7-7 14 0M54 58q7-7 14 0" stroke-width="4"/>` + `<path d="M38 72Q50 80 62 72" stroke-width="4"/>` + cheeks(68, 22)) +
    sparkle(10, 22, 5) +
    sparkle(90, 22, 5),
  화내다:
    `<circle cx="50" cy="56" r="30" fill="#ff8a70"/><path d="M20 52C19 30 34 24 50 24S81 30 80 50C74 42 64 38 50 38S26 42 20 52Z" fill="${HAIR}"/>` +
    `<path d="M32 48l12 6M68 48l-12 6" stroke-width="5"/>` +
    dot(40, 60) +
    dot(60, 60) +
    `<path d="M38 72Q50 66 62 72Q60 86 50 86Q40 86 38 72Z" fill="#c62f3f"/><path d="M42 72Q50 69 58 72" stroke="#fff" stroke-width="3"/>` +
    `<path d="M6 48l7 4-7 4 7 4-7 4M94 48l-7 4 7 4-7 4 7 4" stroke="#e8553d" stroke-width="3.5"/>` +
    `<path d="M10 20C6 14 12 8 16 12C18 6 26 8 24 14C28 16 26 24 20 22C16 26 10 24 10 20Z" fill="#fff" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M90 20C94 14 88 8 84 12C82 6 74 8 76 14C72 16 74 24 80 22C84 26 90 24 90 20Z" fill="#fff" stroke="${MOVE}" stroke-width="3"/>`,
  토라지다:
    `<path d="M22 96V76C22 64 34 58 50 58S78 64 78 76V96Z" fill="#e85d9a"/>` +
    tube('M26 72C30 86 56 88 72 78', '#c94481', 8) +
    tube('M74 72C70 86 44 88 28 78', '#c94481', 8) +
    `<circle cx="50" cy="34" r="21" fill="${SKIN}"/>` +
    `<path d="M29 38C26 18 40 12 50 13C60 13 66 18 66 24C56 22 44 26 38 40C35 42 31 42 29 38Z" fill="${HAIR}"/>` +
    `<path d="M56 30l9 2" stroke-width="3.5"/>` +
    `<circle cx="62" cy="42" r="6" fill="#ff9aa8" opacity=".7" stroke="none"/>` +
    `<path d="M66 46q5 0 4 4" stroke="#c62f3f" stroke-width="3"/>` +
    `<path d="M8 20c3-6 8-2 10-6s8-2 10-6" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M80 18q4-6 10-4" stroke="${MOVE}" stroke-width="3"/>`,
  부끄러워하다:
    moodFace(
      `<path d="M33 56q6 5 12 0M55 56q6 5 12 0" stroke-width="4"/>` +
        `<path d="M42 74q4-3 8 0t8 0" stroke-width="3.5"/>` +
        `<ellipse cx="32" cy="67" rx="9" ry="6" fill="#ff5c70" opacity=".6" stroke="none"/><ellipse cx="68" cy="67" rx="9" ry="6" fill="#ff5c70" opacity=".6" stroke="none"/>` +
        `<path d="M29 63l-2 7M35 63l-2 7M65 63l-2 7M71 63l-2 7" stroke="#e8553d" stroke-width="2"/>`,
    ) +
    `<ellipse cx="17" cy="72" rx="8" ry="13" fill="${SKIN}" transform="rotate(-10 17 72)"/><ellipse cx="83" cy="72" rx="8" ry="13" fill="${SKIN}" transform="rotate(10 83 72)"/>` +
    drop(84, 26, 0.7),
  졸다:
    `<path d="M22 80C22 64 34 58 50 58S78 64 78 80Z" fill="#8e4fc9"/>` +
    `<g transform="rotate(26 50 58)">` +
    head(50, 40, 19) +
    `<path d="M40 44q3 3 6 0M54 44q3 3 6 0" stroke-width="3"/><circle cx="50" cy="52" r="2.6" fill="#c62f3f" stroke-width="2"/>` +
    `</g>` +
    `<rect x="4" y="78" width="92" height="8" rx="2" fill="#b5793a"/><path d="M12 86V96M88 86V96" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M20 78L24 68H46V78Z" fill="#fff"/><path d="M46 78V68H68L72 78Z" fill="#fff"/>` +
    arrow('M16 24Q8 40 20 50M12 46l8 5 2-9', 4) +
    zz(74, 8, 9) +
    zz(88, 24, 6),
  삼키다:
    `<path d="M16 96C16 84 30 78 50 78S84 84 84 96Z" fill="#3b78e6"/>` +
    `<rect x="41" y="48" width="18" height="34" fill="${SKIN}"/>` +
    head(50, 30, 22) +
    `<path d="M38 32q4-4 8 0M54 32q4-4 8 0" stroke-width="3.5"/><path d="M44 42q6 3 12 0" stroke-width="3"/>` +
    cheeks(40, 15) +
    `<circle cx="50" cy="64" r="6" fill="#8e4fc9"/>` +
    arrow('M72 52V78M65 71l7 7 7-7', 4) +
    mv('M34 58l-6-2M34 68l-6 2'),
  맛보다:
    `<path d="M26 74H90V86C90 92 84 94 78 94H38C32 94 26 92 26 86Z" fill="#e8553d"/><rect x="22" y="70" width="72" height="6" rx="3" fill="#e8553d"/>` +
    `<path d="M40 66c-4-4 4-6 0-10M58 66c-4-4 4-6 0-10" stroke="${MOVE}" stroke-width="3"/>` +
    head(30, 32, 22) +
    `<path d="M19 32q4-4 8 0M33 32q4-4 8 0" stroke-width="3.5"/>` +
    cheeks(40, 14, 30) +
    tube('M46 46L74 58', '#dfe8f5', 4) +
    `<ellipse cx="44" cy="45" rx="8" ry="5" fill="#dfe8f5"/>` +
    `<path d="M36 44q4 6 8 2" fill="#ff8aa0" stroke-width="2.5"/>` +
    `<circle cx="76" cy="58" r="7" fill="${SKIN}"/>` +
    sparkle(62, 20, 7) +
    sparkle(78, 34, 5),
  냄새맡다:
    head(62, 50, 28) +
    `<path d="M48 50q5-4 10 0M66 50q5-4 10 0" stroke-width="3.5"/>` +
    `<ellipse cx="62" cy="62" rx="6" ry="5" fill="#ffbf94"/>` +
    `<path d="M54 72q8 6 16 0" stroke-width="3.5"/>` +
    cheeks(64, 20, 62) +
    `<path d="M20 94V66" stroke="#3a9e47" stroke-width="4"/><path d="M20 84C12 84 8 78 8 74C14 74 20 78 20 84Z" fill="#43b04a"/>` +
    `<g fill="#e85d9a"><circle cx="20" cy="50" r="6"/><circle cx="28" cy="56" r="6"/><circle cx="25" cy="65" r="6"/><circle cx="15" cy="65" r="6"/><circle cx="12" cy="56" r="6"/></g>` +
    dot(20, 58, 4, '#ffd23f') +
    `<path d="M30 40c4-4 7 4 11 0s7 4 11 0M26 28c4-4 7 4 11 0s7 4 11 0" stroke="#ff5c70" stroke-width="3"/>`,
  만지다:
    `<path d="M4 82H96" stroke="#c9b28a" stroke-width="3"/>` +
    blob('#ff9aa8', [
      [70, 60, 16],
      [58, 66, 10],
      [82, 66, 10],
      [62, 50, 10],
      [80, 50, 10],
      [70, 44, 9],
    ]) +
    `<path d="M62 50q4-6 10-6" stroke="#fff" stroke-width="4"/>` +
    tube('M4 60H20', '#3b78e6', 10) +
    tube('M34 54H46', SKIN, 7) +
    `<rect x="18" y="50" width="20" height="20" rx="8" fill="${SKIN}"/>` +
    `<path d="M24 64h10M24 70h8" stroke-width="2.5"/>` +
    `<path d="M48 44l-2-6M52 48l5-4M48 64l2 6" stroke="${HL}" stroke-width="4"/>`,
  꼬집다:
    head(44, 54, 32) +
    dot(32, 56) +
    `<path d="M50 52l8 4-8 4" stroke-width="3.5"/>` +
    `<path d="M36 76q6-4 12 0" stroke-width="3.5"/>` +
    `<circle cx="26" cy="68" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<ellipse cx="68" cy="68" rx="8" ry="7" fill="#ff9aa8"/>` +
    tube('M94 52L74 62', SKIN, 8) +
    tube('M94 84L74 74', SKIN, 8) +
    `<ellipse cx="92" cy="68" rx="7" ry="16" fill="${SKIN}"/>` +
    mv('M66 54l-4-5M66 82l-4 5') +
    sparkle(16, 28, 5),
  문지르다:
    `<rect x="4" y="72" width="92" height="20" rx="3" fill="#b5793a"/>` +
    `<path d="M14 84c6-4 12 4 18 0M66 84c6-4 12 4 18 0" stroke="#d9a066" stroke-width="3"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="30" cy="66" r="5"/><circle cx="76" cy="66" r="5"/><circle cx="22" cy="58" r="3.5"/><circle cx="84" cy="58" r="3.5"/></g>` +
    tube('M60 44L84 12', '#e8553d', 9) +
    `<rect x="38" y="56" width="30" height="16" rx="3" fill="#ffd23f"/>` +
    dot(46, 64, 1.8, '#e8a800') +
    dot(56, 62, 1.8, '#e8a800') +
    dot(62, 67, 1.8, '#e8a800') +
    `<path d="M40 56C40 38 66 38 66 56Z" fill="${SKIN}"/>` +
    arrow('M8 34H48M14 28l-6 6 6 6M42 28l6 6-6 6', 4),
  내려놓다:
    `<rect x="8" y="78" width="84" height="7" rx="2" fill="#b5793a"/><path d="M16 85V96M84 85V96" stroke="#9a5b2e" stroke-width="5"/>` +
    `<rect x="32" y="12" width="36" height="26" rx="2" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<rect x="32" y="50" width="36" height="26" rx="2" fill="#d9a066"/><path d="M50 50V60" stroke="#9a5b2e" stroke-width="4"/>` +
    tube('M20 20L30 58', '#3b78e6', 7) +
    tube('M80 20L70 58', '#3b78e6', 7) +
    `<circle cx="31" cy="62" r="6" fill="${SKIN}"/><circle cx="69" cy="62" r="6" fill="${SKIN}"/>` +
    arrow('M8 36V64M2 58l6 6 6-6', 4) +
    arrow('M92 36V64M86 58l6 6 6-6', 4),
  무너뜨리다:
    ground() +
    guy(20, 40, 'M0 10L2 36M1 16L22 18M1 16L20 24M2 36L-8 52M2 36L10 52') +
    mv('M46 52l6-2M46 62l6 2') +
    block(64, 84, 18, 14, '#3b78e6') +
    block(84, 84, 18, 14, '#43b04a') +
    block(66, 64, 16, 14, '#e8553d', 18) +
    block(82, 46, 16, 14, '#ffd23f', -24) +
    block(66, 28, 14, 12, '#8e4fc9', 40) +
    block(88, 16, 12, 12, '#ff9f1a', -30) +
    mv('M56 22l-4-4M76 30l4-6M92 34l4 2'),
  구기다:
    `<path d="M30 40L40 30L52 34L62 28L72 38L70 50L76 62L66 72L54 70L44 76L32 68L30 56L24 48Z" fill="#fff"/>` +
    `<path d="M40 30L46 46L62 28M46 46L30 56M46 46L54 70M46 46L70 50M54 70L66 58" stroke-width="2.5"/>` +
    `<ellipse cx="18" cy="54" rx="10" ry="17" fill="${SKIN}"/><ellipse cx="82" cy="54" rx="10" ry="17" fill="${SKIN}"/>` +
    `<path d="M22 44h6M22 52h7M22 60h6M78 44h-6M78 52h-7M78 60h-6" stroke-width="2.5"/>` +
    arrow('M6 18H26M20 12l6 6-6 6', 4) +
    arrow('M94 18H74M80 12l-6 6 6 6', 4) +
    mv('M40 84l4-4M50 88v-6M60 84l-4-4'),
};
