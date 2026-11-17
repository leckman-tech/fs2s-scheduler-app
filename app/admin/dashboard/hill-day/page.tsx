import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
export const metadata: Metadata = buildMetadata({title:"Hill Day Delegations | FS2S Admin",description:"Private planning view for November 18 congressional delegation operations.",path:"/admin/dashboard/hill-day",noIndex:true});
const groups = [{id:"D01",name:"Tutoring Café A",lead:"Chief Leah Lamb",size:7,people:"5 partners + 1 Maya Scholar",visits:[["1:00 p.m.","Senate HELP Democratic staff","Hart 632"],["2:30 p.m.","Sen. Brian Schatz staff","Hart 722"]],gap:"Allow 10–15 minutes after HELP for decompression, then remain on Senate side."},
{id:"D02",name:"Tutoring Café B",lead:"Dr. Cheryl Chun",size:8,people:"4 partners + 3 Maya Scholars",visits:[["1:00 p.m.","Rep. Kevin Kiley staff","Rayburn 2445"],["2:00 p.m.","Rep. Suzanne Bonamici staff","Rayburn 2231"]],gap:"Debrief after Kiley; allow Rayburn transfer and check-in before 2:00. Verify eight-person capacity."},
{id:"D03",name:"Black Swan Academy",lead:"Adult SFF Lead",size:7,people:"5 partners + 1 Maya Scholar",visits:[["1:00 p.m.","Rep. Jim Jordan staff","Rayburn 2138"],["2:00–2:30 p.m.","Del. Eleanor Holmes Norton staff","Rayburn 2136"]],gap:"Norton reassigned to the partner delegation; use the 1:30–1:50 interval to reflect and transfer within Rayburn."},
{id:"D04",name:"Georgetown / Sasha Bruce",lead:"Dr. Kamal Wright-Cunningham",size:8,people:"4 partners + 3 Maya Scholars",visits:[["12:30 p.m.","Rep. Terri Sewell staff","Longworth 1035"],["3:00–3:30 p.m.","Rep. Adelita Grijalva","Longworth 1203"]],gap:"Extended supervised downtime for debrief and practice; return early for 3:00 appointment."},
{id:"D05",name:"Youth Justice Partners",lead:"Dr. Mendoza-Davis (1 PM) / Chief Cannon (2 PM)",size:6,people:"3 partners + 2 Maya Scholars",visits:[["1:00 p.m.","Sen. Dick Durbin / Judiciary staff","Hart 711"],["2:00 p.m.","Sen. Gary Peters staff — Ava Kelsey","Hart 724"]],gap:"Allow 10–15 minutes to decompress and travel. Peters confirmed Hart 724, South entrance via Constitution Avenue (metal detector screening); CMD covers the 1 PM Durbin meeting; Chief Cannon takes over for the 2 PM Peters meeting. Verify office capacity and handoff."},
{id:"D06",name:"Maya Scholars A",lead:"Mekhi Love",size:7,people:"6 Maya Scholars",visits:[["12:30 p.m.","Rep. Lucy McBath staff — Matthew Golden","Rayburn 2246"],["1:30 p.m.","House Education & Workforce staff","Rayburn 2257"]],gap:"McBath confirmed 12:30 p.m. on November 17. Remain in Rayburn between meetings; allow time for arrival screening."},
{id:"D07",name:"Maya Scholars B",lead:"Ciara Norfleet",size:7,people:"6 Maya Scholars",visits:[["1:30 p.m.","Sen. Patty Murray staff","Russell 154"],["2:30 p.m.","Sen. Mazie Hirono staff — Ben Strand","Hart 109; capacity confirmed"]],gap:"Arrive for Murray by 1:15 p.m. Transfer from Russell 154 to Hart 109 for Hirono at 2:30 p.m. Group capacity confirmed by the office."},
{id:"D08",name:"Maya Scholars C",lead:"De'Aysia Barner",size:6,people:"5 Maya Scholars",visits:[["1:00 p.m.","Sen. Elissa Slotkin staff","Russell 291"],["2:30 p.m.","Rep. Gary Palmer staff — Hampton Neugent","Cannon 170 (exact room TBD)"]],gap:"Enter Russell at 1st and Constitution NE. Allow ample travel and screening time before Palmer."},
{id:"D09",name:"Maya Scholars D",lead:"Deputy Chief Nora Shetty and Surya Srirangarajan",size:6,people:"4 Maya Scholars",visits:[["1:30 p.m.","Rep. Ayanna Pressley staff","Cannon 402 (published office; exact room pending)"],["2:30 p.m.","Rep. Glenn Ivey — photo opportunity","House-side Capitol Steps"],["3:00 p.m.","Sen. Chris Van Hollen staff","Hart 730"]],gap:"Leave the Capitol steps by 2:35 PM; prioritize the 3 PM Senate appointment. Hart office capacity is six. Photo permissions required."}];
const morning = [
["9:45–10:00 a.m.","Maya arrival, check-in and delegation introductions"],
["10:00–10:45 a.m.","Advocacy training, meeting briefs and group practice — pre-reading required"],
["10:45–11:05 a.m.","Provided lunch at Maya"],
["11:05–11:15 a.m.","Bus loading, headcount and final instructions"],
["11:15 a.m. target","Buses depart Maya for Capitol Hill; arrival/drop-off TBD"],
["12:30–3:30 p.m.","18 policy meetings, one photo opportunity, travel and reflection"],
["3:30–4:00 p.m. target","Debrief, final headcount and supervised return arrangements"]
];
export default async function HillDayPlannerPage(){
 await requireAdmin();
 const supabase = await createClient();
 const { data: liveGroups, error: liveError } = await supabase.from("hill_day_delegations").select("code,meetings,meeting_count,packet_url,notes").order("code");
 return <div className="stack">
 <section className="hero-card">
  <p className="eyebrow">INTERNAL / STAFF PLANNING DRAFT</p>
  <h1>Advocacy Hill Day — Delegations</h1>
  <p>Wednesday, November 18, 2026. Nine groups with 18 policy meetings and one photo opportunity. Levi W. Eckman is the event-wide floater and is not counted as a delegation member. D05 is co-led by Dr. Mendoza-Davis and Chief Cannon; final group headcounts and capacity still require verification.</p>
  <div className="hero-meta"><span className="hero-pill">18 policy meetings</span><span className="hero-pill">9 delegations</span><span className="hero-pill">1 photo opportunity</span></div>
  <p className="muted">Individual delegation PDFs are stored in a private Drive folder. The attendee portal matches people by verified email; assignments are never inferred from a shared account or organization name. Black Swan Academy's remaining eight interested youth are provisionally grouped under Kierstin Oliver and Germaine Williams, subject to consent and new office assignments.</p>
  <div className="hero-actions">
   <Link className="button button-link" href="/admin/dashboard/hill-day/accounts">Prepare private attendee logins →</Link>
   <a className="button button-link" href="https://docs.google.com/spreadsheets/d/1nppyiBGkzXqS4qY4SL3L1WdwFzq9VSMMislvFKMNp9A/edit#gid=1976111802" target="_blank" rel="noopener noreferrer">Private participant roster →</a>
   <a className="button-secondary button-link" href="https://docs.google.com/spreadsheets/d/1nppyiBGkzXqS4qY4SL3L1WdwFzq9VSMMislvFKMNp9A/edit#gid=604468507" target="_blank" rel="noopener noreferrer">Detailed time plan →</a>
   <a className="button-secondary button-link" href="https://drive.google.com/file/d/1X8cmoge4IrtnT0GMBTp1IkowiUsQjBX_/view" target="_blank" rel="noopener noreferrer">Congressional briefing book →</a>
  </div>
 </section>
 <section className="panel">
 <div className="section-heading"><div><p className="eyebrow">MORNING AT MAYA</p><h2>Training, lunch and departure</h2></div></div>
 <div className="timeline-grid">{morning.map(([time,title])=><article className="timeline-card" key={time}><p className="timeline-card__label">{time}</p><h3>{title}</h3></article>)}</div>
 <p className="muted">All participants should receive their office briefings before November 18 so the 10:00–10:45 training can focus on meeting one another and practicing. Transportation is secured; drop-off and travel details remain subject to operational instructions.</p>
 </section>
 <section className="panel">
 <div className="section-heading"><div><p className="eyebrow">WHERE EACH GROUP GOES</p><h2>Nine delegation schedules</h2><p className="muted">All nine delegations have two policy meetings. D09 also has a photo opportunity; prioritize its 3 PM Senate meeting. Verify room capacity and student permissions.</p></div></div>
 <div className="timeline-grid">
 {liveError ? <p role="status">Live planner data unavailable; showing the latest saved itinerary.</p> : null}
 {groups.map(g=>{ const current = liveGroups?.find(row=>row.code===g.id); const meetings = Array.isArray(current?.meetings) ? current.meetings.filter((value): value is string=>typeof value === "string") : null; return <article className="timeline-card" key={g.id}>
   <p className="timeline-card__label">{g.id} · {g.people} · {g.size} planned</p>
   <h3>{g.name}</h3><p><strong>Lead:</strong> {g.lead}</p>
   {meetings ? meetings.map(visit=><p key={visit}><strong>{visit}</strong></p>) : g.visits.map(([time,office,room])=><p key={time+office}><strong>{time}</strong> — {office}<br />{room}</p>)}
   {current?.notes ? <p className="muted">{current.notes}</p> : null}
   {current?.packet_url ? <a href={current.packet_url} target="_blank" rel="noopener noreferrer" className="button-secondary button-link">Open delegation packet</a> : null}
   <p className="muted">{g.gap}</p>
  </article>})}
 </div>
 </section>
 <section className="panel callout-panel">
 <p className="eyebrow">BEFORE YOU EMAIL DELEGATIONS</p><h2>Items requiring confirmation</h2>
 <p>Pressley’s and Palmer’s exact meeting rooms; D03 replacement adult lead; D05 handoff timing and meeting capacity; school permissions and office capacities (especially eight-person partner groups); additional escorts if Maya students cannot enter a partner group's second meeting; Hill arrival and return logistics.</p>
 <p className="muted">This staff-only view deliberately contains no individual student names. Use the private Google Sheets roster for person-level information; do not paste minors' information into public pages or emails to unrelated recipients.</p>
 <Link href="/admin/dashboard/signups" className="button-secondary button-link">Review registrations →</Link>
 </section>
 </div>;
}