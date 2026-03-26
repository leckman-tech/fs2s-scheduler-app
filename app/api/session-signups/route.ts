import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  FORM_HONEYPOT_FIELD,
  FORM_STARTED_AT_FIELD,
  guardPublicFormSubmission,
  validateHumanSubmission
} from "@/lib/anti-spam";
import { sendSessionSignupConfirmationEmail } from "@/lib/email";
import { toPublicErrorMessage } from "@/lib/public-errors";
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
      return NextResponse.json(
        {
          error: toPublicErrorMessage(error, {
            fallback: "We couldn't save your sign-up just now. Please try again.",
            setupMessage:
              "Event sign-ups are not fully enabled in Supabase yet. Run the 011_session_signups.sql migration first.",
            setupFragments: ["session_signups", "create_session_signup", "schema cache"],
            duplicateMessage: "This email is already signed up for this event.",
            duplicateFragments: ["already signed up", "duplicate key", "unique"],
            closedMessage: "Sign-ups for this event are not currently available.",
            closedFragments: ["sign-ups for this event are now closed", "not enabled"]
          })
        },
        { status: 400 }
      );
    }

    const { data: summary, error: summaryError } = await supabase.rpc("get_public_session_signup_summary", {
      check_session: body.sessionId
    });

    if (summaryError) {
      console.error(summaryError);
      return NextResponse.json(
        { error: "Your sign-up was saved, but the page counts could not refresh right away." },
        { status: 500 }
      );
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
    console.error(error);
    return NextResponse.json(
      { error: "We couldn't save your sign-up right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
