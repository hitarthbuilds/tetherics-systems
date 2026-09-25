import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Montserrat, Saira } from "next/font/google";
import { Cursor, SmoothScroll } from "@/components/motion/site-motion";
import "./base.css";
import "./site.css";

// Display: a squared, extended face that echoes the TETHERIC wordmark.
const saira = Saira({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-saira",
  display: "swap",
});

// Text and labels: the geometric sans of "SYSTEMS PRIVATE LIMITED" and the logo tagline.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
  title: "Tetheric Systems — The company behind SeerFlow & Auctra",
  description:
    "Tetheric Systems Private Limited builds SeerFlow for D2C decision intelligence and Auctra for brand research and creative work. AI, automation and robotics.",
  applicationName: "Tetheric Systems",
  verification: {
    other: {
      "facebook-domain-verification": "7usm7e0nmxph3drs20a4dzj8fciflf",
    },
  },
  openGraph: {
    title: "Tetheric Systems — Clarity inside. Possibility outside.",
    description: "The company behind SeerFlow and Auctra. Two focused products. One belief in better ways of working.",
    siteName: "Tetheric Systems",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

// Runs before first paint: flags motion preference and whether the home intro has already played.
const preflight = `(function(d){try{var r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r)d.classList.add("motion-ready");if(r||sessionStorage.getItem("tetheric-intro"))d.classList.add("intro-done")}catch(e){d.classList.add("intro-done")}})(document.documentElement)`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${saira.variable} ${montserrat.variable} ${plexMono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: preflight }} /></head>
      <body><SmoothScroll />{children}<Cursor /></body>
    </html>
  );
}
