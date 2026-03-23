"use client";

import { useEffect, useState } from "react";
import { EVENTBRITE_URL, TICKET_PROMO_CODE } from "@/lib/constants";

const STORAGE_KEY = "fs2s-ticket-promo-dismissed";

export function TicketPromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="ticket-promo-title">
      <div className="promo-modal__scrim" onClick={dismiss} />
      <div className="promo-modal__card">
        <button
          type="button"
          className="promo-modal__close"
          onClick={dismiss}
          aria-label="Close ticket offer"
        >
          x
        </button>
        <p className="eyebrow">Registration Open</p>
        <h2 id="ticket-promo-title">Buy your tickets today</h2>
        <p>
          Join us for From Silos to Solutions 2026 and use code{" "}
          <strong>{TICKET_PROMO_CODE}</strong> for 75% off the first 50 registrations.
        </p>
        <div className="promo-modal__actions">
          <a
            href={EVENTBRITE_URL}
            className="button button-link"
            target="_blank"
            rel="noreferrer"
          >
            Purchase tickets
          </a>
          <button type="button" className="button-secondary" onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
