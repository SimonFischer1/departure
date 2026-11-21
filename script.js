(()=>{
const C=window.REISE,$=id=>document.getElementById(id),NS="http://www.w3.org/2000/svg";
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const parse=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const n=new Date(),today=new Date(n.getFullYear(),n.getMonth(),n.getDate());
const diff=(a,b)=>Math.round((b-a)/864e5);
const fmt=(d,o)=>new Intl.DateTimeFormat("de-DE",o).format(d);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const sv=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
const stops=C.stops.map(s=>({...s,d:parse(s.datum)})).sort((a,b)=>a.d-b.d);
const first=stops[0].d,last=stops[stops.length-1].d,N=stops.length,total=Math.max(1,diff(first,last));

document.title=C.seitenTitel;
$("schiff").textContent=C.schiff;$("titel").textContent=C.titel;$("untertitel").textContent=C.untertitel;

/* Pixel-Maske (halbe Breite, wird gespiegelt) */
const HALF=["....BBBB","..BBRRRK",".BRRRKRK",".BRRKRRK","BRRKRRRK","BRKRRRRK","BWWWRRRK","BWWWWRRK","BRWWWWRK","BRRWWWRK","BRKRRRRK",".BRKRRRK",".BRRKRRK","..BRRKRK","...BBRRK","....BBBB"];
const COL={B:"#6e0c14",R:"#e5232d",K:"#46060c",W:"#f0f4ff"};
function sprite(){
 if(C.bild){const i=document.createElement("img");i.src=C.bild;i.alt="";return i}
 const s=sv("svg",{viewBox:"0 0 16 16","shape-rendering":"crispEdges","aria-hidden":"true"});
 HALF.forEach((r,y)=>{(r+[...r].reverse().join("")).split("").forEach((c,x)=>{if(c!==".")s.append(sv("rect",{x,y,width:1,height:1,fill:COL[c]}))})});
 return s}
$("sprite").append(sprite());

/* Anzeige für einen Abstand (Tage bis Ankunft) */
const root=document.documentElement,bars=$("bars");
for(let i=0;i<10;i++)bars.append(el("i"));
function show(left,sim){
 const ratio=Math.min(1,Math.max(0,left/total)),arrived=left<=0;
 const slow=C.blinkLangsam||2.8,fast=Math.max(.34,C.blinkSchnell||.34);
 const period=arrived?fast:fast+(slow-fast)*Math.pow(ratio,.9);
 root.style.setProperty("--period",period.toFixed(3)+"s");
 $("tage").textContent=Math.max(0,left);
 $("zaehlerText").textContent=left===1&&C.zaehlerTextEin?C.zaehlerTextEin:C.zaehlerText;
 const lit=arrived?10:Math.max(1,Math.round((1-ratio)*10));
 [...bars.children].forEach((b,i)=>b.className=i<lit?"on":"");
 let text=C.vorStart;
 if(arrived)text=C.angekommen;
 else if(sim||today>=first){text=(C.signal.find(s=>ratio>=s.ab)||C.signal[C.signal.length-1]).text}
 $("status").textContent=text;
 const bpm=Math.round(60/period);
 $("rate").textContent=reduce?"Bewegung reduziert – das Signal blinkt nicht.":`Signal blinkt ${bpm}-mal pro Minute`;
 $("pill").hidden=!sim;$("live").hidden=!sim;
 moveMark(total-Math.max(0,Math.min(total,left)))}

/* Route */
const track=$("track"),fill=el("div","fill");track.append(fill);
const pos=stops.map((_,i)=>N>1?i/(N-1):0);
const stopEls=stops.map((s,i)=>{const e=el("div","stop"+(i===0?" first":i===N-1?" last":""));e.style.left=pos[i]*100+"%";
 e.append(el("b",null,s.kurz||s.titel),el("span",null,fmt(s.d,{day:"2-digit",month:"2-digit",year:"numeric"})));track.append(e);return e});
const mark=el("div","mark blink");mark.append(sprite());track.append(mark);
function moveMark(doneDays){
 const t=first.getTime()+doneDays*864e5;let p=0;
 if(t>=last.getTime())p=1;else if(t>first.getTime()){for(let i=0;i<N-1;i++){const a=stops[i].d.getTime(),b=stops[i+1].d.getTime();
  if(a<=t&&t<b){p=pos[i]+(pos[i+1]-pos[i])*(t-a)/Math.max(1,b-a);break}}}
 mark.style.left=p*100+"%";fill.style.width=p*100+"%";
 stopEls.forEach((e,i)=>e.classList.toggle("past",pos[i]<=p+1e-9))}

/* Verlauf */
const ICON={
 flug:'<svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
 schiff:'<svg class="s" viewBox="0 0 24 24"><path d="M3 14l2 6h14l2-6zM6 14V9h12v5M9 9V5h6v4"/></svg>',
 flagge:'<svg class="s" viewBox="0 0 24 24"><path d="M6 21V3M6 4h12l-3 4 3 4H6"/></svg>',
 punkt:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>'};
const PIN='<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>';
let status=C.vorStart;stops.forEach(s=>{if(s.d<=today)status=s.status||status;if(+s.d===+today&&s.heute)status=s.heute});
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

/* Start + Regler */
const realLeft=Math.max(0,diff(today,last));
const slider=$("slider");slider.max=total;slider.value=Math.max(0,Math.min(total,total-realLeft));
show(realLeft,false);
slider.oninput=()=>show(total-Number(slider.value),true);
$("live").onclick=()=>{slider.value=Math.max(0,Math.min(total,total-realLeft));show(realLeft,false)};

/* Flugansicht: wechselt automatisch, wenn der Abflug unter "vorlaufStunden" liegt. Alle Daten aus config.js */
const FS=$("fsvg"),FP=$("fplane"),scan=document.querySelector(".scan"),MIN=6e4;
const FC={B:"#6e0c14",R:"#ff453a",K:"#46060c",W:"#f5f5f7",U:"#0a84ff",G:"#8e8e93"};
const SPR=["..UU..................","..UBB.................","..BRBBBBBBBBBBBBB.....",".BRRRRRRRRRRRRRRRBB...","BRRRRRRRRRRWWRRWWRRB..","BRRRRRRRRRRRWRRRWRRRB.",".BRRRRRRRRRRRRRRRBB...","..BBBBBBBBBBBBBBB.....",".......KKKK...........","......KKKKKK..........","....G.....G......G...."];
{let h="";const U=6,W=22,H=SPR.length;
 SPR.forEach((r,y)=>[...r].forEach((c,x)=>{if(c!==".")h+=`<rect${y===10?' class="wheels"':""} x="${(x-W/2)*U}" y="${(y-H/2)*U}" width="${U}" height="${U}" fill="${FC[c]}"/>`}));
 $("fpx").innerHTML=h+`<rect class="flame" x="${-W/2*U-14}" y="-6" width="12" height="8" fill="#ff9f0a"/>`}
const demo=new URLSearchParams(location.search).get("flug");
const DEMO={nummer:"LH 000",von:{code:"MNL",ort:"Manila",zone:"Asia/Manila"},nach:{code:"BRE",ort:"Bremen",zone:"Europe/Berlin"}};
const tf=(d,z)=>{try{return new Intl.DateTimeFormat("de-DE",{hour:"2-digit",minute:"2-digit",timeZone:z||"Europe/Berlin"}).format(d)}catch(e){return fmt(d,{hour:"2-digit",minute:"2-digit"})}};
const p2=v=>String(v).padStart(2,"0");
const clock=ms=>{ms=Math.max(0,Math.floor(ms/1e3));return `${p2(Math.floor(ms/3600))}:${p2(Math.floor(ms%3600/60))}:${p2(ms%60)}`};
const durT=ms=>{const m=Math.round(ms/MIN);return `${Math.floor(m/60)} Std ${p2(m%60)} Min`};
function flightTick(){
 let f=window.REISE.flug||{},now=Date.now(),ph=f.phase||"";
 if(demo){ph=demo;if(!f.abflug||!f.ankunft)f={...DEMO,abflug:new Date(now+3*36e5).toISOString(),ankunft:new Date(now+9*36e5).toISOString()}}
 const have=f.abflug&&f.ankunft&&!isNaN(new Date(f.abflug))&&!isNaN(new Date(f.ankunft));
 const delay=(+f.verspaetung||0)*MIN,dep=have?+new Date(f.abflug)+delay:0,arr=have?+new Date(f.ankunft)+delay:0;
 const vor=(f.vorlaufStunden||24)*36e5;
 const active=!!ph||(have&&now>=dep-vor&&now<arr+24*36e5);
 scan.classList.toggle("flightmode",active);$("fl").hidden=!active;$("testsec").hidden=active;
 if(!active)return;
 let k=ph,p=.5;
 if(!k){if(now<dep)k="airport";else if(now<dep+10*MIN){k="takeoff";p=(now-dep)/(10*MIN)}else if(now<arr-15*MIN)k="flight";else if(now<arr){k="landing";p=(now-(arr-15*MIN))/(15*MIN)}else k="arrived"}
 const von=f.von||{},nach=f.nach||{};
 const T={airport:["Am Flughafen",clock(dep-now),"bis zum Abflug"],takeoff:["Hebt ab",clock(arr-now),"bis zur Landung"],flight:["In der Luft",clock(arr-now),"bis zur Landung"],landing:["Landeanflug",clock(arr-now),"bis zur Landung"],arrived:["Gelandet","",`Willkommen in ${nach.ort||nach.code||"der Heimat"}`]}[k];
 if(!T)return;
 let x=180,y=192,r=0,cls="air bob";
 if(k==="takeoff"){x=180+220*p;y=192-100*p*p;r=-16*p;cls="up moving"}
 else if(k==="flight"){x=400;y=92;cls="fly moving bob"}
 else if(k==="landing"){x=400+100*p;y=92+100*p;r=7*(1-p);cls="fly moving"}
 else if(k==="arrived"){x=480;cls="arrived"}
 FS.setAttribute("class",cls);FP.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`;
 $("fcl").textContent=von.code||"";$("fcr").textContent=nach.code||"";
 $("fstate").textContent=T[0];$("fclock").textContent=T[1];$("fclock").hidden=!T[1];$("fsub").textContent=T[2];
 $("fvc").textContent=von.code||"";$("fvo").textContent=von.ort||"";$("fnc").textContent=nach.code||"";$("fno").textContent=nach.ort||"";
 $("fnr").textContent=f.nummer||"";
 if(have){const late=delay?` (${delay>0?"+":""}${delay/MIN} Min)`:"";
  $("fvt").textContent=tf(new Date(dep),von.zone)+late;$("fnt").textContent=tf(new Date(arr),nach.zone)+late;
  $("fdur").textContent=durT(arr-dep);$("ffill").style.width=Math.min(100,Math.max(0,(now-dep)/(arr-dep)*100))+"%"}
 root.style.setProperty("--period",(k==="flight"?1.4:k==="arrived"?4:.7)+"s")}
flightTick();setInterval(flightTick,1000);
/* config.js alle 60 s neu laden, damit Änderungen (Verspätung, Phase) ohne Neuladen ankommen */
setInterval(()=>{const e=document.createElement("script");e.src="config.js?t="+Date.now();e.onload=()=>e.remove();document.head.append(e)},60000);
})();
