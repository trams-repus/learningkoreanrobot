// 음식 그림 묶음 (3단계 어휘: 빵·디저트·마실 것·열대 과일·반찬·전·찌개·국·탕·면). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리는 그릇과 색, 건더기로 구별한다:
//   찌개: 순두부찌개(검은 뚝배기·빨간 국물·흰 순두부·달걀) / 청국장(갈색 뚝배기·콩알 가득) / 계란찜(뚝배기 위로 부푼 노란 달걀)
//   국·탕: 육개장(흰 대접·빨간 국물·고기 결·긴 대파) / 설렁탕(뚝배기·뽀얀 국물·소면) / 곰탕(놋그릇·맑은 국물·고기 편)
//          감자탕(빨간 냄비·뼈·통감자·깻잎) / 추어탕(풀빛 국물·시래기·미꾸라지) / 해장국(주황 국물·우거지·콩나물)
//          콩나물국(콩나물 가득) / 북엇국(북어 한 마리·하얀 국물·달걀 줄) / 어묵탕(꼬치 어묵이 솟은 냄비)
//   면: 라볶이(검은 팬·떡+라면) / 쫄면(굵은 노란 면·양배추) / 비빔국수(가는 붉은 면·김치) / 잔치국수(맑은 국물·색색 고명)
//       막국수(놋그릇·회갈색 메밀면·김가루) / 물냉면(은색 그릇·얼음 국물) / 비빔냉면(은색 그릇·국물 없이 빨간 양념)
//   전: 감자전(옅은 노랑·감자) / 녹두전(두툼한 갈색·녹두 종지) / 해물파전(파+새우+오징어 고리)
//   고기: 함박스테이크(철판·소스·달걀프라이) / 떡갈비(뼈 꽂힌 동그란 떡갈비) / 제육볶음(빨간 고기 조각·양파) / 오징어볶음(다리 동글동글)
import { HL, dot, blob, sparkle, tube } from '../pictureKit.ts';

const f = (n: number) => Number(n.toFixed(1));

/** 그릇 (조금 내려다본 모양): 국물 면(soup) + 건더기(inner) + 앞쪽 몸통 + 굽 */
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

/** 뚝배기: 나무 받침 + 두꺼운 테 + 국물 + 둥근 몸통 */
function ttuk(cy: number, soup: string, inner: string, body = '#6b3e26', rim = '#8a5436'): string {
  return (
    `<ellipse cx="50" cy="${cy + 40}" rx="44" ry="7" fill="#d9a066"/>` +
    `<ellipse cx="50" cy="${cy}" rx="39" ry="14" fill="${rim}"/>` +
    `<ellipse cx="50" cy="${cy + 1}" rx="31" ry="10" fill="${soup}"/>` +
    inner +
    `<path d="M11 ${cy}C11 ${cy + 30} 26 ${cy + 40} 50 ${cy + 40}S89 ${cy + 30} 89 ${cy}C89 ${cy + 8} 71 ${cy + 14} 50 ${cy + 14}S11 ${cy + 8} 11 ${cy}Z" fill="${body}"/>` +
    `<path d="M20 ${cy + 20}Q50 ${cy + 30} 80 ${cy + 20}" stroke="${rim}" stroke-width="3"/>`
  );
}

/** 냄비 (곧은 옆면 + 양쪽 손잡이) */
function pot(cy: number, soup: string, inner: string, body: string, rx = 36, depth = 30, handle = '#e0a800'): string {
  const l = 50 - rx;
  const r = 50 + rx;
  return (
    tube(`M${l} ${cy + 8}H${l - 8}`, handle, 4) +
    tube(`M${r} ${cy + 8}H${r + 8}`, handle, 4) +
    `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="12" fill="${soup}"/>` +
    inner +
    `<path d="M${l} ${cy}V${cy + depth}C${l} ${cy + depth + 9} ${r} ${cy + depth + 9} ${r} ${cy + depth}V${cy}C${r} ${cy + 7} ${r - 16} ${cy + 12} 50 ${cy + 12}S${l} ${cy + 7} ${l} ${cy}Z" fill="${body}"/>`
  );
}

/** 접시 (타원 + 안쪽 테) */
const plate = (cy: number, rx = 44, ry = 15, fill = '#fff', rim = '#dfe8f5') =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 5}" stroke="${rim}" stroke-width="3"/>`;

const steam = (y: number) =>
  `<path d="M36 ${y}c-5-5 5-9 0-15M50 ${y - 2}c-5-5 5-9 0-15M64 ${y}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`;

/** 테두리 있는 가는 줄 (채소 채·면 가닥) */
const strip = (d: string, c: string, w = 4) => `<path d="${d}" stroke-width="${w + 3}"/><path d="${d}" stroke="${c}" stroke-width="${w}"/>`;

/** 물결 줄 (면): (x, y)에서 오른쪽으로 n번 */
const waves = (x: number, y: number, n: number, st = 8, amp = 5) =>
  `M${x} ${y}q${st / 2} ${-amp} ${st} 0${`t${st} 0`.repeat(n - 1)}`;

/** 두부 조각 */
const tofu = (x: number, y: number, s = 9) =>
  `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="1.5" fill="#fffdf2" stroke-width="2.5"/>`;

/** 삶은 달걀 반쪽 */
const halfEgg = (x: number, y: number, s = 1) =>
  `<ellipse cx="${x}" cy="${y}" rx="${9 * s}" ry="${6.5 * s}" fill="#fff" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="${f(4 * s)}" fill="${HL}" stroke-width="2.5"/>`;

/** 송송 썬 파 */
const scallion = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#5fc24a" stroke-width="1.8"/>`;

/** 참깨 */
const sesame = (pts: [number, number][]) => pts.map(([x, y]) => dot(x, y, 1.5, '#fff')).join('');

/** 작은 채소·과일 알 (콩·메추리알) */
const oval = (x: number, y: number, rx: number, ry: number, fill: string, a = 0, sw = 2.5) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="${sw}"${a ? ` transform="rotate(${a} ${x} ${y})"` : ''}/>`;

/** 잎 한 장 */
const leaf = (x: number, y: number, a: number, fill = '#43b04a', s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C4 -8 14 -10 22 -8C18 0 8 4 0 0Z" fill="${fill}" stroke-width="2.5"/><path d="M3 -1.5L16 -6" stroke-width="1.8"/></g>`;

/** 멸치 한 마리 */
const anchovy = (x: number, y: number, a: number) =>
  `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M7 0L13 -4.5L12 0L13 4.5Z" fill="#d9bf7e" stroke-width="2"/><path d="M-11 0C-6 -5 4 -4.5 8 0C4 4.5 -6 5 -11 0Z" fill="#e8d49a" stroke-width="2.2"/><path d="M-4 0H5" stroke="#b09a6a" stroke-width="1.6"/>${dot(-7, -0.8, 1.4)}</g>`;

/** 은색 냉면 그릇 */
const silver = '#b8c2d6';

export const PICS: Record<string, string> = {
  크루아상:
    plate(86, 42, 9) +
    `<ellipse cx="13" cy="72" rx="10" ry="8" fill="#d9892e" transform="rotate(-50 13 72)"/>` +
    `<ellipse cx="87" cy="72" rx="10" ry="8" fill="#d9892e" transform="rotate(50 87 72)"/>` +
    `<ellipse cx="27" cy="55" rx="15" ry="20" fill="#e8a33d" transform="rotate(-38 27 55)"/>` +
    `<ellipse cx="73" cy="55" rx="15" ry="20" fill="#e8a33d" transform="rotate(38 73 55)"/>` +
    `<ellipse cx="50" cy="48" rx="19" ry="30" fill="#f0b24a"/>` +
    `<path d="M40 30Q50 24 60 30M37 48Q50 42 63 48M40 66Q50 61 60 66" stroke="#ffe0a0" stroke-width="3.5"/>` +
    `<path d="M18 50Q24 44 32 46M68 46Q76 44 82 50" stroke="#ffd48a" stroke-width="3"/>`,
  베이글:
    `<circle cx="50" cy="52" r="36" fill="#c9803a"/>` +
    `<path d="M24 34A32 32 0 0 1 60 20" stroke="#e8a860" stroke-width="5"/>` +
    `<circle cx="50" cy="52" r="11" fill="#fff7e0"/>` +
    `<path d="M40 60A13 13 0 0 0 62 58" stroke="#9a5b2e" stroke-width="2.5"/>` +
    Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + 0.2;
      const r = i % 2 ? 20 : 27;
      return oval(f(50 + Math.cos(a) * r), f(52 + Math.sin(a) * r), 2.8, 1.7, '#fff8e8', f((a * 180) / Math.PI + 40), 1.4);
    }).join(''),
  타르트:
    `<path d="M10 52L19 80C30 88 70 88 81 80L90 52Z" fill="#d99a4e"/>` +
    `<path d="M22 62L26 82M35 64L37 85M50 65V86M65 64L63 85M78 62L74 82" stroke="#a8682e" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="52" rx="40" ry="15" fill="#e8b060"/>` +
    `<ellipse cx="50" cy="51" rx="32" ry="10" fill="#fff1a8"/>` +
    `<path d="M26 50C24 40 32 36 34 36S42 40 40 50C37 53 29 53 26 50Z" fill="#e8403a"/>` +
    `<path d="M54 46C52 34 60 30 62 30S70 34 68 46C65 49 57 49 54 46Z" fill="#e8403a"/>` +
    dot(31, 44, 1.2, '#fff') +
    dot(35, 47, 1.2, '#fff') +
    dot(59, 38, 1.2, '#fff') +
    dot(63, 42, 1.2, '#fff') +
    `<circle cx="46" cy="54" r="7.5" fill="#6cc04a"/><circle cx="46" cy="54" r="2.5" fill="#fff" stroke="none"/>` +
    `<circle cx="74" cy="53" r="4.5" fill="#3b4fa0"/><circle cx="40" cy="44" r="4" fill="#3b4fa0"/><circle cx="62" cy="56" r="4" fill="#3b4fa0"/>` +
    `<path d="M50 42q4-8 10-8q-2 7-10 8Z" fill="#3a9e47" stroke-width="2"/>`,
  셔벗:
    tube('M70 60L90 26', '#dfe8f5', 4) +
    `<ellipse cx="91" cy="23" rx="5" ry="7" fill="#dfe8f5" transform="rotate(30 91 23)"/>` +
    `<circle cx="33" cy="48" r="15" fill="#ff9aa8"/>` +
    `<circle cx="67" cy="48" r="15" fill="#fff08a"/>` +
    `<circle cx="50" cy="32" r="16" fill="#b5e07a"/>` +
    `<path d="M26 44l3 2M36 40l2 3M30 53l3-1M60 44l3 2M70 40l2 3M66 54l3-1M44 28l3 2M54 24l2 3M50 36l3-1" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M16 54H84C84 72 70 80 50 80S16 72 16 54Z" fill="#dff3fb"/>` +
    `<path d="M24 60C26 68 32 72 38 74" stroke="#fff" stroke-width="3"/>` +
    `<rect x="45" y="79" width="10" height="9" fill="#dff3fb"/>` +
    `<ellipse cx="50" cy="90" rx="18" ry="4.5" fill="#dff3fb"/>` +
    `<path d="M50 16q3-9 11-10q-2 8-11 10Z" fill="#3a9e47" stroke-width="2"/>`,
  수정과:
    tube('M14 34L30 20', '#9a5b2e', 6) +
    tube('M18 40L36 28', '#b5773f', 6) +
    bowl(
      50,
      '#8e3a1e',
      '#fff8ea',
      `<path d="M46 46C44 40 52 38 56 40C62 38 66 44 62 48C60 54 50 54 46 46Z" fill="#e8862e" stroke-width="2.5"/>` +
        `<path d="M54 42l2 3" stroke="#6b3e26" stroke-width="2"/>` +
        oval(30, 50, 3.4, 2.2, '#fff3d0', 20, 1.8) +
        oval(36, 44, 3.4, 2.2, '#fff3d0', -30, 1.8) +
        oval(70, 50, 3.4, 2.2, '#fff3d0', 40, 1.8) +
        oval(72, 42, 3.4, 2.2, '#fff3d0', -10, 1.8) +
        oval(38, 56, 3.4, 2.2, '#fff3d0', 60, 1.8) +
        oval(62, 57, 3.4, 2.2, '#fff3d0', 0, 1.8),
      '#c0392b',
      14,
    ),
  레모네이드:
    tube('M58 30L70 6', '#ff5c70', 4) +
    `<path d="M26 22L31 90H69L74 22Z" fill="#eef8fd"/>` +
    `<path d="M27 34L31 90H69L73 34Z" fill="#fff08a" stroke="none"/>` +
    `<rect x="36" y="38" width="12" height="12" rx="2" fill="#fff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(12 42 44)"/>` +
    `<rect x="52" y="44" width="12" height="12" rx="2" fill="#fff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(-10 58 50)"/>` +
    `<circle cx="46" cy="72" r="8" fill="#ffd23f" stroke-width="2.5"/><path d="M46 66v12M40 72h12M42 68l8 8M50 68l-8 8" stroke="#fff" stroke-width="1.6"/>` +
    dot(58, 66, 1.8, '#fff') +
    dot(62, 78, 1.8, '#fff') +
    dot(38, 82, 1.8, '#fff') +
    `<path d="M26 22L31 90H69L74 22" />` +
    `<path d="M27 34H73" stroke="#f2c14e" stroke-width="2.5"/>` +
    `<circle cx="26" cy="24" r="14" fill="#ffd23f"/><circle cx="26" cy="24" r="10" fill="#fff4a0" stroke="#ffd23f" stroke-width="2"/>` +
    `<path d="M26 14v20M16 24h20M19 17l14 14M33 17l-14 14" stroke="#f2c14e" stroke-width="2"/>`,
  밀크셰이크:
    tube('M56 28L72 5', '#ff5c70', 4) +
    `<path d="M22 32H78L67 74H33Z" fill="#ffadc4"/>` +
    `<path d="M30 40L37 68" stroke="#fff" stroke-width="3.5" opacity=".6"/>` +
    `<rect x="45" y="74" width="10" height="10" fill="#ffe0ea"/>` +
    `<ellipse cx="50" cy="88" rx="19" ry="5" fill="#ffe0ea"/>` +
    blob('#fff', [
      [34, 32, 10],
      [50, 30, 12],
      [66, 32, 10],
      [48, 18, 9],
    ]) +
    `<path d="M40 26q8 5 16 0" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M50 9q2-6 8-7" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<circle cx="49" cy="10" r="6" fill="#e8403a"/>`,
  스무디:
    `<path d="M28 42L34 90H66L72 42Z" fill="#a45cf0"/>` +
    `<path d="M34 50L38 84" stroke="#c89af5" stroke-width="3.5"/>` +
    dot(50, 60, 1.8, '#5a2a8a') +
    dot(58, 72, 1.8, '#5a2a8a') +
    dot(46, 78, 1.8, '#5a2a8a') +
    dot(60, 54, 1.8, '#5a2a8a') +
    `<path d="M27 42C27 20 73 20 73 42Z" fill="#eef7ff"/>` +
    `<path d="M34 38C36 30 44 26 50 26" stroke="#fff" stroke-width="3"/>` +
    `<rect x="23" y="38" width="54" height="8" rx="4" fill="#dfe8f5"/>` +
    tube('M54 38L62 6', '#43b04a', 7) +
    `<path d="M70 70C68 60 76 56 78 56S88 60 86 70C83 74 73 74 70 70Z" fill="#e8403a"/>` +
    `<path d="M73 57l5 3l5-3" stroke="#3a9e47" stroke-width="3"/>` +
    `<circle cx="22" cy="80" r="7" fill="#3b4fa0"/><circle cx="22" cy="77" r="1.8" fill="#8a9ae0" stroke="none"/>`,
  함박스테이크:
    `<ellipse cx="50" cy="68" rx="46" ry="22" fill="#b5773f"/>` +
    `<ellipse cx="50" cy="64" rx="40" ry="18" fill="#3a3f55"/>` +
    `<ellipse cx="80" cy="64" rx="7" ry="5" fill="#ffd23f" stroke-width="2.5"/>` +
    blob('#43b04a', [
      [78, 52, 6],
      [84, 55, 5],
    ]) +
    `<ellipse cx="46" cy="60" rx="27" ry="17" fill="#7a4424"/>` +
    `<path d="M20 58C20 46 32 40 46 40S72 46 72 58C68 64 62 60 58 65C54 60 48 67 42 62C36 67 30 60 20 58Z" fill="#5a2e18"/>` +
    `<path d="M28 52Q34 46 42 46" stroke="#8a4e2a" stroke-width="3"/>` +
    blob('#fff', [
      [46, 40, 10],
      [36, 42, 6],
      [56, 42, 7],
    ]) +
    `<circle cx="47" cy="39" r="5.5" fill="${HL}" stroke-width="2.5"/>`,
  산적:
    plate(76, 44, 14) +
    tube('M8 40H92', '#e0b27a', 3) +
    tube('M8 62H92', '#e0b27a', 3) +
    ['#8a4e2a', '#43b04a', '#ffd23f', '#ff8c1a', '#8a4e2a', '#43b04a', '#ffd23f']
      .map((c, i) => `<rect x="${21 + i * 8.5}" y="26" width="8" height="50" rx="2.5" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M20 40H80M20 62H80" stroke="#e0b27a" stroke-width="3"/>`,
  두부조림:
    plate(64, 45, 26) +
    `<ellipse cx="50" cy="64" rx="34" ry="17" fill="#c65a2e" stroke="none"/>` +
    [
      [32, 56, -10],
      [56, 52, 8],
      [42, 72, 6],
      [66, 70, -8],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-13" y="-8" width="26" height="18" rx="3" fill="#fff3d6"/><rect x="-13" y="-8" width="26" height="12" rx="3" fill="#e8903a"/>${dot(-5, -3, 1.4, '#b02a1e')}${dot(4, -1, 1.4, '#b02a1e')}${dot(7, -5, 1.4, '#b02a1e')}</g>`,
      )
      .join('') +
    scallion(44, 50) +
    scallion(58, 64) +
    scallion(30, 66) +
    scallion(72, 58) +
    sesame([
      [36, 60],
      [62, 48],
      [48, 76],
    ]),
  멸치볶음:
    plate(62, 44, 30) +
    anchovy(32, 48, -20) +
    anchovy(56, 44, 15) +
    anchovy(74, 54, -60) +
    anchovy(28, 64, 25) +
    anchovy(50, 58, -5) +
    anchovy(66, 70, 30) +
    anchovy(40, 76, -15) +
    anchovy(44, 42, 160) +
    anchovy(58, 80, 170) +
    sesame([
      [38, 56],
      [62, 60],
      [50, 70],
      [30, 74],
      [70, 44],
    ]),
  장조림: bowl(
    50,
    '#7a4a2a',
    '#fff',
    `<rect x="40" y="46" width="14" height="10" rx="2" fill="#8a4e2a" stroke-width="2.5" transform="rotate(-10 47 51)"/><path d="M43 49l8 5" stroke="#b07a4a" stroke-width="1.8"/>` +
      `<rect x="56" y="50" width="14" height="10" rx="2" fill="#8a4e2a" stroke-width="2.5" transform="rotate(12 63 55)"/><path d="M59 53l8 3" stroke="#b07a4a" stroke-width="1.8"/>` +
      oval(32, 40, 11, 13, '#c98b4f') +
      `<path d="M26 34q3-3 6-3" stroke="#e8b880" stroke-width="2.5"/>` +
      `<ellipse cx="66" cy="38" rx="12" ry="9" fill="#d9a066" stroke-width="2.5"/><circle cx="66" cy="38" r="5" fill="#e8a820" stroke-width="2.5"/>` +
      oval(78, 50, 6, 3.5, '#43b04a', -20) +
      oval(24, 54, 6, 3.5, '#43b04a', 20),
    '#3b78e6',
    15,
  ),
  무말랭이:
    plate(64, 44, 26) +
    `<ellipse cx="50" cy="63" rx="30" ry="15" fill="#c8402a" stroke="none"/>` +
    [
      'M24 60c4-6 10 2 16-4',
      'M44 50c4-5 10 3 16-3',
      'M58 60c4-6 10 2 16-4',
      'M30 72c4-5 10 3 16-3',
      'M52 72c4-6 10 2 16-4',
      'M40 62c4-4 8 2 12-2',
      'M62 48c3-4 7 2 10-2',
    ]
      .map((d) => strip(d, '#e8703a', 5))
      .join('') +
    oval(30, 50, 7, 4, '#3a7a2e', -20) +
    oval(72, 70, 7, 4, '#3a7a2e', 25) +
    sesame([
      [36, 56],
      [56, 56],
      [46, 68],
      [66, 64],
    ]),
  리치:
    [
      [29, 40],
      [71, 40],
    ]
      .map(
        ([x, y]) =>
          tube(`M${x} ${y - 18}l${x < 50 ? 3 : -3} -8`, '#6b3e26', 3) +
          blob(
            '#d63a55',
            Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return [f(x + Math.cos(a) * 18), f(y + Math.sin(a) * 18), 4] as [number, number, number];
            }).concat([[x, y, 19]]),
          ) +
          [
            [-8, -8],
            [1, -11],
            [9, -6],
            [-12, 1],
            [-3, -1],
            [6, 3],
            [-7, 9],
            [2, 11],
            [11, 10],
          ]
            .map(([dx, dy]) => `<path d="M${x + dx - 3} ${y + dy + 2}L${x + dx} ${y + dy - 3}L${x + dx + 3} ${y + dy + 2}Z" fill="#a82438" stroke="none"/>`)
            .join(''),
      )
      .join('') +
    leaf(71, 14, -30, '#43b04a', 1) +
    `<path d="M26 72C26 94 74 94 74 72Z" fill="#d63a55"/>` +
    `<path d="M32 82l4 4M44 86l3 3M58 86l-3 3M68 82l-4 4" stroke="#a82438" stroke-width="2.5"/>` +
    `<circle cx="50" cy="66" r="20" fill="#f7f4ea"/>` +
    `<path d="M38 58q6-6 13-5" stroke="#fff" stroke-width="4"/>` +
    `<path d="M26 72C34 78 66 78 74 72" stroke-width="3.5"/>`,
  두리안: (() => {
    const cx = 50;
    const cy = 58;
    const rx = 34;
    const ry = 31;
    const spikes = Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const p = (t: number, k: number) => `${f(cx + Math.cos(t) * rx * k)} ${f(cy + Math.sin(t) * ry * k)}`;
      return `M${p(a - 0.17, 0.96)}L${p(a, 1.2)}L${p(a + 0.17, 0.96)}Z`;
    }).join('');
    const bumps = [
      [38, 44],
      [52, 40],
      [64, 46],
      [30, 58],
      [44, 56],
      [58, 56],
      [70, 60],
      [36, 72],
      [50, 70],
      [62, 74],
    ]
      .map(([x, y]) => `<path d="M${x - 4} ${y + 3}L${x} ${y - 4}L${x + 4} ${y + 3}Z" fill="#c8d860" stroke-width="2"/>`)
      .join('');
    return (
      tube('M50 26V10', '#8a5436', 5) +
      `<path d="${spikes}" fill="#9cb03a"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#9cb03a"/>` +
      bumps +
      `<path d="M72 84C70 74 78 70 84 72C92 74 94 84 88 88C82 92 74 90 72 84Z" fill="#ffe07a"/>`
    );
  })(),
  용과: (() => {
    const flap = (x: number, y: number, a: number) =>
      `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-6 3Q-4 -9 0 -15Q4 -9 6 3Z" fill="#ff4f9a" stroke-width="2.5"/><path d="M-2.6 -8Q-1.2 -12 0 -15Q1.2 -12 2.6 -8Q0 -7 -2.6 -8Z" fill="#6cc04a" stroke="none"/></g>`;
    return (
      `<ellipse cx="62" cy="42" rx="25" ry="29" fill="#ff4f9a" transform="rotate(20 62 42)"/>` +
      flap(52, 16, -30) +
      flap(72, 16, 25) +
      flap(84, 36, 70) +
      flap(84, 58, 110) +
      flap(58, 32, -5) +
      flap(70, 44, 10) +
      flap(62, 58, 0) +
      `<circle cx="36" cy="66" r="25" fill="#ff4f9a"/>` +
      `<circle cx="36" cy="66" r="20" fill="#fffaf5" stroke-width="2.5"/>` +
      Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.4;
        const r = 3 + ((i * 7) % 15);
        return dot(f(36 + Math.cos(a) * r), f(66 + Math.sin(a) * r), 1.6);
      }).join('')
    );
  })(),
  파파야:
    `<g transform="rotate(28 66 44)"><ellipse cx="66" cy="44" rx="17" ry="30" fill="#f2b233"/><path d="M60 24q-3 8-2 16" stroke="#ffd88a" stroke-width="3"/></g>` +
    tube('M72 14L76 6', '#6b8a2e', 4) +
    `<g transform="rotate(-18 40 58)">` +
    `<path d="M40 22C56 22 64 40 64 60C64 80 54 92 40 92S16 80 16 60C16 40 24 22 40 22Z" fill="#f2c14e"/>` +
    `<path d="M40 28C52 28 58 42 58 60C58 76 50 86 40 86S22 76 22 60C22 42 28 28 40 28Z" fill="#ff8c3a" stroke="none"/>` +
    `<ellipse cx="40" cy="62" rx="10" ry="19" fill="#ffc48a" stroke-width="2.5"/>` +
    [
      [37, 50],
      [43, 52],
      [38, 58],
      [44, 60],
      [36, 66],
      [42, 68],
      [39, 74],
    ]
      .map(([x, y]) => dot(x, y, 2.8, '#2a2230'))
      .join('') +
    `</g>`,
  모과:
    blob('#f5d63a', [
      [50, 58, 27],
      [36, 44, 13],
      [62, 40, 14],
      [74, 58, 12],
      [30, 66, 12],
      [56, 76, 13],
      [50, 34, 11],
    ]) +
    `<path d="M40 50Q46 62 42 74M66 46Q70 56 66 68" stroke="#e0b820" stroke-width="3"/>` +
    `<path d="M40 36Q48 28 58 30" stroke="#fff4a0" stroke-width="4"/>` +
    dot(56, 52, 1.8, '#b08a2a') +
    dot(60, 66, 1.8, '#b08a2a') +
    dot(48, 70, 1.8, '#b08a2a') +
    dot(34, 58, 1.8, '#b08a2a') +
    tube('M51 24L49 14', '#6b3e26', 3.5) +
    leaf(50, 15, -25, '#43b04a', 1.3),
  크랜베리:
    [
      [30, 50],
      [44, 46],
      [58, 45],
      [72, 50],
      [37, 40],
      [51, 36],
      [65, 38],
      [44, 30],
      [58, 28],
      [24, 56],
      [78, 56],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="8.5" fill="#c0162e"/><circle cx="${x - 3}" cy="${y - 3}" r="2" fill="#ff8a9a" stroke="none"/>`,
      )
      .join('') +
    `<path d="M14 54C14 78 30 90 50 90S86 78 86 54C86 60 70 64 50 64S14 60 14 54Z" fill="#b5773f"/>` +
    `<path d="M24 74Q50 84 76 74" stroke="#8a5436" stroke-width="3"/>` +
    leaf(62, 20, -40, '#3a9e47', 1.1) +
    leaf(62, 20, -120, '#43b04a', 0.9),
  사탕수수:
    [
      ['M32 92L40 20', 0],
      ['M56 94L60 16', 1],
    ]
      .map(([d]) => tube(d as string, '#8a4f6e', 11))
      .join('') +
    `<path d="M29 80h11M31 64h11M33 48h11M35 32h11M53 82h10M54 66h10M55 50h10M56 34h10" stroke="#e0bcd0" stroke-width="3"/>` +
    `<path d="M40 22C34 12 24 8 14 8C24 12 30 16 36 24Z" fill="#5fc24a"/>` +
    `<path d="M40 22C44 10 50 6 56 4C50 10 46 16 44 24Z" fill="#43b04a"/>` +
    `<path d="M60 18C66 8 76 6 88 8C78 10 70 14 64 20Z" fill="#5fc24a"/>` +
    `<path d="M60 18C58 10 52 6 46 6C52 10 56 14 58 20Z" fill="#43b04a"/>` +
    `<rect x="64" y="72" width="26" height="12" rx="3" fill="#8a4f6e"/>` +
    `<ellipse cx="90" cy="78" rx="4" ry="6" fill="#f6ecc8"/>` +
    `<path d="M76 72v12" stroke="#e0bcd0" stroke-width="3"/>`,
  감자전:
    `<ellipse cx="76" cy="30" rx="14" ry="11" fill="#c9a05a"/>` +
    dot(72, 27, 1.6, '#8a6a36') +
    dot(80, 33, 1.6, '#8a6a36') +
    plate(68, 45, 22) +
    `<ellipse cx="50" cy="62" rx="34" ry="21" fill="#f2d27a" stroke-width="6"/>` +
    `<ellipse cx="50" cy="62" rx="34" ry="21" fill="#f2d27a" stroke="#d9a040" stroke-width="3"/>` +
    [
      [30, 58, 20],
      [40, 52, -30],
      [52, 56, 10],
      [62, 50, -20],
      [70, 60, 30],
      [36, 68, -10],
      [48, 70, 40],
      [60, 68, -40],
      [44, 62, 70],
      [58, 62, 0],
    ]
      .map(([x, y, a]) => `<path d="M${x - 4} ${y}h8" stroke="#e0a840" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join(''),
  녹두전:
    `<ellipse cx="74" cy="28" rx="16" ry="9" fill="#fff"/>` +
    [
      [66, 26],
      [72, 24],
      [78, 25],
      [84, 28],
      [70, 30],
      [76, 30],
    ]
      .map(([x, y]) => oval(x, y, 3.2, 2.4, '#6cb840', 0, 1.6))
      .join('') +
    plate(70, 45, 22) +
    `<ellipse cx="50" cy="66" rx="35" ry="20" fill="#b07a30"/>` +
    `<ellipse cx="50" cy="62" rx="35" ry="20" fill="#e0a848"/>` +
    oval(36, 56, 6, 4, '#e8403a', -20) +
    oval(60, 54, 6, 4, '#e8403a', 20) +
    oval(52, 70, 6, 4, '#e8403a', -10) +
    oval(46, 58, 5, 3.5, '#8a4e2a', 10) +
    oval(68, 66, 5, 3.5, '#8a4e2a', -10) +
    `<path d="M28 64q4-3 8 0M40 72q4-3 8 0M60 62q4-3 8 0" stroke="#fff4c0" stroke-width="2.5"/>` +
    scallion(32, 70) +
    scallion(56, 64),
  해물파전:
    plate(70, 45, 20) +
    `<ellipse cx="50" cy="62" rx="38" ry="22" fill="#f2c14e"/>` +
    strip('M18 58L82 50', '#3a9e47', 5) +
    strip('M20 68L80 62', '#5fc24a', 5) +
    strip('M26 76L76 72', '#3a9e47', 5) +
    tube('M34 50a7 7 0 1 0 10 -3', '#ff8c5a', 5) +
    tube('M60 68a7 7 0 1 0 10 -3', '#ff8c5a', 5) +
    `<circle cx="60" cy="52" r="5.5" stroke-width="8"/><circle cx="60" cy="52" r="5.5" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="36" cy="70" r="5.5" stroke-width="8"/><circle cx="36" cy="70" r="5.5" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="74" cy="60" r="4.5" stroke-width="7"/><circle cx="74" cy="60" r="4.5" stroke="#fff" stroke-width="3.5"/>`,
  떡갈비:
    plate(70, 45, 20) +
    `<path d="M16 66C14 54 24 48 34 50C38 42 54 42 58 48C66 42 82 46 84 58C88 66 80 76 70 76H28C20 76 16 72 16 66Z" fill="#6cc04a"/>` +
    tube('M28 44L18 30', '#fff4e0', 5) +
    tube('M72 42L82 28', '#fff4e0', 5) +
    [
      [34, 58],
      [66, 56],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="18" ry="14" fill="#8a4424"/>` +
          `<path d="M${x - 10} ${y + 6}L${x - 2} ${y - 10}M${x - 2} ${y + 10}L${x + 6} ${y - 8}M${x + 6} ${y + 10}L${x + 12} ${y - 2}" stroke="#4a2412" stroke-width="3"/>` +
          `<path d="M${x - 12} ${y - 4}q4-6 10-7" stroke="#c07040" stroke-width="3"/>`,
      )
      .join('') +
    oval(50, 50, 2.6, 1.8, '#fff3d0', 20, 1.5) +
    oval(40, 52, 2.6, 1.8, '#fff3d0', -20, 1.5) +
    oval(62, 50, 2.6, 1.8, '#fff3d0', 40, 1.5),
  제육볶음:
    `<path d="M10 40C8 28 20 22 30 26C36 18 50 20 52 30C50 40 30 46 10 40Z" fill="#6cc04a"/>` +
    `<path d="M20 32L40 30" stroke="#3a9e47" stroke-width="2"/>` +
    plate(66, 44, 24) +
    [
      [34, 60, -20],
      [52, 54, 15],
      [66, 64, -10],
      [44, 72, 20],
      [58, 76, -25],
      [28, 72, 10],
      [72, 52, 30],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-11 -4C-6 -9 6 -8 11 -4C12 2 8 7 0 6C-8 7 -12 2 -11 -4Z" fill="#d8452e" stroke-width="2.5"/><path d="M-8 -5C-3 -8 4 -8 8 -5" stroke="#ffb08a" stroke-width="2"/></g>`,
      )
      .join('') +
    strip('M38 50q6-6 12 0', '#fff', 3) +
    strip('M58 66q6-6 12 0', '#fff', 3) +
    strip('M30 64q5-5 10 0', '#fff', 3) +
    scallion(46, 62) +
    scallion(62, 56) +
    scallion(40, 80) +
    sesame([
      [54, 64],
      [36, 56],
      [68, 72],
    ]),
  오징어볶음:
    plate(66, 44, 24) +
    `<ellipse cx="50" cy="64" rx="34" ry="16" fill="#e0452a" stroke="none"/>` +
    [
      [30, 56, -20],
      [52, 52, 10],
      [44, 70, 15],
      [68, 66, -15],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-10" y="-7" width="20" height="14" rx="3" fill="#ff8a6a"/><path d="M-6 -7L4 7M2 -7L10 4M-10 0L-4 7M-4 -7L-10 -1" stroke="#fff0e6" stroke-width="2"/></g>`,
      )
      .join('') +
    tube('M60 78c-6 2-8-4-4-6', '#ff8a6a', 3.5) +
    tube('M72 52c6-4 10 2 6 5', '#ff8a6a', 3.5) +
    tube('M24 70c-4 5 2 9 5 5', '#ff8a6a', 3.5) +
    tube('M78 72c4 4 0 8-4 6', '#ff8a6a', 3.5) +
    strip('M36 44l10 4', '#ff9f1a', 3.5) +
    strip('M56 44l8 -2', '#3a9e47', 3.5) +
    strip('M52 80l10 -2', '#3a9e47', 3.5),
  갈비찜:
    steam(24) +
    ttuk(
      48,
      '#6b3a1e',
      [
        [36, 42, -15],
        [58, 38, 10],
        [48, 50, 0],
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-13" y="-8" width="26" height="14" rx="5" fill="#7a3a1e" stroke-width="2.5"/><rect x="-15" y="-9" width="6" height="16" rx="2" fill="#fff4e0" stroke-width="2.5"/><path d="M-4 -3q6-3 12 0" stroke="#a8603a" stroke-width="2"/></g>`,
        )
        .join('') +
        oval(24, 48, 5.5, 4.5, '#e8c070') +
        oval(74, 46, 6, 4, '#ff8c1a', 20) +
        oval(68, 54, 4.5, 3.5, '#c0392b') +
        oval(30, 54, 3, 3, '#d8e050', 0, 2),
      '#3a3040',
      '#56485a',
    ),
  계란찜:
    steam(20) +
    ttuk(
      52,
      '#ffd23f',
      `<path d="M18 54C18 32 34 26 50 26S82 32 82 54Z" fill="#ffd23f"/>` +
        `<path d="M30 38Q40 32 50 32" stroke="#fff08a" stroke-width="4"/>` +
        scallion(42, 44) +
        scallion(58, 40) +
        scallion(64, 50) +
        scallion(34, 50) +
        dot(50, 46, 2, '#e8403a') +
        dot(70, 44, 2, '#e8403a'),
    ),
  달걀프라이:
    tube('M84 76L94 90', '#5a3b24', 6) +
    `<circle cx="50" cy="52" r="38" fill="#4a5068"/><circle cx="50" cy="52" r="31" fill="#6a7390" stroke="none"/>` +
    blob('#fff', [
      [48, 50, 17],
      [62, 56, 11],
      [38, 62, 10],
      [58, 38, 9],
    ]) +
    `<circle cx="50" cy="50" r="10" fill="${HL}"/>` +
    `<path d="M45 46q3-3 6-2" stroke="#fff4a0" stroke-width="3"/>` +
    sparkle(26, 30, 5, '#fff'),
  메추리알:
    `<path d="M12 56C12 78 30 90 50 90S88 78 88 56Z" fill="#fff"/>` +
    [
      [30, 50, -15],
      [50, 46, 5],
      [70, 50, 18],
      [40, 34, -8],
      [60, 32, 12],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="10" ry="13" fill="#f4e4c4"/>` +
          [
            [-4, -6, 2.4],
            [3, -3, 2.8],
            [-3, 3, 2.2],
            [4, 6, 2.4],
            [-5, 8, 1.6],
            [5, -8, 1.6],
          ]
            .map(([dx, dy, r]) => dot(x + dx, y + dy, r, '#6b3e26'))
            .join('') +
          `</g>`,
      )
      .join('') +
    `<path d="M12 56C12 78 30 90 50 90S88 78 88 56C80 62 66 64 50 64S20 62 12 56Z" fill="#fff"/>` +
    `<path d="M22 72Q50 82 78 72" stroke="#7ec8f0" stroke-width="3"/>`,
  두부김치:
    plate(62, 45, 28) +
    blob('#d8402e', [
      [50, 58, 14],
      [42, 62, 9],
      [58, 62, 9],
      [50, 50, 8],
    ]) +
    `<path d="M40 56q5-4 10 0M50 64q5-4 10 0M44 50q4-3 8 0" stroke="#ff9a7a" stroke-width="2.5"/>` +
    [
      [20, 56, -70],
      [26, 42, -40],
      [40, 36, -15],
      [60, 36, 15],
      [74, 42, 40],
      [80, 56, 70],
      [72, 72, 110],
      [50, 80, 180],
      [28, 72, -110],
    ]
      .map(
        ([x, y, a]) =>
          `<rect x="${x - 6}" y="${y - 8}" width="12" height="16" rx="2" fill="#fffdf2" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`,
      )
      .join('') +
    sesame([
      [46, 58],
      [56, 54],
      [52, 66],
    ]),
  순두부찌개:
    steam(24) +
    ttuk(
      46,
      '#e8452e',
      blob('#fffaf0', [
        [36, 46, 8],
        [42, 43, 6],
        [32, 42, 5],
      ]) +
        blob('#fffaf0', [
          [66, 50, 6],
          [72, 47, 5],
        ]) +
        `<ellipse cx="56" cy="42" rx="10" ry="6.5" fill="#fff" stroke-width="2.5"/><circle cx="56" cy="42" r="4.5" fill="${HL}" stroke-width="2.5"/>` +
        scallion(48, 52) +
        scallion(26, 50) +
        scallion(74, 40) +
        dot(44, 38, 1.8, '#a82010') +
        dot(64, 54, 1.8, '#a82010'),
      '#2e3040',
      '#4a4e62',
    ),
  청국장:
    steam(24) +
    ttuk(
      46,
      '#9a6a36',
      [
        [28, 46, 10],
        [34, 40, -20],
        [42, 50, 30],
        [48, 42, 0],
        [56, 50, -30],
        [62, 42, 20],
        [70, 48, -10],
        [38, 44, 60],
        [66, 54, 40],
        [52, 36, 70],
        [32, 52, -40],
        [76, 42, 10],
      ]
        .map(([x, y, a]) => oval(x, y, 4, 3, '#ecd098', a, 1.8))
        .join('') +
        tofu(44, 56, 8) +
        tofu(58, 38, 8) +
        `<circle cx="24" cy="42" r="3.5" fill="#43b04a" stroke-width="2"/><circle cx="24" cy="42" r="1.2" fill="#fff" stroke="none"/>`,
    ),
  육개장:
    steam(26) +
    bowl(
      48,
      '#e0452a',
      '#fff',
      strip('M26 44l12 6M32 52l14 2M54 40l12 4M60 52l14-2M44 38l6 8', '#6b3e26', 3) +
        strip('M22 50L44 40', '#5fc24a', 6) +
        strip('M56 56L80 46', '#5fc24a', 6) +
        strip('M40 56q4-4 8 0M64 38q4-4 8 0', '#fff4c0', 2.5) +
        `<circle cx="36" cy="40" r="3" fill="#ff9f1a" stroke="none"/><circle cx="72" cy="54" r="3" fill="#ff9f1a" stroke="none"/><circle cx="50" cy="50" r="2.5" fill="#ff9f1a" stroke="none"/>`,
      '#e8553d',
      14,
    ),
  설렁탕:
    steam(24) +
    ttuk(
      46,
      '#fbf7ee',
      `<path d="${waves(28, 48, 5, 8, 4)}M32 42q4-4 8 0t8 0t8 0t8 0" stroke="#e0d6bc" stroke-width="2.5"/>` +
        oval(38, 44, 8, 4, '#d9b8a0', -15) +
        oval(62, 46, 8, 4, '#d9b8a0', 15) +
        [
          [30, 42],
          [44, 40],
          [52, 48],
          [58, 40],
          [68, 50],
          [36, 52],
          [74, 44],
          [48, 54],
          [26, 48],
        ]
          .map(([x, y]) => scallion(x, y))
          .join(''),
      '#2e3040',
      '#4a4e62',
    ),
  곰탕:
    steam(26) +
    bowl(
      48,
      '#f0c878',
      '#f2c14e',
      oval(36, 46, 11, 5, '#b07a5a', -12) +
        `<path d="M28 46h16" stroke="#f4e0d0" stroke-width="2"/>` +
        oval(60, 44, 11, 5, '#b07a5a', 10) +
        `<path d="M52 44h16" stroke="#f4e0d0" stroke-width="2"/>` +
        oval(50, 54, 10, 4.5, '#b07a5a', 0) +
        [
          [28, 54],
          [44, 38],
          [66, 52],
          [74, 44],
          [56, 38],
          [40, 56],
        ]
          .map(([x, y]) => scallion(x, y))
          .join(''),
      '#d9a820',
      14,
    ),
  감자탕: pot(
    42,
    '#e0502a',
    `<g transform="rotate(-20 42 36)"><rect x="30" y="31" width="24" height="10" rx="4" fill="#8a4e2a" stroke-width="2.5"/><circle cx="28" cy="32" r="4.5" fill="#fff4e0" stroke-width="2.5"/><circle cx="28" cy="40" r="4.5" fill="#fff4e0" stroke-width="2.5"/><circle cx="56" cy="32" r="4.5" fill="#fff4e0" stroke-width="2.5"/><circle cx="56" cy="40" r="4.5" fill="#fff4e0" stroke-width="2.5"/></g>` +
      oval(66, 38, 11, 9, '#e8c060') +
      dot(63, 36, 1.4, '#8a6a36') +
      oval(26, 46, 9, 7, '#e8c060') +
      leaf(44, 48, -10, '#3a9e47', 1) +
      leaf(70, 50, 190, '#43b04a', 0.8) +
      dot(40, 44, 1.6, '#f4e0b0') +
      dot(58, 48, 1.6, '#f4e0b0') +
      dot(50, 40, 1.6, '#f4e0b0'),
    '#e8553d',
    36,
    28,
    '#e8553d',
  ),
  추어탕:
    `<g transform="translate(50 16)"><path d="M-30 2C-20 -8 12 -8 24 -2L32 -8L30 2L32 10L24 4C12 10 -20 10 -30 2Z" fill="#b5a060"/><path d="M-20 -2C-8 -5 8 -5 18 -1" stroke="#8a7a40" stroke-width="2"/>${dot(-22, 0, 1.8)}<path d="M-30 4q-4 2-4 6M-29 0q-5-2-6 1" stroke-width="2"/><path d="M-25 5q2 1 4 0" stroke-width="1.8"/></g>` +
    ttuk(
      46,
      '#8a7a3a',
      strip('M26 46c4-6 8 4 12-2M44 42c4-6 8 4 12-2M58 50c4-6 8 4 12-2M34 54c4-6 8 4 12-2', '#4a7a2a', 3.5) +
        dot(42, 50, 1.6, '#e8d8a0') +
        dot(54, 46, 1.6, '#e8d8a0') +
        dot(66, 42, 1.6, '#e8d8a0') +
        dot(30, 42, 1.6, '#e8d8a0') +
        scallion(50, 54) +
        scallion(72, 48) +
        dot(62, 54, 1.8, '#e8403a'),
    ),
  해장국:
    steam(24) +
    ttuk(
      46,
      '#d8602e',
      `<path d="M26 46C28 36 40 36 44 44C40 52 30 52 26 46Z" fill="#4a7a2a" stroke-width="2.5"/><path d="M28 45L40 42" stroke="#8ac060" stroke-width="2"/>` +
        `<path d="M56 50C58 40 70 40 74 48C70 56 60 56 56 50Z" fill="#4a7a2a" stroke-width="2.5"/><path d="M58 49L70 46" stroke="#8ac060" stroke-width="2"/>` +
        strip('M44 50l10-6M48 54l10-4', '#fff8e0', 2.5) +
        oval(55, 43, 3, 2.4, HL, 0, 1.6) +
        oval(59, 49, 3, 2.4, HL, 0, 1.6) +
        `<rect x="40" y="34" width="14" height="8" rx="3" fill="#8a4e2a" stroke-width="2.5"/><circle cx="54" cy="36" r="3.5" fill="#fff4e0" stroke-width="2"/>` +
        scallion(34, 54) +
        scallion(68, 38),
    ),
  콩나물국:
    steam(28) +
    bowl(
      50,
      '#eaf4dc',
      '#fff',
      [
        ['M24 50C30 44 38 44 44 48', 22, 50],
        ['M40 56C46 52 54 52 60 56', 38, 57],
        ['M56 44C62 40 70 42 74 48', 54, 44],
        ['M30 40C36 36 44 38 48 42', 28, 40],
        ['M60 56C66 52 72 54 78 52', 78, 51],
        ['M46 40C50 30 56 26 60 24', 60, 23],
        ['M36 44C36 34 40 28 44 24', 44, 23],
      ]
        .map(([d, x, y]) => strip(d as string, '#fffbe8', 3) + oval(x as number, y as number, 4, 3, '#ffd23f', 0, 2))
        .join('') +
        scallion(52, 48) +
        scallion(68, 50),
      '#9aa6c4',
      15,
    ),
  북엇국:
    `<g transform="translate(50 17)"><path d="M-34 0C-24 -10 14 -10 26 -3L36 -10V10L26 3C14 10 -24 10 -34 0Z" fill="#e0c08a"/><path d="M-20 -3H16M-18 3H14" stroke="#b8925a" stroke-width="2"/>${dot(-26, -1, 2)}</g>` +
    bowl(
      52,
      '#fbf0d4',
      '#fff',
      strip('M24 50l12 3M42 44l12 2M60 52l12-3M36 58l10-2', '#f6e8c4', 4) +
        strip('M30 44q4-4 8 0t8 0M52 56q4-4 8 0t8 0', HL, 3) +
        tofu(52, 50, 7) +
        tofu(68, 46, 7) +
        scallion(46, 52) +
        scallion(28, 54) +
        scallion(74, 54),
      '#3b78e6',
      14,
    ),
  어묵탕: pot(
    52,
    '#f4e0b0',
    [
      ['M34 60L26 8', 30, 22, -8],
      ['M52 60L52 6', 52, 20, 0],
      ['M68 60L76 8', 72, 22, 8],
    ]
      .map(
        ([d, x, y, a]) =>
          tube(d as string, '#e0b27a', 2.5) +
          `<g transform="rotate(${a} ${x} ${y})">${tube(`M${(x as number) - 7} ${(y as number) - 12}L${(x as number) + 7} ${(y as number) - 6}L${(x as number) - 7} ${y}L${(x as number) + 7} ${(y as number) + 6}L${(x as number) - 7} ${(y as number) + 12}`, '#e8a860', 8)}</g>`,
      )
      .join('') +
      `<ellipse cx="42" cy="56" rx="7" ry="4" fill="#fffbe8" stroke-width="2.5"/>` +
      scallion(60, 56) +
      scallion(30, 54),
    '#c8ccd8',
    36,
    30,
    '#8a96b0',
  ),
  라볶이:
    tube('M10 52H4', '#3a3f55', 6) +
    tube('M90 52H96', '#3a3f55', 6) +
    `<ellipse cx="50" cy="56" rx="41" ry="30" fill="#3a3f55"/>` +
    `<ellipse cx="50" cy="54" rx="35" ry="24" fill="#e0452a" stroke="none"/>` +
    strip(`${waves(22, 50, 7, 8, 5)}${waves(26, 62, 6, 8, 5)}${waves(30, 40, 5, 8, 5)}`, '#ffd96a', 3) +
    [
      [30, 46, -20],
      [50, 58, 10],
      [70, 48, 30],
      [38, 66, -40],
      [64, 68, 50],
    ]
      .map(([x, y, a]) => `<rect x="${x - 10}" y="${y - 5}" width="20" height="10" rx="5" fill="#ffc0b0" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    `<path d="M76 58l8 6l-10 4Z" fill="#f2c890" stroke-width="2.5"/>` +
    halfEgg(50, 40, 1.1),
  쫄면: bowl(
    50,
    '#fffaf0',
    '#f2f4f8',
    strip(`${waves(22, 52, 7, 8, 5)}M26 44q4-5 8 0t8 0t8 0t8 0t8 0t8 0`, '#f2d27a', 5) +
      strip('M20 42l10-6M24 48l10-6M26 36l8-4', '#c8e89a', 3.5) +
      strip('M64 34l10 4M68 30l10 6M70 40l10 4', '#c8e89a', 3.5) +
      strip('M66 50l10-2', '#ff9f1a', 3.5) +
      blob('#e8403a', [
        [48, 42, 9],
        [54, 44, 7],
      ]) +
      halfEgg(52, 34, 0.9),
    '#e8553d',
    17,
  ),
  비빔국수: bowl(
    50,
    '#fffaf0',
    '#fff',
    `<path d="M22 52C24 38 38 32 50 32S76 38 78 52C70 58 30 58 22 52Z" fill="#ff8a5a"/>` +
      `<path d="${waves(28, 50, 6, 8, 3)}${waves(30, 44, 6, 7, 3)}${waves(36, 38, 4, 7, 3)}" stroke="#ffc0a0" stroke-width="2"/>` +
      oval(30, 42, 6, 4, '#d8302a', -20) +
      oval(70, 46, 6, 4, '#d8302a', 20) +
      strip('M56 36l10 4M58 32l10 4', '#43b04a', 3) +
      halfEgg(44, 34, 0.9) +
      sesame([
        [36, 48],
        [52, 44],
        [62, 50],
        [46, 52],
      ]),
    '#3b78e6',
    17,
  ),
  잔치국수:
    steam(28) +
    bowl(
      50,
      '#f4e6c0',
      '#fff',
      `<path d="M26 54C28 42 38 38 50 38S72 42 74 54C66 58 34 58 26 54Z" fill="#fffdf5"/>` +
        `<path d="${waves(30, 52, 5, 8, 3)}${waves(34, 46, 4, 8, 3)}" stroke="#e0d6bc" stroke-width="2"/>` +
        strip('M38 40l6-6M42 42l6-6', HL, 3) +
        strip('M50 40l6-6M54 42l6-6', '#43b04a', 3) +
        strip('M62 42l4-6M65 44l4-6', '#2e3040', 3) +
        strip('M46 44l4-4', '#e8403a', 2.5) +
        strip('M58 44l4-4', '#ff9f1a', 2.5),
      '#e85d9a',
      15,
    ),
  막국수: bowl(
    50,
    '#f2e8d0',
    '#f2c14e',
    `<path d="M24 52C26 38 38 32 50 32S74 38 76 52C68 58 32 58 24 52Z" fill="#9a8a7a"/>` +
      `<path d="${waves(30, 50, 5, 8, 3)}${waves(32, 44, 5, 7, 3)}${waves(38, 38, 3, 7, 3)}" stroke="#c0b0a0" stroke-width="2"/>` +
      [
        [40, 36, 20],
        [46, 40, -30],
        [54, 36, 40],
        [58, 42, -10],
        [44, 46, 60],
        [50, 44, 0],
        [36, 42, -50],
        [62, 38, 70],
      ]
        .map(([x, y, a]) => `<path d="M${x - 3} ${y}h6" stroke="#1d2340" stroke-width="3" transform="rotate(${a} ${x} ${y})"/>`)
        .join('') +
      sesame([
        [42, 40],
        [52, 40],
        [48, 36],
        [56, 46],
        [40, 48],
      ]) +
      strip('M24 42l8 4M26 38l8 4', '#43b04a', 3) +
      halfEgg(66, 44, 0.85),
    '#d9a820',
    17,
  ),
  물냉면: bowl(
    46,
    '#cfeaf5',
    silver,
    `<path d="M34 48C34 36 42 32 50 32S66 36 66 48Z" fill="#7a6258"/>` +
      `<path d="${waves(38, 44, 3, 8, 3)}" stroke="#a89088" stroke-width="2"/>` +
      halfEgg(50, 32, 0.9) +
      `<path d="M58 40l10 -4l2 6Z" fill="#fff8d8" stroke-width="2.5"/>` +
      strip('M36 36l8 4', '#43b04a', 3) +
      [
        [20, 44, 15],
        [80, 44, -12],
        [28, 54, -10],
        [72, 54, 20],
      ]
        .map(
          ([x, y, a]) =>
            `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2" fill="#f4fcff" stroke="#7ec8f0" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`,
        )
        .join(''),
    '#dfe8f5',
    15,
  ),
  비빔냉면: bowl(
    48,
    '#7a6258',
    silver,
    `<path d="${waves(22, 50, 7, 8, 3)}${waves(26, 42, 6, 8, 3)}" stroke="#a89088" stroke-width="2"/>` +
      blob('#e8403a', [
        [48, 40, 12],
        [58, 42, 8],
        [40, 44, 7],
      ]) +
      halfEgg(50, 32, 0.9) +
      strip('M68 40l10 4M70 36l10 4', '#43b04a', 3) +
      `<path d="M22 42l10 -4l2 6Z" fill="#fff8d8" stroke-width="2.5"/>` +
      sesame([
        [44, 44],
        [56, 46],
        [50, 50],
      ]),
    '#dfe8f5',
    15,
  ),
  짜장밥:
    plate(62, 45, 28) +
    blob('#fff', [
      [34, 56, 15],
      [28, 64, 10],
      [42, 66, 10],
    ]) +
    `<path d="M44 44C60 36 82 44 82 60C82 74 66 82 50 80C44 72 44 56 44 44Z" fill="#3a2a20"/>` +
    `<rect x="56" y="54" width="8" height="8" rx="1.5" fill="#f2c14e" stroke-width="2.2"/>` +
    `<rect x="68" y="64" width="8" height="8" rx="1.5" fill="#f2c14e" stroke-width="2.2"/>` +
    `<rect x="54" y="68" width="7" height="7" rx="1.5" fill="#fff4e0" stroke-width="2.2"/>` +
    strip('M62 46l12 4M64 42l12 4', '#6cc04a', 3) +
    blob('#fff', [
      [32, 44, 10],
      [40, 42, 6],
    ]) +
    `<circle cx="33" cy="43" r="5" fill="${HL}" stroke-width="2.5"/>`,
};
