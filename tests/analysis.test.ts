import { describe, expect, it } from 'vitest';
import { aiPrompt, analyze, focusPool } from '../src/core/analysis';
import { LOG_CAP, PlayLog, sanitizeLog, type LogEvent, type LogStore } from '../src/core/playlog';

const mem = (): LogStore & { saved: LogEvent[] } => {
  const s = { saved: [] as LogEvent[], load: () => [] as LogEvent[], save: (e: LogEvent[]) => void (s.saved = [...e]) };
  return s;
};

function play(log: PlayLog, w: string, opts: { miss?: [string, 'cho' | 'jung' | 'jong', string, string][]; help?: boolean; rep?: number } = {}) {
  log.begin(w, 's2', 'C');
  for (const [syl, role, want, got] of opts.miss ?? []) log.miss(syl, role, want, got, false);
  for (let i = 0; i < (opts.rep ?? 0); i++) log.replay();
  log.finish(!!opts.help, 3000);
}

describe('플레이 로그', () => {
  it('문제 하나를 끝낼 때 틀린 수·다시 듣기·정답 보기를 함께 남긴다', () => {
    const store = mem();
    const log = new PlayLog(store, () => 1000);
    log.battle('s1');
    log.begin('수박', 's1', 'A');
    log.miss('수', 'jung', 'ㅜ', 'ㅗ', true);
    log.replay();
    log.hint();
    log.finish(true, 4200);
    expect(store.saved.at(-1)).toMatchObject({ k: 'word', w: '수박', res: 'help', mis: 1, rep: 1, hint: 1, ms: 4200, trap: 1 });
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
  it('기간을 고르면 그 기간 기록만 분석한다 (기본 최근 7일)', () => {
    const now = Date.UTC(2026, 8, 28, 12);
    const day = 86400000;
    const ev: LogEvent[] = [
      { k: 'battle', t: now - 10 * day, stage: 's1' },
      { k: 'battle', t: now - 2 * day, stage: 's1' },
      { k: 'battle', t: now, stage: 's1' },
    ];
    expect(analyze(ev, now)).toMatchObject({ period: '7d', daysPlayed: 2, battles: 2 });
    expect(analyze(ev, now, '30d')).toMatchObject({ daysPlayed: 3, battles: 3 });
    expect(analyze(ev, now, 'all').battles).toBe(3);
    const old: LogEvent[] = [{ k: 'miss', t: now - 40 * day, w: '거미', syl: '거', role: 'jung', want: 'ㅓ', got: 'ㅏ', trap: false }];
    expect(analyze(old, now, '30d').recentMisses).toEqual([]);
    expect(analyze(old, now, 'all').recentMisses).toHaveLength(1);
  });
});

describe('오답 패턴', () => {
  it('자음·모음 순서 엇갈림을 종류별로 센다', () => {
    const log = new PlayLog(mem());
    log.begin('나무', 's2', 'C');
    log.drop('나', 'cho', 'ㄴ', 'ㅏ', null, false); // 첫소리 차례에 모음
    log.drop('나', 'cho', 'ㄴ', 'ㅏ', 'jung', false);
    log.drop('나', 'jung', 'ㅏ', 'ㄴ', null, false); // 모음 차례에 자음
    log.finish(false, 1000);
    for (const w of ['바다', '나비', '오리', '다리']) play(log, w);
    const a = analyze(log.events);
    expect(a.orderMix.total).toBe(3);
    expect(a.orderMix.lines[0]).toMatchObject({ label: '첫소리 차례에 모음을 놓으려 함', count: 2 });
    expect(a.orderMix.lines[1]).toMatchObject({ label: '모음 차례에 자음을 먼저 놓으려 함', count: 1 });
    expect(a.suggestions[0].seen).toContain('순서');
    expect(a.suggestions[0].evidence).toContain('2번');
  });
  it('차례가 아닌 칸에 맞는 종류를 놓으면 칸 순서 엇갈림으로 센다', () => {
    const log = new PlayLog(mem());
    log.begin('수박', 's2', 'C');
    log.drop('박', 'jung', 'ㅏ', 'ㅏ', 'cho', false);
    expect(analyze(log.events).orderMix.lines[0].label).toBe('모음 차례에 첫소리 칸에 먼저 놓으려 함');
  });
  it('자주 틀리는 자모·함정 비율·받침 음절 오류를 센다', () => {
    let t = 0;
    const l2 = new PlayLog(mem(), () => ++t);
    for (let i = 0; i < 3; i++) {
      l2.begin('수박', 's4', 'C');
      l2.miss('박', 'jong', 'ㄱ', 'ㅈ', true);
      l2.finish(true, 1000);
    }
    for (const w of ['나무', '바다']) play(l2, w);
    const a = analyze(l2.events, Date.now(), 'all');
    expect(a.jamoTrouble[0]).toEqual({ jamo: 'ㄱ', miss: 3, seen: 3 });
    expect(a.trap).toEqual({ misses: 3, drops: 0, words: 3, finished: 5 });
    expect(a.jongSyl.withJong).toEqual({ miss: 3, slots: 3 });
    expect(a.jongSyl.noJong.miss).toBe(0);
    expect(a.suggestions.some((s) => s.seen.includes('함정'))).toBe(true);
    // ㄱ은 ㄱ·ㅈ 쌍 제안에 이미 들어가 따로 반복하지 않는다
    expect(a.suggestions.filter((s) => s.focusJamo?.includes('ㄱ'))).toHaveLength(1);
  });
});

describe('실수 종류', () => {
  it('되돌아간 끌어 놓기도 실수로 세고, 빈 곳에 떨어뜨린 것은 미끄러짐으로 따로 센다', () => {
    const log = new PlayLog(mem());
    log.begin('수박', 's2', 'C');
    log.drop('수', 'jung', 'ㅜ', 'ㅅ', 'jung', false); // 자음을 모음 칸에 → 칸 종류
    log.drop('수', 'cho', 'ㅅ', 'ㅂ', 'other', false); // 다음 글자 칸에 → 순서
    log.drop('수', 'cho', 'ㅅ', 'ㅈ', null, true); // 틀 위 칸 사이 → 미끄러짐
    log.slip(); // 빈 곳 → 미끄러짐
    log.miss('수', 'jung', 'ㅜ', 'ㅗ', true); // 함정
    log.miss('박', 'jong', 'ㄱ', 'ㅂ', false); // 맞는 칸에 다른 자모
    log.finish(false, 1000);
    const a = analyze(log.events);
    expect(a.mistakes).toEqual({ kind: 1, order: 1, trap: 1, wrong: 1, total: 4, slip: 2 });
    expect(a.orderMix.lines.map((l) => l.label)).toContain('지금 글자를 다 채우기 전에 다음 글자 칸에 놓으려 함');
    expect(log.events.at(-1)).toMatchObject({ k: 'word', slip: 1, drop: 3 });
  });
});

describe('AI에게 물어보기 프롬프트', () => {
  it('게임 설명·나이·정의·집계·답변 형식을 담고, 날짜는 넣지 않는다', () => {
    const log = new PlayLog(mem());
    play(log, '거미', { miss: [['거', 'jung', 'ㅓ', 'ㅏ']] });
    play(log, '머리', { miss: [['머', 'jung', 'ㅓ', 'ㅏ']] });
    for (const w of ['나무', '나비', '바다']) play(log, w);
    const ctx = { age: 5, pack: '4-6' as const, helpMode: 'auto' as const, autoHelp: true, focus: [] };
    const text = aiPrompt(analyze(log.events), ctx);
    expect(text).toContain('만 5세 아이가 직접 플레이한 로그');
    expect(text).toContain('## 게임 설명');
    expect(text).not.toContain('인우');
    expect(text).toContain('## 용어 정의');
    expect(text).toContain('ㅏ·ㅓ 2번');
    expect(text).toContain('완성한 단어 5개');
    expect(text).toContain('게임 설정 조정 제안');
    expect(text).toContain('발달 진단, 점수, 등급, 또래 비교는 하지 마세요');
    expect(aiPrompt(analyze(log.events), { ...ctx, age: null })).toContain('나이는 부모가 입력하지 않음');
    expect(text).not.toMatch(/20\d\d|오전|오후/);
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
