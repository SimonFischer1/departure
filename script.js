(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5;
  const fmt = d => d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
  const arrival = new Date(`${CONFIG.arrivalDate}T${CONFIG.arrivalTime}:00`);
  const departure = new Date(`${CONFIG.departureDate}T00:00:00`);
  const boarding = new Date(`${CONFIG.boardingDate}T00:00:00`);

  // Datum & Beschriftungen
  $('when').textContent = arrival.toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'})
    + `, ${CONFIG.arrivalTime} Uhr – ${CONFIG.eventLocation}`;
  $('fromLbl').textContent = `Abreise ${fmt(departure)}`;
  $('toLbl').textContent = `Zuhause ${fmt(arrival)}`;
  $('mapBtn').href = CONFIG.appleMapsLink;

  // Fallback, falls die Bilder fehlen
  ['mint','purple'].forEach(id => {
    const img = $(id);
    img.addEventListener('error', () => { img.remove(); img.parentElement?.classList.add('noimg'); });
  });
  document.querySelectorAll('.fig img').forEach(i => { if (i.complete && !i.naturalWidth) i.dispatchEvent(new Event('error')); });

  // Fortschritt
  function progress() {
    const now = new Date();
    const pct = Math.min(100, Math.max(0, (now - departure) / (arrival - departure) * 100));
    const trackW = document.querySelector('.line').getBoundingClientRect().width;
    const px = trackW * pct / 100;
    $('progress').style.width = px + 'px';
    $('shipFig').style.left = `calc(${CONFIG.departureDate ? '44px' : '0px'} + ${px}px)`;
    $('pctLbl').textContent = Math.floor(pct) + ' % geschafft';
  }

  // Countdown
  function tick() {
    const now = new Date();
    let ms = Math.max(0, arrival - now);
    const d = Math.floor(ms / DAY); ms -= d * DAY;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    const s = Math.floor(ms / 1e3);
    $('cd').textContent = d; $('ch').textContent = h;
    $('cm').textContent = String(m).padStart(2,'0'); $('cs').textContent = String(s).padStart(2,'0');

    if (now >= arrival) { $('status').textContent = 'Geschafft'; $('title').textContent = 'Endlich wieder zusammen ❤️'; }
    else if (now >= boarding) $('status').textContent = `Tag ${Math.floor((now - boarding) / DAY) + 1} an Bord`;
    else $('status').textContent = 'Auf dem Weg zum Schiff';
  }
  tick(); setInterval(tick, 1000);
  requestAnimationFrame(() => setTimeout(progress, 150));
  addEventListener('resize', progress);

  // Logbuch
  const today = new Date(); today.setHours(0,0,0,0);
  let nextSet = false;
  CONFIG.timeline.forEach(i => {
    const d = new Date(i.date + 'T00:00:00');
    const li = document.createElement('li');
    if (d <= today) li.className = 'done-i';
    else if (!nextSet) { li.className = 'next'; nextSet = true; }
    else li.className = 'later';
    li.innerHTML = `<span class="dot" aria-hidden="true">${i.icon}</span><time datetime="${i.date}">${fmt(d)}</time><strong>${i.title}</strong><p>${i.text || ''}</p>`;
    $('timeline').appendChild(li);
  });

  // Kalender (.ics)
  $('calendarBtn').onclick = () => {
    const day = CONFIG.arrivalDate.replace(/-/g, '');
    const t = CONFIG.arrivalTime.replace(':', '');
    const endH = String((parseInt(CONFIG.arrivalTime) + 1) % 24).padStart(2, '0');
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wiedersehen//DE','BEGIN:VEVENT',
      `UID:wiedersehen-${day}@departure`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `SUMMARY:${CONFIG.eventTitle}`,`LOCATION:${CONFIG.eventLocation}`,`DESCRIPTION:${CONFIG.eventNote}`,
      `DTSTART;TZID=Europe/Berlin:${day}T${t}00`,`DTEND;TZID=Europe/Berlin:${day}T${endH}${CONFIG.arrivalTime.slice(3)}00`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], {type:'text/calendar'}));
    a.download = 'wiedersehen.ics'; a.click();
  };
})();
