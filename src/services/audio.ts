// 최소한의 음성 재생 관리자. 채널: 단어(최우선) / 대사 / 효과음(sfx.ts).
// - 단어 음성은 대사를 끊고, 재생 중에는 효과음을 줄인다.
// - 단어가 나오는 중에는 대사를 건너뛴다 (대기열을 만들지 않아 뒤늦은 재생이 없다).
// - 재생 완료 이벤트가 오지 않아도 제한 시간 뒤 반드시 끝난다.
// 앱 포장 때는 이 파일만 네이티브 음성 경로로 바꾸면 된다.
import { assetById, textFor } from '../content/audio';
import type { Recordings } from './recordings';
import type { SfxService } from './sfx';

export type Channel = 'word' | 'dialogue';
export type Method = 'recording' | 'file' | 'tts' | 'none';

export interface PlayResult {
  ok: boolean;
  method: Method;
}

export class AudioManager {
  muted = false;
  volume = 1;
  ttsVoice: SpeechSynthesisVoice | null = null;
  ttsChecked = false;
  /** 채널별 재생 표시 (수신기 파형·자막) */
  onPlaying: (ch: Channel | null, text: string) => void = () => {};

  private synth: SpeechSynthesis | null = null;
  private token = 0;
  private current: { ch: Channel; finish: () => void } | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private lastDialogueAt = new Map<string, number>();

  constructor(private sfx: SfxService, private recordings: Recordings, disabled = false) {
    try {
      this.synth = !disabled && 'speechSynthesis' in window ? window.speechSynthesis : null;
    } catch {
      this.synth = null;
    }
  }

  /** 한국어 음성 찾기. 목록이 늦게 준비되면 voiceschanged를 기다린다. 다른 언어 음성으로 대신하지 않는다. */
  async init(): Promise<void> {
    if (!this.synth) {
      this.ttsChecked = true;
      return;
    }
    const pick = () => {
      const ko = this.synth!.getVoices().filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('ko'));
      // 기기 내장(localService) 음성을 우선한다 (네트워크 음성은 끊길 수 있다)
      this.ttsVoice = ko.find((v) => v.localService) ?? ko[0] ?? null;
      return this.ttsVoice;
    };
    if (!pick()) {
      await new Promise<void>((resolve) => {
        const onChange = () => pick() && done();
        const done = () => {
          this.synth?.removeEventListener?.('voiceschanged', onChange);
          resolve();
        };
        this.synth!.addEventListener?.('voiceschanged', onChange);
        setTimeout(done, 2500);
      });
    }
    this.ttsChecked = true;
  }

  /** 첫 터치 안에서 호출: 모바일 브라우저의 자동 재생 제한 해제 */
  unlock(): void {
    try {
      if (this.synth && this.ttsVoice) {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        u.voice = this.ttsVoice;
        this.synth.speak(u);
      }
    } catch {
      /* 무시 */
    }
  }

  methodFor(id: string): Method {
    if (this.recordings.has(id)) return 'recording';
    if (assetById(id)?.localPath) return 'file';
    if (this.synth && this.ttsVoice) return 'tts';
    return 'none';
  }

  get busyWith(): Channel | null {
    return this.current?.ch ?? null;
  }

  /** 출제 단어: 또렷하게, 효과·필터 없이 */
  playWord(id: string): Promise<PlayResult> {
    return this.play('word', id);
  }

  /**
   * 전투 대사. 단어 음성 중이면 건너뛴다. 같은 대사는 cooldown 안에 반복하지 않는다.
   */
  playDialogue(id: string, opts: { cooldownMs?: number; force?: boolean } = {}): Promise<PlayResult> {
    if (this.current?.ch === 'word' && !opts.force) return Promise.resolve({ ok: false, method: 'none' });
    const now = performance.now();
    const last = this.lastDialogueAt.get(id) ?? -Infinity;
    if (!opts.force && now - last < (opts.cooldownMs ?? 12000)) return Promise.resolve({ ok: false, method: 'none' });
    this.lastDialogueAt.set(id, now);
    this.sfx.play('radio');
    return this.play('dialogue', id);
  }

  stop(): void {
    this.token++;
    try {
      this.synth?.cancel();
    } catch {
      /* 무시 */
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }
    const c = this.current;
    this.current = null;
    c?.finish();
    this.sfx.setDuck(false);
    this.onPlaying(null, '');
  }

  private play(ch: Channel, id: string): Promise<PlayResult> {
    this.stop();
    const my = ++this.token;
    const text = textFor(id);
    const method = this.methodFor(id);
    this.onPlaying(ch, text);
    if (ch === 'word') this.sfx.setDuck(true);
    const limit = 1200 + Array.from(text).length * 260;

    return new Promise<PlayResult>((resolve) => {
      let settled = false;
      let ok = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (this.token === my) {
          this.current = null;
          this.sfx.setDuck(false);
          this.onPlaying(null, '');
        }
        resolve({ ok, method });
      };
      const success = () => {
        ok = true;
        finish();
      };
      // 소리가 없거나 음소거면 자막을 잠깐 보여주고 넘어간다
      const timer = setTimeout(finish, this.muted || method === 'none' ? Math.min(limit, 1500) : limit + 2500);
      this.current = { ch, finish };
      if (this.muted || this.volume <= 0 || method === 'none') return;

      const url = method === 'recording' ? this.recordings.url(id) : method === 'file' ? assetById(id)!.localPath : null;
      if (url) {
        try {
          const a = new Audio(url);
          a.volume = this.volume;
          a.onended = success;
          a.onerror = () => (method === 'file' ? this.speakTts(ch, text, my, success, finish) : finish());
          this.audioEl = a;
          a.play().catch(() => finish());
        } catch {
          finish();
        }
        return;
      }
      this.speakTts(ch, text, my, success, finish);
    });
  }

  private speakTts(ch: Channel, text: string, my: number, success: () => void, fail: () => void): void {
    if (!this.synth || !this.ttsVoice) return fail();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.ttsVoice.lang || 'ko-KR';
      u.voice = this.ttsVoice;
      // 단어: 또렷하고 약간 느리게. 대사: 빠르고 높게 (긴박하지만 화나지 않게)
      u.rate = ch === 'word' ? 0.8 : 1.12;
      u.pitch = ch === 'word' ? 1.0 : 1.2;
      u.volume = this.volume;
      u.onend = success;
      u.onerror = fail;
      // cancel 직후 곧바로 speak하면 무시하는 브라우저가 있어 한 박자 뒤에 말한다
      setTimeout(() => {
        if (this.token !== my) return;
        try {
          this.synth!.speak(u);
        } catch {
          fail();
        }
      }, 60);
    } catch {
      fail();
    }
  }
}
