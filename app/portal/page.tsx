import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { deleteSpeakerPortalMessage, postSpeakerPortalMessage } from "@/lib/actions/admin";
import {
  getCurrentUserAssignedSessions,
  getSpeakerPortalDocuments,
  getSpeakerPortalMessages,
  requirePrivateScheduleUser
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import {
  displaySessionTitle,
  formatDateLabel,
  formatTimeRange,
  formatTimestamp,
  labelForCategory
} from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Speaker and Presenter Portal",
  description: "Private speaker and presenter logistics portal for FS2S 2026.",
  path: "/portal",
  noIndex: true
});

export default async function PortalPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [{ profile }, sessions, documents, messages] = await Promise.all([
    requirePrivateScheduleUser(),
    getCurrentUserAssignedSessions(),
    getSpeakerPortalDocuments(),
    getSpeakerPortalMessages()
  ]);

  return (
    <div className="container stack">
      <section className="hero-card">
        <h1>My schedule and logistics</h1>
        <p>
          {profile.full_name ? `${profile.full_name}, ` : ""}
          this private view shows your assigned sessions, logistics notes, shared documents, and
          the speaker/presenter board.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{sessions.length} assigned session{sessions.length === 1 ? "" : "s"}</span>
          <span className="hero-pill">{documents.length} shared document{documents.length === 1 ? "" : "s"}</span>
          <LogoutButton destination="portal" />
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Speaker/Presenter Library</h2>
        </div>
        <p className="muted">
          Year-round documents for speakers and presenters live here, plus any session-specific
          materials your team uploads later.
        </p>
        {documents.length ? (
          <div className="resource-list">
            {documents.map((document) => (
              <article key={document.id} className="announcement">
                <strong>{document.title}</strong>
                <div className="muted">
                  {document.session
                    ? `${displaySessionTitle(document.session)} · ${formatDateLabel(document.session.date)}`
                    : "General speaker/presenter resource"}
                </div>
                {document.description ? <p className="muted">{document.description}</p> : null}
                <div className="admin-actions">
                  {document.signed_url ? (
                    <a href={document.signed_url} className="button button-link" target="_blank" rel="noreferrer">
                      Open document
                    </a>
                  ) : null}
                  <span className="muted">{document.file_name}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">No speaker documents have been uploaded yet.</div>
        )}
      </section>

      <div className="stack">
        {sessions.length ? (
          sessions.map((session) => {
            const assignment = session.speakers[0];
            return (
              <article key={session.id} className={`card session-card session-card--${session.category}`}>
                <div className="session-card__top">
                  <span className="chip">{labelForCategory(session.category)}</span>
                  {assignment?.sessionRole ? <span className="chip">{assignment.sessionRole.replace("_", " ")}</span> : null}
                  {assignment?.confirmationStatus ? (
                    <span className="chip">{assignment.confirmationStatus.replace("_", " ")}</span>
                  ) : null}
                </div>
                <h3>{displaySessionTitle(session)}</h3>
                <div className="session-meta muted">
                  <span>{formatDateLabel(session.date)}</span>
                  <span>{formatTimeRange(session.starts_at, session.ends_at)}</span>
                  <span>{session.venue}</span>
                  <span>{session.room}</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <div className="announcement">
                    <strong>Arrival time</strong>
                    <div className="muted">
                      {assignment?.arrivalTime ? formatTimeRange(assignment.arrivalTime) : "Not set yet"}
                    </div>
                  </div>
                  <div className="announcement">
                    <strong>AV needs</strong>
                    <div className="muted">{assignment?.avNeeds || "No AV details added yet"}</div>
                  </div>
                  <div className="announcement">
                    <strong>Staff contact</strong>
                    <div className="muted">{assignment?.staffContact || "No staff contact added yet"}</div>
                  </div>
                </div>
                <div className="announcement">
                  <strong>Private logistics note</strong>
                  <div className="muted">
                    {assignment?.privateLogisticsNote || "No private logistics note added yet."}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">No assigned sessions are linked to this account yet.</div>
        )}
      </div>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Speaker/Presenter Board</h2>
        </div>
        <p className="muted">
          Quick coordination notes, reminders, and updates for the speaker/presenter community.
        </p>
        <form action={postSpeakerPortalMessage} className="form-grid" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label htmlFor="speaker-portal-message">Post a message</label>
            <textarea
              id="speaker-portal-message"
              name="body"
              rows={4}
              placeholder="Share a reminder, ask a question, or post a logistics update."
              required
            />
          </div>
          {params.error ? <div className="empty-state">{params.error}</div> : null}
          <div className="admin-actions">
            <button type="submit" className="button">
              Post message
            </button>
          </div>
        </form>

        <div className="resource-list" style={{ marginTop: "1rem" }}>
          {messages.length ? (
            messages.map((message) => (
              <article key={message.id} className="announcement">
                <strong>{message.author_name || "Conference team"}</strong>
                <div className="muted">
                  {[message.author_role?.replaceAll("_", " "), formatTimestamp(message.created_at)]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <p className="muted">{message.body}</p>
                {profile.role === "admin" ? (
                  <form action={deleteSpeakerPortalMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="button-danger">
                      Remove
                    </button>
                  </form>
                ) : null}
              </article>
            ))
          ) : (
            <div className="empty-state">No speaker board posts yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
