import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackForm } from "@/components/feedback-form";
import { HappyHourRsvpForm } from "@/components/happy-hour-rsvp-form";
import { SessionSignupForm } from "@/components/session-signup-form";
import {
  getPublicHappyHourRsvpSummary,
  getPublicSessionSignupSummary,
  getSessionById
} from "@/lib/queries";
import { getSessionMetadata, getSessionStructuredData } from "@/lib/seo";
import {
  displaySessionTitle,
  formatDateLabel,
  formatTimeRange,
  labelForCategory,
  labelForStatus,
  statusClassName
} from "@/lib/utils";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) {
    return {
      title: "Session not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return getSessionMetadata(session);
}

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) {
    notFound();
  }

  const signupSummary = session.signup_enabled
    ? await getPublicSessionSignupSummary(session.id)
    : null;
  const happyHourSummary = session.session_code === "d1s13" ? await getPublicHappyHourRsvpSummary() : null;

  const structuredData = getSessionStructuredData(session);

  return (
    <div className="container detail-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="stack">
        <section className={`hero-card detail-header detail-header--${session.category}`}>
          <div className="session-card__top">
            <span className="chip">{labelForCategory(session.category)}</span>
            <span className={statusClassName(session.status)}>{labelForStatus(session.status)}</span>
            {session.featured ? <span className="chip" data-active="true">Featured</span> : null}
          </div>
          <h1>{displaySessionTitle(session)}</h1>
          <p>{session.short_description}</p>
          <div className="hero-meta">
            <span className="hero-pill">{formatDateLabel(session.date)}</span>
            <span className="hero-pill">{formatTimeRange(session.starts_at, session.ends_at)}</span>
            <span className="hero-pill">{session.venue}</span>
            <span className="hero-pill">{session.room}</span>
          </div>
        </section>

        <section className="panel detail-section">
          <div className="section-heading">
            <h2>About this session</h2>
          </div>
          <div className="detail-copy">{session.description}</div>
        </section>

        {happyHourSummary ? (
          <section className="panel detail-section">
            <div className="section-heading">
              <h2>Happy Hour RSVP</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>
              Conference guests and invited MAS/SFF staff can RSVP right here. If the room reaches
              capacity, new RSVPs will move to the waitlist automatically.
            </p>
            <HappyHourRsvpForm summary={happyHourSummary} />
            <Link href="/happy-hour" className="button-secondary button-link">
              Open the full Happy Hour page
            </Link>
          </section>
        ) : null}

        {session.signup_enabled ? (
          <SessionSignupForm
            sessionId={session.id}
            sessionTitle={displaySessionTitle(session)}
            confirmedCount={signupSummary?.confirmedCount ?? 0}
            waitlistCount={signupSummary?.waitlistCount ?? 0}
            capacity={session.signup_capacity}
            instructions={session.signup_instructions}
            signupDeadline={session.signup_deadline}
          />
        ) : null}

        <FeedbackForm sessionId={session.id} />
      </div>

      <aside className="stack">
        <section className="panel detail-side-panel">
          <div className="section-heading">
            <h2>Session details</h2>
          </div>
          <div className="detail-list">
            <div>
              <strong>Date</strong>
              <span className="muted">{formatDateLabel(session.date)}</span>
            </div>
            <div>
              <strong>Time</strong>
              <span className="muted">{formatTimeRange(session.starts_at, session.ends_at)}</span>
            </div>
            <div>
              <strong>Venue</strong>
              <span className="muted">{session.venue}</span>
            </div>
            <div>
              <strong>Room</strong>
              <span className="muted">{session.room}</span>
            </div>
            <div>
              <strong>Speakers</strong>
              <span className="muted">
                {session.speakers.length
                  ? session.speakers
                      .map((speaker) =>
                        [speaker.name, speaker.title, speaker.organization].filter(Boolean).join(", ")
                      )
                      .join(" | ")
                  : "Speakers to be announced"}
              </span>
            </div>
          </div>
        </section>

        <section className="panel detail-side-panel">
          <div className="section-heading">
            <h2>Live updates</h2>
          </div>
          <div className="muted">
            {session.live_updates || "No live updates yet. Any last-minute changes will appear here."}
          </div>
        </section>
      </aside>
    </div>
  );
}
