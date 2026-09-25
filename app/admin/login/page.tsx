import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark, Lockup } from "@/components/brand/logo";
import { LoginForm } from "@/components/admin/login-form";
import { adminConfigured, isAdmin } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="studio-login">
      <div className="studio-login__art" aria-hidden="true"><BrandMark /></div>
      <section className="studio-login__card">
        <div className="studio-login__lockup"><Lockup tone="light" /></div>
        <p className="studio-kicker">JOURNAL STUDIO</p>
        <h1>Write it. Upload it.<br /><em>Publish in one click.</em></h1>
        <LoginForm configured={adminConfigured()} />
        <Link href="/" className="studio-link">← Back to tethericsystems.com</Link>
      </section>
    </main>
  );
}
