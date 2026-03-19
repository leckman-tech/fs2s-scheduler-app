import { deleteAnnouncement, saveAnnouncement, toggleAnnouncementPublish } from "@/lib/actions/admin";
import { getAdminAnnouncements } from "@/lib/queries";
import { formatTimestamp } from "@/lib/utils";

export default async function AnnouncementsAdminPage() {
  const announcements = await getAdminAnnouncements();

  return (
    <div className="stack">
      <form action={saveAnnouncement} className="panel form-grid">
        <div className="section-heading">
          <h2>Post announcement</h2>
        </div>

        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required />
        </div>

        <div className="field">
          <label htmlFor="body">Message</label>
          <textarea id="body" name="body" required />
        </div>

        <div className="form-grid form-grid--two">
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" defaultValue="normal">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="published">Publish immediately</label>
            <input id="published" type="checkbox" name="published" defaultChecked />
          </div>
        </div>

        <button type="submit" className="button">
          Post announcement
        </button>
      </form>

      <section className="panel">
        <div className="section-heading">
          <h2>Existing announcements</h2>
        </div>
        <div className="stack">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="card">
              <div className="session-card__top">
                <span className="chip">{announcement.priority}</span>
                <span className="chip">{announcement.published ? "Published" : "Draft"}</span>
              </div>
              <h3>{announcement.title}</h3>
              <p className="muted">{announcement.body}</p>
              <p className="muted">Posted {formatTimestamp(announcement.created_at)}</p>
              <div className="admin-actions">
                <form action={toggleAnnouncementPublish}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <input type="hidden" name="published" value={String(announcement.published)} />
                  <button type="submit" className="button-secondary">
                    {announcement.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <button type="submit" className="button-danger">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
