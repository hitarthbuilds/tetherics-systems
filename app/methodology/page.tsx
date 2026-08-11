import type { Metadata } from "next";
import { Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = { title: "Methodology — Tetherics Systems", description: "How Tetherics labels evidence, system maturity, demonstrations and claims." };

export default function MethodologyPage() {
  return (
    <TrustShell code="METHOD / CLAIMS-01" title="How we separate signal from claim." summary="A compact method for publishing system work without presenting prototypes, simulations, or cinematic interfaces as operational evidence.">
      <section className="trust-section">
        <span className="trust-kicker">THE RULE</span><h2>A claim is only as strong as its attached evidence.</h2>
        <div className="trust-grid">
          <article className="trust-card"><span>01</span><h3>State the object</h3><p>Name the system, version, date, environment and responsible source.</p></article>
          <article className="trust-card"><span>02</span><h3>Label maturity</h3><p>Use the public taxonomy: live, pilot, prototype, simulation, concept, or research direction.</p></article>
          <article className="trust-card"><span>03</span><h3>Attach provenance</h3><p>Link an artifact, methodology, timestamp and integrity hash where practical.</p></article>
          <article className="trust-card"><span>04</span><h3>Bound the claim</h3><p>Say what the evidence does not establish. Avoid implied customers or capabilities.</p></article>
          <article className="trust-card"><span>05</span><h3>Expose the denominator</h3><p>Metrics need a baseline, sample, period, exclusions and measurement owner.</p></article>
          <article className="trust-card"><span>06</span><h3>Retire stale evidence</h3><p>Date records and update their state when the system or supporting facts change.</p></article>
        </div>
      </section>
      <section className="trust-section">
        <span className="trust-kicker">INTERFACE TELEMETRY</span><h2>Narrative values are not measurements.</h2>
        <div className="trust-callout"><strong>THIS WEBSITE</strong><p>Sensor confidence, timing, state, recovery and other figures inside the cinematic experience are fictional interface telemetry used to explain a control loop. They are not benchmark results or evidence of a deployed machine.</p></div>
        <table className="trust-table"><thead><tr><th>CONTENT</th><th>STATUS</th><th>INTERPRETATION</th></tr></thead><tbody>
          <tr><td>TS-MACHINE-01 film and model</td><td><Status tone="concept">CONCEPT VISUALIZATION</Status></td><td>Design and systems communication.</td></tr>
          <tr><td>SeerFlow commerce sequence</td><td><Status>RESEARCH DIRECTION</Status></td><td>Proposed architecture and behavior.</td></tr>
          <tr><td>Asset manifest and integrity hashes</td><td><Status tone="live">LIVE</Status></td><td>Current public artifact provenance.</td></tr>
        </tbody></table>
      </section>
    </TrustShell>
  );
}
