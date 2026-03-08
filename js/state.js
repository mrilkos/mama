// ═══════════════════════════════════════════
//  STATE — Central app state
// ═══════════════════════════════════════════

export const state = {
  lang: 'en',
  theme: 'default',
  musicPlaying: false,
  crownClicks: 0,
  modalOpen: false,
  currentModalIndex: 0,
  typingSpeed: 'normal', // slow | normal | fast
  easterEggTriggered: false,
};

// Simple event bus for inter-module communication
const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

export function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}
