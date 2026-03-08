// ═══════════════════════════════════════════
//  GALLERY — 3D tilt cards, modal with prev/next
// ═══════════════════════════════════════════

import { state, emit } from './state.js';

let items = [];

export function buildGallery(galleryData) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  items = galleryData;
  grid.innerHTML = '';

  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item reveal';
    el.style.transitionDelay = (i * 0.08) + 's';
    el.dataset.index = i;

    el.innerHTML = `
      <div class="gallery-face">
        <div class="gallery-emoji">${item.emoji}</div>
        <p class="gallery-caption">${item.caption}</p>
      </div>
      <span class="gallery-badge">${item.year}</span>
      <div class="gallery-overlay">
        <p class="gallery-overlay-text">${item.full}</p>
      </div>
    `;

    el.addEventListener('click', () => openModal(i));

    // 3D Tilt effect
    applyTilt(el);

    grid.appendChild(el);
  });

  // Re-observe for scroll reveal
  observeReveal();
}

function applyTilt(el) {
  let rafId = null;
  let lastX = 0, lastY = 0;

  el.addEventListener('mousemove', e => {
    lastX = e.clientX;
    lastY = e.clientY;

    // Throttle to one rAF per frame — no layout thrash
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (lastX - cx) / (rect.width  / 2);
      const dy   = (lastY - cy) / (rect.height / 2);

      // Reduced angles (6deg instead of 12) = less CPU
      el.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
      el.style.boxShadow = `${-dx * 6}px ${-dy * 6}px 24px rgba(114,48,76,.15)`;
    });
  }, { passive: true });

  el.addEventListener('mouseleave', () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    el.style.transform = '';
    el.style.boxShadow = '';
  });
}

// ── MODAL ─────────────────────────────────
export function openModal(index) {
  state.currentModalIndex = index;
  state.modalOpen = true;
  renderModal();
  document.getElementById('gallery-modal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  state.modalOpen = false;
  document.getElementById('gallery-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderModal() {
  const item = items[state.currentModalIndex];
  if (!item) return;

  const emoji   = document.getElementById('modal-emoji-lg');
  const heading = document.getElementById('modal-heading');
  const body    = document.getElementById('modal-body');

  if (emoji)   emoji.textContent   = item.emoji;
  if (heading) heading.textContent = item.caption.replace(/\n/g, ' ');
  if (body)    body.textContent    = item.full;

  // Counter
  const counter = document.getElementById('modal-counter');
  if (counter) counter.textContent = `${state.currentModalIndex + 1} / ${items.length}`;

  // Animate in
  const inner = document.querySelector('.modal-inner');
  if (inner) {
    inner.style.transform = 'scale(.88) translateY(20px)';
    requestAnimationFrame(() => {
      inner.style.transform = '';
    });
  }
}

export function prevModal() {
  state.currentModalIndex = (state.currentModalIndex - 1 + items.length) % items.length;
  renderModal();
}

export function nextModal() {
  state.currentModalIndex = (state.currentModalIndex + 1) % items.length;
  renderModal();
}

export function initGallery() {
  // Close on backdrop
  document.getElementById('gallery-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('gallery-modal')) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!state.modalOpen) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  prevModal();
    if (e.key === 'ArrowRight') nextModal();
  });

  // Swipe support
  let touchStartX = 0;
  document.getElementById('gallery-modal')?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.getElementById('gallery-modal')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? prevModal() : nextModal();
    }
  });
}

function observeReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.gallery-item.reveal').forEach(el => obs.observe(el));
}
