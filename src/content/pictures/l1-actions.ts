import { INK, SKIN, HL, dot, ring, stick, person, moodFace, sparkle, tube, drop, cheeks } from '../pictureKit.ts';

/** 음표 (춤추다·노래하다) */
const note = (x: number, y: number, fill: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${fill}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 5} ${y - 1}V${y - 20}q6 3 8 9" stroke="${fill}" stroke-width="4"/>`;

/** 막대 흔들림 선 (떨다) */
const shake = (x: number, y: number, dir: 1 | -1) =>
  `<path d="M${x} ${y}l${4 * dir} 5l${-4 * dir} 5l${4 * dir} 5" stroke="#9aa6c4" stroke-width="3"/>`;

/** 얼굴 (moodFace 모양, 살색만 바꿀 수 있게) */
const headOf = (skin: string) =>
  `<circle cx="50" cy="54" r="32" fill="${skin}"/>` +
  `<path d="M18 50C17 26 33 20 50 20S83 26 82 50C76 40 64 35 50 35S24 40 18 50Z" fill="#5a3b24"/>`;

export const PICS: Record<string, string> = {
  // ── 행동 ──
  먹다:
    `<path d="M58 72H96C96 88 88 95 77 95C66 95 58 88 58 72Z" fill="#3b78e6"/><path d="M60 72C60 60 94 60 94 72Z" fill="#fff"/>` +
    `<circle cx="34" cy="42" r="25" fill="${SKIN}"/><path d="M9 40C9 20 22 16 34 16S59 20 59 36C53 28 44 26 34 26S15 30 9 40Z" fill="#5a3b24"/>` +
    dot(27, 41) +
    dot(41, 41) +
    `<circle cx="22" cy="52" r="4.5" fill="#ff9aa8" stroke="none" opacity=".6"/>` +
    `<ellipse cx="45" cy="55" rx="6" ry="6" fill="#c62f3f"/>` +
    tube('M60 55L88 40', '#dfe8f5', 4) +
    `<ellipse cx="58" cy="57" rx="9" ry="6" fill="#dfe8f5"/><ellipse cx="58" cy="52" rx="7" ry="4.5" fill="#fff"/>` +
    `<circle cx="88" cy="40" r="7" fill="${SKIN}"/>`,
  웃다: moodFace(
    `<path d="M32 49l11 5-11 5M68 49l-11 5 11 5" stroke-width="4"/>` +
      `<path d="M28 64H72C72 92 28 92 28 64Z" fill="#c62f3f"/><path d="M38 80C42 86 58 86 62 80C58 76 42 76 38 80Z" fill="#ff8aa0" stroke="none"/>` +
      `<path d="M30 64H70" stroke-width="3"/>` +
      cheeks(64, 26),
  ) + `<path d="M6 30l8 6M4 46h9M6 62l8-4M94 30l-8 6M96 46h-9M94 62l-8-4" stroke="#ff9f1a" stroke-width="4"/>`,
  울다: moodFace(
    `<path d="M32 48l12-4M68 48l-12-4" stroke-width="3"/><path d="M33 56q6-5 12 0M55 56q6-5 12 0" stroke-width="4"/>` +
      `<path d="M38 60C36 70 34 78 32 90M62 60C64 70 66 78 68 90" stroke="#4aa8f0" stroke-width="7"/>` +
      `<path d="M42 70C42 84 58 84 58 70C54 74 46 74 42 70Z" fill="#c62f3f"/>`,
  ) + drop(14, 58, 0.8) + drop(86, 58, 0.8) + drop(10, 78, 0.6) + drop(90, 78, 0.6),
  걷다: `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<ellipse cx="10" cy="86" rx="6" ry="3.5" fill="#b08a5c" stroke="none"/><ellipse cx="22" cy="80" rx="6" ry="3.5" fill="#b08a5c" stroke="none"/>` +
    `<ellipse cx="34" cy="86" rx="6" ry="3.5" fill="#b08a5c" stroke="none"/><ellipse cx="46" cy="80" rx="6" ry="3.5" fill="#b08a5c" stroke="none"/>` +
    stick(68, 26, 'M0 10L0 36M0 17L-9 32M0 17L10 31M0 36L-9 62M0 36L10 62'),
  서다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    stick(34, 20, 'M0 10V42M0 18L-8 38M0 18L8 38M0 42L-6 70M0 42L6 70') +
    `<path d="M66 40V92M92 92V66" stroke="#9a5b2e" stroke-width="5"/><rect x="62" y="36" width="8" height="34" rx="3" fill="#b5793a"/><rect x="62" y="62" width="32" height="8" rx="3" fill="#b5793a"/>`,
  씻다: drop(34, 6, 0.7) +
    drop(52, 2, 0.7) +
    drop(68, 8, 0.7) +
    `<path d="M26 98V84H74V98" fill="#3b78e6"/>` +
    `<ellipse cx="30" cy="66" rx="5" ry="11" fill="${SKIN}" transform="rotate(-30 30 66)"/><ellipse cx="70" cy="66" rx="5" ry="11" fill="${SKIN}" transform="rotate(30 70 66)"/>` +
    `<path d="M32 86V44C32 34 50 34 50 44V86Z" fill="${SKIN}"/><path d="M68 86V44C68 34 50 34 50 44V86Z" fill="${SKIN}"/>` +
    `<path d="M41 38V52M59 38V52" stroke-width="2.5"/>` +
    `<g fill="#fff" stroke="#7ec8f0" stroke-width="3"><circle cx="22" cy="40" r="8"/><circle cx="16" cy="56" r="5"/><circle cx="78" cy="38" r="9"/><circle cx="88" cy="54" r="5"/><circle cx="50" cy="28" r="7"/><circle cx="42" cy="64" r="7"/><circle cx="56" cy="72" r="6"/><circle cx="14" cy="80" r="5"/><circle cx="86" cy="80" r="6"/></g>`,
  쓰다:
    `<rect x="8" y="10" width="62" height="80" rx="3" fill="#fff" transform="rotate(-6 39 50)"/>` +
    `<g stroke="#3b78e6" stroke-width="3.5" transform="rotate(-6 39 50)"><path d="M18 28c4-6 8 6 12 0s8 6 12 0 8 6 12 0"/><path d="M18 46c4-6 8 6 12 0s8 6 12 0 8 6 12 0"/><path d="M18 64c4-6 8 6 12 0"/></g>` +
    `<g transform="rotate(40 56 64)"><rect x="50" y="10" width="14" height="50" fill="#ffd23f"/><rect x="50" y="2" width="14" height="10" rx="3" fill="#ff9aa8"/><path d="M50 60L57 76L64 60Z" fill="${SKIN}"/><path d="M55 71L57 76L59 71Z" fill="${INK}"/></g>`,
  춤추다:
    `<ellipse cx="44" cy="92" rx="18" ry="3.5" fill="#d0d6e6" stroke="none"/>` +
    stick(42, 22, 'M0 10L4 36M1 17L-12 6L-16 -6M1 17L14 24L22 16M4 36L-8 56L-6 68M4 36L22 44L32 40', 1) +
    note(80, 32, '#8e4fc9') +
    note(14, 50, '#3b78e6') +
    note(84, 72, '#e85d9a'),
  노래하다:
    `<circle cx="40" cy="54" r="30" fill="${SKIN}"/><path d="M10 50C9 28 24 22 40 22S71 28 70 48C64 40 54 36 40 36S16 40 10 50Z" fill="#5a3b24"/>` +
    `<path d="M24 54q6-6 12 0M44 54q6-6 12 0" stroke-width="4"/>` +
    `<ellipse cx="40" cy="72" rx="8" ry="9" fill="#c62f3f"/>` +
    cheeks(64, 22, 40) +
    note(80, 30, '#8e4fc9') +
    note(88, 58, '#3b78e6') +
    note(72, 86, '#e85d9a'),
  타다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M24 66C18 70 14 80 12 86" stroke="#6b3e26" stroke-width="7"/>` +
    `<path d="M32 70V92M44 72V92M64 72V92M74 70V92" stroke="#9a5b2e" stroke-width="7"/>` +
    `<ellipse cx="52" cy="64" rx="30" ry="14" fill="#b5793a"/>` +
    `<path d="M70 58L80 28C82 24 86 22 90 26L96 38C96 42 92 44 88 42L82 40L80 62Z" fill="#b5793a"/>` +
    `<path d="M80 24C74 30 72 40 70 48" stroke="#6b3e26" stroke-width="6"/>` +
    dot(86, 31, 2.2) +
    person(52, 54, 0.9, { hair: '#5a3b24', style: 'short', shirt: '#e8553d' }) +
    tube('M56 58L60 76', '#3b78e6', 5),
  잡다:
    `<path d="M76 12C86 16 92 24 94 34M68 6C82 8 92 16 96 26" stroke="#9aa6c4" stroke-width="3"/>` +
    `<circle cx="52" cy="40" r="26" fill="#e8553d"/><path d="M28 34C42 42 62 42 76 34M52 14V66" stroke="#fff" stroke-width="3"/>` +
    `<path d="M32 98V80C24 72 22 62 26 56C30 52 34 56 36 62L38 66Z" fill="${SKIN}"/>` +
    `<rect x="34" y="50" width="11" height="30" rx="5.5" fill="${SKIN}"/><rect x="45" y="46" width="11" height="34" rx="5.5" fill="${SKIN}"/>` +
    `<rect x="56" y="48" width="11" height="32" rx="5.5" fill="${SKIN}"/><rect x="67" y="54" width="10" height="26" rx="5" fill="${SKIN}"/>` +
    `<path d="M32 76H78V98H32Z" fill="${SKIN}"/>`,
  열다:
    `<path d="M4 20L20 30M4 50H18M4 80L20 72" stroke="${HL}" stroke-width="5"/>` +
    `<rect x="24" y="8" width="46" height="86" fill="#fff1b8"/><path d="M28 94L70 94L70 8" fill="#ffd23f" stroke="none" opacity=".6"/>` +
    `<rect x="24" y="8" width="46" height="86" fill="none" stroke-width="5"/>` +
    `<path d="M70 8L92 2V98L70 94Z" fill="#b5793a"/>` +
    dot(86, 52, 3.5, '#ffd23f') +
    `<circle cx="90" cy="58" r="7" fill="${SKIN}"/>`,
  닫다:
    `<rect x="20" y="8" width="50" height="86" fill="#9a5b2e" stroke-width="5"/>` +
    `<rect x="24" y="12" width="42" height="78" fill="#b5793a"/><rect x="32" y="20" width="26" height="24" rx="2" fill="#c98f52"/><rect x="32" y="54" width="26" height="28" rx="2" fill="#c98f52"/>` +
    dot(60, 52, 4, '#ffd23f') +
    `<path d="M92 30C92 42 88 50 78 54" stroke="#3b78e6" stroke-width="6"/><path d="M76 44L76 56L88 58" stroke="#3b78e6" stroke-width="6"/>` +
    `<circle cx="72" cy="70" r="8" fill="${SKIN}"/><path d="M80 70H96" stroke="#3b78e6" stroke-width="7"/>`,
  밀다:
    `<path d="M4 92H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<path d="M2 36H10M4 48H12M2 60H10" stroke="#9aa6c4" stroke-width="3"/>` +
    stick(30, 30, 'M0 10L-8 34M-2 17L22 20M-2 17L22 26M-8 34L-18 60M-8 34L6 60') +
    `<path d="M52 44L58 48" stroke-width="5"/><path d="M56 46H94L90 76H60Z" fill="#43b04a"/>` +
    `<circle cx="66" cy="84" r="7" fill="#8a96b0"/><circle cx="86" cy="84" r="7" fill="#8a96b0"/>`,

  // ── 상태 ──
  작다:
    `<path d="M4 90H96"/>` +
    `<path d="M22 84V70M50 84V70" stroke="#8a96b0" stroke-width="12"/>` +
    `<ellipse cx="36" cy="56" rx="26" ry="20" fill="#b5c0d8"/>` +
    `<path d="M14 50C8 58 8 72 12 80" stroke="#8a96b0" stroke-width="9"/><path d="M14 50C8 58 8 72 12 80" stroke="#b5c0d8" stroke-width="3"/>` +
    `<circle cx="22" cy="44" r="16" fill="#b5c0d8"/><path d="M26 34C40 30 44 48 34 56C28 54 26 44 26 34Z" fill="#9aa8c4"/>` +
    dot(16, 42, 2.5) +
    `<circle cx="71" cy="72" r="6" fill="#ff9aa8"/><circle cx="89" cy="72" r="6" fill="#ff9aa8"/><circle cx="80" cy="81" r="9" fill="#b5b5c5"/>` +
    dot(76, 80, 1.8) +
    dot(84, 80, 1.8) +
    dot(80, 85, 1.8, '#ff5c70') +
    ring(80, 78, 17, 15) +
    `<path d="M80 44V58M73 52l7 7 7-7" stroke="#e8553d" stroke-width="4"/>`,
  길다:
    `<path d="M4 44H96M4 92H96" stroke="#9aa6c4" stroke-width="3"/>` +
    `<rect x="6" y="24" width="18" height="16" rx="3" fill="#e8553d"/><rect x="26" y="24" width="18" height="16" rx="3" fill="#3b78e6"/>` +
    `<rect x="46" y="24" width="18" height="16" rx="3" fill="#43b04a"/><rect x="66" y="24" width="18" height="16" rx="3" fill="#ffd23f"/>` +
    `<path d="M80 24V16H92V40H80Z" fill="#e8553d"/>` +
    `<circle cx="14" cy="42" r="3" fill="${INK}"/><circle cx="34" cy="42" r="3" fill="${INK}"/><circle cx="54" cy="42" r="3" fill="${INK}"/><circle cx="74" cy="42" r="3" fill="${INK}"/><circle cx="88" cy="42" r="3" fill="${INK}"/>` +
    `<path d="M10 10H86M16 4L10 10L16 16M80 4L86 10L80 16" stroke="#3b78e6" stroke-width="4"/>` +
    `<rect x="36" y="72" width="18" height="16" rx="3" fill="#3b78e6"/><path d="M56 72V64H68V88H56Z" fill="#e8553d"/>` +
    `<circle cx="44" cy="90" r="3" fill="${INK}"/><circle cx="62" cy="90" r="3" fill="${INK}"/>`,
  낮다:
    `<path d="M4 90H96"/>` +
    `<rect x="8" y="68" width="40" height="22" fill="#e8862e"/><path d="M8 79H48M22 68V79M36 79V90" stroke-width="2.5"/>` +
    `<rect x="60" y="18" width="30" height="72" fill="#c9b28a"/><path d="M60 36H90M60 54H90M60 72H90M75 18V36M70 36V54M80 54V72M75 72V90" stroke-width="2.5"/>` +
    ring(28, 78, 24, 16) +
    `<path d="M28 34V52M20 44l8 8 8-8" stroke="#3b78e6" stroke-width="5"/>`,
  높다:
    `<path d="M4 94H96"/>` +
    `<rect x="30" y="74" width="28" height="20" fill="#3b78e6"/><rect x="32" y="54" width="24" height="20" fill="#e8553d"/>` +
    `<rect x="30" y="34" width="28" height="20" fill="#43b04a"/><rect x="32" y="16" width="24" height="18" fill="#ffd23f"/>` +
    `<path d="M44 16V4" stroke-width="3"/><path d="M44 4L56 8L44 12Z" fill="#e8553d"/>` +
    `<path d="M80 88V14M70 26l10-12 10 12" stroke="#e8553d" stroke-width="6"/>` +
    `<rect x="8" y="80" width="14" height="14" fill="#8a96b0"/>`,
  차갑다:
    `<path d="M30 30C24 22 36 18 30 10M50 30C44 22 56 18 50 10M70 30C64 22 76 18 70 10" stroke="#7ec8f0" stroke-width="4"/>` +
    `<rect x="12" y="52" width="36" height="36" rx="6" fill="#bfe6fb"/><rect x="50" y="46" width="38" height="42" rx="6" fill="#7ec8f0"/><rect x="30" y="34" width="34" height="32" rx="6" fill="#bfe6fb"/>` +
    `<path d="M36 42l10 0M56 54v10M18 60v10" stroke="#fff" stroke-width="4"/>` +
    sparkle(10, 40, 6, '#3b8fe0') +
    sparkle(92, 36, 6, '#3b8fe0') +
    sparkle(92, 92, 4, '#3b8fe0'),
  무겁다:
    `<path d="M4 94H96" stroke="#c9b28a" stroke-width="3"/>` +
    `<rect x="24" y="8" width="52" height="34" rx="3" fill="#6b3e26"/><path d="M24 18H76" stroke="#5a3b24" stroke-width="3"/><path d="M42 26H58" stroke="#c98f52" stroke-width="4"/>` +
    stick(50, 54, 'M0 10V26M0 14L-18 4L-20 -12M0 14L18 4L20 -12M0 26L-16 32L-20 40M0 26L16 32L20 40') +
    drop(24, 50, 0.7) +
    drop(76, 50, 0.7) +
    `<path d="M10 22H18M82 22H90M12 34l6-2M88 34l-6-2" stroke="#9aa6c4" stroke-width="3"/>`,
  가볍다:
    `<path d="M14 86C24 70 40 94 50 78S74 80 84 66" stroke="#9aa6c4" stroke-width="3" stroke-dasharray="5 6"/>` +
    `<g transform="rotate(35 50 42)"><path d="M50 10C64 18 66 48 52 70C46 62 38 40 50 10Z" fill="#ffb3c7"/><path d="M50 12C50 36 52 60 50 82" stroke-width="3"/>` +
    `<path d="M52 30l8-4M51 44l10-5M51 58l8-5M50 36l-6-4M50 50l-7-5" stroke-width="2.5"/></g>` +
    `<path d="M8 30h10M12 42h8M82 22h10" stroke="#9aa6c4" stroke-width="3"/>`,
  슬프다: moodFace(
    `<path d="M32 48l12 -5M68 48l-12 -5" stroke-width="3"/>` +
      dot(39, 56) +
      dot(61, 56) +
      `<path d="M38 80q12-12 24 0" stroke-width="4"/>`,
  ) + drop(64, 60, 1.2),
  화나다:
    headOf('#ff8a70') +
    `<path d="M30 46l14 7M70 46l-14 7" stroke-width="5"/>` +
    dot(39, 60) +
    dot(61, 60) +
    `<path d="M38 80q12-10 24 0" stroke-width="4.5"/>` +
    `<path d="M8 22C4 16 10 10 14 14C16 8 24 10 22 16C26 18 24 26 18 24C14 28 8 26 8 22Z" fill="#fff" stroke="#9aa6c4" stroke-width="3"/>` +
    `<path d="M92 22C96 16 90 10 86 14C84 8 76 10 78 16C74 18 76 26 82 24C86 28 92 26 92 22Z" fill="#fff" stroke="#9aa6c4" stroke-width="3"/>`,
  무섭다: moodFace(
    `<path d="M30 42q8-6 14 0M56 42q6-6 14 0" stroke-width="3"/>` +
      `<circle cx="38" cy="55" r="8" fill="#fff"/><circle cx="62" cy="55" r="8" fill="#fff"/>` +
      dot(38, 56, 2.6) +
      dot(62, 56, 2.6) +
      `<path d="M42 74C42 64 58 64 58 74C58 80 42 80 42 74Z" fill="#c62f3f"/>`,
  ) +
    `<ellipse cx="22" cy="76" rx="9" ry="12" fill="${SKIN}"/><ellipse cx="78" cy="76" rx="9" ry="12" fill="${SKIN}"/>` +
    `<path d="M4 34l5 5-5 5 5 5-5 5M96 34l-5 5 5 5-5 5 5 5" stroke="#3b78e6" stroke-width="3.5"/>` +
    drop(80, 26, 0.7),
  춥다:
    `<circle cx="50" cy="48" r="26" fill="${SKIN}"/>` +
    `<path d="M22 44C22 22 36 14 50 14S78 22 78 44Z" fill="#3b78e6"/><path d="M22 44H78" stroke-width="6"/><circle cx="50" cy="12" r="7" fill="#fff"/>` +
    dot(40, 52) +
    dot(60, 52) +
    `<path d="M40 64l4-3 4 3 4-3 4 3 4-3" stroke-width="3"/>` +
    `<path d="M26 72C36 80 64 80 74 72V84C64 90 36 90 26 84Z" fill="#e8553d"/><path d="M60 84V98H72V86Z" fill="#e8553d"/>` +
    `<path d="M36 78v8M48 80v8M60 80v8" stroke="#fff" stroke-width="3"/>` +
    shake(8, 46, -1) +
    shake(92, 46, 1) +
    `<g stroke="#7ec8f0" stroke-width="3"><path d="M12 14v12M6 20h12M8 16l8 8M16 16l-8 8"/><path d="M88 16v12M82 22h12M84 18l8 8M92 18l-8 8"/><path d="M14 80v10M9 85h10"/><path d="M88 76v10M83 81h10"/></g>`,
  덥다:
    `<circle cx="18" cy="18" r="12" fill="#ffd23f"/><path d="M18 36V40M34 34L37 37M36 18H40M34 4L37 1" stroke="#ff9f1a" stroke-width="4"/>` +
    `<circle cx="56" cy="60" r="30" fill="${SKIN}"/><path d="M26 56C25 36 40 30 56 30S87 36 86 54C80 46 70 42 56 42S32 46 26 56Z" fill="#5a3b24"/>` +
    `<path d="M40 60q6-4 12 0M60 60q6-4 12 0" stroke-width="3.5"/>` +
    `<path d="M48 74H64C64 84 48 84 48 74Z" fill="#c62f3f"/><path d="M52 78H60V86C60 90 52 90 52 86Z" fill="#ff8aa0"/>` +
    `<circle cx="38" cy="72" r="6" fill="#ff5c70" stroke="none" opacity=".6"/><circle cx="74" cy="72" r="6" fill="#ff5c70" stroke="none" opacity=".6"/>` +
    drop(88, 40, 0.8) +
    drop(24, 72, 0.8) +
    drop(92, 70, 0.6),
  배고프다: `<path d="M10 98C10 72 20 62 38 62S66 72 66 98Z" fill="#43b04a"/>` +
    `<circle cx="38" cy="40" r="22" fill="${SKIN}"/><path d="M16 36C16 20 26 16 38 16S60 20 60 36C54 30 46 28 38 28S22 30 16 36Z" fill="#5a3b24"/>` +
    dot(30, 42, 2.8) +
    dot(46, 42, 2.8) +
    `<path d="M32 54q6-5 12 0" stroke-width="3"/>` +
    tube('M16 76C22 88 32 88 38 84', SKIN, 7) +
    tube('M60 76C54 88 44 88 38 84', SKIN, 7) +
    `<path d="M72 76q5 4 0 8t0 8M82 72q5 4 0 8t0 8" stroke="#ff9f1a" stroke-width="3.5"/>` +
    `<circle cx="64" cy="44" r="3" fill="#fff"/><circle cx="70" cy="36" r="4" fill="#fff"/>` +
    `<ellipse cx="78" cy="22" rx="19" ry="17" fill="#fff"/>` +
    `<path d="M64 20H92C92 34 64 34 64 20Z" fill="#3b78e6"/><path d="M66 20C66 10 90 10 90 20Z" fill="#fff" stroke-width="2.5"/>`,
  깨끗하다:
    `<circle cx="50" cy="56" r="36" fill="#fff"/><circle cx="50" cy="56" r="24" fill="#fff" stroke="#bfe6fb" stroke-width="4"/>` +
    `<path d="M34 42C38 36 44 34 48 34" stroke="#bfe6fb" stroke-width="4"/>` +
    sparkle(16, 16, 9) +
    sparkle(86, 22, 7) +
    sparkle(88, 88, 6) +
    sparkle(62, 64, 7) +
    sparkle(12, 86, 5),
  더럽다: `<ellipse cx="50" cy="88" rx="44" ry="7" fill="#7a5230"/>` +
    `<path d="M8 76V50C8 44 14 42 20 44L28 48C32 54 42 56 50 54L66 60C80 62 90 68 92 76Z" fill="#3b78e6"/>` +
    `<path d="M6 76H94V80C94 84 90 86 86 86H12C8 86 6 84 6 80Z" fill="#fff"/>` +
    `<path d="M30 54l8-8M40 56l8-8" stroke="#fff" stroke-width="3.5"/>` +
    `<path d="M52 60C60 56 64 64 72 62C78 66 74 74 66 72C60 76 52 72 52 66Z" fill="#7a5230"/><circle cx="20" cy="64" r="6" fill="#7a5230"/><circle cx="40" cy="82" r="5" fill="#7a5230"/><circle cx="84" cy="80" r="4" fill="#7a5230"/>` +
    `<path d="M26 34C22 28 30 24 26 16M44 38C40 32 48 28 44 20M62 44C58 38 66 34 62 26" stroke="#7fae3a" stroke-width="3.5"/>`,
};
