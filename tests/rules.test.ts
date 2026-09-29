import { describe, expect, it } from 'vitest';
import { canHold, cellsOf, checkFrame, chooseCell, distractorsFor, frameFor, jamoCount, pickTraps, requiredJamo, wordFrames, type TrapGrade } from '../src/core/assembly';
import { ADVANCED_GROUPS, TRAP_TABLES, TRAPS } from '../src/content/distractors';
import { VOCAB } from '../src/content/vocab';
import { isVowel } from '../src/hangul/hangul';
import { actorOf, createBattle, foeTurn, planTier, robotAttack, spawnWave, target, waveHp, weakForSpecial, BALANCE } from '../src/core/battle';
import { bonusTimeMs, ComboClock, COMBO_CONFIG, comboTimeMs, energyAfter, ENERGY_CONFIG, nextCombo, tierFor } from '../src/core/combo';
import { createRng } from '../src/core/rng';

describe('조립틀', () => {
  it('수 = ㅅ 위 ㅜ 아래, 박 = ㅂ ㅏ 위 ㄱ 아래', () => {
    const [su, bak] = wordFrames('수박')!;
    expect(su).toMatchObject({ cho: 'ㅅ', jung: 'ㅜ', jong: '', shape: 'horizontal', hasJong: false });
    expect(bak).toMatchObject({ cho: 'ㅂ', jung: 'ㅏ', jong: 'ㄱ', shape: 'vertical', hasJong: true });
    expect(requiredJamo(wordFrames('수박')!)).toEqual(['ㅅ', 'ㅜ', 'ㅂ', 'ㅏ', 'ㄱ']);
  });
  it('같은 자모가 여러 번 필요하면 그 수만큼 (바나나)', () => {
    const need = requiredJamo(wordFrames('바나나')!);
    expect(need.filter((j) => j === 'ㅏ')).toHaveLength(3);
    expect(jamoCount(wordFrames('바나나')!)).toBe(6);
  });
  it('겹받침은 아직 출제하지 않는다 (겹모음은 mixed 틀로 지원, 아래 테스트)', () => {
    expect(frameFor('닭')).toBeNull();
    expect(frameFor('a')).toBeNull();
  });
  it('모음은 중성 칸에만, 자음은 초성·종성 칸에만', () => {
    expect(canHold('jung', 'ㅏ')).toBe(true);
    expect(canHold('cho', 'ㅏ')).toBe(false);
    expect(canHold('jong', 'ㄱ')).toBe(true);
    expect(canHold('cho', 'ㄱ')).toBe(true);
    expect(canHold('jong', 'ㄸ')).toBe(false);
  });
  it('탭으로 넣을 칸: 역할에 맞는 빈칸 우선', () => {
    const bak = frameFor('박')!;
    expect(chooseCell(bak, {}, 'ㅂ', null)).toBe('cho');
    expect(chooseCell(bak, { cho: 'ㅂ' }, 'ㄱ', null)).toBe('jong');
    expect(chooseCell(bak, {}, 'ㅏ', 'cho')).toBe('jung');
    expect(chooseCell(bak, { cho: 'ㅂ' }, 'ㄱ', 'cho')).toBe('cho');
  });
  it('다 채우면 맞음/다른 글자를 알려준다', () => {
    const bak = frameFor('박')!;
    expect(checkFrame(bak, { cho: 'ㅂ', jung: 'ㅏ' })).toEqual({ kind: 'incomplete' });
    expect(checkFrame(bak, { cho: 'ㅂ', jung: 'ㅏ', jong: 'ㄱ' })).toEqual({ kind: 'correct', syllable: '박' });
    expect(checkFrame(bak, { cho: 'ㅂ', jung: 'ㅓ', jong: 'ㄱ' })).toEqual({ kind: 'different', made: '벅', wrongCells: ['jung'] });
  });
  it('방해 자모는 필요한 자모와 겹치지 않는다', () => {
    const need = requiredJamo(wordFrames('수박')!);
    const d = distractorsFor(need, 3, createRng(1));
    expect(d).toHaveLength(3);
    for (const j of d) expect(need).not.toContain(j);
  });
});

describe('단계별 함정 (쉬움·중간·어려움)', () => {
  const targetsOf = (w: string, i = 0) => {
    const f = wordFrames(w)![i];
    return cellsOf(f).map((role) => ({ jamo: f[role], role }));
  };
  it('표는 자음끼리·모음끼리이고, 어휘에 나오는 자모를 모두 다룬다', () => {
    for (const [k, t] of Object.entries(TRAPS)) {
      for (const g of ['easy', 'medium', 'hard'] as const) {
        for (const j of t[g]) {
          expect(j, `${k} ${g}`).not.toBe(k);
          expect(isVowel(j), `${k}→${j}`).toBe(isVowel(k));
        }
      }
    }
    for (const v of VOCAB) for (const j of requiredJamo(wordFrames(v.word)!)) expect(TRAPS[j], `${v.word} ${j}`).toBeDefined();
  });
  it('요청한 수만큼, 정답과 겹치지 않게 (정답만 주는 일은 없다)', () => {
    for (const v of VOCAB) {
      const frames = wordFrames(v.word)!;
      const all = requiredJamo(frames);
      frames.forEach((_, i) => {
        for (const grades of [['easy', 'easy'], ['easy', 'medium', 'hard'], ['hard', 'hard', 'medium', 'easy']] as TrapGrade[][]) {
          const d = pickTraps(targetsOf(v.word, i), all, grades, createRng(i + 3), TRAP_TABLES);
          expect(d, v.word).toHaveLength(grades.length);
          expect(new Set(d).size, v.word).toBe(d.length);
          for (const j of d) expect(all, v.word).not.toContain(j);
        }
      });
    }
  });
  it('수박의 "수": 쉬움은 모양이 확 다른 자모, 어려움은 ㅈ·ㅗ 같은 헷갈리는 짝', () => {
    const all = requiredJamo(wordFrames('수박')!);
    for (let seed = 1; seed <= 20; seed++) {
      const easy = pickTraps(targetsOf('수박'), all, ['easy', 'easy'], createRng(seed), TRAP_TABLES);
      for (const j of easy) expect([...TRAPS['ㅅ'].easy, ...TRAPS['ㅜ'].easy], `seed ${seed}`).toContain(j);
      // 자음 칸 하나, 모음 칸 하나를 겨냥한다
      expect(easy.filter((j) => isVowel(j)), `seed ${seed}`).toHaveLength(1);
      const hard = pickTraps(targetsOf('수박'), all, ['hard', 'hard'], createRng(seed), TRAP_TABLES);
      expect(hard.sort(), `seed ${seed}`).toEqual(['ㅈ', 'ㅗ'].sort());
    }
  });
  it('받침 칸의 어려움은 소리가 비슷한 받침 (예: 곰의 ㅁ → ㄴ·ㅇ)', () => {
    const all = requiredJamo(wordFrames('곰')!);
    const jongOnly = [{ jamo: 'ㅁ', role: 'jong' as const }];
    for (let seed = 1; seed <= 10; seed++) expect(['ㄴ', 'ㅇ']).toContain(pickTraps(jongOnly, all, ['hard'], createRng(seed), TRAP_TABLES)[0]);
  });
  it('아직 안 배운 쌍자음·ㅐ류는 단어에 같은 무리가 있을 때만 함정으로 나온다', () => {
    const adv = new Set(ADVANCED_GROUPS.flat());
    for (const w of ['수박', '나비', '사자', '고기', '가방', '바다']) {
      const frames = wordFrames(w)!;
      const all = requiredJamo(frames);
      for (let seed = 1; seed <= 15; seed++)
        frames.forEach((_, i) => {
          for (const j of pickTraps(targetsOf(w, i), all, ['hard', 'hard', 'medium', 'easy'], createRng(seed), TRAP_TABLES)) expect(adv.has(j), `${w} ${j}`).toBe(false);
        });
    }
    // 아빠: 쌍자음 무리가 있으니 ㅂ의 어려움으로 ㅃ가 아닌 ㅍ 등도 되고, 쌍자음도 허용
    const all = requiredJamo(wordFrames('꼬리')!);
    const d = pickTraps(targetsOf('꼬리'), all, ['hard', 'hard'], createRng(2), TRAP_TABLES);
    expect(d).toContain('ㄱ');
  });
});

describe('속도 콤보', () => {
  it('보너스 시간 = 기본 + 자모 수 × 자모당 시간, 도움 단계가 높을수록 여유', () => {
    expect(bonusTimeMs(5, 'D')).toBe(COMBO_CONFIG.baseMs + 5 * COMBO_CONFIG.perJamoMs);
    expect(bonusTimeMs(5, 'A')).toBeGreaterThan(bonusTimeMs(5, 'D'));
    // 전투별 여유 배율 (11단계부터 빠듯하게)
    expect(bonusTimeMs(5, 'D', 0.9)).toBeCloseTo(bonusTimeMs(5, 'D') * 0.9);
  });
  it('콤보 = 정확성 + 유효 시간: 함정을 넣었다 빼면 벌점, 한 번은 봐준다', () => {
    expect(comboTimeMs(10000, 0)).toBe(10000);
    expect(comboTimeMs(10000, 1)).toBe(10000);
    expect(comboTimeMs(10000, 3)).toBe(10000 + 2 * COMBO_CONFIG.wrongPlaceMs);
    // 빨리 끝내도 마구 끌어 넣으면 콤보가 끊길 수 있다 (정답 처리와는 무관)
    const bonus = bonusTimeMs(5, 'D');
    expect(nextCombo(2, comboTimeMs(bonus - 3000, 0), bonus)).toBe(3);
    expect(nextCombo(2, comboTimeMs(bonus - 3000, 4), bonus)).toBe(0);
  });
  it('시간 안이면 +1, 늦으면 콤보만 끝나고, 제외된 문제는 그대로', () => {
    expect(nextCombo(0, 1000, 5000)).toBe(1);
    expect(nextCombo(3, 1000, 5000)).toBe(4);
    expect(nextCombo(3, 6000, 5000)).toBe(0);
    expect(nextCombo(3, 6000, 5000, false)).toBe(3);
  });
  it('콤보 단계별 공격: 기본 → 연속 → 미사일 → 6콤보마다 필살기', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 11, 12].map((c) => tierFor(c))).toEqual([
      'basic', 'basic', 'rapid', 'rapid', 'missiles', 'missiles', 'finisher', 'missiles', 'missiles', 'finisher',
    ]);
    expect(BALANCE.attack.finisher.target).toBeGreaterThan(BALANCE.attack.basic.target);
    expect(BALANCE.attack.rapid.target).toBe(2); // 빨리 만들면 2연타
  });
  it('다시 듣기·일시정지 동안은 시간을 재지 않는다', () => {
    let t = 0;
    const c = new ComboClock(() => t);
    c.begin();
    t = 1000;
    c.hold('replay');
    t = 3000;
    c.hold('pause');
    c.release('replay');
    t = 9000;
    expect(c.elapsed()).toBe(1000);
    c.release('pause');
    t = 9500;
    expect(c.elapsed()).toBe(1500);
    expect(c.stop()).toBe(1500);
    expect(c.isRunning).toBe(false);
  });
});

describe('전투', () => {
  it('공격 한 번에 피해는 한 번만', () => {
    const s = createBattle();
    spawnWave(s, [{ kind: 'dino' }]);
    const [h] = robotAttack(s, 'basic');
    expect(h).toMatchObject({ damage: 1, hpAfter: BALANCE.foe.dino.hp - 1, defeated: false });
  });
  it('적은 준비 → 공격을 번갈아 하고, 체력 0이면 게임오버 대신 재가동', () => {
    const s = createBattle();
    const [c] = spawnWave(s, [{ kind: 'charger' }]);
    s.robotHp = 2;
    const first = foeTurn(s);
    expect(first[0]).toEqual({ type: 'foeAttack', id: c.id, damage: 2, hpAfter: 0, heavy: false });
    expect(first[1]).toEqual({ type: 'reboot', hpAfter: BALANCE.rebootHp });
    expect(foeTurn(s)).toEqual([{ type: 'foeCharge', id: c.id, level: 1, heavy: false }]);
    expect(s.rebootCount).toBe(1);
  });
  it('첫 수박 공룡은 피해를 주지 않는다', () => {
    const s = createBattle();
    spawnWave(s, [{ kind: 'dino', harmless: true }]);
    expect(foeTurn(s)[0]).toMatchObject({ type: 'foeAttack', damage: 0, hpAfter: BALANCE.robotMax });
  });
  it('여러 마리: 단일 공격은 앞의 적만, 범위 공격은 나머지에도', () => {
    const s = createBattle();
    const [a, b] = spawnWave(s, [{ kind: 'imp' }, { kind: 'dino' }]);
    expect(waveHp(s)).toEqual({ hp: 5, max: 5 });
    expect(robotAttack(s, 'basic').map((h) => h.id)).toEqual([a.id]);
    const hits = robotAttack(s, 'missiles');
    expect(hits.map((h) => [h.id, h.damage])).toEqual([[a.id, 2], [b.id, 1]]);
    expect(hits[0].defeated).toBe(true);
    // 앞의 적이 쓰러지면 다음 적을 겨눈다
    expect(target(s)?.id).toBe(b.id);
    expect(waveHp(s)).toEqual({ hp: 2, max: 5 });
  });
  it('여러 마리여도 한 차례에 한 마리만 움직인다 (공격 뒤 다음 적 차례)', () => {
    const s = createBattle();
    const [a, b] = spawnWave(s, [{ kind: 'imp' }, { kind: 'dino' }]);
    expect(foeTurn(s)).toMatchObject([{ type: 'foeAttack', id: a.id }]);
    expect(actorOf(s)?.id).toBe(b.id);
    expect(foeTurn(s)).toEqual([{ type: 'foeCharge', id: b.id, level: 1, heavy: false }]);
    expect(foeTurn(s)).toMatchObject([{ type: 'foeAttack', id: b.id }]);
  });
  it('강공격 적은 두 번 준비한 뒤 공격한다', () => {
    const s = createBattle();
    const [c] = spawnWave(s, [{ kind: 'chief' }]);
    expect(foeTurn(s)).toEqual([{ type: 'foeCharge', id: c.id, level: 2, heavy: true }]);
    expect(foeTurn(s)).toMatchObject([{ type: 'foeAttack', id: c.id, damage: BALANCE.foe.chief.damage, heavy: true }]);
  });
  it('방패가 먼저 막고 깨진다', () => {
    const s = createBattle();
    spawnWave(s, [{ kind: 'dino', shield: 2 }]);
    const [h] = robotAttack(s, 'rapid');
    expect(h).toMatchObject({ blocked: 2, shieldAfter: 0, hpAfter: BALANCE.foe.dino.hp });
    expect(robotAttack(s, 'basic')[0]).toMatchObject({ blocked: 0, hpAfter: BALANCE.foe.dino.hp - 1 });
  });
  it('보스를 쓰러뜨리는 일격은 마무리 필살기로 올라간다 (그 전에는 그대로)', () => {
    const s = createBattle();
    spawnWave(s, [{ kind: 'chief', hp: 3, finalBlow: 'finisher' }]);
    expect(planTier(s, 'basic')).toBe('basic');
    robotAttack(s, 'rapid');
    expect(planTier(s, 'basic')).toBe('finisher');
    const [h] = robotAttack(s, 'finisher');
    expect(h.defeated).toBe(true);
  });
  it('writeFinish: 약해진 보스는 직접 쓴 필살기 한 방이면 쓰러진다 (방패 포함)', () => {
    const s = createBattle();
    spawnWave(s, [{ kind: 'boss', hp: 8, shield: 2, writeFinish: 4 }]);
    expect(weakForSpecial(s)).toBeNull();
    robotAttack(s, 'rapid'); // 방패 2 깨짐
    robotAttack(s, 'rapid'); // 8 → 6
    expect(weakForSpecial(s)).toBeNull();
    robotAttack(s, 'rapid'); // 6 → 4
    expect(weakForSpecial(s)?.kind).toBe('boss');
    expect(robotAttack(s, 'ultimate')[0].defeated).toBe(true);
  });
});

describe('필살기 에너지', () => {
  it('빠를수록(공격 단계가 높을수록) 많이 차고, 느려도 1칸은 찬다. 가득 차면 더 늘지 않는다', () => {
    expect(energyAfter(0, 'basic')).toBe(1);
    expect(energyAfter(0, 'rapid')).toBeGreaterThan(energyAfter(0, 'basic'));
    expect(energyAfter(0, 'finisher')).toBeGreaterThanOrEqual(energyAfter(0, 'missiles'));
    expect(energyAfter(ENERGY_CONFIG.max - 1, 'finisher')).toBe(ENERGY_CONFIG.max);
    expect(energyAfter(ENERGY_CONFIG.max, 'ultimate')).toBe(ENERGY_CONFIG.max);
  });
  it('콤보 공격은 최고 필살기(ultimate)까지 올라가지 않는다: ultimate는 직접 쓰기 전용', () => {
    for (let c = 0; c <= 30; c++) expect(tierFor(c)).not.toBe('ultimate');
  });
});

import { isSupportedWord, wordFeatures as wf2, wordTier as wt2 } from '../src/core/assembly';

describe('겹모음 (ㅘ·ㅙ·ㅚ·ㅝ·ㅞ·ㅟ·ㅢ)', () => {
  it('겹모음 음절은 mixed 틀로 조립하고, 받침이 있어도 된다', () => {
    expect(frameFor('과')).toMatchObject({ cho: 'ㄱ', jung: 'ㅘ', jong: '', shape: 'mixed', hasJong: false });
    expect(frameFor('원')).toMatchObject({ cho: 'ㅇ', jung: 'ㅝ', jong: 'ㄴ', shape: 'mixed', hasJong: true });
    for (const w of ['사과', '돼지', '귀', '의자', '가위', '원숭이', '회사', '쥐']) expect(isSupportedWord(w), w).toBe(true);
  });
  it('겹모음 단어는 마지막 단계(compound)이고 더 어렵다', () => {
    expect(wt2('사과')).toBe('compound');
    expect(wt2('꽃')).toBe('tense');
    expect(wf2('돼지')!.hasCompoundVowel).toBe(true);
  });
  it('겹모음 함정: 겹모음 단어에만, 홑모음 단어에는 겹모음 함정이 나오지 않는다', () => {
    const rng = () => 0.3;
    const t = pickTraps([{ jamo: 'ㅘ', role: 'jung' }], ['ㅅ', 'ㅏ', 'ㄱ', 'ㅘ'], ['hard', 'medium'], rng, TRAP_TABLES);
    expect(t.length).toBe(2);
    for (let i = 0; i < 30; i++) {
      const r = pickTraps([{ jamo: 'ㅗ', role: 'jung' }, { jamo: 'ㅅ', role: 'cho' }], ['ㅅ', 'ㅗ'], ['hard', 'medium', 'easy', 'hard'], Math.random, TRAP_TABLES);
      for (const j of r) expect(['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']).not.toContain(j);
    }
  });
});
