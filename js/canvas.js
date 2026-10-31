/**
 * Multi-Mode Generative Canvas Engine
 * Replicates peaches.world's exact raster modes:
 * Mode 1: PIXELS (Retro pixelated mosaic grid)
 * Mode 2: DOTS (Halftone dither dot matrix)
 * Mode 3: GLYPHS (ASCII terminal glyph matrix)
 * Mode 4: LINES (Horizontal flowing sine wave scanlines)
 * Mode 5: FULL (100% Crystal-clear unhidden artwork view)
 * + 3D Perspective Warp Tunnel for Work transitions!
 */

class VisualCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.mode = 5; // Default to FULL (100% visible artwork)
    this.isTunneling = false;
    this.tunnelProgress = 0;
    this.width = 0;
    this.height = 0;

    // Mouse / Pointer tracking
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      active: false
    };

    // Tunnel Rings
    this.tunnelRings = [];
    this.initTunnelRings(22);

    this.glyphs = ' .:-=+*#%@$';
    this.time = 0;
    this.bindEvents();
    this.resize();
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('pointermove', (e) => {
      this.mouse.active = true;
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    window.addEventListener('pointerleave', () => {
      this.mouse.active = false;
    });
  }

  initTunnelRings(count) {
    this.tunnelRings = [];
    for (let i = 0; i < count; i++) {
      this.tunnelRings.push({
        z: (i / count) * 1000
      });
    }
  }

  setMode(modeNum) {
    if (modeNum >= 1 && modeNum <= 5) {
      this.mode = modeNum;
      document.body.classList.toggle('voll', modeNum === 5);
    }
  }

  triggerTunnel(callback) {
    this.isTunneling = true;
    this.tunnelProgress = 0;
    if (window.soundEngine) {
      window.soundEngine.playWarp();
    }

    const start = performance.now();
    const duration = 850; // ms

    const animateWarp = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      this.tunnelProgress = progress;

      // Update speedometer
      const depthEl = document.getElementById('telemetry-depth');
      if (depthEl) {
        const speed = Math.floor(progress * 888);
        depthEl.textContent = `[ ${speed.toString().padStart(3, '0')} KM/H ]`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateWarp);
      } else {
        // Flash trigger
        const blitz = document.getElementById('blitz');
        if (blitz) {
          blitz.classList.add('active');
          setTimeout(() => {
            blitz.classList.remove('active');
          }, 350);
        }
        this.isTunneling = false;
        if (callback) callback();
      }
    };

    requestAnimationFrame(animateWarp);
  }

  loop() {
    this.time += 0.02;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Clear transparently so background artwork shines through
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.isTunneling) {
      this.ctx.fillStyle = '#05070b';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.renderTunnel();
    } else {
      switch (this.mode) {
        case 1:
          this.renderPixels();
          break;
        case 2:
          this.renderDots();
          break;
        case 3:
          this.renderGlyphs();
          break;
        case 4:
          this.renderLines();
          break;
        case 5:
          // FULL Mode: 100% clean, vibrant artwork view
          break;
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  /* Mode 1: PIXELS */
  renderPixels() {
    const ctx = this.ctx;
    const step = 28;
    for (let x = 0; x < this.width; x += step) {
      for (let y = 0; y < this.height; y += step) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = Math.max(0, 1 - dist / 300);

        if (factor > 0.05) {
          ctx.fillStyle = factor > 0.4 ? 'rgba(255, 90, 0, 0.45)' : 'rgba(242, 242, 238, 0.15)';
          ctx.fillRect(x + 1, y + 1, step - 2, step - 2);
        }
      }
    }
  }

  /* Mode 2: DOTS (Halftone Matrix) */
  renderDots() {
    const ctx = this.ctx;
    const spacing = 28;

    for (let x = spacing / 2; x < this.width; x += spacing) {
      for (let y = spacing / 2; y < this.height; y += spacing) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 280);

        const radius = 1.2 + influence * 3.5;
        
        ctx.beginPath();
        ctx.fillStyle = influence > 0.4 ? 'rgba(255, 90, 0, 0.8)' : 'rgba(242, 242, 238, 0.2)';
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* Mode 3: GLYPHS (ASCII Matrix) */
  renderGlyphs() {
    const ctx = this.ctx;
    const step = 24;
    ctx.font = '12px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let x = step / 2; x < this.width; x += step) {
      for (let y = step / 2; y < this.height; y += step) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 280);

        if (influence > 0.05) {
          const glyphIdx = Math.floor(influence * (this.glyphs.length - 1));
          const char = this.glyphs[glyphIdx];
          ctx.fillStyle = influence > 0.4 ? '#ff8a2a' : 'rgba(242, 242, 238, 0.25)';
          ctx.fillText(char, x, y);
        }
      }
    }
  }

  /* Mode 4: LINES (Sine Scanline Wave) */
  renderLines() {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    const step = 10;
    const hub = 14;

    for (let y = 0; y < this.height; y += step) {
      const distY = Math.abs(y - this.mouse.y);
      const mouseFactor = Math.max(0, 1 - distY / 240);
      
      const wave = Math.sin(this.time + y * 0.02) * (hub * (1 + mouseFactor * 2));
      
      ctx.beginPath();
      ctx.strokeStyle = mouseFactor > 0.4 ? 'rgba(255, 138, 42, 0.4)' : 'rgba(242, 242, 238, 0.12)';
      ctx.moveTo(0, y + wave);
      ctx.lineTo(this.width, y + wave);
      ctx.stroke();
    }
  }

  /* Perspective Tunnel Warp */
  renderTunnel() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const speed = 25 + this.tunnelProgress * 65;

    ctx.lineWidth = 1.5;

    for (let i = 0; i < this.tunnelRings.length; i++) {
      const ring = this.tunnelRings[i];
      ring.z -= speed;

      if (ring.z <= 10) {
        ring.z += 1000;
      }

      const fov = 400;
      const scale = fov / ring.z;
      const size = 600 * scale;

      const alpha = Math.min(1, Math.max(0, 1 - ring.z / 950));
      ctx.strokeStyle = `rgba(61, 255, 138, ${alpha * 0.75})`;

      ctx.beginPath();
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

      if (i % 4 === 0) {
        ctx.strokeStyle = `rgba(255, 138, 42, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - size / 2, cy - size / 2);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + size / 2, cy - size / 2);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + size / 2, cy + size / 2);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - size / 2, cy + size / 2);
        ctx.stroke();
      }
    }
  }
}

window.visualCanvas = null;
window.addEventListener('DOMContentLoaded', () => {
  window.visualCanvas = new VisualCanvas('bg-canvas');
});
