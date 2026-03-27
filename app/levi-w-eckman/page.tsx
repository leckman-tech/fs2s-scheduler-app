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
    "Public leadership profile for Levi W. Eckman, J.D., Convening Director of From Silos to Solutions 2026 (FS2S), with work focused on educational equity, advocacy, public accountability, and stronger support for opportunity and justice-involved youth and young adults.",
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
              Levi W. Eckman, J.D. serves as Convening Director for From Silos to Solutions 2026,
              helping lead a national convening built around partnership, public leadership, and
              stronger support for opportunity and justice-involved youth and young adults.
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
            Levi&apos;s work focuses on educational equity, access to opportunity, and the public
            accountability needed to make systems work better for young people and their
            communities. That includes sustained attention to how funding is distributed, how it is
            used, and whether institutions are delivering meaningful support where it is most
            needed.
          </p>
          <div className="story-list">
            <div className="session-info-pill">
              <strong>Convening role</strong>
              <span>Convening Director for From Silos to Solutions 2026</span>
            </div>
            <div className="session-info-pill">
              <strong>Public service</strong>
              <span>Service on the District&apos;s OST Commission and policy-facing advocacy</span>
            </div>
            <div className="session-info-pill">
              <strong>Writing and advocacy</strong>
              <span>Legal and public-writing work focused on educational equity and accountability</span>
            </div>
          </div>
        </article>

        <article className="panel story-panel story-panel--accent">
          <p className="eyebrow">Why This Work Matters</p>
          <h2>Building public spaces that move from conversation to action</h2>
          <p>
            From Silos to Solutions is designed to bring educators, advocates, policymakers,
            providers, and community leaders into the same room to share what is working, name
            where coordination breaks down, and strengthen the relationships needed for practical
            action.
          </p>
          <p>
            Levi&apos;s approach to the convening reflects that same public-facing focus: clear
            information, useful tools, and a stronger bridge between advocacy, systems work, and
            the daily realities young people and communities are navigating.
          </p>
        </article>
      </section>
    </div>
  );
}
