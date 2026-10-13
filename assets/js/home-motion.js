/* The contour is decorative; the homepage works with its static CSS fallback. */
(() => {
  'use strict';
  const canvas = document.querySelector('#contour');
  const toggle = document.querySelector('.motion-toggle');
  if (!canvas || !toggle) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Manual pause is independent of the system preference and viewport state.
  let userPaused = false;
  let inView = false;
  let frame = 0;
  let previousTime = 0;
  let phase = 0.5;
  let width = 0;
  let height = 0;
  let pointer = 0;
  let targetPointer = 0;

  function isInViewport() {
    const bounds = canvas.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight &&
      bounds.right > 0 && bounds.left < window.innerWidth;
  }

  function canAnimate() {
    return !userPaused && !preference.matches && inView && !document.hidden && width > 0 && height > 0;
  }

  function draw() {
    if (width <= 0 || height <= 0) return;
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
    if (!canAnimate()) return;
    if (time - previousTime >= 32) {
      phase += Math.min(time - previousTime, 70) * 0.00035;
      previousTime = time;
      pointer += (targetPointer - pointer) * 0.045;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function syncMotion() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = performance.now();
    toggle.hidden = preference.matches || width <= 0 || height <= 0;
    toggle.setAttribute('aria-label', userPaused ? 'Play contour motion' : 'Pause contour motion');
    toggle.innerHTML = userPaused
      ? 'Play motion <span aria-hidden="true">▷</span>'
      : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    inView = isInViewport();
    // Draw once even when reduced motion, manual pause, or visibility prevents a loop.
    draw();
    if (width > 0 && height > 0) canvas.parentElement.classList.add('motion-ready');
    syncMotion();
  }

  toggle.addEventListener('click', () => {
    if (preference.matches) return;
    userPaused = !userPaused;
    syncMotion();
  });
  const onPreferenceChange = () => {
    targetPointer = pointer;
    draw();
    syncMotion();
  };
  if (preference.addEventListener) preference.addEventListener('change', onPreferenceChange);
  else preference.addListener(onPreferenceChange);
  canvas.addEventListener('pointermove', event => {
    if (!canAnimate()) return;
    const bounds = canvas.getBoundingClientRect();
    targetPointer = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  });
  canvas.addEventListener('pointerleave', () => { targetPointer = 0; });
  document.addEventListener('visibilitychange', syncMotion);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncMotion();
    }).observe(canvas);
  } else {
    window.addEventListener('scroll', () => {
      const visible = isInViewport();
      if (inView !== visible) { inView = visible; syncMotion(); }
    }, { passive: true });
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize', resize, { passive: true });
  resize();
})();
