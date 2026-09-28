/// <reference types="vite/client" />

/** vite.config.ts가 빌드 때 넣는 값: public/audio/words/의 검사 통과 WAV 파일 이름 */
declare const __WORD_AUDIO_FILES__: string[];

interface Window {
  /** 한 파일 빌드에서만: 음원 경로 → data: 주소 */
  __HD_AUDIO__?: Record<string, string>;
}
