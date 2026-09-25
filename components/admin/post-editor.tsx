"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type DragEvent } from "react";
import { deletePost, savePost } from "@/app/admin/actions";
import { PostBody } from "@/components/blog/post-body";
import { PostCover, PostMeta } from "@/components/blog/post-card";
import { categories, coverVariants, type Block, type Post } from "@/lib/blog";
import { slugify, textToBlocks, type CmsRecord } from "@/lib/cms/content";
import type { StorageMode } from "@/lib/cms/storage";
import { uploadImage } from "./upload";

type Keyed = Block & { key: string };
type Status = CmsRecord["status"] | "new";
type Toast = { tone: "ok" | "error"; text: string; href?: string };

const BLOCK_LABELS: Record<Block["type"], string> = { p: "Paragraph", h2: "Heading", quote: "Quote", list: "List", image: "Image" };
const key = () => Math.random().toString(36).slice(2, 10);
const withKeys = (blocks: Block[]): Keyed[] => blocks.map((block) => ({ ...block, key: key() }) as Keyed);
const blank = (type: Block["type"]): Keyed => ({ ...(type === "list" ? { type, items: [""] } : type === "image" ? { type, url: "", alt: "" } : { type, text: "" }), key: key() }) as Keyed;
const today = () => new Date().toISOString().slice(0, 10);

function AutoText({ value, onChange, className, placeholder, rows = 3 }: { value: string; onChange: (value: string) => void; className?: string; placeholder?: string; rows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const node = ref.current; if (node) { node.style.height = "auto"; node.style.height = `${node.scrollHeight + 2}px`; } }, [value]);
  return <textarea ref={ref} className={className} value={value} rows={rows} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function Dropzone({ label, hint, mode, onUploaded, compact = false }: { label: string; hint: string; mode: StorageMode; onUploaded: (image: { url: string; width?: number; height?: number }, file: File) => void; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const run = async (file?: File) => {
    if (!file) return;
    setError(""); setProgress(1);
    try { onUploaded(await uploadImage(file, mode, setProgress), file); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Upload failed."); }
    finally { setProgress(null); }
  };
  return (
    <div className={`studio-drop${over ? " is-over" : ""}${compact ? " is-compact" : ""}`} onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); setOver(false); void run(event.dataTransfer.files[0]); }}>
      <button type="button" onClick={() => input.current?.click()} disabled={progress !== null}>
        <b aria-hidden="true">↑</b>
        <span>{progress !== null ? `Uploading… ${Math.round(progress)}%` : label}</span>
        <small>{hint}</small>
      </button>
      {progress !== null && <i className="studio-drop__bar" style={{ transform: `scaleX(${progress / 100})` }} />}
      {error && <p className="studio-error">{error}</p>}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(event) => { void run(event.target.files?.[0]); event.target.value = ""; }} />
    </div>
  );
}

export function PostEditor({ initial, status: initialStatus, mode }: { initial: CmsRecord | null; status: Status; mode: StorageMode }) {
  const [id, setId] = useState(initial?.id);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [dek, setDek] = useState(initial?.dek ?? "");
  const [category, setCategory] = useState<Post["category"]>(initial?.category ?? "Company");
  const [date, setDate] = useState(initial?.date ?? today());
  const [author, setAuthor] = useState(initial?.author ?? "Tetheric Systems");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [cover, setCover] = useState<Post["cover"]>(initial?.cover ?? "bars");
  const [coverImage, setCoverImage] = useState<Post["coverImage"]>(initial?.coverImage);
  const [blocks, setBlocks] = useState<Keyed[]>(() => withKeys(initial?.body?.length ? initial.body : [{ type: "p", text: "" }]));
  const [view, setView] = useState<"split" | "write" | "preview">("split");
  const [toast, setToast] = useState<Toast | null>(null);
  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState("");
  const [pending, start] = useTransition();
  const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);
  const body: Block[] = blocks.map(({ key: _key, ...block }) => block as Block);
  const snapshot = JSON.stringify([effectiveSlug, title, dek, category, date, author, featured, cover, coverImage, body]);
  const [savedSnapshot, setSavedSnapshot] = useState(() => (initial ? snapshot : ""));
  const dirty = snapshot !== savedSnapshot;
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 5200); return () => window.clearTimeout(timer); }, [toast]);

  const preview: Post = { slug: effectiveSlug || "untitled", title: title || "Untitled article", dek, category, date, author, cover, coverImage, featured, body };

  const update = (index: number, patch: Partial<Keyed>) => setBlocks((current) => current.map((block, position) => position === index ? { ...block, ...patch } as Keyed : block));
  const insert = (index: number, type: Block["type"]) => setBlocks((current) => [...current.slice(0, index), blank(type), ...current.slice(index)]);
  const move = (index: number, step: number) => setBlocks((current) => {
    const next = [...current]; const target = index + step;
    if (target < 0 || target >= next.length) return current;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const remove = (index: number) => setBlocks((current) => current.length > 1 ? current.filter((_, position) => position !== index) : [blank("p")]);

  const save = (intent: "draft" | "publish" | "unpublish") => {
    start(async () => {
      const result = await savePost({ id, slug: effectiveSlug, title, dek, category, date, author, cover, coverImage, featured, body }, intent);
      if (!result.ok) { setToast({ tone: "error", text: result.error }); return; }
      setSavedSnapshot(JSON.stringify([result.slug, title, dek, category, date, author, featured, cover, coverImage, body]));
      setStatus(result.status);
      setSlug(result.slug); setSlugTouched(true);
      if (!id) { setId(result.id); window.history.replaceState(null, "", `/admin/posts/${result.id}`); }
      const live = result.status === "published";
      setToast({ tone: "ok", text: intent === "publish" ? "Published. It’s live on the journal now." : intent === "unpublish" ? "Unpublished. The article is back in drafts." : live ? "Saved. The live article is updated." : "Draft saved.", href: live ? `/blog/${result.slug}` : undefined });
    });
  };
  const latestSave = useRef(save);
  useEffect(() => { latestSave.current = save; });
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); latestSave.current("draft"); } };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const dropImages = async (event: DragEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    event.preventDefault();
    for (const file of files) {
      try {
        const image = await uploadImage(file, mode);
        setBlocks((current) => [...current, { type: "image", url: image.url, width: image.width, height: image.height, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), key: key() }]);
      } catch (reason) { setToast({ tone: "error", text: reason instanceof Error ? reason.message : "Upload failed." }); }
    }
  };

  const published = status === "published";
  return (
    <div className={`studio-editor is-${view}`}>
      <div className="studio-editor__bar">
        <Link href="/admin" className="studio-back">← Articles</Link>
        <span className={`studio-pill is-${status}`}>{status === "new" ? "New article" : published ? "Live" : "Draft"}</span>
        <span className="studio-saved">{pending ? "Saving…" : dirty ? "Unsaved changes" : status === "new" ? "Not saved yet" : "All changes saved"}</span>
        <div className="studio-views" role="group" aria-label="Layout">
          {(["write", "split", "preview"] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>{option === "write" ? "Write" : option === "split" ? "Split" : "Preview"}</button>)}
        </div>
        <div className="studio-editor__actions">
          {published && <Link className="studio-button is-ghost" href={`/blog/${effectiveSlug}`} target="_blank">View live ↗</Link>}
          {published && <button type="button" className="studio-button is-ghost" disabled={pending} onClick={() => save("unpublish")}>Unpublish</button>}
          <button type="button" className="studio-button is-quiet" disabled={pending} onClick={() => save("draft")}>{published ? "Save" : "Save draft"}</button>
          <button type="button" className="studio-button is-primary" disabled={pending} onClick={() => save("publish")}>{published ? "Update live" : "Publish"} <b aria-hidden="true">↗</b></button>
        </div>
      </div>

      <div className="studio-editor__grid">
        <div className="studio-editor__form" onDragOver={(event) => { if (event.dataTransfer.types.includes("Files")) event.preventDefault(); }} onDrop={dropImages}>
          <section className="studio-card">
            <header><span>01</span><h2>Cover</h2></header>
            {coverImage ? (
              <div className="studio-cover">
                <PostCover post={preview} />
                <div className="studio-cover__controls">
                  <label>Alt text<input value={coverImage.alt} placeholder="Describe the image for screen readers" onChange={(event) => setCoverImage({ ...coverImage, alt: event.target.value })} /></label>
                  <button type="button" className="studio-link is-danger" onClick={() => setCoverImage(undefined)}>Remove image</button>
                </div>
              </div>
            ) : (
              <>
                <Dropzone mode={mode} label="Upload a cover image" hint="JPG, PNG, WebP or AVIF · up to 20 MB · drag & drop works" onUploaded={(image, file) => setCoverImage({ url: image.url, width: image.width, height: image.height, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") })} />
                <p className="studio-hint">No photo? Pick a generated brand cover:</p>
                <div className="studio-covers">
                  {coverVariants.map((variant) => <button key={variant} type="button" aria-pressed={cover === variant} onClick={() => setCover(variant)} aria-label={`${variant} cover`}><PostCover post={{ ...preview, cover: variant, coverImage: undefined }} /></button>)}
                </div>
              </>
            )}
          </section>

          <section className="studio-card">
            <header><span>02</span><h2>Headline</h2></header>
            <AutoText className="studio-title" value={title} onChange={setTitle} placeholder="Write a headline" rows={1} />
            <AutoText className="studio-dek" value={dek} onChange={setDek} placeholder="One or two sentences that sell the read" rows={2} />
            <div className="studio-fields">
              <label className="studio-slug">URL<span>/blog/</span><input value={slugTouched ? slug : effectiveSlug} onChange={(event) => { setSlugTouched(true); setSlug(event.target.value); }} placeholder="generated-from-title" /></label>
              <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <label>Author<input value={author} onChange={(event) => setAuthor(event.target.value)} /></label>
            </div>
            <div className="studio-chips" role="group" aria-label="Category">
              {categories.map((option) => <button key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)}>{option}</button>)}
            </div>
            <label className="studio-toggle"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /><i aria-hidden="true" />Feature at the top of the journal</label>
          </section>

          <section className="studio-card">
            <header><span>03</span><h2>Story</h2><button type="button" className="studio-link" onClick={() => setImporting(true)}>Paste text or markdown</button></header>
            <p className="studio-hint">Drop photos anywhere on this column to add them to the story.</p>
            <div className="studio-blocks">
              {blocks.map((block, index) => (
                <div key={block.key} className={`studio-block is-${block.type}`}>
                  <div className="studio-block__tools">
                    <select value={block.type} aria-label="Block type" onChange={(event) => { const type = event.target.value as Block["type"]; const text = block.type === "list" ? block.items.join("\n") : block.type === "image" ? block.caption ?? "" : block.text; setBlocks((current) => current.map((item, position) => position === index ? ({ ...(type === "list" ? { type, items: text.split("\n") } : type === "image" ? { type, url: "", alt: "" } : { type, text }), key: item.key }) as Keyed : item)); }}>
                      {Object.entries(BLOCK_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <button type="button" onClick={() => move(index, -1)} aria-label="Move up" disabled={index === 0}>↑</button>
                    <button type="button" onClick={() => move(index, 1)} aria-label="Move down" disabled={index === blocks.length - 1}>↓</button>
                    <button type="button" onClick={() => remove(index)} aria-label="Remove block">×</button>
                  </div>
                  {block.type === "p" && <AutoText value={block.text} onChange={(text) => update(index, { text })} placeholder="Write a paragraph…" />}
                  {block.type === "h2" && <AutoText className="is-heading" value={block.text} onChange={(text) => update(index, { text })} placeholder="Section heading" rows={1} />}
                  {block.type === "quote" && <AutoText className="is-quote" value={block.text} onChange={(text) => update(index, { text })} placeholder="A line worth pulling out" rows={2} />}
                  {block.type === "list" && <AutoText value={block.items.join("\n")} onChange={(text) => update(index, { items: text.split("\n") })} placeholder={"One item per line\nAnother item"} />}
                  {block.type === "image" && (block.url ? (
                    <div className="studio-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.url} alt={block.alt} />
                      <div>
                        <label>Alt text<input value={block.alt} placeholder="Describe the image" onChange={(event) => update(index, { alt: event.target.value })} /></label>
                        <label>Caption<input value={block.caption ?? ""} placeholder="Optional caption" onChange={(event) => update(index, { caption: event.target.value })} /></label>
                      </div>
                    </div>
                  ) : <Dropzone compact mode={mode} label="Upload an image" hint="or drag one here" onUploaded={(image, file) => update(index, { url: image.url, width: image.width, height: image.height, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") })} />)}
                  <div className="studio-insert" role="group" aria-label="Insert a block below">
                    <span>+</span>
                    {(Object.keys(BLOCK_LABELS) as Block["type"][]).map((type) => <button key={type} type="button" onClick={() => insert(index + 1, type)}>{BLOCK_LABELS[type]}</button>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {id && (
            <section className="studio-card is-danger">
              <header><span>04</span><h2>Danger zone</h2></header>
              <p className="studio-hint">Deleting removes the article from the journal immediately. Uploaded images stay in storage.</p>
              <button type="button" className="studio-button is-danger" disabled={pending} onClick={() => { if (window.confirm("Delete this article permanently?")) start(() => deletePost(id)); }}>Delete article</button>
            </section>
          )}
        </div>

        <aside className="studio-preview" aria-label="Live preview">
          <div className="studio-preview__label"><span>LIVE PREVIEW</span><em>{mode === "local" ? "Local studio" : "As readers will see it"}</em></div>
          <div className="studio-preview__canvas">
            <div className="studio-preview__hero">
              <PostCover post={preview} size="hero" />
              <div className="studio-preview__shade" />
              <div className="studio-preview__head"><PostMeta post={preview} /><h1>{preview.title}</h1>{dek && <p>{dek}</p>}</div>
            </div>
            <div className="post-body studio-preview__body"><PostBody blocks={body.filter((block) => block.type !== "image" || block.url)} animate={false} /></div>
          </div>
        </aside>
      </div>

      {importing && (
        <div className="studio-modal" role="dialog" aria-modal="true" aria-label="Paste text">
          <div>
            <h2>Paste your story</h2>
            <p>Blank lines start new paragraphs. <code>## Heading</code>, <code>&gt; quote</code> and <code>- list item</code> are understood.</p>
            <textarea value={importText} onChange={(event) => setImportText(event.target.value)} rows={12} autoFocus placeholder="Paste from Docs, Notion or anywhere…" />
            <div className="studio-modal__actions">
              <button type="button" className="studio-button is-quiet" onClick={() => setImporting(false)}>Cancel</button>
              <button type="button" className="studio-button is-primary" onClick={() => { const added = withKeys(textToBlocks(importText)); setBlocks((current) => [...current.filter((block) => block.type !== "p" || block.text.trim()), ...added]); setImportText(""); setImporting(false); }}>Add to story</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`studio-toast is-${toast.tone}`} role="status">{toast.text}{toast.href && <Link href={toast.href} target="_blank">View live ↗</Link>}</div>}
    </div>
  );
}
