// 자모 조립틀. 음절마다 초성·중성·(종성) 칸이 있고, 모음 모양과 받침 유무에 따라 실제 한글 배치를 따른다.
//   수 = ㅅ 위 / ㅜ 아래          박 = ㅂ ㅏ 위 / ㄱ 아래
// 자모를 일렬로 붙인 'ㅅㅜㅂㅏㄱ'을 완성 글자처럼 보여주지 않는다.
import { composeSyllable, decomposeSyllable, isVowel, vowelShape, CHOSEONG, JONGSEONG } from '../hangul/hangul';

export type CellRole = 'cho' | 'jung' | 'jong';
/** mixed = 겹모음(ㅘ·ㅝ·ㅢ …): 모음이 초성 아래와 오른쪽을 ㄱ자로 감싼다 */
export type FrameShape = 'vertical' | 'horizontal' | 'mixed';

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

export type TrapGrade = 'easy' | 'medium' | 'hard';

export interface TrapTables {
  table: Record<string, Record<TrapGrade, string[]>>;
  /** 받침 칸 전용 '어려움' 후보 */
  jongHard: Record<string, string[]>;
  /** 아직 배우지 않은 복잡한 자모 무리. 단어에 같은 무리가 있거나 allowAdvanced일 때만 함정으로 쓴다. */
  advancedGroups: string[][];
}

const GRADE_FALLBACK: Record<TrapGrade, TrapGrade[]> = {
  easy: ['easy', 'medium', 'hard'],
  medium: ['medium', 'easy', 'hard'],
  hard: ['hard', 'medium', 'easy'],
};

/**
 * 난이도별 함정 고르기 (2026-09-28 사용자 지시 2절: 함정은 무작위가 아니라 단계적으로).
 * grades 하나마다 함정 하나: 지금 보이는 정답 자모(targets) 중 하나를 골라 그 자모의 해당 난이도 후보에서 뽑는다.
 * 자음·모음을 번갈아 겨냥해 한쪽 칸만 헷갈리게 되지 않게 한다. 그 난이도 후보가 없으면 가까운 난이도로, 그래도 없으면 기본 자모로 채운다.
 * exclude: 단어 전체 자모 (정답과 같은 칩은 내지 않는다).
 */
export function pickTraps(
  targets: { jamo: string; role: CellRole }[],
  exclude: string[],
  grades: TrapGrade[],
  rng: () => number,
  tables: TrapTables,
  allowAdvanced = false,
): string[] {
  const out: string[] = [];
  const blocked = new Set(allowAdvanced ? [] : tables.advancedGroups.filter((g) => !g.some((j) => exclude.includes(j))).flat());
  const usable = (j: string) => !exclude.includes(j) && !out.includes(j) && !blocked.has(j);
  let lastVowel: boolean | null = null;
  for (const g of grades) {
    let picked: string | undefined;
    const order = [...targets];
    for (let i = order.length - 1; i > 0; i--) {
      const r = Math.floor(rng() * (i + 1));
      [order[i], order[r]] = [order[r], order[i]];
    }
    // 방금 고른 함정과 다른 종류(자음/모음)를 먼저 겨냥한다
    if (lastVowel !== null) order.sort((a, b) => Number(isVowel(a.jamo) === lastVowel) - Number(isVowel(b.jamo) === lastVowel));
    for (const gg of GRADE_FALLBACK[g]) {
      for (const t of order) {
        // 받침 칸의 어려움은 소리가 비슷한 받침을 먼저 쓴다
        const jong = gg === 'hard' && t.role === 'jong' ? (tables.jongHard[t.jamo] ?? []).filter(usable) : [];
        const list = jong.length ? jong : (tables.table[t.jamo]?.[gg] ?? []).filter(usable);
        if (list.length) {
          picked = list[Math.floor(rng() * list.length)];
          break;
        }
      }
      if (picked) break;
    }
    picked ??= distractorsFor([...exclude, ...out, ...blocked], 1, rng)[0];
    if (!picked) continue;
    out.push(picked);
    lastVowel = isVowel(picked);
  }
  return out;
}

export interface WordFeatures {
  syllables: number;
  hasJong: boolean;
  /** ㄲ·ㄸ·ㅃ·ㅆ·ㅉ (예: 꼬리) */
  hasDoubleConsonant: boolean;
  /** ㅐ·ㅔ·ㅒ·ㅖ (예: 개미) */
  hasComplexVowel: boolean;
  /** 겹모음 ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ·ㅢ (예: 사과, 돼지) */
  hasCompoundVowel: boolean;
  /** 같은 자모가 여러 번 필요 (예: 바나나의 ㅏ) */
  hasRepeatedJamo: boolean;
}

const DOUBLE = new Set(['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ']);
const COMPLEX_VOWEL = new Set(['ㅐ', 'ㅔ', 'ㅒ', 'ㅖ']);
const COMPOUND_VOWEL = new Set(['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']);

export function wordFeatures(word: string): WordFeatures | null {
  const frames = wordFrames(word);
  if (!frames) return null;
  const need = requiredJamo(frames);
  return {
    syllables: frames.length,
    hasJong: frames.some((f) => f.hasJong),
    hasDoubleConsonant: frames.some((f) => DOUBLE.has(f.cho) || DOUBLE.has(f.jong)),
    hasComplexVowel: frames.some((f) => COMPLEX_VOWEL.has(f.jung)),
    hasCompoundVowel: frames.some((f) => COMPOUND_VOWEL.has(f.jung)),
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
  return Math.max(0, f.syllables - 2) + (f.hasJong ? 1 : 0) + (f.hasDoubleConsonant ? 1 : 0) + (f.hasComplexVowel ? 1 : 0) + (f.hasCompoundVowel ? 1.5 : 0) + (f.hasRepeatedJamo ? 0.5 : 0);
}

/**
 * 출제 단계: 받침 없음 → 받침 → 쌍자음·ㅐ류 모음 → 겹모음(ㅘ·ㅝ·ㅢ …, 31단계부터).
 * 한 단계에 새 요소를 하나씩만 더하려는 구분이다 (뒤 단계 요소가 하나라도 있으면 뒤 단계).
 */
export type WordTier = 'plain' | 'jong' | 'tense' | 'compound';

export function wordTier(word: string): WordTier | null {
  const f = wordFeatures(word);
  if (!f) return null;
  if (f.hasCompoundVowel) return 'compound';
  if (f.hasDoubleConsonant || f.hasComplexVowel) return 'tense';
  return f.hasJong ? 'jong' : 'plain';
}
