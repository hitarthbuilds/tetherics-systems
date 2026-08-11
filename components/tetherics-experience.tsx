"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { GlobalCursor } from "./global-cursor";
import { InfrastructureGraph } from "./infrastructure-graph";
import { MachineAssembly } from "./machine-assembly";
import { ArrowMark, StatusDot, SystemLabel, TechnicalCaption } from "./system-primitives";
import { SystemIndex } from "./system-index";
import { TopologyField } from "./topology-field";

type ExperienceState =
  | "INITIALIZING"
  | "STABLE"
  | "OBSERVING"
  | "MAPPING"
  | "CONNECTING"
  | "ESCALATING"
  | "UNSTABLE"
  | "CONVERGENCE"
  | "VOID";

const chapterStates: Record<string, ExperienceState> = {
  entry: "STABLE",
  thesis: "OBSERVING",
  software: "OBSERVING",
  intelligence: "MAPPING",
  architecture: "CONNECTING",
  machines: "ESCALATING",
  loop: "ESCALATING",
  falseend: "STABLE",
  deep: "UNSTABLE",
  infrastructure: "CONVERGENCE",
  research: "CONNECTING",
  ventures: "STABLE",
  contact: "VOID",
};

const navItems = [
  ["software", "SYSTEMS"],
  ["research", "RESEARCH"],
  ["ventures", "VENTURES"],
  ["directive", "DIRECTIVE"],
  ["contact", "TRANSMISSION"],
];

function BootSequence({ onReady }: { onReady: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setReady(true), 250);
    const exitTimer = window.setTimeout(onReady, 1150);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(exitTimer);
    };
  }, [onReady]);

  return (
    <div className={`boot-sequence${ready ? " is-ready" : ""}`} aria-live="polite">
      <div className="boot-sequence__top">
        <strong>TETHERICS SYSTEMS</strong>
        <span>INFRASTRUCTURE ACCESS</span>
      </div>
      <div className="boot-sequence__status">
        <span>VISUAL SYSTEM</span>
        <span>{ready ? "READY" : "INITIALIZING"}</span>
        <i aria-hidden="true" />
      </div>
      <div className="boot-sequence__bottom">
        <span>NODE / IND-WEST-01</span>
        <button type="button" onClick={onReady}>SKIP / ENTER</button>
      </div>
    </div>
  );
}

function Navigation({ onOpenIndex }: { onOpenIndex: () => void }) {
  const [open, setOpen] = useState(false);

  const navigate = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="site-header">
        <button className="site-mark" type="button" onClick={() => navigate("entry")} aria-label="Return to Tetherics entry" data-cursor="ENTER">
          <span>TS</span><i aria-hidden="true" />
        </button>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map(([id, label]) => <button key={id} type="button" onClick={() => navigate(id)} data-cursor="ENTER">{label}</button>)}
        </nav>
        <button className="index-trigger" type="button" onClick={onOpenIndex} data-cursor="OPEN SYSTEM">
          INDEX <span>⌘K</span>
        </button>
        <button className="menu-trigger" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? "CLOSE" : "MENU"}
        </button>
      </header>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([id, label], index) => (
            <button key={id} type="button" onClick={() => navigate(id)}><span>0{index + 1}</span>{label}</button>
          ))}
          <button type="button" onClick={() => { setOpen(false); onOpenIndex(); }}><span>⌘</span>SYSTEM INDEX</button>
        </nav>
      )}
    </>
  );
}

function ClosedLoop({ onInspect }: { onInspect: (id: string) => void }) {
  const labels = ["ENVIRONMENT", "SENSING", "PERCEPTION", "STATE", "DECISION", "CONTROL", "ACTION"];
  return (
    <div className="closed-loop">
      <div className="closed-loop__orbit" aria-hidden="true"><i /><i /></div>
      {labels.map((label, index) => {
        const angle = (index / labels.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(angle) * 39;
        const y = 50 + Math.sin(angle) * 39;
        return (
          <button
            type="button"
            key={label}
            className="closed-loop__node"
            style={{ left: `${x}%`, top: `${y}%` }}
            onPointerEnter={() => onInspect(label.toLowerCase())}
            onFocus={() => onInspect(label.toLowerCase())}
            data-cursor="INSPECT"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
          </button>
        );
      })}
      <div className="closed-loop__core">
        <span>CLOSED LOOP</span>
        <strong>∆t</strong>
        <small>ACTION CHANGES ENVIRONMENT</small>
      </div>
    </div>
  );
}

function ExperienceDebug({ state, chapter, progress, inspected }: { state: ExperienceState; chapter: string; progress: number; inspected: string[] }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <details className="experience-debug">
      <summary>SYS DEBUG</summary>
      <dl>
        <div><dt>STATE</dt><dd>{state}</dd></div>
        <div><dt>CHAPTER</dt><dd>{chapter}</dd></div>
        <div><dt>SCROLL</dt><dd>{Math.round(progress * 100)}%</dd></div>
        <div><dt>QUALITY</dt><dd>{typeof window !== "undefined" && window.devicePixelRatio > 1.5 ? "HIGH" : "MEDIUM"}</dd></div>
        <div><dt>INSPECTED</dt><dd>{inspected.length}</dd></div>
      </dl>
    </details>
  );
}

export function TethericsExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [booting, setBooting] = useState(true);
  const [experienceState, setExperienceState] = useState<ExperienceState>("INITIALIZING");
  const [chapter, setChapter] = useState("entry");
  const [progress, setProgress] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [inspected, setInspected] = useState<string[]>([]);

  const finishBoot = useCallback(() => {
    setBooting(false);
    setExperienceState("STABLE");
  }, []);

  const inspect = useCallback((id: string) => {
    setInspected((current) => {
      const next = current.includes(id) ? current : [...current, id];
      try { window.sessionStorage.setItem("ts-inspected", JSON.stringify(next)); } catch { /* session memory is optional */ }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem("ts-inspected") || "[]");
      if (Array.isArray(stored)) {
        const restored = stored.filter((item): item is string => typeof item === "string");
        window.setTimeout(() => setInspected(restored), 0);
      }
    } catch { /* continue without session memory */ }
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIndexOpen((value) => !value);
      }
      if (event.key === "Escape") setIndexOpen(false);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    if (booting) return;
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    const ticker = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { yPercent: 110 }, {
          yPercent: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      if (!reducedMotion) {
        gsap.to(".architecture__world", {
          xPercent: -36,
          rotateY: -8,
          ease: "none",
          scrollTrigger: { trigger: ".architecture", start: "top top", end: "bottom bottom", scrub: 0.7 },
        });
        gsap.to(".deep-system__scale", {
          scale: 3.2,
          z: 700,
          ease: "power1.inOut",
          scrollTrigger: { trigger: ".deep-system", start: "top top", end: "bottom bottom", scrub: 1 },
        });
      }
    }, rootRef);

    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const value = documentHeight > 0 ? window.scrollY / documentHeight : 0;
      setProgress(value);
      document.documentElement.style.setProperty("--system-progress", String(value));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      const id = current.target.id;
      setChapter(id);
      setExperienceState(chapterStates[id] || "STABLE");
    }, { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.2, 0.5] });
    rootRef.current?.querySelectorAll<HTMLElement>("[data-chapter]").forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      context.revert();
      if (lenis) {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      }
    };
  }, [booting]);

  return (
    <div ref={rootRef} className="experience" data-state={experienceState.toLowerCase()} data-chapter={chapter}>
      {booting && <BootSequence onReady={finishBoot} />}
      <a className="skip-link" href="#software">Skip cinematic introduction</a>
      <GlobalCursor />
      <Navigation onOpenIndex={() => setIndexOpen(true)} />
      <SystemIndex open={indexOpen} onClose={() => setIndexOpen(false)} />

      <div className="global-grid" aria-hidden="true" />
      <div className="red-system-line" aria-hidden="true"><i /></div>
      <div className="experience-meter" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <aside className="temporal-ui" aria-label="Experience status">
        <span><StatusDot active /> EXPERIENCE / {experienceState}</span>
        <span>NODE / {chapter.toUpperCase()}</span>
      </aside>

      <main>
        <section id="entry" className="hero" data-chapter>
          <div className="hero__meta hero__meta--left">
            <span>TETHERICS SYSTEMS</span>
            <span>INDIA / 2026</span>
          </div>
          <div className="hero__meta hero__meta--right">
            <span>INFRASTRUCTURE STATUS</span>
            <span><StatusDot active /> OPERATIONAL</span>
          </div>
          <div className="hero__heading" aria-label="Everything is a system">
            <div className="reveal-mask"><span data-reveal>EVERYTHING</span></div>
            <div className="reveal-mask hero__middle"><span data-reveal>IS A</span></div>
            <div className="reveal-mask hero__last"><span data-reveal>SYSTEM.</span></div>
          </div>
          <div className="hero__coordinates" aria-hidden="true">
            <span>X / 19.0760</span><span>Y / 72.8777</span><span>Z / 0001</span>
          </div>
          <div className="hero__footer">
            <p>BUILDING THE INFRASTRUCTURE BETWEEN<br />INTELLIGENCE AND THE PHYSICAL WORLD.</p>
            <a href="#thesis" data-cursor="ENTER">ENTER SYSTEM <ArrowMark /></a>
          </div>
          <div className="hero__aperture" aria-hidden="true"><i /><i /><i /></div>
        </section>

        <section id="thesis" className="thesis" data-chapter>
          <SystemLabel id="THESIS / 00">TRANSFORMATION SEQUENCE</SystemLabel>
          <div className="thesis__statements">
            <p><span>SOFTWARE</span><strong>TRANSFORMED<br />INFORMATION.</strong></p>
            <p><span>INTELLIGENCE</span><strong>TRANSFORMED<br />SOFTWARE.</strong></p>
            <p className="thesis__now"><span>NOW</span><strong>THE PHYSICAL WORLD<br />IS BECOMING<br /><em>COMPUTABLE.</em></strong></p>
          </div>
          <div className="thesis__foot">
            <p>Tetherics Systems engineers intelligent systems spanning software, artificial intelligence, autonomous machines and industrial infrastructure.</p>
            <span>TETHERICS EXISTS<br />AT THAT INTERSECTION.</span>
          </div>
        </section>

        <section id="software" className="software" data-chapter>
          <div className="section-frame">
            <SystemLabel id="SYSTEM / 001">SOFTWARE</SystemLabel>
            <div className="section-intro">
              <h2><span data-reveal>INFORMATION</span><br /><span data-reveal>BECOMES</span><br /><span data-reveal>ACTION.</span></h2>
              <TechnicalCaption>THE FIRST LAYER IS ABSTRACT.<br />ITS CONSEQUENCES ARE NOT.</TechnicalCaption>
            </div>
            <div className="software-flow" aria-label="Software orchestration flow">
              <div className="software-flow__signal" aria-hidden="true" />
              {["OBSERVE", "MODEL", "REASON", "ORCHESTRATE", "ACT"].map((label, index) => (
                <button key={label} type="button" onPointerEnter={() => inspect(label.toLowerCase())} onFocus={() => inspect(label.toLowerCase())} data-cursor="INSPECT">
                  <small>0{index + 1}</small><strong>{label}</strong><span>{index === 0 ? "EVENT STREAM" : index === 4 ? "SYSTEM OUTPUT" : "STATE TRANSITION"}</span>
                </button>
              ))}
            </div>
            <article className="venture-record">
              <div className="venture-record__id"><span>TS/SYS-001</span><span>ACTIVE SYSTEM</span></div>
              <h3>SEERFLOW</h3>
              <p>Commerce infrastructure that observes, reasons and acts.</p>
              <div className="venture-record__diagram" aria-hidden="true"><i /><i /><i /><i /></div>
              <button type="button" onClick={() => inspect("seerflow")} data-cursor="OPEN SYSTEM">INSPECT SYSTEM ↗</button>
            </article>
          </div>
        </section>

        <section id="intelligence" className="intelligence" data-chapter>
          <div className="section-frame">
            <SystemLabel id="SYSTEM / 002">INTELLIGENCE</SystemLabel>
            <div className="intelligence__head">
              <h2>NOT A CHATBOX.<br /><em>A DYNAMIC STATE.</em></h2>
              <p>Perception, state estimation, reasoning and control operate as one responsive topology.</p>
            </div>
            <TopologyField onInspect={inspect} />
            <div className="intelligence__terms" aria-hidden="true">
              <span>PERCEPTION</span><span>REASONING</span><span>OPTIMIZATION</span><span>AUTONOMY</span>
            </div>
          </div>
        </section>

        <section id="architecture" className="architecture" data-chapter>
          <div className="architecture__sticky">
            <div className="architecture__world">
              <div className="architecture__slab architecture__slab--one"><span>DATABASE / CHAMBER 04</span></div>
              <div className="architecture__slab architecture__slab--two"><span>STATE STORAGE</span></div>
              <div className="architecture__slab architecture__slab--three"><span>CONTROL CORRIDOR</span></div>
              <div className="architecture__void"><i /><strong>COMPUTE<br />IS<br />SPACE.</strong></div>
              <div className="architecture__aperture"><span>PASS THROUGH ↓</span></div>
            </div>
            <div className="architecture__caption">
              <span>CHAPTER / ARCHITECTURE</span>
              <p>A database imagined as a building.<br />A control loop imagined as a corridor.</p>
            </div>
          </div>
        </section>

        <section id="machines" className="machines" data-chapter>
          <div className="machines__sticky">
            <SystemLabel id="SYSTEM / 003">MACHINES</SystemLabel>
            <div className="machines__title">
              <h2>INTELLIGENCE<br />ACQUIRES<br /><em>A BODY.</em></h2>
              <p>AN ORIGINAL AUTONOMOUS ACTUATOR ASSEMBLY<br />X-RAY / EXPLODED SYSTEM VIEW</p>
            </div>
            <MachineAssembly onInspect={inspect} />
          </div>
        </section>

        <section id="loop" className="loop" data-chapter>
          <div className="loop__head">
            <SystemLabel id="CONTROL / LOOP">AUTONOMY REQUIRES FEEDBACK</SystemLabel>
            <h2>THE OUTPUT<br />CHANGES THE<br /><em>INPUT.</em></h2>
          </div>
          <ClosedLoop onInspect={inspect} />
          <div className="machine-verbs">
            <span>PERCEIVE.</span><span>DECIDE.</span><span>ACT.</span>
          </div>
        </section>

        <section id="falseend" className="false-ending" data-chapter>
          <div className="false-ending__mark">TS</div>
          <h2>TETHERICS SYSTEMS</h2>
          <p>BUILDING THE INFRASTRUCTURE BETWEEN<br />INTELLIGENCE AND THE PHYSICAL WORLD.</p>
          <div className="false-ending__meta"><span>© 2026</span><span>INDIA</span><span>SYSTEM STATUS / STABLE</span></div>
          <a href="#deep" data-cursor="ENTER">SYSTEM CONTINUES <span>↓</span></a>
        </section>

        <section id="deep" className="deep-system" data-chapter>
          <div className="deep-system__sticky">
            <div className="deep-system__scale">
              <div className="deep-system__cell"><i /><span>A CELL.</span></div>
              <div className="deep-system__ring deep-system__ring--one"><span>A MACHINE.</span></div>
              <div className="deep-system__ring deep-system__ring--two"><span>A FACTORY.</span></div>
              <div className="deep-system__ring deep-system__ring--three"><span>A CITY.</span></div>
              <div className="deep-system__ring deep-system__ring--four"><span>A NETWORK.</span></div>
            </div>
            <p>SYSTEMS <em>WITHIN</em> SYSTEMS.</p>
          </div>
        </section>

        <section id="infrastructure" className="infrastructure" data-chapter>
          <div className="section-frame">
            <SystemLabel id="SYSTEM / 004">INFRASTRUCTURE CONVERGENCE</SystemLabel>
            <div className="infrastructure__head">
              <h2>THE MACHINE<br />WAS ONE<br /><em>NODE.</em></h2>
              <p>Software connects to intelligence. Intelligence connects to control. Control connects to machines. Machines alter the world. The world returns as data.</p>
            </div>
            <InfrastructureGraph inspected={inspected} />
          </div>
          <div className="convergence-statement">
            <p>THE MACHINE<br />IS NOT<br />THE PRODUCT.</p>
            <p>THE SYSTEM<br /><em>IS.</em></p>
          </div>
          <div className="reconfiguration" aria-hidden="true">
            <span>SYSTEM RECONFIGURATION</span><i /><i /><i /><i />
          </div>
        </section>

        <section id="research" className="research" data-chapter>
          <div className="section-frame">
            <SystemLabel id="ARCHIVE / 005">RESEARCH DIRECTIONS</SystemLabel>
            <h2>WHAT WE ARE<br /><em>LEARNING TO BUILD.</em></h2>
            <div className="archive-list">
              {[
                ["AR-01", "ROBOTICS", "PHYSICAL SYSTEMS"],
                ["AR-02", "MACHINE PERCEPTION", "SPATIAL INTELLIGENCE"],
                ["AR-03", "AUTONOMOUS SYSTEMS", "CLOSED-LOOP CONTROL"],
                ["AR-04", "SIMULATION", "COMPUTABLE ENVIRONMENTS"],
                ["AR-05", "INDUSTRIAL INTELLIGENCE", "INFRASTRUCTURE"],
              ].map(([id, name, field]) => (
                <button key={id} type="button" onClick={() => inspect(name.toLowerCase())} data-cursor="INSPECT">
                  <span>{id}</span><strong>{name}</strong><span>{field}</span><i>↗</i>
                </button>
              ))}
            </div>
            <p className="research__note">These are areas of exploration, not claims of published research.</p>
          </div>
        </section>

        <section id="ventures" className="ventures" data-chapter>
          <div className="section-frame">
            <SystemLabel id="VENTURES / 006">SYSTEMS CREATED WITHIN TETHERICS</SystemLabel>
            <div className="ventures__grid">
              <article className="venture-card venture-card--active">
                <span>TS/SYS-001</span><span>ACTIVE</span><h2>SEERFLOW</h2>
                <p>Commerce infrastructure that observes, reasons and acts.</p>
                <button type="button" onClick={() => inspect("seerflow")} data-cursor="OPEN SYSTEM">OPEN RECORD ↗</button>
              </article>
              <article className="venture-card venture-card--restricted">
                <span>TS/SYS-002</span><span>RESTRICTED</span><h2>02</h2>
                <p>NO PUBLIC SYSTEM RECORD.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="directive" className="directive" data-chapter>
          <SystemLabel id="DIRECTIVE / 01">OPERATING PRINCIPLE</SystemLabel>
          <h2>WE BUILD SYSTEMS THAT</h2>
          <div className="directive__verbs"><span>PERCEIVE,</span><span>DECIDE,</span><span>AND ACT.</span></div>
          <div className="directive__body">
            <p>We work across the boundary between computation and the physical world.</p>
            <p>Software is one layer.<br />Intelligence is another.<br />Machines make it physical.<br />Infrastructure makes it real.</p>
          </div>
        </section>

        <section id="contact" className="void" data-chapter>
          <div className="void__line" aria-hidden="true"><i /></div>
          <div className="void__sequence">
            <p>SOFTWARE<br />WAS ONLY<br />THE BEGINNING.</p>
            <p>INTELLIGENCE<br />NEEDS<br />A BODY.</p>
            <p>WE’RE<br />BUILDING IT.</p>
          </div>
          <div className="void__mark" aria-hidden="true"><span>T</span><i /></div>
          <div className="void__final">
            <h2>TETHERICS SYSTEMS</h2>
            <p>BUILDING THE INFRASTRUCTURE BETWEEN<br />INTELLIGENCE AND THE PHYSICAL WORLD.</p>
            <div><span>TRANSMISSION CHANNEL / NOT PUBLIC</span><button type="button" onClick={() => setIndexOpen(true)}>OPEN SYSTEM INDEX ↗</button></div>
          </div>
        </section>
      </main>

      <ExperienceDebug state={experienceState} chapter={chapter} progress={progress} inspected={inspected} />
    </div>
  );
}
