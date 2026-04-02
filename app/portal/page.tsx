import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import {
  deleteOwnSpeakerPortalDocument,
  deleteSpeakerPortalMessage,
  postSpeakerPortalMessage,
  uploadSpeakerPortalDocument
} from "@/lib/actions/admin";
import {
  getCurrentUserAssignedSessions,
  getSpeakerPortalDocuments,
  getSpeakerPortalMessages,
  getSpeakerPortalUploadSessions,
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
  description: "Private speaker and presenter portal for FS2S 2026 logistics, assigned sessions, and speaker documents.",
  path: "/portal",
  noIndex: true
});

export default async function PortalPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const [{ user, profile }, sessions, documents, messages, uploadSessions] = await Promise.all([
    requirePrivateScheduleUser(),
    getCurrentUserAssignedSessions(),
    getSpeakerPortalDocuments(),
    getSpeakerPortalMessages(),
    getSpeakerPortalUploadSessions()
  ]);

  return (
    <div className="container stack">
      <section className="hero-card">
        <h1>Speaker/Presenter Portal</h1>
        <p>
          {profile.full_name ? `${profile.full_name}, ` : ""}
          this private view gives you your assigned-session logistics, speaker/presenter document
          library, and board updates in one place.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{sessions.length} assigned session{sessions.length === 1 ? "" : "s"}</span>
          <span className="hero-pill">{documents.length} speaker document{documents.length === 1 ? "" : "s"}</span>
          <LogoutButton destination="portal" />
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>What is in this portal</h2>
        </div>
        <div className="story-stat-grid">
          <article className="story-stat">
            <strong>Assigned sessions</strong>
            <span>See only the sessions linked to your speaker or presenter account.</span>
          </article>
          <article className="story-stat">
            <strong>Private documents</strong>
            <span>Open general speaker files and session-specific materials uploaded by the conference team.</span>
          </article>
          <article className="story-stat">
            <strong>Logistics board</strong>
            <span>Check reminders, coordination notes, and speaker/presenter updates in one thread.</span>
          </article>
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Upload slides or handouts</h2>
        </div>
        <p className="muted">
          Add your deck, notes, or supporting materials to the speaker/presenter library so the
          conference team and fellow presenters can access the latest version in one place.
        </p>
        <form action={uploadSpeakerPortalDocument} className="form-grid" encType="multipart/form-data">
          <div className="field">
            <label htmlFor="speaker-upload-session">Attach to session</label>
            <select id="speaker-upload-session" name="session_id" defaultValue="">
              <option value="">General speaker/presenter resource</option>
              {uploadSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {displaySessionTitle(session)} ({formatDateLabel(session.date)})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="speaker-upload-title">File title</label>
            <input
              id="speaker-upload-title"
              name="title"
              type="text"
              placeholder="Ex: Panel slides, workshop handout, or speaking notes"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="speaker-upload-description">Short note</label>
            <textarea
              id="speaker-upload-description"
              name="description"
              rows={3}
              placeholder="Optional context for the conference team or fellow presenters."
            />
          </div>
          <div className="field">
            <label htmlFor="speaker-upload-file">Choose file</label>
            <input id="speaker-upload-file" name="file" type="file" required />
            <p className="field-hint">PDF, PowerPoint, Keynote export, or handout files up to 50 MB.</p>
          </div>
          {params.success ? <div className="announcement">{params.success}</div> : null}
          {params.error ? <div className="empty-state">{params.error}</div> : null}
          <div className="admin-actions">
            <button type="submit" className="button">
              Upload to speaker library
            </button>
          </div>
        </form>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Speaker/Presenter Library</h2>
        </div>
        <p className="muted">
          This document library holds year-round speaker/presenter files, logistics materials, and
          any session-specific resources the conference team uploads for your use.
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
                  {document.uploaded_by === user.id ? (
                    <form action={deleteOwnSpeakerPortalDocument}>
                      <input type="hidden" name="id" value={document.id} />
                      <input type="hidden" name="file_path" value={document.file_path} />
                      <button type="submit" className="button-secondary">
                        Remove upload
                      </button>
                    </form>
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
          Use this board for quick coordination notes, reminders, and updates for the speaker and
          presenter community.
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
