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

/**
 * 헷갈리는 방해 자모를 고른다 (예: 수박 → ㅈ·ㅗ·ㅁ·ㅓ·ㅋ 중에서).
 * target: 지금 보이는 정답 자모 (한 음절 또는 단어 전체), exclude: 단어 전체 자모 (정답과 같은 칩은 내지 않는다).
 * 자모마다 첫 번째 후보부터 쓰고, 자음·모음이 한쪽으로 몰리지 않게 번갈아 고른다. 모자라면 기본 자모에서 채운다.
 */
export function confusableDistractors(
  target: string[],
  exclude: string[],
  count: number,
  rng: () => number,
  table: Record<string, string[]>,
): string[] {
  const out: string[] = [];
  const usable = (j: string) => !exclude.includes(j) && !out.includes(j);
  const uniq = [...new Set(target)];
  const depth = Math.max(0, ...uniq.map((j) => table[j]?.length ?? 0));
  for (let k = 0; k < depth && out.length < count; k++) {
    const round = [...new Set(uniq.map((j) => table[j]?.[k]).filter((c): c is string => !!c && usable(c)))];
    for (let i = round.length - 1; i > 0; i--) {
      const r = Math.floor(rng() * (i + 1));
      [round[i], round[r]] = [round[r], round[i]];
    }
    const cons = round.filter((c) => !isVowel(c));
    const vows = round.filter((c) => isVowel(c));
    let wantVowel = out.length > 0 ? !isVowel(out[out.length - 1]) : rng() < 0.5;
    while (out.length < count && (cons.length || vows.length)) {
      const from = (wantVowel ? vows : cons).length ? (wantVowel ? vows : cons) : wantVowel ? cons : vows;
      const c = from.shift()!;
      if (usable(c)) out.push(c);
      wantVowel = !isVowel(c);
    }
  }
  if (out.length < count) out.push(...distractorsFor([...exclude, ...out], count - out.length, rng));
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

/**
 * 출제 단계: 받침 없음 → 받침 → 쌍자음·ㅐ류 모음 (받침이 함께 있어도 마지막 단계).
 * 한 단계에 새 요소를 하나씩만 더하려는 구분이다.
 */
export type WordTier = 'plain' | 'jong' | 'tense';

export function wordTier(word: string): WordTier | null {
  const f = wordFeatures(word);
  if (!f) return null;
  if (f.hasDoubleConsonant || f.hasComplexVowel) return 'tense';
  return f.hasJong ? 'jong' : 'plain';
}
