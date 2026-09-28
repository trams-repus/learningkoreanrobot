import { describe, expect, it } from 'vitest';
import { AUDIO_MANIFEST } from '../src/content/audio';
import { STAGES } from '../src/content/stages';
import { EASY_FIVE, VOCAB, packWords, vocabById } from '../src/content/vocab';
import { isSupportedWord, wordFrames } from '../src/core/assembly';
import { composeSyllable } from '../src/hangul/hangul';

describe('어휘팩', () => {
  it('두 팩 모두 20개 단어', () => {
    expect(packWords('4-6', true)).toHaveLength(20);
    expect(packWords('7-8', true)).toHaveLength(20);
    expect(new Set(VOCAB.map((v) => v.id)).size).toBe(VOCAB.length);
  });
  it('모든 단어는 음절 분해 → 재조합이 원래 단어와 같고, 조립틀로 출제할 수 있다', () => {
    for (const v of VOCAB) {
      const frames = wordFrames(v.word);
      expect(frames, v.word).not.toBeNull();
      expect(frames!.map((f) => composeSyllable(f.cho, f.jung, f.jong)).join(''), v.word).toBe(v.word);
      expect(isSupportedWord(v.word), v.word).toBe(true);
    }
  });
  it('공식 등급과 내부 선정을 섞지 않는다', () => {
    for (const v of VOCAB) {
      expect(v.sourceStatus).toBe('임시 선정');
      expect(v.officialGrade).toBeNull();
    }
  });
  it('쉬운 다섯 단어와 전투에 쓰는 단어는 모두 사전에 있다', () => {
    for (const w of EASY_FIVE) expect(vocabById(w)).toBeDefined();
    for (const s of STAGES) {
      for (const w of s.fixedWords ?? []) expect(vocabById(w), w).toBeDefined();
      if (Array.isArray(s.pool)) for (const w of s.pool) expect(vocabById(w), w).toBeDefined();
    }
  });
  it('모든 단어에 음성 목록 항목이 있고, 없는 파일 경로를 적지 않는다', () => {
    for (const v of VOCAB) {
      const a = AUDIO_MANIFEST.find((m) => m.assetId === v.wordAudioId);
      expect(a, v.word).toBeDefined();
      expect(a!.type).toBe('word');
      expect(a!.text).toBe(v.word);
    }
    for (const a of AUDIO_MANIFEST) expect(a.localPath).toBeNull();
  });
});
