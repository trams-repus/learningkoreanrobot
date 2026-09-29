# 인계 메모 (한글대작전)

2026-09-29, 브랜치 `claude/hangul-defender-work` (main에서 시작). main 병합·배포·스토어 제출은 하지 않았다. 자세한 진행은 `docs/production-status.md`.

## 지킬 것 (사용자 지시)
- 게임 이름 **한글대작전**. 아이 실명은 화면·스토어·문서에 넣지 않는다.
- 자모 입력은 **끌어넣기만** (탭으로 넣기 금지, e2e `tapInserted:false`가 검사).
- 단어 음성은 기기 TTS 기본, 녹음은 부모 설정 옵션.
- 광고·추적·분석 SDK 금지, 유료 서비스 가입 금지.
- `.github/workflows/` 변경은 `deploy/`에 두고 사용자에게 알린다.

## 이번 세션 결과 (마일스톤별 커밋)
| | 내용 |
|---|---|
| M1 | 출시 빌드(`npm run build:release`)에서 `?dev`·`?speed`·`window.__hd` 제거 + 번들 검사, 전투 구성 변경 시 기록 마이그레이션(원본 보존) |
| M2 | 명중 흐름(멈춤·명중 별·시간차 폭발), 콤보별 패턴, 갑옷 공룡, 마법소녀 연출. 로봇·공룡 모습과 기본 동작은 사용자 의견으로 예전(main) 것으로 되돌림 |
| M3 | 11단계부터 시드 생성기(재현 가능), 난이도 상한 61단계, 5·10단위 보스, 10단계마다 새 지역 |
| M4 | 결제: 비소모성 `hangul_all_stages` 하나(1~10단계 무료), 대기·확인·복원·보호자 확인. 실제 스토어 시험 전 |
| M5 | 음성: TTS 실패·무응답 → 녹음 파일, 단어 > 대사 > 효과음, 못 들은 오답은 기록 안 함 |
| M6 | 겹모음 조립·쓰기, 발음 판정, 어휘 3,012단어 (L1 700·L2 1,002·L3 1,310) 모두 그림 있음 |
| M7 | `android/`·`ios/` 저장소 관리(SDK 36), 자체 아이콘·스플래시·스토어 그래픽, 뒤로 가기, 라이선스 고지, BY-SA 녹음 제거 |

## 사용자가 해야 하는 것
1. **워크플로 교체**: `deploy/android-apk.yml` → `.github/workflows/android-apk.yml`. 지금 워크플로는 `npx cap add android`를 하는데 이 브랜치엔 `android/`가 있어 실패한다. 병합과 같이 바꿔야 한다.
2. CI에서 SDK 36·AGP 8.13.0 빌드가 되는지 확인 (이 환경은 dl.google.com이 막혀 Gradle 빌드 불가).
3. Play Console: 앱 등록, 인앱 상품 `hangul_all_stages` 생성·가격, 내부 테스트 트랙에서 구매·대기·복원 시험, 데이터 보안·콘텐츠 등급·가족 정책. 문구 초안 `docs/play-store.md`, 그림 `docs/store/`.
4. iOS는 macOS·Xcode·Apple 계정이 있을 때.

## 결정이 필요한 것
- 가격 (화면은 스토어 가격을 그대로 표시).
- 저장 키·녹음 DB 이름(`src/services/storage.ts`, `recordings.ts`)에 예전 이름이 남아 있다. 화면·스토어에는 안 보이지만 바꾸려면 기존 웹 사용자 기록을 옮기는 코드가 필요하다 (b51aa73에서 기록 유지를 위해 그대로 두기로 함). 빌드 산출물 이름·문서·다운로드 UA는 `hangul-daejakjeon`으로 바꿨다.

## 다음 작업 (추천 순서)
1. 실제 휴대폰 시험: 내부 테스트 AAB로 기기 TTS·결제·뒤로 가기·아이콘 확인.
2. 아이와 실제로 해 보고 어려운 단어·헷갈리는 그림 고르기 (`docs/production-status.md` M6 약한 그림 목록).
3. 새 단어가 필요하면 `docs/vocab-plan.md` 작업 순서대로. 그림은 `docs/picture-style.md`만 주면 여러 작업자가 나눠 그릴 수 있다.

## 확인 방법
```
npx tsc --noEmit && npx vitest run          # 단위 테스트 151개
npm run build && npx vite preview --port 4173 &
node e2e/play.mjs 360 && node e2e/play.mjs 390 && node e2e/purchase.mjs
npm run build:release && npm run e2e:release # 출시 빌드 검사
node scripts/picture-sheet.mjs out.png src/content/pictures/l1-food.ts   # 그림 검수 한 장
node scripts/make-icons.mjs; node scripts/make-licenses.mjs             # 아이콘·고지 다시 만들기
```
