// 시작점: 서비스 준비 → Phaser 전투 장면 → 화면 배치 → 시작 화면.
import './native/tts-shim';
import Phaser from 'phaser';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import './styles.css';
import { Game } from './game/game';
import { applySettings, audio, options, purchases, recordings, RELEASE, saves, sfx } from './game/services';
import { BattleScene } from './scene/BattleScene';

// 해상도 배율은 2까지만 쓴다. 390 휴대폰(배율 3)에서 캔버스가 1170x2532가 되어 그리기가 약 1.7배 느려졌다
// (390 멈춤 조사, 2026-09-28). 배율 2와 3은 이 그림체에서 눈으로 거의 구분되지 않는다.
const dpr = () => Math.min(2, Math.max(1, window.devicePixelRatio || 1));

async function boot(): Promise<void> {
  applySettings();
  document.body.classList.toggle('reduce-motion', saves.data.settings.reduceEffects);

  const scene = new BattleScene();
  scene.reduceEffects = saves.data.settings.reduceEffects;
  let d = dpr();
  // 선명한 그림을 위해 캔버스는 실제 픽셀 크기로 만들고, CSS 크기는 zoom으로 맞춘다
  const phaser = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    transparent: true,
    width: Math.round(window.innerWidth * d),
    height: Math.round(window.innerHeight * d),
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / d },
    render: { antialias: true, roundPixels: false },
    audio: { noAudio: true },
    input: { mouse: false, touch: false, keyboard: false, gamepad: false },
    banner: false,
    scene: [scene],
  });

  await Promise.all([
    scene.ready,
    document.fonts?.load('900 20px HDFont').catch(() => undefined),
    document.fonts?.load('700 16px HDFont').catch(() => undefined),
    recordings.load(),
    Promise.race([audio.init(), new Promise((r) => setTimeout(r, 3000))]),
  ]);

  const battleEl = document.getElementById('battle')!;
  const hud = document.getElementById('hud')!;
  const layout = () => {
    d = dpr();
    const w = Math.round(window.innerWidth * d);
    const h = Math.round(window.innerHeight * d);
    if (phaser.scale.width !== w || phaser.scale.height !== h) phaser.scale.resize(w, h);
    phaser.scale.setZoom(1 / d);
    const r = battleEl.getBoundingClientRect();
    Object.assign(hud.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    scene.layout({ x: r.left, y: r.top, w: r.width, h: r.height }, d);
  };
  new ResizeObserver(layout).observe(battleEl);
  window.addEventListener('resize', layout);
  window.addEventListener('hd-layout', layout);
  layout();

  const game = new Game(scene);
  scene.resetBattle(6);
  document.getElementById('boot')!.remove();
  game.screens.title();

  // 첫 터치에서 소리 잠금 해제 (모바일 자동 재생 제한)
  const firstTouch = () => {
    sfx.unlock();
    audio.unlock();
    window.removeEventListener('pointerdown', firstTouch, true);
  };
  window.addEventListener('pointerdown', firstTouch, true);

  // RELEASE를 따로 검사해 출시 빌드에서는 이 코드가 빌드 결과에서 빠지게 한다
  // 스토어 연결은 기다리지 않는다 (산 기록은 저장소에서 바로 읽고, 오프라인이어도 무료 단계는 된다)
  void purchases.init();
  if (Capacitor.isNativePlatform()) {
    void App.addListener('backButton', () => {
      if (game.back()) void App.exitApp();
    });
  }
  if (!RELEASE && options.dev) (window as unknown as { __hd: unknown }).__hd = { game, scene, audio, saves, sfx, purchases };
}

boot().catch((e) => {
  const el = document.getElementById('boot');
  if (el) el.textContent = `시작하지 못했습니다: ${e instanceof Error ? e.message : String(e)}`;
  console.error(e);
});
