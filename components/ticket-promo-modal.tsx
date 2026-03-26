"use client";

import { useEffect, useState } from "react";
import { EVENTBRITE_URL, TICKET_PROMO_CODE } from "@/lib/constants";

export function TicketPromoModal() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const dismiss = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="promo-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-promo-title"
      aria-describedby="ticket-promo-description"
    >
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
        <h2 id="ticket-promo-title">Claim your FS2S 2026 ticket</h2>
        <p id="ticket-promo-description">
          Use code <strong>{TICKET_PROMO_CODE}</strong> for 100% off your ticket, thanks to a
          generous anonymous sponsorship.
        </p>
        <div className="promo-modal__actions">
          <a
            href={EVENTBRITE_URL}
            className="button button-link"
            target="_blank"
            rel="noreferrer"
          >
            Get free ticket
          </a>
          <button type="button" className="button-secondary" onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
