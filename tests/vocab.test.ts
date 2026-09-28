import { describe, expect, it } from 'vitest';
import { AUDIO_MANIFEST, WORD_AUDIO_SOURCES } from '../src/content/audio';
import { STAGES } from '../src/content/stages';
import { EASY_FIVE, VOCAB, packWords, vocabById } from '../src/content/vocab';
import { isSupportedWord, wordDifficulty, wordFeatures, wordFrames } from '../src/core/assembly';
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
    // 이 테스트 환경에는 녹음 파일을 내려받지 못했으므로 파일 경로가 하나도 없어야 한다
    const present = new Set(__WORD_AUDIO_FILES__);
    for (const a of AUDIO_MANIFEST) {
      if (a.localPath) expect(present.has(a.localPath.replace('audio/words/', '')), a.assetId).toBe(true);
      else expect(a.playback).not.toBe('file');
    }
  });
  it('녹음 목록 10개는 모두 어휘에 있고 올바른 모양으로 조립할 수 있다', () => {
    expect(WORD_AUDIO_SOURCES).toHaveLength(10);
    for (const s of WORD_AUDIO_SOURCES) {
      expect(vocabById(s.word), s.word).toBeDefined();
      expect(isSupportedWord(s.word), s.word).toBe(true);
      expect(s.commonsFile).toBe(`LL-Q9176_(kor)-호로조-${s.word}.wav`);
      expect(s.license).toBe('CC0-1.0');
      expect(s.file).toMatch(/^[a-z]+\.wav$/);
    }
  });
  it('쉬운 다섯 단어는 녹음 목록에 있고, 받침·쌍자음·ㅐ가 없다', () => {
    for (const w of EASY_FIVE) {
      expect(WORD_AUDIO_SOURCES.some((s) => s.word === w), w).toBe(true);
      expect(wordDifficulty(w), w).toBeLessThan(1);
    }
  });
  it('녹음이 있어도 난이도는 따로 계산한다 (꼬리·개미·바나나)', () => {
    expect(wordFeatures('꼬리')!.hasDoubleConsonant).toBe(true);
    expect(wordFeatures('개미')!.hasComplexVowel).toBe(true);
    expect(wordFeatures('바나나')!.hasRepeatedJamo).toBe(true);
    expect(wordFeatures('수박')!.hasJong).toBe(true);
    for (const w of ['꼬리', '개미', '바나나', '수박']) expect(wordDifficulty(w), w).toBeGreaterThan(0);
  });
});
