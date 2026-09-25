"use client";

import { animate, createTimeline, stagger, svg } from "animejs";
import { useEffect, useRef } from "react";
import { Lockup } from "@/components/brand/logo";
import { prefersReducedMotion, registerMotion } from "@/components/motion/motion-system";
import { accentStops, lockupText, wordmark } from "@/lib/brand";

const INTRO_EVENT = "tetheric:intro-done";

function whenIntroDone(callback: () => void) {
  if (document.documentElement.classList.contains("intro-done")) { callback(); return () => {}; }
  window.addEventListener(INTRO_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, callback);
}

const heroLines = [{ text: "Clarity inside.", accent: false }, { text: "Possibility", accent: true }, { text: "outside.", accent: true }];
export const HERO_PROGRESS = "tetheric:hero-progress";

/**
 * The hero headline, set per character. Each character has an outer shell (scroll dispersal)
 * and an inner glyph (entrance + a variable-font swell as the pointer passes).
 */
export function HeroTitle() {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const node = title.current;
    if (!node) return;
    const shells = Array.from(node.querySelectorAll<HTMLElement>(".hero-char"));
    const glyphs = shells.map((shell) => shell.firstElementChild as HTMLElement);
    const lines = Array.from(node.querySelectorAll<HTMLElement>(".hero__line.is-accent"));
    const paintGradient = () => {
      const lineWidth = Math.max(...lines.map((line) => line.offsetWidth));
      lines.forEach((line) => line.querySelectorAll<HTMLElement>(".hero-char").forEach((shell) => {
        const glyph = shell.firstElementChild as HTMLElement;
        glyph.style.backgroundSize = `${lineWidth}px 100%`;
        glyph.style.backgroundPosition = `${line.offsetLeft - shell.offsetLeft}px 0`;
      }));
    };
    paintGradient();
    document.fonts?.ready.then(paintGradient);
    window.addEventListener("resize", paintGradient);
    if (prefersReducedMotion()) return () => window.removeEventListener("resize", paintGradient);

    const { gsap } = registerMotion();
    gsap.set(glyphs, { yPercent: 115, rotateX: -95, opacity: 0 });
    const reveal = () => gsap.to(glyphs, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.3, stagger: 0.03, ease: "expo.out", delay: 0.1, onComplete: () => node.classList.add("is-live") });
    const stop = whenIntroDone(reveal);

    const weights = glyphs.map(() => 0);
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!node.classList.contains("is-live") || window.scrollY > 40) return;
      let moving = false;
      glyphs.forEach((glyph, index) => {
        const box = glyph.getBoundingClientRect();
        const distance = Math.hypot(box.left + box.width / 2 - pointer.x, box.top + box.height / 2 - pointer.y);
        const target = pointer.active ? Math.max(0, 1 - distance / 240) : 0;
        weights[index] += (target - weights[index]) * 0.14;
        if (Math.abs(target - weights[index]) > 0.002) moving = true;
        const weight = weights[index];
        glyph.style.fontVariationSettings = `"wght" ${Math.round(600 + weight * 300)}, "wdth" ${Math.round(112 + weight * 13)}`;
        glyph.style.transform = `translateY(${(-weight * 12).toFixed(2)}px)`;
      });
      if (moving) paintGradient();
    };
    frame = requestAnimationFrame(loop);
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = event.pointerType === "mouse"; };
    const leave = () => { pointer.active = false; };
    const host = node.closest("section") ?? node;
    host.addEventListener("pointermove", move as EventListener);
    host.addEventListener("pointerleave", leave);
    return () => {
      stop();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", paintGradient);
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(glyphs);
    };
  }, []);

  return (
    <h1 ref={title} className="hero__title" aria-label="Clarity inside. Possibility outside.">
      {heroLines.map((line) => (
        <span key={line.text} className={`hero__line${line.accent ? " is-accent" : ""}`} aria-hidden="true">
          {line.text.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="hero-word">{Array.from(word).map((char, index) => <span key={index} className="hero-char"><span className="hero-glyph">{char}</span></span>)}</span>
          )).reduce<React.ReactNode[]>((all, word, index) => index ? [...all, " ", word] : [word], [])}
        </span>
      ))}
    </h1>
  );
}

/**
 * Pins the hero while it comes apart: the headline scatters, the 3D core dives in, and the
 * logo's accent bar sweeps across and opens to white — straight into the logo sequence.
 */
export function HeroScroll() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero || prefersReducedMotion()) return;
    const { gsap } = registerMotion();
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hero, start: "top top", end: "+=140%", pin: true, scrub: 0.8, anticipatePin: 1, onUpdate: (self) => window.dispatchEvent(new CustomEvent(HERO_PROGRESS, { detail: self.progress })) },
      });
      timeline
        .to(".hero-char", { x: () => gsap.utils.random(-900, 900), y: () => gsap.utils.random(-620, 520), rotate: () => gsap.utils.random(-200, 200), scale: () => gsap.utils.random(0.3, 2.6), opacity: 0, stagger: { each: 0.012, from: "center" }, duration: 0.55, ease: "power2.in" }, 0)
        .to(".hero__tagline, .hero__intro, .hero__actions, .hero__hud", { y: -80, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" }, 0)
        .fromTo(".hero__wipe i", { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power3.inOut" }, 0.62)
        .fromTo(".hero__wipe b", { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power3.inOut" }, 0.8);
    }, hero);
    return () => context.revert();
  }, []);
  return null;
}

const taglineWords = [{ text: "AI", x: 36, length: 61 }, { text: "AUTOMATION", x: 220, length: 483 }, { text: "ROBOTICS", x: 831, length: 365 }];
const pillars = [
  { label: "AI", title: "Intelligence that keeps its sources.", text: "SeerFlow answers keep the data behind them. Auctra’s AI specialists draft, and a person decides.", href: "/records/seerflow" },
  { label: "Automation", title: "Work that moves, with a person at the gate.", text: "Reconciliation, research and preparation move on their own—up to the point where a decision needs an owner.", href: "/records/auctra" },
  { label: "Robotics", title: "Systems that meet the physical world.", text: "A research direction, labelled as one. We will not present concept work as a shipped product.", href: "/philosophy" },
];

/** Pinned scroll sequence: the official lockup assembles from scattered parts, then its three disciplines unfold. */
export function BrandSequence() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node || prefersReducedMotion()) return;
    const { gsap } = registerMotion();
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 761px)", mobile: "(max-width: 760px)" }, (context) => {
      const mobile = Boolean(context.conditions?.mobile);
      const glyphs = node.querySelectorAll(".sequence__glyph");
      const timeline = gsap.timeline({ scrollTrigger: { trigger: node, start: "top top", end: mobile ? "+=190%" : "+=260%", scrub: 0.9, pin: ".sequence__pin", anticipatePin: 1 } });
      timeline
        .from(glyphs, { x: () => gsap.utils.random(-900, 900), y: () => gsap.utils.random(-500, 500), rotate: () => gsap.utils.random(-160, 160), scale: () => gsap.utils.random(0.2, 1.8), opacity: 0, transformOrigin: "50% 50%", stagger: { each: 0.04, from: "random" }, duration: 1.2, ease: "power3.out" })
        .from(".sequence__accent", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, ease: "expo.inOut" }, "-=0.25")
        .from(".sequence__tm", { scale: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(3)" }, "<0.2")
        .from(".sequence__descriptor", { opacity: 0, y: 40, duration: 0.4 }, "-=0.1")
        .from(".sequence__rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, ease: "expo.inOut" }, "<")
        .from(".sequence__tag", { opacity: 0, y: 50, stagger: 0.12, duration: 0.4, ease: "back.out(2)" }, "<0.2")
        .from(".sequence__pipe", { scaleY: 0, transformOrigin: "50% 50%", stagger: 0.1, duration: 0.3 }, "<0.1")
        .to(".sequence__captions span", { yPercent: -200, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
        .to(".sequence__mark", { scale: mobile ? 0.9 : 0.58, yPercent: mobile ? -30 : -42, duration: 0.8, ease: "power3.inOut" }, "+=0.15")
        .to(".sequence__kicker,.sequence__captions", { opacity: 0, duration: 0.3 }, "<")
        .from(".sequence__pillar", { yPercent: 120, rotateX: -70, opacity: 0, stagger: 0.14, duration: 0.8, ease: "expo.out" }, "<0.25")
        .to({}, { duration: 0.4 });
      return () => timeline.kill();
    });
    return () => media.revert();
  }, []);
  return (
    <section ref={section} className="sequence" data-theme="light" aria-labelledby="sequence-title">
      <div className="sequence__pin">
        <p className="sequence__kicker">THE MARK / STRUCTURE · SIGNAL · SYSTEM</p>
        <h2 id="sequence-title" className="sequence__title">Tetheric Systems Private Limited — AI, automation and robotics.</h2>
        <svg className="sequence__mark" viewBox="0 -40 1240 390" aria-hidden="true">
          <defs><linearGradient id="sequence-accent" gradientUnits="userSpaceOnUse" x1="0" x2="124">{accentStops.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />)}</linearGradient><linearGradient id="sequence-rule" gradientUnits="userSpaceOnUse" x1="35" x2="1196">{accentStops.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />)}</linearGradient></defs>
          {wordmark.glyphs.map((glyph) => <g key={glyph.x} transform={`translate(${glyph.x} 0)`}><path className="sequence__glyph" d={glyph.d} /></g>)}
          <g transform={`translate(${wordmark.accent.x} 0)`}><path className="sequence__accent" d={wordmark.accent.d} fill="url(#sequence-accent)" /></g>
          <g transform={`translate(${wordmark.trademark.x} ${wordmark.trademark.y})`}><path className="sequence__tm" d={wordmark.trademark.d} /></g>
          <text className="sequence__descriptor" x="36" y="207" textLength="1155" lengthAdjust="spacing">{lockupText.descriptor}</text>
          <rect className="sequence__rule" x="35" y="253" width="1161" height="3.5" fill="url(#sequence-rule)" />
          {taglineWords.map((word) => <text key={word.text} className="sequence__tag" x={word.x} y="336" textLength={word.length} lengthAdjust="spacing">{word.text}</text>)}
          <rect className="sequence__pipe" x="159" y="292" width="3.5" height="51" /><rect className="sequence__pipe" x="764" y="292" width="3.5" height="51" />
        </svg>
        <p className="sequence__captions" aria-hidden="true"><span>Structure.</span><span>Signal.</span><span>System.</span></p>
        <div className="sequence__pillars">
          {pillars.map((pillar, index) => (
            <a key={pillar.label} href={pillar.href} className="sequence__pillar" data-cursor="Open">
              <span>0{index + 1} / {pillar.label.toUpperCase()}</span>
              <strong>{pillar.title}</strong>
              <p>{pillar.text}</p>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Scroll pushes the camera through the O of CONNECTED and into the next section. */
export function ZoomStatement() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node || prefersReducedMotion()) return;
    const { gsap } = registerMotion();
    const word = node.querySelector<HTMLElement>(".zoom__word")!;
    const letter = node.querySelector<HTMLElement>(".zoom__o")!;
    const origin = () => {
      const w = word.getBoundingClientRect(), o = letter.getBoundingClientRect();
      return `${((o.left + o.width / 2 - w.left) / w.width) * 100}% ${((o.top + o.height * 0.52 - w.top) / w.height) * 100}%`;
    };
    const timeline = gsap.timeline({ scrollTrigger: { trigger: node, start: "top top", end: "+=220%", scrub: 1, pin: ".zoom__pin", invalidateOnRefresh: true } });
    timeline
      .from(".zoom__word .zoom__char", { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.5, ease: "back.out(2)" })
      .to(".zoom__kicker,.zoom__line", { opacity: 0, y: -40, duration: 0.3 }, "+=0.2")
      .to(word, { scale: 90, transformOrigin: origin, duration: 1.6, ease: "power3.in" }, "<");
    return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
  }, []);
  return (
    <section ref={section} className="zoom" data-theme="dark" aria-label="Everything is connected">
      <div className="zoom__pin">
        <p className="zoom__kicker">EVERYTHING IS A SYSTEM</p>
        <p className="zoom__word" aria-hidden="true">{Array.from("CONNECTED").map((char, index) => <span key={index} className={`zoom__char${index === 1 ? " zoom__o" : ""}`}>{char}</span>)}</p>
        <p className="zoom__line">A settlement means more beside an order.<br />An idea means more beside its brand.</p>
      </div>
    </section>
  );
}

/** anime.js: a dot field that ripples on a loop and on click, with packets of context crossing the bridge. */
export function SignalField() {
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = field.current;
    if (!node) return;
    const section = node.closest("section")!;
    const build = () => {
      node.replaceChildren();
      const { width, height } = section.getBoundingClientRect();
      const gap = width < 700 ? 34 : 44;
      const cols = Math.ceil(width / gap), rows = Math.ceil(height / gap);
      node.style.setProperty("--cols", String(cols));
      node.style.setProperty("--gap", `${gap}px`);
      const fragment = document.createDocumentFragment();
      for (let index = 0; index < cols * rows; index += 1) fragment.appendChild(document.createElement("i"));
      node.appendChild(fragment);
      return { cols, rows, dots: Array.from(node.children) as HTMLElement[] };
    };
    let grid = build();
    if (prefersReducedMotion()) return;
    const ripple = (from: number | "center") => animate(grid.dots, {
      scale: [{ to: 2.6, duration: 380 }, { to: 1, duration: 900 }],
      opacity: [{ to: 1, duration: 380 }, { to: 0.22, duration: 900 }],
      backgroundColor: [{ to: "#2bd8f0", duration: 380 }, { to: "#8fb6dc", duration: 900 }],
      delay: stagger(34, { grid: [grid.cols, grid.rows], from }),
      ease: "outQuad",
    });
    let wave = ripple("center");
    const timer = window.setInterval(() => { wave = ripple(Math.floor(Math.random() * grid.dots.length)); }, 4200);
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a,button")) return;
      const box = section.getBoundingClientRect();
      const gap = parseFloat(node.style.getPropertyValue("--gap"));
      const col = Math.floor((event.clientX - box.left) / gap), row = Math.floor((event.clientY - box.top) / gap);
      wave = ripple(Math.min(grid.dots.length - 1, row * grid.cols + col));
    };
    section.addEventListener("click", click);
    const packets = createTimeline({ loop: true });
    const packetNodes = section.querySelectorAll<HTMLElement>(".loop-packet");
    if (packetNodes.length && section.querySelector("#loop-path-forward")) {
      const forward = svg.createMotionPath("#loop-path-forward");
      const back = svg.createMotionPath("#loop-path-back");
      packetNodes.forEach((packet, index) => {
        packets.add(packet, { ...(index % 2 ? back : forward), opacity: [{ to: 1, duration: 200 }, { to: 1, duration: 1400 }, { to: 0, duration: 200 }], duration: 1800, ease: "inOutSine" }, index * 450);
      });
    }
    let resizeTimer = 0;
    const resize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { wave.revert(); grid = build(); }, 200); };
    window.addEventListener("resize", resize);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      section.removeEventListener("click", click);
      wave.revert();
      packets.revert();
    };
  }, []);
  return <div ref={field} className="signal-field" aria-hidden="true" />;
}

/** anime.js: the official lockup draws its own outlines, then fills. */
export function LockupDraw() {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = frame.current;
    if (!node || prefersReducedMotion()) return;
    const shapes = node.querySelectorAll<SVGGeometryElement>(".brand-lockup path, .brand-lockup rect");
    const texts = node.querySelectorAll<SVGTextElement>(".brand-lockup text");
    node.classList.add("is-drawing");
    const drawables = svg.createDrawable(Array.from(shapes));
    animate(drawables, { draw: "0 0", duration: 0 });
    animate(texts, { opacity: 0, duration: 0 });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const timeline = createTimeline({ defaults: { ease: "inOutQuart" } });
      timeline
        .add(drawables, { draw: ["0 0", "0 1"], duration: 1400, delay: stagger(90) })
        .add(shapes, { fillOpacity: [0, 1], duration: 700, delay: stagger(60) }, "-=600")
        .add(texts, { opacity: [0, 1], translateY: [24, 0], duration: 700, delay: stagger(160) }, "-=500")
        .add(node.querySelectorAll(".company-orbit"), { rotate: [0, 360], scale: [0.6, 1], opacity: [0, 1], duration: 1600, delay: stagger(150) }, 0);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={frame} className="family-company-mark">
      <i className="company-orbit" aria-hidden="true" /><i className="company-orbit" aria-hidden="true" />
      <Lockup />
      <span>ONE COMPANY.<br />THOUGHTFULLY CONNECTED.</span>
    </div>
  );
}

/** Orchestrates the intro, the hero entrance and the home page's scroll set pieces. */
export function HomeMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.querySelector<HTMLElement>(".brand-intro");
    const finish = () => {
      root.classList.add("intro-done");
      try { sessionStorage.setItem("tetheric-intro", "1"); } catch { /* storage is optional */ }
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
    if (prefersReducedMotion()) { finish(); return; }
    const { gsap, ScrollTrigger } = registerMotion();
    const context = gsap.context(() => {
      if (intro && !root.classList.contains("intro-done")) {
        window.tethericLenis?.stop();
        const counter = { value: 0 };
        const count = intro.querySelector(".brand-intro__count")!;
        gsap.timeline({ onComplete: () => { intro.style.display = "none"; window.tethericLenis?.start(); } })
          .from(".brand-intro .brand-glyph, .brand-intro .brand-trademark", { y: (index) => (index % 2 ? -220 : 220), rotate: (index) => (index % 2 ? -35 : 35), opacity: 0, transformOrigin: "50% 50%", duration: 1.1, stagger: 0.065, ease: "expo.out" })
          .from(".brand-intro .brand-accent", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8, ease: "expo.inOut" }, 0.55)
          .to(counter, { value: 100, duration: 1.7, ease: "power2.inOut", onUpdate: () => { count.textContent = String(Math.round(counter.value)).padStart(3, "0"); } }, 0)
          .from(".brand-intro__progress i", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.7, ease: "power2.inOut" }, 0)
          .from(".brand-intro__meta, .brand-intro__tag span", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6, ease: "power3.out" }, 0.5)
          .to(".brand-intro__stage", { scale: 1.12, opacity: 0, filter: "blur(10px)", duration: 0.55, ease: "power2.in" }, "+=0.2")
          .add(finish, "<0.25")
          .to(".brand-intro__slices i", { xPercent: (index) => (index % 2 ? -102 : 102), duration: 1, stagger: 0.08, ease: "expo.inOut" }, "<");
      } else {
        if (intro) intro.style.display = "none";
        finish();
      }
      whenIntroDone(() => gsap.fromTo("[data-hero-item]", { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1.3, ease: "expo.out", delay: 0.35 }));


      gsap.utils.toArray<HTMLElement>(".family-product-visual").forEach((visual, index) => {
        gsap.fromTo(visual, { clipPath: "inset(8% 100% 8% 0% round 16px)", rotateY: index ? 18 : -18, y: 120 }, { clipPath: "inset(0% 0% 0% 0% round 16px)", rotateY: 0, y: 0, ease: "none", scrollTrigger: { trigger: visual, start: "top 95%", end: "top 35%", scrub: 0.8 } });
      });
      gsap.fromTo(".seer-line", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: ".seer-trail", start: "top 90%", end: "bottom 45%", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>(".family-product h3").forEach((heading) => gsap.from(heading, { letterSpacing: "0.4em", opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: heading, start: "top 88%", once: true } }));

      const cards = gsap.utils.toArray<HTMLElement>(".stack__card");
      cards.forEach((card, index) => {
        gsap.from(card.querySelectorAll(".stack__art i"), { scaleX: 0, transformOrigin: "0% 50%", stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 75%", once: true } });
        if (index === cards.length - 1) return;
        gsap.to(card, { scale: 0.92, rotateX: 6, filter: "brightness(0.5) saturate(0.7)", ease: "none", scrollTrigger: { trigger: cards[index + 1], start: "top bottom", end: "top 22%", scrub: true } });
      });

      gsap.to(".band__row", { skewX: -8, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
    });
    const refresh = window.setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 400);
    return () => { window.clearTimeout(refresh); context.revert(); };
  }, []);
  return null;
}
