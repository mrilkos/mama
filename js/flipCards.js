// ═══════════════════════════════════════════
//  FLIP CARDS — 3D flip with spring feel
// ═══════════════════════════════════════════

export function buildFlipCards(qualitiesData) {
  const grid = document.getElementById('qualities-grid');
  if (!grid) return;

  grid.innerHTML = '';

  qualitiesData.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'flip-card reveal';
    card.style.transitionDelay = (i * 0.1) + 's';

    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front">
          <div class="flip-icon">${q.icon}</div>
          <p class="flip-label">${q.label}</p>
          <p class="flip-hint">tap to reveal</p>
        </div>
        <div class="flip-back">
          <p class="flip-back-text">${q.back}</p>
        </div>
      </div>
    `;

    let flipped = false;

    card.addEventListener('click', () => {
      flipped = !flipped;
      card.classList.toggle('flipped', flipped);

      // Haptic-style bounce after flip
      const inner = card.querySelector('.flip-inner');
      inner.style.transition = 'transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1)';
    });

    // Touch-friendly: no hover needed
    card.addEventListener('mouseenter', () => {
      if (!flipped) {
        const front = card.querySelector('.flip-front');
        front.style.transform = 'scale(1.02)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (!flipped) {
        const front = card.querySelector('.flip-front');
        front.style.transform = '';
      }
    });

    grid.appendChild(card);
  });

  observeReveal('#qualities-grid .flip-card');
}

function observeReveal(selector) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}
