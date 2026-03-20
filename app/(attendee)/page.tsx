import { AnnouncementsBanner } from "@/components/announcements-banner";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getConferenceDays, getPublicAnnouncements, getPublicSessions } from "@/lib/queries";

export default async function HomePage() {
  const [sessions, announcements, days] = await Promise.all([
    getPublicSessions(),
    getPublicAnnouncements(),
    getConferenceDays()
  ]);
  const featuredCount = sessions.filter((session) => session.featured).length;
  const workshopCount = sessions.filter((session) => session.category === "workshop").length;
  const historyMoments = [
    {
      eyebrow: "2024 Inaugural Convening",
      title: "The first FS2S gathering brought cross-sector leaders into one room",
      description:
        "The inaugural 2024 convening gathered roughly 125 educators, clinicians, policymakers, defenders, providers, advocates, and students in Washington, D.C. to coordinate supports for opportunity and justice-involved youth and young adults.",
      className: "experience-card--history-2024"
    },
    {
      eyebrow: "An Annual Convening Arc",
      title: "Each year builds deeper coordination, stronger partnerships, and clearer action",
      description:
        "FS2S has continued to grow as a multi-day convening model that blends keynote conversations, breakout learning, campus-based programming, resource sharing, and coalition-building across sectors.",
      className: "experience-card--history-2025"
    },
    {
      eyebrow: "See Forever Foundation",
      title: "The convening is grounded in year-round work with young people across D.C.",
      description:
        "Hosted by the See Forever Foundation and Maya Angelou Schools, FS2S reflects more than 25 years of restorative, relevant education and youth development for opportunity and justice-involved youth.",
      className: "experience-card--history-foundation"
    }
  ];

  return (
    <div className="container">
      <section className="hero-card">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">From Silos to Solutions 2026</p>
            <h1>Power Through Partnerships</h1>
            <p className="hero-kicker">
              A Convening to Coordinate Supports for Opportunity &amp; Justice Involved Youth and
              Young Adults
            </p>
            <p>
              From Silos to Solutions is designed to bring educators, youth-serving organizations,
              policymakers, advocates, and community leaders into closer alignment around young
              people who are too often forced to navigate disconnected systems on their own.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">April 1-3, 2026</span>
              <span className="hero-pill">Washington, D.C.</span>
              <span className="hero-pill">See Forever Foundation</span>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">Convening atmosphere</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Partnership in action</span>
            </div>
          </div>
        </div>

        <div className="hero-metrics">
          <article className="hero-metric">
            <strong>25+</strong>
            <span>years of Maya &amp; See Forever work</span>
          </article>
          <article className="hero-metric">
            <strong>125+</strong>
            <span>participants at the 2024 launch</span>
          </article>
          <article className="hero-metric">
            <strong>5</strong>
            <span>schools across the Maya network</span>
          </article>
          <article className="hero-metric">
            <strong>{days.length}</strong>
            <span>days of live programming</span>
          </article>
        </div>

        <div className="hero-actions">
          <a href="#schedule" className="button button-link">
            Explore schedule
          </a>
          <a href="#story" className="button-secondary button-link">
            Learn the story
          </a>
        </div>
      </section>

      <section className="context-grid" id="story">
        <article className="panel story-panel">
          <p className="eyebrow">Why FS2S Exists</p>
          <h2>Breaking down silos is the point, not just the title</h2>
          <p>
            FS2S exists because opportunity and justice-involved youth and young adults are often
            served by systems that do not communicate clearly with one another. The convening is a
            place to coordinate supports, surface what is working, and build relationships strong
            enough to move from isolated effort to shared action.
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
          <h2>This convening grows out of year-round work, not a once-a-year event calendar</h2>
          <p>
            The See Forever Foundation and Maya Angelou Schools support young people through
            restorative, relevant education, personalized academic support, well-being, and
            preparation for life after Maya. That daily work is what gives FS2S its point of view.
          </p>
          <div className="story-stat-grid">
            <article className="story-stat">
              <strong>{workshopCount}</strong>
              <span>workshop slots in the current convening</span>
            </article>
            <article className="story-stat">
              <strong>{featuredCount}</strong>
              <span>featured moments across keynote, panel, scholar, and evening events</span>
            </article>
            <article className="story-stat">
              <strong>{announcements.length}</strong>
              <span>live notice channels built into the attendee experience</span>
            </article>
          </div>
        </article>
      </section>

      <section className="experience-band">
        {historyMoments.map((moment) => (
          <article key={moment.title} className={`experience-card ${moment.className}`}>
            <div className="experience-card__copy">
              <p className="eyebrow">{moment.eyebrow}</p>
              <h2>{moment.title}</h2>
              <p>{moment.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="context-grid context-grid--history">
        <article className="panel story-panel">
          <p className="eyebrow">2024 Convening Snapshot</p>
          <h2>The inaugural gathering set the tone for what FS2S is becoming</h2>
          <p>
            The first convening in 2024 brought together practitioners from education, mental
            health, public defense, health care, community advocacy, youth services, the private
            sector, and student leadership. That breadth matters because no single institution can
            coordinate this work alone.
          </p>
        </article>

        <article className="panel story-panel">
          <p className="eyebrow">What 2026 Builds On</p>
          <h2>This year’s schedule should feel connected to a larger movement</h2>
          <p>
            The 2026 convening can carry more of that history on the homepage: not just a place and
            a schedule, but a clearer story about why people gather, what has been built already,
            and how See Forever’s work continues long after the last session ends.
          </p>
        </article>
      </section>

      <section className="experience-band">
        <article className="experience-card experience-card--city">
          <div className="experience-card__copy">
            <p className="eyebrow">Washington Context</p>
            <h2>Grounded in the city where policy, practice, and advocacy collide</h2>
            <p>
              Washington, D.C. is more than a backdrop. It is part of the convening story and part
              of why partnership work here carries national significance.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--scholars">
          <div className="experience-card__copy">
            <p className="eyebrow">Scholar-Centered</p>
            <h2>Scholar sessions and lived experience should stay central in the narrative</h2>
            <p>
              The public experience should make clear that this convening is ultimately about young
              people, their pathways, and the adults and systems around them doing better work
              together.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--agenda">
          <div className="experience-card__copy">
            <p className="eyebrow">Useful on the Move</p>
            <h2>Still a schedule tool, just one with more substance and identity</h2>
            <p>
              Attendees still need quick filters, favorites, updates, and room changes, but they
              should also feel the larger purpose of the event when they land here.
            </p>
          </div>
        </article>
      </section>

      <div className="schedule-layout" id="schedule">
        <AnnouncementsBanner announcements={announcements} />
        <ScheduleExplorer sessions={sessions} days={days} />
      </div>
    </div>
  );
}
