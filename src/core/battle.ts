// 전투 규칙 (화면과 분리된 순수 로직). 단어를 몇 개 추가해도 공격 코드는 늘지 않는다:
// 단어 → 공격 한 번, 콤보 단계 → 피해량과 연출 ID.
// 피해 계산은 공격 한 번에 한 번만 한다. 폭발 파티클은 연출일 뿐 피해를 주지 않는다.
import type { BattleEvent, BattleState, Foe, FoeKind, FoeSpawn } from './types';

export const BALANCE = {
  robotMax: 6,
  rebootHp: 4,
  foe: {
    dino: { hp: 3, damage: 1 },
    imp: { hp: 3, damage: 1 },
    charger: { hp: 4, damage: 2 },
    boss: { hp: 9, damage: 2 },
  } as Record<FoeKind, { hp: number; damage: number }>,
};

export function createBattle(): BattleState {
  return { robotHp: BALANCE.robotMax, robotMax: BALANCE.robotMax, foe: null, turn: 0, rebootCount: 0 };
}

export function spawnFoe(state: BattleState, s: FoeSpawn): Foe {
  const hp = s.hp ?? BALANCE.foe[s.kind].hp;
  // 등장하자마자 공격 준비 동작을 보여준다 (수박 장면 3번)
  state.foe = { kind: s.kind, hp, maxHp: hp, charging: true, harmless: s.harmless ?? false };
  return state.foe;
}

/** 로봇 공격 한 번. 피해는 여기서 한 번만 계산한다. */
export function robotAttack(state: BattleState, damage: number): BattleEvent {
  state.turn += 1;
  const f = state.foe;
  if (!f) return { type: 'hit', damage: 0, hpAfter: 0, defeated: true };
  f.hp = Math.max(0, f.hp - damage);
  const defeated = f.hp === 0;
  if (defeated) state.foe = null;
  return { type: 'hit', damage, hpAfter: f.hp, defeated };
}

/**
 * 적 차례. 조합하는 동안에는 부르지 않는다 (단어가 완성되어 공격한 뒤에만).
 * 준비 → 공격 → 준비 → 공격 … 로봇 체력이 0이 되면 게임오버 대신 재가동한다.
 */
export function foeTurn(state: BattleState): BattleEvent[] {
  const f = state.foe;
  if (!f) return [];
  if (!f.charging) {
    f.charging = true;
    return [{ type: 'foeCharge' }];
  }
  f.charging = false;
  const damage = f.harmless ? 0 : BALANCE.foe[f.kind].damage;
  state.robotHp = Math.max(0, state.robotHp - damage);
  const events: BattleEvent[] = [{ type: 'foeAttack', damage, hpAfter: state.robotHp }];
  if (state.robotHp === 0) {
    state.robotHp = BALANCE.rebootHp;
    state.rebootCount += 1;
    events.push({ type: 'reboot', hpAfter: state.robotHp });
  }
  return events;
}
