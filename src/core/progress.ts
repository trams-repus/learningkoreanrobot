// 진행 기록과 설정. 기기 안(localStorage)에만 저장한다. 아이의 이름·생년월일·목소리는 저장하지 않는다.
import type { CharacterTheme } from '../content/characters';
import type { PackId } from '../content/vocab';
import { ENERGY_CONFIG, type HelpLevel } from './combo';

export const SAVE_VERSION = 2;

export interface Settings {
  muted: boolean;
  voiceVolume: number;
  sfxVolume: number;
  reduceEffects: boolean;
  /** 떠다니는 자모 움직임 */
  jamoMotion: boolean;
  pack: PackId;
  includeRecommended: boolean;
  /** 자동: 플레이에 따라 도움 단계 조절 / 많이: B단계보다 어려워지지 않음 */
  helpMode: 'auto' | 'more';
  autoHelp: boolean;
  /** 단어를 받아 둔 사람 녹음(Commons)으로 읽기. 기본은 꺼짐: 기기 음성이 더 낫다는 사용자 결정 (2026-09-28) */
  useWordRecordings: boolean;
  /** 함께 싸울 캐릭터. 아직 고르지 않았으면 null. 바꿔도 기록·해금은 그대로 둔다. */
  characterTheme: CharacterTheme | null;
  /** 부모 화면 제안으로 켠 '더 자주 내기': 이 자모가 든 단어·이 단어를 전투 안에서 두 배로 자주 낸다 */
  focusJamo: string[];
  focusWords: string[];
  /** 부모가 고른 아이 만 나이 (AI에게 물어보기 프롬프트에만 씀). 생년월일은 받지 않는다. 모르면 null */
  childAge: number | null;
}

export interface WordStats {
  attempts: number;
  /** 도움 없이 성공 */
  independent: number;
  /** 흐린 자모·정답 자모 보기·손가락 안내를 본 성공 */
  assisted: number;
  /** 음성 다시 듣기 (정답 보기와 따로 센다) */
  replays: number;
  /** 정답 자모 보기 (도움 버튼) */
  hintViews: number;
  /** 다른 글자가 된 조립 */
  wrongSyllables: number;
  /** 도움 없이 성공한 가장 빠른 조합 시간 (ms). 도움받은 성공은 넣지 않는다. */
  bestIndependentMs: number | null;
  lastAssisted: boolean;
}

export interface Stats {
  battlesPlayed: Record<string, number>;
  battlesWon: Record<string, number>;
  words: Record<string, WordStats>;
  /** 틀리게 놓인 자모: '목표자모' 기준 횟수 */
  stuckJamo: Record<string, number>;
  bestCombo: number;
  finishers: number;
  reboots: number;
}

/**
 * 전투(스테이지) 구성 판. 전투 목록의 순서·뜻이 바뀌면 올린다: 옛 구성에서 깬 기록(s1~s4)이
 * 새 구성(s1~s6)에 그대로 붙어 출격이 엉뚱한 전투(보스)로 가는 것을 막는다.
 * 2 = 2026-09-28 받침·쌍자음 단계가 들어간 6단계 구성.
 * 3 = 2026-09-28 공룡 들판 1~10단계 재구성 + 화산섬 11~15단계 (예전 s1~s6 기록은 뜻이 달라 다시 시작).
 */
export const STAGE_SET = 3;

/**
 * 전투 구성이 바뀔 때 깬 기록을 지우지 않고 옮기는 표. STAGE_STEPS[n] = 구성 n의 전투 id → 구성 n+1의 전투 id.
 * 구성을 바꿀 때는 STAGE_SET을 올리고 여기에 한 칸을 더한다 (tests/progress.test.ts가 빠진 칸을 잡는다).
 * 대응이 애매하면 앞 단계로 붙인다: 조금 다시 하는 편이 안 배운 단계로 건너뛰는 것보다 낫다.
 */
export const STAGE_STEPS: Record<number, Record<string, string>> = {
  // 1 = stageSet이 없는 옛 저장. 4단계·6단계 구성 중 어느 것인지 구분할 수 없지만 둘 다 s1=수박 첫 출동, s2=쉬운 단어.
  1: { s1: 's1', s2: 's2' },
  // 2 = 6단계 구성 (쉬운 단어 → 받침 없음 → 받침 → 쌍자음·ㅐ → 거대 공룡) → 3 = 공룡 들판 1~10단계
  2: { s1: 's1', s2: 's2', s3: 's2', s4: 's3', s5: 's4', s6: 's5' },
};

/** stageSet이 없으면 구성 1. 지금보다 새 구성(옛 앱으로 되돌린 기기)은 대응을 알 수 없어 null. */
export function migrateStageIds(ids: readonly string[], fromSet: number): string[] | null {
  if (fromSet > STAGE_SET) return null;
  let cur = [...ids];
  for (let set = fromSet; set < STAGE_SET; set++) {
    const step = STAGE_STEPS[set];
    if (!step) return null;
    cur = cur.flatMap((id) => (step[id] ? [step[id]] : []));
  }
  return [...new Set(cur)];
}

export function stageSetOf(raw: unknown): number {
  const v = obj(raw).stageSet;
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 ? v : 1;
}

export interface SaveData {
  version: number;
  /** 깬 전투 기록이 어느 전투 구성 기준인지 (STAGE_SET) */
  stageSet: number;
  cleared: string[];
  /** 마지막으로 시작한 전투 (다 깼을 때 다음 출격 순서를 잇는다) */
  lastStage: string | null;
  /** '새 지역 발견' 장면을 이미 본 지역 */
  regionsSeen: string[];
  /** 필살기 에너지 (ENERGY_CONFIG.max가 가득). 전투가 바뀌어도 이어진다. */
  energy: number;
  settings: Settings;
  stats: Stats;
}

export function defaultSettings(): Settings {
  return {
    muted: false,
    voiceVolume: 1,
    sfxVolume: 0.7,
    reduceEffects: false,
    jamoMotion: true,
    pack: '4-6',
    includeRecommended: true,
    helpMode: 'auto',
    autoHelp: true,
    useWordRecordings: false,
    characterTheme: null,
    focusJamo: [],
    focusWords: [],
    childAge: null,
  };
}

export function emptyStats(): Stats {
  return { battlesPlayed: {}, battlesWon: {}, words: {}, stuckJamo: {}, bestCombo: 0, finishers: 0, reboots: 0 };
}

export function defaultSave(): SaveData {
  return { version: SAVE_VERSION, stageSet: STAGE_SET, cleared: [], lastStage: null, regionsSeen: [], energy: 0, settings: defaultSettings(), stats: emptyStats() };
}

export function emptyWordStats(): WordStats {
  return { attempts: 0, independent: 0, assisted: 0, replays: 0, hintViews: 0, wrongSyllables: 0, bestIndependentMs: null, lastAssisted: false };
}

const num = (v: unknown, d: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;
const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const countMap = (v: unknown): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [k, x] of Object.entries(obj(v))) if (typeof x === 'number' && Number.isFinite(x) && x >= 0) out[k] = Math.floor(x);
  return out;
};

const strList = (v: unknown, max: number): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max) : []);

/** 손상되거나 옛 형식인 저장 데이터를 안전한 값으로 되돌린다. 어떤 입력에도 예외를 던지지 않는다. */
export function sanitizeSave(raw: unknown): SaveData {
  const d = defaultSave();
  const r = obj(raw);
  const s = obj(r.settings);
  const st = obj(r.stats);
  const words: Record<string, WordStats> = {};
  for (const [k, v] of Object.entries(obj(st.words))) {
    const w = obj(v);
    const e = emptyWordStats();
    words[k] = {
      attempts: num(w.attempts, 0),
      independent: num(w.independent, 0),
      assisted: num(w.assisted, 0),
      replays: num(w.replays, 0),
      hintViews: num(w.hintViews, 0),
      wrongSyllables: num(w.wrongSyllables, 0),
      bestIndependentMs: typeof w.bestIndependentMs === 'number' && w.bestIndependentMs > 0 ? w.bestIndependentMs : e.bestIndependentMs,
      lastAssisted: bool(w.lastAssisted, false),
    };
  }
  // 다른 전투 구성에서 깬 기록은 STAGE_STEPS로 지금 구성에 옮긴다. 옮길 수 없으면(더 새 구성) 전투 진행만 처음부터.
  // 어느 쪽이든 단어 기록·설정은 그대로이고, 옮기기 전 원본은 저장 서비스가 따로 보관한다.
  const fromSet = stageSetOf(raw);
  const cleared = migrateStageIds(strList(r.cleared, 1000), fromSet) ?? [];
  const last = typeof r.lastStage === 'string' ? migrateStageIds([r.lastStage], fromSet)?.[0] ?? null : null;
  // 지역은 구성 3에서 생겼다. 옛 구성의 '새 지역 발견' 기록은 없다.
  const regionsSeen = fromSet === STAGE_SET ? strList(r.regionsSeen, 100) : [];
  return {
    version: SAVE_VERSION,
    stageSet: STAGE_SET,
    cleared,
    lastStage: last,
    regionsSeen,
    energy: typeof r.energy === 'number' && Number.isFinite(r.energy) ? Math.max(0, Math.min(ENERGY_CONFIG.max, Math.floor(r.energy))) : 0,
    settings: {
      muted: bool(s.muted, d.settings.muted),
      voiceVolume: num(s.voiceVolume, d.settings.voiceVolume, 0, 1),
      sfxVolume: num(s.sfxVolume, d.settings.sfxVolume, 0, 1),
      reduceEffects: bool(s.reduceEffects, d.settings.reduceEffects),
      jamoMotion: bool(s.jamoMotion, d.settings.jamoMotion),
      pack: s.pack === '7-8' ? '7-8' : '4-6',
      includeRecommended: bool(s.includeRecommended, d.settings.includeRecommended),
      helpMode: s.helpMode === 'more' ? 'more' : 'auto',
      autoHelp: bool(s.autoHelp, d.settings.autoHelp),
      useWordRecordings: bool(s.useWordRecordings, d.settings.useWordRecordings),
      characterTheme: s.characterTheme === 'robot' || s.characterTheme === 'magicalGirl' ? s.characterTheme : null,
      focusJamo: strList(s.focusJamo, 8),
      focusWords: strList(s.focusWords, 8),
      childAge: typeof s.childAge === 'number' && Number.isInteger(s.childAge) && s.childAge >= 2 && s.childAge <= 12 ? s.childAge : null,
    },
    stats: {
      battlesPlayed: countMap(st.battlesPlayed),
      battlesWon: countMap(st.battlesWon),
      words,
      stuckJamo: countMap(st.stuckJamo),
      bestCombo: num(st.bestCombo, 0),
      finishers: num(st.finishers, 0),
      reboots: num(st.reboots, 0),
    },
  };
}

export function wordStats(stats: Stats, id: string): WordStats {
  return (stats.words[id] ??= emptyWordStats());
}

/** 성공 기록. 도움을 본 성공은 독립 성공으로 세지 않고, 속도 기록에도 넣지 않는다. */
export function recordSuccess(stats: Stats, id: string, assisted: boolean, elapsedMs: number): void {
  const w = wordStats(stats, id);
  if (assisted) w.assisted += 1;
  else {
    w.independent += 1;
    if (w.bestIndependentMs === null || elapsedMs < w.bestIndependentMs) w.bestIndependentMs = Math.round(elapsedMs);
  }
  w.lastAssisted = assisted;
}

/**
 * 도움 단계는 나이가 아니라 이 단어의 실제 기록으로 정한다.
 * A 따라 조립 → B 부분 안내 → C 듣고 조립 → D 속도 콤보
 */
export function helpLevelFor(stats: Stats, id: string, mode: Settings['helpMode'] = 'auto'): HelpLevel {
  const w = stats.words[id];
  let level: HelpLevel;
  if (!w || w.independent + w.assisted === 0) level = 'A';
  else if (w.independent === 0) level = w.assisted >= 2 ? 'C' : 'B';
  else if (w.lastAssisted) level = 'C';
  else level = w.independent >= 2 ? 'D' : 'C';
  if (mode === 'more' && (level === 'C' || level === 'D')) level = 'B';
  return level;
}
