import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BottomLiveUpdatesBar } from "@/components/bottom-live-updates-bar";
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
              <div className="site-brand">
                <Link href="/" className="site-brand__logo-link" aria-label="From Silos to Solutions 2026 home">
                  <Image
                    src="/fs2s/fs2s-lanyard-logo.png"
                    alt="FS2S logo"
                    width={84}
                    height={84}
                    className="site-brand__logo"
                    priority
                  />
                </Link>
                <div className="site-brand__copy">
                  <p className="eyebrow">From Silos to Solutions 2026 Convening</p>
                  <Link href="/" className="site-title">
                    From Silos to Solutions 2026
                  </Link>
                </div>
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
          <BottomLiveUpdatesBar />
        </div>
      </body>
    </html>
  );
}
