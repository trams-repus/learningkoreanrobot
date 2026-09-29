// 단어 그림 모음 한 장 (그림 검수용). 큰 그림과 게임 안 크기(76px, 같은 바탕색)를 나란히 보여 준다.
// 사용:
//   node scripts/picture-sheet.mjs <출력.png> <그림 묶음 파일.ts>        묶음 파일(PICS 내보내기)의 그림 전부
//   node scripts/picture-sheet.mjs <출력.png> --words 사과,돼지,귀       등록된 그림 중 고른 단어
//   node scripts/picture-sheet.mjs <출력.png> --all [--from 0 --count 60] 등록된 그림 전부 (나눠 보기)
// Node가 .ts 파일의 형 표시를 지우고 바로 읽는다 (Node 22.18+).
import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [out, ...rest] = process.argv.slice(2);
if (!out || !rest.length) {
  console.error('사용: node scripts/picture-sheet.mjs <출력.png> <묶음.ts> | --words a,b | --all');
  process.exit(2);
}
const kit = await import(pathToFileURL(path.resolve('src/content/pictureKit.ts')).href);
let entries;
if (rest[0] === '--words' || rest[0] === '--all') {
  const pics = await import(pathToFileURL(path.resolve('src/content/pictures.ts')).href);
  let words = rest[0] === '--all' ? pics.PICTURED_WORDS : rest[1].split(',');
  const from = rest.indexOf('--from') >= 0 ? Number(rest[rest.indexOf('--from') + 1]) : 0;
  const count = rest.indexOf('--count') >= 0 ? Number(rest[rest.indexOf('--count') + 1]) : words.length;
  words = words.slice(from, from + count);
  entries = words.map((w) => [w, pics.pictureSvg(`p_${w}`)]);
} else {
  const mod = await import(pathToFileURL(path.resolve(rest[0])).href);
  entries = Object.entries(mod.PICS).map(([w, inner]) => [w, kit.svgFor(inner)]);
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cells = entries
  .map(
    ([w, svg]) =>
      `<figure><div class="big">${svg ?? '<b>없음</b>'}</div><div class="small">${svg ?? ''}</div><figcaption>${esc(w)}</figcaption></figure>`,
  )
  .join('');
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:8px;background:#1c2a4d;font-family:sans-serif;display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
figure{margin:0;background:#253766;border-radius:10px;padding:6px;display:grid;grid-template-columns:1fr 76px;gap:6px;align-items:end}
.big,.small{background:#fff7e0;border:3px solid #16203a;border-radius:12px;padding:4px}
.big svg,.small svg{display:block;width:100%;height:100%}
.small{width:76px;height:76px;box-sizing:border-box}
figcaption{grid-column:1/3;color:#fff;font-weight:800;font-size:18px;text-align:center}
</style>${cells}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`${out}: ${entries.length}개 (${entries.filter(([, s]) => !s).length}개 없음)`);
