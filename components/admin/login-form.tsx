"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="studio-login__form">
      <label>Password<input name="password" type="password" autoComplete="current-password" required disabled={!configured || pending} autoFocus /></label>
      {state.error && <p className="studio-error" role="alert">{state.error}</p>}
      {!configured && <p className="studio-hint">The studio is locked until an <code>ADMIN_PASSWORD</code> environment variable is set for this project.</p>}
      <button type="submit" className="studio-button is-primary" disabled={!configured || pending}>{pending ? "Checking…" : "Enter the studio"} <b aria-hidden="true">↗</b></button>
    </form>
  );
}
