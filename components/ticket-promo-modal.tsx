"use client";

import { useEffect, useState } from "react";
import { EVENTBRITE_URL } from "@/lib/constants";

export function HomeVideoModal() {
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
      aria-labelledby="home-video-title"
      aria-describedby="home-video-description"
    >
      <div className="promo-modal__scrim" onClick={dismiss} />
      <div className="promo-modal__card promo-modal__card--video">
        <button
          type="button"
          className="promo-modal__close"
          onClick={dismiss}
          aria-label="Close convening video"
        >
          x
        </button>
        <p className="eyebrow">Welcome to FS2S 2026</p>
        <h2 id="home-video-title">See the convening in motion</h2>
        <p id="home-video-description">
          A quick look at the exchange, energy, and shared purpose behind From Silos to Solutions.
        </p>
        <div className="promo-modal__video-frame">
          <video
            className="promo-modal__video"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster="/fs2s/fs2s-room-wide.jpg"
          >
            <source src="/fs2s/silos.mov" type="video/quicktime" />
            Your browser does not support embedded video.
          </video>
        </div>
        <div className="promo-modal__actions">
          <button type="button" className="button-tertiary" onClick={dismiss}>
            Explore schedule
          </button>
          <a
            href={EVENTBRITE_URL}
            className="button button-link"
            target="_blank"
            rel="noreferrer"
          >
            Purchase tickets
          </a>
        </div>
      </div>
    </div>
  );
}
