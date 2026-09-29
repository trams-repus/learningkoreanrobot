/** armor = 갑옷 공룡(방패를 두르고 나온다), chief = 중간 보스(대장 뿔공룡), boss = 최종 보스(거대 공룡) */
export type FoeKind = 'dino' | 'imp' | 'charger' | 'armor' | 'chief' | 'boss';

export type AttackTier = 'basic' | 'rapid' | 'missiles' | 'finisher' | 'ultimate';

export interface Foe {
  /** 한 전투 안에서 고유한 번호 (화면의 적 그림과 짝) */
  id: number;
  kind: FoeKind;
  hp: number;
  maxHp: number;
  /** 모은 공격 준비 횟수. chargeTurns에 닿으면 다음 차례에 공격한다. */
  charge: number;
  /** 공격 전에 준비하는 차례 수 (1 = 준비 → 공격, 2 = 강공격: 준비 → 준비 → 공격) */
  chargeTurns: number;
  /** 튜토리얼 적: 준비 동작만 하고 피해를 주지 않는다 */
  harmless: boolean;
  /** 방패: 먼저 피해를 막고 깨진다 */
  shield: number;
  /** 이 적을 쓰러뜨리는 공격은 적어도 이 단계로 나간다 (보스 마무리 필살기) */
  finalBlow?: AttackTier;
  /** 체력(+방패)이 이 값 이하로 약해지면 필살기 에너지를 가득 채워, 직접 쓴 필살기로 마무리하게 한다 */
  writeFinish?: number;
}

export interface FoeSpawn {
  kind: FoeKind;
  hp?: number;
  harmless?: boolean;
  shield?: number;
  finalBlow?: AttackTier;
  writeFinish?: number;
}

export interface BattleState {
  robotHp: number;
  robotMax: number;
  /** 지금 화면에 나온 적 무리 (쓰러진 적은 뺀다). 앞의 적이 조준 대상이다. */
  foes: Foe[];
  /** 적이 여럿이면 한 차례에 한 마리만 움직인다: 다음에 움직일 적 */
  actor: number;
  /** 무리 전체 체력(방패 포함) 처음 값: 적 체력 막대의 기준 */
  waveMax: number;
  nextId: number;
  turn: number;
  rebootCount: number;
}

export interface Hit {
  id: number;
  damage: number;
  /** 방패가 막은 양 */
  blocked: number;
  shieldAfter: number;
  hpAfter: number;
  defeated: boolean;
}

export type BattleEvent =
  | { type: 'foeCharge'; id: number; level: number; heavy: boolean }
  | { type: 'foeAttack'; id: number; damage: number; hpAfter: number; heavy: boolean }
  | { type: 'reboot'; hpAfter: number };
