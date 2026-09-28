// 단어 그림: 들은 단어의 뜻을 보여 주는 그림 (2026-09-28 사용자 요청: "달이면 달그림, 빠르다면 빠른 걸 보여주는 그림").
// - 직접 그린 SVG. 이모지는 휴대폰마다 모양이 달라서 쓰지 않는다.
// - 뜻만 보여 준다: 글자(한글)·자모·철자 순서가 드러나는 요소는 넣지 않는다 (tests/pictures.test.ts가 검사).
// - 단어 데이터(vocab.ts)의 pictureId(p_단어)로 찾는다. 그림이 없는 단어는 그림 칸을 비워 둔다.
// - 4~6세 묶음부터 그렸다. 누나·오빠·언니·이모는 그림 한 장으로 서로 구별되지 않아 비워 두었다.
// 좌표는 모두 viewBox 0 0 100 100 기준.

const INK = '#1d2340';
const SKIN = '#ffd6ad';
const HL = '#ffc933';

/** 원 여러 개를 안쪽 선 없이 한 덩어리로 (나무 잎, 구름, 갈기) */
function blob(fill: string, cs: [number, number, number][]): string {
  const outer = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke-width="7"/>`).join('');
  const inner = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke="none"/>`).join('');
  return `<g fill="${fill}">${outer}${inner}</g>`;
}

/** 신체 부위 강조: 노란 점선 고리 */
function ring(x: number, y: number, rx: number, ry = rx): string {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="${HL}" stroke-width="5" stroke-dasharray="7 5"/>`;
}

function dot(x: number, y: number, r = 3.3, fill = INK): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="none"/>`;
}

function drop(x: number, y: number, s = 1): string {
  return `<path d="M${x} ${y} c${-3 * s} ${6 * s} ${-4 * s} ${8 * s} ${-4 * s} ${10 * s} a${4 * s} ${4 * s} 0 0 0 ${8 * s} 0 c0 ${-2 * s} ${-1 * s} ${-4 * s} ${-4 * s} ${-10 * s}z" fill="#4aa8f0"/>`;
}

const cheeks = (y: number, dx = 16, cx = 50) =>
  `<circle cx="${cx - dx}" cy="${y}" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="${cx + dx}" cy="${y}" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>`;

/** 이마·코·머리를 가리킬 때 쓰는 기본 얼굴 (이마가 보이게 앞머리를 짧게) */
function face(extra = ''): string {
  return (
    `<circle cx="21" cy="56" r="7" fill="${SKIN}"/><circle cx="79" cy="56" r="7" fill="${SKIN}"/>` +
    `<circle cx="50" cy="54" r="29" fill="${SKIN}"/>` +
    `<path d="M21 50C19 27 35 20 50 20S81 27 79 50C74 40 63 34 50 34S26 40 21 50Z" fill="#5a3b24"/>` +
    dot(40, 55) +
    dot(60, 55) +
    `<path d="M50 58q-3 5 0 7"/><path d="M42 72q8 6 16 0"/>` +
    cheeks(66, 17) +
    extra
  );
}

/** 막대 사람 (가다·오다·놀다) */
function stick(x: number, y: number, body: string, s = 1): string {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${body}" stroke-width="6"/><circle cx="0" cy="0" r="10" fill="${SKIN}"/></g>`;
}

const PICTURES: Record<string, string> = {
  수박:
    `<path d="M8 32h84a42 42 0 0 1-84 0z" fill="#3a9e47"/><path d="M15 32h70a35 35 0 0 1-70 0z" fill="#ff5c70" stroke="none"/><path d="M8 32h84"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="33" cy="44" rx="2.4" ry="3.8"/><ellipse cx="50" cy="50" rx="2.4" ry="3.8"/><ellipse cx="67" cy="44" rx="2.4" ry="3.8"/><ellipse cx="41" cy="58" rx="2.4" ry="3.8"/><ellipse cx="59" cy="58" rx="2.4" ry="3.8"/></g>`,
  나무:
    `<path d="M44 90L46 56H54L56 90Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [50, 32, 22],
      [31, 46, 15],
      [69, 46, 15],
      [50, 52, 17],
    ]),
  바다:
    `<circle cx="78" cy="22" r="10" fill="#ffd23f"/>` +
    `<path d="M50 50V20"/><path d="M53 22L70 46H53Z" fill="#fff"/><path d="M34 50H66L60 60H40Z" fill="#e8553d"/>` +
    `<path d="M0 58q8-7 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#3b8fe0"/><path d="M0 74q8-7 16 0t17 0t17 0t17 0t17 0t16 0V100H0Z" fill="#2a6fc4"/>`,
  모자:
    `<ellipse cx="50" cy="66" rx="42" ry="12" fill="#f2c14e"/><path d="M28 64C28 34 72 34 72 64Z" fill="#f2c14e"/>` +
    `<path d="M29 56C40 60 60 60 71 56L72 64C60 68 40 68 28 64Z" fill="#e8553d"/>`,
  오이:
    `<path d="M16 72C8 62 18 52 32 46L70 26C84 20 94 30 86 40C80 48 70 52 60 58L32 74C26 77 20 77 16 72Z" fill="#4caf50"/>` +
    `<path d="M28 58L66 38" stroke="#a5e3a0" stroke-width="3"/><path d="M87 36l7-5"/>` +
    [
      [36, 62],
      [50, 54],
      [64, 46],
      [76, 38],
      [44, 68],
      [58, 60],
      [72, 52],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#2e7d32'))
      .join(''),
  우유:
    `<rect x="44" y="12" width="12" height="8" fill="#fff"/><path d="M30 40L44 20H56L70 40Z" fill="#dfe8f5"/>` +
    `<rect x="30" y="40" width="40" height="48" rx="2" fill="#fff"/><rect x="30" y="54" width="40" height="18" fill="#4a90e2"/>` +
    `<path d="M50 57c-4 5-5 8-5 10a5 5 0 0 0 10 0c0-2-1-5-5-10Z" fill="#fff"/>`,
  가방:
    `<path d="M40 24C40 12 60 12 60 24" stroke-width="5"/><rect x="22" y="22" width="56" height="66" rx="16" fill="#e8553d"/>` +
    `<rect x="31" y="54" width="38" height="26" rx="8" fill="#ff8a65"/><path d="M31 62H69"/><rect x="45" y="58" width="10" height="7" rx="2" fill="#ffd23f"/>`,
  아기:
    `<circle cx="50" cy="54" r="30" fill="${SKIN}"/><path d="M50 25c-8-8 4-16 8-8"/>` +
    dot(40, 52) +
    dot(60, 52) +
    cheeks(62, 18) +
    `<ellipse cx="50" cy="70" rx="11" ry="6" fill="#7ec8f0"/><circle cx="50" cy="80" r="5"/>`,
  엄마:
    `<path d="M18 56C16 24 34 14 50 14S84 24 82 56V86H18Z" fill="#6b3e26"/><path d="M24 96C26 80 38 74 50 74S74 80 76 96Z" fill="#e85d9a"/>` +
    `<circle cx="50" cy="50" r="24" fill="${SKIN}"/><path d="M26 46C28 30 40 24 50 26C62 24 74 32 74 46C66 38 58 36 50 38C44 34 34 38 26 46Z" fill="#6b3e26"/>` +
    dot(41, 51) +
    dot(59, 51) +
    `<path d="M44 62q6 5 12 0"/>` +
    cheeks(58, 15),
  아빠:
    `<path d="M22 96C24 80 38 72 50 72S76 80 78 96Z" fill="#3b78e6"/><path d="M50 74L45 80L50 94L55 80Z" fill="#e8553d"/>` +
    `<circle cx="26" cy="50" r="5" fill="${SKIN}"/><circle cx="74" cy="50" r="5" fill="${SKIN}"/><circle cx="50" cy="48" r="24" fill="${SKIN}"/>` +
    `<path d="M26 44C24 24 38 18 50 18S76 24 74 44C70 34 60 30 50 32S30 34 26 44Z" fill="#2f2a26"/>` +
    dot(41, 49) +
    dot(59, 49) +
    `<path d="M43 60q7 5 14 0"/>`,
  다리:
    `<rect x="32" y="26" width="12" height="56" rx="4" fill="${SKIN}"/><rect x="56" y="26" width="12" height="56" rx="4" fill="${SKIN}"/>` +
    `<path d="M28 6H72L74 30H54L50 22L46 30H26Z" fill="#3b78e6"/>` +
    `<path d="M30 80H46V90H22C22 85 25 80 30 80Z" fill="#e8553d"/><path d="M54 80H70C75 80 78 85 78 90H54Z" fill="#e8553d"/>` +
    ring(50, 56, 30, 26),
  집:
    `<rect x="63" y="20" width="10" height="20" fill="#9a5b2e"/><path d="M12 50L50 16L88 50Z" fill="#e8553d"/>` +
    `<rect x="22" y="48" width="56" height="40" fill="#ffe7a8"/><path d="M44 88V72a6 6 0 0 1 12 0V88" fill="#9a5b2e"/>` +
    `<rect x="28" y="56" width="12" height="12" fill="#8fd3ff"/><rect x="60" y="56" width="12" height="12" fill="#8fd3ff"/><path d="M34 56V68M28 62H40M66 56V68M60 62H72" stroke-width="2"/>`,
  바나나:
    `<path d="M22 22L21 14H29L30 22" fill="#8b5a2b"/>` +
    `<path d="M20 26C18 62 44 84 80 74C85 72 85 66 80 67C52 70 34 56 30 26C29 20 21 20 20 26Z" fill="#ffd23f"/>` +
    `<path d="M26 34C28 56 46 70 72 69" stroke="#e0a800" stroke-width="2.5"/>` +
    dot(82, 70, 2.5, '#8b5a2b'),
  머리: face(ring(50, 50, 40, 40)),
  사자:
    blob(
      '#e8862e',
      Array.from({ length: 12 }, (_, k): [number, number, number] => [
        Math.round(50 + 30 * Math.cos((k * Math.PI) / 6)),
        Math.round(52 + 30 * Math.sin((k * Math.PI) / 6)),
        12,
      ]),
    ) +
    `<circle cx="50" cy="52" r="25" fill="#ffc94d"/>` +
    dot(41, 47) +
    dot(59, 47) +
    `<ellipse cx="50" cy="62" rx="11" ry="8" fill="#fff1c7"/><path d="M45 56h10l-5 5z" fill="${INK}"/><path d="M50 61v3M44 66q6 5 12 0"/>`,
  꼬리:
    `<path d="M72 52C84 46 86 32 80 22" stroke-width="13"/><path d="M72 52C84 46 86 32 80 22" stroke="#c98b4f" stroke-width="6"/>` +
    `<rect x="30" y="62" width="9" height="24" rx="3" fill="#c98b4f"/><rect x="61" y="62" width="9" height="24" rx="3" fill="#c98b4f"/>` +
    `<ellipse cx="50" cy="58" rx="26" ry="14" fill="#c98b4f"/><circle cx="24" cy="44" r="13" fill="#c98b4f"/>` +
    `<path d="M18 34C10 36 10 50 16 52Z" fill="#8a5a30"/>` +
    dot(27, 42, 2.8) +
    dot(12, 46, 3) +
    ring(80, 34, 14, 22),
  나비:
    `<path d="M50 50C40 22 12 18 14 38C16 52 34 56 50 50Z" fill="#ff8ac2"/><path d="M50 50C60 22 88 18 86 38C84 52 66 56 50 50Z" fill="#ff8ac2"/>` +
    `<path d="M50 52C36 56 22 70 32 80C40 86 48 70 50 52Z" fill="#ffc94d"/><path d="M50 52C64 56 78 70 68 80C60 86 52 70 50 52Z" fill="#ffc94d"/>` +
    dot(29, 37, 5, '#fff') +
    dot(71, 37, 5, '#fff') +
    `<rect x="46" y="32" width="8" height="42" rx="4" fill="${INK}"/><path d="M48 34C44 24 38 20 33 18M52 34C56 24 62 20 67 18"/>` +
    dot(33, 18, 3) +
    dot(67, 18, 3),
  개미:
    `<path d="M44 58L32 74M47 58L46 80M50 58L62 76M44 52L30 42M50 52L60 40" stroke-width="4"/>` +
    `<path d="M18 38C14 28 10 26 6 26M24 37C24 26 28 22 32 20"/>` +
    `<circle cx="22" cy="46" r="11" fill="#b8452e"/><circle cx="46" cy="54" r="9" fill="#b8452e"/><ellipse cx="72" cy="58" rx="17" ry="14" fill="#b8452e"/>` +
    dot(19, 44, 2.6, '#fff'),
  자다:
    `<rect x="8" y="46" width="84" height="30" rx="14" fill="#fff"/><circle cx="42" cy="52" r="22" fill="${SKIN}"/>` +
    `<path d="M22 46C22 32 34 28 42 30C52 28 62 34 62 46C56 40 48 38 42 40C36 38 28 40 22 46Z" fill="#5a3b24"/>` +
    `<path d="M32 54q4 4 8 0M46 54q4 4 8 0"/><path d="M8 66H92V88C92 92 88 94 84 94H16C12 94 8 92 8 88Z" fill="#7a8fe0"/>` +
    `<path d="M68 14h10l-10 11h10M84 4h7l-7 8h7" stroke="#3b78e6"/>`,
  크다:
    `<path d="M4 88H96"/><circle cx="18" cy="78" r="9" fill="#8fd3ff"/>` +
    dot(15, 77, 1.8) +
    dot(21, 77, 1.8) +
    `<circle cx="62" cy="54" r="32" fill="#8fd3ff"/>` +
    dot(52, 48, 4) +
    dot(72, 48, 4) +
    `<path d="M50 64q12 10 24 0"/><path d="M62 16V6M56 11l6-6 6 6M96 54h-0" stroke="#e8553d" stroke-width="4"/>`,
  코: face(`<path d="M46 56C44 62 43 65 46 67H54C57 65 56 62 54 56Z" fill="#ffb98a"/>` + ring(50, 61, 13, 11)),
  눈:
    `<path d="M24 34L18 26M38 28L35 19M50 26V17M62 28L65 19M76 34L82 26"/>` +
    `<path d="M10 52C28 26 72 26 90 52C72 78 28 78 10 52Z" fill="#fff"/><circle cx="50" cy="52" r="16" fill="#5aa7e8"/>` +
    dot(50, 52, 8) +
    dot(55, 47, 3.5, '#fff'),
  입:
    `<path d="M14 40C30 48 70 48 86 40C80 74 20 74 14 40Z" fill="#c62f3f"/>` +
    `<path d="M22 45C40 51 60 51 78 45L75 53C60 57 40 57 25 53Z" fill="#fff"/>` +
    `<path d="M36 64C40 56 60 56 64 64C58 68 42 68 36 64Z" fill="#ff8aa0" stroke="none"/>`,
  손:
    `<rect x="30" y="18" width="10" height="32" rx="5" fill="${SKIN}"/><rect x="42" y="10" width="10" height="38" rx="5" fill="${SKIN}"/>` +
    `<rect x="54" y="12" width="10" height="36" rx="5" fill="${SKIN}"/><rect x="66" y="22" width="9" height="28" rx="4.5" fill="${SKIN}"/>` +
    `<path d="M30 60C20 54 12 44 16 39C20 35 28 42 34 50Z" fill="${SKIN}"/>` +
    `<path d="M28 44H76V70C76 84 66 90 52 90S28 82 28 70Z" fill="${SKIN}"/>`,
  발:
    `<path d="M36 34C30 50 30 66 34 80C38 92 58 94 64 82C68 72 64 62 66 50C68 40 64 32 56 30C48 28 40 28 36 34Z" fill="${SKIN}"/>` +
    [
      [38, 20, 7.5],
      [51, 14, 6],
      [61, 17, 5],
      [69, 23, 4.5],
      [74, 31, 4],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`)
      .join(''),
  포도:
    `<path d="M50 10V22"/><path d="M52 16C60 6 76 8 76 16C68 22 58 20 52 16Z" fill="#43b04a"/>` +
    [
      [38, 28],
      [50, 26],
      [62, 28],
      [32, 40],
      [44, 40],
      [56, 40],
      [68, 40],
      [38, 52],
      [50, 52],
      [62, 52],
      [44, 64],
      [56, 64],
      [50, 76],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="#8e4fc9"/>`)
      .join(''),
  두부:
    `<ellipse cx="50" cy="74" rx="42" ry="13" fill="#8fd3ff"/><path d="M24 44L50 34L76 44L50 54Z" fill="#fffdf2"/>` +
    `<path d="M24 44V64L50 74V54Z" fill="#efe9d6"/><path d="M76 44V64L50 74V54Z" fill="#e2dbc4"/>`,
  고기:
    `<path d="M62 58L78 76" stroke-width="13"/><path d="M62 58L78 76" stroke="#fff" stroke-width="6"/>` +
    `<circle cx="84" cy="72" r="6" fill="#fff"/><circle cx="76" cy="82" r="6" fill="#fff"/>` +
    `<path d="M18 40C18 22 38 12 54 20C70 28 74 50 64 60C54 70 34 66 24 58C18 52 18 46 18 40Z" fill="#b5653a"/>` +
    `<path d="M30 30C34 26 40 24 46 25" stroke="#e8a070" stroke-width="3"/>`,
  밥:
    blob('#fff', [
      [36, 46, 12],
      [50, 38, 14],
      [64, 46, 12],
      [43, 50, 12],
      [57, 50, 12],
    ]) + `<path d="M14 50H86C86 72 70 88 50 88S14 72 14 50Z" fill="#3b78e6"/><path d="M24 64H76" stroke="#8fd3ff"/>`,
  피자:
    `<path d="M50 90L16 26C36 16 64 16 84 26Z" fill="#ffd23f"/><path d="M16 26C36 16 64 16 84 26L80 34C62 26 38 26 20 34Z" fill="#d98c3a"/>` +
    `<circle cx="50" cy="42" r="7" fill="#e8553d"/><circle cx="38" cy="54" r="5.5" fill="#e8553d"/><circle cx="60" cy="58" r="5.5" fill="#e8553d"/><circle cx="50" cy="74" r="4.5" fill="#e8553d"/>`,
  고양이:
    `<path d="M24 42L26 12L46 28Z" fill="#ffab5c"/><path d="M76 42L74 12L54 28Z" fill="#ffab5c"/>` +
    `<ellipse cx="50" cy="55" rx="31" ry="27" fill="#ffab5c"/><path d="M50 30V38M42 31L44 38M58 31L56 38" stroke="#d9772a"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="39" cy="50" rx="3.5" ry="5"/><ellipse cx="61" cy="50" rx="3.5" ry="5"/></g>` +
    `<path d="M46 60h8l-4 4z" fill="#ff7a9c"/><path d="M50 64q-4 5-8 2M50 64q4 5 8 2"/><path d="M14 58H32M16 68L32 64M86 58H68M84 68L68 64" stroke-width="2.5"/>`,
  곰:
    `<circle cx="26" cy="30" r="11" fill="#a0653a"/><circle cx="74" cy="30" r="11" fill="#a0653a"/>` +
    dot(26, 30, 5, '#e0a070') +
    dot(74, 30, 5, '#e0a070') +
    `<circle cx="50" cy="55" r="30" fill="#a0653a"/><ellipse cx="50" cy="65" rx="13" ry="10" fill="#e8c49a"/>` +
    `<ellipse cx="50" cy="60" rx="5" ry="3.5" fill="${INK}"/>` +
    dot(39, 48) +
    dot(61, 48) +
    `<path d="M50 63v5M44 69q6 4 12 0"/>`,
  공룡:
    `<path d="M4 74C22 70 32 56 44 52C48 40 56 26 70 22C82 20 94 26 92 36C90 44 82 44 74 44C72 52 68 58 66 64L70 88H60L56 72L46 74L48 88H38L36 72C24 78 12 78 4 74Z" fill="#5cc26b"/>` +
    `<path d="M50 48l2-9 6 6M58 38l2-9 6 5" fill="#3f9a4d"/>` +
    dot(78, 31, 3) +
    `<path d="M80 40H90"/><path d="M64 54l9 4" stroke-width="4"/>`,
  오리:
    `<path d="M26 58L12 46L22 66Z" fill="#ffd23f"/>` +
    blob('#ffd23f', [
      [40, 64, 20],
      [56, 64, 20],
      [48, 68, 20],
      [66, 36, 15],
    ]) +
    `<path d="M78 32C86 30 94 32 96 36C90 40 82 40 77 38Z" fill="#ff8c1a"/>` +
    dot(68, 32, 3) +
    `<path d="M40 62C48 56 62 58 66 66C58 72 46 72 40 62Z" fill="#ffc400"/>`,
  여우:
    `<path d="M22 42L20 10L44 28Z" fill="#f07a2a"/><path d="M78 42L80 10L56 28Z" fill="#f07a2a"/>` +
    `<path d="M16 42C16 30 32 26 50 26S84 30 84 42C84 58 62 78 50 86C38 78 16 58 16 42Z" fill="#f07a2a"/>` +
    `<path d="M19 47C30 52 42 60 50 84C38 76 20 60 19 47ZM81 47C70 52 58 60 50 84C62 76 80 60 81 47Z" fill="#fff" stroke="none"/>` +
    `<path d="M16 42C16 30 32 26 50 26S84 30 84 42C84 58 62 78 50 86C38 78 16 58 16 42Z"/>` +
    dot(38, 48) +
    dot(62, 48) +
    dot(50, 82, 4),
  하마:
    `<circle cx="28" cy="24" r="7" fill="#9d8fc4"/><circle cx="72" cy="24" r="7" fill="#9d8fc4"/>` +
    `<ellipse cx="50" cy="40" rx="27" ry="21" fill="#9d8fc4"/><ellipse cx="50" cy="66" rx="37" ry="23" fill="#b3a6d9"/>` +
    `<g fill="${INK}" stroke="none"><ellipse cx="37" cy="60" rx="4" ry="5"/><ellipse cx="63" cy="60" rx="4" ry="5"/></g>` +
    dot(40, 34) +
    dot(60, 34) +
    `<path d="M28 76q22 10 44 0"/>`,
  공:
    `<circle cx="50" cy="52" r="34" fill="#fff"/><path d="M50 18C36 30 32 70 50 86C30 82 16 68 16 52S30 22 50 18Z" fill="#e8553d"/>` +
    `<path d="M50 18C64 30 68 70 50 86C70 82 84 68 84 52S70 22 50 18Z" fill="#3b78e6"/><circle cx="50" cy="52" r="34"/>` +
    `<path d="M30 32C34 27 39 24 44 23" stroke="#fff" stroke-width="4"/>`,
  책:
    `<path d="M6 28V86C24 82 40 84 50 92C60 84 76 82 94 86V28Z" fill="#3b78e6"/>` +
    `<path d="M50 28C40 20 22 18 10 22V80C22 76 40 78 50 86Z" fill="#fff"/><path d="M50 28C60 20 78 18 90 22V80C78 76 60 78 50 86Z" fill="#fff"/>` +
    `<path d="M18 36C28 34 36 36 42 40M18 48C28 46 36 48 42 52M18 60C28 58 36 60 42 64M58 40C64 36 72 34 82 36M58 52C64 48 72 46 82 48M58 64C64 60 72 58 82 60" stroke="#9fb3d9" stroke-width="3"/>`,
  신발:
    `<path d="M10 70H90C92 76 88 82 82 82H14C10 82 8 76 10 70Z" fill="#fff"/>` +
    `<path d="M12 70C12 56 16 44 24 40H40C44 48 52 52 62 54C76 56 88 60 90 70Z" fill="#e8553d"/>` +
    `<path d="M44 45l6-4M50 49l6-4M56 52l6-4" stroke-width="3"/><path d="M26 62C38 58 52 60 64 66" stroke="#fff" stroke-width="4"/>`,
  우산:
    `<path d="M50 50V80C50 88 38 88 38 80" stroke-width="5"/><path d="M50 14V7"/>` +
    `<path d="M10 50C10 26 30 14 50 14S90 26 90 50C84 44 76 44 70 50C64 44 56 44 50 50C44 44 36 44 30 50C24 44 16 44 10 50Z" fill="#3b78e6"/>` +
    `<path d="M50 14C40 24 34 36 30 50M50 14C60 24 66 36 70 50M50 14V50" stroke-width="2.5"/>`,
  방:
    `<rect x="8" y="10" width="84" height="58" fill="#ffe7a8"/><path d="M8 68H92L96 92H4Z" fill="#c98b4f"/>` +
    `<rect x="60" y="18" width="24" height="22" fill="#8fd3ff"/><path d="M72 18V40M60 29H84" stroke-width="2"/>` +
    `<rect x="12" y="44" width="8" height="36" rx="3" fill="#9a5b2e"/><rect x="18" y="58" width="46" height="18" rx="3" fill="#e8553d"/>` +
    `<rect x="21" y="51" width="16" height="9" rx="4" fill="#fff"/>`,
  해:
    `<g stroke="#ff9f1a" stroke-width="6">` +
    Array.from({ length: 8 }, (_, k) => {
      const a = (k * Math.PI) / 4;
      const p = (r: number) => `${Math.round(50 + r * Math.cos(a))} ${Math.round(50 + r * Math.sin(a))}`;
      return `<path d="M${p(31)}L${p(43)}"/>`;
    }).join('') +
    `</g><circle cx="50" cy="50" r="24" fill="#ffd23f"/>` +
    dot(42, 46) +
    dot(58, 46) +
    `<path d="M42 57q8 6 16 0"/>`,
  별: `<path d="M50 10L61 37L90 39L67 58L75 88L50 71L25 88L33 58L10 39L39 37Z" fill="#ffd23f"/><path d="M42 34L46 26" stroke="#fff4b0" stroke-width="3"/>`,
  물:
    `<path d="M50 10C40 30 24 46 24 62C24 78 36 90 50 90S76 78 76 62C76 46 60 30 50 10Z" fill="#4aa8f0"/>` +
    `<path d="M35 62C35 70 39 76 45 79" stroke="#bfe6ff" stroke-width="4"/>`,
  가다:
    `<path d="M10 30H2M12 42H4M10 54H2" stroke="#9fb3d9" stroke-width="4"/>` +
    stick(30, 24, 'M0 10L-2 34M0 16L-12 26M0 16L12 24M-2 34L-12 56M-2 34L10 54') +
    `<path d="M52 52H90M78 40L90 52L78 64" stroke="#3b78e6" stroke-width="7"/>`,
  보다:
    `<rect x="42" y="38" width="16" height="16" fill="#3b4a6b"/><circle cx="31" cy="56" r="19" fill="#3b4a6b"/><circle cx="69" cy="56" r="19" fill="#3b4a6b"/>` +
    `<circle cx="31" cy="56" r="11" fill="#8fd3ff"/><circle cx="69" cy="56" r="11" fill="#8fd3ff"/>` +
    dot(27, 52, 3, '#fff') +
    dot(65, 52, 3, '#fff') +
    `<path d="M24 26L18 14M50 22V10M76 26L82 14" stroke="${HL}" stroke-width="4"/>`,
  아프다:
    `<circle cx="50" cy="54" r="30" fill="${SKIN}"/><path d="M20 50C19 28 35 22 50 22S81 28 80 50C74 42 62 38 50 38S26 42 20 50Z" fill="#5a3b24"/>` +
    `<rect x="30" y="34" width="40" height="11" rx="3" fill="#fff" transform="rotate(-10 50 40)"/><path d="M50 36v8M46 40h8" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M36 56q4-3 8 0M56 56q4-3 8 0"/><path d="M42 72q8-6 16 0"/>` +
    `<path d="M56 70L82 58" stroke-width="7"/><path d="M56 70L82 58" stroke="#fff" stroke-width="3"/>` +
    dot(83, 58, 4.5, '#e8553d'),
  이마: face(ring(50, 42, 16, 7)),
  허리:
    `<path d="M36 30L22 52M64 30L78 52" stroke-width="5"/><circle cx="50" cy="15" r="10" fill="${SKIN}"/>` +
    `<path d="M36 26H64L62 58H38Z" fill="#3b78e6"/><path d="M38 64H62L64 92H53L50 72L47 92H36Z" fill="#2f3f66"/>` +
    `<rect x="36" y="56" width="28" height="8" fill="#9a5b2e"/><rect x="47" y="57" width="6" height="6" fill="#ffd23f" stroke-width="2"/>` +
    ring(50, 60, 26, 11),
  빵:
    `<path d="M22 46C12 46 12 22 30 20C38 12 62 12 70 20C88 22 88 46 78 46V86H22Z" fill="#c9782f"/>` +
    `<path d="M28 48C20 46 20 28 34 26C40 20 60 20 66 26C80 28 80 46 72 48V80H28Z" fill="#ffe2a8" stroke="none"/>`,
  토마토:
    `<circle cx="50" cy="56" r="32" fill="#e8403a"/><path d="M50 26V16"/>` +
    `<path d="M50 23L56 30L66 28L59 35L63 42L50 37L37 42L41 35L34 28L44 30Z" fill="#43b04a"/>` +
    `<path d="M29 50C31 42 37 36 43 34" stroke="#ff9a8a" stroke-width="4"/>`,
  고구마:
    `<path d="M14 60L4 64M86 52L96 47"/>` +
    `<path d="M12 60C18 42 40 34 60 36C78 38 90 46 88 56C86 66 70 72 50 72C34 72 22 70 12 60Z" fill="#b0476f"/>` +
    `<path d="M34 50l5 2M52 46l5 2M66 56l5 2M42 62l5 1" stroke="#7a2d4c" stroke-width="3"/>`,
  치즈:
    `<path d="M12 46L68 24L90 42Z" fill="#ffe066"/><path d="M12 46L90 42V74L12 80Z" fill="#ffd23f"/>` +
    `<g fill="#e0a800" stroke="none"><ellipse cx="30" cy="60" rx="6" ry="5"/><ellipse cx="56" cy="64" rx="5" ry="4"/><ellipse cx="76" cy="54" rx="4" ry="4"/><ellipse cx="44" cy="72" rx="3" ry="2"/></g>`,
  기린:
    `<path d="M58 14V5M66 13V4"/>` +
    dot(58, 5, 3, '#b5672a') +
    dot(66, 4, 3, '#b5672a') +
    `<path d="M34 96L36 52C36 40 44 24 54 18C60 12 70 12 76 16L84 22C86 26 82 30 78 28H66C58 34 54 44 52 54L54 96Z" fill="#f5c04a"/>` +
    `<g fill="#b5672a" stroke="none"><circle cx="44" cy="78" r="5"/><circle cx="46" cy="62" r="4.5"/><circle cx="48" cy="44" r="4"/><circle cx="56" cy="30" r="3.5"/></g>` +
    dot(70, 20, 2.8),
  코끼리:
    `<ellipse cx="22" cy="46" rx="18" ry="24" fill="#9fb0c8"/><ellipse cx="78" cy="46" rx="18" ry="24" fill="#9fb0c8"/>` +
    `<circle cx="50" cy="44" r="24" fill="#b8c6da"/><path d="M44 58C44 74 46 84 54 88C60 90 64 86 60 82C56 80 56 72 56 58Z" fill="#b8c6da"/>` +
    `<path d="M40 60C37 66 39 71 44 71ZM60 60C63 66 61 71 56 71Z" fill="#fff"/>` +
    dot(42, 40) +
    dot(58, 40),
  개구리:
    `<circle cx="32" cy="32" r="13" fill="#5cc26b"/><circle cx="68" cy="32" r="13" fill="#5cc26b"/><ellipse cx="50" cy="58" rx="38" ry="28" fill="#5cc26b"/>` +
    `<circle cx="32" cy="29" r="7" fill="#fff"/><circle cx="68" cy="29" r="7" fill="#fff"/>` +
    dot(32, 30, 3.5) +
    dot(68, 30, 3.5) +
    `<path d="M24 60C36 72 64 72 76 60"/>` +
    cheeks(58, 30),
  고래:
    `<path d="M40 30C40 22 36 16 30 14M40 30C40 22 44 16 50 14M40 30V14" stroke="#4aa8f0" stroke-width="4"/>` +
    `<path d="M82 56C88 48 92 40 96 36C96 46 94 52 90 56C94 60 96 66 96 74C92 70 88 64 82 60Z" fill="#3b8fe0"/>` +
    `<path d="M8 56C8 36 34 28 56 32C74 36 84 48 84 58C84 72 64 80 42 80C24 80 8 72 8 56Z" fill="#3b8fe0"/>` +
    `<path d="M16 66C28 74 52 76 70 70" stroke="#bfe6ff" stroke-width="4"/>` +
    dot(26, 52, 3) +
    `<path d="M12 60q6 4 12 2"/>`,
  비누:
    `<rect x="14" y="48" width="62" height="34" rx="12" fill="#ff9ec4"/><path d="M24 56H54" stroke="#ffd1e3" stroke-width="4"/>` +
    `<g fill="#e6f6ff" stroke="#7ec8f0" stroke-width="3"><circle cx="72" cy="34" r="10"/><circle cx="87" cy="52" r="6"/><circle cx="58" cy="24" r="6"/><circle cx="86" cy="18" r="5"/></g>`,
  바지:
    `<path d="M28 12H72L78 90H56L50 38L44 90H22Z" fill="#3b6fd9"/><path d="M28 12H72V22H28Z" fill="#2f58b8"/><path d="M50 22V36"/>`,
  양말:
    `<path d="M50 10H72V50L84 58C92 64 88 78 78 78C72 78 66 74 60 70L50 62C47 60 50 56 50 52Z" fill="#8fd3ff"/>` +
    `<path d="M20 16H44V56L58 66C66 72 62 86 52 86C46 86 40 82 34 78L24 70C20 67 20 64 20 60Z" fill="#fff"/>` +
    `<path d="M20 26H44M20 34H44" stroke="#e8553d" stroke-width="4"/>`,
  베개:
    `<path d="M12 30C30 38 70 38 88 30C80 44 80 62 88 76C70 68 30 68 12 76C20 62 20 44 12 30Z" fill="#e7f0ff"/>` +
    `<path d="M30 46q4 4 8 0M50 50q4 4 8 0M40 58q4 4 8 0M62 44q4 4 8 0" stroke="#9fb3d9" stroke-width="3"/>`,
  로봇:
    `<path d="M50 16V9"/>` +
    dot(50, 7, 4.5, '#e8553d') +
    `<path d="M26 58L16 72M74 58L84 72" stroke-width="5"/><rect x="44" y="44" width="12" height="8" fill="#7a8aa6"/>` +
    `<rect x="30" y="16" width="40" height="30" rx="6" fill="#b8c6da"/><circle cx="42" cy="30" r="5" fill="#8fd3ff"/><circle cx="58" cy="30" r="5" fill="#8fd3ff"/><path d="M42 39H58"/>` +
    `<rect x="26" y="50" width="48" height="34" rx="6" fill="#3b78e6"/><rect x="40" y="58" width="20" height="12" rx="3" fill="#ffd23f"/>`,
  길:
    `<rect x="4" y="30" width="92" height="64" fill="#8fd67a" stroke="none"/><path d="M4 30H96"/>` +
    `<path d="M42 30H58L90 94H10Z" fill="#8a8f99"/><path d="M50 36V44M50 52V62M50 72V86" stroke="#fff" stroke-width="4"/>`,
  가게:
    `<rect x="30" y="14" width="40" height="12" rx="3" fill="#fff"/><rect x="14" y="30" width="72" height="58" fill="#ffe7a8"/>` +
    `<path d="M10 30H90L86 44H14Z" fill="#e8553d"/><path d="M26 31L24 43M42 31L41 43M58 31L59 43M74 31L76 43" stroke="#fff" stroke-width="5"/>` +
    `<path d="M14 44q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0q6 7 12 0" fill="#e8553d"/>` +
    `<rect x="20" y="56" width="30" height="22" fill="#8fd3ff"/><circle cx="29" cy="72" r="4" fill="#e8403a"/><circle cx="40" cy="72" r="4" fill="#ffd23f"/>` +
    `<rect x="58" y="56" width="20" height="32" fill="#9a5b2e"/>`,
  달:
    `<circle cx="50" cy="50" r="42" fill="#23306b"/><circle cx="46" cy="50" r="28" fill="#ffd23f"/><circle cx="60" cy="42" r="24" fill="#23306b"/>`,
  비:
    blob('#c9d3e6', [
      [32, 36, 15],
      [50, 28, 19],
      [68, 38, 15],
      [50, 42, 15],
    ]) +
    drop(30, 62) +
    drop(50, 70) +
    drop(70, 62) +
    drop(40, 82, 0.8) +
    drop(62, 84, 0.8),
  무지개:
    ['#e8403a', '#ff9f1a', '#ffd23f', '#43b04a', '#3b78e6']
      .map((c, i) => {
        const r = 38 - i * 7;
        return `<path d="M${50 - r} 78A${r} ${r} 0 0 1 ${50 + r} 78" stroke="${c}" stroke-width="7.5"/>`;
      })
      .join('') +
    `<path d="M8.5 78A41.5 41.5 0 0 1 91.5 78M43.5 78A6.5 6.5 0 0 1 56.5 78" stroke-width="3"/>` +
    blob('#fff', [
      [12, 80, 9],
      [24, 82, 8],
    ]) +
    blob('#fff', [
      [76, 82, 8],
      [88, 80, 9],
    ]),
  오다:
    stick(76, 24, 'M0 10L0 32M0 16L-10 26M0 16L10 26M0 32L-8 50M0 32L8 50', 0.55) +
    `<path d="M68 48C60 58 52 62 44 64" stroke="#3b78e6" stroke-width="5" stroke-dasharray="6 5"/><path d="M50 56L42 65L53 69" stroke="#3b78e6" stroke-width="5"/>` +
    stick(28, 40, 'M0 10L0 34M0 16L-12 28M0 16L12 26M0 34L-9 54M0 34L9 54', 1.05),
  놀다:
    `<ellipse cx="40" cy="90" rx="14" ry="3" fill="#d0d6e6" stroke="none"/>` +
    stick(40, 22, 'M0 10L0 34M0 16L-13 2M0 16L13 4M0 34L-10 46L-6 56M0 34L10 44L8 56') +
    `<circle cx="74" cy="30" r="11" fill="#e8553d"/><path d="M65 26C70 30 78 30 83 26M74 19V41" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M20 12l-5-5M16 22h-7M60 12l4-5" stroke="${HL}" stroke-width="4"/>`,
  느리다:
    `<path d="M90 82H96" stroke="#9fb3d9" stroke-width="4"/>` +
    `<path d="M14 76C14 66 22 64 30 66L34 72H80C86 72 88 78 84 80H18C16 80 14 78 14 76Z" fill="#b8e07a"/>` +
    `<path d="M22 66C20 58 22 52 26 50M24 52L20 40M28 52L30 40"/>` +
    dot(20, 39, 3) +
    dot(30, 39, 3) +
    `<circle cx="58" cy="52" r="22" fill="#ffab5c"/><path d="M58 52m0-4a4 4 0 1 1-4 4a8 8 0 1 1 8 8a12 12 0 1 1-12-12" stroke-width="3"/>` +
    `<path d="M88 76h2M93 76h2" stroke="#9fb3d9" stroke-width="4"/>`,
  빠르다:
    `<path d="M4 44H22M8 56H24M4 68H20" stroke="#3b78e6" stroke-width="5"/>` +
    `<path d="M26 68C26 58 34 54 44 52L54 42C58 38 66 38 72 40L82 52C90 54 94 60 94 68Z" fill="#e8553d"/>` +
    `<path d="M57 44C61 42 66 42 70 44L76 52H52Z" fill="#8fd3ff"/>` +
    `<circle cx="42" cy="70" r="9" fill="${INK}"/><circle cx="80" cy="70" r="9" fill="${INK}"/>` +
    dot(42, 70, 3.5, '#fff') +
    dot(80, 70, 3.5, '#fff'),
};

/** 그림이 있는 단어 목록 (그린 순서) */
export const PICTURED_WORDS = Object.keys(PICTURES);

/** 그림 ID(p_단어)의 SVG. 그림이 없으면 null (그림 칸을 비운다). */
export function pictureSvg(pictureId: string): string | null {
  const inner = PICTURES[pictureId.replace(/^p_/, '')];
  if (!inner) return null;
  return (
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<g fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`
  );
}
