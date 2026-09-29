// 음식 그림 묶음 (2단계 어휘: 곡식·반찬·양념·과일·떡·과자·튀김). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 양념은 통 모양·색(케첩 빨간 병, 마요네즈 크림색 병, 간장 검은 병, 고추장 빨간 네모 통, 식초 맑은 병),
// 떡은 모양·색(인절미 노란 네모, 가래떡 흰 막대, 꿀떡 알록달록 구슬, 시루떡 줄무늬 층), 튀김은 속 재료(감자 막대, 고구마 보라 테두리, 새우 꼬리, 오징어 고리).
import { dot, blob, sparkle } from '../pictureKit.ts';

const f = (n: number) => n.toFixed(1);

/** 가장자리가 물결인 도형 (튀김옷·약과·유자 껍질) */
function scallop(cx: number, cy: number, rx: number, ry: number, n: number, a: number, fill: string, rot = 0): string {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n + rot;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = t - Math.PI / n;
      d += `Q${f(cx + rx * (1 + a) * Math.cos(m))} ${f(cy + ry * (1 + a) * Math.sin(m))} ${f(x)} ${f(y)}`;
    }
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
}

/** 접시 */
const plate = (cy: number, rx = 44, ry = 12, fill = '#fff', rim = '#dfe8f5') =>
  `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="50" cy="${cy - 1}" rx="${rx - 9}" ry="${ry - 4}" stroke="${rim}" stroke-width="2.5"/>`;

/** 정육면체 (깍두기·캐러멜): 앞면·윗면·옆면 */
function cube(x: number, y: number, s: number, front: string, top: string, side: string): string {
  const dx = s * 0.4;
  const dy = s * 0.35;
  return (
    `<path d="M${f(x)} ${f(y)}L${f(x + dx)} ${f(y - dy)}H${f(x + s + dx)}L${f(x + s)} ${f(y)}Z" fill="${top}"/>` +
    `<path d="M${f(x + s)} ${f(y)}L${f(x + s + dx)} ${f(y - dy)}V${f(y + s - dy)}L${f(x + s)} ${f(y + s)}Z" fill="${side}"/>` +
    `<rect x="${f(x)}" y="${f(y)}" width="${s}" height="${s}" rx="2" fill="${front}"/>`
  );
}

/** 보리 이삭 한 줄기 (긴 수염) */
function barleyEar(rot: number): string {
  let k = '';
  for (let i = 0; i < 4; i++) {
    const y = 58 - i * 9;
    k +=
      `<path d="M45 ${y - 4}L37 ${y - 26}M55 ${y - 4}L63 ${y - 26}" stroke="#c9962a" stroke-width="2.2"/>` +
      `<ellipse cx="45" cy="${y}" rx="5" ry="7" fill="#f2c14e" transform="rotate(-25 45 ${y})"/>` +
      `<ellipse cx="55" cy="${y}" rx="5" ry="7" fill="#f2c14e" transform="rotate(25 55 ${y})"/>`;
  }
  return (
    `<g transform="rotate(${rot} 50 94)">` +
    `<path d="M50 94V60" stroke-width="7"/><path d="M50 94V60" stroke="#d9b24a" stroke-width="3"/>` +
    `<path d="M50 26V2" stroke="#c9962a" stroke-width="2.2"/>` +
    k +
    `<ellipse cx="50" cy="25" rx="5" ry="7.5" fill="#f2c14e"/>` +
    `</g>`
  );
}

/** 새우튀김 한 마리 (구부러진 튀김옷 + 빨간 꼬리) */
function friedShrimp(tx: number, ty: number, rot: number): string {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const t = (Math.PI * (0.95 + 0.85 * (i / 8)));
    pts.push([f2(50 + 34 * Math.cos(t)), f2(58 + 30 * Math.sin(t)), 9.5 - i * 0.5]);
  }
  const end = pts[pts.length - 1];
  return (
    `<g transform="translate(${tx} ${ty}) rotate(${rot} 50 50)">` +
    `<path d="M${end[0] + 2} ${end[1] - 2}L${end[0] + 16} ${end[1] - 14}L${end[0] + 18} ${end[1] + 2}Z" fill="#ff6a3d"/>` +
    `<path d="M${end[0] + 4} ${end[1] - 3}L${end[0] + 14} ${end[1] - 6}" stroke="#ffb08a" stroke-width="2"/>` +
    blob('#f2b84a', pts) +
    pts
      .filter((_, i) => i % 2 === 1)
      .map(([x, y]) => `<circle cx="${x}" cy="${y - 2}" r="2" fill="#ffd98a" stroke="none"/>`)
      .join('') +
    `</g>`
  );
}
function f2(n: number): number {
  return Math.round(n * 10) / 10;
}

export const PICS: Record<string, string> = {
  보리: barleyEar(-20) + barleyEar(20) + barleyEar(0),

  밀가루:
    `<path d="M22 36L18 88Q50 96 82 88L78 36Z" fill="#f4ead2"/>` +
    `<path d="M22 36Q50 42 78 36" stroke="#d9c8a0" stroke-width="3"/>` +
    `<path d="M26 36C30 20 42 14 50 14S70 20 74 36Q50 42 26 36Z" fill="#fff"/>` +
    `<path d="M38 26q4-4 8-2M54 22q4-2 7 1" stroke="#dfe8f5" stroke-width="2.5"/>` +
    `<path d="M50 84V54" stroke="#c9962a" stroke-width="3"/>` +
    [58, 66, 74]
      .map(
        (y) =>
          `<ellipse cx="45" cy="${y - 10}" rx="3.5" ry="5.5" fill="#f2c14e" stroke-width="2" transform="rotate(-25 45 ${y - 10})"/>` +
          `<ellipse cx="55" cy="${y - 10}" rx="3.5" ry="5.5" fill="#f2c14e" stroke-width="2" transform="rotate(25 55 ${y - 10})"/>`,
      )
      .join('') +
    `<ellipse cx="50" cy="44" rx="3.5" ry="5.5" fill="#f2c14e" stroke-width="2"/>`,

  깍두기:
    plate(80, 44, 12, '#fff') +
    cube(18, 60, 20, '#f06a45', '#ff9a70', '#d24e2e') +
    cube(42, 62, 20, '#f06a45', '#ff9a70', '#d24e2e') +
    cube(64, 60, 18, '#f06a45', '#ff9a70', '#d24e2e') +
    cube(30, 38, 20, '#f06a45', '#ff9a70', '#d24e2e') +
    cube(54, 40, 19, '#f06a45', '#ff9a70', '#d24e2e') +
    cube(42, 18, 19, '#f06a45', '#ff9a70', '#d24e2e') +
    [
      [24, 66],
      [48, 70],
      [36, 44],
      [60, 48],
      [48, 24],
      [70, 66],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff" stroke="none" opacity=".6"/>`)
      .join(''),

  총각김치:
    plate(82, 44, 11, '#fff') +
    [
      [-28, 36],
      [0, 50],
      [28, 64],
    ]
      .map(
        ([r, x]) =>
          `<g transform="rotate(${r} 50 70) translate(${x - 50} 0)">` +
          `<path d="M48 36C40 22 34 12 38 6M52 36C56 20 64 12 62 4M50 36C48 22 50 12 50 4" stroke-width="9"/>` +
          `<path d="M48 36C40 22 34 12 38 6M52 36C56 20 64 12 62 4M50 36C48 22 50 12 50 4" stroke="#2e7a38" stroke-width="4"/>` +
          `<path d="M50 78L50 92" stroke-width="3"/>` +
          `<path d="M40 38C28 48 30 70 44 78Q50 82 56 78C70 70 72 48 60 38Q50 32 40 38Z" fill="#d8402e"/>` +
          `<ellipse cx="44" cy="52" rx="4" ry="7" fill="#fff4e8" stroke="none"/><ellipse cx="57" cy="64" rx="3.5" ry="5" fill="#fff4e8" stroke="none"/>` +
          dot(50, 48, 1.5, '#fff') + dot(54, 56, 1.5, '#fff') + dot(46, 66, 1.5, '#fff') +
          `</g>`,
      )
      .join(''),

  나물:
    `<ellipse cx="50" cy="62" rx="45" ry="28" fill="#fff"/><ellipse cx="50" cy="61" rx="36" ry="21" stroke="#dfe8f5" stroke-width="2.5"/>` +
    blob('#43b04a', [
      [28, 54, 11],
      [38, 50, 10],
      [34, 62, 9],
    ]) +
    `<path d="M24 52q5 4 10 0t10 2M26 62q5-3 10 1" stroke="#2e7a38" stroke-width="2.5"/>` +
    blob('#9a6a34', [
      [64, 50, 10],
      [74, 54, 10],
      [68, 62, 9],
    ]) +
    `<path d="M60 48q5 5 10 0t10 3M64 60q4 3 9-1" stroke="#6b4420" stroke-width="2.5"/>` +
    blob('#fff1c4', [
      [44, 72, 10],
      [56, 72, 10],
      [50, 64, 8],
    ]) +
    `<path d="M40 72q5-4 10 0t10 0M46 64q4 3 8 0" stroke="#e0c890" stroke-width="2.5"/>` +
    [
      [30, 48],
      [70, 46],
      [52, 70],
      [38, 58],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2.2" fill="#fff" stroke="none"/>`)
      .join(''),

  도라지:
    `<path d="M50 44V30" stroke-width="7"/><path d="M50 44V30" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M50 38C40 34 34 36 30 42C38 44 44 42 50 38Z" fill="#43b04a"/>` +
    `<path d="M50 5L57 14L68 13L62 22L66 32L55 29L50 36L45 29L34 32L38 22L32 13L43 14Z" fill="#8e4fc9"/>` +
    `<circle cx="50" cy="21" r="4" fill="#fff1b8" stroke-width="2"/>` +
    `<path d="M50 11V17M41 19l5 2M59 19l-5 2" stroke="#c9a0f0" stroke-width="2"/>` +
    `<path d="M40 46C36 60 38 72 34 86C40 86 44 78 46 72C47 80 50 90 54 92C56 84 55 76 56 70C60 78 64 84 70 84C66 70 64 58 60 46Q50 40 40 46Z" fill="#fbf2dc"/>` +
    `<path d="M42 54h10M44 62h12M46 70h8" stroke="#d9c8a0" stroke-width="2.5"/>`,

  고사리:
    [
      [30, 0.95],
      [50, 1.1],
      [72, 0.95],
    ]
      .map(
        ([x, s]) =>
          `<g transform="translate(${x} 94) scale(${s})">` +
          `<path d="M0 0C0 -20 -4 -40 -2 -54C0 -68 18 -70 18 -56C18 -46 6 -44 6 -52C6 -56 10 -57 12 -55" stroke-width="10"/>` +
          `<path d="M0 0C0 -20 -4 -40 -2 -54C0 -68 18 -70 18 -56C18 -46 6 -44 6 -52C6 -56 10 -57 12 -55" stroke="#8a8a2e" stroke-width="5"/>` +
          `<path d="M-2 -30q-6-2-8-8M0 -18q6-2 8-8" stroke="#8a8a2e" stroke-width="3"/>` +
          `</g>`,
      )
      .join(''),

  연근:
    `<ellipse cx="30" cy="36" rx="18" ry="24" fill="#e8d0a8" transform="rotate(-30 30 36)"/>` +
    `<circle cx="56" cy="58" r="34" fill="#f7e6c4"/><circle cx="56" cy="58" r="28" stroke="#e0c490" stroke-width="2.5"/>` +
    `<circle cx="56" cy="58" r="6" fill="#b88a5a"/>` +
    [0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const t = (2 * Math.PI * i) / 7 - Math.PI / 2;
        return `<ellipse cx="${f(56 + 17 * Math.cos(t))}" cy="${f(58 + 17 * Math.sin(t))}" rx="6.5" ry="6.5" fill="#b88a5a"/>`;
      })
      .join(''),

  우엉:
    `<g transform="rotate(-40 50 52)">` +
    `<path d="M4 44H86C92 44 94 48 94 50S92 56 86 56H4Z" fill="#8a5a30"/>` +
    `<ellipse cx="6" cy="50" rx="4" ry="6" fill="#f4e4c4"/>` +
    `<path d="M24 44v12M42 44v12M60 44v12M76 44v12" stroke="#6b3e20" stroke-width="2.5"/>` +
    `<path d="M10 66H80C86 66 88 70 88 72S86 78 80 78H10Z" fill="#9a6a3a"/>` +
    `<ellipse cx="12" cy="72" rx="4" ry="6" fill="#f4e4c4"/>` +
    `<path d="M30 66v12M50 66v12M68 66v12" stroke="#6b3e20" stroke-width="2.5"/>` +
    `<path d="M94 50L100 52M88 72L96 76" stroke="#6b3e20" stroke-width="2.5"/>` +
    `</g>`,

  오이지:
    `<ellipse cx="50" cy="44" rx="34" ry="9" fill="#e8dc8a"/>` +
    [
      [34, -12],
      [50, 0],
      [66, 12],
    ]
      .map(
        ([x, r]) =>
          `<g transform="rotate(${r} ${x} 46)"><rect x="${x - 7}" y="12" width="14" height="40" rx="7" fill="#c9b83a"/>` +
          `<path d="M${x - 2} 20v4M${x + 2} 30v4M${x - 2} 38v3" stroke="#8a7a1e" stroke-width="2.5"/></g>`,
      )
      .join('') +
    `<path d="M16 44C12 60 16 80 26 88H74C84 80 88 60 84 44C84 50 70 54 50 54S16 50 16 44Z" fill="#8a4e2a"/>` +
    `<path d="M20 62Q50 70 80 62" stroke="#b87a4a" stroke-width="3"/>`,

  단무지:
    `<g transform="rotate(-12 40 44)">` +
    `<path d="M12 30H62V62H12C6 62 6 30 12 30Z" fill="#ffd23f"/>` +
    `<ellipse cx="62" cy="46" rx="8" ry="16" fill="#ffe680"/>` +
    `<path d="M28 30v32M44 30v32" stroke="#e0a800" stroke-width="2.5"/>` +
    `</g>` +
    [
      [58, 74],
      [72, 70],
      [84, 66],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="11" ry="15" fill="#ffd23f"/><ellipse cx="${x}" cy="${y}" rx="6" ry="9" stroke="#ffe680" stroke-width="3"/>`,
      )
      .join(''),

  피클:
    `<rect x="26" y="10" width="48" height="14" rx="4" fill="#43b04a"/><path d="M34 14v6M42 14v6M50 14v6M58 14v6M66 14v6" stroke="#2e7a38" stroke-width="2"/>` +
    `<path d="M24 24H76V82C76 88 72 92 66 92H34C28 92 24 88 24 82Z" fill="#eef8e0"/>` +
    `<path d="M27 38H73V82C73 86 70 89 66 89H34C30 89 27 86 27 82Z" fill="#dff0b0" stroke="none"/>` +
    [
      [38, 50],
      [60, 48],
      [48, 64],
      [36, 78],
      [62, 76],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="9" fill="#6aa83a"/><circle cx="${x}" cy="${y}" r="5" fill="#c4e07a" stroke="none"/>` +
          dot(x - 2, y - 1, 1.3, '#fff') +
          dot(x + 2, y + 1, 1.3, '#fff'),
      )
      .join('') +
    `<path d="M24 24H76V82C76 88 72 92 66 92H34C28 92 24 88 24 82Z"/>` +
    `<path d="M30 30V44" stroke="#fff" stroke-width="3"/>`,

  케첩:
    `<path d="M42 4H58L60 16H40Z" fill="#fff"/>` +
    `<rect x="36" y="14" width="28" height="12" rx="3" fill="#fff"/>` +
    `<path d="M36 26H64C72 30 74 40 74 50V84C74 90 70 94 64 94H36C30 94 26 90 26 84V50C26 40 28 30 36 26Z" fill="#e8403a"/>` +
    `<ellipse cx="50" cy="64" rx="17" ry="15" fill="#fff"/>` +
    `<circle cx="50" cy="66" r="9" fill="#e8403a"/><path d="M50 57L47 53M50 57L54 54M50 57V52" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M32 34V48" stroke="#ff8a7a" stroke-width="4"/>`,

  마요네즈:
    `<path d="M44 4L50 0L56 4L55 14H45Z" fill="#e8403a"/>` +
    `<rect x="38" y="12" width="24" height="12" rx="3" fill="#e8403a"/>` +
    `<path d="M40 24H60C62 32 68 36 72 44C76 54 76 70 74 82C73 90 68 94 60 94H40C32 94 27 90 26 82C24 70 24 54 28 44C32 36 38 32 40 24Z" fill="#fff4c4"/>` +
    `<path d="M26 60Q50 66 74 60V76Q50 82 26 76Z" fill="#3b78e6"/>` +
    `<ellipse cx="50" cy="69" rx="6" ry="8" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M34 40C33 46 32 50 32 54" stroke="#fff" stroke-width="4"/>`,

  간장:
    `<ellipse cx="24" cy="84" rx="18" ry="7" fill="#fff"/><ellipse cx="24" cy="82" rx="12" ry="3.5" fill="#3a2418" stroke="none"/>` +
    `<rect x="52" y="4" width="16" height="10" rx="2" fill="#e8403a"/>` +
    `<path d="M53 14H67V28C67 34 78 38 78 48V88C78 91 76 94 72 94H48C44 94 42 91 42 88V48C42 38 53 34 53 28Z" fill="#3a2418"/>` +
    `<rect x="46" y="54" width="28" height="26" rx="3" fill="#fff1c4"/>` +
    `<ellipse cx="54" cy="66" rx="4" ry="5" fill="#f2c14e" stroke-width="2"/><ellipse cx="62" cy="64" rx="4" ry="5" fill="#f2c14e" stroke-width="2"/><ellipse cx="66" cy="72" rx="4" ry="5" fill="#f2c14e" stroke-width="2"/>` +
    `<path d="M47 42V50" stroke="#8a6a50" stroke-width="3.5"/>`,

  고추장:
    `<path d="M16 38H84L78 88C78 91 75 93 72 93H28C25 93 22 91 22 88Z" fill="#d23a2e"/>` +
    `<ellipse cx="50" cy="38" rx="34" ry="10" fill="#9a1e1a"/>` +
    `<path d="M34 38C38 32 46 34 50 38S62 44 66 38" stroke="#c83028" stroke-width="3"/>` +
    `<path d="M26 56H74" stroke="#ff8a7a" stroke-width="3"/>` +
    `<path d="M30 64H70V82H30Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M38 70C46 70 56 72 62 78C54 80 44 78 38 74Z" fill="#e8403a" stroke-width="2"/><path d="M38 72L34 68" stroke="#3a9e47" stroke-width="2.5"/>` +
    `<path d="M78 8C74 12 72 16 74 20" stroke="#3a9e47" stroke-width="4"/>` +
    `<path d="M74 20C66 20 60 26 58 32C64 32 72 30 78 24Z" fill="#43b04a" stroke-width="2.5"/>`,

  식초:
    `<rect x="42" y="4" width="16" height="10" rx="2" fill="#43b04a"/>` +
    `<path d="M43 14H57V26C57 32 70 36 70 46V88C70 91 68 94 64 94H36C32 94 30 91 30 88V46C30 36 43 32 43 26Z" fill="#eef8ff"/>` +
    `<path d="M33 50H67V88C67 90 66 91 64 91H36C34 91 33 90 33 88Z" fill="#f6e89a" stroke="none"/>` +
    `<path d="M33 50H67"/>` +
    `<path d="M43 14H57V26C57 32 70 36 70 46V88C70 91 68 94 64 94H36C32 94 30 91 30 88V46C30 36 43 32 43 26Z"/>` +
    `<path d="M50 70C46 64 38 66 38 74C38 82 46 86 50 84C54 86 62 82 62 74C62 66 54 64 50 70Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M50 70C50 66 51 64 53 62" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M36 40V46" stroke="#fff" stroke-width="3.5"/>`,

  후추:
    `<circle cx="40" cy="10" r="6" fill="#5a3b24"/>` +
    `<path d="M26 16H54V22H26Z" fill="#5a3b24"/>` +
    `<path d="M28 22H52C50 32 46 38 46 48C46 60 54 66 54 80V90H26V80C26 66 34 60 34 48C34 38 30 32 28 22Z" fill="#8a5a30"/>` +
    `<path d="M30 30H50" stroke="#6b3e20" stroke-width="3"/><path d="M36 38V60" stroke="#b07a45" stroke-width="3"/>` +
    [
      [64, 88, 5],
      [76, 90, 5],
      [88, 88, 4.5],
      [70, 79, 5],
      [82, 80, 5],
      [76, 70, 4.5],
      [60, 78, 4],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2a2a38" stroke-width="2"/>` + dot(x - 1.5, y - 1.5, 1.3, '#8a96b0'))
      .join(''),

  참깨:
    `<path d="M12 50H88C88 72 72 84 50 84S12 72 12 50Z" fill="#b07a45"/>` +
    `<path d="M16 54H84" stroke="#d9a570" stroke-width="3"/>` +
    `<path d="M14 50C22 34 78 34 86 50Z" fill="#f7e6c0"/>` +
    [
      [26, 44, 20],
      [36, 40, -30],
      [48, 38, 10],
      [60, 40, 40],
      [72, 44, -10],
      [42, 46, 60],
      [56, 46, -40],
      [32, 92, 30],
      [48, 94, -20],
      [66, 92, 50],
    ]
      .map(
        ([x, y, r]) =>
          `<path d="M${x} ${y - 5}C${x + 4} ${y - 2} ${x + 3} ${y + 5} ${x} ${y + 5}S${x - 4} ${y - 2} ${x} ${y - 5}Z" fill="#fff8e4" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`,
      )
      .join(''),

  올리브:
    `<path d="M8 22C30 30 60 34 92 24" stroke="#6b3e26" stroke-width="5"/>` +
    [
      [20, 26, 24],
      [44, 30, -16],
      [70, 28, 28],
      [86, 24, -20],
    ]
      .map(
        ([x, y, r]) =>
          `<path d="M${x} ${y}C${x + 6} ${y - 6} ${x + 18} ${y - 8} ${x + 22} ${y - 6}C${x + 18} ${y - 2} ${x + 6} ${y + 2} ${x} ${y}Z" fill="#8fae6a" stroke-width="2.5" transform="rotate(${r} ${x} ${y})"/>`,
      )
      .join('') +
    `<path d="M36 32V42M64 30V40" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="34" cy="62" rx="17" ry="22" fill="#8aa83a" transform="rotate(-12 34 62)"/>` +
    `<ellipse cx="66" cy="60" rx="17" ry="22" fill="#5a3a5a" transform="rotate(12 66 60)"/>` +
    `<path d="M26 54C26 50 28 47 31 46M58 52C58 48 60 45 63 44" stroke="#fff" stroke-width="3.5" opacity=".6"/>`,

  아보카도:
    `<path d="M50 8C64 8 68 24 72 36C86 52 84 92 50 92S14 52 28 36C32 24 36 8 50 8Z" fill="#3f7a2a"/>` +
    `<path d="M50 16C60 16 63 28 66 38C78 52 76 84 50 84S22 52 34 38C37 28 40 16 50 16Z" fill="#d8ea7a"/>` +
    `<path d="M50 30C58 30 62 40 64 48C70 58 66 78 50 78S30 58 36 48C38 40 42 30 50 30Z" fill="#eef5a8" stroke="none"/>` +
    `<circle cx="50" cy="62" r="14" fill="#9a5b2e"/><path d="M43 56C44 53 46 52 48 51" stroke="#c98b4f" stroke-width="3"/>`,

  코코넛:
    `<circle cx="64" cy="42" r="28" fill="#7a4a2a"/>` +
    `<path d="M44 26q6 4 10 0M70 20q4 5 10 2M78 40q4 5 8 1M58 58q5 3 9-1" stroke="#a87048" stroke-width="3"/>` +
    dot(58, 30, 3.5, '#3a2418') +
    dot(68, 30, 3.5, '#3a2418') +
    dot(63, 38, 3.5, '#3a2418') +
    `<path d="M10 58L18 54L24 60L32 52L40 58L48 52L56 58L62 54L70 58C70 78 56 90 40 90S10 78 10 58Z" fill="#6b3e26"/>` +
    `<path d="M14 60L18 57L24 63L32 55L40 61L48 55L56 61L62 57L66 60C64 74 54 82 40 82S16 74 14 60Z" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M24 70q16 6 32 0" stroke="#e8f0f8" stroke-width="3"/>`,

  석류:
    `<path d="M28 20L32 10L37 18L42 10L46 20" fill="#c82a32"/>` +
    `<circle cx="38" cy="44" r="27" fill="#d8343a"/>` +
    `<path d="M22 38C23 30 28 25 34 23" stroke="#ff8a8a" stroke-width="4"/>` +
    `<circle cx="64" cy="66" r="26" fill="#c82a32"/><circle cx="64" cy="66" r="20" fill="#ffe0d6"/>` +
    [
      [56, 56],
      [64, 54],
      [72, 57],
      [52, 64],
      [60, 63],
      [68, 64],
      [76, 65],
      [54, 72],
      [62, 71],
      [70, 72],
      [58, 79],
      [66, 79],
      [74, 74],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#e8203a" stroke-width="1.8"/>`)
      .join(''),

  무화과:
    `<path d="M30 20C36 26 44 38 44 54C44 70 36 80 26 80S8 70 8 56C8 40 22 30 30 20Z" fill="#7a3a6a"/>` +
    `<path d="M30 20L32 12" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M16 50C16 44 18 40 22 37" stroke="#b070a0" stroke-width="3.5"/>` +
    `<path d="M64 14C72 22 88 40 88 60C88 78 78 90 64 90S40 78 40 60C40 40 56 22 64 14Z" fill="#7a3a6a"/>` +
    `<path d="M64 22C70 30 82 44 82 60C82 74 74 84 64 84S46 74 46 60C46 44 58 30 64 22Z" fill="#fff4e4"/>` +
    `<path d="M64 32C68 38 76 48 76 60C76 70 70 78 64 78S52 70 52 60C52 48 60 38 64 32Z" fill="#e8506a" stroke-width="2.5"/>` +
    [
      [60, 50],
      [68, 52],
      [58, 62],
      [70, 64],
      [64, 70],
      [64, 42],
      [60, 72],
    ]
      .map(([x, y]) => dot(x, y, 1.6, '#fff1b8'))
      .join('') +
    `<path d="M64 14L66 6" stroke="#43b04a" stroke-width="4"/>`,

  살구:
    `<path d="M54 22C62 10 78 8 84 14C76 24 64 26 54 22Z" fill="#43b04a"/>` +
    `<circle cx="36" cy="54" r="26" fill="#ffab40"/>` +
    `<path d="M36 30C30 42 30 64 36 80" stroke="#e8862e" stroke-width="3"/>` +
    `<circle cx="24" cy="62" r="7" fill="#ff7a52" stroke="none" opacity=".5"/>` +
    `<path d="M22 46C22 40 26 36 30 34" stroke="#ffd79a" stroke-width="4"/>` +
    `<circle cx="68" cy="64" r="24" fill="#ffab40"/><circle cx="68" cy="64" r="18" fill="#ffc86a" stroke="none"/>` +
    `<ellipse cx="68" cy="64" rx="8" ry="11" fill="#9a5b2e"/>` +
    `<path d="M66 58v10" stroke="#6b3e26" stroke-width="2"/>`,

  매실:
    `<path d="M6 20C30 24 60 22 94 12" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M66 18C72 6 88 4 92 8C86 18 76 20 66 18Z" fill="#3a9e47"/>` +
    `<path d="M14 22C12 10 22 4 28 6C28 16 22 22 14 22Z" fill="#3a9e47"/>` +
    [
      [30, 44, 16],
      [60, 40, 16],
      [44, 72, 17],
      [76, 70, 15],
    ]
      .map(
        ([x, y, r]) =>
          `<path d="M${x} ${y - r}V${y - r - 12}" stroke="#6b3e26" stroke-width="3"/>` +
          `<circle cx="${x}" cy="${y}" r="${r}" fill="#8cc83a"/>` +
          `<path d="M${x} ${y - r + 2}C${x - 5} ${y - 4} ${x - 5} ${y + 4} ${x} ${y + r - 2}" stroke="#5a9a2a" stroke-width="2.5"/>` +
          `<path d="M${x + r * 0.35} ${y - r * 0.5}q${r * 0.3} ${r * 0.1} ${r * 0.4} ${r * 0.4}" stroke="#d4f09a" stroke-width="3"/>`,
      )
      .join(''),

  유자:
    scallop(50, 56, 36, 33, 22, 0.04, '#ffcf2a') +
    `<path d="M50 24C48 16 50 10 54 6" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M54 12C62 2 80 2 84 8C76 18 64 18 54 12Z" fill="#3a9e47"/>` +
    `<path d="M26 46C28 38 34 32 40 30" stroke="#fff1a0" stroke-width="4"/>` +
    [
      [34, 60],
      [46, 66],
      [60, 60],
      [70, 50],
      [56, 46],
      [42, 78],
      [60, 78],
      [74, 68],
      [30, 72],
      [44, 50],
    ]
      .map(([x, y]) => dot(x, y, 1.8, '#e0a800'))
      .join(''),

  자몽:
    `<circle cx="34" cy="38" r="26" fill="#ffb84a"/><path d="M20 30C22 24 26 20 32 18" stroke="#ffd98a" stroke-width="4"/>` +
    `<circle cx="60" cy="62" r="32" fill="#ffb84a"/><circle cx="60" cy="62" r="26" fill="#fff4dc" stroke-width="2.5"/>` +
    `<circle cx="60" cy="62" r="22" fill="#ff6a6a" stroke="none"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const t = (Math.PI * i) / 4;
        return `<path d="M60 62L${f(60 + 22 * Math.cos(t))} ${f(62 + 22 * Math.sin(t))}" stroke="#fff4dc" stroke-width="3"/>`;
      })
      .join('') +
    `<circle cx="60" cy="62" r="4" fill="#fff4dc" stroke="none"/>`,

  라임:
    `<path d="M10 42C14 26 30 20 42 22C54 24 64 34 60 50C56 64 40 70 28 66C16 62 8 54 10 42Z" fill="#5fb030"/>` +
    `<path d="M60 38l6-4M10 44l-5 3" stroke-width="3.5"/>` +
    `<path d="M20 36C22 32 26 29 30 28" stroke="#b0e07a" stroke-width="4"/>` +
    `<circle cx="64" cy="66" r="28" fill="#5fb030"/><circle cx="64" cy="66" r="23" fill="#e8f8c0" stroke="none"/>` +
    `<circle cx="64" cy="66" r="20" fill="#b8e06a" stroke="none"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const t = (Math.PI * i) / 4 + 0.3;
        return `<path d="M64 66L${f(64 + 20 * Math.cos(t))} ${f(66 + 20 * Math.sin(t))}" stroke="#e8f8c0" stroke-width="3"/>`;
      })
      .join('') +
    `<circle cx="64" cy="66" r="23"/>`,

  앵두:
    `<path d="M6 22C30 18 64 20 94 30" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M70 26C74 12 90 8 94 12C88 24 80 28 70 26Z" fill="#43b04a"/>` +
    `<path d="M22 20C20 8 30 2 36 4C36 14 30 20 22 20Z" fill="#43b04a"/>` +
    [
      [22, 44, 21],
      [40, 52, 20],
      [58, 46, 23],
      [74, 58, 29],
      [32, 72, 21],
      [52, 76, 21],
      [70, 82, 29],
    ]
      .map(([x, y, sy]) => `<path d="M${x} ${y - 9}L${x + 2} ${sy}" stroke="#6b3e26" stroke-width="2.5"/>`)
      .join('') +
    [
      [22, 44],
      [40, 52],
      [58, 46],
      [74, 58],
      [32, 72],
      [52, 76],
      [70, 82],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#ff2a3a"/><circle cx="${x - 3}" cy="${y - 3}" r="2.6" fill="#fff" stroke="none" opacity=".7"/>`)
      .join(''),

  산딸기:
    `<path d="M52 20C60 6 80 4 86 10C78 22 64 24 52 20Z" fill="#43b04a"/>` +
    [
      [34, 28, 1],
      [64, 40, 0.95],
    ]
      .map(([x, y, s]) => {
        const rows: [number, number][] = [
          [4, 0],
          [5, 9],
          [4, 18],
          [3, 27],
          [2, 35],
        ];
        let c = '';
        for (const [n, dy] of rows)
          for (let i = 0; i < n; i++)
            c += `<circle cx="${f(x + (i - (n - 1) / 2) * 9 * s)}" cy="${f(y + 8 + dy * s)}" r="${f(5.6 * s)}" fill="#e8305a" stroke-width="2.2"/>`;
        return (
          c +
          `<path d="M${x - 12 * s} ${y + 4}L${x - 4} ${y - 2}L${x} ${y + 4}L${x + 4} ${y - 2}L${x + 12 * s} ${y + 4}Q${x} ${y + 10} ${x - 12 * s} ${y + 4}Z" fill="#43b04a" stroke-width="2.5"/>`
        );
      })
      .join('') +
    `<circle cx="30" cy="40" r="1.8" fill="#fff" stroke="none" opacity=".7"/><circle cx="60" cy="52" r="1.8" fill="#fff" stroke="none" opacity=".7"/>`,

  건포도:
    `<path d="M14 24H46V78H14Z" fill="#e8403a"/>` +
    `<path d="M14 24L20 14H52L46 24Z" fill="#ff6a5a"/><path d="M46 24L52 14V68L46 78Z" fill="#c82a2a"/>` +
    `<ellipse cx="30" cy="50" rx="10" ry="12" fill="#ffd23f"/><circle cx="30" cy="48" r="5" fill="#5a2a4a" stroke-width="2"/>` +
    [
      [60, 86, 0],
      [74, 88, 30],
      [88, 84, -20],
      [66, 76, -40],
      [80, 74, 20],
      [54, 76, 50],
      [72, 64, 0],
    ]
      .map(
        ([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 7} ${y}C${x - 7} ${y - 6} ${x + 7} ${y - 7} ${x + 7} ${y}S${x - 7} ${y + 6} ${x - 7} ${y}Z" fill="#6a2e5a"/>` +
          `<path d="M${x - 3} ${y - 2}q3 3 6 0" stroke="#3a1a30" stroke-width="2"/></g>`,
      )
      .join(''),

  곶감:
    `<path d="M10 8H90" stroke-width="9"/><path d="M10 8H90" stroke="#9a5b2e" stroke-width="4"/>` +
    [30, 70]
      .map(
        (x) =>
          `<path d="M${x} 8V86" stroke="#c9a67a" stroke-width="2.5"/>` +
          [28, 54, 80]
            .map(
              (y) =>
                `<ellipse cx="${x}" cy="${y}" rx="16" ry="11" fill="#d9681e"/>` +
                `<path d="M${x - 8} ${y + 2}q8 4 16 0" stroke="#f2a060" stroke-width="2.5"/>` +
                `<path d="M${x - 7} ${y - 11}L${x} ${y - 7}L${x + 7} ${y - 11}L${x + 3} ${y - 13}H${x - 3}Z" fill="#6b5a2a" stroke-width="2"/>` +
                dot(x - 9, y - 2, 1.5, '#fff8e8') +
                dot(x + 8, y + 4, 1.5, '#fff8e8') +
                dot(x + 4, y - 4, 1.5, '#fff8e8'),
            )
            .join(''),
      )
      .join(''),

  호두과자:
    `<path d="M18 12H82L86 90H14Z" fill="#e8c890"/><path d="M18 12L26 22H74L82 12" stroke="#c9a060" stroke-width="3"/>` +
    [
      [30, 58],
      [70, 58],
      [50, 76],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="18" fill="#c67a2e"/>` +
          `<path d="M${x} ${y - 18}C${x - 3} ${y - 6} ${x + 3} ${y + 6} ${x} ${y + 18}" stroke="#8a4a1a" stroke-width="3"/>` +
          `<path d="M${x - 13} ${y - 6}q4-4 8 0M${x - 14} ${y + 5}q4 4 8 0M${x + 5} ${y - 6}q4-4 8 0M${x + 6} ${y + 5}q4 4 8 0" stroke="#8a4a1a" stroke-width="2.5"/>` +
          `<path d="M${x - 10} ${y - 12}q3-3 6-3" stroke="#f2b060" stroke-width="3"/>`,
      )
      .join(''),

  계란빵:
    `<path d="M10 54C10 40 26 36 50 36S90 40 90 54V74C90 84 74 88 50 88S10 84 10 74Z" fill="#f2b84a"/>` +
    `<path d="M10 54C10 64 26 70 50 70S90 64 90 54" stroke="#c98a2a" stroke-width="3"/>` +
    blob('#fff', [
      [50, 44, 20],
      [34, 48, 12],
      [66, 48, 12],
      [50, 30, 12],
    ]) +
    `<path d="M36 44C36 30 64 30 64 44C64 50 36 50 36 44Z" fill="#ffb000"/>` +
    `<path d="M42 38q3-3 7-3" stroke="#ffe08a" stroke-width="3"/>` +
    `<path d="M18 78q10 4 20 4" stroke="#ffd98a" stroke-width="3"/>`,

  인절미:
    plate(78, 44, 13, '#6fb5a0', '#5a9a88') +
    [
      [16, 56],
      [40, 58],
      [64, 56],
      [28, 36],
      [52, 36],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x}" y="${y}" width="22" height="20" rx="6" fill="#e8c060"/>` +
          dot(x + 6, y + 6, 1.8, '#fff1b8') +
          dot(x + 14, y + 10, 1.8, '#fff1b8') +
          dot(x + 8, y + 14, 1.8, '#fff1b8') +
          dot(x + 16, y + 4, 1.8, '#fff1b8'),
      )
      .join('') +
    `<path d="M70 44L88 14" stroke-width="6"/><path d="M70 44L88 14" stroke="#f2d9a0" stroke-width="2.5"/>`,

  가래떡:
    plate(76, 45, 14, '#3b8fe0', '#7ec8f0') +
    [
      [30, -8],
      [46, -4],
      [62, 0],
    ]
      .map(
        ([y, r]) =>
          `<g transform="rotate(${r} 50 ${y})"><rect x="8" y="${y}" width="84" height="15" rx="7.5" fill="#fff"/>` +
          `<ellipse cx="15" cy="${y + 7.5}" rx="4" ry="6" stroke="#dfe8f5" stroke-width="2.5"/>` +
          `<path d="M26 ${y + 4}H70" stroke="#eef3fa" stroke-width="3"/></g>`,
      )
      .join(''),

  꿀떡:
    plate(80, 44, 12, '#fff') +
    [
      [26, 66, '#fff'],
      [48, 68, '#ff9aa8'],
      [70, 66, '#8fd26a'],
      [36, 48, '#8fd26a'],
      [58, 48, '#fff'],
      [47, 30, '#ff9aa8'],
    ]
      .map(
        ([x, y, c]) =>
          `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><circle cx="${Number(x) - 4}" cy="${Number(y) - 4}" r="2.6" fill="#fff" stroke="none" opacity=".8"/>`,
      )
      .join('') +
    `<path d="M76 30C76 22 90 22 90 30C90 36 86 40 83 40S76 36 76 30Z" fill="#fff"/>` +
    `<path d="M79 30Q83 26 87 30" fill="#ffb000" stroke-width="2"/>` +
    `<path d="M82 40C82 46 84 48 84 52" stroke="#ffb000" stroke-width="4"/>`,

  시루떡:
    `<path d="M14 40L30 26H90L74 40Z" fill="#8a3a2e"/>` +
    [
      [34, 32],
      [48, 30],
      [62, 32],
      [76, 30],
      [44, 36],
      [60, 36],
    ]
      .map(([x, y]) => dot(x, y, 2.2, '#b85a48'))
      .join('') +
    `<path d="M74 40L90 26V74L74 88Z" fill="#e8e0d8"/>` +
    `<rect x="14" y="40" width="60" height="48" fill="#fff"/>` +
    `<path d="M14 40H74V50H14Z" fill="#8a3a2e"/><path d="M14 64H74V72H14Z" fill="#8a3a2e"/>` +
    `<path d="M74 40L90 26V34L74 50Z" fill="#6b2a20"/><path d="M74 64L90 50V58L74 72Z" fill="#6b2a20"/>` +
    [
      [22, 45],
      [36, 45],
      [52, 45],
      [66, 45],
      [28, 68],
      [44, 68],
      [60, 68],
    ]
      .map(([x, y]) => dot(x, y, 2, '#c86a58'))
      .join(''),

  약과:
    scallop(56, 62, 32, 24, 10, 0.16, '#a8561e') +
    `<ellipse cx="56" cy="62" rx="20" ry="14" stroke="#7a3a10" stroke-width="3"/>` +
    scallop(42, 36, 28, 21, 10, 0.16, '#b8642a') +
    `<ellipse cx="42" cy="36" rx="17" ry="12" stroke="#7a3a10" stroke-width="3"/>` +
    `<path d="M40 31C44 31 46 35 42 40C38 35 38 31 40 31Z" fill="#fff4dc" stroke-width="2"/>` +
    `<path d="M24 32q4-6 10-7" stroke="#e8904a" stroke-width="3"/>`,

  한과:
    `<path d="M8 72H92L84 90H16Z" fill="#c8332a"/><ellipse cx="50" cy="72" rx="42" ry="8" fill="#e8553d"/>` +
    [
      [28, 52, -20, '#fff'],
      [52, 58, 10, '#ff9aa8'],
      [72, 46, -35, '#ffe07a'],
      [40, 34, 25, '#ff9aa8'],
      [62, 26, -10, '#fff'],
    ]
      .map(
        ([x, y, r, c]) =>
          `<g transform="rotate(${r} ${x} ${y})">` +
          scallop(Number(x), Number(y), 19, 9, 16, 0.1, String(c)) +
          dot(Number(x) - 8, Number(y) - 2, 1.6, '#e8d8c0') +
          dot(Number(x), Number(y) + 2, 1.6, '#e8d8c0') +
          dot(Number(x) + 8, Number(y) - 2, 1.6, '#e8d8c0') +
          `</g>`,
      )
      .join(''),

  엿:
    [
      [28, '#e8a83a'],
      [-28, '#f0b848'],
    ]
      .map(
        ([r, c]) =>
          `<g transform="rotate(${r} 50 52)"><rect x="42" y="4" width="16" height="90" rx="4" fill="${c}"/>` +
          `<path d="M47 10V88M53 10V88" stroke="#c9862a" stroke-width="2.5"/>` +
          `<path d="M45 14V30" stroke="#fff1c4" stroke-width="3"/></g>`,
      )
      .join('') +
    sparkle(22, 26, 6) +
    sparkle(80, 80, 5),

  캐러멜:
    cube(14, 50, 26, '#b8702a', '#d9954a', '#8a4e1a') +
    cube(46, 60, 22, '#b8702a', '#d9954a', '#8a4e1a') +
    `<path d="M20 58h8" stroke="#e0a870" stroke-width="3"/>` +
    `<path d="M50 30L42 20V44Z" fill="#fff"/><path d="M86 30L94 20V44Z" fill="#fff"/>` +
    `<rect x="50" y="20" width="36" height="22" rx="4" fill="#fff"/>` +
    `<rect x="56" y="24" width="24" height="14" rx="2" fill="#c9803a" stroke-width="2"/>`,

  옥수수빵:
    `<path d="M14 88V52C14 34 30 24 50 24S86 34 86 52V88Z" fill="#ffd23f"/>` +
    [30, 40, 50, 60, 70]
      .map((x, i) =>
        [42, 54, 66, 78]
          .map((y) => `<ellipse cx="${x + (i % 2) * 0}" cy="${y + (i % 2) * 5}" rx="4" ry="3.2" fill="#ffb000" stroke-width="1.8"/>`)
          .join(''),
      )
      .join('') +
    `<path d="M20 50C22 40 28 34 36 31" stroke="#fff1a0" stroke-width="4"/>` +
    `<g transform="rotate(30 80 30)"><rect x="72" y="4" width="16" height="36" rx="8" fill="#ffc933"/>` +
    `<path d="M76 12h8M76 20h8M76 28h8" stroke="#e0a800" stroke-width="2"/>` +
    `<path d="M72 30C68 36 70 44 80 48C76 42 76 36 78 30Z" fill="#43b04a" stroke-width="2.5"/></g>`,

  감자튀김:
    [
      [28, 10, -12],
      [37, 6, -6],
      [46, 4, 0],
      [55, 6, 6],
      [64, 10, 12],
      [33, 16, 4],
      [51, 14, -4],
      [60, 18, 8],
      [42, 12, 10],
    ]
      .map(
        ([x, y, r]) =>
          `<rect x="${x - 4}" y="${y}" width="9" height="46" rx="2" fill="#ffd23f" transform="rotate(${r} ${x} 56)"/>`,
      )
      .join('') +
    `<path d="M20 42L80 42L72 92H28Z" fill="#e8403a"/>` +
    `<path d="M20 42Q50 58 80 42" fill="#c82a2a"/>` +
    `<path d="M26 60H74" stroke="#ff8a7a" stroke-width="3"/>`,

  고구마튀김:
    `<g transform="rotate(-18 72 24)"><path d="M46 24C54 12 88 12 96 24C88 36 54 36 46 24Z" fill="#a8407a"/>` +
    `<path d="M46 24H40M96 24H100" stroke-width="3"/><path d="M58 20q12-4 24 0" stroke="#d880b0" stroke-width="3"/></g>` +
    plate(84, 42, 10, '#fff') +
    [
      [30, 50, -15],
      [60, 62, 12],
      [34, 72, 5],
    ]
      .map(
        ([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})">` +
          scallop(x, y, 22, 15, 14, 0.12, '#e8a838') +
          `<ellipse cx="${x}" cy="${y}" rx="16" ry="10.5" fill="#a8407a"/>` +
          `<ellipse cx="${x}" cy="${y}" rx="13.5" ry="8.5" fill="#ffd23f" stroke="none"/>` +
          `<path d="M${x - 6} ${y - 3}q6-3 12 0" stroke="#fff1a0" stroke-width="2.5"/>` +
          `</g>`,
      )
      .join(''),

  새우튀김:
    plate(80, 44, 12, '#fff') +
    `<path d="M14 72C20 60 34 58 40 66C32 70 22 74 14 72Z" fill="#43b04a"/>` +
    friedShrimp(-4, -10, -20) +
    friedShrimp(6, 12, -10),

  오징어튀김:
    plate(80, 44, 12, '#fff') +
    [
      [32, 60, -10],
      [66, 60, 15],
      [49, 38, 0],
    ]
      .map(
        ([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})">` +
          scallop(x, y, 19, 15, 14, 0.12, '#f2b84a') +
          `<ellipse cx="${x}" cy="${y}" rx="9" ry="6.5" fill="#fff"/>` +
          `<circle cx="${x - 10}" cy="${y - 8}" r="2" fill="#ffd98a" stroke="none"/>` +
          `</g>`,
      )
      .join(''),
};
