import Link from "next/link";
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
          <Link href="/learn-more" className="button-secondary button-link">
            Learn more
          </Link>
        </div>
      </section>

      <section className="context-grid context-grid--home-intro">
        <article className="panel story-panel">
          <p className="eyebrow">National Convening</p>
          <h2>Built for leaders working across systems, sectors, and communities</h2>
          <p>
            From Silos to Solutions brings together educators, policymakers, youth-serving
            organizations, advocates, and community leaders around one shared question: how do we
            coordinate stronger support for opportunity and justice-involved youth and young adults?
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
              <span>Sharing models, lessons, and partnerships that can strengthen work nationwide</span>
            </div>
            <div className="session-info-pill">
              <strong>Hosted by</strong>
              <span>See Forever Foundation and Maya Angelou Schools</span>
            </div>
          </div>
        </article>

        <article className="panel story-panel story-panel--accent">
          <p className="eyebrow">At a Glance</p>
          <h2>A clearer landing page, with the full story one click away</h2>
          <p>
            Start here for the live schedule, announcements, speakers, and logistics. When you want
            the history of FS2S, the work of See Forever Foundation, and more about the leadership
            behind the convening, head to the Learn More page.
          </p>
          <div className="story-stat-grid">
            <article className="story-stat">
              <strong>{workshopCount}</strong>
              <span>workshop slots across the convening</span>
            </article>
            <article className="story-stat">
              <strong>{featuredCount}</strong>
              <span>featured sessions across keynote, panel, scholar, and evening events</span>
            </article>
            <article className="story-stat">
              <strong>{announcements.length}</strong>
              <span>announcement channels ready for live updates</span>
            </article>
          </div>
          <div className="hero-actions">
            <Link href="/learn-more" className="button-secondary button-link">
              Visit Learn More
            </Link>
          </div>
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

      <section className="panel learn-more-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Learn More</p>
            <h2>The full story of FS2S, See Forever, and the convening leadership</h2>
          </div>
        </div>
        <p className="muted">
          If you want the deeper context behind the convening, visit the Learn More page for the
          history of FS2S, highlights from past convenings, and more about the organizational work
          that powers this gathering.
        </p>
        <div className="hero-actions">
          <Link href="/learn-more" className="button button-link">
            Go to Learn More
          </Link>
        </div>
      </section>

      <div className="schedule-layout" id="schedule">
        <AnnouncementsBanner announcements={announcements} />
        <ScheduleExplorer sessions={sessions} days={days} />
      </div>
    </div>
  );
}
