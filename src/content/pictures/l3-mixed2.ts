// 섞음 묶음 L3-2 (드문 동물·곤충, 양념·가루, 밥·떡·전, 직업·옛 인물, 공연 보는 사람들). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리는 이렇게 구별한다:
//   밥: 쌀밥(흰 밥알만) / 보리밥(누런 보리알 섞임) / 콩밥(검은 콩) / 오곡밥(붉은 밥에 팥·검은콩·노란 좁쌀) / 약식(그릇 없이 갈색 네모 조각에 밤·대추)
//   떡: 경단(색색 고물 묻힌 동그란 공) / 쑥떡(납작한 짙은 초록 떡 + 쑥 잎) / 화전(흰 둥근 부침에 분홍 꽃잎)
//   공연: 관객(무대를 보는 뒷모습들) / 합창단(같은 옷 입고 입 벌려 노래하는 두 줄) / 오케스트라(지휘자 뒷모습 + 악기 연주자)
import { INK, SKIN, HL, dot, sparkle, tube, person } from "../pictureKit.ts";

const f1 = (n: number) => +n.toFixed(1);

/** 흰자 + 눈동자 */
const eye = (x: number, y: number, r = 4.5, p = 2.6) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` +
  dot(x + 0.3, y + 0.3, p);

/** 김 (따뜻한 음식) */
const steam = (xs: number[], y = 8) =>
  xs
    .map(
      (x) =>
        `<path d="M${x} ${y + 14}q-4-4 0-7t0-7" stroke="#9aa6c4" stroke-width="3"/>`,
    )
    .join("");

/** 밥공기: 밥 둔덕(base) + 알갱이(grains) + 그릇 */
function riceBowl(base: string, grains: string): string {
  return (
    `<rect x="36" y="84" width="28" height="8" rx="2" fill="#b9c6dc"/>` +
    `<path d="M16 54C14 32 30 22 50 22S86 32 84 54Z" fill="${base}"/>` +
    grains +
    `<path d="M10 52H90C90 76 72 88 50 88S10 76 10 52Z" fill="#dfe8f5"/>` +
    `<path d="M16 62Q50 72 84 62" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M22 70l4 3l4-3l4 3M66 70l4 3l4-3l4 3" stroke="#3b78e6" stroke-width="2"/>`
  );
}

/** 밥 둔덕 위 알갱이 자리 */
const MOUND: [number, number][] = [
  [42, 29],
  [52, 28],
  [62, 31],
  [34, 34],
  [46, 35],
  [57, 36],
  [68, 36],
  [26, 41],
  [38, 41],
  [50, 42],
  [62, 42],
  [74, 42],
  [20, 48],
  [31, 48],
  [43, 48],
  [55, 48],
  [67, 48],
  [79, 48],
];
const grain = (
  x: number,
  y: number,
  i: number,
  fill = "#fff",
  stroke = "#b8c0d0",
  rx = 3.4,
  ry = 2,
) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" transform="rotate(${((i * 47) % 180) - 90} ${x} ${y})"/>`;
const riceGrains = (skip: (i: number) => boolean = () => false) =>
  MOUND.map(([x, y], i) => (skip(i) ? "" : grain(x, y, i))).join("");

/** 접시 */
const plate = (cy = 72, rx = 44, ry = 17) =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/>` +
  `<ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 5}" fill="#eef3fa" stroke="#c9d3e3" stroke-width="2"/>`;

/** 편지 봉투 */
const envelope = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#fff"/>` +
  `<path d="M${x} ${y}L${x + w / 2} ${y + h * 0.6}L${x + w} ${y}" stroke-width="2.5"/>` +
  `<rect x="${x + w - 7}" y="${y + 3}" width="4.5" height="5" fill="#e8553d" stroke-width="1.5"/>`;

/** 음표 */
const note = (x: number, y: number, fill = INK) =>
  `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.8" fill="${fill}" transform="rotate(-20 ${x} ${y})" stroke-width="2"/>` +
  `<path d="M${x + 4.5} ${y - 1}V${y - 18}q6 3 8 8" stroke-width="2.5"/>`;

/** 뒷머리 (관객) */
const backHead = (
  x: number,
  y: number,
  s: number,
  hair: string,
  shirt: string,
) =>
  `<path d="M${x - 13 * s} ${y + 16 * s}C${x - 13 * s} ${y + 4 * s} ${x - 7 * s} ${y + 2 * s} ${x} ${y + 2 * s}S${x + 13 * s} ${y + 4 * s} ${x + 13 * s} ${y + 16 * s}Z" fill="${shirt}"/>` +
  `<circle cx="${x}" cy="${y - 6 * s}" r="${9 * s}" fill="${hair}"/>`;

/** 입 벌려 노래하는 합창 단원 (옷 같은 색, 검은 악보집) */
const singer = (
  x: number,
  y: number,
  s: number,
  hair: string,
  style: "short" | "long" | "bun" | "pony",
  robe: string,
) =>
  person(x, y, s, { hair, style, shirt: robe }) +
  `<path d="M${x - 5 * s} ${y - 20 * s}L${x} ${y - 12 * s}L${x + 5 * s} ${y - 20 * s}Z" fill="#fff" stroke-width="2"/>` +
  `<ellipse cx="${x}" cy="${f1(y - 25.5 * s)}" rx="${f1(2.8 * s)}" ry="${f1(3.4 * s)}" fill="#b8323a" stroke-width="2"/>` +
  `<rect x="${f1(x - 9 * s)}" y="${f1(y - 12 * s)}" width="${f1(18 * s)}" height="${f1(10 * s)}" rx="1.5" fill="#26294a" stroke-width="2"/>`;

/** 게 다리 한 쌍씩 (털게) */
const crabLegs = (fill: string) =>
  [
    ["M30 58L16 50L8 58", "M70 58L84 50L92 58"],
    ["M30 64L14 62L6 72", "M70 64L86 62L94 72"],
    ["M32 70L18 76L12 88", "M68 70L82 76L88 88"],
    ["M38 74L30 86L28 94", "M62 74L70 86L72 94"],
  ]
    .flat()
    .map(
      (d) =>
        tube(d, fill, 5) +
        `<path d="${d}" stroke="#f0c9a0" stroke-width="5" stroke-dasharray="1 4"/>`,
    )
    .join("");

/** 둘레의 털 (짧은 선) */
function fuzz(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  len = 4.5,
): string {
  let d = "";
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    d += `M${f1(x)} ${f1(y)}l${f1(len * Math.cos(a))} ${f1(len * Math.sin(a))}`;
  }
  return `<path d="${d}" stroke-width="2.2"/>`;
}

/** 전 한 장 (둥근 부침) */
const pancake = (
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string,
  top = "",
) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>` + top;

/** 꽃잎 다섯 장 (화전) */
function flower(x: number, y: number, r: number, fill: string): string {
  let s = "";
  for (let k = 0; k < 5; k++) {
    const a = ((-90 + k * 72) * Math.PI) / 180;
    s += `<ellipse cx="${f1(x + r * Math.cos(a))}" cy="${f1(y + r * 0.62 * Math.sin(a))}" rx="${f1(r * 0.75)}" ry="${f1(r * 0.5)}" fill="${fill}" stroke-width="2"/>`;
  }
  return (
    s +
    `<circle cx="${x}" cy="${y}" r="${f1(r * 0.35)}" fill="${HL}" stroke-width="1.8"/>`
  );
}

/** 호박전 한 장: 초록 껍질 테 + 달걀 옷 + 씨 자리 */
const zucchiniSlice = (x: number, y: number, r: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.62)}" fill="#f7c64a"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="${f1(r * 0.8)}" ry="${f1(r * 0.48)}" fill="#e7efb0" stroke="#5a9a3a" stroke-width="4"/>` +
  [0, 1, 2, 3, 4, 5]
    .map((k) => {
      const a = (k / 6) * Math.PI * 2;
      return `<ellipse cx="${f1(x + r * 0.36 * Math.cos(a))}" cy="${f1(y + r * 0.22 * Math.sin(a))}" rx="1.8" ry="1.3" fill="#fff" stroke="#b6b36a" stroke-width="1.2"/>`;
    })
    .join("");

export const PICS: Record<string, string> = {
  // ── 드문 동물·곤충 ──
  전갈:
    // 꼬리: 마디가 이어져 머리 위로 말려 올라감 + 꼬리 끝 침
    [
      [50, 40, 7],
      [51, 31, 6.5],
      [55, 23, 6],
      [61, 16, 5.5],
      [69, 12, 5],
      [77, 14, 4.5],
    ]
      .map(
        ([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8862e"/>`,
      )
      .join("") +
    `<path d="M80 17C86 20 86 28 80 30C82 26 81 22 78 20Z" fill="#9a5b2e"/>` +
    // 다리
    `<path d="M38 48L26 42L22 48M37 55L23 52L18 58M38 62L24 64L20 71M40 68L28 74L26 80M62 48L74 42L78 48M63 55L77 52L82 58M62 62L76 64L80 71M60 68L72 74L74 80" stroke-width="3.5"/>` +
    // 집게 팔 + 집게
    tube("M42 78C34 86 26 88 20 84", "#e8862e", 6) +
    tube("M58 78C66 86 74 88 80 84", "#e8862e", 6) +
    `<path d="M14 88C6 84 6 70 13 66L17 76L20 68C27 70 28 84 20 89Z" fill="#e8862e"/>` +
    `<path d="M86 88C94 84 94 70 87 66L83 76L80 68C73 70 72 84 80 89Z" fill="#e8862e"/>` +
    // 몸통 + 머리
    `<ellipse cx="50" cy="58" rx="14" ry="18" fill="#e8862e"/>` +
    `<path d="M38 52Q50 56 62 52M37 60Q50 64 63 60M39 68Q50 72 61 68" stroke="#b5601f" stroke-width="2.2"/>` +
    `<ellipse cx="50" cy="78" rx="11" ry="7.5" fill="#f2a24a"/>` +
    dot(46, 77, 2) +
    dot(54, 77, 2) +
    `<path d="M47 81q3 2 6 0" stroke-width="2"/>`,

  장수하늘소:
    // 몸보다 훨씬 긴 마디 더듬이
    `<path d="M45 24C32 8 12 10 8 34C6 48 8 60 12 72" stroke-width="6.5"/>` +
    `<path d="M45 24C32 8 12 10 8 34C6 48 8 60 12 72" stroke="#8a6a4a" stroke-width="3" stroke-dasharray="5 4"/>` +
    `<path d="M55 24C68 8 88 10 92 34C94 48 92 60 88 72" stroke-width="6.5"/>` +
    `<path d="M55 24C68 8 88 10 92 34C94 48 92 60 88 72" stroke="#8a6a4a" stroke-width="3" stroke-dasharray="5 4"/>` +
    // 다리
    `<path d="M38 40L26 36L22 28M37 54L24 56L18 64M38 68L28 78L28 88M62 40L74 36L78 28M63 54L76 56L82 64M62 68L72 78L72 88" stroke-width="4"/>` +
    // 딱지날개 + 무늬
    `<path d="M36 46C34 62 38 84 50 92C62 84 66 62 64 46Z" fill="#4a2e1e"/>` +
    `<path d="M50 47V90" stroke="#2a1a10" stroke-width="2.5"/>` +
    [
      [42, 54],
      [57, 52],
      [44, 66],
      [58, 70],
      [45, 80],
      [55, 82],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="3" fill="#d9c27a" stroke="none"/>`,
      )
      .join("") +
    // 앞가슴 (가시) + 머리 + 큰 턱
    `<path d="M37 38L32 36L38 44Z" fill="#4a2e1e" stroke-width="2.5"/><path d="M63 38L68 36L62 44Z" fill="#4a2e1e" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="39" rx="13" ry="8" fill="#5a3a26"/>` +
    `<ellipse cx="50" cy="27" rx="9" ry="7" fill="#4a2e1e"/>` +
    `<path d="M45 21C42 16 44 12 47 14M55 21C58 16 56 12 53 14" stroke-width="3"/>` +
    dot(45, 26, 2, "#fff") +
    dot(55, 26, 2, "#fff"),

  도미:
    // 빨간 참돔 (등지느러미 가시, 파란 점)
    `<path d="M28 34L32 18L38 30L44 14L50 28L56 14L61 28L67 18L72 34Z" fill="#e8553d"/>` +
    `<path d="M80 50L95 32L91 50L95 68Z" fill="#e8553d"/>` +
    `<path d="M40 70L46 84L56 72Z" fill="#e8553d"/>` +
    `<path d="M8 52C16 28 50 20 72 32C78 36 82 44 84 50C80 58 74 64 66 68C46 78 16 72 8 52Z" fill="#ff5c70"/>` +
    `<path d="M14 58C28 70 50 72 66 66C54 70 30 72 14 58Z" fill="#ffc2c8" stroke-width="2.5"/>` +
    `<path d="M30 36C36 44 36 58 30 66" stroke="#c62f3f" stroke-width="3"/>` +
    [
      [44, 38],
      [54, 36],
      [64, 40],
      [48, 48],
      [60, 50],
      [70, 46],
      [54, 58],
    ]
      .map(([x, y]) => dot(x, y, 2.2, "#7ec8f0"))
      .join("") +
    `<path d="M42 54L52 58L42 62Z" fill="#e8553d" stroke-width="2.5"/>` +
    eye(20, 44, 5, 2.8) +
    `<path d="M9 54q4 2 7 0" stroke-width="2.5"/>`,

  반달가슴곰:
    `<circle cx="28" cy="18" r="9" fill="#2f2a33"/><circle cx="72" cy="18" r="9" fill="#2f2a33"/>` +
    `<circle cx="28" cy="18" r="4" fill="#6b5a60" stroke="none"/><circle cx="72" cy="18" r="4" fill="#6b5a60" stroke="none"/>` +
    `<path d="M16 96C12 70 28 56 50 56C72 56 88 70 84 96Z" fill="#2f2a33"/>` +
    // 가슴의 흰 반달 무늬
    `<path d="M24 62C34 84 66 84 76 62C66 74 34 74 24 62Z" fill="#fff" stroke-width="3"/>` +
    `<ellipse cx="30" cy="90" rx="10" ry="7" fill="#2f2a33"/><ellipse cx="70" cy="90" rx="10" ry="7" fill="#2f2a33"/>` +
    `<circle cx="50" cy="36" r="24" fill="#2f2a33"/>` +
    `<ellipse cx="50" cy="46" rx="12" ry="9" fill="#c9a27a"/>` +
    `<ellipse cx="50" cy="41" rx="5" ry="3.5" fill="${INK}"/>` +
    `<path d="M50 45v3M45 50q5 3 10 0" stroke-width="2.5"/>` +
    dot(40, 32, 3.4, "#fff") +
    dot(60, 32, 3.4, "#fff") +
    dot(40.5, 32.5, 1.9) +
    dot(60.5, 32.5, 1.9),

  오색딱따구리:
    // 나무줄기 + 부스러기
    `<rect x="70" y="4" width="24" height="92" fill="#9a5b2e"/>` +
    `<path d="M78 12v14M86 40v16M78 66v14M88 76v12" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M60 18l-4-4M62 12l-1-5M56 24l-5-1" stroke="#c98b4f" stroke-width="3"/>` +
    // 꼬리 (줄기에 기댐)
    `<path d="M56 70L70 94L60 94Z" fill="#1f1f26"/>` +
    // 몸 (흰 배)
    `<ellipse cx="54" cy="54" rx="14" ry="22" fill="#fff" transform="rotate(-12 54 54)"/>` +
    // 등·날개: 검정에 흰 점 줄
    `<path d="M44 34C34 48 36 66 50 80C54 66 54 48 50 34Z" fill="#1f1f26"/>` +
    `<path d="M44 44l4-1M42 52l5-1M42 60l5-1M44 68l5-1" stroke="#fff" stroke-width="3"/>` +
    `<path d="M48 34C52 38 54 44 52 50C48 46 46 40 48 34Z" fill="#fff" stroke-width="2"/>` +
    // 빨간 아랫배 (꼬리 밑)
    `<ellipse cx="60" cy="74" rx="7" ry="6" fill="#e8553d"/>` +
    // 발
    `<path d="M62 62l8 2M62 66l8 3" stroke-width="3"/>` +
    // 머리: 검은 모자, 흰 뺨, 뒤통수 빨강
    `<circle cx="58" cy="28" r="12" fill="#fff"/>` +
    `<path d="M46 26C46 14 64 12 69 22C62 20 54 20 46 26Z" fill="#1f1f26"/>` +
    `<path d="M46 26C44 20 46 16 50 14C50 20 49 24 46 26Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M48 34Q56 40 66 34" stroke="#1f1f26" stroke-width="3.5"/>` +
    `<path d="M69 25L80 28L69 31Z" fill="#8a96b0"/>` +
    dot(62, 26, 2.3),

  물까치:
    // 나뭇가지
    tube("M4 72H96", "#9a5b2e", 6) +
    `<path d="M16 72C12 62 20 58 26 62C24 68 20 72 16 72Z" fill="#43b04a"/>` +
    // 긴 하늘색 꼬리 (끝이 흼)
    `<path d="M60 56L94 80L88 88L56 64Z" fill="#4a90e2"/>` +
    `<path d="M88 76L94 80L88 88L84 83Z" fill="#fff" stroke-width="2.5"/>` +
    // 몸 (잿빛 베이지)
    `<ellipse cx="46" cy="56" rx="21" ry="13" fill="#d9cfc4"/>` +
    // 하늘색 날개
    `<path d="M38 50C48 44 64 46 70 56C62 64 48 64 40 58Z" fill="#7ec8f0"/>` +
    `<path d="M48 54l14 3M46 58l12 2" stroke="#3b78e6" stroke-width="2.2"/>` +
    // 다리
    `<path d="M42 68v5M50 68v5" stroke-width="3"/>` +
    // 머리: 까만 모자, 흰 목
    `<circle cx="28" cy="44" r="12" fill="#fff"/>` +
    `<path d="M16 46C14 32 30 28 40 38C34 42 26 46 16 46Z" fill="#1f1f26"/>` +
    `<path d="M17 42L7 46L17 49Z" fill="#1f1f26"/>` +
    dot(24, 41, 2.3, "#fff") +
    dot(24, 41, 1.3),

  땅강아지:
    // 흙
    `<path d="M4 80C20 74 36 78 52 76C68 74 84 78 96 76V96H4Z" fill="#9a5b2e"/>` +
    dot(20, 88, 2.2, "#6b3e26") +
    dot(44, 90, 2.2, "#6b3e26") +
    dot(70, 88, 2.2, "#6b3e26") +
    dot(86, 92, 2.2, "#6b3e26") +
    // 튀는 흙 알갱이
    dot(10, 64, 2.5, "#9a5b2e") +
    dot(6, 72, 2, "#9a5b2e") +
    dot(14, 56, 1.8, "#9a5b2e") +
    // 뒷다리
    tube("M66 66L80 58L90 72", "#9a6a3e", 4) +
    tube("M56 68L60 78", "#9a6a3e", 4) +
    // 배 + 접은 날개
    `<ellipse cx="64" cy="60" rx="24" ry="11" fill="#b07a48"/>` +
    `<path d="M66 64h16M68 58h18" stroke="#8a5a32" stroke-width="2.2"/>` +
    `<path d="M46 52C60 46 80 48 92 58C80 56 60 56 48 60Z" fill="#c9a06a" stroke-width="2.5"/>` +
    // 큰 앞가슴 (투구)
    `<ellipse cx="38" cy="56" rx="14" ry="12" fill="#7a4e2c"/>` +
    // 머리 + 더듬이
    `<circle cx="22" cy="58" r="8" fill="#8a5a32"/>` +
    `<path d="M18 52C14 44 10 42 6 42M22 51C22 44 20 40 16 38" stroke-width="2.5"/>` +
    dot(20, 56, 2.2) +
    // 삽 같은 앞다리 (톱니)
    tube("M30 64L24 74", "#b07a48", 5) +
    `<path d="M14 72L30 72L28 80L25 76L23 82L20 77L17 82L15 77Z" fill="#b07a48" stroke-width="2.5"/>` +
    // 털
    fuzz(38, 56, 14, 12, 14, 2.5),

  하늘다람쥐:
    // 바람
    `<path d="M6 20h12M4 30h9M82 88h12M86 78h9" stroke="#9aa6c4" stroke-width="3"/>` +
    // 납작한 꼬리
    `<ellipse cx="50" cy="84" rx="9" ry="11" fill="#b8a48c"/>` +
    // 활짝 편 비막
    `<path d="M14 32C32 44 68 44 86 32C80 48 80 62 86 78C68 68 32 68 14 78C20 62 20 48 14 32Z" fill="#c9b49a"/>` +
    `<ellipse cx="50" cy="58" rx="16" ry="14" fill="#f3e8d6" stroke-width="2.5"/>` +
    // 네 발
    `<circle cx="14" cy="32" r="4.5" fill="#ffc2c8"/><circle cx="86" cy="32" r="4.5" fill="#ffc2c8"/>` +
    `<circle cx="14" cy="78" r="4.5" fill="#ffc2c8"/><circle cx="86" cy="78" r="4.5" fill="#ffc2c8"/>` +
    // 머리 + 아주 큰 까만 눈
    `<circle cx="39" cy="17" r="5" fill="#c9b49a"/><circle cx="61" cy="17" r="5" fill="#c9b49a"/>` +
    `<circle cx="50" cy="30" r="15" fill="#c9b49a"/>` +
    `<ellipse cx="50" cy="36" rx="8" ry="6" fill="#f3e8d6" stroke-width="2.5"/>` +
    dot(42, 29, 4.6) +
    dot(58, 29, 4.6) +
    dot(43.5, 27.5, 1.5, "#fff") +
    dot(59.5, 27.5, 1.5, "#fff") +
    dot(50, 34, 1.8) +
    `<path d="M47 38q3 2 6 0" stroke-width="2"/>`,

  털게:
    crabLegs("#b5603a") +
    // 집게 (앞)
    tube("M36 44L26 30", "#b5603a", 6) +
    tube("M64 44L74 30", "#b5603a", 6) +
    `<path d="M18 30C12 22 16 10 24 10L26 20L30 13C36 18 34 30 26 32Z" fill="#c96a40"/>` +
    `<path d="M82 30C88 22 84 10 76 10L74 20L70 13C64 18 66 30 74 32Z" fill="#c96a40"/>` +
    fuzz(24, 22, 10, 11, 10, 3) +
    fuzz(76, 22, 10, 11, 10, 3) +
    // 등딱지 + 온통 털
    fuzz(50, 60, 26, 19, 30, 5) +
    `<ellipse cx="50" cy="60" rx="26" ry="19" fill="#b5603a"/>` +
    `<path d="M34 56l2 3M42 50l1 3M50 54l0 3M58 50l-1 3M66 56l-2 3M38 66l2 3M46 70l1 3M54 70l-1 3M62 66l-2 3M50 62l0 3" stroke="#6b3e26" stroke-width="2"/>` +
    // 눈
    `<path d="M44 44V38M56 44V38" stroke-width="3"/>` +
    dot(44, 37, 3.4) +
    dot(56, 37, 3.4) +
    dot(44.8, 36.2, 1, "#fff") +
    dot(56.8, 36.2, 1, "#fff") +
    `<path d="M45 48q5 3 10 0" stroke-width="2.5"/>`,

  키조개:
    // 크고 긴 삼각형 조개: 뾰족한 끝에서 두 껍데기가 벌어져 속살(흰 관자)이 보임
    `<path d="M8 90C14 62 24 32 36 12C48 4 66 6 72 16C60 40 36 70 8 90Z" fill="#4a3e34"/>` +
    `<path d="M12 84C22 60 32 36 44 10M14 84C28 62 44 38 58 10M16 86C32 66 50 42 68 16" stroke="#7a6a58" stroke-width="2.5"/>` +
    `<path d="M8 90C36 74 62 52 80 32C90 34 97 46 93 58C68 72 38 84 8 90Z" fill="#5a4a3a"/>` +
    `<path d="M16 86C40 72 62 56 80 40C86 42 90 50 88 55C66 68 40 80 16 86Z" fill="#efe4d4" stroke-width="2.5"/>` +
    `<ellipse cx="76" cy="52" rx="9" ry="7" fill="#fff6e0"/>` +
    `<ellipse cx="75" cy="50" rx="5" ry="2.6" fill="#fff" stroke="none"/>` +
    sparkle(88, 18, 6),

  // ── 양념·가루 ──
  참기름:
    // 깨
    [
      [16, 84, 20],
      [24, 90, -30],
      [12, 92, 60],
      [84, 86, -20],
      [90, 80, 40],
      [78, 92, 70],
      [88, 92, -60],
    ]
      .map(
        ([x, y, a]) =>
          `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2" fill="#f3e2b8" stroke-width="1.6" transform="rotate(${a} ${x} ${y})"/>`,
      )
      .join("") +
    // 병: 빨간 뚜껑, 목, 황금빛 기름
    `<rect x="40" y="6" width="20" height="10" rx="2" fill="#e8553d"/>` +
    `<path d="M42 16H58V32C68 36 74 44 74 54V88C74 92 70 94 66 94H34C30 94 26 92 26 88V54C26 44 32 36 42 32Z" fill="#dff3fb"/>` +
    `<path d="M28 50C28 50 36 46 50 46S72 50 72 50V88C72 91 69 92 66 92H34C31 92 28 91 28 88Z" fill="#e39a26" stroke="none"/>` +
    `<path d="M42 16H58V32C68 36 74 44 74 54V88C74 92 70 94 66 94H34C30 94 26 92 26 88V54C26 44 32 36 42 32Z"/>` +
    `<path d="M28 50Q50 44 72 50" stroke="#b5731a" stroke-width="2.5"/>` +
    // 글자 없는 라벨: 깨 세 알
    `<rect x="36" y="60" width="28" height="20" rx="3" fill="#fff4e0" stroke-width="2.5"/>` +
    `<ellipse cx="44" cy="70" rx="3" ry="2" fill="#f3e2b8" stroke-width="1.6" transform="rotate(-30 44 70)"/>` +
    `<ellipse cx="50" cy="68" rx="3" ry="2" fill="#f3e2b8" stroke-width="1.6"/>` +
    `<ellipse cx="56" cy="71" rx="3" ry="2" fill="#f3e2b8" stroke-width="1.6" transform="rotate(30 56 71)"/>` +
    `<path d="M33 40v8" stroke="#fff" stroke-width="3"/>`,

  고춧가루:
    // 빨간 고추 한 개 (위)
    `<path d="M22 28C36 20 62 18 82 24C86 26 86 30 82 32C62 36 38 38 24 34C20 32 20 30 22 28Z" fill="#e8553d"/>` +
    `<path d="M30 28C44 24 60 24 72 26" stroke="#ff9a8a" stroke-width="2.5"/>` +
    `<path d="M82 24C86 20 90 20 92 16" stroke="#3a9e47" stroke-width="5"/>` +
    `<path d="M80 22C84 20 88 24 86 30C82 30 80 28 80 22Z" fill="#43b04a" stroke-width="2.5"/>` +
    // 종지에 소복한 고춧가루
    `<path d="M20 64C22 46 36 40 50 40S78 46 80 64Z" fill="#d8342a"/>` +
    [
      [34, 54],
      [44, 48],
      [56, 50],
      [66, 56],
      [40, 60],
      [52, 58],
      [60, 44],
      [28, 60],
      [72, 61],
    ]
      .map(([x, y], i) => dot(x, y, 1.8, i % 2 ? "#8e1f1a" : "#ff8a6a"))
      .join("") +
    `<path d="M14 62H86C86 82 70 92 50 92S14 82 14 62Z" fill="#fff"/>` +
    `<path d="M20 72Q50 80 80 72" stroke="#3b78e6" stroke-width="3.5"/>` +
    dot(90, 78, 1.8, "#d8342a") +
    dot(10, 82, 1.8, "#d8342a") +
    dot(88, 88, 1.5, "#d8342a"),

  미숫가루:
    // 가루 한 숟가락 (왼쪽)
    tube("M8 60L26 72", "#c9d3e3", 4) +
    `<ellipse cx="30" cy="76" rx="12" ry="7" fill="#dfe8f5"/>` +
    `<path d="M20 76C22 68 38 68 40 76Z" fill="#d9bf94"/>` +
    dot(26, 72, 1.3, "#9a7a4e") +
    dot(33, 71, 1.3, "#9a7a4e") +
    // 얼음 띄운 미숫가루 한 잔
    `<path d="M58 8L66 22" stroke-width="7"/><path d="M58 8L66 22" stroke="#e85d9a" stroke-width="3.5"/>` +
    `<path d="M42 22H86L80 92H48Z" fill="#dff3fb"/>` +
    `<path d="M44 36H84L80 90H48Z" fill="#d9bf94" stroke="none"/>` +
    `<path d="M42 22H86L80 92H48Z"/>` +
    `<path d="M44 36H84" stroke="#b09060" stroke-width="2.5"/>` +
    `<rect x="50" y="38" width="12" height="11" rx="2" fill="#f4fbff" stroke-width="2.5" transform="rotate(-10 56 43)"/>` +
    `<rect x="64" y="40" width="12" height="11" rx="2" fill="#f4fbff" stroke-width="2.5" transform="rotate(12 70 45)"/>` +
    `<path d="M66 22L68 60" stroke-width="7"/><path d="M66 22L68 60" stroke="#e85d9a" stroke-width="3.5"/>` +
    [
      [54, 62],
      [72, 66],
      [60, 76],
      [74, 80],
      [56, 86],
    ]
      .map(([x, y]) => dot(x, y, 1.6, "#9a7a4e"))
      .join("") +
    // 곡식 알갱이 (앞)
    `<ellipse cx="14" cy="90" rx="3.2" ry="2.2" fill="#e8c97a" stroke-width="1.6"/>` +
    `<ellipse cx="24" cy="92" rx="3.2" ry="2.2" fill="#e8c97a" stroke-width="1.6" transform="rotate(30 24 92)"/>` +
    `<ellipse cx="36" cy="91" rx="3.2" ry="2.2" fill="#e8c97a" stroke-width="1.6" transform="rotate(-20 36 91)"/>`,

  // ── 과자·국 ──
  유과:
    plate(76, 44, 16) +
    [
      [27, 64, "#fff", "#c9cfdc", -12],
      [73, 64, "#ffb3c1", "#e8859a", 12],
      [50, 44, "#ffe08a", "#d9b24a", 0],
    ]
      .map(([x, y, c, s, a]) => {
        const puffs = [
          [-10, -6],
          [0, -7],
          [10, -6],
          [-14, 1],
          [-5, 0],
          [5, 0],
          [14, 1],
          [-9, 7],
          [0, 7],
          [9, 7],
        ]
          .map(
            ([dx, dy]) =>
              `<circle cx="${dx}" cy="${dy}" r="3.3" fill="${c}" stroke="${s}" stroke-width="1.6"/>`,
          )
          .join("");
        return `<g transform="translate(${x} ${y}) rotate(${a}) scale(1.12)"><rect x="-20" y="-13" width="40" height="26" rx="12" fill="${c}"/>${puffs}</g>`;
      })
      .join(""),

  매운탕:
    steam([30, 50, 70], 2) +
    // 양은 냄비 + 손잡이
    tube("M14 46H4", "#f2c14e", 5) +
    tube("M86 46H96", "#f2c14e", 5) +
    `<ellipse cx="50" cy="44" rx="38" ry="12" fill="#f2c14e"/>` +
    `<ellipse cx="50" cy="45" rx="33" ry="9" fill="#e0452e"/>` +
    // 물고기 꼬리·등지느러미 (국물 위로)
    `<path d="M62 46C64 36 68 26 76 16C77 24 82 30 92 32C82 36 74 42 70 48Z" fill="#8a96b0"/>` +
    `<path d="M70 38l8-12M72 42l12-6" stroke="#5a6680" stroke-width="2"/>` +
    `<path d="M30 44C32 38 40 36 46 38C44 40 42 44 40 46Z" fill="#8a96b0" stroke-width="2.5"/>` +
    // 두부·파·고추
    `<rect x="46" y="40" width="9" height="7" fill="#fff" stroke-width="2.2"/>` +
    `<path d="M24 46l8-3M56 48l8-3" stroke="#43b04a" stroke-width="4"/>` +
    `<circle cx="36" cy="50" r="3" fill="#b8231a" stroke-width="2"/><circle cx="62" cy="41" r="2.6" fill="#b8231a" stroke-width="2"/>` +
    `<path d="M12 44C12 72 26 90 50 90S88 72 88 44C88 52 72 57 50 57S12 52 12 44Z" fill="#f2c14e"/>` +
    `<path d="M20 70Q50 80 80 70" stroke="#d9a030" stroke-width="3"/>`,

  // ── 밥 ──
  쌀밥: steam([36, 50, 64]) + riceBowl("#fdfbf2", riceGrains()),

  보리밥:
    steam([36, 50, 64]) +
    riceBowl(
      "#f3ead2",
      riceGrains((i) => i % 2 === 0) +
        MOUND.filter((_, i) => i % 2 === 0)
          .map(
            ([x, y], i) =>
              `<g transform="rotate(${((i * 53) % 120) - 60} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="4.2" ry="2.8" fill="#c9924a" stroke-width="1.6"/><path d="M${x - 2.5} ${y}H${x + 2.5}" stroke="#7a4e2c" stroke-width="1.4"/></g>`,
          )
          .join(""),
    ),

  콩밥:
    steam([36, 50, 64]) +
    riceBowl(
      "#fdfbf2",
      riceGrains((i) => [1, 4, 8, 10, 13, 16].includes(i)) +
        [1, 4, 8, 10, 13, 16]
          .map((i) => {
            const [x, y] = MOUND[i];
            return (
              `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.6" fill="#2a2430"/>` +
              dot(x - 1.5, y - 1.2, 1.1, "#fff")
            );
          })
          .join(""),
    ),

  오곡밥:
    steam([36, 50, 64]) +
    riceBowl(
      "#b77a86",
      MOUND.map(([x, y], i) => {
        const k = i % 4;
        if (k === 0)
          return `<ellipse cx="${x}" cy="${y}" rx="4" ry="3" fill="#8a2f3a"/>`; // 팥
        if (k === 1)
          return `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="3.4" fill="#2a2430"/>`; // 검은콩
        if (k === 2)
          return `<circle cx="${x}" cy="${y}" r="2.6" fill="#ffd23f" stroke-width="1.6"/>`; // 좁쌀·수수
        return grain(x, y, i, "#e8c8cc", "#8a5a64");
      }).join("") +
        [
          [30, 44],
          [56, 32],
          [72, 45],
          [46, 44],
        ]
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="2.4" fill="#ffd23f" stroke-width="1.6"/>`,
          )
          .join(""),
    ),

  약식:
    plate(74, 44, 17) +
    [
      [30, 60],
      [66, 58],
      [48, 42],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x - 16} ${y - 4}L${x} ${y - 12}L${x + 16} ${y - 4}V${y + 8}L${x} ${y + 16}L${x - 16} ${y + 8}Z" fill="#7a3e1e"/>` +
          `<path d="M${x - 16} ${y - 4}L${x} ${y + 4}L${x + 16} ${y - 4}M${x} ${y + 4}V${y + 16}" stroke-width="2.5"/>` +
          `<path d="M${x} ${y + 4}L${x + 16} ${y - 4}V${y + 8}L${x} ${y + 16}Z" fill="#5e2e14" stroke-width="2.5"/>` +
          // 밤 (노란 반달) · 대추 (빨간 알) · 잣
          `<path d="M${x - 9} ${y - 3}C${x - 9} ${y - 9} ${x - 1} ${y - 9} ${x - 1} ${y - 3}Z" fill="#f2c14e" stroke-width="2"/>` +
          `<ellipse cx="${x + 5}" cy="${y - 5}" rx="3.6" ry="2.4" fill="#c62f3f" stroke-width="2"/>` +
          `<ellipse cx="${x - 7}" cy="${y + 8}" rx="2.2" ry="3" fill="#fff4d6" stroke-width="1.5"/>` +
          `<ellipse cx="${x + 8}" cy="${y + 6}" rx="2.2" ry="3" fill="#c62f3f" stroke-width="1.5"/>`,
      )
      .join(""),

  // ── 떡·전 ──
  경단:
    plate(80, 44, 14) +
    (
      [
        [28, 72, "#f2c14e", "#c9962a"],
        [50, 74, "#fff", "#2a2430"],
        [72, 72, "#8ab84a", "#5a8a2a"],
        [39, 52, "#9a5b2e", "#c98b4f"],
        [61, 52, "#ff9aa8", "#fff"],
        [50, 32, "#ffd23f", "#e8a020"],
      ] as [number, number, string, string][]
    )
      .map(
        ([x, y, c, d]) =>
          `<circle cx="${x}" cy="${y}" r="12" fill="${c}"/>` +
          dot(+x - 4, +y - 3, 1.5, d) +
          dot(+x + 4, +y - 5, 1.5, d) +
          dot(+x + 5, +y + 3, 1.5, d) +
          dot(+x - 3, +y + 5, 1.5, d) +
          dot(+x, +y, 1.5, d) +
          `<path d="M${+x - 7} ${+y - 5}q2-3 5-4" stroke="#fff" stroke-width="2" opacity=".6"/>`,
      )
      .join(""),

  쑥떡:
    // 쑥 잎 (톱니)
    `<path d="M60 30C62 16 74 8 88 8C86 12 90 14 86 18C90 20 86 24 82 24C84 28 78 30 74 28C72 32 66 32 60 30Z" fill="#6aa84f"/>` +
    `<path d="M60 30C68 22 76 16 86 12" stroke="#3a7a2e" stroke-width="2.5"/>` +
    `<path d="M44 36C40 26 42 18 50 12C52 18 54 20 58 22C54 26 52 30 50 36Z" fill="#8cc06a"/>` +
    plate(76, 44, 16) +
    // 납작한 초록 떡 세 개 + 콩고물
    [
      [30, 66, -10],
      [68, 66, 10],
      [49, 52, 0],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="rotate(${a} ${x} ${y})"><rect x="${x - 18}" y="${y - 6}" width="36" height="16" rx="6" fill="#3f6b2e"/>` +
          `<rect x="${x - 18}" y="${y - 10}" width="36" height="14" rx="6" fill="#5a8a3a"/>` +
          dot(x - 8, y - 4, 1.6, "#f2c14e") +
          dot(x + 2, y - 6, 1.6, "#f2c14e") +
          dot(x + 10, y - 3, 1.6, "#f2c14e") +
          `</g>`,
      )
      .join(""),

  화전:
    plate(70, 44, 20) +
    pancake(
      28,
      66,
      17,
      11,
      "#fff4e6",
      flower(28, 64, 7, "#ff9aa8") +
        `<path d="M37 70q5-2 7-6" stroke="#43b04a" stroke-width="3"/>`,
    ) +
    pancake(
      72,
      66,
      17,
      11,
      "#fff4e6",
      flower(72, 64, 7, "#e85d9a") +
        `<path d="M63 70q-5-2-7-6" stroke="#43b04a" stroke-width="3"/>`,
    ) +
    pancake(
      50,
      46,
      20,
      13,
      "#fff4e6",
      flower(50, 44, 9, "#ff9aa8") +
        `<path d="M60 52q6-2 9-8" stroke="#43b04a" stroke-width="3.5"/><ellipse cx="66" cy="44" rx="4" ry="2" fill="#43b04a" stroke-width="1.8" transform="rotate(-40 66 44)"/>`,
    ) +
    sparkle(86, 30, 5),

  호박전:
    // 애호박 한 개 (뒤)
    `<path d="M50 18C62 10 84 12 92 22C94 28 90 32 84 32C72 30 60 32 52 28C46 26 46 20 50 18Z" fill="#6aa84f"/>` +
    `<path d="M56 22C66 18 78 18 88 22" stroke="#a6d07a" stroke-width="3"/>` +
    `<path d="M50 20L44 16" stroke="#3a7a2e" stroke-width="5"/>` +
    plate(72, 44, 20) +
    zucchiniSlice(28, 66, 17) +
    zucchiniSlice(72, 66, 17) +
    zucchiniSlice(50, 50, 19),

  // ── 사람 ──
  집배원:
    // 우체통 (빨강)
    `<rect x="80" y="84" width="6" height="12" fill="#8a96b0"/>` +
    `<path d="M72 58C72 48 94 48 94 58V86H72Z" fill="#e8553d"/>` +
    `<rect x="76" y="62" width="14" height="3.5" rx="1.5" fill="${INK}" stroke="none"/>` +
    person(34, 96, 1.5, {
      hair: "#2f2a26",
      style: "short",
      shirt: "#3b78e6",
      cap: "#26356b",
    }) +
    // 어깨 가방 + 편지들
    `<path d="M24 68L48 82" stroke="#6b3e26" stroke-width="4"/>` +
    envelope(36, 74, 16, 10) +
    `<rect x="32" y="80" width="26" height="16" rx="3" fill="#9a5b2e"/>` +
    `<path d="M32 86H58" stroke="#6b3e26" stroke-width="2.5"/>` +
    // 편지를 든 손
    tube("M46 74L58 60", "#3b78e6", 7) +
    `<circle cx="60" cy="58" r="5" fill="${SKIN}"/>` +
    `<g transform="rotate(-12 64 48)">${envelope(52, 38, 24, 16)}</g>`,

  이발사:
    // 이발소 표시등 (빨강·파랑 줄무늬 기둥)
    `<rect x="9" y="22" width="16" height="56" fill="#fff"/>` +
    `<path d="M9 26L25 34M9 38L25 46M9 50L25 58M9 62L25 70" stroke="#e8553d" stroke-width="5" stroke-linecap="butt"/>` +
    `<path d="M9 32L25 40M9 56L25 64" stroke="#3b78e6" stroke-width="3.5" stroke-linecap="butt"/>` +
    `<rect x="9" y="22" width="16" height="56"/>` +
    `<path d="M7 22C7 12 27 12 27 22Z" fill="#dfe8f5"/><rect x="7" y="78" width="20" height="6" rx="2" fill="#dfe8f5"/>` +
    // 흰 가운 입은 이발사
    person(58, 96, 1.5, {
      hair: "#2f2a26",
      style: "short",
      shirt: "#fff",
      mustache: true,
    }) +
    `<path d="M52 66L58 76L64 66" stroke="#7ec8f0" stroke-width="3"/>` +
    // 가위 든 손 + 빗
    tube("M72 74L82 56", "#fff", 7) +
    `<circle cx="83" cy="54" r="5" fill="${SKIN}"/>` +
    `<path d="M80 50L92 26M86 50L84 24" stroke="#8a96b0" stroke-width="3.5"/>` +
    `<circle cx="78" cy="52" r="3.5" fill="#e8553d" stroke-width="2.5"/><circle cx="88" cy="53" r="3.5" fill="#e8553d" stroke-width="2.5"/>` +
    tube("M44 74L38 84", "#fff", 7) +
    `<rect x="30" y="84" width="16" height="6" rx="1.5" fill="#26294a" stroke-width="2"/>` +
    `<path d="M32 90v3M36 90v3M40 90v3M44 90v3" stroke-width="2"/>` +
    // 떨어지는 머리카락
    `<path d="M92 36l3 3M94 44l-2 3M76 30l-3 2" stroke="#5a3b24" stroke-width="2.5"/>`,

  산타클로스:
    // 선물 자루
    `<path d="M62 50C58 36 70 28 80 30C92 32 96 46 92 62C90 76 74 80 66 72C60 66 64 58 62 50Z" fill="#c98b4f"/>` +
    `<rect x="70" y="22" width="14" height="12" fill="#43b04a"/><path d="M77 22v12M70 28h14" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M66 40C72 36 80 36 86 38" stroke="#9a5b2e" stroke-width="3"/>` +
    person(44, 96, 1.55, { hair: "#fff", style: "short", shirt: "#e8553d" }) +
    // 허리띠 + 흰 털 단
    `<rect x="21" y="80" width="46" height="7" fill="#1f1f26" stroke-width="2.5"/><rect x="39" y="79" width="10" height="9" rx="1.5" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M44 66V80" stroke="#fff" stroke-width="5"/>` +
    // 큰 흰 수염 + 콧수염
    `<path d="M27 46C26 72 62 72 61 46C56 54 32 54 27 46Z" fill="#fff"/>` +
    `<path d="M36 51C40 47 43 48 44 50C45 48 48 47 52 51C48 54 40 54 36 51Z" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="44" cy="46" r="3" fill="#ff9aa8" stroke-width="2"/>` +
    // 빨간 모자 (흰 챙, 방울)
    `<path d="M26 34C26 16 44 8 58 14C66 18 70 24 72 30C64 24 60 26 60 34Z" fill="#e8553d"/>` +
    `<rect x="24" y="30" width="40" height="8" rx="4" fill="#fff"/>` +
    `<circle cx="72" cy="32" r="5.5" fill="#fff"/>`,

  임금:
    // 뒤 병풍: 해·달·산봉우리
    `<rect x="6" y="8" width="88" height="62" rx="3" fill="#3b78e6"/>` +
    `<path d="M6 70L20 40L32 56L50 30L68 56L80 40L94 70Z" fill="#3a9e47"/>` +
    `<circle cx="18" cy="20" r="7" fill="#e8553d"/><circle cx="82" cy="20" r="7" fill="#fff"/>` +
    // 붉은 곤룡포 + 가슴의 금빛 둥근 무늬 + 옥대
    `<path d="M14 96C14 72 28 62 50 62S86 72 86 96Z" fill="#d8342a"/>` +
    `<path d="M40 62C40 70 60 70 60 62" fill="${SKIN}"/>` +
    `<path d="M38 63C42 72 58 72 62 63" stroke="#1f1f26" stroke-width="3"/>` +
    `<circle cx="50" cy="82" r="10" fill="${HL}"/>` +
    `<path d="M44 84C44 76 54 76 54 82C54 86 48 86 48 82" stroke="#d8342a" stroke-width="2.5"/>` +
    `<path d="M18 92H82" stroke="#1f1f26" stroke-width="5"/>` +
    // 얼굴
    `<circle cx="50" cy="44" r="16" fill="${SKIN}"/>` +
    dot(44, 44, 2.2) +
    dot(56, 44, 2.2) +
    `<path d="M44 51C47 49 49 50 50 51C51 50 53 49 56 51" stroke="#1f1f26" stroke-width="2.5"/>` +
    `<path d="M48 55C48 60 52 60 52 55Z" fill="#1f1f26" stroke-width="2"/>` +
    // 익선관: 까만 관 + 뒤로 솟은 두 날개
    `<ellipse cx="38" cy="22" rx="6" ry="8" fill="#1f1f26"/><ellipse cx="62" cy="22" rx="6" ry="8" fill="#1f1f26"/>` +
    `<path d="M33 40C32 24 40 20 50 20S68 24 67 40Z" fill="#1f1f26"/>` +
    `<path d="M33 38H67" stroke="#ffc933" stroke-width="2.5"/>`,

  카우보이:
    // 올가미 밧줄
    `<ellipse cx="80" cy="16" rx="13" ry="6" stroke="#c98b4f" stroke-width="4"/>` +
    `<path d="M74 21C76 30 80 40 80 50" stroke="#c98b4f" stroke-width="4"/>` +
    person(46, 96, 1.5, { hair: "#6b3e26", style: "short", shirt: "#e8862e" }) +
    // 조끼 + 빨간 목수건
    `<path d="M28 96V78C28 72 32 68 36 67L40 96Z" fill="#6b3e26"/><path d="M64 96V78C64 72 60 68 56 67L52 96Z" fill="#6b3e26"/>` +
    `<path d="M36 64L56 64L46 78Z" fill="#e8553d"/>` +
    // 든 팔
    tube("M60 74L78 54", "#e8862e", 7) +
    `<circle cx="80" cy="52" r="5" fill="${SKIN}"/>` +
    // 챙 넓은 카우보이 모자
    `<path d="M14 30C18 38 74 38 78 30C70 34 22 34 14 30Z" fill="#9a5b2e"/>` +
    `<path d="M32 32C30 16 36 10 40 12C42 14 44 14 46 12C48 14 50 14 52 12C56 10 62 16 60 32Z" fill="#9a5b2e"/>` +
    `<path d="M32 28C40 30 52 30 60 28" stroke="#3a2a20" stroke-width="3"/>`,

  은행원:
    person(50, 80, 1.55, {
      hair: "#2f2a26",
      style: "short",
      shirt: "#26356b",
      glasses: true,
    }) +
    // 흰 셔츠 깃 + 넥타이
    `<path d="M42 50L50 60L58 50Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M48 55H52L53 66L50 70L47 66Z" fill="#e8553d" stroke-width="2"/>` +
    // 창구 + 돈
    `<rect x="4" y="70" width="92" height="26" rx="2" fill="#c98b4f"/>` +
    `<rect x="4" y="66" width="92" height="7" rx="2" fill="#e0a868"/>` +
    // 지폐 한 장을 내미는 손
    `<g transform="rotate(-8 30 58)"><rect x="14" y="50" width="30" height="16" rx="1.5" fill="#8fd08a"/><circle cx="29" cy="58" r="4.5" fill="#5fc24a" stroke-width="2"/></g>` +
    `<circle cx="40" cy="64" r="5" fill="${SKIN}"/>` +
    // 동전 탑
    [60, 54, 48]
      .map((y) => `<ellipse cx="78" cy="${y}" rx="10" ry="4" fill="#ffc933"/>`)
      .join("") +
    `<ellipse cx="66" cy="62" rx="7" ry="3.2" fill="#ffc933" stroke-width="2.5"/>` +
    sparkle(90, 38, 5),

  // ── 공연 ──
  관객:
    // 불 켜진 무대 + 공연하는 사람
    `<rect x="4" y="6" width="92" height="52" fill="#3a3f6b"/>` +
    `<path d="M4 6H20C16 24 18 40 12 58H4Z" fill="#e8553d"/><path d="M96 6H80C84 24 82 40 88 58H96Z" fill="#e8553d"/>` +
    `<path d="M36 6L50 6L64 6L72 50H28Z" fill="#fff1b8" stroke="none" opacity=".6"/>` +
    `<rect x="4" y="50" width="92" height="8" fill="#c98b4f"/>` +
    person(50, 51, 0.9, { hair: "#5a3b24", style: "pony", shirt: "#e85d9a" }) +
    note(72, 24, HL) +
    note(26, 30, HL) +
    // 무대를 바라보는 관객 뒷모습 두 줄
    backHead(20, 64, 1, "#2f2a26", "#3b8fe0") +
    backHead(50, 62, 1, "#5a3b24", "#43b04a") +
    backHead(80, 64, 1, "#2f2a26", "#ff9f1a") +
    backHead(34, 80, 1.15, "#5a3b24", "#8e4fc9") +
    backHead(66, 80, 1.15, "#2f2a26", "#e8553d") +
    // 박수 치는 손
    `<circle cx="8" cy="72" r="4" fill="${SKIN}"/><circle cx="92" cy="72" r="4" fill="${SKIN}"/>` +
    `<path d="M4 64l-1-4M12 64l2-3M88 64l-2-3M96 64l1-4" stroke="#9aa6c4" stroke-width="2.5"/>`,

  합창단:
    note(12, 22, "#8e4fc9") +
    note(84, 14, "#8e4fc9") +
    // 뒷줄 (계단 위)
    `<rect x="4" y="60" width="92" height="36" fill="#dfe8f5"/>` +
    singer(22, 62, 0.95, "#2f2a26", "short", "#8e4fc9") +
    singer(42, 62, 0.95, "#5a3b24", "bun", "#8e4fc9") +
    singer(62, 62, 0.95, "#2f2a26", "long", "#8e4fc9") +
    singer(80, 62, 0.95, "#5a3b24", "short", "#8e4fc9") +
    // 앞줄
    singer(30, 96, 1.05, "#5a3b24", "pony", "#8e4fc9") +
    singer(50, 96, 1.05, "#2f2a26", "short", "#8e4fc9") +
    singer(70, 96, 1.05, "#5a3b24", "long", "#8e4fc9"),

  오케스트라:
    // 하프 (뒤 가운데)
    `<path d="M40 50L42 8C52 6 60 16 64 26C60 34 54 42 48 50Z" fill="#f2c14e"/>` +
    `<path d="M44 12L44 48M48 12L48 46M52 16L52 42M56 20L56 36" stroke="#fff4d6" stroke-width="1.6"/>` +
    `<path d="M40 50L42 8C52 6 60 16 64 26C60 34 54 42 48 50Z"/>` +
    // 바이올린 연주자 (왼쪽)
    person(20, 68, 1.05, { hair: "#5a3b24", style: "long", shirt: "#1f1f26" }) +
    `<g transform="rotate(-35 30 38)"><ellipse cx="30" cy="42" rx="5.5" ry="8" fill="#b5601f" stroke-width="2.5"/><path d="M30 34V24" stroke-width="3"/></g>` +
    `<path d="M16 26L40 50" stroke="#c98b4f" stroke-width="2.5"/>` +
    // 첼로 연주자 (오른쪽)
    person(82, 68, 1.05, {
      hair: "#2f2a26",
      style: "short",
      shirt: "#1f1f26",
    }) +
    `<path d="M70 34V20" stroke-width="3.5"/>` +
    `<path d="M70 34C62 34 60 42 64 46C58 50 60 64 70 64C80 64 82 50 76 46C80 42 78 34 70 34Z" fill="#b5601f"/>` +
    `<path d="M70 40V60M60 50H86" stroke-width="2"/>` +
    // 지휘자 뒷모습 (앞 가운데): 두 팔을 들고 지휘봉
    `<rect x="30" y="90" width="40" height="6" rx="1.5" fill="#8a96b0"/>` +
    tube("M40 78L26 62", "#2f2a33", 7) +
    tube("M60 78L74 60", "#2f2a33", 7) +
    `<circle cx="25" cy="60" r="4.5" fill="${SKIN}"/><circle cx="75" cy="58" r="4.5" fill="${SKIN}"/>` +
    tube("M76 56L88 42", "#fff", 2) +
    `<path d="M34 92C34 78 40 72 50 72S66 78 66 92Z" fill="#2f2a33"/>` +
    `<path d="M50 72V92" stroke="#1f1f26" stroke-width="2"/>` +
    `<circle cx="50" cy="64" r="9" fill="#8a8a90"/>` +
    `<path d="M44 74L50 80L56 74" stroke="#fff" stroke-width="2.5"/>` +
    note(88, 24),
};
