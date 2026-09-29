// 앱 아이콘·시작 화면 그림 만들기 (Capacitor 기본 아이콘을 대신한다). 로봇 머리 + 자모 칩(ㅎ)을 도형으로 그린다 (글꼴 없이).
// 사용: node scripts/make-icons.mjs  → android/…/mipmap-*, drawable*/splash.png, ios/…/AppIcon·Splash, docs/store/icon-512.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const INK = '#16203a';
const BG = '#ffc933';
const NAVY = '#1c2a4d';

/** 108×108 좌표의 앞 그림 (안드로이드 적응형 아이콘 안전 구역: 가운데 지름 66 안) */
const FOREGROUND = `
  <g stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M47 30l-4-9" stroke-width="3.2"/><circle cx="42" cy="19" r="4.2" fill="#ff5a5a" stroke-width="2.6"/>
    <rect x="28" y="29" width="40" height="34" rx="12" fill="#eef3fb" stroke-width="3.4"/>
    <rect x="33" y="38" width="30" height="12" rx="6" fill="${INK}"/>
    <rect x="37" y="40.5" width="8" height="7" rx="2.5" fill="#5cf2ff" stroke="none"/>
    <rect x="51" y="40.5" width="8" height="7" rx="2.5" fill="#5cf2ff" stroke="none"/>
    <rect x="38" y="63" width="20" height="8" rx="3" fill="#3b78e6" stroke-width="3"/>
    <g transform="translate(58 55) rotate(8)">
      <rect x="0" y="0" width="24" height="24" rx="6" fill="#fffaf0" stroke-width="3"/>
      <path d="M9 5.5h6M6 9.5h12" stroke-width="2.8"/>
      <circle cx="12" cy="16.2" r="4.3" fill="none" stroke-width="2.8"/>
    </g>
  </g>`;

const svg = (w, h, inner, bg = null, shape = 'square') => {
  const clip = shape === 'round' ? `<clipPath id="c"><circle cx="54" cy="54" r="54"/></clipPath>` : shape === 'rounded' ? `<clipPath id="c"><rect width="108" height="108" rx="22"/></clipPath>` : '';
  const g = clip ? `<g clip-path="url(#c)">` : '<g>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 108 108"><defs>${clip}</defs>${g}${bg ? `<rect width="108" height="108" fill="${bg}"/>` : ''}${inner}</g></svg>`;
};

/** 시작 화면: 남색 바탕 가운데 아이콘 (가로·세로 비율 유지) */
const splashSvg = (w, h) => {
  const s = Math.min(w, h) * 0.36;
  const x = (w - s) / 2;
  const y = (h - s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${NAVY}"/>
    <svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 108 108"><clipPath id="c"><rect width="108" height="108" rx="26"/></clipPath><g clip-path="url(#c)"><rect width="108" height="108" fill="${BG}"/>${FOREGROUND}</g></svg></svg>`;
};

const RES = 'android/app/src/main/res';
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const jobs = [];
for (const [d, k] of Object.entries(DENS)) {
  const leg = Math.round(48 * k);
  const fg = Math.round(108 * k);
  // 레거시 아이콘은 안전 구역만 크게 보이게 조금 확대해 자른다
  jobs.push([`${RES}/mipmap-${d}/ic_launcher.png`, leg, leg, svg(leg, leg, `<g transform="translate(-10 -10) scale(1.185)">${FOREGROUND}</g>`, BG, 'rounded'), true]);
  jobs.push([`${RES}/mipmap-${d}/ic_launcher_round.png`, leg, leg, svg(leg, leg, `<g transform="translate(-10 -10) scale(1.185)">${FOREGROUND}</g>`, BG, 'round'), true]);
  jobs.push([`${RES}/mipmap-${d}/ic_launcher_foreground.png`, fg, fg, svg(fg, fg, FOREGROUND), true]);
}
for (const f of fs.readdirSync(RES).filter((x) => x.startsWith('drawable'))) {
  const p = `${RES}/${f}/splash.png`;
  if (!fs.existsSync(p)) continue;
  const b = fs.readFileSync(p);
  const w = b.readUInt32BE(16);
  const h = b.readUInt32BE(20);
  jobs.push([p, w, h, splashSvg(w, h), false]);
}
jobs.push(['ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png', 1024, 1024, svg(1024, 1024, `<g transform="translate(-10 -10) scale(1.185)">${FOREGROUND}</g>`, BG), false]);
for (const n of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) jobs.push([`ios/App/App/Assets.xcassets/Splash.imageset/${n}`, 2732, 2732, splashSvg(2732, 2732), false]);
fs.mkdirSync('docs/store', { recursive: true });
jobs.push(['docs/store/icon-512.png', 512, 512, svg(512, 512, `<g transform="translate(-10 -10) scale(1.185)">${FOREGROUND}</g>`, BG), false]);

// Play 스토어 그래픽 이미지 (1024×500): 게임 글꼴(Noto Sans KR 부분집합)로 이름을 쓴다
const font = fs.readFileSync('public/fonts/NotoSansKR-900Black.woff2').toString('base64');
const TILES = ['ㅎ', 'ㅏ', 'ㄴ', 'ㄱ', 'ㅡ', 'ㄹ'];
const feature = `<style>@font-face{font-family:HD;src:url(data:font/woff2;base64,${font})}</style>
<div style="width:1024px;height:500px;background:${NAVY};display:flex;align-items:center;gap:40px;padding:0 64px;box-sizing:border-box;font-family:HD">
  <svg width="300" height="300" viewBox="0 0 108 108"><clipPath id="c"><rect width="108" height="108" rx="26"/></clipPath><g clip-path="url(#c)"><rect width="108" height="108" fill="${BG}"/>${FOREGROUND}</g></svg>
  <div><div style="color:#fff;font-size:104px;line-height:1.1;letter-spacing:-2px">한글대작전</div>
  <div style="display:flex;gap:14px;margin-top:26px">${TILES.map((t, i) => `<div style="width:76px;height:76px;border-radius:16px;background:#fffaf0;border:5px solid ${INK};display:grid;place-items:center;font-size:64px;line-height:1;color:${INK};transform:rotate(${(i % 2 ? 1 : -1) * 4}deg)">${t}</div>`).join('')}</div></div>
</div>`;
jobs.push(['docs/store/feature-1024x500.png', 1024, 500, feature, false]);

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [out, w, h, s, transparent] of jobs) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:transparent">${s}</body></html>`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}
await browser.close();
// 적응형 아이콘 뒤 색
fs.writeFileSync(`${RES}/values/ic_launcher_background.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG.toUpperCase()}</color>\n</resources>\n`);
console.log(`아이콘·시작 화면 ${jobs.length}개`);
