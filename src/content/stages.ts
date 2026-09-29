// 전투(스테이지) 목록. 2026-09-28 사용자 지시("Stage 1~10은 쉬운 난이도의 완성된 게임")에 따라 다시 짰다.
// 1~10단계: 첫 지역(공룡 들판). 처음부터 함정·콤보·공격 연출·적 피격·대사가 모두 나오고,
// 단계마다 새 요소를 하나씩 더한다 (2연타 → 받침 → 두 마리 동시 + 범위 공격 → 중간 보스 → … → 최종 보스와 최고 필살기).
// 11단계부터: 끝없이 이어진다. 단계 번호와 시드로 만드는 생성기(generateStage)가 난이도 규칙(DIFFICULTY_BANDS)을 따라
// 같은 번호면 늘 같은 전투를 만든다. 난이도는 GEN.capAt 단계에서 멈추고(상한), 5의 배수는 중간 보스, 10의 배수는 대형 보스.
// 10단계마다 새 지역. 적 체력·함정 수·콤보 여유는 플레이테스트용 임시값이다.
import { wordDifficulty, wordFeatures, wordTier, type TrapGrade, type WordTier } from '../core/assembly';
import { createRng } from '../core/rng';
import type { AttackTier, FoeKind, FoeSpawn } from '../core/types';
import { EASY_FIVE, packWords, vocabById, type PackId, type VocabEntry } from './vocab';

/** r1 = 1~10단계, r2 = 11~20단계, … (10단계마다 하나) */
export type RegionId = `r${number}`;

export interface RegionDef {
  id: RegionId;
  /** 몇 번째 지역인가 (1부터) */
  index: number;
  name: string;
  /** 부모에게 보이는 한 줄 설명 */
  blurb: string;
}

/** 11단계부터의 지역 이름. 다 쓰면 같은 이름에 번호를 붙여 다시 돈다 (화산섬 2 …). */
const REGION_NAMES = ['화산섬', '얼음 골짜기', '구름 성', '깊은 바다', '모래 유적', '별빛 우주', '버섯 숲', '번개 산'];

/** 지역 그림·배경 종류: 0 = 공룡 들판, 1 = 화산섬, 2 = 얼음 골짜기 … (REGION_NAMES 순서, 돌아가며 반복) */
export function regionLook(index: number): number {
  return index <= 1 ? 0 : 1 + ((index - 2) % REGION_NAMES.length);
}

export function regionIndexOf(num: number): number {
  return Math.max(1, Math.ceil(num / 10));
}

export function regionAt(index: number): RegionDef {
  if (index <= 1) return { id: 'r1', index: 1, name: '공룡 들판', blurb: '1~10단계: 쉬운 두 글자 단어, 받침, 여러 적, 중간 보스와 거대 공룡' };
  const k = index - 2;
  const base = REGION_NAMES[k % REGION_NAMES.length];
  const round = Math.floor(k / REGION_NAMES.length);
  const from = (index - 1) * 10 + 1;
  const band = bandFor(Math.min(from, GEN.capAt))!;
  return { id: `r${index}`, index, name: round ? `${base} ${round + 1}` : base, blurb: `${from}~${from + 9}단계: ${band.blurb}` };
}

export function regionById(id: string): RegionDef | undefined {
  const m = /^r(\d+)$/.exec(id);
  return m ? regionAt(Number(m[1])) : undefined;
}

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
    focus: '적 세 마리 · 갑옷',
    icon: 'armor',
    // 갑옷 공룡 첫 등장: 방패 하나를 먼저 깨야 한다 (무료 구간에서 적 다섯 종류를 모두 본다)
    waves: [[{ kind: 'imp' }, { kind: 'dino' }, { kind: 'armor', shield: 1 }]],
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
  /** D. 모음: basic = 기본·ㅐ류, mixed = 겹모음 ㅘ·ㅝ·ㅚ·ㅟ도 (조립틀 mixed, 31단계부터) */
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
  /** 부모 안내에 쓰는 한 줄 설명 */
  blurb: string;
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
    blurb: '세 글자 단어, 더 헷갈리는 함정, 갑옷 공룡과 무리 공격',
  },
  {
    from: 31,
    to: 60,
    traps: { count: [5, 6], hardShare: 0.5, advanced: true },
    syllables: [2, 3, 4],
    tiers: ['jong', 'tense', 'compound'],
    vowels: 'mixed',
    guide: 'less',
    comboScale: 0.8,
    maxFoes: 3,
    behaviours: ['pack', 'heavy', 'shield', 'dodge'],
    fxScale: 1.6,
    planned: ['보스 패턴', '필살기 변형'],
    blurb: '네 글자까지, 받침·쌍자음 위주, 방패 두른 보스',
  },
  {
    from: 61,
    to: null,
    traps: { count: [6, 6], hardShare: 0.6, advanced: true },
    syllables: [3, 4],
    tiers: ['plain', 'jong', 'tense', 'compound'],
    vowels: 'mixed',
    guide: 'less',
    comboScale: 0.75,
    maxFoes: 3,
    behaviours: ['pack', 'heavy', 'shield', 'dodge', 'buff'],
    fxScale: 1.7,
    planned: ['새 콤보', '새 배경', '특수 보스'],
    blurb: '가장 어려운 함정과 긴 단어 (난이도는 여기서 더 오르지 않는다)',
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

// ───────────── 11단계 이후 생성기 ─────────────

/**
 * 생성기 설정. version을 올리면 같은 번호의 전투 내용이 바뀐다 (깬 기록은 번호로 남으므로 그대로).
 * capAt: 이 단계부터 난이도(함정·단어 길이·콤보 여유·적 수·보스 체력)가 더 오르지 않는다.
 */
export const GEN = { seed: 0x5eed, version: 1, capAt: 61 };
/** 번호로 만들 수 있는 가장 큰 단계 (저장 데이터의 이상한 번호를 막는 안전장치) */
export const MAX_STAGE = 99999;

/** 무리 구성 후보. 갑옷 공룡은 늘 방패를 두르고 나온다. */
const PACKS: FoeKind[][] = [
  ['imp', 'dino', 'imp'],
  ['dino', 'charger'],
  ['charger', 'imp', 'dino'],
  ['imp', 'imp', 'charger'],
  ['dino', 'armor'],
  ['imp', 'charger', 'armor'],
];

/** 11~15단계는 이름을 손으로 붙였다 (예전 목록과 같은 이름) */
const NAMED: Record<number, Partial<StageDef>> = {
  11: { name: '화산섬 상륙', intro: 'd_region2' },
  12: { name: '방패 공룡' },
  13: { name: '용암 늪 괴물' },
  14: { name: '화산 협곡' },
  15: { name: '용암 대장', intro: 'd_s5' },
};

function mix(...xs: number[]): number {
  let h = 2166136261;
  for (const x of xs) {
    h ^= x >>> 0;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// 권장 어휘를 끈 부모 설정에서도 모자라지 않게, 더 적은 쪽(권장 제외)으로 센다
const ALL_WORDS = (): VocabEntry[] => [...packWords('4-6', false), ...packWords('7-8', false), ...packWords('9+', false)];

/** 모든 연령팩을 합쳐 이 조건의 단어가 충분한가 (stageWords는 한 팩에서 모자라면 다른 팩을 더한다) */
function enoughWords(f: WordFilter): boolean {
  return ALL_WORDS().filter((w) => matches(f, w)).length >= MIN_STAGE_WORDS;
}

const cache = new Map<string, StageDef>();

/**
 * num단계(11 이상)를 만든다. 같은 num·seed면 늘 같은 결과 (무작위는 번호에서 나온 시드로만).
 * 난이도는 min(num, GEN.capAt)으로 계산해 상한을 둔다. 5의 배수 = 중간 보스, 10의 배수 = 대형 보스.
 */
export function generateStage(num: number, seed = GEN.seed): StageDef {
  const key = `${seed}:${num}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const rng = createRng(mix(seed, GEN.version, num));
  const level = Math.min(num, GEN.capAt);
  const band = bandFor(level)!;
  const t = band.to === null ? 1 : (level - band.from) / Math.max(1, band.to - band.from);
  const count = Math.round(band.traps.count[0] + (band.traps.count[1] - band.traps.count[0]) * t);
  const shield = band.behaviours.includes('shield');
  const bigBoss = num % 10 === 0;
  const midBoss = !bigBoss && num % 5 === 0;
  const size = Math.min(band.maxFoes, 2 + Math.floor(rng() * 2));
  const pack = (): FoeSpawn[] =>
    PACKS[Math.floor(rng() * PACKS.length)].slice(0, size).map((kind): FoeSpawn => (kind === 'armor' ? { kind, ...(shield ? { shield: 1 } : {}) } : { kind }));
  // 보스 체력도 상한이 있다: 대형 12, 중간 9
  const bossHp = bigBoss ? Math.min(12, 9 + Math.floor((level - 10) / 25)) : Math.min(9, 7 + Math.floor((level - 15) / 25));
  const boss: FoeSpawn | null = bigBoss
    ? { kind: 'boss', hp: bossHp, finalBlow: 'finisher', writeFinish: 4, ...(shield ? { shield: 2 } : {}) }
    : midBoss
      ? { kind: 'chief', hp: bossHp, finalBlow: 'finisher', ...(shield ? { shield: 2 } : {}) }
      : null;
  const waves: FoeSpawn[][] = boss ? [pack().slice(0, 2), [boss]] : [pack(), pack()];

  // 단어: 긴 단어 / 받침 / 쌍자음·ㅐ류 중 하나에 초점. 단어가 모자라면 넓힌다 (빈 전투가 나오지 않게).
  const longest = Math.max(...band.syllables);
  const focusList: { f: WordFilter; label: string }[] = [
    { f: { syllables: [longest], tiers: band.tiers }, label: `${longest}글자` },
    { f: { syllables: band.syllables, tiers: ['jong'] }, label: '받침' },
    { f: { syllables: band.syllables, tiers: ['tense'] }, label: '쌍자음 · ㅐ' },
    // 31단계부터: 겹모음 (ㅘ·ㅝ·ㅢ …). 단어가 모자라면 아래에서 다른 초점으로 넓힌다
    ...(band.tiers.includes('compound') ? [{ f: { syllables: [1, 2, 3], tiers: ['compound'] as WordTier[] }, label: '겹모음' }] : []),
  ];
  // 초점은 번호로 돌린다 (무작위로 고르면 같은 초점이 몇 번 이어져 지루했다)
  // 11단계(화산섬 첫 전투)가 긴 단어로 시작한다: 11 긴 단어 → 12 받침 → 13 쌍자음·ㅐ → …
  let focus = focusList[(num - 11) % focusList.length];
  if (!enoughWords(focus.f)) focus = focusList.find((x) => enoughWords(x.f)) ?? { f: { syllables: band.syllables, tiers: band.tiers }, label: '여러 단어' };
  if (!enoughWords(focus.f)) focus = { f: { syllables: [1, 2, 3], tiers: ['plain', 'jong', 'tense'] }, label: '여러 단어' };

  const region = regionAt(regionIndexOf(num));
  const armored = waves.flat().some((f) => f.kind === 'armor');
  const plainNames = focus.label === '받침' ? ['받침 공룡 떼', '받침 괴물 습격'] : focus.label.startsWith('쌍') ? ['쌍자음 괴물', '된소리 습격'] : [`${focus.label} 습격`, '긴 단어 공룡 떼'];
  const name = bigBoss ? `대형 보스: ${region.name}의 거대 공룡` : midBoss ? `중간 보스: ${region.name} 대장` : armored && rng() < 0.5 ? '갑옷 공룡 행진' : plainNames[Math.floor(rng() * plainNames.length)];
  const def: StageDef = {
    id: `s${num}`,
    num,
    region: region.id,
    name,
    focus: bigBoss ? '대형 보스' : midBoss ? '중간 보스' : armored ? `${focus.label} · 갑옷` : focus.label,
    icon: boss ? boss.kind : waves[0][0].kind,
    waves,
    pool: focus.f,
    traps: trapMix(count, band.traps.hardShare),
    advancedTraps: band.traps.advanced,
    comboScale: band.comboScale,
    fxScale: band.fxScale,
    guide: band.guide,
    ...(bigBoss ? { boss: 'final' as const } : midBoss ? { boss: 'mid' as const } : {}),
    ...(num % 10 === 1 && num > 11 ? { intro: 'd_regionnew' } : {}),
    ...NAMED[num],
  };
  if (cache.size > 500) cache.clear();
  cache.set(key, def);
  return def;
}

/** num단계 (1~10은 손으로 만든 공룡 들판, 11부터 생성기) */
export function stageAt(num: number): StageDef {
  const n = Math.max(1, Math.min(MAX_STAGE, Math.floor(num)));
  return n <= REGION1.length ? REGION1[n - 1] : generateStage(n);
}

/** 1~n단계 목록 (지도·테스트용) */
export function stagesUpTo(n: number): StageDef[] {
  return Array.from({ length: n }, (_, i) => stageAt(i + 1));
}

/** 무료 구간 (손으로 만든 1~10단계) */
export const FREE_STAGES: readonly StageDef[] = REGION1;

export function stageNum(id: string): number | null {
  const m = /^s(\d+)$/.exec(id);
  const n = m ? Number(m[1]) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= MAX_STAGE ? n : null;
}

export function stageById(id: string): StageDef | undefined {
  const n = stageNum(id);
  return n === null ? undefined : stageAt(n);
}

/** 아직 안 깬 가장 앞 단계 번호 (앞에서부터 이어서 깬 만큼 + 1) */
export function frontier(cleared: readonly string[]): number {
  const done = new Set(cleared);
  let n = 1;
  while (n < MAX_STAGE && done.has(`s${n}`)) n++;
  return n;
}

/** 출격할 전투: 아직 안 깬 가장 앞 단계. 단계가 끝없이 이어지므로 1단계로 돌아가지 않는다. */
export function nextStageId(cleared: readonly string[]): string {
  return `s${frontier(cleared)}`;
}

/** 지역의 마지막 전투(10의 배수)를 깨면 다음 지역 발견 장면을 보여 준다 */
export function regionEnd(stage: StageDef): RegionDef | null {
  return stage.num % 10 === 0 ? regionAt(stage.num / 10 + 1) : null;
}

/** 한 단계의 후보가 이보다 적으면 다른 연령팩의 같은 조건 단어를 더한다 */
export const MIN_STAGE_WORDS = 8;

function matches(f: WordFilter, w: VocabEntry): boolean {
  const feat = wordFeatures(w.word);
  const tier = wordTier(w.word);
  return !!feat && !!tier && f.syllables.includes(feat.syllables) && f.tiers.includes(tier);
}

const PACK_NEIGHBOURS: Record<PackId, PackId[]> = { '4-6': ['7-8', '9+'], '7-8': ['4-6', '9+'], '9+': ['7-8', '4-6'] };

/** 이 전투에서 낼 수 있는 단어 (부모 설정의 연령팩·권장 어휘 포함 여부를 따른다) */
export function stageWords(stage: StageDef, pack: PackId, includeRecommended: boolean): VocabEntry[] {
  if (Array.isArray(stage.pool)) return stage.pool.map((w) => vocabById(w)).filter((x): x is VocabEntry => !!x);
  const mine = packWords(pack, includeRecommended);
  if (stage.pool === 'pack') return mine;
  const f = stage.pool;
  const chosen = mine.filter((w) => matches(f, w));
  if (chosen.length >= MIN_STAGE_WORDS) return chosen;
  // 모자라면 가까운 레벨부터 같은 조건의 단어를 더한다 (4~6 → 7~8 → 9+, 9+ → 7~8 → 4~6)
  const out = [...chosen];
  for (const other of PACK_NEIGHBOURS[pack]) {
    if (out.length >= MIN_STAGE_WORDS) break;
    out.push(...packWords(other, includeRecommended).filter((w) => matches(f, w)));
  }
  return out;
}

/** 출제 순서용 난이도: 조립 난이도 + 소리와 표기가 다른 단어(공룡→[공뇽])는 1 더 */
export function entryDifficulty(entry: VocabEntry): number {
  return wordDifficulty(entry.word) + (entry.soundMatchesSpelling ? 0 : 1);
}

/**
 * 소리를 낼 수 없는 단어(기기 음성 없음 + 녹음 파일 없음)는 되도록 내지 않는다: 들을 수 있는 단어가 min개 이상이면 그것만,
 * 모자라면 전체를 그대로 쓴다 (자막과 그림으로 부모와 함께 진행).
 */
export function hearablePool(words: string[], canHear: (w: string) => boolean, min = MIN_STAGE_WORDS): string[] {
  const ok = words.filter(canHear);
  return ok.length >= Math.min(min, words.length) ? ok : words;
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
