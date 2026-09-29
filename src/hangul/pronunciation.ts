// 소리와 표기가 다른 단어 찾기 (새 어휘를 넣을 때 soundMatchesSpelling을 잘못 적지 않게).
// 들은 소리로 조립하는 게임이라, 들리는 대로 쓰면 틀리는 단어는 초기 독립 조합에서 뒤로 미룬다.
// 규칙으로 잡는 것: 연음, 받침 소리 바뀜(대표음), 된소리되기(받침 ㄱ·ㄷ·ㅂ 뒤), 비음화, 유음화, ㅎ 거센소리, ㅖ→ㅔ, ㅢ→ㅣ.
// 규칙으로 못 잡는 것: 합성어 사이 된소리(김밥[김빱], 장난감[장난깜], 발가락[발까락]) → vocab에 직접 false로 적는다.
import { decomposeSyllable } from './hangul';

/** 받침이 단어 끝이나 자음 앞에서 내는 대표음 */
const NEUTRAL: Record<string, string> = { ㄱ: 'ㄱ', ㄲ: 'ㄱ', ㅋ: 'ㄱ', ㄴ: 'ㄴ', ㄷ: 'ㄷ', ㅅ: 'ㄷ', ㅆ: 'ㄷ', ㅈ: 'ㄷ', ㅊ: 'ㄷ', ㅌ: 'ㄷ', ㅎ: 'ㄷ', ㄹ: 'ㄹ', ㅁ: 'ㅁ', ㅂ: 'ㅂ', ㅍ: 'ㅂ', ㅇ: 'ㅇ' };
const OBSTRUENT_START = new Set(['ㄱ', 'ㄷ', 'ㅂ', 'ㅅ', 'ㅈ']);
const NASAL_START = new Set(['ㄴ', 'ㅁ']);

/** 소리와 표기가 달라지는 까닭 (없으면 빈 목록) */
export function soundChanges(word: string): string[] {
  const js = Array.from(word).map(decomposeSyllable);
  if (js.some((j) => !j)) return ['한글 음절이 아님'];
  const out = new Set<string>();
  js.forEach((j, i) => {
    const next = js[i + 1];
    // ㅖ는 ㅇ·ㄹ 뒤가 아니면 [ㅔ] (시계[시게], 계란[게란])
    if (j!.jung === 'ㅖ' && j!.cho !== 'ㅇ' && j!.cho !== 'ㄹ') out.add('ㅖ→ㅔ');
    // ㅢ는 첫소리 ㅇ의 첫 음절이 아니면 [ㅣ]·[ㅔ] (희망[히망], 회의[회이])
    if (j!.jung === 'ㅢ' && (j!.cho !== 'ㅇ' || i > 0)) out.add('ㅢ→ㅣ');
    const jong = j!.jong;
    if (!jong) return;
    if (next && next.cho === 'ㅇ') {
      if (jong !== 'ㅇ') out.add('연음');
      return;
    }
    const n = NEUTRAL[jong];
    if (n !== jong) out.add('받침 소리 바뀜');
    if (!next) return;
    // 거센소리 (축하[추카]). ㄴ·ㅁ·ㅇ·ㄹ 뒤 ㅎ은 표준 발음에서 그대로 소리 난다 (조용하다·전화)
    if (jong === 'ㅎ' || (next.cho === 'ㅎ' && ['ㄱ', 'ㄷ', 'ㅂ', 'ㅈ'].includes(jong))) out.add('ㅎ 소리 바뀜');
    if (['ㄱ', 'ㄷ', 'ㅂ'].includes(n) && OBSTRUENT_START.has(next.cho)) out.add('된소리');
    if (['ㄱ', 'ㄷ', 'ㅂ'].includes(n) && NASAL_START.has(next.cho)) out.add('비음화');
    if ((n === 'ㅁ' || n === 'ㅇ') && next.cho === 'ㄹ') out.add('비음화');
    if ((n === 'ㄴ' && next.cho === 'ㄹ') || (n === 'ㄹ' && next.cho === 'ㄴ')) out.add('유음화');
  });
  return [...out];
}

/** 합성어 사이 된소리처럼 규칙으로 못 잡는 단어 (사전 발음 기준으로 직접 적는다) */
export const SOUND_EXCEPTIONS = new Set([
  '김밥', '장난감', '발가락', '손가락', '눈사람', '물감', '비빔밥', '콧물', '빗자루', '냇물', '바닷가', '햇빛', '등불', '손등', '문고리', '물고기', '술래잡기', '산길', '밤길', '눈동자', '길가', '떡볶이',
  '보름달', '밀가루', '안개', '초등학교', '손수건', '떡국', '물병', '술병', '눈썰매', '강가', '문구', '돌담',
  '물방울', '코뿔소', '빵집', '열쇠',
  // 2026-09-29 L1 추가분
  '손바닥', '발바닥', '물개', '손전등', '빨대', '솔방울',
  // 한자어 된소리 (과·건·권·점 등)
  '치과',
  // 한자어 ㄹ 받침 뒤 ㅅ 된소리
  '경찰서', '마술사',
  // 2026-09-29 L2 추가분 (합성어·한자어 된소리, ㄴ 첨가)
  '신발가게', '과일가게', '채소가게', '생선가게', '아이스크림가게', '안경점', '철물점', '안과', '문방구',
  '열쇠고리', '줄자', '손가방', '손수레', '일기장', '계산대', '골대', '된장국', '벌새', '말벌', '하늘소',
  '종달새', '지휘봉', '화물열차', '고속열차', '보건실', '초승달', '물결',
]);

export function soundDiffers(word: string): boolean {
  return soundChanges(word).length > 0 || SOUND_EXCEPTIONS.has(word);
}
