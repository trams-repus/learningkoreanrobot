// 구매(비소모성 상품 하나: 11단계부터 전부 열기) 상태 흐름. 스토어와는 BillingBackend 경계로만 이야기한다.
// 실제 스토어(Google Play)는 services/billing.ts의 어댑터가 맡고, 테스트는 테스트 더블로 상태 전이를 확인한다.
// 규칙:
// - 결제 대기(PENDING: 현금 결제·가족 승인 대기)는 열지 않는다. 스토어가 구매 완료를 알릴 때까지 기다린다.
// - 구매 완료(approved)를 받으면 확인(verify) 뒤 finish(=Google Play 확인 처리 acknowledge)를 한 번만 부른다.
//   Google Play는 3일 안에 확인하지 않은 구매를 자동 환불한다.
// - 권한(entitlement)은 학습 기록과 다른 저장 키에 둔다. 진행 초기화·기록 손상이 구매를 지우지 않게.

export const FULL_GAME_ID = 'hangul_all_stages';

/** 무료로 열린 마지막 단계. 이 뒤(11단계부터)는 구매가 필요하다 (결제가 켜진 빌드에서만). */
export const FREE_UNTIL = 10;

export type PurchaseState =
  /** 아직 스토어 정보를 모름 (시작 직후) */
  | 'unknown'
  /** 결제를 쓸 수 없음 (웹 시험판, 스토어 연결 실패) */
  | 'unavailable'
  | 'locked'
  /** 결제 창을 띄웠고 결과를 기다리는 중 */
  | 'purchasing'
  /** 결제 대기: 스토어가 완료를 알릴 때까지 열지 않는다 */
  | 'pending'
  | 'owned';

export interface ProductInfo {
  id: string;
  /** 스토어가 알려 준 현지 가격 문자열 (예: '₩5,900'). 모르면 null */
  price: string | null;
  title: string | null;
}

/** 스토어가 보내는 거래 소식 */
export type StoreEvent =
  | { kind: 'product'; product: ProductInfo; owned: boolean }
  | { kind: 'pending'; productId: string }
  | { kind: 'approved'; productId: string; transactionId: string }
  | { kind: 'finished'; productId: string; transactionId: string }
  | { kind: 'cancelled'; productId: string }
  | { kind: 'failed'; productId: string; message: string };

export interface BillingBackend {
  /** 결제를 쓸 수 있는 환경인가 (네이티브 앱 + 스토어 플러그인) */
  readonly available: boolean;
  init(productIds: string[], onEvent: (e: StoreEvent) => void): Promise<void>;
  order(productId: string): Promise<void>;
  /** 구매 완료 확인(acknowledge). 비소모성이라 소비(consume)하지 않는다. */
  finish(productId: string, transactionId: string): Promise<void>;
  restore(): Promise<void>;
}

export interface EntitlementStore {
  load(): { owned: boolean; since: string | null } | null;
  save(v: { owned: boolean; since: string | null }): void;
}

export class PurchaseService {
  state: PurchaseState = 'unknown';
  product: ProductInfo | null = null;
  /** 마지막 오류 (부모 화면에 짧게 보여 준다) */
  error: string | null = null;
  private listeners = new Set<() => void>();
  private finishing = new Set<string>();
  private owned = false;

  constructor(
    private backend: BillingBackend,
    private store: EntitlementStore,
    private now: () => Date = () => new Date(),
  ) {
    // 저장해 둔 권한은 스토어에 닿기 전에도 믿는다 (오프라인에서도 산 단계를 할 수 있게)
    this.owned = store.load()?.owned === true;
    if (this.owned) this.state = 'owned';
  }

  /** 결제가 켜진 빌드인가: 켜져 있지 않으면 모든 단계가 열린다 (웹 시험판) */
  get gateEnabled(): boolean {
    return this.backend.available;
  }

  /** num단계를 할 수 있는가 */
  canPlay(num: number): boolean {
    return num <= FREE_UNTIL || !this.gateEnabled || this.owned;
  }

  get isOwned(): boolean {
    return this.owned;
  }

  onChange(f: () => void): () => void {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  }

  private emit(): void {
    // 복사본을 돈다: 화면이 소식을 받고 다시 그리며 구독을 새로 걸면, 원본 Set을 돌 때 새 구독을 끝없이 다시 부른다
    [...this.listeners].forEach((f) => f());
  }

  async init(): Promise<void> {
    if (!this.backend.available) {
      this.state = this.owned ? 'owned' : 'unavailable';
      this.emit();
      return;
    }
    try {
      await this.backend.init([FULL_GAME_ID], (e) => void this.handle(e));
      if (this.state === 'unknown') this.state = this.owned ? 'owned' : 'locked';
    } catch (err) {
      this.error = String((err as Error)?.message ?? err);
      if (!this.owned) this.state = 'unavailable';
    }
    this.emit();
  }

  /** 부모 확인을 통과한 뒤에만 부른다 (화면 쪽 책임) */
  async buy(): Promise<void> {
    if (!this.backend.available || this.owned || this.state === 'purchasing' || this.state === 'pending') return;
    this.error = null;
    this.state = 'purchasing';
    this.emit();
    try {
      await this.backend.order(FULL_GAME_ID);
    } catch (err) {
      this.error = String((err as Error)?.message ?? err);
      if (this.state === 'purchasing') this.state = 'locked';
      this.emit();
    }
  }

  async restore(): Promise<void> {
    if (!this.backend.available) return;
    this.error = null;
    try {
      await this.backend.restore();
    } catch (err) {
      this.error = String((err as Error)?.message ?? err);
    }
    this.emit();
  }

  private grant(): void {
    if (!this.owned) {
      this.owned = true;
      this.store.save({ owned: true, since: this.now().toISOString() });
    }
    this.state = 'owned';
  }

  /** 스토어 소식 → 상태. 순서가 뒤섞여 와도(완료 뒤 대기 등) 산 것을 되돌리지 않는다. */
  async handle(e: StoreEvent): Promise<void> {
    if ('productId' in e && e.productId !== FULL_GAME_ID) return;
    switch (e.kind) {
      case 'product':
        if (e.product.id !== FULL_GAME_ID) return;
        this.product = e.product;
        if (e.owned) this.grant();
        else if (this.state === 'unknown') this.state = this.owned ? 'owned' : 'locked';
        break;
      case 'pending':
        if (!this.owned) this.state = 'pending';
        break;
      case 'approved': {
        // 같은 거래를 두 번 확인하지 않는다 (스토어가 같은 소식을 다시 보낼 수 있다)
        if (this.finishing.has(e.transactionId)) return;
        this.finishing.add(e.transactionId);
        try {
          await this.backend.finish(e.productId, e.transactionId);
          this.grant();
        } catch (err) {
          // 확인 처리 실패: 권한은 주지 않고 다음 실행 때 스토어가 다시 알리게 둔다
          this.finishing.delete(e.transactionId);
          this.error = String((err as Error)?.message ?? err);
          if (!this.owned) this.state = 'locked';
        }
        break;
      }
      case 'finished':
        this.grant();
        break;
      case 'cancelled':
        if (!this.owned) this.state = 'locked';
        break;
      case 'failed':
        this.error = e.message;
        if (!this.owned) this.state = 'locked';
        break;
    }
    this.emit();
  }
}

/** 테스트 더블: 스토어 없이 상태 전이를 확인한다 (단위 테스트, 개발용 ?billing=fake). */
export class FakeBilling implements BillingBackend {
  available = true;
  orders: string[] = [];
  finished: string[] = [];
  restores = 0;
  /** 다음 order가 어떻게 끝날지 */
  next: 'approve' | 'pending' | 'cancel' | 'fail' | 'none' = 'approve';
  /** 스토어에 이미 산 기록이 있는가 (복원·재설치 시험) */
  alreadyOwned = false;
  failFinish = false;
  price: string | null = '₩5,900';
  private emit: (e: StoreEvent) => void = () => {};
  private tx = 0;

  async init(ids: string[], onEvent: (e: StoreEvent) => void): Promise<void> {
    this.emit = onEvent;
    for (const id of ids) onEvent({ kind: 'product', product: { id, price: this.price, title: '한글대작전 전체 단계' }, owned: this.alreadyOwned });
  }

  async order(productId: string): Promise<void> {
    this.orders.push(productId);
    const id = `t${++this.tx}`;
    if (this.next === 'approve') this.emit({ kind: 'approved', productId, transactionId: id });
    else if (this.next === 'pending') this.emit({ kind: 'pending', productId });
    else if (this.next === 'cancel') this.emit({ kind: 'cancelled', productId });
    else if (this.next === 'fail') this.emit({ kind: 'failed', productId, message: '결제 실패 (시험)' });
  }

  /** 결제 대기가 스토어에서 풀렸다 (현금 결제 완료 등) */
  clearPending(productId = FULL_GAME_ID): void {
    this.emit({ kind: 'approved', productId, transactionId: `t${++this.tx}` });
  }

  async finish(productId: string, transactionId: string): Promise<void> {
    if (this.failFinish) throw new Error('확인 처리 실패 (시험)');
    this.finished.push(`${productId}:${transactionId}`);
    this.alreadyOwned = true;
  }

  async restore(): Promise<void> {
    this.restores++;
    if (this.alreadyOwned) this.emit({ kind: 'product', product: { id: FULL_GAME_ID, price: this.price, title: null }, owned: true });
  }
}

/** 브라우저 저장소에 권한 저장 (학습 기록과 다른 키) */
export function entitlementStore(storage: Pick<Storage, 'getItem' | 'setItem'> | null, key = 'hangul-daejakjeon.entitlement.v1'): EntitlementStore {
  return {
    load() {
      try {
        const raw = storage?.getItem(key);
        if (!raw) return null;
        const v = JSON.parse(raw) as { owned?: unknown; since?: unknown };
        return { owned: v.owned === true, since: typeof v.since === 'string' ? v.since : null };
      } catch {
        return null;
      }
    },
    save(v) {
      try {
        storage?.setItem(key, JSON.stringify(v));
      } catch {
        /* 저장 실패: 다음 실행 때 스토어 복원으로 되찾는다 */
      }
    },
  };
}

/**
 * 부모 확인 문제: 두 자리 곱셈 (3~9 × 6~9). 4~8세가 우연히 맞히기 어렵게 보기 없이 숫자를 직접 누른다.
 * rng는 화면에서 Math.random을 넘긴다.
 */
export function parentQuestion(rng: () => number): { a: number; b: number; answer: number } {
  const a = 3 + Math.floor(rng() * 7);
  const b = 6 + Math.floor(rng() * 4);
  return { a, b, answer: a * b };
}
