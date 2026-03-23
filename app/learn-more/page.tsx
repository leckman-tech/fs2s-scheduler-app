import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENTBRITE_URL } from "@/lib/constants";
import { buildMetadata, getLeadershipStructuredData } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mission, Leadership, and Convening History",
  description:
    "Learn about the mission behind From Silos to Solutions 2026, the work of the See Forever Foundation, foundation leadership under Dr. Clarisse Mendoza-Davis, and Convening Director Levi W. Eckman, J.D.",
  path: "/learn-more"
});

const storyShowcases = [
  {
    eyebrow: "Inside the Convening",
    title: "Cross-sector dialogue designed for candor and practical strategy",
    description:
      "FS2S creates space for educators, advocates, policymakers, providers, and community leaders to learn from one another and build stronger coordination across systems.",
    imageClass: "showcase-card__image--city"
  },
  {
    eyebrow: "Voices in the Room",
    title: "Lived experience and practitioner insight remain close to the work",
    description:
      "The convening is strongest when participants can speak honestly about what young people need, what systems miss, and what partnership looks like in practice.",
    imageClass: "showcase-card__image--voices"
  },
  {
    eyebrow: "Collaboration in Motion",
    title: "Workshops and discussions are built for shared problem-solving",
    description:
      "Sessions are only part of the value. The conversation between people, sectors, and communities is part of what moves the convening forward.",
    imageClass: "showcase-card__image--motion"
  }
];

export default function LearnMorePage() {
  const structuredData = getLeadershipStructuredData();

  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="hero-card learn-hero">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Learn More</p>
            <h1>The story behind From Silos to Solutions</h1>
            <p className="hero-kicker">
              Power Through Partnerships is grounded in long-term work, cross-sector leadership,
              and a commitment to sharing what supports scholars best.
            </p>
            <p>
              FS2S is more than a conference program. It is a convening built out of real
              institutional experience, designed to help national partners learn from one another
              and strengthen support for opportunity and justice-involved youth and young adults.
            </p>
            <div className="hero-actions">
              <Link href="/" className="button button-link">
                Return to schedule
              </Link>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Convening leadership</span>
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
          <h2>A national convening built to move partners from parallel effort to shared action</h2>
          <p>
            Opportunity and justice-involved youth and young adults are often served by systems
            that do not communicate clearly with one another. From Silos to Solutions creates space
            for those systems to listen, learn, and align around more coordinated support, guided
            by leaders who have spent decades building real pathways for scholars across Washington.
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
          <h2>Hosted by a leading voice in education, advocacy, and scholar opportunity</h2>
          <p>
            The See Forever Foundation and Maya Angelou Schools support young people through
            restorative, relevant education, personalized academic support, well-being, and
            preparation for life after Maya. FS2S grows directly out of that daily work, the many
            campuses and pathways developed for scholars, and a commitment to sharing that
            knowledge nationally.
          </p>
        </article>
      </section>

      <section className="feature-story-grid">
        <article className="feature-story">
          <div className="feature-story__image feature-story__image--inaugural" aria-hidden="true" />
          <div className="feature-story__content">
            <p className="eyebrow">2024 Inaugural Convening</p>
            <h2>The first gathering proved there is real demand for serious cross-sector coordination</h2>
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
              className="feature-story__portrait-image"
            />
          </div>
          <div className="feature-story__content">
            <p className="eyebrow">Convening Leadership</p>
            <h2>Convening Director Levi W. Eckman, J.D.</h2>
            <p>
              Levi W. Eckman, J.D. serves as Convening Director and Administrator, helping shape an
              experience that is mission-driven, practical, and built to share what works with
              partners nationwide.
            </p>
            <p>
              Dr. Clarisse Mendoza-Davis leads the See Forever Foundation and the broader
              institutional work that grounds this convening in scholar-centered education,
              advocacy, and opportunity for young people across Washington.
            </p>
          </div>
        </article>

        <article className="feature-story">
          <div className="feature-story__image feature-story__image--foundation" aria-hidden="true" />
          <div className="feature-story__content">
            <p className="eyebrow">See Forever Foundation</p>
            <h2>The convening is rooted in year-round work, not a single annual event</h2>
            <p>
              FS2S grows directly out of the daily work of the See Forever Foundation and Maya
              Angelou Schools: scholar-centered education, well-being, postsecondary support, and
              preparation for life beyond school.
            </p>
            <p>
              The convening exists to share that knowledge, strengthen national partnerships, and
              make sure the conversation stays connected to young people, families, and real
              institutional practice.
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

      <section className="panel callout-panel">
        <p className="eyebrow">Join the Convening</p>
        <h2>Bring this history into the room with you in April</h2>
        <p className="muted">
          The 2026 convening builds on what FS2S has already started: stronger relationships,
          sharper practice, and a wider national network committed to coordinated support for
          opportunity and justice-involved youth and young adults.
        </p>
        <div className="hero-actions">
          <Link href="/" className="button-secondary button-link">
            Return to the schedule
          </Link>
          <a href={EVENTBRITE_URL} className="button button-link" target="_blank" rel="noreferrer">
            Purchase tickets
          </a>
        </div>
      </section>
    </div>
  );
}
