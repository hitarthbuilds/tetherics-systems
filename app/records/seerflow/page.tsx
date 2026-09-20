import type { Metadata } from "next";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";
import { company, products } from "@/lib/product-family";

export const metadata: Metadata = {
  title: "SeerFlow — Live Product Record | Tetheric Systems",
  description: "SeerFlow, a product of Tetheric Systems Private Limited: connected decision intelligence for Indian D2C.",
};

export default function SeerflowRecordPage() {
  return (
    <TrustShell code="TS/SYS-001 · LIVE PRODUCT RECORD" title="SeerFlow." summary="Connected decision intelligence for Indian D2C. A product of Tetheric Systems Private Limited, bringing orders, payouts, costs and returns into one operating picture.">
      <section className="trust-section">
        <span className="trust-kicker">PRODUCT IDENTITY / SEERFLOW</span>
        <h2>A clearer operating picture.</h2>
        <div className="trust-callout"><strong>SOURCE / OFFICIAL PRODUCT SITE</strong><p>SeerFlow brings the business context around orders, cash, settlement timing, contribution and returns into a decision layer. Its official website is the source for current availability and product details. The descriptions here are first-party product claims, not independently audited customer outcomes.</p></div>
        <p><a href={products.seerflow.url} target="_blank" rel="noreferrer">OPEN OFFICIAL SEERFLOW WEBSITE ↗</a></p>
        <div className="trust-disclosures">
          <Disclosure label="System ID" value="TS/SYS-001" status={<Status tone="live">LINKED PRODUCT</Status>} />
          <Disclosure label="Product website" value={products.seerflow.url} status={<Status tone="live">PUBLIC</Status>} />
          <Disclosure label="Owned by" value={company.legalName} status={<Status tone="live">COMPANY</Status>} />
          <Disclosure label="Public status" value="Live product; consult the official site for current access and available plans." status={<Status tone="live">FIRST-PARTY</Status>} />
          <Disclosure label="Data boundary" value="Decision quality depends on connected records, provider coverage and supplied cost inputs." status={<Status>EXPLICIT INPUTS</Status>} />
          <Disclosure label="Independent outcome review" value="This record does not attach an independently audited customer performance dataset." status={<Status tone="limited">NOT ASSERTED</Status>} />
          <Disclosure label="Record updated" value="20 September 2026" status={<Status tone="live">DATED</Status>} />
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">PUBLIC CAPABILITY SURFACE</span>
        <h2>One operating picture for the D2C money layer.</h2>
        <div className="trust-grid">
          <article className="trust-card"><span>01 / CONTRIBUTION</span><h3>Understand the costs</h3><p>Bring product costs, fees, shipping, marketing and returned orders into the contribution picture. Missing inputs need to remain visible.</p></article>
          <article className="trust-card"><span>02 / RETURNS</span><h3>See the return context</h3><p>Connect return and return-to-origin context with orders and financial exposure, subject to the available data.</p></article>
          <article className="trust-card"><span>03 / CASH</span><h3>Follow cash movement</h3><p>Understand recorded and expected cash in the context of settlement timing and connected operating records.</p></article>
          <article className="trust-card"><span>04 / SETTLEMENTS</span><h3>Keep the trail</h3><p>Connect payments and payouts back to their underlying records so reconciliation has a traceable source.</p></article>
          <article className="trust-card"><span>05 / COPILOT</span><h3>Answers with sources</h3><p>Ask operational questions while retaining the data sources cited behind the response.</p></article>
          <article className="trust-card"><span>06 / POSITION</span><h3>Keep the OMS</h3><p>SeerFlow&apos;s public positioning adds an intelligence and money layer instead of replacing core order operations.</p></article>
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">CLAIMS BOUNDARY</span>
        <h2>What this record does—and does not—establish.</h2>
        <table className="trust-table">
          <thead><tr><th>ITEM</th><th>PUBLIC SOURCE</th><th>RECORD STATUS</th></tr></thead>
          <tbody>
            <tr><td>Product identity</td><td>Official SeerFlow website linked above</td><td><Status tone="live">DIRECTLY INSPECTABLE</Status></td></tr>
            <tr><td>Capability descriptions</td><td>Official product copy and interface examples</td><td><Status>FIRST-PARTY CLAIM</Status></td></tr>
            <tr><td>Homepage operating view</td><td>Authored illustration of product context</td><td><Status tone="concept">ILLUSTRATION</Status></td></tr>
            <tr><td>Customer outcomes</td><td>No independently reviewed dataset attached here</td><td><Status tone="limited">NOT ASSERTED</Status></td></tr>
            <tr><td>Security and compliance</td><td>Refer to the official product&apos;s own disclosures</td><td><Status tone="limited">NOT RE-CERTIFIED HERE</Status></td></tr>
          </tbody>
        </table>
      </section>
    </TrustShell>
  );
}
