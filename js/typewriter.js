// ═══════════════════════════════════════════
//  TYPEWRITER — Realistic letter typing effect
//  with variable speed and line breaks
// ═══════════════════════════════════════════

import { state, on } from './state.js';

const SPEEDS = { slow: 60, normal: 22, fast: 6 };

let timer = null;
let isTyping = false;

export function initTypewriter() {
  // Speed control buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = btn.dataset.speed;
      state.typingSpeed = speed;
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Re-type when language changes
  on('langChange', () => {
    if (isTyping) {
      clearTimeout(timer);
      isTyping = false;
    }
    resetAndType();
  });
}

export function startTypewriter(text) {
  const container = document.getElementById('typed-text');
  const sig       = document.getElementById('letter-sig');
  if (!container) return;

  // Clear previous
  clearTimeout(timer);
  container.innerHTML = '';
  sig?.classList.remove('reveal-sig');

  // Build nodes for each character (handles \n)
  const chars = text.split('');
  let index = 0;
  isTyping = true;

  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  container.appendChild(cursor);

  function typeNext() {
    if (index >= chars.length) {
      // Done — remove cursor, reveal sig
      cursor.remove();
      isTyping = false;
      setTimeout(() => sig?.classList.add('reveal-sig'), 500);
      return;
    }

    const ch = chars[index++];
    if (ch === '\n') {
      // Double line-break on \n
      const br1 = document.createElement('br');
      const br2 = document.createElement('br');
      container.insertBefore(br1, cursor);
      container.insertBefore(br2, cursor);
    } else {
      const span = document.createElement('span');
      span.textContent = ch;
      // Slight entrance animation
      span.style.opacity = '0';
      span.style.transition = 'opacity 0.08s';
      container.insertBefore(span, cursor);
      requestAnimationFrame(() => span.style.opacity = '1');
    }

    // Variable speed: pause longer on punctuation
    let delay = SPEEDS[state.typingSpeed] || SPEEDS.normal;
    if (['.', '!', '?'].includes(ch)) delay *= 8;
    else if ([',', ';', ':'].includes(ch)) delay *= 4;
    else if (ch === '\n') delay *= 6;

    // Random human variation
    delay += (Math.random() - 0.5) * delay * 0.4;

    timer = setTimeout(typeNext, delay);
  }

  typeNext();
}

function resetAndType() {
  // Will be called after a small delay to let DOM update
  setTimeout(() => {
    const container = document.getElementById('typed-text');
    if (container && container.closest('#letter')) {
      // Re-trigger if letter is visible
      const rect = container.closest('#letter').getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        const { CONTENT } = window.__queenData || {};
        if (CONTENT) {
          const text = CONTENT[state.lang].letter.body;
          startTypewriter(text);
        }
      }
    }
  }, 200);
}
