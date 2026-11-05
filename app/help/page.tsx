import type { Metadata } from "next";
import Link from "next/link";
import {
  CONVENING_DIRECTOR_EMAIL,
  CONVENING_DIRECTOR_NAME,
  CONVENING_DIRECTOR_PHONE,
  CONVENING_DIRECTOR_PHONE_LINK
} from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help and Contact",
  description:
    "Help, accessibility information, and contact details for From Silos to Solutions and the November 18 Advocacy Hill Day.",
  path: "/help"
});

const supportAreas = [
  {
    title: "Day-of help",
    body:
      "If you need help during Advocacy Hill Day, contact the organizing team using the information below."
  },
  {
    title: "Accessibility and accommodations",
    body:
      "Use this contact page if you need mobility, communication, sensory, seating, dietary, or other support so the team can plan ahead with you."
  },
  {
    title: "Tickets and registration",
    body:
      "If you have trouble registering for Advocacy Hill Day, email the organizing team. We can help confirm whether your registration was received."
  },
  {
    title: "Portal and document access",
    body:
      "If you cannot sign in or access an event document, let us know which page you were using and what happened."
  }
];

const helpStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://fs2shub.com/help#contact",
      url: "https://fs2shub.com/help",
      name: "From Silos to Solutions Help and Contact",
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

      <section className="hero-card hero-card--premium help-hero">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Help &amp; Contact</p>
            <h1>Get conference support quickly</h1>
            <p className="hero-kicker">
              Questions about Advocacy Hill Day, registration, accessibility, or your attendee account? We can help.
            </p>
            <p>
              Contact the team directly using the information below.
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

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">On-site support</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Direct response</span>
            </div>
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
            <Link href="/">View Advocacy Hill Day details</Link>
            <Link href="/attendee/login">Open the Attendee Portal</Link>
            <Link href="/learn-more#faq">Read frequently asked questions</Link>
            <Link href="/learn-more#visit">Read travel and accessibility information</Link>
            <Link href="/lobby-day#register">Register for Advocacy Hill Day</Link>
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
