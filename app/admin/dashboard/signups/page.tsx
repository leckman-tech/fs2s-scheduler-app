import Link from "next/link";
import {
  deleteHappyHourRsvp,
  deleteLobbyDaySignup,
  deleteSessionSignup,
  updateHappyHourRsvp,
  updateLobbyDaySignup,
  updateSessionSignup
} from "@/lib/actions/admin";
import {
  getAdminHappyHourRsvps,
  getAdminLobbyDaySignups,
  getAdminSessionSignups
} from "@/lib/queries";
import { displaySessionTitle, formatDateLabel, formatTimestamp, formatTimeRange } from "@/lib/utils";

export default async function AdminSignupsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [signups, lobbyDaySignups, happyHourRsvps] = await Promise.all([
    getAdminSessionSignups(),
    getAdminLobbyDaySignups(),
    getAdminHappyHourRsvps()
  ]);

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
  ).sort((a, b) => `${a.date}T${a.startsAt}`.localeCompare(`${b.date}T${b.startsAt}`));

  const totalSignupCount = signups.length + lobbyDaySignups.length + happyHourRsvps.length;
  const happyHourAttendeeCount = happyHourRsvps.filter(
    (signup) => signup.rsvp_group === "conference_attendee"
  ).length;
  const happyHourStaffCount = happyHourRsvps.filter((signup) => signup.rsvp_group === "staff").length;

  return (
    <div className="stack">
      {params.error ? <div className="empty-state">{params.error}</div> : null}

      <section className="hero-card">
        <h1>Event sign-ups</h1>
        <p>
          Review RSVP lists, track limited-capacity events, and export attendee information for
          text updates, logistics, and follow-up.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">
            {totalSignupCount} total sign-up{totalSignupCount === 1 ? "" : "s"}
          </span>
          <Link href="/admin/dashboard/signups/export" className="button-secondary button-link">
            Export session sign-ups
          </Link>
          <Link
            href="/admin/dashboard/signups/export?type=lobby-day"
            className="button-secondary button-link"
          >
            Export Lobby Day list
          </Link>
          <Link
            href="/admin/dashboard/signups/export?type=happy-hour"
            className="button-secondary button-link"
          >
            Export Happy Hour RSVPs
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Day One Happy Hour</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Separate RSVP tracks for conference attendees and invited MAS/SFF staff
            </p>
          </div>
          <span className="hero-pill">
            {happyHourRsvps.length} Happy Hour RSVP{happyHourRsvps.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="story-stat-grid">
          <div className="story-stat">
            <strong>{happyHourAttendeeCount}</strong>
            <span>Conference attendee RSVPs</span>
          </div>
          <div className="story-stat">
            <strong>{happyHourStaffCount}</strong>
            <span>SFF/MAS staff RSVPs</span>
          </div>
        </div>

        <div className="resource-list">
          {happyHourRsvps.length ? (
            happyHourRsvps.map((signup) => (
              <article key={signup.id} className="announcement">
                <strong>{signup.full_name}</strong>
                <div className="muted">
                  {[
                    "From Silos to Solutions: A Happy Hour",
                    signup.rsvp_group === "staff" ? "Staff RSVP" : "Conference attendee RSVP",
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
                <details className="admin-edit-details">
                  <summary>Edit or remove</summary>
                  <form action={updateHappyHourRsvp} className="form-grid admin-edit-details__form">
                    <input type="hidden" name="id" value={signup.id} />
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`happy-hour-name-${signup.id}`}>Full name</label>
                        <input
                          id={`happy-hour-name-${signup.id}`}
                          name="full_name"
                          defaultValue={signup.full_name}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`happy-hour-email-${signup.id}`}>Email</label>
                        <input
                          id={`happy-hour-email-${signup.id}`}
                          name="email"
                          type="email"
                          defaultValue={signup.email}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`happy-hour-phone-${signup.id}`}>Phone</label>
                        <input
                          id={`happy-hour-phone-${signup.id}`}
                          name="phone"
                          defaultValue={signup.phone ?? ""}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`happy-hour-organization-${signup.id}`}>Organization</label>
                        <input
                          id={`happy-hour-organization-${signup.id}`}
                          name="organization"
                          defaultValue={signup.organization ?? ""}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor={`happy-hour-group-${signup.id}`}>RSVP group</label>
                      <select
                        id={`happy-hour-group-${signup.id}`}
                        name="rsvp_group"
                        defaultValue={signup.rsvp_group}
                      >
                        <option value="conference_attendee">Conference attendee</option>
                        <option value="staff">SFF/MAS staff</option>
                      </select>
                    </div>
                    <div className="admin-actions">
                      <button type="submit" className="button-secondary">
                        Save changes
                      </button>
                    </div>
                  </form>
                  <form action={deleteHappyHourRsvp} className="admin-actions">
                    <input type="hidden" name="id" value={signup.id} />
                    <button type="submit" className="button-danger">
                      Remove RSVP
                    </button>
                  </form>
                </details>
              </article>
            ))
          ) : (
            <div className="empty-state">No Happy Hour RSVPs have been submitted yet.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Fall 2026 Lobby Day</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Training, lunch, Capitol Hill advocacy, and same-day debrief
            </p>
          </div>
          <span className="hero-pill">
            {lobbyDaySignups.length} Lobby Day sign-up{lobbyDaySignups.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="resource-list">
          {lobbyDaySignups.length ? (
            lobbyDaySignups.map((signup) => (
              <article key={signup.id} className="announcement">
                <strong>{signup.full_name}</strong>
                <div className="muted">{["Fall 2026 Lobby Day", formatTimestamp(signup.created_at)].join(" · ")}</div>
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
                <details className="admin-edit-details">
                  <summary>Edit or remove</summary>
                  <form action={updateLobbyDaySignup} className="form-grid admin-edit-details__form">
                    <input type="hidden" name="id" value={signup.id} />
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`lobby-signup-name-${signup.id}`}>Full name</label>
                        <input
                          id={`lobby-signup-name-${signup.id}`}
                          name="full_name"
                          defaultValue={signup.full_name}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`lobby-signup-email-${signup.id}`}>Email</label>
                        <input
                          id={`lobby-signup-email-${signup.id}`}
                          name="email"
                          type="email"
                          defaultValue={signup.email}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`lobby-signup-phone-${signup.id}`}>Phone</label>
                        <input
                          id={`lobby-signup-phone-${signup.id}`}
                          name="phone"
                          defaultValue={signup.phone ?? ""}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`lobby-signup-organization-${signup.id}`}>
                          Organization
                        </label>
                        <input
                          id={`lobby-signup-organization-${signup.id}`}
                          name="organization"
                          defaultValue={signup.organization ?? ""}
                        />
                      </div>
                    </div>
                    <div className="admin-actions">
                      <button type="submit" className="button-secondary">
                        Save changes
                      </button>
                    </div>
                  </form>
                  <form action={deleteLobbyDaySignup} className="admin-actions">
                    <input type="hidden" name="id" value={signup.id} />
                    <button type="submit" className="button-danger">
                      Remove sign-up
                    </button>
                  </form>
                </details>
              </article>
            ))
          ) : (
            <div className="empty-state">No Lobby Day sign-ups have been submitted yet.</div>
          )}
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
                <details className="admin-edit-details">
                  <summary>Edit or remove</summary>
                  <div className="admin-edit-details__meta muted">
                    {signup.session ? displaySessionTitle(signup.session) : "Unknown event"}
                    {signup.status === "confirmed"
                      ? " · confirmed"
                      : " · waitlist"}
                  </div>
                  <form action={updateSessionSignup} className="form-grid admin-edit-details__form">
                    <input type="hidden" name="id" value={signup.id} />
                    <input type="hidden" name="session_id" value={signup.session_id} />
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`session-signup-name-${signup.id}`}>Full name</label>
                        <input
                          id={`session-signup-name-${signup.id}`}
                          name="full_name"
                          defaultValue={signup.full_name}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`session-signup-email-${signup.id}`}>Email</label>
                        <input
                          id={`session-signup-email-${signup.id}`}
                          name="email"
                          type="email"
                          defaultValue={signup.email}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-grid form-grid--two">
                      <div className="field">
                        <label htmlFor={`session-signup-phone-${signup.id}`}>Phone</label>
                        <input
                          id={`session-signup-phone-${signup.id}`}
                          name="phone"
                          defaultValue={signup.phone ?? ""}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`session-signup-organization-${signup.id}`}>
                          Organization
                        </label>
                        <input
                          id={`session-signup-organization-${signup.id}`}
                          name="organization"
                          defaultValue={signup.organization ?? ""}
                        />
                      </div>
                    </div>
                    <div className="admin-actions">
                      <button type="submit" className="button-secondary">
                        Save changes
                      </button>
                    </div>
                  </form>
                  <form action={deleteSessionSignup} className="admin-actions">
                    <input type="hidden" name="id" value={signup.id} />
                    <input type="hidden" name="session_id" value={signup.session_id} />
                    <button type="submit" className="button-danger">
                      Remove sign-up
                    </button>
                  </form>
                </details>
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
