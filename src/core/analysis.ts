// 부모 화면 분석: 플레이 로그를 규칙대로 세어 약점과 제안을 만든다.
// 점수나 등급은 만들지 않는다. 모든 문장에 근거가 된 횟수를 함께 붙인다.
// 학습 효과가 검증된 진단이 아니라 '기록에서 보이는 것'과 '해 볼 만한 것'이다.
import { cellsOf, wordFrames, type CellRole } from './assembly';
import type { LogEvent } from './playlog';

type WordEv = Extract<LogEvent, { k: 'word' }>;
type MissEv = Extract<LogEvent, { k: 'miss' }>;

/** 분석을 보여 줄 최소 완성 단어 수 */
export const MIN_WORDS_FOR_ANALYSIS = 5;
/** 헷갈림 쌍으로 보려면 최소 몇 번 */
export const MIN_PAIR_COUNT = 2;
/** 추세를 볼 때 앞·뒤로 비교하는 단어 수 */
export const TREND_WINDOW = 10;

const DAY = 24 * 60 * 60 * 1000;

export interface Confusion {
  /** 두 자모 (정렬됨) */
  pair: [string, string];
  /** a 자리에 b를 넣은 횟수, b 자리에 a를 넣은 횟수 */
  aForB: number;
  bForA: number;
  total: number;
  words: string[];
  kind: ConfusionKind;
}

export type ConfusionKind = 'mirrorVowel' | 'aeE' | 'soundConsonant' | 'shapeConsonant' | 'other';

export interface Suggestion {
  /** 기록에서 보이는 것 */
  seen: string;
  /** 근거 (횟수) */
  evidence: string;
  /** 해 볼 만한 것 */
  tryThis: string;
  /** '더 자주 내기' 버튼이 켤 자모·단어 (없으면 버튼 없음) */
  focusJamo?: string[];
  focusWords?: string[];
}

export interface RecentMiss {
  t: number;
  word: string;
  syl: string;
  role: CellRole;
  want: string;
  got: string | null;
}

export interface Analysis {
  enough: boolean;
  finished: number;
  alone: number;
  help: number;
  stopped: number;
  daysPlayed7: number;
  battles7: number;
  words7: number;
  confusions: Confusion[];
  roleMiss: Record<CellRole, { miss: number; slots: number }>;
  /** 두 번 이상 끝냈지만 혼자 끝낸 적 없는 단어 */
  needHelp: { word: string; help: number }[];
  /** 처음엔 도움을 받았고 최근 두 번은 혼자 끝낸 단어 */
  improved: string[];
  trend: { before: number; after: number; window: number } | null;
  replaysRecent: { words: number; replays: number };
  recentMisses: RecentMiss[];
  suggestions: Suggestion[];
}

const MIRROR_VOWELS = [['ㅏ', 'ㅓ'], ['ㅗ', 'ㅜ'], ['ㅑ', 'ㅕ'], ['ㅛ', 'ㅠ']];
const SOUND_FAMILIES = [['ㄱ', 'ㄲ', 'ㅋ'], ['ㄷ', 'ㄸ', 'ㅌ'], ['ㅂ', 'ㅃ', 'ㅍ'], ['ㅅ', 'ㅆ'], ['ㅈ', 'ㅉ', 'ㅊ'], ['ㅅ', 'ㅈ', 'ㅊ']];
const SHAPE_CONSONANTS = [['ㄱ', 'ㄴ'], ['ㄴ', 'ㄷ'], ['ㄷ', 'ㄹ'], ['ㅁ', 'ㅂ'], ['ㅁ', 'ㅇ'], ['ㅇ', 'ㅎ']];

const inGroup = (groups: string[][], a: string, b: string) => groups.some((g) => g.includes(a) && g.includes(b));

export function confusionKind(a: string, b: string): ConfusionKind {
  if (inGroup(MIRROR_VOWELS, a, b)) return 'mirrorVowel';
  if (inGroup([['ㅐ', 'ㅔ']], a, b)) return 'aeE';
  if (inGroup(SOUND_FAMILIES, a, b)) return 'soundConsonant';
  if (inGroup(SHAPE_CONSONANTS, a, b)) return 'shapeConsonant';
  return 'other';
}

function tipFor(c: Confusion): string {
  const [a, b] = c.pair;
  switch (c.kind) {
    case 'mirrorVowel':
      return `${a}·${b} 자모가 든 단어를 더 자주 내 보세요. 짧은 막대가 어느 쪽에 붙는지 손가락으로 따라 그리며 소리를 크게 번갈아 말해 볼 수 있어요.`;
    case 'aeE':
      return `ㅐ와 ㅔ는 요즘 말소리로는 거의 같게 들려서 어른도 헷갈려요. 소리로 가리기보다 단어마다 어느 쪽인지 익히면 돼요.`;
    case 'soundConsonant':
      return `${a}·${b} 자모가 든 단어를 더 자주 내 보세요. 손바닥을 입 앞에 대고 바람이 세게 나오는지(ㅋ·ㅌ·ㅍ·ㅊ), 힘주어 누르는 소리인지(ㄲ·ㄸ·ㅃ·ㅆ·ㅉ) 같이 느껴 볼 수 있어요.`;
    case 'shapeConsonant':
      return `${a}·${b} 자모가 든 단어를 더 자주 내 보세요. 두 글자를 나란히 두고 다른 곳을 찾아보는 놀이를 해 볼 수 있어요.`;
    default:
      return `${a}·${b} 자모가 든 단어를 더 자주 내 보세요.`;
  }
}

const ROLE_NAME: Record<CellRole, string> = { cho: '첫소리(초성)', jung: '모음(중성)', jong: '받침(종성)' };

export function analyze(events: LogEvent[], now: number = Date.now()): Analysis {
  const words = events.filter((e): e is WordEv => e.k === 'word');
  const misses = events.filter((e): e is MissEv => e.k === 'miss');
  const done = words.filter((w) => w.res !== 'stop');
  const alone = done.filter((w) => w.res === 'alone').length;

  // 최근 7일
  const since = now - 7 * DAY;
  const days = new Set<string>();
  for (const e of events) if (e.t >= since) days.add(new Date(e.t).toDateString());
  const battles7 = events.filter((e) => e.k === 'battle' && e.t >= since).length;
  const words7 = done.filter((w) => w.t >= since).length;

  // 헷갈림 쌍 (방향 없이 묶고 방향별 횟수도 센다)
  const pairs = new Map<string, Confusion>();
  for (const m of misses) {
    if (!m.got || m.got === m.want) continue;
    const [a, b] = [m.want, m.got].sort();
    const key = a + b;
    const c = pairs.get(key) ?? { pair: [a, b] as [string, string], aForB: 0, bForA: 0, total: 0, words: [], kind: confusionKind(a, b) };
    // want 자리에 got: want가 a면 'a 자리에 b' = aForB... 이름을 '자리 기준'으로 둔다
    if (m.want === a) c.aForB++;
    else c.bForA++;
    c.total++;
    if (!c.words.includes(m.w)) c.words.push(m.w);
    pairs.set(key, c);
  }
  const confusions = [...pairs.values()].filter((c) => c.total >= MIN_PAIR_COUNT).sort((x, y) => y.total - x.total);

  // 칸 종류별 틀린 비율: 끝낸 단어의 칸 수를 분모로
  const roleMiss: Analysis['roleMiss'] = { cho: { miss: 0, slots: 0 }, jung: { miss: 0, slots: 0 }, jong: { miss: 0, slots: 0 } };
  for (const w of done) for (const f of wordFrames(w.w) ?? []) for (const r of cellsOf(f)) roleMiss[r].slots++;
  for (const m of misses) roleMiss[m.role].miss++;

  // 단어별
  const byWord = new Map<string, WordEv[]>();
  for (const w of done) byWord.set(w.w, [...(byWord.get(w.w) ?? []), w]);
  const needHelp: Analysis['needHelp'] = [];
  const improved: string[] = [];
  for (const [w, list] of byWord) {
    const aloneN = list.filter((x) => x.res === 'alone').length;
    if (list.length >= 2 && aloneN === 0) needHelp.push({ word: w, help: list.length });
    if (list.length >= 3 && list[0].res === 'help' && list.slice(-2).every((x) => x.res === 'alone')) improved.push(w);
  }
  needHelp.sort((a, b) => b.help - a.help);

  // 추세: 처음 N단어와 최근 N단어의 혼자 완성 수
  const trend = done.length >= TREND_WINDOW * 2
    ? {
        before: done.slice(0, TREND_WINDOW).filter((w) => w.res === 'alone').length,
        after: done.slice(-TREND_WINDOW).filter((w) => w.res === 'alone').length,
        window: TREND_WINDOW,
      }
    : null;

  const recent = words.slice(-20);
  const replaysRecent = { words: recent.length, replays: recent.reduce((s, w) => s + w.rep, 0) };

  const recentMisses: RecentMiss[] = misses
    .slice(-15)
    .reverse()
    .map((m) => ({ t: m.t, word: m.w, syl: m.syl, role: m.role, want: m.want, got: m.got }));

  const a: Analysis = {
    enough: done.length >= MIN_WORDS_FOR_ANALYSIS,
    finished: done.length,
    alone,
    help: done.length - alone,
    stopped: words.length - done.length,
    daysPlayed7: days.size,
    battles7,
    words7,
    confusions,
    roleMiss,
    needHelp,
    improved,
    trend,
    replaysRecent,
    recentMisses,
    suggestions: [],
  };
  a.suggestions = suggest(a);
  return a;
}

function suggest(a: Analysis): Suggestion[] {
  const out: Suggestion[] = [];
  if (!a.enough) return out;

  for (const c of a.confusions.slice(0, 3)) {
    const [x, y] = c.pair;
    const dir = [c.aForB ? `${x} 자리에 ${y} ${c.aForB}번` : '', c.bForA ? `${y} 자리에 ${x} ${c.bForA}번` : ''].filter(Boolean).join(', ');
    out.push({
      seen: `${x}·${y} 두 자모를 자주 바꿔 넣어요.`,
      evidence: `${dir} (단어: ${c.words.slice(0, 4).join(', ')})`,
      tryThis: tipFor(c),
      focusJamo: c.kind === 'aeE' ? undefined : [x, y],
    });
  }

  // 칸 종류: 한 종류가 뚜렷하게 많이 틀릴 때만 (3번 이상, 다른 칸보다 비율이 2배 이상)
  const rate = (r: CellRole) => (a.roleMiss[r].slots ? a.roleMiss[r].miss / a.roleMiss[r].slots : 0);
  const roles: CellRole[] = ['cho', 'jung', 'jong'];
  const worst = roles.reduce((p, r) => (rate(r) > rate(p) ? r : p), 'cho' as CellRole);
  const others = roles.filter((r) => r !== worst && a.roleMiss[r].slots > 0);
  if (a.roleMiss[worst].miss >= 3 && others.every((r) => rate(worst) >= 2 * rate(r))) {
    const m = a.roleMiss[worst];
    out.push({
      seen: `${ROLE_NAME[worst]} 칸에서 가장 많이 틀려요.`,
      evidence: `${ROLE_NAME[worst]} 칸 ${m.slots}번 중 ${m.miss}번 다른 글자`,
      tryThis:
        worst === 'jong'
          ? '받침 없는 단어 단계를 한두 번 더 한 뒤 받침 단계로 가 보세요. 같이 읽을 때 끝소리를 조금 길게 들려주면 받침을 알아채기 쉬워요.'
          : worst === 'jung'
            ? '모음 소리(아·어·오·우·으·이)를 입 모양을 크게 해서 같이 말해 볼 수 있어요.'
            : '단어의 첫소리를 먼저 같이 말해 보고("수박은 스… 로 시작해") 조립해 볼 수 있어요.',
    });
  }

  if (a.needHelp.length) {
    const list = a.needHelp.slice(0, 5);
    out.push({
      seen: '아직 혼자 끝낸 적이 없는 단어가 있어요.',
      evidence: list.map((w) => `${w.word}(도움 받아 ${w.help}번)`).join(', '),
      tryThis: '이 단어들을 조금 더 자주 내 보세요. 게임 밖에서 그림을 보며 한 음절씩 같이 읽어 보는 것도 방법이에요.',
      focusWords: list.map((w) => w.word),
    });
  }

  if (a.replaysRecent.words >= 8 && a.replaysRecent.replays >= a.replaysRecent.words) {
    out.push({
      seen: '단어 소리를 여러 번 다시 들어요.',
      evidence: `최근 ${a.replaysRecent.words}단어에서 다시 듣기 ${a.replaysRecent.replays}번`,
      tryThis: "'소리 확인'에서 이 기기 음성이 또렷한지 들어 보세요. 알아듣기 어려우면 '목소리 녹음'으로 부모님 목소리를 넣을 수 있어요.",
    });
  }
  return out;
}

/**
 * '더 자주 내기': 후보 목록에서 집중 자모가 들었거나 집중 단어인 것을 한 번 더 넣는다.
 * 섞은 주머니가 이 목록으로 채워지므로 그 단어들이 약 두 배로 나온다. 전투 단계(난이도)는 바꾸지 않는다.
 */
export function focusPool(pool: string[], focusJamo: string[], focusWords: string[]): string[] {
  if (!focusJamo.length && !focusWords.length) return pool;
  const hit = (w: string) =>
    focusWords.includes(w) || (wordFrames(w) ?? []).some((f) => cellsOf(f).some((r) => focusJamo.includes(f[r])));
  const extra = pool.filter(hit);
  // 모든 단어가 해당되면 늘려도 비율이 같으니 그대로 둔다
  return extra.length && extra.length < pool.length ? [...pool, ...extra] : pool;
}
