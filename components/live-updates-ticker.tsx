import type { AnnouncementRecord } from "@/lib/types";

export function LiveUpdatesTicker({
  announcements
}: {
  announcements: AnnouncementRecord[];
}) {
  if (!announcements.length) {
    return null;
  }

  const items = announcements.slice(0, 3);
  const tickerItems = [...items, ...items];

  return (
    <section className="live-ticker" aria-label="Live updates">
      <div className="live-ticker__label">Live updates</div>
      <div className="live-ticker__viewport" aria-live="polite">
        <div className="live-ticker__track">
          {tickerItems.map((announcement, index) => (
            <span
              key={`${announcement.id}-${index}`}
              className={`live-ticker__item live-ticker__item--${announcement.priority}`}
            >
              <strong>{announcement.title}</strong>
              <span>{announcement.body}</span>
            </span>
          ))}
        </div>
      </div>
      <a href="#live-updates" className="live-ticker__link">
        Open feed
      </a>
    </section>
  );
}
