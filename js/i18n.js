// ═══════════════════════════════════════════
//  i18n — Language switching (EN / FR / AR)
// ═══════════════════════════════════════════

import { state, emit }      from './state.js';
import { CONTENT, LANGS }   from './data.js';
import { buildFlipCards }   from './flipCards.js';
import { buildTimeline }    from './timeline.js';
import { buildCounters }    from './counters.js';
import { startTypewriter }  from './typewriter.js';
import { updateNavLabels }         from './nav.js';
import { updateThenNowLabels }     from './thennow.js';

export function initLangSwitcher() {
  const bar = document.getElementById('lang-bar');
  if (!bar) return;

  bar.innerHTML = '';

  LANGS.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'lang-btn' + (lang === state.lang ? ' active' : '');
    btn.textContent = CONTENT[lang].meta.label;
    btn.setAttribute('aria-label', `Switch to ${lang}`);
    btn.addEventListener('click', () => setLang(lang));
    bar.appendChild(btn);
  });
}

export function setLang(lang) {
  if (!CONTENT[lang]) return;
  state.lang = lang;

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === CONTENT[lang].meta.label);
  });

  // RTL / LTR
  document.body.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('dir', CONTENT[lang].meta.dir);

  // Re-render all sections
  const C = CONTENT[lang];
  applyHero(C.hero);
  applyLetter(C.letter);
  updateThenNowLabels(C.thennow);
  applyQualitiesHeader(C.qualities);
  buildFlipCards(C.qualities.items);
  applyTimelineHeader(C.timeline);
  buildTimeline(C.timeline.items);
  buildCounters(C.counters);
  applySurprise(C.surprise);
  updateNavLabels(C.nav);

  // Re-start typewriter if letter is already visible
  const letterSection = document.getElementById('letter');
  const rect = letterSection?.getBoundingClientRect();
  if (rect && rect.top < window.innerHeight) {
    startTypewriter(C.letter.body);
  }

  emit('langChange', lang);
}

// ── DOM patchers ───────────────────────────

function applyHero(h) {
  setText('[data-t="hero-eyebrow"]', h.eyebrow);
  setHTML('[data-t="hero-title"]',  `${h.title}<span class="accent">${h.titleAccent}</span>`);
  setText('[data-t="hero-sub"]',    h.sub);
  setText('[data-t="hero-cta"]',    h.cta);
}

function applyLetter(l) {
  setText('[data-t="letter-date"]',     l.date);
  setText('[data-t="letter-greeting"]', l.greeting);
  setText('[data-t="letter-sig"]',      l.sig);
}

function applyQualitiesHeader(q) {
  setText('[data-t="qualities-eyebrow"]', q.eyebrow);
  setHTML('[data-t="qualities-title"]',   `${q.title} <em>${q.titleAccent}</em>`);
  setText('[data-t="qualities-hint"]',    q.hint);
}

function applyTimelineHeader(t) {
  setText('[data-t="timeline-eyebrow"]', t.eyebrow);
  setHTML('[data-t="timeline-title"]',   `${t.title} <em>${t.titleAccent}</em>`);
}

function applySurprise(s) {
  setText('[data-t="surprise-eyebrow"]',   s.eyebrow);
  setHTML('[data-t="surprise-title"]',     `${s.title} <em style="color:var(--rose-deep)">${s.titleAccent}</em>`);
  setText('[data-t="surprise-btn"]',       s.btn);
  setText('[data-t="surprise-pop-title"]', s.popTitle);
  setText('[data-t="surprise-pop-msg"]',   s.popMsg);
  setText('[data-t="surprise-pop-close"]', s.popClose);
}

function setText(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (el) el.textContent = val; });
}
function setHTML(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (el) el.innerHTML = val; });
}
