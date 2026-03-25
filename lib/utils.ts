import {
  CATEGORY_LABELS,
  SECONDARY_PUBLIC_CATEGORIES,
  STATUS_LABELS,
  type SessionCategory,
  type SessionStatus
} from "@/lib/constants";
import type { SessionRecord } from "@/lib/types";

export function formatDateLabel(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatTimeRange(start: string, end?: string | null) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  });

  if (!end) {
    return formatter.format(new Date(start));
  }

  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

export function labelForCategory(category: SessionCategory) {
  return CATEGORY_LABELS[category];
}

export function labelForStatus(status: SessionStatus) {
  return STATUS_LABELS[status];
}

export function isSecondarySessionCategory(category: SessionCategory) {
  return SECONDARY_PUBLIC_CATEGORIES.includes(category);
}

export function isPublicSessionInteractive(category: SessionCategory) {
  return !isSecondarySessionCategory(category);
}

export function statusClassName(status: SessionStatus) {
  return `status-pill status-${status.replace("_", "-")}`;
}

export function groupByDate<T extends { starts_at: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = item.starts_at.slice(0, 10);
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function escapeCsv(value: string | number | boolean | null | undefined) {
  const normalized = value == null ? "" : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function displaySessionTitle(session: Pick<SessionRecord, "title" | "category" | "final_title" | "placeholder_code">) {
  if (session.category === "workshop") {
    return session.final_title?.trim() || `Workshop ${session.placeholder_code ?? ""}`.trim();
  }

  return session.title;
}
