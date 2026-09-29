# 단어 그림 스타일 가이드

게임 조합판 위 76×76px 칸(연한 크림색 `#fff7e0` 바탕)에 보이는 그림이다. 4~8세 아이가 **소리를 듣고 뜻을 확인**하는 용도라, 한눈에 무엇인지 알아야 한다. 기존 그림(`src/content/pictures.ts`)과 같은 그림체로 그린다.

## 형식
- SVG 속(inner)만 쓴다. `svgFor()`(`src/content/pictureKit.ts`)가 `viewBox="0 0 100 100"`과 바깥 `<g fill="none" stroke="#1d2340" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">`를 씌운다.
  - 따라서 **닫힌 도형에는 반드시 `fill`을 적는다** (안 적으면 속이 빈 선만 나온다).
  - 테두리 선은 기본(짙은 남색 3.5). 굵은 강조선만 `stroke-width="5"`~`7`.
- 좌표 0~100 안에서, 주인공이 가운데 오고 칸의 70~85%를 채운다. 가장자리 4 안쪽.
- 묶음 파일 모양:
  ```ts
  import { INK, SKIN, HL, dot, ring, face, person, stick, blob, sparkle, tube, moodFace, torso, cheeks, drop, halo } from '../pictureKit.ts';
  export const PICS: Record<string, string> = {
    사과: `<circle cx="50" cy="56" r="32" fill="#e8553d"/>...`,
  };
  ```
  키는 받은 목록의 단어 그대로(한글). 값은 SVG 조각 문자열.

## 그림체
- 납작한 단색 채움 + 짙은 남색 테두리. 그라디언트·필터·그림자 효과·사진풍 금지. 반투명은 볼 빨강·하이라이트 정도(opacity ≤ .6).
- 굵고 단순한 실루엣. 주요 도형 12개 안팎. 3 단위보다 작은 잔무늬는 76px에서 안 보이니 빼거나 키운다.
- 귀엽고 밝게. 무섭거나 아픈 표현, 피, 무기, 싸움 금지 (늑대·상어·악어도 웃는 얼굴 또는 차분한 모습).
- 팔레트(기존 그림에서): 빨강 `#e8553d` `#ff5c70`, 주황 `#ff9f1a` `#e8862e`, 노랑 `#ffd23f` `#ffc933`(HL) `#f2c14e`, 초록 `#43b04a` `#4caf50` `#3a9e47` `#5fc24a`, 파랑 `#3b8fe0` `#3b78e6` `#4a90e2` `#7ec8f0`, 보라 `#8e4fc9` `#a45cf0`, 분홍 `#e85d9a` `#ff9aa8`, 갈색 `#9a5b2e` `#6b3e26` `#5a3b24`, 살색 `SKIN`(#ffd6ad), 회색 `#8a96b0` `#dfe8f5`, 흰색 `#fff`.

## 반드시 지킬 것
- **글자 금지**: 한글·자모·영문·숫자·`<text>` 요소 금지. 간판·책 표지·화면에도 글자 없이 (선이나 도형으로). 철자를 알려 주면 게임이 망가진다.
- 이모지·상표·로고·실존 캐릭터 금지.
- 한 단어 한 뜻. 뜻이 여럿인 말은 받은 안내(hint)의 뜻으로만.

## 뜻이 추상적인 말
- **신체 부위**: `face()`나 `torso()` 위에 `ring(x, y, rx, ry)`(노란 점선 고리)로 그 부위를 표시 (기존 코·머리·어깨처럼).
- **행동(~다)**: `stick()` 막대 사람이나 `person()`으로 동작을 보여 주고, 움직임 선(`#9aa6c4` 얇은 선)·방향 화살표(`#3b78e6`)를 더한다.
- **상태(~다)**: 둘을 비교하거나(작은 것 옆 큰 것) 표정(`moodFace`)으로. 가리키는 쪽은 `ring()`이나 `sparkle()`로 강조.
- **사람·직업**: `person(x, y, s, look)` + 알아보기 쉬운 소품(청진기, 소방 헬멧, 요리사 모자).

## 도구 (`src/content/pictureKit.ts`)
- `dot(x, y, r?, fill?)` 채운 점 (눈) · `cheeks(y, dx?, cx?)` 볼 빨강 · `drop(x, y, s?)` 물방울
- `blob(fill, [[x,y,r], ...])` 원 여러 개를 한 덩어리로 (나무 잎·구름·털)
- `ring(x, y, rx, ry?)` 노란 점선 강조 고리 · `sparkle(x, y, r?, fill?)` 반짝이
- `face(extra)` 기본 얼굴(앞머리 짧게) · `moodFace(inner)` 표정 얼굴(눈·입은 inner로) · `torso(extra)` 머리+어깨+윗옷
- `stick(x, y, bodyPath, s?)` 막대 사람 (머리는 (x,y), bodyPath는 머리 기준 상대 좌표)
- `person(x, y, s, { hair, style: 'short'|'long'|'pony'|'bun'|'bald', shirt, beard?, mustache?, glasses?, cap? })` 사람 (x,y = 발밑 가운데, 어른 s≈1.3~1.7, 아이 s≈0.8~1)
- `halo(x, y, s)` 가리키는 사람 뒤 노란 빛 · `tube(d, fill, width)` 테두리 있는 굵은 선 (팔·손잡이)
- 상수: `INK`(선 색) `SKIN` `HL`(노랑 강조)

## 검수 방법
1. `node scripts/picture-sheet.mjs <출력.png> src/content/pictures/<묶음>.ts` → 큰 그림과 게임 크기(76px) 그림이 나란히 나온 한 장.
2. 76px 그림만 보고 무엇인지 바로 알 수 있는지 확인. 헷갈리면 고친다 (배경 요소 줄이기, 주인공 키우기, 색 대비).
3. `npx vitest run tests/pictures.test.ts` (글자 없음·태그 짝·숫자 이상 없음 검사).
