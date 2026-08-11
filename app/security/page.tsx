import type { Metadata } from "next";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = { title: "Security Disclosure — Tetherics Systems", description: "Current public security scope and disclosure limitations for Tetherics Systems." };

export default function SecurityPage() {
  return (
    <TrustShell code="SECURITY / PUBLIC-01" title="Security starts with an honest boundary." summary="This page identifies the security evidence that exists publicly today—and refuses to imply certifications, audits, or response capacity that have not been published.">
      <section className="trust-section">
        <span className="trust-kicker">CURRENT PUBLIC POSTURE</span><h2>No certification claim. No invented badge.</h2>
        <div className="trust-disclosures">
          <Disclosure label="SOC 2 / ISO 27001" value="No certification evidence published." status={<Status tone="limited">NOT CLAIMED</Status>} />
          <Disclosure label="Independent penetration test" value="No report or attestation published." status={<Status tone="limited">NOT DISCLOSED</Status>} />
          <Disclosure label="Production data processing" value="No public production service or data-processing scope is established by this site." status={<Status>NO PUBLIC SCOPE</Status>} />
          <Disclosure label="Responsible disclosure contact" value="A dedicated public security contact has not yet been supplied." status={<Status tone="limited">PENDING</Status>} />
        </div>
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
