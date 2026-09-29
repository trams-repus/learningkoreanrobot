# 외부 에셋·의존성·라이선스 목록 (한글대작전)

Play 스토어 유료 출시(인앱 구매 `hangul_all_stages`, 11단계부터 열기) 전에 앱에 들어가는 모든 외부 코드·에셋의 출처와 라이선스 의무를 정리한다.
근거는 모두 저장소 안 파일(`package.json`, `node_modules/<pkg>/package.json`·`LICENSE`, 빌드 스크립트, 소스)에서 확인했다. 2026-09-29 기준.
"저장소 밖 확인 필요"라고 적은 항목은 저장소만으로 확정할 수 없는 것이다.

## 1. 앱에 들어가는 npm 패키지 (웹 번들 `dist/assets/*.js`)

| 패키지 | 버전 | 라이선스 | 저작권 표기 (LICENSE 첫 줄) | 고지 의무 | 비고 |
|---|---|---|---|---|---|
| phaser | 3.90.0 | MIT | Copyright (c) 2024 Richard Davey, Phaser Studio Inc. | 있음: 저작권 문구 + MIT 전문을 사본에 포함 | 게임 엔진. 번들 크기 대부분 |
| eventemitter3 (phaser 의존) | 5.0.4 | MIT | Copyright (c) 2014 Arnout Kazemier | 있음 (MIT) | phaser와 함께 번들됨 |
| @capacitor/core | 7.6.9 | MIT | Copyright (c) 2017-present Drifty Co. | 있음 (MIT) | |
| tslib (@capacitor/core 의존) | 2.8.1 | 0BSD | Copyright (c) Microsoft Corporation | 없음 (0BSD) | 번들에 쓰였는지와 무관하게 고지 불필요 |
| @capacitor-community/text-to-speech | 6.1.0 | MIT | Copyright (c) 2021 Robin Genz | 있음 (MIT) | 기기 TTS 호출 (`src/native/tts-shim.ts`) |
| capacitor-plugin-cdv-purchase | 13.18.0 | MIT (package.json·README) | 패키지에 LICENSE 파일 없음. 코드 안 주석: "Copyright (C) 2012-2013 by Guillaume Charhon, Modifications 10/16/2013 by Brian Thurlow" | 있음 (MIT) | 원 저장소 j3k0/cordova-plugin-purchase. 저작권자 전체 문구는 저장소 밖 확인 필요 |

- 현재 빌드 결과(`dist/assets/*.js`)에는 `@license`·`Copyright` 주석이 하나도 남아 있지 않다. 즉 **MIT 고지가 앱 어디에도 없다** (MIT의 유일한 조건 미충족).
- 패키지 자체 `license` 필드("ISC")는 우리 앱 코드 표기일 뿐이며 `private: true`라 영향 없음.

### 빌드 전용 (앱에 안 들어감, 고지 불필요)

| 패키지 | 버전 | 라이선스 |
|---|---|---|
| @capacitor/cli | 7.6.9 | MIT |
| typescript | 7.0.2 | Apache-2.0 |
| vite | 8.3.1 | MIT |
| vitest | 5.0.2 | MIT |
| playwright | 1.56.1 | Apache-2.0 |

주의: `@capacitor/android`(7.6.9, MIT, Copyright (c) 2017-present Drifty Co.)는 `devDependencies`에 있지만 **APK 안에 네이티브 브리지로 컴파일되어 들어간다** → 아래 2절처럼 고지 대상.

## 2. 안드로이드 네이티브 구성요소 (APK/AAB에 들어감)

(2026-09-29부터 `android/`는 저장소에 있고 CI는 `cap sync`만 한다: `deploy/android-apk.yml`.) 아래 버전은 각 플러그인 `build.gradle`의 기본값이다.

| 구성요소 | 버전 | 끌어오는 곳 | 라이선스·약관 | 의무 |
|---|---|---|---|---|
| Capacitor Android 브리지 | 7.6.9 | @capacitor/android | MIT | MIT 고지 |
| Google Play Billing Library (`com.android.billingclient:billing`) | **9.0.0** | cdv-purchase `android/build.gradle` | Android SDK 라이선스 약관 (Google 배포 바이너리, 저장소 밖 확인 필요) | 재배포 고지 의무보다는 약관·Play 결제 정책 준수. README의 "Billing 8.3" 표기는 오래됨 |
| Apache Cordova Android framework | 10.1.1 | @capacitor/android `build.gradle` | Apache-2.0 | 라이선스 전문 + NOTICE 포함 |
| AndroidX (appcompat 1.7.0, core 1.15.0/1.9.0, activity 1.9.2, fragment 1.8.4, coordinatorlayout 1.2.0, webkit 1.12.1) | 좌동 | Capacitor·플러그인 | Apache-2.0 | 라이선스 전문 + NOTICE 포함 |
| Kotlin 표준 라이브러리 (kotlin-bom) | 1.9.25 | @capacitor/android | Apache-2.0 | 라이선스 전문 포함 |

Billing Library·AndroidX의 전이 의존성 전체 목록은 Gradle 해석 후에만 알 수 있다 (`./gradlew :app:dependencies`, 저장소 밖 확인 필요).

## 3. 단어 녹음 (`public/audio/words/*.wav`)

- 파일 **85개**(2026-09-29 BY-SA 4개 제거 전 89개), 모두 Lingua Libre (Wikimedia Commons) 녹음. 목록: `src/content/word-audio-sources.json`(151항목, 그중 66항목은 파일 없음·제외 → 기기 TTS).
- 라이선스·녹음자는 `scripts/discover_audio.py`가 Commons `extmetadata`(LicenseShortName, Artist)에서 읽어 적었다. 허용 목록은 CC0·CC BY·CC BY-SA·퍼블릭 도메인.
- `scripts/download_audio.py`는 파일을 **변경 없이** 그대로 저장한다 (자르기·변환 없음).
- 디스크에 있는 89개 모두 JSON에 license 값이 있다. **라이선스 없음/모름 파일: 0개.**

| 라이선스 | 파일 수 | 녹음한 분 | 의무 |
|---|---|---|---|
| CC0 (`CC0` 75 + `CC0-1.0` 10) | 85 | 호로조 51, CHK2605 33, Jeebeen 1 | 없음 (표시는 권장) |
| CC BY-SA 4.0 | 4 | HappyMidnight | 저작자 표시 + 라이선스 링크 + 원본 링크 + 변경 여부 표시. 변경해 만든 결과물은 같은 라이선스 |

CC BY-SA 4.0 파일: `appa.wav`(아빠), `bap.wav`(밥), `ori.wav`(오리), `gaseum.wav`(가슴) — 원본 `LL-Q9176_(kor)-HappyMidnight-<단어>.wav`.

### 현재 앱 안 표시 (`src/ui/screens.ts` `soundHtml`)
보호자 화면(길게 누르기) → '소리 확인' 탭 표에 단어마다 "녹음한 분 · 라이선스"(예: `HappyMidnight · CC BY-SA 4.0`)와 "녹음: Lingua Libre (Wikimedia Commons)" 문구가 나온다.

CC BY-SA 4.0 요구(3(a)(1)) 대비:

| 요구 | 현재 | 판단 |
|---|---|---|
| 저작자 이름 | 녹음한 분 이름 표시 | 충족 |
| 라이선스 이름 + 라이선스 링크(URI) | 이름만, 링크 없음 | **부족**: `https://creativecommons.org/licenses/by-sa/4.0/` 필요 |
| 원본 자료 링크(합리적으로 가능하면) | 없음 (JSON에 `url`·`commonsFile`은 있음) | **부족**: Commons 파일 페이지 링크 권장 |
| 변경 여부 표시 | 없음 | 변경 안 했으므로 "원본 그대로" 한 줄이면 충분 |
| 찾기 쉬운 곳 | 보호자 잠금 안 진단용 표에만 있음 | 약함: 일반 '만든 사람/라이선스' 화면이 더 적절 |

추가 위험: CC 4.0은 녹음이 "움직이는 화면과 시간에 맞춰 동기화"되면 2차적 저작물(Adapted Material)로 본다. 게임 애니메이션과 함께 재생되는 경우 앱 전체에 ShareAlike가 걸린다는 해석 여지가 있다. 유료 앱이면 **BY-SA 4개를 CC0 녹음이나 직접 녹음으로 바꾸거나 빼는 것**(해당 단어는 이미 TTS로 대체됨)이 가장 안전하다.

기타: `download_audio.py` 첫 줄 설명이 "CC0"라고만 적혀 있어 실제(BY-SA 4개 포함)와 다르다. 라이선스 표기도 `CC0`/`CC0-1.0`이 섞여 있다.

## 4. 글꼴

| 파일 | 글꼴 (name 테이블) | 버전 | 라이선스 | 비고 |
|---|---|---|---|---|
| `public/fonts/NotoSansKR-700Bold.woff2` | Noto Sans KR Bold | 2.004 | SIL OFL 1.1 | 부분집합(글리프 2,958개) |
| `public/fonts/NotoSansKR-900Black.woff2` | Noto Sans KR Black | 2.004 | SIL OFL 1.1 | 부분집합(글리프 2,958개) |
| `public/fonts/OFL.txt` | — | — | OFL 1.1 전문 | "Copyright 2014-2021 Adobe ... Reserved Font Name 'Source'" |

- `src/styles.css`의 `@font-face` 'HDFont'가 위 두 파일을 쓴다. 외부 글꼴 CDN 없음.
- OFL.txt는 `dist/fonts/`로 복사되어 APK에 함께 들어간다 → **OFL 조건(저작권 문구+라이선스 동봉) 충족**. 부분집합은 '수정본'이지만 예약 이름은 'Source'뿐이라 'Noto Sans KR' 이름 유지 가능.
- 폰트 파일 안 name 테이블에는 저작권(ID 0)만 있고 라이선스 설명(ID 13/14)은 없다. `scripts/build-single.mjs`(단일 HTML판)는 글꼴을 base64로 넣으면서 OFL.txt를 빼므로, 그 판을 배포하면 OFL 문구를 HTML 안에 넣어야 한다 (Play 출시와는 무관).
- 대체 글꼴 'Apple SD Gothic Neo', 'Malgun Gothic'은 기기 글꼴 이름만 적은 것이라 배포하지 않음.

## 5. 그림 (모두 코드로 직접 그림)

| 파일 | 내용 | 확인 결과 |
|---|---|---|
| `src/content/pictures.ts` + `pictureKit.ts` | 단어 그림 SVG 조각 (viewBox 0 0 100 100) | 직접 그림(주석·`docs/picture-style.md` 규칙). 이모지 미사용. `src/content/pictures/l1-*.ts` 250장 추가(2026-09-29, 같은 규칙) |
| `src/scene/art.ts`, `magicArt.ts` | 로봇·공룡·마법소녀·배경 | Phaser Graphics로 절차 생성 ("자체 제작 임시 에셋") |
| `src/ui/regionArt.ts` | 새 지역 발견 장면 SVG | 직접 그림 ("기존 게임의 그림을 본뜨지 않는다") |
| `src/ui/icons.ts` | 버튼 아이콘 30개 (viewBox 0 0 48 48) | 직접 그림. 아이콘 팩 흔적(24×24/512 viewBox, 저작권 주석) 없음 |
| `src/content/strokes.ts` | 자모 획 순서 뼈대 좌표 | 직접 작성 (교과서 획순 규칙만 따름) |
| `src/styles.css` 1215행 | select 화살표 `M6 9l6 6 6-6` (24×24) | Feather/Lucide의 chevron-down과 같은 경로이나 선 하나짜리라 저작물성 없음. 두 팩도 MIT/ISC라 위험 낮음 |

외부 이미지 파일(png/jpg/webp/svg) 참조 없음. 외부 URL 로드는 `public/privacy.html`의 링크 2개(Google 개인정보처리방침, GitHub)뿐.

## 6. `public/` 과 앱 아이콘·스플래시

| 경로 | 내용 |
|---|---|
| `public/audio/words/*.wav` | 단어 녹음 85개 (3절) |
| `public/fonts/` | Noto Sans KR 2종 + OFL.txt (4절) |
| `public/privacy.html` | 개인정보처리방침 (자체 작성) |

- favicon·웹 매니페스트 없음.
- **앱 아이콘·스플래시가 저장소에 없다.** CI가 `npx cap add android`로 만든 기본 템플릿을 그대로 쓰므로 런처 아이콘·스플래시가 Capacitor 기본 그림이 된다 → 자체 아이콘으로 교체 필요 (Play 등록용 512×512 아이콘, 1024×500 그래픽 이미지도 별도 필요).

## 7. 효과음·음성

- `src/services/sfx.ts`: 음원 파일 없음. Web Audio `OscillatorNode` + `Math.random()` 백색소음 버퍼로 모두 합성 (자체 제작).
- 대사·녹음 없는 단어: 기기 TTS(@capacitor-community/text-to-speech → 안드로이드 TTS 엔진). 앱이 음성 데이터를 배포하지 않음.
- 부모 녹음: 사용자가 기기에서 만든 것, 기기 안에만 저장.

## 출시 전 할 일

- [x] (2026-09-29 `public/licenses.txt` + 보호자 설정 '라이선스 보기') 앱 안 '만든 사람/라이선스' 화면 추가 (보호자 화면 등): Phaser·eventemitter3·Capacitor(core/android)·text-to-speech·cdv-purchase의 MIT 저작권 문구 + MIT 전문. 빌드 번들에 고지가 남지 않으므로 필수
- [x] 같은 화면에 Apache-2.0 고지 (전문 포함, 전이 의존성 확정은 아래 항목) (AndroidX, Cordova Android 10.1.1, Kotlin stdlib) — 라이선스 전문과 NOTICE. Google `oss-licenses-plugin`으로 자동 생성하거나 수동 목록
- [~] (녹음한 분·라이선스·CC0 링크·'원본 그대로'는 `licenses.txt`에 있음. 파일별 원본 링크는 없음) Commons 녹음 표시: "녹음: Lingua Libre / Wikimedia Commons", 녹음자별 이름, CC BY-SA 4.0 링크, 원본 파일 링크, "원본 그대로 사용". 진단용 '소리 확인' 표 말고 라이선스 화면에도 둘 것
- [x] (2026-09-29 제거 → 기기 음성, 찾기 스크립트도 BY-SA 제외) BY-SA 4.0 녹음 4개(appa·bap·ori·gaseum, HappyMidnight)를 CC0/직접 녹음으로 교체하거나 제거 검토 (ShareAlike 해석 위험)
- [x] 폰트: OFL.txt는 이미 동봉됨. 라이선스 화면에 "Noto Sans KR — SIL OFL 1.1" 한 줄과 OFL 전문(또는 `fonts/OFL.txt`) 연결
- [x] (2026-09-29 `scripts/make-icons.mjs`, `android/`·`ios/` 저장소 관리) 자체 앱 아이콘·스플래시 제작 후 CI에 반영 (예: `@capacitor/assets`로 `android/` 생성 뒤 덮어쓰기). Capacitor 기본 아이콘으로 출시 금지
- [ ] cdv-purchase 저작권자 전체 문구를 원 저장소(j3k0/cordova-plugin-purchase) LICENSE에서 확인해 고지에 반영
- [ ] 릴리스 AAB에서 `./gradlew :app:dependencies`로 실제 네이티브 의존성 목록 확정 (Billing 9.0.0의 전이 의존성 포함)
- [ ] 정리: `download_audio.py` 설명의 "CC0"만 표기 수정, JSON의 `CC0`/`CC0-1.0` 표기 통일
- [x] (라이선스 외) `docs/play-store.md` 스토어 설명의 "광고, 결제, 로그인 없음"은 인앱 구매와 모순 → "광고·로그인 없음, 1회 구매로 전체 단계 열기"로 수정
