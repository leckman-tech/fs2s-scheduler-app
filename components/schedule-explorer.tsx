"use client";

import { useMemo, useState } from "react";
import { SessionCard } from "@/components/session-card";
import {
  CATEGORY_LABELS,
  PRIMARY_PUBLIC_FILTER_CATEGORIES,
  type SessionCategory
} from "@/lib/constants";
import type { SessionRecord } from "@/lib/types";
import { formatDateLabel, groupByDate } from "@/lib/utils";

type Props = {
  sessions: SessionRecord[];
  days: string[];
};

export function ScheduleExplorer({ sessions, days }: Props) {
  const [activeDay, setActiveDay] = useState<string>("all");
  const [activeCategories, setActiveCategories] = useState<SessionCategory[]>([]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const dayMatch = activeDay === "all" || session.date === activeDay;
      const categoryMatch =
        activeCategories.length === 0 || activeCategories.includes(session.category);
      return dayMatch && categoryMatch;
    });
  }, [activeCategories, activeDay, sessions]);

  const groupedSessions = groupByDate(filteredSessions);

  const toggleCategory = (category: SessionCategory) => {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category]
    );
  };

  return (
    <div className="stack">
      <section className="panel schedule-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Build your path</p>
            <h2>Browse the schedule</h2>
          </div>
          <span className="schedule-count">
            {filteredSessions.length} session{filteredSessions.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="schedule-filter-stack">
          <div className="field">
            <label>Day</label>
            <div className="filter-group">
              <button
                type="button"
                className="chip"
                data-active={activeDay === "all"}
                onClick={() => setActiveDay("all")}
              >
                All days
              </button>
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  className="chip"
                  data-active={activeDay === day}
                  onClick={() => setActiveDay(day)}
                >
                  {formatDateLabel(day)}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Featured programming</label>
            <p className="field-hint">
              Meals, breaks, transitions, and registration stay visible automatically.
            </p>
            <div className="filter-group">
              {PRIMARY_PUBLIC_FILTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="chip"
                  data-active={activeCategories.includes(category)}
                  onClick={() => toggleCategory(category)}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {Object.keys(groupedSessions).length ? (
        Object.entries(groupedSessions).map(([date, daySessions]) => (
          <section className="day-block" key={date}>
            <h3 className="day-heading">{formatDateLabel(date)}</h3>
            <div className="session-list">
              {daySessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="empty-state">
          No sessions match the current filters. Try clearing a day or category filter.
        </div>
      )}
    </div>
  );
}
