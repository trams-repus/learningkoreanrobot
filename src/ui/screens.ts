// 게임 밖 화면: 시작, 전투 고르기, 승리, 일시정지, 부모 화면.
// 아이 화면은 글 대신 큰 그림 버튼. 부모 화면은 길게 눌러야 열린다.
import { AUDIO_MANIFEST, DIALOGUE, WORD_AUDIO_SOURCES } from '../content/audio';
import { THEMES, type CharacterTheme } from '../content/characters';
import { REGIONS, STAGES, type RegionDef, type StageDef } from '../content/stages';
import { packWords, VOCAB } from '../content/vocab';
import { defaultSettings } from '../core/progress';
import type { Game } from '../game/game';
import { applySettings, audio, options, playlog, recordings, saves, sfx } from '../game/services';
import { analyze, MIN_WORDS_FOR_ANALYSIS } from '../core/analysis';
import { recordClip } from '../services/recordings';
import { ICONS } from './icons';
import { regionArt } from './regionArt';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export class Screens {
  private overlay = document.getElementById('overlay')!;

  constructor(private game: Game) {}

  close(): void {
    this.overlay.hidden = true;
    this.overlay.className = '';
    this.overlay.innerHTML = '';
  }

  private open(html: string, clear = false): HTMLElement {
    this.overlay.hidden = false;
    this.overlay.className = clear ? 'clear' : '';
    this.overlay.innerHTML = html;
    return this.overlay;
  }

  private unlockAudio(): void {
    sfx.unlock();
    audio.unlock();
  }

  // ───────────── 시작 ─────────────

  /**
   * 첫 화면: 함께 싸울 캐릭터 고르기 (로봇 / 마법소녀). 카드 전체가 버튼이고,
   * 고르면 그 캐릭터가 짧게 움직이며 안내 대사를 말한다. 글을 못 읽어도 그림과 소리로 고를 수 있다.
   */
  title(): void {
    const noVoice = audio.ttsChecked && audio.methodFor('w_수박') === 'none';
    const chosen = saves.data.settings.characterTheme;
    const card = (t: CharacterTheme) => {
      const th = THEMES[t];
      return `<button class="hero-card ${t === 'robot' ? 'robot' : 'magic'} ${chosen === t ? 'selected' : ''}" data-theme="${t}" aria-label="${th.name}" aria-pressed="${chosen === t}">
        <span class="hero-art">${t === 'robot' ? ICONS.robotHero : ICONS.magicHero}</span>
        <span class="hero-name">${th.name}</span>
      </button>`;
    };
    const el = this.open(
      `<div class="title-screen">
        <div class="logo">인우와 한글로봇</div>
        <div class="pick-row">${card('robot')}${card('magicalGirl')}</div>
        <div class="title-bottom">
          <button class="big-btn start-btn" id="t-start" aria-label="출격" ${chosen ? '' : 'disabled'}>${ICONS.play}출격!</button>
          ${noVoice ? `<div class="note">이 기기에서 한국어 음성을 찾지 못했어요. 녹음 파일이 없는 단어는 소리가 나지 않아요.</div>` : ''}
        </div>
      </div>
      <div class="corner"><button class="icon-btn" id="t-map" aria-label="전투 고르기">${ICONS.star}</button>${this.parentButton()}</div>`,
      true,
    );
    const start = el.querySelector('#t-start') as HTMLButtonElement;
    el.querySelectorAll<HTMLButtonElement>('.hero-card').forEach((b) =>
      b.addEventListener('click', () => {
        this.unlockAudio();
        const t = b.dataset.theme as CharacterTheme;
        sfx.play(t === 'robot' ? 'deploy' : 'sparkle');
        el.querySelectorAll('.hero-card').forEach((c) => {
          c.classList.toggle('selected', c === b);
          c.setAttribute('aria-pressed', String(c === b));
          c.classList.remove('go');
        });
        void b.offsetWidth;
        b.classList.add('go');
        this.game.applyTheme(t);
        void this.game.pickDemo(t);
        void audio.playDialogue(THEMES[t].lines.pick, { force: true });
        start.disabled = false;
      }),
    );
    start.addEventListener('click', () => {
      if (!saves.data.settings.characterTheme) return;
      this.unlockAudio();
      sfx.play('tap');
      void this.game.startStage(this.game.nextStageId());
    });
    el.querySelector('#t-map')!.addEventListener('click', () => {
      this.unlockAudio();
      sfx.play('tap');
      this.map();
    });
    this.bindParentButton(el);
  }

  private parentButton(): string {
    return `<button class="icon-btn hold-btn" id="t-parent" aria-label="부모 화면 (길게 누르기)">${ICONS.parent}<span class="hold-fill"></span></button>`;
  }

  /** 부모 화면은 1.5초 길게 눌러야 열린다 (아이가 실수로 들어가지 않게) */
  private bindParentButton(root: HTMLElement): void {
    const btn = root.querySelector('#t-parent') as HTMLElement | null;
    if (!btn) return;
    const fill = btn.querySelector('.hold-fill') as HTMLElement;
    let t: ReturnType<typeof setTimeout> | null = null;
    const cancel = () => {
      if (t) clearTimeout(t);
      t = null;
      fill.style.transition = 'height 0.15s';
      fill.style.height = '0%';
    };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.unlockAudio();
      fill.style.transition = 'height 1.5s linear';
      fill.style.height = '100%';
      t = setTimeout(() => {
        t = null;
        this.parent();
      }, options.dev ? 200 : 1500);
    });
    btn.addEventListener('pointerup', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('pointercancel', cancel);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // ───────────── 전투 고르기 ─────────────

  map(): void {
    const unlocked = new Set(this.game.unlockedStages);
    const cleared = new Set(saves.data.cleared);
    const next = this.game.nextStageId();
    const node = (s: StageDef, first: boolean) => {
      const locked = !unlocked.has(s.id);
      const cls = ['node', s.boss ? 'boss' : '', locked ? 'locked' : '', s.id === next && !locked ? 'next' : ''].join(' ');
      const link = first ? '' : '<span class="path-link"></span>';
      return `${link}<div class="node-wrap"><button class="${cls}" data-stage="${s.id}" aria-label="${esc(`${s.num}단계 ${s.name} (${s.focus})`)}" ${locked ? 'disabled' : ''}>
        ${ICONS[s.icon]}${cleared.has(s.id) ? `<span class="badge">${ICONS.star}</span>` : ''}${locked ? `<span class="lockmark">${ICONS.lock}</span>` : ''}
      </button><span class="node-cap" aria-hidden="true">${s.num}. ${esc(s.focus)}</span></div>`;
    };
    // 지역별로 묶는다: 공룡 들판(1~10) → 화산섬(11~). 지역 이름 옆 i는 보호자 안내.
    const regions = REGIONS.map((r) => {
      const list = STAGES.filter((s) => s.region === r.id);
      if (!list.length) return '';
      const open = list.some((s) => unlocked.has(s.id));
      return `<section class="region ${open ? '' : 'locked'}" data-region="${r.id}">
        <div class="region-head"><span>${esc(r.name)}</span>${r.id !== 'r1' ? `<button class="region-info-btn" data-info="${r.id}" aria-label="${esc(r.name)} 보호자 안내">i</button>` : ''}</div>
        <div class="map">${list.map((s, i) => node(s, i === 0)).join('')}</div></section>`;
    }).join('');
    const el = this.open(
      `<div class="panel map-panel">${regions}
        <div class="row"><button class="big-btn secondary" id="m-home" aria-label="처음으로">${ICONS.home}</button></div></div>
       <div class="corner">${this.parentButton()}</div>`,
    );
    el.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach((b) =>
      b.addEventListener('click', () => {
        sfx.play('tap');
        void this.game.startStage(b.dataset.stage!);
      }),
    );
    el.querySelectorAll<HTMLButtonElement>('[data-info]').forEach((b) =>
      b.addEventListener('click', () => {
        sfx.play('tap');
        this.regionInfo(null, REGIONS.find((r) => r.id === b.dataset.info)!);
      }),
    );
    el.querySelector('#m-home')!.addEventListener('click', () => {
      sfx.play('tap');
      this.title();
    });
    this.bindParentButton(el);
    el.querySelector('.node.next')?.scrollIntoView({ block: 'center' });
  }

  // ───────────── 새 지역 발견 ─────────────

  /** 지역의 마지막 전투를 처음 깼을 때: 새 지역 발견 장면 → 보호자 안내 → 승리 화면 */
  regionFound(stage: StageDef, region: RegionDef): void {
    void audio.playDialogue('d_newregion', { force: true });
    sfx.play('victory');
    const el = this.open(
      `<div class="region-found" role="dialog" aria-label="${esc(`새 지역 발견: ${region.name}`)}">
        <div class="rf-art">${regionArt(region.id)}</div>
        <div class="rf-title">새 지역 발견!</div>
        <div class="rf-name">${esc(region.name)}</div>
        <button class="big-btn" id="rf-next" aria-label="계속">${ICONS.next}</button>
      </div>`,
    );
    el.querySelector('#rf-next')!.addEventListener('click', () => {
      sfx.play('tap');
      this.regionInfo(stage, region);
    });
  }

  /**
   * 보호자 안내: 사용자 지시("새 지역 발견 → 보호자 결제 화면")의 자리. 실제 결제는 넣지 않았다 (2026-09-28 결정).
   * 지금은 시험판이라 다음 지역도 그대로 열려 있다고 알린다.
   */
  regionInfo(stage: StageDef | null, region: RegionDef): void {
    const el = this.open(
      `<div class="panel region-info">
        <h2>보호자 안내</h2>
        <p><b>${esc(region.name)}</b> · ${esc(region.blurb)}</p>
        <p>여기부터는 보호자 결제 화면이 들어갈 자리입니다. 지금은 시험판이라 결제 기능이 없고, 다음 단계를 그대로 해 볼 수 있습니다.</p>
        <div class="row"><button class="big-btn" id="ri-ok">계속하기</button></div>
      </div>`,
    );
    el.querySelector('#ri-ok')!.addEventListener('click', () => {
      sfx.play('tap');
      if (stage) this.victory(stage);
      else this.map();
    });
  }

  // ───────────── 승리 ─────────────

  victory(stage: StageDef): void {
    const idx = STAGES.indexOf(stage);
    const hasNext = idx >= 0 && idx < STAGES.length - 1;
    const el = this.open(
      `<div class="panel victory">
        <div class="stars"><span>${ICONS.star}</span><span>${ICONS.star}</span><span>${ICONS.star}</span></div>
        <div class="logo" style="font-size:40px;margin:0 0 14px">기지를 지켰어!</div>
        <div class="row">
          <button class="big-btn secondary" id="v-home" aria-label="처음으로">${ICONS.home}</button>
          <button class="big-btn secondary" id="v-retry" aria-label="다시 하기">${ICONS.retry}</button>
          ${hasNext ? `<button class="big-btn" id="v-next" aria-label="다음 전투">${ICONS.next}</button>` : ''}
        </div>
      </div>`,
    );
    el.querySelector('#v-home')!.addEventListener('click', () => {
      sfx.play('tap');
      this.game.toMenu();
      this.title();
    });
    el.querySelector('#v-retry')!.addEventListener('click', () => {
      sfx.play('tap');
      void this.game.startStage(stage.id);
    });
    el.querySelector('#v-next')?.addEventListener('click', () => {
      sfx.play('tap');
      void this.game.startStage(STAGES[idx + 1].id);
    });
  }

  // ───────────── 일시정지 ─────────────

  pause(): void {
    const s = saves.data.settings;
    const el = this.open(
      `<div class="panel pause-panel">
        <button class="big-btn start-btn" id="p-resume" aria-label="계속하기">${ICONS.play}</button>
        <div class="toggle-row">
          <button class="toggle ${s.muted ? 'off' : ''}" id="p-sound" aria-label="소리">${s.muted ? ICONS.mute : ICONS.speaker}</button>
          <button class="toggle ${s.jamoMotion ? '' : 'off'}" id="p-motion" aria-label="자모 움직임">${ICONS.jamo}</button>
        </div>
        <button class="big-btn secondary" id="p-home" aria-label="처음으로">${ICONS.home}</button>
      </div>`,
    );
    el.querySelector('#p-resume')!.addEventListener('click', () => {
      this.unlockAudio();
      sfx.resume();
      sfx.play('tap');
      this.game.resume();
    });
    el.querySelector('#p-home')!.addEventListener('click', () => {
      this.game.toMenu();
      this.title();
    });
    el.querySelector('#p-sound')!.addEventListener('click', (e) => {
      s.muted = !s.muted;
      saves.save();
      applySettings();
      const b = e.currentTarget as HTMLElement;
      b.classList.toggle('off', s.muted);
      b.innerHTML = s.muted ? ICONS.mute : ICONS.speaker;
    });
    el.querySelector('#p-motion')!.addEventListener('click', (e) => {
      s.jamoMotion = !s.jamoMotion;
      saves.save();
      this.game.setMotion(s.jamoMotion);
      (e.currentTarget as HTMLElement).classList.toggle('off', !s.jamoMotion);
    });
  }

  // ───────────── 부모 화면 ─────────────

  parent(tab: 'analysis' | 'record' | 'settings' | 'sound' | 'voice' = 'analysis'): void {
    const wasBattle = this.game.inBattle;
    if (wasBattle) this.game.pause(false);
    const tabs: [typeof tab, string][] = [
      ['analysis', '분석'],
      ['record', '단어 기록'],
      ['settings', '설정'],
      ['sound', '소리 확인'],
      ['voice', '목소리 녹음'],
    ];
    const body = tab === 'analysis' ? this.analysisHtml() : tab === 'record' ? this.recordHtml() : tab === 'settings' ? this.settingsHtml() : tab === 'sound' ? this.soundHtml() : this.voiceHtml();
    const el = this.open(
      `<div class="parent">
        <div class="parent-top">
          <h2>부모 화면</h2>
          <button class="small-btn primary" id="pa-close">닫기</button>
        </div>
        <nav class="parent-tabs">${tabs.map(([k, n]) => `<button class="small-btn ${k === tab ? 'primary' : ''}" data-tab="${k}" aria-pressed="${k === tab}">${n}</button>`).join('')}</nav>
        <div class="parent-body">${body}</div>
      </div>`,
    );
    this.overlay.classList.add('parent-open');
    el.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => this.parent(b.dataset.tab as typeof tab)));
    el.querySelector('#pa-close')!.addEventListener('click', () => {
      audio.stop();
      if (this.game.inBattle) this.pause();
      else this.title();
    });
    if (tab === 'settings') this.bindSettings(el);
    if (tab === 'sound') this.bindSound(el);
    if (tab === 'voice') this.bindVoice(el);
    if (tab === 'record') this.bindRecord(el);
    if (tab === 'analysis') this.bindAnalysis(el);
  }

  private analysisHtml(): string {
    const a = analyze(playlog.events);
    const set = saves.data.settings;
    const pct = (x: number, of: number) => (of ? Math.round((x / of) * 100) : 0);
    const focusOn = set.focusJamo.length || set.focusWords.length;
    const focus = focusOn
      ? `<div class="focus-now"><p><b>지금 더 자주 내는 중:</b> ${esc([set.focusJamo.length ? `${set.focusJamo.join('·')} 자모가 든 단어` : '', ...set.focusWords].filter(Boolean).join(', '))}</p>
          <button class="small-btn" id="an-focus-off">원래대로 섞기</button></div>`
      : '';
    const head = `
      <p class="muted">이 기기 안의 플레이 기록만 세어서 보여 줍니다. 밖으로 보내지 않고, 점수나 등급을 매기지 않습니다. 아래 제안은 기록에서 보이는 것을 바탕으로 한 참고이며, 학습 효과가 검증된 진단이 아닙니다.</p>
      ${focus}
      <div class="stat-grid">
        <div><b>${a.daysPlayed7}일</b><span>최근 7일 중 플레이한 날</span></div>
        <div><b>${a.words7}개</b><span>최근 7일 완성한 단어</span></div>
        <div><b>${a.alone}개</b><span>혼자 완성 (전체 ${a.finished}개 중 ${pct(a.alone, a.finished)}%)</span></div>
        <div><b>${a.help}개</b><span>도움 받고 완성</span></div>
      </div>`;
    if (!a.enough) return `${head}<p class="big-note">기록이 조금 더 쌓이면(단어 ${MIN_WORDS_FOR_ANALYSIS}개 이상 완성) 약점과 제안을 보여 드려요. 지금 ${a.finished}개.</p>`;

    const sugg = a.suggestions.length
      ? a.suggestions
          .map(
            (g, i) => `<section class="sugg">
              <h3>${esc(g.seen)}</h3>
              <p class="evidence">근거: ${esc(g.evidence)}</p>
              <p>${esc(g.tryThis)}</p>
              ${g.focusJamo || g.focusWords ? `<button class="small-btn primary" data-focus="${i}">이 단어들 더 자주 내기</button>` : ''}
            </section>`,
          )
          .join('')
      : '<p class="big-note">지금 기록에서는 눈에 띄게 반복되는 실수가 없어요.</p>';

    const good: string[] = [];
    if (a.trend) good.push(`혼자 완성한 단어: 처음 ${a.trend.window}개 중 ${a.trend.before}개 → 최근 ${a.trend.window}개 중 ${a.trend.after}개`);
    if (a.improved.length) good.push(`처음엔 도움을 받았지만 최근 두 번은 혼자 끝낸 단어: ${a.improved.slice(0, 6).join(', ')}`);

    const roleName = { cho: '첫소리', jung: '모음', jong: '받침' } as const;
    const roleRows = (['cho', 'jung', 'jong'] as const)
      .map((r) => `<tr><td>${roleName[r]}</td><td>${a.roleMiss[r].slots}칸</td><td>${a.roleMiss[r].miss}번</td></tr>`)
      .join('');
    const conf = a.confusions.length
      ? `<table><thead><tr><th>헷갈린 두 자모</th><th>횟수</th><th>나온 단어</th></tr></thead><tbody>${a.confusions
          .slice(0, 8)
          .map((c) => `<tr><td class="jamo">${c.pair[0]} · ${c.pair[1]}</td><td>${c.total}번</td><td>${esc(c.words.slice(0, 4).join(', '))}</td></tr>`)
          .join('')}</tbody></table>`
      : '<p class="muted">두 번 이상 바꿔 넣은 자모 쌍은 아직 없어요.</p>';
    const time = (t: number) => new Date(t).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    const misses = a.recentMisses.length
      ? `<table><thead><tr><th>언제</th><th>단어</th><th>맞는 자모 → 넣은 자모</th></tr></thead><tbody>${a.recentMisses
          .map((m) => `<tr><td>${time(m.t)}</td><td>${esc(m.word)} (${esc(m.syl)})</td><td class="jamo">${esc(m.want)} → ${esc(m.got ?? '?')}</td></tr>`)
          .join('')}</tbody></table>`
      : '<p class="muted">아직 틀린 기록이 없어요.</p>';

    return `${head}
      <h3 class="sec">해 볼 만한 것</h3>
      ${sugg}
      ${good.length ? `<h3 class="sec">늘어난 점</h3><ul>${good.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <h3 class="sec">오답 분석</h3>
      <h4>자주 바꿔 넣은 자모</h4>
      ${conf}
      <h4>칸 종류별로 틀린 횟수</h4>
      <table><thead><tr><th>칸</th><th>완성 단어의 칸 수</th><th>다른 글자</th></tr></thead><tbody>${roleRows}</tbody></table>
      <h4>최근 틀린 기록</h4>
      ${misses}
      ${a.stopped ? `<p class="muted">끝내지 못하고 나간 문제 ${a.stopped}개는 완성 수에 넣지 않았습니다.</p>` : ''}`;
  }

  private bindAnalysis(el: HTMLElement): void {
    const a = analyze(playlog.events);
    const set = saves.data.settings;
    el.querySelectorAll<HTMLButtonElement>('[data-focus]').forEach((b) =>
      b.addEventListener('click', () => {
        const g = a.suggestions[Number(b.dataset.focus)];
        if (!g) return;
        set.focusJamo = [...new Set([...set.focusJamo, ...(g.focusJamo ?? [])])].slice(0, 8);
        set.focusWords = [...new Set([...set.focusWords, ...(g.focusWords ?? [])])].slice(0, 8);
        saves.save();
        this.parent('analysis');
      }),
    );
    el.querySelector('#an-focus-off')?.addEventListener('click', () => {
      set.focusJamo = [];
      set.focusWords = [];
      saves.save();
      this.parent('analysis');
    });
  }

  private recordHtml(): string {
    const st = saves.data.stats;
    const rows = VOCAB.filter((v) => st.words[v.id])
      .map((v) => {
        const w = st.words[v.id];
        const best = w.bestIndependentMs ? `${(w.bestIndependentMs / 1000).toFixed(1)}초` : '-';
        return `<tr><td>${esc(v.word)}</td><td>${w.attempts}</td><td>${w.independent}</td><td>${w.assisted}</td><td>${w.replays}</td><td>${w.hintViews}</td><td>${w.wrongSyllables}</td><td>${best}</td></tr>`;
      })
      .join('');
    const stuck = Object.entries(st.stuckJamo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([j, n]) => `${esc(j)} ${n}회`)
      .join(', ');
    const played = Object.values(st.battlesPlayed).reduce((a, b) => a + b, 0);
    const won = Object.values(st.battlesWon).reduce((a, b) => a + b, 0);
    return `
      <p class="muted">이 기기 안에만 저장됩니다. 이름·생년월일은 저장하지 않습니다.${saves.available ? '' : ' <b>지금은 저장소를 쓸 수 없어 기록이 남지 않습니다.</b>'}${saves.recovered ? ' 이전 저장 데이터가 손상되어 새로 시작했습니다.' : ''}</p>
      <h3>전투</h3>
      <p>출동 ${played}회 · 승리 ${won}회 · 최고 콤보 ${st.bestCombo} · 마무리 일격 ${st.finishers}회 · 재가동 ${st.reboots}회</p>
      <h3>단어</h3>
      ${
        rows
          ? `<div class="table-wrap"><table><thead><tr><th>단어</th><th>출제</th><th>혼자</th><th>도움</th><th>다시 듣기</th><th>정답 보기</th><th>다른 글자</th><th>혼자 최고</th></tr></thead><tbody>${rows}</tbody></table></div>
             <p class="muted">'혼자'는 흐린 자모·손가락 안내·정답 보기 없이 완성한 횟수입니다. 다시 듣기는 도움으로 치지 않고 따로 셉니다.</p>`
          : '<p class="muted">아직 기록이 없습니다.</p>'
      }
      <h3>자주 헷갈린 자모</h3>
      <p>${stuck || '<span class="muted">없음</span>'}</p>
      <div class="btns"><button class="small-btn danger" id="pa-reset">진행 기록 지우기</button></div>`;
  }

  private bindRecord(el: HTMLElement): void {
    // 확인 창(confirm)은 막힌 환경이 있어, 같은 버튼을 한 번 더 눌러 확인한다
    const btn = el.querySelector('#pa-reset') as HTMLButtonElement;
    let armed = false;
    btn.addEventListener('click', () => {
      if (!armed) {
        armed = true;
        btn.textContent = '정말 지울까요? 한 번 더 누르세요 (설정·녹음은 남음)';
        setTimeout(() => {
          armed = false;
          if (btn.isConnected) btn.textContent = '진행 기록 지우기';
        }, 4000);
        return;
      }
      saves.reset();
      playlog.clear();
      this.parent('record');
    });
  }

  private settingsHtml(): string {
    const s = saves.data.settings;
    const chk = (id: string, on: boolean, label: string) => `<label>${label}<input type="checkbox" id="${id}" ${on ? 'checked' : ''}></label>`;
    return `
      <h3>함께 싸울 캐릭터</h3>
      <label>캐릭터<select id="se-theme"><option value="robot" ${s.characterTheme !== 'magicalGirl' ? 'selected' : ''}>로봇</option><option value="magicalGirl" ${s.characterTheme === 'magicalGirl' ? 'selected' : ''}>마법소녀</option></select></label>
      <p class="muted">바꿔도 단어 기록·해금·도움 단계는 그대로입니다. 전투 그림·효과·대사만 바뀝니다.</p>
      <h3>소리</h3>
      ${chk('se-muted', s.muted, '모든 소리 끄기')}
      <label>목소리 크기<input type="range" id="se-voice" min="0" max="1" step="0.1" value="${s.voiceVolume}"></label>
      <label>효과음 크기<input type="range" id="se-sfx" min="0" max="1" step="0.1" value="${s.sfxVolume}"></label>
      ${chk('se-wordrec', s.useWordRecordings, '단어를 사람 녹음으로 읽기 (끄면 기기 음성)')}
      <p class="muted">기본은 기기 음성입니다. 녹음이 있는 단어만 녹음으로 읽고, 녹음을 쓸 때는 녹음한 분 표시가 '소리 확인'에 나옵니다.</p>
      <h3>화면</h3>
      ${chk('se-motion', s.jamoMotion, '자모가 천천히 떠다니기')}
      ${chk('se-reduce', s.reduceEffects, '폭발·흔들림 효과 줄이기')}
      <h3>단어</h3>
      <label>어휘팩<select id="se-pack"><option value="4-6" ${s.pack === '4-6' ? 'selected' : ''}>4~6세 팩</option><option value="7-8" ${s.pack === '7-8' ? 'selected' : ''}>7~8세 팩</option></select></label>
      ${chk('se-rec', s.includeRecommended, '권장 단어도 섞기 (끄면 핵심 단어만)')}
      <p class="muted">어휘팩은 게임 내부의 임시 선정입니다. 공식 어휘 등급과 대조하기 전이며, 아이 나이에 따른 공식 기준이 아닙니다.</p>
      <h3>도움</h3>
      <label>도움 정도<select id="se-help"><option value="auto" ${s.helpMode === 'auto' ? 'selected' : ''}>자동 (플레이에 맞춰)</option><option value="more" ${s.helpMode === 'more' ? 'selected' : ''}>많이 (늘 부분 안내)</option></select></label>
      ${chk('se-autohelp', s.autoHelp, '막히면 선택지 줄이기·다음 자모 안내')}
      <div class="btns"><button class="small-btn" id="se-default">설정 기본값으로</button></div>`;
  }

  private bindSettings(el: HTMLElement): void {
    const s = saves.data.settings;
    const on = (id: string, fn: (t: HTMLInputElement & HTMLSelectElement) => void) =>
      el.querySelector(`#${id}`)!.addEventListener('change', (e) => {
        fn(e.target as HTMLInputElement & HTMLSelectElement);
        saves.save();
        applySettings();
      });
    on('se-muted', (t) => (s.muted = t.checked));
    on('se-theme', (t) => this.game.applyTheme(t.value === 'magicalGirl' ? 'magicalGirl' : 'robot'));
    on('se-voice', (t) => (s.voiceVolume = Number(t.value)));
    on('se-sfx', (t) => {
      s.sfxVolume = Number(t.value);
      applySettings();
      sfx.play('tap');
    });
    on('se-motion', (t) => {
      s.jamoMotion = t.checked;
      this.game.setMotion(t.checked);
    });
    on('se-reduce', (t) => {
      s.reduceEffects = t.checked;
      document.body.classList.toggle('reduce-motion', t.checked);
      this.game.setReduceEffects(t.checked);
    });
    on('se-pack', (t) => (s.pack = t.value === '7-8' ? '7-8' : '4-6'));
    on('se-rec', (t) => (s.includeRecommended = t.checked));
    on('se-help', (t) => (s.helpMode = t.value === 'more' ? 'more' : 'auto'));
    on('se-autohelp', (t) => (s.autoHelp = t.checked));
    on('se-wordrec', (t) => (s.useWordRecordings = t.checked));
    el.querySelector('#se-default')!.addEventListener('click', () => {
      const theme = saves.data.settings.characterTheme;
      saves.data.settings = defaultSettings();
      saves.save();
      applySettings();
      // 캐릭터 선택은 설정 초기화와 무관하게 유지한다
      saves.data.settings.characterTheme = theme;
      saves.save();
      document.body.classList.toggle('reduce-motion', false);
      this.game.setReduceEffects(false);
      this.game.setMotion(true);
      this.parent('settings');
    });
  }

  private methodName(id: string): string {
    const m = audio.methodFor(id);
    if (m === 'recording') return '부모 녹음';
    if (m === 'file') return '녹음 파일 (Lingua Libre·Commons)';
    if (m === 'tts') return `기기 음성 합성 (${esc(audio.ttsVoice?.name ?? '')}${audio.ttsVoice?.localService ? ', 기기 내장' : ', 온라인일 수 있음'})`;
    return '재생 수단 없음';
  }

  private soundHtml(): string {
    return `
      <p class="muted">아래 버튼을 눌러 이 기기에서 실제로 소리가 나는지 확인하세요. 소리가 안 나면 기기 무음 스위치·미디어 볼륨을 확인하고, 그래도 안 되면 '목소리 녹음'에서 직접 녹음하면 됩니다.</p>
      <table>
        <tr><th>소리</th><th>지금 쓰는 방법</th><th></th></tr>
        <tr><td>단어 '수박'</td><td>${this.methodName('w_수박')}</td><td><button class="small-btn" id="so-word">듣기</button></td></tr>
        <tr><td>대사 '${esc(DIALOGUE[this.game.theme.lines.hurry])}'</td><td>${this.methodName(this.game.theme.lines.hurry)}</td><td><button class="small-btn" id="so-dia">듣기</button></td></tr>
        <tr><td>발사 효과음</td><td>기기에서 합성 (WebAudio)</td><td><button class="small-btn" id="so-fire">듣기</button></td></tr>
      </table>
      <p id="so-result" class="muted" aria-live="polite"></p>
      <h3>단어 녹음 파일 (${WORD_AUDIO_SOURCES.length}개 목록)</h3>
      <p class="muted">${saves.data.settings.useWordRecordings ? '지금 단어를 녹음으로 읽습니다 (녹음이 없는 단어는 기기 음성).' : "지금은 꺼져 있어 모든 단어를 기기 음성으로 읽습니다. '설정 → 소리'에서 켤 수 있습니다."}</p>
      <table>
        <tr><th>단어</th><th>파일</th><th>녹음한 분 · 라이선스</th><th>이 기기 재생 결과</th><th></th></tr>
        ${WORD_AUDIO_SOURCES.map((w) => {
          const id = `w_${w.word}`;
          const has = AUDIO_MANIFEST.find((a) => a.assetId === id)?.localPath;
          const credit = has && w.speaker ? `${w.speaker} · ${w.license || '확인 전'}` : '-';
          return `<tr><td>${esc(w.word)}</td><td>${has ? '있음' : w.link.startsWith('없음') ? 'Commons에 녹음 없음 (기기 음성)' : '아직 없음 (기기 음성으로 대신)'}</td><td>${esc(credit)}</td><td>${esc(audio.fileStatus.get(id) ?? '-')}</td><td><button class="small-btn" data-word="${esc(id)}">듣기</button></td></tr>`;
        }).join('')}
      </table>
      <p class="muted">녹음: Lingua Libre (Wikimedia Commons). 녹음한 분과 라이선스는 위 표에 단어마다 적었습니다 (CC BY-SA 녹음은 출처 표시가 필요합니다). 로봇과 마법소녀가 같은 녹음을 씁니다.</p>
      <p class="muted">한국어 음성: ${audio.ttsVoice ? esc(`${audio.ttsVoice.name} (${audio.ttsVoice.lang})`) : '찾지 못함'} · 녹음 ${recordings.count}개${saves.data.settings.muted ? ' · <b>지금 소리 끄기가 켜져 있습니다</b>' : ''}</p>`;
  }

  private bindSound(el: HTMLElement): void {
    const out = el.querySelector('#so-result')!;
    const report = (label: string, r: { ok: boolean; method: string }) => {
      out.textContent = r.ok ? `${label}: 재생이 끝났다는 신호를 받았습니다. 실제로 들렸는지 귀로 확인해 주세요.` : `${label}: 재생하지 못했습니다 (방법: ${r.method === 'none' ? '없음' : r.method}).`;
    };
    el.querySelector('#so-word')!.addEventListener('click', async () => {
      out.textContent = '재생 중…';
      report("단어 '수박'", await audio.playWord('w_수박'));
    });
    el.querySelector('#so-dia')!.addEventListener('click', async () => {
      out.textContent = '재생 중…';
      report('대사', await audio.playDialogue(this.game.theme.lines.hurry, { force: true }));
    });
    el.querySelectorAll<HTMLButtonElement>('[data-word]').forEach((b) =>
      b.addEventListener('click', async () => {
        sfx.unlock();
        out.textContent = '재생 중…';
        const id = b.dataset.word!;
        const r = await audio.previewWordFile(id);
        report(id.slice(2), r);
        const cell = b.closest('tr')?.children[3];
        if (cell) cell.textContent = audio.fileStatus.get(id) ?? (r.ok ? `재생 완료 (${r.method})` : '재생 못 함');
      }),
    );
    el.querySelector('#so-fire')!.addEventListener('click', () => {
      sfx.unlock();
      sfx.play(this.game.theme.id === 'robot' ? 'cannon' : 'magicShot');
      out.textContent = '발사 효과음을 재생했습니다.';
    });
  }

  private voiceHtml(): string {
    if (!recordings.available || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      return '<p class="muted">이 브라우저에서는 녹음을 쓸 수 없습니다.</p>';
    }
    const s = saves.data.settings;
    const words = packWords(s.pack, true);
    const wordRows = words.map((v) => this.voiceRow(v.wordAudioId, v.word)).join('');
    const dRows = Object.keys(DIALOGUE)
      .map((id) => this.voiceRow(id, AUDIO_MANIFEST.find((a) => a.assetId === id)?.text ?? id))
      .join('');
    return `
      <p class="muted">부모님 목소리로 녹음하면 기기 음성 대신 그 녹음을 들려줍니다. 녹음은 이 기기(브라우저 저장소) 안에만 저장되고 밖으로 보내지 않습니다. 한 번에 최대 3초.</p>
      <h3>단어 (${esc(s.pack)}세 팩)</h3><table>${wordRows}</table>
      <h3>대사</h3><table>${dRows}</table>
      <p id="vo-status" class="muted" aria-live="polite"></p>`;
  }

  private voiceRow(id: string, text: string): string {
    const has = recordings.has(id);
    return `<tr><td>${esc(text)}</td><td style="white-space:nowrap">
      <button class="small-btn" data-rec="${esc(id)}">녹음</button>
      ${has ? `<button class="small-btn" data-play="${esc(id)}">듣기</button><button class="small-btn danger" data-del="${esc(id)}">지우기</button>` : ''}
    </td></tr>`;
  }

  private bindVoice(el: HTMLElement): void {
    const status = el.querySelector('#vo-status');
    el.querySelectorAll<HTMLButtonElement>('[data-rec]').forEach((b) =>
      b.addEventListener('click', async () => {
        const id = b.dataset.rec!;
        try {
          audio.stop();
          b.disabled = true;
          const blob = await recordClip(3000, () => {
            b.textContent = '녹음 중…';
          });
          await recordings.save(id, blob);
          this.parent('voice');
        } catch (e) {
          b.disabled = false;
          b.textContent = '녹음';
          if (status) status.textContent = `녹음하지 못했습니다: ${e instanceof Error ? e.message : String(e)} (마이크 권한을 확인해 주세요)`;
        }
      }),
    );
    el.querySelectorAll<HTMLButtonElement>('[data-play]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.dataset.play!;
        void (id.startsWith('w_') ? audio.playWord(id) : audio.playDialogue(id, { force: true }));
      }),
    );
    el.querySelectorAll<HTMLButtonElement>('[data-del]').forEach((b) =>
      b.addEventListener('click', async () => {
        await recordings.remove(b.dataset.del!);
        this.parent('voice');
      }),
    );
  }
}
