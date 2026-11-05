import type { Metadata } from "next";
import Link from "next/link";
import { LobbyDaySignupForm } from "@/components/lobby-day-signup-form";
import { getPublicLobbyDaySignupCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"November 18, 2026 Advocacy Hill Day | FS2S",description:"Join the FS2S Advocacy Hill Day on November 18, 2026, featuring Maya Angelou Scholars, community partners, and congressional conversations.",path:"/lobby-day"});
const confirmedMeetings = [
 { office: "Congresswoman Adelita S. Grijalva", detail: "Confirmed meeting with the Congresswoman" },
 { office: "Delegate Eleanor Holmes Norton’s office", detail: "Confirmed meeting with congressional staff" },
 { office: "Senator Brian Schatz’s office", detail: "Confirmed meeting with education policy staff" },
 { office: "Congresswoman Suzanne Bonamici’s office", detail: "Confirmed meeting with education policy staff" },
 { office: "Congressman Jim Jordan’s office", detail: "Confirmed meeting with congressional staff" }
];
const meetingsInProgress = [
 "Congressman Juan Ciscomani’s office",
 "Senate HELP Committee staff",
 "Congressman Kevin Kiley’s office",
 "Senator Patty Murray’s office",
 "Senator Dick Durbin’s office",
 "Congresswoman Jahana Hayes’s office",
 "Congresswoman Terri Sewell’s office",
 "Senator Josh Hawley’s office",
 "Congressman Gary Palmer’s office",
 "Senator Elissa Slotkin’s office",
 "Congressman Adam Gray’s office"
];
const schedule = [
 {time:"Around 10:00 a.m.",title:"Morning gathering and advocacy preparation",description:"Target arrival and opening programming, including check-in, student voice, briefings and delegation preparation. Exact venue and final arrival instructions will follow."},
 {time:"11:30 a.m.",title:"Lunch (funding and catering in progress)",description:"We are arranging lunch for participants ahead of congressional meetings. Sponsorship, menu, dietary arrangements and meal location are not yet confirmed."},
 {time:"12:30 p.m.",title:"Congressional advocacy begins",description:"Scholar and partner delegations begin afternoon lobbying visits. Each office appointment and delegation assignment will be confirmed separately."},
 {time:"Afternoon",title:"Congressional meetings and advocacy conversations",description:"Small groups visit congressional offices to discuss education, juvenile justice, reentry and opportunity. Exact meeting times vary by office."},
 {time:"Before departure",title:"Closing check-in",description:"Attendance reconciliation, takeaways and next steps for continued advocacy."}
];
export default async function LobbyDayPage(){
 const count=await getPublicLobbyDaySignupCount();
 return <div className="container stack">
 <section className="hero-card hero-card--landing hill-day-hero"><div className="hero-card__grid"><div className="hero-card__content">
  <p className="eyebrow">FS2S ADVOCACY HILL DAY • WASHINGTON, D.C.</p>
  <h1 className="hill-day-hero__title"><span><em>Our</em> <strong className="hill-day-word hill-day-word--stories">Stories.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--schools">Schools.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--capitol">Capitol.</strong></span></h1>
  <p className="hero-kicker">Wednesday, November 18, 2026 — moving from silos to solutions, together.</p>
  <p>See Forever Foundation and Maya Angelou Schools are convening scholars, educators and partners to advocate for educational opportunity, continuity and stronger pathways for young people affected by the justice system. Our working goal is approximately 125 participants, including 50 Maya Angelou Scholars.</p>
  <div className="hero-meta"><span className="hero-pill">November 18, 2026</span><span className="hero-pill">Capitol Hill, Washington, D.C.</span><span className="hero-pill">Morning gathering ~10 AM • Lunch 11:30 AM • Advocacy from 12:30 PM</span></div>
  <div className="hero-actions"><a href="#register" className="button button-link">Register your interest</a><a href="#schedule" className="button-secondary button-link">See the tentative day</a></div>
 </div><div className="hero-card__visual"><div className="hero-photo hero-photo--dc"><span className="hero-photo__label">The Hill, together</span></div><div className="hero-photo hero-photo--community"><span className="hero-photo__label">Students at the center</span></div><div className="hero-photo hero-photo--conference"><span className="hero-photo__label">Partners in action</span></div></div></div>  <div className="hill-day-momentum" aria-label={`${count} people registered toward a goal of 125`}>
    <div className="hill-day-momentum__header"><span className="hill-day-momentum__eyebrow">THE ROAD TO THE HILL</span><span className="hill-day-momentum__live"><span aria-hidden="true" />LIVE REGISTRATION COUNT</span></div>
    <div className="hill-day-momentum__headline"><div className="hill-day-momentum__stat"><strong>{count}<small> / 125</small></strong><span>people registered</span></div><div className="hill-day-momentum__message"><b>Voices joining the movement</b><span>Every registration brings us closer.</span></div></div>
    <div className="hill-day-momentum__track" role="progressbar" aria-label="Registrations toward 125 participant goal" aria-valuemin={0} aria-valuemax={125} aria-valuenow={Math.min(count,125)}>
      <div className="hill-day-momentum__fill" style={{width:`${Math.min((count/125)*100,100)}%`}} />
      <span className="hill-day-momentum__current" style={{left:`${Math.min((count/125)*100,100)}%`}} aria-hidden="true">★</span>
    </div>
    <div className="hill-day-momentum__footer"><span><b>{Math.round((count/125)*100)}%</b> of our goal</span><span><b>{Math.max(125-count,0)}</b> registrations to go · Goal: 125</span></div>
    <p className="hill-day-momentum__note">Registration expresses interest. Attendance and congressional meeting assignments are confirmed separately.</p>
  </div>
</section>
 <section className="context-grid"><article className="panel story-panel story-panel--accent"><p className="eyebrow">WHY WE'RE GOING</p><h2>Education should not end at a system's doorway</h2><p>Our Hill Day invites lawmakers and their staff to hear directly about the educational realities of opportunity and justice-involved youth. We will center pathways back into learning, educational continuity, and what meaningful second chances require.</p></article>
 <article className="panel story-panel"><p className="eyebrow">WHAT TO EXPECT</p><h2>Small groups. Serious conversations.</h2><p>Delegations will be assigned once offices confirm meeting times and capacity. Each group will prepare talking points and stories. Registration expresses interest; it is not a guaranteed meeting assignment or approval for student travel.</p></article></section>
 <section id="register"><LobbyDaySignupForm totalCount={count}/><p className="muted" style={{fontSize:"0.87rem"}}>For Maya Angelou Scholars, parental permission, school approval and applicable supervision requirements will be managed separately. Do not share private student case information in this form. Registration is subject to final confirmation.</p></section>
 <section id="schedule" className="panel callout-panel"><p className="eyebrow">TENTATIVE RUN OF SHOW</p><h2>What Wednesday could look like</h2><p className="muted">Our target is a gathering around 10:00 a.m., lunch provided at 11:30 a.m., and congressional lobbying beginning at 12:30 p.m. The venue, detailed agenda, transportation and individual office appointments remain subject to confirmation.</p><div className="timeline-grid">{schedule.map(item=><article className="timeline-card" key={item.title}><p className="timeline-card__label">{item.time}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
 <section className="panel callout-panel"><p className="eyebrow">CONGRESSIONAL ENGAGEMENT</p><h2>Bringing student voices to Capitol Hill</h2><p>Our Scholars will meet with congressional offices to discuss educational opportunity, juvenile justice, and pathways forward for young people. We are pleased to have confirmed conversations with the following offices:</p><div className="timeline-grid">{confirmedMeetings.map(item=><article className="timeline-card" key={item.office}><h3>{item.office}</h3><p>{item.detail}</p></article>)}</div><h3 style={{marginTop:"1.5rem"}}>Additional meetings being coordinated</h3><p>We have also been in touch with the following congressional offices and committee staff about potential meetings. Some staff have offered times that we have accepted, while others remain in scheduling discussions.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.65rem"}}>{meetingsInProgress.map(office=><div key={office} className="session-info-pill"><strong>{office}</strong></div>)}</div><p className="muted" style={{marginTop:"1rem"}}>Only the meetings above labeled confirmed are finalized. Appointment times and delegation assignments will be shared directly with participants. Outreach and meetings do not imply congressional endorsement.</p></section>
 <section className="panel callout-panel" id="participation"><p className="eyebrow">COMMUNITY PARTICIPATION</p><h2>Students, educators, and community partners</h2><p>We are bringing together Maya Angelou Scholars, educators, and organizations working to expand educational opportunities for young people. Our goal is approximately 125 participants, including 50 Scholars.</p><p>We are pleased to welcome participation from <strong>School Justice Project</strong> and <strong>Free Minds Book Club &amp; Writing Workshop</strong>. More partners will be announced as participation is confirmed.</p><p className="muted">Registration expresses interest; final attendance and student arrangements are confirmed separately.</p></section>
 <section className="panel callout-panel" id="sponsor"><p className="eyebrow">SPONSOR ADVOCACY HILL DAY</p><h2>Help provide lunch for 100 participants</h2><p>We are seeking a <strong>$2,000 lunch sponsorship</strong> or an in-kind contribution of approximately 100 meals for students, educators and community partners on November 18. The See Forever Foundation can accept a charitable contribution directly. A smaller contribution or an introduction to a potential catering partner is also welcome.</p><p>We are coordinating potential sponsorships with our Institutional Advancement team. Sponsorship recognition may include acknowledgment during the event and on this website, subject to agreement. No lunch sponsor has been confirmed.</p><div className="hero-actions"><a className="button button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Lunch%20Sponsorship">Discuss sponsorship</a><a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20In-Kind%20Lunch%20Donation">Offer meals or an introduction</a></div></section>
 <section className="panel story-panel"><p className="eyebrow">QUESTIONS & PARTNERSHIPS</p><h2>Help us make the day meaningful</h2><p>Community partners interested in participating, helping with student preparation, or sponsoring lunch can contact the project lead. We welcome thoughtful collaboration and practical support.</p><div className="hero-actions"><a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20-%20November%2018" className="button button-link">Contact FS2S</a><Link href="/" className="button-secondary button-link">Discover FS2S 2027</Link></div></section>
 </div>
}