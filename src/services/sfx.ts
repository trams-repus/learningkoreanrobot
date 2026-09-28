// 효과음: 외부 음원 없이 Web Audio로 직접 합성한다 (자체 제작, 임시 에셋).
export type SfxName =
  | 'tap' | 'place' | 'unplace' | 'connect' | 'reject' | 'charge' | 'cannon' | 'hit' | 'wave' | 'shield'
  | 'block' | 'repair' | 'step' | 'roar' | 'bite' | 'robotHit' | 'victory' | 'snap' | 'pop' | 'reboot' | 'whoosh'
  | 'radio' | 'missile' | 'explode' | 'bigExplode' | 'beam' | 'energy' | 'deploy';

export class SfxService {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  volume = 0.7;
  muted = false;
  private duck = 1;

  /** 첫 터치 안에서 호출 */
  unlock(): void {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        const len = this.ctx.sampleRate;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      void this.ctx.resume();
      this.applyGain();
    } catch {
      this.ctx = null;
    }
  }

  suspend(): void {
    void this.ctx?.suspend().catch(() => {});
  }

  resume(): void {
    void this.ctx?.resume().catch(() => {});
  }

  /** 음성이 나오는 동안 효과음을 줄여 음성이 묻히지 않게 한다. */
  setDuck(on: boolean): void {
    this.duck = on ? 0.35 : 1;
    this.applyGain();
  }

  applyGain(): void {
    if (!this.master || !this.ctx) return;
    const v = this.muted ? 0 : this.volume * this.duck;
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  private tone(type: OscillatorType, f0: number, f1: number, t0: number, dur: number, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.master!);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  private noise(t0: number, dur: number, vol: number, filter: BiquadFilterType, f0: number, f1 = f0, q = 1) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const bf = ctx.createBiquadFilter();
    bf.type = filter;
    bf.Q.value = q;
    bf.frequency.setValueAtTime(f0, t0);
    bf.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bf).connect(g).connect(this.master!);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  play(name: SfxName): void {
    if (!this.ctx || !this.master || this.muted || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime + 0.005;
    switch (name) {
      case 'tap':
        this.tone('sine', 700, 900, t, 0.07, 0.25);
        break;
      case 'place':
        this.tone('triangle', 520, 520, t, 0.07, 0.3);
        this.tone('triangle', 780, 780, t + 0.06, 0.09, 0.3);
        break;
      case 'unplace':
        this.tone('triangle', 600, 420, t, 0.1, 0.25);
        break;
      case 'snap':
        this.noise(t, 0.05, 0.4, 'highpass', 2500);
        this.tone('square', 1200, 900, t, 0.05, 0.1);
        break;
      case 'connect':
        [523, 659, 784, 1047].forEach((f, i) => this.tone('triangle', f, f, t + i * 0.06, 0.18, 0.28));
        this.noise(t + 0.2, 0.3, 0.12, 'highpass', 4000, 8000);
        break;
      case 'reject':
        // 부드러운 "음?" 소리. 경고음처럼 들리지 않게 낮은 음량의 삼각파.
        this.tone('triangle', 440, 400, t, 0.14, 0.18);
        this.tone('triangle', 350, 330, t + 0.13, 0.18, 0.16);
        break;
      case 'charge':
        this.tone('sawtooth', 180, 700, t, 0.35, 0.08);
        this.tone('sine', 360, 1400, t, 0.35, 0.1);
        break;
      case 'cannon':
        this.noise(t, 0.35, 0.8, 'lowpass', 1800, 200);
        this.tone('sine', 140, 40, t, 0.4, 0.9);
        break;
      case 'hit':
        this.noise(t, 0.18, 0.6, 'bandpass', 900, 300, 0.8);
        this.tone('square', 220, 80, t, 0.14, 0.2);
        break;
      case 'pop':
        this.tone('sine', 300, 1200, t, 0.18, 0.3);
        this.noise(t + 0.05, 0.2, 0.15, 'highpass', 3000);
        break;
      case 'wave':
        this.noise(t, 1.0, 0.5, 'bandpass', 300, 1600, 0.7);
        this.noise(t + 0.3, 0.8, 0.3, 'lowpass', 1200, 200);
        break;
      case 'shield':
        [392, 494, 587, 784].forEach((f, i) => this.tone('sine', f, f * 1.01, t + i * 0.05, 0.6, 0.14));
        break;
      case 'block':
        this.tone('sine', 1300, 1250, t, 0.4, 0.3);
        this.tone('triangle', 1950, 1900, t, 0.3, 0.12);
        this.noise(t, 0.1, 0.3, 'highpass', 3000);
        break;
      case 'repair':
        for (let i = 0; i < 4; i++) {
          this.noise(t + i * 0.12, 0.04, 0.3, 'highpass', 3000);
          this.tone('square', 880 + i * 110, 880 + i * 110, t + i * 0.12 + 0.03, 0.06, 0.07);
        }
        this.tone('sine', 660, 1320, t + 0.5, 0.3, 0.2);
        break;
      case 'step':
        this.tone('sine', 90, 50, t, 0.15, 0.4);
        break;
      case 'roar':
        this.tone('sawtooth', 150, 70, t, 0.7, 0.18);
        this.noise(t, 0.7, 0.25, 'lowpass', 600, 150);
        break;
      case 'bite':
        this.noise(t, 0.08, 0.4, 'bandpass', 1500, 700);
        this.noise(t + 0.1, 0.08, 0.4, 'bandpass', 1500, 700);
        break;
      case 'robotHit':
        this.tone('square', 320, 200, t, 0.18, 0.18);
        this.noise(t, 0.2, 0.4, 'bandpass', 2000, 800);
        break;
      case 'reboot':
        this.tone('sawtooth', 100, 600, t, 0.8, 0.08);
        [523, 784, 1047].forEach((f, i) => this.tone('triangle', f, f, t + 0.7 + i * 0.08, 0.2, 0.2));
        break;
      case 'whoosh':
        this.noise(t, 0.3, 0.25, 'bandpass', 600, 2500, 1.2);
        break;
      case 'radio':
        // 통신 시작음: 삑-삑
        this.tone('square', 1400, 1400, t, 0.05, 0.06);
        this.tone('square', 1800, 1800, t + 0.07, 0.05, 0.06);
        this.noise(t, 0.12, 0.05, 'bandpass', 2500, 2500, 2);
        break;
      case 'missile':
        this.noise(t, 0.45, 0.25, 'bandpass', 900, 2600, 1.5);
        this.tone('sawtooth', 300, 900, t, 0.3, 0.05);
        break;
      case 'explode':
        this.noise(t, 0.5, 0.7, 'lowpass', 2400, 120);
        this.tone('sine', 110, 35, t, 0.45, 0.6);
        break;
      case 'bigExplode':
        this.noise(t, 1.1, 0.9, 'lowpass', 3000, 80);
        this.tone('sine', 80, 25, t, 1.0, 0.8);
        this.noise(t + 0.15, 0.6, 0.4, 'bandpass', 700, 200, 0.7);
        break;
      case 'beam':
        this.tone('sawtooth', 220, 660, t, 0.9, 0.12);
        this.tone('sine', 440, 1320, t, 0.9, 0.2);
        this.noise(t, 0.9, 0.2, 'highpass', 2000, 6000);
        break;
      case 'energy':
        this.tone('sine', 520, 880, t, 0.12, 0.18);
        break;
      case 'deploy':
        this.noise(t, 0.12, 0.3, 'highpass', 1500, 3000);
        this.tone('square', 200, 140, t, 0.1, 0.1);
        this.tone('square', 300, 420, t + 0.1, 0.08, 0.08);
        break;
      case 'victory':
        [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone('triangle', f, f, t + i * 0.12, i === 5 ? 0.5 : 0.14, 0.3));
        break;
    }
  }
}
