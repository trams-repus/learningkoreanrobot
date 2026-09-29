import { describe, expect, it } from 'vitest';
import { AUDIO_MANIFEST, WORD_AUDIO_SOURCES } from '../src/content/audio';
import { GEN, MIN_STAGE_WORDS, bandFor, drawWord, hearablePool, entryDifficulty, frontier, generateStage, nextStageId, regionAt, regionEnd, stageAt, stageById, stagesUpTo, stageWords, trapMix } from '../src/content/stages';

/** 끝없는 단계 중 검사할 표본: 1~20단계 + 먼 단계 */
const STAGES = [...stagesUpTo(20), ...[61, 99, 100, 1000, 1001, 9999, 10000].map((n) => stageAt(n))];
import { createRng } from '../src/core/rng';
import { BALANCE } from '../src/core/battle';
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
  it('녹음 목록: 사용자 링크 10개는 그대로이고, 모든 항목이 어휘에 있으며 올바른 모양으로 조립할 수 있다', () => {
    // 처음 15개(사용자 링크 10 + 같은 이름 규칙 후보 5) 뒤에 GitHub Actions의 찾기(scripts/discover_audio.py)가 어휘를 더한다.
    expect(WORD_AUDIO_SOURCES.length).toBeGreaterThanOrEqual(15);
    expect(WORD_AUDIO_SOURCES[0].word).toBe('수박');
    expect(new Set(WORD_AUDIO_SOURCES.map((s) => s.word)).size).toBe(WORD_AUDIO_SOURCES.length);
    const files = WORD_AUDIO_SOURCES.map((s) => s.file).filter(Boolean);
    expect(new Set(files).size).toBe(files.length);
    for (const s of WORD_AUDIO_SOURCES) {
      expect(vocabById(s.word), s.word).toBeDefined();
      expect(isSupportedWord(s.word), s.word).toBe(true);
      if (s.link.startsWith('없음')) continue; // 녹음 없음 → 기기 TTS
      expect(s.commonsFile).toMatch(new RegExp(`^LL-Q9176_\\(kor\\)-.+-${s.word}\\.wav$`));
      expect(s.file).toMatch(/^[a-z0-9_]+\.wav$/);
      // 한글만 인코딩, 괄호는 그대로, 두 번 인코딩하지 않음
      expect(s.url).toBe(
        'https://commons.wikimedia.org/wiki/Special:FilePath/LL-Q9176_(kor)-' +
          encodeURIComponent(s.commonsFile.slice('LL-Q9176_(kor)-'.length)).replace(/%28/g, '(').replace(/%29/g, ')'),
      );
    }
    expect(WORD_AUDIO_SOURCES.find((s) => s.word === '수박')!.url).toBe(
      'https://commons.wikimedia.org/wiki/Special:FilePath/LL-Q9176_(kor)-%ED%98%B8%EB%A1%9C%EC%A1%B0-%EC%88%98%EB%B0%95.wav',
    );
    const userGiven = WORD_AUDIO_SOURCES.filter((s) => s.link.startsWith('사용자 제공'));
    expect(userGiven.map((s) => s.word).sort()).toEqual(['개미', '꼬리', '나무', '나비', '다리', '머리', '바나나', '바다', '사자', '수박'].sort());
    for (const s of userGiven) expect(s.license).toBe('CC0-1.0');
    // 찾기로 더한 항목은 Commons 파일 정보의 라이선스를 적는다 (허용: CC0, CC BY, CC BY-SA, 퍼블릭 도메인)
    for (const s of WORD_AUDIO_SOURCES.filter((x) => x.link.startsWith('Commons API'))) {
      expect(s.license, s.word).toMatch(/^(CC0|CC[ -]BY(-SA)?( \d\.\d)?|Public domain)/i);
      expect(s.speaker, s.word).not.toBe('');
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
  });
  it('1~10단계: 함정 2·2·2 → 3·3·3 → 4·4·4·4, 쉬운 두 글자 단어부터, 중간 보스(5)와 최종 보스(10)', () => {
    const r1 = STAGES.filter((s) => s.region === 'r1');
    expect(r1.map((s) => s.num)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(r1.map((s) => s.traps.length)).toEqual([2, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
    expect(r1[0].traps).toEqual(['easy', 'easy']);
    // 1~10단계는 두 글자 이하 (세 글자부터는 11단계 이후)
    for (const s of r1) for (const w of stageWords(s, '4-6', true)) expect(wordFeatures(w.word)!.syllables, `${s.id} ${w.word}`).toBeLessThanOrEqual(2);
    expect(r1.find((s) => s.boss === 'mid')?.num).toBe(5);
    expect(r1.find((s) => s.boss === 'final')?.num).toBe(10);
    expect(r1[4].waves.flat().find((f) => f.kind === 'chief')?.finalBlow).toBe('finisher');
    // 1단계 공룡과 10단계 보스는 약해지면 직접 쓴 필살기로 마무리 (한 방에 쓰러지는 체력에서, 혼자 나오는 적)
    for (const s of STAGES) {
      for (const wave of s.waves) {
        for (const f of wave.filter((x) => x.writeFinish !== undefined)) {
          expect(f.writeFinish!, s.id).toBeLessThanOrEqual(BALANCE.attack.ultimate.target);
          expect(wave.length, s.id).toBe(1);
        }
      }
    }
    expect(r1[0].waves[0][0].writeFinish).toBeGreaterThan(0);
    expect(r1[9].waves.flat().find((f) => f.kind === 'boss')?.writeFinish).toBeGreaterThan(0);
    expect(r1[3].unlock).toBe('missiles'); // 4단계: 범위 공격 소개
    expect(Math.max(...r1[3].waves.map((w) => w.length))).toBe(2); // 두 마리 동시
    expect(Math.max(...r1[7].waves.map((w) => w.length))).toBe(3); // 8단계: 세 마리
    // 여러 종류의 적이 나온다
    expect(new Set(r1.flatMap((s) => s.waves.flat().map((f) => f.kind)))).toEqual(new Set(['dino', 'imp', 'charger', 'armor', 'chief', 'boss'])); // 일반·무리·돌진·갑옷·보스 모두
  });
  it('11단계부터는 규칙표로 만든다: 함정 4개 이상·어려움 더 많이, 세 글자, 콤보 시간 빠듯, 방패', () => {
    const r2 = stagesUpTo(20).filter((s) => s.region === 'r2');
    expect(r2.map((s) => s.num)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    for (const s of r2) {
      expect(s.traps.length, s.id).toBeGreaterThanOrEqual(4);
      expect(s.traps.filter((g) => g === 'hard').length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.comboScale, s.id).toBeLessThan(1);
      expect(s.guide, s.id).toBe('less');
      expect(bandFor(s.num)?.from).toBe(11);
    }
    expect(r2.some((s) => stageWords(s, '4-6', true).some((w) => wordFeatures(w.word)!.syllables === 3))).toBe(true);
    expect(r2.some((s) => s.waves.flat().some((f) => (f.shield ?? 0) > 0))).toBe(true);
    expect(r2[4].boss).toBe('mid');
    expect(r2[9].boss).toBe('final');
    expect(trapMix(4, 0.4)).toEqual(['hard', 'hard', 'medium', 'medium']);
    expect(trapMix(5, 0.4)).toEqual(['hard', 'hard', 'medium', 'medium', 'easy']);
    expect(bandFor(40)?.planned.length).toBeGreaterThan(0);
    expect(bandFor(99)?.to).toBeNull();
  });
  it('지역의 끝(10의 배수)에서 새 지역을 알린다: 10 → 화산섬, 20 → 얼음 골짜기', () => {
    expect(regionEnd(stageAt(10))?.id).toBe('r2');
    expect(regionEnd(stageAt(10))?.name).toBe('화산섬');
    expect(regionEnd(stageAt(20))?.name).toBe('얼음 골짜기');
    expect(regionEnd(stageAt(9))).toBeNull();
    expect(regionEnd(stageAt(15))).toBeNull();
  });
  it('어느 연령팩·권장 설정에서도 각 전투에 낼 단어가 충분하고, 단계 밖 단어가 섞이지 않는다', () => {
    for (const pack of ['4-6', '7-8'] as const) {
      for (const rec of [true, false]) {
        for (const s of STAGES) {
          const words = stageWords(s, pack, rec);
          expect(new Set(words.map((w) => w.id)).size, `${s.id} ${pack} ${rec}`).toBe(words.length);
          expect(words.length, `${s.id} ${pack} ${rec}`).toBeGreaterThanOrEqual(s.id === 's1' ? 5 : MIN_STAGE_WORDS);
          if (typeof s.pool === 'object' && !Array.isArray(s.pool)) {
            const f = s.pool;
            for (const w of words) {
              expect(f.tiers, `${s.id} ${w.word}`).toContain(wordTier(w.word));
              expect(f.syllables, `${s.id} ${w.word}`).toContain(wordFeatures(w.word)!.syllables);
            }
          }
        }
      }
    }
  });
  it('받침 없는 단계에는 쉬운 단어(난이도 1.5 미만)가 여럿 있어 첫 성공 전에도 막히지 않는다', () => {
    for (const pack of ['4-6', '7-8'] as const) {
      const plain = stageWords(STAGES.find((s) => s.id === 's2')!, pack, true);
      expect(plain.filter((w) => entryDifficulty(w) < 1.5).length, pack).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('무작위 출제 (단어 주머니)', () => {
  const pool = ['나무', '바다', '나비', '사자', '다리', '모자', '아기'];
  it('주머니를 다 쓰기 전에는 같은 단어가 다시 나오지 않고, 연달아 같은 단어도 없다', () => {
    const rng = createRng(11);
    let bag: string[] = [];
    let last = '';
    const seen: string[] = [];
    for (let n = 0; n < pool.length * 6; n++) {
      const r = drawWord(bag, pool, last, rng);
      expect(r.word, `${n}`).not.toBe(last);
      seen.push(r.word);
      bag = r.bag;
      last = r.word;
    }
    for (let k = 0; k < 6; k++) expect(new Set(seen.slice(k * pool.length, (k + 1) * pool.length)).size, `round ${k}`).toBe(pool.length);
  });
  it('매번 순서가 달라진다 (고정 순서가 아니다)', () => {
    const orders = new Set<string>();
    for (let seed = 1; seed <= 10; seed++) {
      const rng = createRng(seed);
      let bag: string[] = [];
      let last = '';
      const out: string[] = [];
      for (let n = 0; n < pool.length; n++) ({ word: last, bag } = drawWord(bag, pool, last, rng)), out.push(last);
      orders.add(out.join(','));
    }
    expect(orders.size).toBeGreaterThan(5);
  });
  it('후보가 바뀌면 주머니에서 없는 단어를 빼고, 후보가 하나뿐이어도 멈추지 않는다', () => {
    const r = drawWord(['수박', '나무'], ['나무', '바다'], '', createRng(2));
    expect(r.word).toBe('나무');
    expect(drawWord([], ['수박'], '수박', createRng(3)).word).toBe('수박');
  });
});

describe('들을 수 있는 단어 우선 (음성 없는 기기)', () => {
  it('들을 수 있는 단어가 충분하면 그것만, 모자라면 전체', () => {
    const words = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차'];
    const some = new Set(['가', '나', '다', '라', '마', '바', '사', '아']);
    expect(hearablePool(words, (w) => some.has(w))).toEqual([...some]);
    expect(hearablePool(words, (w) => w === '가')).toEqual(words);
    expect(hearablePool(['가', '나'], () => true)).toEqual(['가', '나']);
  });
});

describe('출격 순서', () => {
  it('처음이면 1단계(수박), 앞에서부터 깬 만큼 다음 단계', () => {
    expect(nextStageId([])).toBe('s1');
    expect(nextStageId(['s1'])).toBe('s2');
    expect(nextStageId(['s1', 's2', 's3'])).toBe('s4');
    // 중간을 건너뛴 기록(개발 옵션 등)이 있어도 빈 곳부터
    expect(nextStageId(['s1', 's3'])).toBe('s2');
  });
  it('단계가 끝없이 이어지므로 다 깬 뒤 1단계로 돌아가지 않는다', () => {
    const ids = stagesUpTo(15).map((s) => s.id);
    expect(nextStageId(ids)).toBe('s16');
    const many = Array.from({ length: 1234 }, (_, i) => `s${i + 1}`);
    expect(frontier(many)).toBe(1235);
  });
});

describe('끝없는 단계 생성기 (11단계부터)', () => {
  const SAMPLE = [1, 10, 11, 15, 16, 100, 1000, 10000];
  it('검사 단계 1·10·11·15·16·100·1000·10000을 모두 만든다', () => {
    const got = SAMPLE.map((n) => stageAt(n));
    expect(got.map((s) => s.num)).toEqual(SAMPLE);
    expect(got.map((s) => s.id)).toEqual(SAMPLE.map((n) => `s${n}`));
    for (const s of got) expect(stageById(s.id)).toEqual(s);
    // 1·10단계는 손으로 만든 무료 구간
    expect(got[0].fixedWords).toEqual(['수박']);
    expect(got[1].boss).toBe('final');
    // 11: 화산섬 첫 단계, 15: 중간 보스, 16: 보스 아님
    expect(got[2]).toMatchObject({ region: 'r2', name: '화산섬 상륙', intro: 'd_region2' });
    expect(got[2].pool).toEqual({ syllables: [3], tiers: ['plain', 'jong', 'tense'] }); // 11단계는 세 글자로 시작
    expect(got[3].boss).toBe('mid');
    expect(got[3].waves.flat().some((f) => f.kind === 'chief')).toBe(true);
    expect(got[4].boss).toBeUndefined();
    // 100·1000·10000: 10의 배수라 대형 보스
    for (const s of got.slice(5)) {
      expect(s.boss, s.id).toBe('final');
      expect(s.waves.flat().some((f) => f.kind === 'boss'), s.id).toBe(true);
    }
    expect(got[7].region).toBe('r1000');
  });
  it('5의 배수는 중간 보스, 10의 배수는 대형 보스, 나머지는 보스 없음', () => {
    for (let n = 11; n <= 130; n++) {
      const s = stageAt(n);
      const want = n % 10 === 0 ? 'final' : n % 5 === 0 ? 'mid' : undefined;
      expect(s.boss, s.id).toBe(want);
    }
  });
  it('같은 번호·시드면 늘 같은 전투, 시드가 다르면 달라진다', () => {
    for (const n of [11, 16, 100, 1000, 10000]) expect(JSON.stringify(generateStage(n, 7)), `${n}`).toBe(JSON.stringify(generateStage(n, 7)));
    const a = Array.from({ length: 40 }, (_, i) => JSON.stringify(generateStage(i + 21, 1).waves));
    const b = Array.from({ length: 40 }, (_, i) => JSON.stringify(generateStage(i + 21, 2).waves));
    expect(a.filter((x, i) => x !== b[i]).length).toBeGreaterThan(5);
  });
  it('난이도 상한: capAt 뒤로는 함정·콤보 여유·연출 크기·적 수가 더 오르지 않고, 보스 체력도 상한이 있다', () => {
    const cap = stageAt(GEN.capAt + 1);
    for (const n of [GEN.capAt + 1, 100, 999, 1001, 5555, 9999]) {
      const s = stageAt(n);
      expect(s.traps, s.id).toEqual(cap.traps);
      expect(s.comboScale, s.id).toBe(cap.comboScale);
      expect(s.fxScale, s.id).toBe(cap.fxScale);
      for (const w of s.waves) expect(w.length, s.id).toBeLessThanOrEqual(3);
    }
    for (const n of [20, 100, 1000, 10000]) expect(stageAt(n).waves.flat().find((f) => f.kind === 'boss')!.hp!, `${n}`).toBeLessThanOrEqual(12);
    for (const n of [15, 105, 1005, 9995]) expect(stageAt(n).waves.flat().find((f) => f.kind === 'chief')!.hp!, `${n}`).toBeLessThanOrEqual(9);
    // 함정 수는 11단계부터 늘다가 멈춘다
    expect(stageAt(11).traps.length).toBeLessThanOrEqual(cap.traps.length);
    expect(stageAt(10000).traps.length).toBe(cap.traps.length);
  });
  it('먼 단계도 어느 연령팩에서나 낼 단어가 충분하다', () => {
    for (let n = 11; n <= 200; n++) {
      const s = stageAt(n);
      for (const pack of ['4-6', '7-8'] as const) expect(stageWords(s, pack, false).length, `${s.id} ${pack}`).toBeGreaterThanOrEqual(MIN_STAGE_WORDS);
    }
  });
  it('지역은 10단계마다 바뀌고, 이름이 다 떨어지면 번호를 붙여 다시 돈다', () => {
    expect(regionAt(1).name).toBe('공룡 들판');
    expect(regionAt(2).name).toBe('화산섬');
    expect(regionAt(3).name).toBe('얼음 골짜기');
    expect(regionAt(10).name).toBe('화산섬 2');
    expect(regionAt(1000).id).toBe('r1000');
    expect(stageAt(21).region).toBe('r3');
  });
  it('이상한 번호는 막는다', () => {
    expect(stageById('s0')).toBeUndefined();
    expect(stageById('s100000')).toBeUndefined();
    expect(stageById('x5')).toBeUndefined();
    expect(stageById('s5')?.num).toBe(5);
  });
});
