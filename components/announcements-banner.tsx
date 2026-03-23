import type { AnnouncementRecord } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export function AnnouncementsBanner({ announcements }: { announcements: AnnouncementRecord[] }) {
  const urgentCount = announcements.filter((announcement) => announcement.priority === "urgent").length;

  return (
    <section className="panel sticky-panel announcements-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Live Updates</p>
          <h2>Announcements</h2>
        </div>
        <span className="hero-pill">{urgentCount ? `${urgentCount} urgent` : "Live updates"}</span>
      </div>

      <p className="announcements-panel__intro">
        Quick room changes, timing shifts, and important attendee notices appear here first.
      </p>

      {announcements.length ? (
        <div className="announcements">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className={`announcement announcement--${announcement.priority}`}
            >
              <strong>
                {announcement.priority === "urgent" ? "Urgent: " : ""}
                {announcement.title}
              </strong>
              <div className="muted">{announcement.body}</div>
              <time dateTime={announcement.created_at}>{formatTimestamp(announcement.created_at)}</time>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">No live announcements yet. New room changes and urgent notices will show here.</div>
      )}
    </section>
  );
}
