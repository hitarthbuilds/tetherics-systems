import type { Metadata } from "next";
import { Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = { title: "Methodology — Tetheric Systems", description: "How Tetheric Systems labels product maturity, illustrations, evidence and claims." };

export default function MethodologyPage() {
  return (
    <TrustShell code="METHOD / CLAIMS-01" title="Clarity in how we communicate." summary="Our product pages distinguish available products, private pilots, illustrations and archived concepts. Each has a different role.">
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
        <span className="trust-kicker">INTERFACES & ARCHIVES</span><h2>Illustrations explain an idea.</h2>
        <div className="trust-callout"><strong>THE HOMEPAGE</strong><p>The product illustrations are authored examples of an operating view and creative workspace. They contain no customer data and do not establish a performance result. The earlier cinematic film, scene archive and system brief remain available as concept work; any sensor or recovery values in those materials are fictional narrative telemetry.</p></div>
        <table className="trust-table"><thead><tr><th>CONTENT</th><th>STATUS</th><th>INTERPRETATION</th></tr></thead><tbody>
          <tr><td>TS-MACHINE-01 film and model</td><td><Status tone="concept">CONCEPT VISUALIZATION</Status></td><td>Design and systems communication.</td></tr>
          <tr><td>SeerFlow product record</td><td><Status tone="live">LIVE PRODUCT</Status></td><td>Capability descriptions from the official product; outcomes are not independently certified here.</td></tr>
          <tr><td>Apex Foundry product record</td><td><Status>PRIVATE PILOT</Status></td><td>A bounded creative-workspace pilot with SeerFlow. Public information is available separately from workspace access.</td></tr>
          <tr><td>Homepage product interfaces</td><td><Status tone="concept">ILLUSTRATION</Status></td><td>Product concepts made visible. No live account, customer result or posting activity is shown.</td></tr>
          <tr><td>Asset manifest and integrity hashes</td><td><Status tone="live">LIVE</Status></td><td>Current public artifact provenance.</td></tr>
        </tbody></table>
      </section>
    </TrustShell>
  );
}
