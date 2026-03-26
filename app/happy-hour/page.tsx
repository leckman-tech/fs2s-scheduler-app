import type { Metadata } from "next";
import Link from "next/link";
import { HappyHourRsvpForm } from "@/components/happy-hour-rsvp-form";
import { getPublicHappyHourRsvpSummary } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Happy Hour RSVP",
  description:
    "Reserve your place for the From Silos to Solutions Happy Hour at the National Union Building Speakeasy, with separate RSVP paths for conference attendees and invited MAS/SFF staff.",
  path: "/happy-hour"
});

const detailCards = [
  {
    title: "Conference guests",
    body: "For convening participants, presenters, panelists, volunteers, and guests who plan to join us after Day One."
  },
  {
    title: "Invited staff guests",
    body: "Invited See Forever, Maya, and MAPCS staff can use the staff RSVP option. A reserved block of spaces is being held for staff guests."
  },
  {
    title: "If space fills",
    body: "If the room reaches capacity, new RSVPs will automatically move to the waitlist. If space opens, we’ll follow up using the contact information you provide."
  }
];

export default async function HappyHourPage() {
  const summary = await getPublicHappyHourRsvpSummary();
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
            <p className="eyebrow">Day One Reception</p>
            <h1>Happy Hour RSVP</h1>
            <p className="hero-kicker">
              Open bar, light food, and time to connect at the National Union Building Speakeasy.
            </p>
            <p>
              We&apos;re expecting around 125 guests and can stretch to 150 total. If you&apos;re
              planning to join us, please RSVP here. If the room fills, new RSVPs will move to the
              waitlist automatically.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">Wednesday, April 1, 2026</span>
              <span className="hero-pill">4:30 PM-8:00 PM EDT</span>
              <span className="hero-pill">National Union Building Speakeasy</span>
              <span className="hero-pill">Open bar + light food</span>
            </div>
            <div className="hero-actions">
              <Link href="/" className="button-secondary button-link">
                Back to schedule
              </Link>
              <a href="#happy-hour-rsvp" className="button button-link">
                RSVP now
              </a>
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
            <p className="eyebrow">RSVP Flow</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <div id="happy-hour-rsvp">
        <HappyHourRsvpForm summary={summary} />
      </div>
    </div>
  );
}
