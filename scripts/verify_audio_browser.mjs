// 내려받은 단어 녹음을 실제 브라우저(Chromium)의 Web Audio로 해독하고 끝까지 재생해 본다.
// 게임도 같은 방식(AudioContext.decodeAudioData → AudioBufferSourceNode)으로 재생한다.
// 파일이 있다는 것만으로 성공 처리하지 않기 위한 검사: 해독 실패, 무음, 재생 끝 이벤트 누락을 잡는다.
// 사람 귀로 듣는 발음 확인을 대신하지는 않는다.
//
//   node scripts/verify_audio_browser.mjs            # public/audio/words/*.wav
//   node scripts/verify_audio_browser.mjs --dir 경로  # 다른 폴더
//
// 결과: 화면 출력 + <폴더>/browser-check.json. 하나라도 실패하면 종료 코드 1.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const dirArg = process.argv.indexOf('--dir');
const DIR = dirArg > 0 ? process.argv[dirArg + 1] : 'public/audio/words';
/** 이보다 조용하면 무음으로 본다 (최대 진폭, 0~1). 임시 기준. */
const SILENT_PEAK = 0.02;

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.wav')).sort() : [];
if (!files.length) {
  console.log(`${DIR}에 WAV 파일이 없습니다. 검사할 것 없음.`);
  process.exit(1);
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setContent('<!doctype html><title>audio check</title>');

const results = [];
for (const file of files) {
  const b64 = fs.readFileSync(path.join(DIR, file)).toString('base64');
  const r = await page.evaluate(
    async ({ b64, silentPeak }) => {
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const ctx = new AudioContext();
      try {
        await ctx.resume();
        const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));
        let peak = 0;
        let sum = 0;
        let first = -1;
        let last = -1;
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          const a = Math.abs(ch[i]);
          if (a > peak) peak = a;
          sum += a * a;
          if (a > silentPeak) {
            if (first < 0) first = i;
            last = i;
          }
        }
        // 실제 재생: 끝 이벤트가 오는지 (게임은 이 이벤트로 다음 단계로 넘어간다)
        const t0 = performance.now();
        const ended = await new Promise((resolve) => {
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const gain = ctx.createGain();
          gain.gain.value = 0.0001; // 검사 중 스피커로 크게 나오지 않게
          src.connect(gain).connect(ctx.destination);
          const timer = setTimeout(() => resolve(false), buf.duration * 1000 + 3000);
          src.onended = () => {
            clearTimeout(timer);
            resolve(true);
          };
          src.start();
        });
        return {
          decoded: true,
          seconds: +buf.duration.toFixed(2),
          sampleRate: buf.sampleRate,
          channels: buf.numberOfChannels,
          peak: +peak.toFixed(3),
          rms: +Math.sqrt(sum / ch.length).toFixed(4),
          soundStart: first < 0 ? null : +(first / buf.sampleRate).toFixed(2),
          soundEnd: last < 0 ? null : +(last / buf.sampleRate).toFixed(2),
          playedToEnd: ended,
          playMs: Math.round(performance.now() - t0),
        };
      } catch (e) {
        return { decoded: false, error: String(e) };
      } finally {
        await ctx.close();
      }
    },
    { b64, silentPeak: SILENT_PEAK },
  );
  const problems = [];
  if (!r.decoded) problems.push(`해독 실패: ${r.error}`);
  else {
    if (r.peak < SILENT_PEAK) problems.push(`무음에 가까움 (최대 진폭 ${r.peak})`);
    if (!r.playedToEnd) problems.push('재생 끝 이벤트가 오지 않음');
    if (r.seconds < 0.2) problems.push(`너무 짧음 (${r.seconds}초)`);
  }
  const ok = problems.length === 0;
  results.push({ file, ok, ...r, problems });
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${file}` +
      (r.decoded ? `  ${r.seconds}s ${r.sampleRate}Hz ch${r.channels} 최대진폭 ${r.peak} 소리구간 ${r.soundStart === null ? '없음' : `${r.soundStart}~${r.soundEnd}s`}` : '') +
      (problems.length ? `  → ${problems.join(', ')}` : ''),
  );
}
const version = browser.version();
await browser.close();

const report = { checkedAt: new Date().toISOString(), browser: `Chromium ${version} (Playwright, 헤드리스)`, silentPeak: SILENT_PEAK, results };
fs.writeFileSync(path.join(DIR, 'browser-check.json'), JSON.stringify(report, null, 2) + '\n');
const okCount = results.filter((r) => r.ok).length;
console.log(`${okCount}/${results.length}개 브라우저 해독·재생 통과. 보고: ${path.join(DIR, 'browser-check.json')}`);
process.exit(okCount === results.length ? 0 : 1);
