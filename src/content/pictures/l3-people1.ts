// 그림 묶음: 9세 이상 직업·사람 (예술가, 장인, 탐험하는 사람, 운동선수, 무리·가족). 직업은 옷과 도구·일하는 장면으로 구별한다. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, blob, sparkle, tube, cheeks, person, drop } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);

/** 손 */
const hand = (x: number, y: number, r = 5, fill = SKIN) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

/** 음표 */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 별 (x, y 가운데, r 바깥 반지름) */
function star(x: number, y: number, r: number, fill: string, sw = 3): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

/** 자유 자세 사람의 머리 (가운데 x, y, 반지름 r, 머리색) */
function head(x: number, y: number, r: number, hair: string): string {
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>` +
    `<path d="M${f1(x - r)} ${f1(y - 0.05 * r)}C${f1(x - r)} ${f1(y - 1.35 * r)} ${f1(x + r)} ${f1(y - 1.35 * r)} ${f1(x + r)} ${f1(y - 0.05 * r)}C${f1(x + 0.55 * r)} ${f1(y - 0.6 * r)} ${f1(x - 0.55 * r)} ${f1(y - 0.6 * r)} ${f1(x - r)} ${f1(y - 0.05 * r)}Z" fill="${hair}"/>` +
    dot(f1(x - 0.38 * r), f1(y + 0.1 * r), f1(0.16 * r)) +
    dot(f1(x + 0.38 * r), f1(y + 0.1 * r), f1(0.16 * r)) +
    `<path d="M${f1(x - 0.3 * r)} ${f1(y + 0.45 * r)}q${f1(0.3 * r)} ${f1(0.25 * r)} ${f1(0.6 * r)} 0" stroke-width="2"/>`
  );
}

/** 뼈 (화석) */
function bone(x1: number, y1: number, x2: number, y2: number): string {
  const knobs = (st: string) =>
    [
      [x1 - 2, y1 - 3],
      [x1 - 2, y1 + 4],
      [x2 + 2, y2 - 4],
      [x2 + 2, y2 + 3],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" ${st}/>`)
      .join('');
  return (
    knobs('') +
    `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="14"/>` +
    knobs('stroke="none"') +
    `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-width="7"/>`
  );
}

/** 챙 달린 탐험 모자 (가운데 x, 챙 y, 챙 반폭 w) */
const pithHat = (x: number, y: number, w: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${f1(w * 0.18)}" fill="#e8d3a0"/>` +
  `<path d="M${f1(x - w * 0.74)} ${y}C${f1(x - w * 0.74)} ${f1(y - w * 0.9)} ${f1(x + w * 0.74)} ${f1(y - w * 0.9)} ${f1(x + w * 0.74)} ${y}Z" fill="#e8d3a0"/>` +
  `<path d="M${f1(x - w * 0.72)} ${y - 4}H${f1(x + w * 0.72)}" stroke="#9a5b2e" stroke-width="4"/>`;

/** 가죽 앞치마 (사람 가운데 x, 발밑 y) */
const apron = (x: number, y: number, fill = '#9a5b2e') =>
  `<path d="M${x - 9} ${y - 22}Q${x} ${y - 26} ${x + 9} ${y - 22}L${x + 10} ${y}H${x - 10}Z" fill="${fill}"/>`;

/** 줄자 (목에 건) */
const tape = (x: number, y: number) =>
  tube(`M${x - 9} ${y - 25}V${y - 2}`, '#ffd23f', 4) + tube(`M${x + 9} ${y - 25}V${y - 4}`, '#ffd23f', 4);

/** 파도 (y 물높이) */
const sea = (y: number, fill = '#4a90e2') => `<path d="M2 ${y}Q14 ${y - 6} 26 ${y}T50 ${y}T74 ${y}T98 ${y}V98H2Z" fill="${fill}"/>`;

/** 폼폼 */
const pompom = (x: number, y: number, fill: string) =>
  blob(fill, [
    [x, y - 6, 6],
    [x - 6, y - 1, 6],
    [x + 6, y - 1, 6],
    [x - 3, y + 5, 6],
    [x + 4, y + 5, 6],
  ]);

export const PICS: Record<string, string> = {
  // ── 알리고 만드는 사람 ──
  아나운서:
    `<rect x="8" y="8" width="84" height="56" rx="6" fill="#bfe6ff"/>` +
    `<path d="M16 22H34M16 30H28" stroke="#7ec8f0" stroke-width="4"/>` +
    person(50, 78, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#26356b' }) +
    `<path d="M44 52L50 62L56 52Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M50 56L47.5 66L50 70L52.5 66Z" fill="#e8553d" stroke-width="2"/>` +
    `<path d="M4 70H96V94H4Z" fill="#3b78e6"/><path d="M4 78H96" stroke="#fff" stroke-width="3"/>` +
    `<rect x="18" y="62" width="22" height="12" rx="1" fill="#fff" transform="rotate(-6 29 68)"/>` +
    hand(19, 70, 4.5) +
    hand(39, 68, 4.5) +
    tube('M68 70L71 60', '#4a4f66', 3) +
    `<ellipse cx="72" cy="55" rx="5.5" ry="7" fill="#4a4f66"/>`,
  작곡가:
    note(10, 30, '#8e4fc9') +
    note(30, 24, '#3b78e6') +
    person(24, 96, 1.35, { hair: '#6b3e26', style: 'short', shirt: '#8e4fc9', glasses: true }) +
    `<g transform="rotate(4 69 52)"><rect x="44" y="14" width="50" height="76" rx="3" fill="#fff"/>` +
    `<path d="M49 24H89M49 29H89M49 34H89M49 39H89M49 44H89M49 58H89M49 63H89M49 68H89M49 73H89M49 78H89" stroke="#9aa6c4" stroke-width="1.8"/>` +
    [
      [57, 39],
      [67, 34],
      [77, 29],
      [86, 34],
      [58, 73],
      [68, 68],
      [78, 63],
      [87, 68],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.8" fill="${INK}" stroke="none"/><path d="M${x + 3} ${y}V${y - 11}" stroke-width="2"/>`,
      )
      .join('') +
    `</g>` +
    tube('M34 84L50 82', '#8e4fc9', 6) +
    hand(52, 82, 5) +
    tube('M53 80L60 70', '#ffd23f', 3),
  지휘자:
    note(10, 30, '#8e4fc9') +
    note(26, 26, '#3b78e6') +
    person(50, 96, 1.5, { hair: '#8a96b0', style: 'short', shirt: '#2f2a26' }) +
    `<path d="M44 66L50 80L56 66Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M50 70L42 66V74ZM50 70L58 66V74Z" fill="#e8553d" stroke-width="2.5"/>` +
    tube('M36 78L18 54', '#2f2a26', 7) +
    tube('M64 78L80 50', '#2f2a26', 7) +
    hand(16, 51, 5.5) +
    hand(82, 47, 5.5) +
    tube('M84 43L94 20', '#fff', 2.5) +
    `<path d="M76 18q6 0 10-6M70 28q4-2 6-6" stroke="#9aa6c4" stroke-width="2.5"/>`,
  조각가:
    `<rect x="58" y="76" width="34" height="18" rx="2" fill="#c9b28a"/>` +
    `<path d="M60 76C60 62 66 58 75 58S90 62 90 76Z" fill="#dfe8f5"/>` +
    `<circle cx="75" cy="44" r="12" fill="#dfe8f5"/>` +
    `<path d="M63 42C63 30 87 30 87 42C82 36 68 36 63 42Z" fill="#c3cddf"/>` +
    `<path d="M69 46q2 2 4 0M77 46q2 2 4 0M72 52q3 2 6 0" stroke-width="2"/>` +
    person(28, 96, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#e8862e' }) +
    apron(28, 96, '#9a5b2e') +
    tube('M40 80L55 62', '#e8862e', 6) +
    hand(56, 60, 5) +
    tube('M58 58L65 52', '#8a96b0', 3) +
    tube('M16 80L10 58', '#e8862e', 6) +
    hand(10, 55, 5) +
    tube('M10 53L17 38', '#9a5b2e', 3) +
    `<rect x="10" y="24" width="16" height="11" rx="3" fill="#9a5b2e" transform="rotate(22 18 29.5)"/>` +
    sparkle(58, 44, 5) +
    sparkle(66, 64, 4, '#8a96b0'),
  디자이너:
    `<path d="M58 74L54 94M86 74L90 94" stroke="#9a5b2e" stroke-width="4"/>` +
    `<rect x="50" y="8" width="44" height="66" rx="3" fill="#fff"/>` +
    `<circle cx="72" cy="19" r="4.5" fill="${SKIN}" stroke-width="2.5"/>` +
    `<path d="M68 25H76L79 35L86 58H58L65 35Z" fill="#e85d9a" stroke-width="2.5"/>` +
    `<path d="M65 35H79" stroke-width="2.5"/>` +
    `<rect x="57" y="63" width="8" height="6" fill="#e8553d" stroke-width="2"/><rect x="68" y="63" width="8" height="6" fill="#3b78e6" stroke-width="2"/><rect x="79" y="63" width="8" height="6" fill="#ffd23f" stroke-width="2"/>` +
    person(28, 96, 1.45, { hair: '#2f2a26', style: 'long', shirt: '#43b04a' }) +
    tape(28, 96) +
    tube('M40 82L54 78', '#43b04a', 6) +
    hand(56, 77, 5) +
    tube('M57 75L63 64', '#8e4fc9', 3),
  건축가:
    `<rect x="46" y="16" width="48" height="58" rx="2" fill="#3b78e6"/>` +
    `<rect x="44" y="11" width="52" height="8" rx="4" fill="#7ec8f0"/>` +
    `<rect x="44" y="70" width="52" height="8" rx="4" fill="#7ec8f0"/>` +
    `<path d="M53 44L70 28L87 44M57 42V64H83V42M66 64V54H74V64M60 48h5v5h-5ZM75 48h5v5h-5Z" stroke="#fff" stroke-width="2.5"/>` +
    person(26, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    `<path d="M9 44C9 24 43 24 43 44Z" fill="#fff"/>` +
    tube('M6 44H46', '#fff', 3) +
    `<path d="M26 28V42" stroke-width="2.5"/>` +
    tube('M38 80L46 62', '#ff9f1a', 6) +
    hand(47, 60, 5),
  발명가:
    person(34, 96, 1.5, { hair: '#dfe8f5', style: 'bald', shirt: '#fff' }) +
    tube('M16 44C8 40 10 30 17 32', '#dfe8f5', 3) +
    tube('M52 44C60 40 58 30 51 32', '#dfe8f5', 3) +
    `<path d="M17 38H51" stroke="#6b3e26" stroke-width="4"/>` +
    `<circle cx="27" cy="37" r="5.5" fill="#7ec8f0" stroke-width="2.5"/><circle cx="41" cy="37" r="5.5" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M28 66L34 78L40 66" stroke-width="2.5"/>` +
    tube('M48 78L60 58', '#fff', 7) +
    hand(62, 55, 5.5) +
    `<rect x="60" y="42" width="12" height="9" rx="2" fill="#8a96b0"/>` +
    `<path d="M59 42C50 36 52 12 66 12S82 36 73 42Z" fill="#ffd23f"/>` +
    `<path d="M60 22q2-5 7-6" stroke="#fff" stroke-width="3"/>` +
    `<path d="M66 3V7M84 12l-4 3M89 27h-5M48 12l4 3" stroke="${HL}" stroke-width="4"/>` +
    `<circle cx="80" cy="80" r="12" stroke-width="7" stroke-dasharray="5 4"/>` +
    `<circle cx="80" cy="80" r="11" fill="#8a96b0"/><circle cx="80" cy="80" r="4" fill="#fff7e0"/>`,
  해녀:
    `<path d="M16 82C16 64 28 58 40 58S64 64 64 82Z" fill="#2f2a26"/>` +
    `<circle cx="40" cy="38" r="21" fill="#2f2a26"/>` +
    `<circle cx="40" cy="42" r="15" fill="${SKIN}"/>` +
    `<path d="M20 36H60" stroke="#2f2a26" stroke-width="4"/>` +
    `<ellipse cx="40" cy="36" rx="15" ry="9" fill="#bfe6ff" stroke-width="3.5"/>` +
    dot(34, 36, 2.5) +
    dot(46, 36, 2.5) +
    `<path d="M35 50q5 4 10 0" stroke-width="2.5"/>` +
    sea(66) +
    `<path d="M66 72L70 94H86L90 72Z" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M68 78L88 90M68 88L88 76M71 72L86 94M85 72L72 94" stroke="#fff" stroke-width="1.8"/>` +
    `<circle cx="78" cy="60" r="15" fill="#ff9f1a"/>` +
    `<path d="M68 54q4-6 10-6" stroke="#fff" stroke-width="3.5"/>` +
    tube('M56 70L62 62', '#2f2a26', 6) +
    hand(63, 60, 4.5) +
    drop(14, 18, 0.9) +
    drop(66, 14, 0.8),
  // ── 손으로 만드는 사람 ──
  대장장이:
    person(26, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#8a96b0', mustache: true }) +
    apron(26, 96) +
    tube('M36 80L46 56', '#8a96b0', 6) +
    hand(47, 53, 5) +
    tube('M48 52L55 39', '#9a5b2e', 3) +
    `<rect x="48" y="30" width="16" height="10" rx="2" fill="#4a4f66" transform="rotate(25 56 35)"/>` +
    `<path d="M62 26q6 2 8 8" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M46 60H94V68H80V80H88V92H56V80H64V68H56C50 68 46 64 46 60Z" fill="#4a4f66"/>` +
    tube('M62 58C62 47 78 47 78 58', '#ff9f1a', 5) +
    sparkle(58, 44, 5) +
    sparkle(86, 46, 5) +
    sparkle(76, 36, 4, '#ff9f1a'),
  재봉사:
    `<rect x="36" y="74" width="60" height="10" rx="3" fill="#8a96b0"/>` +
    `<path d="M24 68H74L72 77H22Z" fill="#7ec8f0"/>` +
    `<path d="M28 72.5H48" stroke-width="2" stroke-dasharray="3 3"/>` +
    `<path d="M44 58V36C44 32 47 30 52 30H86C90 30 93 32 93 36V74H80V46H58V58Z" fill="#e8553d"/>` +
    `<path d="M62 38H84" stroke="${HL}" stroke-width="3"/>` +
    `<path d="M51 58V70" stroke-width="2.5"/><rect x="46" y="58" width="10" height="4" rx="1" fill="#8a96b0" stroke-width="2"/>` +
    `<rect x="68" y="20" width="9" height="10" rx="2" fill="#3b78e6"/>` +
    `<path d="M68 23Q56 18 50 30" stroke="#3b78e6" stroke-width="2"/>` +
    person(20, 96, 1.3, { hair: '#6b3e26', style: 'bun', shirt: '#43b04a' }) +
    tape(20, 96) +
    tube('M30 84L34 74', '#43b04a', 6) +
    hand(35, 72, 4.5),
  구두장이:
    `<rect x="44" y="82" width="52" height="12" rx="2" fill="#b5793a"/>` +
    `<path d="M50 80V64C50 58 56 56 60 58C64 60 66 66 74 68C86 70 92 74 92 78V80Z" fill="#9a5b2e"/>` +
    `<rect x="48" y="77" width="46" height="6" rx="2" fill="#5a3b24"/>` +
    `<path d="M60 64l5 3M63 60l5 3" stroke="#fff" stroke-width="2.5"/>` +
    sparkle(84, 62, 5) +
    person(24, 96, 1.4, { hair: '#8a96b0', style: 'short', shirt: '#3b78e6', glasses: true }) +
    apron(24, 96) +
    tube('M34 80L44 60', '#3b78e6', 6) +
    hand(45, 57, 5) +
    tube('M46 55L52 44', '#9a5b2e', 2.5) +
    `<rect x="47" y="38" width="12" height="7" rx="2" fill="#4a4f66" transform="rotate(28 53 41.5)"/>`,
  도예가:
    person(54, 66, 1.2, { hair: '#6b3e26', style: 'short', shirt: '#8e4fc9' }) +
    `<rect x="38" y="82" width="36" height="12" rx="2" fill="#8a96b0"/>` +
    `<ellipse cx="56" cy="80" rx="32" ry="7" fill="#dfe8f5"/>` +
    `<path d="M40 79C34 68 38 58 46 54C45 50 46 46 50 46H62C66 46 67 50 66 54C74 58 78 68 72 79Z" fill="#d9a066"/>` +
    `<ellipse cx="56" cy="46" rx="7" ry="2.5" fill="#b5793a"/>` +
    tube('M43 54L37 64', '#8e4fc9', 6) +
    tube('M65 54L75 64', '#8e4fc9', 6) +
    hand(37, 67, 5) +
    hand(75, 67, 5) +
    `<path d="M16 88q-6-8 0-14M96 88q6-8 0-14" stroke="#9aa6c4" stroke-width="3"/>`,
  // ── 찾고 살피는 사람 ──
  광부:
    `<path d="M38 30L94 6V36Z" fill="#fff1b8" stroke="none"/>` +
    person(28, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#4a4f66' }) +
    `<path d="M10 44C10 22 46 22 46 44Z" fill="#ffd23f"/>` +
    tube('M6 44H50', '#ffd23f', 3) +
    `<rect x="22" y="27" width="13" height="9" rx="3" fill="#fff"/>` +
    blob('#2f2a26', [
      [62, 60, 6],
      [71, 56, 7],
      [81, 58, 6],
      [89, 61, 5],
    ]) +
    `<path d="M70 50L75 45L80 50L75 56Z" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M54 62H96L90 86H60Z" fill="#8a96b0"/>` +
    `<path d="M57 70H93" stroke-width="2.5"/>` +
    `<circle cx="66" cy="88" r="5" fill="#4a4f66"/><circle cx="84" cy="88" r="5" fill="#4a4f66"/>` +
    `<path d="M50 95H98" stroke="#9a5b2e" stroke-width="3"/>` +
    tube('M40 80L52 72', '#4a4f66', 6) +
    hand(54, 71, 5),
  탐험가:
    `<path d="M4 94C4 76 10 70 14 64M14 64C8 60 4 62 2 66M14 64C18 58 24 58 26 62" stroke="#3a9e47" stroke-width="4"/>` +
    person(40, 96, 1.55, { hair: '#6b3e26', style: 'short', shirt: '#c9a66b' }) +
    pithHat(40, 36, 28) +
    `<path d="M30 66L40 76L50 66" stroke-width="2"/>` +
    `<rect x="31" y="74" width="8" height="12" rx="2" fill="#4a4f66"/><rect x="41" y="74" width="8" height="12" rx="2" fill="#4a4f66"/>` +
    `<path d="M60 58L72 54L84 58L96 54V82L84 86L72 82L60 86Z" fill="#fff1b8"/>` +
    `<path d="M72 54V82M84 58V86" stroke-width="2"/>` +
    `<path d="M64 80Q70 66 78 72T90 62" stroke="#e8553d" stroke-width="2.5" stroke-dasharray="3 3"/>` +
    `<circle cx="90" cy="62" r="3.5" fill="#e8553d" stroke-width="2"/>` +
    tube('M54 82L58 78', '#c9a66b', 6) +
    hand(60, 76, 5),
  우주비행사:
    `<circle cx="14" cy="20" r="8" fill="#ff9f1a"/>` +
    `<ellipse cx="14" cy="20" rx="14" ry="4" stroke="#8e4fc9" stroke-width="3" transform="rotate(-20 14 20)"/>` +
    sparkle(88, 14, 6) +
    sparkle(8, 48, 4) +
    `<rect x="22" y="46" width="56" height="40" rx="8" fill="#8a96b0"/>` +
    `<path d="M26 96V64C26 54 36 50 50 50S74 54 74 64V96Z" fill="#fff"/>` +
    `<rect x="40" y="68" width="20" height="14" rx="3" fill="#dfe8f5"/>` +
    `<circle cx="45" cy="75" r="2.6" fill="#e8553d" stroke-width="2"/><circle cx="55" cy="75" r="2.6" fill="#3b78e6" stroke-width="2"/>` +
    tube('M29 64L20 82', '#fff', 9) +
    tube('M71 62L84 46', '#fff', 9) +
    `<circle cx="19" cy="85" r="6" fill="#dfe8f5"/><circle cx="86" cy="42" r="6" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="32" r="24" fill="#fff"/>` +
    `<rect x="32" y="20" width="36" height="26" rx="12" fill="#3b8fe0"/>` +
    `<path d="M38 28q4-5 10-5" stroke="#fff" stroke-width="3"/>` +
    `<rect x="23" y="28" width="5" height="10" rx="2" fill="#dfe8f5" stroke-width="2.5"/><rect x="72" y="28" width="5" height="10" rx="2" fill="#dfe8f5" stroke-width="2.5"/>`,
  곡예사:
    `<path d="M6 70V96M94 62V96" stroke-width="4"/>` +
    `<path d="M4 70L96 62" stroke="#9a5b2e" stroke-width="3"/>` +
    tube('M6 40Q50 26 94 40', '#e8553d', 3) +
    `<circle cx="6" cy="40" r="4" fill="#ffd23f"/><circle cx="94" cy="40" r="4" fill="#ffd23f"/>` +
    tube('M44 37L30 35', SKIN, 4) +
    tube('M56 37L70 35', SKIN, 4) +
    tube('M47 54L48 64', SKIN, 4) +
    tube('M53 54L62 58L68 51', SKIN, 4) +
    `<ellipse cx="48" cy="65" rx="4.5" ry="2.5" fill="#e85d9a" stroke-width="2.5"/>` +
    `<path d="M42 34C42 30 58 30 58 34L56 54H44Z" fill="#e85d9a"/>` +
    `<path d="M39 51H61L63 57H37Z" fill="#ffd23f"/>` +
    sparkle(50, 43, 4, '#ffd23f') +
    `<circle cx="50" cy="10" r="4" fill="#2f2a26"/>` +
    head(50, 22, 10, '#2f2a26') +
    sparkle(24, 16, 5) +
    sparkle(78, 14, 5),
  탐정:
    [
      [66, 92],
      [80, 86],
      [92, 92],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="4.5" fill="#6b3e26" stroke="none" transform="rotate(60 ${x} ${y})"/>`)
      .join('') +
    person(36, 96, 1.5, { hair: '#6b3e26', style: 'short', shirt: '#9a5b2e' }) +
    `<ellipse cx="36" cy="38" rx="24" ry="4" fill="#c9a66b"/>` +
    `<path d="M17 38C17 18 55 18 55 38Z" fill="#c9a66b"/>` +
    `<path d="M26 23V37M36 21V37M46 23V37M19 30H53" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M28 66L36 80L44 66" stroke-width="2.5"/>` +
    dot(36, 86, 2) +
    dot(36, 93, 2) +
    tube('M50 80L58 72', '#9a5b2e', 7) +
    hand(60, 70, 5.5) +
    tube('M61 68L66 60', '#2f2a26', 4) +
    `<circle cx="75" cy="50" r="14" fill="#bfe6ff" stroke-width="6"/>` +
    `<ellipse cx="77" cy="53" rx="4" ry="6" fill="#6b3e26" stroke="none"/>` +
    dot(73, 45, 1.6, '#6b3e26') +
    dot(77, 44, 1.6, '#6b3e26') +
    dot(81, 45, 1.6, '#6b3e26') +
    `<path d="M66 44q4-5 9-5" stroke="#fff" stroke-width="3"/>`,
  해양경찰:
    `<rect x="56" y="36" width="30" height="26" rx="3" fill="#dfe8f5"/>` +
    `<rect x="61" y="42" width="8" height="8" fill="#7ec8f0" stroke-width="2.5"/><rect x="73" y="42" width="8" height="8" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<rect x="63" y="27" width="8" height="9" rx="2" fill="#e8553d"/><rect x="71" y="27" width="8" height="9" rx="2" fill="#3b78e6"/>` +
    `<path d="M60 22l-4-4M71 18V13M82 22l4-4" stroke="${HL}" stroke-width="3"/>` +
    person(32, 66, 1.1, { hair: '#2f2a26', style: 'short', shirt: '#26356b', cap: '#26356b' }) +
    star(32, 13.5, 3.5, '#ffc933', 2) +
    star(38, 58, 3.5, '#ffc933', 2) +
    `<path d="M4 62H96L86 86H14Z" fill="#fff"/>` +
    `<path d="M7 69H93" stroke="#3b78e6" stroke-width="5"/><path d="M10 76H90" stroke="#ff9f1a" stroke-width="3"/>` +
    sea(84),
  천문학자:
    `<rect x="40" y="4" width="56" height="56" rx="8" fill="#26356b"/>` +
    `<path d="M82 12A11 11 0 1 0 90 32A9 9 0 1 1 82 12Z" fill="#ffd23f"/>` +
    sparkle(54, 14, 4) +
    sparkle(90, 48, 4) +
    sparkle(66, 50, 3) +
    tube('M60 50L50 94', '#9a5b2e', 2.5) +
    tube('M60 50L72 94', '#9a5b2e', 2.5) +
    tube('M44 58L78 32', '#fff', 10) +
    `<path d="M58 47.5L62 44.5" stroke="#3b78e6" stroke-width="10"/>` +
    person(24, 96, 1.35, { hair: '#8a96b0', style: 'short', shirt: '#8e4fc9' }) +
    tube('M36 82L46 66', '#8e4fc9', 6) +
    hand(47, 64, 5),
  고고학자:
    person(30, 70, 1.2, { hair: '#6b3e26', style: 'short', shirt: '#c9a66b' }) +
    pithHat(30, 26, 22) +
    `<path d="M2 66H98V98H2Z" fill="#d9a066"/>` +
    `<path d="M8 90h6M22 80h4M86 92h6" stroke="#b5793a" stroke-width="3"/>` +
    bone(50, 82, 86, 76) +
    tube('M40 58L54 62', '#c9a66b', 6) +
    hand(56, 62, 5) +
    tube('M57 62L60 68', '#9a5b2e', 2.5) +
    `<rect x="55" y="68" width="10" height="6" rx="1" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M70 64q2-4 0-7M78 64q2-4 0-7" stroke="#9aa6c4" stroke-width="2.5"/>`,
  // ── 동물·식물과 일하는 사람 ──
  조련사:
    sea(80) +
    `<g transform="translate(64 50) rotate(-35) scale(1.25)">` +
    `<path d="M-28 2L-37 -6L-35 2L-37 10Z" fill="#8ab4d8"/>` +
    `<path d="M-4 -8L2 -17L8 -7Z" fill="#8ab4d8"/>` +
    `<path d="M-28 2C-20 -8 4 -12 18 -5L28 -4L19 2C6 9 -16 9 -28 2Z" fill="#8ab4d8"/>` +
    `<path d="M-14 5C-4 8 8 6 16 2" stroke="#fff" stroke-width="2"/>` +
    dot(12, -3, 1.8) +
    `<path d="M17 1q3 1 6-1" stroke-width="2"/></g>` +
    `<circle cx="88" cy="16" r="8" fill="#e8553d"/><path d="M80 16H96" stroke="#fff" stroke-width="3"/>` +
    drop(54, 70, 0.8) +
    drop(92, 64, 0.7) +
    person(22, 96, 1.35, { hair: '#2f2a26', style: 'pony', shirt: '#3b78e6' }) +
    `<path d="M16 64L22 74L28 64" stroke="#ffd23f" stroke-width="2.5"/>` +
    tube('M32 80L40 62', '#3b78e6', 6) +
    hand(41, 59, 5) +
    `<path d="M38 52C42 47 49 47 51 52C49 57 42 57 38 52ZM38 52L33 48V56Z" fill="#ff9f1a" stroke-width="2.5"/>`,
  파티시에:
    person(50, 97, 1.45, { hair: '#6b3e26', style: 'short', shirt: '#fff' }) +
    blob('#fff', [
      [39, 22, 8],
      [50, 17, 10],
      [61, 22, 8],
    ]) +
    `<rect x="36" y="24" width="28" height="10" rx="2" fill="#fff"/>` +
    `<ellipse cx="50" cy="91" rx="27" ry="5" fill="#dfe8f5"/>` +
    `<rect x="30" y="73" width="40" height="17" rx="3" fill="#ff9aa8"/>` +
    `<path d="M30 82H70" stroke="#fff" stroke-width="4"/>` +
    `<path d="M30 77C30 71 70 71 70 77Q65 81 60 77Q55 81 50 77Q45 81 40 77Q35 81 30 77Z" fill="#fff"/>` +
    `<circle cx="40" cy="69" r="4.5" fill="#e8553d"/><circle cx="50" cy="67" r="4.5" fill="#e8553d"/><circle cx="60" cy="69" r="4.5" fill="#e8553d"/>` +
    hand(23, 89, 5) +
    hand(77, 89, 5) +
    sparkle(82, 58, 5) +
    sparkle(16, 60, 4),
  환경미화원:
    `<rect x="58" y="46" width="32" height="42" rx="3" fill="#43b04a"/>` +
    `<path d="M66 54V80M74 54V80M82 54V80" stroke="#3a9e47" stroke-width="3"/>` +
    `<rect x="55" y="39" width="38" height="8" rx="3" fill="#3a9e47"/>` +
    `<circle cx="64" cy="90" r="5" fill="#4a4f66"/>` +
    person(30, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a', cap: '#ff9f1a' }) +
    `<path d="M11 84H49M10 91H50" stroke="#fff" stroke-width="4"/>` +
    tube('M12 38V82', '#9a5b2e', 3) +
    `<path d="M5 82H19L22 94H2Z" fill="#ffd23f"/>` +
    `<path d="M9 84L7 93M12 84V93M15 84L17 93" stroke-width="2"/>` +
    tube('M17 78L12 72', '#ff9f1a', 6) +
    hand(12, 68, 5) +
    tube('M44 80L55 60', '#ff9f1a', 6) +
    hand(57, 58, 5),
  // ── 바다·배 ──
  선원:
    tube('M78 34V84', '#8a96b0', 5) +
    tube('M66 42H90', '#8a96b0', 5) +
    tube('M63 70Q66 86 78 86Q90 86 93 70', '#8a96b0', 5) +
    `<circle cx="78" cy="27" r="6" stroke-width="9"/><circle cx="78" cy="27" r="6" stroke="#8a96b0" stroke-width="4"/>` +
    person(38, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#fff' }) +
    `<path d="M24 70L38 88L52 70" stroke-width="9"/><path d="M24 70L38 88L52 70" stroke="#26356b" stroke-width="5"/>` +
    `<path d="M32 83H44L38 92Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M22 32C22 20 54 20 54 32Z" fill="#fff"/>` +
    `<rect x="20" y="30" width="36" height="7" rx="3.5" fill="#fff"/>` +
    `<path d="M24 33.5H52" stroke="#3b78e6" stroke-width="2.5"/>`,
  항해사:
    person(50, 74, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#26356b' }) +
    `<path d="M33 20C31 6 69 6 67 20Z" fill="#fff"/>` +
    `<rect x="33" y="17" width="34" height="6" rx="2" fill="#2f2a26"/>` +
    `<path d="M37 24Q50 29 63 24" stroke-width="4"/>` +
    star(50, 12, 4, '#ffc933', 2) +
    `<path d="M33 60h8M59 60h8" stroke="${HL}" stroke-width="4"/>` +
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        const x = f1(50 + 22 * Math.cos(t));
        const y = f1(72 + 22 * Math.sin(t));
        return tube(`M50 72L${x} ${y}`, '#b5793a', 3) + `<circle cx="${x}" cy="${y}" r="3.5" fill="#9a5b2e" stroke-width="2.5"/>`;
      })
      .join('') +
    `<circle cx="50" cy="72" r="15" stroke-width="9"/><circle cx="50" cy="72" r="15" stroke="#b5793a" stroke-width="5"/>` +
    `<circle cx="50" cy="72" r="5" fill="#9a5b2e"/>` +
    hand(34, 57, 5) +
    hand(66, 57, 5),
  등대지기:
    sea(88) +
    `<path d="M40 22L66 12V32Z" fill="#fff1b8" stroke="none"/><path d="M86 20L98 14V28Z" fill="#fff1b8" stroke="none"/>` +
    `<path d="M62 92L67 30H85L90 92Z" fill="#fff"/>` +
    `<path d="M65.6 54H86.4L85.6 44H66.4Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M64.2 78H87.8L87 68H65Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="66" y="16" width="20" height="14" rx="2" fill="#ffd23f"/>` +
    `<path d="M64 17L76 7L88 17Z" fill="#e8553d"/>` +
    `<path d="M62 30H90" stroke-width="4"/>` +
    `<path d="M72 92V84Q76 80 80 84V92Z" fill="#26356b"/>` +
    person(26, 96, 1.4, { hair: '#8a96b0', style: 'short', shirt: '#26356b', cap: '#26356b', beard: '#dfe8f5' }) +
    tube('M36 82L44 74', '#26356b', 6) +
    hand(46, 73, 5) +
    `<path d="M43 80Q47 72 51 80" stroke-width="2.5"/>` +
    `<rect x="42" y="80" width="10" height="12" rx="2" fill="#ffd23f"/>` +
    sparkle(56, 84, 4),
  // ── 사진·영화·음악 ──
  사진작가:
    `<path d="M4 10Q50 20 96 10" stroke-width="2"/>` +
    `<rect x="8" y="12" width="18" height="15" fill="#fff" stroke-width="2.5" transform="rotate(-4 17 19.5)"/>` +
    `<path d="M10 25L16 18L20 22L24 18V25Z" fill="#43b04a" stroke-width="2"/>` +
    `<rect x="72" y="13" width="18" height="15" fill="#fff" stroke-width="2.5" transform="rotate(4 81 20.5)"/>` +
    `<circle cx="81" cy="20" r="4" fill="#ff9f1a" stroke-width="2"/>` +
    tube('M70 62L58 94', '#4a4f66', 2.5) +
    tube('M70 62L82 94', '#4a4f66', 2.5) +
    tube('M70 62V94', '#4a4f66', 2.5) +
    `<rect x="54" y="34" width="10" height="7" rx="1" fill="#4a4f66"/>` +
    `<rect x="74" y="35" width="10" height="6" rx="1" fill="#fff"/>` +
    `<rect x="50" y="40" width="40" height="24" rx="5" fill="#4a4f66"/>` +
    `<circle cx="70" cy="52" r="10" fill="#8a96b0"/><circle cx="70" cy="52" r="5.5" fill="#3b8fe0"/>` +
    dot(67.5, 49.5, 1.8, '#fff') +
    `<path d="M84 30l4-5M90 36l5-2" stroke="${HL}" stroke-width="3"/>` +
    person(28, 96, 1.45, { hair: '#6b3e26', style: 'short', shirt: '#e8553d', cap: '#26356b' }) +
    tube('M40 80L52 50', '#e8553d', 6) +
    hand(54, 46, 5),
  영화감독:
    person(30, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<ellipse cx="28" cy="32" rx="17" ry="6" fill="#e8553d" transform="rotate(-10 28 32)"/>` +
    `<path d="M28 26V22" stroke-width="3"/>` +
    `<path d="M44 54L66 42V72L44 60Z" fill="#ffd23f"/>` +
    `<ellipse cx="66" cy="57" rx="4.5" ry="15" fill="#ffc933"/>` +
    tube('M40 76L46 62', '#3b78e6', 6) +
    hand(47, 60, 5) +
    `<path d="M76 46q5 11 0 22M84 40q8 17 0 34" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="60" y="78" width="34" height="16" rx="2" fill="#2f2a26"/>` +
    `<path d="M64 86H90" stroke="#fff" stroke-width="2"/>` +
    `<g transform="rotate(-16 60 78)"><rect x="60" y="70" width="34" height="8" fill="#fff"/>` +
    `<path d="M66 70L63 78H69L72 70ZM78 70L75 78H81L84 70Z" fill="#2f2a26" stroke-width="2"/></g>`,
  첼리스트:
    person(58, 70, 1.3, { hair: '#6b3e26', style: 'short', shirt: '#26356b' }) +
    `<path d="M40 70H76L80 92H36Z" fill="#26356b"/>` +
    `<rect x="41" y="12" width="6" height="36" rx="2" fill="#5a3b24"/>` +
    `<circle cx="44" cy="10" r="4.5" fill="#5a3b24"/>` +
    `<path d="M44 42C34 42 30 48 32 56C33 60 36 60 36 64C36 68 28 70 28 80C28 90 36 94 44 94C52 94 60 90 60 80C60 70 52 68 52 64C52 60 55 60 56 56C58 48 54 42 44 42Z" fill="#b5793a"/>` +
    `<path d="M44 16V84" stroke-width="1.5"/>` +
    `<path d="M38 72q-2 4 0 8M50 72q2 4 0 8" stroke-width="2"/>` +
    `<path d="M39 84H49" stroke-width="3"/>` +
    tube('M16 70L84 60', '#9a5b2e', 2) +
    tube('M47 56L45 34', '#26356b', 6) +
    hand(45, 31, 5) +
    tube('M70 56L78 60', '#26356b', 6) +
    hand(80, 61, 5) +
    note(10, 30, '#8e4fc9') +
    note(78, 26, '#3b78e6'),
  드러머:
    `<path d="M86 32V74M23 70V92M77 70V92" stroke-width="3"/>` +
    `<ellipse cx="86" cy="30" rx="12" ry="3.5" fill="#ffd23f" transform="rotate(-10 86 30)"/>` +
    person(50, 62, 1.2, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
    tube('M40 52L28 50', '#e8553d', 6) +
    tube('M60 52L72 50', '#e8553d', 6) +
    hand(26, 50, 5) +
    hand(74, 50, 5) +
    tube('M24 48L14 34', '#f2d49a', 2.5) +
    tube('M76 48L80 32', '#f2d49a', 2.5) +
    `<path d="M8 30q-2-6 2-10M20 26q2-6 6-8" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<rect x="10" y="60" width="26" height="12" rx="2" fill="#3b78e6"/><ellipse cx="23" cy="60" rx="13" ry="4" fill="#dfe8f5"/>` +
    `<rect x="64" y="60" width="26" height="12" rx="2" fill="#3b78e6"/><ellipse cx="77" cy="60" rx="13" ry="4" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="76" r="19" fill="#fff"/>` +
    `<circle cx="50" cy="76" r="14" stroke="#e8553d" stroke-width="4"/>` +
    star(50, 76, 6, '#ffd23f', 2),
  기타리스트:
    note(12, 30, '#8e4fc9') +
    note(64, 26, '#3b78e6') +
    `<rect x="70" y="56" width="26" height="38" rx="3" fill="#2f2a26"/>` +
    `<circle cx="83" cy="78" r="9" fill="#4a4f66"/>` +
    dot(76, 62, 1.8, '#fff') +
    dot(83, 62, 1.8, '#fff') +
    dot(90, 62, 1.8, '#fff') +
    person(40, 96, 1.5, { hair: '#6b3e26', style: 'short', shirt: '#26356b' }) +
    tube('M44 82L80 40', '#6b3e26', 4) +
    `<rect x="77" y="26" width="8" height="15" rx="2" fill="#2f2a26" transform="rotate(40 81 33.5)"/>` +
    `<path d="M22 78C18 70 26 64 32 70C36 66 44 66 46 72C54 72 56 84 50 88C44 96 26 96 22 88C18 86 18 82 22 78Z" fill="#e8553d"/>` +
    `<rect x="30" y="78" width="10" height="4" fill="#fff" stroke-width="2"/>` +
    hand(50, 86, 5) +
    hand(66, 56, 5),
  // ── 쓰고 그리고 알리는 사람 ──
  동화작가:
    `<path d="M46 38L72 44L96 38V88L72 92L46 88Z" fill="#8e4fc9"/>` +
    `<path d="M48 36Q60 32 72 40V88Q60 82 48 84Z" fill="#fff"/>` +
    `<path d="M72 40Q84 32 94 36V84Q84 82 72 88Z" fill="#fff"/>` +
    `<path d="M52 72V58H55V54H58V58H62V54H65V58H68V72Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M58 72V66Q60 63 62 66V72Z" fill="#8e4fc9" stroke-width="2"/>` +
    `<path d="M60 54V46L65 48L60 50" stroke-width="2"/>` +
    `<path d="M86 50A7 7 0 1 0 88 62A5.5 5.5 0 1 1 86 50Z" fill="#ffd23f" stroke-width="2.5"/>` +
    star(80, 70, 5, '#ffd23f', 2) +
    sparkle(62, 24, 6) +
    sparkle(80, 20, 5, '#e85d9a') +
    sparkle(90, 28, 4) +
    person(24, 96, 1.35, { hair: '#6b3e26', style: 'long', shirt: '#ffd23f' }) +
    tube('M34 82L48 78', '#ffd23f', 6) +
    hand(50, 78, 5) +
    tube('M51 76L56 66', '#3b78e6', 3),
  만화가:
    `<rect x="44" y="10" width="50" height="76" rx="3" fill="#fff"/>` +
    `<rect x="48" y="14" width="42" height="30" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="48" y="48" width="20" height="34" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="70" y="48" width="20" height="34" fill="#fff" stroke-width="2.5"/>` +
    `<ellipse cx="62" cy="24" rx="10" ry="6" fill="#fff" stroke-width="2.5"/><path d="M60 30L58 36L65 30" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="80" cy="33" r="7" fill="#ffd23f" stroke-width="2.5"/>` +
    dot(77.5, 32, 1.4) +
    dot(82.5, 32, 1.4) +
    `<path d="M77 36q3 2 6 0" stroke-width="1.8"/>` +
    star(58, 65, 8, '#ff9f1a', 2.5) +
    `<path d="M80 74C74 68 72 62 76 59C78 57 80 58 80 61C80 58 82 57 84 59C88 62 86 68 80 74Z" fill="#ff5c70" stroke-width="2.5"/>` +
    person(24, 96, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#43b04a', glasses: true }) +
    `<ellipse cx="22" cy="34" rx="15" ry="5" fill="#8e4fc9" transform="rotate(-10 22 34)"/>` +
    tube('M34 82L46 78', '#43b04a', 6) +
    hand(48, 78, 5) +
    tube('M49 76L55 68', '#2f2a26', 2.5),
  기상캐스터:
    `<rect x="40" y="8" width="56" height="62" rx="4" fill="#bfe6ff"/>` +
    blob('#5fc24a', [
      [64, 46, 9],
      [70, 56, 8],
      [60, 58, 6],
      [66, 36, 6],
    ]) +
    `<circle cx="54" cy="22" r="6" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M54 10v3M54 31v3M42 22h3M63 22h3M46 14l2 2M62 14l-2 2" stroke="#ff9f1a" stroke-width="2.5"/>` +
    blob('#fff', [
      [78, 22, 6],
      [85, 19, 7],
      [90, 24, 5],
    ]) +
    drop(80, 32, 0.55) +
    drop(88, 32, 0.55) +
    person(24, 96, 1.45, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    tube('M36 80L46 62', '#e85d9a', 6) +
    hand(47, 60, 5) +
    tube('M48 58L56 30', '#8a96b0', 2),
  // ── 어린이 ──
  유치원생:
    `<path d="M62 90V52H94V90Z" fill="#fff"/>` +
    `<path d="M60 52A18 18 0 0 1 96 52Z" fill="#ff5c70"/>` +
    `<path d="M66 52A12 12 0 0 1 90 52" stroke="#ffd23f" stroke-width="4"/><path d="M72 52A6 6 0 0 1 84 52" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M72 90V78Q78 72 84 78V90Z" fill="#3b78e6"/>` +
    person(38, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#7ec8f0' }) +
    cheeks(58, 11, 38) +
    `<ellipse cx="38" cy="33" rx="22" ry="5" fill="#ffd23f"/>` +
    `<path d="M24 33C24 17 52 17 52 33Z" fill="#ffd23f"/>` +
    `<path d="M26 68L52 90" stroke="#e85d9a" stroke-width="4"/>` +
    `<rect x="46" y="84" width="14" height="10" rx="3" fill="#e85d9a"/>` +
    star(28, 82, 5, '#fff', 2),
  초등학생:
    `<rect x="58" y="28" width="36" height="62" rx="2" fill="#f2d49a"/>` +
    `<circle cx="76" cy="40" r="6" fill="#fff" stroke-width="2.5"/><path d="M76 36.5V40H79" stroke-width="2"/>` +
    `<rect x="63" y="52" width="10" height="9" fill="#7ec8f0" stroke-width="2.5"/><rect x="79" y="52" width="10" height="9" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<rect x="70" y="72" width="12" height="18" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M76 28V14" stroke-width="2.5"/><path d="M76 14L86 17L76 20Z" fill="#e8553d" stroke-width="2"/>` +
    `<rect x="14" y="62" width="44" height="32" rx="8" fill="#3b78e6"/>` +
    person(36, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f' }) +
    cheeks(58, 11, 36) +
    `<path d="M26 70V95M46 70V95" stroke="#26356b" stroke-width="5"/>`,
  어린이:
    `<path d="M86 84Q92 60 84 34" stroke-width="2"/>` +
    `<ellipse cx="84" cy="22" rx="10" ry="12" fill="#ffd23f"/>` +
    `<path d="M84 34L81 38H87Z" fill="#ffd23f" stroke-width="2"/>` +
    person(30, 96, 1.3, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(66, 96, 1.3, { hair: '#6b3e26', style: 'pony', shirt: '#e85d9a' }) +
    cheeks(62, 9, 30) +
    cheeks(62, 9, 66) +
    tube('M41 82L47 88', '#3b78e6', 5) +
    tube('M55 82L49 88', '#e85d9a', 5) +
    hand(48, 88, 4.5) +
    hand(84, 84, 4.5) +
    sparkle(12, 30, 6) +
    sparkle(50, 22, 5, '#e85d9a'),
  // ── 운동선수 ──
  농구선수:
    `<rect x="62" y="6" width="32" height="22" rx="2" fill="#fff"/>` +
    `<rect x="72" y="14" width="12" height="9" fill="#fff" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M70 28L73 40H83L86 28M76 28L77 40M80 28L79 40" stroke-width="2"/>` +
    `<path d="M68 28H88" stroke="#e8553d" stroke-width="4"/>` +
    person(34, 96, 1.5, { hair: '#2f2a26', style: 'short', shirt: '#8e4fc9' }) +
    `<path d="M26 66Q34 74 42 66" stroke="#fff" stroke-width="3"/>` +
    tube('M46 76L54 56', SKIN, 6) +
    `<circle cx="56" cy="44" r="11" fill="#ff9f1a"/>` +
    `<path d="M45 44H67M56 33V55M49 36Q54 44 49 52M63 36Q58 44 63 52" stroke-width="2"/>` +
    `<path d="M66 50q6 0 8-6" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="3 3"/>`,
  배구선수:
    `<circle cx="78" cy="20" r="10" fill="#fff"/>` +
    `<path d="M69 16Q78 22 87 16M70 25Q78 18 86 26" stroke="#3b78e6" stroke-width="3"/><path d="M78 10Q74 20 78 30" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M84 34l4 4M90 30l5 2" stroke="#9aa6c4" stroke-width="2.5"/>` +
    person(42, 80, 1.3, { hair: '#2f2a26', style: 'pony', shirt: '#e8553d' }) +
    tube('M50 66L64 38', SKIN, 5) +
    hand(66, 34, 5) +
    tube('M34 68L28 76', SKIN, 5) +
    `<path d="M4 62V96M96 62V96" stroke-width="4"/>` +
    `<path d="M10 62V84M16 62V84M22 62V84M28 62V84M34 62V84M40 62V84M46 62V84M52 62V84M58 62V84M64 62V84M70 62V84M76 62V84M82 62V84M88 62V84M4 68H96M4 74H96M4 80H96" stroke="#4a4f66" stroke-width="1.5"/>` +
    tube('M4 62H96', '#fff', 3) +
    `<path d="M4 84H96" stroke-width="2.5"/>`,
  테니스선수:
    `<path d="M2 90H98V98H2Z" fill="#43b04a"/><path d="M2 90H98" stroke="#fff" stroke-width="2"/>` +
    person(34, 96, 1.5, { hair: '#6b3e26', style: 'pony', shirt: '#fff' }) +
    tube('M16.5 40Q34 33 51.5 40', '#e8553d', 3.5) +
    `<path d="M28 66L34 72L40 66" stroke-width="2.5"/>` +
    tube('M46 78L60 66', SKIN, 6) +
    hand(62, 64, 5) +
    tube('M63 63L70 54', '#2f2a26', 4) +
    `<g transform="rotate(30 78 40)"><ellipse cx="78" cy="40" rx="11" ry="15" fill="#fff"/>` +
    `<path d="M72 27V53M78 25V55M84 27V53M67 34H89M67 40H89M67 46H89" stroke="#9aa6c4" stroke-width="1.5"/>` +
    `<ellipse cx="78" cy="40" rx="11" ry="15" stroke-width="9"/><ellipse cx="78" cy="40" rx="11" ry="15" stroke="#3b78e6" stroke-width="4.5"/></g>` +
    `<circle cx="88" cy="74" r="6" fill="#cfe34a"/><path d="M83 71q5 3 10 0" stroke="#fff" stroke-width="2"/>`,
  스케이트선수:
    `<rect x="2" y="84" width="96" height="12" rx="3" fill="#bfe6ff"/>` +
    `<path d="M4 50H18M8 58H22M2 42H14" stroke="#9aa6c4" stroke-width="2.5"/>` +
    tube('M42 58L26 68L14 72', '#3b78e6', 8) +
    `<path d="M6 69L14 67L16 75L6 77Z" fill="#2f2a26" stroke-width="2.5"/>` +
    `<path d="M3 81L20 77" stroke-width="3"/>` +
    tube('M42 56L66 42', '#3b78e6', 14) +
    tube('M44 58L60 68L54 80', '#3b78e6', 8) +
    `<path d="M48 78H60L62 84H46Z" fill="#2f2a26" stroke-width="2.5"/>` +
    `<path d="M40 88H68M50 84V88M58 84V88" stroke-width="3"/>` +
    tube('M64 44L48 49', '#26356b', 5) +
    tube('M66 46L74 60', '#3b78e6', 5) +
    hand(75, 62, 4) +
    head(76, 34, 9, '#ffd23f') +
    `<path d="M68 31H84" stroke="#e8553d" stroke-width="3"/>`,
  스키선수:
    `<path d="M2 50L22 28L36 42L54 20L76 44L98 30V60H2Z" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M2 52L98 92V98H2Z" fill="#fff"/>` +
    tube('M26 60L32 45', '#8a96b0', 1.5) +
    tube('M68 46L72 78', '#8a96b0', 1.5) +
    tube('M22 57L88 84.5Q95 87 94 80', '#e8553d', 3) +
    tube('M46 50L52 58L46 66', '#26356b', 7) +
    tube('M50 50L60 60L56 70', '#26356b', 7) +
    tube('M46 34L48 48', '#e8553d', 15) +
    tube('M52 36L66 44', '#e8553d', 5) +
    tube('M42 36L32 44', '#e8553d', 5) +
    hand(67, 45, 4) +
    hand(31, 45, 4) +
    head(48, 22, 10, '#e8553d') +
    `<rect x="39" y="18" width="18" height="7" rx="3.5" fill="#ffd23f" stroke-width="2.5"/>` +
    sparkle(14, 60, 5, '#7ec8f0') +
    sparkle(8, 70, 4, '#7ec8f0'),
  골프선수:
    `<path d="M2 84Q50 78 98 84V98H2Z" fill="#5fc24a"/>` +
    `<ellipse cx="86" cy="86" rx="6" ry="2" fill="${INK}"/>` +
    `<path d="M86 86V24" stroke-width="3"/>` +
    `<path d="M86 24L97 29L86 34Z" fill="#e8553d" stroke-width="2.5"/>` +
    person(34, 96, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f', cap: '#fff' }) +
    `<path d="M28 67L34 73L40 67" stroke-width="2.5"/>` +
    `<path d="M60 92V88" stroke-width="3"/>` +
    `<circle cx="60" cy="84" r="4" fill="#fff" stroke-width="2.5"/>` +
    tube('M54 66L70 34', '#8a96b0', 2) +
    `<path d="M66 30L76 26L78 32L70 35Z" fill="#4a4f66" stroke-width="2.5"/>` +
    tube('M22 80L50 70', '#ffd23f', 6) +
    tube('M46 80L52 70', '#ffd23f', 6) +
    hand(53, 68, 5.5) +
    `<path d="M80 40q6 6 4 14" stroke="#9aa6c4" stroke-width="2.5"/>`,
  씨름선수:
    `<ellipse cx="50" cy="90" rx="46" ry="8" fill="#f2d49a"/>` +
    `<path d="M22 82q-4 6 0 10M78 82q4 6 0 10" stroke="#c9b28a" stroke-width="2.5"/>` +
    tube('M41 76L38 90', SKIN, 9) +
    tube('M59 76L62 90', SKIN, 9) +
    `<path d="M32 70H68L66 82H34Z" fill="#26356b"/>` +
    `<ellipse cx="40" cy="81" rx="8" ry="3.5" stroke-width="9"/><ellipse cx="40" cy="81" rx="8" ry="3.5" stroke="#e8553d" stroke-width="5"/>` +
    `<ellipse cx="60" cy="81" rx="8" ry="3.5" stroke-width="9"/><ellipse cx="60" cy="81" rx="8" ry="3.5" stroke="#e8553d" stroke-width="5"/>` +
    tube('M36 52L20 54L18 36', SKIN, 8) +
    tube('M64 52L80 54L82 36', SKIN, 8) +
    `<circle cx="18" cy="33" r="6" fill="${SKIN}"/><circle cx="82" cy="33" r="6" fill="${SKIN}"/>` +
    `<path d="M30 72C26 56 34 44 50 44S74 56 70 72Z" fill="${SKIN}"/>` +
    `<path d="M44 62q6 4 12 0" stroke="#e8a27a" stroke-width="2.5"/>` +
    tube('M30 71H70', '#e8553d', 6) +
    head(50, 30, 13, '#2f2a26') +
    cheeks(36, 8, 50) +
    sparkle(10, 16, 5) +
    sparkle(90, 16, 5),
  마라톤선수:
    `<path d="M2 88H98V96H2Z" fill="#dfe8f5"/><path d="M10 92H24M40 92H54M70 92H84" stroke="#fff" stroke-width="3"/>` +
    `<path d="M4 44H18M8 52H22M4 60H16" stroke="#9aa6c4" stroke-width="2.5"/>` +
    tube('M46 60L34 72L22 72', SKIN, 5) +
    `<ellipse cx="19" cy="72" rx="6" ry="3.5" fill="#e8553d"/>` +
    tube('M50 36L40 44L38 54', SKIN, 5) +
    `<path d="M40 54H56L58 64H44Z" fill="#26356b"/>` +
    tube('M52 62L64 72L60 84', SKIN, 5) +
    `<ellipse cx="64" cy="85" rx="6" ry="3.5" fill="#e8553d"/>` +
    `<path d="M44 30H60L58 56H44Z" fill="#3b78e6"/>` +
    `<rect x="46" y="38" width="11" height="10" rx="1" fill="#fff" stroke-width="2"/>` +
    dot(48.5, 40.5, 1.1) +
    dot(54.5, 40.5, 1.1) +
    tube('M57 34L67 44L77 36', SKIN, 5) +
    head(56, 20, 10, '#2f2a26') +
    `<path d="M46.5 15.5Q56 11 65.5 15.5" stroke="#e8553d" stroke-width="3.5"/>` +
    drop(72, 8, 0.6),
  // ── 여럿이 함께 ──
  응원단:
    `<path d="M50 60V6" stroke-width="3"/>` +
    `<path d="M50 6C62 2 72 12 92 6V30C72 36 62 26 50 30Z" fill="#3b78e6"/>` +
    `<path d="M50 18C62 14 72 24 92 18" stroke="#fff" stroke-width="4"/>` +
    person(20, 96, 1.2, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f' }) +
    person(80, 96, 1.2, { hair: '#6b3e26', style: 'pony', shirt: '#ffd23f' }) +
    person(50, 96, 1.3, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M8 47H32', '#e8553d', 2.5) +
    tube('M68 47H92', '#e8553d', 2.5) +
    tube('M37 43.5H63', '#e8553d', 2.5) +
    tube('M28 80L36 60', '#ffd23f', 5) +
    tube('M72 80L64 60', '#ffd23f', 5) +
    hand(37, 57, 4.5) +
    hand(63, 57, 4.5) +
    tube('M60 78L52 62', '#3b78e6', 5) +
    hand(50, 60, 4.5) +
    tube('M10 80L6 62', '#ffd23f', 5) +
    tube('M90 80L94 62', '#ffd23f', 5) +
    hand(6, 58, 4.5) +
    hand(94, 58, 4.5) +
    sparkle(18, 14, 5, '#e85d9a') +
    sparkle(30, 24, 4),
  치어리더:
    person(50, 80, 1.35, { hair: '#6b3e26', style: 'pony', shirt: '#e8553d' }) +
    `<path d="M34 78H66L72 93H28Z" fill="#3b78e6"/>` +
    `<path d="M41 80L38 91M50 80V92M59 80L62 91" stroke="#fff" stroke-width="2.5"/>` +
    tube('M38 64L22 38', SKIN, 5) +
    tube('M62 64L78 38', SKIN, 5) +
    pompom(19, 30, '#ffd23f') +
    pompom(81, 30, '#ffd23f') +
    sparkle(10, 60, 5) +
    sparkle(90, 60, 5, '#e85d9a'),
  서커스단:
    `<path d="M50 16V5" stroke-width="3"/><path d="M50 5L61 8L50 11Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M14 90V52H86V90Z" fill="#fff"/>` +
    `<path d="M22 52H30V90H22ZM38 52H46V90H38ZM54 52H62V90H54ZM70 52H78V90H70Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M14 90V52H86V90" stroke-width="3.5"/>` +
    `<path d="M8 54L50 16L92 54Z" fill="#e8553d"/>` +
    `<path d="M50 16L30 54H42ZM50 16L58 54H70Z" fill="#fff" stroke-width="2.5"/>` +
    [16, 28, 40, 52, 64, 76, 88].map((x) => `<circle cx="${x}" cy="55" r="4" fill="#ffd23f" stroke-width="2.5"/>`).join('') +
    `<path d="M40 90V72Q50 62 60 72V90Z" fill="#26356b"/>` +
    person(20, 96, 0.95, { hair: '#ff9f1a', style: 'bald', shirt: '#43b04a' }) +
    `<path d="M13 61L20 44L27 61Z" fill="#ffd23f" stroke-width="2.5"/>` +
    dot(20, 69, 2.6, '#e8553d') +
    `<circle cx="80" cy="86" r="9" fill="#3b78e6"/>` +
    star(80, 86, 5, '#ffd23f', 2),
  인어공주:
    `<path d="M20 96C20 80 34 74 50 76C66 74 80 82 80 96Z" fill="#8a96b0"/>` +
    `<path d="M26 44C22 20 32 14 42 14S62 20 58 44L60 62H24Z" fill="#ffc933"/>` +
    `<path d="M30 56H52C54 68 60 74 70 74L72 82C54 86 36 80 30 56Z" fill="#3aa89a"/>` +
    `<path d="M40 64q3 3 6 0M46 72q3 3 6 0M56 76q3 3 6 0" stroke="#1f7a70" stroke-width="2"/>` +
    `<path d="M70 74C76 64 86 64 92 68C86 72 82 75 78 78C84 80 88 84 90 90C82 90 74 86 70 82Z" fill="#3aa89a"/>` +
    `<path d="M32 58C32 46 36 42 42 42S52 46 52 58Z" fill="${SKIN}"/>` +
    `<circle cx="37" cy="49" r="4" fill="#ff9aa8" stroke-width="2.5"/><circle cx="47" cy="49" r="4" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<circle cx="42" cy="30" r="12" fill="${SKIN}"/>` +
    `<path d="M30 28C30 16 54 16 54 28C50 22 34 22 30 28Z" fill="#ffc933"/>` +
    dot(37.5, 31, 1.9) +
    dot(46.5, 31, 1.9) +
    `<path d="M39 36q3 2 6 0" stroke-width="2"/>` +
    `<path d="M34 18L36 9L40 14L42 7L44 14L48 9L50 18Z" fill="${HL}" stroke-width="2.5"/>` +
    `<circle cx="80" cy="22" r="4" fill="#bfe6ff" stroke-width="2.5"/><circle cx="88" cy="36" r="3" fill="#bfe6ff" stroke-width="2.5"/><circle cx="76" cy="44" r="2.5" fill="#bfe6ff" stroke-width="2"/>` +
    sea(90),
  훈장님:
    person(34, 96, 1.5, { hair: '#dfe8f5', style: 'short', shirt: '#f2ead3', beard: '#fff' }) +
    `<path d="M24 57C24 72 34 82 34 82S44 72 44 57C40 61 28 61 24 57Z" fill="#fff"/>` +
    `<path d="M16 37V29L22 23V15L34 8L46 15V23L52 29V37Z" fill="#2f2a26"/>` +
    `<path d="M22 29H46M26 21H42" stroke="#8a96b0" stroke-width="2"/>` +
    `<path d="M24 67L32 78M44 67L36 78" stroke-width="2.5"/>` +
    `<rect x="44" y="70" width="14" height="18" rx="1" fill="#3b78e6"/>` +
    `<path d="M47.5 72V86" stroke="#fff" stroke-width="2" stroke-dasharray="3 2"/>` +
    hand(44, 80, 5) +
    person(80, 84, 0.9, { hair: '#2f2a26', style: 'pony', shirt: '#ff9aa8' }) +
    `<rect x="62" y="80" width="34" height="6" rx="1" fill="#9a5b2e"/>` +
    `<path d="M66 86V94M92 86V94" stroke-width="3.5"/>` +
    `<path d="M66 80Q72 74 79 78Q86 74 92 80Z" fill="#fff" stroke-width="2.5"/>`,
  세쌍둥이:
    [21, 50, 79]
      .map(
        (x) =>
          person(x, 96, 1.25, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f' }) +
          cheeks(63, 8, x) +
          star(x, 85, 5, '#e8553d', 2) +
          `<path d="M${x - 5} ${37}L${x} ${40}L${x + 5} ${37}V${43}L${x} ${40}L${x - 5} ${43}Z" fill="#ff9aa8" stroke-width="2"/>`,
      )
      .join('') +
    sparkle(35, 20, 6) +
    sparkle(65, 20, 6) +
    sparkle(50, 12, 5, '#e85d9a'),
  대가족:
    `<path d="M50 26C44 18 36 22 40 28L50 36L60 28C64 22 56 18 50 26Z" fill="#ff5c70" stroke-width="2.5"/>` +
    person(18, 74, 0.95, { hair: '#dfe8f5', style: 'bald', shirt: '#8a96b0', beard: '#fff' }) +
    person(39, 74, 0.95, { hair: '#dfe8f5', style: 'bun', shirt: '#8e4fc9' }) +
    person(61, 74, 0.95, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(82, 74, 0.95, { hair: '#6b3e26', style: 'long', shirt: '#e85d9a' }) +
    person(28, 96, 0.7, { hair: '#6b3e26', style: 'pony', shirt: '#ffd23f' }) +
    person(50, 96, 0.6, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    person(72, 96, 0.7, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }),
  // ── 고치고 가꾸는 사람 ──
  조경사:
    `<path d="M58 80H90L86 94H62Z" fill="#9a5b2e"/>` +
    `<path d="M74 80V36" stroke="#6b3e26" stroke-width="5"/>` +
    `<circle cx="74" cy="60" r="14" fill="#43b04a"/>` +
    `<circle cx="74" cy="28" r="10" fill="#43b04a"/>` +
    `<ellipse cx="56" cy="76" rx="3" ry="1.6" fill="#5fc24a" stroke-width="2" transform="rotate(30 56 76)"/><ellipse cx="94" cy="72" rx="3" ry="1.6" fill="#5fc24a" stroke-width="2" transform="rotate(-30 94 72)"/>` +
    person(26, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#3a9e47', cap: '#ffd23f' }) +
    tube('M40 78L52 56', '#e8553d', 4) +
    tube('M42 66L52 56', '#e8553d', 4) +
    tube('M52 56L64 42', '#8a96b0', 3) +
    tube('M52 56L66 50', '#8a96b0', 3) +
    hand(40, 78, 5) +
    hand(42, 66, 5) +
    sparkle(62, 30, 5),
  정비사:
    `<path d="M46 76V60L56 56L64 44H84L92 56V76Z" fill="#e8553d"/>` +
    `<path d="M66 48H82L86 56H62Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    tube('M47 58L58 38', '#e8553d', 4) +
    `<circle cx="58" cy="78" r="8" fill="#2f2a26"/><circle cx="58" cy="78" r="3" fill="#8a96b0" stroke-width="2"/>` +
    `<circle cx="82" cy="78" r="8" fill="#2f2a26"/><circle cx="82" cy="78" r="3" fill="#8a96b0" stroke-width="2"/>` +
    `<path d="M40 94H98" stroke="#8a96b0" stroke-width="3"/>` +
    person(24, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#3b78e6' }) +
    `<path d="M16 70V96M32 70V96" stroke="#26356b" stroke-width="3"/>` +
    tube('M34 80L42 66', '#3b78e6', 6) +
    tube('M44 62L40 42', '#8a96b0', 4) +
    `<circle cx="40" cy="38" r="6.5" fill="#8a96b0"/>` +
    `<rect x="38" y="29" width="4" height="8" fill="#fff7e0" stroke="none"/>` +
    hand(43, 64, 5),
  배관공:
    tube('M46 26H80V92', '#8a96b0', 10) +
    `<rect x="72" y="18" width="16" height="16" rx="3" fill="#dfe8f5"/>` +
    `<rect x="56" y="19" width="7" height="14" rx="2" fill="#dfe8f5"/>` +
    `<rect x="73" y="50" width="14" height="7" rx="2" fill="#dfe8f5"/>` +
    drop(92, 40, 0.8) +
    sparkle(92, 60, 5) +
    `<path d="M12 60V86" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M4 94Q4 84 12 84Q20 84 20 94Z" fill="#e8553d"/>` +
    person(42, 96, 1.4, { hair: '#6b3e26', style: 'short', shirt: '#43b04a', cap: '#ff9f1a' }) +
    `<path d="M34 72V96M50 72V96" stroke="#2f7a38" stroke-width="3"/>` +
    tube('M54 80L64 70', '#43b04a', 6) +
    hand(65, 68, 5) +
    tube('M65 68L74 62', '#e8553d', 4) +
    `<path d="M72 56H84V62H78V68H72Z" fill="#e8553d"/>`,
  판사:
    person(50, 74, 1.35, { hair: '#8a96b0', style: 'short', shirt: '#2f2a26', glasses: true }) +
    `<path d="M44 50L50 60L56 50Z" fill="#fff" stroke-width="2.5"/>` +
    tube('M62 60L72 46', '#2f2a26', 6) +
    hand(73, 43, 5) +
    tube('M74 42L82 34', '#b5793a', 3) +
    `<rect x="75" y="28" width="18" height="9" rx="3" fill="#9a5b2e" transform="rotate(45 84 32.5)"/>` +
    `<path d="M4 68H96V94H4Z" fill="#9a5b2e"/>` +
    `<rect x="12" y="74" width="28" height="14" fill="#b5793a" stroke-width="2.5"/><rect x="60" y="74" width="28" height="14" fill="#b5793a" stroke-width="2.5"/>` +
    `<circle cx="50" cy="81" r="6" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="76" y="62" width="16" height="6" rx="2" fill="#6b3e26"/>`,
  프로그래머:
    `<rect x="42" y="12" width="54" height="42" rx="4" fill="#26356b"/>` +
    `<path d="M49 21H62" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M54 28H76" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M54 35H68" stroke="#5fc24a" stroke-width="3"/>` +
    `<path d="M59 42H84" stroke="#ff9aa8" stroke-width="3"/>` +
    `<path d="M49 48H66" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M69 54V62" stroke-width="5"/>` +
    `<rect x="59" y="61" width="20" height="5" rx="2" fill="#8a96b0"/>` +
    `<path d="M40 70H98" stroke="#b5793a" stroke-width="5"/>` +
    person(22, 96, 1.4, { hair: '#2f2a26', style: 'short', shirt: '#8e4fc9', glasses: true }) +
    `<path d="M5 52C5 24 39 24 39 52" stroke="#e8553d" stroke-width="4"/>` +
    `<rect x="1.5" y="45" width="7" height="13" rx="3" fill="#e8553d"/><rect x="35.5" y="45" width="7" height="13" rx="3" fill="#e8553d"/>` +
    `<rect x="44" y="62" width="28" height="6" rx="2" fill="#dfe8f5"/>` +
    tube('M32 80L44 68', '#8e4fc9', 6) +
    hand(46, 66, 5),
};
