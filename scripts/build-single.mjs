// dist/ 빌드를 파일 하나로 묶는다 (JS·CSS·글꼴을 모두 안에 넣음). 서버 없이 폰에서 파일 하나로 열 수 있다.
//   dist-single/inwoo-hangul-robot.html : 완전한 HTML 문서
//   dist-single/artifact.html           : 문서 뼈대(<html>/<head>/<body>)를 빼고 내용만 담은 판 (게시용)
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const out = 'dist-single';
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const cssHref = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
const jsSrc = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
if (!cssHref || !jsSrc) throw new Error('dist/index.html에서 CSS/JS를 찾지 못함');

const cssPath = path.join(dist, cssHref[1]);
let css = fs.readFileSync(cssPath, 'utf8');
// 글꼴 파일을 data: 주소로 넣는다
css = css.replace(/url\(([^)]+\.woff2)\)/g, (_, rel) => {
  const file = path.resolve(path.dirname(cssPath), rel.replace(/["']/g, ''));
  return `url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')})`;
});
const js = fs.readFileSync(path.join(dist, jsSrc[1]), 'utf8').replace(/<\/script/gi, '<\\/script');

html = html.replace(cssHref[0], () => `<style>${css}</style>`);
html = html.replace(jsSrc[0], () => '');
html = html.replace('</body>', () => `<script type="module">${js}</script>\n</body>`);

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'inwoo-hangul-robot.html'), html);

// 게시용: 제목·스타일을 맨 앞에, 그다음 본문 내용
const title = html.match(/<title>.*?<\/title>/s)[0];
const style = html.match(/<style>.*?<\/style>/s)[0];
const body = html.match(/<body>(.*)<\/body>/s)[1];
fs.writeFileSync(path.join(out, 'artifact.html'), `${title}\n${style}\n${body}`);

for (const f of fs.readdirSync(out)) console.log(`${path.join(out, f)}  ${(fs.statSync(path.join(out, f)).size / 1024).toFixed(0)} KB`);
