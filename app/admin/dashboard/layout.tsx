import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/queries";

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
