"use client";

import { useEffect, useRef, useState } from "react";

const entries = [
  { id: "software", number: "001", label: "SOFTWARE" },
  { id: "intelligence", number: "002", label: "INTELLIGENCE" },
  { id: "machines", number: "003", label: "MACHINES" },
  { id: "infrastructure", number: "004", label: "INFRASTRUCTURE" },
  { id: "research", number: "005", label: "RESEARCH" },
  { id: "ventures", number: "006", label: "VENTURES" },
  { id: "contact", number: "007", label: "CONTACT" },
];

export function SystemIndex({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const visible = entries.filter((entry) => entry.label.toLowerCase().includes(query.toLowerCase()));
  const select = (id: string) => {
    setQuery("");
    onClose();
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  if (!open) return null;

  return (
    <div className="system-index" role="dialog" aria-modal="true" aria-label="Tetherics System Index" onKeyDown={(event) => event.key === "Escape" && onClose()}>
      <div className="system-index__bar">
        <span>TETHERICS SYSTEM INDEX</span>
        <button type="button" onClick={onClose} aria-label="Close system index">ESC / CLOSE</button>
      </div>
      <label className="system-index__search">
        <span>LOCATE NODE</span>
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="TYPE TO FILTER" />
      </label>
      <nav className="system-index__entries" aria-label="System index results">
        {visible.map((entry) => (
          <button key={entry.id} type="button" onClick={() => select(entry.id)} data-cursor="ENTER">
            <span>{entry.number}</span>
            <strong>{entry.label}</strong>
            <span>ENTER ↘</span>
          </button>
        ))}
      </nav>
      <div className="system-index__footer">
        <span>{visible.length.toString().padStart(2, "0")} NODES AVAILABLE</span>
        <span>CMD/CTRL + K</span>
      </div>
    </div>
  );
}
