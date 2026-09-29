import { describe, expect, it } from 'vitest';
import text from '../public/licenses.txt?raw';
import pkg from '../package.json';
import sources from '../src/content/word-audio-sources.json';

const installed = import.meta.glob<{ version: string }>('../node_modules/{phaser,@capacitor/android,@capacitor/ios,@capacitor/core,@capacitor/app,@capacitor-community/text-to-speech,capacitor-plugin-cdv-purchase}/package.json', { eager: true, import: 'default' });
const wavs = new Set(Object.keys(import.meta.glob('../public/audio/words/*.wav')).map((p) => p.split('/').pop()));

describe('라이선스 고지 (public/licenses.txt)', () => {
  it('앱에 들어가는 패키지가 모두 버전과 함께 적혀 있다 (의존성을 바꾸면 scripts/make-licenses.mjs 다시 실행)', () => {
    const shipped = [...Object.keys(pkg.dependencies), '@capacitor/android', '@capacitor/ios'];
    for (const name of shipped) {
      const version = installed[`../node_modules/${name}/package.json`]?.version;
      expect(version, name).toBeDefined();
      expect(text, name).toContain(`■ ${name} ${version}`);
    }
    expect(text).toContain('Apache License');
    expect(text).toContain('SIL OPEN FONT LICENSE');
  });

  it('쓰는 녹음은 CC0·CC BY·퍼블릭 도메인뿐이고, 녹음한 분이 고지에 있다', () => {
    const used = sources.filter((s) => s.file && wavs.has(s.file));
    expect(used.length).toBeGreaterThan(50);
    for (const s of used) {
      expect(s.license, s.word).toMatch(/^(CC0.*|CC[ -]BY( \d\.\d)?|Public domain)$/i);
      expect(text, s.word).toContain(s.speaker);
    }
  });
});
