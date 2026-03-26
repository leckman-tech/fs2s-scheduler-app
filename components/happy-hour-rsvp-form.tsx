"use client";

import { useState } from "react";
import type { HappyHourRsvpSummaryRecord } from "@/lib/types";

type HappyHourRsvpFormProps = {
  summary: HappyHourRsvpSummaryRecord;
};

type HappyHourState = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
  rsvpGroup: "conference_attendee" | "staff";
  summary: HappyHourRsvpSummaryRecord;
  signupStatus: "confirmed" | "waitlist" | null;
};

const HARD_CAP = 150;
const PLANNING_TARGET = 125;
const STAFF_CAP = 35;

export function HappyHourRsvpForm({ summary }: HappyHourRsvpFormProps) {
  const [state, setState] = useState<HappyHourState>({
    status: "idle",
    message: "",
    rsvpGroup: "conference_attendee",
    summary,
    signupStatus: null
  });

  const planningProgress = Math.min((state.summary.confirmedCount / HARD_CAP) * 100, 100);
  const planningTargetProgress = (PLANNING_TARGET / HARD_CAP) * 100;

  async function handleSubmit(formData: FormData) {
    setState((current) => ({ ...current, status: "saving", message: "" }));

    const payload = {
      fullName: String(formData.get("full_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim(),
      rsvpGroup: String(formData.get("rsvp_group") ?? "").trim() as "conference_attendee" | "staff"
    };

    const response = await fetch("/api/happy-hour-rsvps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as
      | ({
          error?: string;
          signupStatus?: "confirmed" | "waitlist";
        } & Partial<HappyHourRsvpSummaryRecord>)
      | null;

    if (!response.ok || !data?.signupStatus) {
      setState((current) => ({
        ...current,
        status: "error",
        message: data?.error || "We couldn't save your Happy Hour RSVP just now. Please try again."
      }));
      return;
    }

    const form = document.getElementById("happy-hour-rsvp-form") as HTMLFormElement | null;
    form?.reset();

    setState((current) => ({
      ...current,
      status: "success",
      signupStatus: data.signupStatus,
      summary: {
        confirmedCount: Number(data.confirmedCount ?? current.summary.confirmedCount),
        waitlistCount: Number(data.waitlistCount ?? current.summary.waitlistCount),
        confirmedAttendeeCount: Number(
          data.confirmedAttendeeCount ?? current.summary.confirmedAttendeeCount
        ),
        waitlistAttendeeCount: Number(
          data.waitlistAttendeeCount ?? current.summary.waitlistAttendeeCount
        ),
        confirmedStaffCount: Number(data.confirmedStaffCount ?? current.summary.confirmedStaffCount),
        waitlistStaffCount: Number(data.waitlistStaffCount ?? current.summary.waitlistStaffCount)
      },
      message:
        data.signupStatus === "confirmed"
          ? "You're on the confirmed Happy Hour list. We'll use your contact information if logistics shift."
          : "You're on the Happy Hour waitlist. We'll reach out if space opens up."
    }));
  }

  return (
    <section className="panel form-grid">
      <div className="section-heading">
        <div>
          <h2>Reserve your Happy Hour spot</h2>
          <p className="muted" style={{ margin: "0.3rem 0 0" }}>
            RSVP as a conference attendee or as invited SFF/MAS staff. We&apos;re planning around
            125 guests, with room to stretch to 150 total attendees and up to 35 staff RSVPs.
          </p>
        </div>
      </div>

      <div className="signup-progress signup-progress--happy-hour" role="img" aria-label="Happy Hour planning progress toward the event capacity">
        <div className="signup-progress__track" aria-hidden="true">
          <div className="signup-progress__fill" style={{ width: `${planningProgress}%` }} />
          <span
            className="signup-progress__marker"
            style={{ left: `${planningTargetProgress}%` }}
          />
        </div>
        <div className="signup-progress__copy">
          <span className="signup-progress__label">Planning target: 125 guests</span>
          <span className="signup-progress__caption">Capacity can stretch to 150</span>
        </div>
      </div>

      <form id="happy-hour-rsvp-form" className="form-grid" action={handleSubmit}>
        <input type="hidden" name="rsvp_group" value={state.rsvpGroup} />

        <div className="signup-choice-grid">
          <button
            type="button"
            className={`signup-choice ${state.rsvpGroup === "conference_attendee" ? "signup-choice--active" : ""}`}
            onClick={() =>
              setState((current) => ({ ...current, rsvpGroup: "conference_attendee" }))
            }
          >
            <span className="signup-choice__eyebrow">Conference RSVP</span>
            <strong>Conference attendees</strong>
            <span>For registered convening guests attending the Happy Hour after Day One.</span>
          </button>
          <button
            type="button"
            className={`signup-choice ${state.rsvpGroup === "staff" ? "signup-choice--active" : ""}`}
            onClick={() => setState((current) => ({ ...current, rsvpGroup: "staff" }))}
          >
            <span className="signup-choice__eyebrow">Staff RSVP</span>
            <strong>SFF/MAS staff</strong>
            <span>
              For invited See Forever, Maya, and MAPCS staff. Staff RSVPs are managed within a
              35-person allotment.
            </span>
          </button>
        </div>

        <div className="field">
          <label htmlFor="happy-hour-full-name">Full name</label>
          <input id="happy-hour-full-name" name="full_name" required />
        </div>

        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="happy-hour-email">Email</label>
            <input id="happy-hour-email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="happy-hour-phone">Phone number</label>
            <input id="happy-hour-phone" name="phone" type="tel" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="happy-hour-organization">Organization or team</label>
          <input
            id="happy-hour-organization"
            name="organization"
            placeholder={state.rsvpGroup === "staff" ? "School, program, or department" : "Optional"}
          />
        </div>

        <div className="admin-actions">
          <button className="button" type="submit" disabled={state.status === "saving"}>
            {state.status === "saving" ? "Saving..." : "Save my RSVP"}
          </button>
          {state.message ? (
            <span className={state.status === "error" ? "status-pill status-cancelled" : "muted"}>
              {state.message}
            </span>
          ) : null}
        </div>

        <div className="signup-footnote">
          <span>Open bar and light food will be provided.</span>
          <span>Waitlist opens automatically if space fills.</span>
          <span>We will text or email updates if logistics shift.</span>
        </div>
      </form>
    </section>
  );
}
