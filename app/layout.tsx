import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Silos to Solutions 2026 Convening",
  description: "A mobile-first conference schedule and admin dashboard for the FS2S 2026 Convening."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <header className="site-header">
            <div className="site-header__inner">
              <div>
                <p className="eyebrow">From Silos to Solutions 2026 Convening</p>
                <Link href="/" className="site-title">
                  Conference Schedule
                </Link>
              </div>
              <nav className="site-nav" aria-label="Primary navigation">
                <Link href="/">Schedule</Link>
                <Link href="/speakers">Speakers</Link>
                <Link href="/portal/login">Speaker Portal</Link>
                <Link href="/admin/login">Admin</Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
