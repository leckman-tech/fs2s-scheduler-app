import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { AdminHillDayAccountProvisioner } from "@/components/admin-hill-day-account-provisioner";

export const metadata: Metadata = buildMetadata({
 title:"Hill Day Account Provisioning | FS2S Admin",
 description:"Private November 18 attendee registration and temporary-credential preparation",
 path:"/admin/dashboard/hill-day/accounts", noIndex:true
});

export default async function HillDayAccountsPage() {
 await requireAdmin();
 return <div className="stack">
  <Link href="/admin/dashboard/hill-day" className="button-secondary button-link"
    style={{width:"fit-content"}}>← Back to delegation planner</Link>
  <div className="hero-card">
   <p className="eyebrow">NOVEMBER 18 • PRIVATE ADMIN WORKFLOW</p>
   <h1>Participant Accounts &amp; Invitations</h1>
   <p>Prepare individual, one-time portal credentials for eligible registrants and Maya Scholars. Your students and partner guests will be directed to their respective briefings after they verify their emails and choose their own passwords.</p>
  </div>
  <AdminHillDayAccountProvisioner />
 </div>;
}