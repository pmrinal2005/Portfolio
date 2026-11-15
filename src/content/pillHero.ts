/**
 * All editable copy for the "pill" reveal section.
 * The word PROJECTS is split in two ("PR" | "JECTS"): the pill IS the "O" of
 * PROJECTS. It starts as a bold ring shaped like the letter, then opens up
 * (widens + thins into a stadium) while the video keeps playing inside it.
 */
export const pillHero = {
  word: { left: "PR", right: "JECTS", label: "Projects" },
  media: {
    video: "/media/pillvideo.mp4",
    poster: "/media/pillimg.PNG",
  },
  alt: {
    poster: "Still frame from the projects scene video",
    pill: "Looping projects scene video",
  },
} as const;
