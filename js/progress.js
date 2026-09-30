// "how baked is this page": a line along the top that browns as you scroll (with a rolling pin
// riding its tip) and a little cookie in the top-right corner that bakes from dough to golden.
(function () {
  const corner = document.querySelector('.corner') || (() => {
    const c = document.createElement('div');
    c.className = 'corner';
    document.body.appendChild(c);
    return c;
  })();

  const bar = document.createElement('div');
  bar.className = 'bake-bar';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = `
    <div class="bake-fill"></div>
    <svg class="bake-pin" viewBox="0 0 12 40">
      <rect x="3.5" y="1" width="5" height="8" rx="2.5" fill="#b98050" stroke="#4b2a1c" stroke-width="1.2"/>
      <rect x="3.5" y="31" width="5" height="8" rx="2.5" fill="#b98050" stroke="#4b2a1c" stroke-width="1.2"/>
      <rect x="1" y="8" width="10" height="24" rx="5" fill="#e3b27a" stroke="#4b2a1c" stroke-width="1.4"/>
      <path class="pin-roll" d="M3.5 12 V28" stroke="#fffaf1" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
    </svg>`;
  document.body.appendChild(bar);

  const pill = document.createElement('div');
  pill.className = 'bake-meter';
  pill.setAttribute('role', 'progressbar');
  pill.setAttribute('aria-label', 'How far down the page you are');
  pill.setAttribute('aria-valuemin', '0');
  pill.setAttribute('aria-valuemax', '100');
  pill.innerHTML = `
    <svg class="bake-cookie" viewBox="0 0 32 32" aria-hidden="true">
      <g class="bake-steam" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M11 6 q-2 -2 0 -4"/><path d="M16 6 q-2 -2 0 -4"/><path d="M21 6 q-2 -2 0 -4"/>
      </g>
      <circle class="bake-dough" cx="16" cy="19" r="11" stroke="#4b2a1c" stroke-width="1.6"/>
      <g class="bake-chips" fill="#3e2114">
        <circle cx="12" cy="16" r="1.8"/><circle cx="19" cy="15" r="1.5"/><circle cx="21" cy="21" r="1.8"/>
        <circle cx="13" cy="23" r="1.5"/><circle cx="16.5" cy="19.5" r="1.3"/>
      </g>
    </svg>
    <span class="bake-label"></span>`;
  corner.prepend(pill);

  const fill = bar.querySelector('.bake-fill');
  const pin = bar.querySelector('.bake-pin');
  const dough = pill.querySelector('.bake-dough');
  const chips = pill.querySelector('.bake-chips');
  const label = pill.querySelector('.bake-label');

  // raw dough -> golden -> well done
  const STOPS = [[0, [245, 226, 188]], [0.6, [222, 168, 92]], [1, [184, 112, 52]]];
  function doughColor(t) {
    for (let i = 1; i < STOPS.length; i++) {
      const [t1, c1] = STOPS[i], [t0, c0] = STOPS[i - 1];
      if (t <= t1) {
        const k = (t - t0) / (t1 - t0);
        return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(',')})`;
      }
    }
    return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
  }

  let queued = false;
  function update() {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    const pct = Math.round(t * 100);
    fill.style.width = `${t * 100}%`;
    pin.style.left = `${t * 100}%`;
    pin.style.transform = `translateX(-${t * 100}%)`;
    // the highlight slides across the pin so it looks like it's rolling
    pin.querySelector('.pin-roll').style.transform = `translateX(${(t * 40) % 5}px)`;
    dough.style.fill = doughColor(t);
    chips.style.opacity = String(Math.min(1, t * 1.6));
    const done = pct >= 99;
    pill.classList.toggle('done', done);
    label.textContent = done ? 'Fully Baked!' : `${pct}% Baked`;
    pill.setAttribute('aria-valuenow', String(pct));
  }
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();
