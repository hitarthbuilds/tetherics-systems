import type { Metadata } from "next";
import { Disclosure, Status, TrustShell } from "@/components/trust/trust-shell";

export const metadata: Metadata = {
  title: "SeerFlow — Live Product Record | Tetherics Systems",
  description: "A source-labeled record of SeerFlow, the business command centre for Indian D2C.",
};

export default function SeerflowRecordPage() {
  return (
    <TrustShell code="TS/SYS-001 · LIVE PRODUCT RECORD" title="SeerFlow." summary="A source-labeled view of the business command centre for Indian D2C: profit, cash flow, return-to-origin risk and reconciliation.">
      <section className="trust-section">
        <span className="trust-kicker">PRODUCT IDENTITY / SEERFLOW.IN</span>
        <h2>Live product. First-party claims clearly labeled.</h2>
        <div className="trust-callout"><strong>SOURCE / OFFICIAL PRODUCT SITE</strong><p>SeerFlow&apos;s public website describes the product as live, offers a 30-day free trial, and positions it as an intelligence layer alongside an existing order-management stack. Tetherics links those statements to their source without presenting them as independently audited outcomes.</p></div>
        <p><a href="https://seerflow.in" target="_blank" rel="noreferrer">OPEN OFFICIAL SEERFLOW WEBSITE ↗</a></p>
        <div className="trust-disclosures">
          <Disclosure label="System ID" value="TS/SYS-001" status={<Status tone="live">LINKED PRODUCT</Status>} />
          <Disclosure label="Canonical product site" value="seerflow.in" status={<Status tone="live">PUBLIC</Status>} />
          <Disclosure label="Public status" value="Product site says now live and offers a free trial" status={<Status tone="live">FIRST-PARTY</Status>} />
          <Disclosure label="Named connections" value="Shopify, Razorpay and Shiprocket" status={<Status>PUBLIC CLAIM</Status>} />
          <Disclosure label="Independent outcome review" value="No customer performance result has been independently reviewed by Tetherics." status={<Status tone="limited">NOT ASSERTED</Status>} />
          <Disclosure label="Source checked" value="seerflow.in · 11 August 2026" status={<Status tone="live">DATED</Status>} />
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">PUBLIC CAPABILITY SURFACE</span>
        <h2>One operating picture for the D2C money layer.</h2>
        <div className="trust-grid">
          <article className="trust-card"><span>01 / PROFIT</span><h3>True unit economics</h3><p>Model what each order earns after product cost, gateway fees, shipping, marketing and returned orders.</p></article>
          <article className="trust-card"><span>02 / RTO</span><h3>Risk before shipment</h3><p>Score COD return-to-origin risk by pincode before an order is released into the logistics network.</p></article>
          <article className="trust-card"><span>03 / CASH</span><h3>Forward cash flow</h3><p>Bring expected inflows, settlement timing and operating costs into a forward-looking cash position.</p></article>
          <article className="trust-card"><span>04 / RECONCILIATION</span><h3>Fees and taxes</h3><p>Connect payout lineage, marketplace fees and GST/TDS reconciliation to the underlying operating records.</p></article>
          <article className="trust-card"><span>05 / COPILOT</span><h3>Answers with sources</h3><p>Ask operational questions while retaining the data sources cited behind the response.</p></article>
          <article className="trust-card"><span>06 / POSITION</span><h3>Keep the OMS</h3><p>SeerFlow&apos;s public positioning adds an intelligence and money layer instead of replacing core order operations.</p></article>
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-kicker">CLAIMS BOUNDARY</span>
        <h2>What this record does—and does not—establish.</h2>
        <table className="trust-table">
          <thead><tr><th>ITEM</th><th>PUBLIC SOURCE</th><th>TETHERICS TREATMENT</th></tr></thead>
          <tbody>
            <tr><td>Product identity</td><td>Live website at seerflow.in</td><td><Status tone="live">DIRECTLY INSPECTABLE</Status></td></tr>
            <tr><td>Capability descriptions</td><td>Official product copy and interface examples</td><td><Status>FIRST-PARTY CLAIM</Status></td></tr>
            <tr><td>Cinematic command centre</td><td>Tetherics interactive interpretation</td><td><Status tone="concept">DEMO INTERFACE</Status></td></tr>
            <tr><td>Customer outcomes</td><td>No independently reviewed dataset attached here</td><td><Status tone="limited">NOT ASSERTED</Status></td></tr>
            <tr><td>Security and compliance</td><td>Refer to the official product&apos;s own disclosures</td><td><Status tone="limited">NOT RE-CERTIFIED HERE</Status></td></tr>
          </tbody>
        </table>
      </section>
    </TrustShell>
  );
}
