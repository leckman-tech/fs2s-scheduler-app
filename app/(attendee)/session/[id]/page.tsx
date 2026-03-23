import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { FeedbackForm } from "@/components/feedback-form";
import { getSessionById } from "@/lib/queries";
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
          <div className="admin-actions">
            <FavoriteButton sessionId={session.id} />
          </div>
        </section>

        <section className="panel detail-section">
          <div className="section-heading">
            <h2>About this session</h2>
          </div>
          <div className="detail-copy">{session.description}</div>
        </section>

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
