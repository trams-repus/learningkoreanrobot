// 생활 물건 그림 묶음 (3단계 어휘: 머리·몸단장, 욕실, 청소·빨래, 현관, 포장, 서예·그림 도구). 그림 규칙은 docs/picture-style.md.
// 비슷한 말끼리 구별: 참빗 가는 살이 위아래 두 줄 / 얼레빗 반달 모양 굵은 살, 화선지 흰 긴 종이+먹 붓질 /
// 한지 누런 결이 보이는 종이+꽃잎 / 도화지 크레파스 그림, 대걸레 긴 자루+올 / 물걸레 짜는 천+물방울.
import { INK, SKIN, dot, blob, sparkle, tube, drop, cheeks } from '../pictureKit.ts';

/** 비누 거품 방울 */
const bub = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#eaf6ff" stroke-width="2.5"/><path d="M${x - r * 0.45} ${y - r * 0.1}q${r * 0.1} ${-r * 0.35} ${r * 0.4} ${-r * 0.45}" stroke="#fff" stroke-width="2"/>`;

/** 작은 신발 한 짝 (옆모습, 폭 20) */
const shoe = (x: number, y: number, c: string) =>
  `<path d="M${x} ${y}V${y - 9}H${x + 8}C${x + 10} ${y - 5} ${x + 16} ${y - 5} ${x + 20} ${y - 2}V${y}Z" fill="${c}" stroke-width="2.5"/>`;

/** 닫힌 우산 (손잡이가 위) */
const umbrella = (x: number, top: number, c: string, lean: number) =>
  `<g transform="rotate(${lean} ${x} 60)">` +
  `<path d="M${x} ${top + 8}V${top + 34}" stroke-width="3"/>` +
  `<path d="M${x} ${top + 8}C${x} ${top} ${x - 9} ${top} ${x - 9} ${top + 6}" stroke-width="5"/>` +
  `<path d="M${x - 7} 64C${x - 7} 50 ${x - 2} ${top + 30} ${x} ${top + 26}C${x + 2} ${top + 30} ${x + 7} 50 ${x + 7} 64Z" fill="${c}"/>` +
  `</g>`;

/** 크레파스 한 자루 */
const crayon = (x: number, y: number, rot: number, c: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-4" y="-16" width="8" height="26" rx="1.5" fill="${c}" stroke-width="2.5"/><path d="M-4 -16L0 -23L4 -16Z" fill="${c}" stroke-width="2.5"/><path d="M-4 -6H4M-4 2H4" stroke="#fff" stroke-width="2"/></g>`;

export const PICS: Record<string, string> = {
  머리끈:
    `<ellipse cx="42" cy="52" rx="26" ry="22" stroke-width="12"/><ellipse cx="42" cy="52" rx="26" ry="22" stroke="#e85d9a" stroke-width="5"/>` +
    `<path d="M66 44L72 40M66 58L74 64" stroke-width="5"/>` +
    `<circle cx="76" cy="34" r="11" fill="#ff5c70"/><circle cx="78" cy="68" r="11" fill="#a45cf0"/>` +
    `<path d="M71 30q2 -4 6 -4M73 64q2 -4 6 -4" stroke="#fff" stroke-width="3"/>` +
    sparkle(18, 22, 6),
  헤어밴드:
    `<circle cx="50" cy="56" r="30" fill="${SKIN}"/>` +
    `<path d="M20 54C18 30 34 22 50 22S82 30 80 54C76 44 64 40 50 40S24 44 20 54Z" fill="#5a3b24"/>` +
    tube('M19 50C17 22 35 14 50 14S83 22 81 50', '#ff5c70', 9) +
    `<g fill="#fff" stroke="none"><circle cx="28" cy="27" r="2.2"/><circle cx="42" cy="18" r="2.2"/><circle cx="58" cy="18" r="2.2"/><circle cx="72" cy="27" r="2.2"/></g>` +
    `<path d="M66 18L78 10L80 24Z" fill="#ffd23f" stroke-width="2.5"/><path d="M66 18L58 6L54 18Z" fill="#ffd23f" stroke-width="2.5"/><circle cx="66" cy="18" r="4" fill="#ff9f1a" stroke-width="2.5"/>` +
    dot(40, 58) +
    dot(60, 58) +
    `<path d="M42 70q8 6 16 0"/>` +
    cheeks(66, 18),
  가발:
    `<ellipse cx="50" cy="90" rx="22" ry="5" fill="#8a96b0"/><rect x="43" y="66" width="14" height="24" fill="#dfe8f5"/>` +
    blob('#e8862e', [
      [50, 24, 14],
      [35, 29, 12],
      [65, 29, 12],
      [27, 44, 11],
      [73, 44, 11],
      [26, 59, 10],
      [74, 59, 10],
      [30, 72, 8],
      [70, 72, 8],
    ]) +
    `<ellipse cx="50" cy="52" rx="16" ry="20" fill="#f4f7fb"/>` +
    `<path d="M33 44C36 30 46 34 50 38C54 32 64 30 67 44C64 34 56 28 50 28S36 32 33 44Z" fill="#e8862e"/>` +
    `<path d="M40 20q4 -4 8 -2M62 38q4 2 5 6" stroke="#ffb866" stroke-width="3"/>`,
  참빗:
    `<rect x="16" y="26" width="68" height="20" fill="#f0cf8a"/><rect x="16" y="54" width="68" height="20" fill="#f0cf8a"/>` +
    `<path d="${Array.from({ length: 16 }, (_, i) => `M${20 + i * 4} 27V45M${20 + i * 4} 55V73`).join('')}" stroke-width="1.6"/>` +
    `<rect x="12" y="44" width="76" height="12" rx="2" fill="#9a5b2e"/>` +
    `<rect x="8" y="22" width="10" height="56" rx="3" fill="#c98b4f"/><rect x="82" y="22" width="10" height="56" rx="3" fill="#c98b4f"/>` +
    `<path d="M20 50H80" stroke="#c98b4f" stroke-width="2.5"/>`,
  얼레빗:
    Array.from({ length: 8 }, (_, i) => `<rect x="${15 + i * 9}" y="50" width="6" height="${i === 0 || i === 7 ? 20 : 30}" rx="3" fill="#c98b4f"/>`).join('') +
    `<path d="M10 56C10 20 90 20 90 56Z" fill="#c98b4f"/>` +
    `<path d="M22 46C26 32 74 32 78 46" stroke="#e8b06a" stroke-width="3"/>` +
    `<circle cx="50" cy="40" r="5" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M40 40q-4 -4 -8 -1M60 40q4 -4 8 -1" stroke="#43b04a" stroke-width="3"/>`,
  화장품:
    `<rect x="12" y="38" width="24" height="52" rx="6" fill="#ff9aa8"/><rect x="19" y="28" width="10" height="10" fill="#fff"/>` +
    `<path d="M16 22H32V28H16ZM32 24H40" fill="#fff"/><path d="M18 50V76" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="40" y="66" width="32" height="24" rx="4" fill="#fff"/><rect x="38" y="56" width="36" height="12" rx="4" fill="#a45cf0"/>` +
    `<rect x="46" y="72" width="20" height="10" rx="2" fill="#e8d4ff" stroke-width="2.5"/>` +
    `<rect x="76" y="62" width="14" height="28" rx="2" fill="#f2c14e"/><path d="M78 62V46L88 40V62Z" fill="#e8553d"/>` +
    sparkle(50, 38, 7) +
    sparkle(84, 24, 5, '#ff9aa8'),
  립스틱:
    `<rect x="34" y="60" width="32" height="32" rx="4" fill="#30354f"/><path d="M34 70H66" stroke="#f2c14e" stroke-width="4"/>` +
    `<rect x="38" y="42" width="24" height="20" fill="#f2c14e"/>` +
    `<path d="M40 42V22L60 10V42Z" fill="#e8553d"/><path d="M45 38V24" stroke="#ff9a8a" stroke-width="3.5"/>` +
    `<g transform="rotate(20 82 72)"><rect x="72" y="52" width="20" height="36" rx="4" fill="#30354f"/><path d="M76 58V80" stroke="#6b7090" stroke-width="3"/></g>` +
    sparkle(20, 24, 7),
  손톱깎이:
    `<path d="M10 62L84 58C92 58 92 70 84 70L14 70C8 70 6 63 10 62Z" fill="#b8c6da"/>` +
    `<path d="M10 58L84 52C92 52 92 60 84 60L10 64C6 64 6 58 10 58Z" fill="#dfe8f5"/>` +
    `<path d="M10 58L6 62L10 64" fill="#dfe8f5"/>` +
    `<rect x="20" y="40" width="6" height="18" rx="2" fill="#8a96b0"/>` +
    `<path d="M16 42C34 30 64 24 90 26L90 34C66 32 38 38 22 46C16 48 12 44 16 42Z" fill="#dfe8f5"/>` +
    `<circle cx="23" cy="41" r="4" fill="#8a96b0" stroke-width="2.5"/>` +
    `<path d="M40 34C54 30 70 28 84 29" stroke="#fff" stroke-width="3"/>` +
    `<path d="M12 84q6 -6 12 0M30 88q6 -6 12 0" stroke="#f5d6c0" stroke-width="3.5"/>`,
  귀이개:
    `<path d="M20 30C20 10 52 6 58 28C62 42 50 48 48 60C46 76 36 86 26 80C18 76 24 64 20 56C16 48 20 40 20 30Z" fill="${SKIN}"/>` +
    `<path d="M30 30C32 20 46 20 48 30C50 38 40 40 38 48C37 54 34 58 30 56" fill="none" stroke-width="3"/>` +
    tube('M54 46L86 86', '#d9a55b', 4) +
    `<path d="M54 46C50 42 52 38 56 40" stroke-width="3.5"/>` +
    blob('#fff', [
      [86, 86, 7],
      [80, 90, 5],
      [92, 82, 5],
    ]),
  족집게:
    `<g transform="rotate(-20 50 50)">` +
    tube('M47 14L36 64L46 88', '#dfe8f5', 7) +
    tube('M53 14L64 64L54 88', '#dfe8f5', 7) +
    `<rect x="42" y="6" width="16" height="14" rx="5" fill="#b8c6da"/>` +
    `<path d="M38 40L44 42M36 48L42 50M62 40L56 42M64 48L58 50" stroke="#ff5c70" stroke-width="3"/>` +
    `</g>` +
    `<circle cx="66" cy="87" r="6" fill="#ff9f1a" stroke-width="2.5"/>`,
  혈압계:
    `<rect x="6" y="34" width="52" height="50" rx="8" fill="#fff"/>` +
    `<rect x="13" y="41" width="38" height="22" rx="3" fill="#bfe6ff"/>` +
    `<path d="M22 49C20 45 25 43 26 47C27 43 32 45 30 49L26 54Z" fill="#ff5c70" stroke-width="2"/>` +
    `<path d="M36 58V50M41 58V46M46 58V52" stroke-width="3"/>` +
    `<circle cx="32" cy="73" r="6" fill="#3b78e6"/>` +
    `<path d="M58 60C68 60 64 74 72 74" stroke-width="3.5"/>` +
    tube('M78 96L88 8', SKIN, 16) +
    `<g transform="rotate(7 80 56)"><rect x="66" y="40" width="30" height="34" rx="6" fill="#3b8fe0"/><path d="M72 48H90" stroke="#bfe6ff" stroke-width="3"/></g>`,
  약통:
    `<rect x="28" y="34" width="44" height="56" rx="7" fill="#ff9f1a"/>` +
    `<rect x="23" y="16" width="54" height="20" rx="4" fill="#fff"/><path d="M31 20V32M39 20V32M47 20V32M55 20V32M63 20V32M71 20V32" stroke="#b8c6da" stroke-width="2.5"/>` +
    `<rect x="33" y="48" width="34" height="30" rx="3" fill="#fff"/>` +
    `<path d="M45 52H55V58H61V68H55V74H45V68H39V58H45Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<g transform="rotate(-30 14 84)"><rect x="4" y="79" width="20" height="10" rx="5" fill="#fff"/><path d="M14 79V89" stroke-width="2.5"/><path d="M14 80.5H22V87.5H14Z" fill="#ff5c70" stroke="none"/></g>` +
    `<circle cx="86" cy="86" r="6" fill="#fff" stroke-width="2.5"/>`,
  거품비누:
    `<rect x="24" y="46" width="42" height="46" rx="9" fill="#7ec8f0"/><rect x="38" y="36" width="14" height="10" fill="#fff"/>` +
    `<rect x="32" y="26" width="26" height="10" rx="3" fill="#fff"/><path d="M58 30H70V36" stroke-width="5"/>` +
    `<path d="M30 58V82" stroke="#d6f0ff" stroke-width="4"/>` +
    `<rect x="36" y="58" width="22" height="18" rx="3" fill="#fff" stroke-width="2.5"/>` +
    blob('#fff', [
      [74, 48, 8],
      [82, 42, 6],
      [84, 53, 6],
      [70, 56, 5],
    ]) +
    bub(80, 22, 5) +
    bub(88, 70, 4) +
    bub(14, 36, 5) +
    `<circle cx="44" cy="67" r="4" fill="#bfe6ff" stroke-width="2"/><circle cx="51" cy="65" r="3" fill="#bfe6ff" stroke-width="2"/>`,
  린스:
    `<rect x="28" y="30" width="44" height="62" rx="10" fill="#c79af5"/>` +
    `<rect x="36" y="14" width="28" height="18" rx="4" fill="#fff"/><path d="M42 14V10H58V14" fill="#fff"/>` +
    `<rect x="34" y="44" width="32" height="36" rx="4" fill="#fff"/>` +
    `<path d="M44 50C38 58 42 70 38 76M50 50C46 58 50 70 46 76M56 50C52 58 58 70 54 76" stroke="#8e4fc9" stroke-width="3"/>` +
    sparkle(62, 54, 5) +
    `<path d="M32 36V84" stroke="#e8d4ff" stroke-width="3"/>` +
    blob('#fff', [
      [80, 76, 7],
      [86, 82, 5],
    ]) +
    sparkle(18, 24, 6, '#c79af5'),
  전동칫솔:
    `<ellipse cx="50" cy="90" rx="20" ry="5" fill="#8a96b0"/>` +
    `<rect x="37" y="44" width="26" height="46" rx="11" fill="#fff"/><path d="M40 70H60" stroke="#3b8fe0" stroke-width="5"/>` +
    `<circle cx="50" cy="56" r="5" fill="#3b8fe0"/>` +
    `<path d="M44 44L46 22H54L56 44Z" fill="#fff"/>` +
    `<rect x="42" y="6" width="16" height="18" rx="7" fill="#fff"/><rect x="45" y="9" width="10" height="12" rx="4" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M30 10q-5 5 0 10M24 7q-7 8 0 16M70 10q5 5 0 10M76 7q7 8 0 16" stroke="#9aa6c4" stroke-width="3"/>`,
  목욕수건:
    `<path d="M10 20H90" stroke-width="7"/><circle cx="10" cy="20" r="5" fill="#8a96b0"/><circle cx="90" cy="20" r="5" fill="#8a96b0"/>` +
    `<path d="M22 20H78V84H22Z" fill="#ff9aa8"/>` +
    `<path d="M22 64H78M22 72H78" stroke="#fff" stroke-width="4"/>` +
    `<path d="M22 20C30 28 70 28 78 20" fill="#ff7f93"/>` +
    `<path d="M26 84v6M33 84v6M40 84v6M47 84v6M54 84v6M61 84v6M68 84v6M75 84v6" stroke-width="2.5"/>` +
    `<path d="M30 34V56" stroke="#ffc6ce" stroke-width="4"/>` +
    bub(86, 48, 6) +
    bub(12, 60, 5) +
    bub(88, 72, 4),
  샤워볼:
    `<path d="M50 30C42 22 42 8 50 8S58 22 50 30" stroke-width="3.5"/>` +
    blob('#ff9aa8', [
      [50, 58, 22],
      [32, 50, 14],
      [68, 50, 14],
      [34, 70, 14],
      [66, 70, 14],
      [50, 38, 12],
      [50, 78, 12],
    ]) +
    `<path d="M30 50q10 -8 20 0t20 0M28 64q11 -8 22 0t22 0M34 78q8 -6 16 0t16 0M40 40q5 -4 10 0t10 0" stroke="#e85d9a" stroke-width="2.8"/>` +
    bub(86, 30, 6) +
    bub(14, 28, 5) +
    bub(88, 84, 4),
  목욕의자:
    `<path d="M4 94H96" stroke="#b8c6da" stroke-width="3"/>` +
    `<path d="M20 52H80V88H66C66 72 34 72 34 88H20Z" fill="#e85d9a"/>` +
    `<path d="M14 44C14 38 18 36 24 36H76C82 36 86 38 86 44V50C86 54 82 56 76 56H24C18 56 14 54 14 50Z" fill="#ff9aa8"/>` +
    `<rect x="40" y="42" width="20" height="7" rx="3.5" fill="#c94a80" stroke-width="2.5"/>` +
    bub(20, 22, 6) +
    bub(80, 18, 7) +
    bub(52, 20, 4),
  오리인형:
    `<path d="M6 86q8 -6 16 0t16 0t16 0t16 0t16 0t10 0" stroke="#3b8fe0" stroke-width="4"/>` +
    `<path d="M20 64C20 88 80 90 86 66C90 56 88 46 82 44C80 54 74 56 68 54C56 50 20 46 20 64Z" fill="#ffd23f"/>` +
    `<circle cx="36" cy="38" r="18" fill="#ffd23f"/>` +
    `<path d="M20 40C12 38 8 44 12 48C16 50 22 48 24 46Z" fill="#ff9f1a"/>` +
    dot(38, 34, 3.5) +
    `<path d="M46 66C54 74 66 72 70 62" stroke-width="3.5"/>` +
    `<circle cx="42" cy="44" r="4" fill="#ff9aa8" stroke="none" opacity=".6"/>`,
  세숫대야:
    `<path d="M10 42L22 82C30 90 70 90 78 82L90 42Z" fill="#ff9aa8"/>` +
    `<ellipse cx="50" cy="42" rx="42" ry="12" fill="#e85d9a"/>` +
    `<ellipse cx="50" cy="44" rx="33" ry="7" fill="#7ec8f0" stroke-width="2.5"/>` +
    `<path d="M36 44q7 -3 14 0" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M24 58L30 78" stroke="#ffc6ce" stroke-width="4"/>` +
    drop(40, 12, 1) +
    drop(60, 16, 0.8) +
    drop(50, 6, 0.6),
  변기솔:
    `<path d="M62 50H90V66H62Z" fill="#fff"/>` +
    `<path d="M58 66H92C92 78 86 84 80 86L82 94H68L70 86C64 84 58 78 58 66Z" fill="#fff"/>` +
    `<path d="M64 70H86" stroke="#b8c6da" stroke-width="3"/>` +
    tube('M42 8L30 52', '#43b04a', 6) +
    `<circle cx="42" cy="8" r="5" fill="#43b04a"/>` +
    blob('#3b8fe0', [
      [30, 70, 13],
      [20, 62, 7],
      [40, 62, 7],
      [18, 74, 7],
      [42, 74, 7],
      [30, 83, 7],
      [24, 82, 6],
      [36, 82, 6],
    ]) +
    `<path d="M22 66L26 70M38 66L34 70M24 78L28 74M36 78L32 74" stroke="#7ec8f0" stroke-width="2.5"/>` +
    `<rect x="25" y="48" width="10" height="9" rx="3" fill="#43b04a"/>` +
    `<path d="M4 94H96" stroke="#b8c6da" stroke-width="3"/>`,
  쓰레기봉투:
    `<path d="M44 22C36 8 24 12 30 22C34 26 42 26 46 26M56 22C64 8 76 12 70 22C66 26 58 26 54 26" fill="#dfe8f5"/>` +
    `<path d="M44 26C30 34 16 52 16 72C16 88 30 94 50 94S84 88 84 72C84 52 70 34 56 26Z" fill="#dfe8f5"/>` +
    `<rect x="42" y="22" width="16" height="8" rx="3" fill="#b8c6da"/>` +
    `<path d="M40 34C34 44 32 56 34 68M60 34C66 44 68 56 66 68M50 36V52M28 80L36 88M72 80L64 88" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<path d="M24 62C26 54 30 48 34 44" stroke="#fff" stroke-width="4"/>`,
  분리수거함:
    [
      [6, '#3b78e6'],
      [36, '#43b04a'],
      [66, '#ffd23f'],
    ]
      .map(
        ([x, c]) =>
          `<rect x="${x}" y="36" width="28" height="54" rx="3" fill="${c}"/><rect x="${(x as number) - 2}" y="28" width="32" height="10" rx="3" fill="${c}"/><rect x="${(x as number) + 8}" y="31" width="12" height="4" rx="2" fill="${INK}" stroke="none"/>`,
      )
      .join('') +
    `<path d="M13 56H27V74H13Z" fill="#fff" stroke-width="2.5"/><path d="M15 62H25M15 67H25" stroke-width="2"/>` +
    `<path d="M46 52H54V56C58 58 58 60 58 64V78H42V64C42 60 42 58 46 56Z" fill="#bfe6ff" stroke-width="2.5"/>` +
    `<rect x="73" y="54" width="14" height="22" rx="3" fill="#dfe8f5" stroke-width="2.5"/><path d="M73 60H87M73 70H87" stroke-width="2"/>`,
  쓰레받기:
    tube('M52 44L52 10', '#3b8fe0', 6) +
    `<path d="M22 42H82V70H22Z" fill="#3b8fe0"/>` +
    `<path d="M22 70H82L94 88H10Z" fill="#7ec8f0"/>` +
    `<path d="M26 48V64" stroke="#bfe6ff" stroke-width="4"/>` +
    `<g fill="#9a8a7a" stroke="none"><circle cx="40" cy="80" r="3"/><circle cx="50" cy="82" r="2.5"/><circle cx="58" cy="78" r="3"/><circle cx="66" cy="83" r="2.5"/><circle cx="46" cy="76" r="2"/></g>` +
    `<path d="M20 94H80" stroke="#b8c6da" stroke-width="3"/>`,
  대걸레:
    tube('M50 6V58', '#3b8fe0', 6) +
    `<rect x="32" y="56" width="36" height="8" rx="3" fill="#8a96b0"/>` +
    Array.from({ length: 7 }, (_, i) => {
      const x = 36 + i * 4.7;
      const b = 50 + (i - 3) * 9;
      return tube(`M${x.toFixed(1)} 64Q${(x + (b - x) * 0.3).toFixed(1)} 78 ${b} 88`, '#f4f7fb', 4);
    }).join('') +
    `<path d="M6 94H94" stroke="#b8c6da" stroke-width="3"/>` +
    drop(14, 72, 0.8) +
    drop(86, 70, 0.8),
  먼지떨이:
    tube('M74 94L52 50', '#9a5b2e', 6) +
    [
      ['#ff5c70', -60],
      ['#ffd23f', -30],
      ['#43b04a', 0],
      ['#3b8fe0', 30],
      ['#a45cf0', 60],
      ['#ff9f1a', -15],
      ['#e85d9a', 15],
    ]
      .map(([c, a]) => `<ellipse cx="46" cy="26" rx="9" ry="22" fill="${c}" transform="rotate(${a} 48 48)"/>`)
      .join('') +
    `<rect x="44" y="44" width="12" height="10" rx="3" fill="#6b3e26" transform="rotate(-27 50 49)"/>` +
    `<g fill="#c9c2b8" stroke="none" opacity=".6"><circle cx="16" cy="74" r="4"/><circle cx="24" cy="82" r="3"/><circle cx="12" cy="86" r="3"/></g>`,
  로봇청소기:
    `<path d="M10 56V64C10 76 28 84 50 84S90 76 90 64V56Z" fill="#8a96b0"/>` +
    `<ellipse cx="50" cy="56" rx="40" ry="20" fill="#dfe8f5"/>` +
    `<ellipse cx="50" cy="54" rx="22" ry="10" fill="#30354f"/>` +
    `<circle cx="50" cy="42" r="4" fill="#43b04a" stroke-width="2.5"/>` +
    `<path d="M28 50q-6 4 -6 8" stroke="#fff" stroke-width="3"/>` +
    `<path d="M92 36H100M88 28H98M94 44H100" stroke="#9aa6c4" stroke-width="3"/>` +
    `<g fill="#9a8a7a" stroke="none"><circle cx="8" cy="88" r="2.5"/><circle cx="16" cy="92" r="2"/><circle cx="4" cy="94" r="2"/></g>`,
  물걸레:
    `<path d="M22 40C34 34 44 46 54 40C64 34 72 44 80 40V54C72 58 64 48 54 54C44 60 34 48 22 54Z" fill="#7ec8f0"/>` +
    `<path d="M34 38L30 54M46 42L42 56M58 38L54 54M70 40L66 54" stroke="#3b8fe0" stroke-width="3"/>` +
    `<circle cx="16" cy="47" r="10" fill="${SKIN}"/><circle cx="86" cy="47" r="10" fill="${SKIN}"/>` +
    `<path d="M10 43H20M80 43H90" stroke-width="2.5"/>` +
    drop(38, 62, 1) +
    drop(54, 68, 1.1) +
    drop(66, 60, 0.9) +
    drop(46, 80, 0.8) +
    `<path d="M20 94Q50 88 80 94" stroke="#7ec8f0" stroke-width="4"/>` +
    `<path d="M32 22q-3 -4 0 -8M50 20q-3 -4 0 -8M68 22q-3 -4 0 -8" stroke="#9aa6c4" stroke-width="3"/>`,
  세제:
    `<path d="M22 40C22 30 30 28 40 28H62C70 28 76 32 76 40V86C76 90 72 92 68 92H30C26 92 22 90 22 86Z" fill="#3b8fe0"/>` +
    `<path d="M58 28V18H74C80 18 82 24 82 30V52C82 56 80 58 76 58" fill="#3b8fe0"/><path d="M64 28V24H72C76 24 76 28 76 32" fill="#fff8e7"/>` +
    `<rect x="26" y="16" width="20" height="12" rx="3" fill="#ffd23f"/>` +
    `<rect x="30" y="46" width="38" height="34" rx="4" fill="#fff"/>` +
    `<path d="M40 54L46 52H52L58 54L62 60L58 62V74H40V62L36 60Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    bub(12, 30, 6) +
    bub(88, 72, 6) +
    bub(12, 58, 4) +
    bub(90, 88, 4),
  빨래판:
    `<rect x="22" y="8" width="56" height="86" rx="4" fill="#c98b4f"/>` +
    `<rect x="28" y="22" width="44" height="66" fill="#f0cf8a"/>` +
    `<path d="${Array.from({ length: 10 }, (_, i) => `M29 ${27 + i * 6.2}Q50 ${24 + i * 6.2} 71 ${27 + i * 6.2}`).join('')}" stroke="#9a5b2e" stroke-width="2.6"/>` +
    `<rect x="30" y="12" width="40" height="6" rx="3" fill="#9a5b2e" stroke-width="2.5"/>` +
    `<rect x="70" y="68" width="22" height="14" rx="4" fill="#fff" transform="rotate(-15 81 75)"/>` +
    bub(86, 58, 5) +
    bub(12, 80, 5) +
    bub(14, 64, 3.5),
  빨랫방망이:
    `<path d="M8 90C8 80 20 76 50 76S92 80 92 90Z" fill="#b8c6da"/>` +
    `<path d="M20 78C22 66 36 64 50 66S76 66 80 78Z" fill="#fff"/><path d="M34 70q8 4 18 0" stroke="#b8c6da" stroke-width="2.5"/>` +
    `<g transform="rotate(-35 50 40)">` +
    tube('M68 40H94', '#c98b4f', 7) +
    `<path d="M14 26H62C68 26 70 30 70 34V46C70 50 68 54 62 54H14C10 54 8 50 8 46V34C8 30 10 26 14 26Z" fill="#d9a55b"/>` +
    `<path d="M16 32V48M26 32V48" stroke="#f0cf8a" stroke-width="3"/>` +
    `</g>` +
    `<path d="M16 64l-4 -4M86 64l4 -4" stroke="#9aa6c4" stroke-width="3"/>` +
    drop(10, 68, 0.7) +
    drop(90, 70, 0.7),
  빨랫줄:
    `<path d="M8 94V12M92 94V12" stroke-width="5"/>` +
    `<path d="M8 20Q50 38 92 20" stroke-width="2.5"/>` +
    `<path d="M16 24L24 22L28 26H38L42 22L50 24L54 34L46 36V60H22V36L14 34Z" fill="#ff5c70" transform="rotate(4 32 40)"/>` +
    `<path d="M56 30H80L82 66H72L68 44L64 66H54Z" fill="#3b8fe0"/>` +
    `<rect x="26" y="20" width="4" height="10" rx="1" fill="#ffd23f" stroke-width="2"/><rect x="42" y="23" width="4" height="10" rx="1" fill="#ffd23f" stroke-width="2"/>` +
    `<rect x="58" y="25" width="4" height="10" rx="1" fill="#43b04a" stroke-width="2"/><rect x="74" y="22" width="4" height="10" rx="1" fill="#43b04a" stroke-width="2"/>` +
    `<path d="M4 94H96" stroke="#43b04a" stroke-width="4"/>`,
  신발장:
    `<rect x="14" y="8" width="72" height="86" rx="3" fill="#c98b4f"/>` +
    `<rect x="20" y="14" width="60" height="22" fill="#6b3e26"/><rect x="20" y="42" width="60" height="22" fill="#6b3e26"/><rect x="20" y="70" width="60" height="18" fill="#6b3e26"/>` +
    shoe(24, 35, '#ff5c70') +
    shoe(52, 35, '#3b8fe0') +
    shoe(24, 63, '#ffd23f') +
    shoe(52, 63, '#fff') +
    shoe(24, 87, '#43b04a') +
    shoe(52, 87, '#a45cf0'),
  우산꽂이:
    umbrella(34, 10, '#ff5c70', -10) +
    umbrella(50, 6, '#ffd23f', 0) +
    umbrella(66, 12, '#43b04a', 10) +
    `<path d="M26 54V86C26 92 74 92 74 86V54Z" fill="#3b8fe0"/>` +
    `<ellipse cx="50" cy="54" rx="24" ry="6" fill="#2a6fc4"/>` +
    `<path d="M26 66C36 70 64 70 74 66" stroke="#7ec8f0" stroke-width="3.5"/>` +
    `<path d="M32 74V84" stroke="#7ec8f0" stroke-width="3.5"/>`,
  현관매트:
    `<rect x="26" y="4" width="48" height="50" fill="#3b8fe0"/><circle cx="66" cy="32" r="3.5" fill="#ffd23f"/><path d="M8 54H92" stroke-width="3"/>` +
    `<path d="M20 60H80L94 92H6Z" fill="#9a5b2e"/>` +
    `<path d="M26 65H74L84 87H16Z" fill="#c98b4f" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M36 70L32 82M46 70L44 82M56 70L57 82M66 70L69 82" stroke="#e8b06a" stroke-width="3"/>` +
    `<path d="M6 92H94" stroke-width="3.5"/>`,
  도어락:
    `<rect x="8" y="2" width="84" height="96" fill="#c98b4f"/>` +
    `<path d="M14 2V98" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="32" y="12" width="36" height="58" rx="6" fill="#30354f"/>` +
    [0, 1, 2, 3]
      .map((r) => [0, 1, 2].map((c) => `<rect x="${38 + c * 9}" y="${20 + r * 10}" width="6" height="6" rx="1.5" fill="#7ec8f0" stroke="none"/>`).join(''))
      .join('') +
    `<circle cx="50" cy="63" r="3" fill="#43b04a" stroke="none"/>` +
    tube('M50 82H78', '#dfe8f5', 6) +
    `<circle cx="50" cy="82" r="7" fill="#dfe8f5"/>`,
  종이상자:
    `<path d="M16 40L30 26L42 38Z" fill="#d9a55b"/><path d="M84 40L70 26L62 38Z" fill="#d9a55b"/>` +
    `<path d="M16 40H84V88H16Z" fill="#c98b4f"/>` +
    `<path d="M16 40L4 54H26L38 40Z" fill="#e0b070"/><path d="M84 40L96 54H74L62 40Z" fill="#e0b070"/>` +
    `<path d="M38 40H62" stroke="#6b3e26" stroke-width="3"/>` +
    `<rect x="42" y="40" width="16" height="22" fill="#f0cf8a" stroke-width="2.5"/>` +
    `<path d="M22 76H40M22 82H34" stroke="#9a5b2e" stroke-width="3"/>`,
  골판지:
    `<path d="M10 44L26 20H92L76 44Z" fill="#e0b070"/>` +
    `<path d="M76 44L92 20V48L76 74Z" fill="#c98b4f"/>` +
    `<rect x="10" y="44" width="66" height="30" fill="#f0cf8a"/>` +
    `<path d="M10 49H76M10 69H76" stroke-width="3"/>` +
    `<path d="M10 59${Array.from({ length: 6 }, (_, i) => `q${5.5} ${i % 2 ? 10 : -10} 11 0`).join('')}" stroke="#9a5b2e" stroke-width="3"/>` +
    `<rect x="10" y="44" width="66" height="30"/>` +
    `<path d="M34 28H80M30 34H74" stroke="#c98b4f" stroke-width="2.5"/>`,
  포장지:
    `<rect x="18" y="36" width="64" height="54" fill="#ff9aa8"/>` +
    [
      [30, 50],
      [54, 48],
      [72, 58],
      [40, 70],
      [64, 78],
      [28, 84],
    ]
      .map(([x, y], i) => (i % 2 ? sparkle(x, y, 6, '#fff') : `<path d="M${x} ${y + 5}C${x - 8} ${y - 1} ${x - 4} ${y - 7} ${x} ${y - 3}C${x + 4} ${y - 7} ${x + 8} ${y - 1} ${x} ${y + 5}Z" fill="#e8553d" stroke-width="2"/>`))
      .join('') +
    `<rect x="12" y="18" width="76" height="22" rx="11" fill="#ff9aa8"/>` +
    `<ellipse cx="14" cy="29" rx="5" ry="11" fill="#e85d9a"/><ellipse cx="14" cy="29" rx="2" ry="4" fill="#fff" stroke-width="2"/>` +
    `<path d="M26 24H80" stroke="#ffc6ce" stroke-width="3"/>` +
    sparkle(52, 29, 5, '#fff'),
  리본끈:
    `<circle cx="38" cy="58" r="26" fill="#e8553d"/><circle cx="38" cy="58" r="17" stroke="#ff8a7a" stroke-width="2.5"/>` +
    `<circle cx="38" cy="58" r="8" fill="#fff8e7"/>` +
    tube('M56 76C66 86 80 84 78 72C76 60 64 66 70 56C74 50 84 52 88 46', '#e8553d', 5) +
    `<path d="M70 20C60 10 54 24 70 26C54 30 58 42 70 30Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M70 26C80 12 88 24 72 27C86 30 82 42 70 30Z" fill="#ffd23f" stroke-width="2.5"/>` +
    `<circle cx="70" cy="27" r="4" fill="#ff9f1a" stroke-width="2.5"/>`,
  쇼핑백:
    `<path d="M36 36V24C36 12 64 12 64 24V36" stroke-width="5"/><path d="M36 36V24C36 12 64 12 64 24V36" stroke="#9a5b2e" stroke-width="2"/>` +
    `<path d="M18 34H82L86 92H14Z" fill="#e85d9a"/>` +
    `<path d="M20 44H84" stroke="#ffc6ce" stroke-width="5"/>` +
    `<circle cx="36" cy="38" r="2.5" fill="${INK}" stroke="none"/><circle cx="64" cy="38" r="2.5" fill="${INK}" stroke="none"/>` +
    `<path d="M24 52L22 86" stroke="#f59cc4" stroke-width="3.5"/>` +
    sparkle(58, 68, 8, '#fff'),
  비닐봉투:
    `<path d="M30 30C22 24 26 12 36 14" stroke="#43b04a" stroke-width="4"/><path d="M30 30C28 20 30 12 34 10" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<path d="M22 12H38V30C38 36 62 36 62 30V12H78V36C86 44 88 60 86 78C84 90 76 94 50 94S16 90 14 78C12 60 14 44 22 36Z" fill="#eef6ff"/>` +
    `<circle cx="70" cy="40" r="8" fill="#e8553d" stroke-width="2.5"/>` +
    `<path d="M22 36C26 38 32 40 38 40M78 36C74 38 68 40 62 40" stroke-width="2.5"/>` +
    `<path d="M26 54L32 62M68 60L62 70M30 76L38 84M72 80L66 86M48 52L50 60" stroke="#b8c6da" stroke-width="2.5"/>`,
  캐리어:
    `<path d="M40 30V8H60V30" stroke-width="7"/><path d="M40 30V8H60V30" stroke="#8a96b0" stroke-width="3"/>` +
    `<rect x="22" y="28" width="56" height="58" rx="9" fill="#3b8fe0"/>` +
    `<path d="M36 34V80M50 34V80M64 34V80" stroke="#2a6fc4" stroke-width="3.5"/>` +
    `<circle cx="30" cy="91" r="5" fill="#30354f"/><circle cx="70" cy="91" r="5" fill="#30354f"/>` +
    `<rect x="54" y="40" width="16" height="12" rx="3" fill="#ffd23f" stroke-width="2.5" transform="rotate(10 62 46)"/>` +
    `<circle cx="34" cy="66" r="6" fill="#ff5c70" stroke-width="2.5"/>`,
  벼루:
    `<path d="M14 40L30 22H88L72 40Z" fill="#8a96b0"/>` +
    `<path d="M14 40H72V82H14Z" fill="#5a5f7a"/><path d="M72 40L88 22V64L72 82Z" fill="#454a63"/>` +
    `<path d="M22 38L34 26H80L68 38Z" fill="#b8c6da" stroke-width="2.5"/>` +
    `<path d="M34 34L40 28H64L58 34Z" fill="#1d2340" stroke-width="2"/><path d="M44 31H52" stroke="#6b7090" stroke-width="2"/>` +
    `<g transform="rotate(30 66 52)"><rect x="60" y="22" width="14" height="54" rx="2" fill="#30354f"/><path d="M63 32H71M63 36H71" stroke="#f2c14e" stroke-width="2.5"/></g>`,
  한지:
    `<path d="M16 22L78 12L86 84L22 92Z" fill="#e8d8b0"/>` +
    `<path d="M12 18L74 10L82 80L18 88Z" fill="#f6ecd2"/>` +
    `<path d="M22 30q10 -4 18 2M48 22q8 4 16 -2M26 56q6 6 14 2M56 46q10 -2 14 4M30 76q10 4 18 -2M58 70q8 -4 14 2M36 40q4 6 10 4" stroke="#c9b48a" stroke-width="2"/>` +
    `<path d="M50 36C44 30 40 36 44 40C38 42 40 50 46 48C46 54 54 54 54 48C60 50 62 42 56 40C60 36 56 30 50 36Z" fill="#ff9aa8" stroke-width="2.5"/>` +
    `<circle cx="50" cy="42" r="3" fill="#ffd23f" stroke-width="2"/>` +
    `<path d="M40 62L48 58L50 66ZM60 60q6 -6 10 0q-4 6 -10 0" fill="#8bc34a" stroke-width="2"/>`,
  도화지:
    `<rect x="12" y="10" width="76" height="62" fill="#fff"/>` +
    `<circle cx="72" cy="24" r="7" fill="#ffd23f" stroke-width="2.5"/>` +
    `<path d="M28 58V42L38 32L48 42V58Z" fill="#ff9aa8" stroke-width="2.5"/><rect x="34" y="48" width="7" height="10" fill="#9a5b2e" stroke-width="2"/>` +
    `<path d="M16 62q8 -4 16 0t16 0t16 0t20 0" stroke="#43b04a" stroke-width="3"/>` +
    `<path d="M58 44q4 -4 8 0q4 -4 8 0" stroke="#3b8fe0" stroke-width="2.5"/>` +
    crayon(30, 88, 70, '#e8553d') +
    crayon(56, 88, 80, '#3b8fe0') +
    crayon(80, 86, 100, '#43b04a'),
  이젤:
    `<path d="M50 8L22 94M50 8L78 94M50 8V90" stroke-width="8"/><path d="M50 8L22 94M50 8L78 94M50 8V90" stroke="#c98b4f" stroke-width="4"/>` +
    `<rect x="24" y="66" width="52" height="6" rx="2" fill="#9a5b2e"/>` +
    `<rect x="24" y="18" width="52" height="48" fill="#fff"/>` +
    `<path d="M24 58L40 38L52 52L60 44L76 60V66H24Z" fill="#43b04a" stroke-width="2.5"/>` +
    `<circle cx="64" cy="30" r="6" fill="#ffd23f" stroke-width="2.5"/>`,
  팔레트:
    `<path d="M50 14C80 14 94 30 92 50C90 66 76 64 72 72C68 82 62 88 46 88C22 88 8 72 8 52C8 30 26 14 50 14Z" fill="#f0cf8a"/>` +
    `<ellipse cx="60" cy="68" rx="7" ry="6" fill="#fff8e7"/>` +
    [
      [28, 36, '#e8553d'],
      [46, 28, '#ffd23f'],
      [66, 30, '#43b04a'],
      [80, 44, '#3b8fe0'],
      [22, 56, '#a45cf0'],
      [34, 72, '#fff'],
    ]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke-width="2.5"/>`)
      .join('') +
    tube('M44 62L84 92', '#9a5b2e', 4) +
    `<path d="M44 62L36 54L40 50L48 58Z" fill="#e8553d" stroke-width="2.5"/>`,
};
