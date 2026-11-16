"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vante } from "@/content/vante";
import "./vante.css";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const out = (t: number) => 1 - (1 - t) ** 3;
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/* card geometry */
const CARD_W = 2.1;
const CARD_H = 1.32;
const GAP = 0.03;
const STEP = CARD_W + GAP;
const NX = 28;
const NY = 3;
const GZ = 8;
const FOV = 35;
const SAMPLES = 1200;
const PH0 = -1.5;
const PH1 = Math.PI * 2 + 1.35;
const RIB_A = 0.14;
const RIB_B = 0.63;

const VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FS = `uniform sampler2D map;uniform vec2 cover;uniform float aspect,ready,radius;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=mix(vec3(.075),texture2D(map,(uv-.5)*cover+.5).rgb,ready);
  float edge=smoothstep(-.012-px,-.012,d);
  gl_FragColor=vec4(mix(c,vec3(1.),edge*.1),a);
}`;

type Rect = { x: number; y: number; w: number; h: number; vw: number; vh: number; c: number; r: number };
type Card = {
  i: number;
  title: string;
  tex: THREE.Texture;
  geo: THREE.PlaneGeometry;
  mat: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  rect: Rect | null;
};

export default function VanteRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const l1 = l1Ref.current!;
    const l2 = l2Ref.current!;
    const cap = capRef.current!;
    const rule = ruleRef.current!;
    const nameEl = nameRef.current!;
    const introEls = [hintRef.current!, pagerRef.current!, crossRef.current!, glowRef.current!];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- renderer ---------- */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      // No WebGL: the section simply shows its static typography.
      return;
    }
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    /* ---------- ribbon path ---------- */
    let PATH_L = 1;
    const pathP: THREE.Vector3[] = [];
    const pathT: THREE.Vector3[] = [];
    function buildPath() {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const t = i / 160;
        const ph = mix(PH0, PH1, t);
        const cs = Math.cos(ph);
        const u = 2 * t - 1;
        // a shallow arc close to the camera, then long runs far behind it
        const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
        const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
        pts.push(
          new THREE.Vector3(
            edge * Math.sin(ph) * depth * 0.561,
            0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63,
            -depth
          )
        );
      }
      const path = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      path.arcLengthDivisions = 1500;
      PATH_L = path.getLength();
      pathP.length = pathT.length = 0;
      for (let i = 0; i <= SAMPLES; i++) {
        const u = i / SAMPLES;
        pathP.push(path.getPointAt(u));
        pathT.push(path.getTangentAt(u));
      }
    }
    const at = (s: number, op: THREE.Vector3, ot: THREE.Vector3) => {
      const f = clamp(s / PATH_L) * SAMPLES;
      const i = Math.min(SAMPLES - 1, Math.floor(f));
      const k = f - i;
      op.lerpVectors(pathP[i], pathP[i + 1], k);
      ot.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
    };

    /* ---------- cards (project screenshots) ---------- */
    const loader = new THREE.TextureLoader();
    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const cards: Card[] = vante.items.map(({ title, src }, i) => {
      const tex = loader.load(src, (t) => {
        const img = t.image as { width: number; height: number };
        const va = img.width / img.height;
        const ca = CARD_W / CARD_H;
        mat.uniforms.cover.value.set(va > ca ? ca / va : 1, va > ca ? 1 : va / ca);
        mat.uniforms.ready.value = 1;
      });
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = maxAniso;
      const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
      const mat = new THREE.ShaderMaterial({
        vertexShader: VS,
        fragmentShader: FS,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          map: { value: tex },
          cover: { value: new THREE.Vector2(1, 1) },
          aspect: { value: CARD_W / CARD_H },
          ready: { value: 0 },
          radius: { value: 0.018 },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.visible = false;
      scene.add(mesh);
      return { i, title, tex, geo, mat, mesh, rect: null };
    });

    /* ---------- layout ---------- */
    let W = 1;
    let H = 1;
    let asp = 1;
    let cols = 3;
    let rows = 2;
    let tanH = 0.3153;
    function resize() {
      W = Math.max(1, stage.clientWidth);
      H = Math.max(1, stage.clientHeight);
      asp = W / H;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H, false);
      camera.aspect = asp;
      camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
      camera.updateProjectionMatrix();
      tanH = Math.tan((camera.fov * Math.PI) / 360);
      cols = asp < 0.9 ? 2 : 3;
      rows = asp < 0.9 ? 3 : 2;
    }
    resize();
    buildPath();
    const ro = new ResizeObserver(() => {
      resize();
      readScroll();
    });
    ro.observe(stage);

    function grid(i: number): Rect {
      const vh = 2 * GZ * tanH;
      const vw = vh * asp;
      const gw = vw * (cols === 3 ? 0.74 : 0.88);
      const gap = gw * 0.017;
      const cw = (gw - gap * (cols - 1)) / cols;
      const ch = cw / (CARD_W / CARD_H);
      const gh = ch * rows + gap * 1.6 * (rows - 1);
      const c = i % cols;
      const r = Math.floor(i / cols);
      return {
        x: -gw / 2 + cw / 2 + c * (cw + gap),
        y: gh / 2 - ch / 2 - r * (ch + gap * 1.6),
        w: cw,
        h: ch,
        vw,
        vh,
        c,
        r,
      };
    }

    /* ---------- scroll (progress inside this section only) ---------- */
    let target = 0;
    let p = 0;
    function readScroll() {
      const total = section.offsetHeight - stage.clientHeight;
      const top = section.getBoundingClientRect().top;
      target = total > 0 ? clamp(-top / total) : 0;
    }
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    readScroll();
    p = target;

    /* ---------- pose ---------- */
    const op = new THREE.Vector3();
    const ot = new THREE.Vector3();
    const up = new THREE.Vector3();
    const Y = new THREE.Vector3(0, 1, 0);
    const vp = new THREE.Vector3();
    function poseRibbon(c: Card, head: number) {
      const pos = c.geo.attributes.position;
      const centre = head - c.i * STEP;
      for (let iy = 0; iy <= NY; iy++)
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const lu = ix / NX - 0.5;
          const lv = 0.5 - iy / NY;
          at(centre + lu * CARD_W, op, ot);
          // keep the sheet upright
          up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
          vp.copy(op).addScaledVector(up, lv * CARD_H);
          pos.setXYZ(k, vp.x, vp.y, vp.z);
        }
      pos.needsUpdate = true;
    }
    function poseGrid(c: Card, q: number) {
      const g = grid(c.i);
      const pos = c.geo.attributes.position;
      const dx = (g.c - (cols - 1) / 2) * 1.2;
      const dy = g.r < rows / 2 ? 1 : -1;
      const ox = dx * g.vw * 0.62 * (1 - q);
      const oy = dy * g.vh * (g.c === 1 ? 0.95 : 0.34) * (1 - q);
      const tilt = (1 - q) * 0.22 * (g.c - 1 || 0.5) * dy;
      const cs = Math.cos(tilt);
      const sn = Math.sin(tilt);
      for (let iy = 0; iy <= NY; iy++)
        for (let ix = 0; ix <= NX; ix++) {
          const k = iy * (NX + 1) + ix;
          const x = (ix / NX - 0.5) * g.w;
          const y = (0.5 - iy / NY) * g.h;
          pos.setXYZ(
            k,
            g.x + ox + x * cs - y * sn,
            g.y + oy + x * sn + y * cs,
            -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI)
          );
        }
      pos.needsUpdate = true;
      c.rect = g;
    }

    /* ---------- render ---------- */
    function render() {
      const pp = p;
      // headline runs right across the page in opposite directions
      const rise = 1 - out(span(pp, 0, 0.12));
      const run = mix(-50, 76, span(pp, 0, 0.58));
      l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
      l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;
      cap.style.opacity = String(1 - span(pp, 0.52, 0.57));
      cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
      const intro = String(1 - span(pp, 0, 0.05));
      for (const el of introEls) el.style.opacity = intro;
      rule.style.transform = `scaleX(${ease(span(pp, 0.72, 0.86))})`;
      rule.style.top = "50%";
      // ribbon, then the grid
      const pr = span(pp, RIB_A, RIB_B);
      const head = mix(0, PATH_L + cards.length * STEP, pr);
      for (const c of cards) {
        const s = head - c.i * STEP;
        const end = PATH_L - CARD_W;
        if (s < end) {
          c.mesh.visible = s > CARD_W;
          c.rect = null;
          if (c.mesh.visible) poseRibbon(c, head);
        } else if (c.i < cols * rows) {
          // each card flies to its slot the moment it leaves the rail
          const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (PATH_L + cards.length * STEP));
          const q = out(span(pp, st, st + 0.13));
          c.mesh.visible = q > 0.001;
          if (c.mesh.visible) poseGrid(c, q);
        } else {
          c.mesh.visible = false;
          c.rect = null;
        }
      }
      renderer.render(scene, camera);
    }

    /* ---------- hover ---------- */
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      let hit: Card | null = null;
      if (p > 0.86) {
        const nx = mx / W - 0.5;
        const ny = 0.5 - my / H;
        for (const c of cards) {
          const g = c.rect;
          if (!g) continue;
          const x = nx * g.vw;
          const y = ny * g.vh;
          if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) hit = c;
        }
      }
      nameEl.style.opacity = hit ? "1" : "0";
      if (hit) {
        nameEl.textContent = hit.title;
        nameEl.style.transform = `translate(${mx + 14}px,${my + 16}px)`;
      }
    };
    const onLeave = () => {
      nameEl.style.opacity = "0";
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    /* ---------- loop (renders only while the section is on screen) ---------- */
    let visible = false;
    const io = new IntersectionObserver(
      (es) => {
        visible = es.some((e) => e.isIntersecting);
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(section);

    let raf = 0;
    let disposed = false;
    const loop = () => {
      if (disposed) return;
      p += (target - p) * (reduce ? 1 : 0.09);
      if (Math.abs(target - p) < 0.00005) p = target;
      if (visible) render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      cards.forEach((c) => {
        scene.remove(c.mesh);
        c.geo.dispose();
        c.mat.dispose();
        c.tex.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <section id="vante" ref={sectionRef} aria-label="Selected work — scroll ribbon">
      <div className="vt-stage" ref={stageRef}>
        <h2 className="vt-sr" aria-label="Craft in motion" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", margin: -1 }}>
          Craft in motion
        </h2>
        <div className="vt-hl vt-l1" ref={l1Ref} aria-hidden="true">
          <span>CRAFT IN</span>
        </div>
        <div className="vt-hl vt-l2" ref={l2Ref} aria-hidden="true">
          <span>MOTION</span>
        </div>
        <div className="vt-cap" ref={capRef}>
          Exploring ideas through daily design practice.
        </div>
        <div className="vt-glow" ref={glowRef} />
        <div className="vt-cross" ref={crossRef}>
          <i>+</i>
        </div>
        <div className="vt-rule" ref={ruleRef} />
        <canvas className="vt-gl" ref={canvasRef} aria-hidden="true" />
        <div className="vt-hint" ref={hintRef}>
          START A PROJECT &nbsp;→
        </div>
        <header className="vt-top">
          <div className="vt-logo">
            <svg viewBox="0 0 22 18" aria-hidden="true">
              <path d="M11 0l11 18h-6.200L11 9.600 6.200 18H0z" />
            </svg>
            VANTE
          </div>
          <div className="vt-pager" ref={pagerRef} aria-hidden="true">
            <span>←</span>
            <span>→</span>
          </div>
          <nav className="vt-acts" aria-label="Vante quick links">
            <a href="#contact">
              <i></i>LET&apos;S TALK
            </a>
            <a href="#skills">
              MENU<b></b>
            </a>
          </nav>
        </header>
        <footer className="vt-bot">
          <p>Concepts, explorations and interface experiments shared openly as part of our creative process.</p>
          <div className="vt-mid">
            VISUALS<s>/</s>FILM<s>/</s>MUSIC<s>/</s>EXPERIMENTS
          </div>
          <div className="vt-r">VIEW SHOWREEL</div>
        </footer>
        <div className="vt-name" ref={nameRef} aria-hidden="true" />
        {/* accessible list of the work shown on the canvas */}
        <ul style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", margin: -1 }}>
          {vante.items.map((it) => (
            <li key={it.src}>{it.alt}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
