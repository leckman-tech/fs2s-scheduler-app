import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  FORM_HONEYPOT_FIELD,
  FORM_STARTED_AT_FIELD,
  guardPublicFormSubmission,
  validateHumanSubmission
} from "@/lib/anti-spam";
import { sendLobbyDayConfirmationEmail, sendLobbyDayAdminNotification } from "@/lib/email";
import { toPublicErrorMessage } from "@/lib/public-errors";

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
      fullName?: string;
      email?: string;
      phone?: string;
      organization?: string;
      website?: string;
      startedAt?: string | number;
    };

    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
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
      formKey: "lobby-day-signup",
      email: normalizedEmail
    });

    if (!guard.allowed) {
      return NextResponse.json(
        { error: guard.reason || "Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // Use the public signup RPC, which handles duplicate checks atomically.
    // Anonymous visitors cannot SELECT private signup rows under RLS.
    const { error: signupError } = await supabase.rpc("create_lobby_day_signup", {
      p_full_name: body.fullName.trim(),
      p_email: normalizedEmail,
      p_phone: body.phone.trim(),
      p_organization: body.organization?.trim() || null
    });
    if (signupError) {
      return NextResponse.json({
        error: toPublicErrorMessage(signupError, {
          fallback: "We couldn't save your Hill Day registration just now. Please try again.",
          duplicateMessage: "This email is already signed up for Hill Day.",
          duplicateFragments: ["already signed up", "duplicate key", "unique"]
        })
      }, { status: 400 });
    }

    // A count failure must not turn a successfully saved signup into a failed form submission.
    const { data: summary, error: summaryError } = await supabase.rpc("get_public_lobby_day_signup_summary");
    if (summaryError) console.error("Hill Day count refresh failed", summaryError);
    const totalCount = Array.isArray(summary)
      ? Number(summary[0]?.total_count ?? 0)
      : Number(summary?.total_count ?? 0);

    const [emailResult, adminNotification] = await Promise.all([sendLobbyDayConfirmationEmail({
      to: normalizedEmail,
      fullName: body.fullName.trim()
    }), sendLobbyDayAdminNotification({
      fullName: body.fullName.trim(),
      email: normalizedEmail,
      phone: body.phone.trim(),
      organization: body.organization?.trim() || ""
    })]);

    if (emailResult.error) console.error("Hill Day attendee acknowledgment failed", emailResult.error);
    if (!adminNotification.sent) console.error("Hill Day registration notification was not sent", adminNotification.error || "Email provider not configured");

    return NextResponse.json({
      ok: true,
      totalCount,
      confirmationEmailSent: emailResult.sent,
      adminNotificationSent: adminNotification.sent
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "We couldn't save your Lobby Day sign-up right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
