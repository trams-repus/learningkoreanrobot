// 연속 장면을 한 장으로 모은다 (연출 검토용). 사용: node e2e/sheet.mjs <폴더> <이름 접두사> <출력.png> [열 수] [건너뛰기]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [dir, prefix, out, colsArg, everyArg] = process.argv.slice(2);
const cols = Number(colsArg ?? 6);
const every = Number(everyArg ?? 1);
const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith(`${prefix}-`) && /-\d+\.png$/.test(f))
  .sort()
  .filter((_, i) => i % every === 0);
const imgs = files.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"><figcaption>${f.match(/-(\d+)\.png$/)[1]}</figcaption></figure>`).join('');
const html = `<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},1fr);gap:2px">${imgs}</body><style>figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:2px;top:0;color:#fff;font:bold 14px sans-serif;text-shadow:0 0 3px #000}</style>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: cols * 260, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`${out}: ${files.length}장`);
