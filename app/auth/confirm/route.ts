import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  // Only one-time signup links generated for this event are accepted.
  if (!tokenHash || type !== "signup" || tokenHash.length > 1024) {
    return NextResponse.redirect(new URL(
      "/attendee/login?error=This%20setup%20link%20is%20invalid", request.url
    ));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "signup"
  });

  if (error) {
    return NextResponse.redirect(new URL(
      "/attendee/login?error=This%20setup%20link%20has%20expired%20or%20has%20already%20been%20used",
      request.url
    ));
  }
  const response = NextResponse.redirect(new URL("/attendee/first-login", request.url));
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
