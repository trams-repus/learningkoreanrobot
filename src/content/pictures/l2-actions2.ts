// 7~8세 동작 단어(재다·사다·하품하다·녹다·흩어지다…): 사람이 그 동작을 하는 순간을 움직임 선·화살표로. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, ring, stick, person, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';
const f = (n: number) => +n.toFixed(1);

/** 곧은 화살표 (끝에 머리) */
function arrow(x1: number, y1: number, x2: number, y2: number, color = ARROW, w = 5): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 9;
  const p = (d: number) => `${f(x2 - h * Math.cos(a + d))} ${f(y2 - h * Math.sin(a + d))}`;
  return `<path d="M${x1} ${y1}L${x2} ${y2}M${p(-0.6)}L${x2} ${y2}L${p(0.6)}" stroke="${color}" stroke-width="${w}"/>`;
}

/** 굽은 화살표 (Q 곡선, 머리 방향은 조절점→끝점) */
function carrow(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, color = ARROW, w = 5, dash = ''): string {
  const a = Math.atan2(y2 - cy, x2 - cx);
  const h = 9;
  const p = (d: number) => `${f(x2 - h * Math.cos(a + d))} ${f(y2 - h * Math.sin(a + d))}`;
  const da = dash ? ` stroke-dasharray="${dash}"` : '';
  return (
    `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="${color}" stroke-width="${w}"${da}/>` +
    `<path d="M${p(-0.6)}L${x2} ${y2}L${p(0.6)}" stroke="${color}" stroke-width="${w}"/>`
  );
}

/** 앞에서 본 머리 (가운데 (x, y), 반지름 r). inner는 반지름 32 기준 좌표(가운데 0 0) */
function headF(x: number, y: number, r: number, inner: string, hair = HAIR): string {
  const s = r / 32;
  return (
    `<g transform="translate(${x} ${y}) scale(${f(s * 1000) / 1000})" stroke-width="${f(3.5 / s)}">` +
    `<circle cx="0" cy="0" r="32" fill="${SKIN}"/>` +
    `<path d="M-32 -4C-33 -28 -17 -34 0 -34S33 -28 32 -4C26 -14 14 -19 0 -19S-26 -14 -32 -4Z" fill="${hair}"/>` +
    inner +
    `</g>`
  );
}

/** 옆에서 본 머리 (오른쪽을 봄). inner는 반지름 32 기준 좌표 */
function headR(x: number, y: number, r: number, inner: string, hair = HAIR): string {
  const s = r / 32;
  return (
    `<g transform="translate(${x} ${y}) scale(${f(s * 1000) / 1000})" stroke-width="${f(3.5 / s)}">` +
    `<circle cx="0" cy="0" r="32" fill="${SKIN}"/>` +
    `<path d="M-31 10C-36 -18 -20 -33 2 -33S30 -24 31 -12C18 -18 6 -18 -2 -14C-6 -4 -10 4 -14 12C-20 8 -26 8 -31 10Z" fill="${hair}"/>` +
    `<circle cx="-8" cy="4" r="6" fill="${SKIN}"/>` +
    inner +
    `</g>`
  );
}

/** 막대 사람 얼굴 */
const stickFace = (x: number, y: number) => dot(x - 3.5, y, 1.6) + dot(x + 3.5, y, 1.6) + `<path d="M${x - 3} ${y + 4}q3 2.5 6 0" stroke-width="2"/>`;

/** 음표 */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 하트 (가운데 윗부분 (x, y)) */
const heart = (x: number, y: number, s = 1, fill = '#ff5c70') =>
  `<path d="M${x} ${y}C${x - 6 * s} ${y - 10 * s} ${x - 16 * s} ${y - 4 * s} ${x - 10 * s} ${y + 4 * s}L${x} ${y + 12 * s}L${x + 10 * s} ${y + 4 * s}C${x + 16 * s} ${y - 4 * s} ${x + 6 * s} ${y - 10 * s} ${x} ${y}Z" fill="${fill}"/>`;

/** 선물 상자 */
const gift = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f(3.5 / s)}">` +
  `<path d="M-4 -16C-14 -26 -20 -14 -4 -14ZM4 -16C14 -26 20 -14 4 -14Z" fill="${HL}"/>` +
  `<rect x="-16" y="-14" width="32" height="30" rx="2" fill="#e85d9a"/><rect x="-4" y="-14" width="8" height="30" fill="${HL}"/>` +
  `<path d="M-16 -4H16" stroke="${HL}" stroke-width="${f(6 / s)}"/></g>`;

/** 동전 (글자 없이 가운데 둥근 선) */
const coin = (x: number, y: number, r = 7) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd23f"/><circle cx="${x}" cy="${y}" r="${f(r * 0.5)}" stroke="#e8a21a" stroke-width="2.5"/>`;

/** 사과 */
const apple = (x: number, y: number, r = 8, fill = '#e8553d') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><path d="M${x} ${y - r}v-4" stroke="#6b3e26" stroke-width="3"/><path d="M${x} ${y - r - 2}q4-5 8-2q-4 5-8 2Z" fill="#43b04a" stroke-width="2"/>`;

/** 가게 차양 (빨강·흰 줄무늬) */
const awning = (x1: number, x2: number, y: number) => {
  const n = 4;
  const w = (x2 - x1) / n;
  let s = `<path d="M${x1} ${y}H${x2}V${y + 14}H${x1}Z" fill="#fff"/>`;
  for (let i = 0; i < n; i += 2) s += `<rect x="${f(x1 + i * w)}" y="${y}" width="${f(w)}" height="14" fill="#e8553d"/>`;
  let sc = '';
  for (let i = 0; i < n; i++) sc += `<path d="M${f(x1 + i * w)} ${y + 14}a${f(w / 2)} ${f(w / 2.4)} 0 0 0 ${f(w)} 0Z" fill="${i % 2 ? '#fff' : '#e8553d'}"/>`;
  return s + sc;
};

/** 침대 (옆에서, 머리 쪽이 왼쪽) */
const bed =
  `<path d="M8 40V92M92 60V92" stroke="#6b3e26" stroke-width="6"/>` +
  `<rect x="8" y="64" width="84" height="14" rx="3" fill="#b5793a"/><rect x="10" y="56" width="80" height="10" rx="4" fill="#fff"/>`;

/** 흔들림 지그재그 선 */
const shake = (x: number, y: number, dir: 1 | -1, n = 3) => {
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += `l${4 * dir} 5l${-4 * dir} 5`;
  return `<path d="${d}" stroke="${MOVE}" stroke-width="3"/>`;
};

/** 칠판 (도형 그림만) */
const board = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#3a9e47" stroke="#9a5b2e" stroke-width="5"/>`;

/** 작은 막대 사람 (모이다·흩어지다). 머리 (x, y) */
const mini = (x: number, y: number, shirt: string, s = 0.62) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f(3.5 / s)}">` +
  `<path d="M0 10V32M0 16L-12 28M0 16L12 28M0 32L-8 50M0 32L8 50" stroke-width="${f(6 / s)}"/>` +
  `<path d="M-9 12H9L10 32H-10Z" fill="${shirt}"/>` +
  `<circle cx="0" cy="0" r="11" fill="${SKIN}"/>` +
  `</g>`;

/** 곰 인형 */
const teddy = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f(3.5 / s)}">` +
  `<circle cx="-14" cy="-40" r="8" fill="#c98f52"/><circle cx="14" cy="-40" r="8" fill="#c98f52"/>` +
  `<ellipse cx="0" cy="6" rx="20" ry="22" fill="#c98f52"/><circle cx="0" cy="-26" r="18" fill="#c98f52"/>` +
  `<ellipse cx="0" cy="-20" rx="8" ry="6" fill="#f0d0a8"/>` +
  dot(-7, -30, 2.5) +
  dot(7, -30, 2.5) +
  dot(0, -22, 2.4) +
  `<ellipse cx="0" cy="8" rx="11" ry="12" fill="#f0d0a8" stroke="none"/>` +
  `</g>`;

/** 꽃 (가운데 (x, y)) */
const flower = (x: number, y: number, r: number, petal: string) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const t = ((a - 90) * Math.PI) / 180;
      return `<circle cx="${f(x + r * Math.cos(t))}" cy="${f(y + r * Math.sin(t))}" r="${f(r * 0.72)}" fill="${petal}"/>`;
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${f(r * 0.62)}" fill="#ffd23f"/>`;

/** 화분 */
const pot = (x: number, y: number, w = 26) =>
  `<path d="M${x - w / 2} ${y}H${x + w / 2}L${f(x + w * 0.38)} ${y + 20}H${f(x - w * 0.38)}Z" fill="#e8862e"/><rect x="${f(x - w / 2 - 2)}" y="${y - 4}" width="${w + 4}" height="7" rx="2" fill="#e8862e"/>`;

/** 눈송이 */
const flake = (x: number, y: number, r = 7) =>
  `<g stroke="#7ec8f0" stroke-width="3"><path d="M${x} ${y - r}V${y + r}M${f(x - r * 0.87)} ${f(y - r / 2)}L${f(x + r * 0.87)} ${f(y + r / 2)}M${f(x - r * 0.87)} ${f(y + r / 2)}L${f(x + r * 0.87)} ${f(y - r / 2)}"/></g>`;

export const PICS: Record<string, string> = {
  // ── 사고팔기·주고받기 ──
  재다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<rect x="68" y="8" width="18" height="86" rx="2" fill="#ffd23f"/>` +
    `<path d="M68 18h9M68 28h5M68 38h9M68 48h5M68 58h9M68 68h5M68 78h9M68 88h5" stroke-width="2.5"/>` +
    person(40, 94, 1.65, { hair: HAIR, style: 'short', shirt: '#43b04a' }) +
    `<path d="M24 15H72" stroke="#e8553d" stroke-width="5"/>` +
    arrow(12, 60, 12, 20, ARROW, 4) +
    arrow(12, 54, 12, 90, ARROW, 4),
  고르다:
    tube('M50 2V14', '#3b78e6', 14) +
    `<rect x="38" y="12" width="26" height="22" rx="9" fill="${SKIN}"/>` +
    `<rect x="45" y="26" width="10" height="26" rx="5" fill="${SKIN}"/>` +
    `<path d="M38 22H30" stroke="${MOVE}" stroke-width="3"/>` +
    apple(18, 76, 11, '#43b04a') +
    apple(50, 76, 11, '#e8553d') +
    apple(82, 76, 11, '#ffc933') +
    ring(50, 72, 19, 20) +
    sparkle(72, 46, 6) +
    sparkle(28, 48, 5),
  사다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    awning(54, 96, 10) +
    `<path d="M58 30V60M92 30V60" stroke="#9a5b2e" stroke-width="4"/>` +
    person(76, 66, 1.05, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<rect x="54" y="60" width="42" height="34" rx="2" fill="#b5793a"/>` +
    apple(66, 56, 6) +
    apple(86, 56, 6, '#43b04a') +
    person(24, 94, 1.5, { hair: HAIR, style: 'pony', shirt: '#3b78e6' }) +
    tube('M32 72L46 62', SKIN, 5) +
    coin(48, 60, 6) +
    arrow(40, 44, 54, 44, '#ff9f1a', 4) +
    `<path d="M6 78H22V94H6Z" fill="#fff"/><path d="M10 78C10 70 18 70 18 78" stroke-width="3"/><path d="M10 78V70M14 78V66" stroke="#43b04a" stroke-width="4"/>`,
  팔다:
    awning(12, 88, 6) +
    `<path d="M16 26V58M84 26V58" stroke="#9a5b2e" stroke-width="4"/>` +
    person(50, 64, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<path d="M40 48H60V64H40Z" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="8" y="60" width="84" height="34" rx="2" fill="#b5793a"/>` +
    apple(24, 54, 7) +
    apple(38, 56, 6, '#ffc933') +
    apple(64, 56, 6, '#43b04a') +
    apple(78, 54, 7) +
    `<path d="M14 70H86" stroke="#9a5b2e" stroke-width="3"/>` +
    tube('M42 50L22 36', SKIN, 5) +
    apple(16, 32, 7) +
    coin(80, 80, 6) +
    coin(66, 82, 6),
  바꾸다:
    person(16, 96, 1.2, { hair: HAIR, style: 'pony', shirt: '#e85d9a' }) +
    person(84, 96, 1.2, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<circle cx="36" cy="58" r="11" fill="#e8553d"/><path d="M26 54C32 58 40 58 46 54" stroke="#fff" stroke-width="3"/>` +
    `<path d="M54 60V52L60 46H70L74 52H80V60Z" fill="#3b78e6"/><circle cx="60" cy="62" r="4.5" fill="${INK}"/><circle cx="74" cy="62" r="4.5" fill="${INK}"/>` +
    carrow(30, 36, 50, 14, 72, 34) +
    carrow(72, 80, 50, 100, 28, 80, '#e8553d'),
  빌리다:
    `<rect x="4" y="12" width="36" height="82" fill="#b5793a"/>` +
    `<path d="M4 38H40M4 64H40" stroke-width="4"/>` +
    `<rect x="8" y="18" width="6" height="18" fill="#e8553d" stroke-width="2.5"/><rect x="15" y="18" width="6" height="18" fill="#3b78e6" stroke-width="2.5"/><rect x="22" y="20" width="6" height="16" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="8" y="44" width="6" height="18" fill="#43b04a" stroke-width="2.5"/><rect x="15" y="44" width="6" height="18" fill="#8e4fc9" stroke-width="2.5"/><rect x="29" y="44" width="6" height="18" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="8" y="70" width="6" height="20" fill="#ffd23f" stroke-width="2.5"/><rect x="22" y="70" width="6" height="20" fill="#3b78e6" stroke-width="2.5"/>` +
    person(72, 96, 1.55, { hair: HAIR, style: 'short', shirt: '#ff9f1a' }) +
    `<rect x="60" y="58" width="20" height="26" rx="2" fill="#8e4fc9"/><path d="M64 58V84" stroke-width="2.5"/>` +
    tube('M60 76L66 72M84 76L78 72', SKIN, 5) +
    carrow(44, 30, 56, 18, 66, 24) +
    carrow(50, 90, 46, 84, 44, 74, ARROW, 4, '4 5'),
  포장하다:
    `<path d="M6 76H94L88 94H12Z" fill="#ff9aa8"/>` +
    `<rect x="28" y="36" width="44" height="42" fill="#c98f52"/>` +
    `<path d="M50 36H72V78H50Z" fill="#ff9aa8"/>` +
    `<circle cx="58" cy="46" r="3" fill="#fff" stroke="none"/><circle cx="66" cy="58" r="3" fill="#fff" stroke="none"/><circle cx="57" cy="68" r="3" fill="#fff" stroke="none"/>` +
    `<circle cx="22" cy="86" r="3" fill="#fff" stroke="none"/><circle cx="80" cy="86" r="3" fill="#fff" stroke="none"/>` +
    `<path d="M28 78L10 44L20 34L30 60Z" fill="#ff9aa8"/>` +
    `<rect x="46" y="52" width="10" height="8" fill="#dff2fc" stroke-width="2.5"/>` +
    carrow(12, 26, 26, 12, 42, 22) +
    `<circle cx="84" cy="22" r="10" fill="${HL}"/><circle cx="84" cy="22" r="3.5" fill="#fff7e0"/><path d="M84 32C80 40 76 36 74 44" stroke="${HL}" stroke-width="4"/>`,
  선물하다:
    person(24, 96, 1.5, { hair: HAIR, style: 'long', shirt: '#e85d9a' }) +
    person(80, 96, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M34 74L46 68', SKIN, 5) +
    tube('M70 76L62 70', SKIN, 5) +
    gift(53, 64, 1.05) +
    heart(52, 22, 1.1) +
    sparkle(30, 16, 5) +
    sparkle(76, 18, 6) +
    arrow(36, 44, 58, 44, ARROW, 4),
  전화하다:
    headF(
      42,
      54,
      30,
      dot(-12, 2) +
        dot(10, 2) +
        `<ellipse cx="-2" cy="18" rx="7" ry="6" fill="#c62f3f"/>` +
        cheeks(12, 16, -2).replace(/r="5"/g, 'r="5"'),
    ) +
    `<rect x="66" y="30" width="18" height="36" rx="5" fill="#3b4060"/><rect x="70" y="36" width="10" height="22" rx="2" fill="#7ec8f0" stroke="none"/>` +
    `<path d="M62 70C60 60 64 56 70 56L80 60L80 72C76 78 66 78 62 70Z" fill="${SKIN}"/>` +
    `<path d="M88 34q6 14 0 28M94 28q8 20 0 40" stroke="#ff9f1a" stroke-width="4"/>`,
  연주하다:
    person(38, 96, 1.6, { hair: HAIR, style: 'short', shirt: '#8e4fc9' }) +
    tube('M50 76L88 38', '#9a5b2e', 5) +
    `<rect x="84" y="28" width="10" height="14" rx="3" fill="#6b3e26" transform="rotate(45 89 35)"/>` +
    `<circle cx="42" cy="84" r="13" fill="#e8862e"/><circle cx="54" cy="74" r="9" fill="#e8862e"/><circle cx="46" cy="80" r="4" fill="${INK}"/>` +
    tube('M26 76L44 76', SKIN, 5) +
    tube('M50 70L64 62', SKIN, 5) +
    note(14, 34, '#e85d9a') +
    note(70, 22, '#3b78e6'),

  // ── 입과 코로 내는 소리 ──
  소리치다:
    headR(
      34,
      54,
      26,
      dot(14, -4, 4) + `<path d="M8 -14l12 4" stroke-width="4"/>` + `<path d="M22 8C30 6 32 22 22 22C18 22 18 10 22 8Z" fill="#c62f3f"/>`,
    ) +
    `<path d="M56 50L72 38V80L56 68Z" fill="${SKIN}"/>` +
    `<path d="M78 42l14-10M80 59h16M78 76l14 10" stroke="#ff9f1a" stroke-width="6"/>`,
  속삭이다:
    headR(24, 56, 20, dot(14, -4) + `<path d="M16 12q6 2 10-1" stroke-width="3.5"/>`) +
    headF(76, 56, 20, dot(-8, 2) + dot(12, 2) + `<path d="M-4 16q6 5 12 0" stroke-width="3.5"/>` + cheeks(12, 16, 2), '#2f2a26') +
    `<circle cx="56" cy="58" r="6" fill="${SKIN}"/>` +
    tube('M40 44C50 46 50 64 42 70', SKIN, 6) +
    `<g fill="${MOVE}" stroke="none"><circle cx="46" cy="55" r="1.8"/><circle cx="50" cy="58" r="1.8"/></g>` +
    `<path d="M48 30q4-4 8 0M44 22q8-8 16 0" stroke="${MOVE}" stroke-width="3"/>`,
  하품하다:
    headF(
      50,
      50,
      34,
      `<path d="M-20 -2q7 5 14 0M6 -2q7 5 14 0" stroke-width="4"/>` +
        `<ellipse cx="0" cy="20" rx="10" ry="13" fill="#c62f3f"/><ellipse cx="0" cy="26" rx="6" ry="4" fill="#ff8aa0" stroke="none"/>`,
    ) +
    drop(22, 50, 0.6) +
    drop(78, 50, 0.6) +
    `<path d="M70 94C66 82 68 72 78 68C84 66 88 72 84 78L80 94Z" fill="${SKIN}"/>` +
    `<path d="M10 20q4-6 8 0M84 16q4-6 8 0" stroke="${MOVE}" stroke-width="3"/>`,
  재채기하다:
    headR(
      30,
      54,
      24,
      `<path d="M8 -8l8 4-8 4" stroke-width="4"/>` + `<path d="M20 10C28 8 30 20 20 20Z" fill="#c62f3f"/>` + `<path d="M26 -2q6 4 4 8" stroke-width="3"/>`,
    ) +
    `<path d="M58 44l12-8M60 54h14M58 64l12 8" stroke="${MOVE}" stroke-width="3"/>` +
    `<g fill="#bfe6fb" stroke="#7ec8f0" stroke-width="2.5"><circle cx="76" cy="30" r="4"/><circle cx="86" cy="42" r="5"/><circle cx="82" cy="56" r="4"/><circle cx="92" cy="60" r="3.5"/><circle cx="86" cy="72" r="5"/><circle cx="74" cy="82" r="3.5"/><circle cx="92" cy="24" r="3"/></g>`,
  기침하다:
    headF(
      42,
      46,
      28,
      `<path d="M-18 0l10 3M18 0l-10 3" stroke-width="4"/>` + dot(-12, 6) + dot(12, 6) + `<path d="M-18 -10l10 4M18 -10l-10 4" stroke-width="3"/>`,
    ) +
    `<rect x="32" y="56" width="22" height="18" rx="8" fill="${SKIN}"/><path d="M38 58V66M45 58V66" stroke-width="2.5"/>` +
    tube('M40 74L40 96', SKIN, 8) +
    blob('#fff', [
      [70, 60, 7],
      [78, 54, 6],
    ]) +
    blob('#fff', [
      [86, 40, 6],
      [92, 34, 5],
    ]) +
    blob('#fff', [
      [80, 76, 5],
      [88, 80, 4],
    ]),
  코골다:
    headF(
      38,
      58,
      30,
      `<path d="M-20 0q6 5 12 0M8 0q6 5 12 0" stroke-width="4"/>` + `<ellipse cx="0" cy="17" rx="8" ry="6" fill="#c62f3f"/>`,
    ) +
    `<circle cx="47" cy="62" r="7" fill="#bfe6fb" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M62 44l8-6 6 6 8-6 6 6 6-6" stroke="#8e4fc9" stroke-width="5"/>` +
    `<path d="M64 26l6-5 5 5 6-5 5 5" stroke="#8e4fc9" stroke-width="4"/>` +
    `<path d="M66 10l5-4 4 4 5-4" stroke="#8e4fc9" stroke-width="3.5"/>` +
    `<path d="M4 94C4 86 16 86 36 88S76 90 92 86V96H4Z" fill="#7ec8f0"/>`,
  잠들다:
    bed +
    `<ellipse cx="24" cy="52" rx="12" ry="6" fill="#dfe8f5"/>` +
    `<path d="M38 50C40 42 88 42 90 52V60H38Z" fill="#7ec8f0"/>` +
    `<circle cx="26" cy="44" r="11" fill="${SKIN}"/><path d="M15 42C15 32 22 32 26 33S37 34 36 40C30 36 22 38 15 42Z" fill="${HAIR}"/>` +
    `<path d="M21 46q2 2 4 0M28 46q2 2 4 0" stroke-width="2.2"/>` +
    `<path d="M70 8A16 16 0 1 0 86 30A13 13 0 0 1 70 8Z" fill="${HL}"/>` +
    sparkle(44, 14, 6) +
    sparkle(56, 28, 4) +
    sparkle(92, 8, 4),
  깨다:
    `<rect x="60" y="4" width="36" height="30" rx="2" fill="#bfe6fb"/><circle cx="78" cy="30" r="10" fill="#ffd23f"/><rect x="60" y="4" width="36" height="30" rx="2" stroke-width="4"/>` +
    `<path d="M66 20l-4-4M78 14v-6M90 20l4-4" stroke="#ff9f1a" stroke-width="3"/>` +
    bed +
    `<path d="M50 56C50 48 88 48 90 56V60H50Z" fill="#7ec8f0"/>` +
    tube('M34 56V38', '#ffc933', 12) +
    tube('M30 36L16 18M38 36L50 18', SKIN, 5) +
    `<circle cx="34" cy="26" r="10" fill="${SKIN}"/><path d="M24 24C24 14 30 14 34 15S44 16 44 22C38 18 30 20 24 24Z" fill="${HAIR}"/>` +
    stickFace(34, 27) +
    `<path d="M10 8l3 5M22 4v5M4 20l5 2" stroke="${MOVE}" stroke-width="3"/>`,
  샤워하다:
    `<path d="M92 4V14H70" stroke="#8a96b0" stroke-width="5"/><path d="M58 20C58 10 82 10 82 20Z" fill="#8a96b0"/>` +
    `<path d="M60 26l-6 12M70 26v12M80 26l6 12M56 44l-4 8M86 44l4 8" stroke="#4aa8f0" stroke-width="3.5"/>` +
    headF(
      58,
      70,
      24,
      `<path d="M-14 2q5 4 10 0M4 2q5 4 10 0" stroke-width="4"/>` + `<path d="M-8 14q8 7 16 0" stroke-width="4"/>` + cheeks(10, 18, 0),
    ) +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="3"><circle cx="46" cy="48" r="6"/><circle cx="58" cy="44" r="7"/><circle cx="70" cy="48" r="6"/><circle cx="24" cy="80" r="5"/><circle cx="16" cy="64" r="4"/><circle cx="90" cy="84" r="4"/></g>` +
    drop(26, 30, 0.7) +
    drop(40, 20, 0.6),
  빗다:
    `<path d="M16 50C12 30 30 16 50 16S88 30 84 50L88 88H66L64 60H36L34 88H12Z" fill="#e8862e"/>` +
    `<circle cx="50" cy="54" r="24" fill="${SKIN}"/>` +
    `<path d="M26 48C28 30 40 26 50 26S72 30 74 48C66 40 58 38 50 38S34 40 26 48Z" fill="#e8862e"/>` +
    dot(42, 56, 2.8) +
    dot(58, 56, 2.8) +
    `<path d="M44 66q6 5 12 0" stroke-width="3"/>` +
    cheeks(62, 16) +
    `<g transform="rotate(-70 80 52)"><rect x="66" y="44" width="28" height="9" rx="3" fill="#8e4fc9"/><path d="M69 53v7M74 53v7M79 53v7M84 53v7M89 53v7" stroke-width="3"/></g>` +
    `<path d="M90 30C92 36 92 40 90 44M92 60C94 66 94 70 92 74" stroke="${MOVE}" stroke-width="3"/>` +
    arrow(96, 44, 96, 70, ARROW, 3.5),
  입다:
    person(50, 98, 1.6, { hair: HAIR, style: 'short', shirt: '#fff' }) +
    `<path d="M14 70L32 58H68L86 70L78 82L70 78V92H30V78L22 82Z" fill="#e8553d"/>` +
    `<path d="M40 58q10 8 20 0" fill="${SKIN}" stroke-width="3"/>` +
    `<circle cx="30" cy="92" r="5" fill="${SKIN}"/><circle cx="70" cy="92" r="5" fill="${SKIN}"/>` +
    arrow(8, 50, 8, 90, ARROW, 5) +
    arrow(92, 50, 92, 90, ARROW, 5),
  벗다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    person(50, 96, 1.55, { hair: HAIR, style: 'short', shirt: '#fff' }) +
    tube('M37 72L30 40L34 24M63 72L70 40L66 24', SKIN, 5) +
    `<path d="M36 4H64L80 12L74 24L64 19V30H36V19L26 24L20 12Z" fill="#e8553d"/>` +
    arrow(10, 66, 10, 26, ARROW, 5) +
    arrow(90, 66, 90, 26, ARROW, 5),
  신다:
    `<rect x="36" y="2" width="30" height="22" fill="#3b78e6"/>` +
    `<path d="M40 22V52C40 58 44 60 50 60H76C84 60 84 50 76 48L62 44V22Z" fill="#fff"/>` +
    `<path d="M22 72C22 64 34 62 40 66L66 70C80 72 88 76 88 84V88H22Z" fill="#e8553d"/>` +
    `<path d="M22 88H88" stroke-width="5"/><path d="M40 70l6 8M50 70l6 8" stroke="#fff" stroke-width="3"/>` +
    arrow(16, 30, 16, 60, ARROW, 5) +
    `<path d="M88 30V40M94 36H84" stroke="${MOVE}" stroke-width="3"/>`,
  들어올리다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<rect x="26" y="6" width="48" height="26" rx="3" fill="#c98f52"/><path d="M26 16H74" stroke="#9a5b2e" stroke-width="3"/>` +
    person(50, 96, 1.5, { hair: HAIR, style: 'short', shirt: '#43b04a' }) +
    tube('M38 70L30 30M62 70L70 30', SKIN, 5) +
    arrow(12, 70, 12, 22, ARROW, 5) +
    arrow(88, 70, 88, 22, ARROW, 5),

  // ── 사람과 사람 ──
  안아주다:
    person(50, 98, 1.75, { hair: HAIR, style: 'long', shirt: '#43b04a' }) +
    `<ellipse cx="50" cy="80" rx="22" ry="12" fill="#fff1b8"/>` +
    `<circle cx="36" cy="72" r="10" fill="${SKIN}"/><path d="M26 70C26 60 36 58 42 64Z" fill="#ffc933"/>` +
    `<path d="M32 74q2 2 4 0M38 74q2 2 4 0" stroke-width="2"/>` +
    tube('M26 86C40 94 62 92 74 80', SKIN, 6) +
    heart(80, 22, 0.9) +
    heart(18, 32, 0.7, '#ff9aa8'),
  업어주다:
    person(64, 52, 0.95, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }) +
    tube('M72 54L82 74', '#3b78e6', 6) +
    tube('M62 54L70 76', '#3b78e6', 6) +
    person(44, 98, 1.65, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
    tube('M56 38L44 64', SKIN, 5) +
    tube('M58 82L76 76', SKIN, 5) +
    heart(18, 18, 0.9),
  쓰다듬다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M34 94C30 74 36 62 50 62S70 74 66 94Z" fill="#c98f52"/>` +
    `<path d="M66 88C80 86 84 74 80 68" stroke="#c98f52" stroke-width="8"/><path d="M66 88C80 86 84 74 80 68" stroke-width="1"/>` +
    `<circle cx="50" cy="50" r="20" fill="#c98f52"/>` +
    `<path d="M32 38C22 42 22 60 28 64C34 60 34 48 34 42Z" fill="#6b3e26"/><path d="M68 38C78 42 78 60 72 64C66 60 66 48 66 42Z" fill="#6b3e26"/>` +
    `<path d="M40 50q4-4 8 0M52 50q4-4 8 0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="60" rx="6" ry="4" fill="${INK}"/>` +
    `<path d="M30 30C28 22 40 20 44 26L66 28C72 28 72 36 66 36H38C32 36 30 34 30 30Z" fill="${SKIN}"/>` +
    tube('M66 30L92 20', '#3b78e6', 8) +
    `<path d="M30 14C40 8 54 8 64 14" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M26 20H18M72 18l6-6" stroke="${MOVE}" stroke-width="3"/>` +
    heart(86, 50, 0.7),
  간지럽히다:
    headF(
      50,
      40,
      30,
      `<path d="M-18 -2l9 4-9 4M18 -2l-9 4 9 4" stroke-width="4"/>` +
        `<path d="M-14 12H14C14 32 -14 32 -14 12Z" fill="#c62f3f"/>` +
        cheeks(12, 22, 0),
    ) +
    `<path d="M22 98C22 80 34 72 50 72S78 80 78 98Z" fill="#3b78e6"/>` +
    `<g transform="rotate(-30 16 84)"><rect x="4" y="78" width="26" height="14" rx="7" fill="${SKIN}"/><path d="M12 78V70M18 78V68M24 78V70" stroke="${SKIN}" stroke-width="5"/><path d="M12 78V70M18 78V68M24 78V70" stroke-width="1.5"/></g>` +
    `<g transform="rotate(30 84 84)"><rect x="70" y="78" width="26" height="14" rx="7" fill="${SKIN}"/><path d="M76 78V70M82 78V68M88 78V70" stroke="${SKIN}" stroke-width="5"/><path d="M76 78V70M82 78V68M88 78V70" stroke-width="1.5"/></g>` +
    `<path d="M8 58q4-4 0-8M92 58q-4-4 0-8M14 50q4-4 0-8M86 50q-4-4 0-8" stroke="#ff9f1a" stroke-width="3"/>`,
  악수하다:
    `<rect x="2" y="42" width="22" height="28" rx="3" fill="#3b78e6"/><rect x="76" y="40" width="22" height="28" rx="3" fill="#e8553d"/>` +
    `<path d="M24 46H46L60 52L64 62L50 74H24Z" fill="${SKIN}"/>` +
    `<path d="M76 44H58C52 44 44 50 40 54C44 58 50 56 54 54L60 56L56 70C60 74 66 72 76 66Z" fill="#ffc08e"/>` +
    `<path d="M56 60L62 64M52 64L58 68" stroke-width="2.5"/>` +
    `<path d="M40 24v10M50 20v10M60 24v10M40 90v-10M50 94v-10M60 90v-10" stroke="${MOVE}" stroke-width="3"/>`,
  손잡다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    person(28, 96, 1.5, { hair: HAIR, style: 'pony', shirt: '#e85d9a' }) +
    person(72, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M38 72L50 80M62 72L50 80', SKIN, 5) +
    `<circle cx="50" cy="80" r="5" fill="${SKIN}"/>` +
    ring(50, 80, 11, 10) +
    heart(50, 22, 0.9),
  껴안다:
    teddy(56, 60, 1.35) +
    headF(40, 46, 16, `<path d="M-14 2q5 4 10 0M4 2q5 4 10 0" stroke-width="5"/>` + `<path d="M-6 14q6 5 12 0" stroke-width="4.5"/>` + cheeks(10, 18, 0)) +
    tube('M28 60C24 76 44 84 70 72', '#ff9f1a', 7) +
    `<circle cx="72" cy="72" r="5" fill="${SKIN}"/>` +
    `<path d="M10 58l-6-4M10 70H2M90 58l6-4M90 70h8" stroke="${MOVE}" stroke-width="3"/>` +
    heart(84, 16, 0.8) +
    heart(16, 22, 0.6, '#ff9aa8'),
  밀어주다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M40 96L46 6H92L96 96" stroke="#b5793a" stroke-width="5"/>` +
    `<path d="M58 8L60 64M80 8L82 64" stroke="#8a96b0" stroke-width="2.5"/>` +
    person(70, 62, 1, { hair: HAIR, style: 'pony', shirt: '#ffc933' }) +
    tube('M76 62L90 70', '#3b78e6', 6) +
    `<rect x="54" y="60" width="34" height="6" rx="2" fill="#e8553d"/>` +
    person(24, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    tube('M32 72L56 52', SKIN, 5) +
    arrow(18, 20, 40, 14, ARROW, 5) +
    `<path d="M88 36l6-2M88 46h8" stroke="${MOVE}" stroke-width="3"/>`,
  달래다:
    person(66, 96, 1.7, { hair: HAIR, style: 'bun', shirt: '#8e4fc9' }) +
    `<circle cx="32" cy="58" r="15" fill="${SKIN}"/><path d="M17 56C17 44 24 42 32 42S47 44 47 54C42 50 38 49 32 50S22 50 17 56Z" fill="#2f2a26"/>` +
    `<path d="M24 60q3-3 6 0M34 60q3-3 6 0" stroke-width="2.5"/><path d="M28 68q4-3 8 0" stroke-width="2.5"/>` +
    `<path d="M32 74C30 82 30 90 32 96H16C14 88 18 78 24 74Z" fill="#ffc933"/>` +
    drop(22, 62, 0.55) +
    tube('M56 70C48 60 42 46 34 42', SKIN, 5) +
    `<path d="M26 32q4-6 10-6M22 24q6-8 14-8" stroke="${MOVE}" stroke-width="3"/>` +
    heart(84, 16, 0.8),
  돕다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    person(30, 96, 1.6, { hair: '#dfe8f5', style: 'bun', shirt: '#e85d9a', glasses: true }) +
    person(76, 96, 1.2, { hair: HAIR, style: 'short', shirt: '#ffc933' }) +
    `<path d="M46 62C46 56 58 56 58 62" stroke-width="4"/><rect x="42" y="62" width="20" height="24" rx="3" fill="#43b04a"/>` +
    tube('M38 76L44 66M66 78L58 66', SKIN, 5) +
    heart(52, 26, 0.9) +
    sparkle(86, 30, 5),

  // ── 배우기·놀이 ──
  가르치다:
    board(38, 8, 56, 50) +
    `<circle cx="54" cy="28" r="9" stroke="#fff" stroke-width="3"/><path d="M68 38L76 20L84 38Z" stroke="#fff" stroke-width="3"/><path d="M48 48H86" stroke="#fff" stroke-width="3"/>` +
    person(22, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', glasses: true }) +
    tube('M32 70L40 58', SKIN, 5) +
    `<path d="M40 58L52 30" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M52 96C52 86 58 80 64 80S76 86 76 96Z" fill="#e85d9a"/><circle cx="64" cy="72" r="8" fill="${SKIN}"/><path d="M56 70C56 62 72 62 72 70Z" fill="${HAIR}"/>` +
    `<path d="M76 96C76 86 82 80 88 80S100 86 100 96Z" fill="#43b04a"/><circle cx="88" cy="72" r="8" fill="${SKIN}"/><path d="M80 70C80 62 96 62 96 70Z" fill="#2f2a26"/>`,
  배우다:
    board(8, 6, 50, 34) +
    `<circle cx="22" cy="22" r="7" stroke="#fff" stroke-width="3"/><path d="M36 30L42 14L48 30Z" stroke="#fff" stroke-width="3"/>` +
    `<path d="M76 4v5M64 10l3 4M88 10l-3 4" stroke="${HL}" stroke-width="3"/>` +
    `<circle cx="76" cy="22" r="9" fill="#ffd23f"/><rect x="72" y="30" width="8" height="5" fill="#8a96b0" stroke-width="2.5"/>` +
    person(66, 82, 1.35, { hair: HAIR, style: 'pony', shirt: '#ff9f1a' }) +
    `<rect x="30" y="76" width="66" height="8" rx="2" fill="#b5793a"/><path d="M36 84V96M90 84V96" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M50 72L64 70L64 78L50 78Z" fill="#fff" stroke-width="2.5"/><path d="M64 70L78 72L78 78L64 78Z" fill="#fff" stroke-width="2.5"/>`,
  공부하다:
    `<circle cx="86" cy="12" r="6" fill="${HL}"/><path d="M86 18L78 44" stroke="#8a96b0" stroke-width="4"/><path d="M70 12L84 4L92 22L78 26Z" fill="#3b78e6"/>` +
    person(46, 74, 1.5, { hair: HAIR, style: 'short', shirt: '#43b04a' }) +
    `<rect x="4" y="72" width="92" height="9" rx="2" fill="#b5793a"/><path d="M12 81V96M88 81V96" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M26 72L46 64V72ZM46 64L66 72H46Z" fill="#fff"/><path d="M46 64V72" stroke-width="2.5"/>` +
    `<rect x="74" y="60" width="20" height="6" fill="#e8553d" stroke-width="2.5"/><rect x="72" y="66" width="22" height="6" fill="#ffd23f" stroke-width="2.5"/><rect x="76" y="54" width="18" height="6" fill="#8e4fc9" stroke-width="2.5"/>` +
    `<path d="M58 70L68 52" stroke="#ffd23f" stroke-width="4"/>` +
    tube('M34 62L30 70', SKIN, 5),
  발표하다:
    `<path d="M48 60L42 90M78 60L84 90" stroke="#9a5b2e" stroke-width="4"/>` +
    `<rect x="40" y="10" width="46" height="52" fill="#fff"/>` +
    `<rect x="48" y="40" width="8" height="16" fill="#e8553d" stroke-width="2.5"/><rect x="60" y="30" width="8" height="26" fill="#3b78e6" stroke-width="2.5"/><rect x="72" y="20" width="8" height="36" fill="#43b04a" stroke-width="2.5"/>` +
    person(20, 80, 1.3, { hair: HAIR, style: 'pony', shirt: '#e85d9a' }) +
    tube('M28 60L44 38', SKIN, 5) +
    `<path d="M4 100C4 90 10 86 16 86S28 90 28 100Z" fill="#8a96b0"/><circle cx="16" cy="80" r="7" fill="#2f2a26"/>` +
    `<path d="M36 100C36 90 42 86 48 86S60 90 60 100Z" fill="#8a96b0"/><circle cx="48" cy="80" r="7" fill="${HAIR}"/>` +
    `<path d="M68 100C68 90 74 86 80 86S92 90 92 100Z" fill="#8a96b0"/><circle cx="80" cy="80" r="7" fill="#e8862e"/>`,
  응원하다:
    person(50, 96, 1.6, { hair: HAIR, style: 'pony', shirt: '#e8553d' }) +
    tube('M38 72L22 36M62 72L78 36', SKIN, 5) +
    blob(HL, [
      [20, 28, 9],
      [14, 20, 6],
      [26, 18, 6],
    ]) +
    blob(HL, [
      [80, 28, 9],
      [74, 18, 6],
      [86, 20, 6],
    ]) +
    `<path d="M6 44l6 2M4 56h8M94 44l-6 2M96 56h-8" stroke="${MOVE}" stroke-width="3"/>` +
    sparkle(50, 10, 6) +
    sparkle(36, 8, 4) +
    sparkle(64, 8, 4),
  경주하다:
    `<path d="M4 90H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M86 34V90" stroke-width="4"/><path d="M86 34V62" stroke="#fff" stroke-width="1"/>` +
    `<path d="M88 16V52" stroke-width="3"/><path d="M88 16H100V30H88Z" fill="#e8553d"/>` +
    `<path d="M86 42L96 50" stroke="${HL}" stroke-width="3"/>` +
    stick(62, 30, 'M0 10L-4 32M-2 16L12 26M-2 16L-16 20M-4 32L10 44L8 58M-4 32L-18 52', 0.95) +
    stickFace(62, 30) +
    stick(32, 36, 'M0 10L-4 32M-2 16L12 26M-2 16L-16 20M-4 32L10 44L8 56M-4 32L-18 50', 0.9) +
    stickFace(32, 36) +
    `<path d="M4 30h10M8 42h10M36 22h8" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M84 44L76 42" stroke="${HL}" stroke-width="4"/>` +
    `<path d="M86 38V88" stroke="${HL}" stroke-width="5" stroke-dasharray="6 6"/>`,
  이기다:
    `<rect x="36" y="58" width="28" height="38" fill="#ffd23f"/><rect x="8" y="72" width="28" height="24" fill="#b5c0d8"/><rect x="64" y="80" width="28" height="16" fill="#e8862e"/>` +
    person(50, 58, 0.95, { hair: HAIR, style: 'short', shirt: '#3b78e6' }) +
    tube('M44 44L36 26M56 44L62 30', SKIN, 4) +
    `<path d="M56 16H74C74 30 68 34 65 34S56 30 56 16Z" fill="#ffd23f"/><path d="M65 34V40M59 40H71" stroke-width="3"/>` +
    `<path d="M56 20C50 20 50 28 57 28M74 20C80 20 80 28 73 28" stroke-width="2.5"/>` +
    `<rect x="16" y="20" width="5" height="9" fill="#e85d9a" stroke="none" transform="rotate(20 18 24)"/><rect x="82" y="44" width="5" height="9" fill="#43b04a" stroke="none" transform="rotate(-20 84 48)"/>` +
    `<rect x="24" y="44" width="5" height="9" fill="#3b78e6" stroke="none" transform="rotate(-30 26 48)"/><rect x="86" y="14" width="5" height="9" fill="#e8553d" stroke="none" transform="rotate(30 88 18)"/>` +
    sparkle(30, 8, 6) +
    sparkle(84, 30, 5),
  부딪히다:
    `<path d="M4 88H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M6 76V62C6 56 10 54 14 54H22L28 44H40L44 54V76Z" fill="#3b78e6"/><path d="M30 48H38L40 54H28Z" fill="#bfe6fb" stroke-width="2.5"/>` +
    `<circle cx="16" cy="78" r="7" fill="${INK}"/><circle cx="36" cy="78" r="7" fill="${INK}"/>` +
    `<path d="M94 76V62C94 56 90 54 86 54H78L72 44H60L56 54V76Z" fill="#e8553d"/><path d="M70 48H62L60 54H72Z" fill="#bfe6fb" stroke-width="2.5"/>` +
    `<circle cx="84" cy="78" r="7" fill="${INK}"/><circle cx="64" cy="78" r="7" fill="${INK}"/>` +
    `<path d="M50 30L54 42L64 38L58 48L66 56L54 56L50 66L46 56L34 56L42 48L36 38L46 42Z" fill="${HL}"/>` +
    `<path d="M6 40h10M4 48h8M94 40H84M96 48h-8" stroke="${MOVE}" stroke-width="3"/>`,

  // ── 물건이 바뀜 ──
  떨어지다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<rect x="16" y="40" width="12" height="54" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [14, 20, 14],
      [32, 16, 14],
      [44, 30, 12],
      [22, 36, 12],
    ]) +
    `<circle cx="30" cy="24" r="4" fill="#e8553d"/><circle cx="14" cy="30" r="4" fill="#e8553d"/>` +
    apple(66, 58, 11) +
    `<path d="M58 22V38M66 18V36M74 22V38" stroke="${MOVE}" stroke-width="3"/>` +
    arrow(88, 30, 88, 86, ARROW, 5) +
    `<path d="M54 86l-4-4M78 86l4-4" stroke="${MOVE}" stroke-width="3"/>`,
  흘리다:
    `<rect x="4" y="66" width="92" height="8" rx="2" fill="#b5793a"/><path d="M14 74V94M86 74V94" stroke="#9a5b2e" stroke-width="5"/>` +
    `<g transform="rotate(62 32 44)"><path d="M20 24H44L40 62H24Z" fill="#dff2fc"/><path d="M21 34H43L40 62H24Z" fill="#ff9f1a" stroke="none"/><path d="M20 24H44L40 62H24Z"/></g>` +
    `<path d="M52 50C56 54 56 60 58 66H50Z" fill="#ff9f1a"/>` +
    `<path d="M48 66C54 60 66 64 76 62C86 60 92 62 92 66Z" fill="#ff9f1a"/>` +
    `<path d="M90 66V78" stroke="#ff9f1a" stroke-width="5"/>` +
    drop(90, 82, 0.8).replace('#4aa8f0', '#ff9f1a') +
    carrow(12, 24, 26, 10, 42, 20, ARROW, 4) +
    `<path d="M66 50l2-6M78 52l4-5" stroke="${MOVE}" stroke-width="3"/>`,
  깨지다:
    `<path d="M4 90H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M12 72C12 60 30 54 44 54L40 64L48 70L40 82C22 82 12 78 12 72Z" fill="#7ec8f0"/>` +
    `<path d="M52 50L60 56L56 66L64 72L60 82C80 80 90 76 90 70C90 60 72 52 52 50Z" fill="#7ec8f0"/>` +
    `<path d="M44 76L52 72L54 82Z" fill="#7ec8f0"/>` +
    `<path d="M18 70C22 64 30 62 36 62M64 62C72 62 80 66 84 70" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 18V34M30 26l8 10M70 26l-8 10M18 44l10 4M82 44l-10 4" stroke="#ff9f1a" stroke-width="4"/>` +
    `<path d="M30 88l4-4M74 86l6-2" stroke="${MOVE}" stroke-width="3"/>`,
  찢어지다:
    `<g transform="rotate(-10 30 50)"><path d="M10 14H46L40 26L48 36L40 46L48 58L40 70L46 86H10Z" fill="#fff"/><path d="M16 26H34M16 38H32M16 50H32M16 62H32" stroke="#7ec8f0" stroke-width="3"/></g>` +
    `<g transform="rotate(10 70 50)"><path d="M56 14H90V86H62L56 70L64 58L56 46L64 36L56 26Z" fill="#fff"/><path d="M68 26H84M70 38H84M70 50H84M70 62H84" stroke="#7ec8f0" stroke-width="3"/></g>` +
    arrow(18, 94, 4, 94, ARROW, 4) +
    arrow(82, 94, 96, 94, ARROW, 4) +
    `<path d="M50 6l-3 5M54 12l4 3" stroke="${MOVE}" stroke-width="3"/>`,
  녹다:
    `<circle cx="84" cy="14" r="9" fill="#ffd23f"/><path d="M84 28v4M70 14h-4M73 4l-3-3M95 24l3 3" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M34 50L50 92L66 50Z" fill="#e8b36a"/><path d="M40 60L60 60M44 72L56 72" stroke="#b5793a" stroke-width="2.5"/>` +
    `<path d="M28 50C24 30 38 22 50 22S76 30 72 50C72 56 66 54 66 60C66 66 60 66 60 60V54C58 52 52 52 50 56V66C50 72 44 72 44 66V56C40 54 36 56 34 60C34 64 28 64 28 58Z" fill="#ff9aa8"/>` +
    `<ellipse cx="50" cy="92" rx="24" ry="4" fill="#ff9aa8"/>` +
    `<circle cx="22" cy="80" r="4" fill="#ff9aa8"/><circle cx="76" cy="86" r="3" fill="#ff9aa8"/>` +
    `<path d="M44 32C40 34 38 38 38 42" stroke="#fff" stroke-width="3"/>`,
  얼다:
    drop(18, 38, 1.6) +
    arrow(34, 56, 48, 56, ARROW, 5) +
    `<rect x="56" y="30" width="36" height="36" rx="6" fill="#bfe6fb"/><path d="M62 38L70 36M62 46V52" stroke="#fff" stroke-width="4"/>` +
    `<path d="M56 40L92 40" stroke="#7ec8f0" stroke-width="1"/>` +
    flake(74, 16, 6) +
    flake(92, 80, 6) +
    flake(56, 82, 5) +
    flake(20, 84, 6) +
    `<path d="M4 94H96" stroke="#7ec8f0" stroke-width="4"/>`,
  자라다:
    `<path d="M4 96H96" stroke="#c9b28a" stroke-width="3"/>` +
    pot(16, 76, 20) +
    `<path d="M16 72V64" stroke="#43b04a" stroke-width="4"/><path d="M16 66C10 60 8 58 8 58C14 58 16 62 16 66Z" fill="#5fc24a" stroke-width="2.5"/>` +
    pot(46, 76, 22) +
    `<path d="M46 72V46" stroke="#43b04a" stroke-width="4"/><path d="M46 58C36 56 32 48 34 46C42 46 46 52 46 58ZM46 52C56 50 60 42 58 40C50 40 46 46 46 52Z" fill="#5fc24a" stroke-width="2.5"/>` +
    pot(80, 76, 26) +
    `<path d="M80 72V26" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M80 60C68 58 64 50 66 48C74 48 80 54 80 60ZM80 48C92 46 96 38 94 36C86 36 80 42 80 48ZM80 38C70 34 68 28 70 26C76 26 80 32 80 38Z" fill="#5fc24a" stroke-width="2.5"/>` +
    flower(80, 18, 6, '#ff9aa8') +
    carrow(12, 40, 34, 16, 60, 14, ARROW, 4),
  피다:
    `<path d="M50 94V52" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M50 80C38 80 30 72 30 66C40 66 48 72 50 80ZM50 74C62 74 70 66 70 60C60 60 52 66 50 74Z" fill="#5fc24a" stroke-width="3"/>` +
    flower(50, 36, 15, '#ff5c70') +
    sparkle(16, 20, 7) +
    sparkle(86, 16, 6) +
    sparkle(86, 58, 5) +
    `<path d="M20 44l-8 4M80 44l8 4M24 60l-8 6M76 60l8 6M50 8V2" stroke="${HL}" stroke-width="4"/>`,
  시들다:
    pot(50, 76, 34) +
    `<path d="M50 72C50 50 56 30 70 30C80 30 82 42 78 50" stroke="#a8a060" stroke-width="5"/>` +
    `<path d="M50 62C40 62 34 70 32 72C40 74 48 70 50 62Z" fill="#b5ad6a" stroke-width="3"/>` +
    `<g transform="rotate(160 78 56)"><circle cx="78" cy="46" r="6" fill="#b58a8a"/><circle cx="70" cy="52" r="6" fill="#b58a8a"/><circle cx="86" cy="52" r="6" fill="#b58a8a"/><circle cx="78" cy="54" r="6" fill="#c9a86a"/></g>` +
    `<path d="M22 44C26 40 32 42 30 48C26 52 20 50 22 44Z" fill="#b58a8a"/><path d="M30 26C34 22 40 24 38 30C34 34 28 32 30 26Z" fill="#b58a8a"/>` +
    arrow(88, 64, 88, 88, ARROW, 4) +
    `<path d="M24 58q4 4 0 8" stroke="${MOVE}" stroke-width="3"/>`,
  날리다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M74 4L92 22L74 44L56 22Z" fill="#e8553d"/><path d="M74 4V44M56 22H92" stroke-width="2.5"/><path d="M56 22L74 4L74 22Z" fill="#ffd23f" stroke-width="2.5"/><path d="M74 22L92 22L74 44Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M74 44C70 52 78 56 72 62C68 66 74 70 70 74" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M74 44Q44 50 30 66" stroke="${INK}" stroke-width="2"/>` +
    stick(22, 58, 'M0 10V26M0 16L10 8M0 16L-8 26M0 26L-6 38M0 26L6 38', 0.95) +
    stickFace(22, 58) +
    `<path d="M8 20h18M14 30h16M34 10h14" stroke="${MOVE}" stroke-width="3"/>`,
  흩어지다:
    mini(50, 44, '#e8553d') +
    mini(20, 20, '#3b78e6') +
    mini(80, 20, '#43b04a') +
    mini(14, 64, '#ffc933') +
    mini(86, 64, '#8e4fc9') +
    arrow(42, 48, 30, 38, ARROW, 4) +
    arrow(58, 48, 70, 38, ARROW, 4) +
    arrow(42, 64, 28, 72, ARROW, 4) +
    arrow(58, 64, 72, 72, ARROW, 4),
  모이다:
    `<circle cx="50" cy="62" r="30" fill="#fff1b8" stroke="${HL}" stroke-width="4" stroke-dasharray="7 5"/>` +
    mini(38, 44, '#3b78e6') +
    mini(62, 44, '#43b04a') +
    mini(50, 50, '#e8553d') +
    arrow(6, 20, 20, 32, ARROW, 4) +
    arrow(94, 20, 80, 32, ARROW, 4) +
    arrow(6, 88, 20, 78, ARROW, 4) +
    arrow(94, 88, 80, 78, ARROW, 4),
  빛나다:
    `<path d="M50 20L58 38L78 40L63 53L68 73L50 62L32 73L37 53L22 40L42 38Z" fill="#ffd23f"/>` +
    `<path d="M50 4V12M88 30l-7 4M88 76l-7-4M12 30l7 4M12 76l7-4M50 96V84" stroke="${HL}" stroke-width="5"/>` +
    sparkle(84, 10, 7) +
    sparkle(16, 12, 6) +
    sparkle(80, 92, 5) +
    sparkle(18, 90, 5) +
    `<path d="M44 38l4-6" stroke="#fff" stroke-width="3"/>`,
  흔들리다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M44 94C46 76 48 64 58 50H66C58 62 56 78 58 94Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [60, 30, 16],
      [76, 34, 14],
      [48, 38, 13],
      [66, 46, 12],
    ]) +
    `<path d="M6 26h20M10 38h22M4 50h16" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M92 22C96 30 96 40 92 48M84 58C88 62 88 68 84 72" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M22 64C28 60 34 62 30 68" stroke="#43b04a" stroke-width="3"/><path d="M14 76C20 72 26 74 22 80" stroke="#43b04a" stroke-width="3"/>`,
  떨리다:
    person(50, 94, 1.6, { hair: HAIR, style: 'short', shirt: '#7ec8f0' }) +
    `<rect x="36" y="62" width="28" height="20" rx="2" fill="#fff" transform="rotate(-6 50 72)"/>` +
    tube('M36 74L30 80M64 74L70 80', SKIN, 4) +
    shake(16, 30, -1, 4) +
    shake(84, 30, 1, 4) +
    shake(24, 64, -1, 2) +
    shake(76, 64, 1, 2) +
    drop(72, 22, 0.8),
};
