// 앱에 들어가는 외부 코드·글꼴·녹음의 고지문을 public/licenses.txt로 만든다 (보호자 설정 → 라이선스에서 보여 준다).
// 빌드 번들에는 라이선스 주석이 남지 않으므로 이 파일이 MIT·Apache-2.0·OFL 고지 역할을 한다. 목록: docs/assets-and-licenses.md
// 사용: node scripts/make-licenses.mjs  (의존성 버전을 바꾸면 다시 실행)
import fs from 'node:fs';

const pkg = (name) => JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`, 'utf8'));
const licenseText = (name) => {
  const f = fs.readdirSync(`node_modules/${name}`).find((x) => /^licen[sc]e/i.test(x));
  return f ? fs.readFileSync(`node_modules/${name}/${f}`, 'utf8').trim() : null;
};

const MIT_TEMPLATE = (holder) => `MIT License

Copyright (c) ${holder}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

/** 앱(웹 번들·안드로이드·iOS)에 들어가는 npm 패키지 */
const BUNDLED = ['phaser', 'eventemitter3', '@capacitor/core', '@capacitor/android', '@capacitor/ios', '@capacitor/app', '@capacitor-community/text-to-speech', 'capacitor-plugin-cdv-purchase'];

const out = [];
const hr = '-'.repeat(30);
out.push('한글대작전 — 오픈소스·글꼴·녹음 고지', '', '이 앱은 아래 자료를 각 라이선스에 따라 사용합니다.', '');

out.push(hr, '1. 오픈소스 소프트웨어', hr, '');
for (const name of BUNDLED) {
  const p = pkg(name);
  out.push(`■ ${name} ${p.version} (${p.license})`);
  // cdv-purchase는 패키지에 LICENSE 파일이 없다: package.json의 MIT와 원 저장소 이름으로 적는다
  out.push(licenseText(name) ?? MIT_TEMPLATE(`${p.name} contributors (${p.repository?.url ?? p.homepage ?? ''})`.trim()), '');
}

const apache = licenseText('typescript');
out.push(hr, '2. 안드로이드 구성요소 (Apache License 2.0)', hr, '');
out.push('AndroidX (appcompat, core, activity, fragment, coordinatorlayout, webkit), Apache Cordova Android, Kotlin 표준 라이브러리 — Copyright The Android Open Source Project / The Apache Software Foundation / JetBrains s.r.o.');
out.push('Google Play Billing Library — Android 소프트웨어 개발 키트 라이선스 계약에 따름.', '');
out.push(apache ?? '', '');

out.push(hr, '3. 글꼴', hr, '');
out.push('Noto Sans KR (일부 글자만 담은 판) — SIL Open Font License 1.1', '');
out.push(fs.readFileSync('public/fonts/OFL.txt', 'utf8').trim(), '');

out.push(hr, '4. 단어 녹음', hr, '');
const sources = JSON.parse(fs.readFileSync('src/content/word-audio-sources.json', 'utf8'));
const files = new Set(fs.readdirSync('public/audio/words'));
const used = sources.filter((s) => s.file && files.has(s.file));
const bySpeaker = new Map();
for (const s of used) {
  const k = `${s.speaker} · ${s.license}`;
  if (!bySpeaker.has(k)) bySpeaker.set(k, []);
  bySpeaker.get(k).push(s.word);
}
out.push(`녹음: Lingua Libre (Wikimedia Commons). 원본 파일을 바꾸지 않고 그대로 씁니다. 원본: https://commons.wikimedia.org/wiki/File:<파일 이름>`);
for (const [k, words] of bySpeaker) out.push(`- ${k}: ${words.join(', ')}`);
out.push('CC0: https://creativecommons.org/publicdomain/zero/1.0/');
out.push('녹음이 없는 단어와 대사는 기기의 음성 합성으로 읽습니다.', '');

out.push(hr, '5. 그림·효과음', hr, '');
out.push('단어 그림, 캐릭터, 배경, 아이콘, 효과음은 이 게임을 위해 직접 만들었습니다.', '');

fs.writeFileSync('public/licenses.txt', out.join('\n'));
console.log(`public/licenses.txt: 패키지 ${BUNDLED.length}개, 녹음 ${used.length}개 (${bySpeaker.size}명)`);
