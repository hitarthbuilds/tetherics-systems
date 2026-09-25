import { useId } from "react";
import { accentStops, accentStopsOnDark, lockupText, monogram, wordmark } from "@/lib/brand";

type Tone = "ink" | "light";

function useGradientId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function AccentGradient({ id, tone, x1, x2 }: { id: string; tone: Tone; x1: number; x2: number }) {
  const stops = tone === "light" ? accentStopsOnDark : accentStops;
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
      {stops.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />)}
    </linearGradient>
  );
}

function Letters({ accent, trademark }: { accent: string; trademark: boolean }) {
  return (
    <>
      {wordmark.glyphs.map((glyph) => <g key={glyph.x} transform={`translate(${glyph.x} 0)`}><path className="brand-glyph" d={glyph.d} fill="currentColor" /></g>)}
      <g transform={`translate(${wordmark.accent.x} 0)`}><path className="brand-accent" d={wordmark.accent.d} fill={`url(#${accent})`} /></g>
      {trademark && <g transform={`translate(${wordmark.trademark.x} ${wordmark.trademark.y})`}><path className="brand-trademark" d={wordmark.trademark.d} fill="currentColor" /></g>}
    </>
  );
}

/** The TETHERIC wordmark. Letters inherit `color`; the accent bar keeps the brand gradient. */
export function Wordmark({ tone = "ink", trademark = false, label = "Tetheric", className = "" }: { tone?: Tone; trademark?: boolean; label?: string | null; className?: string }) {
  const accent = useGradientId("wordmark-accent");
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg className={`brand-wordmark is-${tone} ${className}`} viewBox={trademark ? "0 -40 1236 160" : `0 0 ${wordmark.width} ${wordmark.height}`} {...a11y}>
      <defs><AccentGradient id={accent} tone={tone} x1={0} x2={124} /></defs>
      <Letters accent={accent} trademark={trademark} />
    </svg>
  );
}

/** The complete official lockup: wordmark, legal descriptor, gradient rule and tagline. */
export function Lockup({ tone = "ink", tagline = true, className = "" }: { tone?: Tone; tagline?: boolean; className?: string }) {
  const accent = useGradientId("lockup-accent");
  const rule = useGradientId("lockup-rule");
  return (
    <svg className={`brand-lockup is-${tone} ${className}`} viewBox={`0 -40 1240 ${tagline ? 390 : 310}`} role="img" aria-label={`Tetheric ${lockupText.descriptor.toLowerCase()}${tagline ? `. ${lockupText.tagline}` : ""}`}>
      <defs>
        <AccentGradient id={accent} tone={tone} x1={0} x2={124} />
        <AccentGradient id={rule} tone={tone} x1={35} x2={1196} />
      </defs>
      <Letters accent={accent} trademark />
      <text className="brand-lockup__descriptor" x="36" y="207" textLength="1155" lengthAdjust="spacing">{lockupText.descriptor}</text>
      {tagline && (
        <>
          <rect x="35" y="253" width="1161" height="3.5" fill={`url(#${rule})`} />
          <text className="brand-lockup__tagline" x="36" y="336" textLength="1160" lengthAdjust="spacing">{lockupText.tagline}</text>
        </>
      )}
    </svg>
  );
}

/** The three-bar monogram, drawn from the logo's first E. */
export function BrandMark({ className = "", tile = true }: { className?: string; tile?: boolean }) {
  const accent = useGradientId("mark-accent");
  return (
    <svg className={`brand-mark ${tile ? "is-tile" : "is-bare"} ${className}`} viewBox={`0 0 ${monogram.size} ${monogram.size}`} aria-hidden="true">
      <defs><AccentGradient id={accent} tone={tile ? "light" : "ink"} x1={14} x2={50} /></defs>
      {tile && <rect width="64" height="64" rx="15" className="brand-mark__tile" />}
      {monogram.bars.map((bar) => <path key={bar} d={bar} className="brand-mark__bar" />)}
      <path d={monogram.accent} fill={`url(#${accent})`} />
    </svg>
  );
}
