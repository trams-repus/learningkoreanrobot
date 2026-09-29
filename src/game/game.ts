// 게임 흐름: 적 등장 → (대사) → 암호 수신기가 단어를 말함 → 자모 조립 → 단어 완성 → 로봇 공격 → 적 차례 → 다음 단어.
// 조합하는 동안에는 적의 피해도, 시간 초과 패배도 없다. 빠르게 완성하면 콤보가 올라 공격이 화려해진다.
// 단어마다 필살기 에너지가 차고(빠를수록 많이), 가득 차면 다음 단어는 손가락으로 따라 써서 최고 필살기를 쏜다.
import { THEMES, themeOf, type CharacterTheme, type ThemeDef } from '../content/characters';
import { drawWord, frontier, nextStageId, regionEnd, regionIndexOf, regionLook, stageAt, stageById, stageNum, stageWords, type StageDef } from '../content/stages';
import { TRAP_TABLES } from '../content/distractors';
import { vocabById, type VocabEntry } from '../content/vocab';
import { pictureSvg } from '../content/pictures';
import { jamoCount, pickTraps, requiredJamo, wordFrames, cellsOf, type FrameSpec, type TrapGrade } from '../core/assembly';
import { actorOf, createBattle, foeTurn, planTier, robotAttack, spawnWave, strongerTier, target, waveHp, weakForSpecial } from '../core/battle';
import { bonusTimeMs, ComboClock, comboTimeMs, energyAfter, ENERGY_CONFIG, nextCombo, tierFor, type AttackTier, type HelpLevel } from '../core/combo';
import { pickWriteWord } from '../core/writing';
import { focusPool } from '../core/analysis';
import { helpLevelFor, recordSuccess, wordStats } from '../core/progress';
import { decomposeSyllable, splitWord } from '../hangul/hangul';
import type { BattleState, Hit } from '../core/types';
import type { BattleScene } from '../scene/BattleScene';
import { Cockpit } from '../ui/cockpit';
import { ICONS } from '../ui/icons';
import { Screens } from '../ui/screens';
import { WritePad } from '../ui/writepad';
import { audio, options, playlog, saves, sfx } from './services';

type Phase = 'menu' | 'intro' | 'compose' | 'write' | 'execute' | 'victory';

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

/** 따라 쓰기 필살기 단어 */
interface WriteRun {
  entry: VocabEntry;
  syllables: string[];
  color: string;
  syllableSaid: Promise<unknown> | null;
}

export class Game {
  phase: Phase = 'menu';
  paused = false;
  private run = 0;
  private stage: StageDef | null = null;
  private state: BattleState = createBattle();
  private waveIndex = 0;
  /** 이 전투에서 쓰러뜨린 적 수 (적 점 표시) */
  private defeatedCount = 0;
  /** 이 전투에서 한 공격 수 (첫 공격 = 새 공격 소개) */
  private attacks = 0;
  private wordIndex = 0;
  private lastWord = '';
  /** 전투별 남은 단어 주머니 */
  private bags = new Map<string, string[]>();
  private combo = 0;
  private current: WordRun | null = null;
  private writeRun: WriteRun | null = null;
  /** 에너지가 가득 찬 까닭: 콤보로 모음 / 보스가 약해져서 채워 줌 (대사가 다르다) */
  private specialCue: 'energy' | 'weak' = 'energy';
  private clock = new ComboClock();
  private idleTimers: ReturnType<typeof setTimeout>[] = [];
  private gaugeRaf = 0;
  private resumeWaiters: (() => void)[] = [];
  private bannerTimer: ReturnType<typeof setTimeout> | undefined;
  readonly cockpit: Cockpit;
  readonly writepad: WritePad;
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
    this.writepad = new WritePad(document.getElementById('writepad')!, {
      onSyllableDone: (i) => {
        const w = this.writeRun;
        // 조립 때처럼 음절을 다 쓰면 그 음절을 읽는다 (한 글자 단어는 곧 단어로 읽는다)
        if (w && w.syllables.length >= 2) w.syllableSaid = audio.playSyllable(w.syllables[i]);
      },
      onWordDone: () => void this.finishWriting(this.run),
      onInteract: () => this.resetIdle(),
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

  /** 앞에서부터 이어서 깬 다음 단계까지 열린다 (개발 옵션이면 모두) */
  isUnlocked(id: string): boolean {
    const n = stageNum(id);
    return n !== null && (options.dev || n <= frontier(saves.data.cleared));
  }

  nextStageId(): string {
    return nextStageId(saves.data.cleared);
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
    this.writepad.lock();
    this.writeRun = null;
    this.setWriting(false);
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
    const stage = stageById(id) ?? stageAt(1);
    const my = ++this.run;
    this.stage = stage;
    this.scene.setLook(regionLook(regionIndexOf(stage.num)));
    this.setPausedState(false);
    this.screens.close();
    this.state = createBattle();
    this.waveIndex = 0;
    this.defeatedCount = 0;
    this.attacks = 0;
    this.wordIndex = 0;
    this.combo = 0;
    this.writeRun = null;
    this.specialCue = 'energy';
    this.writepad.lock();
    this.setWriting(false);
    this.renderEnergy();
    this.scene.fxScale = stage.fxScale ?? 1;
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
    await this.nextWave(my, true);
  }

  /** 전투 시작 때 몇 단계인지 잠깐 보여 준다 (단계가 이어진다는 것을 보이게) */
  private showStageBanner(stage: StageDef): void {
    const el = document.getElementById('stage-banner')!;
    el.querySelector('b')!.textContent = `${stage.num}단계`;
    el.querySelector('span')!.textContent = stage.name;
    el.hidden = false;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => (el.hidden = true), 2400);
  }

  /** 적 점: 이 전투의 적 한 마리마다 하나 (쓰러뜨림 / 지금 나옴 / 남음) */
  private renderFoeDots(): void {
    const dots = document.getElementById('foe-dots')!;
    dots.innerHTML = '';
    const waves = this.stage!.waves;
    const total = waves.reduce((n, w) => n + w.length, 0);
    const shown = waves.slice(0, this.waveIndex + 1).reduce((n, w) => n + w.length, 0);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('i');
      if (i < this.defeatedCount) d.className = 'done';
      else if (i < shown) d.className = 'now';
      dots.appendChild(d);
    }
  }

  private async nextWave(my: number, first: boolean): Promise<void> {
    const stage = this.stage!;
    const foes = spawnWave(this.state, stage.waves[this.waveIndex]);
    this.phase = 'intro';
    this.renderFoeDots();
    document.getElementById('foe-icon')!.innerHTML = ICONS[foes[0].kind];
    await this.whenResumed();
    if (my !== this.run) return;
    const kinds = foes.map((f) => f.kind);
    const line =
      first && stage.intro ? stage.intro : kinds.includes('boss') ? 'd_boss' : kinds.includes('chief') ? 'd_chief' : foes.length > 1 ? 'd_pack' : first ? 'd_enemy' : 'd_next';
    const talk = audio.playDialogue(line, { force: true });
    const hp = waveHp(this.state);
    await this.scene.spawnWave(
      foes.map((f) => ({ id: f.id, kind: f.kind, shield: f.shield })),
      hp.hp,
      hp.max,
    );
    if (my !== this.run) return;
    this.showCharging();
    await Promise.race([talk, this.scene.wait(2600)]);
    if (my !== this.run) return;
    await this.presentWord(my, true);
  }

  /** 다음에 움직일 적 하나에만 공격 준비 표시 (강공격 직전이면 붉은 경고) */
  private showCharging(): void {
    const a = actorOf(this.state);
    if (!a || a.charge <= 0) return this.scene.setCharging(null);
    this.scene.setCharging(a.id, a.chargeTurns > 1 && a.charge >= a.chargeTurns ? 2 : 1);
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
    if (saves.data.energy >= ENERGY_CONFIG.max) return this.presentWriting(my);
    this.setWriting(false);
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
    // 함정 자모: 첫 수박부터 전투가 정한 수·난이도로 섞는다 (계속 틀리면 cockpit이 하나씩 치운다, 최소 1개)
    const stage = this.stage!;
    const all = requiredJamo(frames);
    const targetsOf = (f: FrameSpec) => cellsOf(f).map((role) => ({ jamo: f[role], role }));
    const supply = frames.map((f) => cellsOf(f).map((r) => f[r]));
    if (sequential) frames.forEach((f, i) => supply[i].push(...pickTraps(targetsOf(f), all, stage.traps, Math.random, TRAP_TABLES, stage.advancedTraps)));
    else {
      // 한꺼번에 조립할 때는 정답 자모가 많이 보이므로 함정을 하나 더 (중간)
      const grades: TrapGrade[] = [...stage.traps, 'medium'];
      supply[0].push(...pickTraps(frames.flatMap(targetsOf), all, grades, Math.random, TRAP_TABLES, stage.advancedTraps));
    }
    // 칸 안내(흐린 정답 글자): 11단계부터는 처음 보는 단어에만
    const ghost = frames.map((_, i) => level === 'A' || (stage.guide !== 'less' && level === 'B' && i === 0));
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

  // ───────────── 필살기: 직접 따라 쓰기 ─────────────

  /** 조립판 ↔ 따라 쓰기 판 (조종석 크기는 그대로) */
  private setWriting(on: boolean): void {
    document.getElementById('cockpit')!.classList.toggle('writing', on);
    document.getElementById('writepad')!.hidden = !on;
    if (on) this.writepad.fit();
  }

  /** 에너지 칸 (가득 차면 로봇 상태 칸이 금색으로 빛난다) */
  private renderEnergy(prev = saves.data.energy): void {
    const el = document.getElementById('energy')!;
    const e = saves.data.energy;
    el.innerHTML = '';
    for (let i = 0; i < ENERGY_CONFIG.max; i++) {
      const d = document.createElement('i');
      if (i < e) d.className = i >= prev ? 'on pop' : 'on';
      el.appendChild(d);
    }
    document.getElementById('robot-status')!.classList.toggle('full', e >= ENERGY_CONFIG.max);
  }

  private gainEnergy(tier: AttackTier): void {
    const prev = saves.data.energy;
    saves.data.energy = energyAfter(prev, tier);
    saves.save();
    this.renderEnergy(prev);
    if (prev < ENERGY_CONFIG.max && saves.data.energy >= ENERGY_CONFIG.max) sfx.play('chime');
  }

  /** 에너지가 가득 찼을 때의 단어: 대사 → 단어 음성 → 흐린 글자 위를 획 순서대로 따라 쓴다 */
  private async presentWriting(my: number): Promise<void> {
    const stage = this.stage!;
    const set = saves.data.settings;
    const pool = focusPool(stageWords(stage, set.pack, set.includeRecommended).map((w) => w.word), set.focusJamo, set.focusWords);
    const word = pickWriteWord(pool, this.lastWord, ENERGY_CONFIG.maxStrokes, Math.random);
    const entry = word ? vocabById(word) : undefined;
    const syllables = entry ? splitWord(entry.word) : null;
    const color = WORD_COLORS[(this.wordIndex + 1) % WORD_COLORS.length];
    this.setWriting(true);
    if (!entry || !syllables || !this.writepad.setup(syllables, color)) {
      // 쓸 수 있는 단어가 없으면(어휘상 생기지 않아야 한다) 에너지를 비우고 보통 단어로
      saves.data.energy = 0;
      saves.save();
      this.renderEnergy();
      return this.presentWord(my, false);
    }
    this.wordIndex++;
    this.lastWord = entry.word;
    this.current = null;
    this.writeRun = { entry, syllables, color, syllableSaid: null };
    // 조립판은 비워 둔다 (가려져 있는 동안 떠다니는 자모를 움직이지 않게)
    this.cockpit.setup({ frames: [], ghost: [], sequential: true, supply: [[]], motion: false });
    this.cockpit.lock();
    const gauge = document.getElementById('combo-gauge')!;
    gauge.classList.remove('live');
    (gauge.querySelector('.fill') as HTMLElement).style.width = '0%';
    this.showPicture(entry);
    this.phase = 'intro';
    this.scene.setCharge(0, color);
    const line = this.specialCue === 'weak' ? 'd_weak' : this.theme.lines.special;
    this.specialCue = 'energy';
    // 순서: 대사 → 대사 끝 → 단어 음성 → 쓰기 시작 (둘을 겹치지 않는다)
    await Promise.race([audio.playDialogue(line, { force: true }), this.scene.wait(4000)]);
    if (my !== this.run) return;
    await this.whenResumed();
    if (my !== this.run) return;
    const said = await audio.playWord(entry.wordAudioId);
    if (my !== this.run || this.writeRun?.entry !== entry) return;
    document.getElementById('btn-listen')!.classList.toggle('nudge', !said.ok && !audio.muted);
    this.phase = 'write';
    this.writepad.unlock();
    void this.writepad.showDemo();
    this.resetIdle();
  }

  /** 다 쓰면: 쓴 글자가 크게 떠올라 로봇에게 모이고 → 최고 필살기 */
  private async finishWriting(my: number): Promise<void> {
    const w = this.writeRun;
    if (!w || this.phase !== 'write') return;
    this.phase = 'execute';
    this.writepad.lock();
    this.clearIdle();
    saves.data.energy = 0;
    saves.data.stats.finishers++;
    saves.save();
    this.renderEnergy();
    if (w.syllableSaid) await Promise.race([w.syllableSaid, this.scene.wait(1200)]);
    if (my !== this.run) return;
    // 단어를 읽은 뒤에 필살기 대사 (둘을 겹치지 않는다)
    await Promise.race([audio.playWord(w.entry.wordAudioId), this.scene.wait(1500)]);
    if (my !== this.run) return;
    // 쓴 글자가 크게 떠오르는 동안은 자막을 띄우지 않고, 발사할 때 필살기 대사
    await this.scene.specialCutIn(w.syllables, w.color);
    if (my !== this.run) return;
    void audio.playDialogue(this.theme.lines.ultimate, { force: true });
    this.writeRun = null;
    const hits = robotAttack(this.state, 'ultimate');
    const hp = waveHp(this.state);
    await this.scene.attack('ultimate', hits, hp.hp, hp.max);
    if (my !== this.run) return;
    await this.afterAttack(my, hits);
  }

  // ───────────── 조합 중 ─────────────

  /** 가만히 있으면: 도움 단계가 낮을 때 손가락 안내, 오래 막히면 로봇이 막아 주며 안심시킨다 */
  private resetIdle(): void {
    this.clearIdle();
    if (this.phase === 'write') {
      // 쓰는 중에 가만히 있으면 지금 획을 점이 다시 따라가 보여 준다
      if (!this.paused)
        this.idleTimers.push(
          setTimeout(() => {
            if (this.phase !== 'write' || this.paused) return;
            void this.writepad.showDemo();
            this.resetIdle();
          }, 6000 / options.speed),
        );
      return;
    }
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
    const entry = cur?.entry ?? this.writeRun?.entry;
    if (!entry || this.paused || (this.phase !== 'compose' && this.phase !== 'intro' && this.phase !== 'write')) return;
    // 따라 쓰기 단어는 조립 기록(도움 단계·부모 화면 분석)에 넣지 않는다
    if (count && cur) {
      wordStats(saves.data.stats, cur.entry.id).replays++;
      playlog.replay();
      saves.save();
    }
    this.clock.hold('replay');
    const r = await audio.playWord(entry.wordAudioId);
    document.getElementById('btn-listen')!.classList.toggle('nudge', !r.ok && !audio.muted);
    this.clock.release('replay');
    this.resetIdle();
  }

  /** 정답 자모 보기: 1번째 = 지금 음절의 흐린 자모, 2번째부터 = 다음 자모와 칸을 손가락으로 */
  help(): void {
    if (this.phase === 'write' && !this.paused) {
      sfx.play('tap');
      void this.writepad.showDemo();
      this.resetIdle();
      return;
    }
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
    const bonus = bonusTimeMs(cur.toPlace, cur.level, this.stage?.comboScale ?? 1);
    gauge.classList.toggle('live', this.combo > 0);
    const tick = () => {
      if (!this.clock.isRunning) return;
      // 잘못 넣은 자모 벌점도 게이지에 바로 보인다
      const left = Math.max(0, 1 - comboTimeMs(this.clock.elapsed(), this.cockpit.wrongPlaces) / bonus);
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
    const stage = this.stage!;
    const bonus = bonusTimeMs(cur.toPlace, cur.level, stage.comboScale ?? 1);
    const prevCombo = this.combo;
    // 콤보 = 정확성 + 유효 조작 시간: 함정을 넣었다 뺀 만큼 시간 벌점 (정답 처리는 그대로)
    this.combo = nextCombo(this.combo, comboTimeMs(elapsed, this.cockpit.wrongPlaces), bonus, cur.speedEligible);
    let tier = tierFor(this.combo);
    // 새 공격 소개: 이 전투의 첫 공격은 적어도 이 단계로 (예: 4단계 첫 공격 = 범위 공격)
    const unlockNow = this.attacks === 0 && !!stage.unlock && strongerTier(tier, stage.unlock) !== tier;
    if (unlockNow) tier = stage.unlock!;
    // 대장을 쓰러뜨리는 일격은 필살기로 (5단계). 최고 필살기(ultimate)는 직접 따라 쓸 때만 나간다.
    tier = planTier(this.state, tier);
    this.attacks++;
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
    const firstHit = this.attacks === 1;
    const line = unlockNow
      ? L.unlock
      : tier === 'finisher'
        ? L.finish
        : tier === 'missiles'
          ? this.combo === 4
            ? L.power
            : null
          : tier === 'rapid'
            ? this.combo === 2
              ? L.combo
              : null
            : firstHit
              ? L.ready
              : null;
    if (line) void audio.playDialogue(line, { force: true });
    const hits = robotAttack(this.state, tier);
    const hp = waveHp(this.state);
    await this.scene.attack(tier, hits, hp.hp, hp.max, this.combo);
    if (my !== this.run) return;
    this.gainEnergy(tier);
    await this.afterAttack(my, hits);
  }

  /** 공격 뒤: 쓰러진 적 → 다음 무리 / 승리, 아니면 적 차례 → 다음 단어 */
  private async afterAttack(my: number, hits: Hit[]): Promise<void> {
    const stage = this.stage!;
    this.defeatedCount += hits.filter((h) => h.defeated).length;
    this.renderFoeDots();

    if (!this.state.foes.length) {
      this.waveIndex++;
      if (this.waveIndex >= stage.waves.length) return this.victory(my);
      await this.scene.wait(300);
      if (my !== this.run) return;
      return this.nextWave(my, false);
    }
    const t = target(this.state);
    if (t) this.scene.setTarget(t.id);
    // 보스가 약해지면 에너지를 채워 준다: 마지막 일격은 직접 쓴 최고 필살기 (콤보가 낮은 아이도 한 번은 본다)
    if (weakForSpecial(this.state) && saves.data.energy < ENERGY_CONFIG.max) {
      const prev = saves.data.energy;
      saves.data.energy = ENERGY_CONFIG.max;
      saves.save();
      this.specialCue = 'weak';
      this.renderEnergy(prev);
      sfx.play('chime');
    }

    for (const ev of foeTurn(this.state)) {
      if (ev.type === 'foeCharge') {
        this.showCharging();
        // 강공격 직전 예고. 단어 음성과 겹치지 않게 끝날 때까지 기다린다.
        if (ev.heavy && ev.level >= 2) await Promise.race([audio.playDialogue('d_heavy', { force: true }), this.scene.wait(2500)]);
      } else if (ev.type === 'foeAttack') await this.scene.foeAttack(ev.id, ev.damage, ev.hpAfter, ev.heavy);
      else if (ev.type === 'reboot') {
        saves.data.stats.reboots++;
        saves.save();
        void audio.playDialogue(this.theme.lines.reboot, { force: true });
        await this.scene.reboot(ev.hpAfter);
      }
      if (my !== this.run) return;
    }
    this.showCharging();
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
    await this.scene.celebrate(stage.boss === 'final');
    if (my !== this.run) return;
    // 지역의 마지막 전투를 처음 깨면 새 지역 발견 장면 → 보호자 안내 → 승리 화면
    const region = regionEnd(stage);
    if (region && !saves.data.regionsSeen.includes(region.id)) {
      saves.data.regionsSeen.push(region.id);
      saves.save();
      this.screens.regionFound(stage, region);
    } else this.screens.victory(stage);
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
