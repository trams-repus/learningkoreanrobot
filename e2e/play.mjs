// 브라우저 자동 플레이: 시작 → 수박 조립(끌어서 놓기) → 공격 → 승리 → 다음 전투 일부 → 난이도 단계 전투 몇 단어.
// 휴대폰·태블릿 크기는 실제 터치 끌기(CDP 터치 이벤트), 데스크톱은 마우스 끌기. 탭만으로는 들어가지 않아야 한다.
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

const cdps = new WeakMap();
/** 끌어다 놓기: 터치 기기는 손가락 끌기, 데스크톱은 마우스 끌기 */
async function dragTo(page, vp, from, to) {
  const steps = 8;
  const mid = (k) => ({ x: from.x + ((to.x - from.x) * k) / steps, y: from.y + ((to.y - from.y) * k) / steps });
  if (vp.mobile) {
    if (!cdps.has(page)) cdps.set(page, await page.context().newCDPSession(page));
    const cdp = cdps.get(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
    for (let k = 1; k <= steps; k++) {
      const p = mid(k);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    for (let k = 1; k <= steps; k++) await page.mouse.move(mid(k).x, mid(k).y);
    await page.mouse.up();
  }
}

async function cellCenter(page, i, role) {
  return page.evaluate(({ i, role }) => {
    const r = document.querySelectorAll('#frames .frame')[i].querySelector(`.cell.${role}`).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, { i, role });
}

const inCells = (page) => page.evaluate(() => document.querySelectorAll('#frames .jamo-chip.in-cell').length);
const freeChips = (page) => page.evaluate(() => [...document.querySelectorAll('#zone .jamo-chip')].filter((c) => !c.classList.contains('in-cell') && !c.classList.contains('leaving')).map((c) => c.dataset.jamo));

/** 현재 단어를 끌어서 조립한다 (자음 → 모음 → 받침, 음절 차례대로) */
async function solveWord(page, vp, shotPrefix) {
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
      const cell = await cellCenter(page, i, frames[i].roles[k]);
      await dragTo(page, vp, c, { x: cell.x + 7, y: cell.y + 6 }); // 손가락이 가운데를 조금 벗어나도 들어가는지
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

async function pickHero(page, theme) {
  await page.click(`.hero-card[data-theme="${theme}"]`, { force: true });
  await sleep(700);
}

/** 콤보 단계별 공격을 직접 불러 중간 장면을 찍는다 (연출 확인용, dev 전용 훅) */
async function fxGallery(page, vp, theme) {
  await page.evaluate(async (t) => {
    const { scene, game } = window.__hd;
    game.toMenu();
    document.getElementById('overlay').hidden = true;
    scene.setTheme(t);
    await scene.spawnFoe('dino', 9, 9);
  }, theme);
  for (const tier of ['basic', 'rapid', 'missiles', 'finisher']) {
    const done = page.evaluate((tier) => window.__hd.scene.attack(tier, 8, false), tier);
    await sleep(tier === 'basic' ? 250 : tier === 'rapid' ? 450 : 700);
    await page.screenshot({ path: `${OUT}/${vp.name}-fx-${theme}-${tier}.png` });
    await done;
  }
  await page.evaluate(() => window.__hd.scene.guard(true));
  await sleep(450);
  await page.screenshot({ path: `${OUT}/${vp.name}-fx-${theme}-guard.png` });
  const healing = page.evaluate(() => window.__hd.scene.reboot(4));
  await sleep(700);
  await page.screenshot({ path: `${OUT}/${vp.name}-fx-${theme}-heal.png` });
  await healing;
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
  const startDisabled = await page.evaluate(() => document.getElementById('t-start').disabled);
  await page.screenshot({ path: `${OUT}/${vp.name}-01-title.png` });

  // 1) 로봇 선택 → 수박 전투
  await pickHero(page, 'robot');
  await page.screenshot({ path: `${OUT}/${vp.name}-01b-robot-picked.png` });
  await page.click('#t-start', { force: true });
  // 첫 수박부터 오답 자모가 섞여 나오는지 (정답 ㅅㅜ/ㅂㅏㄱ 말고 다른 칩)
  await waitFor(page, () => window.__hd.game.phase === 'compose' && document.querySelectorAll('#zone .jamo-chip').length > 0);
  await sleep(200);
  const firstChips = await page.evaluate(() => [...document.querySelectorAll('#zone .jamo-chip')].map((c) => c.dataset.jamo));
  const firstDistractors = firstChips.filter((j) => !'ㅅㅜㅂㅏㄱ'.includes(j));

  // 음절·단어 읽기 순서를 기록한다 (헤드리스에는 한국어 음성이 없어 호출만 본다)
  await page.evaluate(() => {
    const a = window.__hd.audio;
    window.__said = [];
    const syl = a.playSyllable.bind(a);
    const word = a.playWord.bind(a);
    a.playSyllable = (x) => (window.__said.push(`음절:${x}`), syl(x));
    window.__wordPlays = [];
    a.playWord = (x) => {
      window.__said.push(`단어:${x.replace(/^w_/, '')}`);
      const p = word(x);
      p.then((r) => window.__wordPlays.push(`${x.replace(/^w_/, '')}:${r.method}:${r.ok ? 'ok' : 'x'}`));
      return p;
    };
  });

  // 탭만 하면 들어가지 않는다
  const s0 = await chipCenter(page, 'ㅅ');
  await tapAt(page, vp, s0.x, s0.y);
  await sleep(300);
  const tapInserted = (await inCells(page)) > 0;
  // 순서가 아닌 칸(모음 칸)에 먼저 놓으면 돌아온다
  const u0 = await chipCenter(page, 'ㅜ');
  await dragTo(page, vp, u0, await cellCenter(page, 0, 'jung'));
  await sleep(300);
  const outOfOrderInserted = (await inCells(page)) > 0;
  // 칸 밖 먼 곳에 놓아도 돌아온다
  const s1 = await chipCenter(page, 'ㅅ');
  const fr = await page.evaluate(() => document.querySelector('#frames').getBoundingClientRect().toJSON());
  await dragTo(page, vp, s1, { x: fr.left + 4, y: fr.bottom - 4 });
  await sleep(300);
  const farDropInserted = (await inCells(page)) > 0;

  // 함정으로 네 번 틀려도 함정 자모가 하나는 남는다 (계속 막히면 줄여 주되 0개로는 안 줄인다)
  const trapsSeen = [];
  for (let t = 0; t < 4; t++) {
    const free = await freeChips(page);
    const traps = free.filter((j) => !'ㅅㅜ'.includes(j));
    trapsSeen.push(traps.join(''));
    const trap = traps[0];
    const isVowel = /[ㅏ-ㅣ]/.test(trap);
    const [a, b] = isVowel ? ['ㅅ', trap] : [trap, 'ㅜ'];
    await dragTo(page, vp, await chipCenter(page, a), await cellCenter(page, 0, 'cho'));
    await sleep(150);
    await dragTo(page, vp, await chipCenter(page, b), await cellCenter(page, 0, 'jung'));
    await waitFor(page, (n) => window.__hd.game.current.mistakes >= n && document.querySelectorAll('#frames .jamo-chip.in-cell').length === 0, t + 1);
    await sleep(1100);
  }
  // 도움이 몇 번 더 불려도 0개가 되지 않는지
  await page.evaluate(() => [1, 2, 3].forEach(() => window.__hd.game.cockpit.reduceChoices()));
  await sleep(400);
  const trapsLeft = (await freeChips(page)).filter((j) => !'ㅅㅜ'.includes(j)).join('');
  trapsSeen.push(trapsLeft);
  await page.evaluate(() => (window.__said = []));

  const log = [];
  for (let n = 0; n < 3; n++) {
    const w = await solveWord(page, vp, n === 0 ? `${vp.name}-02` : null);
    if (n === 0 || n === 2) {
      await sleep(n === 0 ? 350 : 700);
      await page.screenshot({ path: `${OUT}/${vp.name}-03-robot-attack${n}.png` });
    }
    log.push(w);
  }
  await waitFor(page, () => window.__hd.game.phase === 'victory' && !document.getElementById('overlay').hidden, null, 30000);
  const combo1 = await page.evaluate(() => window.__hd.saves.data.stats.bestCombo);
  const said = await page.evaluate(() => window.__said.slice());
  const i1 = said.indexOf('음절:수');
  const i2 = said.indexOf('음절:박', i1 + 1);
  // 녹음이 있는 수박은 녹음 파일로, 끝까지 재생되어야 한다
  const wordPlays = await page.evaluate(() => window.__wordPlays.slice());
  const subakRecording = wordPlays.some((x) => x === '수박:file:ok');
  const syllablesRead = i1 >= 0 && i2 > i1 && said.indexOf('단어:수박', i2 + 1) > i2;
  await page.screenshot({ path: `${OUT}/${vp.name}-04-victory.png` });

  // 2) 다음 전투 (쉬운 단어) 두 단어 + 일시정지
  await page.click('#v-next', { force: true });
  const s2 = [];
  for (let n = 0; n < 2; n++) s2.push(await solveWord(page, vp, n === 0 ? `${vp.name}-05-s2` : null));
  await waitFor(page, () => window.__hd.game.phase === 'compose');
  await page.click('#btn-pause', { force: true });
  await sleep(200);
  const paused = await page.evaluate(() => window.__hd.game.paused);
  await page.screenshot({ path: `${OUT}/${vp.name}-06-pause.png` });
  await page.click('#p-resume', { force: true });
  const resumed = await page.evaluate(() => !window.__hd.game.paused);

  // 3) 처음 화면으로 → 마법소녀 선택 → 기록 유지 확인 → 같은 수박 전투
  await page.click('#btn-pause', { force: true });
  await page.click('#p-home', { force: true });
  await page.waitForSelector('.hero-card');
  const before = await page.evaluate(() => JSON.stringify({ c: window.__hd.saves.data.cleared, w: window.__hd.saves.data.stats.words['수박'] }));
  await pickHero(page, 'magicalGirl');
  await page.screenshot({ path: `${OUT}/${vp.name}-07-magic-picked.png` });
  const after = await page.evaluate(() => JSON.stringify({ c: window.__hd.saves.data.cleared, w: window.__hd.saves.data.stats.words['수박'] }));
  await page.click('#t-map', { force: true });
  await page.click('[data-stage="s1"]', { force: true });
  const log3 = [];
  for (let n = 0; n < 3; n++) {
    const w = await solveWord(page, vp, n === 0 ? `${vp.name}-08-magic` : null);
    if (n === 0 || n === 2) {
      await sleep(n === 0 ? 350 : 700);
      await page.screenshot({ path: `${OUT}/${vp.name}-09-magic-attack${n}.png` });
    }
    log3.push(w);
  }
  await waitFor(page, () => window.__hd.game.phase === 'victory' && !document.getElementById('overlay').hidden, null, 30000);
  await page.screenshot({ path: `${OUT}/${vp.name}-10-magic-victory.png` });
  const theme = await page.evaluate(() => window.__hd.saves.data.settings.characterTheme);

  // 4) 난이도 단계 전투: 지도(개발용 전부 열림) → 받침 없음 / 받침 / 쌍자음·ㅐ / 보스에서 단어가 단계에 맞게 나오는지
  await page.click('#v-home', { force: true });
  await page.waitForSelector('#t-map');
  await page.click('#t-map', { force: true });
  await page.waitForSelector('[data-stage="s6"]');
  await sleep(300);
  await page.screenshot({ path: `${OUT}/${vp.name}-11-map.png` });
  const tiers = {};
  for (const [id, n] of [['s3', 2], ['s4', 2], ['s5', 2], ['s6', 1]]) {
    if (id !== 's3') {
      await page.click('#btn-pause', { force: true });
      await page.click('#p-home', { force: true });
      await page.waitForSelector('#t-map');
      await page.click('#t-map', { force: true });
    }
    await page.click(`[data-stage="${id}"]`, { force: true });
    tiers[id] = [];
    for (let k = 0; k < n; k++) {
      await waitFor(page, () => window.__hd.game.phase === 'compose');
      const t = await page.evaluate(() => {
        const fr = window.__hd.game.current.frames;
        const dbl = /[ㄲㄸㅃㅆㅉ]/;
        const tense = fr.some((f) => dbl.test(f.cho) || dbl.test(f.jong) || /[ㅐㅔㅒㅖ]/.test(f.jung));
        return tense ? 'tense' : fr.some((f) => f.hasJong) ? 'jong' : 'plain';
      });
      const w = await solveWord(page, vp, k === 0 && id !== 's6' ? `${vp.name}-12-${id}` : null);
      tiers[id].push(`${w}:${t}`);
    }
  }
  const tierOk =
    tiers.s3.every((x) => x.endsWith(':plain')) && tiers.s4.every((x) => x.endsWith(':jong')) && tiers.s5.every((x) => x.endsWith(':tense'));

  if (vp.name.startsWith('phone-390')) {
    await fxGallery(page, vp, 'robot');
    await fxGallery(page, vp, 'magicalGirl');
  }

  const stats = await page.evaluate(() => window.__hd.saves.data.stats.words);
  await browser.close();
  return {
    vp: vp.name,
    startDisabledBeforePick: startDisabled,
    firstChips: firstChips.join(''),
    firstDistractors: firstDistractors.join(''),
    tapInserted,
    outOfOrderInserted,
    farDropInserted,
    trapsSeen,
    trapsLeft,
    syllablesRead,
    subakRecording,
    wordPlays: wordPlays.slice(0, 6).join(' '),
    said: said.slice(0, 8).join(' '),
    robot: log,
    bestCombo: combo1,
    battle2: s2,
    paused,
    resumed,
    keptOnSwitch: before === after,
    magic: log3,
    savedTheme: theme,
    tiers,
    tierOk,
    words: Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, `${v.independent}/${v.assisted}`])),
    errors,
  };
}

const only = process.argv[2];
let failed = false;
for (const vp of VIEWPORTS.filter((v) => !only || v.name.includes(only))) {
  try {
    const r = await run(vp);
    console.log(JSON.stringify(r));
    if (r.errors.length || !r.paused || !r.resumed || !r.keptOnSwitch || !r.startDisabledBeforePick || r.savedTheme !== 'magicalGirl' || !r.tierOk || r.firstDistractors.length < 2) failed = true;
    if (r.tapInserted || r.outOfOrderInserted || r.farDropInserted || r.trapsLeft.length < 1 || !r.syllablesRead || !r.subakRecording) failed = true;
  } catch (e) {
    failed = true;
    console.log(`${vp.name} FAILED: ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
