import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
    };

    if (!body.fullName || !body.email || !body.phone || !body.rsvpGroup) {
      return NextResponse.json(
        { error: "Name, email, phone number, and RSVP type are required." },
        { status: 400 }
      );
    }

    const supabase = getPublicSupabaseClient();

    const { data: inserted, error } = await supabase.rpc("create_happy_hour_rsvp", {
      p_full_name: body.fullName,
      p_email: body.email,
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

    return NextResponse.json({
      ok: true,
      signupStatus: signupRow?.status ?? "confirmed",
      confirmedCount: Number(summaryRow?.confirmed_count ?? 0),
      waitlistCount: Number(summaryRow?.waitlist_count ?? 0),
      confirmedAttendeeCount: Number(summaryRow?.confirmed_attendee_count ?? 0),
      waitlistAttendeeCount: Number(summaryRow?.waitlist_attendee_count ?? 0),
      confirmedStaffCount: Number(summaryRow?.confirmed_staff_count ?? 0),
      waitlistStaffCount: Number(summaryRow?.waitlist_staff_count ?? 0)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
