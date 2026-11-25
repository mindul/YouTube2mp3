---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: index.html (tool landing page)

## Scope
Mode: Persuade. The single page of a self-hosted YouTube-to-mp3 converter, redesigned with intro sections (user chose "소개 섹션 포함"). Desktop first (user: "데스크톱 위주"), phone must not break. Korean UI. Light and dark follow the system.

## Audience, job, action, proof
Owner and people on the same home network. They arrive to paste one YouTube link and get an mp3. The action (paste, convert) lives in the first viewport in working form. Proof is only what the code does: local conversion through yt-dlp and ffmpeg, best mp3 quality setting, title becomes filename, nothing kept on the server afterwards. No invented numbers, customers, or speed claims.

## Constraints
Plain HTML/CSS/JS in one file, no external requests (devices on the LAN may be offline), no web fonts. Keep: form submit, POST /api/convert {url}, X-Filename header, blob download, status messages, role="status".

## Direction contract
THESIS: A converter whose state you can see: the equalizer bars are the status display, in the hero field and in the tool panel. Refuses the centered headline over a row of feature cards, and the dark-plus-neon "tool" look.
OWN-WORLD: Drenched ultramarine hero field (about #2433E8), ink #0E1030 for text and the primary button, acid lime #C8F73A reserved for the live signal (bars, success), cool near-white ground with hairline rules below the fold. One heavy Korean sans voice from the system CJK stack, no monospace, no gradients, no glass; soft real shadow only on the tool panel. Dark scheme: ink ground, ultramarine deepened, lime unchanged and the primary button turns lime with ink text.
STORY: In one line the visitor understands: paste a link, get an mp3, made on the computer running this server. They believe it because the page states only what the code does. They paste a link and convert without scrolling.
FIRST VIEWPORT: At 1440x900. Slim nav, brand left and two anchor links right. Headline "링크 하나면 mp3 한 곡." near 96px, heavy, left aligned, spanning about eight of twelve columns on the ultramarine field, with huge tonal equalizer bars rising from the bottom edge and cropped by it. Under it one sentence of subcopy, then the tool panel: white, about 880px wide, left aligned with the headline. Input row with a drawn link icon and a large ink "mp3로 변환" button at its right end; beneath it an ink status strip with lime mini-bars and the state text. The primary action is fully visible above the fold.
FORM: User-pinned "modern", so the roll's assignment was bypassed (a brief-pinned direction beats the roll). Below the fold: how-it-works as a three-column ordered list divided by hairlines (not cards), a two-column definition list of facts, a footer with a copyright notice. seed:207522b880fb2d32
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Pretendard is not bundled (no downloads, offline-safe), so the stack falls back to Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic.
