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
          <p className="site-brand__eyebrow">Power Through Partnerships: The Next Steps</p>
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
            <Link href="/lobby-day" aria-current={pathname === "/lobby-day" ? "page" : undefined}>Hill Day · Nov 18</Link>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>FS2S 2027</Link>
            <Link href="/learn-more" aria-current={pathname.startsWith("/learn-more") ? "page" : undefined}>About FS2S</Link>
            <Link href="/attendee/login" aria-current={pathname.startsWith("/attendee") ? "page" : undefined}>Attendee Portal</Link>
          </nav>
          <div className="site-header__actions">
            <Link href="/lobby-day#register" className="site-nav__cta">Register for Hill Day</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
