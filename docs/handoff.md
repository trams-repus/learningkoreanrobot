# 인계 메모: 상용 출시 작업 (2026-09-29)

사용자 요청으로 조사 단계에서 멈췄다. 코드 변경은 아직 없다. 이 문서만 추가했다.

## 확정된 사용자 결정
- 입력: **끌어 넣기만**. 탭으로 자모를 넣는 기능은 넣지 않는다 (2026-09-29 사용자 답 "끌어넣기로 해라"). 출시 지시서 1절의 "드래그와 탭 모두 지원"은 이 결정으로 대체된다. 놓인 자모를 탭하거나 끌어내서 빼는 기존 동작은 그대로 둔다.
- 단어 음성은 기기 TTS가 기본, Commons 녹음은 부모 설정 옵션(기본 꺼짐).
- main 직접 병합, 공개 배포, 스토어 제출은 승인 없이 하지 않는다. 작업 브랜치 `claude/commercial-release-inhaw5`에서 PR로.

## 한 일
- main b51aa73 기준 확인: `npm ci`, `npx tsc --noEmit`, `npx vitest run`(100개 통과), `npx vite build` 모두 성공.
- `npx vite preview --port 4173` + `node e2e/play.mjs 360` 자동 플레이 통과 (오류 0). 헤드리스라 음성은 '재생 수단 없음' 경로만 확인됨.

## 조사로 확인한 출시 차단 후보 (아직 안 고침)
1. 개발 옵션이 출시 빌드에서도 켜짐: `src/game/services.ts`의 `?dev=1`(모든 단계 해제, 부모 문 0.2초), `?speed=`, `?voice=off`, `src/main.ts`의 `window.__hd` 노출. → 빌드 모드 플래그로 분리하고, e2e는 개발용 빌드(dist-test 등)에서 돌리며, 출시 번들에 `?dev=1`이 먹지 않는지 검사하는 테스트 추가 필요.
2. 저장: `src/core/progress.ts` `sanitizeSave`가 `stageSet !== STAGE_SET`이면 깬 기록·마지막 단계·본 지역을 지움. 저장 실패는 `storage.ts`에서 조용히 무시. → 버전별 마이그레이션 + 원본 백업 + 저장 실패 표시 필요.
3. 결제 없음: Stage 10 뒤 `screens.regionInfo()`는 "결제 화면 자리" 안내만 하고 11단계 이후가 그냥 열림. 부모 문은 1.5초 길게 누르기뿐.
4. 11단계 이후는 `stages.ts`에 s11~s15만 규칙(`stageFromRules`)으로 5개 들어 있음. 무한 생성·시드·상한 없음. `nextStageId`는 다 깨면 1단계로 돌아감.
5. Android CI(`.github/workflows/android-apk.yml`)가 매번 `npx cap add android`로 프로젝트를 새로 만듦 → 결제 플러그인·매니페스트·뒤로가기 설정이 보존되지 않음. android/ 폴더를 저장소에 넣고 워크플로를 바꿔야 함 (이 세션은 .github/workflows에 push 권한이 없던 이력 있음 → deploy/에 패치를 두는 방식).
6. 스토어 문구(`docs/play-store.md`)와 `public/privacy.html`이 "결제 없음"으로 되어 있어 판매 구조와 충돌.
7. 부모 화면 '목소리 녹음' 탭은 마이크를 씀 → 네이티브 앱에서는 숨기거나 권한 검토 필요.
8. 어휘 151개 전부 `sourceStatus: '임시 선정'`. 겹모음(ㅘ ㅝ ㅚ ㅟ ㅢ)은 `assembly.ts frameFor`에서 제외됨.

## 다음 단계 (제안 순서)
1. 개발 옵션 빌드 분리 + 출시 번들 검사
2. 저장 마이그레이션(백업, 실패 보존, 구매 권한과 학습 기록 분리)
3. 11단계 이후 시드 기반 무한 생성(번호·시드·콘텐츠 버전, 상한, 5/10 단위 보스)
4. PurchaseService 경계 + 부모 문(계산 문제) + Stage 10 뒤 안내 + 복원. 후보 라이브러리: cordova-plugin-purchase v13(Capacitor 7에서 Cordova 호환으로 사용, 비소모성·finish/acknowledge·pending 처리). 결정 전 공식 문서로 Capacitor 7 호환 확인할 것.
5. 음성 대체: TTS가 없으면 녹음 파일로, 녹음도 없으면 그 단어를 출제에서 빼기
6. android/ 커밋 + 워크플로 패치, iOS 프로젝트 준비, 스토어 자료·개인정보 문구 갱신

## 재현 명령
```
npm ci
npx tsc --noEmit && npx vitest run && npx vite build
npx vite preview --port 4173 &
node e2e/play.mjs 360      # 인자 없이 실행하면 4개 화면 크기 모두
```
