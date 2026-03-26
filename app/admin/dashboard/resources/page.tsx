import {
  deleteAttendeeBoardPost,
  deleteAttendeeBoardReply,
  deleteAttendeeDirectoryEntry,
  deletePortalDocument,
  deleteSpeakerPortalMessage,
  togglePortalDocumentPublish,
  uploadPortalDocument
} from "@/lib/actions/admin";
import {
  getAdminAttendeeBoardPosts,
  getAdminAttendeeBoardReplies,
  getAdminAttendeeDirectoryEntries,
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
  const [sessions, documents, messages, attendeePosts, attendeeReplies, attendeeDirectory] =
    await Promise.all([
    getResourceEligibleSessions(),
    getAdminPortalDocuments(),
    getAdminPortalMessages(),
    getAdminAttendeeBoardPosts(),
    getAdminAttendeeBoardReplies(),
    getAdminAttendeeDirectoryEntries()
    ]);

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>Portal documents and messaging</h1>
        <p>
          Manage the attendee account document library, the private speaker/presenter library, and
          the speaker board from one place.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{documents.length} portal documents</span>
          <span className="hero-pill">{messages.length} speaker board posts</span>
          <span className="hero-pill">{attendeePosts.length} attendee board posts</span>
          <span className="hero-pill">{attendeeReplies.length} attendee replies</span>
          <span className="hero-pill">{attendeeDirectory.length} attendee contact entries</span>
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>Portal access at a glance</h2>
        </div>
        <div className="story-stat-grid">
          <article className="story-stat">
            <strong>Attendee Portal</strong>
            <span>Individual attendee-account access for workshop, keynote, panel, and general conference files.</span>
          </article>
          <article className="story-stat">
            <strong>Speaker/Presenter Portal</strong>
            <span>Assigned-session logistics, speaker materials, and private coordination updates.</span>
          </article>
          <article className="story-stat">
            <strong>Admin controls</strong>
            <span>Upload, publish, unpublish, and remove files or board posts across both portals.</span>
          </article>
          <article className="story-stat">
            <strong>Attendee board</strong>
            <span>Review named attendee posts and remove anything that should not stay public.</span>
          </article>
          <article className="story-stat">
            <strong>Attendee contact page</strong>
            <span>See who opted to share their information with planners and, if selected, other attendees.</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Upload document</h2>
        </div>
        <form action={uploadPortalDocument} className="form-grid" encType="multipart/form-data">
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
            <p className="field-hint" style={{ marginTop: "0.45rem" }}>
              Upload PDFs, slides, handouts, or other conference resources. Files up to 50 MB are
              supported.
            </p>
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
        <p className="muted" style={{ marginTop: 0 }}>
          Use the audience label below to confirm whether a file appears in the attendee account
          library, the private speaker/presenter library, or both.
        </p>
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

      <section className="panel">
        <div className="section-heading">
          <h2>Attendee board moderation</h2>
        </div>
        <div className="resource-list">
          {attendeePosts.length ? (
            attendeePosts.map((post) => (
              <article key={post.id} className="announcement">
                <strong>{post.full_name}</strong>
                <div className="muted">
                  {[post.email, post.organization, formatTimestamp(post.created_at)]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <p className="muted">{post.body}</p>
                <form action={deleteAttendeeBoardPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="button-danger">
                    Remove post
                  </button>
                </form>
              </article>
            ))
          ) : (
            <div className="empty-state">No attendee board posts yet.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Attendee contact entries</h2>
        </div>
        <div className="resource-list">
          {attendeeDirectory.length ? (
            attendeeDirectory.map((entry) => (
              <article key={entry.id} className="announcement">
                <strong>{entry.full_name}</strong>
                <div className="muted">
                  {[entry.title, entry.organization, formatTimestamp(entry.updated_at)]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <div className="detail-list">
                  <div>
                    <strong>Email</strong>
                    <span className="muted">{entry.email}</span>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <span className="muted">{entry.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <strong>Shared with attendees</strong>
                    <span className="muted">{entry.share_with_attendees ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <strong>Shared with planners</strong>
                    <span className="muted">{entry.share_with_planners ? "Yes" : "No"}</span>
                  </div>
                </div>
                <form action={deleteAttendeeDirectoryEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button type="submit" className="button-danger">
                    Remove entry
                  </button>
                </form>
              </article>
            ))
          ) : (
            <div className="empty-state">No attendee contact entries yet.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Attendee reply moderation</h2>
        </div>
        <div className="resource-list">
          {attendeeReplies.length ? (
            attendeeReplies.map((reply) => (
              <article key={reply.id} className="announcement">
                <strong>{reply.full_name}</strong>
                <div className="muted">
                  {[reply.email, reply.organization, formatTimestamp(reply.created_at)]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <p className="muted">{reply.body}</p>
                <form action={deleteAttendeeBoardReply}>
                  <input type="hidden" name="id" value={reply.id} />
                  <button type="submit" className="button-danger">
                    Remove reply
                  </button>
                </form>
              </article>
            ))
          ) : (
            <div className="empty-state">No attendee replies yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
