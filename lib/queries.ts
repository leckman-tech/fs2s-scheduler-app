import { cache } from "react";
import { redirect } from "next/navigation";
import { ATTENDEE_PORTAL_ROLES, SESSION_RESOURCE_BUCKET, SPEAKER_PORTAL_ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { displaySessionTitle } from "@/lib/utils";
import type {
  AnnouncementRecord,
  FeedbackSummaryRecord,
  SessionRecord,
  PortalDocumentRecord,
  PortalMessageRecord,
  SessionSignupRecord,
  SessionSignupSummaryRecord,
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
  signup_enabled: boolean;
  signup_capacity: number | null;
  signup_instructions: string | null;
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

type PortalDocumentRow = {
  id: string;
  session_id: string | null;
  audience: "attendee" | "speaker" | "both";
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  mime_type: string | null;
  published: boolean;
  created_at: string;
  sessions:
    | {
        id: string;
        title: string;
        final_title: string | null;
        placeholder_code: string | null;
        category: SessionRecord["category"];
        date: string;
      }
    | Array<{
        id: string;
        title: string;
        final_title: string | null;
        placeholder_code: string | null;
        category: SessionRecord["category"];
        date: string;
      }>
    | null;
};

type PortalMessageRow = {
  id: string;
  audience: "attendee" | "speaker" | "both";
  author_id: string;
  body: string;
  published: boolean;
  created_at: string;
  profiles:
    | {
        full_name: string | null;
        role: string | null;
      }
    | Array<{
        full_name: string | null;
        role: string | null;
      }>
    | null;
};

type SessionSignupRow = {
  id: string;
  session_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  status: "confirmed" | "waitlist";
  created_at: string;
  sessions:
    | {
        id: string;
        title: string;
        final_title: string | null;
        placeholder_code: string | null;
        category: SessionRecord["category"];
        date: string;
        starts_at: string;
        signup_capacity: number | null;
      }
    | Array<{
        id: string;
        title: string;
        final_title: string | null;
        placeholder_code: string | null;
        category: SessionRecord["category"];
        date: string;
        starts_at: string;
        signup_capacity: number | null;
      }>
    | null;
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
    signup_enabled: row.signup_enabled,
    signup_capacity: row.signup_capacity,
    signup_instructions: row.signup_instructions,
    status: row.status,
    published: row.published,
    featured: row.featured,
    is_placeholder: row.is_placeholder,
    speakers
  };
}

function mapPortalDocument(row: PortalDocumentRow): PortalDocumentRecord {
  const session = Array.isArray(row.sessions) ? row.sessions[0] : row.sessions;

  return {
    id: row.id,
    session_id: row.session_id,
    audience: row.audience,
    title: row.title,
    description: row.description,
    file_name: row.file_name,
    file_path: row.file_path,
    mime_type: row.mime_type,
    published: row.published,
    created_at: row.created_at,
    session
  };
}

function mapPortalMessage(row: PortalMessageRow): PortalMessageRecord {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    audience: row.audience,
    author_id: row.author_id,
    body: row.body,
    published: row.published,
    created_at: row.created_at,
    author_name: profile?.full_name ?? null,
    author_role: profile?.role ?? null
  };
}

function mapSessionSignup(row: SessionSignupRow): SessionSignupRecord {
  const session = Array.isArray(row.sessions) ? row.sessions[0] : row.sessions;

  return {
    id: row.id,
    session_id: row.session_id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    status: row.status,
    created_at: row.created_at,
    session
  };
}

export const getPublicSessions = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sessions")
      .select(
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,signup_enabled,signup_capacity,signup_instructions,status,published,featured,is_placeholder,session_speakers(speakers(id,slug,name,title,organization))"
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
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,signup_enabled,signup_capacity,signup_instructions,status,published,featured,is_placeholder,session_speakers(session_role,speakers(id,slug,name,title,organization),session_speaker_logistics(confirmation_status,arrival_time,av_needs,staff_contact,private_logistics_note))"
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
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,signup_enabled,signup_capacity,signup_instructions,status,published,featured,is_placeholder,session_speakers(speakers(id,slug,name,title,organization))"
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
        "id,session_code,placeholder_code,final_title,title,slug,category,date,starts_at,ends_at,venue,room,short_description,description,live_updates,signup_enabled,signup_capacity,signup_instructions,status,published,featured,is_placeholder,session_speakers(session_role,speakers(id,slug,name,title,organization),session_speaker_logistics(confirmation_status,arrival_time,av_needs,staff_contact,private_logistics_note))"
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

export const getPublicSessionSignupSummary = cache(async (sessionId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_public_session_signup_summary", {
      check_session: sessionId
    });

    if (error) {
      console.error(error);
      return null as SessionSignupSummaryRecord | null;
    }

    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      return null as SessionSignupSummaryRecord | null;
    }

    return {
      signupEnabled: Boolean(row.signup_enabled),
      signupCapacity: row.signup_capacity ?? null,
      signupInstructions: row.signup_instructions ?? null,
      confirmedCount: Number(row.confirmed_count ?? 0),
      waitlistCount: Number(row.waitlist_count ?? 0)
    };
  } catch (error) {
    console.error(error);
    return null as SessionSignupSummaryRecord | null;
  }
});

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

export const requireAttendeePortalUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/attendee/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (
    !profile ||
    !ATTENDEE_PORTAL_ROLES.includes(
      profile.role as (typeof ATTENDEE_PORTAL_ROLES)[number]
    )
  ) {
    redirect("/attendee/login?error=This%20login%20does%20not%20include%20attendee%20portal%20access");
  }

  return { user, profile };
});

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

export const getAdminPortalDocuments = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portal_documents")
      .select(
        "id,session_id,audience,title,description,file_name,file_path,mime_type,published,created_at,sessions(id,title,final_title,placeholder_code,category,date)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as PortalDocumentRecord[];
    }

    return (data as PortalDocumentRow[]).map(mapPortalDocument);
  } catch (error) {
    console.error(error);
    return [] as PortalDocumentRecord[];
  }
});

export const getAttendeePortalResources = cache(async () => {
  await requireAttendeePortalUser();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portal_documents")
      .select(
        "id,session_id,audience,title,description,file_name,file_path,mime_type,published,created_at,sessions(id,title,final_title,placeholder_code,category,date)"
      )
      .eq("published", true)
      .in("audience", ["attendee", "both"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as PortalDocumentRecord[];
    }

    const resources = (data as PortalDocumentRow[]).map(mapPortalDocument);

    if (!resources.length) {
      return [];
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(SESSION_RESOURCE_BUCKET)
      .createSignedUrls(
        resources.map((resource) => resource.file_path),
        60 * 60
      );

    if (signedError) {
      console.error(signedError);
      return resources;
    }

    return resources.map((resource, index) => ({
      ...resource,
      signed_url: signedData?.[index]?.signedUrl ?? null
    }));
  } catch (error) {
    console.error(error);
    return [] as PortalDocumentRecord[];
  }
});

export const getSpeakerPortalDocuments = cache(async () => {
  await requirePrivateScheduleUser();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portal_documents")
      .select(
        "id,session_id,audience,title,description,file_name,file_path,mime_type,published,created_at,sessions(id,title,final_title,placeholder_code,category,date)"
      )
      .eq("published", true)
      .in("audience", ["speaker", "both"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as PortalDocumentRecord[];
    }

    const documents = (data as PortalDocumentRow[]).map(mapPortalDocument);

    if (!documents.length) {
      return [];
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(SESSION_RESOURCE_BUCKET)
      .createSignedUrls(
        documents.map((document) => document.file_path),
        60 * 60
      );

    if (signedError) {
      console.error(signedError);
      return documents;
    }

    return documents.map((document, index) => ({
      ...document,
      signed_url: signedData?.[index]?.signedUrl ?? null
    }));
  } catch (error) {
    console.error(error);
    return [] as PortalDocumentRecord[];
  }
});

export const getSpeakerPortalMessages = cache(async () => {
  await requirePrivateScheduleUser();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portal_messages")
      .select("id,audience,author_id,body,published,created_at,profiles(full_name,role)")
      .eq("published", true)
      .eq("audience", "speaker")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as PortalMessageRecord[];
    }

    return (data as PortalMessageRow[]).map(mapPortalMessage);
  } catch (error) {
    console.error(error);
    return [] as PortalMessageRecord[];
  }
});

export const getAdminPortalMessages = cache(async () => {
  await requireAdmin();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portal_messages")
      .select("id,audience,author_id,body,published,created_at,profiles(full_name,role)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as PortalMessageRecord[];
    }

    return (data as PortalMessageRow[]).map(mapPortalMessage);
  } catch (error) {
    console.error(error);
    return [] as PortalMessageRecord[];
  }
});

export const getResourceEligibleSessions = cache(async () => {
  const sessions = await getAdminSessions();
  return sessions.filter((session) =>
    ["workshop", "panel", "keynote", "fireside_chat", "scholar_session", "special_event", "opening_session", "closing_session"]
      .includes(session.category)
  );
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

  if (
    !profile ||
    !SPEAKER_PORTAL_ROLES.includes(
      profile.role as (typeof SPEAKER_PORTAL_ROLES)[number]
    )
  ) {
    redirect("/portal/login?error=Your%20account%20does%20not%20include%20speaker%20or%20presenter%20access");
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

export const getAdminSessionSignups = cache(async () => {
  await requireAdmin();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("session_signups")
      .select(
        "id,session_id,full_name,email,phone,organization,status,created_at,sessions(id,title,final_title,placeholder_code,category,date,starts_at,signup_capacity)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [] as SessionSignupRecord[];
    }

    return (data as SessionSignupRow[]).map(mapSessionSignup);
  } catch (error) {
    console.error(error);
    return [] as SessionSignupRecord[];
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
