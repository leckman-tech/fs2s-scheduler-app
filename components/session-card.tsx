import Link from "next/link";
import type { SessionRecord } from "@/lib/types";
import {
  displaySessionTitle,
  formatTimeRange,
  isPublicSessionInteractive,
  isSecondarySessionCategory,
  labelForCategory,
  labelForStatus,
  statusClassName
} from "@/lib/utils";

export function SessionCard({ session }: { session: SessionRecord }) {
  const isInteractive = isPublicSessionInteractive(session.category);
  const isSecondary = isSecondarySessionCategory(session.category);
  const signupHref =
    session.session_code === "d1s13"
      ? "/happy-hour"
      : session.signup_enabled
        ? `/session/${session.id}#signup`
        : null;

  return (
    <details
      className={`card session-card session-card--${session.category}${isSecondary ? " session-card--secondary" : ""}`}
    >
      <summary className="session-card__summary">
        <div className="session-card__summary-main">
          <div className="session-card__top">
            <span className="chip">{labelForCategory(session.category)}</span>
            <span className={statusClassName(session.status)}>{labelForStatus(session.status)}</span>
            {session.featured ? <span className="chip" data-active="true">Featured</span> : null}
          </div>
          <div className="session-card__summary-copy">
            <h3>{displaySessionTitle(session)}</h3>
            <p>{session.short_description}</p>
          </div>
        </div>
        <div className="session-card__summary-meta">
          <div className="session-card__summary-line">
            <strong>{formatTimeRange(session.starts_at, session.ends_at)}</strong>
            <span>{session.room}</span>
          </div>
          <span className="session-card__chevron" aria-hidden="true" />
        </div>
      </summary>

      <div className="session-card__body">
        <div className="session-card__info">
          <div className="session-info-pill">
            <strong>When</strong>
            <span>{formatTimeRange(session.starts_at, session.ends_at)}</span>
          </div>
          <div className="session-info-pill">
            <strong>Where</strong>
            <span>{session.room}</span>
          </div>
          <div className="session-info-pill">
            <strong>Venue</strong>
            <span>{session.venue}</span>
          </div>
          {!!session.speakers.length && (
            <div className="session-info-pill">
              <strong>Featuring</strong>
              <span>{session.speakers.map((speaker) => speaker.name).join(", ")}</span>
            </div>
          )}
        </div>

        {isInteractive ? (
          <div className="admin-actions">
            <Link href={`/session/${session.id}`} className="button button-link">
              View details
            </Link>
            {signupHref ? (
              <Link href={signupHref} className="button-secondary button-link">
                Sign-Up Now!
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </details>
  );
}
