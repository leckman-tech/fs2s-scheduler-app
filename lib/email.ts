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
  idempotencyKey?: string;
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
    return { sent: false, skipped: true, error: "Email provider not configured" };
  }

  const requestBody = JSON.stringify({
    from: fromEmail,
    to: [payload.to],
    reply_to: replyTo,
    subject: payload.subject,
    html: payload.html,
    text: payload.text
  });
  let lastError = "Email provider unavailable";

  // The same key is reused for retries so Resend doesn't send duplicates.
  // Retries cover temporary rate limits and provider/network outages.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(payload.idempotencyKey ? { "Idempotency-Key": payload.idempotencyKey } : {})
        },
        body: requestBody
      });

      if (response.ok) return { sent: true };
      lastError = (await response.text().catch(() => "")) || `Email provider returned ${response.status}`;
      const temporaryFailure = response.status === 429 || response.status === 409 || response.status >= 500;
      if (!temporaryFailure || attempt === 2) break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unexpected email error";
      if (attempt === 2) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 450 * (2 ** attempt)));
  }

  return { sent: false, error: lastError };
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

export async function sendLobbyDayConfirmationEmail(input: { to: string; fullName: string; }) {
  const title = "Your interest in November 18 Advocacy Hill Day is recorded";
  const content = wrapEmailContent(title,
    `Thank you, ${input.fullName}. We've recorded your interest in the FS2S Advocacy Hill Day on Wednesday, November 18, 2026.`,
    ["Location: Capitol Hill, Washington, D.C. (exact meeting locations to be confirmed).",
     "Meeting appointments, lunch arrangements, transportation and the detailed itinerary are not yet final.",
     "This is an acknowledgment of interest, not confirmation of attendance or an assigned congressional meeting.",
     "For student attendees, school approval and guardian permissions will be coordinated separately."],
    {href:`${SITE_URL}/lobby-day`,label:"View tentative Hill Day details"});
  return sendEmail({
    to:input.to,subject:title,html:content.html,text:content.text,
    idempotencyKey:`lobby-attendee-${input.to.trim().toLowerCase()}`
  });
}

export async function sendLobbyDayAdminNotification(input: {fullName:string; email:string; phone:string; organization:string;}) {
  const safe=(s:string)=>s.replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
  const subject="New FS2S Advocacy Hill Day registration of interest";
  const lines=[`Name: ${input.fullName}`,`Email: ${input.email}`,`Phone: ${input.phone}`,`Organization: ${input.organization||"Not provided"}`, "Event: Wednesday, November 18, 2026", "Status: expression of interest, not confirmed participation."];
  return sendEmail({
    to:"LEckman@SeeForever.org",
    subject,
    idempotencyKey:`lobby-admin-${input.email.trim().toLowerCase()}`,
    text:lines.join("\n"),
    html:`<div style="font-family:Georgia,serif;line-height:1.6"><h2>New Hill Day registration of interest</h2><ul>${lines.map(s=>`<li>${safe(s)}</li>`).join("")}</ul><p><a href="${SITE_URL}/lobby-day">View Hill Day page</a></p></div>`
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

export async function sendAttendeeAccountWelcomeEmail(input: {
  to: string;
  fullName: string;
}) {
  const title = "Your FS2S attendee account is ready";
  const content = wrapEmailContent(
    title,
    `Welcome, ${input.fullName}. Your attendee account has been created and you can now sign in to the portal with your own email and password.`,
    [
      "Open conference documents, handouts, and shared attendee resources.",
      "Join the attendee board from your own account identity.",
      "Update your contact card later with your phone, title, organization, and sharing preferences."
    ],
    {
      href: `${SITE_URL}/attendee/login`,
      label: "Open the Attendee Portal"
    }
  );

  return sendEmail({
    to: input.to,
    subject: title,
    html: content.html,
    text: content.text
  });
}


/** One-time participant onboarding QA. This sender cannot address anyone else. */
export async function sendHillDayPilotAccountEmail(input: {
  to: string;
  temporaryPassword: string;
  verificationUrl: string;
}): Promise<EmailResult> {
  const allowed = "levi.eckman+fs2s-test@gmail.com";
  if (input.to.trim().toLowerCase() !== allowed) {
    return { sent: false, error: "Test invitation destination is restricted." };
  }
  if (!input.temporaryPassword || !input.verificationUrl.startsWith(
    SITE_URL + "/auth/confirm?type=signup&token_hash="
  )) return { sent: false, error: "Incomplete or invalid test activation link." };

  const escape = (s: string) => s.replace(/[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
  const title = "FS2S Test Account — Complete Your First Login";
  const body = [
    "This is the requested test for the November 18 FS2S attendee portal. It is not an event invitation.",
    "TEST ACCOUNT EMAIL: " + allowed,
    "TEMPORARY PASSWORD: " + input.temporaryPassword,
    "1. Open this single-use email verification link: " + input.verificationUrl,
    "2. Choose your own new password when prompted (at least 12 characters).",
    "3. Open https://fs2shub.com/attendee/briefings and confirm you see D05 Youth Justice Partners: Senator Durbin and Senator Peters (Hart 724).",
    "4. Check that there are no briefings for unrelated delegations.",
    "Only use this test alias, not your school administrator account. Keep this message private."
  ];
  return sendEmail({
    to: allowed,
    subject: title,
    text: body.join("\n\n"),
    html: '<div style="font:16px/1.6 Arial,sans-serif;max-width:660px;margin:24px auto;">' +
      '<h2>' + escape(title) + '</h2>' +
      body.map(line=>'<p>' + escape(line) + '</p>').join("") + '</div>'
  });
}


/** Individual November 18 credentials, sent only after an admin explicitly chooses email delivery. */

/** Admin-triggered recovery for a rostered but unverified Hill Day attendee.
 * The one-time link is only sent to the mailbox that owns the existing account.
 */
export async function sendHillDayVerificationRecoveryEmail(input: {
  to: string; name: string; verificationUrl: string;
}): Promise<EmailResult> {
  const email=input.to.trim().toLowerCase();
  if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ||
     !input.verificationUrl.startsWith(SITE_URL+"/auth/confirm?type=magiclink&token_hash=")) {
    return {sent:false,error:"Invalid recovery destination or token"};
  }
  const title="FS2S Hill Day — verify your attendee email";
  const firstName=input.name.trim().split(/\\s+/)[0]||"there";
  const content=wrapEmailContent(title,
    `Hi ${firstName}, your FS2S attendee account is already created, but the email address still needs verification. Use this one-time link to confirm your email and open your account.`,
    [
      "This link works once and expires. Do not share it with anyone.",
      "Use your own email address to sign in. Your password has not been changed.",
      "If you did not request attendee access, you can ignore this message."
    ],
    {href:input.verificationUrl,label:"Verify email and open attendee portal"}
  );
  return sendEmail({to:email,subject:title,html:content.html,text:content.text});
}

export async function sendHillDayIndividualInvitation(input: {
  to: string;
  name: string;
  delegation: string | null;
  accountStatus: "created" | "existing";
  temporaryPassword?: string;
  verificationUrl?: string;
  pdfReady: boolean;
}): Promise<EmailResult> {
  const email=input.to.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {sent:false,error:"Invalid recipient email"};
  }
  if (email === "levi.eckman+fs2s-test@gmail.com") {
    return {sent:false,skipped:true,error:"Test alias excluded from participant broadcast"};
  }
  const isNew=input.accountStatus==="created";
  if (isNew && (!input.temporaryPassword || 
      !input.verificationUrl?.startsWith(SITE_URL+"/auth/confirm?type=signup&token_hash="))) {
    return {sent:false,error:"Activation details missing; no email sent."};
  }
  const firstName=input.name.trim().split(/\s+/)[0] || "there";
  const contingent=input.delegation==="D03"
    ? "If you are a Black Swan Academy young person, attendance still depends on parental consent. Your account is not final attendance approval."
    : null;
  const coordinator=input.name.toLowerCase().includes("coordinator") ||
    input.name.toLowerCase().includes("emily daly");
  const pdfMessage=input.pdfReady
    ? "Your congressional briefing is available in your attendee portal under 'My Congressional Briefings.' This is the briefing for your delegation, not the entire event's briefing book."
    : "Your delegation information is being prepared, but your PDF requires separate delivery. Contact the organizing team if you cannot see the briefing after signing in.";
  const greeting="Hi "+firstName+",";
  const lines=[
    greeting,
    "We're preparing for the FS2S Advocacy Hill Day on Wednesday, November 18. Please review your briefing before arriving so the morning training can focus on practicing with your group.",
    isNew
      ? "We've created a private attendee login for you. Complete these steps in order:"
      : "You already have an attendee account. We've kept your password unchanged.",
    isNew
      ? "1. Open your individual verification link: "+input.verificationUrl
      : "1. Visit "+SITE_URL+"/attendee/login",
    isNew
      ? "2. Sign in with email "+email+" and temporary password: "+input.temporaryPassword
      : "2. Sign in with your usual email and password. If needed, select 'Forgot password' or visit "+SITE_URL+"/attendee/forgot-password",
    isNew
      ? "3. When prompted, choose a new password of at least 12 characters, including letters and numbers. The temporary password will no longer work after you change it."
      : "3. Open 'My Congressional Briefings' in your attendee portal.",
    isNew
      ? "4. Open 'My Congressional Briefings' and review the PDF specifically assigned to your delegation."
      : "",
    input.delegation ? (coordinator
      ? "Your organization’s briefing access is for delegation "+input.delegation+". You are listed as a coordinating contact, not as an additional attendee."
      : "Your working delegation: "+input.delegation+".") : "",
    pdfMessage,
    contingent ?? "",
    "Please note: receiving portal access does not replace school approvals, parental consent where applicable, or final group-leader confirmation.",
    "Wednesday schedule: Meet at Maya Angelou Public Charter School at 9:45–10:00 a.m. Training and group practice are 10:00–10:45 a.m., lunch begins at 10:45, and buses are scheduled to leave at 11:15 a.m. Hill meetings follow after arrival and security screening.",
    "On Monday, November 16, we'll send more preparation activities tailored to your delegation, including discussion prompts and questions to practice before Wednesday's meetings.",
    "Please do not share your password or individual verification link. If you cannot sign in, reply directly to this email.",
    "Thank you,",
    "Levi W. Eckman, J.D. | (202)-838-7879",
    "LEckman@SeeForever.org | Washington, D.C.",
    "The See Forever Foundation & Maya Angelou Schools",
    "Vice-Chair, District of Columbia Out-of-School Time Commission 2026–2027",
    "Want to talk more? Book with me on Calendly: https://calendly.com/leckman-seeforever"
  ].filter(Boolean);
  const safe=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c));
  const html='<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;max-width:660px;margin:auto;color:#222;">'+
    '<h2 style="font-size:21px;margin-bottom:14px;color:#9b1225;">Your November 18 attendee portal</h2>'+
    lines.map(line=>'<p style="margin:0 0 12px;overflow-wrap:anywhere;">'+safe(line)+'</p>').join("")+'</div>';
  return sendEmail({
    to:email,
    subject:"November 18 FS2S Advocacy Hill Day | Your Attendee Portal",
    html,
    text:lines.join("\n\n")
  });
}
