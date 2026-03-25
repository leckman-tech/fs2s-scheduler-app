"use client";

import { useState } from "react";

type SessionSignupFormProps = {
  sessionId: string;
  sessionTitle: string;
  confirmedCount: number;
  waitlistCount: number;
  capacity: number | null;
  instructions?: string | null;
  signupDeadline?: string | null;
};

type SignupState = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
  confirmedCount: number;
  waitlistCount: number;
  signupStatus: "confirmed" | "waitlist" | null;
};

export function SessionSignupForm({
  sessionId,
  sessionTitle,
  confirmedCount,
  waitlistCount,
  capacity,
  instructions,
  signupDeadline
}: SessionSignupFormProps) {
  const [state, setState] = useState<SignupState>({
    status: "idle",
    message: "",
    confirmedCount,
    waitlistCount,
    signupStatus: null
  });
  const deadlineDate = signupDeadline ? new Date(signupDeadline) : null;
  const isClosed = deadlineDate ? deadlineDate.getTime() < Date.now() : false;
  const deadlineLabel = deadlineDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(deadlineDate)
    : null;

  async function handleSubmit(formData: FormData) {
    setState((current) => ({ ...current, status: "saving", message: "" }));

    const payload = {
      sessionId,
      fullName: String(formData.get("full_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim()
    };

    const response = await fetch("/api/session-signups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as
      | {
          error?: string;
          signupStatus?: "confirmed" | "waitlist";
          confirmedCount?: number;
          waitlistCount?: number;
        }
      | null;

    if (!response.ok || !data?.signupStatus) {
      setState((current) => ({
        ...current,
        status: "error",
        message: data?.error || "We couldn't save your sign-up just now. Please try again."
      }));
      return;
    }

    const form = document.getElementById(`session-signup-form-${sessionId}`) as HTMLFormElement | null;
    form?.reset();

    setState({
      status: "success",
      signupStatus: data.signupStatus,
      confirmedCount: data.confirmedCount ?? confirmedCount,
      waitlistCount: data.waitlistCount ?? waitlistCount,
      message:
        data.signupStatus === "confirmed"
          ? `You're confirmed for ${sessionTitle}.`
          : `You're on the waitlist for ${sessionTitle}. We'll use the information you provided if a spot opens up.`
    });
  }

  return (
    <section className="panel form-grid">
      <div className="section-heading">
        <h2>Sign up for this event</h2>
        <span className="hero-pill">
          {capacity ? `${Math.min(state.confirmedCount, capacity)} / ${capacity} confirmed` : `${state.confirmedCount} confirmed`}
        </span>
      </div>

      <p className="muted" style={{ marginTop: 0 }}>
        {instructions ||
          "Use this form to hold your spot. Phone number is optional, but helpful if the conference team needs to send text updates."}
      </p>

      {deadlineLabel ? (
        <p className="muted" style={{ marginTop: "-0.25rem" }}>
          Sign-ups close {deadlineLabel}.
        </p>
      ) : null}

      <div className="session-signup-stats">
        <article className="session-signup-stat">
          <strong>{state.confirmedCount}</strong>
          <span>confirmed</span>
        </article>
        <article className="session-signup-stat">
          <strong>{state.waitlistCount}</strong>
          <span>waitlist</span>
        </article>
      </div>

      <form id={`session-signup-form-${sessionId}`} className="form-grid" action={handleSubmit}>
        <div className="field">
          <label htmlFor={`full_name-${sessionId}`}>Full name</label>
          <input id={`full_name-${sessionId}`} name="full_name" required disabled={isClosed} />
        </div>

        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor={`email-${sessionId}`}>Email</label>
            <input id={`email-${sessionId}`} name="email" type="email" required disabled={isClosed} />
          </div>

          <div className="field">
            <label htmlFor={`phone-${sessionId}`}>Phone number</label>
            <input id={`phone-${sessionId}`} name="phone" type="tel" placeholder="Optional" disabled={isClosed} />
          </div>
        </div>

        <div className="field">
          <label htmlFor={`organization-${sessionId}`}>Organization or affiliation</label>
          <input id={`organization-${sessionId}`} name="organization" placeholder="Optional" disabled={isClosed} />
        </div>

        <div className="admin-actions">
          <button className="button" type="submit" disabled={state.status === "saving" || isClosed}>
            {isClosed ? "Sign-ups closed" : state.status === "saving" ? "Saving..." : "Save my spot"}
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
