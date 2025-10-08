const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeroMicrocard(svg) {
  if (!svg) return {};
  const cables = Array.from(svg.querySelectorAll('[data-cable]'));
  const charges = Array.from(svg.querySelectorAll('[data-charge]'));
  if (!cables.length) {
    return {};
  }
  const lengths = cables.map((path) => path.getTotalLength());
  cables.forEach((path, idx) => {
    const length = lengths[idx];
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  });
  let cableProgress = prefersReduced ? 1 : 0;
  let chargeTimeline = 0;
  let loopProgress = 0;
  let rafId;

  const updateCharges = () => {
    const visibility = prefersReduced ? 1 : clamp(chargeTimeline * 2, 0, 1);
    svg.style.setProperty('--hero-charge-visible', visibility);
    charges.forEach((circle, idx) => {
      const path = cables[idx % cables.length];
      const length = lengths[idx % lengths.length];
      const travel = (chargeTimeline * 0.6 + loopProgress + idx * 0.18) % 1;
      const point = path.getPointAtLength(length * travel);
      circle.style.transform = `translate(${point.x}px, ${point.y}px)`;
    });
  };

  const tick = () => {
    loopProgress = (loopProgress + 0.004) % 1;
    updateCharges();
    rafId = requestAnimationFrame(tick);
  };

  const setCableProgress = (value) => {
    cableProgress = clamp(value, 0, 1);
    cables.forEach((path, idx) => {
      const length = lengths[idx];
      const offset = prefersReduced ? 0 : length * (1 - cableProgress);
      path.style.strokeDashoffset = `${offset}`;
    });
    updateCharges();
  };

  const setChargeProgress = (value) => {
    chargeTimeline = clamp(value, 0, 1);
    updateCharges();
  };

  if (!prefersReduced) {
    rafId = requestAnimationFrame(tick);
  } else {
    setCableProgress(1);
  }

  return {
    setCableProgress,
    setChargeProgress,
    dispose() {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

export function initCableNetwork(container, cards = []) {
  if (!container || !cards.length) return null;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  container.innerHTML = '';
  container.appendChild(svg);

  const cables = cards.map((card, index) => {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(8, 9, 12, 0.9)');
    path.setAttribute('stroke-width', '12');
    path.setAttribute('stroke-linecap', 'round');
    path.classList.add('network-cable');
    const pulse = document.createElementNS(svgNS, 'circle');
    pulse.setAttribute('r', '5');
    pulse.setAttribute('fill', '#f7f3ed');
    pulse.setAttribute('opacity', '0');
    pulse.classList.add('network-pulse');
    svg.appendChild(path);
    svg.appendChild(pulse);
    return { card, path, pulse, index };
  });

  const updateLayout = () => {
    const bounds = container.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    cables.forEach(({ card, path, pulse }) => {
      if (card.offsetParent === null) {
        path.setAttribute('d', '');
        pulse.setAttribute('opacity', '0');
        return;
      }
      const cardRect = card.getBoundingClientRect();
      const startX = cardRect.left + cardRect.width / 2 - bounds.left;
      const startY = 0;
      const endX = startX;
      const endY = bounds.height;
      const controlY = bounds.height * 0.35;
      const d = `M${startX} ${startY} C ${startX} ${controlY}, ${startX} ${controlY + 80}, ${endX} ${endY}`;
      path.setAttribute('d', d);
      pulse.setAttribute('cx', startX);
      pulse.setAttribute('cy', endY - 12);
    });
  };

  const updateFocus = (focusIndex) => {
    cables.forEach(({ path, pulse, index }) => {
      const active = index === focusIndex;
      path.classList.toggle('is-active', active);
      pulse.classList.toggle('is-active', active);
      if (active) {
        pulse.setAttribute('opacity', '1');
      } else {
        pulse.setAttribute('opacity', '0');
      }
    });
  };

  updateLayout();
  const resizeObserver = () => updateLayout();
  window.addEventListener('resize', resizeObserver);
  window.addEventListener('scroll', resizeObserver, { passive: true });

  return {
    update: updateFocus,
    refresh: updateLayout,
    dispose() {
      window.removeEventListener('resize', resizeObserver);
      window.removeEventListener('scroll', resizeObserver);
    },
  };
}

export function initProcessLine(panel) {
  if (!panel) return null;
  const list = panel.querySelector('ul');
  if (!list) return null;
  const items = Array.from(list.querySelectorAll('li'));
  if (!items.length) return null;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('class', 'process-svg');
  svg.setAttribute('preserveAspectRatio', 'none');
  panel.appendChild(svg);
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#2b2f38');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);
  const nodeCircles = items.map(() => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '6');
    circle.setAttribute('fill', '#2b2f38');
    circle.setAttribute('opacity', '0');
    svg.appendChild(circle);
    return circle;
  });
  let pathLength = 1;

  const updateGeometry = () => {
    const panelRect = panel.getBoundingClientRect();
    const width = panelRect.width;
    const height = panelRect.height;
    if (width === 0 || height === 0) return;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const points = items.map((item) => {
      const rect = item.getBoundingClientRect();
      return {
        x: rect.left - panelRect.left + 24,
        y: rect.top - panelRect.top + rect.height / 2,
      };
    });
    const d = points
      .map((point, index) =>
        index === 0
          ? `M${point.x} ${point.y}`
          : `C ${point.x - 40} ${point.y}, ${point.x - 40} ${points[index - 1].y}, ${point.x} ${point.y}`
      )
      .join(' ');
    path.setAttribute('d', d);
    pathLength = path.getTotalLength() || 1;
    path.setAttribute('stroke-dasharray', `${pathLength}`);
    path.setAttribute('stroke-dashoffset', `${pathLength}`);
    points.forEach((point, idx) => {
      const circle = nodeCircles[idx];
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
    });
  };

  updateGeometry();
  const onResize = () => updateGeometry();
  window.addEventListener('resize', onResize);

  const setProgress = (value) => {
    const progress = clamp(value, 0, 1);
    path.setAttribute('stroke-dashoffset', `${pathLength * (1 - progress)}`);
    nodeCircles.forEach((circle, idx) => {
      const local = clamp((progress - idx * 0.18) / 0.82, 0, 1);
      circle.setAttribute('opacity', `${local}`);
      circle.setAttribute('r', `${3 + local * 3}`);
    });
  };

  return {
    setProgress,
    dispose() {
      window.removeEventListener('resize', onResize);
    },
  };
}

export function initLogoSketch(svg) {
  if (!svg) return () => {};
  const path = svg.querySelector('path');
  if (!path) return () => {};
  const length = path.getTotalLength();
  path.setAttribute('stroke-dasharray', `${length}`);
  path.setAttribute('stroke-dashoffset', `${length}`);
  if (prefersReduced) {
    path.setAttribute('stroke-dashoffset', '0');
    return () => {};
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.25,0.8,0.25,1)';
        requestAnimationFrame(() => {
          path.setAttribute('stroke-dashoffset', '0');
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(svg);
  return () => observer.disconnect();
}

export function initHeroParticles(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = prefersReduced ? 0 : 160;
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  let animationId;
  let pointer = { x: width / 2, y: height / 2, active: false };

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  resize();

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(width, height));
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, 'rgba(255,93,162,0.18)');
    gradient.addColorStop(1, 'rgba(14,15,18,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    particles.forEach((p) => {
      updateParticle(p, width, height, pointer);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247,243,237,${0.15 + p.opacity})`;
      ctx.fill();
    });
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
      ctx.strokeStyle = `rgba(230,163,178,${0.05 + p.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    animationId = requestAnimationFrame(draw);
  };

  if (!prefersReduced) {
    animationId = requestAnimationFrame(draw);
  }

  const pointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  };

  const pointerLeave = () => {
    pointer.active = false;
  };

  window.addEventListener('resize', resize);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerleave', pointerLeave);

  return () => {
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('pointermove', pointerMove);
    canvas.removeEventListener('pointerleave', pointerLeave);
    cancelAnimationFrame(animationId);
  };
}

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6,
  };
}

function updateParticle(p, width, height, pointer) {
  const speedLimit = 0.8;
  p.x += p.vx;
  p.y += p.vy;
  if (pointer.active) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = Math.min(140 / (dist * dist), 0.18);
    p.vx += dx / dist * force;
    p.vy += dy / dist * force;
  }
  p.vx = clamp(p.vx, -speedLimit, speedLimit);
  p.vy = clamp(p.vy, -speedLimit, speedLimit);
  if (p.x < 0 || p.x > width) p.vx *= -1;
  if (p.y < 0 || p.y > height) p.vy *= -1;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function initParallax(elements = []) {
  if (!elements.length || prefersReduced) return () => {};
  const factor = 0.15;
  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    elements.forEach((el, index) => {
      const speed = factor * (index + 1);
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

export function initTrailGraphic(container) {
  if (!container) return () => {};
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 400 320');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M40 280 C 120 240 120 120 200 150 C 280 180 280 60 360 80');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'rgba(255,93,162,0.6)');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-dasharray', '600');
  path.setAttribute('stroke-dashoffset', '600');
  svg.appendChild(path);

  const nodes = [80, 160, 240, 320];
  nodes.forEach((x, i) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', 280 - i * 50);
    circle.setAttribute('r', 8);
    circle.setAttribute('fill', i % 2 === 0 ? '#ff5da2' : '#d36b52');
    circle.setAttribute('opacity', '0');
    svg.appendChild(circle);
  });

  container.innerHTML = '';
  container.appendChild(svg);

  if (prefersReduced) {
    path.setAttribute('stroke-dashoffset', '0');
    svg.querySelectorAll('circle').forEach((c) => c.setAttribute('opacity', '0.7'));
    return () => {};
  }

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const duration = 1800;
        let start = null;
        const animate = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          path.setAttribute('stroke-dashoffset', `${600 - 600 * progress}`);
          svg.querySelectorAll('circle').forEach((c, idx) => {
            const reveal = Math.max(0, progress - idx * 0.15);
            c.setAttribute('opacity', `${Math.min(reveal * 2, 0.8)}`);
          });
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(container);

  return () => observer.disconnect();
}

export function initFooterTrace(container) {
  if (!container) return () => {};
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 80');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M10 60 L40 20 L80 40 L120 10 L160 50 L190 30');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'rgba(230,163,178,0.6)');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', '260');
  path.setAttribute('stroke-dashoffset', prefersReduced ? '0' : '260');
  svg.appendChild(path);
  container.innerHTML = '';
  container.appendChild(svg);
  if (!prefersReduced) {
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.22,0.61,0.36,1)';
      path.setAttribute('stroke-dashoffset', '0');
    });
  }
  return () => {};
}

export function initLabTraces(container) {
  if (!container) return () => {};
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width, height, animationId;
  const paths = [];
  const sparks = [];

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    generatePaths();
  };

  const generatePaths = () => {
    paths.length = 0;
    sparks.length = 0;
    const branchCount = 6;
    for (let i = 0; i < branchCount; i++) {
      paths.push(createBranch(width, height, i / branchCount));
    }
    paths.forEach((branch) => {
      sparks.push({
        branch,
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.002,
      });
    });
  };

  const draw = () => {
    ctx.fillStyle = 'rgba(14,15,18,0.9)';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,93,162,0.7)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    paths.forEach((branch) => {
      ctx.beginPath();
      branch.points.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
    sparks.forEach((spark) => {
      spark.progress += spark.speed;
      if (spark.progress > 1) spark.progress = 0;
      const pos = interpolatePoints(spark.branch.points, spark.progress);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214,107,82,0.8)';
      ctx.fill();
    });
    animationId = requestAnimationFrame(draw);
  };

  resize();
  if (!prefersReduced) {
    animationId = requestAnimationFrame(draw);
  } else {
    draw();
  }

  window.addEventListener('resize', resize);

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}

function createBranch(width, height, seed) {
  const points = [];
  const steps = 40;
  let x = width * (0.1 + seed * 0.8);
  let y = height * 0.1;
  let angle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
  for (let i = 0; i < steps; i++) {
    const len = height / steps * (0.6 + Math.random() * 0.4);
    x += Math.cos(angle) * len;
    y += Math.sin(angle) * len;
    angle += (Math.random() - 0.5) * 0.6;
    points.push({ x, y });
  }
  return { points };
}

function interpolatePoints(points, t) {
  const total = points.length - 1;
  const pos = t * total;
  const idx = Math.floor(pos);
  const frac = pos - idx;
  const a = points[idx % total];
  const b = points[(idx + 1) % total];
  return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
}

export function initVectorField(container) {
  if (!container) return () => {};
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width, height, animationId;
  let pointer = { x: 0, y: 0, active: false };

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };

  const field = (x, y) => {
    const nx = (x / width) * 2 - 1;
    const ny = (y / height) * 2 - 1;
    const angle = Math.sin(nx * Math.PI * 2) + Math.cos(ny * Math.PI * 2);
    const mag = 0.4 + Math.sin((nx + ny) * Math.PI) * 0.3;
    return { angle, mag };
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(14,15,18,0.9)';
    ctx.fillRect(0, 0, width, height);
    const step = 32;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        const { angle, mag } = field(x, y);
        const px = Math.cos(angle) * mag * step;
        const py = Math.sin(angle) * mag * step;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + px, y + py);
        ctx.strokeStyle = 'rgba(255,93,162,0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
    if (pointer.active) {
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(214,107,82,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    animationId = requestAnimationFrame(draw);
  };

  resize();
  if (!prefersReduced) {
    animationId = requestAnimationFrame(draw);
  } else {
    draw();
  }

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
  };

  const onPointerLeave = () => {
    pointer.active = false;
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', resize);

  return () => {
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}

export function initBrushOverlay(container) {
  if (!container) return () => {};
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width, height;
  let trails = [];
  let animationId;

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };

  const addTrail = (x, y) => {
    trails.push({ x, y, life: 1 });
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    trails = trails.filter((trail) => trail.life > 0);
    trails.forEach((trail) => {
      trail.life -= 0.02;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 12 * trail.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,93,162,${trail.life * 0.4})`;
      ctx.fill();
    });
    animationId = requestAnimationFrame(draw);
  };

  resize();
  if (!prefersReduced) {
    animationId = requestAnimationFrame(draw);
  } else {
    ctx.fillStyle = 'rgba(255,93,162,0.12)';
    ctx.fillRect(0, 0, width, height);
  }
  window.addEventListener('resize', resize);

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    addTrail(event.clientX - rect.left, event.clientY - rect.top);
  };

  container.addEventListener('pointermove', onPointerMove);

  return () => {
    window.removeEventListener('resize', resize);
    container.removeEventListener('pointermove', onPointerMove);
    if (animationId) cancelAnimationFrame(animationId);
  };
}

export function initOrnamentMorph(targets = []) {
  if (!targets.length || prefersReduced) return () => {};
  const states = [
    'M10 20 h60 v20 h-60z',
    'M20 15 h40 l20 25 -20 25 h-40z',
    'M15 15 h50 v50 h-50z',
  ];
  let index = 0;
  const interval = setInterval(() => {
    index = (index + 1) % states.length;
    targets.forEach((svg) => {
      const path = svg.querySelector('path');
      if (path) {
        path.setAttribute('d', states[index]);
      }
    });
  }, 2200);
  return () => clearInterval(interval);
}
