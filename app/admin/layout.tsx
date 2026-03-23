import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Portal",
  description: "Private admin access for From Silos to Solutions 2026.",
  path: "/admin/login",
  noIndex: true
});

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
