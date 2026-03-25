import Link from "next/link";
import { deleteSession, toggleSessionPublish } from "@/lib/actions/admin";
import { getAdminAnnouncements, getAdminSessions, requireAdmin } from "@/lib/queries";
import { displaySessionTitle, formatDateLabel, formatTimeRange, labelForCategory, labelForStatus } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [{ profile }, sessions, announcements] = await Promise.all([
    requireAdmin(),
    getAdminSessions(),
    getAdminAnnouncements()
  ]);

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>Operations dashboard</h1>
        <p>
          Welcome back{profile.full_name ? `, ${profile.full_name}` : ""}. Manage sessions,
          publishing, announcements, portal documents, and attendee feedback from one place.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{sessions.length} total sessions</span>
          <span className="hero-pill">{announcements.length} announcements</span>
          <Link href="/admin/dashboard/workshops" className="button-secondary button-link">
            Manage workshops
          </Link>
          <Link href="/admin/dashboard/resources" className="button-secondary button-link">
            Portal documents
          </Link>
          <Link href="/admin/dashboard/signups" className="button-secondary button-link">
            Event sign-ups
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>All sessions</h2>
          <Link href="/admin/dashboard/sessions/new" className="button button-link">
            Create session
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>When</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <strong>{displaySessionTitle(session)}</strong>
                    <div className="muted">{labelForCategory(session.category)}</div>
                  </td>
                  <td>
                    <div>{formatDateLabel(session.date)}</div>
                    <div className="muted">{formatTimeRange(session.starts_at, session.ends_at)}</div>
                  </td>
                  <td>{labelForStatus(session.status)}</td>
                  <td>{session.published ? "Live" : "Draft"}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/dashboard/sessions/${session.id}/edit`} className="button-secondary button-link">
                        Edit
                      </Link>
                      <form action={toggleSessionPublish}>
                        <input type="hidden" name="id" value={session.id} />
                        <input type="hidden" name="published" value={String(session.published)} />
                        <button type="submit" className="button-secondary">
                          {session.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteSession}>
                        <input type="hidden" name="id" value={session.id} />
                        <button type="submit" className="button-danger">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
