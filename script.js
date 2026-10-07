const TRIP={start:"2026-09-03",boarding:"2026-09-05",end:"2026-12-04"};
const $=s=>document.querySelector(s), timeline=$("#timeline"), track=$("#dateTrack");
const D=v=>{const[y,m,d]=v.split("-").map(Number);return new Date(y,m-1,d)};
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const today=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())};
const days=(a,b)=>Math.round((b-a)/86400000);
const fmt=d=>new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d);

function status(d){const s=D(TRIP.start),b=D(TRIP.boarding),e=D(TRIP.end);
 if(d<s)return"Die Reise beginnt bald.";if(d<b)return"Auf dem Weg nach Rotterdam.";
 if(d<e)return"Aktuell auf See.";if(d.getTime()===e.getTime())return"Heute voraussichtlich von Bord.";
 return"Die Reise ist abgeschlossen."}

function info(d){const k=key(d),s=D(TRIP.start),b=D(TRIP.boarding),e=D(TRIP.end);
 if(k===TRIP.start)return{major:true,icon:"✈",title:"Abreise nach Rotterdam",text:"Du startest deine Reise und machst dich auf den Weg nach Rotterdam.",loc:"Rotterdam, Niederlande",badge:"START"};
 if(k===TRIP.boarding)return{major:true,icon:"⚓",title:"Auf das Schiff steigen",text:"Du gehst an Bord. Das Abenteuer auf See beginnt.",loc:"Rotterdam, Niederlande",badge:"BOARDING"};
 if(k===TRIP.end)return{major:true,icon:"⚑",title:"Von Bord gehen",text:"Voraussichtlich endet die Schiffsreise heute.",loc:"Zielhafen · noch offen",badge:"VERMUTLICH"};
 if(d<s)return{icon:"·",title:"Noch vor der Abreise",text:"Die Reise hat noch nicht begonnen. Der Countdown läuft.",loc:"Start: "+fmt(s)};
 if(d<b)return{icon:"→",title:"Auf dem Weg nach Rotterdam",text:"Ein Reisetag zwischen Abreise und Boarding.",loc:"Nächster Meilenstein: Boarding"};
 if(d<=e)return{icon:"≈",title:"Heute auf See",text:"Ein weiterer Tag deines Abenteuers. Jeder Tag bringt dich näher nach Hause.",loc:"Bordleben · Kurs nach Hause"};
 return{icon:"✓",title:"Zurück an Land",text:"Die geplante Reise ist abgeschlossen.",loc:"Reise beendet"}}

function nav(t){track.innerHTML="";let first=new Date(t);first.setDate(t.getDate()-3);
 for(let i=0;i<7;i++){let d=new Date(first);d.setDate(first.getDate()+i);let p=document.createElement("button");
 p.className="date-pill"+(key(d)===key(t)?" active today":"");p.dataset.date=key(d);
 p.innerHTML=`<span class="dow">${new Intl.DateTimeFormat("de-DE",{weekday:"short"}).format(d)}</span><span class="day">${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}</span>`;
 p.onclick=()=>focus(d,true);track.appendChild(p)}}

function timelineRender(t){timeline.innerHTML="";let set=new Set(),arr=[],add=d=>{if(!set.has(key(d))){set.add(key(d));arr.push(new Date(d))}};
 let a=new Date(t);a.setDate(t.getDate()-2);let z=new Date(t);z.setDate(t.getDate()+3);
 for(let d=new Date(a);d<=z;d.setDate(d.getDate()+1))add(d);
 [D(TRIP.start),D(TRIP.boarding),D(TRIP.end)].forEach(add);arr.sort((a,b)=>a-b);
 arr.forEach(d=>{let x=info(d),cur=key(d)===key(t),el=document.createElement("article");
 el.className="timeline-item"+(x.major?" major":"")+(cur?" current":"");el.id="day-"+key(d);
 el.innerHTML=`<div class="timeline-dot">${x.icon}</div><div class="card"><div class="card-top"><span class="card-date">${fmt(d)}${cur?" · HEUTE":""}</span>${x.badge?`<span class="card-badge">${x.badge}</span>`:""}</div><h3>${x.title}</h3><p>${x.text}</p><div class="location"><span>⌖</span>${x.loc}</div></div>`;
 timeline.appendChild(el)})}

function update(t){const s=D(TRIP.start),e=D(TRIP.end),total=days(s,e),elapsed=Math.min(total,Math.max(0,days(s,t)));
 $("#daysRemaining").textContent=Math.max(0,days(t,e));$("#progressPercent").textContent=(total?Math.round(elapsed/total*100):0)+"%";
 $("#todayLabel").textContent=fmt(t);$("#todayStatus").textContent=status(t)}

function focus(d,smooth){document.querySelectorAll(".date-pill").forEach(p=>p.classList.toggle("active",p.dataset.date===key(d)));
 const el=$("#day-"+key(d));if(el)el.scrollIntoView({behavior:smooth?"smooth":"auto",block:"center"})}

function init(){const t=today();update(t);nav(t);timelineRender(t);setTimeout(()=>focus(t,false),80);
 $("#todayBtn").onclick=()=>focus(today(),true);$("#jumpToday").onclick=()=>focus(today(),true);
 const menu=$("#mobileMenu");$("#menuBtn").onclick=()=>menu.classList.add("open");$("#closeMenu").onclick=()=>menu.classList.remove("open");
 menu.querySelectorAll("a").forEach(a=>a.onclick=()=>menu.classList.remove("open"))}
document.addEventListener("DOMContentLoaded",init);
