"use client";

import { useState } from "react";
import { FORM_HONEYPOT_FIELD, FORM_STARTED_AT_FIELD } from "@/lib/anti-spam";

type LobbyDaySignupFormProps = {
  totalCount: number;
};

type SignupState = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
  totalCount: number;
};

export function LobbyDaySignupForm({ totalCount }: LobbyDaySignupFormProps) {
  const [state, setState] = useState<SignupState>({
    status: "idle",
    message: "",
    totalCount
  });
  const progressTarget = 300;
  const progressBaseline = 25;
  const visibleSignupCount = progressBaseline + state.totalCount;
  const visibleSignupProgress = Math.min((visibleSignupCount / progressTarget) * 100, 100);
  const remainingToGoal = Math.max(progressTarget - visibleSignupCount, 0);

  async function handleSubmit(formData: FormData) {
    setState((current) => ({ ...current, status: "saving", message: "" }));

    const payload = {
      fullName: String(formData.get("full_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim(),
      [FORM_HONEYPOT_FIELD]: String(formData.get(FORM_HONEYPOT_FIELD) ?? "").trim(),
      [FORM_STARTED_AT_FIELD]: String(formData.get(FORM_STARTED_AT_FIELD) ?? "").trim()
    };

    const response = await fetch("/api/lobby-day-signups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as
      | {
          error?: string;
          totalCount?: number;
          confirmationEmailSent?: boolean;
        }
      | null;

    if (!response.ok) {
      setState((current) => ({
        ...current,
        status: "error",
        message: data?.error || "We couldn't save your Lobby Day sign-up just now. Please try again."
      }));
      return;
    }

    const form = document.getElementById("lobby-day-signup-form") as HTMLFormElement | null;
    form?.reset();

    setState({
      status: "success",
      totalCount: data?.totalCount ?? totalCount,
      message: data?.confirmationEmailSent
        ? "You're on the Lobby Day list. Check your inbox for a confirmation email."
        : "You're on the Lobby Day list. We’ll use your contact information to share updates and next steps."
    });
  }

  return (
    <section className="panel form-grid">
      <div className="section-heading">
        <h2>Sign up for Lobby Day</h2>
        <div
          className="signup-progress"
          role="img"
          aria-label="Lobby Day sign-up momentum toward the Capitol Hill goal"
        >
          <span className="signup-progress__label">Capitol Hill goal</span>
          <div className="signup-progress__track" aria-hidden="true">
            <div
              className="signup-progress__fill"
              style={{ width: `${visibleSignupProgress}%` }}
            />
          </div>
          <span className="signup-progress__caption">{remainingToGoal} to go</span>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 0 }}>
        Use this form to join the Lobby Day list. Please include a phone number so we can share
        day-of updates and Capitol Hill logistics if needed.
      </p>

      <form id="lobby-day-signup-form" className="form-grid" action={handleSubmit}>
        <input type="hidden" name={FORM_STARTED_AT_FIELD} value={String(Date.now())} />
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="lobby-day-website">Leave this field empty</label>
          <input id="lobby-day-website" name={FORM_HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="lobby-day-full-name">Full name</label>
          <input id="lobby-day-full-name" name="full_name" required />
        </div>

        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="lobby-day-email">Email</label>
            <input id="lobby-day-email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="lobby-day-phone">Phone number</label>
            <input id="lobby-day-phone" name="phone" type="tel" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="lobby-day-organization">Organization or affiliation</label>
          <input id="lobby-day-organization" name="organization" placeholder="Optional" />
        </div>

        <div className="admin-actions">
          <button className="button" type="submit" disabled={state.status === "saving"}>
            {state.status === "saving" ? "Saving..." : "Join the Lobby Day list"}
          </button>
          {state.message ? (
            <span className={state.status === "error" ? "status-pill status-cancelled" : "muted"}>
              {state.message}
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
