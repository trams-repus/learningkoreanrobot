// 부모 화면 분석: 플레이 로그를 규칙대로 세어 약점과 제안을 만든다.
// 점수나 등급은 만들지 않는다. 모든 문장에 근거가 된 횟수를 함께 붙인다.
// 학습 효과가 검증된 진단이 아니라 '기록에서 보이는 것'과 '해 볼 만한 것'이다.
import { canHold, cellsOf, wordFrames, type CellRole } from './assembly';
import type { LogEvent } from './playlog';

type WordEv = Extract<LogEvent, { k: 'word' }>;
type MissEv = Extract<LogEvent, { k: 'miss' }>;
type DropEv = Extract<LogEvent, { k: 'drop' }>;

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

/** 부모 화면 '오답 패턴'의 한 줄: 무엇을, 몇 번 */
export interface PatternLine {
  label: string;
  count: number;
  /** 예시 (단어·자모) */
  example?: string;
}

export interface OrderMix {
  total: number;
  /** 칸 위에 놓으려 한 전체 횟수 중 (받아들여진 칸 수 + 거절된 놓기) */
  attempts: number;
  lines: PatternLine[];
}

export interface JamoTrouble {
  jamo: string;
  miss: number;
  seen: number;
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
  /** 분석한 기간 */
  period: Period;
  /** 기간 안에서 플레이한 날 수, 출동 수 */
  daysPlayed: number;
  battles: number;
  confusions: Confusion[];
  roleMiss: Record<CellRole, { miss: number; slots: number }>;
  /** 두 번 이상 끝냈지만 혼자 끝낸 적 없는 단어 */
  needHelp: { word: string; help: number }[];
  /** 처음엔 도움을 받았고 최근 두 번은 혼자 끝낸 단어 */
  improved: string[];
  trend: { before: number; after: number; window: number } | null;
  replaysRecent: { words: number; replays: number };
  recentMisses: RecentMiss[];
  /**
   * 실수 종류별 횟수 (2026-09-28 사용자 요청: 되돌아간 끌어 놓기도 실수로 센다).
   * kind 칸 종류 틀림(자음→모음 칸 등), order 차례가 아닌 칸, trap 함정 자모를 칸에 넣음, wrong 맞는 칸에 다른 자모.
   * slip = 칸이 아닌 곳에 떨어뜨림 (조작 미끄러짐, total에 넣지 않음)
   */
  mistakes: { kind: number; order: number; trap: number; wrong: number; total: number; slip: number };
  /** 자음·모음 순서 엇갈림 (칸이 받지 않은 끌어 놓기) */
  orderMix: OrderMix;
  /** 자주 틀리는 자모: 정답 자모 기준, 완성 단어에 나온 횟수 대비 */
  jamoTrouble: JamoTrouble[];
  /** 함정 자모 */
  trap: { misses: number; drops: number; words: number; finished: number };
  /** 받침 있는 음절 / 없는 음절에서 다른 글자가 된 횟수 */
  jongSyl: { withJong: { miss: number; slots: number }; noJong: { miss: number; slots: number } };
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

/** 분석 기간: 오래된 기록으로 지금 아이를 판단하지 않게 기본은 최근 7일 (2026-09-28 사용자 요청) */
export type Period = '7d' | '30d' | 'all';
export const PERIOD_NAME: Record<Period, string> = { '7d': '최근 7일', '30d': '최근 30일', all: '전체 기간' };

export function eventsInPeriod(events: LogEvent[], period: Period, now: number = Date.now()): LogEvent[] {
  if (period === 'all') return events;
  const since = now - (period === '7d' ? 7 : 30) * DAY;
  return events.filter((e) => e.t >= since);
}

export function analyze(allEvents: LogEvent[], now: number = Date.now(), period: Period = '7d'): Analysis {
  const events = eventsInPeriod(allEvents, period, now);
  const words = events.filter((e): e is WordEv => e.k === 'word');
  const misses = events.filter((e): e is MissEv => e.k === 'miss');
  const done = words.filter((w) => w.res !== 'stop');
  const alone = done.filter((w) => w.res === 'alone').length;

  const days = new Set<string>();
  for (const e of events) days.add(new Date(e.t).toDateString());
  const battles = events.filter((e) => e.k === 'battle').length;

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

  // 자음·모음 순서 엇갈림
  const drops = events.filter((e): e is DropEv => e.k === 'drop');
  const ROLE_SHORT: Record<CellRole, string> = { cho: '첫소리', jung: '모음', jong: '받침' };
  const orderCount = new Map<string, { n: number; ex: string }>();
  const addOrder = (label: string, ex: string) => {
    const c = orderCount.get(label) ?? { n: 0, ex };
    c.n++;
    orderCount.set(label, c);
  };
  for (const d of drops) {
    const ex = `${d.w}(${d.syl}): ${d.got}`;
    if (!canHold(d.role, d.got)) {
      if (d.role === 'jung') addOrder('모음 차례에 자음을 먼저 놓으려 함', ex);
      else addOrder(`${ROLE_SHORT[d.role]} 차례에 모음을 놓으려 함`, ex);
    } else if (d.over === 'other') addOrder('지금 글자를 다 채우기 전에 다음 글자 칸에 놓으려 함', ex);
    else if (d.over && d.over !== d.role) addOrder(`${ROLE_SHORT[d.role]} 차례에 ${ROLE_SHORT[d.over]} 칸에 먼저 놓으려 함`, ex);
  }
  const orderLines = [...orderCount.entries()].map(([label, c]) => ({ label, count: c.n, example: c.ex })).sort((x, y) => y.count - x.count);
  const placedSlots = roleMiss.cho.slots + roleMiss.jung.slots + roleMiss.jong.slots;
  const orderTotal = orderLines.reduce((s2, l) => s2 + l.count, 0);

  // 실수 종류 (서로 겹치지 않게: 칸 종류 → 순서 → 함정 → 맞는 칸에 다른 자모). 빈 곳에 떨어뜨린 것은 미끄러짐으로 따로
  const kindN = drops.filter((d) => !canHold(d.role, d.got)).length;
  const orderN = drops.filter((d) => canHold(d.role, d.got) && (d.over === 'other' || (d.over !== null && d.over !== d.role))).length;
  const edgeN = drops.length - kindN - orderN; // 틀 위지만 칸 사이 등: 미끄러짐
  const mistakes = {
    kind: kindN,
    order: orderN,
    trap: misses.filter((m) => m.trap).length,
    wrong: misses.filter((m) => !m.trap).length,
    total: 0,
    slip: edgeN + words.reduce((s2, w) => s2 + w.slip, 0),
  };
  mistakes.total = mistakes.kind + mistakes.order + mistakes.trap + mistakes.wrong;

  // 자주 틀리는 자모 (정답 자모 기준)
  const seenJamo = new Map<string, number>();
  for (const w of done) for (const f of wordFrames(w.w) ?? []) for (const r of cellsOf(f)) seenJamo.set(f[r], (seenJamo.get(f[r]) ?? 0) + 1);
  const missJamo = new Map<string, number>();
  for (const m of misses) missJamo.set(m.want, (missJamo.get(m.want) ?? 0) + 1);
  const jamoTrouble = [...missJamo.entries()]
    .filter(([, n]) => n >= MIN_PAIR_COUNT)
    .map(([jamo, miss]) => ({ jamo, miss, seen: seenJamo.get(jamo) ?? 0 }))
    .sort((x, y) => y.miss - x.miss);

  // 함정 자모
  const trap = {
    misses: misses.filter((m) => m.trap).length,
    drops: drops.filter((d) => d.trap).length,
    words: done.filter((w) => w.trap > 0).length,
    finished: done.length,
  };

  // 받침 있는 음절 오류: 한 번 틀린 음절 = 같은 시각·단어·음절의 칸 실수 묶음
  const jongSyl = { withJong: { miss: 0, slots: 0 }, noJong: { miss: 0, slots: 0 } };
  for (const w of done) for (const f of wordFrames(w.w) ?? []) (f.hasJong ? jongSyl.withJong : jongSyl.noJong).slots++;
  const wrongSyl = new Set<string>();
  for (const m of misses) {
    const key = `${m.t}|${m.w}|${m.syl}`;
    if (wrongSyl.has(key)) continue;
    wrongSyl.add(key);
    const f = wordFrames(m.syl)?.[0];
    if (f) (f.hasJong ? jongSyl.withJong : jongSyl.noJong).miss++;
  }

  const a: Analysis = {
    enough: done.length >= MIN_WORDS_FOR_ANALYSIS,
    finished: done.length,
    alone,
    help: done.length - alone,
    stopped: words.length - done.length,
    period,
    daysPlayed: days.size,
    battles,
    confusions,
    roleMiss,
    needHelp,
    improved,
    trend,
    replaysRecent,
    recentMisses,
    mistakes,
    orderMix: { total: orderTotal, attempts: placedSlots + orderTotal, lines: orderLines },
    jamoTrouble,
    trap,
    jongSyl,
    suggestions: [],
  };
  a.suggestions = suggest(a);
  return a;
}

function suggest(a: Analysis): Suggestion[] {
  const out: Suggestion[] = [];
  if (!a.enough) return out;

  if (a.orderMix.total >= 3) {
    out.push({
      seen: '자음·모음을 놓는 순서를 자주 엇갈려요.',
      evidence: a.orderMix.lines.slice(0, 3).map((l) => `${l.label} ${l.count}번`).join(', '),
      tryThis:
        "조립 전에 '첫소리 먼저, 그다음 모음, 받침은 맨 아래'를 같이 말하며 칸을 손가락으로 짚어 볼 수 있어요. 설정의 도움 정도를 '많이'로 두면 차례인 칸에 흐린 자모가 더 자주 보여요.",
    });
  }

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

  // 자주 틀리는 자모: 쌍 제안에 이미 나온 자모는 빼고, 3번 이상·나온 횟수의 30% 이상
  const inPairs = new Set(out.flatMap((g) => g.focusJamo ?? []));
  const hard = a.jamoTrouble.filter((j) => !inPairs.has(j.jamo) && j.miss >= 3 && j.seen > 0 && j.miss / j.seen >= 0.3).slice(0, 2);
  if (hard.length) {
    out.push({
      seen: `${hard.map((j) => j.jamo).join('·')} 자모에서 자주 틀려요.`,
      evidence: hard.map((j) => `${j.jamo}: ${j.seen}번 나와서 ${j.miss}번 다른 자모를 넣음`).join(', '),
      tryThis: `${hard.map((j) => j.jamo).join('·')} 자모가 든 단어를 더 자주 내 보세요. 그 자모 소리로 시작하는 말을 같이 찾아보는 놀이도 할 수 있어요.`,
      focusJamo: hard.map((j) => j.jamo),
    });
  }

  if (a.trap.misses >= 3 && a.trap.finished && a.trap.words / a.trap.finished >= 0.3) {
    out.push({
      seen: '단어에 없는 함정 자모를 자주 골라요.',
      evidence: `완성한 단어 ${a.trap.finished}개 중 ${a.trap.words}개에서 함정 자모를 넣음 (함정 자모 ${a.trap.misses}번)`,
      tryThis: "소리를 끝까지 듣고 고르도록 '다시 듣기'를 같이 눌러 보세요. 설정의 '막히면 선택지 줄이기'가 켜져 있으면 두 번 틀린 뒤 함정이 줄어요.",
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
