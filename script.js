const target=new Date(CONFIG.arrivalDate);const now=new Date();document.getElementById('date').textContent=target.toLocaleDateString('de-DE');document.getElementById('days').textContent=`Noch ${Math.max(0,Math.ceil((target-now)/86400000))} Tage`;const start=new Date(CONFIG.timeline[0].date);const pct=Math.min(100,Math.max(0,((now-start)/(target-start))*100));document.getElementById('progress').style.width=pct+'%';document.getElementById('mapBtn').href=CONFIG.appleMapsLink;const tl=document.getElementById('timeline');CONFIG.timeline.forEach(i=>{const d=document.createElement('div');d.className='timeline-item';d.innerHTML=`${i.icon} <strong>${i.title}</strong><br>${i.date}`;tl.appendChild(d);});document.getElementById('calendarBtn').onclick=()=>{const s=CONFIG.arrivalDate.replace(/-/g,'')+'T'+CONFIG.arrivalTime.replace(':','')+'00';const e=CONFIG.arrivalDate.replace(/-/g,'')+'T235900';const ics=`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${CONFIG.eventTitle}
LOCATION:${CONFIG.eventLocation}
DESCRIPTION:${CONFIG.eventNote}
DTSTART:${s}
DTEND:${e}
END:VEVENT
END:VCALENDAR`;const blob=new Blob([ics],{type:'text/calendar'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='wiedersehen.ics';a.click();};