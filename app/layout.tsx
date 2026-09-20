import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./base.css";
import "./records.css";
import "./family.css";
import "./midnight.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tethericsystems.com"),
  title: "Tetheric Systems — The company behind SeerFlow & Apex Foundry",
  description:
    "Tetheric Systems Private Limited builds SeerFlow for D2C decision intelligence and Apex Foundry for brand research and creative work.",
  verification: {
    other: {
      "facebook-domain-verification": "7usm7e0nmxph3drs20a4dzj8fciflf",
    },
  },
  openGraph: {
    title: "Tetheric Systems — Clarity inside. Possibility outside.",
    description: "The company behind SeerFlow and Apex Foundry. Two focused products. One belief in better ways of working.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100e18",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
