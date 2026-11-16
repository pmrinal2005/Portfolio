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
- **Vante ribbon section** (`src/components/VanteRibbon.tsx`, styles in `src/components/vante.css`, content in `src/content/vante.ts`),
  placed immediately AFTER the PROJECTS pill section and BEFORE the footer (`#vante`):
  - Scroll-driven three.js (0.170.0) hero. `CRAFT IN` / `MOTION` slide across in opposite directions while a ribbon of cards spirals
    along a fixed 3D rail (shallow ~5.4-7.6 unit near arc, far runs up to 24 units), then the cards land one by one in a 3x2 grid
    (2x3 below aspect .9). Everything derives from one smoothed progress value, so scrolling back reverses it exactly.
  - Cards are the 8 project screenshots in `public/work/img1..img8.png` (first six land in the grid, last two only appear in the ribbon).
    The fragment shader flips `uv.x` on back faces, so images are never mirrored. Hovering a grid card shows a name pill.
  - Progress is measured inside the section (not window scroll), so it works with the Lenis smooth scroll and the sections above it.
    Rendering pauses while the section is off screen; WebGL failure falls back to static typography; reduced motion disables the easing.
  - All CSS is scoped under `#vante` / `.vt-*` so nothing collides with the existing `.stage`, `footer`, etc. Fonts: Inter Tight + IBM Plex Mono
    via `next/font/google` (self-hosted at build time). Top/bottom section bars are omitted so the 3x2/2x3 project card grid sits cleanly centered on the dark background.
  - Replace a card by swapping the file in `public/work/` or editing `src/content/vante.ts` (order matters).
- **FAQ section** (`src/components/FaqSection.tsx`, styles in `src/components/faq.css`, content in `src/content/faq.ts`),
  placed immediately AFTER the Vante project showcase section and BEFORE the footer (`#faq`):
  - Near-black (`#090909`) section with static CSS central green glow, top light spill, and five stepped green light bars per side (`430..156u`).
  - Frosted-glass navigation (collapsing into an accessible drawer on tablet/phone), green-glass `FAQ` tag, Figtree 800 headline, Lexend 300 live search bar, 2x2 pill category cards, and smooth one-at-a-time `0fr -> 1fr` accordion aligned with Mrinal Parida's AI/ML & full-stack portfolio.
  - Web Animations entrance (~1.9 s) behind `intro-pending` with a 3.8 s failsafe and full `prefers-reduced-motion` support.

## Media (never removed — replace to change the pill scene)
Put files in `public/media/` with EXACT names:
- `pillvideo.mp4`  (looping, muted video)
- `pillimg.PNG`    (poster / first frame; note the capital PNG)

## Fonts
Self-hosted in `src/app/fonts/` (Inter variable 400–800, Anton, Newsreader) via `next/font/local`; Inter Tight and IBM Plex Mono via `next/font/google` (fetched at build time).

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Sandbox: `pm2 start ecosystem.config.cjs` (after `npm run build`).

## Deploy to Vercel
`vercel.json` pins the Next.js framework preset, install/build commands, long-lived caching for `/media/*`
(range requests enabled for the video), long-lived caching for `/work/*` (Vante screenshots) and basic security headers. Import the repo in Vercel — no extra settings needed
(Node >= 20.9, set in `package.json` `engines`).

## Not implemented / next steps
- Optional: replace the placeholder portrait URL (Google Drive) in `Portfolio.tsx` with a local file.
