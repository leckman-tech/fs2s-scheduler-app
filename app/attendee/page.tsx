import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { requireAttendeePortalUser } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal | FS2S",
  description: "Your private FS2S Advocacy Hill Day planning dashboard.",
  path: "/attendee",
  noIndex: true
});

const schedule = [
 { time: "9:45–10:00 a.m.", title: "Check in at Maya Angelou Public Charter High School", description: "5600 East Capitol Street NE, Washington, DC 20019. Meet your delegation leader and check in." },
 { time: "10:00–10:45 a.m.", title: "Advocacy training and group practice", description: "Please read your office briefing materials beforehand so we can spend this time practicing together." },
 { time: "10:45–11:05 a.m.", title: "Lunch at Maya", description: "Lunch is planned before bus loading." },
 { time: "11:05–11:15 a.m.", title: "Bus loading and headcount", description: "Stay with your assigned group and staff lead." },
 { time: "11:15 a.m. (target)", title: "Depart Maya by bus", description: "Exact bus arrival, drop-off and security-screening time will be confirmed with transportation staff." },
 { time: "12:30–3:30 p.m.", title: "Congressional meetings, movement and reflection", description: "Group meeting times vary. Partner delegations have two appointments; Maya-only groups have one plus a second activity to be selected. No unconfirmed activity should be treated as booked." },
 { time: "3:30–4:00 p.m. (target)", title: "Debrief and accountability", description: "Group leaders coordinate final headcounts and supervised return arrangements." }
];
export default async function AttendeePortalPage({
  searchParams
}: {
  searchParams: Promise<{ archive?: string; error?: string }>;
}) {
  const { profile, user } = await requireAttendeePortalUser();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: grant } = await supabase
    .from("archive_access_grants")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const verifiedEmail = user.email_confirmed_at && user.email ? user.email.trim().toLowerCase() : null;
  const { data: myDelegation } = verifiedEmail
    ? await supabase.from("delegation_assignments")
        .select("delegation_id,status")
        .eq("email", verifiedEmail).maybeSingle()
    : { data: null };
  const { data: releasedBriefing } = myDelegation && myDelegation.status !== "held"
    ? await supabase.from("delegation_briefings")
        .select("group_name")
        .eq("delegation_id", myDelegation.delegation_id)
        .eq("released", true).maybeSingle()
    : { data: null };
  const hasArchive = profile.role === "admin" || Boolean(grant);
  const firstName = profile.full_name?.trim().split(/\s+/)[0];

  return (
    <div className="container stack attendee-app">
      <section className="hero-card attendee-app__welcome">
        <p className="eyebrow">YOUR FS2S PORTAL • WEDNESDAY, NOVEMBER 18</p>
        <h1>Welcome{firstName ? ", " + firstName : ""}.</h1>
        <p>Everything you need for Wednesday, in one place. Start with your group briefing, then check the arrival plan and contact information.</p>
        <div className="hero-meta">
          <span className="hero-pill">Wednesday, November 18, 2026</span>
          <span className="hero-pill">Washington, D.C.</span>
          <LogoutButton destination="attendee" />
        </div>
      </section>

      {params.archive === "restricted" || params.error ? (
        <div className="announcement" role="status">
          <strong>Archive access is not yet enabled for this account.</strong>
          <p>You can still use the attendee portal and Hill Day schedule. For historical archive access, please contact the organizing team.</p>
        </div>
      ) : null}

      <nav className="attendee-app__nav" aria-label="Attendee portal navigation">
        <Link href="/attendee/briefings" className="button button-link">My briefing</Link>
        <a href="#schedule" className="button-secondary button-link">Day-of schedule</a>
        <a href="#reference-book" className="button-secondary button-link">Master briefing book</a>
        <a href="#help" className="button-secondary button-link">Get help</a>
      </nav>

      <section className="context-grid attendee-app__actions" aria-label="Your attendee tools">
        <article className="panel story-panel" style={{borderTop:"4px solid #b51224"}}>
          <p className="eyebrow">YOUR CONGRESSIONAL MEETINGS</p>
          <h2>Your delegation briefing</h2>

          {releasedBriefing && myDelegation ? (
            <p><strong>{myDelegation.delegation_id} · {releasedBriefing.group_name}</strong> — your delegation's assigned congressional briefings are ready. Please review them before November 18.</p>
          ) : (
            <p>Your group documents will appear here when your verified email is matched. You do not need to register again. Contact us if you need help.</p>
          )}
          <div className="hero-actions">
            <Link href="/attendee/briefings" className="button button-link">
              {releasedBriefing ? "Open my group briefing →" : "Check my briefing access →"}
            </Link>
          </div>
        </article>
        <article className="panel story-panel">
          <p className="eyebrow">WEDNESDAY, NOVEMBER 18</p>
          <h2>Where to go on Wednesday</h2>
          <p><strong>Check in 9:45–10:00 AM</strong> at MAPCS-HS, 5600 East Capitol Street NE, Washington, DC 20019. Lunch is at 10:45 AM; bus departures begin at 11:15 AM.</p>
          <a href="#schedule" className="button-secondary button-link">See the day-of schedule ↓</a>
        </article>
      </section>

      <section id="schedule" className="panel callout-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">PLAN YOUR DAY</p>
        <h2>Tentative schedule for November 18</h2>
        <p>Here's what we currently have planned. Check this section for the broad timeline; individual congressional appointments and arrival details will be confirmed separately.</p>
        <div className="timeline-grid">
          {schedule.map((item) => (
            <article key={item.title} className="timeline-card">
              <p className="timeline-card__label">{item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions">
          <Link href="/lobby-day#schedule" className="button-secondary button-link">See the full Hill Day plan →</Link>
          <Link href="/lobby-day#register" className="button-secondary button-link">Registration information</Link>
        </div>
        <p className="muted" style={{fontSize:"0.89rem"}}>Having an account does not mean a student has received school approval or that a congressional appointment has been assigned.</p>
      </section>

      <section id="reference-book" className="panel attendee-app__reference" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">OPTIONAL REFERENCE • ALL DELEGATIONS</p>
        <h2>Master Congressional Briefing Book</h2>
        <p>This is the <strong>full reference book</strong> covering all congressional meetings. It is separate from your assigned delegation briefing. Start with <strong>My Congressional Briefings</strong> above to find the meetings you are attending.</p>
        <div className="hero-actions">
          <a className="button-secondary button-link" href="https://drive.google.com/file/d/1X8cmoge4IrtnT0GMBTp1IkowiUsQjBX_/view" target="_blank" rel="noopener noreferrer">Open master briefing book ↗</a>
        </div>
        <p className="muted">Google Drive may require separate access for this master copy. If access is denied, email LEckman@SeeForever.org. Do not use the master book to assume you are assigned to another meeting.</p>
      </section>

      <section id="archive" className="panel callout-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">HISTORICAL MATERIALS</p>
        <h2>2026 Convening Archive</h2>
        {hasArchive ? (
          <>
            <p>Your archive permission is active. View the April 1–3, 2026 program and open attendee documents in the archive library.</p>
            <Link href="/2026-archive#archive-documents" className="button button-link">Open my archive and documents →</Link>
          </>
        ) : (
          <>
            <p>The April 2026 convening archive is available to accounts approved by the organizing team. Creating an attendee account does not automatically grant archive access.</p>
            <a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%202026%20Archive%20Access">Request archive access</a>
          </>
        )}
      </section>

      <section id="help" className="panel story-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">QUESTIONS &amp; HELP</p>
        <h2>We're here to help.</h2>
        <p>If you cannot sign in or open your briefing, email the address you registered with and a description of the problem. Never share your password. For day-of questions, call or text <a href="tel:+13606002612">360-600-2612</a>.</p>
        <div className="hero-actions"><a className="button-secondary button-link" href="tel:+13606002612">Call Hill Day contact</a><a className="button-secondary button-link" href="sms:+13606002612">Text Hill Day contact</a></div>
        <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Attendee%20Portal%20Question" className="button-secondary button-link">Contact the organizing team</a>
      </section>
    </div>
  );
}
