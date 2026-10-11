(()=>{
const C=window.REISE,$=id=>document.getElementById(id),NS="http://www.w3.org/2000/svg";
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const parse=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const n=new Date(),today=new Date(n.getFullYear(),n.getMonth(),n.getDate());
const diff=(a,b)=>Math.round((b-a)/864e5);
const fmt=(d,o)=>new Intl.DateTimeFormat("de-DE",o).format(d);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const sv=(t,a,x)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;return e};
const stops=C.stops.map(s=>({...s,d:parse(s.datum)})).sort((a,b)=>a.d-b.d);
const first=stops[0].d,last=stops[stops.length-1].d,N=stops.length;

document.title=C.seitenTitel;
$("schiff").textContent=C.schiff;$("titel").textContent=C.titel;$("untertitel").textContent=C.untertitel;
$("zaehlerText").textContent=C.zaehlerText;$("bild").alt=C.bildAlt||"";

let status=C.vorStart;
stops.forEach(s=>{if(s.d<=today)status=s.status||status;if(+s.d===+today&&s.heute)status=s.heute});
$("status").textContent=status;

const left=Math.max(0,diff(today,last)),total=diff(first,last);
const done=Math.min(total,Math.max(0,diff(first,today))),pct=total?done/total:0;
$("meta").textContent=today<first?`Abreise in ${diff(today,first)} Tagen`:today>last?"Reise abgeschlossen":`Tag ${done+1} von ${total+1} · ${Math.round(pct*100)} % der Reise`;
$("gauge").setAttribute("aria-valuenow",Math.round(pct*100));

/* Skalenring */
const T=72,ticks=$("ticks");
for(let i=0;i<T;i++){const a=i/T*2*Math.PI-Math.PI/2,big=i%6===0,r1=104,r2=big?90:96,c=Math.cos(a),s=Math.sin(a);
 ticks.append(sv("line",{x1:c*r1,y1:s*r1,x2:c*r2,y2:s*r2,stroke:i/T<=pct&&pct>0?"#5aa9ff":"#5aa9ff","stroke-opacity":i/T<=pct&&pct>0?1:.28,"stroke-width":big?2.5:1.5,"stroke-linecap":"round"}))}
const arc=$("arc"),end=$("end"),CIRC=2*Math.PI*76,a=pct*2*Math.PI-Math.PI/2;
end.setAttribute("cx",Math.cos(a)*76);end.setAttribute("cy",Math.sin(a)*76);
requestAnimationFrame(()=>requestAnimationFrame(()=>{arc.style.transition=reduce?"none":"stroke-dasharray 1.4s cubic-bezier(.2,.7,.2,1)";arc.setAttribute("stroke-dasharray",`${CIRC*pct} ${CIRC}`)}));
const out=$("tage");
if(reduce||!left)out.textContent=left;else{const t0=performance.now(),f=t=>{const p=Math.min(1,(t-t0)/1100);out.textContent=Math.round(left*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

/* Routenkarte */
const rp=$("rp"),L=rp.getTotalLength(),at=d=>rp.getPointAtLength(Math.max(0,Math.min(L,d)));
const pos=stops.map((_,i)=>N>1?L*i/(N-1):0);
let dist=0;
if(today>=last)dist=L;else if(today>first){for(let i=0;i<N-1;i++)if(stops[i].d<=today&&today<stops[i+1].d){dist=pos[i]+(pos[i+1]-pos[i])*diff(stops[i].d,today)/Math.max(1,diff(stops[i].d,stops[i+1].d));break}}
$("rd").setAttribute("stroke-dasharray",`${dist} ${L}`);
stops.forEach((s,i)=>{const p=at(pos[i]),past=pos[i]<=dist,up=i%2===1,anchor=i===0?"start":i===N-1?"end":"middle",lx=i===0?p.x-14:i===N-1?p.x+14:p.x;
 $("pts").append(sv("circle",{cx:p.x,cy:p.y,r:7,fill:past?"#1688ff":"#0a1424",stroke:past?"#1688ff":"#5aa9ff","stroke-width":2.5}));
 $("pts").append(sv("text",{x:lx,y:p.y+(up?-22:30),"text-anchor":anchor,class:"k"},s.kurz||s.titel));
 $("pts").append(sv("text",{x:lx,y:p.y+(up?-11:41),"text-anchor":anchor,class:"d"},fmt(s.d,{day:"2-digit",month:"2-digit",year:"numeric"})))});
const sp=at(dist),sq=at(dist+2),sr=at(dist-2),ang=Math.atan2(sq.y-sr.y,sq.x-sr.x)*180/Math.PI;
$("ship").setAttribute("transform",`translate(${sp.x} ${sp.y}) rotate(${ang})`);

/* Verlauf */
const ICON={
 flug:'<svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
 schiff:'<svg class="s" viewBox="0 0 24 24"><path d="M3 14l2 6h14l2-6zM6 14V9h12v5M9 9V5h6v4"/></svg>',
 flagge:'<svg class="s" viewBox="0 0 24 24"><path d="M6 21V3M6 4h12l-3 4 3 4H6"/></svg>',
 punkt:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>'};
const PIN='<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.5 2.5 0 0 1 0 5z"/></svg>';
const entries=[];let marked=today<=first||today>last||stops.some(s=>+s.d===+today);
stops.forEach(s=>{if(!marked&&s.d>today){entries.push({d:today,icon:"punkt",titel:"Heute",text:status,marker:1});marked=true}entries.push(s)});
const route=$("route");
entries.forEach(s=>{
 const st=+s.d===+today?"now":s.d<today?"past":"future",li=el("li","item "+st);
 const node=el("div","node");node.innerHTML=ICON[s.icon]||ICON.punkt;
 const card=el("div","card"),date=el("div","date");
 date.append(el("span",null,fmt(s.d,{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})));
 if(s.badge)date.append(el("span","badge",s.badge));
 if(st==="now"&&!s.marker)date.append(el("span","badge","Heute"));
 card.append(date,el("h3",null,s.titel));
 if(s.text)card.append(el("p",null,s.text));
 if(s.ort){const o=el("div","ort");o.innerHTML=PIN;o.append(el("span",null,s.ort));card.append(o)}
 li.append(node,card);route.append(li)});
$("heute").onclick=()=>{const t=route.querySelector(".now")||route.querySelector(".future")||route.lastElementChild;t.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"})};
})();