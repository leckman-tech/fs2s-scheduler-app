import Link from "next/link";
import { AdminHillDayList } from "@/components/admin-hill-day-list";
import { getAdminLobbyDaySignups } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSignupsPage({ searchParams }: {searchParams:Promise<{error?:string}>}) {
 const params=await searchParams;
 const records=await getAdminLobbyDaySignups();
 return <div className="stack hill-admin-page">
  {params.error?<p className="empty-state">{params.error}</p>:null}
  <header className="hill-admin-heading">
   <div><p className="eyebrow">NOVEMBER 18, 2026 · ADVOCACY HILL DAY</p><h1>Registration manager</h1><p className="muted">All registrations, including earlier 2026 sign-ups.</p></div>
   <Link className="button-secondary button-link" href="/admin/dashboard/signups/export?type=lobby-day">Download CSV</Link>
  </header>
  <div className="hill-admin-metrics">
   <div><span>Registered</span><strong>{records.length}</strong></div>
   <div><span>Target</span><strong>125</strong></div>
   <div><span>Remaining</span><strong>{Math.max(125-records.length,0)}</strong></div>
  </div>
  <AdminHillDayList records={records}/>
 </div>;
}
