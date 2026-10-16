import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({
 title:"From Silos to Solutions | Looking Ahead to 2027",
 description:"From Silos to Solutions prepares for the 2027 convening and November 18, 2026 Advocacy Hill Day in Washington, D.C.",
 path:"/"
});
export default function HomePage(){
 return <div className="container stack">
  <section className="hero-card hero-card--landing"><div className="hero-card__grid">
   <div className="hero-card__content">
    <p className="eyebrow">FROM SILOS TO SOLUTIONS • THE NEXT CHAPTER</p>
    <h1>Power Through Partnerships: A Common Cause</h1>
    <p className="hero-kicker">Looking toward the 2027 convening — and putting partnership into action on Capitol Hill this November.</p>
    <p>From Silos to Solutions brings together scholars, educators, youth-serving organizations, advocates, and decision-makers to strengthen pathways for opportunity and justice-involved young people. Our 2027 convening is in development; dates, speakers, venue and registration will be announced when confirmed.</p>
    <div className="hero-meta"><span className="hero-pill">2027 convening • planning underway</span><span className="hero-pill">Washington, D.C.</span><span className="hero-pill">See Forever Foundation &amp; Maya Angelou Schools</span></div>
    <div className="hero-actions"><Link href="/lobby-day" className="button button-link">Explore November 18 Hill Day</Link><Link href="/2026-archive" className="button-secondary button-link">2026 convening archive</Link></div>
   </div>
   <div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">Advocacy in action</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Partnership in practice</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Scholar-centered change</span></div></div>
  </div></section>
  <section className="context-grid">
   <article className="panel story-panel story-panel--accent"><p className="eyebrow">UP NEXT · NOVEMBER 18, 2026</p><h2>From dialogue to Capitol Hill</h2><p>Join our Advocacy Hill Day, an opportunity for Maya Angelou Scholars and community partners to speak directly about educational access, continuity and pathways for justice-involved youth. Participation is being organized now; congressional meetings are requested, not yet confirmed.</p><Link href="/lobby-day" className="button button-link">Hill Day details and registration</Link></article>
   <article className="panel story-panel"><p className="eyebrow">LOOKING AHEAD · 2027</p><h2>A common cause. A growing coalition.</h2><p>We are building the next From Silos to Solutions gathering around young people's experiences, meaningful collaboration and practical commitments. Watch this space as programming and logistics develop.</p><Link href="/learn-more" className="button-secondary button-link">About our work</Link></article>
  </section>
  <section className="panel callout-panel"><p className="eyebrow">THE ARCHIVE</p><h2>Looking back at FS2S 2026</h2><p>Explore the April 1–3, 2026 program, sessions and speakers as a record of our previous convening. Tickets and promotional offers for that event are no longer available.</p><Link href="/2026-archive" className="button-secondary button-link">Explore the 2026 archive</Link></section>
 </div>
}