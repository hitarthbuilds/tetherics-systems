"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { posts as builtIn } from "@/lib/blog";
import { endSession, isAdmin, passwordMatches, startSession } from "@/lib/cms/auth";
import { ID_PATTERN, normalizeInput, type CmsRecord, type PostInput } from "@/lib/cms/content";
import { deleteRecord, getRecord, listRecords, saveRecord } from "@/lib/cms/storage";
import { CMS_TAG } from "@/lib/posts";

export type LoginState = { error?: string };

export async function login(_state: LoginState, form: FormData): Promise<LoginState> {
  if (!process.env.ADMIN_PASSWORD) return { error: "The studio is locked. Set ADMIN_PASSWORD in the project settings first." };
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { error: "That password didn’t match." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export type SaveResult = { ok: true; id: string; slug: string; status: CmsRecord["status"]; updatedAt: string } | { ok: false; error: string };

function refreshSite(...slugs: string[]) {
  updateTag(CMS_TAG);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs)) revalidatePath(`/blog/${slug}`);
}

/** Saves an article. `intent` decides whether it is (or stays) public — publishing is one call. */
export async function savePost(input: PostInput, intent: "draft" | "publish" | "unpublish"): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "Your session has ended. Sign in again." };
  try {
    const id = input.id && ID_PATTERN.test(input.id) ? input.id : crypto.randomUUID();
    const existing = input.id ? await getRecord(id) : null;
    const others = (await listRecords()).filter((record) => record.id !== id);
    const taken = new Set([...builtIn.map((post) => post.slug), ...others.map((record) => record.slug)]);
    const post = normalizeInput(input, taken);
    const now = new Date().toISOString();
    const status: CmsRecord["status"] = intent === "publish" ? "published" : intent === "unpublish" ? "draft" : existing?.status ?? "draft";
    const record: CmsRecord = { ...post, id, status, createdAt: existing?.createdAt ?? now, updatedAt: now, publishedAt: status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt };
    await saveRecord(record);
    if (status === "published" || existing?.status === "published") refreshSite(record.slug, existing?.slug ?? record.slug);
    revalidatePath("/admin");
    return { ok: true, id, slug: record.slug, status, updatedAt: now };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The article couldn’t be saved." };
  }
}

export async function deletePost(id: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  const existing = await getRecord(id);
  await deleteRecord(id);
  if (existing?.status === "published") refreshSite(existing.slug);
  revalidatePath("/admin");
  redirect("/admin");
}
