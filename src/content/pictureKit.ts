// 단어 그림 공용 도구 (content/pictures.ts와 그림 묶음 파일들이 함께 쓴다). 모든 그림이 같은 선·색·모양을 쓰게 한다.
// 그림 규칙은 docs/picture-style.md. 좌표는 viewBox 0 0 100 100 기준, 바깥 <g>가 선 색 INK·굵기 3.5·둥근 끝을 준다.

export const INK = '#1d2340';
export const SKIN = '#ffd6ad';
export const HL = '#ffc933';

/** 원 여러 개를 안쪽 선 없이 한 덩어리로 (나무 잎, 구름, 갈기) */
export function blob(fill: string, cs: [number, number, number][]): string {
  const outer = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke-width="7"/>`).join('');
  const inner = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke="none"/>`).join('');
  return `<g fill="${fill}">${outer}${inner}</g>`;
}

/** 신체 부위 강조: 노란 점선 고리 */
export function ring(x: number, y: number, rx: number, ry = rx): string {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="${HL}" stroke-width="5" stroke-dasharray="7 5"/>`;
}

export function dot(x: number, y: number, r = 3.3, fill = INK): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="none"/>`;
}

export function drop(x: number, y: number, s = 1): string {
  return `<path d="M${x} ${y} c${-3 * s} ${6 * s} ${-4 * s} ${8 * s} ${-4 * s} ${10 * s} a${4 * s} ${4 * s} 0 0 0 ${8 * s} 0 c0 ${-2 * s} ${-1 * s} ${-4 * s} ${-4 * s} ${-10 * s}z" fill="#4aa8f0"/>`;
}

export const cheeks = (y: number, dx = 16, cx = 50) =>
  `<circle cx="${cx - dx}" cy="${y}" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/><circle cx="${cx + dx}" cy="${y}" r="5" fill="#ff9aa8" stroke="none" opacity=".6"/>`;

/** 이마·코·머리를 가리킬 때 쓰는 기본 얼굴 (이마가 보이게 앞머리를 짧게) */
export function face(extra = ''): string {
  return (
    `<circle cx="21" cy="56" r="7" fill="${SKIN}"/><circle cx="79" cy="56" r="7" fill="${SKIN}"/>` +
    `<circle cx="50" cy="54" r="29" fill="${SKIN}"/>` +
    `<path d="M21 50C19 27 35 20 50 20S81 27 79 50C74 40 63 34 50 34S26 40 21 50Z" fill="#5a3b24"/>` +
    dot(40, 55) +
    dot(60, 55) +
    `<path d="M50 58q-3 5 0 7"/><path d="M42 72q8 6 16 0"/>` +
    cheeks(66, 17) +
    extra
  );
}

/** 막대 사람 (가다·오다·놀다) */
export function stick(x: number, y: number, body: string, s = 1): string {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${body}" stroke-width="6"/><circle cx="0" cy="0" r="10" fill="${SKIN}"/></g>`;
}

export interface Look {
  hair: string;
  style: 'short' | 'long' | 'pony' | 'bun' | 'bald';
  shirt: string;
  /** 턱수염 색 (할아버지) */
  beard?: string;
  /** 콧수염 (아저씨) */
  mustache?: boolean;
  glasses?: boolean;
  /** 모자 색 (아저씨) */
  cap?: string;
}

/**
 * 사람 (가족 호칭). (x, y)는 발밑 가운데, s는 크기 — 어른 1.2 안팎, 아이 0.8 안팎.
 * 누나·오빠·언니·동생처럼 그림 한 장으로 구별하기 어려운 말은 "누구 옆의 누구"로 보여 준다
 * (작은 아이 옆의 큰 아이, 엄마 옆의 이모). 가리키는 사람은 halo()로 강조한다.
 */
export function person(x: number, y: number, s: number, k: Look): string {
  const w = (n: number) => (n / s).toFixed(2);
  const back =
    k.style === 'long'
      ? `<path d="M-14 -30C-16 -48 -6 -50 0 -50S16 -48 14 -30L15 -14H-15Z" fill="${k.hair}"/>`
      : k.style === 'pony'
        ? `<path d="M10 -40C22 -40 23 -26 17 -18C18 -27 16 -33 9 -35Z" fill="${k.hair}"/>`
        : k.style === 'bun'
          ? `<circle cx="0" cy="-47" r="6.5" fill="${k.hair}"/>`
          : '';
  const top =
    k.style === 'bald'
      ? `<path d="M-11.5 -29C-13 -36 -11 -40 -7 -43M11.5 -29C13 -36 11 -40 7 -43" stroke="${k.hair}" stroke-width="${w(4.5)}"/>`
      : `<path d="M-12 -34C-13 -46 -6 -47 0 -47S13 -46 12 -34C9 -39 4 -41 0 -40S-9 -39 -12 -34Z" fill="${k.hair}"/>`;
  const cap = k.cap
    ? `<path d="M-13 -37C-13 -51 13 -51 13 -37Z" fill="${k.cap}"/><path d="M6 -38H20C21 -38 21 -35 19 -35H6Z" fill="${k.cap}"/>`
    : '';
  const beard = k.beard ? `<path d="M-11 -30C-10 -15 10 -15 11 -30C6 -25 -6 -25 -11 -30Z" fill="${k.beard}"/>` : '';
  const mouth = k.mustache
    ? `<path d="M-7 -27C-4 -30 -1 -29 0 -27C1 -29 4 -30 7 -27C4 -25 -4 -25 -7 -27Z" fill="#3a2a20" stroke-width="${w(1.5)}"/><path d="M-3 -23q3 2 6 0" stroke-width="${w(2)}"/>`
    : `<path d="M-4 -26q4 3 8 0" stroke-width="${w(2)}"/>`;
  const glasses = k.glasses
    ? `<g stroke-width="${w(1.6)}"><circle cx="-5" cy="-32" r="4.2"/><circle cx="5" cy="-32" r="4.2"/><path d="M-0.8 -32h1.6"/></g>`
    : '';
  return (
    `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${w(3)}">` +
    back +
    `<path d="M-15 0C-15 -13 -9 -20 0 -20S15 -13 15 0Z" fill="${k.shirt}"/>` +
    `<circle cx="0" cy="-33" r="12" fill="${SKIN}"/>` +
    (k.cap ? cap : top) +
    beard +
    `<circle cx="-4.5" cy="-32" r="1.9" fill="${INK}" stroke="none"/><circle cx="4.5" cy="-32" r="1.9" fill="${INK}" stroke="none"/>` +
    glasses +
    mouth +
    `</g>`
  );
}

/** 가족 그림에서 가리키는 사람: 뒤에 노란 빛 */
export function halo(x: number, y: number, s: number): string {
  return `<ellipse cx="${x}" cy="${y - 25 * s}" rx="${21 * s}" ry="${29 * s}" fill="#fff1b8" stroke="${HL}" stroke-width="4" stroke-dasharray="7 5"/>`;
}

/** 몸통 (어깨·가슴): 머리와 윗옷 */
export function torso(extra = ''): string {
  return (
    `<path d="M20 96V58C20 44 32 38 50 38S80 44 80 58V96Z" fill="#3b78e6"/><path d="M42 38Q50 46 58 38" fill="${SKIN}"/>` +
    `<circle cx="50" cy="20" r="14" fill="${SKIN}"/><path d="M36 18C36 6 44 4 50 4S64 6 64 18C60 12 56 11 50 11S40 12 36 18Z" fill="#5a3b24"/>` +
    dot(45, 21, 2.2) +
    dot(55, 21, 2.2) +
    `<path d="M46 27q4 3 8 0" stroke-width="2.5"/>` +
    extra
  );
}

/** 표정 얼굴 (기쁘다·졸리다·조용하다): 눈·입은 따로 */
export function moodFace(inner: string): string {
  return (
    `<circle cx="50" cy="54" r="32" fill="${SKIN}"/>` +
    `<path d="M18 50C17 26 33 20 50 20S83 26 82 50C76 40 64 35 50 35S24 40 18 50Z" fill="#5a3b24"/>` +
    inner
  );
}

/** 작은 반짝이 (예쁘다·기쁘다) */
export function sparkle(x: number, y: number, r = 6, fill = HL): string {
  return `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${fill}" stroke="none"/>`;
}

/** 두 겹 선 (테두리 있는 굵은 선: 팔·손잡이·다리) */
export function tube(d: string, fill: string, wd: number): string {
  return `<path d="${d}" stroke-width="${wd + 7}"/><path d="${d}" stroke="${fill}" stroke-width="${wd}"/>`;
}

/** 그림 속(inner)을 완성된 SVG로 감싼다 (선 색·굵기·끝 모양은 여기서 한 번에) */
export function svgFor(inner: string): string {
  return (
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<g fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`
  );
}
