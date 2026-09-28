// ─── edit your projects here ───────────────────────────────────────────
// img: path to the cookie image (transparent PNG works best).
//      leave it '' and the spot on the tray stays blank.
// links: any number of { label, href }
const PROJECTS = [
  {
    img: 'assets/cookies/cookie-a.png', name: 'Find|A|Qure',
    title: 'Find|A|Qure · Mar 2026',
    blurb: 'A full-stack app that ranks antibody–antigen docking sites from FASTA input, using Grover’s quantum search for a quadratic speedup over classical docking search. Validated end-to-end on an HIV-1 antigen/antibody pair from RCSB PDB. Built with Holly Huang.',
    tags: ['Python', 'Flask', 'Grover’s algorithm', 'HTML'],
    links: [{ label: 'GitHub', href: 'https://github.com/michellezuo/FindAQure' }],
  },
  {
    img: 'assets/cookies/cookie-a.png', name: 'ADYN dashboard',
    title: 'ADYN (YC25) data dashboard · in progress',
    blurb: 'With DIIG, a 5-person team analyzing ADYN’s customer, order, hormone and genotype data. We prioritized 9 research questions into a roadmap and are building a customizable dashboard demo so ADYN’s team can explore it themselves.',
    tags: ['Data analysis', 'EDA', 'Dashboards'],
    links: [],
  },
  {
    img: 'assets/cookies/cookie-a.png', name: 'Swing states',
    title: 'Analyzing Swing States: The Case of Wisconsin',
    blurb: 'Modeled Wisconsin election data with Möbius inversion and machine learning to study swing-state behavior. Preprinted on arXiv and under review at the Rose-Hulman Undergraduate Math Journal.',
    tags: ['Python', 'Machine learning', 'Combinatorics'],
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2510.26867' }],
  },
  {
    img: 'assets/cookies/cookie-a.png', name: 'Disaster loss',
    title: 'Disaster loss × social vulnerability',
    blurb: 'NSF-funded research at George Mason (ASSIP): correlated economic loss with social vulnerability across NOAA’s top 10 billion-dollar hazards to guide disaster aid, processing terabyte-scale geospatial data. Co-authoring a paper under review.',
    tags: ['Python', 'GeoDa', 'Spatial statistics'],
    links: [],
  },
  {
    img: 'assets/cookies/cookie-a.png', name: 'ADAPT-VQE',
    title: 'Improving ADAPT-VQE',
    blurb: 'Research with the Virginia Tech quantum lab on ADAPT-VQE, a quantum algorithm for molecular simulation, using entanglement to improve it.',
    tags: ['Python', 'Quantum computing'],
    links: [],
  },
  {
    img: 'assets/cookies/cookie-a.png', name: 'This website',
    title: 'This kitchen',
    blurb: 'The site you’re on: a hand-built, baking-themed portfolio with an illustrated kitchen. Hosted on GitHub Pages. Currently a work in progress.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SVG'],
    links: [{ label: 'GitHub', href: 'https://github.com/michellezuo/michellezuo.github.io' }],
  },
];
// ───────────────────────────────────────────────────────────────────────

const TURNS = [[0, 1], [4, -1], [-6, 1], [8, -1], [3, 1], [-4, -1]];

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
    // same cookie art on every spot, so turn/mirror each one to keep the tray from looking copy-pasted
    const [rot, flip] = TURNS[i % TURNS.length];
    img.style.transform = `rotate(${rot}deg) scaleX(${flip})`;
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
