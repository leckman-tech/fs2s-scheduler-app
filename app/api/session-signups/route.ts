import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  FORM_HONEYPOT_FIELD,
  FORM_STARTED_AT_FIELD,
  guardPublicFormSubmission,
  validateHumanSubmission
} from "@/lib/anti-spam";
import { sendSessionSignupConfirmationEmail } from "@/lib/email";
import { displaySessionTitle, formatDateLabel, formatTimeRange } from "@/lib/utils";

function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase credentials");
  }

  return createSupabaseClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      fullName?: string;
      email?: string;
      phone?: string;
      organization?: string;
      website?: string;
      startedAt?: string | number;
    };

    if (!body.sessionId || !body.fullName || !body.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const humanCheck = validateHumanSubmission({
      honeypot: body[FORM_HONEYPOT_FIELD],
      startedAt: body[FORM_STARTED_AT_FIELD]
    });

    if (!humanCheck.allowed) {
      return NextResponse.json({ error: humanCheck.reason }, { status: 400 });
    }

    const supabase = getPublicSupabaseClient();
    const normalizedEmail = body.email.trim().toLowerCase();
    const guard = await guardPublicFormSubmission(supabase, request, {
      formKey: `session-signup:${body.sessionId}`,
      email: normalizedEmail
    });

    if (!guard.allowed) {
      return NextResponse.json(
        { error: guard.reason || "Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const { data: inserted, error } = await supabase.rpc("create_session_signup", {
      p_session_id: body.sessionId,
      p_full_name: body.fullName,
      p_email: normalizedEmail,
      p_phone: body.phone?.trim() || null,
      p_organization: body.organization?.trim() || null
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: summary, error: summaryError } = await supabase.rpc("get_public_session_signup_summary", {
      check_session: body.sessionId
    });

    if (summaryError) {
      return NextResponse.json({ error: summaryError.message }, { status: 500 });
    }

    const summaryRow = Array.isArray(summary) ? summary[0] : summary;
    const signupRow = Array.isArray(inserted) ? inserted[0] : inserted;
    let confirmationEmailSent = false;

    const { data: session } = await supabase
      .from("sessions")
      .select("title,final_title,placeholder_code,category,date,starts_at,ends_at,venue,room")
      .eq("id", body.sessionId)
      .maybeSingle();

    if (session) {
      const emailResult = await sendSessionSignupConfirmationEmail({
        to: normalizedEmail,
        fullName: body.fullName.trim(),
        signupStatus: signupRow?.status ?? "confirmed",
        sessionTitle: displaySessionTitle({
          title: session.title,
          final_title: session.final_title,
          placeholder_code: session.placeholder_code,
          category: session.category
        }),
        dateLabel: formatDateLabel(session.date),
        timeLabel: formatTimeRange(session.starts_at, session.ends_at),
        locationLabel: [session.venue, session.room].filter(Boolean).join(" · ")
      });

      confirmationEmailSent = emailResult.sent;
      if (emailResult.error) {
        console.error(emailResult.error);
      }
    }

    return NextResponse.json({
      ok: true,
      signupStatus: signupRow?.status ?? "confirmed",
      confirmedCount: Number(summaryRow?.confirmed_count ?? 0),
      waitlistCount: Number(summaryRow?.waitlist_count ?? 0),
      confirmationEmailSent
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
