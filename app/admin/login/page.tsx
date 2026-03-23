import type { Metadata } from "next";
import { loginAdmin } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  description: "Private admin login for From Silos to Solutions 2026.",
  path: "/admin/login",
  noIndex: true
});

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container" style={{ maxWidth: "640px" }}>
      <section className="hero-card">
        <h1>Admin Portal</h1>
        <p>
          Sign in to manage public schedule content, announcements, attendee and speaker document
          libraries, and private speaker/presenter board activity.
        </p>
      </section>

      <form action={loginAdmin} className="panel form-grid" style={{ marginTop: "1rem" }}>
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
