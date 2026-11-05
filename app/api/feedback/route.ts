import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 12_000) {
      return NextResponse.json({ error: "Feedback is too long." }, { status: 413 });
    }
    const body = (await request.json()) as {
      sessionId?: string;
      rating?: number;
      mostUseful?: string;
      improvements?: string;
      attendFuture?: boolean;
    };

    if (
      !body.sessionId ||
      !body.rating ||
      body.rating < 1 ||
      body.rating > 5 ||
      !Number.isInteger(body.rating) ||
      typeof body.mostUseful !== "string" ||
      typeof body.improvements !== "string" ||
      body.mostUseful.length > 3000 ||
      body.improvements.length > 3000 ||
      !body.mostUseful ||
      !body.improvements
    ) {
      return NextResponse.json({ error: "Invalid feedback payload" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: "Feedback is temporarily unavailable." }, { status: 500 });
    }

    const supabase = createSupabaseClient(url, key);
    const { error } = await supabase.from("feedback").insert({
      session_id: body.sessionId,
      rating: body.rating,
      most_useful: body.mostUseful,
      improvements: body.improvements,
      attend_future: Boolean(body.attendFuture)
    });

    if (error) {
      console.error("Feedback storage failed", error.code);
      return NextResponse.json({ error: "We could not save your feedback. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "We could not process your feedback. Please try again." },
      { status: 500 }
    );
  }
}
