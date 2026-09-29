// 음식 그림 묶음 (3단계 어휘: 밥·김밥·고기·빵·과자·사탕·우유·케이크·떡·죽·차). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리는 대표 재료를 크게 보여 구별한다:
//   볶음밥: 김치볶음밥(주황 빨강 밥·달걀프라이) / 새우볶음밥(노란 밥·큰 새우·완두) / 잡채밥(흰 밥 위 갈색 당면·채소 줄)
//   김밥: 김초밥(나무 받침 위 선 가는 말이·주황 속 하나) / 참치김밥(참치 속 단면 + 참치 캔) / 충무김밥(속 없는 손가락 김밥 + 빨간 무·오징어)
//         꼬마김밥(종이 그릇에 누운 작은 말이 여럿 + 겨자장) / 유부초밥(갈색 유부 주머니 + 흰 밥)
//   고기: 소고기(짙은 빨강 + 소 얼굴 딱지) / 돼지고기(분홍 + 흰 비계 + 돼지 얼굴 딱지) / 삼겹살(불판 위 줄무늬 세 겹)
//   과자: 버터쿠키(파란 통 속 꽃 모양) / 초코칩쿠키(큰 칩 + 떨어진 초코칩) / 비스킷(물결 테두리 네모 + 구멍) / 크래커(연한 네모 + 치즈)
//         웨하스(격자 무늬 + 분홍 크림 층) / 전병(얇은 원판 + 김 조각) / 강정(쌀 튀밥 알갱이 덩어리) / 뻥튀기(크고 흰 원판 + 한 입)
//   사탕: 박하사탕(흰 사탕 + 민트 잎) / 알사탕(여러 색 구슬 + 포장 비틀기) / 젤리빈(콩 모양 여러 색) / 마시멜로(말랑한 원기둥 + 꼬치)
//   우유: 팩 색과 옆의 재료로 (초코·딸기·바나나)
//   케이크: 치즈케이크(노란 조각 + 치즈) / 생크림케이크(흰 크림 짜기 + 딸기, 초 없음) / 롤케이크(나선) / 카스텔라(갈색 윗면 노란 네모)
//   떡: 찹쌀떡(흰 동그라미 + 팥 단면) / 바람떡(반달) / 절편(찍은 무늬) / 백설기(흰 네모) / 무지개떡(색 층)
//   죽: 팥죽(검붉은 죽 + 새알심) / 호박죽(노란 죽 + 호박) / 전복죽(연한 초록 죽 + 전복 껍데기)
//   차: 같은 찻잔에 옆의 재료로 (매실·유자·생강·대추), 꿀물은 유리컵 + 꿀 막대
import { INK, HL, dot, blob, sparkle, tube } from '../pictureKit.ts';

const f = (n: number) => Number(n.toFixed(1));

/** 접시 (타원 + 안쪽 테) */
const plate = (cy: number, rx = 44, ry = 14, fill = '#fff', rim = '#dfe8f5') =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 5}" stroke="${rim}" stroke-width="3"/>`;

const steam = (y: number, x = 50) =>
  `<path d="M${x - 14} ${y}c-5-5 5-9 0-15M${x} ${y - 2}c-5-5 5-9 0-15M${x + 14} ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 그릇 (조금 내려다본 모양): 국물 면 + 건더기 + 앞쪽 몸통 + 굽 */
function bowl(cy: number, soup: string, body: string, inner = '', band = '', ry = 13): string {
  const k = f(ry * 0.55);
  return (
    `<path d="M38 ${cy + 36}L36 ${cy + 44}H64L62 ${cy + 36}" fill="${body}"/>` +
    `<ellipse cx="50" cy="${cy}" rx="38" ry="${ry}" fill="${soup}"/>` +
    inner +
    `<path d="M12 ${cy}C12 ${cy + 26} 30 ${cy + 40} 50 ${cy + 40}S88 ${cy + 26} 88 ${cy}C88 ${f(cy + k)} 71 ${cy + ry} 50 ${cy + ry}S12 ${f(cy + k)} 12 ${cy}Z" fill="${body}"/>` +
    (band ? `<path d="M19 ${cy + ry + 8}Q50 ${cy + ry + 18} 81 ${cy + ry + 8}" stroke="${band}" stroke-width="4"/>` : '')
  );
}

/** 테두리 있는 가는 줄 (채소 채) */
const strip = (d: string, c: string) => `<path d="${d}" stroke-width="7"/><path d="${d}" stroke="${c}" stroke-width="4"/>`;

/** 볶음밥 산 */
const mound = (fill: string) => `<path d="M14 68C14 42 30 28 50 28S86 42 86 68C74 75 26 75 14 68Z" fill="${fill}"/>`;

/** 밥알 (짧은 선) */
const grains = (pts: number[][], c: string) =>
  pts.map(([x, y]) => `<path d="M${x} ${y}l4-2" stroke="${c}" stroke-width="3"/>`).join('');

/** 꽃 모양 둘레 (버터쿠키·유자) */
function flower(cx: number, cy: number, r: number, n: number, a: number, fill: string): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = t - Math.PI / n;
      d += `Q${f(cx + r * (1 + a) * Math.cos(m))} ${f(cy + r * (1 + a) * Math.sin(m))} ${f(x)} ${f(y)}`;
    }
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
}

/** 물결 테두리 네모 (비스킷) */
function scallopRect(x0: number, y0: number, x1: number, y1: number, n: number, m: number, b: number, fill: string): string {
  const w = (x1 - x0) / n;
  const h = (y1 - y0) / m;
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < n; i++) d += `Q${f(x0 + (i + 0.5) * w)} ${y0 - b} ${f(x0 + (i + 1) * w)} ${y0}`;
  for (let j = 0; j < m; j++) d += `Q${x1 + b} ${f(y0 + (j + 0.5) * h)} ${x1} ${f(y0 + (j + 1) * h)}`;
  for (let i = n; i > 0; i--) d += `Q${f(x0 + (i - 0.5) * w)} ${y1 + b} ${f(x0 + (i - 1) * w)} ${y1}`;
  for (let j = m; j > 0; j--) d += `Q${x0 - b} ${f(y0 + (j - 0.5) * h)} ${x0} ${f(y0 + (j - 1) * h)}`;
  return `<path d="${d}Z" fill="${fill}"/>`;
}

/** 새우 (둥글게 말린 몸 + 꼬리) */
const shrimp = (x: number, y: number, s: number, rot: number) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
  `<path d="M1 11L-9 6L-8 17Z" fill="#ff6a3c" stroke-width="2.5"/>` +
  tube('M-10 -5C-7 -14 8 -14 11 -3C13 6 7 11 1 11', '#ff8a5c', 7) +
  `<path d="M1 -13l-1 6M9 -8l-5 3M10 4l-5-2" stroke="#ffd0b8" stroke-width="2.5"/></g>`;

/** 김밥 한 조각 단면 (김 테두리 + 밥 + 속) */
const slice = (x: number, y: number, r: number, inner: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#1f2a24"/><circle cx="${x}" cy="${y}" r="${r - 4}" fill="#fff" stroke-width="2"/>` +
  `<g transform="translate(${x} ${y})">${inner}</g>`;

/** 고기 딱지 (동그라미 안에 동물 얼굴) */
const badge = (inner: string) => `<circle cx="26" cy="24" r="19" fill="#fff1b8" stroke="${HL}" stroke-width="4"/>` + inner;

/** 고기 쟁반 */
const tray = `<rect x="8" y="42" width="84" height="48" rx="10" fill="#fff"/><rect x="14" y="47" width="72" height="38" rx="7" stroke="#dfe8f5" stroke-width="3"/>`;

/** 우유 팩 (몸 색, 띠 속 그림) */
const carton = (body: string, top: string, icon: string) =>
  `<rect x="31" y="8" width="16" height="9" fill="${top}"/><path d="M16 38L31 16H47L62 38Z" fill="${top}"/>` +
  `<rect x="16" y="38" width="46" height="52" rx="2" fill="${body}"/><rect x="16" y="50" width="46" height="26" fill="#fff"/>` +
  icon;

/** 찻잔 (왼쪽) + 차 색 + 뜬 것, 오른쪽엔 재료를 따로 그린다 */
const teacup = (tea: string, floats: string, band = '#3b8fe0') =>
  steam(28, 40) +
  `<ellipse cx="40" cy="84" rx="36" ry="8" fill="#dfe8f5"/>` +
  `<path d="M12 44C12 70 24 84 40 84S68 70 68 44Z" fill="#fff"/>` +
  `<ellipse cx="40" cy="44" rx="28" ry="9" fill="${tea}"/>` +
  floats +
  `<path d="M16 60Q40 70 64 60" stroke="${band}" stroke-width="4"/>`;

/** 3/4로 본 네모 덩어리: 앞면 층(bands: [색, 높이]...), 윗면 색, 옆면은 같은 층 */
function block(x: number, y: number, w: number, d: number, bands: [string, number][], top: string, extra = ''): string {
  const h = bands.reduce((s, [, bh]) => s + bh, 0);
  let fy = y;
  let front = '';
  let side = '';
  for (const [c, bh] of bands) {
    front += `<rect x="${x}" y="${fy}" width="${w}" height="${bh}" fill="${c}" stroke="none"/>`;
    side += `<path d="M${x + w} ${fy}L${x + w + d} ${fy - d}V${fy - d + bh}L${x + w} ${fy + bh}Z" fill="${c}" stroke="none"/>`;
    fy += bh;
  }
  return (
    front +
    side +
    `<path d="M${x + w} ${y}L${x + w + d} ${y - d}V${y - d + h}L${x + w} ${y + h}Z" fill="${INK}" fill-opacity=".12" stroke="none"/>` +
    `<path d="M${x} ${y}L${x + d} ${y - d}H${x + w + d}L${x + w} ${y}Z" fill="${top}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>` +
    `<path d="M${x + w} ${y}L${x + w + d} ${y - d}V${y - d + h}L${x + w} ${y + h}"/>` +
    extra
  );
}

/** 젤리빈 한 알 */
const bean = (x: number, y: number, rot: number, c: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-12 -1C-12 -9 -4 -10 0 -6C4 -10 12 -9 12 -1C12 6 6 9 0 9S-12 6 -12 -1Z" fill="${c}"/>` +
  `<path d="M-8 -1q1-4 5-4" stroke="#fff" stroke-width="2.5" opacity=".6"/></g>`;

/** 동그란 알사탕 (반짝 줄) */
const ball = (x: number, y: number, r: number, c: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><path d="M${x - r * 0.55} ${y - r * 0.1}a${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.45} ${-r * 0.45}" stroke="#fff" stroke-width="3" opacity=".7"/>`;

/** 찹쌀떡 (눌린 동그라미 + 흰 가루) */
const mochi = (x: number, y: number, r: number) =>
  `<path d="M${x - r} ${y}C${x - r} ${f(y - 1.25 * r)} ${x + r} ${f(y - 1.25 * r)} ${x + r} ${y}C${x + r} ${f(y + 0.4 * r)} ${x - r} ${f(y + 0.4 * r)} ${x - r} ${y}Z" fill="#fff"/>` +
  `<path d="M${f(x - r * 0.55)} ${f(y - r * 0.45)}q${f(r * 0.25)} ${f(-r * 0.3)} ${f(r * 0.55)} ${f(-r * 0.35)}" stroke="#dfe8f5" stroke-width="3"/>` +
  dot(f(x + r * 0.3), f(y - r * 0.1), 1.6, '#dfe8f5') +
  dot(f(x - r * 0.2), f(y + r * 0.05), 1.6, '#dfe8f5');

/** 바람떡 (반달, 속 팥이 비친다) */
const halfMoon = (x: number, y: number, r: number, c: string, rot: number, shade: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">` +
  `<path d="M${-r} 0C${-r} ${f(-r * 1.3)} ${r} ${f(-r * 1.3)} ${r} 0C${f(r * 0.5)} 3 ${f(-r * 0.5)} 3 ${-r} 0Z" fill="${c}"/>` +
  `<path d="M${f(-r * 0.55)} -2C${f(-r * 0.55)} ${f(-r * 0.8)} ${f(r * 0.55)} ${f(-r * 0.8)} ${f(r * 0.55)} -2Z" fill="${shade}" stroke="none"/>` +
  `<path d="M${f(-r * 0.8)} -3C${f(-r * 0.78)} ${f(-r * 1.05)} ${f(r * 0.78)} ${f(-r * 1.05)} ${f(r * 0.8)} -3" stroke="#fff" stroke-width="2.5" opacity=".6"/></g>`;

/** 절편 (납작한 네모 + 찍은 꽃무늬) */
const jeolpyeon = (x: number, y: number, rot: number, c: string, line: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-15" y="-13" width="30" height="26" rx="5" fill="${c}"/>` +
  [0, 60, 120]
    .map((a) => `<ellipse cx="0" cy="0" rx="9" ry="3.6" transform="rotate(${a})" stroke="${line}" stroke-width="2.5"/>`)
    .join('') +
  dot(0, 0, 2.4, line) +
  `</g>`;

export const PICS: Record<string, string> = {
  잡채밥:
    plate(72, 46, 18) +
    `<path d="M14 70C14 48 30 36 50 36S86 48 86 70C72 77 28 77 14 70Z" fill="#fff"/>` +
    grains(
      [
        [20, 62],
        [26, 52],
        [32, 66],
        [36, 46],
        [22, 70],
      ],
      '#dfe8f5',
    ) +
    `<path d="M38 50C44 36 64 32 76 42C86 50 88 62 85 70C72 76 52 76 40 72C34 66 34 58 38 50Z" fill="#8a5436"/>` +
    `<path d="M42 50q5-5 10 0t10 0t10 0t8 0M40 60q5-5 10 0t10 0t10 0t10 0M44 69q5-5 10 0t10 0t10 0" stroke="#c98b4f" stroke-width="3"/>` +
    strip('M48 44L60 48', '#ff9f1a') +
    strip('M66 56L78 52', '#43b04a') +
    strip('M50 62L62 66', '#ffd23f') +
    strip('M68 44L78 48', '#e8553d') +
    strip('M44 56L52 54', '#43b04a'),
  김치볶음밥:
    plate(70, 46, 18) +
    mound('#ea6a34') +
    grains(
      [
        [22, 60],
        [30, 50],
        [72, 56],
        [66, 64],
        [28, 66],
        [78, 64],
      ],
      '#ffab7a',
    ) +
    [
      [26, 58, 20],
      [70, 50, -15],
      [40, 64, 35],
      [60, 66, -30],
    ]
      .map(([x, y, a]) => `<rect x="${x - 4}" y="${y - 4}" width="9" height="8" rx="2" fill="#c8321f" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    `<path d="M32 42C28 32 40 24 50 26C60 22 72 30 68 40C70 48 58 52 48 50C38 52 28 48 32 42Z" fill="#fff"/>` +
    `<circle cx="50" cy="38" r="8" fill="${HL}"/><path d="M46 36a4 4 0 0 1 4-3" stroke="#fff" stroke-width="2.5"/>` +
    `<circle cx="78" cy="58" r="3" fill="#43b04a" stroke-width="2"/><circle cx="22" cy="66" r="3" fill="#43b04a" stroke-width="2"/>`,
  새우볶음밥:
    plate(70, 46, 18) +
    mound('#f5d27a') +
    grains(
      [
        [24, 60],
        [70, 44],
        [44, 64],
        [76, 62],
      ],
      '#fff0c0',
    ) +
    [
      [30, 50],
      [56, 66],
      [72, 56],
      [22, 64],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.8" fill="#5fc24a" stroke-width="2"/>`)
      .join('') +
    `<rect x="44" y="30" width="6" height="6" rx="1" fill="#ff9f1a" stroke-width="2"/><rect x="36" y="64" width="6" height="6" rx="1" fill="#ff9f1a" stroke-width="2"/>` +
    shrimp(38, 44, 1.15, -10) +
    shrimp(62, 46, 1.15, 20),
  유부초밥:
    plate(78, 46, 14) +
    [
      [50, 34],
      [31, 54],
      [69, 54],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x - 15} ${y}C${x - 16} ${y + 20} ${x - 10} ${y + 25} ${x} ${y + 25}S${x + 16} ${y + 20} ${x + 15} ${y}Z" fill="#d9913a"/>` +
          `<path d="M${x - 8} ${y + 9}l2 6M${x + 6} ${y + 11}l-2 6M${x - 1} ${y + 15}v5" stroke="#f0b860" stroke-width="3"/>` +
          `<path d="M${x - 15} ${y}C${x - 16} ${y - 9} ${x - 7} ${y - 11} ${x} ${y - 10}S${x + 16} ${y - 9} ${x + 15} ${y}C${x + 10} ${y + 4} ${x - 10} ${y + 4} ${x - 15} ${y}Z" fill="#fff"/>` +
          dot(x - 5, y - 4, 1.6) +
          dot(x + 4, y - 5, 1.6) +
          dot(x + 1, y - 1, 1.6),
      )
      .join(''),
  김초밥:
    `<path d="M8 76H92V85H8Z" fill="#c98b4f"/><path d="M18 85V92M82 85V92" stroke-width="5"/>` +
    [26, 50, 74]
      .map(
        (x) =>
          `<path d="M${x - 12} 44V68C${x - 12} 76 ${x + 12} 76 ${x + 12} 68V44Z" fill="#26332a"/>` +
          `<ellipse cx="${x}" cy="44" rx="12" ry="8" fill="#26332a"/>` +
          `<ellipse cx="${x}" cy="44" rx="9" ry="5.6" fill="#fff" stroke-width="2"/>` +
          `<ellipse cx="${x - 1}" cy="44" rx="4.6" ry="3" fill="#ff7a4c" stroke-width="2"/><circle cx="${x + 4.5}" cy="45" r="1.8" fill="#43b04a" stroke="none"/>`,
      )
      .join('') +
    `<path d="M16 58V66M40 58V66M64 58V66" stroke="#46584a" stroke-width="2.5"/>`,
  참치김밥:
    `<path d="M52 18V42C52 48 88 48 88 42V18Z" fill="#dfe8f5"/><rect x="52" y="24" width="36" height="14" fill="#3b8fe0"/>` +
    `<path d="M62 31C66 26 74 26 77 31C74 36 66 36 62 31ZM77 31L83 27V35Z" fill="#fff" stroke-width="2"/>` +
    `<ellipse cx="70" cy="18" rx="18" ry="6" fill="#eef3fa"/><ellipse cx="70" cy="18" rx="12" ry="3.5" stroke="#b8c4d8" stroke-width="2.5"/>` +
    [
      [30, 64, 22],
      [68, 70, 20],
    ]
      .map(([x, y, r]) =>
        slice(
          x,
          y,
          r,
          `<path d="M-11 -3a11 11 0 0 0 5 12" stroke="#3a9e47" stroke-width="4.5"/>` +
            `<circle cx="0" cy="1" r="7" fill="#f0c090" stroke-width="2.5"/><path d="M-3 0q3-3 6 0" stroke="#fff" stroke-width="2.5"/>` +
            `<rect x="4" y="-12" width="6" height="6" fill="#ffd23f" stroke-width="2"/><rect x="-7" y="-12" width="6" height="5" fill="#ff9f1a" stroke-width="2"/>` +
            `<rect x="7" y="2" width="5" height="7" fill="#e8553d" stroke-width="2"/>`,
        ),
      )
      .join(''),
  충무김밥:
    `<ellipse cx="50" cy="70" rx="46" ry="22" fill="#fff"/><ellipse cx="50" cy="69" rx="37" ry="16" stroke="#dfe8f5" stroke-width="3"/>` +
    [
      [33, 76],
      [33, 64],
      [33, 52],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x - 20}" y="${y - 6}" width="40" height="12" rx="6" fill="#26332a"/><ellipse cx="${x + 16}" cy="${y}" rx="3.5" ry="5" fill="#fff" stroke-width="2"/>`,
      )
      .join('') +
    [
      [66, 72, 10],
      [80, 66, -12],
      [70, 56, 25],
    ]
      .map(([x, y, a]) => `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="3" fill="#f07a4a" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    tube('M60 44C66 36 76 36 80 44', '#e8553d', 6) +
    tube('M76 82C82 78 88 78 90 72', '#e8553d', 6) +
    `<path d="M70 56L90 32" stroke="#c98b4f" stroke-width="3"/>`,
  꼬마김밥:
    [
      [26, 40, -6],
      [52, 38, 4],
      [78, 42, 10],
      [36, 56, 6],
      [64, 56, -6],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-15" y="-8" width="24" height="16" rx="7" fill="#26332a"/>` +
          `<path d="M-10 -4H4" stroke="#56705a" stroke-width="2.5"/>` +
          `<ellipse cx="9" cy="0" rx="6" ry="8.5" fill="#26332a"/><ellipse cx="9" cy="0" rx="4.3" ry="6.5" fill="#fff" stroke-width="1.8"/>` +
          `<circle cx="9" cy="-2.5" r="2" fill="#ffd23f" stroke="none"/><circle cx="9" cy="2.5" r="2" fill="#ff9f1a" stroke="none"/>` +
          dot(-8, 3, 1.3, '#f5e6c8') +
          dot(-1, 1, 1.3, '#f5e6c8') +
          `</g>`,
      )
      .join('') +
    `<path d="M8 62L16 90H84L92 62Z" fill="#e0b070"/><path d="M12 70H88" stroke="#c9944f" stroke-width="3"/>`,
  소고기:
    badge(
      `<path d="M13 18l-5-6M39 18l5-6" stroke="#f2c14e" stroke-width="4"/>` +
        `<ellipse cx="12" cy="24" rx="5" ry="3" fill="#fff" stroke-width="2.5"/><ellipse cx="40" cy="24" rx="5" ry="3" fill="#fff" stroke-width="2.5"/>` +
        `<ellipse cx="26" cy="25" rx="12" ry="11" fill="#fff" stroke-width="2.5"/>` +
        `<path d="M17 18C19 13 27 15 26 21C22 23 18 22 17 18Z" fill="${INK}" stroke="none"/>` +
        dot(21, 24, 1.8) +
        dot(31, 24, 1.8) +
        `<ellipse cx="26" cy="32" rx="9" ry="5" fill="#ffb3c0" stroke-width="2.5"/>` +
        dot(22.5, 32, 1.5) +
        dot(29.5, 32, 1.5),
    ) +
    tray +
    `<path d="M20 64C20 52 34 48 50 50C66 46 82 52 80 66C82 78 66 84 50 82C32 84 20 76 20 64Z" fill="#c9302c"/>` +
    `<path d="M30 60q6-4 12 0M48 68q8-5 16 1M58 57q6-3 12 2M34 73q6-3 10 1M64 76q4-2 8 0" stroke="#ffd8d0" stroke-width="3"/>`,
  돼지고기:
    badge(
      `<path d="M14 18L16 8L23 14ZM38 18L36 8L29 14Z" fill="#ff9aa8" stroke-width="2.5"/>` +
        `<circle cx="26" cy="25" r="12" fill="#ffb3c0" stroke-width="2.5"/>` +
        dot(21, 22, 1.8) +
        dot(31, 22, 1.8) +
        `<ellipse cx="26" cy="29" rx="6.5" ry="4.5" fill="#ff8fa0" stroke-width="2.5"/>` +
        dot(24, 29, 1.5) +
        dot(28, 29, 1.5),
    ) +
    tray +
    `<path d="M20 66C20 54 34 50 50 52C66 48 82 54 80 68C82 78 66 84 50 82C32 84 20 76 20 66Z" fill="#f59a9a"/>` +
    `<path d="M20 64C20 54 34 50 50 52C66 48 82 54 80 64C70 58 60 60 50 60C38 60 28 58 20 64Z" fill="#fff4ec"/>` +
    `<path d="M34 72q8-4 16 0M56 74q6-3 12 0" stroke="#ffc4c4" stroke-width="3"/>`,
  삼겹살:
    `<ellipse cx="50" cy="54" rx="44" ry="36" fill="#3a3f4f"/><ellipse cx="50" cy="54" rx="36" ry="28" stroke="#5a6278" stroke-width="3"/>` +
    `<path d="M22 36L78 72M34 26L86 60M14 50L64 84" stroke="#5a6278" stroke-width="3"/>` +
    [30, 54, 78]
      .map(
        (y, i) =>
          `<g transform="translate(${48 + (i - 1) * 3} ${y}) rotate(-8)">` +
          `<rect x="-30" y="-9" width="60" height="18" rx="5" fill="#fff3ea" stroke="none"/>` +
          `<rect x="-30" y="-9" width="60" height="6" fill="#f08a8a" stroke="none"/><rect x="-30" y="1" width="60" height="4" fill="#f08a8a" stroke="none"/>` +
          `<path d="M-18 -8l-5 16M0 -8l-5 16M18 -8l-5 16" stroke="#b0602a" stroke-width="3"/>` +
          `<rect x="-30" y="-9" width="60" height="18" rx="5"/></g>`,
      )
      .join(''),
  햄버그:
    plate(68, 46, 24) +
    `<path d="M16 60C16 48 30 42 44 42S72 48 72 60V64C72 78 16 78 16 64Z" fill="#6b3e26"/>` +
    `<ellipse cx="44" cy="58" rx="28" ry="15" fill="#8a5436"/>` +
    `<path d="M22 58C24 50 34 46 44 46S66 50 68 58C66 62 60 60 58 64C54 62 50 66 46 62C40 66 36 62 32 64C28 60 24 62 22 58Z" fill="#4a2a18"/>` +
    `<path d="M30 46C28 38 38 34 44 36C52 32 60 38 58 44C58 50 50 52 44 50C36 52 30 50 30 46Z" fill="#fff"/>` +
    `<circle cx="44" cy="43" r="6" fill="${HL}"/>` +
    blob('#43b04a', [
      [80, 52, 6],
      [86, 56, 5],
      [78, 58, 5],
    ]) +
    `<path d="M80 58V66" stroke="#3a9e47" stroke-width="4"/>` +
    `<ellipse cx="80" cy="74" rx="7" ry="5" fill="#ff9f1a"/>`,
  미트볼:
    plate(68, 46, 24) +
    `<path d="M16 66C16 54 32 48 50 48S84 54 84 66C84 78 66 84 50 84S16 78 16 66Z" fill="#e8553d"/>` +
    [
      [34, 62],
      [58, 58],
      [44, 76],
      [68, 72],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#8a5436"/><path d="M${x - 6} ${y - 3}a7 7 0 0 1 5-5" stroke="#b07048" stroke-width="3"/>`)
      .join('') +
    `<circle cx="50" cy="68" r="2" fill="#43b04a" stroke="none"/><circle cx="26" cy="72" r="2" fill="#43b04a" stroke="none"/><circle cx="76" cy="62" r="2" fill="#43b04a" stroke="none"/>` +
    tube('M88 10L66 44', '#dfe8f5', 4) +
    `<path d="M62 50L68 40M66 52L72 42M58 48L64 38" stroke-width="3"/>`,
  소시지빵:
    `<path d="M8 58C8 42 30 34 50 34S92 42 92 58C92 74 70 82 50 82S8 74 8 58Z" fill="#e8a14a"/>` +
    `<path d="M16 66C30 76 70 76 84 66" stroke="#c98033" stroke-width="3"/>` +
    tube('M16 54C32 46 68 46 84 54', '#c8553a', 13) +
    `<path d="M28 46l3 6M42 43l2 7M56 43l-1 7M70 45l-2 6" stroke="#ffb89a" stroke-width="3"/>` +
    `<path d="M20 50l6 6l6-8l6 8l6-8l6 8l6-8l6 8l6-8l6 8l4-5" stroke="#e8321f" stroke-width="3.5"/>` +
    `<path d="M22 58l6-6l6 7l6-7l6 7l6-7l6 7l6-7l6 7l6-6" stroke="#ffd23f" stroke-width="3"/>` +
    [
      [24, 64],
      [40, 68],
      [60, 68],
      [76, 64],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${HL}" stroke-width="1.8"/>`)
      .join(''),
  피자빵:
    `<path d="M12 56C12 76 30 88 50 88S88 76 88 56Z" fill="#d98a3a"/>` +
    `<ellipse cx="50" cy="56" rx="38" ry="24" fill="#e8a14a"/>` +
    `<ellipse cx="50" cy="55" rx="30" ry="17" fill="#e8553d"/>` +
    `<path d="M24 54C26 44 36 40 44 42C52 38 64 40 70 46C78 48 78 58 72 62C66 68 56 66 50 70C42 70 32 68 28 62C22 60 22 56 24 54Z" fill="#ffe08a"/>` +
    [
      [36, 50],
      [60, 48],
      [50, 62],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#c8321f"/>`)
      .join('') +
    `<ellipse cx="70" cy="58" rx="5" ry="3.5" stroke="#43b04a" stroke-width="3"/><ellipse cx="34" cy="62" rx="5" ry="3.5" stroke="#43b04a" stroke-width="3"/><ellipse cx="48" cy="46" rx="4" ry="3" stroke="#43b04a" stroke-width="3"/>`,
  버터쿠키:
    `<path d="M6 54V66C6 84 94 84 94 66V54Z" fill="#2f66c8"/>` +
    `<ellipse cx="50" cy="54" rx="44" ry="30" fill="#3b78e6"/>` +
    `<ellipse cx="50" cy="54" rx="36" ry="23" fill="#fff"/>` +
    flower(34, 50, 12, 8, 0.28, '#f5d08a') +
    `<circle cx="34" cy="50" r="4" fill="#e8a14a" stroke-width="2.5"/>` +
    flower(62, 64, 12, 8, 0.28, '#f5d08a') +
    `<circle cx="62" cy="64" r="4" fill="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="64" cy="42" r="11" fill="#f0c070"/><circle cx="64" cy="42" r="4.5" fill="#fff"/>` +
    `<rect x="26" y="64" width="18" height="10" rx="4" fill="#f5d08a"/>` +
    `<path d="M16 76Q50 88 84 76" stroke="#8fb8ff" stroke-width="3"/>`,
  초코칩쿠키:
    `<circle cx="66" cy="36" r="24" fill="#c98b4f"/>` +
    `<path d="M44 30C34 26 20 30 16 44C10 62 22 84 44 86C64 88 80 74 80 56C80 42 64 30 44 30Z" fill="#dca560"/>` +
    [
      [34, 48, 5],
      [52, 44, 5],
      [28, 66, 5.5],
      [46, 62, 6],
      [64, 58, 5],
      [42, 78, 5],
      [62, 74, 5],
      [76, 30, 4.5],
      [62, 22, 4],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a2a18" stroke-width="2"/>`)
      .join('') +
    [
      [86, 72],
      [80, 88],
    ]
      .map(([x, y]) => `<path d="M${x} ${y - 8}C${x + 2} ${y - 4} ${x + 6} ${y} ${x + 6} ${y + 2}a6 4 0 0 1 -12 0C${x - 6} ${y} ${x - 2} ${y - 4} ${x} ${y - 8}Z" fill="#4a2a18"/>`)
      .join(''),
  비스킷:
    `<g transform="rotate(12 62 38)">` +
    scallopRect(40, 16, 84, 56, 5, 5, 3.5, '#d9913a') +
    `</g><g transform="rotate(-8 42 60)">` +
    scallopRect(14, 36, 70, 84, 6, 5, 3.5, '#eab05c') +
    `<rect x="21" y="43" width="42" height="34" rx="3" stroke="#f7d38e" stroke-width="3"/>` +
    [30, 42, 54]
      .flatMap((x) => [52, 60, 68].map((y) => dot(x, y, 2.4, '#9a5b2e')))
      .join('') +
    `</g>`,
  크래커:
    `<rect x="22" y="24" width="56" height="56" rx="4" fill="#e0bf82" transform="translate(6 6)"/>` +
    `<rect x="22" y="24" width="56" height="56" rx="4" fill="#f5dda6"/>` +
    [32, 50, 68]
      .flatMap((x) => [34, 52, 70].map((y) => dot(x, y, 2.4, '#b8894a')))
      .join('') +
    `<path d="M46 20L80 30L70 62Z" fill="#ffd23f" transform="translate(4 -6)"/>` +
    `<circle cx="72" cy="34" r="3.5" fill="#f2b92a" stroke-width="2"/><circle cx="68" cy="46" r="2.8" fill="#f2b92a" stroke-width="2"/>` +
    [
      [40, 42],
      [60, 62],
      [30, 60],
      [44, 74],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="3" fill="#fff" stroke="none"/>`)
      .join(''),
  웨하스:
    [
      [14, 58, 58, 22, 12],
      [22, 34, 58, 18, 10],
    ]
      .map(
        ([x, y, w, h, d]) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f5d690"/>` +
          `<rect x="${x}" y="${y + h * 0.3}" width="${w}" height="${f(h * 0.14)}" fill="#ff9aa8" stroke="none"/><rect x="${x}" y="${y + h * 0.65}" width="${w}" height="${f(h * 0.14)}" fill="#ff9aa8" stroke="none"/>` +
          `<path d="M${x + w} ${y}L${x + w + d} ${y - d}V${y - d + h}L${x + w} ${y + h}Z" fill="#e8c070"/>` +
          `<path d="M${x} ${y}L${x + d} ${y - d}H${x + w + d}L${x + w} ${y}Z" fill="#f5d690"/>` +
          Array.from({ length: 6 }, (_, i) => {
            const px = x + ((i + 1) * w) / 7;
            return `<path d="M${f(px)} ${y}l${d} ${-d}" stroke="#d9a850" stroke-width="2.5"/>`;
          }).join('') +
          `<path d="M${x + d / 2} ${y - d / 2}H${x + w + d / 2}" stroke="#d9a850" stroke-width="2.5"/>` +
          `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`,
      )
      .join(''),
  전병:
    [78, 71, 64]
      .map((y) => `<ellipse cx="50" cy="${y}" rx="36" ry="9" fill="#e8c27a"/>`)
      .join('') +
    `<circle cx="50" cy="40" r="28" fill="#f0cf8a"/><circle cx="50" cy="40" r="22" stroke="#e0b060" stroke-width="3"/>` +
    `<rect x="41" y="31" width="18" height="18" rx="3" fill="#26332a" transform="rotate(12 50 40)"/>` +
    [
      [34, 32],
      [64, 30],
      [36, 52],
      [66, 50],
      [50, 22],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.3" fill="#fff" stroke-width="1.5"/>`)
      .join(''),
  강정: (() => {
    const pieces: [number, number, string, string][] = [
      [12, 56, '#fff3d6', '#e8d4a8'],
      [52, 60, '#ffc4d0', '#e89aaa'],
      [32, 28, '#d8eeb0', '#a8c880'],
    ];
    return pieces
      .map(([x, y, c, line]) => {
        const g: string[] = [];
        for (let i = 0; i < 5; i++)
          for (let j = 0; j < 3; j++) g.push(`<ellipse cx="${x + 5 + i * 7 + (j % 2) * 3}" cy="${y + 6 + j * 8}" rx="2.8" ry="1.9" fill="#fff" stroke="${line}" stroke-width="1.6"/>`);
        return scallopRect(x, y, x + 38, y + 28, 7, 5, 2.2, c) + g.join('');
      })
      .join('');
  })(),
  뻥튀기:
    `<path d="M66 20.8A36 36 0 1 0 81.8 39.7Q72 40 73 31Q66 29 66 20.8Z" fill="#fff8e6"/>` +
    `<circle cx="48" cy="52" r="28" stroke="#ecd9a8" stroke-width="3"/>` +
    (() => {
      const g: string[] = [];
      for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
          const x = 20 + i * 8 + (j % 2) * 4;
          const y = 24 + j * 8;
          const dx = x - 48;
          const dy = y - 52;
          if (dx * dx + dy * dy < 31 * 31 && !(x > 60 && y < 40)) g.push(`<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.8" fill="#eedcb0" stroke="none"/>`);
        }
      return g.join('');
    })() +
    `<circle cx="86" cy="22" r="2.5" fill="#fff8e6" stroke-width="2"/><circle cx="90" cy="32" r="2" fill="#fff8e6" stroke-width="2"/>`,
  박하사탕:
    `<path d="M24 20C34 10 48 12 52 22C42 28 30 28 24 20Z" fill="#5fc24a"/><path d="M28 20H48" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M76 12C88 12 94 24 90 32C80 30 74 22 76 12Z" fill="#43b04a"/>` +
    `<path d="M30 44L14 32V58Z" fill="#dff3ff"/><path d="M70 44L86 32V58Z" fill="#dff3ff"/>` +
    `<circle cx="50" cy="44" r="20" fill="#fff"/><circle cx="50" cy="44" r="13" stroke="#b8ecd8" stroke-width="3.5"/>` +
    `<path d="M40 38a11 11 0 0 1 8-6" stroke="#dff3ff" stroke-width="3"/>` +
    [
      [30, 76],
      [68, 78],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#fff"/><circle cx="${x}" cy="${y}" r="9" stroke="#b8ecd8" stroke-width="3.5"/>`)
      .join('') +
    sparkle(88, 66, 6, '#7ec8f0'),
  알사탕:
    ball(28, 74, 13, '#e8553d') +
    ball(54, 76, 13, '#ffd23f') +
    ball(78, 72, 12, '#43b04a') +
    ball(40, 54, 13, '#a45cf0') +
    ball(66, 52, 13, '#ff9f1a') +
    `<path d="M40 28L26 18V38Z" fill="#ff9aa8"/><path d="M62 28L76 18V38Z" fill="#ff9aa8"/>` +
    ball(51, 28, 12, '#ff5c70'),
  젤리빈:
    bean(30, 30, -20, '#e8553d') +
    bean(58, 26, 15, '#ffd23f') +
    bean(80, 42, 60, '#43b04a') +
    bean(24, 54, 30, '#a45cf0') +
    bean(50, 50, -10, '#ff9f1a') +
    bean(72, 66, -30, '#ff5c70') +
    bean(36, 76, 10, '#3b8fe0') +
    bean(58, 80, -45, '#fff'),
  마시멜로:
    `<path d="M62 94L84 22" stroke="#c98b4f" stroke-width="4"/>` +
    [
      [24, 64, '#fff'],
      [48, 70, '#ffc4d4'],
      [34, 42, '#ffc4d4'],
    ]
      .map(
        ([x, y, c]) =>
          `<path d="M${Number(x) - 13} ${y}V${Number(y) + 16}C${Number(x) - 13} ${Number(y) + 22} ${Number(x) + 13} ${Number(y) + 22} ${Number(x) + 13} ${Number(y) + 16}V${y}Z" fill="${c}"/>` +
          `<ellipse cx="${x}" cy="${y}" rx="13" ry="6" fill="${c}"/><path d="M${Number(x) - 8} ${Number(y) + 8}v8" stroke="#fff" stroke-width="2.5" opacity=".6"/>`,
      )
      .join('') +
    `<g transform="rotate(17 80 30)"><path d="M68 22V40C68 46 92 46 92 40V22Z" fill="#f0c080"/><ellipse cx="80" cy="22" rx="12" ry="5.5" fill="#fff4dc"/><path d="M70 36C76 40 86 40 90 36" stroke="#c98b4f" stroke-width="3"/></g>`,
  초코바:
    `<g transform="rotate(-25 50 50) translate(50 50) scale(1.15 1.35) translate(-50 -50)">` +
    `<path d="M44 38H80Q86 41 81 45Q87 49 81 53Q86 57 80 62H44Z" fill="#6b3a22"/>` +
    `<path d="M76 43Q80 46 77 49Q81 52 77 56" stroke="#e8a14a" stroke-width="4"/>` +
    `<path d="M50 43h16M50 57h20" stroke="#8e5232" stroke-width="3"/>` +
    `<path d="M8 36L14 40L8 44L14 48L8 52L14 56L8 60L14 64H48V34H14Z" fill="#e8553d"/>` +
    `<path d="M48 34L56 40L48 48L56 56L48 64" fill="#e8553d"/>` +
    `<path d="M20 44H44M20 54H44" stroke="#ffd23f" stroke-width="4"/>` +
    `</g>`,
  초코우유:
    carton(
      '#8a5436',
      '#b07048',
      `<rect x="28" y="54" width="22" height="18" rx="2" fill="#6b3a22" stroke-width="2.5"/><path d="M39 54V72M28 63H50" stroke="#8e5232" stroke-width="2.5"/>`,
    ) +
    `<g transform="rotate(12 80 72)"><rect x="66" y="56" width="26" height="32" rx="3" fill="#6b3a22"/><path d="M79 56V88M66 67H92M66 78H92" stroke="#8e5232" stroke-width="3"/></g>`,
  딸기우유:
    carton(
      '#ff9aa8',
      '#ffc4cc',
      `<path d="M39 72C30 68 28 58 32 56C35 54 38 55 39 57C40 55 43 54 46 56C50 58 48 68 39 72Z" fill="#e8553d" stroke-width="2.5"/><path d="M35 54L39 57L43 54" stroke="#43b04a" stroke-width="3"/>`,
    ) +
    `<path d="M80 92C66 86 62 70 68 66C72 63 77 64 80 68C83 64 88 63 92 66C98 70 94 86 80 92Z" fill="#e8553d"/>` +
    `<path d="M72 62L80 68L88 62L80 58Z" fill="#43b04a"/>` +
    dot(74, 74, 1.5, '#ffd23f') +
    dot(84, 76, 1.5, '#ffd23f') +
    dot(80, 84, 1.5, '#ffd23f'),
  바나나우유:
    carton(
      '#ffd23f',
      '#ffe98a',
      `<path d="M28 58C30 68 42 72 50 64C44 66 34 64 30 56Z" fill="#ffc933" stroke-width="2.5"/>`,
    ) +
    `<path d="M64 60C66 80 80 90 94 84C84 82 72 74 70 58Z" fill="#ffd23f"/><path d="M64 60L68 54" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M70 64C72 74 80 80 88 82" stroke="#f2b92a" stroke-width="3"/>`,
  치즈케이크:
    `<ellipse cx="50" cy="82" rx="46" ry="10" fill="#dff3ff"/>` +
    `<path d="M14 58L90 44V70L14 84Z" fill="#ffe9a8"/>` +
    `<path d="M14 78L90 64V70L14 84Z" fill="#b07048"/>` +
    `<path d="M14 58L70 30C80 32 88 38 90 44Z" fill="#f2c060"/>` +
    `<path d="M14 58L90 44V70L14 84Z"/>` +
    `<path d="M10 30L32 14L40 36Z" fill="#ffd23f"/><path d="M10 30L40 36V42L10 36Z" fill="#f2b92a"/>` +
    `<circle cx="28" cy="26" r="2.8" fill="#f2b92a" stroke-width="2"/><circle cx="24" cy="39" r="2" fill="#e0a020" stroke="none"/>`,
  생크림케이크:
    `<ellipse cx="50" cy="84" rx="44" ry="9" fill="#ffc4d4"/>` +
    `<path d="M14 48V76C14 88 86 88 86 76V48Z" fill="#fff"/>` +
    `<path d="M14 76q6 6 12 0t12 0t12 0t12 0t12 0t12 0" stroke="#dfe8f5" stroke-width="3.5"/>` +
    `<ellipse cx="50" cy="48" rx="36" ry="13" fill="#fffdf7"/>` +
    [
      [20, 50],
      [32, 57],
      [50, 60],
      [68, 57],
      [80, 50],
    ]
      .map(([x, y]) => `<path d="M${x - 6} ${y}C${x - 6} ${y - 6} ${x - 2} ${y - 8} ${x} ${y - 11}C${x + 2} ${y - 8} ${x + 6} ${y - 6} ${x + 6} ${y}Z" fill="#fff"/>`)
      .join('') +
    [
      [36, 44],
      [50, 40],
      [64, 44],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x} ${y + 6}C${x - 8} ${y + 2} ${x - 8} ${y - 8} ${x} ${y - 7}C${x + 8} ${y - 8} ${x + 8} ${y + 2} ${x} ${y + 6}Z" fill="#e8553d"/>` +
          `<path d="M${x - 4} ${y - 8}L${x} ${y - 5}L${x + 4} ${y - 8}" stroke="#43b04a" stroke-width="3"/>`,
      )
      .join(''),
  롤케이크:
    `<ellipse cx="54" cy="84" rx="42" ry="8" fill="#dfe8f5"/>` +
    `<path d="M36 34H80C88 34 92 46 92 58S88 82 80 82H36Z" fill="#b8702e"/>` +
    `<path d="M50 40q6 3 12 0M66 44q6 3 12 0M56 50q6 3 12 0" stroke="#fff" stroke-width="2.5" opacity=".6"/>` +
    `<ellipse cx="36" cy="58" rx="22" ry="24" fill="#ffd766"/>` +
    `<path d="M36 58a3 3 0 0 1 6 0a7 7 0 0 1 -13 0a10 10 0 0 1 20 0a14 14 0 0 1 -28 0" stroke="#fff" stroke-width="5"/>` +
    `<ellipse cx="36" cy="58" rx="22" ry="24"/><ellipse cx="36" cy="58" rx="19" ry="21" stroke="#b8702e" stroke-width="3"/>`,
  카스텔라:
    block(
      10,
      38,
      60,
      18,
      [
        ['#8a4a22', 8],
        ['#ffd766', 32],
        ['#b07048', 4],
      ],
      '#9a5b2e',
    ) +
    [
      [20, 56],
      [36, 64],
      [54, 58],
      [28, 72],
      [60, 72],
      [46, 76],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#e8b030'))
      .join(''),
  슈크림:
    `<path d="M58 40C56 28 66 20 76 22C86 22 94 30 92 42C92 50 86 54 76 54S58 50 58 40Z" fill="#e0a050"/>` +
    `<path d="M10 66C8 48 24 38 36 40C42 32 58 32 62 40C76 38 88 50 84 66C82 78 68 84 48 84S12 78 10 66Z" fill="#e8a850"/>` +
    `<path d="M14 62C20 56 26 64 32 56C38 64 44 54 50 62C56 54 62 64 68 56C74 64 78 58 82 62C80 70 70 72 48 72S16 70 14 62Z" fill="#fff0b0"/>` +
    `<path d="M28 44q6-4 12 0M48 40q6-3 10 1M66 46q5-2 10 2" stroke="#c98033" stroke-width="3"/>` +
    [
      [24, 50],
      [44, 46],
      [62, 50],
      [72, 30],
      [84, 36],
      [36, 78],
      [60, 78],
    ]
      .map(([x, y]) => dot(x, y, 2, '#fff'))
      .join(''),
  티라미수:
    `<ellipse cx="52" cy="84" rx="44" ry="9" fill="#fff"/>` +
    block(
      16,
      44,
      56,
      14,
      [
        ['#6b3e26', 6],
        ['#fff3dc', 9],
        ['#a8703f', 7],
        ['#fff3dc', 8],
        ['#a8703f', 6],
      ],
      '#7a4a2a',
    ) +
    [
      [28, 38],
      [44, 36],
      [60, 38],
      [74, 34],
      [36, 42],
      [66, 42],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#4a2a18'))
      .join('') +
    `<path d="M50 38C46 30 50 24 58 24C58 32 56 36 50 38Z" fill="#43b04a"/>`,
  꽈배기: (() => {
    const g: string[] = [];
    for (let i = 0; i < 6; i++) {
      const x = 18 + i * 13;
      const y = 74 - i * 8.5;
      g.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="15" ry="10.5" transform="rotate(50 ${f(x)} ${f(y)})" fill="${i % 2 ? '#e0983e' : '#eaa94e'}"/>`);
      g.push(`<path d="M${f(x - 3)} ${f(y - 8)}q3 2 3 7" stroke="#f7cc88" stroke-width="3"/>`);
    }
    return (
      g.join('') +
      [
        [14, 70],
        [28, 70],
        [40, 58],
        [52, 54],
        [62, 42],
        [76, 38],
        [86, 26],
        [20, 84],
        [48, 66],
        [74, 50],
      ]
        .map(([x, y]) => dot(x, y, 1.7, '#fff'))
        .join('')
    );
  })(),
  찹쌀떡:
    `<ellipse cx="50" cy="76" rx="46" ry="14" fill="#dff3ff"/>` +
    mochi(64, 50, 20) +
    mochi(30, 68, 20) +
    `<ellipse cx="68" cy="72" rx="17" ry="14" fill="#fff"/><ellipse cx="68" cy="72" rx="10" ry="8" fill="#6b2a2a"/>` +
    `<path d="M64 69q3-2 6 0" stroke="#8e4040" stroke-width="2.5"/>`,
  바람떡:
    `<ellipse cx="50" cy="76" rx="46" ry="14" fill="#dff3ff"/>` +
    halfMoon(50, 44, 22, '#fff', 0, '#f0e6e0') +
    halfMoon(28, 74, 22, '#ffb3c8', -8, '#f59ab2') +
    halfMoon(72, 76, 22, '#a8d88a', 8, '#94c878'),
  절편:
    `<ellipse cx="50" cy="60" rx="46" ry="30" fill="#c98b4f"/><ellipse cx="50" cy="58" rx="38" ry="23" stroke="#e0a868" stroke-width="3"/>` +
    jeolpyeon(33, 46, -8, '#fff', '#c8d0e0') +
    jeolpyeon(66, 44, 6, '#8cc06a', '#5f9a45') +
    jeolpyeon(32, 72, 5, '#8cc06a', '#5f9a45') +
    jeolpyeon(66, 72, -6, '#fff', '#c8d0e0'),
  백설기:
    `<ellipse cx="52" cy="84" rx="44" ry="9" fill="#c98b4f"/>` +
    block(12, 40, 58, 18, [['#fff', 42]], '#fff', `<path d="M41 40V82M21 31H79M41 40L50 22" stroke="#dfe8f5" stroke-width="3"/>`) +
    [
      [22, 56],
      [32, 70],
      [54, 60],
      [62, 74],
    ]
      .map(([x, y]) => dot(x, y, 1.6, '#dfe8f5'))
      .join('') +
    sparkle(86, 16, 7) +
    sparkle(14, 20, 5),
  무지개떡:
    `<ellipse cx="52" cy="84" rx="44" ry="9" fill="#dfe8f5"/>` +
    block(
      12,
      36,
      58,
      18,
      [
        ['#ff9aa8', 9],
        ['#ffe066', 9],
        ['#fff', 9],
        ['#a8d88a', 9],
        ['#c8a0f0', 9],
      ],
      '#ff9aa8',
      `<path d="M41 36V81" stroke="#fff" stroke-width="2.5" opacity=".7"/>`,
    ),
  팥죽:
    steam(26) +
    bowl(
      48,
      '#7a2e2a',
      '#fff',
      [
        [34, 48],
        [50, 52],
        [64, 45],
        [46, 42],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#fff" stroke-width="2.5"/>`)
        .join('') + `<path d="M60 54q4-2 8 0" stroke="#a04840" stroke-width="3"/>`,
      '#3b78e6',
      14,
    ),
  호박죽:
    `<path d="M70 16C70 12 72 10 74 8" stroke="#3a9e47" stroke-width="4"/>` +
    blob('#ff9f1a', [
      [64, 28, 11],
      [74, 26, 12],
      [84, 28, 11],
    ]) +
    `<path d="M74 16V38M66 20C62 28 64 34 66 36M82 20C86 28 84 34 82 36" stroke="#e8862e" stroke-width="3"/>` +
    bowl(
      54,
      '#ffb830',
      '#fff',
      `<path d="M34 54q8-6 16 0t16 0" stroke="#ffd87a" stroke-width="3.5"/>` +
        [
          [30, 52],
          [44, 58],
          [58, 50],
          [68, 58],
        ]
          .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="2" fill="#8a3a30" stroke-width="1.5"/>`)
          .join(''),
      '#43b04a',
      14,
    ) +
    `<path d="M26 34c-5-5 5-9 0-15M40 32c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`,
  전복죽:
    `<g transform="rotate(-12 72 24)"><path d="M52 26C50 12 66 6 80 8C92 10 96 22 90 32C84 40 60 40 52 26Z" fill="#a08a78"/>` +
    `<path d="M58 26C58 16 70 12 80 14C88 16 90 24 86 30C80 36 62 36 58 26Z" fill="#c8e8f0"/>` +
    `<path d="M62 26C62 20 72 18 78 19C84 20 86 26 82 29C76 33 64 32 62 26Z" fill="#e8d8b0" stroke-width="2.5"/>` +
    `<path d="M66 26q6-4 14-2" stroke="#b8a070" stroke-width="2.5"/>` +
    dot(60, 12, 2, '#5a4a3a') +
    dot(68, 9, 2, '#5a4a3a') +
    dot(76, 8, 2, '#5a4a3a') +
    dot(84, 9, 2, '#5a4a3a') +
    `</g>` +
    bowl(
      54,
      '#dcd9a0',
      '#fff',
      [
        [34, 54],
        [54, 50],
        [66, 58],
      ]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" fill="#d8c8a8" stroke-width="2.5"/><ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" fill="#8a7a60" stroke="none"/>`)
        .join('') +
        `<rect x="44" y="56" width="4" height="4" fill="#ff9f1a" stroke="none"/><rect x="58" y="44" width="4" height="4" fill="#ff9f1a" stroke="none"/>` +
        `<circle cx="26" cy="58" r="2" fill="#43b04a" stroke="none"/><circle cx="74" cy="50" r="2" fill="#43b04a" stroke="none"/>`,
      '#3b8fe0',
      14,
    ),
  매실차:
    teacup(
      '#d6cf62',
      `<circle cx="32" cy="44" r="4.5" fill="#8cc63f" stroke-width="2"/><circle cx="46" cy="46" r="4.5" fill="#8cc63f" stroke-width="2"/>`,
    ) +
    `<path d="M76 54C80 44 92 42 96 46C92 54 82 56 76 54Z" fill="#3a9e47"/>` +
    `<circle cx="78" cy="70" r="11" fill="#8cc63f"/><circle cx="88" cy="84" r="9" fill="#9ccf4a"/>` +
    `<path d="M74 66a5 5 0 0 1 4-4M85 81a4 4 0 0 1 3-3" stroke="#d8f0a8" stroke-width="3"/><path d="M78 59v4" stroke-width="3"/>`,
  유자차:
    teacup(
      '#ffc933',
      `<path d="M28 44l8-3M44 46l8-2M40 40l6 1" stroke="#ff8a1a" stroke-width="3.5"/>`,
    ) +
    flower(81, 72, 12, 14, 0.06, '#ffcf2a') +
    `<path d="M81 60V56" stroke="#6b3e26" stroke-width="3.5"/><path d="M83 57C88 50 96 50 97 54C93 60 88 60 83 57Z" fill="#3a9e47"/>` +
    dot(76, 70, 1.4, '#e8a800') +
    dot(84, 76, 1.4, '#e8a800') +
    dot(80, 80, 1.4, '#e8a800') +
    dot(86, 68, 1.4, '#e8a800'),
  생강차:
    teacup(
      '#c98b4f',
      `<circle cx="32" cy="44" r="4.5" fill="#fff0b0" stroke-width="2"/><circle cx="48" cy="45" r="4.5" fill="#fff0b0" stroke-width="2"/>`,
    ) +
    blob('#e8c890', [
      [78, 78, 8],
      [86, 68, 7],
      [74, 64, 6],
      [90, 82, 6],
    ]) +
    `<path d="M72 78h4M84 64l3 2M82 84l3-2" stroke="#b08a5a" stroke-width="2.5"/>` +
    `<ellipse cx="86" cy="52" rx="8" ry="6" fill="#fff0b0"/><ellipse cx="86" cy="52" rx="4" ry="2.6" stroke="#e8c860" stroke-width="2.5"/>`,
  대추차:
    teacup(
      '#8a3a22',
      `<ellipse cx="32" cy="44" rx="3" ry="1.8" fill="#fff4dc" stroke-width="1.8"/><ellipse cx="40" cy="41" rx="3" ry="1.8" fill="#fff4dc" stroke-width="1.8"/>` +
        `<ellipse cx="50" cy="45" rx="5" ry="3" fill="#c8402a" stroke-width="2"/><ellipse cx="50" cy="45" rx="2" ry="1" fill="#fff4dc" stroke="none"/>`,
    ) +
    `<ellipse cx="80" cy="68" rx="9" ry="12" fill="#b8322a" transform="rotate(-15 80 68)"/><ellipse cx="88" cy="84" rx="8" ry="10" fill="#a8261f" transform="rotate(20 88 84)"/>` +
    `<path d="M76 62a5 7 0 0 1 3-5M85 80a4 5 0 0 1 2-4" stroke="#e87060" stroke-width="3"/><path d="M82 56L84 50" stroke="#6b3e26" stroke-width="3"/>`,
  꿀물:
    `<path d="M22 24L28 90H64L70 24Z" fill="#f4fbff"/>` +
    `<path d="M24 42L29 86H63L68 42Z" fill="#ffe38a" stroke="none"/><path d="M24 42H68"/>` +
    `<path d="M32 78C38 72 50 80 58 74" stroke="#f2b92a" stroke-width="4"/>` +
    `<path d="M22 24L28 90H64L70 24Z"/>` +
    `<path d="M32 50L35 74" stroke="#fff6c8" stroke-width="4"/>` +
    tube('M94 6L70 24', '#c98b4f', 4) +
    `<ellipse cx="62" cy="30" rx="11" ry="8" fill="#f2a93a" transform="rotate(-35 62 30)"/>` +
    `<path d="M56 28l8 -6M59 33l8-6" stroke="#c9762a" stroke-width="2.5"/>` +
    `<path d="M56 38C54 40 54 42 54 44" stroke="${HL}" stroke-width="4"/>` +
    `<path d="M54 44c-3 5-4 7-4 9a4 4 0 0 0 8 0c0-2-1-4-4-9Z" fill="${HL}"/>`,
};
