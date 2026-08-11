"use client";

import { useMemo, useState } from "react";

const nodes = [
  { id: "software", label: "SOFTWARE", x: 13, y: 49, layer: "DIGITAL" },
  { id: "seerflow", label: "SEERFLOW", x: 29, y: 26, layer: "VENTURE" },
  { id: "data", label: "DATA", x: 33, y: 70, layer: "SIGNAL" },
  { id: "intelligence", label: "INTELLIGENCE", x: 49, y: 44, layer: "COGNITION" },
  { id: "perception", label: "PERCEPTION", x: 59, y: 17, layer: "SENSING" },
  { id: "control", label: "CONTROL", x: 66, y: 66, layer: "DECISION" },
  { id: "machine", label: "MACHINE", x: 79, y: 39, layer: "PHYSICAL" },
  { id: "operations", label: "OPERATIONS", x: 90, y: 69, layer: "HUMAN" },
  { id: "environment", label: "ENVIRONMENT", x: 88, y: 16, layer: "WORLD" },
];

const edges = [
  ["software", "seerflow"], ["software", "data"], ["seerflow", "intelligence"],
  ["data", "intelligence"], ["data", "control"], ["intelligence", "perception"],
  ["intelligence", "control"], ["perception", "machine"], ["control", "machine"],
  ["machine", "environment"], ["machine", "operations"], ["operations", "data"],
  ["environment", "perception"], ["software", "operations"],
];

export function InfrastructureGraph({ inspected, onInspect }: { inspected: string[]; onInspect?: (id: string) => void }) {
  const preferred = useMemo(() => inspected[inspected.length - 1] || "control", [inspected]);
  const [active, setActive] = useState(preferred);

  const activate = (id: string) => setActive(id);

  return (
    <div className="infrastructure-map" data-cursor="INSPECT">
      <div className="infrastructure-map__coordinates" aria-hidden="true">
        <span>00</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
      <svg viewBox="0 0 1000 620" role="img" aria-labelledby="graph-title graph-description">
        <title id="graph-title">Tetherics infrastructure convergence map</title>
        <desc id="graph-description">Interactive relationships between software, intelligence, machines, operations and the environment.</desc>
        <defs>
          <pattern id="infra-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke="#e8e5de" strokeOpacity=".08" />
          </pattern>
          <filter id="soft-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width="1000" height="620" fill="url(#infra-grid)" />
        <g className="infrastructure-map__edges">
          {edges.map(([from, to], index) => {
            const a = nodes.find((node) => node.id === from)!;
            const b = nodes.find((node) => node.id === to)!;
            const emphasized = active === from || active === to;
            const redPath = index === 1 || index === 3 || index === 6 || index === 8;
            return (
              <path
                key={`${from}-${to}`}
                d={`M${a.x * 10} ${a.y * 6.2} C${(a.x * 7 + b.x * 3)} ${a.y * 6.2}, ${(a.x * 3 + b.x * 7)} ${b.y * 6.2}, ${b.x * 10} ${b.y * 6.2}`}
                className={`${emphasized ? "is-active" : ""}${redPath ? " is-signal" : ""}`}
              />
            );
          })}
        </g>
        {nodes.map((node, index) => {
          const isInspected = inspected.some((item) => item.includes(node.id));
          return (
            <g
              key={node.id}
              className={`infrastructure-node${active === node.id ? " is-active" : ""}${isInspected ? " was-inspected" : ""}`}
              transform={`translate(${node.x * 10} ${node.y * 6.2})`}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${node.label} node`}
              onPointerEnter={() => activate(node.id)}
              onFocus={() => activate(node.id)}
              onClick={() => { activate(node.id); onInspect?.(node.id); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") { activate(node.id); onInspect?.(node.id); }
              }}
            >
              <circle r={active === node.id ? 17 : 9} />
              <circle className="node-pulse" r="25" />
              <text y="-22" textAnchor="middle">{String(index + 1).padStart(2, "0")} / {node.label}</text>
            </g>
          );
        })}
        <circle className="infrastructure-map__signal" r="6" filter="url(#soft-glow)">
          <animateMotion dur="5.5s" repeatCount="indefinite" path="M130 304 C230 304 280 434 330 434 C410 434 430 273 490 273 C570 273 605 409 660 409 C715 409 745 242 790 242" />
        </circle>
      </svg>
      <aside className="infrastructure-map__readout" aria-live="polite">
        <span>ACTIVE NODE</span>
        <strong>{nodes.find((node) => node.id === active)?.label}</strong>
        <dl>
          <div><dt>LAYER</dt><dd>{nodes.find((node) => node.id === active)?.layer}</dd></div>
          <div><dt>RELATIONS</dt><dd>{edges.filter((edge) => edge.includes(active)).length.toString().padStart(2, "0")}</dd></div>
          <div><dt>STATE</dt><dd>CONNECTED</dd></div>
        </dl>
      </aside>
      {inspected.length > 0 && (
        <p className="infrastructure-map__memory">SESSION PATH EMPHASIS / {preferred.toUpperCase()}</p>
      )}
    </div>
  );
}
