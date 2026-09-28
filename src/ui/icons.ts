// 자체 제작 SVG 아이콘 (임시 에셋). 글을 몰라도 알아볼 수 있게 굵고 단순하게 그린다.
const svg = (body: string, vb = '0 0 48 48') =>
  `<svg viewBox="${vb}" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  play: svg('<path d="M16 10 L38 24 L16 38 Z" fill="currentColor"/>'),
  pause: svg('<rect x="13" y="11" width="8" height="26" rx="3" fill="currentColor"/><rect x="27" y="11" width="8" height="26" rx="3" fill="currentColor"/>'),
  speaker: svg('<path d="M8 19h8l10-8v26l-10-8H8z" fill="currentColor"/><path d="M32 17c3 4 3 10 0 14M36 12c6 7 6 17 0 24" stroke="currentColor" stroke-width="4"/>'),
  mute: svg('<path d="M8 19h8l10-8v26l-10-8H8z" fill="currentColor"/><path d="M32 18l10 12M42 18L32 30" stroke="currentColor" stroke-width="4"/>'),
  hand: svg(
    '<path d="M18 26V11a3.5 3.5 0 0 1 7 0v11V8a3.5 3.5 0 0 1 7 0v14V11a3.5 3.5 0 0 1 7 0v17c0 9-6 15-14 15-6 0-9-3-12-7l-6-9a3.3 3.3 0 0 1 5-4z" fill="#fff" stroke="#16203a" stroke-width="3"/>',
  ),
  bulb: svg('<path d="M24 6a12 12 0 0 0-7 22v5h14v-5A12 12 0 0 0 24 6z" fill="currentColor"/><rect x="18" y="36" width="12" height="4" rx="2" fill="currentColor"/><rect x="20" y="42" width="8" height="3" rx="1.5" fill="currentColor"/>'),
  home: svg('<path d="M8 24 L24 10 L40 24" stroke="currentColor" stroke-width="5"/><path d="M13 22v16h8v-9h6v9h8V22" fill="currentColor"/>'),
  retry: svg('<path d="M36 16a14 14 0 1 0 3 12" stroke="currentColor" stroke-width="5"/><path d="M38 6v11H27" stroke="currentColor" stroke-width="5"/>'),
  next: svg('<path d="M10 24h24M26 13l11 11-11 11" stroke="currentColor" stroke-width="6"/>'),
  lock: svg('<rect x="11" y="21" width="26" height="19" rx="4" fill="currentColor"/><path d="M17 21v-5a7 7 0 0 1 14 0v5" stroke="currentColor" stroke-width="5"/>'),
  star: svg('<path d="M24 5l5.6 12 13 1.4-9.7 8.8 2.8 12.8L24 33.4 12.3 40l2.8-12.8L5.4 18.4l13-1.4z" fill="currentColor"/>'),
  gear: svg('<circle cx="24" cy="24" r="7" stroke="currentColor" stroke-width="4"/><path d="M24 5v7M24 36v7M5 24h7M36 24h7M10.5 10.5l5 5M32.5 32.5l5 5M10.5 37.5l5-5M32.5 15.5l5-5" stroke="currentColor" stroke-width="4"/>'),
  parent: svg('<circle cx="17" cy="14" r="6" fill="currentColor"/><path d="M6 40c0-9 5-15 11-15s11 6 11 15z" fill="currentColor"/><circle cx="34" cy="22" r="4.5" fill="currentColor"/><path d="M26 40c0-7 3.5-11 8-11s8 4 8 11z" fill="currentColor"/>'),
  cannon: svg(
    '<rect x="6" y="18" width="26" height="13" rx="3" fill="#2a3450" stroke="#16203a" stroke-width="2.5"/><rect x="30" y="15" width="7" height="19" rx="2" fill="#ffc933" stroke="#16203a" stroke-width="2.5"/><circle cx="43" cy="24" r="4" fill="#ff9d2e"/><rect x="11" y="18" width="4" height="13" fill="#ffc933"/>',
  ),
  wave: svg(
    '<path d="M4 36c6-12 14-22 24-24 6-1 10 3 8 7-2 3-6 2-6 6 0 4 6 5 12 3v8z" fill="#4cc3ff" stroke="#16203a" stroke-width="2.5"/><circle cx="31" cy="12" r="3" fill="#fff"/><circle cx="37" cy="15" r="2.3" fill="#fff"/>',
  ),
  shield: svg('<path d="M24 5l16 6v11c0 11-7 18-16 21C15 40 8 33 8 22V11z" fill="#b06cff" stroke="#16203a" stroke-width="2.5"/><path d="M24 12v25M14 17l20 0" stroke="#e6d4ff" stroke-width="3"/>'),
  repair: svg(
    '<path d="M30 8a9 9 0 0 0-8 12L8 34a4 4 0 0 0 6 6l14-14a9 9 0 0 0 12-8l-6 2-4-4 2-6z" fill="#3ed17a" stroke="#16203a" stroke-width="2.5"/>',
  ),
  dino: svg(
    '<path d="M40 30c-4-1-8-1-10 1l-4-10c-2-5-8-7-13-5L6 19c-2 1-1 4 1 4l6-1 2 8c-3 2-4 6-2 9h5l1-5h6l1 5h5l1-5c4 0 8 0 11-2z" fill="#5fc24a" stroke="#16203a" stroke-width="2.5"/><circle cx="12" cy="18" r="1.8" fill="#16203a"/>',
  ),
  imp: svg(
    '<path d="M16 16l-3-9 8 7M30 14l6-8-1 10" fill="#ffe08a" stroke="#16203a" stroke-width="2.5"/><ellipse cx="24" cy="27" rx="15" ry="13" fill="#a45cf0" stroke="#16203a" stroke-width="2.5"/><circle cx="22" cy="24" r="6" fill="#fff" stroke="#16203a" stroke-width="2"/><circle cx="21" cy="24" r="2.6" fill="#16203a"/>',
  ),
  charger: svg(
    '<path d="M44 30c0-8-6-14-16-14-6 0-10 2-12 5l-4-6-2 7-6-2 4 8c0 5 3 8 8 9v5h5v-4h10v4h5v-6c5-1 8-3 8-6z" fill="#f07a3a" stroke="#16203a" stroke-width="2.5"/><path d="M6 28l-4-2" stroke="#16203a" stroke-width="3"/><circle cx="12" cy="27" r="1.8" fill="#16203a"/>',
  ),
  boss: svg(
    '<path d="M42 44H30l-2-10-6 1-2 9H10l3-14C8 27 6 21 8 15l-4-2 6-6 12 1c8 1 14 6 16 14l6 6z" fill="#2f8f7a" stroke="#16203a" stroke-width="2.5"/><path d="M26 10l3-6 3 7M34 15l5-4 0 7" fill="#7b4ad6" stroke="#16203a" stroke-width="2"/><circle cx="15" cy="14" r="2.4" fill="#fff06a" stroke="#16203a" stroke-width="1.5"/>',
  ),
  jamo: svg(
    '<rect x="6" y="6" width="17" height="17" rx="4" fill="#ff9d2e" stroke="#16203a" stroke-width="2.5"/><rect x="25" y="25" width="17" height="17" rx="4" fill="#2eb8ff" stroke="#16203a" stroke-width="2.5"/><path d="M31 12h8M35 8v8" stroke="#16203a" stroke-width="3"/>',
  ),
  robot: svg(
    '<rect x="12" y="8" width="24" height="18" rx="6" fill="#eef3fb" stroke="#16203a" stroke-width="2.5"/><rect x="16" y="13" width="16" height="6" rx="3" fill="#16203a"/><rect x="19" y="14" width="4" height="4" rx="1" fill="#5cf2ff"/><rect x="26" y="14" width="4" height="4" rx="1" fill="#5cf2ff"/><rect x="10" y="26" width="28" height="16" rx="6" fill="#3b78e6" stroke="#16203a" stroke-width="2.5"/><circle cx="24" cy="34" r="3.5" fill="#5cf2ff"/>',
  ),
  crystal: svg(
    '<path d="M24 5l11 13-11 23L13 18z" fill="#ff7ad9" stroke="currentColor" stroke-width="3"/><path d="M13 18h22M24 5l-4 13 4 23 4-23z" stroke="currentColor" stroke-width="2"/><path d="M38 7l1.5 3.5L43 12l-3.5 1.5L38 17l-1.5-3.5L33 12l3.5-1.5z" fill="currentColor"/>',
  ),
  magicFace: svg(
    '<path d="M9 30c-2-14 5-24 15-24s17 10 15 24c-1 6-6 9-6 9H15s-5-3-6-9z" fill="#2f2c5e" stroke="#16203a" stroke-width="2.5"/><ellipse cx="24" cy="27" rx="11" ry="12" fill="#ffd6bf" stroke="#16203a" stroke-width="2.5"/><path d="M13 22c4-8 18-8 22 0-6-3-16-3-22 0z" fill="#2f2c5e"/><circle cx="19.5" cy="28" r="2" fill="#16203a"/><circle cx="28.5" cy="28" r="2" fill="#16203a"/><path d="M21 33.5q3 2.5 6 0" stroke="#16203a" stroke-width="2"/><path d="M34 6l2 4.5 4.8.6-3.6 3.2 1 4.7L34 16.6 29.8 19l1-4.7-3.6-3.2 4.8-.6z" fill="#ffc933" stroke="#16203a" stroke-width="1.8"/>',
  ),
  /** 선택 카드용 큰 그림: 로봇 (포신·장갑·어깨 무장). .cannon/.hatch/.flash는 선택 때 움직인다 */
  robotHero: svg(
    `<g class="hero-bob">
      <rect x="44" y="96" width="14" height="30" rx="5" fill="#2a54a6" stroke="#16203a" stroke-width="3"/>
      <rect x="62" y="96" width="14" height="30" rx="5" fill="#2a54a6" stroke="#16203a" stroke-width="3"/>
      <rect x="34" y="52" width="52" height="48" rx="14" fill="#3b78e6" stroke="#16203a" stroke-width="3"/>
      <rect x="46" y="62" width="28" height="22" rx="6" fill="#1f3f82" stroke="#16203a" stroke-width="2.5"/>
      <circle cx="60" cy="73" r="6" fill="#5cf2ff"/>
      <rect x="20" y="58" width="16" height="30" rx="7" fill="#2a54a6" stroke="#16203a" stroke-width="3"/>
      <g class="pod"><rect x="18" y="38" width="26" height="18" rx="5" fill="#2a54a6" stroke="#16203a" stroke-width="3"/>
        <rect class="hatch" x="18" y="36" width="26" height="9" rx="4" fill="#3b78e6" stroke="#16203a" stroke-width="2.5"/></g>
      <rect x="42" y="20" width="36" height="30" rx="10" fill="#eef3fb" stroke="#16203a" stroke-width="3"/>
      <rect x="47" y="29" width="26" height="10" rx="5" fill="#16203a"/>
      <rect x="51" y="31" width="7" height="6" rx="2" fill="#5cf2ff"/><rect x="62" y="31" width="7" height="6" rx="2" fill="#5cf2ff"/>
      <path d="M52 20l-4-10" stroke="#16203a" stroke-width="3"/><circle cx="47" cy="9" r="4" fill="#ffc933" stroke="#16203a" stroke-width="2.5"/>
      <g class="cannon"><rect x="82" y="56" width="16" height="30" rx="7" fill="#3b78e6" stroke="#16203a" stroke-width="3"/>
        <rect x="85" y="84" width="10" height="28" rx="3" fill="#243150" stroke="#16203a" stroke-width="2.5"/>
        <rect x="83" y="108" width="14" height="7" rx="2" fill="#ffc933" stroke="#16203a" stroke-width="2"/>
        <circle class="flash" cx="90" cy="120" r="9" fill="#fff3a0"/></g>
      <rect x="84" y="50" width="18" height="12" rx="5" fill="#3b78e6" stroke="#16203a" stroke-width="3"/>
      <rect x="88" y="53" width="10" height="3" rx="1.5" fill="#ffc933"/>
    </g>`,
    '0 0 120 132',
  ),
  /** 선택 카드용 큰 그림: 마법소녀 (마법봉·마법진). .wand/.mcircle/.sparkle은 선택 때 움직인다 */
  magicHero: svg(
    `<g class="mcircle"><circle cx="60" cy="66" r="50" fill="#ff7ad9" fill-opacity="0.12" stroke="#ff7ad9" stroke-width="3"/>
      <circle cx="60" cy="66" r="40" stroke="#8fe8ff" stroke-width="2"/>
      <path d="M60 36l6 16 16 2-12 11 4 16-14-8-14 8 4-16-12-11 16-2z" stroke="#fff0a8" stroke-width="2"/></g>
    <g class="hero-bob">
      <rect x="47" y="100" width="11" height="26" rx="5" fill="#f7f4ff" stroke="#16203a" stroke-width="3"/>
      <rect x="62" y="100" width="11" height="26" rx="5" fill="#f7f4ff" stroke="#16203a" stroke-width="3"/>
      <path d="M40 70h40l14 34H26z" fill="#b9a6ff" stroke="#16203a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M43 68h34l10 28H33z" fill="#6f4bd8" stroke="#16203a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M44 48h32l2 22H42z" fill="#6f4bd8" stroke="#16203a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 48q20-8 40 0l6 18q-26 6-52 0z" fill="#1f9fb8" stroke="#16203a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 70l-10-8v14zM68 70l10-8v14z" fill="#ff5fa2" stroke="#16203a" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="60" cy="70" r="4" fill="#8fe8ff" stroke="#16203a" stroke-width="2"/>
      <path d="M36 24c0-12 10-20 24-20s24 8 24 20v14H36z" fill="#2f2c5e" stroke="#16203a" stroke-width="3"/>
      <path d="M82 18c14 6 16 26 6 38-2-12-4-20-10-26z" fill="#2f2c5e" stroke="#16203a" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="60" cy="32" rx="16" ry="17" fill="#ffd6bf" stroke="#16203a" stroke-width="3"/>
      <path d="M44 26c6-12 26-12 32 0-10-5-22-5-32 0z" fill="#2f2c5e"/>
      <circle cx="54" cy="34" r="2.6" fill="#16203a"/><circle cx="66" cy="34" r="2.6" fill="#16203a"/>
      <path d="M56 41q4 3 8 0" stroke="#16203a" stroke-width="2.2"/>
      <path d="M76 8l2.2 5 5.3.6-4 3.6 1.1 5.2-4.6-2.7-4.6 2.7 1.1-5.2-4-3.6 5.3-.6z" fill="#ffc933" stroke="#16203a" stroke-width="2"/>
      <rect x="30" y="52" width="10" height="26" rx="5" fill="#f7f4ff" stroke="#16203a" stroke-width="2.5"/>
      <g class="wand"><rect x="80" y="52" width="10" height="24" rx="5" fill="#f7f4ff" stroke="#16203a" stroke-width="2.5" transform="rotate(-40 85 54)"/>
        <path d="M92 70L108 30" stroke="#ffc933" stroke-width="5"/><path d="M92 70L108 30" stroke="#16203a" stroke-width="1.5" stroke-opacity="0.5"/>
        <path d="M110 16l3.5 8 8.6 1-6.4 5.8 1.8 8.5-7.5-4.4-7.5 4.4 1.8-8.5-6.4-5.8 8.6-1z" fill="#ffc933" stroke="#16203a" stroke-width="2.5"/>
        <circle class="flash" cx="110" cy="28" r="10" fill="#fff0a8"/></g>
    </g>
    <g class="sparkle"><path d="M22 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff0a8"/><path d="M100 96l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="#8fe8ff"/></g>`,
    '0 0 120 132',
  ),
  base: svg('<rect x="8" y="14" width="32" height="28" rx="4" fill="#8c9bb5" stroke="#16203a" stroke-width="2.5"/><rect x="14" y="20" width="7" height="7" fill="#5cf2ff"/><rect x="27" y="20" width="7" height="7" fill="#5cf2ff"/><path d="M24 14V4l9 3-9 3" fill="#ff5a5a" stroke="#16203a" stroke-width="2"/>'),
};

export type IconName = keyof typeof ICONS;
