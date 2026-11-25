# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in a single `index.html`, served by a dependency-free Node server (`server.js`). No framework, no build step. Confirmed by the existing codebase.

## Users

The owner, on their own computer, plus other people and devices on the same home network (the server binds to `0.0.0.0` on the owner's request). Used mostly on desktop; phones are possible but secondary (user answered "데스크톱 위주"). Inferred, not interviewed: the audience is the owner's household or trusted local network, not the public.

## Product Purpose

Paste a YouTube link and get an mp3 file downloaded, with no account and no extra software on the visiting device. Success is: paste, press, receive a correctly named mp3 within about a minute, and always know what state the conversion is in.

## Positioning

A private, self-hosted converter that runs on the owner's own machine through `yt-dlp` and `ffmpeg`. It is not a public service: no ads, no sign-up, no third-party site handling the links.

## Operating Context

The owner starts it with `node server.js` and opens `http://<host>:3333`. Other devices on the same network open the owner's LAN address. Conversion takes roughly 5 to 60 seconds depending on video length. The server returns the finished mp3 in the same request; the page saves it with the title as the filename.

## Capabilities and Constraints

- One input: a YouTube URL (youtube.com, m.youtube.com, music.youtube.com, youtu.be). Single video only, playlists are ignored.
- One output: an mp3 at best quality (`--audio-quality 0`) with embedded metadata.
- States the page must express: idle, converting (no real progress percentage is available, the request is a single blocking POST), success with filename, error with the server's message (for example "올바른 YouTube 주소가 아닙니다.").
- No login, no history storage, no persistence. The server keeps nothing after a response.
- The UI language is Korean. Light and dark follow the system setting.
- Frontend behavior to preserve: form submit, `POST /api/convert` with `{url}`, filename from the `X-Filename` header, blob download, status messages.
- Port 3333 by default, `PORT` and `HOST` environment variables override.
- Undecided: whether to add conversion history. Not requested, so not built.

## Brand Commitments

Existing name shown on the page: "YouTube → MP3". No logo or other brand assets exist. Voice so far is plain, short Korean ("영상 주소를 붙여넣으면 mp3로 변환해서 내려받습니다.").

## Evidence on Hand

No testimonials, customers, benchmarks, user counts, or screenshots exist, and none must be invented. The only verifiable facts are what the code does: it converts with `yt-dlp` and `ffmpeg`, runs locally, and keeps no files after responding.

## Product Principles

1. The input and the convert action are the product; everything else supports them.
2. State is always legible: the visitor never wonders whether it is working, finished, or failed.
3. Claim only what the code does. No invented numbers, speeds, or quality promises beyond the mp3 setting actually used.
4. Private and local by nature: the page may say it runs on this computer, never imply a hosted service.

## Accessibility & Inclusion

No product-specific requirement established. Baseline: keyboard operable, visible focus, status announced to assistive tech (the page already uses `role="status"` with `aria-live`), contrast meeting WCAG AA in both color schemes.
