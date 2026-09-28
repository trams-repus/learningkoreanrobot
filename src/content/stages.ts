// 전투 목록. 적은 한 번에 한 마리 (대각선 대치 구도).
import type { FoeSpawn } from '../core/types';
import { EASY_FIVE } from './vocab';

export interface StageDef {
  id: string;
  name: string;
  icon: 'dino' | 'imp' | 'charger' | 'boss';
  foes: FoeSpawn[];
  /** 고정 출제 순서 (있으면 이 순서대로) */
  fixedWords?: string[];
  /** 출제 후보: 'pack'이면 부모 설정의 연령팩 */
  pool: string[] | 'pack';
  boss?: boolean;
}

export const STAGES: StageDef[] = [
  {
    id: 's1',
    name: '첫 출동: 수박',
    icon: 'dino',
    foes: [{ kind: 'dino', harmless: true }],
    fixedWords: ['수박', '수박', '수박'],
    pool: ['수박'],
  },
  {
    id: 's2',
    name: '쉬운 단어 다섯',
    icon: 'imp',
    foes: [{ kind: 'imp' }, { kind: 'dino' }],
    pool: ['수박', ...EASY_FIVE],
  },
  {
    id: 's3',
    name: '뿔공룡 습격',
    icon: 'charger',
    foes: [{ kind: 'dino' }, { kind: 'charger' }],
    pool: 'pack',
  },
  {
    id: 's4',
    name: '거대 공룡',
    icon: 'boss',
    boss: true,
    foes: [{ kind: 'boss' }],
    pool: 'pack',
  },
];

export function stageById(id: string): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}
