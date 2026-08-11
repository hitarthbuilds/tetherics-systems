"use client";

import Link from "next/link";
import { useCinematicRuntime } from "./runtime";

type InspectionRecord = {
  code: string;
  title: string;
  layer: string;
  role: string;
  input: string;
  output: string;
  boundary: string;
  status: "CONCEPT" | "RESEARCH DIRECTION" | "INTERFACE MODEL" | "LIVE PRODUCT";
  href?: string;
  linkLabel?: string;
};

const records: Record<string, InspectionRecord> = {
  seerflow: { code: "TS/SYS-001", title: "SeerFlow", layer: "INDIAN D2C COMMAND CENTRE", role: "Connects commerce, payment and logistics state to profit, cash-flow and RTO decision views.", input: "Shopify, Razorpay and Shiprocket records named by the public product site", output: "Cash-flow, RTO risk, reconciliation, unit economics and cited data views", boundary: "Capability descriptions are first-party product claims from seerflow.in; cinematic metrics are demo telemetry, not customer results.", status: "LIVE PRODUCT", href: "https://seerflow.in", linkLabel: "OPEN SEERFLOW.IN" },
  machine: { code: "TS/MACHINE-01", title: "Autonomous Machine", layer: "PHYSICAL SYSTEM", role: "Turns state and control commands into modeled physical actuation.", input: "Sensor field, state estimate, control target", output: "Actuator commands and observed feedback", boundary: "The 3D asset is a concept visualization, not evidence of a physical prototype.", status: "CONCEPT", href: "/evidence", linkLabel: "OPEN ASSET EVIDENCE" },
  perception: { code: "TS-SEN/P04", title: "Perception", layer: "SENSING", role: "Transforms raw sensor observations into a geometric state estimate.", input: "Optical, depth, position, timing signals", output: "Objects, geometry, confidence, trajectory", boundary: "Values shown in the experience are narrative interface telemetry.", status: "INTERFACE MODEL" },
  compute: { code: "TS-CMP/N08", title: "Compute", layer: "STATE + REASONING", role: "Hosts the modeled state, policies, inference and control planning layers.", input: "Events, sensor features, policies", output: "State updates and proposed control paths", boundary: "No hardware specification or measured throughput is claimed.", status: "CONCEPT" },
  control: { code: "TS-CTL/C02", title: "Control", layer: "DECISION", role: "Resolves a bounded command from desired state, observed state and policy.", input: "Target state, estimated state, constraints", output: "Auditable actuator command", boundary: "No safety certification or real-world controller validation is claimed.", status: "INTERFACE MODEL" },
  actuation: { code: "TS-MEC/A01", title: "Actuation", layer: "PHYSICAL OUTPUT", role: "Applies a modeled command to a mechanical degree of freedom.", input: "Bounded control command", output: "Motion, force and new environmental state", boundary: "Motion is a cinematic simulation, not measured physical performance.", status: "CONCEPT" },
  observe: { code: "TS-LOOP/01", title: "Observe", layer: "EVENT ACQUISITION", role: "Collects timestamped signals with origin and recency.", input: "Events and sensor observations", output: "Normalized evidence stream", boundary: "Architecture description only; no production connector coverage is claimed.", status: "RESEARCH DIRECTION" },
  model: { code: "TS-LOOP/02", title: "Model", layer: "STATE", role: "Reconciles evidence into an explicit system state with uncertainty.", input: "Normalized observations", output: "Versioned state representation", boundary: "The site demonstrates the concept, not a deployed state service.", status: "RESEARCH DIRECTION" },
  reason: { code: "TS-LOOP/03", title: "Reason", layer: "DECISION", role: "Evaluates candidate paths under constraints, policy and evidence.", input: "State, objectives, policies", output: "Ranked and bounded action proposals", boundary: "No model accuracy or decision-quality benchmark is claimed.", status: "RESEARCH DIRECTION" },
  orchestrate: { code: "TS-LOOP/04", title: "Orchestrate", layer: "DEPENDENCY CONTROL", role: "Sequences actions across services with approvals and failure boundaries.", input: "Approved action plan", output: "Idempotent task graph", boundary: "No production integration inventory is claimed.", status: "RESEARCH DIRECTION" },
  act: { code: "TS-LOOP/05", title: "Act", layer: "COMMAND", role: "Emits a bounded command and captures its result as new evidence.", input: "Authorized task", output: "Command result and audit event", boundary: "No autonomous production authority is claimed.", status: "RESEARCH DIRECTION" },
};

const fallback = (id: string): InspectionRecord => ({
  code: `TS/NODE-${id.slice(0, 4).toUpperCase()}`,
  title: id.replaceAll("-", " "),
  layer: "SYSTEM TOPOLOGY",
  role: "A node in the observe, model, reason, orchestrate, act and feedback topology.",
  input: "Upstream state and signals",
  output: "Downstream state transition",
  boundary: "This inspection describes the interface model; it is not operational evidence.",
  status: "INTERFACE MODEL",
});

export function SystemInspector() {
  const { activeInspection, closeInspection } = useCinematicRuntime();
  if (!activeInspection) return null;
  const record = records[activeInspection] || fallback(activeInspection);

  return (
    <aside className="system-inspector" role="dialog" aria-modal="false" aria-label={`${record.title} system inspection`}>
      <header><span>INSPECT / {record.code}</span><button type="button" onClick={closeInspection}>ESC / CLOSE</button></header>
      <div className="system-inspector__title"><span>{record.layer}</span><h2>{record.title}</h2><strong>{record.status}</strong></div>
      <p>{record.role}</p>
      <dl>
        <div><dt>INPUT</dt><dd>{record.input}</dd></div>
        <div><dt>OUTPUT</dt><dd>{record.output}</dd></div>
        <div><dt>EVIDENCE BOUNDARY</dt><dd>{record.boundary}</dd></div>
      </dl>
      <div className="system-inspector__actions">
        {record.href?.startsWith("http")
          ? <a href={record.href} target="_blank" rel="noreferrer">{record.linkLabel} ↗</a>
          : record.href
            ? <Link href={record.href}>{record.linkLabel} ↗</Link>
            : <Link href="/methodology">READ CLAIMS METHOD ↗</Link>}
        <span>SESSION PATH / RECORDED</span>
      </div>
    </aside>
  );
}
