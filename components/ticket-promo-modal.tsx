"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTBRITE_URL } from "@/lib/constants";

export function HomeVideoModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.muted = isMuted;

    if (!isMuted) {
      videoRef.current.volume = 1;
      void videoRef.current.play().catch(() => {
        setIsMuted(true);
      });
    }
  }, [isMuted]);

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
            ref={videoRef}
            className="promo-modal__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/fs2s/fs2s-room-wide.jpg"
          >
            <source src="/fs2s/silos.mov" type="video/quicktime" />
            Your browser does not support embedded video.
          </video>
          <button
            type="button"
            className="promo-modal__sound"
            onClick={() => setIsMuted((value) => !value)}
            aria-label={isMuted ? "Turn sound on" : "Mute video"}
          >
            {isMuted ? "Tap for sound" : "Sound on"}
          </button>
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
