// 몸의 부분(손바닥·팔꿈치·보조개…)과 몸으로 하는 행동(눕다·안다·양치하다…). 그림 규칙은 docs/picture-style.md.
import { INK, SKIN, HL, dot, ring, stick, person, moodFace, sparkle, tube, drop, cheeks, blob } from '../pictureKit.ts';

const HAIR = '#5a3b24';
const MOVE = '#9aa6c4';
const ARROW = '#3b78e6';

/** 편 손 (손가락 위, 손목 아래 가운데 (52, 90)) */
const openHand =
  `<rect x="30" y="18" width="10" height="32" rx="5" fill="${SKIN}"/><rect x="42" y="10" width="10" height="38" rx="5" fill="${SKIN}"/>` +
  `<rect x="54" y="12" width="10" height="36" rx="5" fill="${SKIN}"/><rect x="66" y="22" width="9" height="28" rx="4.5" fill="${SKIN}"/>` +
  `<path d="M30 60C20 54 12 44 16 39C20 35 28 42 34 50Z" fill="${SKIN}"/>` +
  `<path d="M28 44H76V70C76 84 66 90 52 90S28 82 28 70Z" fill="${SKIN}"/>`;
const handAt = (t: string) => `<g transform="${t}">${openHand}</g>`;

/** 쥔 주먹 (앞에서, 가운데 (50, 50) 안팎) */
const fist =
  `<rect x="24" y="26" width="52" height="46" rx="15" fill="${SKIN}"/>` +
  `<path d="M37 28V50M50 27V50M63 28V50" stroke-width="3"/>` +
  `<path d="M26 54H62C68 54 68 66 62 66H30C26 64 25 58 26 54Z" fill="${SKIN}"/>`;

/** 선물 상자 */
const gift = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(3.5 / s).toFixed(2)}">` +
  `<path d="M-4 -16C-14 -26 -20 -14 -4 -14ZM4 -16C14 -26 20 -14 4 -14Z" fill="${HL}"/>` +
  `<rect x="-16" y="-14" width="32" height="30" rx="2" fill="#e85d9a"/><rect x="-4" y="-14" width="8" height="30" fill="${HL}"/>` +
  `<path d="M-16 -4H16" stroke="${HL}" stroke-width="${(6 / s).toFixed(2)}"/></g>`;

/** 막대 사람 머리에 얼굴 (웃는 눈·입) */
const stickFace = (x: number, y: number) => dot(x - 3.5, y, 1.6) + dot(x + 3.5, y, 1.6) + `<path d="M${x - 3} ${y + 4}q3 2.5 6 0" stroke-width="2"/>`;

/** 침대 (옆에서) */
const bed =
  `<path d="M8 40V92M92 60V92" stroke="#6b3e26" stroke-width="6"/>` +
  `<rect x="8" y="64" width="84" height="14" rx="3" fill="#b5793a"/><rect x="10" y="56" width="80" height="10" rx="4" fill="#fff"/>`;

/** 물결 (수영) */
const waterTop = (y: number) => `M4 ${y}q8-6 16 0t16 0 16 0 16 0 16 0 16 0V96H4Z`;

export const PICS: Record<string, string> = {
  // ── 몸 ──
  손바닥:
    openHand +
    `<path d="M38 60q14 8 30-2M40 74q12 4 22-4" stroke="#e0a070" stroke-width="3"/>` +
    ring(52, 66, 22, 20),
  발바닥:
    `<path d="M36 34C30 50 30 66 34 80C38 92 58 94 64 82C68 72 64 62 66 50C68 40 64 32 56 30C48 28 40 28 36 34Z" fill="${SKIN}"/>` +
    `<ellipse cx="50" cy="42" rx="12" ry="7" fill="#ffb98a" stroke="none"/><ellipse cx="49" cy="80" rx="10" ry="7" fill="#ffb98a" stroke="none"/>` +
    [
      [38, 20, 7.5],
      [51, 14, 6],
      [61, 17, 5],
      [69, 23, 4.5],
      [74, 31, 4],
    ]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`)
      .join('') +
    ring(49, 60, 26, 36),
  팔꿈치:
    `<rect x="4" y="54" width="22" height="26" rx="4" fill="#3b78e6"/>` +
    tube('M26 67H60L70 30', SKIN, 16) +
    `<path d="M40 62C46 56 54 58 58 64" stroke-width="2.5"/>` +
    `<circle cx="71" cy="24" r="12" fill="${SKIN}"/><path d="M65 20h9M65 26h9" stroke-width="2.5"/>` +
    ring(62, 70, 14, 13),
  손목:
    `<rect x="4" y="42" width="18" height="28" rx="4" fill="#3b78e6"/>` +
    tube('M22 56H50', SKIN, 16) +
    handAt('translate(48 56) rotate(90) scale(0.62) translate(-52 -90)') +
    ring(44, 56, 11, 18),
  발목:
    `<rect x="26" y="4" width="36" height="18" rx="4" fill="#3b78e6"/>` +
    `<path d="M32 20V80H56V20Z" fill="${SKIN}"/>` +
    `<path d="M30 70V82C30 90 36 92 42 92H84C92 92 94 82 86 80L56 72V70Z" fill="${SKIN}"/>` +
    `<path d="M32 60V68" stroke-width="2.5"/>` +
    ring(44, 70, 18, 11),
  콧구멍: moodFace(
    dot(36, 48) +
      dot(64, 48) +
      `<path d="M50 46C43 58 34 62 34 70C34 78 43 80 50 76C57 80 66 78 66 70C66 62 57 58 50 46Z" fill="#ffc08e"/>` +
      `<ellipse cx="43" cy="71" rx="4.5" ry="3.5" fill="${INK}" transform="rotate(20 43 71)"/><ellipse cx="57" cy="71" rx="4.5" ry="3.5" fill="${INK}" transform="rotate(-20 57 71)"/>` +
      `<path d="M44 82q6 3 12 0" stroke-width="2.5"/>` +
      ring(50, 71, 21, 11),
  ),
  속눈썹:
    `<path d="M18 38C14 30 12 24 8 20M30 32C28 22 26 16 22 10M42 28C42 18 40 12 38 6M56 28C58 18 60 12 64 6M68 32C72 22 76 16 80 12M80 40C86 32 90 28 94 26" stroke-width="5"/>` +
    `<path d="M10 58C28 30 72 30 90 58C72 84 28 84 10 58Z" fill="#fff"/><circle cx="50" cy="58" r="16" fill="#5aa7e8"/>` +
    dot(50, 58, 8) +
    dot(55, 53, 3.5, '#fff') +
    `<path d="M10 58C28 30 72 30 90 58" stroke-width="6"/>` +
    ring(52, 24, 44, 18),
  보조개: moodFace(
    `<path d="M32 52q6-7 12 0M56 52q6-7 12 0" stroke-width="4"/>` +
      `<path d="M34 66C40 80 60 80 66 66Z" fill="#fff"/>` +
      `<path d="M24 66q2 5 7 6M76 66q-2 5-7 6" stroke-width="3"/>` +
      ring(27, 70, 9, 9) +
      ring(73, 70, 9, 9),
  ),
  주먹:
    `<rect x="34" y="72" width="32" height="24" rx="3" fill="#3b78e6"/>` +
    fist +
    `<path d="M14 30l6 4M10 48h8M14 66l6-4M86 30l-6 4M90 48h-8M86 66l-6-4" stroke="${MOVE}" stroke-width="3"/>`,
  엄지:
    `<rect x="72" y="50" width="20" height="34" rx="3" fill="#3b78e6"/>` +
    `<rect x="30" y="10" width="17" height="44" rx="8.5" fill="${SKIN}"/>` +
    `<rect x="24" y="44" width="50" height="44" rx="12" fill="${SKIN}"/>` +
    `<path d="M24 56H52M24 67H52M26 78H52" stroke-width="3"/>` +
    sparkle(14, 20, 7) +
    sparkle(66, 24, 6) +
    sparkle(84, 36, 4),
  수염:
    `<circle cx="24" cy="44" r="6" fill="${SKIN}"/><circle cx="76" cy="44" r="6" fill="${SKIN}"/>` +
    `<circle cx="50" cy="40" r="26" fill="${SKIN}"/>` +
    `<path d="M26 40C24 30 26 24 30 20M74 40C76 30 74 24 70 20" stroke="#dfe8f5" stroke-width="7"/>` +
    `<path d="M36 32h9M55 32h9" stroke="#b5c0d8" stroke-width="4"/>` +
    dot(40, 40, 2.8) +
    dot(60, 40, 2.8) +
    `<path d="M50 42q-3 5 0 8"/>` +
    `<path d="M26 46C26 74 38 94 50 94S74 74 74 46C68 58 60 60 50 60S32 58 26 46Z" fill="#fff"/>` +
    `<path d="M34 58C40 50 48 52 50 56C52 52 60 50 66 58C60 64 40 64 34 58Z" fill="#fff"/>` +
    `<path d="M42 72q2 6 0 10M58 72q-2 6 0 10M50 70v12" stroke="#b5c0d8" stroke-width="2.5"/>`,
  뼈:
    `<g transform="rotate(-30 50 50)">` +
    `<g fill="#fff4dc" stroke-width="7"><circle cx="22" cy="40" r="11"/><circle cx="22" cy="60" r="11"/><circle cx="78" cy="40" r="11"/><circle cx="78" cy="60" r="11"/><rect x="22" y="41" width="56" height="18"/></g>` +
    `<g fill="#fff4dc" stroke="none"><circle cx="22" cy="40" r="11"/><circle cx="22" cy="60" r="11"/><circle cx="78" cy="40" r="11"/><circle cx="78" cy="60" r="11"/><rect x="22" y="41" width="56" height="18"/></g>` +
    `</g>`,
  종아리:
    `<rect x="30" y="4" width="34" height="20" rx="4" fill="#3b78e6"/>` +
    `<path d="M34 22V42C30 50 26 58 28 66C30 72 34 76 36 82H54C54 72 56 62 56 50V22Z" fill="${SKIN}"/>` +
    `<path d="M34 80V92H82C88 92 88 84 82 82L56 76V80Z" fill="#e8553d"/>` +
    `<path d="M50 40q-4 4 0 8" stroke-width="2.5"/>` +
    ring(35, 62, 12, 17),
  허벅지:
    `<path d="M26 6H74L76 24H54L50 18L46 24H24Z" fill="#3b78e6"/>` +
    `<path d="M26 24H46V52C44 60 44 70 42 84H32C30 70 28 60 28 52Z" fill="${SKIN}"/>` +
    `<path d="M54 24H74L72 52C72 60 70 70 68 84H58C56 70 56 60 54 52Z" fill="${SKIN}"/>` +
    `<path d="M30 82H44V92H22C22 86 25 82 30 82Z" fill="#e8553d"/><path d="M56 82H70C75 82 78 86 78 92H56Z" fill="#e8553d"/>` +
    ring(36, 38, 14, 17) +
    ring(64, 38, 14, 17),
  발톱:
    `<path d="M12 52H90C94 72 88 96 70 96H30C14 96 8 72 12 52Z" fill="${SKIN}"/>` +
    [
      [14, 18, 22],
      [38, 22, 15],
      [55, 28, 13],
      [70, 34, 11],
      [83, 42, 9],
    ]
      .map(
        ([x, y, w]) =>
          `<rect x="${x}" y="${y}" width="${w}" height="${66 - y}" rx="${w / 2}" fill="${SKIN}"/>` +
          `<rect x="${x + w * 0.2}" y="${y + 3}" width="${w * 0.6}" height="${w * 0.7}" rx="${w * 0.25}" fill="#ffe3ea"/>`,
      )
      .join('') +
    ring(52, 32, 44, 16),
  눈물: moodFace(
    `<path d="M30 46l12-4M70 46l-12-4" stroke-width="3"/>` +
      dot(38, 56, 4) +
      dot(62, 56, 4) +
      `<path d="M40 80q10-8 20 0" stroke-width="4"/>` +
      drop(32, 60, 1.5) +
      drop(68, 64, 0.9),
  ),
  콧물: moodFace(
    `<path d="M32 54q6 4 12 0M56 54q6 4 12 0" stroke-width="4"/>` +
      `<path d="M50 56q-4 6 0 9"/>` +
      `<path d="M44 66C40 72 40 84 44 88C48 90 50 86 48 80C47 74 48 70 48 66Z" fill="#c8e68a"/>` +
      `<path d="M56 80q6-4 10 0" stroke-width="3.5"/>` +
      cheeks(66, 22),
  ),
  방귀:
    `<circle cx="46" cy="16" r="11" fill="${SKIN}"/><path d="M35 16C35 4 42 4 46 4S57 4 57 16C57 22 35 22 35 16Z" fill="${HAIR}"/>` +
    `<path d="M24 24H68L70 40H22Z" fill="#43b04a"/>` +
    `<path d="M22 38H70V58C70 68 60 70 54 66C50 64 48 62 46 62C44 62 42 64 38 66C32 70 22 68 22 58Z" fill="#3b78e6"/>` +
    `<path d="M46 42V60" stroke-width="3"/>` +
    `<path d="M32 66V86M60 66V86" stroke="${INK}" stroke-width="13"/><path d="M32 66V86M60 66V86" stroke="${SKIN}" stroke-width="6"/>` +
    `<path d="M24 86H40V94H24ZM52 86H68V94H52Z" fill="#e8553d"/>` +
    blob('#d6ecb0', [
      [82, 66, 10],
      [90, 76, 7],
      [78, 80, 8],
    ]) +
    `<circle cx="64" cy="60" r="3" fill="#d6ecb0"/><circle cx="71" cy="62" r="4" fill="#d6ecb0"/>`,
  눕다:
    bed +
    `<ellipse cx="24" cy="52" rx="12" ry="6" fill="#dfe8f5"/>` +
    tube('M64 50H88M64 53L88 56', '#3b78e6', 5) +
    tube('M34 51H62', '#ffc933', 11) +
    `<circle cx="24" cy="44" r="10" fill="${SKIN}"/>` +
    stickFace(24, 44),
  뛰다:
    `<ellipse cx="50" cy="92" rx="16" ry="3.5" fill="#d0d6e6" stroke="none"/>` +
    `<path d="M38 72v10M50 74v10M62 72v10" stroke="${MOVE}" stroke-width="3"/>` +
    stick(50, 16, 'M0 10V34M0 16L-14 2M0 16L14 2M0 34L-12 42L-8 54M0 34L12 42L8 54', 1.1) +
    stickFace(50, 16),
  날다:
    `<path d="M14 64h14M8 54h14M12 74h12" stroke="${MOVE}" stroke-width="3"/>` +
    blob('#fff', [
      [78, 84, 7],
      [86, 82, 8],
      [94, 86, 5],
    ]) +
    `<path d="M44 52L24 18C40 20 52 32 56 46Z" fill="#3b78e6"/>` +
    `<path d="M34 58L14 50L24 64Z" fill="#3b8fe0"/>` +
    `<ellipse cx="50" cy="60" rx="20" ry="12" fill="#4a90e2"/>` +
    `<circle cx="72" cy="48" r="11" fill="#4a90e2"/>` +
    `<path d="M82 45L94 49L82 53Z" fill="#ff9f1a"/>` +
    dot(75, 45, 2.4) +
    `<path d="M48 54L36 26C50 28 58 40 60 52Z" fill="#7ec8f0"/>`,
  기다:
    `<path d="M4 90H96" stroke="#c9b28a" stroke-width="3"/>` +
    tube('M30 64L26 86L10 86', SKIN, 8) +
    `<ellipse cx="44" cy="62" rx="20" ry="13" fill="#ff9aa8"/>` +
    tube('M58 66L62 86', SKIN, 8) +
    tube('M52 68L52 86', SKIN, 7) +
    `<circle cx="72" cy="48" r="16" fill="${SKIN}"/><path d="M62 36q8-10 16-2" stroke="${HAIR}" stroke-width="4"/>` +
    dot(70, 48, 2.2) +
    dot(80, 48, 2.2) +
    `<path d="M72 56q4 3 8 0" stroke-width="2.5"/>` +
    `<circle cx="66" cy="55" r="3.5" fill="#ff9aa8" stroke="none" opacity=".6"/>`,
  구르다:
    `<path d="M4 44L96 80V96H4Z" fill="#8fd18a"/>` +
    `<path d="M4 44L96 80" stroke="#3a9e47" stroke-width="3.5"/>` +
    `<g transform="rotate(30 40 40)"><circle cx="40" cy="40" r="15" fill="#ffc933"/>` +
    tube('M30 50Q40 62 52 48', '#3b78e6', 7) +
    `<circle cx="50" cy="28" r="10" fill="${SKIN}"/>` +
    dot(47, 28, 1.8) +
    dot(54, 28, 1.8) +
    `</g>` +
    `<path d="M16 22A28 28 0 0 1 62 18" stroke="${ARROW}" stroke-width="4"/><path d="M54 12L63 19L54 24" stroke="${ARROW}" stroke-width="4"/>` +
    `<circle cx="80" cy="64" r="10" fill="#e8553d"/><path d="M71 60C76 64 84 64 89 60" stroke="#fff" stroke-width="3"/>` +
    `<path d="M60 58l-8-4M60 66l-8-2" stroke="${MOVE}" stroke-width="3"/>`,
  오르다:
    `<path d="M30 4V96M62 4V96" stroke="#9a5b2e" stroke-width="6"/>` +
    `<path d="M30 14H62M30 30H62M30 46H62M30 62H62M30 78H62M30 94H62" stroke="#b5793a" stroke-width="5"/>` +
    stick(46, 36, 'M0 10V32M0 16L-14 -6M0 16L14 -6M0 32L-14 36L-14 42M0 32L12 42L14 58', 1) +
    stickFace(46, 36) +
    `<path d="M84 80V24M74 36l10-12 10 12" stroke="${ARROW}" stroke-width="6"/>`,
  받다:
    `<path d="M6 40H18M4 54H16M6 68H18" stroke="${MOVE}" stroke-width="3"/>` +
    person(70, 96, 1.5, { hair: HAIR, style: 'short', shirt: '#43b04a' }) +
    tube('M60 78L44 76', SKIN, 6) +
    tube('M80 76L50 60', SKIN, 6) +
    gift(34, 66, 1.1) +
    sparkle(90, 14, 6) +
    sparkle(30, 22, 6),
  주다:
    `<rect x="4" y="68" width="24" height="22" rx="3" fill="#3b78e6"/>` +
    tube('M28 79H40', SKIN, 12) +
    `<path d="M36 70H78C86 70 88 78 82 82C74 88 50 90 40 86C34 84 32 74 36 70Z" fill="${SKIN}"/>` +
    gift(60, 50, 1.2) +
    `<path d="M40 70C38 62 42 58 46 60L48 70Z" fill="${SKIN}"/>` +
    `<path d="M78 26H94M86 18l8 8-8 8" stroke="${ARROW}" stroke-width="5"/>`,
  안다:
    person(36, 96, 1.55, { hair: HAIR, style: 'long', shirt: '#e85d9a' }) +
    person(64, 96, 1.55, { hair: '#2f2a26', style: 'short', shirt: '#3b78e6' }) +
    tube('M26 74C38 66 60 66 78 76', SKIN, 6) +
    tube('M74 80C62 72 40 72 22 82', SKIN, 6) +
    `<path d="M50 20C44 10 34 16 40 24L50 32L60 24C66 16 56 10 50 20Z" fill="#ff5c70"/>`,
  업다:
    person(66, 54, 0.95, { hair: '#5a3b24', style: 'pony', shirt: '#ffc933' }) +
    tube('M74 54L82 76', '#3b78e6', 6) +
    tube('M64 54L70 78', '#3b78e6', 6) +
    person(42, 96, 1.6, { hair: '#2f2a26', style: 'short', shirt: '#43b04a' }) +
    tube('M58 40L44 64', SKIN, 5) +
    tube('M58 80L74 74', SKIN, 5),
  당기다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    stick(22, 34, 'M0 10L10 34M3 17L28 24M3 17L28 30M10 34L2 58M10 34L22 58', 1) +
    stickFace(22, 34) +
    `<path d="M50 27L76 60" stroke="#c9913a" stroke-width="4"/>` +
    `<rect x="70" y="58" width="24" height="24" rx="3" fill="#b5793a"/><circle cx="76" cy="86" r="5" fill="#8a96b0"/><circle cx="88" cy="86" r="5" fill="#8a96b0"/>` +
    `<path d="M80 18H46M54 10l-8 8 8 8" stroke="${ARROW}" stroke-width="5"/>`,
  누르다:
    `<rect x="16" y="72" width="68" height="18" rx="4" fill="#8a96b0"/>` +
    `<path d="M28 72V66C28 58 72 58 72 66V72Z" fill="#e8553d"/>` +
    `<path d="M18 56l-8-4M16 66H6M82 56l8-4M84 66h10" stroke="${MOVE}" stroke-width="3"/>` +
    `<rect x="42" y="18" width="15" height="44" rx="7.5" fill="${SKIN}"/>` +
    `<rect x="40" y="4" width="36" height="30" rx="12" fill="${SKIN}"/>` +
    `<path d="M58 22V34M67 20V32" stroke-width="3"/>` +
    `<path d="M40 12C30 14 30 26 42 26" fill="${SKIN}"/>`,
  자르다:
    `<rect x="6" y="22" width="60" height="62" rx="2" fill="#fff"/>` +
    `<path d="M6 53H34" stroke-width="3"/><path d="M34 53H66" stroke="${MOVE}" stroke-width="3" stroke-dasharray="5 5"/>` +
    `<path d="M34 53L74 42L78 48Z" fill="#dfe8f5"/><path d="M34 53L74 64L78 58Z" fill="#dfe8f5"/>` +
    `<circle cx="84" cy="38" r="9" fill="#e8553d"/><circle cx="84" cy="68" r="9" fill="#e8553d"/>` +
    `<circle cx="84" cy="38" r="3.5" fill="#fff7e0"/><circle cx="84" cy="68" r="3.5" fill="#fff7e0"/>` +
    dot(62, 53, 2.8),
  붙이다:
    `<rect x="10" y="28" width="66" height="64" rx="2" fill="#fff" transform="rotate(-6 43 60)"/>` +
    `<path d="M30 70C24 62 16 70 22 76L30 82L38 76C44 70 36 62 30 70Z" fill="#ff5c70"/>` +
    `<path d="M52 44L57 55L69 56L60 63L63 75L52 69L41 75L44 63L35 56L47 55Z" fill="#ffd23f"/>` +
    tube('M92 6L66 44', SKIN, 12) +
    `<path d="M76 36l6 6" stroke-width="2.5"/>` +
    `<path d="M76 58l8 4M72 70l8 8" stroke="${MOVE}" stroke-width="3"/>`,
  접다:
    `<path d="M14 20H50L86 56V92H14Z" fill="#7ec8f0"/>` +
    `<path d="M50 20L86 56H50Z" fill="#dff2fc"/>` +
    `<path d="M50 20V56" stroke-width="3" stroke-dasharray="5 4"/>` +
    `<path d="M88 44C92 30 84 14 66 10" stroke="${ARROW}" stroke-width="4"/><path d="M82 38L88 46L94 38" stroke="${ARROW}" stroke-width="4"/>` +
    tube('M4 96L40 70', SKIN, 12),
  쌓다:
    `<path d="M4 94H96"/>` +
    `<rect x="46" y="74" width="30" height="20" rx="2" fill="#3b78e6"/><rect x="48" y="54" width="26" height="20" rx="2" fill="#e8553d"/>` +
    `<rect x="46" y="34" width="30" height="20" rx="2" fill="#43b04a"/>` +
    `<rect x="50" y="6" width="22" height="18" rx="2" fill="#ffd23f"/>` +
    `<path d="M61 26V32" stroke="${ARROW}" stroke-width="3"/>` +
    stick(20, 40, 'M0 10V36M0 16L30 -14M0 16L30 -20M0 36L-8 58M0 36L8 58', 0.95) +
    stickFace(20, 40),
  줍다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    stick(58, 42, 'M-6 8L-34 4M-8 9L-2 32M-8 9L4 30M-34 4L-38 48M-34 4L-26 48', 1) +
    stickFace(58, 42) +
    `<circle cx="60" cy="82" r="9" fill="#e8553d"/><path d="M52 78C56 82 64 82 68 78" stroke="#fff" stroke-width="3"/>` +
    `<path d="M84 84V56M76 64l8-8 8 8" stroke="${ARROW}" stroke-width="5"/>`,
  숨다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    person(70, 94, 1.4, { hair: HAIR, style: 'short', shirt: '#e8553d' }) +
    `<rect x="28" y="46" width="30" height="48" fill="#9a5b2e"/>` +
    blob('#43b04a', [
      [26, 28, 18],
      [46, 18, 18],
      [62, 26, 14],
      [38, 40, 14],
    ]) +
    `<circle cx="58" cy="64" r="5" fill="${SKIN}"/>`,
  찾다:
    person(34, 96, 1.55, { hair: HAIR, style: 'short', shirt: '#ff9f1a' }) +
    tube('M48 72L60 62', SKIN, 6) +
    tube('M60 62L72 50', '#6b3e26', 7) +
    `<circle cx="74" cy="34" r="18" fill="#bfe6fb" stroke-width="6"/>` +
    `<path d="M66 28q4-6 10-6" stroke="#fff" stroke-width="3"/>` +
    `<path d="M70 84c2-4 6-4 8 0M84 88c2-4 6-4 8 0" stroke="#9a5b2e" stroke-width="3"/>`,
  세수하다:
    drop(22, 14, 0.7) +
    drop(78, 12, 0.7) +
    drop(50, 4, 0.6) +
    `<circle cx="50" cy="42" r="22" fill="${SKIN}"/><path d="M28 38C28 22 40 18 50 18S72 22 72 38C66 30 58 28 50 28S34 30 28 38Z" fill="${HAIR}"/>` +
    `<path d="M38 44q4 3 8 0M54 44q4 3 8 0" stroke-width="3"/>` +
    `<ellipse cx="26" cy="54" rx="7" ry="11" fill="${SKIN}" transform="rotate(20 26 54)"/><ellipse cx="74" cy="54" rx="7" ry="11" fill="${SKIN}" transform="rotate(-20 74 54)"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="3"><circle cx="40" cy="56" r="5"/><circle cx="60" cy="58" r="4"/><circle cx="50" cy="64" r="4"/></g>` +
    `<path d="M8 72H92C90 92 10 92 8 72Z" fill="#fff"/>` +
    `<path d="M40 80H60" stroke="#7ec8f0" stroke-width="5"/>`,
  목욕하다:
    `<circle cx="42" cy="34" r="15" fill="${SKIN}"/><path d="M27 32C27 20 34 18 42 18S57 20 57 30C52 26 48 25 42 26S32 27 27 32Z" fill="${HAIR}"/>` +
    `<path d="M35 36q3 3 6 0M45 36q3 3 6 0" stroke-width="2.5"/><path d="M38 42q4 3 8 0" stroke-width="2.5"/>` +
    `<path d="M20 90V96M80 90V96" stroke-width="5"/>` +
    `<path d="M8 56H92V68C92 82 82 90 70 90H30C18 90 8 82 8 68Z" fill="#fff"/>` +
    blob('#dff2fc', [
      [16, 52, 7],
      [28, 50, 9],
      [44, 52, 8],
      [58, 50, 9],
      [72, 52, 8],
      [84, 50, 7],
    ]) +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="3"><circle cx="70" cy="30" r="6"/><circle cx="82" cy="18" r="5"/><circle cx="16" cy="28" r="5"/></g>` +
    `<path d="M68 42C68 36 76 36 76 42C80 42 82 46 80 48H66C64 46 64 42 68 42Z" fill="#ffd23f" stroke-width="2.5"/>`,
  양치하다: moodFace(
    dot(38, 50) +
      dot(62, 50) +
      `<path d="M32 64H68C68 82 32 82 32 64Z" fill="#c62f3f"/><path d="M34 64H66V70H34Z" fill="#fff" stroke-width="2.5"/>` +
      tube('M50 70L94 76', '#3b8fe0', 7) +
      `<rect x="36" y="62" width="18" height="8" rx="2" fill="#fff" transform="rotate(8 45 66)"/>` +
      `<g fill="#fff" stroke="#7ec8f0" stroke-width="2.5"><circle cx="28" cy="72" r="4"/><circle cx="24" cy="80" r="3"/></g>` +
      cheeks(62, 24),
  ),
  요리하다:
    `<path d="M34 6C24 6 24 20 34 20H66C76 20 76 6 66 6C64 0 56 0 50 4C44 0 36 0 34 6Z" fill="#fff"/>` +
    person(50, 76, 1.5, { hair: HAIR, style: 'short', shirt: '#fff' }) +
    `<path d="M36 22H64" stroke-width="3"/>` +
    tube('M60 62L70 46', '#b5793a', 5) +
    `<path d="M20 64H80V84C80 92 72 94 64 94H36C28 94 20 92 20 84Z" fill="#8a96b0"/>` +
    `<path d="M14 66H24M76 66H86" stroke-width="6"/>` +
    `<path d="M20 64H80" stroke-width="5"/>` +
    `<path d="M30 58c-4-6 4-8 0-14M86 44c-4-6 4-8 0-14" stroke="${MOVE}" stroke-width="3"/>`,
  청소하다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    person(28, 94, 1.5, { hair: '#3a2418', style: 'pony', shirt: '#8e4fc9' }) +
    tube('M34 66L48 60', SKIN, 5) +
    `<path d="M48 60L76 82" stroke="#8a96b0" stroke-width="6"/>` +
    `<rect x="42" y="52" width="12" height="12" rx="3" fill="#e8553d"/>` +
    `<path d="M64 80H94C96 80 96 92 94 92H64C62 92 62 80 64 80Z" fill="#e8553d"/>` +
    `<ellipse cx="80" cy="54" rx="11" ry="9" fill="#e8553d"/><path d="M72 60C66 70 60 70 54 64" stroke="#8a96b0" stroke-width="4"/>` +
    `<circle cx="80" cy="54" r="3" fill="#fff" stroke="none"/>` +
    sparkle(54, 88, 4, '#b5c0d8'),
  듣다:
    `<circle cx="42" cy="54" r="30" fill="${SKIN}"/>` +
    `<path d="M12 50C11 28 26 22 42 22S73 28 72 48C66 40 56 36 42 36S18 40 12 50Z" fill="${HAIR}"/>` +
    `<path d="M30 54q4-5 8 0M46 54q4-5 8 0" stroke-width="3.5"/><path d="M34 70q8 6 16 0" stroke-width="3.5"/>` +
    `<ellipse cx="72" cy="58" rx="8" ry="11" fill="${SKIN}"/>` +
    `<path d="M80 40C72 42 70 50 72 64C74 72 78 76 82 74L84 42Z" fill="${SKIN}"/>` +
    `<path d="M86 30q8 18 0 36" stroke="${ARROW}" stroke-width="4"/><path d="M92 38q4 10 0 20" stroke="${ARROW}" stroke-width="4"/>`,
  말하다:
    `<circle cx="32" cy="66" r="24" fill="${SKIN}"/><path d="M8 62C8 46 20 42 32 42S56 46 56 60C50 54 42 52 32 52S14 54 8 62Z" fill="${HAIR}"/>` +
    dot(24, 66, 2.6) +
    dot(40, 66, 2.6) +
    `<ellipse cx="34" cy="78" rx="6" ry="5" fill="#c62f3f"/>` +
    `<path d="M50 8H90C94 8 96 10 96 14V42C96 46 94 48 90 48H64L50 60L54 48H50C46 48 44 46 44 42V14C44 10 46 8 50 8Z" fill="#fff"/>` +
    `<path d="M54 22c4-4 8 4 12 0s8 4 12 0 8 4 8 0M54 34c4-4 8 4 12 0s8 4 12 0" stroke="${ARROW}" stroke-width="3.5"/>`,
  박수치다:
    handAt('translate(38 94) rotate(24) scale(0.62) translate(-52 -90)') +
    handAt('translate(62 94) rotate(-24) scale(-0.62 0.62) translate(-52 -90)') +
    `<path d="M50 6V16M34 12l4 8M66 12l-4 8M22 26l8 4M78 26l-8 4" stroke="#ff9f1a" stroke-width="4"/>` +
    sparkle(14, 50, 6) +
    sparkle(86, 50, 6),
  인사하다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    stick(66, 56, 'M-8 -6L-32 -14M-32 -14L-34 36M-32 -14L-26 36M-10 -5L-8 18', 1) +
    `<path d="M62 52q2-4 6-2M70 58q4 1 6-2" stroke-width="2.5"/>` +
    `<path d="M64 20C76 20 84 28 84 42" stroke="${ARROW}" stroke-width="4"/><path d="M78 36L84 44L90 36" stroke="${ARROW}" stroke-width="4"/>`,
  뽀뽀하다:
    `<circle cx="66" cy="58" r="26" fill="${SKIN}"/><path d="M40 54C40 36 52 30 66 30S92 36 92 52C86 44 76 42 66 42S46 44 40 54Z" fill="#3a2418"/>` +
    `<path d="M58 58q4-4 8 0M72 58q4-4 8 0" stroke-width="3"/><path d="M64 72q5 3 10 0" stroke-width="3"/>` +
    `<circle cx="50" cy="68" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<circle cx="22" cy="60" r="20" fill="${SKIN}"/><path d="M2 56C2 44 12 40 22 40S42 44 42 54C36 50 30 48 22 48S8 50 2 56Z" fill="${HAIR}"/>` +
    `<path d="M22 60q4-4 8 0" stroke-width="3"/>` +
    `<ellipse cx="42" cy="68" rx="5" ry="4" fill="#ff5c70"/>` +
    `<path d="M44 20C40 12 30 16 34 24L44 32L54 24C58 16 48 12 44 20Z" fill="#ff5c70"/>` +
    `<path d="M62 14C60 10 55 12 57 16L62 20L67 16C69 12 64 10 62 14Z" fill="#ff9aa8"/>`,
  수영하다:
    `<circle cx="36" cy="50" r="13" fill="${SKIN}"/><path d="M23 48C23 36 30 36 36 36S49 38 49 46C44 42 40 42 36 42S27 44 23 48Z" fill="#e8553d"/>` +
    dot(32, 52, 2.2) +
    dot(42, 52, 2.2) +
    tube('M48 60C56 40 66 30 80 32', SKIN, 7) +
    `<path d="${waterTop(62)}" fill="#7ec8f0"/>` +
    `<path d="M14 76q6-4 12 0M60 80q6-4 12 0" stroke="#fff" stroke-width="3"/>` +
    drop(86, 44, 0.6) +
    drop(92, 56, 0.5) +
    drop(16, 38, 0.6),
  넘어지다:
    `<path d="M4 88H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<ellipse cx="12" cy="84" rx="8" ry="5" fill="#8a96b0"/>` +
    stick(80, 74, 'M-10 2L-34 6M-14 3L-4 12M-14 3L-2 10M-34 6L-46 -12M-34 6L-52 -4', 1.3) +
    dot(78, 72, 1.8) +
    dot(85, 70, 1.8) +
    `<circle cx="86" cy="77" r="2.5" fill="${INK}" stroke="none"/>` +
    `<path d="M68 52l-2-8M80 50l2-8M92 56l4-6" stroke="${MOVE}" stroke-width="3"/>`,
  흔들다:
    person(40, 96, 1.6, { hair: HAIR, style: 'pony', shirt: '#43b04a' }) +
    tube('M52 70L70 36', SKIN, 6) +
    `<circle cx="72" cy="30" r="9" fill="${SKIN}"/>` +
    `<path d="M84 18q6 10 0 22M90 12q10 16 0 34M60 14q-4-6 2-10" stroke="${MOVE}" stroke-width="3"/>`,
  두드리다:
    `<rect x="8" y="6" width="48" height="90" fill="#b5793a" stroke-width="5"/>` +
    `<rect x="16" y="14" width="32" height="30" rx="2" fill="#c98f52"/><rect x="16" y="54" width="32" height="34" rx="2" fill="#c98f52"/>` +
    dot(48, 56, 3.5, '#ffd23f') +
    `<path d="M62 22l-4-6M60 44h-4M62 66l-4 6" stroke="#ff9f1a" stroke-width="4"/>` +
    `<path d="M92 50H80" stroke="#3b78e6" stroke-width="14"/>` +
    `<rect x="60" y="34" width="24" height="30" rx="8" fill="${SKIN}"/><path d="M60 42H72M60 50H72M60 58H72" stroke-width="2.5"/>` +
    `<path d="M90 30l-4 6M92 70l-4-6" stroke="${MOVE}" stroke-width="3"/>`,
  불다:
    `<circle cx="26" cy="36" r="20" fill="${SKIN}"/><path d="M6 34C6 20 14 16 26 16S46 20 46 32C40 26 34 25 26 25S12 28 6 34Z" fill="${HAIR}"/>` +
    `<path d="M22 36q3-3 6 0M32 36q3-3 6 0" stroke-width="2.5"/>` +
    `<circle cx="46" cy="44" r="4" fill="#ff5c70"/>` +
    `<path d="M54 42h12M52 50h16M54 34h10" stroke="${MOVE}" stroke-width="3"/>` +
    `<path d="M28 76H92V94H28Z" fill="#ff9aa8"/><path d="M28 70H92V80C84 84 76 78 68 82S52 78 44 82S30 80 28 80Z" fill="#fff"/>` +
    `<path d="M44 70V56M60 70V56M76 70V56" stroke="#7ec8f0" stroke-width="5"/>` +
    `<path d="M44 54C50 52 52 46 50 42C46 44 42 50 44 54ZM60 54C66 52 68 46 66 42C62 44 58 50 60 54ZM76 54C82 52 84 46 82 42C78 44 74 50 76 54Z" fill="#ff9f1a" stroke-width="2.5"/>`,
  씹다: moodFace(
    `<path d="M32 52q6-5 12 0M56 52q6-5 12 0" stroke-width="4"/>` +
      `<ellipse cx="66" cy="70" rx="12" ry="9" fill="${SKIN}" stroke="none"/>` +
      `<path d="M38 72q6-4 12 0t12 0" stroke-width="3.5"/>` +
      `<circle cx="70" cy="66" r="7" fill="#ff9aa8"/>` +
      `<path d="M14 72l-6 4M16 82l-6 6M86 72l6 4M84 82l6 6" stroke="${MOVE}" stroke-width="3"/>`,
  ),
  일어나다:
    blob('#ffd23f', [[86, 14, 8]]) +
    `<path d="M86 28v4M72 14h-4" stroke="#ff9f1a" stroke-width="3"/>` +
    `<path d="M8 40V92M92 60V92" stroke="#6b3e26" stroke-width="6"/>` +
    `<rect x="8" y="64" width="84" height="14" rx="3" fill="#b5793a"/>` +
    `<rect x="36" y="44" width="22" height="22" rx="6" fill="#ffc933"/>` +
    tube('M40 48L28 20', SKIN, 5) +
    tube('M54 48L66 20', SKIN, 5) +
    `<circle cx="47" cy="32" r="12" fill="${SKIN}"/><path d="M35 30C35 20 42 18 47 18S59 20 59 28C55 25 51 24 47 24S39 26 35 30Z" fill="${HAIR}"/>` +
    `<path d="M41 32q2 2 4 0M49 32q2 2 4 0" stroke-width="2.5"/><ellipse cx="47" cy="38" rx="3" ry="2.5" fill="#c62f3f" stroke-width="2"/>` +
    `<path d="M40 60H90V66C90 70 88 72 84 72H40Z" fill="#7a8fe0"/>`,
  색칠하다:
    `<rect x="6" y="18" width="70" height="72" rx="2" fill="#fff"/>` +
    `<path d="M16 34C30 30 36 40 50 34M16 46C30 42 40 52 56 44M16 58C28 54 38 64 50 58" stroke="#e8553d" stroke-width="7"/>` +
    `<path d="M18 72h20" stroke="#43b04a" stroke-width="7"/><path d="M44 74h14" stroke="#3b78e6" stroke-width="7"/>` +
    `<g transform="rotate(35 70 48)"><rect x="63" y="6" width="14" height="44" rx="2" fill="#e8553d"/><rect x="63" y="20" width="14" height="14" fill="#fff" stroke-width="2.5"/><path d="M63 50L70 62L77 50Z" fill="#e8553d"/></g>`,
  심다:
    `<path d="M6 76C20 64 80 64 94 76V96H6Z" fill="#9a5b2e"/>` +
    `<path d="M50 70V46" stroke="#3a9e47" stroke-width="5"/>` +
    `<path d="M50 52C40 50 34 42 34 34C44 36 50 42 50 52Z" fill="#5fc24a"/><path d="M50 48C58 44 66 36 66 28C56 30 50 38 50 48Z" fill="#5fc24a"/>` +
    `<ellipse cx="24" cy="66" rx="14" ry="9" fill="${SKIN}" transform="rotate(-20 24 66)"/><ellipse cx="76" cy="66" rx="14" ry="9" fill="${SKIN}" transform="rotate(20 76 66)"/>` +
    `<path d="M4 58L14 60M96 58l-10 2" stroke="#3b78e6" stroke-width="10"/>`,
  따다:
    `<path d="M4 16C30 12 60 20 96 10" stroke="#6b3e26" stroke-width="7"/>` +
    `<path d="M28 16C22 8 14 8 10 12C16 18 22 18 28 16Z" fill="#43b04a"/><path d="M80 14C84 4 92 4 96 6C92 14 86 16 80 14Z" fill="#43b04a"/>` +
    `<path d="M56 18V28" stroke="#6b3e26" stroke-width="4"/>` +
    `<circle cx="56" cy="44" r="18" fill="#e8553d"/><path d="M50 36q-4 4-2 10" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="20" cy="36" r="10" fill="#e8553d"/><path d="M20 18V26" stroke="#6b3e26" stroke-width="3"/>` +
    `<path d="M48 96V80C40 74 38 64 42 58C46 54 50 58 52 64L54 68Z" fill="${SKIN}"/>` +
    `<rect x="50" y="54" width="10" height="26" rx="5" fill="${SKIN}"/><rect x="60" y="52" width="10" height="28" rx="5" fill="${SKIN}"/><rect x="70" y="56" width="9" height="24" rx="4.5" fill="${SKIN}"/>` +
    `<path d="M48 76H80V96H48Z" fill="${SKIN}"/>` +
    `<path d="M80 50l8-4M80 60h10" stroke="${MOVE}" stroke-width="3"/>`,
  낚시하다:
    `<path d="${waterTop(70)}" fill="#7ec8f0"/>` +
    `<rect x="4" y="58" width="36" height="10" fill="#b5793a"/>` +
    person(22, 60, 1.1, { hair: HAIR, style: 'short', shirt: '#ffc933', cap: '#e8553d' }) +
    `<path d="M28 48L78 10" stroke="#6b3e26" stroke-width="4"/>` +
    `<path d="M78 10V56" stroke="${INK}" stroke-width="1.8"/>` +
    `<path d="M62 70C66 58 86 58 90 66L96 60V76L90 70C86 78 66 78 62 70Z" fill="#ff9f1a" transform="rotate(-20 78 68)"/>` +
    dot(70, 66, 2),
  운전하다:
    `<path d="M20 96V58C20 44 32 38 50 38S80 44 80 58V96Z" fill="#43b04a"/>` +
    `<circle cx="50" cy="20" r="14" fill="${SKIN}"/><path d="M36 18C36 6 44 4 50 4S64 6 64 18C60 12 56 11 50 11S40 12 36 18Z" fill="${HAIR}"/>` +
    dot(45, 21, 2.2) +
    dot(55, 21, 2.2) +
    `<path d="M46 27q4 3 8 0" stroke-width="2.5"/>` +
    `<circle cx="50" cy="72" r="26" fill="none" stroke="${INK}" stroke-width="13"/><circle cx="50" cy="72" r="26" fill="none" stroke="#5b6680" stroke-width="7"/>` +
    `<path d="M26 72H74M50 72V98" stroke="#5b6680" stroke-width="6"/>` +
    `<circle cx="50" cy="72" r="7" fill="#8a96b0"/>` +
    `<circle cx="26" cy="64" r="7" fill="${SKIN}"/><circle cx="74" cy="64" r="7" fill="${SKIN}"/>`,
  꿈꾸다:
    `<rect x="4" y="66" width="60" height="22" rx="11" fill="#dfe8f5"/>` +
    `<circle cx="32" cy="66" r="20" fill="${SKIN}"/><path d="M12 62C12 50 22 46 32 46S52 50 52 60C46 56 40 54 32 54S18 56 12 62Z" fill="${HAIR}"/>` +
    `<path d="M22 68q4 4 8 0M36 68q4 4 8 0" stroke-width="3"/>` +
    `<path d="M4 88H96V96H4Z" fill="#7a8fe0"/>` +
    `<circle cx="54" cy="48" r="3" fill="#fff"/><circle cx="60" cy="40" r="4.5" fill="#fff"/>` +
    blob('#fff', [
      [70, 22, 12],
      [84, 20, 11],
      [78, 32, 11],
      [64, 30, 9],
      [90, 30, 8],
    ]) +
    `<path d="M72 18A7 7 0 1 0 78 30A6 6 0 1 1 72 18Z" fill="#ffd23f" stroke-width="2.5"/>` +
    sparkle(86, 24, 5),
};
