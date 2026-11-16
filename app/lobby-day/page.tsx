import type { Metadata } from "next";
import Link from "next/link";
import { getPublicLobbyDaySignupCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"November 18, 2026 Advocacy Hill Day | FS2S",description:"Join the FS2S Advocacy Hill Day on November 18, 2026, featuring Maya Angelou Scholars, community partners, and congressional conversations.",path:"/lobby-day"});
const scheduledMeetings = [
 { time: "12:30 p.m.", office: "Rep. Terri Sewell's office", location: "1035 Longworth", detail: "Meeting with Legislative Assistant Brandan Belser" },
 { time: "1:00 p.m.", office: "Rep. Jim Jordan's office", location: "2056 Rayburn", detail: "Meeting with congressional staff" },
 { time: "1:00–1:30 p.m.", office: "Senate HELP Democratic staff", location: "632 Hart", detail: "Committee staff conversation" },
 { time: "1:00 p.m.", office: "Sen. Dick Durbin / Senate Judiciary staff", location: "711 Hart", detail: "Meeting with Annie Powell and Eileen DeGuire" },
 { time: "1:00 p.m.", office: "Rep. Kevin Kiley's office", location: "2445 Rayburn (office address)", detail: "Meeting with Carson Cameron; calendar invitation sent, room to verify" },
 { time: "1:30 p.m.", office: "House Education and Workforce Committee staff", location: "2257 Rayburn", detail: "Meeting with Eli Mitchell" },
 { time: "1:30 p.m.", office: "Sen. Patty Murray's office", location: "154 Russell", detail: "Staff conversation; delegation to arrive by 1:15 p.m." },
 { time: "2:00–2:30 p.m.", office: "Del. Eleanor Holmes Norton's office", location: "2136 Rayburn", detail: "Meeting with congressional staff" },
 { time: "2:00 p.m.", office: "Rep. Suzanne Bonamici's office", location: "2231 Rayburn", detail: "Education policy staff conversation" },
 { time: "2:00 p.m.", office: "Sen. Gary Peters's office", location: "724 Hart (South entrance on Constitution Ave.)", detail: "Meeting with staff member Ava Kelsey; office confirmed November 13. Metal-detector screening at Senate building entry." },
 { time: "2:30 p.m.", office: "Sen. Brian Schatz's office", location: "722 Hart", detail: "Education policy staff conversation" },
 { time: "2:30–3:00 p.m.", office: "Rep. Gary Palmer's office", location: "170 Cannon (office address)", detail: "In-person meeting booked with Legislative Aide Hampton Neugent; exact room to verify" },
 { time: "2:30 p.m.", office: "Sen. Mazie Hirono’s office", location: "109 Hart", detail: "D07 staff meeting with Ben Strand; group capacity confirmed" },
 { time: "3:00–3:30 p.m.", office: "Rep. Adelita S. Grijalva", location: "1203 Longworth", detail: "Meeting scheduled with the Congresswoman" },
 { time: "3:00 p.m.", office: "Sen. Chris Van Hollen's office", location: "730 Hart", detail: "Meeting with staff member Brendan Flynn" }
];
const meetingsInProgress = [

 "Senate HELP Republican staff — willing to meet; an afternoon time has been requested",
 "Rep. Jahana Hayes's office — 10:00 a.m. was offered but conflicts with the morning gathering; afternoon alternative requested",
 "Sen. Josh Hawley's office — policy staff follow-up sent",
 "Rep. Lucy McBath's office — policy staff referral",
 "Sen. Angela Alsobrooks's office — policy staff referral",
 "Sen. Elissa Slotkin's office — outreach in progress",
 "Rep. Adam Gray's office — additional scheduling follow-up"
];
const schedule = [
 {time:"9:45–10:00 a.m.",title:"Arrival at Maya",description:"Check in at MAPCS-HS, 5600 East Capitol Street NE, Washington, DC 20019, and meet your delegation leader."},
 {time:"10:00–10:45 a.m.",title:"Advocacy training and practice",description:"Review the congressional briefings distributed in advance, meet your delegation, rehearse openings and questions, and get ready for the afternoon."},
 {time:"10:45–11:05 a.m.",title:"Lunch at Maya",description:"Lunch is planned for participants before travel."},
 {time:"11:05–11:15 a.m.",title:"Bus loading and headcount",description:"Join your assigned bus and stay with your delegation leader."},
 {time:"11:15 a.m. (target)",title:"Buses depart for Capitol Hill",description:"Travel, unloading, building entry and security screening are being coordinated. Exact arrival times will be shared after transportation is confirmed."},
 {time:"12:30–3:30 p.m.",title:"Congressional visits and group reflection",description:"Fifteen congressional office and committee appointments are agreed across nine delegations. Follow your group lead for final room and arrival details."},
 {time:"3:30–4:00 p.m. (target)",title:"Wrap-up and accountability",description:"Delegations report key takeaways, check in with staff and follow their supervised return instructions."}
];
export default async function LobbyDayPage(){
 const count=await getPublicLobbyDaySignupCount();
 return <div className="container stack">
 <section className="hero-card hero-card--landing hill-day-hero"><div className="hero-card__grid"><div className="hero-card__content">
  <p className="eyebrow">FS2S ADVOCACY HILL DAY • WASHINGTON, D.C.</p>
  <h1 className="hill-day-hero__title"><span><em>Our</em> <strong className="hill-day-word hill-day-word--stories">Stories.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--schools">Schools.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--capitol">Capitol.</strong></span></h1>
  <p className="hero-kicker">Wednesday, November 18, 2026 — moving from silos to solutions, together.</p>
  <p>See Forever Foundation and Maya Angelou Schools are convening scholars, educators and partners to advocate for educational opportunity, continuity and stronger pathways for young people affected by the justice system. Registration has closed, and 75 people have signed up to take part in the day.</p>
  <div className="hero-meta"><span className="hero-pill">November 18, 2026</span><span className="hero-pill">Capitol Hill, Washington, D.C.</span><span className="hero-pill">At Maya 9:45 AM • Training 10–10:45 AM • Lunch 10:45 AM • Buses 11:15 AM</span></div>
  <div className="hero-actions"><a href="#celebrate" className="button button-link">Meet the Hill Day community</a><a href="#schedule" className="button-secondary button-link">View Wednesday’s schedule</a></div>
 </div><div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">The Hill, together</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Students at the center</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Partners in action</span></div></div></div>  <div id="celebrate" className="hill-day-celebration" aria-label="Advocacy Hill Day community by the numbers">
    <div className="hill-day-celebration__intro"><span className="hill-day-celebration__flag">REGISTRATION CLOSED</span><span className="hill-day-celebration__date">SEE YOU WEDNESDAY, NOVEMBER 18</span></div>
    <div className="hill-day-celebration__lead"><div><p className="hill-day-celebration__kicker">A community ready to make its voice heard</p><strong className="hill-day-celebration__number">{count}</strong><span className="hill-day-celebration__number-label">people registered</span></div><div className="hill-day-celebration__note"><h2>Many voices.<br/>One Capitol.</h2><p>Scholars, educators, advocates, and partners are coming together for a day of conversations that matter.</p></div></div>
    <div className="hill-day-celebration__stats"><div><strong>9</strong><span>delegation groups</span></div><div><strong>15</strong><span>congressional appointments</span></div><div><strong>5</strong><span>partner-led delegations</span></div></div>
    <div className="hill-day-celebration__groups">
      <div className="hill-day-celebration__groups-head"><p className="hill-day-celebration__groups-label">NINE DELEGATIONS. ONE SHARED PURPOSE.</p><span className="hill-day-celebration__groups-hint">THE PEOPLE BEHIND THE DAY</span></div>
      <div className="hill-day-celebration__parade" aria-label="Participating delegations">
        <div className="hill-day-celebration__parade-track">
          <div className="hill-day-celebration__parade-set">
            <span>Maya Scholars A</span><span>Maya Scholars B</span><span>Maya Scholars C</span><span>Maya Scholars D</span><span>Tutoring Café A</span><span>Tutoring Café B</span><span>Black Swan Academy</span><span>Georgetown / Sasha Bruce</span><span>Youth Justice Partners</span>
          </div>
          <div className="hill-day-celebration__parade-set" aria-hidden="true">
            <span>Maya Scholars A</span><span>Maya Scholars B</span><span>Maya Scholars C</span><span>Maya Scholars D</span><span>Tutoring Café A</span><span>Tutoring Café B</span><span>Black Swan Academy</span><span>Georgetown / Sasha Bruce</span><span>Youth Justice Partners</span>
          </div>
        </div>
      </div>
    </div><div className="hill-day-celebration__footer"><span>FROM SILOS TO SOLUTIONS</span><span>POWER THROUGH PARTNERSHIPS</span></div>
    <p className="hill-day-celebration__fineprint">Registration total reflects sign-ups, not a final attendance headcount. Student permissions and individual delegation assignments are managed separately.</p>
  </div>
</section>
 <section className="context-grid"><article className="panel story-panel story-panel--accent"><p className="eyebrow">WHY WE'RE GOING</p><h2>Every young person deserves a path through education</h2><p>Scholars will talk with congressional offices about education, justice-system involvement, and the support young people need to stay in school or return to learning.</p></article>
 <article className="panel story-panel"><p className="eyebrow">WHAT TO EXPECT</p><h2>Conversations led by student experience</h2><p>Nine delegations are preparing for their congressional conversations. Registered attendees should review their group materials and follow their designated adult lead; student permissions and final travel approval remain separate.</p></article></section>
 <section className="panel hill-day-closed-notice" aria-label="Registration status"><p className="eyebrow">REGISTRATION CLOSED</p><h2>We're grateful you're part of this.</h2><p>Registration for the November 18 Advocacy Hill Day has ended. If you're already participating, please use the <Link href="/attendee/briefings">attendee briefing portal</Link> and coordinate directly with your delegation lead. Questions? <a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Question">Contact the organizing team</a>.</p></section>
 <section id="schedule" className="panel callout-panel"><p className="eyebrow">EVENT SCHEDULE</p><h2>Our plan for November 18</h2><p className="muted">Check in at Maya Angelou Public Charter High School, 5600 East Capitol Street NE, between 9:45 and 10:00 a.m. Training begins at 10:00 a.m., lunch is at 10:45 a.m., and Sprinter transportation is planned to depart beginning at 11:15 a.m. Congressional meetings start from 12:30 p.m. after security screening.</p><div className="timeline-grid">{schedule.map(item=><article className="timeline-card" key={item.title}><p className="timeline-card__label">{item.time}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
 <section className="panel callout-panel"><p className="eyebrow">CONGRESSIONAL ENGAGEMENT</p><h2>Congressional conversations on November 18</h2>
 <p>On November 18, nine student and community delegations will meet with congressional offices and committee staff about educational opportunity, juvenile justice, and reentry. The 15 agreed appointments include Senator Hirono’s office at 2:30 p.m. A separate, brief photo opportunity with Representative Glenn Ivey is not counted as a formal meeting.</p>
 <p className="muted">Some offices still have room-capacity or arrival details to confirm. Final individual delegation assignments, attendee names, and any changes will be provided privately to participating groups.</p>
 <div className="timeline-grid">{scheduledMeetings.map(item=><article className="timeline-card" key={item.office}><p className="timeline-card__label">{item.time} · {item.location}</p><h3>{item.office}</h3><p>{item.detail}</p></article>)}</div>
 <p className="muted">Additional meeting requests remain under discussion. Only confirmed appointments appear above. Participants should use their private portal for their own group documents and any updated instructions.</p>
 <p className="muted" style={{marginTop:"1rem"}}>A meeting with congressional staff does not mean a Member of Congress will personally attend or endorse FS2S recommendations. Meeting details may change due to congressional business.</p>
 </section>
 <section className="panel callout-panel" id="participation"><p className="eyebrow">COMMUNITY PARTICIPATION</p><h2>Students, educators, and community partners</h2><p>Seventy-five participants have registered from schools, youth organizations, and community partners working to expand opportunity for young people. Nine delegations will bring distinct perspectives to Capitol Hill.</p><p>We celebrate <strong>Maya Angelou Scholars A, B, C, and D</strong>, <strong>Tutoring Café A and B</strong>, <strong>Black Swan Academy</strong>, <strong>Georgetown / Sasha Bruce</strong>, and <strong>Youth Justice Partners</strong>—alongside the educators, advocates, and community members helping their voices reach Congress.</p><p className="muted">Individual participation and student arrangements will be confirmed by the organizing team.</p></section>
 <section className="panel callout-panel" id="sponsor"><p className="eyebrow">SPONSOR ADVOCACY HILL DAY</p><h2>Help provide lunch for 100 participants</h2><p>We are seeking a <strong>$2,000 lunch sponsorship</strong> or an in-kind contribution of approximately 100 meals for students, educators and community partners on November 18. The See Forever Foundation can accept a charitable contribution directly. A smaller contribution or an introduction to a potential catering partner is also welcome.</p><p>Sponsors may be recognized at the event and on this website. Please contact our team to discuss details.</p><div className="hero-actions"><a className="button button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Lunch%20Sponsorship">Discuss sponsorship</a><a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20In-Kind%20Lunch%20Donation">Offer meals or an introduction</a></div></section>
 <section className="panel story-panel"><p className="eyebrow">QUESTIONS & PARTNERSHIPS</p><h2>Questions or partnership ideas?</h2><p>Registration is closed, but questions from registered participants and outreach from community partners are always welcome.</p><div className="hero-actions"><a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20-%20November%2018" className="button button-link">Contact FS2S</a><Link href="/" className="button-secondary button-link">Discover FS2S 2027</Link></div></section>
 </div>
}