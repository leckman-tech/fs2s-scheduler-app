import { loginPortal } from "@/lib/actions/admin";

export default async function PortalLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container" style={{ maxWidth: "640px" }}>
      <section className="hero-card">
        <h1>Speaker and panelist portal</h1>
        <p>
          Sign in to view only your assigned sessions, arrival details, AV notes, and staff
          contacts. Public attendees never see this information.
        </p>
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
