import { ImageResponse } from "next/og";

export const alt = "Tetheric Systems — The company behind SeerFlow and Apex Foundry";
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
        background: "#f8f8f5",
        color: "#29252e",
        padding: "52px 58px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
        <span>TETHERIC SYSTEMS</span>
        <span style={{ color: "#8966b4" }}>THE PRODUCT FAMILY</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 98, fontWeight: 500, lineHeight: 1.02, letterSpacing: "-5px" }}>
        <span>Clarity inside.</span>
        <span style={{ color: "#8966b4" }}>Possibility outside.</span>
      </div>
      <div style={{ fontSize: 20, letterSpacing: "2px" }}>
        SEERFLOW / APEX FOUNDRY
      </div>
    </div>,
    size,
  );
}
