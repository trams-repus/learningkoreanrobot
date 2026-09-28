// 브라우저 자동 플레이: 시작 → 수박 조립(탭/끌기) → 공격 → 승리 → 다음 전투 일부.
// 사용: npm run build && npx vite preview --port 4173 & node e2e/play.mjs
// 헤드리스 Chromium에는 한국어 음성이 없어 '재생 수단 없음' 경로(자막 후 진행)를 검사한다.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const OUT = 'e2e/screens';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'phone-360x640', width: 360, height: 640, dpr: 2, mobile: true },
  { name: 'phone-390x844', width: 390, height: 844, dpr: 3, mobile: true },
  { name: 'tablet-820x1180', width: 820, height: 1180, dpr: 2, mobile: true },
  { name: 'desktop-1280x800', width: 1280, height: 800, dpr: 1, mobile: false },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(page, fn, arg, timeout = 20000) {
  try {
    await page.waitForFunction(fn, arg, { timeout, polling: 50 });
  } catch (e) {
    const st = await page.evaluate(() => JSON.stringify({ phase: window.__hd.game.phase, paused: window.__hd.game.paused, word: window.__hd.game.current?.entry.word, level: window.__hd.game.current?.level, chips: [...document.querySelectorAll('#zone .jamo-chip')].map((c) => c.dataset.jamo + (c.classList.contains('in-cell') ? '*' : '')).join(''), overlay: !document.getElementById('overlay').hidden }));
    await page.screenshot({ path: `${OUT}/timeout.png` });
    throw new Error(`기다리다 시간 초과: ${fn.toString().slice(0, 80)} 상태=${st}`);
  }
}

async function tapAt(page, vp, x, y) {
  if (vp.mobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

async function chipCenter(page, jamo) {
  return page.evaluate((j) => {
    const el = [...document.querySelectorAll('#zone .jamo-chip')].find((e) => e.dataset.jamo === j && !e.classList.contains('in-cell') && !e.classList.contains('leaving'));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, jamo);
}

/** 현재 단어를 조립한다. mode: 'tap' | 'drag' */
async function solveWord(page, vp, mode, shotPrefix) {
  await waitFor(page, () => window.__hd.game.phase === 'compose');
  const frames = await page.evaluate(() => window.__hd.game.current.frames.map((f) => ({ s: f.syllable, cells: f.hasJong ? [f.cho, f.jung, f.jong] : [f.cho, f.jung], roles: f.hasJong ? ['cho', 'jung', 'jong'] : ['cho', 'jung'] })));
  const word = frames.map((f) => f.s).join('');
  if (shotPrefix) await page.screenshot({ path: `${OUT}/${shotPrefix}-compose.png` });
  for (let i = 0; i < frames.length; i++) {
    for (let k = 0; k < frames[i].cells.length; k++) {
      const j = frames[i].cells[k];
      let c = null;
      for (let t = 0; t < 100 && !c; t++) {
        c = await chipCenter(page, j);
        if (!c) await sleep(50);
      }
      if (!c) throw new Error(`자모 ${j} 칩을 찾지 못함 (${word})`);
      if (mode === 'drag') {
        const cell = await page.evaluate(({ i, role }) => {
          const r = document.querySelectorAll('#frames .frame')[i].querySelector(`.cell.${role}`).getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }, { i, role: frames[i].roles[k] });
        await page.mouse.move(c.x, c.y);
        await page.mouse.down();
        await page.mouse.move(c.x + 12, c.y - 12, { steps: 2 });
        await page.mouse.move(cell.x + 20, cell.y + 14, { steps: 6 }); // 조금 벗어난 곳에 놓아도 붙는지
        await page.mouse.up();
      } else {
        await tapAt(page, vp, c.x, c.y);
      }
      await sleep(120);
    }
    if (shotPrefix && i === 0 && frames.length > 1) {
      await sleep(250);
      await page.screenshot({ path: `${OUT}/${shotPrefix}-syllable1.png` });
    }
  }
  await waitFor(page, () => window.__hd.game.phase !== 'compose');
  return word;
}

async function run(vp) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile, locale: 'ko-KR' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
  await page.goto(`${BASE}?dev=1&speed=2`);
  await page.waitForSelector('#t-start', { timeout: 20000 });
  await sleep(300);
  await page.screenshot({ path: `${OUT}/${vp.name}-01-title.png` });
  await page.click('#t-start', { force: true });

  const log = [];
  // 전투 1: 수박 × 3
  for (let n = 0; n < 3; n++) {
    const w = await solveWord(page, vp, vp.name.startsWith('desktop') && n === 1 ? 'drag' : 'tap', n === 0 ? `${vp.name}-02` : null);
    if (n === 0) {
      await sleep(350);
      await page.screenshot({ path: `${OUT}/${vp.name}-03-attack.png` });
    }
    log.push(w);
  }
  await waitFor(page, () => window.__hd.game.phase === 'victory' && !document.getElementById('overlay').hidden, null, 30000);
  const combo1 = await page.evaluate(() => window.__hd.saves.data.stats.bestCombo);
  await page.screenshot({ path: `${OUT}/${vp.name}-04-victory.png` });

  // 전투 2 (쉬운 단어): 첫 두 단어만
  await page.click('#v-next', { force: true });
  const s2 = [];
  for (let n = 0; n < 2; n++) s2.push(await solveWord(page, vp, 'tap', n === 0 ? `${vp.name}-05-s2` : null));

  // 일시정지 → 다시하기
  await waitFor(page, () => window.__hd.game.phase === 'compose');
  await page.click('#btn-pause', { force: true });
  await sleep(200);
  const paused = await page.evaluate(() => window.__hd.game.paused);
  await page.screenshot({ path: `${OUT}/${vp.name}-06-pause.png` });
  await page.click('#p-resume', { force: true });
  const resumed = await page.evaluate(() => !window.__hd.game.paused);

  const stats = await page.evaluate(() => window.__hd.saves.data.stats.words);
  await browser.close();
  return { vp: vp.name, battle1: log, bestCombo: combo1, battle2: s2, paused, resumed, words: Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, `${v.independent}/${v.assisted}`])), errors };
}

const only = process.argv[2];
let failed = false;
for (const vp of VIEWPORTS.filter((v) => !only || v.name.includes(only))) {
  try {
    const r = await run(vp);
    console.log(JSON.stringify(r));
    if (r.errors.length || !r.paused || !r.resumed) failed = true;
  } catch (e) {
    failed = true;
    console.log(`${vp.name} FAILED: ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
