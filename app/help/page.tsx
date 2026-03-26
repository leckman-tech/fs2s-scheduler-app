import type { Metadata } from "next";
import Link from "next/link";
import {
  CONVENING_DIRECTOR_EMAIL,
  CONVENING_DIRECTOR_NAME,
  CONVENING_DIRECTOR_PHONE,
  CONVENING_DIRECTOR_PHONE_LINK,
  EVENTBRITE_URL
} from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help and Contact",
  description:
    "Conference help, accessibility support, and direct contact information for From Silos to Solutions 2026.",
  path: "/help"
});

const supportAreas = [
  {
    title: "Day-of help",
    body:
      "If you are already on-site and something is unclear, check live updates first. For anything urgent, call or email the conference team directly."
  },
  {
    title: "Accessibility and accommodations",
    body:
      "Use this contact page if you need mobility, communication, sensory, seating, dietary, or other support so the team can plan ahead with you."
  },
  {
    title: "Tickets and registration",
    body:
      "If you are having trouble with Eventbrite, promo codes, or special-event sign-ups, contact the conference team rather than waiting until arrival."
  },
  {
    title: "Portal and document access",
    body:
      "If you cannot access the Attendee Portal, a document library, or a sign-up form, send the team a quick email with what page you were using and what happened."
  }
];

const helpStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://fs2shub.com/help#contact",
      url: "https://fs2shub.com/help",
      name: "From Silos to Solutions 2026 Help and Contact",
      description: "Direct conference support and attendee help information."
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      name: CONVENING_DIRECTOR_NAME,
      email: CONVENING_DIRECTOR_EMAIL,
      telephone: CONVENING_DIRECTOR_PHONE,
      areaServed: "US",
      availableLanguage: "English"
    }
  ]
};

export default function HelpPage() {
  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(helpStructuredData) }}
      />

      <section className="hero-card help-hero">
        <div className="hero-card__content">
          <p className="eyebrow">Help &amp; Contact</p>
          <h1>Get conference support quickly</h1>
          <p className="hero-kicker">
            Use this page for day-of help, accessibility planning, ticketing questions, or any
            issue that needs a real person.
          </p>
          <p>
            For the fastest response, reach out directly to the conference team instead of waiting
            on a general update.
          </p>
          <div className="hero-actions">
            <a href={`mailto:${CONVENING_DIRECTOR_EMAIL}`} className="button button-link">
              Email the conference team
            </a>
            <a href={CONVENING_DIRECTOR_PHONE_LINK} className="button-secondary button-link">
              Call {CONVENING_DIRECTOR_PHONE}
            </a>
          </div>
        </div>
      </section>

      <section className="context-grid help-contact-grid">
        <article className="panel contact-card">
          <p className="eyebrow">Direct Contact</p>
          <h2>{CONVENING_DIRECTOR_NAME}</h2>
          <p className="muted">Convening Director</p>
          <div className="contact-card__details">
            <div className="session-info-pill">
              <strong>Email</strong>
              <span>{CONVENING_DIRECTOR_EMAIL}</span>
            </div>
            <div className="session-info-pill">
              <strong>Phone</strong>
              <span>{CONVENING_DIRECTOR_PHONE}</span>
            </div>
          </div>
          <div className="hero-actions">
            <a href={`mailto:${CONVENING_DIRECTOR_EMAIL}`} className="button button-link">
              Email Levi
            </a>
            <a href={CONVENING_DIRECTOR_PHONE_LINK} className="button-secondary button-link">
              Call or text
            </a>
          </div>
        </article>

        <article className="panel support-links-card">
          <p className="eyebrow">Quick Actions</p>
          <h2>Before you reach out, these pages may answer it immediately</h2>
          <div className="support-links-list">
            <Link href="/">Check the live schedule and announcements</Link>
            <Link href="/attendee/login">Open the Attendee Portal</Link>
            <Link href="/learn-more#faq">Read attendee FAQ</Link>
            <Link href="/learn-more#visit">Open travel and access notes</Link>
            <a href={EVENTBRITE_URL} target="_blank" rel="noreferrer">
              Open Eventbrite tickets
            </a>
          </div>
        </article>
      </section>

      <section className="planning-grid">
        {supportAreas.map((item) => (
          <article key={item.title} className="panel planning-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
