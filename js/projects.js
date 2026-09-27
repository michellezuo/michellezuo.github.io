// ─── edit your projects here ───────────────────────────────────────────
// kind: chocchip | snickerdoodle | biscoff | doublechoc | matcha | sprinkle
// links: any number of { label, href }
const PROJECTS = [
  { kind: 'chocchip',      name: 'project one',   title: 'Project title', blurb: 'One or two sentences about what it does and why you built it.', tags: ['python', 'tbd'], links: [] },
  { kind: 'snickerdoodle', name: 'project two',   title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { kind: 'biscoff',       name: 'project three', title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { kind: 'doublechoc',    name: 'project four',  title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { kind: 'matcha',        name: 'project five',  title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { kind: 'sprinkle',      name: 'project six',   title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
];
// ───────────────────────────────────────────────────────────────────────

const SPRINKLES = ['#e56b6f', '#7fb3d5', '#f4c95d', '#8fc69a', '#c39bd3'];

// tiny seeded random so each cookie's chips stay put between reloads
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

function makeChips(dough, kind, seed) {
  const rand = rng(seed);
  const count = kind === 'sprinkle' ? 26 : kind === 'snickerdoodle' ? 22 : 9;
  for (let i = 0; i < count; i++) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    // keep chips inside the circle
    const r = Math.sqrt(rand()) * 36, a = rand() * Math.PI * 2;
    chip.style.left = 50 + r * Math.cos(a) + '%';
    chip.style.top = 50 + r * Math.sin(a) + '%';
    if (kind === 'sprinkle') {
      chip.style.width = '12px';
      chip.style.height = '4px';
      chip.style.background = SPRINKLES[i % SPRINKLES.length];
      chip.style.transform = `translate(-50%,-50%) rotate(${rand() * 180}deg)`;
    } else {
      const s = kind === 'snickerdoodle' ? 3 + rand() * 3 : 9 + rand() * 9;
      chip.style.width = s + 'px';
      chip.style.height = s * (0.8 + rand() * 0.3) + 'px';
      chip.style.transform = `translate(-50%,-50%) rotate(${rand() * 90}deg)`;
    }
    dough.appendChild(chip);
  }
}

const tray = document.getElementById('cookies');
const slots = [];

function close(slot) {
  slot.classList.remove('open');
  slot.querySelector('.cookie').classList.remove('open');
  slot.querySelector('.cookie').setAttribute('aria-expanded', 'false');
}

function open(slot) {
  slots.forEach(s => s !== slot && close(s));
  slot.classList.add('open');
  const btn = slot.querySelector('.cookie');
  btn.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');

  // nudge the card sideways so it never runs off screen
  const card = slot.querySelector('.card');
  card.style.setProperty('--nudge', '0px');
  const r = card.getBoundingClientRect();
  const pad = 16;
  let nudge = 0;
  if (r.left < pad) nudge = pad - r.left;
  else if (r.right > window.innerWidth - pad) nudge = window.innerWidth - pad - r.right;
  card.style.setProperty('--nudge', nudge + 'px');
}

PROJECTS.forEach((p, i) => {
  const slot = document.createElement('div');
  slot.className = 'cookie-slot';

  const btn = document.createElement('button');
  btn.className = 'cookie';
  btn.dataset.kind = p.kind;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `card-${i}`);
  btn.setAttribute('aria-label', `${p.name}: ${p.title}`);
  const dough = document.createElement('span');
  dough.className = 'dough';
  makeChips(dough, p.kind, 1234 + i * 977);
  btn.appendChild(dough);

  const label = document.createElement('div');
  label.className = 'cookie-name';
  label.textContent = p.name;

  const card = document.createElement('div');
  card.className = 'card';
  card.id = `card-${i}`;
  card.innerHTML = `
    <h3></h3><p></p>
    <div class="chips">${p.tags.map(() => '<span></span>').join('')}</div>
    ${p.links.length ? `<div class="links">${p.links.map(() => '<a target="_blank" rel="noopener"></a>').join('')}</div>` : ''}`;
  card.querySelector('h3').textContent = p.title;
  card.querySelector('p').textContent = p.blurb;
  card.querySelectorAll('.chips span').forEach((el, j) => (el.textContent = p.tags[j]));
  card.querySelectorAll('.links a').forEach((el, j) => {
    el.textContent = p.links[j].label + ' →';
    el.href = p.links[j].href;
  });

  slot.append(btn, label, card);
  tray.appendChild(slot);
  slots.push(slot);

  // hover on mouse, tap/click toggles on touch, focus for keyboard
  slot.addEventListener('mouseenter', () => open(slot));
  slot.addEventListener('mouseleave', () => close(slot));
  btn.addEventListener('focus', () => open(slot));
  btn.addEventListener('click', e => {
    e.stopPropagation();
    slot.classList.contains('open') && e.pointerType !== 'mouse' ? close(slot) : open(slot);
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.cookie-slot')) slots.forEach(close);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') slots.forEach(close);
});
