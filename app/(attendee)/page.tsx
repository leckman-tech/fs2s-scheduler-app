import Link from "next/link";
import { AnnouncementsBanner } from "@/components/announcements-banner";
import { LiveUpdatesTicker } from "@/components/live-updates-ticker";
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
      <LiveUpdatesTicker announcements={announcements} />

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
              Join a national convening shaped by the leadership of the See Forever Foundation and
              Maya Angelou Schools, where educators, youth-serving organizations, policymakers,
              advocates, and community leaders come together to strengthen support for opportunity
              and justice-involved youth and young adults.
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
          <a href="#schedule" className="button-tertiary button-link">
            Explore schedule
          </a>
          <Link href="/learn-more" className="button-secondary button-link">
            Learn more
          </Link>
        </div>
      </section>

      <div className="schedule-layout" id="schedule">
        <aside className="schedule-sidebar stack">
          <AnnouncementsBanner announcements={announcements} />

          <section className="panel sidebar-story-panel sidebar-story-panel--accent">
            <p className="eyebrow">Plan Your Visit</p>
            <h2>Register now and start shaping your convening experience</h2>
            <p className="muted">
              Use this site to purchase tickets, browse the agenda, save the sessions you care
              about, and prepare for three days of conversation, learning, and partnership in
              Washington, D.C.
            </p>
            <div className="story-stat-grid story-stat-grid--compact">
              <article className="story-stat">
                <strong>{days.length}</strong>
                <span>days of live programming</span>
              </article>
              <article className="story-stat">
                <strong>{workshopCount}</strong>
                <span>workshop sessions currently on the agenda</span>
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
              <Link href="/attendee/login" className="button-secondary button-link">
                Attendee portal
              </Link>
            </div>
          </section>

          <section className="panel sidebar-story-panel learn-more-panel--compact">
            <p className="eyebrow">Why FS2S</p>
            <h2>A national convening rooted in scholar-centered work and partnership</h2>
            <p className="muted">
              Hosted by the See Forever Foundation and Maya Angelou Schools, From Silos to
              Solutions brings together educators, policymakers, providers, advocates, and
              community leaders to strengthen support for opportunity and justice-involved youth and
              young adults.
            </p>
            <div className="story-list">
              <div className="session-info-pill">
                <strong>Theme</strong>
                <span>Power Through Partnerships</span>
              </div>
              <div className="session-info-pill">
                <strong>Leadership</strong>
                <span>Convening Director Levi W. Eckman, J.D.</span>
              </div>
              <div className="session-info-pill">
                <strong>Learn more</strong>
                <span>History, leadership, and the work behind the convening</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link href="/learn-more" className="button button-link">
                Visit Learn More
              </Link>
            </div>
          </section>
        </aside>
        <ScheduleExplorer sessions={sessions} days={days} />
      </div>
    </div>
  );
}
