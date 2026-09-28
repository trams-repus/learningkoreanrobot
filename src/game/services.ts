// 앱 전체에서 하나만 쓰는 서비스들. 테스트용 URL 옵션도 여기서 읽는다.
import { SfxService } from '../services/sfx';
import { AudioManager } from '../services/audio';
import { Recordings } from '../services/recordings';
import { SaveService } from '../services/storage';

const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

export const options = {
  /** ?speed=4 : 연출 속도 배수 (자동 테스트용) */
  speed: Math.min(10, Math.max(0.25, Number(params.get('speed')) || 1)),
  /** ?voice=off : 음성 미지원 상황 재현 */
  voiceOff: params.get('voice') === 'off',
  /** ?dev=1 : 개발용 바로가기 표시 */
  dev: params.get('dev') === '1',
};

export const sfx = new SfxService();
export const recordings = new Recordings();
export const audio = new AudioManager(sfx, recordings, options.voiceOff);
export const saves = new SaveService();

export function applySettings(): void {
  const s = saves.data.settings;
  sfx.muted = s.muted;
  sfx.volume = s.sfxVolume;
  sfx.applyGain();
  audio.muted = s.muted;
  audio.volume = s.voiceVolume;
  audio.useWordFiles = s.useWordRecordings;
}
