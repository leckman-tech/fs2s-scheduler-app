import type { Metadata } from "next";
import { requestAttendeePasswordReset } from "@/lib/actions/admin";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reset Attendee Password",
  description: "Send a password reset link for your FS2S attendee account.",
  path: "/attendee/forgot-password",
  noIndex: true
});

export default async function AttendeeForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container" style={{ maxWidth: "640px" }}>
      <section className="hero-card">
        <h1>Reset your attendee password</h1>
        <p>
          Enter the email you used for your attendee account and we will send you a secure reset
          link.
        </p>
      </section>

      <form action={requestAttendeePasswordReset} className="panel form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label htmlFor="attendee-reset-email">Email</label>
          <input
            id="attendee-reset-email"
            name="email"
            type="email"
            required
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            spellCheck={false}
            inputMode="email"
          />
        </div>
        <p className="field-hint" style={{ marginTop: "-0.15rem" }}>
          Email is not case-sensitive.
        </p>

        {params.error ? <div className="empty-state">{params.error}</div> : null}
        {params.success ? <div className="announcement announcement--urgent">{params.success}</div> : null}

        <button type="submit" className="button">
          Email reset link
        </button>
      </form>
    </div>
  );
}
