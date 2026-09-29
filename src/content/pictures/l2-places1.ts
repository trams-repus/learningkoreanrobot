// 장소 그림 묶음 (2단계: 집의 곳곳·농장·바닷가·가게). 그림 규칙은 docs/picture-style.md.
// 가게는 간판 글자 대신 파는 물건을 크게 앞에 두어 구별한다 (차양 색도 가게마다 다르게).
// 비슷한 말끼리(헛간·외양간·창고 / 온실·비닐하우스 / 부두·항구·선착장 / 카페·찻집 / 편의점·슈퍼마켓)는 주인공 소품을 다르게 했다.
import { INK, dot, blob, sparkle, tube, person } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, '#dfe8f5');

/** 옆모습 승용차 (가로 8~94, 세로 25~79 기준을 옮기고 줄인다) */
const car = (tx: number, ty: number, s: number, body: string) =>
  `<g transform="translate(${tx} ${ty}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M8 66V56C8 50 12 47 20 46L32 31C35 27 40 25 46 25H62C68 25 72 27 75 31L86 46C92 47 94 51 94 57V66Z" fill="${body}"/>` +
  `<path d="M36 45L44 32H55V45Z" fill="#8fd3ff"/><path d="M61 45V32H70L78 45Z" fill="#8fd3ff"/>` +
  `<rect x="86" y="48" width="7" height="5" rx="2" fill="#ffd23f"/>` +
  wheel(28, 68, 11) +
  wheel(74, 68, 11) +
  `</g>`;

/** 줄무늬 차양 (가게 앞): 위 y, 폭 w, 아래 물결 끝은 y+20 */
const awning = (x: number, y: number, w: number, c1: string, c2: string) => {
  const n = 6;
  const sw = w / n;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="12" fill="${c1}"/>`;
  for (let i = 1; i < n; i += 2) s += `<rect x="${x + i * sw}" y="${y}" width="${sw}" height="12" fill="${c2}"/>`;
  let scal = '';
  for (let i = 0; i < n; i++) scal += `q${sw / 2} 8 ${sw} 0`;
  return s + `<path d="M${x} ${y + 12}${scal}Z" fill="${c1}"/><rect x="${x}" y="${y}" width="${w}" height="12"/>`;
};

/** 가게: 흰 벽 + 줄무늬 차양 + 파는 물건(크게) + 바닥선 */
const shop = (c1: string, c2: string, goods: string) =>
  `<rect x="10" y="18" width="80" height="74" fill="#fff"/>` + awning(6, 8, 88, c1, c2) + goods + `<path d="M4 92H96"/>`;

/** 나무 상자 (과일·채소 가게) */
const crate = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#c98b4f"/><path d="M${x + 3} ${y + h / 2}H${x + w - 3}" stroke="#9a5b2e" stroke-width="3"/>`;

/** 물고기 옆모습 (머리가 오른쪽) */
const fish = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-14 0L-24 -9V9Z" fill="${c}"/>` +
  `<path d="M-16 0C-8 -12 10 -12 18 0C10 12 -8 12 -16 0Z" fill="${c}"/>` +
  `<circle cx="10" cy="-2" r="2.2" fill="${INK}" stroke="none"/><path d="M3 -6Q6 0 3 6" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `</g>`;

/** 운동화 옆모습 (발끝이 오른쪽, x,y는 뒤꿈치 바닥) */
const shoe = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M0 0V-14C0 -18 3 -20 7 -20C10 -16 14 -15 17 -16L30 -9C35 -7 36 -4 36 0Z" fill="${c}"/>` +
  `<path d="M0 0H36" stroke-width="${(6 / s).toFixed(2)}"/><path d="M-1 -2H37" stroke="#fff" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `<path d="M13 -13L17 -10M18 -12L22 -9" stroke="#fff" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `</g>`;

/** 닭 (오른쪽을 봄, x,y는 몸 가운데) */
const hen = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-2 10V18M6 10V18" stroke="#ff9f1a" stroke-width="${(3 / s).toFixed(2)}"/>` +
  `<path d="M-16 -4L-22 -16L-10 -8Z" fill="${c}"/>` +
  `<path d="M-16 0C-16 -8 -8 -10 0 -8L4 -14C4 -20 16 -20 16 -12V0C16 8 8 12 0 12S-16 8 -16 0Z" fill="${c}"/>` +
  `<path d="M6 -18C6 -24 10 -24 11 -20C12 -25 17 -23 15 -18Z" fill="#e8553d" stroke-width="${(2 / s).toFixed(2)}"/>` +
  `<path d="M16 -14L22 -12L16 -9Z" fill="#ff9f1a" stroke-width="${(2 / s).toFixed(2)}"/>` +
  `<path d="M14 -9C16 -6 16 -4 13 -4" fill="#e8553d" stroke-width="${(2 / s).toFixed(2)}"/>` +
  `<circle cx="10" cy="-13" r="1.8" fill="${INK}" stroke="none"/>` +
  `<path d="M-8 0C-4 4 2 4 5 0" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `</g>`;

/** 포도송이 (위 꼭짓점 x,y) */
const grapes = (x: number, y: number, r: number, c = '#8e4fc9') => {
  const pts: [number, number][] = [
    [0, 0],
    [-2, 0],
    [2, 0],
    [-1, 1.7],
    [1, 1.7],
    [0, 3.4],
  ];
  return (
    `<path d="M${x} ${y - r}V${y - r * 2.2}" stroke="#6b3e26" stroke-width="3"/>` +
    pts.map(([dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r}" fill="${c}" stroke-width="2.5"/>`).join('')
  );
};

/** 사과 (가운데 x,y) */
const apple = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8553d" stroke-width="2.5"/><path d="M${x} ${y - r}l2 -4" stroke="#6b3e26" stroke-width="2.5"/>`;

/** 사과나무 (줄기 밑 x,y, 크기 s) */
const tree = (x: number, y: number, s: number) =>
  `<path d="M${x} ${y}V${y - 22 * s}" stroke="#6b3e26" stroke-width="${6 * s}"/>` +
  blob('#43b04a', [
    [x, y - 34 * s, 14 * s],
    [x - 11 * s, y - 26 * s, 10 * s],
    [x + 11 * s, y - 26 * s, 10 * s],
  ]) +
  [
    [-6, -34],
    [6, -28],
    [-12, -24],
    [10, -38],
    [0, -24],
  ]
    .map(([dx, dy]) => dot(x + dx * s, y + dy * s, 3.2 * s, '#e8553d'))
    .join('');

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝까지) */
const waves = (y: number, fill = '#7ec8f0') =>
  `<path d="M2 ${y}q8-6 16 0t16 0t16 0t16 0t16 0t16 0V98H2Z" fill="${fill}"/>`;

/** 풀 줄기 세 가닥 (모·풀포기) */
const tuft = (x: number, y: number, c = '#3a9e47') =>
  `<path d="M${x} ${y}l-4 -8M${x} ${y}v-10M${x} ${y}l4 -8" stroke="${c}" stroke-width="3"/>`;

/** 옷걸이 (걸이 끝 x,y) */
const hanger = (x: number, y: number) =>
  `<path d="M${x} ${y + 6}V${y + 2}C${x} ${y - 2} ${x + 5} ${y - 2} ${x + 5} ${y + 2}" stroke-width="2.5"/>`;

/** 티셔츠 (목 가운데 x,y, 크기 s) */
const tshirt = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-6 0Q0 5 6 0L20 6L26 18L17 22L15 17V42H-15V17L-17 22L-26 18L-20 6Z" fill="${c}"/>` +
  `<path d="M-6 0Q0 7 6 0" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `</g>`;

export const PICS: Record<string, string> = {
  // ── 집의 곳곳 ──
  다락방:
    `<rect x="14" y="48" width="72" height="44" fill="#9fb3d9"/>` +
    `<path d="M50 6L4 50H96Z" fill="#e8553d"/>` +
    `<path d="M50 17L17 47H83Z" fill="#ffe7a8"/>` +
    `<circle cx="50" cy="30" r="6" fill="#8fd3ff"/><path d="M44 30H56M50 24V36" stroke-width="2.5"/>` +
    `<rect x="24" y="36" width="15" height="11" fill="#c98b4f"/><path d="M24 40H39" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<circle cx="61" cy="36" r="3.5" fill="#c98b4f" stroke-width="2.5"/><circle cx="69" cy="36" r="3.5" fill="#c98b4f" stroke-width="2.5"/>` +
    `<circle cx="65" cy="41" r="6" fill="#c98b4f" stroke-width="2.5"/>` +
    `<path d="M14 49H86" stroke-width="5"/>` +
    `<rect x="44" y="47" width="20" height="4" fill="#4a4f66" stroke="none"/>` +
    `<path d="M47 90L50 44M61 90L58 44" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M48 80H60M48.6 70H59.4M49.2 60H58.8M49.8 52H58.2" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="20" y="62" width="16" height="30" fill="#fff"/><path d="M4 92H96"/>`,
  지하실:
    `<rect x="4" y="44" width="92" height="52" fill="#9a5b2e"/>` +
    `<path d="M22 26L50 6L78 26Z" fill="#e8553d"/><rect x="26" y="26" width="48" height="18" fill="#fff"/>` +
    `<rect x="32" y="30" width="10" height="9" fill="#8fd3ff" stroke-width="2.5"/><rect x="56" y="30" width="10" height="14" fill="#c98b4f" stroke-width="2.5"/>` +
    `<path d="M4 44H96" stroke="#43b04a" stroke-width="6"/>` +
    `<rect x="12" y="52" width="76" height="38" fill="#ffe7a8"/>` +
    `<path d="M12 52H24V60H32V68H40V76H48V90H12Z" fill="#c98b4f"/>` +
    `<path d="M66 52V58" stroke-width="2.5"/><circle cx="66" cy="62" r="5" fill="#ffd23f"/>` +
    sparkle(76, 60, 5) +
    `<rect x="58" y="74" width="14" height="16" fill="#e3b577"/><rect x="72" y="80" width="12" height="10" fill="#e3b577"/><rect x="62" y="66" width="10" height="8" fill="#e3b577"/>`,
  베란다:
    `<rect x="6" y="6" width="88" height="80" fill="#f2d7a6"/>` +
    `<rect x="18" y="14" width="64" height="62" fill="#8fd3ff"/><path d="M50 14V76" stroke-width="3"/>` +
    `<path d="M24 22L32 30M58 22L66 30" stroke="#fff" stroke-width="3"/>` +
    `<path d="M22 30H78" stroke-width="2.5"/>` +
    tshirt(34, 30, 0.45, '#ff5c70') +
    tshirt(62, 30, 0.45, '#ffd23f') +
    `<rect x="4" y="80" width="92" height="10" fill="#dfe8f5"/>` +
    [14, 23, 32, 41, 50, 59, 68, 77, 86].map((x) => `<path d="M${x} 58V80" stroke-width="3"/>`).join('') +
    `<path d="M8 58H92" stroke-width="6"/>` +
    `<path d="M14 48H30L28 58H16Z" fill="#e8862e"/>` +
    blob('#43b04a', [
      [18, 44, 5],
      [24, 40, 6],
      [28, 45, 4],
    ]) +
    `<path d="M70 48H86L84 58H72Z" fill="#e8862e"/>` +
    `<path d="M78 48V38" stroke="#3a9e47" stroke-width="3"/><circle cx="78" cy="36" r="5" fill="#ff5c70"/>` +
    dot(78, 36, 2, '#ffd23f'),
  현관:
    `<rect x="6" y="6" width="88" height="62" fill="#f5e3b8"/>` +
    `<rect x="30" y="8" width="40" height="60" fill="#6b3e26"/>` +
    `<path d="M34 12H58L66 18V64L58 68H34Z" fill="#9a5b2e"/>` +
    dot(60, 42, 3, '#ffd23f') +
    `<rect x="4" y="68" width="92" height="26" fill="#dfe8f5"/><path d="M4 68H96" stroke-width="5"/>` +
    `<path d="M4 81H96M27 68V94M50 68V94M73 68V94" stroke="#b8c4dc" stroke-width="2"/>` +
    shoe(8, 90, 0.62, '#e8553d') +
    shoe(10, 82, 0.62, '#e8553d') +
    shoe(58, 90, 0.62, '#3b78e6') +
    shoe(60, 82, 0.62, '#3b78e6') +
    shoe(34, 90, 0.48, '#ffd23f') +
    shoe(36, 84, 0.48, '#ffd23f'),
  복도:
    `<path d="M4 4L38 34H62L96 4Z" fill="#dfe8f5"/>` +
    `<path d="M4 96L38 66H62L96 96Z" fill="#c98b4f"/>` +
    `<path d="M4 4L38 34V66L4 96Z" fill="#f5e3b8"/>` +
    `<path d="M96 4L62 34V66L96 96Z" fill="#f5e3b8"/>` +
    `<rect x="38" y="34" width="24" height="32" fill="#fff"/><rect x="44" y="40" width="12" height="26" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M12 26L26 36V76L12 86Z" fill="#3b78e6"/>` +
    `<path d="M88 26L74 36V76L88 86Z" fill="#e8553d"/>` +
    `<path d="M30 39L35 43V65L30 69Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M70 39L65 43V65L70 69Z" fill="#ffd23f" stroke-width="2.5"/>` +
    dot(22, 58, 2.2, '#ffd23f') +
    dot(78, 58, 2.2, '#ffd23f') +
    `<path d="M42 72H58L70 88H30Z" fill="#e85d9a" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="12" rx="8" ry="3" fill="#ffd23f" stroke-width="2.5"/><ellipse cx="50" cy="24" rx="5" ry="2" fill="#ffd23f" stroke-width="2"/>`,
  옥상:
    `<circle cx="84" cy="14" r="8" fill="#ffd23f"/>` +
    `<rect x="16" y="52" width="68" height="44" fill="#b8c4dc"/>` +
    [24, 42, 60]
      .map((x) => `<rect x="${x}" y="60" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/><rect x="${x}" y="78" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/>`)
      .join('') +
    `<rect x="10" y="46" width="80" height="8" fill="#8a96b0"/>` +
    `<path d="M24 20V42M76 20V42" stroke="#4a4f66" stroke-width="4"/>` +
    `<path d="M24 22H76" stroke-width="2.5"/>` +
    `<rect x="30" y="22" width="12" height="12" fill="#fff" stroke-width="2.5"/><rect x="48" y="22" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M14 30V46M14 30H86M14 38H86M86 30V46M32 30V46M50 30V46M68 30V46" stroke="#43b04a" stroke-width="3"/>` +
    person(50, 46, 0.55, { hair: '#5a3b24', style: 'pony', shirt: '#ff9f1a' }) +
    `<path d="M16 46H30L28 38H18Z" fill="#e8862e" stroke-width="2.5"/>` +
    blob('#43b04a', [
      [20, 34, 4],
      [26, 32, 5],
    ]) +
    `<path d="M70 46H84L82 38H72Z" fill="#e8862e" stroke-width="2.5"/>` +
    blob('#5fc24a', [
      [74, 33, 5],
      [80, 34, 4],
    ]),
  차고:
    `<path d="M4 34L50 8L96 34V92H4Z" fill="#dfe8f5"/>` +
    `<path d="M4 34L50 8L96 34" stroke-width="5"/>` +
    `<rect x="14" y="38" width="72" height="54" fill="#4a4f66"/>` +
    `<rect x="14" y="38" width="72" height="12" fill="#8a96b0"/><path d="M14 44H86" stroke-width="2.5"/>` +
    `<path d="M32 62L38 52H62L68 62Z" fill="#8fd3ff"/>` +
    `<rect x="24" y="62" width="52" height="20" rx="5" fill="#ff9f1a"/>` +
    `<circle cx="33" cy="71" r="4" fill="#ffd23f" stroke-width="2.5"/><circle cx="67" cy="71" r="4" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M42 72H58" stroke-width="3"/>` +
    `<rect x="26" y="82" width="10" height="9" rx="2" fill="${INK}"/><rect x="64" y="82" width="10" height="9" rx="2" fill="${INK}"/>` +
    `<path d="M2 92H98" stroke-width="4"/>`,
  헛간:
    `<path d="M8 92V44L20 22L50 8L80 22L92 44V92Z" fill="#e8553d"/>` +
    `<path d="M14 44L24 25L50 14L76 25L86 44" stroke="#fff" stroke-width="3"/>` +
    `<rect x="40" y="26" width="20" height="16" fill="#f2c14e"/><path d="M43 36l3 6M50 32v10M57 36l-3 6" stroke="#c99a2e" stroke-width="2.5"/>` +
    `<rect x="26" y="52" width="48" height="40" fill="#e8553d"/>` +
    `<rect x="26" y="52" width="48" height="40" stroke="#fff" stroke-width="3"/><path d="M50 52V92M26 52L50 92M50 52L26 92M74 52L50 92M50 52L74 92" stroke="#fff" stroke-width="3"/>` +
    `<rect x="26" y="52" width="48" height="40"/>` +
    `<rect x="78" y="78" width="18" height="14" rx="2" fill="#f2c14e"/><path d="M81 85H93" stroke="#c99a2e" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,
  외양간:
    `<path d="M4 30L50 6L96 30Z" fill="#6b3e26"/>` +
    `<rect x="8" y="30" width="84" height="62" fill="#c98b4f"/>` +
    `<path d="M8 44H92M8 58H92" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M29 36C20 28 20 20 26 16C26 24 30 28 35 32Z" fill="#f5e3b8" stroke-width="3"/><path d="M71 36C80 28 80 20 74 16C74 24 70 28 65 32Z" fill="#f5e3b8" stroke-width="3"/>` +
    `<ellipse cx="24" cy="46" rx="11" ry="6" fill="#fff" transform="rotate(-20 24 46)"/><ellipse cx="76" cy="46" rx="11" ry="6" fill="#fff" transform="rotate(20 76 46)"/>` +
    `<path d="M30 42C30 30 70 30 70 42L68 70H32Z" fill="#fff"/>` +
    `<path d="M32 38C38 34 46 34 48 40C46 46 36 48 32 46Z" fill="${INK}" stroke="none"/>` +
    dot(42, 52, 3.2) +
    dot(58, 52, 3.2) +
    `<ellipse cx="50" cy="68" rx="18" ry="11" fill="#ffb3c1"/>` +
    dot(44, 68, 2.4) +
    dot(56, 68, 2.4) +
    `<rect x="6" y="74" width="88" height="8" rx="2" fill="#9a5b2e"/><rect x="6" y="84" width="88" height="8" rx="2" fill="#9a5b2e"/>` +
    `<path d="M14 72V94M86 72V94" stroke-width="5"/>` +
    `<path d="M68 74l4-10M74 74l2-12M80 74l-1-10M86 74l-3-9" stroke="#f2c14e" stroke-width="3"/>`,
  돼지우리:
    `<path d="M4 34H96M4 52H96" stroke="#9a5b2e" stroke-width="6"/>` +
    [10, 30, 50, 70, 90].map((x) => `<rect x="${x - 4}" y="24" width="8" height="46" rx="2" fill="#c98b4f"/>`).join('') +
    `<ellipse cx="50" cy="84" rx="44" ry="10" fill="#9a5b2e"/>` +
    `<path d="M22 60q-8-2-6-8q4-2 4 3" stroke-width="3"/>` +
    `<path d="M32 74V86M44 76V88M60 76V88M70 74V86" stroke="#ff9aa8" stroke-width="7"/>` +
    `<ellipse cx="48" cy="64" rx="28" ry="18" fill="#ffb3c1"/>` +
    `<circle cx="74" cy="56" r="15" fill="#ffb3c1"/>` +
    `<path d="M66 44L64 32L76 42Z" fill="#ff9aa8" stroke-width="3"/>` +
    `<ellipse cx="87" cy="60" rx="6" ry="7" fill="#ff9aa8"/>` +
    dot(85.5, 58, 1.6) +
    dot(89, 58, 1.6) +
    dot(76, 52, 2.6) +
    `<ellipse cx="30" cy="72" rx="6" ry="3" fill="#9a5b2e" stroke="none"/>`,
  양계장:
    `<path d="M10 40L50 14L90 40Z" fill="#e8553d"/>` +
    `<rect x="16" y="40" width="68" height="36" fill="#f5e3b8"/>` +
    `<path d="M16 50H84M16 60H84" stroke="#e3b577" stroke-width="2.5"/>` +
    `<path d="M40 76V56C40 50 60 50 60 56V76Z" fill="#6b3e26"/>` +
    `<path d="M44 78L58 78L66 92H50Z" fill="#c98b4f" stroke-width="3"/>` +
    `<path d="M4 92H96"/>` +
    hen(22, 76, 0.85, '#fff') +
    hen(78, 76, 0.85, '#c98b4f') +
    `<ellipse cx="28" cy="90" rx="3.5" ry="4.5" fill="#fff" stroke-width="2.5"/><ellipse cx="36" cy="90" rx="3.5" ry="4.5" fill="#fff" stroke-width="2.5"/>` +
    `<ellipse cx="86" cy="90" rx="3.5" ry="4.5" fill="#f5e3b8" stroke-width="2.5"/>`,
  온실:
    `<path d="M10 42L50 10L90 42V90H10Z" fill="#cdeefc"/>` +
    `<path d="M30 26V90M50 10V90M70 26V90M10 42H90M10 66H90" stroke="#fff" stroke-width="4"/>` +
    `<path d="M10 42L50 10L90 42V90H10Z"/>` +
    `<path d="M20 20L28 14M60 20L66 16" stroke="#fff" stroke-width="3"/>` +
    [20, 40, 60, 80]
      .map(
        (x, i) =>
          `<path d="M${x - 6} 78H${x + 6}L${x + 4} 90H${x - 4}Z" fill="#e8862e" stroke-width="2.5"/>` +
          blob(i % 2 ? '#5fc24a' : '#43b04a', [
            [x - 4, 70, 5],
            [x + 3, 68, 6],
            [x, 62, 5],
          ]) +
          (i % 2 ? dot(x, 60, 3, '#ff5c70') : dot(x + 3, 66, 3, '#ffd23f')),
      )
      .join('') +
    `<path d="M4 90H96"/>`,
  비닐하우스:
    `<path d="M40 30C60 30 80 32 92 38C96 44 96 60 96 88H60V58C60 44 54 36 40 30Z" fill="#eef6ff"/>` +
    `<path d="M54 30C62 36 66 48 66 88M68 31C76 38 80 50 80 88M82 34C88 42 90 56 90 88" stroke="#9fb3d9" stroke-width="3"/>` +
    `<path d="M4 88V60C4 38 20 28 34 28S64 38 64 60V88Z" fill="#eef6ff"/>` +
    `<path d="M14 88V62C14 46 24 38 34 38S54 46 54 62V88Z" fill="#dff5d0"/>` +
    `<path d="M30 60L18 88H26L32 60ZM38 60L42 88H50L36 60Z" fill="#9a5b2e" stroke-width="2.5"/>` +
    [
      [22, 82],
      [27, 70],
      [45, 82],
      [40, 70],
      [34, 86],
    ]
      .map(([x, y]) => tuft(x, y, '#3a9e47') + dot(x + 3, y - 3, 2.4, '#ff5c70'))
      .join('') +
    `<path d="M10 40C18 30 26 28 34 28" stroke="#fff" stroke-width="3"/>` +
    `<path d="M2 88H98" stroke-width="4"/>`,
  // ── 들·밭·물가 ──
  과수원:
    `<rect x="4" y="66" width="92" height="28" fill="#8fd16a"/>` +
    tree(24, 52, 0.95) +
    tree(76, 52, 0.95) +
    tree(50, 84, 1.25) +
    `<path d="M76 88H96L93 96H79Z" fill="#9a5b2e"/>` +
    apple(81, 85, 4) +
    apple(90, 85, 4),
  포도밭:
    `<rect x="4" y="80" width="92" height="14" fill="#8fd16a"/>` +
    `<path d="M14 90V20M50 90V20M86 90V20" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M6 22H94" stroke="#9a5b2e" stroke-width="4"/>` +
    blob('#43b04a', [
      [16, 24, 8],
      [30, 22, 9],
      [44, 24, 8],
      [58, 22, 9],
      [72, 24, 8],
      [86, 22, 8],
    ]) +
    `<path d="M10 20l6 -6M36 20l5 -6M64 20l5 -6" stroke="#3a9e47" stroke-width="3"/>` +
    grapes(28, 38, 5) +
    grapes(68, 38, 5) +
    grapes(48, 40, 4) +
    grapes(88, 40, 3.5),
  논:
    `<rect x="4" y="6" width="92" height="22" fill="#cdeefc" stroke="none"/>` +
    blob('#8fd16a', [
      [18, 30, 14],
      [40, 32, 12],
      [74, 30, 16],
    ]) +
    `<path d="M4 30H96V94H4Z" fill="#7ec8f0"/>` +
    `<path d="M4 54H96M50 30V94" stroke="#8fd16a" stroke-width="7"/>` +
    `<path d="M4 30H96V94H4Z"/>` +
    [
      [14, 44],
      [26, 44],
      [38, 44],
      [62, 44],
      [74, 44],
      [86, 44],
      [14, 70],
      [26, 70],
      [38, 70],
      [62, 70],
      [74, 70],
      [86, 70],
      [14, 88],
      [26, 88],
      [38, 88],
      [62, 88],
      [74, 88],
      [86, 88],
    ]
      .map(([x, y]) => tuft(x, y))
      .join('') +
    `<path d="M20 60q4-2 8 0M68 78q4-2 8 0" stroke="#fff" stroke-width="2.5"/>`,
  목장:
    `<path d="M4 50C24 40 44 42 60 48S86 44 96 42V94H4Z" fill="#8fd16a"/>` +
    blob('#fff', [
      [18, 22, 7],
      [26, 18, 8],
      [34, 22, 6],
    ]) +
    `<path d="M26 72V84M32 72V84M54 72V84M60 72V84" stroke-width="5"/>` +
    `<rect x="20" y="52" width="44" height="24" rx="10" fill="#fff"/>` +
    `<path d="M28 54C34 54 36 62 30 66S22 62 22 58Z" fill="${INK}" stroke="none"/><path d="M48 60C54 58 58 64 54 68S44 66 48 60Z" fill="${INK}" stroke="none"/>` +
    `<path d="M20 58C14 60 14 66 16 70" stroke-width="3"/>` +
    `<path d="M62 50l-2-6M72 50l2-6" stroke-width="3"/>` +
    `<ellipse cx="67" cy="54" rx="9" ry="10" fill="#fff"/><ellipse cx="68" cy="62" rx="8" ry="5" fill="#ffb3c1"/>` +
    dot(64, 51, 2) +
    dot(71, 51, 2) +
    `<path d="M4 80H96M4 90H96" stroke="#9a5b2e" stroke-width="4"/>` +
    [8, 30, 52, 74, 92].map((x) => `<rect x="${x - 3}" y="74" width="6" height="22" rx="1" fill="#c98b4f"/>`).join(''),
  우물:
    `<path d="M26 26V68M74 26V68" stroke="#6b3e26" stroke-width="6"/>` +
    `<path d="M14 30L50 10L86 30Z" fill="#9a5b2e"/>` +
    `<path d="M28 38H72" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M50 38V50" stroke-width="2.5"/>` +
    `<path d="M42 50H58L56 62H44Z" fill="#8a96b0"/><path d="M42 50Q50 44 58 50" stroke-width="2.5"/>` +
    `<path d="M16 66V86C16 92 84 92 84 86V66Z" fill="#b8c4dc"/>` +
    `<ellipse cx="50" cy="66" rx="34" ry="9" fill="#b8c4dc"/><ellipse cx="50" cy="66" rx="26" ry="5" fill="#2a6fc4"/>` +
    `<path d="M16 78H84M30 68V78M50 70V78M70 68V78M24 78V89M42 78V91M60 78V91M76 78V89" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M16 66V86C16 92 84 92 84 86V66"/>`,
  부두:
    waves(62) +
    `<path d="M10 58V90M26 58V90M42 58V90M58 58V90" stroke="#6b3e26" stroke-width="5"/>` +
    `<rect x="2" y="50" width="66" height="10" fill="#c98b4f"/>` +
    `<path d="M16 50V60M30 50V60M44 50V60" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<rect x="56" y="40" width="8" height="10" rx="2" fill="#4a4f66"/>` +
    `<path d="M60 44Q70 52 78 58" stroke="#e3b577" stroke-width="3"/>` +
    `<path d="M66 60H96L90 74H72Z" fill="#fff"/><path d="M68 64H95" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M80 60V34" stroke-width="3"/><path d="M80 36L92 52H80Z" fill="#ffd23f" stroke-width="3"/>` +
    `<path d="M16 20q5-5 10 0q5-5 10 0M52 14q4-4 8 0q4-4 8 0" stroke-width="2.5"/>` +
    person(28, 50, 0.55, { hair: '#2f2a26', style: 'short', shirt: '#43b04a', cap: '#3b78e6' }),
  항구:
    `<path d="M76 20V60" stroke-width="4"/><path d="M60 20H96" stroke="#e8862e" stroke-width="7"/><path d="M60 20H96" stroke-width="1" stroke="none"/>` +
    `<path d="M64 20V60M88 20V60" stroke="#e8862e" stroke-width="6"/>` +
    `<path d="M70 20V38" stroke-width="2.5"/><rect x="66" y="38" width="10" height="7" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M60 60H98" stroke-width="4"/>` +
    `<rect x="12" y="38" width="14" height="10" fill="#e8553d" stroke-width="2.5"/><rect x="26" y="38" width="14" height="10" fill="#3b78e6" stroke-width="2.5"/><rect x="40" y="38" width="14" height="10" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="18" y="28" width="14" height="10" fill="#43b04a" stroke-width="2.5"/><rect x="32" y="28" width="14" height="10" fill="#e8862e" stroke-width="2.5"/>` +
    `<rect x="4" y="26" width="10" height="22" fill="#fff" stroke-width="3"/><rect x="6" y="30" width="6" height="5" fill="#8fd3ff" stroke-width="2"/>` +
    `<path d="M2 48H66L58 68H8Z" fill="#3b78e6"/><path d="M4 55H63" stroke="#fff" stroke-width="3"/>` +
    waves(66) +
    `<rect x="60" y="60" width="38" height="8" fill="#b8c4dc"/>` +
    `<path d="M6 16q4-4 8 0q4-4 8 0M34 10q4-4 8 0q4-4 8 0" stroke-width="2.5"/>`,
  선착장:
    `<rect x="60" y="30" width="36" height="6" rx="2" fill="#e8553d"/>` +
    `<path d="M64 36V58M92 36V58" stroke-width="4"/>` +
    `<rect x="66" y="50" width="24" height="4" fill="#c98b4f" stroke-width="2.5"/>` +
    person(78, 58, 0.5, { hair: '#5a3b24', style: 'long', shirt: '#ff9f1a' }) +
    `<rect x="54" y="58" width="44" height="8" fill="#c98b4f"/>` +
    waves(62) +
    `<rect x="54" y="58" width="44" height="8" fill="#c98b4f"/>` +
    `<ellipse cx="62" cy="70" rx="5" ry="3" fill="#e3b577" stroke-width="2.5"/><ellipse cx="88" cy="70" rx="5" ry="3" fill="#e3b577" stroke-width="2.5"/>` +
    `<rect x="14" y="34" width="30" height="16" rx="3" fill="#fff"/>` +
    [18, 26, 34].map((x) => `<rect x="${x}" y="38" width="6" height="7" rx="1.5" fill="#8fd3ff" stroke-width="2"/>`).join('') +
    `<path d="M4 50H56L52 72H10Z" fill="#fff"/><path d="M6 58H55" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M50 54Q54 56 56 60" stroke="#e3b577" stroke-width="2.5"/>` +
    `<path d="M20 28V34" stroke-width="3"/><path d="M20 28L30 30L20 32" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M2 80q8-6 16 0t16 0t16 0t16 0t16 0t16 0" stroke="#fff" stroke-width="2.5"/>`,
  수산시장:
    awning(4, 6, 44, '#3b78e6', '#fff') +
    awning(52, 6, 44, '#e8553d', '#fff') +
    `<path d="M6 26V92M94 26V92M50 26V92" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="8" y="34" width="40" height="30" rx="2" fill="#7ec8f0"/>` +
    fish(24, 46, 0.55, '#ff9f1a') +
    fish(38, 56, 0.45, '#8a96b0') +
    `<circle cx="14" cy="42" r="1.8" fill="#fff" stroke-width="1.5"/><circle cx="16" cy="36" r="1.5" fill="#fff" stroke-width="1.5"/>` +
    `<rect x="52" y="34" width="40" height="30" rx="2" fill="#7ec8f0"/>` +
    `<path d="M62 60C58 48 64 42 72 42S86 48 82 60" fill="#e85d9a"/>` +
    `<path d="M64 58q-4 6 -2 8M70 60q-2 6 0 6M76 60q2 6 0 6M81 58q4 6 2 8" stroke="#e85d9a" stroke-width="4"/>` +
    dot(68, 50, 2) +
    dot(76, 50, 2) +
    `<rect x="6" y="68" width="88" height="24" fill="#dfe8f5"/>` +
    fish(28, 76, 0.6, '#3b8fe0') +
    `<ellipse cx="68" cy="80" rx="12" ry="8" fill="#e8553d"/>` +
    `<path d="M56 78l-6-6M80 78l6-6M60 86l-6 4M76 86l6 4" stroke="#e8553d" stroke-width="3.5"/>` +
    `<circle cx="52" cy="70" r="4" fill="#e8553d" stroke-width="2.5"/><circle cx="84" cy="70" r="4" fill="#e8553d" stroke-width="2.5"/>` +
    dot(64, 76, 1.8) +
    dot(72, 76, 1.8) +
    `<path d="M4 92H96"/>`,
  // ── 가게 ──
  백화점:
    `<path d="M26 8V16M74 8V16" stroke-width="2.5"/><path d="M26 8L36 11L26 14Z" fill="#e8553d" stroke-width="2"/><path d="M74 8L84 11L74 14Z" fill="#3b78e6" stroke-width="2"/>` +
    `<rect x="10" y="16" width="80" height="76" fill="#f5e3b8"/>` +
    `<rect x="6" y="14" width="88" height="6" fill="#e85d9a"/>` +
    [24, 38, 52]
      .map((y) => [16, 30, 44, 58, 72].map((x) => `<rect x="${x}" y="${y}" width="12" height="10" fill="#8fd3ff" stroke-width="2.5"/>`).join(''))
      .join('') +
    `<rect x="32" y="68" width="36" height="24" fill="#8fd3ff"/><path d="M50 68V92" stroke-width="3"/>` +
    `<path d="M28 68H72V64H28Z" fill="#e85d9a"/>` +
    `<path d="M6 76H24V94H6Z" fill="#e8553d"/><path d="M10 76C10 70 20 70 20 76" stroke-width="2.5"/>` +
    `<path d="M76 72H94V94H76Z" fill="#ffd23f"/><path d="M80 72C80 66 90 66 90 72" stroke-width="2.5"/>` +
    `<path d="M2 94H98"/>`,
  서점: shop(
    '#43b04a',
    '#fff',
    [
      [14, 9, 36, '#e8553d'],
      [23, 7, 40, '#3b78e6'],
      [30, 10, 34, '#ffd23f'],
      [40, 8, 38, '#43b04a'],
      [48, 9, 36, '#a45cf0'],
      [57, 7, 40, '#ff9f1a'],
      [64, 10, 35, '#e85d9a'],
      [74, 8, 38, '#3b8fe0'],
    ]
      .map(([x, w, t, c]) => `<rect x="${x}" y="${t}" width="${w}" height="${60 - (t as number)}" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
      `<rect x="12" y="60" width="76" height="5" fill="#9a5b2e"/>` +
      `<path d="M12 70L50 76L88 70V92L50 96L12 92Z" fill="#3b78e6"/>` +
      `<path d="M50 74C42 68 26 66 16 68V88C26 86 42 88 50 93Z" fill="#fff"/>` +
      `<path d="M50 74C58 68 74 66 84 68V88C74 86 58 88 50 93Z" fill="#fff"/>` +
      `<path d="M22 74H42M22 80H42M58 74H78M58 80H78M58 86H72" stroke="#9aa6c4" stroke-width="2.5"/>`,
  ),
  문방구: shop(
    '#ff9f1a',
    '#fff',
    [
      [20, '#e8553d', -8],
      [28, '#3b78e6', 0],
      [36, '#43b04a', 8],
    ]
      .map(
        ([x, c, a]) =>
          `<g transform="rotate(${a} ${x} 70)"><rect x="${(x as number) - 4}" y="34" width="8" height="36" fill="${c}" stroke-width="2.5"/>` +
          `<path d="M${(x as number) - 4} 34L${x} 24L${(x as number) + 4} 34Z" fill="#f5c98a" stroke-width="2.5"/>` +
          dot(x as number, 25.5, 1.8) +
          `</g>`,
      )
      .join('') +
      `<path d="M14 58H42L40 88H16Z" fill="#8e4fc9"/>` +
      `<rect x="52" y="34" width="32" height="40" rx="2" fill="#4a90e2"/>` +
      `<path d="M56 34V74" stroke-width="3"/>` +
      [40, 48, 56, 64].map((y) => dot(56, y, 2, '#fff')).join('') +
      `<rect x="62" y="42" width="16" height="9" fill="#fff" stroke-width="2.5"/>` +
      `<rect x="14" y="80" width="72" height="9" fill="#ffd23f" transform="rotate(-4 50 84)"/>` +
      `<path d="M24 80v4M34 80v4M44 80v4M54 80v4M64 80v4M74 80v4" stroke-width="2" transform="rotate(-4 50 84)"/>` +
      `<rect x="64" y="66" width="18" height="10" rx="2" fill="#ff9aa8" stroke-width="2.5"/><path d="M76 66V76" stroke-width="2"/>`,
  ),
  철물점: shop(
    '#8a96b0',
    '#fff',
    tube('M22 88L50 40', '#c98b4f', 6) +
      `<g transform="rotate(30 52 38)"><rect x="34" y="30" width="36" height="14" rx="2" fill="#8a96b0"/><path d="M34 30V44" stroke-width="3"/></g>` +
      tube('M56 82L80 50', '#4a90e2', 7) +
      `<circle cx="82" cy="46" r="10" fill="#4a90e2"/><rect x="80" y="30" width="8" height="12" fill="#fff" transform="rotate(37 84 44)" stroke="none"/>` +
      `<circle cx="54" cy="84" r="8" fill="#4a90e2"/><rect x="50" y="86" width="8" height="10" fill="#fff" transform="rotate(37 54 84)" stroke="none"/>` +
      `<path d="M56 82L80 50" stroke="#4a90e2" stroke-width="7"/>` +
      `<g stroke-width="2.5"><path d="M16 46H26" stroke-width="4"/><path d="M21 46V64" stroke-width="3"/><path d="M18 50H24M18 55H24M18 60H24" stroke-width="2"/></g>` +
      `<g stroke-width="2.5"><path d="M72 76H84" stroke-width="4"/><path d="M78 76V90" stroke-width="3"/></g>`,
  ),
  세탁소: shop(
    '#7ec8f0',
    '#fff',
    `<path d="M20 34H84" stroke-width="3"/>` +
      hanger(62, 34) +
      `<path d="M50 42L62 40L74 42L84 50L78 58L74 54V84H50V54L46 58L40 50Z" fill="#fff"/>` +
      `<path d="M58 40L62 50L66 40" fill="#dfe8f5" stroke-width="2.5"/><path d="M62 50V84" stroke-width="2.5"/>` +
      dot(62, 60, 1.6) +
      dot(62, 70, 1.6) +
      `<path d="M16 60c-4-4 4-6 0-10M26 58c-4-4 4-6 0-10" stroke="#9aa6c4" stroke-width="3"/>` +
      `<path d="M10 88H58V82C58 72 50 66 38 66H26Q14 70 10 88Z" fill="#e85d9a"/>` +
      `<path d="M8 88H60" stroke-width="5"/>` +
      `<path d="M28 66C28 56 46 56 50 66" stroke-width="5"/>` +
      dot(34, 76, 2.5, '#ffd23f'),
  ),
  안경점: shop(
    '#a45cf0',
    '#fff',
    `<path d="M14 42H86" stroke-width="3"/>` +
      `<circle cx="28" cy="36" r="5" fill="#8fd3ff" stroke-width="2.5"/><circle cx="40" cy="36" r="5" fill="#8fd3ff" stroke-width="2.5"/>` +
      `<rect x="56" y="31" width="11" height="9" rx="3" fill="${INK}" stroke-width="2.5"/><rect x="69" y="31" width="11" height="9" rx="3" fill="${INK}" stroke-width="2.5"/>` +
      `<path d="M8 58L18 54M92 58L82 54" stroke="#e8553d" stroke-width="5"/>` +
      `<circle cx="32" cy="64" r="16" fill="#bfe6ff" stroke="#e8553d" stroke-width="6"/>` +
      `<circle cx="68" cy="64" r="16" fill="#bfe6ff" stroke="#e8553d" stroke-width="6"/>` +
      `<path d="M47 60Q50 56 53 60" stroke="#e8553d" stroke-width="5"/>` +
      `<circle cx="32" cy="64" r="19"/><circle cx="68" cy="64" r="19"/>` +
      `<path d="M24 58L30 54M60 58L66 54" stroke="#fff" stroke-width="3"/>`,
  ),
  옷가게: shop(
    '#e85d9a',
    '#fff',
    `<path d="M14 32H86" stroke-width="4"/>` +
      hanger(28, 32) +
      tshirt(29, 40, 0.8, '#3b78e6') +
      hanger(70, 32) +
      `<path d="M64 40H76L78 50L90 90H50L62 50Z" fill="#ff5c70"/>` +
      `<path d="M64 40Q70 46 76 40" stroke-width="2.5"/><path d="M62 52H78" stroke="#ffd23f" stroke-width="4"/>` +
      `<path d="M16 76H42V90H16Z" fill="#9a5b2e" stroke-width="3"/>`,
  ),
  신발가게: shop(
    '#3b8fe0',
    '#fff',
    `<rect x="12" y="56" width="76" height="5" fill="#9a5b2e"/><rect x="12" y="86" width="76" height="5" fill="#9a5b2e"/>` +
      shoe(14, 55, 0.95, '#e8553d') +
      shoe(52, 55, 0.95, '#43b04a') +
      `<path d="M16 85V66C16 62 26 62 26 66V76L38 78C42 79 44 82 44 85Z" fill="#ffd23f"/><path d="M14 85H46" stroke-width="5"/>` +
      shoe(52, 85, 0.95, '#a45cf0'),
  ),
  과일가게: shop(
    '#43b04a',
    '#ffd23f',
    crate(10, 72, 38, 20) +
      crate(52, 72, 38, 20) +
      apple(18, 66, 7) +
      apple(32, 66, 7) +
      apple(25, 56, 7) +
      apple(40, 60, 6) +
      `<path d="M56 70C58 58 70 50 86 52C74 56 66 62 64 72Z" fill="#ffd23f"/>` +
      `<path d="M58 68C62 54 74 46 88 44C78 52 70 58 66 70Z" fill="#ffd23f"/>` +
      `<path d="M86 52L90 44" stroke="#6b3e26" stroke-width="3"/>` +
      grapes(50, 42, 4.5) +
      `<path d="M50 32l6 -4" stroke="#43b04a" stroke-width="3"/>`,
  ),
  채소가게: shop(
    '#5fc24a',
    '#fff',
    [18, 30, 42]
        .map(
          (x) =>
            `<path d="M${x} 46l-5-10M${x} 46v-12M${x} 46l5-10" stroke="#43b04a" stroke-width="4"/>` +
            `<path d="M${x - 6} 46H${x + 6}L${x} 78Z" fill="#ff9f1a"/>` +
            `<path d="M${x - 3} 54h3M${x} 62h3" stroke-width="2"/>`,
        )
        .join('') +
      blob('#8fd16a', [
        [70, 60, 12],
        [62, 64, 8],
        [78, 64, 8],
      ]) +
      `<path d="M70 50C66 56 66 64 70 70M64 60C68 62 72 62 76 60" stroke="#43b04a" stroke-width="2.5"/>` +
      crate(10, 72, 38, 20) +
      crate(52, 72, 38, 20),
  ),
  정육점: shop(
    '#e8553d',
    '#fff',
    `<path d="M14 32H86" stroke-width="3"/>` +
      [22, 32, 42, 52].map((x) => `<path d="M${x} 32V36" stroke-width="2"/><rect x="${x - 4}" y="36" width="8" height="16" rx="4" fill="#e8553d" stroke-width="2.5"/>`).join('') +
      `<rect x="10" y="62" width="80" height="30" rx="2" fill="#dfe8f5"/>` +
      `<path d="M14 80C14 70 24 66 36 68C46 70 50 76 48 82C46 88 26 90 20 88C16 86 14 84 14 80Z" fill="#fff"/>` +
      `<path d="M18 80C18 73 26 70 35 72C43 74 45 78 44 82C42 86 28 87 23 85C20 84 18 82 18 80Z" fill="#e8553d" stroke-width="2.5"/>` +
      `<path d="M24 78Q30 75 36 79M28 83l6-1" stroke="#ff9aa8" stroke-width="2.5"/>` +
      tube('M70 62L82 44', '#fff', 5) +
      `<circle cx="80" cy="42" r="4" fill="#fff" stroke-width="3"/><circle cx="86" cy="45" r="4" fill="#fff" stroke-width="3"/>` +
      `<path d="M72 60C74 70 68 84 58 86C48 88 46 76 52 68C56 62 66 56 72 60Z" fill="#c98b4f"/>` +
      `<path d="M54 74C56 68 60 66 64 65" stroke="#e3b577" stroke-width="3"/>`,
  ),
  생선가게: shop(
    '#3b78e6',
    '#fff',
    `<path d="M8 70H92L86 90H14Z" fill="#dfe8f5"/>` +
      [18, 30, 42, 54, 66, 78].map((x) => `<circle cx="${x}" cy="72" r="4" fill="#fff" stroke-width="2"/>`).join('') +
      fish(52, 50, 1.45, '#3b8fe0') +
      fish(46, 72, 0.9, '#ff9f1a') +
      `<path d="M38 50q4-4 8 0M52 52q4-4 8 0" stroke="#fff" stroke-width="2.5" transform="translate(0 -4)"/>`,
  ),
  떡집: shop(
    '#43b04a',
    '#fff',
    `<ellipse cx="50" cy="84" rx="42" ry="8" fill="#6fb5a0"/>` +
      [
        [12, 70, '#fff'],
        [30, 70, '#ff9aa8'],
        [48, 70, '#fff'],
        [21, 56, '#8fd16a'],
        [39, 56, '#fff'],
        [30, 42, '#ff9aa8'],
      ]
        .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="20" height="15" rx="7" fill="${c}"/>`)
        .join('') +
      `<path d="M68 66C68 56 84 56 84 66Z" fill="#fff"/><path d="M68 66H84" stroke-width="3"/>` +
      `<path d="M74 82C72 70 90 70 90 82Z" fill="#8fd16a"/><path d="M74 82H90" stroke-width="3"/>` +
      `<path d="M60 82C58 70 74 70 74 82Z" fill="#ff9aa8"/><path d="M60 82H74" stroke-width="3"/>` +
      `<path d="M64 48C62 40 68 36 72 38" stroke="#43b04a" stroke-width="3"/><ellipse cx="74" cy="44" rx="7" ry="3" fill="#43b04a" stroke-width="2.5" transform="rotate(-30 74 44)"/>`,
  ),
  분식집: shop(
    '#ff9f1a',
    '#fff',
    `<ellipse cx="34" cy="70" rx="26" ry="18" fill="#fff"/><ellipse cx="34" cy="68" rx="20" ry="12" fill="#e8553d"/>` +
      `<rect x="20" y="60" width="14" height="6" rx="3" fill="#fff" transform="rotate(-20 27 63)" stroke-width="2.5"/>` +
      `<rect x="34" y="62" width="14" height="6" rx="3" fill="#fff" transform="rotate(15 41 65)" stroke-width="2.5"/>` +
      `<rect x="24" y="70" width="14" height="6" rx="3" fill="#fff" transform="rotate(10 31 73)" stroke-width="2.5"/>` +
      `<path d="M42 72l6 2" stroke="#43b04a" stroke-width="3"/>` +
      `<rect x="56" y="80" width="34" height="8" rx="3" fill="#9a5b2e"/>` +
      [62, 74, 86]
        .map(
          (x) =>
            `<circle cx="${x}" cy="72" r="7" fill="${INK}"/><circle cx="${x}" cy="72" r="5" fill="#fff" stroke="none"/>` +
            dot(x - 1.5, 71, 1.5, '#ff9f1a') +
            dot(x + 1.5, 73, 1.5, '#43b04a'),
        )
        .join('') +
      `<rect x="60" y="36" width="24" height="14" rx="7" fill="${INK}"/><rect x="66" y="36" width="24" height="14" rx="7" fill="#fff" transform="translate(-2 0) scale(1)"/>` +
      `<path d="M58 40V48" stroke-width="3"/>` +
      `<circle cx="84" cy="43" r="7" fill="${INK}"/><circle cx="84" cy="43" r="5" fill="#fff" stroke="none"/>` +
      dot(83, 42, 1.5, '#ff9f1a') +
      dot(85.5, 44, 1.5, '#43b04a'),
  ),
  중국집: shop(
    '#e8553d',
    '#ffd23f',
    `<path d="M22 28V34M78 28V34" stroke-width="2.5"/>` +
      `<ellipse cx="22" cy="42" rx="8" ry="9" fill="#e8553d"/><rect x="18" y="32" width="8" height="3" fill="#ffd23f" stroke-width="2"/><rect x="18" y="50" width="8" height="3" fill="#ffd23f" stroke-width="2"/>` +
      `<ellipse cx="78" cy="42" rx="8" ry="9" fill="#e8553d"/><rect x="74" y="32" width="8" height="3" fill="#ffd23f" stroke-width="2"/><rect x="74" y="50" width="8" height="3" fill="#ffd23f" stroke-width="2"/>` +
      `<path d="M72 30L42 58M80 32L48 62" stroke="#9a5b2e" stroke-width="4"/>` +
      `<ellipse cx="50" cy="64" rx="36" ry="10" fill="#f5e3b8"/>` +
      `<path d="M24 62C28 52 40 50 50 50S72 52 76 62C70 66 60 68 50 68S30 66 24 62Z" fill="#4a2e1c"/>` +
      `<path d="M40 56L48 58M54 55L62 57M44 62L52 62" stroke="#5fc24a" stroke-width="3"/>` +
      `<path d="M18 66q4 4 8 0t8 0M66 66q4 4 8 0t8 0" stroke="#e0c890" stroke-width="3"/>` +
      `<path d="M14 64C14 84 30 92 50 92S86 84 86 64C86 70 70 74 50 74S14 70 14 64Z" fill="#fff"/>` +
      `<path d="M22 80Q50 90 78 80" stroke="#e8553d" stroke-width="3"/>`,
  ),
  카페: shop(
    '#9a5b2e',
    '#fff',
    `<path d="M34 42c-5-5 5-9 0-14M46 40c-5-5 5-9 0-14" stroke="#9aa6c4" stroke-width="3"/>` +
      `<ellipse cx="42" cy="86" rx="30" ry="6" fill="#fff"/>` +
      `<path d="M64 58C76 58 76 74 62 74" stroke-width="10"/><path d="M64 58C76 58 76 74 62 74" stroke="#fff" stroke-width="3"/>` +
      `<path d="M18 50H66L62 78C61 82 58 84 54 84H30C26 84 23 82 22 78Z" fill="#fff"/>` +
      `<ellipse cx="42" cy="50" rx="24" ry="5" fill="#c98b4f"/>` +
      `<path d="M42 54C38 50 34 52 36 50C38 47 41 48 42 50C43 48 46 47 48 50C50 52 46 50 42 54Z" fill="#fff" stroke-width="1.5"/>` +
      `<path d="M70 86V74L90 68V86Z" fill="#ffe7a8"/><path d="M70 74L90 68V73L70 79Z" fill="#fff"/><path d="M70 80L90 76" stroke="#e85d9a" stroke-width="3"/>` +
      dot(84, 64, 3.5, '#e8553d'),
  ),
  찻집:
    `<rect x="10" y="22" width="80" height="70" fill="#f5e3b8"/>` +
    `<path d="M2 26C14 22 30 18 50 18S86 22 98 26L90 10C76 14 64 14 50 14S24 14 10 10Z" fill="#4a4f66"/>` +
    `<path d="M16 22V92M84 22V92" stroke="#9a5b2e" stroke-width="5"/>` +
    `<rect x="14" y="80" width="72" height="8" fill="#9a5b2e"/>` +
    `<path d="M36 44C38 38 44 36 48 38" fill="none"/>` +
    `<path d="M40 44C34 34 64 34 58 44" stroke-width="5"/>` +
    `<path d="M66 54C76 50 80 44 82 40" stroke="#6fb5a0" stroke-width="7"/><path d="M66 54C76 50 80 44 82 40" stroke-width="1" stroke="none"/>` +
    `<path d="M66 54C76 50 80 44 82 40"/>` +
    `<path d="M28 58C28 46 70 46 70 58C70 72 62 80 49 80S28 72 28 58Z" fill="#6fb5a0"/>` +
    `<path d="M30 56C28 60 24 64 22 64C22 72 28 72 30 68" fill="#6fb5a0"/>` +
    `<ellipse cx="49" cy="48" rx="15" ry="4" fill="#5fa08c"/><circle cx="49" cy="44" r="3" fill="#5fa08c"/>` +
    `<path d="M36 66Q49 72 62 66" stroke="#fff" stroke-width="3"/>` +
    `<path d="M74 68H90L88 80H76Z" fill="#fff"/><ellipse cx="82" cy="68" rx="8" ry="2.5" fill="#c9d86a" stroke-width="2.5"/>` +
    `<path d="M80 60c-3-3 3-5 0-8" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M14 72C14 66 22 64 24 70C22 74 16 76 14 72Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,
  아이스크림가게: shop(
    '#ff9aa8',
    '#fff',
    [
      [26, '#ff9aa8', '#fff'],
      [50, '#9a5b2e', '#ffe7a8'],
      [74, '#8fd16a', '#ff9aa8'],
    ]
      .map(
        ([x, c1, c2]) =>
          `<path d="M${(x as number) - 10} 60L${x} 90L${(x as number) + 10} 60Z" fill="#e8a85c"/>` +
          `<path d="M${(x as number) - 6} 64L${(x as number) + 3} 76M${(x as number) + 6} 64L${(x as number) - 3} 76" stroke="#c98b4f" stroke-width="2"/>` +
          `<circle cx="${x}" cy="54" r="11" fill="${c1}"/>` +
          `<circle cx="${x}" cy="38" r="9" fill="${c2}"/>` +
          dot(x as number, 28, 3, '#e8553d'),
      )
      .join(''),
  ),
  편의점:
    `<rect x="8" y="16" width="84" height="76" fill="#fff"/>` +
    `<rect x="6" y="10" width="88" height="6" fill="#43b04a"/><rect x="6" y="16" width="88" height="5" fill="#ff9f1a"/><rect x="6" y="21" width="88" height="5" fill="#3b78e6"/>` +
    `<rect x="12" y="32" width="36" height="58" rx="2" fill="#dfe8f5"/><rect x="16" y="36" width="28" height="50" fill="#bfe6ff"/>` +
    `<path d="M16 52H44M16 70H44" stroke-width="3"/>` +
    [
      [20, 40, '#e8553d'],
      [28, 40, '#43b04a'],
      [36, 40, '#ffd23f'],
      [20, 58, '#3b78e6'],
      [28, 58, '#ff9aa8'],
      [36, 58, '#e8862e'],
    ]
      .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="6" height="11" rx="2" fill="${c}" stroke-width="2"/>`)
      .join('') +
    `<path d="M42 44V66" stroke-width="3"/>` +
    `<rect x="52" y="70" width="38" height="20" fill="#9a5b2e"/>` +
    `<path d="M56 68L66 48L76 68Z" fill="#fff"/><path d="M59 68L66 54L73 68Z" fill="${INK}" stroke="none"/><path d="M62 68L66 60L70 68Z" fill="#fff" stroke="none"/>` +
    `<path d="M76 50H90L88 68H78Z" fill="#ffd23f"/><ellipse cx="83" cy="50" rx="7" ry="2.5" fill="#fff" stroke-width="2.5"/><path d="M77 58H89" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M4 92H96"/>`,
  슈퍼마켓:
    `<rect x="8" y="16" width="84" height="76" fill="#fff"/>` +
    awning(4, 6, 92, '#3b78e6', '#ffd23f') +
    `<rect x="12" y="30" width="76" height="4" fill="#8a96b0" stroke-width="2.5"/>` +
    [16, 26, 36, 46, 56, 66, 76].map((x, i) => `<rect x="${x}" y="${34 - ((i % 3) * 3 + 6)}" width="7" height="${(i % 3) * 3 + 6}" fill="${['#e8553d', '#43b04a', '#ffd23f'][i % 3]}" stroke-width="2"/>`).join('') +
    `<circle cx="36" cy="46" r="8" fill="#e8553d"/>` +
    `<rect x="44" y="36" width="12" height="18" rx="2" fill="#fff"/><path d="M44 42H56" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M58 52C58 40 66 36 72 38" stroke="#43b04a" stroke-width="4"/><ellipse cx="66" cy="48" rx="10" ry="6" fill="#e8a85c"/>` +
    `<path d="M4 40H16L22 76H80" stroke-width="5"/>` +
    `<path d="M18 50H86L78 76H22Z" fill="#dfe8f5"/>` +
    `<path d="M32 50V76M46 50V76M60 50V76M72 50V76M20 63H82" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M18 50H86L78 76H22Z"/>` +
    wheel(30, 86, 5) +
    wheel(72, 86, 5) +
    `<path d="M4 92H96"/>`,
  // ── 차를 돌보는 곳 ──
  주유소:
    `<rect x="4" y="8" width="92" height="10" rx="2" fill="#e8553d"/><path d="M4 13H96" stroke="#fff" stroke-width="3"/>` +
    `<path d="M10 18V92M90 18V92" stroke="#8a96b0" stroke-width="5"/>` +
    `<rect x="14" y="36" width="24" height="54" rx="3" fill="#43b04a"/>` +
    `<rect x="18" y="42" width="16" height="12" rx="2" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<rect x="18" y="60" width="16" height="8" rx="2" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M38 50C48 50 50 58 50 66S56 72 62 68" stroke-width="4"/>` +
    `<path d="M58 62L66 66L64 72L56 70Z" fill="#4a4f66" stroke-width="2.5"/>` +
    car(34, 30, 0.66, '#3b78e6') +
    `<path d="M2 92H98" stroke-width="4"/>`,
  세차장:
    `<path d="M16 16H84" stroke-width="5"/>` +
    [30, 50, 70].map((x) => `<path d="M${x} 16V22" stroke-width="4"/>`).join('') +
    [26, 34, 46, 54, 66, 74].map((x) => drop0(x)).join('') +
    `<rect x="4" y="40" width="10" height="46" rx="5" fill="#3b8fe0"/><path d="M4 50H14M4 60H14M4 70H14" stroke="#fff" stroke-width="3"/>` +
    `<rect x="86" y="40" width="10" height="46" rx="5" fill="#e85d9a"/><path d="M86 50H96M86 60H96M86 70H96" stroke="#fff" stroke-width="3"/>` +
    car(10, 22, 0.82, '#ffd23f') +
    blob('#fff', [
      [30, 50, 7],
      [40, 46, 6],
      [58, 48, 7],
      [70, 52, 6],
      [24, 64, 5],
    ]) +
    `<circle cx="80" cy="36" r="3" fill="#fff" stroke-width="2"/><circle cx="20" cy="34" r="3.5" fill="#fff" stroke-width="2"/><circle cx="50" cy="36" r="2.5" fill="#fff" stroke-width="2"/>` +
    `<path d="M2 92H98" stroke-width="4"/>`,
  정비소:
    `<path d="M4 30L50 8L96 30V92H4Z" fill="#dfe8f5"/>` +
    `<rect x="12" y="34" width="76" height="58" fill="#b8c4dc"/>` +
    `<rect x="20" y="62" width="6" height="30" fill="#ffd23f"/><rect x="74" y="62" width="6" height="30" fill="#ffd23f"/>` +
    `<rect x="16" y="58" width="68" height="5" fill="#ff9f1a"/>` +
    car(12, 14, 0.76, '#e8553d') +
    tube('M36 82L56 70', '#8a96b0', 5) +
    `<circle cx="58" cy="68" r="7" fill="#8a96b0"/><rect x="56" y="58" width="6" height="8" fill="#b8c4dc" transform="rotate(60 58 68)" stroke="none"/>` +
    `<circle cx="34" cy="83" r="5" fill="#8a96b0"/>` +
    `<path d="M2 92H98" stroke-width="4"/>`,
};

/** 물줄기 (세차장 위 관에서 떨어지는 물) */
function drop0(x: number): string {
  return `<path d="M${x} 24v8" stroke="#4aa8f0" stroke-width="3"/>`;
}
