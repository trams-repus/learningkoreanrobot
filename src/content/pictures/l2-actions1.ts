// 7~8세 동작 단어 (걸어가다·굴리다·썰다·빨래하다·캐다…): 그 동작을 하는 순간을 움직임 선·화살표로. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, stick, person, sparkle, tube, drop, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';

/** 땅 선 */
const ground = (y = 92) => `<path d="M4 ${y}H96" stroke="#c9b28a" stroke-width="3"/>`;
/** 움직임 선 (얇은 회청색) */
const mv = (d: string) => `<path d="${d}" stroke="${MOVE}" stroke-width="3"/>`;
/** 방향 화살표 (파랑) — 몸통과 머리를 한 path에 */
const arrow = (d: string, w = 5) => `<path d="${d}" stroke="${ARROW}" stroke-width="${w}"/>`;
/** 막대 사람 머리에 얼굴 (웃는 눈·입) */
const sf = (x: number, y: number) => dot(x - 3.5, y, 1.6) + dot(x + 3.5, y, 1.6) + `<path d="M${x - 3} ${y + 4}q3 2.5 6 0" stroke-width="2"/>`;
/** 막대 사람 + 얼굴 */
const guy = (x: number, y: number, body: string, s = 1) => stick(x, y, body, s) + sf(x, y);

/** 축구공 */
const soccer = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` +
  `<path d="M${x} ${y - r * 0.4}L${x + r * 0.38} ${y - r * 0.12}L${x + r * 0.24} ${y + r * 0.32}H${x - r * 0.24}L${x - r * 0.38} ${y - r * 0.12}Z" fill="${INK}" stroke-width="2"/>`;

/** 앞으로 가는 화살표 (x1 → x2, 높이 y) */
const arrowRight = (x1: number, x2: number, y: number) => arrow(`M${x1} ${y}H${x2}M${x2 - 8} ${y - 8}l8 8-8 8`);

/** 계단 (올라가다·내려가다) */
const stairsUp = `<path d="M4 94V86H28V74H52V62H76V50H96V94Z" fill="#e0c9a0"/><path d="M28 86V94M52 74V94M76 62V94" stroke-width="2.5"/>`;
const stairsDown = `<path d="M4 94V50H24V62H48V74H72V86H96V94Z" fill="#e0c9a0"/><path d="M24 62V94M48 74V94M72 86V94" stroke-width="2.5"/>`;

/** 문 틀과 밝은 안쪽 (x = 왼쪽) */
const doorway = (x: number) =>
  `<rect x="${x}" y="8" width="36" height="84" fill="#fff1b8"/>` + `<path d="M${x} 92V8H${x + 36}V92" stroke-width="5"/>`;

/** 트럭 (싣다·내리다): 짐칸 x36~70, 운전칸 오른쪽 */
const truck =
  `<rect x="34" y="56" width="38" height="16" rx="2" fill="#43b04a"/>` +
  `<path d="M72 72V40H86L94 54V72Z" fill="#43b04a"/><path d="M76 44H85L90 54H76Z" fill="#bfe6fb" stroke-width="2.5"/>` +
  `<circle cx="46" cy="76" r="8" fill="#5b6680"/><circle cx="84" cy="76" r="8" fill="#5b6680"/>` +
  `<circle cx="46" cy="76" r="3" fill="#dfe8f5" stroke="none"/><circle cx="84" cy="76" r="3" fill="#dfe8f5" stroke="none"/>`;
/** 종이 상자 */
const box = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#d9a066"/><path d="M${x + w / 2} ${y}V${y + h * 0.4}" stroke="#9a5b2e" stroke-width="4"/>`;

/** 블록 하나 (돌린 사각형) */
const block = (x: number, y: number, w: number, h: number, fill: string, rot = 0) =>
  `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="2" fill="${fill}" transform="rotate(${rot} ${x} ${y})"/>`;

/** 가위 (날 끝이 왼쪽, 손잡이 오른쪽) */
const scissors = (tx: string) =>
  `<g transform="${tx}"><path d="M0 0L40 -11L44 -5Z" fill="#dfe8f5"/><path d="M0 0L40 11L44 5Z" fill="#dfe8f5"/>` +
  `<circle cx="50" cy="-15" r="9" fill="#e8553d"/><circle cx="50" cy="15" r="9" fill="#e8553d"/>` +
  `<circle cx="50" cy="-15" r="3.5" fill="#fff7e0"/><circle cx="50" cy="15" r="3.5" fill="#fff7e0"/>` +
  dot(28, 0, 2.8) +
  `</g>`;

/** 작은 얼굴 (나누다) */
const kidHead = (x: number, y: number, hair: string) =>
  `<circle cx="${x}" cy="${y}" r="13" fill="${SKIN}"/>` +
  `<path d="M${x - 13} ${y - 2}C${x - 13} ${y - 12} ${x - 6} ${y - 15} ${x} ${y - 15}S${x + 13} ${y - 12} ${x + 13} ${y - 2}C${x + 9} ${y - 7} ${x + 4} ${y - 9} ${x} ${y - 8}S${x - 9} ${y - 7} ${x - 13} ${y - 2}Z" fill="${hair}"/>` +
  dot(x - 4.5, y + 1, 1.9) +
  dot(x + 4.5, y + 1, 1.9) +
  `<path d="M${x - 4} ${y + 6}q4 3 8 0" stroke-width="2.2"/>`;

/** 흙 (캐다·뽑다) */
const soil = (y: number) => `<path d="M4 ${y}C24 ${y - 6} 76 ${y - 6} 96 ${y}V96H4Z" fill="#9a5b2e"/>`;

export const PICS: Record<string, string> = {
  // ── 몸이 움직이는 길 ──
  걸어가다:
    ground() +
    `<ellipse cx="10" cy="88" rx="5" ry="3" fill="#b08a5c" stroke="none"/><ellipse cx="22" cy="84" rx="5" ry="3" fill="#b08a5c" stroke="none"/>` +
    `<ellipse cx="34" cy="88" rx="5" ry="3" fill="#b08a5c" stroke="none"/>` +
    guy(56, 26, 'M0 10L1 36M0 17L-10 32M0 17L11 30M1 36L-10 62M1 36L13 62') +
    arrowRight(70, 92, 30),
  뛰어가다:
    ground() +
    mv('M6 34h14M4 48h12M8 62h12') +
    blob('#dfe8f5', [
      [16, 86, 5],
      [24, 84, 6],
    ]) +
    guy(58, 22, 'M-2 10L-8 36M-3 17L8 28L20 22M-3 17L-16 22L-22 32M-8 36L8 48L4 66M-8 36L-24 52L-34 46', 1) +
    arrowRight(74, 94, 40),
  기어가다:
    ground(90) +
    tube('M24 66L20 86L6 86', SKIN, 8) +
    `<ellipse cx="38" cy="64" rx="20" ry="13" fill="#7ec8f0"/>` +
    tube('M52 68L56 86', SKIN, 8) +
    tube('M46 70L46 86', SKIN, 7) +
    `<circle cx="66" cy="50" r="16" fill="${SKIN}"/><path d="M56 38q8-10 16-2" stroke="${HAIR}" stroke-width="4"/>` +
    dot(64, 50, 2.2) +
    dot(74, 50, 2.2) +
    `<path d="M66 58q4 3 8 0" stroke-width="2.5"/>` +
    arrowRight(70, 94, 22) +
    mv('M4 56h10M6 68h8'),
  날아가다:
    `<path d="M6 92C14 78 24 72 34 68" stroke="${MOVE}" stroke-width="3" stroke-dasharray="6 6"/>` +
    `<g transform="rotate(-24 54 56)">` +
    `<path d="M50 50L30 18C46 20 58 32 60 46Z" fill="#e8862e"/>` +
    `<ellipse cx="54" cy="58" rx="20" ry="12" fill="#ffc933"/>` +
    `<path d="M36 60L18 52L26 68Z" fill="#ffc933"/>` +
    `<circle cx="76" cy="48" r="11" fill="#ffc933"/>` +
    `<path d="M86 45L97 49L86 53Z" fill="#ff9f1a"/>` +
    dot(79, 45, 2.4) +
    `<path d="M52 54L42 28C54 30 62 40 62 52Z" fill="#ff9f1a"/>` +
    `</g>` +
    arrow('M78 20L92 6M80 6H92V18'),
  헤엄치다:
    `<path d="M4 18q8-6 16 0t16 0 16 0 16 0 16 0 16 0V96H4Z" fill="#bfe6fb"/>` +
    `<path d="M6 42h12M4 58h14M6 74h12" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M34 58L16 42V76Z" fill="#ff9f1a"/>` +
    `<ellipse cx="56" cy="58" rx="28" ry="18" fill="#ff9f1a"/>` +
    `<path d="M50 42C54 32 66 32 70 42Z" fill="#e8862e"/>` +
    `<path d="M52 62C56 70 62 70 64 66" stroke="#e8862e" stroke-width="4"/>` +
    `<circle cx="70" cy="52" r="5" fill="#fff"/>` +
    dot(71, 52, 2.6) +
    `<path d="M78 64q3 2 6 0" stroke-width="2.5"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="90" cy="40" r="4"/><circle cx="84" cy="28" r="3"/></g>`,
  미끄러지다:
    `<ellipse cx="54" cy="88" rx="42" ry="6" fill="#bfe6fb"/>` +
    `<path d="M30 88h10M62 88h12" stroke="#fff" stroke-width="3"/>` +
    guy(34, 34, 'M4 9L20 30M8 16L-6 2M8 16L24 6M20 30L44 20M20 30L36 52', 1) +
    `<circle cx="34" cy="38" r="2.4" fill="${INK}" stroke="none"/>` +
    mv('M18 18l-4-6M28 14l-1-7M84 74h10M80 82h14') +
    arrow('M50 80H86M78 72l8 8-8 8', 4),
  매달리다:
    `<path d="M14 94V14M86 94V14" stroke="#8a96b0" stroke-width="6"/>` +
    `<path d="M10 14H90" stroke="#e8553d" stroke-width="7"/>` +
    guy(50, 38, 'M0 10V38M0 14L-9 -22M0 14L9 -22M0 38L-6 58M0 38L6 58') +
    `<circle cx="41" cy="15" r="4.5" fill="${SKIN}"/><circle cx="59" cy="15" r="4.5" fill="${SKIN}"/>` +
    mv('M30 92q20 8 40 0'),
  뛰어넘다:
    ground() +
    `<rect x="38" y="64" width="24" height="28" rx="2" fill="#e8862e"/><path d="M38 78H62" stroke-width="2.5"/>` +
    guy(48, 16, 'M0 10L2 30M1 16L-14 8M1 16L16 6M2 30L-14 34L-18 44M2 30L18 28L26 36', 1) +
    `<path d="M8 88Q12 50 26 36" stroke="${MOVE}" stroke-width="3" stroke-dasharray="6 6"/>` +
    arrow('M74 36Q88 50 92 84M84 78l8 8 4-10', 4),
  건너다:
    `<rect x="4" y="56" width="92" height="38" fill="#8a96b0"/>` +
    `<g fill="#fff" stroke="none"><rect x="10" y="60" width="10" height="30"/><rect x="28" y="60" width="10" height="30"/><rect x="46" y="60" width="10" height="30"/><rect x="64" y="60" width="10" height="30"/><rect x="82" y="60" width="10" height="30"/></g>` +
    guy(48, 28, 'M0 10L1 32M0 16L-10 28M0 16L11 27M1 32L-10 56M1 32L12 56', 1) +
    arrowRight(8, 90, 10),
  올라가다:
    stairsUp +
    guy(34, 23, 'M0 10V38M0 16L-10 30M0 16L12 28M0 38L-4 64M0 38L14 36L20 48', 0.8) +
    arrow('M60 36L86 10M74 10H86V22'),
  내려가다:
    stairsDown +
    guy(40, 11, 'M0 10V38M0 16L-12 28M0 16L12 26M0 38L-4 64M0 38L12 56L17 78', 0.8) +
    arrow('M64 18L88 42M88 30V42H76'),
  들어가다:
    ground() +
    doorway(58) +
    `<path d="M58 92V8L40 16V88Z" fill="#b5793a"/>` +
    guy(64, 28, 'M0 10L1 36M0 17L-10 32M0 17L11 30M1 36L-10 62M1 36L13 62') +
    `<path d="M76 8H94V92H76Z" fill="#fff7e0" stroke="none"/><path d="M76 92V8H94" stroke-width="5"/>` +
    `<path d="M76 8V92" stroke-width="5"/>` +
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    arrow('M8 32H34M26 24l8 8-8 8'),
  나오다:
    ground() +
    doorway(8) +
    `<path d="M44 92V8L60 16V88Z" fill="#b5793a"/>` +
    guy(40, 28, 'M0 10L1 36M0 17L-10 32M0 17L11 30M1 36L-10 62M1 36L13 62') +
    `<path d="M4 8H26V92H4Z" fill="#fff7e0" stroke="none"/>` +
    `<path d="M26 8V92" stroke-width="5"/>` +
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    arrow('M64 44H92M84 36l8 8-8 8'),
  돌다:
    `<ellipse cx="50" cy="90" rx="20" ry="4" fill="#d0d6e6" stroke="none"/>` +
    guy(50, 16, 'M0 10V40M0 18L-24 10M0 18L24 10M0 40L-3 72M0 40L12 54L2 62') +
    arrow('M40 46.4A34 10 0 1 0 64 46.4', 4) +
    arrow('M71 41L64 46.4L70 52', 4) +
    mv('M10 20q-4 8 0 14M90 20q4 8 0 14'),
  돌리다:
    `<ellipse cx="50" cy="90" rx="18" ry="3.5" fill="#d0d6e6" stroke="none"/>` +
    `<rect x="45" y="22" width="10" height="24" rx="3" fill="#9a5b2e"/>` +
    `<path d="M20 50C20 38 80 38 80 50L50 88Z" fill="#e8553d"/>` +
    `<path d="M26 56H74" stroke="${HL}" stroke-width="6"/><path d="M36 70H64" stroke="#3b78e6" stroke-width="5"/>` +
    `<path d="M20 50C20 38 80 38 80 50L50 88Z"/>` +
    tube('M92 10L60 22', SKIN, 11) +
    `<circle cx="58" cy="22" r="7" fill="${SKIN}"/>` +
    arrow('M28 36A30 9 0 1 0 60 28', 4) +
    arrow('M54 23L61 28L55 34', 4) +
    mv('M10 62q-4 6 0 12M90 62q4 6 0 12'),
  굴리다:
    ground() +
    mv('M4 40h8M4 52h8') +
    guy(22, 36, 'M0 10L6 34M2 17L24 26M2 17L22 34M6 34L-4 56M6 34L16 56') +
    `<circle cx="66" cy="68" r="23" fill="#43b04a"/><path d="M44 62C56 70 76 70 88 62M60 46C70 56 72 76 64 90" stroke="#fff" stroke-width="4"/>` +
    arrow('M48 34A26 26 0 0 1 86 40', 4) +
    arrow('M78 36L87 41L84 50', 4),
  // ── 공놀이 ──
  차다:
    ground() +
    guy(30, 22, 'M0 10L-2 38M-1 17L-14 28M-1 17L12 26M-2 38L-8 66M-2 38L16 50L30 46', 1) +
    `<path d="M62 62l6-4M62 76l6 3M58 70h-6" stroke="#ff9f1a" stroke-width="3.5"/>` +
    soccer(76, 62, 12) +
    arrow('M78 38L92 26M80 24H93V36', 4),
  치다:
    ground() +
    guy(28, 30, 'M0 10L0 38M0 17L18 18M0 17L16 24M0 38L-10 62M0 38L10 62') +
    `<path d="M40 26L44 18L76 4C86 0 92 10 84 16Z" fill="#b5793a"/><circle cx="42" cy="22" r="5" fill="${SKIN}"/>` +
    `<path d="M84 26l6-6M86 38h8M80 18V10" stroke="#ff9f1a" stroke-width="3.5"/>` +
    `<circle cx="76" cy="34" r="10" fill="#fff"/><path d="M70 28q3 6 0 12M82 28q-3 6 0 12" stroke="#e8553d" stroke-width="2.5"/>` +
    mv('M62 44l-8 4M66 52l-8 6') +
    arrow('M84 50L94 62M94 50V62H82', 4),
  튀기다:
    ground() +
    guy(36, 20, 'M0 10V40M0 17L16 30L24 40M0 17L-12 32M0 40L-8 70M0 40L8 70') +
    `<circle cx="61" cy="61" r="4" fill="${SKIN}"/>` +
    `<circle cx="62" cy="77" r="10" fill="#ff9f1a"/><path d="M52 77H72M62 67V87" stroke-width="2.5"/>` +
    mv('M52 91l-4-3M72 91l4-3') +
    arrow('M86 44V82M78 52l8-8 8 8M78 74l8 8 8-8', 4),
  받아치다:
    `<path d="M4 22Q22 22 38 36" stroke="${MOVE}" stroke-width="3" stroke-dasharray="6 6"/>` +
    arrow('M46 58Q30 72 10 74M20 66l-10 8 10 8', 4) +
    tube('M78 64L92 84', '#9a5b2e', 7) +
    `<circle cx="66" cy="46" r="20" fill="#e8553d"/>` +
    `<circle cx="90" cy="86" r="7" fill="${SKIN}"/>` +
    `<circle cx="44" cy="42" r="7" fill="#fff"/>` +
    `<path d="M50 30l-2-6M54 38l6-4" stroke="#ff9f1a" stroke-width="3.5"/>`,
  굴러가다:
    ground() +
    mv('M4 58h16M8 70h14M4 82h16') +
    `<circle cx="58" cy="68" r="23" fill="#fff"/>` +
    `<path d="M58 45A23 23 0 0 1 81 68H58Z" fill="#e8553d" stroke="none"/><path d="M58 91A23 23 0 0 1 35 68H58Z" fill="#3b78e6" stroke="none"/>` +
    `<circle cx="58" cy="68" r="23"/><circle cx="58" cy="68" r="4" fill="${HL}"/>` +
    arrow('M34 36A28 28 0 0 1 82 36', 4) +
    arrow('M74 30L83 37L78 45', 4),
  // ── 부엌 ──
  쏟다:
    ground(86) +
    `<path d="M40 58C58 56 70 64 70 84H52C52 72 48 66 40 64Z" fill="#7ec8f0"/>` +
    `<ellipse cx="68" cy="84" rx="26" ry="6" fill="#7ec8f0"/>` +
    `<g transform="rotate(100 30 62)"><path d="M10 40H50L44 84H16Z" fill="#dff2fc"/><path d="M11 48H49L48 58H12Z" fill="#7ec8f0" stroke="none"/><path d="M10 40H50L44 84H16Z"/><path d="M20 60V76" stroke="#fff" stroke-width="3"/></g>` +
    drop(80, 50, 0.7) +
    drop(90, 64, 0.55) +
    drop(64, 44, 0.55) +
    mv('M14 30l-4-6M26 28V20M38 30l4-6'),
  섞다:
    tube('M52 58L80 10', '#b5793a', 5) +
    `<path d="M8 56H92C90 80 74 92 50 92S10 80 8 56Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="56" rx="42" ry="11" fill="#ffd23f"/>` +
    `<path d="M24 56C28 48 46 48 50 56S72 64 76 56" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M36 60C40 64 46 64 48 60" stroke="#e8553d" stroke-width="4"/>` +
    tube('M52 56L64 36', '#b5793a', 5) +
    arrow('M14 36A36 10 0 0 1 50 26', 4) +
    arrow('M42 20L51 26L43 32', 4) +
    arrow('M86 40A36 10 0 0 1 72 46', 4),
  젓다:
    `<path d="M36 18c-4-6 4-8 0-14M50 16c-4-6 4-8 0-14" stroke="${MOVE}" stroke-width="3"/>` +
    tube('M54 60L78 14', '#dfe8f5', 5) +
    `<path d="M20 38H74V78C74 88 66 94 56 94H38C28 94 20 88 20 78Z" fill="#e85d9a"/>` +
    `<path d="M74 48C90 48 90 72 74 72" stroke-width="7"/><path d="M74 48C90 48 90 72 74 72" stroke="#e85d9a" stroke-width="3"/>` +
    `<ellipse cx="47" cy="40" rx="25" ry="6" fill="#9a5b2e"/>` +
    tube('M54 40L62 24', '#dfe8f5', 5) +
    arrow('M28 34A20 6 0 1 0 50 34', 4) +
    arrow('M44 30L51 34L45 39', 4) +
    `<path d="M66 40A20 6 0 0 0 70 36"/>`,
  굽다:
    `<path d="M22 20c-4-6 4-8 0-14M50 20c-4-6 4-8 0-14M78 20c-4-6 4-8 0-14" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M24 78C20 70 28 66 26 58C34 64 36 70 32 78ZM46 78C42 68 52 64 50 54C58 62 60 70 54 78ZM70 78C66 70 74 66 72 58C80 64 82 70 76 78Z" fill="#ff9f1a"/>` +
    `<path d="M14 84H86L80 94H20Z" fill="#5b6680"/>` +
    `<path d="M10 52H90" stroke-width="5"/><path d="M20 52v6M40 52v6M60 52v6M80 52v6" stroke-width="3"/>` +
    `<rect x="14" y="30" width="34" height="16" rx="8" fill="#c0562b"/><rect x="52" y="30" width="34" height="16" rx="8" fill="#c0562b"/>` +
    `<path d="M24 32l-4 12M34 32l-4 12M62 32l-4 12M72 32l-4 12" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M4 88h8M88 88h8" stroke="#8a96b0" stroke-width="5"/>`,
  볶다:
    `<rect x="24" y="22" width="10" height="10" rx="2" fill="#43b04a" transform="rotate(20 29 27)"/>` +
    `<rect x="46" y="10" width="10" height="10" rx="2" fill="#ff9f1a" transform="rotate(-20 51 15)"/>` +
    `<circle cx="64" cy="28" r="5" fill="#e8553d"/>` +
    `<rect x="38" y="34" width="9" height="9" rx="2" fill="#ffd23f"/>` +
    mv('M18 40l-4-10M58 44l2-8M72 40l6-6') +
    tube('M70 60L96 50', '#6b3e26', 7) +
    `<path d="M8 56H74C74 72 62 80 42 80S8 72 8 56Z" fill="#5b6680"/>` +
    `<path d="M8 56H74" stroke-width="5"/>` +
    `<path d="M18 56C22 50 30 52 34 56M40 56C44 50 56 50 60 56" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M28 94C24 88 32 86 30 80C38 84 38 90 34 94ZM50 94C46 88 54 86 52 80C60 84 60 90 56 94Z" fill="#ff9f1a"/>`,
  썰다:
    `<rect x="6" y="66" width="88" height="22" rx="4" fill="#d9a066"/>` +
    `<path d="M10 58C10 50 44 50 50 54L52 64H10Z" fill="#ff9f1a"/>` +
    `<path d="M10 58C10 52 6 48 8 44M14 52l-6-10" stroke="#43b04a" stroke-width="4"/>` +
    `<ellipse cx="66" cy="60" rx="4" ry="6" fill="#ff9f1a"/><ellipse cx="76" cy="60" rx="4" ry="6" fill="#ff9f1a"/><ellipse cx="86" cy="60" rx="4" ry="6" fill="#ff9f1a"/>` +
    `<path d="M52 64L54 26C54 20 66 20 66 28L62 64Z" fill="#dfe8f5"/>` +
    `<rect x="52" y="6" width="12" height="20" rx="4" fill="#3b78e6"/>` +
    mv('M40 20v14M36 26l4 8 4-8M74 20v14M70 26l4 8 4-8'),
  깎다:
    `<path d="M44 12C42 8 44 4 48 2" stroke="#6b3e26" stroke-width="4"/>` +
    `<circle cx="44" cy="40" r="26" fill="#e8553d"/>` +
    `<path d="M18 40A26 26 0 0 0 70 40C62 46 54 36 44 44S26 40 18 40Z" fill="#fff3c4"/>` +
    tube('M66 50C84 56 80 66 66 68S50 76 60 84S82 88 72 96', '#e8553d', 6) +
    `<path d="M62 32L84 20L86 26L66 38Z" fill="#dfe8f5"/>` +
    `<rect x="82" y="12" width="12" height="16" rx="3" fill="#3b78e6" transform="rotate(-30 88 20)"/>` +
    `<path d="M22 24l-8-6M16 40H6" stroke="${MOVE}" stroke-width="3"/>`,
  벗기다:
    `<path d="M40 18C40 8 60 8 60 18V58H40Z" fill="#fff3c4"/>` +
    `<path d="M38 52C26 54 16 62 12 74C22 74 32 66 42 58Z" fill="#ffd23f"/>` +
    `<path d="M62 52C74 52 84 58 90 70C80 72 68 66 58 58Z" fill="#ffd23f"/>` +
    `<path d="M36 52H64V86C64 92 36 92 36 86Z" fill="#ffd23f"/>` +
    `<path d="M46 90L50 96L54 90" fill="#6b3e26"/>` +
    `<path d="M50 54V84" stroke="#e8b830" stroke-width="3"/>` +
    arrow('M78 30V52M70 44l8 8 8-8', 4) +
    mv('M20 44l-6-4M24 34l-4-6'),
  // ── 나르기 ──
  끌다:
    ground() +
    `<path d="M6 86H44C50 86 50 80 46 78" stroke-width="4"/>` +
    `<rect x="10" y="66" width="30" height="14" rx="3" fill="#e8553d"/>` +
    `<circle cx="25" cy="56" r="11" fill="#b5793a"/><circle cx="17" cy="47" r="4.5" fill="#b5793a"/><circle cx="33" cy="47" r="4.5" fill="#b5793a"/>` +
    dot(21, 55, 1.8) +
    dot(29, 55, 1.8) +
    `<path d="M42 72L66 52" stroke="#c9913a" stroke-width="3.5"/>` +
    guy(74, 24, 'M0 10L6 34M2 17L-8 28M2 17L14 26M6 34L-4 62M6 34L18 62') +
    mv('M4 94h14') +
    arrowRight(62, 90, 12),
  나르다:
    ground() +
    guy(38, 24, 'M0 10L0 38M0 17L16 30M0 17L14 36M0 38L-10 66M0 38L12 66') +
    box(50, 26, 32, 26) +
    `<circle cx="54" cy="42" r="4" fill="${SKIN}"/>` +
    mv('M6 40h12M4 54h12M8 68h10') +
    arrowRight(60, 90, 14),
  싣다:
    ground(86) +
    truck +
    box(42, 42, 22, 14) +
    guy(16, 42, 'M0 10V38M0 16L12 -2M0 16L18 2M0 38L-6 58M0 38L6 58', 0.75) +
    box(18, 18, 22, 16) +
    arrow('M44 16C58 12 64 22 62 34M54 30l8 6 6-9', 4),
  내리다:
    ground(86) +
    truck +
    box(42, 42, 22, 14) +
    box(8, 68, 24, 18) +
    arrow('M56 36C40 30 22 38 20 56M12 50l8 8 8-8', 4),
  무너지다:
    `<path d="M4 92H96"/>` +
    block(40, 82, 30, 20, '#3b78e6') +
    block(46, 58, 26, 18, '#e8553d', 14) +
    block(64, 36, 26, 18, '#43b04a', 32) +
    block(82, 22, 20, 16, '#ffd23f', 58) +
    block(84, 82, 18, 18, '#ffd23f', 20) +
    mv('M26 44l-6-4M30 30l-4-6M54 14l-2-8M92 44l4 4') +
    arrow('M68 58Q84 60 90 70M80 70l10 2 0-10', 4),
  부수다:
    `<path d="M4 92H96"/>` +
    block(58, 80, 30, 22, '#3b78e6') +
    block(40, 56, 16, 14, '#e8553d', -30) +
    block(78, 56, 16, 14, '#43b04a', 26) +
    block(26, 78, 12, 12, '#ffd23f', 20) +
    block(90, 78, 12, 12, '#e8553d', -16) +
    `<path d="M58 44l4-8 4 8 8-2-4 8 8 4-8 4 4 8-8-2-4 8-4-8-8 2 4-8-8-4 8-4-4-8Z" fill="${HL}" transform="translate(-4 -4)"/>` +
    tube('M30 8L50 30', '#ffd23f', 6) +
    `<rect x="40" y="18" width="30" height="18" rx="5" fill="#ff5c70" transform="rotate(45 55 27)"/>` +
    mv('M20 24l-6 2M24 38l-8 6'),
  고치다:
    ground(90) +
    `<path d="M10 68V56C10 50 16 48 22 48L32 34H62L72 48H84C90 48 92 52 92 58V68Z" fill="#e8553d"/>` +
    `<path d="M36 38H48V48H28ZM54 38H60L68 48H54Z" fill="#bfe6fb" stroke-width="2.5"/>` +
    `<circle cx="30" cy="72" r="11" fill="#5b6680"/><circle cx="72" cy="72" r="11" fill="#5b6680"/>` +
    `<circle cx="72" cy="72" r="4" fill="#dfe8f5"/><circle cx="30" cy="72" r="4" fill="#dfe8f5"/>` +
    `<path d="M80 62L94 38" stroke-width="12"/><path d="M80 62L94 38" stroke="#8a96b0" stroke-width="5"/>` +
    `<path d="M64 60C66 50 78 48 84 56L88 64C84 74 70 76 64 70L72 66L76 60Z" fill="#8a96b0"/>` +
    arrow('M56 88A18 12 0 0 0 86 88', 3.5) +
    sparkle(16, 22, 6) +
    sparkle(86, 18, 5),
  조립하다:
    `<rect x="36" y="44" width="28" height="30" rx="4" fill="#3b78e6"/><circle cx="50" cy="58" r="5" fill="${HL}"/>` +
    `<path d="M42 74V92M58 74V92" stroke-width="7"/><path d="M42 74V92M58 74V92" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="38" y="6" width="24" height="20" rx="4" fill="#dfe8f5"/>` +
    dot(45, 16, 2.4) +
    dot(55, 16, 2.4) +
    `<path d="M50 6V2"/>` +
    arrow('M50 28V40M44 34l6 6 6-6', 3.5) +
    `<rect x="6" y="44" width="10" height="24" rx="4" fill="#dfe8f5"/><rect x="84" y="44" width="10" height="24" rx="4" fill="#dfe8f5"/>` +
    arrow('M20 54H32M26 48l6 6-6 6', 3.5) +
    arrow('M80 54H68M74 48l-6 6 6 6', 3.5),
  // ── 만들기·꾸미기 ──
  칠하다:
    `<rect x="6" y="8" width="62" height="84" rx="2" fill="#fff"/>` +
    `<path d="M6 8H40C36 30 42 60 38 92H6Z" fill="#7ec8f0" stroke="none"/>` +
    `<rect x="6" y="8" width="62" height="84" rx="2"/>` +
    `<path d="M50 44H70V60L76 64" stroke-width="4"/>` +
    tube('M76 64L90 92', '#e8553d', 7) +
    `<rect x="34" y="28" width="16" height="32" rx="6" fill="#3b78e6"/>` +
    mv('M26 30v-8M26 70v8') +
    arrow('M86 40V14M78 22l8-8 8 8M86 40V14', 4) +
    arrow('M86 26v24M78 42l8 8 8-8', 4),
  지우다:
    `<rect x="6" y="14" width="80" height="72" rx="2" fill="#fff" transform="rotate(-4 46 50)"/>` +
    `<path d="M14 56c6-10 10 10 16 0s10 10 16 0" stroke="#5b6680" stroke-width="4"/>` +
    `<path d="M50 56c4-6 8 6 12 0" stroke="#b5c0d8" stroke-width="3" stroke-dasharray="3 5"/>` +
    `<g transform="rotate(-20 72 46)"><rect x="60" y="24" width="24" height="40" rx="4" fill="#ff9aa8"/><rect x="60" y="24" width="24" height="18" rx="4" fill="#3b78e6"/></g>` +
    `<path d="M58 74l4 2M70 76l-2 4M80 72l4 2" stroke="#ff9aa8" stroke-width="4"/>` +
    mv('M56 16l-8 4M92 26l4 6M94 44l2 8'),
  오리다:
    `<rect x="6" y="14" width="66" height="72" rx="2" fill="#fff" transform="rotate(-4 39 50)"/>` +
    `<path d="M38 42C32 30 16 34 18 46C20 56 30 64 38 72" fill="#ff9aa8" stroke="none"/>` +
    `<path d="M38 72C46 64 56 56 58 46C60 34 44 30 38 42" stroke-dasharray="5 5" stroke-width="3"/>` +
    `<path d="M38 42C32 30 16 34 18 46C20 56 30 64 38 72"/>` +
    scissors('translate(40 72) rotate(-35)'),
  묶다:
    `<rect x="24" y="14" width="10" height="74" rx="3" fill="#e8553d"/><rect x="36" y="10" width="10" height="80" rx="3" fill="#ffd23f"/>` +
    `<rect x="48" y="12" width="10" height="78" rx="3" fill="#43b04a"/><rect x="60" y="14" width="10" height="74" rx="3" fill="#3b78e6"/>` +
    `<path d="M20 52H74" stroke="#8e4fc9" stroke-width="7"/>` +
    `<path d="M47 52C38 40 28 42 32 50C34 56 44 54 47 52ZM47 52C56 40 66 42 62 50C60 56 50 54 47 52Z" fill="#a45cf0"/>` +
    `<path d="M45 54L30 70M49 54L60 72" stroke="#8e4fc9" stroke-width="5"/>` +
    arrow('M22 78L10 90M10 80V90H20', 4) +
    arrow('M68 80L82 92M82 82V92H72', 4),
  풀다:
    `<rect x="14" y="50" width="52" height="42" rx="2" fill="#e85d9a"/>` +
    `<rect x="10" y="40" width="60" height="12" rx="2" fill="#ff9aa8"/>` +
    `<path d="M40 40C42 30 52 30 54 22S70 12 76 20" stroke-width="10"/>` +
    `<path d="M40 40C42 30 52 30 54 22S70 12 76 20" stroke="${HL}" stroke-width="5"/>` +
    `<path d="M40 40C36 30 26 32 22 24" stroke-width="9"/><path d="M40 40C36 30 26 32 22 24" stroke="${HL}" stroke-width="4"/>` +
    `<circle cx="80" cy="22" r="7" fill="${SKIN}"/>` +
    arrow('M84 36L92 48M82 46H92V36', 4) +
    mv('M76 60h14M78 72h12'),
  매다:
    `<path d="M8 80C8 60 20 52 34 50L56 46C66 52 78 60 90 66C96 70 96 86 90 88H10C8 88 8 84 8 80Z" fill="#3b78e6"/>` +
    `<path d="M8 84H92" stroke-width="5"/><path d="M8 88H92V92H8Z" fill="#fff"/>` +
    `<path d="M36 52L50 62M44 50L58 60" stroke="#fff" stroke-width="3"/>` +
    `<path d="M48 52C36 36 22 38 26 48C30 56 42 54 48 52ZM48 52C58 34 74 36 70 46C66 54 54 54 48 52Z" fill="#fff"/>` +
    `<circle cx="48" cy="52" r="4" fill="#fff"/>` +
    `<circle cx="22" cy="40" r="7" fill="${SKIN}"/><circle cx="76" cy="38" r="7" fill="${SKIN}"/>` +
    arrow('M16 28L8 20M8 30V20H18', 4) +
    arrow('M82 26L90 18M80 18H90V28', 4),
  꿰매다:
    `<rect x="8" y="20" width="84" height="72" rx="6" fill="#7ec8f0"/>` +
    `<rect x="26" y="40" width="40" height="36" rx="4" fill="#ffd23f"/>` +
    `<rect x="21" y="35" width="50" height="46" rx="6" stroke="${INK}" stroke-width="2.5" stroke-dasharray="5 5"/>` +
    `<path d="M71 50C80 42 80 30 70 26" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M58 40L88 4L96 10L64 44Z" fill="#dfe8f5"/>` +
    `<ellipse cx="88" cy="10" rx="2.5" ry="4" fill="#7ec8f0" stroke-width="2" transform="rotate(40 88 10)"/>` +
    `<path d="M89 8C96 20 86 26 90 34" stroke="#e8553d" stroke-width="3"/>` +
    mv('M50 12l-6-6M38 14l-6-4'),
  뜨개질하다:
    `<path d="M16 8L48 60M84 8L52 60" stroke-width="7"/><path d="M16 8L48 60M84 8L52 60" stroke="#dfe8f5" stroke-width="3"/>` +
    `<circle cx="16" cy="8" r="4" fill="#ffd23f"/><circle cx="84" cy="8" r="4" fill="#ffd23f"/>` +
    `<path d="M30 40H70V70C70 76 30 76 30 70Z" fill="#43b04a"/>` +
    `<path d="M36 48l4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5M36 60l4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5" stroke="#2f7a36" stroke-width="2.5"/>` +
    `<path d="M70 58C80 64 82 76 78 80" stroke="#e85d9a" stroke-width="3"/>` +
    `<circle cx="80" cy="84" r="12" fill="#e85d9a"/><path d="M72 80C78 76 86 80 88 86M72 88C76 84 84 86 86 92" stroke="#b83a78" stroke-width="2.5"/>`,
  다림질하다:
    `<path d="M4 58H96V96H4Z" fill="#9aa6c4" stroke="none"/>` +
    `<path d="M14 62H34L40 68H60L66 62H86L92 74L80 78V94H20V78L8 74Z" fill="#7ec8f0"/>` +
    `<path d="M20 70H40" stroke="#fff" stroke-width="3"/>` +
    `<path d="M40 64C40 44 60 38 86 38V64Z" fill="#e85d9a"/>` +
    `<path d="M40 64H86" stroke-width="5"/>` +
    `<path d="M52 40C52 24 62 22 80 22V38" stroke-width="7"/><path d="M52 40C52 24 62 22 80 22V38" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M24 50c-4-6 4-8 0-14M34 44c-4-6 4-8 0-14M14 40c-4-6 4-8 0-14" stroke="${MOVE}" stroke-width="3"/>`,
  // ── 집안일 ──
  빨래하다:
    `<rect x="14" y="6" width="72" height="88" rx="8" fill="#fff"/>` +
    `<path d="M14 24H86" stroke-width="3"/>` +
    dot(24, 15, 3, '#e8553d') +
    `<rect x="54" y="11" width="24" height="8" rx="3" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<circle cx="50" cy="58" r="28" fill="#5b6680"/><circle cx="50" cy="58" r="21" fill="#bfe6fb"/>` +
    `<path d="M36 62C42 50 52 70 62 56" stroke="#e8553d" stroke-width="6"/><path d="M40 70C48 72 56 64 62 68" stroke="#ffd23f" stroke-width="5"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="42" cy="46" r="4"/><circle cx="56" cy="44" r="3"/></g>` +
    arrow('M32 30A30 30 0 0 1 72 34', 3.5) +
    arrow('M66 29L73 35L66 40', 3.5),
  널다:
    `<path d="M4 16H96" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M10 20L20 16H34L44 20L40 30L34 28V56H20V28L14 30Z" fill="#e8553d"/>` +
    `<rect x="24" y="12" width="5" height="10" fill="${HL}" stroke-width="2"/>` +
    person(72, 96, 1.2, { hair: HAIR, style: 'pony', shirt: '#43b04a' }) +
    tube('M63 76L56 22', SKIN, 5) +
    tube('M81 76L86 22', SKIN, 5) +
    `<path d="M54 16H88V34C80 30 62 30 54 34Z" fill="#7ec8f0"/>` +
    `<circle cx="54" cy="20" r="5" fill="${SKIN}"/><circle cx="87" cy="20" r="5" fill="${SKIN}"/>` +
    arrow('M40 70V46M32 54l8-8 8 8', 4),
  정리하다:
    `<rect x="14" y="58" width="72" height="34" rx="3" fill="#e8862e"/>` +
    `<path d="M14 58L6 48M86 58L94 48" stroke-width="4"/>` +
    `<path d="M22 58C24 48 34 48 36 58Z" fill="#e8553d"/><rect x="42" y="50" width="14" height="10" fill="#43b04a"/><path d="M62 58L68 46L74 58Z" fill="#3b78e6"/>` +
    `<path d="M14 58H86" stroke-width="4"/>` +
    `<rect x="18" y="12" width="18" height="18" rx="2" fill="#ffd23f"/>` +
    `<circle cx="72" cy="20" r="10" fill="#e85d9a"/><path d="M62 20H82" stroke="#fff" stroke-width="3"/>` +
    arrow('M27 34V48M20 42l7 7 7-7', 4) +
    arrow('M72 34V48M65 42l7 7 7-7', 4) +
    sparkle(50, 22, 6) +
    sparkle(90, 80, 4),
  쓸다:
    `<path d="M22 4L50 58" stroke-width="10"/><path d="M22 4L50 58" stroke="#b5793a" stroke-width="4"/>` +
    `<path d="M40 56L60 52L78 86L40 94Z" fill="#ffc933"/>` +
    `<path d="M50 58L56 92M58 56L66 90M66 60L74 88" stroke="#c9913a" stroke-width="2.5"/>` +
    `<rect x="42" y="52" width="20" height="8" rx="2" fill="#e8553d" transform="rotate(-12 52 56)"/>` +
    `<g fill="#b5c0d8"><circle cx="84" cy="90" r="3"/><circle cx="90" cy="86" r="2.5"/><circle cx="92" cy="92" r="2.5"/></g>` +
    mv('M20 72q10 10 20 14M14 60q6 12 18 22'),
  닦다:
    `<rect x="8" y="8" width="84" height="84" rx="3" fill="#bfe6fb"/>` +
    `<path d="M50 8V92M8 50H92" stroke-width="4"/>` +
    `<g fill="#b5a88a" stroke="none"><circle cx="20" cy="22" r="4"/><circle cx="32" cy="34" r="3"/><circle cx="18" cy="70" r="4"/><circle cx="34" cy="80" r="3"/></g>` +
    `<path d="M62 20l10 10M60 30l6 6M80 60l6 6" stroke="#fff" stroke-width="4"/>` +
    `<rect x="54" y="54" width="28" height="22" rx="6" fill="#ffd23f" transform="rotate(-14 68 65)"/>` +
    tube('M78 74L94 94', SKIN, 10) +
    arrow('M52 44A20 14 0 1 0 50 72', 3.5) +
    sparkle(84, 20, 6, '#fff') +
    sparkle(70, 40, 4, '#fff'),
  헹구다:
    `<path d="M8 12H38V24" stroke-width="10"/><path d="M8 12H38V24" stroke="#8a96b0" stroke-width="4"/>` +
    `<rect x="4" y="4" width="10" height="18" rx="3" fill="#8a96b0"/>` +
    `<path d="M32 26H44L48 60H28Z" fill="#7ec8f0"/>` +
    `<ellipse cx="44" cy="66" rx="34" ry="12" fill="#fff" transform="rotate(-10 44 66)"/>` +
    `<ellipse cx="44" cy="66" rx="20" ry="6" fill="#dfe8f5" stroke-width="2.5" transform="rotate(-10 44 66)"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="78" cy="70" r="4"/><circle cx="84" cy="80" r="3"/><circle cx="72" cy="84" r="3.5"/></g>` +
    drop(20, 78, 0.6) +
    drop(64, 82, 0.6) +
    drop(86, 60, 0.5) +
    mv('M56 38l8-6M58 48h10'),
  말리다:
    `<circle cx="34" cy="56" r="24" fill="${SKIN}"/>` +
    `<path d="M10 54C8 34 20 26 34 26S60 30 60 44C66 34 72 36 76 40C66 40 60 46 56 44C50 38 42 36 34 36S14 40 10 54Z" fill="${HAIR}"/>` +
    `<path d="M24 58q3-3 6 0M38 58q3-3 6 0" stroke-width="2.5"/><path d="M28 68q6 4 12 0" stroke-width="2.5"/>` +
    `<path d="M62 22H86C92 22 94 28 94 32C94 36 92 40 86 40H62Z" fill="#a45cf0"/>` +
    `<path d="M76 40L84 64H72L68 40Z" fill="#a45cf0"/>` +
    `<ellipse cx="62" cy="31" rx="4" ry="9" fill="#dfe8f5"/>` +
    `<path d="M54 22C48 18 44 20 38 16M54 31H36M54 40C48 44 44 42 38 46" stroke="#7ec8f0" stroke-width="4"/>`,
  가꾸다:
    soil(84) +
    `<path d="M18 80V60M42 80V58M66 80V60" stroke="#3a9e47" stroke-width="4"/>` +
    `<path d="M18 72C10 70 8 64 10 62C16 64 18 68 18 72ZM66 72C74 70 76 64 74 62C68 64 66 68 66 72Z" fill="#5fc24a"/>` +
    blob('#e8553d', [[18, 54, 7]]) +
    blob('#ffd23f', [[42, 52, 7]]) +
    blob('#e85d9a', [[66, 54, 7]]) +
    dot(18, 54, 2.5, '#ffd23f') +
    dot(42, 52, 2.5, '#e8862e') +
    dot(66, 54, 2.5, '#ffd23f') +
    `<path d="M50 20L30 10" stroke-width="7"/><path d="M50 20L30 10" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M50 10H84V36C84 40 80 42 76 42H58C54 42 50 40 50 36Z" fill="#43b04a"/>` +
    `<path d="M84 16C94 16 94 32 84 32" stroke-width="3.5"/>` +
    drop(26, 18, 0.5) +
    drop(34, 28, 0.5) +
    drop(22, 32, 0.5),
  캐다:
    soil(56) +
    `<path d="M50 52V28" stroke="#3a9e47" stroke-width="4"/><path d="M50 40C40 38 34 30 36 24C44 26 50 32 50 40ZM50 34C60 30 66 22 64 16C56 18 50 26 50 34Z" fill="#5fc24a"/>` +
    `<path d="M50 56V74M50 66L38 76M50 66L64 78" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<ellipse cx="36" cy="80" rx="9" ry="7" fill="#c98f52"/><ellipse cx="52" cy="80" rx="8" ry="7" fill="#c98f52"/><ellipse cx="66" cy="82" rx="9" ry="7" fill="#c98f52"/>` +
    `<path d="M92 8L76 60" stroke-width="7"/><path d="M92 8L76 60" stroke="#b5793a" stroke-width="3"/>` +
    `<path d="M68 58L86 64L80 84C78 90 68 88 66 82Z" fill="#8a96b0"/>` +
    arrow('M14 80V52M6 60l8-8 8 8', 4),
  뽑다:
    soil(74) +
    `<path d="M44 58C40 74 46 88 50 94C54 88 60 74 56 58Z" fill="#ff9f1a"/><path d="M46 70h4M52 80h3" stroke="#e8862e" stroke-width="2.5"/>` +
    `<path d="M50 58C46 40 38 34 34 30M50 58C50 40 52 34 54 26M50 58C56 42 62 38 68 34" stroke="#43b04a" stroke-width="6"/>` +
    `<circle cx="42" cy="34" r="7" fill="${SKIN}"/><circle cx="58" cy="32" r="7" fill="${SKIN}"/>` +
    tube('M40 30L30 14', SKIN, 6) +
    tube('M60 28L70 12', SKIN, 6) +
    arrow('M84 58V24M76 32l8-8 8 8', 4) +
    mv('M30 70l-6-6M70 70l6-6'),
  모으다:
    `<path d="M26 64H74L68 92H32Z" fill="#c98f52"/><path d="M28 72H72M30 82H70" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M26 64C26 44 74 44 74 64" stroke-width="7"/><path d="M26 64C26 44 74 44 74 64" stroke="#c98f52" stroke-width="3"/>` +
    `<circle cx="42" cy="62" r="6" fill="#e8553d"/><circle cx="56" cy="61" r="6" fill="#ffd23f"/>` +
    `<path d="M26 64H74" stroke-width="4"/>` +
    `<circle cx="12" cy="18" r="7" fill="#43b04a"/><circle cx="88" cy="18" r="7" fill="#e85d9a"/><circle cx="10" cy="54" r="7" fill="#3b78e6"/><circle cx="90" cy="54" r="7" fill="#ffd23f"/>` +
    arrow('M20 26L34 40M24 40H34V30', 4) +
    arrow('M80 26L66 40M76 40H66V30', 4) +
    arrow('M18 58H24', 4) +
    `<circle cx="50" cy="12" r="7" fill="#8e4fc9"/>` +
    arrow('M50 22V38M43 32l7 7 7-7', 4),
  나누다:
    `<path d="M44 6C30 8 18 18 18 32S30 56 44 58L40 46L46 38L40 28L46 18Z" fill="#e8b36a"/>` +
    `<path d="M56 6C70 8 82 18 82 32S70 56 56 58L52 46L58 38L52 28L58 18Z" fill="#e8b36a"/>` +
    dot(28, 26, 3.2, '#6b3e26') +
    dot(34, 44, 3.2, '#6b3e26') +
    dot(32, 14, 2.6, '#6b3e26') +
    dot(70, 22, 3.2, '#6b3e26') +
    dot(72, 42, 3.2, '#6b3e26') +
    dot(64, 32, 2.6, '#6b3e26') +
    arrow('M34 60L24 70M24 62V70H32', 4) +
    arrow('M66 60L76 70M76 62V70H68', 4) +
    kidHead(18, 82, HAIR) +
    kidHead(82, 82, '#2f2a26'),
};
