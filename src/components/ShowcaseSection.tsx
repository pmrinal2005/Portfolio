"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  showcaseIntro,
  showcaseMore,
  showcaseProjects,
  type ShowcaseProject,
} from "@/content/showcase";
import "./showcase.css";

/* ---------------------------------------------------------------------------
   Motion tokens (transform + opacity only → GPU friendly).
   <MotionConfig reducedMotion="user"> below disables the transform animations
   for visitors who prefer reduced motion (opacity fades are kept).
   --------------------------------------------------------------------------- */
const EASE = [0.2, 0.8, 0.2, 1] as const;
const STAGGER = 0.1;
const VIEWPORT = { once: true, amount: 0.2 } as const;

/** Section entrance: opacity 0 → 1, y 24 → 0 */
const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Staggered card reveal. `custom` = delay (index inside its visible row × 0.1s). */
const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay },
  }),
};

/** Hover choreography — the card drives its children through the "hover" label. */
const cardLift: Variants = {
  rest: { y: 0, transition: { duration: 0.4, ease: EASE } },
  hover: { y: -6, transition: { duration: 0.4, ease: EASE } },
};
const imageZoom: Variants = {
  rest: { scale: 1, transition: { duration: 0.8, ease: EASE } },
  hover: { scale: 1.05, transition: { duration: 0.8, ease: EASE } },
};
const accentRule: Variants = {
  rest: { scaleX: 0, transition: { duration: 0.45, ease: EASE } },
  hover: { scaleX: 1, transition: { duration: 0.55, ease: EASE } },
};
const titleShift: Variants = {
  rest: { x: 0, transition: { duration: 0.45, ease: EASE } },
  hover: { x: 6, transition: { duration: 0.45, ease: EASE } },
};
const arrowSlide: Variants = {
  rest: { x: -8, opacity: 0, transition: { duration: 0.35, ease: EASE } },
  hover: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE } },
};

/* Reduced-motion variants: opacity-only reveal, and hover never moves/zooms anything. */
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const still: Variants = { rest: {}, hover: {} };
/** Accent line is not a "movement" — keep it visible as a static indicator on hover. */
const accentFade: Variants = {
  rest: { opacity: 0, scaleX: 1, x: 0, transition: { duration: 0.2 } },
  hover: { opacity: 1, scaleX: 1, x: 0, transition: { duration: 0.2 } },
};

/* ---------------------------------------------------------------------------
   Column count (1 / 2 / 3) so the cascade delay follows the visible row.
   Breakpoints mirror showcase.css.
   --------------------------------------------------------------------------- */
const MQ_TABLET = "(min-width: 700px)";
const MQ_DESKTOP = "(min-width: 1100px)";

function subscribeColumns(cb: () => void) {
  const a = window.matchMedia(MQ_TABLET);
  const b = window.matchMedia(MQ_DESKTOP);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}
const getColumns = () =>
  window.matchMedia(MQ_DESKTOP).matches ? 3 : window.matchMedia(MQ_TABLET).matches ? 2 : 1;
const getServerColumns = () => 3;

function useColumns() {
  return useSyncExternalStore(subscribeColumns, getColumns, getServerColumns);
}

/* ---------------------------------------------------------------------------
   Small icons
   --------------------------------------------------------------------------- */
function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}
function GitGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 5l-3 3 3 3M10.5 5l3 3-3 3M9 3.5l-2 9" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Project card
   --------------------------------------------------------------------------- */
function ProjectCard({ project, index, columns }: { project: ShowcaseProject; index: number; columns: number }) {
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      className="sc-item"
      variants={reduce ? fadeOnly : cardReveal}
      custom={(index % columns) * STAGGER}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <motion.article
        className="sc-card"
        variants={reduce ? still : cardLift}
        initial="rest"
        animate={active ? "hover" : "rest"}
        onHoverStart={() => setActive(true)}
        onHoverEnd={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(false);
        }}
        aria-labelledby={`sc-title-${project.id}`}
      >
        <div className="sc-media">
          <motion.div className="sc-media-zoom" variants={reduce ? still : imageZoom}>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
              className="sc-img"
            />
          </motion.div>
          <span className="sc-media-shade" aria-hidden="true" />
          <span className="sc-num label" aria-hidden="true">No. {number}</span>
        </div>

        <div className="sc-body">
          <div className="sc-kind label">{project.kind}</div>
          <h3 id={`sc-title-${project.id}`} className="sc-title anton">
            <motion.span className="sc-title-text" variants={reduce ? still : titleShift}>
              {project.title}
            </motion.span>
            <motion.span className="sc-title-arrow" variants={reduce ? accentFade : arrowSlide} aria-hidden="true">
              →
            </motion.span>
          </h3>
          <motion.i className="sc-rule" variants={reduce ? accentFade : accentRule} aria-hidden="true" />
          <p className="sc-desc">{project.description}</p>

          <ul className="sc-tags" aria-label={`${project.title} tech stack`}>
            {project.tags.map((t) => (
              <li key={t} className="sc-tag">{t}</li>
            ))}
          </ul>

          <div className="sc-actions">
            {project.live && (
              <a className="sc-link" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live (opens in a new tab)`}>
                Live <ArrowUpRight />
              </a>
            )}
            <a className="sc-link" href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source on GitHub (opens in a new tab)`}>
              Repo <GitGlyph />
            </a>
          </div>
        </div>
      </motion.article>
    </motion.li>
  );
}

/* Ninth tile: closes the grid cleanly in 1 / 2 / 3 columns (8 projects + this). */
function MoreCard({ index, columns }: { index: number; columns: number }) {
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="sc-item sc-item-more"
      variants={reduce ? fadeOnly : cardReveal}
      custom={(index % columns) * STAGGER}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <motion.a
        className="sc-card sc-more"
        href={showcaseMore.href}
        target="_blank"
        rel="noopener noreferrer"
        variants={reduce ? still : cardLift}
        initial="rest"
        animate={active ? "hover" : "rest"}
        onHoverStart={() => setActive(true)}
        onHoverEnd={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${showcaseMore.title} (opens in a new tab)`}
      >
        <span className="label">All repositories</span>
        <span className="sc-more-title anton">{showcaseMore.title}</span>
        <i className="sc-rule sc-rule-static" aria-hidden="true" />
        <span className="sc-desc">{showcaseMore.description}</span>
        <motion.span className="sc-more-cta anton" variants={reduce ? still : titleShift} aria-hidden="true">
          github.com/pmrinal2005 →
        </motion.span>
      </motion.a>
    </motion.li>
  );
}

/* ---------------------------------------------------------------------------
   Section
   --------------------------------------------------------------------------- */
export default function ShowcaseSection() {
  const columns = useColumns();
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section id="showcase" className="sc-section" aria-labelledby="showcase-heading">
        <div className="wrap">
          <motion.header
            className="sc-head"
            variants={reduce ? fadeOnly : riseIn}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <div className="label">{showcaseIntro.eyebrow}</div>
            <h2 id="showcase-heading" className="sc-heading anton">
              {showcaseIntro.headline[0]}
              <br />
              {showcaseIntro.headline[1]}
            </h2>
            <p className="sc-lede">{showcaseIntro.lede}</p>
          </motion.header>

          <ul className="sc-grid" role="list">
            {showcaseProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} columns={columns} />
            ))}
            <MoreCard index={showcaseProjects.length} columns={columns} />
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}
