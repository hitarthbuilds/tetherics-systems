import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "tetheric_studio";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

/** The studio stays locked until ADMIN_PASSWORD is set. Changing it signs every session out. */
export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** `next dev` on your own machine with no password set: the studio opens without signing in. Never on Vercel or in production builds. */
export function devUnlocked() {
  return process.env.NODE_ENV === "development" && !process.env.VERCEL && !process.env.ADMIN_PASSWORD;
}

function key() {
  const seed = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return seed ? createHash("sha256").update(`tetheric-studio:${seed}`).digest() : null;
}

function sign(expires: number, secret: Buffer) {
  return createHmac("sha256", secret).update(String(expires)).digest("base64url");
}

function same(a: string | Buffer, b: string | Buffer) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && same(candidate, expected!);
}

export async function isAdmin() {
  if (devUnlocked()) return true;
  const secret = key();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!secret || !token) return false;
  const [expires, signature] = token.split(".");
  const expiry = Number(expires);
  return Number.isFinite(expiry) && expiry > Date.now() / 1000 && Boolean(signature) && same(signature, sign(expiry, secret));
}

export async function startSession() {
  const secret = key();
  if (!secret) throw new Error("Set ADMIN_PASSWORD to enable the studio.");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  (await cookies()).set(COOKIE, `${expires}.${sign(expires, secret)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
