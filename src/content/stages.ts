// 전투(스테이지) 목록. 2026-09-28 사용자 지시("Stage 1~10은 쉬운 난이도의 완성된 게임")에 따라 다시 짰다.
// 1~10단계: 첫 지역(공룡 들판). 처음부터 함정·콤보·공격 연출·적 피격·대사가 모두 나오고,
// 단계마다 새 요소를 하나씩 더한다 (2연타 → 받침 → 두 마리 동시 + 범위 공격 → 중간 보스 → … → 최종 보스와 최고 필살기).
// 11단계부터: 두 번째 지역(화산섬). 난이도 규칙(DIFFICULTY_BANDS)으로 만든다. 지금은 11~15단계만 넣어 검증한다.
// 적 체력·함정 수·콤보 여유는 플레이테스트용 임시값이다.
import { wordDifficulty, wordFeatures, wordTier, type TrapGrade, type WordTier } from '../core/assembly';
import type { AttackTier, FoeKind, FoeSpawn } from '../core/types';
import { EASY_FIVE, packWords, vocabById, type PackId, type VocabEntry } from './vocab';

export type RegionId = 'r1' | 'r2';

export interface RegionDef {
  id: RegionId;
  name: string;
  /** 부모에게 보이는 한 줄 설명 */
  blurb: string;
}

export const REGIONS: RegionDef[] = [
  { id: 'r1', name: '공룡 들판', blurb: '1~10단계: 쉬운 두 글자 단어, 받침, 여러 적, 중간 보스와 거대 공룡' },
  { id: 'r2', name: '화산섬', blurb: '11단계부터: 세 글자 단어, 더 헷갈리는 함정, 방패 공룡과 무리 공격' },
];

/** 연령팩 안에서 단어 고르기: 음절 수와 조립 단계(받침 없음·받침·쌍자음/ㅐ류) */
export interface WordFilter {
  syllables: number[];
  tiers: WordTier[];
}

export interface StageDef {
  id: string;
  /** 몇 단계인가 (1부터) */
  num: number;
  region: RegionId;
  name: string;
  /** 부모가 읽는 짧은 설명 (전투 고르기 화면의 아이콘 아래) */
  focus: string;
  icon: FoeKind;
  /** 적 무리 차례대로. 한 무리는 1~3마리가 동시에 나온다. */
  waves: FoeSpawn[][];
  /** 고정 출제 순서 (있으면 이 순서대로) */
  fixedWords?: string[];
  /** 출제 후보: 단어 목록, 'pack'(부모 설정의 연령팩 전체), 또는 연령팩 안의 조건 */
  pool: string[] | 'pack' | WordFilter;
  /** 한 음절(또는 한꺼번에 조립할 때 단어)에 섞는 함정의 난이도 목록. 길이 = 함정 수 */
  traps: TrapGrade[];
  /** 아직 배우지 않은 쌍자음·ㅐ류도 함정으로 쓸 수 있는가 (없으면 단어에 같은 무리가 있을 때만) */
  advancedTraps?: boolean;
  /** 콤보 보너스 시간 배율 (1보다 작으면 빠듯하다) */
  comboScale?: number;
  /** 첫 공격은 적어도 이 단계로 나간다 (새 공격 소개) */
  unlock?: AttackTier;
  /** 첫 적이 나올 때의 대사 (없으면 기본 대사) */
  intro?: string;
  /** 공격 연출 크기 배율 (단계가 오를수록 화려하게) */
  fxScale?: number;
  boss?: 'mid' | 'final';
  /** 칸 안내(흐린 정답 글자): full = 처음 보는 단어는 첫 음절까지, less = 처음 보는 단어만 */
  guide?: 'full' | 'less';
}

const E: TrapGrade = 'easy';
const M: TrapGrade = 'medium';
const H: TrapGrade = 'hard';

/** 1~10단계: 사용자 지시 8절 권장 구성을 따른 손 조정 */
const REGION1: StageDef[] = [
  {
    // 수박은 첫 문제 한 번만. 세 번 반복하면 "수박만 나온다"로 느껴졌다 (2026-09-28 사용자 제보).
    // 공룡이 약해지면(체력 2 이하) 에너지가 가득 차서 첫 전투부터 직접 쓰는 필살기를 한 번 보여 준다.
    id: 's1',
    num: 1,
    region: 'r1',
    name: '첫 출동',
    focus: '쉬운 두 글자',
    icon: 'dino',
    waves: [[{ kind: 'dino', hp: 4, harmless: true, writeFinish: 2 }]],
    fixedWords: ['수박'],
    pool: [...EASY_FIVE],
    traps: [E, E],
  },
  {
    id: 's2',
    num: 2,
    region: 'r1',
    name: '빨리 만들면 2연타',
    focus: '두 글자 · 연타',
    icon: 'imp',
    waves: [[{ kind: 'imp' }], [{ kind: 'dino' }]],
    pool: { syllables: [2], tiers: ['plain'] },
    traps: [E, M],
    intro: 'd_s2',
  },
  {
    id: 's3',
    num: 3,
    region: 'r1',
    name: '받침 공룡',
    focus: '받침',
    icon: 'charger',
    waves: [[{ kind: 'imp' }], [{ kind: 'charger', hp: 3 }]],
    pool: { syllables: [1, 2], tiers: ['jong'] },
    traps: [E, M],
    intro: 'd_s3',
    fxScale: 1.2,
  },
  {
    id: 's4',
    num: 4,
    region: 'r1',
    name: '두 마리 동시 습격',
    focus: '범위 공격',
    icon: 'dino',
    waves: [[{ kind: 'imp' }, { kind: 'dino' }], [{ kind: 'charger', hp: 3 }]],
    pool: { syllables: [2], tiers: ['plain', 'jong'] },
    traps: [E, M, M],
    unlock: 'missiles',
    intro: 'd_s4',
    fxScale: 1.2,
  },
  {
    id: 's5',
    num: 5,
    region: 'r1',
    name: '중간 보스: 대장 뿔공룡',
    focus: '중간 보스',
    icon: 'chief',
    boss: 'mid',
    waves: [[{ kind: 'imp' }], [{ kind: 'chief', hp: 6, finalBlow: 'finisher' }]],
    pool: { syllables: [2], tiers: ['plain', 'jong'] },
    traps: [E, M, M],
    intro: 'd_s5',
    fxScale: 1.25,
  },
  {
    id: 's6',
    num: 6,
    region: 'r1',
    name: '새 글자 괴물',
    focus: '쌍자음 · ㅐ',
    icon: 'imp',
    waves: [[{ kind: 'dino' }, { kind: 'imp' }], [{ kind: 'charger', hp: 3 }]],
    pool: { syllables: [1, 2], tiers: ['tense'] },
    traps: [E, M, H],
    intro: 'd_s6',
    fxScale: 1.25,
  },
  {
    id: 's7',
    num: 7,
    region: 'r1',
    name: '줄지어 오는 적',
    focus: '콤보 잇기',
    icon: 'imp',
    waves: [[{ kind: 'imp' }], [{ kind: 'imp' }], [{ kind: 'imp' }], [{ kind: 'dino' }]],
    pool: { syllables: [2], tiers: ['plain', 'jong', 'tense'] },
    traps: [E, M, M, H],
    comboScale: 1.1,
    intro: 'd_s7',
    fxScale: 1.3,
  },
  {
    id: 's8',
    num: 8,
    region: 'r1',
    name: '세 마리 협공',
    focus: '적 세 마리',
    icon: 'charger',
    waves: [[{ kind: 'imp' }, { kind: 'dino' }, { kind: 'charger', hp: 3 }]],
    pool: { syllables: [1, 2], tiers: ['plain', 'jong', 'tense'] },
    traps: [E, M, M, H],
    intro: 'd_s8',
    fxScale: 1.3,
  },
  {
    id: 's9',
    num: 9,
    region: 'r1',
    name: '보스 앞 결전',
    focus: '콤보 4~5',
    icon: 'dino',
    waves: [[{ kind: 'imp' }, { kind: 'imp' }], [{ kind: 'dino' }, { kind: 'charger', hp: 3 }]],
    pool: { syllables: [2], tiers: ['plain', 'jong'] },
    traps: [E, E, M, H],
    // 콤보 4~5가 자연스럽게 나오도록 여유를 조금 더 준다
    comboScale: 1.3,
    intro: 'd_s9',
    fxScale: 1.35,
  },
  {
    id: 's10',
    num: 10,
    region: 'r1',
    name: '최종 보스: 거대 공룡',
    focus: '최종 보스',
    icon: 'boss',
    boss: 'final',
    // 보스가 약해지면(체력 4 이하) 에너지가 가득 차서, 마지막 일격은 늘 직접 쓴 최고 필살기 (콤보가 낮아도 한 번은 본다)
    waves: [[{ kind: 'imp' }, { kind: 'imp' }], [{ kind: 'boss', hp: 8, writeFinish: 4 }]],
    pool: { syllables: [1, 2], tiers: ['plain', 'jong', 'tense'] },
    traps: [E, M, M, H],
    intro: 'd_boss',
    fxScale: 1.45,
  },
];

// ───────────── 11단계 이후 난이도 규칙 (사용자 지시 6·7절) ─────────────

/** 적 행동. planned는 규칙에만 적어 두고 아직 게임에 없는 것 */
export type FoeBehaviour = 'pack' | 'heavy' | 'shield' | 'dodge' | 'buff';

export interface DifficultyBand {
  from: number;
  to: number | null;
  /** A. 함정: 음절마다 개수(구간 처음→끝)와 그중 '어려움' 비율 */
  traps: { count: [number, number]; hardShare: number; advanced: boolean };
  /** B·C·E. 단어 길이와 조립 단계 (받침·쌍자음/ㅐ류) */
  syllables: number[];
  tiers: WordTier[];
  /** D. 모음: basic = 기본·ㅐ류, mixed = ㅘ·ㅝ·ㅚ·ㅟ (조립틀이 아직 지원하지 않아 planned) */
  vowels: 'basic' | 'mixed';
  /** F. 칸 안내 */
  guide: 'full' | 'less';
  /** H. 콤보 보너스 시간 배율 (느려도 진행은 막지 않는다) */
  comboScale: number;
  /** G. 한 무리의 최대 적 수와 적 행동 */
  maxFoes: number;
  behaviours: FoeBehaviour[];
  /** 7절: 전투 연출 방향 (구현된 것: 연출 크기) */
  fxScale: number;
  /** 아직 게임에 넣지 않은 규칙 */
  planned: string[];
}

export const DIFFICULTY_BANDS: DifficultyBand[] = [
  {
    from: 11,
    to: 30,
    traps: { count: [4, 5], hardShare: 0.4, advanced: true },
    syllables: [2, 3],
    tiers: ['plain', 'jong', 'tense'],
    vowels: 'basic',
    guide: 'less',
    comboScale: 0.9,
    maxFoes: 3,
    behaviours: ['pack', 'heavy', 'shield'],
    fxScale: 1.5,
    planned: ['피하기(dodge)', '차례 강화(buff)', '환경 연출'],
  },
  {
    from: 31,
    to: 60,
    traps: { count: [5, 6], hardShare: 0.5, advanced: true },
    syllables: [2, 3, 4],
    tiers: ['jong', 'tense'],
    vowels: 'mixed',
    guide: 'less',
    comboScale: 0.8,
    maxFoes: 3,
    behaviours: ['pack', 'heavy', 'shield', 'dodge'],
    fxScale: 1.6,
    planned: ['겹모음 ㅘ·ㅝ·ㅚ·ㅟ 조립틀', '갑옷 적', '보스 패턴', '필살기 변형'],
  },
  {
    from: 61,
    to: null,
    traps: { count: [6, 6], hardShare: 0.6, advanced: true },
    syllables: [3, 4],
    tiers: ['plain', 'jong', 'tense'],
    vowels: 'mixed',
    guide: 'less',
    comboScale: 0.75,
    maxFoes: 3,
    behaviours: ['pack', 'heavy', 'shield', 'dodge', 'buff'],
    fxScale: 1.7,
    planned: ['새 콤보', '새 배경', '특수 보스'],
  },
];

export function bandFor(num: number): DifficultyBand | undefined {
  return DIFFICULTY_BANDS.find((b) => num >= b.from && (b.to === null || num <= b.to));
}

/** 함정 난이도 목록: 어려움을 비율만큼, 나머지는 중간과 쉬움 (쉬움은 하나는 남긴다) */
export function trapMix(count: number, hardShare: number): TrapGrade[] {
  const hard = Math.min(count - 1, Math.round(count * hardShare));
  const easy = count - hard > 2 ? 1 : 0;
  return [...Array<TrapGrade>(hard).fill(H), ...Array<TrapGrade>(count - hard - easy).fill(M), ...Array<TrapGrade>(easy).fill(E)];
}

const WAVE_ROTATION: FoeKind[][] = [
  ['imp', 'dino', 'imp'],
  ['dino', 'charger'],
  ['charger', 'imp', 'dino'],
  ['imp', 'imp', 'charger'],
];

/**
 * 규칙으로 한 단계를 만든다. 5의 배수 단계는 보스(대장 → 거대 공룡 번갈아), 그 밖은 적 무리 두 번.
 * 방패는 규칙에 shield가 있을 때 뿔공룡·보스에 붙는다. 이름·설명은 overrides로 준다.
 */
export function stageFromRules(num: number, region: RegionId, overrides: Partial<StageDef> & Pick<StageDef, 'name' | 'focus'>): StageDef {
  const band = bandFor(num)!;
  const t = band.to === null ? 1 : (num - band.from) / Math.max(1, band.to - band.from);
  const count = Math.round(band.traps.count[0] + (band.traps.count[1] - band.traps.count[0]) * t);
  const shield = band.behaviours.includes('shield');
  const bossStage = num % 5 === 0;
  const k = num - band.from;
  const size = Math.min(band.maxFoes, 2 + (k % 2));
  const pack = (i: number): FoeSpawn[] =>
    WAVE_ROTATION[(k + i) % WAVE_ROTATION.length].slice(0, size).map((kind) => ({ kind, ...(shield && kind === 'charger' ? { shield: 1 } : {}) }));
  const bossKind: FoeKind = (num / 5) % 2 === 0 ? 'boss' : 'chief';
  const waves: FoeSpawn[][] = bossStage
    ? [pack(0).slice(0, 2), [{ kind: bossKind, hp: bossKind === 'boss' ? 9 : 7, finalBlow: 'finisher', ...(shield ? { shield: 2 } : {}), ...(bossKind === 'boss' ? { writeFinish: 4 } : {}) }]]
    : [pack(0), pack(1)];
  // 단어: 단계마다 초점을 바꾼다 (긴 단어 → 받침 → 쌍자음·ㅐ류)
  const longest = Math.max(...band.syllables);
  const focus: WordFilter[] = [
    { syllables: [longest], tiers: band.tiers },
    { syllables: band.syllables, tiers: ['jong'] },
    { syllables: band.syllables, tiers: ['tense'] },
  ];
  return {
    id: `s${num}`,
    num,
    region,
    icon: bossStage ? bossKind : waves[0][0].kind,
    waves,
    pool: focus[k % focus.length],
    traps: trapMix(count, band.traps.hardShare),
    advancedTraps: band.traps.advanced,
    comboScale: band.comboScale,
    fxScale: band.fxScale,
    guide: band.guide,
    ...(bossStage ? { boss: bossKind === 'boss' ? ('final' as const) : ('mid' as const) } : {}),
    ...overrides,
  };
}

/** 11~15단계만 실제로 넣어 규칙을 검증한다 (2026-09-28 지시). 더 늘릴 때는 이름만 더하면 된다. */
const REGION2: StageDef[] = [
  stageFromRules(11, 'r2', { name: '화산섬 상륙', focus: '세 글자', intro: 'd_region2' }),
  stageFromRules(12, 'r2', { name: '방패 뿔공룡', focus: '받침 · 방패' }),
  stageFromRules(13, 'r2', { name: '용암 늪 괴물', focus: '쌍자음 · ㅐ' }),
  stageFromRules(14, 'r2', { name: '화산 협곡', focus: '세 글자 · 무리' }),
  stageFromRules(15, 'r2', { name: '용암 대장', focus: '방패 보스', intro: 'd_s5' }),
];

export const STAGES: StageDef[] = [...REGION1, ...REGION2];

/** 이 지역의 마지막 단계를 깨면 다음 지역 발견 장면을 보여 준다 */
export function regionEnd(stage: StageDef): RegionDef | null {
  const next = STAGES.find((s) => s.num === stage.num + 1);
  return next && next.region !== stage.region ? (REGIONS.find((r) => r.id === next.region) ?? null) : null;
}

/**
 * 출격할 전투: 아직 안 깬 첫 전투. 다 깼으면 마지막으로 한 전투의 다음 전투(마지막 뒤에는 1단계)로 돌아가며
 * 이어서 한다. 예전에는 다 깨면 늘 마지막 보스로만 가서 "스테이지 대신 큰 공룡 하나"가 됐다 (2026-09-28 제보).
 */
export function nextStageId(cleared: readonly string[], lastStage: string | null): string {
  const done = new Set(cleared);
  const first = STAGES.find((s) => !done.has(s.id));
  if (first) return first.id;
  const i = STAGES.findIndex((s) => s.id === lastStage);
  return STAGES[(i + 1) % STAGES.length].id;
}

export function stageById(id: string): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}

/** 한 단계의 후보가 이보다 적으면 다른 연령팩의 같은 조건 단어를 더한다 */
export const MIN_STAGE_WORDS = 8;

function matches(f: WordFilter, w: VocabEntry): boolean {
  const feat = wordFeatures(w.word);
  const tier = wordTier(w.word);
  return !!feat && !!tier && f.syllables.includes(feat.syllables) && f.tiers.includes(tier);
}

/** 이 전투에서 낼 수 있는 단어 (부모 설정의 연령팩·권장 어휘 포함 여부를 따른다) */
export function stageWords(stage: StageDef, pack: PackId, includeRecommended: boolean): VocabEntry[] {
  if (Array.isArray(stage.pool)) return stage.pool.map((w) => vocabById(w)).filter((x): x is VocabEntry => !!x);
  const mine = packWords(pack, includeRecommended);
  if (stage.pool === 'pack') return mine;
  const f = stage.pool;
  const chosen = mine.filter((w) => matches(f, w));
  if (chosen.length >= MIN_STAGE_WORDS) return chosen;
  return [...chosen, ...packWords(pack === '4-6' ? '7-8' : '4-6', includeRecommended).filter((w) => matches(f, w))];
}

/** 출제 순서용 난이도: 조립 난이도 + 소리와 표기가 다른 단어(공룡→[공뇽])는 1 더 */
export function entryDifficulty(entry: VocabEntry): number {
  return wordDifficulty(entry.word) + (entry.soundMatchesSpelling ? 0 : 1);
}

/**
 * 단어 주머니: 전투 후보를 무작위로 섞어 하나씩 뽑는다 (2026-09-28 사용자 지시 "문제 랜덤으로").
 * 주머니를 다 비우기 전에는 같은 단어를 다시 내지 않고, 새로 섞을 때도 방금 낸 단어가 바로 나오지 않게 한다.
 */
export function drawWord(bag: string[], pool: string[], last: string, rng: () => number): { word: string; bag: string[] } {
  // 부모 설정이 바뀌어 후보가 달라졌으면 주머니에서 없는 단어를 뺀다
  let rest = bag.filter((w) => pool.includes(w) && w !== last);
  if (!rest.length) {
    rest = [...pool];
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    if (rest.length > 1 && rest[0] === last) [rest[0], rest[rest.length - 1]] = [rest[rest.length - 1], rest[0]];
  }
  const [word, ...remaining] = rest;
  return { word, bag: remaining };
}
