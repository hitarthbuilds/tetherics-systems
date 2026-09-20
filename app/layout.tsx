import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./responsive.css";
import "./cinematic.css";
import "./trust.css";

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
  title: "Tetherics Systems — Everything Is a System",
  description:
    "Tetherics Systems engineers the infrastructure between intelligence and the physical world.",
  verification: {
    other: {
      "facebook-domain-verification": "7usm7e0nmxph3drs20a4dzj8fciflf",
    },
  },
  openGraph: {
    title: "Tetherics Systems",
    description: "Everything is a system.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
