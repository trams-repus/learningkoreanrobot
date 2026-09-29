import { describe, expect, it } from 'vitest';
import { jamoStrokes } from '../src/content/strokes';
import { STAGES, stageWords } from '../src/content/stages';
import { VOCAB } from '../src/content/vocab';
import { ENERGY_CONFIG } from '../src/core/combo';
import { judgeStroke, pickWriteWord, resample, syllableStrokes, wordStrokeCount, type Pt } from '../src/core/writing';
import { CHOSEONG, JUNGSEONG, vowelShape } from '../src/hangul/hangul';

describe('따라 쓰기: 획 데이터와 배치', () => {
  it('초성 19자와 가로·세로 모음은 모두 획이 있다 (교과서 획 수)', () => {
    for (const c of CHOSEONG) expect(jamoStrokes(c), c).not.toBeNull();
    for (const v of JUNGSEONG.filter((v) => vowelShape(v) !== 'mixed')) expect(jamoStrokes(v), v).not.toBeNull();
    const count = (j: string) => jamoStrokes(j)!.length;
    expect(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'].map(count)).toEqual([1, 1, 2, 3, 3, 4, 2, 1, 2, 3, 2, 3, 4, 3]);
    expect(count('ㄲ')).toBe(2);
    expect(count('ㅏ')).toBe(2);
    expect(count('ㅐ')).toBe(3);
  });
  it('음절 안 자리: 가로 모음(수)은 초성 아래, 세로 모음(나)은 초성 오른쪽, 받침은 맨 아래', () => {
    const cy = (st: ReturnType<typeof syllableStrokes>, role: string) => {
      const pts = st!.filter((s) => s.role === role).flatMap((s) => s.pts);
      return { x: pts.reduce((a, p) => a + p[0], 0) / pts.length, y: pts.reduce((a, p) => a + p[1], 0) / pts.length };
    };
    const su = syllableStrokes('수');
    expect(cy(su, 'jung').y).toBeGreaterThan(cy(su, 'cho').y);
    const na = syllableStrokes('나');
    expect(cy(na, 'jung').x).toBeGreaterThan(cy(na, 'cho').x);
    const bak = syllableStrokes('박');
    expect(cy(bak, 'jong').y).toBeGreaterThan(cy(bak, 'jung').y);
    expect(bak!.map((s) => s.jamo).join('')).toBe('ㅂㅂㅂㅂㅏㅏㄱ'); // 쓰는 순서
    for (const s of bak!) for (const [x, y] of s.pts) expect(x >= 0 && x <= 100 && y >= 0 && y <= 100).toBe(true);
  });
  it('어휘 대부분을 쓸 수 있고, 1~10단계에는 필살기로 쓸 만한 짧은 단어가 늘 있다', () => {
    const ok = VOCAB.filter((v) => wordStrokeCount(v.word) !== null);
    expect(ok.length / VOCAB.length).toBeGreaterThan(0.95);
    expect(wordStrokeCount('수박')).toBe(11);
    expect(wordStrokeCount('나무')).toBe(8);
    for (const s of STAGES) {
      const pool = stageWords(s, '4-6', true).map((w) => w.word);
      const w = pickWriteWord(pool, '', ENERGY_CONFIG.maxStrokes, () => 0.5);
      expect(w, s.id).not.toBeNull();
      if (s.region === 'r1') expect(wordStrokeCount(w!)!, `${s.id} ${w}`).toBeLessThanOrEqual(ENERGY_CONFIG.maxStrokes);
    }
  });
  it('필살기 단어: 획 수 제한 안에서 고르고, 방금 낸 단어는 피한다', () => {
    expect(pickWriteWord(['수박', '나무'], '', 10, () => 0)).toBe('나무');
    expect(pickWriteWord(['나무', '다리'], '나무', 10, () => 0)).toBe('다리');
    expect(pickWriteWord(['수박'], '', 5, () => 0)).toBe('수박'); // 다 넘으면 가장 적은 단어
  });
});

describe('따라 쓰기 판정 (넉넉하게)', () => {
  const [giyeok] = syllableStrokes('가')!; // ㄱ: 가로 → 아래
  const along = (pts: Pt[], dx = 0, dy = 0): Pt[] => resample(pts, 2).map(([x, y]) => [x + dx, y + dy]);
  it('획을 따라 그으면 완성, 조금 삐뚤어도 완성', () => {
    expect(judgeStroke(giyeok, [along(giyeok.pts)]).kind).toBe('done');
    expect(judgeStroke(giyeok, [along(giyeok.pts, 7, -6)]).kind).toBe('done');
  });
  it('거꾸로 그으면 방향 틀림, 딴 곳에 그으면 벗어남, 톡 치면 무시', () => {
    expect(judgeStroke(giyeok, [along([...giyeok.pts].reverse())])).toEqual({ kind: 'miss', reason: 'direction' });
    expect(judgeStroke(giyeok, [along([[60, 60], [95, 95]])])).toEqual({ kind: 'miss', reason: 'off' });
    expect(judgeStroke(giyeok, [[[20, 20], [21, 20]]]).kind).toBe('tap');
  });
  it('한 획을 두 번에 나눠 그어도 이어서 인정한다 (ㄱ을 가로, 세로 따로)', () => {
    const [a, corner, b] = giyeok.pts;
    const first = along([a, corner]);
    const v1 = judgeStroke(giyeok, [first]);
    expect(v1.kind).toBe('partial');
    expect(judgeStroke(giyeok, [first, along([corner, b])]).kind).toBe('done');
  });
  it('ㅇ은 어느 방향으로 돌아도 인정한다', () => {
    const [o] = syllableStrokes('아')!;
    expect(o.closed).toBe(true);
    expect(judgeStroke(o, [along([...o.pts].reverse())]).kind).toBe('done');
  });
});
