import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { CivicQuotes } from "@/components/civic-quotes";
import { requireAttendeePortalUser } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal | FS2S",
  description: "Your private FS2S Advocacy Hill Day planning dashboard.",
  path: "/attendee",
  noIndex: true
});

const delegationLeads: Record<string,string> = {
 D01:"Chief Leah Lamb", D02:"Dr. Cheryl Chun", D03:"Adult SFF Lead",
 D04:"Dr. Kamal Wright-Cunningham", D05:"Dr. Mendoza-Davis (1 PM); Chief Aaron Cannon (2 PM)",
 D06:"Mekhi Love", D07:"Ciara Norfleet", D08:"De'Aysia Barner", D09:"Nora Shetty and Surya Srirangarajan"
};
const schedule = [
 { time: "9:45–10:00 a.m.", title: "Check in at Maya Angelou Public Charter High School", description: "5600 East Capitol Street NE, Washington, DC 20019. Meet your delegation leader and check in." },
 { time: "10:00–10:45 a.m.", title: "Advocacy training and group practice", description: "Please read your office briefing materials beforehand so we can spend this time practicing together." },
 { time: "10:45–11:05 a.m.", title: "Lunch at Maya", description: "Lunch is planned before bus loading." },
 { time: "11:05–11:15 a.m.", title: "Bus loading and headcount", description: "Stay with your assigned group and staff lead." },
 { time: "11:15 a.m. (target)", title: "Depart Maya by bus", description: "Transportation has been secured; follow staff instructions for drop-off and security screening." },
 { time: "12:30–3:30 p.m.", title: "Congressional meetings, movement and reflection", description: "All nine delegations have two scheduled policy meetings. D09 also has a brief photo opportunity with Representative Ivey. Follow your assigned itinerary and adult lead; some room details are pending." },
 { time: "3:30–4:00 p.m. (target)", title: "Virtual Hill Day debrief via Zoom", description: "Log on at 3:30 p.m. Eastern using the meeting button at the top of your Attendee Portal. Group leaders coordinate final headcounts and supervised return arrangements." }
];
export default async function AttendeePortalPage({
  searchParams
}: {
  searchParams: Promise<{ archive?: string; error?: string }>;
}) {
  const { profile, user } = await requireAttendeePortalUser();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: debrief } = await supabase.from("attendee_event_links").select("join_url").eq("event_key", "hill-day-debrief-2026").maybeSingle();
  const debriefUrl = debrief?.join_url?.startsWith("https://sffmapcs.zoom.us/j/") ? debrief.join_url : null;
  const { data: grant } = await supabase
    .from("archive_access_grants")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const verifiedEmail = user.email_confirmed_at && user.email ? user.email.trim().toLowerCase() : null;
  const { data: myDelegation } = verifiedEmail
    ? await supabase.from("delegation_assignments")
        .select("delegation_id,status,drive_access_granted")
        .eq("email", verifiedEmail).maybeSingle()
    : { data: null };
  const { data: releasedBriefing } = myDelegation && myDelegation.status !== "held"
    ? await supabase.from("delegation_briefings")
        .select("group_name,office_summary")
        .eq("delegation_id", myDelegation.delegation_id)
        .eq("released", true).maybeSingle()
    : { data: null };
  const hasArchive = profile.role === "admin" || Boolean(grant);
  const offices = releasedBriefing && Array.isArray(releasedBriefing.office_summary)
    ? releasedBriefing.office_summary.filter((value): value is string => typeof value === "string")
    : [];
  const groupLead = myDelegation ? delegationLeads[myDelegation.delegation_id] : null;
  const groupReady = Boolean(releasedBriefing && myDelegation?.drive_access_granted && myDelegation.status !== "held");
  const firstName = profile.full_name?.trim().split(/\s+/)[0];

  return (
    <div className="container stack attendee-app">
      {debriefUrl ? (
        <section id="debrief" className="hill-day-debrief" aria-label="Advocacy Hill Day Zoom debrief">
          <div className="hill-day-debrief__copy">
            <p className="eyebrow">WEDNESDAY, NOVEMBER 18 · 3:30 PM EASTERN</p>
            <h2>Hill Day De-Brief</h2>
            <p>Join Mr. Eckman and fellow participants for our end-of-day reflection on Zoom.</p>
          </div>
          <a href={debriefUrl} target="_blank" rel="noopener noreferrer" className="hill-day-debrief__join">
            <span aria-hidden="true">▶</span> Join Zoom — Log on at 3:30 PM! <span aria-hidden="true">↗</span>
          </a>
        </section>
      ) : null}
      <section className="hero-card attendee-app__welcome">
        <p className="eyebrow">YOUR FS2S PORTAL • WEDNESDAY, NOVEMBER 18</p>
        <h1>Welcome{firstName ? ", " + firstName : ""}!</h1>
        <p>We're glad you're joining us for Advocacy Hill Day. Your voice and perspective matter. On Wednesday, you'll meet fellow Scholars and community partners, prepare together, and take part in conversations about the issues affecting young people. We're looking forward to seeing you!</p>
        <figure className="attendee-app__welcome-photo">
          <div className="attendee-app__welcome-photo-image" role="img" aria-label="United States Capitol building with autumn trees" />
          <figcaption>Washington, D.C. · Our Capitol, our conversations.</figcaption>
        </figure>
        <CivicQuotes />
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
        <a href="#mygroup" className="button-secondary button-link">My delegation</a>
        <Link href="/attendee/briefings" className="button button-link">My congressional briefings</Link>
        <a href="#schedule" className="button-secondary button-link">Day-of schedule</a>
        {debriefUrl ? <a href="#debrief" className="button-secondary button-link">3:30 PM Zoom debrief</a> : null}
        <a href="#reference-book" className="button-secondary button-link">Full reference book</a>
        {hasArchive ? <a href="#archive" className="button-secondary button-link">2026 archive</a> : null}
        <a href="#help" className="button-secondary button-link">Get help</a>
      </nav>

      <section id="mygroup" className="panel attendee-app__mygroup" aria-label="Your Hill Day role and delegation">
        <p className="eyebrow">{profile.role === "admin" ? "EVENT-WIDE ORGANIZER ACCESS" : "YOUR HILL DAY GROUP"}</p>
        {profile.role === "admin" ? (
          <>
            <h2>Event-wide floater · All nine delegations</h2>
            <p>You are not assigned to any single group. Use the briefing library to review each delegation's confirmed appointments and preparation materials.</p>
            <Link href="/attendee/briefings" className="button button-link attendee-app__big-cta">View all nine delegation briefings</Link>
          </>
        ) : myDelegation && releasedBriefing ? (
          <>
            <h2>{myDelegation.delegation_id} — {releasedBriefing.group_name}</h2>
            {groupLead ? <p><strong>Your group leader:</strong> {groupLead}</p> : null}
            <p><strong>Your current congressional appointments:</strong></p>
            <ul className="attendee-app__meeting-list">
              {offices.map(office => <li key={office}>{office}</li>)}
            </ul>
            <Link href="/attendee/briefings" className="button button-link attendee-app__big-cta">Open my group's briefing</Link>
          </>
        ) : (
          <>
            <h2>We are matching your delegation.</h2>
            <p>If your assigned group has not appeared yet, please don't create a second account. Email LEckman@SeeForever.org with the address you registered.</p>
            <Link href="/attendee/briefings" className="button button-link attendee-app__big-cta">Check my briefing</Link>
          </>
        )}
      </section>
      <section className="panel attendee-app__readiness" aria-label="Your account readiness">
        <h2>Before Wednesday</h2>
        <ul>
          <li><span aria-hidden="true">{verifiedEmail ? "✓" : "○"}</span><span><strong>Email verified</strong><small>{verifiedEmail ? "You're signed in with a verified email." : "Please verify your email to access private materials."}</small></span></li>
          <li><span aria-hidden="true">{profile.role === "admin" || myDelegation ? "✓" : "○"}</span><span><strong>{profile.role === "admin" ? "Floater access" : "Delegation assigned"}</strong><small>{profile.role === "admin" ? "You can open all nine delegation briefings." : myDelegation ? myDelegation.delegation_id + " — Your group is listed above." : "Your group is still being matched."}</small></span></li>
          <li><span aria-hidden="true">{profile.role === "admin" || groupReady ? "✓" : "○"}</span><span><strong>Briefing available</strong><small>{profile.role === "admin" ? "Your staff library includes all released groups." : groupReady ? "Open and read your PDF before Wednesday. Reading completion is not tracked." : "Contact us if you cannot see your documents."}</small></span></li>
        </ul>
        <p className="muted">Please reply to your invitation to confirm attendance by Tuesday at 4:30 PM. School permission slips and other approvals are handled separately.</p>
      </section>
      <section id="schedule" className="panel callout-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">PLAN YOUR DAY</p>
        <h2>Your Wednesday schedule</h2>
        <p>Here's what we currently have planned. Check this section for the broad timeline; individual congressional appointments and arrival details will be confirmed separately.</p>
        <div className="timeline-grid">
          {schedule.map((item) => (
            <article key={item.title} className="timeline-card">
              <p className="timeline-card__label">{item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {debriefUrl && item.title === "Virtual Hill Day debrief via Zoom" ? <a href={debriefUrl} target="_blank" rel="noopener noreferrer" className="button button-link">Join Zoom debrief ↗</a> : null}
            </article>
          ))}
        </div>
        <div className="hero-actions">
          <Link href="/lobby-day#schedule" className="button-secondary button-link">See the full Hill Day plan →</Link>
          <a href="mailto:LEckman@SeeForever.org?subject=Hill%20Day%20Attendance%20Confirmation" className="button-secondary button-link">Confirm my attendance by email</a>
        </div>
        <p className="muted" style={{fontSize:"0.89rem"}}>Having an account does not mean a student has received school approval or that a congressional appointment has been assigned.</p>
      </section>

      <section id="reference-book" className="panel attendee-app__reference" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">OPTIONAL REFERENCE • ALL DELEGATIONS</p>
        <h2>Master Congressional Briefing Book</h2>
        <p>This is the <strong>75-page full reference book</strong> covering all 18 policy meetings and the photo opportunity, with a clickable table of contents. It is separate from your assigned delegation briefing. Start with <strong>My Congressional Briefings</strong> above to find the meetings you are attending.</p>
        <div className="hero-actions">
          <a className="button-secondary button-link" href="https://drive.google.com/file/d/1X8cmoge4IrtnT0GMBTp1IkowiUsQjBX_/view" target="_blank" rel="noopener noreferrer">Open master briefing book ↗</a>
        </div>
        <p className="muted">The master copy opens in Google Drive and is viewable by anyone with its link. Do not treat another group's meeting as your own. If anything appears incorrect, email LEckman@SeeForever.org.</p>
      </section>

      {hasArchive ? <section id="archive" className="panel callout-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">HISTORICAL MATERIALS</p>
        <h2>2026 Convening Archive</h2>
        <p>Your archive permission is active. View the April 1–3, 2026 program and documents.</p>
        <Link href="/2026-archive#archive-documents" className="button-secondary button-link">Open approved archive</Link>
      </section> : null}

      <section id="help" className="panel story-panel" style={{scrollMarginTop:"6.5rem"}}>
        <p className="eyebrow">QUESTIONS &amp; HELP</p>
        <h2>We're here to help.</h2>
        <p>If you cannot sign in or open your briefing, email the address you registered with and a description of the problem. Never share your password. For day-of questions, call or text <a href="tel:+12028387879">202-838-7879</a>.</p>
        <div className="hero-actions"><a className="button-secondary button-link" href="tel:+12028387879">Call Hill Day contact</a><a className="button-secondary button-link" href="sms:+12028387879">Text Hill Day contact</a></div>
        <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Attendee%20Portal%20Question" className="button-secondary button-link">Contact the organizing team</a>
      </section>
    </div>
  );
}
