import { ImageResponse } from "next/og";

export const alt = "Tetherics Systems — Everything Is a System";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#080808",
        color: "#e8e5de",
        padding: "52px 58px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
        <span>TETHERICS SYSTEMS</span>
        <span style={{ color: "#ef3d29" }}>NODE / IND-WEST-01</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.78, letterSpacing: "-7px" }}>
        <span>EVERYTHING</span>
        <span>IS A SYSTEM.</span>
      </div>
      <div style={{ fontSize: 20, letterSpacing: "2px" }}>
        INTELLIGENCE ↔ PHYSICAL WORLD
      </div>
    </div>,
    size,
  );
}
