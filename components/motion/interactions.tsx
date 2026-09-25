"use client";

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

/** Pulls its content toward the pointer, then springs back. Mouse only. */
export function Magnetic({ children, strength = 0.32, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return <motion.span className={`magnetic ${className}`} style={{ x: springX, y: springY }} onPointerMove={move} onPointerLeave={reset}>{children}</motion.span>;
}

/** Perspective tilt with a travelling highlight, for product windows and cards. */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 });
  const glareX = useTransform(px, (value) => value * 100);
  const glareY = useTransform(py, (value) => value * 100);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(255,255,255,.34), transparent 42%)`;
  const glareOpacity = useSpring(hover, { stiffness: 200, damping: 30 });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - bounds.left) / bounds.width);
    py.set((event.clientY - bounds.top) / bounds.height);
    hover.set(1);
  };
  const reset = () => { px.set(0.5); py.set(0.5); hover.set(0); };
  return (
    <motion.div className={`tilt ${className}`} style={{ rotateX, rotateY, transformPerspective: 1400 }} onPointerMove={move} onPointerLeave={reset}>
      {children}
      <motion.span className="tilt-glare" aria-hidden="true" style={{ background: glare, opacity: glareOpacity }} />
    </motion.div>
  );
}

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/** An endless band whose speed and direction follow the reader's scroll velocity. */
export function VelocityMarquee({ children, speed = 2.4, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const reduce = useReducedMotion();
  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 380 });
  const boost = useTransform(velocity, [-1600, 0, 1600], [-5, 0, 5], { clamp: false });
  const direction = useRef(-1);
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const factor = boost.get();
    if (factor < -0.05) direction.current = 1;
    else if (factor > 0.05) direction.current = -1;
    const step = direction.current * speed * (delta / 1000);
    offset.set(offset.get() + step + step * Math.abs(factor));
  });
  return (
    <div className={`velocity-marquee ${className}`}>
      <motion.div className="velocity-marquee__track" style={{ x }}>
        <div className="velocity-marquee__group">{children}</div>
        <div className="velocity-marquee__group" aria-hidden="true">{children}</div>
      </motion.div>
    </div>
  );
}

/** The logo's accent bar, stretched across the page as a reading-progress indicator. */
export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return <motion.div className={`scroll-progress ${className}`} style={{ scaleX }} aria-hidden="true" />;
}
