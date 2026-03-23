"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ATTENDEE_PORTAL_ROLES,
  CONFIRMATION_STATUSES,
  PARTICIPANT_ROLES,
  SPEAKER_PORTAL_ROLES,
  SESSION_RESOURCE_BUCKET,
  SESSION_CATEGORIES,
  SESSION_STATUSES
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/queries";
import { toSlug } from "@/lib/utils";

function normalizeDateTimeInput(value: string) {
  if (!value) {
    return value;
  }
  return `${value}:00-04:00`;
}

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getCurrentRole() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, role: null as string | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, role: profile?.role ?? null };
}

function parseSpeakers(rawValue: string) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, title, organization, sessionRole, confirmationStatus, arrivalTime, avNeeds, staffContact, privateLogisticsNote] = line
        .split("|")
        .map((part) => part?.trim() ?? "");
      return {
        slug: toSlug([name, organization || title || sessionRole].filter(Boolean).join(" ")),
        name,
        title: title || null,
        organization: organization || null,
        sessionRole: PARTICIPANT_ROLES.includes(
          (sessionRole || "speaker") as (typeof PARTICIPANT_ROLES)[number]
        )
          ? sessionRole || "speaker"
          : "speaker",
        confirmationStatus: CONFIRMATION_STATUSES.includes(
          (confirmationStatus || "confirmed") as (typeof CONFIRMATION_STATUSES)[number]
        )
          ? confirmationStatus || "confirmed"
          : "confirmed",
        arrivalTime: arrivalTime ? normalizeDateTimeInput(arrivalTime) : null,
        avNeeds: avNeeds || null,
        staffContact: staffContact || null,
        privateLogisticsNote: privateLogisticsNote || null
      };
    })
    .filter((speaker) => speaker.name);
}

async function syncSessionSpeakers(
  sessionId: string,
  speakerLines: string
) {
  const supabase = await createClient();
  const speakers = parseSpeakers(speakerLines);

  await supabase.from("session_speakers").delete().eq("session_id", sessionId);

  if (!speakers.length) {
    return;
  }

  const { data: savedSpeakers, error } = await supabase
    .from("speakers")
    .upsert(
      speakers.map(({ slug, name, title, organization }) => ({
        slug,
        name,
        title,
        organization
      })),
      { onConflict: "slug" }
    )
    .select("id,slug");

  if (error) {
    throw error;
  }

  const speakerIds = savedSpeakers
    .map((speaker) => {
      const parsedSpeaker = speakers.find((entry) => entry.slug === speaker.slug);
      if (!parsedSpeaker) {
        return null;
      }

      return {
        session_id: sessionId,
        speaker_id: speaker.id,
        session_role: parsedSpeaker.sessionRole,
        confirmation_status: parsedSpeaker.confirmationStatus,
        arrival_time: parsedSpeaker.arrivalTime,
        av_needs: parsedSpeaker.avNeeds,
        staff_contact: parsedSpeaker.staffContact,
        private_logistics_note: parsedSpeaker.privateLogisticsNote
      };
    })
    .filter(
      (
        entry
      ): entry is {
        session_id: string;
        speaker_id: string;
        session_role: string;
        confirmation_status: string;
        arrival_time: string | null;
        av_needs: string | null;
        staff_contact: string | null;
        private_logistics_note: string | null;
      } => Boolean(entry)
    );

  if (speakerIds.length) {
    const { error: linkError } = await supabase.from("session_speakers").insert(
      speakerIds.map(({ session_id, speaker_id, session_role }) => ({
        session_id,
        speaker_id,
        session_role
      }))
    );

    if (linkError) {
      throw linkError;
    }

    const { error: logisticsError } = await supabase.from("session_speaker_logistics").insert(
      speakerIds.map(
        ({
          session_id,
          speaker_id,
          confirmation_status,
          arrival_time,
          av_needs,
          staff_contact,
          private_logistics_note
        }) => ({
          session_id,
          speaker_id,
          confirmation_status,
          arrival_time,
          av_needs,
          staff_contact,
          private_logistics_note
        })
      )
    );

    if (logisticsError) {
      throw logisticsError;
    }
  }
}

export async function loginAdmin(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  const { role } = await getCurrentRole();

  if (role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=This%20login%20does%20not%20include%20admin%20access");
  }

  redirect("/admin/dashboard");
}

export async function loginPortal(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/portal/login?error=${encodeURIComponent(error.message)}`);
  }

  const { role } = await getCurrentRole();

  if (!SPEAKER_PORTAL_ROLES.includes(role as (typeof SPEAKER_PORTAL_ROLES)[number])) {
    await supabase.auth.signOut();
    redirect("/portal/login?error=This%20login%20does%20not%20include%20speaker%20or%20presenter%20access");
  }

  redirect("/portal");
}

export async function loginAttendee(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/attendee/login?error=${encodeURIComponent(error.message)}`);
  }

  const { role } = await getCurrentRole();

  if (!ATTENDEE_PORTAL_ROLES.includes(role as (typeof ATTENDEE_PORTAL_ROLES)[number])) {
    await supabase.auth.signOut();
    redirect("/attendee/login?error=This%20login%20does%20not%20include%20attendee%20portal%20access");
  }

  redirect("/attendee");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function logoutPortal() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

export async function logoutAttendee() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/attendee/login");
}

export async function saveSession(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const session_code = String(formData.get("session_code") ?? "").trim();
  const placeholder_code = String(formData.get("placeholder_code") ?? "").trim();
  const final_title = String(formData.get("final_title") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const starts_at = normalizeDateTimeInput(String(formData.get("starts_at") ?? "").trim());
  const ends_atInput = String(formData.get("ends_at") ?? "").trim();
  const ends_at = ends_atInput ? normalizeDateTimeInput(ends_atInput) : null;
  const venue = String(formData.get("venue") ?? "").trim();
  const room = String(formData.get("room") ?? "").trim();
  const short_description = String(formData.get("short_description") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const live_updates = String(formData.get("live_updates") ?? "").trim();
  const status = String(formData.get("status") ?? "scheduled").trim();
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const is_placeholder = formData.get("is_placeholder") === "on";
  const speakers = String(formData.get("speakers") ?? "").trim();

  if (!SESSION_CATEGORIES.includes(category as (typeof SESSION_CATEGORIES)[number])) {
    redirect("/admin/dashboard?error=Invalid%20session%20category");
  }

  if (!SESSION_STATUSES.includes(status as (typeof SESSION_STATUSES)[number])) {
    redirect("/admin/dashboard?error=Invalid%20session%20status");
  }

  const payload = {
    session_code: session_code || null,
    placeholder_code: placeholder_code || null,
    final_title: final_title || null,
    title,
    slug: toSlug([session_code || date, title].filter(Boolean).join(" ")),
    category,
    date,
    starts_at,
    ends_at,
    venue,
    room,
    short_description,
    description,
    live_updates: live_updates || null,
    status,
    published,
    featured,
    is_placeholder
  };

  const query = id
    ? supabase.from("sessions").update(payload).eq("id", id).select("id").single()
    : supabase.from("sessions").insert(payload).select("id").single();

  const { data, error } = await query;

  if (error) {
    redirect(`/admin/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  await syncSessionSpeakers(data.id, speakers);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/session/${data.id}`);
  redirect("/admin/dashboard");
}

export async function saveWorkshopSlot(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const placeholder_code = String(formData.get("placeholder_code") ?? "").trim();
  const final_title = String(formData.get("final_title") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const room = String(formData.get("room") ?? "").trim();
  const speakers = String(formData.get("speakers") ?? "").trim();
  const published = formData.get("published") === "on";

  const payload = {
    title: `Workshop ${placeholder_code}`,
    slug: toSlug([placeholder_code || id, final_title || `Workshop ${placeholder_code}`].join(" ")),
    placeholder_code: placeholder_code || null,
    final_title: final_title || null,
    venue,
    room,
    published,
    is_placeholder: !final_title
  };

  const { error } = await supabase.from("sessions").update(payload).eq("id", id).eq("category", "workshop");

  if (error) {
    redirect(`/admin/dashboard/workshops?error=${encodeURIComponent(error.message)}`);
  }

  await syncSessionSpeakers(id, speakers);

  revalidatePath("/");
  revalidatePath("/admin/dashboard/workshops");
  revalidatePath("/speakers");
  redirect("/admin/dashboard/workshops");
}

export async function deleteSession(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  await supabase.from("sessions").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function toggleSessionPublish(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";

  await supabase.from("sessions").update({ published: !published }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function saveAnnouncement(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const priority = String(formData.get("priority") ?? "normal").trim();
  const published = formData.get("published") === "on";

  const { error } = await supabase.from("announcements").insert({
    title,
    body,
    priority,
    published
  });

  if (error) {
    redirect(`/admin/dashboard/announcements?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/announcements");
  redirect("/admin/dashboard/announcements");
}

export async function toggleAnnouncementPublish(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";

  await supabase.from("announcements").update({ published: !published }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard/announcements");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  await supabase.from("announcements").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/dashboard/announcements");
}

export async function uploadPortalDocument(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const sessionId = String(formData.get("session_id") ?? "").trim();
  const audience = String(formData.get("audience") ?? "attendee").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const published = formData.get("published") === "on";
  const file = formData.get("file");

  if (!title || !(file instanceof File) || file.size === 0) {
    redirect("/admin/dashboard/resources?error=Title%20and%20file%20are%20required");
  }

  const fileName = sanitizeFileName(file.name || `${title}.pdf`);
  const storagePath = `${sessionId || "general"}/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(SESSION_RESOURCE_BUCKET)
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || undefined
    });

  if (uploadError) {
    redirect(`/admin/dashboard/resources?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { error: insertError } = await supabase.from("portal_documents").insert({
    session_id: sessionId || null,
    audience,
    title,
    description: description || null,
    file_name: file.name || fileName,
    file_path: storagePath,
    mime_type: file.type || null,
    published
  });

  if (insertError) {
    await supabase.storage.from(SESSION_RESOURCE_BUCKET).remove([storagePath]);
    redirect(`/admin/dashboard/resources?error=${encodeURIComponent(insertError.message)}`);
  }

  revalidatePath("/attendee");
  revalidatePath("/portal");
  revalidatePath("/admin/dashboard/resources");
  redirect("/admin/dashboard/resources");
}

export async function togglePortalDocumentPublish(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const published = String(formData.get("published") ?? "") === "true";

  await supabase.from("portal_documents").update({ published: !published }).eq("id", id);

  revalidatePath("/attendee");
  revalidatePath("/portal");
  revalidatePath("/admin/dashboard/resources");
}

export async function deletePortalDocument(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const filePath = String(formData.get("file_path") ?? "").trim();

  await supabase.from("portal_documents").delete().eq("id", id);

  if (filePath) {
    await supabase.storage.from(SESSION_RESOURCE_BUCKET).remove([filePath]);
  }

  revalidatePath("/attendee");
  revalidatePath("/portal");
  revalidatePath("/admin/dashboard/resources");
}

export async function postSpeakerPortalMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    redirect("/portal?error=Message%20cannot%20be%20empty");
  }

  const { error } = await supabase.from("portal_messages").insert({
    audience: "speaker",
    author_id: user.id,
    body,
    published: true
  });

  if (error) {
    redirect(`/portal?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/portal");
  redirect("/portal");
}

export async function deleteSpeakerPortalMessage(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();

  await supabase.from("portal_messages").delete().eq("id", id);

  revalidatePath("/portal");
  revalidatePath("/admin/dashboard/resources");
}
