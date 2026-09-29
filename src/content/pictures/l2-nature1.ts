// 그림 묶음: 7~8세 자연·날씨 (비·눈·달·별·행성·땅과 물의 모습·보석). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 소나기는 해가 비치는 구름에서 굵은 비, 장마는 넓은 먹구름·빽빽한 비·우산·웅덩이.
// 달은 모양으로(초승달 가는 눈썹, 반달 반쪽, 보름달 동그라미). 소용돌이는 물(파란 물 위 소용돌이), 회오리바람은 땅 위 깔때기.
import { HL, dot, blob, sparkle, tube, drop } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);
const NIGHT = '#26356b';

/** 밤하늘 네모 바탕 */
const night = (fill = NIGHT) => `<rect x="5" y="5" width="90" height="90" rx="14" fill="${fill}"/>`;
/** 낮 하늘 네모 바탕 (위만 칠하고 아래는 그림이 덮는다) */
const sky = (fill = '#bfe6ff') => `<rect x="5" y="5" width="90" height="90" rx="14" fill="${fill}"/>`;
/** 바탕 테두리를 다시 그어 가장자리를 깔끔하게 */
const frame = () => `<rect x="5" y="5" width="90" height="90" rx="14"/>`;

/** 5각 별 */
function star(x: number, y: number, r: number, fill = '#ffd23f', sw = 2.5): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

/** 밤하늘의 작은 반짝이 여럿 */
const twinkles = (pts: [number, number, number][]) => pts.map(([x, y, r]) => sparkle(x, y, r, '#fff')).join('');

/** 눈송이 (여섯 갈래, 흰 선에 테두리) */
function flake(x: number, y: number, r: number, w = 4): string {
  let d = '';
  for (let k = 0; k < 3; k++) {
    const a = (k * Math.PI) / 3 + Math.PI / 2;
    const dx = r * Math.cos(a);
    const dy = r * Math.sin(a);
    d += `M${f1(x - dx)} ${f1(y - dy)}L${f1(x + dx)} ${f1(y + dy)}`;
  }
  if (r >= 10) {
    // 갈래 끝의 작은 V
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + Math.PI / 2;
      const px = x + r * 0.6 * Math.cos(a);
      const py = y + r * 0.6 * Math.sin(a);
      const t = r * 0.35;
      for (const s of [-1, 1]) {
        const b = a + s * 0.9;
        d += `M${f1(px)} ${f1(py)}L${f1(px + t * Math.cos(b))} ${f1(py + t * Math.sin(b))}`;
      }
    }
  }
  return tube(d, '#fff', w);
}

/** 빗줄기 (비스듬한 굵은 선) */
const streaks = (pts: [number, number][], len = 14, fill = '#4aa8f0', w = 4) =>
  pts.map(([x, y]) => tube(`M${x} ${y}L${x - len * 0.35} ${y + len}`, fill, w)).join('');

/** 나선 선 (cx, cy 가운데, r0→r1, 감는 수, 세로 납작 sy) */
function spiralD(cx: number, cy: number, r0: number, r1: number, turns: number, sy = 1, a0 = 0): string {
  const steps = Math.round(turns * 40);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = a0 + (i / steps) * turns * 2 * Math.PI;
    const r = r0 + ((r1 - r0) * i) / steps;
    pts.push(`${f1(cx + r * Math.cos(t))} ${f1(cy + r * sy * Math.sin(t))}`);
  }
  return `M${pts.join('L')}`;
}

/** 동그라미 안 가로 띠 (y1~y2), 테두리 없이 */
function band(cx: number, cy: number, r: number, y1: number, y2: number, fill: string): string {
  const hx = (y: number) => Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
  const [a, b] = [hx(y1), hx(y2)];
  return (
    `<path d="M${f1(cx - a)} ${y1}L${f1(cx + a)} ${y1}A${r} ${r} 0 0 1 ${f1(cx + b)} ${y2}` +
    `L${f1(cx - b)} ${y2}A${r} ${r} 0 0 1 ${f1(cx - a)} ${y1}Z" fill="${fill}" stroke="none"/>`
  );
}

/** 잎 (x, y 꼭지, 길이 방향 rot도, 크기 s) */
function leaf(x: number, y: number, rot: number, s: number, fill = '#43b04a'): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="M0 0C10 -18 40 -20 60 0C40 20 10 18 0 0Z" fill="${fill}" stroke-width="${f1(3.5 / s)}"/>` +
    `<path d="M4 0H52" stroke="#2a7a34" stroke-width="${f1(3 / s)}"/>` +
    `</g>`
  );
}

/** 구름 */
const cloud = (fill: string, cs: [number, number, number][]) => blob(fill, cs);

/** 해 (얼굴 없이): 빛살 + 동그라미 */
function sunDisc(x: number, y: number, r: number, n = 8): string {
  const rays = Array.from({ length: n }, (_, k) => {
    const a = (k * 2 * Math.PI) / n;
    const p = (d: number) => `${f1(x + d * Math.cos(a))} ${f1(y + d * Math.sin(a))}`;
    return `<path d="M${p(r + 5)}L${p(r + 13)}"/>`;
  }).join('');
  return `<g stroke="#ff9f1a" stroke-width="5">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd23f"/>`;
}

/** 자갈 한 알 */
const pebble = (x: number, y: number, rx: number, ry: number, fill: string, rot = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${rot} ${x} ${y})"/>`;

/** 물 위 파도 줄 (y 높이, 한 물결 너비 w) */
function waveRow(y: number, fill: string, w = 15, h = 6): string {
  let d = `M5 ${y}`;
  for (let x = 5; x < 95; x += w) d += `q${w / 4} ${-h} ${w / 2} 0t${w / 2} 0`;
  return `<path d="${d}V95H5Z" fill="${fill}"/>`;
}

export const PICS: Record<string, string> = {
  // ── 비·눈·얼음 ──
  소나기:
    sunDisc(70, 26, 14) +
    cloud('#9aa6c4', [
      [24, 42, 13],
      [40, 34, 16],
      [58, 42, 13],
      [40, 48, 12],
    ]) +
    streaks(
      [
        [22, 60],
        [36, 62],
        [50, 60],
        [64, 62],
        [28, 80],
        [44, 82],
        [58, 80],
      ],
      13,
      '#3b8fe0',
      5,
    ),
  장마:
    cloud('#6f7c9c', [
      [16, 20, 11],
      [32, 16, 13],
      [50, 18, 13],
      [68, 16, 13],
      [84, 20, 11],
      [50, 26, 12],
      [26, 26, 10],
      [74, 26, 10],
    ]) +
    `<ellipse cx="50" cy="88" rx="42" ry="7" fill="#7ec8f0"/>` +
    `<path d="M36 88q4-3 8 0M58 90q4-3 8 0" stroke="#fff" stroke-width="2.5"/>` +
    streaks(
      [
        [12, 42],
        [22, 50],
        [84, 44],
        [92, 58],
        [14, 64],
        [84, 68],
        [30, 38],
        [72, 38],
      ],
      12,
      '#3b8fe0',
      3.5,
    ) +
    // 우산
    tube('M50 54V78Q50 84 44 84Q40 84 40 80', '#6b3e26', 3.5) +
    `<path d="M24 56C24 40 36 32 50 32S76 40 76 56C72 52 66 52 63 56C60 52 54 52 50 56C46 52 40 52 37 56C34 52 28 52 24 56Z" fill="#ffd23f"/>` +
    `<path d="M50 32C44 40 40 48 37 56M50 32C56 40 60 48 63 56" stroke-width="2.5"/>`,
  함박눈:
    sky('#8fc8f0') +
    `<path d="M5 78C24 70 40 74 56 78S84 74 95 76V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#fff"/>` +
    flake(30, 28, 15, 5) +
    flake(70, 40, 16, 5) +
    flake(38, 62, 12, 4) +
    flake(76, 14, 6, 3) +
    flake(14, 52, 6, 3) +
    flake(62, 68, 6, 3) +
    frame(),
  눈보라:
    sky('#9fb4d6') +
    tube('M8 30H56C68 30 70 18 62 16', '#fff', 5) +
    tube('M14 52H80C90 52 92 40 84 38', '#fff', 5) +
    tube('M8 74H60C70 74 72 84 64 86', '#fff', 5) +
    [
      [26, 20],
      [76, 26],
      [44, 42],
      [22, 62],
      [66, 64],
      [86, 76],
      [38, 86],
      [80, 88],
    ]
      .map(([x, y]) => flake(x, y, 5.5, 3))
      .join('') +
    frame(),
  우박:
    cloud('#8a96b0', [
      [26, 30, 14],
      [46, 22, 17],
      [66, 30, 14],
      [46, 36, 13],
    ]) +
    `<path d="M6 88H94"/>` +
    [
      [26, 56, 6],
      [48, 62, 7],
      [70, 54, 6],
      [36, 76, 6],
      [60, 78, 6.5],
      [20, 82, 5],
      [82, 82, 5],
      [48, 82, 5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#eaf6ff"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.3, '#fff'))
      .join('') +
    `<path d="M20 72V66M82 72V66M48 72V70" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M66 70l4-4M76 60l4-4M30 48l-4-4" stroke="#9aa6c4" stroke-width="2.5"/>`,
  서리:
    sky('#dfeefc') +
    leaf(10, 74, -40, 1.25, '#5fae5a') +
    // 잎 가장자리 흰 서리
    `<path d="M16 66C26 44 48 32 72 28" stroke="#fff" stroke-width="5" stroke-dasharray="3 5"/>` +
    `<path d="M24 80C42 76 58 64 68 44" stroke="#fff" stroke-width="5" stroke-dasharray="3 5"/>` +
    flake(40, 44, 7, 3) +
    flake(56, 60, 7, 3) +
    flake(82, 76, 8, 3) +
    flake(22, 22, 8, 3) +
    sparkle(76, 20, 6, '#fff') +
    sparkle(30, 58, 5, '#fff') +
    frame(),
  이슬:
    sky('#e6f7e0') +
    `<path d="M14 86C8 50 36 18 88 12C92 52 64 88 14 86Z" fill="#5fc24a"/>` +
    `<path d="M14 86L78 24M34 66L30 48M34 66L52 70M52 48L50 32M52 48L70 52" stroke="#2f8a3a" stroke-width="3"/>` +
    [
      [42, 58, 8],
      [64, 40, 7],
      [30, 76, 5.5],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fdcff"/>` + dot(x - r * 0.3, y - r * 0.35, r * 0.35, '#fff'))
      .join('') +
    // 잎끝에 매달린 물방울
    drop(88, 16, 1.3) +
    dot(86, 25, 1.6, '#fff') +
    frame(),
  얼음판:
    sky('#e6f3ff') +
    // 뒤 나무
    `<path d="M16 42L26 16L36 42Z" fill="#3a9e47"/><path d="M64 40L74 12L84 40Z" fill="#3a9e47"/>` +
    `<path d="M21.5 28L26 16L30.5 28L28 26L26 29L24 26Z" fill="#fff"/><path d="M69.5 24L74 12L78.5 24L76 22L74 25L72 22Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="66" rx="46" ry="24" fill="#fff"/>` +
    `<ellipse cx="50" cy="66" rx="38" ry="17" fill="#c4ecff"/>` +
    `<path d="M22 64L36 55M58 78L78 65M44 58L52 54" stroke="#fff" stroke-width="5"/>` +
    // 스케이트 자국
    `<path d="M30 72C40 78 56 78 60 70C64 62 52 60 50 66C48 72 60 76 72 72" stroke="#5aa7e8" stroke-width="2.5"/>` +
    sparkle(70, 58, 6, '#fff') +
    sparkle(30, 62, 4, '#fff') +
    frame(),
  햇빛:
    // 비스듬한 햇살 띠
    `<path d="M24 24L60 94H86Z" fill="#fff1b8" stroke="none"/><path d="M24 24L94 60V84Z" fill="#fff1b8" stroke="none"/><path d="M24 24L14 94H34Z" fill="#fff1b8" stroke="none"/>` +
    `<path d="M28 34L66 88M34 28L90 70M22 36L22 88" stroke="${HL}" stroke-width="3" stroke-dasharray="6 6"/>` +
    sunDisc(24, 24, 15) +
    `<path d="M6 92H94"/>` +
    // 새싹과 꽃
    tube('M70 92V70', '#43b04a', 4) +
    `<path d="M70 80C62 80 56 74 56 68C64 68 70 74 70 80Z" fill="#5fc24a"/><path d="M70 76C78 76 84 70 84 64C76 64 70 70 70 76Z" fill="#5fc24a"/>` +
    [0, 72, 144, 216, 288]
      .map((a) => {
        const r = (a * Math.PI) / 180;
        return `<circle cx="${f1(70 + 7 * Math.cos(r))}" cy="${f1(62 + 7 * Math.sin(r))}" r="5.5" fill="#ff5c70"/>`;
      })
      .join('') +
    `<circle cx="70" cy="62" r="4.5" fill="#ffd23f"/>` +
    sparkle(46, 74, 5) +
    sparkle(86, 46, 5),

  // ── 달·별·하늘 너머 ──
  초승달:
    night() +
    `<path d="M56 14A36 36 0 1 0 56 86A26 36 0 0 1 56 14Z" fill="#ffd23f"/>` +
    twinkles([
      [74, 30, 5],
      [80, 66, 4],
      [66, 84, 3],
      [16, 16, 3],
    ]),
  반달:
    night() +
    `<path d="M46 14A36 36 0 0 1 46 86Z" fill="#ffd23f"/>` +
    dot(58, 34, 4, '#f2c14e') +
    dot(66, 56, 5, '#f2c14e') +
    dot(54, 70, 3.5, '#f2c14e') +
    twinkles([
      [22, 26, 5],
      [18, 66, 4],
      [32, 84, 3],
      [86, 16, 3],
    ]),
  보름달:
    night() +
    `<circle cx="50" cy="50" r="34" fill="#ffd23f"/>` +
    `<circle cx="38" cy="40" r="7" fill="#f2c14e" stroke-width="2.5"/>` +
    `<circle cx="62" cy="58" r="9" fill="#f2c14e" stroke-width="2.5"/>` +
    `<circle cx="42" cy="66" r="4.5" fill="#f2c14e" stroke-width="2.5"/>` +
    `<circle cx="62" cy="34" r="3.5" fill="#f2c14e" stroke-width="2.5"/>` +
    twinkles([
      [14, 14, 3.5],
      [88, 86, 3.5],
      [88, 16, 3],
    ]),
  은하수:
    night('#1f2a5a') +
    `<path d="M5 78C30 62 58 44 95 18V44C64 60 36 78 12 95H5Z" fill="#4b5aa8" stroke="none"/>` +
    `<path d="M5 86C30 70 58 50 95 28V36C62 56 36 74 8 92Z" fill="#8f9de0" stroke="none"/>` +
    [
      [16, 80, 2.4],
      [26, 72, 2],
      [34, 70, 2.6],
      [44, 60, 2],
      [52, 58, 2.4],
      [60, 50, 2],
      [70, 44, 2.6],
      [78, 36, 2],
      [86, 32, 2.4],
      [30, 80, 1.8],
      [58, 42, 1.8],
      [82, 42, 1.8],
    ]
      .map(([x, y, r]) => dot(x, y, r, '#fff'))
      .join('') +
    sparkle(40, 66, 5, '#fff') +
    sparkle(66, 48, 5, '#fff') +
    sparkle(22, 24, 5, '#ffd23f') +
    sparkle(80, 76, 5, '#ffd23f') +
    frame(),
  북두칠성: (() => {
    const s: [number, number][] = [
      [14, 20],
      [28, 28],
      [40, 38],
      [52, 48],
      [54, 74],
      [84, 78],
      [86, 52],
    ];
    const line = `M${s[0].join(' ')}L${s[1].join(' ')}L${s[2].join(' ')}L${s[3].join(' ')}L${s[4].join(' ')}L${s[5].join(' ')}L${s[6].join(' ')}L${s[3].join(' ')}`;
    return (
      night() +
      `<path d="${line}" stroke="#9fb0e8" stroke-width="2.5" stroke-dasharray="4 4"/>` +
      s.map(([x, y]) => star(x, y, 9)).join('') +
      twinkles([
        [74, 20, 3.5],
        [22, 80, 3.5],
      ])
    );
  })(),
  혜성:
    night() +
    // 꼬리 (넓게 퍼지며 흐려짐)
    `<path d="M26 66C44 44 64 22 92 8L95 30C72 36 50 56 34 76Z" fill="#6f86d6" stroke="none"/>` +
    `<path d="M28 66C46 48 66 30 92 18V26C68 34 50 54 34 72Z" fill="#b8d8ff" stroke="none"/>` +
    `<circle cx="28" cy="72" r="12" fill="#e6f6ff"/>` +
    `<circle cx="28" cy="72" r="6" fill="#fff" stroke="none"/>` +
    twinkles([
      [16, 20, 4],
      [80, 80, 4],
      [56, 84, 3],
    ]),
  유성:
    night() +
    [
      [70, 22, 24],
      [58, 52, 16],
      [84, 62, 12],
    ]
      .map(([x, y, len]) => tube(`M${x} ${y}L${x - len} ${y + len * 0.8}`, '#ffb35c', len > 20 ? 5 : 4) + `<circle cx="${x}" cy="${y}" r="${len > 20 ? 6 : 4.5}" fill="#ffd23f"/>`)
      .join('') +
    tube('M30 30L10 46', '#ffd23f', 2.5) +
    `<circle cx="30" cy="30" r="3.5" fill="#fff"/>` +
    twinkles([
      [20, 72, 4],
      [44, 16, 3],
      [40, 86, 3],
    ]),
  화성:
    night() +
    `<circle cx="50" cy="52" r="34" fill="#e8653d"/>` +
    band(50, 52, 34, 58, 70, '#c9492e') +
    `<path d="M34 24C42 20 58 20 66 24C60 28 40 28 34 24Z" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="36" cy="44" r="5" fill="#c9492e" stroke-width="2.5"/>` +
    `<circle cx="64" cy="46" r="6.5" fill="#c9492e" stroke-width="2.5"/>` +
    `<circle cx="48" cy="76" r="4" fill="#ff8a5c" stroke-width="2.5"/>` +
    `<circle cx="50" cy="52" r="34"/>` +
    twinkles([
      [14, 16, 3.5],
      [88, 86, 3.5],
    ]),
  목성:
    night() +
    `<circle cx="50" cy="50" r="38" fill="#f5deb3"/>` +
    band(50, 50, 38, 22, 30, '#c98b4f') +
    band(50, 50, 38, 38, 46, '#e8a15c') +
    band(50, 50, 38, 54, 62, '#c98b4f') +
    band(50, 50, 38, 72, 78, '#e8a15c') +
    `<ellipse cx="62" cy="64" rx="9" ry="6" fill="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="50" cy="50" r="38"/>`,
  토성:
    night() +
    `<g transform="rotate(-16 50 52)">` +
    `<ellipse cx="50" cy="52" rx="44" ry="13" stroke-width="12"/><ellipse cx="50" cy="52" rx="44" ry="13" stroke="#e8c08a" stroke-width="6"/>` +
    `</g>` +
    `<circle cx="50" cy="52" r="24" fill="#f2c14e"/>` +
    band(50, 52, 24, 42, 48, '#e8a15c') +
    band(50, 52, 24, 56, 60, '#e8a15c') +
    `<circle cx="50" cy="52" r="24"/>` +
    `<g transform="rotate(-16 50 52)">` +
    `<path d="M6 52A44 13 0 0 0 94 52" stroke-width="12"/><path d="M6 52A44 13 0 0 0 94 52" stroke="#e8c08a" stroke-width="6"/>` +
    `</g>` +
    twinkles([
      [16, 18, 3.5],
      [84, 84, 3.5],
    ]),
  태양: (() => {
    const n = 16;
    const pts = Array.from({ length: n * 2 }, (_, k) => {
      const a = (k * Math.PI) / n;
      const r = k % 2 ? 34 : 41;
      return `${f1(50 + r * Math.cos(a))} ${f1(50 + r * Math.sin(a))}`;
    });
    return (
      night('#1f2a5a') +
      `<path d="M${pts.join('L')}Z" fill="#ff9f1a"/>` +
      `<circle cx="50" cy="50" r="30" fill="#ffc933"/>` +
      `<circle cx="50" cy="50" r="20" fill="#ffe066" stroke="none"/>` +
      `<circle cx="40" cy="42" r="4" fill="#ff9f1a" stroke="none"/><circle cx="60" cy="58" r="5" fill="#ff9f1a" stroke="none"/>` +
      twinkles([
        [14, 14, 3.5],
        [86, 86, 3.5],
        [86, 14, 3],
        [14, 86, 3],
      ])
    );
  })(),
  우주:
    night('#1f2a5a') +
    // 고리 행성
    `<circle cx="28" cy="30" r="13" fill="#a45cf0"/>` +
    `<path d="M10 36C4 42 20 40 30 36S54 22 46 22" stroke-width="7"/><path d="M10 36C4 42 20 40 30 36S54 22 46 22" stroke="#ff9aa8" stroke-width="3"/>` +
    // 달
    `<circle cx="82" cy="78" r="8" fill="#dfe8f5"/>` +
    dot(80, 76, 2, '#b4bdd0') +
    // 로켓
    `<g transform="rotate(35 58 56)">` +
    `<path d="M50 72L42 80V66L50 60Z" fill="#e8553d"/><path d="M66 72L74 80V66L66 60Z" fill="#e8553d"/>` +
    `<path d="M58 22C70 32 68 60 66 74H50C48 60 46 32 58 22Z" fill="#fff"/>` +
    `<circle cx="58" cy="46" r="6" fill="#7ec8f0"/>` +
    `<path d="M52 74L58 90L64 74Z" fill="#ff9f1a"/>` +
    `</g>` +
    star(80, 20, 6) +
    twinkles([
      [14, 70, 4],
      [36, 86, 3],
      [86, 50, 3],
      [48, 12, 3],
    ]),

  // ── 바람 ──
  회오리바람:
    `<path d="M4 90H96"/>` +
    `<path d="M14 16C24 8 76 8 86 16C84 30 70 38 62 48C56 58 58 70 52 86C50 90 46 90 46 86C44 72 40 60 36 50C28 40 16 30 14 16Z" fill="#b4bdd0"/>` +
    `<path d="M16 22C36 30 66 30 84 22M26 36C42 42 62 42 72 36M36 50C46 54 56 54 62 50M42 64C48 66 54 66 58 64M46 76C48 77 52 77 54 76" stroke="#6f7c9c" stroke-width="3"/>` +
    leaf(78, 60, -30, 0.25) +
    leaf(18, 64, 30, 0.22) +
    `<path d="M30 86q8-4 14 0M58 86q8-4 14 0" stroke="#9aa6c4" stroke-width="3"/>` +
    dot(24, 48, 2.5, '#9a5b2e') +
    dot(80, 44, 2.5, '#9a5b2e'),
  산들바람:
    sky('#dff4ff') +
    `<path d="M5 72C30 64 70 64 95 72V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#8fd67a"/>` +
    // 부드러운 바람 선
    `<path d="M10 24C24 18 34 30 46 24S64 18 72 24" stroke="#7ec8f0" stroke-width="4"/>` +
    `<path d="M20 44C32 38 42 48 54 42C62 38 70 38 74 44C78 50 70 54 66 48" stroke="#7ec8f0" stroke-width="4"/>` +
    // 살짝 기운 꽃
    tube('M36 90C36 80 40 70 46 62', '#43b04a', 4) +
    [0, 72, 144, 216, 288]
      .map((a) => {
        const r = (a * Math.PI) / 180;
        return `<circle cx="${f1(49 + 7 * Math.cos(r))}" cy="${f1(56 + 7 * Math.sin(r))}" r="5.5" fill="#ff9aa8"/>`;
      })
      .join('') +
    `<circle cx="49" cy="56" r="4.5" fill="#ffd23f"/>` +
    // 풀잎이 한쪽으로 살랑
    `<path d="M62 90C64 82 68 78 74 76M70 90C72 82 76 78 82 78M16 90C18 82 22 78 28 76" stroke="#3a9e47" stroke-width="3.5"/>` +
    // 날리는 꽃잎
    `<ellipse cx="80" cy="30" rx="5" ry="3" fill="#ff9aa8" transform="rotate(-30 80 30)"/>` +
    `<ellipse cx="86" cy="52" rx="4.5" ry="2.8" fill="#ff9aa8" transform="rotate(20 86 52)"/>` +
    frame(),

  // ── 땅의 모습 ──
  계곡:
    sky('#bfe6ff') +
    `<path d="M5 20L30 16L46 50L42 95H5Z" fill="#5fc24a"/>` +
    `<path d="M95 14L70 18L54 50L58 95H95Z" fill="#3a9e47"/>` +
    `<path d="M46 50C44 64 40 80 34 95H66C60 80 56 64 54 50Z" fill="#4aa8f0"/>` +
    `<path d="M47 62q3-2 6 0M42 78q4-2 8 0t8 0M44 90q4-2 8 0" stroke="#dff4ff" stroke-width="2.5"/>` +
    pebble(32, 84, 6, 4, '#8a96b0') +
    pebble(68, 86, 7, 4.5, '#b4bdd0') +
    `<path d="M16 40l6 6M26 58l6 4M78 36l-6 6M80 60l-6 4" stroke="#2f8a3a" stroke-width="3"/>` +
    frame(),
  절벽:
    sky('#bfe6ff') +
    waveRow(76, '#3b8fe0', 16, 5) +
    `<path d="M5 22H56L60 34L54 46L62 58L56 72L60 95H5Z" fill="#a08670"/>` +
    `<path d="M5 22H56L58 28C44 30 20 30 5 28Z" fill="#43b04a"/>` +
    `<path d="M20 42L30 48M36 60L46 56M18 74L28 80M40 84L48 80" stroke="#6b3e26" stroke-width="3"/>` +
    // 떨어질까 봐 조심하는 작은 새
    `<path d="M72 30q4-4 8 0q4-4 8 0" stroke-width="3"/>` +
    `<path d="M66 90q5-3 10 0M80 84q5-3 10 0" stroke="#bfe6ff" stroke-width="2.5"/>` +
    frame(),
  산꼭대기:
    sky('#bfe6ff') +
    `<path d="M5 95L50 26L95 95Z" fill="#5fc24a"/>` +
    `<path d="M38.8 43L50 26L61.2 43L56 40L50 46L44 40Z" fill="#fff"/>` +
    // 꼭대기 깃발
    `<path d="M50 26V8" stroke-width="3.5"/><path d="M50 8L66 13L50 18Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="24" rx="17" ry="15" stroke="${HL}" stroke-width="5" stroke-dasharray="7 5"/>` +
    `<path d="M26 76l6-6M68 70l6 6" stroke="#2f8a3a" stroke-width="3"/>` +
    frame(),
  들판:
    sky('#bfe6ff') +
    `<circle cx="78" cy="22" r="9" fill="#ffd23f"/>` +
    `<path d="M5 46H95V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#8fd67a"/>` +
    `<path d="M5 46H95"/>` +
    blob('#3a9e47', [
      [16, 42, 5],
      [22, 40, 6],
    ]) +
    blob('#3a9e47', [[88, 42, 5]]) +
    `<path d="M40 95C44 76 48 60 50 46H52C54 60 58 76 66 95Z" fill="#f2d49a" stroke-width="2.5"/>` +
    [
      [18, 62, '#ff5c70'],
      [28, 80, '#ffd23f'],
      [78, 60, '#fff'],
      [84, 80, '#ff9aa8'],
      [72, 72, '#ffd23f'],
      [14, 88, '#fff'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}" stroke-width="2"/>`)
      .join('') +
    frame(),
  초원:
    sky('#bfe6ff') +
    `<path d="M5 50C24 40 44 42 60 50S86 52 95 46V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#5fc24a"/>` +
    `<path d="M5 72C30 64 60 66 95 60V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#43b04a"/>` +
    // 풀 무더기
    [
      [16, 84],
      [34, 78],
      [80, 80],
      [88, 58],
      [22, 56],
    ]
      .map(([x, y]) => `<path d="M${x - 5} ${y}L${x - 3} ${y - 9}M${x} ${y}V${y - 11}M${x + 5} ${y}L${x + 3} ${y - 9}" stroke="#2a7a34" stroke-width="3"/>`)
      .join('') +
    // 풀 뜯는 양
    `<path d="M48 74V82M58 74V82M66 74V82" stroke-width="4"/>` +
    blob('#fff', [
      [50, 66, 9],
      [60, 62, 10],
      [68, 68, 8],
      [58, 72, 8],
    ]) +
    `<ellipse cx="42" cy="72" rx="6" ry="7" fill="#5a3b24"/>` +
    dot(40, 71, 1.6, '#fff') +
    frame(),
  늪:
    `<ellipse cx="50" cy="70" rx="46" ry="22" fill="#6b7a3a"/>` +
    `<ellipse cx="50" cy="72" rx="38" ry="15" fill="#5e8a52"/>` +
    // 부들
    tube('M22 78V26', '#3a9e47', 3) +
    tube('M34 76V18', '#3a9e47', 3) +
    tube('M78 78V30', '#3a9e47', 3) +
    `<rect x="17" y="30" width="10" height="20" rx="5" fill="#8a5a2e"/>` +
    `<rect x="29" y="22" width="10" height="22" rx="5" fill="#8a5a2e"/>` +
    `<rect x="73" y="34" width="10" height="20" rx="5" fill="#8a5a2e"/>` +
    `<path d="M26 78C20 70 14 66 10 64M76 78C82 70 88 68 92 66" stroke="#3a9e47" stroke-width="3.5"/>` +
    // 물풀 잎·방울
    `<path d="M50 76A10 5 0 1 1 62 72L55 74Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="44" cy="66" r="3.5" fill="#a9c79a" stroke-width="2.5"/><circle cx="66" cy="82" r="3" fill="#a9c79a" stroke-width="2.5"/><circle cx="36" cy="84" r="2.5" fill="#a9c79a" stroke-width="2"/>`,
  모래언덕:
    sky('#bfe6ff') +
    sunDisc(78, 22, 9, 8) +
    `<path d="M5 60C20 44 36 42 52 56C64 66 80 58 95 48V95H5Z" fill="#ffc861"/>` +
    `<path d="M5 78C24 66 46 64 66 74C78 80 88 78 95 72V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#f2a64e"/>` +
    `<path d="M20 60q5-3 10 0M60 64q5-3 10 0M28 84q6-3 12 0M60 86q6-3 12 0" stroke="#c9782a" stroke-width="2.5"/>` +
    frame(),
  자갈밭: (() => {
    const pal = ['#8a96b0', '#b4bdd0', '#dfe8f5', '#a4aec4', '#c9b9a0'];
    const ps: [number, number, number, number, number][] = [
      [18, 28, 9, 7, -10],
      [40, 22, 8, 6, 15],
      [62, 26, 10, 7, 0],
      [84, 24, 7, 6, 20],
      [28, 46, 10, 8, 10],
      [52, 44, 9, 7, -15],
      [76, 46, 10, 8, 5],
      [14, 64, 8, 7, 0],
      [38, 66, 11, 8, -5],
      [64, 66, 9, 7, 20],
      [86, 66, 7, 6, -10],
      [22, 84, 10, 7, 5],
      [48, 86, 8, 6, 0],
      [72, 84, 11, 7, -10],
    ];
    return (
      `<rect x="5" y="12" width="90" height="83" rx="14" fill="#e8d9b8"/>` +
      ps.map(([x, y, rx, ry, r], i) => pebble(x, y, rx, ry, pal[i % pal.length], r)).join('') +
      ps
        .filter((_, i) => i % 3 === 0)
        .map(([x, y, rx, ry]) => `<path d="M${f1(x - rx * 0.5)} ${f1(y - ry * 0.2)}q${f1(rx * 0.3)} ${f1(-ry * 0.4)} ${f1(rx * 0.6)} ${f1(-ry * 0.4)}" stroke="#fff" stroke-width="2.5"/>`)
        .join('')
    );
  })(),

  // ── 물의 모습 ──
  해변:
    sky('#bfe6ff') +
    `<path d="M5 32H95V58H5Z" fill="#3b8fe0"/>` +
    `<path d="M5 56C20 50 34 60 50 54S80 50 95 56V81C95 88 89 95 81 95H19C11 95 5 88 5 81Z" fill="#ffe2a0"/>` +
    `<path d="M5 56C20 50 34 60 50 54S80 50 95 56" stroke="#fff" stroke-width="5"/>` +
    `<path d="M5 32H95"/>` +
    // 파라솔
    tube('M34 88L42 48', '#fff', 3) +
    `<path d="M20 50C22 30 40 22 58 30C54 34 52 40 52 46C46 42 40 42 36 46C32 42 26 44 20 50Z" fill="#e8553d"/>` +
    `<path d="M40 26C36 34 34 40 36 46" stroke="#fff" stroke-width="3"/>` +
    // 불가사리
    star(72, 78, 10, '#ff9f1a', 3) +
    sparkle(80, 42, 4, '#fff') +
    frame(),
  소용돌이:
    `<circle cx="50" cy="50" r="44" fill="#3b8fe0"/>` +
    tube(spiralD(50, 50, 3, 36, 2.4, 1), '#bfe6ff', 6) +
    `<circle cx="50" cy="50" r="5" fill="#1f5fa8"/>` +
    leaf(66, 18, 150, 0.28) +
    `<circle cx="50" cy="50" r="44"/>`,
  물결:
    waveRow(28, '#bfe6ff', 22, 8) +
    waveRow(48, '#7ec8f0', 22, 8) +
    waveRow(68, '#4a90e2', 22, 8) +
    waveRow(84, '#3b78e6', 22, 8) +
    `<path d="M16 38q4-2 8 0M60 58q4-2 8 0M34 76q4-2 8 0" stroke="#fff" stroke-width="3"/>`,
  샘물:
    // 바위 틈에서 솟는 물
    `<path d="M10 62C8 42 22 26 40 24C50 16 70 20 78 32C92 36 94 54 88 64Z" fill="#8a96b0"/>` +
    `<path d="M30 40L38 46M68 34L74 42M20 54L28 56" stroke="#5f6a85" stroke-width="3"/>` +
    `<ellipse cx="50" cy="78" rx="42" ry="16" fill="#4aa8f0"/>` +
    `<ellipse cx="50" cy="78" rx="42" ry="16" fill="none"/>` +
    tube('M50 46C50 56 50 64 50 74', '#7ec8f0', 8) +
    `<path d="M50 44C44 34 40 32 36 34M50 44C56 34 60 32 64 34" stroke-width="7"/>` +
    `<path d="M50 44C44 34 40 32 36 34M50 44C56 34 60 32 64 34" stroke="#7ec8f0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="46" rx="6" ry="4" fill="#bfe6ff"/>` +
    `<path d="M36 78q7-4 14 0t14 0M22 86q5-3 10 0M68 88q5-3 10 0" stroke="#dff4ff" stroke-width="3"/>` +
    drop(34, 38, 0.5) +
    drop(66, 38, 0.5),
  시냇물:
    `<rect x="5" y="5" width="90" height="90" rx="14" fill="#8fd67a"/>` +
    `<path d="M70 5C60 16 64 28 52 36C40 44 30 44 30 56C30 68 46 70 44 82C43 88 40 92 38 95H58C62 86 64 80 62 72C60 62 48 60 50 54C52 48 66 46 74 36C82 26 84 14 86 5Z" fill="#7ec8f0"/>` +
    `<path d="M68 22q3-2 6 0M44 50q3-2 6 0M48 80q3-2 6 0" stroke="#fff" stroke-width="2.5"/>` +
    pebble(24, 40, 6, 4, '#b4bdd0') +
    pebble(64, 58, 5, 3.5, '#dfe8f5') +
    pebble(72, 84, 6, 4, '#b4bdd0') +
    pebble(22, 76, 5, 3.5, '#dfe8f5') +
    // 작은 물고기
    `<path d="M38 64C42 60 48 60 52 64C48 68 42 68 38 64Z" fill="#ff9f1a" stroke-width="2.5"/><path d="M38 64L33 60V68Z" fill="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M14 18l3 6M20 16l0 7M84 70l3-6M88 74l4-4" stroke="#3a9e47" stroke-width="3"/>` +
    frame(),

  // ── 보석·금 ──
  수정:
    `<path d="M10 90C12 80 24 76 50 76S88 80 90 90Z" fill="#8a96b0"/>` +
    `<path d="M22 84L18 50L28 38L36 50L36 84Z" fill="#d9c8ff"/>` +
    `<path d="M64 84L64 46L74 32L84 46L80 84Z" fill="#d9c8ff"/>` +
    `<path d="M38 86L38 30L50 12L62 30L62 86Z" fill="#e8dcff"/>` +
    `<path d="M50 12V86M38 30H62" stroke="#a88ce0" stroke-width="2.5"/>` +
    `<path d="M28 38V84M18 50H36M74 32V84M64 46H84" stroke="#a88ce0" stroke-width="2.5"/>` +
    `<path d="M43 36V64" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(82, 18, 6) +
    sparkle(16, 28, 5),
  다이아몬드:
    `<path d="M16 38L32 18H68L84 38L50 86Z" fill="#bfe6ff"/>` +
    `<path d="M16 38H84" stroke-width="3"/>` +
    `<path d="M32 18L40 38L50 18L60 38L68 18M40 38L50 86L60 38" stroke-width="2.5"/>` +
    `<path d="M40 38L50 18L60 38Z" fill="#e8f6ff" stroke-width="2.5"/>` +
    `<path d="M26 42L42 66" stroke="#fff" stroke-width="3.5"/>` +
    sparkle(82, 16, 7) +
    sparkle(18, 70, 5) +
    sparkle(80, 66, 4),
  루비:
    `<path d="M30 16H70L86 34V66L70 84H30L14 66V34Z" fill="#e8403a"/>` +
    `<path d="M38 30H62L70 42V58L62 70H38L30 58V42Z" fill="#ff5c70" stroke-width="2.5"/>` +
    `<path d="M30 16L38 30M70 16L62 30M86 34L70 42M86 66L70 58M70 84L62 70M30 84L38 70M14 66L30 58M14 34L30 42" stroke-width="2.5"/>` +
    `<path d="M40 38L48 34" stroke="#fff" stroke-width="4"/>` +
    sparkle(84, 14, 6) +
    sparkle(14, 86, 5),
  진주:
    // 벌어진 조개
    `<g transform="translate(50 60) scale(1.12) translate(-50 -60)">` +
    `<path d="M10 58C10 30 90 30 90 58C80 50 20 50 10 58Z" fill="#ffc2d1"/>` +
    `<path d="M30 44L34 54M50 38V52M70 44L66 54" stroke="#e88aa0" stroke-width="2.5"/>` +
    `<path d="M10 62C12 86 88 86 90 62C80 70 20 70 10 62Z" fill="#ffc2d1"/>` +
    `<path d="M30 76L34 70M50 82V72M70 76L66 70" stroke="#e88aa0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="62" rx="34" ry="7" fill="#ff9aa8"/>` +
    `<circle cx="50" cy="56" r="13" fill="#fff"/>` +
    `<path d="M44 52q3-4 7-4" stroke="#dfe8f5" stroke-width="3"/>` +
    `</g>` +
    sparkle(80, 18, 6) +
    sparkle(24, 24, 4),
  금: (() => {
    const bar = (x: number, y: number) =>
      `<path d="M${x} ${y}L${x + 8} ${y - 20}H${x + 36}L${x + 44} ${y}Z" fill="#ffc933"/>` +
      `<path d="M${x + 8} ${y}L${x + 12} ${y - 14}H${x + 32}L${x + 36} ${y}" stroke="#e8a21a" stroke-width="2.5"/>` +
      `<path d="M${x + 12} ${y - 17}H${x + 26}" stroke="#fff3b0" stroke-width="3.5"/>`;
    return (
      bar(6, 86) +
      bar(50, 86) +
      bar(28, 64) +
      `<path d="M4 86H96"/>` +
      sparkle(80, 24, 9) +
      sparkle(18, 34, 7) +
      sparkle(52, 22, 5)
    );
  })(),
};
