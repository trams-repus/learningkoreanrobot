// 음식 그림 묶음 (3단계 어휘: 마실 것·화채·샐러드·수프·외국 음식·길거리 간식·콩과 씨앗). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 주스는 같은 컵에 색 + 옆의 과일·채소, 차는 잔 모양(레몬차 유리잔+레몬 조각, 홍차 찻잔+티백, 핫초코 머그+마시멜로),
// 화채는 그릇(과일화채 유리 그릇, 수박화채 수박 껍질 그릇), 콩은 색·모양(강낭콩 붉은 콩팥 모양, 완두콩 꼬투리, 검은콩·팥·녹두 그릇에 담긴 색),
// 빵은 모양(찐빵 찜통, 호빵 온장고, 풀빵 둥근 틀, 국화빵 꽃 모양, 카레빵 속 카레, 크로켓 접시에 양배추).
import { INK, HL, dot, blob, tube } from '../pictureKit.ts';

const f = (n: number) => n.toFixed(1);

/** 김 세 줄 */
const steam = (x: number, y: number, gap = 12) =>
  [-gap, 0, gap].map((d, i) => `<path d="M${x + d} ${y - (i === 1 ? 2 : 0)}c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`).join('');

/** 과일 단면 (오렌지·레몬 조각): 껍질 + 속 + 방사선 */
function citrus(cx: number, cy: number, r: number, peel: string, flesh: string, line: string): string {
  let d = '';
  for (let i = 0; i < 8; i++) {
    const t = (Math.PI * 2 * i) / 8;
    d += `M${cx} ${cy}L${f(cx + (r - 4) * Math.cos(t))} ${f(cy + (r - 4) * Math.sin(t))}`;
  }
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${peel}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="${flesh}" stroke="none"/>` +
    `<path d="${d}" stroke="${line}" stroke-width="2"/>`
  );
}

/** 주스 컵 (빨대 + 유리컵 + 주스 색) */
function juice(c: string, hi: string, straw: string): string {
  return (
    tube('M46 40L54 10H66', straw, 4) +
    `<path d="M14 28L21 92H55L62 28Z" fill="#f4fbff"/>` +
    `<path d="M15.4 40L22 88H54L60.6 40Z" fill="${c}" stroke="none"/><path d="M15.4 40H60.6" stroke-width="2.5"/>` +
    `<path d="M14 28L21 92H55L62 28Z"/>` +
    `<path d="M24 50L27 80" stroke="${hi}" stroke-width="4"/>`
  );
}

/** 옆에서 본 그릇: 국물 면 + 속 재료 + 몸통 + 굽 */
function bowl(cy: number, soup: string, body: string, inner = '', band = ''): string {
  return (
    `<path d="M38 ${cy + 36}L36 ${cy + 44}H64L62 ${cy + 36}" fill="${body}"/>` +
    `<ellipse cx="50" cy="${cy}" rx="38" ry="11" fill="${soup}"/>` +
    inner +
    `<path d="M12 ${cy}C12 ${cy + 26} 30 ${cy + 40} 50 ${cy + 40}S88 ${cy + 26} 88 ${cy}C88 ${cy + 6} 71 ${cy + 11} 50 ${cy + 11}S12 ${cy + 6} 12 ${cy}Z" fill="${body}"/>` +
    (band ? `<path d="M19 ${cy + 20}Q50 ${cy + 30} 81 ${cy + 20}" stroke="${band}" stroke-width="4"/>` : '')
  );
}

/** 접시 */
const plate = (cy: number, rx = 44, ry = 12, fill = '#fff', rim = '#dfe8f5') =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 4}" stroke="${rim}" stroke-width="2.5"/>`;

/** 머그잔: 손잡이 + 몸통 + 마실 것 면 */
function mug(body: string, drink: string, top = ''): string {
  return (
    tube('M68 48C86 48 86 76 68 76', body, 5) +
    `<path d="M14 36V80C14 87 20 91 28 91H54C62 91 68 87 68 80V36Z" fill="${body}"/>` +
    `<ellipse cx="41" cy="36" rx="27" ry="7" fill="${drink}"/>` +
    top
  );
}

/** 사과 한 알 (가운데 x,y, 크기 s) */
const apple = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s}) translate(-50 -55)" stroke-width="${f(3.5 / s)}">` +
  `<path d="M50 30C50 22 52 16 57 11" stroke="#6b3e26" stroke-width="${f(5 / s)}"/>` +
  `<path d="M50 30C38 20 14 24 14 50C14 74 30 90 43 88C46 87 48 86 50 86S54 87 57 88C70 90 86 74 86 50C86 24 62 20 50 30Z" fill="#e8553d"/>` +
  `<path d="M55 22C61 10 77 10 81 16C73 24 63 26 55 22Z" fill="#43b04a"/></g>`;

/** 포도송이 */
const grapes = (x: number, y: number, r = 6) =>
  `<path d="M${x} ${y - 3 * r}V${y - 4.2 * r}" stroke="#6b3e26" stroke-width="4"/>` +
  `<path d="M${x} ${y - 3.6 * r}C${x + 4} ${y - 5.4 * r} ${x + 14} ${y - 5 * r} ${x + 16} ${y - 4 * r}C${x + 10} ${y - 3 * r} ${x + 4} ${y - 3 * r} ${x} ${y - 3.6 * r}Z" fill="#43b04a"/>` +
  [
    [-1.8, -2],
    [0, -2.2],
    [1.8, -2],
    [-0.9, -0.5],
    [0.9, -0.5],
    [-1.8, -0.8],
    [1.8, -0.8],
    [0, 1],
    [-0.9, 2.4],
    [0.9, 2.4],
    [0, 3.8],
  ]
    .map(([a, b]) => `<circle cx="${f(x + a * r)}" cy="${f(y + b * r)}" r="${r}" fill="#8e4fc9" stroke-width="2.5"/>`)
    .join('');

/** 그릇에 수북이 담은 콩 (검은콩·팥·녹두) */
function beanDish(pile: string, bean: string, mark: (x: number, y: number, a: number) => string, rx: number, ry: number): string {
  const pts: [number, number, number][] = [];
  const rows: [number, number, number][] = [
    [58, 18, 82],
    [50, 24, 76],
    [42, 30, 70],
    [34, 38, 62],
    [27, 46, 54],
  ];
  rows.forEach(([y, a, b], j) => {
    for (let x = a + (j % 2) * 4; x <= b; x += rx * 2 + 1.5) pts.push([x, y, ((x * 37 + y * 11) % 60) - 30]);
  });
  const one = ([x, y, a]: [number, number, number]) =>
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${bean}" stroke-width="2" transform="rotate(${a} ${f(x)} ${f(y)})"/>` + mark(x, y, a);
  return (
    `<ellipse cx="50" cy="60" rx="42" ry="12" fill="#8a5a30"/>` +
    `<path d="M14 62Q18 24 50 20Q82 24 86 62Z" fill="${pile}" stroke="none"/>` +
    pts.map(one).join('') +
    `<path d="M8 60C10 80 28 90 50 90S90 80 92 60C88 70 70 74 50 74S12 70 8 60Z" fill="#c98b4f"/>` +
    `<path d="M20 80Q50 90 80 80" stroke="#9a5b2e" stroke-width="3"/>`
  );
}

/** 알밤 (x,y 가운데, s 크기): 윗부분이 벌어져 노란 속이 보인다 */
function chestnut(x: number, y: number, s: number, rot = 0): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" stroke-width="${f(3.5 / s)}">` +
    `<path d="M0 -15C10 -13 17 -3 16 8Q15 13 10 13H-10Q-15 13 -16 8C-17 -3 -10 -13 0 -15Z" fill="#8a4a24"/>` +
    `<path d="M-15 7Q0 11 15 7" stroke="#e0b485" stroke-width="${f(4 / s)}"/>` +
    `<path d="M-7 -9L0 -3L7 -9L0 -14Z" fill="#ffd23f" stroke-width="${f(2.5 / s)}"/>` +
    `<path d="M-9 -3C-9 -7 -7 -9 -5 -10" stroke="#c07a48" stroke-width="${f(3 / s)}"/>` +
    `</g>`
  );
}

/** 꽃별 모양 (국화빵·달고나) */
function star(cx: number, cy: number, r1: number, r2: number, n: number, fill: string, extra = ''): string {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const t = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? r2 : r1;
    d += `${i ? 'L' : 'M'}${f(cx + r * Math.cos(t))} ${f(cy + r * Math.sin(t))}`;
  }
  return `<path d="${d}Z" fill="${fill}" ${extra}/>`;
}

/** 꽃잎 테두리 (국화빵) */
function flowerCake(cx: number, cy: number, r: number, fill: string): string {
  let d = '';
  const n = 10;
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = t - Math.PI / n;
      d += `Q${f(cx + r * 1.28 * Math.cos(m))} ${f(cy + r * 1.28 * Math.sin(m))} ${f(x)} ${f(y)}`;
    }
  }
  let petals = '';
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    petals += `M${f(cx + r * 0.35 * Math.cos(t))} ${f(cy + r * 0.35 * Math.sin(t))}L${f(cx + r * 0.85 * Math.cos(t))} ${f(cy + r * 0.85 * Math.sin(t))}`;
  }
  return (
    `<path d="${d}Z" fill="${fill}"/>` +
    `<path d="${petals}" stroke="#b8702a" stroke-width="2.5"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.3)}" fill="#e0943a" stroke-width="2.5"/>`
  );
}

/** 밀 이삭 한 줄기 (통통한 낟알, 짧은 수염) */
function wheatEar(x: number, y: number, rot: number, s: number): string {
  let k = '';
  for (let i = 0; i < 6; i++) {
    const gy = -2 - i * 7;
    k +=
      `<path d="M-5 ${gy - 5}L-9 ${gy - 14}M5 ${gy - 5}L9 ${gy - 14}" stroke="#c9962a" stroke-width="2"/>` +
      `<ellipse cx="-5" cy="${gy}" rx="5" ry="7.5" fill="#f2c14e" stroke-width="2.5" transform="rotate(-25 -5 ${gy})"/>` +
      `<ellipse cx="5" cy="${gy}" rx="5" ry="7.5" fill="#f2c14e" stroke-width="2.5" transform="rotate(25 5 ${gy})"/>`;
  }
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="M0 50V4" stroke-width="7"/><path d="M0 50V4" stroke="#d9b24a" stroke-width="3"/>` +
    `<path d="M0 -48V-58" stroke="#c9962a" stroke-width="2"/>` +
    k +
    `<ellipse cx="0" cy="-46" rx="5" ry="7.5" fill="#f2c14e" stroke-width="2.5"/>` +
    `</g>`
  );
}

export const PICS: Record<string, string> = {
  // ── 마실 것 ──
  레몬차:
    steam(40, 22) +
    tube('M68 50C84 50 84 74 68 74', '#f4fbff', 4) +
    `<path d="M14 34V82C14 88 20 92 28 92H54C62 92 68 88 68 82V34Z" fill="#f4fbff"/>` +
    `<path d="M17.5 44V81C17.5 86 22 88.5 28 88.5H54C60 88.5 64.5 86 64.5 81V44Z" fill="#f7c948" stroke="none"/>` +
    `<path d="M17.5 44H64.5" stroke-width="2.5"/>` +
    citrus(34, 66, 11, '#ffd23f', '#fff3a0', '#f2c14e') +
    citrus(52, 76, 9, '#ffd23f', '#fff3a0', '#f2c14e') +
    `<path d="M14 34V82C14 88 20 92 28 92H54C62 92 68 88 68 82V34"/>` +
    `<path d="M60 36A17 17 0 1 1 90 44Z" fill="#ffd23f"/>` +
    `<path d="M63.5 37.5A13 13 0 1 1 86.5 43Z" fill="#fff3a0" stroke="none"/>` +
    `<path d="M75 40L68 28M75 40L78 25M75 40L87 32" stroke="#f2c14e" stroke-width="2"/>`,

  홍차:
    steam(50, 26) +
    `<ellipse cx="50" cy="84" rx="42" ry="10" fill="#fff"/><ellipse cx="50" cy="83" rx="30" ry="6" stroke="#dfe8f5" stroke-width="2.5"/>` +
    tube('M80 48C94 48 94 68 76 70', '#fff', 5) +
    `<path d="M16 42C16 66 30 80 50 80S84 66 84 42Z" fill="#fff"/>` +
    `<path d="M22 60Q50 70 78 60" stroke="#e85d9a" stroke-width="4"/>` +
    `<ellipse cx="50" cy="42" rx="34" ry="9" fill="#b0441f"/>` +
    `<path d="M40 42C44 48 52 48 56 42" stroke="#d9723f" stroke-width="3"/>` +
    `<path d="M62 42C66 36 70 34 72 38V58" stroke-width="2"/>` +
    `<rect x="65" y="56" width="14" height="14" rx="2" fill="#ff9f1a" stroke-width="2.5"/>`,

  핫초코:
    steam(41, 24) +
    mug(
      '#e8553d',
      '#7a4a2a',
      `<rect x="24" y="28" width="12" height="11" rx="3" fill="#fff" stroke-width="2.5"/>` +
        `<rect x="40" y="31" width="12" height="11" rx="3" fill="#ffd0e0" stroke-width="2.5"/>` +
        `<rect x="50" y="26" width="11" height="10" rx="3" fill="#fff" stroke-width="2.5"/>`,
    ) +
    `<path d="M20 42v9a3 3 0 0 0 6 0v-6M38 43v5a3 3 0 0 0 6 0v-5" fill="#7a4a2a" stroke-width="2.5"/>` +
    `<path d="M24 56V80" stroke="#ff9a8a" stroke-width="4"/>`,

  오렌지주스:
    juice('#ff9f1a', '#ffc97a', '#43b04a') +
    citrus(74, 74, 19, '#ff9f1a', '#ffc04d', '#ff9f1a'),

  사과주스:
    juice('#f7d66b', '#fff2b8', '#e8553d') + apple(74, 72, 0.42),

  포도주스:
    juice('#8e4fc9', '#c9a0f0', '#ffd23f') + grapes(76, 70, 5.5),

  토마토주스:
    juice('#e8403a', '#ff9a8a', '#43b04a') +
    `<circle cx="74" cy="74" r="18" fill="#e8403a"/>` +
    `<path d="M74 58L78 52M74 60L64 56L70 64L66 70L74 66L82 70L78 64L84 56Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M62 74C62 68 65 65 68 64" stroke="#ff9a8a" stroke-width="3.5"/>`,

  당근주스:
    juice('#f26b1d', '#ffb07a', '#8fd3ff') +
    `<g transform="rotate(-35 74 72)">` +
    `<path d="M68 52C64 44 66 38 70 36M74 52C74 42 76 38 80 36M78 54C82 46 86 44 90 46" stroke-width="8"/>` +
    `<path d="M68 52C64 44 66 38 70 36M74 52C74 42 76 38 80 36M78 54C82 46 86 44 90 46" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M62 56C62 52 86 52 86 56L76 96Q74 99 72 96Z" fill="#ff7f1a"/>` +
    `<path d="M66 64h6M76 74h6M70 84h5" stroke="#d9601a" stroke-width="3"/></g>`,

  // ── 화채·꼬치·바구니·샐러드 ──
  과일화채:
    `<path d="M92 12L64 44" stroke-width="10"/><path d="M92 12L64 44" stroke="#dfe8f5" stroke-width="4"/>` +
    `<path d="M38 84L34 92H66L62 84" fill="#dff3ff"/>` +
    `<ellipse cx="50" cy="48" rx="40" ry="12" fill="#ff9aa8"/>` +
    `<path d="M24 46L32 38L38 48Z" fill="#ff5c70" stroke-width="2.5"/>` +
    citrus(52, 42, 7, '#ff9f1a', '#ffc04d', '#ff9f1a') +
    `<circle cx="68" cy="48" r="5" fill="#fff" stroke-width="2.5"/>` +
    `<circle cx="40" cy="52" r="4" fill="#3b78e6" stroke-width="2.5"/>` +
    `<circle cx="72" cy="40" r="5" fill="#7cc242" stroke-width="2.5"/>` +
    `<path d="M10 48C10 72 28 86 50 86S90 72 90 48C90 54 72 60 50 60S10 54 10 48Z" fill="#ffc2cc"/>` +
    `<path d="M24 70L20 62M34 72h5M56 74h6M72 68l4-5" stroke="#ff5c70" stroke-width="4"/>` +
    `<path d="M18 58Q24 74 38 80" stroke="#fff" stroke-width="3.5" opacity=".6"/>`,

  수박화채:
    `<path d="M92 14L66 42" stroke-width="10"/><path d="M92 14L66 42" stroke="#dfe8f5" stroke-width="4"/>` +
    `<path d="M8 46C8 74 26 90 50 90S92 74 92 46Z" fill="#43b04a"/>` +
    `<path d="M20 50L16 72M34 54L32 84M50 55V89M66 54L68 84M80 50L84 72" stroke="#2e7a38" stroke-width="5"/>` +
    `<ellipse cx="50" cy="46" rx="42" ry="13" fill="#eaf5c8"/>` +
    `<ellipse cx="50" cy="46" rx="36" ry="9.5" fill="#ff7a8a" stroke-width="2.5"/>` +
    [
      [30, 44],
      [44, 48],
      [58, 43],
      [72, 47],
      [50, 40],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e8403a" stroke-width="2.5"/>` + dot(x + 1, y - 1, 1.2))
      .join('') +
    `<rect x="36" y="36" width="8" height="8" rx="2" fill="#e8f7ff" stroke-width="2.2"/>`,

  과일꼬치:
    `<g transform="rotate(-40 50 50)">` +
    tube('M4 50H94', '#d9a05b', 3) +
    `<path d="M14 36Q24 32 34 36Q38 48 24 66Q10 48 14 36Z" fill="#e8403a"/>` +
    `<path d="M14 36Q18 30 24 34Q30 30 34 36Q24 40 14 36Z" fill="#43b04a" stroke-width="2.5"/>` +
    dot(20, 46, 1.4, '#fff3a0') + dot(28, 46, 1.4, '#fff3a0') + dot(24, 54, 1.4, '#fff3a0') +
    `<rect x="39" y="38" width="18" height="24" rx="3" fill="#ffd23f"/><path d="M42 50h12" stroke="#f2a800" stroke-width="2.5"/>` +
    `<circle cx="70" cy="50" r="11" fill="#7cc242"/><circle cx="70" cy="50" r="4" fill="#f4ffd0" stroke="none"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => dot(Number(f(70 + 7 * Math.cos(i + 0.3))), Number(f(50 + 7 * Math.sin(i + 0.3))), 1.3)).join('') +
    `<circle cx="88" cy="50" r="7" fill="#8e4fc9"/>` +
    `</g>`,

  과일바구니:
    tube('M18 56C18 8 82 8 82 56', '#c98b4f', 5) +
    `<path d="M20 44C30 60 60 56 72 40C66 52 36 56 20 44Z" fill="#ffd23f"/>` +
    grapes(28, 44, 5) +
    apple(50, 42, 0.36) +
    `<circle cx="72" cy="46" r="11" fill="#ff9f1a"/>` +
    `<path d="M12 54L20 90H80L88 54Z" fill="#d9a05b"/>` +
    `<path d="M14 64H86M16 76H84" stroke="#9a5b2e" stroke-width="3"/>` +
    `<path d="M30 56V88M44 56V88M58 56V88M72 56V88" stroke="#b87a42" stroke-width="3"/>` +
    `<path d="M12 54L20 90H80L88 54Z"/>` +
    `<rect x="8" y="50" width="84" height="8" rx="4" fill="#c98b4f"/>`,

  과일샐러드:
    `<path d="M90 12L70 40" stroke-width="10"/><path d="M90 12L70 40" stroke="#8a96b0" stroke-width="4"/>` +
    `<path d="M86 6v10M92 8v10M96 12v8" stroke-width="3"/>` +
    blob('#fffaf0', [
      [30, 46, 12],
      [50, 38, 16],
      [70, 46, 12],
    ]) +
    `<path d="M16 50L28 24L40 50Z" fill="#e8403a"/>` + dot(24, 42, 1.5, '#fff3a0') + dot(32, 42, 1.5, '#fff3a0') + dot(28, 34, 1.5, '#fff3a0') +
    `<circle cx="52" cy="32" r="12" fill="#7cc242"/><circle cx="52" cy="32" r="4.5" fill="#f4ffd0" stroke="none"/>` +
    dot(45, 30, 1.4) + dot(59, 30, 1.4) + dot(52, 25, 1.4) + dot(52, 39, 1.4) +
    `<circle cx="70" cy="44" r="10" fill="#fff3c4"/><path d="M66 42q4-3 8 0" stroke="#f2d57e" stroke-width="2.5"/>` +
    `<rect x="38" y="42" width="13" height="12" rx="2" fill="#ffd23f"/>` +
    `<circle cx="80" cy="36" r="5.5" fill="#3b78e6"/>` +
    bowl(54, '#fff1c4', '#4a90e2', '', '#8fd3ff'),

  감자샐러드:
    plate(78, 44, 13) +
    `<path d="M16 72C14 60 26 58 30 64C30 52 44 54 44 62" fill="#7cc242"/>` +
    blob('#f5e39a', [
      [38, 60, 16],
      [54, 52, 18],
      [66, 62, 14],
      [50, 66, 14],
    ]) +
    [
      [40, 56, '#ff7f1a'],
      [58, 46, '#ff7f1a'],
      [66, 62, '#ff7f1a'],
    ]
      .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="6" height="6" rx="1" fill="${c}" stroke-width="2"/>`)
      .join('') +
    [
      [48, 64],
      [60, 58],
      [34, 64],
      [52, 44],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#43b04a" stroke-width="2"/>`)
      .join('') +
    `<ellipse cx="80" cy="36" rx="13" ry="10" fill="#c99a5a" transform="rotate(-20 80 36)"/>` +
    dot(76, 34, 1.5, '#8a6030') + dot(84, 38, 1.5, '#8a6030') + dot(82, 30, 1.5, '#8a6030'),

  // ── 수프 ──
  양송이수프:
    `<path d="M58 30L80 6" stroke-width="10"/><path d="M58 30L80 6" stroke="#dfe8f5" stroke-width="4"/>` +
    bowl(
      44,
      '#eadcb8',
      '#fff',
      `<g stroke-width="2.5"><path d="M24 44C24 36 38 36 38 44Z" fill="#fffaf0"/><path d="M29 44V49H33V44" fill="#fffaf0"/>` +
        `<path d="M44 40C44 32 58 32 58 40Z" fill="#fffaf0"/><path d="M49 40V45H53V40" fill="#fffaf0"/></g>` +
        `<circle cx="64" cy="44" r="2" fill="#43b04a" stroke="none"/><circle cx="40" cy="48" r="2" fill="#43b04a" stroke="none"/><circle cx="70" cy="40" r="2" fill="#43b04a" stroke="none"/>`,
      '#dfe8f5',
    ) +
    `<path d="M74 80V92H88V80" fill="#fffaf0"/>` +
    `<path d="M64 82C62 66 72 60 81 60S100 66 97 82Z" fill="#e8d4b0"/>` +
    `<path d="M70 70q4-5 10-5" stroke="#fff" stroke-width="3"/>`,

  호박수프:
    `<path d="M58 30L80 6" stroke-width="10"/><path d="M58 30L80 6" stroke="#dfe8f5" stroke-width="4"/>` +
    bowl(
      44,
      '#ff9f1a',
      '#fff',
      `<path d="M36 44C40 38 52 38 54 44S66 50 64 44" stroke="#fff4e0" stroke-width="4"/>` +
        `<ellipse cx="28" cy="44" rx="2.5" ry="1.6" fill="#43b04a" stroke="none"/><ellipse cx="68" cy="42" rx="2.5" ry="1.6" fill="#43b04a" stroke="none"/>`,
      '#ffc97a',
    ) +
    `<path d="M81 62V56" stroke="#6b3e26" stroke-width="5"/>` +
    `<ellipse cx="81" cy="77" rx="15" ry="14" fill="#ff8a1a"/>` +
    `<path d="M81 64V90M73 66Q68 77 73 88M89 66Q94 77 89 88" stroke="#d9601a" stroke-width="2.5"/>`,

  // ── 외국 음식 ──
  마카로니:
    plate(76, 44, 14, '#4a90e2', '#8fd3ff') +
    [
      [30, 66, 0],
      [52, 70, 60],
      [70, 62, -40],
      [40, 50, 140],
      [60, 46, 20],
      [48, 30, -80],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          tube('M-10 6C-10 -6 -2 -10 10 -10', '#ffd23f', 9) +
          `<ellipse cx="-10" cy="6" rx="5.5" ry="3" fill="#ffd23f" stroke-width="2.5"/><ellipse cx="-10" cy="6" rx="2.2" ry="1.2" fill="${INK}" stroke="none"/>` +
          `<path d="M-6 -2l3 3M-1 -6l2 4M4 -9l1 4" stroke="#e0a800" stroke-width="2"/>` +
          `</g>`,
      )
      .join(''),

  라자냐:
    plate(80, 44, 12) +
    `<path d="M16 42L34 26H84L66 42Z" fill="${HL}"/>` +
    `<path d="M66 42L84 26V60L66 76Z" fill="#e8553d"/>` +
    `<path d="M66 50L84 34M66 58L84 42M66 66L84 50" stroke="#f2d57e" stroke-width="4"/>` +
    `<rect x="16" y="42" width="50" height="34" fill="#f2d57e"/>` +
    `<rect x="16" y="46" width="50" height="7" fill="#e8553d" stroke="none"/>` +
    `<rect x="16" y="56" width="50" height="4" fill="#fff4d8" stroke="none"/>` +
    `<rect x="16" y="63" width="50" height="7" fill="#e8553d" stroke="none"/>` +
    `<rect x="16" y="42" width="50" height="34"/>` +
    `<path d="M22 42V48M40 42V50M56 42V47" stroke="${HL}" stroke-width="4"/>` +
    `<circle cx="46" cy="34" r="3" fill="#c9862a" stroke="none"/><circle cx="64" cy="31" r="3" fill="#c9862a" stroke="none"/><circle cx="34" cy="37" r="2.5" fill="#c9862a" stroke="none"/>` +
    `<path d="M56 30C58 24 66 22 70 26C66 30 60 32 56 30Z" fill="#43b04a" stroke-width="2.5"/>`,

  리소토:
    `<path d="M84 12L62 40" stroke-width="10"/><path d="M84 12L62 40" stroke="#dfe8f5" stroke-width="4"/>` +
    `<ellipse cx="50" cy="62" rx="46" ry="26" fill="#fff"/><ellipse cx="50" cy="61" rx="36" ry="18" stroke="#dfe8f5" stroke-width="2.5"/>` +
    blob('#f3e3b0', [
      [36, 58, 14],
      [52, 54, 16],
      [66, 60, 13],
      [48, 66, 12],
    ]) +
    [
      [30, 54, 20],
      [38, 62, -30],
      [46, 50, 40],
      [56, 60, 10],
      [62, 52, -40],
      [70, 62, 30],
      [52, 70, -10],
      [40, 70, 50],
      [60, 44, 0],
      [44, 42, -20],
      [28, 64, 60],
    ]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2" fill="#fffaf0" stroke="#d9c38a" stroke-width="1.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    `<g stroke-width="2.5"><path d="M34 52C34 44 46 44 46 52Z" fill="#b08058"/><path d="M38 52V57H42V52" fill="#e8d4b0"/>` +
    `<path d="M56 62C56 54 68 54 68 62Z" fill="#b08058"/><path d="M60 62V67H64V62" fill="#e8d4b0"/></g>` +
    `<path d="M48 54l4-4M52 58l4 1M44 64l-3 3M66 50l3-3" stroke="#3a9e47" stroke-width="3"/>`,

  타코:
    `<path d="M14 66C14 38 34 26 50 26S86 38 86 66Z" fill="#e8b84a"/>` +
    blob('#5fc24a', [
      [22, 50, 8],
      [32, 40, 9],
      [46, 36, 9],
      [60, 36, 9],
      [72, 42, 9],
      [80, 52, 7],
    ]) +
    `<circle cx="34" cy="40" r="5" fill="#e8403a" stroke-width="2.5"/><circle cx="56" cy="34" r="5" fill="#e8403a" stroke-width="2.5"/><circle cx="72" cy="42" r="5" fill="#e8403a" stroke-width="2.5"/>` +
    `<path d="M42 38l4-6M48 40l2-7M62 42l3-6M26 48l3-6" stroke="${HL}" stroke-width="3.5"/>` +
    `<path d="M10 58C10 82 30 90 50 90S90 82 90 58C90 70 72 78 50 78S10 70 10 58Z" fill="#f2c14e"/>` +
    `<path d="M10 58C10 44 20 40 24 44C22 60 36 76 50 78C30 78 12 72 10 58Z" fill="#f2c14e"/>` +
    `<path d="M90 58C90 44 80 40 76 44C78 60 64 76 50 78C70 78 88 72 90 58Z" fill="#f2c14e"/>` +
    dot(30, 82, 2, '#c9862a') + dot(50, 85, 2, '#c9862a') + dot(70, 82, 2, '#c9862a') + dot(20, 60, 2, '#c9862a') + dot(80, 60, 2, '#c9862a'),

  부리토:
    `<g transform="rotate(-28 50 54)">` +
    `<rect x="4" y="34" width="74" height="40" rx="14" fill="#f5dfa0"/>` +
    `<path d="M8 34H40L34 74H8Z" fill="#dfe8f5" stroke="none"/>` +
    `<path d="M40 34L34 74M18 36l-4 10M26 50l-6 8M16 64l-4 6" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<rect x="4" y="34" width="74" height="40" rx="14"/>` +
    `<path d="M50 40q4 4 10 2M54 64q4-2 8 1" stroke="#d9a05b" stroke-width="2.5"/>` +
    `<ellipse cx="78" cy="54" rx="14" ry="20" fill="#f5dfa0"/>` +
    `<ellipse cx="78" cy="54" rx="10" ry="16" fill="#fff8e4" stroke-width="2.5"/>` +
    `<circle cx="76" cy="46" r="4" fill="#7a4a2a" stroke-width="2"/><circle cx="82" cy="54" r="4" fill="#5fc24a" stroke-width="2"/>` +
    `<circle cx="75" cy="60" r="4" fill="#e8403a" stroke-width="2"/><circle cx="80" cy="65" r="3" fill="#7a4a2a" stroke-width="2"/>` +
    `</g>`,

  나초:
    `<ellipse cx="72" cy="76" rx="20" ry="8" fill="#fff"/>` +
    `<path d="M52 76C52 92 92 92 92 76" fill="#fff"/>` +
    `<ellipse cx="72" cy="76" rx="16" ry="5.5" fill="${HL}"/>` +
    [
      [14, 80, 38, 84, 24, 58],
      [30, 70, 54, 62, 36, 44],
      [10, 58, 32, 50, 16, 32],
      [34, 40, 58, 42, 50, 18],
      [52, 60, 70, 40, 76, 62],
      [60, 30, 86, 30, 76, 52],
    ]
      .map(
        ([a, b, c, d, e, g]) =>
          `<path d="M${a} ${b}L${c} ${d}L${e} ${g}Z" fill="#f2b84a"/>` +
          dot((a + c + e) / 3, (b + d + g) / 3, 1.6, '#c9862a'),
      )
      .join('') +
    `<path d="M22 58Q30 52 36 58T50 56M40 34Q46 30 52 36" stroke="${HL}" stroke-width="4"/>`,

  케밥:
    plate(78, 44, 12) +
    `<g transform="rotate(-18 50 54)">` +
    tube('M6 54H94', '#b8c2d8', 3) +
    `<circle cx="96" cy="54" r="4" fill="#b8c2d8" stroke-width="2.5"/>` +
    `<rect x="12" y="42" width="16" height="24" rx="5" fill="#9a5b2e"/><path d="M16 48l8 6M16 56l8 6" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<rect x="30" y="42" width="8" height="24" rx="3" fill="#43b04a"/>` +
    `<rect x="40" y="42" width="16" height="24" rx="5" fill="#9a5b2e"/><path d="M44 48l8 6M44 56l8 6" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<rect x="58" y="42" width="8" height="24" rx="3" fill="#e8403a"/>` +
    `<rect x="68" y="42" width="16" height="24" rx="5" fill="#9a5b2e"/><path d="M72 48l8 6M72 56l8 6" stroke="#6b3e26" stroke-width="2.5"/>` +
    `</g>`,

  쌀국수:
    `<path d="M92 10L52 36M86 4L48 32" stroke="#9a5b2e" stroke-width="5"/>` +
    bowl(
      50,
      '#f3d9a0',
      '#fff',
      `<path d="M26 50q8-4 16 0t16 0t16 0M30 46q8-3 14 0" stroke="#fffaf0" stroke-width="3.5"/>` +
        `<ellipse cx="36" cy="46" rx="8" ry="4" fill="#b0664a" stroke-width="2.5"/><ellipse cx="52" cy="50" rx="8" ry="4" fill="#b0664a" stroke-width="2.5"/>` +
        `<path d="M62 44C64 38 72 38 74 42C70 46 66 46 62 44Z" fill="#43b04a" stroke-width="2"/><path d="M24 50C22 44 28 42 32 44" fill="#43b04a" stroke-width="2"/>` +
        dot(46, 42, 2, '#e8403a') + dot(66, 50, 2, '#e8403a'),
      '#3b78e6',
    ) +
    `<path d="M78 44C74 34 84 28 92 34Z" fill="#7cc242"/><path d="M82 40L88 34" stroke="#d4f0a0" stroke-width="2"/>` +
    `<path d="M92 10L52 36" stroke="#c98b4f" stroke-width="2"/>`,

  딤섬:
    steam(50, 22, 16) +
    `<ellipse cx="50" cy="56" rx="42" ry="12" fill="#c98b4f"/>` +
    [
      [30, 52],
      [70, 52],
      [50, 58],
      [50, 44],
    ]
      .map(
        ([x, y]) =>
          `<path d="M${x - 13} ${y + 4}C${x - 14} ${y - 10} ${x - 6} ${y - 14} ${x} ${y - 16}C${x + 6} ${y - 14} ${x + 14} ${y - 10} ${x + 13} ${y + 4}Q${x} ${y + 8} ${x - 13} ${y + 4}Z" fill="#fffaf0"/>` +
          `<path d="M${x} ${y - 16}L${x - 7} ${y}M${x} ${y - 16}L${x} ${y + 2}M${x} ${y - 16}L${x + 7} ${y}" stroke="#e0d0b0" stroke-width="2.5"/>`,
      )
      .join('') +
    `<path d="M8 56V78C8 86 28 92 50 92S92 86 92 78V56C92 64 74 70 50 70S8 64 8 56Z" fill="#e0b070"/>` +
    `<path d="M8 66C8 74 28 80 50 80S92 74 92 66" stroke="#b8803a" stroke-width="3"/>` +
    `<path d="M24 72V86M40 75V90M60 75V90M76 72V86" stroke="#b8803a" stroke-width="2.5"/>`,

  마파두부:
    `<path d="M80 14L62 42" stroke-width="10"/><path d="M80 14L62 42" stroke="#dfe8f5" stroke-width="4"/>` +
    bowl(
      48,
      '#d9442b',
      '#fff',
      [
        [22, 42],
        [36, 46],
        [50, 40],
        [62, 46],
        [44, 50],
        [70, 40],
      ]
        .map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="9" rx="1.5" fill="#fffaf0" stroke-width="2.5"/>`)
        .join('') +
        `<circle cx="32" cy="42" r="2.2" fill="#5fc24a" stroke-width="1.5"/><circle cx="58" cy="44" r="2.2" fill="#5fc24a" stroke-width="1.5"/><circle cx="76" cy="50" r="2.2" fill="#5fc24a" stroke-width="1.5"/>` +
        dot(48, 52, 1.6, '#7a2a1a') + dot(28, 50, 1.6, '#7a2a1a') + dot(66, 44, 1.6, '#7a2a1a'),
      '#e8553d',
    ),

  // ── 빵·튀김·길거리 간식 ──
  카레빵:
    `<path d="M10 58C10 34 30 22 50 22S90 34 90 58C90 78 72 86 50 86S10 78 10 58Z" fill="#d98a2e"/>` +
    [
      [22, 44],
      [34, 34],
      [50, 30],
      [66, 34],
      [78, 46],
      [20, 62],
      [30, 74],
      [46, 78],
      [36, 54],
      [26, 52],
      [42, 42],
      [58, 42],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#a8601a" stroke="none"/>`)
      .join('') +
    `<path d="M50 50C58 44 66 54 72 48C80 50 84 58 82 66C76 76 62 78 54 72C46 66 44 56 50 50Z" fill="#a8641a"/>` +
    `<rect x="58" y="56" width="7" height="7" rx="1.5" fill="#ff7f1a" stroke-width="2"/><rect x="68" y="62" width="7" height="7" rx="1.5" fill="#fff1c4" stroke-width="2"/>` +
    `<path d="M62 76C62 84 66 86 68 84" fill="#a8641a" stroke-width="2.5"/>`,

  크로켓:
    plate(74, 46, 18) +
    `<path d="M12 70q6-8 12 0t10-2M14 62q6-6 12-2" stroke="#8fd070" stroke-width="4"/>` +
    [
      [38, 56, -12],
      [66, 62, 10],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="24" ry="15" fill="#d9943a"/>` +
          [
            [-12, -5],
            [0, -9],
            [12, -4],
            [-4, 5],
            [9, 6],
            [-15, 4],
            [16, 4],
          ]
            .map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="2" fill="#a8601a" stroke="none"/>`)
            .join('') +
          `</g>`,
      )
      .join('') +
    `<path d="M48 60l6-5 6 5 6-5 6 5 6-5" stroke="#6b3e26" stroke-width="4"/>`,

  핫바:
    tube('M50 70V96', '#e8c07a', 4) +
    `<path d="M34 12C34 4 66 4 66 12L68 20L64 28L68 36L64 44L68 52L64 60L66 68C66 76 34 76 34 68L36 60L32 52L36 44L32 36L36 28L32 20Z" fill="#e8a86b"/>` +
    `<path d="M38 20H62M36 36H64M36 52H64" stroke="#b8703a" stroke-width="3"/>` +
    `<rect x="40" y="26" width="5" height="4" rx="1" fill="#43b04a" stroke="none"/><rect x="54" y="42" width="5" height="4" rx="1" fill="#ff7f1a" stroke="none"/><rect x="44" y="58" width="5" height="4" rx="1" fill="#43b04a" stroke="none"/>` +
    `<path d="M38 14L62 24L38 34L62 44L38 54L62 64" stroke="#e8403a" stroke-width="4"/>`,

  순대볶음:
    steam(50, 20, 14) +
    tube('M86 40L97 30', '#5a3b24', 5) +
    `<ellipse cx="50" cy="60" rx="44" ry="30" fill="#3a3f55"/>` +
    `<ellipse cx="50" cy="59" rx="37" ry="23" fill="#d9442b" stroke-width="2.5"/>` +
    `<path d="M22 52C28 46 36 50 34 56S24 60 22 52Z" fill="#c8e68a" stroke-width="2.5"/><path d="M60 70C66 64 74 68 72 74S62 78 60 70Z" fill="#c8e68a" stroke-width="2.5"/>` +
    `<path d="M62 44C68 38 80 42 80 50C72 52 66 50 62 44Z" fill="#3a9e47" stroke-width="2.5"/>` +
    [
      [34, 64],
      [50, 52],
      [48, 70],
      [66, 56],
      [30, 48],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="7.5" fill="#5a3a4a" stroke-width="2.5"/>` +
          dot(x - 2, y - 2, 1.5, '#d8b8c8') + dot(x + 2.5, y, 1.5, '#d8b8c8') + dot(x - 1, y + 3, 1.5, '#d8b8c8'),
      )
      .join('') +
    `<path d="M40 44q6-3 10 2M56 80q5-3 10 0" stroke="#fff" stroke-width="3"/>`,

  회오리감자:
    tube('M50 4V96', '#d9a05b', 3) +
    [0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const y = 20 + i * 9.5;
        const rx = 24 - Math.abs(i - 3) * 2;
        return (
          `<ellipse cx="50" cy="${y}" rx="${rx}" ry="6" fill="#f2c14e" transform="rotate(-14 50 ${y})"/>` +
          dot(50 - rx / 2, y + 2, 1.3, '#e8553d') + dot(50 + rx / 3, y - 2, 1.3, '#e8553d')
        );
      })
      .join('') +
    `<path d="M30 22C24 30 24 38 30 46C24 54 24 62 30 70C26 76 28 82 32 84" stroke="#e0a030" stroke-width="2.5"/>`,

  군고구마:
    steam(46, 30, 12) +
    `<path d="M8 62C8 46 24 40 38 44L50 48L42 84C24 86 8 78 8 62Z" fill="#8e3a5c"/>` +
    `<path d="M92 60C94 44 78 38 64 42L52 46L60 82C78 84 92 76 92 60Z" fill="#8e3a5c"/>` +
    `<path d="M40 44Q56 58 42 84Q30 64 40 44Z" fill="#ffc933"/>` +
    `<path d="M62 42Q48 58 60 82Q74 62 62 42Z" fill="#ffc933"/>` +
    `<path d="M40 54Q46 62 42 74M62 52Q56 60 60 72" stroke="#ffe27a" stroke-width="3"/>` +
    dot(20, 56, 2.5, '#3a1a2a') + dot(28, 72, 2.5, '#3a1a2a') + dot(80, 54, 2.5, '#3a1a2a') + dot(76, 70, 2.5, '#3a1a2a') + dot(16, 68, 2, '#3a1a2a'),

  군밤:
    steam(50, 16, 14) +
    chestnut(28, 48, 1.4, -15) +
    chestnut(72, 48, 1.4, 15) +
    chestnut(50, 42, 1.5) +
    `<path d="M14 60H86L80 94H20Z" fill="#d9b27a"/>` +
    `<path d="M14 60H86L84 68H16Z" fill="#c99a5a"/>` +
    `<path d="M32 80H68" stroke="#b8905a" stroke-width="3"/>` +
    chestnut(82, 82, 1.1, 20),

  찐빵:
    steam(50, 18, 14) +
    `<path d="M8 72H92V84C92 90 80 94 50 94S8 90 8 84Z" fill="#e0b070"/>` +
    `<path d="M8 80H92M28 72V93M50 72V94M72 72V93" stroke="#b8803a" stroke-width="3"/>` +
    `<ellipse cx="50" cy="72" rx="44" ry="7" fill="#e0b070"/>` +
    `<path d="M8 72C8 50 20 40 34 40S58 50 58 72Z" fill="#fffaf0"/>` +
    `<path d="M22 54C22 48 26 45 30 44" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 72C50 52 62 42 76 42S94 54 92 72Z" fill="#fffaf0"/>` +
    `<path d="M58 70C58 58 66 52 74 52S88 58 86 70Z" fill="#6b2e2e"/>` +
    dot(68, 60, 1.6, '#a85a5a') + dot(78, 62, 1.6, '#a85a5a'),

  호빵:
    `<rect x="14" y="4" width="72" height="50" rx="7" fill="#e8553d"/>` +
    `<rect x="21" y="11" width="58" height="36" rx="4" fill="#ffe6a8"/>` +
    [33, 50, 67]
      .map((x) => `<path d="M${x - 8} 42C${x - 8} 28 ${x + 8} 28 ${x + 8} 42Z" fill="#fffaf0" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M21 42H79" stroke="#8a96b0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="88" rx="38" ry="7" fill="#fff"/>` +
    `<path d="M16 88C16 66 30 58 50 58S84 66 84 88Z" fill="#fffaf0"/>` +
    `<path d="M32 86C32 74 40 68 50 68S68 74 68 86Z" fill="#6b2e2e"/>` +
    dot(44, 76, 1.6, '#a85a5a') + dot(56, 78, 1.6, '#a85a5a') +
    `<path d="M24 76C24 70 28 66 32 64" stroke="#fff" stroke-width="3"/>`,

  찐감자:
    steam(50, 20, 14) +
    `<ellipse cx="50" cy="80" rx="44" ry="12" fill="#fff"/><ellipse cx="50" cy="79" rx="34" ry="6" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M12 66C10 52 20 44 32 46C42 44 50 52 48 64C46 76 34 80 24 78C16 76 12 72 12 66Z" fill="#c99a5a"/>` +
    dot(22, 56, 1.8, '#7a5028') + dot(36, 54, 1.8, '#7a5028') + dot(30, 68, 1.8, '#7a5028') +
    `<path d="M20 50q4-3 8-2" stroke="#e0bc86" stroke-width="3"/>` +
    `<ellipse cx="66" cy="62" rx="23" ry="17" fill="#c99a5a"/>` +
    `<path d="M50 56L56 50L62 55L68 48L74 54L82 50L84 60L78 68L70 72L60 71L52 66Z" fill="#fbe39a" stroke-width="2.5"/>` +
    dot(56, 70, 1.8, '#7a5028') + dot(80, 70, 1.8, '#7a5028'),

  찐옥수수:
    steam(28, 30, 10) +
    `<g transform="rotate(35 54 54)">` +
    `<path d="M54 74C36 76 34 92 40 98C46 90 50 84 54 80Z" fill="#8fd070"/>` +
    `<path d="M54 74C72 76 74 92 68 98C62 90 58 84 54 80Z" fill="#6fb84a"/>` +
    `<path d="M40 22C40 8 68 8 68 22V70C68 80 40 80 40 70Z" fill="#ffd23f"/>` +
    [20, 28, 36, 44, 52, 60, 68].map((y) => `<path d="M42 ${y}H66" stroke="#e0a800" stroke-width="2.2"/>`).join('') +
    `<path d="M48 12V76M54 10V78M60 12V76" stroke="#e0a800" stroke-width="2.2"/>` +
    `<path d="M40 22C40 8 68 8 68 22V70C68 80 40 80 40 70Z"/>` +
    `<path d="M54 80V96" stroke="#7a9a3a" stroke-width="5"/>` +
    `</g>`,

  풀빵:
    `<rect x="6" y="30" width="88" height="56" rx="10" fill="#4a5068"/>` +
    [
      [24, 46],
      [50, 46],
      [76, 46],
      [24, 70],
      [50, 70],
      [76, 70],
    ]
      .map(
        ([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="11" fill="#2a2f45"/>` +
          (i === 4 ? '' : `<circle cx="${x}" cy="${y}" r="9" fill="${i % 2 ? '#d98a2e' : '#e8a84a'}" stroke-width="2.5"/><path d="M${x - 4} ${y - 3}q4-3 8 0" stroke="#ffd98a" stroke-width="2.5"/>`),
      )
      .join('') +
    tube('M94 58H98', '#5a3b24', 4) +
    `<circle cx="50" cy="20" r="10" fill="#e8a84a"/><path d="M46 17q4-3 8 0" stroke="#ffd98a" stroke-width="2.5"/>`,

  국화빵:
    `<path d="M14 94L22 50H78L86 94Z" fill="#d9b27a"/>` +
    `<path d="M20 66H80" stroke="#b8905a" stroke-width="3"/>` +
    flowerCake(32, 64, 15, '#e8a84a') +
    flowerCake(66, 66, 15, '#e8a84a') +
    flowerCake(49, 34, 17, '#f2b85a'),

  달고나:
    tube('M60 30L90 8', '#8a96b0', 4) +
    `<ellipse cx="52" cy="34" rx="16" ry="10" fill="#b8c2d8"/><ellipse cx="52" cy="33" rx="11" ry="6" fill="#e0943a" stroke-width="2.5"/>` +
    `<circle cx="42" cy="64" r="30" fill="#e0943a"/>` +
    `<circle cx="42" cy="64" r="24" stroke="#f2b85a" stroke-width="3"/>` +
    star(42, 65, 16, 7, 5, '#f2b85a', `stroke="#b8621a" stroke-width="3"`) +
    `<path d="M22 52Q26 44 34 40" stroke="#ffd29a" stroke-width="3"/>`,

  감자칩:
    bowl(52, '#f2c14e', '#e8553d', '', '#ff9a8a') +
    [
      [26, 42, -20, 14],
      [44, 34, 15, 15],
      [62, 38, -10, 14],
      [76, 46, 25, 11],
      [36, 50, 5, 12],
      [56, 50, -25, 12],
    ]
      .map(
        ([x, y, a, r]) =>
          `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - r} ${y}C${x - r} ${y - r * 0.9} ${x + r} ${y - r * 0.8} ${x + r} ${y + 1}C${x + r * 0.6} ${y + r * 0.7} ${x - r * 0.6} ${y + r * 0.6} ${x - r} ${y}Z" fill="#ffd96a"/>` +
          `<path d="M${x - r * 0.6} ${y - 2}Q${x} ${y - r * 0.6} ${x + r * 0.6} ${y - 1}" stroke="#f2b84a" stroke-width="2.5"/>` +
          dot(x + r * 0.3, y + 2, 1.4, '#d98a2e') +
          `</g>`,
      )
      .join(''),

  // ── 콩·씨앗·곡식 ──
  강낭콩:
    [
      [32, 38, -20],
      [66, 44, 25],
      [46, 70, 5],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M-20 -4C-20 -16 -6 -18 2 -12C8 -8 12 -16 18 -12C24 -6 22 10 8 14C-6 18 -20 10 -20 -4Z" fill="#a8283a"/>` +
          `<path d="M-12 -8C-8 -12 -2 -12 2 -8M-10 4q6 4 12 2M8 2q4-2 6-6" stroke="#e87a8e" stroke-width="3"/>` +
          `<path d="M4 -8q3 2 6 0" stroke="#fff" stroke-width="3"/>` +
          `</g>`,
      )
      .join(''),

  완두콩:
    `<g transform="rotate(-20 50 50)">` +
    `<path d="M6 50C10 30 30 26 50 28S90 34 94 46C88 58 70 62 50 60S10 62 6 50Z" fill="#3a9e47"/>` +
    [22, 36, 50, 64, 78].map((x) => `<circle cx="${x}" cy="${x < 50 ? 45 : 46}" r="7.5" fill="#7cd04a"/><path d="M${x - 3} ${x < 50 ? 42 : 43}q2-2 4-2" stroke="#c8f09a" stroke-width="2.5"/>`).join('') +
    `<path d="M6 50C20 58 34 58 50 58S82 56 94 46C86 70 66 74 50 72S14 68 6 50Z" fill="#43b04a"/>` +
    `<path d="M6 50C4 44 0 42 -2 38" stroke="#3a9e47" stroke-width="4"/>` +
    `</g>`,

  검은콩: beanDish(
    '#1d2340',
    '#2a2f45',
    (x, y) => `<path d="M${f(x - 2)} ${f(y - 1.5)}q1.5-1.5 3-1" stroke="#9aa6c4" stroke-width="1.8"/>`,
    5.5,
    4.8,
  ),

  팥: beanDish(
    '#6b1f2a',
    '#9b2335',
    (x, y, a) => `<path d="M${f(x - 1.5)} ${f(y)}h3" stroke="#fff" stroke-width="1.8" transform="rotate(${a} ${f(x)} ${f(y)})"/>`,
    4.5,
    3.4,
  ),

  녹두: beanDish('#2e7a38', '#5fae3a', () => '', 4, 3),

  아몬드:
    [
      [34, 36, -30],
      [64, 34, 25],
      [30, 70, 20],
      [62, 68, -15],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M0 -20C12 -12 14 4 10 12C6 18 -6 18 -10 12C-14 4 -12 -12 0 -20Z" fill="#b8703a"/>` +
          `<path d="M-2 -12q-3 8 -1 16M4 -10q2 8 0 16M-6 -2q0 6 2 10" stroke="#8a4a24" stroke-width="2.2"/>` +
          `</g>`,
      )
      .join(''),

  잣:
    `<g transform="translate(24 30) rotate(-10)">` +
    `<path d="M0 -22C14 -20 18 -4 15 10C10 20 -10 20 -15 10C-18 -4 -14 -20 0 -22Z" fill="#9a5b2e"/>` +
    `<path d="M-14 -6L4 -20M-16 6L12 -16M-12 16L16 -6M-4 19L16 6M14 -6L-6 -21M16 6L-12 -16M12 16L-16 -6M4 19L-16 6" stroke="#6b3e26" stroke-width="2.2"/>` +
    `<path d="M0 -22V-28" stroke="#6b3e26" stroke-width="3"/>` +
    `</g>` +
    `<path d="M40 22L36 8M46 20L50 6M52 22L60 10" stroke="#3a9e47" stroke-width="3"/>` +
    `<ellipse cx="58" cy="78" rx="36" ry="12" fill="#6fb5a0"/>` +
    [
      [36, 72, -30],
      [50, 74, 10],
      [64, 72, -10],
      [78, 74, 30],
      [44, 60, 20],
      [58, 60, -20],
      [72, 60, 15],
      [52, 46, 0],
      [66, 46, 30],
    ]
      .map(
        ([x, y, a]) =>
          `<path d="M${x} ${y - 10}C${x + 7} ${y - 7} ${x + 7} ${y + 6} ${x} ${y + 8}C${x - 7} ${y + 6} ${x - 7} ${y - 7} ${x} ${y - 10}Z" fill="#fff4d6" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>` +
          `<path d="M${x - 1} ${y - 7}l-1 3" stroke="#c9a060" stroke-width="2" transform="rotate(${a} ${x} ${y})"/>`,
      )
      .join(''),

  해바라기씨:
    `<g transform="translate(22 22)">` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => `<ellipse cx="0" cy="-13" rx="5" ry="8" fill="${HL}" stroke-width="2.5" transform="rotate(${i * 45})"/>`)
      .join('') +
    `<circle r="9" fill="#6b3e26" stroke-width="2.5"/></g>` +
    [
      [44, 50, -30],
      [70, 46, 20],
      [34, 76, 30],
      [60, 74, -10],
      [82, 74, 40],
    ]
      .map(
        ([x, y, a]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M0 -17C9 -10 10 6 6 12Q0 17 -6 12C-10 6 -9 -10 0 -17Z" fill="#2a2f45"/>` +
          `<path d="M0 -12V12M-5 -4L-5 8M5 -4L5 8" stroke="#fff" stroke-width="2.5"/>` +
          `</g>`,
      )
      .join(''),

  호박씨:
    `<g transform="translate(22 24)">` +
    `<path d="M0 -14V-19" stroke="#6b3e26" stroke-width="5"/>` +
    `<ellipse cx="0" cy="0" rx="17" ry="14" fill="#ff8a1a"/>` +
    `<path d="M0 -13V13M-8 -11Q-13 0 -8 11M8 -11Q13 0 8 11" stroke="#d9601a" stroke-width="2.5"/></g>` +
    [
      [56, 36, 25, '#fbf2dc'],
      [36, 60, -25, '#fbf2dc'],
      [66, 60, 20, '#fbf2dc'],
      [48, 82, 10, '#7fae4a'],
      [76, 82, -20, '#fbf2dc'],
      [22, 82, 40, '#7fae4a'],
    ]
      .map(
        ([x, y, a, c]) =>
          `<g transform="translate(${x} ${y}) rotate(${a})">` +
          `<path d="M0 -16C10 -12 12 4 8 10Q0 17 -8 10C-12 4 -10 -12 0 -16Z" fill="${c}"/>` +
          `<path d="M0 -12C6 -8 7 3 4 8Q0 11 -4 8C-7 3 -6 -8 0 -12Z" stroke="${c === '#7fae4a' ? '#b8d880' : '#e0d0a8'}" stroke-width="2"/>` +
          `</g>`,
      )
      .join(''),

  밀: wheatEar(36, 48, -18, 0.85) + wheatEar(64, 48, 18, 0.85) + wheatEar(50, 46, 0, 0.85),
};

