"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion, registerMotion, revealLines, startSmoothScroll } from "./motion-system";

/** Lenis for the whole session; resets to the top on every route change. */
export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    const lenis = (window as Window & { tethericLenis?: { scrollTo: (target: number, options: { immediate: boolean }) => void } }).tethericLenis;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    const { ScrollTrigger } = registerMotion();
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

/** A dot and a lagging ring. The ring swells over anything interactive and can carry a label. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("a,button,summary,[data-cursor],[role=button]") : null;
      ring.current?.classList.toggle("is-active", Boolean(target));
      const text = target?.dataset.cursor ?? "";
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
      ring.current?.classList.toggle("has-label", Boolean(text));
    };
    const down = () => ring.current?.classList.add("is-pressed");
    const up = () => ring.current?.classList.remove("is-pressed");
    const leave = () => { x = y = -100; };
    const render = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      frame = requestAnimationFrame(render);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div className="site-cursor" aria-hidden="true">
      <div ref={ring} className="site-cursor__ring"><span ref={label} /></div>
      <div ref={dot} className="site-cursor__dot" />
    </div>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>+=_";

/** Cycles text through technical glyphs before it resolves. */
export function scramble(element: HTMLElement, duration = 700) {
  const original = element.dataset.text ?? element.textContent ?? "";
  element.dataset.text = original;
  if (!element.getAttribute("aria-label")) element.setAttribute("aria-label", original);
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const settled = Math.floor(progress * original.length);
    element.textContent = Array.from(original, (char, index) => index < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");
    if (progress < 1) requestAnimationFrame(step); else element.textContent = original;
  };
  requestAnimationFrame(step);
}

/** Site-wide scroll choreography, driven by data attributes so pages stay declarative. */
function useSiteChoreography(anchor: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = anchor.current?.closest<HTMLElement>(".page-root") ?? document.body;
    if (!anchor.current || prefersReducedMotion()) return;
    const { gsap, SplitText } = registerMotion();
    const cleanups: (() => void)[] = [];
    const media = gsap.matchMedia();
    const horizontals = Array.from(node.querySelectorAll<HTMLElement>("[data-horizontal]"));
    if (horizontals.length) media.add("(min-width: 900px)", () => {
      horizontals.forEach((section) => {
        const track = section.querySelector<HTMLElement>("[data-horizontal-track]");
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1 } });
      });
    });
    const context = gsap.context(() => {
      const splits = revealLines(Array.from(node.querySelectorAll("[data-split]")));
      cleanups.push(() => splits.forEach((split) => split.revert()));
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const items = element.dataset.reveal === "stagger" ? Array.from(element.children) : [element];
        gsap.from(items, { y: 70, opacity: 0, rotateX: -12, transformOrigin: "50% 100%", duration: 1.1, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, { yPercent: Number(element.dataset.parallax) * -100, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<SVGPathElement>("[data-draw] path, [data-draw] line, [data-draw] circle").forEach((path) => {
        gsap.from(path, { drawSVG: "0%", duration: 1.8, ease: "power3.inOut", scrollTrigger: { trigger: path, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-scramble-in]").forEach((element) => {
        gsap.timeline({ scrollTrigger: { trigger: element, start: "top 92%", once: true, onEnter: () => scramble(element, 900) } });
      });
      gsap.utils.toArray<HTMLElement>("[data-fill]").forEach((element) => {
        const split = SplitText.create(element, { type: "words" });
        cleanups.push(() => split.revert());
        gsap.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: element, start: "top 78%", end: "bottom 42%", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const counter = { value: 0 };
        const pad = Number(element.dataset.pad ?? 2);
        gsap.to(counter, { value: Number(element.dataset.count), duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 90%", once: true }, onUpdate: () => { element.textContent = String(Math.round(counter.value)).padStart(pad, "0"); } });
      });
      gsap.utils.toArray<HTMLElement>("[data-flip]").forEach((group) => {
        gsap.from(group.children, { rotateY: -80, rotateX: 20, z: -200, opacity: 0, transformOrigin: "0% 50%", stagger: 0.12, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: group, start: "top 85%", once: true } });
      });
      const giant = node.querySelectorAll(".site-footer__giant path");
      if (giant.length) gsap.from(giant, { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: ".site-footer__giant", start: "top bottom", end: "bottom bottom", scrub: 1 } });
    }, node);
    const hover = (event: Event) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-scramble]") : null;
      if (target && !target.dataset.scrambling) {
        target.dataset.scrambling = "1";
        scramble(target, 450);
        window.setTimeout(() => delete target.dataset.scrambling, 500);
      }
    };
    node.addEventListener("pointerover", hover);
    return () => {
      node.removeEventListener("pointerover", hover);
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
      media.revert();
    };
  }, [anchor]);
}

/**
 * Mounted inside each page (via the shared footer) so it runs only after that page has
 * hydrated — mutating text earlier would fight React's hydration.
 */
export function SiteChoreography() {
  const anchor = useRef<HTMLSpanElement>(null);
  useSiteChoreography(anchor);
  return <span ref={anchor} hidden />;
}

let visits = 0;

/** Wraps each route. Client navigations are revealed by the three bars of the monogram. */
export function PageTransition({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [curtain] = useState(() => typeof window !== "undefined" && visits++ > 0);
  return (
    <div ref={root} className="page-root">
      {curtain && (
        <div className="page-curtain" aria-hidden="true">
          {[0, 1, 2].map((bar) => (
            <motion.i key={bar} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.12 + bar * 0.09, duration: 0.9, ease: [0.76, 0, 0.24, 1] }} style={{ originX: 1 }} />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
