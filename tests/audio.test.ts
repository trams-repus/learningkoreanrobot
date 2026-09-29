// 음성 신뢰성 (M5): 대체 순서, 단어 우선, 이전 음성 취소. 브라우저 음성 엔진과 Audio를 가짜로 바꿔 확인한다.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUDIO_MANIFEST } from '../src/content/audio';

type Mode = 'ok' | 'error' | 'silent';

class FakeUtt {
  lang = '';
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  volume = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  constructor(public text: string) {}
}

const synth = {
  mode: 'ok' as Mode,
  voices: [{ lang: 'ko-KR', name: 'Yuna', localService: true }] as { lang: string; name: string; localService: boolean }[],
  spoken: [] as string[],
  cancels: 0,
  active: null as FakeUtt | null,
  getVoices() {
    return this.voices;
  },
  addEventListener() {},
  removeEventListener() {},
  cancel() {
    this.cancels++;
    this.active = null;
  },
  speak(u: FakeUtt) {
    this.spoken.push(u.text);
    this.active = u;
    if (this.mode === 'ok') {
      setTimeout(() => {
        if (this.active !== u) return;
        u.onstart?.();
        setTimeout(() => this.active === u && u.onend?.(), 400);
      }, 20);
    } else if (this.mode === 'error') setTimeout(() => u.onerror?.(new Error('tts')), 20);
  },
};

class FakeAudio {
  static mode: 'ok' | 'error' = 'ok';
  static played: string[] = [];
  volume = 1;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public src: string) {}
  play() {
    FakeAudio.played.push(this.src);
    if (FakeAudio.mode === 'ok') setTimeout(() => this.onended?.(), 300);
    else setTimeout(() => this.onerror?.(), 10);
    return Promise.resolve();
  }
  pause() {}
}

const ducks: (boolean | 'soft')[] = [];
const sfx = { play() {}, setDuck: (v: boolean | 'soft') => ducks.push(v), context: null };
const recordings = { has: () => false, url: () => null };

const withFile = AUDIO_MANIFEST.find((a) => a.type === 'word' && a.localPath)!;
const noFile = AUDIO_MANIFEST.find((a) => a.type === 'word' && !a.localPath)!;

async function manager() {
  const { AudioManager } = await import('../src/services/audio');
  const am = new AudioManager(sfx as never, recordings as never);
  // 한국어 음성이 없으면 init은 음성 목록을 2.5초까지 기다린다
  const ready = am.init();
  await vi.advanceTimersByTimeAsync(3000);
  await ready;
  ducks.length = 0;
  return am;
}

beforeEach(() => {
  vi.useFakeTimers();
  (globalThis as Record<string, unknown>).window = globalThis;
  (globalThis as Record<string, unknown>).speechSynthesis = synth;
  (globalThis as Record<string, unknown>).SpeechSynthesisUtterance = FakeUtt;
  (globalThis as Record<string, unknown>).Audio = FakeAudio;
  synth.mode = 'ok';
  synth.voices = [{ lang: 'ko-KR', name: 'Yuna', localService: true }];
  synth.spoken = [];
  synth.cancels = 0;
  FakeAudio.mode = 'ok';
  FakeAudio.played = [];
  ducks.length = 0;
});
afterEach(() => {
  vi.useRealTimers();
});

describe('음성 대체 순서', () => {
  it('검사에 쓸 단어: 파일이 있는 단어와 없는 단어가 둘 다 있다', () => {
    expect(withFile).toBeDefined();
    expect(noFile).toBeDefined();
  });
  it('기기 음성이 되면 기기 음성으로 읽고, 읽는 동안 효과음을 낮췄다가 되돌린다', async () => {
    const am = await manager();
    const p = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await p).toEqual({ ok: true, method: 'tts' });
    expect(ducks).toContain(true);
    expect(ducks[ducks.length - 1]).toBe(false);
    expect(FakeAudio.played).toEqual([]);
  });
  it('기기 음성이 오류를 내면 단어 파일로 대신한다', async () => {
    synth.mode = 'error';
    const am = await manager();
    const p = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await p).toEqual({ ok: true, method: 'file' });
    expect(FakeAudio.played[0]).toContain(withFile.localPath!);
  });
  it('기기 음성이 말을 시작하지도 않고 멈추면 1.5초 뒤 단어 파일로', async () => {
    synth.mode = 'silent';
    const am = await manager();
    const p = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(1400);
    expect(FakeAudio.played).toEqual([]);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await p).toEqual({ ok: true, method: 'file' });
  });
  it('한국어 기기 음성이 아예 없으면 파일이 있는 단어는 파일로, 없는 단어는 소리 없음(자막)', async () => {
    synth.voices = [{ lang: 'en-US', name: 'Samantha', localService: true }];
    const am = await manager();
    expect(am.methodFor(withFile.assetId)).toBe('file');
    expect(am.methodFor(noFile.assetId)).toBe('none');
    const p = am.playWord(noFile.assetId);
    await vi.advanceTimersByTimeAsync(2000);
    expect(await p).toEqual({ ok: false, method: 'none' });
  });
  it('기기 음성도 파일도 실패하면 ok=false (못 들은 것으로 처리)', async () => {
    synth.mode = 'error';
    FakeAudio.mode = 'error';
    const am = await manager();
    const p = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(1000);
    expect((await p).ok).toBe(false);
  });
  it('음절 소리는 기기 음성만 쓴다 (실패해도 단어 파일을 틀지 않는다)', async () => {
    synth.mode = 'error';
    const am = await manager();
    const p = am.playSyllable('수');
    await vi.advanceTimersByTimeAsync(1000);
    expect((await p).ok).toBe(false);
    expect(FakeAudio.played).toEqual([]);
  });
});

describe('소리 우선순위와 취소', () => {
  it('단어 중에 꼭 해야 하는 대사가 오면 단어를 끊지 않고 끝난 뒤 이어서 한다', async () => {
    const am = await manager();
    const word = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(100);
    const line = am.playDialogue('d_win', { force: true });
    await vi.advanceTimersByTimeAsync(2000);
    expect(await word).toEqual({ ok: true, method: 'tts' });
    expect((await line).ok).toBe(true);
    expect(synth.spoken.length).toBe(2);
    expect(synth.spoken[1]).not.toBe(synth.spoken[0]);
  });
  it('단어 중의 보통 대사는 건너뛴다', async () => {
    const am = await manager();
    void am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(100);
    expect(await am.playDialogue('d_enemy')).toEqual({ ok: false, method: 'none' });
  });
  it('기다리는 대사는 하나뿐: 새 대사가 오면 앞의 것은 하지 않는다', async () => {
    const am = await manager();
    void am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(100);
    const a = am.playDialogue('d_win', { force: true });
    const b = am.playDialogue('d_retry', { force: true });
    await vi.advanceTimersByTimeAsync(2000);
    expect(await a).toEqual({ ok: false, method: 'none' });
    expect((await b).ok).toBe(true);
    expect(synth.spoken.length).toBe(2);
  });
  it('다음 문제 단어를 틀면 이전 단어 음성은 취소된다', async () => {
    const am = await manager();
    const first = am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(100);
    const second = am.playWord(noFile.assetId);
    expect((await first).ok).toBe(false);
    expect(synth.cancels).toBeGreaterThan(0);
    await vi.advanceTimersByTimeAsync(1000);
    expect((await second).ok).toBe(true);
  });
  it('멈추면(일시정지·메뉴) 기다리던 대사도 버린다', async () => {
    const am = await manager();
    void am.playWord(withFile.assetId);
    await vi.advanceTimersByTimeAsync(100);
    const line = am.playDialogue('d_win', { force: true });
    am.stop();
    await vi.advanceTimersByTimeAsync(2000);
    expect(await line).toEqual({ ok: false, method: 'none' });
    expect(synth.spoken.length).toBe(1);
  });
  it('대사 중에는 효과음을 조금만 낮춘다', async () => {
    const am = await manager();
    const p = am.playDialogue('d_enemy');
    await vi.advanceTimersByTimeAsync(2000);
    await p;
    expect(ducks).toContain('soft');
    expect(ducks).not.toContain(true);
  });
});
