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
    };

    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const supabase = getPublicSupabaseClient();

    const normalizedEmail = body.email.trim().toLowerCase();
    const { count: existingCount, error: existingError } = await supabase
      .from("lobby_day_signups")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail);

    if (existingError) {
      return NextResponse.json(
        {
          error:
            existingError.message.includes("lobby_day_signups")
              ? "Lobby Day signups are not enabled in Supabase yet. Run the 012_lobby_day_signups.sql migration first."
              : existingError.message
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
          error:
            error.message.includes("lobby_day_signups")
              ? "Lobby Day signups are not enabled in Supabase yet. Run the 012_lobby_day_signups.sql migration first."
              : error.message
        },
        { status: 400 }
      );
    }

    const { count, error: summaryError } = await supabase
      .from("lobby_day_signups")
      .select("id", { count: "exact", head: true });

    if (summaryError) {
      return NextResponse.json({ error: summaryError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      totalCount: Number(count ?? 0)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
