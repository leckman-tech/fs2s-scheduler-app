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
      title: "The inaugural convening opened a shared space for coordination across systems",
      description:
        "In 2024, From Silos to Solutions brought together educators, clinicians, policymakers, public defenders, providers, advocates, and students in Washington, D.C. around a shared challenge: how to better coordinate support for opportunity and justice-involved youth and young adults.",
      className: "experience-card--history-2024"
    },
    {
      eyebrow: "A Growing Convening",
      title: "Each convening deepens relationships, sharpens practice, and builds momentum",
      description:
        "FS2S continues to grow as a multi-day gathering that blends keynote conversations, breakout learning, student-centered programming, and relationship-building across sectors.",
      className: "experience-card--history-2025"
    },
    {
      eyebrow: "See Forever Foundation",
      title: "The convening is rooted in year-round work with young people across Washington",
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
              Join a national gathering led by the See Forever Foundation and Maya Angelou Schools,
              where educators, youth-serving organizations, policymakers, advocates, and community
              leaders come together to strengthen support for opportunity and justice-involved youth
              and young adults.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">April 1-3, 2026</span>
              <span className="hero-pill">Washington, D.C.</span>
              <span className="hero-pill">See Forever Foundation</span>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Opening voice</span>
            </div>
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">In the room</span>
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
            <strong>2024</strong>
            <span>year the inaugural convening launched</span>
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
              <strong>Why it matters</strong>
              <span>Sharing proven models, lessons, and partnerships with leaders across the country</span>
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

      <section className="context-grid context-grid--history">
        <article className="panel story-panel">
          <p className="eyebrow">Leadership</p>
          <h2>Led by Dr. Clarisse Mendoza-Davis</h2>
          <p>
            Under the leadership of Dr. Clarisse Mendoza-Davis, the organization has built campuses,
            scholar supports, and pathways that reflect deep expertise in serving opportunity and
            justice-involved youth and young adults. FS2S is an extension of that leadership.
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

      <section className="experience-band">
        <article className="experience-card experience-card--city">
          <div className="experience-card__copy">
            <p className="eyebrow">Inside the Convening</p>
            <h2>The room is built for honest discussion, practical strategy, and real connection</h2>
            <p>
              FS2S is designed to bring different sectors into the same room with enough structure
              to learn from one another and enough openness to build real partnership.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--scholars">
          <div className="experience-card__copy">
            <p className="eyebrow">Voices in the Room</p>
            <h2>Lived experience, practitioner wisdom, and community leadership stay close to the work</h2>
            <p>
              The convening is strongest when people can speak frankly about what young people need,
              what systems miss, and what partnership looks like in practice.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--agenda">
          <div className="experience-card__copy">
            <p className="eyebrow">Collaboration in Motion</p>
            <h2>Sessions are only part of the value; the exchange between people is part of the point</h2>
            <p>
              Use the schedule to move with confidence, then let the conversations, workshops, and
              shared problem-solving carry the convening forward.
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
