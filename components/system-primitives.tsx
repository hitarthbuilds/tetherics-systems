import type { ReactNode } from "react";

export function SystemLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="system-label">
      <span>{id}</span>
      <span className="system-label__rule" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function TechnicalCaption({ children }: { children: ReactNode }) {
  return <p className="technical-caption">{children}</p>;
}

export function StatusDot({ active = false }: { active?: boolean }) {
  return <span className={`status-dot${active ? " is-active" : ""}`} aria-hidden="true" />;
}

export function ArrowMark() {
  return <span aria-hidden="true">↘</span>;
}
