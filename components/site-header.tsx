"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { EVENTBRITE_URL } from "@/lib/constants";

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
            From Silos to Solutions 2026
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
            <Link href="/">Schedule</Link>
            <Link href="/speakers">Speakers</Link>
            <Link href="/lobby-day">Fall 2026 Lobby Day</Link>
            <Link href="/learn-more">Who We Are</Link>
            <Link href="/learn-more#faq">FAQ</Link>
            <Link href="/attendee/login">Attendee Portal</Link>
            <Link href="/portal/login">Speaker/Presenter Portal</Link>
          </nav>
          <div className="site-header__actions">
            <a href={EVENTBRITE_URL} className="site-nav__cta" target="_blank" rel="noreferrer">
              Purchase Tickets
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
