import Link from "next/link";
import { requireAdmin, getAdminAttendeeAccounts } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { setArchiveAccess } from "@/lib/actions/archive-access";

export default async function ArchiveAccessPage({searchParams}: {searchParams: Promise<{error?:string;success?:string}>}) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createClient();
  const [accounts, grantsResult] = await Promise.all([
    getAdminAttendeeAccounts(),
    supabase.from("archive_access_grants").select("user_id")
  ]);
  if (grantsResult.error) throw new Error("Archive permissions could not be loaded.");
  const approved = new Set((grantsResult.data ?? []).map((g) => g.user_id));
  return <div className="container stack">
    <section className="hero-card">
      <p className="eyebrow">ADMINISTRATOR · HISTORICAL CONTENT</p>
      <h1>2026 archive access</h1>
      <p>Grant or revoke access to historical FS2S convening materials, account by account. Everyone can create a Hill Day account, but no ordinary attendee can access these documents unless you approve them here.</p>
      <div className="hero-meta"><span className="hero-pill">{approved.size} individually approved</span><span className="hero-pill">{accounts.length} attendee accounts</span></div>
      <Link href="/admin/dashboard/accounts" className="button-secondary button-link">Back to Accounts</Link>
    </section>
    {params.success ? <p role="status" className="announcement">{params.success}</p> : null}
    {params.error ? <p role="alert" className="empty-state">{params.error}</p> : null}
    <section className="panel stack">
      <h2>Manage individual permissions</h2>
      <p className="muted">Choose Grant access to authorize a person's account, or Revoke access to remove authorization. Existing admin and legacy speaker/presenter privileges remain separate.</p>
      <div className="resource-list">
        {accounts.map(account => <article className="announcement" key={account.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
          <div><strong>{account.full_name}</strong><p className="muted" style={{margin:0}}>{account.email}</p><span className="chip">{approved.has(account.id) ? "Archive access granted" : "Hill Day only"}</span></div>
          <form action={setArchiveAccess}>
            <input type="hidden" name="user_id" value={account.id}/>
            <input type="hidden" name="action" value={approved.has(account.id) ? "revoke" : "grant"}/>
            <button className={approved.has(account.id) ? "button-secondary" : "button"} type="submit">{approved.has(account.id) ? "Revoke access" : "Grant archive access"}</button>
          </form>
        </article>)}
      </div>
    </section>
  </div>;
}
