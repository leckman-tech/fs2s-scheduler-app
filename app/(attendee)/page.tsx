import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"From Silos to Solutions | Looking Ahead to 2027",description:"A new chapter for From Silos to Solutions: the 2027 convening and November 18, 2026 Advocacy Hill Day in Washington, D.C.",path:"/"});
export default function HomePage(){
return <div className="container stack">
  <section className="hero-card hero-card--landing fs2s-next-hero"><div className="hero-card__grid">
    <div className="hero-card__content">
      <p className="eyebrow">THE NEXT CHAPTER · FROM SILOS TO SOLUTIONS</p>
      <h1>Progress happens when we work together.</h1>
      <p className="hero-kicker">Power Through Partnerships: A Common Cause.</p>
      <p>One conversation can open a door. A coalition can change what happens on the other side. From Silos to Solutions connects young people, educators, advocates, and policymakers to build opportunity beyond traditional systems.</p>
      <div className="hero-meta"><span className="hero-pill">Looking ahead to 2027</span><span className="hero-pill">Washington, D.C.</span></div>
      <div className="hero-actions"><Link href="/lobby-day" className="button button-link">Join us on Capitol Hill →</Link><a href="#2027" className="button-secondary button-link">Explore what comes next</a></div>
      <p className="fs2s-next-hero__note">Presented by the See Forever Foundation &amp; Maya Angelou Schools</p>
    </div>
    <div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">Washington, D.C.</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Ideas into action</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Our shared future</span></div></div>
  </div></section>
  <section className="fs2s-event-spotlight" aria-labelledby="next-event-title">
    <div><p className="eyebrow">NEXT UP · WEDNESDAY, NOVEMBER 18, 2026</p><h2 id="next-event-title">Take your seat at the table.</h2><p>Our Advocacy Hill Day brings Maya Angelou Scholars and community partners to Capitol Hill to discuss educational access, second chances, and lasting opportunity. Meetings are being requested; final appointments and logistics are still being arranged.</p></div>
    <Link href="/lobby-day#register" className="button button-link">Register your interest →</Link>
  </section>
  <section className="context-grid" id="2027">
    <article className="panel story-panel"><p className="eyebrow">COMING IN 2027</p><h2>Different experiences. One common cause.</h2><p>We're developing our next convening around scholar voice, practical partnerships, and shared accountability. Dates, programming, speakers, venue, and registration will be announced as they are confirmed.</p><Link href="/learn-more" className="button-secondary button-link">Discover our mission</Link></article>
    <article className="panel story-panel story-panel--accent"><p className="eyebrow">THE WORK CONTINUES</p><h2>Beyond the room. Beyond the moment.</h2><p>The ideas that matter most don't end when a convening closes. Our November Advocacy Hill Day is one way we're turning relationships into action—with students at the center.</p><Link href="/lobby-day" className="button-secondary button-link">See the Hill Day plan</Link></article>
  </section>
  <section className="panel callout-panel"><p className="eyebrow">OUR HISTORY</p><h2>The 2026 convening, preserved.</h2><p>Explore the April 1–3, 2026 program and the conversations that helped shape our next chapter. This material is archived; ticket sales for the former event are closed.</p><Link href="/2026-archive" className="button-secondary button-link">Explore the 2026 archive →</Link></section>
</div>}
