import { describe, expect, it } from 'vitest';
import { AUDIO_MANIFEST, WORD_AUDIO_SOURCES } from '../src/content/audio';
import { MIN_STAGE_WORDS, STAGES, entryDifficulty, stageWords } from '../src/content/stages';
import { EASY_FIVE, EASY_MORE, VOCAB, packWords, vocabById, type Domain } from '../src/content/vocab';
import { isSupportedWord, wordDifficulty, wordFeatures, wordFrames, wordTier } from '../src/core/assembly';
import { composeSyllable } from '../src/hangul/hangul';

describe('어휘팩', () => {
  it('처음 40개에 약 100개를 더했고, 두 팩 모두 핵심·권장과 9개 영역을 고루 갖는다', () => {
    expect(VOCAB.length).toBeGreaterThanOrEqual(140);
    expect(new Set(VOCAB.map((v) => v.id)).size).toBe(VOCAB.length);
    const domains: Domain[] = ['가족', '신체', '음식', '동물', '생활용품', '장소', '자연', '행동', '상태'];
    for (const pack of ['4-6', '7-8'] as const) {
      const all = packWords(pack, true);
      const core = packWords(pack, false);
      expect(all.length, pack).toBeGreaterThanOrEqual(60);
      expect(core.length, pack).toBeGreaterThanOrEqual(30);
      expect(all.length - core.length, pack).toBeGreaterThanOrEqual(30);
      // 로봇·공룡 단어만으로 채우지 않는다: 9개 영역마다 최소 3개
      for (const d of domains) expect(all.filter((v) => v.domain === d).length, `${pack} ${d}`).toBeGreaterThanOrEqual(3);
    }
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
  it('녹음 목록 15개(사용자 링크 10 + 같은 이름 규칙 후보 5)는 모두 어휘에 있고 올바른 모양으로 조립할 수 있다', () => {
    expect(WORD_AUDIO_SOURCES).toHaveLength(15);
    expect(WORD_AUDIO_SOURCES[0].word).toBe('수박');
    expect(new Set(WORD_AUDIO_SOURCES.map((s) => s.file)).size).toBe(15);
    for (const s of WORD_AUDIO_SOURCES) {
      expect(vocabById(s.word), s.word).toBeDefined();
      expect(isSupportedWord(s.word), s.word).toBe(true);
      expect(s.commonsFile).toBe(`LL-Q9176_(kor)-호로조-${s.word}.wav`);
      expect(s.file).toMatch(/^[a-z]+\.wav$/);
      // 사용자가 준 주소 형식 그대로 (한글만 인코딩, 괄호는 그대로, 두 번 인코딩하지 않음)
      expect(s.url).toBe(
        'https://commons.wikimedia.org/wiki/Special:FilePath/LL-Q9176_(kor)-' + encodeURIComponent('호로조-' + s.word) + '.wav',
      );
    }
    expect(WORD_AUDIO_SOURCES.find((s) => s.word === '수박')!.url).toBe(
      'https://commons.wikimedia.org/wiki/Special:FilePath/LL-Q9176_(kor)-%ED%98%B8%EB%A1%9C%EC%A1%B0-%EC%88%98%EB%B0%95.wav',
    );
    const userGiven = WORD_AUDIO_SOURCES.filter((s) => s.link.startsWith('사용자 제공'));
    expect(userGiven.map((s) => s.word).sort()).toEqual(['개미', '꼬리', '나무', '나비', '다리', '머리', '바나나', '바다', '사자', '수박'].sort());
    for (const s of userGiven) expect(s.license).toBe('CC0-1.0');
    // 후보는 파일 존재·라이선스를 확인하기 전이므로 CC0라고 적지 않는다. 공룡·가방은 404로 없음이 확인됐다.
    for (const s of WORD_AUDIO_SOURCES.filter((x) => !userGiven.includes(x))) {
      expect(s.link, s.word).toMatch(['공룡', '가방'].includes(s.word) ? /^없음/ : /^후보/);
      expect(s.license, s.word).toBe('확인 전');
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
  it('수박은 첫 문제 한 번만 나오고, 첫 두 전투는 받침·쌍자음·ㅐ 없는 쉬운 단어로 이어진다', () => {
    const [s1, s2] = STAGES;
    expect(s1.fixedWords).toEqual(['수박']);
    for (const s of [s1, s2]) {
      const words = stageWords(s, '4-6', true).map((w) => w.word);
      expect(words, s.id).not.toContain('수박');
      expect(new Set(words).size, s.id).toBeGreaterThanOrEqual(5);
      for (const w of words) expect(entryDifficulty(vocabById(w)!), `${s.id} ${w}`).toBeLessThan(1);
    }
    for (const w of EASY_MORE) expect(wordTier(w), w).toBe('plain');
  });
  it('소리와 표기가 다른 단어는 표시하고 출제 순서에서 더 어렵게 본다', () => {
    for (const w of ['공룡', '학교', '로봇', '김밥']) {
      const v = vocabById(w)!;
      expect(v.soundMatchesSpelling, w).toBe(false);
      expect(entryDifficulty(v), w).toBe(wordDifficulty(w) + 1);
    }
    expect(vocabById('수박')!.soundMatchesSpelling).toBe(true);
  });
});

describe('난이도 단계별 전투', () => {
  it('받침 없음 → 받침 → 쌍자음·ㅐ 순서로 나눈다', () => {
    expect(wordTier('나무')).toBe('plain');
    expect(wordTier('바나나')).toBe('plain');
    expect(wordTier('수박')).toBe('jong');
    expect(wordTier('고양이')).toBe('jong');
    expect(wordTier('꼬리')).toBe('tense');
    expect(wordTier('개미')).toBe('tense');
    expect(wordTier('빵')).toBe('tense'); // 쌍자음 + 받침이면 마지막 단계
    const tiers = STAGES.map((s) => (typeof s.pool === 'object' && !Array.isArray(s.pool) ? s.pool.tier : null)).filter(Boolean);
    expect(tiers).toEqual(['plain', 'jong', 'tense']);
    expect(STAGES[STAGES.length - 1].boss).toBe(true);
  });
  it('어느 연령팩·권장 설정에서도 각 전투에 낼 단어가 충분하고, 단계 밖 단어가 섞이지 않는다', () => {
    for (const pack of ['4-6', '7-8'] as const) {
      for (const rec of [true, false]) {
        for (const s of STAGES) {
          const words = stageWords(s, pack, rec);
          expect(new Set(words.map((w) => w.id)).size, `${s.id} ${pack} ${rec}`).toBe(words.length);
          expect(words.length, `${s.id} ${pack} ${rec}`).toBeGreaterThanOrEqual(s.id === 's1' ? 5 : MIN_STAGE_WORDS);
          if (typeof s.pool === 'object' && !Array.isArray(s.pool)) {
            const tier = s.pool.tier;
            for (const w of words) expect(wordTier(w.word), `${s.id} ${w.word}`).toBe(tier);
          }
        }
      }
    }
  });
  it('받침 없는 단계에는 쉬운 단어(난이도 1.5 미만)가 여럿 있어 첫 성공 전에도 막히지 않는다', () => {
    for (const pack of ['4-6', '7-8'] as const) {
      const plain = stageWords(STAGES.find((s) => s.id === 's3')!, pack, true);
      expect(plain.filter((w) => entryDifficulty(w) < 1.5).length, pack).toBeGreaterThanOrEqual(5);
    }
  });
});
