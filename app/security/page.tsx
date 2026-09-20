import type { Metadata } from "next";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";
import { company, products } from "@/lib/product-family";

export const metadata: Metadata = { title: "Security — Tetheric Systems", description: "Current public security scope and disclosure limitations for Tetheric Systems Private Limited." };

export default function SecurityPage() {
  return (
    <TrustShell code="SECURITY / PUBLIC-01" title="Security, with a clear scope." summary="This company site is informational. Product-specific data handling and access are described by each product, alongside the public limitations below.">
      <section className="trust-section">
        <span className="trust-kicker">CURRENT PUBLIC POSTURE</span><h2>What is publicly documented.</h2>
        <div className="trust-disclosures">
          <Disclosure label="SOC 2 / ISO 27001" value="No certification evidence published." status={<Status tone="limited">NOT CLAIMED</Status>} />
          <Disclosure label="Independent penetration test" value="No report or attestation published." status={<Status tone="limited">NOT DISCLOSED</Status>} />
          <Disclosure label="Product data processing" value="SeerFlow and Apex Foundry have separate product scopes. This informational site does not establish their complete processing or security controls." status={<Status>PRODUCT-SPECIFIC</Status>} />
          <Disclosure label="Responsible disclosure contact" value="A dedicated public security contact has not yet been supplied." status={<Status tone="limited">PENDING</Status>} />
        </div>
        <p>For general questions, contact <a href={`mailto:${company.email}`}>{company.email}</a>. This is a general contact address; no incident-response service level is promised here.</p>
        <p>See <a href={products.seerflow.url}>SeerFlow</a> and <a href={`${products.foundry.url}/privacy.html`}>Apex Foundry&apos;s privacy policy</a> for the relevant product context.</p>
      </section>
      <section className="trust-section">
        <span className="trust-kicker">DESIGN EXPECTATIONS</span><h2>Controls required before operational trust.</h2>
        <div className="trust-grid">
          <article className="trust-card"><span>BOUNDARY</span><h3>Data minimization</h3><p>Document what enters the system, why it is needed, where it moves and when it is removed.</p></article>
          <article className="trust-card"><span>IDENTITY</span><h3>Least privilege</h3><p>Human and machine identities require scoped access, rotation, revocation and auditable ownership.</p></article>
          <article className="trust-card"><span>CONTROL</span><h3>Bounded autonomy</h3><p>High-impact actions require explicit policy, approval gates, rate limits and safe failure modes.</p></article>
          <article className="trust-card"><span>EVIDENCE</span><h3>Auditability</h3><p>Decisions and commands should retain inputs, policy version, actor, timestamp and result.</p></article>
          <article className="trust-card"><span>RECOVERY</span><h3>Failure planning</h3><p>Define isolation, rollback, degraded operation and incident escalation before deployment.</p></article>
          <article className="trust-card"><span>ASSURANCE</span><h3>Independent review</h3><p>Publish dated scope and limitations when external testing or certification exists.</p></article>
        </div>
      </section>
    </TrustShell>
  );
}
