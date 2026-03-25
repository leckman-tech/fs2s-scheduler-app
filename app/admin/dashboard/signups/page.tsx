import Link from "next/link";
import { getAdminSessionSignups } from "@/lib/queries";
import { displaySessionTitle, formatDateLabel, formatTimestamp, formatTimeRange } from "@/lib/utils";

export default async function AdminSignupsPage() {
  const signups = await getAdminSessionSignups();

  const grouped = Object.values(
    signups.reduce<
      Record<
        string,
        {
          sessionId: string;
          title: string;
          date: string;
          startsAt: string;
          capacity: number | null;
          confirmed: number;
          waitlist: number;
        }
      >
    >((acc, signup) => {
      if (!signup.session) {
        return acc;
      }

      const key = signup.session.id;
      const current = acc[key] ?? {
        sessionId: signup.session.id,
        title: displaySessionTitle(signup.session),
        date: signup.session.date,
        startsAt: signup.session.starts_at,
        capacity: signup.session.signup_capacity,
        confirmed: 0,
        waitlist: 0
      };

      if (signup.status === "confirmed") {
        current.confirmed += 1;
      } else {
        current.waitlist += 1;
      }

      acc[key] = current;
      return acc;
    }, {})
  ).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>Event sign-ups</h1>
        <p>
          Review limited-capacity RSVP lists, monitor confirmed versus waitlist numbers, and
          export attendee information for text updates and logistics.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{signups.length} total sign-up{signups.length === 1 ? "" : "s"}</span>
          <Link href="/admin/dashboard/signups/export" className="button-secondary button-link">
            Export all sign-ups
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Sign-up summary by event</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>When</th>
                <th>Confirmed</th>
                <th>Waitlist</th>
                <th>Capacity</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {grouped.length ? (
                grouped.map((item) => (
                  <tr key={item.sessionId}>
                    <td>{item.title}</td>
                    <td>
                      {formatDateLabel(item.date)}
                      <div className="muted">{formatTimeRange(item.startsAt, null)}</div>
                    </td>
                    <td>{item.confirmed}</td>
                    <td>{item.waitlist}</td>
                    <td>{item.capacity ?? "No cap"}</td>
                    <td>
                      <Link
                        href={`/admin/dashboard/signups/export?sessionId=${item.sessionId}`}
                        className="button-secondary button-link"
                      >
                        CSV
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="muted">
                    No event sign-ups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent sign-ups</h2>
        </div>
        <div className="resource-list">
          {signups.length ? (
            signups.map((signup) => (
              <article key={signup.id} className="announcement">
                <strong>{signup.full_name}</strong>
                <div className="muted">
                  {[
                    signup.session ? displaySessionTitle(signup.session) : "Unknown event",
                    signup.status === "confirmed" ? "Confirmed" : "Waitlist",
                    formatTimestamp(signup.created_at)
                  ].join(" · ")}
                </div>
                <div className="detail-list">
                  <div>
                    <strong>Email</strong>
                    <span className="muted">{signup.email}</span>
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <span className="muted">{signup.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <strong>Organization</strong>
                    <span className="muted">{signup.organization || "Not provided"}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">No sign-ups have been submitted yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
