import type { Metadata } from "next";
import Link from "next/link";
import { AttendeeBoard } from "@/components/attendee-board";
import { LogoutButton } from "@/components/logout-button";
import { saveAttendeeDirectoryEntry } from "@/lib/actions/admin";
import {
  getAttendeeBoardFeed,
  getCurrentAttendeeDirectoryEntry,
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
    "Your attendee account for FS2S 2026 documents, community updates, and opt-in contact sharing.",
  path: "/attendee",
  noIndex: true
});

export default async function AttendeePortalPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const [{ profile, user }, resources, boardFeed, directoryEntries, currentDirectoryEntry] = await Promise.all([
    requireAttendeePortalUser(),
    getAttendeePortalResources(),
    getAttendeeBoardFeed(),
    getAttendeeDirectoryEntries(),
    getCurrentAttendeeDirectoryEntry()
  ]);

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, resource) => {
    const key = resource.session
      ? `${resource.session.id}:${displaySessionTitle(resource.session)}`
      : "general";

    acc[key] = acc[key] ? [...acc[key], resource] : [resource];
    return acc;
  }, {});
  const sortedDirectoryEntries = [...directoryEntries].sort((a, b) =>
    a.full_name.localeCompare(b.full_name, undefined, { sensitivity: "base" })
  );

  return (
    <div className="container stack">
      <section className="hero-card">
        <h1>Attendee Portal</h1>
        <p>
          {profile.full_name ? `${profile.full_name}, ` : ""}
          your attendee account gives you one place to open conference documents, join the attendee
          board, and manage the contact information you want planners or other attendees to see.
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
          <Link href="#attendee-resources" className="story-stat story-stat--link portal-jump-card">
            <strong>Session files</strong>
            <span>
              Open workshop handouts, keynote materials, panel resources, and related documents.
            </span>
            <span className="story-stat__cta">Open files</span>
          </Link>
          <Link href="#attendee-board" className="story-stat story-stat--link portal-jump-card">
            <strong>Attendee board</strong>
            <span>
              Post from your own attendee account so the conversation feels grounded, welcoming,
              and accountable.
            </span>
            <span className="story-stat__cta">Jump to board</span>
          </Link>
          <Link href="#attendee-contact-card" className="story-stat story-stat--link portal-jump-card">
            <strong>Contact sharing</strong>
            <span>
              Opt into year-round connection with planners and, if you choose, the attendee
              community.
            </span>
            <span className="story-stat__cta">Edit contact card</span>
          </Link>
        </div>
      </section>

      {params.error ? <div className="empty-state">{params.error}</div> : null}
      {params.success ? <div className="announcement announcement--urgent">{params.success}</div> : null}

      <section id="attendee-contact-card" className="panel detail-side-panel attendee-portal-card section-anchor-target">
        <div className="section-heading">
          <div>
            <h2>Your contact card</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Your account email is already on file for planners. Add the details you want to
              share, save them once, and decide whether other attendees should see your card in the
              live directory.
            </p>
          </div>
        </div>

        <form action={saveAttendeeDirectoryEntry} className="form-grid attendee-contact-form">
          <div className="directory-account-summary">
            <div>
              <span className="directory-account-summary__label">Account name</span>
              <strong>{profile.full_name || "Attendee"}</strong>
            </div>
            <div>
              <span className="directory-account-summary__label">Account email</span>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="attendee-directory-phone">Phone number</label>
              <input
                id="attendee-directory-phone"
                name="phone"
                type="tel"
                defaultValue={currentDirectoryEntry?.phone ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="attendee-directory-title">Title</label>
              <input
                id="attendee-directory-title"
                name="title"
                placeholder="Optional"
                defaultValue={currentDirectoryEntry?.title ?? ""}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="attendee-directory-organization">Organization</label>
            <input
              id="attendee-directory-organization"
              name="organization"
              placeholder="Optional"
              defaultValue={currentDirectoryEntry?.organization ?? ""}
            />
          </div>

          <div className="sharing-choice-grid attendee-contact-form__sharing">
            <label className="sharing-choice-card">
              <input
                type="checkbox"
                name="share_with_planners"
                defaultChecked={currentDirectoryEntry?.share_with_planners ?? true}
              />
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
              <input
                type="checkbox"
                name="share_with_attendees"
                defaultChecked={currentDirectoryEntry?.share_with_attendees ?? false}
              />
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
            Only the information you opt to share with attendees will appear in the live
            directory below. Planner access can stay on even if you do not want to appear in the
            attendee-facing list.
          </p>

          <div className="admin-actions">
            <button type="submit" className="button">
              Save contact card
            </button>
          </div>
        </form>
      </section>

      <div id="attendee-board" className="section-anchor-target">
        <AttendeeBoard
          initialThreads={boardFeed}
          initialIdentity={{
            fullName: profile.full_name || user.email?.split("@")[0] || "Attendee",
            email: user.email || "",
            organization: currentDirectoryEntry?.organization ?? ""
          }}
        />
      </div>

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
          {sortedDirectoryEntries.length ? (
            sortedDirectoryEntries.map((entry) => (
              <details key={entry.id} className="announcement directory-card directory-card--collapsible">
                <summary className="directory-card__summary">
                  <strong>{entry.full_name}</strong>
                  <span className="chip">View contact</span>
                </summary>
                <div className="directory-card__expanded">
                  <div className="muted directory-card__meta">
                    {[entry.title, entry.organization].filter(Boolean).join(" · ") || "Attendee"}
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
                </div>
              </details>
            ))
          ) : (
            <div className="empty-state">
              No attendee contact entries have been shared yet.
            </div>
          )}
        </div>
      </section>

      <div id="attendee-resources" className="section-anchor-target stack">
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
    </div>
  );
}
