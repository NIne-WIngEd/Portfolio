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

  const canvas = document.querySelector('#contour');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const toggle = document.querySelector('.motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  let inView = true;
  let frame = 0;
  let previousTime = 0;
  let phase = 0.5;
  let width = 0;
  let height = 0;
  let pointer = 0;
  let targetPointer = 0;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width * 0.39, height * 0.38);
    const rotation = 0.55 + Math.sin(phase * 0.22) * 0.24 + pointer * 0.1;
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    const tilt = -0.45;
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    for (let ring = 0; ring < 46; ring++) {
      const v = (ring / 45) * Math.PI;
      ctx.beginPath();
      for (let point = 0; point <= 120; point++) {
        const u = (point / 120) * Math.PI * 2;
        const radius = Math.sin(v) * (1 + 0.20 * Math.cos(u * 3 + v * 2 + phase * 0.16));
        const x = radius * Math.cos(u);
        const y = Math.cos(v) * 1.25;
        const z = radius * Math.sin(u);
        const rx = x * cr + z * sr;
        const rz = -x * sr + z * cr;
        const ry = y * ct - rz * st;
        const depth = y * st + rz * ct;
        const perspective = 1 / (1 - depth * 0.13);
        const px = width * 0.5 + rx * scale * perspective;
        const py = height * 0.5 + ry * scale * perspective;
        if (!point) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(36,87,231,${0.33 + Math.sin(v) * 0.47})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
  }

  function tick(time) {
    frame = 0;
    if (paused || !inView || document.hidden) return;
    if (time - previousTime >= 32) {
      phase += Math.min(time - previousTime, 70) * 0.00035;
      previousTime = time;
      pointer += (targetPointer - pointer) * 0.045;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = performance.now();
    if (!paused && inView && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function updateControl() {
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    toggle.innerHTML = paused ? 'Play motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
  }

  toggle.addEventListener('click', () => { paused = !paused; updateControl(); schedule(); });
  preference.addEventListener('change', event => { paused = event.matches; updateControl(); draw(); schedule(); });
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    targetPointer = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  });
  canvas.addEventListener('pointerleave', () => { targetPointer = 0; });
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  resize(); updateControl();
  canvas.parentElement.classList.add('motion-ready');
  toggle.hidden = false;
  schedule();
})();
