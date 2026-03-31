export const SESSION_CATEGORIES = [
  "breakfast",
  "opening_session",
  "keynote",
  "break",
  "panel",
  "workshop",
  "lunch",
  "special_event",
  "staff_event",
  "scholar_session",
  "transition",
  "evening_event",
  "closing_session",
  "fireside_chat",
  "reception"
] as const;

export const SESSION_STATUSES = [
  "scheduled",
  "moved",
  "delayed",
  "full",
  "cancelled",
  "completed"
] as const;

export type SessionCategory = (typeof SESSION_CATEGORIES)[number];
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const CATEGORY_LABELS: Record<SessionCategory, string> = {
  breakfast: "Breakfast",
  opening_session: "Opening Session",
  keynote: "Keynote",
  break: "Break",
  panel: "Panel",
  workshop: "Workshop",
  lunch: "Lunch",
  special_event: "Special Event",
  staff_event: "Staff Event",
  scholar_session: "Scholar Session",
  transition: "Transition",
  evening_event: "Evening Event",
  closing_session: "Closing Session",
  fireside_chat: "Fireside Chat",
  reception: "Reception"
};

export const SECONDARY_PUBLIC_CATEGORIES: SessionCategory[] = [
  "breakfast",
  "break",
  "lunch",
  "transition",
  "staff_event"
];

export const PRIMARY_PUBLIC_FILTER_CATEGORIES: SessionCategory[] = SESSION_CATEGORIES.filter(
  (category) => !SECONDARY_PUBLIC_CATEGORIES.includes(category)
);

export const PARTICIPANT_ROLES = [
  "speaker",
  "panelist",
  "workshop_presenter",
  "exhibitor"
] as const;

export const CONFIRMATION_STATUSES = [
  "confirmed",
  "pending",
  "unconfirmed",
  "awaiting_invitation",
  "to_be_announced"
] as const;

export const USER_ROLES = [
  "attendee",
  "speaker",
  "panelist",
  "workshop_presenter",
  "exhibitor",
  "admin"
] as const;

export const ATTENDEE_PORTAL_ROLES = ["attendee", "admin"] as const;

export const SPEAKER_PORTAL_ROLES = [
  "speaker",
  "panelist",
  "workshop_presenter",
  "exhibitor",
  "admin"
] as const;

export const STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  moved: "Moved",
  delayed: "Delayed",
  full: "Full",
  cancelled: "Cancelled",
  completed: "Completed"
};

export const SESSION_RESOURCE_BUCKET = "session-resources";
export const ATTENDEE_BOARD_MEDIA_BUCKET = "attendee-board-media";

export const SITE_URL = "https://fs2shub.com";
export const SITE_NAME = "From Silos to Solutions 2026";
export const SITE_DESCRIPTION =
  "From Silos to Solutions 2026 is a national convening in Washington, D.C. focused on coordinating supports for opportunity and justice-involved youth and young adults through partnership, advocacy, and scholar-centered practice.";
export const SEO_OG_IMAGE = "/fs2s/fs2s-room-wide.jpg";
export const SEE_FOREVER_URL = "https://www.seeforever.org";
export const CONVENING_DIRECTOR_NAME = "Levi W. Eckman, J.D.";
export const CONVENING_DIRECTOR_TITLE = "Convening Director";
export const CONVENING_DIRECTOR_EMAIL = "ConferenceDirector@SeeForever.org";
export const CONVENING_DIRECTOR_PHONE = "(202) 838-7879";
export const CONVENING_DIRECTOR_PHONE_LINK = "tel:+12028387879";

export const EVENTBRITE_URL =
  "https://www.eventbrite.com/e/from-silos-to-solutions-2026-tickets-1317628495299?utm-campaign=social&utm-content=attendeeshare&utm-medium=discovery&utm-term=listing&utm-source=cp&aff=ebdsshcopyurl";

export const TICKET_PROMO_CODE = "DCCIVIC";
