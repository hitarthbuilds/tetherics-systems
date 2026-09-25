import { ImageResponse } from "next/og";
import { accentStopsOnDark, monogram } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111d29" }}>
      <svg width="150" height="150" viewBox="0 0 64 64">
        <defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="14" x2="50">{accentStopsOnDark.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />)}</linearGradient></defs>
        {monogram.bars.map((bar) => <path key={bar} d={bar} fill="#fff" />)}
        <path d={monogram.accent} fill="url(#a)" />
      </svg>
    </div>,
    size,
  );
}
