"use client";

import { IMAGE_TYPES, MAX_IMAGE_BYTES, slugify } from "@/lib/cms/content";
import type { StorageMode } from "@/lib/cms/storage";

export type UploadedImage = { url: string; width?: number; height?: number };

async function dimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return {};
  }
}

/** Uploads an image: straight to Vercel Blob in production, to the local studio folder in development. */
export async function uploadImage(file: File, mode: StorageMode, onProgress?: (percent: number) => void): Promise<UploadedImage> {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) throw new Error("Use a JPG, PNG, WebP, GIF or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Images must be 20 MB or smaller.");
  if (mode === "unconfigured") throw new Error("Image storage is not connected yet.");
  const size = await dimensions(file);
  if (mode === "blob") {
    const { upload } = await import("@vercel/blob/client");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const blob = await upload(`journal/${base}.${extension}`, file, { access: "public", handleUploadUrl: "/api/admin/upload", multipart: file.size > 5 * 1024 * 1024, onUploadProgress: ({ percentage }) => onProgress?.(percentage) });
    return { url: blob.url, ...size };
  }
  const form = new FormData();
  form.append("file", file);
  onProgress?.(30);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !json.url) throw new Error(json.error ?? "Upload failed.");
  onProgress?.(100);
  return { url: json.url, ...size };
}
