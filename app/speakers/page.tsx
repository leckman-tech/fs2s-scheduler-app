import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSpeakers } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { displaySessionTitle, formatDateLabel, labelForCategory } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Speakers and Panelists",
  description:
    "Browse the public speaker and panelist directory for From Silos to Solutions 2026, including keynote, panel, workshop, and featured convening voices.",
  path: "/speakers"
});

export default async function SpeakersPage() {
  const speakers = await getPublicSpeakers();

  return (
    <div className="container stack">
      <section className="hero-card speakers-hero">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Featured voices</p>
            <h1>Speakers &amp; panelists</h1>
            <p>
              Browse the public speaker and panelist directory for From Silos to Solutions 2026 and
              see who is connected to the convening program.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">{speakers.length} speaker profiles</span>
              <span className="hero-pill">Public sessions only</span>
            </div>
          </div>
          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">Featured sessions</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Collaboration in motion</span>
            </div>
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Convening voices</span>
            </div>
          </div>
        </div>
      </section>

      {speakers.length ? (
        <section className="grid speakers-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {speakers.map((speaker) => (
            <article key={speaker.id} className="card stack speaker-card">
              <div className="speaker-card__top">
                <div className="speaker-card__avatar">
                  <span>{speaker.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                </div>
                <div>
                  <h3>{speaker.name}</h3>
                  <p className="muted">
                    {[speaker.title, speaker.organization].filter(Boolean).join(", ") || "Speaker profile"}
                  </p>
                </div>
              </div>
              <div className="stack">
                {speaker.sessions.map((session) => (
                  <div key={session.id} className="announcement">
                    <strong>{displaySessionTitle(session)}</strong>
                    <div className="muted">
                      {labelForCategory(session.category)} - {formatDateLabel(session.date)}
                    </div>
                    <Link href={`/session/${session.id}`} className="button-secondary button-link" style={{ marginTop: "0.6rem" }}>
                      View session
                    </Link>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state">Speaker profiles will appear here once they are linked to public sessions.</div>
      )}
    </div>
  );
}
