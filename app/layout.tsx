import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { BottomLiveUpdatesBar } from "@/components/bottom-live-updates-bar";
import { SiteHeader } from "@/components/site-header";
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
          <SiteHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <span>&copy; 2026 From Silos to Solutions</span>
              <div className="site-footer__links">
                <Link href="/help">Help &amp; Contact</Link>
                <Link href="/admin/login">Admin Portal</Link>
              </div>
            </div>
          </footer>
          <BottomLiveUpdatesBar />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
