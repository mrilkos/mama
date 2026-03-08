// ═══════════════════════════════════════════
//  CONFETTI — Physics-based confetti explosion
// ═══════════════════════════════════════════

const COLORS = [
  '#f0a0c0', '#c8924e', '#e8c99a', '#fce8f0',
  '#f5b8d4', '#ffffff', '#e87aaa', '#d4608a',
  '#fdf0f5', '#72304c',
];

const SHAPES = ['rect', 'circle', 'ribbon'];

class ConfettiPiece {
  constructor(originX, originY) {
    this.x   = originX;
    this.y   = originY;
    this.vx  = (Math.random() - 0.5) * 18;
    this.vy  = -(Math.random() * 16 + 6);
    this.gravity = 0.35;
    this.drag    = 0.97;
    this.w    = 6 + Math.random() * 8;
    this.h    = 10 + Math.random() * 14;
    this.rot  = Math.random() * 360;
    this.rotV = (Math.random() - 0.5) * 8;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.opacity = 1;
    this.alive = true;
  }

  update() {
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x  += this.vx;
    this.y  += this.vy;
    this.rot += this.rotV;

    if (this.y > window.innerHeight + 50) {
      this.alive = false;
    }
    if (this.y > window.innerHeight * 0.6) {
      this.opacity = Math.max(0, this.opacity - 0.02);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle   = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rot * Math.PI) / 180);

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'ribbon') {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }
    ctx.restore();
  }
}

export function triggerConfetti(originX, originY) {
  // Create overlay canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; pointer-events: none;
    z-index: 3000; width: 100%; height: 100%;
  `;
  document.body.appendChild(canvas);

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx     = canvas.getContext('2d');
  const ox      = originX ?? window.innerWidth  / 2;
  const oy      = originY ?? window.innerHeight / 2;

  // Spawn 180 pieces
  let pieces = Array.from({ length: 180 }, () => new ConfettiPiece(ox, oy));

  // Second burst after 300ms
  setTimeout(() => {
    pieces = pieces.concat(
      Array.from({ length: 80 }, () => new ConfettiPiece(
        ox + (Math.random() - 0.5) * 200,
        oy + (Math.random() - 0.5) * 100
      ))
    );
  }, 300);

  let animId;

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter(p => p.alive);
    pieces.forEach(p => { p.update(); p.draw(ctx); });

    if (pieces.length > 0) {
      animId = requestAnimationFrame(loop);
    } else {
      canvas.remove();
    }
  }
  loop();
}
