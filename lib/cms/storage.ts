import { del, get, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ID_PATTERN, type CmsRecord } from "./content";

/**
 * Where studio content lives. Production uses Vercel Blob (BLOB_READ_WRITE_TOKEN);
 * local development falls back to the .data folder so the studio works out of the box.
 */
export type StorageMode = "blob" | "local" | "unconfigured";

export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (!process.env.VERCEL) return "local";
  return "unconfigured";
}

const PREFIX = "cms/posts/";
const LOCAL_ROOT = path.join(process.cwd(), ".data", "cms");
export const LOCAL_MEDIA = path.join(LOCAL_ROOT, "media");

function assertId(id: string) {
  if (!ID_PATTERN.test(id)) throw new Error("Unknown article.");
}

async function readBlob(pathname: string) {
  const result = await get(pathname, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as CmsRecord;
}

export async function listRecords(): Promise<CmsRecord[]> {
  const mode = storageMode();
  if (mode === "blob") {
    const pathnames: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      pathnames.push(...page.blobs.map((blob) => blob.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    const records = await Promise.all(pathnames.map((pathname) => readBlob(pathname).catch(() => null)));
    return records.filter((record): record is CmsRecord => Boolean(record));
  }
  if (mode === "local") {
    const folder = path.join(LOCAL_ROOT, "posts");
    const files = await fs.readdir(folder).catch(() => [] as string[]);
    const records = await Promise.all(files.filter((file) => file.endsWith(".json")).map(async (file) => JSON.parse(await fs.readFile(path.join(folder, file), "utf8")) as CmsRecord));
    return records;
  }
  return [];
}

export async function getRecord(id: string): Promise<CmsRecord | null> {
  assertId(id);
  const mode = storageMode();
  if (mode === "blob") return readBlob(`${PREFIX}${id}.json`);
  if (mode === "local") {
    const file = path.join(LOCAL_ROOT, "posts", `${id}.json`);
    return JSON.parse(await fs.readFile(file, "utf8").catch(() => "null")) as CmsRecord | null;
  }
  return null;
}

export async function saveRecord(record: CmsRecord) {
  assertId(record.id);
  const body = JSON.stringify(record, null, 2);
  const mode = storageMode();
  if (mode === "blob") {
    await put(`${PREFIX}${record.id}.json`, body, { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
    return;
  }
  if (mode === "local") {
    await fs.mkdir(path.join(LOCAL_ROOT, "posts"), { recursive: true });
    await fs.writeFile(path.join(LOCAL_ROOT, "posts", `${record.id}.json`), body);
    return;
  }
  throw new Error("Storage is not connected yet. Connect a Vercel Blob store to this project.");
}

export async function deleteRecord(id: string) {
  assertId(id);
  const mode = storageMode();
  if (mode === "blob") await del(`${PREFIX}${id}.json`);
  else if (mode === "local") await fs.rm(path.join(LOCAL_ROOT, "posts", `${id}.json`), { force: true });
}

/** Local development only: stores an uploaded image and returns its public path. */
export async function saveLocalImage(file: File, extension: string) {
  await fs.mkdir(LOCAL_MEDIA, { recursive: true });
  const name = `${crypto.randomUUID()}.${extension}`;
  await fs.writeFile(path.join(LOCAL_MEDIA, name), Buffer.from(await file.arrayBuffer()));
  return `/api/media/${name}`;
}
