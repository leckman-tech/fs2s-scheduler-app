import type { Metadata } from "next";
import Link from "next/link";
import { CapitolCampusExplorer } from "@/components/capitol-campus-explorer";
import { getPublicLobbyDaySignupCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"November 18, 2026 Advocacy Hill Day | FS2S",description:"Join the FS2S Advocacy Hill Day on November 18, 2026, featuring Maya Angelou Scholars, community partners, and congressional conversations.",path:"/lobby-day"});
const meetingsInProgress = [

 "Senate HELP Republican staff — willing to meet; an afternoon time has been requested",
 "Rep. Jahana Hayes's office — 10:00 a.m. was offered but conflicts with the morning gathering; afternoon alternative requested",
 "Sen. Josh Hawley's office — policy staff follow-up sent",
 "Sen. Angela Alsobrooks's office — policy staff referral",
 "Rep. Adam Gray's office — additional scheduling follow-up"
];
const schedule = [
 {time:"9:45–10:00 a.m.",title:"Arrival at Maya",description:"Check in at MAPCS-HS, 5600 East Capitol Street NE, Washington, DC 20019, and meet your delegation leader."},
 {time:"10:00–10:45 a.m.",title:"Advocacy training and practice",description:"Review the congressional briefings distributed in advance, meet your delegation, rehearse openings and questions, and get ready for the afternoon."},
 {time:"10:45–11:05 a.m.",title:"Lunch at Maya",description:"Lunch is planned for participants before travel."},
 {time:"11:05–11:15 a.m.",title:"Bus loading and headcount",description:"Join your assigned bus and stay with your delegation leader."},
 {time:"11:15 a.m. (target)",title:"Buses depart for Capitol Hill",description:"Travel, unloading, building entry and security screening are being coordinated. Exact arrival times will be shared after transportation is confirmed."},
 {time:"12:30–3:30 p.m.",title:"Congressional visits and group reflection",description:"Eighteen congressional policy meetings and one congressional photo opportunity are planned across nine delegations. Follow your group lead for final room and arrival details."},
 {time:"3:30–4:00 p.m. (target)",title:"Virtual debrief and accountability",description:"At 3:30 p.m. Eastern, attendees join the Zoom debrief using the meeting button in their private Attendee Portal. Follow your adult lead’s supervised return instructions."}
];
export default async function LobbyDayPage(){
 const count=await getPublicLobbyDaySignupCount();
 return <div className="container stack">
 <section className="hero-card hero-card--landing hill-day-hero"><div className="hero-card__grid"><div className="hero-card__content">
  <p className="eyebrow">FS2S ADVOCACY HILL DAY • WASHINGTON, D.C.</p>
  <h1 className="hill-day-hero__title"><span><em>Our</em> <strong className="hill-day-word hill-day-word--stories">Stories.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--schools">Schools.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--capitol">Capitol.</strong></span></h1>
  <p className="hero-kicker">Wednesday, November 18, 2026 — moving from silos to solutions, together.</p>
  <p>See Forever Foundation and Maya Angelou Schools are convening scholars, educators and partners to advocate for educational opportunity, continuity and stronger pathways for young people affected by the justice system. Registration has closed, and {count} people have signed up to take part in the day.</p>
  <div className="hero-meta"><span className="hero-pill">November 18, 2026</span><span className="hero-pill">Capitol Hill, Washington, D.C.</span><span className="hero-pill">At Maya 9:45 AM • Training 10–10:45 AM • Lunch 10:45 AM • Buses 11:15 AM</span></div>
  <div className="hero-actions"><a href="#celebrate" className="button button-link">Meet the Hill Day community</a><a href="#schedule" className="button-secondary button-link">View Wednesday’s schedule</a></div>
 </div><div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">The Hill, together</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Students at the center</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Partners in action</span></div></div></div>  <div id="celebrate" className="hill-day-celebration" aria-label="Advocacy Hill Day registration celebration">
    <div className="hill-day-celebration__topline"><span><span className="hill-day-celebration__status-dot" aria-hidden="true"/>REGISTRATION CLOSED</span><span>WEDNESDAY, NOVEMBER 18, 2026</span></div>
    <div className="hill-day-celebration__main">
      <div className="hill-day-celebration__primary"><div className="hill-day-celebration__count">{count}</div><div className="hill-day-celebration__count-caption">people registered</div></div>
      <div className="hill-day-celebration__story"><p className="hill-day-celebration__story-overline">FROM SILOS TO SOLUTIONS</p><h2>One day.<br/><em>Many voices.</em></h2><p>Scholars and partners, united on Capitol Hill.</p></div>
    </div>
    <div className="hill-day-celebration__feature" aria-label="Advocacy Day by the numbers">
      <div className="hill-day-celebration__feature-heading"><span>THE DAY BY THE NUMBERS</span><span className="hill-day-celebration__feature-pips" aria-hidden="true"><i/><i/><i/></span></div>
      <div className="hill-day-celebration__feature-stage">
        <div className="hill-day-celebration__feature-slide"><strong>9</strong><span><b>Delegation groups</b><small>Nine groups, one shared purpose.</small></span></div>
        <div className="hill-day-celebration__feature-slide"><strong>19</strong><span><b>Congressional engagements</b><small>18 policy meetings and one photo opportunity.</small></span></div>
        <div className="hill-day-celebration__feature-slide"><strong>5</strong><span><b>Partner-led delegations</b><small>Community voices joining Maya Scholars.</small></span></div>
      </div>
    </div>
    <div className="hill-day-celebration__groups"><span className="hill-day-celebration__groups-title">THE PEOPLE MAKING IT HAPPEN</span>
      <div className="hill-day-celebration__parade" aria-label="Participating delegations">
        <div className="hill-day-celebration__parade-track">
          <div className="hill-day-celebration__parade-set"><span>Maya Scholars A</span><span>Maya Scholars B</span><span>Maya Scholars C</span><span>Maya Scholars D</span><span>Tutoring Café A</span><span>Tutoring Café B</span><span>Black Swan Academy</span><span>Georgetown / Sasha Bruce</span><span>Youth Justice Partners</span></div>
          <div className="hill-day-celebration__parade-set" aria-hidden="true"><span>Maya Scholars A</span><span>Maya Scholars B</span><span>Maya Scholars C</span><span>Maya Scholars D</span><span>Tutoring Café A</span><span>Tutoring Café B</span><span>Black Swan Academy</span><span>Georgetown / Sasha Bruce</span><span>Youth Justice Partners</span></div>
        </div>
      </div>
    </div>
    <p className="hill-day-celebration__fineprint">Sign-ups shown; final attendance and student permissions are confirmed separately.</p>
  </div>
</section>
 <section className="context-grid"><article className="panel story-panel story-panel--accent"><p className="eyebrow">WHY WE'RE GOING</p><h2>Every young person deserves a path through education</h2><p>Scholars will talk with congressional offices about education, justice-system involvement, and the support young people need to stay in school or return to learning.</p></article>
 <article className="panel story-panel"><p className="eyebrow">WHAT TO EXPECT</p><h2>Conversations led by student experience</h2><p>Nine delegations are preparing for their congressional conversations. Registered attendees should review their group materials and follow their designated adult lead; student permissions and final travel approval remain separate.</p></article></section>
 <section className="panel hill-day-closed-notice" aria-label="Registration status"><p className="eyebrow">REGISTRATION CLOSED</p><h2>We're grateful you're part of this.</h2><p>Registration for the November 18 Advocacy Hill Day has ended. If you're already participating, please use the <Link href="/attendee/briefings">attendee briefing portal</Link> and coordinate directly with your delegation lead. Questions? <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Question">Contact the organizing team</a>.</p></section>
 <section id="schedule" className="panel callout-panel"><p className="eyebrow">EVENT SCHEDULE</p><h2>Our plan for November 18</h2><p className="muted">Check in at Maya Angelou Public Charter High School, 5600 East Capitol Street NE, between 9:45 and 10:00 a.m. Training begins at 10:00 a.m., lunch is at 10:45 a.m., and Sprinter transportation is planned to depart beginning at 11:15 a.m. Congressional meetings start from 12:30 p.m. after security screening.</p><div className="timeline-grid">{schedule.map(item=><article className="timeline-card" key={item.title}><p className="timeline-card__label">{item.time}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
 <section className="panel capitol-campus-section" id="congressional-offices" aria-labelledby="capitol-campus-title">
   <div className="capitol-campus-section__header"><div><p className="eyebrow">OUR CONGRESSIONAL ENGAGEMENTS</p><h2 id="capitol-campus-title">Across Capitol Hill.</h2><p>Our nine delegations have 19 congressional engagements, including 18 policy meetings and one photo opportunity. Explore the campus, select a building, and connect directly with the participating offices.</p></div><div className="capitol-campus-section__total"><strong>19</strong><span>CONGRESSIONAL<br/>ENGAGEMENTS</span></div></div>
   <CapitolCampusExplorer/>
   <p className="capitol-campus-section__note">Building locations are approximate and illustrative, not walking directions. The public map does not display meeting rooms, student assignments, or private scheduling details.</p>
 </section>
 <section className="panel callout-panel" id="participation"><p className="eyebrow">COMMUNITY PARTICIPATION</p><h2>Students, educators, and community partners</h2><p>{count} participants have registered from schools, youth organizations, and community partners working to expand opportunity for young people. Nine delegations will bring distinct perspectives to Capitol Hill.</p><p>We celebrate <strong>Maya Angelou Scholars A, B, C, and D</strong>, <strong>Tutoring Café A and B</strong>, <strong>Black Swan Academy</strong>, <strong>Georgetown / Sasha Bruce</strong>, and <strong>Youth Justice Partners</strong>—alongside the educators, advocates, and community members helping their voices reach Congress.</p><p className="muted">Individual participation and student arrangements will be confirmed by the organizing team.</p></section>
 <section className="panel callout-panel" id="sponsor"><p className="eyebrow">SPONSOR ADVOCACY HILL DAY</p><h2>Help provide lunch for 100 participants</h2><p>We are seeking a <strong>$2,000 lunch sponsorship</strong> or an in-kind contribution of approximately 100 meals for students, educators and community partners on November 18. The See Forever Foundation can accept a charitable contribution directly. A smaller contribution or an introduction to a potential catering partner is also welcome.</p><p>Sponsors may be recognized at the event and on this website. Please contact our team to discuss details.</p><div className="hero-actions"><a className="button button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Lunch%20Sponsorship">Discuss sponsorship</a><a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20In-Kind%20Lunch%20Donation">Offer meals or an introduction</a></div></section>
 <section className="panel story-panel"><p className="eyebrow">QUESTIONS & PARTNERSHIPS</p><h2>Questions or partnership ideas?</h2><p>Registration is closed, but questions from registered participants and outreach from community partners are always welcome.</p><div className="hero-actions"><a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20-%20November%2018" className="button button-link">Contact FS2S</a><Link href="/" className="button-secondary button-link">Discover FS2S 2027</Link></div></section>
 </div>
}