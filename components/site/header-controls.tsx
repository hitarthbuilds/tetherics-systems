"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lockup } from "@/components/brand/logo";
import { company } from "@/lib/product-family";
import { primaryNav, recordNav } from "@/lib/site";

type LenisLike = { stop: () => void; start: () => void };
declare global { interface Window { tethericLenis?: LenisLike } }

/** Hides the header while reading down, reveals it on the way up, and matches the section beneath it. */
export function HeaderController() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) > 6) {
        header.dataset.hidden = String(y > 240 && delta > 0 && !document.documentElement.classList.contains("menu-open"));
        last = y;
      }
      header.dataset.scrolled = String(y > 16);
      const beneath = document.elementsFromPoint(window.innerWidth / 2, 38).find((node) => !header.contains(node));
      header.dataset.theme = beneath?.closest("[data-theme]")?.getAttribute("data-theme") ?? "light";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return null;
}

const ease = [0.76, 0, 0.24, 1] as const;

/** A full-screen menu that opens as an expanding circle from the menu button. */
export function SiteMenu({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => { const frame = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const trigger = button.current;
    root.classList.add("menu-open");
    window.tethericLenis?.stop();
    const focusTimer = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a,button")?.focus(), 350);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", escape);
    return () => {
      window.clearTimeout(focusTimer);
      root.classList.remove("menu-open");
      window.tethericLenis?.start();
      document.removeEventListener("keydown", escape);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  const links = [...primaryNav, ...recordNav];
  return (
    <>
      <button ref={button} type="button" className="site-menu-button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)} data-cursor="Menu">
        <span className="site-menu-icon" aria-hidden="true"><i /><i /><i /></span><span>Menu</span>
      </button>
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div ref={panel} id="site-menu" className="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" data-theme="dark"
              initial={{ clipPath: "circle(0% at 94% 5%)" }} animate={{ clipPath: "circle(150% at 94% 5%)" }} exit={{ clipPath: "circle(0% at 94% 5%)" }} transition={{ duration: 0.85, ease }}>
              <div className="site-menu__bar">
                <span>TETHERIC / INDEX</span>
                <button type="button" onClick={() => setOpen(false)} className="site-menu__close" data-cursor="Close">Close <b aria-hidden="true">×</b></button>
              </div>
              <nav className="site-menu__nav" aria-label="All pages">
                {links.map((item, index) => (
                  <div key={item.href} className="site-menu__line">
                    <motion.div initial={{ y: "110%", rotate: 3 }} animate={{ y: "0%", rotate: 0 }} exit={{ y: "110%" }} transition={{ delay: 0.18 + index * 0.055, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
                      <Link href={item.href} onClick={() => setOpen(false)} aria-current={current === item.href ? "page" : undefined} data-cursor="Open">
                        <small>{String(index + 1).padStart(2, "0")}</small>{item.label}<b aria-hidden="true">↗</b>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>
              <motion.aside className="site-menu__aside" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.55, duration: 0.7 }}>
                <div className="site-menu__lockup"><Lockup tone="light" /></div>
                <a href={`mailto:${company.email}`}>{company.email} ↗</a>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
