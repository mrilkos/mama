// ═══════════════════════════════════════════
//  COUNTERS — Animated number counters
//  that trigger on scroll entry
// ═══════════════════════════════════════════

export function buildCounters(counterData) {
  const grid = document.getElementById('counters-grid');
  if (!grid) return;

  grid.innerHTML = '';

  counterData.forEach(c => {
    const cell = document.createElement('div');
    cell.className = 'counter-cell reveal';

    const numEl   = document.createElement('span');
    numEl.className = 'counter-num';
    numEl.textContent = c.val;
    numEl.dataset.val = c.val;

    const labelEl = document.createElement('span');
    labelEl.className = 'counter-label';
    labelEl.textContent = c.label;

    cell.appendChild(numEl);
    cell.appendChild(labelEl);
    grid.appendChild(cell);
  });

  // Observe and animate
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        animateCounter(e.target.querySelector('.counter-num'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  grid.querySelectorAll('.counter-cell').forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const raw = el.dataset.val;
  if (!el || !raw) return;

  // If it's a pure number (with optional + suffix), animate it
  const match = raw.match(/^(\d+)(\+?)$/);
  if (!match) return; // ∞, ١, etc. — just display as-is

  const target  = parseInt(match[1]);
  const suffix  = match[2] || '';
  const duration = 1800;
  const startTime = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current  = Math.round(easeOut(progress) * target);

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  }

  el.textContent = '0' + suffix;
  requestAnimationFrame(tick);
}
