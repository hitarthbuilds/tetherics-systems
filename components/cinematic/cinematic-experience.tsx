"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { GlobalCursor } from "../global-cursor";
import { InfrastructureGraph } from "../infrastructure-graph";
import { StatusDot } from "../system-primitives";
import { TopologyField } from "../topology-field";
import { CommandConsole, RecordDrawer } from "./command-console";
import { CinematicFilm } from "./cinematic-film";
import { CinematicRuntime, SCENES, type SceneId, useCinematicRuntime, useSceneProgress } from "./runtime";
import { SeerflowCommandCenter } from "./seerflow-command-center";
import { SystemInspector } from "./system-inspector";

const InteractiveSystemWorld = dynamic(() => import("./interactive-system-world").then((module) => module.InteractiveSystemWorld), {
  ssr: false,
  loading: () => <div className="interactive-system-world is-loading" aria-hidden="true" />,
});

function DeferredInteractiveSystemWorld() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const activate = () => setEnabled(true);
    const timer = window.setTimeout(activate, 1200);
    window.addEventListener("scroll", activate, { once: true, passive: true });
    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", activate);
      window.removeEventListener("pointerdown", activate);
    };
  }, []);

  return enabled ? <InteractiveSystemWorld /> : null;
}

function SceneLabel({ id }: { id: SceneId }) {
  const scene = SCENES.find((item) => item.id === id)!;
  return <div className="cine-label"><span>SCENE / {scene.number}</span><i /><span>{scene.label}</span></div>;
}

function Scene({ id, className, children }: { id: SceneId; className?: string; children: ReactNode }) {
  return <section id={id} data-scene={id} className={`cine-scene ${className || ""}`}>{children}</section>;
}

function BootGate() {
  const [status, setStatus] = useState<"INITIALIZING" | "READY">("INITIALIZING");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hideTimer: number | null = null;
    const ready = () => {
      setStatus("READY");
      if (hideTimer !== null) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setVisible(false), 520);
    };
    window.addEventListener("tetherics:cinematic-ready", ready);
    window.addEventListener("tetherics:cinematic-unavailable", ready);
    window.addEventListener("tetherics:3d-ready", ready);
    const fallback = window.setTimeout(ready, 3600);
    return () => {
      window.removeEventListener("tetherics:cinematic-ready", ready);
      window.removeEventListener("tetherics:cinematic-unavailable", ready);
      window.removeEventListener("tetherics:3d-ready", ready);
      window.clearTimeout(fallback);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className={`cine-boot is-${status.toLowerCase()}`} aria-live="polite">
      <div><strong>TETHERICS SYSTEMS</strong><span>INDIA / 2026</span></div>
      <p>INFRASTRUCTURE STATUS / {status}</p>
      <i aria-hidden="true" />
      <button type="button" onClick={() => setVisible(false)}>SKIP / ENTER</button>
    </div>
  );
}

function WorldNavigator() {
  const { activeIndex, jumpTo } = useCinematicRuntime();
  const active = SCENES[activeIndex] ?? SCENES[0];
  return (
    <nav className="world-navigator" aria-label="Interactive world scenes">
      <div><span>WORLD MAP</span><strong>{active.number} / {active.label}</strong></div>
      <div className="world-navigator__nodes">
        {SCENES.map((scene, index) => (
          <button
            key={scene.id}
            type="button"
            className={index === activeIndex ? "is-active" : undefined}
            aria-label={`Go to scene ${scene.number}: ${scene.label}`}
            aria-current={index === activeIndex ? "step" : undefined}
            title={`${scene.number} / ${scene.label}`}
            onClick={() => jumpTo(scene.id)}
          >
            <i /><span>{scene.number}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function PersistentInterface() {
  const { activeIndex, activeScene, audioEnabled, quality, setConsoleOpen, toggleAudio } = useCinematicRuntime();
  const scene = SCENES[activeIndex] || SCENES[0];

  return (
    <>
      <header className="cine-header">
        <button type="button" className="cine-mark" onClick={() => document.getElementById("signal")?.scrollIntoView({ behavior: "smooth" })} aria-label="Return to signal origin"><span>TS</span><i /></button>
        <div className="cine-header__state"><StatusDot active /><span>STATE / {scene.state}</span></div>
        <button type="button" onClick={toggleAudio}>AUDIO / {audioEnabled ? "ON" : "OFF"}</button>
        <button type="button" onClick={() => setConsoleOpen(true)}>INDEX / ⌘K</button>
      </header>
      <aside className="cine-telemetry" aria-label="Cinematic system telemetry">
        <span>SIGNAL / LIVE</span>
        <span>CAMERA / NODE {scene.number}</span>
        <span>RENDER / REALTIME PBR · {quality}</span>
        <span>FIELD / {activeScene === "recovery" ? "DEGRADED" : "ACTIVE"}</span>
      </aside>
      <div className="cine-progress" aria-hidden="true"><i /></div>
      <div className="cine-signal-spine" aria-hidden="true"><i /></div>
    </>
  );
}

function SignalScene() {
  return (
    <Scene id="signal" className="cine-signal">
      <div className="cine-sticky">
        <SceneLabel id="signal" />
        <div className="cine-signal__origin"><i /><span>SIGNAL DETECTED</span></div>
        <div className="cine-signal__intro"><span>TETHERICS SYSTEMS</span><span>INDIA / 2026</span><span>INFRASTRUCTURE STATUS / INITIALIZING</span></div>
        <div className="cine-signal__startup"><span>INTERACTIVE SYSTEM WORLD / ONLINE</span><strong>EVERYTHING<br />IS A SYSTEM.</strong><small>SCROLL TO MOVE · DRAG TO ORBIT · CLICK TO INSPECT</small></div>
        <h1><span>SOFTWARE</span><span>TRANSFORMED</span><span>INFORMATION.</span></h1>
        <p className="cine-scroll-cue">SCROLL / ADVANCE TIME ↓</p>
      </div>
    </Scene>
  );
}

const pipelineStages = [
  ["01", "OBSERVE", "EVENT STREAM / ACQUIRE"],
  ["02", "MODEL", "STATE / REPRESENT"],
  ["03", "REASON", "PATHS / RESOLVE"],
  ["04", "ORCHESTRATE", "DEPENDENCIES / CONNECT"],
  ["05", "ACT", "COMMAND / EMIT"],
];

function SoftwareScene() {
  const { inspect } = useCinematicRuntime();
  return (
    <Scene id="software" className="cine-software">
      <div className="cine-sticky">
        <SceneLabel id="software" />
        <h2>INFORMATION<br />BECOMES<br /><em>ACTION.</em></h2>
        <div className="live-pipeline" role="list" aria-label="Live computational pipeline">
          <div className="live-pipeline__path"><i /></div>
          {pipelineStages.map(([number, label, detail], index) => (
            <button key={label} type="button" role="listitem" style={{ "--stage": index } as CSSProperties} onClick={() => inspect(label.toLowerCase())}>
              <span>{number}</span><strong>{label}</strong><small>{detail}</small><i />
            </button>
          ))}
          <div className="live-pipeline__events" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
          <div className="live-pipeline__command"><span>CONTROL COMMAND</span><i /></div>
        </div>
      </div>
    </Scene>
  );
}

function IntelligenceScene() {
  const { inspect } = useCinematicRuntime();
  return (
    <Scene id="intelligence" className="cine-intelligence">
      <div className="cine-sticky cine-sticky--frame">
        <SceneLabel id="intelligence" />
        <div className="cine-intelligence__heading"><h2>INTELLIGENCE<br /><small>NOT A CHATBOX.</small><br /><em>A DYNAMIC STATE.</em></h2><p>POINTER / SENSOR<br />FIELD / LIVE</p></div>
        <TopologyField onInspect={inspect} />
        <div className="cine-intelligence__states"><span>PERCEPTION</span><span>STATE</span><span>MEMORY</span><span>REASONING</span><span>OPTIMIZATION</span><span>CONTROL</span></div>
      </div>
    </Scene>
  );
}

function SeerflowScene() {
  const progress = useSceneProgress("seerflow");
  const corrected = progress > 0.62;
  return (
    <Scene id="seerflow" className={`cine-seerflow${corrected ? " is-corrected" : ""}`}>
      <div className="cine-sticky">
        <SceneLabel id="seerflow" />
        <div className="seerflow-title"><span>TS/SYS-001 · LIVE PRODUCT</span><h2>SEERFLOW</h2><p>Business command centre for Indian D2C: profit, cash flow and return-to-origin intelligence.</p></div>
        <SeerflowCommandCenter />
        <div className="seerflow-state">
          <span>INVENTORY STATE / {corrected ? "NOMINAL" : "DEVIATION"}</span>
          <span>FULFILLMENT RISK / {corrected ? "RESOLVED" : "ELEVATED"}</span>
          <strong>{corrected ? "SYSTEM CORRECTED" : "REASONING THROUGH RESPONSE"}</strong>
        </div>
      </div>
    </Scene>
  );
}

function ArchitectureScene() {
  return (
    <Scene id="architecture" className="cine-architecture">
      <div className="cine-sticky">
        <SceneLabel id="architecture" />
        <div className="database-chamber" aria-hidden="true">
          <div className="database-chamber__slab slab-a"><span>TABLE / 01</span></div>
          <div className="database-chamber__slab slab-b"><span>INDEX / 07</span></div>
          <div className="database-chamber__slab slab-c"><span>NAMESPACE / CONTROL</span></div>
          <div className="database-chamber__door"><i /><span>PASS THROUGH</span></div>
        </div>
        <div className="database-copy"><span>DATABASE / CHAMBER 04</span><span>STATE STORAGE</span><span>CONTROL CORRIDOR</span><h2>COMPUTE<br />IS<br /><em>SPACE.</em></h2></div>
      </div>
    </Scene>
  );
}

function BoundaryScene() {
  return (
    <Scene id="boundary" className="cine-boundary">
      <div className="cine-sticky">
        <SceneLabel id="boundary" />
        <div className="pcb-world" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
          <span>DATA</span><span>BUS / 04</span><span>DRIVER</span><span>ACTUATOR</span>
        </div>
        <h2>INTELLIGENCE<br />ACQUIRES<br /><em>A BODY.</em></h2>
        <p>DIGITAL COMMAND / PHYSICAL CONSEQUENCE</p>
      </div>
    </Scene>
  );
}

function MachineScene() {
  const progress = useSceneProgress("machine");
  const { inspect } = useCinematicRuntime();
  const parts = [["TS-SEN/P04", "PERCEPTION", "perception"], ["TS-CMP/N08", "COMPUTE", "compute"], ["TS-CTL/C02", "CONTROL", "control"], ["TS-MEC/A01", "ACTUATION", "actuation"]] as const;
  return (
    <Scene id="machine" className="cine-machine">
      <div className="cine-sticky">
        <SceneLabel id="machine" />
        <div className="cine-machine__copy"><span>TS/MACHINE-01</span><h2>THE MACHINE<br /><em>AWAKENS.</em></h2><p>POWER → SENSORS → COMPUTE → CONTROL → ACTUATION</p></div>
        <div className="machine-3d-controls" aria-label="Inspectable 3D machine components">
          {parts.map(([code, label, id]) => <button key={id} type="button" onClick={() => inspect(id)}><span>{code}</span><strong>{label}</strong><i /></button>)}
        </div>
        <strong className={`machine-online${progress > 0.87 ? " is-online" : ""}`}>SYSTEM / ONLINE</strong>
      </div>
    </Scene>
  );
}

function PerceptionScene() {
  return (
    <Scene id="perception" className="cine-perception">
      <div className="cine-sticky">
        <SceneLabel id="perception" />
        <div className="perception-field" aria-hidden="true">
          <div className="perception-field__depth">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
          <div className="perception-field__object"><i /><span>STATE / ESTIMATED</span><small>CONFIDENCE / 0.94</small></div>
          <div className="perception-field__trajectory"><i /><i /><i /><i /></div>
        </div>
        <h2>RAW ENVIRONMENT<br /><span>→ SENSOR FIELD</span><br /><span>→ GEOMETRIC STATE</span></h2>
        <div className="perception-readout"><span>DISTANCE / 04.8M</span><span>VELOCITY / +0.21</span><span>ORIENTATION / 018°</span><span>∆t / 16MS</span></div>
      </div>
    </Scene>
  );
}

function ActuationScene() {
  const progress = useSceneProgress("actuation");
  return (
    <Scene id="actuation" className="cine-actuation">
      <div className="cine-sticky">
        <SceneLabel id="actuation" />
        <div className="actuation-trace"><span>CONTROL</span><i /><span>DRIVER</span><i /><span>ACTUATOR</span></div>
        <div className="actuator-rig" style={{ "--act": progress } as CSSProperties}><div className="actuator-rig__base" /><div className="actuator-rig__arm"><i /></div><div className="actuator-rig__load" /></div>
        <h2>ACT.</h2>
        <p>CONTROL AUTHORITY / APPLIED<br />FORCE VECTOR / RESOLVED</p>
      </div>
    </Scene>
  );
}

const loopNodes = ["ENVIRONMENT", "SENSING", "PERCEPTION", "STATE", "DECISION", "CONTROL", "ACTION"];

function FeedbackScene() {
  const { inspect } = useCinematicRuntime();
  return (
    <Scene id="feedback" className="cine-feedback">
      <div className="cine-sticky">
        <SceneLabel id="feedback" />
        <h2>THE OUTPUT<br />CHANGES THE<br /><em>INPUT.</em></h2>
        <div className="spatial-loop">
          <i className="spatial-loop__orbit" />
          {loopNodes.map((node, index) => {
            const angle = (index / loopNodes.length) * Math.PI * 2 - Math.PI / 2;
            return <button key={node} type="button" style={{ left: `${50 + Math.cos(angle) * 43}%`, top: `${50 + Math.sin(angle) * 43}%` }} onClick={() => inspect(node.toLowerCase())}><span>0{index + 1}</span><strong>{node}</strong></button>;
          })}
          <div className="spatial-loop__environment"><i /><span>POINTER<br />PERTURBATION</span></div>
        </div>
        <strong className="feedback-thesis">AUTONOMY REQUIRES FEEDBACK.</strong>
      </div>
    </Scene>
  );
}

function RecoveryScene() {
  const progress = useSceneProgress("recovery");
  const recovered = progress > 0.66;
  const confidence = Math.round(recovered ? 41 + (progress - 0.66) * 178 : 94 - progress * 92);
  return (
    <Scene id="recovery" className={`cine-recovery${recovered ? " is-recovered" : ""}`}>
      <div className="cine-sticky">
        <SceneLabel id="recovery" />
        <div className="recovery-state"><span>{recovered ? "ALTERNATE SENSOR PATH / ACTIVE" : "SIGNAL LOSS"}</span><h2>{recovered ? "SYSTEM\nRECOVERED" : "STATE\nDEGRADED"}</h2></div>
        <div className="recovery-metrics">
          <div><span>SENSOR CONFIDENCE</span><strong>{Math.min(96, confidence)}%</strong><i /></div>
          <div><span>STATE ESTIMATE</span><strong>{recovered ? "RECONSTRUCTED" : "DEGRADED"}</strong><i /></div>
          <div><span>CONTROL AUTHORITY</span><strong>{recovered ? "RESTORED" : "REDUCED"}</strong><i /></div>
        </div>
        <div className="recovery-routes" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </Scene>
  );
}

function ScaleScene() {
  return (
    <Scene id="scale" className="cine-scale">
      <div className="cine-sticky">
        <SceneLabel id="scale" />
        <div className="scale-recursion">
          <div><span>A MACHINE.</span></div><div><span>A FACTORY.</span></div><div><span>A CITY.</span></div><div><span>A NETWORK.</span></div>
        </div>
        <h2>SYSTEMS<br /><em>WITHIN</em><br />SYSTEMS.</h2>
      </div>
    </Scene>
  );
}

function ConvergenceScene() {
  const { inspect, inspected } = useCinematicRuntime();
  return (
    <Scene id="convergence" className="cine-convergence">
      <div className="cine-sticky cine-sticky--frame">
        <SceneLabel id="convergence" />
        <div className="convergence-copy"><h2>EVERY SCENE<br />WAS ONE<br /><em>TOPOLOGY.</em></h2><p>THE ENVIRONMENT RETURNS AS DATA.<br />THE SYSTEM IS RECURSIVE.</p></div>
        <InfrastructureGraph inspected={inspected} onInspect={inspect} />
      </div>
    </Scene>
  );
}

function RevelationScene() {
  return (
    <Scene id="revelation" className="cine-revelation">
      <div className="cine-sticky">
        <SceneLabel id="revelation" />
        <div className="revelation-copy"><p>THE MACHINE<br />IS NOT<br />THE PRODUCT.</p><p>THE SYSTEM<br /><em>IS.</em></p></div>
        <div className="revelation-scales"><span>A CELL IS A SYSTEM.</span><span>A MACHINE IS A SYSTEM.</span><span>A FACTORY IS A SYSTEM.</span><span>A CITY IS A SYSTEM.</span><span>A MARKET IS A SYSTEM.</span></div>
      </div>
    </Scene>
  );
}

function EverythingScene() {
  const { setConsoleOpen, setRecordsOpen } = useCinematicRuntime();
  return (
    <Scene id="everything" className="cine-everything">
      <div className="cine-sticky">
        <SceneLabel id="everything" />
        <div className="you-are-here"><i /><span>YOU ARE HERE.</span></div>
        <h2><span>EVERYTHING</span><span>IS A</span><span>SYSTEM.</span></h2>
        <div className="cine-everything__brand"><strong>TETHERICS SYSTEMS</strong><p>BUILDING THE INFRASTRUCTURE BETWEEN<br />INTELLIGENCE AND THE PHYSICAL WORLD.</p><span><StatusDot active /> SYSTEM STATUS / STABLE</span></div>
        <div className="cine-everything__actions">
          <button type="button" onClick={() => setConsoleOpen(true)}>OPEN SYSTEM INDEX ↗</button>
          <Link href="/evidence">EVIDENCE REGISTER ↗</Link>
          <Link href="/records/seerflow">SEERFLOW RECORD ↗</Link>
          <a href="https://seerflow.in" target="_blank" rel="noreferrer">OPEN SEERFLOW.IN ↗</a>
          <Link href="/methodology">CLAIMS METHOD ↗</Link>
          <Link href="/security">SECURITY BOUNDARY ↗</Link>
          <a href="/briefs/tetherics-system-brief.pdf">SYSTEM BRIEF / PDF ↗</a>
          <button type="button" onClick={() => setRecordsOpen("directive")}>DIRECTIVE FILE</button>
        </div>
      </div>
    </Scene>
  );
}

function Experience() {
  return (
    <div className="cinematic-experience">
      <a className="skip-link" href="#everything">Skip cinematic experience</a>
      <BootGate />
      <GlobalCursor />
      <PersistentInterface />
      <WorldNavigator />
      <DeferredInteractiveSystemWorld />
      <CinematicFilm />
      <CommandConsole />
      <RecordDrawer />
      <SystemInspector />
      <main className="scene-timeline">
        <SignalScene />
        <SoftwareScene />
        <IntelligenceScene />
        <SeerflowScene />
        <ArchitectureScene />
        <BoundaryScene />
        <MachineScene />
        <PerceptionScene />
        <ActuationScene />
        <FeedbackScene />
        <RecoveryScene />
        <ScaleScene />
        <ConvergenceScene />
        <RevelationScene />
        <EverythingScene />
      </main>
    </div>
  );
}

export function TethericsCinematicExperience() {
  return <CinematicRuntime><Experience /></CinematicRuntime>;
}
