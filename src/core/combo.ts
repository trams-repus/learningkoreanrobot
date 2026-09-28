// 속도 콤보. 정확히 조립하면 기본 공격은 늘 나가고, 보너스 시간 안에 완성하면 콤보가 오른다.
// 수치는 플레이테스트용 임시값이며 교육적 기준이 아니다.
export type HelpLevel = 'A' | 'B' | 'C' | 'D';

export const COMBO_CONFIG = {
  baseMs: 6000,
  perJamoMs: 2500,
  /** 도움 단계가 높을수록 여유를 더 준다 */
  levelScale: { A: 2, B: 1.6, C: 1.25, D: 1 } as Record<HelpLevel, number>,
  /** 이 콤보마다 필살기 */
  finisherEvery: 6,
  damage: { basic: 1, rapid: 1, missiles: 2, finisher: 3 },
};

export type AttackTier = 'basic' | 'rapid' | 'missiles' | 'finisher';

export function bonusTimeMs(jamoToPlace: number, level: HelpLevel, cfg = COMBO_CONFIG): number {
  return (cfg.baseMs + jamoToPlace * cfg.perJamoMs) * cfg.levelScale[level];
}

/** 이번 성공 뒤 콤보 수. 늦으면 속도 콤보만 끝나고(0) 공격은 그대로 나간다. */
export function nextCombo(prev: number, elapsedMs: number, bonusMs: number, speedEligible = true): number {
  if (!speedEligible) return prev; // 음성 재생 실패 등: 속도 평가에서 제외 (올리지도 끊지도 않음)
  return elapsedMs <= bonusMs ? prev + 1 : 0;
}

export function tierFor(combo: number, cfg = COMBO_CONFIG): AttackTier {
  if (combo >= cfg.finisherEvery && combo % cfg.finisherEvery === 0) return 'finisher';
  if (combo >= 4) return 'missiles';
  if (combo >= 2) return 'rapid';
  return 'basic';
}

export function damageFor(tier: AttackTier, cfg = COMBO_CONFIG): number {
  return cfg.damage[tier];
}

/**
 * 조합 시간 측정. 조작 가능한 시간만 잰다: 안내 음성·다시 듣기·일시정지·백그라운드는 빼고 잰다.
 */
export class ComboClock {
  private acc = 0;
  private since: number | null = null;
  private holds = new Set<string>();
  constructor(private now: () => number = () => performance.now()) {}

  start(): void {
    this.acc = 0;
    this.holds.clear();
    this.since = this.now();
  }

  /** 이유별로 멈춘다 (예: 'replay', 'pause'). 모든 이유가 풀려야 다시 흐른다. */
  hold(reason: string): void {
    if (this.since !== null) {
      this.acc += this.now() - this.since;
      this.since = null;
    }
    this.holds.add(reason);
  }

  release(reason: string): void {
    if (!this.holds.delete(reason)) return;
    if (this.holds.size === 0 && this.since === null && this.running) this.since = this.now();
  }

  private running = false;

  begin(): void {
    this.start();
    this.running = true;
  }

  stop(): number {
    const e = this.elapsed();
    this.running = false;
    this.since = null;
    return e;
  }

  elapsed(): number {
    return this.acc + (this.since !== null ? this.now() - this.since : 0);
  }

  get isRunning(): boolean {
    return this.running;
  }
}
