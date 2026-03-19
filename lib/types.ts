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
