import type { Metadata } from "next";
import Link from "next/link";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";
import { company, products } from "@/lib/product-family";

export const metadata: Metadata = {
  title: "Evidence Register — Tetheric Systems",
  description: "Public product records, provenance and capability boundaries for Tetheric Systems Private Limited.",
};

export default function EvidencePage() {
  return (
    <TrustShell code="COMPANY / PUBLIC RECORDS" title="The work, in context." summary="Meet our products, inspect the source material, and understand the status of each piece of work.">
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
            <tr><td>EV-004</td><td>SeerFlow product record</td><td><Status tone="live">LIVE PRODUCT</Status></td><td>Official product positioning and the distinction between a capability description and independently measured outcomes.</td><td><Link href="/records/seerflow">READ RECORD ↗</Link><br /><a href={products.seerflow.url} target="_blank" rel="noreferrer">OPEN PRODUCT ↗</a></td></tr>
            <tr><td>EV-005</td><td>Archived system brief</td><td><Status tone="concept">CONCEPT ARCHIVE</Status></td><td>Portable, dated summary of the earlier system thesis and modeled physical-system boundary.</td><td><a href="/briefs/tetherics-system-brief.pdf">SYSTEM PDF ↗</a></td></tr>
            <tr><td>EV-006</td><td>Apex Foundry pilot record</td><td><Status>PRIVATE PILOT</Status></td><td>Current creative-workspace scope, human review, connection boundaries and the public information site.</td><td><Link href="/records/foundry">READ RECORD ↗</Link><br /><a href={products.foundry.url} target="_blank" rel="noreferrer">OPEN PRODUCT INFO ↗</a></td></tr>
          </tbody>
        </table>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">ORGANIZATION DISCLOSURE</span>
        <h2>Known, unknown, and not implied.</h2>
        <div className="trust-disclosures">
          <Disclosure label="Company" value={company.legalName} status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Products" value="SeerFlow and Apex Foundry are products of Tetheric Systems Private Limited." status={<Status tone="live">OWNERSHIP</Status>} />
          <Disclosure label="Public geography" value="India" status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Canonical website" value="tethericsystems.com" status={<Status tone="live">DISCLOSED</Status>} />
          <Disclosure label="Registration documents" value="Registration documents are not published on this site." status={<Status tone="limited">NOT PUBLISHED HERE</Status>} />
          <Disclosure label="General contact" value={company.email} status={<Status>CONTACT</Status>} />
          <Disclosure label="Leadership identities" value="No named leadership profile has been published on this site." status={<Status tone="limited">NOT DISCLOSED</Status>} />
          <Disclosure label="Customer outcomes" value="This company site does not assert independently verified customer performance or financial results." status={<Status tone="limited">NOT ASSERTED HERE</Status>} />
          <Disclosure label="Product illustrations" value="The homepage shows authored interface concepts without customer data or measured performance results." status={<Status tone="concept">ILLUSTRATION</Status>} />
        </div>
      </section>
    </TrustShell>
  );
}
