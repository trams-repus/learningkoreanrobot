// 안드로이드 앱(Capacitor) 안에서만: WebView에는 speechSynthesis가 없거나 한국어 음성이 안 보여서,
// 기기 TTS 엔진(네이티브 플러그인)을 speechSynthesis 모양으로 감싸 넣는다. 게임 코드는 그대로 쓴다.
// services가 만들어지기 전에 설치돼야 하므로 main.ts의 첫 import다.
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

type Utt = { text: string; lang?: string; rate?: number; pitch?: number; volume?: number; onend?: (() => void) | null; onerror?: ((e: unknown) => void) | null; onstart?: (() => void) | null };

function install(): void {
  const voice = { lang: 'ko-KR', name: 'Android 한국어', voiceURI: 'android-ko', localService: true, default: true };
  let gen = 0;
  const shim = {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => [voice],
    addEventListener: () => {},
    removeEventListener: () => {},
    onvoiceschanged: null,
    speak(u: Utt) {
      const my = ++gen;
      shim.speaking = true;
      u.onstart?.();
      TextToSpeech.speak({
        text: u.text,
        lang: 'ko-KR',
        // 웹 rate 1 ≈ 안드로이드 1. 볼륨 0(깨우기용 빈 발화)은 소리 없이 끝낸다
        rate: u.rate ?? 1,
        pitch: u.pitch ?? 1,
        volume: u.volume ?? 1,
        category: 'ambient',
      }).then(
        () => { if (my === gen) shim.speaking = false; u.onend?.(); },
        (e) => { if (my === gen) shim.speaking = false; u.onerror?.(e); },
      );
    },
    cancel() {
      gen++;
      shim.speaking = false;
      void TextToSpeech.stop().catch(() => {});
    },
    pause() {},
    resume() {},
  };
  (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string; lang = 'ko-KR'; voice: unknown = null; rate = 1; pitch = 1; volume = 1;
    onend: (() => void) | null = null; onerror: ((e: unknown) => void) | null = null; onstart: (() => void) | null = null;
    constructor(text = '') { this.text = text; }
  };
  Object.defineProperty(window, 'speechSynthesis', { value: shim, configurable: true });
}

if (Capacitor.isNativePlatform()) install();
