"use client";

import { useState } from "react";

type Office = { name: string; short: string; url: string; initials: string };
type Building = { id: string; name: string; chamber: "Senate" | "House"; x: number; y: number; offices: Office[] };

const buildings: Building[] = [
  { id:"russell", name:"Russell", chamber:"Senate", x:28, y:22, offices:[
    { name:"Sen. Patty Murray",short:"Murray",initials:"PM",url:"https://www.murray.senate.gov/write-to-patty/" }
  ]},
  { id:"hart", name:"Hart", chamber:"Senate", x:75, y:22, offices:[
    { name:"Senate HELP Committee",short:"HELP Committee",initials:"HC",url:"https://www.help.senate.gov/" },
    { name:"Sen. Dick Durbin",short:"Durbin",initials:"DD",url:"https://www.durbin.senate.gov/contact/" },
    { name:"Sen. Brian Schatz",short:"Schatz",initials:"BS",url:"https://www.schatz.senate.gov/services" },
    { name:"Sen. Gary Peters",short:"Peters",initials:"GP",url:"https://www.peters.senate.gov/contact" },
    { name:"Sen. Mazie Hirono",short:"Hirono",initials:"MH",url:"https://www.hirono.senate.gov/contact" },
    { name:"Sen. Chris Van Hollen",short:"Van Hollen",initials:"CV",url:"https://www.vanhollen.senate.gov/contact/" }
  ]},
  { id:"rayburn", name:"Rayburn", chamber:"House", x:22, y:76, offices:[
    { name:"Rep. Jim Jordan",short:"Jordan",initials:"JJ",url:"https://jordan.house.gov/contact" },
    { name:"Rep. Kevin Kiley",short:"Kiley",initials:"KK",url:"https://kiley.house.gov/contact" },
    { name:"Del. Eleanor Holmes Norton",short:"Norton",initials:"EN",url:"https://norton.house.gov/contact-congresswoman-norton" },
    { name:"Rep. Suzanne Bonamici",short:"Bonamici",initials:"SB",url:"https://bonamici.house.gov/contact" },
    { name:"House Education & Workforce Committee",short:"Education & Workforce",initials:"EW",url:"https://edworkforce.house.gov/contact/" }
  ]},
  { id:"longworth", name:"Longworth", chamber:"House", x:55, y:80, offices:[
    { name:"Rep. Terri Sewell",short:"Sewell",initials:"TS",url:"https://sewell.house.gov/contact-me" },
    { name:"Rep. Adelita Grijalva",short:"Grijalva",initials:"AG",url:"https://grijalva.house.gov/contact" }
  ]},
  { id:"cannon", name:"Cannon", chamber:"House", x:84, y:75, offices:[
    { name:"Rep. Gary Palmer",short:"Palmer",initials:"GP",url:"https://palmer.house.gov/contact/offices" }
  ]}
];

function CampusDrawing({ active }: { active: string }) {
 return (
 <svg className="capitol-explore__drawing" viewBox="0 0 1000 560" role="img" aria-label="Illustrated overhead view of Capitol Hill with north toward the top, Senate buildings to the north and House buildings to the south.">
  <defs>
   <pattern id="campusLawn" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M 0 26 L 26 0" stroke="#cdd8ce" strokeWidth=".65" opacity=".3"/></pattern>
   <pattern id="buildingHatch" width="11" height="11" patternUnits="userSpaceOnUse"><path d="M0 11L11 0" stroke="#b6ae9f" strokeWidth=".7" opacity=".6"/></pattern>
  </defs>
  <rect width="1000" height="560" rx="16" fill="#f0f0eb"/>
  <rect x="28" y="25" width="944" height="510" rx="8" fill="#e2e8dd"/>
  <rect x="28" y="25" width="944" height="510" rx="8" fill="url(#campusLawn)"/>
  <path d="M0 252H1000" stroke="#f7f6f2" strokeWidth="28"/>
  <path d="M0 286H1000" stroke="#c9cec7" strokeWidth="1.2"/>
  <path d="M0 236H1000" stroke="#c9cec7" strokeWidth="1.2"/>
  <path d="M0 462H1000" stroke="#f7f6f2" strokeWidth="32"/>
  <path d="M0 443H1000" stroke="#c9cec7" strokeWidth="1.2"/>
  <path d="M0 481H1000" stroke="#c9cec7" strokeWidth="1.2"/>
  <path d="M160 0V560M840 0V560" stroke="#f7f6f2" strokeWidth="24"/>
  <path d="M160 0V560M840 0V560" stroke="#c9cec7" strokeWidth="1.2" strokeDasharray="3 9"/>
  <path d="M500 34V188M110 285H342M658 285H890" stroke="#e5ddcf" strokeWidth="12" strokeLinecap="round"/>
  <path d="M500 34V188M110 285H342M658 285H890" stroke="#fffdf6" strokeWidth="2.5" strokeLinecap="round"/>
  {[[390,77],[590,77],[346,159],[656,159],[320,364],[688,363],[400,495],[600,492],[113,359],[885,366]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="19" fill="#c2d2ba"/><circle cx={x} cy={y} r="13" fill="#a7c3a1" opacity=".78"/><circle cx={x-3} cy={y-3} r="4" fill="#d8e3d2"/></g>)}
  <g fill="#d4cebf" stroke="#a8a092" strokeWidth="2">
   <rect x="185" y="63" width="185" height="100" rx="5"/>
   <rect x="634" y="63" width="193" height="100" rx="5"/>
   <rect x="103" y="371" width="228" height="70" rx="5"/>
   <rect x="443" y="413" width="213" height="60" rx="5"/>
   <rect x="750" y="364" width="179" height="77" rx="5"/>
  </g>
  <g fill="url(#buildingHatch)" opacity=".65">
   <rect x="190" y="68" width="175" height="90" rx="3"/><rect x="639" y="68" width="183" height="90" rx="3"/>
   <rect x="108" y="376" width="218" height="60" rx="3"/><rect x="448" y="418" width="203" height="50" rx="3"/><rect x="755" y="369" width="169" height="67" rx="3"/>
  </g>
  <g aria-hidden="true">
    {[
      {id:"russell",x:185,y:63,w:185,h:100},
      {id:"hart",x:634,y:63,w:193,h:100},
      {id:"rayburn",x:103,y:371,w:228,h:70},
      {id:"longworth",x:443,y:413,w:213,h:60},
      {id:"cannon",x:750,y:364,w:179,h:77}
    ].filter(b=>b.id===active).map(b=><rect key={b.id} x={b.x-4} y={b.y-4} width={b.w+8} height={b.h+8} rx="8" fill="none" stroke="#ad273a" strokeWidth="3" opacity=".88"/>)}
  </g>
  <g transform="translate(500 313)">
   <rect x="-119" y="-53" width="238" height="106" rx="7" fill="#e8e2d6" stroke="#9a9285" strokeWidth="3"/>
   <rect x="-101" y="-44" width="202" height="90" rx="5" fill="#d5ccbb"/>
   <rect x="-139" y="-27" width="278" height="54" rx="8" fill="#ebe4d8" stroke="#948c7e" strokeWidth="3"/>
   <rect x="-64" y="-72" width="128" height="144" rx="8" fill="#ece8de" stroke="#888071" strokeWidth="4"/>
   <rect x="-50" y="-58" width="100" height="114" rx="5" fill="#d7cfbe"/>
   <circle r="40" fill="#f4efe4" stroke="#877f72" strokeWidth="5"/>
   <circle r="25" fill="#c1b4a2" stroke="#9c9180" strokeWidth="2"/>
   <circle r="9" fill="#f8f4eb" stroke="#8d8579" strokeWidth="2"/>
   <path d="M-139 0H-66M66 0H139" stroke="#9c9386" strokeWidth="1.5" opacity=".38"/>
  </g>
  <g fontFamily="Arial, sans-serif" fontWeight="700" fill="#8a8b82" letterSpacing="2">
   <text x="50" y="275" fontSize="10">CONSTITUTION AVE</text>
   <text x="52" y="474" fontSize="10">INDEPENDENCE AVE</text>
   <text x="500" y="216" textAnchor="middle" fontSize="11" fill="#504d47" letterSpacing="2.2">U.S. CAPITOL</text>
  </g>
  <g transform="translate(943 49)" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#4d504a"><text textAnchor="middle" y="-12">N</text><path d="M0 -7L-7 10L0 6L7 10Z" fill="#a72236"/><path d="M0 8V25" stroke="#a72236" strokeWidth="2"/></g>
 </svg>);
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
    <div className="capitol-explore__map-caption"><span>CAPITOL HILL CAMPUS · ILLUSTRATIVE OVERVIEW</span><span>SELECT A BUILDING TO EXPLORE</span></div>
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
