import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
export const metadata: Metadata = buildMetadata({title:"Hill Day Delegations | FS2S Admin",description:"Private planning view for November 18 congressional delegation operations.",path:"/admin/dashboard/hill-day",noIndex:true});
const groups = [{id:"D01",name:"Tutoring Café A",lead:"Chief Leah Lamb",size:7,people:"5 partners + 1 Maya Scholar",visits:[["1:00 p.m.","Senate HELP Democratic staff","Hart 632"],["2:30 p.m.","Sen. Brian Schatz staff","Hart 722"]],gap:"Allow 10–15 minutes after HELP for decompression, then remain on Senate side."},
{id:"D02",name:"Tutoring Café B",lead:"Dr. Clarisse Mendoza-Davis",size:8,people:"4 partners + 3 Maya Scholars",visits:[["1:00 p.m.","Rep. Kevin Kiley staff","Rayburn 2445"],["2:00 p.m.","Rep. Suzanne Bonamici staff","Rayburn 2231"]],gap:"Debrief after Kiley; allow Rayburn transfer and check-in before 2:00. Verify eight-person capacity."},
{id:"D03",name:"Black Swan Academy",lead:"Chief Azalia Speight",size:7,people:"5 partners + 1 Maya Scholar",visits:[["1:00 p.m.","Rep. Jim Jordan staff","Rayburn 2056"],["2:00–2:30 p.m.","Del. Eleanor Holmes Norton staff","Rayburn 2136"]],gap:"Norton reassigned to the partner delegation; use the 1:30–1:50 interval to reflect and transfer within Rayburn."},
{id:"D04",name:"Georgetown / Sasha Bruce",lead:"Dr. Kamal Wright-Cunningham",size:8,people:"4 partners + 3 Maya Scholars",visits:[["12:30 p.m.","Rep. Terri Sewell staff","Longworth 1035"],["3:00–3:30 p.m.","Rep. Adelita Grijalva","Longworth 1203"]],gap:"Extended supervised downtime for debrief and practice; return early for 3:00 appointment."},
{id:"D05",name:"Youth Justice Partners",lead:"Levi Eckman",size:6,people:"3 partners + 2 Maya Scholars",visits:[["1:00 p.m.","Sen. Dick Durbin / Judiciary staff","Hart 711"],["2:00 p.m.","Sen. Gary Peters staff — Ava Kelsey","Hart 724"]],gap:"Allow 10–15 minutes to decompress and travel. Peters confirmed Hart 724, South entrance via Constitution Avenue (metal detector screening); backup adult still needed if event lead is called away."},
{id:"D06",name:"Maya Scholars A",lead:"Mekhi Love",size:7,people:"6 Maya Scholars",visits:[["1:30 p.m.","House Education & Workforce staff","Rayburn 2257"]],gap:"Debrief after meeting; second supervised learning activity TBD. Additional office only if surplus time and approval."},
{id:"D07",name:"Maya Scholars B",lead:"Ciara Norfleet",size:7,people:"6 Maya Scholars",visits:[["1:30 p.m.","Sen. Patty Murray staff","Russell 154"]],gap:"Office requires arrival by 1:15 p.m. Debrief after meeting; supervised activity TBD."},
{id:"D08",name:"Maya Scholars C",lead:"De'Asyia Barner",size:6,people:"5 Maya Scholars",visits:[["2:30–3:00 p.m.","Rep. Gary Palmer staff — Hampton Neugent","170 Cannon (room TBD)"]],gap:"Second supervised activity before the office meeting TBD; be ready for office check-in around 2:15."},
{id:"D09",name:"Maya Scholars D",lead:"STAFF LEAD NEEDED",size:5,people:"4 Maya Scholars",visits:[["3:00 p.m.","Sen. Chris Van Hollen staff","Hart 730"]],gap:"Adult lead required before travel. Second supervised activity TBD before 3:00; office cap is six."}];
const morning = [
["9:45–10:00 a.m.","Maya arrival, check-in and delegation introductions"],
["10:00–10:45 a.m.","Advocacy training, meeting briefs and group practice — pre-reading required"],
["10:45–11:05 a.m.","Provided lunch at Maya"],
["11:05–11:15 a.m.","Bus loading, headcount and final instructions"],
["11:15 a.m. target","Buses depart Maya for Capitol Hill; arrival/drop-off TBD"],
["12:30–3:30 p.m.","Fourteen congressional meetings, travel, reflection, and future activities"],
["3:30–4:00 p.m. target","Debrief, final headcount and supervised return arrangements"]
];
export default async function HillDayPlannerPage(){
 await requireAdmin();
 return <div className="stack">
 <section className="hero-card">
  <p className="eyebrow">INTERNAL / STAFF PLANNING DRAFT</p>
  <h1>Advocacy Hill Day — Delegations</h1>
  <p>Wednesday, November 18, 2026. Nine groups, fourteen agreed congressional appointments, 31 Maya Scholars and 21 partner participants. One adult lead remains to be named.</p>
  <div className="hero-meta"><span className="hero-pill">14 appointments</span><span className="hero-pill">9 delegations</span><span className="hero-pill">Second activities TBD</span></div>
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
 <p className="muted">All participants should receive their office briefings before November 18 so the 10:00–10:45 training can focus on meeting one another and practicing. Bus times are targets until transportation confirms drop-off and travel.</p>
 </section>
 <section className="panel">
 <div className="section-heading"><div><p className="eyebrow">WHERE EACH GROUP GOES</p><h2>Nine delegation schedules</h2><p className="muted">Partner groups are prioritized for two congressional visits. Maya-only delegations have one confirmed visit and a supervised activity slot to be selected. Maya Scholars embedded with partners may join a second visit only if room size and adult supervision allow.</p></div></div>
 <div className="timeline-grid">
 {groups.map(g=><article className="timeline-card" key={g.id}>
   <p className="timeline-card__label">{g.id} · {g.people} · {g.size} planned</p>
   <h3>{g.name}</h3><p><strong>Lead:</strong> {g.lead}</p>
   {g.visits.map(([time,office,room])=><p key={time+office}><strong>{time}</strong> — {office}<br />{room}</p>)}
   {g.visits.length===1?<p><strong>Second supervised activity:</strong> Not yet selected or booked.</p>:null}
   <p className="muted">{g.gap}</p>
  </article>)}
 </div>
 </section>
 <section className="panel callout-panel">
 <p className="eyebrow">BEFORE YOU EMAIL DELEGATIONS</p><h2>Items requiring confirmation</h2>
 <p>Palmer's exact meeting room; D09's adult lead; school permissions and office capacities (especially eight-person partner groups); additional escorts if Maya students cannot enter a partner group's second meeting; transportation, Hill arrival and return logistics.</p>
 <p className="muted">This staff-only view deliberately contains no individual student names. Use the private Google Sheets roster for person-level information; do not paste minors' information into public pages or emails to unrelated recipients.</p>
 <Link href="/admin/dashboard/signups" className="button-secondary button-link">Review registrations →</Link>
 </section>
 </div>;
}