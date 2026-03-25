import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lobby Day on Capitol Hill",
  description:
    "Learn about the planned FS2S Lobby Day in Washington, D.C., including training at the PAC, a provided lunch, bus transportation to the Capitol, afternoon advocacy, and a Zoom debrief.",
  path: "/lobby-day"
});

const timeline = [
  {
    label: "Morning",
    title: "Training at the PAC",
    description:
      "We will begin at the Performing Arts Center at the MAPCS high school campus with training, shared framing, and preparation for the day."
  },
  {
    label: "Midday",
    title: "Provided lunch",
    description:
      "Lunch will be provided before departure so participants can regroup, connect, and head into the afternoon together."
  },
  {
    label: "Early afternoon",
    title: "Bus to the Capitol",
    description:
      "Participants will travel together from campus to Capitol Hill rather than needing to coordinate on their own."
  },
  {
    label: "Afternoon",
    title: "Lobby visits and advocacy",
    description:
      "The day will focus on direct advocacy, relationship-building, and coordinated messages connected to opportunity and justice-involved youth and young adults."
  },
  {
    label: "Later that day",
    title: "Zoom debrief",
    description:
      "We will close with a virtual debrief to reflect on the day, share takeaways, and prepare next steps."
  }
];

export default function LobbyDayPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "From Silos to Solutions 2026 Lobby Day",
    description:
      "A planned advocacy day connected to From Silos to Solutions 2026, featuring training at the PAC, provided lunch, shared transportation to the Capitol, afternoon advocacy, and a Zoom debrief.",
    startDate: "2026-10-21T08:30:00-04:00",
    endDate: "2026-10-21T15:30:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: [
      {
        "@type": "Place",
        name: "Maya Angelou Public Charter School High School Performing Arts Center",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Washington",
          addressRegion: "DC",
          addressCountry: "US"
        }
      },
      {
        "@type": "Place",
        name: "United States Capitol",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Washington",
          addressRegion: "DC",
          addressCountry: "US"
        }
      }
    ]
  };

  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero-card">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Lobby Day</p>
            <h1>Training, advocacy, and action on Capitol Hill</h1>
            <p className="hero-kicker">
              A planned FS2S advocacy day built around preparation, shared travel, direct
              engagement, and a thoughtful debrief at the close of the afternoon.
            </p>
            <p>
              This Lobby Day is being planned as a connected extension of From Silos to Solutions.
              The goal is to help attendees move from conversation to coordinated advocacy in a
              way that is practical, well-supported, and grounded in the needs of opportunity and
              justice-involved youth and young adults.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">Wednesday, October 21, 2026</span>
              <span className="hero-pill">No additional cost</span>
              <span className="hero-pill">PAC at MAPCS High School</span>
              <span className="hero-pill">Capitol Hill</span>
            </div>
            <div className="hero-actions">
              <Link href="/" className="button button-link">
                Return to schedule
              </Link>
              <Link href="/learn-more" className="button-secondary button-link">
                Learn more about FS2S
              </Link>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">Training together</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Shared advocacy</span>
            </div>
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="context-grid">
        <article className="panel story-panel">
          <p className="eyebrow">What This Day Is For</p>
          <h2>Built to move from convening conversation into public action</h2>
          <p>
            Lobby Day is being designed as a practical advocacy track for participants who want to
            carry the themes of From Silos to Solutions directly into public leadership and policy
            engagement.
          </p>
          <p>
            Rather than asking people to navigate the day on their own, the plan is to prepare
            together, travel together, engage together, and close the day with a shared debrief.
          </p>
        </article>

        <article className="panel story-panel story-panel--accent">
          <p className="eyebrow">What Is Included</p>
          <h2>A clearer, supported experience from start to finish</h2>
          <div className="story-list">
            <div className="session-info-pill">
              <strong>Training</strong>
              <span>Morning preparation at the PAC before heading downtown</span>
            </div>
            <div className="session-info-pill">
              <strong>Lunch</strong>
              <span>Lunch will be provided before the group departs</span>
            </div>
            <div className="session-info-pill">
              <strong>Transportation</strong>
              <span>Bus transportation to the Capitol is part of the plan</span>
            </div>
            <div className="session-info-pill">
              <strong>Debrief</strong>
              <span>The day will end with a Zoom debrief that same afternoon</span>
            </div>
          </div>
        </article>
      </section>

      <section className="panel callout-panel">
        <p className="eyebrow">Day At A Glance</p>
        <h2>The current working outline for Lobby Day</h2>
        <div className="timeline-grid">
          {timeline.map((item) => (
            <article key={item.title} className="timeline-card">
              <p className="timeline-card__label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-story">
        <div className="feature-story__image feature-story__image--foundation" aria-hidden="true" />
        <div className="feature-story__content">
          <p className="eyebrow">Why It Matters</p>
          <h2>Advocacy works best when people arrive prepared, aligned, and supported</h2>
          <p>
            The purpose of this day is not to create a rushed Capitol Hill visit. It is to make
            space for thoughtful preparation, stronger messaging, and a more coordinated presence
            on behalf of young people and communities.
          </p>
          <p>
            As planning continues, this page will hold the public details people need, including
            timing updates, participation guidance, and any sign-up information tied to the day.
          </p>
        </div>
      </section>

      <section className="panel callout-panel">
        <p className="eyebrow">Planning Notes</p>
        <h2>This page will keep growing as the details are finalized</h2>
        <p className="muted">
          Right now, the public plan is simple: training at the PAC, a provided lunch, shared bus
          transportation to the Capitol, afternoon advocacy, and a same-day Zoom debrief. Final
          sign-up steps and day-of guidance will be added here as planning continues.
        </p>
      </section>
    </div>
  );
}
