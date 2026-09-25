import { products } from "./product-family";

export const primaryNav = [
  { label: "Products", href: "/#products" },
  { label: "About", href: "/about" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Blog", href: "/blog" },
] as const;

export const recordNav = [
  { label: "SeerFlow", href: "/records/seerflow" },
  { label: "Auctra", href: "/records/auctra" },
  { label: "Methodology", href: "/methodology" },
  { label: "Security", href: "/security" },
] as const;

export const footerNav = [
  { title: "Products", links: [{ label: "SeerFlow", href: products.seerflow.url, external: true }, { label: "Auctra", href: products.foundry.url, external: true }, { label: "SeerFlow record", href: products.seerflow.record }, { label: "Auctra pilot record", href: products.foundry.record }] },
  { title: "Company", links: [{ label: "About us", href: "/about" }, { label: "Philosophy", href: "/philosophy" }, { label: "Blog", href: "/blog" }] },
  { title: "Standards", links: [{ label: "Methodology", href: "/methodology" }, { label: "Security", href: "/security" }] },
] as const;
