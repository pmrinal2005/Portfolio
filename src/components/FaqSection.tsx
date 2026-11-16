"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { faqContent, type FaqCategory } from "@/content/faq";
import "./faq.css";

function CategoryGlyph({ icon }: { icon: FaqCategory["icon"] }) {
  switch (icon) {
    case "bag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9.5 4h5l-1.2 2.6h-2.6L9.5 4z" />
          <path d="M8.5 6.6C6.2 8.4 5 11.2 5 14.3 5 18 7.8 20 12 20s7-2 7-5.7c0-3.1-1.2-5.9-3.5-7.7" />
          <path d="M12 10.2v5.6" />
          <path d="M13.8 11.4c0-.8-.8-1.3-1.8-1.3s-1.8.5-1.8 1.3.7 1.1 1.8 1.4c1.1.3 1.8.6 1.8 1.4s-.8 1.3-1.8 1.3-1.8-.5-1.8-1.3" />
        </svg>
      );
    case "candles":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 4v3m0 8v5" />
          <rect x="4.2" y="7" width="3.6" height="8" rx="1" />
          <path d="M12 3v5m0 7v6" />
          <rect x="10.2" y="8" width="3.6" height="7" rx="1" />
          <path d="M18 5v4m0 8v3" />
          <rect x="16.2" y="9" width="3.6" height="8" rx="1" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.8" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <path d="M16.5 7.5L20.5 3.5" />
          <path d="M17.5 3.5h3v3" />
        </svg>
      );
    case "trend":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 17L9.2 11.3l4 4L20.5 8" />
          <path d="M14.8 8h5.7v5.7" />
        </svg>
      );
  }
}

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const heroBtnRef = useRef<HTMLAnchorElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const catRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const accRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqContent.questions[0]?.id ?? null);
  const [introPending, setIntroPending] = useState(true);

  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqContent.questions;
    return faqContent.questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [query]);

  /* One-time Web Animations entrance (~1.6s) behind intro-pending with 3.8s failsafe */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroPending(false);
      return;
    }

    let cancelled = false;
    let started = false;
    const runningAnims: Animation[] = [];

    const clearPending = () => {
      if (!cancelled) setIntroPending(false);
    };

    /* 3.8s failsafe so content is guaranteed visible */
    const failsafeTimer = window.setTimeout(clearPending, 3800);

    const playSequence = () => {
      if (cancelled || started) return;
      started = true;

      const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";
      const animateEl = (
        el: Element | null | undefined,
        keyframes: Keyframe[],
        delay: number,
        duration: number
      ) => {
        if (!el || typeof el.animate !== "function") return;
        const anim = el.animate(keyframes, {
          delay,
          duration,
          easing: easeOut,
          fill: "both",
        });
        runningAnims.push(anim);
      };

      /* FAQ tag lifts and scales in, then headline rises 18u as one block */
      animateEl(
        tagRef.current,
        [
          { opacity: 0, transform: "translateY(12px) scale(0.92)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        0,
        480
      );
      animateEl(
        headlineRef.current,
        [
          { opacity: 0, transform: "translateY(calc(18 * var(--u)))" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        160,
        560
      );

      /* Lede, then white button */
      animateEl(
        ledeRef.current,
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        360,
        500
      );
      animateEl(
        heroBtnRef.current,
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        500,
        480
      );

      /* Search bar rises, then the four cards resolve in reading order, 85ms apart */
      animateEl(
        searchRef.current,
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        660,
        520
      );

      catRefs.current.forEach((cardEl, idx) => {
        animateEl(
          cardEl,
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          840 + idx * 85,
          500
        );
      });

      animateEl(
        accRef.current,
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        1040,
        550
      );

      Promise.allSettled(runningAnims.map((a) => a.finished)).then(() => {
        if (cancelled) return;
        setIntroPending(false);
        runningAnims.forEach((a) => a.cancel());
      });
    };

    /* Wait for fonts.ready or max 500ms, then trigger when in viewport */
    const fontsOrTimeout = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, 500)),
    ]);

    let io: IntersectionObserver | null = null;

    fontsOrTimeout.then(() => {
      if (cancelled) return;
      if (typeof IntersectionObserver === "undefined") {
        playSequence();
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            playSequence();
          }
        },
        { threshold: 0.08 }
      );
      io.observe(section);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failsafeTimer);
      io?.disconnect();
      runningAnims.forEach((a) => a.cancel());
    };
  }, []);

  const handleCategoryClick = (targetQuestionId: string) => {
    setQuery("");
    setOpenId(targetQuestionId);
    accRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={introPending ? "intro-pending" : undefined}
      aria-labelledby="fq-heading"
    >
      {/* Static CSS background: top spill, central green glow, stepped light bars */}
      <div className="fq-bg" aria-hidden="true">
        <div className="fq-bars">
          <div className="fq-bars-side fq-bars-l">
            <span className="fq-bar fq-bar-1" />
            <span className="fq-bar fq-bar-2" />
            <span className="fq-bar fq-bar-3" />
            <span className="fq-bar fq-bar-4" />
            <span className="fq-bar fq-bar-5" />
          </div>
          <div className="fq-bars-side fq-bars-r">
            <span className="fq-bar fq-bar-5" />
            <span className="fq-bar fq-bar-4" />
            <span className="fq-bar fq-bar-3" />
            <span className="fq-bar fq-bar-2" />
            <span className="fq-bar fq-bar-1" />
          </div>
        </div>
        <div className="fq-glow" />
        <div className="fq-spill" />
      </div>

      {/* Centred 1224u content column: Hero + Search + Category Pills + Accordion */}
      <div className="fq-col">
        <div className="fq-hero">
          <div className="fq-tag fq-anim" ref={tagRef}>
            {faqContent.hero.tag}
          </div>
          <h2 id="fq-heading" className="fq-headline fq-anim" ref={headlineRef}>
            {faqContent.hero.headline}
          </h2>
          <p className="fq-lede fq-anim" ref={ledeRef}>
            {faqContent.hero.ledeLine1}
            <br />
            {faqContent.hero.ledeLine2}
          </p>
          <a href={faqContent.hero.cta.href} className="fq-btn-white fq-anim" ref={heroBtnRef}>
            {faqContent.hero.cta.label}
          </a>
        </div>

        {/* Glass Search Bar */}
        <div className="fq-search fq-anim" ref={searchRef} role="search">
          <svg
            className="fq-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.8-3.8" />
          </svg>
          <input
            type="search"
            className="fq-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={faqContent.searchPlaceholder}
            aria-label={faqContent.searchPlaceholder}
          />
        </div>

        {/* 2x2 Pill Category Cards */}
        <div className="fq-cats">
          {faqContent.categories.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              className="fq-cat fq-anim"
              ref={(el) => {
                catRefs.current[idx] = el;
              }}
              onClick={() => handleCategoryClick(cat.targetQuestionId)}
            >
              <span className="fq-cat-disc">
                <CategoryGlyph icon={cat.icon} />
              </span>
              <span className="fq-cat-body">
                <span className="fq-cat-title">{cat.title}</span>
                <span className="fq-cat-meta">{cat.meta}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Smooth One-at-a-Time Accordion */}
        <div className="fq-acc fq-anim" ref={accRef}>
          {filteredQuestions.length === 0 ? (
            <p className="fq-empty" role="status">
              {faqContent.emptySearchMessage}
            </p>
          ) : (
            filteredQuestions.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `fq-panel-${item.id}`;
              const triggerId = `fq-trigger-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={"fq-item" + (isOpen ? " is-open" : "")}
                >
                  <button
                    id={triggerId}
                    type="button"
                    className="fq-q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenId((prev) => (prev === item.id ? null : item.id))
                    }
                  >
                    <span>{item.question}</span>
                    <span className="fq-chevron" aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6.2l4 4 4-4" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="fq-panel"
                  >
                    <div className="fq-panel-inner">
                      <div className="fq-answer-wrap">
                        <p className="fq-answer">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
