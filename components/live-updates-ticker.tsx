"use client";

import { useEffect, useState } from "react";
import type { AnnouncementRecord } from "@/lib/types";

export function LiveUpdatesTicker({
  announcements
}: {
  announcements: AnnouncementRecord[];
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [announcements.length]);

  if (!announcements.length || !visible) {
    return null;
  }

  const leadAnnouncement =
    announcements.find((announcement) => announcement.priority === "urgent") ?? announcements[0];
  const remainingCount = Math.max(announcements.length - 1, 0);

  const dismiss = () => {
    setVisible(false);
  };

  return (
    <section className="live-ticker" aria-label="Live updates">
      <div className="live-ticker__label">Live updates</div>
      <div className="live-ticker__viewport" aria-live="polite">
        <div className={`live-ticker__item live-ticker__item--${leadAnnouncement.priority}`}>
          <strong>{leadAnnouncement.title}</strong>
          <span>{leadAnnouncement.body}</span>
          {remainingCount > 0 ? (
            <span className="live-ticker__more">+ {remainingCount} more update{remainingCount === 1 ? "" : "s"}</span>
          ) : null}
        </div>
      </div>
      <a href="#live-updates" className="live-ticker__link">
        View all
      </a>
      <button type="button" className="live-ticker__close" onClick={dismiss} aria-label="Dismiss live updates">
        ×
      </button>
    </section>
  );
}
