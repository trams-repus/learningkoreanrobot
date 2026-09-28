// 어휘팩. '핵심/권장'은 이 게임 내부의 선정 기준이며 공식 지정 목록이 아니다.
// 공식 어휘 등급(국립국어원 기초 어휘 목록, 한국어기초사전 등급)은 officialGrade에 따로 두고,
// 아직 대조하지 못했으므로 모두 null + sourceStatus '임시 선정'이다.
// 음절·자모 분해는 직접 적지 않고 hangul.ts가 계산한다 (tests/vocab.test.ts가 분해→재조합을 검사).

export type PackId = '4-6' | '7-8';
export type Tier = 'core' | 'recommended';
export type Domain = '가족' | '신체' | '음식' | '동물' | '생활용품' | '장소' | '자연' | '행동' | '상태';

export interface VocabEntry {
  id: string;
  word: string;
  pack: PackId;
  tier: Tier;
  domain: Domain;
  /** 음원 목록(audio manifest)의 단어 음성 ID */
  wordAudioId: string;
  /** 게임 내부 선정 근거와 확인 상태 */
  source: string;
  sourceStatus: '임시 선정' | '대조 완료';
  /** 공식 자료 등급 (확인 전이면 null). 아동 연령 등급으로 바꿔 쓰지 않는다. */
  officialGrade: string | null;
  /** 소리와 표기가 거의 같은가 (학교→[학꾜] 같은 단어는 초기 독립 조합에서 피한다) */
  soundMatchesSpelling: boolean;
}

const PENDING = '게임 내부 임시 선정 (공식 목록 대조 전)';

function v(word: string, pack: PackId, tier: Tier, domain: Domain, soundMatchesSpelling = true): VocabEntry {
  return {
    id: word,
    word,
    pack,
    tier,
    domain,
    wordAudioId: `w_${word}`,
    source: PENDING,
    sourceStatus: '임시 선정',
    officialGrade: null,
    soundMatchesSpelling,
  };
}

export const VOCAB: VocabEntry[] = [
  // 4~6세 팩
  v('수박', '4-6', 'core', '음식'),
  v('나무', '4-6', 'core', '자연'),
  v('바다', '4-6', 'core', '자연'),
  v('모자', '4-6', 'core', '생활용품'),
  v('오이', '4-6', 'core', '음식'),
  v('우유', '4-6', 'core', '음식'),
  v('가방', '4-6', 'core', '생활용품'),
  v('아기', '4-6', 'core', '가족'),
  v('엄마', '4-6', 'core', '가족'),
  v('아빠', '4-6', 'core', '가족'),
  v('다리', '4-6', 'core', '신체'),
  v('집', '4-6', 'core', '장소'),
  v('바나나', '4-6', 'recommended', '음식'),
  v('머리', '4-6', 'recommended', '신체'),
  v('사자', '4-6', 'recommended', '동물'),
  v('꼬리', '4-6', 'recommended', '신체'),
  v('나비', '4-6', 'recommended', '동물'),
  v('개미', '4-6', 'recommended', '동물'),
  v('자다', '4-6', 'recommended', '행동'),
  v('크다', '4-6', 'recommended', '상태'),
  // 7~8세 팩
  v('연필', '7-8', 'core', '생활용품'),
  v('공책', '7-8', 'core', '생활용품'),
  v('가족', '7-8', 'core', '가족'),
  v('친구', '7-8', 'core', '가족'),
  v('동생', '7-8', 'core', '가족'),
  v('어깨', '7-8', 'core', '신체'),
  v('감자', '7-8', 'core', '음식'),
  v('당근', '7-8', 'core', '음식'),
  v('토끼', '7-8', 'core', '동물'),
  v('하늘', '7-8', 'core', '자연'),
  v('시장', '7-8', 'core', '장소'),
  v('달리다', '7-8', 'core', '행동'),
  v('할머니', '7-8', 'recommended', '가족'),
  v('사탕', '7-8', 'recommended', '음식'),
  v('거북', '7-8', 'recommended', '동물'),
  v('호랑이', '7-8', 'recommended', '동물'),
  v('구름', '7-8', 'recommended', '자연'),
  v('바람', '7-8', 'recommended', '자연'),
  v('그리다', '7-8', 'recommended', '행동'),
  v('기쁘다', '7-8', 'recommended', '상태'),
];

/**
 * 2단계 쉬운 단어 5개 (+수박): 받침·쌍자음·ㅐ 없는 두 글자이고 실제 녹음 음원 목록에 있는 단어.
 * 녹음이 있다는 이유만으로 쉬운 단어가 되지는 않는다 (꼬리·개미·바나나는 뒤 단계에서 낸다).
 */
export const EASY_FIVE = ['나무', '바다', '나비', '사자', '다리'];

export function vocabById(id: string): VocabEntry | undefined {
  return VOCAB.find((x) => x.id === id);
}

export function packWords(pack: PackId, includeRecommended: boolean): VocabEntry[] {
  return VOCAB.filter((x) => x.pack === pack && (includeRecommended || x.tier === 'core'));
}
