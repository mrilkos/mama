# 🌸 To The Queen of My Life

A modern, emotional, multi-file interactive website dedicated to your mother.

## 📁 Project Structure

```
queen-of-my-life/
├── index.html
├── css/
│   ├── variables.css   ← Design tokens (colors, spacing, typography)
│   ├── base.css        ← Reset, scrollbar, reveal animations, nav dots
│   ├── ui.css          ← Cursor, language bar, music player, toast
│   ├── hero.css        ← Hero section + particles + parallax rings
│   └── sections.css    ← Letter, Flip Cards, Timeline, Counters, Surprise
└── js/
    ├── data.js         ← All content in 3 languages (EN / FR / AR)
    ├── state.js        ← Central app state + event bus
    ├── main.js         ← App orchestrator
    ├── cursor.js       ← Magnetic custom cursor
    ├── particles.js    ← Canvas particle system (reacts to mouse)
    ├── typewriter.js   ← Realistic letter typing with variable speed
    ├── flipCards.js    ← 3D flip cards with spring feel
    ├── timeline.js     ← Interactive expandable timeline
    ├── counters.js     ← Animated number counters
    ├── confetti.js     ← Physics-based confetti engine (Canvas)
    ├── music.js        ← Music player with visualizer
    ├── nav.js          ← Scroll progress bar + section nav dots
    └── i18n.js         ← Language switching (EN / FR / AR)
```

## ✨ Interactive Features

| Feature | Description |
|---------|-------------|
| 🎨 Custom Cursor | Magnetic cursor that morphs on hover |
| 🌸 Particle Canvas | Hearts & petals that react to mouse movement |
| 🖱️ Parallax Hero | Decorative rings follow your cursor |
| ✍️ Typewriter | Realistic letter typing — Slow / Normal / Fast speed |
| 🃏 Flip Cards | 3D flip to reveal personal messages |
| 📅 Timeline | Expandable items, click to open |
| 🔢 Counters | Animated numbers on scroll entry |
| 🎉 Confetti | Physics engine — 200+ pieces with gravity |
| 🎵 Music Player | Animated visualizer bars |
| 📍 Nav Dots | Right-side section indicators |
| 📊 Progress Bar | Scroll progress at top |
| 👑 Easter Egg | Click the crown 5 times... |
| 🌙 Theme Toggle | Default ↔ Rose Gold |
| 🌍 3 Languages | EN · FR · AR (Arabic = full RTL) |

## 🚀 How to Run

### Option 1 — VS Code Live Server (Recommended)
Right-click `index.html` → **Open with Live Server**

### Option 2 — Python
```bash
python3 -m http.server 3000
```
Then open `http://localhost:3000`

### Option 3 — Node.js
```bash
npx serve .
```

> ⚠️ Must be served over HTTP — ES Modules don't work with `file://`

## 🎵 Custom Music
Replace the `<source src="...">` in `index.html` with your own MP3 URL.

## 💝 Personalize
Edit `js/data.js` to change the letter, timeline, flip card messages,
counters, and signature in all 3 languages.

---
*Made with love by Ilyas — for the queen of his life* 👑
