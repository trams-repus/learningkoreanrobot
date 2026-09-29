// 그림 묶음: 장난감·운동 도구·공·연·보물·신발·모자와 머리 장식 (l3). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, dot, cheeks, sparkle, tube, person, blob, drop } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 정다각형 꼭짓점 (가운데 x,y, 반지름 r, 시작 각도 a0도) */
function poly(x: number, y: number, r: number, n: number, a0 = -90): string {
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + (k * 360) / n) * Math.PI) / 180;
    return `${r1(x + r * Math.cos(a))} ${r1(y + r * Math.sin(a))}`;
  }).join('L');
}

/** 별 (가운데 x,y, 바깥 반지름 r) */
function star(x: number, y: number, r: number, fill: string, sw = 2.5): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${r1(x + rr * Math.cos(a))} ${r1(y + rr * Math.sin(a))}`;
  }).join('L');
  return `<path d="M${pts}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

let clipN = 0;
/** 동그라미 안에만 무늬를 그린다 (공 무늬) */
function clipped(cx: number, cy: number, r: number, fill: string, inner: string, sw = 3.5): string {
  const id = `pk-l3t4-${++clipN}`;
  return (
    `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="none"/>` +
    `<g clip-path="url(#${id})">${inner}</g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="${sw}"/>`
  );
}

const sw = (r: number) => r1(Math.max(1.6, r * 0.09));
const shine = (cx: number, cy: number, r: number) =>
  `<path d="M${r1(cx - r * 0.62)} ${r1(cy - r * 0.2)}A${r1(r * 0.66)} ${r1(r * 0.66)} 0 0 1 ${r1(cx - r * 0.2)} ${r1(cy - r * 0.62)}" stroke="#fff" stroke-width="${r1(Math.max(2.5, r * 0.12))}" opacity=".6"/>`;

// ── 공 ──
function soccer(cx: number, cy: number, r: number): string {
  const w = sw(r);
  let inner = `<path d="M${poly(cx, cy, r * 0.32, 5)}Z" fill="${INK}"/>`;
  for (let k = 0; k < 5; k++) {
    const a = ((-90 + k * 72) * Math.PI) / 180;
    const pa = ((-90 + k * 72 + 36) * Math.PI) / 180;
    inner +=
      `<path d="M${r1(cx + r * 0.32 * Math.cos(a))} ${r1(cy + r * 0.32 * Math.sin(a))}L${r1(cx + r * 1.1 * Math.cos(a))} ${r1(cy + r * 1.1 * Math.sin(a))}" stroke-width="${w}"/>` +
      `<path d="M${poly(cx + r * 0.98 * Math.cos(pa), cy + r * 0.98 * Math.sin(pa), r * 0.3, 5, -90 + k * 72 + 36 + 180)}Z" fill="${INK}"/>`;
  }
  return clipped(cx, cy, r, '#fff', inner, w * 1.4);
}
function basketball(cx: number, cy: number, r: number): string {
  const w = sw(r);
  return clipped(
    cx,
    cy,
    r,
    '#f07a24',
    `<path d="M${cx - r} ${cy}H${cx + r}M${cx} ${cy - r}V${cy + r}" stroke-width="${w}"/>` +
      `<path d="M${r1(cx - r * 0.75)} ${r1(cy - r * 0.8)}Q${r1(cx - r * 0.2)} ${cy} ${r1(cx - r * 0.75)} ${r1(cy + r * 0.8)}M${r1(cx + r * 0.75)} ${r1(cy - r * 0.8)}Q${r1(cx + r * 0.2)} ${cy} ${r1(cx + r * 0.75)} ${r1(cy + r * 0.8)}" stroke-width="${w}"/>`,
    w * 1.4,
  );
}
function volleyball(cx: number, cy: number, r: number): string {
  const w = sw(r);
  const band = (d: string, c: string) =>
    `<path d="${d}" stroke-width="${r1(r * 0.42 + w * 2)}"/><path d="${d}" stroke="${c}" stroke-width="${r1(r * 0.42)}"/>`;
  return clipped(
    cx,
    cy,
    r,
    '#fff',
    band(`M${r1(cx - r * 1.1)} ${r1(cy - r * 0.2)}Q${r1(cx + r * 0.1)} ${r1(cy - r * 0.2)} ${r1(cx + r * 0.3)} ${r1(cy - r * 1.2)}`, '#3b78e6') +
      band(`M${r1(cx - r * 0.7)} ${r1(cy + r * 1.1)}Q${r1(cx + r * 0.1)} ${r1(cy + r * 0.2)} ${r1(cx + r * 1.2)} ${r1(cy + r * 0.1)}`, '#ffd23f'),
    w * 1.4,
  );
}
function baseball(cx: number, cy: number, r: number): string {
  const w = sw(r);
  const seam = (s: 1 | -1) =>
    `M${r1(cx + s * r * 0.62)} ${r1(cy - r * 0.8)}Q${r1(cx + s * r * 0.12)} ${cy} ${r1(cx + s * r * 0.62)} ${r1(cy + r * 0.8)}`;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke-width="${r1(w * 1.4)}"/>` +
    `<path d="${seam(-1)}${seam(1)}" stroke="#e8553d" stroke-width="${w}"/>` +
    `<path d="${seam(-1)}${seam(1)}" stroke="#e8553d" stroke-width="${r1(r * 0.3)}" stroke-dasharray="${r1(r * 0.07)} ${r1(r * 0.16)}" stroke-linecap="butt"/>`
  );
}
function tennisBall(cx: number, cy: number, r: number): string {
  const w = sw(r);
  return clipped(
    cx,
    cy,
    r,
    '#d4e83a',
    `<path d="M${r1(cx - r * 0.95)} ${r1(cy - r * 0.55)}Q${r1(cx - r * 0.1)} ${cy} ${r1(cx - r * 0.95)} ${r1(cy + r * 0.55)}M${r1(cx + r * 0.95)} ${r1(cy - r * 0.55)}Q${r1(cx + r * 0.1)} ${cy} ${r1(cx + r * 0.95)} ${r1(cy + r * 0.55)}" stroke="#fff" stroke-width="${r1(r * 0.2)}"/>`,
    w * 1.4,
  );
}
function bowlingBall(cx: number, cy: number, r: number): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#6a3fb5"/>` +
    dot(r1(cx - r * 0.3), r1(cy - r * 0.35), r1(r * 0.13)) +
    dot(r1(cx + r * 0.05), r1(cy - r * 0.5), r1(r * 0.13)) +
    dot(r1(cx - r * 0.05), r1(cy - r * 0.05), r1(r * 0.15)) +
    `<path d="M${r1(cx + r * 0.45)} ${r1(cy + r * 0.2)}A${r1(r * 0.55)} ${r1(r * 0.55)} 0 0 1 ${r1(cx + r * 0.1)} ${r1(cy + r * 0.6)}" stroke="#b79cf0" stroke-width="${sw(r)}"/>`
  );
}
function bowlingPin(x: number, y: number, s: number): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${r1(3.5 / s)}">` +
    `<path d="M-6 -64C-12 -64 -12 -48 -7 -42C-5 -38 -10 -34 -13 -24C-17 -12 -12 0 -8 0H8C12 0 17 -12 13 -24C10 -34 5 -38 7 -42C12 -48 12 -64 6 -64C3 -67 -3 -67 -6 -64Z" fill="#fff"/>` +
    `<path d="M-7.6 -42.5H7.6M-6.6 -38H6.6" stroke="#e8553d" stroke-width="${r1(3.2 / s)}"/>` +
    `</g>`
  );
}

/** 부채꼴 (가운데 cx,cy, 반지름 r, a0~a1도) */
function wedge(cx: number, cy: number, r: number, a0: number, a1: number, fill: string, extra = ''): string {
  const p = (a: number) => `${r1(cx + r * Math.cos((a * Math.PI) / 180))} ${r1(cy + r * Math.sin((a * Math.PI) / 180))}`;
  return `<path d="M${cx} ${cy}L${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}Z" fill="${fill}"${extra}/>`;
}

/** 동전 (앞면): 큰 동전 하나 + 옆에 쌓인 동전 */
function coins(face: string, rim: string, side: string, emblem: string): string {
  let stack = '';
  for (const y of [88, 81, 74, 67]) stack += `<ellipse cx="76" cy="${y}" rx="15" ry="5.5" fill="${side}"/>`;
  return (
    `<rect x="61" y="67" width="30" height="21" fill="${side}" stroke="none"/><path d="M61 67V88M91 67V88"/>` +
    stack +
    `<circle cx="42" cy="52" r="32" fill="${face}"/>` +
    `<circle cx="42" cy="52" r="23" stroke="${rim}" stroke-width="4"/>` +
    emblem +
    `<path d="M22 40A22 22 0 0 1 34 27" stroke="#fff" stroke-width="4" opacity=".6"/>` +
    sparkle(84, 22, 8, '#fff') +
    sparkle(84, 22, 5) +
    sparkle(14, 16, 6)
  );
}

/** 모자 그림용 아이 얼굴 (모자는 이 위에 씌운다). 얼굴 가운데 (50, 74) */
function kidHead(opts: { patch?: boolean; hair?: string } = {}): string {
  const hair = opts.hair ?? '#5a3b24';
  return (
    `<circle cx="29" cy="76" r="5.5" fill="${SKIN}"/><circle cx="71" cy="76" r="5.5" fill="${SKIN}"/>` +
    `<circle cx="50" cy="74" r="22" fill="${SKIN}"/>` +
    `<path d="M28.5 72C28 60 38 54 50 54S72 60 71.5 72C66 65 58 63 50 63S34 65 28.5 72Z" fill="${hair}"/>` +
    (opts.patch
      ? `<path d="M30 68L70 80" stroke-width="2.5"/><ellipse cx="41" cy="75" rx="6" ry="5.5" fill="${INK}"/>`
      : dot(41, 75, 2.8)) +
    dot(59, 75, 2.8) +
    `<path d="M44 84q6 5 12 0" stroke-width="3"/>` +
    cheeks(82, 14)
  );
}

/** 보송보송한 양말 한 짝 (발목 윗부분 가운데 x, 위 y) */
function fuzzySock(x: number, y: number, fill: string): string {
  const cs: [number, number, number][] = [];
  for (let k = 0; k <= 5; k++) cs.push([x, y + k * 8, 10]);
  for (let k = 1; k <= 3; k++) cs.push([x + k * 9, y + 44, 10]);
  return (
    blob(fill, cs) +
    blob('#fff', [
      [x - 7, y - 2, 6],
      [x, y - 4, 6.5],
      [x + 7, y - 2, 6],
    ]) +
    dot(x - 2, y + 18, 2.4, '#fff') +
    dot(x + 3, y + 30, 2.4, '#fff') +
    dot(x + 16, y + 44, 2.4, '#fff')
  );
}

export const PICS: Record<string, string> = {
  // ── 장난감·운동 도구 ──
  장난감기차:
    `<path d="M6 86H94" stroke="#9aa6c4" stroke-width="4"/>` +
    `<rect x="11" y="31" width="12" height="13" rx="2" fill="#3b78e6"/><rect x="25" y="33" width="12" height="11" rx="2" fill="#ff9f1a"/>` +
    `<rect x="8" y="44" width="32" height="28" rx="4" fill="#43b04a"/>` +
    `<path d="M40 64H48" stroke-width="5"/>` +
    `<rect x="46" y="30" width="24" height="42" rx="3" fill="#e8553d"/>` +
    `<rect x="42" y="23" width="32" height="9" rx="3" fill="#3b78e6"/>` +
    `<rect x="52" y="38" width="12" height="12" rx="2" fill="#7ec8f0"/>` +
    `<rect x="70" y="46" width="22" height="26" rx="5" fill="#ffd23f"/>` +
    `<path d="M76 46L75 34H86L84 46Z" fill="#3b78e6"/><rect x="72" y="28" width="16" height="7" rx="3" fill="#3b78e6"/>` +
    [16, 32, 56, 72, 86]
      .map((x, i) => `<circle cx="${x}" cy="76" r="${i === 2 ? 9 : 7.5}" fill="${['#ffd23f', '#ffd23f', '#3b78e6', '#3b78e6', '#e8553d'][i]}"/>` + dot(x, 76, 2.4))
      .join(''),
  인라인스케이트:
    `<path d="M22 14H48L50 46C60 49 76 53 84 60C88 64 88 70 84 70H20Z" fill="#3b78e6"/>` +
    `<path d="M22 14H48L48.6 24H22Z" fill="#ffd23f"/>` +
    `<path d="M26 36H49M28 48H58" stroke="${INK}" stroke-width="6"/><path d="M26 36H49M28 48H58" stroke="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M60 52L66 58M68 54L72 60" stroke="#fff" stroke-width="2.5"/>` +
    `<rect x="18" y="70" width="68" height="7" rx="3" fill="#8a96b0"/>` +
    [28, 45, 62, 79].map((x) => `<circle cx="${x}" cy="84" r="8.5" fill="#a45cf0"/>` + dot(x, 84, 2.6, '#fff')).join(''),
  짐볼:
    `<path d="M8 95H92" stroke="#c9b28a" stroke-width="3"/>` +
    `<circle cx="58" cy="64" r="30" fill="#a45cf0"/>` +
    `<path d="M38 56A22 22 0 0 1 52 40" stroke="#fff" stroke-width="4.5" opacity=".6"/>` +
    tube('M44 40L26 46L22 88', '#3b78e6', 7) +
    `<ellipse cx="18" cy="91" rx="8" ry="4" fill="#e8553d"/>` +
    person(46, 40, 0.72, { hair: '#5a3b24', style: 'short', shirt: '#ffd23f' }),
  아령:
    `<g transform="rotate(-18 50 52)">` +
    `<rect x="28" y="46" width="44" height="12" rx="4" fill="#8a96b0"/>` +
    `<rect x="12" y="28" width="18" height="48" rx="7" fill="#3b78e6"/><rect x="28" y="36" width="7" height="32" rx="2" fill="#2c3e7a"/>` +
    `<rect x="70" y="28" width="18" height="48" rx="7" fill="#3b78e6"/><rect x="65" y="36" width="7" height="32" rx="2" fill="#2c3e7a"/>` +
    `<path d="M17 36V50M75 36V50" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    `</g>`,
  역기:
    `<path d="M8 94H92" stroke="#c9b28a" stroke-width="3"/>` +
    `<g transform="translate(50 44) scale(.9)"><path d="M0 10V36M0 36L-13 55M0 36L13 55M0 14L-20 6L-24 -24M0 14L20 6L24 -24" stroke-width="6"/><circle cx="0" cy="0" r="10" fill="${SKIN}"/>` +
    dot(-3.5, -1, 1.8) +
    dot(3.5, -1, 1.8) +
    `<path d="M-3 4.5q3 2 6 0" stroke-width="2"/></g>` +
    `<rect x="6" y="19" width="88" height="6" rx="3" fill="#8a96b0"/>` +
    `<rect x="9" y="8" width="7" height="28" rx="2" fill="#e8553d"/><rect x="16" y="4" width="9" height="36" rx="2" fill="#3b78e6"/>` +
    `<rect x="84" y="8" width="7" height="28" rx="2" fill="#e8553d"/><rect x="75" y="4" width="9" height="36" rx="2" fill="#3b78e6"/>` +
    `<path d="M32 44l-5 -2M68 44l5 -2" stroke="#9aa6c4" stroke-width="2.5"/>`,
  축구화:
    soccer(80, 20, 13) +
    `<path d="M10 64C10 50 16 42 26 40L44 38C50 46 60 50 74 52C86 54 92 60 92 68V72H10Z" fill="#e8553d"/>` +
    `<path d="M26 40L44 38" stroke-width="5"/>` +
    `<path d="M48 44L54 40M54 47L60 43M61 50L66 46" stroke="#fff" stroke-width="3"/>` +
    `<path d="M18 58C32 56 48 60 62 62" stroke="#ffd23f" stroke-width="5"/>` +
    `<rect x="8" y="70" width="86" height="8" rx="3" fill="#fff"/>` +
    [16, 30, 56, 70, 84].map((x) => `<rect x="${x - 3.5}" y="78" width="7" height="9" rx="2" fill="${INK}"/>`).join(''),
  // ── 공 ──
  야구공: baseball(50, 50, 38) + shine(50, 50, 38),
  농구공: basketball(50, 50, 38),
  배구공: volleyball(50, 50, 38),
  테니스공: tennisBall(50, 50, 38) + shine(50, 50, 38),
  탁구공:
    `<g transform="rotate(-35 36 44)">` +
    `<rect x="31" y="62" width="10" height="28" rx="4" fill="#9a5b2e"/>` +
    `<ellipse cx="36" cy="38" rx="24" ry="27" fill="#e8553d"/>` +
    `</g>` +
    `<path d="M50 80C60 88 70 88 76 82" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 5"/>` +
    `<circle cx="72" cy="64" r="17" fill="#fff" stroke-width="4"/>` +
    shine(72, 64, 17),
  골프공:
    `<path d="M6 92C20 82 80 82 94 92Z" fill="#5fc24a"/>` +
    `<path d="M40 64H60L53 71V86L50 91L47 86V71Z" fill="#ff9f1a"/>` +
    clipped(
      50,
      38,
      28,
      '#fff',
      [-2, -1, 0, 1, 2]
        .flatMap((j) => [-3, -2, -1, 0, 1, 2, 3].map((i) => dot(r1(50 + i * 9 + (j % 2 ? 4.5 : 0)), r1(38 + j * 9), 2.6, '#bcc6da')))
        .join(''),
      4,
    ) +
    shine(50, 38, 28),
  볼링공: bowlingPin(82, 90, 0.78) + bowlingBall(42, 56, 32),
  럭비공: (() => {
    const pts = [-2, -1, 0, 1, 2].map((t) => [50 + t * 6.8, 50 - t * 4.4]);
    return (
      `<path d="M12 74Q20 18 88 26Q80 82 12 74Z" fill="#9a5b2e"/>` +
      `<path d="M20 66Q26 36 60 30M40 70Q74 66 80 34" stroke="#6b3e26" stroke-width="2.5"/>` +
      `<path d="M34 60L66 40" stroke="#fff" stroke-width="3.5"/>` +
      pts.map(([x, y]) => `<path d="M${r1(x - 3.4)} ${r1(y - 5.2)}L${r1(x + 3.4)} ${r1(y + 5.2)}" stroke="#fff" stroke-width="3.5"/>`).join('') +
      `<path d="M22 58Q26 40 40 32" stroke="#fff" stroke-width="3" opacity=".5"/>`
    );
  })(),
  비치볼: (() => {
    const cols = ['#e8553d', '#fff', '#ffd23f', '#fff', '#3b78e6', '#fff', '#43b04a', '#fff'];
    const inner = cols.map((c, k) => wedge(46, 44, 60, -90 + k * 45, -45 + k * 45, c, ' stroke-width="2.5"')).join('');
    return clipped(50, 52, 38, '#fff', inner, 4) + `<circle cx="46" cy="44" r="8" fill="#fff"/>` + shine(50, 52, 38);
  })(),
  탱탱볼:
    `<path d="M8 90H92" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M8 30Q18 30 30 88Q40 44 52 44" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="5 6"/>` +
    `<path d="M22 84l-5 -4M38 84l5 -4M30 80v-6" stroke="#9aa6c4" stroke-width="2.5"/>` +
    clipped(66, 38, 22, '#ff5c70', `<path d="M40 50Q60 20 92 30" stroke="#ffd23f" stroke-width="9"/><path d="M44 66Q70 44 92 50" stroke="#7ec8f0" stroke-width="7"/>`, 4) +
    shine(66, 38, 22) +
    sparkle(88, 14, 6) +
    sparkle(46, 18, 4),
  과녁:
    `<path d="M40 70L26 94M60 70L74 94" stroke="#9a5b2e" stroke-width="6"/>` +
    `<circle cx="50" cy="46" r="38" fill="#e8553d"/>` +
    `<circle cx="50" cy="46" r="29" fill="#fff"/>` +
    `<circle cx="50" cy="46" r="20" fill="#3b78e6"/>` +
    `<circle cx="50" cy="46" r="10" fill="#ffd23f"/>` +
    dot(50, 46, 3.5, '#e8553d'),
  다트: (() => {
    let sectors = '';
    for (let k = 0; k < 12; k++) sectors += wedge(42, 56, 30, k * 30, k * 30 + 30, k % 2 ? '#e8553d' : '#43b04a', ' stroke="none"');
    for (let k = 0; k < 12; k++) sectors += wedge(42, 56, 25, k * 30, k * 30 + 30, k % 2 ? INK : '#fff3d6', ' stroke="none"');
    return (
      `<circle cx="42" cy="56" r="37" fill="${INK}"/>` +
      sectors +
      `<circle cx="42" cy="56" r="30" stroke="#fff" stroke-width="1.5"/>` +
      `<circle cx="42" cy="56" r="8" fill="#43b04a" stroke="#fff" stroke-width="1.5"/>` +
      `<circle cx="42" cy="56" r="4" fill="#e8553d" stroke="none"/>` +
      tube('M44 54L60 38', '#dfe8f5', 6) +
      tube('M60 38L74 24', '#3b78e6', 3) +
      `<path d="M72 26L88 10L94 22Z" fill="#ffd23f"/><path d="M72 26L88 10L76 4Z" fill="#ff5c70"/>`
    );
  })(),
  // ── 연·하늘 ──
  가오리연:
    `<path d="M50 70C38 76 62 80 48 86C38 90 56 92 50 97" stroke-width="3"/>` +
    `<path d="M44 80l-6 -3l0 6ZM56 88l6 -3l0 6Z" fill="#ff5c70" stroke-width="2"/>` +
    `<path d="M22 40L8 60M78 40L92 60" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 5L80 38L50 72L20 38Z" fill="#fff"/>` +
    `<path d="M50 5L80 38H50Z" fill="#3b78e6"/><path d="M50 5L20 38H50Z" fill="#e8553d"/>` +
    `<path d="M50 5L80 38L50 72L20 38Z"/><path d="M50 5V72M20 38H80" stroke-width="2.5"/>` +
    dot(42, 48, 2.5) +
    dot(58, 48, 2.5) +
    `<path d="M46 56q4 3 8 0" stroke-width="2.5"/>`,
  방패연:
    `<path d="M50 78C40 84 58 88 46 96" stroke-width="3"/>` +
    `<rect x="20" y="6" width="60" height="72" rx="2" fill="#fff"/>` +
    `<path d="M20 60H80V78H20Z" fill="#3b78e6"/>` +
    `<rect x="20" y="6" width="60" height="72" rx="2"/>` +
    `<path d="M20 6L80 78M80 6L20 78M50 6V78M20 36H80" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<circle cx="50" cy="16" r="8" fill="#e8553d"/>` +
    `<circle cx="50" cy="44" r="11" fill="#fff7e0" stroke-width="3.5"/>`,
  얼레:
    `<path d="M58 44C62 30 70 26 76 22" stroke="#9aa6c4" stroke-width="2"/>` +
    `<g transform="translate(80 15) rotate(10)"><path d="M0 -10L9 0L0 10L-9 0Z" fill="#ffd23f" stroke-width="2.5"/><path d="M0 -10L9 0H-9Z" fill="#e8553d" stroke-width="2.5"/></g>` +
    tube('M8 62H92', '#6b3e26', 6) +
    `<rect x="30" y="46" width="40" height="32" fill="#f5ecd4"/>` +
    `<path d="M36 46V78M43 46V78M50 46V78M57 46V78M64 46V78" stroke="#d9c79a" stroke-width="2"/>` +
    `<rect x="30" y="46" width="40" height="32"/>` +
    `<rect x="20" y="34" width="11" height="56" rx="3" fill="#c8894a"/>` +
    `<rect x="69" y="34" width="11" height="56" rx="3" fill="#c8894a"/>` +
    `<path d="M25.5 38V86M74.5 38V86" stroke="#9a5b2e" stroke-width="2"/>`,
  낙하산:
    `<path d="M12 44L45 78M38 44L47 76M62 44L53 76M88 44L55 78" stroke-width="2"/>` +
    `<path d="M12 44C12 22 30 8 50 8S88 22 88 44Q75 36 62 44Q50 36 38 44Q25 36 12 44Z" fill="#e8553d"/>` +
    `<path d="M50 8C42 16 38 30 38 44Q50 36 62 44C62 30 58 16 50 8Z" fill="#ffd23f"/>` +
    `<path d="M12 44C12 22 30 8 50 8S88 22 88 44Q75 36 62 44Q50 36 38 44Q25 36 12 44Z"/>` +
    `<path d="M46 86L44 94M54 86L56 94" stroke-width="5"/>` +
    person(50, 88, 0.62, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }),
  천체망원경:
    `<path d="M48 56L26 94M48 56L72 94M48 56V94" stroke="#6b3e26" stroke-width="4.5"/>` +
    `<rect x="42" y="48" width="12" height="10" rx="2" fill="#8a96b0"/>` +
    `<g transform="translate(46 44) rotate(-32)">` +
    `<rect x="-7" y="-15" width="18" height="6" rx="2" fill="#8a96b0"/>` +
    `<rect x="-38" y="-4" width="9" height="8" rx="2" fill="#8a96b0"/>` +
    `<rect x="-30" y="-8" width="54" height="16" rx="3" fill="#fff"/>` +
    `<rect x="22" y="-11" width="14" height="22" rx="3" fill="#3b78e6"/>` +
    `</g>` +
    `<path d="M22 8A12 12 0 1 0 34 24A10 10 0 0 1 22 8Z" fill="#ffd23f"/>` +
    sparkle(46, 12, 6) +
    sparkle(10, 40, 5) +
    sparkle(88, 50, 5),
  // ── 보물·돈 ──
  보물지도:
    `<rect x="14" y="16" width="72" height="70" fill="#f5e0a8"/>` +
    `<path d="M26 70C24 58 30 48 40 46C46 34 60 30 70 34C80 38 80 52 72 58C66 70 44 76 26 70Z" fill="#bfe39a" stroke="#43b04a" stroke-width="2.5"/>` +
    `<path d="M24 28q4 -3 8 0q4 3 8 0M58 76q4 -3 8 0q4 3 8 0" stroke="#3b8fe0" stroke-width="2.5"/>` +
    `<path d="M40 56L46 46L52 56Z" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M32 66C40 70 48 64 52 60C56 56 58 50 64 46" stroke="#9a5b2e" stroke-width="3" stroke-dasharray="4 4"/>` +
    `<path d="M62 38L72 48M72 38L62 48" stroke="#e8553d" stroke-width="5"/>` +
    `<rect x="8" y="10" width="11" height="80" rx="5" fill="#d9b870"/>` +
    `<rect x="81" y="10" width="11" height="80" rx="5" fill="#d9b870"/>`,
  보물상자:
    `<path d="M14 50L18 20Q50 10 82 20L86 50Z" fill="#6b3e26"/>` +
    `<path d="M20 22Q50 13 80 22L82 30Q50 22 18 30Z" fill="#ffd23f" stroke-width="2.5"/>` +
    blob('#ffd23f', [
      [28, 50, 10],
      [42, 45, 12],
      [58, 46, 12],
      [72, 50, 10],
    ]) +
    `<circle cx="36" cy="44" r="5" fill="#f2c14e" stroke-width="2.5"/><circle cx="62" cy="42" r="5" fill="#f2c14e" stroke-width="2.5"/>` +
    `<path d="M48 36L53 41L48 47L43 41Z" fill="#ff5c70" stroke-width="2.5"/>` +
    `<rect x="12" y="50" width="76" height="38" rx="3" fill="#9a5b2e"/>` +
    `<rect x="22" y="50" width="7" height="38" fill="#ffd23f" stroke-width="2.5"/><rect x="71" y="50" width="7" height="38" fill="#ffd23f" stroke-width="2.5"/>` +
    `<rect x="42" y="54" width="16" height="16" rx="3" fill="#ffd23f"/>` +
    dot(50, 60, 2.4) +
    `<path d="M50 61V66" stroke-width="2.5"/>` +
    sparkle(16, 12, 6) +
    sparkle(86, 8, 5) +
    sparkle(50, 26, 5, '#fff'),
  금화: coins('#ffd23f', '#e8a820', '#f2c14e', star(42, 52, 13, '#f2c14e', 2.5)),
  은화: coins(
    '#dfe8f5',
    '#9aa6c4',
    '#c3cde0',
    `<circle cx="42" cy="52" r="6" fill="#b8c3d6" stroke-width="2.5"/>` +
      [0, 72, 144, 216, 288]
        .map((a) => `<ellipse cx="42" cy="42" rx="4.5" ry="7" fill="#b8c3d6" stroke-width="2.5" transform="rotate(${a} 42 52)"/>`)
        .join(''),
  ),
  동전지갑:
    `<circle cx="80" cy="84" r="9" fill="#ffd23f"/><path d="M78 80v8" stroke="#e8a820" stroke-width="2.5"/>` +
    `<path d="M20 40H80C90 56 88 86 50 86C12 86 10 56 20 40Z" fill="#ff5c70"/>` +
    `<path d="M20 40Q20 28 34 28H66Q80 28 80 40" stroke="${INK}" stroke-width="8"/><path d="M20 40Q20 28 34 28H66Q80 28 80 40" stroke="#ffd23f" stroke-width="4"/>` +
    `<path d="M20 40H80" stroke="${INK}" stroke-width="8"/><path d="M20 40H80" stroke="#ffd23f" stroke-width="4"/>` +
    `<circle cx="45" cy="20" r="6" fill="#ffd23f"/><circle cx="55" cy="20" r="6" fill="#ffd23f"/>` +
    dot(34, 56, 3, '#fff') +
    dot(52, 64, 3, '#fff') +
    dot(68, 54, 3, '#fff') +
    dot(36, 74, 3, '#fff') +
    dot(62, 76, 3, '#fff'),
  돼지저금통:
    `<circle cx="56" cy="17" r="9" fill="#ffd23f"/><path d="M53 13v8" stroke="#e8a820" stroke-width="2.5"/>` +
    `<rect x="28" y="72" width="11" height="16" rx="3" fill="#ff9aa8"/><rect x="66" y="72" width="11" height="16" rx="3" fill="#ff9aa8"/>` +
    `<path d="M86 56c8 -2 8 8 2 6c-4 -1 -2 -6 2 -4" stroke-width="3"/>` +
    `<ellipse cx="54" cy="56" rx="34" ry="27" fill="#ff9aa8"/>` +
    `<path d="M30 36L32 20L44 32Z" fill="#ff9aa8"/>` +
    `<ellipse cx="20" cy="58" rx="8" ry="10" fill="#ff7f93"/>` +
    dot(18, 54, 2) +
    dot(18, 62, 2) +
    dot(34, 48, 3) +
    `<circle cx="36" cy="64" r="5" fill="#e85d9a" stroke="none" opacity=".5"/>` +
    `<rect x="46" y="28" width="20" height="5" rx="2.5" fill="${INK}"/>`,
  금고:
    `<rect x="18" y="84" width="12" height="9" rx="2" fill="#5a6378"/><rect x="70" y="84" width="12" height="9" rx="2" fill="#5a6378"/>` +
    `<rect x="12" y="10" width="76" height="76" rx="7" fill="#8a96b0"/>` +
    `<rect x="21" y="19" width="58" height="58" rx="4" fill="#aab4c8"/>` +
    `<rect x="14" y="26" width="7" height="12" rx="2" fill="#5a6378"/><rect x="14" y="58" width="7" height="12" rx="2" fill="#5a6378"/>` +
    `<circle cx="44" cy="48" r="15" fill="#dfe8f5"/>` +
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => `<path d="M44 35V39" stroke-width="2.5" transform="rotate(${a} 44 48)"/>`)
      .join('') +
    `<circle cx="44" cy="48" r="6" fill="#5a6378"/>` +
    `<path d="M44 48L44 42" stroke-width="3"/>` +
    tube('M68 38V58', '#ffd23f', 4) +
    `<circle cx="68" cy="48" r="4" fill="#ffd23f"/>`,
  // ── 우산 ──
  양산:
    `<circle cx="84" cy="16" r="9" fill="#ffd23f"/>` +
    `<path d="M84 2V4M98 16H96M74 6l1.5 1.5M94 6l-1.5 1.5M94 26l-1.5 -1.5" stroke="#ff9f1a" stroke-width="2.5"/>` +
    [16, 26, 36, 46, 56, 66, 76, 86].map((x, i) => `<circle cx="${x}" cy="${i === 0 || i === 7 ? 46 : 49}" r="5.5" fill="#fff" stroke-width="2.5"/>`).join('') +
    `<path d="M12 46C14 24 30 12 50 12S86 24 88 46Q80 40 74 46Q68 40 62 46Q56 40 50 46Q44 40 38 46Q32 40 26 46Q20 40 12 46Z" fill="#ff9aa8"/>` +
    `<path d="M50 12C44 22 40 34 38 46M50 12C56 22 60 34 62 46" stroke-width="2.5"/>` +
    `<path d="M50 8V12" stroke-width="4"/>` +
    `<path d="M50 50V84" stroke-width="3.5"/>` +
    `<path d="M50 60l-6 -4v8ZM50 60l6 -4v8Z" fill="#e85d9a" stroke-width="2"/>` +
    `<rect x="46" y="82" width="8" height="12" rx="4" fill="#fff"/>`,
  장우산:
    drop(12, 50, 0.9) +
    drop(86, 56, 0.9) +
    drop(20, 72, 0.8) +
    drop(80, 78, 0.8) +
    `<path d="M50 38V88Q50 96 42 96Q34 96 34 88" stroke-width="10"/><path d="M50 38V88Q50 96 42 96Q34 96 34 88" stroke="#6b3e26" stroke-width="4.5"/>` +
    `<path d="M8 40C10 20 28 8 50 8S90 20 92 40Q81 32 71 40Q61 32 50 40Q39 32 29 40Q19 32 8 40Z" fill="#3b78e6"/>` +
    `<path d="M50 8C44 18 38 30 29 40Q39 32 50 40Q61 32 71 40C62 30 56 18 50 8Z" fill="#7ec8f0"/>` +
    `<path d="M8 40C10 20 28 8 50 8S90 20 92 40Q81 32 71 40Q61 32 50 40Q39 32 29 40Q19 32 8 40Z"/>` +
    `<path d="M50 3V8" stroke-width="5"/>`,
  // ── 신발·양말·옷 ──
  등산화:
    `<path d="M68 38L80 16L94 38Z" fill="#43b04a"/><path d="M76 23L80 16L84 23L80 26Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M20 16H50L54 44C66 48 80 52 86 60C90 66 90 72 88 74H14L18 40Z" fill="#9a5b2e"/>` +
    `<path d="M20 14H50L51 24H19Z" fill="#e8553d"/>` +
    `<path d="M54 44C66 48 80 52 86 60C90 66 90 72 88 74H56C62 66 62 54 54 44Z" fill="#6b3e26"/>` +
    `<path d="M50 28L56 32M50 36L58 40M52 44L60 48" stroke="#ffd23f" stroke-width="3.5"/>` +
    `<circle cx="48" cy="28" r="2.5" fill="#dfe8f5" stroke-width="2"/><circle cx="48.5" cy="36" r="2.5" fill="#dfe8f5" stroke-width="2"/><circle cx="50" cy="44" r="2.5" fill="#dfe8f5" stroke-width="2"/>` +
    `<path d="M12 74H90V82L86 88L80 82L74 88L68 82L62 88L56 82L50 88L44 82L38 88L32 82L26 88L20 82L14 88L12 82Z" fill="#4a4f66"/>`,
  실내화: (() => {
    const shoe = (dx: number, dy: number) =>
      `<g transform="translate(${dx} ${dy})">` +
      `<path d="M10 66V52C10 47 13 45 18 45H28C32 51 40 52 46 50C56 50 64 56 64 64V66Z" fill="#fff"/>` +
      `<path d="M28 45C32 51 40 52 46 50" stroke-width="3.5"/>` +
      `<path d="M44 50C54 50 64 56 64 64V66H50C52 60 50 54 44 50Z" fill="#3b8fe0"/>` +
      `<rect x="8" y="65" width="58" height="7" rx="3" fill="#3b8fe0"/>` +
      `</g>`;
    return `<path d="M6 92H94" stroke="#c9a06a" stroke-width="3"/>` + shoe(26, -18) + shoe(2, 18);
  })(),
  나막신:
    `<path d="M22 64V84H34V64Z" fill="#9a5b2e"/><path d="M60 64V84H72V64Z" fill="#9a5b2e"/>` +
    `<path d="M8 56C8 48 14 46 20 46H64C76 46 86 40 92 30C94 44 88 60 76 64H18C12 64 8 62 8 56Z" fill="#c8894a"/>` +
    `<ellipse cx="40" cy="48" rx="22" ry="5" fill="#6b3e26"/>` +
    `<path d="M16 56H70M64 54C74 52 82 46 88 38" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M14 88H80" stroke="#c9b28a" stroke-width="3"/>`,
  타이츠:
    `<path d="M26 16H74L72 44L66 86H56L51 50H49L44 86H34L28 44Z" fill="#ff9aa8"/>` +
    `<path d="M34 84H44C44 90 40 94 32 94C24 94 24 86 34 84Z" fill="#ff9aa8"/>` +
    `<path d="M56 84H66C76 86 76 94 68 94C60 94 56 90 56 84Z" fill="#ff9aa8"/>` +
    `<rect x="24" y="6" width="52" height="11" rx="3" fill="#e85d9a"/>` +
    dot(38, 30, 2.8, '#fff') +
    dot(60, 30, 2.8, '#fff') +
    dot(49, 40, 2.8, '#fff') +
    dot(36, 54, 2.8, '#fff') +
    dot(64, 54, 2.8, '#fff') +
    dot(40, 72, 2.8, '#fff') +
    dot(60, 72, 2.8, '#fff'),
  수면양말:
    `<path d="M86 10A11 11 0 1 0 94 28A9 9 0 0 1 86 10Z" fill="#ffd23f"/>` +
    sparkle(72, 12, 5) +
    fuzzySock(58, 12, '#7ec8f0') +
    fuzzySock(22, 30, '#ff9aa8'),
  // ── 모자 ──
  베레모:
    kidHead() +
    `<path d="M14 54C10 36 30 22 54 22C78 22 94 34 90 50C86 60 72 62 56 62H30C20 62 15 60 14 54Z" fill="#e8553d"/>` +
    `<path d="M28 60C38 64 62 64 72 60" stroke="#b83a2a" stroke-width="3"/>` +
    `<path d="M54 22L57 14" stroke-width="5"/>` +
    `<path d="M30 36C38 30 48 28 56 28" stroke="#fff" stroke-width="3" opacity=".5"/>`,
  중절모:
    kidHead() +
    `<ellipse cx="50" cy="58" rx="40" ry="8" fill="#6b3e26"/>` +
    `<path d="M28 58L31 26Q38 18 50 24Q62 18 69 26L72 58Z" fill="#6b3e26"/>` +
    `<path d="M29.5 46H70.5L71 56H29Z" fill="${INK}"/>` +
    `<path d="M50 24V34" stroke-width="3"/>` +
    `<path d="M16 60Q50 70 84 60" stroke-width="3"/>`,
  카우보이모자:
    kidHead() +
    `<path d="M29 56C27 32 33 16 41 18Q50 26 59 18C67 16 73 32 71 56Z" fill="#c8894a"/>` +
    `<path d="M29.5 46Q50 50 70.5 46L71 54Q50 58 29 54Z" fill="#6b3e26"/>` +
    `<path d="M6 40C12 56 30 62 50 62S88 56 94 40C86 50 70 54 50 54S14 50 6 40Z" fill="#c8894a"/>` +
    star(50, 50, 4.5, '#ffd23f', 2),
  요리사모자:
    kidHead() +
    blob('#fff', [
      [32, 28, 14],
      [50, 20, 16],
      [68, 28, 14],
      [42, 34, 12],
      [58, 34, 12],
    ]) +
    `<rect x="31" y="34" width="38" height="26" rx="3" fill="#fff"/>` +
    `<path d="M40 38V58M50 38V58M60 38V58" stroke="#c3cde0" stroke-width="2.5"/>`,
  경찰모자:
    kidHead() +
    `<path d="M18 42C18 22 82 22 82 42L72 54H28Z" fill="#2c3e7a"/>` +
    `<rect x="28" y="50" width="44" height="9" rx="2" fill="${INK}"/>` +
    `<path d="M30 58Q50 64 70 58L72 64Q50 72 28 64Z" fill="${INK}"/>` +
    `<circle cx="50" cy="38" r="9" fill="#ffd23f"/>` +
    star(50, 38, 6, '#f2c14e', 2) +
    `<path d="M38 38H28M62 38H72" stroke="#ffd23f" stroke-width="4"/>`,
  소방모자:
    kidHead() +
    `<path d="M12 58Q50 48 88 58Q94 66 84 66Q50 60 16 66Q6 66 12 58Z" fill="#c43d2c"/>` +
    `<path d="M24 58C24 30 36 16 50 16S76 30 76 58Z" fill="#e8553d"/>` +
    `<path d="M50 16V56" stroke="#c43d2c" stroke-width="6"/><path d="M50 16V56"/>` +
    `<path d="M40 30H60V42C60 50 55 54 50 56C45 54 40 50 40 42Z" fill="#ffd23f"/>` +
    `<circle cx="50" cy="40" r="4.5" fill="#e8553d" stroke-width="2.5"/>`,
  해적모자:
    kidHead({ patch: true }) +
    `<path d="M6 58C12 30 34 36 50 18C66 36 88 30 94 58C70 50 30 50 6 58Z" fill="#2a2f4a"/>` +
    `<path d="M12 52C24 46 36 46 50 46S76 46 88 52" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M40 30L60 44M60 30L40 44" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="50" cy="34" r="7.5" fill="#fff" stroke-width="2.5"/>` +
    dot(47, 34, 1.8) +
    dot(53, 34, 1.8),
  마법사모자:
    kidHead() +
    `<path d="M28 58C36 42 42 24 48 10C52 4 62 4 68 12C62 10 57 12 57 18C60 30 66 44 72 58Z" fill="#8e4fc9"/>` +
    `<ellipse cx="50" cy="60" rx="40" ry="8" fill="#8e4fc9"/>` +
    `<path d="M32 54H68" stroke="#ffd23f" stroke-width="4"/>` +
    star(46, 36, 6, '#ffd23f', 2) +
    star(58, 46, 4.5, '#ffd23f', 2) +
    `<path d="M52 20A5 5 0 1 0 56 28A4 4 0 0 1 52 20Z" fill="#ffd23f" stroke-width="2"/>`,
  생일모자:
    kidHead() +
    `<path d="M50 12L32 60H68Z" fill="#e85d9a"/>` +
    dot(46, 32, 3, '#ffd23f') +
    dot(54, 44, 3, '#ffd23f') +
    dot(42, 52, 3, '#ffd23f') +
    `<circle cx="50" cy="10" r="6" fill="#ffd23f"/>` +
    `<path d="M14 20l4 4M84 22l-4 5M18 44l5 -2M84 44l-5 -2" stroke="#3b78e6" stroke-width="3"/>` +
    `<rect x="76" y="80" width="18" height="13" rx="2" fill="#fff"/><path d="M76 85H94" stroke="#ff9aa8" stroke-width="3"/>` +
    `<path d="M85 80V72" stroke="#3b78e6" stroke-width="3"/><path d="M85 64q-3 4 0 6q3 -2 0 -6Z" fill="#ff9f1a" stroke-width="2"/>`,
  티아라:
    `<path d="M12 68Q50 86 88 68L84 58Q72 62 72 44L64 52Q60 34 50 14Q40 34 36 52L28 44Q28 62 16 58Z" fill="#ffd23f"/>` +
    `<path d="M14 64Q50 80 86 64" stroke="#e8a820" stroke-width="3"/>` +
    `<path d="M50 34L57 44L50 54L43 44Z" fill="#ff5c70" stroke-width="2.5"/>` +
    `<circle cx="32" cy="60" r="4.5" fill="#7ec8f0" stroke-width="2.5"/><circle cx="68" cy="60" r="4.5" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="12" r="4.5" fill="#fff"/><circle cx="28" cy="42" r="3.5" fill="#fff"/><circle cx="72" cy="42" r="3.5" fill="#fff"/>` +
    sparkle(16, 30, 7) +
    sparkle(84, 28, 6) +
    sparkle(50, 90, 4),
  머리핀:
    `<path d="M22 96V62C22 30 38 14 50 14S78 30 78 62V96Z" fill="#5a3b24"/>` +
    `<circle cx="50" cy="58" r="22" fill="${SKIN}"/>` +
    `<path d="M28 56C28 34 40 26 50 26S72 34 72 56C66 44 58 40 50 40S34 44 28 56Z" fill="#5a3b24"/>` +
    dot(42, 60, 2.8) +
    dot(58, 60, 2.8) +
    `<path d="M44 68q6 5 12 0" stroke-width="3"/>` +
    cheeks(66, 14) +
    `<g transform="rotate(-30 66 30)"><path d="M42 30C42 20 90 20 90 30C90 40 42 40 42 30Z" fill="#ffd23f"/><path d="M48 30H84" stroke="#e8a820" stroke-width="2.5"/>` +
    [54, 66, 78].map((x) => `<path d="M${x} 33C${x - 6} 29 ${x - 3} 24 ${x} 27C${x + 3} 24 ${x + 6} 29 ${x} 33Z" fill="#ff5c70" stroke-width="2"/>`).join('') +
    `</g>` +
    tube('M12 36L34 26', '#dfe8f5', 3) +
    tube('M14 46L34 36', '#dfe8f5', 3) +
    sparkle(88, 50, 6),
};
