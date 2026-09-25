"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

let registered = false;

/** Registers the GSAP plugins used across the site. Safe to call repeatedly. */
export function registerMotion() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in lockstep. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  registerMotion();
  const lenis = new Lenis({ lerp: 0.095, anchors: { offset: -90 }, autoRaf: false, allowNestedScroll: true });
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  (window as Window & { tethericLenis?: Lenis }).tethericLenis = lenis;
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    delete (window as Window & { tethericLenis?: Lenis }).tethericLenis;
  };
}

/**
 * Reveals headings line by line from behind a mask. Only lines are split, so gradient
 * <em> accents (background-clip: text) stay intact inside each line.
 */
export function revealLines(targets: string | Element[], { scroll = true, delay = 0, stagger = 0.09, root }: { scroll?: boolean; delay?: number; stagger?: number; root?: ParentNode } = {}) {
  const elements = typeof targets === "string" ? Array.from((root ?? document).querySelectorAll(targets)) : targets;
  return elements.map((element) => SplitText.create(element, {
    type: "lines",
    mask: "lines",
    deepSlice: true,
    autoSplit: true,
    linesClass: "reveal-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 115,
        rotate: 2,
        duration: 1.15,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: scroll ? { trigger: element, start: "top 88%", once: true } : undefined,
      });
    },
  }));
}
