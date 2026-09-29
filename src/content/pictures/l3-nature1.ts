// 그림 묶음: 9세 이상 자연 (천체·땅의 변화·재해·물가 식물·꽃·날씨·구름). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 운석은 불꼬리를 달고 땅으로 떨어지는 돌, 소행성은 별 사이에 떠 있는 울퉁불퉁한 돌.
// 빙하는 산골짜기를 흘러내리는 얼음 강, 빙산은 물 아래가 더 큰 떠 있는 얼음. 억새는 언덕의 은빛 이삭, 갈대는 물가의 갈색 이삭.
// 폭우는 비스듬한 굵은 비와 넘치는 물, 장대비는 땅까지 곧게 내리꽂는 긴 빗줄기. 일출은 산 위로 오르는 해(위 화살표), 일몰은 바다로 지는 해(아래 화살표).
import { dot, blob, sparkle, tube, drop } from '../pictureKit.ts';

const f1 = (n: number) => +n.toFixed(1);
const NIGHT = '#26356b';

/** 네모 바탕 (밤하늘·낮 하늘) */
const bg = (fill: string) => `<rect x="5" y="5" width="90" height="90" rx="14" fill="${fill}"/>`;
const night = (fill = NIGHT) => bg(fill);
const sky = (fill = '#bfe6ff') => bg(fill);
/** 바탕 테두리를 다시 그어 가장자리를 깔끔하게 */
const frame = () => `<rect x="5" y="5" width="90" height="90" rx="14"/>`;
/** 네모 바탕의 아래쪽 (y부터 바닥까지, 둥근 모서리에 맞춤) */
const bottom = (y: number, fill: string, top = `M5 ${y}H95`) =>
  `<path d="${top}V81C95 89 89 95 81 95H19C11 95 5 89 5 81Z" fill="${fill}"/>`;

/** 5각 별 */
function star(x: number, y: number, r: number, fill = '#ffd23f', sw = 2.5): string {
  const pts = Array.from({ length: 10 }, (_, k) => {
    const a = ((-90 + k * 36) * Math.PI) / 180;
    const rr = k % 2 ? r * 0.45 : r;
    return `${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`;
  });
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke-width="${sw}"/>`;
}

const twinkles = (pts: [number, number, number][]) => pts.map(([x, y, r]) => sparkle(x, y, r, '#fff')).join('');

/** 눈송이 (여섯 갈래) */
function flake(x: number, y: number, r: number, w = 4): string {
  let d = '';
  for (let k = 0; k < 3; k++) {
    const a = (k * Math.PI) / 3 + Math.PI / 2;
    const dx = r * Math.cos(a);
    const dy = r * Math.sin(a);
    d += `M${f1(x - dx)} ${f1(y - dy)}L${f1(x + dx)} ${f1(y + dy)}`;
  }
  return tube(d, '#fff', w);
}

/** 빗줄기 (비스듬한 굵은 선) */
const streaks = (pts: [number, number][], len = 14, fill = '#4aa8f0', w = 4, slant = 0.35) =>
  pts.map(([x, y]) => tube(`M${x} ${y}L${f1(x - len * slant)} ${y + len}`, fill, w)).join('');

/** 해 (빛살 + 동그라미) */
function sunDisc(x: number, y: number, r: number, n = 8, face = false): string {
  const rays = Array.from({ length: n }, (_, k) => {
    const a = (k * 2 * Math.PI) / n;
    const p = (d: number) => `${f1(x + d * Math.cos(a))} ${f1(y + d * Math.sin(a))}`;
    return `M${p(r + 5)}L${p(r + 12)}`;
  }).join('');
  return (
    `<path d="${rays}" stroke="#ff9f1a" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd23f"/>` +
    (face ? dot(x - r * 0.35, y - r * 0.1, 2.2) + dot(x + r * 0.35, y - r * 0.1, 2.2) + `<path d="M${f1(x - r * 0.3)} ${f1(y + r * 0.3)}q${f1(r * 0.3)} ${f1(r * 0.25)} ${f1(r * 0.6)} 0" stroke-width="2.5"/>` : '')
  );
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

/** 나선 선 */
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

/** 둥근 꽃잎 n장 꽃 (가운데 cx, cy / 꽃잎 거리 d, 꽃잎 반지름 pr) */
function roundFlower(cx: number, cy: number, n: number, d: number, pr: number, fill: string, center: string, cr: number, a0 = -90): string {
  const ps = Array.from({ length: n }, (_, k) => {
    const a = ((a0 + (k * 360) / n) * Math.PI) / 180;
    return `<circle cx="${f1(cx + d * Math.cos(a))}" cy="${f1(cy + d * Math.sin(a))}" r="${pr}" fill="${fill}"/>`;
  }).join('');
  return ps + `<circle cx="${cx}" cy="${cy}" r="${cr}" fill="${center}"/>`;
}

/** 뾰족한 꽃잎 n장 (길이 len, 폭 w) */
function pointPetals(cx: number, cy: number, n: number, len: number, w: number, fill: string, a0 = -90, sw = 3.5): string {
  return Array.from({ length: n }, (_, k) => {
    const a = a0 + (k * 360) / n + 90;
    return `<path d="M${cx} ${cy}C${f1(cx - w)} ${f1(cy - len * 0.35)} ${f1(cx - w * 0.6)} ${f1(cy - len * 0.8)} ${cx} ${f1(cy - len)}C${f1(cx + w * 0.6)} ${f1(cy - len * 0.8)} ${f1(cx + w)} ${f1(cy - len * 0.35)} ${cx} ${cy}Z" fill="${fill}" stroke-width="${sw}" transform="rotate(${f1(a)} ${cx} ${cy})"/>`;
  }).join('');
}

/** 긴 잎 (아래 x0,y0에서 끝 x1,y1로, 폭 w) */
function bladeLeaf(x0: number, y0: number, x1: number, y1: number, w: number, fill = '#43b04a'): string {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const nx = (-dy / L) * w;
  const ny = (dx / L) * w;
  return `<path d="M${x0} ${y0}Q${f1(mx + nx)} ${f1(my + ny)} ${x1} ${y1}Q${f1(mx - nx)} ${f1(my - ny)} ${x0} ${y0}Z" fill="${fill}"/>`;
}

/** 하트 모양 잎 (제비꽃) */
const heartLeaf = (x: number, y: number, s: number, rot = 0) =>
  `<path d="M0 0C-10 -6 -16 -16 -10 -24C-6 -28 -2 -26 0 -22C2 -26 6 -28 10 -24C16 -16 10 -6 0 0Z" fill="#43b04a" stroke-width="${f1(3.5 / s)}" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"/>`;

/** 둥실 구름 */
const cloud = (fill: string, cs: [number, number, number][]) => blob(fill, cs);

/** 무지개 띠 (가운데 cx, 바닥 y, 가장 바깥 반지름 r — 세로는 1.5배, 띠 굵기 w) */
function rainbow(cx: number, y: number, r: number, w: number): string {
  const cols = ['#e8553d', '#ff9f1a', '#ffd23f', '#43b04a', '#3b8fe0', '#8e4fc9'];
  const arc = (rr: number) => `M${f1(cx - rr)} ${y}A${f1(rr)} ${f1(rr * 1.5)} 0 0 1 ${f1(cx + rr)} ${y}`;
  const outer = r + w / 2;
  const inner = r - w * cols.length + w / 2;
  return (
    `<path d="${arc(r - (w * (cols.length - 1)) / 2)}" stroke-width="${f1(w * cols.length + 3.5)}"/>` +
    cols.map((c, i) => `<path d="${arc(r - w * i)}" stroke="${c}" stroke-width="${f1(w + 0.4)}"/>`).join('') +
    `<path d="${arc(outer)}" stroke-width="1"/><path d="${arc(inner)}" stroke-width="1"/>`
  );
}

/** 뾰족한 산 (눈 덮인 꼭대기) */
const peak = (x: number, top: number, w: number, base: number, fill: string) =>
  `<path d="M${x - w} ${base}L${x} ${top}L${x + w} ${base}Z" fill="${fill}"/>` +
  `<path d="M${f1(x - w * 0.3)} ${f1(top + (base - top) * 0.3)}L${x} ${top}L${f1(x + w * 0.3)} ${f1(top + (base - top) * 0.3)}L${f1(x + w * 0.12)} ${f1(top + (base - top) * 0.24)}L${x} ${f1(top + (base - top) * 0.32)}L${f1(x - w * 0.12)} ${f1(top + (base - top) * 0.24)}Z" fill="#fff"/>`;

/** 이삭 달린 줄기 (억새·갈대): 줄기 끝 x,y, 휘는 방향 bend */
function plume(x0: number, y0: number, x: number, y: number, fill: string, len = 18): string {
  const d = [-0.4, 0.1, 0.6, 1.1]
    .map((k) => `M${x} ${y}Q${f1(x + len * k * 0.9)} ${f1(y + 2)} ${f1(x + len * (k * 0.7 + 0.3))} ${f1(y + len * (1 - Math.abs(k - 0.35) * 0.4))}`)
    .join('');
  return `<path d="M${x0} ${y0}Q${x0} ${f1((y0 + y) / 2)} ${x} ${y}" stroke="#a8844a" stroke-width="3.5"/>` + tube(d, fill, 3.5);
}

export const PICS: Record<string, string> = {
  // ── 하늘과 우주 ──
  일식:
    night('#1a2350') +
    `<path d="${Array.from({ length: 12 }, (_, k) => {
      const a = (k * Math.PI) / 6;
      return `M${f1(50 + 33 * Math.cos(a))} ${f1(50 + 33 * Math.sin(a))}L${f1(50 + 43 * Math.cos(a))} ${f1(50 + 43 * Math.sin(a))}`;
    }).join('')}" stroke="#ffd23f" stroke-width="5"/>` +
    `<circle cx="50" cy="50" r="30" fill="#ffd23f"/>` +
    `<circle cx="52" cy="51" r="26" fill="#10152e"/>` +
    sparkle(30, 34, 9, '#fff') +
    twinkles([
      [14, 84, 3],
      [86, 14, 3],
    ]) +
    frame(),
  월식:
    night('#1a2350') +
    `<circle cx="50" cy="50" r="32" fill="#fff1b8"/>` +
    `<circle cx="36" cy="40" r="5" fill="#f2dc8a" stroke-width="2.5"/><circle cx="40" cy="64" r="4" fill="#f2dc8a" stroke-width="2.5"/>` +
    `<path d="M68.8 75.9A32 32 0 0 0 47.2 18.1A32 32 0 0 0 68.8 75.9Z" fill="#c24a34"/>` +
    `<circle cx="66" cy="54" r="5" fill="#9c3526" stroke-width="2.5"/><circle cx="58" cy="32" r="3.5" fill="#9c3526" stroke-width="2.5"/>` +
    `<circle cx="50" cy="50" r="32"/>` +
    twinkles([
      [14, 16, 3.5],
      [86, 86, 3.5],
      [86, 16, 2.5],
    ]) +
    frame(),
  오로라:
    night('#1a2350') +
    `<path d="M5 40C20 18 34 36 50 18S78 20 95 10V36C78 44 66 40 52 50S22 50 5 66Z" fill="#4fd6a0" stroke="none"/>` +
    `<path d="M5 66C22 50 38 52 52 50S78 44 95 36V52C78 58 66 56 52 64S22 66 5 80Z" fill="#a8f0c8" stroke="none"/>` +
    `<path d="M5 30C22 10 36 26 50 10L60 6C44 30 26 22 5 44Z" fill="#e87fd0" stroke="none"/>` +
    `<path d="M20 30V58M34 26V54M48 22V52M62 22V48M76 18V44M88 14V40" stroke="#dfffe8" stroke-width="3"/>` +
    bottom(76, '#fff', 'M5 80C30 70 60 74 95 72') +
    `<path d="M18 80L24 64L30 80Z" fill="#2f8a3a"/><path d="M72 76L79 58L86 76Z" fill="#2f8a3a"/>` +
    twinkles([
      [80, 26, 3],
      [16, 16, 3],
    ]) +
    frame(),
  수성:
    night() +
    `<path d="M5 26L9 20M5 74L9 80M26 32L32 26M26 68L32 74M30 50H37" stroke="#ff9f1a" stroke-width="5"/>` +
    `<path d="M5 26A24 24 0 0 1 5 74Z" fill="#ffd23f"/>` +
    `<circle cx="64" cy="52" r="27" fill="#a4aec4"/>` +
    band(64, 52, 27, 60, 72, '#8e99b3') +
    `<circle cx="56" cy="42" r="6" fill="#7f8aa3" stroke-width="2.5"/><circle cx="74" cy="60" r="7" fill="#7f8aa3" stroke-width="2.5"/>` +
    `<circle cx="72" cy="36" r="3.5" fill="#7f8aa3" stroke-width="2.5"/><circle cx="54" cy="66" r="3.5" fill="#7f8aa3" stroke-width="2.5"/>` +
    `<circle cx="64" cy="52" r="27"/>` +
    twinkles([
      [84, 14, 3],
      [30, 88, 3],
    ]) +
    frame(),
  금성:
    night() +
    `<circle cx="50" cy="50" r="42" fill="#3a4a8a" stroke="none"/>` +
    `<circle cx="50" cy="50" r="34" fill="#ffd98a"/>` +
    `<path d="M20 40C32 32 44 44 58 36S78 30 82 38M18 56C30 50 42 60 56 54S74 48 84 54M24 70C36 64 48 74 62 68S76 64 78 68" stroke="#e8a85c" stroke-width="4"/>` +
    `<circle cx="50" cy="50" r="34"/>` +
    sparkle(84, 16, 7, '#fff') +
    twinkles([
      [14, 86, 3],
      [14, 14, 3],
    ]) +
    frame(),
  천왕성:
    night() +
    `<g transform="rotate(12 50 52)">` +
    `<ellipse cx="50" cy="52" rx="11" ry="42" stroke-width="11"/><ellipse cx="50" cy="52" rx="11" ry="42" stroke="#e2fbfb" stroke-width="5"/>` +
    `</g>` +
    `<circle cx="50" cy="52" r="26" fill="#8fe3e8"/>` +
    band(50, 52, 26, 36, 42, '#b8f0f2') +
    `<circle cx="50" cy="52" r="26"/>` +
    `<g transform="rotate(12 50 52)">` +
    `<path d="M50 10A11 42 0 0 1 50 94" stroke-width="11"/><path d="M50 10A11 42 0 0 1 50 94" stroke="#e2fbfb" stroke-width="5"/>` +
    `</g>` +
    twinkles([
      [16, 18, 3.5],
      [84, 84, 3.5],
    ]) +
    frame(),
  해왕성:
    night() +
    `<circle cx="50" cy="50" r="36" fill="#3b6fe0"/>` +
    band(50, 50, 36, 28, 34, '#5b8ff0') +
    band(50, 50, 36, 60, 68, '#2f58c0') +
    `<ellipse cx="40" cy="46" rx="10" ry="6" fill="#1f3f99" stroke-width="2.5"/>` +
    `<path d="M52 42H68M30 58H44M58 76H70" stroke="#fff" stroke-width="4"/>` +
    `<circle cx="50" cy="50" r="36"/>` +
    twinkles([
      [14, 14, 3.5],
      [88, 88, 3],
    ]) +
    frame(),
  운석:
    sky('#bfe6ff') +
    bottom(80, '#8fd67a', 'M5 80C30 76 70 76 95 80') +
    `<ellipse cx="34" cy="84" rx="16" ry="4" fill="#5a8f4a"/>` +
    `<path d="M40 50C52 34 72 14 94 8C88 30 70 48 54 62Z" fill="#ff9f1a"/>` +
    `<path d="M46 52C56 40 70 26 84 18C80 32 68 46 54 56Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M24 50C22 40 30 32 40 34C50 30 60 38 58 50C60 60 50 68 40 66C30 68 22 60 24 50Z" fill="#7a6553"/>` +
    `<circle cx="36" cy="46" r="4" fill="#5a4838" stroke-width="2.5"/><circle cx="48" cy="56" r="3.5" fill="#5a4838" stroke-width="2.5"/><circle cx="48" cy="42" r="2.5" fill="#5a4838" stroke-width="2"/>` +
    `<path d="M14 72L20 68M24 78L28 72" stroke="#9aa6c4" stroke-width="3"/>` +
    frame(),
  분화구:
    night('#1a2350') +
    bottom(40, '#b4bdd0', 'M5 42C30 36 70 36 95 42') +
    `<ellipse cx="50" cy="66" rx="40" ry="20" fill="#dfe4ee"/>` +
    `<ellipse cx="50" cy="68" rx="30" ry="13" fill="#7f8aa3"/>` +
    `<path d="M22 66C30 58 70 58 78 66C70 62 30 62 22 66Z" fill="#5f6a85" stroke="none"/>` +
    `<ellipse cx="18" cy="48" rx="7" ry="3" fill="#8e99b3" stroke-width="2.5"/><ellipse cx="84" cy="50" rx="6" ry="2.5" fill="#8e99b3" stroke-width="2.5"/>` +
    twinkles([
      [20, 18, 3.5],
      [50, 14, 2.5],
      [80, 22, 3.5],
    ]) +
    frame(),
  용암:
    sky('#ffd9a0') +
    `<path d="M22 50L38 16H62L78 50Z" fill="#5a3b24"/>` +
    `<path d="M38 16L42 24C44 28 48 26 48 22C50 28 56 28 56 22C58 26 62 24 62 16Z" fill="#ff7a1a"/>` +
    `<path d="M40 22C38 34 30 40 22 50H5V81C5 89 11 95 19 95H81C89 95 95 89 95 81V50H78C70 40 62 34 60 22C54 30 46 30 40 22Z" fill="#ff7a1a"/>` +
    `<path d="M5 50H22L30 42M95 50H78L70 42" stroke-width="3.5"/>` +
    `<path d="M16 62C30 58 40 66 54 62S78 58 86 64M12 80C26 76 40 84 56 80S80 76 90 82M44 32C42 40 46 46 50 50" stroke="#ffd23f" stroke-width="5"/>` +
    `<path d="M14 66C16 62 24 62 26 66C24 70 16 70 14 66ZM66 84C68 79 78 79 80 84C78 88 68 88 66 84ZM76 60C78 57 84 57 86 60C84 63 78 63 76 60Z" fill="#5a3b24" stroke-width="2.5"/>` +
    `<circle cx="44" cy="72" r="3.5" fill="#ffd23f" stroke-width="2.5"/><circle cx="30" cy="86" r="3" fill="#ffd23f" stroke-width="2.5"/><circle cx="60" cy="66" r="2.5" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M42 12C44 6 50 6 52 10C56 6 62 8 60 14" stroke="#9aa6c4" stroke-width="3"/>` +
    frame(),
  // ── 땅의 변화와 재해 ──
  지진:
    sky('#dff4ff') +
    bottom(70, '#b98a5a') +
    `<g transform="rotate(-7 50 64)"><path d="M28 66V42L50 26L72 42V66Z" fill="#ffe2a0"/><path d="M22 46L50 22L78 46" stroke="#e8553d" stroke-width="7"/>` +
    `<rect x="44" y="50" width="12" height="16" fill="#9a5b2e"/><rect x="32" y="44" width="9" height="9" fill="#7ec8f0"/><rect x="60" y="44" width="9" height="9" fill="#7ec8f0"/></g>` +
    `<path d="M40 70L46 78L40 84L48 90L44 95" stroke-width="4"/>` +
    `<path d="M10 40q4-4 0-8t0-8M16 58q4-4 0-8t0-8M90 40q-4-4 0-8t0-8M84 58q-4-4 0-8t0-8" stroke="#3b78e6" stroke-width="3.5"/>` +
    `<path d="M12 80H24M64 82H84" stroke="#8a5a30" stroke-width="3"/>` +
    frame(),
  홍수:
    sky('#aebfd8') +
    cloud('#8a96b0', [
      [22, 18, 10],
      [38, 14, 11],
      [56, 18, 9],
    ]) +
    `<path d="M26 72V46L48 30L70 46V72Z" fill="#ffe2a0"/><path d="M20 50L48 26L76 50" stroke="#e8553d" stroke-width="7"/>` +
    `<rect x="42" y="44" width="12" height="11" fill="#7ec8f0"/>` +
    `<rect x="80" y="54" width="5" height="20" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [82, 48, 9],
      [88, 56, 6],
    ]) +
    bottom(60, '#4a90e2', 'M5 62q7.5-5 15 0t15 0t15 0t15 0t15 0t15 0') +
    `<path d="M14 74q5-3 10 0M46 80q5-3 10 0M70 72q5-3 10 0M26 88q5-3 10 0" stroke="#dff4ff" stroke-width="3"/>` +
    `<circle cx="18" cy="60" r="5" fill="#ff5c70" stroke-width="2.5"/>` +
    frame(),
  가뭄:
    sky('#fff1b8') +
    sunDisc(50, 24, 12, 10) +
    bottom(52, '#d9a066', 'M5 54C30 50 70 50 95 54') +
    `<path d="M5 66L22 62L30 72L46 66L54 78L70 70L78 60L95 64M22 62L18 54M30 72L24 88M46 66L44 54M54 78L50 95M70 70L80 86M78 60L84 54" stroke="#8a5a30" stroke-width="3"/>` +
    tube('M64 74C64 64 66 60 72 56', '#9a8a40', 3) +
    `<path d="M72 56C78 58 80 64 78 70C74 66 72 62 72 56Z" fill="#c9b060"/>` +
    `<path d="M66 62C60 60 56 64 56 70C60 68 64 66 66 62Z" fill="#c9b060"/>` +
    frame(),
  산사태:
    sky('#dff4ff') +
    `<path d="M5 22C24 22 40 30 56 50S80 80 95 84V81C95 89 89 95 81 95H19C11 95 5 89 5 81Z" fill="#5fc24a"/>` +
    `<path d="M20 24C34 34 40 44 48 58C56 70 68 78 88 90L91 94H50C40 84 32 72 26 58C22 46 16 34 20 24Z" fill="#9a5b2e"/>` +
    `<path d="M26 34C32 46 36 60 44 72M34 30C40 42 46 56 58 68" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="58" cy="80" rx="7" ry="6" fill="#8a96b0"/><ellipse cx="44" cy="62" rx="6" ry="5" fill="#a4aec4"/><ellipse cx="72" cy="88" rx="5" ry="4" fill="#8a96b0"/>` +
    `<path d="M66 74L70 70M52 56L56 52M78 84L82 80" stroke="#9aa6c4" stroke-width="3"/>` +
    tube('M70 30C80 34 86 42 88 52', '#3b78e6', 5) +
    `<path d="M80 50L89 62L95 48Z" fill="#3b78e6" stroke-width="2.5"/>` +
    frame(),
  빙하:
    sky('#bfe6ff') +
    peak(22, 14, 22, 72, '#8a96b0') +
    peak(78, 12, 22, 72, '#8a96b0') +
    `<path d="M40 30C44 26 56 26 60 30L70 72H30Z" fill="#e8f6ff"/>` +
    `<path d="M44 40L48 46M56 44L52 52M40 58L46 62M60 56L54 64" stroke="#7ec8f0" stroke-width="3"/>` +
    bottom(72, '#3b8fe0') +
    `<path d="M28 72H72V80H28Z" fill="#bfe6ff"/>` +
    `<path d="M36 72V80M46 72V80M56 72V80M64 72V80" stroke="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M16 86q5-3 10 0M72 88q5-3 10 0" stroke="#dff4ff" stroke-width="3"/>` +
    `<path d="M80 80L86 76L90 80Z" fill="#fff" stroke-width="2.5"/>` +
    frame(),
  빙산:
    sky('#dff4ff') +
    bottom(38, '#2f6fc4') +
    `<path d="M26 40C24 58 20 72 30 86C44 94 62 92 72 84C80 70 76 54 74 40Z" fill="#7ec8f0"/>` +
    `<path d="M26 40L38 18L46 24L54 10L66 26L74 40Z" fill="#fff"/>` +
    `<path d="M40 30L44 36M58 22L56 32" stroke="#7ec8f0" stroke-width="3"/>` +
    `<path d="M5 38H95" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M10 50q4-3 8 0M82 56q4-3 8 0M12 76q4-3 8 0" stroke="#bfe6ff" stroke-width="2.5"/>` +
    frame(),
  협곡:
    sky('#bfe6ff') +
    `<path d="M36 18H64V52H36Z" fill="#f2b06a"/><path d="M36 30H64M36 42H64" stroke="#d9804a" stroke-width="3"/>` +
    `<path d="M5 24H36L42 50L40 95H19C11 95 5 89 5 81Z" fill="#e8862e"/>` +
    `<path d="M95 20H64L58 50L60 95H81C89 95 95 89 95 81Z" fill="#d9652e"/>` +
    `<path d="M5 36H38M5 50H41M5 66H41M5 80H40M95 32H62M95 46H59M95 62H59M95 78H60" stroke="#b8452e" stroke-width="3.5"/>` +
    `<path d="M42 50C44 66 42 80 38 95H62C58 80 56 66 58 50Z" fill="#4aa8f0"/>` +
    `<path d="M46 70q3-2 6 0M44 86q4-2 8 0" stroke="#dff4ff" stroke-width="2.5"/>` +
    frame(),
  오아시스:
    sky('#ffe8b0') +
    `<path d="M5 56C24 44 44 50 60 54S84 48 95 52V81C95 89 89 95 81 95H19C11 95 5 89 5 81Z" fill="#f2c14e"/>` +
    `<ellipse cx="50" cy="76" rx="32" ry="10" fill="#3b8fe0"/>` +
    `<path d="M36 76q5-3 10 0M56 78q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    tube('M28 72C28 56 32 42 38 32', '#9a5b2e', 5) +
    tube('M74 70C74 58 70 48 66 40', '#9a5b2e', 4) +
    [
      [38, 32, 1.1, [-170, -130, -70, -30, 15]],
      [66, 40, 0.9, [-150, -40, 0, 30]],
    ]
      .map(([x, y, sc, angs]) =>
        (angs as number[])
          .map((a) => `<path d="M0 0C4 -10 20 -14 30 -4C22 -2 10 2 0 0Z" fill="#43b04a" stroke-width="${f1(3 / (sc as number))}" transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"/>`)
          .join(''),
      )
      .join('') +
    `<path d="M12 86l3-6 3 6M84 88l3-6 3 6" stroke="#3a9e47" stroke-width="3"/>` +
    frame(),
  모래톱:
    sky('#3b8fe0') +
    `<path d="M10 62C18 48 40 44 58 46S88 50 92 58C88 66 70 68 50 68S16 70 10 62Z" fill="#ffe2a0"/>` +
    `<path d="M10 62C16 56 30 54 42 56" stroke="#fff" stroke-width="3"/>` +
    `<path d="M10 24q5-3 10 0M70 20q5-3 10 0M18 84q5-3 10 0M64 86q5-3 10 0M40 30q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    // 갈매기
    `<ellipse cx="62" cy="48" rx="9" ry="6" fill="#fff"/><circle cx="68" cy="42" r="4.5" fill="#fff"/>` +
    `<path d="M72 42L77 43L72 45Z" fill="#ff9f1a" stroke-width="2"/>` +
    dot(69, 41, 1.4) +
    `<path d="M54 46L62 46" stroke="#8a96b0" stroke-width="3"/><path d="M60 54V58M64 54V58" stroke="#ff9f1a" stroke-width="2.5"/>` +
    `<path d="M30 58C30 54 36 54 36 58Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    dot(44, 60, 1.6, '#c9a24e') +
    dot(78, 58, 1.6, '#c9a24e') +
    frame(),
  화석:
    `<path d="M10 30C10 16 24 8 50 8S92 14 92 34V72C92 88 78 94 50 94S8 88 8 72Z" fill="#c9b89a"/>` +
    `<circle cx="50" cy="52" r="32" fill="#e8d7b0"/>` +
    `<path d="${spiralD(50, 52, 30, 3, 3, 1, 0)}" stroke-width="4"/>` +
    Array.from({ length: 14 }, (_, k) => {
      const a = (k * 2 * Math.PI) / 14;
      return `M${f1(50 + 20 * Math.cos(a))} ${f1(52 + 20 * Math.sin(a))}L${f1(50 + 30 * Math.cos(a))} ${f1(52 + 30 * Math.sin(a))}`;
    })
      .join('')
      .replace(/^/, '<path d="')
      .concat('" stroke="#a89468" stroke-width="2.5"/>') +
    `<circle cx="50" cy="52" r="32"/>` +
    `<path d="M16 22l4 4M84 80l-4-4" stroke="#a89468" stroke-width="3"/>`,

  // ── 풀과 나무 ──
  억새:
    sky('#dff4ff') +
    bottom(72, '#e8b060', 'M5 76C30 66 70 66 95 72') +
    plume(20, 92, 16, 22, '#f4f1e6', 20) +
    plume(38, 92, 36, 14, '#f4f1e6', 22) +
    plume(56, 92, 58, 18, '#f4f1e6', 22) +
    plume(74, 92, 78, 26, '#f4f1e6', 20) +
    bladeLeaf(26, 92, 8, 60, 4, '#c9a24e') +
    bladeLeaf(66, 92, 90, 58, 4, '#c9a24e') +
    frame(),
  갈대:
    sky('#dff4ff') +
    bottom(70, '#4a90e2') +
    `<path d="M12 80q5-3 10 0M70 86q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    tube('M24 88V26M44 88V16M62 88V22M80 88V32', '#8a6a3a', 3) +
    [
      [24, 26],
      [44, 16],
      [62, 22],
      [80, 32],
    ]
      .map(([x, y]) => `<path d="M${x} ${y - 2}C${x - 10} ${y + 4} ${x - 8} ${y + 20} ${x} ${y + 24}C${x + 8} ${y + 20} ${x + 10} ${y + 4} ${x} ${y - 2}Z" fill="#a0785a"/><path d="M${x} ${y + 4}V${y + 18}" stroke="#c9a47a" stroke-width="2.5"/>`)
      .join('') +
    bladeLeaf(24, 70, 8, 44, 3.5, '#6aa84f') +
    bladeLeaf(44, 72, 30, 50, 3.5, '#6aa84f') +
    bladeLeaf(62, 70, 76, 48, 3.5, '#6aa84f') +
    frame(),
  부들:
    sky('#dff4ff') +
    bottom(74, '#4a90e2') +
    `<path d="M12 84q5-3 10 0M72 88q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    bladeLeaf(40, 86, 16, 30, 4, '#43b04a') +
    bladeLeaf(58, 86, 86, 26, 4, '#43b04a') +
    tube('M32 88V14M52 88V8M70 88V20', '#5fa04a', 3) +
    [
      [32, 30],
      [52, 24],
      [70, 36],
    ]
      .map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="28" rx="6" fill="#8a4b2a"/><path d="M${x - 2} ${y + 6}V${y + 20}" stroke="#b06a3e" stroke-width="2.5"/>`)
      .join('') +
    frame(),
  나이테:
    `<circle cx="50" cy="50" r="42" fill="#9a5b2e"/>` +
    `<circle cx="50" cy="50" r="35" fill="#f2c98a"/>` +
    `<g stroke="#c98b4f" stroke-width="3"><circle cx="50" cy="50" r="29"/><circle cx="51" cy="50" r="23"/><circle cx="51" cy="51" r="17"/><circle cx="52" cy="51" r="11"/></g>` +
    dot(52, 51, 4, '#9a5b2e') +
    `<path d="M50 50L22 30" stroke="#b07a4a" stroke-width="2.5"/>` +
    `<circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="35"/>`,
  그루터기:
    sky('#dff4ff') +
    bottom(78, '#8fd67a', 'M5 80C30 74 70 74 95 80') +
    `<path d="M22 40V78C16 82 10 86 8 90H34C36 86 40 84 44 86C50 84 56 84 60 88H92C88 84 82 82 78 78V40Z" fill="#9a5b2e"/>` +
    `<path d="M32 50V70M50 46V74M66 52V68" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="50" cy="40" rx="28" ry="12" fill="#f2c98a"/>` +
    `<ellipse cx="50" cy="40" rx="18" ry="7.5" stroke="#c98b4f" stroke-width="3"/><ellipse cx="50" cy="40" rx="8" ry="3.5" stroke="#c98b4f" stroke-width="3"/>` +
    tube('M80 60C84 56 86 52 86 48', '#43b04a', 2.5) +
    `<path d="M86 48C92 46 94 40 92 36C86 38 84 44 86 48Z" fill="#5fc24a" stroke-width="2.5"/>` +
    frame(),

  // ── 꽃 ──
  채송화:
    bottom(70, '#9a5b2e', 'M5 72C30 66 70 66 95 72') +
    [
      [14, 76, -40],
      [22, 70, -10],
      [36, 74, 20],
      [48, 66, -20],
      [62, 72, 30],
      [74, 66, -30],
      [86, 74, 20],
      [30, 60, 10],
      [66, 58, -10],
    ]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="9" fill="#5fc24a" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join('') +
    roundFlower(24, 44, 5, 8, 7, '#ff5c8a', '#ffd23f', 4.5) +
    roundFlower(50, 36, 5, 9, 8, '#ffd23f', '#ff9f1a', 5) +
    roundFlower(76, 44, 5, 8, 7, '#ff9f1a', '#ffd23f', 4.5) +
    roundFlower(38, 60, 5, 6, 5.5, '#e8553d', '#ffd23f', 3.5) +
    roundFlower(62, 60, 5, 6, 5.5, '#e85d9a', '#ffd23f', 3.5),
  백합:
    tube('M50 94V56', '#3a9e47', 5) +
    bladeLeaf(50, 88, 22, 68, 5) +
    bladeLeaf(50, 80, 80, 62, 5) +
    pointPetals(50, 42, 6, 36, 12, '#fff', -90) +
    `<path d="M50 42V20M50 42L38 24M50 42L62 24" stroke="#8fbf4a" stroke-width="2.5"/>` +
    dot(50, 19, 3.5, '#ff7a1a') +
    dot(37, 23, 3.5, '#ff7a1a') +
    dot(63, 23, 3.5, '#ff7a1a') +
    `<path d="M50 42L50 32M50 42L42 50M50 42L58 50" stroke="#f2e48a" stroke-width="3"/>`,
  수선화:
    tube('M50 94V58', '#3a9e47', 5) +
    bladeLeaf(46, 94, 22, 50, 5) +
    bladeLeaf(54, 94, 80, 52, 5) +
    pointPetals(50, 38, 6, 30, 14, '#fff3a0', -90) +
    `<circle cx="50" cy="38" r="14" fill="#ff9f1a"/>` +
    `<path d="M38 36q3-4 6 0t6 0t6 0t6 0" stroke="#e8662e" stroke-width="2.5"/>` +
    `<circle cx="50" cy="38" r="6" fill="#ffd23f"/>`,
  제비꽃:
    heartLeaf(24, 92, 1.3, -20) +
    heartLeaf(76, 92, 1.3, 20) +
    heartLeaf(50, 94, 1.1, 0) +
    tube('M30 86C30 70 26 58 26 44M50 86C50 66 52 48 56 30M70 86C72 72 76 62 76 54', '#43b04a', 3) +
    [
      [26, 42, 0.8],
      [56, 28, 1],
      [76, 52, 0.75],
    ]
      .map(
        ([x, y, s]) =>
          `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3 / s)}">` +
          `<ellipse cx="-7" cy="-10" rx="7" ry="11" fill="#8e4fc9" transform="rotate(-20 -7 -10)"/><ellipse cx="7" cy="-10" rx="7" ry="11" fill="#8e4fc9" transform="rotate(20 7 -10)"/>` +
          `<ellipse cx="-12" cy="2" rx="9" ry="6" fill="#a45cf0"/><ellipse cx="12" cy="2" rx="9" ry="6" fill="#a45cf0"/>` +
          `<ellipse cx="0" cy="12" rx="9" ry="10" fill="#a45cf0"/>` +
          `<circle cx="0" cy="2" r="4" fill="#fff"/><circle cx="0" cy="2" r="1.8" fill="#ffd23f" stroke="none"/></g>`,
      )
      .join(''),
  할미꽃:
    bottom(84, '#8fd67a', 'M5 86C30 82 70 82 95 86') +
    `<path d="M16 86C12 76 14 68 22 66C24 74 22 80 16 86ZM84 86C88 76 86 68 78 66C76 74 78 80 84 86Z" fill="#8fbf8f"/>` +
    tube('M40 88C40 60 44 30 58 24C68 20 72 28 70 36', '#8fa878', 4) +
    `<path d="M38 70l-4-2M42 56l-4-2M44 42l-4-2M50 30l-3-3M44 64l4-2M46 48l4-2" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M58 38C58 34 64 32 70 34S82 34 82 38C84 50 80 62 72 66C68 64 62 64 60 66C54 60 54 48 58 38Z" fill="#9c2a5a"/>` +
    `<path d="M62 60L64 70M68 62V72M74 60L74 70" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M64 42C64 50 64 56 66 62M74 42C76 50 76 56 74 62" stroke="#c9507e" stroke-width="2.5"/>` +
    // 흰 털 씨앗 뭉치
    tube('M22 88C22 70 20 56 24 48', '#8fa878', 3) +
    tube('M24 38L12 30M24 38L14 20M24 38L24 16M24 38L34 20M24 38L36 30M24 38L10 42M24 38L38 42', '#fff', 3) +
    `<circle cx="24" cy="38" r="4" fill="#dfe8f5"/>`,
  동백꽃:
    `<path d="M50 60C34 56 14 64 8 80C24 86 42 76 50 60Z" fill="#2f7a3a"/>` +
    `<path d="M50 60C66 58 84 66 92 82C76 88 58 78 50 60Z" fill="#2f7a3a"/>` +
    `<path d="M18 76C28 72 38 68 48 62M82 78C72 74 62 68 52 62" stroke="#7fc98a" stroke-width="2.5"/>` +
    roundFlower(50, 42, 5, 17, 17, '#e8303d', '#ffd23f', 12, -90) +
    `<path d="M40 42L36 36M50 34V28M60 42L64 36M44 50L40 54M56 50L60 54" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M50 42L40 42M50 42L60 42M50 42L50 32M50 42L44 50M50 42L56 50" stroke="#e8a82e" stroke-width="2.5"/>` +
    `<path d="M12 78C14 74 20 72 24 74C20 76 16 78 12 78Z" fill="#fff" stroke-width="2"/><path d="M78 76C82 72 88 74 90 78C86 78 82 78 78 76Z" fill="#fff" stroke-width="2"/>`,
  매화:
    tube('M6 86C24 74 30 60 40 54S60 40 70 20M40 54C52 58 66 62 90 58', '#4a2e1c', 6) +
    roundFlower(36, 54, 5, 9, 8, '#fff0f3', '#e85d9a', 4.5) +
    roundFlower(66, 26, 5, 9, 8, '#fff0f3', '#e85d9a', 4.5) +
    roundFlower(80, 58, 5, 8, 7, '#ffc4d4', '#e85d9a', 4) +
    roundFlower(18, 76, 5, 7, 6, '#ffc4d4', '#e85d9a', 3.5) +
    `<path d="M36 54l-4-4M36 54l4-4M66 26l-4-4M66 26l4-4" stroke="#ffd23f" stroke-width="2"/>` +
    `<circle cx="54" cy="44" r="4.5" fill="#ff9aa8" stroke-width="2.5"/><circle cx="58" cy="60" r="4" fill="#ff9aa8" stroke-width="2.5"/>`,
  목련:
    sky('#dff4ff') +
    tube('M20 95C24 78 30 66 44 58M44 58C52 52 58 44 60 30M44 58C58 60 70 60 80 54', '#6b3e26', 5) +
    [
      [60, 30, 1.2],
      [80, 52, 1],
      [26, 64, 0.95],
    ]
      .map(
        ([x, y, s]) =>
          `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f1(3.5 / s)}">` +
          `<path d="M0 0C-14 -4 -16 -18 -10 -26C-6 -18 -4 -10 0 0Z" fill="#fff"/><path d="M0 0C14 -4 16 -18 10 -26C6 -18 4 -10 0 0Z" fill="#fff"/>` +
          `<path d="M0 0C-9 -8 -8 -26 0 -34C8 -26 9 -8 0 0Z" fill="#fff"/>` +
          `<path d="M-5 -3C-2 0 2 0 5 -3" stroke="#e8a0c0" stroke-width="${f1(3 / s)}"/>` +
          `<path d="M-4 1H4L3 5H-3Z" fill="#8a6a3a"/></g>`,
      )
      .join('') +
    frame(),
  라벤더:
    [22, 36, 50, 64, 78]
      .map((x, i) => {
        const top = [26, 16, 10, 16, 26][i];
        const lean = [-6, -3, 0, 3, 6][i];
        const tx = x + lean;
        const buds = Array.from({ length: 6 }, (_, k) => {
          const yy = top + k * 5.5;
          const xx = tx - lean * (k / 12);
          return `<ellipse cx="${f1(xx - 3.5)}" cy="${f1(yy)}" rx="3.5" ry="4.5" fill="#8e4fc9" stroke-width="2"/><ellipse cx="${f1(xx + 3.5)}" cy="${f1(yy + 2.5)}" rx="3.5" ry="4.5" fill="#a45cf0" stroke-width="2"/>`;
        }).join('');
        return tube(`M50 92L${tx} ${top + 30}`, '#6aa84f', 3) + buds;
      })
      .join('') +
    `<path d="M40 82Q50 76 60 82L58 88Q50 84 42 88Z" fill="#ff9aa8"/>`,
  난초:
    `<path d="M28 72H72L66 94H34Z" fill="#dfe8f5"/><path d="M26 66H74V74H26Z" fill="#dfe8f5"/>` +
    `<path d="M36 82q7-5 14 0t14 0" stroke="#3b78e6" stroke-width="3"/>` +
    tube('M44 66C38 44 24 30 8 28', '#2f7a3a', 3.5) +
    tube('M48 66C46 40 40 22 30 10', '#2f7a3a', 3.5) +
    tube('M54 66C58 42 70 28 92 30', '#2f7a3a', 3.5) +
    tube('M52 66C54 46 62 34 72 42', '#2f7a3a', 3.5) +
    tube('M50 66C50 50 56 34 66 18', '#6aa84f', 2.5) +
    [
      [66, 18],
      [60, 30],
    ]
      .map(([x, y]) => pointPetals(x, y, 5, 10, 5, '#f5f0b0', -90, 2.5) + dot(x, y, 2.5, '#9c2a5a'))
      .join(''),
  수련:
    sky('#3b8fe0') +
    `<path d="M10 30q5-3 10 0M72 22q5-3 10 0M16 86q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M50 62L90 52A40 18 0 1 1 50 44Z" fill="#43b04a"/>` +
    `<path d="M22 64C32 60 42 60 50 62M68 72L60 62" stroke="#2f8a3a" stroke-width="2.5"/>` +
    `<path d="M76 34L90 30A12 6 0 1 1 78 28Z" fill="#5fc24a" stroke-width="3"/>` +
    pointPetals(50, 52, 8, 22, 8, '#ff9aa8', -90) +
    pointPetals(50, 52, 5, 15, 6, '#ffc4d4', -90) +
    `<circle cx="50" cy="50" r="5" fill="#ffd23f"/>` +
    frame(),
  개구리밥:
    sky('#4a90e2') +
    `<path d="M14 20q5-3 10 0M72 82q5-3 10 0M40 50q5-3 10 0" stroke="#bfe6ff" stroke-width="3"/>` +
    [
      [22, 34],
      [40, 26],
      [60, 30],
      [78, 22],
      [30, 56],
      [52, 66],
      [72, 50],
      [84, 68],
      [18, 78],
      [38, 84],
      [62, 86],
    ]
      .map(
        ([x, y], i) =>
          `<g transform="rotate(${(i * 47) % 360} ${x} ${y})"><circle cx="${x - 4}" cy="${y}" r="5" fill="#6fcf4a" stroke-width="2.5"/><circle cx="${x + 4}" cy="${y - 1}" r="5" fill="#8fe06a" stroke-width="2.5"/><circle cx="${x}" cy="${y + 5}" r="4" fill="#5fc24a" stroke-width="2.5"/></g>`,
      )
      .join('') +
    frame(),
  부레옥잠:
    sky('#dff4ff') +
    bottom(62, '#4a90e2') +
    `<path d="M5 62H95" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M40 66C34 74 30 84 34 92M48 66C46 76 48 84 44 92M56 66C60 76 58 84 62 92M62 66C70 72 72 82 70 90" stroke="#5a3b24" stroke-width="3"/>` +
    [
      [30, 58, 20],
      [70, 58, -20],
    ]
      .map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="7" ry="8" fill="#9ae07a"/><circle cx="${x}" cy="${y - 18}" r="11" fill="#43b04a"/></g>`)
      .join('') +
    `<ellipse cx="50" cy="60" rx="8" ry="7" fill="#9ae07a"/>` +
    tube('M50 54V26', '#5fa04a', 3) +
    [
      [44, 38],
      [56, 34],
      [46, 24],
      [56, 18],
    ]
      .map(([x, y]) => pointPetals(x, y, 6, 8, 4.5, '#c7a0f0', -90, 2.5) + dot(x, y, 2, '#ffd23f'))
      .join(''),

  // ── 해·물·구름 ──
  일몰:
    sky('#ff9f6a') +
    `<path d="M5 22C5 13 11 5 19 5H81C89 5 95 13 95 22V30H5Z" fill="#8e5fb0" stroke="none"/>` +
    `<path d="M24 58A26 26 0 0 1 76 58Z" fill="#ffd23f"/>` +
    bottom(58, '#3b5aa8') +
    `<path d="M34 66H66M40 74H60M46 82H54" stroke="#ffb35c" stroke-width="4"/>` +
    `<path d="M12 22q4-4 8 0q4-4 8 0" stroke-width="2.5"/>` +
    tube('M86 12V30', '#3b78e6', 6) +
    `<path d="M78 28L86 40L94 28Z" fill="#3b78e6" stroke-width="2.5"/>` +
    frame(),
  새털구름:
    sky('#7ec8f0') +
    [
      [14, 40, 80, 18],
      [20, 70, 86, 50],
      [10, 88, 56, 78],
    ]
      .map(([x0, y0, x1, y1]) => {
        const d = `M${x0} ${y0}Q${(x0 + x1) / 2} ${y0 - 6} ${x1} ${y1}`;
        const fr = Array.from({ length: 7 }, (_, k) => {
          const t = (k + 1) / 8;
          const x = x0 + (x1 - x0) * t;
          const y = y0 + (y1 - y0) * t - 4;
          return `M${f1(x)} ${f1(y)}l-4 7`;
        }).join('');
        return `<path d="${d}" stroke="#fff" stroke-width="5"/><path d="${fr}" stroke="#fff" stroke-width="3.5"/>`;
      })
      .join('') +
    frame(),
  양떼구름:
    sky('#7ec8f0') +
    [
      [22, 22],
      [50, 18],
      [78, 22],
      [14, 44],
      [40, 42],
      [66, 42],
      [88, 46],
      [26, 66],
      [54, 64],
      [80, 68],
    ]
      .map(([x, y]) =>
        blob('#fff', [
          [x - 5, y + 1, 5.5],
          [x, y - 2, 7],
          [x + 6, y + 1, 5.5],
        ]),
      )
      .join('') +
    bottom(84, '#8fd67a', 'M5 86C30 80 70 80 95 86') +
    frame(),
  비구름:
    cloud('#8a96b0', [
      [26, 42, 15],
      [46, 30, 19],
      [66, 38, 16],
      [80, 48, 11],
      [18, 52, 10],
      [48, 50, 14],
    ]) +
    `<path d="M32 30C34 24 40 20 46 20" stroke="#b4bdd0" stroke-width="3.5"/>` +
    drop(28, 68, 1.1) +
    drop(48, 72, 1.2) +
    drop(68, 68, 1.1) +
    drop(38, 84, 0.8) +
    drop(58, 86, 0.8),
  눈구름:
    cloud('#a4b4d0', [
      [26, 40, 15],
      [46, 28, 19],
      [66, 36, 16],
      [80, 46, 11],
      [18, 50, 10],
      [48, 48, 14],
    ]) +
    `<path d="M32 28C34 22 40 18 46 18" stroke="#dfe8f5" stroke-width="3.5"/>` +
    flake(26, 74, 8, 3.5) +
    flake(50, 80, 9, 3.5) +
    flake(74, 72, 8, 3.5) +
    flake(38, 90, 4.5, 2.5) +
    flake(64, 92, 4.5, 2.5),
  천둥:
    sky('#aebfd8') +
    cloud('#5f6a85', [
      [30, 30, 14],
      [50, 22, 17],
      [70, 30, 14],
      [50, 36, 12],
    ]) +
    `<path d="M52 40L40 62H50L42 86L64 56H54L62 40Z" fill="#ffd23f"/>` +
    `<g stroke="#ffc933" stroke-width="5"><path d="M24 54C18 60 18 70 24 76"/><path d="M14 48C4 58 4 72 14 82"/><path d="M76 54C82 60 82 70 76 76"/><path d="M86 48C96 58 96 72 86 82"/></g>` +
    frame(),
  폭우:
    sky('#aebfd8') +
    cloud('#5f6a85', [
      [18, 20, 12],
      [34, 14, 13],
      [52, 16, 13],
      [70, 14, 13],
      [86, 20, 11],
      [50, 26, 12],
    ]) +
    bottom(78, '#4a90e2', 'M5 80q7.5-4 15 0t15 0t15 0t15 0t15 0t15 0') +
    streaks(
      [
        [18, 36],
        [32, 34],
        [46, 36],
        [60, 34],
        [74, 36],
        [88, 34],
        [24, 56],
        [38, 54],
        [52, 56],
        [66, 54],
        [80, 56],
      ],
      14,
      '#3b78e6',
      4.5,
      0.5,
    ) +
    `<path d="M20 86l-3-6M24 86l3-6M60 88l-3-6M64 88l3-6" stroke="#dff4ff" stroke-width="2.5"/>` +
    frame(),
  폭설:
    sky('#9fb4d6') +
    `<path d="M24 86V56L50 38L76 56V86Z" fill="#ffe2a0"/>` +
    `<path d="M16 60C16 44 34 26 50 24C66 26 84 44 84 60C74 56 62 50 50 50S26 56 16 60Z" fill="#fff"/>` +
    `<rect x="44" y="64" width="12" height="12" fill="#7ec8f0"/>` +
    bottom(74, '#fff', 'M5 76C24 68 40 72 56 78S84 70 95 72') +
    flake(16, 20, 6, 3) +
    flake(84, 18, 6, 3) +
    flake(30, 42, 4.5, 2.5) +
    flake(76, 40, 4.5, 2.5) +
    flake(12, 50, 4.5, 2.5) +
    flake(88, 60, 4.5, 2.5) +
    flake(50, 12, 4.5, 2.5) +
    frame(),
  눈꽃:
    sky('#bfe6ff') +
    tube('M8 90C26 76 40 62 50 48S66 24 70 10M50 48C60 50 76 48 92 40M36 66C30 56 26 46 26 34', '#5a3b24', 5) +
    blob('#fff', [
      [70, 14, 7],
      [62, 26, 7],
      [56, 38, 6],
    ]) +
    blob('#fff', [
      [64, 50, 6],
      [78, 46, 7],
      [90, 40, 5],
    ]) +
    blob('#fff', [
      [26, 32, 6],
      [28, 44, 6],
      [34, 56, 5],
    ]) +
    blob('#fff', [
      [18, 82, 6],
      [44, 60, 6],
    ]) +
    sparkle(84, 20, 7, '#fff') +
    sparkle(16, 16, 6, '#fff') +
    sparkle(78, 72, 6, '#fff') +
    frame(),
  이슬방울:
    sky('#e6f7e0') +
    `<path d="M8 92C10 60 36 26 90 12C84 54 52 86 8 92Z" fill="#5fc24a"/>` +
    `<path d="M8 92L80 22" stroke="#2f8a3a" stroke-width="3"/>` +
    `<path d="M48 30C44 40 30 48 30 60A18 18 0 0 0 66 60C66 48 52 40 48 30Z" fill="#9fdcff"/>` +
    `<path d="M38 56C38 50 42 46 46 44" stroke="#fff" stroke-width="5"/>` +
    dot(58, 66, 3, '#fff') +
    `<circle cx="72" cy="46" r="5" fill="#9fdcff" stroke-width="2.5"/><circle cx="24" cy="80" r="4" fill="#9fdcff" stroke-width="2.5"/>` +
    sparkle(80, 72, 7, '#fff') +
    frame(),
  얼음꽃:
    bg('#9a5b2e') +
    `<rect x="14" y="14" width="72" height="72" rx="4" fill="#bcd8f0"/>` +
    `<path d="M50 14V86M14 50H86" stroke-width="7"/><path d="M50 14V86M14 50H86" stroke="#9a5b2e" stroke-width="4"/>` +
    [
      [18, 46, 1, -1],
      [82, 46, -1, -1],
      [18, 54, 1, 1],
      [82, 54, -1, 1],
    ]
      .map(([x, y, sx, sy]) => {
        const d =
          `M${x} ${y}L${x + sx * 26} ${y + sy * 26}` +
          [6, 12, 18, 24].map((t) => `M${x + sx * t} ${y + sy * t}l${sx * 7} ${-sy * 2}M${x + sx * t} ${y + sy * t}l${-sx * 2} ${sy * 7}`).join('');
        return `<path d="${d}" stroke="#fff" stroke-width="3"/>`;
      })
      .join('') +
    `<rect x="14" y="14" width="72" height="72" rx="4"/>` +
    frame(),
  쌍무지개:
    sky('#bfe6ff') +
    rainbow(50, 90, 44, 2) +
    rainbow(50, 90, 24, 2) +
    blob('#fff', [
      [12, 88, 7],
      [22, 90, 7],
    ]) +
    blob('#fff', [
      [78, 90, 7],
      [88, 88, 7],
    ]) +
    frame(),
  별자리: (() => {
    const s: [number, number, number][] = [
      [28, 20, 8],
      [72, 24, 7],
      [44, 50, 6],
      [52, 52, 6],
      [60, 54, 6],
      [30, 82, 7],
      [74, 80, 8],
    ];
    const P = (i: number) => `${s[i][0]} ${s[i][1]}`;
    const line = `M${P(0)}L${P(2)}L${P(3)}L${P(4)}L${P(1)}ZM${P(2)}L${P(5)}M${P(4)}L${P(6)}M${P(0)}L${P(1)}`;
    return (
      night() +
      `<path d="${line}" stroke="#9fb0e8" stroke-width="2.5" stroke-dasharray="4 4"/>` +
      s.map(([x, y, r]) => star(x, y, r)).join('') +
      twinkles([
        [14, 50, 2.5],
        [86, 50, 2.5],
        [50, 14, 2.5],
      ]) +
      frame()
    );
  })(),
  북극성:
    night('#1a2350') +
    `<g stroke="#9fb0e8" stroke-width="3" stroke-dasharray="10 6"><circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="40"/></g>` +
    star(50, 50, 15, '#ffd23f', 3) +
    sparkle(50, 50, 4, '#fff') +
    dot(70, 50, 2.5, '#fff') +
    dot(50, 20, 2.5, '#fff') +
    dot(22, 64, 2.5, '#fff') +
    frame(),
  은하:
    night('#141a3a') +
    tube(spiralD(50, 50, 6, 40, 1.1, 0.62, 0), '#8f9de0', 8) +
    tube(spiralD(50, 50, 6, 40, 1.1, 0.62, Math.PI), '#b89ae8', 8) +
    `<ellipse cx="50" cy="50" rx="12" ry="9" fill="#fff1b8"/>` +
    dot(50, 50, 4, '#fff') +
    twinkles([
      [16, 16, 3],
      [84, 84, 3],
      [84, 16, 2.5],
      [16, 84, 2.5],
    ]) +
    frame(),
  소행성:
    night() +
    `<path d="M16 48C14 32 30 20 46 24C58 18 76 22 82 36C90 46 86 62 76 70C66 82 44 82 32 74C20 68 16 60 16 48Z" fill="#9a8a7a"/>` +
    `<path d="M24 56C30 64 44 70 58 70" stroke="#b8a898" stroke-width="3"/>` +
    `<ellipse cx="38" cy="40" rx="7" ry="6" fill="#7a6a5a" stroke-width="2.5"/><ellipse cx="62" cy="50" rx="9" ry="7" fill="#7a6a5a" stroke-width="2.5"/>` +
    `<circle cx="44" cy="62" r="4" fill="#7a6a5a" stroke-width="2.5"/><circle cx="70" cy="34" r="3.5" fill="#7a6a5a" stroke-width="2.5"/>` +
    `<path d="M84 80C84 76 90 76 90 80C90 84 84 84 84 80Z" fill="#9a8a7a" stroke-width="2.5"/>` +
    `<circle cx="16" cy="18" r="3.5" fill="#9a8a7a" stroke-width="2.5"/>` +
    twinkles([
      [84, 14, 3.5],
      [14, 86, 3],
      [50, 88, 2.5],
    ]) +
    frame(),
};

