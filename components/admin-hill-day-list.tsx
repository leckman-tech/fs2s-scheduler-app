"use client";

import { useMemo, useState } from "react";
import { deleteLobbyDaySignup, updateLobbyDaySignup } from "@/lib/actions/admin";

type Registration = {
 id:string; full_name:string; email:string; phone:string|null; organization:string|null; created_at:string;
};

export function AdminHillDayList({ records }: { records:Registration[] }) {
 const [search,setSearch]=useState("");
 const [sort,setSort]=useState("newest");
 const filtered=useMemo(()=>{
  const term=search.trim().toLocaleLowerCase();
  const results=records.filter(r=>[r.full_name,r.email,r.phone,r.organization].some(v=>(v??"").toLocaleLowerCase().includes(term)));
  return [...results].sort((a,b)=>sort==="name"?a.full_name.localeCompare(b.full_name):sort==="oldest"?a.created_at.localeCompare(b.created_at):b.created_at.localeCompare(a.created_at));
 },[records,search,sort]);
 return <section className="panel hill-admin-list">
  <div className="hill-admin-toolbar">
   <div><h2>Registrations</h2><p className="muted">{filtered.length} of {records.length} shown · Registration indicates interest, not confirmed attendance</p></div>
   <div className="hill-admin-controls">
    <label className="hill-admin-search"><span className="sr-only">Search registrations</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, organization…" /></label>
    <label className="hill-admin-sort"><span className="sr-only">Sort registrations</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option></select></label>
   </div>
  </div>
  <div className="hill-admin-table-scroll"><table className="hill-admin-table"><thead><tr><th>Name</th><th>Email</th><th>Organization</th><th>Registered</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
   {filtered.map(r=><tr key={r.id}><td><strong>{r.full_name}</strong></td><td><a href={`mailto:${r.email}`}>{r.email}</a></td><td>{r.organization||"—"}</td><td>{new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td><td><details className="hill-admin-row-details"><summary>Details</summary><div className="hill-admin-row-popover"><p><strong>Phone:</strong> {r.phone||"Not provided"}</p><form action={updateLobbyDaySignup} className="hill-admin-edit"><input type="hidden" name="id" value={r.id}/><label>Name<input name="full_name" defaultValue={r.full_name} required/></label><label>Email<input name="email" type="email" defaultValue={r.email} required/></label><label>Phone<input name="phone" defaultValue={r.phone||""}/></label><label>Organization<input name="organization" defaultValue={r.organization||""}/></label><button type="submit" className="button-secondary">Save changes</button></form><form action={deleteLobbyDaySignup}><input type="hidden" name="id" value={r.id}/><button type="submit" className="button-danger">Remove registration</button></form></div></details></td></tr>)}
  </tbody></table></div>
  {!filtered.length?<p className="empty-state">{search?"No matching registrations. Try another search.":"No registrations yet."}</p>:null}
 </section>;
}
