// 전투 목록. 적은 한 번에 한 마리 (대각선 대치 구도).
// 3~5단계는 조립 난이도(받침 없음 → 받침 → 쌍자음·ㅐ)로 단어를 나눠 낸다. 마지막 보스는 팩 전체.
import { wordDifficulty, wordTier, type WordTier } from '../core/assembly';
import type { FoeSpawn } from '../core/types';
import { EASY_FIVE, EASY_MORE, packWords, vocabById, type PackId, type VocabEntry } from './vocab';

export interface StageDef {
  id: string;
  name: string;
  /** 부모가 읽는 짧은 설명 (전투 고르기 화면의 아이콘 아래) */
  focus: string;
  icon: 'dino' | 'imp' | 'charger' | 'boss';
  foes: FoeSpawn[];
  /** 고정 출제 순서 (있으면 이 순서대로) */
  fixedWords?: string[];
  /** 출제 후보: 단어 목록, 'pack'(부모 설정의 연령팩 전체), 또는 연령팩 안의 한 난이도 단계 */
  pool: string[] | 'pack' | { tier: WordTier };
  boss?: boolean;
}

export const STAGES: StageDef[] = [
  {
    // 수박은 첫 문제 한 번만. 세 번 반복하면 "수박만 나온다"로 느껴졌다 (2026-09-28 사용자 제보).
    id: 's1',
    name: '첫 출동: 수박',
    focus: '수박부터',
    icon: 'dino',
    foes: [{ kind: 'dino', harmless: true }],
    fixedWords: ['수박'],
    pool: [...EASY_FIVE],
  },
  {
    id: 's2',
    name: '쉬운 단어',
    focus: '쉬운 단어',
    icon: 'imp',
    foes: [{ kind: 'imp' }, { kind: 'dino' }],
    pool: [...EASY_FIVE, ...EASY_MORE],
  },
  {
    id: 's3',
    name: '작은 괴물 떼',
    focus: '받침 없음',
    icon: 'imp',
    foes: [{ kind: 'imp' }, { kind: 'dino' }],
    pool: { tier: 'plain' },
  },
  {
    id: 's4',
    name: '뿔공룡 습격',
    focus: '받침',
    icon: 'charger',
    foes: [{ kind: 'dino' }, { kind: 'charger' }],
    pool: { tier: 'jong' },
  },
  {
    id: 's5',
    name: '돌진 공룡 무리',
    focus: '쌍자음·ㅐ',
    icon: 'charger',
    foes: [{ kind: 'imp' }, { kind: 'charger' }],
    pool: { tier: 'tense' },
  },
  {
    id: 's6',
    name: '거대 공룡',
    focus: '모든 단어',
    icon: 'boss',
    boss: true,
    foes: [{ kind: 'boss' }],
    pool: 'pack',
  },
];

export function stageById(id: string): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}

/** 한 단계의 후보가 이보다 적으면 다른 연령팩의 같은 단계 단어를 더한다 (예: 7~8세 팩의 받침 없는 단어는 7개뿐) */
export const MIN_STAGE_WORDS = 8;

/** 이 전투에서 낼 수 있는 단어 (부모 설정의 연령팩·권장 어휘 포함 여부를 따른다) */
export function stageWords(stage: StageDef, pack: PackId, includeRecommended: boolean): VocabEntry[] {
  if (Array.isArray(stage.pool)) return stage.pool.map((w) => vocabById(w)).filter((x): x is VocabEntry => !!x);
  const mine = packWords(pack, includeRecommended);
  if (stage.pool === 'pack') return mine;
  const tier = stage.pool.tier;
  const inTier = (list: VocabEntry[]) => list.filter((w) => wordTier(w.word) === tier);
  const chosen = inTier(mine);
  if (chosen.length >= MIN_STAGE_WORDS) return chosen;
  return [...chosen, ...inTier(packWords(pack === '4-6' ? '7-8' : '4-6', includeRecommended))];
}

/** 출제 순서용 난이도: 조립 난이도 + 소리와 표기가 다른 단어(공룡→[공뇽])는 1 더 */
export function entryDifficulty(entry: VocabEntry): number {
  return wordDifficulty(entry.word) + (entry.soundMatchesSpelling ? 0 : 1);
}
