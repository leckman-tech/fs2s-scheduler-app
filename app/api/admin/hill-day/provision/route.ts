import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendHillDayPilotAccountEmail, sendHillDayIndividualInvitation } from "@/lib/email";

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
  let mailParticipants = false;
  if (method === "POST") {
    try {
      const data = await request.json();
      const emails = data?.emails;
      if (!Array.isArray(emails) || !emails.length || emails.length > 8) {
        return respond({error:"Select between one and eight registered participants."},400);
      }
      mailParticipants = data?.sendInvitations === true;
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
    if (method === "POST") {
      const sentTo = JSON.parse(body ?? "{}").emails as string[] | undefined;
      const pilot = "levi.eckman+fs2s-test@gmail.com";
      if (sentTo?.length === 1 && sentTo[0].trim().toLowerCase() === pilot) {
        const outcomes = data.results as Array<{
          status:string;temporaryPassword?:string;verificationUrl?:string
        }> | undefined;
        const outcome = outcomes?.[0];
        if (outcome?.status === "created" &&
            outcome.temporaryPassword && outcome.verificationUrl) {
          const delivery = await sendHillDayPilotAccountEmail({
            to:pilot,temporaryPassword:outcome.temporaryPassword,
            verificationUrl:outcome.verificationUrl
          });
          data.testEmailSent = delivery.sent;
          if (!delivery.sent) {
            data.testEmailError = "Automatic test email was not sent. Save the credentials from this admin page and send the test invitation manually.";
          }
        }
      }
    }
    if (method === "POST" && mailParticipants) {
      const results = Array.isArray(data.results) ? data.results as Array<{
        email:string;name:string;delegation:string|null;status:string;
        temporaryPassword?:string;verificationUrl?:string
      }> : [];
      // Keep the participant's own Dxx briefing link private and accurate.
      const realEmails = results.map(x => x.email.trim().toLowerCase())
        .filter(x => x !== "levi.eckman+fs2s-test@gmail.com");
      const { data: shares } = await supabase.from("delegation_assignments")
        .select("email,drive_access_granted")
        .in("email",realEmails.length ? realEmails : ["no-recipients@example.invalid"]);
      const ready = new Set((shares ?? [])
        .filter(x => x.drive_access_granted === true)
        .map(x => x.email.toLowerCase()));
      // Send at most two at a time: avoid sender rate limits while avoiding a slow, serial 8-email batch.
      for(let i=0;i<results.length;i+=2){
        const slice=results.slice(i,i+2);
        await Promise.all(slice.map(async result => {
          if(result.email.toLowerCase()==="levi.eckman+fs2s-test@gmail.com"){
            (result as typeof result & {emailDelivery:string}).emailDelivery="skipped";
            return;
          }
          if(result.status !== "created" && result.status !== "existing"){
            (result as typeof result & {emailDelivery:string}).emailDelivery="not_sent";
            return;
          }
          const delivered=await sendHillDayIndividualInvitation({
            to:result.email,name:result.name,delegation:result.delegation,
            accountStatus:result.status,
            temporaryPassword:result.temporaryPassword,
            verificationUrl:result.verificationUrl,
            pdfReady:ready.has(result.email.toLowerCase())
          });
          (result as typeof result & {emailDelivery:string;emailError?:string}).emailDelivery=
            delivered.sent ? "sent" : "failed";
          if (!delivered.sent) (result as typeof result & {emailError?:string}).emailError=
            "Automatic email was not delivered. Use the one-time CSV and send this person's instructions manually.";
        }));
      }
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
