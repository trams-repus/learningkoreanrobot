# Play 스토어 등록 안내 (한글대작전)

## 1. 업로드 키 만들기 (한 번만, 직접)
업로드 키는 비밀이라 저장소에 올리지 않는다. Java가 있는 PC에서:

```
keytool -genkeypair -v -keystore upload.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

비밀번호 하나(키 저장소와 키에 같은 것)를 정해 입력한다. 파일과 비밀번호는 잃어버리지 않게 따로 보관.

## 2. GitHub Secrets에 넣기
저장소 Settings → Secrets and variables → Actions → New repository secret
- `ANDROID_UPLOAD_KEYSTORE_BASE64`: `base64 -w0 upload.keystore` 결과 (Windows: `certutil -encode upload.keystore out.txt` 후 머리·꼬리 줄 빼고 붙여넣기)
- `ANDROID_UPLOAD_KEYSTORE_PASSWORD`: 정한 비밀번호

그 뒤 main push(또는 Actions에서 "안드로이드 APK" 수동 실행)마다 `inwoo-hangul-robot-aab` 아티팩트로 AAB가 나온다.

## 3. Play Console
- 앱 만들기: 이름 "한글대작전", 게임, 무료. Play 앱 서명(Google이 서명 키 관리) 사용.
- 개인정보처리방침 URL: https://trams-repus.github.io/learningkoreanrobot/privacy.html
- 대상 연령: 5세 이하, 6~8세 → 가족 정책 적용. 광고 없음, 데이터 수집 없음(데이터 보안 양식에 "수집·공유 없음").
- 콘텐츠 등급 설문: 폭력 = 만화풍 로봇·공룡 전투(피 없음).
- 개인 계정 조건: 비공개 테스트에 테스터 12명 이상, 14일 연속 참여 후 프로덕션 신청 가능.

## 스토어 문구 (초안)
- 짧은 설명(80자): 로봇과 함께 자음·모음을 끌어 맞춰 한글 단어를 만드는 어린이 한글 게임
- 자세한 설명:

  한글을 막 시작하는 아이를 위한 작은 한글 조합 게임입니다.
  단어를 들려주면 아이가 자음과 모음을 끌어다 초성·중성·종성 순서로 글자를 만들고, 맞힐 때마다 로봇(또는 마법소녀)이 공룡을 물리칩니다.
  · 음절이 완성될 때마다 소리 내어 읽어 줍니다
  · 빠르게 연속으로 맞히면 콤보, 에너지를 모아 필살기
  · 헷갈리는 함정 글자로 자연스럽게 구별 연습
  · 광고, 결제, 로그인 없음. 기록은 기기 안에만 저장
- 스크린샷: 폰 세로 최소 2장(권장 4장+), 아이콘 512×512, 그래픽 이미지 1024×500 필요.
