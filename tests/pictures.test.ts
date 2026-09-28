import { describe, expect, it } from 'vitest';
import { PICTURED_WORDS, pictureSvg } from '../src/content/pictures';
import { VOCAB } from '../src/content/vocab';

// 그림 한 장으로는 서로 구별되지 않아 일부러 비워 둔 단어
const NO_PICTURE_ON_PURPOSE = ['누나', '오빠', '언니', '이모'];

describe('단어 그림', () => {
  it('그림은 모두 어휘에 있는 단어의 것이고, 단어 데이터의 그림 ID로 찾아진다', () => {
    const words = new Set(VOCAB.map((e) => e.word));
    for (const w of PICTURED_WORDS) expect(words.has(w), w).toBe(true);
    for (const e of VOCAB) expect(pictureSvg(e.pictureId) !== null).toBe(PICTURED_WORDS.includes(e.word));
  });

  it('4~6세 단어는 일부러 비운 가족 호칭 말고 모두 그림이 있다', () => {
    const missing = VOCAB.filter((e) => e.pack === '4-6' && !PICTURED_WORDS.includes(e.word)).map((e) => e.word);
    expect(missing.sort()).toEqual([...NO_PICTURE_ON_PURPOSE].sort());
  });

  it('그림에는 글자가 없다 (한글·text 요소 없음) — 뜻만 보여 주고 철자는 드러내지 않는다', () => {
    for (const w of PICTURED_WORDS) {
      const svg = pictureSvg(`p_${w}`)!;
      expect(svg, w).not.toMatch(/[ᄀ-ᇿ㄰-㆏가-힣]/);
      expect(svg, w).not.toMatch(/<text|<tspan|<foreignObject/i);
    }
  });

  it('SVG 모양이 깨지지 않았다 (열고 닫힘, 숫자)', () => {
    for (const w of PICTURED_WORDS) {
      const svg = pictureSvg(`p_${w}`)!;
      expect(svg.startsWith('<svg') && svg.endsWith('</svg>'), w).toBe(true);
      expect((svg.match(/<g[\s>]/g) ?? []).length, w).toBe((svg.match(/<\/g>/g) ?? []).length);
      expect(svg, w).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
});
