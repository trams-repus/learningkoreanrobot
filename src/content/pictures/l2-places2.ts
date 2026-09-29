// 장소 그림 묶음 2 (2단계: 길·시설·학교·집 둘레). 장소마다 그곳을 대표하는 물건을 크게 보여 준다. 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, blob, sparkle, tube, person, cheeks, drop } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, '#dfe8f5');

/** 십자 (가운데 x,y, 팔 길이 반 l, 굵기 반 w) */
const cross = (x: number, y: number, l: number, w: number, fill: string, sw = 3) =>
  `<path d="M${x - w} ${y - l}H${x + w}V${y - w}H${x + l}V${y + w}H${x + w}V${y + l}H${x - w}V${y + w}H${x - l}V${y - w}H${x - w}Z" fill="${fill}" stroke-width="${sw}"/>`;

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝 yb까지) */
const waves = (y: number, fill = '#7ec8f0', yb = 96) =>
  `<path d="M4 ${y}q7.7-5 15.3 0t15.3 0t15.3 0t15.3 0t15.3 0t15.3 0V${yb}H4Z" fill="${fill}"/>`;

/** 나무 (줄기 밑 x,y, 잎 반지름 r) */
const tree = (x: number, y: number, r: number, leaf = '#43b04a') =>
  `<rect x="${x - r * 0.18}" y="${y - r * 1.2}" width="${r * 0.36}" height="${r * 1.2}" fill="#9a5b2e" stroke-width="2.5"/>` +
  blob(leaf, [
    [x, y - r * 1.8, r],
    [x - r * 0.6, y - r * 1.3, r * 0.7],
    [x + r * 0.6, y - r * 1.3, r * 0.7],
  ]);

/** 옆모습 승용차 (왼쪽 위 기준 x,y, 크기 s) */
const carSide = (x: number, y: number, s: number, body: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M8 66V56C8 50 12 47 20 46L32 31C35 27 40 25 46 25H62C68 25 72 27 75 31L86 46C92 47 94 51 94 57V66Z" fill="${body}"/>` +
  `<path d="M36 45L44 32H55V45Z" fill="#8fd3ff"/><path d="M61 45V32H70L78 45Z" fill="#8fd3ff"/>` +
  wheel(28, 68, 11) +
  wheel(74, 68, 11) +
  `</g>`;

/** 위에서 본 자동차 (가운데 x,y, 돌림 각도) */
const carTop = (x: number, y: number, rot: number, body: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">` +
  `<rect x="-7" y="-12" width="14" height="24" rx="4" fill="${body}"/>` +
  `<rect x="-5" y="-7" width="10" height="5" rx="1.5" fill="#8fd3ff" stroke-width="2"/>` +
  `<rect x="-5" y="5" width="10" height="3.5" rx="1" fill="#8fd3ff" stroke-width="2"/></g>`;

/** 뒤에서 본 자동차 (가운데 x,y, 크기 s) */
const carBack = (x: number, y: number, s: number, body: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<rect x="-10" y="4" width="5" height="6" rx="1.5" fill="${INK}"/><rect x="5" y="4" width="5" height="6" rx="1.5" fill="${INK}"/>` +
  `<path d="M-9 -4L-6 -13H6L9 -4Z" fill="${body}"/><path d="M-6 -5L-4 -11H4L6 -5Z" fill="#8fd3ff" stroke-width="${(2.5 / s).toFixed(2)}"/>` +
  `<rect x="-13" y="-5" width="26" height="12" rx="3" fill="${body}"/>` +
  dot(-8, 0, 2.5, '#e8553d') +
  dot(8, 0, 2.5, '#e8553d') +
  `</g>`;

/** 앞에서 본 버스 (왼쪽 위 x,y, 너비 24) */
const busFront = (x: number, y: number, c: string) =>
  `<rect x="${x + 2}" y="${y + 38}" width="6" height="8" rx="2" fill="${INK}"/><rect x="${x + 16}" y="${y + 38}" width="6" height="8" rx="2" fill="${INK}"/>` +
  `<rect x="${x}" y="${y}" width="24" height="42" rx="5" fill="${c}"/>` +
  `<rect x="${x + 4}" y="${y + 4}" width="16" height="6" rx="1.5" fill="#4a4f66" stroke-width="2"/>` +
  `<rect x="${x + 3}" y="${y + 13}" width="18" height="15" rx="2" fill="#8fd3ff" stroke-width="2.5"/>` +
  `<circle cx="${x + 6.5}" cy="${y + 34}" r="2.8" fill="#fff" stroke-width="2"/><circle cx="${x + 17.5}" cy="${y + 34}" r="2.8" fill="#fff" stroke-width="2"/>`;

/** 볼링 핀 (가운데 x, 밑 y, 크기 s) */
const pin = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3 / s).toFixed(2)}">` +
  `<path d="M0 -36C6 -36 7 -28 4 -22C11 -16 11 -6 6 0H-6C-11 -6 -11 -16 -4 -22C-7 -28 -6 -36 0 -36Z" fill="#fff"/>` +
  `<path d="M-4.5 -25H4.5M-5 -21H5" stroke="#e8553d" stroke-width="${(2.5 / s).toFixed(2)}"/></g>`;

/** 음표 (머리 가운데 x,y) */
const note = (x: number, y: number, fill: string) =>
  `<path d="M${x + 4} ${y}V${y - 20}L${x + 12} ${y - 16}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="5.5" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>`;

export const PICS: Record<string, string> = {
  // ── 길 ──
  버스터미널:
    `<rect x="4" y="86" width="92" height="8" rx="2" fill="#dfe8f5"/>` +
    `<path d="M6 30V86M94 30V86" stroke-width="5"/>` +
    `<path d="M4 20H96L92 30H8Z" fill="#e8553d"/>` +
    busFront(10, 38, '#ffd23f') +
    busFront(38, 38, '#43b04a') +
    busFront(66, 38, '#3b8fe0'),
  휴게소:
    `<rect x="4" y="84" width="92" height="10" fill="#8a96b0"/><path d="M8 89H92" stroke="#fff" stroke-width="3" stroke-dasharray="8 7"/>` +
    `<rect x="38" y="42" width="54" height="42" fill="#fff3d6"/>` +
    `<path d="M34 44L64 26L94 44Z" fill="#3b78e6"/>` +
    `<rect x="44" y="50" width="18" height="14" fill="#8fd3ff" stroke-width="2.5"/><rect x="70" y="50" width="16" height="14" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M18 36V84" stroke-width="5"/>` +
    `<circle cx="18" cy="24" r="15" fill="#ff9f1a"/>` +
    `<ellipse cx="12" cy="19" rx="3.5" ry="5" fill="#fff" stroke-width="2"/><path d="M12 24V33" stroke="#fff" stroke-width="3"/>` +
    `<path d="M21 13V19M24 13V19M27 13V19" stroke="#fff" stroke-width="2"/><path d="M21 19Q24 24 27 19M24 22V33" stroke="#fff" stroke-width="3"/>` +
    carSide(34, 52, 0.4, '#e8553d'),
  고속도로:
    `<rect x="4" y="40" width="92" height="56" fill="#8fd67a"/>` +
    `<path d="M42 42H58L96 96H4Z" fill="#8a96b0"/>` +
    `<path d="M47 44L30 96M53 44L70 96" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>` +
    `<path d="M43 44L7 94M57 44L93 94" stroke="#ffd23f" stroke-width="3"/>` +
    carBack(60, 60, 0.7, '#3b78e6') +
    carBack(33, 80, 1.1, '#e8553d') +
    `<path d="M12 30V66M88 30V66" stroke-width="5"/>` +
    `<rect x="8" y="8" width="84" height="24" rx="3" fill="#3a9e47"/>` +
    [28, 50, 72]
      .map((x) => `<path d="M${x} 12L${x + 7} 20H${x + 2.5}V28H${x - 2.5}V20H${x - 7}Z" fill="#fff" stroke-width="2"/>`)
      .join(''),
  교차로:
    `<rect x="4" y="4" width="92" height="92" rx="6" fill="#8fd67a"/>` +
    blob('#3a9e47', [[18, 18, 8]]) +
    blob('#3a9e47', [[82, 18, 8]]) +
    blob('#3a9e47', [[18, 82, 8]]) +
    blob('#3a9e47', [[82, 82, 8]]) +
    `<path d="M36 4H64V36H96V64H64V96H36V64H4V36H36Z" fill="#8a96b0"/>` +
    `<path d="M50 6V30M50 70V94M6 50H30M70 50H94" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5"/>` +
    [39, 45, 51, 57]
      .map(
        (v) =>
          `<rect x="${v}" y="29" width="4" height="6" fill="#fff" stroke="none"/><rect x="${v}" y="65" width="4" height="6" fill="#fff" stroke="none"/>` +
          `<rect x="29" y="${v}" width="6" height="4" fill="#fff" stroke="none"/><rect x="65" y="${v}" width="6" height="4" fill="#fff" stroke="none"/>`,
      )
      .join('') +
    carTop(57, 82, 0, '#e8553d') +
    carTop(20, 57, 90, '#3b78e6') +
    carTop(43, 18, 180, '#ffd23f'),
  횡단보도:
    `<rect x="4" y="28" width="92" height="68" fill="#6b7590"/>` +
    `<rect x="4" y="20" width="92" height="10" fill="#dfe8f5"/>` +
    [
      [34, 40],
      [46, 53],
      [60, 69],
      [77, 88],
    ]
      .map(([a, b]) => {
        const l = (y: number) => (38 - ((y - 30) / 66) * 26).toFixed(1);
        const r = (y: number) => (62 + ((y - 30) / 66) * 26).toFixed(1);
        return `<path d="M${l(a)} ${a}H${r(a)}L${r(b)} ${b}H${l(b)}Z" fill="#fff" stroke-width="2.5"/>`;
      })
      .join('') +
    person(50, 80, 0.8, { hair: '#5a3b24', style: 'pony', shirt: '#ff9f1a' }) +
    `<path d="M86 30V60" stroke-width="4"/>` +
    `<rect x="78" y="6" width="16" height="26" rx="3" fill="#4a4f66"/>` +
    dot(86, 13, 4.5, '#8a3a3a') +
    `<circle cx="86" cy="25" r="5" fill="#5fc24a" stroke-width="2"/>`,
  육교:
    `<rect x="4" y="74" width="92" height="22" fill="#8a96b0"/><path d="M6 85H94" stroke="#fff" stroke-width="3" stroke-dasharray="8 7"/>` +
    `<rect x="34" y="38" width="6" height="36" fill="#dfe8f5"/><rect x="60" y="38" width="6" height="36" fill="#dfe8f5"/>` +
    carSide(40, 60, 0.33, '#ffd23f') +
    `<path d="M26 30V38L16 74H4Z" fill="#3b78e6"/><path d="M74 30V38L84 74H96Z" fill="#3b78e6"/>` +
    `<path d="M22 44H14M20 52H11M18 60H8M16 68H6M78 44H86M80 52H89M82 60H92M84 68H94" stroke="#fff" stroke-width="2.5"/>` +
    `<rect x="24" y="30" width="52" height="9" fill="#3b78e6"/>` +
    person(50, 30, 0.55, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }) +
    `<path d="M24 20H76M26 20V30M36 20V30M46 20V30M56 20V30M66 20V30M74 20V30M24 20L4 66M76 20L96 66" stroke-width="3"/>`,
  기찻길:
    `<rect x="4" y="20" width="92" height="76" fill="#8fd67a"/>` +
    `<path d="M40 20H60L94 96H6Z" fill="#c9b79c"/>` +
    [24, 30, 38, 48, 60, 74, 90]
      .map((y) => {
        const t = (y - 20) / 76;
        const hw = 10 + 36 * t;
        const h = 2.5 + 5 * t;
        return `<rect x="${(50 - hw).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${(hw * 2).toFixed(1)}" height="${h.toFixed(1)}" rx="1" fill="#9a5b2e" stroke-width="${(1.5 + 1.5 * t).toFixed(1)}"/>`;
      })
      .join('') +
    tube('M46 20L22 96', '#dfe8f5', 3) +
    tube('M54 20L78 96', '#dfe8f5', 3),
  건널목:
    `<rect x="4" y="72" width="92" height="20" fill="#c9b79c"/>` +
    [8, 20, 32, 44, 56, 68, 80, 92]
      .map((x) => `<rect x="${x - 3}" y="72" width="6" height="20" fill="#9a5b2e" stroke-width="2.5"/>`)
      .join('') +
    tube('M4 77H96', '#dfe8f5', 3) +
    tube('M4 87H96', '#dfe8f5', 3) +
    tube('M24 18V94', '#8a96b0', 4) +
    `<rect x="18" y="50" width="78" height="9" rx="3" fill="#ffd23f"/>` +
    [34, 50, 66, 82].map((x) => `<path d="M${x} 50.5L${x - 5} 58.5H${x + 1}L${x + 6} 50.5Z" fill="${INK}" stroke="none"/>`).join('') +
    dot(24, 54.5, 5, '#8a96b0') +
    `<rect x="8" y="30" width="32" height="14" rx="7" fill="#4a4f66"/>` +
    `<circle cx="15" cy="37" r="5" fill="#ff5c70" stroke-width="2"/><circle cx="33" cy="37" r="5" fill="#8a3a3a" stroke-width="2"/>` +
    `<g transform="rotate(32 24 16)"><rect x="8" y="12" width="32" height="7" rx="2" fill="#ffd23f" stroke-width="2.5"/></g>` +
    `<g transform="rotate(-32 24 16)"><rect x="8" y="12" width="32" height="7" rx="2" fill="#ffd23f" stroke-width="2.5"/></g>`,
  가로등:
    `<rect x="4" y="4" width="92" height="92" rx="8" fill="#2c3566"/>` +
    sparkle(16, 16, 5) +
    sparkle(26, 34, 4) +
    sparkle(84, 50, 4) +
    `<path d="M58 26L40 86H92L76 26Z" fill="#fff1b8" stroke="none" opacity=".45"/>` +
    `<rect x="22" y="84" width="20" height="8" rx="2" fill="#4a4f66" stroke="#dfe8f5"/>` +
    tube('M32 86V30C32 16 44 12 58 14', '#4a4f66', 4) +
    `<path d="M54 12H78L84 26H50Z" fill="#4a4f66" stroke="#dfe8f5"/>` +
    `<ellipse cx="67" cy="27" rx="15" ry="5" fill="#ffd23f" stroke="#dfe8f5"/>`,
  전봇대:
    `<path d="M4 40Q16 48 28 20M72 20Q84 48 96 40M4 56Q26 66 44 38M56 38Q74 66 96 56" stroke-width="2.5"/>` +
    `<rect x="44" y="10" width="12" height="84" rx="2" fill="#c9ccd6"/>` +
    `<rect x="18" y="20" width="64" height="7" rx="2" fill="#8a96b0"/>` +
    `<rect x="24" y="12" width="8" height="9" rx="3" fill="#fff" stroke-width="2.5"/><rect x="68" y="12" width="8" height="9" rx="3" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="56" y="36" width="14" height="18" rx="3" fill="#8a96b0"/>` +
    `<path d="M4 94H96"/>` +
    `<ellipse cx="86" cy="42" rx="7" ry="5.5" fill="#3b8fe0"/><circle cx="91" cy="37" r="4" fill="#3b8fe0"/><path d="M95 37L98 38L95 39Z" fill="#ff9f1a" stroke-width="1.5"/>` +
    dot(92, 36, 1.3),
  분수대:
    `<path d="M50 38C42 28 30 34 20 66M50 38C58 28 70 34 80 66" stroke="#4aa8f0" stroke-width="5"/>` +
    `<path d="M50 44V12" stroke="#4aa8f0" stroke-width="6"/>` +
    `<circle cx="50" cy="10" r="4" fill="#7ec8f0" stroke-width="2"/>` +
    `<ellipse cx="50" cy="78" rx="42" ry="14" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="75" rx="35" ry="8" fill="#7ec8f0"/>` +
    `<rect x="45" y="48" width="10" height="26" fill="#dfe8f5"/>` +
    `<path d="M28 44H72C70 54 30 54 28 44Z" fill="#dfe8f5"/><path d="M31 45H69" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M30 48C26 54 26 60 28 66M70 48C74 54 74 60 72 66" stroke="#4aa8f0" stroke-width="3"/>` +
    dot(18, 70, 2.5, '#4aa8f0') +
    dot(82, 70, 2.5, '#4aa8f0') +
    dot(36, 22, 2.5, '#4aa8f0') +
    dot(64, 22, 2.5, '#4aa8f0'),
  광장:
    `<rect x="6" y="14" width="18" height="36" fill="#dfe8f5"/><rect x="24" y="24" width="16" height="26" fill="#ffe7a8"/>` +
    `<rect x="60" y="22" width="16" height="28" fill="#ffe0ea"/><rect x="76" y="10" width="18" height="40" fill="#dfe8f5"/>` +
    [
      [10, 20],
      [10, 32],
      [80, 16],
      [80, 28],
      [64, 28],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="9" height="7" fill="#8fd3ff" stroke-width="2"/>`)
      .join('') +
    `<path d="M4 50H96V94H4Z" fill="#f2dcb0"/>` +
    `<path d="M4 62H96M4 76H96M30 50L22 94M50 50V94M70 50L78 94" stroke="#d6b57e" stroke-width="2.5"/>` +
    `<path d="M50 60V6" stroke-width="3.5"/><path d="M50 7H70L66 13L70 19H50Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="61" rx="8" ry="3" fill="#8a96b0"/>` +
    [
      [22, 72, 1],
      [34, 86, -1],
      [74, 80, 1],
    ]
      .map(
        ([x, y, d]) =>
          `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#a3aabb"/><circle cx="${x + d * 6}" cy="${y - 5}" r="3.5" fill="#a3aabb"/>` +
          `<path d="M${x + d * 9} ${y - 5}l${d * 3} 1l${-d * 3} 1Z" fill="#ff9f1a" stroke-width="1.5"/>` +
          dot(x + d * 7, y - 6, 1.1),
      )
      .join(''),

  // ── 동네 시설 ──
  파출소:
    `<rect x="44" y="6" width="12" height="10" rx="3" fill="#3b78e6"/><rect x="38" y="8" width="6" height="8" rx="2" fill="#e8553d"/>` +
    `<path d="M8 36L44 16L80 36Z" fill="#3b78e6"/>` +
    `<rect x="12" y="36" width="64" height="54" fill="#fff"/>` +
    `<rect x="18" y="44" width="20" height="16" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M44 90V66H62V90Z" fill="#3b78e6"/>` +
    `<circle cx="53" cy="52" r="8" fill="#ffc933" stroke-width="2.5"/>` +
    `<path d="M4 90H96"/>` +
    person(80, 94, 1.05, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#1d3a7a' }) +
    dot(80, 81, 2.5, '#ffc933'),
  보건소:
    `<rect x="8" y="30" width="84" height="60" fill="#fff"/>` +
    `<rect x="4" y="24" width="92" height="9" rx="2" fill="#43b04a"/>` +
    [16, 70]
      .map((x) => `<rect x="${x}" y="40" width="14" height="12" fill="#8fd3ff" stroke-width="2.5"/><rect x="${x}" y="60" width="14" height="12" fill="#8fd3ff" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M40 90V66H60V90Z" fill="#8fd3ff"/><path d="M50 66V90" stroke-width="2.5"/>` +
    `<path d="M50 60C38 50 32 42 36 34C40 27 48 29 50 35C52 29 60 27 64 34C68 42 62 50 50 60Z" fill="#ff9aa8"/>` +
    cross(50, 41, 7, 2.6, '#e8553d', 2) +
    `<path d="M4 90H96"/>` +
    `<rect x="36" y="6" width="28" height="16" rx="3" fill="#fff"/>` +
    cross(50, 14, 5.5, 2.2, '#43b04a', 2),
  미술관:
    `<rect x="4" y="4" width="92" height="72" fill="#ffe7a8"/>` +
    `<rect x="4" y="76" width="92" height="20" fill="#c98b4f"/>` +
    `<rect x="18" y="12" width="64" height="48" rx="2" fill="#e8a33a"/>` +
    `<rect x="24" y="18" width="52" height="36" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M24 54L40 32L52 46L60 38L76 54Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="64" cy="27" r="5" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M18 70Q50 84 82 70" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M18 68V92M82 68V92" stroke-width="4"/>` +
    `<rect x="12" y="90" width="12" height="4" rx="1" fill="#ffd23f"/><rect x="76" y="90" width="12" height="4" rx="1" fill="#ffd23f"/>` +
    dot(18, 66, 3.5, '#ffd23f') +
    dot(82, 66, 3.5, '#ffd23f'),
  과학관:
    sparkle(14, 12, 5) +
    sparkle(46, 10, 4) +
    `<rect x="36" y="52" width="58" height="38" fill="#dfe8f5"/>` +
    `<path d="M40 52A25 25 0 0 1 90 52Z" fill="#8e4fc9"/>` +
    tube('M72 36L88 16', '#4a4f66', 6) +
    `<rect x="44" y="60" width="12" height="12" fill="#8fd3ff" stroke-width="2.5"/><rect x="74" y="60" width="12" height="12" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M58 90V72H72V90Z" fill="#8e4fc9"/>` +
    `<path d="M10 70L4 84H14ZM28 70L34 84H24Z" fill="#e8553d"/>` +
    `<path d="M19 20C27 28 29 42 29 60V84H9V60C9 42 11 28 19 20Z" fill="#fff"/>` +
    `<path d="M19 20C23 24 26 29 27 34H11C12 29 15 24 19 20Z" fill="#e8553d"/>` +
    `<circle cx="19" cy="50" r="5" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M14 84C14 90 17 90 19 95C21 90 24 90 24 84Z" fill="#ff9f1a"/>` +
    `<path d="M4 90H96"/>`,
  체육관:
    `<rect x="4" y="4" width="92" height="66" fill="#dfe8f5"/>` +
    `<rect x="4" y="70" width="92" height="26" fill="#e8b777"/><path d="M4 82H96M30 70L24 96M70 70L76 96" stroke="#c98b4f" stroke-width="2.5"/>` +
    `<rect x="26" y="8" width="48" height="32" rx="2" fill="#fff"/><rect x="41" y="20" width="18" height="14" fill="none" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M40 42L43 60H57L60 42M44 42L48 60M56 42L52 60M42 51H58" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="42" rx="12" ry="3.5" stroke="#ff9f1a" stroke-width="4"/>` +
    `<circle cx="72" cy="72" r="15" fill="#ff9f1a"/>` +
    `<path d="M57 72H87M72 57V87M61 61Q67 72 61 83M83 61Q77 72 83 83" stroke-width="2.5"/>`,
  야구장:
    `<path d="M50 94L6 52C18 20 82 20 94 52Z" fill="#43b04a"/>` +
    `<path d="M50 90L74 66L50 42L26 66Z" fill="#d9a066"/>` +
    `<path d="M50 84L68 66L50 48L32 66Z" fill="#5fc24a" stroke="none"/>` +
    [
      [50, 88],
      [74, 66],
      [50, 44],
      [26, 66],
    ]
      .map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#fff" stroke-width="2" transform="rotate(45 ${x} ${y})"/>`)
      .join('') +
    `<circle cx="50" cy="66" r="5" fill="#d9a066" stroke-width="2"/>` +
    `<circle cx="80" cy="18" r="12" fill="#fff"/>` +
    `<path d="M72 10Q77 18 72 26M88 10Q83 18 88 26" stroke="#e8553d" stroke-width="2.5"/>` +
    tube('M10 30L32 8', '#e8a33a', 5),
  축구장:
    `<rect x="4" y="14" width="92" height="72" rx="3" fill="#43b04a"/>` +
    [16, 38, 60].map((x) => `<rect x="${x}" y="16" width="11" height="68" fill="#5fc24a" stroke="none"/>`).join('') +
    `<g stroke="#fff" stroke-width="3"><rect x="9" y="19" width="82" height="62"/><path d="M50 19V81"/><circle cx="50" cy="50" r="12"/><rect x="9" y="36" width="12" height="28"/><rect x="79" y="36" width="12" height="28"/></g>` +
    `<rect x="4" y="42" width="5" height="16" fill="#fff" stroke-width="2.5"/><rect x="91" y="42" width="5" height="16" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="50" cy="50" r="10" fill="#fff"/>` +
    `<path d="M50 45L54.8 48.5L53 54H47L45.2 48.5Z" fill="${INK}" stroke="none"/>`,
  스케이트장:
    `<rect x="4" y="30" width="92" height="64" rx="30" fill="#fff" stroke-width="3.5"/>` +
    `<rect x="10" y="36" width="80" height="52" rx="24" fill="#cdeeff"/>` +
    `<path d="M20 60Q34 50 46 58M58 78Q70 70 82 76M60 44Q70 40 78 46" stroke="#fff" stroke-width="3"/>` +
    `<path d="M30 14H52V44L74 50C82 52 82 64 74 64H30Z" fill="#fff"/>` +
    `<path d="M30 14H52V20H30Z" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M40 28H50M40 34H52M40 40H54" stroke="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M36 64V72M68 64V72" stroke-width="3"/>` +
    `<path d="M24 72H78C82 72 84 70 84 67" stroke="#8a96b0" stroke-width="5"/><path d="M24 72H78C82 72 84 70 84 67" stroke-width="1.5" opacity=".5"/>`,
  스키장:
    `<path d="M4 90L44 14L96 80V94H4Z" fill="#fff"/>` +
    `<path d="M44 14L52 50L40 70L60 94H96V80Z" fill="#dfe8f5" stroke="none"/>` +
    `<path d="M4 90L44 14L96 80"/>` +
    `<path d="M44 14L36 30L42 28L46 34L52 24Z" fill="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M8 82L88 16" stroke-width="2.5"/>` +
    [
      [30, 64],
      [52, 46],
      [74, 28],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x} ${y}V${y + 8}" stroke-width="2.5"/><path d="M${x - 6} ${y + 8}H${x + 6}V${y + 14}H${x - 6}Z" fill="#e8553d" stroke-width="2.5"/>`,
      )
      .join('') +
    `<path d="M76 70L90 64" stroke-width="3"/>` +
    person(82, 66, 0.55, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6', cap: '#ff9f1a' }) +
    `<path d="M72 72L94 62" stroke="#e8553d" stroke-width="3.5"/>` +
    blob('#3a9e47', [[14, 78, 5]]) +
    blob('#3a9e47', [[22, 84, 5]]),
  볼링장:
    `<path d="M34 6H66L88 96H12Z" fill="#8a96b0"/>` +
    `<path d="M38 6H62L80 96H20Z" fill="#e8b777"/>` +
    `<path d="M50 44V96M44 44L40 96M56 44L60 96" stroke="#c98b4f" stroke-width="2"/>` +
    pin(38, 36, 0.8) +
    pin(62, 36, 0.8) +
    pin(50, 30, 0.8) +
    pin(42, 48, 0.95) +
    pin(58, 48, 0.95) +
    `<circle cx="50" cy="76" r="16" fill="#3b78e6"/>` +
    dot(45, 69, 2.8) +
    dot(54, 69, 2.8) +
    dot(50, 77, 2.8),
  목욕탕:
    `<path d="M30 30C26 24 34 20 30 12M50 28C46 22 54 18 50 10M70 30C66 24 74 20 70 12" stroke="#a3aabb" stroke-width="3.5"/>` +
    `<circle cx="50" cy="52" r="15" fill="${SKIN}"/>` +
    `<path d="M36 44C36 34 64 34 64 44Z" fill="#fff"/><path d="M36 44H64" stroke-width="2.5"/>` +
    dot(44, 53, 2.3) +
    dot(56, 53, 2.3) +
    `<path d="M46 59q4 3 8 0" stroke-width="2.5"/>` +
    cheeks(58, 10) +
    `<rect x="8" y="58" width="84" height="34" rx="4" fill="#7ec8f0"/>` +
    `<path d="M10 62H90" stroke="#bfe6ff" stroke-width="4"/>` +
    `<path d="M8 76H92" stroke="#3b8fe0" stroke-width="2.5"/>` +
    `<rect x="8" y="58" width="84" height="34" rx="4"/>` +
    `<path d="M74 46H94L90 58H78Z" fill="#ffd23f"/>`,
  캠핑장:
    `<rect x="4" y="80" width="92" height="14" rx="3" fill="#8fd67a"/>` +
    tree(84, 50, 9, '#3a9e47') +
    tree(16, 44, 8, '#3a9e47') +
    `<path d="M52 82L72 44L92 82Z" fill="#43b04a"/><path d="M72 58L66 82H78Z" fill="#2c6b34"/>` +
    `<path d="M6 82L32 34L58 82Z" fill="#ff9f1a"/><path d="M32 52L24 82H40Z" fill="#5a3b24"/>` +
    `<path d="M40 92L58 84M40 84L58 92" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M49 86C41 82 43 72 49 66C50 72 55 72 55 78C55 84 52 86 49 86Z" fill="#ff9f1a"/>` +
    `<path d="M49 85C46 83 46 79 49 76C50 79 52 79 52 82C52 84 51 85 49 85Z" fill="#ffd23f" stroke="none"/>`,
  해수욕장:
    `<rect x="4" y="18" width="92" height="30" fill="#3b8fe0"/>` +
    waves(46, '#f2d58a') +
    `<circle cx="78" cy="30" r="8" fill="#ff5c70"/><circle cx="78" cy="30" r="3.5" fill="#3b8fe0"/>` +
    `<circle cx="20" cy="34" r="6" fill="${SKIN}" stroke-width="2.5"/><path d="M12 38q8 4 16 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M30 88V40" stroke-width="3.5"/>` +
    `<path d="M8 44C8 28 52 28 52 44Z" fill="#e8553d"/><path d="M22 44C22 32 38 32 38 44Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M70 88V54" stroke-width="3.5"/>` +
    `<path d="M50 58C50 44 90 44 90 58Z" fill="#43b04a"/><path d="M63 58C63 48 77 48 77 58Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="36" y="78" width="26" height="8" rx="3" fill="#3b78e6"/>` +
    `<circle cx="84" cy="80" r="7" fill="#fff"/><path d="M78 78Q84 82 90 78" stroke="#e8553d" stroke-width="2.5"/>`,
  모래사장:
    `<rect x="4" y="10" width="92" height="18" fill="#3b8fe0"/>` +
    waves(26, '#f2d58a') +
    `<path d="M14 84C18 66 42 62 50 84Z" fill="#e8c46a"/>` +
    `<path d="M58 60H84L80 86H62Z" fill="#ff5c70"/><path d="M58 60C60 50 82 50 84 60" stroke-width="3"/>` +
    `<path d="M56 60H86" stroke-width="4"/>` +
    tube('M40 46L28 72', '#43b04a', 3) +
    `<path d="M24 70L34 74L30 86L20 82Z" fill="#43b04a"/>` +
    [
      [16, 44],
      [24, 50],
      [70, 38],
      [78, 44],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="4" fill="#d9a066" stroke="none"/>`)
      .join('') +
    `<path d="M86 92C82 86 90 84 92 90Z" fill="#ff9aa8" stroke-width="2.5"/>`,
  무인도:
    `<circle cx="82" cy="16" r="8" fill="#ffd23f"/>` +
    `<rect x="4" y="44" width="92" height="52" fill="#3b8fe0"/>` +
    `<path d="M4 44q8-5 15 0t15 0t16 0t15 0t15 0t16 0" stroke="#fff" stroke-width="3"/>` +
    `<ellipse cx="50" cy="74" rx="34" ry="12" fill="#f2d58a"/>` +
    `<path d="M50 72C50 56 54 40 62 26" stroke-width="10"/><path d="M50 72C50 56 54 40 62 26" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M62 26C54 16 40 16 32 24C42 22 50 24 62 26Z" fill="#43b04a"/>` +
    `<path d="M62 26C70 14 84 14 90 22C80 22 72 24 62 26Z" fill="#43b04a"/>` +
    `<path d="M62 26C56 30 50 40 48 46C56 40 60 34 62 26Z" fill="#43b04a"/>` +
    `<path d="M62 26C70 30 78 38 80 46C72 40 66 34 62 26Z" fill="#43b04a"/>` +
    `<circle cx="58" cy="30" r="3.5" fill="#6b3e26" stroke-width="2"/><circle cx="64" cy="31" r="3.5" fill="#6b3e26" stroke-width="2"/>` +
    `<path d="M10 90q6-4 12 0M76 92q6-4 12 0" stroke="#fff" stroke-width="3"/>`,

  // ── 병원·학교 ──
  동물병원:
    `<rect x="62" y="6" width="30" height="24" rx="4" fill="#fff"/>` +
    cross(77, 18, 9, 3.5, '#e8553d', 2.5) +
    `<rect x="4" y="82" width="92" height="10" rx="3" fill="#dfe8f5"/>` +
    `<ellipse cx="44" cy="70" rx="24" ry="14" fill="#e8b777"/>` +
    `<path d="M24 66C18 60 14 64 16 70" stroke-width="4"/>` +
    `<path d="M26 22C16 22 12 40 18 48C24 46 28 36 28 28Z" fill="#9a5b2e"/><path d="M62 22C72 22 76 40 70 48C64 46 60 36 60 28Z" fill="#9a5b2e"/>` +
    `<circle cx="44" cy="42" r="21" fill="#e8b777"/>` +
    `<ellipse cx="44" cy="52" rx="9" ry="7" fill="#fff3d6" stroke-width="2.5"/>` +
    dot(36, 38) +
    dot(52, 38) +
    dot(44, 48, 3) +
    `<path d="M40 54q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M30 60C30 72 58 72 58 60" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M58 60C64 72 76 70 78 60" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<circle cx="78" cy="58" r="6" fill="#8a96b0"/>`,
  안과:
    `<rect x="24" y="4" width="52" height="64" rx="3" fill="#fff"/>` +
    `<path d="M32 20Q50 4 68 20Q50 36 32 20Z" fill="#fff" stroke-width="3"/>` +
    `<circle cx="50" cy="20" r="7" fill="#3b8fe0" stroke-width="2.5"/>` +
    dot(50, 20, 3) +
    [38, 50, 62].map((x) => dot(x, 42, 4.2, '#e8553d')).join('') +
    [34, 42, 50, 58, 66].map((x) => dot(x, 56, 2.8, '#3b78e6')).join('') +
    `<circle cx="30" cy="80" r="13" fill="#bfe6ff" stroke-width="5"/><circle cx="70" cy="80" r="13" fill="#bfe6ff" stroke-width="5"/>` +
    `<path d="M43 78Q50 72 57 78M17 78L6 72M83 78L94 72" stroke-width="5"/>`,
  병실:
    `<rect x="64" y="8" width="24" height="20" rx="3" fill="#fff"/>` +
    cross(76, 18, 7, 2.8, '#e8553d', 2) +
    `<path d="M18 30V88M88 56V88" stroke-width="5"/>` +
    `<rect x="12" y="62" width="80" height="12" rx="3" fill="#dfe8f5"/>` +
    `<rect x="18" y="48" width="22" height="14" rx="6" fill="#fff"/>` +
    `<circle cx="30" cy="44" r="10" fill="${SKIN}"/>` +
    `<path d="M20 42C20 32 40 32 40 42C36 38 26 38 20 42Z" fill="#5a3b24"/>` +
    `<path d="M26 46q2-2 4 0M32 46q2-2 4 0" stroke-width="2"/>` +
    `<path d="M38 54C40 48 50 46 86 50V64H38Z" fill="#7ec8f0"/>` +
    `<path d="M50 50V64M62 50V64M74 50V64" stroke="#bfe6ff" stroke-width="3"/>` +
    `<rect x="12" y="24" width="12" height="10" rx="3" fill="#8a96b0"/>` +
    wheel(24, 90, 4) +
    wheel(82, 90, 4),
  보건실:
    `<rect x="4" y="8" width="92" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M8 14C12 36 6 58 10 80H34C30 58 36 36 30 14Z" fill="#bfe6ff"/>` +
    `<path d="M18 16C20 36 16 58 20 78" stroke="#7ec8f0" stroke-width="3"/>` +
    `<rect x="36" y="52" width="58" height="10" rx="3" fill="#fff"/><rect x="38" y="44" width="18" height="10" rx="4" fill="#fff"/>` +
    `<path d="M40 62V74M90 62V74" stroke-width="4"/>` +
    `<path d="M50 40C50 36 52 34 56 34H70C74 34 76 36 76 40" stroke-width="5"/>` +
    `<rect x="34" y="40" width="50" height="40" rx="5" fill="#fff"/>` +
    cross(59, 60, 12, 5, '#e8553d', 3) +
    `<g transform="rotate(-30 80 86)"><rect x="66" y="80" width="28" height="11" rx="5" fill="#f2c8a0"/><rect x="75" y="81.5" width="10" height="8" rx="1" fill="#fff3d6" stroke-width="2"/></g>` +
    `<path d="M4 92H96"/>`,
  급식실:
    `<rect x="6" y="18" width="88" height="68" rx="8" fill="#dfe8f5"/>` +
    `<rect x="12" y="24" width="34" height="28" rx="6" fill="#fff"/>` +
    blob('#fff', [
      [22, 38, 6],
      [30, 36, 7],
      [37, 39, 6],
    ]) +
    `<rect x="52" y="24" width="36" height="28" rx="6" fill="#ffc98a"/>` +
    `<path d="M58 34q5-4 10 0t10 0" stroke="#e8553d" stroke-width="3"/><circle cx="64" cy="42" r="3" fill="#43b04a" stroke-width="2"/><circle cx="76" cy="40" r="3" fill="#fff" stroke-width="2"/>` +
    `<rect x="12" y="58" width="22" height="22" rx="5" fill="#5fc24a"/>` +
    `<rect x="39" y="58" width="22" height="22" rx="5" fill="#ff9f1a"/>` +
    `<rect x="66" y="58" width="22" height="22" rx="5" fill="#e8553d"/>` +
    `<path d="M17 64L28 74M28 64L18 74" stroke="#2c6b34" stroke-width="2.5"/>` +
    dot(45, 66, 3, '#fff3d6') +
    dot(54, 70, 3, '#fff3d6') +
    dot(47, 74, 3, '#fff3d6') +
    `<path d="M72 64H82M72 70H82M72 76H82" stroke="#fff" stroke-width="2.5"/>` +
    tube('M20 94L60 90', '#a3aabb', 2.5) +
    tube('M64 94L92 88', '#a3aabb', 2.5),
  과학실:
    `<rect x="4" y="84" width="92" height="10" rx="2" fill="#9a5b2e"/>` +
    `<path d="M24 16H40V40L54 74C56 80 52 84 46 84H18C12 84 8 80 10 74L24 40Z" fill="#fff"/>` +
    `<path d="M17 58H47L54 74C56 80 52 84 46 84H18C12 84 8 80 10 74Z" fill="#5fc24a"/>` +
    `<path d="M24 16H40V40L54 74C56 80 52 84 46 84H18C12 84 8 80 10 74L24 40Z"/>` +
    `<rect x="21" y="12" width="22" height="6" rx="2" fill="#dfe8f5"/>` +
    `<circle cx="26" cy="70" r="3.5" fill="#fff" stroke-width="2"/><circle cx="38" cy="74" r="2.5" fill="#fff" stroke-width="2"/><circle cx="32" cy="48" r="3" fill="#bfe6ff" stroke-width="2"/><circle cx="30" cy="34" r="2.5" fill="#bfe6ff" stroke-width="2"/>` +
    `<rect x="58" y="60" width="36" height="8" rx="2" fill="#e8b777"/>` +
    [64, 76, 88]
      .map(
        (x, i) =>
          `<path d="M${x - 4} 34V76C${x - 4} 82 ${x + 4} 82 ${x + 4} 76V34Z" fill="#fff"/>` +
          `<path d="M${x - 4} ${56 - i * 6}V76C${x - 4} 82 ${x + 4} 82 ${x + 4} 76V${56 - i * 6}Z" fill="${['#3b8fe0', '#ff5c70', '#ffd23f'][i]}"/>`,
      )
      .join('') +
    `<path d="M58 84V68M94 84V68" stroke-width="3"/>`,
  음악실:
    note(16, 30, '#8e4fc9') +
    note(78, 20, '#3b78e6') +
    `<rect x="18" y="38" width="64" height="42" rx="3" fill="#6b3e26"/>` +
    `<rect x="12" y="56" width="76" height="10" rx="2" fill="#fff"/>` +
    [21, 30, 39, 48, 57, 66, 75].map((x) => `<path d="M${x + 1} 56V66" stroke-width="2"/>`).join('') +
    [25, 34, 52, 61, 70].map((x) => `<rect x="${x - 2}" y="56" width="5" height="6" fill="${INK}" stroke="none"/>`).join('') +
    `<rect x="26" y="42" width="48" height="8" rx="2" fill="#fff3d6" stroke-width="2.5"/>` +
    `<path d="M22 80V92M78 80V92" stroke-width="5"/>` +
    `<ellipse cx="86" cy="76" rx="10" ry="4" fill="#fff"/><path d="M76 76V90C76 94 96 94 96 90V76" fill="#e8553d"/><ellipse cx="86" cy="76" rx="10" ry="4" fill="#fff"/>` +
    `<path d="M80 60L86 72M94 60L88 72" stroke="#9a5b2e" stroke-width="3"/>`,

  // ── 집·건물 둘레 ──
  아파트:
    `<rect x="12" y="10" width="36" height="82" fill="#ffe7a8"/>` +
    `<rect x="54" y="24" width="34" height="68" fill="#bfe6ff"/>` +
    [16, 26, 36, 46, 56, 66, 76]
      .map(
        (y) =>
          `<rect x="17" y="${y}" width="10" height="6" fill="#3b8fe0" stroke-width="2"/><rect x="33" y="${y}" width="10" height="6" fill="#3b8fe0" stroke-width="2"/>`,
      )
      .join('') +
    [30, 40, 50, 60, 70]
      .map(
        (y) =>
          `<rect x="59" y="${y}" width="10" height="6" fill="#fff" stroke-width="2"/><rect x="73" y="${y}" width="10" height="6" fill="#fff" stroke-width="2"/>`,
      )
      .join('') +
    `<rect x="24" y="84" width="12" height="8" fill="#9a5b2e" stroke-width="2.5"/><rect x="64" y="82" width="14" height="10" fill="#9a5b2e" stroke-width="2.5"/>` +
    blob('#43b04a', [[8, 86, 5]]) +
    blob('#43b04a', [[93, 86, 4]]) +
    `<path d="M4 92H96"/>`,
  공중전화:
    `<rect x="18" y="14" width="64" height="80" rx="3" fill="#bfe6ff"/>` +
    `<rect x="14" y="6" width="72" height="10" rx="3" fill="#e8553d"/>` +
    `<path d="M18 16V94M82 16V94" stroke="#e8553d" stroke-width="6"/>` +
    `<rect x="32" y="26" width="36" height="50" rx="4" fill="#8a96b0"/>` +
    `<rect x="38" y="32" width="24" height="9" rx="2" fill="#dff5d6" stroke-width="2.5"/>` +
    [0, 1, 2].map((r) => [0, 1, 2].map((c) => dot(44 + c * 6, 50 + r * 6, 2, '#fff')).join('')).join('') +
    tube('M36 48C24 48 24 70 36 70', '#3b78e6', 5) +
    `<path d="M36 70C40 80 48 76 54 72" stroke-width="2.5"/>`,
  매표소:
    `<path d="M10 26H90L86 38H14Z" fill="#fff"/>` +
    [18, 34, 50, 66].map((x) => `<path d="M${x} 26H${x + 8}L${x + 7} 38H${x - 1}Z" fill="#e8553d" stroke="none"/>`).join('') +
    `<path d="M10 26H90L86 38H14Z"/>` +
    `<path d="M10 26L20 12H80L90 26" fill="#e8553d"/>` +
    `<rect x="14" y="38" width="72" height="54" fill="#ffe7a8"/>` +
    `<rect x="24" y="44" width="52" height="26" rx="10" fill="#bfe6ff"/>` +
    person(50, 72, 0.7, { hair: '#5a3b24', style: 'long', shirt: '#43b04a' }) +
    `<rect x="18" y="70" width="64" height="8" fill="#9a5b2e"/>` +
    `<g transform="rotate(-12 50 84)"><path d="M28 76H72V80A4 4 0 0 0 72 88V92H28V88A4 4 0 0 0 28 80Z" fill="#ffd23f"/><path d="M60 77V91" stroke-width="2" stroke-dasharray="3 3"/></g>`,
  승강장:
    `<rect x="4" y="8" width="92" height="6" rx="2" fill="#8a96b0"/><path d="M14 14V60M86 14V60" stroke-width="4"/>` +
    `<rect x="4" y="22" width="92" height="40" rx="4" fill="#dfe8f5"/>` +
    `<rect x="4" y="46" width="92" height="5" fill="#43b04a" stroke="none"/>` +
    [10, 30, 64, 82].map((x) => `<rect x="${x}" y="28" width="12" height="12" rx="2" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<rect x="44" y="26" width="14" height="34" fill="#8fd3ff" stroke-width="2.5"/><path d="M51 26V60" stroke-width="2"/>` +
    `<rect x="4" y="22" width="92" height="40" rx="4"/>` +
    `<rect x="4" y="62" width="92" height="34" fill="#c9ccd6"/>` +
    `<rect x="4" y="66" width="92" height="7" fill="#ffd23f"/>` +
    [10, 22, 34, 46, 58, 70, 82, 94].map((x) => dot(x, 69.5, 1.4, '#e8a33a')).join('') +
    person(70, 94, 0.85, { hair: '#2f2a26', style: 'short', shirt: '#e8553d' }),
  굴뚝:
    blob('#dfe8f5', [
      [58, 24, 7],
      [68, 16, 9],
      [82, 12, 7],
    ]) +
    `<rect x="36" y="30" width="28" height="44" fill="#c9553d"/>` +
    `<path d="M36 42H64M36 54H64M36 66H64M46 30V42M56 42V54M46 54V66M56 66V74" stroke="#8a3a2a" stroke-width="2.5"/>` +
    `<rect x="36" y="30" width="28" height="44"/>` +
    `<rect x="32" y="24" width="36" height="8" rx="2" fill="#8a96b0"/>` +
    `<path d="M4 82L50 60L96 82V94H4Z" fill="#3b78e6"/>` +
    `<path d="M4 82L50 60L96 82" stroke-width="5"/>`,
  대문:
    `<path d="M4 36C18 30 32 26 50 26S82 30 96 36L90 42H10Z" fill="#4a4f66"/>` +
    `<path d="M20 26C28 18 40 16 50 16S72 18 80 26" fill="#4a4f66"/>` +
    `<rect x="14" y="42" width="72" height="6" fill="#9a5b2e"/>` +
    `<rect x="14" y="48" width="8" height="42" fill="#9a5b2e"/><rect x="78" y="48" width="8" height="42" fill="#9a5b2e"/>` +
    `<rect x="22" y="48" width="28" height="42" fill="#e8a33a"/><rect x="50" y="48" width="28" height="42" fill="#e8a33a"/>` +
    `<path d="M22 62H50M22 76H50M50 62H78M50 76H78" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<circle cx="44" cy="68" r="4.5" fill="#ffc933" stroke-width="2.5"/><circle cx="56" cy="68" r="4.5" fill="#ffc933" stroke-width="2.5"/>` +
    `<rect x="10" y="90" width="80" height="6" rx="2" fill="#a3aabb"/>`,
  담장:
    `<rect x="4" y="30" width="92" height="8" rx="2" fill="#4a4f66"/>` +
    `<path d="M4 30C20 24 80 24 96 30" fill="#4a4f66"/>` +
    `<rect x="6" y="38" width="88" height="54" fill="#d9c8a8"/>` +
    [
      [16, 48, 9, 7, '#c9b79c'],
      [36, 46, 10, 7, '#e8dcc4'],
      [58, 48, 10, 7, '#b8a88a'],
      [80, 46, 10, 7, '#e8dcc4'],
      [24, 64, 10, 7, '#e8dcc4'],
      [46, 64, 10, 7, '#c9b79c'],
      [68, 64, 10, 7, '#e8dcc4'],
      [88, 64, 6, 7, '#c9b79c'],
      [12, 81, 7, 7, '#b8a88a'],
      [32, 81, 11, 7, '#c9b79c'],
      [56, 81, 11, 7, '#e8dcc4'],
      [80, 81, 11, 7, '#b8a88a'],
    ]
      .map(([x, y, rx, ry, c]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
    `<rect x="6" y="38" width="88" height="54"/>` +
    tree(72, 26, 8) +
    `<path d="M4 92H96"/>`,
  울타리:
    `<rect x="4" y="82" width="92" height="12" rx="3" fill="#8fd67a"/>` +
    `<rect x="4" y="44" width="92" height="7" fill="#fff"/><rect x="4" y="66" width="92" height="7" fill="#fff"/>` +
    [8, 25, 42, 59, 76]
      .map((x) => `<path d="M${x} 88V30L${x + 7.5} 20L${x + 15} 30V88Z" fill="#fff"/>`)
      .join('') +
    `<path d="M4 88H96" stroke-width="3"/>`,
  장승:
    `<path d="M4 92H96"/>` +
    [
      [30, '#4a4f66', '#e8553d'],
      [70, '#9a5b2e', '#3b78e6'],
    ]
      .map(([xx, hat, band]) => {
        const x = xx as number;
        return (
          `<rect x="${x - 13}" y="22" width="26" height="70" rx="6" fill="#e8b777"/>` +
          `<path d="M${x - 18} 24C${x - 18} 10 ${x + 18} 10 ${x + 18} 24Z" fill="${hat}"/><path d="M${x - 20} 24H${x + 20}" stroke-width="4"/>` +
          `<circle cx="${x - 6}" cy="36" r="5" fill="#fff" stroke-width="2.5"/><circle cx="${x + 6}" cy="36" r="5" fill="#fff" stroke-width="2.5"/>` +
          dot(x - 6, 37, 2.4) +
          dot(x + 6, 37, 2.4) +
          `<path d="M${x - 3} 42q3 6 6 0" stroke-width="2.5"/>` +
          `<path d="M${x - 8} 50Q${x} 60 ${x + 8} 50Z" fill="#fff" stroke-width="2.5"/>` +
          `<rect x="${x - 13}" y="64" width="26" height="9" fill="${band}" stroke-width="2.5"/>`
        );
      })
      .join(''),
  물레방아:
    `<rect x="60" y="30" width="34" height="50" fill="#fff3d6"/><path d="M56 32L77 12L96 32Z" fill="#c98b4f"/>` +
    `<rect x="70" y="56" width="12" height="24" fill="#9a5b2e" stroke-width="2.5"/>` +
    waves(80, '#7ec8f0') +
    `<path d="M4 14H40L42 20H4Z" fill="#9a5b2e"/>` +
    `<path d="M40 18C44 24 44 30 42 34" stroke="#4aa8f0" stroke-width="6"/>` +
    `<circle cx="40" cy="58" r="28" fill="#c98b4f"/>` +
    `<circle cx="40" cy="58" r="20" fill="#e8b777"/>` +
    [0, 45, 90, 135]
      .map((a) => `<path d="M40 58L${(40 + 20 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(58 + 20 * Math.sin((a * Math.PI) / 180)).toFixed(1)}M40 58L${(40 - 20 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(58 - 20 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" stroke="#9a5b2e" stroke-width="3"/>`)
      .join('') +
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        return `<path d="M${(40 + 20 * Math.cos(t)).toFixed(1)} ${(58 + 20 * Math.sin(t)).toFixed(1)}L${(40 + 30 * Math.cos(t)).toFixed(1)} ${(58 + 30 * Math.sin(t)).toFixed(1)}" stroke-width="3"/>`;
      })
      .join('') +
    `<circle cx="40" cy="58" r="6" fill="#6b3e26"/>` +
    drop(20, 26, 0.7) +
    drop(58, 30, 0.7),
  비상구:
    `<rect x="6" y="18" width="88" height="64" rx="6" fill="#3a9e47"/>` +
    `<path d="M62 26H84V74H62Z" fill="#fff"/>` +
    `<path d="M66 30L78 34V70L66 74Z" fill="#3a9e47" stroke="none"/>` +
    `<g stroke="#fff" stroke-width="6"><path d="M38 38L30 56M38 38L50 46L56 42M34 46L22 44M30 56L40 64L38 74M30 56L20 66L12 64"/></g>` +
    `<circle cx="42" cy="28" r="6" fill="#fff" stroke="none"/>` +
    `<path d="M14 28H26M20 22L26 28L20 34" stroke="#fff" stroke-width="4"/>`,
};
