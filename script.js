(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = s => new Date(s + 'T00:00:00');
  const fmt = d => d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
  const long = d => d.toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const departure = D(CONFIG.departureDate), boarding = D(CONFIG.boardingDate), off = D(CONFIG.offBoardDate);
  const today = new Date(); today.setHours(0,0,0,0);
  const left = Math.max(0, Math.round((off - today) / DAY));

  $('when').textContent = `${long(off)}, ${CONFIG.arrivalTime} Uhr · ${CONFIG.eventLocation}`;
  $('dayDate').textContent = long(off);
  $('mapBtn').href = CONFIG.appleMapsLink;

  if (today >= off) { $('status').textContent = 'Geschafft'; $('title').textContent = 'Endlich wieder zusammen.'; }
  else if (today >= boarding) $('status').textContent = `Tag ${Math.round((today - boarding) / DAY) + 1} an Bord`;
  else $('status').textContent = 'Auf dem Weg zum Schiff';

  // Tage hochzählen
  const cd = $('cd');
  if (reduce) cd.textContent = left;
  else { const t0 = performance.now() + 500;
    (function run(t){ const p = Math.min(1, Math.max(0, (t - t0) / 1800)); cd.textContent = Math.round(left * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(run); })(performance.now()); }

  // Reise-Karte
  const pct = Math.min(100, Math.max(0, (today - departure) / (off - departure) * 100));
  const path = $('done'), L = path.getTotalLength();
  path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
  const place = p => { const pt = path.getPointAtLength(L * p / 100); [$('ship'), $('halo')].forEach(c => { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); }); };
  place(0);
  function animate() {
    const t0 = performance.now(), dur = reduce ? 1 : 2200;
    (function f(t){ const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4), cur = pct * e;
      path.style.strokeDashoffset = L * (1 - cur / 100); place(cur); $('pct').textContent = Math.round(cur);
      if (p < 1) requestAnimationFrame(f); })(t0);
  }
  CONFIG.milestones.forEach(m => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${m.title}</b><span>${fmt(D(m.date))}</span><span>${m.place}</span>`;
    $('marks').appendChild(li);
  });

  // Tagesablauf
  const steps = $('steps');
  CONFIG.homeDay.forEach(s => {
    const li = document.createElement('li'); li.className = 'step';
    li.innerHTML = `<time>${s.time}</time><div><h3>${s.title}</h3><p class="place">${s.place}</p><p class="note">${s.note || ''}</p></div>`;
    steps.appendChild(li);
  });
  const items = [...steps.querySelectorAll('.step')], spine = $('spineFill');
  function update() {
    const r = steps.getBoundingClientRect(), line = innerHeight * .65;
    spine.style.height = Math.min(r.height - 20, Math.max(0, line - r.top - 10)) + 'px';
    items.forEach(el => el.classList.toggle('on', el.getBoundingClientRect().top < line));
  }
  addEventListener('scroll', update, {passive:true}); addEventListener('resize', update); update();

  // Einblenden beim Scrollen
  const map = document.querySelector('.map');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); if (e.target === map) animate(); io.unobserve(e.target);
    }), {threshold:.2});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); animate(); }

  // Kalender (.ics)
  $('calendarBtn').onclick = () => {
    const day = CONFIG.offBoardDate.replace(/-/g, ''), t = CONFIG.arrivalTime.replace(':', '');
    const endH = String((parseInt(CONFIG.arrivalTime) + 1) % 24).padStart(2, '0');
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wiedersehen//DE','BEGIN:VEVENT',
      `UID:wiedersehen-${day}@departure`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `SUMMARY:${CONFIG.eventTitle}`,`LOCATION:${CONFIG.eventLocation}`,`DESCRIPTION:${CONFIG.eventNote}`,
      `DTSTART;TZID=Europe/Berlin:${day}T${t}00`,`DTEND;TZID=Europe/Berlin:${day}T${endH}${CONFIG.arrivalTime.slice(3)}00`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], {type:'text/calendar'})); a.download = 'wiedersehen.ics'; a.click();
  };
})();
