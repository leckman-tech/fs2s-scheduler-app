import { cache } from "react";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { displaySessionTitle } from "@/lib/utils";
import type {
  AnnouncementRecord,
  FeedbackSummaryRecord,
  SessionRecord,
  SpeakerDirectoryRecord,
  SessionSpeaker,
  Speaker
} from "@/lib/types";

type SessionRow = {
  id: string;
  session_code: string | null;
  placeholder_code: string | null;
  final_title: string | null;
  title: string;
  slug: string;
  category: SessionRecord["category"];
  date: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  room: string;
  short_description: string;
  description: string;
  live_updates: string | null;
  status: SessionRecord["status"];
  published: boolean;
  featured: boolean;
  is_placeholder: boolean;
  session_speakers: Array<{
    session_role?: string | null;
    session_speaker_logistics:
      | {
          confirmation_status: string | null;
          arrival_time: string | null;
          av_needs: string | null;
          staff_contact: string | null;
          private_logistics_note: string | null;
        }
      | Array<{
          confirmation_status: string | null;
          arrival_time: string | null;
          av_needs: string | null;
          staff_contact: string | null;
          private_logistics_note: string | null;
        }>
      | null;
    speakers: Speaker | Speaker[] | null;
  }> | null;
};

function mapSession(row: SessionRow): SessionRecord {
  const speakers: SessionSpeaker[] =
    row.session_speakers
      ?.map((entry) => {
        const speakerRecord = Array.isArray(entry.speakers) ? entry.speakers[0] : entry.speakers;

        if (!speakerRecord) {
          return null;
        }

        const logistics = Array.isArray(entry.session_speaker_logistics)
          ? entry.session_speaker_logistics[0]
          : entry.session_speaker_logistics;

        return {
          ...speakerRecord,
          sessionRole: entry.session_role ?? null,
          confirmationStatus: logistics?.confirmation_status ?? null,
          arrivalTime: logistics?.arrival_time ?? null,
          avNeeds: logistics?.av_needs ?? null,
          staffContact: logistics?.staff_contact ?? null,
          privateLogisticsNote: logistics?.private_logistics_note ?? null
        };
      })
      .filter((speaker): speaker is SessionSpeaker => Boolean(speaker)) ?? [];

  return {
    id: row.id,
    session_code: row.session_code,
    placeholder_code: row.placeholder_code,
    final_title: row.final_title,
    title: row.title,
    slug: row.slug,
    category: row.category,
    date: row.date,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    venue: row.venue,
    room: row.room,
    short_description: row.short_description,
    description: row.description,
    live_updates: row.live_updates,
    status: row.status,
    published: row.published,
    featured: row.featured,
    is_placeholder: row.is_placeholder,
    speakers
  };
}

export const getPublicSessions = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select(
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,status,published,featured,is_placeholder,session_speakers(speakers(id,slug,name,title,organization))"
      )
      .eq("published", true)
      .order("starts_at", { ascending: true });

    if (error) {
      console.error(error);
      return [] as SessionRecord[];
    }

    return (data as SessionRow[]).map(mapSession);
  } catch (error) {
    console.error(error);
    return [] as SessionRecord[];
  }
});

export const getAdminSessions = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select(
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,status,published,featured,is_placeholder,session_speakers(session_role,speakers(id,slug,name,title,organization),session_speaker_logistics(confirmation_status,arrival_time,av_needs,staff_contact,private_logistics_note))"
      )
      .order("starts_at", { ascending: true });

    if (error) {
      console.error(error);
      return [] as SessionRecord[];
    }

    return (data as SessionRow[]).map(mapSession);
  } catch (error) {
    console.error(error);
    return [] as SessionRecord[];
  }
});

export const getSessionById = cache(async (id: string, includeUnpublished = false) => {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("sessions")
      .select(
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,status,published,featured,is_placeholder,session_speakers(speakers(id,slug,name,title,organization))"
      )
      .eq("id", id);

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      if (error) {
        console.error(error);
      }
      return null;
    }

    return mapSession(data as SessionRow);
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getAdminSessionById = cache(async (id: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select(
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,status,published,featured,is_placeholder,session_speakers(session_role,speakers(id,slug,name,title,organization),session_speaker_logistics(confirmation_status,arrival_time,av_needs,staff_contact,private_logistics_note))"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(error);
      }
      return null;
    }

    return mapSession(data as SessionRow);
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getPublicAnnouncements = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,body,priority,published,created_at")
      .eq("published", true)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as AnnouncementRecord[];
    }

    return data as AnnouncementRecord[];
  } catch (error) {
    console.error(error);
    return [] as AnnouncementRecord[];
  }
});

export const getAdminAnnouncements = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,body,priority,published,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as AnnouncementRecord[];
    }

    return data as AnnouncementRecord[];
  } catch (error) {
    console.error(error);
    return [] as AnnouncementRecord[];
  }
});

export async function getConferenceDays() {
  const sessions = await getPublicSessions();
  return [...new Set(sessions.map((session) => session.date))];
}

export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=You%20do%20not%20have%20admin%20access");
  }

  return { user, profile };
});

export async function isCurrentUserAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return profile?.role === "admin";
  } catch {
    return false;
  }
}

export const getWorkshopSessions = cache(async () => {
  const sessions = await getAdminSessions();
  return sessions.filter((session) => session.category === "workshop");
});

export const getPublicSpeakers = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("speakers")
      .select(
        "id,slug,name,title,organization,session_speakers(sessions(id,title,final_title,placeholder_code,category,date,published))"
      )
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return [] as SpeakerDirectoryRecord[];
    }

    type PublicSpeakerSession = {
      id: string;
      title: string;
      final_title: string | null;
      placeholder_code: string | null;
      category: SessionRecord["category"];
      date: string;
      published?: boolean;
    };

    return (data ?? [])
      .map((speaker) => ({
        id: speaker.id,
        slug: speaker.slug,
        name: speaker.name,
        title: speaker.title,
        organization: speaker.organization,
        sessions:
          (speaker.session_speakers ?? [])
            .map((entry: { sessions: PublicSpeakerSession[] | PublicSpeakerSession | null }) =>
              Array.isArray(entry.sessions) ? entry.sessions[0] : entry.sessions
            )
            .filter((session): session is PublicSpeakerSession => Boolean(session?.published))
            .map((session) => ({
              id: session.id,
              title: session.title,
              final_title: session.final_title,
              placeholder_code: session.placeholder_code,
              category: session.category,
              date: session.date
            })) ?? []
      }))
      .filter((speaker) => speaker.sessions.length > 0) as SpeakerDirectoryRecord[];
  } catch (error) {
    console.error(error);
    return [] as SpeakerDirectoryRecord[];
  }
});

export const requirePrivateScheduleUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name,speaker_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !USER_ROLES.includes(profile.role as (typeof USER_ROLES)[number])) {
    redirect("/portal/login?error=No%20private%20schedule%20access%20found");
  }

  if (profile.role === "attendee") {
    redirect("/portal/login?error=Your%20account%20does%20not%20include%20speaker%20or%20panelist%20access");
  }

  return { user, profile };
});

export const getCurrentUserAssignedSessions = cache(async () => {
  const { profile } = await requirePrivateScheduleUser();

  if (!profile.speaker_id) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_speakers")
      .select(
        "session_role,speakers(id,slug,name,title,organization),session_speaker_logistics(confirmation_status,arrival_time,av_needs,staff_contact,private_logistics_note),sessions(id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,status,published,featured,is_placeholder)"
      )
      .eq("speaker_id", profile.speaker_id);

    if (error) {
      console.error(error);
      return [];
    }

    return (data ?? [])
      .map((entry) => {
        const session = Array.isArray(entry.sessions) ? entry.sessions[0] : entry.sessions;
        if (!session) {
          return null;
        }

        return {
          ...mapSession({
            ...session,
            session_speakers: [
              {
                session_role: entry.session_role,
                session_speaker_logistics: Array.isArray(entry.session_speaker_logistics)
                  ? entry.session_speaker_logistics[0]
                  : entry.session_speaker_logistics,
                speakers: Array.isArray(entry.speakers) ? entry.speakers[0] : entry.speakers
              }
            ]
          } as SessionRow)
        };
      })
      .filter((session): session is SessionRecord => Boolean(session))
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const getFeedbackSummary = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select("id,title,final_title,placeholder_code,category,feedback(rating)")
      .order("starts_at", { ascending: true });

    if (error) {
      console.error(error);
      return [] as FeedbackSummaryRecord[];
    }

    return (data ?? []).map((row) => {
      const ratings = (row.feedback ?? []).map((entry: { rating: number }) => entry.rating);
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      return {
        id: row.id,
        title: displaySessionTitle({
          title: row.title,
          category: row.category,
          final_title: row.final_title,
          placeholder_code: row.placeholder_code
        }),
        feedbackCount: ratings.length,
        averageRating: ratings.length ? Number((total / ratings.length).toFixed(1)) : null
      };
    });
  } catch (error) {
    console.error(error);
    return [] as FeedbackSummaryRecord[];
  }
});

export const getFeedbackBySession = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("feedback")
      .select(
        "id,session_id,rating,most_useful,improvements,attend_future,created_at,sessions(title,final_title,placeholder_code,category)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as Array<{
        id: string;
        session_id: string;
        rating: number;
        most_useful: string;
        improvements: string;
        attend_future: boolean;
        created_at: string;
        sessions: { title: string } | { title: string }[] | null;
      }>;
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
});
