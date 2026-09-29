// L3 상태·느낌·모양 묶음 (따끈하다·말랑말랑하다·줄무늬·동그랗다·가파르다·익다 …). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, ring, person, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

/** 표정 얼굴 (moodFace 모양)을 (x, y)에 s배로. inner는 moodFace 좌표(가운데 50,54)로 쓴다 */
const hd = (x: number, y: number, s: number, inner: string, hair = '#5a3b24') =>
  `<g transform="translate(${x} ${y}) scale(${s}) translate(-50 -54)" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<circle cx="50" cy="54" r="32" fill="${SKIN}"/>` +
  `<path d="M18 50C17 26 33 20 50 20S83 26 82 50C76 40 64 35 50 35S24 40 18 50Z" fill="${hair}"/>` +
  inner +
  `</g>`;

const bigEyes = `<circle cx="39" cy="55" r="7" fill="#fff"/><circle cx="61" cy="55" r="7" fill="#fff"/>` + dot(39, 56, 3.4) + dot(61, 56, 3.4);
const happyEyes = `<path d="M34 56q6-8 12 0M54 56q6-8 12 0" stroke-width="4"/>`;
const squeeze = `<path d="M33 49l11 6-11 6M67 49l-11 6 11 6" stroke-width="4"/>`;
const bigSmile = `<path d="M34 66H66C66 86 34 86 34 66Z" fill="#c62f3f"/>`;

/** 별 (가운데 x, y, 바깥 반지름 r) */
const star = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${Array.from({ length: 10 }, (_, k) => {
    const a = (k * Math.PI) / 5 - Math.PI / 2;
    const rr = k % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join('L')}Z" fill="${fill}"/>`;

/** 하트 (가운데 x, y, 크기 s) */
const heart = (x: number, y: number, s: number, fill: string) =>
  `<path d="M${x} ${y + 0.9 * s}C${x - 1.4 * s} ${y + 0.05 * s} ${x - 0.95 * s} ${y - 0.95 * s} ${x} ${y - 0.35 * s}` +
  `C${x + 0.95 * s} ${y - 0.95 * s} ${x + 1.4 * s} ${y + 0.05 * s} ${x} ${y + 0.9 * s}Z" fill="${fill}"/>`;

/** 무늬 티셔츠: 바탕색 + 무늬(몸통 x 32~68, y 28~88 안쪽에 그린다) */
const TEE = 'M32 14L10 28L19 46L31 41V90H69V41L81 46L90 28L68 14C62 22 38 22 32 14Z';
const tee = (fill: string, pattern: string) => `<path d="${TEE}" fill="${fill}"/>` + pattern + `<path d="${TEE}"/>`;

/** 꽃 한 송이 (무늬용) */
const flower = (x: number, y: number, r: number, fill: string) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const t = ((a - 90) * Math.PI) / 180;
      return `<circle cx="${(x + r * Math.cos(t)).toFixed(1)}" cy="${(y + r * Math.sin(t)).toFixed(1)}" r="${(r * 0.75).toFixed(1)}" fill="${fill}" stroke-width="1.8"/>`;
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="#ffd23f" stroke-width="1.8"/>`;


/** 나무 (가운데 x, 아래 y, 크기 s) */
const tree = (x: number, y: number, s: number, fill: string) =>
  `<rect x="${x - 3 * s}" y="${y - 14 * s}" width="${6 * s}" height="${14 * s}" fill="#9a5b2e"/>` +
  `<path d="M${x} ${y - 44 * s}L${x + 13 * s} ${y - 12 * s}H${x - 13 * s}Z" fill="${fill}"/>`;

/** 토마토 (가운데 x, y, 반지름 r) */
const tomato = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>` +
  `<path d="M${x - 9} ${y - r + 1}L${x} ${y - r + 7}L${x + 9} ${y - r + 1}L${x + 3} ${y - r - 2}L${x} ${y - r - 8}L${x - 3} ${y - r - 2}Z" fill="#3a9e47" stroke-width="2.5"/>` +
  `<path d="M${x - r * 0.55} ${y - r * 0.3}q3-6 9-7" stroke="#fff" stroke-width="3.5" opacity=".6"/>`;

/** 고양이 (가운데 x, 아래 y, 몸 반너비 w, 몸 높이 h) */
const cat = (x: number, y: number, w: number, h: number, fill: string) =>
  `<path d="M${x + w - 4} ${y - 8}C${x + w + 14} ${y - 10} ${x + w + 14} ${y - 30} ${x + w + 6} ${y - 36}" stroke-width="10"/>` +
  `<path d="M${x + w - 4} ${y - 8}C${x + w + 14} ${y - 10} ${x + w + 14} ${y - 30} ${x + w + 6} ${y - 36}" stroke="${fill}" stroke-width="4"/>` +
  `<ellipse cx="${x}" cy="${y - h / 2}" rx="${w}" ry="${h / 2}" fill="${fill}"/>` +
  `<path d="M${x - 15} ${y - h - 4}L${x - 13} ${y - h - 22}L${x - 3} ${y - h - 12}Z" fill="${fill}"/><path d="M${x + 15} ${y - h - 4}L${x + 13} ${y - h - 22}L${x + 3} ${y - h - 12}Z" fill="${fill}"/>` +
  `<circle cx="${x}" cy="${y - h - 2}" r="15" fill="${fill}"/>` +
  dot(x - 6, y - h - 3, 2.4) +
  dot(x + 6, y - h - 3, 2.4) +
  `<path d="M${x - 3} ${y - h + 4}q3 3 6 0" stroke-width="2.5"/>`;

export const PICS: Record<string, string> = {
  // ── 맛·만짐 ──
  따끈하다:
    `<g stroke="#ff9f1a" stroke-width="5"><path d="M34 40c-6-6 6-10 0-16s6-10 0-16"/><path d="M50 38c-6-6 6-10 0-16s6-10 0-16"/><path d="M66 40c-6-6 6-10 0-16s6-10 0-16"/></g>` +
    `<path d="M12 50H88C88 76 72 90 50 90S12 76 12 50Z" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="50" rx="38" ry="7" fill="#ffcf7a"/>` +
    `<path d="M22 64Q50 70 78 64" stroke="#fff" stroke-width="4"/>` +
    dot(40, 76, 2.8) +
    dot(60, 76, 2.8) +
    `<path d="M46 81q4 3 8 0" stroke-width="2.5"/>`,
  새콤달콤하다:
    hd(50, 34, 0.56, squeeze + `<ellipse cx="50" cy="74" rx="6" ry="6" fill="#c62f3f"/>` + cheeks(68, 22)) +
    `<circle cx="27" cy="76" r="19" fill="#ffd23f"/><circle cx="27" cy="76" r="14" fill="#fff3a8" stroke-width="2.5"/>` +
    `<path d="M27 62V90M13 76H41M17 66L37 86M37 66L17 86" stroke="#ffd23f" stroke-width="3"/>` +
    `<path d="M73 94C60 86 56 70 60 62C66 58 80 58 86 62C90 70 86 86 73 94Z" fill="#e8553d"/>` +
    `<path d="M62 60L68 54L73 58L78 54L84 60Z" fill="#3a9e47" stroke-width="2.5"/>` +
    dot(67, 70, 1.6, '#ffd23f') +
    dot(78, 70, 1.6, '#ffd23f') +
    dot(72, 80, 1.6, '#ffd23f') +
    dot(66, 82, 1.6, '#ffd23f') +
    dot(80, 81, 1.6, '#ffd23f') +
    sparkle(12, 18, 6) +
    sparkle(90, 20, 6, '#ff9aa8'),
  짭짤하다:
    `<g transform="rotate(145 64 24)"><rect x="52" y="10" width="24" height="30" rx="6" fill="#fff"/><path d="M52 10C52 -2 76 -2 76 10Z" fill="#8a96b0"/>` +
    dot(58, 4, 1.6) +
    dot(64, 2, 1.6) +
    dot(70, 4, 1.6) +
    `</g>` +
    `<g fill="#fff" stroke-width="1.5"><circle cx="54" cy="44" r="2.2"/><circle cx="46" cy="48" r="2.2"/><circle cx="58" cy="52" r="2.2"/><circle cx="50" cy="56" r="2.2"/><circle cx="42" cy="54" r="2.2"/><circle cx="54" cy="62" r="2.2"/></g>` +
    `<g fill="#ffd23f"><rect x="26" y="52" width="7" height="30" rx="2" transform="rotate(-12 29 67)"/><rect x="36" y="48" width="7" height="34" rx="2" transform="rotate(-4 39 65)"/><rect x="46" y="50" width="7" height="32" rx="2" transform="rotate(5 49 66)"/><rect x="56" y="52" width="7" height="30" rx="2" transform="rotate(12 59 67)"/></g>` +
    `<path d="M22 70H68L62 96H28Z" fill="#e8553d"/><path d="M34 80q11 8 22 0" stroke="#fff" stroke-width="3"/>`,
  매콤하다:
    `<path d="M48 36C60 36 70 30 76 20" stroke="#3a9e47" stroke-width="7"/>` +
    `<path d="M40 34C52 30 70 36 74 52C78 70 62 86 38 92C28 94 20 90 24 86C44 78 50 64 40 34Z" fill="#e8553d"/>` +
    `<path d="M36 32C42 26 52 28 56 36C50 36 44 36 36 32Z" fill="#43b04a"/>` +
    `<path d="M60 48q4 10 0 20" stroke="#fff" stroke-width="3.5" opacity=".6"/>` +
    `<path d="M16 34C8 26 12 14 18 8C18 18 26 16 24 26C30 22 30 30 26 36Z" fill="#ff9f1a"/>` +
    `<path d="M18 32C14 28 16 22 18 20C20 24 23 25 22 30Z" fill="#ffd23f" stroke="none"/>` +
    `<path d="M86 60C78 52 82 40 88 34C88 44 96 42 94 52C98 50 98 56 94 62Z" fill="#ff9f1a"/>` +
    `<path d="M88 58C84 54 86 48 88 46C90 50 93 51 92 56Z" fill="#ffd23f" stroke="none"/>`,
  말랑말랑하다:
    `<path d="M16 88C12 58 30 44 44 48C47 50 53 50 56 48C70 44 88 58 84 88Z" fill="#ff9aa8"/>` +
    `<path d="M26 64q4-8 10-10" stroke="#fff" stroke-width="4" opacity=".6"/>` +
    dot(38, 70, 3) +
    dot(62, 70, 3) +
    `<path d="M45 76q5 4 10 0" stroke-width="3"/>` +
    tube('M50 6V40', SKIN, 14) +
    `<path d="M44 38q6 4 12 0" stroke-width="2.5"/>` +
    `<path d="M8 58q-4 8 0 16M92 58q4 8 0 16M28 42q-4-4-8-4M72 42q4-4 8-4" stroke="#9aa6c4" stroke-width="3.5"/>`,
  끈적하다:
    `<path d="M20 54H80C80 80 72 94 50 94S20 80 20 54Z" fill="#c98f52"/>` +
    `<path d="M16 48H84V56H16Z" fill="#9a5b2e"/>` +
    `<path d="M22 56H78C78 62 76 68 73 65C70 62 70 76 66 76S62 63 59 65C56 70 55 84 50 84S46 68 43 65C40 63 40 72 36 72S32 62 29 65C26 68 22 62 22 56Z" fill="#f2a516"/>` +
    `<g stroke="#f2a516" stroke-width="4"><path d="M40 26C36 34 42 40 38 48"/><path d="M50 28C50 36 46 40 48 48"/><path d="M58 26C62 34 56 40 60 48"/></g>` +
    tube('M76 4L60 18', '#b5793a', 6) +
    `<ellipse cx="50" cy="22" rx="14" ry="8" fill="#f2a516"/>` +
    `<path d="M40 20H60M42 25H58" stroke="#c98a16" stroke-width="2.5"/>` +
    sparkle(12, 30, 6) +
    sparkle(88, 36, 5),
  매끈하다:
    `<ellipse cx="50" cy="60" rx="38" ry="28" fill="#8fb4d8"/>` +
    `<path d="M26 50C30 40 42 36 52 36" stroke="#fff" stroke-width="6" opacity=".6"/>` +
    `<ellipse cx="66" cy="44" rx="5" ry="3" fill="#fff" stroke="none" opacity=".6"/>` +
    sparkle(18, 22, 7) +
    sparkle(84, 20, 8) +
    sparkle(90, 72, 5) +
    `<path d="M8 94H92" stroke="#c9b28a"/>`,
  까끌까끌하다:
    hd(
      42,
      50,
      1,
      dot(34, 50, 3.4) +
        dot(52, 50, 3.4) +
        `<path d="M26 44q8-4 14 0M46 44q8-4 14 0" stroke-width="3"/>` +
        `<path d="M36 68q8 4 16 0" stroke-width="3.5"/>` +
        `<g fill="#6b7288" stroke="none">` +
        [
          [24, 64], [30, 72], [36, 78], [44, 81], [52, 78], [58, 72], [63, 64], [28, 80], [40, 86], [50, 86], [58, 82], [32, 62], [58, 62],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`)
          .join('') +
        `</g>`,
      '#3a2a20',
    ) +
    `<path d="M92 56l-4 4 4 4-4 4 4 4" stroke="#e8553d" stroke-width="3"/>` +
    `<circle cx="80" cy="70" r="9" fill="${SKIN}"/><rect x="76" y="76" width="9" height="20" rx="4" fill="${SKIN}"/>`,
  보송보송하다:
    `<circle cx="80" cy="18" r="10" fill="${HL}"/><path d="M80 2V5M94 18H97M90 8l2-2M66 8l-2-2" stroke="${HL}" stroke-width="3.5"/>` +
    blob('#7ec8f0', [[20, 78, 8], [34, 80, 8], [50, 80, 8], [66, 80, 8], [80, 78, 8], [50, 84, 10]]) +
    `<rect x="14" y="70" width="72" height="18" rx="9" fill="#7ec8f0"/>` +
    blob('#ff9aa8', [[22, 56, 8], [36, 58, 8], [50, 58, 8], [64, 58, 8], [78, 56, 8]]) +
    `<rect x="16" y="48" width="68" height="18" rx="9" fill="#ff9aa8"/>` +
    blob('#fff1b8', [[26, 36, 8], [40, 38, 8], [54, 38, 8], [70, 36, 8]]) +
    `<rect x="20" y="28" width="58" height="16" rx="8" fill="#fff1b8"/>` +
    `<path d="M30 36q3-3 6 0M46 36q3-3 6 0M62 36q3-3 6 0M28 57q3-3 6 0M46 57q3-3 6 0M64 57q3-3 6 0M28 79q3-3 6 0M46 79q3-3 6 0M64 79q3-3 6 0" stroke="#fff" stroke-width="2.5"/>` +
    sparkle(10, 18, 6),
  반짝반짝하다:
    `<path d="M50 4V12M50 88V96M8 50H16M84 50H92M20 20l6 6M80 20l-6 6M20 80l6-6M80 80l-6-6" stroke="${HL}" stroke-width="4"/>` +
    star(50, 52, 34, '#ffd23f') +
    dot(43, 54, 2.8) +
    dot(57, 54, 2.8) +
    `<path d="M46 61q4 3 8 0" stroke-width="2.5"/>` +
    sparkle(14, 36, 7, '#7ec8f0') +
    sparkle(88, 70, 7, '#ff9aa8') +
    sparkle(84, 34, 5) +
    sparkle(16, 72, 5),
  알록달록하다:
    `<path d="M50 92C44 80 40 70 30 58M50 92C50 80 50 70 50 58M50 92C56 80 60 70 70 58M50 92C46 80 38 72 18 72M50 92C54 80 62 72 82 72" stroke="#9aa6c4" stroke-width="2"/>` +
    `<ellipse cx="30" cy="36" rx="14" ry="17" fill="#e8553d"/>` +
    `<ellipse cx="50" cy="26" rx="14" ry="17" fill="#ffd23f"/>` +
    `<ellipse cx="70" cy="36" rx="14" ry="17" fill="#43b04a"/>` +
    `<ellipse cx="18" cy="58" rx="12" ry="15" fill="#3b78e6"/>` +
    `<ellipse cx="82" cy="58" rx="12" ry="15" fill="#8e4fc9"/>` +
    `<ellipse cx="50" cy="50" rx="13" ry="16" fill="#ff9f1a"/>` +
    `<ellipse cx="32" cy="64" rx="10" ry="12" fill="#e85d9a"/><ellipse cx="68" cy="64" rx="10" ry="12" fill="#7ec8f0"/>` +
    `<path d="M24 30q2-6 6-8M44 20q2-6 6-8M64 30q2-6 6-8" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  얼룩덜룩하다: tee(
    '#fff',
    `<g fill="#9a5b2e" stroke="none"><path d="M36 30C44 26 50 32 46 38C42 44 34 40 36 30Z"/><path d="M54 44C62 40 68 46 66 52C62 60 52 56 54 44Z"/>` +
      `<path d="M36 60C42 56 48 62 44 68C40 74 32 70 36 60Z"/><path d="M52 72C60 68 66 74 62 82C56 86 50 80 52 72Z"/>` +
      `<path d="M18 32C22 30 26 34 24 38C20 40 16 36 18 32Z"/><path d="M76 32C80 30 84 34 82 38C78 40 74 36 76 32Z"/></g>` +
      `<g fill="#c98f52" stroke="none"><circle cx="58" cy="32" r="3.5"/><circle cx="62" cy="64" r="3"/><circle cx="40" cy="50" r="3"/><circle cx="46" cy="84" r="3"/></g>`,
  ),

  // ── 무늬 ──
  줄무늬: tee(
    '#fff',
    `<g stroke="#3b78e6" stroke-width="7"><path d="M34 32H66"/><path d="M34 46H66"/><path d="M34 60H66"/><path d="M34 74H66"/><path d="M34 86H66"/>` +
      `<path d="M16 32L28 26M20 40L32 34"/><path d="M84 32L72 26M80 40L68 34"/></g>`,
  ),
  점무늬: tee(
    '#ffd23f',
    `<g fill="${INK}" stroke="none">` +
      [
        [40, 30], [52, 30], [60, 32], [36, 42], [46, 42], [58, 44], [64, 50], [40, 54], [52, 56], [36, 66], [46, 66], [60, 64],
        [40, 78], [52, 78], [62, 76], [48, 86], [36, 86], [62, 86], [20, 34], [24, 40], [80, 34], [76, 40],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`)
        .join('') +
      `</g>`,
  ),
  체크무늬: tee(
    '#fff',
    `<g fill="#e8553d" stroke="none" opacity=".6"><rect x="32" y="22" width="36" height="8"/><rect x="32" y="42" width="36" height="8"/><rect x="32" y="62" width="36" height="8"/><rect x="31" y="80" width="38" height="8"/>` +
      `<rect x="36" y="24" width="8" height="64"/><rect x="56" y="24" width="8" height="64"/></g>` +
      `<g fill="#e8553d" stroke="none"><rect x="36" y="22" width="8" height="8"/><rect x="56" y="22" width="8" height="8"/><rect x="36" y="42" width="8" height="8"/><rect x="56" y="42" width="8" height="8"/>` +
      `<rect x="36" y="62" width="8" height="8"/><rect x="56" y="62" width="8" height="8"/><rect x="36" y="80" width="8" height="8"/><rect x="56" y="80" width="8" height="8"/></g>` +
      `<g stroke="#e8553d" stroke-width="7" opacity=".6"><path d="M18 34L28 29M22 42L30 38M82 34L72 29M78 42L70 38"/></g>`,
  ),
  꽃무늬: tee(
    '#ff9aa8',
    flower(42, 34, 5, '#fff') +
      flower(60, 48, 5, '#fff') +
      flower(40, 60, 5, '#fff') +
      flower(58, 76, 5, '#fff') +
      flower(22, 36, 4, '#fff') +
      flower(78, 36, 4, '#fff') +
      `<g fill="#43b04a" stroke="none"><circle cx="54" cy="32" r="2.5"/><circle cx="46" cy="48" r="2.5"/><circle cx="52" cy="62" r="2.5"/><circle cx="42" cy="80" r="2.5"/></g>`,
  ),

  // ── 보이는 모양 ──
  투명하다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    `<circle cx="50" cy="70" r="14" fill="#e8553d"/><path d="M38 64q12 6 24 0" stroke="#fff" stroke-width="3"/>` +
    `<path d="M26 22V84C26 88 30 90 34 90H66C70 90 74 88 74 84V22Z" fill="#dff3ff" opacity=".45"/>` +
    `<path d="M26 22V84C26 88 30 90 34 90H66C70 90 74 88 74 84V22"/>` +
    `<ellipse cx="50" cy="22" rx="24" ry="6" fill="#dff3ff"/>` +
    `<path d="M32 34V60M38 34V44" stroke="#fff" stroke-width="5"/>` +
    sparkle(84, 24, 7) +
    sparkle(14, 44, 5, '#7ec8f0'),
  흐릿하다:
    `<g stroke="#b8c0d4"><path d="M26 58L50 36L74 58Z" fill="#f0c6b8"/><rect x="30" y="58" width="40" height="30" fill="#f7ddd0"/><rect x="44" y="70" width="12" height="18" fill="#dcc0a8"/></g>` +
    `<circle cx="80" cy="24" r="10" fill="#fff1b8" stroke="#e8dca0"/>` +
    `<g stroke="#fff" stroke-linecap="round" opacity=".6"><path d="M8 34H70" stroke-width="10"/><path d="M20 50H92" stroke-width="10"/><path d="M8 66H80" stroke-width="10"/><path d="M24 82H92" stroke-width="10"/></g>` +
    `<path d="M10 20h24c6 0 6-8 0-8M60 94h24c6 0 6-8 0-8" stroke="#9aa6c4" stroke-width="3"/>`,
  눈부시다:
    `<circle cx="26" cy="24" r="14" fill="${HL}"/>` +
    `<path d="M26 2V6M4 24H8M10 8l3 3M42 8l-3 3M10 40l3-3M46 24H50M44 42l-4-4M26 46V42" stroke="${HL}" stroke-width="4"/>` +
    `<path d="M40 38L50 48M46 30L58 38M32 44L40 56" stroke="${HL}" stroke-width="3"/>` +
    hd(64, 66, 0.82, squeeze + `<path d="M42 72q8-5 16 0" stroke-width="4"/>` + cheeks(68, 20)) +
    `<path d="M34 42C44 34 64 34 76 42C74 48 70 50 66 48C58 44 48 44 40 48C36 50 32 48 34 42Z" fill="${SKIN}" transform="translate(12 5) scale(.9)"/>`,
  커다랗다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<ellipse cx="44" cy="58" rx="38" ry="32" fill="#ff9f1a"/>` +
    `<path d="M30 30C22 44 22 74 30 88M58 30C66 44 66 74 58 88M44 26V90" stroke="#e8862e" stroke-width="3.5"/>` +
    `<path d="M44 28C44 18 48 12 54 10" stroke="#3a9e47" stroke-width="7"/>` +
    `<path d="M48 18C56 10 66 14 66 20C58 22 52 22 48 18Z" fill="#43b04a" stroke-width="2.5"/>` +
    person(88, 92, 0.55, { hair: '#5a3b24', style: 'short', shirt: '#3b78e6' }) +
    ring(44, 58, 43, 36),
  조그맣다:
    `<path d="M18 96V64C12 56 10 46 14 42C18 40 22 44 26 52V30C26 24 34 24 34 30V52V22C34 16 42 16 42 22V52V24C42 18 50 18 50 24V52V32C50 26 58 26 58 32V66C58 82 48 96 36 96Z" fill="${SKIN}" transform="translate(10 0)"/>` +
    `<circle cx="47" cy="66" r="7" fill="#e8553d"/><path d="M47 59V73" stroke-width="2"/>` +
    `<path d="M41 62a6 6 0 0 1 12 0" fill="${INK}" stroke="none"/>` +
    dot(44, 68, 1.4) +
    dot(50, 68, 1.4) +
    ring(47, 64, 13) +
    sparkle(80, 22, 6),
  동그랗다:
    ring(50, 50, 44) +
    `<circle cx="50" cy="50" r="34" fill="#ff9f1a"/>` +
    `<path d="M30 38q6-12 18-14" stroke="#fff" stroke-width="5" opacity=".6"/>` +
    dot(42, 52, 3) +
    dot(58, 52, 3) +
    `<path d="M44 60q6 5 12 0" stroke-width="3"/>`,
  네모나다:
    `<rect x="18" y="18" width="64" height="64" rx="3" fill="#3b78e6"/>` +
    `<path d="M26 30V26H30" stroke="#fff" stroke-width="4" opacity=".6"/>` +
    dot(18, 18, 5, HL) +
    dot(82, 18, 5, HL) +
    dot(18, 82, 5, HL) +
    dot(82, 82, 5, HL) +
    dot(42, 50, 3) +
    dot(58, 50, 3) +
    `<path d="M44 58q6 5 12 0" stroke-width="3"/>`,
  세모나다:
    `<path d="M50 12L90 84H10Z" fill="#43b04a"/>` +
    dot(50, 12, 5, HL) +
    dot(90, 84, 5, HL) +
    dot(10, 84, 5, HL) +
    dot(42, 60, 3) +
    dot(58, 60, 3) +
    `<path d="M44 68q6 5 12 0" stroke-width="3"/>`,
  꼬불꼬불하다:
    `<path d="M8 96C8 40 30 10 50 10S92 40 92 96Z" fill="#8fd18a"/>` +
    `<path d="M36 96C36 84 72 86 72 74S30 66 30 54S70 48 66 36S46 24 52 14" stroke-width="16"/>` +
    `<path d="M36 96C36 84 72 86 72 74S30 66 30 54S70 48 66 36S46 24 52 14" stroke="#8a96b0" stroke-width="10"/>` +
    `<path d="M36 96C36 84 72 86 72 74S30 66 30 54S70 48 66 36S46 24 52 14" stroke="#fff" stroke-width="2" stroke-dasharray="4 5"/>` +
    tree(16, 72, 0.5, '#3a9e47') +
    tree(86, 56, 0.5, '#3a9e47'),
  삐뚤빼뚤하다:
    `<rect x="8" y="14" width="84" height="72" rx="3" fill="#fff"/>` +
    `<path d="M16 34H84M16 66H84" stroke="#b8c0d4" stroke-width="2" stroke-dasharray="4 4"/>` +
    `<path d="M16 36L22 28L27 40L33 30L37 44L44 26L49 38L56 32L60 46L66 28L72 40L78 34" stroke="#e8553d" stroke-width="4"/>` +
    `<path d="M16 64L21 72L28 58L34 70L40 62L45 76L52 60L58 70L63 64" stroke="#3b78e6" stroke-width="4"/>` +
    `<g transform="rotate(35 76 66)"><rect x="70" y="40" width="12" height="36" fill="#ffd23f"/><rect x="70" y="34" width="12" height="8" rx="3" fill="#ff9aa8"/><path d="M70 76L76 88L82 76Z" fill="${SKIN}"/><path d="M74 84L76 88L78 84Z" fill="${INK}"/></g>`,
  깔끔하다:
    `<rect x="8" y="10" width="84" height="84" rx="3" fill="#c98f52"/>` +
    `<rect x="14" y="16" width="72" height="34" fill="#f7e6c8"/><rect x="14" y="56" width="72" height="32" fill="#f7e6c8"/>` +
    `<g stroke-width="2.5"><rect x="18" y="22" width="9" height="28" fill="#e8553d"/><rect x="27" y="22" width="9" height="28" fill="#ffd23f"/><rect x="36" y="22" width="9" height="28" fill="#43b04a"/><rect x="45" y="22" width="9" height="28" fill="#3b78e6"/><rect x="54" y="22" width="9" height="28" fill="#8e4fc9"/></g>` +
    `<g stroke-width="2.5"><rect x="18" y="74" width="30" height="7" rx="2" fill="#7ec8f0"/><rect x="18" y="67" width="30" height="7" rx="2" fill="#ff9aa8"/><rect x="18" y="60" width="30" height="7" rx="2" fill="#ffd23f"/>` +
    `<rect x="56" y="62" width="24" height="26" rx="2" fill="#43b04a"/></g>` +
    sparkle(76, 32, 8) +
    sparkle(88, 8, 6) +
    sparkle(10, 94, 5, '#7ec8f0'),
  지저분하다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    `<path d="M14 90C12 74 26 66 38 70C44 60 62 60 66 70C78 66 90 76 86 90Z" fill="#9aa8c4"/>` +
    `<path d="M20 78L40 74L44 86L30 90Z" fill="#e8553d"/>` +
    `<path d="M50 66L58 66L58 78L68 80L66 86L50 84Z" fill="#fff" stroke-width="3"/>` +
    `<path d="M66 68L84 72L80 84L64 80Z" fill="#43b04a"/>` +
    `<circle cx="36" cy="64" r="8" fill="#fff"/><path d="M31 61l5 4 4-5M32 68l6-2" stroke-width="2"/>` +
    `<circle cx="84" cy="58" r="6" fill="#fff"/><path d="M81 56l4 3 2-4" stroke-width="2"/>` +
    `<ellipse cx="22" cy="94" rx="4" ry="2" fill="#9a5b2e" stroke="none"/><ellipse cx="60" cy="94" rx="5" ry="2" fill="#9a5b2e" stroke="none"/>` +
    `<path d="M30 46c-4-6 4-8 0-14M50 44c-4-6 4-8 0-14M70 46c-4-6 4-8 0-14" stroke="#8fae5a" stroke-width="3.5"/>` +
    `<path d="M10 54q4-8 10-4M88 40q-4-6 4-8" stroke="#9a5b2e" stroke-width="3"/>`,
  오래되다:
    `<path d="M16 14H78L84 22V88H22L16 80Z" fill="#b08a5c"/>` +
    `<path d="M16 14V80L22 88V22L16 14" fill="#8a6a44"/>` +
    `<path d="M84 22L90 28V94H28L22 88H84Z" fill="#f2e2b0"/><path d="M28 91H87V32" stroke="#c9a878" stroke-width="2"/>` +
    `<path d="M84 22L84 88H22" stroke="#6b4a2a" stroke-width="3"/>` +
    `<path d="M70 14L78 14L84 22L84 30Z" fill="#f7e6c8"/>` +
    `<rect x="36" y="36" width="26" height="18" rx="2" fill="#c9a878" stroke-width="2.5"/>` +
    `<path d="M40 64l6 6 6-6M28 76h16" stroke="#6b4a2a" stroke-width="3"/>` +
    `<path d="M22 22L36 22M22 22L22 36M22 22L32 32M26 22q0 4-4 4M30 22q0 8-8 8M34 22q0 12-12 12" stroke="#fff" stroke-width="1.8"/>` +
    `<circle cx="88" cy="90" r="5" fill="#dfe8f5" stroke="#b8c0d4"/><circle cx="94" cy="84" r="3" fill="#dfe8f5" stroke="#b8c0d4"/><circle cx="10" cy="92" r="4" fill="#dfe8f5" stroke="#b8c0d4"/>`,
  망가지다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<g transform="rotate(-10 44 60)"><path d="M10 72V56C10 52 14 50 18 50H26L34 36H56L66 50H72C76 50 78 54 78 58V72Z" fill="#3b78e6"/>` +
    `<path d="M36 40H46V50H30ZM50 40H56L62 50H50Z" fill="#dff3ff" stroke-width="2.5"/>` +
    `<path d="M52 54L46 60L52 64L46 70" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="24" cy="74" r="8" fill="#5a6070"/><circle cx="24" cy="74" r="3" fill="#dfe8f5" stroke="none"/>` +
    `<path d="M64 72c2-4 6-4 6 0s4 4 6 0" stroke="#8a96b0" stroke-width="3"/></g>` +
    `<circle cx="84" cy="82" r="9" fill="#5a6070"/><circle cx="84" cy="82" r="3.5" fill="#dfe8f5" stroke="none"/>` +
    `<path d="M68 90q4-4 6 0M90 64l4-4M76 64l-2-4" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M20 20l8 8M28 20l-8 8" stroke="#e8553d" stroke-width="3" opacity=".6"/>`,

  // ── 느낌·마음 ──
  신기하다:
    hd(
      40,
      60,
      0.95,
      star(38, 56, 9, '#ffd23f') +
        star(62, 56, 9, '#ffd23f') +
        `<ellipse cx="50" cy="76" rx="5" ry="6" fill="#c62f3f"/>` +
        cheeks(68, 22),
    ) +
    `<circle cx="84" cy="22" r="10" fill="#c9a6f5"/><circle cx="81" cy="19" r="3" fill="#fff" stroke="none"/>` +
    sparkle(84, 44, 6) +
    sparkle(66, 12, 5, '#7ec8f0') +
    sparkle(94, 6, 4) +
    sparkle(12, 16, 6),
  재미있다:
    hd(50, 44, 0.8, happyEyes + bigSmile + cheeks(66, 22)) +
    `<path d="M14 94L22 64L50 70L78 64L86 94L50 90Z" fill="#fff"/><path d="M50 70V90" stroke-width="3"/>` +
    `<path d="M24 72L46 76M26 80L46 84M54 76L76 72M54 84L74 80" stroke="#9aa6c4" stroke-width="2.5"/>` +
    `<circle cx="22" cy="68" r="7" fill="${SKIN}"/><circle cx="78" cy="68" r="7" fill="${SKIN}"/>` +
    sparkle(12, 20, 7) +
    sparkle(88, 18, 7, '#ff9aa8') +
    `<path d="M8 40l6 2M92 40l-6 2" stroke="#ff9f1a" stroke-width="4"/>`,
  멋지다:
    hd(
      50,
      56,
      0.9,
      `<path d="M26 50H74V56C74 62 70 64 64 64C58 64 54 60 53 56H47C46 60 42 64 36 64C30 64 26 62 26 56Z" fill="${INK}"/>` +
        `<path d="M32 54l6-2M58 54l6-2" stroke="#fff" stroke-width="2.5"/>` +
        `<path d="M40 74q10 6 20 0" stroke-width="4"/>`,
    ) +
    `<rect x="72" y="66" width="18" height="16" rx="6" fill="${SKIN}"/><rect x="76" y="50" width="8" height="20" rx="4" fill="${SKIN}"/>` +
    sparkle(14, 22, 8) +
    sparkle(86, 20, 8) +
    sparkle(12, 70, 6) +
    sparkle(90, 94, 5),
  겁나다:
    hd(
      50,
      56,
      0.95,
      `<path d="M30 44l12-5M70 44l-12-5" stroke-width="3.5"/>` +
        bigEyes +
        `<path d="M38 76c4-4 8 4 12 0s8 4 12 0" stroke-width="3.5"/>`,
    ) +
    drop(84, 30, 0.9) +
    drop(14, 40, 0.7) +
    `<path d="M6 58l4 4-4 4 4 4M94 58l-4 4 4 4-4 4" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="30" cy="92" r="7" fill="${SKIN}"/><circle cx="70" cy="92" r="7" fill="${SKIN}"/>`,
  친절하다:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    person(34, 94, 1.45, { hair: '#dfe8f5', style: 'bun', shirt: '#8e4fc9', glasses: true }) +
    `<path d="M14 94V66q0-4 4-4" stroke="#9a5b2e" stroke-width="4"/>` +
    person(72, 94, 1.05, { hair: '#5a3b24', style: 'short', shirt: '#43b04a' }) +
    `<path d="M80 72C80 66 90 66 90 72" stroke-width="3"/><rect x="78" y="72" width="16" height="16" rx="3" fill="#e8553d"/>` +
    `<circle cx="84" cy="72" r="4" fill="${SKIN}"/>` +
    heart(54, 20, 10, '#ff5c70') +
    sparkle(80, 12, 5),
  사이좋다:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    tube('M40 76L50 82L60 76', SKIN, 5) +
    person(30, 94, 1.25, { hair: '#5a3b24', style: 'pony', shirt: '#e85d9a' }) +
    person(70, 94, 1.25, { hair: '#3a2a20', style: 'short', shirt: '#3b78e6' }) +
    `<circle cx="50" cy="82" r="5" fill="${SKIN}"/>` +
    heart(50, 18, 11, '#ff5c70') +
    sparkle(22, 14, 5) +
    sparkle(80, 14, 5),

  // ── 몸집 ──
  뚱뚱하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    cat(44, 92, 36, 46, '#ff9f1a') +
    `<path d="M24 60q6 8 0 16M64 60q-6 8 0 16" stroke="#e8862e" stroke-width="3.5"/>` +
    ring(44, 64, 44, 30),
  날씬하다:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    person(28, 94, 1.5, { hair: '#5a3b24', style: 'long', shirt: '#e85d9a' }).replace(
      'M-15 0C-15 -13 -9 -20 0 -20S15 -13 15 0Z',
      'M-7 0C-9 -13 -6 -20 0 -20S9 -13 7 0Z',
    ) +
    person(72, 94, 1.5, { hair: '#3a2a20', style: 'short', shirt: '#3b78e6' }).replace(
      'M-15 0C-15 -13 -9 -20 0 -20S15 -13 15 0Z',
      'M-22 0C-26 -16 -12 -20 0 -20S26 -16 22 0Z',
    ) +
    ring(28, 58, 16, 38) +
    sparkle(10, 12, 6),
  홀쭉하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<path d="M10 92C4 70 12 44 26 40H40C54 44 60 70 54 92Z" fill="#c98f52"/><path d="M24 40L32 32L42 40" stroke="#9a5b2e" stroke-width="4"/>` +
    `<path d="M26 36H40" stroke="#9a5b2e" stroke-width="5"/>` +
    `<path d="M66 92C70 80 68 60 72 40H82C84 60 82 80 88 92Z" fill="#c98f52"/>` +
    `<path d="M70 38H84" stroke="#9a5b2e" stroke-width="5"/><path d="M72 50q4 14 0 30M80 52q-2 14 2 28" stroke="#9a5b2e" stroke-width="2.5"/>` +
    ring(77, 64, 16, 34),
  통통하다:
    hd(50, 54, 1.05, dot(38, 56, 3.6) + dot(62, 56, 3.6) + `<path d="M46 72q4 3 8 0" stroke-width="3.5"/>`, '#e8b070').replace(
      '<circle cx="50" cy="54" r="32"',
      '<ellipse cx="50" cy="58" rx="36" ry="30"',
    ) +
    `<circle cx="22" cy="68" r="10" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="78" cy="68" r="10" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<circle cx="92" cy="78" r="6" fill="${SKIN}"/><rect x="84" y="80" width="10" height="16" rx="5" fill="${SKIN}"/>` +
    `<path d="M86 64l-4-4M92 62v-6" stroke="#9aa6c4" stroke-width="3"/>`,

  // ── 생김새·기울기 ──
  납작하다:
    `<path d="M4 90H96" stroke="#c9b28a"/>` +
    `<circle cx="22" cy="72" r="17" fill="#f2c14e"/><path d="M14 64q4-4 8-4" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    `<path d="M40 72H48M44 68l5 4-5 4" stroke="#3b78e6" stroke-width="4"/>` +
    `<ellipse cx="74" cy="84" rx="22" ry="6" fill="#f2c14e"/>` +
    `<rect x="56" y="54" width="36" height="12" rx="4" fill="#9a5b2e"/><path d="M74 36V52" stroke="#3b78e6" stroke-width="4"/><path d="M68 46l6 6 6-6" stroke="#3b78e6" stroke-width="4"/>` +
    ring(74, 84, 26, 10),
  볼록하다:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    tube('M40 80V94M60 80V94', '#3b78e6', 6) +
    `<circle cx="50" cy="60" r="26" fill="#ff9f1a"/>` +
    `<path d="M36 50q-4 8 0 14" stroke="#fff" stroke-width="4" opacity=".6"/>` +
    `<circle cx="50" cy="20" r="14" fill="${SKIN}"/><path d="M36 18C36 6 44 4 50 4S64 6 64 18C60 12 56 11 50 11S40 12 36 18Z" fill="#5a3b24"/>` +
    `<path d="M44 20q2-3 4 0M52 20q2-3 4 0" stroke-width="2.5"/><path d="M46 27q4 3 8 0" stroke-width="2.5"/>` +
    `<circle cx="28" cy="58" r="6" fill="${SKIN}"/><circle cx="72" cy="58" r="6" fill="${SKIN}"/>` +
    ring(50, 62, 34, 30),
  오목하다:
    `<path d="M6 30C6 76 26 90 50 90S94 76 94 30H82C82 64 68 76 50 76S18 64 18 30Z" fill="#7ec8f0"/>` +
    `<circle cx="50" cy="66" r="9" fill="#e8553d"/><path d="M45 62q3-3 6-2" stroke="#fff" stroke-width="2.5"/>` +
    `<path d="M28 36q0 10 6 18M72 36q0 10-6 18" stroke="#3b78e6" stroke-width="4"/><path d="M28 50l6 6 2-8M72 50l-6 6-2-8" stroke="#3b78e6" stroke-width="4"/>` +
    ring(50, 64, 30, 18),
  가파르다:
    `<path d="M4 94H96" stroke="#c9b28a"/>` +
    `<path d="M20 94L64 8L72 8L86 94Z" fill="#8fd18a"/>` +
    `<path d="M64 8L68 2L72 8" fill="#fff"/>` +
    `<path d="M26 94L64 12" stroke="#3a9e47" stroke-width="3"/>` +
    person(46, 58, 0.72, { hair: '#5a3b24', style: 'short', shirt: '#e8553d' }).replace(
      `translate(46 58) scale(0.72)`,
      `translate(46 58) rotate(26) scale(0.72)`,
    ) +
    `<path d="M16 60L36 20M36 20L26 24M36 20L37 31" stroke="#3b78e6" stroke-width="4"/>`,
  평평하다:
    `<rect x="6" y="52" width="88" height="12" rx="3" fill="#c98f52"/>` +
    `<path d="M16 64V92M84 64V92" stroke="#9a5b2e" stroke-width="7"/>` +
    `<circle cx="50" cy="40" r="12" fill="#e8553d"/><path d="M42 36q3-5 8-5" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    `<path d="M6 20H94M6 20l6-5M6 20l6 5M94 20l-6-5M94 20l-6 5" stroke="#3b78e6" stroke-width="4"/>` +
    `<path d="M10 58H90" stroke="${HL}" stroke-width="3" stroke-dasharray="7 5"/>`,
  비스듬하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<rect x="70" y="6" width="24" height="86" fill="#dfe8f5"/>` +
    `<path d="M14 92L62 8M34 92L78 14" stroke="#9a5b2e" stroke-width="6"/>` +
    `<path d="M23 76L42 80M31 62L50 66M39 48L58 52M47 34L66 38M55 20L72 24" stroke="#b5793a" stroke-width="5"/>` +
    `<path d="M14 92V40" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="5 5"/>` +
    `<path d="M14 64a26 26 0 0 1 12 -22" stroke="${HL}" stroke-width="4"/>`,
  기울다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    `<path d="M38 8V92" stroke="#9aa6c4" stroke-width="2.5" stroke-dasharray="5 5"/>` +
    `<g transform="rotate(14 44 92)"><rect x="30" y="18" width="28" height="74" fill="#fff"/>` +
    `<path d="M30 36H58M30 54H58M30 72H58" stroke-width="3"/>` +
    `<g fill="#8a96b0" stroke="none"><rect x="36" y="24" width="5" height="8" rx="2"/><rect x="47" y="24" width="5" height="8" rx="2"/><rect x="36" y="42" width="5" height="8" rx="2"/><rect x="47" y="42" width="5" height="8" rx="2"/><rect x="36" y="60" width="5" height="8" rx="2"/><rect x="47" y="60" width="5" height="8" rx="2"/><rect x="36" y="78" width="5" height="8" rx="2"/><rect x="47" y="78" width="5" height="8" rx="2"/></g>` +
    `<path d="M28 18H60L56 10H32Z" fill="#e8553d"/></g>` +
    `<path d="M40 16a50 50 0 0 1 16 4" stroke="${HL}" stroke-width="4"/>` +
    `<path d="M80 30L84 52M84 52l-6-4M84 52l4-6" stroke="#3b78e6" stroke-width="4"/>`,
  빽빽하다:
    `<path d="M4 92H96" stroke="#c9b28a"/>` +
    tree(14, 90, 1, '#3a9e47') +
    tree(86, 90, 1, '#3a9e47') +
    tree(30, 88, 1.05, '#43b04a') +
    tree(70, 88, 1.05, '#43b04a') +
    tree(50, 90, 1.15, '#5fc24a') +
    tree(22, 92, 0.8, '#5fc24a') +
    tree(40, 94, 0.8, '#3a9e47') +
    tree(60, 94, 0.8, '#3a9e47') +
    tree(78, 92, 0.8, '#5fc24a'),
  익다:
    tomato(24, 60, 19, '#8fd18a') +
    `<path d="M46 60H58M52 54l7 6-7 6" stroke="#3b78e6" stroke-width="5"/>` +
    tomato(78, 60, 19, '#e8553d') +
    sparkle(90, 26, 6) +
    sparkle(96, 88, 4),
};
