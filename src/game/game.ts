// 게임 흐름: 적 등장 → (대사) → 암호 수신기가 단어를 말함 → 자모 조립 → 단어 완성 → 로봇 공격 → 적 차례 → 다음 단어.
// 조합하는 동안에는 적의 피해도, 시간 초과 패배도 없다. 빠르게 완성하면 콤보가 올라 공격이 화려해진다.
import { THEMES, themeOf, type CharacterTheme, type ThemeDef } from '../content/characters';
import { STAGES, drawWord, nextStageId, stageById, stageWords, type StageDef } from '../content/stages';
import { CONFUSABLE, DISTRACTORS_PER_LEVEL } from '../content/distractors';
import { vocabById, type VocabEntry } from '../content/vocab';
import { pictureSvg } from '../content/pictures';
import { confusableDistractors, jamoCount, requiredJamo, wordFrames, cellsOf, type FrameSpec } from '../core/assembly';
import { createBattle, foeTurn, robotAttack, spawnFoe } from '../core/battle';
import { bonusTimeMs, ComboClock, damageFor, nextCombo, tierFor, type HelpLevel } from '../core/combo';
import { focusPool } from '../core/analysis';
import { helpLevelFor, recordSuccess, wordStats } from '../core/progress';
import { decomposeSyllable } from '../hangul/hangul';
import type { BattleState } from '../core/types';
import type { BattleScene } from '../scene/BattleScene';
import { Cockpit } from '../ui/cockpit';
import { ICONS } from '../ui/icons';
import { Screens } from '../ui/screens';
import { audio, options, playlog, saves, sfx } from './services';

type Phase = 'menu' | 'intro' | 'compose' | 'execute' | 'victory';

const WORD_COLORS = ['#ff9d2e', '#2eb8ff', '#b06cff', '#3ed17a', '#ff5a8a'];

interface WordRun {
  entry: VocabEntry;
  frames: FrameSpec[];
  level: HelpLevel;
  toPlace: number;
  assisted: boolean;
  mistakes: number;
  speedEligible: boolean;
  guarded: boolean;
  color: string;
  /** 방금 완성한 음절을 읽는 중 (단어 발음이 이 소리를 끊지 않게 기다린다) */
  syllableSaid: Promise<unknown> | null;
}

export class Game {
  phase: Phase = 'menu';
  paused = false;
  private run = 0;
  private stage: StageDef | null = null;
  private state: BattleState = createBattle();
  private foeIndex = 0;
  private wordIndex = 0;
  private lastWord = '';
  /** 전투별 남은 단어 주머니 */
  private bags = new Map<string, string[]>();
  private combo = 0;
  private current: WordRun | null = null;
  private clock = new ComboClock();
  private idleTimers: ReturnType<typeof setTimeout>[] = [];
  private gaugeRaf = 0;
  private resumeWaiters: (() => void)[] = [];
  private bannerTimer: ReturnType<typeof setTimeout> | undefined;
  readonly cockpit: Cockpit;
  readonly screens: Screens;

  constructor(private scene: BattleScene) {
    this.cockpit = new Cockpit(document.getElementById('cockpit')!, {
      onPlaced: (frac) => {
        this.scene.setCharge(frac * 0.9, this.current?.color);
        this.resetIdle();
      },
      onFrameResult: (i, r) => {
        const cur = this.current;
        if (!cur) return;
        if (r.kind === 'different') {
          const got = r.made ? decomposeSyllable(r.made) : null;
          const need = requiredJamo(cur.frames);
          for (const role of r.wrongCells) {
            const put = got ? got[role] || null : null;
            playlog.miss(cur.frames[i].syllable, role, cur.frames[i][role], put, !!put && !need.includes(put));
          }
          this.onWrongSyllable(cur, r.wrongCells.map((role) => cur.frames[i][role]), r.made);
        }
        // 한 음절이 맞으면 그 음절 소리로 읽는다 (사용자 지시). 한 글자 단어는 곧 단어로 읽으므로 건너뛴다.
        // (예전의 '거의 다 됐어' 격려 대사는 음절 소리와 겹쳐서 뺐다)
        else if (r.kind === 'correct' && cur.frames.length >= 2) cur.syllableSaid = audio.playSyllable(cur.frames[i].syllable);
      },
      onWordComplete: () => void this.finishWord(this.run),
      onInteract: () => this.resetIdle(),
      onRejectedDrop: (jamo, exp, over) => {
        const cur = this.current;
        if (!cur || !exp) return;
        const f = cur.frames[exp.frame];
        playlog.drop(f.syllable, exp.role, f[exp.role], jamo, !over ? null : over.frame === exp.frame ? over.role : 'other', !requiredJamo(cur.frames).includes(jamo));
      },
      onSlipDrop: () => playlog.slip(),
      onTapOnly: () => {
        this.resetIdle();
        sfx.play('tap');
      },
    });
    this.screens = new Screens(this);
    document.getElementById('btn-help')!.innerHTML = ICONS.bulb;
    document.getElementById('btn-pause')!.innerHTML = ICONS.pause;
    this.applyTheme(saves.data.settings.characterTheme ?? 'robot', false);
    document.getElementById('btn-listen')!.addEventListener('click', () => void this.replayWord());
    document.getElementById('word-pic')!.addEventListener('click', () => void this.replayWord());
    document.getElementById('btn-help')!.addEventListener('click', () => this.help());
    document.getElementById('btn-pause')!.addEventListener('click', () => this.pause(true));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause(false);
    });
    window.addEventListener('pagehide', () => this.pause(false));
    scene.hooks.onRobotHp = (hp) => this.showBar('robot-fill', hp, this.state.robotMax);
    scene.hooks.onFoeHp = (hp, max) => this.showBar('foe-fill', hp, max);

    const receiver = document.getElementById('receiver')!;
    const sub = document.getElementById('subtitle')!;
    audio.onPlaying = (ch, text) => {
      receiver.classList.toggle('on', ch !== null);
      receiver.classList.toggle('talk', ch === 'dialogue');
      // 출제 단어는 글자로 보여주지 않는다 (정답 노출 방지). 대사만 자막.
      if (ch === 'dialogue' && this.inBattle) {
        sub.hidden = false;
        sub.querySelector('span')!.textContent = text;
      } else sub.hidden = true;
    };
  }

  // ───────────── 캐릭터 ─────────────

  get theme(): ThemeDef {
    return themeOf(saves.data.settings.characterTheme);
  }

  /**
   * 캐릭터 바꾸기: 전투 그림·효과·대사 목소리·조합판 장식만 바뀐다.
   * 단어·도움 단계·콤보·피해량·기록·해금은 그대로다.
   */
  applyTheme(t: CharacterTheme, save = true): void {
    if (save) {
      saves.data.settings.characterTheme = t;
      saves.save();
    }
    this.scene.setTheme(t);
    audio.dialogueVoice = THEMES[t].dialogueVoice;
    const magic = t === 'magicalGirl';
    document.body.classList.toggle('theme-magic', magic);
    document.querySelector('#btn-listen .spk')!.innerHTML = magic ? ICONS.crystal : ICONS.speaker;
    document.getElementById('btn-listen')!.setAttribute('aria-label', magic ? '마법 수정: 다시 듣기' : '암호 수신기: 다시 듣기');
    document.getElementById('robot-icon')!.innerHTML = magic ? ICONS.magicFace : ICONS.robot;
  }

  /** 선택 화면에서 고른 캐릭터의 짧은 준비 동작 */
  pickDemo(t: CharacterTheme): Promise<void> {
    return this.scene.pickDemo(t);
  }

  // ───────────── 전투 목록 ─────────────

  get unlockedStages(): string[] {
    const cleared = new Set(saves.data.cleared);
    const out: string[] = [];
    for (const s of STAGES) {
      out.push(s.id);
      if (!cleared.has(s.id) && !options.dev) break;
    }
    return out;
  }

  nextStageId(): string {
    return nextStageId(saves.data.cleared, saves.data.lastStage);
  }

  toMenu(): void {
    this.run++;
    playlog.abandon();
    this.phase = 'menu';
    this.setPausedState(false);
    this.clearIdle();
    this.stopGauge();
    this.cockpit.stopLoop();
    this.cockpit.lock(); // 손가락 안내도 함께 숨긴다
    audio.stop();
    this.scene.resetBattle(this.state.robotMax);
    this.showBattleUi(false);
  }

  private showBattleUi(on: boolean): void {
    for (const id of ['topbar', 'cockpit', 'foe-status', 'robot-status']) document.getElementById(id)!.hidden = !on;
    document.getElementById('subtitle')!.hidden = true;
    requestAnimationFrame(() => window.dispatchEvent(new Event('hd-layout')));
  }

  // ───────────── 전투 ─────────────

  async startStage(id: string): Promise<void> {
    const stage = stageById(id) ?? STAGES[0];
    const my = ++this.run;
    this.stage = stage;
    this.setPausedState(false);
    this.screens.close();
    this.state = createBattle();
    this.foeIndex = 0;
    this.wordIndex = 0;
    this.combo = 0;
    this.showCombo(false);
    const st = saves.data.stats;
    st.battlesPlayed[id] = (st.battlesPlayed[id] ?? 0) + 1;
    playlog.battle(stage.id);
    saves.data.lastStage = stage.id;
    saves.save();
    this.scene.resetBattle(this.state.robotHp);
    this.showBattleUi(true);
    this.showStageBanner(stage);
    const set = saves.data.settings;
    audio.preload(stageWords(stage, set.pack, set.includeRecommended).map((w) => w.wordAudioId));
    this.cockpit.setup({ frames: [], ghost: [], sequential: true, supply: [[]], motion: false });
    this.cockpit.lock();
    await this.nextFoe(my, true);
  }

  /** 전투 시작 때 몇 단계인지 잠깐 보여 준다 (단계가 이어진다는 것을 보이게) */
  private showStageBanner(stage: StageDef): void {
    const el = document.getElementById('stage-banner')!;
    const n = STAGES.findIndex((s) => s.id === stage.id) + 1;
    el.querySelector('b')!.textContent = `${n}단계`;
    el.querySelector('span')!.textContent = stage.name;
    el.hidden = false;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => (el.hidden = true), 2400);
  }

  private renderFoeDots(): void {
    const dots = document.getElementById('foe-dots')!;
    dots.innerHTML = '';
    this.stage!.foes.forEach((_, i) => {
      const d = document.createElement('i');
      if (i < this.foeIndex) d.className = 'done';
      else if (i === this.foeIndex) d.className = 'now';
      dots.appendChild(d);
    });
  }

  private async nextFoe(my: number, first: boolean): Promise<void> {
    const spawn = this.stage!.foes[this.foeIndex];
    this.phase = 'intro';
    this.renderFoeDots();
    const foe = spawnFoe(this.state, spawn);
    document.getElementById('foe-icon')!.innerHTML = ICONS[spawn.kind];
    await this.whenResumed();
    if (my !== this.run) return;
    const line = spawn.kind === 'boss' ? 'd_boss' : first ? 'd_enemy' : 'd_next';
    const talk = audio.playDialogue(line, { force: true });
    await this.scene.spawnFoe(foe.kind, foe.hp, foe.maxHp);
    if (my !== this.run) return;
    this.scene.setCharging(true);
    await Promise.race([talk, this.scene.wait(2200)]);
    if (my !== this.run) return;
    await this.presentWord(my, true);
  }

  private pickWord(): VocabEntry {
    const s = this.stage!;
    if (s.fixedWords && this.wordIndex < s.fixedWords.length) return vocabById(s.fixedWords[this.wordIndex])!;
    const set = saves.data.settings;
    const pool = focusPool(stageWords(s, set.pack, set.includeRecommended).map((w) => w.word), set.focusJamo, set.focusWords);
    // 전투마다 섞은 주머니에서 하나씩: 다 쓰기 전엔 반복 없음, 다시 해도 이어서 뽑는다 (기기에는 저장하지 않음)
    const key = `${s.id}|${set.pack}|${set.includeRecommended}`;
    const { word, bag } = drawWord(this.bags.get(key) ?? [], pool, this.lastWord, Math.random);
    this.bags.set(key, bag);
    return vocabById(word)!;
  }

  private async presentWord(my: number, firstForFoe: boolean): Promise<void> {
    await this.whenResumed();
    if (my !== this.run) return;
    const entry = this.pickWord();
    this.wordIndex++;
    this.lastWord = entry.word;
    const frames = wordFrames(entry.word)!;
    const level = helpLevelFor(saves.data.stats, entry.id, saves.data.settings.helpMode);
    const toPlace = jamoCount(frames);
    const sequential = level === 'A' || level === 'B' || frames.length >= 3 || toPlace > 7;
    const ws = wordStats(saves.data.stats, entry.id);
    ws.attempts++;
    saves.save();
    playlog.begin(entry.id, this.stage!.id, level);
    // 방해 자모: 첫 수박부터 헷갈리는 자모를 섞는다 (계속 틀리면 cockpit이 하나씩 치운다)
    const all = requiredJamo(frames);
    const extra = DISTRACTORS_PER_LEVEL[level];
    const supply = frames.map((f) => cellsOf(f).map((r) => f[r]));
    if (sequential) supply.forEach((list) => list.push(...confusableDistractors([...list], all, extra.perSyllable, Math.random, CONFUSABLE)));
    else supply[0].push(...confusableDistractors(all, all, extra.perWord, Math.random, CONFUSABLE));
    const ghost = frames.map((_, i) => level === 'A' || (level === 'B' && i === 0));
    const color = WORD_COLORS[this.wordIndex % WORD_COLORS.length];
    this.current = { entry, frames, level, toPlace, assisted: level === 'A' || level === 'B', mistakes: 0, speedEligible: true, guarded: false, color, syllableSaid: null };
    this.cockpit.setup({ frames, ghost, sequential, supply, motion: saves.data.settings.jamoMotion });
    this.showPicture(entry);
    this.phase = 'intro';
    this.scene.setCharge(0, color);

    // 순서: 전투 대사 → 대사 끝 → 단어 음성 → 조합 시작 (둘을 겹치지 않는다)
    if (firstForFoe) {
      await Promise.race([audio.playDialogue(this.theme.lines.hurry, { cooldownMs: 20000 }), this.scene.wait(3000)]);
      if (my !== this.run) return;
    }
    await this.whenResumed();
    if (my !== this.run) return;
    const said = await audio.playWord(entry.wordAudioId);
    if (my !== this.run || this.current?.entry !== entry) return;
    // 재생 오류가 난 문제는 속도 평가에서 뺀다 (소리가 원래 없는 기기는 부모와 함께 진행하므로 그대로 잰다)
    this.current.speedEligible = said.ok || said.method === 'none' || audio.muted;
    // 소리가 실제로 끝나지 않았으면 들었다고 치지 않는다: 다시 듣기 버튼을 깜빡여 알려준다
    document.getElementById('btn-listen')!.classList.toggle('nudge', !said.ok && !audio.muted);
    this.phase = 'compose';
    this.cockpit.unlock();
    this.clock.begin();
    if (this.paused) this.clock.hold('pause');
    this.startGauge();
    if (level === 'A') setTimeout(() => this.phase === 'compose' && this.current?.entry === entry && this.cockpit.showNextHint(), 500 / options.speed);
    this.resetIdle();
  }

  /** 단어 뜻 그림 (글자 없이 뜻만). 그림이 없는 단어는 칸을 비운다. */
  private showPicture(entry: VocabEntry): void {
    const el = document.getElementById('word-pic')!;
    const svg = pictureSvg(entry.pictureId);
    el.innerHTML = svg ?? '';
    el.classList.toggle('empty', !svg);
    el.classList.remove('pop');
    if (svg) {
      void el.offsetWidth;
      el.classList.add('pop');
    }
  }

  // ───────────── 조합 중 ─────────────

  /** 가만히 있으면: 도움 단계가 낮을 때 손가락 안내, 오래 막히면 로봇이 막아 주며 안심시킨다 */
  private resetIdle(): void {
    this.clearIdle();
    const cur = this.current;
    if (this.phase !== 'compose' || this.paused || !cur) return;
    if (cur.level === 'A' || cur.level === 'B') {
      this.idleTimers.push(
        setTimeout(() => {
          if (this.phase === 'compose' && this.current === cur && this.cockpit.showNextHint()) cur.assisted = true;
        }, 9000 / options.speed),
      );
    }
    this.idleTimers.push(
      setTimeout(() => {
        if (this.phase !== 'compose' || this.current !== cur || cur.guarded) return;
        cur.guarded = true;
        this.scene.guard(true);
        void audio.playDialogue('d_guard', { cooldownMs: 30000 });
      }, 15000 / options.speed),
    );
  }

  private clearIdle(): void {
    this.idleTimers.forEach(clearTimeout);
    this.idleTimers = [];
  }

  private onWrongSyllable(cur: WordRun, wrongTargets: string[], made: string | null): void {
    cur.mistakes++;
    const st = saves.data.stats;
    wordStats(st, cur.entry.id).wrongSyllables++;
    for (const j of wrongTargets) st.stuckJamo[j] = (st.stuckJamo[j] ?? 0) + 1;
    saves.save();
    const my = this.run;
    // 다른 글자를 만들었어도 '틀린 한글'이라고 하지 않는다: 암호를 다시 들어 보자고 안내한다
    if (cur.mistakes === 1 || !made) void audio.playDialogue('d_retry', { force: true });
    else {
      void audio.playDialogue('d_relisten', { force: true }).then(() => {
        if (this.run === my && this.current === cur && this.phase === 'compose') void this.replayWord(false);
      });
    }
    if (!saves.data.settings.autoHelp) return;
    setTimeout(() => {
      if (this.current !== cur || this.phase !== 'compose') return;
      if (cur.mistakes >= 2 && this.cockpit.reduceChoices()) cur.assisted = true;
      if (cur.mistakes >= 3 && this.cockpit.showNextHint()) cur.assisted = true;
    }, 800 / options.speed);
  }

  /** 음성 다시 듣기: 조합 상태는 그대로, 듣는 동안 콤보 시간은 멈춘다. 정답 보기와 따로 센다. */
  async replayWord(count = true): Promise<void> {
    const cur = this.current;
    if (!cur || this.paused || (this.phase !== 'compose' && this.phase !== 'intro')) return;
    if (count) {
      wordStats(saves.data.stats, cur.entry.id).replays++;
      playlog.replay();
      saves.save();
    }
    this.clock.hold('replay');
    const r = await audio.playWord(cur.entry.wordAudioId);
    document.getElementById('btn-listen')!.classList.toggle('nudge', !r.ok && !audio.muted);
    this.clock.release('replay');
    this.resetIdle();
  }

  /** 정답 자모 보기: 1번째 = 지금 음절의 흐린 자모, 2번째부터 = 다음 자모와 칸을 손가락으로 */
  help(): void {
    const cur = this.current;
    if (!cur || this.paused || this.phase !== 'compose') return;
    sfx.play('tap');
    cur.assisted = true;
    const ws = wordStats(saves.data.stats, cur.entry.id);
    ws.hintViews++;
    playlog.hint();
    saves.save();
    const fi = this.cockpit.currentFrame;
    if (ws.hintViews % 2 === 1) this.cockpit.setGhost(fi, true);
    this.cockpit.showNextHint();
    this.resetIdle();
  }

  // ───────────── 콤보 게이지 ─────────────

  private startGauge(): void {
    this.stopGauge();
    const gauge = document.getElementById('combo-gauge')!;
    const fill = gauge.querySelector('.fill') as HTMLElement;
    const cur = this.current!;
    const bonus = bonusTimeMs(cur.toPlace, cur.level);
    gauge.classList.toggle('live', this.combo > 0);
    const tick = () => {
      if (!this.clock.isRunning) return;
      const left = Math.max(0, 1 - this.clock.elapsed() / bonus);
      fill.style.width = `${left * 100}%`;
      this.gaugeRaf = requestAnimationFrame(tick);
    };
    tick();
  }

  private stopGauge(): void {
    cancelAnimationFrame(this.gaugeRaf);
  }

  private showCombo(on: boolean, bump = false): void {
    const el = document.getElementById('combo')!;
    el.hidden = !on;
    el.querySelector('b')!.textContent = String(this.combo);
    if (bump) {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
  }

  // ───────────── 단어 완성 → 공격 → 적 차례 ─────────────

  private async finishWord(my: number): Promise<void> {
    const cur = this.current;
    if (!cur || this.phase !== 'compose') return;
    // 여기서 곧바로 단계를 바꿔 같은 완성이 두 번 실행되지 않게 한다
    this.phase = 'execute';
    this.cockpit.lock();
    this.clearIdle();
    const elapsed = this.clock.stop();
    this.stopGauge();
    const bonus = bonusTimeMs(cur.toPlace, cur.level, undefined);
    const prevCombo = this.combo;
    this.combo = nextCombo(this.combo, elapsed, bonus, cur.speedEligible);
    const tier = tierFor(this.combo);
    const damage = damageFor(tier);
    const st = saves.data.stats;
    recordSuccess(st, cur.entry.id, cur.assisted, elapsed);
    playlog.finish(cur.assisted, elapsed);
    st.bestCombo = Math.max(st.bestCombo, this.combo);
    if (tier === 'finisher') st.finishers++;
    saves.save();

    // 완성 → 발음 → 에너지 전송 → 발사 → 명중
    this.cockpit.showConnected(cur.color);
    // 마지막 음절 소리("박")가 끝난 뒤 단어("수박")를 읽는다. 음성이 멈춰도 오래 기다리지 않는다.
    if (cur.syllableSaid) await Promise.race([cur.syllableSaid, this.scene.wait(1200)]);
    if (my !== this.run) return;
    const wordSaid = audio.playWord(cur.entry.wordAudioId);
    await this.scene.playTransfer(cur.frames.map((f) => f.syllable), this.cockpit.frameRects(), cur.color);
    if (my !== this.run) return;
    await Promise.race([wordSaid, this.scene.wait(900)]);
    if (my !== this.run) return;
    this.showCombo(this.combo >= 2, this.combo > prevCombo);
    const L = this.theme.lines;
    // 대사는 단계가 바뀔 때만 (매 공격마다 말하지 않는다). 첫 공격에는 준비 완료 대사.
    const firstHit = this.wordIndex === 1 && this.foeIndex === 0;
    const line = tier === 'finisher' ? L.finish : tier === 'missiles' ? (this.combo === 4 ? L.power : null) : tier === 'rapid' ? (this.combo === 2 ? L.combo : null) : firstHit ? L.ready : null;
    if (line) void audio.playDialogue(line, { force: true });
    const hit = robotAttack(this.state, damage);
    await this.scene.attack(tier, hit.type === 'hit' ? hit.hpAfter : 0, hit.type === 'hit' && hit.defeated);
    if (my !== this.run) return;

    if (hit.type === 'hit' && hit.defeated) {
      this.foeIndex++;
      if (this.foeIndex >= this.stage!.foes.length) return this.victory(my);
      this.renderFoeDots();
      await this.scene.wait(300);
      if (my !== this.run) return;
      return this.nextFoe(my, false);
    }

    for (const ev of foeTurn(this.state)) {
      if (ev.type === 'foeCharge') this.scene.setCharging(true);
      else if (ev.type === 'foeAttack') await this.scene.foeAttack(ev.damage, ev.hpAfter);
      else if (ev.type === 'reboot') {
        saves.data.stats.reboots++;
        saves.save();
        void audio.playDialogue(this.theme.lines.reboot, { force: true });
        await this.scene.reboot(ev.hpAfter);
      }
      if (my !== this.run) return;
    }
    await this.presentWord(my, false);
  }

  private async victory(my: number): Promise<void> {
    const stage = this.stage!;
    this.phase = 'victory';
    this.renderFoeDots();
    this.cockpit.lock();
    if (!saves.data.cleared.includes(stage.id)) saves.data.cleared.push(stage.id);
    const st = saves.data.stats;
    st.battlesWon[stage.id] = (st.battlesWon[stage.id] ?? 0) + 1;
    saves.save();
    void audio.playDialogue('d_win', { force: true });
    await this.scene.celebrate();
    if (my !== this.run) return;
    this.screens.victory(stage);
  }

  private showBar(id: string, hp: number, max: number): void {
    const fill = document.getElementById(id)!;
    fill.style.width = `${(Math.max(0, hp) / max) * 100}%`;
    fill.classList.toggle('low', id === 'robot-fill' && hp <= max * 0.34);
  }

  // ───────────── 일시정지 ─────────────

  get inBattle(): boolean {
    return this.phase !== 'menu' && this.phase !== 'victory';
  }

  /** 앱 전환·일시정지: 연출·음성·효과음·콤보 시간을 함께 멈춘다. 돌아와도 밀린 공격이 한꺼번에 처리되지 않는다. */
  pause(showMenu: boolean): void {
    if (!this.inBattle) {
      audio.stop();
      return;
    }
    if (!this.paused) this.setPausedState(true);
    if (showMenu || document.hidden) this.screens.pause();
  }

  resume(): void {
    this.screens.close();
    this.setPausedState(false);
    this.resetIdle();
  }

  private setPausedState(p: boolean): void {
    if (this.paused === p) return;
    this.paused = p;
    this.cockpit.setPaused(p);
    if (p) {
      this.clock.hold('pause');
      this.clearIdle();
      audio.stop();
      this.scene.scene.pause();
      sfx.suspend();
    } else {
      this.clock.release('pause');
      this.scene.scene.resume();
      sfx.resume();
      const w = this.resumeWaiters;
      this.resumeWaiters = [];
      w.forEach((f) => f());
    }
  }

  private whenResumed(): Promise<void> {
    if (!this.paused) return Promise.resolve();
    return new Promise((r) => this.resumeWaiters.push(r));
  }

  setMotion(on: boolean): void {
    this.cockpit.setMotion(on);
  }

  setReduceEffects(on: boolean): void {
    this.scene.reduceEffects = on;
  }
}
