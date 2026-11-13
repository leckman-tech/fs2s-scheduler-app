import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin=request.headers.get("origin");
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({error:"Unrecognized request"},{status:403});
  }
  const supabase=await createClient();
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if (authError || !user || !user.email_confirmed_at ||
      user.app_metadata?.fs2s_change_password_required !== true) {
    return NextResponse.json({error:"A verified temporary-login session is required"},{status:403});
  }
  let body:unknown;
  try {body=await request.json();}catch{return NextResponse.json({error:"Invalid request"},{status:400});}
  const password=(body as {password?:unknown})?.password;
  if(typeof password !== "string" || password.length < 12 ||
     password.length > 256 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json({error:"Use at least 12 characters including letters and numbers."},{status:400});
  }
  const {error:updateError}=await supabase.auth.updateUser({password});
  if(updateError) {
    return NextResponse.json({error:"Your password could not be updated. Please try again."},{status:422});
  }
  const admin=createAdminClient();
  if(!admin) return NextResponse.json({error:"Your password was changed, but account setup could not be completed. Contact the event organizer."},{status:503});
  const {error:flagError}=await admin.auth.admin.updateUserById(user.id,{
    app_metadata:{...(user.app_metadata??{}),fs2s_change_password_required:false}
  });
  if(flagError){
    return NextResponse.json({error:"Password updated, but your access flag could not be cleared. Please contact the organizer."},{status:503});
  }
  return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
}
