import { describe, expect, it } from 'vitest';
import { entitlementStore, FakeBilling, FREE_UNTIL, FULL_GAME_ID, parentQuestion, PurchaseService, type EntitlementStore } from '../src/core/purchase';

class Mem {
  m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
}

const flush = () => new Promise((r) => setTimeout(r, 0));

async function setup(opts: Partial<FakeBilling> = {}, mem = new Mem()) {
  const fake = Object.assign(new FakeBilling(), opts);
  const store: EntitlementStore = entitlementStore(mem);
  const svc = new PurchaseService(fake, store, () => new Date('2026-09-29T00:00:00Z'));
  await svc.init();
  return { fake, svc, mem };
}

describe('구매 상태 흐름 (테스트 더블)', () => {
  it('처음: 상품 정보를 받고 잠김. 1~10단계는 무료, 11단계부터 잠김', async () => {
    const { svc } = await setup();
    expect(svc.state).toBe('locked');
    expect(svc.product?.price).toBe('₩5,900');
    expect(svc.canPlay(1)).toBe(true);
    expect(svc.canPlay(FREE_UNTIL)).toBe(true);
    expect(svc.canPlay(FREE_UNTIL + 1)).toBe(false);
  });
  it('구매 승인 → 확인 처리(finish) 한 번 → 소유, 권한은 따로 저장', async () => {
    const { fake, svc, mem } = await setup();
    await svc.buy();
    await flush();
    expect(fake.orders).toEqual([FULL_GAME_ID]);
    expect(fake.finished).toEqual([`${FULL_GAME_ID}:t1`]);
    expect(svc.state).toBe('owned');
    expect(svc.canPlay(500)).toBe(true);
    expect(JSON.parse(mem.getItem('hangul-daejakjeon.entitlement.v1')!)).toEqual({ owned: true, since: '2026-09-29T00:00:00.000Z' });
  });
  it('결제 대기(PENDING)는 열지 않고, 스토어가 완료를 알리면 그때 연다', async () => {
    const { fake, svc } = await setup({ next: 'pending' });
    await svc.buy();
    await flush();
    expect(svc.state).toBe('pending');
    expect(svc.canPlay(11)).toBe(false);
    expect(fake.finished).toEqual([]);
    // 대기 중에는 다시 결제 창을 띄우지 않는다
    await svc.buy();
    expect(fake.orders.length).toBe(1);
    fake.clearPending();
    await flush();
    expect(svc.state).toBe('owned');
    expect(fake.finished.length).toBe(1);
  });
  it('같은 거래 소식이 두 번 와도 확인 처리는 한 번', async () => {
    const { fake, svc } = await setup();
    await svc.handle({ kind: 'approved', productId: FULL_GAME_ID, transactionId: 'x' });
    await svc.handle({ kind: 'approved', productId: FULL_GAME_ID, transactionId: 'x' });
    expect(fake.finished).toEqual([`${FULL_GAME_ID}:x`]);
  });
  it('취소·실패는 잠김으로 돌아가고 오류를 남긴다', async () => {
    const a = await setup({ next: 'cancel' });
    await a.svc.buy();
    await flush();
    expect(a.svc.state).toBe('locked');
    const b = await setup({ next: 'fail' });
    await b.svc.buy();
    await flush();
    expect(b.svc.state).toBe('locked');
    expect(b.svc.error).toContain('실패');
  });
  it('확인 처리가 실패하면 권한을 주지 않고, 다음에 같은 거래가 오면 다시 시도한다', async () => {
    const { fake, svc } = await setup({ failFinish: true });
    await svc.buy();
    await flush();
    expect(svc.state).toBe('locked');
    expect(svc.isOwned).toBe(false);
    fake.failFinish = false;
    await svc.handle({ kind: 'approved', productId: FULL_GAME_ID, transactionId: 't1' });
    expect(svc.state).toBe('owned');
  });
  it('복원: 스토어에 산 기록이 있으면 되찾는다 (재설치·새 기기)', async () => {
    const { fake, svc } = await setup();
    fake.alreadyOwned = true;
    await svc.restore();
    await flush();
    expect(fake.restores).toBe(1);
    expect(svc.state).toBe('owned');
  });
  it('재설치 뒤 시작할 때 스토어가 소유를 알려도 연다', async () => {
    const { svc } = await setup({ alreadyOwned: true });
    expect(svc.state).toBe('owned');
  });
  it('저장해 둔 권한은 오프라인(스토어 실패)에서도 유지된다', async () => {
    const mem = new Mem();
    mem.setItem('hangul-daejakjeon.entitlement.v1', JSON.stringify({ owned: true, since: 'x' }));
    const fake = new FakeBilling();
    fake.init = async () => {
      throw new Error('offline');
    };
    const svc = new PurchaseService(fake, entitlementStore(mem));
    await svc.init();
    expect(svc.state).toBe('owned');
    expect(svc.canPlay(99)).toBe(true);
  });
  it('결제를 쓸 수 없는 빌드(웹 시험판)에서는 모든 단계가 열린다', async () => {
    const { svc } = await setup({ available: false });
    expect(svc.state).toBe('unavailable');
    expect(svc.gateEnabled).toBe(false);
    expect(svc.canPlay(11)).toBe(true);
    await svc.buy();
    expect(svc.state).toBe('unavailable');
  });
  it('소식을 받은 쪽이 구독을 끊고 새로 걸어도 한 번만 불린다 (화면 다시 그리기)', async () => {
    const { svc } = await setup();
    let calls = 0;
    let off = () => {};
    const listen = () => {
      off = svc.onChange(() => {
        calls++;
        off();
        listen();
      });
    };
    listen();
    await svc.buy();
    await flush();
    expect(calls).toBeGreaterThan(0);
    expect(calls).toBeLessThan(10);
  });
  it('다른 상품 소식은 무시한다', async () => {
    const { svc } = await setup();
    await svc.handle({ kind: 'approved', productId: 'other', transactionId: 'z' });
    expect(svc.state).toBe('locked');
  });
});

describe('부모 확인 문제', () => {
  it('두 자리 답의 곱셈 (18~81)', () => {
    for (const r of [0, 0.3, 0.6, 0.999]) {
      const q = parentQuestion(() => r);
      expect(q.answer).toBe(q.a * q.b);
      expect(q.answer).toBeGreaterThanOrEqual(18);
      expect(q.answer).toBeLessThanOrEqual(81);
    }
  });
});
