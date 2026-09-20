import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tethericsystems.com", changeFrequency: "monthly", priority: 1 },
    { url: "https://tethericsystems.com/evidence", changeFrequency: "monthly", priority: 0.9 },
    { url: "https://tethericsystems.com/records/seerflow", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tethericsystems.com/records/foundry", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tethericsystems.com/methodology", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tethericsystems.com/security", changeFrequency: "monthly", priority: 0.8 },
  ];
}
