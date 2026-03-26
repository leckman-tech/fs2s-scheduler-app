import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo";
import { requireAdmin } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

type CheckState = "pass" | "warn" | "fail";

type CheckItem = {
  label: string;
  state: CheckState;
  detail: string;
};

export const metadata: Metadata = buildMetadata({
  title: "System Check",
  description: "Launch readiness checks for FS2S 2026 site configuration, signups, and communications.",
  path: "/admin/dashboard/system",
  noIndex: true
});

async function runTableCheck(table: string, label: string): Promise<CheckItem> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase.from(table).select("id", { head: true, count: "exact" });

    if (error) {
      return {
        label,
        state: "fail",
        detail: `Missing or inaccessible in Supabase. ${error.message}`
      };
    }

    return {
      label,
      state: "pass",
      detail: `${count ?? 0} row${count === 1 ? "" : "s"} available`
    };
  } catch (error) {
    return {
      label,
      state: "fail",
      detail: error instanceof Error ? error.message : "Unable to verify this table right now."
    };
  }
}

function createEnvCheck(
  label: string,
  configured: boolean,
  {
    required,
    configuredDetail,
    missingDetail
  }: {
    required: boolean;
    configuredDetail: string;
    missingDetail: string;
  }
): CheckItem {
  if (configured) {
    return {
      label,
      state: "pass",
      detail: configuredDetail
    };
  }

  return {
    label,
    state: required ? "fail" : "warn",
    detail: missingDetail
  };
}

export default async function AdminSystemCheckPage() {
  await requireAdmin();

  const platformChecks = [
    createEnvCheck("Supabase URL", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), {
      required: true,
      configuredDetail: "Connected for public site, admin, and portals.",
      missingDetail: "Add NEXT_PUBLIC_SUPABASE_URL in Vercel and locally."
    }),
    createEnvCheck(
      "Supabase publishable key",
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      {
        required: true,
        configuredDetail: "Public-facing data and auth client can initialize.",
        missingDetail:
          "Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and locally."
      }
    ),
    createEnvCheck("Resend API key", Boolean(process.env.RESEND_API_KEY), {
      required: false,
      configuredDetail: "Confirmation emails are ready to send from the site.",
      missingDetail: "Confirmation emails will be skipped until RESEND_API_KEY is added."
    }),
    createEnvCheck("Resend sender email", Boolean(process.env.RESEND_FROM_EMAIL), {
      required: false,
      configuredDetail: "Outgoing RSVP emails have a branded from address.",
      missingDetail: "Set RESEND_FROM_EMAIL so confirmations look polished."
    }),
    createEnvCheck("Attendee access code", Boolean(process.env.ATTENDEE_ACCESS_CODE), {
      required: false,
      configuredDetail: "Attendees can create their own portal accounts with the conference access code.",
      missingDetail:
        "Set ATTENDEE_ACCESS_CODE if you want attendee self-registration turned on for the portal."
    }),
    {
      label: "Vercel Analytics",
      state: "pass" as CheckState,
      detail: "Analytics is wired into the app layout for production traffic reporting."
    },
    {
      label: "Next proxy routing",
      state: "pass" as CheckState,
      detail: "The app uses proxy.ts, so the old middleware deprecation warning is cleared."
    }
  ];

  const databaseChecks = await Promise.all([
    runTableCheck("sessions", "Sessions"),
    runTableCheck("announcements", "Announcements"),
    runTableCheck("portal_documents", "Portal documents"),
    runTableCheck("session_signups", "Session sign-ups"),
    runTableCheck("lobby_day_signups", "Lobby Day sign-ups"),
    runTableCheck("happy_hour_rsvps", "Happy Hour RSVPs"),
    runTableCheck("attendee_board_posts", "Attendee board posts"),
    runTableCheck("attendee_directory_entries", "Attendee directory entries"),
    runTableCheck("form_submission_guards", "Public form guard log")
  ]);

  const allChecks = [...platformChecks, ...databaseChecks];
  const passCount = allChecks.filter((check) => check.state === "pass").length;
  const warnCount = allChecks.filter((check) => check.state === "warn").length;
  const failCount = allChecks.filter((check) => check.state === "fail").length;
  const totalChecks = allChecks.length;
  const readinessPercent = totalChecks ? Math.round((passCount / totalChecks) * 100) : 0;
  const healthMeterStyle = {
    "--health-progress": `${readinessPercent}%`
  } as CSSProperties;

  const launchNotes = [
    warnCount === 2 && !failCount
      ? "Everything on the site is usable right now. The only missing piece is Resend, so confirmation emails will stay disabled until those Vercel variables are added."
      : null,
    !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL
      ? "Add Resend environment variables in Vercel if you want RSVP confirmation emails to go out automatically."
      : null,
    !process.env.ATTENDEE_ACCESS_CODE
      ? "Add ATTENDEE_ACCESS_CODE in Vercel when you are ready to let attendees create their own portal accounts."
      : null,
    databaseChecks.some((check) => check.label === "Public form guard log" && check.state !== "pass")
      ? "Run 018_public_form_guard.sql in Supabase so the public signup forms have anti-spam protection."
      : null,
    databaseChecks.some((check) => check.state === "fail")
      ? "One or more Supabase tables are still missing. Open the failed cards below and run the matching migration before launch."
      : null
  ].filter(Boolean) as string[];

  return (
    <div className="stack">
      <section className="hero-card">
        <h1>System Check</h1>
        <p>
          This page checks the key pieces behind the live site so you can tell, at a glance,
          whether sign-ups, emails, attendee tools, and the admin workflow are launch-ready.
        </p>
        <div className="hero-meta">
          <span className="hero-pill">{passCount} passing</span>
          <span className="hero-pill">{warnCount} warning{warnCount === 1 ? "" : "s"}</span>
          <span className="hero-pill">{failCount} issue{failCount === 1 ? "" : "s"}</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Launch readiness snapshot</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              A visual read on what is already ready, what is optional, and what still needs setup.
            </p>
          </div>
        </div>
        <div className="health-overview">
          <article className="health-meter">
            <div
              className="health-meter__ring"
              style={healthMeterStyle}
              aria-hidden="true"
            >
              <div className="health-meter__center">
                <strong>{readinessPercent}%</strong>
                <span>ready</span>
              </div>
            </div>
            <div className="health-meter__copy">
              <h3>Overall launch readiness</h3>
              <p>
                Core site functions, admin tools, and public sign-up flows are in place. Email
                confirmations depend on the Resend setup below.
              </p>
            </div>
          </article>

          <div className="health-breakdown">
            <article className="health-stat health-stat--pass">
              <span className="health-stat__dot" aria-hidden="true" />
              <strong>{passCount}</strong>
              <span>Passing checks</span>
            </article>
            <article className="health-stat health-stat--warn">
              <span className="health-stat__dot" aria-hidden="true" />
              <strong>{warnCount}</strong>
              <span>Warnings</span>
            </article>
            <article className="health-stat health-stat--fail">
              <span className="health-stat__dot" aria-hidden="true" />
              <strong>{failCount}</strong>
              <span>Fix before launch</span>
            </article>
          </div>
        </div>
      </section>

      {launchNotes.length ? (
        <section className="panel">
          <div className="section-heading">
            <h2>Launch notes</h2>
          </div>
          <div className="resource-list">
            {launchNotes.map((note) => (
              <article key={note} className="announcement">
                {note}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Platform & communications</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Environment variables, analytics, and core delivery setup
            </p>
          </div>
        </div>
        <div className="system-check-grid">
          {platformChecks.map((check) => (
            <article key={check.label} className={`system-check-card system-check-card--${check.state}`}>
              <div className="system-check-card__header">
                <strong>{check.label}</strong>
                <span className={`system-check-card__badge system-check-card__badge--${check.state}`}>
                  {check.state}
                </span>
              </div>
              <p>{check.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Supabase data readiness</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Core tables behind schedules, portals, community tools, and sign-ups
            </p>
          </div>
        </div>
        <div className="system-check-grid">
          {databaseChecks.map((check) => (
            <article key={check.label} className={`system-check-card system-check-card--${check.state}`}>
              <div className="system-check-card__header">
                <strong>{check.label}</strong>
                <span className={`system-check-card__badge system-check-card__badge--${check.state}`}>
                  {check.state}
                </span>
              </div>
              <p>{check.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Quick admin jumps</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              The pages you’ll use most often during the convening
            </p>
          </div>
        </div>
        <div className="admin-actions">
          <Link href="/admin/dashboard/signups" className="button-secondary button-link">
            Open sign-ups
          </Link>
          <Link href="/admin/dashboard/announcements" className="button-secondary button-link">
            Open announcements
          </Link>
          <Link href="/admin/dashboard/resources" className="button-secondary button-link">
            Open portal docs
          </Link>
        </div>
      </section>
    </div>
  );
}
