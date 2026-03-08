// ═══════════════════════════════════════════
//  MAIN — App initialization & orchestration
// ═══════════════════════════════════════════

import { state, emit }       from './state.js';
import { CONTENT }           from './data.js';
import { initCursor }        from './cursor.js';
import { initParticles }     from './particles.js';
import { initTypewriter, startTypewriter } from './typewriter.js';
import { buildFlipCards }    from './flipCards.js';
import { buildTimeline }     from './timeline.js';
import { buildCounters }     from './counters.js';
import { triggerConfetti }   from './confetti.js';
import { initMusic, toggleMusic } from './music.js';
import { initNav }           from './nav.js';
import { initLangSwitcher, setLang } from './i18n.js';
import { initThenNow }            from './thennow.js';
import { initVoice }              from './voice.js';

// Expose data for typewriter
window.__queenData = { CONTENT };

// ── DOM Ready ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const C = CONTENT[state.lang];

  // Systems
  initCursor();
  initParticles();
  initMusic();
  initTypewriter();
  initNav(C.nav);
  initLangSwitcher();
  initThenNow();
  initVoice();

  // Build sections
  buildFlipCards(C.qualities.items);
  buildTimeline(C.timeline.items);
  buildCounters(C.counters);

  // Global scroll reveal
  initScrollReveal();

  // Typewriter fires when letter enters viewport
  initLetterObserver(C.letter.body);

  // Parallax on hero
  initParallax();

  // Easter egg — crown clicks
  initEasterEgg();

  // Theme toggle
  initThemeToggle();

  // Surprise button
  document.getElementById('surprise-trigger')?.addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTimeout(() => {
      document.getElementById('surprise-popup')?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 600);
  });

  // Surprise popup close
  document.getElementById('surprise-popup-close')?.addEventListener('click', closeSurprise);
  document.getElementById('surprise-popup')?.addEventListener('click', e => {
    if (e.target === document.getElementById('surprise-popup')) closeSurprise();
  });

  console.log('%c🌸 Queen of My Life — Made with love by Ilyas', 'font-size:16px; color:#f0a0c0; font-family:serif; font-style:italic;');
});

// ── Scroll Reveal ─────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Letter Typewriter Observer ─────────────
function initLetterObserver(body) {
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      setTimeout(() => startTypewriter(body), 400);
      obs.disconnect();
    }
  }, { threshold: 0.25 });

  const letterEl = document.getElementById('letter');
  if (letterEl) obs.observe(letterEl);
}

// ── Parallax ──────────────────────────────
function initParallax() {
  const hero    = document.getElementById('hero');
  const rings   = document.querySelectorAll('.hero-ring');
  const content = document.querySelector('.hero-content');

  hero?.addEventListener('mousemove', e => {
    const cx = hero.offsetWidth  / 2;
    const cy = hero.offsetHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    rings.forEach((ring, i) => {
      const depth = (i + 1) * 8;
      ring.style.transform = `translate(calc(-50% + ${dx * depth}px), calc(-50% + ${dy * depth}px))`;
    });

    if (content) content.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
  });

  hero?.addEventListener('mouseleave', () => {
    rings.forEach(ring => ring.style.transform = '');
    if (content) content.style.transform = '';
  });
}

// ── Easter Egg ────────────────────────────
function initEasterEgg() {
  const crown   = document.querySelector('.hero-crown');
  const counter = document.getElementById('crown-counter');
  if (!crown) return;

  crown.addEventListener('click', e => {
    state.crownClicks++;

    if (state.crownClicks < 5) {
      if (counter) {
        counter.textContent = `${state.crownClicks}/5 — keep going... 👀`;
        counter.classList.add('show');
        clearTimeout(crown._hideTimer);
        crown._hideTimer = setTimeout(() => counter.classList.remove('show'), 1500);
      }
    }

    if (state.crownClicks === 5 && !state.easterEggTriggered) {
      state.easterEggTriggered = true;
      triggerConfetti(e.clientX, e.clientY);
      showToast('👑 You found the secret! The queen has been crowned! 👑');
      if (counter) {
        counter.textContent = '👑 QUEEN CROWNED! 👑';
        counter.classList.add('show');
        setTimeout(() => counter.classList.remove('show'), 4000);
      }
    }
  });
}

// ── Theme Toggle ──────────────────────────
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isRose = document.body.getAttribute('data-theme') === 'rose';
    if (isRose) {
      document.body.removeAttribute('data-theme');
      btn.textContent = '🌸';
      showToast('Default theme');
    } else {
      document.body.setAttribute('data-theme', 'rose');
      btn.textContent = '🌙';
      showToast('Rose gold theme ✨');
    }
  });
}

// ── Surprise ──────────────────────────────
function closeSurprise() {
  document.getElementById('surprise-popup')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Toast ─────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Expose for inline HTML handlers if needed
window.toggleMusic   = toggleMusic;
window.setLang       = setLang;
window.closeSurprise = closeSurprise;
