import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  ["EVIDENCE", "/evidence"],
  ["SEERFLOW", "/records/seerflow"],
  ["METHODOLOGY", "/methodology"],
  ["SECURITY", "/security"],
] as const;

export function TrustShell({ code, title, summary, children }: { code: string; title: string; summary: string; children: ReactNode }) {
  return (
    <main className="trust-document">
      <header className="trust-header">
        <Link href="/" className="trust-mark"><span>TS</span><strong>TETHERICS SYSTEMS</strong></Link>
        <nav aria-label="Trust center">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <span>PUBLIC RECORD / 2026</span>
      </header>
      <section className="trust-hero">
        <span>{code}</span>
        <h1>{title}</h1>
        <p>{summary}</p>
        <div><i /> PUBLICLY REVIEWABLE</div>
      </section>
      <div className="trust-body">{children}</div>
      <footer className="trust-footer">
        <span>TETHERICS SYSTEMS / INDIA / 2026</span>
        <span>FACTS, STATUS AND LIMITATIONS ARE LABELED SEPARATELY.</span>
        <Link href="/">RETURN TO EXPERIENCE ↗</Link>
      </footer>
    </main>
  );
}

export function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: "live" | "concept" | "limited" | "neutral" }) {
  return <span className={`trust-status is-${tone}`}>{children}</span>;
}

export function Disclosure({ label, value, status }: { label: string; value: string; status: ReactNode }) {
  return <div className="trust-disclosure"><span>{label}</span><strong>{value}</strong>{status}</div>;
}
