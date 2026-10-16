"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <Link href="/" className="site-title">
            From Silos to Solutions
          </Link>
          <p className="site-brand__eyebrow">Power Through Partnerships</p>
        </div>

        <button
          type="button"
          className="site-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="sr-only">{menuOpen ? "Close navigation" : "Open navigation"}</span>
          <span className="site-menu-toggle__label">{menuOpen ? "Close" : "Menu"}</span>
          <span className="site-menu-toggle__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div
          id={menuId}
          className={`site-header__nav-wrap${menuOpen ? " site-header__nav-wrap--open" : ""}`}
        >
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/lobby-day">November 18 Hill Day</Link>
            <Link href="/">FS2S 2027</Link>
            
            <Link href="/2026-archive">2026 Archive</Link>
            <Link href="/learn-more">Who We Are</Link>
            <Link href="/learn-more#faq">FAQ</Link>
            <Link href="/attendee/login">Attendee Portal</Link>
            <Link href="/portal/login">Speaker/Presenter Portal</Link>
          </nav>
          <div className="site-header__actions">
            <Link href="/lobby-day#register" className="site-nav__cta">Register for Hill Day</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
