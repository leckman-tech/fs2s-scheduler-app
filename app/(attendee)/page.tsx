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
            <p className="eyebrow">Power Through Partnerships</p>
            <h1>Washington energy. Clear decisions. A schedule that pulls you in.</h1>
            <p>
              Explore the schedule for From Silos to Solutions 2026, save the sessions you
              care about, and keep pace with live updates through a mobile-first experience that
              feels more like an event destination than a spreadsheet.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">April 1-3, 2026</span>
              <span className="hero-pill">Washington, D.C.</span>
              <span className="hero-pill">Power Through Partnerships</span>
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
            <strong>{workshopCount}</strong>
            <span>workshops</span>
          </article>
          <article className="hero-metric">
            <strong>{featuredCount}</strong>
            <span>featured moments</span>
          </article>
          <article className="hero-metric">
            <strong>{days.length}</strong>
            <span>days live</span>
          </article>
          <article className="hero-metric">
            <strong>{announcements.length}</strong>
            <span>live alerts ready</span>
          </article>
        </div>

        <div className="hero-actions">
          <a href="#schedule" className="button button-link">
            Explore schedule
          </a>
          <a href="/speakers" className="button-secondary button-link">
            Meet speakers
          </a>
        </div>
      </section>

      <section className="experience-band">
        <article className="experience-card experience-card--city">
          <div className="experience-card__copy">
            <p className="eyebrow">City pulse</p>
            <h2>A convening experience with real atmosphere</h2>
            <p>
              Build anticipation with a stronger event identity rooted in Washington, D.C. and the
              urgency of cross-sector collaboration.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--scholars">
          <div className="experience-card__copy">
            <p className="eyebrow">People first</p>
            <h2>Scholar sessions, panels, and workshops feel distinct at a glance</h2>
            <p>
              The interface highlights the moments that carry the most energy so attendees can scan
              quickly and stay engaged.
            </p>
          </div>
        </article>
        <article className="experience-card experience-card--agenda">
          <div className="experience-card__copy">
            <p className="eyebrow">Fast on mobile</p>
            <h2>Designed to be useful in hallways, elevators, and between sessions</h2>
            <p>
              Save favorites, filter fast, and check updates without losing the sense that this is
              a premium event experience.
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
