import type { Metadata } from "next";
import Link from "next/link";
import {
  CONVENING_DIRECTOR_EMAIL,
  CONVENING_DIRECTOR_NAME,
  CONVENING_DIRECTOR_PHONE,
  CONVENING_DIRECTOR_PHONE_LINK
} from "@/lib/constants";
import { buildMetadata, getLeviProfileStructuredData } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Levi W. Eckman, J.D. | Convening Director",
  description:
    "Levi W. Eckman, J.D. serves as Convening Director for From Silos to Solutions 2026 (FS2S), with work focused on educational equity, advocacy, public funding accountability, and support for opportunity and justice-involved youth and young adults.",
  path: "/levi-w-eckman"
});

export default function LeviProfilePage() {
  const structuredData = getLeviProfileStructuredData();

  return (
    <div className="container stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero-card hero-card--premium help-hero">
        <div className="hero-card__grid">
          <div className="hero-card__content">
            <p className="eyebrow">Convening Leadership</p>
            <h1>{CONVENING_DIRECTOR_NAME}</h1>
            <p className="hero-kicker">Convening Director for From Silos to Solutions 2026.</p>
            <p>
              Levi W. Eckman, J.D. serves as Convening Director and Administrator for From Silos to
              Solutions 2026, helping shape a convening grounded in educational equity, advocacy,
              public funding accountability, and stronger supports for opportunity and
              justice-involved youth and young adults.
            </p>
            <div className="hero-actions">
              <a href={`mailto:${CONVENING_DIRECTOR_EMAIL}`} className="button button-link">
                Email Levi
              </a>
              <a href={CONVENING_DIRECTOR_PHONE_LINK} className="button-secondary button-link">
                Call {CONVENING_DIRECTOR_PHONE}
              </a>
              <Link href="/learn-more" className="button-tertiary button-link">
                Return to Who We Are
              </Link>
            </div>
          </div>

          <div className="hero-card__visual">
            <div className="hero-photo hero-photo--conference">
              <span className="hero-photo__label">Convening leadership</span>
            </div>
            <div className="hero-photo hero-photo--community">
              <span className="hero-photo__label">Advocacy and practice</span>
            </div>
            <div className="hero-photo hero-photo--dc">
              <span className="hero-photo__label">Washington, D.C.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="context-grid">
        <article className="panel story-panel">
          <p className="eyebrow">Focus Areas</p>
          <h2>Educational equity, advocacy, and public accountability</h2>
          <p>
            Levi&apos;s work centers on improving educational access and accountability for young
            people and their communities, with a particular focus on how funding reaches the people
            it is meant to support and how institutions can be held responsible for results.
          </p>
          <div className="story-list">
            <div className="session-info-pill">
              <strong>Convening role</strong>
              <span>Convening Director and Administrator</span>
            </div>
            <div className="session-info-pill">
              <strong>Public service</strong>
              <span>OST Commission service and policy-facing advocacy</span>
            </div>
            <div className="session-info-pill">
              <strong>Writing and advocacy</strong>
              <span>Legal-journal contributions focused on educational equity</span>
            </div>
          </div>
        </article>

        <article className="panel story-panel story-panel--accent">
          <p className="eyebrow">Why This Work Matters</p>
          <h2>Building spaces that move from discussion to action</h2>
          <p>
            From Silos to Solutions is designed to help people leave with stronger relationships,
            clearer next steps, and a better understanding of how systems, schools, advocates, and
            communities can work together in practice rather than in theory alone.
          </p>
          <p>
            That same practical approach shapes the event&apos;s public information, attendee tools,
            and planning systems, so the site works as a real convening platform rather than just a
            static event page.
          </p>
        </article>
      </section>
    </div>
  );
}
