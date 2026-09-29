// 그림 묶음: 학용품·전자 기기·우편·가게·옛 살림살이·도구 (l2). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리(크레용·파스텔·분필 / 교과서·일기장·수첩 / 노트북·태블릿·휴대전화·모니터 / 이어폰·헤드폰 / 소포·택배상자 / 우표·엽서)는
// 색·실루엣·곁들인 소품을 다르게 했다. 기존 전화(스마트폰)·컴퓨터(모니터+키보드)와도 겹치지 않게 했다.
import { INK, SKIN, HL, dot, sparkle, tube, person, cheeks } from '../pictureKit.ts';

/** 크레용 한 자루 (세운 모양, 뾰족한 끝이 위) */
const crayon = (x: number, top: number, fill: string, dark: string) =>
  `<path d="M${x - 8} ${top + 18}L${x - 3} ${top + 2}Q${x} ${top - 3} ${x + 3} ${top + 2}L${x + 8} ${top + 18}Z" fill="${fill}"/>` +
  `<rect x="${x - 9}" y="${top + 16}" width="18" height="${88 - top}" rx="3" fill="${fill}"/>` +
  `<rect x="${x - 9}" y="${top + 30}" width="18" height="30" fill="#fff"/>` +
  `<path d="M${x - 5} ${top + 40}q2.5-4 5 0t5 0M${x - 5} ${top + 50}q2.5-4 5 0t5 0" stroke="${dark}" stroke-width="3"/>`;

/** 톱니바퀴 한 개 */
const gear = (cx: number, cy: number, r: number, n: number, fill: string, rot = 0) => {
  const pts: string[] = [];
  const ro = r + 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rot * Math.PI) / 180;
    const w = Math.PI / n / 2;
    const p = (ang: number, rr: number) => `${(cx + rr * Math.cos(ang)).toFixed(1)} ${(cy + rr * Math.sin(ang)).toFixed(1)}`;
    pts.push(p(a - w * 1.3, r), p(a - w * 0.8, ro), p(a + w * 0.8, ro), p(a + w * 1.3, r));
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.38).toFixed(1)}" fill="#fff7e0"/>`;
};

/** 가장자리가 톱니 모양인 우표 (x, y 왼쪽 위, w×h) */
const stampEdge = (x: number, y: number, w: number, h: number, fill: string) => {
  const s = 6;
  let d = `M${x} ${y}`;
  for (let i = 0; i < w / s; i++) d += `a3 3 0 0 0 ${s} 0`;
  for (let i = 0; i < h / s; i++) d += `a3 3 0 0 0 0 ${s}`;
  for (let i = 0; i < w / s; i++) d += `a3 3 0 0 0 ${-s} 0`;
  for (let i = 0; i < h / s; i++) d += `a3 3 0 0 0 0 ${-s}`;
  return `<path d="${d}Z" fill="${fill}"/>`;
};

/** 소리 퍼지는 선 (오른쪽으로) */
const waves = (x: number, y: number, c = '#ff9f1a') =>
  `<path d="M${x} ${y - 8}q5 8 0 16M${x + 8} ${y - 15}q9 15 0 30" stroke="${c}" stroke-width="4"/>`;

/** 지폐 한 장 */
const bill = (t: string) =>
  `<g transform="${t}"><rect x="0" y="0" width="64" height="34" rx="3" fill="#7cc97a"/>` +
  `<rect x="5" y="5" width="54" height="24" rx="2" stroke="#3a9e47" stroke-width="2.5"/>` +
  `<circle cx="22" cy="17" r="7.5" fill="#b8e6b0" stroke="#3a9e47" stroke-width="2.5"/>` +
  `<path d="M36 13H52M36 21H48" stroke="#3a9e47" stroke-width="3"/></g>`;

export const PICS: Record<string, string> = {
  크레용: crayon(26, 22, '#e8553d', '#e8553d') + crayon(50, 12, '#3b8fe0', '#3b8fe0') + crayon(74, 22, '#43b04a', '#43b04a'),
  파스텔:
    `<rect x="10" y="50" width="80" height="38" rx="4" fill="#c98b4f"/>` +
    [
      [22, '#ffb3c1'],
      [36, '#b8ecd0'],
      [50, '#fff0a0'],
      [64, '#d6c2f5'],
      [78, '#bfe0ff'],
    ]
      .map(
        ([x, c], i) =>
          `<rect x="${Number(x) - 6}" y="${26 + (i % 2) * 6}" width="12" height="${46 - (i % 2) * 6}" rx="5" fill="${c}"/>`,
      )
      .join('') +
    `<rect x="10" y="62" width="80" height="26" rx="4" fill="#e0a050"/>` +
    `<path d="M16 74H84" stroke="#fff4dc" stroke-width="3"/>` +
    `<path d="M14 18q10-8 20 0t20 0" stroke="#ffb3c1" stroke-width="6"/>`,
  도장:
    `<rect x="8" y="64" width="84" height="28" rx="3" fill="#fff"/>` +
    `<circle cx="70" cy="78" r="10" fill="#fff" stroke="#e8553d" stroke-width="4"/>` +
    `<circle cx="70" cy="78" r="3.5" fill="#e8553d" stroke="none"/>` +
    `<path d="M20 22C20 10 44 10 44 22V28H20Z" fill="#9a5b2e"/>` +
    `<rect x="18" y="26" width="28" height="42" rx="4" fill="#c98b4f"/>` +
    `<rect x="16" y="64" width="32" height="12" rx="3" fill="#e8553d"/>` +
    `<path d="M26 34V60" stroke="#e8b27a" stroke-width="3"/>` +
    `<path d="M54 40l6-4M56 52h8" stroke="#9aa6c4" stroke-width="3"/>`,
  클립:
    `<rect x="16" y="20" width="60" height="74" rx="3" fill="#fff"/>` +
    `<path d="M26 52H66M26 64H66M26 76H56" stroke="#9fb3d9" stroke-width="3"/>` +
    tube('M44 44V16a9 9 0 0 1 18 0V52a13 13 0 0 1-26 0V10', '#3b8fe0', 5),
  압정:
    `<rect x="10" y="66" width="80" height="26" rx="4" fill="#d9a066"/>` +
    `<path d="M20 76h6M40 82h5M62 74h6M74 84h5" stroke="#b07a42" stroke-width="3"/>` +
    `<g transform="rotate(20 50 50)">` +
    `<path d="M50 60V84" stroke="#8a96b0" stroke-width="4"/>` +
    `<ellipse cx="50" cy="58" rx="20" ry="6" fill="#c9412e"/>` +
    `<path d="M42 56L44 36H56L58 56Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="30" rx="16" ry="9" fill="#e8553d"/>` +
    `<path d="M42 28q4-4 9-4" stroke="#ff9a8a" stroke-width="3"/></g>`,
  스테이플러:
    `<rect x="6" y="72" width="88" height="14" rx="6" fill="#3b4a6b"/>` +
    `<path d="M22 70H82" stroke="#fff" stroke-width="5"/>` +
    `<rect x="6" y="58" width="22" height="20" rx="5" fill="#3b4a6b"/>` +
    `<path d="M10 56C10 46 20 44 30 44L86 38C94 38 96 50 88 54L28 66C16 68 10 64 10 56Z" fill="#e8553d"/>` +
    `<path d="M30 50L82 44" stroke="#ff9a8a" stroke-width="4"/>` +
    `<circle cx="18" cy="60" r="4.5" fill="#8a96b0"/>` +
    `<path d="M80 54V64" stroke="#8a96b0" stroke-width="5"/>`,
  딱풀:
    `<rect x="30" y="80" width="30" height="10" rx="3" fill="#8a96b0"/>` +
    `<path d="M34 30C34 18 56 18 56 30Z" fill="#fff"/>` +
    `<rect x="28" y="30" width="34" height="54" rx="5" fill="#ffd23f"/>` +
    `<rect x="28" y="44" width="34" height="24" fill="#3b78e6"/>` +
    `<circle cx="45" cy="56" r="6" fill="#fff" stroke-width="2.5"/>` +
    `<g transform="rotate(20 76 40)"><rect x="66" y="20" width="22" height="36" rx="5" fill="#e8553d"/>` +
    `<path d="M72 26V48" stroke="#ff9a8a" stroke-width="3"/></g>`,
  삼각자:
    `<path d="M14 88V12L90 88Z" fill="#7ec8f0"/>` +
    `<path d="M28 74V46L56 74Z" fill="#fff7e0"/>` +
    `<path d="M14 24h7M14 36h5M14 48h7M14 60h5M14 72h7M26 88v-7M38 88v-5M50 88v-7M62 88v-5M74 88v-7" stroke-width="3"/>`,
  계산기:
    `<rect x="20" y="8" width="60" height="84" rx="8" fill="#3b4a6b"/>` +
    `<rect x="28" y="16" width="44" height="18" rx="3" fill="#b8e6b0"/>` +
    [0, 1, 2, 3]
      .map((r) =>
        [0, 1, 2]
          .map(
            (c) =>
              `<rect x="${28 + c * 16}" y="${42 + r * 12}" width="11" height="8" rx="2" fill="${c === 2 ? '#ff9f1a' : '#dfe8f5'}" stroke-width="2"/>`,
          )
          .join(''),
      )
      .join(''),
  칠판:
    `<rect x="6" y="14" width="88" height="64" rx="4" fill="#9a5b2e"/>` +
    `<rect x="12" y="20" width="76" height="52" rx="2" fill="#2f7a4f"/>` +
    `<rect x="10" y="78" width="80" height="7" rx="2" fill="#c98b4f"/>` +
    `<rect x="60" y="74" width="12" height="5" rx="2" fill="#fff" stroke-width="2"/>` +
    `<path d="M22 60V44L34 34L46 44V60Z" stroke="#fff" stroke-width="3"/>` +
    `<path d="M68 30L72 41L83 41L74 48L78 59L68 52L58 59L62 48L53 41L64 41Z" stroke="#ffd23f" stroke-width="3"/>`,
  분필:
    `<rect x="6" y="8" width="88" height="54" rx="4" fill="#2f7a4f"/>` +
    `<path d="M16 42q8-14 16 0t16 0t16 0" stroke="#fff" stroke-width="4.5"/>` +
    `<g transform="rotate(-30 62 56)"><rect x="48" y="50" width="34" height="12" rx="6" fill="#fff"/></g>` +
    `<g transform="rotate(8 34 80)"><rect x="12" y="74" width="40" height="12" rx="6" fill="#ffd23f"/></g>` +
    `<g transform="rotate(-6 70 84)"><rect x="54" y="78" width="36" height="12" rx="6" fill="#ff9aa8"/></g>`,
  칠판지우개:
    `<path d="M10 20H62" stroke="#dfe8f5" stroke-width="10"/>` +
    `<path d="M12 34H56" stroke="#dfe8f5" stroke-width="8"/>` +
    `<circle cx="80" cy="24" r="5" fill="#fff" stroke="#c9d3e6" stroke-width="2"/><circle cx="72" cy="14" r="3.5" fill="#fff" stroke="#c9d3e6" stroke-width="2"/><circle cx="88" cy="36" r="3.5" fill="#fff" stroke="#c9d3e6" stroke-width="2"/>` +
    `<g transform="rotate(-8 50 64)">` +
    `<rect x="14" y="46" width="72" height="22" rx="6" fill="#3b78e6"/>` +
    `<path d="M24 54H76" stroke="#7ec8f0" stroke-width="3"/>` +
    `<rect x="12" y="66" width="76" height="18" rx="3" fill="#6a7390"/>` +
    `<path d="M16 72H84M16 78H84" stroke="#c9d3e6" stroke-width="2.5"/></g>`,
  게시판:
    `<rect x="6" y="10" width="88" height="80" rx="4" fill="#9a5b2e"/>` +
    `<rect x="12" y="16" width="76" height="68" rx="2" fill="#e0a860"/>` +
    `<rect x="18" y="24" width="26" height="30" fill="#fff" transform="rotate(-6 31 39)"/>` +
    `<path d="M22 34h16M22 42h14" stroke="#9fb3d9" stroke-width="3" transform="rotate(-6 31 39)"/>` +
    `<rect x="52" y="22" width="30" height="24" fill="#ffd23f" transform="rotate(5 67 34)"/>` +
    `<rect x="30" y="58" width="30" height="20" fill="#bfe0ff" transform="rotate(4 45 68)"/>` +
    `<circle cx="42" cy="68" r="5" fill="#ff9f1a" stroke-width="2"/>` +
    `<rect x="64" y="52" width="18" height="26" fill="#ff9aa8" transform="rotate(-5 73 65)"/>` +
    dot(31, 26, 4, '#e8553d') +
    dot(67, 24, 4, '#3b78e6') +
    dot(45, 60, 4, '#43b04a') +
    dot(73, 54, 4, '#8e4fc9'),
  사물함:
    `<rect x="8" y="10" width="84" height="80" rx="3" fill="#8a96b0"/>` +
    [0, 1, 2]
      .map((c) =>
        [0, 1]
          .map((r) =>
            c === 2 && r === 1
              ? ''
              : `<rect x="${12 + c * 27}" y="${14 + r * 38}" width="23" height="34" rx="2" fill="${['#3b8fe0', '#43b04a', '#ff9f1a'][c]}"/>` +
                `<path d="M${17 + c * 27} ${20 + r * 38}h13M${17 + c * 27} ${25 + r * 38}h13" stroke="#fff" stroke-width="2.5"/>` +
                `<rect x="${28 + c * 27}" y="${34 + r * 38}" width="4" height="8" rx="2" fill="#fff" stroke-width="2"/>`,
          )
          .join(''),
      )
      .join('') +
    `<rect x="66" y="52" width="23" height="34" fill="#4a5068"/>` +
    `<rect x="70" y="62" width="14" height="22" rx="2" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M89 52L97 56V92L89 86Z" fill="#ff9f1a"/>`,
  교과서:
    `<path d="M20 14H78V86H20Z" fill="#fff" />` +
    `<path d="M78 14L86 20V92L78 86Z" fill="#f1ead8"/>` +
    `<path d="M20 86H78L86 92H28Z" fill="#f1ead8"/>` +
    `<rect x="14" y="10" width="64" height="78" rx="3" fill="#3b78e6"/>` +
    `<rect x="14" y="10" width="10" height="78" fill="#2a5fc0"/>` +
    `<rect x="32" y="20" width="38" height="10" rx="3" fill="#fff"/>` +
    `<circle cx="51" cy="56" r="15" fill="#7ec8f0"/>` +
    `<path d="M40 48C46 50 44 58 50 58S58 50 62 54M44 66C48 62 54 66 58 64" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M84 34V70M81 34V70" stroke="#d6cdb4" stroke-width="1.5"/>`,
  일기장:
    `<rect x="18" y="10" width="62" height="80" rx="5" fill="#e85d9a"/>` +
    `<rect x="18" y="10" width="10" height="80" rx="3" fill="#c94480"/>` +
    `<path d="M53 34C53 28 45 26 43 32C41 26 33 28 33 34C33 42 43 48 43 48S53 42 53 34Z" fill="#fff" transform="translate(9 0)"/>` +
    `<rect x="66" y="50" width="22" height="14" rx="3" fill="#ffd23f"/>` +
    `<circle cx="80" cy="57" r="3" fill="#9a6a00" stroke="none"/>` +
    `<path d="M40 70H66M40 78H58" stroke="#ffc2dc" stroke-width="3"/>` +
    sparkle(12, 20, 5),
  수첩:
    `<rect x="26" y="14" width="44" height="72" rx="4" fill="#ffd23f"/>` +
    `<rect x="30" y="22" width="36" height="60" rx="2" fill="#fff"/>` +
    `<path d="M36 36H60M36 46H60M36 56H60M36 66H54" stroke="#9fb3d9" stroke-width="3"/>` +
    [34, 42, 50, 58, 66]
      .map((x) => `<path d="M${x} 24C${x - 4} 24 ${x - 4} 14 ${x} 14" stroke-width="3"/>`)
      .join('') +
    `<g transform="rotate(20 80 56)"><rect x="76" y="28" width="9" height="48" rx="2" fill="#3b78e6"/>` +
    `<path d="M76 76L80.5 86L85 76Z" fill="#f5d6a8"/></g>`,
  노트북:
    `<path d="M18 16H82V66H18Z" fill="#3b4a6b"/>` +
    `<rect x="23" y="21" width="54" height="40" rx="2" fill="#7ec8f0"/>` +
    `<path d="M23 61L38 44L50 54L60 46L77 61Z" fill="#5fc24a"/><circle cx="66" cy="31" r="5" fill="#ffd23f"/>` +
    `<path d="M18 66H82L94 84H6Z" fill="#dfe8f5"/>` +
    `<path d="M20 70H80M17 75H83" stroke="#8a96b0" stroke-width="3" stroke-dasharray="4 2.5"/>` +
    `<rect x="40" y="78" width="20" height="4" rx="1.5" fill="#b8c6da" stroke-width="2"/>`,
  태블릿:
    `<rect x="6" y="18" width="88" height="64" rx="8" fill="#3b4a6b"/>` +
    `<rect x="14" y="25" width="72" height="50" rx="2" fill="#fff"/>` +
    [
      [20, 31, '#e8553d'],
      [38, 31, '#ffd23f'],
      [56, 31, '#43b04a'],
      [20, 51, '#3b8fe0'],
      [38, 51, '#e85d9a'],
      [56, 51, '#8e4fc9'],
    ]
      .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${c}" stroke-width="2"/>`)
      .join('') +
    `<circle cx="90" cy="50" r="2" fill="#8a96b0" stroke="none"/>` +
    `<path d="M76 50C76 44 84 44 84 50V60C88 60 90 64 88 70L84 82H72L68 70C66 66 70 62 76 64Z" fill="${SKIN}" stroke-width="3"/>`,
  키보드:
    `<path d="M14 28H86L96 78H4Z" fill="#dfe8f5"/>` +
    [0, 1, 2]
      .map((r) =>
        Array.from({ length: 8 })
          .map((_, c) => {
            const y = 34 + r * 12;
            const x0 = 17 - r * 2.3 + c * (9 + r * 0.6);
            return `<rect x="${x0.toFixed(1)}" y="${y}" width="${(7 + r * 0.5).toFixed(1)}" height="8" rx="1.5" fill="#fff" stroke-width="2"/>`;
          })
          .join(''),
      )
      .join('') +
    `<rect x="12" y="68" width="14" height="6" rx="1.5" fill="#fff" stroke-width="2"/><rect x="30" y="68" width="40" height="6" rx="1.5" fill="#fff" stroke-width="2"/><rect x="74" y="68" width="14" height="6" rx="1.5" fill="#fff" stroke-width="2"/>`,
  마우스:
    `<path d="M50 30C50 18 40 14 46 6" stroke-width="3.5"/>` +
    `<path d="M50 30C28 30 24 46 24 60C24 80 36 92 50 92S76 80 76 60C76 46 72 30 50 30Z" fill="#dfe8f5"/>` +
    `<path d="M50 30V56M25 56H75" stroke-width="3"/>` +
    `<path d="M50 30C33 30 26 42 25 56H50Z" fill="#fff" stroke-width="3"/>` +
    `<rect x="46" y="38" width="8" height="12" rx="4" fill="#3b78e6" stroke-width="2.5"/>`,
  모니터:
    `<rect x="42" y="68" width="16" height="14" fill="#8a96b0"/>` +
    `<rect x="26" y="80" width="48" height="8" rx="3" fill="#8a96b0"/>` +
    `<rect x="6" y="12" width="88" height="58" rx="5" fill="#3b4a6b"/>` +
    `<rect x="12" y="18" width="76" height="46" rx="2" fill="#7ec8f0"/>` +
    `<path d="M12 64L32 42L48 56L60 46L88 64Z" fill="#5fc24a"/><circle cx="72" cy="30" r="6" fill="#ffd23f"/>` +
    `<path d="M34 26L34 42L38 38L42 45L45 43L41 36L46 35Z" fill="#fff" stroke-width="2"/>` +
    `<circle cx="84" cy="67" r="1.6" fill="#5fc24a" stroke="none"/>`,
  프린터:
    `<path d="M28 12H72V40H28Z" fill="#fff"/>` +
    `<path d="M34 20H64M34 27H56" stroke="#9fb3d9" stroke-width="3"/>` +
    `<rect x="8" y="36" width="84" height="36" rx="6" fill="#8a96b0"/>` +
    `<rect x="8" y="36" width="84" height="10" rx="4" fill="#b8c6da"/>` +
    `<circle cx="80" cy="56" r="4" fill="#5fc24a" stroke-width="2"/>` +
    `<rect x="22" y="60" width="56" height="6" rx="2" fill="#3b4a6b"/>` +
    `<path d="M24 63H76L80 92H20Z" fill="#fff"/>` +
    `<circle cx="42" cy="76" r="6" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M50 88L60 74L70 88Z" fill="#43b04a" stroke-width="2.5"/>`,
  스피커:
    `<rect x="24" y="8" width="46" height="84" rx="6" fill="#3b4a6b"/>` +
    `<circle cx="47" cy="28" r="9" fill="#6a7390"/><circle cx="47" cy="28" r="3.5" fill="#dfe8f5" stroke-width="2"/>` +
    `<circle cx="47" cy="64" r="19" fill="#6a7390"/><circle cx="47" cy="64" r="11" fill="#4a5068"/><circle cx="47" cy="64" r="4.5" fill="#dfe8f5" stroke-width="2"/>` +
    waves(78, 50) +
    `<path d="M12 42q-5 8 0 16M6 36q-6 14 0 28" stroke="#ff9f1a" stroke-width="4"/>`,
  이어폰:
    `<path d="M26 40C26 60 44 62 50 72M74 40C74 60 56 62 50 72M50 72V86" stroke-width="3.5"/>` +
    `<rect x="45" y="84" width="10" height="10" rx="2" fill="#8a96b0"/>` +
    `<g transform="rotate(-20 26 28)"><rect x="21" y="30" width="10" height="16" rx="4" fill="#fff"/>` +
    `<circle cx="26" cy="24" r="12" fill="#fff"/><circle cx="26" cy="24" r="6" fill="#8a96b0" stroke-width="2.5"/></g>` +
    `<g transform="rotate(20 74 28)"><rect x="69" y="30" width="10" height="16" rx="4" fill="#fff"/>` +
    `<circle cx="74" cy="24" r="12" fill="#fff"/><circle cx="74" cy="24" r="6" fill="#8a96b0" stroke-width="2.5"/></g>`,
  헤드폰:
    tube('M20 60V46C20 16 80 16 80 46V60', '#3b4a6b', 7) +
    `<rect x="8" y="48" width="24" height="36" rx="10" fill="#e8553d"/>` +
    `<rect x="68" y="48" width="24" height="36" rx="10" fill="#e8553d"/>` +
    `<rect x="26" y="52" width="8" height="28" rx="4" fill="#3b4a6b"/>` +
    `<rect x="66" y="52" width="8" height="28" rx="4" fill="#3b4a6b"/>` +
    `<path d="M14 56V74" stroke="#ff9a8a" stroke-width="3"/><path d="M74 56V74" stroke="#ff9a8a" stroke-width="3" transform="translate(12 0)"/>`,
  충전기:
    `<path d="M34 10V24M52 10V24" stroke="#8a96b0" stroke-width="6"/>` +
    `<rect x="22" y="22" width="42" height="42" rx="8" fill="#fff"/>` +
    `<path d="M46 30L34 46H44L40 58L54 40H44Z" fill="${HL}" stroke-width="2.5"/>` +
    `<rect x="37" y="64" width="12" height="8" rx="2" fill="#dfe8f5"/>` +
    `<path d="M43 72C43 90 70 92 76 80C80 72 74 64 80 58" stroke-width="4"/>` +
    `<rect x="74" y="44" width="12" height="16" rx="3" fill="#dfe8f5"/>`,
  전화기:
    `<path d="M16 88L24 50C26 42 74 42 76 50L84 88Z" fill="#e8553d"/>` +
    `<path d="M10 36C10 22 90 22 90 36L88 44H70L68 38C60 34 40 34 32 38L30 44H12Z" fill="#c9412e"/>` +
    `<path d="M24 30C36 24 64 24 76 30" stroke="#ff9a8a" stroke-width="3"/>` +
    `<circle cx="50" cy="68" r="15" fill="#fff"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return dot(50 + 9.5 * Math.cos(a), 68 + 9.5 * Math.sin(a), 2.4, '#3b4a6b');
      })
      .join('') +
    `<circle cx="50" cy="68" r="3.5" fill="#c9412e" stroke-width="2"/>`,
  휴대전화:
    `<path d="M16 26q-6 10 0 20M8 20q-9 16 0 32M84 26q6 10 0 20M92 20q9 16 0 32" stroke="#ff9f1a" stroke-width="4"/>` +
    `<rect x="30" y="6" width="40" height="72" rx="8" fill="#e85d9a"/>` +
    `<rect x="35" y="14" width="30" height="56" rx="3" fill="#fff"/>` +
    `<circle cx="50" cy="32" r="8" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M46 29C46 34 50 37 54 36" stroke="#fff" stroke-width="3"/>` +
    `<rect x="39" y="48" width="22" height="5" rx="2.5" fill="#dfe8f5" stroke-width="2"/>` +
    `<path d="M26 64C22 72 24 86 34 92H64C72 86 74 76 72 68L66 60C64 56 60 58 60 62V66" fill="${SKIN}" stroke-width="3"/>` +
    `<path d="M30 58C26 60 24 66 26 70C28 74 34 72 36 70Z" fill="${SKIN}" stroke-width="3"/>`,
  무전기:
    `<rect x="60" y="4" width="8" height="30" rx="4" fill="#3b4a6b"/>` +
    `<rect x="28" y="24" width="44" height="70" rx="8" fill="#ff9f1a"/>` +
    `<rect x="36" y="32" width="28" height="16" rx="3" fill="#b8e6b0"/>` +
    `<path d="M36 58H64M36 64H64M36 70H64M36 76H64M36 82H64" stroke="#8a4a10" stroke-width="3"/>` +
    `<rect x="22" y="42" width="7" height="22" rx="3" fill="#3b4a6b"/>` +
    `<circle cx="38" cy="18" r="6" fill="#3b4a6b"/>` +
    `<path d="M78 14q5 6 0 12M86 8q9 12 0 24" stroke="#3b8fe0" stroke-width="4"/>`,
  확성기:
    `<path d="M22 40L64 16V84L22 60Z" fill="#fff"/>` +
    `<ellipse cx="64" cy="50" rx="8" ry="34" fill="#e8553d"/>` +
    `<rect x="10" y="38" width="14" height="24" rx="4" fill="#e8553d"/>` +
    tube('M34 58L30 82', '#3b4a6b', 6) +
    `<path d="M30 40L56 26" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M80 38q6 12 0 24M88 30q10 20 0 40" stroke="#ff9f1a" stroke-width="4"/>`,
  쌍안경:
    `<rect x="12" y="30" width="30" height="44" rx="10" fill="#3b4a6b"/>` +
    `<rect x="58" y="30" width="30" height="44" rx="10" fill="#3b4a6b"/>` +
    `<rect x="40" y="40" width="20" height="16" rx="4" fill="#6a7390"/>` +
    `<rect x="18" y="16" width="18" height="18" rx="5" fill="#6a7390"/>` +
    `<rect x="64" y="16" width="18" height="18" rx="5" fill="#6a7390"/>` +
    `<circle cx="27" cy="72" r="15" fill="#3b4a6b"/><circle cx="73" cy="72" r="15" fill="#3b4a6b"/>` +
    `<circle cx="27" cy="72" r="10" fill="#7ec8f0"/><circle cx="73" cy="72" r="10" fill="#7ec8f0"/>` +
    `<path d="M22 68q3-4 7-4M68 68q3-4 7-4" stroke="#fff" stroke-width="3"/>`,
  우표:
    stampEdge(20, 14, 60, 72, '#fff') +
    `<rect x="28" y="22" width="44" height="56" fill="#7ec8f0"/>` +
    `<path d="M50 78V56" stroke="#43b04a" stroke-width="4"/><path d="M50 66C44 60 38 62 36 66C42 70 46 70 50 66Z" fill="#5fc24a" stroke-width="2.5"/>` +
    `<circle cx="50" cy="42" r="6" fill="${HL}"/>` +
    [0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${(50 + 11 * Math.cos(a)).toFixed(1)}" cy="${(42 + 11 * Math.sin(a)).toFixed(1)}" r="6" fill="#ff5c70" stroke-width="2.5"/>`;
    }).join('') +
    `<circle cx="50" cy="42" r="6" fill="${HL}" stroke-width="2.5"/>`,
  엽서:
    `<rect x="4" y="18" width="92" height="64" rx="3" fill="#fff"/>` +
    `<rect x="10" y="24" width="38" height="52" fill="#7ec8f0"/>` +
    `<path d="M10 76L22 54L32 66L38 58L48 76Z" fill="#43b04a"/><circle cx="38" cy="36" r="5" fill="${HL}"/>` +
    `<path d="M52 24V76" stroke="#c9d3e6" stroke-width="2.5"/>` +
    stampEdge(72, 26, 18, 18, '#ff9aa8') +
    `<path d="M58 54H90M58 64H90M58 74H84" stroke="#9fb3d9" stroke-width="3"/>`,
  소포:
    `<path d="M10 40L28 22H90L72 40Z" fill="#e0b27a"/>` +
    `<path d="M72 40L90 22V70L72 88Z" fill="#b98548"/>` +
    `<rect x="10" y="40" width="62" height="48" fill="#d9a066"/>` +
    `<path d="M41 40V88M10 64H72M72 64L90 46M41 40L59 22M19 31H81" stroke="#9a3a2e" stroke-width="4"/>` +
    `<path d="M50 31C34 14 28 30 50 31C72 14 76 30 50 31Z" fill="#e8553d" stroke-width="3"/>` +
    `<path d="M50 31L42 44M50 31L58 44" stroke="#e8553d" stroke-width="4"/>` +
    `<rect x="46" y="70" width="22" height="14" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M50 75h14M50 80h10" stroke="#9fb3d9" stroke-width="2"/>`,
  택배상자:
    `<path d="M10 36L30 20H90L70 36Z" fill="#e8b06a"/>` +
    `<path d="M70 36L90 20V74L70 90Z" fill="#b87a3a"/>` +
    `<rect x="10" y="36" width="60" height="54" fill="#d9954a"/>` +
    `<path d="M40 36L60 20" stroke="#f0d8a8" stroke-width="10" stroke-linecap="butt"/><path d="M40 36V52" stroke="#f0d8a8" stroke-width="10" stroke-linecap="butt"/>` +
    `<path d="M40 36L60 20M40 36V52" stroke="#c9a36a" stroke-width="2"/>` +
    `<rect x="44" y="64" width="20" height="18" fill="#fff" stroke-width="2.5"/>` +
    `<path d="M48 70h12M48 76h8" stroke="#9fb3d9" stroke-width="2"/>` +
    `<path d="M16 70H32M16 78H28" stroke="#b87a3a" stroke-width="3"/>`,
  저금통:
    `<ellipse cx="46" cy="60" rx="34" ry="26" fill="#ff9aa8"/>` +
    `<rect x="24" y="78" width="10" height="12" rx="3" fill="#ff9aa8"/><rect x="54" y="78" width="10" height="12" rx="3" fill="#ff9aa8"/>` +
    `<path d="M26 40L22 28L36 36Z" fill="#ff7c92"/>` +
    `<ellipse cx="80" cy="60" rx="8" ry="10" fill="#ff7c92"/>` +
    dot(78, 57, 1.8) +
    dot(82, 63, 1.8) +
    dot(66, 50, 3) +
    `<path d="M12 58c-6-2-6-8 0-8" stroke-width="3"/>` +
    `<rect x="36" y="34" width="20" height="5" rx="2.5" fill="${INK}"/>` +
    `<circle cx="46" cy="18" r="11" fill="${HL}"/><circle cx="46" cy="18" r="6" stroke="#f2a900" stroke-width="3"/>` +
    cheeks(66, 0, 62),
  지폐: bill('rotate(-14 30 40) translate(10 20)') + bill('rotate(4 50 60) translate(22 44)'),
  쇼핑카트:
    tube('M4 18H18L28 64H80', '#8a96b0', 3) +
    `<path d="M22 28H90L82 56H28Z" fill="#dfe8f5"/>` +
    `<path d="M36 28L38 56M52 28L52 56M68 28L66 56M24 38H88M26 48H85" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M22 28H90L82 56H28Z"/>` +
    `<rect x="34" y="12" width="16" height="18" rx="3" fill="#e8553d"/>` +
    `<circle cx="64" cy="20" r="9" fill="#43b04a"/>` +
    `<rect x="76" y="8" width="8" height="22" rx="3" fill="#ffd23f"/>` +
    `<circle cx="34" cy="80" r="7" fill="#3b4a6b"/><circle cx="74" cy="80" r="7" fill="#3b4a6b"/>` +
    `<path d="M34 64V73M74 64V73" stroke-width="3.5"/>`,
  계산대:
    person(28, 58, 1.1, { hair: '#5a3b24', style: 'pony', shirt: '#43b04a' }) +
    `<rect x="4" y="56" width="92" height="36" rx="3" fill="#c98b4f"/>` +
    `<rect x="4" y="56" width="92" height="8" rx="3" fill="#e0a860"/>` +
    `<path d="M20 72H44M20 80H40" stroke="#e8b27a" stroke-width="3"/>` +
    `<rect x="52" y="44" width="38" height="14" rx="3" fill="#3b4a6b"/>` +
    `<rect x="60" y="22" width="24" height="16" rx="2" fill="#3b4a6b"/><rect x="64" y="26" width="16" height="8" fill="#b8e6b0" stroke-width="2"/>` +
    `<path d="M72 38V44" stroke-width="4"/>` +
    `<path d="M56 50h4M64 50h4M72 50h4M80 50h4" stroke="#fff" stroke-width="3"/>` +
    `<rect x="54" y="66" width="34" height="12" rx="2" fill="#e8b27a"/><circle cx="71" cy="72" r="2.5" fill="#6b3e26" stroke="none"/>`,
  저울:
    `<ellipse cx="50" cy="24" rx="34" ry="7" fill="#dfe8f5"/>` +
    `<path d="M40 22C36 10 52 6 56 14C62 10 68 20 60 24Z" fill="#e8553d" stroke-width="3"/>` +
    `<path d="M50 10q2-6 6-6" stroke="#6b3e26" stroke-width="3"/>` +
    `<rect x="44" y="28" width="12" height="10" fill="#8a96b0"/>` +
    `<path d="M16 88C16 50 26 36 50 36S84 50 84 88Z" fill="#3b8fe0"/>` +
    `<circle cx="50" cy="64" r="20" fill="#fff"/>` +
    `<path d="M36 56l3 2M42 50l2 3M50 48v4M58 50l-2 3M64 56l-3 2" stroke-width="2.5"/>` +
    `<path d="M50 66L60 54" stroke="#e8553d" stroke-width="3.5"/>` +
    dot(50, 66, 3),
  가격표:
    `<path d="M10 14q10 6 18 22" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g transform="rotate(20 50 54)">` +
    `<path d="M24 36L40 20H86V88H40L24 72Z" fill="${HL}"/>` +
    `<circle cx="36" cy="54" r="5" fill="#fff7e0"/>` +
    `<circle cx="64" cy="42" r="11" fill="#fff4b0" stroke="#f2a900" stroke-width="3"/><circle cx="64" cy="42" r="5" stroke="#f2a900" stroke-width="3"/>` +
    `<path d="M52 64H78M52 74H72" stroke="#e8553d" stroke-width="5"/></g>`,
  도마:
    `<rect x="8" y="32" width="72" height="50" rx="8" fill="#e0a860"/>` +
    `<path d="M80 48H90C95 48 95 66 90 66H80Z" fill="#e0a860"/>` +
    `<circle cx="88" cy="57" r="3" fill="#fff7e0"/>` +
    `<path d="M16 40H40M52 74H72" stroke="#c98b4f" stroke-width="3"/>` +
    [22, 36, 50].map((x) => `<circle cx="${x}" cy="62" r="8" fill="#ff9f1a"/><circle cx="${x}" cy="62" r="3" fill="#ffd79a" stroke="none"/>`).join('') +
    `<path d="M40 46C48 38 70 38 72 46C70 54 50 54 40 46Z" fill="#43b04a"/>` +
    `<path d="M48 46H66" stroke="#b8e6b0" stroke-width="3"/>`,
  채반:
    `<path d="M8 46V58C8 84 92 84 92 58V46Z" fill="#b98548"/>` +
    `<path d="M10 62C30 76 70 76 90 62" stroke="#8a5a2a" stroke-width="3"/>` +
    `<ellipse cx="50" cy="46" rx="42" ry="18" fill="#e8c88a"/>` +
    `<g stroke="#c9a060" stroke-width="2.5"><path d="M24 32L58 62M38 29L74 61M54 28L86 54M14 40L40 63M70 30L90 44"/>` +
    `<path d="M76 32L42 62M62 29L26 61M46 28L14 54M86 40L60 63M30 30L10 44"/></g>` +
    `<ellipse cx="50" cy="46" rx="42" ry="18"/>` +
    [
      [30, 40, -15],
      [58, 38, 12],
      [48, 54, -4],
    ]
      .map(
        ([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 14} ${y - 2}C${x - 6} ${y - 6} ${x + 10} ${y - 4} ${x + 18} ${y + 4}C${x + 8} ${y + 4} ${x - 6} ${y + 6} ${x - 14} ${y + 3}Z" fill="#e8553d" stroke-width="3"/>` +
          `<path d="M${x - 14} ${y}h-6" stroke="#43b04a" stroke-width="5"/></g>`,
      )
      .join(''),
  뚝배기:
    `<rect x="8" y="78" width="84" height="12" rx="3" fill="#c98b4f"/>` +
    `<path d="M14 48C14 72 28 80 50 80S86 72 86 48Z" fill="#5a3b24"/>` +
    `<ellipse cx="50" cy="48" rx="36" ry="10" fill="#6b3e26"/>` +
    `<ellipse cx="50" cy="48" rx="30" ry="7" fill="#e8553d"/>` +
    `<circle cx="38" cy="47" r="4" fill="#fff" stroke-width="2"/><circle cx="58" cy="46" r="3" fill="#fff" stroke-width="2"/>` +
    `<rect x="46" y="44" width="7" height="6" fill="#fffdf2" stroke-width="2"/>` +
    `<path d="M62 48l6-2" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M24 60C26 68 32 72 38 74" stroke="#8a5a36" stroke-width="3"/>` +
    `<path d="M34 34c-5-5 5-9 0-15M50 30c-5-5 5-9 0-15M66 34c-5-5 5-9 0-15" stroke="#9aa6c4" stroke-width="3"/>`,
  항아리:
    `<path d="M34 14H66L64 22C84 28 90 46 86 62C82 80 70 90 50 90S18 80 14 62C10 46 16 28 36 22Z" fill="#6b3e26"/>` +
    `<ellipse cx="50" cy="14" rx="20" ry="6" fill="#5a3b24"/>` +
    `<path d="M40 10C40 4 60 4 60 10" fill="#5a3b24"/>` +
    `<path d="M36 22C44 25 56 25 64 22" stroke-width="3"/>` +
    `<path d="M26 44C22 54 24 66 30 74" stroke="#a87048" stroke-width="5"/>` +
    `<path d="M20 58C36 64 64 64 80 58" stroke="#8a5a36" stroke-width="3"/>`,
  부채:
    `<path d="M50 82L10 46A50 50 0 0 1 90 46Z" fill="#fff"/>` +
    `<path d="M50 82L10 46A50 50 0 0 1 90 46Z" fill="none"/>` +
    [0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const a = Math.PI * (1.25 + (i / 6) * 0.5) - 0.06;
        return `<path d="M50 82L${(50 + 56 * Math.cos(a)).toFixed(1)} ${(82 + 56 * Math.sin(a)).toFixed(1)}" stroke="#c9d3e6" stroke-width="2.5"/>`;
      })
      .join('') +
    `<path d="M22 40C34 30 42 34 50 26" stroke="#3a9e47" stroke-width="4"/>` +
    `<circle cx="56" cy="28" r="6" fill="#ff5c70" stroke-width="2.5"/><circle cx="68" cy="36" r="5" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M50 82L10 46A50 50 0 0 1 90 46Z"/>` +
    `<path d="M50 82L50 94" stroke="#e8553d" stroke-width="4"/>` +
    `<circle cx="50" cy="82" r="5" fill="#9a5b2e"/>`,
  복주머니:
    `<path d="M36 34C18 44 12 60 16 74C20 88 34 92 50 92S80 88 84 74C88 60 82 44 64 34Z" fill="#e8553d"/>` +
    `<path d="M36 34C32 22 36 14 42 20C44 12 56 12 58 20C64 14 68 22 64 34Z" fill="#e8553d"/>` +
    `<path d="M34 34C44 38 56 38 66 34" stroke="${HL}" stroke-width="6"/>` +
    `<path d="M40 38L30 58M60 38L70 58" stroke="${HL}" stroke-width="4"/>` +
    `<circle cx="30" cy="62" r="4" fill="${HL}"/><circle cx="70" cy="62" r="4" fill="${HL}"/>` +
    [0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${(50 + 7 * Math.cos(a)).toFixed(1)}" cy="${(68 + 7 * Math.sin(a)).toFixed(1)}" r="5" fill="${HL}" stroke-width="2.5"/>`;
    }).join('') +
    `<circle cx="50" cy="68" r="4" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<path d="M22 72C26 82 34 86 40 88" stroke="#ff9a8a" stroke-width="3"/>`,
  짚신:
    [30, 70]
      .map(
        (x, i) =>
          `<g transform="rotate(${i ? 8 : -8} ${x} 54)">` +
          `<path d="M${x} 12C${x + 14} 12 ${x + 16} 28 ${x + 15} 44C${x + 14} 62 ${x + 13} 76 ${x + 12} 84C${x + 10} 94 ${x - 10} 94 ${x - 12} 84C${x - 13} 76 ${x - 14} 62 ${x - 15} 44C${x - 16} 28 ${x - 14} 12 ${x} 12Z" fill="#e6c07a"/>` +
          `<path d="M${x - 12} 28H${x + 12}M${x - 14} 40H${x + 14}M${x - 14} 52H${x + 14}M${x - 13} 64H${x + 13}M${x - 12} 76H${x + 12}" stroke="#b98548" stroke-width="2.5"/>` +
          `<path d="M${x - 12} 22C${x - 20} 42 ${x - 18} 52 ${x - 12} 56M${x + 12} 22C${x + 20} 42 ${x + 18} 52 ${x + 12} 56M${x - 12} 56L${x + 12} 56" stroke="#9a6a30" stroke-width="4"/>` +
          `</g>`,
      )
      .join(''),
  지게:
    `<path d="M30 10L20 92M62 10L72 92" stroke="#6b3e26" stroke-width="10"/><path d="M30 10L20 92M62 10L72 92" stroke="#c98b4f" stroke-width="4.5"/>` +
    `<path d="M26 30H66M24 48H68M22 66H70" stroke="#6b3e26" stroke-width="8"/><path d="M26 30H66M24 48H68M22 66H70" stroke="#c98b4f" stroke-width="3"/>` +
    `<path d="M24 66L18 82H74L70 66" stroke="#6b3e26" stroke-width="3"/>` +
    [
      [30, 34],
      [46, 34],
      [62, 34],
      [38, 22],
      [54, 22],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="7" fill="#9a5b2e"/><circle cx="${x}" cy="${y}" r="3" fill="#e8b27a" stroke-width="2"/>`,
      )
      .join('') +
    `<path d="M84 30L70 92" stroke="#6b3e26" stroke-width="8"/><path d="M84 30L70 92" stroke="#c98b4f" stroke-width="3"/>`,
  탈:
    `<circle cx="14" cy="40" r="4" fill="#fff7e0"/><circle cx="86" cy="40" r="4" fill="#fff7e0"/>` +
    `<path d="M14 42C12 20 30 8 50 8S88 20 86 42C86 54 82 62 78 66C64 72 36 72 22 66C18 62 14 54 14 42Z" fill="#e6c080"/>` +
    `<path d="M22 70C26 86 38 94 50 94S74 86 78 70C66 76 34 76 22 70Z" fill="#e6c080"/>` +
    `<path d="M34 16q16-6 32 0M38 22q12-4 24 0" stroke="#b88a4a" stroke-width="3"/>` +
    `<path d="M24 34C28 28 36 28 40 32M60 32C64 28 72 28 76 34" stroke="#3a2a20" stroke-width="4"/>` +
    `<path d="M26 46Q34 36 42 46" stroke-width="5"/><path d="M58 46Q66 36 74 46" stroke-width="5"/>` +
    `<path d="M47 40C45 50 44 56 50 57C56 56 55 50 53 40" stroke-width="3"/>` +
    `<path d="M26 60Q50 74 74 60" stroke-width="4"/>` +
    `<path d="M40 84q10 4 20 0" stroke="#b88a4a" stroke-width="3"/>` +
    `<circle cx="28" cy="54" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="72" cy="54" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>`,
  온도계:
    `<rect x="38" y="6" width="24" height="70" rx="12" fill="#fff"/>` +
    `<circle cx="50" cy="78" r="16" fill="#e8553d"/>` +
    `<rect x="45" y="36" width="10" height="36" fill="#e8553d" stroke="none"/>` +
    `<path d="M45 72V36C45 32 55 32 55 36V72" stroke="none"/>` +
    `<path d="M62 20h8M62 32h6M62 44h8M62 56h6" stroke-width="3"/>` +
    `<path d="M44 72q-2 6 0 10" stroke="#ff9a8a" stroke-width="3"/>` +
    `<circle cx="22" cy="26" r="9" fill="${HL}"/>` +
    `<path d="M22 10v3M22 39v3M6 26h3M35 26h3M11 15l2 2M31 35l2 2M11 37l2-2M31 17l2-2" stroke="#ff9f1a" stroke-width="3"/>`,
  소화기:
    `<path d="M40 12H58L72 16" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="42" y="10" width="14" height="12" rx="2" fill="#3b4a6b"/>` +
    `<path d="M58 12L78 8" stroke="#3b4a6b" stroke-width="5"/>` +
    `<path d="M44 24C44 30 30 34 30 44V86C30 90 34 92 38 92H62C66 92 70 90 70 86V44C70 34 56 30 56 24Z" fill="#e8553d"/>` +
    `<rect x="30" y="50" width="40" height="18" fill="#fff"/>` +
    `<circle cx="50" cy="59" r="5" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M36 36C34 40 36 76 36 84" stroke="#ff9a8a" stroke-width="3"/>` +
    tube('M58 20C80 22 86 44 84 70', '#3b4a6b', 4) +
    `<rect x="79" y="68" width="10" height="14" rx="2" fill="#3b4a6b"/>`,
  톱니바퀴: gear(38, 40, 24, 10, '#8a96b0') + gear(70, 72, 16, 8, '#ff9f1a', 22),
  나사:
    `<path d="M20 18C20 6 80 6 80 18V26H20Z" fill="#b8c6da"/>` +
    `<path d="M50 6V18" stroke="#4a5068" stroke-width="5"/>` +
    `<path d="M36 26H64V72L50 94L36 72Z" fill="#dfe8f5"/>` +
    `<path d="M36 34L64 30M36 44L64 40M36 54L64 50M36 64L64 60M38 74L62 70M42 82L58 80" stroke-width="3.5"/>` +
    `<path d="M42 30V66" stroke="#fff" stroke-width="3"/>`,
};
