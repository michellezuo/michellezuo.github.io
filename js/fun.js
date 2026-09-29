// ─── baking board: add a new pin by adding a line here ─────────────────
// src: photo in assets/baking/ (resize to ~900px wide before adding)
// w, h: the photo's pixel size, so the board doesn't jump around while loading
const PINS = [
  { src: 'assets/baking/thumbprints-window.jpg',     w: 900, h: 1200, title: 'Apricot thumbprints', note: 'half of them drizzled with dark chocolate' },
  { src: 'assets/baking/berry-tart.jpg',             w: 900, h: 900,  title: 'Strawberry & blueberry tart', note: 'fresh berries over custard' },
  { src: 'assets/baking/banana-bread.jpg',           w: 900, h: 675,  title: 'Banana bread', note: 'the classic' },
  { src: 'assets/baking/thumbprints-flowers.jpg',    w: 900, h: 1200, title: 'Thumbprints, round two', note: 'with fall out the window' },
  { src: 'assets/baking/banana-bread-choc-chip.jpg', w: 900, h: 910,  title: 'Chocolate chip banana bread', note: 'always make two' },
];
// ───────────────────────────────────────────────────────────────────────

const board = document.getElementById('board');
const viewer = document.getElementById('pin-view');
const viewImg = viewer.querySelector('img');
const viewCap = viewer.querySelector('figcaption');
const pins = [];

PINS.forEach(p => {
  const pin = document.createElement('button');
  pin.className = 'pin';
  pin.type = 'button';
  pin.setAttribute('aria-label', `${p.title}: view larger`);

  const img = document.createElement('img');
  img.src = p.src;
  img.alt = p.title;
  img.width = p.w;
  img.height = p.h;
  img.loading = 'lazy';

  const cap = document.createElement('span');
  cap.className = 'pin-cap';
  const t = document.createElement('strong');
  t.textContent = p.title;
  const n = document.createElement('span');
  n.textContent = p.note;
  cap.append(t, n);

  pin.append(img, cap);
  pin.addEventListener('click', () => {
    viewImg.src = p.src;
    viewImg.alt = p.title;
    viewCap.textContent = `${p.title} — ${p.note}`;
    viewer.showModal();
  });
  pins.push({ el: pin, ratio: p.h / p.w });
});

// pinterest-style layout: drop each pin into whichever column is currently shortest
function layout() {
  const count = board.clientWidth >= 820 ? 3 : 2;
  if (board.dataset.cols === String(count)) return;
  board.dataset.cols = count;
  const cols = Array.from({ length: count }, () => {
    const c = document.createElement('div');
    c.className = 'board-col';
    return c;
  });
  const heights = new Array(count).fill(0);
  pins.forEach(({ el, ratio }) => {
    const i = heights.indexOf(Math.min(...heights));
    cols[i].appendChild(el);
    heights[i] += ratio;
  });
  board.replaceChildren(...cols);
}
layout();
window.addEventListener('resize', layout);

viewer.querySelector('.recipe-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
