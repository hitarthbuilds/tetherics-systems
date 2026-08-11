import type { Metadata } from "next";
import Link from "next/link";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = {
  title: "Evidence Register — Tetherics Systems",
  description: "Public evidence, status labels, provenance and limitations for Tetherics Systems.",
};

export default function EvidencePage() {
  return (
    <TrustShell code="TRUST / EV-REGISTER-01" title="Evidence, not theatre." summary="A public boundary between what can be inspected, what is a concept, and what has not yet been evidenced.">
      <section className="trust-section">
        <span className="trust-kicker">STATUS TAXONOMY / V1.0</span>
        <h2>Every claim gets a state.</h2>
        <div className="trust-grid">
          <article className="trust-card"><Status tone="live">LIVE</Status><h3>Publicly operating</h3><p>A working artifact or process that can be inspected at the linked source.</p></article>
          <article className="trust-card"><Status>PILOT</Status><h3>Bounded evaluation</h3><p>Running in a constrained setting. Scope and evidence must be named.</p></article>
          <article className="trust-card"><Status>PROTOTYPE</Status><h3>Functional build</h3><p>A testable implementation without a production or deployment claim.</p></article>
          <article className="trust-card"><Status>SIMULATION</Status><h3>Modeled behavior</h3><p>Outputs from a declared simulation, not real-world performance.</p></article>
          <article className="trust-card"><Status tone="concept">CONCEPT VISUALIZATION</Status><h3>Design communication</h3><p>Visual intent only. It does not establish a physical prototype or capability.</p></article>
          <article className="trust-card"><Status tone="limited">NOT DISCLOSED</Status><h3>No public evidence</h3><p>The site does not substitute implication or marketing copy for missing facts.</p></article>
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">PUBLIC ARTIFACTS</span>
        <h2>Inspectable records.</h2>
        <table className="trust-table">
          <thead><tr><th>ID</th><th>ARTIFACT</th><th>STATE</th><th>WHAT IT EVIDENCES</th><th>ACCESS</th></tr></thead>
          <tbody>
            <tr><td>EV-001</td><td>TS-MACHINE-01 scene archive</td><td><Status tone="concept">CONCEPT</Status></td><td>Native 3D geometry, articulated rig, PBR material graph and camera/light scene.</td><td><a href="/models/tetherics-machine.scn" download>DOWNLOAD .SCN ↗</a></td></tr>
            <tr><td>EV-002</td><td>4K cinematic master</td><td><Status tone="concept">CONCEPT</Status></td><td>3840×2160 offline Metal render, 96 frames at 24 fps.</td><td><a href="/cinematic/tetherics-machine-4k.mp4">OPEN FILM ↗</a></td></tr>
            <tr><td>EV-003</td><td>Asset manifest</td><td><Status tone="live">LIVE</Status></td><td>Resolution, renderer, modeling disclosure, byte size and SHA-256 provenance.</td><td><a href="/cinematic/asset-manifest.json">OPEN JSON ↗</a></td></tr>
            <tr><td>EV-004</td><td>SeerFlow system record</td><td><Status>RESEARCH DIRECTION</Status></td><td>Problem framing and proposed architecture, with explicit evidence gaps.</td><td><Link href="/records/seerflow">READ RECORD ↗</Link></td></tr>
            <tr><td>EV-005</td><td>Public system briefs</td><td><Status tone="live">LIVE</Status></td><td>Portable, dated summaries of the system thesis and SeerFlow evidence boundary.</td><td><a href="/briefs/tetherics-system-brief.pdf">SYSTEM PDF ↗</a><br /><a href="/briefs/seerflow-system-record.pdf">SEERFLOW PDF ↗</a></td></tr>
          </tbody>
        </table>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">ORGANIZATION DISCLOSURE</span>
        <h2>Known, unknown, and not implied.</h2>
        <div className="trust-disclosures">
          <Disclosure label="Public brand" value="Tetherics Systems" status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Public geography" value="India" status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Canonical website" value="tetherics.systems" status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Legal entity / registration" value="No registration evidence has been published on this site." status={<Status tone="limited">NOT DISCLOSED</Status>} />
          <Disclosure label="Leadership identities" value="No named leadership profile has been published on this site." status={<Status tone="limited">NOT DISCLOSED</Status>} />
          <Disclosure label="Customer deployments" value="No customer, deployment or outcome evidence is claimed publicly." status={<Status tone="limited">NO PUBLIC EVIDENCE</Status>} />
          <Disclosure label="Performance metrics" value="Interface values are narrative telemetry, not measured production results." status={<Status tone="concept">SIMULATED UI</Status>} />
        </div>
      </section>
    </TrustShell>
  );
}
