(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = d => d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
  const departure = new Date(`${CONFIG.departureDate}T00:00:00`);
  const boarding  = new Date(`${CONFIG.boardingDate}T00:00:00`);
  const arrival   = new Date(`${CONFIG.offBoardDate}T${CONFIG.arrivalTime}:00`);
  const pad = n => String(n).padStart(2, '0');

  $('when').textContent = arrival.toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) + `, ${CONFIG.arrivalTime} Uhr · ${CONFIG.eventLocation}`;
  $('dayDate').textContent = arrival.toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  $('mapBtn').href = CONFIG.appleMapsLink;

  // Bilder-Fallback
  ['mint','purple'].forEach(id => {
    const img = $(id), off = () => { img.parentElement.classList.add('noimg'); img.remove(); };
    img.addEventListener('error', off);
    if (img.complete && !img.naturalWidth) off();
  });

  // Countdown (Tage zählen beim Laden hoch)
  let counted = reduce;
  function daysLeft(){ return Math.max(0, Math.floor((arrival - new Date()) / DAY)); }
  function tick() {
    const now = new Date(); let ms = Math.max(0, arrival - now);
    const d = Math.floor(ms / DAY); ms -= d * DAY;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    if (counted) $('cd').textContent = d;
    $('ch').textContent = h; $('cm').textContent = pad(m); $('cs').textContent = pad(Math.floor(ms / 1e3));
    if (now >= arrival) { $('status').textContent = 'Geschafft'; $('title').textContent = 'Endlich wieder zusammen.'; }
    else if (now >= boarding) $('status').textContent = `Tag ${Math.floor((now - boarding) / DAY) + 1} an Bord`;
    else $('status').textContent = 'Auf dem Weg zum Schiff';
  }
  tick(); setInterval(tick, 1000);
  if (!reduce) {
    const target = daysLeft(), t0 = performance.now() + 1300, dur = 1800;
    (function run(t){
      const p = Math.min(1, Math.max(0, (t - t0) / dur));
      $('cd').textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      p < 1 ? requestAnimationFrame(run) : (counted = true);
    })(performance.now());
  }

  // Fortschritt & Meilensteine
  const pct = Math.min(100, Math.max(0, (new Date() - departure) / (arrival - departure) * 100));
  CONFIG.milestones.forEach(m => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${m.title}</b>${fmt(new Date(m.date + 'T00:00:00'))}`;
    $('marks').appendChild(li);
  });
  const route = document.querySelector('.route');
  const go = () => {
    $('fill').style.width = pct + '%';
    $('shipFig').style.left = pct + '%';
    let n = 0; const t0 = performance.now();
    (function c(t){ const p = Math.min(1, (t - t0) / 1600); $('pct').textContent = Math.round(pct * p); if (p < 1) requestAnimationFrame(c); })(t0);
  };

  // Tagesablauf
  const steps = $('steps');
  CONFIG.homeDay.forEach(s => {
    const li = document.createElement('li'); li.className = 'step';
    li.innerHTML = `<time>${s.time}</time><div><h3>${s.title}</h3><p class="place">${s.place}</p><p class="note">${s.note || ''}</p></div>`;
    steps.appendChild(li);
  });
  const items = [...steps.querySelectorAll('.step')], spine = $('spineFill');
  function scrollUpdate() {
    const r = steps.getBoundingClientRect(), vh = innerHeight, line = vh * .62;
    const fill = Math.min(r.height, Math.max(0, line - r.top));
    spine.style.height = fill + 'px';
    items.forEach(el => el.classList.toggle('on', el.getBoundingClientRect().top < line));
  }
  addEventListener('scroll', scrollUpdate, {passive:true}); addEventListener('resize', scrollUpdate); scrollUpdate();

  // Einblenden beim Scrollen
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); if (e.target === route) go(); io.unobserve(e.target);
  }), {threshold:.25});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Kalender (.ics)
  $('calendarBtn').onclick = () => {
    const day = CONFIG.offBoardDate.replace(/-/g, ''), t = CONFIG.arrivalTime.replace(':', '');
    const endH = pad((parseInt(CONFIG.arrivalTime) + 1) % 24);
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wiedersehen//DE','BEGIN:VEVENT',
      `UID:wiedersehen-${day}@departure`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `SUMMARY:${CONFIG.eventTitle}`,`LOCATION:${CONFIG.eventLocation}`,`DESCRIPTION:${CONFIG.eventNote}`,
      `DTSTART;TZID=Europe/Berlin:${day}T${t}00`,`DTEND;TZID=Europe/Berlin:${day}T${endH}${CONFIG.arrivalTime.slice(3)}00`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], {type:'text/calendar'})); a.download = 'wiedersehen.ics'; a.click();
  };
})();
