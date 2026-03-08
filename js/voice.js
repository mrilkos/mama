// ═══════════════════════════════════════════
//  VOICE — "I love you, Mama" in every language
//  One card per language, hardcoded by dev.
//
//  HOW TO CUSTOMIZE:
//  1. Record yourself saying the phrase in each language
//  2. Save files to the  audio/  folder
//  3. Update the  src  field in each TRACK below
// ═══════════════════════════════════════════

const TRACKS = [

  // ── Moroccan / Arabic ──────────────────
  {
    lang:     'Darija',
    native:   'كنبغيك يا ماما',
    romanized:'Kanbghik ya mama',
    flag:     '🇲🇦',
    color:    '#e87aaa',
    src:      'audio/ilove-darija.mp3',
  },
  {
    lang:     'Arabic',
    native:   'أحبكِ يا أمي',
    romanized:'Ouhibbouki ya ommi',
    flag:     '🇸🇦',
    color:    '#c8924e',
    src:      'audio/ilove-arabic.mp3',
  },

  // ── French ────────────────────────────
  {
    lang:     'French',
    native:   'Je t\'aime, Maman',
    romanized:'Je t\'aime, Maman',
    flag:     '🇫🇷',
    color:    '#7fb3d3',
    src:      'audio/ilove-french.mp3',
  },

  // ── English ───────────────────────────
  {
    lang:     'English',
    native:   'I love you, Mom',
    romanized:'I love you, Mom',
    flag:     '🇬🇧',
    color:    '#9ab87a',
    src:      'audio/ilove-english.mp3',
  },

  // ── Spanish ───────────────────────────
  {
    lang:     'Spanish',
    native:   'Te quiero, Mamá',
    romanized:'Te quiero, Mamá',
    flag:     '🇪🇸',
    color:    '#e06b6b',
    src:      'audio/ilove-spanish.mp3',
  },

  // ── Italian ───────────────────────────
  {
    lang:     'Italian',
    native:   'Ti amo, Mamma',
    romanized:'Ti amo, Mamma',
    flag:     '🇮🇹',
    color:    '#78b89a',
    src:      'audio/ilove-italian.mp3',
  },

  // ── Portuguese ────────────────────────
  {
    lang:     'Portuguese',
    native:   'Eu te amo, Mãe',
    romanized:'Eu te amo, Mãe',
    flag:     '🇵🇹',
    color:    '#d4836a',
    src:      'audio/ilove-portuguese.mp3',
  },

  // ── German ────────────────────────────
  {
    lang:     'German',
    native:   'Ich liebe dich, Mama',
    romanized:'Ich liebe dich, Mama',
    flag:     '🇩🇪',
    color:    '#a0a0c8',
    src:      'audio/ilove-german.mp3',
  },


  // ── Japanese ──────────────────────────
  {
    lang:     'Japanese',
    native:   'お母さん、大好き',
    romanized:'Okāsan, daisuki',
    flag:     '🇯🇵',
    color:    '#e8a0b4',
    src:      'audio/ilove-japanese.mp3',
  },

  // ── Korean ────────────────────────────
  {
    lang:     'Korean',
    native:   '엄마, 사랑해요',
    romanized:'Eomma, saranghaeyo',
    flag:     '🇰🇷',
    color:    '#8ab4d4',
    src:      'audio/ilove-korean.mp3',
  },

  // ── Chinese ───────────────────────────
  {
    lang:     'Chinese',
    native:   '妈妈，我爱你',
    romanized:'Māma, wǒ ài nǐ',
    flag:     '🇨🇳',
    color:    '#d4a060',
    src:      'audio/ilove-chinese.mp3',
  },

  // ── Russian ───────────────────────────
  {
    lang:     'Russian',
    native:   'Я люблю тебя, мама',
    romanized:'Ya lyublyu tebya, mama',
    flag:     '🇷🇺',
    color:    '#9ab4c8',
    src:      'audio/ilove-russian.mp3',
  },




];

// Only one track plays at a time
let currentAudio = null;
let currentCard  = null;

export function initVoice() {
  const grid = document.getElementById('voice-grid');
  if (!grid) return;

  TRACKS.forEach((track, i) => {
    const card = buildCard(track, i);
    grid.appendChild(card);
  });

  // Reveal animation
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.voice-card').forEach(el => obs.observe(el));
}

function buildCard(track, index) {
  const card = document.createElement('div');
  card.className = 'voice-card reveal';
  card.style.transitionDelay = (index * 0.06) + 's';

  card.innerHTML = `
    <div class="voice-card-top">
      <span class="voice-flag">${track.flag}</span>
      <div class="voice-lang-info">
        <span class="voice-lang-name">${track.lang}</span>
        <span class="voice-romanized">${track.romanized}</span>
      </div>
    </div>

    <div class="voice-phrase" style="color:${track.color}">${track.native}</div>

    <div class="voice-controls">
      <button class="voice-play-btn" aria-label="Play ${track.lang}">
        <span class="voice-play-icon">▶</span>
      </button>
      <div class="voice-waveform" aria-hidden="true">
        ${Array.from({length: 20}, (_, i) =>
          `<span class="voice-bar" style="animation-delay:${(i * 0.07).toFixed(2)}s"></span>`
        ).join('')}
      </div>
      <span class="voice-duration">0:00</span>
    </div>
  `;

  const audio    = new Audio(track.src);
  const playBtn  = card.querySelector('.voice-play-btn');
  const playIcon = card.querySelector('.voice-play-icon');
  const waveform = card.querySelector('.voice-waveform');
  const duration = card.querySelector('.voice-duration');

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const remaining = audio.duration - audio.currentTime;
    duration.textContent = formatTime(isNaN(remaining) ? 0 : remaining);
  });

  audio.addEventListener('ended', () => {
    setPlaying(card, playIcon, waveform, false);
    duration.textContent = '0:00';
    currentAudio = null;
    currentCard  = null;
  });

  playBtn.addEventListener('click', () => {
    const isPlaying = card.classList.contains('playing');

    // Stop current track if different
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentCard) {
        setPlaying(currentCard, currentCard.querySelector('.voice-play-icon'), currentCard.querySelector('.voice-waveform'), false);
        currentCard.querySelector('.voice-duration').textContent = '0:00';
      }
    }

    if (isPlaying) {
      audio.pause();
      setPlaying(card, playIcon, waveform, false);
      currentAudio = null;
      currentCard  = null;
    } else {
      audio.play().catch(() => showNotReady(card, track.native));
      setPlaying(card, playIcon, waveform, true);
      currentAudio = audio;
      currentCard  = card;
    }
  });

  return card;
}

function setPlaying(card, icon, wave, playing) {
  card.classList.toggle('playing', playing);
  icon.textContent = playing ? '⏸' : '▶';
  wave.classList.toggle('active', playing);
}

function showNotReady(card, orig) {
  const phrase = card.querySelector('.voice-phrase');
  const savedColor = phrase.style.color;
  phrase.style.transition = 'all .3s';
  phrase.style.color = 'rgba(255,255,255,.35)';
  phrase.style.fontSize = '13px';
  phrase.textContent = '🎙️ Audio file not added yet';
  setTimeout(() => {
    phrase.style.fontSize = '';
    phrase.style.color = savedColor;
    phrase.textContent = orig;
  }, 2400);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
