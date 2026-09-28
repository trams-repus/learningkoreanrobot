export type FoeKind = 'dino' | 'imp' | 'charger' | 'boss';

export interface Foe {
  kind: FoeKind;
  hp: number;
  maxHp: number;
  /** 공격을 준비 중인가 (다음 적 차례에 공격한다) */
  charging: boolean;
  /** 튜토리얼 적: 준비 동작만 하고 피해를 주지 않는다 */
  harmless: boolean;
}

export interface FoeSpawn {
  kind: FoeKind;
  hp?: number;
  harmless?: boolean;
}

export interface BattleState {
  robotHp: number;
  robotMax: number;
  foe: Foe | null;
  turn: number;
  rebootCount: number;
}

export type BattleEvent =
  | { type: 'hit'; damage: number; hpAfter: number; defeated: boolean }
  | { type: 'foeCharge' }
  | { type: 'foeAttack'; damage: number; hpAfter: number }
  | { type: 'reboot'; hpAfter: number };
