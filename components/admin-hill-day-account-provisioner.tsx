"use client";

import { useEffect, useMemo, useState } from "react";

type Candidate = {
  email: string; name: string; delegation: string | null;
  accountExists: boolean; isAssigned: boolean; driveReady: boolean;
  emailVerified?:boolean; requiresPasswordChange?:boolean;
};
type Credential = {
  email: string; name: string; delegation: string | null;
  status: "created" | "existing" | "error";
  temporaryPassword?: string; verificationUrl?: string; message?: string;
  emailDelivery?: "sent" | "failed" | "skipped" | "not_sent"; emailError?: string;
};
type Preview = {
  people: Candidate[];
  counts: {eligible:number;existing:number;toProvision:number;assigned:number;
    verified?:number; firstLoginPending?:number; excludedUnassignedRegistrations?:number;};
};
const LOGIN = "https://fs2shub.com/attendee/login";
const RESET = "https://fs2shub.com/attendee/forgot-password";
const TEST_EMAIL = "levi.eckman+fs2s-test@gmail.com";

function csvEscape(value: string) {
  // Keep paragraph breaks inside quoted CSV cells, for copy-ready emails.
  // Prefix spreadsheet formula-like values without invoking replacement $ expressions.
  const clean = value.replace(/^[=\-+@\t\r]/, first => "'" + first)
    .replace(/\r\n?/g, "\n");
  return '"' + clean.replace(/"/g, '""') + '"';
}

export function AdminHillDayAccountProvisioner() {
  const [preview,setPreview] = useState<Preview|null>(null);
  const [busy,setBusy] = useState(false);
  const [ready,setReady] = useState<Credential[]>([]);
  const [progress,setProgress] = useState(0);
  const [problem,setProblem] = useState<string|null>(null);
  const [filter,setFilter] = useState("");
  const [includeExisting,setIncludeExisting] = useState(false);
  const [pilotMessage,setPilotMessage] = useState<string|null>(null);
  const [pilotEmail,setPilotEmail] = useState(TEST_EMAIL);

  async function loadPreview() {
    const r=await fetch("/api/admin/hill-day/provision", {cache:"no-store"});
    const data = await r.json().catch(() => null) as (Preview & {error?:string}) | null;
    if (!r.ok) {
      throw new Error(data?.error || "The registration service is unavailable. Please retry.");
    }
    if (!data || !Array.isArray(data.people)) throw new Error("Unexpected registration response. Please retry.");
    setPreview(data);
    return data;
  }

  useEffect(() => {
    let ignore=false;
    fetch("/api/admin/hill-day/provision", {cache:"no-store"})
      .then(async r => {
        const data = await r.json().catch(() => null) as (Preview & {error?: string}) | null;
        if (!r.ok) throw new Error(data?.error || "Couldn't load the registration list.");
        if (!data || !Array.isArray(data.people)) throw new Error("Unexpected registration response.");
        return data;
      })
      .then(data => {if (!ignore) {setPreview(data);setProblem(null);}})
      .catch(error => {
        if (!ignore) setProblem(error instanceof Error?error.message:"Couldn't retrieve the registration list.");
      });
    return ()=>{ignore=true;};
  },[]);

  const filtered = useMemo(() => (preview?.people ?? [])
    .filter(p=>(p.name+" "+p.email+" "+(p.delegation??"")).toLowerCase()
      .includes(filter.toLowerCase())),[preview,filter]);

  async function provisionPilot(){
    if(!preview||busy) return;
    const candidate=preview.people.find(p=>p.email===TEST_EMAIL&&!p.accountExists);
    if(!candidate){setProblem("Select an eligible participant without an existing login.");return;}
    setProblem(null);setPilotMessage(null);setBusy(true);
    try{
      const response=await fetch("/api/admin/hill-day/provision",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({emails:[candidate.email]})
      });
      const body=await response.json().catch(()=>null);
      if(!response.ok||!Array.isArray(body?.results)||body.results.length!==1){
        throw new Error(body?.error||"Could not create the pilot account.");
      }
      const outcome=body.results[0] as Credential;
      setReady(prior=>[...prior.filter(p=>p.email!==outcome.email),outcome]);
      await loadPreview();
      if(outcome.status==="created") {
        setPilotMessage(body.testEmailSent === true
          ? "Test login created and invitation emailed to the Gmail alias. Check your Gmail inbox, verify the address and choose a new password. Refresh this page afterward."
          : "Test login created, but automatic email delivery was not confirmed. Download the private credential CSV and send only the test row to your own Gmail.");
      }
      if(outcome.status==="error")setProblem("Pilot account needs review. Do not send its invitation.");
    }catch(error){
      setProblem(error instanceof Error?error.message:"Pilot account setup failed.");
    }finally{setBusy(false);}
  }

  async function provision() {
    if (!preview || busy || !pilotComplete) return;
    if (!window.confirm("Create accounts and EMAIL individual portal instructions to ALL eligible November 18 participants now? This sends real emails, not drafts. Existing verified accounts will receive login instructions; passwords won't change.")) return;
    setBusy(true);setProblem(null);setProgress(0);
    const created: Credential[] = [...ready];
    try {
      const latest=await loadPreview();
      const remaining=latest.people.filter(x=>!x.accountExists&&x.email!==TEST_EMAIL);
      for(let i=0;i<remaining.length;i+=8) {
        const chunk=remaining.slice(i,i+8);
        const response=await fetch("/api/admin/hill-day/provision",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({emails:chunk.map(p=>p.email),sendInvitations:true})
        });
        const body=await response.json().catch(()=>null);
        if (!response.ok || !Array.isArray(body?.results)) {
          throw new Error(body?.error||
            "A batch failed. Download the credentials already generated before retrying.");
        }
        const updated=body.results as Credential[];
        for(const outcome of updated){
          const index=created.findIndex(p=>p.email===outcome.email);
          if(index>=0)created[index]=outcome;
          else created.push(outcome);
        }
        setReady([...created]);
        setProgress(Math.min(i+chunk.length,remaining.length));
      }
      const existing=latest.people.filter(x=>x.accountExists&&x.email!==TEST_EMAIL);
      for(let i=0;i<existing.length;i+=8){
        const chunk=existing.slice(i,i+8);
        const response=await fetch("/api/admin/hill-day/provision",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({emails:chunk.map(p=>p.email),sendInvitations:true})
        });
        const body=await response.json().catch(()=>null);
        if(!response.ok||!Array.isArray(body?.results))throw new Error(body?.error||"Existing account emails could not be completed.");
        for(const outcome of body.results as Credential[]){
          const index=created.findIndex(x=>x.email===outcome.email);
          if(index>=0)created[index]=outcome;else created.push(outcome);
        }
        setReady([...created]);
      }
      await loadPreview();
    } catch(e) {
      setProblem(e instanceof Error ? e.message : "Provisioning did not finish.");
    } finally { setBusy(false); }
  }

  function download() {
    if (!preview || !ready.length) return;
    const existing: Credential[]=includeExisting ? preview.people
      .filter(x=>x.accountExists && !ready.some(y=>y.email===x.email))
      .map(x=>({email:x.email,name:x.name,delegation:x.delegation,status:"existing",
        message:"Existing login preserved. Send login URL and forgot-password link, not a new password."}))
      : [];
    const merged=[...ready,...existing].sort((a,b)=>a.name.localeCompare(b.name));
    const headers=["Person","Email","Delegation","Account Status","Email Delivery","Private PDF access","One-Time Temporary Password",
      "Email Verification Link","Login Page","Reset Existing Password","Individual Email Subject",
      "Individual Email Body","Private Handling Note"];
    const data=merged.map(row=>{
      const firstName=row.name.trim().split(/\s+/)[0]||"there";
      const created=row.status==="created";
      const candidate=preview.people.find(person=>person.email===row.email);
      const pdfStatus=!candidate?.isAssigned ? "Unassigned" :
        candidate.driveReady ? "Shared privately" : "Manual PDF delivery needed";
      const consentNotice=row.delegation==="D03"
        ? "\n\nFor Black Swan Academy youth, attendance is still subject to parental consent. Your portal login is not confirmation of approval." : "";
      const materialsNotice=pdfStatus==="Manual PDF delivery needed"
        ? "Your delegation schedule is available, but the organizers will provide your private briefing PDF separately."
        : "Your delegation's assigned congressional briefing is available through your verified attendee portal.";
      const subject=row.status==="error" ? "HOLD — account needs review" : "Your FS2S Advocacy Hill Day attendee portal";
      const emailBody=created
        ? `Hi ${firstName},

We've set up your FS2S attendee portal for our November 18 Advocacy Hill Day. ${materialsNotice}${consentNotice}

First, verify your email using your individual link:
${row.verificationUrl||"[Verification link unavailable — contact the organizer]"}

Your login email: ${row.email}
Your temporary password: ${row.temporaryPassword||"[Password unavailable]"}

After verifying your email, sign in at ${LOGIN}. You'll be asked to choose a new password before you can see your group's materials.

Please keep your login details to yourself. Our morning program begins at Maya at 9:45–10:00 AM, with training at 10:00, lunch at 10:45, and buses scheduled to depart at 11:15.

Looking forward to seeing you on November 18!
Levi W. Eckman
FS2S Convening Director`
        : `Hi ${firstName},

Your FS2S attendee account is already set up, so you can continue using your existing password for November 18 Advocacy Hill Day.

Sign in at ${LOGIN}. If you can't remember your password, you can reset it here: ${RESET}.

${materialsNotice}${consentNotice}

Please review your materials before Wednesday. We'll gather at Maya at 9:45–10:00 AM and begin training at 10:00.

Thanks!
Levi W. Eckman
FS2S Convening Director`;
      return [
        row.name,row.email,row.delegation||"Not yet assigned",row.status,row.emailDelivery||"not sent",pdfStatus,
        created ? row.temporaryPassword||"" : "",
        created ? row.verificationUrl||"" : "",
        LOGIN,RESET,subject,
        row.status==="error" ? "" : emailBody,
        row.status==="error" ? "DO NOT SEND — account setup failed; individual follow-up required." :
        created
          ? "Send only to this person. Change required on first login; never share the whole CSV."
          : row.message||"Existing account; credentials not changed."
      ];
    });
    const csv=[headers,...data].map(row=>row.map(v=>csvEscape(String(v))).join(",")).join("\r\n");
    const blob=new Blob(["\uFEFF",csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download="FS2S_Hill_Day_Private_Account_Credentials_2026-11-13.csv";
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  const totalNew=ready.filter(x=>x.status==="created").length;
  const failed=ready.filter(x=>x.status==="error");
  const emailed=ready.filter(x=>x.emailDelivery==="sent"&&x.email!==TEST_EMAIL).length;
  const undelivered=ready.filter(x=>x.emailDelivery==="failed"||x.status==="error");
  const testAccount=preview?.people.find(p=>p.email===TEST_EMAIL);
  const pilotComplete=Boolean(testAccount?.accountExists && testAccount.emailVerified &&
    !testAccount.requiresPasswordChange && testAccount.driveReady);

  return <div className="stack">
    <section className="panel" style={{borderTop:"4px solid #aa1e35"}}>
      <p className="eyebrow">PRIVATE · ADMIN ONLY</p>
      <h2>Prepare participant accounts</h2>
      <p>This list contains only currently assigned November 18 participants and authorized coordinating contacts. April registrations, removed Scholars, and people awaiting group placement are excluded from the invitation batch. Each new account receives a unique temporary password and email verification link, then must change its password before opening its assigned briefing.</p>
      <p><strong>Existing accounts are left untouched.</strong> Do not reset someone else's password. Their instructions will use the existing login and password-reset pages.</p>
      {preview ? <div className="hero-meta">
        <span className="hero-pill">{preview.counts.eligible} eligible emails</span>
        <span className="hero-pill">{preview.counts.existing} existing accounts</span>
        <span className="hero-pill">{preview.counts.toProvision} eligible new accounts</span>
        <span className="hero-pill">{preview.counts.assigned} delegated email records</span>
        <span className="hero-pill">{preview.counts.verified??0} verified accounts</span>
        <span className="hero-pill">{preview.counts.excludedUnassignedRegistrations??0} older/unassigned emails excluded</span>
      </div> : <p>Loading the current roster…</p>}
      <div className="field" style={{marginTop:"1.1rem",maxWidth:"640px"}}>
        <label htmlFor="hill-day-pilot-email"><strong>Step 1: Test the new-account process with your Gmail alias</strong></label>
        <select id="hill-day-pilot-email" value={pilotEmail}
          onChange={event=>setPilotEmail(event.target.value)} disabled={busy}>
          <option value={TEST_EMAIL}>{TEST_EMAIL} — D05 test-only</option>
        </select>
        <p className="muted">This creates only the test account and emails its verification link and temporary password to your own Gmail address. It does not create or contact real participants. The test account is not counted as an attendee.</p>
        <button type="button" className="button-secondary"
          disabled={busy||!!testAccount?.accountExists} onClick={provisionPilot}>Create and email my test login</button>
        <button type="button" className="button-secondary" disabled={busy} onClick={async()=>{
          try{await loadPreview();setProblem(null);}catch(e){setProblem(e instanceof Error?e.message:"Could not refresh test status.");}
        }}>Refresh test status</button>
        {pilotMessage ? <p role="status">{pilotMessage}</p> : null}
        <p role="status"><strong>Test status:</strong> {!testAccount?.accountExists?"Account not created":!testAccount.emailVerified?"Verify the test email":testAccount.requiresPasswordChange?"Complete first-login password change":!testAccount.driveReady?"Resolve test PDF permission":"Email verified, password changed and PDF permission granted"}</p>
      </div>
      <div className="hero-actions" style={{marginTop:"1rem"}}>
        {!pilotComplete ? <p className="muted">Bulk provisioning is locked until the test email is verified and its required password change is completed. Test a D05 briefing before sending real invitations.</p> : null}
        <button type="button" className="button" onClick={provision}
          disabled={busy || !preview || preview.counts.toProvision===0 || !pilotComplete}>
          {busy ? "Creating accounts and sending emails…" : "Step 2: Create accounts and email participants"}
        </button>
        <button type="button" className="button-secondary" onClick={download}
          disabled={!ready.length || busy}>
          Download private credential CSV
        </button>
      </div>
      {busy ? <p role="status">Processed {progress} of {preview?.counts.toProvision ?? 0} new addresses. Keep this page open.</p> : null}
      {ready.length ? <p role="status">
        {totalNew} new accounts provisioned. {emailed} individual emails sent. {undelivered.length} delivery/account issues.
        <strong> Download the CSV before leaving this page: passwords and activation links are shown only once.</strong>
      </p> : null}
      {problem ? <div className="empty-state" role="alert">
        <p>{problem}</p>
        <button type="button" className="button-secondary" disabled={busy}
          onClick={async()=>{setProblem(null);try{await loadPreview();}catch(err){
            setProblem(err instanceof Error?err.message:"Couldn't retrieve registration list.");
          }}}>Retry loading roster</button>
      </div> : null}
      <label style={{display:"flex",gap:"0.6rem",alignItems:"center",marginTop:"0.7rem"}}>
        <input type="checkbox" checked={includeExisting}
          onChange={e=>setIncludeExisting(e.target.checked)}/>
        Include existing accounts in the CSV (no password changes)
      </label>
      <p className="muted" style={{fontSize:"0.88rem"}}>
        No participant email is sent until you explicitly click Step 2 and confirm. The CSV is a private backup if an individual delivery fails. Never distribute the whole file or resend credentials unnecessarily. Delete the CSV after resolving any exceptions.
        Verification links can expire; if one does, use the account reset flow rather than reusing an old link.
      </p>
    </section>
    <section className="panel">
      <h2>Review who is eligible</h2>
      <p className="muted">An account is not attendance approval. The four interested Black Swan Academy youth in the current D03 roster still need parental consent; eight more are provisionally grouped but have no personal email/office assignment. Emily Daly is included as a Free Minds coordinating contact for Keonte Lewis, not as an extra attendee. Briefings appear after exact email matching and access permission checks.</p>
      <div className="field" style={{maxWidth:"480px"}}>
        <label htmlFor="account-filter">Search names, emails, or group IDs</label>
        <input id="account-filter" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter participants…" />
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{textAlign:"left"}}>Name</th><th style={{textAlign:"left"}}>Email</th>
            <th style={{textAlign:"left"}}>Delegation</th><th style={{textAlign:"left"}}>Account</th>
            <th style={{textAlign:"left"}}>Activation</th>
            <th style={{textAlign:"left"}}>PDF access</th>
          </tr></thead>
          <tbody>
          {filtered.map(row=><tr key={row.email}>
            <td style={{padding:"0.7rem 0.4rem"}}>{row.name}</td>
            <td style={{padding:"0.7rem 0.4rem",wordBreak:"break-word"}}>{row.email}</td>
            <td style={{padding:"0.7rem 0.4rem"}}>{row.delegation || "Pending"}</td>
            <td style={{padding:"0.7rem 0.4rem"}}>{row.accountExists?"Existing":"Not yet created"}</td>
            <td style={{padding:"0.7rem 0.4rem"}}>{!row.accountExists?"Not started":!row.emailVerified?"Verify email":row.requiresPasswordChange?"Change temporary password":"Verified"}</td>
            <td style={{padding:"0.7rem 0.4rem"}}>{!row.isAssigned?"No assignment":row.driveReady?"Granted":"Send PDF separately"}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </div>;
}
