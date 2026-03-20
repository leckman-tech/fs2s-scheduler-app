import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AdminNav() {
  return (
    <aside className="panel">
      <div className="section-heading">
        <h2>Admin Portal</h2>
      </div>
      <nav className="admin-nav" aria-label="Admin navigation">
        <Link href="/admin/dashboard" className="button-secondary button-link">
          Overview
        </Link>
        <Link href="/admin/dashboard/sessions/new" className="button-secondary button-link">
          New session
        </Link>
        <Link href="/admin/dashboard/workshops" className="button-secondary button-link">
          Workshops
        </Link>
        <Link href="/admin/dashboard/announcements" className="button-secondary button-link">
          Announcements
        </Link>
        <Link href="/admin/dashboard/resources" className="button-secondary button-link">
          Portal docs
        </Link>
        <Link href="/admin/dashboard/feedback" className="button-secondary button-link">
          Feedback
        </Link>
        <LogoutButton />
      </nav>
    </aside>
  );
}
