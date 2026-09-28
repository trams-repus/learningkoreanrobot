// 한글 음절 조립/분해.
// 호환용 자모(ㄱ U+3131…)를 문자열로 이어 붙이고 normalize()를 불러도 완성형 음절이 되지 않는다.
// 그래서 초성·중성·종성 인덱스를 직접 구해 Unicode 공식으로 합성한다.
//   음절 = 0xAC00 + (초성 × 21 + 중성) × 28 + 종성

const SYLLABLE_BASE = 0xac00;
const SYLLABLE_LAST = 0xd7a3;
const JUNG_COUNT = 21;
const JONG_COUNT = 28;

/** 초성 19자 (Unicode 초성 순서, 호환용 자모로 표기) */
export const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

/** 중성 21자 */
export const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
] as const;

/** 종성 27자 + 없음(''). ㄸ·ㅃ·ㅉ은 받침이 될 수 없다. */
export const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

/** 가로로 눕는 모음: 초성 아래에 놓인다 (포, 수). 나머지는 오른쪽 (파, 대). */
const HORIZONTAL_VOWELS = new Set(['ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ']);
/** 초성 아래와 오른쪽 모두에 걸치는 모음 (과, 의) */
const MIXED_VOWELS = new Set(['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']);

export type VowelShape = 'vertical' | 'horizontal' | 'mixed';

export interface Jamo {
  cho: string;
  jung: string;
  jong: string; // 받침 없으면 ''
}

export function isConsonant(ch: string): boolean {
  return ch !== '' && ((CHOSEONG as readonly string[]).includes(ch) || (JONGSEONG as readonly string[]).includes(ch));
}

export function isVowel(ch: string): boolean {
  return (JUNGSEONG as readonly string[]).includes(ch);
}

export function vowelShape(jung: string): VowelShape {
  if (HORIZONTAL_VOWELS.has(jung)) return 'horizontal';
  if (MIXED_VOWELS.has(jung)) return 'mixed';
  return 'vertical';
}

export function isSyllable(ch: string): boolean {
  if (ch.length !== 1) return false;
  const code = ch.charCodeAt(0);
  return code >= SYLLABLE_BASE && code <= SYLLABLE_LAST;
}

/**
 * 초성·중성·(종성)으로 완성형 음절을 만든다.
 * 자리에 맞지 않는 자모(예: 초성 자리에 모음, 받침 자리에 ㄸ)면 null.
 */
export function composeSyllable(cho: string, jung: string, jong = ''): string | null {
  const ci = (CHOSEONG as readonly string[]).indexOf(cho);
  const vi = (JUNGSEONG as readonly string[]).indexOf(jung);
  const ti = (JONGSEONG as readonly string[]).indexOf(jong);
  if (ci < 0 || vi < 0 || ti < 0) return null;
  return String.fromCharCode(SYLLABLE_BASE + (ci * JUNG_COUNT + vi) * JONG_COUNT + ti);
}

/** 완성형 음절을 초성·중성·종성으로 나눈다. 음절이 아니면 null. */
export function decomposeSyllable(ch: string): Jamo | null {
  if (!isSyllable(ch)) return null;
  const offset = ch.charCodeAt(0) - SYLLABLE_BASE;
  const ti = offset % JONG_COUNT;
  const vi = Math.floor(offset / JONG_COUNT) % JUNG_COUNT;
  const ci = Math.floor(offset / (JONG_COUNT * JUNG_COUNT));
  return { cho: CHOSEONG[ci], jung: JUNGSEONG[vi], jong: JONGSEONG[ti] };
}

/** 단어를 음절 배열로 나눈다. 완성형 음절이 아닌 글자가 섞이면 null. */
export function splitWord(word: string): string[] | null {
  const chars = Array.from(word);
  return chars.every(isSyllable) ? chars : null;
}

/**
 * 자모 조립기의 칸 상태를 음절로 만든다.
 * 조립기는 [초성, 중성, 종성] 칸을 가지며 초성+중성이 모두 차야 음절이 된다.
 */
export function assembleFromSlots(slots: { cho?: string; jung?: string; jong?: string }): string | null {
  if (!slots.cho || !slots.jung) return null;
  return composeSyllable(slots.cho, slots.jung, slots.jong ?? '');
}

/** 이 자모가 조립기의 어느 칸에 들어갈 수 있는가 */
export function jamoRole(ch: string): 'consonant' | 'vowel' | null {
  if (isVowel(ch)) return 'vowel';
  if (isConsonant(ch)) return 'consonant';
  return null;
}
