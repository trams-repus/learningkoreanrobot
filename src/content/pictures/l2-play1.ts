// 그림 묶음: 놀이·놀이터·운동 종목과 운동 도구 (l2). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, sparkle, tube, person, blob } from '../pictureKit.ts';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 정다각형 꼭짓점 (가운데 x,y, 반지름 r, 시작 각도 a0도) */
function poly(x: number, y: number, r: number, n: number, a0 = -90): string {
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + (k * 360) / n) * Math.PI) / 180;
    return `${r1(x + r * Math.cos(a))} ${r1(y + r * Math.sin(a))}`;
  }).join('L');
}

let clipN = 0;
/** 동그라미 안에만 무늬를 그린다 (공 무늬) */
function clipped(cx: number, cy: number, r: number, fill: string, inner: string, sw = 3.5): string {
  const id = `pk-l2p-${++clipN}`;
  return (
    `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="none"/>` +
    `<g clip-path="url(#${id})">${inner}</g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="${sw}"/>`
  );
}

const sw = (r: number) => r1(Math.max(1.6, r * 0.09));

// ── 공 ── (종목마다 색과 무늬가 확실히 다르게)
/** 축구공: 흰 바탕에 검은 오각형 */
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
/** 농구공: 주황에 검은 줄 */
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
/** 배구공: 흰·노랑·파랑 휘어진 띠 */
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
/** 야구공: 흰 바탕에 빨간 실밥 */
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
/** 테니스공: 연두 노랑에 흰 곡선 */
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
/** 볼링공: 짙은 보라에 구멍 셋 */
function bowlingBall(cx: number, cy: number, r: number): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#6a3fb5"/>` +
    dot(r1(cx - r * 0.3), r1(cy - r * 0.35), r1(r * 0.13)) +
    dot(r1(cx + r * 0.05), r1(cy - r * 0.5), r1(r * 0.13)) +
    dot(r1(cx - r * 0.05), r1(cy - r * 0.05), r1(r * 0.15)) +
    `<path d="M${r1(cx + r * 0.45)} ${r1(cy + r * 0.2)}A${r1(r * 0.55)} ${r1(r * 0.55)} 0 0 1 ${r1(cx + r * 0.1)} ${r1(cy + r * 0.6)}" stroke="#b79cf0" stroke-width="${sw(r)}"/>`
  );
}
/** 볼링핀 (아래 가운데가 x,y, 높이 약 64*s) */
function pin(x: number, y: number, s: number): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${r1(3.5 / s)}">` +
    `<path d="M-6 -64C-12 -64 -12 -48 -7 -42C-5 -38 -10 -34 -13 -24C-17 -12 -12 0 -8 0H8C12 0 17 -12 13 -24C10 -34 5 -38 7 -42C12 -48 12 -64 6 -64C3 -67 -3 -67 -6 -64Z" fill="#fff"/>` +
    `<path d="M-7.6 -42.5H7.6M-6.6 -38H6.6" stroke="#e8553d" stroke-width="${r1(3.2 / s)}"/>` +
    `</g>`
  );
}

// ── 라켓·도구 ── (손잡이 끝이 원점, 위쪽으로. t는 transform)
/** 테니스 라켓: 크고 둥근 머리, 굵은 손잡이 */
function tennisRacket(t: string, frame = '#e8553d'): string {
  let strings = '';
  for (const x of [-8, -4, 0, 4, 8]) {
    const h = r1(17 * Math.sqrt(1 - (x / 14) ** 2));
    strings += `M${x} ${r1(-48 - h)}V${r1(-48 + h)}`;
  }
  for (const y of [-12, -6, 0, 6, 12]) {
    const h = r1(13 * Math.sqrt(1 - (y / 18) ** 2));
    strings += `M${-h} ${-48 + y}H${h}`;
  }
  return (
    `<g transform="${t}">` +
    `<path d="M-3 -22L-9 -33M3 -22L9 -33" stroke-width="7"/><path d="M-3 -22L-9 -33M3 -22L9 -33" stroke="${frame}" stroke-width="3"/>` +
    `<rect x="-4" y="-24" width="8" height="25" rx="3" fill="#3b3f8f"/>` +
    `<ellipse cx="0" cy="-48" rx="14" ry="18" fill="#fffbe8" stroke-width="9"/>` +
    `<path d="${strings}" stroke="#9aa6c4" stroke-width="1.5"/>` +
    `<ellipse cx="0" cy="-48" rx="14" ry="18" stroke="${frame}" stroke-width="4"/>` +
    `</g>`
  );
}
/** 배드민턴 라켓: 작은 달걀 머리, 가늘고 긴 막대 */
function badmintonRacket(t: string): string {
  let strings = '';
  for (const x of [-4, 0, 4]) {
    const h = r1(11 * Math.sqrt(1 - (x / 8) ** 2));
    strings += `M${x} ${r1(-58 - h)}V${r1(-58 + h)}`;
  }
  for (const y of [-6, 0, 6]) {
    const h = r1(7 * Math.sqrt(1 - (y / 11) ** 2));
    strings += `M${-h} ${-58 + y}H${h}`;
  }
  return (
    `<g transform="${t}">` +
    `<path d="M0 -14V-46" stroke-width="5"/><path d="M0 -14V-46" stroke="#dfe8f5" stroke-width="2"/>` +
    `<rect x="-3" y="-16" width="6" height="17" rx="2.5" fill="#43b04a"/>` +
    `<ellipse cx="0" cy="-58" rx="8" ry="11" fill="#fff" stroke-width="7"/>` +
    `<path d="${strings}" stroke="#9aa6c4" stroke-width="1.3"/>` +
    `<ellipse cx="0" cy="-58" rx="8" ry="11" stroke="#3b78e6" stroke-width="3"/>` +
    `</g>`
  );
}
/** 탁구채: 동그란 빨간 판, 짧은 나무 손잡이 */
function paddle(t: string): string {
  return (
    `<g transform="${t}">` +
    `<rect x="-4.5" y="-17" width="9" height="18" rx="3" fill="#c98b4f"/>` +
    `<circle cx="0" cy="-30" r="15" fill="#e8553d"/><path d="M-8 -38A10 10 0 0 1 2 -42" stroke="#ff9a8a" stroke-width="3"/>` +
    `</g>`
  );
}
/** 셔틀콕: 코르크 머리(원점)와 흰 깃털 고깔(위쪽) */
function shuttle(t: string): string {
  return (
    `<g transform="${t}">` +
    `<path d="M-7 -4L-15 -32H15L7 -4Z" fill="#fff"/>` +
    `<path d="M-5 -4L-8 -32M0 -4V-32M5 -4L8 -32" stroke-width="2"/>` +
    `<path d="M-12 -20H12" stroke="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M-8 -4H8V2A8 8 0 0 1 -8 2Z" fill="#e8553d"/>` +
    `</g>`
  );
}
/** 야구방망이 (손잡이 끝이 원점, 위로 굵어짐) */
function bat(t: string): string {
  return (
    `<g transform="${t}">` +
    `<path d="M-3 -4L-3.5 -30C-4 -42 -8 -52 -8 -66A8 8 0 0 1 8 -66C8 -52 4 -42 3.5 -30L3 -4Z" fill="#d9a066"/>` +
    `<ellipse cx="0" cy="-2" rx="6" ry="3" fill="#9a5b2e"/>` +
    `<path d="M-2 -60C-2 -50 -1 -44 -1 -38" stroke="#f3cf9e" stroke-width="2.5"/>` +
    `</g>`
  );
}

// ── 사람 ──
interface KidOpt {
  shirt?: string;
  torso?: string;
  hair?: string;
  hat?: string;
  extra?: string;
  eyes?: string;
}
/** 막대 아이 (머리 가운데 x,y). limbs는 팔다리 선, torso는 몸통 선(기본 목에서 엉덩이) */
function kid(x: number, y: number, s: number, limbs: string, o: KidOpt = {}): string {
  const torso = o.torso ?? 'M0 10L0 36';
  const hair = o.hat
    ? `<path d="M-10.5 -1C-11 -15 11 -15 10.5 -1Z" fill="${o.hat}"/><circle cx="0" cy="-12" r="3.5" fill="#fff"/>`
    : `<path d="M-10 -1C-11 -12 -4 -11.5 0 -11.5S11 -12 10 -1C7 -6 3 -7 0 -7S-7 -6 -10 -1Z" fill="${o.hair ?? '#5a3b24'}"/>`;
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="${limbs}" stroke-width="6"/>` +
    (o.shirt ? tube(torso, o.shirt, 9) : `<path d="${torso}" stroke-width="6"/>`) +
    `<circle cx="0" cy="0" r="10" fill="${SKIN}"/>` +
    hair +
    (o.eyes ?? dot(-3.6, 1, 1.6) + dot(3.6, 1, 1.6) + `<path d="M-3 4.5q3 2.5 6 0" stroke-width="1.8"/>`) +
    (o.extra ?? '') +
    `</g>`
  );
}
const motion = (d: string) => `<path d="${d}" stroke="#9aa6c4" stroke-width="3"/>`;
const arrow = (d: string, head: string) =>
  `<path d="${d}" stroke="#3b78e6" stroke-width="4" stroke-dasharray="6 5"/><path d="${head}" stroke="#3b78e6" stroke-width="4"/>`;
const ground = (y = 92, c = '#c9b28a') => `<path d="M4 ${y}H96" stroke="${c}" stroke-width="3"/>`;

/** 윷가락 하나 (가운데 x,y, 기울기 rot). flat이면 X 표시 있는 평평한 면 */
const yut = (x: number, y: number, rot: number, flat: boolean) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">` +
  `<rect x="-6.5" y="-24" width="13" height="48" rx="6.5" fill="${flat ? '#f5dcae' : '#b5793a'}"/>` +
  (flat
    ? `<path d="M-3 -14l6 6M3 -14l-6 6M-3 8l6 6M3 8l-6 6" stroke="#9a5b2e" stroke-width="2.2"/>`
    : `<path d="M-2 -18V18" stroke="#d9a066" stroke-width="2.5"/>`) +
  `</g>`;

/** 딱지 (가운데 x,y, 반변 h, 세로 눌림 k, 두 색) */
const ddakji = (x: number, y: number, h: number, k: number, rot: number, a: string, b: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1 ${k})" stroke-width="${r1(3.5 / Math.sqrt(k))}">` +
  `<path d="M${-h} ${-h}H${h}L0 0Z" fill="${a}"/><path d="M${h} ${-h}V${h}L0 0Z" fill="${b}"/>` +
  `<path d="M${h} ${h}H${-h}L0 0Z" fill="${a}"/><path d="M${-h} ${h}V${-h}L0 0Z" fill="${b}"/>` +
  `<rect x="${-h}" y="${-h}" width="${2 * h}" height="${2 * h}" rx="2"/>` +
  `</g>`;

/** 공기돌 */
const stone = (x: number, y: number, c: string, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-11 3L-8 -8L3 -11L11 -4L10 6L1 11L-8 9Z" fill="${c}"/>` +
  `<path d="M-8 -8L-2 -2L3 -11M-2 -2L10 6M-2 -2L-8 9" stroke-width="2"/></g>`;

/** 말 (회전목마) 옆모습. (x,y) 몸통 가운데 */
const horse = (x: number, y: number, s: number, c: string, saddle: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${r1(3.5 / s)}">` +
  `<path d="M-12 4L-18 16M-6 6L-4 18M8 6L14 16M12 4L20 12" stroke-width="${r1(5 / s)}"/>` +
  `<path d="M-16 -2C-22 0 -24 8 -26 12" stroke="#e85d9a" stroke-width="${r1(5 / s)}"/>` +
  `<ellipse cx="0" cy="0" rx="17" ry="8" fill="${c}"/>` +
  `<path d="M10 -4L16 -18C17 -22 21 -23 24 -20L28 -12C29 -9 26 -8 24 -9L20 -10L18 2Z" fill="${c}"/>` +
  `<path d="M15 -16C11 -12 10 -8 10 -4" stroke="#e85d9a" stroke-width="${r1(4 / s)}"/>` +
  `<path d="M-6 -8H6V4H-6Z" fill="${saddle}"/>` +
  dot(21, -16, 1.6) +
  `</g>`;

/** 곰 인형 (소꿉놀이) */
const teddy = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${r1(3.5 / s)}">` +
  `<ellipse cx="0" cy="14" rx="12" ry="12" fill="#c98b4f"/>` +
  `<circle cx="-9" cy="-12" r="5" fill="#c98b4f"/><circle cx="9" cy="-12" r="5" fill="#c98b4f"/>` +
  `<circle cx="0" cy="-3" r="11" fill="#c98b4f"/><ellipse cx="0" cy="1" rx="4.5" ry="3.5" fill="#f5d6a8" stroke="none"/>` +
  dot(-4, -5, 1.6) +
  dot(4, -5, 1.6) +
  dot(0, 0, 1.4) +
  `</g>`;

export const PICS: Record<string, string> = {
  // ── 전통 놀이 ──
  윷놀이:
    `<ellipse cx="50" cy="82" rx="42" ry="12" fill="#e8c77a"/><path d="M20 78Q50 72 80 78M16 86Q50 92 84 86" stroke="#c9a24f" stroke-width="2.5"/>` +
    yut(24, 44, -28, true) +
    yut(42, 38, -8, false) +
    yut(60, 38, 10, true) +
    yut(77, 46, 30, false) +
    motion('M14 14l6 6M50 6v7M86 14l-6 6'),
  제기:
    motion('M20 40C16 50 16 58 20 66M80 40C84 50 84 58 80 66') +
    tube('M50 58C44 44 34 30 26 18', '#e8553d', 6) +
    tube('M50 58C48 40 42 24 40 10', '#ffd23f', 6) +
    tube('M50 58C52 40 56 24 60 10', '#3b78e6', 6) +
    tube('M50 58C56 44 66 30 74 18', '#43b04a', 6) +
    tube('M50 58C50 42 50 26 50 8', '#e85d9a', 6) +
    `<ellipse cx="50" cy="62" rx="14" ry="7" fill="#f2c14e"/><rect x="46" y="58" width="8" height="5" fill="${INK}" stroke="none"/>` +
    `<path d="M22 98L36 84" stroke-width="16"/><path d="M22 98L36 84" stroke="#fff" stroke-width="9"/>` +
    `<path d="M30 82C34 76 46 76 60 78C68 79 70 86 64 90C54 94 40 94 32 90C28 88 28 85 30 82Z" fill="#3b78e6"/>` +
    `<path d="M34 90H64" stroke="#fff" stroke-width="3"/>`,
  딱지:
    ddakji(50, 32, 20, 1, -12, '#e8553d', '#ffd23f') +
    motion('M20 26v14M80 22v14M28 56l4 6M72 56l-4 6') +
    ddakji(50, 80, 24, 0.42, 0, '#3b78e6', '#43b04a'),
  공기:
    `<path d="M26 64C30 40 44 26 56 24" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="4 5"/>` +
    motion('M60 10v6M72 18l-5 4') +
    stone(64, 24, '#e8553d', 10) +
    stone(14, 80, '#ffd23f', -20) +
    stone(36, 82, '#43b04a', 15) +
    stone(60, 80, '#3b78e6', -10) +
    stone(84, 78, '#e85d9a', 25) +
    `<path d="M8 92H92" stroke="#c9b28a" stroke-width="3"/>`,
  연날리기:
    `<path d="M30 70C44 50 58 44 72 40" stroke="#9aa6c4" stroke-width="2"/>` +
    `<g transform="translate(70 26) scale(.75) translate(-50 -40)">` +
    `<path d="M50 70C40 76 60 80 50 86C42 90 54 94 48 98" stroke-width="3"/>` +
    `<path d="M50 6L82 38L50 72L18 38Z" fill="#ffd23f"/>` +
    `<path d="M50 6L82 38H50Z" fill="#e8553d"/><path d="M18 38L50 72V38Z" fill="#e8553d"/>` +
    `<path d="M50 6L82 38L50 72L18 38Z"/><path d="M50 6V72M18 38H82" stroke-width="2.5"/></g>` +
    blob('#fff', [
      [18, 20, 7],
      [28, 18, 9],
      [37, 22, 6],
    ]) +
    ground(94, '#5fc24a') +
    kid(24, 50, 0.72, 'M0 17L9 27M0 17L-10 28M0 36L-8 60M0 36L8 60', { shirt: '#3b78e6' }),
  널뛰기:
    `<ellipse cx="50" cy="80" rx="12" ry="8" fill="#e8c77a"/><path d="M42 78H58M42 83H58" stroke="#c9a24f" stroke-width="2"/>` +
    tube('M6 88L94 62', '#b5793a', 6) +
    `<path d="M14 64L18 84H4Z" fill="#e8553d"/>` +
    person(12, 66, 0.9, { hair: '#2b2b3a', style: 'bun', shirt: '#ffd23f' }) +
    `<path d="M76 42L84 52H68Z" fill="#3b78e6"/><path d="M72 52L70 58M80 52L82 58" stroke-width="3"/>` +
    person(76, 44, 0.9, { hair: '#2b2b3a', style: 'bun', shirt: '#e85d9a' }) +
    motion('M62 44v10M90 44v10'),
  // ── 놀이터·놀이공원 ──
  시소:
    `<path d="M40 88L50 68L60 88Z" fill="#3b78e6"/>` +
    ground(90) +
    tube('M8 78L92 58', '#e8553d', 7) +
    `<path d="M22 70V64M78 62V56" stroke-width="5"/>` +
    kid(22, 40, 0.7, 'M0 17L8 30M0 17L-8 30M0 36L10 40L8 52M0 36L-6 44', { shirt: '#43b04a' }) +
    kid(80, 30, 0.7, 'M0 17L-8 30M0 17L8 30M0 36L-10 40L-8 52M0 36L6 44', { shirt: '#ffd23f', hair: '#9a5b2e' }),
  정글짐: (() => {
    const bar = (d: string, c: string) => tube(d, c, 4);
    return (
      ground(92) +
      bar('M36 16V78M62 16V78M88 16V78M36 16H88M36 42H88', '#43b04a') +
      bar('M12 30L36 16M38 30L62 16M64 30L88 16M12 56L36 42M64 56L88 42', '#ffd23f') +
      bar('M12 30V90M38 30V90M64 30V90M12 30H64M12 56H64M12 82H64', '#e8553d') +
      kid(51, 44, 0.55, 'M0 17L-11 12M0 17L12 12M0 36L-12 40M0 36L10 48', { shirt: '#3b78e6' })
    );
  })(),
  회전목마:
    `<path d="M50 6L90 34H10Z" fill="#e8553d"/><path d="M50 6L36 34H64Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M10 34Q20 42 30 34Q40 42 50 34Q60 42 70 34Q80 42 90 34" fill="#ffd23f"/>` +
    `<path d="M30 38V82M70 38V80" stroke="#f2c14e" stroke-width="4"/>` +
    `<ellipse cx="50" cy="86" rx="42" ry="8" fill="#8e4fc9"/>` +
    horse(30, 62, 0.85, '#fff', '#3b78e6') +
    horse(70, 56, 0.85, '#fff', '#e8553d') +
    dot(50, 6, 3, HL),
  관람차: (() => {
    let spokes = '';
    let cabins = '';
    const cols = ['#e8553d', '#ffd23f', '#43b04a', '#3b78e6', '#e85d9a', '#ff9f1a', '#8e4fc9', '#5fc24a'];
    for (let k = 0; k < 8; k++) {
      const a = (k * 45 * Math.PI) / 180;
      const x = r1(50 + 32 * Math.cos(a));
      const y = r1(42 + 32 * Math.sin(a));
      spokes += `M50 42L${x} ${y}`;
      cabins += `<path d="M${x - 6} ${y + 2}H${x + 6}V${y + 8}A6 6 0 0 1 ${x - 6} ${y + 8}Z" fill="${cols[k]}"/><path d="M${x} ${y}V${y + 2}" stroke-width="2.5"/>`;
    }
    return (
      `<path d="M50 42L28 94M50 42L72 94" stroke-width="9"/><path d="M50 42L28 94M50 42L72 94" stroke="#8a96b0" stroke-width="4"/>` +
      `<circle cx="50" cy="42" r="32" stroke-width="7"/><circle cx="50" cy="42" r="32" stroke="#dfe8f5" stroke-width="3"/>` +
      `<path d="${spokes}" stroke-width="2"/>` +
      cabins +
      `<circle cx="50" cy="42" r="6" fill="#ffd23f"/>` +
      ground(94)
    );
  })(),
  롤러코스터:
    `<path d="M20 94V76M76 94V66M88 94V82" stroke="#8a96b0" stroke-width="4"/>` +
    `<g transform="translate(0 14)"><path d="M4 72C14 70 20 60 26 48C32 34 40 16 56 16C74 16 80 34 72 46C64 58 48 52 50 38C52 26 66 26 76 40C82 50 88 68 96 70" stroke-width="10"/>` +
    `<path d="M4 72C14 70 20 60 26 48C32 34 40 16 56 16C74 16 80 34 72 46C64 58 48 52 50 38C52 26 66 26 76 40C82 50 88 68 96 70" stroke="#e8553d" stroke-width="4"/></g>` +
    `<g transform="translate(56 30) scale(.8) translate(-22 -62)"><rect x="4" y="44" width="36" height="14" rx="4" fill="#ffd23f"/>` +
    `<circle cx="14" cy="38" r="6" fill="${SKIN}"/><circle cx="30" cy="38" r="6" fill="${SKIN}"/>` +
    `<path d="M10 34L7 28M18 34L21 28M26 34L23 28M34 34L37 28" stroke-width="3"/>` +
    `<circle cx="12" cy="60" r="3.5" fill="#8a96b0"/><circle cx="32" cy="60" r="3.5" fill="#8a96b0"/></g>` +
    ground(94),
  범퍼카:
    `<path d="M4 8H96" stroke="#8a96b0" stroke-width="5"/><path d="M24 10V52" stroke-width="3"/>` +
    sparkle(24, 12, 8, HL) +
    `<path d="M14 72C14 58 20 52 30 52H40L46 62H76C84 62 88 66 88 72Z" fill="#ffd23f"/>` +
    kid(40, 38, 0.8, 'M0 17L16 22', { shirt: '#e8553d' }) +
    `<path d="M54 50L58 62" stroke-width="4"/><ellipse cx="54" cy="50" rx="7" ry="3" fill="#8a96b0"/>` +
    `<rect x="8" y="70" width="86" height="14" rx="7" fill="#2b2b3a"/>` +
    `<circle cx="26" cy="88" r="4" fill="#8a96b0"/><circle cx="76" cy="88" r="4" fill="#8a96b0"/>` +
    ground(94) +
    motion('M88 40l6 -4M90 50h6'),
  트램펄린:
    `<path d="M16 76L12 94M84 76L88 94M50 82V94" stroke-width="5"/>` +
    `<ellipse cx="50" cy="74" rx="42" ry="12" fill="#3b78e6"/><ellipse cx="50" cy="73" rx="33" ry="8" fill="${INK}"/>` +
    motion('M30 56v10M70 56v10') +
    kid(50, 14, 0.75, 'M0 17L-14 4M0 17L14 4M0 36L-8 56M0 36L8 56', { shirt: '#e85d9a' }),
  볼풀: (() => {
    const cols = ['#e8553d', '#ffd23f', '#43b04a', '#3b78e6', '#e85d9a', '#ff9f1a'];
    let balls = '';
    let k = 0;
    for (const [x, y] of [
      [18, 54], [32, 50], [70, 52], [84, 56],
      [14, 68], [28, 66], [42, 64], [56, 66], [70, 66], [86, 68],
    ])
      balls += `<circle cx="${x}" cy="${y}" r="7.5" fill="${cols[k++ % 6]}"/>`;
    return (
      `<rect x="6" y="54" width="88" height="40" rx="8" fill="#7ec8f0"/>` +
      kid(50, 32, 0.9, 'M0 17L-16 4M0 17L16 4', { shirt: '#fff' }) +
      balls +
      `<path d="M6 72H94" stroke-width="3.5"/>` +
      `<rect x="6" y="72" width="88" height="22" rx="0" fill="#7ec8f0"/><rect x="6" y="54" width="88" height="40" rx="8"/>` +
      `<path d="M20 83H80" stroke="#4a90e2" stroke-width="3"/>`
    );
  })(),
  // ── 장난감·놀이 ──
  주사위:
    `<path d="M16 34L38 16H86L64 34Z" fill="#dfe8f5"/><path d="M64 34L86 16V66L64 86Z" fill="#c9d4e8"/>` +
    `<rect x="16" y="34" width="48" height="52" rx="5" fill="#fff"/>` +
    dot(28, 46, 4.5) + dot(52, 46, 4.5) + dot(40, 60, 4.5) + dot(28, 74, 4.5) + dot(52, 74, 4.5) +
    `<ellipse cx="51" cy="25" rx="6" ry="3.5" fill="#e8553d" stroke="none"/>` +
    dot(71, 36, 3) + dot(75, 51, 3) + dot(79, 66, 3),
  카드: (() => {
    const heart = (x: number, y: number, s: number) =>
      `<path d="M${x} ${y + 8 * s}C${x - 12 * s} ${y}  ${x - 10 * s} ${y - 9 * s} ${x - 5 * s} ${y - 9 * s}C${x - 2 * s} ${y - 9 * s} ${x} ${y - 6 * s} ${x} ${y - 4 * s}C${x} ${y - 6 * s} ${x + 2 * s} ${y - 9 * s} ${x + 5 * s} ${y - 9 * s}C${x + 10 * s} ${y - 9 * s} ${x + 12 * s} ${y} ${x} ${y + 8 * s}Z" fill="#e8553d" stroke="none"/>`;
    const spade = (x: number, y: number, s: number) =>
      `<path d="M${x} ${y - 9 * s}C${x - 12 * s} ${y}  ${x - 10 * s} ${y + 7 * s} ${x - 4 * s} ${y + 5 * s}C${x - 2 * s} ${y + 4 * s} ${x} ${y + 2 * s} ${x} ${y + 1 * s}C${x} ${y + 2 * s} ${x + 2 * s} ${y + 4 * s} ${x + 4 * s} ${y + 5 * s}C${x + 10 * s} ${y + 7 * s} ${x + 12 * s} ${y} ${x} ${y - 9 * s}Z" fill="${INK}" stroke="none"/><path d="M${x} ${y}L${x - 4 * s} ${y + 10 * s}H${x + 4 * s}Z" fill="${INK}" stroke="none"/>`;
    const diamond = (x: number, y: number, s: number) =>
      `<path d="M${x} ${y - 10 * s}L${x + 7 * s} ${y}L${x} ${y + 10 * s}L${x - 7 * s} ${y}Z" fill="#e8553d" stroke="none"/>`;
    const card = (rot: number, mark: string) =>
      `<g transform="rotate(${rot} 50 96)"><rect x="30" y="18" width="40" height="58" rx="5" fill="#fff"/>${mark}</g>`;
    return (
      card(-24, spade(50, 44, 1.3) + spade(37, 28, 0.5)) +
      card(24, diamond(50, 47, 1.3) + diamond(37, 28, 0.5)) +
      card(0, heart(50, 48, 1.4) + heart(37, 28, 0.5) + heart(63, 68, 0.5))
    );
  })(),
  숨바꼭질:
    `<rect x="14" y="30" width="14" height="62" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [21, 20, 14],
      [8, 28, 8],
    ]) +
    kid(38, 38, 0.8, 'M0 17L-14 8M0 17L-14 4M0 36L-4 64M0 36L6 64', {
      shirt: '#e8553d',
      eyes: `<path d="M-6 2H6" stroke-width="2"/>`,
    }) +
    `<path d="M26 40L28 44" stroke-width="3"/>` +
    kid(74, 52, 0.8, 'M0 17L-12 10', { shirt: '#3b78e6', hair: '#2b2b3a' }) +
    blob('#5fc24a', [
      [62, 80, 14],
      [78, 76, 14],
      [90, 82, 10],
      [52, 86, 10],
    ]) +
    ground(94),
  술래잡기:
    ground(92) +
    motion('M4 40H14M6 52H16') +
    kid(28, 30, 0.85, 'M0 17L14 10M0 17L16 20M2 36L-10 50L-18 60M2 36L14 48L12 62', { shirt: '#e8553d', torso: 'M0 10L2 36' }) +
    kid(72, 28, 0.85, 'M0 17L-12 26M0 17L14 8M0 36L-12 48L-10 62M0 36L14 46L22 58', { shirt: '#ffd23f', hair: '#9a5b2e' }) +
    arrow('M48 16H80', 'M74 10L82 16L74 22'),
  소꿉놀이:
    `<ellipse cx="50" cy="84" rx="46" ry="10" fill="#ff9aa8"/>` +
    person(28, 76, 1.2, { hair: '#5a3b24', style: 'pony', shirt: '#ffd23f' }) +
    `<g transform="rotate(20 46 46)"><path d="M34 48C34 36 58 36 58 48C58 58 34 58 34 48Z" fill="#7ec8f0"/><path d="M58 44L66 38" stroke-width="5"/><path d="M34 44C28 44 28 54 34 52" stroke-width="3"/><rect x="42" y="36" width="8" height="4" rx="2" fill="#e85d9a"/></g>` +
    `<path d="M62 66H74L72 78H64Z" fill="#fff"/><path d="M74 69C79 69 79 75 73 75" stroke-width="2.5"/>` +
    `<path d="M66 54C66 58 67 60 67 63" stroke="#7ec8f0" stroke-width="3" stroke-dasharray="3 3"/>` +
    teddy(86, 62, 0.85),
  요요:
    `<path d="M50 4V44" stroke-width="2.5"/>` +
    `<circle cx="50" cy="4" r="4" fill="${SKIN}"/>` +
    `<circle cx="50" cy="62" r="28" fill="#e8553d"/><circle cx="50" cy="62" r="16" fill="#ffd23f"/><circle cx="50" cy="62" r="5" fill="#fff"/>` +
    `<path d="M50 34V57" stroke-width="2.5"/>` +
    motion('M14 46C10 56 10 68 14 78M86 46C90 56 90 68 86 78') +
    `<path d="M30 46A26 26 0 0 1 40 38" stroke="#ff9a8a" stroke-width="4"/>`,
  부메랑:
    `<path d="M20 70C22 44 36 22 60 14C66 12 70 18 66 22C48 32 38 48 36 64C46 56 64 52 84 58C90 60 88 68 82 68C62 66 44 70 30 80C24 84 20 78 20 70Z" fill="#ff9f1a"/>` +
    `<path d="M28 68C32 50 42 34 58 22M36 70C50 64 66 62 80 64" stroke="#e8553d" stroke-width="3.5"/>` +
    `<path d="M60 88C80 90 94 76 90 56" stroke="#3b78e6" stroke-width="4" stroke-dasharray="6 5"/><path d="M84 60L90 52L95 62" stroke="#3b78e6" stroke-width="4"/>`,
  원반:
    kid(20, 44, 0.75, 'M0 17L16 10M0 17L-10 28M0 36L-8 60M0 36L8 60', { shirt: '#43b04a' }) +
    `<path d="M34 50C44 40 50 38 56 38" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<g transform="rotate(-12 70 36)"><ellipse cx="70" cy="38" rx="25" ry="11" fill="#e8553d"/><ellipse cx="70" cy="35" rx="17" ry="6" fill="#ff7b66" stroke-width="2.5"/><path d="M45 38C45 44 58 50 70 50S95 44 95 38" stroke-width="3.5"/></g>` +
    motion('M60 60h14M66 68h14') +
    ground(94, '#5fc24a'),
  물총:
    `<path d="M4 60C8 52 14 50 22 50" stroke="#4aa8f0" stroke-width="5"/>` +
    `<circle cx="8" cy="44" r="3" fill="#4aa8f0" stroke="none"/><circle cx="14" cy="38" r="2.5" fill="#4aa8f0" stroke="none"/><circle cx="6" cy="72" r="3" fill="#4aa8f0" stroke="none"/>` +
    `<rect x="20" y="44" width="14" height="10" rx="3" fill="#ff9f1a"/>` +
    `<path d="M32 38H84C90 38 92 44 90 50L86 56H32Z" fill="#43b04a"/>` +
    `<rect x="44" y="16" width="30" height="24" rx="8" fill="#7ec8f0"/><path d="M50 26H68" stroke="#fff" stroke-width="4"/>` +
    `<path d="M62 56H82L88 88C88 92 84 94 80 94H72C68 94 66 90 66 86Z" fill="#ffd23f"/>` +
    `<path d="M50 56C50 70 58 72 62 68" stroke-width="4"/><path d="M52 56V66" stroke="#e8553d" stroke-width="5"/>`,
  풍차:
    `<path d="M4 94C30 84 70 84 96 94Z" fill="#5fc24a"/>` +
    `<path d="M40 88L44 44H56L60 88Z" fill="#fff"/>` +
    `<path d="M40 46L50 34L60 46Z" fill="#e8553d"/>` +
    `<path d="M46 88V76A4 4 0 0 1 54 76V88Z" fill="#9a5b2e"/>` +
    `<g transform="rotate(20 50 40)">` +
    [0, 90, 180, 270]
      .map(
        (a) =>
          `<g transform="rotate(${a} 50 40)"><rect x="46" y="4" width="10" height="34" fill="#f2c14e"/><path d="M46 12H56M46 20H56M46 28H56" stroke-width="2"/></g>`,
      )
      .join('') +
    `</g>` +
    `<circle cx="50" cy="40" r="4" fill="#9a5b2e"/>`,
  바람개비:
    `<path d="M50 50L50 96" stroke-width="7"/><path d="M50 50L50 96" stroke="#fff" stroke-width="2"/>` +
    [
      [0, '#e8553d'],
      [90, '#ffd23f'],
      [180, '#3b78e6'],
      [270, '#43b04a'],
    ]
      .map(
        ([a, c]) =>
          `<g transform="rotate(${a} 50 42)"><path d="M50 42L50 8C64 8 72 18 72 26Z" fill="${c}"/></g>`,
      )
      .join('') +
    `<circle cx="50" cy="42" r="4.5" fill="#fff"/>` +
    motion('M14 30C10 38 10 48 14 56M86 28C90 36 90 46 86 54'),
  종이배:
    `<path d="M4 76Q16 70 28 76T52 76T76 76T100 76V98H4Z" fill="#7ec8f0" stroke-width="3"/>` +
    `<path d="M8 50H92L76 76H24Z" fill="#fff"/>` +
    `<path d="M26 50L50 14L74 50Z" fill="#fff"/><path d="M50 14V50" stroke-width="2.5"/>` +
    `<path d="M26 50L50 14L50 50Z" fill="#dfe8f5"/>` +
    `<path d="M8 50L24 60H76L92 50" stroke-width="2.5"/>` +
    `<path d="M16 88Q24 84 32 88M60 88Q68 84 76 88" stroke="#fff" stroke-width="3"/>`,
  종이학:
    `<path d="M30 60L50 50L70 60L50 72Z" fill="#ff9aa8"/>` +
    `<path d="M50 50L22 12L44 58Z" fill="#ff7b9a"/>` +
    `<path d="M50 50L84 14L62 58Z" fill="#e85d9a"/>` +
    `<path d="M34 62L10 36L14 34L38 58Z" fill="#ff9aa8"/><path d="M10 36L4 44L14 38Z" fill="#ff9aa8"/>` +
    `<path d="M66 62L94 42L90 40L62 58Z" fill="#ff9aa8"/>` +
    `<path d="M50 72V60" stroke-width="2"/>` +
    `<path d="M26 86H74" stroke="#c9b28a" stroke-width="3"/>`,
  색종이: [
    [-24, '#43b04a'],
    [-12, '#3b78e6'],
    [0, '#ffd23f'],
    [12, '#e85d9a'],
    [24, '#e8553d'],
  ]
    .map(([a, c]) => `<rect x="24" y="22" width="52" height="52" rx="2" fill="${c}" transform="rotate(${a} 50 90)"/>`)
    .join('') + `<path d="M76 22L64 34H76Z" fill="#fff" transform="rotate(24 50 90)"/>`,
  스티커:
    `<rect x="12" y="10" width="76" height="82" rx="8" fill="#fff"/>` +
    `<path d="M${poly(32, 30, 12, 5)}Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M${poly(32, 30, 12, 10)}Z" fill="none" stroke="none"/>` +
    `<path d="M68 38C56 30 58 20 63 20C66 20 68 23 68 25C68 23 70 20 73 20C78 20 80 30 68 38Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<circle cx="32" cy="66" r="12" fill="#43b04a" stroke-width="2.5"/>` +
    dot(28, 64, 1.8) +
    dot(36, 64, 1.8) +
    `<path d="M28 70q4 3 8 0" stroke-width="2"/>` +
    `<path d="M56 56H78V70L66 80H56Z" fill="#7ec8f0" stroke-width="2.5"/><path d="M78 70L68 70L66 80Z" fill="#dfe8f5" stroke-width="2.5"/>`,
  점토:
    `<path d="M10 64H48L44 92H14Z" fill="#fff"/><ellipse cx="29" cy="64" rx="19" ry="6" fill="#3b78e6"/>` +
    `<ellipse cx="30" cy="40" rx="20" ry="7" fill="#e8553d" transform="rotate(-20 30 40)"/>` +
    `<path d="M56 84C56 72 90 72 90 84Z" fill="#ffd23f"/><circle cx="66" cy="80" r="2.5" fill="${INK}" stroke="none"/><circle cx="78" cy="78" r="2.5" fill="${INK}" stroke="none"/>` +
    tube('M56 52C62 44 68 60 74 52S86 44 90 52', '#43b04a', 8) +
    `<circle cx="84" cy="26" r="8" fill="#e85d9a"/>`,
  // ── 겨울 놀이 ──
  눈싸움:
    `<path d="M4 84C30 78 70 78 96 84V96H4Z" fill="#fff"/>` +
    kid(24, 42, 0.75, 'M0 17L-8 4L-10 -6M0 17L10 26M0 36L-8 56M0 36L8 56', { shirt: '#e8553d', hat: '#3b78e6' }) +
    `<circle cx="17" cy="34" r="5" fill="#fff"/>` +
    `<path d="M26 26C40 16 56 20 62 34" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="4 5"/>` +
    `<circle cx="64" cy="38" r="6" fill="#fff"/>` +
    kid(78, 50, 0.75, 'M0 17L-12 10M0 17L10 26M0 36L-10 54M0 36L8 54', { shirt: '#43b04a', hat: '#e85d9a' }) +
    `<circle cx="52" cy="80" r="5" fill="#fff"/><circle cx="44" cy="82" r="4" fill="#fff"/>`,
  스키:
    `<path d="M4 40L96 90V96H4Z" fill="#fff"/>` +
    `<g transform="rotate(28 50 60)">` +
    kid(46, 26, 0.8, 'M0 17L14 26M0 17L-6 30M0 36L10 48L6 60M0 36L-4 50L-8 60', { shirt: '#e8553d', hat: '#ffd23f', torso: 'M0 10L0 36' }) +
    `<path d="M24 76H72M20 72C20 76 22 76 24 76" stroke-width="7"/><path d="M24 76H72" stroke="#3b78e6" stroke-width="3"/>` +
    `<path d="M26 80H70" stroke-width="5"/>` +
    `<path d="M58 46L72 72M41 50L36 74" stroke-width="3"/>` +
    `</g>` +
    motion('M8 30l10 5M12 20l10 5'),
  스노보드:
    `<path d="M4 40L96 90V96H4Z" fill="#fff"/>` +
    `<g transform="rotate(28 50 60)">` +
    kid(48, 26, 0.8, 'M0 17L-18 14M0 17L18 20M0 36L-10 46L-8 60M0 36L10 46L10 60', { shirt: '#43b04a', hat: '#e8553d' }) +
    `<rect x="24" y="74" width="52" height="10" rx="5" fill="#8e4fc9"/><path d="M30 79H70" stroke="#ffd23f" stroke-width="3"/>` +
    `</g>` +
    motion('M8 30l10 5M12 20l10 5'),
  스케이트:
    `<path d="M22 14H50C54 14 56 18 56 22V46C62 50 80 54 86 60C92 66 88 74 82 74H22C18 74 16 70 16 66V20C16 16 18 14 22 14Z" fill="#fff"/>` +
    `<path d="M16 26H56" stroke-width="3"/>` +
    `<path d="M40 30L50 34M40 38L50 42M40 46L52 50" stroke="#e85d9a" stroke-width="3"/>` +
    `<path d="M26 74V84M76 74V84" stroke-width="5"/>` +
    `<path d="M10 86H80C88 86 92 82 92 78" stroke-width="9"/><path d="M10 86H80C88 86 92 82 92 78" stroke="#dfe8f5" stroke-width="4"/>` +
    sparkle(92, 92, 5, '#9fd4f5'),
  // ── 운동회·체육 ──
  줄다리기:
    ground(92) +
    tube('M6 54H94', '#e8c77a', 4) +
    `<path d="M50 54L44 70H56Z" fill="#e8553d"/>` +
    kid(20, 32, 0.62, 'M0 17L20 34M0 17L14 36M-6 36L-16 52L-22 60M-6 36L0 60', { shirt: '#e8553d', torso: 'M0 10L-6 36' }) +
    kid(34, 30, 0.62, 'M0 17L18 36M0 17L10 38M-6 36L-16 52L-22 60M-6 36L0 60', { shirt: '#e8553d', torso: 'M0 10L-6 36' }) +
    kid(66, 30, 0.62, 'M0 17L-18 36M0 17L-10 38M6 36L16 52L22 60M6 36L0 60', { shirt: '#3b78e6', torso: 'M0 10L6 36', hair: '#9a5b2e' }) +
    kid(80, 32, 0.62, 'M0 17L-20 34M0 17L-14 36M6 36L16 52L22 60M6 36L0 60', { shirt: '#3b78e6', torso: 'M0 10L6 36', hair: '#9a5b2e' }),
  멀리뛰기:
    `<path d="M4 90H40" stroke="#c9b28a" stroke-width="3"/><rect x="32" y="86" width="10" height="6" fill="#fff"/>` +
    `<path d="M60 90C60 84 96 84 96 90V94H60Z" fill="#f2d28b"/>` +
    `<path d="M40 84C50 56 70 50 84 78" stroke="#3b78e6" stroke-width="4" stroke-dasharray="6 5"/><path d="M78 74L85 80L87 71" stroke="#3b78e6" stroke-width="4"/>` +
    kid(56, 24, 0.85, 'M0 17L18 12M0 17L16 22M0 36L18 38L24 44M0 36L16 46L20 54', { shirt: '#ff9f1a', torso: 'M0 10L0 36' }) +
    motion('M20 40H32M16 52H28'),
  높이뛰기:
    `<rect x="8" y="76" width="84" height="16" rx="3" fill="#3b78e6"/>` +
    `<path d="M16 76V30M84 76V30" stroke-width="4"/><path d="M12 32H88" stroke="#e8553d" stroke-width="4"/>` +
    kid(66, 16, 0.75, 'M0 16L10 30M0 16L6 32M-26 26L-36 34M-26 26L-38 22', { shirt: '#43b04a', torso: 'M0 10C-6 20 -16 24 -26 26' }) +
    `<path d="M50 4C60 4 72 10 76 20" stroke="#3b78e6" stroke-width="4" stroke-dasharray="6 5"/>` +
    motion('M30 50C36 46 44 44 52 46'),
  훌라후프:
    `<path d="M20 52C20 42 80 42 80 52" stroke-width="11"/><path d="M20 52C20 42 80 42 80 52" stroke="#e85d9a" stroke-width="5"/>` +
    kid(50, 16, 0.95, 'M0 17L-16 6M0 17L16 6M0 36L-10 62M0 36L10 62', { shirt: '#ffd23f' }) +
    `<path d="M20 52C20 62 80 62 80 52" stroke-width="11"/><path d="M20 52C20 62 80 62 80 52" stroke="#e85d9a" stroke-width="5"/>` +
    motion('M8 44C4 50 4 56 8 62M92 44C96 50 96 56 92 62') +
    ground(94),
  // ── 공·라켓 운동 ──
  배드민턴:
    ground(94, '#5fc24a') +
    badmintonRacket('translate(40 48) rotate(40) scale(.85)') +
    kid(28, 38, 0.85, 'M0 17L12 11M0 17L-12 26M0 36L-8 60M0 36L8 60', { shirt: '#3b78e6' }) +
    shuttle('translate(76 44) rotate(-130) scale(1.05)') +
    motion('M86 58l6 4M82 66l4 6'),
  탁구:
    `<path d="M4 66L20 52H80L96 66Z" fill="#3a9e47"/><path d="M12 59H88" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M20 70V92M80 70V92" stroke-width="5"/><rect x="4" y="66" width="92" height="5" fill="#2e7a38"/>` +
    `<path d="M50 52V64" stroke-width="3"/><rect x="47" y="46" width="6" height="18" fill="#fff" stroke-width="2.5"/>` +
    kid(24, 18, 0.7, 'M0 17L14 22M0 17L-10 28', { shirt: '#e8553d' }) +
    paddle('translate(36 34) rotate(40) scale(.85)') +
    `<path d="M46 24C58 10 70 16 72 40" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    `<circle cx="72" cy="42" r="5" fill="#ff9f1a"/>`,
  테니스:
    `<path d="M4 88H96V96H4Z" fill="#43b04a" stroke="none"/>` +
    ground(88, '#fff') +
    kid(30, 34, 0.8, 'M0 17L14 14M0 17L-12 26M0 36L-10 58M0 36L10 58', { shirt: '#fff' }) +
    tennisRacket('translate(42 44) rotate(50) scale(.9)') +
    tennisBall(84, 30, 9) +
    motion('M78 46h-8M80 54h-8'),
  야구:
    ground(92) +
    kid(34, 30, 0.9, 'M0 17L14 14M0 17L12 20M0 36L-12 60M0 36L10 60', {
      shirt: '#fff',
      hat: '#3b78e6',
    }) +
    bat('translate(46 44) rotate(-70) scale(.8)') +
    motion('M60 26C66 22 74 22 78 24') +
    baseball(82, 30, 10),
  농구:
    `<rect x="58" y="6" width="36" height="26" rx="2" fill="#fff"/><rect x="68" y="16" width="16" height="12" fill="none" stroke="#e8553d" stroke-width="2.5"/>` +
    `<path d="M66 34L70 50M76 34V50M86 34L82 50M68 42H84" stroke="#9aa6c4" stroke-width="2"/>` +
    `<ellipse cx="76" cy="34" rx="12" ry="3.5" stroke="#e8553d" stroke-width="3.5"/>` +
    ground(94) +
    kid(28, 40, 0.85, 'M0 17L6 0M0 17L14 4M0 36L-8 60M0 36L8 60', { shirt: '#e8553d' }) +
    `<path d="M44 20C50 10 58 8 62 14" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="4 4"/>` +
    basketball(38, 24, 11),
  배구:
    `<path d="M62 30V94" stroke-width="4"/>` +
    `<rect x="62" y="30" width="34" height="18" fill="#fff" stroke-width="3"/>` +
    `<path d="M68 30V48M74 30V48M80 30V48M86 30V48M92 30V48M62 36H96M62 42H96" stroke="#9aa6c4" stroke-width="1.5"/>` +
    `<path d="M62 30H96" stroke-width="4"/>` +
    ground(94, '#e8862e') +
    kid(34, 38, 0.85, 'M0 17L8 0M0 17L14 2M0 36L-8 58M0 36L10 56', { shirt: '#ffd23f' }) +
    volleyball(56, 16, 12) +
    motion('M40 20l6 -2M42 28l6 -2'),
  축구:
    ground(92, '#5fc24a') +
    kid(34, 22, 0.9, 'M0 17L-14 26M0 17L14 24M0 36L-8 62M0 36L18 48L28 54', { shirt: '#3b78e6' }) +
    motion('M52 60h-8M54 70h-8') +
    soccer(70, 64, 16),
  볼링:
    `<path d="M4 90H96" stroke="#c9b28a" stroke-width="3"/>` +
    pin(68, 80, 0.62) +
    pin(84, 80, 0.62) +
    pin(76, 86, 0.66) +
    motion('M6 76h10M8 84h10') +
    bowlingBall(38, 74, 14) +
    kid(22, 22, 0.75, 'M0 17L-12 26M0 17L12 34M0 36L-10 58M0 36L10 58', { shirt: '#e8553d' }),
  골프:
    `<path d="M4 92C30 84 70 84 96 92V96H4Z" fill="#5fc24a"/>` +
    `<path d="M84 88V36" stroke-width="3"/><path d="M84 36L96 42L84 48Z" fill="#e8553d"/><ellipse cx="84" cy="88" rx="5" ry="2" fill="${INK}"/>` +
    kid(30, 26, 0.85, 'M0 17L8 34M0 17L10 34M0 36L-10 60M0 36L10 60', { shirt: '#e85d9a', hat: '#fff' }) +
    `<path d="M38 55L58 84" stroke-width="3.5"/><path d="M56 84H66" stroke-width="6"/>` +
    `<path d="M70 84V88" stroke-width="3"/><circle cx="70" cy="80" r="4" fill="#fff"/>`,
  // ── 무술·몸 운동 ──
  태권도:
    `<ellipse cx="42" cy="92" rx="26" ry="4" fill="#d0d6e6" stroke="none"/>` +
    tube('M44 58L36 90', '#fff', 9) +
    tube('M44 58L64 48L88 44', '#fff', 9) +
    `<ellipse cx="92" cy="44" rx="5" ry="4" fill="${SKIN}"/>` +
    tube('M38 34L46 58', '#fff', 14) +
    tube('M40 38L28 44L22 36', '#fff', 7) +
    tube('M40 38L52 42L58 34', '#fff', 7) +
    `<circle cx="22" cy="33" r="4" fill="${SKIN}"/><circle cx="58" cy="31" r="4" fill="${SKIN}"/>` +
    `<path d="M36 52L54 48M44 50L40 62M46 50L52 60" stroke="${INK}" stroke-width="4"/>` +
    kid(36, 20, 1, '', { hair: '#2b2b3a' }) +
    motion('M70 32l10 -4M72 58l10 2'),
  씨름:
    `<ellipse cx="50" cy="88" rx="46" ry="9" fill="#f2d28b"/>` +
    tube('M26 50L16 84M30 52L32 84', SKIN, 6) +
    tube('M74 50L84 84M70 52L68 84', SKIN, 6) +
    tube('M40 30L26 50', SKIN, 12) +
    tube('M60 30L74 50', SKIN, 12) +
    `<path d="M20 48L32 54M68 54L80 48" stroke="#e8553d" stroke-width="7"/><path d="M68 54L80 48" stroke="#3b78e6" stroke-width="7"/>` +
    tube('M38 34L54 40L70 48', SKIN, 5) +
    tube('M62 34L46 40L30 48', SKIN, 5) +
    `<circle cx="42" cy="24" r="9" fill="${SKIN}"/><path d="M34 20C36 13 46 12 50 18" fill="#2b2b3a"/>` +
    `<circle cx="58" cy="24" r="9" fill="${SKIN}"/><path d="M66 20C64 13 54 12 50 18" fill="#5a3b24"/>`,
  체조:
    `<rect x="10" y="84" width="80" height="10" rx="3" fill="#3b78e6"/>` +
    `<g transform="rotate(180 50 50)">` +
    kid(50, 24, 1, 'M0 17L-12 30M0 17L12 30M0 36L-20 56M0 36L20 56', {
      shirt: '#e85d9a',
      hair: '#5a3b24',
    }) +
    `</g>` +
    sparkle(18, 24, 6) +
    sparkle(84, 20, 5) +
    sparkle(80, 44, 4),
  발레:
    `<ellipse cx="50" cy="94" rx="18" ry="3" fill="#d0d6e6" stroke="none"/>` +
    `<path d="M50 60L50 92M50 60L64 72L50 78" stroke-width="5"/>` +
    `<path d="M50 38C40 22 32 18 36 10M50 38C60 22 68 18 64 10" stroke-width="5"/>` +
    `<path d="M22 60C30 52 70 52 78 60C70 66 30 66 22 60Z" fill="#ff9aa8"/>` +
    `<path d="M44 38H56L58 58H42Z" fill="#e85d9a"/>` +
    `<circle cx="50" cy="28" r="9" fill="${SKIN}"/><circle cx="50" cy="17" r="5" fill="#5a3b24"/><path d="M41 26C42 19 58 19 59 26C54 22 46 22 41 26Z" fill="#5a3b24"/>` +
    dot(47, 29, 1.4) +
    dot(53, 29, 1.4) +
    sparkle(22, 28, 5) +
    sparkle(80, 34, 5),
  요가:
    `<rect x="8" y="80" width="84" height="10" rx="4" fill="#8e4fc9"/>` +
    `<path d="M50 70C38 64 24 70 22 78H78C76 70 62 64 50 70Z" fill="#43b04a"/>` +
    `<path d="M28 76C36 70 44 72 52 76M72 76C64 70 56 72 48 76" stroke-width="3"/>` +
    person(50, 72, 1.3, { hair: '#5a3b24', style: 'bun', shirt: '#43b04a' }) +
    tube('M38 54L28 68', SKIN, 4) +
    tube('M62 54L72 68', SKIN, 4) +
    `<circle cx="28" cy="70" r="3.5" fill="${SKIN}"/><circle cx="72" cy="70" r="3.5" fill="${SKIN}"/>` +
    sparkle(18, 30, 5) +
    sparkle(82, 30, 5),
  // ── 운동 도구 ──
  볼링핀: pin(50, 94, 1.3),
  야구방망이: bat('translate(34 90) rotate(38) scale(1.15)') + baseball(76, 76, 12),
  글러브:
    `<path d="M24 86C14 74 14 54 18 40C20 34 26 34 28 40L30 48L30 22C30 16 38 16 38 22L40 44L42 16C42 10 50 10 50 16L52 44L54 20C54 14 62 14 62 20L62 50L70 38C74 32 82 36 78 42L70 64C66 78 60 86 50 90C40 94 30 92 24 86Z" fill="#c98b4f"/>` +
    `<path d="M30 48L34 58M40 44L42 56M52 44L52 56" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<path d="M24 86C36 82 50 82 58 88" stroke="#9a5b2e" stroke-width="5"/>` +
    baseball(48, 66, 12),
  라켓: tennisRacket('translate(40 94) rotate(20) scale(1.35)') + tennisBall(80, 80, 9),
  셔틀콕: shuttle('translate(50 86) scale(2.2)'),
  골대:
    `<path d="M4 90H96" stroke="#5fc24a" stroke-width="3"/>` +
    `<path d="M14 88L22 32H78L86 88" fill="#fff" stroke="none"/>` +
    `<path d="M22 32L30 76M78 32L70 76M30 76H70" stroke-width="2"/>` +
    `<path d="M${[26, 34, 42, 50, 58, 66, 74].map((x) => `M${x} 32V${x < 30 || x > 70 ? 80 : 76}`).join('').slice(1)}M20 44H80M18 58H82M16 72H84" stroke="#9aa6c4" stroke-width="1.5"/>` +
    `<path d="M12 90V26H88V90" stroke-width="10"/><path d="M12 90V26H88V90" stroke="#fff" stroke-width="5"/>` +
    soccer(50, 78, 11),
  그물: (() => {
    let mesh = '';
    for (let k = 0; k < 6; k++) mesh += `M${14 + k * 14} 18C${10 + k * 14} 50 ${22 + k * 11} 72 ${34 + k * 6} 90`;
    for (let k = 0; k < 5; k++) mesh += `M${14 - k} ${30 + k * 14}Q50 ${38 + k * 16} ${86 + k} ${30 + k * 14}`;
    return (
      `<path d="M14 18C10 50 22 72 34 90H64C76 72 90 50 86 18Z" fill="#e8f6ff" stroke="none"/>` +
      `<g transform="rotate(-15 46 66)"><path d="M36 66C44 58 56 58 60 66C56 74 44 74 36 66Z" fill="#ff9f1a"/><path d="M60 66L68 60V72Z" fill="#ff9f1a"/>${dot(42, 65, 1.8)}</g>` +
      `<g transform="rotate(12 58 44)"><path d="M48 44C56 36 68 36 72 44C68 52 56 52 48 44Z" fill="#3b8fe0"/><path d="M72 44L80 38V50Z" fill="#3b8fe0"/>${dot(54, 43, 1.8)}</g>` +
      `<path d="${mesh}" stroke="#6b3e26" stroke-width="2.5"/>` +
      `<path d="M14 18C10 50 22 72 34 90H64C76 72 90 50 86 18" stroke="#6b3e26" stroke-width="3"/>` +
      `<path d="M8 18H92" stroke-width="7"/><path d="M8 18H92" stroke="#ff9f1a" stroke-width="3"/>` +
      `<circle cx="14" cy="18" r="5" fill="#e8553d"/><circle cx="50" cy="18" r="5" fill="#e8553d"/><circle cx="86" cy="18" r="5" fill="#e8553d"/>`
    );
  })(),
  트로피:
    `<path d="M30 20C12 20 12 46 36 48M70 20C88 20 88 46 64 48" stroke-width="9"/><path d="M30 20C12 20 12 46 36 48M70 20C88 20 88 46 64 48" stroke="#f2c14e" stroke-width="4"/>` +
    `<path d="M26 12H74C74 40 64 56 50 58C36 56 26 40 26 12Z" fill="#ffd23f"/>` +
    `<path d="M36 18C36 32 40 42 46 48" stroke="#fff4b0" stroke-width="4"/>` +
    `<path d="M44 58H56L58 72H42Z" fill="#f2c14e"/>` +
    `<rect x="30" y="72" width="40" height="18" rx="3" fill="#9a5b2e"/><rect x="38" y="77" width="24" height="8" rx="1.5" fill="#ffd23f"/>` +
    sparkle(14, 60, 6) +
    sparkle(86, 62, 6),
  메달: (() => {
    const medal = (x: number, c: string, ribbon: string, dy: number) =>
      `<path d="M${x - 8} 10L${x - 3} ${40 + dy}H${x + 3}L${x + 8} 10Z" fill="${ribbon}"/>` +
      `<circle cx="${x}" cy="${54 + dy}" r="14" fill="${c}"/><circle cx="${x}" cy="${54 + dy}" r="8" stroke-width="2.5"/>`;
    return medal(20, '#b5c0d8', '#3b78e6', 10) + medal(80, '#d68a4a', '#43b04a', 14) + medal(50, '#ffd23f', '#e8553d', 0);
  })(),
  금메달:
    `<path d="M28 6L44 48H56L40 6Z" fill="#e8553d"/><path d="M72 6L56 48H44L60 6Z" fill="#3b78e6"/>` +
    `<circle cx="50" cy="66" r="26" fill="#ffd23f"/><circle cx="50" cy="66" r="17" fill="#f2c14e" stroke-width="3"/>` +
    `<path d="M${poly(50, 66, 10, 5)}Z" fill="#fff4b0" stroke="none"/>` +
    `<path d="M34 58A18 18 0 0 1 42 48" stroke="#fff4b0" stroke-width="4"/>` +
    sparkle(16, 60, 7) +
    sparkle(86, 50, 6) +
    sparkle(84, 86, 5),
};
