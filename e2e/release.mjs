// 출시 빌드를 브라우저로 열어 URL 개발 옵션(?dev=1&speed=8&voice=off)이 먹지 않는지 확인한다.
// 사용: npm run build:release && node e2e/release.mjs   (폴더를 바꾸려면 node e2e/release.mjs <폴더>)
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] ?? 'dist';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  let f = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (f.endsWith('/')) f += 'index.html';
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': types[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
}).listen(4180);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 360, height: 640 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:4180/?dev=1&speed=8&voice=off');
await p.waitForSelector('#t-start');
await p.waitForTimeout(800);
const r = await p.evaluate(() => ({ hd: typeof window.__hd }));
// 전투 고르기 화면에서 잠긴 단계가 있는지 (dev=1이면 모두 열림)
await p.click('#t-map', { force: true }).catch(() => {});
await p.waitForTimeout(500);
r.locks = await p.evaluate(() => document.querySelectorAll('.lockmark').length);
r.errors = errs;
const ok = r.hd === "undefined" && r.locks > 0 && !r.errors.length;
console.log(JSON.stringify({ ...r, ok }));
await b.close();
srv.close();
process.exit(ok ? 0 : 1);
