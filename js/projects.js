// ─── edit your projects here ───────────────────────────────────────────
// img: path to your cookie drawing (e.g. 'assets/cookies/chocchip.png').
//      leave it '' and the spot on the tray stays blank.
// links: any number of { label, href }
const PROJECTS = [
  { img: '', name: 'project one',   title: 'Project title', blurb: 'One or two sentences about what it does and why you built it.', tags: ['python', 'tbd'], links: [] },
  { img: '', name: 'project two',   title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { img: '', name: 'project three', title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { img: '', name: 'project four',  title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { img: '', name: 'project five',  title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
  { img: '', name: 'project six',   title: 'Project title', blurb: 'Still in the oven — details coming soon.', tags: ['tbd'], links: [] },
];
// ───────────────────────────────────────────────────────────────────────

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
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `card-${i}`);
  btn.setAttribute('aria-label', `${p.name}: ${p.title}`);
  if (p.img) {
    const img = document.createElement('img');
    img.src = p.img;
    img.alt = '';
    btn.appendChild(img);
  } else {
    const blank = document.createElement('span');
    blank.className = 'blank';
    btn.appendChild(blank);
  }

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
