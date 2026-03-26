import type { Metadata } from "next";
import { AttendeeBoard } from "@/components/attendee-board";
import { LogoutButton } from "@/components/logout-button";
import { saveAttendeeDirectoryEntry } from "@/lib/actions/admin";
import {
  getAttendeeBoardFeed,
  getAttendeeDirectoryEntries,
  getAttendeePortalResources,
  requireAttendeePortalUser
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import {
  displaySessionTitle,
  formatDateLabel,
  formatTimestamp,
  labelForCategory
} from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal",
  description:
    "Shared attendee document library, attendee board, and opt-in contact directory for FS2S 2026.",
  path: "/attendee",
  noIndex: true
});

export default async function AttendeePortalPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const [{ profile }, resources, boardFeed, directoryEntries] = await Promise.all([
    requireAttendeePortalUser(),
    getAttendeePortalResources(),
    getAttendeeBoardFeed(),
    getAttendeeDirectoryEntries()
  ]);

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, resource) => {
    const key = resource.session
      ? `${resource.session.id}:${displaySessionTitle(resource.session)}`
      : "general";

    acc[key] = acc[key] ? [...acc[key], resource] : [resource];
    return acc;
  }, {});

  return (
    <div className="container stack">
      <section className="hero-card">
        <h1>Attendee Portal</h1>
        <p>
          {profile.full_name ? `${profile.full_name}, ` : ""}
          this shared portal gives attendees one place to open conference documents, post to the
          attendee board, and opt into year-round connection with planners and other attendees.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">
            {resources.length} available document{resources.length === 1 ? "" : "s"}
          </span>
          <span className="hero-pill">
            {boardFeed.length} attendee board post{boardFeed.length === 1 ? "" : "s"}
          </span>
          <span className="hero-pill">
            {directoryEntries.length} shared contact{directoryEntries.length === 1 ? "" : "s"}
          </span>
          <LogoutButton destination="attendee" />
        </div>
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <h2>What this portal is for</h2>
        </div>
        <div className="story-stat-grid">
          <article className="story-stat">
            <strong>Session files</strong>
            <span>
              Open workshop handouts, keynote materials, panel resources, and related documents.
            </span>
          </article>
          <article className="story-stat">
            <strong>Attendee board</strong>
            <span>
              Post under your own name so attendees can share reflections, resources, and questions.
            </span>
          </article>
          <article className="story-stat">
            <strong>Contact sharing</strong>
            <span>
              Opt into year-round connection with planners and, if you choose, the attendee
              community.
            </span>
          </article>
        </div>
      </section>

      {params.error ? <div className="empty-state">{params.error}</div> : null}
      {params.success ? <div className="announcement announcement--urgent">{params.success}</div> : null}

      <section className="community-grid">
        <article className="panel detail-side-panel">
          <div className="section-heading">
            <div>
              <h2>Attendee Contact Page</h2>
              <p className="muted" style={{ margin: "0.35rem 0 0" }}>
                Share your contact information with planners and, if you choose, other attendees.
              </p>
            </div>
          </div>

          <form action={saveAttendeeDirectoryEntry} className="form-grid">
            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor="attendee-directory-name">Full name</label>
                <input id="attendee-directory-name" name="full_name" required />
              </div>
              <div className="field">
                <label htmlFor="attendee-directory-email">Email</label>
                <input id="attendee-directory-email" name="email" type="email" required />
              </div>
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor="attendee-directory-phone">Phone number</label>
                <input id="attendee-directory-phone" name="phone" type="tel" />
              </div>
              <div className="field">
                <label htmlFor="attendee-directory-title">Title</label>
                <input id="attendee-directory-title" name="title" placeholder="Optional" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="attendee-directory-organization">Organization</label>
              <input
                id="attendee-directory-organization"
                name="organization"
                placeholder="Optional"
              />
            </div>

            <div className="sharing-choice-grid">
              <label className="sharing-choice-card">
                <input type="checkbox" name="share_with_planners" defaultChecked />
                <span className="sharing-choice-card__box" aria-hidden="true" />
                <span className="sharing-choice-card__content">
                  <strong>Share with planners</strong>
                  <span>
                    Let the FS2S team keep your information for logistics, follow-up, and future
                    planning.
                  </span>
                </span>
              </label>
              <label className="sharing-choice-card">
                <input type="checkbox" name="share_with_attendees" />
                <span className="sharing-choice-card__box" aria-hidden="true" />
                <span className="sharing-choice-card__content">
                  <strong>Share with attendees</strong>
                  <span>
                    Add me to the live attendee directory below so people can connect with me
                    directly.
                  </span>
                </span>
              </label>
            </div>

            <p className="field-hint">
              Your email is required so the entry is tied to a real person. Only the information you
              choose to share with attendees will appear in the live directory below.
            </p>

            <div className="admin-actions">
              <button type="submit" className="button">
                Save contact entry
              </button>
            </div>
          </form>
        </article>

        <AttendeeBoard initialThreads={boardFeed} />
      </section>

      <section className="panel detail-side-panel">
        <div className="section-heading">
          <div>
            <h2>Live Attendee Directory</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Attendees who opted in to sharing with the community appear here as soon as their
              entry is saved.
            </p>
          </div>
        </div>
        <div className="resource-list">
          {directoryEntries.length ? (
            directoryEntries.map((entry) => (
              <article key={entry.id} className="announcement directory-card">
                <div className="directory-card__header">
                  <div>
                    <strong>{entry.full_name}</strong>
                    <div className="muted">
                      {[entry.title, entry.organization].filter(Boolean).join(" · ") || "Attendee"}
                    </div>
                  </div>
                  <span className="chip">Open to connect</span>
                </div>
                <div className="detail-list directory-card__details">
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${entry.email}`} className="directory-card__link">
                      {entry.email}
                    </a>
                  </div>
                  {entry.phone ? (
                    <div>
                      <strong>Phone</strong>
                      <a href={`tel:${entry.phone}`} className="directory-card__link">
                        {entry.phone}
                      </a>
                    </div>
                  ) : null}
                </div>
                <div className="admin-actions">
                  <a href={`mailto:${entry.email}`} className="button-secondary button-link">
                    Email
                  </a>
                  {entry.phone ? (
                    <a href={`sms:${entry.phone}`} className="button-secondary button-link">
                      Text
                    </a>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              No attendee contact entries have been shared yet.
            </div>
          )}
        </div>
      </section>

      {resources.length ? (
        Object.entries(grouped).map(([key, docs]) => {
          const session = docs[0]?.session;
          return (
            <section key={key} className="panel detail-side-panel">
              <div className="section-heading">
                <div>
                  <h2>{session ? displaySessionTitle(session) : "General Conference Resources"}</h2>
                  <p className="muted" style={{ margin: "0.35rem 0 0" }}>
                    {session
                      ? `${labelForCategory(session.category)} · ${formatDateLabel(session.date)}`
                      : "Documents shared across the full convening"}
                  </p>
                </div>
              </div>

              <div className="resource-list">
                {docs.map((document) => (
                  <article key={document.id} className="announcement">
                    <strong>{document.title}</strong>
                    {document.description ? <p className="muted">{document.description}</p> : null}
                    <div className="admin-actions">
                      {document.signed_url ? (
                        <a
                          href={document.signed_url}
                          className="button button-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open document
                        </a>
                      ) : null}
                      <span className="muted">{document.file_name}</span>
                      <span className="muted">Uploaded {formatTimestamp(document.created_at)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="empty-state">
          No attendee documents have been uploaded yet. Once the conference team adds workshop,
          keynote, or panel resources, they will appear here.
        </div>
      )}
    </div>
  );
}
