// 전투 연출 모음 촬영: 공격 단계·콤보별 공격, 적 종류별 공격, 방어·피격을 일정 간격으로 찍는다 (dev 빌드 전용 훅 사용).
// 사용: npm run build && npx vite preview --port 4173 & node e2e/showcase.mjs [출력 폴더] [필터]
// 필터 예: robot / magicalGirl / foes. 출력은 이름-순번.png (장면 시간 STEP ms 간격)
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const OUT = process.argv[2] ?? 'e2e/screens/showcase';
const only = process.argv[3] ?? '';
const STEP = Number(process.env.STEP ?? 67);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Phaser 반복을 멈추고 한 프레임씩 직접 넘기며 찍는다 (스크린샷이 느려도 장면 시간 간격이 일정하다) */
async function film(page, name, start, ms) {
  // 실제 전투 화면의 전투 영역 (조합판 위)
  const clip = await page.evaluate(() => {
    const r = window.__hd.scene.rect;
    return { x: r.x, y: r.y, width: r.w, height: r.h };
  });
  await page.evaluate(() => {
    const g = window.__hd.scene.game;
    g.loop.sleep();
    // 트윈은 Date.now()(벽시계)로 흐르므로 벽시계도 한 프레임씩만 가게 바꾼다
    if (!window.__realNow) {
      window.__realNow = Date.now;
      window.__now = Date.now();
      Date.now = () => window.__now;
    }
    window.__t = window.__t ?? performance.now();
    window.__frames = async (n) => {
      for (let i = 0; i < n; i++) {
        window.__t += 1000 / 60;
        window.__now += 1000 / 60;
        g.step(window.__t, 1000 / 60);
        await new Promise((r) => setTimeout(r, 0));
      }
    };
  });
  const done = page.evaluate(start.fn, start.arg);
  const per = Math.max(1, Math.round((STEP * 60) / 1000));
  const n = Math.ceil(ms / STEP);
  for (let i = 0; i < n; i++) {
    await page.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}.png`, clip });
    await page.evaluate((k) => window.__frames(k), per);
  }
  // 남은 연출을 끝까지 돌린다
  await page.evaluate(() => window.__frames(240));
  await page.evaluate(() => {
    Date.now = window.__realNow;
    window.__realNow = null;
    window.__hd.scene.game.loop.wake();
  });
  await done;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'ko-KR' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`${BASE}?dev=1&speed=1`);
await page.waitForSelector('#t-start');

// 화면 모음: 타이틀 → 전투 고르기 → 부모 화면 각 탭 (디자인 체계 확인용, 360·390 두 크기)
if (only === 'ui') {
  for (const vp of [{ w: 360, h: 640 }, { w: 390, h: 844 }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(`${BASE}?dev=1&speed=1`);
    await page.waitForSelector('#t-start');
    await sleep(600);
    const tag = `${vp.w}`;
    await page.screenshot({ path: `${OUT}/ui-${tag}-title.png` });
    await page.click('.hero-card[data-theme="magicalGirl"]', { force: true });
    await sleep(900);
    await page.screenshot({ path: `${OUT}/ui-${tag}-title-picked.png` });
    await page.click('#t-map', { force: true });
    await sleep(500);
    await page.screenshot({ path: `${OUT}/ui-${tag}-map.png` });
    await page.goto(`${BASE}?dev=1&speed=1`);
    await page.waitForSelector('#t-parent');
    const b = await page.locator('#t-parent').boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await sleep(400);
    await page.mouse.up();
    await page.waitForSelector('.parent');
    for (const tab of ['analysis', 'record', 'settings', 'sound', 'voice']) {
      await page.click(`[data-tab="${tab}"]`, { force: true });
      await sleep(300);
      await page.screenshot({ path: `${OUT}/ui-${tag}-parent-${tab}.png`, fullPage: true });
    }
  }
  console.log(JSON.stringify({ out: OUT, errors }));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
}
await page.click('.hero-card[data-theme="robot"]', { force: true });
await sleep(600);
await page.click('#t-start', { force: true });
await page.waitForFunction(() => window.__hd?.game.phase === 'compose', null, { timeout: 20000 });
// 전투 화면 그대로 둔다 (조합판은 아래에 보이고, 장면만 직접 불러 연출을 찍는다)
await sleep(1500);

const wave = (list) => ({ fn: (l) => window.__hd.scene.spawnWave(l, 9, 10), arg: list });

for (const theme of ['robot', 'magicalGirl']) {
  if (only && only !== theme) continue;
  await page.evaluate((t) => window.__hd.scene.setTheme(t), theme);
  for (const [tier, combo, ms] of [['basic', 1, 1300], ['rapid', 2, 1700], ['rapid', 3, 2100], ['missiles', 4, 2300], ['missiles', 5, 2600], ['finisher', 6, 3000], ['ultimate', 7, 4200]]) {
    await page.evaluate(wave([{ id: 1, kind: 'dino' }, { id: 2, kind: 'imp' }]).fn, wave([{ id: 1, kind: 'dino' }, { id: 2, kind: 'imp' }]).arg);
    await film(page, `${theme}-${tier}-c${combo}`, { fn: ([t, c]) => window.__hd.scene.attack(t, [], 8, 10, c), arg: [tier, combo] }, ms);
  }
  await film(page, `${theme}-guard`, { fn: () => { window.__hd.scene.guard(true); return window.__hd.scene.wait(500); }, arg: null }, 500);
  await page.evaluate(() => window.__hd.scene.guard(false));
}

if (!only || only === 'foes') {
  await page.evaluate(() => window.__hd.scene.setTheme('robot'));
  for (const kind of ['dino', 'imp', 'charger', 'armor', 'chief', 'boss']) {
    const list = kind === 'imp' ? [{ id: 1, kind: 'imp' }, { id: 2, kind: 'imp' }, { id: 3, kind: 'imp' }] : [{ id: 1, kind, ...(kind === 'armor' ? { shield: 1 } : {}) }];
    await page.evaluate(wave(list).fn, wave(list).arg);
    await sleep(300);
    await film(page, `foe-${kind}-attack`, { fn: (heavy) => window.__hd.scene.foeAttack(1, 1, 5, heavy), arg: kind === 'boss' || kind === 'armor' }, 1700);
  }
}

console.log(JSON.stringify({ out: OUT, errors }));
await browser.close();
process.exit(errors.length ? 1 : 0);
