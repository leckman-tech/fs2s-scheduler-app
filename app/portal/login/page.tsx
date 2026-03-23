import type { Metadata } from "next";
import { loginPortal } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Speaker and Presenter Portal Login",
  description: "Private speaker and presenter login for FS2S 2026 logistics, assigned sessions, and document access.",
  path: "/portal/login",
  noIndex: true
});

export default async function PortalLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container" style={{ maxWidth: "640px" }}>
      <section className="hero-card">
        <h1>Speaker/Presenter Portal</h1>
        <p>
          Sign in to review your assigned sessions, arrival details, AV notes, staff contacts,
          shared speaker documents, and speaker/presenter board updates. Public attendees never
          see this information.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">Assigned session logistics</span>
          <span className="hero-pill">Private document access</span>
        </div>
      </section>

      <form action={loginPortal} className="panel form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        {params.error ? <div className="empty-state">{params.error}</div> : null}
        <button type="submit" className="button">
          Sign in
        </button>
      </form>
    </div>
  );
}
