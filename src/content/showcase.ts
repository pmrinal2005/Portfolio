/**
 * Content for the "Animated Project Showcase" section (sits right above the FAQ).
 * Every card uses one of the preview images that already live in /public/work.
 * Descriptions are written from the READMEs / metadata of the matching repos on
 * https://github.com/pmrinal2005 (StillMe, LokMitra, COMPASS, SCOUTT, BLOOM).
 */
export type ShowcaseProject = {
  id: string;
  title: string;
  /** Short mono-style eyebrow shown on top of the card body. */
  kind: string;
  description: string;
  image: { src: string; alt: string };
  tags: string[];
  live?: string;
  repo: string;
};

export const showcaseIntro = {
  eyebrow: "04 — Project Showcase",
  headline: ["Project", "showcase"],
  lede: "Eight screens from the products I have designed, built and shipped — voice assistive tech, citizen-service agents, decision engines and creative AI. Hover a card for the live build and the source.",
} as const;

export const showcaseMore = {
  title: "More builds on GitHub",
  description:
    "Healthcare companions, AI interview practice, WhatsApp routers, deepfake-voice detection and more — every repository started as a problem I got curious about.",
  href: "https://github.com/pmrinal2005?tab=repositories",
} as const;

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "stillme-dashboard",
    title: "StillMe — Voice Dashboard",
    kind: "Assistive voice · Dashboard",
    description:
      "The working surface of StillMe, a human-gated voice prosthesis. A partner speaks, AssemblyAI transcribes, Groq drafts three editable replies, and only the exact words you approve are spoken aloud in your own voice. A detected pause is never treated as consent.",
    image: {
      src: "/work/img1.png",
      alt: "StillMe voice dashboard with a text box and a Speak button",
    },
    tags: ["Next.js", "TypeScript", "AssemblyAI", "Groq"],
    live: "https://still-me-one.vercel.app",
    repo: "https://github.com/pmrinal2005/StillMe",
  },
  {
    id: "stillme-landing",
    title: "StillMe — Landing",
    kind: "Assistive voice · Landing page",
    description:
      "The front door for StillMe: a voice for the moments when words get stuck. It is an assistive-communication prototype that keeps the person in control, with local-first storage in IndexedDB and a privacy-minded server path. Every call to action leads straight into the dashboard.",
    image: {
      src: "/work/img2.png",
      alt: "StillMe landing page: a voice for the moments when words get stuck",
    },
    tags: ["Next.js", "Dexie", "LiveKit", "Zod"],
    live: "https://still-me-one.vercel.app",
    repo: "https://github.com/pmrinal2005/StillMe",
  },
  {
    id: "lokmitra-deck",
    title: "LokMitra — Mission Deck",
    kind: "Civic AI · Dashboard",
    description:
      "The Sahayak mission deck from LokMitra, where an agent opens real government portals while you watch it work. It finishes with one plain-language Citizen Benefit Report that carries proof links, deadlines and a printable QR slip. Built on five TinyFish surfaces behind one conversation.",
    image: {
      src: "/work/img3.png",
      alt: "LokMitra Sahayak mission deck dashboard",
    },
    tags: ["Next.js 15", "TinyFish", "Groq", "Supabase"],
    live: "https://lokmitrabymrinal.vercel.app/",
    repo: "https://github.com/pmrinal2005/LokMitra",
  },
  {
    id: "lokmitra-landing",
    title: "LokMitra — Landing",
    kind: "Civic AI · Landing page",
    description:
      "Every benefit you deserve, found and explained. LokMitra is a voice-first, 22-language citizen assistant that navigates India's fragmented schemes such as PM-KISAN, PMFBY, Ayushman Bharat and eShram. It never asks for money and speaks the user's language.",
    image: {
      src: "/work/img4.png",
      alt: "LokMitra landing page: every benefit you deserve, found and explained",
    },
    tags: ["React 19", "TypeScript", "Motion", "Telegram Bot"],
    live: "https://lokmitrabymrinal.vercel.app/",
    repo: "https://github.com/pmrinal2005/LokMitra",
  },
  {
    id: "compass",
    title: "COMPASS — Decision Engine",
    kind: "Multi-agent system",
    description:
      "One decision engine, infinite verticals. COMPASS is a SerpApi-native multi-agent operating system that runs Plan, Search, Compare and Act pipelines across 14 specialised playbooks. It is a lean, zero-Docker, free-tier stack that runs comfortably on a 4 GB laptop.",
    image: {
      src: "/work/img5.png",
      alt: "COMPASS decision engine landing page: stop searching, start deciding",
    },
    tags: ["Python", "FastAPI", "LangGraph", "Next.js"],
    live: "https://compassbymrinal.vercel.app",
    repo: "https://github.com/pmrinal2005/COMPASS",
  },
  {
    id: "scoutt",
    title: "SCOUTT — Business Intelligence",
    kind: "Market intelligence",
    description:
      "A Bloomberg Terminal for small and mid-market businesses. Every morning SCOUTT scans regulations, competitors and sentiment, then fuses them into one threat-level score, a 24-hour pulse wheel and the top three actions to take today. An NVIDIA-powered chat answers questions with citations.",
    image: {
      src: "/work/img6.png",
      alt: "SCOUTT landing page: the Bloomberg Terminal for small business",
    },
    tags: ["Node.js", "Express", "NVIDIA NIM", "Supabase"],
    live: "https://scouttbymrinal.vercel.app/",
    repo: "https://github.com/pmrinal2005/SCOUTT",
  },
  {
    id: "bloom",
    title: "Bloom — Grow Beyond Limits",
    kind: "Creative AI",
    description:
      "An organic digital conservatory where unrelated worlds collide and cross-pollinate. Plant a problem on one side and a wild visual inspiration on the other, then watch interactive flowers mutate into production-ready blueprints. Powered by Google Gemma with a Zustand-driven React 19 front end.",
    image: {
      src: "/work/img7.png",
      alt: "Bloom landing page: grow beyond limits",
    },
    tags: ["React 19", "Vite", "Framer Motion", "Gemma"],
    live: "https://trybloomlabs.vercel.app",
    repo: "https://github.com/pmrinal2005/BLOOM",
  },
  {
    id: "lokmitra-hero",
    title: "LokMitra — Your Sahayak",
    kind: "Civic AI · Hero",
    description:
      "The hero of LokMitra, introducing your Sahayak, a helper built for farmers, gig workers, pensioners and first-generation students rather than for portal operators. It turns a spoken question in any of 22 languages into the right scheme, the right form and the right deadline.",
    image: {
      src: "/work/img8.png",
      alt: "LokMitra hero: your Sahayak",
    },
    tags: ["Next.js", "Groq", "Multilingual", "QR slips"],
    live: "https://lokmitrabymrinal.vercel.app/",
    repo: "https://github.com/pmrinal2005/LokMitra",
  },
];
