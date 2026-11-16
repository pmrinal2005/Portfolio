"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import PillHero from "./PillHero";
import VanteRibbon from "./VanteRibbon";
import ShowcaseSection from "./ShowcaseSection";
import FaqSection from "./FaqSection";

const NAME = "MRINAL PARIDA";

const SUMMARY =
  "Results-driven Computer Science and Data Science undergraduate student with hands-on experience in artificial intelligence, machine learning, deep learning, full-stack development, and data analysis. Demonstrated leadership as elected House Captain managing team coordination and communication across school-wide events. Built and deployed production-grade AI applications leveraging model deployment pipelines, data pipelines, data visualization and full-stack development practices.";

const OBJECTIVE =
  "Seeking to apply technical expertise and communication skills in a high impact engineering or data science role.";

const skills: { title: string; items: string[]; wide?: boolean }[] = [
  {
    title: "AI & Machine Learning",
    items: ["Machine Learning", "Deep Learning", "Model Deployment", "PyTorch", "Scikit-Learn", "Natural Language Processing", "Computer Vision"],
  },
  {
    title: "Data Science & Analytics",
    items: ["Data Analysis", "Data Visualization", "Data Pipelines", "Statistical Analysis", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
  },
  {
    title: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C/C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Django", "FastAPI", "Tailwind CSS", "Java Swing", "Framer Motion"],
  },
  {
    title: "Databases",
    items: ["Supabase", "MySQL Workbench", "PostgreSQL"],
  },
  {
    title: "Tools & Practices",
    items: ["Git", "Vite", "Agile Development", "DevOps Fundamentals", "Full-Stack Development", "Project Management"],
  },
  {
    title: "Soft Skills",
    items: ["Leadership", "Team Collaboration", "Communication", "Problem Solving", "Critical Thinking"],
    wide: true,
  },
];

const coursework: [string, string, string][] = [
  ["01", "Machine Learning", "Models, training & evaluation"],
  ["02", "Deep Learning", "Neural networks at scale"],
  ["03", "Data Structures & Algorithms", "The engineering foundation"],
  ["04", "Probability & Statistics", "The language of data"],
  ["05", "Operating Systems", "How software meets hardware"],
];

const totalSkills = skills.reduce((n, s) => n + s.items.length, 0);
const languageCount = skills.find((s) => s.title === "Languages")!.items.length;

const marqueeItems = [
  "Machine Learning",
  "Deep Learning",
  "PyTorch",
  "Computer Vision",
  "NLP",
  "Data Pipelines",
  "FastAPI",
  "React",
  "Next.js",
  "Python",
  "TypeScript",
  "PostgreSQL",
];

const photoId = "1dj8I1dt-5YG_5vNRgZujY3RXTKtBjT48";
const photoSrcs = [
  `https://lh3.googleusercontent.com/d/${photoId}=w2400`,
  `https://drive.google.com/thumbnail?id=${photoId}&sz=w2400`,
  `https://drive.google.com/uc?export=view&id=${photoId}`,
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLHeadingElement>(null);
  const t2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    /* Photo fallbacks */
    const photo = photoRef.current!;
    let si = 0;
    photo.onerror = () => {
      si++;
      if (si < photoSrcs.length) photo.src = photoSrcs[si];
      else photo.style.display = "none";
    };
    photo.src = photoSrcs[0];

    /* Smooth scroll */
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const onAnchor = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href")!;
      const flush = href === "#hero" || href === "#pill-hero" || href === "#vante" || href === "#faq";
      lenis.scrollTo(href, { offset: flush ? 0 : -60 });
    };
    anchors.forEach((a) => a.addEventListener("click", onAnchor));
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      anchors.forEach((a) => a.removeEventListener("click", onAnchor));
    });

    /* Fit headline */
    const t1 = t1Ref.current!;
    const t2 = t2Ref.current!;
    const fit = () => {
      t1.style.fontSize = t2.style.fontSize = "18vw";
      const w = t1.getBoundingClientRect().width;
      const target = window.innerWidth * 0.98;
      const fs = (parseFloat(getComputedStyle(t1).fontSize) * target) / w;
      t1.style.fontSize = t2.style.fontSize = fs + "px";
    };
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    fit();
    cleanups.push(() => window.removeEventListener("resize", fit));

    /* Scroll-driven hero */
    const hero = heroRef.current!;
    const pillEl = document.getElementById("pill-hero");
    const vanteEl = document.getElementById("vante");
    const faqEl = document.getElementById("faq");
    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = clamp(y / (hero.offsetHeight - vh));
      const a = ease(clamp((p - 0.12) / 0.4));
      const b = ease(clamp((p - 0.5) / 0.25));
      const c = ease(clamp((p - 0.65) / 0.25));
      maskRef.current!.style.opacity = String(1 - a);
      photo.style.transform = `scale(${1.12 - p * 0.12})`;
      t1.style.transform = `scaleY(${2.35 - a * 0.5})`;
      outlineRef.current!.style.opacity = String(b);
      t2.style.transform = `scaleY(1.85)`;
      subRef.current!.style.opacity = String(c);
      subRef.current!.style.transform = `translateY(${(1 - c) * 30}px)`;
      cueRef.current!.style.opacity = String(1 - clamp(p * 8));
      const ph = pillEl?.getBoundingClientRect();
      const vr = vanteEl?.getBoundingClientRect();
      const fq = faqEl?.getBoundingClientRect();
      const pillCoversTop =
        (!!ph && ph.top <= 56 && ph.bottom > 56) ||
        (!!vr && vr.top <= 56 && vr.bottom > 56) ||
        (!!fq && fq.top <= 56 && fq.bottom > 56);
      railRef.current!.classList.toggle("on", y > hero.offsetHeight - vh * 0.6 && !pillCoversTop);
      const max = document.documentElement.scrollHeight - vh;
      progRef.current!.style.width = (y / max) * 100 + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    cleanups.push(() => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    });

    /* Reveals */
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* Counter */
    const ct = counterRef.current!;
    const co = new IntersectionObserver(
      (es, o) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          o.disconnect();
          const to = totalSkills;
          const t0 = performance.now();
          const d = 2200;
          const step = (t: number) => {
            const k = clamp((t - t0) / d);
            ct.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 4))));
            if (k < 1) requestAnimationFrame(step);
          };
          step(t0);
        }),
      { threshold: 0.4 }
    );
    co.observe(ct);
    cleanups.push(() => co.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const mq = marqueeItems.map((t) => (
    <span key={t} style={{ margin: 0, color: "inherit" }}>
      {t}
      <span>✦</span>
    </span>
  ));

  return (
    <>
      {/* Sticky rail */}
      <header id="rail" ref={railRef}>
        <div className="name anton">{NAME}</div>
        <div className="meta">
          <span className="label hide-sm">
            Skills&nbsp;
            <b className="anton" style={{ color: "var(--fg)", fontSize: "1rem", letterSpacing: ".05em" }}>
              {totalSkills}
            </b>
          </span>
          <a href="#skills" className="label">Skills</a>
          <a href="#coursework" className="label">Coursework</a>
        </div>
        <div id="progress" ref={progRef} />
      </header>

      {/* Hero */}
      <section id="hero" ref={heroRef}>
        <div className="stage">
          <div className="photo-fallback" />
          <img className="photo" ref={photoRef} alt={`Portrait of ${NAME}`} referrerPolicy="no-referrer" />
          <div className="vignette" />
          <div className="mask" ref={maskRef}>
            <h1 ref={t1Ref}>{NAME}</h1>
          </div>
          <div className="outline" ref={outlineRef}>
            <h1 ref={t2Ref}>{NAME}</h1>
          </div>

          <div className="hero-top label" style={{ color: "#fff" }}>
            <span>Computer Science · Data Science</span>
            <span>AI · ML · Full-Stack · MMXXVI</span>
          </div>
          <div className="scroll-cue label" ref={cueRef} style={{ color: "#fff" }}>
            <span>Scroll</span>
            <i />
          </div>
          <div className="hero-sub" ref={subRef}>
            <p>Building production-grade AI, from data pipelines to deployment.</p>
            <div className="label" style={{ color: "#ddd", textAlign: "right" }}>
              Undergraduate Student<br />Elected House Captain
            </div>
          </div>
        </div>
      </section>

      {/* Profile & Skills */}
      <section id="skills" className="pad">
        <div className="wrap ledger-grid">
          <div className="ledger-head reveal">
            <div className="label">01 — Profile &amp; Skills</div>
            <h2 className="anton" style={{ marginTop: "1.2rem" }}>
              Data,<br />models &amp;<br />people.
            </h2>
            <p>{SUMMARY}</p>
            <p>{OBJECTIVE}</p>
          </div>
          <div className="cards">
            {skills.map((s, i) => (
              <article
                key={s.title}
                className={"card reveal" + (s.wide ? " wide" : "")}
                style={{ transitionDelay: (i % 2) * 120 + "ms" }}
              >
                <div className="top">
                  <span className="label">No. 0{i + 1}</span>
                  <span className="label">{s.items.length} skills</span>
                </div>
                <h3 className="anton">{s.title}</h3>
                <div className="chips">
                  {s.items.map((it) => (
                    <span key={it} className="chip">{it}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats">
        <div className="marquee anton">
          <div>{mq}{mq}{mq}{mq}</div>
        </div>
        <div className="wrap" style={{ padding: "6rem 2rem 5rem" }}>
          <div className="label reveal">02 — The Toolkit</div>
          <div className="big-num anton reveal" style={{ margin: "1rem 0 2rem" }}>
            <span ref={counterRef}>0</span>
          </div>
          <div className="label reveal" style={{ marginBottom: "3rem" }}>
            Tools, languages, frameworks &amp; disciplines across AI, data and full-stack engineering
          </div>
          <div className="stat-row reveal">
            <div><div className="k">Skill domains</div><div className="v">{skills.length}</div></div>
            <div><div className="k">Programming languages</div><div className="v">{languageCount}</div></div>
            <div><div className="k">Core courses</div><div className="v">{coursework.length}</div></div>
            <div><div className="k">Leadership role</div><div className="v">House Captain</div></div>
          </div>
        </div>
      </section>

      {/* Coursework */}
      <section id="coursework" className="pad">
        <div className="wrap">
          <div className="label reveal">03 — Relevant Coursework</div>
          <h2
            className="anton reveal"
            style={{ fontSize: "clamp(3.5rem,10vw,10rem)", lineHeight: 0.9, margin: "1.2rem 0 2rem" }}
          >
            Academic<br />foundation
          </h2>
          <p
            className="reveal"
            style={{ maxWidth: "60ch", fontSize: "1.15rem", fontWeight: 300, color: "#c9c5bd", lineHeight: 1.5, marginBottom: "4rem" }}
          >
            A strong academic foundation in data science and software engineering.
          </p>
          <div>
            {coursework.map(([n, title, ex]) => (
              <div key={n} className="essay reveal">
                <span className="label">{n}</span>
                <h3 className="anton">{title}</h3>
                <span className="ex">{ex}</span>
                <span className="label r">Course</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pill reveal hero */}
      <PillHero />

      {/* Vante scroll ribbon (project screenshots) — directly after PROJECTS */}
      <VanteRibbon />

      {/* Animated Project Showcase — directly above FAQ, below the Vante "Craft in Motion" ribbon */}
      <ShowcaseSection />

      {/* FAQ section — directly after the Project Showcase, before the footer */}
      <FaqSection />

      <footer id="contact" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="label">Open to high-impact engineering &amp; data science roles</div>
          <a href="mailto:?subject=Hello%20Mrinal" className="cta anton" style={{ marginTop: "1.5rem" }}>
            Write to<br />Mrinal →
          </a>
          <div
            className="label"
            style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginTop: "6rem" }}
          >
            <span>© 2026 {NAME}</span>
            <span>Computer Science &amp; Data Science · AI · ML · Full-Stack</span>
          </div>
        </div>
      </footer>
    </>
  );
}
