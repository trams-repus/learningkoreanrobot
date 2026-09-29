// '새 지역 발견' 장면의 그림 (직접 그린 SVG). 기존 게임의 그림을 본뜨지 않는다.
import { regionById, regionLook } from '../content/stages';

const INK = '#16203a';

/** 화산섬: 바다 위 섬, 연기 나는 화산, 흐르는 용암, 작은 공룡 그림자 */
const VOLCANO = `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="240" height="160" rx="18" fill="#7fd0ff"/>
  <circle cx="200" cy="30" r="16" fill="#ffe066" stroke="${INK}" stroke-width="3"/>
  <g class="rf-smoke" fill="#e7e2f2" stroke="${INK}" stroke-width="2.5">
    <circle cx="116" cy="34" r="12"/><circle cx="130" cy="24" r="14"/><circle cx="146" cy="30" r="11"/>
  </g>
  <path d="M0 118 Q30 110 60 118 T120 118 T180 118 T240 118 V160 H0 Z" fill="#3b8fd9" stroke="${INK}" stroke-width="3"/>
  <path d="M28 124 Q60 96 92 100 L112 50 H146 L168 100 Q196 96 214 124 Z" fill="#8a6a4a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M112 50 H146 L140 60 Q130 54 118 60 Z" fill="#ff5a3d" stroke="${INK}" stroke-width="2.5"/>
  <path class="rf-lava" d="M126 58 Q122 76 130 88 Q138 100 132 116" fill="none" stroke="#ff8c42" stroke-width="7" stroke-linecap="round"/>
  <path d="M126 58 Q122 76 130 88 Q138 100 132 116" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>
  <path d="M40 122 Q70 108 96 112 L100 124 Z" fill="#5fc24a" stroke="${INK}" stroke-width="2.5"/>
  <path d="M170 110 Q196 106 208 122 L168 124 Z" fill="#5fc24a" stroke="${INK}" stroke-width="2.5"/>
  <path d="M60 112 l4 -10 6 2 4 -6 4 4 6 -2 -2 10 z" fill="#2f8f7a" stroke="${INK}" stroke-width="2"/>
  <g fill="#ffffff" stroke="${INK}" stroke-width="1.5">
    <path class="rf-spark" d="M36 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/>
    <path class="rf-spark" d="M190 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"/>
  </g>
</svg>`;

const frame = (sky: string, body: string) =>
  `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="240" height="160" rx="18" fill="${sky}"/>${body}</svg>`;
const sparks = `<g fill="#ffffff" stroke="${INK}" stroke-width="1.5">
    <path class="rf-spark" d="M36 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/>
    <path class="rf-spark" d="M196 60 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"/></g>`;

/** 얼음 골짜기: 뾰족한 얼음 봉우리, 눈 덮인 땅, 고드름 */
const ICE = frame(
  '#bfe6ff',
  `<path d="M0 120 L40 70 L70 104 L110 44 L150 100 L180 66 L240 120 V160 H0 Z" fill="#e8f6ff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M110 44 L124 64 L112 60 L100 66 Z M40 70 L50 84 L38 80 Z M180 66 L192 80 L178 78 Z" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
  <path d="M0 130 Q60 118 120 130 T240 130 V160 H0 Z" fill="#ffffff" stroke="${INK}" stroke-width="3"/>
  <path d="M60 130 l4 12 4 -12 M150 131 l3 10 3 -10" fill="#9fd7ff" stroke="${INK}" stroke-width="2"/>
  <circle cx="30" cy="30" r="3" fill="#fff"/><circle cx="90" cy="20" r="3" fill="#fff"/><circle cx="200" cy="30" r="3" fill="#fff"/>${sparks}`,
);
/** 구름 성: 구름 위에 떠 있는 성 */
const CLOUD = frame(
  '#ffd7ef',
  `<g fill="#ffffff" stroke="${INK}" stroke-width="3"><circle cx="60" cy="126" r="26"/><circle cx="100" cy="116" r="30"/><circle cx="148" cy="120" r="28"/><circle cx="190" cy="128" r="24"/><rect x="40" y="124" width="170" height="26" rx="13" stroke="none"/></g>
  <path d="M90 104 V60 H104 V52 H112 V60 H128 V52 H136 V60 H150 V104 Z" fill="#c9b6ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M104 60 L112 36 L120 60 Z M136 60 L144 40 L152 60" fill="#ff7ad9" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="113" y="82" width="14" height="22" rx="7" fill="#6f4bd8" stroke="${INK}" stroke-width="2.5"/>${sparks}`,
);
/** 깊은 바다: 물결, 거품, 산호 */
const SEA = frame(
  '#2f7fd0',
  `<path d="M0 30 Q30 22 60 30 T120 30 T180 30 T240 30" fill="none" stroke="#9fe0ff" stroke-width="4"/>
  <path d="M0 132 Q60 120 120 132 T240 132 V160 H0 Z" fill="#e8c77a" stroke="${INK}" stroke-width="3"/>
  <path d="M50 132 V104 M50 116 l-10 -10 M50 110 l10 -12 M190 132 V100 M190 112 l12 -10 M190 118 l-10 -8" stroke="#ff7a8a" stroke-width="6" stroke-linecap="round"/>
  <g fill="none" stroke="#dff6ff" stroke-width="2.5"><circle cx="120" cy="80" r="8"/><circle cx="132" cy="60" r="5"/><circle cx="116" cy="46" r="3.5"/><circle cx="84" cy="94" r="4"/></g>
  <path d="M150 86 q14 -12 28 0 q-14 12 -28 0 z M178 86 l8 -6 v12 z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>`,
);
/** 모래 유적: 모래 언덕, 무너진 기둥, 해 */
const DESERT = frame(
  '#ffe7a8',
  `<circle cx="196" cy="34" r="16" fill="#ff9d2e" stroke="${INK}" stroke-width="3"/>
  <path d="M0 120 Q60 96 120 116 T240 110 V160 H0 Z" fill="#e8b85c" stroke="${INK}" stroke-width="3"/>
  <path d="M70 116 L110 56 L150 116 Z" fill="#d4a04a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M90 86 H130 M80 100 H140" stroke="${INK}" stroke-width="2"/>
  <rect x="172" y="84" width="14" height="34" fill="#f2dcae" stroke="${INK}" stroke-width="2.5"/><rect x="166" y="78" width="26" height="8" fill="#f2dcae" stroke="${INK}" stroke-width="2.5"/>
  <rect x="30" y="98" width="14" height="22" fill="#f2dcae" stroke="${INK}" stroke-width="2.5"/>${sparks}`,
);
/** 별빛 우주: 고리 행성, 별 */
const SPACE = frame(
  '#2a1f5c',
  `<g fill="#fff06a" stroke="${INK}" stroke-width="1.5"><path d="M40 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/><path d="M200 110 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"/><path d="M180 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"/></g>
  <circle cx="120" cy="80" r="30" fill="#ff9dd8" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="120" cy="84" rx="56" ry="12" fill="none" stroke="#ffd23f" stroke-width="5"/>
  <path d="M0 140 Q60 128 120 140 T240 140 V160 H0 Z" fill="#8a7fc0" stroke="${INK}" stroke-width="3"/>
  <circle cx="60" cy="146" r="5" fill="#6a5fa0"/><circle cx="170" cy="148" r="6" fill="#6a5fa0"/>`,
);
/** 버섯 숲: 큰 버섯들 */
const MUSHROOM = frame(
  '#b8f0c8',
  `<path d="M0 126 Q60 114 120 126 T240 126 V160 H0 Z" fill="#5fae4a" stroke="${INK}" stroke-width="3"/>
  <rect x="62" y="84" width="16" height="44" rx="6" fill="#fff4d6" stroke="${INK}" stroke-width="3"/>
  <path d="M34 90 Q70 36 106 90 Z" fill="#ff5a5a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="60" cy="72" r="5" fill="#fff"/><circle cx="80" cy="64" r="4" fill="#fff"/><circle cx="90" cy="80" r="4" fill="#fff"/>
  <rect x="160" y="98" width="12" height="30" rx="5" fill="#fff4d6" stroke="${INK}" stroke-width="3"/>
  <path d="M140 102 Q166 66 192 102 Z" fill="#a45cf0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>${sparks}`,
);
/** 번개 산: 먹구름과 번개, 바위산 */
const STORM = frame(
  '#8c9ac8',
  `<g fill="#e7e2f2" stroke="${INK}" stroke-width="2.5"><circle cx="70" cy="34" r="16"/><circle cx="92" cy="28" r="18"/><circle cx="116" cy="36" r="14"/></g>
  <path d="M96 48 L86 72 H98 L90 96 L112 66 H100 L108 48 Z" fill="#ffe066" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M0 130 L50 80 L80 110 L130 60 L180 112 L210 90 L240 130 V160 H0 Z" fill="#6b6f86" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M0 140 H240 V160 H0 Z" fill="#4f5570" stroke="${INK}" stroke-width="3"/>`,
);

const ARTS = ['', VOLCANO, ICE, CLOUD, SEA, DESERT, SPACE, MUSHROOM, STORM];

export function regionArt(id: string): string {
  const r = regionById(id);
  return r ? ARTS[regionLook(r.index)] ?? '' : '';
}
