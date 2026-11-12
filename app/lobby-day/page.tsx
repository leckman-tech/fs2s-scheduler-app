import type { Metadata } from "next";
import Link from "next/link";
import { LobbyDaySignupForm } from "@/components/lobby-day-signup-form";
import { getPublicLobbyDaySignupCount } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"November 18, 2026 Advocacy Hill Day | FS2S",description:"Join the FS2S Advocacy Hill Day on November 18, 2026, featuring Maya Angelou Scholars, community partners, and congressional conversations.",path:"/lobby-day"});
const confirmedMeetings = [
 { office: "Congresswoman Adelita S. Grijalva", detail: "November 18, 3:00–3:30 p.m. • Longworth 1203 • meeting with the Congresswoman" },
 { office: "Delegate Eleanor Holmes Norton’s office", detail: "November 18, 2:00–2:30 p.m. • Rayburn 2136 • meeting with congressional staff" },
 { office: "Senator Brian Schatz’s office", detail: "November 18, 2:30 p.m. • Hart 722 • education policy staff meeting" },
 { office: "Congresswoman Suzanne Bonamici’s office", detail: "November 18, 2:00 p.m. • Rayburn 2231 • education policy staff meeting" },
 { office: "Congressman Jim Jordan’s office", detail: "November 18, 1:00 p.m. • Rayburn 2056 • confirmed staff meeting" },
 { office: "Senate HELP Committee Democratic staff", detail: "November 18, 1:00–1:30 p.m. • Hart 632 • confirmed committee staff meeting" },
 { office: "Senator Chris Van Hollen’s office", detail: "November 18, 3:00 p.m. • Hart 730 • meeting with Brendan Flynn; day-of contact supplied" }
];
const meetingsAcceptedPendingFinalDetails = [
 "Congresswoman Terri Sewell’s office — 12:30 p.m. accepted; final acknowledgment pending (1035 Longworth)",
 "Senator Dick Durbin’s / Senate Judiciary staff — 1:00 p.m. accepted; final acknowledgment pending (Hart 711)",
 "House Education and Workforce Committee staff — 1:30 p.m. with Eli Mitchell accepted November 12; final acknowledgment pending (Rayburn 2257)",
 "Congressman Kevin Kiley’s office — 1:00 p.m. with Carson Cameron accepted November 12; calendar invitation and acknowledgment pending (Rayburn 2445)",
 "Congressman Juan Ciscomani’s office — 1:30 p.m. with Cameron Fox accepted and reconfirmed November 12; final office and room acknowledgment pending (461 Cannon)",
 "Senator Patty Murray’s office — 1:30 p.m. on November 18 confirmed by scheduler Abby Laver on November 12; meeting room still to be provided"
];
const meetingsInProgress = [
 "Senator Gary Peters’s office — staff introductions followed up; time pending",
 "Senate HELP Committee Republican staff — Brianna Tibbetts offered to meet; time not verified in correspondence",
 "Congresswoman Jahana Hayes’s office — 10:00 a.m. offered; seeking an afternoon alternative",
 "Senator Josh Hawley’s office",
 "Congressman Gary Palmer’s office — policy staff referral",
 "Congresswoman Lucy McBath’s office — staff referral",
 "Senator Angela Alsobrooks’s office — policy staff referral",
 "Senator Elissa Slotkin’s office",
 "Congressman Adam Gray’s office"
];
const schedule = [
 {time:"Around 10:00 a.m.",title:"Morning gathering and advocacy preparation",description:"Target arrival and opening programming, including check-in, student voice, briefings and delegation preparation. Exact venue and final arrival instructions will follow."},
 {time:"11:30 a.m.",title:"Lunch break",description:"Lunch arrangements are being finalized. We will share details with registered participants."},
 {time:"12:30 p.m.",title:"Congressional advocacy begins",description:"Scholar and partner delegations begin afternoon lobbying visits. Each office appointment and delegation assignment will be confirmed separately."},
 {time:"Afternoon",title:"Congressional meetings and advocacy conversations",description:"Small groups visit congressional offices to discuss education, juvenile justice, reentry and opportunity. Exact meeting times vary by office."},
 {time:"Before departure",title:"Wrap-up and next steps",description:"Delegations will reconnect, share takeaways, and discuss next steps."}
];
export default async function LobbyDayPage(){
 const count=await getPublicLobbyDaySignupCount();
 return <div className="container stack">
 <section className="hero-card hero-card--landing hill-day-hero"><div className="hero-card__grid"><div className="hero-card__content">
  <p className="eyebrow">FS2S ADVOCACY HILL DAY • WASHINGTON, D.C.</p>
  <h1 className="hill-day-hero__title"><span><em>Our</em> <strong className="hill-day-word hill-day-word--stories">Stories.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--schools">Schools.</strong></span><span><em>Our</em> <strong className="hill-day-word hill-day-word--capitol">Capitol.</strong></span></h1>
  <p className="hero-kicker">Wednesday, November 18, 2026 — moving from silos to solutions, together.</p>
  <p>See Forever Foundation and Maya Angelou Schools are convening scholars, educators and partners to advocate for educational opportunity, continuity and stronger pathways for young people affected by the justice system. We hope to bring together 125 participants, including approximately 50 Maya Angelou Scholars.</p>
  <div className="hero-meta"><span className="hero-pill">November 18, 2026</span><span className="hero-pill">Capitol Hill, Washington, D.C.</span><span className="hero-pill">Morning gathering ~10 AM • Lunch 11:30 AM • Advocacy from 12:30 PM</span></div>
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
 <section className="panel callout-panel"><p className="eyebrow">CONGRESSIONAL ENGAGEMENT</p><h2>Bringing student voices to Capitol Hill</h2><p>Our Scholars will meet with congressional offices to discuss educational opportunity, juvenile justice, and pathways forward for young people. We are pleased to have confirmed conversations with the following offices:</p><div className="timeline-grid">{confirmedMeetings.map(item=><article className="timeline-card" key={item.office}><h3>{item.office}</h3><p>{item.detail}</p></article>)}</div><h3 style={{marginTop:"1.5rem"}}>Appointments accepted; final arrangements pending</h3><p>Our team has accepted these proposed times. We will share the final details once the offices complete scheduling.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.65rem"}}>{meetingsAcceptedPendingFinalDetails.map(office=><div key={office} className="session-info-pill"><strong>{office}</strong></div>)}</div><h3 style={{marginTop:"1.5rem"}}>Additional meetings being coordinated</h3><p>We have also been in touch with the following congressional offices and committee staff about potential meetings. Some offices have offered meeting times; we are working to finalize the remaining arrangements.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.65rem"}}>{meetingsInProgress.map(office=><div key={office} className="session-info-pill"><strong>{office}</strong></div>)}</div><p className="muted" style={{marginTop:"1rem"}}>Final meeting details will be shared with each delegation. Participation in a meeting does not imply congressional endorsement.</p></section>
 <section className="panel callout-panel" id="participation"><p className="eyebrow">COMMUNITY PARTICIPATION</p><h2>Students, educators, and community partners</h2><p>We are bringing together Maya Angelou Scholars, educators, and organizations working to expand educational opportunities for young people. Our goal is approximately 125 participants, including 50 Scholars.</p><p>We're glad to have participants from <strong>School Justice Project</strong> and <strong>Free Minds Book Club &amp; Writing Workshop</strong>. More partners will be announced as participation is confirmed.</p><p className="muted">Individual participation and student arrangements will be confirmed by the organizing team.</p></section>
 <section className="panel callout-panel" id="sponsor"><p className="eyebrow">SPONSOR ADVOCACY HILL DAY</p><h2>Help provide lunch for 100 participants</h2><p>We are seeking a <strong>$2,000 lunch sponsorship</strong> or an in-kind contribution of approximately 100 meals for students, educators and community partners on November 18. The See Forever Foundation can accept a charitable contribution directly. A smaller contribution or an introduction to a potential catering partner is also welcome.</p><p>Sponsors may be recognized at the event and on this website. Please contact our team to discuss details.</p><div className="hero-actions"><a className="button button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20Lunch%20Sponsorship">Discuss sponsorship</a><a className="button-secondary button-link" href="mailto:LEckman@SeeForever.org?subject=FS2S%20In-Kind%20Lunch%20Donation">Offer meals or an introduction</a></div></section>
 <section className="panel story-panel"><p className="eyebrow">QUESTIONS & PARTNERSHIPS</p><h2>Questions or partnership ideas?</h2><p>Interested in attending, preparing students for their meetings, or helping provide lunch? We'd be glad to hear from you.</p><div className="hero-actions"><a href="mailto:LEckman@SeeForever.org?subject=FS2S%20Advocacy%20Hill%20Day%20-%20November%2018" className="button button-link">Contact FS2S</a><Link href="/" className="button-secondary button-link">Discover FS2S 2027</Link></div></section>
 </div>
}