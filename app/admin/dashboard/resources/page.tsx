import {
  deletePortalDocument,
  deleteSpeakerPortalMessage,
  togglePortalDocumentPublish,
  uploadPortalDocument
} from "@/lib/actions/admin";
import {
  getAdminPortalDocuments,
  getAdminPortalMessages,
  getResourceEligibleSessions
} from "@/lib/queries";
import {
  displaySessionTitle,
  formatDateLabel,
  formatTimestamp,
  labelForCategory
} from "@/lib/utils";

export default async function AdminResourcesPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [sessions, documents, messages] = await Promise.all([
    getResourceEligibleSessions(),
    getAdminPortalDocuments(),
    getAdminPortalMessages()
  ]);

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>Admin Portal</h1>
        <p>
          Upload attendee handouts, speaker/presenter files, and keep the private speaker board
          tidy from one place.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{documents.length} portal documents</span>
          <span className="hero-pill">{messages.length} speaker board posts</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Upload document</h2>
        </div>
        <form action={uploadPortalDocument} className="form-grid">
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="session_id">Attach to session</label>
              <select id="session_id" name="session_id" defaultValue="">
                <option value="">General document</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {displaySessionTitle(session)} ({formatDateLabel(session.date)})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="audience">Audience</label>
              <select id="audience" name="audience" defaultValue="attendee">
                <option value="attendee">Attendee Portal</option>
                <option value="speaker">Speaker/Presenter Portal</option>
                <option value="both">Both portals</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="title">Document title</label>
            <input id="title" name="title" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={3} />
          </div>
          <div className="field">
            <label htmlFor="file">File</label>
            <input id="file" name="file" type="file" required />
          </div>
          <label className="field" style={{ gridAutoFlow: "column", justifyContent: "start", alignItems: "center" }}>
            <input type="checkbox" name="published" defaultChecked />
            <span>Publish immediately</span>
          </label>
          {params.error ? <div className="empty-state">{params.error}</div> : null}
          <div className="admin-actions">
            <button type="submit" className="button">
              Upload document
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Portal documents</h2>
        </div>
        <div className="resource-list">
          {documents.length ? (
            documents.map((document) => (
              <article key={document.id} className="announcement">
                <strong>{document.title}</strong>
                <div className="muted">
                  {[
                    document.audience === "both"
                      ? "Both portals"
                      : document.audience === "speaker"
                        ? "Speaker/Presenter Portal"
                        : "Attendee Portal",
                    document.session
                      ? `${displaySessionTitle(document.session)} · ${labelForCategory(document.session.category)}`
                      : "General document",
                    document.session ? formatDateLabel(document.session.date) : null
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                {document.description ? <p className="muted">{document.description}</p> : null}
                <div className="admin-actions">
                  <span className="muted">{document.file_name}</span>
                  <span className="muted">Uploaded {formatTimestamp(document.created_at)}</span>
                  <form action={togglePortalDocumentPublish}>
                    <input type="hidden" name="id" value={document.id} />
                    <input type="hidden" name="published" value={String(document.published)} />
                    <button type="submit" className="button-secondary">
                      {document.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePortalDocument}>
                    <input type="hidden" name="id" value={document.id} />
                    <input type="hidden" name="file_path" value={document.file_path} />
                    <button type="submit" className="button-danger">
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">No portal documents uploaded yet.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Speaker board moderation</h2>
        </div>
        <div className="resource-list">
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
                <form action={deleteSpeakerPortalMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <button type="submit" className="button-danger">
                    Remove post
                  </button>
                </form>
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
