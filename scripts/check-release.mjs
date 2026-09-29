// 출시 빌드(dist)에 개발 옵션이 남지 않았는지 검사한다. `npm run build:release` 끝에 돈다.
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2] ?? 'dist';
const files = fs.readdirSync(path.join(dir, 'assets')).filter((f) => f.endsWith('.js'));
const js = files.map((f) => fs.readFileSync(path.join(dir, 'assets', f), 'utf8')).join('\n');
const banned = [
  ['디버그 창 연결 (window.__hd)', /\.__hd\s*=/],
  ['?dev= 읽기', /get\(\s*["'`]dev["'`]\s*\)/],
  ['?speed= 읽기', /get\(\s*["'`]speed["'`]\s*\)/],
  ['?voice= 읽기', /get\(\s*["'`]voice["'`]\s*\)/],
];
const found = banned.filter(([, re]) => re.test(js));
if (!files.length) {
  console.error(`${dir}/assets에 JS가 없습니다. 먼저 빌드하세요.`);
  process.exit(1);
}
if (found.length) {
  console.error(`출시 빌드에 개발 옵션이 남아 있습니다: ${found.map(([n]) => n).join(', ')}`);
  process.exit(1);
}
console.log(`출시 빌드 검사 통과: 개발 옵션 없음 (${files.length}개 JS)`);
