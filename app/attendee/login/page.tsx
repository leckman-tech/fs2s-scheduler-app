import type { Metadata } from "next";
import Link from "next/link";
import { createAttendeeAccount, loginAttendee } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal Login",
  description:
    "Create your attendee account or sign in to open FS2S 2026 documents, community tools, and your attendee contact card.",
  path: "/attendee/login",
  noIndex: true
});

export default async function AttendeeLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const selfServeEnabled = Boolean(process.env.ATTENDEE_ACCESS_CODE);

  return (
    <div className="container stack" style={{ maxWidth: "980px" }}>
      <section className="hero-card">
        <h1>Attendee Portal</h1>
        <p>
          Create your own attendee account, or sign in if you already have one. Once you are in,
          your portal gives you access to conference documents, the attendee board, and your
          attendee contact card.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">Individual accounts</span>
          <span className="hero-pill">Conference access code</span>
          <span className="hero-pill">Documents and community</span>
        </div>
      </section>

      {params.error ? <div className="empty-state">{params.error}</div> : null}
      {params.success ? <div className="announcement announcement--urgent">{params.success}</div> : null}

      <section className="signup-choice-grid">
        <form action={loginAttendee} className="panel form-grid">
          <div className="section-heading">
            <div>
              <h2>Sign in</h2>
              <p className="muted" style={{ margin: "0.35rem 0 0" }}>
                Use your attendee email and password to open your account.
              </p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button type="submit" className="button">
            Sign in
          </button>
          <Link href="/attendee/forgot-password" className="button-secondary button-link">
            Forgot password?
          </Link>
          <p className="muted" style={{ margin: 0 }}>
            Your account keeps your attendee access professional, personal, and easier to manage
            than a shared conference login.
          </p>
        </form>

        <form action={createAttendeeAccount} className="panel form-grid">
          <div className="section-heading">
            <div>
              <h2>Create account</h2>
              <p className="muted" style={{ margin: "0.35rem 0 0" }}>
                New attendees can create an account with the conference access code and begin using
                the portal right away.
              </p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="create-full-name">Full name</label>
            <input id="create-full-name" name="full_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="create-email">Email</label>
            <input id="create-email" name="email" type="email" required />
          </div>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="create-password">Password</label>
              <input id="create-password" name="password" type="password" required minLength={8} />
            </div>
            <div className="field">
              <label htmlFor="create-confirm-password">Confirm password</label>
              <input
                id="create-confirm-password"
                name="confirm_password"
                type="password"
                required
                minLength={8}
              />
            </div>
          </div>
          <p className="field-hint">
            Use at least 8 characters. A mix of uppercase and lowercase letters, a number, and a
            symbol is recommended.
          </p>
          <div className="field">
            <label htmlFor="create-access-code">Conference access code</label>
            <input
              id="create-access-code"
              name="access_code"
              type="password"
              required
              placeholder="Provided by the conference team"
              disabled={!selfServeEnabled}
            />
          </div>
          <button type="submit" className="button" disabled={!selfServeEnabled}>
            Create attendee account
          </button>
          <p className="muted" style={{ margin: 0 }}>
            {selfServeEnabled
              ? "Your email will be added to the planner-side attendee roster automatically. You can add phone, organization, and sharing preferences after you sign in."
              : "Attendee self-registration is being finalized. If you need access right now, contact the conference team and they can help you get in quickly."}
          </p>
          <p className="field-hint" style={{ marginTop: "-0.15rem" }}>
            Most accounts are ready right away. If the portal asks you to confirm your email first,
            that usually takes less than a minute once you click the link in your inbox.
          </p>
        </form>
      </section>
    </div>
  );
}
