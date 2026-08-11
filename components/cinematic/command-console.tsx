"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SCENES, type SceneId, useCinematicRuntime } from "./runtime";

type Command = {
  command: string;
  description: string;
  scene?: SceneId;
  inspect?: string;
  record?: "research" | "ventures" | "directive";
  href?: string;
};

const COMMANDS: Command[] = [
  { command: "inspect seerflow", description: "ENTER TS/SYS-001", scene: "seerflow", inspect: "seerflow" },
  { command: "inspect machine", description: "ENTER TS/MACHINE-01", scene: "machine", inspect: "machine" },
  { command: "trace signal", description: "RETURN TO SIGNAL ORIGIN", scene: "signal" },
  { command: "open topology", description: "MAP INTELLIGENCE FIELD", scene: "intelligence" },
  { command: "open research", description: "OPEN ARCHIVE RECORDS", record: "research" },
  { command: "open ventures", description: "OPEN SYSTEM RECORDS", record: "ventures" },
  { command: "open directive", description: "OPEN DIRECTIVE FILE", record: "directive" },
  { command: "open evidence", description: "PUBLIC EVIDENCE REGISTER", href: "/evidence" },
  { command: "open methodology", description: "CLAIMS AND STATUS METHOD", href: "/methodology" },
  { command: "open security", description: "PUBLIC SECURITY BOUNDARY", href: "/security" },
  { command: "download machine", description: "NATIVE SCENEKIT MODEL", href: "/models/tetherics-machine.scn" },
  { command: "system status", description: "LOCATE STABLE STATE", scene: "everything" },
  { command: "return entry", description: "RETURN TO ORIGIN", scene: "signal" },
  { command: "jump intelligence", description: "SCENE 02 / DYNAMIC STATE", scene: "intelligence" },
  { command: "jump feedback", description: "SCENE 09 / CLOSED LOOP", scene: "feedback" },
  { command: "jump convergence", description: "SCENE 12 / SYSTEM MAP", scene: "convergence" },
];

export function CommandConsole() {
  const { consoleOpen, inspect, jumpTo, setConsoleOpen, setRecordsOpen, activeIndex } = useCinematicRuntime();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!consoleOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [consoleOpen]);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMANDS;
    return COMMANDS.filter((item) => `${item.command} ${item.description}`.toLowerCase().includes(normalized));
  }, [query]);

  const execute = (item: Command) => {
    if (item.inspect) inspect(item.inspect);
    if (item.href) {
      window.location.assign(item.href);
    } else if (item.record) {
      setConsoleOpen(false);
      setRecordsOpen(item.record);
    } else if (item.scene) {
      jumpTo(item.scene);
    }
    setQuery("");
  };

  if (!consoleOpen) return null;

  return (
    <div className="command-console" role="dialog" aria-modal="true" aria-label="Tetherics system console">
      <header>
        <span>TETHERICS / SYSTEM CONSOLE</span>
        <span>ACTIVE NODE / {SCENES[activeIndex]?.number || "00"}</span>
        <button type="button" onClick={() => setConsoleOpen(false)}>ESC / CLOSE</button>
      </header>
      <label className="command-console__input">
        <span>COMMAND</span>
        <i aria-hidden="true">›</i>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches[0]) execute(matches[0]);
          }}
          placeholder="inspect machine"
          autoComplete="off"
        />
      </label>
      <div className="command-console__results" role="listbox" aria-label="Available system commands">
        {matches.map((item, index) => (
          <button key={item.command} type="button" role="option" aria-selected={index === 0} onClick={() => execute(item)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.command}</strong>
            <span>{item.description}</span>
            <i>EXECUTE ↘</i>
          </button>
        ))}
        {matches.length === 0 ? <p>NO SYSTEM COMMAND MATCHES / {query.toUpperCase()}</p> : null}
      </div>
      <footer><span>{matches.length.toString().padStart(2, "0")} COMMANDS</span><span>ENTER / EXECUTE</span><span>CMD/CTRL + K</span></footer>
    </div>
  );
}

const research = [
  ["AR-01", "ROBOTICS", "PHYSICAL SYSTEMS"],
  ["AR-02", "MACHINE PERCEPTION", "SPATIAL INTELLIGENCE"],
  ["AR-03", "AUTONOMOUS SYSTEMS", "CLOSED-LOOP CONTROL"],
  ["AR-04", "SIMULATION", "COMPUTABLE ENVIRONMENTS"],
  ["AR-05", "INDUSTRIAL INTELLIGENCE", "INFRASTRUCTURE"],
];

export function RecordDrawer() {
  const { recordsOpen, setRecordsOpen, inspect } = useCinematicRuntime();
  if (!recordsOpen) return null;

  return (
    <aside className="record-drawer" role="dialog" aria-modal="true" aria-label={`${recordsOpen} records`}>
      <header><span>{recordsOpen.toUpperCase()} / RECORD ACCESS</span><button type="button" onClick={() => setRecordsOpen(null)}>ESC / CLOSE</button></header>
      {recordsOpen === "research" ? (
        <>
          <h2>RESEARCH<br />NODES.</h2>
          <div className="record-drawer__list">
            {research.map(([id, label, field]) => (
              <button key={id} type="button" onClick={() => inspect(label.toLowerCase())}><span>{id}</span><strong>{label}</strong><span>{field}</span></button>
            ))}
          </div>
          <p>These are areas of exploration, not claims of published research.</p>
        </>
      ) : null}
      {recordsOpen === "ventures" ? (
        <>
          <h2>SYSTEM<br />RECORDS.</h2>
          <article><span>TS/SYS-001 / LIVE PRODUCT SITE</span><h3>SEERFLOW</h3><p>Business command centre for Indian D2C, connected to its public product source and a limitations-aware Tetherics record.</p><a href="/records/seerflow">OPEN PUBLIC RECORD ↗</a></article>
          <article className="is-restricted"><span>TS/SYS-002 / RESTRICTED</span><h3>NO PUBLIC SYSTEM RECORD.</h3></article>
        </>
      ) : null}
      {recordsOpen === "directive" ? (
        <>
          <h2>DIRECTIVE<br />FILE / 01.</h2>
          <blockquote>WE BUILD SYSTEMS THAT<br /><strong>PERCEIVE, DECIDE, AND ACT.</strong></blockquote>
          <p>Software is one layer. Intelligence is another. Machines make it physical. Infrastructure makes it real.</p>
        </>
      ) : null}
    </aside>
  );
}
