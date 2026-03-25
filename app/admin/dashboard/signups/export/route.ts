import { NextResponse } from "next/server";
import type { SessionCategory } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { displaySessionTitle, escapeCsv } from "@/lib/utils";

type SignupSessionRow = {
  title: string;
  final_title: string | null;
  placeholder_code: string | null;
  category: string;
};

function sessionLabel(session: SignupSessionRow | SignupSessionRow[] | null | undefined) {
  if (!session) {
    return "";
  }

  const value = Array.isArray(session) ? session[0] : session;

  if (!value) {
    return "";
  }

  return displaySessionTitle({
    title: value.title,
    final_title: value.final_title,
    placeholder_code: value.placeholder_code,
    category: value.category as SessionCategory
  });
}

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
      .from("session_signups")
      .select(
        "id,session_id,full_name,email,phone,organization,status,created_at,sessions(title,final_title,placeholder_code,category)"
      );

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    const rows = [
      ["id", "session_title", "full_name", "email", "phone", "organization", "status", "created_at"],
      ...(data ?? []).map((entry) => [
        entry.id,
        sessionLabel(entry.sessions as SignupSessionRow | SignupSessionRow[] | null | undefined),
        entry.full_name,
        entry.email,
        entry.phone,
        entry.organization,
        entry.status,
        entry.created_at
      ])
    ];

    const csv = rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fs2s-signups${sessionId ? `-${sessionId}` : ""}.csv"`
      }
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "Unexpected error", {
      status: 500
    });
  }
}
