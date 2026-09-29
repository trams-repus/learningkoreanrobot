import { describe, expect, it } from 'vitest';
import { PICTURED_WORDS, pictureSvg } from '../src/content/pictures';
import { VOCAB } from '../src/content/vocab';

describe('단어 그림', () => {
  it('그림은 모두 어휘에 있는 단어의 것이고, 단어 데이터의 그림 ID로 찾아진다', () => {
    const words = new Set(VOCAB.map((e) => e.word));
    for (const w of PICTURED_WORDS) expect(words.has(w), w).toBe(true);
    for (const e of VOCAB) expect(pictureSvg(e.pictureId) !== null).toBe(PICTURED_WORDS.includes(e.word));
  });

  it('어휘의 모든 단어에 그림이 있다 (4~6세, 7~8세)', () => {
    const missing = VOCAB.filter((e) => !PICTURED_WORDS.includes(e.word)).map((e) => e.word);
    expect(missing).toEqual([]);
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

// 그림 묶음 파일 (src/content/pictures/*.ts): 등록 전에도 같은 규칙으로 검사한다
import { svgFor } from '../src/content/pictureKit';

const batches = import.meta.glob<{ PICS: Record<string, string> }>('../src/content/pictures/*.ts', { eager: true });

describe('그림 묶음 파일', () => {
  it('글자 없음, 태그 짝, 숫자 이상 없음, 닫힌 도형은 색을 가진다', () => {
    for (const [file, mod] of Object.entries(batches)) {
      for (const [w, inner] of Object.entries(mod.PICS)) {
        const svg = svgFor(inner);
        const id = `${file} ${w}`;
        expect(svg, id).not.toMatch(/[ᄀ-ᇿ㄰-㆏가-힣A-Za-z]{2,}(?![^<]*>)/);
        expect(svg, id).not.toMatch(/<text|<tspan|<foreignObject|<image|<script|href=/i);
        expect((svg.match(/<g[\s>]/g) ?? []).length, id).toBe((svg.match(/<\/g>/g) ?? []).length);
        expect(svg, id).not.toMatch(/NaN|undefined|Infinity/);
        expect(inner.length, id).toBeGreaterThan(40);
      }
    }
  });
  it('묶음끼리 같은 단어를 두 번 그리지 않는다', () => {
    const seen = new Map<string, string>();
    for (const [file, mod] of Object.entries(batches))
      for (const w of Object.keys(mod.PICS)) {
        expect(seen.get(w), `${w}: ${seen.get(w)} / ${file}`).toBeUndefined();
        seen.set(w, file);
      }
  });
});
