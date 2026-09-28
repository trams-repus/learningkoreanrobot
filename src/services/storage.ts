// 저장 서비스. 앱 포장(Capacitor 등) 때 Preferences 저장소로 바꿀 수 있게 이 파일에만 저장 방식을 둔다.
import { defaultSave, sanitizeSave, type SaveData } from '../core/progress';

export const SAVE_KEY = 'inwoo-hangul-robot.save.v2';
const KEY = SAVE_KEY;

export interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

function browserStorage(): StorageLike | null {
  try {
    const s = window.localStorage;
    const probe = '__hd_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null; // 사생활 보호 모드, 차단된 저장소 등: 저장 없이 계속 플레이
  }
}

export class SaveService {
  private store: StorageLike | null;
  data: SaveData;
  /** 저장 데이터를 읽지 못해 새로 시작했는지 (부모 화면에 표시) */
  recovered = false;
  available: boolean;

  constructor(store: StorageLike | null = browserStorage()) {
    this.store = store;
    this.available = store !== null;
    this.data = this.load();
  }

  private load(): SaveData {
    if (!this.store) return defaultSave();
    let raw: string | null = null;
    try {
      raw = this.store.getItem(KEY);
    } catch {
      return defaultSave();
    }
    if (!raw) return defaultSave();
    try {
      return sanitizeSave(JSON.parse(raw));
    } catch {
      // 깨진 데이터는 따로 보관하고 새로 시작한다. 앱 실행 자체는 막지 않는다.
      this.recovered = true;
      try {
        this.store.setItem(`${KEY}.broken`, raw);
      } catch {
        /* 무시 */
      }
      return defaultSave();
    }
  }

  save(): void {
    if (!this.store) return;
    try {
      this.store.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* 저장 공간 부족 등: 플레이는 계속 */
    }
  }

  reset(): void {
    const settings = this.data.settings;
    this.data = defaultSave();
    this.data.settings = settings;
    this.save();
  }
}
