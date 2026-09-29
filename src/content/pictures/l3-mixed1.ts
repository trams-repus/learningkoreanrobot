// 악기·놀이·운동·행사·명절·때 그림 묶음 (3단계). 그림 규칙은 docs/picture-style.md.
// 국악기(꽹과리·징 / 대금·단소 / 거문고·해금)는 크기·드는 모습·줄 수로, 무대 행사(학예회·음악회·연극·콘서트·인형극)는 무대 위 주인공 소품으로 구별했다.
import { INK, SKIN, HL, dot, person, stick, sparkle, tube, cheeks } from '../pictureKit.ts';

/** 음표 한 개 (머리 x,y) — 글자 대신 도형으로 */
const note = (x: number, y: number, fill = INK) =>
  `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.8" fill="${fill}" transform="rotate(-20 ${x} ${y})" stroke-width="2"/>` +
  `<path d="M${x + 4.5} ${y - 1}V${y - 20}q6 3 8 8" stroke-width="2.5"/>`;

/** 무대 (뒷벽·바닥) — 공연하는 사람은 바닥 y=74 위에 선다 */
const stageBack = (wall = '#3a3f6b') =>
  `<rect x="6" y="6" width="88" height="68" fill="${wall}"/><rect x="4" y="70" width="92" height="10" fill="#c98b4f"/>`;
/** 무대 막 (양옆 커튼·위 주름막) */
const curtains = (c = '#e8553d') =>
  `<path d="M6 6H24C19 28 22 50 14 72H6Z" fill="${c}"/><path d="M94 6H76C81 28 78 50 86 72H94Z" fill="${c}"/>` +
  `<path d="M6 6H94V15Q83 22 72 15Q61 22 50 15Q39 22 28 15Q17 22 6 15Z" fill="#c62f3f"/>`;
/** 관객 뒷모습 한 줄 */
const crowd = (y: number, xs: number[], shirts: string[]) =>
  xs
    .map(
      (x, i) =>
        `<path d="M${x - 11} ${y + 14}C${x - 11} ${y + 4} ${x - 6} ${y + 2} ${x} ${y + 2}S${x + 11} ${y + 4} ${x + 11} ${y + 14}Z" fill="${shirts[i % shirts.length]}"/>` +
        `<circle cx="${x}" cy="${y - 4}" r="7" fill="${i % 2 ? '#5a3b24' : '#2f2a26'}"/>`,
    )
    .join('');
/** 색동 소매 (어깨 → 손) */
const saekdong = (x1: number, y1: number, x2: number, y2: number) => {
  const cs = ['#e8553d', '#ffd23f', '#43b04a', '#3b78e6', '#e85d9a'];
  const seg = cs
    .map((c, i) => {
      const a = i / cs.length;
      const b = (i + 1) / cs.length;
      return `<path d="M${(x1 + (x2 - x1) * a).toFixed(1)} ${(y1 + (y2 - y1) * a).toFixed(1)}L${(x1 + (x2 - x1) * b).toFixed(1)} ${(y1 + (y2 - y1) * b).toFixed(1)}" stroke="${c}" stroke-width="9" stroke-linecap="butt"/>`;
    })
    .join('');
  return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="16"/>` + seg;
};
/** 한복 입은 여자아이 (앞모습). x = 가운데, 발밑 y=94 */
const hanbokGirl = (x: number, hand = '') =>
  `<path d="M${x - 12} 60L${x - 24} 94H${x + 24}L${x + 12} 60Z" fill="#e8553d"/>` +
  saekdong(x - 12, 50, x - 22, 72) +
  saekdong(x + 12, 50, x + 22, 72) +
  `<path d="M${x - 15} 64C${x - 15} 50 ${x - 9} 44 ${x} 44S${x + 15} 50 ${x + 15} 64Z" fill="#ffd23f"/>` +
  `<path d="M${x} 52l-6 12M${x} 52l5 12" stroke="#e8553d" stroke-width="4"/>` +
  `<path d="M${x - 14} 34C${x - 16} 16 ${x + 16} 16 ${x + 14} 34L${x + 14} 44H${x - 14}Z" fill="#2f2a26"/>` +
  `<circle cx="${x}" cy="31" r="12" fill="${SKIN}"/>` +
  `<path d="M${x - 12} 28C${x - 12} 16 ${x + 12} 16 ${x + 12} 28C${x + 6} 22 ${x - 6} 22 ${x - 12} 28Z" fill="#2f2a26"/>` +
  dot(x - 4.5, 31, 2) +
  dot(x + 4.5, 31, 2) +
  `<path d="M${x - 4} 36q4 3 8 0" stroke-width="2.2"/>` +
  cheeks(35, 8, x) +
  hand;
/** 풍선 (끈 끝 x2,y2) */
const balloon = (x: number, y: number, fill: string, x2: number, y2: number) =>
  `<path d="M${x} ${y + 11}Q${x + 3} ${(y + y2) / 2} ${x2} ${y2}" stroke-width="2"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="8.5" ry="10.5" fill="${fill}"/><path d="M${x - 2} ${y + 10}h4l-2 3z" fill="${fill}" stroke-width="2"/>` +
  `<path d="M${x - 4} ${y - 5}q2-3 4-3" stroke="#fff" stroke-width="2.5"/>`;
/** 삼각 깃발 줄 (만국기) */
const bunting = (y: number) =>
  `<path d="M4 ${y}Q50 ${y + 14} 96 ${y}" stroke-width="2.5"/>` +
  [12, 26, 40, 54, 68, 82]
    .map((x, i) => {
      const yy = y + 14 * (1 - ((x - 50) / 46) ** 2) * 0.5 * 2 * 0.5;
      const c = ['#e8553d', '#ffd23f', '#3b78e6', '#43b04a', '#e85d9a', '#ff9f1a'][i];
      return `<path d="M${x - 5} ${yy.toFixed(1)}L${x + 5} ${yy.toFixed(1)}L${x} ${(yy + 11).toFixed(1)}Z" fill="${c}" stroke-width="2.5"/>`;
    })
    .join('');

export const PICS: Record<string, string> = {
  // ── 악기 ──
  꽹과리:
    `<path d="M34 20Q42 4 52 19" stroke="#e8553d" stroke-width="5"/><path d="M42 8V2" stroke="#e8553d" stroke-width="4"/>` +
    `<circle cx="46" cy="52" r="31" fill="#b88a10"/>` +
    `<circle cx="42" cy="48" r="31" fill="#e0a800"/>` +
    `<circle cx="42" cy="48" r="23" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M24 40q6-12 18-14" stroke="#fff" stroke-width="3.5"/>` +
    tube('M88 94L82 62', '#c98b4f', 4) +
    `<circle cx="81" cy="58" r="6" fill="#9a5b2e"/>` +
    `<path d="M76 50l-6-4M74 60h-6" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M82 20l6-6M86 32l8-2M76 12l2-8" stroke="#9aa6c4" stroke-width="3"/>`,
  징:
    tube('M16 94V16', '#9a5b2e', 6) +
    tube('M84 94V16', '#9a5b2e', 6) +
    tube('M10 14H90', '#6b3e26', 6) +
    `<path d="M8 94H26M74 94H92" stroke-width="5"/>` +
    `<path d="M36 16L40 32M64 16L60 32" stroke="#e8553d" stroke-width="3.5"/>` +
    `<circle cx="50" cy="56" r="27" fill="#e0a800"/>` +
    `<circle cx="50" cy="56" r="20" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M34 50q4-10 14-12" stroke="#fff" stroke-width="3.5"/>` +
    tube('M40 96L58 76', '#c98b4f', 4) +
    `<circle cx="62" cy="71" r="9" fill="#fff"/><path d="M55 76L68 66" stroke="#e8553d" stroke-width="3"/>`,
  거문고:
    `<g transform="rotate(-18 50 50)">` +
    `<path d="M4 34H88C95 34 97 42 97 50S95 66 88 66H4Z" fill="#8a4f24"/>` +
    `<path d="M5 32V68" stroke="#3a2a20" stroke-width="7"/>` +
    [22, 30, 38, 46, 54, 62, 70].map((x, i) => `<rect x="${x}" y="${40 + i * 0.6}" width="5" height="${16 - i * 1.2}" rx="1.5" fill="#f2d9a8" stroke-width="2"/>`).join('') +
    `<path d="M8 39H93M8 44.5H95M8 50H96M8 55.5H95M8 61H93" stroke="#fff7e0" stroke-width="1.8"/>` +
    `</g>` +
    tube('M56 94L88 70', '#e0b060', 3.5),
  해금:
    `<path d="M30 58Q50 50 92 58" stroke="#6b3e26" stroke-width="4.5"/>` +
    tube('M50 8V74', '#9a5b2e', 6) +
    tube('M40 14H60', '#6b3e26', 4) +
    tube('M40 26H60', '#6b3e26', 4) +
    `<path d="M47 16V76M53 16V76" stroke="#fff7e0" stroke-width="1.5"/>` +
    `<path d="M30 76C30 68 70 68 70 76V88C70 96 30 96 30 88Z" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="76" rx="20" ry="7" fill="#6b3e26"/>` +
    `<path d="M32 62Q50 55 88 62" stroke="#fff" stroke-width="2"/>` +
    tube('M88 52V66', '#6b3e26', 3) +
    `<path d="M47 36V56" stroke="#e8553d" stroke-width="3"/>` +
    note(18, 36, '#3b78e6'),
  대금:
    `<g transform="rotate(-24 50 50)">` +
    `<rect x="2" y="43" width="96" height="15" rx="7" fill="#d9b25e"/>` +
    `<path d="M22 43V58M48 43V58M76 43V58" stroke="#9a5b2e" stroke-width="3.5"/>` +
    dot(12, 50.5, 3.4) +
    `<circle cx="32" cy="50.5" r="3.4" fill="#fff" stroke-width="2"/>` +
    [56, 63, 70, 83, 90].map((x) => dot(x, 50.5, 3)).join('') +
    `</g>` +
    `<path d="M91 36C94 46 90 54 94 64" stroke="#e8553d" stroke-width="4"/>` +
    note(22, 82, '#3b78e6') +
    note(64, 84, '#e8553d'),
  단소:
    `<rect x="41" y="8" width="18" height="86" rx="7" fill="#d9b25e"/>` +
    `<path d="M45 9Q50 20 55 9Z" fill="#6b3e26"/>` +
    `<path d="M41 34H59M41 66H59" stroke="#9a5b2e" stroke-width="3.5"/>` +
    [44, 53, 76, 85].map((y) => dot(50, y, 3.4)).join('') +
    note(20, 40, '#3b78e6') +
    note(78, 56, '#e8553d'),
  소고:
    tube('M46 62V94', '#9a5b2e', 7) +
    `<path d="M14 40V54C14 70 78 70 78 54V40Z" fill="#e8553d"/>` +
    `<path d="M22 60V66M34 64V70M46 65V71M58 64V70M70 60V66" stroke="#ffd23f" stroke-width="3"/>` +
    `<ellipse cx="46" cy="40" rx="32" ry="20" fill="#fff2d6"/>` +
    `<ellipse cx="46" cy="40" rx="25" ry="14" stroke="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="46" cy="40" r="5" fill="#3b78e6" stroke-width="2"/>` +
    tube('M70 6L90 32', '#e0b060', 3) +
    `<path d="M84 44l8 2M80 52l8 6" stroke="#9aa6c4" stroke-width="3"/>`,
  트롬본:
    `<path d="M24 30C16 30 10 20 6 10V58C10 48 16 40 24 40Z" fill="#ffd23f"/>` +
    `<ellipse cx="6" cy="34" rx="4" ry="24" fill="#e0a800"/>` +
    tube('M24 35H62', '#ffc933', 5) +
    tube('M40 35V66', '#ffc933', 4) +
    tube('M40 66H90C96 66 96 80 90 80H30', '#ffc933', 5) +
    tube('M62 35V66', '#ffc933', 3) +
    `<path d="M30 76V84L22 86V74L30 76Z" fill="#e0a800" stroke-width="2.5"/>` +
    `<rect x="80" y="62" width="6" height="22" rx="2" fill="#e0a800" stroke-width="2.5"/>`,
  튜바:
    tube('M60 48H78V80H60', '#ffc933', 6) +
    tube('M32 58H14', '#ffc933', 4) +
    `<path d="M10 52H16V64H10Z" fill="#e0a800" stroke-width="2.5"/>` +
    `<path d="M16 12C30 18 34 24 36 36H56C58 24 62 18 76 12Z" fill="#ffd23f"/>` +
    `<ellipse cx="46" cy="12" rx="30" ry="6" fill="#e0a800"/>` +
    `<rect x="30" y="34" width="32" height="58" rx="15" fill="#ffc933"/>` +
    `<ellipse cx="46" cy="64" rx="7" ry="14" fill="#fff7e0"/>` +
    [66, 74].map((x) => `<rect x="${x - 3}" y="36" width="6" height="16" rx="2" fill="#ffd23f" stroke-width="2.5"/>`).join('') +
    `<path d="M36 44q4-6 8-6" stroke="#fff" stroke-width="3"/>`,
  호른:
    tube('M16 50a30 30 0 1 0 60 0a30 30 0 1 0 -60 0', '#ffc933', 7) +
    tube('M30 50a16 16 0 1 0 32 0a16 16 0 1 0 -32 0', '#ffc933', 5) +
    `<path d="M62 70C72 74 80 72 86 64L96 92C84 94 72 90 60 82Z" fill="#ffd23f"/>` +
    `<ellipse cx="91" cy="78" rx="5" ry="15" fill="#e0a800" transform="rotate(-18 91 78)"/>` +
    [40, 48, 56].map((x) => `<rect x="${x - 3}" y="26" width="6" height="14" rx="2" fill="#ffd23f" stroke-width="2.5"/>`).join('') +
    tube('M28 28L12 14', '#ffc933', 3) +
    `<path d="M8 8L14 12L10 16Z" fill="#e0a800" stroke-width="2.5"/>`,
  클라리넷:
    `<g transform="rotate(22 50 50)">` +
    `<path d="M45 4H55L54 16H46Z" fill="#2e3350"/>` +
    `<rect x="44" y="14" width="12" height="5" rx="1.5" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<rect x="43" y="19" width="14" height="60" fill="#2e3350"/>` +
    `<rect x="42" y="44" width="16" height="5" rx="1.5" fill="#dfe8f5" stroke-width="2.5"/>` +
    [26, 34, 56, 64, 72].map((y) => `<circle cx="50" cy="${y}" r="3.2" fill="#dfe8f5" stroke-width="2"/>`).join('') +
    `<path d="M43 79H57L66 96H34Z" fill="#2e3350"/>` +
    `</g>`,
  콘트라베이스:
    `<path d="M62 92V97" stroke-width="4"/>` +
    `<path d="M62 34C75 34 81 40 77 50C75 56 75 58 79 62C91 70 91 88 77 93H47C33 88 33 70 45 62C49 58 49 56 47 50C43 40 49 34 62 34Z" fill="#9a4e1e"/>` +
    `<path d="M49 68C45 72 49 78 47 82M75 68C79 72 75 78 77 82" stroke-width="2.5"/>` +
    `<rect x="58" y="8" width="8" height="58" rx="2" fill="${INK}"/>` +
    `<circle cx="62" cy="8" r="4.5" fill="#6b3e26"/>` +
    `<rect x="53" y="80" width="18" height="4" rx="1" fill="#f2c14e" stroke-width="2"/>` +
    `<path d="M60 12V84M64 12V84" stroke="#fff" stroke-width="1.2"/>` +
    person(20, 96, 0.95, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }),
  하프:
    `<rect x="12" y="86" width="30" height="9" rx="3" fill="#9a5b2e"/>` +
    [
      [28, 13, 80],
      [34, 12, 73],
      [40, 13, 66],
      [46, 15, 58],
      [52, 18, 51],
      [58, 21, 44],
      [64, 23, 36],
      [70, 25, 29],
    ]
      .map(([x, y1, y2], i) => `<path d="M${x} ${y1}V${y2}" stroke="${i % 3 === 0 ? '#e8553d' : '#8a96b0'}" stroke-width="2"/>`)
      .join('') +
    tube('M26 88L80 22', '#c98b4f', 10) +
    tube('M20 88V16', '#e0a800', 6) +
    tube('M20 16C34 4 54 22 82 22', '#e0a800', 6) +
    sparkle(88, 60, 6) +
    note(84, 88, '#3b78e6'),
  우쿨렐레:
    `<g transform="rotate(-32 50 54)">` +
    `<rect x="46" y="4" width="8" height="42" fill="#9a5b2e"/>` +
    `<rect x="42" y="0" width="16" height="11" rx="3" fill="#6b3e26"/>` +
    `<circle cx="40" cy="3" r="2.5" fill="#fff" stroke-width="2"/><circle cx="40" cy="9" r="2.5" fill="#fff" stroke-width="2"/><circle cx="60" cy="3" r="2.5" fill="#fff" stroke-width="2"/><circle cx="60" cy="9" r="2.5" fill="#fff" stroke-width="2"/>` +
    `<g fill="#f2b45a"><circle cx="50" cy="48" r="14" stroke-width="7"/><circle cx="50" cy="72" r="19" stroke-width="7"/><circle cx="50" cy="48" r="14" stroke="none"/><circle cx="50" cy="72" r="19" stroke="none"/></g>` +
    `<circle cx="50" cy="58" r="6" fill="#5a3b24"/>` +
    `<rect x="42" y="78" width="16" height="4" rx="1.5" fill="#6b3e26" stroke-width="2"/>` +
    `<path d="M47.5 8V80M49.2 8V80M50.8 8V80M52.5 8V80" stroke="#fff" stroke-width="0.9"/>` +
    `</g>` +
    `<circle cx="84" cy="24" r="6" fill="#ff5c70" stroke-width="2.5"/><circle cx="84" cy="24" r="2.5" fill="#ffd23f" stroke="none"/>` +
    note(20, 78, '#3b78e6'),
  아코디언:
    `<path d="M28 30L34 26L40 30L46 26L52 30L58 26L64 30L70 26L72 30V80L70 84L64 80L58 84L52 80L46 84L40 80L34 84L28 80Z" fill="#3b78e6"/>` +
    `<path d="M34 26V84M40 30V80M46 26V84M52 30V80M58 26V84M64 30V80M70 26V84" stroke-width="2"/>` +
    `<rect x="6" y="22" width="24" height="64" rx="4" fill="#e8553d"/>` +
    `<rect x="10" y="28" width="12" height="52" fill="#fff"/>` +
    `<path d="M10 34.5H22M10 41H22M10 47.5H22M10 54H22M10 60.5H22M10 67H22M10 73.5H22" stroke-width="1.8"/>` +
    [38, 51, 64].map((y) => `<rect x="10" y="${y - 2}" width="7" height="4" fill="${INK}" stroke="none"/>`).join('') +
    `<rect x="70" y="22" width="24" height="64" rx="4" fill="#e8553d"/>` +
    [
      [78, 34],
      [86, 34],
      [78, 46],
      [86, 46],
      [78, 58],
      [86, 58],
      [78, 70],
      [86, 70],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke-width="2"/>`)
      .join('') +
    `<path d="M40 16l-6 4 6 4M60 16l6 4-6 4" stroke="#9aa6c4" stroke-width="3"/>`,
  메트로놈:
    `<rect x="24" y="86" width="52" height="9" rx="2" fill="#6b3e26"/>` +
    `<path d="M28 88L40 12H60L72 88Z" fill="#9a5b2e"/>` +
    `<path d="M37 80L45 22H55L63 80Z" fill="#fff2d6"/>` +
    `<path d="M46 32H54M46 42H54M47 52H53M47 62H53" stroke="#9a5b2e" stroke-width="2"/>` +
    `<path d="M50 74L64 18" stroke-width="3.5"/>` +
    `<rect x="55" y="34" width="10" height="8" rx="2" fill="#dfe8f5" transform="rotate(14 60 38)" stroke-width="2.5"/>` +
    `<circle cx="50" cy="74" r="3" fill="${INK}"/>` +
    `<path d="M50 74L36 18" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    `<path d="M26 14Q44 0 62 8M74 14Q84 20 88 30" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M20 20l4-6M84 38l6 2" stroke="#9aa6c4" stroke-width="3"/>`,
  보면대:
    `<path d="M50 88L28 96M50 88L72 96M50 88V96" stroke-width="4"/>` +
    tube('M50 60V90', '#2e3350', 4) +
    `<path d="M12 10H88L84 58H16Z" fill="#2e3350"/>` +
    `<rect x="22" y="14" width="56" height="38" fill="#fff"/>` +
    `<path d="M26 22H74M26 26H74M26 30H74M26 38H74M26 42H74M26 46H74" stroke="#8a96b0" stroke-width="1.5"/>` +
    [
      [34, 28],
      [44, 24],
      [56, 30],
      [64, 26],
      [36, 44],
      [48, 40],
      [62, 44],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2.3" fill="${INK}" stroke="none"/><path d="M${x + 2.6} ${y}V${y - 8}" stroke-width="1.6"/>`)
      .join('') +
    `<rect x="12" y="56" width="76" height="7" rx="2" fill="#2e3350"/>`,

  // ── 놀이·운동 ──
  비석치기:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M26 92H40" stroke="#fff" stroke-width="3" stroke-dasharray="3 3"/>` +
    `<path d="M68 92L70 46C70 40 86 40 88 46L90 92Z" fill="#b8c4d8"/>` +
    `<path d="M74 54q4-2 8 0" stroke="#8a96b0" stroke-width="2.5"/>` +
    stick(26, 30, 'M0 10V36M0 16L14 6M0 16L-10 30M0 36L-8 60M0 36L8 60') +
    `<ellipse cx="55" cy="46" rx="9" ry="4.5" fill="#8a96b0" transform="rotate(-10 55 46)"/>` +
    `<path d="M40 38q-4 2-6 0M44 50H34M42 58l-6 2" stroke="#9aa6c4" stroke-width="3"/>`,
  투호:
    `<path d="M24 40Q44 6 62 34" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    tube('M16 50L28 36', '#e0b060', 3) +
    `<path d="M14 52L19 47" stroke="#e8553d" stroke-width="5"/>` +
    tube('M54 44L46 12', '#e0b060', 3) +
    tube('M60 44L64 10', '#e0b060', 3) +
    tube('M66 46L80 18', '#e0b060', 3) +
    `<path d="M46 12L47.5 18M64 10L63.7 16M80 18L77.5 23" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M50 44H74V52C88 58 90 76 82 94H42C34 76 36 58 50 52Z" fill="#4a90e2"/>` +
    `<path d="M40 70H84" stroke="#fff" stroke-width="4"/>` +
    `<rect x="47" y="40" width="30" height="6" rx="2" fill="#2f6fb3"/>` +
    `<circle cx="44" cy="50" r="4" fill="#ffd23f" stroke-width="2.5"/><circle cx="80" cy="50" r="4" fill="#ffd23f" stroke-width="2.5"/>`,
  인형극:
    `<rect x="12" y="10" width="76" height="40" fill="#3a3f6b"/>` +
    `<path d="M22 50C22 38 28 34 34 34S46 38 46 50Z" fill="#43b04a"/>` +
    `<circle cx="34" cy="28" r="9" fill="${SKIN}"/><path d="M25 26C25 16 43 16 43 26C38 22 30 22 25 26Z" fill="#e8862e"/>` +
    dot(31, 29, 1.8) +
    dot(37, 29, 1.8) +
    `<path d="M31 33q3 2 6 0" stroke-width="2"/>` +
    `<path d="M54 50C54 38 60 34 66 34S78 38 78 50Z" fill="#8e4fc9"/>` +
    `<circle cx="59" cy="20" r="4" fill="#9a5b2e"/><circle cx="73" cy="20" r="4" fill="#9a5b2e"/>` +
    `<circle cx="66" cy="28" r="9" fill="#9a5b2e"/><ellipse cx="66" cy="31" rx="4" ry="3" fill="#e8c890" stroke-width="2"/>` +
    dot(63, 26, 1.8) +
    dot(69, 26, 1.8) +
    `<path d="M6 8H94V16Q83 22 72 16Q61 22 50 16Q39 22 28 16Q17 22 6 16Z" fill="#c62f3f"/>` +
    `<rect x="6" y="48" width="88" height="46" rx="3" fill="#e8553d"/>` +
    `<path d="M6 58H94" stroke="#ffd23f" stroke-width="5"/>` +
    sparkle(26, 76, 7, '#ffd23f') +
    sparkle(50, 80, 7, '#fff') +
    sparkle(74, 76, 7, '#ffd23f'),
  꼭두각시:
    tube('M18 10H82', '#9a5b2e', 5) +
    tube('M50 4V18', '#9a5b2e', 5) +
    `<path d="M22 10L26 56M78 10L74 56M50 18V26M34 10L40 88M66 10L60 88" stroke="#8a96b0" stroke-width="1.8"/>` +
    tube('M42 46L26 56', SKIN, 4) +
    tube('M58 46L74 56', SKIN, 4) +
    tube('M45 68L40 86', '#3b78e6', 5) +
    tube('M55 68L60 86', '#3b78e6', 5) +
    `<circle cx="26" cy="57" r="4" fill="${SKIN}"/><circle cx="74" cy="57" r="4" fill="${SKIN}"/>` +
    `<ellipse cx="38" cy="89" rx="6" ry="3.5" fill="#6b3e26"/><ellipse cx="62" cy="89" rx="6" ry="3.5" fill="#6b3e26"/>` +
    `<path d="M40 44H60L64 70H36Z" fill="#e8553d"/>` +
    `<path d="M40 56H60" stroke="#ffd23f" stroke-width="3"/>` +
    `<circle cx="50" cy="34" r="10" fill="${SKIN}"/>` +
    `<path d="M40 32C40 22 60 22 60 32C56 28 44 28 40 32Z" fill="#2f2a26"/>` +
    dot(46, 35, 1.8) +
    dot(54, 35, 1.8) +
    `<circle cx="44" cy="39" r="2.2" fill="#e8553d" stroke="none"/><circle cx="56" cy="39" r="2.2" fill="#e8553d" stroke="none"/>` +
    dot(42, 56, 2.2) +
    dot(58, 56, 2.2),
  핸드볼:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M66 34H94M66 44H94M66 54H94M66 64H94M66 74H94M66 84H94M74 30V92M82 30V92M90 30V92" stroke="#b8c4d8" stroke-width="1.8"/>` +
    `<path d="M64 92V28H96" stroke-width="10"/><path d="M64 92V28H96" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M64 84V74M64 64V54M64 44V34M72 28H80M88 28H94" stroke="#fff" stroke-width="5" stroke-linecap="butt"/>` +
    stick(28, 30, 'M0 10L2 36M1 16L-12 8L-10 -6M1 16L14 22M2 36L-10 48L-6 60M2 36L14 46L10 58') +
    `<circle cx="18" cy="16" r="8" fill="#ffd23f"/><path d="M11 13Q18 18 25 13M18 8V24" stroke="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M34 16H54l-5-5M54 16l-5 5" stroke="#3b78e6" stroke-width="3.5"/>`,
  당구:
    `<rect x="14" y="76" width="8" height="16" fill="#5a3b24"/><rect x="78" y="76" width="8" height="16" fill="#5a3b24"/>` +
    `<rect x="4" y="30" width="92" height="50" rx="8" fill="#9a5b2e"/>` +
    `<rect x="12" y="38" width="76" height="34" rx="3" fill="#3a9e47"/>` +
    `<circle cx="58" cy="50" r="6" fill="#e8553d"/><circle cx="72" cy="62" r="6" fill="#e8553d"/>` +
    `<circle cx="46" cy="64" r="6" fill="#ffd23f"/><circle cx="34" cy="54" r="6" fill="#fff"/>` +
    `<path d="M56 48l2-1M44 62l2-1M32 52l2-1M70 60l2-1" stroke="#fff" stroke-width="2"/>` +
    tube('M4 8L28 47', '#e8c890', 3.5) +
    `<path d="M26 44L29 49" stroke="#3b78e6" stroke-width="6"/>`,
  유도:
    `<rect x="6" y="84" width="88" height="10" rx="2" fill="#5fc24a"/>` +
    `<path d="M36 68H64L66 90H54L50 76L46 90H34Z" fill="#fff"/>` +
    tube('M30 46L22 72', '#fff', 10) +
    tube('M70 46L78 72', '#fff', 10) +
    `<circle cx="22" cy="75" r="5" fill="${SKIN}"/><circle cx="78" cy="75" r="5" fill="${SKIN}"/>` +
    `<path d="M28 70C28 52 36 42 50 42S72 52 72 70Z" fill="#fff"/>` +
    `<path d="M42 42L58 68M58 42L46 60" stroke-width="7"/><path d="M42 42L58 68M58 42L46 60" stroke="#fff" stroke-width="2.5"/>` +
    `<rect x="30" y="62" width="40" height="7" rx="2" fill="${INK}"/>` +
    `<path d="M50 66L42 82M50 66L58 82" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="50" cy="26" r="13" fill="${SKIN}"/>` +
    `<path d="M37 24C37 12 63 12 63 24C58 18 42 18 37 24Z" fill="#2f2a26"/>` +
    dot(45, 26, 2.2) +
    dot(55, 26, 2.2) +
    `<path d="M45 32q5 3 10 0" stroke-width="2.5"/>`,
  시상대:
    `<rect x="6" y="66" width="30" height="28" fill="#dfe8f5"/>` +
    `<rect x="64" y="74" width="30" height="20" fill="#e8862e"/>` +
    `<rect x="35" y="52" width="30" height="42" fill="#ffc933"/>` +
    sparkle(50, 72, 9, '#fff') +
    person(50, 52, 0.95, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M40 40L30 26', SKIN, 3) +
    tube('M60 40L70 26', SKIN, 3) +
    person(21, 66, 0.78, { hair: '#5a3b24', style: 'pony', shirt: '#e8553d' }) +
    person(79, 74, 0.78, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<path d="M45 33L50 42L55 33" stroke="#e8553d" stroke-width="2.5"/><circle cx="50" cy="45" r="4.5" fill="#ffd23f" stroke-width="2.5"/>` +
    `<circle cx="21" cy="58" r="3.5" fill="#dfe8f5" stroke-width="2"/><circle cx="79" cy="66" r="3.5" fill="#e8862e" stroke-width="2"/>`,

  // ── 명절·행사 ──
  설날:
    hanbokGirl(38, `<path d="M18 74C12 82 14 90 22 90S32 82 26 74Z" fill="#e85d9a"/><path d="M18 75H26" stroke="#ffd23f" stroke-width="3"/>`) +
    `<path d="M70 66C70 64 72 60 76 58" stroke="#b8c4d8" stroke-width="2.5"/><path d="M82 62C82 60 84 56 86 54" stroke="#b8c4d8" stroke-width="2.5"/>` +
    `<path d="M62 72H96C96 86 88 94 79 94S62 86 62 72Z" fill="#e8553d"/>` +
    `<ellipse cx="79" cy="72" rx="17" ry="5" fill="#fff"/>` +
    `<ellipse cx="73" cy="71" rx="4" ry="2.5" fill="#fff" stroke-width="2"/><ellipse cx="82" cy="70" rx="4" ry="2.5" fill="#fff" stroke-width="2"/><ellipse cx="86" cy="73" rx="4" ry="2.5" fill="#fff" stroke-width="2"/>` +
    `<path d="M76 74h4" stroke="#43b04a" stroke-width="3"/>`,
  추석:
    `<rect x="6" y="6" width="88" height="62" rx="6" fill="#2e3a6e"/>` +
    `<circle cx="50" cy="34" r="22" fill="#ffd23f"/>` +
    `<circle cx="42" cy="28" r="3" fill="#f2c14e" stroke="none"/><circle cx="56" cy="40" r="4" fill="#f2c14e" stroke="none"/>` +
    sparkle(16, 18, 4, '#fff') +
    sparkle(84, 20, 4, '#fff') +
    sparkle(82, 52, 3, '#fff') +
    `<ellipse cx="50" cy="84" rx="42" ry="10" fill="#dfe8f5"/>` +
    [
      [26, 80, '#fff'],
      [42, 78, '#ff9aa8'],
      [58, 78, '#5fc24a'],
      [74, 80, '#fff'],
      [34, 86, '#5fc24a'],
      [50, 86, '#fff'],
      [66, 86, '#ff9aa8'],
    ]
      .map(([x, y, c]) => `<path d="M${Number(x) - 8} ${y}C${Number(x) - 8} ${Number(y) - 10} ${Number(x) + 8} ${Number(y) - 10} ${Number(x) + 8} ${y}Z" fill="${c}" stroke-width="2.5"/>`)
      .join(''),
  세배:
    `<path d="M4 93H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<rect x="4" y="88" width="84" height="5" rx="2" fill="#f2c14e"/>` +
    `<ellipse cx="30" cy="80" rx="24" ry="11" fill="#e8553d"/>` +
    `<path d="M10 80C6 54 28 42 48 48C60 52 68 62 70 74L52 82Z" fill="#ffd23f"/>` +
    saekdong(48, 56, 72, 84) +
    `<ellipse cx="78" cy="86" rx="9" ry="4.5" fill="${SKIN}"/>` +
    `<circle cx="66" cy="72" r="13" fill="${SKIN}"/>` +
    `<path d="M53 70C55 55 78 55 80 68C72 62 62 62 53 70Z" fill="#2f2a26"/>` +
    `<path d="M54 66C48 58 50 50 58 52" stroke="#2f2a26" stroke-width="6"/>` +
    `<path d="M68 78q3 2 6 0" stroke-width="2.5"/>` +
    dot(72, 72, 2) +
    `<path d="M40 58l-3 8" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M84 30V48l-5-5M84 48l5-5" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M20 44q6-8 16-8" stroke="#9aa6c4" stroke-width="3"/>`,
  돌잔치:
    `<path d="M32 64C32 50 40 46 50 46S68 50 68 64Z" fill="#ffd23f"/>` +
    saekdong(36, 52, 28, 62) +
    saekdong(64, 52, 72, 62) +
    `<circle cx="50" cy="34" r="15" fill="${SKIN}"/>` +
    `<path d="M34 34C34 14 66 14 66 34C60 26 40 26 34 34Z" fill="#8e4fc9"/>` +
    `<path d="M36 30C42 24 58 24 64 30" stroke="#ffd23f" stroke-width="3"/>` +
    `<circle cx="50" cy="19" r="3.5" fill="#e8553d" stroke-width="2.5"/>` +
    dot(44, 36, 2.2) +
    dot(56, 36, 2.2) +
    `<path d="M46 42q4 3 8 0" stroke-width="2.2"/>` +
    cheeks(40, 10) +
    `<rect x="16" y="76" width="6" height="18" fill="#9a4e1e"/><rect x="78" y="76" width="6" height="18" fill="#9a4e1e"/>` +
    `<rect x="6" y="64" width="88" height="12" rx="2" fill="#e8553d"/>` +
    `<rect x="10" y="56" width="18" height="8" fill="#fff"/><rect x="10" y="48" width="18" height="8" fill="#ff9aa8"/><rect x="10" y="40" width="18" height="8" fill="#5fc24a"/><rect x="10" y="32" width="18" height="8" fill="#fff"/>` +
    `<circle cx="76" cy="58" r="6" fill="#e8553d"/><circle cx="88" cy="58" r="6" fill="#ff9f1a"/><circle cx="82" cy="49" r="6" fill="#e8553d"/>`,
  생일잔치:
    balloon(14, 24, '#e8553d', 20, 60) +
    balloon(86, 22, '#3b78e6', 80, 60) +
    `<ellipse cx="50" cy="88" rx="36" ry="6" fill="#dfe8f5"/>` +
    `<rect x="22" y="54" width="56" height="32" rx="4" fill="#ff9aa8"/>` +
    `<path d="M22 60C26 68 30 68 34 60S42 68 46 60S54 68 58 60S66 68 70 60S76 66 78 60V56C78 54 76 52 74 52H26C24 52 22 54 22 56Z" fill="#fff"/>` +
    `<path d="M22 74H78" stroke="#e8553d" stroke-width="3"/>` +
    [36, 50, 64]
      .map(
        (x, i) =>
          `<rect x="${x - 2.5}" y="36" width="5" height="16" fill="${['#3b78e6', '#ffd23f', '#43b04a'][i]}" stroke-width="2"/>` +
          `<path d="M${x} 24C${x - 5} 30 ${x - 3} 35 ${x} 35S${x + 5} 30 ${x} 24Z" fill="#ff9f1a" stroke-width="2"/>`,
      )
      .join('') +
    sparkle(30, 14, 4, '#e85d9a') +
    sparkle(70, 12, 4, '#43b04a'),
  결혼식:
    `<path d="M54 40C50 60 48 80 46 95H94C92 80 90 60 86 40C84 24 56 24 54 40Z" fill="#f4f6ff"/>` +
    person(70, 95, 1.45, { hair: '#5a3b24', style: 'bun', shirt: '#fff' }) +
    `<path d="M58 24Q70 16 82 24" stroke="#ffd23f" stroke-width="3.5"/>` +
    person(30, 95, 1.45, { hair: '#2f2a26', style: 'short', shirt: '#2e3350' }) +
    `<path d="M26 66L30 78L34 66Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M24 62L30 66L24 70ZM36 62L30 66L36 70Z" fill="${INK}" stroke-width="2"/>` +
    `<path d="M66 90L70 80L74 90" stroke="#43b04a" stroke-width="3"/>` +
    `<circle cx="66" cy="80" r="4.5" fill="#ff9aa8" stroke-width="2.5"/><circle cx="74" cy="80" r="4.5" fill="#ff5c70" stroke-width="2.5"/><circle cx="70" cy="75" r="4.5" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M50 20C50 14 42 12 42 18C42 22 46 25 50 29C54 25 58 22 58 18C58 12 50 14 50 20Z" fill="#ff5c70" stroke-width="2.5"/>`,
  졸업식:
    person(50, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#2e3350' }) +
    `<path d="M34 30V38C42 43 58 43 66 38V30Z" fill="${INK}"/>` +
    `<path d="M20 26L50 14L80 26L50 38Z" fill="#2e3350"/>` +
    `<path d="M50 26L74 30V44" stroke="${HL}" stroke-width="3"/><path d="M71 44H77L76 52H72Z" fill="${HL}" stroke-width="2"/>` +
    dot(50, 26, 2.5, HL) +
    `<g transform="rotate(-30 22 80)"><rect x="4" y="74" width="36" height="12" rx="5" fill="#fff"/><ellipse cx="4" cy="80" rx="3" ry="6" fill="#fff2d6" stroke-width="2.5"/><path d="M22 74V86" stroke="#e8553d" stroke-width="4"/></g>` +
    `<path d="M76 94L80 76L86 92" stroke="#43b04a" stroke-width="3"/>` +
    `<circle cx="76" cy="72" r="6" fill="#ff5c70" stroke-width="2.5"/><circle cx="86" cy="72" r="6" fill="#ffd23f" stroke-width="2.5"/><circle cx="81" cy="64" r="6" fill="#ff9aa8" stroke-width="2.5"/>`,
  입학식:
    `<rect x="10" y="22" width="80" height="40" fill="#ffd23f"/>` +
    `<path d="M40 22L50 10L60 22Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="30" r="5" fill="#fff" stroke-width="2.5"/><path d="M50 27V30H52" stroke-width="1.8"/>` +
    [16, 28, 66, 78].map((x) => `<rect x="${x}" y="30" width="7" height="8" fill="#7ec8f0" stroke-width="2.5"/><rect x="${x}" y="46" width="7" height="8" fill="#7ec8f0" stroke-width="2.5"/>`).join('') +
    `<rect x="30" y="60" width="40" height="30" rx="8" fill="#e8553d"/>` +
    person(50, 96, 1.3, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    `<path d="M40 72V96M60 72V96" stroke="#b83a2a" stroke-width="5"/>` +
    `<circle cx="56" cy="80" r="4" fill="#ff5c70" stroke-width="2.5"/><circle cx="61" cy="84" r="3.5" fill="#ffd23f" stroke-width="2"/>` +
    sparkle(82, 76, 6) +
    sparkle(18, 76, 6),
  운동회:
    bunting(10) +
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M88 50V92" stroke-width="4"/><path d="M88 58L8 62" stroke="#e8553d" stroke-width="3" stroke-dasharray="1 0"/>` +
    stick(36, 40, 'M0 10L4 34M1 16L-10 26L-6 36M1 16L12 22L18 14M4 34L-8 46L-14 58M4 34L16 46L12 58', 0.85) +
    `<rect x="27" y="32" width="18" height="5" fill="#e8553d" stroke-width="2"/><path d="M27 34l-7 3" stroke="#e8553d" stroke-width="3"/>` +
    stick(66, 42, 'M0 10L4 34M1 16L-10 26L-6 36M1 16L12 22L18 14M4 34L-8 46L-14 58M4 34L16 46L12 58', 0.85) +
    `<rect x="57" y="34" width="18" height="5" fill="#3b78e6" stroke-width="2"/><path d="M57 36l-7 3" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M14 50H4M16 60H6M48 52H40M46 62H38" stroke="#9aa6c4" stroke-width="3"/>`,
  음악회:
    stageBack() +
    curtains() +
    person(40, 74, 1.2, { hair: '#5a3b24', style: 'bun', shirt: '#e85d9a' }) +
    `<g transform="rotate(28 60 50)"><g fill="#b5602a"><circle cx="54" cy="50" r="7" stroke-width="7"/><circle cx="67" cy="50" r="9" stroke-width="7"/><circle cx="54" cy="50" r="7" stroke="none"/><circle cx="67" cy="50" r="9" stroke="none"/></g>` +
    `<path d="M58 47V53M64 47V53" stroke-width="1.8"/>` +
    `<rect x="44" y="47.5" width="4" height="5" fill="${INK}" stroke="none"/><path d="M76 50H90" stroke="#3a2a20" stroke-width="4"/><circle cx="91" cy="50" r="2.5" fill="#3a2a20"/></g>` +
    `<path d="M48 26L84 76" stroke="#9a5b2e" stroke-width="2.5"/>` +
    note(80, 32, '#ffd23f') +
    note(22, 40, '#fff') +
    crowd(86, [16, 38, 62, 84], ['#3b78e6', '#43b04a', '#ff9f1a', '#8e4fc9']),
  전시회:
    `<rect x="4" y="6" width="92" height="64" fill="#f4ecd8" stroke="none"/>` +
    `<rect x="10" y="12" width="36" height="28" fill="#e0a800"/><rect x="15" y="17" width="26" height="18" fill="#7ec8f0" stroke-width="2"/>` +
    `<path d="M15 35L24 24L30 30L34 26L41 35Z" fill="#43b04a" stroke-width="2"/><circle cx="35" cy="21" r="2.5" fill="#ff9f1a" stroke="none"/>` +
    `<rect x="54" y="10" width="36" height="32" fill="#e0a800"/><rect x="59" y="15" width="26" height="22" fill="#fff" stroke-width="2"/>` +
    `<circle cx="72" cy="24" r="5" fill="#ff5c70" stroke-width="2"/><path d="M72 29V36" stroke="#43b04a" stroke-width="2.5"/>` +
    `<path d="M4 70H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M22 94V62M78 94V62" stroke-width="4"/><circle cx="22" cy="61" r="3.5" fill="#e0a800"/><circle cx="78" cy="61" r="3.5" fill="#e0a800"/>` +
    `<path d="M22 64Q50 78 78 64" stroke="#c62f3f" stroke-width="4"/>` +
    `<path d="M34 96C34 80 40 74 50 74S66 80 66 96Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="62" r="12" fill="#5a3b24"/>` +
    `<circle cx="38" cy="63" r="3" fill="${SKIN}"/><circle cx="62" cy="63" r="3" fill="${SKIN}"/>`,
  축제:
    `<path d="M4 12Q50 30 96 12" stroke-width="2.5"/>` +
    [14, 32, 50, 68, 86]
      .map((x, i) => {
        const y = 12 + 18 * (1 - ((x - 50) / 46) ** 2) * 0.5;
        const c = ['#e8553d', '#ffd23f', '#ff9f1a', '#e85d9a', '#e8553d'][i];
        return `<path d="M${x} ${y.toFixed(1)}V${(y + 3).toFixed(1)}" stroke-width="2"/><ellipse cx="${x}" cy="${(y + 10).toFixed(1)}" rx="7" ry="8" fill="${c}"/><path d="M${x - 7} ${(y + 10).toFixed(1)}H${x + 7}" stroke-width="2"/>`;
      })
      .join('') +
    `<path d="M10 46L22 36H56L68 46Z" fill="#fff"/><path d="M22 36L18 46M33 36L30 46M45 36L44 46M56 36L57 46" stroke="#e8553d" stroke-width="5"/>` +
    `<path d="M10 46L22 36H56L68 46Z"/>` +
    `<rect x="14" y="46" width="50" height="34" fill="#ffc933"/><rect x="18" y="52" width="42" height="12" fill="#fff2d6" stroke-width="2.5"/>` +
    `<path d="M14 80V92M64 80V92" stroke-width="4"/>` +
    balloon(84, 46, '#3b78e6', 84, 74) +
    person(84, 96, 0.9, { hair: '#2f2a26', style: 'pony', shirt: '#43b04a' }),
  불꽃놀이:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#232c55"/>` +
    [
      [34, 32, 18, '#ffd23f'],
      [70, 26, 14, '#ff5c70'],
      [72, 60, 12, '#7ec8f0'],
    ]
      .map(([x, y, r, c]) => {
        const xs = Number(x);
        const ys = Number(y);
        const rs = Number(r);
        return (
          Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI) / 5;
            const x1 = xs + Math.cos(a) * rs * 0.35;
            const y1 = ys + Math.sin(a) * rs * 0.35;
            const x2 = xs + Math.cos(a) * rs;
            const y2 = ys + Math.sin(a) * rs;
            return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c}" stroke-width="3.5"/><circle cx="${(xs + Math.cos(a) * (rs + 4)).toFixed(1)}" cy="${(ys + Math.sin(a) * (rs + 4)).toFixed(1)}" r="1.8" fill="${c}" stroke="none"/>`;
          }).join('') + `<circle cx="${xs}" cy="${ys}" r="${(rs * 0.18).toFixed(1)}" fill="#fff" stroke="none"/>`
        );
      })
      .join('') +
    `<path d="M34 84V58" stroke="#ffd23f" stroke-width="2" stroke-dasharray="3 4"/>` +
    `<path d="M4 88C14 80 24 80 30 86C38 78 48 78 56 86C64 80 76 80 84 86L96 82V96H4Z" fill="#2e3350"/>` +
    `<circle cx="20" cy="80" r="5" fill="#1d2340"/><circle cx="72" cy="80" r="5" fill="#1d2340"/>`,
  퍼레이드:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    [22, 50, 78]
      .map(
        (x, i) =>
          tube(`M${x - 4} 80L${x - 6} 92`, '#2e3350', 4) +
          tube(`M${x + 4} 80L${x + 8} 90`, '#2e3350', 4) +
          person(x, 82, 1.0, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
          `<path d="M${x - 10} 40V28C${x - 10} 24 ${x + 10} 24 ${x + 10} 28V40Z" fill="#fff"/><path d="M${x - 11} 40H${x + 11}" stroke-width="4"/>` +
          `<path d="M${x} 24C${x - 2} 16 ${x + 2} 12 ${x + 4} 10" stroke="${['#ffd23f', '#3b78e6', '#43b04a'][i]}" stroke-width="4"/>` +
          `<path d="M${x} 66V80" stroke="#ffd23f" stroke-width="2.5"/>`,
      )
      .join('') +
    `<path d="M50 72C50 66 62 66 62 72V80C62 86 50 86 50 80Z" fill="#3b78e6" transform="translate(-6 0)"/>` +
    sparkle(36, 16, 4, '#e85d9a') +
    sparkle(66, 14, 4, '#43b04a') +
    sparkle(90, 20, 4, '#3b78e6'),
  마술쇼:
    `<ellipse cx="46" cy="88" rx="34" ry="7" fill="#2e3350"/>` +
    `<ellipse cx="38" cy="30" rx="6" ry="15" fill="#fff" transform="rotate(-12 38 30)"/><ellipse cx="54" cy="30" rx="6" ry="15" fill="#fff" transform="rotate(12 54 30)"/>` +
    `<ellipse cx="38" cy="30" rx="2.5" ry="9" fill="#ff9aa8" stroke="none" transform="rotate(-12 38 30)"/><ellipse cx="54" cy="30" rx="2.5" ry="9" fill="#ff9aa8" stroke="none" transform="rotate(12 54 30)"/>` +
    `<circle cx="46" cy="52" r="15" fill="#fff"/>` +
    dot(40, 50, 2.5) +
    dot(52, 50, 2.5) +
    `<ellipse cx="46" cy="56" rx="2.5" ry="2" fill="#ff9aa8" stroke-width="2"/>` +
    `<path d="M20 56H72L66 88H26Z" fill="#2e3350"/>` +
    `<ellipse cx="46" cy="56" rx="28" ry="6" fill="#1d2340"/>` +
    `<path d="M26 74H66" stroke="#e8553d" stroke-width="5"/>` +
    tube('M92 10L70 36', INK, 4) +
    `<path d="M92 10L86 17" stroke="#fff" stroke-width="4"/>` +
    sparkle(82, 32, 7) +
    sparkle(90, 44, 5, '#e85d9a') +
    sparkle(70, 16, 5, '#7ec8f0'),
  연극:
    stageBack('#3a3f6b') +
    `<ellipse cx="50" cy="72" rx="36" ry="6" fill="#fff1b8" stroke="none"/>` +
    `<path d="M22 76L28 44H40L44 76Z" fill="#8e4fc9"/>` +
    person(34, 74, 1.05, { hair: '#dfe8f5', style: 'short', shirt: '#e8553d', beard: '#dfe8f5' }) +
    `<path d="M24 26L26 16L31 22L34 14L37 22L42 16L44 26Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M56 74L60 50H72L78 74Z" fill="#ff9aa8"/>` +
    person(66, 74, 1.05, { hair: '#5a3b24', style: 'long', shirt: '#ff9aa8' }) +
    `<path d="M60 26L62 20L66 24L70 20L72 26Z" fill="#ffd23f" stroke-width="2.5"/>` +
    curtains() +
    crowd(86, [16, 38, 62, 84], ['#3b78e6', '#43b04a', '#ff9f1a', '#e85d9a']),
  콘서트:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#2a2450"/>` +
    `<path d="M16 4L34 70H54Z" fill="#ffd23f" stroke="none" opacity=".45"/><path d="M84 4L66 70H46Z" fill="#7ec8f0" stroke="none" opacity=".45"/>` +
    `<rect x="4" y="68" width="92" height="8" fill="#8e4fc9"/>` +
    person(50, 70, 1.2, { hair: '#e8862e', style: 'long', shirt: '#e85d9a' }) +
    tube('M58 58L55 44', '#2e3350', 3) +
    `<circle cx="54" cy="42" r="4.5" fill="#8a96b0"/>` +
    `<circle cx="58" cy="59" r="4" fill="${SKIN}"/>` +
    note(80, 30, '#ffd23f') +
    note(18, 34, '#fff') +
    crowd(86, [14, 38, 62, 86], ['#3b78e6', '#43b04a', '#ff9f1a', '#e85d9a']) +
    tube('M26 80L30 64', '#5fc24a', 3) +
    tube('M50 80L50 64', '#ff5c70', 3) +
    tube('M74 80L70 64', '#ffd23f', 3),
  크리스마스:
    `<rect x="44" y="78" width="12" height="12" fill="#9a5b2e"/>` +
    `<path d="M50 14L30 42H40L22 64H34L14 82H86L66 64H78L60 42H70Z" fill="#3a9e47"/>` +
    `<path d="M50 3L53 10L61 10L55 15L57 22L50 18L43 22L45 15L39 10L47 10Z" fill="#ffd23f" stroke-width="2.5"/>` +
    [
      [44, 38, '#e8553d'],
      [58, 52, '#ffd23f'],
      [38, 60, '#3b78e6'],
      [62, 72, '#e8553d'],
      [30, 76, '#ffd23f'],
      [50, 66, '#fff'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.8" fill="${c}" stroke-width="2"/>`)
      .join('') +
    `<rect x="14" y="80" width="18" height="14" fill="#e8553d"/><path d="M23 80V94" stroke="#ffd23f" stroke-width="3"/>` +
    `<rect x="68" y="82" width="20" height="12" fill="#3b78e6"/><path d="M78 82V94" stroke="#ffd23f" stroke-width="3"/>`,
  어린이날:
    balloon(22, 18, '#e8553d', 34, 58) +
    balloon(38, 12, '#ffd23f', 34, 58) +
    person(50, 96, 1.35, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M38 72L34 58', SKIN, 3.5) +
    tube('M62 72L70 60', SKIN, 3.5) +
    `<path d="M72 60L76 42" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M76 40L76 24Q88 26 76 40Z" fill="#e8553d" stroke-width="2.5"/><path d="M76 40L92 40Q90 52 76 40Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M76 40L76 56Q64 54 76 40Z" fill="#43b04a" stroke-width="2.5"/><path d="M76 40L60 40Q62 28 76 40Z" fill="#3b78e6" stroke-width="2.5"/>` +
    dot(76, 40, 2.5) +
    sparkle(88, 16, 5) +
    sparkle(12, 50, 5, '#e85d9a'),
  어버이날:
    person(56, 96, 1.2, { hair: '#5a3b24', style: 'long', shirt: '#e85d9a' }) +
    person(80, 96, 1.2, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    person(20, 96, 0.9, { hair: '#2f2a26', style: 'short', shirt: '#ffd23f' }) +
    tube('M26 84L34 70', SKIN, 3) +
    `<path d="M34 70L38 52" stroke="#43b04a" stroke-width="3.5"/>` +
    `<path d="M40 56C36 56 34 60 36 62L44 64L46 58Z" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M30 46L32 36L36 42L39 32L42 42L46 34L48 42L52 38L50 50C46 56 34 56 30 46Z" fill="#e8553d"/>` +
    `<path d="M34 52q5 3 12-1" stroke="#c62f3f" stroke-width="2"/>` +
    `<path d="M54 22C54 16 46 14 46 20C46 24 50 27 54 31C58 27 62 24 62 20C62 14 54 16 54 22Z" fill="#ff5c70" stroke-width="2.5"/>`,

  // ── 때·날씨 ──
  새벽:
    `<rect x="6" y="6" width="88" height="26" fill="#3a3f6b" stroke="none"/>` +
    `<rect x="6" y="32" width="88" height="20" fill="#8e6fc0" stroke="none"/>` +
    `<rect x="6" y="52" width="88" height="22" fill="#ffb3a8" stroke="none"/>` +
    sparkle(22, 16, 4, '#fff') +
    sparkle(48, 12, 3, '#fff') +
    `<path d="M80 10A9 9 0 1 0 86 24A7 7 0 1 1 80 10Z" fill="#fff1b8" stroke-width="2.5"/>` +
    `<path d="M32 74A18 18 0 0 1 68 74Z" fill="#ff9f1a"/>` +
    `<path d="M50 50V44M36 56l-4-4M64 56l4-4" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M6 74C24 68 36 72 50 74S80 68 94 72V94H6Z" fill="#4a5a8a"/>` +
    `<rect x="6" y="6" width="88" height="88" rx="4"/>` +
    `<path d="M82 60C80 54 84 50 88 52" stroke="#e8553d" stroke-width="4"/>` +
    `<ellipse cx="80" cy="68" rx="7" ry="6" fill="#fff"/><circle cx="85" cy="60" r="4" fill="#fff"/><path d="M89 60l4 1-4 2Z" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M73 66C68 60 70 56 74 58" stroke="#3a9e47" stroke-width="4"/>`,
  한밤중:
    `<rect x="6" y="6" width="88" height="88" rx="4" fill="#1d2a52"/>` +
    `<path d="M58 12A20 20 0 1 0 80 42A16 16 0 1 1 58 12Z" fill="#ffd23f"/>` +
    `<path d="M62 30q3 2 6 0" stroke-width="2.5"/>` +
    sparkle(20, 18, 5, '#fff') +
    sparkle(36, 34, 3.5, '#fff') +
    sparkle(86, 58, 4, '#fff') +
    sparkle(18, 46, 3, '#fff') +
    `<path d="M14 94V70L30 58L46 70V94Z" fill="#3a3f6b"/><rect x="24" y="74" width="12" height="10" fill="#2e3350" stroke-width="2.5"/>` +
    `<path d="M50 94V76L66 64L82 76V94Z" fill="#3a3f6b"/><rect x="60" y="80" width="12" height="10" fill="#2e3350" stroke-width="2.5"/>` +
    `<path d="M40 50q3-3 6 0M44 44q3-3 6 0" stroke="#9aa6c4" stroke-width="2.5"/>`,
  황사:
    `<rect x="6" y="6" width="88" height="88" rx="4" fill="#e8c890"/>` +
    `<circle cx="78" cy="22" r="9" fill="#f5e6c0" stroke="#c9a060" stroke-width="2.5"/>` +
    `<path d="M10 28q10-6 20 0t20 0M52 40q10-6 20 0t20 0M10 58q8-5 16 0" stroke="#c9a060" stroke-width="3"/>` +
    [
      [16, 18],
      [30, 40],
      [62, 14],
      [88, 44],
      [14, 76],
      [86, 80],
      [22, 48],
      [80, 60],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#b0874a" stroke="none"/>`)
      .join('') +
    person(50, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M34 50L40 51M66 50L60 51" stroke-width="2"/>` +
    `<rect x="39" y="49" width="22" height="12" rx="5" fill="#fff"/>` +
    `<path d="M42 53H58M42 57H58" stroke="#b8c4d8" stroke-width="1.8"/>` +
    `<path d="M40 43q3-2 6 0M54 43q3-2 6 0" stroke-width="2"/>`,
};
