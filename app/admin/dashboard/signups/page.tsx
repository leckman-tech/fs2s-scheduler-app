import Link from "next/link";
import { deleteLobbyDaySignup, updateLobbyDaySignup } from "@/lib/actions/admin";
import { getAdminLobbyDaySignups } from "@/lib/queries";
import { formatTimestamp } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSignupsPage({ searchParams }: { searchParams: Promise<{error?:string}> }) {
 const params = await searchParams;
 const records = await getAdminLobbyDaySignups();
 return <div className="stack">
  {params.error ? <div className="empty-state">{params.error}</div> : null}
  <section className="hero-card">
   <p className="eyebrow">CURRENT EVENT · NOVEMBER 18, 2026</p>
   <h1>Advocacy Hill Day registrations</h1>
   <p>View and manage registrations for the upcoming Hill Day. All 19 registrations are included, including those submitted earlier in 2026.</p>
   <div className="hero-meta">
    <span className="hero-pill">{records.length} registration{records.length===1?"":"s"}</span>
    <span className="hero-pill">{Math.max(125-records.length,0)} to 125-person target</span>
    <Link className="button-secondary button-link" href="/admin/dashboard/signups/export?type=lobby-day">Export November 18 registrations (CSV)</Link>
   </div>
  </section>
  <section className="panel">
   <div className="section-heading"><div><h2>Registered participants</h2><p className="muted">Interest registrations, not confirmed attendance. Most recent first.</p></div></div>
   <div className="resource-list">{records.length ? records.map(signup => <article key={signup.id} className="announcement">
    <strong>{signup.full_name}</strong><div className="muted">Registered {formatTimestamp(signup.created_at)}</div>
    <div className="detail-list"><div><strong>Email</strong><span className="muted">{signup.email}</span></div><div><strong>Phone</strong><span className="muted">{signup.phone || "Not provided"}</span></div><div><strong>Organization</strong><span className="muted">{signup.organization || "Not provided"}</span></div></div>
    <details className="admin-edit-details"><summary>Edit or remove</summary>
     <form action={updateLobbyDaySignup} className="form-grid admin-edit-details__form"><input type="hidden" name="id" value={signup.id}/>
      <div className="form-grid form-grid--two"><div className="field"><label htmlFor={`name-${signup.id}`}>Full name</label><input id={`name-${signup.id}`} name="full_name" defaultValue={signup.full_name} required/></div><div className="field"><label htmlFor={`email-${signup.id}`}>Email</label><input id={`email-${signup.id}`} name="email" type="email" defaultValue={signup.email} required/></div></div>
      <div className="form-grid form-grid--two"><div className="field"><label htmlFor={`phone-${signup.id}`}>Phone</label><input id={`phone-${signup.id}`} name="phone" defaultValue={signup.phone??""}/></div><div className="field"><label htmlFor={`org-${signup.id}`}>Organization</label><input id={`org-${signup.id}`} name="organization" defaultValue={signup.organization??""}/></div></div>
      <button className="button-secondary" type="submit">Save changes</button>
     </form><form action={deleteLobbyDaySignup} className="admin-actions"><input type="hidden" name="id" value={signup.id}/><button type="submit" className="button-danger">Remove registration</button></form>
    </details>
   </article>) : <div className="empty-state">No registrations for the November 18 event yet.</div>}</div>
  </section>
 </div>;
}
