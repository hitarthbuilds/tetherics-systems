import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { requireAdmin } from "@/lib/cms/auth";
import { ID_PATTERN } from "@/lib/cms/content";
import { getRecord, storageMode } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (id === "new") return <PostEditor initial={null} status="new" mode={storageMode()} />;
  if (!ID_PATTERN.test(id)) notFound();
  const record = await getRecord(id);
  if (!record) notFound();
  return <PostEditor key={record.id} initial={record} status={record.status} mode={storageMode()} />;
}
