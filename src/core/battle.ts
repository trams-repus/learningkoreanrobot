// 전투 규칙 (화면과 분리된 순수 로직). 단어를 몇 개 추가해도 공격 코드는 늘지 않는다:
// 단어 → 공격 한 번, 콤보 단계 → 피해량과 연출 ID.
// 피해 계산은 공격 한 번에 한 번만 한다. 폭발 파티클은 연출일 뿐 피해를 주지 않는다.
// 적은 무리(최대 3마리)로 나온다. 한 번에 한 마리만 공격 차례를 가져 여럿이어도 피해가 몰리지 않는다.
import type { AttackTier, BattleEvent, BattleState, Foe, FoeKind, FoeSpawn, Hit } from './types';

/** 수치는 플레이테스트용 임시값 */
export const BALANCE = {
  robotMax: 6,
  rebootHp: 4,
  foe: {
    dino: { hp: 3, damage: 1, chargeTurns: 1 },
    imp: { hp: 2, damage: 1, chargeTurns: 1 },
    charger: { hp: 4, damage: 2, chargeTurns: 1 },
    chief: { hp: 7, damage: 2, chargeTurns: 2 },
    boss: { hp: 10, damage: 2, chargeTurns: 2 },
  } as Record<FoeKind, { hp: number; damage: number; chargeTurns: number }>,
  /** 공격 단계별 피해: 조준한 적(target)과 나머지 적(others, 범위 공격) */
  attack: {
    basic: { target: 1, others: 0 },
    rapid: { target: 2, others: 0 },
    missiles: { target: 2, others: 1 },
    finisher: { target: 3, others: 2 },
    ultimate: { target: 8, others: 8 },
  } as Record<AttackTier, { target: number; others: number }>,
};

const TIER_ORDER: AttackTier[] = ['basic', 'rapid', 'missiles', 'finisher', 'ultimate'];

export function strongerTier(a: AttackTier, b: AttackTier | undefined): AttackTier {
  if (!b) return a;
  return TIER_ORDER.indexOf(b) > TIER_ORDER.indexOf(a) ? b : a;
}

export function isAreaTier(t: AttackTier): boolean {
  return BALANCE.attack[t].others > 0;
}

export function createBattle(): BattleState {
  return { robotHp: BALANCE.robotMax, robotMax: BALANCE.robotMax, foes: [], actor: 0, waveMax: 1, nextId: 1, turn: 0, rebootCount: 0 };
}

/** 적 무리 등장. 첫 적은 등장하자마자 공격 준비 동작을 보여 준다 (수박 장면 3번). */
export function spawnWave(state: BattleState, wave: FoeSpawn[]): Foe[] {
  state.foes = wave.map((s, i) => {
    const b = BALANCE.foe[s.kind];
    const hp = s.hp ?? b.hp;
    return { id: state.nextId++, kind: s.kind, hp, maxHp: hp, charge: i === 0 ? 1 : 0, chargeTurns: b.chargeTurns, harmless: s.harmless ?? false, shield: s.shield ?? 0, finalBlow: s.finalBlow };
  });
  state.actor = 0;
  state.waveMax = Math.max(1, waveHp(state).hp);
  return state.foes;
}

export function target(state: BattleState): Foe | null {
  return state.foes[0] ?? null;
}

export function waveHp(state: BattleState): { hp: number; max: number } {
  return { hp: state.foes.reduce((a, f) => a + f.hp + f.shield, 0), max: state.waveMax };
}

function damageFoe(f: Foe, dmg: number): Hit {
  const blocked = Math.min(f.shield, dmg);
  f.shield -= blocked;
  f.hp = Math.max(0, f.hp - (dmg - blocked));
  return { id: f.id, damage: dmg, blocked, shieldAfter: f.shield, hpAfter: f.hp, defeated: f.hp === 0 };
}

/**
 * 공격 단계 결정: 조준한 적을 쓰러뜨릴 공격이면 그 적의 마무리 단계(finalBlow)로 올린다.
 * 보스는 마지막 일격이 늘 필살기라, 콤보가 낮은 아이도 최소 한 번은 필살기를 본다.
 */
export function planTier(state: BattleState, tier: AttackTier): AttackTier {
  const t = target(state);
  if (!t?.finalBlow) return tier;
  const lethal = BALANCE.attack[tier].target >= t.hp + t.shield;
  return lethal ? strongerTier(tier, t.finalBlow) : tier;
}

/** 로봇 공격 한 번. 피해는 여기서 한 번만 계산한다. 쓰러진 적은 무리에서 뺀다. */
export function robotAttack(state: BattleState, tier: AttackTier): Hit[] {
  state.turn += 1;
  const [t, ...rest] = state.foes;
  if (!t) return [];
  const d = BALANCE.attack[tier];
  const hits = [damageFoe(t, d.target), ...(d.others > 0 ? rest.map((f) => damageFoe(f, d.others)) : [])];
  const actorId = state.foes[state.actor % Math.max(1, state.foes.length)]?.id;
  state.foes = state.foes.filter((f) => f.hp > 0);
  const i = state.foes.findIndex((f) => f.id === actorId);
  state.actor = i >= 0 ? i : 0;
  return hits;
}

/** 다음에 움직일 적 (준비 표시를 이 적에만 띄운다) */
export function actorOf(state: BattleState): Foe | null {
  return state.foes.length ? state.foes[state.actor % state.foes.length] : null;
}

/**
 * 적 차례. 조합하는 동안에는 부르지 않는다 (단어가 완성되어 공격한 뒤에만).
 * 준비 → 공격 (강공격 적은 준비 → 준비 → 공격). 공격한 뒤에는 다음 적 차례가 된다.
 * 로봇 체력이 0이 되면 게임오버 대신 재가동한다.
 */
export function foeTurn(state: BattleState): BattleEvent[] {
  const f = actorOf(state);
  if (!f) return [];
  const heavy = f.chargeTurns > 1;
  if (f.charge < f.chargeTurns) {
    f.charge += 1;
    return [{ type: 'foeCharge', id: f.id, level: f.charge, heavy }];
  }
  f.charge = 0;
  state.actor = (state.actor + 1) % state.foes.length;
  const damage = f.harmless ? 0 : BALANCE.foe[f.kind].damage;
  state.robotHp = Math.max(0, state.robotHp - damage);
  const events: BattleEvent[] = [{ type: 'foeAttack', id: f.id, damage, hpAfter: state.robotHp, heavy }];
  if (state.robotHp === 0) {
    state.robotHp = BALANCE.rebootHp;
    state.rebootCount += 1;
    events.push({ type: 'reboot', hpAfter: state.robotHp });
  }
  return events;
}
