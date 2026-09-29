// 그림 묶음: 7~8세 직업·사람 (일하는 사람, 운동선수, 옛이야기 속 인물, 결혼식). 직업은 옷과 도구로 구별한다. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, blob, sparkle, tube, cheeks, person, halo } from '../pictureKit.ts';

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
const hand = (x: number, y: number, r = 5, fill = SKIN) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

/** 음표 */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 부채꼴 (부채): 꼭지 (px, py), 반지름 r, 각도 a0→a1 (도, 0 = 오른쪽, 시계 방향) */
function fan(px: number, py: number, r: number, a0: number, a1: number, fill: string, rib: string): string {
  const pt = (a: number, rr: number) => {
    const t = (a * Math.PI) / 180;
    return `${f1(px + rr * Math.cos(t))} ${f1(py + rr * Math.sin(t))}`;
  };
  const ribs = [1, 2, 3, 4].map((k) => `M${px} ${py}L${pt(a0 + ((a1 - a0) * k) / 5, r * 0.92)}`).join('');
  return (
    `<path d="M${px} ${py}L${pt(a0, r)}A${r} ${r} 0 0 1 ${pt(a1, r)}Z" fill="${fill}"/>` +
    `<path d="M${pt(a0, r * 0.8)}A${r * 0.8} ${r * 0.8} 0 0 1 ${pt(a1, r * 0.8)}" stroke="${rib}" stroke-width="4"/>` +
    `<path d="${ribs}" stroke="${rib}" stroke-width="1.8"/>`
  );
}

/** 종이 상자 (택배) */
const box = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#d9a066"/>` +
  `<path d="M${x + w / 2} ${y}V${y + h * 0.45}" stroke="#f2e2b0" stroke-width="5"/>` +
  `<path d="M${x} ${y + h * 0.18}H${x + w}" stroke="#b5793a" stroke-width="2.5"/>`;

/** 흰 가운 옷깃 (의사·약사·과학자): 가운데 x, 목 y, 크기 s */
const coat = (x: number, y: number, s: number, inner = '#7ec8f0') =>
  `<path d="M${x - 5 * s} ${y}L${x} ${y + 10 * s}L${x + 5 * s} ${y}Z" fill="${inner}" stroke-width="2.5"/>` +
  `<path d="M${x} ${y + 10 * s}V${y + 20 * s}" stroke-width="2.5"/>`;

/** 나비넥타이 */
const bowtie = (x: number, y: number, fill: string) =>
  `<path d="M${x} ${y}L${x - 9} ${y - 5}V${y + 5}ZM${x} ${y}L${x + 9} ${y - 5}V${y + 5}Z" fill="${fill}" stroke-width="2.5"/>` +
  `<circle cx="${x}" cy="${y}" r="2.6" fill="${fill}" stroke-width="2.5"/>`;

/** 챙 넓은 밀짚모자: 가운데 x, 챙 y, 챙 반폭 w */
const strawHat = (x: number, y: number, w: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${f1(w * 0.2)}" fill="#f2d49a"/>` +
  `<path d="M${x - w * 0.52} ${y}C${x - w * 0.52} ${y - w * 0.62} ${x + w * 0.52} ${y - w * 0.62} ${x + w * 0.52} ${y}Z" fill="#f2d49a"/>` +
  `<path d="M${x - w * 0.52} ${y - 3}H${x + w * 0.52}" stroke="#e8553d" stroke-width="4"/>`;

export const PICS: Record<string, string> = {
  // ── 지키고 돕는 사람 ──
  경찰관:
    person(40, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M38 65H42L43.5 76L40 80L36.5 76Z" fill="#26356b" stroke-width="2"/>` +
    `<path d="M16 28C14 16 66 16 64 28L60 34H20Z" fill="#26356b"/>` +
    `<rect x="20" y="31" width="40" height="6" fill="#1d2340"/>` +
    `<path d="M22 37C28 43 52 43 58 37Z" fill="#1d2340"/>` +
    star(40, 25, 6, '#ffc933') +
    star(53, 80, 5.5, '#ffc933') +
    tube('M56 76L76 50', '#3b78e6', 7) +
    `<path d="M70 44C68 34 72 28 76 30L78 22C80 18 84 20 83 25L84 20C86 16 90 18 88 24L88 28C92 26 94 30 91 34C88 42 84 48 78 50Z" fill="#fff"/>` +
    `<path d="M84 10q6 2 8 8M88 4q8 3 10 12" stroke="#9aa6c4" stroke-width="2.5"/>`,
  구조대원:
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    `<path d="M29 40C29 12 71 12 71 40Z" fill="#fff"/><path d="M24 40H76" stroke-width="6"/><path d="M24 40H76" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M44 16H56V36H44Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="44" y="26" width="12" height="7" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M29 82H71M28 90H72" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="78" cy="76" r="14" stroke-width="17"/><circle cx="78" cy="76" r="14" stroke="#fff" stroke-width="10"/>` +
    `<circle cx="78" cy="76" r="14" stroke="#e8553d" stroke-width="10" stroke-dasharray="11 11"/>` +
    hand(66, 82, 5.5),
  경비원:
    `<path d="M60 94V36H94V94Z" fill="#dfe8f5"/><rect x="56" y="28" width="42" height="9" rx="2" fill="#3b78e6"/>` +
    `<rect x="64" y="42" width="26" height="22" rx="2" fill="#bfe6ff"/><path d="M77 42V64" stroke-width="2.5"/>` +
    `<path d="M62 70H92" stroke="#3b78e6" stroke-width="4"/>` +
    person(34, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#26356b', cap: '#26356b' }) +
    `<path d="M34 72V96" stroke="#ffc933" stroke-width="3"/>` +
    star(34, 34, 4.5, '#ffc933', 2) +
    `<path d="M20 74h6v6h-6Z" fill="#ffc933" stroke-width="2"/>` +
    `<path d="M4 94H96" stroke="#c9b28a"/>`,
  // ── 알리고 만드는 사람 ──
  기자:
    person(32, 96, 1.45, { hair: '#5a3b24', style: 'short', shirt: '#26356b' }) +
    `<path d="M27 67L32 77L37 67Z" fill="#fff" stroke-width="2.5"/><path d="M32 69L30 84L32 88L34 84Z" fill="#e8553d" stroke-width="2"/>` +
    tube('M46 78L60 66', '#26356b', 6) +
    tube('M62 64L72 54', '#2f2a26', 4) +
    `<rect x="62" y="54" width="10" height="9" fill="#3b8fe0" stroke-width="2.5" transform="rotate(-45 67 58)"/>` +
    `<circle cx="75" cy="50" r="6.5" fill="#8a96b0"/>` +
    hand(61, 65, 5) +
    `<rect x="4" y="70" width="14" height="18" rx="2" fill="#fff" transform="rotate(-10 11 79)"/><path d="M7 76h8M7 81h8" stroke="#9aa6c4" stroke-width="2"/>` +
    hand(16, 86, 4.5) +
    person(84, 96, 0.95, { hair: '#2f2a26', style: 'pony', shirt: '#ffd23f' }) +
    `<path d="M76 20q4-4 8 0M86 16q3-3 6 0" stroke="#9aa6c4" stroke-width="2.5"/>`,
  사진사:
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<path d="M32 60L50 80L68 60" stroke="#6b3e26" stroke-width="3"/>` +
    `<rect x="34" y="28" width="14" height="8" rx="2" fill="#4a4f66"/>` +
    `<rect x="60" y="30" width="8" height="6" rx="1" fill="#fff"/>` +
    `<rect x="22" y="34" width="56" height="30" rx="5" fill="#4a4f66"/>` +
    `<circle cx="52" cy="49" r="12" fill="#8a96b0"/><circle cx="52" cy="49" r="6.5" fill="#3b8fe0"/>` +
    dot(49, 46, 2, '#fff') +
    hand(22, 56, 5.5) +
    hand(78, 56, 5.5) +
    `<path d="M64 24L60 16M72 24L74 14M78 30L86 24" stroke="${HL}" stroke-width="4"/>` +
    sparkle(84, 14, 7, '#ffd23f'),
  작가:
    `<rect x="4" y="46" width="22" height="7" rx="1" fill="#3b78e6"/><rect x="6" y="53" width="20" height="7" rx="1" fill="#e8553d"/><rect x="4" y="60" width="22" height="8" rx="1" fill="#43b04a"/>` +
    person(50, 80, 1.4, { hair: '#6b3e26', style: 'short', shirt: '#8e4fc9', glasses: true }) +
    `<path d="M2 68H98V94H2Z" fill="#b5793a"/><path d="M2 76H98" stroke="#8a5a34" stroke-width="2.5"/>` +
    `<path d="M30 64L64 60L68 84L34 88Z" fill="#fff"/>` +
    `<path d="M36 70L60 67M37 76L61 73M38 82L54 80" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M66 72C66 56 76 38 94 30C92 46 84 62 70 72Z" fill="#fff"/><path d="M66 76L86 42" stroke-width="2.5"/>` +
    hand(68, 72, 5.5),
  // ── 음악 ──
  음악가:
    note(14, 30, '#8e4fc9') +
    note(84, 18, '#3b78e6') +
    person(46, 96, 1.5, { hair: '#6b3e26', style: 'long', shirt: '#43b04a' }) +
    tube('M50 76L86 44', '#8a5a34', 5) +
    `<rect x="82" y="34" width="10" height="14" rx="2" fill="#6b3e26" transform="rotate(48 87 41)"/>` +
    `<path d="M26 84C18 74 26 62 36 66C40 58 54 60 54 70C62 74 60 90 48 92C40 96 28 94 26 84Z" fill="#ff9f1a"/>` +
    `<circle cx="42" cy="78" r="5" fill="#6b3e26"/>` +
    `<path d="M36 86L40 84" stroke-width="3"/>` +
    hand(70, 60, 5) +
    hand(38, 90, 5),
  피아니스트:
    note(12, 20, '#8e4fc9') +
    note(84, 16, '#3b78e6') +
    person(50, 68, 1.3, { hair: '#2f2a26', style: 'short', shirt: '#2f2a26' }) +
    `<path d="M45 48L50 58L55 48Z" fill="#fff" stroke-width="2"/>` +
    bowtie(50, 50, '#e8553d') +
    `<rect x="4" y="62" width="92" height="32" rx="3" fill="#2f2a26"/>` +
    `<rect x="9" y="66" width="82" height="18" fill="#fff" stroke-width="2.5"/>` +
    [19, 29, 39, 49, 59, 69, 79].map((x) => `<path d="M${x + 1} 66V84" stroke-width="2"/>`).join('') +
    [18, 28, 48, 58, 68].map((x) => `<rect x="${x}" y="66" width="5" height="10" fill="${INK}" stroke="none"/>`).join('') +
    hand(34, 66, 5) +
    hand(66, 66, 5),
  바이올리니스트:
    note(12, 24, '#8e4fc9') +
    note(88, 84, '#3b78e6') +
    person(40, 96, 1.55, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    `<g transform="translate(62 62) rotate(-22) scale(1.35)" stroke-width="2.6">` +
    tube('M14 0H34', '#6b3e26', 4) +
    `<circle cx="37" cy="0" r="4" fill="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M-18 0C-18 -10 -12 -12 -6 -9C-2 -7 2 -7 4 -8C10 -11 16 -8 16 0C16 8 10 11 4 8C2 7 -2 7 -6 9C-12 12 -18 10 -18 0Z" fill="#c9702e"/>` +
    `<path d="M-14 0H30" stroke="#f2d49a" stroke-width="2"/>` +
    `<path d="M-4 -4v8M6 -4v8" stroke="#6b3e26" stroke-width="2"/>` +
    `</g>` +
    tube('M30 90L80 38', '#8a5a34', 2.5) +
    hand(90, 44, 5) +
    hand(34, 86, 5),
  // ── 배우고 가르치는 사람 ──
  과학자:
    blob('#dfe8f5', [
      [24, 34, 7],
      [56, 34, 7],
      [28, 24, 7],
      [52, 24, 7],
      [40, 20, 8],
    ]) +
    person(40, 96, 1.5, { hair: '#dfe8f5', style: 'short', shirt: '#fff', glasses: true }) +
    coat(40, 66, 1.3) +
    `<path d="M24 34H56" stroke="#7ec8f0" stroke-width="4"/>` +
    `<path d="M72 40V54L60 80C58 85 60 88 65 88H89C94 88 96 85 94 80L82 54V40Z" fill="#dff4ff"/>` +
    `<path d="M64 72H90L94 80C96 85 94 88 89 88H65C60 88 58 85 60 80Z" fill="#5fc24a"/>` +
    `<rect x="69" y="36" width="16" height="6" rx="2" fill="#dff4ff"/>` +
    `<circle cx="74" cy="26" r="4" fill="#dff4ff" stroke="#5fc24a" stroke-width="2.5"/><circle cx="84" cy="16" r="5" fill="#dff4ff" stroke="#5fc24a" stroke-width="2.5"/><circle cx="76" cy="8" r="3" fill="#dff4ff" stroke="#5fc24a" stroke-width="2"/>` +
    hand(62, 82, 5.5),
  교장선생님:
    person(50, 70, 1.35, { hair: '#c9c9d1', style: 'bald', shirt: '#26356b', glasses: true, mustache: true }) +
    `<path d="M45 44L50 52L55 44Z" fill="#fff" stroke-width="2"/><path d="M50 46L48 58L50 62L52 58Z" fill="#e8553d" stroke-width="2"/>` +
    tube('M64 62L60 50', '#4a4f66', 2.5) +
    `<ellipse cx="59" cy="47" rx="3.5" ry="4.5" fill="#4a4f66"/>` +
    `<path d="M22 62H78L72 96H28Z" fill="#b5793a"/><path d="M18 60H82V67H18Z" fill="#9a5b2e"/>` +
    `<circle cx="50" cy="80" r="8" fill="#ffc933" stroke-width="3"/>` +
    star(50, 80, 5, '#fff', 2) +
    tube('M28 62L24 52', '#5fc24a', 3) +
    `<circle cx="23" cy="47" r="7" fill="#ff5c70"/><circle cx="23" cy="47" r="3" fill="#ffd23f" stroke-width="2"/>`,
  // ── 운전하는 사람 ──
  버스기사:
    `<rect x="8" y="4" width="84" height="80" rx="10" fill="#43b04a"/>` +
    `<rect x="22" y="8" width="56" height="7" rx="2" fill="#2f2a26" stroke-width="2.5"/>` +
    `<rect x="14" y="18" width="72" height="44" rx="4" fill="#bfe6ff"/>` +
    person(42, 62, 1.05, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#26356b' }) +
    `<ellipse cx="50" cy="58" rx="15" ry="5" stroke-width="8"/><ellipse cx="50" cy="58" rx="15" ry="5" stroke="#4a4f66" stroke-width="3.5"/>` +
    hand(36, 58, 4) +
    hand(64, 58, 4) +
    `<rect x="14" y="18" width="72" height="44" rx="4"/>` +
    `<circle cx="22" cy="72" r="5" fill="#ffe066"/><circle cx="78" cy="72" r="5" fill="#ffe066"/>` +
    `<rect x="38" y="68" width="24" height="8" rx="2" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<rect x="14" y="84" width="14" height="10" rx="3" fill="${INK}"/><rect x="72" y="84" width="14" height="10" rx="3" fill="${INK}"/>` +
    `<path d="M8 24H3V38" stroke-width="3"/><path d="M92 24H97V38" stroke-width="3"/>`,
  택시기사:
    `<path d="M40 90V70C40 66 43 64 48 63L56 50C58 47 61 46 64 46H80C83 46 86 48 88 51L94 63C96 64 97 66 97 70V90Z" fill="#ff9f1a"/>` +
    `<rect x="66" y="37" width="16" height="9" rx="2" fill="#fff"/>` +
    `<path d="M58 62L63 52H71V62Z" fill="#bfe6ff" stroke-width="2.5"/><path d="M76 62V52H84L89 62Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M41 76H96" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="54" cy="90" r="7" fill="#4a4f66"/><circle cx="84" cy="90" r="7" fill="#4a4f66"/>` +
    `<circle cx="54" cy="90" r="2.5" fill="#dfe8f5" stroke="none"/><circle cx="84" cy="90" r="2.5" fill="#dfe8f5" stroke="none"/>` +
    person(26, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#fff', cap: '#26356b' }) +
    `<path d="M21 67L26 77L31 67Z" fill="#3b78e6" stroke-width="2"/>` +
    tube('M40 78L48 70', '#fff', 6) +
    hand(49, 69, 5),
  기관사:
    `<path d="M4 90H96" stroke="#8a5a34" stroke-width="4"/><path d="M12 90v6M28 90v6M44 90v6M60 90v6M76 90v6M92 90v6" stroke="#8a5a34" stroke-width="4"/>` +
    `<path d="M14 86V34C14 16 30 6 50 6S86 16 86 34V86Z" fill="#3b78e6"/>` +
    `<path d="M22 56V34C22 22 34 14 50 14S78 22 78 34V56Z" fill="#bfe6ff"/>` +
    person(50, 56, 1.0, { hair: '#2f2a26', style: 'short', shirt: '#26356b', cap: '#26356b' }) +
    `<path d="M40 22H60" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M22 56V34C22 22 34 14 50 14S78 22 78 34V56Z"/>` +
    `<path d="M14 64H86" stroke="#fff" stroke-width="5"/>` +
    `<circle cx="26" cy="76" r="5.5" fill="#ffe066"/><circle cx="74" cy="76" r="5.5" fill="#ffe066"/>` +
    `<rect x="40" y="72" width="20" height="8" rx="2" fill="#dfe8f5" stroke-width="2.5"/>`,
  승무원:
    `<path d="M62 18L94 10L96 14L66 24Z" fill="#fff" stroke-width="2.5"/><path d="M78 14L70 4H74L86 12Z" fill="#fff" stroke-width="2.5"/><path d="M78 20L74 28H78L86 18Z" fill="#fff" stroke-width="2.5"/>` +
    person(40, 96, 1.55, { hair: '#2f2a26', style: 'bun', shirt: '#26356b' }) +
    `<path d="M29 22C29 16 51 16 51 22V26H29Z" fill="#26356b"/><path d="M29 24H51" stroke="#ffc933" stroke-width="2.5"/>` +
    `<path d="M32 64L40 74L48 64L44 62L40 66L36 62Z" fill="#e8553d" stroke-width="2.5"/><path d="M40 70L36 80L40 78L44 80Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M30 80h4M46 80h4" stroke="#ffc933" stroke-width="3"/>` +
    `<path d="M70 58V44H82V58" stroke-width="4"/>` +
    `<rect x="62" y="56" width="28" height="34" rx="5" fill="#e85d9a"/><path d="M70 62V84M82 62V84" stroke="#b83c78" stroke-width="3"/>` +
    `<circle cx="68" cy="93" r="3" fill="${INK}"/><circle cx="84" cy="93" r="3" fill="${INK}"/>` +
    tube('M54 78L66 50', '#26356b', 6) +
    hand(70, 44, 5),
  // ── 동물과 함께 ──
  목동:
    tube('M14 94V30C14 20 28 18 28 28', '#9a5b2e', 4) +
    person(36, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#e8862e' }) +
    strawHat(36, 38, 22) +
    tube('M22 76L16 70', '#e8862e', 6) +
    hand(15, 68, 5) +
    blob('#fff', [
      [66, 70, 9],
      [78, 66, 9],
      [88, 72, 8],
      [70, 82, 9],
      [84, 82, 9],
    ]) +
    `<path d="M68 88v6M84 88v6" stroke-width="4"/>` +
    `<ellipse cx="60" cy="68" rx="7" ry="9" fill="#4a4f66"/><ellipse cx="54" cy="62" rx="5" ry="2.5" fill="#4a4f66" transform="rotate(-30 54 62)"/>` +
    dot(58, 67, 1.8, '#fff'),
  사육사:
    `<path d="M76 94C74 72 76 50 74 30" stroke-width="18"/><path d="M76 94C74 72 76 50 74 30" stroke="#ffc933" stroke-width="11"/>` +
    `<ellipse cx="72" cy="80" rx="3" ry="4" fill="#c98f52" stroke="none"/><ellipse cx="77" cy="62" rx="3" ry="4" fill="#c98f52" stroke="none"/><ellipse cx="73" cy="46" rx="3" ry="4" fill="#c98f52" stroke="none"/>` +
    `<path d="M78 16V8M84 18V10" stroke-width="3"/><circle cx="78" cy="7" r="2.5" fill="#c98f52" stroke-width="2"/><circle cx="84" cy="9" r="2.5" fill="#c98f52" stroke-width="2"/>` +
    `<path d="M88 22C94 22 96 26 92 28" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M62 24C62 14 72 12 80 14C88 16 92 22 88 30C84 36 74 36 66 34C62 32 62 28 62 24Z" fill="#ffc933"/>` +
    dot(76, 22, 2.5) +
    `<ellipse cx="64" cy="28" rx="2" ry="1.4" fill="${INK}" stroke="none"/>` +
    person(32, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#b59a5a' }) +
    `<path d="M14 40C14 34 22 32 32 32S50 34 50 40Z" fill="#b59a5a"/><path d="M18 34C18 20 46 20 46 34Z" fill="#b59a5a"/>` +
    `<path d="M26 72V94M38 72V94" stroke="#8a7440" stroke-width="3"/>` +
    tube('M44 74L56 40', '#b59a5a', 6) +
    `<path d="M54 40C50 30 54 24 60 26C62 32 60 36 54 40Z" fill="#43b04a"/><path d="M58 40C62 32 68 32 70 36C66 40 62 42 58 40Z" fill="#5fc24a"/>` +
    hand(56, 40, 5),
  수의사:
    person(50, 96, 1.6, { hair: '#6b3e26', style: 'pony', shirt: '#fff' }) +
    coat(50, 64, 1.3) +
    `<path d="M40 70C38 80 44 84 50 80" stroke-width="7"/><path d="M40 70C38 80 44 84 50 80" stroke="#5a6378" stroke-width="2.5"/>` +
    `<ellipse cx="60" cy="86" rx="16" ry="10" fill="#e0a458"/>` +
    `<ellipse cx="62" cy="72" rx="12" ry="11" fill="#e0a458"/>` +
    `<ellipse cx="51" cy="72" rx="4.5" ry="9" fill="#9a5b2e" transform="rotate(20 51 72)"/><ellipse cx="73" cy="72" rx="4.5" ry="9" fill="#9a5b2e" transform="rotate(-20 73 72)"/>` +
    dot(58, 71, 2.2) +
    dot(66, 71, 2.2) +
    `<ellipse cx="62" cy="77" rx="3" ry="2" fill="${INK}" stroke="none"/><path d="M59 81q3 2 6 0" stroke-width="2"/>` +
    `<circle cx="50" cy="82" r="4" fill="#dfe8f5" stroke-width="3"/>` +
    hand(30, 86, 5) +
    hand(78, 88, 5),
  약사:
    `<rect x="58" y="6" width="38" height="56" rx="2" fill="#f2d49a"/><path d="M58 26H96M58 44H96" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="62" y="14" width="8" height="12" rx="2" fill="#7ec8f0" stroke-width="2.5"/><rect x="74" y="16" width="8" height="10" rx="2" fill="#ff9aa8" stroke-width="2.5"/><rect x="86" y="12" width="7" height="14" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="62" y="32" width="9" height="12" rx="2" fill="#fff" stroke-width="2.5"/><rect x="75" y="34" width="8" height="10" rx="2" fill="#ffd23f" stroke-width="2.5"/><rect x="86" y="32" width="7" height="12" rx="2" fill="#7ec8f0" stroke-width="2.5"/>` +
    person(34, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#fff', glasses: true }) +
    coat(34, 66, 1.3) +
    `<g transform="rotate(-35 70 78)"><path d="M58 78a8 8 0 0 1 8 -8H70V86H66a8 8 0 0 1 -8 -8Z" fill="#e8553d"/><path d="M70 70H74a8 8 0 0 1 0 16H70Z" fill="#fff"/></g>` +
    hand(58, 86, 5) +
    `<path d="M14 10h8v8h8v8h-8v8h-8v-8h-8v-8h8Z" fill="#43b04a" stroke-width="2.5"/>`,
  치과의사:
    person(32, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    coat(32, 67, 1.2) +
    `<circle cx="32" cy="32" r="6" fill="#dfe8f5" stroke-width="3"/><path d="M20 34C24 30 40 30 44 34" stroke-width="2.5"/>` +
    `<path d="M24 54H40V60C36 62 28 62 24 60Z" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M58 20C66 14 74 18 76 20C78 18 86 14 94 20C98 28 94 44 92 52C90 62 88 76 84 76C80 76 80 60 76 60C72 60 72 76 68 76C64 76 62 62 60 52C58 44 54 28 58 20Z" fill="#fff"/>` +
    dot(68, 36, 2.5) +
    dot(84, 36, 2.5) +
    `<path d="M71 44q5 4 10 0" stroke-width="2.5"/>` +
    cheeks(42, 11, 76) +
    sparkle(92, 8, 5) +
    tube('M50 76L60 56', '#8a96b0', 2.5) +
    `<circle cx="62" cy="52" r="4.5" fill="#dfe8f5" stroke-width="2.5"/>` +
    hand(50, 78, 5),
  한의사:
    person(36, 96, 1.5, { hair: '#dfe8f5', style: 'short', shirt: '#fff', beard: '#dfe8f5', glasses: true }) +
    coat(36, 66, 1.3) +
    `<rect x="58" y="8" width="38" height="86" rx="2" fill="#b5793a"/>` +
    [16, 34, 52, 70]
      .map((y) => `<rect x="61" y="${y}" width="15" height="14" fill="#e0b27a" stroke-width="2.5"/><rect x="78" y="${y}" width="15" height="14" fill="#e0b27a" stroke-width="2.5"/>` + dot(68.5, y + 7, 1.8) + dot(85.5, y + 7, 1.8))
      .join('') +
    `<path d="M50 50C46 46 44 40 48 38C50 42 52 44 54 44C56 40 60 40 60 44C58 48 56 50 54 50Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M50 50C46 58 48 68 44 78M52 60L58 66M48 66L42 70M46 74L50 82" stroke-width="7"/>` +
    `<path d="M50 50C46 58 48 68 44 78M52 60L58 66M48 66L42 70M46 74L50 82" stroke="#f2d49a" stroke-width="3.5"/>` +
    dot(51, 40, 2.8, '#e8553d') +
    hand(50, 58, 5),
  // ── 가게에서 ──
  바리스타:
    `<ellipse cx="86" cy="86" rx="4" ry="5" fill="#6b3e26" transform="rotate(30 86 86)"/><ellipse cx="94" cy="78" rx="3.5" ry="4.5" fill="#6b3e26" transform="rotate(-20 94 78)"/>` +
    person(36, 96, 1.5, { hair: '#6b3e26', style: 'pony', shirt: '#fff' }) +
    `<path d="M24 72H48V96H24Z" fill="#6b3e26"/><path d="M26 72L30 64M46 72L42 64" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M58 54H86L82 80C82 84 80 86 76 86H68C64 86 62 84 62 80Z" fill="#fff"/>` +
    `<path d="M86 60C94 60 94 72 84 72" stroke-width="4"/>` +
    `<ellipse cx="72" cy="54" rx="14" ry="4" fill="#9a5b2e"/>` +
    `<path d="M72 57C68 53 70 50 72 52C74 50 76 53 72 57Z" fill="#fff" stroke="none"/>` +
    `<path d="M54 88H90" stroke-width="5"/>` +
    `<path d="M66 44q-4-6 0-12M78 44q-4-6 0-12" stroke="#9aa6c4" stroke-width="3"/>` +
    tube('M48 80L58 74', '#fff', 6) +
    hand(60, 74, 5),
  웨이터:
    `<path d="M58 34H96" stroke-width="5"/><path d="M60 34C60 20 94 20 94 34Z" fill="#dfe8f5"/><circle cx="77" cy="20" r="3" fill="#dfe8f5" stroke-width="2.5"/>` +
    person(34, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M20 96C18 82 20 72 26 68L34 84L42 68C48 72 50 82 48 96Z" fill="#2f2a26"/>` +
    bowtie(34, 68, '#2f2a26') +
    dot(34, 80, 1.8, '#fff') +
    dot(34, 88, 1.8, '#fff') +
    tube('M48 76L66 50L72 38', '#fff', 6) +
    hand(72, 38, 5) +
    `<path d="M12 72H24V92L18 88L12 92Z" fill="#fff"/>`,
  // ── 배달하고 청소하는 사람 ──
  우편배달부:
    `<rect x="70" y="40" width="24" height="54" rx="3" fill="#e8553d"/><path d="M70 50C70 36 94 36 94 50Z" fill="#e8553d"/><rect x="74" y="54" width="16" height="5" rx="2" fill="${INK}"/>` +
    person(36, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#43b04a', cap: '#e8553d' }) +
    `<path d="M22 68L50 90" stroke="#6b3e26" stroke-width="5"/>` +
    `<rect x="8" y="76" width="22" height="18" rx="3" fill="#b5793a"/><path d="M8 76H30V83C24 86 14 86 8 83Z" fill="#9a5b2e"/>` +
    tube('M50 78L60 64', '#43b04a', 6) +
    `<rect x="54" y="48" width="22" height="15" fill="#fff" transform="rotate(-12 65 55)"/><path d="M54 50L65 58L75 46" stroke-width="2.5"/>` +
    hand(60, 66, 5),
  택배기사:
    person(30, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#3b78e6' }) +
    box(62, 70, 34, 24) +
    box(66, 46, 26, 24) +
    box(18, 70, 28, 22) +
    hand(18, 84, 5) +
    hand(46, 84, 5),
  청소부:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    `<path d="M68 22L76 78" stroke-width="10"/><path d="M68 22L76 78" stroke="#b5793a" stroke-width="4"/>` +
    `<path d="M66 76L86 72L96 92L66 96Z" fill="#f2c14e"/><path d="M72 80L74 94M80 78L84 94M88 78L92 92" stroke="#b5793a" stroke-width="2"/>` +
    person(36, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a', cap: '#ff9f1a' }) +
    `<path d="M20 82H52M20 89H52" stroke="#e8f7a0" stroke-width="4"/>` +
    tube('M50 76L68 40', '#ff9f1a', 6) +
    hand(69, 40, 5) +
    hand(73, 64, 5) +
    `<path d="M4 94C2 82 6 72 14 72C16 66 22 68 22 72C28 76 26 88 24 94Z" fill="#43b04a"/><path d="M12 72q2-6 6-4" stroke-width="2.5"/>`,
  정원사:
    `<path d="M62 94C62 88 96 88 96 94Z" fill="#9a5b2e"/>` +
    tube('M70 90V74M82 90V70M92 90V76', '#43b04a', 3) +
    `<circle cx="70" cy="70" r="6" fill="#ff5c70"/><circle cx="82" cy="66" r="6" fill="#ffd23f"/><circle cx="92" cy="72" r="5" fill="#e85d9a"/>` +
    dot(70, 70, 2, '#ffd23f') +
    dot(82, 66, 2, '#e8862e') +
    `<path d="M68 52l-2 6M76 50l0 6M84 52l2 6" stroke="#4aa8f0" stroke-width="3"/>` +
    person(30, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    strawHat(30, 40, 20) +
    `<path d="M20 72H40V94H20Z" fill="#9a5b2e"/>` +
    `<path d="M42 58H62V76C62 80 60 82 56 82H48C44 82 42 80 42 76Z" fill="#3b8fe0"/>` +
    `<path d="M62 64L74 50" stroke-width="7"/><path d="M62 64L74 50" stroke="#3b8fe0" stroke-width="3"/>` +
    `<rect x="70" y="42" width="8" height="10" rx="2" fill="#3b8fe0" transform="rotate(40 74 47)"/>` +
    `<path d="M44 58C44 48 58 48 58 58" stroke-width="3"/>` +
    hand(42, 72, 5),
  // ── 바다·산 ──
  잠수부:
    `<rect x="4" y="4" width="92" height="92" rx="14" fill="#3b8fe0"/>` +
    `<path d="M4 20q12-6 23 0t23 0t23 0t23 0" stroke="#7ec8f0" stroke-width="3"/>` +
    `<rect x="20" y="50" width="12" height="36" rx="5" fill="#ffd23f"/><rect x="68" y="50" width="12" height="36" rx="5" fill="#ffd23f"/>` +
    person(50, 96, 1.6, { hair: '#26356b', style: 'short', shirt: '#26356b' }) +
    `<path d="M32 30C30 22 70 22 68 30V36C62 32 38 32 32 36Z" fill="#26356b"/>` +
    `<rect x="32" y="34" width="36" height="20" rx="8" fill="#bfe6ff" stroke-width="4"/>` +
    dot(43, 45, 3) +
    dot(57, 45, 3) +
    `<path d="M30 42H26M70 42H74" stroke-width="4"/>` +
    `<circle cx="50" cy="62" r="4.5" fill="#8a96b0"/>` +
    `<circle cx="62" cy="14" r="4" fill="#dff4ff" stroke="#fff" stroke-width="2.5"/><circle cx="70" cy="8" r="3" fill="#dff4ff" stroke="#fff" stroke-width="2"/>` +
    `<path d="M80 70C84 64 92 64 94 70C92 76 84 76 80 70Z" fill="#ff9f1a" stroke-width="2.5"/><path d="M80 70L75 66V74Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M4 82C12 76 14 88 8 94" stroke="#43b04a" stroke-width="4"/>`,
  등산가:
    `<path d="M6 94L44 18L66 52L76 38L96 94Z" fill="#8a96b0"/>` +
    `<path d="M34 38L44 18L54 34L48 32L42 38Z" fill="#fff" stroke-width="2.5"/>` +
    tube('M44 18V4', '#6b3e26', 2) +
    `<path d="M44 4L56 8L44 12Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="60" y="54" width="28" height="30" rx="6" fill="#e8553d"/>` +
    person(66, 96, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f', cap: '#3b78e6' }) +
    `<path d="M58 72V94M74 72V94" stroke="#e8553d" stroke-width="4"/>` +
    tube('M88 94L92 58', '#4a4f66', 2) +
    hand(91, 66, 4.5) +
    tube('M80 76L90 68', '#ffd23f', 5),
  // ── 운동선수 ──
  운동선수:
    tube('M34 72L20 42', '#e8553d', 7) +
    tube('M66 72L80 42', '#e8553d', 7) +
    hand(19, 38, 6) +
    hand(81, 38, 6) +
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
    `<path d="M31 32H69" stroke-width="8"/><path d="M31 32H69" stroke="#fff" stroke-width="4"/>` +
    `<path d="M40 64L50 80L60 64" stroke="#3b78e6" stroke-width="5"/>` +
    `<circle cx="50" cy="84" r="8" fill="#ffc933"/>` +
    star(50, 84, 4.5, '#fff', 2) +
    sparkle(12, 18, 6) +
    sparkle(88, 18, 6),
  축구선수:
    person(40, 88, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M40 60V88" stroke="#fff" stroke-width="4"/>` +
    `<path d="M24 88H56L54 94H26Z" fill="#fff"/>` +
    tube('M34 94L30 98', '#3b78e6', 5) +
    tube('M48 92L62 86', '#3b78e6', 5) +
    `<circle cx="78" cy="76" r="16" fill="#fff"/>` +
    `<path d="M78 70L84 74L82 81H74L72 74Z" fill="${INK}"/>` +
    `<path d="M78 70V61M84 74L93 72M82 81L87 88M74 81L69 88M72 74L63 72" stroke-width="2.5"/>` +
    `<path d="M90 60q4 4 4 10M92 88q4-4 4-8" stroke="#9aa6c4" stroke-width="2.5"/>`,
  야구선수:
    `<circle cx="16" cy="22" r="10" fill="#fff"/><path d="M10 15C14 20 14 25 10 29M22 15C18 20 18 25 22 29" stroke="#e8553d" stroke-width="2.5"/>` +
    tube('M60 74L86 16', '#e0b27a', 6) +
    `<path d="M80 26L86 12L92 16L86 30Z" fill="#e0b27a" stroke-width="3"/>` +
    person(44, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#fff', cap: '#e8553d' }) +
    `<path d="M36 70V96M52 70V96" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M44 66V96" stroke="#e8553d" stroke-width="3"/>` +
    hand(60, 74, 5.5),
  수영선수:
    `<path d="M4 58q8-6 16 0t16 0t16 0t16 0t16 0t12 0V92C96 94 94 96 92 96H8C6 96 4 94 4 92Z" fill="#3b8fe0"/>` +
    `<path d="M4 84H96" stroke="#fff" stroke-width="3"/>` +
    [10, 22, 34, 46, 58, 70, 82, 94].map((x, k) => dot(x, 84, 3.5, k % 2 ? '#fff' : '#e8553d')).join('') +
    `<circle cx="40" cy="48" r="17" fill="${SKIN}"/>` +
    `<path d="M23 46C22 30 30 28 40 28S58 30 57 46C50 40 30 40 23 46Z" fill="#e8553d"/>` +
    `<path d="M23 48H57" stroke-width="4"/>` +
    `<ellipse cx="33" cy="49" rx="5.5" ry="4.5" fill="#7ec8f0" stroke-width="3"/><ellipse cx="47" cy="49" rx="5.5" ry="4.5" fill="#7ec8f0" stroke-width="3"/>` +
    `<path d="M24 60q8-6 16 0t16 0" fill="#3b8fe0" stroke-width="3"/>` +
    tube('M56 62C62 38 74 28 86 32', SKIN, 6) +
    hand(88, 34, 5) +
    `<path d="M62 56l-4-6M70 58l2-8M16 56l-4-6" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="14" cy="42" r="3" fill="#dff4ff" stroke="#7ec8f0" stroke-width="2"/>`,
  체조선수:
    `<path d="M62 12C84 4 96 22 80 30C66 38 88 50 94 44" stroke="#ff5c70" stroke-width="5"/>` +
    `<path d="M40 70C20 70 12 80 20 90C28 96 40 90 36 82" stroke="#ff5c70" stroke-width="5"/>` +
    tube('M44 34C40 44 38 56 40 70', SKIN, 3) +
    tube('M56 32C62 24 64 18 62 12', SKIN, 4) +
    `<path d="M62 12L64 4" stroke="#8a5a34" stroke-width="3"/>` +
    tube('M47 56L44 92', SKIN, 4) +
    tube('M53 56L74 70', SKIN, 4) +
    `<path d="M42 30H58L57 58H43Z" fill="#8e4fc9"/>` +
    sparkle(50, 44, 4, '#ffd23f') +
    `<circle cx="42" cy="12" r="5" fill="#2f2a26"/>` +
    `<circle cx="50" cy="20" r="10" fill="${SKIN}"/><path d="M40 18C40 10 60 10 60 18C56 14 44 14 40 18Z" fill="#2f2a26"/>` +
    dot(46, 21, 1.6) +
    dot(54, 21, 1.6) +
    `<path d="M47 25q3 2 6 0" stroke-width="2"/>`,
  태권도선수:
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M38 66L56 90M62 66L50 80" stroke-width="3"/>` +
    `<path d="M27 84H73V91H27Z" fill="${INK}"/>` +
    `<path d="M46 84L40 98M54 84L60 98" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="45" y="82" width="10" height="11" rx="2" fill="${INK}"/>` +
    tube('M34 72L24 58', '#fff', 7) +
    tube('M66 72L76 58', '#fff', 7) +
    hand(22, 54, 6.5) +
    hand(78, 54, 6.5) +
    `<path d="M14 44l-4-4M22 42l0-6M84 44l4-4M78 42l0-6" stroke="#9aa6c4" stroke-width="2.5"/>`,
  심판:
    person(40, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M40 66V96M32 67V96M48 67V96M25 71V96M55 71V96" stroke="${INK}" stroke-width="3.5"/>` +
    `<path d="M44 55H52V60H44Z" fill="#8a96b0" stroke-width="2"/><path d="M40 60L32 70" stroke="#e8553d" stroke-width="2"/>` +
    tube('M56 74L72 42', '#fff', 6) +
    `<rect x="66" y="12" width="18" height="24" rx="2" fill="#ffd23f" transform="rotate(10 75 24)"/>` +
    hand(72, 38, 5.5) +
    `<path d="M88 12l6-4M90 22h7M86 32l6 4" stroke="#9aa6c4" stroke-width="2.5"/>`,
  // ── 무대 ──
  배우:
    `<path d="M4 4H96V14H4Z" fill="#c62f3f"/>` +
    `<path d="M4 14H22C18 40 22 70 14 96H4Z" fill="#e8553d"/><path d="M96 14H78C82 40 78 70 86 96H96Z" fill="#e8553d"/>` +
    `<path d="M4 14q9 6 18 0t18 0t20 0t18 0t18 0" stroke="#ffc933" stroke-width="3"/>` +
    `<path d="M50 14L28 96H72Z" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    tube('M36 74L24 54', '#8e4fc9', 6) +
    tube('M64 74L76 54', '#8e4fc9', 6) +
    hand(23, 51, 5) +
    `<rect x="66" y="34" width="24" height="18" rx="2" fill="#2f2a26"/>` +
    `<path d="M66 34L64 26L88 22L90 30Z" fill="#fff"/><path d="M70 25L73 32M77 24L80 31M84 23L87 30" stroke-width="3"/>` +
    `<path d="M66 34H90" stroke-width="3"/><path d="M70 40H86M70 46H80" stroke="#fff" stroke-width="2.5"/>` +
    hand(77, 53, 5) +
    person(50, 96, 1.5, { hair: '#6b3e26', style: 'short', shirt: '#8e4fc9' }) +
    `<path d="M40 66L50 76L60 66" fill="#ffd23f" stroke-width="2.5"/>` +
    sparkle(30, 30, 5) +
    sparkle(70, 30, 5),
  무용가:
    tube('M38 52L20 42', '#ffd23f', 5) +
    tube('M62 52L80 42', '#ffd23f', 5) +
    fan(20, 42, 22, 190, 290, '#ff9aa8', '#e8553d') +
    fan(80, 42, 22, 250, 350, '#ff9aa8', '#e8553d') +
    hand(20, 42, 4.5) +
    hand(80, 42, 4.5) +
    person(50, 70, 1.3, { hair: '#2f2a26', style: 'bun', shirt: '#ffd23f' }) +
    `<path d="M36 60C28 74 22 88 18 96H82C78 88 72 74 64 60Z" fill="#e8553d"/>` +
    `<path d="M36 60H64" stroke="#8e4fc9" stroke-width="5"/>` +
    `<path d="M50 60L46 76M50 60L56 74" stroke="#e85d9a" stroke-width="4"/>` +
    `<circle cx="50" cy="12" r="4" fill="#ff5c70" stroke-width="2.5"/>`,
  // ── 이야기 속 사람 ──
  산타할아버지:
    `<path d="M66 60C58 60 56 70 58 80C60 92 70 96 82 96C92 96 98 88 96 76C94 66 88 60 80 60Z" fill="#b5793a"/>` +
    `<path d="M68 60C72 56 78 56 80 60" stroke="#e8553d" stroke-width="4"/>` +
    person(42, 96, 1.55, { hair: '#fff', style: 'short', shirt: '#e8553d' }) +
    `<path d="M28 50C26 68 34 76 42 76S58 68 56 50C52 58 32 58 28 50Z" fill="#fff"/>` +
    `<path d="M35 55C38 52 41 52 42 55C43 52 46 52 49 55C46 58 38 58 35 55Z" fill="#fff"/>` +
    `<path d="M20 86H64V92H20Z" fill="${INK}"/><rect x="36" y="84" width="12" height="10" rx="2" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M26 30C28 12 48 6 62 12C70 16 74 26 72 38L64 34L58 30Z" fill="#e8553d"/>` +
    `<rect x="22" y="28" width="40" height="8" rx="4" fill="#fff"/>` +
    `<circle cx="72" cy="40" r="6" fill="#fff"/>`,
  임금님:
    `<path d="M4 96L14 58L22 72L30 50L40 96Z" fill="#3a9e47"/><path d="M96 96L86 58L78 72L70 50L60 96Z" fill="#3a9e47"/>` +
    `<circle cx="14" cy="30" r="8" fill="#e8553d"/><circle cx="86" cy="30" r="7" fill="#fff"/>` +
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#e8553d', beard: '#2f2a26', mustache: true }) +
    `<path d="M36 26C36 12 64 12 64 26Z" fill="#2f2a26"/>` +
    `<path d="M29 37C28 26 72 26 71 37Z" fill="#2f2a26"/><path d="M30 34H70" stroke="#ffc933" stroke-width="2.5"/>` +
    `<circle cx="50" cy="82" r="9" fill="#ffc933"/><path d="M45 80q5-6 10 0q-5 6-10 4" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M27 90H73" stroke="#ffc933" stroke-width="4"/>`,
  장군:
    tube('M86 96V10', '#9a5b2e', 3) +
    `<path d="M86 10L64 18L86 30Z" fill="#e8553d"/>` +
    person(44, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#9a5b2e', beard: '#2f2a26', mustache: true }) +
    [70, 78, 86]
      .map((y) => [28, 36, 44, 52, 60].map((x) => `<path d="M${x - 4} ${y}q4 5 8 0" stroke="#ffc933" stroke-width="2.5"/>`).join(''))
      .join('') +
    `<path d="M18 74C18 64 26 62 32 66L30 78Z" fill="#26356b"/><path d="M70 74C70 64 62 62 56 66L58 78Z" fill="#26356b"/>` +
    `<path d="M22 50V38C22 18 66 18 66 38V50L58 46V36H30V46Z" fill="#26356b"/>` +
    `<path d="M22 38H66" stroke="#ffc933" stroke-width="3"/>` +
    tube('M44 20V12', '#ffc933', 3) +
    blob('#e8553d', [
      [44, 8, 5],
      [40, 12, 4],
      [48, 12, 4],
    ]) +
    tube('M62 76L80 66', '#9a5b2e', 6) +
    hand(84, 64, 5),
  선비:
    person(44, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#fff', beard: '#2f2a26' }) +
    `<path d="M36 64L44 74L52 64" stroke-width="3"/>` +
    `<path d="M30 80H58" stroke="#3b78e6" stroke-width="4"/>` +
    `<rect x="36" y="10" width="16" height="20" rx="3" fill="#2f2a26"/>` +
    `<ellipse cx="44" cy="29" rx="26" ry="5" fill="#2f2a26"/>` +
    `<path d="M26 32L30 60M62 32L58 60" stroke="#2f2a26" stroke-width="2"/>` +
    `<rect x="64" y="62" width="24" height="30" rx="2" fill="#3b78e6" transform="rotate(-8 76 77)"/>` +
    `<path d="M68 66L70 90" stroke="#e8553d" stroke-width="2.5" transform="rotate(-8 76 77)"/>` +
    `<rect x="72" y="66" width="10" height="14" fill="#fff" stroke-width="2" transform="rotate(-8 76 77)"/>` +
    hand(62, 82, 5),
  왕비:
    sparkle(12, 30, 5) +
    sparkle(88, 30, 5) +
    person(50, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#3b5aa8' }) +
    `<path d="M20 30C14 18 26 6 50 6S86 18 80 30C76 34 70 34 66 30C60 24 40 24 34 30C30 34 24 34 20 30Z" fill="#2f2a26"/>` +
    `<path d="M14 22H86" stroke="#ffc933" stroke-width="5"/>` +
    dot(50, 14, 4, '#e8553d') +
    dot(36, 16, 3, '#43b04a') +
    dot(64, 16, 3, '#43b04a') +
    `<path d="M40 64L50 74L60 64" stroke="#e8553d" stroke-width="5"/>` +
    `<circle cx="50" cy="84" r="8" fill="#ffc933"/>` +
    `<path d="M46 84q4-5 8 0q-4 5-8 0Z" fill="#e8553d" stroke-width="2"/>` +
    cheeks(58, 10),
  마법사:
    person(44, 96, 1.55, { hair: '#fff', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M30 50C28 74 36 88 44 90S60 74 58 50C54 58 34 58 30 50Z" fill="#fff"/>` +
    `<path d="M36 55C39 52 42 52 44 55C46 52 49 52 52 55C49 58 39 58 36 55Z" fill="#fff"/>` +
    `<path d="M26 32L48 2C52 4 54 8 52 12L62 32Z" fill="#3b78e6"/>` +
    `<ellipse cx="44" cy="32" rx="26" ry="5" fill="#3b78e6"/>` +
    star(42, 22, 5, '#ffd23f', 2) +
    star(54, 14, 3.5, '#ffd23f', 2) +
    tube('M78 96V30', '#9a5b2e', 4) +
    star(78, 24, 10, '#ffd23f') +
    hand(78, 70, 5) +
    sparkle(92, 42, 5) +
    sparkle(90, 10, 4),
  마녀:
    `<path d="M86 14A10 10 0 1 0 94 30A8 8 0 1 1 86 14Z" fill="#ffd23f"/>` +
    tube('M92 44L60 94', '#9a5b2e', 4) +
    `<path d="M58 88L50 98L64 96L68 90Z" fill="#f2c14e"/>` +
    person(42, 96, 1.5, { hair: '#e8862e', style: 'long', shirt: '#8e4fc9' }) +
    `<path d="M22 32L40 2C44 2 48 6 46 10L60 32Z" fill="#2f2a26"/>` +
    `<ellipse cx="42" cy="32" rx="26" ry="5" fill="#2f2a26"/>` +
    `<path d="M26 28H58" stroke="#8e4fc9" stroke-width="4"/>` +
    cheeks(52, 9, 42) +
    hand(76, 72, 5) +
    tube('M54 78L72 72', '#8e4fc9', 5),
  허수아비:
    `<path d="M4 94C14 84 86 84 96 94Z" fill="#f2c14e"/>` +
    tube('M50 40V96', '#9a5b2e', 7) +
    tube('M10 56H90', '#9a5b2e', 6) +
    `<path d="M26 50H74L70 84H30Z" fill="#3b8fe0"/>` +
    `<path d="M26 50H10V64H28Z" fill="#3b8fe0"/><path d="M74 50H90V64H72Z" fill="#3b8fe0"/>` +
    `<path d="M26 50V84M74 50V84M38 50V84M62 50V84" stroke="#e8553d" stroke-width="2.5"/>` +
    `<rect x="54" y="66" width="10" height="10" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M10 52L2 48M10 58L2 58M10 62L3 68M90 52L98 48M90 58L98 58M90 62L97 68" stroke="#e0b030" stroke-width="3"/>` +
    `<path d="M34 84L32 92M42 84L42 92M58 84L58 92M66 84L68 92" stroke="#e0b030" stroke-width="3"/>` +
    `<circle cx="50" cy="36" r="14" fill="#f2e2b0"/>` +
    dot(45, 35, 2.5) +
    dot(55, 35, 2.5) +
    `<path d="M43 42q7 6 14 0" stroke-width="2.5"/><path d="M45 42v3M50 44v3M55 42v3" stroke-width="1.5"/>` +
    strawHat(50, 26, 24),
  // ── 가족·결혼 ──
  가족사진:
    `<path d="M30 12L50 3L70 12" stroke-width="2.5"/>` +
    dot(50, 3, 3) +
    `<rect x="8" y="12" width="84" height="80" rx="4" fill="#e0a458" stroke-width="4"/>` +
    `<rect x="16" y="20" width="68" height="64" fill="#bfe6ff" stroke-width="3"/>` +
    `<path d="M16 70H84V84H16Z" fill="#8fd18a" stroke="none"/>` +
    person(31, 84, 0.95, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(69, 84, 0.95, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    person(44, 84, 0.62, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    person(56, 84, 0.62, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }) +
    `<rect x="16" y="20" width="68" height="64" stroke-width="3"/>` +
    `<circle cx="12" cy="16" r="1.5" fill="#fff1b8" stroke="none"/>`,
  신랑:
    sparkle(58, 12, 6) +
    halo(38, 96, 1.5) +
    `<path d="M68 42C66 60 62 80 60 96H96C94 80 90 60 88 42C86 30 70 30 68 42Z" fill="#f7f9fd" stroke="#c9d3e6"/>` +
    person(78, 96, 1.1, { hair: '#6b3e26', style: 'long', shirt: '#fff' }) +
    `<circle cx="78" cy="52" r="3" fill="#fff" stroke="#c9d3e6" stroke-width="2"/>` +
    person(38, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#2f2a26' }) +
    `<path d="M31 66L38 82L45 66Z" fill="#fff" stroke-width="2.5"/>` +
    bowtie(38, 68, INK) +
    `<circle cx="50" cy="76" r="4" fill="#fff" stroke-width="2.5"/>`,
  신부:
    `<path d="M30 34C26 56 20 80 14 96H86C80 80 74 56 70 34C66 20 34 20 30 34Z" fill="#f7f9fd" stroke="#c9d3e6"/>` +
    person(50, 96, 1.6, { hair: '#6b3e26', style: 'long', shirt: '#fff' }) +
    `<path d="M38 22L42 16L46 20L50 12L54 20L58 16L62 22Z" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M42 86L50 96L58 86Z" fill="#43b04a" stroke-width="2.5"/>` +
    blob('#ff9aa8', [
      [44, 80, 6],
      [56, 80, 6],
      [50, 74, 6],
      [50, 84, 5],
    ]) +
    dot(44, 80, 2.5, '#e85d9a') +
    dot(56, 80, 2.5, '#e85d9a') +
    dot(50, 74, 2.5, '#e85d9a') +
    hand(38, 86, 5) +
    hand(62, 86, 5) +
    sparkle(16, 20, 5) +
    sparkle(86, 24, 5),
};
