// ═══════════════════════════════════════════
//  MUSIC — Player with animated visualizer
// ═══════════════════════════════════════════

import { state } from './state.js';

export function initMusic() {
  const btn    = document.getElementById('music-btn');
  const player = document.getElementById('music-player');
  const audio  = document.getElementById('bg-music');
  if (!btn || !audio) return;

  btn.addEventListener('click', toggleMusic);

  // Handle audio events
  audio.addEventListener('play', () => {
    player?.classList.add('playing');
    btn.innerHTML = '⏸';
  });
  audio.addEventListener('pause', () => {
    player?.classList.remove('playing');
    btn.innerHTML = '▶';
  });
  audio.addEventListener('ended', () => {
    player?.classList.remove('playing');
    btn.innerHTML = '▶';
    state.musicPlaying = false;
  });
}

export function toggleMusic() {
  const audio  = document.getElementById('bg-music');
  if (!audio) return;

  if (state.musicPlaying) {
    audio.pause();
    state.musicPlaying = false;
    showToast('Music paused 🎵');
  } else {
    audio.volume = 0.22;
    audio.play().then(() => {
      state.musicPlaying = true;
      showToast('Now playing 🎶');
    }).catch(() => {
      showToast('Click again to play music 🎵');
    });
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
