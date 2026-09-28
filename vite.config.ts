import { defineConfig } from 'vite';

// 정적 파일로 배포할 수 있게 상대 경로로 빌드한다 (어느 하위 폴더에 올려도 동작).
export default defineConfig({
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 2000 },
  server: { host: true },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
