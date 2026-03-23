import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { getAttendeePortalResources, requireAttendeePortalUser } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { displaySessionTitle, formatDateLabel, formatTimestamp, labelForCategory } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Attendee Portal",
  description: "Private attendee resource library for FS2S 2026.",
  path: "/attendee",
  noIndex: true
});

export default async function AttendeePortalPage() {
  const [{ profile }, resources] = await Promise.all([
    requireAttendeePortalUser(),
    getAttendeePortalResources()
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
          this is your private library for workshop documents, keynote resources, panel materials,
          and year-round conference files.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{resources.length} available document{resources.length === 1 ? "" : "s"}</span>
          <LogoutButton destination="attendee" />
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
                      : "Documents shared across the convening"}
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
                        <a href={document.signed_url} className="button button-link" target="_blank" rel="noreferrer">
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
          No attendee documents have been uploaded yet. Once your team adds workshop and keynote
          resources, they will appear here.
        </div>
      )}
    </div>
  );
}
