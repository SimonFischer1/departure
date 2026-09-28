(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = (s, t = '00:00') => new Date(`${s}T${t}:00`);
  const fmt = d => d.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
  const long = d => d.toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const today = new Date(); today.setHours(0,0,0,0);
  const start = D(CONFIG.startDate), board = D(CONFIG.boardingDate), arr = D(CONFIG.arrivalDate);
  const left = Math.round((arr - today) / DAY);

  // ---------- Hero ----------
  if (left < 0) { $('status').textContent = 'Geschafft'; $('cd').textContent = '0'; $('title').textContent = 'Endlich wieder zusammen.'; }
  else {
    $('status').textContent = today >= board ? `Tag ${Math.round((today - board) / DAY) + 1} an Bord` : 'Auf dem Weg zum Schiff';
    if (left === 0) $('title').textContent = 'Heute kommt Simon nach Hause.';
    if (left === 1) $('unit').textContent = 'Tag';
    if (reduce) $('cd').textContent = left;
    else { const t0 = performance.now() + 500;
      (function run(t){ const p = Math.min(1, Math.max(0, (t - t0) / 1800)); $('cd').textContent = Math.round(left * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(run); })(performance.now()); }
  }
  const pct = Math.round(Math.min(100, Math.max(0, (today - start) / (arr - start) * 100)));
  $('pFrom').textContent = fmt(start); $('pTo').textContent = fmt(arr); $('pPct').textContent = pct + ' % geschafft';
  $('pbar').setAttribute('aria-valuenow', pct);
  setTimeout(() => $('pfill').style.width = pct + '%', 150);

  // ---------- Timeline ----------
  const tl = $('tl'), now = new Date();
  const evs = CONFIG.timeline.map(e => ({...e, at: D(e.date, e.time || '00:00')})).sort((a, b) => a.at - b.at);
  let nowPlaced = false;
  const addNow = () => { if (nowPlaced || left < 0) return; nowPlaced = true;
    const li = document.createElement('li'); li.className = 'ev now';
    li.innerHTML = `<div class="when"><b>Heute</b><span>${long(today)}</span></div><div><h3>${$('status').textContent}</h3><p class="note">Noch ${left} ${left === 1 ? 'Tag' : 'Tage'} bis zum Wiedersehen.</p></div>`;
    tl.appendChild(li); };
  evs.forEach(e => {
    if (!nowPlaced && e.at > now) addNow();
    const li = document.createElement('li'); li.className = 'ev' + (e.final ? ' final' : '');
    const dd = e.at.toLocaleDateString('de-DE', {weekday:'long'});
    li.innerHTML = `<div class="when"><b>${e.time || e.at.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'})}</b><span>${e.time ? long(e.at) : dd + ', ' + fmt(e.at)}</span></div><div><h3>${e.title}</h3><p class="place">${e.place || ''}</p><p class="note">${e.note || ''}</p></div>`;
    tl.appendChild(li);
  });
  const items = [...tl.querySelectorAll('.ev')], spine = $('spineFill');
  function update() {
    const r = tl.getBoundingClientRect(), line = innerHeight * .66;
    spine.parentElement.style.setProperty('--h', '0');
    spine.style.height = Math.min(r.height - 28, Math.max(0, line - r.top - 14)) + 'px';
    items.forEach(el => el.classList.toggle('on', el.getBoundingClientRect().top < line));
    const max = document.documentElement.scrollHeight - innerHeight;
    $('scrollbar').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }
  addEventListener('scroll', update, {passive:true}); addEventListener('resize', update); update();

  // ---------- Kalender ----------
  $('calSub').textContent = long(arr);
  $('cWhen').textContent = `${long(arr)}, ${CONFIG.arrivalTime} Uhr`;
  $('cWhere').textContent = CONFIG.eventLocation;
  $('mapBtn').href = CONFIG.appleMapsLink;

  const t = CONFIG.arrivalTime.replace(':', ''), day = CONFIG.arrivalDate.replace(/-/g, '');
  const endT = String((parseInt(CONFIG.arrivalTime) + 1) % 24).padStart(2, '0') + CONFIG.arrivalTime.slice(3);

  $('icsBtn').onclick = () => {
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wiedersehen//DE','BEGIN:VEVENT',
      `UID:wiedersehen-${day}@departure`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `SUMMARY:${CONFIG.eventTitle}`,`LOCATION:${CONFIG.eventLocation}`,`DESCRIPTION:${CONFIG.eventNote}`,
      `DTSTART;TZID=Europe/Berlin:${day}T${t}00`,`DTEND;TZID=Europe/Berlin:${day}T${endT.replace(':', '')}00`,
      'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:Gleich ist es so weit ❤️','END:VALARM',
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], {type:'text/calendar'})); a.download = 'wiedersehen.ics'; a.click();
  };

  // ---------- Zahl immer aktuell: bei neuem Tag oder Rückkehr zum Tab neu laden ----------
  const dayKey = new Date().toDateString();
  const fresh = () => { if (new Date().toDateString() !== dayKey) location.reload(); };
  setInterval(fresh, 60000); document.addEventListener('visibilitychange', () => { if (!document.hidden) fresh(); });

  // ---------- Einblenden beim Scrollen ----------
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.15});
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));
})();
