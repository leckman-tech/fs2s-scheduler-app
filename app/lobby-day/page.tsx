import type { Metadata } from "next";
import Link from "next/link";
import { LobbyDaySignupForm } from "@/components/lobby-day-signup-form";
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
 { time: "2:00 p.m.", office: "Sen. Gary Peters's office", location: "Senate office (exact room pending)", detail: "Meeting with staff member Ava Kelsey; offered and accepted in writing November 13" },
 { time: "2:30 p.m.", office: "Sen. Brian Schatz's office", location: "722 Hart", detail: "Education policy staff conversation" },
 { time: "2:30–3:00 p.m.", office: "Rep. Gary Palmer's office", location: "170 Cannon (office address)", detail: "In-person meeting booked with Legislative Aide Hampton Neugent; exact room to verify" },
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
 {time:"9:45–10:00 a.m.",title:"Arrival at Maya",description:"Participants meet at Maya Angelou Public Charter High School for check-in and delegation introductions."},
 {time:"10:00–10:45 a.m.",title:"Advocacy training and practice",description:"Review the congressional briefings distributed in advance, meet your delegation, rehearse openings and questions, and get ready for the afternoon."},
 {time:"10:45–11:05 a.m.",title:"Lunch at Maya",description:"Lunch is planned for participants before travel."},
 {time:"11:05–11:15 a.m.",title:"Bus loading and headcount",description:"Join your assigned bus and stay with your delegation leader."},
 {time:"11:15 a.m. (target)",title:"Buses depart for Capitol Hill",description:"Travel, unloading, building entry and security screening are being coordinated. Exact arrival times will be shared after transportation is confirmed."},
 {time:"12:30–3:30 p.m.",title:"Congressional visits and group reflection",description:"Fourteen office and committee appointments are agreed across nine delegations. Activity choices, room capacities and individual arrangements are still being finalized."},
 {time:"3:30–4:00 p.m. (target)",title:"Wrap-up and accountability",description:"Delegations report key takeaways, check in with staff and follow their supervised return instructions."}
];
export default async function LobbyDayPage(){
 const count=await getPublicLobbyDaySignupCount();
 return <div className="container stack">
 <section className="hero-card hero-card--landing hill-day-hero"><div className="hero-card__grid"><div className="hero-card__content">
  <p className="eyebrow">FS2S ADVOCACY HILL DAY • WASHINGTON, D.C.</p>
  <h1 className="hill-day-hero__title"><span><em>Our</em> <strong className="hill-day-word hill-day-word--stories">Stories.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--schools">Schools.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--capitol">Capitol.</strong></span></h1>
  <p className="hero-kicker">Wednesday, November 18, 2026 — moving from silos to solutions, together.</p>
  <p>See Forever Foundation and Maya Angelou Schools are convening scholars, educators and partners to advocate for educational opportunity, continuity and stronger pathways for young people affected by the justice system. We hope to bring together 125 participants, including approximately 50 Maya Angelou Scholars.</p>
  <div className="hero-meta"><span className="hero-pill">November 18, 2026</span><span className="hero-pill">Capitol Hill, Washington, D.C.</span><span className="hero-pill">At Maya 9:45 AM • Training 10–10:45 AM • Lunch 10:45 AM • Buses 11:15 AM</span></div>
  <div className="hero-actions"><a href="#register" className="button button-link">Register your interest</a><a href="#schedule" className="button-secondary button-link">View the day's schedule</a></div>
 </div><div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">The Hill, together</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Students at the center</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Partners in action</span></div></div></div>  <div className="hill-day-momentum" aria-label={`${count} people registered toward a goal of 125`}>
    <div className="hill-day-momentum__header"><span className="hill-day-momentum__eyebrow">THE ROAD TO THE HILL</span><span className="hill-day-momentum__live"><span aria-hidden="true" />LIVE REGISTRATION COUNT</span></div>
    <div className="hill-day-momentum__headline"><div className="hill-day-momentum__stat"><strong>{count}<small> / 125</small></strong><span>people registered</span></div><div className="hill-day-momentum__message"><b>People planning to join us</b><span>Help us reach our goal.</span></div></div>
    <div className="hill-day-momentum__track" role="progressbar" aria-label="Registrations toward 125 participant goal" aria-valuemin={0} aria-valuemax={125} aria-valuenow={Math.min(count,125)}>
      <div className="hill-day-momentum__fill" style={{width:`${Math.min((count/125)*100,100)}%`}} />
      <span className="hill-day-momentum__current" style={{left:`${Math.min((count/125)*100,100)}%`}} aria-hidden="true">★</span>
    </div>
    <div className="hill-day-momentum__footer"><span><b>{Math.round((count/125)*100)}%</b> of our goal</span><span><b>{Math.max(125-count,0)}</b> registrations to go · Goal: 125</span></div>
    <p className="hill-day-momentum__note">Registration expresses interest. Attendance and congressional meeting assignments are confirmed separately.</p>
  </div>
</section>
 <section className="context-grid"><article className="panel story-panel story-panel--accent"><p className="eyebrow">WHY WE'RE GOING</p><h2>Every young person deserves a path through education</h2><p>Scholars will talk with congressional offices about education, justice-system involvement, and the support young people need to stay in school or return to learning.</p></article>
 <article className="panel story-panel"><p className="eyebrow">WHAT TO EXPECT</p><h2>Conversations led by student experience</h2><p>Delegations will be assigned once offices confirm meeting times and capacity. Each group will prepare talking points and stories. Registration expresses interest; it is not a guaranteed meeting assignment or approval for student travel.</p></article></section>
 <section id="register"><LobbyDaySignupForm totalCount={count}/><p className="muted" style={{fontSize:"0.87rem"}}>For Maya Angelou Scholars, parental permission, school approval and applicable supervision requirements will be managed separately. Do not share private student case information in this form. Registration is subject to final confirmation.</p></section>
 <section id="schedule" className="panel callout-panel"><p className="eyebrow">EVENT SCHEDULE</p><h2>Our plan for November 18</h2><p className="muted">We plan to gather around 10:00 a.m., break for lunch at 11:30 a.m., and begin congressional meetings at 12:30 p.m. Participants will receive the final location and travel details before the event.</p><div className="timeline-grid">{schedule.map(item=><article className="timeline-card" key={item.title}><p className="timeline-card__label">{item.time}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
 <section className="panel callout-panel"><p className="eyebrow">CONGRESSIONAL ENGAGEMENT</p><h2>13 congressional conversations scheduled</h2>
 <p>On November 18, student and community delegations will meet with congressional offices and committee staff about educational opportunity, juvenile justice, and reentry. Each appointment listed below has an agreed time, including the newly booked 2:30 p.m. conversation with Rep. Gary Palmer's staff.</p>
 <p className="muted">Some offices still have room-capacity or arrival details to confirm. Final individual delegation assignments, attendee names, and any changes will be provided privately to participating groups.</p>
 <div className="timeline-grid">{scheduledMeetings.map(item=><article className="timeline-card" key={item.office}><p className="timeline-card__label">{item.time} · {item.location}</p><h3>{item.office}</h3><p>{item.detail}</p></article>)}</div>
 <h3 style={{marginTop:"1.5rem"}}>Additional conversations in progress</h3><p>These offices have been contacted, but no afternoon appointment has been finalized:</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.65rem"}}>{meetingsInProgress.map(office=><div key={office} className="session-info-pill"><strong>{office}</strong></div>)}</div>
 <p className="muted" style={{marginTop:"1rem"}}>A meeting with congressional staff does not mean a Member of Congress will personally attend or endorse FS2S recommendations. Meeting details may change due to congressional business.</p>
 </section>
 <section className="panel callout-panel" id="participation"><p className="eyebrow">COMMUNITY PARTICIPATION</p><h2>Students, educators, and community partners</h2><p>We are bringing together Maya Angelou Scholars, educators, and organizations working to expand educational opportunities for young people. Our goal is approximately 125 participants, including 50 Scholars.</p><p>We're glad to have participants from <strong>School Justice Project</strong> and <strong>Free Minds Book Club &amp; Writing Workshop</strong>. More partners will be announced as participation is confirmed.</p><p className="muted">Individual participation and student arrangements will be confirmed by the organizing team.</p></section>
 <section className="panel callout-panel" id="sponsor"><p className="eyebrow">SPONSOR ADVOCACY HILL DAY</p><h2>Help provide lunch for 100 participants</h2><p>We are seeking a <strong>$2,000 lunch sponsorship</strong> or an in-kind contribution of approximately 100 meals for students, educators and community partners on November 18. The See Forever Foundation can accept a charitable contribution directly. A smaller contribution or an introduction to a potential catering partner is also welcome.</p><p>Sponsors may be recognized at the event and on this website. Please contact our team to discuss details.</p><div className="hero-actions"><a className="button button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Lunch%20Sponsorship">Discuss sponsorship</a><a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20In-Kind%20Lunch%20Donation">Offer meals or an introduction</a></div></section>
 <section className="panel story-panel"><p className="eyebrow">QUESTIONS & PARTNERSHIPS</p><h2>Questions or partnership ideas?</h2><p>Interested in attending, preparing students for their meetings, or helping provide lunch? We'd be glad to hear from you.</p><div className="hero-actions"><a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20-%20November%2018" className="button button-link">Contact FS2S</a><Link href="/" className="button-secondary button-link">Discover FS2S 2027</Link></div></section>
 </div>
}