import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FirstAttendeePasswordForm } from "@/components/first-attendee-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
 title:"Complete Your Attendee Account | FS2S",
 description:"Set your private password to finish activating your FS2S attendee account.",
 path:"/attendee/first-login",noIndex:true
});

export default async function FirstAttendeeLoginPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if (!user) redirect("/attendee/login");
 if (!user.email_confirmed_at) redirect("/attendee/login");
 if (user.app_metadata?.fs2s_change_password_required !== true) redirect("/attendee");
 return <main className="container stack" style={{maxWidth:"680px"}}>
  <section className="hero-card">
   <p className="eyebrow">FINAL ACCOUNT SETUP</p>
   <h1>Choose your own password</h1>
   <p>Your email has been verified. Before you open your FS2S congressional briefings, please replace the temporary password you were given.</p>
   <p className="muted">This step is required once. Your new password is private to you and will not be shown to other attendees or event staff.</p>
  </section>
  <FirstAttendeePasswordForm />
 </main>;
}