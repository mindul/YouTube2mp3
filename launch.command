#!/bin/bash
# YouTube → MP3 서버 실행 스크립트 (macOS: Finder에서 더블클릭하면 터미널에서 실행됩니다)
#   PORT=8080 ./launch.command      다른 포트로 실행
#   HOST=127.0.0.1 ./launch.command 이 컴퓨터에서만 접속 허용
#   NO_OPEN=1 ./launch.command      브라우저를 자동으로 열지 않음

cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
PORT="${PORT:-3333}"

pause_and_exit() {
  echo
  read -n 1 -s -r -p "아무 키나 누르면 창을 닫습니다."
  echo
  exit "${1:-1}"
}

# 필요한 도구 확인
missing=()
for cmd in node yt-dlp ffmpeg; do
  command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
done
if [ ${#missing[@]} -gt 0 ]; then
  echo "다음 도구를 찾을 수 없습니다: ${missing[*]}"
  echo "설치: brew install ${missing[*]}"
  pause_and_exit 1
fi

# 이미 실행 중이면 브라우저만 연다
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "포트 $PORT 에서 이미 서버가 실행 중입니다: http://127.0.0.1:$PORT"
  [ -z "$NO_OPEN" ] && open "http://127.0.0.1:$PORT"
  pause_and_exit 0
fi

# 서버가 뜰 시간을 잠깐 준 뒤 브라우저를 연다
if [ -z "$NO_OPEN" ]; then
  (sleep 1; open "http://127.0.0.1:$PORT") &
fi

echo "서버를 시작합니다. 종료하려면 Ctrl+C 를 누르세요."
PORT="$PORT" node server.js
status=$?

echo
echo "서버가 종료되었습니다. (종료 코드 $status)"
pause_and_exit "$status"
