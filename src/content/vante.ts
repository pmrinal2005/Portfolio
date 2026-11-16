/**
 * Content for the "Vante" scroll-driven ribbon section (sits right after PROJECTS).
 * The ribbon cards are the project screenshots stored in /public/work.
 * Order matters: the FIRST SIX land in the 3x2 grid, the last two only appear in the ribbon.
 */
export type VanteItem = { title: string; src: string; alt: string };

export const vante: { items: VanteItem[] } = {
  items: [
    { title: "StillMe — Voice Dashboard", src: "/work/img1.png", alt: "StillMe voice dashboard with a text box and Speak button" },
    { title: "StillMe — Landing", src: "/work/img2.png", alt: "StillMe landing page: a voice for the moments when words get stuck" },
    { title: "LokMitra — Mission Deck", src: "/work/img3.png", alt: "LokMitra Sahayak mission deck dashboard" },
    { title: "LokMitra — Landing", src: "/work/img4.png", alt: "LokMitra landing page: every benefit you deserve, found and explained" },
    { title: "COMPASS — Decision Engine", src: "/work/img5.png", alt: "COMPASS decision engine landing page: stop searching, start deciding" },
    { title: "SCOUTT — Business Intelligence", src: "/work/img6.png", alt: "SCOUTT landing page: the Bloomberg Terminal for small business" },
    { title: "Bloom — Grow Beyond Limits", src: "/work/img7.png", alt: "Bloom landing page: grow beyond limits" },
    { title: "LokMitra — Your Sahayak", src: "/work/img8.png", alt: "LokMitra hero: your Sahayak" },
  ],
};
