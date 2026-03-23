import type { Metadata } from "next";
import { loginAttendee } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal Login",
  description: "Shared attendee login for FS2S 2026 workshop, keynote, and panel documents.",
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
          Sign in to open the shared attendee document library for workshop handouts, keynote
          materials, panel resources, and other files the conference team uploads.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">Shared access</span>
          <span className="hero-pill">Documents only</span>
        </div>
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
        <p className="muted" style={{ margin: 0 }}>
          This shared login opens the attendee document library. It does not create individual
          accounts or store saved schedules.
        </p>
      </form>
    </div>
  );
}
