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
    meta: 'Mar 2026 · HackTJ 2026 · With Holly Huang',
    blurb: 'Ranks where an antibody is most likely to dock on an antigen, from just two FASTA sequences, using Grover’s quantum search.',
    tags: ['Python', 'Flask', 'FastAPI', 'NumPy', 'Grover’s algorithm', 'RCSB PDB API'],
    sections: [
      {
        heading: 'The Problem',
        text: 'Antibody discovery is slow, expensive lab trial and error. We wanted to speed up the search.',
      },
      {
        heading: 'What I Built',
        steps: [
          'Full-stack app: paste two FASTA sequences, get a ranked list of docking sites.',
          'Matches each sequence to a 3D structure in the Protein Data Bank.',
          'Grover’s search ranks the sites: about √N steps instead of N.',
          'Validated end to end on a real HIV-1 antigen/antibody pair.',
        ],
      },
    ],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/michellezuo/FindAQure' }],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'Purchase Predictor',
    title: 'Online Shoppers Purchase Prediction',
    meta: 'Oct 2026 · Duke · 4-Person Team',
    blurb: 'A Random Forest that predicts which online shopping sessions end in a purchase: 0.92 ROC-AUC and 90.5% accuracy.',
    tags: ['Python', 'scikit-learn', 'pandas', 'Random Forest'],
    sections: [
      {
        heading: 'What We Built',
        steps: [
          'Random Forest on 12,205 sessions: 0.92 ROC-AUC, 90.5% accuracy.',
          'Beat the 84% majority-class baseline by 6.5 points.',
          'No data leakage: the 64-feature pipeline is fit on training data only.',
          'Evaluated with ROC curves and confusion matrices.',
        ],
      },
    ],
    links: [],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'ADYN × DIIG',
    title: 'Data & Dashboarding for ADYN',
    meta: 'Sep 2026 – Present · Duke Impact Investment Group · 5-Person Team',
    blurb: 'Turning a YC-backed women’s health startup’s data into answers its team can explore on their own.',
    tags: ['Python', 'pandas', 'SQL', 'Plotly', 'EDA', 'Dashboards'],
    sections: [
      {
        heading: 'The Client',
        text: 'ADYN (YC 2025) personalizes birth control using hormone and genetic testing.',
      },
      {
        heading: 'What I’m Doing',
        steps: [
          'Turned 9 research questions into a roadmap for ADYN.',
          'Cleaning and exploring 7 datasets (orders, hormone, genotype).',
          'Building a self-serve dashboard demo with a shared metrics dictionary.',
        ],
      },
    ],
    links: [{ label: 'ADYN’s Science', href: 'https://adyn.com/science/' }],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'Swing-State Model',
    title: 'Modeling Wisconsin Elections',
    meta: 'Jun 2025 – Apr 2026 · Institute for Mathematics and Democracy · Research',
    blurb: 'Möbius inversion and machine learning on Wisconsin election data to explain swing-state behavior. Preprint on arXiv.',
    tags: ['Python', 'Machine learning', 'Möbius inversion', 'Statistics'],
    sections: [
      {
        heading: 'What I Did',
        steps: [
          'Modeled Wisconsin election data with Möbius inversion and machine learning.',
          'Wrote the paper: on arXiv, under review at the Rose-Hulman Undergraduate Math Journal.',
          'Selected nationally; presented to all program teams, then kept going with the professor.',
        ],
      },
    ],
    links: [{ label: 'Preprint on arXiv', href: 'https://arxiv.org/abs/2510.26867' }],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'ADAPT-VQE',
    title: 'Improving ADAPT-VQE',
    meta: 'Sep 2025 – Jun 2026 · Virginia Tech Quantum Lab Partnership · Research',
    blurb: 'Making a quantum algorithm for molecular simulation better by leveraging entanglement.',
    tags: ['Python', 'Quantum computing', 'VQE'],
    sections: [
      {
        heading: 'What I Did',
        steps: [
          'Worked on improving ADAPT-VQE, a quantum algorithm for simulating molecules.',
          'Used entanglement to guide the algorithm, in Python.',
          'Iterated on the design with a faculty mentor and 2 other researchers every two weeks.',
        ],
      },
    ],
    links: [],
  },
  {
    img: 'assets/cookies/cookie-a.png',
    name: 'This Website',
    title: 'This Kitchen',
    meta: 'Sep 2026 · Personal Site',
    blurb: 'My portfolio as a cozy kitchen full of stickers I drew, in plain HTML/CSS/JS on GitHub Pages.',
    tags: ['HTML', 'CSS', 'JavaScript', 'SVG', 'Python', 'GitHub Pages'],
    sections: [
      {
        heading: 'The Idea',
        text: 'Baking is my favorite hobby, so the site is a kitchen: the oven holds my projects, the recipe book is about me, and the dessert counter is everything else.',
      },
      {
        heading: 'How It’s Built',
        steps: [
          'Hand-drawn stickers, cut out with a short Python script (NumPy, SciPy, Pillow).',
          'Animated in CSS: oven glow, falling leaves, the cat’s tail. (Try the sink tap.)',
          'No frameworks. This tray renders itself from one small data file.',
          'Keyboard-friendly, responsive, and respects reduced motion.',
        ],
      },
    ],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/michellezuo/michellezuo.github.io' }],
  },
];// ───────────────────────────────────────────────────────────────────────

// same cookie art on every spot, so mirror/tilt each one to keep the tray from looking copy-pasted
const TURNS = [[0, 1], [4, -1], [-5, 1], [6, -1], [-3, 1], [2, -1]];

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
function closeCard(slot) {
  slot.classList.remove('open');
  slot.querySelector('.cookie').classList.remove('open');
}

function openCard(slot) {
  slots.forEach(s => s !== slot && closeCard(s));
  const card = slot.querySelector('.card');

  // pop the card out beside the cookie, on whichever side has room,
  // so it never slides under whatever comes after the tray
  const r = slot.getBoundingClientRect();
  const need = card.offsetWidth + 24;
  const right = window.innerWidth - r.right;
  const left = r.left;
  card.classList.remove('side-left', 'side-right');
  card.style.setProperty('--nudge', '0px');
  if (Math.max(left, right) >= need) {
    card.classList.add(right >= left ? 'side-right' : 'side-left');
  } else {
    // no room beside it (narrow screen): fall back to below, kept on screen
    const c = card.getBoundingClientRect();
    const pad = 16;
    let nudge = 0;
    if (c.left < pad) nudge = pad - c.left;
    else if (c.right > window.innerWidth - pad) nudge = window.innerWidth - pad - c.right;
    card.style.setProperty('--nudge', nudge + 'px');
  }

  slot.classList.add('open');
  slot.querySelector('.cookie').classList.add('open');
}

// ── full recipe card ──
function openRecipe(p) {
  const body = dialog.querySelector('.recipe-body');
  body.replaceChildren();
  body.append(el('p', 'recipe-kicker', 'Recipe Card'), el('h2', 'recipe-title', p.title), el('p', 'recipe-meta', p.meta));
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

  slots.forEach(closeCard);
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
  card.append(el('h3', null, p.title), el('p', 'card-meta', p.meta), el('p', null, p.blurb), tagList(p.tags.slice(0, 4)), el('p', 'card-hint', 'Click the Cookie for the Full Recipe →'));

  slot.append(btn, el('div', 'cookie-name', p.name), card);
  tray.appendChild(slot);
  slots.push(slot);

  // hover or keyboard focus shows the card; click/tap/Enter opens the full recipe
  slot.addEventListener('mouseenter', () => openCard(slot));
  slot.addEventListener('mouseleave', () => closeCard(slot));
  btn.addEventListener('focus', () => openCard(slot));
  btn.addEventListener('blur', () => closeCard(slot));
  btn.addEventListener('click', () => openRecipe(p));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') slots.forEach(closeCard);
});

// the oven mitt slides the tray in when the projects section scrolls into view
const stage = document.querySelector('.tray-stage');
if (stage && 'IntersectionObserver' in window) {
  stage.classList.add('pending');
  const serve = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    stage.classList.replace('pending', 'serve');
    serve.disconnect();
  }, { threshold: 0.35 });
  serve.observe(stage);
}
