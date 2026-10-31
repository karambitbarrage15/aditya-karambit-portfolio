/**
 * Text Decipher / Hacker Scrambler Effect
 * Exactly like peaches.world 'entziffere' engine.
 * Cycles through randomized glyphs before locking onto destination characters.
 */

class DecipherEngine {
  constructor() {
    this.glyphs = '!<>-_\\/[]{}—=+*^?#_$%&@~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  scramble(element, targetText, delay = 0, speed = 25) {
    if (!element) return;
    
    // Clear any active interval on this element
    if (element._scrambleTimer) {
      clearInterval(element._scrambleTimer);
    }

    const text = targetText || element.getAttribute('data-s') || element.textContent;
    const len = text.length;
    let iteration = 0;

    setTimeout(() => {
      element._scrambleTimer = setInterval(() => {
        let output = '';

        for (let i = 0; i < len; i++) {
          if (text[i] === ' ') {
            output += ' ';
            continue;
          }

          if (i < iteration) {
            output += text[i];
          } else {
            const randomGlyph = this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
            output += randomGlyph;
          }
        }

        element.textContent = output;

        if (iteration >= len) {
          clearInterval(element._scrambleTimer);
          element.textContent = text;
        }

        iteration += 1 / 2; // Smooth character settle rate
      }, speed);
    }, delay);
  }

  scrambleAll(container = document) {
    const elements = container.querySelectorAll('[data-s]');
    elements.forEach((el, index) => {
      const target = el.getAttribute('data-s');
      this.scramble(el, target, index * 120);
    });
  }
}

window.decipher = new DecipherEngine();

