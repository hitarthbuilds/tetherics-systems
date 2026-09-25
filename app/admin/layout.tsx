import type { Metadata } from "next";
import "../pages.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Journal Studio — Tetheric Systems",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio">{children}</div>;
}
