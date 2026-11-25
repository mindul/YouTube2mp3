# YouTube → MP3

YouTube 영상 주소를 붙여넣으면 mp3 파일로 변환해서 내려받는 웹 앱입니다. 내 컴퓨터에서 직접 실행하며, 계정도 광고도 필요 없습니다.

- 변환은 서버를 켠 컴퓨터에서 [`yt-dlp`](https://github.com/yt-dlp/yt-dlp)와 [`ffmpeg`](https://ffmpeg.org)로 처리합니다.
- 영상 제목이 파일 이름이 되고, 제목 같은 정보가 mp3 안에 함께 담깁니다.
- 변환한 파일은 내려받기가 끝나면 서버에서 지워지며, 변환 기록은 남기지 않습니다.
- 같은 공유기에 연결된 다른 기기에서도 접속할 수 있습니다.
- 외부 npm 패키지에 의존하지 않습니다(Node.js 내장 모듈만 사용).

<img width="836" height="592" alt="image" src="https://github.com/user-attachments/assets/a2ee5559-8273-46cd-9dc7-c42c9524a0a4" />

## 준비물

| 도구 | 용도 |
|---|---|
| [Node.js](https://nodejs.org) | 서버 실행 (v26.13.1에서 테스트) |
| `yt-dlp` | YouTube에서 오디오 추출 |
| `ffmpeg` | mp3로 변환 |

macOS(Homebrew)에서는 한 번에 설치할 수 있습니다.

```sh
brew install node yt-dlp ffmpeg
```

다른 운영체제에서는 각 도구의 설치 안내를 따르고, `yt-dlp`와 `ffmpeg`가 `PATH`에서 실행되는지 확인하세요.

## 실행

macOS에서는 `launch.command`를 더블클릭하면 서버가 시작되고 브라우저가 자동으로 열립니다. 터미널에서는 다음과 같이 실행합니다.

```sh
./launch.command
```

`launch.command`는 `node`, `yt-dlp`, `ffmpeg`가 설치되어 있는지 먼저 확인하고, 이미 서버가 실행 중이면 새로 띄우지 않고 브라우저만 엽니다. 브라우저를 자동으로 열지 않으려면 `NO_OPEN=1 ./launch.command`로 실행하세요. 직접 실행하려면 다음 명령을 쓰면 됩니다.

```sh
node server.js
```

브라우저에서 http://127.0.0.1:3333 을 열고, YouTube 영상 주소를 붙여넣은 뒤 **mp3로 변환**을 누르면 됩니다. 서버를 시작하면 같은 네트워크에서 접속할 수 있는 주소도 터미널에 함께 출력됩니다.

### 환경 변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `3333` | 서버 포트 |
| `HOST` | `0.0.0.0` | 접속을 받을 주소. `127.0.0.1`로 두면 이 컴퓨터에서만 접속할 수 있습니다. |

```sh
# 이 컴퓨터에서만 쓰기
HOST=127.0.0.1 node server.js

# 다른 포트로 실행
PORT=8080 node server.js
```

## 보안 안내

이 앱에는 로그인이 없습니다. 기본 설정(`HOST=0.0.0.0`)에서는 같은 네트워크의 누구나 접속해서 이 컴퓨터의 자원으로 변환을 실행할 수 있습니다. 집 공유기처럼 믿을 수 있는 네트워크에서만 쓰고, 카페나 사무실 같은 공용 네트워크에서는 `HOST=127.0.0.1`로 실행하세요. 인터넷에 공개하는 용도로는 만들어지지 않았습니다.

macOS 방화벽이 켜져 있으면 처음 실행할 때 `node`의 수신 연결을 허용할지 묻습니다. 다른 기기에서 접속하려면 허용해야 합니다.

## 지원하는 주소

`youtube.com`, `www.youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtu.be`의 영상 주소를 지원합니다. 서버가 주소의 호스트를 검사해서 이 목록에 없는 주소는 거절합니다. 영상 한 개씩 변환합니다(`--no-playlist`).

## 동작 방식

```
브라우저 ── POST /api/convert {"url": "..."} ──▶ server.js
                                                   │ yt-dlp -x --audio-format mp3 (ffmpeg)
                                                   ▼
브라우저 ◀── audio/mpeg (mp3 파일) ────────────── 임시 폴더의 mp3를 전송한 뒤 삭제
```

- `GET /` — 화면(`index.html`)
- `POST /api/convert` — 본문 `{"url": "<YouTube 주소>"}`. 성공하면 `audio/mpeg`로 mp3를 응답하고, 파일 이름은 `Content-Disposition`과 `X-Filename`(URL 인코딩) 헤더로 전달합니다. 실패하면 `{"error": "..."}`를 JSON으로 응답합니다.
- 변환은 OS 임시 폴더에서 이루어지고, 응답이 끝나면 지워집니다. 브라우저가 연결을 끊으면 진행 중인 변환도 중단됩니다.

## 문제 해결

**`HTTP Error 403: Forbidden`이 나옵니다.**
`yt-dlp`가 오래되어 YouTube의 변경을 따라가지 못하는 경우가 대부분입니다. 업데이트하세요.

```sh
brew upgrade yt-dlp
```

**`spawn yt-dlp ENOENT` 같은 오류가 나옵니다.**
`yt-dlp`가 설치되어 있지 않거나 `PATH`에 없습니다. `ffmpeg`도 마찬가지로 확인하세요.

```sh
command -v yt-dlp ffmpeg
```

**다른 기기에서 접속이 안 됩니다.**
- 두 기기가 같은 Wi-Fi/공유기에 있는지 확인하세요. 게스트 네트워크는 기기 간 접속을 막는 경우가 많습니다.
- `HOST=127.0.0.1`로 실행한 것은 아닌지 확인하세요.
- 방화벽이 `node`의 수신 연결을 막고 있지 않은지 확인하세요.
- 접속 주소는 서버를 시작할 때 터미널에 출력되는 `같은 네트워크에서: http://...` 주소를 사용하세요. 공유기가 주는 IP는 재부팅하면 바뀔 수 있습니다.

## 파일 구성

| 파일 | 설명 |
|---|---|
| `launch.command` | 서버 실행 스크립트(macOS에서 더블클릭) |
| `server.js` | HTTP 서버와 변환 처리 |
| `index.html` | 화면(HTML, CSS, JS가 한 파일) |
| `PRODUCT.md` | 제품 정보 기록 |
| `DESIGN.md` | 디자인 시스템 기록 |

## 저작권

저작권이 있는 콘텐츠는 권리자가 허락한 범위에서 개인적으로만 이용하세요. YouTube의 이용약관은 서비스가 허용하지 않은 영상 다운로드를 제한합니다. 이 도구의 사용에 따른 책임은 사용자에게 있습니다.
