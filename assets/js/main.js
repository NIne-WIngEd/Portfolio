/* Progressive enhancement: all content and links work without JavaScript. */
(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (menu && nav) {
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
    document.querySelector('.site-header').classList.add('menu-ready');
  }

  const filters = document.querySelectorAll('[data-filter]');
  const cases = document.querySelectorAll('.case');
  const count = document.querySelector('.filter-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    cases.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }));
  if (filters.length && count) document.querySelector('.filter-bar').classList.add('filters-ready');

  // A local, explanatory sketch; no simulation data or continuous timer.
  document.querySelectorAll('[data-reservoir]').forEach(sketch => {
    const controls = sketch.querySelector('.reservoir-controls');
    const buttons = controls.querySelectorAll('[data-mode]');
    const result = sketch.querySelector('.sketch-result');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Compare reservoir control');
    buttons.forEach(button => button.addEventListener('click', () => {
      const automatic = button.dataset.mode === 'automatic';
      sketch.dataset.mode = button.dataset.mode;
      buttons.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
      result.textContent = automatic
        ? 'Automatic control: the water-level signal stops the motor at the threshold.'
        : 'Manual control: if nobody stops the motor in time, the water keeps rising and the tank overflows.';
    }));
    controls.hidden = false;
  });

  const mosaic = document.querySelector('.personal-mosaic');
  const toggle = document.querySelector('.notebook-motion');
  if (!mosaic || !toggle) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  let inView = true;
  function syncMotion() {
    mosaic.dataset.paused = String(paused || !inView || document.hidden);
    toggle.hidden = preference.matches;
    toggle.setAttribute('aria-label', paused ? 'Play mosaic motion' : 'Pause mosaic motion');
    toggle.innerHTML = paused ? 'Play motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
  }
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  preference.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncMotion(); }).observe(mosaic);
  }
  mosaic.classList.add('mosaic-ready');
  toggle.hidden = false;
  syncMotion();

})();
