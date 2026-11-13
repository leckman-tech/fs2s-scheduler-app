"use client";

import { useState } from "react";

export function FirstAttendeePasswordForm(){
 const [password,setPassword]=useState("");
 const [confirmation,setConfirmation]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState<string|null>(null);

 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  setError(null);
  if(password.length<12 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)){
   setError("Use at least 12 characters, including letters and numbers.");return;
  }
  if(password!==confirmation){setError("The passwords do not match.");return;}
  setBusy(true);
  try{
   const response=await fetch("/api/attendee/first-login",{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})
   });
   const result=await response.json();
   if(!response.ok || !result.ok){
    setError(result.error||"Could not update the password. Please try again.");return;
   }
   setPassword("");setConfirmation("");
   window.location.assign("/attendee/briefings");
  }catch{setError("Connection problem. Please try again.");}
  finally{setBusy(false);}
 }
 return <form className="panel form-grid" onSubmit={submit}>
  <div className="field"><label htmlFor="first-login-password">Your new password</label>
   <input type="password" id="first-login-password" autoComplete="new-password"
    value={password} onChange={e=>setPassword(e.target.value)} minLength={12} required />
   <p className="field-hint">Use at least 12 characters, including letters and numbers. Choose something only you know.</p>
  </div>
  <div className="field"><label htmlFor="first-login-confirm">Confirm new password</label>
   <input type="password" id="first-login-confirm" autoComplete="new-password"
    value={confirmation} onChange={e=>setConfirmation(e.target.value)} minLength={12} required/>
  </div>
  {error?<div className="empty-state" role="alert">{error}</div>:null}
  <button type="submit" className="button" disabled={busy}>{busy?"Saving your password…":"Save password and open my briefings"}</button>
 </form>;
}
