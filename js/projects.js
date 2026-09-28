// ─── edit your projects here ───────────────────────────────────────────
// img:      cookie image (transparent PNG works best)
// blurb:    short text for the hover card
// sections: the full "recipe card" that opens on click.
//           each section has a heading plus `text` (paragraph) or `steps` (numbered list)
// links:    any number of { label, href }
const PROJECTS = [
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'Find|A|Qure',
    title: 'Find|A|Qure',
    meta: 'Mar 2026 · HackTJ 2026 · with Holly Huang',
    blurb: 'Ranks where an antibody is most likely to dock on an antigen, starting from just two FASTA sequences, using Grover’s quantum search.',
    tags: ['Python', 'NumPy', 'Flask', 'FastAPI', 'Grover’s algorithm', 'RCSB PDB API', 'HTML/CSS/JS'],
    sections: [
      {
        heading: 'The problem',
        text: 'Finding and testing antibodies costs an estimated $19.1 billion a year, and most of that is slow, expensive lab trial-and-error. After several people in our families caught COVID-19, we wanted to understand how antibodies are discovered in the first place — and whether the search could be made faster.',
      },
      {
        heading: 'How it works',
        steps: [
          'Paste antigen and antibody sequences in FASTA format.',
          'The Flask front end cleans the sequences and sends them to a FastAPI backend.',
          'The backend searches the RCSB Protein Data Bank by sequence to find the best-matching 3D structure.',
          'Structural features are extracted and every candidate docking site is scored.',
          'Grover’s algorithm amplifies the strongest sites, and the app returns a ranked list of likely binding sites.',
        ],
      },
      {
        heading: 'Why quantum',
        text: 'Docking is a search over a huge space of configurations, which is exactly what Grover’s algorithm is built for: it finds a marked answer in about √N steps instead of N, a quadratic speedup over classical search. We simulated the algorithm (oracle + diffusion operator) in NumPy with a nested search: an outer Grover pass ranks candidate antibodies, and an inner pass ranks docking sites for the top candidates.',
      },
      {
        heading: 'Result',
        text: 'We validated the full pipeline end to end on a real HIV-1 antigen/antibody pair from the Protein Data Bank (PDB 1A43 and 1IL1).',
      },
    ],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/michellezuo/FindAQure' }],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'ADYN × DIIG',
    title: 'Data & dashboarding for ADYN',
    meta: 'Sep – Dec 2026 · Duke Impact Investment Group · 5-person team · in progress',
    blurb: 'Turning a YC-backed women’s health startup’s data into answers its team can explore on their own: EDA, a metrics layer, a dashboard, and ML where it helps.',
    tags: ['Python', 'pandas', 'SQL', 'Plotly', 'EDA', 'Machine learning', 'Dashboards'],
    sections: [
      {
        heading: 'The client',
        text: 'ADYN (YC 2025) personalizes birth control using hormone and genetic testing. As a data analyst in DIIG, I’m on a five-person team helping them get more out of the data they collect.',
      },
      {
        heading: 'What we’re delivering',
        steps: [
          'A prioritized set of research questions — the business and scientific questions most worth answering.',
          'A dashboard demo that answers them, and lets ADYN’s team build and save their own views.',
          'A recommendation for the technical structure they should use to keep visualizing trends.',
        ],
      },
      {
        heading: 'How we’re doing it',
        steps: [
          'Question discovery: pairing client conversations with exploratory data analysis, then narrowing a longlist of questions to a must-answer top five.',
          'Data profiling & EDA: checking completeness, consistency and coverage, and documenting every cleaning and missing-data decision.',
          'Pipeline: extracting a snapshot and building cleaned analytical tables, so the dashboard never depends on a live production system.',
          'Metrics layer: every metric defined once in a shared registry, so charts can’t quietly drift apart.',
          'Charts & dashboard: a standardized Plotly chart library, curated pages for the priority questions, and an Explore tab for self-serve analysis.',
          'Modeling: predictive and machine-learning models where a priority question calls for one.',
        ],
      },
      {
        heading: 'Run like a real engagement',
        text: 'Phase gates, weekly standups, biweekly client check-ins, and one branch per work track. Data handling is strict: no credentials in code and no client data on personal machines. (That’s also why this page stays high-level.)',
      },
    ],
    links: [{ label: 'ADYN’s science', href: 'https://adyn.com/science/' }],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'This website',
    title: 'This kitchen',
    meta: 'Sep 2026 · personal site',
    blurb: 'My portfolio as a cozy illustrated kitchen: an SVG scene drawn in code, plain HTML/CSS/JS, hosted on GitHub Pages.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SVG', 'Python', 'GitHub Pages'],
    sections: [
      {
        heading: 'The idea',
        text: 'Baking is my favorite hobby, so the site is a kitchen: the oven holds my projects, the recipe book is about me, and the dessert counter is everything else.',
      },
      {
        heading: 'How it’s built',
        steps: [
          'The kitchen is a single SVG illustration drawn in code, with CSS animation for the oven glow, the autumn leaves outside the window, and the cat’s tail. (Try the sink tap.)',
          'No frameworks: plain HTML, CSS and JavaScript. Projects live in one small data file, and this tray renders itself from it.',
          'Keyboard-friendly and responsive: every clickable thing is focusable, popups keep themselves on screen, and animation turns off for people who prefer reduced motion.',
          'The watercolor cookie was cut out of a stock illustration with a short Python script (NumPy, SciPy, Pillow) using flood-fill background removal and a soft elliptical mask.',
          'Hosted on GitHub Pages with versioned asset links, so visitors always get the latest styles.',
        ],
      },
    ],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/michellezuo/michellezuo.github.io' }],
  },
];
// ───────────────────────────────────────────────────────────────────────

// same cookie art on every spot, so mirror/tilt each one to keep the tray from looking copy-pasted
const TURNS = [[0, 1], [4, -1], [-5, 1]];

const tray = document.getElementById('cookies');
const dialog = document.getElementById('recipe');
const slots = [];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function tagList(tags) {
  const wrap = el('div', 'chips');
  tags.forEach(t => wrap.appendChild(el('span', null, t)));
  return wrap;
}

function linkList(links) {
  const wrap = el('div', 'links');
  links.forEach(l => {
    const a = el('a', null, l.label + ' →');
    a.href = l.href;
    a.target = '_blank';
    a.rel = 'noopener';
    wrap.appendChild(a);
  });
  return wrap;
}

// ── hover card ──
function close(slot) {
  slot.classList.remove('open');
  slot.querySelector('.cookie').classList.remove('open');
}

function open(slot) {
  slots.forEach(s => s !== slot && close(s));
  slot.classList.add('open');
  slot.querySelector('.cookie').classList.add('open');

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

// ── full recipe card ──
function openRecipe(p) {
  const body = dialog.querySelector('.recipe-body');
  body.replaceChildren();
  body.append(el('p', 'recipe-kicker', 'Recipe card'), el('h2', 'recipe-title', p.title), el('p', 'recipe-meta', p.meta));
  p.sections.forEach(s => {
    body.appendChild(el('h3', null, s.heading));
    if (s.text) body.appendChild(el('p', null, s.text));
    if (s.steps) {
      const ol = el('ol');
      s.steps.forEach(step => ol.appendChild(el('li', null, step)));
      body.appendChild(ol);
    }
  });
  body.appendChild(el('h3', null, 'Ingredients'));
  body.appendChild(tagList(p.tags));
  if (p.links.length) body.appendChild(linkList(p.links));

  slots.forEach(close);
  dialog.showModal();
  dialog.scrollTop = 0;
}

dialog.querySelector('.recipe-close').addEventListener('click', () => dialog.close());
// click on the dimmed backdrop closes it
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

PROJECTS.forEach((p, i) => {
  const slot = el('div', 'cookie-slot');

  const btn = el('button', 'cookie');
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-label', `${p.title}: open the full recipe card`);
  const img = el('img');
  img.src = p.img;
  img.alt = '';
  const [rot, flip] = TURNS[i % TURNS.length];
  img.style.transform = `rotate(${rot}deg) scaleX(${flip})`;
  btn.appendChild(img);

  const card = el('div', 'card');
  card.setAttribute('aria-hidden', 'true');
  card.append(el('h3', null, p.title), el('p', 'card-meta', p.meta), el('p', null, p.blurb), tagList(p.tags.slice(0, 4)), el('p', 'card-hint', 'click the cookie for the full recipe →'));

  slot.append(btn, el('div', 'cookie-name', p.name), card);
  tray.appendChild(slot);
  slots.push(slot);

  // hover or keyboard focus shows the card; click/tap/Enter opens the full recipe
  slot.addEventListener('mouseenter', () => open(slot));
  slot.addEventListener('mouseleave', () => close(slot));
  btn.addEventListener('focus', () => open(slot));
  btn.addEventListener('blur', () => close(slot));
  btn.addEventListener('click', () => openRecipe(p));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') slots.forEach(close);
});
