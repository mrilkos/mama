// ═══════════════════════════════════════════
//  PARTICLES — Canvas heart/petal particle system
//  that reacts to mouse movement
// ═══════════════════════════════════════════

const EMOJIS = ['🌸', '🌺', '💗', '✿', '🌷', '❀', '💕', '🌹'];
const PARTICLE_COUNT = 16; // reduced from 28

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  reset(initial = false) {
    const c = this.canvas;
    this.x = Math.random() * c.width;
    this.y = initial ? Math.random() * c.height : -40;
    this.size = 12 + Math.random() * 16;
    this.speedY = 0.4 + Math.random() * 0.7;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = 0.4 + Math.random() * 0.5;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.2;
    this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    this.sway = Math.random() * 2;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.frame = 0;
  }

  update(mouseX, mouseY) {
    this.frame++;
    this.x += this.speedX + Math.sin(this.frame * 0.015 + this.swayOffset) * this.sway * 0.04;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;

    // Only compute repulsion when mouse is nearby (perf guard)
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      // Quick distance approximation — skip sqrt if clearly far
      if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          this.x += (dx / dist) * force * 1.2;
          this.y += (dy / dist) * force * 0.4;
        }
      }
    }

    if (this.y > this.canvas.height + 60) this.reset();
    if (this.x < -40 || this.x > this.canvas.width + 40) this.reset();
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = null, mouseY = null;
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas));
  });

  // Spawn initial particles
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas));

  const hero = document.getElementById('hero');

  // Throttled mouse tracking (every 2nd event)
  let mouseThrottle = 0;
  hero?.addEventListener('mousemove', e => {
    if (++mouseThrottle % 2 !== 0) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });
  hero?.addEventListener('mouseleave', () => {
    mouseX = null; mouseY = null;
  });

  // Pause loop when hero section is off-screen
  let heroVisible = true;
  const visObs = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
  }, { threshold: 0 });
  if (hero) visObs.observe(hero);

  function loop() {
    animId = requestAnimationFrame(loop);
    if (!heroVisible) return; // skip rendering when not visible
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(mouseX, mouseY);
      p.draw(ctx);
    });
  }
  loop();

  return () => cancelAnimationFrame(animId);
}
