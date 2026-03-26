import type { Metadata } from "next";
import Link from "next/link";
import { AttendeePasswordResetForm } from "@/components/attendee-password-reset-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Set a New Attendee Password",
  description: "Choose a new password for your FS2S attendee account.",
  path: "/attendee/reset-password",
  noIndex: true
});

export default function AttendeeResetPasswordPage() {
  return (
    <div className="container stack" style={{ maxWidth: "680px" }}>
      <section className="hero-card">
        <h1>Choose a new password</h1>
        <p>
          Set your new attendee password below, then return to the Attendee Portal and sign in
          with your updated credentials.
        </p>
      </section>

      <AttendeePasswordResetForm />

      <div className="admin-actions">
        <Link href="/attendee/login" className="button-secondary button-link">
          Back to attendee login
        </Link>
      </div>
    </div>
  );
}
