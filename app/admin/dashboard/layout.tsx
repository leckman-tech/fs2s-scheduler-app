import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Private admin dashboard for managing the FS2S 2026 convening.",
  path: "/admin/dashboard",
  noIndex: true
});

export default async function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="container admin-shell">
      <AdminNav />
      {children}
    </div>
  );
}
