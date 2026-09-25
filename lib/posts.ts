import { unstable_cache } from "next/cache";
import { posts as builtIn, type Post } from "./blog";
import { listRecords } from "./cms/storage";

export const CMS_TAG = "cms-posts";

const publishedFromStudio = unstable_cache(
  async () => (await listRecords()).filter((record) => record.status === "published"),
  ["cms-published-posts"],
  { tags: [CMS_TAG], revalidate: 3600 },
);

async function studioPosts(): Promise<Post[]> {
  try {
    return (await publishedFromStudio()).map((record) => ({
      slug: record.slug, title: record.title, dek: record.dek, category: record.category, date: record.date,
      author: record.author, cover: record.cover, coverImage: record.coverImage, featured: record.featured, body: record.body,
    }));
  } catch (error) {
    console.warn("Journal studio posts unavailable; showing built-in posts only.", error);
    return [];
  }
}

/** Every published article: studio posts first by date, then the built-in essays. */
export async function getAllPosts(): Promise<Post[]> {
  const studio = await studioPosts();
  const slugs = new Set(studio.map((post) => post.slug));
  return [...studio, ...builtIn.filter((post) => !slugs.has(post.slug))].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string) {
  return (await getAllPosts()).find((post) => post.slug === slug);
}

export function featuredPost(all: Post[]) {
  return all.find((post) => post.featured) ?? all[0];
}
