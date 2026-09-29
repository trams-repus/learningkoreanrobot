// 탈것 그림 묶음 (3단계: 궤도·하늘·우주·바다·눈길·일하는 차). 그림 규칙은 docs/picture-style.md.
// 비슷한 것끼리 색·모양·표시로 구별한다.
//  헬기: 소방(빨강+물바구니) · 구조(흰 몸+십자+밧줄 사람) · 경찰(파랑 줄+경광등+불빛)
//  배: 범선(흰 돛 여러 장) · 해적선(검은 돛+해골 깃발) · 거북선(등딱지 지붕+용머리) · 유조선(빨강 긴 배+관) · 컨테이너선(높이 쌓은 상자) · 크루즈(흰 여러 층+미끄럼틀)
//  우주: 인공위성(판 두 장) · 우주정거장(판 네 장+지구) · 탐사선(큰 접시+고리 행성) · 달착륙선(금색 다리) · 달탐사차(바퀴+달 땅)
import { INK, SKIN, HL, dot, blob, tube, person, stick, sparkle, drop } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number, hub = '#dfe8f5') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, hub);

/** 자전거 바퀴: 테두리만 굵게, 가운데 살 */
const bikeWheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" stroke-width="5"/><path d="M${x - r} ${y}H${x + r}M${x} ${y - r}V${y + r}" stroke-width="1.8"/>` +
  dot(x, y, 2.4);

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝까지) */
const waves = (y: number, fill = '#7ec8f0') =>
  `<path d="M2 ${y}q8-6 16 0t16 0t16 0t16 0t16 0t16 0V98H2Z" fill="${fill}"/>`;

/** 눈밭 */
const snow = (y: number) => `<path d="M2 ${y}Q30 ${y - 6} 55 ${y}T98 ${y - 2}V98H2Z" fill="#fff"/>`;

/** 달 땅 (회색+구덩이) */
const moon = (y: number) =>
  `<path d="M2 ${y}Q50 ${y - 8} 98 ${y}V98H2Z" fill="#c5cddc"/>` +
  `<ellipse cx="20" cy="${y + 8}" rx="8" ry="3" fill="#8a96b0" stroke-width="2.5"/><ellipse cx="78" cy="${y + 10}" rx="7" ry="2.6" fill="#8a96b0" stroke-width="2.5"/>`;

/** 창문 (하늘색) */
const win = (x: number, y: number, w: number, h: number, fill = '#8fd3ff') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke-width="2.5"/>`;

/** 속도선 (왼쪽 뒤) */
const speed = (ys: number[], x1 = 2, x2 = 12) =>
  `<path d="${ys.map((y) => `M${x1} ${y}H${x2}`).join('')}" stroke="#9aa6c4" stroke-width="3"/>`;

/** 번개 모양 (전기) */
const bolt = (x: number, y: number, s: number, fill = '#ffd23f') =>
  `<path d="M${x + 2 * s} ${y - 10 * s}L${x - 5 * s} ${y + 1 * s}H${x}L${x - 2 * s} ${y + 10 * s}L${x + 5 * s} ${y - 1 * s}H${x}Z" fill="${fill}" stroke-width="2.5"/>`;

/** 창 속 얼굴 (가운데 x, 창 아래 y) */
const kid = (x: number, y: number, hair = '#5a3b24') =>
  `<circle cx="${x}" cy="${y - 6}" r="5" fill="${SKIN}" stroke-width="2"/>` +
  `<path d="M${x - 5} ${y - 7}C${x - 5} ${y - 13} ${x + 5} ${y - 13} ${x + 5} ${y - 7}C${x + 2} ${y - 9} ${x - 2} ${y - 9} ${x - 5} ${y - 7}Z" fill="${hair}" stroke-width="2"/>`;

/** 경광등 (빨강·파랑) */
const siren = (x: number, y: number, w = 16) =>
  `<rect x="${x - w / 2}" y="${y}" width="${w / 2}" height="6" rx="2" fill="#e8553d" stroke-width="2.5"/>` +
  `<rect x="${x}" y="${y}" width="${w / 2}" height="6" rx="2" fill="#3b78e6" stroke-width="2.5"/>` +
  `<path d="M${x - w / 2 - 4} ${y - 2}l-4-4M${x + w / 2 + 4} ${y - 2}l4-4M${x} ${y - 4}v-5" stroke="${HL}" stroke-width="2.5"/>`;

/** 옆모습 승용차 (0~100 칸, 오른쪽을 봄). extra는 차체 위 무늬 */
const car = (body: string, extra = '') =>
  `<path d="M8 72V62C8 56 12 53 20 52L32 37C35 33 40 31 46 31H62C68 31 72 33 75 37L86 52C92 53 94 57 94 63V72Z" fill="${body}"/>` +
  extra +
  `<path d="M36 51L44 38H55V51Z" fill="#8fd3ff"/><path d="M61 51V38H70L78 51Z" fill="#8fd3ff"/>` +
  `<rect x="86" y="54" width="7" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
  wheel(28, 74, 11) +
  wheel(74, 74, 11);

/** 헬리콥터 (오른쪽을 봄). dy만큼 위로 올린다 */
const heli = (body: string, extra: string, dy = 0, tail = body) =>
  `<g transform="translate(0 ${-dy})">` +
  `<path d="M36 44L8 38V46L36 54Z" fill="${tail}"/>` +
  `<path d="M4 28H10L14 46H8Z" fill="${tail}"/>` +
  `<path d="M40 64L36 74M76 64L80 74M28 74H88" stroke-width="4"/>` +
  `<path d="M30 48C30 36 40 28 56 28H64C80 28 92 38 92 50C92 60 84 64 72 64H44C36 64 30 58 30 50Z" fill="${body}"/>` +
  `<path d="M66 32C78 32 87 40 88 50H66Z" fill="#8fd3ff" stroke-width="2.5"/>` +
  extra +
  `<rect x="54" y="20" width="8" height="8" fill="${INK}"/><path d="M18 19H96" stroke-width="5"/>` +
  `</g>`;

/** 배 몸통 (x1~x2, 갑판 y, 깊이 d) */
const hull = (x1: number, x2: number, y: number, d: number, fill: string) =>
  `<path d="M${x1} ${y}H${x2}L${x2 - 8} ${y + d}H${x1 + 8}Z" fill="${fill}"/>`;

/** 네모 돛 (가운데 x, 위 y, 너비 w, 높이 h) */
const sail = (x: number, y: number, w: number, h: number, fill = '#fff') =>
  `<path d="M${x - w / 2} ${y}Q${x} ${y + 3} ${x + w / 2} ${y}Q${x + w / 2 + 3} ${y + h / 2} ${x + w / 2} ${y + h}Q${x} ${y + h - 3} ${x - w / 2} ${y + h}Q${x - w / 2 + 3} ${y + h / 2} ${x - w / 2} ${y}Z" fill="${fill}"/>`;

/** 컨테이너 한 칸 */
const box = (x: number, y: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke-width="2.5"/>`;

/** 별 몇 개 (우주 배경) */
const stars = (ps: [number, number][]) => ps.map(([x, y]) => sparkle(x, y, 4)).join('');

/** 태양 전지판 (격자) */
const panel = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3b78e6"/>` +
  `<path d="M${x + w / 3} ${y}V${y + h}M${x + (2 * w) / 3} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="#bfe6ff" stroke-width="2"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;

/** 버스 몸통 (x1~x2, 위 y1, 바닥 y2), 앞이 오른쪽 */
const busBody = (x1: number, x2: number, y1: number, y2: number, fill: string) =>
  `<path d="M${x1} ${y2}V${y1 + 6}C${x1} ${y1 + 2} ${x1 + 2} ${y1} ${x1 + 6} ${y1}H${x2 - 8}C${x2 - 3} ${y1} ${x2} ${y1 + 3} ${x2} ${y1 + 8}V${y2}Z" fill="${fill}"/>`;

/** 꽃 한 송이 */
const flower = (x: number, y: number, r: number, fill: string) =>
  blob(fill, [
    [x - r, y, r * 0.8],
    [x + r, y, r * 0.8],
    [x, y - r, r * 0.8],
    [x, y + r, r * 0.8],
  ]) + dot(x, y, r * 0.6, '#ffd23f');

/** 오른쪽 뒤에서 보는 개 (썰매 끄는 개, 왼쪽을 봄) */
const dog = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})">` +
  `<path d="M-8 0V12M-3 0V12M8 0V12M13 0V12" stroke-width="3.5"/>` +
  `<path d="M16 -6C24 -12 26 -20 20 -22" stroke-width="4"/>` +
  `<ellipse cx="3" cy="-3" rx="14" ry="8" fill="#8a96b0"/>` +
  `<path d="M-6 2C0 6 8 6 14 2" stroke="#fff" stroke-width="3"/>` +
  `<path d="M-14 -20L-15 -30L-9 -24ZM-4 -22L-2 -31L-9 -25Z" fill="#8a96b0" stroke-width="2.5"/>` +
  `<circle cx="-10" cy="-15" r="8" fill="#8a96b0"/>` +
  `<path d="M-18 -14C-16 -8 -10 -8 -8 -12C-10 -14 -14 -15 -18 -14Z" fill="#fff" stroke-width="2"/>` +
  dot(-19, -14, 2) +
  dot(-11, -18, 1.8) +
  `</g>`;

export const PICS: Record<string, string> = {
  // ── 궤도 탈것 ──
  모노레일:
    `<rect x="30" y="62" width="10" height="34" fill="#dfe8f5"/><rect x="62" y="62" width="10" height="34" fill="#dfe8f5"/>` +
    `<rect x="3" y="54" width="94" height="10" rx="2" fill="#8a96b0"/>` +
    `<path d="M12 60V30C12 24 16 20 22 20H76C86 20 92 28 92 38V60C92 62 90 62 88 62H74V52H28V62H16C14 62 12 62 12 60Z" fill="#fff"/>` +
    `<rect x="13.8" y="44" width="76.4" height="6" fill="#3b78e6" stroke="none"/>` +
    win(18, 26, 12, 12) +
    win(34, 26, 12, 12) +
    win(50, 26, 12, 12) +
    `<path d="M68 26H78C83 26 86 30 87 38H68Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M28 52H74" stroke-width="3"/>`,
  자기부상열차:
    `<rect x="24" y="80" width="10" height="16" fill="#dfe8f5"/><rect x="66" y="80" width="10" height="16" fill="#dfe8f5"/>` +
    `<rect x="3" y="72" width="94" height="9" rx="2" fill="#8a96b0"/>` +
    `<path d="M10 64q4-4 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#a45cf0" stroke-width="3"/>` +
    `<path d="M4 58V40C4 34 8 30 16 30H62C80 30 94 42 96 58Z" fill="#fff"/>` +
    `<path d="M5.8 48H94" stroke="#a45cf0" stroke-width="5"/>` +
    `<rect x="12" y="35" width="44" height="8" rx="3" fill="#3b4a6b"/>` +
    `<path d="M66 34C74 35 80 38 84 43H66Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    sparkle(90, 20, 6, '#a45cf0') +
    sparkle(10, 18, 4, '#a45cf0'),
  산악열차:
    `<path d="M2 66L26 22L42 44L62 12L98 58V98H2Z" fill="#9fd08a"/>` +
    `<path d="M20 33L26 22L32 30L28 34ZM55 23L62 12L70 22L64 26Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M2 96L98 48V98Z" fill="#3a9e47"/>` +
    `<g transform="rotate(-26.6 50 72)">` +
    `<path d="M-6 72H106" stroke-width="4"/><path d="M4 76V72M14 76V72M24 76V72M34 76V72M44 76V72M54 76V72M64 76V72M74 76V72M84 76V72M94 76V72" stroke-width="3"/>` +
    `<rect x="18" y="38" width="64" height="28" rx="5" fill="#e8553d"/>` +
    `<rect x="16" y="32" width="68" height="7" rx="3" fill="#fff"/>` +
    win(24, 44, 12, 12) +
    win(40, 44, 12, 12) +
    win(56, 44, 12, 12) +
    `<rect x="72" y="44" width="6" height="16" rx="2" fill="#ffd23f" stroke-width="2.5"/>` +
    wheel(30, 68, 5) +
    wheel(70, 68, 5) +
    `</g>`,
  관광열차:
    `<path d="M4 20Q18 28 32 20T60 20T96 20" stroke-width="2"/>` +
    `<path d="M10 22l3 7l3-6ZM24 25l3 7l3-7ZM40 23l3 7l3-6ZM54 21l3 7l3-6ZM70 22l3 7l3-6ZM84 23l3 7l3-6Z" fill="#ff5c70" stroke-width="2"/>` +
    `<path d="M4 72V48C4 40 10 36 18 36H44C50 36 54 40 54 48V72Z" fill="#8fd3ff"/>` +
    `<path d="M4 72V56H54V72Z" fill="#a45cf0"/>` +
    kid(16, 56) +
    kid(30, 56, '#e8862e') +
    kid(43, 56, '#9a5b2e') +
    `<path d="M14 46l-4-6M44 46l4-6" stroke-width="2.5"/>` +
    `<path d="M58 72V46C58 40 62 38 68 38H80C90 38 96 46 96 56V72Z" fill="#ff9f1a"/>` +
    win(64, 44, 14, 12) +
    `<circle cx="90" cy="62" r="4" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M54 66H58" stroke-width="3"/>` +
    wheel(16, 76, 7) +
    wheel(42, 76, 7) +
    wheel(68, 76, 7) +
    wheel(86, 76, 7) +
    `<path d="M2 86H98" stroke-width="3"/>`,
  트램:
    `<path d="M2 12H98" stroke-width="2.5"/>` +
    `<path d="M50 12L40 20L50 26L60 20Z" stroke-width="2.5"/>` +
    `<rect x="2" y="84" width="96" height="12" fill="#b8c0d0"/><path d="M4 86H96" stroke="#fff" stroke-width="2"/>` +
    `<path d="M12 78V36C12 30 18 26 26 26H74C82 26 88 30 88 36V78Z" fill="#fff4d6"/>` +
    `<path d="M12 58H88V78H12Z" fill="#e8553d"/>` +
    `<path d="M12 78V36C12 30 18 26 26 26H74C82 26 88 30 88 36V78Z"/>` +
    win(18, 34, 14, 18) +
    win(36, 34, 14, 18) +
    win(54, 34, 14, 18) +
    win(72, 34, 11, 18) +
    `<path d="M40 60V76" stroke-width="2.5"/>` +
    wheel(28, 82, 6) +
    wheel(72, 82, 6),

  // ── 버스 ──
  대형버스:
    busBody(4, 82, 14, 78, '#1fa2a6') +
    `<rect x="5.8" y="60" width="74.4" height="6" fill="#fff" stroke="none"/>` +
    `<rect x="8" y="20" width="64" height="22" rx="3" fill="#3b4a6b"/>` +
    `<path d="M24 20V42M40 20V42M56 20V42" stroke="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M74 20H76C79 20 80 22 80 25V48H74Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M10 48H34V58H10ZM38 48H62V58H38Z" fill="#17878a" stroke-width="2.5"/>` +
    wheel(20, 80, 9) +
    wheel(40, 80, 9) +
    wheel(70, 80, 9) +
    person(91, 84, 0.55, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }) +
    `<path d="M2 90H98" stroke-width="3"/>`,
  미니버스:
    `<path d="M22 72V36C22 30 26 28 32 28H60C66 28 70 30 72 34L82 50C84 52 84 56 84 60V72Z" fill="#ff9f1a"/>` +
    win(27, 34, 14, 14) +
    win(45, 34, 14, 14) +
    `<path d="M63 34H66C68 34 69 35 70 36L78 50H63Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="23.8" y="54" width="58.4" height="5" fill="#fff" stroke="none"/>` +
    `<rect x="78" y="62" width="5" height="4" rx="1.5" fill="#ffd23f" stroke-width="2"/>` +
    wheel(36, 74, 9) +
    wheel(70, 74, 9) +
    `<path d="M10 86H90" stroke-width="3"/>`,
  전기버스:
    `<rect x="4" y="30" width="14" height="52" rx="3" fill="#dfe8f5"/>` +
    bolt(11, 44, 0.8) +
    `<path d="M11 66C11 86 24 84 28 70" stroke-width="3.5"/>` +
    busBody(24, 96, 18, 76, '#43b04a') +
    `<rect x="42" y="12" width="30" height="6" rx="2" fill="#8a96b0"/>` +
    win(30, 26, 14, 16) +
    win(48, 26, 14, 16) +
    win(66, 26, 14, 16) +
    `<path d="M84 26H88C91 26 92 28 92 31V48H84Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<circle cx="60" cy="60" r="9" fill="#fff" stroke-width="2.5"/>` +
    bolt(60, 60, 0.7) +
    wheel(38, 78, 9) +
    wheel(82, 78, 9),

  // ── 사람을 나르는 기계 ──
  곤돌라:
    waves(76) +
    `<path d="M4 50Q8 74 30 76H74Q92 74 97 40Q92 62 78 64H28Q12 64 8 46Z" fill="#30354f"/>` +
    `<path d="M88 54l5-8M91 58l6-6" stroke="#ffd23f" stroke-width="3"/>` +
    `<rect x="50" y="56" width="20" height="8" rx="3" fill="#e8553d" stroke-width="2.5"/>` +
    tube('M36 30L58 90', '#9a5b2e', 3) +
    person(26, 62, 0.9, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<path d="M16 54H36M15 59H37" stroke="#e8553d" stroke-width="3"/>` +
    `<ellipse cx="26" cy="23" rx="13" ry="3" fill="#f2c14e"/><path d="M19 23V18C19 14 33 14 33 18V23Z" fill="#f2c14e"/>` +
    `<path d="M19 20H33" stroke="#e8553d" stroke-width="3"/>` +
    tube('M32 48L40 40', SKIN, 3),
  리프트:
    `<path d="M2 70L30 40L52 60L76 30L98 52V98H2Z" fill="#fff"/>` +
    `<path d="M2 14L98 30" stroke-width="3"/>` +
    `<path d="M50 22V40" stroke-width="4"/>` +
    `<path d="M26 40H74" stroke-width="4"/><path d="M26 40V70M74 40V70" stroke-width="3.5"/>` +
    `<rect x="28" y="44" width="44" height="14" rx="3" fill="#3b78e6"/>` +
    person(40, 64, 0.8, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }) +
    person(60, 64, 0.8, { hair: '#9a5b2e', style: 'long', shirt: '#e85d9a' }) +
    `<rect x="26" y="62" width="48" height="6" rx="2" fill="#3b78e6"/>` +
    `<path d="M36 68V80M44 68V80M56 68V80M64 68V80" stroke-width="4"/>` +
    `<path d="M28 82L52 84M48 82L72 84" stroke="#e8553d" stroke-width="4"/>`,
  에스컬레이터:
    `<path d="M4 94L18 94L78 34H94V94Z" fill="#8a96b0"/>` +
    `<path d="M10 94H22V89H27V84H32V79H37V74H42V69H47V64H52V59H57V54H62V49H67V44H72V39H77V34H92V44H82L32 94Z" fill="#dfe8f5" stroke-width="2.5"/>` +
    tube('M6 70L62 14H90', INK, 4) +
    person(54, 58, 1.05, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    tube('M60 42L66 32', SKIN, 3) +
    `<path d="M16 42L34 24M34 24H24M34 24V34" stroke="#3b78e6" stroke-width="5"/>`,
  엘리베이터:
    `<rect x="14" y="10" width="62" height="84" fill="#dfe8f5"/>` +
    `<rect x="22" y="26" width="46" height="66" fill="#fff1b8"/>` +
    person(45, 90, 1.25, { hair: '#9a5b2e', style: 'pony', shirt: '#e85d9a' }) +
    `<rect x="22" y="26" width="10" height="66" fill="#b8c0d0"/><rect x="58" y="26" width="10" height="66" fill="#b8c0d0"/>` +
    `<rect x="36" y="14" width="18" height="8" rx="2" fill="#30354f" stroke-width="2.5"/>` +
    `<path d="M42 20L45 16L48 20Z" fill="#ffd23f" stroke="#ffd23f" stroke-width="1.5"/>` +
    `<rect x="80" y="44" width="12" height="24" rx="3" fill="#dfe8f5"/>` +
    `<path d="M82.5 54L86 48.5L89.5 54Z" fill="#ffd23f" stroke-width="1.8"/><path d="M82.5 58L86 63.5L89.5 58Z" fill="#fff" stroke-width="1.8"/>` +
    `<path d="M2 94H98" stroke-width="3"/>`,
  무빙워크:
    `<rect x="6" y="56" width="88" height="20" rx="3" fill="#bfe6ff"/>` +
    tube('M8 56H92', INK, 4) +
    tube('M36 64V76M44 64V76', '#3b4a6b', 4) +
    person(40, 66, 1.05, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    `<rect x="58" y="56" width="16" height="18" rx="3" fill="#e8553d"/><path d="M62 56V48H70V56" stroke-width="3"/>` +
    dot(62, 76, 2.2) +
    dot(70, 76, 2.2) +
    tube('M48 54L58 50', SKIN, 3) +
    `<rect x="3" y="78" width="94" height="10" rx="5" fill="#8a96b0"/>` +
    `<path d="M14 81l4 2l-4 2M28 81l4 2l-4 2M42 81l4 2l-4 2M56 81l4 2l-4 2M70 81l4 2l-4 2M84 81l4 2l-4 2" stroke="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M62 24H90M90 24l-7-6M90 24l-7 6" stroke="#3b78e6" stroke-width="5"/>` +
    `<path d="M10 30H22M6 40H18" stroke="#9aa6c4" stroke-width="3"/>`,
  // ── 자동차·트럭 ──
  자율주행차:
    car('#fff', `<path d="M9.8 62H92" stroke="#1fa2a6" stroke-width="5"/>`) +
    `<rect x="47" y="23" width="12" height="8" rx="2" fill="${INK}"/>` +
    dot(53, 27, 2, '#7ec8f0') +
    `<path d="M42 16q11-9 22 0M36 10q17-13 34 0" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M96 56q3 4 0 8M96 50q6 8 0 20" stroke="#3b78e6" stroke-width="3"/>`,
  픽업트럭:
    `<path d="M4 70V48H48V70Z" fill="#e8553d"/>` +
    `<rect x="10" y="32" width="16" height="16" fill="#d9a066"/><path d="M18 32V40" stroke="#f5e3b8" stroke-width="3"/>` +
    `<rect x="27" y="38" width="16" height="10" fill="#43b04a"/>` +
    `<path d="M4 48H48" stroke-width="4"/>` +
    `<path d="M48 70V32C48 29 50 28 53 28H66C70 28 72 29 74 32L82 46H90C94 46 96 50 96 56V70Z" fill="#e8553d"/>` +
    `<path d="M56 34H67L74 46H56Z" fill="#8fd3ff"/>` +
    `<rect x="89" y="52" width="6" height="5" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(22, 72, 11) +
    wheel(76, 72, 11),
  레이싱카:
    speed([46, 56, 66], 2, 12) +
    `<path d="M14 42H30V70H22Z" fill="#e8553d"/><rect x="10" y="36" width="22" height="7" rx="2" fill="#e8553d"/>` +
    `<path d="M18 70V56C18 52 22 50 28 50H48C52 44 58 42 64 44L80 54C88 56 96 60 96 66V70Z" fill="#e8553d"/>` +
    `<path d="M20 62H94" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="54" cy="44" r="8" fill="#ffd23f"/><path d="M50 44H60" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="40" cy="58" r="5" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M86 66H98" stroke-width="4"/>` +
    wheel(28, 72, 12) +
    wheel(80, 72, 11) +
    `<rect x="70" y="14" width="22" height="16" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M70 14h5.5v4h-5.5zM81 14h5.5v4h-5.5zM75.5 18h5.5v4h-5.5zM86.5 18h5.5v4h-5.5zM70 22h5.5v4h-5.5zM81 22h5.5v4h-5.5zM75.5 26h5.5v4h-5.5zM86.5 26h5.5v4h-5.5z" fill="${INK}" stroke="none"/>` +
    `<path d="M70 14V44" stroke-width="3"/>`,
  수륙양용차:
    `<path d="M10 58V40C10 34 14 30 22 30H62L74 42H86C92 42 96 48 94 58Z" fill="#ffd23f"/>` +
    `<path d="M26 34H44V42H26ZM48 34H60L66 42H48Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M10 50H94" stroke="#43b04a" stroke-width="4"/>` +
    wheel(30, 62, 10) +
    wheel(70, 62, 10) +
    waves(64) +
    `<path d="M6 60C0 56 0 48 4 46M8 64C0 64 -2 70 4 74" stroke="#fff" stroke-width="3"/>` +
    blob('#fff', [
      [8, 62, 4],
      [2, 58, 3],
      [94, 62, 4],
    ]) +
    `<path d="M16 76q6 3 12 0M52 80q6 3 12 0" stroke="#fff" stroke-width="3"/>`,

  // ── 헬기 ──
  소방헬기:
    heli('#e8553d', `<path d="M31 52H90" stroke="#fff" stroke-width="4"/>`, 12) +
    `<path d="M58 52V70" stroke-width="3"/>` +
    `<path d="M48 70H68L64 82H52Z" fill="#e8553d"/>` +
    drop(54, 84, 0.8) +
    drop(62, 86, 0.7) +
    drop(58, 90, 0.5),
  구조헬기:
    heli('#fff', `<path d="M31 54H90" stroke="#ff9f1a" stroke-width="5"/><path d="M44 36h6v6h6v6h-6v6h-6v-6h-6v-6h6Z" fill="#e8553d" stroke-width="2"/>`, 14, '#ff9f1a') +
    `<path d="M78 50V54L69 62M78 54L87 62" stroke-width="2.5"/>` +
    stick(78, 70, 'M0 10V28M0 14L-12 -10M0 14L12 -10M0 28L-7 34M0 28L7 34', 0.75) +
    `<rect x="73" y="77" width="10" height="12" rx="3" fill="#ff9f1a" stroke-width="2.5"/>`,
  경찰헬기:
    `<path d="M50 60L22 96H78L66 60Z" fill="#fff1b8" stroke="none"/>` +
    heli('#fff', `<path d="M31 52H90" stroke="#3b78e6" stroke-width="7"/>`, 10, '#3b78e6') +
    siren(40, 18, 12) +
    `<rect x="54" y="54" width="10" height="6" rx="2" fill="#ffd23f" stroke-width="2.5"/>`,

  // ── 두 바퀴·한 바퀴 ──
  경찰오토바이:
    `<path d="M16 66V44" stroke-width="3"/>` +
    siren(16, 38, 12) +
    tube('M72 48L80 78', '#8a96b0', 3) +
    wheel(22, 78, 12) +
    wheel(80, 78, 12) +
    person(44, 60, 1, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6', cap: '#fff' }) +
    `<path d="M8 66C10 58 18 56 28 58H40L50 52H66L74 58L70 68H8Z" fill="#fff"/>` +
    `<path d="M12 64H70" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M68 48L74 32L84 34L76 50Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    tube('M50 44L70 46', '#3b78e6', 4) +
    `<rect x="76" y="50" width="8" height="6" rx="2" fill="#ffd23f" stroke-width="2"/>`,
  배달오토바이:
    `<rect x="6" y="28" width="28" height="26" rx="3" fill="#e8553d"/>` +
    `<path d="M12 44C12 36 28 36 28 44Z" fill="#ffd23f" stroke-width="2.5"/><path d="M11 44H29" stroke-width="3"/><path d="M16 38l2-5M24 38l-2-5" stroke="#9aa6c4" stroke-width="2"/>` +
    person(46, 60, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#43b04a', cap: '#ffd23f' }) +
    `<path d="M10 58H40L46 64H66L74 44H80L84 66H10Z" fill="#3b78e6"/>` +
    `<path d="M74 44L78 28H86" stroke-width="4"/>` +
    tube('M52 46L78 30', '#43b04a', 4) +
    `<rect x="84" y="46" width="7" height="6" rx="2" fill="#ffd23f" stroke-width="2"/>` +
    wheel(24, 76, 11) +
    wheel(78, 76, 11),
  전동킥보드:
    `` +
    tube('M68 82L78 18', '#3b78e6', 5) +
    tube('M68 18H90', INK, 2) +
    `<rect x="64" y="40" width="12" height="20" rx="3" fill="#43b04a" transform="rotate(9 70 50)"/>` +
    bolt(70, 50, 0.7) +
    `<circle cx="80" cy="26" r="4" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="16" y="78" width="56" height="8" rx="4" fill="#4a4f66"/>` +
    wheel(20, 88, 8) +
    wheel(70, 88, 8) +
    `<path d="M84 26l8-3M84 30l9 1" stroke="${HL}" stroke-width="2.5"/>` +
    `<path d="M6 40H22M4 52H18M8 64H24" stroke="#9aa6c4" stroke-width="3"/>`,
  외발자전거:
    stick(50, 16, 'M0 10V32M0 16L-24 10M0 16L24 10M0 32L-6 44L-4 58M0 32L6 42L6 50', 1) +
    `<ellipse cx="50" cy="50" rx="10" ry="4" fill="#e8553d"/>` +
    `<path d="M50 54V72" stroke-width="4"/>` +
    bikeWheel(50, 74, 18) +
    `<path d="M46 74L42 74M54 74L58 74" stroke-width="3"/>` +
    `<path d="M10 94H90" stroke-width="3"/>` +
    `<path d="M16 20q-4 6 0 12M84 20q4 6 0 12" stroke="#9aa6c4" stroke-width="3"/>`,
  이인용자전거:
    bikeWheel(16, 76, 13) +
    bikeWheel(84, 76, 13) +
    `<path d="M16 76L30 54H62L84 76M30 54L44 76L62 54M44 76H70L62 54M78 38L84 76" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M72 38H84" stroke-width="4"/>` +
    person(32, 50, 0.85, { hair: '#9a5b2e', style: 'long', shirt: '#43b04a' }) +
    person(60, 50, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    `<rect x="24" y="48" width="14" height="5" rx="2" fill="${INK}"/><rect x="54" y="48" width="14" height="5" rx="2" fill="${INK}"/>` +
    tube('M38 38L58 36', SKIN, 2.5) +
    tube('M66 38L76 38', SKIN, 2.5) +
    `<path d="M32 52L44 76M60 52L70 76" stroke-width="3.5"/>`,
  산악자전거:
    `<path d="M2 76L98 52V98H2Z" fill="#9a5b2e"/>` +
    blob('#8a96b0', [
      [16, 80, 5],
      [80, 62, 4],
    ]) +
    `<g transform="rotate(-14 50 60)">` +
    `<circle cx="24" cy="66" r="14" stroke-width="8"/><circle cx="24" cy="66" r="14" stroke="#4a4f66" stroke-width="3" stroke-dasharray="3 4"/>` +
    `<circle cx="78" cy="66" r="14" stroke-width="8"/><circle cx="78" cy="66" r="14" stroke="#4a4f66" stroke-width="3" stroke-dasharray="3 4"/>` +
    `<path d="M24 66L40 44H68L78 66M40 44L50 66L68 44M50 66H24M68 44L72 32" stroke="#43b04a" stroke-width="5"/>` +
    `<path d="M64 32H78" stroke-width="4"/>` +
    person(42, 42, 0.95, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a', cap: '#3b78e6' }) +
    `<rect x="34" y="40" width="14" height="5" rx="2" fill="${INK}"/>` +
    tube('M50 26L66 32', SKIN, 3) +
    `<path d="M42 44L50 66" stroke-width="3.5"/>` +
    `</g>`,

  // ── 눈길 ──
  개썰매:
    snow(82) +
    `<g transform="translate(27 64) scale(1.2)">${dog(0, 0).replace(/^<g transform="translate\(0 0\)">/, '<g>')}</g>` +
    `<path d="M10 54L58 64" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M56 82H90C94 82 96 78 94 74" stroke-width="3.5"/>` +
    `<path d="M58 78V68H88V78Z" fill="#9a5b2e"/><path d="M62 72H84" stroke="#d9a066" stroke-width="3"/>` +
    `<path d="M62 78V82M84 78V82" stroke-width="3"/>` +
    person(80, 68, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6', cap: '#e8553d' }) +
    `<path d="M88 52V68" stroke-width="3"/>`,
  순록썰매:
    snow(84) +
    `<path d="M16 64V82M22 64V82M34 64V82M40 64V82" stroke-width="4"/>` +
    `<ellipse cx="28" cy="58" rx="16" ry="10" fill="#9a5b2e"/>` +
    `<path d="M16 54L12 36" stroke-width="12"/><path d="M16 54L12 36" stroke="#9a5b2e" stroke-width="7"/>` +
    `<path d="M12 30L8 12M9 18L2 14M10 22L16 14M16 30L22 14M20 20L26 16M19 24L12 16" stroke="#6b3e26" stroke-width="3.5"/>` +
    `<ellipse cx="12" cy="36" rx="9" ry="7" fill="#9a5b2e"/>` +
    dot(6, 38, 3, '#e8553d') +
    dot(13, 33, 1.8) +
    `<path d="M20 46L14 50" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M40 56L56 62" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M52 84H92C96 84 98 78 94 74" stroke-width="3.5"/>` +
    `<path d="M54 80V60C54 56 58 54 62 56L90 58C94 58 94 62 92 66L88 80Z" fill="#e8553d"/>` +
    `<path d="M58 80V84M86 80V84" stroke-width="3"/>` +
    `<rect x="64" y="44" width="14" height="14" fill="#43b04a"/><path d="M71 44V58M64 51H78" stroke="#ffd23f" stroke-width="3"/>` +
    `<rect x="78" y="48" width="10" height="10" fill="#3b78e6"/><path d="M83 48V58" stroke="#fff" stroke-width="2.5"/>`,
  스노모빌:
    snow(82) +
    blob('#fff', [
      [10, 70, 7],
      [4, 62, 4],
      [16, 62, 4],
    ]) +
    `<rect x="16" y="66" width="44" height="14" rx="7" fill="#4a4f66"/>` +
    [24, 34, 44, 54].map((x) => dot(x, 73, 3, '#a9b4c9')).join('') +
    person(46, 54, 1.05, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6', cap: '#e8553d' }) +
    `<path d="M14 56H56L66 44H78L92 60V66H14Z" fill="#e8553d"/>` +
    `<path d="M68 44L74 30L82 32L78 44Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    tube('M52 38L70 38', '#3b78e6', 4) +
    `<path d="M80 66L78 78M56 78H92C96 78 98 74 96 70" stroke-width="4"/>`,

  // ── 배 ──
  범선:
    waves(76) +
    `<path d="M30 16V70M52 8V70M74 16V70" stroke="#6b3e26" stroke-width="3.5"/>` +
    sail(30, 22, 20, 18) +
    sail(30, 44, 24, 20) +
    sail(52, 14, 22, 18) +
    sail(52, 36, 28, 26) +
    sail(74, 22, 20, 18) +
    sail(74, 44, 24, 20) +
    `<path d="M52 8H62L58 12L62 16H52" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M76 64L96 50" stroke="#6b3e26" stroke-width="3"/>` +
    hull(6, 94, 64, 16, '#9a5b2e') +
    `<path d="M12 70H90" stroke="#f2c14e" stroke-width="3"/>`,
  해적선:
    waves(76) +
    `<path d="M32 18V66M62 8V66" stroke="#6b3e26" stroke-width="3.5"/>` +
    sail(32, 26, 26, 36, '#30354f') +
    sail(62, 18, 34, 44, '#30354f') +
    `<circle cx="62" cy="36" r="9" fill="#fff" stroke-width="2.5"/><rect x="57" y="40" width="10" height="7" rx="2" fill="#fff" stroke-width="2.5"/>` +
    dot(58.5, 35, 2.4) +
    dot(65.5, 35, 2.4) +
    `<path d="M50 50L74 58M74 50L50 58" stroke="#fff" stroke-width="4"/>` +
    `<path d="M62 8H74L70 12L74 16H62" fill="#e8553d" stroke-width="2.5"/>` +
    hull(6, 94, 64, 16, '#6b3e26') +
    `<rect x="4" y="56" width="18" height="10" fill="#6b3e26"/>` +
    [30, 46, 62, 78].map((x) => dot(x, 71, 3, '#ffd23f')).join(''),
  거북선:
    waves(78) +
    `<path d="M14 78L8 92M28 78L24 92M42 78L40 92M56 78L56 92M70 78L72 92" stroke="#9a5b2e" stroke-width="4"/>` +
    hull(4, 88, 60, 18, '#9a5b2e') +
    `<path d="M10 62C10 36 26 26 46 26S82 36 82 62Z" fill="#6f8f3a"/>` +
    `<path d="M34 30L28 46L36 58H56L64 46L58 30M28 46H14M64 46H80M36 58L32 62M56 58L60 62M40 28L46 38L52 28" stroke="#3d5a22" stroke-width="3"/>` +
    `<path d="M22 36l-2-6l6 3ZM36 28l-1-6l5 4ZM52 26l1-6l4 5ZM68 32l3-5l2 6ZM78 44l5-3l-1 6Z" fill="#dfe8f5" stroke-width="2"/>` +
    `<path d="M82 60V48C82 42 86 38 92 40C97 42 98 48 96 52L90 54L96 58C94 62 90 62 86 62Z" fill="#e8553d"/>` +
    dot(90, 45, 2.2) +
    `<path d="M92 36l2-5M86 38l-1-5" stroke="#ffd23f" stroke-width="3"/>` +
    blob('#dfe8f5', [
      [94, 26, 4],
      [88, 22, 3],
    ]),
  통나무배:
    waves(68) +
    tube('M22 30L42 44', SKIN, 3) +
    person(48, 60, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    tube('M28 20L60 90', '#d9a066', 3) +
    `<ellipse cx="44" cy="64" rx="18" ry="3" fill="#e8b886" stroke="none"/>` +
    `<path d="M10 60H90C94 60 96 64 96 68C96 76 90 78 84 78H16C10 78 4 76 4 68C4 64 6 60 10 60Z" fill="#9a5b2e"/>` +
    `<path d="M14 62C26 68 70 68 86 62" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="9" cy="69" rx="5" ry="8" fill="#d9a066"/><ellipse cx="9" cy="69" rx="2" ry="4" stroke="#9a5b2e" stroke-width="2"/>` +
    `<path d="M30 72H44M56 74H72" stroke="#6b3e26" stroke-width="2.5"/>`,
  나룻배:
    waves(72) +
    `<path d="M8 72V46M12 72V52M92 72V44M88 72V52" stroke="#3a9e47" stroke-width="3"/>` +
    `<ellipse cx="8" cy="44" rx="2.5" ry="5" fill="#9a5b2e" stroke-width="2"/><ellipse cx="92" cy="42" rx="2.5" ry="5" fill="#9a5b2e" stroke-width="2"/>` +
    tube('M36 18L20 92', '#d9a066', 2.5) +
    person(32, 62, 1.1, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<path d="M18 26L32 14L46 26Z" fill="#f2c14e"/>` +
    tube('M28 44L36 36', SKIN, 3) +
    person(64, 64, 0.9, { hair: '#9a5b2e', style: 'bun', shirt: '#e85d9a' }) +
    `<path d="M14 62H90L82 78H22Z" fill="#c68a4e"/><path d="M18 68H86" stroke="#9a5b2e" stroke-width="2.5"/>`,
  오리배:
    waves(74) +
    `<path d="M8 72C6 58 14 50 26 50H70V72Z" fill="#ffd23f"/>` +
    `<path d="M10 52L6 44L16 50Z" fill="#ffd23f"/>` +
    `<rect x="22" y="26" width="46" height="6" rx="3" fill="#ff5c70"/><path d="M26 32V50M64 32V50" stroke-width="3"/>` +
    kid(38, 52) +
    kid(52, 52, '#e8862e') +
    `<path d="M20 58C28 52 36 58 34 64" stroke="#e8b800" stroke-width="3"/>` +
    `<path d="M62 72C60 56 64 46 72 38C68 30 72 20 82 20C90 20 94 28 92 34L98 38L90 42C86 50 86 60 90 72Z" fill="#ffd23f"/>` +
    `<path d="M90 34L98 37L91 41Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    dot(84, 30, 2.6) +
    `<circle cx="80" cy="36" r="3" fill="#ff9aa8" stroke="none" opacity=".6"/>`,
  백조보트:
    waves(76) +
    `<path d="M4 74C2 56 8 44 20 42C26 50 30 58 30 62H66V74Z" fill="#fff"/>` +
    `<path d="M8 60C12 52 18 50 22 56M10 68C14 60 22 60 26 66" stroke="#9aa6c4" stroke-width="2.5"/>` +
    person(40, 64, 0.72, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    person(56, 64, 0.72, { hair: '#9a5b2e', style: 'pony', shirt: '#e85d9a' }) +
    `<path d="M28 62H70V76H6" fill="#fff"/>` +
    `<path d="M62 76C62 62 80 62 80 46C80 32 72 28 74 18C76 10 88 10 90 18L97 24L89 26C86 32 92 42 92 52C92 64 86 70 82 76Z" fill="#fff"/>` +
    `<path d="M90 18L97 23L89 26Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    dot(84, 17, 2.4),
  바나나보트:
    waves(70) +
    `<path d="M94 26L84 36" stroke-width="2.5"/>` +
    `<path d="M88 22H98V32H88Z" fill="#e8553d" stroke-width="2.5"/>` +
    person(30, 62, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }) +
    person(50, 60, 0.85, { hair: '#9a5b2e', style: 'long', shirt: '#ff9f1a' }) +
    person(70, 58, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#ff9f1a' }) +
    `<path d="M4 62C10 70 30 76 54 74C72 72 84 64 86 52C88 50 92 52 90 56C86 74 66 84 44 84C24 84 8 76 4 68Z" fill="#ffd23f"/>` +
    `<path d="M4 62C3 60 6 58 8 60" fill="#6b3e26" stroke-width="3"/>` +
    `<path d="M84 54L86 36" stroke-width="2.5"/>` +
    `<path d="M14 72q20 6 40 2" stroke="#e8b800" stroke-width="3"/>` +
    blob('#fff', [
      [8, 76, 4],
      [2, 72, 3],
    ]),
  유조선:
    waves(74) +
    `<path d="M8 62V44H26V62Z" fill="#fff"/>` +
    win(12, 48, 10, 6) +
    `<rect x="14" y="34" width="8" height="10" fill="#ff9f1a"/>` +
    `<path d="M4 60H96L90 78H10Z" fill="#e8553d"/>` +
    `<path d="M5 64H95" stroke-width="3"/>` +
    `<path d="M28 58H90" stroke="#8a96b0" stroke-width="4"/>` +
    [38, 56, 74].map((x) => `<path d="M${x - 8} 60a8 8 0 0 1 16 0Z" fill="#dfe8f5"/>`).join('') +
    `<path d="M48 66c-2 3-3 5-3 6a3 3 0 0 0 6 0c0-1-1-3-3-6Z" fill="#30354f" stroke-width="1.5"/>`,
  컨테이너선:
    waves(76) +
    `<path d="M76 62V26H92V62Z" fill="#fff"/>` +
    win(79, 30, 10, 7) +
    `<rect x="82" y="18" width="6" height="8" fill="#e8553d"/>` +
    [
      [6, 50, '#e8553d'],
      [6, 38, '#3b78e6'],
      [6, 26, '#ffd23f'],
      [24, 50, '#43b04a'],
      [24, 38, '#ff9f1a'],
      [24, 26, '#e85d9a'],
      [24, 14, '#3b78e6'],
      [42, 50, '#ffd23f'],
      [42, 38, '#e8553d'],
      [42, 26, '#43b04a'],
      [58, 50, '#3b78e6'],
      [58, 38, '#ff9f1a'],
      [58, 26, '#e8553d'],
    ]
      .map(([x, y, c]) => box(x as number, y as number, 18, 12, c as string))
      .join('') +
    `<path d="M4 62H96L88 80H12Z" fill="#30354f"/><path d="M5 66H95" stroke="#e8553d" stroke-width="3"/>`,
  크루즈:
    waves(78) +
    `<path d="M24 32V22H38V32Z" fill="#e8553d"/><path d="M24 26H38" stroke="#fff" stroke-width="3"/>` +
    `<path d="M62 32C64 22 78 22 76 14C74 8 66 10 68 16" stroke="#3b8fe0" stroke-width="5"/>` +
    `<path d="M14 44V32H86V44Z" fill="#fff"/>` +
    `<path d="M8 56V44H92V56Z" fill="#fff"/>` +
    [18, 28, 38, 48, 58, 68, 78].map((x) => dot(x + 4, 38, 2.6, '#3b4a6b')).join('') +
    [14, 24, 34, 44, 54, 64, 74, 84].map((x) => dot(x + 2, 50, 2.6, '#3b4a6b')).join('') +
    `<path d="M4 56H96L86 78H14Z" fill="#3b78e6"/>` +
    [24, 40, 56, 72].map((x) => dot(x, 66, 3, '#fff')).join('') +
    `<path d="M4 60H96" stroke="#ffd23f" stroke-width="3"/>`,
  경비정:
    waves(72) +
    `<path d="M26 50V36C26 33 28 32 30 32H62L72 50Z" fill="#fff"/>` +
    `<path d="M30 36H60L66 44H30Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    `<path d="M46 32V16" stroke-width="3"/>` +
    siren(46, 16, 12) +
    `<path d="M4 50H96L86 74H14Z" fill="#fff"/>` +
    `<path d="M50 50.5L42 73.5H52L60 50.5Z" fill="#3b78e6" stroke="none"/><path d="M62 50.5L54 73.5H59L67 50.5Z" fill="#e8553d" stroke="none"/>` +
    `<path d="M4 50H96L86 74H14Z"/>` +
    `<rect x="78" y="42" width="12" height="8" rx="2" fill="#8a96b0"/>`,
  쇄빙선:
    `<rect x="2" y="70" width="96" height="28" fill="#e8f7ff"/>` +
    `<path d="M2 70H98" stroke-width="3"/>` +
    `<path d="M10 80L22 86L30 80M40 92L52 86L62 94M72 84L84 90" stroke="#9fd4e8" stroke-width="3"/>` +
    `<path d="M20 22V34H48V22Z" fill="#fff"/>` +
    win(24, 25, 20, 6) +
    `<path d="M14 50V34H56V50Z" fill="#fff"/>` +
    win(18, 38, 10, 7) +
    win(32, 38, 10, 7) +
    `<rect x="60" y="28" width="10" height="22" fill="#ff9f1a"/>` +
    `<path d="M6 50H80L94 62L86 78H12Z" fill="#e8553d"/>` +
    `<path d="M8 58H87" stroke="#fff" stroke-width="3"/>` +
    `<path d="M84 76L92 66L98 70V80L90 84Z" fill="#7ec8f0"/>` +
    `<path d="M86 60l6-8l5 4l-3 6ZM90 72l6-4l2 8l-6 2Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M74 84l8-2l2 6l-8 2Z" fill="#fff" stroke-width="2.5"/>`,
  // ── 하늘 ──
  수송기:
    `<path d="M10 46L6 16H16L30 38Z" fill="#8a96b0"/>` +
    `<path d="M8 50C8 40 18 34 32 34H80C90 34 96 42 96 50C96 58 90 62 80 62H36C22 62 8 60 8 50Z" fill="#8a96b0"/>` +
    `<path d="M84 38C90 38 94 42 95 48H84Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M26 62L12 82H30L40 62Z" fill="#6f7a92"/>` +
    `<rect x="16" y="68" width="12" height="10" fill="#d9a066" stroke-width="2.5"/>` +
    `<rect x="30" y="28" width="46" height="7" rx="3.5" fill="#dfe8f5"/>` +
    `<ellipse cx="46" cy="40" rx="7" ry="4.5" fill="#4a4f66"/><ellipse cx="64" cy="40" rx="7" ry="4.5" fill="#4a4f66"/>` +
    `<path d="M53 32V48M71 32V48" stroke-width="3"/>` +
    `<path d="M50 62V68M76 62V68" stroke-width="3"/>` +
    wheel(50, 71, 4) +
    wheel(76, 71, 4),
  글라이더:
    blob('#fff', [
      [18, 86, 9],
      [32, 82, 11],
      [48, 88, 8],
      [74, 88, 9],
      [86, 84, 8],
    ]) +
    `<path d="M12 52L6 32H16L26 50Z" fill="#fff"/><path d="M2 32H22" stroke-width="4"/>` +
    `<path d="M12 54C30 46 62 44 82 46C94 48 96 54 88 58C70 62 36 60 12 58Z" fill="#fff"/>` +
    `<path d="M64 46C68 38 78 38 82 46Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M4 34L96 50L94 56L4 40Z" fill="#fff"/>` +
    `<path d="M4 34L14 36L12 42L4 40ZM96 50L86 48L86 54L94 56Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M40 22H58M30 16H44M66 24H80" stroke="#9aa6c4" stroke-width="3"/>`,
  행글라이더:
    blob('#fff', [
      [14, 84, 7],
      [26, 86, 8],
      [80, 82, 7],
    ]) +
    `<path d="M50 12L96 48Q72 40 50 42Q28 40 4 48Z" fill="#ff9f1a"/>` +
    `<path d="M50 12L27 44.5Q38 41.5 50 42Z" fill="#ffd23f" stroke="none"/><path d="M50 12L73 44.5Q62 41.5 50 42Z" fill="#3b8fe0" stroke="none"/>` +
    `<path d="M50 12L96 48Q72 40 50 42Q28 40 4 48Z"/>` +
    `<path d="M50 42L38 70H62Z" stroke-width="3"/>` +
    stick(50, 50, 'M0 10V26M0 14L-10 20M0 14L10 20M0 26L-4 40M0 26L4 40', 1) +
    `<path d="M50 42V40" stroke-width="3"/>`,
  제트기:
    `<g transform="rotate(-35 50 50)">` +
    `<path d="M6 44H22M4 56H20M8 50H18" stroke="#9aa6c4" stroke-width="3"/>` +
    blob('#ff9f1a', [[22, 50, 5]]) +
    `<path d="M50 48L30 16H40L64 46ZM50 52L30 84H40L64 54Z" fill="#3b78e6"/>` +
    `<path d="M28 48L20 36H26L36 48ZM28 52L20 64H26L36 52Z" fill="#3b78e6"/>` +
    `<path d="M24 46H78C88 46 96 48 98 50C96 52 88 54 78 54H24Z" fill="#dfe8f5"/>` +
    `<path d="M70 47C76 45 84 47 86 50C84 52 76 53 70 52Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `</g>`,

  // ── 우주 ──
  인공위성:
    stars([
      [12, 14],
      [88, 86],
      [86, 12],
    ]) +
    `<path d="M88 100A28 28 0 0 1 60 74" stroke="none"/>` +
    `<g transform="rotate(-18 50 50)">` +
    `<path d="M34 50H38M62 50H66" stroke-width="3"/>` +
    panel(4, 40, 30, 20) +
    panel(66, 40, 30, 20) +
    `<path d="M50 36V26" stroke-width="3"/>` +
    `<path d="M40 22Q50 32 60 22Z" fill="#dfe8f5"/>` +
    dot(50, 18, 2.4) +
    `<rect x="38" y="36" width="24" height="28" rx="2" fill="#ffc933"/>` +
    `<path d="M42 44H58M42 52H58" stroke="#e8a800" stroke-width="2.5"/>` +
    `</g>`,
  우주정거장:
    `<path d="M2 84Q50 70 98 84V98H2Z" fill="#4a90e2"/>` +
    blob('#43b04a', [
      [24, 88, 5],
      [66, 86, 4],
    ]) +
    stars([
      [12, 12],
      [90, 10],
    ]) +
    `<path d="M8 44H92" stroke-width="5"/>` +
    panel(8, 16, 16, 24) +
    panel(8, 48, 16, 24) +
    panel(76, 16, 16, 24) +
    panel(76, 48, 16, 24) +
    `<path d="M16 40V48M84 40V48" stroke-width="3"/>` +
    `<rect x="34" y="36" width="32" height="16" rx="6" fill="#fff"/>` +
    `<rect x="44" y="24" width="12" height="40" rx="5" fill="#fff"/>` +
    dot(50, 44, 3, '#3b78e6'),
  탐사선:
    `<circle cx="22" cy="76" r="13" fill="#f2c14e"/>` +
    `<ellipse cx="22" cy="76" rx="22" ry="5" stroke="#e8862e" stroke-width="4"/>` +
    `<path d="M9 74C9 82 14 89 22 89S35 82 35 74" fill="#f2c14e" stroke="none"/>` +
    `<path d="M9 74C9 82 14 89 22 89S35 82 35 74"/>` +
    stars([
      [12, 14],
      [88, 86],
      [62, 90],
    ]) +
    `<path d="M66 58L96 80M58 58L44 80" stroke-width="3"/>` +
    dot(96, 80, 3) +
    `<path d="M50 44H74L78 52L74 60H50L46 52Z" fill="#ffc933"/>` +
    `<path d="M62 44V38" stroke-width="3"/>` +
    `<path d="M32 20Q62 50 92 20Z" fill="#fff"/>` +
    `<path d="M40 22Q62 40 84 22" stroke="#dfe8f5" stroke-width="3"/>` +
    `<path d="M62 30V12" stroke-width="3"/>` +
    dot(62, 10, 3.2),
  우주왕복선:
    blob('#ff9f1a', [
      [24, 88, 6],
      [50, 88, 7],
      [76, 88, 6],
    ]) +
    blob('#ffd23f', [
      [24, 86, 3],
      [50, 86, 4],
      [76, 86, 3],
    ]) +
    `<path d="M36 82V26C36 14 50 6 50 6S64 14 64 26V82Z" fill="#e8862e"/>` +
    `<path d="M18 82V30C18 22 24 16 24 16S30 22 30 30V82Z" fill="#fff"/><path d="M70 82V30C70 22 76 16 76 16S82 22 82 30V82Z" fill="#fff"/>` +
    `<path d="M18 76H30M70 76H82" stroke-width="3"/>` +
    `<path d="M42 54L26 80H74L58 54Z" fill="#fff"/>` +
    `<path d="M26 80H74" stroke-width="5"/>` +
    `<path d="M42 80V36C42 28 50 20 50 20S58 28 58 36V80Z" fill="#fff"/>` +
    `<path d="M44 32C46 26 50 20 50 20S54 26 56 32Z" fill="${INK}"/>` +
    `<path d="M46 38H54V42H46Z" fill="#3b4a6b" stroke-width="2"/>` +
    `<path d="M50 56V78" stroke-width="2.5"/>`,
  달착륙선:
    moon(84) +
    stars([
      [12, 12],
      [88, 14],
    ]) +
    `<path d="M30 60L14 84M70 60L86 84M40 66L36 84M60 66L64 84" stroke="#8a96b0" stroke-width="4"/>` +
    `<ellipse cx="14" cy="85" rx="7" ry="2.5" fill="#8a96b0" stroke-width="2.5"/><ellipse cx="86" cy="85" rx="7" ry="2.5" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M28 46H72L76 50V62L72 66H28L24 62V50Z" fill="#ffc933"/>` +
    `<path d="M34 52L40 60M50 50V64M60 52L66 60" stroke="#e8a800" stroke-width="2.5"/>` +
    `<path d="M34 46V32L42 22H60L68 32V46Z" fill="#dfe8f5"/>` +
    `<path d="M42 30L48 30L44 38Z" fill="#3b4a6b" stroke-width="2.5"/>` +
    `<path d="M62 22L68 12" stroke-width="3"/><path d="M62 10a6 6 0 0 0 12 4Z" fill="#fff" stroke-width="2.5"/>`,
  달탐사차:
    moon(78) +
    `<circle cx="84" cy="18" r="10" fill="#4a90e2"/>` +
    blob('#43b04a', [[80, 16, 4]]) +
    `<path d="M22 64L26 72M50 64V72M78 64L74 72" stroke-width="4"/>` +
    `<rect x="12" y="50" width="76" height="14" rx="3" fill="#dfe8f5"/>` +
    panel(16, 40, 40, 10) +
    `<path d="M72 50V30" stroke-width="4"/>` +
    `<rect x="62" y="20" width="20" height="12" rx="3" fill="#ffc933"/>` +
    dot(68, 26, 3) +
    dot(76, 26, 3) +
    wheel(24, 78, 9) +
    wheel(50, 78, 9) +
    wheel(76, 78, 9),
  콤바인:
    `<rect x="40" y="74" width="56" height="14" rx="7" fill="#4a4f66"/>` +
    [47, 58, 69, 80, 90].map((x) => dot(x, 81, 3.2, '#a9b4c9')).join('') +
    `<path d="M74 34V20L96 12" stroke-width="10"/><path d="M74 34V20L96 12" stroke="#43b04a" stroke-width="5"/>` +
    `<rect x="44" y="44" width="52" height="30" rx="3" fill="#43b04a"/>` +
    `<path d="M70 44Q82 30 94 44Z" fill="#ffd23f"/>` +
    `<rect x="46" y="22" width="22" height="22" rx="2" fill="#8fd3ff"/><rect x="44" y="18" width="26" height="5" rx="2" fill="#43b04a"/>` +
    `<path d="M44 58L30 56V72L44 72Z" fill="#43b04a"/>` +
    `<path d="M4 62H32V78H10Z" fill="#ffd23f"/>` +
    `<path d="M10 78l-2 5M16 78l-2 5M22 78l-2 5M28 78l-2 5" stroke-width="3"/>` +
    `<circle cx="18" cy="54" r="13" fill="#fff7e0" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M18 41V67M5 54H31M9 45L27 63M27 45L9 63" stroke="#e8553d" stroke-width="3"/>` +
    dot(18, 54, 3.5) +
    `<path d="M4 96V86M10 96V84M16 96V86M22 96V84M28 96V86M34 96V84" stroke="#e8b800" stroke-width="3"/>` +
    [4, 10, 16, 22, 28, 34].map((x, i) => `<ellipse cx="${x}" cy="${i % 2 ? 82 : 84}" rx="2.4" ry="4" fill="#f2c14e" stroke-width="2"/>`).join(''),
  이앙기:
    `<rect x="2" y="64" width="96" height="34" fill="#9fd4e8"/>` +
    [6, 18, 30].flatMap((x) => [74, 84, 94].map((y) => `<path d="M${x} ${y}l-4-7M${x} ${y}V${y - 9}M${x} ${y}l4-7" stroke="#3a9e47" stroke-width="3"/>`)).join('') +
    `<path d="M40 22l-3-7M46 20l0-8M52 18l3-7M58 16l4-6" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M34 50L38 22L62 14L60 46Z" fill="#8fd26a"/>` +
    `<path d="M42 48L44 21M50 47L51 18M56 46L57 16" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M34 50L38 22L62 14L60 46Z"/>` +
    person(74, 50, 0.9, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<path d="M62 20L74 10L86 20Z" fill="#f2c14e"/>` +
    `<path d="M40 68V54C40 50 42 48 46 48H88C92 48 94 50 94 54V68Z" fill="#ff9f1a"/>` +
    `<path d="M44 68L40 78M52 68L48 78" stroke-width="3.5"/>` +
    `<path d="M88 48L92 34" stroke-width="4"/>` +
    tube('M80 40L90 36', SKIN, 3) +
    wheel(62, 72, 8) +
    wheel(86, 72, 8),
  타워크레인:
    `<path d="M26 94V24H38V94" fill="#ffd23f"/>` +
    `<path d="M26 94L38 82L26 70L38 58L26 46L38 34L26 24" stroke-width="2.5"/>` +
    `<path d="M32 6L22 22H42Z" fill="#ffd23f"/>` +
    `<rect x="4" y="22" width="92" height="7" fill="#ffd23f"/>` +
    `<path d="M32 6L10 22M32 6L90 22" stroke-width="2"/>` +
    `<rect x="4" y="29" width="14" height="12" fill="#8a96b0"/>` +
    `<rect x="36" y="29" width="12" height="10" rx="2" fill="#8fd3ff"/>` +
    `<rect x="72" y="29" width="10" height="4" fill="#4a4f66"/><path d="M77 33V58" stroke-width="2.5"/>` +
    `<path d="M73 58H81V62C81 66 73 66 73 62" stroke-width="3"/>` +
    `<rect x="62" y="66" width="30" height="7" fill="#e8553d"/>` +
    `<path d="M77 62L66 66M77 62L88 66" stroke-width="2"/>` +
    `<rect x="54" y="82" width="42" height="12" fill="#dfe8f5"/><path d="M68 82V94M82 82V94" stroke-width="2.5"/>` +
    `<path d="M4 94H98" stroke-width="3"/>`,
  로드롤러:
    `<rect x="2" y="84" width="96" height="12" fill="#4a4f66"/>` +
    `<path d="M50 88H62M72 88H84" stroke="#fff" stroke-width="3"/>` +
    `<path d="M14 64V48C14 44 16 42 20 42H64V64Z" fill="#ffd23f"/>` +
    `<path d="M24 42V20H56V42" fill="#8fd3ff" stroke-width="2.5"/><rect x="20" y="16" width="40" height="6" rx="2" fill="#ffd23f"/>` +
    `<path d="M24 20V42M56 20V42" stroke-width="4"/>` +
    `<path d="M64 48H78V60" stroke-width="5"/>` +
    `<rect x="60" y="54" width="36" height="30" rx="15" fill="#8a96b0"/>` +
    `<path d="M66 62H90M66 76H90" stroke="#dfe8f5" stroke-width="3"/>` +
    wheel(28, 72, 12),
  물탱크차:
    `<rect x="4" y="30" width="60" height="34" rx="16" fill="#dfe8f5"/>` +
    `<path d="M32 36c-6 9-9 14-9 18a9 9 0 0 0 18 0c0-4-3-9-9-18Z" fill="#4aa8f0"/>` +
    `<path d="M28 52a4 4 0 0 0 4 4" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M4 58H0" stroke-width="4"/>` +
    drop(3, 64, 0.6) +
    `<rect x="6" y="64" width="60" height="8" fill="#8a96b0"/>` +
    `<path d="M66 72V40C66 36 68 34 72 34H82C86 34 88 36 90 40L96 54V72Z" fill="#3b78e6"/>` +
    `<path d="M72 40H82L87 52H72Z" fill="#8fd3ff"/>` +
    wheel(20, 78, 9) +
    wheel(44, 78, 9) +
    wheel(82, 78, 9),
  푸드트럭:
    `<rect x="4" y="24" width="66" height="50" rx="4" fill="#fff"/>` +
    `<path d="M70 74V36C70 32 72 30 76 30H84C88 30 90 32 92 36L96 50V74Z" fill="#43b04a"/>` +
    `<path d="M76 36H84L89 48H76Z" fill="#8fd3ff"/>` +
    `<rect x="12" y="34" width="50" height="22" fill="#3b4a6b"/>` +
    person(37, 58, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#fff' }) +
    `<rect x="31" y="15" width="12" height="10" rx="3" fill="#fff"/>` +
    `<rect x="8" y="54" width="58" height="5" fill="#dfe8f5"/>` +
    `<path d="M8 32L4 42H70L66 32Z" fill="#ff5c70"/><path d="M19 32L17 42M30 32L29 42M41 32V42M52 32L53 42" stroke="#fff" stroke-width="5"/><path d="M8 32L4 42H70L66 32Z"/>` +
    `<path d="M14 18C14 10 28 10 28 18Z" fill="#e8862e" stroke-width="2.5"/><rect x="13" y="18" width="16" height="3" fill="#43b04a" stroke-width="2"/><path d="M14 22H28C28 26 14 26 14 22Z" fill="#e8862e" stroke-width="2.5"/>` +
    wheel(22, 76, 9) +
    wheel(82, 76, 9),
  아이스크림차:
    `<path d="M50 30L42 10H58Z" fill="#e8b886"/>` +
    `<path d="M44 12l10 8M48 10l8 8" stroke="#c68a4e" stroke-width="2"/>` +
    blob('#ff9aa8', [
      [44, 10, 6],
      [56, 10, 6],
      [50, 4, 5],
    ]) +
    `<rect x="44" y="26" width="12" height="6" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M6 74V38C6 34 8 32 12 32H70C76 32 80 34 82 38L92 54C94 56 94 60 94 62V74Z" fill="#ffe0ec"/>` +
    `<path d="M70 38H74C76 38 78 40 79 42L85 54H70Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="14" y="40" width="46" height="20" rx="2" fill="#fff"/>` +
    [22, 37, 52].map((x, i) => `<path d="M${x} 58L${x - 4} 50H${x + 4}Z" fill="#e8b886" stroke-width="2"/>` + dot(x, 47, 4.4, ['#ff9aa8', '#9a5b2e', '#5fc24a'][i])).join('') +
    `<path d="M7.8 64H92" stroke="#e85d9a" stroke-width="4"/>` +
    wheel(24, 76, 9) +
    wheel(76, 76, 9),
  트레일러:
    `<rect x="4" y="26" width="62" height="40" rx="2" fill="#fff"/>` +
    `<path d="M4 50H66" stroke="#e8553d" stroke-width="5"/>` +
    `<rect x="4" y="26" width="62" height="40" rx="2"/>` +
    `<rect x="4" y="66" width="62" height="5" fill="#8a96b0"/>` +
    `<path d="M68 72V36C68 32 70 30 74 30H84C88 30 90 32 92 36L96 50V72Z" fill="#3b78e6"/>` +
    `<path d="M74 36H84L89 48H74Z" fill="#8fd3ff"/>` +
    `<path d="M66 66H70" stroke-width="3"/>` +
    wheel(14, 76, 7) +
    wheel(30, 76, 7) +
    wheel(56, 76, 7) +
    wheel(84, 76, 8) +
    `<path d="M2 88H98" stroke-width="3"/>`,
  꽃마차:
    `<path d="M68 60V86M74 60V86M86 60V86M92 60V86" stroke-width="4"/>` +
    `<path d="M92 58C96 62 96 68 94 72" stroke="#ff9aa8" stroke-width="4"/>` +
    tube('M84 54L88 40', '#fff', 9) +
    `<ellipse cx="80" cy="58" rx="15" ry="9" fill="#fff"/>` +
    `<path d="M66 58C62 62 62 68 64 72" stroke="#ff9aa8" stroke-width="4"/>` +
    `<ellipse cx="92" cy="40" rx="5.5" ry="9" fill="#fff" transform="rotate(-50 92 40)"/>` +
    `<path d="M86 34l-1-6l5 4Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M84 36C80 42 82 50 84 54" stroke="#ff9aa8" stroke-width="4"/>` +
    dot(90, 37, 1.8) +
    `<path d="M54 62L68 60" stroke-width="3"/>` +
    `<path d="M8 64V38C8 26 18 20 32 20S56 26 56 38V64Z" fill="#fff1b8"/>` +
    win(16, 30, 32, 20) +
    `<path d="M6 64H58V70H6Z" fill="#e85d9a"/>` +
    flower(10, 24, 4, '#ff5c70') +
    flower(32, 16, 4, '#e85d9a') +
    flower(54, 24, 4, '#ff5c70') +
    flower(12, 56, 4, '#a45cf0') +
    flower(52, 56, 4, '#a45cf0') +
    wheel(18, 76, 10) +
    wheel(46, 76, 10),
};
