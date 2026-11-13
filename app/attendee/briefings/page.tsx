import type { Metadata } from "next";
import Link from "next/link";
import { requireAttendeePortalUser } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Congressional Briefings | FS2S",
  description: "Private congressional briefing space for verified Advocacy Hill Day attendees.",
  path: "/attendee/briefings",
  noIndex: true
});

export default async function CongressionalBriefingsPage() {
  await requireAttendeePortalUser();

  return (
    <div className="container stack">
      <Link href="/attendee" className="button-secondary button-link" style={{width:"fit-content"}}>
        ← Back to my attendee portal
      </Link>

      <section className="hero-card">
        <p className="eyebrow">YOUR HILL DAY PREPARATION</p>
        <h1>My Congressional Briefings</h1>
        <p>This is your private space for the congressional office briefings and meeting instructions connected to your delegation. We'll add materials here as assignments are finalized.</p>
        <div className="hero-meta">
          <span className="hero-pill">Wednesday, November 18, 2026</span>
          <span className="hero-pill">Capitol Hill, Washington, D.C.</span>
        </div>
      </section>

      <section className="panel callout-panel" aria-labelledby="briefings-status">
        <p className="eyebrow">MATERIALS COMING SOON</p>
        <h2 id="briefings-status">Your briefing space is ready.</h2>
        <p>No individual congressional briefing packets have been released here yet. When materials are ready for your delegation, you'll be able to find them in this space. You don't need to create another account.</p>
        <p className="muted">An attendee account does not confirm a congressional appointment. The organizing team will provide final delegation assignments separately.</p>
      </section>

      <section className="panel detail-side-panel" aria-labelledby="briefing-contents">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LOOKING AHEAD</p>
            <h2 id="briefing-contents">What you'll find here</h2>
            <p className="muted">One place to prepare for your congressional visits once the materials are available.</p>
          </div>
        </div>
        <div className="story-stat-grid">
          <article className="story-stat">
            <strong>Congressional offices</strong>
            <span>Your delegation's assigned offices and meeting contacts</span>
          </article>
          <article className="story-stat">
            <strong>Briefing packets</strong>
            <span>Office background, advocacy priorities and suggested talking points</span>
          </article>
          <article className="story-stat">
            <strong>Meeting details</strong>
            <span>Confirmed appointment times, locations and arrival instructions</span>
          </article>
        </div>
      </section>

      <section className="panel story-panel">
        <p className="eyebrow">IN THE MEANTIME</p>
        <h2>Plan for November 18.</h2>
        <p>The tentative schedule is already available in your attendee portal. Review it now while your individual congressional materials are being prepared.</p>
        <div className="hero-actions">
          <Link href="/attendee#schedule" className="button button-link">View tentative schedule →</Link>
          <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Congressional%20Briefings" className="button-secondary button-link">Ask a question</a>
        </div>
      </section>
    </div>
  );
}
