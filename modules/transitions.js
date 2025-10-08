const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let maskEl = null;
let splitCache = new WeakMap();
let revealObserver = null;

export function initTransitions() {
  maskEl = document.querySelector('.page-mask');
  if (maskEl) {
    maskEl.style.transition = prefersReduced
      ? 'none'
      : 'clip-path 0.75s cubic-bezier(0.22,0.61,0.36,1), opacity 0.75s cubic-bezier(0.22,0.61,0.36,1)';
  }
  setupRevealObserver();
}

export function animateMask(direction = 'in') {
  if (!maskEl || prefersReduced) return Promise.resolve();
  return new Promise((resolve) => {
    const endHandler = () => {
      maskEl.removeEventListener('transitionend', endHandler);
      resolve();
    };
    requestAnimationFrame(() => {
      maskEl.addEventListener('transitionend', endHandler, { once: true });
      maskEl.style.opacity = '1';
      maskEl.style.clipPath = direction === 'out' ? 'circle(140% at 50% 50%)' : 'circle(0% at 50% 50%)';
      if (direction === 'out') {
        // start closed, then open
        maskEl.style.clipPath = 'circle(0% at 50% 50%)';
        requestAnimationFrame(() => {
          maskEl.style.clipPath = 'circle(140% at 50% 50%)';
        });
      } else {
        maskEl.style.clipPath = 'circle(140% at 50% 50%)';
        requestAnimationFrame(() => {
          maskEl.style.clipPath = 'circle(0% at 50% 50%)';
        });
      }
    });
  }).then(() => {
    if (direction === 'in') {
      maskEl.style.opacity = '0';
    }
  });
}

export function prepareSplitText(root = document) {
  const splitElements = root.querySelectorAll('[data-split]');
  splitElements.forEach((el) => {
    if (splitCache.has(el)) return;
    const type = el.dataset.split || 'line';
    const text = el.textContent;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    const words = text.trim().split(/(\s+)/);
    words.forEach((word) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'split-line';
      if (type === 'line' && word === ' ') {
        wrapper.textContent = ' ';
      } else {
        const letters = type === 'word' ? [word] : word.split('');
        letters.forEach((letter) => {
          const span = document.createElement('span');
          span.className = 'split-char';
          span.textContent = letter;
          wrapper.appendChild(span);
        });
      }
      frag.appendChild(wrapper);
    });
    el.appendChild(frag);
    splitCache.set(el, true);
  });
}

export function playSplitText(root = document, delay = 0) {
  if (prefersReduced) return;
  const chars = root.querySelectorAll('.split-char');
  chars.forEach((char, index) => {
    const totalDelay = delay + index * 14;
    char.style.transition = `transform 0.65s cubic-bezier(0.22,0.61,0.36,1) ${totalDelay}ms, opacity 0.65s cubic-bezier(0.22,0.61,0.36,1) ${totalDelay}ms, filter 0.65s cubic-bezier(0.22,0.61,0.36,1) ${totalDelay}ms`;
    requestAnimationFrame(() => {
      char.style.transform = 'translateY(0)';
      char.style.opacity = '1';
      char.style.filter = 'blur(0)';
    });
  });
}

function setupRevealObserver() {
  if (prefersReduced) return;
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const options = { threshold: 0.2, rootMargin: '0px 0px -20%' };
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('reveal-visible');
        revealObserver.unobserve(el);
      }
    });
  }, options);
  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${index * 120}ms`;
    revealObserver.observe(el);
  });
}

export function refreshReveals(root = document) {
  if (prefersReduced) {
    root.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal-visible'));
    return;
  }
  if (revealObserver) {
    revealObserver.disconnect();
  }
  setupRevealObserver();
}

export function disposeTransitions() {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
}

export function isMotionReduced() {
  return prefersReduced;
}
