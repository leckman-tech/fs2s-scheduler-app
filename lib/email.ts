import {
  CONVENING_DIRECTOR_EMAIL,
  CONVENING_DIRECTOR_NAME,
  SITE_NAME,
  SITE_URL
} from "@/lib/constants";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type EmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const replyTo = process.env.RESEND_REPLY_TO ?? CONVENING_DIRECTOR_EMAIL;

  return {
    apiKey,
    fromEmail,
    replyTo,
    configured: Boolean(apiKey && fromEmail)
  };
}

export function isEmailConfigured() {
  return getEmailConfig().configured;
}

async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const { apiKey, fromEmail, replyTo, configured } = getEmailConfig();

  if (!configured || !apiKey || !fromEmail) {
    return { sent: false, skipped: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.to],
        reply_to: replyTo,
        subject: payload.subject,
        html: payload.html,
        text: payload.text
      })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { sent: false, error: detail || "Email provider rejected the request." };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Unexpected email error"
    };
  }
}

function wrapEmailContent(title: string, intro: string, lines: string[], cta?: { href: string; label: string }) {
  const htmlLines = lines.map((line) => `<li style="margin:0 0 8px;">${line}</li>`).join("");

  return {
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;background:#f7f5f2;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;border:1px solid rgba(17,17,17,0.08);">
          <p style="margin:0 0 8px;color:#b51224;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;">${SITE_NAME}</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;">${title}</h1>
          <p style="margin:0 0 18px;color:#3f3f46;">${intro}</p>
          <ul style="margin:0 0 20px;padding-left:18px;color:#3f3f46;">
            ${htmlLines}
          </ul>
          ${
            cta
              ? `<p style="margin:0 0 20px;"><a href="${cta.href}" style="display:inline-block;background:#b51224;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700;">${cta.label}</a></p>`
              : ""
          }
          <p style="margin:20px 0 0;color:#5f5f66;font-size:14px;">
            Questions? Contact ${CONVENING_DIRECTOR_NAME} at <a href="mailto:${CONVENING_DIRECTOR_EMAIL}" style="color:#b51224;">${CONVENING_DIRECTOR_EMAIL}</a>.
          </p>
        </div>
      </div>
    `,
    text: `${title}\n\n${intro}\n\n- ${lines.join("\n- ")}\n\nQuestions? Contact ${CONVENING_DIRECTOR_NAME} at ${CONVENING_DIRECTOR_EMAIL}.\n${cta ? `\n${cta.label}: ${cta.href}` : ""}`
  };
}

export async function sendSessionSignupConfirmationEmail(input: {
  to: string;
  fullName: string;
  signupStatus: "confirmed" | "waitlist";
  sessionTitle: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
}) {
  const title =
    input.signupStatus === "confirmed"
      ? `You’re confirmed: ${input.sessionTitle}`
      : `You’re on the waitlist: ${input.sessionTitle}`;
  const intro =
    input.signupStatus === "confirmed"
      ? `Thanks, ${input.fullName}. Your sign-up has been recorded and you are currently confirmed.`
      : `Thanks, ${input.fullName}. Your sign-up has been recorded and you are currently on the waitlist.`;
  const content = wrapEmailContent(
    title,
    intro,
    [
      `Event: ${input.sessionTitle}`,
      `Date: ${input.dateLabel}`,
      `Time: ${input.timeLabel}`,
      `Location: ${input.locationLabel}`
    ],
    {
      href: `${SITE_URL}`,
      label: "Open FS2S 2026"
    }
  );

  return sendEmail({
    to: input.to,
    subject: title,
    html: content.html,
    text: content.text
  });
}

export async function sendLobbyDayConfirmationEmail(input: {
  to: string;
  fullName: string;
}) {
  const title = "You’re on the Lobby Day list";
  const content = wrapEmailContent(
    title,
    `Thanks, ${input.fullName}. Your Lobby Day sign-up has been recorded.`,
    [
      "Training will begin at the PAC at the MAPCS high school campus.",
      "Lunch will be provided before the group heads to Capitol Hill.",
      "Transportation, advocacy details, and the Zoom debrief will be shared as planning is finalized."
    ],
    {
      href: `${SITE_URL}/lobby-day`,
      label: "View Lobby Day details"
    }
  );

  return sendEmail({
    to: input.to,
    subject: title,
    html: content.html,
    text: content.text
  });
}

export async function sendHappyHourConfirmationEmail(input: {
  to: string;
  fullName: string;
  signupStatus: "confirmed" | "waitlist";
  rsvpGroup: "conference_attendee" | "staff";
}) {
  const title =
    input.signupStatus === "confirmed"
      ? "You’re confirmed for the FS2S Happy Hour"
      : "You’re on the Happy Hour waitlist";
  const intro =
    input.signupStatus === "confirmed"
      ? `Thanks, ${input.fullName}. Your Happy Hour RSVP is confirmed.`
      : `Thanks, ${input.fullName}. Your Happy Hour RSVP is on the waitlist for now.`;
  const audienceLabel =
    input.rsvpGroup === "staff" ? "Invited SFF/MAS staff RSVP" : "Conference attendee RSVP";
  const content = wrapEmailContent(
    title,
    intro,
    [
      `RSVP type: ${audienceLabel}`,
      "Date: Wednesday, April 1, 2026",
      "Time: 4:30 PM-8:00 PM EDT",
      "Location: National Union Building Speakeasy",
      "Light food and an open bar will be provided."
    ],
    {
      href: `${SITE_URL}/happy-hour`,
      label: "View Happy Hour details"
    }
  );

  return sendEmail({
    to: input.to,
    subject: title,
    html: content.html,
    text: content.text
  });
}
