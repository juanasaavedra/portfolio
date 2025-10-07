const state = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
};

const onReady = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const introMask = document.querySelector('.intro-mask');
  if (introMask) {
    if (state.reduceMotion.matches) {
      introMask.remove();
    } else {
      requestAnimationFrame(() => {
        introMask.classList.add('is-hidden');
        introMask.addEventListener('transitionend', () => introMask.remove(), { once: true });
      });
    }
  }

  setupHeaderGlass();
  setupReveals();
  setupMagneticCTA();
  setupParticles();
  setupForm();
};

const setupHeaderGlass = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => {
    if (window.scrollY > 8) {
      header.classList.add('is-glass');
    } else {
      header.classList.remove('is-glass');
    }
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
};

const setupReveals = () => {
  const elements = Array.from(document.querySelectorAll('.reveal'));
  if (!elements.length) return;

  if (state.reduceMotion.matches) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = elements.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), index * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
};

const setupMagneticCTA = () => {
  const button = document.querySelector('.btn-magnetic');
  if (!button || state.reduceMotion.matches) return;

  const strength = 16;
  const reset = () => {
    button.style.transform = 'translate3d(0, 0, 0)';
  };

  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate3d(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px, 0)`;
  });

  button.addEventListener('pointerleave', reset);
  button.addEventListener('blur', reset);
};

const setupParticles = () => {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas || state.reduceMotion.matches) {
    if (canvas) {
      canvas.remove();
    }
    return;
  }

  const ctx = canvas.getContext('2d');
  const particles = [];
  const config = {
    count: 150,
    baseSpeed: 0.12,
    pointerInfluence: 0.035,
    maxVelocity: 0.6
  };

  let pointer = { x: 0, y: 0, active: false };

  const applyCanvasSize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
  };

  class Particle {
    constructor(width, height) {
      this.reset(width, height);
    }
    reset(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const angle = Math.random() * Math.PI * 2;
      const speed = config.baseSpeed + Math.random() * 0.4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = 1 + Math.random() * 1.5;
    }
    update(width, height) {
      if (pointer.active) {
        const dx = pointer.x - this.x;
        const dy = pointer.y - this.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
        const force = config.pointerInfluence / dist;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const max = config.maxVelocity;
      if (velocity > max) {
        this.vx = (this.vx / velocity) * max;
        this.vy = (this.vy / velocity) * max;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
        this.reset(width, height);
      }
    }
    draw(context) {
      context.beginPath();
      context.fillStyle = 'rgba(255, 125, 183, 0.35)';
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  const initParticles = () => {
    particles.length = 0;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    for (let i = 0; i < config.count; i += 1) {
      particles.push(new Particle(width, height));
    }
  };

  let animationFrame = null;

  const render = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    particles.forEach((particle) => {
      particle.update(rect.width, rect.height);
      particle.draw(ctx);
    });
    animationFrame = requestAnimationFrame(render);
  };

  const handlePointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true
    };
  };

  const handlePointerLeave = () => {
    pointer.active = false;
  };

  const handleResize = () => {
    applyCanvasSize();
    initParticles();
  };

  applyCanvasSize();
  initParticles();
  render();

  window.addEventListener('resize', handleResize);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerleave', handlePointerLeave);
};

const setupForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  const validators = {
    nombre: (value) => value.trim().length > 1,
    email: (value) => /.+@.+\..+/.test(value.trim()),
    mensaje: (value) => value.trim().length > 5
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    let isValid = true;

    for (const [name, validate] of Object.entries(validators)) {
      const field = form.elements.namedItem(name);
      if (!field) continue;
      const value = formData.get(name);
      const valid = validate(String(value || ''));
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid) {
        isValid = false;
        field.classList.add('input-error');
      } else {
        field.classList.remove('input-error');
      }
    }

    if (!status) return;

    if (isValid) {
      status.textContent = 'Gracias por tu mensaje. Te contactaré pronto.';
      form.reset();
    } else {
      status.textContent = 'Revisa los campos resaltados para continuar.';
    }
  });
};

document.addEventListener('DOMContentLoaded', onReady);

state.reduceMotion.addEventListener('change', () => {
  window.location.reload();
});
