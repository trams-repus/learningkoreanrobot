// 자동 생성 (scripts/register-words.mjs): 검수를 마치고 등록한 그림 묶음만 가져온다.
import { PICS as L1B_ANIMALS } from './pictures/l1b-animals.ts';
import { PICS as L1B_FOOD } from './pictures/l1b-food.ts';
import { PICS as L1B_THINGS1 } from './pictures/l1b-things1.ts';
import { PICS as L1B_THINGS2 } from './pictures/l1b-things2.ts';
import { PICS as L1B_VEHICLES_PLACES } from './pictures/l1b-vehicles-places.ts';
import { PICS as L1B_STATES } from './pictures/l1b-states.ts';
import { PICS as L1B_BODY_ACTIONS } from './pictures/l1b-body-actions.ts';
import { PICS as L1B_NATURE_PEOPLE } from './pictures/l1b-nature-people.ts';

export const REGISTERED_PICS: Record<string, string> = Object.assign({}, L1B_ANIMALS, L1B_FOOD, L1B_THINGS1, L1B_THINGS2, L1B_VEHICLES_PLACES, L1B_STATES, L1B_BODY_ACTIONS, L1B_NATURE_PEOPLE);
