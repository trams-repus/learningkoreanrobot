#!/usr/bin/env bash
# 로그인 없이 여는 테스트 주소(GitHub Pages)에 지금 코드를 올린다.
# 빌드 결과를 gh-pages 브랜치에 커밋 하나로 더한다 (main 기록은 건드리지 않고, 강제 푸시하지 않는다).
# 보통은 직접 돌리지 않는다: main에 push하면 .github/workflows/pages-and-audio.yml이 녹음 받기 뒤 이 스크립트로 배포한다
# (2026-09-28 사용자가 켬). 손으로 돌리면 Actions 배포와 gh-pages 푸시가 겹칠 수 있으니 Actions가 안 될 때만 쓴다.
set -euo pipefail
cd "$(dirname "$0")/.."

# GitHub Actions에서는 DEPLOY_REMOTE로 토큰이 든 주소를 넘긴다
REMOTE="${DEPLOY_REMOTE:-$(git remote get-url origin)}"
SRC="$(git rev-parse --short HEAD)"
NAME="$(git config user.name || echo deploy)"
EMAIL="$(git config user.email || echo deploy@localhost)"
OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

npm test --silent
npx tsc --noEmit
npx vite build --outDir "$OUT/build" --emptyOutDir

if git ls-remote --exit-code --heads "$REMOTE" gh-pages >/dev/null 2>&1; then
  git clone -q --depth 1 --branch gh-pages "$REMOTE" "$OUT/site"
  find "$OUT/site" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
else
  git init -q -b gh-pages "$OUT/site"
fi
cp -a "$OUT/build/." "$OUT/site/"
touch "$OUT/site/.nojekyll" # Jekyll 처리 없이 파일을 그대로 내보낸다

cd "$OUT/site"
git add -A
if git diff --cached --quiet; then
  echo "바뀐 것이 없어 올리지 않았습니다 (main ${SRC})."
  exit 0
fi
git -c user.name="$NAME" -c user.email="$EMAIL" commit -q -m "배포: main ${SRC}"
git push -q "$REMOTE" HEAD:gh-pages
echo "gh-pages에 main ${SRC} 빌드를 올렸습니다."
