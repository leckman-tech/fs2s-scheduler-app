import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function respond(data:unknown,status=200){
  return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store, private","Referrer-Policy":"no-referrer"}});
}

export async function POST(request: NextRequest) {
  const origin=request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return respond({error:"Unrecognized request"},403);
  }
  const supabase=await createClient();
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError||!user?.email_confirmed_at||
     user.app_metadata?.fs2s_change_password_required!==true)
    return respond({error:"A verified temporary-login session is required"},403);

  const body=await request.json().catch(()=>null);
  const password=body?.password;
  if(typeof password!=="string"||password.length<12||password.length>256||
     !/[A-Za-z]/.test(password)||!/[0-9]/.test(password))
    return respond({error:"Use at least 12 characters including letters and numbers."},400);

  const {data:{session}}=await supabase.auth.getSession();
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apikey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!apikey||!session?.access_token)
    return respond({error:"Your login session expired. Verify your email again or sign back in."},401);

  try{
    const result=await fetch(url+"/functions/v1/hill-day-first-login",{
      method:"POST",
      headers:{
        Authorization:"Bearer "+session.access_token,
        apikey,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({password}),
      cache:"no-store"
    });
    const message=await result.json().catch(()=>null);
    if(!result.ok)return respond({error:message?.error||"Unable to finish password setup."},result.status);
    if(!message?.ok)return respond({error:"Account setup has not finished. Please try again."},503);
    return respond({ok:true});
  }catch{
    return respond({error:"Unable to reach account setup service. Please try again."},503);
  }
}
