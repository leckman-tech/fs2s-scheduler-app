import Link from "next/link";

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

const historyMoments = [
  {
    eyebrow: "2024 Inaugural Convening",
    title: "The first convening set a clear standard for cross-sector partnership",
    description:
      "The 2024 gathering brought together leaders from education, mental health, public defense, health care, community advocacy, youth services, the private sector, and student leadership in Washington, D.C.",
    imageClass: "showcase-card__image--history-2024"
  },
  {
    eyebrow: "A Growing Convening",
    title: "Each convening deepens relationships, sharpens practice, and builds momentum",
    description:
      "FS2S continues to grow as a multi-day gathering that blends keynote conversations, breakout learning, student-centered programming, and relationship-building across sectors.",
    imageClass: "showcase-card__image--history-2025"
  },
  {
    eyebrow: "See Forever Foundation",
    title: "The convening is rooted in year-round work with young people across Washington",
    description:
      "Hosted by the See Forever Foundation and Maya Angelou Schools, FS2S reflects more than 25 years of restorative, relevant education and youth development for opportunity and justice-involved youth.",
    imageClass: "showcase-card__image--history-foundation"
  }
];

export default function LearnMorePage() {
  return (
    <div className="container stack">
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

      <section className="context-grid context-grid--history">
        <article className="panel story-panel">
          <p className="eyebrow">Leadership</p>
          <h2>Led by Dr. Clarisse Mendoza-Davis</h2>
          <p>
            Under the leadership of Dr. Clarisse Mendoza-Davis, the organization has built
            campuses, scholar supports, and pathways that reflect deep expertise in serving
            opportunity and justice-involved youth and young adults. FS2S is an extension of that
            leadership.
          </p>
        </article>

        <article className="panel story-panel">
          <p className="eyebrow">Convening Leadership</p>
          <h2>Convening Director and Administrator Levi W. Eckman, J.D.</h2>
          <p>
            The convening is directed and administered by Levi W. Eckman, J.D., helping shape a
            gathering that is both mission-driven and operationally strong, with the goal of
            sharing strategy, knowledge, and practical models with partners nationwide.
          </p>
        </article>
      </section>

      <section className="showcase-grid">
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

      <section className="showcase-grid">
        {historyMoments.map((moment) => (
          <article key={moment.title} className="showcase-card">
            <div className={`showcase-card__image ${moment.imageClass}`} aria-hidden="true" />
            <div className="showcase-card__body">
              <p className="showcase-card__eyebrow">{moment.eyebrow}</p>
              <h2>{moment.title}</h2>
              <p>{moment.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="context-grid context-grid--history">
        <article className="panel story-panel">
          <p className="eyebrow">2024 Convening Snapshot</p>
          <h2>The inaugural convening set the tone for what this gathering can become</h2>
          <p>
            The 2024 convening brought together leaders from education, mental health, public
            defense, health care, community advocacy, youth services, the private sector, and
            student leadership. That breadth matters because no single institution can do this work
            alone, and because cross-sector leadership is essential to lasting change.
          </p>
        </article>

        <article className="panel story-panel">
          <p className="eyebrow">What 2026 Builds On</p>
          <h2>The 2026 convening continues that work with a sharper focus on partnership</h2>
          <p>
            This year’s gathering builds on the relationships, lessons, and shared commitments that
            have already emerged through FS2S. The goal is not simply to gather again, but to share
            what has been built, strengthen national partnerships, and move the work forward
            together.
          </p>
        </article>
      </section>
    </div>
  );
}
