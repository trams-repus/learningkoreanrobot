// 음원 목록 (작은 manifest). 게임 코드는 audioId로만 부르고, 실제 재생 방식은 여기서 바꾼다.
// 재생 우선순위: 부모 녹음(기기 안) → localPath 파일 → 기기 한국어 TTS.
// 지금은 검수된 파일이 없어 localPath가 모두 null이다. 파일을 넣으면 localPath만 채우면 된다.
import { VOCAB } from './vocab';

export type AudioType = 'word' | 'dialogue' | 'sfx';

export interface AudioAsset {
  assetId: string;
  text: string;
  type: AudioType;
  source: string;
  /** public/ 아래 경로. 없으면 null (존재하지 않는 파일을 적지 않는다) */
  localPath: string | null;
  playback: 'file' | 'device-tts' | 'webaudio-synth';
  internalTestStatus: string;
  releaseStatus: '미확정' | '사용 가능' | '교체 필요';
  notes: string;
}

/** 전투 대사: 짧고 힘 있게. 단어 발음과 다른 목소리 설정(빠르게·높게)을 쓴다. */
export const DIALOGUE: Record<string, string> = {
  d_enemy: '적이 다가온다!',
  d_hurry: '대장! 빨리 조합해 줘!',
  d_code: '암호만 완성하면 발사할 수 있어!',
  d_ready: '좋아! 공격 준비 완료!',
  d_combo: '연속 공격! 이어 가자!',
  d_power: '출력 상승!',
  d_again: '한 번 더!',
  d_finish: '마무리 일격!',
  d_guard: '내가 막고 있을게!',
  d_retry: '괜찮아! 다시 연결해 보자.',
  d_relisten: '이번 암호를 다시 들어 보자.',
  d_boss: '거대 공룡이다! 힘을 모으자!',
  d_next: '다음 적이 온다!',
  d_win: '해냈다! 기지를 지켰어!',
  d_reboot: '로봇 재가동!',
  d_start: '인우와 한글로봇, 출동!',
};

const TTS_NOTE = '기기 한국어 TTS로 재생. 기기마다 목소리가 다르며 기기에 한국어 음성이 있어야 한다.';

export const AUDIO_MANIFEST: AudioAsset[] = [
  ...VOCAB.map(
    (v): AudioAsset => ({
      assetId: v.wordAudioId,
      text: v.word,
      type: 'word',
      source: '기기 TTS (임시). 한국어기초사전 발음 파일은 이 개발 환경에서 접속 차단되어 미확보',
      localPath: null,
      playback: 'device-tts',
      internalTestStatus: '임시 사용 (폰에서 발음 확인 필요)',
      releaseStatus: '미확정',
      notes: TTS_NOTE,
    }),
  ),
  ...Object.entries(DIALOGUE).map(
    ([id, text]): AudioAsset => ({
      assetId: id,
      text,
      type: 'dialogue',
      source: '기기 TTS (임시, 연기형 음성 아님)',
      localPath: null,
      playback: 'device-tts',
      internalTestStatus: '임시 사용',
      releaseStatus: '교체 필요',
      notes: `${TTS_NOTE} 출시 전 연기형 녹음으로 교체 권장.`,
    }),
  ),
  {
    assetId: 'sfx_all',
    text: '효과음 전체 (발사·폭발·통신음 등)',
    type: 'sfx',
    source: '자체 제작 (Web Audio 실시간 합성)',
    localPath: null,
    playback: 'webaudio-synth',
    internalTestStatus: '사용 중',
    releaseStatus: '사용 가능',
    notes: '외부 음원 없음',
  },
];

export function assetById(id: string): AudioAsset | undefined {
  return AUDIO_MANIFEST.find((a) => a.assetId === id);
}

export function textFor(id: string): string {
  return assetById(id)?.text ?? DIALOGUE[id] ?? id.replace(/^w_/, '');
}
