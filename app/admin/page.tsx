import Link from "next/link";
import { PostCover } from "@/components/blog/post-card";
import { BrandMark } from "@/components/brand/logo";
import { formatDate, posts as builtIn } from "@/lib/blog";
import { devUnlocked, requireAdmin } from "@/lib/cms/auth";
import { listRecords, storageMode } from "@/lib/cms/storage";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

const STORAGE = {
  blob: { label: "Vercel Blob", note: "Images and articles are stored in your Blob store.", tone: "ok" },
  local: { label: "Local disk", note: "Development mode: content is saved to the .data folder on this machine.", tone: "warn" },
  unconfigured: { label: "Not connected", note: "Connect a Vercel Blob store to this project to start publishing.", tone: "error" },
} as const;

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h ago` : formatDate(iso.slice(0, 10));
}

export default async function StudioPage() {
  await requireAdmin();
  const mode = storageMode();
  const records = (await listRecords().catch(() => [])).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const published = records.filter((record) => record.status === "published");
  const storage = STORAGE[mode];
  return (
    <main className="studio-home">
      <header className="studio-top">
        <Link href="/admin" className="studio-brand"><BrandMark /><span>Journal Studio</span></Link>
        <nav><Link href="/blog" target="_blank">View journal ↗</Link><form action={logout}><button type="submit">Sign out</button></form></nav>
      </header>

      {devUnlocked() && <p className="studio-banner">Development mode: the studio is unlocked because <code>ADMIN_PASSWORD</code> isn’t set. Production always asks for a password.</p>}

      <section className="studio-hero">
        <div>
          <p className="studio-kicker">TETHERIC JOURNAL</p>
          <h1>Your stories,<br /><em>one click from live.</em></h1>
          <p>Write, add photos, preview exactly how it will look, then publish. The journal, the article page and the homepage update instantly.</p>
        </div>
        <Link href="/admin/posts/new" className="studio-button is-primary is-large">New article <b aria-hidden="true">+</b></Link>
      </section>

      <section className="studio-stats">
        <div><strong>{published.length}</strong><span>Published from the studio</span></div>
        <div><strong>{records.length - published.length}</strong><span>Drafts</span></div>
        <div><strong>{builtIn.length}</strong><span>Built-in essays</span></div>
        <div className={`is-${storage.tone}`}><strong>{storage.label}</strong><span>{storage.note}</span></div>
      </section>

      <section className="studio-list">
        <div className="studio-list__head"><h2>Studio articles</h2><span>{records.length} total</span></div>
        {records.length === 0 ? (
          <div className="studio-empty">
            <BrandMark tile={false} />
            <h3>No studio articles yet.</h3>
            <p>Start with a headline and a photo. You can save a draft at any point.</p>
            <Link href="/admin/posts/new" className="studio-button is-primary">Write the first one <b aria-hidden="true">+</b></Link>
          </div>
        ) : records.map((record) => (
          <article key={record.id} className="studio-row">
            <Link href={`/admin/posts/${record.id}`} className="studio-row__cover" aria-hidden="true" tabIndex={-1}><PostCover post={record} /></Link>
            <div className="studio-row__body">
              <span className={`studio-pill is-${record.status}`}>{record.status === "published" ? "Live" : "Draft"}</span>
              <h3><Link href={`/admin/posts/${record.id}`}>{record.title}</Link></h3>
              <p>/blog/{record.slug} · {record.category} · edited {timeAgo(record.updatedAt)}</p>
            </div>
            <div className="studio-row__actions">
              {record.status === "published" && <Link href={`/blog/${record.slug}`} target="_blank">View ↗</Link>}
              <Link href={`/admin/posts/${record.id}`} className="studio-button is-quiet">Edit</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="studio-list is-builtin">
        <div className="studio-list__head"><h2>Built into the site</h2><span>Edited in code · always live</span></div>
        {builtIn.map((post) => (
          <article key={post.slug} className="studio-row">
            <div className="studio-row__cover" aria-hidden="true"><PostCover post={post} /></div>
            <div className="studio-row__body"><span className="studio-pill is-published">Live</span><h3>{post.title}</h3><p>/blog/{post.slug} · {post.category}</p></div>
            <div className="studio-row__actions"><Link href={`/blog/${post.slug}`} target="_blank">View ↗</Link></div>
          </article>
        ))}
      </section>
    </main>
  );
}
