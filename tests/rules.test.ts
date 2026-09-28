import { describe, expect, it } from 'vitest';
import { canHold, checkFrame, chooseCell, distractorsFor, frameFor, jamoCount, requiredJamo, wordFrames } from '../src/core/assembly';
import { createBattle, foeTurn, robotAttack, spawnFoe, BALANCE } from '../src/core/battle';
import { bonusTimeMs, ComboClock, COMBO_CONFIG, damageFor, nextCombo, tierFor } from '../src/core/combo';
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
  it('복합모음·겹받침은 아직 출제하지 않는다', () => {
    expect(frameFor('과')).toBeNull();
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

describe('속도 콤보', () => {
  it('보너스 시간 = 기본 + 자모 수 × 자모당 시간, 도움 단계가 높을수록 여유', () => {
    expect(bonusTimeMs(5, 'D')).toBe(COMBO_CONFIG.baseMs + 5 * COMBO_CONFIG.perJamoMs);
    expect(bonusTimeMs(5, 'A')).toBeGreaterThan(bonusTimeMs(5, 'D'));
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
    expect(damageFor('finisher')).toBeGreaterThan(damageFor('basic'));
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
    spawnFoe(s, { kind: 'dino' });
    const e = robotAttack(s, 1);
    expect(e).toEqual({ type: 'hit', damage: 1, hpAfter: BALANCE.foe.dino.hp - 1, defeated: false });
  });
  it('적은 준비 → 공격을 번갈아 하고, 체력 0이면 게임오버 대신 재가동', () => {
    const s = createBattle();
    spawnFoe(s, { kind: 'charger' });
    s.robotHp = 2;
    const first = foeTurn(s);
    expect(first[0]).toEqual({ type: 'foeAttack', damage: 2, hpAfter: 0 });
    expect(first[1]).toEqual({ type: 'reboot', hpAfter: BALANCE.rebootHp });
    expect(foeTurn(s)).toEqual([{ type: 'foeCharge' }]);
    expect(s.rebootCount).toBe(1);
  });
  it('첫 수박 공룡은 피해를 주지 않는다', () => {
    const s = createBattle();
    spawnFoe(s, { kind: 'dino', harmless: true });
    expect(foeTurn(s)[0]).toEqual({ type: 'foeAttack', damage: 0, hpAfter: BALANCE.robotMax });
  });
});
