"use client";

import { useEffect } from "react";
import { prefersReducedMotion, registerMotion } from "@/components/motion/motion-system";
import { scramble } from "@/components/motion/site-motion";

/** Philosophy: sweeping monogram bars, a live belief counter and a scroll-drawn progress ring. */
export function PhilosophyMotion() {
  useEffect(() => {
    const number = document.querySelector<HTMLElement>(".beliefs__number");
    const beliefs = Array.from(document.querySelectorAll<HTMLElement>(".belief"));
    if (!number || !beliefs.length) return;
    const { gsap, ScrollTrigger } = registerMotion();
    const set = (index: number) => {
      const next = String(index + 1).padStart(2, "0");
      if (number.textContent === next) return;
      number.textContent = next;
      delete number.dataset.text;
      if (!prefersReducedMotion()) scramble(number, 380);
      beliefs.forEach((belief, position) => belief.classList.toggle("is-active", position === index));
    };
    const triggers = beliefs.map((belief, index) => ScrollTrigger.create({ trigger: belief, start: "top 58%", end: "bottom 58%", onToggle: (self) => { if (self.isActive) set(index); } }));
    if (prefersReducedMotion()) return () => triggers.forEach((trigger) => trigger.kill());

    const context = gsap.context(() => {
      gsap.from(".phil-bars i", { xPercent: (index) => (index % 2 ? 130 : -130), duration: 1.8, stagger: 0.14, ease: "expo.out", delay: 0.2 });
      gsap.to(".phil-bars i:nth-child(1)", { yPercent: -60, rotate: -4, ease: "none", scrollTrigger: { trigger: ".page-hero--bars", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".phil-bars i:nth-child(2)", { scaleX: 1.6, ease: "none", scrollTrigger: { trigger: ".page-hero--bars", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".phil-bars i:nth-child(3)", { yPercent: 60, rotate: 4, ease: "none", scrollTrigger: { trigger: ".page-hero--bars", start: "top top", end: "bottom top", scrub: true } });
      gsap.fromTo(".beliefs__progress", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: ".beliefs__list", start: "top 58%", end: "bottom 58%", scrub: true } });
      beliefs.forEach((belief) => {
        gsap.from(belief.querySelector("h2"), { rotateX: -80, yPercent: 60, opacity: 0, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: belief, start: "top 80%", once: true } });
      });
      gsap.from(".phil-system__word span", { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.08, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".phil-system", start: "top 70%", once: true } });
    });
    return () => { triggers.forEach((trigger) => trigger.kill()); context.revert(); };
  }, []);
  return null;
}
