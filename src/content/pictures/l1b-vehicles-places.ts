// 탈것(일하는 차·배·놀이 탈것)과 장소(집 안·가게·자연) 그림 묶음 (1단계 추가). 그림 규칙은 docs/picture-style.md.
import { INK, dot, blob, sparkle, tube, ring, person } from '../pictureKit.ts';

/** 바퀴: 검은 타이어 + 밝은 가운데 */
const wheel = (x: number, y: number, r: number, hub = '#dfe8f5') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>` + dot(x, y, r * 0.42, hub);

/** 무한궤도 (포클레인·불도저) */
const track = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#4a4f66"/>` +
  [0.18, 0.39, 0.61, 0.82].map((f) => dot(x + w * f, y + h / 2, h * 0.24, '#a9b4c9')).join('');

/** 물결 띠 (y 위쪽 가장자리부터 아래 끝까지) */
const waves = (y: number, fill = '#7ec8f0') =>
  `<path d="M2 ${y}q8-6 16 0t16 0t16 0t16 0t16 0t16 0V98H2Z" fill="${fill}"/>`;

/** 꽃 한 송이 (가운데 x,y, 꽃잎 색) */
const flower = (x: number, y: number, c: string, r = 5) =>
  `<path d="M${x} ${y + r}V${y + r + 12}" stroke="#3a9e47" stroke-width="3"/>` +
  [0, 72, 144, 216, 288]
    .map((a) => {
      const t = ((a - 90) * Math.PI) / 180;
      return `<circle cx="${(x + r * Math.cos(t)).toFixed(1)}" cy="${(y + r * Math.sin(t)).toFixed(1)}" r="${r * 0.8}" fill="${c}" stroke-width="2"/>`;
    })
    .join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="#ffd23f" stroke-width="2"/>`;

/** 십자 (가운데 x,y, 팔 길이 반 l, 굵기 반 w) */
const cross = (x: number, y: number, l: number, w: number, fill: string, sw = 3) =>
  `<path d="M${x - w} ${y - l}H${x + w}V${y - w}H${x + l}V${y + w}H${x + w}V${y + l}H${x - w}V${y + w}H${x - l}V${y - w}H${x - w}Z" fill="${fill}" stroke-width="${sw}"/>`;

/** 줄무늬 차양 (가게 앞) */
const awning = (x: number, y: number, w: number, c1: string, c2: string) => {
  const n = 6;
  const sw = w / n;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="12" fill="${c1}"/>`;
  for (let i = 1; i < n; i += 2) s += `<rect x="${x + i * sw}" y="${y}" width="${sw}" height="12" fill="${c2}"/>`;
  let scal = '';
  for (let i = 0; i < n; i++) scal += `q${sw / 2} 8 ${sw} 0`;
  return s + `<path d="M${x} ${y + 12}${scal}Z" fill="${c1}"/><rect x="${x}" y="${y}" width="${w}" height="12"/>`;
};

/** 동전 (옆에서 본 쌓인 동전 한 닢) */
const coin = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4" fill="#ffc933" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  // ── 탈것 ──
  요트:
    `<path d="M50 10V70" stroke-width="4"/>` +
    `<path d="M54 12L88 64H54Z" fill="#fff"/>` +
    `<path d="M46 20L16 64H46Z" fill="#ff5c70"/>` +
    `<path d="M50 10L62 14L50 18" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M8 68H92L80 84H20Z" fill="#3b78e6"/><path d="M13 74H87" stroke="#fff" stroke-width="3"/>` +
    waves(86),
  트랙터:
    `<rect x="16" y="16" width="40" height="7" rx="2" fill="#e8553d"/>` +
    `<path d="M20 62V23H52L56 62Z" fill="#43b04a"/>` +
    `<path d="M26 28H46L49 48H26Z" fill="#8fd3ff"/>` +
    `<path d="M76 46V28" stroke-width="5"/>` +
    `<path d="M50 44H86C90 44 92 46 92 50V68H50Z" fill="#43b04a"/>` +
    `<path d="M58 50H84M58 56H84" stroke-width="2.5"/>` +
    `<circle cx="30" cy="70" r="22" fill="${INK}"/>` +
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        return `<circle cx="${(30 + 22 * Math.cos(t)).toFixed(1)}" cy="${(70 + 22 * Math.sin(t)).toFixed(1)}" r="3.5" fill="${INK}" stroke="none"/>`;
      })
      .join('') +
    dot(30, 70, 10, '#ffd23f') +
    dot(30, 70, 3.5) +
    wheel(78, 78, 13, '#ffd23f'),
  포클레인:
    track(6, 74, 58, 18) +
    `<rect x="8" y="56" width="52" height="18" rx="3" fill="#ffc933"/>` +
    `<path d="M12 56V28H36L42 56Z" fill="#ffc933"/>` +
    `<path d="M17 33H33L37 51H17Z" fill="#8fd3ff"/>` +
    tube('M48 60L68 18', '#ffc933', 9) +
    tube('M68 18L86 46', '#ffc933', 8) +
    `<path d="M78 46H96L92 64C88 70 80 68 76 62Z" fill="#8a96b0"/>` +
    `<path d="M80 66L78 72M86 68L85 74M92 66L93 72" stroke-width="3"/>` +
    dot(68, 18, 3, '#4a4f66'),
  불도저:
    track(10, 70, 62, 20) +
    `<rect x="12" y="50" width="56" height="20" rx="3" fill="#ffc933"/>` +
    `<path d="M18 50V24H44L50 50Z" fill="#ffc933"/>` +
    `<path d="M23 29H40L44 46H23Z" fill="#8fd3ff"/>` +
    `<path d="M60 50V34" stroke-width="5"/>` +
    tube('M66 64H82', '#4a4f66', 5) +
    `<path d="M80 36H90C95 50 95 76 90 90H80C84 76 84 50 80 36Z" fill="#8a96b0"/>` +
    `<path d="M4 94H96" stroke-width="3"/>`,
  크레인:
    `<path d="M16 12V30" stroke-width="2.5"/>` +
    `<path d="M16 30v5a4 4 0 1 1 -6 3" stroke-width="3"/>` +
    `<rect x="6" y="40" width="22" height="14" rx="2" fill="#c98b4f"/><path d="M6 47H28" stroke="#f5e3b8" stroke-width="3"/>` +
    tube('M50 54L16 12', '#ff9f1a', 8) +
    `<rect x="40" y="46" width="20" height="14" rx="3" fill="#e8862e"/>` +
    `<rect x="4" y="60" width="64" height="12" rx="2" fill="#ffc933"/>` +
    `<path d="M66 74V42C66 38 68 36 72 36H82C86 36 88 38 90 42L95 56V74Z" fill="#ffc933"/>` +
    `<path d="M72 42H82L86 54H72Z" fill="#8fd3ff"/>` +
    wheel(18, 76, 9) +
    wheel(42, 76, 9) +
    wheel(80, 76, 9),
  덤프트럭:
    blob('#9a5b2e', [
      [20, 34, 9],
      [34, 27, 12],
      [49, 33, 9],
    ]) +
    `<path d="M6 36H62L58 64H10Z" fill="#ff9f1a"/>` +
    `<path d="M16 42L18 58M34 42V58M52 42L50 58" stroke-width="2.5"/>` +
    `<rect x="6" y="62" width="60" height="8" fill="#8a96b0"/>` +
    `<path d="M64 70V38C64 34 66 32 70 32H80C84 32 86 34 88 38L94 52V70Z" fill="#ffc933"/>` +
    `<path d="M70 38H80L85 50H70Z" fill="#8fd3ff"/>` +
    wheel(20, 74, 10) +
    wheel(44, 74, 10) +
    wheel(80, 74, 10),
  견인차:
    `<g transform="translate(2 36) rotate(-16 22 30)" stroke-width="3">` +
    `<path d="M2 44V36C2 32 4 30 9 30L17 20C19 18 22 16 26 16H34C38 16 40 18 42 20L48 30C52 31 54 33 54 37V44Z" fill="#3b78e6"/>` +
    `<path d="M22 29L27 21H33V29Z" fill="#8fd3ff" stroke-width="2.5"/><path d="M37 29V21H41L45 29Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    wheel(14, 46, 7) +
    wheel(42, 46, 7) +
    `</g>` +
    tube('M60 52L50 30', '#4a4f66', 4) +
    `<path d="M50 30L52 44" stroke-width="2.5"/>` +
    `<rect x="46" y="52" width="22" height="18" fill="#ff9f1a"/>` +
    `<path d="M66 70V40C66 36 68 34 72 34H80C84 34 86 36 88 40L95 54V70Z" fill="#ff9f1a"/>` +
    `<path d="M72 40H80L85 52H72Z" fill="#8fd3ff"/>` +
    `<rect x="72" y="26" width="10" height="8" rx="2" fill="#ffd23f"/>` +
    wheel(56, 74, 9) +
    wheel(82, 74, 9),
  청소차:
    `<rect x="6" y="28" width="58" height="44" rx="4" fill="#43b04a"/>` +
    `<path d="M6 42H64" stroke-width="3"/><rect x="7.8" y="54" width="54.4" height="6" fill="#fff" stroke="none"/>` +
    `<path d="M64 72V40C64 36 66 34 70 34H80C84 34 86 36 88 40L94 54V72Z" fill="#43b04a"/>` +
    `<path d="M70 40H80L85 52H70Z" fill="#8fd3ff"/>` +
    `<path d="M4 64V46H20V64Z" fill="#8a96b0"/>` +
    `<g transform="rotate(-35 14 30)"><path d="M6 36L8 16H26L28 36Z" fill="#3b8fe0"/><rect x="4" y="12" width="26" height="5" rx="2" fill="#2a6fc4"/><path d="M13 20V32M21 20V32" stroke="#bfe6ff" stroke-width="3"/></g>` +
    `<circle cx="30" cy="22" r="4" fill="#ff9f1a" stroke-width="2.5"/><path d="M34 14L40 18L36 22Z" fill="#fff" stroke-width="2.5"/>` +
    wheel(22, 76, 10) +
    wheel(78, 76, 10),
  캠핑카:
    `<path d="M6 74V28C6 24 8 22 12 22H70C74 22 76 24 76 28V40H80C86 40 92 48 94 56V74Z" fill="#fff"/>` +
    `<path d="M76 30H86C88 30 90 32 90 34V40H76Z" fill="#fff"/>` +
    `<path d="M78 45H82C86 45 89 50 90 55H78Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="7.8" y="58" width="84.2" height="7" fill="#ff9f1a" stroke="none"/>` +
    `<rect x="12" y="30" width="16" height="12" rx="2" fill="#8fd3ff" stroke-width="2.5"/><rect x="32" y="30" width="16" height="12" rx="2" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="54" y="32" width="14" height="30" rx="2" fill="#ffd23f" stroke-width="2.5"/>` +
    awning(10, 12, 40, '#43b04a', '#fff') +
    wheel(24, 76, 10) +
    wheel(76, 76, 10),
  유람선:
    `<rect x="58" y="12" width="12" height="18" rx="2" fill="#e8553d"/><rect x="58" y="12" width="12" height="5" fill="${INK}" stroke-width="2"/>` +
    `<rect x="24" y="30" width="54" height="14" rx="2" fill="#fff"/>` +
    `<rect x="14" y="44" width="72" height="14" rx="2" fill="#fff"/>` +
    [30, 40, 50, 60, 70].map((x) => `<rect x="${x - 3}" y="34" width="6" height="6" rx="1" fill="#8fd3ff" stroke-width="2"/>`).join('') +
    [22, 34, 46, 58, 70, 80].map((x) => `<circle cx="${x}" cy="51" r="3" fill="#8fd3ff" stroke-width="2"/>`).join('') +
    `<path d="M4 58H96L84 82H14Z" fill="#3b78e6"/><path d="M8 64H93" stroke="#fff" stroke-width="3"/>` +
    waves(84),
  뗏목:
    `<path d="M50 44V12" stroke-width="4"/><path d="M52 14L74 22L52 32Z" fill="#ff5c70"/>` +
    [40, 50, 60]
      .map((y) => `<rect x="10" y="${y}" width="80" height="11" rx="5.5" fill="#c98b4f"/><ellipse cx="14" cy="${y + 5.5}" rx="4" ry="5.5" fill="#f2c98a" stroke-width="2.5"/>`)
      .join('') +
    `<path d="M28 39V72M72 39V72" stroke="#f2d58a" stroke-width="4"/>` +
    waves(70),
  열기구:
    blob('#fff', [
      [14, 76, 6],
      [22, 72, 7],
    ]) +
    blob('#fff', [
      [82, 30, 6],
      [89, 26, 6],
    ]) +
    `<path d="M50 6C76 6 88 24 84 42C80 56 64 64 60 72H40C36 64 20 56 16 42C12 24 24 6 50 6Z" fill="#e8553d"/>` +
    `<path d="M50 6C38 18 36 48 43 72H57C64 48 62 18 50 6Z" fill="#ffd23f"/>` +
    `<path d="M50 6C76 6 88 24 84 42C80 56 64 64 60 72H40C36 64 20 56 16 42C12 24 24 6 50 6Z"/>` +
    `<path d="M42 72L42 80M58 72L58 80" stroke-width="2.5"/>` +
    `<rect x="38" y="80" width="24" height="14" rx="2" fill="#9a5b2e"/><path d="M38 86H62" stroke="#6b3e26" stroke-width="2.5"/>`,
  케이블카:
    `<path d="M4 92L28 56L44 74L66 44L96 92Z" fill="#8fd67a"/>` +
    `<path d="M4 16L96 34" stroke-width="3"/>` +
    `<circle cx="50" cy="25" r="4" fill="#4a4f66"/>` +
    `<path d="M50 25V40" stroke-width="4"/>` +
    `<rect x="32" y="36" width="36" height="5" rx="2" fill="#4a4f66"/>` +
    `<rect x="28" y="40" width="44" height="38" rx="7" fill="#e8553d"/>` +
    `<rect x="33" y="46" width="34" height="15" rx="2" fill="#8fd3ff"/><path d="M50 46V61" stroke-width="2.5"/>` +
    `<path d="M29 68H71" stroke="#fff" stroke-width="3"/>`,
  스쿠터:
    `<path d="M76 72C76 60 88 58 92 70" stroke-width="4"/>` +
    wheel(22, 76, 11) +
    wheel(80, 76, 11) +
    `<path d="M8 70C8 56 18 50 32 50H52L58 70Z" fill="#7ec8f0"/>` +
    `<path d="M56 70H70" stroke-width="5"/>` +
    `<path d="M64 72L70 32H78L78 72Z" fill="#7ec8f0"/>` +
    `<rect x="16" y="42" width="30" height="9" rx="4.5" fill="#6b3e26"/>` +
    tube('M64 30H84', '#4a4f66', 4) +
    `<circle cx="80" cy="38" r="5" fill="#ffd23f"/>`,
  세발자전거:
    tube('M24 80H44', '#4a4f66', 4) +
    tube('M34 80L46 58', '#e8553d', 5) +
    tube('M46 58L68 66', '#e8553d', 5) +
    wheel(16, 80, 11) +
    wheel(42, 82, 11) +
    wheel(70, 66, 21) +
    tube('M70 66L64 24', '#e8553d', 5) +
    tube('M54 22H74', '#4a4f66', 4) +
    `<ellipse cx="44" cy="52" rx="12" ry="5" fill="#4a4f66"/>` +
    `<path d="M70 66L78 72M70 66L62 60" stroke-width="4"/>`,
  마차:
    tube('M44 62L70 58', '#9a5b2e', 3) +
    `<path d="M8 66V42C8 30 18 24 28 24S48 30 48 42V66Z" fill="#a45cf0"/>` +
    `<path d="M4 26C12 16 44 16 52 26Z" fill="#8e4fc9"/><circle cx="28" cy="15" r="3.5" fill="#ffd23f" stroke-width="2"/>` +
    `<rect x="18" y="34" width="20" height="16" rx="3" fill="#8fd3ff"/>` +
    `<path d="M8 58H48" stroke="#ffd23f" stroke-width="3"/>` +
    wheel(16, 74, 12, '#ffd23f') +
    wheel(42, 76, 10, '#ffd23f') +
    `<path d="M64 62V86M70 64V86M84 62V86M90 60V86" stroke="#9a5b2e" stroke-width="5"/>` +
    `<ellipse cx="77" cy="56" rx="16" ry="10" fill="#c98b4f"/>` +
    `<path d="M82 52L84 30C85 24 92 22 95 28L97 36C97 40 93 41 91 39L90 54Z" fill="#c98b4f"/>` +
    `<path d="M84 24L85 18L89 23" fill="#c98b4f" stroke-width="2.5"/>` +
    `<path d="M83 28C80 34 80 42 81 50" stroke="#6b3e26" stroke-width="4"/>` +
    dot(90, 30, 2.2) +
    `<path d="M61 54C57 58 57 64 59 68" stroke="#6b3e26" stroke-width="4"/>`,
  스케이트보드:
    `<g transform="rotate(-10 50 56)">` +
    `<rect x="24" y="58" width="12" height="6" rx="2" fill="#8a96b0"/><rect x="64" y="58" width="12" height="6" rx="2" fill="#8a96b0"/>` +
    `<path d="M6 44C6 40 10 40 14 46H86C90 40 94 40 94 44C94 52 90 58 82 58H18C10 58 6 52 6 44Z" fill="#ff9f1a"/>` +
    `<path d="M20 51H80" stroke="#ffd23f" stroke-width="5"/>` +
    wheel(24, 68, 7, '#ff5c70') +
    wheel(76, 68, 7, '#ff5c70') +
    `</g>` +
    `<path d="M10 80H28M4 88H20" stroke="#9aa6c4" stroke-width="3"/>`,
  롤러스케이트:
    `<path d="M22 14H52V46C66 48 84 52 86 64V74H22Z" fill="#ff5c70"/>` +
    `<rect x="20" y="10" width="34" height="9" rx="3" fill="#fff"/>` +
    `<path d="M44 26H56M44 34H58M44 42H60" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 50C60 52 70 54 80 60" stroke="#fff" stroke-width="3"/>` +
    `<rect x="16" y="72" width="76" height="7" rx="3" fill="#dfe8f5"/>` +
    `<circle cx="92" cy="80" r="4" fill="#ff9f1a" stroke-width="2.5"/>` +
    wheel(28, 86, 8, '#ffd23f') +
    wheel(46, 86, 8, '#ffd23f') +
    wheel(64, 86, 8, '#ffd23f') +
    wheel(82, 86, 8, '#ffd23f'),

  // ── 집 안 ──
  부엌:
    `<path d="M40 16C36 10 44 8 40 2M50 16C46 10 54 8 50 2M60 16C56 10 64 8 60 2" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="26" y="20" width="48" height="6" rx="3" fill="#b8c2d6"/><rect x="45" y="15" width="10" height="6" rx="2" fill="#4a4f66"/>` +
    `<path d="M28 26H72V40C72 44 70 46 66 46H34C30 46 28 44 28 40Z" fill="#e8553d"/>` +
    `<path d="M28 30H20M72 30H80" stroke-width="5"/>` +
    `<path d="M36 50q2-5 4 0q2-5 4 0M56 50q2-5 4 0q2-5 4 0" stroke="#3b8fe0" stroke-width="3"/>` +
    `<rect x="6" y="48" width="88" height="8" rx="2" fill="#8a96b0"/>` +
    `<rect x="10" y="56" width="80" height="36" fill="#fff"/>` +
    `<rect x="22" y="64" width="56" height="22" rx="3" fill="#4a4f66"/><rect x="28" y="70" width="44" height="10" rx="2" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M40 60H60" stroke-width="3"/>` +
    dot(16, 62, 3, '#e8553d') +
    dot(84, 62, 3, '#e8553d'),
  화장실:
    `<rect x="6" y="84" width="88" height="10" rx="2" fill="#dfe8f5"/>` +
    `<rect x="8" y="30" width="26" height="22" rx="4" fill="#fff"/><rect x="24" y="34" width="8" height="4" rx="2" fill="#b8c2d6" stroke-width="2"/>` +
    `<path d="M16 52V60H8C8 74 16 80 22 80L20 86H40L38 78C46 74 50 68 50 60H26V52Z" fill="#fff"/>` +
    `<ellipse cx="29" cy="60" rx="21" ry="4.5" fill="#dfe8f5"/>` +
    `<rect x="62" y="12" width="26" height="22" rx="10" fill="#bfe6ff"/><path d="M68 18L74 24" stroke="#fff" stroke-width="3"/>` +
    `<path d="M72 50V40H78V44" stroke-width="3"/>` +
    `<path d="M56 50H94C94 60 86 64 75 64S56 60 56 50Z" fill="#fff"/>` +
    `<path d="M70 64L68 86H82L80 64Z" fill="#fff"/>`,
  거실:
    `<rect x="4" y="84" width="92" height="10" fill="#e3c9a0"/>` +
    `<rect x="54" y="12" width="40" height="28" rx="3" fill="#4a4f66"/><rect x="58" y="16" width="32" height="20" rx="2" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M66 32L72 24L78 32M78 32L82 27L86 32" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M74 40V46" stroke-width="3"/><rect x="60" y="46" width="30" height="10" rx="2" fill="#9a5b2e"/>` +
    `<path d="M12 48C12 42 14 40 20 40H62C68 40 70 42 70 48V62H12Z" fill="#e85d9a"/>` +
    `<rect x="6" y="54" width="12" height="28" rx="5" fill="#e85d9a"/><rect x="64" y="54" width="12" height="28" rx="5" fill="#e85d9a"/>` +
    `<rect x="16" y="60" width="52" height="16" rx="3" fill="#ff9aa8"/><path d="M42 60V76" stroke-width="2.5"/>` +
    `<path d="M12 82V88M70 82V88" stroke-width="4"/>` +
    `<rect x="84" y="62" width="8" height="22" rx="2" fill="#9a5b2e"/>` +
    `<path d="M80 64C78 54 88 50 88 58M88 62C92 52 98 58 92 64" fill="#43b04a" stroke-width="2.5"/>`,
  마당:
    `<path d="M4 58H96V94H4Z" fill="#8fd67a"/>` +
    `<path d="M30 58V32H70V58Z" fill="#fff4d0"/><path d="M24 34L50 14L76 34Z" fill="#e8553d"/>` +
    `<rect x="44" y="42" width="12" height="16" fill="#9a5b2e"/><rect x="34" y="40" width="8" height="8" fill="#8fd3ff" stroke-width="2.5"/><rect x="60" y="40" width="8" height="8" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="66" rx="6" ry="3" fill="#dfe8f5" stroke-width="2.5"/><ellipse cx="46" cy="76" rx="7" ry="3.5" fill="#dfe8f5" stroke-width="2.5"/><ellipse cx="52" cy="88" rx="8" ry="4" fill="#dfe8f5" stroke-width="2.5"/>` +
    [8, 16, 24, 76, 84, 92].map((x) => `<path d="M${x} 72V56L${x + 3} 52L${x + 6} 56V72Z" fill="#fff" stroke-width="2.5"/>`).slice(0, 6).join('') +
    `<path d="M6 62H30M72 62H96" stroke-width="2.5"/>` +
    `<circle cx="74" cy="82" r="7" fill="#ff9f1a"/><path d="M68 80Q74 84 80 80" stroke-width="2"/>` +
    `<circle cx="20" cy="84" r="3" fill="#ffd23f" stroke-width="2"/><circle cx="30" cy="80" r="3" fill="#ff9aa8" stroke-width="2"/>`,
  정원:
    `<path d="M4 64C24 58 76 58 96 64V94H4Z" fill="#8fd67a"/>` +
    `<path d="M20 64L22 36H28L30 64Z" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [25, 24, 14],
      [14, 34, 9],
      [36, 34, 9],
    ]) +
    `<circle cx="20" cy="22" r="3" fill="#ff5c70" stroke-width="2"/><circle cx="32" cy="30" r="3" fill="#ff5c70" stroke-width="2"/>` +
    flower(50, 50, '#ff5c70', 7) +
    flower(70, 44, '#a45cf0', 7) +
    flower(86, 58, '#ffd23f', 6) +
    flower(36, 64, '#ff9f1a', 6) +
    flower(62, 70, '#e85d9a', 7) +
    flower(14, 74, '#3b8fe0', 6),
  지붕:
    `<rect x="24" y="52" width="52" height="40" fill="#fff4d0" stroke="#8a96b0"/>` +
    `<rect x="44" y="68" width="12" height="24" fill="#e3c9a0" stroke="#8a96b0"/>` +
    `<rect x="30" y="60" width="9" height="9" fill="#dfe8f5" stroke="#8a96b0" stroke-width="2.5"/><rect x="61" y="60" width="9" height="9" fill="#dfe8f5" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<rect x="64" y="18" width="9" height="16" fill="#9a5b2e"/>` +
    `<path d="M12 54L50 22L88 54Z" fill="#e8553d" stroke-width="4.5"/>` +
    `<path d="M26 44H74M38 34H62" stroke="#b8392a" stroke-width="3"/>` +
    ring(50, 40, 44, 24),
  창고:
    `<path d="M8 36L50 12L92 36V90H8Z" fill="#9a5b2e"/>` +
    `<path d="M14 40H86" stroke="#6b3e26" stroke-width="3"/>` +
    `<rect x="20" y="46" width="60" height="44" fill="#6b3e26"/>` +
    `<rect x="24" y="66" width="18" height="16" fill="#e3b577"/><path d="M33 66V72" stroke-width="2.5"/>` +
    `<rect x="44" y="66" width="18" height="16" fill="#e3b577"/><path d="M53 66V72" stroke-width="2.5"/>` +
    `<rect x="34" y="50" width="18" height="16" fill="#e3b577"/><path d="M43 50V56" stroke-width="2.5"/>` +
    `<rect x="64" y="72" width="14" height="10" fill="#e3b577"/>` +
    `<path d="M80 46L96 50V90H80Z" fill="#c98b4f"/><path d="M83 52L93 88M93 54L83 88" stroke="#6b3e26" stroke-width="2.5"/>` +
    `<path d="M4 90H96"/>`,

  // ── 가게·건물 ──
  마트:
    `<rect x="10" y="22" width="80" height="44" fill="#fff"/>` +
    awning(6, 12, 88, '#e8553d', '#fff') +
    `<rect x="18" y="36" width="26" height="26" rx="2" fill="#8fd3ff"/><rect x="56" y="36" width="26" height="30" fill="#8fd3ff"/><path d="M69 36V66" stroke-width="2.5"/>` +
    `<path d="M6 66H94"/>` +
    `<circle cx="36" cy="58" r="7" fill="#e8553d"/><path d="M36 51V48" stroke-width="2.5"/>` +
    `<rect x="44" y="50" width="12" height="16" rx="2" fill="#fff"/><path d="M44 54H56" stroke="#3b78e6" stroke-width="3"/>` +
    `<ellipse cx="62" cy="60" rx="10" ry="6" fill="#e8a85c"/>` +
    `<path d="M8 50H18L24 76H74" stroke-width="5"/>` +
    `<path d="M20 60H78L72 76H24Z" fill="#dfe8f5"/>` +
    `<path d="M34 60V76M48 60V76M62 60V76M22 68H75" stroke="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M20 60H78L72 76H24Z"/>` +
    wheel(30, 86, 5) +
    wheel(68, 86, 5),
  약국:
    `<rect x="12" y="28" width="76" height="62" fill="#fff"/>` +
    awning(8, 26, 84, '#43b04a', '#fff') +
    `<rect x="36" y="4" width="28" height="24" rx="4" fill="#fff"/>` +
    cross(50, 16, 9, 3.5, '#43b04a', 2.5) +
    `<rect x="18" y="48" width="36" height="34" rx="2" fill="#bfe6ff"/>` +
    `<rect x="24" y="56" width="10" height="18" rx="3" fill="#ff9f1a"/><rect x="23" y="52" width="12" height="6" rx="2" fill="#fff" stroke-width="2.5"/>` +
    `<g transform="rotate(-30 44 66)"><rect x="37" y="61" width="16" height="10" rx="5" fill="#fff" stroke-width="2.5"/><path d="M42 61H48V71H42Z" fill="#e8553d" stroke="none"/><rect x="37" y="61" width="16" height="10" rx="5" stroke-width="2.5"/></g>` +
    `<rect x="60" y="50" width="22" height="40" fill="#8fd3ff"/><path d="M64 70H68" stroke-width="3"/>` +
    `<path d="M6 90H94"/>`,
  은행:
    `<path d="M10 32L50 10L90 32Z" fill="#dfe8f5"/>` +
    `<circle cx="50" cy="24" r="6" fill="#ffc933" stroke-width="2.5"/>` +
    `<rect x="14" y="32" width="72" height="6" fill="#b8c2d6"/>` +
    [22, 40, 58, 76].map((x) => `<rect x="${x - 3}" y="38" width="8" height="34" fill="#fff" stroke-width="2.5"/>`).join('') +
    `<rect x="14" y="72" width="72" height="6" fill="#b8c2d6"/>` +
    [88, 83, 78, 73, 68]
      .map((y) => coin(26, y))
      .join('') +
    [88, 83, 78].map((y) => coin(74, y)).join('') +
    `<circle cx="50" cy="80" r="12" fill="#ffc933"/><circle cx="50" cy="80" r="7" stroke="#e8862e" stroke-width="3"/>`,
  유치원:
    `<rect x="12" y="38" width="76" height="52" fill="#fff4d0"/>` +
    `<path d="M8 40L28 18H72L92 40Z" fill="#ff9f1a"/>` +
    `<circle cx="50" cy="29" r="7" fill="#fff"/><path d="M50 25V29L53 31" stroke-width="2.5"/>` +
    `<path d="M12 12Q30 22 50 12Q70 22 88 12" stroke-width="2"/>` +
    [
      [18, 15, '#e8553d'],
      [30, 18, '#ffd23f'],
      [42, 15, '#3b78e6'],
      [58, 15, '#43b04a'],
      [70, 18, '#a45cf0'],
      [82, 15, '#e85d9a'],
    ]
      .map(([x, y, c]) => `<path d="M${(x as number) - 4} ${y}L${(x as number) + 4} ${y}L${x} ${(y as number) + 8}Z" fill="${c}" stroke-width="2"/>`)
      .join('') +
    `<rect x="18" y="46" width="14" height="14" rx="2" fill="#8fd3ff" stroke-width="2.5"/><rect x="68" y="46" width="14" height="14" rx="2" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M40 90V68a10 10 0 0 1 20 0V90Z" fill="#43b04a"/>` +
    `<circle cx="25" cy="76" r="5" fill="#e8553d" stroke-width="2.5"/><circle cx="75" cy="76" r="5" fill="#3b78e6" stroke-width="2.5"/>` +
    `<path d="M4 90H96"/>`,
  어린이집:
    `<path d="M4 86C20 82 80 82 96 86V94H4Z" fill="#8fd67a"/>` +
    `<rect x="24" y="44" width="52" height="42" fill="#ffe0ea"/>` +
    `<path d="M16 46L50 18L84 46Z" fill="#8e4fc9"/>` +
    `<path d="M50 38C46 32 40 36 44 40L50 45L56 40C60 36 54 32 50 38Z" fill="#ff5c70" stroke-width="2"/>` +
    `<rect x="30" y="52" width="12" height="12" rx="6" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M52 86V64a8 8 0 0 1 16 0V86Z" fill="#ffd23f"/>` +
    person(14, 88, 0.62, { hair: '#5a3b24', style: 'pony', shirt: '#ffd23f' }) +
    person(88, 88, 0.62, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }),
  놀이공원:
    `<path d="M20 90L36 40L52 90" stroke-width="4"/>` +
    `<circle cx="36" cy="38" r="28" fill="#fff" stroke="#e85d9a" stroke-width="4"/>` +
    [0, 60, 120].map((a) => `<path d="M36 38l${(28 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(28 * Math.sin((a * Math.PI) / 180)).toFixed(1)}M36 38l${(-28 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(-28 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" stroke="#e85d9a" stroke-width="2.5"/>`).join('') +
    ['#e8553d', '#ffd23f', '#3b8fe0', '#43b04a', '#a45cf0', '#ff9f1a']
      .map((c, i) => {
        const t = ((i * 60 - 90) * Math.PI) / 180;
        return `<rect x="${(36 + 28 * Math.cos(t) - 5).toFixed(1)}" y="${(38 + 28 * Math.sin(t) - 3).toFixed(1)}" width="10" height="9" rx="3" fill="${c}" stroke-width="2.5"/>`;
      })
      .join('') +
    dot(36, 38, 4, '#4a4f66') +
    `<path d="M66 60V86M82 60V86" stroke-width="3"/>` +
    `<path d="M74 42L96 60H52Z" fill="#ff5c70"/><path d="M74 42L66 60M74 42L82 60" stroke-width="2.5"/><path d="M68 60L74 42L80 60Z" fill="#fff" stroke="none"/><path d="M74 42L96 60H52Z"/>` +
    `<path d="M74 42V36" stroke-width="3"/><circle cx="74" cy="34" r="3" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M68 74C68 68 74 66 80 68L84 64L86 70L82 74H70Z" fill="#fff" stroke-width="2.5"/><path d="M72 74V80M80 74V80" stroke-width="2.5"/>` +
    `<rect x="50" y="86" width="48" height="6" rx="2" fill="#ffd23f"/>`,
  박물관:
    `<path d="M6 32L50 8L94 32Z" fill="#f2e6c9"/>` +
    `<path d="M40 26H60" stroke-width="3"/>` +
    `<rect x="8" y="32" width="84" height="8" fill="#e3d3ad"/>` +
    [18, 34, 50, 66, 82]
      .map((x) => `<rect x="${x - 5}" y="40" width="10" height="38" fill="#fff"/><path d="M${x - 1.5} 44V74" stroke="#d6c7a3" stroke-width="2.5"/>`)
      .join('') +
    `<rect x="6" y="78" width="88" height="6" fill="#e3d3ad"/><rect x="2" y="84" width="96" height="8" fill="#d6c7a3"/>`,
  영화관:
    `<rect x="4" y="6" width="92" height="88" rx="4" fill="#4a4f66"/>` +
    `<rect x="18" y="14" width="64" height="38" rx="2" fill="#bfe6ff" stroke-width="3"/>` +
    `<path d="M24 46L38 28L50 42L60 32L76 46Z" fill="#8fd67a" stroke-width="2.5"/><circle cx="68" cy="24" r="4" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M4 8C10 22 10 50 16 60H4Z" fill="#e8553d"/><path d="M96 8C90 22 90 50 84 60H96Z" fill="#e8553d"/>` +
    [16, 34, 52, 70]
      .map((x) => `<path d="M${x} 90V74C${x} 68 ${x + 2} 66 ${x + 7} 66S${x + 14} 68 ${x + 14} 74V90Z" fill="#e8553d"/>`)
      .join('') +
    `<rect x="12" y="80" width="76" height="8" rx="2" fill="#b8392a"/>`,
  공항:
    `<path d="M4 84H96V94H4Z" fill="#8a96b0"/><path d="M12 89H26M40 89H54M68 89H82" stroke="#fff" stroke-width="3"/>` +
    `<rect x="16" y="36" width="12" height="48" fill="#dfe8f5"/>` +
    `<path d="M8 36L12 20H32L36 36Z" fill="#8fd3ff"/><path d="M8 20H36M16 20V36M28 20V36" stroke-width="2.5"/>` +
    `<rect x="10" y="14" width="24" height="6" rx="2" fill="#4a4f66"/><path d="M22 14V8" stroke-width="3"/><circle cx="22" cy="7" r="2.5" fill="#e8553d" stroke-width="2"/>` +
    `<g transform="rotate(-22 66 52)">` +
    `<path d="M64 46L72 46L64 30H58Z" fill="#2a6fc4"/>` +
    `<path d="M44 48L40 36H48L54 46Z" fill="#3b78e6"/>` +
    `<path d="M42 52C42 48 44 46 48 46H86C92 46 96 49 96 52C96 55 92 58 86 58H48C44 58 42 56 42 52Z" fill="#fff"/>` +
    `<path d="M88 47C91 48 93 50 94 52H88Z" fill="#8fd3ff" stroke-width="2"/>` +
    [56, 64, 72, 80].map((x) => `<circle cx="${x}" cy="51" r="2" fill="#8fd3ff" stroke-width="1.5"/>`).join('') +
    `<path d="M58 55L72 55L62 72H54Z" fill="#3b78e6"/>` +
    `</g>`,
  기차역:
    `<path d="M4 36L50 12L96 36Z" fill="#e8553d"/>` +
    `<rect x="4" y="36" width="92" height="6" fill="#b8392a"/>` +
    `<path d="M10 42V88M90 42V88" stroke-width="5"/>` +
    `<circle cx="50" cy="26" r="7" fill="#fff" stroke-width="2.5"/><path d="M50 22V26H53" stroke-width="2"/>` +
    `<rect x="16" y="50" width="64" height="30" rx="6" fill="#43b04a"/>` +
    [22, 38, 54].map((x) => `<rect x="${x}" y="55" width="12" height="11" rx="2" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<path d="M70 52C78 52 84 58 86 66V80H70Z" fill="#43b04a"/><path d="M72 56C77 57 80 60 82 64H72Z" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<rect x="17.8" y="70" width="67" height="4" fill="#ffd23f" stroke="none"/>` +
    wheel(30, 82, 5) +
    wheel(48, 82, 5) +
    wheel(70, 82, 5) +
    `<rect x="4" y="88" width="92" height="6" rx="2" fill="#dfe8f5"/>`,
  정류장:
    `<path d="M4 90H96" stroke-width="3.5"/>` +
    `<path d="M40 30H94V36H40Z" fill="#3b78e6"/>` +
    `<rect x="44" y="36" width="46" height="34" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<path d="M44 36V90M90 36V90" stroke-width="4"/>` +
    `<rect x="48" y="68" width="38" height="7" rx="2" fill="#e8862e"/><path d="M54 75V88M80 75V88" stroke-width="3.5"/>` +
    `<path d="M22 38V90" stroke-width="5"/>` +
    `<circle cx="22" cy="24" r="17" fill="#fff" stroke="#3b78e6" stroke-width="5"/>` +
    `<rect x="12" y="15" width="20" height="15" rx="3" fill="#3b78e6" stroke-width="2"/><rect x="15" y="18" width="14" height="6" rx="1" fill="#fff" stroke-width="1.5"/>` +
    dot(16, 31, 2.4) +
    dot(28, 31, 2.4),
  주차장:
    `<rect x="4" y="8" width="92" height="84" rx="4" fill="#8a96b0"/>` +
    `<path d="M8 12V46M34 12V46M60 12V46M88 12V46M8 54V88M34 54V88M60 54V88M88 54V88" stroke="#fff" stroke-width="3"/>` +
    [
      [21, 29, '#e8553d'],
      [47, 29, '#3b78e6'],
      [21, 71, '#ffd23f'],
      [74, 71, '#43b04a'],
    ]
      .map(
        ([x, y, c]) =>
          `<rect x="${(x as number) - 9}" y="${(y as number) - 15}" width="18" height="30" rx="6" fill="${c}"/>` +
          `<rect x="${(x as number) - 6}" y="${(y as number) - 9}" width="12" height="6" rx="2" fill="#8fd3ff" stroke-width="2"/>` +
          `<rect x="${(x as number) - 6}" y="${(y as number) + 5}" width="12" height="5" rx="2" fill="#8fd3ff" stroke-width="2"/>`,
      )
      .join(''),
  // ── 밖·자연 ──
  농장:
    `<path d="M4 76C24 70 76 70 96 76V94H4Z" fill="#8fd67a"/>` +
    `<path d="M20 80V42L32 22H68L80 42V80Z" fill="#e8553d"/>` +
    `<path d="M16 44L32 20H68L84 44" stroke="#fff" stroke-width="4"/><path d="M16 44L32 20H68L84 44"/>` +
    `<rect x="42" y="28" width="16" height="12" fill="#fff4d0" stroke-width="2.5"/>` +
    `<rect x="36" y="52" width="28" height="28" fill="#e8553d" stroke="#fff" stroke-width="4"/><path d="M38 54L62 78M62 54L38 78" stroke="#fff" stroke-width="4"/>` +
    `<path d="M4 72H96M4 82H96" stroke="#fff" stroke-width="3"/>` +
    [8, 16, 24, 76, 84, 92].map((x) => `<path d="M${x} 90V68" stroke="#fff" stroke-width="4"/>`).join('') +
    `<path d="M4 72H20M80 72H96M4 82H20M80 82H96" stroke="${INK}" stroke-width="1.5" opacity=".5"/>`,
  밭:
    `<rect x="4" y="26" width="92" height="68" rx="4" fill="#9a5b2e"/>` +
    [42, 64].map((y) => `<path d="M4 ${y}H96" stroke="#6b3e26" stroke-width="6"/>`).join('') +
    [38, 60, 84]
      .map((y) =>
        [18, 40, 62, 84]
          .map((x) => `<path d="M${x} ${y}C${x - 10} ${y - 10} ${x - 4} ${y - 18} ${x} ${y - 6}C${x + 4} ${y - 18} ${x + 10} ${y - 10} ${x} ${y}Z" fill="#43b04a" stroke-width="2.5"/>`)
          .join(''),
      )
      .join('') +
    `<circle cx="84" cy="12" r="8" fill="#ffd23f"/>`,
  터널:
    `<path d="M2 80C8 40 30 14 52 14S94 40 98 80Z" fill="#43b04a"/>` +
    `<path d="M30 80V56C30 42 40 34 50 34S70 42 70 56V80Z" fill="#b8c2d6"/>` +
    `<path d="M36 80V58C36 48 42 42 50 42S64 48 64 58V80Z" fill="#2a2f45"/>` +
    `<path d="M36 80L4 96H96L64 80Z" fill="#8a96b0"/>` +
    `<path d="M50 82V86M50 90V95" stroke="#fff" stroke-width="3"/>` +
    blob('#3a9e47', [
      [14, 62, 6],
      [86, 62, 6],
    ]),
  동굴:
    `<path d="M4 88C4 60 14 36 30 26C40 18 60 16 72 24C88 34 96 58 96 88Z" fill="#a9b4c9"/>` +
    `<path d="M20 44L26 36M78 44L72 38M86 62L80 56" stroke="#8a96b0" stroke-width="3"/>` +
    `<path d="M28 88C28 66 36 50 50 50S72 66 72 88Z" fill="#2a2f45"/>` +
    `<path d="M40 54L42 62L45 54M54 52L56 60L58 53" fill="#a9b4c9" stroke-width="2"/>` +
    `<ellipse cx="18" cy="86" rx="10" ry="6" fill="#8a96b0"/><ellipse cx="84" cy="86" rx="10" ry="6" fill="#8a96b0"/>` +
    `<path d="M4 90H96" stroke-width="3"/>`,
  사막:
    `<circle cx="78" cy="20" r="11" fill="#ffd23f"/>` +
    `<path d="M2 62C20 50 40 50 60 60S88 56 98 58V94H2Z" fill="#f2c14e"/>` +
    `<path d="M2 78C24 68 52 72 70 78S92 74 98 76V94H2Z" fill="#e8b04a"/>` +
    `<path d="M30 80V44C30 38 40 38 40 44V80Z" fill="#43b04a"/>` +
    `<path d="M30 60H24C20 60 18 58 18 54V46C18 42 24 42 24 46V52H30Z" fill="#43b04a"/>` +
    `<path d="M40 54H46V42C46 38 52 38 52 42V54C52 58 50 60 46 60H40Z" fill="#43b04a"/>` +
    `<path d="M35 46V74" stroke="#3a9e47" stroke-width="2"/>`,
  정글:
    `<rect x="4" y="4" width="92" height="90" rx="6" fill="#3a9e47"/>` +
    `<path d="M20 4C18 30 26 50 22 94M76 4C80 30 72 60 78 94" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M4 30C20 18 38 22 42 36C28 30 16 32 4 42Z" fill="#5fc24a"/>` +
    `<path d="M96 24C80 14 62 20 58 34C72 28 84 30 96 38Z" fill="#5fc24a"/>` +
    `<path d="M4 94C8 70 26 62 40 70C28 72 18 82 18 94Z" fill="#43b04a"/>` +
    `<path d="M96 94C92 70 74 62 60 70C72 72 82 82 82 94Z" fill="#43b04a"/>` +
    `<path d="M50 94C44 78 48 64 58 58C56 70 58 82 62 94Z" fill="#8fd67a"/>` +
    `<path d="M50 30C60 30 62 40 60 48L56 60H48C42 52 40 36 50 30Z" fill="#e8553d"/>` +
    `<path d="M50 30C44 32 42 38 46 40L50 38" fill="#e8553d"/>` +
    `<path d="M42 36C38 36 38 42 42 42Z" fill="#ffd23f" stroke-width="2.5"/>` +
    dot(49, 36, 2.2) +
    `<path d="M56 44C60 50 58 56 54 58" stroke="#3b8fe0" stroke-width="4"/>` +
    `<path d="M50 60L48 74M54 60L56 74" stroke="#3b8fe0" stroke-width="4"/>`,
  수족관:
    `<rect x="6" y="14" width="88" height="66" rx="4" fill="#4aa8f0"/>` +
    `<path d="M9 22H91" stroke="#bfe6ff" stroke-width="3"/>` +
    `<path d="M9 74C20 68 36 70 50 72S80 70 91 72V77H9Z" fill="#f2d58a" stroke="none"/>` +
    `<path d="M20 74C14 64 26 58 18 46M28 74C34 64 24 56 30 48" stroke="#43b04a" stroke-width="4"/>` +
    `<path d="M36 40C44 30 58 32 62 40C58 48 44 50 36 40Z" fill="#ff9f1a"/><path d="M36 40L28 34V46Z" fill="#ff9f1a"/>` +
    dot(54, 38, 2.2) +
    `<path d="M62 62C68 56 78 56 82 62C78 68 68 68 62 62Z" fill="#ffd23f"/><path d="M82 62L88 57V67Z" fill="#ffd23f"/>` +
    dot(67, 61, 2) +
    `<circle cx="72" cy="30" r="3" fill="#bfe6ff" stroke-width="2"/><circle cx="76" cy="22" r="2.5" fill="#bfe6ff" stroke-width="2"/>` +
    `<rect x="6" y="14" width="88" height="66" rx="4"/>` +
    `<rect x="10" y="80" width="80" height="12" fill="#9a5b2e"/>`,
  꽃집:
    `<rect x="10" y="26" width="80" height="64" fill="#fff"/>` +
    awning(6, 16, 88, '#e85d9a', '#fff') +
    `<rect x="18" y="42" width="30" height="24" rx="2" fill="#bfe6ff"/><rect x="58" y="42" width="24" height="48" fill="#8fd3ff"/>` +
    `<path d="M26 66C24 58 32 52 34 60C36 52 44 56 40 66Z" fill="#ff5c70" stroke-width="2.5"/>` +
    flower(20, 66, '#ff5c70', 6) +
    flower(32, 62, '#ffd23f', 6) +
    flower(44, 68, '#a45cf0', 6) +
    flower(66, 70, '#ff9f1a', 5) +
    flower(80, 66, '#e85d9a', 6) +
    `<path d="M14 80H50L46 92H18Z" fill="#9a5b2e"/><path d="M60 82H88L85 92H63Z" fill="#9a5b2e"/>` +
    `<path d="M4 92H96"/>`,
  문구점:
    `<rect x="10" y="26" width="80" height="64" fill="#fff"/>` +
    awning(6, 16, 88, '#3b78e6', '#fff') +
    `<rect x="16" y="42" width="68" height="44" rx="2" fill="#bfe6ff"/>` +
    [
      [26, '#e8553d'],
      [36, '#ffd23f'],
      [46, '#43b04a'],
    ]
      .map(([x, c]) => `<path d="M${(x as number) - 4} 84V56L${x} 48L${(x as number) + 4} 56V84Z" fill="${c}" stroke-width="2.5"/><path d="M${(x as number) - 4} 56H${(x as number) + 4}" stroke-width="2"/>`)
      .join('') +
    `<rect x="56" y="52" width="22" height="30" rx="2" fill="#a45cf0"/><path d="M60 52V82" stroke-width="2.5"/><rect x="63" y="60" width="11" height="6" fill="#fff" stroke-width="2"/>` +
    `<path d="M4 90H96"/>`,
  미용실:
    `<rect x="28" y="6" width="44" height="34" rx="16" fill="#bfe6ff"/><path d="M38 14L46 22" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 72V84M36 86H64" stroke-width="5"/>` +
    `<rect x="32" y="42" width="36" height="28" rx="8" fill="#e8553d"/>` +
    `<rect x="26" y="60" width="48" height="14" rx="6" fill="#e8553d"/>` +
    `<rect x="22" y="54" width="10" height="8" rx="3" fill="#4a4f66"/><rect x="68" y="54" width="10" height="8" rx="3" fill="#4a4f66"/>` +
    `<g transform="rotate(-24 80 66)">` +
    `<path d="M80 34L74 68M80 34L86 68" stroke="#8a96b0" stroke-width="6"/><path d="M80 34L74 68M80 34L86 68" stroke-width="2"/>` +
    `<circle cx="70" cy="80" r="9" fill="#fff" stroke="#3b8fe0" stroke-width="5"/><circle cx="90" cy="80" r="9" fill="#fff" stroke="#3b8fe0" stroke-width="5"/>` +
    dot(80, 66, 3) +
    `</g>` +
    `<rect x="4" y="60" width="16" height="6" rx="2" fill="#ff9aa8" stroke-width="2.5"/>` +
    [7, 11, 15].map((x) => `<path d="M${x} 66V74" stroke-width="2.5"/>`).join(''),
  치과:
    `<rect x="10" y="40" width="80" height="52" fill="#fff"/>` +
    `<rect x="6" y="36" width="88" height="8" rx="2" fill="#7ec8f0"/>` +
    `<path d="M32 12C24 12 22 22 26 32C28 40 30 48 34 48C38 48 38 38 42 38S46 48 50 48C54 48 56 40 58 32C62 22 60 12 52 12C48 12 46 14 42 14S36 12 32 12Z" fill="#fff" stroke-width="4" transform="translate(8 -6)"/>` +
    dot(44, 20, 2.2) +
    dot(56, 20, 2.2) +
    `<path d="M46 26q4 3 8 0" stroke-width="2.5"/>` +
    sparkle(76, 14, 6) +
    `<rect x="18" y="52" width="16" height="14" fill="#8fd3ff" stroke-width="2.5"/><rect x="66" y="52" width="16" height="14" fill="#8fd3ff" stroke-width="2.5"/>` +
    `<path d="M40 92V68H60V92Z" fill="#8fd3ff"/><path d="M50 68V92" stroke-width="2.5"/>` +
    `<path d="M4 92H96"/>`,
  궁전:
    `<rect x="4" y="50" width="92" height="40" fill="#fff4d0"/>` +
    `<rect x="34" y="36" width="32" height="54" fill="#fff4d0"/>` +
    `<path d="M32 38C32 20 50 12 50 8C50 12 68 20 68 38Z" fill="#ffc933"/><path d="M50 8V2" stroke-width="3"/>` +
    `<path d="M4 52C4 40 14 36 14 32C14 36 24 40 24 52Z" fill="#ffc933"/><path d="M76 52C76 40 86 36 86 32C86 36 96 40 96 52Z" fill="#ffc933"/>` +
    [10, 22, 72, 84].map((x) => `<rect x="${x - 3}" y="60" width="7" height="11" rx="3.5" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    [40, 56].map((x) => `<rect x="${x - 3}" y="44" width="7" height="10" rx="3.5" fill="#8fd3ff" stroke-width="2.5"/>`).join('') +
    `<path d="M42 90V70a8 8 0 0 1 16 0V90Z" fill="#e8553d"/>` +
    `<rect x="2" y="88" width="96" height="6" rx="2" fill="#e3d3ad"/>`,
  오두막:
    `<rect x="66" y="14" width="10" height="18" fill="#8a96b0"/>` +
    blob('#dfe8f5', [
      [72, 8, 4],
      [80, 6, 4],
    ]) +
    `<rect x="16" y="44" width="68" height="44" fill="#c98b4f"/>` +
    [50, 58, 66, 74, 82].map((y) => `<path d="M16 ${y}H84" stroke="#6b3e26" stroke-width="3"/>`).join('') +
    [48, 56, 64, 72, 80].map((y) => `<circle cx="16" cy="${y}" r="4" fill="#e3b577" stroke-width="2.5"/><circle cx="84" cy="${y}" r="4" fill="#e3b577" stroke-width="2.5"/>`).join('') +
    `<path d="M6 48L50 18L94 48Z" fill="#6b3e26"/>` +
    `<rect x="42" y="62" width="16" height="26" fill="#9a5b2e"/>` +
    `<rect x="24" y="56" width="12" height="12" fill="#ffd23f" stroke-width="2.5"/><path d="M30 56V68M24 62H36" stroke-width="2"/>` +
    `<rect x="64" y="56" width="12" height="12" fill="#ffd23f" stroke-width="2.5"/><path d="M70 56V68M64 62H76" stroke-width="2"/>` +
    `<path d="M4 88H96"/>`,
  이글루:
    `<path d="M4 80C20 76 80 76 96 80V94H4Z" fill="#fff"/>` +
    `<path d="M12 80C12 48 30 28 52 28S92 48 92 80Z" fill="#dff1ff"/>` +
    `<path d="M16 66H88M22 52H82M34 40H70" stroke="#8ec4e8" stroke-width="3"/>` +
    `<path d="M40 30L38 40M64 30L66 40M28 40L26 52M52 40V52M76 40L78 52M20 52L18 66M40 52L39 66M64 52L65 66M86 52L87 66M28 66V80M76 66V80" stroke="#8ec4e8" stroke-width="3"/>` +
    `<path d="M12 80C12 48 30 28 52 28S92 48 92 80Z"/>` +
    `<path d="M36 80V70C36 60 44 56 52 56S68 60 68 70V80Z" fill="#dff1ff"/>` +
    `<path d="M42 80V72C42 66 46 62 52 62S62 66 62 72V80Z" fill="#2a2f45"/>` +
    sparkle(14, 20, 5, '#bfe6ff') +
    sparkle(86, 16, 6, '#bfe6ff'),
};
