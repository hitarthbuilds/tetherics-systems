import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const site = "https://tethericsystems.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: site, changeFrequency: "monthly", priority: 1 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/philosophy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site}/records/seerflow`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/records/auctra`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/methodology`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/security`, changeFrequency: "monthly", priority: 0.7 },
  ];
  return [...pages, ...(await getAllPosts()).map((post) => ({ url: `${site}/blog/${post.slug}`, lastModified: post.date, changeFrequency: "yearly" as const, priority: 0.6 }))];
}
