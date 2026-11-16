"use client";

import { useState } from "react";

type Office = { name: string; short: string; url: string; initials: string };
type Building = { id: string; name: string; chamber: "Senate" | "House"; x: number; y: number; offices: Office[] };

const buildings: Building[] = [
  { id:"russell", name:"Russell", chamber:"Senate", x:27, y:23, offices:[
    { name:"Sen. Patty Murray",short:"Murray",initials:"PM",url:"https://www.murray.senate.gov/write-to-patty/" }
  ]},
  { id:"hart", name:"Hart", chamber:"Senate", x:74, y:23, offices:[
    { name:"Senate HELP Committee",short:"HELP Committee",initials:"HC",url:"https://www.help.senate.gov/" },
    { name:"Sen. Dick Durbin",short:"Durbin",initials:"DD",url:"https://www.durbin.senate.gov/contact/" },
    { name:"Sen. Brian Schatz",short:"Schatz",initials:"BS",url:"https://www.schatz.senate.gov/services" },
    { name:"Sen. Gary Peters",short:"Peters",initials:"GP",url:"https://www.peters.senate.gov/contact" },
    { name:"Sen. Mazie Hirono",short:"Hirono",initials:"MH",url:"https://www.hirono.senate.gov/contact" },
    { name:"Sen. Chris Van Hollen",short:"Van Hollen",initials:"CV",url:"https://www.vanhollen.senate.gov/contact/" }
  ]},
  { id:"rayburn", name:"Rayburn", chamber:"House", x:26, y:85, offices:[
    { name:"Rep. Jim Jordan",short:"Jordan",initials:"JJ",url:"https://jordan.house.gov/contact" },
    { name:"Rep. Kevin Kiley",short:"Kiley",initials:"KK",url:"https://kiley.house.gov/contact" },
    { name:"Del. Eleanor Holmes Norton",short:"Norton",initials:"EN",url:"https://norton.house.gov/contact-congresswoman-norton" },
    { name:"Rep. Suzanne Bonamici",short:"Bonamici",initials:"SB",url:"https://bonamici.house.gov/contact" },
    { name:"House Education & Workforce Committee",short:"Education & Workforce",initials:"EW",url:"https://edworkforce.house.gov/contact/" }
  ]},
  { id:"longworth", name:"Longworth", chamber:"House", x:56, y:85, offices:[
    { name:"Rep. Terri Sewell",short:"Sewell",initials:"TS",url:"https://sewell.house.gov/contact-me" },
    { name:"Rep. Adelita Grijalva",short:"Grijalva",initials:"AG",url:"https://grijalva.house.gov/contact" }
  ]},
  { id:"cannon", name:"Cannon", chamber:"House", x:80, y:85, offices:[
    { name:"Rep. Gary Palmer",short:"Palmer",initials:"GP",url:"https://palmer.house.gov/contact/offices" }
  ]}
];

function CampusDrawing({ active }: { active: string }) {
 const meetingBuildings = [
  {id:"russell",x:175,y:94,w:190,h:111},
  {id:"hart",x:663,y:94,w:155,h:111},
  {id:"rayburn",x:170,y:521,w:190,h:83},
  {id:"longworth",x:465,y:521,w:190,h:83},
  {id:"cannon",x:738,y:521,w:130,h:83}
 ];
 const contextBuildings = [
  {name:"DIRKSEN",x:525,y:100,w:115,h:102,size:11},
  {name:"SUPREME COURT",x:749,y:265,w:152,h:68,size:9},
  {name:"JEFFERSON LIBRARY",x:722,y:362,w:135,h:75,size:8.8},
  {name:"ADAMS LIBRARY",x:868,y:361,w:115,h:76,size:8.5},
  {name:"MADISON LIBRARY",x:880,y:522,w:99,h:81,size:8},
  {name:"FORD",x:35,y:518,w:108,h:37,size:9},
  {name:"O’NEILL",x:35,y:566,w:108,h:37,size:9}
 ];
 return <svg className="capitol-explore__drawing" viewBox="0 0 1000 660" role="img" aria-label="Stylized Capitol Hill campus overview showing Senate buildings Russell, Dirksen and Hart; the Capitol; Supreme Court and Library of Congress; and House buildings Rayburn, Longworth and Cannon. Roads are simplified. Use the official Capitol map for routes.">
 <defs>
  <pattern id="campusLawn" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0 26L26 0" stroke="#c1d4c3" strokeWidth=".8" opacity=".24"/></pattern>
  <pattern id="buildingHatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#a89f91" strokeWidth=".8" opacity=".36"/></pattern>
 </defs>
 <rect width="1000" height="660" fill="#e9eee6"/>
 <rect x="22" y="15" width="956" height="630" rx="10" fill="#dfe8de"/>
 <rect x="22" y="15" width="956" height="630" rx="10" fill="url(#campusLawn)"/>
 {/* Major roads and the gaps between blocks, not superimposed on any building. */}
 <g fill="none" stroke="#fffefa" strokeWidth="23">
  <path d="M0 45H1000M0 234H1000M0 475H1000M0 634H1000"/>
  <path d="M133 0V234M480 0V234M858 0V234M403 475V660M691 475V660M918 475V660"/>
 </g>
 <g fill="none" stroke="#cbd3c9" strokeWidth="1.1">
  <path d="M0 32H1000M0 58H1000M0 221H1000M0 247H1000M0 462H1000M0 488H1000M0 621H1000M0 647H1000"/>
  <path d="M119 0V221M147 0V221M466 0V221M494 0V221M844 0V221M872 0V221"/>
  <path d="M389 488V660M417 488V660M677 488V660M705 488V660M904 488V660M932 488V660"/>
 </g>
 <g fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fill="#6a756e" letterSpacing="1.1" fontSize="10.5">
  <text x="25" y="48">C STREET NE</text>
  <text x="25" y="237">CONSTITUTION AVENUE NE</text>
  <text x="25" y="478">INDEPENDENCE AVENUE</text>
  <text x="25" y="637">C STREET SW / SE</text>
  <text transform="translate(136 202) rotate(-90)">DELAWARE AVE NE</text>
  <text transform="translate(483 202) rotate(-90)">FIRST STREET NE</text>
  <text transform="translate(861 202) rotate(-90)">SECOND STREET NE</text>
  <text transform="translate(406 607) rotate(-90)">SOUTH CAPITOL ST</text>
  <text transform="translate(694 608) rotate(-90)">NEW JERSEY AVE SE</text>
  <text transform="translate(921 605) rotate(-90)">FIRST STREET SE</text>
 </g>
 {[[395,135],[649,149],[302,288],[625,274],[270,417],[650,414],[981,300],[42,310],[420,64],[700,73]].map(([x,y],i)=><g key={i} opacity=".75"><circle cx={x} cy={y} r="15" fill="#b8cfb5"/><circle cx={x} cy={y} r="9" fill="#9fbe9e"/><circle cx={x-2} cy={y-3} r="3" fill="#e6eee2"/></g>)}
 {/* Background landmarks are deliberately muted and have no appointment markers. */}
 <g>
  {contextBuildings.map(b=><g key={b.name}>
   <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="#d3d8d0" stroke="#a5afa5" strokeWidth="1.6"/>
   <rect x={b.x+4} y={b.y+4} width={b.w-8} height={b.h-8} rx="3" fill="url(#buildingHatch)" opacity=".6"/>
   <text x={b.x+b.w/2} y={b.y+b.h/2+3} textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize={b.size} fontWeight="700" fill="#5c675f" letterSpacing=".4">{b.name}</text>
  </g>)}
 </g>
 {/* Other important landmarks */}
 <g>
  <rect x="60" y="318" width="145" height="104" rx="35" fill="#c4d7bd" stroke="#a4b89b" strokeWidth="2"/>
  <ellipse cx="132" cy="371" rx="49" ry="29" fill="#b4cfae"/>
  <text x="132" y="366" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" textAnchor="middle" fontSize="9.5" fill="#4c694c">U.S. BOTANIC</text>
  <text x="132" y="379" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" textAnchor="middle" fontSize="9.5" fill="#4c694c">GARDEN</text>
  <rect x="605" y="333" width="90" height="43" rx="5" fill="#dddcd4" stroke="#a1a098" strokeWidth="1.7"/>
  <text x="650" y="351" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial,sans-serif" fill="#64655f">CAPITOL</text>
  <text x="650" y="364" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial,sans-serif" fill="#64655f">VISITOR CTR</text>
 </g>
 <g fill="#d8d0c2" stroke="#a59a89" strokeWidth="2">
  {meetingBuildings.map(b=><rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} rx="5"/>)}
 </g>
 <g fill="url(#buildingHatch)" opacity=".8">
  {meetingBuildings.map(b=><rect key={b.id} x={b.x+5} y={b.y+5} width={b.w-10} height={b.h-10} rx="3"/>)}
 </g>
 <g aria-hidden="true">
  {meetingBuildings.filter(b=>b.id===active).map(b=><rect key={b.id} x={b.x-4} y={b.y-4} width={b.w+8} height={b.h+8} rx="7" fill="none" stroke="#b02338" strokeWidth="3"/>)}
 </g>
 {/* Capitol footprint and label separate from road and garden labels. */}
 <g transform="translate(448 352)">
  <rect x="-112" y="-52" width="224" height="104" rx="7" fill="#e9e4d8" stroke="#948b7d" strokeWidth="2.5"/>
  <rect x="-96" y="-40" width="192" height="80" rx="4" fill="#d9d0c0"/>
  <rect x="-135" y="-22" width="270" height="44" rx="7" fill="#eee8dc" stroke="#958c7f" strokeWidth="2.5"/>
  <rect x="-64" y="-68" width="128" height="136" rx="7" fill="#ede8de" stroke="#8f8679" strokeWidth="3"/>
  <rect x="-50" y="-54" width="100" height="108" rx="5" fill="#d9d0bd"/>
  <circle r="40" fill="#f4f0e7" stroke="#898073" strokeWidth="4"/>
  <circle r="24" fill="#c6baa9" stroke="#9a9083" strokeWidth="2"/>
  <circle r="9" fill="#faf7ef" stroke="#898073" strokeWidth="1.8"/>
 </g>
 <text x="448" y="432" textAnchor="middle" fontSize="11.5" fontWeight="800" letterSpacing="1.5" fontFamily="Arial,sans-serif" fill="#4e544e">U.S. CAPITOL</text>
 <g transform="translate(955 92)" fontFamily="Arial,sans-serif" fontWeight="700" fill="#44504a"><text textAnchor="middle" y="-14" fontSize="12">N</text><path d="M0 -9L-7 9L0 5L7 9Z" fill="#b22339"/><path d="M0 7V23" stroke="#b22339" strokeWidth="2"/></g>
 </svg>;
}

export function CapitolCampusExplorer() {
 const [active,setActive] = useState("hart");
 const selected = buildings.find(b=>b.id===active) ?? buildings[1];
 return <div className="capitol-explore">
   <div className="capitol-explore__map">
    <CampusDrawing active={active}/>
    {buildings.map(b=><button type="button" key={b.id} className={`capitol-explore__pin capitol-explore__pin--${b.chamber.toLowerCase()}${active===b.id?" capitol-explore__pin--active":""}`} style={{left:`${b.x}%`,top:`${b.y}%`}} onClick={()=>setActive(b.id)} aria-pressed={active===b.id} aria-label={`Show ${b.offices.length} participating offices in ${b.name} ${b.chamber} Office Building`}>
      <span className="capitol-explore__pin-count">{b.offices.length}</span><span className="capitol-explore__pin-label">{b.name}<small>{b.chamber}</small></span>
     </button>)}
    <div className="capitol-explore__map-caption"><span>CAPITOL CAMPUS · STYLIZED OVERVIEW</span><span>SELECT A BUILDING TO EXPLORE</span></div>
   </div>
   <div className="capitol-explore__map-source"><span>Muted buildings are nearby landmarks, not scheduled stops.</span><a href="https://www.visitthecapitol.gov/visit/maps-and-brochures" target="_blank" rel="noopener noreferrer">Official Capitol map for walking directions ↗</a></div>
   <div className="capitol-explore__mobile-buildings" role="group" aria-label="Select office building">
    {buildings.map(b=><button key={b.id} type="button" aria-pressed={active===b.id} onClick={()=>setActive(b.id)} className={active===b.id?"capitol-explore__mobile-active":""}>{b.name}<small>{b.offices.length}</small></button>)}
   </div>
   <div className="capitol-explore__details" aria-live="polite">
    <div className="capitol-explore__details-header"><div><span className="capitol-explore__eyebrow">{selected.chamber.toUpperCase()} OFFICE BUILDING · SELECTED</span><h3>{selected.name}</h3></div><span className="capitol-explore__detail-count">{selected.offices.length} {selected.offices.length===1?"PARTICIPATING OFFICE":"PARTICIPATING OFFICES"}</span></div>
    <div className="capitol-explore__contacts">
     {selected.offices.map(o=><a key={o.name} className="capitol-explore__person" href={o.url} target="_blank" rel="noopener noreferrer" aria-label={`Open official contact page for ${o.name} in a new tab`}><span className="capitol-explore__avatar">{o.initials}</span><span className="capitol-explore__person-name"><strong>{o.name}</strong><small>Official contact page</small></span><span className="capitol-explore__external" aria-hidden="true">↗</span></a>)}
    </div>
   </div>
 </div>;
}
