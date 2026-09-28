// 진행 기록과 설정. 기기 안(localStorage)에만 저장한다. 아이의 이름·생년월일·목소리는 저장하지 않는다.
import type { CharacterTheme } from '../content/characters';
import type { PackId } from '../content/vocab';
import type { HelpLevel } from './combo';

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
  /** 함께 싸울 캐릭터. 아직 고르지 않았으면 null. 바꿔도 기록·해금은 그대로 둔다. */
  characterTheme: CharacterTheme | null;
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

export interface SaveData {
  version: number;
  cleared: string[];
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
    characterTheme: null,
  };
}

export function emptyStats(): Stats {
  return { battlesPlayed: {}, battlesWon: {}, words: {}, stuckJamo: {}, bestCombo: 0, finishers: 0, reboots: 0 };
}

export function defaultSave(): SaveData {
  return { version: SAVE_VERSION, cleared: [], settings: defaultSettings(), stats: emptyStats() };
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
  return {
    version: SAVE_VERSION,
    cleared: Array.isArray(r.cleared) ? r.cleared.filter((x): x is string => typeof x === 'string') : [],
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
      characterTheme: s.characterTheme === 'robot' || s.characterTheme === 'magicalGirl' ? s.characterTheme : null,
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
