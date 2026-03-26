import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CONVENING_DIRECTOR_EMAIL,
  CONVENING_DIRECTOR_NAME,
  CONVENING_DIRECTOR_PHONE,
  CONVENING_DIRECTOR_PHONE_LINK,
  EVENTBRITE_URL,
  SEE_FOREVER_URL
} from "@/lib/constants";
import { buildMetadata, getLeadershipStructuredData } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Plan Your Visit, Leadership, and Convening Background",
  description:
    "Attendee planning information, travel notes, accessibility guidance, leadership profiles, and convening background for From Silos to Solutions 2026.",
  path: "/learn-more"
});

const storyShowcases = [
  {
    eyebrow: "Inside the Convening",
    title: "A room built for practical exchange",
    description:
      "FS2S is designed for people who want substance. Sessions are built to help attendees share practice, compare approaches, and leave with real next steps.",
    imageClass: "showcase-card__image--city"
  },
  {
    eyebrow: "Voices in the Room",
    title: "Young people, practitioners, and leaders stay in the same conversation",
    description:
      "The convening keeps lived experience, policy, and practice close to one another so the conversation stays useful and grounded.",
    imageClass: "showcase-card__image--voices"
  },
  {
    eyebrow: "Partnership Practice",
    title: "The goal is stronger coordination, not just stronger messaging",
    description:
      "FS2S exists to help partners understand where collaboration is already working and where better alignment can improve support for young people.",
    imageClass: "showcase-card__image--motion"
  }
];

const attendeeFaqs = [
  {
    question: "Do I need a login to use the schedule?",
    answer:
      "No. The public schedule, speaker directory, and session detail pages are open to everyone. The Attendee Portal is only needed for shared documents, the attendee board, and the opt-in contact directory."
  },
  {
    question: "Where should I look first if something changes?",
    answer:
      "Watch the live updates ribbon and announcements on the homepage. That is where room changes, timing changes, and day-of reminders will appear first."
  },
  {
    question: "How do limited-capacity events work?",
    answer:
      "Activities such as the Big Bus Tour, Happy Hour, Lobby Day, and other special excursions use separate sign-up forms. If a capacity limit is reached, the site will move new names to a waitlist automatically."
  },
  {
    question: "What should I wear?",
    answer:
      "Business casual is a safe choice for most of the convening. Comfortable shoes are strongly recommended, especially for campus-based programming, walking in downtown D.C., and Capitol Hill activities."
  },
  {
    question: "Will food be provided?",
    answer:
      "Food and reception details are listed on the schedule itself. Use each session page as the source of truth for what is provided, whether RSVP is required, and whether space is limited."
  },
  {
    question: "Where do I find session materials and shared documents?",
    answer:
      "Use the Attendee Portal for shared files, handouts, and materials that the conference team chooses to post. Speakers and presenters use their own private portal for logistics and presenter resources."
  },
  {
    question: "How do I request accessibility or accommodation support?",
    answer:
      "Reach out to the conference team in advance if you need mobility, communication, sensory, dietary, or other support. The fastest route is the Help & Contact page or direct contact with the Convening Director."
  },
  {
    question: "What if I need help during the event?",
    answer:
      "Use the Help & Contact page for the fastest conference support information. For urgent day-of issues, call or email the conference team directly rather than waiting for a portal response."
  }
];

const planningCards = [
  {
    eyebrow: "Days One and Two",
    title: "National Union Building",
    body:
      "The main convening venue is National Union Building, 918 F Street NW, Washington, DC 20004. The venue's official directions page places it one block from Gallery Place and two blocks from Metro Center, which makes Metro one of the easiest ways to arrive.",
    links: [
      {
        label: "Venue directions",
        href: "https://www.nationalunionbuildingdc.com/getting-here/"
      },
      {
        label: "Nearby parking options",
        href: "https://www.nationalunionbuildingdc.com/getting-here/"
      }
    ]
  },
  {
    eyebrow: "Day Three and Lobby Day Training",
    title: "MAPCS High School Campus / PAC",
    body:
      "Campus-based programming will use the Maya Angelou Public Charter School High School campus at 5600 East Capitol Street NE, Washington, DC 20019. Final arrival notes for campus programming and Lobby Day transportation will be shared directly with attendees as those details are finalized.",
    links: [
      {
        label: "Maya Angelou Schools",
        href: "https://www.seeforever.org/"
      }
    ]
  },
  {
    eyebrow: "Metro and Accessibility",
    title: "Use WMATA tools before you travel",
    body:
      "WMATA provides a trip planner, accessibility information, and live elevator and escalator status. If you plan to use Metro, check those tools before heading out so you have the latest route and access information.",
    links: [
      {
        label: "WMATA trip planner",
        href: "https://www.wmata.com/schedules/trip-planner/"
      },
      {
        label: "WMATA accessibility",
        href: "https://www.wmata.com/service/accessibility/"
      },
      {
        label: "Elevator and escalator status",
        href: "https://www.wmata.com/service/rail/elevator-escalator.cfm"
      }
    ]
  }
];

const venueNotes = [
  {
    title: "Parking",
    body:
      "If you are driving to National Union Building, use the venue's official Getting Here page for garage options closest to the site. For campus-based days, watch conference communications for final arrival guidance."
  },
  {
    title: "Accessibility",
    body:
      "Metro is the easiest accessible travel option for many attendees, and the conference team can help plan around accommodations if you reach out in advance."
  },
  {
    title: "Day-of movement",
    body:
      "Some parts of the convening involve moving between rooms, between venues, or onto buses. Give yourself a little transition time and check the live updates ribbon before you head out."
  }
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: attendeeFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function LearnMorePage() {
  const structuredData = getLeadershipStructuredData();

  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <section className="hero-card learn-hero">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Learn More</p>
            <h1>Plan your visit and understand the work behind the convening</h1>
            <p className="hero-kicker">
              This page is built for attendees who want the practical details as well as the
              bigger story behind From Silos to Solutions.
            </p>
            <p>
              Use it for travel notes, FAQ, leadership context, and day-of planning. If you need
              direct support, use the Help &amp; Contact page for the fastest route to the
              conference team.
            </p>
            <div className="hero-actions">
              <Link href="/" className="button button-link">
                Return to schedule
              </Link>
              <Link href="/help" className="button-secondary button-link">
                Help &amp; contact
              </Link>
              <a href={EVENTBRITE_URL} className="button-tertiary button-link" target="_blank" rel="noreferrer">
                Purchase tickets
              </a>
            </div>
            <div className="learn-more-anchor-links">
              <a href="#visit">Travel &amp; access</a>
              <a href="#faq">FAQ</a>
              <a href="#leadership">Leadership</a>
              <a href="#help-next">Need help?</a>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">Shared learning</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Partnership practice</span>
            </div>
          </div>
        </div>
      </section>

      <section className="context-grid">
        <article className="panel story-panel">
          <p className="eyebrow">Why FS2S Exists</p>
          <h2>Built to help partners move from separate efforts to stronger coordination</h2>
          <p>
            Opportunity and justice-involved youth and young adults are often served by systems
            that do not communicate clearly with one another. From Silos to Solutions creates room
            for those systems to listen, compare approaches, and work toward stronger alignment.
          </p>
          <div className="story-list">
            <div className="session-info-pill">
              <strong>Theme</strong>
              <span>Power Through Partnerships</span>
            </div>
            <div className="session-info-pill">
              <strong>Who gathers</strong>
              <span>Educators, policymakers, providers, advocates, and community leaders</span>
            </div>
            <div className="session-info-pill">
              <strong>What it centers</strong>
              <span>Opportunity and justice-involved youth and young adults</span>
            </div>
          </div>
        </article>

        <article className="panel story-panel story-panel--accent">
          <p className="eyebrow">See Forever Foundation</p>
          <h2>Grounded in daily work with young people, families, and schools</h2>
          <p>
            FS2S grows out of the work of the See Forever Foundation and Maya Angelou Schools. The
            convening is not separate from that mission; it is one way the organization shares what
            it has learned with partners across Washington and beyond.
          </p>
          <div className="hero-actions">
            <a href={SEE_FOREVER_URL} className="button-secondary button-link" target="_blank" rel="noreferrer">
              Visit See Forever
            </a>
          </div>
        </article>
      </section>

      <section id="visit" className="planning-section">
        <div className="section-heading section-heading--stacked">
          <p className="eyebrow">Travel, Parking, and Accessibility</p>
          <h2>Use this as your planning page before you arrive</h2>
          <p className="muted">
            The official venue and transit links below are the fastest way to plan your trip and
            double-check access details before each conference day.
          </p>
        </div>

        <div className="planning-grid">
          {planningCards.map((card) => (
            <article key={card.title} className="panel planning-card">
              <p className="eyebrow">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="planning-links">
                {card.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="context-grid context-grid--history">
          {venueNotes.map((note) => (
            <article key={note.title} className="panel note-card">
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="panel faq-panel">
        <div className="section-heading section-heading--stacked">
          <p className="eyebrow">Attendee FAQ</p>
          <h2>Questions attendees usually want answered before they arrive</h2>
        </div>
        <div className="faq-list">
          {attendeeFaqs.map((item, index) => (
            <details key={item.question} className="faq-item" open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="leadership" className="feature-story-grid">
        <article className="feature-story">
          <div className="feature-story__image feature-story__image--inaugural" aria-hidden="true" />
          <div className="feature-story__content">
            <p className="eyebrow">2024 Inaugural Convening</p>
            <h2>The first gathering showed how much people want a serious cross-sector space for this work</h2>
            <p>
              In 2024, FS2S brought together leaders from education, mental health, public
              defense, health care, youth services, community advocacy, the private sector, and
              student leadership in Washington, D.C.
            </p>
            <p>
              That breadth matters because no single institution can meet the needs of opportunity
              and justice-involved youth and young adults alone. The convening exists to help those
              systems listen, align, and act with greater coherence.
            </p>
          </div>
        </article>

        <article className="feature-story feature-story--reverse">
          <div className="feature-story__portrait">
            <Image
              src="/fs2s/levi-face.png"
              alt="Levi W. Eckman, J.D., Convening Director"
              fill
              sizes="(max-width: 860px) 100vw, 420px"
              className="feature-story__portrait-image feature-story__portrait-image--levi"
            />
          </div>
          <div className="feature-story__content">
            <p className="eyebrow">Convening Leadership</p>
            <h2>Convening Director {CONVENING_DIRECTOR_NAME}</h2>
            <p>
              {CONVENING_DIRECTOR_NAME} serves as Convening Director and Administrator for From
              Silos to Solutions 2026, helping guide a convening that is focused, practical, and
              built to share useful lessons with partners across the country.
            </p>
            <p>
              His broader advocacy includes service on the OST Commission and contributions to
              legal-journal work advancing educational equity, with particular focus on access to
              funding and accountability for how public resources are invested in young people and
              their communities.
            </p>
          </div>
        </article>

        <article className="feature-story">
          <div className="feature-story__portrait">
            <Image
              src="/fs2s/clarisse-mendoza-davis.jpg"
              alt="Dr. Clarisse Mendoza-Davis"
              fill
              sizes="(max-width: 860px) 100vw, 420px"
              className="feature-story__portrait-image feature-story__portrait-image--clarisse"
            />
          </div>
          <div className="feature-story__content">
            <p className="eyebrow">Foundation Leadership</p>
            <h2>Dr. Clarisse Mendoza-Davis leads the broader work that grounds the convening</h2>
            <p>
              Under Dr. Clarisse Mendoza-Davis&apos;s leadership, the See Forever Foundation and Maya
              Angelou Schools continue to expand scholar-centered education, well-being,
              postsecondary support, and opportunity for young people across Washington.
            </p>
            <p>
              From Silos to Solutions grows directly out of that institutional work, carrying
              forward an approach rooted in scholar success, family partnership, and accountability
              to the communities the schools and foundation serve.
            </p>
          </div>
        </article>
      </section>

      <section className="showcase-grid showcase-grid--supporting">
        {storyShowcases.map((item) => (
          <article key={item.title} className="showcase-card">
            <div className={`showcase-card__image ${item.imageClass}`} aria-hidden="true" />
            <div className="showcase-card__body">
              <p className="showcase-card__eyebrow">{item.eyebrow}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="help-next" className="panel callout-panel callout-panel--support">
        <div>
          <p className="eyebrow">Need Help?</p>
          <h2>Go straight to conference support</h2>
          <p className="muted">
            Use the Help &amp; Contact page for day-of questions, accessibility requests, ticketing
            help, or planning support. You can also reach the conference team directly:
          </p>
          <div className="help-inline-list">
            <a href={`mailto:${CONVENING_DIRECTOR_EMAIL}`}>{CONVENING_DIRECTOR_EMAIL}</a>
            <a href={CONVENING_DIRECTOR_PHONE_LINK}>{CONVENING_DIRECTOR_PHONE}</a>
          </div>
        </div>
        <div className="hero-actions">
          <Link href="/help" className="button button-link">
            Open Help &amp; Contact
          </Link>
          <a href={EVENTBRITE_URL} className="button-secondary button-link" target="_blank" rel="noreferrer">
            Purchase tickets
          </a>
        </div>
      </section>
    </div>
  );
}
