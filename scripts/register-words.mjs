// 검수를 마친 그림 묶음을 게임에 등록한다 (docs/vocab-plan.md 작업 순서 4).
//   node scripts/register-words.mjs <레벨> <묶음.ts> [<묶음.ts> ...]
//   레벨: l1 | l2 | l3  (어휘팩 4-6 | 7-8 | 9+)
// 하는 일
//   1. 묶음의 단어를 docs/vocab-candidates-<레벨>.json에서 찾아 src/content/wordlists/<레벨>.json으로 옮긴다
//      (후보에 없는 단어가 묶음에 있으면 멈춘다: 목록 밖 단어가 그림만으로 들어오지 않게).
//   2. src/content/pictureIndex.ts를 다시 만든다 (등록된 묶음만 가져온다).
// 소리와 표기가 다른지는 등록 때 적지 않고 vocab.ts가 발음 판정으로 계산한다.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [level, ...files] = process.argv.slice(2);
if (!['l1', 'l2', 'l3'].includes(level) || !files.length) {
  console.error('사용: node scripts/register-words.mjs <l1|l2|l3> <묶음.ts> ...');
  process.exit(2);
}
const candPath = `docs/vocab-candidates-${level}.json`;
const listPath = `src/content/wordlists/${level}.json`;
const cands = JSON.parse(fs.readFileSync(candPath, 'utf8'));
const list = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath, 'utf8')) : [];
const REG = 'src/content/wordlists/registered-pictures.json';
const registered = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, 'utf8')) : [];

for (const f of files) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  const words = Object.keys(mod.PICS);
  const missing = words.filter((w) => !cands.some((c) => c.word === w));
  if (missing.length) {
    console.error(`${f}: 후보 목록에 없는 단어 ${missing.join(', ')}`);
    process.exit(1);
  }
  for (const w of words) {
    const i = cands.findIndex((c) => c.word === w);
    const { word, domain, tier } = cands[i];
    list.push({ word, domain, tier });
    cands.splice(i, 1);
  }
  const base = path.basename(f, '.ts');
  if (!registered.includes(base)) registered.push(base);
  console.log(`${f}: ${words.length}단어 등록`);
}
fs.writeFileSync(candPath, JSON.stringify(cands, null, 1) + '\n');
fs.writeFileSync(listPath, JSON.stringify(list, null, 1) + '\n');
fs.writeFileSync(REG, JSON.stringify(registered, null, 1) + '\n');

const id = (b) => b.replace(/[^a-z0-9]/gi, '_').toUpperCase();
fs.writeFileSync(
  'src/content/pictureIndex.ts',
  `// 자동 생성 (scripts/register-words.mjs): 검수를 마치고 등록한 그림 묶음만 가져온다.\n` +
    registered.map((b) => `import { PICS as ${id(b)} } from './pictures/${b}.ts';`).join('\n') +
    `\n\nexport const REGISTERED_PICS: Record<string, string> = Object.assign({}, ${registered.map(id).join(', ')});\n`,
);
console.log(`남은 후보 ${cands.length}개, ${listPath} ${list.length}개`);
