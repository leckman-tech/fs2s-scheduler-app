import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementsBanner } from "@/components/announcements-banner";
import { LiveUpdatesTicker } from "@/components/live-updates-ticker";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { getAttendeePortalResources, getConferenceDays, getPublicAnnouncements, getPublicSessions } from "@/lib/queries";
import { buildMetadata, getEventStructuredData } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "2026 Convening Archive | From Silos to Solutions",
  description:
    "From Silos to Solutions 2026 (FS2S), also known as Silos to Solutions, is a Washington, D.C. convening focused on improving coordination, support, and opportunity for justice-involved youth and young adults. The convening is hosted by the See Forever Foundation and Maya Angelou Schools and led by Convening Director Levi W. Eckman, J.D.",
  path: "/2026-archive",
  noIndex: true
});

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/attendee/login?error=Sign%20in%20to%20request%20access%20to%20the%202026%20archive");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    const { data: grant } = await supabase.from("archive_access_grants").select("user_id").eq("user_id", user.id).maybeSingle();
    if (!grant) redirect("/attendee?archive=restricted");
  }
  const [sessions, announcements, days, documents] = await Promise.all([
    getPublicSessions(),
    getPublicAnnouncements(),
    getConferenceDays(),
    getAttendeePortalResources()
  ]);
  const featuredCount = sessions.filter((session) => session.featured).length;
  const workshopCount = sessions.filter((session) => session.category === "workshop").length;
  const structuredData = getEventStructuredData();

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <LiveUpdatesTicker announcements={announcements} />

      <section className="hero-card hero-card--landing">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">From Silos to Solutions 2026</p>
            <h1>Power Through Partnerships</h1>
            <p className="hero-kicker">
              A Convening to Coordinate Supports for Opportunity &amp; Justice Involved Youth and
              Young Adults
            </p>
            <p>
              From Silos to Solutions brings together educators, youth-serving organizations,
              policymakers, advocates, and community leaders who are working to improve outcomes
              for opportunity and justice-involved youth and young adults.
            </p>
            <div className="hero-meta">
              <span className="hero-pill">April 1-3, 2026</span>
              <span className="hero-pill">Washington, D.C.</span>
              <span className="hero-pill">See Forever Foundation</span>
              <span className="hero-pill hero-pill--promo">Original program archive</span>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--dc">
              <video
                className="hero-photo__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/fs2s/fs2s-speaker-podium.jpg"
                aria-label="Short video from the From Silos to Solutions convening"
              >
                <source src="/fs2s/silos.mov" type="video/quicktime" />
                Your browser does not support embedded video.
              </video>
              <span className="hero-photo__label">Convening in motion</span>
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
          <article className="hero-metric hero-metric--primary">
            <p className="hero-metric__eyebrow">Legacy</p>
            <strong>25+</strong>
            <span>years of Maya &amp; See Forever work</span>
          </article>
          <article className="hero-metric">
            <p className="hero-metric__eyebrow">History</p>
            <strong>2024</strong>
            <span>year the inaugural convening launched</span>
          </article>
          <article className="hero-metric">
            <p className="hero-metric__eyebrow">Network</p>
            <strong>5</strong>
            <span>schools across the Maya network</span>
          </article>
          <article className="hero-metric">
            <p className="hero-metric__eyebrow">Program</p>
            <strong>{days.length}</strong>
            <span>days of programming</span>
          </article>
        </div>

        <div className="hero-actions">
          <Link href="/" className="button button-link">Explore 2027</Link>
          <a href="#schedule" className="button-tertiary button-link">
            Explore schedule
          </a>
          <Link href="/learn-more" className="button-secondary button-link">
            Learn more
          </Link>
        </div>
      </section>

      <section
        id="archive-documents"
        className="panel detail-side-panel"
        style={{margin:"1.3rem 0", scrollMarginTop:"6.5rem"}}
        aria-labelledby="archive-documents-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">AUTHORIZED ATTENDEES</p>
            <h2 id="archive-documents-heading">2026 attendee document library</h2>
            <p className="muted">Browse the available handouts and archived learning materials from the April 2026 convening.</p>
          </div>
        </div>
        {documents.length ? (
          <div className="resource-list">
            {documents.map((document) => (
              <article className="announcement" key={document.id}>
                <strong>{document.title}</strong>
                {document.description ? <p className="muted">{document.description}</p> : null}
                <div className="admin-actions">
                  {document.signed_url ? (
                    <a
                      href={document.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-link"
                    >
                      Open document
                    </a>
                  ) : (
                    <span className="muted">File temporarily unavailable. Please contact the organizing team.</span>
                  )}
                  <span className="muted">{document.file_name}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">There are no attendee documents to display yet.</div>
        )}
        <div className="hero-actions" style={{marginTop:"1.1rem"}}>
          <Link href="/attendee" className="button-secondary button-link">← Back to my attendee portal</Link>
        </div>
      </section>

      <div className="schedule-layout" id="schedule">
        <aside className="schedule-sidebar stack">
          <AnnouncementsBanner announcements={announcements} />

          <section className="panel sidebar-story-panel sidebar-story-panel--accent">
            <p className="eyebrow">Plan Your Visit</p>
            <h2>Explore the 2026 convening program</h2>
            <p className="muted">
              This is a record of the April 1–3, 2026 convening. Ticket sales and event registration have closed.
            </p>
            <div className="story-stat-grid story-stat-grid--compact">
              <article className="story-stat">
                <strong>{days.length}</strong>
                <span>days of live programming</span>
              </article>
              <article className="story-stat">
                <strong>{workshopCount}</strong>
                <span>workshops in the 2026 program</span>
              </article>
              <article className="story-stat">
                <strong>{featuredCount}</strong>
                <span>featured sessions across keynote, panel, scholar, and evening events</span>
              </article>
            </div>
            <div className="hero-actions">
              <Link href="/" className="button button-link">Explore 2027</Link>
              <a href="#archive-documents" className="button-secondary button-link">
                Attendee documents
              </a>
            </div>
          </section>

          <section className="panel sidebar-story-panel learn-more-panel--compact">
            <p className="eyebrow">Why FS2S</p>
            <h2>Grounded in the daily work of See Forever and Maya</h2>
            <p className="muted">
              Hosted by the See Forever Foundation and Maya Angelou Schools, FS2S grows out of
              real work with young people, families, educators, and community partners across
              Washington.
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
                Meet the team
              </Link>
            </div>
          </section>
        </aside>
        <ScheduleExplorer sessions={sessions} days={days} />
      </div>
    </div>
  );
}
