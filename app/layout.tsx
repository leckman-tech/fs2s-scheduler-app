import type { Metadata } from "next";
import Link from "next/link";
import { EVENTBRITE_URL } from "@/lib/constants";
import { siteMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <div className="spring-canvas" aria-hidden="true">
            <div className="spring-canvas__capitol" />
            <div className="spring-canvas__mist" />
            <span className="petal petal--1" />
            <span className="petal petal--2" />
            <span className="petal petal--3" />
            <span className="petal petal--4" />
            <span className="petal petal--5" />
            <span className="petal petal--6" />
            <span className="petal petal--7" />
            <span className="petal petal--8" />
            <span className="petal petal--9" />
            <span className="petal petal--10" />
          </div>
          <header className="site-header">
            <div className="site-header__inner">
              <div>
                <p className="eyebrow">From Silos to Solutions 2026 Convening</p>
                <Link href="/" className="site-title">
                  Conference Landing Page
                </Link>
              </div>
              <nav className="site-nav" aria-label="Primary navigation">
                <Link href="/">Schedule</Link>
                <Link href="/speakers">Speakers</Link>
                <Link href="/learn-more">Learn More</Link>
                <Link href="/attendee/login">Attendee Portal</Link>
                <Link href="/portal/login">Speaker/Presenter Portal</Link>
                <a
                  href={EVENTBRITE_URL}
                  className="site-nav__cta"
                  target="_blank"
                  rel="noreferrer"
                >
                  Purchase Tickets
                </a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <span>From Silos to Solutions 2026</span>
              <Link href="/admin/login">Admin Portal</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
