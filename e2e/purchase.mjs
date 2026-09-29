// 구매 흐름 (테스트 더블 ?billing=fake, 개발 빌드): 10단계까지 깬 기록에서 출격하면 전투 대신 보호자 안내 →
// 보호자 확인(곱셈) 틀리면 새 문제 → 맞히면 결제 → 완료 → 11단계 열림. 결제 대기(PENDING)는 열지 않다가 풀리면 열림. 구매 복원.
// 사용: npm run build && npx vite preview --port 4173 & node e2e/purchase.mjs [스크린샷 폴더]
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const OUT = process.argv[2] ?? 'e2e/screens';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const KEY = 'inwoo-hangul-robot.save.v2';
const save = { version: 2, stageSet: 3, cleared: Array.from({ length: 10 }, (_, i) => `s${i + 1}`), lastStage: 's10', settings: { characterTheme: 'robot' } };

const browser = await chromium.launch();
const out = {};
const errors = [];

async function page0() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ko-KR' });
  await ctx.addInitScript(([k, v]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem(k, v);
  }, [KEY, JSON.stringify(save)]);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}?billing=fake&speed=2`);
  await page.waitForSelector('#t-start');
  await page.waitForFunction(() => !document.getElementById('t-start').disabled);
  return { ctx, page };
}

async function answerGate(page, wrongFirst) {
  await page.waitForSelector('.gate');
  const read = () => page.evaluate(() => document.querySelector('.gate-q').textContent.match(/(\d+) × (\d+)/).slice(1).map(Number));
  let [a, b] = await read();
  if (wrongFirst) {
    const before = `${a}x${b}`;
    for (const d of String(a * b + 1)) await page.click(`.gate-pad [data-n="${d}"]`);
    await page.click('#ga-ok');
    await sleep(200);
    [a, b] = await read();
    out.gateWrongStays = !!(await page.$('.gate')) && !(await page.$('.buy'));
    out.gateNewQuestion = `${before} → ${a}x${b}`;
  }
  for (const d of String(a * b)) await page.click(`.gate-pad [data-n="${d}"]`);
  await page.click('#ga-ok');
}

// 1) 결제 승인
{
  const { ctx, page } = await page0();
  await page.click('#t-start', { force: true });
  await page.waitForSelector('.buy');
  out.startShowsBuy = await page.evaluate(() => !!document.querySelector('#bu-buy') && window.__hd === undefined);
  out.price = await page.evaluate(() => document.querySelector('.buy-price')?.textContent.trim());
  await page.screenshot({ path: `${OUT}/buy-01-offer.png` });
  await page.click('#bu-buy');
  await page.screenshot({ path: `${OUT}/buy-02-gate.png` });
  await answerGate(page, true);
  await page.waitForSelector('.buy-status.ok');
  await page.screenshot({ path: `${OUT}/buy-03-owned.png` });
  out.ownedSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('hangul-daejakjeon.entitlement.v1') ?? 'null')?.owned === true);
  await page.click('#bu-later');
  await page.waitForSelector('.map-panel');
  out.s11Open = await page.evaluate(() => !document.querySelector('[data-stage="s11"]').classList.contains('paid'));
  await page.click('[data-stage="s11"]', { force: true });
  await page.waitForSelector('#overlay[hidden]', { state: 'attached' });
  out.battleStarted = await page.evaluate(() => document.getElementById('overlay').hidden);
  await ctx.close();
}

// 2) 결제 대기 → 풀림 (?dev=1로 테스트 더블을 직접 조종)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR' });
  await ctx.addInitScript(([k, v]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem(k, v);
  }, [KEY, JSON.stringify(save)]);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}?billing=fake&dev=1&speed=2`);
  await page.waitForSelector('#t-start');
  await page.evaluate(() => (window.__hd.purchases.backend.next = 'pending'));
  await page.evaluate(() => window.__hd.game.startStage('s11'));
  await page.waitForSelector('#bu-buy');
  await page.click('#bu-buy');
  await answerGate(page, false);
  await page.waitForSelector('.buy-status.wait');
  await page.screenshot({ path: `${OUT}/buy-04-pending.png` });
  out.pendingLocked = await page.evaluate(() => !window.__hd.purchases.canPlay(11) && window.__hd.purchases.state === 'pending');
  await page.evaluate(() => window.__hd.purchases.backend.clearPending());
  await page.waitForSelector('.buy-status.ok');
  out.pendingCleared = await page.evaluate(() => window.__hd.purchases.canPlay(11));
  await ctx.close();
}

// 3) 구매 복원 (새 기기: 저장된 권한 없음, 스토어에는 산 기록)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}?billing=fake&dev=1&speed=2`);
  await page.waitForSelector('#t-start');
  out.freshLocked = await page.evaluate(() => !window.__hd.purchases.canPlay(11));
  await page.evaluate(() => (window.__hd.purchases.backend.alreadyOwned = true));
  await page.evaluate(() => window.__hd.game.startStage('s12'));
  await page.waitForSelector('#bu-restore');
  await page.click('#bu-restore');
  await page.waitForSelector('.buy-status.ok');
  out.restored = await page.evaluate(() => window.__hd.purchases.canPlay(12));
  await ctx.close();
}

await browser.close();
const ok =
  out.startShowsBuy && out.gateWrongStays && out.ownedSaved && out.s11Open && out.battleStarted && out.pendingLocked && out.pendingCleared && out.freshLocked && out.restored && !errors.length;
console.log(JSON.stringify({ ...out, errors, ok }));
process.exit(ok ? 0 : 1);
