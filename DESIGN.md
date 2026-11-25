# Design system

Derived from the shipped `index.html` (YouTube → MP3 tool page). Describes what the code does, not intentions.

## World

A converter whose state you can see. Equalizer bars are the status display, in the hero field and in the tool panel's status strip. Drenched ultramarine hero, ink and cool-white below, acid lime reserved for the live signal. Modern product-UI vocabulary: heavy Korean sans, large type, flat surfaces, one soft shadow.

## Color

All tokens are `light-dark()` pairs on `:root`, so the page follows the system scheme.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--field` | #2433e8 | #1a24b8 | Hero field, step numerals (light), tonal bars |
| `--ground` | #f3f4fb | #0b0d24 | Page ground below the hero, input well |
| `--ink` | #0e1030 | #f2f3ff | Text on ground, rules, primary button (light) |
| `--muted` | #4a4d6e | #a9add6 | Secondary text |
| `--rule` | #d5d8ee | #262a5a | Hairlines |
| `--panel` | #ffffff | #12153a | Tool panel |
| `--strip` | #0e1030 | #070920 | Status strip |
| `--btn-bg` | #0e1030 | #c8f73a | Primary button |
| `--lime` | #c8f73a | #c8f73a | Live signal only: bars while converting or done, focus ring on blue, selection |
| `--coral` | #ff9a8c | #ff9a8c | Error state on the dark strip |

Strategy: Committed. One saturated field (the hero) carries the page; lime is rationed to state.

## Typography

One voice: `Pretendard Variable, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, system-ui, sans-serif`. Nothing is downloaded, so the page works offline on the LAN.

- Display (h1): `clamp(2.75rem, 7vw, 6rem)`, 800, line-height 1.1, tracking -0.035em, balanced.
- Section heading (h2): `clamp(2rem, 4vw, 3rem)`, 800, tracking -0.03em.
- Step numerals: 3.5rem, 800.
- Body 1.0625rem / 1.7. Lede 1.25rem. Status text 0.9375rem.
- Korean text uses `word-break: keep-all`. No monospace anywhere.

## Layout

- Page padding `--pad: clamp(1.25rem, 5vw, 4.5rem)`; content width capped at 80rem.
- Hero: slim nav, left-aligned headline, tool panel (max 56rem) under it, equalizer bars rising from the bottom edge behind the panel.
- How it works: three-column ordered list divided by a 2px ink rule, staggered downward (0, 2.5rem, 5rem) to read as sequence. Not cards.
- Notes: heading left (4/12), definition list right (8/12), hairline rows.
- Under 52rem: everything stacks, button goes full width, stagger removed.

## Components

- **Tool panel**: white (`--panel`), radius 1.25rem, padding 0.75rem, shadow `0 2px 6px` + `0 28px 48px -18px`. Holds the form and the status strip.
- **URL input**: 4rem tall, radius 0.9rem, well background, drawn link icon (24px grid, 1.75 stroke). Focus: border and 3px tinted ring in `--focus`.
- **Primary button** `.go`: 4rem tall, 800 weight, `--btn-bg`, press scale 0.98, disabled 0.6 opacity with progress cursor.
- **Status strip**: ink background, 24-bar meter plus one line of status text; "다시 받기" ghost button appears only in the done state.
- **Ghost button** `.again`: 1px white 35% border, download icon.

## States

`body[data-state]` is the single source: `idle`, `converting`, `done`, `error`.

- idle: meter bars static at 40% height, dim blue-gray; hero bars static.
- converting: meter bars lime and animated; hero bars lighten and animate; button disabled, label "변환 중…".
- done: meter bars lime, full height; filename shown; "다시 받기" visible.
- error: meter bars coral and flat; message in coral.

## Motion

One authored moment: hero bars rise in a staggered sequence on load (1s, `cubic-bezier(0.16, 1, 0.3, 1)`), then breathe while converting. Hover and press transitions are 200ms. `prefers-reduced-motion` removes all bar animation; state still reads through color, height, and text.

## Browser surfaces

Selection is lime on ink. Caret and focus ring follow `--focus` (lime on blue and in dark, ultramarine on white). Scrollbar colors are themed. Placeholder color is a dedicated token with AA contrast.

## Do / Don't

- Do keep lime for live state. Don't use it as decoration or for text on light grounds (fails contrast).
- Do put new content in hairline rows or ordered lists. Don't introduce same-size icon cards, gradients, glass, or glow.
- Do state only what the code does. Don't add numbers, speed claims, or testimonials.
