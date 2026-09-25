import { promises as fs } from "node:fs";
import path from "node:path";
import { LOCAL_MEDIA, storageMode } from "@/lib/cms/storage";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

/** Serves studio images saved to disk during local development. Production uses Vercel Blob URLs. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const match = name.match(/^[a-f0-9-]{36}\.(jpg|png|webp|gif|avif)$/);
  if (storageMode() !== "local" || !match) return new Response("Not found", { status: 404 });
  const file = await fs.readFile(path.join(LOCAL_MEDIA, name)).catch(() => null);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file, { headers: { "content-type": TYPES[match[1]], "cache-control": "public, max-age=31536000, immutable" } });
}
