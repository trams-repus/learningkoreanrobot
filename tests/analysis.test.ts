import { describe, expect, it } from 'vitest';
import { analyze, focusPool } from '../src/core/analysis';
import { LOG_CAP, PlayLog, sanitizeLog, type LogEvent, type LogStore } from '../src/core/playlog';

const mem = (): LogStore & { saved: LogEvent[] } => {
  const s = { saved: [] as LogEvent[], load: () => [] as LogEvent[], save: (e: LogEvent[]) => void (s.saved = [...e]) };
  return s;
};

function play(log: PlayLog, w: string, opts: { miss?: [string, 'cho' | 'jung' | 'jong', string, string][]; help?: boolean; rep?: number } = {}) {
  log.begin(w, 's2', 'C');
  for (const [syl, role, want, got] of opts.miss ?? []) log.miss(syl, role, want, got);
  for (let i = 0; i < (opts.rep ?? 0); i++) log.replay();
  log.finish(!!opts.help, 3000);
}

describe('플레이 로그', () => {
  it('문제 하나를 끝낼 때 틀린 수·다시 듣기·정답 보기를 함께 남긴다', () => {
    const store = mem();
    const log = new PlayLog(store, () => 1000);
    log.battle('s1');
    log.begin('수박', 's1', 'A');
    log.miss('수', 'jung', 'ㅜ', 'ㅗ');
    log.replay();
    log.hint();
    log.finish(true, 4200);
    expect(store.saved.at(-1)).toMatchObject({ k: 'word', w: '수박', res: 'help', mis: 1, rep: 1, hint: 1, ms: 4200 });
    expect(store.saved.filter((e) => e.k === 'miss')).toHaveLength(1);
  });
  it('끝내지 못한 문제는 stop으로 남고 완성 수에 들어가지 않는다', () => {
    const log = new PlayLog(mem());
    log.begin('나무', 's2', 'C');
    log.abandon();
    expect(log.events.at(-1)).toMatchObject({ res: 'stop' });
    expect(analyze(log.events).finished).toBe(0);
  });
  it('오래된 기록부터 버린다', () => {
    const log = new PlayLog(mem());
    for (let i = 0; i < LOG_CAP + 10; i++) log.battle('s1');
    expect(log.events).toHaveLength(LOG_CAP);
  });
  it('깨진 로그는 맞는 항목만 남긴다', () => {
    expect(sanitizeLog('x')).toEqual([]);
    expect(sanitizeLog([{ k: 'miss', w: '수박', role: 'bad', want: 'ㅜ' }, { k: 'battle', t: 1, stage: 's1' }, null])).toEqual([{ k: 'battle', t: 1, stage: 's1' }]);
  });
});

describe('분석과 제안', () => {
  it('기록이 적으면 제안을 만들지 않는다', () => {
    const log = new PlayLog(mem());
    play(log, '거미', { miss: [['거', 'jung', 'ㅓ', 'ㅏ']] });
    const a = analyze(log.events);
    expect(a.enough).toBe(false);
    expect(a.suggestions).toEqual([]);
  });
  it('ㅏ·ㅓ를 반복해 바꾸면 근거 횟수와 함께 제안하고 더 자주 낼 자모를 준다', () => {
    const log = new PlayLog(mem());
    play(log, '거미', { miss: [['거', 'jung', 'ㅓ', 'ㅏ']] });
    play(log, '머리', { miss: [['머', 'jung', 'ㅓ', 'ㅏ']] });
    play(log, '바다', { miss: [['바', 'jung', 'ㅏ', 'ㅓ']] });
    for (const w of ['나무', '나비']) play(log, w);
    const a = analyze(log.events);
    expect(a.confusions[0]).toMatchObject({ pair: ['ㅏ', 'ㅓ'], total: 3, kind: 'mirrorVowel' });
    const s = a.suggestions[0];
    expect(s.seen).toContain('ㅏ·ㅓ');
    expect(s.evidence).toContain('ㅓ 자리에 ㅏ 2번');
    expect(s.evidence).toContain('ㅏ 자리에 ㅓ 1번');
    expect(s.focusJamo).toEqual(['ㅏ', 'ㅓ']);
    expect(JSON.stringify(a)).not.toMatch(/점수|등급/);
  });
  it('혼자 끝낸 적 없는 단어를 모아 더 자주 내기로 제안한다', () => {
    const log = new PlayLog(mem());
    for (let i = 0; i < 3; i++) play(log, '사과', { help: true });
    for (const w of ['나무', '나비', '바다']) play(log, w);
    const a = analyze(log.events);
    expect(a.needHelp).toEqual([{ word: '사과', help: 3 }]);
    expect(a.suggestions.find((s) => s.focusWords)?.focusWords).toEqual(['사과']);
  });
  it('받침 칸만 뚜렷하게 많이 틀리면 받침 제안을 한다', () => {
    const log = new PlayLog(mem());
    for (let i = 0; i < 3; i++) play(log, '수박', { miss: [['박', 'jong', 'ㄱ', 'ㅂ']] });
    for (const w of ['나무', '나비']) play(log, w);
    const a = analyze(log.events);
    expect(a.roleMiss.jong).toEqual({ miss: 3, slots: 3 });
    expect(a.suggestions.some((s) => s.seen.includes('받침'))).toBe(true);
  });
  it('최근 7일 플레이한 날을 센다', () => {
    const now = Date.UTC(2026, 8, 28, 12);
    const day = 86400000;
    const ev: LogEvent[] = [
      { k: 'battle', t: now - 10 * day, stage: 's1' },
      { k: 'battle', t: now - 2 * day, stage: 's1' },
      { k: 'battle', t: now, stage: 's1' },
    ];
    expect(analyze(ev, now)).toMatchObject({ daysPlayed7: 2, battles7: 2 });
  });
});

describe('더 자주 내기', () => {
  it('집중 자모가 든 단어를 한 번 더 넣는다', () => {
    expect(focusPool(['나무', '거미', '바다'], ['ㅓ'], [])).toEqual(['나무', '거미', '바다', '거미']);
    expect(focusPool(['나무', '사과'], [], ['사과'])).toEqual(['나무', '사과', '사과']);
  });
  it('해당 단어가 없거나 전부면 그대로 둔다', () => {
    expect(focusPool(['나무', '바다'], ['ㅓ'], [])).toEqual(['나무', '바다']);
    expect(focusPool(['나무', '바다'], ['ㅏ'], [])).toEqual(['나무', '바다']);
  });
});
