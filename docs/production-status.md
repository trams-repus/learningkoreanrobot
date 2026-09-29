# 출시 진행 현황

작업 브랜치: `claude/hangul-defender-work` (main 병합·배포·스토어 제출은 하지 않음). 마일스톤마다 갱신한다.

| 마일스톤 | 상태 | 요약 |
|---|---|---|
| M1 출시 차단 | 완료 | 출시 빌드에서 개발 옵션 제거, 전투 구성 변경 시 기록 마이그레이션 + 원본 보존, 저장 실패 표시 |
| M2 전투 개선 | 예정 | |
| M3 무한 진행 | 예정 | |
| M4 결제 | 예정 | |
| M5 음성 신뢰성 | 예정 | |
| M6 어휘와 그림 | 예정 | |
| M7 출시 경로 | 예정 | |

## M1 출시 차단

- 빌드 두 가지
  - `npm run build`: 테스트 주소(Pages)·e2e용. `?dev=1`(전투 전부 열기, 부모 문 0.2초), `?speed=`, `?voice=off`, `window.__hd`가 동작한다.
  - `npm run build:release`: 스토어·앱용. 위 옵션을 읽는 코드 자체가 번들에서 빠지고, `scripts/check-release.mjs`가 남았는지 검사해 남으면 빌드를 실패시킨다.
- `npm run e2e:release`: 출시 빌드를 브라우저로 열어 `?dev=1&speed=8&voice=off`가 먹지 않는지 확인 (`__hd` 없음, 2단계부터 잠김).
- 안드로이드 워크플로는 출시 빌드를 써야 한다 → **`deploy/android-apk.yml`을 `.github/workflows/android-apk.yml`에 덮어 커밋해야 적용된다** (바뀐 줄은 `npm run build` → `npm run build:release` 하나).
- 저장
  - 전투 구성(`STAGE_SET`)이 바뀌어도 깬 기록을 지우지 않는다. `STAGE_STEPS`(구성 n → n+1 표)로 옮긴다. 대응이 애매하면 앞 단계로 붙인다.
    - stageSet 없는 옛 저장: s1, s2만 유지 (4단계·6단계 옛 구성 모두 s1=수박, s2=쉬운 단어)
    - 구성 2(6단계) → 3: s1→s1, s2→s2, s3→s2, s4→s3, s5→s4, s6→s5 (다 깼으면 6단계부터)
    - 더 새 구성(옛 앱으로 되돌린 기기)은 대응을 몰라 전투 진행만 처음부터
  - 옮기기 전 원본은 `inwoo-hangul-robot.save.v2.before-stageset3`에 처음 한 번 보관하고, 옮긴 결과는 바로 저장해 다음 실행부터 다시 옮기지 않는다.
  - 단어 기록·설정은 어느 경우에도 유지. 옮겼거나 저장이 실패하면 부모 화면 '기록' 문단에 한 줄로 알린다.
  - 전투 구성을 바꿀 때: `STAGE_SET`을 올리고 `STAGE_STEPS`에 한 칸 추가. 빠지면 `tests/progress.test.ts`가 실패한다.

### 검증 (2026-09-29)
- `npx tsc --noEmit`, `npx vitest run` 통과
- `npm run build:release` 통과 (검사 포함). 같은 검사를 일반 빌드에 돌리면 4개 항목 모두 잡힘 (음성 대조)
- `node e2e/release.mjs`: 출시 빌드 ok, 일반 빌드는 실패 (음성 대조)
- `node e2e/play.mjs 360` (전투 경로 포함), `node e2e/play.mjs 390`

## 막힌 것 (BLOCKED)
- `.github/workflows/` 변경은 사용자가 직접 커밋해야 함: `deploy/android-apk.yml`
