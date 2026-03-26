import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  FORM_HONEYPOT_FIELD,
  FORM_STARTED_AT_FIELD,
  guardPublicFormSubmission,
  validateHumanSubmission
} from "@/lib/anti-spam";
import { sendLobbyDayConfirmationEmail } from "@/lib/email";
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

    const { count: existingCount, error: existingError } = await supabase
      .from("lobby_day_signups")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail);

    if (existingError) {
      return NextResponse.json(
        {
          error: toPublicErrorMessage(existingError, {
            fallback: "We couldn't check the Lobby Day list right now. Please try again.",
            setupMessage:
              "Lobby Day sign-ups are not enabled in Supabase yet. Run the 012_lobby_day_signups.sql migration first.",
            setupFragments: ["lobby_day_signups", "schema cache"],
            duplicateMessage: "This email is already signed up for Lobby Day.",
            duplicateFragments: ["already signed up", "duplicate key", "unique"]
          })
        },
        { status: 400 }
      );
    }

    if ((existingCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "This email is already signed up for Lobby Day." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("lobby_day_signups").insert({
      full_name: body.fullName.trim(),
      email: normalizedEmail,
      phone: body.phone.trim(),
      organization: body.organization?.trim() || null
    });

    if (error) {
      return NextResponse.json(
        {
          error: toPublicErrorMessage(error, {
            fallback: "We couldn't save your Lobby Day sign-up just now. Please try again.",
            setupMessage:
              "Lobby Day sign-ups are not enabled in Supabase yet. Run the 012_lobby_day_signups.sql migration first.",
            setupFragments: ["lobby_day_signups", "schema cache"],
            duplicateMessage: "This email is already signed up for Lobby Day.",
            duplicateFragments: ["already signed up", "duplicate key", "unique"]
          })
        },
        { status: 400 }
      );
    }

    const { count, error: summaryError } = await supabase
      .from("lobby_day_signups")
      .select("id", { count: "exact", head: true });

    if (summaryError) {
      console.error(summaryError);
      return NextResponse.json(
        { error: "Your Lobby Day sign-up was saved, but the live count could not refresh right away." },
        { status: 500 }
      );
    }

    const emailResult = await sendLobbyDayConfirmationEmail({
      to: normalizedEmail,
      fullName: body.fullName.trim()
    });

    if (emailResult.error) {
      console.error(emailResult.error);
    }

    return NextResponse.json({
      ok: true,
      totalCount: Number(count ?? 0),
      confirmationEmailSent: emailResult.sent
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "We couldn't save your Lobby Day sign-up right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
