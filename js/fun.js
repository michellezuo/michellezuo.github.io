// ─── boards: add a new pin by adding a line to the right list ──────────
// src: photo in assets/ (resize to ~900px wide before adding)
// w, h: the photo's pixel size, so the board doesn't jump around while loading
// each list fills the <div class="board" data-board="..."> with the same name in fun.html
const BOARDS = {
  baking: [
    { src: 'assets/baking/thumbprints-window.jpg',     w: 900, h: 1200, title: 'Apricot Thumbprints', note: 'Half of them drizzled with dark chocolate' },
    { src: 'assets/baking/berry-tart.jpg',             w: 900, h: 900,  title: 'Strawberry & Blueberry Tart', note: 'Fresh berries over custard' },
    { src: 'assets/baking/banana-bread.jpg',           w: 900, h: 675,  title: 'Banana Bread', note: 'The classic' },
    { src: 'assets/baking/dad-birthday-tart.jpg',      w: 900, h: 1200, title: 'Fruit Tart for My Dad’s Birthday', note: 'Strawberries, blackberries & peaches' },
    { src: 'assets/baking/thumbprints-flowers.jpg',    w: 900, h: 1200, title: 'Thumbprints, Round Two', note: 'With fall out the window' },
    { src: 'assets/baking/banana-bread-choc-chip.jpg', w: 900, h: 910,  title: 'Chocolate Chip Banana Bread', note: 'Always make two' },
  ],
  friends: [
    { src: 'assets/friends/duke-football.jpg',     w: 900, h: 1200, title: 'Duke Football Game', note: 'First game in blue' },
    { src: 'assets/friends/class-council-prom.jpg', w: 900, h: 600,  title: 'Class Council at Prom', note: 'The people who made it happen' },
    { src: 'assets/friends/graduation.jpg',        w: 900, h: 1200, title: 'Graduation', note: 'TJ class of 2026' },
    { src: 'assets/friends/decision-day.jpg',      w: 900, h: 1200, title: 'Decision Day', note: 'Duke-bound, in DC' },
  ],
};
// ───────────────────────────────────────────────────────────────────────

const viewer = document.getElementById('pin-view');
const viewImg = viewer.querySelector('img');
const viewCap = viewer.querySelector('figcaption');

function makePin(p) {
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
  return { el: pin, ratio: p.h / p.w };
}

// pinterest-style layout: drop each pin into whichever column is currently shortest
function layout(board, pins) {
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
    // shortest column; on a tie, prefer the one nearest the middle so stragglers sit centered
    const min = Math.min(...heights);
    const mid = (count - 1) / 2;
    const i = heights
      .map((h, idx) => idx)
      .filter(idx => heights[idx] - min < 0.01)
      .sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))[0];
    cols[i].appendChild(el);
    heights[i] += ratio;
  });
  board.replaceChildren(...cols);
}

// photos fade + slide up as they scroll into view
const reveal = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' })
  : null;

document.querySelectorAll('.board[data-board]').forEach(board => {
  const pins = (BOARDS[board.dataset.board] || []).map(makePin);
  layout(board, pins);
  window.addEventListener('resize', () => layout(board, pins));
  pins.forEach(({ el }, i) => {
    el.style.setProperty('--d', `${(i % 3) * 90}ms`);  // small stagger across a row (reveal only, not hover)
    if (reveal) reveal.observe(el); else el.classList.add('in');
  });
});

viewer.querySelector('.recipe-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
