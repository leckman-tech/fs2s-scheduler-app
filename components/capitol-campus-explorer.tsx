"use client";

import { useState } from "react";

type Office = { name: string; short: string; url: string; initials: string };
type Building = { id: string; name: string; chamber: "Senate" | "House"; x: number; y: number; offices: Office[] };

const buildings: Building[] = [
  { id:"russell", name:"Russell", chamber:"Senate", x:28, y:21, offices:[
    { name:"Sen. Patty Murray",short:"Murray",initials:"PM",url:"https://www.murray.senate.gov/write-to-patty/" }
  ]},
  { id:"hart", name:"Hart", chamber:"Senate", x:75, y:21, offices:[
    { name:"Senate HELP Committee",short:"HELP Committee",initials:"HC",url:"https://www.help.senate.gov/" },
    { name:"Sen. Dick Durbin",short:"Durbin",initials:"DD",url:"https://www.durbin.senate.gov/contact/" },
    { name:"Sen. Brian Schatz",short:"Schatz",initials:"BS",url:"https://www.schatz.senate.gov/services" },
    { name:"Sen. Gary Peters",short:"Peters",initials:"GP",url:"https://www.peters.senate.gov/contact" },
    { name:"Sen. Mazie Hirono",short:"Hirono",initials:"MH",url:"https://www.hirono.senate.gov/contact" },
    { name:"Sen. Chris Van Hollen",short:"Van Hollen",initials:"CV",url:"https://www.vanhollen.senate.gov/contact/" }
  ]},
  { id:"rayburn", name:"Rayburn", chamber:"House", x:22, y:83, offices:[
    { name:"Rep. Jim Jordan",short:"Jordan",initials:"JJ",url:"https://jordan.house.gov/contact" },
    { name:"Rep. Kevin Kiley",short:"Kiley",initials:"KK",url:"https://kiley.house.gov/contact" },
    { name:"Del. Eleanor Holmes Norton",short:"Norton",initials:"EN",url:"https://norton.house.gov/contact-congresswoman-norton" },
    { name:"Rep. Suzanne Bonamici",short:"Bonamici",initials:"SB",url:"https://bonamici.house.gov/contact" },
    { name:"House Education & Workforce Committee",short:"Education & Workforce",initials:"EW",url:"https://edworkforce.house.gov/contact/" }
  ]},
  { id:"longworth", name:"Longworth", chamber:"House", x:55, y:83, offices:[
    { name:"Rep. Terri Sewell",short:"Sewell",initials:"TS",url:"https://sewell.house.gov/contact-me" },
    { name:"Rep. Adelita Grijalva",short:"Grijalva",initials:"AG",url:"https://grijalva.house.gov/contact" }
  ]},
  { id:"cannon", name:"Cannon", chamber:"House", x:84, y:83, offices:[
    { name:"Rep. Gary Palmer",short:"Palmer",initials:"GP",url:"https://palmer.house.gov/contact/offices" }
  ]}
];

function CampusDrawing({ active }: { active: string }) {
 const footprint = [
  {id:"russell",x:185,y:69,w:185,h:94},
  {id:"hart",x:634,y:69,w:193,h:94},
  {id:"rayburn",x:103,y:431,w:228,h:69},
  {id:"longworth",x:443,y:433,w:213,h:65},
  {id:"cannon",x:750,y:431,w:179,h:69}
 ];
 return <svg className="capitol-explore__drawing" viewBox="0 0 1000 560" role="img" aria-label="Stylized overhead overview showing Constitution Avenue north of the Capitol, Independence Avenue south, and named streets between the Senate and House office buildings. Not a walking navigation map.">
  <defs>
   <pattern id="campusLawn" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 28L28 0" stroke="#bed2bf" strokeWidth=".8" opacity=".22"/></pattern>
   <pattern id="buildingHatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#a89d90" strokeWidth=".75" opacity=".42"/></pattern>
  </defs>
  <rect width="1000" height="560" fill="#e7ece3"/>
  <rect x="24" y="12" width="952" height="536" rx="10" fill="#dee7dc"/>
  <rect x="24" y="12" width="952" height="536" rx="10" fill="url(#campusLawn)"/>
  {/* Roads only: continuous at intersections, never through a footprint. */}
  <g stroke="#f9f8f4" strokeLinecap="butt" fill="none">
   <path d="M0 37H1000M0 205H1000M0 395H1000M0 530H1000" strokeWidth="24"/>
   <path d="M125 0V205M500 0V205M885 0V205M385 395V560M700 395V560M955 395V560" strokeWidth="21"/>
  </g>
  <g fill="none" stroke="#c7cec4" strokeWidth="1.1" opacity=".85">
   <path d="M0 23H1000M0 51H1000M0 191H1000M0 219H1000M0 381H1000M0 409H1000M0 516H1000M0 544H1000"/>
   <path d="M111 0V191M139 0V191M486 0V191M514 0V191M871 0V191M899 0V191"/>
   <path d="M371 409V560M399 409V560M686 409V560M714 409V560M941 409V560M969 409V560"/>
  </g>
  {/* Street labels deliberately sit in the roadway gaps. */}
  <g fontFamily="Arial, sans-serif" fontWeight="700" letterSpacing="1.5" fill="#777e77" fontSize="10">
   <text x="25" y="40">C STREET · NORTH</text>
   <text x="35" y="208">CONSTITUTION AVENUE</text>
   <text x="35" y="398">INDEPENDENCE AVENUE</text>
   <text x="25" y="533">C STREET · SOUTH</text>
   <text transform="translate(128 166) rotate(-90)" textAnchor="start" fontSize="9">DELAWARE AVE NE</text>
   <text transform="translate(503 164) rotate(-90)" textAnchor="start" fontSize="9">FIRST STREET NE</text>
   <text transform="translate(888 163) rotate(-90)" textAnchor="start" fontSize="9">SECOND STREET NE</text>
   <text transform="translate(388 509) rotate(-90)" textAnchor="start" fontSize="9">SOUTH CAPITOL ST</text>
   <text transform="translate(703 509) rotate(-90)" textAnchor="start" fontSize="9">NEW JERSEY AVE SE</text>
   <text transform="translate(958 509) rotate(-90)" textAnchor="start" fontSize="9">FIRST STREET SE</text>
  </g>
  {/* Subtle landscaped areas, confined to open space. */}
  {[[410,105],[595,101],[353,277],[644,277],[345,472],[679,475],[40,302],[963,298]].map(([x,y],i)=><g key={i} opacity=".8"><circle cx={x} cy={y} r="15" fill="#b6d0b2"/><circle cx={x} cy={y} r="9" fill="#9fbf9e"/><circle cx={x-3} cy={y-3} r="3" fill="#dcead9"/></g>)}
  {/* Five buildings with space from all road edges. */}
  <g fill="#d6d0c3" stroke="#a59c8e" strokeWidth="2">
   {footprint.map(b=><rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} rx="5"/>)}
  </g>
  <g fill="url(#buildingHatch)">
   {footprint.map(b=><rect key={b.id} x={b.x+5} y={b.y+5} width={b.w-10} height={b.h-10} rx="3"/>)}
  </g>
  <g aria-hidden="true">
   {footprint.filter(b=>b.id===active).map(b=><rect key={b.id} x={b.x-4} y={b.y-4} width={b.w+8} height={b.h+8} rx="7" fill="none" stroke="#a92237" strokeWidth="3"/>)}
  </g>
  {/* The Capitol footprint is in its own central grounds, away from roadways. */}
  <g transform="translate(500 298)">
   <rect x="-113" y="-52" width="226" height="104" rx="7" fill="#e9e4d8" stroke="#948b7d" strokeWidth="2.5"/>
   <rect x="-96" y="-40" width="192" height="80" rx="4" fill="#d9d0c0"/>
   <rect x="-140" y="-23" width="280" height="46" rx="6" fill="#ece6da" stroke="#958c7f" strokeWidth="2.5"/>
   <rect x="-64" y="-68" width="128" height="136" rx="7" fill="#ede8de" stroke="#8f8679" strokeWidth="3"/>
   <rect x="-50" y="-54" width="100" height="108" rx="5" fill="#d9d0bd"/>
   <circle r="40" fill="#f4f0e7" stroke="#898073" strokeWidth="4"/>
   <circle r="24" fill="#c6baa9" stroke="#9a9083" strokeWidth="2"/>
   <circle r="9" fill="#faf7ef" stroke="#898073" strokeWidth="1.8"/>
  </g>
  {/* A separate left-side callout keeps the title clear of the rotunda and both avenues. */}
  <g aria-hidden="true">
   <path d="M312 307H357L380 293" fill="none" stroke="#6c7169" strokeWidth="1.5" strokeLinecap="round"/>
   <circle cx="380" cy="293" r="3" fill="#a92337"/>
   <rect x="193" y="288" width="120" height="38" rx="6" fill="#fffdf8" fillOpacity=".94" stroke="#c9cec4" strokeWidth="1"/>
   <text x="253" y="303" textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="1.2" fontFamily="Arial,sans-serif" fill="#424742">U.S. CAPITOL</text>
   <text x="253" y="316" textAnchor="middle" fontSize="8" fontWeight="600" letterSpacing=".8" fontFamily="Arial,sans-serif" fill="#71746b">CAPITOL GROUNDS</text>
  </g>
  <g transform="translate(940 85)" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#454d47"><text textAnchor="middle" y="-12">N</text><path d="M0 -7L-7 10L0 6L7 10Z" fill="#ae273b"/><path d="M0 8V24" stroke="#ae273b" strokeWidth="2"/></g>
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
    <div className="capitol-explore__map-caption"><span>CAPITOL HILL · SCHEMATIC, NOT FOR WAYFINDING</span><span>SELECT A BUILDING TO EXPLORE</span></div>
   </div>
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
