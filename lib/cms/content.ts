import { categories, coverVariants, type Block, type Post } from "@/lib/blog";

/** A journal post written in the admin studio. */
export type CmsRecord = Post & {
  id: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type PostInput = Omit<Post, "body"> & { id?: string; body: Block[] };

export const ID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Converts pasted plain text or light markdown into editor blocks. */
export function textToBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const text = chunk.trim();
    if (!text) continue;
    const lines = text.split("\n").map((line) => line.trim());
    const image = text.match(/^!\[([^\]]*)\]\((\S+?)\)(?:\s+"?(.*?)"?)?$/);
    if (image) blocks.push({ type: "image", alt: image[1], url: image[2], caption: image[3] || undefined });
    else if (/^#{1,3}\s+/.test(text)) blocks.push({ type: "h2", text: text.replace(/^#{1,3}\s+/, "") });
    else if (lines.every((line) => /^>\s?/.test(line))) blocks.push({ type: "quote", text: lines.map((line) => line.replace(/^>\s?/, "")).join(" ") });
    else if (lines.every((line) => /^([-*•]|\d+[.)])\s+/.test(line))) blocks.push({ type: "list", items: lines.map((line) => line.replace(/^([-*•]|\d+[.)])\s+/, "")) });
    else blocks.push({ type: "p", text: lines.join(" ") });
  }
  return blocks;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeUrl(value: unknown) {
  const url = clean(value, 2000);
  return /^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//i.test(url) || /^\/api\/media\/[\w.-]+$/.test(url) ? url : "";
}

function dimension(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value < 20000 ? Math.round(value) : undefined;
}

/** Validates editor input into a storable post. Throws with a readable message. */
export function normalizeInput(input: PostInput, takenSlugs: Set<string>): Omit<Post, never> {
  const title = clean(input.title, 160);
  if (!title) throw new Error("Give the article a title.");
  const slug = slugify(clean(input.slug, 120) || title);
  if (!slug) throw new Error("The URL needs at least one letter or number.");
  if (takenSlugs.has(slug)) throw new Error(`Another article already uses /blog/${slug}.`);
  const body: Block[] = [];
  for (const block of Array.isArray(input.body) ? input.body : []) {
    if (block.type === "image") {
      const url = safeUrl(block.url);
      if (url) body.push({ type: "image", url, alt: clean(block.alt, 300), caption: clean(block.caption, 300) || undefined, width: dimension(block.width), height: dimension(block.height) });
    } else if (block.type === "list") {
      const items = (Array.isArray(block.items) ? block.items : []).map((item) => clean(item, 1000)).filter(Boolean);
      if (items.length) body.push({ type: "list", items });
    } else if (block.type === "p" || block.type === "h2" || block.type === "quote") {
      const text = clean(block.text, block.type === "p" ? 8000 : 400);
      if (text) body.push({ type: block.type, text });
    }
  }
  if (!body.length) throw new Error("Add at least one paragraph before saving.");
  const coverUrl = safeUrl(input.coverImage?.url);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : new Date().toISOString().slice(0, 10);
  return {
    slug,
    title,
    dek: clean(input.dek, 300),
    category: categories.includes(input.category) ? input.category : "Company",
    date,
    author: clean(input.author, 80) || "Tetheric Systems",
    cover: coverVariants.includes(input.cover) ? input.cover : "bars",
    coverImage: coverUrl ? { url: coverUrl, alt: clean(input.coverImage?.alt, 300), width: dimension(input.coverImage?.width), height: dimension(input.coverImage?.height) } : undefined,
    featured: Boolean(input.featured),
    body,
  };
}
