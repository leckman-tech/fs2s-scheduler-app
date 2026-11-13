import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noCacheHeaders = {
  "Cache-Control": "no-store, private",
  "Pragma": "no-cache",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer"
};

function respond(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status, headers: noCacheHeaders });
}

async function proxy(request: NextRequest, method: "GET" | "POST") {
  if (method === "POST") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return respond({ error: "Unrecognized request origin. Refresh the page." }, 403);
    }
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.email_confirmed_at) {
    return respond({ error: "Please sign in with your verified administrator account." }, 401);
  }

  const { data: profile } = await supabase.from("profiles")
    .select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    return respond({ error: "Only site administrators can provision accounts." }, 403);
  }

  const { data: { session } } = await supabase.auth.getSession();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !session?.access_token) {
    return respond({error: "Your admin session needs refreshing. Sign out and sign in again."},401);
  }

  let body: string | undefined;
  if (method === "POST") {
    try {
      const data = await request.json();
      const emails = data?.emails;
      if (!Array.isArray(emails) || !emails.length || emails.length > 8) {
        return respond({error:"Select between one and eight registered participants."},400);
      }
      body = JSON.stringify({emails});
    } catch {
      return respond({error:"Invalid account request. Refresh the page."},400);
    }
  }

  try {
    // Supabase holds the service credential inside the protected Edge Function.
    // The website never needs a Vercel service-role secret.
    const response = await fetch(url + "/functions/v1/hill-day-admin-accounts", {
      method,
      headers: {
        "Authorization": "Bearer " + session.access_token,
        "apikey": key,
        ...(method === "POST" ? {"Content-Type":"application/json"} : {})
      },
      ...(body ? {body} : {}),
      cache: "no-store"
    });
    let data: Record<string, unknown>;
    try { data = await response.json(); }
    catch { return respond({error:"The account service sent an invalid response."},503); }
    if (!response.ok) {
      console.error("Hill Day admin accounts",response.status,String(data.code??data.error??"unknown"));
      return respond({
        error: typeof data.error === "string" ? data.error :
          "Could not load registration records. Please try again."
      },response.status);
    }
    return respond(data);
  } catch (error) {
    console.error("Hill Day admin accounts connection",error instanceof Error ? error.message:"unknown");
    return respond({error:"Unable to connect to the account service."},503);
  }
}

export async function GET(request: NextRequest) {
  return proxy(request,"GET");
}

export async function POST(request: NextRequest) {
  return proxy(request,"POST");
}
