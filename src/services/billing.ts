// 스토어 결제 어댑터. 게임 코드는 core/purchase.ts의 BillingBackend만 알고, 플러그인 API는 이 파일에서만 부른다.
// 플러그인: capacitor-plugin-cdv-purchase 13.18 (cordova-plugin-purchase v13의 Capacitor판, MIT).
//  - @capacitor/core ^6 || ^7 || ^8 지원, Android는 Google Play Billing Library 9.0.0으로 빌드된다.
//  - 흐름: register(비소모성) → order → approved → finish(= Play 확인 처리 acknowledge) → finished.
//  - 결제 대기(PENDING)는 pending 소식만 보내고 열지 않는다.
//  - 영수증 검증 서버(validator)는 쓰지 않는다: 기기 정보를 밖으로 보내지 않는다 (광고·추적 없음 원칙).
// 실제 스토어 시험은 Play Console 내부 테스트 트랙에서만 할 수 있어 아직 하지 못했다 (docs/production-status.md BLOCKED).
import { Capacitor } from '@capacitor/core';
import { FakeBilling, type BillingBackend, type StoreEvent } from '../core/purchase';

type Plugin = typeof import('capacitor-plugin-cdv-purchase');
type Tx = import('capacitor-plugin-cdv-purchase').Transaction;

/** 결제를 쓸 수 없는 빌드 (웹 시험판 등): 모든 단계가 열린다 */
export class NoBilling implements BillingBackend {
  readonly available = false;
  async init(): Promise<void> {}
  async order(): Promise<void> {}
  async finish(): Promise<void> {}
  async restore(): Promise<void> {}
}

export class PlayBilling implements BillingBackend {
  readonly available = true;
  private plugin: Plugin | null = null;
  private tx = new Map<string, Tx>();
  private onEvent: (e: StoreEvent) => void = () => {};

  async init(productIds: string[], onEvent: (e: StoreEvent) => void): Promise<void> {
    this.onEvent = onEvent;
    // 웹 번들에는 넣지 않고 앱에서만 불러온다
    const p = (this.plugin = await import('capacitor-plugin-cdv-purchase'));
    const { store, ProductType, Platform, ErrorCode } = p;
    const platform = Capacitor.getPlatform() === 'ios' ? Platform.APPLE_APPSTORE : Platform.GOOGLE_PLAY;
    store.register(productIds.map((id) => ({ id, type: ProductType.NON_CONSUMABLE, platform })));
    const each = (t: Tx, f: (id: string) => StoreEvent) => t.products.forEach((pr) => onEvent(f(pr.id)));
    store
      .when()
      .productUpdated((pr) => {
        if (!productIds.includes(pr.id)) return;
        onEvent({ kind: 'product', product: { id: pr.id, price: pr.pricing?.price ?? null, title: pr.title ?? null }, owned: pr.owned });
      })
      .pending((t) => each(t, (productId) => ({ kind: 'pending', productId })))
      .approved((t) => {
        this.tx.set(t.transactionId, t);
        each(t, (productId) => ({ kind: 'approved', productId, transactionId: t.transactionId }));
      })
      .finished((t) => each(t, (productId) => ({ kind: 'finished', productId, transactionId: t.transactionId })));
    store.error((e) => {
      const productId = productIds[0];
      if (e.code === ErrorCode.PAYMENT_CANCELLED) onEvent({ kind: 'cancelled', productId });
      else onEvent({ kind: 'failed', productId, message: e.message });
    });
    const errors = await store.initialize([platform]);
    if (errors.length && !store.get(productIds[0], platform)) throw new Error(errors[0].message);
  }

  async order(productId: string): Promise<void> {
    const p = this.plugin;
    if (!p) throw new Error('스토어가 준비되지 않았습니다');
    const offer = p.store.get(productId)?.getOffer();
    if (!offer) throw new Error('상품 정보를 찾지 못했습니다');
    const err = await offer.order();
    if (err && err.code === p.ErrorCode.PAYMENT_CANCELLED) this.onEvent({ kind: 'cancelled', productId });
    else if (err) throw new Error(err.message);
  }

  async finish(_productId: string, transactionId: string): Promise<void> {
    const t = this.tx.get(transactionId);
    if (!t) throw new Error('확인할 거래를 찾지 못했습니다');
    await t.finish();
  }

  async restore(): Promise<void> {
    const err = await this.plugin?.store.restorePurchases();
    if (err) throw new Error(err.message);
  }
}

/**
 * 빌드와 기기에 맞는 결제 경계: 앱(네이티브) = Google Play, ?billing=fake(개발 빌드 전용) = 테스트 더블, 그 밖(웹) = 결제 없음.
 */
export function createBilling(fake: boolean): BillingBackend {
  if (fake) return new FakeBilling();
  if (Capacitor.isNativePlatform()) return new PlayBilling();
  return new NoBilling();
}
