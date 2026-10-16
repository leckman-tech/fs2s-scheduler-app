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

  return (
    <div className="container stack" style={{ maxWidth: "980px" }}>
      <section className="hero-card">
        <h1>Attendee Portal</h1>
        <p>
          Create an account with your own email address and password to follow November 18 Hill Day planning updates. Verify your email to activate the account. Historical 2026 convening materials require separate permission.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">Individual accounts</span>
          <span className="hero-pill">Email verification</span>
          <span className="hero-pill">Hill Day planning</span>
        </div>
      </section>

      {params.error ? <div className="empty-state">{params.error}</div> : null}
      {params.success ? (
        <section role="status" aria-live="polite" className="panel" style={{background:"#fff5f3",border:"2px solid #ad1329",padding:"1.75rem",marginBottom:"1.5rem"}}>
          <p className="eyebrow" style={{color:"#a10c22",fontWeight:800,letterSpacing:"0.08em"}}>ACTION REQUIRED · VERIFY YOUR EMAIL</p>
          <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",margin:"0.45rem 0"}}>Check your inbox to activate your account.</h2>
          <p style={{fontSize:"1.1rem",lineHeight:1.6}}>We sent a verification link to the email address you registered with. <strong>You must click “Verify My Email Address” in that email before you can sign in.</strong></p>
          <p style={{marginBottom:0}}>Didn't see it? Check Spam or Promotions. Once verified, return here and sign in using your new password.</p>
        </section>
      ) : null}

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
            <input
              id="email"
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
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="current-password"
              spellCheck={false}
            />
          </div>
          <p className="field-hint" style={{ marginTop: "-0.15rem" }}>
            Email is not case-sensitive. Passwords are case-sensitive.
          </p>
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
                Anyone can register, but your account is NOT active until you click the verification link emailed to you.
              </p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="create-full-name">Full name</label>
            <input id="create-full-name" name="full_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="create-email">Email</label>
            <input
              id="create-email"
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
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="create-password">Password</label>
              <input
                id="create-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
                spellCheck={false}
              />
            </div>
            <div className="field">
              <label htmlFor="create-confirm-password">Confirm password</label>
              <input
                id="create-confirm-password"
                name="confirm_password"
                type="password"
                required
                minLength={8}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
                spellCheck={false}
              />
            </div>
          </div>
          <p className="field-hint">
            Use at least 8 characters. A mix of uppercase and lowercase letters, a number, and a
            symbol is recommended. Email capitalization does not matter, but your password is
            case-sensitive.
          </p>

          <button type="submit" className="button" >
            Create attendee account
          </button>
          <div role="note" style={{background:"#fff4f2",borderLeft:"5px solid #a10c22",borderRadius:"8px",padding:"1rem 1.2rem"}}>
            <strong style={{display:"block",color:"#971326",fontSize:"1.05rem",marginBottom:"0.4rem"}}>IMPORTANT: Check your email after registering.</strong>
            <p style={{margin:"0 0 0.4rem"}}>We'll send a confirmation email. Open it and click <strong>Verify My Email Address</strong> to activate your account. You cannot sign in until verification is complete.</p>
            <p style={{margin:0,fontSize:"0.9rem"}}>No email? Check your Spam or Promotions folder.</p>
          </div>
        </form>
      </section>
    </div>
  );
}
