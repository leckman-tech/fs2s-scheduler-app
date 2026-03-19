import { NextResponse } from "next/server";
import type { SessionCategory } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { displaySessionTitle, escapeCsv } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    let query = supabase
      .from("feedback")
      .select(
        "id,session_id,rating,most_useful,improvements,attend_future,created_at,sessions(title,final_title,placeholder_code,category)"
      );

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    const rows = [
      ["id", "session_title", "rating", "most_useful", "improvements", "attend_future", "created_at"],
      ...(data ?? []).map((entry) => [
        entry.id,
        Array.isArray(entry.sessions)
          ? entry.sessions[0]
            ? displaySessionTitle({
                title: entry.sessions[0].title,
                final_title: entry.sessions[0].final_title,
                placeholder_code: entry.sessions[0].placeholder_code,
                category: entry.sessions[0].category as SessionCategory
              })
            : ""
          : entry.sessions
            ? displaySessionTitle({
                title: entry.sessions.title,
                final_title: entry.sessions.final_title,
                placeholder_code: entry.sessions.placeholder_code,
                category: entry.sessions.category as SessionCategory
              })
            : "",
        entry.rating,
        entry.most_useful,
        entry.improvements,
        entry.attend_future,
        entry.created_at
      ])
    ];

    const csv = rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fs2s-feedback${sessionId ? `-${sessionId}` : ""}.csv"`
      }
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "Unexpected error", { status: 500 });
  }
}
