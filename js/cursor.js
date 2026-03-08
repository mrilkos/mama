// ═══════════════════════════════════════════
//  CURSOR — Magnetic custom cursor
// ═══════════════════════════════════════════

export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  // Track mouse
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow — only one rAF loop, skip tiny movements
  let prevRingX = 0, prevRingY = 0;
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    // Only update DOM if moved more than 0.3px — avoids unnecessary repaints
    if (Math.abs(ringX - prevRingX) > 0.3 || Math.abs(ringY - prevRingY) > 0.3) {
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      prevRingX = ringX;
      prevRingY = ringY;
    }
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states on interactive elements
  const hoverTargets = 'a, button, .gallery-item, .flip-card, .timeline-item, .lang-btn, .surprise-btn, .hero-cta, .modal-nav-btn, .speed-btn, .hero-crown';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click pulse
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '';
    ring.style.opacity = '';
  });

  return () => cancelAnimationFrame(rafId);
}
