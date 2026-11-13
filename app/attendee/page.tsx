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
  { time: "Around 10:00 a.m.", title: "Morning gathering and advocacy preparation", description: "Check-in, student voice, advocacy briefings and delegation preparation. Final venue and arrival instructions will follow." },
  { time: "11:30 a.m.", title: "Lunch", description: "Lunch details will be shared with registered participants when arrangements are finalized." },
  { time: "12:30 p.m.", title: "Congressional advocacy begins", description: "Delegations begin afternoon Hill visits. Each office appointment and delegation assignment will be confirmed separately." },
  { time: "Afternoon", title: "Congressional meetings", description: "Small groups discuss education, juvenile justice, reentry and opportunity. Exact times and locations vary by office." },
  { time: "Before departure", title: "Wrap-up and next steps", description: "Delegations reconnect, share takeaways and discuss next steps." }
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
  const hasArchive = profile.role === "admin" || Boolean(grant);
  const firstName = profile.full_name?.trim().split(/\s+/)[0];

  return (
    <div className="container stack">
      <section className="hero-card">
        <p className="eyebrow">YOUR FS2S PORTAL</p>
        <h1>Welcome{firstName ? ", " + firstName : ""}.</h1>
        <p>Welcome to your home for November 18 Advocacy Hill Day. Your schedule, congressional briefing space and any authorized historical materials are easy to find below.</p>
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

      <nav className="hero-actions" aria-label="Attendee portal navigation" style={{margin:"0.35rem 0"}}>
        <a href="#schedule" className="button-secondary button-link">Tentative schedule</a>
        <Link href="/attendee/briefings" className="button-secondary button-link">Congressional briefings</Link>
        <a href="#archive" className="button-secondary button-link">2026 archive</a>
        <a href="#help" className="button-secondary button-link">Help</a>
      </nav>

      <section className="context-grid" aria-label="Your attendee tools">
        <article className="panel story-panel" style={{borderTop:"4px solid #b51224"}}>
          <p className="eyebrow">YOUR CONGRESSIONAL MEETINGS</p>
          <h2>My Congressional Briefings</h2>
          <p>Find your delegation's congressional office information, briefing packets and meeting instructions here when they are released. Your private briefing space is available now.</p>
          <div className="hero-actions" style={{alignItems:"center"}}>
            <Link href="/attendee/briefings" className="button button-link">Open my briefing space →</Link>
            <span className="muted" style={{fontSize:"0.86rem"}}>Materials coming soon</span>
          </div>
        </article>
        <article className="panel story-panel">
          <p className="eyebrow">WEDNESDAY, NOVEMBER 18</p>
          <h2>Your Hill Day schedule</h2>
          <p>See the working plan for the day, from morning arrival through afternoon congressional visits. Exact delegation assignments will follow.</p>
          <a href="#schedule" className="button-secondary button-link">View the tentative schedule ↓</a>
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
        <p>If you need assistance with your account, a briefing assignment, the tentative schedule or historical archive permission, reach out directly.</p>
        <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Attendee%20Portal%20Question" className="button-secondary button-link">Contact the organizing team</a>
      </section>
    </div>
  );
}
