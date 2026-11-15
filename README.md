# Mrinal Parida — Portfolio (Next.js + React)

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Lenis smooth scroll.

## What's in it
- Original portfolio: scroll-driven hero, Profile & Skills, Toolkit counter, Coursework.
- NEW "Pill reveal" one-screen hero (`src/components/PillHero.tsx`) placed immediately BEFORE the "Write to Mrinal" footer.
  - Word `MRI | NAL`; a hairline opens into a slit, a circle, then a wide stadium pill showing a looping video.
  - One Web Animations timeline (2.1 s) driving: pill width/clip, hairline overlay, word gap, paper background + 15 white strokes (SVG), nav, footer, rule, icons.
  - "Let's Get Building" button plays the same timeline in reverse, then opens it again.
  - Resize finishes any running animation and resets the pill; speaker icon toggles its waves; reduced motion shows the final state with the video paused on the poster.
  - Phone (<= 720 px): stacked MRI / pill / NAL, pill opens vertically.
  - Recording mode: `/?rec=1` (reveal at 0 s, reverse collapse at 4.9 s, `window.__recVideo(t)`).
- All copy for the pill hero lives in `src/content/pillHero.ts`.

## Media (replace to change the pill scene)
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

## Not implemented / next steps
- Optional: replace the placeholder portrait URL (Google Drive) in `Portfolio.tsx` with a local file.
