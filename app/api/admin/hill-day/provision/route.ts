import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Candidate = {
  email: string;
  name: string;
  delegation: string | null;
  accountExists: boolean;
  isAssigned: boolean;
  driveReady: boolean;
};

function normalizedEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function authorizedClients() {
  const session = await createClient();
  const { data: { user }, error: authError } = await session.auth.getUser();
  if (authError || !user || !user.email_confirmed_at) return null;
  const { data: profile } = await session.from("profiles")
    .select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return null;
  const admin = createAdminClient();
  if (!admin) return null;
  return { admin };
}

async function candidates(admin: NonNullable<ReturnType<typeof createAdminClient>>) {
  const { data: registrations, error: regError } = await admin.from("lobby_day_signups")
    .select("full_name,email").not("email", "is", null).order("created_at");
  if (regError) throw new Error("Cannot read Hill Day registrations");
  const { data: assignments, error: assignmentError } = await admin.from("delegation_assignments")
    .select("email,participant_name,delegation_id,drive_access_granted,status");
  if (assignmentError) throw new Error("Cannot read delegation assignments");

  const byEmail = new Map<string, Candidate>();
  for (const row of registrations ?? []) {
    const email = normalizedEmail(row.email);
    if (!validEmail(email)) continue;
    byEmail.set(email, {email, name: String(row.full_name || email).trim(),
      delegation:null, accountExists:false, isAssigned:false,driveReady:false});
  }
  for (const row of assignments ?? []) {
    const email = normalizedEmail(row.email);
    if (!validEmail(email) || row.status === "held") continue;
    const prev = byEmail.get(email);
    byEmail.set(email, {
      email,
      name: prev?.name || String(row.participant_name || email).trim(),
      delegation: row.delegation_id,
      accountExists:false, isAssigned:true,
      driveReady: Boolean(row.drive_access_granted)
    });
  }

  const users: Array<{email?:string | null}> = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({page,perPage:1000});
    if (error) throw new Error("Cannot verify existing attendee accounts");
    users.push(...(data.users ?? []));
    if ((data.users ?? []).length < 1000) break;
  }
  const existing = new Set(users.map(x => normalizedEmail(x.email)).filter(Boolean));
  const all = Array.from(byEmail.values()).sort((a,b) =>
    a.name.localeCompare(b.name, "en", {sensitivity:"base"}));
  return all.map(x=>({...x,accountExists:existing.has(x.email)}));
}

function noCache<T>(payload: T, status=200) {
  return NextResponse.json(payload, {status,headers:{
    "Cache-Control":"no-store, private", "Pragma":"no-cache",
    "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer"
  }});
}

export async function GET() {
  const clients = await authorizedClients();
  if (!clients) return noCache({error:"Admin login required"},403);
  try {
    const people = await candidates(clients.admin);
    return noCache({people,
      counts:{eligible:people.length,existing:people.filter(p=>p.accountExists).length,
        toProvision:people.filter(p=>!p.accountExists).length,
        assigned:people.filter(p=>p.isAssigned).length}});
  } catch {
    return noCache({error:"Could not retrieve registration and account status"},503);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  // Browser-only admin action, same origin, no cross-site credential provisioning.
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    return noCache({error:"Unrecognized request origin"},403);
  }
  const clients = await authorizedClients();
  if (!clients) return noCache({error:"Admin login required"},403);
  let body: unknown;
  try { body = await request.json(); } catch { return noCache({error:"Invalid request"},400); }
  const emails = (body as {emails?:unknown})?.emails;
  if (!Array.isArray(emails) || emails.length < 1 || emails.length > 8 ||
      emails.some(e=>typeof e !== "string" || !validEmail(normalizedEmail(e))) ||
      new Set(emails.map(normalizedEmail)).size !== emails.length) {
    return noCache({error:"Submit up to eight unique, valid participant addresses per batch"},400);
  }

  let permitted: Candidate[];
  try { permitted = await candidates(clients.admin); }
  catch { return noCache({error:"Unable to verify authorized participant list"},503); }
  const lookup = new Map(permitted.map(x=>[x.email,x]));
  if (emails.some(e=>!lookup.has(normalizedEmail(e)))) {
    return noCache({error:"One or more emails are not on the registration/assignment roster"},403);
  }

  const outcomes: Array<{
    email:string;name:string;delegation:string|null;
    status:"created"|"existing"|"error";
    temporaryPassword?:string;verificationUrl?:string;message?:string;
  }> = [];
  for (const raw of emails) {
    const email = normalizedEmail(raw);
    const person=lookup.get(email)!;
    if (person.accountExists) {
      outcomes.push({email,name:person.name,delegation:person.delegation,
        status:"existing",message:"Existing account preserved; use current password or reset it."});
      continue;
    }
    const temporaryPassword = randomBytes(18).toString("base64url") + "!a9A";
    const { data, error } = await clients.admin.auth.admin.generateLink({
      type:"signup",email,password:temporaryPassword,
      options:{
        redirectTo: SITE_URL + "/auth/callback?next=/attendee/first-login",
        data:{full_name:person.name,portal_type:"attendee",conference_role:"attendee"}
      }
    });
    if (error || !data?.user?.id || !data?.properties?.action_link) {
      outcomes.push({email,name:person.name,delegation:person.delegation,
        status:"error",message:"Could not generate initial credentials; retry through the admin page."});
      continue;
    }

    const { error: flagError } = await clients.admin.auth.admin.updateUserById(data.user.id,{
      app_metadata:{...(data.user.app_metadata ?? {}),fs2s_change_password_required:true}
    });
    if (flagError) {
      outcomes.push({email,name:person.name,delegation:person.delegation,
        status:"error",message:"Account created but password-change protection needs review. Do not send credentials."});
      continue;
    }
    outcomes.push({email,name:person.name,delegation:person.delegation,
      status:"created",temporaryPassword,verificationUrl:data.properties.action_link});
  }
  return noCache({results:outcomes});
}
