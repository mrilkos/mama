// ═══════════════════════════════════════════
//  NAV — Scroll progress + section nav dots
// ═══════════════════════════════════════════

const SECTIONS = ['hero', 'letter', 'thennow', 'qualities', 'timeline', 'counters', 'voice', 'surprise-section'];

export function initNav(labels) {
  buildDots(labels);
  initScrollProgress();
  initScrollSpy();
}

function buildDots(labels) {
  const container = document.getElementById('nav-dots');
  if (!container) return;

  container.innerHTML = '';

  SECTIONS.forEach((id, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('data-label', labels?.[i] || id);
    dot.setAttribute('aria-label', `Go to ${id}`);
    dot.setAttribute('title', labels?.[i] || id);

    dot.addEventListener('click', () => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    container.appendChild(dot);
  });
}

function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = Math.min((scrollTop / docHeight) * 100, 100);
    bar.style.width = progress + '%';
  }, { passive: true });
}

function initScrollSpy() {
  const dots = document.querySelectorAll('.nav-dot');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id  = entry.target.id;
        const idx = SECTIONS.indexOf(id);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });

  SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

export function updateNavLabels(labels) {
  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach((dot, i) => {
    if (labels?.[i]) dot.setAttribute('data-label', labels[i]);
  });
}
