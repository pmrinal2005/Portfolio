"use client";

import { useEffect, useRef, useState } from "react";
import { pillHero } from "@/content/pillHero";

declare global {
  interface Window {
    __recVideo?: (t: number) => number;
  }
}

/* ------------------------------------------------------------------ */
/* Timeline constants (2.1 s, one Web Animations timeline)             */
/* ------------------------------------------------------------------ */
const DUR = 2100;
const EASE_A = "cubic-bezier(.5,0,.3,1)";
const EASE_B = "cubic-bezier(.45,0,.3,1)";
const EASE_C = "cubic-bezier(.4,0,.2,1)";
const EASE_NAV = "cubic-bezier(.2,.8,.2,1)";

/* Phone geometry: pill = full width (100vw - 40px), final height = width / 1.85 */
const PH_FINAL = "((100vw - 40px) / 1.85)";

/* ------------------------------------------------------------------ */
/* Background strokes: 15 long white S-curves sweeping up and right    */
/* ------------------------------------------------------------------ */
const STROKES = Array.from({ length: 15 }, (_, i) => {
  const y0 = 930 - i * 54 + Math.sin(i * 1.7) * 26;
  const d1 = 70 + Math.sin(i * 0.9) * 60;
  const d2 = 300 + Math.cos(i * 1.3) * 90;
  const d3 = 460 + Math.sin(i * 2.1) * 110;
  const d4 = 420 + Math.cos(i * 0.7) * 120;
  const r = (n: number) => Math.round(n);
  return {
    d: `M -120 ${r(y0)} C 280 ${r(y0 + d1)}, 520 ${r(y0 - d2)}, 820 ${r(y0 - d2 * 0.85)} S 1200 ${r(y0 - d3)}, 1580 ${r(y0 - d4)}`,
    width: +(1.2 + (((i * 7) % 13) / 12) * 2.7).toFixed(2), // 1.2 – 3.9 px
    opacity: +(0.55 + (((i * 5) % 7) / 6) * 0.3).toFixed(2), // 0.55 – 0.85
  };
});

type Group = Animation[];

export default function PillHero() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const [waves, setWaves] = useState(true);

  useEffect(() => {
    const root = rootRef.current!;
    const vid = videoRef.current!;
    const mqPhone = window.matchMedia("(max-width: 720px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rec = new URLSearchParams(window.location.search).get("rec") === "1";

    let disposed = false;
    let phone = mqPhone.matches;
    let revealed = false;
    let busy = false;
    let token = 0; // bumped by resize / new replay to cancel pending chains
    let anims: Group = [];
    const timers: number[] = [];

    vid.muted = true;
    vid.defaultMuted = true;

    /* ---------------- recording hook ---------------- */
    window.__recVideo = (t: number) => {
      const d = Number.isFinite(vid.duration) && vid.duration > 0 ? vid.duration : 4.25;
      return (t % d) + 1 / 120;
    };

    /* ---------------- reduced motion: final state, video paused on poster ---------------- */
    if (reduce) {
      vid.pause();
      vid.removeAttribute("autoplay");
      vid.preload = "none";
      vid.load(); // drops any buffered frame so the poster stays on screen
      return () => {
        delete window.__recVideo;
      };
    }

    /* ---------------- keyframes ---------------- */
    const build = () => {
      anims.forEach((a) => a.cancel());
      const mk = (el: Element | null, kf: Keyframe[]) => {
        if (!el) return null;
        const a = el.animate(kf, { duration: DUR, fill: "both", easing: "linear" });
        a.pause();
        a.currentTime = 0;
        return a;
      };

      const gap = phone
        ? ["0.03em", "0.03em", "0.06em", "0.1em"]
        : ["0.026em", "0.026em", "0.05em", "0.085em"];

      const pill: Keyframe[] = phone
        ? [
            { height: "1.5px", offset: 0 },
            { height: "1.5px", offset: 0.14, easing: EASE_A },
            { height: `calc(${PH_FINAL} * 0.1)`, offset: 0.3, easing: EASE_B },
            { height: `calc(${PH_FINAL} * 0.55)`, offset: 0.58, easing: EASE_C },
            { height: `calc(${PH_FINAL})`, offset: 1 },
          ]
        : [
            { width: "0.012em", offset: 0 },
            { width: "0.012em", offset: 0.14, easing: EASE_A },
            { width: "0.16em", offset: 0.3, easing: EASE_B },
            { width: "1.81em", offset: 0.58, easing: EASE_C },
            { width: "3.62em", offset: 1 },
          ];

      const clip: Keyframe[] = [
        { clipPath: phone ? "inset(0% 50%)" : "inset(50% 0%)", offset: 0, easing: EASE_C },
        { clipPath: "inset(0% 0%)", offset: 0.14 },
        { clipPath: "inset(0% 0%)", offset: 1 },
      ];

      const list = [
        mk(pillRef.current, pill),
        mk(pillRef.current, clip),
        // hairline overlay fades 14% -> 30% (never the video itself)
        mk(lineRef.current, [
          { opacity: 1, offset: 0 },
          { opacity: 1, offset: 0.14, easing: "ease" },
          { opacity: 0, offset: 0.3 },
          { opacity: 0, offset: 1 },
        ]),
        mk(heroRef.current, [
          { gap: gap[0], offset: 0 },
          { gap: gap[1], offset: 0.14, easing: EASE_B },
          { gap: gap[2], offset: 0.58, easing: EASE_C },
          { gap: gap[3], offset: 1 },
        ]),
        mk(paperRef.current, [
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.45, easing: EASE_C },
          { opacity: 1, offset: 0.78 },
          { opacity: 1, offset: 1 },
        ]),
        mk(navRef.current, [
          { transform: "translateY(-140%)", offset: 0 },
          { transform: "translateY(-140%)", offset: 0.5, easing: EASE_NAV },
          { transform: "translateY(0%)", offset: 0.86 },
          { transform: "translateY(0%)", offset: 1 },
        ]),
        mk(footRef.current, [
          { transform: "translateY(160%)", offset: 0 },
          { transform: "translateY(160%)", offset: 0.52, easing: EASE_NAV },
          { transform: "translateY(0%)", offset: 0.9 },
          { transform: "translateY(0%)", offset: 1 },
        ]),
        mk(ruleRef.current, [
          { transform: "scaleX(0)", offset: 0 },
          { transform: "scaleX(0)", offset: 0.4, easing: EASE_C },
          { transform: "scaleX(1)", offset: 0.95 },
          { transform: "scaleX(1)", offset: 1 },
        ]),
        mk(iconsRef.current, [
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.8, easing: "ease-out" },
          { opacity: 0.85, offset: 1 },
        ]),
      ];
      anims = list.filter((a): a is Animation => a !== null);
    };

    // finish every animation forwards: pill width / clip / chrome land on the final state
    const jumpToEnd = () =>
      anims.forEach((a) => {
        a.playbackRate = 1;
        a.finish();
      });

    /* ---------------- playback ---------------- */
    const open = async () => {
      if (!anims.length) return false;
      anims.forEach((a) => {
        a.playbackRate = 1;
        a.currentTime = 0;
        a.play();
      });
      try {
        await anims[0].finished;
        return true;
      } catch {
        return false;
      }
    };

    /* same timeline, played in reverse */
    const close = async () => {
      if (!anims.length) return false;
      anims.forEach((a) => {
        a.playbackRate = -1;
        a.currentTime = DUR;
        a.play();
      });
      try {
        await anims[0].finished;
        return true;
      } catch {
        return false;
      }
    };

    const replay = async () => {
      if (busy) return;
      busy = true;
      const my = ++token;
      const closed = await close();
      if (closed && !disposed && my === token) await open();
      if (my === token) busy = false;
    };
    replayRef.current = replay;

    build();

    /* ---------------- start: once fonts are ready (and the hero is on screen) ---------------- */
    const start = () => {
      if (revealed) return;
      revealed = true;
      const go = () => {
        if (disposed) return;
        busy = true;
        open().then(() => {
          busy = false;
        });
        if (rec) {
          // reference loop: reverse collapse starts at 4.9 s
          timers.push(
            window.setTimeout(() => {
              if (disposed) return;
              busy = true;
              const my = ++token;
              close().then(() => {
                if (my === token) busy = false;
              });
            }, 4900)
          );
        }
      };
      if (document.fonts?.ready) document.fonts.ready.then(go);
      else go();
    };

    let io: IntersectionObserver | null = null;
    let vio: IntersectionObserver | null = null;

    if (rec) {
      // Recording mode: bring the hero on screen, play at 0 s, frame-by-frame video seeking
      vid.pause();
      vid.removeAttribute("autoplay");
      window.scrollTo(0, root.offsetTop);
      start();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            io?.disconnect();
          }
        },
        { threshold: 0.55 }
      );
      io.observe(root);

      // play the looping clip only while the hero is on screen
      vio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) vid.play().catch(() => {});
            else vid.pause();
          });
        },
        { threshold: 0.05 }
      );
      vio.observe(root);
    }

    /* ---------------- resize: finish running animation, reset pill width ---------------- */
    const onResize = () => {
      if (!revealed) return; // nothing running yet; initial reveal will use current geometry
      token++; // cancel any pending close -> open chain
      if (mqPhone.matches !== phone) {
        phone = mqPhone.matches;
        build(); // rebuild keyframes for the new layout (desktop <-> phone)
      }
      jumpToEnd(); // finish the running animation and reset the pill to its final size
      busy = false;
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      vio?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      anims.forEach((a) => a.cancel());
      delete window.__recVideo;
    };
  }, []);

  const { word, nav, footer, media, alt } = pillHero;

  return (
    <section id="pill-hero" className="ph" ref={rootRef} aria-label={`${word.label} — interactive hero`}>
      <h2 className="sr-only">{word.label}</h2>

      {/* soft paper background with flowing white lines */}
      <div className="ph-paper" ref={paperRef} aria-hidden="true">
        <svg viewBox="0 0 1440 960" preserveAspectRatio="none" focusable="false">
          {STROKES.map((s, i) => (
            <path key={i} d={s.d} strokeWidth={s.width} strokeOpacity={s.opacity} />
          ))}
        </svg>
      </div>

      {/* nav (drops in from the top) */}
      <nav className="ph-nav" ref={navRef} aria-label="Hero navigation">
        <ul className="ph-nav-left">
          {nav.left.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <ul className="ph-nav-right">
          {nav.right.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* WORD · pill · WORD */}
      <div className="ph-hero" ref={heroRef} role="group" aria-label={word.label}>
        <span className="ph-part" aria-hidden="true">
          {word.left}
        </span>

        <div className="ph-pill" ref={pillRef}>
          <div className="ph-media">
            <video
              ref={videoRef}
              src={media.video}
              poster={media.poster}
              muted
              loop
              playsInline
              preload="auto"
              aria-label={alt.pill}
            />
          </div>
          <div className="ph-line" ref={lineRef} aria-hidden="true" />
          <div className="ph-icons" ref={iconsRef}>
            {/* breeze */}
            <span className="ph-icon ph-icon-l" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5" />
                <path d="M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5" />
                <path d="M3 16h7.5a2.5 2.5 0 1 1-2.5 2.5" />
              </svg>
            </span>
            {/* speaker (toggles its sound waves; the clip itself is silent) */}
            <button
              type="button"
              className="ph-icon ph-icon-r"
              aria-pressed={waves}
              aria-label={waves ? "Sound waves on" : "Sound waves off"}
              onClick={() => setWaves((w) => !w)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
                {waves && (
                  <>
                    <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
                    <path d="M18.2 6.5a8 8 0 0 1 0 11" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <span className="ph-part" aria-hidden="true">
          {word.right}
        </span>
      </div>

      {/* footer bar (rises from the bottom) */}
      <div className="ph-footer" ref={footRef}>
        <p className="ph-note">{footer.dropCapText}</p>
        <div className="ph-rule" ref={ruleRef} aria-hidden="true" />
        <button type="button" className="ph-btn" onClick={() => replayRef.current()}>
          {footer.button}
        </button>
      </div>
    </section>
  );
}
