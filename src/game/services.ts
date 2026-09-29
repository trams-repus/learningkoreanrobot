// 앱 전체에서 하나만 쓰는 서비스들. 테스트용 URL 옵션도 여기서 읽는다.
import { SfxService } from '../services/sfx';
import { AudioManager } from '../services/audio';
import { Recordings } from '../services/recordings';
import { logStore, SaveService } from '../services/storage';
import { PlayLog } from '../core/playlog';
import { entitlementStore, PurchaseService } from '../core/purchase';
import { createBilling } from '../services/billing';

/** 스토어·앱 배포용 빌드(`npm run build:release`). 테스트 주소(Pages)와 e2e는 일반 빌드를 쓴다. */
export const RELEASE = import.meta.env.MODE === 'release';

export interface Options {
  speed: number;
  voiceOff: boolean;
  dev: boolean;
  /** ?billing=fake : 결제 테스트 더블 (스토어 없이 구매 화면 흐름 확인) */
  billingFake: boolean;
}

/** 출시 빌드의 옵션. URL로 켜는 개발 옵션(전투 전부 열기·연출 배속·음성 끄기·__hd)은 읽지 않는다. */
export const RELEASE_OPTIONS: Options = { speed: 1, voiceOff: false, dev: false, billingFake: false };

export function readOptions(search: string): Options {
  const params = new URLSearchParams(search);
  return {
    /** ?speed=4 : 연출 속도 배수 (자동 테스트용) */
    speed: Math.min(10, Math.max(0.25, Number(params.get('speed')) || 1)),
    /** ?voice=off : 음성 미지원 상황 재현 */
    voiceOff: params.get('voice') === 'off',
    /** ?dev=1 : 개발용 바로가기 표시 */
    dev: params.get('dev') === '1',
    billingFake: params.get('billing') === 'fake',
  };
}

// 삼항으로 고르면 출시 빌드에서 readOptions가 통째로 빠진다 (scripts/check-release.mjs가 확인)
export const options: Options = RELEASE ? RELEASE_OPTIONS : readOptions(typeof location !== 'undefined' ? location.search : '');

export const sfx = new SfxService();
export const recordings = new Recordings();
export const audio = new AudioManager(sfx, recordings, options.voiceOff);
export const saves = new SaveService();
/** 부모 화면 오답 분석용 플레이 로그 (기기 안에만) */
export const playlog = new PlayLog(logStore());

function localStore(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** 구매 (11단계부터 전부 열기). 권한은 학습 기록과 다른 키에 저장한다. */
export const purchases = new PurchaseService(createBilling(!RELEASE && options.billingFake), entitlementStore(typeof window !== 'undefined' ? localStore() : null));

export function applySettings(): void {
  const s = saves.data.settings;
  sfx.muted = s.muted;
  sfx.volume = s.sfxVolume;
  sfx.applyGain();
  audio.muted = s.muted;
  audio.volume = s.voiceVolume;
  audio.useWordFiles = s.useWordRecordings;
}
