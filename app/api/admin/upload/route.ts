import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/cms/auth";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/cms/content";
import { saveLocalImage, storageMode } from "@/lib/cms/storage";

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

/**
 * Studio image uploads. With Vercel Blob, the browser uploads directly to storage after this
 * route issues a short-lived, image-only token. Locally, the file is posted here and saved to disk.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Sign in to upload images." }, { status: 401 });
  const mode = storageMode();

  if (mode === "blob") {
    try {
      const body = (await request.json()) as HandleUploadBody;
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("journal/")) throw new Error("Invalid upload path.");
          return { allowedContentTypes: [...IMAGE_TYPES], maximumSizeInBytes: MAX_IMAGE_BYTES, addRandomSuffix: true, validUntil: Date.now() + 10 * 60 * 1000 };
        },
      });
      return Response.json(result);
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
    }
  }

  if (mode === "local") {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
    const extension = EXTENSIONS[file.type];
    if (!extension) return Response.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 415 });
    if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: "Images must be 20 MB or smaller." }, { status: 413 });
    return Response.json({ url: await saveLocalImage(file, extension) });
  }

  return Response.json({ error: "Image storage is not connected yet." }, { status: 503 });
}
