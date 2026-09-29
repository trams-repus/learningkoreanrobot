// 9세 이상 동작 단어 2 (찢다·꿰다·설거지하다·주차하다·엎지르다·켜다·끄다…): 그 동작을 하는 순간을 손·도구·움직임 선·화살표로. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, stick, person, sparkle, tube, drop, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';

const ground = (y = 92) => `<path d="M4 ${y}H96" stroke="#c9b28a" stroke-width="3"/>`;
const mv = (d: string) => `<path d="${d}" stroke="${MOVE}" stroke-width="3"/>`;
const arrow = (d: string, w = 5) => `<path d="${d}" stroke="${ARROW}" stroke-width="${w}"/>`;
/** 막대 사람 얼굴 */
const sf = (x: number, y: number) => dot(x - 3.5, y, 1.6) + dot(x + 3.5, y, 1.6) + `<path d="M${x - 3} ${y + 4}q3 2.5 6 0" stroke-width="2"/>`;
const guy = (x: number, y: number, body: string, s = 1) => stick(x, y, body, s) + sf(x, y);

/** 손 (주먹 쥔 모양, 엄지 포함). rot으로 방향 */
const hand = (x: number, y: number, rot = 0, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse cx="0" cy="0" rx="8" ry="9" fill="${SKIN}"/>` +
  `<ellipse cx="-7" cy="1" rx="3.5" ry="6" fill="${SKIN}" transform="rotate(-20 -7 1)"/></g>`;

/** 큰 머리 (눈·입은 inner) */
const head = (x: number, y: number, r: number, inner: string, hair = HAIR) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>` +
  `<path d="M${x - r} ${y - 2}C${x - r} ${y - r * 0.95} ${x - r * 0.45} ${y - r} ${x} ${y - r}S${x + r} ${y - r * 0.95} ${x + r} ${y - 2}C${x + r * 0.7} ${y - r * 0.55} ${x + r * 0.3} ${y - r * 0.62} ${x} ${y - r * 0.6}S${x - r * 0.7} ${y - r * 0.55} ${x - r} ${y - 2}Z" fill="${hair}"/>` +
  inner;

/** 종이 상자 (위가 열린) */
const openBox = (x: number, y: number, w: number, h: number) =>
  `<path d="M${x} ${y}L${x - 10} ${y - 10}L${x + 4} ${y - 12}L${x + 12} ${y}Z" fill="#e8b27a"/>` +
  `<path d="M${x + w} ${y}L${x + w + 10} ${y - 10}L${x + w - 4} ${y - 12}L${x + w - 12} ${y}Z" fill="#e8b27a"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d9a066"/>` +
  `<path d="M${x + 6} ${y + 10}H${x + w - 6}" stroke="#9a5b2e" stroke-width="3"/>`;

/** 전구 (켜짐/꺼짐) */
const bulb = (x: number, y: number, on: boolean) =>
  (on
    ? `<circle cx="${x}" cy="${y}" r="24" fill="#fff1b8" stroke="none"/>` +
      `<path d="M${x} ${y - 30}v-6M${x - 26} ${y - 14}l-6-4M${x + 26} ${y - 14}l6-4M${x - 30} ${y + 6}h-6M${x + 30} ${y + 6}h6" stroke="${HL}" stroke-width="5"/>`
    : '') +
  `<path d="M${x - 9} ${y + 18}C${x - 9} ${y + 10} ${x - 18} ${y + 6} ${x - 18} ${y - 4}A18 18 0 0 1 ${x + 18} ${y - 4}C${x + 18} ${y + 6} ${x + 9} ${y + 10} ${x + 9} ${y + 18}Z" fill="${on ? '#ffd23f' : '#c4ccdc'}"/>` +
  `<rect x="${x - 9}" y="${y + 18}" width="18" height="10" rx="2" fill="#8a96b0"/>` +
  `<path d="M${x - 4} ${y + 18}V${y + 6}M${x + 4} ${y + 18}V${y + 6}" stroke-width="2.5"/>` +
  `<ellipse cx="${x}" cy="${y + 3}" rx="6" ry="3.5" stroke="${on ? '#e8862e' : '#8a96b0'}" stroke-width="3"/>`;

/** 벽 스위치 (up = 켠 쪽) */
const lightSwitch = (x: number, y: number, up: boolean) =>
  `<rect x="${x - 11}" y="${y - 16}" width="22" height="32" rx="4" fill="#fff"/>` +
  `<rect x="${x - 5}" y="${y - 10}" width="10" height="20" rx="2" fill="#dfe8f5"/>` +
  `<rect x="${x - 5}" y="${up ? y - 10 : y}" width="10" height="10" rx="2" fill="${up ? '#43b04a' : '#8a96b0'}"/>`;

/** 컵 (투명, 물 높이 lv 0~1) */
const glass = (x: number, y: number, w: number, h: number, lv: number, liquid = '#7ec8f0') =>
  `<path d="M${x} ${y}H${x + w}L${x + w - 4} ${y + h}H${x + 4}Z" fill="#fff"/>` +
  `<path d="M${x + 2 + (1 - lv) * 2} ${y + h * (1 - lv)}H${x + w - 2 - (1 - lv) * 2}L${x + w - 4} ${y + h}H${x + 4}Z" fill="${liquid}" stroke-width="2.5"/>`;

/** 흙 */
const soil = (y: number) => `<path d="M4 ${y}C24 ${y - 5} 76 ${y - 5} 96 ${y}V96H4Z" fill="#9a5b2e"/>`;

/** 강아지 머리 */
const pupHead = (x: number, y: number, r = 12) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8b27a"/>` +
  `<ellipse cx="${x - r}" cy="${y + 1}" rx="${r * 0.35}" ry="${r * 0.7}" fill="#9a5b2e"/>` +
  `<ellipse cx="${x + r}" cy="${y + 1}" rx="${r * 0.35}" ry="${r * 0.7}" fill="#9a5b2e"/>` +
  dot(x - r * 0.38, y - 1, 2) +
  dot(x + r * 0.38, y - 1, 2) +
  `<ellipse cx="${x}" cy="${y + r * 0.35}" rx="3" ry="2.2" fill="${INK}"/>`;

export const PICS: Record<string, string> = {
  // ── 손으로 하는 일 ──
  찢다:
    `<path d="M14 22H44L40 32L46 42L40 52L46 62L40 72L44 82H14Z" fill="#7ec8f0" transform="rotate(-10 30 52)"/>` +
    `<path d="M56 22H86V82H56L60 72L54 62L60 52L54 42L60 32Z" fill="#7ec8f0" transform="rotate(10 70 52)"/>` +
    hand(20, 26, -30, 1.1) +
    hand(80, 26, 30, 1.1) +
    mv('M50 14v8M50 86v6') +
    arrow('M28 92H6M12 86l-6 6 6 6') +
    arrow('M72 92H94M88 86l6 6-6 6'),
  꿰다:
    `<path d="M10 88C20 70 40 56 70 38" stroke-width="7"/><path d="M10 88C20 70 40 56 70 38" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="20" cy="74" r="8" fill="#ffd23f"/><circle cx="33" cy="63" r="8" fill="#43b04a"/><circle cx="46" cy="54" r="8" fill="#3b8fe0"/>` +
    `<circle cx="84" cy="28" r="11" fill="#e85d9a"/><circle cx="84" cy="28" r="3.5" fill="#fff7e0"/>` +
    hand(90, 16, 150, 0.9) +
    arrow('M76 40L66 48', 4) +
    mv('M92 44l4 4M72 16l-4-4'),
  바느질하다:
    `<circle cx="44" cy="56" r="34" fill="#d9a066"/><circle cx="44" cy="56" r="27" fill="#fff"/>` +
    `<path d="M24 66Q34 44 52 52" stroke="#e8553d" stroke-width="4" stroke-dasharray="7 6"/>` +
    `<path d="M56 54L86 14" stroke-width="8"/><path d="M56 54L86 14" stroke="#dfe8f5" stroke-width="3.5"/>` +
    `<path d="M84 17C92 30 70 44 56 54" stroke="#e8553d" stroke-width="3"/>` +
    hand(88, 12, 200, 0.85),
  설거지하다:
    `<rect x="6" y="62" width="88" height="32" rx="4" fill="#dfe8f5"/>` +
    `<path d="M14 62H86L80 84H20Z" fill="#7ec8f0"/>` +
    tube('M18 62V34H34V40', '#8a96b0', 5) +
    `<path d="M34 46V60" stroke="#4aa8f0" stroke-width="4" stroke-dasharray="4 4"/>` +
    `<circle cx="60" cy="46" r="21" fill="#fff"/><circle cx="60" cy="46" r="12" fill="#fff" stroke="#b8c4dc" stroke-width="2.5"/>` +
    `<rect x="38" y="38" width="14" height="20" rx="3" fill="#ffd23f" transform="rotate(-20 45 48)"/>` +
    hand(84, 50, 60, 0.9) +
    `<g fill="#fff" stroke-width="2.5"><circle cx="40" cy="26" r="5"/><circle cx="50" cy="18" r="4"/><circle cx="74" cy="20" r="5"/><circle cx="58" cy="68" r="4"/><circle cx="68" cy="66" r="5"/></g>`,
  반죽하다:
    `<rect x="4" y="74" width="92" height="16" rx="4" fill="#d9a066"/>` +
    `<path d="M10 76C10 52 30 48 50 50S90 52 90 76Z" fill="#f7e3b5"/>` +
    `<path d="M22 70q4-5 8-2M70 68q4-3 8 2M44 72q6 3 12 0" stroke="#d9b47a" stroke-width="3"/>` +
    tube('M26 6L32 44', '#e85d9a', 12) +
    tube('M74 6L68 44', '#e85d9a', 12) +
    `<path d="M18 56C18 44 44 42 44 54C44 60 18 62 18 56Z" fill="${SKIN}"/>` +
    `<path d="M82 56C82 44 56 42 56 54C56 60 82 62 82 56Z" fill="${SKIN}"/>` +
    `<path d="M24 50v5M30 49v6M36 49v6M76 50v5M70 49v6M64 49v6" stroke-width="2"/>` +
    mv('M20 40l-6 4M80 40l6 4M50 36v8') +
    dot(16, 84, 2, '#fff') +
    dot(86, 60, 2.2, '#fff') +
    dot(50, 46, 2.2, '#fff'),
  낚다:
    `<rect x="4" y="60" width="34" height="34" fill="#d9a066"/>` +
    `<path d="M38 70C50 66 60 74 72 70S88 66 96 70V94H38Z" fill="#7ec8f0"/>` +
    guy(18, 22, 'M0 10L0 36M0 18L12 26L16 20M0 36L-6 38M0 36L6 38', 1) +
    `<path d="M16 26Q46 -2 76 12" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M76 12V44" stroke-width="2"/>` +
    `<path d="M74 46C84 40 90 50 84 58C80 64 72 64 70 58L62 64L64 52Z" fill="#ff9f1a" transform="rotate(-20 76 52)"/>` +
    dot(80, 49, 2) +
    drop(58, 58, 0.6) +
    drop(92, 56, 0.6) +
    mv('M66 38l-4-4M88 40l4-4'),
  산책시키다:
    ground() +
    person(24, 92, 1.55, { hair: HAIR, style: 'short', shirt: '#43b04a' }) +
    tube('M36 66L50 70', '#43b04a', 6) +
    hand(52, 70, -90, 0.7) +
    `<path d="M54 70C62 60 66 60 72 64" stroke="#e8553d" stroke-width="3"/>` +
    `<ellipse cx="64" cy="78" rx="16" ry="8" fill="#e8b27a"/>` +
    `<path d="M52 82V92M58 84V92M70 84V92M76 82V92" stroke-width="4"/>` +
    `<path d="M48 76q-6-6-4-12" stroke-width="3.5"/>` +
    pupHead(80, 66, 10) +
    arrow('M60 40H86M78 32l8 8-8 8'),
  목욕시키다:
    pupHead(34, 50, 13) +
    `<path d="M6 58H70L64 90H12Z" fill="#fff"/>` +
    blob('#fff', [
      [14, 58, 6],
      [24, 55, 6],
      [46, 55, 6],
      [58, 57, 6],
    ]) +
    `<path d="M16 90l-3 5M60 90l3 5" stroke-width="3.5"/>` +
    person(82, 94, 1.3, { hair: HAIR, style: 'long', shirt: '#e85d9a' }) +
    tube('M74 72L62 40', '#e85d9a', 6) +
    `<rect x="50" y="24" width="18" height="10" rx="4" fill="#8a96b0" transform="rotate(-30 59 29)"/>` +
    hand(64, 40, 20, 0.7) +
    drop(44, 28, 0.55) +
    drop(36, 20, 0.55) +
    drop(50, 36, 0.55),
  재우다:
    `<path d="M20 12a10 10 0 1 0 12 12a8 8 0 1 1 -12 -12Z" fill="#ffd23f"/>` +
    sparkle(44, 14, 5) +
    sparkle(56, 24, 4) +
    `<path d="M8 70V56M92 70V60" stroke="#6b3e26" stroke-width="6"/>` +
    `<ellipse cx="24" cy="62" rx="15" ry="8" fill="#fff"/>` +
    head(28, 54, 12, `<path d="M22 56q2.5 2 5 0M31 56q2.5 2 5 0" stroke-width="2"/>`) +
    `<path d="M34 50H90V74H34Z" fill="#7ec8f0"/>` +
    `<rect x="4" y="74" width="92" height="10" rx="3" fill="#9a5b2e"/>` +
    tube('M94 18L70 38', '#e85d9a', 7) +
    hand(66, 42, 160, 1.15) +
    mv('M58 30q2-4 6-5M76 44q4 0 6 3'),
  빌려주다:
    person(20, 94, 1.2, { hair: HAIR, style: 'short', shirt: '#3b78e6' }) +
    person(80, 94, 1.2, { hair: '#2b2b3a', style: 'pony', shirt: '#ff9f1a' }) +
    tube('M30 76L42 70', '#3b78e6', 5) +
    tube('M70 76L58 70', '#ff9f1a', 5) +
    `<rect x="40" y="56" width="20" height="26" rx="2" fill="#e8553d"/><path d="M44 56V82" stroke-width="2.5"/>` +
    arrow('M28 16H70M62 8l8 8-8 8') +
    `<path d="M70 32H30M38 24l-8 8 8 8" stroke="${ARROW}" stroke-width="4" stroke-dasharray="6 5"/>`,
  계산하다:
    `<rect x="18" y="8" width="56" height="84" rx="8" fill="#5b6680"/>` +
    `<rect x="26" y="16" width="40" height="18" rx="3" fill="#c8f0c0"/>` +
    `<path d="M40 25h6M50 25h10" stroke-width="3"/>` +
    `<g stroke-width="2.5">` +
    [44, 58, 72].map((y) => [26, 40, 54].map((x) => `<rect x="${x}" y="${y}" width="11" height="10" rx="2" fill="${x === 54 ? '#ff9f1a' : '#dfe8f5'}"/>`).join('')).join('') +
    `</g>` +
    tube('M96 94L78 70L60 60', SKIN, 6) +
    `<ellipse cx="80" cy="74" rx="10" ry="12" fill="${SKIN}"/>` +
    mv('M52 54l-4-4M62 52v-5'),
  저금하다:
    `<ellipse cx="48" cy="64" rx="34" ry="24" fill="#ff9aa8"/>` +
    `<path d="M26 48L22 34L36 42Z" fill="#ff9aa8"/>` +
    `<ellipse cx="84" cy="64" rx="7" ry="9" fill="#ff9aa8"/>` +
    dot(82, 62, 1.8) +
    dot(86, 67, 1.8) +
    dot(68, 54, 2.8) +
    `<path d="M24 84V92M36 86V92M58 86V92M70 84V92" stroke-width="6"/>` +
    `<path d="M14 62q-6 -2 -6 -8" stroke-width="3"/>` +
    `<path d="M38 42H56" stroke-width="5"/>` +
    `<circle cx="47" cy="22" r="11" fill="${HL}"/><circle cx="47" cy="22" r="6" fill="#ffd23f" stroke="#e8862e" stroke-width="2"/>` +
    arrow('M66 12V32M60 26l6 6 6-6', 4),
  녹음하다:
    head(20, 36, 14, dot(15, 38, 1.8) + dot(24, 38, 1.8) + `<ellipse cx="22" cy="44" rx="3" ry="3.5" fill="${INK}"/>`) +
    `<path d="M36 30q4 6 0 12M42 26q6 10 0 20" stroke="${MOVE}" stroke-width="3"/>` +
    `<rect x="48" y="20" width="14" height="24" rx="7" fill="#8a96b0"/>` +
    `<path d="M55 44V62" stroke-width="4"/>` +
    `<path d="M55 62C55 72 44 70 40 80" stroke-width="2.5"/>` +
    `<rect x="20" y="70" width="72" height="24" rx="4" fill="#3b78e6"/>` +
    `<circle cx="34" cy="82" r="7" fill="#e8553d"/>` +
    `<path d="M48 82l4-6 4 12 4-14 4 16 4-12 4 8 4-4" stroke="#fff" stroke-width="3"/>` +
    `<path d="M72 12l4 6M80 10v8M88 12l-4 6" stroke="#e8553d" stroke-width="3"/>`,
  촬영하다:
    `<path d="M6 30L30 42V52L6 64Z" fill="#fff1b8" stroke="none"/>` +
    `<path d="M40 60L32 92M52 60V92M64 60L72 92" stroke-width="4"/>` +
    `<circle cx="42" cy="22" r="10" fill="#5b6680"/><circle cx="62" cy="22" r="10" fill="#5b6680"/>` +
    dot(42, 22, 3, '#dfe8f5') +
    dot(62, 22, 3, '#dfe8f5') +
    `<rect x="30" y="32" width="44" height="28" rx="4" fill="#5b6680"/>` +
    `<path d="M30 40L18 34V58L30 52Z" fill="#8a96b0"/>` +
    dot(66, 40, 3.5, '#e8553d') +
    person(86, 94, 1.1, { hair: HAIR, style: 'short', shirt: '#43b04a', cap: '#e8553d' }) +
    tube('M78 76L70 58', '#43b04a', 5),
  주차하다:
    `<rect x="4" y="4" width="92" height="92" rx="4" fill="#8a96b0"/>` +
    `<path d="M34 40V94M66 40V94M8 40H92" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="12" y="52" width="18" height="32" rx="5" fill="#3b78e6"/><rect x="15" y="56" width="12" height="7" rx="2" fill="#bfe6fb" stroke-width="2.5"/>` +
    `<rect x="70" y="52" width="18" height="32" rx="5" fill="#43b04a"/><rect x="73" y="56" width="12" height="7" rx="2" fill="#bfe6fb" stroke-width="2.5"/>` +
    `<g transform="rotate(-8 50 70)"><rect x="39" y="54" width="22" height="36" rx="6" fill="#e8553d"/><rect x="42" y="58" width="16" height="8" rx="2" fill="#bfe6fb" stroke-width="2.5"/><rect x="42" y="78" width="16" height="6" rx="2" fill="#bfe6fb" stroke-width="2.5"/></g>` +
    `<path d="M14 12C30 12 48 16 50 36M42 30l8 8 6-9" stroke="${HL}" stroke-width="5"/>`,
  // ── 놀이 ──
  숨바꼭질하다:
    `<rect x="4" y="30" width="14" height="62" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [12, 20, 12],
      [22, 26, 9],
    ]) +
    person(30, 94, 1.3, { hair: HAIR, style: 'short', shirt: '#e8553d' }) +
    tube('M20 74L22 58', '#e8553d', 5) +
    tube('M40 74L38 58', '#e8553d', 5) +
    `<ellipse cx="24" cy="52" rx="6" ry="5" fill="${SKIN}"/><ellipse cx="36" cy="52" rx="6" ry="5" fill="${SKIN}"/>` +
    head(76, 56, 12, dot(71, 58, 2) + dot(80, 58, 2) + `<path d="M72 64q4 3 8 0" stroke-width="2"/>`, '#2b2b3a') +
    blob('#5fc24a', [
      [62, 78, 13],
      [78, 72, 14],
      [92, 80, 10],
      [72, 88, 10],
    ]) +
    sparkle(92, 48, 5),
  술래잡기하다:
    ground() +
    guy(26, 30, 'M0 10L2 34M0 16L16 20L28 18M0 16L-12 26M2 34L-8 48L-12 62M2 34L14 46L10 62', 1) +
    guy(72, 24, 'M0 10L-2 36M-1 17L-12 28M-1 17L12 26M-2 36L10 52L18 62M-2 36L-14 50L-24 56', 1) +
    mv('M8 30h8M6 42h8M52 26h8M50 40h8') +
    arrow('M60 84H92M84 76l8 8-8 8'),
  소꿉놀이하다:
    `<rect x="4" y="74" width="92" height="20" rx="3" fill="#ff9aa8"/>` +
    `<path d="M26 74V94M50 74V94M74 74V94" stroke="#fff" stroke-width="4"/>` +
    person(18, 76, 1.05, { hair: HAIR, style: 'pony', shirt: '#ffd23f' }) +
    person(82, 76, 1.05, { hair: '#2b2b3a', style: 'short', shirt: '#43b04a' }) +
    `<path d="M34 56H58V64C58 72 34 72 34 64Z" fill="#e85d9a"/><path d="M30 56H62" stroke-width="4"/>` +
    `<path d="M40 50q6-4 12 0" stroke-width="3"/>` +
    `<path d="M62 62H72V70C72 74 62 74 62 70Z" fill="#7ec8f0"/>` +
    `<ellipse cx="46" cy="80" rx="12" ry="3.5" fill="#fff"/>` +
    `<circle cx="42" cy="78" r="3" fill="#e8553d"/><circle cx="50" cy="78" r="3" fill="#43b04a"/>` +
    tube('M28 64L36 60', '#ffd23f', 4) +
    tube('M72 64L64 64', '#43b04a', 4),
  띄우다:
    `<path d="M4 64C20 58 32 70 50 64S80 58 96 64V96H4Z" fill="#7ec8f0"/>` +
    `<path d="M12 80q8-4 16 0M66 84q8-4 16 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M24 58H76L66 72H34Z" fill="#fff"/><path d="M50 30L66 58H34Z" fill="#ffd23f"/>` +
    `<path d="M30 76q20 6 40 0" stroke="#fff" stroke-width="3"/>` +
    tube('M10 6L28 22', SKIN, 8) +
    tube('M90 6L72 22', SKIN, 8) +
    `<path d="M50 6V20M44 14l6 6 6-6" stroke="${ARROW}" stroke-width="4" stroke-dasharray="5 4"/>`,
  튕기다:
    tube('M4 72L20 62', '#3b78e6', 10) +
    `<ellipse cx="28" cy="58" rx="12" ry="11" fill="${SKIN}"/>` +
    tube('M34 52L46 42', SKIN, 6) +
    `<ellipse cx="32" cy="48" rx="4" ry="5" fill="${SKIN}"/>` +
    mv('M50 48l6 2M48 40l6-4') +
    `<circle cx="66" cy="50" r="11" fill="#7ec8f0"/><path d="M60 46q4-4 8-2" stroke="#fff" stroke-width="3"/>` +
    mv('M50 60h8M48 68h6') +
    arrow('M80 50H96M90 44l6 6-6 6', 4) +
    `<path d="M20 88H90" stroke="#c9b28a" stroke-width="3"/>` +
    `<ellipse cx="66" cy="66" rx="10" ry="2.5" fill="#dfe8f5" stroke="none"/>`,
  // ── 살림 ──
  개다:
    `<rect x="60" y="76" width="34" height="14" rx="3" fill="#43b04a"/>` +
    `<rect x="62" y="62" width="30" height="14" rx="3" fill="#ffd23f"/>` +
    `<rect x="60" y="48" width="34" height="14" rx="3" fill="#e85d9a"/>` +
    `<path d="M20 40L30 34H44L54 40L60 50L52 54V86H22V54L14 50Z" fill="#7ec8f0"/>` +
    `<path d="M30 34Q37 40 44 34" stroke-width="2.5"/>` +
    `<path d="M22 58H40L40 72H22Z" fill="#4a90e2"/>` +
    `<path d="M10 76C4 64 8 54 18 52M14 50l4 2-2 5" stroke="${ARROW}" stroke-width="4"/>` +
    hand(40, 90, -10, 0.8),
  붓다:
    `<g transform="rotate(-35 34 30)"><ellipse cx="30" cy="34" rx="20" ry="16" fill="#8a96b0"/>` +
    `<path d="M48 36L66 22L68 26L50 42Z" fill="#8a96b0"/>` +
    `<path d="M14 26C4 26 4 44 14 44" stroke-width="5"/>` +
    `<path d="M20 20C22 14 38 14 40 20Z" fill="#5b6680"/><circle cx="30" cy="14" r="3" fill="#5b6680"/></g>` +
    `<path d="M62 32C64 44 60 56 60 66" stroke="#4aa8f0" stroke-width="7"/>` +
    `<rect x="34" y="62" width="54" height="30" rx="4" fill="#e8553d"/>` +
    `<path d="M30 64H92" stroke-width="5"/>` +
    `<path d="M34 70H26M88 70H96" stroke-width="5"/>` +
    `<ellipse cx="61" cy="66" rx="10" ry="2.5" fill="#7ec8f0" stroke-width="2"/>` +
    mv('M48 54l-4-2M74 54l4-2'),
  따르다:
    `<g transform="rotate(-50 32 34)"><path d="M18 18H44V54C44 60 18 60 18 54Z" fill="#dfe8f5"/>` +
    `<path d="M18 36H44V54C44 60 18 60 18 54Z" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M44 20L50 14" stroke-width="4"/><path d="M18 24C8 24 8 44 18 44" stroke-width="5"/></g>` +
    `<path d="M58 22C62 34 62 44 62 54" stroke="#4aa8f0" stroke-width="5"/>` +
    glass(46, 50, 32, 42, 0.5) +
    `<path d="M50 60H74" stroke="${HL}" stroke-width="3" stroke-dasharray="4 3"/>`,
  푸다:
    `<ellipse cx="22" cy="42" rx="20" ry="8" fill="#dfe8f5" transform="rotate(-35 22 42)"/>` +
    `<rect x="6" y="52" width="48" height="38" rx="10" fill="#fff"/>` +
    `<path d="M10 56C14 44 46 44 50 56Z" fill="#fff"/>` +
    dot(20, 52, 2, '#d8cdb4') +
    dot(30, 49, 2, '#d8cdb4') +
    dot(40, 52, 2, '#d8cdb4') +
    `<path d="M12 70H48" stroke="#e8553d" stroke-width="3"/><circle cx="42" cy="80" r="3" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M60 70H96C96 84 88 92 78 92S60 84 60 70Z" fill="#3b8fe0"/>` +
    `<path d="M62 70C64 60 92 60 94 70Z" fill="#fff"/>` +
    `<g transform="rotate(35 58 36)"><rect x="55" y="2" width="7" height="26" rx="3.5" fill="#f2e2c2"/><ellipse cx="58" cy="38" rx="11" ry="14" fill="#f2e2c2"/>` +
    `<path d="M49 40C51 30 65 30 67 40Z" fill="#fff" stroke-width="2.5"/></g>` +
    hand(76, 10, 200, 0.85) +
    arrow('M74 42C82 46 84 52 80 58M74 55l6 4 4-7', 4),
  뿌리다:
    soil(80) +
    `<path d="M12 84q10-4 20 0M44 86q10-4 20 0M72 84q10-4 20 0" stroke="#6b3e26" stroke-width="3"/>` +
    tube('M96 10L78 24', '#43b04a', 8) +
    `<ellipse cx="72" cy="28" rx="10" ry="8" fill="${SKIN}"/>` +
    `<path d="M64 30l-6 2M64 34l-5 4M66 36l-3 5" stroke-width="5"/><path d="M64 30l-6 2M64 34l-5 4M66 36l-3 5" stroke="${SKIN}" stroke-width="2"/>` +
    [
      [52, 40],
      [44, 50],
      [58, 52],
      [36, 60],
      [50, 64],
      [28, 70],
      [42, 72],
      [62, 70],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4" fill="#6b3e26" stroke-width="1.5" transform="rotate(30 ${x} ${y})"/>`)
      .join('') +
    mv('M30 44q-6 8-8 18M66 46q-2 8 0 14'),
  엎지르다:
    `<path d="M4 72H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M40 64C56 62 70 62 84 66C96 70 94 78 82 80C66 82 48 82 36 78C30 76 30 68 40 64Z" fill="#fff"/>` +
    `<path d="M20 48C12 36 32 32 32 46" stroke-width="5"/>` +
    `<rect x="8" y="46" width="34" height="26" rx="4" fill="#e8553d"/>` +
    `<ellipse cx="42" cy="59" rx="5" ry="13" fill="#fff"/>` +
    `<path d="M42 66C48 66 52 68 56 70" stroke="#fff" stroke-width="6"/>` +
    `<circle cx="90" cy="88" r="3" fill="#fff"/><circle cx="80" cy="90" r="2.5" fill="#fff"/>` +
    `<path d="M14 42C16 28 30 24 40 32M32 30l8 3-1 8" stroke="${ARROW}" stroke-width="4"/>` +
    `<circle cx="72" cy="30" r="14" fill="${SKIN}"/>` +
    dot(67, 28, 2) +
    dot(77, 28, 2) +
    `<ellipse cx="72" cy="37" rx="3" ry="3.5" fill="${INK}"/>` +
    `<path d="M58 26C58 14 86 14 86 26C80 20 64 20 58 26Z" fill="${HAIR}"/>` +
    `<path d="M56 10l-4-4M90 10l4-4" stroke="${MOVE}" stroke-width="3"/>`,
  끼우다:
    `<rect x="8" y="36" width="80" height="56" rx="4" fill="#fff"/>` +
    `<rect x="12" y="40" width="36" height="24" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<rect x="12" y="64" width="36" height="24" fill="#43b04a" stroke-width="2.5"/>` +
    `<rect x="48" y="64" width="36" height="24" fill="#e85d9a" stroke-width="2.5"/>` +
    `<circle cx="30" cy="64" r="5" fill="#ff9f1a" stroke-width="2.5"/><circle cx="48" cy="76" r="5" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M48 40H84V64H70A5 5 0 0 1 62 64H48Z" fill="#fff7e0" stroke-width="2.5" stroke-dasharray="4 3"/>` +
    `<path d="M52 4H88V28H80A5 5 0 0 0 70 28H52Z" fill="#3b8fe0" transform="rotate(-8 70 16)"/>` +
    arrow('M92 34V52M86 46l6 6 6-6', 4),
  넣다:
    openBox(22, 56, 56, 36) +
    `<circle cx="50" cy="24" r="14" fill="#e8553d"/><path d="M38 20q12 6 24 0" stroke="#fff" stroke-width="3"/>` +
    arrow('M50 42V56M42 48l8 8 8-8', 5) +
    mv('M30 16v10M70 16v10'),
  꺼내다:
    `<ellipse cx="50" cy="34" rx="15" ry="13" fill="#c98a4e"/>` +
    `<circle cx="38" cy="18" r="6" fill="#c98a4e"/><circle cx="62" cy="18" r="6" fill="#c98a4e"/>` +
    `<circle cx="50" cy="16" r="13" fill="#c98a4e"/>` +
    dot(45, 15, 2) +
    dot(55, 15, 2) +
    `<ellipse cx="50" cy="21" rx="4" ry="3" fill="#f2d5b0" stroke-width="2"/>` +
    openBox(22, 50, 56, 42) +
    arrow('M86 58V30M80 36l6-6 6 6', 5) +
    arrow('M14 58V30M8 36l6-6 6 6', 5),
  담다:
    `<path d="M10 58H90C90 78 72 90 50 90S10 78 10 58Z" fill="#fff"/>` +
    `<path d="M16 58C18 48 30 46 36 52C40 44 54 44 58 52C64 46 80 46 84 58Z" fill="#e8553d"/>` +
    `<path d="M26 48l2-4M48 46l2-4M72 48l2-4" stroke="#43b04a" stroke-width="3"/>` +
    `<circle cx="50" cy="22" r="11" fill="#e8553d"/><path d="M50 11l2-5" stroke="#43b04a" stroke-width="3"/>` +
    hand(64, 20, -60, 0.9) +
    arrow('M30 18V40M24 34l6 6 6-6', 4) +
    `<path d="M20 70H80" stroke="#3b8fe0" stroke-width="4"/>`,
  덮다:
    `<rect x="4" y="76" width="92" height="10" rx="3" fill="#9a5b2e"/><path d="M8 86V94M92 86V94" stroke-width="5"/>` +
    `<ellipse cx="18" cy="68" rx="13" ry="7" fill="#fff"/>` +
    head(24, 60, 12, dot(20, 62, 1.8) + dot(29, 62, 1.8) + `<path d="M21 67q3 2 6 0" stroke-width="2"/>`) +
    `<path d="M34 76V60C48 54 70 54 94 60V76Z" fill="#ffd23f"/>` +
    `<path d="M44 58C46 42 60 30 80 30V52" fill="#ffd23f"/>` +
    `<path d="M50 64h8M66 64h8M58 70h8" stroke="#e8862e" stroke-width="3"/>` +
    hand(38, 58, 60, 0.8) +
    arrow('M60 20C44 20 34 30 34 44M28 38l6 6 6-6', 4),
  켜다:
    bulb(38, 38, true) +
    lightSwitch(78, 62, true) +
    tube('M96 96L84 78', SKIN, 7) +
    `<ellipse cx="82" cy="74" rx="4" ry="6" fill="${SKIN}"/>` +
    arrow('M92 40V56M86 46l6-6 6 6', 4),
  끄다:
    `<rect x="4" y="4" width="92" height="92" rx="6" fill="#2d3563"/>` +
    sparkle(16, 16, 4, '#fff1b8') +
    `<path d="M80 12a8 8 0 1 0 8 10a6 6 0 1 1 -8 -10Z" fill="#ffd23f"/>` +
    bulb(38, 38, false) +
    lightSwitch(76, 64, false) +
    tube('M96 96L82 80', SKIN, 7) +
    `<ellipse cx="80" cy="76" rx="4" ry="6" fill="${SKIN}"/>`,
  // ── 입·손·발톱 ──
  비비다:
    tube('M34 96L40 74', '#3b78e6', 12) +
    tube('M66 96L60 74', '#e8553d', 12) +
    `<rect x="28" y="22" width="24" height="54" rx="12" fill="${SKIN}" transform="rotate(-6 40 50)"/>` +
    `<rect x="48" y="26" width="24" height="54" rx="12" fill="${SKIN}" transform="rotate(6 60 50)"/>` +
    `<path d="M50 32V70" stroke-width="2.5"/>` +
    arrow('M18 60V30M12 36l6-6 6 6', 4) +
    arrow('M82 30V60M76 54l6 6 6-6', 4) +
    sparkle(50, 12, 6) +
    sparkle(30, 14, 4) +
    sparkle(70, 14, 4),
  빨다:
    head(38, 40, 24, dot(30, 40, 2.5) + dot(46, 40, 2.5) + `<circle cx="42" cy="54" r="3.5" fill="${INK}"/>`) +
    `<circle cx="24" cy="50" r="4.5" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="52" cy="48" r="4.5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<path d="M44 56L74 58V70" stroke-width="7"/><path d="M44 56L74 58V70" stroke="#e85d9a" stroke-width="3"/>` +
    glass(58, 64, 32, 30, 0.75, '#ff9f1a') +
    arrow('M70 40L56 44M62 36l-6 8 8 4', 3.5),
  뱉다:
    head(32, 42, 22, dot(24, 40, 2.5) + dot(38, 40, 2.5) + `<circle cx="44" cy="52" r="3.5" fill="${INK}"/>`) +
    `<circle cx="18" cy="52" r="4.5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    [
      [60, 44],
      [72, 36],
      [84, 28],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4.5" fill="#2b2b3a" stroke="none" transform="rotate(60 ${x} ${y})"/>`)
      .join('') +
    mv('M54 54l6 2M58 60l8 2M66 48l6-2') +
    `<path d="M40 70H94A27 27 0 0 1 40 70Z" fill="#43b04a"/>` +
    `<path d="M44 70H90A23 23 0 0 1 44 70Z" fill="#ff5c70" stroke="none"/>` +
    dot(56, 76, 2) +
    dot(67, 80, 2) +
    dot(78, 76, 2),
  깨물다:
    head(32, 44, 24, `<path d="M20 38q4-4 8 0M36 38q4-4 8 0" stroke-width="2.5"/>` + `<path d="M34 52H48V64H34Z" fill="${INK}"/><path d="M34 52H48V56H34Z" fill="#fff" stroke-width="2"/>`) +
    `<path d="M68 38C80 30 92 40 92 56C92 76 80 86 70 82C62 86 50 76 50 62C58 64 58 50 52 48C54 40 60 34 68 38Z" fill="#e8553d"/>` +
    `<path d="M68 38C68 30 70 26 74 22" stroke="#6b3e26" stroke-width="3.5"/>` +
    `<path d="M72 28C78 22 86 24 86 24C82 30 76 30 72 28Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M52 48C58 50 58 64 50 62" fill="#fff7c8" stroke-width="2.5"/>` +
    mv('M50 36l-4-4M52 74l-4 4'),
  할퀴다:
    `<rect x="70" y="10" width="18" height="78" fill="#d9a066"/>` +
    `<path d="M70 22H88M70 34H88M70 46H88M70 58H88M70 70H88" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<rect x="58" y="86" width="40" height="8" rx="2" fill="#9a5b2e"/>` +
    `<path d="M74 28L84 40M74 38L84 50M74 48L84 60" stroke="#fff" stroke-width="3"/>` +
    `<ellipse cx="38" cy="70" rx="20" ry="22" fill="#ff9f1a"/>` +
    `<path d="M20 80C8 80 6 66 12 60" stroke-width="8"/><path d="M20 80C8 80 6 66 12 60" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M22 30L20 14L32 22ZM52 22L60 12L60 28Z" fill="#ff9f1a"/>` +
    `<circle cx="40" cy="34" r="17" fill="#ff9f1a"/>` +
    `<path d="M32 32q3-3 6 0M44 32q3-3 6 0" stroke-width="2.5"/>` +
    `<path d="M38 40q3 3 6 0" stroke-width="2"/>` +
    `<path d="M28 38h-6M52 38h6" stroke-width="2"/>` +
    tube('M50 56L64 40', '#ff9f1a', 8) +
    `<circle cx="66" cy="38" r="6" fill="#ff9f1a"/>` +
    `<path d="M70 32l3-3M72 37l4-1M70 42l3 2" stroke-width="2.5"/>` +
    `<path d="M26 92v-6M48 92v-6" stroke-width="5"/>`,
  쪼다:
    ground(84) +
    `<ellipse cx="42" cy="54" rx="24" ry="18" fill="#9a5b2e"/>` +
    `<path d="M20 48L6 36L12 56Z" fill="#6b3e26"/>` +
    `<path d="M32 50C40 42 54 46 56 56C48 58 38 58 32 50Z" fill="#6b3e26"/>` +
    `<circle cx="66" cy="64" r="11" fill="#9a5b2e"/>` +
    dot(68, 61, 2.2) +
    `<path d="M73 68L80 82L68 74Z" fill="#ff9f1a"/>` +
    `<path d="M38 70V84M48 70V84" stroke="#ff9f1a" stroke-width="3.5"/>` +
    dot(84, 84, 2.6, '#f2c14e') +
    dot(90, 80, 2.6, '#f2c14e') +
    dot(76, 88, 2.6, '#f2c14e') +
    mv('M86 70l4-4M90 76l6-2M72 52l2-5'),
  파다:
    `<path d="M4 64H96V96H4Z" fill="#9a5b2e"/>` +
    `<ellipse cx="60" cy="70" rx="20" ry="7" fill="#5a3b24"/>` +
    `<path d="M76 64C80 50 94 50 96 64Z" fill="#b0773f"/>` +
    guy(24, 18, 'M0 10L4 36M1 18L16 30M1 18L18 24M4 36L-6 46L-8 62M4 36L16 46L16 58', 1) +
    `<path d="M14 18L50 60" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M46 56L58 52L62 64L50 70Z" fill="#8a96b0"/>` +
    `<path d="M10 14H18" stroke="#6b3e26" stroke-width="6"/>` +
    dot(70, 40, 2.6, '#b0773f') +
    dot(78, 34, 2.6, '#b0773f') +
    mv('M64 44l4-4'),
  메다:
    tube('M52 74L50 92', '#3b4a7a', 8) +
    tube('M62 74L64 92', '#3b4a7a', 8) +
    `<rect x="24" y="42" width="26" height="36" rx="8" fill="#e8553d"/>` +
    `<rect x="18" y="58" width="10" height="16" rx="3" fill="#ff9aa8"/>` +
    `<path d="M32 42C32 34 42 34 42 42" stroke-width="4"/>` +
    `<rect x="46" y="44" width="24" height="32" rx="9" fill="#7ec8f0"/>` +
    `<path d="M46 48C54 38 66 42 64 52L60 72" stroke-width="9"/><path d="M46 48C54 38 66 42 64 52L60 72" stroke="#b83a2a" stroke-width="4"/>` +
    `<circle cx="60" cy="26" r="15" fill="${SKIN}"/>` +
    `<path d="M45 26C44 10 72 8 76 22C68 18 60 20 56 26C52 24 48 26 45 26Z" fill="${HAIR}"/>` +
    `<path d="M45 26C44 34 48 38 50 38" stroke="${HAIR}" stroke-width="4"/>` +
    dot(68, 27, 2.2) +
    `<path d="M66 34q4 2 7-1" stroke-width="2.2"/>` +
    `<circle cx="72" cy="31" r="3" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    tube('M66 52L72 68', '#7ec8f0', 6) +
    `<circle cx="72" cy="71" r="4" fill="${SKIN}"/>` +
    arrow('M18 30C20 18 34 12 44 18M36 12l8 6-6 6', 4),
};
