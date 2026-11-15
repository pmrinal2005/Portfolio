"use client";

import { useEffect, useRef, useState } from "react";
import { pillHero } from "@/content/pillHero";

declare global {
  interface Window {
    __recVideo?: (t: number) => number;
  }
}

/* ------------------------------------------------------------------ */
/* Timeline (one Web Animations timeline, every property keyed on the   */
/* same offsets so the whole reveal stays in sync)                      */
/* ------------------------------------------------------------------ */
const DUR = 2600;
const EASE_A = "cubic-bezier(.5,0,.3,1)";
const EASE_B = "cubic-bezier(.45,0,.3,1)";
const EASE_C = "cubic-bezier(.4,0,.2,1)";

/* keyframe offsets */
const OFF = [0, 0.12, 0.4, 0.72, 1];
const EASES = [EASE_A, EASE_B, EASE_C, EASE_C, EASE_C];
/* progress of the pill WIDTH / HEIGHT at each offset (0 = the "O", 1 = fully open) */
const P_W = [0, 0, 0.38, 0.86, 1];
const P_H = [0, 0, 0.35, 0.8, 1];
/* ring thickness left around the video (1 = ring of the letter, 0 = no ring) */
const RING = [1, 1, 0.7, 0.12, 0];
/* phone only: PR / JECTS leave the line early so the growing pill never covers them */
const P_Y = [0, 0, 0.85, 1, 1];
const P_X = [0, 0, 0.5, 0.9, 1];

const lerp = (a: string, b: string, p: number) =>
  p === 0 ? a : p === 1 ? b : `calc(${a} * ${(1 - p).toFixed(3)} + ${b} * ${p.toFixed(3)})`;

export default function PillHero() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [waves, setWaves] = useState(true);

  useEffect(() => {
    const root = rootRef.current!;
    const vid = videoRef.current!;
    const mqPhone = window.matchMedia("(max-width: 860px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rec = new URLSearchParams(window.location.search).get("rec") === "1";

    let disposed = false;
    let phone = mqPhone.matches;
    let revealed = false;
    let token = 0; // bumped by resize / collapse to cancel pending chains
    let anims: Animation[] = [];
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

      /* all sizes come from CSS custom properties, so they follow the viewport live */
      const size = (a: string, b: string, p: number) => lerp(a, b, p);

      const pill: Keyframe[] = OFF.map((offset, i) => {
        const kf: Keyframe = {
          offset,
          easing: EASES[i],
          width: size("var(--o-w)", "var(--pill-w)", P_W[i]),
          height: size("var(--o-h)", "var(--pill-h)", P_H[i]),
        };
        if (phone) {
          kf.transform = `translate(calc(-50% + ${lerp("var(--x-pill0)", "0px", P_X[i])}), -50%)`;
        }
        return kf;
      });

      /* the bold ring of the "O" thins away while the video window grows to fill the pill */
      const win: Keyframe[] = OFF.map((offset, i) => ({
        offset,
        easing: EASES[i],
        clipPath: `inset(calc(var(--ring-y) * ${RING[i]}) calc(var(--ring-x) * ${RING[i]}) round 999px)`,
      }));

      const list: (Animation | null)[] = [
        mk(pillRef.current, pill),
        mk(windowRef.current, win),
        mk(iconsRef.current, [
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.8, easing: "ease-out" },
          { opacity: 0.9, offset: 1 },
        ]),
      ];

      if (phone) {
        /* stacked: PR slides up, JECTS slides down around the opening pill */
        const part = (x0: string, x1: string, y1: string): Keyframe[] =>
          OFF.map((offset, i) => ({
            offset,
            easing: EASES[i],
            transform: `translate(calc(-50% + ${lerp(x0, x1, P_Y[i])}), calc(-50% + ${lerp("0px", y1, P_Y[i])}))`,
          }));
        list.push(
          mk(leftRef.current, part("var(--x-pr0)", "var(--x-pr1)", "var(--y-pr1)")),
          mk(rightRef.current, part("var(--x-j0)", "var(--x-j1)", "var(--y-j1)"))
        );
      } else {
        /* inline: the row stays centred and PR / JECTS are pushed apart by the opening pill */
        list.push(
          mk(heroRef.current, [
            { gap: "0.03em", offset: 0 },
            { gap: "0.03em", offset: 0.12, easing: EASE_B },
            { gap: "0.07em", offset: 1 },
          ])
        );
      }
      anims = list.filter((a): a is Animation => a !== null);
    };

    // finish every animation forwards: pill / ring / text land on the final state
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

    /* same timeline, played in reverse (recording mode only) */
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

    build();

    /* ---------------- start: once fonts are ready (and the section is on screen) ---------------- */
    const start = () => {
      if (revealed) return;
      revealed = true;
      const go = () => {
        if (disposed) return;
        open();
        if (rec) {
          // reference loop: reverse collapse starts at 5.4 s
          timers.push(
            window.setTimeout(() => {
              if (disposed) return;
              const my = ++token;
              close().then(() => {
                if (my === token) token++;
              });
            }, 5400)
          );
        }
      };
      if (document.fonts?.ready) document.fonts.ready.then(go);
      else go();
    };

    let io: IntersectionObserver | null = null;
    let vio: IntersectionObserver | null = null;

    if (rec) {
      // Recording mode: bring the section on screen, play at 0 s, frame-by-frame video seeking
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
        { threshold: 0.25 }
      );
      io.observe(root);

      // play the looping clip only while the section is on screen
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

    /* ---------------- resize ---------------- */
    const onResize = () => {
      if (mqPhone.matches !== phone) {
        phone = mqPhone.matches;
        build(); // rebuild keyframes for the new layout (desktop <-> phone)
        if (!revealed) return; // still waiting for the reveal: stay on the closed "O"
      } else if (!revealed) {
        return; // nothing running yet; sizes come from CSS variables
      }
      token++; // cancel any pending chain
      jumpToEnd(); // finish the running animation; the pill lands on its final size
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

  const { word, media, alt } = pillHero;

  return (
    <section id="pill-hero" className="ph" ref={rootRef} aria-label={`${word.label} — interactive reveal`}>
      <h2 className="sr-only">{word.label}</h2>

      {/* PR · pill (the "O") · JECTS */}
      <div className="ph-hero" ref={heroRef} role="group" aria-label={word.label}>
        <span className="ph-part ph-part-l" ref={leftRef} aria-hidden="true">
          {word.left}
        </span>

        <div className="ph-pill" ref={pillRef}>
          <div className="ph-window" ref={windowRef}>
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
          </div>
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

        <span className="ph-part ph-part-r" ref={rightRef} aria-hidden="true">
          {word.right}
        </span>
      </div>
    </section>
  );
}
