// 최소한의 음성 재생 관리자. 채널: 단어(최우선) / 대사 / 효과음(sfx.ts).
// - 단어 음성은 대사를 끊고, 재생 중에는 효과음을 줄인다.
// - 단어가 나오는 중에는 대사를 건너뛴다 (대기열을 만들지 않아 뒤늦은 재생이 없다).
// - 재생 완료 이벤트가 오지 않아도 제한 시간 뒤 반드시 끝난다.
// - 단어 녹음 파일(WAV)은 첫 터치에서 열린 Web Audio 장치로 해독·재생한다 (모바일 자동 재생 제한 대응).
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
  private webSource: AudioBufferSourceNode | null = null;
  private buffers = new Map<string, Promise<AudioBuffer>>();
  /** 캐릭터별 대사 목소리 (단어 발음에는 쓰지 않는다) */
  dialogueVoice = { rate: 1.1, pitch: 1.0 };
  /** 파일별 마지막 재생 결과 (부모 화면 '소리 확인'에 그대로 보여준다) */
  readonly fileStatus = new Map<string, string>();

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
   * 한 음절 완성 때 그 음절 소리 (예: "수", "박"). 음절 녹음은 없어서 기기 음성으로 음절 전체를 읽는다.
   * 자모 이름(시옷, 우…)은 읽지 않는다. 단어와 같은 채널이라 대사와 겹치지 않는다.
   */
  playSyllable(syllable: string): Promise<PlayResult> {
    // 읽어 줄 목소리가 없으면 소리 없이 기다리게 하지 않는다
    if (this.muted || this.volume <= 0 || !this.synth || !this.ttsVoice) return Promise.resolve({ ok: false, method: 'none' });
    return this.play('word', `syl_${syllable}`, syllable);
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
    if (this.webSource) {
      try {
        this.webSource.onended = null;
        this.webSource.stop();
      } catch {
        /* 이미 끝남 */
      }
      this.webSource = null;
    }
    const c = this.current;
    this.current = null;
    c?.finish();
    this.sfx.setDuck(false);
    this.onPlaying(null, '');
  }

  private play(ch: Channel, id: string, spoken?: string): Promise<PlayResult> {
    this.stop();
    const my = ++this.token;
    const text = spoken ?? textFor(id);
    const method: Method = spoken === undefined ? this.methodFor(id) : this.synth && this.ttsVoice ? 'tts' : 'none';
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

      if (method === 'file') {
        this.playFile(id, my, success, () => {
          // 파일을 못 틀면 그 단어만 TTS로 대신한다 (전체가 무음이 되지 않게)
          if (this.token === my) this.speakTts(ch, text, my, success, finish);
        });
        return;
      }
      const url = method === 'recording' ? this.recordings.url(id) : null;
      if (url) {
        try {
          const a = new Audio(url);
          a.volume = this.volume;
          a.onended = success;
          a.onerror = () => finish();
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

  /** 녹음 파일 주소: 한 파일 빌드면 안에 넣어 둔 data: 주소, 아니면 base 경로 기준 상대 주소 */
  private fileUrl(path: string): string {
    return window.__HD_AUDIO__?.[path] ?? `${import.meta.env.BASE_URL}${path}`;
  }

  private async fileBytes(path: string): Promise<ArrayBuffer> {
    const url = this.fileUrl(path);
    const m = url.match(/^data:[^;,]+;base64,(.*)$/);
    if (m) {
      // data: 주소는 fetch 없이 직접 푼다 (fetch가 막힌 환경 대비)
      const bin = atob(m[1]);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out.buffer;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.arrayBuffer();
  }

  /** 해독은 단어마다 한 번만 한다 */
  private decode(id: string, ctx: AudioContext): Promise<AudioBuffer> {
    let p = this.buffers.get(id);
    if (!p) {
      const path = assetById(id)!.localPath!;
      p = this.fileBytes(path).then((bytes) => new Promise<AudioBuffer>((res, rej) => ctx.decodeAudioData(bytes, res, rej)));
      p.catch(() => this.buffers.delete(id));
      this.buffers.set(id, p);
    }
    return p;
  }

  /** 다음에 낼 단어 파일을 미리 해독해 둔다 (첫 재생 지연 줄이기) */
  preload(ids: string[]): void {
    const ctx = this.sfx.context;
    if (!ctx) return;
    for (const id of ids) if (this.methodFor(id) === 'file') this.decode(id, ctx).catch(() => {});
  }

  private playFile(id: string, my: number, success: () => void, fail: () => void): void {
    const ctx = this.sfx.context;
    const path = assetById(id)!.localPath!;
    const failWith = (why: string) => {
      this.fileStatus.set(id, `재생 실패: ${why} → 기기 음성으로 대신함`);
      fail();
    };
    if (!ctx || ctx.state !== 'running') {
      // Web Audio를 못 쓰면 audio 요소로 시도
      try {
        const a = new Audio(this.fileUrl(path));
        a.volume = this.volume;
        a.onended = () => {
          this.fileStatus.set(id, '재생 완료 (audio 요소)');
          success();
        };
        a.onerror = () => failWith('audio 요소가 파일을 열지 못함');
        this.audioEl = a;
        a.play().catch(() => failWith('브라우저가 재생을 막음 (화면을 한 번 터치한 뒤 다시 시도)'));
      } catch {
        failWith('audio 요소 생성 실패');
      }
      return;
    }
    this.decode(id, ctx).then(
      (buf) => {
        if (this.token !== my) return;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = this.volume;
        src.connect(g).connect(ctx.destination);
        src.onended = () => {
          if (this.webSource === src) this.webSource = null;
          this.fileStatus.set(id, `재생 완료 (Web Audio, ${buf.duration.toFixed(2)}초, ${buf.sampleRate}Hz)`);
          success();
        };
        this.webSource = src;
        src.start();
      },
      (e) => failWith(`해독 실패 (${e instanceof Error ? e.message : String(e)})`),
    );
  }

  private speakTts(ch: Channel, text: string, my: number, success: () => void, fail: () => void): void {
    if (!this.synth || !this.ttsVoice) return fail();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.ttsVoice.lang || 'ko-KR';
      u.voice = this.ttsVoice;
      // 단어: 또렷하고 약간 느리게 (캐릭터와 무관). 대사: 캐릭터별 설정 (긴박하지만 화나지 않게)
      u.rate = ch === 'word' ? 0.8 : this.dialogueVoice.rate;
      u.pitch = ch === 'word' ? 1.0 : this.dialogueVoice.pitch;
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
