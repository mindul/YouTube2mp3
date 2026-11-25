# 다른 맥북에 설치하고 실행하기

이 앱은 외부 npm 패키지가 없어서 `npm install`이 필요 없습니다. 아래 도구들과 소스 코드만 있으면 됩니다.

## 1. 필요한 것

| 항목 | 용도 | 비고 |
|---|---|---|
| macOS | 실행 환경 | `launch.command`가 macOS 전용(`open`, `lsof` 사용) |
| [Homebrew](https://brew.sh) | 도구 설치 | 이미 있으면 생략 |
| Node.js | 서버 실행 (`server.js`) | v26.13.1에서 테스트. 내장 모듈(`node:http` 등)만 사용 |
| `yt-dlp` | YouTube에서 오디오 추출 | 오래되면 403 오류가 나므로 주기적으로 업데이트 |
| `ffmpeg` | mp3 변환 | `yt-dlp`가 내부에서 호출 |
| Git | 소스 받기 | Xcode Command Line Tools에 포함. ZIP으로 받으면 생략 가능 |

## 2. 설치

### 2-1. Homebrew (없을 때만)

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Apple Silicon 맥북은 설치 후 안내되는 `eval "$(/opt/homebrew/bin/brew shellenv)"` 줄을 `~/.zprofile`에 추가해야 합니다. (`launch.command`는 `/opt/homebrew/bin`과 `/usr/local/bin`을 PATH에 직접 넣으므로 더블클릭 실행은 이 설정 없이도 동작합니다.)

### 2-2. 필수 도구

```sh
brew install node yt-dlp ffmpeg
```

설치 확인:

```sh
node -v
yt-dlp --version
ffmpeg -version | head -1
```

### 2-3. 소스 받기

```sh
git clone https://github.com/mindul/YouTube2mp3.git
cd YouTube2mp3
```

Git을 쓰지 않으면 GitHub 저장소 페이지에서 **Code → Download ZIP**으로 받아 압축을 풀어도 됩니다. 이 경우 실행 권한이 빠질 수 있으니 아래 `chmod`를 실행하세요.

```sh
chmod +x launch.command
```

## 3. 실행

**방법 A — 더블클릭:** Finder에서 `launch.command`를 더블클릭하면 서버가 시작되고 브라우저가 자동으로 열립니다.

**방법 B — 터미널:**

```sh
./launch.command
```

브라우저에서 http://127.0.0.1:3333 이 열립니다. 종료는 터미널에서 `Ctrl+C`입니다.

### 실행 옵션

```sh
PORT=8080 ./launch.command         # 다른 포트
HOST=127.0.0.1 ./launch.command    # 이 맥북에서만 접속 허용
NO_OPEN=1 ./launch.command         # 브라우저 자동 열기 끄기
```

## 4. 처음 실행할 때 마주치는 macOS 경고

- **"확인되지 않은 개발자" / "열 수 없음" 경고** (더블클릭 시, 특히 ZIP이나 AirDrop으로 받은 경우)
  - Finder에서 `launch.command`를 **우클릭 → 열기 → 열기**로 한 번 실행하면 이후부터는 그냥 열립니다.
  - 또는 터미널에서 격리 속성을 제거합니다: `xattr -d com.apple.quarantine launch.command`
  - `git clone`으로 받았다면 보통 이 경고가 나오지 않습니다.
- **"node의 수신 연결을 허용하시겠습니까?"** (방화벽이 켜져 있을 때)
  - 같은 네트워크의 다른 기기(폰 등)에서 접속하려면 **허용**하세요. 이 맥북에서만 쓸 거라면 `HOST=127.0.0.1`로 실행하고 거부해도 됩니다.

## 5. 문제 해결

| 증상 | 해결 |
|---|---|
| `다음 도구를 찾을 수 없습니다: ...` | 표시된 도구를 `brew install`로 설치 |
| `spawn yt-dlp ENOENT` | `command -v yt-dlp ffmpeg`로 PATH 확인 후 재설치 |
| `HTTP Error 403: Forbidden` | `brew upgrade yt-dlp`로 업데이트 |
| 포트 3333이 이미 사용 중 | 이미 이 앱이 떠 있으면 `launch.command`가 브라우저만 엽니다. 다른 앱이 쓰는 중이면 `PORT=8080 ./launch.command` |
| 다른 기기에서 접속 불가 | 같은 Wi-Fi인지(게스트 네트워크 불가), `HOST=127.0.0.1`이 아닌지, 방화벽 허용 여부 확인. 접속 주소는 서버 시작 시 터미널에 출력되는 `같은 네트워크에서:` 주소 |

## 6. 주의

- 로그인이 없으므로 기본 설정(`HOST=0.0.0.0`)에서는 같은 네트워크의 누구나 변환을 실행할 수 있습니다. 카페·사무실 같은 공용 네트워크에서는 `HOST=127.0.0.1`로 실행하세요.
- 저작권이 있는 콘텐츠는 권리자가 허락한 범위에서 개인적으로만 이용하세요.

## 요약 (복사해서 쓰기)

```sh
brew install node yt-dlp ffmpeg
git clone https://github.com/mindul/YouTube2mp3.git
cd YouTube2mp3
./launch.command
```
