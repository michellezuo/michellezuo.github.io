// light switch in the top-right corner: flips every page between day and night mode.
// the saved choice is applied before paint by the one-line script in each page's <head>.
(function () {
  const root = document.documentElement;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'light-switch';
  btn.innerHTML = '<span class="plate" aria-hidden="true"><span class="nub"></span></span><span class="ls-label"></span>';
  const label = btn.querySelector('.ls-label');

  function render() {
    const dark = root.dataset.theme === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Turn the kitchen lights on' : 'Turn the kitchen lights off');
    label.textContent = dark ? 'Lights Off' : 'Lights On';
  }

  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* private mode: just don't remember */ }
    render();
  });

  render();
  document.body.appendChild(btn);
})();
