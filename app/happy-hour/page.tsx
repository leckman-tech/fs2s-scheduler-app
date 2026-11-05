import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "2026 Happy Hour Archive",
  description:
    "Information about the April 1, 2026 From Silos to Solutions reception.",
  path: "/happy-hour"
});

const detailCards = [
  {
    title: "Conference guests",
    body: "The reception brought together convening participants, presenters, panelists, volunteers, and guests after the first day."
  },
  {
    title: "Invited staff guests",
    body: "See Forever Foundation and Maya Angelou Schools staff were invited to join the reception."
  },
  {
    title: "Looking ahead",
    body: "For upcoming From Silos to Solutions events, visit the homepage or our Advocacy Hill Day page."
  }
];

export default async function HappyHourPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "From Silos to Solutions: A Happy Hour",
    description:
      "Open bar, light food, and evening networking for conference attendees and invited MAS/SFF staff at the National Union Building Speakeasy.",
    startDate: "2026-04-01T16:30:00-04:00",
    endDate: "2026-04-01T20:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "National Union Building Speakeasy",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Washington",
        addressRegion: "DC",
        addressCountry: "US"
      }
    }
  };

  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero-card hero-card--premium">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">April 2026 Convening Archive</p>
            <h1>2026 Welcome Reception</h1>
            <p className="hero-kicker">
              A gathering for participants and staff at the National Union Building Speakeasy.
            </p>
            <p>
              This reception took place on April 1, 2026. Registration for the event is closed.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">Wednesday, April 1, 2026</span>
              <span className="hero-pill">4:30 PM-8:00 PM EDT</span>
              <span className="hero-pill">National Union Building Speakeasy</span>
              
            </div>
            <div className="hero-actions">
              <Link href="/" className="button-secondary button-link">Back to FS2S</Link>
              <Link href="/lobby-day" className="button button-link">Upcoming Advocacy Hill Day</Link>
            </div>
          </div>

          <div className="hero-card__visual hero-card__visual--feature-left">
            <div className="hero-photo hero-photo--conference hero-photo--feature">
              <span className="hero-photo__label">In the room</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Shared connection</span>
            </div>
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="context-grid">
        {detailCards.map((item) => (
          <article key={item.title} className="panel story-panel">
            <p className="eyebrow">2026 Reception</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

    </div>
  );
}
