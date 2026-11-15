# Mrinal Parida — Portfolio (Next.js + React)

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Lenis smooth scroll.

## What's in it
- Original portfolio: scroll-driven hero, Profile & Skills, Toolkit counter, Coursework, "Write to Mrinal" footer.
- **Pill reveal section** (`src/components/PillHero.tsx`), placed immediately BEFORE the footer:
  - Solid white background (`#fff`) — no paper texture, strokes, nav bar, side text or button.
  - The word is **PROJECTS** = `PR` + pill + `JECTS`. The pill *is* the letter **O**: it starts as the bold ring of an "O"
    with the video already playing in its counter, then opens (widens, ring thins away) into a large stadium pill
    while the video keeps playing.
  - Section is ~125 vh tall, type scales with `min(11vw, 29svh)`; the open pill is 4em x 2.6em (≈ 630-1100 px wide on desktops).
  - Phone / tablet (<= 860 px): single row `PR O JECTS` at rest; when it opens, `PR` slides up, `JECTS` slides down and the pill
    grows to the full width (minus 32 px) in between.
  - One Web Animations timeline (2.6 s), plays once when 25 % of the section is on screen; the video only plays while on screen.
  - Resize finishes any running animation and rebuilds the keyframes when crossing the 860 px breakpoint.
  - Reduced motion shows the final open state with the video paused on the poster.
  - Recording mode: `/?rec=1`.
- Copy for the section lives in `src/content/pillHero.ts`.

## Media (never removed — replace to change the pill scene)
Put files in `public/media/` with EXACT names:
- `pillvideo.mp4`  (looping, muted video)
- `pillimg.PNG`    (poster / first frame; note the capital PNG)

## Fonts
Self-hosted in `src/app/fonts/` (Inter variable 400–800, Anton, Newsreader) via `next/font/local`.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Sandbox: `pm2 start ecosystem.config.cjs` (after `npm run build`).

## Deploy to Vercel
`vercel.json` pins the Next.js framework preset, install/build commands, long-lived caching for `/media/*`
(range requests enabled for the video) and basic security headers. Import the repo in Vercel — no extra settings needed
(Node >= 20.9, set in `package.json` `engines`).

## Not implemented / next steps
- Optional: replace the placeholder portrait URL (Google Drive) in `Portfolio.tsx` with a local file.
