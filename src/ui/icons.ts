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
  base: svg('<rect x="8" y="14" width="32" height="28" rx="4" fill="#8c9bb5" stroke="#16203a" stroke-width="2.5"/><rect x="14" y="20" width="7" height="7" fill="#5cf2ff"/><rect x="27" y="20" width="7" height="7" fill="#5cf2ff"/><path d="M24 14V4l9 3-9 3" fill="#ff5a5a" stroke="#16203a" stroke-width="2"/>'),
};

export type IconName = keyof typeof ICONS;
