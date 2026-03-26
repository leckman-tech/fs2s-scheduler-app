import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  FORM_HONEYPOT_FIELD,
  FORM_STARTED_AT_FIELD,
  guardPublicFormSubmission,
  validateHumanSubmission
} from "@/lib/anti-spam";
import { sendHappyHourConfirmationEmail } from "@/lib/email";

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
      rsvpGroup?: "conference_attendee" | "staff";
      website?: string;
      startedAt?: string | number;
    };

    if (!body.fullName || !body.email || !body.phone || !body.rsvpGroup) {
      return NextResponse.json(
        { error: "Name, email, phone number, and RSVP type are required." },
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
      formKey: `happy-hour-rsvp:${body.rsvpGroup}`,
      email: normalizedEmail
    });

    if (!guard.allowed) {
      return NextResponse.json(
        { error: guard.reason || "Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const { data: inserted, error } = await supabase.rpc("create_happy_hour_rsvp", {
      p_full_name: body.fullName,
      p_email: normalizedEmail,
      p_phone: body.phone,
      p_organization: body.organization?.trim() || null,
      p_rsvp_group: body.rsvpGroup
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message.includes("happy_hour_rsvps")
              ? "Happy Hour RSVPs are not enabled in Supabase yet. Run the 017_happy_hour_rsvps.sql migration first."
              : error.message
        },
        { status: 400 }
      );
    }

    const { data: summary, error: summaryError } = await supabase.rpc(
      "get_public_happy_hour_rsvp_summary"
    );

    if (summaryError) {
      return NextResponse.json({ error: summaryError.message }, { status: 500 });
    }

    const signupRow = Array.isArray(inserted) ? inserted[0] : inserted;
    const summaryRow = Array.isArray(summary) ? summary[0] : summary;
    const emailResult = await sendHappyHourConfirmationEmail({
      to: normalizedEmail,
      fullName: body.fullName.trim(),
      signupStatus: signupRow?.status ?? "confirmed",
      rsvpGroup: body.rsvpGroup
    });

    if (emailResult.error) {
      console.error(emailResult.error);
    }

    return NextResponse.json({
      ok: true,
      signupStatus: signupRow?.status ?? "confirmed",
      confirmedCount: Number(summaryRow?.confirmed_count ?? 0),
      waitlistCount: Number(summaryRow?.waitlist_count ?? 0),
      confirmedAttendeeCount: Number(summaryRow?.confirmed_attendee_count ?? 0),
      waitlistAttendeeCount: Number(summaryRow?.waitlist_attendee_count ?? 0),
      confirmedStaffCount: Number(summaryRow?.confirmed_staff_count ?? 0),
      waitlistStaffCount: Number(summaryRow?.waitlist_staff_count ?? 0),
      confirmationEmailSent: emailResult.sent
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
