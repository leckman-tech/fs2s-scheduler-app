import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENTBRITE_URL } from "@/lib/constants";
import { buildMetadata, getLeadershipStructuredData } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mission, Leadership, and Convening History",
  description:
    "Learn more about the work behind From Silos to Solutions 2026, the leadership of the See Forever Foundation, and the people guiding this year's convening.",
  path: "/learn-more"
});

const storyShowcases = [
  {
    eyebrow: "Inside the Convening",
    title: "A space for honest conversation and practical problem-solving",
    description:
      "FS2S brings educators, advocates, policymakers, providers, and community leaders into the same room to share what is working, where gaps remain, and what stronger coordination can look like.",
    imageClass: "showcase-card__image--city"
  },
  {
    eyebrow: "Voices in the Room",
    title: "Lived experience, practice, and policy stay in the same conversation",
    description:
      "The convening works best when young people, practitioners, and system leaders can speak plainly about what support looks like in real life and where systems still fall short.",
    imageClass: "showcase-card__image--voices"
  },
  {
    eyebrow: "Collaboration in Motion",
    title: "Sessions are built for exchange, not just presentation",
    description:
      "The schedule matters, but so do the conversations that happen around it. FS2S is designed to help people leave with stronger relationships, clearer ideas, and practical next steps.",
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
            <h1>About the convening</h1>
            <p className="hero-kicker">
              Power Through Partnerships grows out of the daily work of supporting young people,
              strengthening schools, and building real partnerships across systems.
            </p>
            <p>
              From Silos to Solutions is a place to share practice, build stronger relationships,
              and learn from people who are doing this work every day with young people and
              communities.
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
          <h2>Built to help partners move from separate efforts to shared work</h2>
          <p>
            Opportunity and justice-involved youth and young adults are often served by systems
            that do not communicate clearly with one another. From Silos to Solutions makes room
            for those systems to listen, learn, and coordinate more effectively around the needs of
            young people.
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
          <h2>Grounded in the work of See Forever and Maya Angelou Schools</h2>
          <p>
            The See Forever Foundation and Maya Angelou Schools support young people through
            restorative, relevant education, personalized academic support, well-being, and
            preparation for life after Maya. FS2S grows directly out of that daily work and out of
            a commitment to share what has been learned with partners across the country.
          </p>
        </article>
      </section>

      <section className="feature-story feature-story--reverse">
        <div className="feature-story__image feature-story__image--video" aria-hidden="true" />
        <div className="feature-story__content">
          <p className="eyebrow">Watch the Convening</p>
          <h2>See the room, the exchange, and the shared purpose behind FS2S</h2>
          <p>
            The landing page now opens with a short convening video. If you would rather watch it
            in a separate window, you can open it directly here.
          </p>
          <div className="hero-actions">
            <a
              href="/fs2s/silos.mov"
              className="button-secondary button-link"
              target="_blank"
              rel="noreferrer"
            >
              Open video
            </a>
          </div>
        </div>
      </section>

      <section className="feature-story-grid">
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
            <h2>Convening Director Levi W. Eckman, J.D.</h2>
            <p>
              Levi W. Eckman, J.D. serves as Convening Director and Administrator for From Silos
              to Solutions 2026, helping guide a convening that is focused, practical, and built
              to share useful lessons with partners across the country.
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
              Under Dr. Clarisse Mendoza-Davis's leadership, the See Forever Foundation and Maya
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

      <section className="panel callout-panel">
        <p className="eyebrow">Join the Convening</p>
        <h2>Join us in Washington this April</h2>
        <p className="muted">
          The 2026 convening builds on the relationships and lessons already underway and creates
          more room for honest conversation, practical learning, and stronger partnership across
          systems.
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
