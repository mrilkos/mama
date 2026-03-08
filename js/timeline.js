// ═══════════════════════════════════════════
//  TIMELINE — Interactive expandable timeline
// ═══════════════════════════════════════════

export function buildTimeline(timelineData) {
  const track = document.getElementById('timeline-track');
  if (!track) return;

  track.innerHTML = '';

  timelineData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'timeline-item reveal';
    el.style.transitionDelay = (i * 0.12) + 's';

    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-content">
        <div class="timeline-emoji">${item.emoji}</div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-text">${item.text}</p>
        <div class="timeline-expand">
          <div class="timeline-expand-inner">${item.expand}</div>
        </div>
        <button class="timeline-toggle" aria-label="Expand">
          <span class="toggle-icon">＋</span>
        </button>
      </div>
    `;

    const content = el.querySelector('.timeline-content');
    const toggle  = el.querySelector('.timeline-toggle');
    const icon    = el.querySelector('.toggle-icon');

    // Click anywhere on content to expand
    content.addEventListener('click', () => {
      const wasActive = el.classList.contains('active');

      // Close all others
      track.querySelectorAll('.timeline-item.active').forEach(other => {
        if (other !== el) {
          other.classList.remove('active');
          other.querySelector('.toggle-icon').textContent = '＋';
        }
      });

      el.classList.toggle('active', !wasActive);
      icon.textContent = !wasActive ? '－' : '＋';

      // Smooth scroll to keep item in view
      if (!wasActive) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });

    track.appendChild(el);
  });

  // Auto-open first item after delay
  setTimeout(() => {
    const first = track.querySelector('.timeline-item');
    if (first) {
      first.classList.add('active');
      const icon = first.querySelector('.toggle-icon');
      if (icon) icon.textContent = '－';
    }
  }, 800);

  observeReveal('#timeline-track .timeline-item');
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
