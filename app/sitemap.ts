import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tetherics.systems", changeFrequency: "monthly", priority: 1 },
    { url: "https://tetherics.systems/evidence", changeFrequency: "monthly", priority: 0.9 },
    { url: "https://tetherics.systems/records/seerflow", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tetherics.systems/methodology", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tetherics.systems/security", changeFrequency: "monthly", priority: 0.8 },
  ];
}
