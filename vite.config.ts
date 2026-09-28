import fs from 'node:fs';
import { defineConfig } from 'vite';

/** public/audio/words/의 WAV 중 RIFF/WAVE 헤더가 맞는 파일만 게임에 알린다 (HTML 오류 페이지 등은 제외). */
function checkedWordAudio(): string[] {
  const dir = 'public/audio/words';
  if (!fs.existsSync(dir)) return [];
  // scripts/verify_audio_browser.mjs가 브라우저 해독·재생에 실패했다고 기록한 파일은 빼고 그 단어만 TTS로 둔다
  const checkFile = `${dir}/browser-check.json`;
  const failed = new Set<string>(
    fs.existsSync(checkFile)
      ? (JSON.parse(fs.readFileSync(checkFile, 'utf8')).results as { file: string; ok: boolean }[]).filter((r) => !r.ok).map((r) => r.file)
      : [],
  );
  return fs.readdirSync(dir).filter((f) => {
    if (!f.endsWith('.wav') || failed.has(f)) return false;
    const buf = fs.readFileSync(`${dir}/${f}`);
    return buf.length > 44 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WAVE';
  });
}

// 정적 파일로 배포할 수 있게 상대 경로로 빌드한다 (어느 하위 폴더에 올려도 동작).
export default defineConfig({
  base: './',
  define: { __WORD_AUDIO_FILES__: JSON.stringify(checkedWordAudio()) },
  build: { target: 'es2020', chunkSizeWarningLimit: 2000 },
  server: { host: true },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
