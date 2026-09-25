import { ImageResponse } from "next/og";
import { accentStops, lockupText, wordmark } from "@/lib/brand";

export const alt = "Tetheric Systems Private Limited — AI, automation and robotics. The company behind SeerFlow and Auctra.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#ffffff", color: "#111d29", fontFamily: "sans-serif" }}>
      <svg width="880" height="89" viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}>
        <defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="124">{accentStops.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />)}</linearGradient></defs>
        {wordmark.glyphs.map((glyph) => <path key={glyph.x} transform={`translate(${glyph.x} 0)`} d={glyph.d} fill="#111d29" />)}
        <path transform={`translate(${wordmark.accent.x} 0)`} d={wordmark.accent.d} fill="url(#a)" />
      </svg>
      <div style={{ display: "flex", width: 860, justifyContent: "space-between", marginTop: 34, fontSize: 30, letterSpacing: 2 }}>
        {lockupText.descriptor.split(" ").map((word) => <span key={word} style={{ letterSpacing: 16 }}>{word}</span>)}
      </div>
      <div style={{ display: "flex", width: 860, height: 3, marginTop: 30, background: "linear-gradient(90deg,#0a4fa0,#1284cb,#20d2ee)" }} />
      <div style={{ display: "flex", width: 860, justifyContent: "space-between", marginTop: 26, fontSize: 30, color: "#0b5fb4" }}>
        {lockupText.tagline.split(" | ").map((word) => <span key={word} style={{ letterSpacing: 16 }}>{word}</span>)}
      </div>
      <div style={{ display: "flex", marginTop: 64, fontSize: 24, color: "#526173" }}>The company behind SeerFlow and Auctra</div>
    </div>,
    size,
  );
}
