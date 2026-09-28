// 음원 목록 (작은 manifest). 게임 코드는 audioId로만 부르고, 실제 재생 방식은 여기서 바꾼다.
// 재생 우선순위: 부모 녹음(기기 안) → localPath 파일 → 기기 한국어 TTS.
// 단어 녹음: word-audio-sources.json의 파일이 public/audio/words/에 있으면 그 파일을 쓰고, 없으면 TTS로 대신한다.
import { VOCAB } from './vocab';
import sources from './word-audio-sources.json';

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

/** 전투 대사: 짧고 힘 있게. 단어 발음과 다른 목소리 설정(캐릭터별)을 쓴다. */
export const DIALOGUE: Record<string, string> = {
  // 공통
  d_enemy: '적이 다가온다!',
  d_next: '다음 적이 온다!',
  d_boss: '거대 공룡이다! 힘을 모으자!',
  d_guard: '괜찮아! 내가 막고 있을게!',
  d_retry: '괜찮아! 다시 해 보자.',
  d_relisten: '한 번 더 들어 보자.',
  d_almost: '좋아! 거의 다 됐어.',
  d_win: '해냈다! 기지를 지켰어!',
  // 로봇
  r_pick: '글자를 조립해 로봇을 출격시키자!',
  r_hurry: '대장! 빨리 조합해 줘!',
  r_ready: '에너지 충전 완료!',
  r_combo: '연속 포격!',
  r_power: '미사일 발사!',
  r_finish: '출력 최대! 간다!',
  r_reboot: '수리 완료! 다시 간다!',
  // 마법소녀
  m_pick: '글자를 조립해 강력한 마법을 완성하자!',
  m_hurry: '빨리 조합해 줘! 마법을 완성하자!',
  m_ready: '마법의 힘이 모였어!',
  m_combo: '별빛 연속 공격!',
  m_power: '유성 마법!',
  m_finish: '힘을 모아서, 한 번에!',
  m_reboot: '회복 마법! 다시 일어났어!',
};

const TTS_NOTE = '기기 한국어 TTS로 재생. 기기마다 목소리가 다르며 기기에 한국어 음성이 있어야 한다.';

export interface WordAudioSource {
  word: string;
  file: string;
  commonsFile: string;
  speaker: string;
  license: string;
  collection: string;
}

export const WORD_AUDIO_SOURCES: WordAudioSource[] = sources;

/** 빌드할 때 public/audio/words/에 실제로 있고 WAV 헤더 검사를 통과한 파일 (vite.config.ts가 채운다) */
const AVAILABLE = new Set<string>(typeof __WORD_AUDIO_FILES__ !== 'undefined' ? __WORD_AUDIO_FILES__ : []);

function wordAsset(v: (typeof VOCAB)[number]): AudioAsset {
  const src = WORD_AUDIO_SOURCES.find((s) => s.word === v.word);
  if (src && AVAILABLE.has(src.file)) {
    return {
      assetId: v.wordAudioId,
      text: v.word,
      type: 'word',
      source: `${src.collection}, 녹음 ${src.speaker}, ${src.license} (${src.commonsFile})`,
      localPath: `audio/words/${src.file}`,
      playback: 'file',
      internalTestStatus: '파일 있음: 다운로드·WAV 헤더 검사 통과. 청취·폰 재생 확인 필요',
      releaseStatus: '미확정',
      notes: '로봇·마법소녀가 같은 녹음을 쓴다. 파일을 해독하지 못하면 기기 TTS로 대신한다.',
    };
  }
  return {
    assetId: v.wordAudioId,
    text: v.word,
    type: 'word',
    source: src
      ? `기기 TTS (임시). 녹음 ${src.commonsFile}은 목록에 있으나 아직 내려받지 못함`
      : '기기 TTS (임시). 이 단어의 확인된 녹음 없음',
    localPath: null,
    playback: 'device-tts',
    internalTestStatus: '임시 사용 (폰에서 발음 확인 필요)',
    releaseStatus: '미확정',
    notes: TTS_NOTE,
  };
}

export const AUDIO_MANIFEST: AudioAsset[] = [
  ...VOCAB.map(wordAsset),
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
      notes: `${TTS_NOTE} 캐릭터별로 속도·높이만 다르게 한다. 출시 전 연기형 녹음으로 교체 권장.`,
    }),
  ),
  {
    assetId: 'sfx_all',
    text: '효과음 전체 (로봇: 발사·폭발, 마법소녀: 종소리·반짝임 등)',
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
