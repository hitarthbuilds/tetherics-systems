"use client";

import { useState } from "react";

const parts = [
  { id: "actuation", label: "ACTUATION", code: "TS-MEC/A01", x: "15%", y: "57%" },
  { id: "perception", label: "PERCEPTION", code: "TS-SEN/P04", x: "69%", y: "21%" },
  { id: "control", label: "CONTROL", code: "TS-CTL/C02", x: "74%", y: "67%" },
  { id: "compute", label: "COMPUTE", code: "TS-CMP/N08", x: "43%", y: "32%" },
];

export function MachineAssembly({ onInspect, progress = 0 }: { onInspect: (id: string) => void; progress?: number }) {
  const [activePart, setActivePart] = useState("assembly");

  const stage = progress < 0.16 ? "INERT" : progress < 0.36 ? "SENSORS" : progress < 0.58 ? "COMPUTE" : progress < 0.79 ? "CONTROL" : "ACTUATION";
  const explosion = Math.min(1, Math.max(0, (progress - 0.22) / 0.58));

  return (
    <div
      className={`machine-assembly stage-${stage.toLowerCase()}`}
      style={{ "--explode": explosion } as React.CSSProperties}
    >
      <div className="machine-assembly__hud">
        <span>TS/MACHINE-01</span>
        <span>POWER SEQUENCE / {stage}</span>
      </div>

      <div className="machine-assembly__viewport">
        <div className="machine-assembly__vision" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>
        <svg viewBox="0 0 900 620" role="img" aria-labelledby="machine-title machine-description">
          <title id="machine-title">Original Tetherics autonomous actuator assembly</title>
          <desc id="machine-description">A procedural exploded view showing perception, compute, control and actuation layers.</desc>
          <defs>
            <linearGradient id="steel" x1="0" x2="1">
              <stop offset="0" stopColor="#383838" />
              <stop offset=".5" stopColor="#9b9a95" />
              <stop offset="1" stopColor="#242424" />
            </linearGradient>
            <pattern id="machine-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M22 0H0V22" fill="none" stroke="#e8e5de" strokeOpacity=".08" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="900" height="620" fill="url(#machine-grid)" />
          <g className="machine-part machine-part--base">
            <path d="M180 482H720L677 545H225Z" fill="#151515" stroke="#6f6e69" />
            <path d="M280 465H620L655 495H245Z" fill="url(#steel)" opacity=".78" />
            <circle cx="294" cy="506" r="13" fill="#090909" stroke="#989791" />
            <circle cx="606" cy="506" r="13" fill="#090909" stroke="#989791" />
          </g>
          <g className="machine-part machine-part--actuator">
            <rect x="255" y="298" width="390" height="142" rx="6" fill="#111" stroke="#aaa9a3" strokeWidth="2" />
            <rect x="292" y="320" width="165" height="98" fill="url(#steel)" />
            <circle cx="374" cy="369" r="35" fill="#0a0a0a" stroke="#d7d4cc" strokeWidth="7" />
            <circle cx="374" cy="369" r="11" fill="#ef3d29" />
            <path d="M457 347H615M457 369H615M457 391H615" stroke="#676661" strokeWidth="8" />
          </g>
          <g className="machine-part machine-part--controller">
            <path d="M335 240H567L604 291H303Z" fill="#20201f" stroke="#aaa9a3" strokeWidth="2" />
            <rect x="350" y="252" width="200" height="24" fill="#090909" />
            {Array.from({ length: 10 }, (_, index) => (
              <rect key={index} x={360 + index * 18} y="258" width="8" height="12" fill={index < 7 ? "#66655f" : "#ef3d29"} />
            ))}
          </g>
          <g className="machine-part machine-part--sensor">
            <path d="M399 194h102l31 42H368Z" fill="url(#steel)" stroke="#c6c3bb" />
            <circle cx="450" cy="214" r="22" fill="#050505" stroke="#a8a69f" strokeWidth="5" />
            <circle cx="450" cy="214" r="9" fill="#ef3d29" className="machine-eye" />
            <path d="M450 194V132" stroke="#77756f" strokeWidth="8" />
            <circle cx="450" cy="122" r="13" fill="#121212" stroke="#aaa9a3" />
          </g>
          <g className="machine-part machine-part--signal">
            <path d="M450 214V264H520V369H615" fill="none" stroke="#ef3d29" strokeWidth="3" strokeDasharray="8 9" />
            <circle r="5" fill="#ef3d29"><animateMotion dur="2s" repeatCount="indefinite" path="M450 214V264H520V369H615" /></circle>
          </g>
          <g className="machine-part machine-part--arm">
            <path d="M638 345L750 264" stroke="url(#steel)" strokeWidth="32" />
            <circle cx="638" cy="345" r="30" fill="#111" stroke="#aaa9a3" strokeWidth="7" />
            <path d="M750 264L792 191" stroke="url(#steel)" strokeWidth="24" />
            <circle cx="750" cy="264" r="24" fill="#111" stroke="#aaa9a3" strokeWidth="6" />
            <path d="M785 179l38-8M795 195l34 11" stroke="#aaa9a3" strokeWidth="8" />
          </g>
        </svg>

        {parts.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`machine-annotation${activePart === part.id ? " is-active" : ""}`}
            style={{ left: part.x, top: part.y }}
            data-cursor="INSPECT"
            onPointerEnter={() => {
              setActivePart(part.id);
            }}
            onFocus={() => {
              setActivePart(part.id);
            }}
            onClick={() => onInspect(part.id)}
          >
            <small>{part.code}</small>
            <strong>{part.label}</strong>
          </button>
        ))}
      </div>

      <div className="machine-assembly__sequence" aria-label={`Activation stage: ${stage}`}>
        {['POWER', 'SENSORS', 'COMPUTE', 'CONTROL', 'ACTUATION'].map((item, index) => {
          const stages = [0.08, 0.2, 0.4, 0.62, 0.8];
          return <span className={progress >= stages[index] ? "is-online" : ""} key={item}>{item}</span>;
        })}
      </div>
    </div>
  );
}
