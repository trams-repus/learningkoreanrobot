// 게임 밖 화면: 시작, 전투 고르기, 승리, 일시정지, 부모 화면.
// 아이 화면은 글 대신 큰 그림 버튼. 부모 화면은 길게 눌러야 열린다.
import { AUDIO_MANIFEST, DIALOGUE } from '../content/audio';
import { STAGES, type StageDef } from '../content/stages';
import { packWords, VOCAB } from '../content/vocab';
import { defaultSettings } from '../core/progress';
import type { Game } from '../game/game';
import { applySettings, audio, options, recordings, saves, sfx } from '../game/services';
import { recordClip } from '../services/recordings';
import { ICONS } from './icons';

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

  title(): void {
    const noVoice = audio.ttsChecked && audio.methodFor('w_수박') === 'none';
    const el = this.open(
      `<div class="title-screen">
        <div class="logo">인우와<br>한글로봇<small>암호를 조립해 로봇을 움직여!</small></div>
        <div class="title-bottom">
          <button class="big-btn start-btn" id="t-start" aria-label="출동">${ICONS.play}출동!</button>
          <button class="big-btn secondary" id="t-map" aria-label="전투 고르기">${ICONS.robot}</button>
          ${noVoice ? `<div class="note">이 기기에서 한국어 음성을 찾지 못했어요. 부모 화면에서 목소리를 녹음하면 들려줄 수 있어요.</div>` : ''}
        </div>
      </div>
      <div class="corner">${this.parentButton()}</div>`,
      true,
    );
    el.querySelector('#t-start')!.addEventListener('click', () => {
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
    const nodes = STAGES.map((s, i) => {
      const locked = !unlocked.has(s.id);
      const cls = ['node', s.boss ? 'boss' : '', locked ? 'locked' : '', s.id === next && !locked ? 'next' : ''].join(' ');
      const link = i > 0 ? '<span class="path-link"></span>' : '';
      return `${link}<button class="${cls}" data-stage="${s.id}" aria-label="${esc(s.name)}" ${locked ? 'disabled' : ''}>
        ${ICONS[s.icon]}${cleared.has(s.id) ? `<span class="badge">${ICONS.star}</span>` : ''}${locked ? `<span class="lockmark">${ICONS.lock}</span>` : ''}
      </button>`;
    }).join('');
    const el = this.open(
      `<div class="panel"><div class="map">${nodes}</div>
        <div class="row"><button class="big-btn secondary" id="m-home" aria-label="처음으로">${ICONS.home}</button></div></div>
       <div class="corner">${this.parentButton()}</div>`,
    );
    el.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach((b) =>
      b.addEventListener('click', () => {
        sfx.play('tap');
        void this.game.startStage(b.dataset.stage!);
      }),
    );
    el.querySelector('#m-home')!.addEventListener('click', () => {
      sfx.play('tap');
      this.title();
    });
    this.bindParentButton(el);
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

  parent(tab: 'record' | 'settings' | 'sound' | 'voice' = 'record'): void {
    const wasBattle = this.game.inBattle;
    if (wasBattle) this.game.pause(false);
    const tabs: [typeof tab, string][] = [
      ['record', '기록'],
      ['settings', '설정'],
      ['sound', '소리 확인'],
      ['voice', '목소리 녹음'],
    ];
    const body = tab === 'record' ? this.recordHtml() : tab === 'settings' ? this.settingsHtml() : tab === 'sound' ? this.soundHtml() : this.voiceHtml();
    const el = this.open(
      `<div class="panel parent">
        <h2>부모 화면</h2>
        <div class="btns">${tabs.map(([k, n]) => `<button class="small-btn ${k === tab ? 'primary' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
        ${body}
        <div class="btns" style="margin-top:18px"><button class="small-btn primary" id="pa-close">닫기</button></div>
      </div>`,
    );
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
          ? `<table><thead><tr><th>단어</th><th>출제</th><th>혼자</th><th>도움</th><th>다시 듣기</th><th>정답 보기</th><th>다른 글자</th><th>혼자 최고</th></tr></thead><tbody>${rows}</tbody></table>
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
      this.parent('record');
    });
  }

  private settingsHtml(): string {
    const s = saves.data.settings;
    const chk = (id: string, on: boolean, label: string) => `<label>${label}<input type="checkbox" id="${id}" ${on ? 'checked' : ''}></label>`;
    return `
      <h3>소리</h3>
      ${chk('se-muted', s.muted, '모든 소리 끄기')}
      <label>목소리 크기<input type="range" id="se-voice" min="0" max="1" step="0.1" value="${s.voiceVolume}"></label>
      <label>효과음 크기<input type="range" id="se-sfx" min="0" max="1" step="0.1" value="${s.sfxVolume}"></label>
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
    el.querySelector('#se-default')!.addEventListener('click', () => {
      saves.data.settings = defaultSettings();
      saves.save();
      applySettings();
      document.body.classList.toggle('reduce-motion', false);
      this.game.setReduceEffects(false);
      this.game.setMotion(true);
      this.parent('settings');
    });
  }

  private methodName(id: string): string {
    const m = audio.methodFor(id);
    if (m === 'recording') return '부모 녹음';
    if (m === 'file') return '음원 파일';
    if (m === 'tts') return `기기 음성 합성 (${esc(audio.ttsVoice?.name ?? '')}${audio.ttsVoice?.localService ? ', 기기 내장' : ', 온라인일 수 있음'})`;
    return '재생 수단 없음';
  }

  private soundHtml(): string {
    return `
      <p class="muted">아래 버튼을 눌러 이 기기에서 실제로 소리가 나는지 확인하세요. 소리가 안 나면 기기 무음 스위치·미디어 볼륨을 확인하고, 그래도 안 되면 '목소리 녹음'에서 직접 녹음하면 됩니다.</p>
      <table>
        <tr><th>소리</th><th>지금 쓰는 방법</th><th></th></tr>
        <tr><td>단어 '수박'</td><td>${this.methodName('w_수박')}</td><td><button class="small-btn" id="so-word">듣기</button></td></tr>
        <tr><td>대사 '대장! 빨리 조합해 줘!'</td><td>${this.methodName('d_hurry')}</td><td><button class="small-btn" id="so-dia">듣기</button></td></tr>
        <tr><td>발사 효과음</td><td>기기에서 합성 (WebAudio)</td><td><button class="small-btn" id="so-fire">듣기</button></td></tr>
      </table>
      <p id="so-result" class="muted" aria-live="polite"></p>
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
      report('대사', await audio.playDialogue('d_hurry', { force: true }));
    });
    el.querySelector('#so-fire')!.addEventListener('click', () => {
      sfx.unlock();
      sfx.play('cannon');
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
