// 물건 그림 묶음 (3단계 어휘: 학용품 도구·부엌 가전·전통 부엌살림·전통 옷차림과 장신구·옛 생활 도구). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리는 이렇게 구별한다:
//   가습기(위로 흰 김) / 제습기(아래 물통에 물이 모임) / 공기청정기(키 큰 기둥·둥근 바람구멍·양옆 바람)
//   전기포트(빨간 주전자+받침+전깃줄) / 커피포트(커피 머신 아래 갈색 커피가 든 유리 주전자)
//   전기밥솥(뚜껑 열린 흰 밥솥·흰 밥) / 압력밥솥(은색 솥·긴 손잡이·꼭지에서 칙칙 김·불 위) / 가마솥(검은 쇠솥·넓은 솥전·장작불)
//   절구(돌 절구+나무 공이로 콩콩) / 절구통(공이 없이 큰 나무 통만)
//   장독(항아리 하나) / 장독대(돌 단 위 항아리 여럿) / 김칫독(빨간 김치가 보이는 항아리) / 소금단지(흰 소금 더미) / 꿀단지(흘러내리는 꿀·벌)
//   호롱불(작은 흰 호롱병 위 불꽃) / 등잔(나무 받침대 위 기름 종지 불꽃) / 청사초롱(파랑·빨강 비단 초롱)
//   아궁이(흙벽 아치 구멍 속 장작불) / 화로(둥근 질그릇 위 숯불·부젓가락)
import { INK, SKIN, HL, dot, blob, sparkle, tube, drop, person } from '../pictureKit.ts';

const f = (n: number) => Number(n.toFixed(1));

/** 각도(위=0°, 시계 방향)와 반지름으로 점 */
const pol = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [f(cx + r * Math.sin(a)), f(cy - r * Math.cos(a))];
};

const steam = (x: number, y: number) =>
  `<path d="M${x - 6} ${y}c-4-4 4-7 0-12M${x + 6} ${y}c-4-4 4-7 0-12" stroke="#9aa6c4" stroke-width="3"/>`;

/** 불꽃 (x, y = 불꽃 밑) */
const flame = (x: number, y: number, s = 1) =>
  `<path d="M${x} ${f(y - 18 * s)}C${f(x + 10 * s)} ${f(y - 8 * s)} ${f(x + 9 * s)} ${y} ${x} ${y}S${f(x - 10 * s)} ${f(y - 8 * s)} ${x} ${f(y - 18 * s)}Z" fill="#ff9f1a"/>` +
  `<path d="M${x} ${f(y - 10 * s)}C${f(x + 5 * s)} ${f(y - 5 * s)} ${f(x + 4 * s)} ${f(y - 1 * s)} ${x} ${f(y - 1 * s)}S${f(x - 5 * s)} ${f(y - 5 * s)} ${x} ${f(y - 10 * s)}Z" fill="#ffd23f" stroke="none"/>`;

/** 옹기 항아리: cx 가운데, top 입 높이, w 배 너비, h 키. lid = 뚜껑 색('' 이면 뚜껑 없음) */
function jar(cx: number, top: number, w: number, h: number, body = '#7a4526', lid = '#9a5b2e'): string {
  const a = w / 2;
  const m = f(a * 0.55);
  const b = f(a * 0.6);
  return (
    `<path d="M${f(cx - m)} ${top}C${f(cx - a * 1.1)} ${f(top + h * 0.12)} ${f(cx - a * 1.12)} ${f(top + h * 0.62)} ${f(cx - b)} ${f(top + h)}H${f(cx + b)}C${f(cx + a * 1.12)} ${f(top + h * 0.62)} ${f(cx + a * 1.1)} ${f(top + h * 0.12)} ${f(cx + m)} ${top}Z" fill="${body}"/>` +
    `<path d="M${f(cx - a * 0.72)} ${f(top + h * 0.4)}Q${cx} ${f(top + h * 0.52)} ${f(cx + a * 0.72)} ${f(top + h * 0.4)}" stroke="#c98b4f" stroke-width="3"/>` +
    `<path d="M${f(cx - a * 0.62)} ${f(top + h * 0.2)}Q${f(cx - a * 0.8)} ${f(top + h * 0.35)} ${f(cx - a * 0.66)} ${f(top + h * 0.6)}" stroke="#b27049" stroke-width="3"/>` +
    (lid
      ? `<path d="M${f(cx - m - 4)} ${top}Q${cx} ${f(top - Math.max(8, h * 0.2))} ${f(cx + m + 4)} ${top}Z" fill="${lid}"/>` +
        `<ellipse cx="${cx}" cy="${f(top - Math.max(8, h * 0.2) / 2 - 1)}" rx="4" ry="2.5" fill="${lid}" stroke-width="2.5"/>`
      : '')
  );
}

/** 주판 알 */
const bead = (x: number, y: number) =>
  `<path d="M${x - 6} ${y}L${x - 2} ${y - 4}H${x + 2}L${x + 6} ${y}L${x + 2} ${y + 4}H${x - 2}Z" fill="#e8553d" stroke-width="2.2"/>`;

/** 병풍 한 폭 (x0~x1, 윗선 y0→y1, 키 h) + 그림 */
function panel(x0: number, y0: number, x1: number, y1: number, h: number, paper: string, art: string): string {
  const i = 3;
  return (
    `<path d="M${x0} ${y0}L${x1} ${y1}V${y1 + h}L${x0} ${y0 + h}Z" fill="#9a5b2e"/>` +
    `<path d="M${x0 + i} ${y0 + i + (y1 - y0) * 0.1}L${x1 - i} ${y1 + i - (y1 - y0) * 0.1}V${y1 + h - i - (y1 - y0) * 0.1}L${x0 + i} ${y0 + h - i + (y1 - y0) * 0.1}Z" fill="${paper}" stroke-width="2"/>` +
    art
  );
}

/** 새끼줄: 꼬인 가닥을 줄 따라 늘어놓는다 */
function rope(): string {
  let s = '';
  for (let i = 0; i <= 13; i++) {
    const t = i / 13;
    const x = f(14 + t * 72);
    const y = f(52 - 22 * Math.sin(t * Math.PI * 1.6 - 0.4));
    const dy = -22 * Math.cos(t * Math.PI * 1.6 - 0.4) * Math.PI * 1.6;
    const ang = f((Math.atan2(dy, 72) * 180) / Math.PI + 90 + 35);
    s += `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="9" transform="rotate(${ang} ${x} ${y})" fill="${i % 2 ? '#e0b862' : '#d19a4c'}" stroke-width="2.5"/>`;
  }
  return s;
}

export const PICS: Record<string, string> = {
  각도기: (() => {
    let t = '';
    for (let i = 0; i <= 18; i++) {
      const d = -90 + i * 10;
      const inner = i % 9 === 0 ? 29 : i % 3 === 0 ? 33 : 37;
      const [x1, y1] = pol(50, 70, 42, d);
      const [x2, y2] = pol(50, 70, inner, d);
      t += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke-width="${i % 3 === 0 ? 3 : 2}"/>`;
    }
    return (
      `<path d="M8 70A42 42 0 0 1 92 70V80H8Z" fill="#bfe6ff"/>` +
      `<path d="M28 70A22 22 0 0 1 72 70Z" fill="#fff7e0" stroke-width="2.5"/>` +
      t +
      `<path d="M14 75H86" stroke-width="2"/>` +
      `<path d="M50 62V78M42 70H58" stroke="#e8553d" stroke-width="3"/>` +
      `<path d="M4 88H96" stroke="#3b78e6" stroke-width="3"/>`
    );
  })(),
  컴퍼스:
    `<path d="M24 88A46 46 0 0 1 82 68" stroke="#3b78e6" stroke-width="3.5" stroke-dasharray="6 5"/>` +
    `<g transform="rotate(20 50 22)">` +
    tube('M50 22V82', '#8a96b0', 6) +
    `<path d="M50 84V94" stroke-width="3"/></g>` +
    `<g transform="rotate(-22 50 22)">` +
    tube('M50 22V56', '#8a96b0', 6) +
    `<rect x="44" y="54" width="12" height="8" rx="2" fill="#3b78e6"/>` +
    `<rect x="45" y="62" width="10" height="20" fill="${HL}"/>` +
    `<path d="M45 82L50 92L55 82Z" fill="${SKIN}"/><path d="M48.5 89L50 92L51.5 89Z" fill="${INK}"/></g>` +
    `<rect x="45" y="4" width="10" height="13" rx="3" fill="#3b78e6"/>` +
    `<circle cx="50" cy="22" r="7" fill="${HL}"/>` +
    dot(50, 22, 2.2),
  주판: (() => {
    let s =
      `<rect x="6" y="16" width="88" height="70" rx="5" fill="#9a5b2e"/>` +
      `<rect x="12" y="22" width="76" height="58" rx="2" fill="#fff1d6"/>`;
    const xs = [21, 35, 50, 65, 79];
    for (const x of xs) s += `<path d="M${x} 22V80" stroke="#6b3e26" stroke-width="2.5"/>`;
    s += `<rect x="12" y="36" width="76" height="5" fill="#6b3e26" stroke-width="2"/>`;
    const up = [1, 0, 1, 0, 0];
    const down = [2, 4, 0, 3, 1];
    xs.forEach((x, k) => {
      s += bead(x, up[k] ? 31 : 27);
      for (let j = 0; j < 4; j++) {
        const pushed = j < down[k];
        s += bead(x, pushed ? 47 + j * 8 : 53 + j * 8 + (j >= down[k] ? 0 : 0));
      }
    });
    return s;
  })(),
  식기세척기:
    `<rect x="12" y="6" width="76" height="72" rx="6" fill="#dfe8f5"/>` +
    `<path d="M12 22V12C12 8 15 6 18 6H82C85 6 88 8 88 12V22Z" fill="#8a96b0"/>` +
    dot(22, 14, 2.6, '#43b04a') + `<rect x="54" y="11" width="26" height="6" rx="2" fill="#30354f" stroke-width="2"/>` +
    `<rect x="19" y="27" width="62" height="47" rx="3" fill="#bfe0f7"/>` +
    [30, 43, 56, 69].map((x) => `<circle cx="${x}" cy="50" r="13" fill="#fff"/><circle cx="${x}" cy="50" r="7" stroke="#7ec8f0" stroke-width="2.5"/>`).join('') +
    `<path d="M21 64H79M26 64V72M38 64V72M50 64V72M62 64V72M74 64V72" stroke="#8a96b0" stroke-width="3"/>` +
    `<circle cx="28" cy="32" r="3.5" fill="#fff" stroke-width="2"/><circle cx="74" cy="33" r="3" fill="#fff" stroke-width="2"/>` +
    sparkle(80, 30, 5, '#fff') +
    `<path d="M12 78H88L95 92H5Z" fill="#fff"/><rect x="38" y="83" width="24" height="4" rx="2" fill="#8a96b0" stroke-width="2"/>`,
  정수기:
    `<rect x="24" y="6" width="52" height="88" rx="10" fill="#fff"/>` +
    `<path d="M50 12C45 20 42 24 42 27.5A8 8 0 0 0 58 27.5C58 24 55 20 50 12Z" fill="#4aa8f0"/>` +
    `<circle cx="36" cy="40" r="4" fill="#3b8fe0" stroke-width="2.5"/><circle cx="64" cy="40" r="4" fill="#e8553d" stroke-width="2.5"/>` +
    `<rect x="31" y="47" width="38" height="36" rx="5" fill="#dfe8f5"/>` +
    `<rect x="44" y="47" width="12" height="8" rx="2" fill="#8a96b0"/>` +
    `<path d="M50 56V70" stroke="#4aa8f0" stroke-width="4"/>` +
    `<path d="M40 64H60L57 81H43Z" fill="#fff"/><path d="M41.5 71H58.5L57 81H43Z" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<rect x="31" y="80" width="38" height="5" rx="2" fill="#8a96b0" stroke-width="2.5"/>`,
  가습기:
    blob('#f4f9ff', [[40, 20, 7], [51, 15, 8], [62, 20, 7]]) +
    `<path d="M36 12c-4-3-2-7 1-8M66 12c4-3 2-7-1-8" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="42" y="25" width="16" height="10" rx="3" fill="#7ec8f0"/>` +
    `<path d="M30 92H70C74 92 76 88 76 84V52C76 40 64 34 50 34S24 40 24 52V84C24 88 26 92 30 92Z" fill="#fff"/>` +
    `<rect x="32" y="56" width="36" height="28" rx="4" fill="#dff3ff"/>` +
    `<path d="M32.5 68Q41 64 50 68T67.5 68V83.5H32.5Z" fill="#4aa8f0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="46" r="4" fill="#43b04a" stroke-width="2.5"/>` +
    drop(18, 22, 0.8) + drop(82, 22, 0.8),
  제습기:
    drop(10, 20, 0.8) + drop(12, 42, 0.8) +
    `<path d="M16 32H22" stroke="#3b78e6" stroke-width="4"/><path d="M19 27L24 32L19 37" stroke="#3b78e6" stroke-width="4"/>` +
    `<rect x="24" y="8" width="56" height="86" rx="8" fill="#dfe8f5"/>` +
    `<rect x="31" y="14" width="42" height="26" rx="3" fill="#fff"/>` +
    `<path d="M35 20H69M35 27H69M35 34H69" stroke="#8a96b0" stroke-width="3"/>` +
    dot(52, 47, 2.8, '#3b8fe0') +
    `<rect x="30" y="54" width="44" height="34" rx="5" fill="#fff"/>` +
    `<path d="M30.5 70Q41 66 52 70T73.5 70V83C73.5 86 72 87.5 69 87.5H35C32 87.5 30.5 86 30.5 83Z" fill="#4aa8f0" stroke-width="2.5"/>` +
    `<path d="M44 59H60" stroke-width="4"/>` +
    drop(52, 72, 0.9).replace('#4aa8f0', '#fff'),
  공기청정기:
    `<path d="M20 22c-9 0-12 8-6 11M80 22c9 0 12 8 6 11M18 44c-8 1-8 9-2 10M82 44c8 1 8 9 2 10" stroke="#7ec8f0" stroke-width="4"/>` +
    `<rect x="26" y="6" width="48" height="88" rx="12" fill="#fff"/>` +
    `<circle cx="50" cy="25" r="13" fill="#dfe8f5"/><circle cx="50" cy="25" r="6" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M50 12V19M50 31V38M37 25H44M56 25H63" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M50 50C40 52 38 62 42 68C50 68 58 62 50 50Z" fill="#43b04a"/><path d="M42 68Q46 60 50 55" stroke-width="2"/>` +
    [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => dot(36 + c * 9.3, 76 + r * 6, 1.8, '#8a96b0')).join('')).join('') +
    sparkle(16, 70, 5) + sparkle(84, 70, 5),
  전기포트:
    steam(14, 22) +
    `<path d="M36 40L14 28L20 25L37 32Z" fill="#e8553d"/>` +
    tube('M64 38H74C79 38 80 42 80 46V64C80 70 77 72 70 72', '#30354f', 6) +
    `<path d="M30 82L34 32H64L70 82Z" fill="#e8553d"/>` +
    `<path d="M34 32C36 22 62 22 64 32Z" fill="#dfe8f5"/><rect x="45" y="18" width="8" height="6" rx="2" fill="#30354f" stroke-width="2.5"/>` +
    `<rect x="40" y="44" width="7" height="28" rx="3" fill="#bfe6ff" stroke-width="2.5"/><path d="M40.5 60H46.5" stroke="#4aa8f0" stroke-width="3"/>` +
    `<rect x="22" y="80" width="56" height="10" rx="3" fill="#30354f"/>` +
    dot(34, 85, 2.3, HL) +
    `<path d="M78 86C88 86 86 94 94 93" stroke-width="3"/>`,
  커피포트:
    `<path d="M16 8H84V24H72V84H84V94H16V84H62V24H16Z" fill="#8a96b0"/>` +
    `<rect x="16" y="8" width="56" height="16" rx="3" fill="#30354f"/>` +
    dot(24, 16, 2.4, '#e8553d') +
    `<path d="M40 24V34" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M26 40H56L60 76C60 82 56 84 52 84H30C26 84 22 82 22 76Z" fill="#dff3ff"/>` +
    `<path d="M24.3 58H57.8L60 76C60 82 56 84 52 84H30C26 84 22 82 22 76Z" fill="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M26 58H56" stroke-width="3"/>` +
    `<rect x="24" y="36" width="34" height="7" rx="2" fill="#30354f"/>` +
    tube('M58 48C66 48 66 72 58 72', '#30354f', 4) +
    `<path d="M29 64V76" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    `<path d="M88 46c-4-4 4-7 0-12" stroke="#9aa6c4" stroke-width="3"/>`,
  전기밥솥:
    `<ellipse cx="50" cy="28" rx="34" ry="18" fill="#dfe8f5"/><ellipse cx="50" cy="28" rx="26" ry="12" fill="#fff" stroke-width="2.5"/>` +
    steam(50, 38) +
    `<path d="M14 48V78C14 86 20 92 28 92H72C80 92 86 86 86 78V48Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="48" rx="36" ry="10" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="49" rx="29" ry="7" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M24 49C28 42 72 42 76 49" fill="#fff" stroke-width="2.5"/>` +
    [[38, 45], [46, 44], [55, 44], [63, 45], [42, 48], [51, 48], [59, 48]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#e6e6e6" stroke="none"/>`).join('') +
    `<rect x="34" y="62" width="32" height="18" rx="6" fill="#30354f"/><rect x="39" y="66" width="12" height="6" rx="2" fill="#7ec8f0" stroke-width="2"/>` +
    dot(58, 69, 2.6, '#e8553d') +
    `<path d="M14 86H86" stroke="none"/>`,
  압력밥솥:
    flame(28, 94, 0.6) + flame(40, 94, 0.7) + flame(52, 94, 0.6) +
    `<rect x="10" y="44" width="60" height="36" rx="6" fill="#cfd8e6"/>` +
    `<path d="M14 58H66" stroke="#fff" stroke-width="3"/>` +
    `<path d="M8 46C8 34 24 30 40 30S72 34 72 46Z" fill="#dfe8f5"/>` +
    tube('M68 38H92', '#30354f', 7) + tube('M68 54H92', '#30354f', 7) +
    tube('M4 56H10', '#30354f', 6) +
    `<rect x="35" y="20" width="10" height="10" rx="2" fill="#30354f"/><circle cx="40" cy="18" r="4" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M34 12l-6-5M40 10V3M46 12l6-5" stroke="#9aa6c4" stroke-width="3"/>` +
    blob('#f4f9ff', [[24, 10, 4], [58, 10, 4]]),
  가마솥:
    flame(34, 96, 0.55) + flame(50, 96, 0.7) + flame(66, 96, 0.55) +
    `<path d="M26 92L74 84M26 84L74 92" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M18 52C18 72 30 84 50 84S82 72 82 52Z" fill="#3a3f5c"/>` +
    `<path d="M26 60Q30 72 40 78" stroke="#8a96b0" stroke-width="3"/>` +
    `<ellipse cx="50" cy="52" rx="44" ry="8" fill="#4a506e"/>` +
    `<path d="M20 50C22 30 78 30 80 50Z" fill="#4a506e"/>` +
    `<path d="M34 38Q42 33 50 33" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M42 30C42 22 58 22 58 30Z" fill="#30354f"/>` +
    steam(16, 44) + steam(84, 44),
  거름망: (() => {
    const cx = 44, cy = 40, r = 32;
    let m = '';
    for (let x = cx - 24; x <= cx + 24; x += 8) {
      const y = f(cy + Math.sqrt(r * r - (x - cx) ** 2));
      m += `<path d="M${x} ${cy}V${y - 1}" stroke="#8a96b0" stroke-width="2"/>`;
    }
    for (const y of [50, 60, 68]) {
      const hw = f(Math.sqrt(r * r - (y - cy) ** 2) - 1);
      m += `<path d="M${f(cx - hw)} ${y}H${f(cx + hw)}" stroke="#8a96b0" stroke-width="2"/>`;
    }
    return (
      tube('M76 40H94', '#30354f', 6) +
      `<path d="M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}Z" fill="#f4f9ff"/>` +
      m +
      `<path d="M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}" stroke-width="3.5"/>` +
      `<path d="M${cx - r - 2} ${cy}H${cx + r + 2}" stroke-width="6"/>` +
      `<path d="M22 38C24 30 30 28 36 32C40 26 50 26 54 32C60 28 66 32 66 38Z" fill="#43b04a"/>` +
      drop(34, 76, 0.8) + drop(48, 80, 0.8) + drop(60, 74, 0.7)
    );
  })(),
  강판: (() => {
    let h = '';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) h += `<path d="M${38 + c * 10} ${26 + r * 9}q4-4 8 0" fill="#fff" stroke-width="2.2"/>`;
    return (
      `<g transform="rotate(-10 50 50)">` +
      `<rect x="38" y="4" width="24" height="12" rx="6" fill="#dfe8f5"/><rect x="44" y="8" width="12" height="4" rx="2" fill="#fff7e0" stroke-width="2"/>` +
      `<rect x="30" y="14" width="40" height="68" rx="4" fill="#cfd8e6"/>` +
      h +
      `</g>` +
      `<g transform="rotate(-30 70 48)"><rect x="60" y="30" width="20" height="36" rx="8" fill="#ff9f1a"/><path d="M64 32C62 24 68 22 70 26C72 20 78 22 76 30" fill="#43b04a" stroke-width="2.5"/></g>` +
      `<ellipse cx="50" cy="88" rx="34" ry="6" fill="#fff"/>` +
      `<path d="M36 86l4-3M44 88l5-3M52 86l4-4M60 88l4-3M40 90l4-2M56 90l4-2" stroke="#ff9f1a" stroke-width="3"/>`
    );
  })(),
  절구:
    `<g transform="rotate(12 56 40)">` +
    `<path d="M50 8H62C64 8 64 10 64 12V26C64 30 60 32 60 36V58C60 62 64 64 64 68V76H48V68C48 64 52 62 52 58V36C52 32 48 30 48 26V12C48 10 48 8 50 8Z" fill="#b87a45"/>` +
    `<path d="M48 22H64M48 70H64" stroke="#6b3e26" stroke-width="2.5"/>` +
    `</g>` +
    `<path d="M24 16l-6-4M22 26h-8M80 14l6-4" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M16 60C16 80 30 88 50 88S84 80 84 60Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="60" rx="34" ry="9" fill="#b8c2d4"/><ellipse cx="50" cy="61" rx="25" ry="5.5" fill="#5a6178" stroke-width="2.5"/>` +
    `<path d="M32 61C36 56 46 56 50 58" fill="#fff" stroke-width="2.5"/>` +
    `<rect x="30" y="86" width="40" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M26 72Q30 80 38 82" stroke="#b8c2d4" stroke-width="3"/>`,
  맷돌:
    `<ellipse cx="50" cy="80" rx="44" ry="11" fill="#c98b4f"/><ellipse cx="50" cy="78" rx="36" ry="7" fill="#b87a45" stroke-width="2.5"/>` +
    `<path d="M16 62V70C16 80 84 80 84 70V62Z" fill="#8a96b0"/>` +
    `<path d="M22 70C24 78 28 80 30 88" stroke="#fff" stroke-width="5"/><path d="M28 86q2 3 4 0" fill="#fff" stroke-width="2"/>` +
    `<ellipse cx="50" cy="62" rx="34" ry="9" fill="#b8c2d4"/>` +
    `<path d="M20 40V54C20 64 80 64 80 54V40Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="40" rx="30" ry="8" fill="#b8c2d4"/>` +
    `<ellipse cx="40" cy="40" rx="6" ry="3" fill="#5a6178" stroke-width="2.5"/>` +
    dot(38, 30, 3, '#f2c14e') + dot(46, 28, 3, '#f2c14e') + dot(42, 22, 3, '#f2c14e') +
    `<circle cx="38" cy="30" r="3.5" fill="#f2c14e" stroke-width="2"/><circle cx="47" cy="27" r="3.5" fill="#f2c14e" stroke-width="2"/><circle cx="41" cy="20" r="3.5" fill="#f2c14e" stroke-width="2"/>` +
    tube('M78 50H88V16', '#9a5b2e', 6),
  장독:
    jar(50, 22, 64, 70, '#7a4526', '#9a5b2e') +
    `<ellipse cx="50" cy="93" rx="30" ry="3" fill="#b8c2d4" stroke="none"/>`,
  장독대:
    `<path d="M6 78H94L90 92H10Z" fill="#b8c2d4"/><path d="M30 78L28 92M52 78V92M74 78L76 92" stroke="#8a96b0" stroke-width="3"/>` +
    jar(22, 52, 26, 26, '#7a4526', '#9a5b2e') +
    jar(78, 56, 22, 22, '#7a4526', '#9a5b2e') +
    jar(50, 34, 40, 44, '#6b3e26', '#9a5b2e'),
  김칫독:
    `<path d="M62 30L84 20L90 26L70 40Z" fill="#9a5b2e"/>` +
    jar(46, 30, 62, 62, '#7a4526', '') +
    `<ellipse cx="46" cy="30" rx="19" ry="5" fill="#5a3b24"/>` +
    `<path d="M28 30C26 16 36 10 42 16C44 8 56 8 58 16C64 12 70 20 64 30Z" fill="#e8553d"/>` +
    `<path d="M36 22C38 18 42 18 44 22M50 18C52 14 56 16 56 20" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M40 16C40 10 46 8 48 12" fill="#5fc24a" stroke-width="2.5"/>` +
    dot(34, 26, 1.8, '#9a2a1a') + dot(58, 24, 1.8, '#9a2a1a'),
  소쿠리:
    `<circle cx="34" cy="40" r="10" fill="#43b04a"/><path d="M28 36q6 4 12 0" stroke="#2f7a34" stroke-width="2.5"/>` +
    `<circle cx="66" cy="40" r="10" fill="#43b04a"/><path d="M60 36q6 4 12 0" stroke="#2f7a34" stroke-width="2.5"/>` +
    `<path d="M40 44C40 30 52 26 58 28C52 32 48 38 48 46Z" fill="#e8553d"/>` +
    `<circle cx="50" cy="42" r="9" fill="#e8862e"/>` +
    `<path d="M8 46C10 74 28 88 50 88S90 74 92 46Z" fill="#e0b36a"/>` +
    [58, 68, 78].map((y) => `<path d="M${y === 58 ? 12 : y === 68 ? 16 : 24} ${y}Q50 ${y + 8} ${y === 58 ? 88 : y === 68 ? 84 : 76} ${y}" stroke="#a8742e" stroke-width="3"/>`).join('') +
    [22, 34, 46, 58, 70].map((x) => `<path d="M${x} ${50}L${x + 8} 84" stroke="#a8742e" stroke-width="3"/>`).join('') +
    `<ellipse cx="50" cy="47" rx="42" ry="7" fill="#c98b4f"/>`,
  합죽선: (() => {
    const cx = 50, cy = 80, R = 50, r0 = 17;
    const n = 12;
    const a0 = -64, a1 = 64;
    let s = '';
    for (let i = 0; i < n; i++) {
      const d1 = a0 + ((a1 - a0) * i) / n;
      const d2 = a0 + ((a1 - a0) * (i + 1)) / n;
      const [ox1, oy1] = pol(cx, cy, R, d1);
      const [ox2, oy2] = pol(cx, cy, R, d2);
      const [ix1, iy1] = pol(cx, cy, r0, d1);
      const [ix2, iy2] = pol(cx, cy, r0, d2);
      s += `<path d="M${ix1} ${iy1}L${ox1} ${oy1}A${R} ${R} 0 0 1 ${ox2} ${oy2}L${ix2} ${iy2}A${r0} ${r0} 0 0 0 ${ix1} ${iy1}Z" fill="${i % 2 ? '#fff' : '#fdf1e0'}" stroke-width="1.5"/>`;
    }
    let ribs = '';
    for (let i = 0; i <= n; i++) {
      const d = a0 + ((a1 - a0) * i) / n;
      const [x1, y1] = pol(cx, cy, 3, d);
      const [x2, y2] = pol(cx, cy, r0, d);
      ribs += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#9a5b2e" stroke-width="3"/>`;
    }
    const [lx, ly] = pol(cx, cy, R + 1, a0);
    const [rx, ry] = pol(cx, cy, R + 1, a1);
    const [ox, oy] = pol(cx, cy, R, a0);
    const [ex, ey] = pol(cx, cy, R, a1);
    return (
      `<path d="M50 84C48 88 44 90 44 94M50 84C52 88 56 90 56 94" stroke="#e8553d" stroke-width="3"/><path d="M46 86H54L55 95H45Z" fill="#e8553d" stroke-width="2.5"/>` +
      s +
      `<path d="M${ox} ${oy}A${R} ${R} 0 0 1 ${ex} ${ey}" stroke-width="4"/>` +
      ribs +
      tube(`M${cx} ${cy}L${lx} ${ly}`, '#9a5b2e', 3) +
      tube(`M${cx} ${cy}L${rx} ${ry}`, '#9a5b2e', 3) +
      `<path d="M24 58Q40 44 52 46T74 40" stroke="#6b3e26" stroke-width="3"/><path d="M40 48L38 40M60 44L62 36" stroke="#6b3e26" stroke-width="2.5"/>` +
      [[32, 52], [38, 40], [50, 45], [62, 36], [70, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.8" fill="#ff9aa8" stroke-width="2"/>`).join('') +
      `<circle cx="${cx}" cy="${cy}" r="4" fill="${HL}" stroke-width="2.5"/>`
    );
  })(),
  노리개:
    `<path d="M50 4C43 4 43 13 50 13C57 13 57 4 50 4" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 13V18" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 17L57 24L50 31L43 24Z" fill="#e8553d"/><circle cx="40" cy="24" r="3.5" fill="#e8553d" stroke-width="2.5"/><circle cx="60" cy="24" r="3.5" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M50 31V36" stroke="#e8553d" stroke-width="3"/>` +
    `<path d="M50 46C44 34 26 32 26 44C26 52 38 54 50 48C62 54 74 52 74 44C74 32 56 34 50 46Z" fill="#43b04a"/>` +
    `<path d="M50 46C42 50 32 60 38 64C42 66 48 58 50 50C52 58 58 66 62 64C68 60 58 50 50 46Z" fill="#5fc24a"/>` +
    `<circle cx="50" cy="46" r="5" fill="#ffd23f"/>` +
    `<path d="M50 56V62" stroke="#e8553d" stroke-width="3"/>` +
    `<rect x="42" y="60" width="16" height="8" rx="3" fill="#ffd23f"/>` +
    `<path d="M42 68H58L64 95H36Z" fill="#e8553d"/>` +
    `<path d="M44 72L41 93M48 72L47 93M52 72L53 93M56 72L59 93" stroke="#ff9a8a" stroke-width="2.5"/>`,
  갓:
    `<circle cx="50" cy="66" r="20" fill="${SKIN}"/>` +
    dot(43, 64, 2.4) + dot(57, 64, 2.4) +
    `<path d="M42 72C46 70 49 71 50 72C51 71 54 70 58 72" stroke-width="3"/>` +
    `<path d="M44 80C44 88 56 88 56 80C53 82 47 82 44 80Z" fill="#30354f" stroke-width="2.5"/>` +
    `<path d="M34 48C28 64 36 86 50 92C64 86 72 64 66 48" stroke="#30354f" stroke-width="2.5"/>` +
    [[31, 62], [34, 74], [40, 84], [60, 84], [66, 74], [69, 62]].map(([x, y]) => dot(x, y, 2.4, '#8e4fc9')).join('') +
    `<ellipse cx="50" cy="47" rx="45" ry="9" fill="#3a3f5c"/>` +
    `<ellipse cx="50" cy="46" rx="36" ry="5" stroke="#6a7090" stroke-width="2"/>` +
    `<path d="M37 47V20C37 13 63 13 63 20V47Z" fill="#3a3f5c"/>` +
    `<path d="M41 22V42" stroke="#6a7090" stroke-width="2.5"/>`,
  비녀:
    `<circle cx="23" cy="38" r="6" fill="${SKIN}"/><circle cx="77" cy="38" r="6" fill="${SKIN}"/>` +
    `<path d="M22 96C22 86 32 82 50 82S78 86 78 96Z" fill="#ff9aa8"/><rect x="42" y="70" width="16" height="14" fill="${SKIN}"/>` +
    `<circle cx="50" cy="32" r="26" fill="#5a3b24"/>` +
    `<path d="M34 16Q50 10 66 16M28 30Q50 22 72 30" stroke="#8a5a3a" stroke-width="3"/>` +
    `<circle cx="50" cy="66" r="18" fill="#5a3b24"/>` +
    `<path d="M38 62Q50 54 62 62M40 74Q50 80 60 74" stroke="#8a5a3a" stroke-width="3"/>` +
    tube('M20 66H86', '#ffd23f', 5) +
    `<path d="M86 63.5L96 66L86 68.5Z" fill="#ffd23f" stroke-width="2.5"/>` +
    [0, 72, 144, 216, 288].map((d) => {
      const [x, y] = pol(16, 66, 7, d);
      return `<circle cx="${x}" cy="${y}" r="5.5" fill="#ff5c70" stroke-width="2.5"/>`;
    }).join('') +
    `<circle cx="16" cy="66" r="4" fill="#ffd23f" stroke-width="2.5"/>`,
  댕기:
    [0, 1, 2, 3, 4].map((i) => {
      const y = 8 + i * 10;
      return `<ellipse cx="${i % 2 ? 53 : 47}" cy="${y + 5}" rx="9" ry="7" transform="rotate(${i % 2 ? 25 : -25} ${i % 2 ? 53 : 47} ${y + 5})" fill="#5a3b24"/>`;
    }).join('') +
    `<path d="M50 56C38 50 26 52 28 60C30 66 40 64 50 60C60 64 70 66 72 60C74 52 62 50 50 56Z" fill="#e8553d"/>` +
    `<path d="M40 60H60L62 95L50 86L38 95Z" fill="#e8553d"/>` +
    `<rect x="45" y="54" width="10" height="9" rx="3" fill="#c7392a"/>` +
    `<circle cx="50" cy="72" r="4" fill="#ffd23f" stroke-width="2"/><path d="M44 80H56M43 66H57" stroke="#ffd23f" stroke-width="3"/>`,
  족두리:
    `<circle cx="50" cy="68" r="24" fill="${SKIN}"/>` +
    `<path d="M26 64C26 44 38 40 50 40S74 44 74 64C68 54 60 50 50 50S32 54 26 64Z" fill="#30354f"/>` +
    `<path d="M42 70q3 2 6 0M52 70q3 2 6 0" stroke-width="2.5"/><path d="M46 80q4 3 8 0" stroke-width="2.5"/>` +
    dot(34, 76, 4, '#e8553d') + dot(66, 76, 4, '#e8553d') + dot(50, 57, 2.8, '#e8553d') +
    `<path d="M34 46L38 22H62L66 46Z" fill="#30354f"/>` +
    `<path d="M36 36H64" stroke="#ffd23f" stroke-width="4"/>` +
    `<path d="M50 22V12M40 22L34 12M60 22L66 12" stroke="#ffd23f" stroke-width="3"/>` +
    `<circle cx="50" cy="10" r="4.5" fill="#e8553d" stroke-width="2.5"/><circle cx="33" cy="11" r="4" fill="#3b8fe0" stroke-width="2.5"/><circle cx="67" cy="11" r="4" fill="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="50" cy="29" r="3.5" fill="#ff5c70" stroke-width="2"/><circle cx="42" cy="42" r="3" fill="#ffd23f" stroke-width="2"/><circle cx="58" cy="42" r="3" fill="#ffd23f" stroke-width="2"/>`,
  꽃신: (() => {
    const shoe = (x: number, y: number, body: string, trim: string, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${f(3.5 / s)}">` +
      `<path d="M2 14C0 22 4 28 12 28H50C60 28 66 20 68 6C62 12 56 14 48 14C36 14 26 8 16 8C8 8 3 10 2 14Z" fill="${body}"/>` +
      `<path d="M4 14C14 18 32 18 46 14" stroke="${trim}" stroke-width="${f(4 / s)}"/>` +
      `<path d="M6 28H50C58 28 64 22 66 12" stroke="${trim}" stroke-width="${f(3 / s)}"/>` +
      [0, 72, 144, 216, 288].map((d) => {
        const [px, py] = pol(34, 21, 3.6, d);
        return `<circle cx="${px}" cy="${py}" r="2.8" fill="#fff" stroke-width="${f(1.5 / s)}"/>`;
      }).join('') +
      `<circle cx="34" cy="21" r="2" fill="#ffd23f" stroke-width="${f(1.5 / s)}"/>` +
      `</g>`;
    return shoe(24, 26, '#3b8fe0', '#1f5fa8', 1.05) + shoe(6, 54, '#ff5c70', '#c7392a', 1.25);
  })(),
  멍석:
    `<path d="M4 90L18 52H82L96 90Z" fill="#e8c77a"/>` +
    [60, 70, 80].map((y) => {
      const t = (y - 52) / 38;
      return `<path d="M${f(18 - 14 * t)} ${y}H${f(82 + 14 * t)}" stroke="#b8893a" stroke-width="2.5"/>`;
    }).join('') +
    [26, 38, 50, 62, 74].map((x) => `<path d="M${x} 52L${f(50 + (x - 50) * 1.4)} 90" stroke="#b8893a" stroke-width="2.5"/>`).join('') +
    `<rect x="16" y="36" width="68" height="18" rx="9" fill="#d9ae5a"/>` +
    `<ellipse cx="18" cy="45" rx="7" ry="9" fill="#e8c77a"/><path d="M18 45m-3 0a3 3 0 1 1 3 3" stroke="#b8893a" stroke-width="2"/>` +
    `<path d="M30 40H80M30 48H80" stroke="#b8893a" stroke-width="2"/>` +
    [[30, 66, -20], [48, 62, 15], [64, 72, -35], [40, 80, 30], [72, 60, 10]].map(([x, y, r]) =>
      `<path d="M${x - 7} ${y}C${x - 4} ${y - 5} ${x + 4} ${y - 5} ${x + 8} ${y + 2}C${x + 3} ${y + 1} ${x - 3} ${y + 2} ${x - 7} ${y}Z" transform="rotate(${r} ${x} ${y})" fill="#e8553d" stroke-width="2.5"/>`,
    ).join(''),
  호롱불:
    `<circle cx="50" cy="30" r="22" fill="#fff1b8" stroke="${HL}" stroke-width="3" stroke-dasharray="6 5"/>` +
    flame(50, 42, 1.3) +
    `<path d="M50 42V47" stroke-width="3"/>` +
    `<ellipse cx="50" cy="90" rx="30" ry="5" fill="#9a5b2e"/>` +
    `<path d="M38 88H62C70 88 72 82 70 74C68 64 58 60 58 54H42C42 60 32 64 30 74C28 82 30 88 38 88Z" fill="#fff"/>` +
    `<rect x="42" y="46" width="16" height="8" rx="2" fill="#8a96b0"/>` +
    `<path d="M36 76Q42 68 50 72T64 74" stroke="#3b78e6" stroke-width="3"/><circle cx="50" cy="80" r="3" fill="#3b78e6" stroke="none"/>`,
  청사초롱:
    tube('M12 8L88 8', '#9a5b2e', 5) +
    `<path d="M50 11V20" stroke-width="3"/>` +
    `<rect x="24" y="30" width="52" height="44" rx="8" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="52" rx="10" ry="14" fill="#ffd23f" stroke="none" opacity=".6"/>` +
    `<path d="M36 32V72M50 32V72M64 32V72" stroke="#c7392a" stroke-width="2.5"/>` +
    `<path d="M32 20H68L74 32H26Z" fill="#3b78e6"/>` +
    `<path d="M26 72H74L68 84H32Z" fill="#3b78e6"/>` +
    `<path d="M44 84H56L54 96H46Z" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M36 26H64M36 78H64" stroke="#ffd23f" stroke-width="3"/>`,
  밥상:
    `<path d="M18 62L16 92M82 62L84 92" stroke-width="11"/><path d="M18 62L16 92M82 62L84 92" stroke="#6b3e26" stroke-width="5"/>` +
    `<path d="M28 60V80M72 60V80" stroke-width="9"/><path d="M28 60V80M72 60V80" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M10 58L20 44H80L90 58Z" fill="#b87a45"/>` +
    `<rect x="10" y="58" width="80" height="7" rx="2" fill="#6b3e26"/>` +
    `<path d="M24 40C24 50 44 50 44 40Z" fill="#fff"/><path d="M24 40C26 28 42 28 44 40Z" fill="#fff"/>` +
    `<path d="M30 36h2M36 33h2M38 38h2" stroke="#cfcfcf" stroke-width="2"/>` +
    `<path d="M54 40C54 50 74 50 74 40Z" fill="#dfe8f5"/><ellipse cx="64" cy="40" rx="10" ry="3.5" fill="#c98b4f" stroke-width="2.5"/>` +
    `<ellipse cx="30" cy="53" rx="8" ry="3" fill="#fff" stroke-width="2.5"/><path d="M25 52q5-4 10 0" fill="#43b04a" stroke-width="2"/>` +
    `<ellipse cx="50" cy="53" rx="8" ry="3" fill="#fff" stroke-width="2.5"/><path d="M45 52q5-4 10 0" fill="#e8553d" stroke-width="2"/>` +
    `<path d="M66 54L84 48M68 56L86 51" stroke="#8a96b0" stroke-width="2.5"/>`,
  병풍: (() => {
    const xs = [8, 29, 50, 71, 92];
    let s = '';
    for (let i = 0; i < 4; i++) {
      const y0 = i % 2 ? 22 : 14;
      const y1 = i % 2 ? 14 : 22;
      const x0 = xs[i], x1 = xs[i + 1];
      const mx = (x0 + x1) / 2;
      const art =
        i % 2
          ? `<path d="M${x0 + 4} ${66}L${mx - 1} ${46}L${x1 - 3} ${66}Z" fill="#5fc24a" stroke-width="2"/><circle cx="${mx + 3}" cy="32" r="5" fill="#e8553d" stroke-width="2.5"/>`
          : `<path d="M${mx} 70V40" stroke="#43b04a" stroke-width="2.5"/><circle cx="${mx}" cy="36" r="7" fill="#ff9aa8" stroke-width="2.5"/><circle cx="${mx}" cy="36" r="2.5" fill="#ffd23f" stroke="none"/><path d="M${mx} 56q-7-6-9-1M${mx} 62q7-6 9-1" stroke="#43b04a" stroke-width="2.5"/>`;
      s += panel(x0, y0, x1, y1, 64, i % 2 ? '#fff4dc' : '#fffaf0', art);
    }
    return s + [8, 50, 92].map((x) => `<rect x="${x - 3}" y="${78}" width="6" height="6" rx="1" fill="#6b3e26" stroke-width="2"/>`).join('');
  })(),
  아궁이:
    `<rect x="24" y="10" width="52" height="10" rx="3" fill="#3a3f5c"/><path d="M40 10C40 4 60 4 60 10Z" fill="#3a3f5c"/>` +
    `<path d="M6 92V30C6 24 10 20 16 20H84C90 20 94 24 94 30V92Z" fill="#d6a570"/>` +
    `<path d="M14 34Q24 30 32 36M68 32Q78 30 86 36M14 60Q20 56 26 60M76 62Q82 58 88 62" stroke="#b07a45" stroke-width="3"/>` +
    `<path d="M24 92V62C24 42 76 42 76 62V92Z" fill="#3a2a20"/>` +
    flame(38, 86, 1.1) + flame(62, 86, 1.1) + flame(50, 84, 1.6) +
    `<path d="M28 90L60 80M40 80L72 90" stroke="#9a5b2e" stroke-width="7"/>`,
  새끼줄:
    rope() +
    `<path d="M10 58l-6 4M10 62l-5 7M12 64l-2 8" stroke="#d19a4c" stroke-width="2.5"/>` +
    `<path d="M88 30l6-4M88 26l3-7M86 24l0-7" stroke="#d19a4c" stroke-width="2.5"/>`,
  물레: (() => {
    let sp = '';
    for (let d = 0; d < 360; d += 45) {
      const [x, y] = pol(60, 42, 28, d);
      sp += `<path d="M60 42L${x} ${y}" stroke="#9a5b2e" stroke-width="3"/>`;
    }
    return (
      `<rect x="6" y="82" width="88" height="10" rx="3" fill="#9a5b2e"/>` +
      tube('M60 44L50 84M60 44L70 84', '#b87a45', 5) +
      `<circle cx="60" cy="42" r="30" stroke-width="9"/><circle cx="60" cy="42" r="30" stroke="#d9a066" stroke-width="4"/>` +
      sp +
      `<circle cx="60" cy="42" r="6" fill="#6b3e26"/>` +
      tube('M60 42L80 58', '#6b3e26', 3) + `<circle cx="81" cy="59" r="4" fill="#e8553d" stroke-width="2.5"/>` +
      `<path d="M31 46L18 70" stroke="#fff" stroke-width="2"/><path d="M31 46L18 70" stroke-width="1" stroke-dasharray="2 2"/>` +
      tube('M10 72H30', '#b87a45', 3) +
      `<path d="M14 66H26L28 78H12Z" fill="#fff" stroke-width="2.5"/>` +
      blob('#fff', [[16, 56, 5], [22, 54, 5]])
    );
  })(),
  베틀:
    tube('M16 90L24 10M84 90L76 10', '#9a5b2e', 6) +
    tube('M20 14H80', '#6b3e26', 6) +
    [28, 34, 40, 46, 52, 58, 64, 70].map((x) => `<path d="M${x} 16V58" stroke="#8a96b0" stroke-width="2"/>`).join('') +
    `<rect x="24" y="58" width="52" height="22" fill="#7ec8f0"/>` +
    `<path d="M24 64H76M24 70H76M24 76H76" stroke="#3b78e6" stroke-width="2.5"/>` +
    tube('M16 84H84', '#6b3e26', 7) +
    `<path d="M22 44C30 38 70 38 78 44C70 50 30 50 22 44Z" fill="#b87a45"/><ellipse cx="50" cy="44" rx="8" ry="2.5" fill="#fff" stroke-width="2"/>` +
    `<path d="M22 32H78" stroke="#6b3e26" stroke-width="3"/>`,
  화로:
    tube('M60 42L82 12M66 44L90 18', '#8a96b0', 2.5) +
    flame(40, 42, 0.8) + flame(56, 40, 0.6) +
    blob('#e8553d', [[28, 46, 7], [40, 44, 8], [52, 45, 7], [64, 46, 7], [72, 48, 5]]) +
    [[30, 44], [44, 42], [58, 46], [68, 47]].map(([x, y]) => dot(x, y, 2.4, '#ffd23f')).join('') +
    `<path d="M14 50H86L78 82C76 88 72 90 66 90H34C28 90 24 88 22 82Z" fill="#9a5b2e"/>` +
    `<rect x="12" y="46" width="76" height="8" rx="3" fill="#b87a45"/>` +
    `<path d="M26 66Q50 74 74 66" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M30 90V95M70 90V95" stroke-width="5"/>`,
  대야:
    drop(26, 18, 0.9) + drop(50, 10, 1) + drop(74, 18, 0.9) +
    `<path d="M8 48H92L82 82C80 88 74 90 66 90H34C26 90 20 88 18 82Z" fill="#ff9f1a"/>` +
    `<path d="M22 64Q50 72 78 64" stroke="#ffd23f" stroke-width="3"/>` +
    `<ellipse cx="50" cy="48" rx="44" ry="11" fill="#ffc933"/>` +
    `<ellipse cx="50" cy="48" rx="36" ry="7" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M34 48q4-3 8 0M56 47q4-3 8 0" stroke="#fff" stroke-width="2.5"/>`,
  두레박:
    `<path d="M50 2V20" stroke="#b8893a" stroke-width="5"/>` +
    `<path d="M32 26Q50 12 68 26" stroke-width="4"/>` +
    `<path d="M30 24H70L66 54H34Z" fill="#b87a45"/>` +
    `<path d="M31 32H69M33 46H67" stroke="#6b3e26" stroke-width="3"/>` +
    `<ellipse cx="50" cy="24" rx="20" ry="4" fill="#7ec8f0" stroke-width="2.5"/>` +
    drop(30, 30, 0.7) + drop(70, 34, 0.7) + drop(38, 58, 0.6) +
    `<path d="M10 70V88C10 94 90 94 90 88V70Z" fill="#b8c2d4"/>` +
    `<path d="M30 76V92M50 78V94M70 76V92M10 82H90" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="70" rx="40" ry="9" fill="#8a96b0"/><ellipse cx="50" cy="70" rx="30" ry="5" fill="#30354f" stroke-width="2.5"/>`,
  물동이:
    tube('M34 78L28 48L34 36', SKIN, 5) + tube('M66 78L72 48L66 36', SKIN, 5) +
    person(50, 98, 1.25, { hair: '#30354f', style: 'bun', shirt: '#ff9aa8' }) +
    `<ellipse cx="50" cy="40" rx="14" ry="4" fill="#fff7e0"/>` +
    `<path d="M40 38C24 36 22 18 36 10H64C78 18 76 36 60 38Z" fill="#7a4526"/>` +
    `<path d="M36 12C30 10 26 14 28 20M64 12C70 10 74 14 72 20" stroke-width="3"/>` +
    `<rect x="38" y="4" width="24" height="7" rx="3" fill="#9a5b2e"/>` +
    `<path d="M32 24Q50 30 68 24" stroke="#c98b4f" stroke-width="3"/>`,
  지팡이:
    person(40, 94, 1.55, { hair: '#dfe8f5', style: 'bald', shirt: '#43b04a', beard: '#fff' }) +
    tube('M56 74Q64 64 66 52', '#43b04a', 6) +
    tube('M64 50C62 40 76 38 76 48L76 94', '#9a5b2e', 5) +
    `<circle cx="66" cy="52" r="5" fill="${SKIN}"/>` +
    `<path d="M76 66h3M76 80h-3" stroke="#6b3e26" stroke-width="2.5"/>`,
  하회탈:
    `<path d="M16 42C16 18 32 8 50 8S84 18 84 42C84 56 80 62 76 66Q50 80 24 66C20 62 16 56 16 42Z" fill="#d9a066"/>` +
    `<path d="M24 36Q34 22 46 32M54 32Q66 22 76 36" stroke-width="5"/>` +
    `<path d="M26 46Q36 36 46 46Q36 42 26 46Z" fill="${INK}"/><path d="M54 46Q64 36 74 46Q64 42 54 46Z" fill="${INK}"/>` +
    `<path d="M44 42C42 52 38 58 44 62H56C62 58 58 52 56 42" fill="#c98b4f"/>` +
    `<path d="M38 18Q50 14 62 18" stroke="#9a5b2e" stroke-width="2.5"/>` +
    `<circle cx="28" cy="58" r="5" fill="#e8862e" stroke="none" opacity=".5"/><circle cx="72" cy="58" r="5" fill="#e8862e" stroke="none" opacity=".5"/>` +
    `<path d="M28 72Q50 86 72 72C70 86 60 94 50 94S30 86 28 72Z" fill="#d9a066"/>` +
    `<path d="M30 70Q50 82 70 70" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M30 69L27 74M70 69L73 74" stroke-width="3"/>`,
  소금단지:
    `<path d="M28 44C26 32 38 22 50 22S74 32 72 44Z" fill="#fff"/>` +
    `<path d="M36 30l4-3 3 3-4 3zM52 26l4-3 3 3-4 3zM60 36l4-3 3 3-4 3zM44 38l4-3 3 3-4 3z" fill="#fff" stroke-width="2"/>` +
    sparkle(30, 22, 5, '#7ec8f0') + sparkle(74, 26, 4, '#7ec8f0') +
    jar(50, 44, 50, 44, '#dfe8f5', '') +
    `<path d="M40 60Q50 66 60 60" stroke="#3b78e6" stroke-width="3"/>` +
    tube('M70 34L86 18', '#b87a45', 4) + `<ellipse cx="68" cy="37" rx="6" ry="4" transform="rotate(-45 68 37)" fill="#b87a45" stroke-width="2.5"/>`,
  꿀단지:
    tube('M60 30L78 8', '#b87a45', 4) +
    `<path d="M26 34H74C80 34 80 40 74 40H26C20 40 20 34 26 34Z" fill="#ffc933"/>` +
    jar(50, 40, 56, 50, '#e8862e', '') +
    `<path d="M26 38C24 46 28 54 30 46C32 52 36 50 36 42H64C64 52 70 54 70 44C72 52 76 48 74 38Z" fill="#ffc933"/>` +
    `<ellipse cx="50" cy="37" rx="24" ry="4" fill="#ffc933"/>` +
    `<g transform="translate(20 16)"><ellipse cx="-4" cy="-6" rx="5" ry="4" fill="#fff" stroke-width="2"/><ellipse cx="4" cy="-7" rx="5" ry="4" fill="#fff" stroke-width="2"/><ellipse cx="0" cy="0" rx="8" ry="6" fill="#ffd23f" stroke-width="2.5"/><path d="M-2 -5V5M3 -5V5" stroke-width="2.5"/></g>` +
    `<path d="M32 66Q50 74 68 66" stroke="#ffd23f" stroke-width="3"/>`,
  약봉지:
    `<path d="M12 22L16 16L20 22L24 16L28 22L32 16L36 22L40 16L44 22L48 16L52 22V90H12Z" fill="#fff"/>` +
    `<path d="M22 44H42M32 34V54" stroke="#43b04a" stroke-width="7"/>` +
    `<path d="M20 66H44M20 74H40" stroke="#8a96b0" stroke-width="3"/>` +
    [0, 1].map((i) => {
      const y = 40 + i * 26;
      return `<rect x="54" y="${y}" width="36" height="24" rx="2" fill="#e6f6ff"/>` +
        `<path d="M54 ${y + 5}H90" stroke="#9aa6c4" stroke-width="2"/>` +
        `<circle cx="64" cy="${y + 15}" r="4.5" fill="#fff" stroke-width="2.5"/>` +
        `<g transform="rotate(-30 78 ${y + 15})"><rect x="71" y="${y + 11}" width="14" height="8" rx="4" fill="#ff5c70" stroke-width="2.5"/><path d="M78 ${y + 11}V${y + 19}" stroke-width="2"/></g>` +
        `<circle cx="72" cy="${y + 19}" r="3" fill="#ffd23f" stroke-width="2"/>`;
    }).join(''),
};
