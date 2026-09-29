// 장소 그림 묶음 (3단계: 놀이·자연·옛 유적·집과 방·길과 다리·우주). 장소마다 그곳만의 모양을 크게 보여 준다. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, blob, sparkle, tube, person, drop } from '../pictureKit.ts';

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝 yb까지) */
const waves = (y: number, fill = '#7ec8f0', yb = 96) =>
  `<path d="M4 ${y}q7.7-5 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0V${yb}H4Z" fill="${fill}"/>`;

/** 둥근 나무 (줄기 밑 x,y, 잎 반지름 r) */
const tree = (x: number, y: number, r: number, leaf = '#43b04a') =>
  `<rect x="${x - r * 0.2}" y="${y - r * 1.2}" width="${r * 0.4}" height="${r * 1.2}" fill="#9a5b2e" stroke-width="2.5"/>` +
  blob(leaf, [
    [x, y - r * 1.8, r],
    [x - r * 0.6, y - r * 1.3, r * 0.7],
    [x + r * 0.6, y - r * 1.3, r * 0.7],
  ]);

/** 뾰족한 늘푸른나무 (밑 가운데 x,y, 크기 s) */
const fir = (x: number, y: number, s: number, fill = '#3a9e47') =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<rect x="-3" y="-9" width="6" height="9" fill="#9a5b2e"/>` +
  `<path d="M0 -44L12 -30H6L16 -18H8L18 -8H-18L-8 -18H-16L-6 -30H-12Z" fill="${fill}"/></g>`;

/** 꽃 한 송이 (가운데 x,y) */
const flower = (x: number, y: number, petal: string, r = 4) =>
  `<path d="M${x} ${y + r}V${y + r + 8}" stroke="#3a9e47" stroke-width="3"/>` +
  blob(petal, [
    [x - r, y, r],
    [x + r, y, r],
    [x, y - r, r],
    [x, y + r, r],
  ]) +
  dot(x, y, r * 0.7, HL);

/** 창문 (왼쪽 위 x,y) */
const win = (x: number, y: number, w: number, h: number, fill = '#8fd3ff') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke-width="2.5"/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke-width="2"/>`;

/** 옆모습 자동차 (왼쪽 밑 x,y 기준, 너비 약 40*s) */
const car = (x: number, y: number, s: number, body: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M0 -6V-14C0 -18 3 -20 7 -20L13 -29H29L36 -20C40 -20 42 -18 42 -14V-6Z" fill="${body}"/>` +
  `<path d="M16 -21L19 -26H24V-21Z" fill="#8fd3ff" stroke-width="${(2.5 / s).toFixed(2)}"/><path d="M27 -21V-26H29L32 -21Z" fill="#8fd3ff" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `<circle cx="10" cy="-5" r="6" fill="${INK}"/><circle cx="32" cy="-5" r="6" fill="${INK}"/>` +
  dot(10, -5, 2.5, '#dfe8f5') +
  dot(32, -5, 2.5, '#dfe8f5') +
  `</g>`;

/** 우주 배경 */
const space = `<rect x="4" y="4" width="92" height="92" rx="10" fill="#2b3566"/>`;

/** 방 안 모습: 천장·바닥 중 하나를 노란 점선으로 가리킨다 */
const room = (pick: 'ceil' | 'floor') => {
  const on = `fill="#fff1b8"`;
  const hl = (d: string) => `<path d="${d}" stroke="${HL}" stroke-width="5" stroke-dasharray="7 5"/>`;
  const ceil = 'M6 6H94L72 30H28Z';
  const floor = 'M6 94H94L72 70H28Z';
  return (
    `<path d="M6 6L28 30V70L6 94Z" fill="#dfe8f5"/><path d="M94 6L72 30V70L94 94Z" fill="#dfe8f5"/>` +
    `<rect x="28" y="30" width="44" height="40" fill="#eef3fb"/>` +
    `<path d="${ceil}" ${pick === 'ceil' ? on : 'fill="#fff"'}/>` +
    `<path d="${floor}" fill="${pick === 'floor' ? '#e0a768' : '#c98a4b'}"/>` +
    `<path d="M40 70L30 94M50 70V94M60 70L70 94" stroke-width="2.5"/>` +
    win(40, 38, 20, 16) +
    (pick === 'ceil' ? hl(ceil) : hl(floor))
  );
};

export const PICS: Record<string, string> = {
  // ── 놀이·물가 ──
  눈썰매장:
    `<path d="M4 30C34 30 60 56 96 70V96H4Z" fill="#eaf4ff"/>` +
    fir(14, 32, 0.45) +
    fir(26, 32, 0.35) +
    `<path d="M20 44H34M16 52H30M22 60H36" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g transform="translate(56 62) rotate(24)">` +
    person(0, -2, 0.85, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6', cap: '#ff9f1a' }) +
    `<rect x="-20" y="-6" width="40" height="8" rx="3" fill="#e8553d"/>` +
    `<path d="M-22 7H20Q27 7 27 -1M-14 2V7M12 2V7" stroke-width="3"/></g>` +
    [
      [70, 16],
      [86, 30],
      [52, 22],
      [84, 50],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke-width="2"/>`)
      .join(''),
  워터파크:
    `<rect x="4" y="68" width="92" height="28" rx="4" fill="#7ec8f0"/>` +
    `<path d="M10 80q6-4 12 0t12 0M56 88q6-4 12 0t12 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M72 20V70M90 20V70M72 36H90M72 52H90" stroke-width="4"/>` +
    `<rect x="66" y="12" width="28" height="8" rx="2" fill="#ff9f1a"/>` +
    tube('M68 18C40 18 62 42 38 44S14 56 24 70', '#ff5c70', 10) +
    `<path d="M68 18C40 18 62 42 38 44S14 56 24 70" stroke="#ffd23f" stroke-width="3" stroke-dasharray="4 6"/>` +
    drop(16, 58, 0.8) +
    drop(32, 60, 0.7) +
    `<circle cx="54" cy="36" r="9" fill="${SKIN}"/><path d="M45 34C45 26 50 25 54 25S63 26 63 34C60 30 57 29 54 29S48 30 45 34Z" fill="#2f2a26"/>` +
    dot(51, 36, 1.8) +
    dot(57, 36, 1.8) +
    `<path d="M50 40q4 3 8 0" stroke-width="2"/>` +
    `<ellipse cx="54" cy="74" rx="14" ry="6" stroke-width="12"/><ellipse cx="54" cy="74" rx="14" ry="6" stroke="#ffd23f" stroke-width="6"/>` +
    `<circle cx="54" cy="62" r="7" fill="${SKIN}"/><path d="M47 60C47 55 51 54 54 54S61 55 61 60C59 58 57 57 54 57S49 58 47 60Z" fill="#5a3b24"/>` +
    dot(51.5, 62, 1.5) +
    dot(56.5, 62, 1.5),
  방파제:
    waves(60) +
    `<rect x="4" y="46" width="74" height="16" fill="#b8c2d6"/><path d="M4 46H78" stroke-width="3"/>` +
    `<rect x="72" y="16" width="12" height="30" fill="#e8553d"/><path d="M72 26H84M72 36H84" stroke="#fff" stroke-width="3"/>` +
    `<path d="M70 16L78 8L86 16Z" fill="${INK}"/>` +
    `<rect x="68" y="44" width="20" height="6" fill="#dfe8f5"/>` +
    [14, 36, 58, 25, 47]
      .map((x, i) => {
        const y = i < 3 ? 76 : 64;
        const d = `M${x} ${y}V${y - 10}M${x} ${y}L${x - 9} ${y + 7}M${x} ${y}L${x + 9} ${y + 7}`;
        return tube(d, '#dfe8f5', 6);
      })
      .join('') +
    `<path d="M84 60q4-8 10-4M88 72q4-6 8-2" stroke="#fff" stroke-width="3"/>` +
    `<path d="M4 84q8-5 16 0t16 0t16 0t16 0t16 0t12 0" stroke="#3b8fe0" stroke-width="3"/>`,
  강가:
    `<rect x="4" y="22" width="92" height="22" fill="#8fd67a"/>` +
    tree(22, 40, 9) +
    tree(76, 40, 11, '#3a9e47') +
    `<rect x="4" y="42" width="92" height="28" fill="#7ec8f0"/>` +
    `<path d="M12 52q6-4 12 0M46 60q6-4 12 0M70 50q6-4 12 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M4 70Q50 64 96 70V96H4Z" fill="#f2dca6"/>` +
    [
      [16, 84, 5],
      [30, 90, 4],
      [64, 88, 5],
      [80, 80, 4],
    ]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r + 2}" ry="${r}" fill="#b8c2d6" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M88 90V64M92 90V70M84 90V72" stroke="#3a9e47" stroke-width="3"/>` +
    `<ellipse cx="88" cy="62" rx="2.5" ry="5" fill="#9a5b2e" stroke-width="2"/>` +
    person(46, 90, 0.8, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }) +
    `<path d="M52 72L66 48" stroke="#9a5b2e" stroke-width="3"/><path d="M66 48Q70 54 70 62" stroke-width="1.5"/>`,
  // ── 숲·산 ──
  밀림:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#2f7d3a"/>` +
    blob('#3a9e47', [
      [14, 10, 12],
      [36, 8, 12],
      [60, 10, 12],
      [84, 8, 12],
    ]) +
    `<path d="M24 16C22 40 28 56 24 80M72 16C76 34 70 48 74 64" stroke="#8fd67a" stroke-width="4"/>` +
    [
      [23, 34],
      [26, 54],
      [74, 32],
      [71, 50],
    ]
      .map(([x, y]) => `<ellipse cx="${x + 5}" cy="${y}" rx="6" ry="3" fill="#5fc24a" stroke-width="2" transform="rotate(-30 ${x + 5} ${y})"/>`)
      .join('') +
    `<path d="M4 96C8 70 22 62 34 66C26 74 22 84 22 96Z" fill="#5fc24a"/><path d="M96 96C92 70 80 62 66 66C74 74 78 84 78 96Z" fill="#5fc24a"/>` +
    `<path d="M40 96C38 76 50 70 58 74C52 80 50 88 52 96Z" fill="#43b04a"/>` +
    `<path d="M10 86L24 72M90 86L76 72" stroke="#2f7d3a" stroke-width="2.5"/>` +
    // 앵무새
    `<path d="M46 30H64" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M52 30C44 36 44 50 48 58L54 62L56 50C60 44 58 34 52 30Z" fill="#3b8fe0"/>` +
    `<ellipse cx="54" cy="36" rx="9" ry="12" fill="#e8553d"/>` +
    `<circle cx="55" cy="24" r="7" fill="#e8553d"/>` +
    `<path d="M61 22Q67 24 62 30Z" fill="${HL}" stroke-width="2.5"/>` +
    dot(57, 23, 1.8) +
    `<path d="M50 34Q46 42 52 48" fill="#ffd23f" stroke-width="2.5"/>`,
  대나무숲:
    `<rect x="4" y="84" width="92" height="12" fill="#8fd67a"/>` +
    [
      [14, 9, '#5fc24a'],
      [32, 11, '#43b04a'],
      [52, 12, '#5fc24a'],
      [72, 10, '#43b04a'],
      [88, 8, '#5fc24a'],
    ]
      .map(([x, w, c]) => {
        const xx = x as number;
        const ww = w as number;
        const off = (xx % 3) * 4;
        return (
          `<rect x="${xx - ww / 2}" y="4" width="${ww}" height="86" fill="${c}"/>` +
          [20, 40, 60, 80].map((y) => `<path d="M${xx - ww / 2} ${y + off - 6}H${xx + ww / 2}" stroke-width="3"/>`).join('')
        );
      })
      .join('') +
    [
      [22, 26, 1],
      [42, 48, -1],
      [62, 22, 1],
      [80, 50, -1],
      [24, 64, -1],
    ]
      .map(
        ([x, y, d]) =>
          `<path d="M${x} ${y}q${d * 8} -8 ${d * 16} -4q${-d * 8} 6 ${-d * 16} 4Z" fill="#8fd67a" stroke-width="2"/>` +
          `<path d="M${x} ${y}q${d * 6} 2 ${d * 14} 8q${-d * 8} 0 ${-d * 14} -8Z" fill="#8fd67a" stroke-width="2"/>`,
      )
      .join(''),
  소나무숲:
    `<rect x="4" y="80" width="92" height="16" fill="#8fd67a"/>` +
    [
      [22, 82, 0.8],
      [52, 84, 1.05],
      [80, 82, 0.8],
    ]
      .map(
        ([x, y, s]) =>
          `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
          `<path d="M-4 0C-2 -20 -8 -34 -2 -56H4C0 -36 6 -20 4 0Z" fill="#b5532f"/>` +
          `<path d="M-2 -40L-14 -48M1 -54L12 -60" stroke-width="${(3 / s).toFixed(2)}"/>` +
          `<ellipse cx="-14" cy="-50" rx="14" ry="6" fill="#2e7d3a"/>` +
          `<ellipse cx="12" cy="-62" rx="15" ry="6" fill="#2e7d3a"/>` +
          `<ellipse cx="0" cy="-74" rx="12" ry="6" fill="#2e7d3a"/>` +
          `<path d="M-24 -50l3-3M-18 -52l3-3M4 -64l3-3M12 -64l3-3M-6 -76l3-3M4 -76l3-3" stroke="#5fc24a" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
          `</g>`,
      )
      .join('') +
    // 솔방울
    `<path d="M36 76C45 79 45 92 36 96C27 92 27 79 36 76Z" fill="#9a5b2e"/><path d="M31 83q5 3 10 0M30 89q6 3 12 0M36 80V94" stroke-width="2"/>`,
  산길:
    `<path d="M4 90L38 22L56 44L70 30L96 80V96H4Z" fill="#5fc24a"/>` +
    `<path d="M38 22L30 38L36 36L40 42L46 34Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M50 96C36 88 30 80 60 72S66 60 46 56S44 46 52 42" stroke="#1d2340" stroke-width="13"/>` +
    `<path d="M50 96C36 88 30 80 60 72S66 60 46 56S44 46 52 42" stroke="#e0b777" stroke-width="7"/>` +
    fir(20, 82, 0.35) +
    fir(80, 80, 0.4) +
    fir(76, 58, 0.3) +
    fir(26, 62, 0.3),
  등산로:
    `<path d="M4 90L50 12L96 90V96H4Z" fill="#5fc24a"/>` +
    `<path d="M50 12V4L60 7L50 10" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M28 96C40 80 64 72 50 60S46 36 52 22" stroke="#e0b777" stroke-width="6" stroke-dasharray="1 0"/>` +
    // 이정표
    `<path d="M78 92V58" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M68 58H88L94 63L88 68H68Z" fill="#c98a4b" stroke-width="3"/>` +
    // 등산하는 사람
    `<rect x="18" y="58" width="12" height="18" rx="4" fill="#e8553d"/>` +
    person(34, 92, 0.95, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#43b04a' }) +
    `<path d="M48 70L54 94" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M44 76L48 70" stroke-width="3.5"/>`,
  약수터:
    `<path d="M8 74L10 40L24 20L46 14L62 24L64 52L50 74Z" fill="#b8c2d6"/>` +
    `<path d="M24 20L30 40L18 56M46 14L42 34L52 44" stroke="#8a96b0" stroke-width="3"/>` +
    tube('M58 44H72', '#8a96b0', 5) +
    `<path d="M74 46V70" stroke="#4aa8f0" stroke-width="5"/>` +
    `<ellipse cx="70" cy="80" rx="24" ry="10" fill="#8a96b0"/>` +
    `<ellipse cx="70" cy="77" rx="18" ry="5" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M66 76q4-3 8 0" stroke="#fff" stroke-width="2"/>` +
    // 바가지
    `<path d="M18 80H36A9 9 0 0 1 18 80Z" fill="#f2c14e"/>` +
    tube('M36 80L48 74', '#c98a4b', 3) +
    `<rect x="4" y="90" width="92" height="6" fill="#8fd67a"/>`,
  // ── 옛 건축·유적 ──
  정자:
    `<rect x="4" y="80" width="92" height="16" fill="#8fd67a"/>` +
    `<rect x="18" y="72" width="64" height="7" fill="#c98a4b"/>` +
    `<path d="M22 79V86M50 79V86M78 79V86" stroke-width="5"/>` +
    [24, 40, 60, 76].map((x) => `<rect x="${x - 2.5}" y="38" width="5" height="34" fill="#b5532f" stroke-width="2.5"/>`).join('') +
    `<rect x="20" y="36" width="60" height="6" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M4 34Q14 34 20 24Q50 18 80 24Q86 34 96 34Q76 40 50 40Q24 40 4 34Z" fill="#5a6b8a"/>` +
    `<path d="M22 18Q50 12 78 18L80 24Q50 18 20 24Z" fill="#3e4a66"/>` +
    `<path d="M24 28Q50 24 76 28" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M40 79L36 88H64L60 79Z" fill="#b8c2d6" stroke-width="2.5"/>`,
  석탑:
    `<rect x="4" y="90" width="92" height="6" fill="#8fd67a"/>` +
    `<rect x="16" y="82" width="68" height="9" fill="#b8c2d6"/>` +
    `<rect x="22" y="72" width="56" height="10" fill="#c6ccd8"/>` +
    `<rect x="36" y="56" width="28" height="16" fill="#dfe3ea"/>` +
    `<path d="M18 57Q24 54 28 50H72Q76 54 82 57Z" fill="#b8c2d6"/>` +
    `<rect x="39" y="41" width="22" height="9" fill="#dfe3ea"/>` +
    `<path d="M24 42Q29 39 33 36H67Q71 39 76 42Z" fill="#b8c2d6"/>` +
    `<rect x="42" y="29" width="16" height="7" fill="#dfe3ea"/>` +
    `<path d="M30 30Q34 27 37 24H63Q66 27 70 30Z" fill="#b8c2d6"/>` +
    `<path d="M50 24V8" stroke-width="4"/>` +
    `<circle cx="50" cy="18" r="3.5" fill="#c6ccd8" stroke-width="2.5"/><circle cx="50" cy="10" r="3" fill="#c6ccd8" stroke-width="2.5"/>`,
  고인돌:
    `<path d="M4 80Q30 74 50 78T96 78V96H4Z" fill="#8fd67a"/>` +
    `<path d="M24 84L22 46Q30 42 38 46L40 84Z" fill="#8a96b0"/>` +
    `<path d="M60 84L60 46Q68 42 76 46L78 84Z" fill="#8a96b0"/>` +
    `<path d="M8 40Q10 26 30 26L76 22Q94 24 92 38Q74 48 50 46Q22 50 8 40Z" fill="#b8c2d6"/>` +
    `<path d="M24 34Q40 30 52 32M62 30Q72 28 80 30" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M14 88q3-5 6 0M84 90q3-5 6 0M50 90q3-5 6 0" stroke="#3a9e47" stroke-width="2.5"/>`,
  첨성대: (() => {
    const top = 26;
    const bot = 80;
    const hw = (y: number) => 12 + 10 * ((y - top) / (bot - top)) ** 1.8;
    const ys: number[] = [];
    for (let y = top; y <= bot; y += 2) ys.push(y);
    const body =
      `M${50 - hw(top)} ${top}` +
      ys.map((y) => `L${(50 - hw(y)).toFixed(1)} ${y}`).join('') +
      ys
        .slice()
        .reverse()
        .map((y) => `L${(50 + hw(y)).toFixed(1)} ${y}`)
        .join('') +
      'Z';
    const rows = [33, 40, 47, 61, 68, 75]
      .map((y) => `<path d="M${(50 - hw(y)).toFixed(1)} ${y}H${(50 + hw(y)).toFixed(1)}" stroke-width="2"/>`)
      .join('');
    return (
      `<rect x="4" y="90" width="92" height="6" fill="#8fd67a"/>` +
      `<rect x="18" y="86" width="64" height="6" fill="#c6ccd8"/>` +
      `<rect x="24" y="80" width="52" height="6" fill="#dfe3ea"/>` +
      `<path d="${body}" fill="#e8d3a2"/>` +
      rows +
      `<rect x="44" y="49" width="12" height="11" fill="#5a3b24" stroke-width="2.5"/>` +
      `<rect x="34" y="14" width="32" height="12" fill="#e8d3a2"/>` +
      `<path d="M34 20H66M42 14V26M58 14V26" stroke-width="2"/>`
    );
  })(),
  피라미드:
    `<circle cx="80" cy="18" r="9" fill="#ffd23f"/>` +
    `<path d="M4 82Q50 74 96 82V96H4Z" fill="#f2dca6"/>` +
    `<path d="M62 82L78 52L94 82Z" fill="#e8b85a"/>` +
    `<path d="M6 86L46 16L90 86Z" fill="#f2c14e"/>` +
    `<path d="M46 16L90 86H60Z" fill="#d9a441"/>` +
    [30, 44, 58, 72]
      .map((y) => {
        const t = (y - 16) / 70;
        const l = 46 - 40 * t;
        const r = 46 + 44 * t;
        return `<path d="M${l.toFixed(1)} ${y}H${r.toFixed(1)}" stroke-width="2.5"/>`;
      })
      .join('') +
    `<path d="M46 16L60 86" stroke-width="2.5"/>`,
  // ── 집·건물 ──
  주택:
    `<rect x="4" y="86" width="92" height="10" fill="#8fd67a"/>` +
    `<rect x="64" y="20" width="9" height="18" fill="#9a5b2e"/>` +
    `<rect x="20" y="46" width="60" height="42" fill="#fff3d6"/>` +
    `<path d="M12 50L50 18L88 50Z" fill="#e8553d"/>` +
    `<rect x="43" y="62" width="14" height="26" fill="#9a5b2e"/>` +
    dot(54, 76, 1.8, HL) +
    win(26, 58, 12, 12) +
    win(64, 58, 12, 12) +
    blob('#43b04a', [[10, 84, 5]]) +
    blob('#43b04a', [[90, 84, 5]]),
  이층집:
    `<rect x="4" y="88" width="92" height="8" fill="#8fd67a"/>` +
    `<rect x="22" y="36" width="56" height="54" fill="#bfe6ff"/>` +
    `<path d="M14 40L50 10L86 40Z" fill="#3b78e6"/>` +
    `<rect x="18" y="60" width="64" height="5" fill="#fff"/>` +
    `<path d="M26 60V52M34 60V52M42 60V52M58 60V52M66 60V52M74 60V52M22 52H78" stroke-width="2.5"/>` +
    win(28, 40, 12, 10) +
    win(60, 40, 12, 10) +
    win(28, 70, 12, 12) +
    `<rect x="56" y="68" width="14" height="22" fill="#9a5b2e"/>` +
    dot(67, 80, 1.8, HL) +
    win(44, 40, 12, 10),
  빌딩:
    `<rect x="4" y="90" width="92" height="6" fill="#8a96b0"/>` +
    `<rect x="26" y="12" width="48" height="80" fill="#7ec8f0"/>` +
    `<rect x="22" y="8" width="56" height="6" fill="#8a96b0"/>` +
    [20, 32, 44, 56, 68]
      .map((y) => [31, 45, 59].map((x) => `<rect x="${x}" y="${y}" width="10" height="7" fill="#dff3ff" stroke-width="2"/>`).join(''))
      .join('') +
    `<rect x="42" y="80" width="16" height="12" fill="#4a90e2"/><path d="M50 80V92" stroke-width="2"/>` +
    tree(12, 90, 5) +
    tree(88, 90, 5),
  고층빌딩:
    `<rect x="4" y="90" width="92" height="6" fill="#8a96b0"/>` +
    `<path d="M50 4V12" stroke-width="3"/>` +
    `<path d="M40 22L50 12L60 22V92H40Z" fill="#4a90e2"/>` +
    [28, 36, 44, 52, 60, 68, 76, 84].map((y) => `<path d="M42 ${y}H58" stroke="#dff3ff" stroke-width="3"/>`).join('') +
    `<path d="M50 22V90" stroke-width="2"/>` +
    blob('#fff', [
      [30, 44, 7],
      [40, 40, 8],
      [52, 44, 6],
    ]) +
    blob('#fff', [
      [66, 30, 5],
      [74, 26, 6],
      [82, 30, 5],
    ]) +
    `<rect x="12" y="78" width="16" height="13" fill="#fff3d6"/><path d="M10 80L20 70L30 80Z" fill="#e8553d"/>` +
    `<rect x="70" y="80" width="14" height="11" fill="#fff3d6"/><path d="M68 82L77 73L86 82Z" fill="#43b04a"/>`,
  공장:
    blob('#dfe8f5', [
      [26, 14, 6],
      [34, 10, 7],
      [44, 12, 5],
    ]) +
    blob('#dfe8f5', [
      [72, 16, 5],
      [80, 12, 6],
    ]) +
    `<rect x="20" y="22" width="10" height="34" fill="#e8553d"/><path d="M20 30H30" stroke="#fff" stroke-width="3"/>` +
    `<rect x="68" y="24" width="9" height="30" fill="#e8553d"/><path d="M68 32H77" stroke="#fff" stroke-width="3"/>` +
    `<path d="M6 90V54L24 42V54L42 42V54L60 42V54L78 42V54L94 44V90Z" fill="#8a96b0"/>` +
    `<path d="M24 42V54M42 42V54M60 42V54M78 42V54" stroke-width="2"/>` +
    [10, 30, 64, 80].map((x) => `<rect x="${x}" y="60" width="10" height="9" fill="#ffd23f" stroke-width="2.5"/>`).join('') +
    `<rect x="44" y="66" width="16" height="24" fill="#dfe8f5"/><path d="M44 72H60M44 78H60M44 84H60" stroke-width="2"/>` +
    `<rect x="4" y="90" width="92" height="6" fill="#4a4f66"/>`,
  충전소:
    `<rect x="4" y="88" width="92" height="8" fill="#8a96b0"/>` +
    `<rect x="12" y="24" width="28" height="64" rx="4" fill="#43b04a"/>` +
    `<rect x="17" y="30" width="18" height="12" rx="2" fill="#dff3ff" stroke-width="2.5"/>` +
    `<path d="M28 48L20 62H27L24 74L34 58H27L30 48Z" fill="${HL}" stroke-width="2.5"/>` +
    `<path d="M40 60C52 60 50 80 62 74" stroke-width="7"/><path d="M40 60C52 60 50 80 62 74" stroke="#4a4f66" stroke-width="3"/>` +
    car(48, 90, 1.1, '#3b8fe0') +
    `<rect x="60" y="68" width="6" height="8" rx="1.5" fill="#4a4f66" stroke-width="2.5"/>` +
    sparkle(86, 22, 5) +
    sparkle(76, 34, 4),
  톨게이트:
    `<rect x="4" y="60" width="92" height="36" fill="#8a96b0"/>` +
    `<path d="M26 64V96M50 64V96M74 64V96" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 6"/>` +
    `<rect x="4" y="12" width="92" height="12" rx="2" fill="#3b78e6"/>` +
    [26, 50, 74].map((x) => `<path d="M${x} 24V44" stroke-width="4"/><rect x="${x - 6}" y="36" width="12" height="24" rx="2" fill="#fff3d6"/><rect x="${x - 4}" y="40" width="8" height="8" fill="#8fd3ff" stroke-width="2"/>`).join('') +
    `<rect x="4" y="24" width="92" height="3" fill="${INK}" stroke="none"/>` +
    [
      [32, 46],
      [56, 70],
    ]
      .map(
        ([a, b]) =>
          `<rect x="${a}" y="50" width="${b - a}" height="4" fill="#fff" stroke-width="2"/><path d="M${a + 4} 52H${a + 8}M${a + 12} 52H${a + 16}" stroke="#e8553d" stroke-width="3"/>`,
      )
      .join('') +
    car(30, 94, 0.9, '#e8553d'),
  // ── 길·다리 ──
  자전거도로:
    `<rect x="4" y="30" width="92" height="66" fill="#8fd67a"/>` +
    `<path d="M40 30H60L88 96H12Z" fill="#43a5a0"/>` +
    `<path d="M40 30L12 96M60 30L88 96" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 34V44M50 50V56" stroke="#fff" stroke-width="3"/>` +
    // 바닥의 자전거 표시
    `<g stroke="#fff" stroke-width="4"><circle cx="36" cy="80" r="8"/><circle cx="64" cy="80" r="8"/><path d="M36 80L46 66H58L64 80M46 66L50 80H36M58 66L50 80M44 62H50M58 66L56 60H62"/></g>` +
    tree(14, 30, 7) +
    tree(86, 30, 7) +
    tree(28, 22, 5) +
    tree(72, 22, 5),
  산책로:
    `<rect x="4" y="40" width="92" height="56" fill="#8fd67a"/>` +
    `<path d="M26 96C30 80 70 74 62 58S50 46 56 40H64C58 46 74 52 74 62S50 80 58 96Z" fill="#f2dca6"/>` +
    tree(16, 58, 9) +
    tree(86, 56, 8, '#3a9e47') +
    tree(34, 44, 6) +
    // 벤치
    `<rect x="72" y="72" width="22" height="5" rx="1" fill="#c98a4b"/><rect x="72" y="64" width="22" height="4" rx="1" fill="#c98a4b"/><path d="M75 77V84M91 77V84" stroke-width="3"/>` +
    person(44, 88, 0.9, { hair: '#5a3b24', style: 'pony', shirt: '#e85d9a' }) +
    // 강아지
    `<path d="M54 76Q60 74 60 82" stroke-width="2"/>` +
    `<ellipse cx="64" cy="86" rx="8" ry="5" fill="#fff"/><circle cx="71" cy="80" r="5" fill="#fff"/><path d="M58 84Q54 80 56 78" stroke-width="2.5"/>` +
    dot(72, 79, 1.3) +
    `<path d="M60 90V94M68 90V94" stroke-width="3"/>`,
  꽃길:
    `<rect x="4" y="34" width="92" height="62" fill="#8fd67a"/>` +
    `<path d="M42 34H58L78 96H22Z" fill="#f2dca6"/>` +
    [
      [34, 42, '#ff5c70', 3],
      [30, 56, '#ffd23f', 4],
      [24, 72, '#e85d9a', 5],
      [16, 88, '#a45cf0', 5],
      [66, 42, '#ffd23f', 3],
      [70, 56, '#e85d9a', 4],
      [76, 72, '#ff5c70', 5],
      [84, 88, '#ff9f1a', 5],
      [12, 58, '#ff9f1a', 4],
      [88, 60, '#a45cf0', 4],
    ]
      .map(([x, y, c, r]) => flower(x as number, y as number, c as string, r as number))
      .join('') +
    tree(20, 34, 6) +
    tree(80, 34, 6),
  돌다리:
    `<rect x="4" y="66" width="92" height="30" fill="#7ec8f0"/>` +
    `<path d="M12 78q6-4 12 0M74 84q6-4 12 0M40 90q6-4 12 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M4 44Q50 30 96 44V62H80A30 28 0 0 0 20 62H4Z" fill="#c6ccd8"/>` +
    [
      [26, 54, 18, 50],
      [36, 44, 32, 40],
      [50, 40, 50, 36],
      [64, 44, 68, 40],
      [74, 54, 82, 50],
    ]
      .map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M4 50H16M84 50H96M4 56H18M82 56H96" stroke-width="2"/>` +
    `<path d="M20 62A30 28 0 0 1 80 62" stroke-width="3"/>` +
    `<path d="M4 44Q50 30 96 44" stroke-width="3"/>` +
    `<path d="M4 38Q50 24 96 38" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M16 42V35M32 37V30M50 34V27M68 37V30M84 42V35" stroke-width="2.5"/>`,
  징검다리:
    `<path d="M4 10H96V24Q50 30 4 24Z" fill="#8fd67a"/>` +
    `<path d="M4 24Q50 30 96 24V80Q50 74 4 80Z" fill="#7ec8f0"/>` +
    `<path d="M4 80Q50 74 96 80V96H4Z" fill="#8fd67a"/>` +
    `<path d="M10 40q5-3 10 0M78 56q5-3 10 0M74 34q5-3 10 0M14 64q5-3 10 0" stroke="#fff" stroke-width="2.5"/>` +
    [
      [48, 30, 8, 3.5],
      [58, 42, 10, 4],
      [44, 56, 12, 5],
      [58, 72, 13, 5.5],
    ]
      .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#b8c2d6"/>`)
      .join('') +
    person(44, 53, 0.7, { hair: '#2f2a26', style: 'short', shirt: '#ff9f1a' }),
  출렁다리:
    `<path d="M4 40H22L26 96H4Z" fill="#9a5b2e"/><path d="M96 40H78L74 96H96Z" fill="#9a5b2e"/>` +
    `<path d="M4 40H22" stroke="#43b04a" stroke-width="6"/><path d="M78 40H96" stroke="#43b04a" stroke-width="6"/>` +
    `<rect x="26" y="84" width="48" height="12" fill="#7ec8f0"/>` +
    `<path d="M20 26V42M80 26V42" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M20 26Q50 52 80 26" stroke="#9a5b2e" stroke-width="3"/>` +
    [28, 36, 44, 50, 56, 64, 72]
      .map((x) => {
        const t = (x - 20) / 60;
        const yr = 26 + 4 * 26 * t * (1 - t) * 1;
        const yd = 42 + 4 * 22 * t * (1 - t);
        return `<path d="M${x} ${yr.toFixed(1)}V${yd.toFixed(1)}" stroke-width="2"/>`;
      })
      .join('') +
    `<path d="M20 42Q50 64 80 42" stroke="${INK}" stroke-width="10"/><path d="M20 42Q50 64 80 42" stroke="#e0b777" stroke-width="5" stroke-dasharray="4 2"/>` +
    person(50, 52, 0.6, { hair: '#5a3b24', style: 'long', shirt: '#e8553d' }) +
    `<path d="M36 16q4 -4 8 0M56 16q4 -4 8 0" stroke="#9aa6c4" stroke-width="2.5"/>`,
  // ── 동물의 집 ──
  마구간:
    `<path d="M8 36L50 14L92 36Z" fill="#b5532f"/>` +
    `<rect x="12" y="36" width="76" height="56" fill="#c98a4b"/>` +
    `<path d="M24 36V92M76 36V92" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="28" y="44" width="44" height="48" fill="#5a3b24"/>` +
    // 말 머리
    `<path d="M40 64C38 50 44 42 52 42C60 42 66 50 70 64L64 70C60 66 56 64 52 64L46 70Z" fill="#9a5b2e"/>` +
    `<path d="M44 62C40 56 40 48 46 44" stroke="#2f2a26" stroke-width="5"/>` +
    `<path d="M48 44L46 36L54 42Z" fill="#9a5b2e" stroke-width="2.5"/>` +
    dot(56, 52, 2.2) +
    dot(66, 64, 1.5) +
    `<rect x="28" y="66" width="44" height="26" fill="#e0a768"/><path d="M28 66L72 92M72 66L28 92" stroke-width="3"/>` +
    `<path d="M4 92Q10 80 18 86Q24 78 30 92Z" fill="#ffd23f"/><path d="M8 88l4-4M16 88l2-5M22 90l2-4" stroke="#e8862e" stroke-width="2"/>` +
    `<rect x="4" y="92" width="92" height="4" fill="#8fd67a"/>`,
  벌통:
    `<rect x="4" y="88" width="92" height="8" fill="#8fd67a"/>` +
    `<path d="M32 88V94M68 88V94" stroke-width="4"/>` +
    `<rect x="26" y="62" width="48" height="26" fill="#f2c14e"/>` +
    `<rect x="26" y="40" width="48" height="22" fill="#ffd23f"/>` +
    `<path d="M22 40L28 30H72L78 40Z" fill="#c98a4b"/>` +
    `<rect x="40" y="80" width="20" height="4" rx="2" fill="${INK}"/>` +
    `<path d="M38 50H62M38 70H62" stroke="#e8862e" stroke-width="3"/>` +
    [
      [16, 30, -15],
      [84, 54, 20],
      [60, 18, 0],
      [18, 64, 10],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<ellipse cx="-2" cy="-6" rx="4" ry="5" fill="#fff" stroke-width="2"/><ellipse cx="3" cy="-6" rx="4" ry="5" fill="#fff" stroke-width="2"/>` +
          `<ellipse cx="0" cy="0" rx="7" ry="5" fill="#ffd23f" stroke-width="2.5"/><path d="M-2 -4V4M2 -4V4" stroke-width="2"/>` +
          dot(6, -1, 1.2) +
          `</g>`,
      )
      .join('') +
    flower(88, 80, '#ff5c70', 3),
  새집:
    blob('#43b04a', [
      [16, 14, 10],
      [30, 10, 8],
    ]) +
    `<path d="M4 20Q20 22 34 16" stroke="#9a5b2e" stroke-width="5"/>` +
    `<rect x="46" y="66" width="8" height="30" fill="#9a5b2e"/>` +
    `<rect x="30" y="36" width="40" height="34" fill="#e8862e"/>` +
    `<path d="M24 40L50 16L76 40Z" fill="#3b78e6"/>` +
    `<circle cx="50" cy="50" r="7" fill="#5a3b24"/>` +
    `<path d="M50 60V64" stroke-width="3"/><path d="M44 64H56" stroke-width="3"/>` +
    // 새
    `<ellipse cx="76" cy="58" rx="9" ry="7" fill="#ff5c70"/><circle cx="82" cy="50" r="5" fill="#ff5c70"/>` +
    `<path d="M86 49L92 51L86 53Z" fill="${HL}" stroke-width="2"/>` +
    dot(83, 49, 1.3) +
    `<path d="M70 58Q76 54 80 60" stroke-width="2.5"/>` +
    `<path d="M72 64H70" stroke-width="3"/><path d="M68 66H84" stroke="#9a5b2e" stroke-width="3"/>`,
  // ── 방 ──
  욕실:
    `<rect x="4" y="4" width="92" height="92" rx="4" fill="#dff3ff"/>` +
    `<path d="M4 24H96M4 44H96M24 4V60M48 4V60M72 4V60" stroke="#bfe0f5" stroke-width="2.5"/>` +
    // 샤워기
    `<path d="M88 12V20H70" stroke-width="4"/><path d="M60 22H78L74 16H64Z" fill="#8a96b0"/>` +
    drop(64, 30, 0.6) +
    drop(72, 32, 0.6) +
    drop(68, 42, 0.6) +
    // 거품
    blob('#fff', [
      [22, 58, 7],
      [32, 54, 8],
      [44, 58, 6],
      [66, 58, 7],
      [76, 56, 6],
    ]) +
    `<path d="M10 60H90V70C90 82 82 86 72 86H28C18 86 10 82 10 70Z" fill="#fff"/>` +
    `<path d="M24 86L22 94M76 86L78 94" stroke-width="4"/>` +
    // 오리 인형
    `<ellipse cx="54" cy="56" rx="8" ry="5" fill="#ffd23f"/><circle cx="58" cy="48" r="5" fill="#ffd23f"/><path d="M62 48L67 49L62 51Z" fill="#ff9f1a" stroke-width="2"/>` +
    dot(59, 47, 1.2),
  침실:
    `<rect x="4" y="4" width="92" height="92" rx="4" fill="#e6e2f7"/>` +
    `<rect x="62" y="12" width="26" height="22" fill="#2b3566" stroke-width="3"/><path d="M75 12V34M62 23H88" stroke-width="2"/>` +
    `<path d="M70 17A5 5 0 1 0 72 26A4 4 0 1 1 70 17Z" fill="${HL}" stroke="none"/>` +
    sparkle(82, 18, 2.5) +
    // 스탠드와 협탁
    `<rect x="8" y="58" width="16" height="20" fill="#c98a4b"/><path d="M16 58V48" stroke-width="3"/><path d="M9 48L12 38H20L23 48Z" fill="${HL}"/>` +
    // 침대
    `<rect x="26" y="40" width="10" height="46" rx="3" fill="#9a5b2e"/>` +
    `<rect x="30" y="62" width="62" height="16" fill="#fff"/>` +
    `<ellipse cx="42" cy="58" rx="9" ry="6" fill="#fff"/>` +
    `<path d="M50 56H88Q92 56 92 62V78H50Z" fill="#8e4fc9"/><path d="M50 64H92" stroke="#c9a3ee" stroke-width="3"/>` +
    `<path d="M30 78V88M88 78V88" stroke-width="4"/>` +
    `<rect x="4" y="88" width="92" height="8" fill="#c98a4b"/>`,
  아이방:
    `<rect x="4" y="4" width="92" height="92" rx="4" fill="#fff1b8"/>` +
    sparkle(18, 16, 5, '#ff9aa8') +
    sparkle(50, 12, 4, '#7ec8f0') +
    sparkle(82, 16, 5, '#ff9aa8') +
    // 작은 침대
    `<rect x="8" y="30" width="7" height="34" rx="2" fill="#3b8fe0"/>` +
    `<rect x="10" y="48" width="40" height="12" fill="#7ec8f0"/>` +
    `<ellipse cx="20" cy="45" rx="7" ry="4" fill="#fff"/>` +
    sparkle(34, 54, 3.5, '#fff') +
    `<path d="M12 60V66M48 60V66" stroke-width="3"/>` +
    // 곰 인형
    `<circle cx="66" cy="28" r="4" fill="#c98a4b"/><circle cx="82" cy="28" r="4" fill="#c98a4b"/>` +
    `<ellipse cx="74" cy="54" rx="11" ry="12" fill="#c98a4b"/><circle cx="74" cy="34" r="10" fill="#c98a4b"/>` +
    `<ellipse cx="74" cy="38" rx="4" ry="3" fill="#f2dca6" stroke-width="2"/>` +
    dot(70, 32, 1.6) +
    dot(78, 32, 1.6) +
    dot(74, 37, 1.4) +
    // 바닥과 장난감
    `<rect x="4" y="74" width="92" height="22" fill="#e0a768"/>` +
    `<rect x="12" y="74" width="12" height="12" fill="#e8553d" stroke-width="3"/><rect x="24" y="78" width="10" height="10" fill="#43b04a" stroke-width="3"/><rect x="16" y="64" width="10" height="10" fill="#3b78e6" stroke-width="3"/>` +
    `<circle cx="50" cy="82" r="8" fill="#ffd23f"/><path d="M42 82H58M50 74V90" stroke="#e8553d" stroke-width="2.5"/>` +
    `<ellipse cx="74" cy="72" rx="9" ry="3" fill="#c98a4b" stroke="none"/>`,
  // ── 밭·꽃밭 ──
  텃밭:
    `<circle cx="16" cy="16" r="8" fill="#ffd23f"/>` +
    `<rect x="4" y="34" width="92" height="62" fill="#8fd67a"/>` +
    [48, 66, 84].map((y) => `<rect x="8" y="${y}" width="84" height="10" rx="5" fill="#9a5b2e"/>`).join('') +
    [18, 36, 54, 72].map((x) => blob('#5fc24a', [[x, 44, 6], [x + 6, 42, 5]])).join('') +
    [16, 30, 44, 58, 72, 86].map((x) => `<path d="M${x} 66l-4-9M${x} 66v-10M${x} 66l4-9" stroke="#3a9e47" stroke-width="3"/><path d="M${x - 3.5} 66h7l-3.5 5Z" fill="#ff9f1a" stroke-width="2"/>`).join('') +
    [20, 40, 60, 80].map((x) => `<circle cx="${x}" cy="82" r="6" fill="#43b04a"/><path d="M${x} 82l-4-5M${x} 82l4-5" stroke="#8fd67a" stroke-width="2"/>`).join('') +
    // 물뿌리개
    `<path d="M66 16H82V32H66Z" fill="#3b8fe0"/><path d="M66 22L54 14" stroke-width="3.5"/><path d="M50 10L56 18L49 16Z" fill="#3b8fe0" stroke-width="2.5"/><path d="M82 19Q90 24 82 30" stroke-width="3"/>` +
    drop(48, 20, 0.5) +
    drop(44, 26, 0.5),
  화단:
    `<rect x="4" y="88" width="92" height="8" fill="#8fd67a"/>` +
    `<path d="M10 56H90V64H10Z" fill="#6b3e26"/>` +
    flower(18, 34, '#ff5c70', 5) +
    flower(34, 42, '#ffd23f', 5) +
    flower(50, 30, '#a45cf0', 6) +
    flower(66, 42, '#ff9f1a', 5) +
    flower(82, 34, '#e85d9a', 5) +
    `<path d="M26 56V44M42 56V48M58 56V46M74 56V48" stroke="#3a9e47" stroke-width="3"/>` +
    `<path d="M26 50q-5-4-8 0M58 50q5-4 8 0" fill="#5fc24a" stroke-width="2"/>` +
    `<rect x="8" y="62" width="84" height="26" fill="#e8553d"/>` +
    [0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => `<path d="M${8 + c * 14 + (r % 2) * 7} ${62 + r * 8.7}v8.7" stroke-width="2"/>`).join('')).join('') +
    `<path d="M8 70.7H92M8 79.4H92" stroke-width="2"/>`,
  // ── 건물의 부분 ──
  기둥:
    `<path d="M10 22L50 6L90 22Z" fill="#dfe3ea"/>` +
    `<rect x="8" y="22" width="84" height="8" fill="#c6ccd8"/>` +
    [20, 80].map((x) => `<rect x="${x - 5}" y="30" width="10" height="54" fill="#eef1f6"/>`).join('') +
    `<rect x="36" y="30" width="28" height="8" fill="#dfe3ea"/>` +
    `<rect x="39" y="38" width="22" height="44" fill="#fff"/>` +
    `<path d="M45 40V80M50 40V80M55 40V80" stroke="#b8c2d6" stroke-width="2.5"/>` +
    `<rect x="36" y="82" width="28" height="6" fill="#dfe3ea"/>` +
    `<rect x="6" y="88" width="88" height="6" fill="#b8c2d6"/>` +
    `<path d="M32 26L30 92M68 26L70 92" stroke="${HL}" stroke-width="4.5" stroke-dasharray="7 5"/>`,
  벽: (() => {
    let s = `<rect x="6" y="10" width="88" height="80" fill="#e8553d"/>`;
    for (let r = 0; r < 8; r++) {
      const y = 10 + r * 10;
      if (r) s += `<path d="M6 ${y}H94" stroke="#fff3d6" stroke-width="2.5"/>`;
      const off = r % 2 ? 11 : 0;
      for (let x = 6 + off + 22; x < 94; x += 22) s += `<path d="M${x} ${y + 1}V${y + 9}" stroke="#fff3d6" stroke-width="2.5"/>`;
    }
    return s + `<rect x="6" y="10" width="88" height="80" fill="none"/><rect x="4" y="90" width="92" height="6" fill="#8fd67a"/>`;
  })(),
  천장:
    room('ceil') +
    `<path d="M50 10V20" stroke-width="2.5"/><path d="M42 26Q42 18 50 18T58 26Z" fill="${HL}"/>` +
    person(62, 90, 0.7, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    `<path d="M70 70L76 60" stroke-width="4"/>` +
    `<path d="M36 80V50M30 56L36 48L42 56" stroke="#3b78e6" stroke-width="4"/>`,
  바닥:
    room('floor') +
    `<ellipse cx="50" cy="84" rx="18" ry="5" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<circle cx="70" cy="80" r="4.5" fill="#3b8fe0" stroke-width="2.5"/>` +
    `<path d="M50 38V62M44 56L50 64L56 56" stroke="#3b78e6" stroke-width="4"/>`,
  // ── 우주 ──
  태양계:
    space +
    [
      [20, 9],
      [29, 14],
      [38, 19],
      [45, 25],
    ]
      .map(([rx, ry]) => `<ellipse cx="50" cy="50" rx="${rx}" ry="${ry}" stroke="#8a96b0" stroke-width="1.5"/>`)
      .join('') +
    `<circle cx="50" cy="50" r="11" fill="#ffd23f" stroke="#ff9f1a"/>` +
    `<circle cx="30" cy="50" r="3" fill="#b8c2d6" stroke-width="2"/>` +
    `<circle cx="66" cy="38" r="4" fill="#3b8fe0" stroke-width="2"/>` +
    `<circle cx="28" cy="66" r="3.5" fill="#e8553d" stroke-width="2"/>` +
    `<ellipse cx="86" cy="62" rx="9" ry="3" stroke="#e0b777" stroke-width="2.5"/><circle cx="86" cy="62" r="5" fill="#f2c14e" stroke-width="2"/>` +
    `<circle cx="40" cy="27" r="5" fill="#e8862e" stroke-width="2"/>` +
    sparkle(12, 14, 3) +
    sparkle(88, 14, 3) +
    sparkle(14, 88, 3),
  행성:
    space +
    sparkle(16, 16, 4) +
    sparkle(84, 22, 3) +
    sparkle(18, 80, 3) +
    `<circle cx="50" cy="52" r="30" fill="#e8862e"/>` +
    `<path d="M22 42Q50 48 78 42M20 56Q50 62 80 56M26 70Q50 74 74 70" stroke="#f2c14e" stroke-width="5"/>` +
    `<ellipse cx="60" cy="62" rx="6" ry="3.5" fill="#b5532f" stroke-width="2"/>` +
    `<circle cx="84" cy="82" r="6" fill="#dfe8f5" stroke-width="2.5"/>`,
  달기지:
    space +
    `<circle cx="78" cy="22" r="10" fill="#3b8fe0"/><path d="M72 18q4-4 8 0t4 6M74 28q4 0 6-4" stroke="#43b04a" stroke-width="3"/>` +
    sparkle(18, 14, 3) +
    sparkle(48, 20, 3) +
    `<path d="M4 70Q50 60 96 70V96H4Z" fill="#b8c2d6"/>` +
    `<ellipse cx="18" cy="86" rx="6" ry="2.5" fill="#8a96b0" stroke-width="2"/><ellipse cx="82" cy="88" rx="7" ry="2.5" fill="#8a96b0" stroke-width="2"/>` +
    `<path d="M22 72A16 16 0 0 1 54 72Z" fill="#fff"/>` +
    `<path d="M60 70A10 10 0 0 1 80 70Z" fill="#fff"/>` +
    tube('M54 70H60', '#dfe8f5', 4) +
    `<rect x="32" y="62" width="12" height="6" rx="3" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<circle cx="70" cy="66" r="3" fill="#7ec8f0" stroke-width="2"/>` +
    `<path d="M38 56V44" stroke-width="3"/><path d="M30 44Q38 52 46 44Z" fill="#dfe8f5" stroke-width="2.5"/>` +
    // 우주인
    `<path d="M22 78L20 90M28 78L30 90" stroke-width="4"/>` +
    `<rect x="17" y="64" width="16" height="16" rx="5" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="25" cy="58" r="8" fill="#fff" stroke-width="2.5"/><circle cx="25" cy="58" r="5" fill="#4a90e2" stroke-width="2"/>`,
  로켓발사대:
    `<rect x="4" y="84" width="92" height="12" fill="#8a96b0"/>` +
    // 발사탑
    `<rect x="16" y="14" width="12" height="70" fill="#e8553d"/>` +
    [24, 36, 48, 60, 72].map((y) => `<path d="M16 ${y}L28 ${y + 12}M28 ${y}L16 ${y + 12}" stroke-width="2"/>`).join('') +
    `<path d="M28 30H40M28 56H40" stroke-width="4"/>` +
    // 로켓
    `<path d="M40 64L32 78H44Z" fill="#3b78e6"/><path d="M60 64L68 78H56Z" fill="#3b78e6"/>` +
    `<path d="M50 8C60 18 62 30 62 44V76H38V44C38 30 40 18 50 8Z" fill="#fff"/>` +
    `<path d="M50 8C55 13 58 18 59 24H41C42 18 45 13 50 8Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="38" r="5.5" fill="#8fd3ff"/>` +
    `<path d="M46 76V80H54V76Z" fill="#8a96b0" stroke-width="2.5"/>` +
    // 받침과 연기
    `<rect x="30" y="80" width="40" height="6" fill="#4a4f66"/>` +
    blob('#fff', [
      [36, 88, 7],
      [48, 90, 8],
      [62, 88, 7],
      [74, 90, 5],
      [26, 90, 5],
    ]),
  가로수:
    `<rect x="4" y="40" width="92" height="56" fill="#dfe8f5"/>` +
    `<path d="M40 40H60L82 96H18Z" fill="#8a96b0"/>` +
    `<path d="M50 44V52M50 60V70M50 78V92" stroke="#fff" stroke-width="3"/>` +
    [
      [34, 44, 4],
      [26, 60, 6],
      [14, 88, 9],
      [66, 44, 4],
      [74, 60, 6],
      [86, 88, 9],
    ]
      .map(([x, y, r]) => tree(x, y, r))
      .join(''),
};
