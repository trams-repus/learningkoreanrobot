// 자모 조립틀. 음절마다 초성·중성·(종성) 칸이 있고, 모음 모양과 받침 유무에 따라 실제 한글 배치를 따른다.
//   수 = ㅅ 위 / ㅜ 아래          박 = ㅂ ㅏ 위 / ㄱ 아래
// 자모를 일렬로 붙인 'ㅅㅜㅂㅏㄱ'을 완성 글자처럼 보여주지 않는다.
import { composeSyllable, decomposeSyllable, isVowel, vowelShape, CHOSEONG, JONGSEONG } from '../hangul/hangul';

export type CellRole = 'cho' | 'jung' | 'jong';
export type FrameShape = 'vertical' | 'horizontal';

export interface FrameSpec {
  syllable: string;
  cho: string;
  jung: string;
  jong: string;
  shape: FrameShape;
  hasJong: boolean;
}

export type FrameFill = Partial<Record<CellRole, string>>;

/** 겹받침은 이번 버전에서 출제하지 않는다 */
const COMPOUND_JONG = new Set(['ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅄ']);

export function frameFor(syllable: string): FrameSpec | null {
  const j = decomposeSyllable(syllable);
  if (!j) return null;
  const vs = vowelShape(j.jung);
  if (vs === 'mixed') return null; // ㅘ·ㅢ 같은 복합모음 배치는 아직 지원하지 않는다
  if (COMPOUND_JONG.has(j.jong)) return null;
  return { syllable, cho: j.cho, jung: j.jung, jong: j.jong, shape: vs, hasJong: j.jong !== '' };
}

export function wordFrames(word: string): FrameSpec[] | null {
  const frames = Array.from(word).map(frameFor);
  return frames.every((f): f is FrameSpec => f !== null) ? frames : null;
}

/** 이 게임이 올바른 모양으로 출제할 수 있는 단어인가 */
export function isSupportedWord(word: string): boolean {
  const frames = wordFrames(word);
  if (!frames || frames.length === 0) return false;
  return frames.map((f) => composeSyllable(f.cho, f.jung, f.jong)).join('') === word;
}

export function cellsOf(f: FrameSpec): CellRole[] {
  return f.hasJong ? ['cho', 'jung', 'jong'] : ['cho', 'jung'];
}

export function targetOf(f: FrameSpec, role: CellRole): string {
  return f[role];
}

/** 조립에 필요한 자모 (같은 자모가 여러 번 필요하면 그 수만큼) */
export function requiredJamo(frames: FrameSpec[]): string[] {
  return frames.flatMap((f) => cellsOf(f).map((r) => f[r]));
}

export function jamoCount(frames: FrameSpec[]): number {
  return requiredJamo(frames).length;
}

/** 이 자모가 들어갈 수 있는 칸인가 */
export function canHold(role: CellRole, jamo: string): boolean {
  if (role === 'jung') return isVowel(jamo);
  if (role === 'cho') return (CHOSEONG as readonly string[]).includes(jamo);
  return jamo !== '' && (JONGSEONG as readonly string[]).includes(jamo);
}

/**
 * 탭으로 넣을 칸 고르기: 활성 칸이 이 자모를 받을 수 있으면 그 칸,
 * 아니면 같은 틀에서 역할이 맞는 빈칸 → 역할이 맞는 칸(교체) 순서.
 */
export function chooseCell(f: FrameSpec, fill: FrameFill, jamo: string, active: CellRole | null): CellRole | null {
  const cells = cellsOf(f);
  if (active && cells.includes(active) && canHold(active, jamo)) return active;
  const fits = cells.filter((r) => canHold(r, jamo));
  return fits.find((r) => !fill[r]) ?? fits[0] ?? null;
}

/** 다음에 비어 있는 칸 (초성 → 중성 → 종성 순) */
export function nextEmptyCell(f: FrameSpec, fill: FrameFill): CellRole | null {
  return cellsOf(f).find((r) => !fill[r]) ?? null;
}

export type FrameResult =
  | { kind: 'incomplete' }
  | { kind: 'correct'; syllable: string }
  /** 모든 칸이 찼지만 목표와 다른 글자. made = 실제로 만들어진 음절(있으면) */
  | { kind: 'different'; made: string | null; wrongCells: CellRole[] };

export function checkFrame(f: FrameSpec, fill: FrameFill): FrameResult {
  const cells = cellsOf(f);
  if (cells.some((r) => !fill[r])) return { kind: 'incomplete' };
  const wrongCells = cells.filter((r) => fill[r] !== f[r]);
  if (wrongCells.length === 0) return { kind: 'correct', syllable: f.syllable };
  const made = composeSyllable(fill.cho!, fill.jung!, fill.jong ?? '');
  return { kind: 'different', made, wrongCells };
}

/** 방해 자모 후보: 필요한 자모와 겹치지 않는 기본 자모 */
const DISTRACTOR_POOL = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ', 'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'];

export function distractorsFor(needed: string[], count: number, rng: () => number): string[] {
  const pool = DISTRACTOR_POOL.filter((j) => !needed.includes(j));
  const out: string[] = [];
  while (out.length < count && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
}

export interface WordFeatures {
  syllables: number;
  hasJong: boolean;
  /** ㄲ·ㄸ·ㅃ·ㅆ·ㅉ (예: 꼬리) */
  hasDoubleConsonant: boolean;
  /** ㅐ·ㅔ·ㅒ·ㅖ (예: 개미) */
  hasComplexVowel: boolean;
  /** 같은 자모가 여러 번 필요 (예: 바나나의 ㅏ) */
  hasRepeatedJamo: boolean;
}

const DOUBLE = new Set(['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ']);
const COMPLEX_VOWEL = new Set(['ㅐ', 'ㅔ', 'ㅒ', 'ㅖ']);

export function wordFeatures(word: string): WordFeatures | null {
  const frames = wordFrames(word);
  if (!frames) return null;
  const need = requiredJamo(frames);
  return {
    syllables: frames.length,
    hasJong: frames.some((f) => f.hasJong),
    hasDoubleConsonant: frames.some((f) => DOUBLE.has(f.cho) || DOUBLE.has(f.jong)),
    hasComplexVowel: frames.some((f) => COMPLEX_VOWEL.has(f.jung)),
    hasRepeatedJamo: new Set(need).size < need.length,
  };
}

/**
 * 조립 난이도 (0 = 받침 없는 두 글자). 음원 유무·연령 팩과는 별개다.
 * 처음 배우는 단계에서는 이 값이 낮은 단어를 먼저 낸다.
 */
export function wordDifficulty(word: string): number {
  const f = wordFeatures(word);
  if (!f) return 99;
  return Math.max(0, f.syllables - 2) + (f.hasJong ? 1 : 0) + (f.hasDoubleConsonant ? 1 : 0) + (f.hasComplexVowel ? 1 : 0) + (f.hasRepeatedJamo ? 0.5 : 0);
}
