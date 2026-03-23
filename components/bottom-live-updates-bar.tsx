"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { AnnouncementRecord } from "@/lib/types";

const FALLBACK_UPDATE: AnnouncementRecord = {
  id: "fallback-live-update",
  title: "Live updates will appear here",
  body: "Check back for room changes, timing shifts, and urgent conference notices.",
  priority: "normal",
  published: true,
  created_at: ""
};

export function BottomLiveUpdatesBar() {
  const pathname = usePathname();
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAnnouncements() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("announcements")
          .select("id,title,body,priority,published,created_at")
          .eq("published", true)
          .order("priority", { ascending: false })
          .order("created_at", { ascending: false });

        if (error || isCancelled) {
          return;
        }

        setAnnouncements((data as AnnouncementRecord[]) ?? []);
      } catch {
        if (!isCancelled) {
          setAnnouncements([]);
        }
      }
    }

    void loadAnnouncements();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/attendee")
  ) {
    return null;
  }

  const items = announcements.length ? announcements : [FALLBACK_UPDATE];
  const tickerItems = items.map((announcement) =>
    `${announcement.priority === "urgent" ? "Urgent: " : ""}${announcement.title} - ${announcement.body}`
  );
  const repeatedItems = [...tickerItems, ...tickerItems];

  return (
    <section className="bottom-live-bar" aria-label="Live updates">
      <div className="bottom-live-bar__inner">
        <div className="bottom-live-bar__label">Live updates</div>
        <div className="bottom-live-bar__viewport" aria-hidden="true">
          <div className="bottom-live-bar__track">
            {repeatedItems.map((item, index) => (
              <span key={`${index}-${item}`} className="bottom-live-bar__item">
                {item}
              </span>
            ))}
          </div>
        </div>
        <a href="/#live-updates" className="bottom-live-bar__link">
          View all
        </a>
      </div>
      <p className="sr-only">{tickerItems.join(". ")}</p>
    </section>
  );
}
