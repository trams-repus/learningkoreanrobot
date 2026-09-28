// 부모 녹음 저장소 (IndexedDB, 기기 안에만). 녹음이 있으면 TTS보다 먼저 재생된다.
// 아이 목소리를 녹음하는 기능이 아니다: 부모가 단어·대사를 직접 읽어 넣는 용도.
const DB = 'inwoo-voice';
const STORE = 'clips';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export class Recordings {
  private urls = new Map<string, string>();
  available = typeof indexedDB !== 'undefined';

  async load(): Promise<void> {
    if (!this.available) return;
    try {
      const keys = (await tx('readonly', (s) => s.getAllKeys())) as string[];
      for (const k of keys) {
        const blob = (await tx('readonly', (s) => s.get(k))) as Blob | undefined;
        if (blob) this.urls.set(k, URL.createObjectURL(blob));
      }
    } catch {
      this.available = false;
    }
  }

  url(id: string): string | null {
    return this.urls.get(id) ?? null;
  }

  has(id: string): boolean {
    return this.urls.has(id);
  }

  async save(id: string, blob: Blob): Promise<void> {
    await tx('readwrite', (s) => s.put(blob, id));
    const old = this.urls.get(id);
    if (old) URL.revokeObjectURL(old);
    this.urls.set(id, URL.createObjectURL(blob));
  }

  async remove(id: string): Promise<void> {
    await tx('readwrite', (s) => s.delete(id));
    const old = this.urls.get(id);
    if (old) URL.revokeObjectURL(old);
    this.urls.delete(id);
  }

  get count(): number {
    return this.urls.size;
  }
}

/** 마이크 녹음 한 번 (최대 ms). 권한 거부·미지원이면 예외. */
export async function recordClip(maxMs = 3000, onStart?: () => void): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  try {
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => (rec.onstop = () => r()));
    rec.start();
    onStart?.();
    setTimeout(() => rec.state !== 'inactive' && rec.stop(), maxMs);
    await done;
    return new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
  } finally {
    stream.getTracks().forEach((t) => t.stop());
  }
}
