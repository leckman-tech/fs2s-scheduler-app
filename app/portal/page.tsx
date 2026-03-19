import { LogoutButton } from "@/components/logout-button";
import { getCurrentUserAssignedSessions, requirePrivateScheduleUser } from "@/lib/queries";
import { displaySessionTitle, formatDateLabel, formatTimeRange, labelForCategory } from "@/lib/utils";

export default async function PortalPage() {
  const [{ profile }, sessions] = await Promise.all([
    requirePrivateScheduleUser(),
    getCurrentUserAssignedSessions()
  ]);

  return (
    <div className="container stack">
      <section className="hero-card">
        <h1>My schedule and logistics</h1>
        <p>
          {profile.full_name ? `${profile.full_name}, ` : ""}
          this private view shows your assigned sessions and logistics notes only.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{sessions.length} assigned session{sessions.length === 1 ? "" : "s"}</span>
          <LogoutButton destination="portal" />
        </div>
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
    </div>
  );
}
