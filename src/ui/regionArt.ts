// '새 지역 발견' 장면의 그림 (직접 그린 SVG). 기존 게임의 그림을 본뜨지 않는다.
import type { RegionId } from '../content/stages';

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

export function regionArt(id: RegionId): string {
  return id === 'r2' ? VOLCANO : '';
}
