import { describe, expect, it } from 'vitest';
import { defaultSave, helpLevelFor, recordSuccess, sanitizeSave, STAGE_SET, wordStats } from '../src/core/progress';
import { SAVE_KEY, SaveService, type StorageLike } from '../src/services/storage';

class Mem implements StorageLike {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

describe('단어 기록', () => {
  it('도움 받은 성공은 독립 성공·속도 기록에 넣지 않는다', () => {
    const s = defaultSave().stats;
    recordSuccess(s, '수박', true, 3000);
    expect(s.words['수박']).toMatchObject({ assisted: 1, independent: 0, bestIndependentMs: null, lastAssisted: true });
    recordSuccess(s, '수박', false, 9000);
    recordSuccess(s, '수박', false, 7000);
    expect(s.words['수박']).toMatchObject({ assisted: 1, independent: 2, bestIndependentMs: 7000, lastAssisted: false });
  });
  it('다시 듣기와 정답 보기는 따로 센다', () => {
    const s = defaultSave().stats;
    wordStats(s, '나무').replays += 2;
    wordStats(s, '나무').hintViews += 1;
    expect(s.words['나무']).toMatchObject({ replays: 2, hintViews: 1 });
  });
  it('도움 단계는 기록으로 정한다 (A → B → C → D)', () => {
    const s = defaultSave().stats;
    expect(helpLevelFor(s, '수박')).toBe('A');
    recordSuccess(s, '수박', true, 1);
    expect(helpLevelFor(s, '수박')).toBe('B');
    recordSuccess(s, '수박', true, 1);
    expect(helpLevelFor(s, '수박')).toBe('C');
    recordSuccess(s, '수박', false, 1);
    expect(helpLevelFor(s, '수박')).toBe('C');
    recordSuccess(s, '수박', false, 1);
    expect(helpLevelFor(s, '수박')).toBe('D');
    expect(helpLevelFor(s, '수박', 'more')).toBe('B');
    recordSuccess(s, '수박', true, 1);
    expect(helpLevelFor(s, '수박')).toBe('C');
  });
});

describe('저장과 복구', () => {
  it('저장 후 다시 읽으면 같은 데이터', () => {
    const mem = new Mem();
    const a = new SaveService(mem);
    a.data.cleared.push('s1');
    recordSuccess(a.data.stats, '바다', false, 5000);
    a.data.settings.muted = true;
    a.data.settings.jamoMotion = false;
    a.save();
    const b = new SaveService(mem);
    expect(b.data.cleared).toEqual(['s1']);
    expect(b.data.stats.words['바다']?.independent).toBe(1);
    expect(b.data.settings.muted).toBe(true);
    expect(b.data.settings.jamoMotion).toBe(false);
  });
  it('깨진 저장 데이터가 있어도 실행되고, 원본은 따로 보관', () => {
    const mem = new Mem();
    mem.setItem(SAVE_KEY, '{not json');
    const s = new SaveService(mem);
    expect(s.recovered).toBe(true);
    expect(s.data).toEqual(defaultSave());
    expect(mem.getItem(`${SAVE_KEY}.broken`)).toBe('{not json');
  });
  it('이상한 값은 안전한 기본값으로', () => {
    const d = sanitizeSave({
      stageSet: STAGE_SET,
      cleared: [1, 's2', null],
      settings: { voiceVolume: 9, muted: 'yes', pack: 'x', helpMode: 'more' },
      stats: { stuckJamo: { ㅂ: -3, ㄱ: 2 }, words: { 수박: { independent: 'x', assisted: 2 } } },
    });
    expect(d.cleared).toEqual(['s2']);
    expect(d.settings.voiceVolume).toBe(1);
    expect(d.settings.muted).toBe(false);
    expect(d.settings.pack).toBe('4-6');
    expect(d.settings.helpMode).toBe('more');
    expect(d.stats.stuckJamo).toEqual({ ㄱ: 2 });
    expect(d.stats.words['수박']).toMatchObject({ independent: 0, assisted: 2 });
    expect(sanitizeSave(null)).toEqual(defaultSave());
    expect(sanitizeSave([1, 2])).toEqual(defaultSave());
  });
  it('옛 전투 구성에서 깬 기록은 새 구성에서 전투 진행만 처음부터 (단어 기록·설정은 유지)', () => {
    // 2026-09-28 전 구성(s1~s4, s4=거대 공룡)을 다 깬 기록
    const d = sanitizeSave({ version: 2, cleared: ['s1', 's2', 's3', 's4'], settings: { muted: true }, stats: { words: { 수박: { independent: 3 } } } });
    expect(d.cleared).toEqual([]);
    expect(d.lastStage).toBeNull();
    expect(d.stageSet).toBe(STAGE_SET);
    expect(d.settings.muted).toBe(true);
    expect(d.stats.words['수박']?.independent).toBe(3);
    // 같은 구성의 기록은 그대로 이어한다
    const e = sanitizeSave({ stageSet: STAGE_SET, cleared: ['s1', 's2'], lastStage: 's2' });
    expect(e.cleared).toEqual(['s1', 's2']);
    expect(e.lastStage).toBe('s2');
  });
  it('저장소를 못 쓰는 환경에서도 동작', () => {
    const s = new SaveService(null);
    s.data.cleared.push('s1');
    expect(() => s.save()).not.toThrow();
    const throwing: StorageLike = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() {} };
    const t = new SaveService(throwing);
    expect(() => t.save()).not.toThrow();
  });
  it('캐릭터 선택은 저장되고, 바꿔도 기록·해금은 그대로', () => {
    const mem = new Mem();
    const a = new SaveService(mem);
    expect(a.data.settings.characterTheme).toBeNull();
    a.data.settings.characterTheme = 'robot';
    a.data.cleared.push('s1');
    recordSuccess(a.data.stats, '수박', false, 4000);
    a.save();
    const b = new SaveService(mem);
    expect(b.data.settings.characterTheme).toBe('robot');
    b.data.settings.characterTheme = 'magicalGirl';
    b.save();
    const c = new SaveService(mem);
    expect(c.data.settings.characterTheme).toBe('magicalGirl');
    expect(c.data.cleared).toEqual(['s1']);
    expect(c.data.stats.words['수박']?.independent).toBe(1);
    expect(sanitizeSave({ settings: { characterTheme: 'princess' } }).settings.characterTheme).toBeNull();
  });
  it('진행 초기화는 설정을 유지', () => {
    const s = new SaveService(new Mem());
    s.data.cleared.push('s1');
    s.data.settings.sfxVolume = 0.2;
    s.reset();
    expect(s.data.cleared).toEqual([]);
    expect(s.data.settings.sfxVolume).toBe(0.2);
  });
});
