import { NextResponse } from "next/server";

// Registration closed for November 18, 2026 FS2S Advocacy Hill Day.
// Keep the route explicit so older forms and direct POST requests cannot register anyone.
export async function POST() {
  return NextResponse.json(
    { error: "Registration for Advocacy Hill Day is now closed. If you have questions about an existing registration, contact LEckman@SeeForever.org." },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
