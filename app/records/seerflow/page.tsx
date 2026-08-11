import type { Metadata } from "next";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = {
  title: "SeerFlow System Record — Tetherics Systems",
  description: "The public, limitations-first system record for SeerFlow.",
};

export default function SeerflowRecordPage() {
  return (
    <TrustShell code="TS/SYS-001 · PUBLIC RECORD" title="SeerFlow." summary="A proposed commerce control system that would observe operational events, model state, reason over risk, and coordinate bounded actions.">
      <section className="trust-section">
        <span className="trust-kicker">RECORD STATE</span>
        <h2>Research direction. Not a deployment claim.</h2>
        <div className="trust-callout"><strong>DISCLOSURE / IMPORTANT</strong><p>No public customer deployment, benchmark, uptime history, integration certification, or measured business outcome is attached to this record. The cinematic sequence illustrates a system hypothesis.</p></div>
        <p><a href="/briefs/seerflow-system-record.pdf">DOWNLOAD THE PORTABLE SYSTEM RECORD / PDF ↗</a></p>
        <div className="trust-disclosures">
          <Disclosure label="System ID" value="TS/SYS-001" status={<Status tone="live">REGISTERED RECORD</Status>} />
          <Disclosure label="Public status" value="Architecture and research direction" status={<Status>RESEARCH</Status>} />
          <Disclosure label="Production status" value="Not evidenced publicly" status={<Status tone="limited">NOT VERIFIED</Status>} />
          <Disclosure label="Claims boundary" value="No performance, revenue, inventory or fulfillment result is asserted." status={<Status tone="concept">LIMITED</Status>} />
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">PROPOSED CONTROL LOOP</span>
        <h2>Observe. Model. Reason. Act.</h2>
        <div className="trust-grid">
          <article className="trust-card"><span>01 / OBSERVE</span><h3>Event acquisition</h3><p>Orders, inventory, payments, settlements, shipments and operational alerts enter a timestamped event boundary.</p></article>
          <article className="trust-card"><span>02 / MODEL</span><h3>State representation</h3><p>Events are reconciled into an explicit operational state with lineage, recency and uncertainty.</p></article>
          <article className="trust-card"><span>03 / REASON</span><h3>Risk resolution</h3><p>Policies and models propose actions while retaining evidence, confidence and constraints.</p></article>
          <article className="trust-card"><span>04 / ORCHESTRATE</span><h3>Dependency control</h3><p>Actions are sequenced across systems with idempotency, approvals and failure boundaries.</p></article>
          <article className="trust-card"><span>05 / ACT</span><h3>Bounded commands</h3><p>Approved commands are emitted with audit records, rollback paths and operator visibility.</p></article>
          <article className="trust-card"><span>06 / LEARN</span><h3>Feedback</h3><p>Observed outcomes return as evidence; they are not silently treated as proof of causality.</p></article>
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">EVIDENCE REQUIRED TO ADVANCE</span>
        <h2>What “production” would require.</h2>
        <table className="trust-table">
          <thead><tr><th>GATE</th><th>REQUIRED EVIDENCE</th><th>CURRENT PUBLIC STATE</th></tr></thead>
          <tbody>
            <tr><td>Identity</td><td>Named accountable operator and legal contracting entity.</td><td><Status tone="limited">NOT PUBLISHED</Status></td></tr>
            <tr><td>Security</td><td>Threat model, data boundary, access controls, incident route and independent test scope.</td><td><Status tone="limited">NOT PUBLISHED</Status></td></tr>
            <tr><td>Reliability</td><td>Defined SLOs, failure tests, recovery evidence and dated operating history.</td><td><Status tone="limited">NOT PUBLISHED</Status></td></tr>
            <tr><td>Outcomes</td><td>Named methodology, baseline, sample, period and independently reviewable result.</td><td><Status tone="limited">NOT PUBLISHED</Status></td></tr>
          </tbody>
        </table>
      </section>
    </TrustShell>
  );
}
