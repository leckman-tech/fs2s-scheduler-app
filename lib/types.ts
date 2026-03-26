import type { SessionCategory, SessionStatus } from "@/lib/constants";

export type Speaker = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  organization: string | null;
};

export type SessionSpeaker = Speaker & {
  sessionRole: string | null;
  confirmationStatus: string | null;
  arrivalTime: string | null;
  avNeeds: string | null;
  staffContact: string | null;
  privateLogisticsNote: string | null;
};

export type SessionRecord = {
  id: string;
  session_code: string | null;
  placeholder_code: string | null;
  final_title: string | null;
  title: string;
  slug: string;
  category: SessionCategory;
  date: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  room: string;
  short_description: string;
  description: string;
  live_updates: string | null;
  signup_enabled: boolean;
  signup_capacity: number | null;
  signup_instructions: string | null;
  signup_deadline: string | null;
  status: SessionStatus;
  published: boolean;
  featured: boolean;
  is_placeholder: boolean;
  speakers: SessionSpeaker[];
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  priority: "normal" | "urgent";
  published: boolean;
  created_at: string;
};

export type FeedbackSummaryRecord = {
  id: string;
  title: string;
  feedbackCount: number;
  averageRating: number | null;
};

export type SpeakerDirectoryRecord = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  organization: string | null;
  sessions: Array<{
    id: string;
    title: string;
    final_title: string | null;
    placeholder_code: string | null;
    category: SessionCategory;
    date: string;
  }>;
};

export type PortalAudience = "attendee" | "speaker" | "both";

export type PortalDocumentRecord = {
  id: string;
  session_id: string | null;
  audience: PortalAudience;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  mime_type: string | null;
  published: boolean;
  created_at: string;
  signed_url?: string | null;
  session: {
    id: string;
    title: string;
    final_title: string | null;
    placeholder_code: string | null;
    category: SessionCategory;
    date: string;
  } | null;
};

export type PortalMessageRecord = {
  id: string;
  audience: PortalAudience;
  author_id: string;
  body: string;
  published: boolean;
  created_at: string;
  author_name: string | null;
  author_role: string | null;
};

export type SessionSignupSummaryRecord = {
  signupEnabled: boolean;
  signupCapacity: number | null;
  signupInstructions: string | null;
  confirmedCount: number;
  waitlistCount: number;
};

export type SessionSignupRecord = {
  id: string;
  session_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  status: "confirmed" | "waitlist";
  created_at: string;
  session: {
    id: string;
    title: string;
    final_title: string | null;
    placeholder_code: string | null;
    category: SessionCategory;
    date: string;
    starts_at: string;
    signup_capacity: number | null;
  } | null;
};

export type LobbyDaySignupRecord = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string | null;
  created_at: string;
};

export type HappyHourRsvpGroup = "conference_attendee" | "staff";

export type HappyHourRsvpRecord = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string | null;
  rsvp_group: HappyHourRsvpGroup;
  status: "confirmed" | "waitlist";
  created_at: string;
};

export type HappyHourRsvpSummaryRecord = {
  confirmedCount: number;
  waitlistCount: number;
  confirmedAttendeeCount: number;
  waitlistAttendeeCount: number;
  confirmedStaffCount: number;
  waitlistStaffCount: number;
};

export type AttendeeBoardPostRecord = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  body: string;
  published: boolean;
  created_at: string;
  updated_at?: string | null;
};

export type AttendeeDirectoryEntryRecord = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  title: string | null;
  organization: string | null;
  share_with_attendees: boolean;
  share_with_planners: boolean;
  created_at: string;
  updated_at: string;
};

export type AttendeeBoardReplyRecord = {
  id: string;
  post_id: string;
  full_name: string;
  email: string;
  organization: string | null;
  body: string;
  created_at: string;
  updated_at: string | null;
  canEdit: boolean;
};

export type AttendeeBoardThreadRecord = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  body: string;
  created_at: string;
  updated_at: string | null;
  canEdit: boolean;
  likedByViewer: boolean;
  likeCount: number;
  replies: AttendeeBoardReplyRecord[];
};
