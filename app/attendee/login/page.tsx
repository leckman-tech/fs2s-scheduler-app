import type { Metadata } from "next";
import { loginAttendee } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal Login",
  description: "Private attendee login for FS2S 2026 documents and conference resources.",
  path: "/attendee/login",
  noIndex: true
});

export default async function AttendeeLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container" style={{ maxWidth: "640px" }}>
      <section className="hero-card">
        <h1>Attendee Portal</h1>
        <p>
          Sign in to access workshop handouts, keynote materials, panel resources, and other
          attendee documents the conference team uploads.
        </p>
      </section>

      <form action={loginAttendee} className="panel form-grid" style={{ marginTop: "1rem" }}>
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
