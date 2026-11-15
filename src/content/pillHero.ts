/**
 * All editable copy for the "pill" reveal hero.
 * The brand word is split in two ("MRI" | "NAL") so the pill opens
 * between the I and the N, exactly like WI | LD in the original brief.
 */
export const pillHero = {
  word: { left: "MRI", right: "NAL", label: "Mrinal Parida" },
  nav: {
    left: [
      { label: "Home", href: "#hero" },
      { label: "Skills", href: "#skills" },
      { label: "Coursework", href: "#coursework" },
      { label: "Contact", href: "#contact" },
    ],
    right: [
      { label: "Email", href: "mailto:?subject=Hello%20Mrinal" },
      { label: "Back to top", href: "#hero" },
    ],
  },
  footer: {
    dropCapText:
      "Embark on a data-driven journey with Mrinal Parida. Discover the models, pipelines and full-stack builds behind every unforgettable project.",
    button: "Let's Get Building",
  },
  media: {
    video: "/media/pillvideo.mp4",
    poster: "/media/pillimg.PNG",
  },
  alt: {
    poster: "Still frame from the hero scene video",
    pill: "Looping hero scene video",
  },
} as const;
