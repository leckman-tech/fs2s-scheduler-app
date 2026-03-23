import Link from "next/link";
import { AnnouncementsBanner } from "@/components/announcements-banner";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { TicketPromoModal } from "@/components/ticket-promo-modal";
import { EVENTBRITE_URL, TICKET_PROMO_CODE } from "@/lib/constants";
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
      <TicketPromoModal />

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
              <span className="hero-pill">Use code {TICKET_PROMO_CODE}</span>
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
          <a
            href={EVENTBRITE_URL}
            className="button button-link"
            target="_blank"
            rel="noreferrer"
          >
            Purchase tickets
          </a>
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
          <p className="eyebrow">Plan Your Visit</p>
          <h2>Register now and start planning your convening experience</h2>
          <p>
            Use this site to register, browse the schedule, review speakers, and prepare for three
            days of conversation, learning, and partnership in Washington, D.C. Use code{" "}
            <strong>{TICKET_PROMO_CODE}</strong> for 75% off the first 50 registrations.
          </p>
          <div className="story-stat-grid">
            <article className="story-stat">
              <strong>{days.length}</strong>
              <span>days of programming across the convening</span>
            </article>
            <article className="story-stat">
              <strong>{workshopCount}</strong>
              <span>workshop sessions in the current program</span>
            </article>
            <article className="story-stat">
              <strong>{featuredCount}</strong>
              <span>featured sessions across keynote, panel, scholar, and evening events</span>
            </article>
          </div>
          <div className="hero-actions">
            <a
              href={EVENTBRITE_URL}
              className="button button-link"
              target="_blank"
              rel="noreferrer"
            >
              Purchase tickets
            </a>
            <Link href="/learn-more" className="button-secondary button-link">
              Learn more
            </Link>
          </div>
        </article>
      </section>

      <div className="schedule-layout" id="schedule">
        <aside className="schedule-sidebar stack">
          <AnnouncementsBanner announcements={announcements} />

          <section className="panel learn-more-panel learn-more-panel--compact">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Learn More</p>
                <h2>The full story of FS2S, See Forever, and the convening leadership</h2>
              </div>
            </div>
            <p className="muted">
              Visit the Learn More page for the history of FS2S, highlights from past convenings,
              and more about the organizational work behind this gathering.
            </p>
            <div className="hero-actions">
              <Link href="/learn-more" className="button button-link">
                Go to Learn More
              </Link>
            </div>
          </section>
        </aside>
        <ScheduleExplorer sessions={sessions} days={days} />
      </div>
    </div>
  );
}
