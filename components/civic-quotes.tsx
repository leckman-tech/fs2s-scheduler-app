"use client";

import { useEffect, useState } from "react";

const civicQuotes = [
  {
    text: "Everything that you care about comes through government.",
    attribution: "Keisha Lance Bottoms · former Atlanta mayor",
    source: "https://www.iheart.com/podcast/51-the-breakfast-club-24992238/episode/interview-keisha-lance-bottoms-speaks-on-349112999/"
  },
  {
    text: "If they don't give you a seat at the table, bring in a folding chair.",
    attribution: "Shirley Chisholm · former U.S. representative",
    source: "https://quoteinvestigator.com/2022/12/02/folding/"
  },
  {
    text: "What the people want is very simple. They want an America as good as its promise.",
    attribution: "Barbara Jordan · former U.S. representative",
    source: "https://texashistory.unt.edu/ark:/67531/metapth1663769/"
  },
  {
    text: "Never, ever be afraid to make some noise and get in good trouble, necessary trouble.",
    attribution: "John Lewis · former U.S. representative",
    source: "https://raskin.house.gov/2020/7/raskin-statement-passing-john-lewis"
  }
] as const;

export function CivicQuotes() {
  const [active, setActive] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);

  // Rotate automatically on every device. Reduced-motion users see instant
  // text changes rather than animated transitions (handled in CSS).
  useEffect(() => {
    if (focusPaused) return;
    const timer = window.setInterval(() => {
      setActive(previous => (previous + 1) % civicQuotes.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [focusPaused]);

  const quote = civicQuotes[active];

  return (
    <figure className="attendee-app__quote attendee-app__quote-rotator"
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
      aria-label="Civic participation inspiration">
      <blockquote key={active}>
        <p>“{quote.text}”</p>
        <footer>— {quote.attribution} · <a href={quote.source} target="_blank" rel="noopener noreferrer">Source</a></footer>
      </blockquote>
      <figcaption className="attendee-app__quote-count">Civic voices · {active + 1} of {civicQuotes.length}</figcaption>
    </figure>
  );
}
