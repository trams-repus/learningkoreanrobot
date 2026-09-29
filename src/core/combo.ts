// 속도 콤보 = 정확성 + 유효 조작 시간. 정확히 조립하면 기본 공격은 늘 나가고, 보너스 시간 안에 완성하면 콤보가 오른다.
// 잘못된 자모를 넣었다 빼기를 되풀이하면 그만큼 시간 벌점이 붙어 보너스가 조금 줄지만, 정답 처리는 그대로다
// (마구 끌어 넣기가 유리하지 않게, 2026-09-28 사용자 지시 11절). 수치는 플레이테스트용 임시값이며 교육적 기준이 아니다.
import type { AttackTier } from './types';

export type HelpLevel = 'A' | 'B' | 'C' | 'D';
export type { AttackTier };

export const COMBO_CONFIG = {
  baseMs: 6000,
  perJamoMs: 2500,
  /** 도움 단계가 높을수록 여유를 더 준다 */
  levelScale: { A: 2, B: 1.6, C: 1.25, D: 1 } as Record<HelpLevel, number>,
  /** 잘못 넣은 자모 하나마다 콤보 시간에 더하는 벌점 */
  wrongPlaceMs: 2000,
  /** 이만큼은 벌점 없이 봐준다 (한 번 헷갈리는 건 괜찮다) */
  freeWrongPlaces: 1,
  /** 이 콤보마다 필살기 */
  finisherEvery: 6,
};

/**
 * 필살기 에너지: 단어를 완성할 때마다 차고, 빠를수록(콤보 공격 단계가 높을수록) 많이 찬다.
 * 가득 차면 다음 단어는 끌어 넣기 대신 손가락으로 직접 따라 써서 최고 필살기를 쏜다 (2026-09-28 사용자 지시).
 * 느려도 1칸은 찬다. 수치는 플레이테스트용 임시값.
 */
export const ENERGY_CONFIG = {
  max: 6,
  gain: { basic: 1, rapid: 2, missiles: 2, finisher: 3, ultimate: 0 } as Record<AttackTier, number>,
  /** 필살기로 쓸 단어의 최대 획 수 (넘으면 획이 가장 적은 단어) */
  maxStrokes: 12,
};

export function energyAfter(energy: number, tier: AttackTier, cfg = ENERGY_CONFIG): number {
  return Math.min(cfg.max, Math.max(0, energy) + cfg.gain[tier]);
}

/** 보너스 시간. stageScale은 전투별 여유 (1보다 작으면 빠듯하다: 11단계 이후 콤보 목표 시간 단축) */
export function bonusTimeMs(jamoToPlace: number, level: HelpLevel, stageScale = 1, cfg = COMBO_CONFIG): number {
  return (cfg.baseMs + jamoToPlace * cfg.perJamoMs) * cfg.levelScale[level] * stageScale;
}

/** 콤보 판정에 쓰는 시간: 유효 조작 시간 + 잘못 넣은 자모 벌점 */
export function comboTimeMs(elapsedMs: number, wrongPlaces: number, cfg = COMBO_CONFIG): number {
  return elapsedMs + Math.max(0, wrongPlaces - cfg.freeWrongPlaces) * cfg.wrongPlaceMs;
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
