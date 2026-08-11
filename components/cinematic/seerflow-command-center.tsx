"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

const VIEWS = [
  {
    id: "profit",
    code: "01",
    label: "TRUE PROFIT",
    metric: "COST LAYERS / 06",
    status: "DETERMINISTIC VIEW",
    detail: "Model per-order profit after product cost, gateway fees, shipping, marketing and returns.",
    bars: [34, 58, 43, 76, 62, 88, 71, 94],
  },
  {
    id: "rto",
    code: "02",
    label: "RTO RISK",
    metric: "PINCODE SIGNAL",
    status: "PRE-SHIP VIEW",
    detail: "Inspect return-to-origin risk before a COD order is released into the logistics network.",
    bars: [84, 48, 69, 39, 91, 52, 77, 44],
  },
  {
    id: "cash",
    code: "03",
    label: "CASH FLOW",
    metric: "13-WEEK HORIZON",
    status: "FORWARD VIEW",
    detail: "Connect settlements, operating costs and expected inflows into a forward cash position.",
    bars: [31, 39, 47, 52, 61, 57, 73, 82],
  },
  {
    id: "reconcile",
    code: "04",
    label: "RECONCILE",
    metric: "PAYOUT LINEAGE",
    status: "SOURCE LINKED",
    detail: "Bring Shopify, Razorpay and Shiprocket records into one reviewable operating picture.",
    bars: [72, 72, 72, 86, 86, 92, 92, 98],
  },
  {
    id: "copilot",
    code: "05",
    label: "DATA COPILOT",
    metric: "CITED ANSWERS",
    status: "GROUNDED VIEW",
    detail: "Ask operational questions and preserve the source trail behind every generated answer.",
    bars: [28, 66, 41, 79, 54, 87, 68, 96],
  },
] as const;

export function SeerflowCommandCenter() {
  const [activeId, setActiveId] = useState<(typeof VIEWS)[number]["id"]>("profit");
  const active = VIEWS.find((view) => view.id === activeId) ?? VIEWS[0];

  return (
    <section className="seerflow-command" aria-label="Explore SeerFlow capabilities">
      <header>
        <div><i /><span>SEERFLOW.IN / PUBLIC PRODUCT</span></div>
        <strong>INDIAN D2C COMMAND CENTRE</strong>
      </header>

      <div className="seerflow-command__views" role="tablist" aria-label="SeerFlow capability views">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={view.id === active.id}
            onClick={() => setActiveId(view.id)}
          >
            <span>{view.code}</span>
            <strong>{view.label}</strong>
          </button>
        ))}
      </div>

      <div className="seerflow-command__readout" role="tabpanel" aria-live="polite">
        <div>
          <span>{active.metric}</span>
          <strong>{active.status}</strong>
          <p>{active.detail}</p>
        </div>
        <div className="seerflow-command__signal" aria-hidden="true">
          {active.bars.map((height, index) => <i key={`${active.id}-${index}`} style={{ "--bar": `${height}%`, "--delay": `${index * 45}ms` } as CSSProperties} />)}
        </div>
      </div>

      <footer>
        <span>DEMO INTERFACE / NO CUSTOMER DATA</span>
        <div>
          <Link href="/records/seerflow">PUBLIC RECORD ↗</Link>
          <a href="https://seerflow.in" target="_blank" rel="noreferrer">OPEN SEERFLOW.IN ↗</a>
        </div>
      </footer>
    </section>
  );
}
