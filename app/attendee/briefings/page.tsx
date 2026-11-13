import type { Metadata } from "next";
import Link from "next/link";
import { requireAttendeePortalUser } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Congressional Briefings | FS2S",
  description: "Your private November 18 congressional briefings, matched to your verified email.",
  path: "/attendee/briefings",
  noIndex: true
});

type BriefingRecord = {
  delegation_id: string;
  group_name: string;
  briefing_name: string;
  drive_file_id: string;
  office_summary: unknown;
  released: boolean;
};

export default async function CongressionalBriefingsPage() {
  const { user, profile } = await requireAttendeePortalUser();
  const verifiedEmail = user.email_confirmed_at && user.email
    ? user.email.trim().toLowerCase()
    : null;
  const supabase = await createClient();

  const { data: assignment, error: assignmentError } = verifiedEmail
    ? await supabase
        .from("delegation_assignments")
        .select("participant_name,delegation_id,status")
        .eq("email", verifiedEmail)
        .maybeSingle()
    : { data: null, error: null };

  const { data: briefing, error: briefingError } = assignment && assignment.status !== "held"
    ? await supabase
        .from("delegation_briefings")
        .select("delegation_id,group_name,briefing_name,drive_file_id,office_summary,released")
        .eq("delegation_id", assignment.delegation_id)
        .eq("released", true)
        .maybeSingle()
    : { data: null, error: null };

  const packet = briefing as BriefingRecord | null;
  const offices = packet && Array.isArray(packet.office_summary)
    ? packet.office_summary.filter((entry): entry is string => typeof entry === "string")
    : [];

  return (
    <main className="container stack">
      <Link href="/attendee" className="button-secondary button-link" style={{width:"fit-content"}}>
        ← Back to attendee portal
      </Link>
      <section className="hero-card">
        <p className="eyebrow">NOVEMBER 18 • YOUR PRIVATE MATERIALS</p>
        <h1>My Congressional Briefings</h1>
        <p>Your delegation's assigned office briefings are matched to the verified email you used to create this account. Read them before arriving at Maya so the 10:00–10:45 a.m. training can focus on practicing as a group.</p>
        <div className="hero-meta">
          <span className="hero-pill">Wednesday, November 18, 2026</span>
          <span className="hero-pill">Arrival at Maya 9:45–10:00 a.m.</span>
        </div>
      </section>

      {assignmentError || briefingError ? (
        <section className="panel" role="status">
          <h2>We couldn't load your briefing assignment.</h2>
          <p>Your materials have not been changed. Please try again or contact the organizing team.</p>
        </section>
      ) : !verifiedEmail ? (
        <section className="panel" role="status">
          <h2>Please verify your email first.</h2>
          <p>Open the verification link sent when you registered, then sign in again. Delegation materials cannot be assigned to unverified email addresses.</p>
        </section>
      ) : assignment?.status === "held" ? (
        <section className="panel" role="status">
          <h2>Your materials are being finalized.</h2>
          <p>We're checking the final group and consent details before publishing your individual briefing. Please contact the organizing team if you need help.</p>
        </section>
      ) : packet && assignment ? (
        <>
          <section className="panel" style={{borderTop:"4px solid #a71930"}}>
            <p className="eyebrow">YOUR DELEGATION • {packet.delegation_id}</p>
            <h2>{packet.group_name}</h2>
            <p>These are your group's currently assigned congressional offices. Your group leader will confirm room access, arrival instructions, and whether every participant can enter both meetings.</p>
            <div className="stack">
              {offices.map(office => <p key={office} style={{margin:0}}><strong>{office}</strong></p>)}
            </div>
            <div className="hero-actions" style={{marginTop:"1rem"}}>
              <a className="button button-link" href={`https://drive.google.com/file/d/${packet.drive_file_id}/view`} target="_blank" rel="noopener noreferrer">
                Open my assigned briefing PDF →
              </a>
            </div>
            <p className="muted" style={{fontSize:"0.87rem"}}>
              This private PDF is shared only with the email address assigned to your delegation. Google Drive may ask you to sign in with that same email. If you cannot open it, please contact the organizing team—do not use someone else's account.
            </p>
          </section>
          {offices.length === 1 ? (
            <section className="panel">
              <p className="eyebrow">SECOND ACTIVITY</p>
              <h2>Details coming soon</h2>
              <p>Your congressional meeting is listed above. Your supervised second activity has not been selected or booked yet.</p>
            </section>
          ) : null}
        </>
      ) : (
        <section className="panel" role="status">
          <p className="eyebrow">ASSIGNMENT PENDING</p>
          <h2>We're finalizing your delegation.</h2>
          <p>There isn't a released briefing for your verified email yet. You don't need to create another account. If your registration used a different email, contact the organizers so we can correct the match securely.</p>
        </section>
      )}

      <section className="panel">
        <p className="eyebrow">PLEASE PREPARE BEFORE WEDNESDAY</p>
        <h2>Know your office. Practice your story.</h2>
        <p>Read your briefing, choose one policy question, and be ready to introduce yourself to your delegation. Plan to arrive at Maya at 9:45–10:00 a.m.; training starts at 10:00, lunch is provided at 10:45, and buses are scheduled to depart at 11:15.</p>
        <div className="hero-actions">
          <Link href="/attendee#schedule" className="button-secondary button-link">Day-of schedule →</Link>
          <a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20My%20Delegation%20Briefing">Request help with my briefing</a>
        </div>
        <p className="muted">Questions about a student's approval or missing consent must be resolved with the organizing team. Having portal access is not proof that a student is cleared to attend.</p>
      </section>
      {profile.role === "admin" ? (
        <section className="panel">
          <Link href="/admin/dashboard/hill-day" className="button-secondary button-link">Admin Hill Day planner →</Link>
        </section>
      ) : null}
    </main>
  );
}
