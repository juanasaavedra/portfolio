import {
  initTransitions,
  animateMask,
  prepareSplitText,
  playSplitText,
  refreshReveals,
  disposeTransitions,
  isMotionReduced,
} from './modules/transitions.js';
import {
  initFooterTrace,
  initLabTraces,
  initVectorField,
  initBrushOverlay,
  initHeroMicrocard,
  initCableNetwork,
  initProcessLine,
  initLogoSketch,
} from './modules/canvasFx.js';
import { initAudioVisualizer } from './modules/audioViz.js';

const siteData = {
  heroSubtitle:
    'Prototipo productos digitales con precisión técnica, sensibilidad editorial y datos que cuentan historias.',
  services: [
    {
      title: 'UX Research & Strategy',
      bullets: [
        'Investigación con hipótesis verificables',
        'Modelos de oportunidad + priorización',
        'KPIs accionables para negocio y equipo',
      ],
    },
    {
      title: 'UI / Design Systems',
      bullets: [
        'Tokens y componentes escalables',
        'Accesibilidad AA/AAA integrada',
        'Documentación viva con métricas',
      ],
    },
    {
      title: 'Frontend (React/Next)',
      bullets: [
        'Interfaces performantes orientadas a datos',
        'Integraciones limpias con APIs y CMS',
        'CI/CD con observabilidad y testing visual',
      ],
    },
    {
      title: 'Creative Coding',
      bullets: [
        'Visualizaciones científicas en tiempo real',
        'Shader art y microinteracciones WebGL',
        'Experiencias inmersivas controladas por data',
      ],
    },
  ],
  manifesto:
    'Trabajo con ingeniería visual: mezclo matemáticas aplicadas, narrativas de producto y prototipado de alta fidelidad para reducir incertidumbre y aumentar el impacto de cada release.',
  process: [
    'Descubrimiento → alineamos visión, métricas y necesidades reales.',
    'Research → sintetizamos hallazgos en mapas accionables.',
    'Prototipo → generamos experiencias testables con data real.',
    'Desarrollo → shippeamos con calidad de producción y escalabilidad.',
    'QA / Handoff → documentación viva, soporte y medición continua.',
  ],
  about:
    'Ingeniera electrónica convertida en diseñadora y frontend lead. He acompañado a scaleups de ciencia de datos, fintechs y equipos de innovación para construir productos con claridad y propósito.',
  skills: ['UX Research', 'Product Strategy', 'React/Next', 'TypeScript', 'Tailwind', 'Creative Coding', 'Data Viz', 'Prototipado'],
  logos: ['Latent Lab', 'Satelital', 'NeuroFlux', 'Aster Fintech', 'Museo Tech'],
  works: [
    {
      title: 'Panel de analítica conversacional',
      tags: ['Data', 'R3F', 'UX'],
      summary: 'Visualización tridimensional para entender la intención en tiempo real.',
      slug: 'analitica-conversacional',
      impact: '↑32% activación de dashboards',
    },
    {
      title: 'Design system accesible AA+',
      tags: ['UI', 'A11y'],
      summary: 'Sistema modular con tokens y pruebas automáticas.',
      slug: 'design-system-aa',
      impact: '↓45% tiempo de handoff',
    },
    {
      title: 'Simulador de IA explicable',
      tags: ['IA', 'Viz'],
      summary: 'Interpretabilidad con flujos narrativos y métricas auditables.',
      slug: 'simulador-ia',
      impact: '↑28% confianza en modelos',
    },
    {
      title: 'Experiencia inmersiva de onboarding',
      tags: ['Motion', 'Frontend'],
      summary: 'Microinteracciones suaves y guía narrativa audiovisual.',
      slug: 'onboarding-inmersivo',
      impact: '↑50% finalización de onboarding',
    },
    {
      title: 'Laboratorio de finanzas creativas',
      tags: ['Product', 'Research'],
      summary: 'Workshops con prototipos interactivos y métricas en vivo.',
      slug: 'finanzas-creativas',
      impact: '↑3x participación de stakeholders',
    },
    {
      title: 'Panel satelital de teledetección',
      tags: ['Data', 'Frontend'],
      summary: 'UI para sensores remotos con flujos de decisión claros.',
      slug: 'panel-satelital',
      impact: '↓37% tiempo de análisis',
    },
  ],
  cases: {
    'analitica-conversacional': {
      title: 'Panel de analítica conversacional',
      summary: 'Visualización inmersiva de conversaciones para detectar oportunidades de negocio en minutos.',
      impact: '↑32% activación de dashboards',
      problem:
        'Los equipos de producto no podían entender la intención de las conversaciones sin invertir horas revisando logs complejos.',
      process:
        'Mapeamos journeys de analistas, definimos métricas accionables y prototipamos escenarios con datos reales.',
      solution:
        'Construí un panel 3D con R3F donde cada punto representa clusters de intención. Se integró con filtros semánticos y storytelling asistido.',
      impactDetail:
        'Los analistas pasan de horas a minutos para detectar señales, y la conversión hacia acciones recomendadas creció un 18%.',
      galleries: {
        process: ['Primeros bocetos de flujo', 'Mapa de intención segmentado'],
        solution: ['Visual 3D final', 'UI responsive con modo oscuro'],
      },
    },
    'design-system-aa': {
      title: 'Design system accesible AA+',
      summary: 'Tokens, componentes y automatización para asegurar accesibilidad desde el diseño hasta el código.',
      impact: '↓45% tiempo de handoff',
      problem:
        'La plataforma escalaba sin consistencia visual ni garantías de accesibilidad, generando retrabajo constante.',
      process:
        'Audité componentes existentes, definí un set de tokens y armé librerías sincronizadas entre Figma y el repositorio.',
      solution:
        'Desarrollé componentes web accesibles con pruebas automatizadas y documentación narrativa con ejemplos de uso.',
      impactDetail:
        'El equipo liberó nuevas features en menos tiempo y con 0 bugs críticos de accesibilidad en auditorías externas.',
      galleries: {
        process: ['Auditoría de componentes', 'Flujo de tokens'],
        solution: ['Documentación viva', 'Pruebas automatizadas'],
      },
    },
    'simulador-ia': {
      title: 'Simulador de IA explicable',
      summary: 'Explicamos modelos de IA con visualizaciones que cuentan la historia detrás de cada decisión.',
      impact: '↑28% confianza en modelos',
      problem:
        'Stakeholders desconfiaban del modelo por falta de transparencia en las predicciones.',
      process:
        'Investigamos expectativas, definimos narrativas y creamos prototipos interactivos con ejemplos reales.',
      solution:
        'Implementé un simulador con visualizaciones comparativas, sensibilidad de variables y explicaciones naturales.',
      impactDetail:
        'Los stakeholders comprendieron en minutos los sesgos y mejoraron sus decisiones en campañas clave.',
      galleries: {
        process: ['Mapa de actores', 'Flows interactivos'],
        solution: ['Exploración de sensibilidad', 'Pantallas finales'],
      },
    },
    'onboarding-inmersivo': {
      title: 'Experiencia inmersiva de onboarding',
      summary: 'Guía multisensorial con narrativa audiovisual para acelerar la adopción.',
      impact: '↑50% finalización de onboarding',
      problem:
        'Los usuarios abandonaban el onboarding por falta de claridad y motivación.',
      process:
        'Analicé métricas de abandono, conduje entrevistas y definí hitos emocionales.',
      solution:
        'Diseñé interacciones suaves con capas de audio, microcopys y misiones dinámicas.',
      impactDetail:
        'El flujo redujo fricción y generó un incremento sostenido en retención temprana.',
      galleries: {
        process: ['Mapa emocional', 'Wireflows gamificados'],
        solution: ['Mockups finales', 'Guía de microinteracciones'],
      },
    },
    'finanzas-creativas': {
      title: 'Laboratorio de finanzas creativas',
      summary: 'Experiencia colaborativa con prototipos para evaluar modelos de negocio.',
      impact: '↑3x participación de stakeholders',
      problem:
        'Los equipos no conseguían alinear ideas financieras con propuestas de valor tangibles.',
      process:
        'Diseñé workshops con prototipos cuantitativos y tableros colaborativos.',
      solution:
        'Implementé un laboratorio digital con escenarios simulados y métricas compartidas.',
      impactDetail:
        'Las decisiones estratégicas se aceleraron gracias a la claridad de los resultados proyectados.',
      galleries: {
        process: ['Tableros de co-creación', 'Iteraciones de user testing'],
        solution: ['Panel final', 'Plantillas de experimentos'],
      },
    },
    'panel-satelital': {
      title: 'Panel satelital de teledetección',
      summary: 'Control de sensores remotos con insights inmediatos para agritech.',
      impact: '↓37% tiempo de análisis',
      problem:
        'Los científicos analizaban datos en herramientas dispares sin correlaciones claras.',
      process:
        'Entrevisté analistas, definí estructuras de datos y prototipé flujos multi-dispositivo.',
      solution:
        'Construí un panel geoespacial con capas comparativas y alertas inteligentes.',
      impactDetail:
        'El tiempo de respuesta ante anomalías se redujo a la mitad y se habilitaron decisiones en terreno.',
      galleries: {
        process: ['Mapa de datos', 'Flows responsivos'],
        solution: ['Vista geoespacial', 'Panel de alertas'],
      },
    },
  },
  labIntro:
    'El laboratorio es un espacio vivo para experimentar con trazas electrónicas, visualizaciones vectoriales y audio reactivo. Cada demo explora nuevas formas de narrar datos y sensaciones.',
};

let cleanupFns = [];
let lightboxState = { pointer: 0, items: [], order: [] };
let lightboxBound = false;
const scrollMemory = new Map();
let scrollStoryCleanup = null;

document.addEventListener('DOMContentLoaded', () => {
  initTransitions();
  setupRouter();
  setupHeaderGlass();
  setupCursor();
  document.body.dataset.motion = isMotionReduced() ? 'reduced' : 'active';
  hydratePage(document);
  if (!isMotionReduced()) {
    animateInitialMask();
  }
});

function animateInitialMask() {
  const mask = document.querySelector('.page-mask');
  if (!mask) return;
  
  // Start with full circle
  mask.style.setProperty('--hero-mask-circle', '100%');
  mask.style.opacity = '1';
  
  // Animate to 0 after a brief delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mask.style.setProperty('--hero-mask-circle', '0%');
      setTimeout(() => {
        mask.style.opacity = '0';
      }, 800);
    });
  });
}

function hydratePage(rootDoc) {
  cleanupFns.forEach((fn) => fn && fn());
  cleanupFns = [];
  disposeTransitions();
  prepareSplitText(document);
  playSplitText(document, 120);
  refreshReveals(document);
  setupMagneticButtons();
  setupLightbox();
  populateCommon();

  const view = document.body.dataset.view;
  if (view === 'home') {
    populateHome();
  }
  if (view === 'case') {
    populateCase();
  }
  if (view === 'lab') {
    populateLab();
  }
  rebindRouterLinks();
}

function populateCommon() {
  const yearTarget = document.querySelectorAll('[data-current-year]');
  yearTarget.forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  const footerTrace = document.querySelectorAll('[data-footer-trace]');
  footerTrace.forEach((el) => cleanupFns.push(initFooterTrace(el)));
}

function populateHome() {
  const subtitle = document.querySelector('[data-content="heroSubtitle"]');
  if (subtitle) subtitle.textContent = siteData.heroSubtitle;
  document.title = 'Juana Saavedra — Portfolio';

  const servicesContainer = document.querySelector('[data-services]');
  if (servicesContainer) {
    servicesContainer.innerHTML = '';
    siteData.services.forEach((service, index) => {
      const card = document.createElement('article');
      card.className = 'service-card';
      card.innerHTML = `
        <h3>${service.title}${buildServiceSymbol(index)}</h3>
        <ul>${service.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>
      `;
      servicesContainer.appendChild(card);
    });
  }

  const worksContainer = document.querySelector('[data-works]');
  const filtersContainer = document.querySelector('[data-filters]');
  let workCards = [];
  if (worksContainer && filtersContainer) {
    workCards = buildWorkShowcase(worksContainer, filtersContainer);
  }

  const manifesto = document.querySelector('[data-content="manifesto"]');
  if (manifesto) manifesto.textContent = siteData.manifesto;
  const processList = document.querySelector('[data-process]');
  if (processList) {
    processList.innerHTML = '';
    siteData.process.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      processList.appendChild(li);
    });
  }

  const about = document.querySelector('[data-content="about"]');
  if (about) about.textContent = siteData.about;
  const skills = document.querySelector('[data-skills]');
  if (skills) {
    skills.innerHTML = '';
    siteData.skills.forEach((skill) => {
      const chip = document.createElement('span');
      chip.className = 'skill-chip';
      chip.textContent = skill;
      skills.appendChild(chip);
    });
  }
  const logos = document.querySelector('[data-logos]');
  const logoControllers = [];
  if (logos) {
    logos.innerHTML = '';
    siteData.logos.forEach((logo) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'logo-pill';
      wrapper.innerHTML = `<span class="logo-label">${logo}</span>${buildLogoSketch(logo)}`;
      logos.appendChild(wrapper);
      const svg = wrapper.querySelector('svg');
      if (svg) {
        logoControllers.push(initLogoSketch(svg));
      }
    });
  }

  // New hero SVG animation setup
  const heroSvg = document.querySelector('.micro-svg');
  const heroController = heroSvg ? initHeroSvgAnimation(heroSvg) : null;
  if (heroController && heroController.dispose) {
    cleanupFns.push(() => heroController.dispose());
  }

  const processPanel = document.querySelector('.process-panel');
  const processController = processPanel ? initProcessLine(processPanel) : null;
  if (processController) {
    cleanupFns.push(() => processController.dispose());
  }

  cleanupFns.push(() => {
    logoControllers.forEach((dispose) => dispose && dispose());
  });

  setupContactForm();

  if (scrollStoryCleanup) {
    scrollStoryCleanup();
    scrollStoryCleanup = null;
  }
  scrollStoryCleanup = setupScrollStory({
    microcard: heroController,
    process: processController,
    workCards,
  });
  if (scrollStoryCleanup) {
    cleanupFns.push(scrollStoryCleanup);
  }
}

function populateCase() {
  const params = new URLSearchParams(window.location.search);
  let slug = params.get('case');
  if (!slug) {
    // fallback to first case
    slug = Object.keys(siteData.cases)[0];
  }
  const data = siteData.cases[slug];
  if (!data) return;
  const title = document.getElementById('case-title');
  const summary = document.querySelector('[data-case="summary"]');
  const impact = document.querySelector('[data-case="impact"]');
  document.title = `${data.title} — Juana Saavedra`;
  if (title) title.textContent = data.title;
  if (summary) summary.textContent = data.summary;
  if (impact) impact.textContent = data.impact;
  ['problem', 'process', 'solution', 'impact'].forEach((key) => {
    const block = document.querySelector(`[data-case-block="${key}"]`);
    if (block) {
      const paragraph = block.querySelector('p');
      if (paragraph) {
        paragraph.textContent = key === 'impact' ? data.impactDetail : data[key];
      }
    }
  });
  Object.entries(data.galleries).forEach(([kind, items]) => {
    const gallery = document.querySelector(`[data-gallery="${kind}"]`);
    if (gallery) {
      gallery.innerHTML = '';
      items.forEach((item) => {
        const panel = document.createElement('div');
        panel.className = 'work-thumb';
        panel.setAttribute('role', 'img');
        panel.setAttribute('aria-label', item);
        panel.innerHTML = `<span>${item}</span>`;
        gallery.appendChild(panel);
      });
    }
  });
}

function populateLab() {
  const intro = document.querySelector('[data-content="labIntro"]');
  if (intro) intro.textContent = siteData.labIntro;
  document.title = 'Lab creativo — Juana Saavedra';
  const tracesContainer = document.querySelector('[data-traces-canvas]');
  if (tracesContainer) cleanupFns.push(initLabTraces(tracesContainer));
  const fieldContainer = document.querySelector('[data-field-canvas]');
  if (fieldContainer) cleanupFns.push(initVectorField(fieldContainer));
  const audioContainer = document.querySelector('[data-audio-canvas]');
  const audioUpload = document.querySelector('[data-audio-upload]');
  const audioToggle = document.querySelector('[data-audio-toggle]');
  if (audioContainer && audioUpload && audioToggle) {
    cleanupFns.push(initAudioVisualizer(audioContainer, audioUpload, audioToggle));
  }
  const brushTargets = document.querySelectorAll('.lab-demo .lab-canvas');
  brushTargets.forEach((target) => {
    cleanupFns.push(initBrushOverlay(target));
  });
}

function buildWorkShowcase(worksContainer, filtersContainer) {
  worksContainer.innerHTML = '';
  filtersContainer.innerHTML = '';
  const tags = new Set();
  siteData.works.forEach((work) => work.tags.forEach((tag) => tags.add(tag)));
  const tagList = ['Todos', ...Array.from(tags)];
  const cards = [];

  const updateFilter = (selected, activeButton) => {
    filtersContainer
      .querySelectorAll('.filter-chip')
      .forEach((btn) => btn.setAttribute('aria-pressed', btn === activeButton ? 'true' : 'false'));
    const visibleOrder = [];
    worksContainer.scrollTo({ left: 0, behavior: 'smooth' });
    cards.forEach((card) => {
      const cardTags = card.dataset.tags.split(',');
      const match = selected === 'Todos' || cardTags.includes(selected);
      card.style.display = match ? 'grid' : 'none';
      if (match) {
        visibleOrder.push(Number(card.dataset.index));
      }
    });
    lightboxState.order = visibleOrder.length ? visibleOrder : siteData.works.map((_, idx) => idx);
    lightboxState.pointer = 0;
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  };

  tagList.forEach((tag, index) => {
    const button = document.createElement('button');
    button.className = 'filter-chip';
    button.type = 'button';
    button.textContent = tag;
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    button.addEventListener('click', () => updateFilter(tag, button));
    filtersContainer.appendChild(button);
  });

  siteData.works.forEach((work, index) => {
    const tone = index % 2 === 1 ? 'warm' : 'cool';
    const card = document.createElement('article');
    card.className = 'work-card';
    if (tone === 'warm') card.dataset.tone = 'warm';
    card.dataset.index = index;
    card.dataset.tags = work.tags.join(',');
    card.innerHTML = `
      <div class="work-head">
        <div class="work-thumb" data-lightbox-trigger="${index}" tabindex="0" role="button" aria-label="${work.title}"></div>
        <span class="work-impact">${work.impact}</span>
      </div>
      <h3 class="work-title" data-split="line">${work.title}</h3>
      <div class="work-tags">${work.tags
        .map((tag) => `<span class="tag-chip">${tag}</span>`)
        .join('')}</div>
      <p class="work-summary">${work.summary}</p>
      <div class="work-meta">
        <span>${work.impact}</span>
        <a class="btn btn-ghost" href="case.html?case=${work.slug}" data-router-link>Ver caso ↗</a>
      </div>
    `;
    worksContainer.appendChild(card);
    cards.push(card);
  });

  lightboxState.items = siteData.works.map((work) => ({
    title: work.title,
    summary: work.summary,
    impact: work.impact,
  }));
  lightboxState.order = siteData.works.map((_, idx) => idx);
  const firstButton = filtersContainer.querySelector('.filter-chip');
  if (firstButton) {
    updateFilter('Todos', firstButton);
  }
  return cards;
}

function buildServiceSymbol(index) {
  const icons = [
    `<span class="service-symbol" aria-hidden="true"><svg viewBox="0 0 48 32"><path d="M2 16h10l4-8 4 16 4-16 4 16 4-16 4 8h10" /></svg></span>`,
    `<span class="service-symbol" aria-hidden="true"><svg viewBox="0 0 48 32"><path d="M4 6v20l12-10 12 10V6" /><path d="M28 6l12 10-12 10" /></svg></span>`,
    `<span class="service-symbol" aria-hidden="true"><svg viewBox="0 0 48 32"><path d="M4 16h12l4-8h8l4 8h12" /><path d="M24 8v16" /></svg></span>`,
    `<span class="service-symbol" aria-hidden="true"><svg viewBox="0 0 48 32"><path d="M4 26V6h12l8 10 8-10h12v20H32l-8-10-8 10z" /></svg></span>`,
  ];
  return icons[index % icons.length];
}

function buildLogoSketch(label) {
  return `
    <svg viewBox="0 0 140 48" role="img" aria-label="${label}">
      <title>${label}</title>
      <path d="M12 30 C28 10 40 10 56 30 S88 50 104 30 128 10 132 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="220" stroke-dashoffset="220" />
    </svg>
  `;
}

function initHeroSvgAnimation(svg) {
  if (!svg) return {};
  
  const prefersReduced = isMotionReduced();
  const cables = Array.from(svg.querySelectorAll('[data-cable]'));
  const charges = Array.from(svg.querySelectorAll('[data-charge]'));
  
  if (!cables.length) {
    return {};
  }

  // Compute path lengths and set stroke-dasharray
  const lengths = cables.map((path) => path.getTotalLength());
  cables.forEach((path, idx) => {
    const length = lengths[idx];
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = prefersReduced ? '0' : `${length}`;
    path.style.setProperty('--hero-cable-length', `${length}`);
  });

  let cableProgress = prefersReduced ? 1 : 0;
  let chipScale = 1;
  let loopProgress = 0;
  let rafId = null;

  // Charge animation speeds (different speeds for variety)
  const chargeSpeeds = [0.003, 0.0025, 0.0035, 0.004, 0.0028];

  const updateCharges = () => {
    if (prefersReduced) {
      // Place charges statically at path starts
      charges.forEach((circle, idx) => {
        const path = cables[idx % cables.length];
        const point = path.getPointAtLength(0);
        circle.style.transform = `translate(${point.x}px, ${point.y}px)`;
      });
      return;
    }

    charges.forEach((circle, idx) => {
      const path = cables[idx % cables.length];
      const length = lengths[idx % lengths.length];
      const speed = chargeSpeeds[idx % chargeSpeeds.length];
      const travel = (loopProgress * speed * 100 + idx * 0.2) % 1;
      const distance = length * travel * Math.min(cableProgress * 1.5, 1);
      const point = path.getPointAtLength(distance);
      circle.style.transform = `translate(${point.x}px, ${point.y}px)`;
    });
  };

  const tick = () => {
    loopProgress = (loopProgress + 1) % 1000;
    updateCharges();
    rafId = requestAnimationFrame(tick);
  };

  const setCableProgress = (value) => {
    cableProgress = clamp(value, 0, 1);
    svg.style.setProperty('--hero-cable-progress', cableProgress);
    updateCharges();
  };

  const setChipScale = (value) => {
    chipScale = clamp(value, 0.96, 1);
    svg.style.setProperty('--chip-scale', chipScale);
  };

  const setParallax = (value) => {
    if (prefersReduced) return;
    const offset = lerp(-8, 8, value);
    svg.style.transform = `translateY(${offset}px)`;
  };

  const dispose = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // Initialize
  if (prefersReduced) {
    setCableProgress(1);
    updateCharges();
  } else {
    tick();
  }

  return {
    setCableProgress,
    setChipScale,
    setParallax,
    dispose,
  };
}

function setupScrollStory({ microcard, process, workCards }) {
  const heroStage = document.querySelector('.hero-stage');
  const servicesStage = document.querySelector('.services-stage');
  const projectsStage = document.querySelector('.projects-stage');
  const manifestoStage = document.querySelector('.manifesto-stage');
  const contactStage = document.querySelector('.contact-stage');
  const worksCarousel = document.querySelector('.works-carousel');
  const cableContainer = document.querySelector('[data-cable-network]');

  if (isMotionReduced()) {
    applyScrollState(1, {
      microcard,
      process,
      heroStage,
      servicesStage,
      projectsStage,
      manifestoStage,
      contactStage,
      worksCarousel,
      workCards,
      cableController: null,
      silent: true,
    });
    return () => {};
  }

  const cableController = initCableNetwork(cableContainer, workCards || []);
  let targetProgress = 0;
  let currentProgress = 0;
  let velocity = 0;
  const stiffness = 0.16;
  const damping = 0.82;
  let rafId = null;

  const applyContext = {
    microcard,
    process,
    heroStage,
    servicesStage,
    projectsStage,
    manifestoStage,
    contactStage,
    worksCarousel,
    workCards,
    cableController,
    silent: false,
  };

  const update = () => {
    const delta = targetProgress - currentProgress;
    velocity += delta * stiffness;
    velocity *= damping;
    currentProgress += velocity;
    if (Math.abs(delta) < 0.0001 && Math.abs(velocity) < 0.0001) {
      currentProgress = targetProgress;
      velocity = 0;
    }
    applyScrollState(currentProgress, applyContext);
    rafId = requestAnimationFrame(update);
  };

  const recalc = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = maxScroll <= 0 ? 0 : clamp(window.scrollY / maxScroll, 0, 1);
  };

  const onScroll = () => {
    recalc();
  };

  const onResize = () => {
    recalc();
    cableController?.refresh?.();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  recalc();
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (rafId) cancelAnimationFrame(rafId);
    cableController?.dispose?.();
  };
}

function applyScrollState(progress, context) {
  const {
    microcard,
    process,
    heroStage,
    servicesStage,
    projectsStage,
    manifestoStage,
    contactStage,
    worksCarousel,
    workCards,
    cableController,
    silent,
  } = context;
  const eased = (start, end) => clamp((progress - start) / (end - start), 0, 1);

  const heroMaskProgress = eased(0, 0.1);
  if (heroStage) {
    const maskEase = easeInOut(heroMaskProgress);
    const width = lerp(140, 38, maskEase);
    const height = lerp(140, 52, maskEase);
    heroStage.style.setProperty('--hero-mask-width', `${width}%`);
    heroStage.style.setProperty('--hero-mask-height', `${height}%`);
    const fade = clamp((progress - 0.12) / 0.1, 0, 1);
    heroStage.style.setProperty('--hero-mask-opacity', `${1 - fade}`);
  }
  
  // Cable progress and chip scale
  microcard?.setCableProgress?.(easeInOut(heroMaskProgress));
  const chipScaleProgress = eased(0.05, 0.15);
  const chipScale = lerp(1, 0.98, easeOut(chipScaleProgress));
  microcard?.setChipScale?.(chipScale);
  
  // Parallax
  const parallaxProgress = eased(0, 0.3);
  microcard?.setParallax?.(parallaxProgress);

  // Reveal subtitle and CTAs
  const revealProgress = eased(0.08, 0.18);
  const heroSub = document.querySelector('.hero-sub');
  const heroActions = document.querySelector('.hero-actions');
  if (heroSub) {
    const subEase = easeOut(revealProgress);
    heroSub.style.opacity = subEase;
    heroSub.style.transform = `translateY(${lerp(16, 0, subEase)}px)`;
    heroSub.style.filter = `blur(${lerp(6, 0, subEase)}px)`;
  }
  if (heroActions) {
    const actionsEase = easeOut(clamp(revealProgress - 0.12, 0, 1) / 0.88);
    heroActions.style.opacity = actionsEase;
    heroActions.style.transform = `translateY(${lerp(16, 0, actionsEase)}px)`;
    heroActions.style.filter = `blur(${lerp(6, 0, actionsEase)}px)`;
  }

  if (servicesStage) {
    const servicesProgress = easeInOut(eased(0.25, 0.45));
    const cards = Array.from(servicesStage.querySelectorAll('.service-card'));
    cards.forEach((card, idx) => {
      const local = clamp((servicesProgress - idx * 0.12) / 0.88, 0, 1);
      const translate = lerp(24, 0, easeOut(local));
      const tilt = lerp(-4, 0, easeOut(local));
      card.style.opacity = local;
      card.style.setProperty('--service-translate', `${translate}px`);
      card.style.setProperty('--service-tilt', `${tilt}deg`);
      card.classList.toggle('is-active', local > 0.55);
    });
  }

  if (projectsStage && worksCarousel) {
    const projectsProgress = easeInOut(eased(0.45, 0.75));
    const maxScroll = worksCarousel.scrollWidth - worksCarousel.clientWidth;
    if (maxScroll > 0 && !silent) {
      worksCarousel.scrollLeft = maxScroll * projectsProgress;
    }
    if (Math.abs(projectsProgress - (context.lastProjectsProgress ?? -1)) > 0.001) {
      cableController?.refresh?.();
      context.lastProjectsProgress = projectsProgress;
    }
    const viewportCenter = worksCarousel.getBoundingClientRect().left + worksCarousel.clientWidth / 2;
    let focusIndex = -1;
    (workCards || []).forEach((card, idx) => {
      if (card.style.display === 'none') {
        card.classList.remove('is-focused');
        card.style.setProperty('--story-offset', '0px');
        return;
      }
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - viewportCenter);
      const normalized = clamp(1 - distance / (worksCarousel.clientWidth / 2), 0, 1);
      const lift = normalized > 0.2 ? -lerp(12, 0, easeInOut(normalized)) : 0;
      card.style.setProperty('--story-offset', `${lift}px`);
      card.classList.toggle('is-focused', normalized > 0.65);
      if (normalized > 0.65) focusIndex = idx;
    });
    cableController?.update?.(focusIndex);
  }

  if (manifestoStage) {
    const manifestoProgress = easeInOut(eased(0.75, 0.9));
    manifestoStage.style.opacity = manifestoProgress;
    manifestoStage.style.transform = `translateY(${lerp(48, 0, manifestoProgress)}px)`;
    manifestoStage.style.filter = `blur(${lerp(6, 0, manifestoProgress)}px)`;
    process?.setProgress?.(manifestoProgress);
  }

  if (contactStage) {
    const contactProgress = easeInOut(eased(0.9, 1));
    contactStage.style.opacity = contactProgress;
    contactStage.style.transform = `translateY(${lerp(60, 0, contactProgress)}px)`;
    contactStage.style.filter = `blur(${lerp(6, 0, contactProgress)}px)`;
  }
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function setupLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  const visual = lightbox.querySelector('#lightbox-visual');
  const title = lightbox.querySelector('#lightbox-title');
  const desc = lightbox.querySelector('#lightbox-desc');

  const getOrder = () => (lightboxState.order.length ? lightboxState.order : lightboxState.items.map((_, idx) => idx));

  const showCurrent = () => {
    const order = getOrder();
    if (!order.length) return;
    const itemIndex = order[lightboxState.pointer] ?? 0;
    const item = lightboxState.items[itemIndex];
    if (!item) return;
    title.textContent = item.title;
    desc.textContent = `${item.summary} · ${item.impact}`;
    visual.style.setProperty('--current-index', itemIndex);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const open = (index) => {
    if (!lightboxState.items.length) return;
    const order = getOrder();
    const pointer = order.indexOf(index);
    lightboxState.pointer = pointer > -1 ? pointer : 0;
    showCurrent();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const move = (step) => {
    const order = getOrder();
    if (!order.length) return;
    lightboxState.pointer = (lightboxState.pointer + step + order.length) % order.length;
    showCurrent();
  };

  const next = () => move(1);

  const prev = () => move(-1);

  if (!lightboxBound) {
    lightboxBound = true;
    document.body.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-lightbox-trigger]');
      if (trigger) {
        event.preventDefault();
        const index = Number(trigger.dataset.lightboxTrigger);
        open(index);
        return;
      }
      if (event.target.closest('.lightbox-close')) {
        close();
      }
      if (event.target.closest('.lightbox-next')) {
        event.preventDefault();
        next();
      }
      if (event.target.closest('.lightbox-prev')) {
        event.preventDefault();
        prev();
      }
      if (event.target === lightbox) {
        close();
      }
    });

    document.body.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    });
  }
}

function setupRouter() {
  document.body.addEventListener('click', async (event) => {
    const link = event.target.closest('a[data-router-link]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    const url = new URL(href, window.location.origin);
    if (link.target === '_blank' || url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) {
      return;
    }
    event.preventDefault();
    await navigateTo(url.href, true);
  });

  window.addEventListener('popstate', async () => {
    await navigateTo(window.location.href, false);
  });
}

async function navigateTo(href, push = true) {
  const url = new URL(href, window.location.origin);
  const currentKey = window.location.pathname + window.location.hash;
  scrollMemory.set(currentKey, window.scrollY);
  if (url.pathname === window.location.pathname && url.hash === window.location.hash) {
    if (url.hash) {
      const target = document.querySelector(url.hash);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }
  try {
    if (!isMotionReduced()) {
      await animateMask('out');
    }
    const response = await fetch(url.pathname + url.search);
    if (!response.ok) {
      window.location.href = url.href;
      return;
    }
    const text = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(text, 'text/html');
    swapMainContent(newDoc);
    document.title = newDoc.title;
    if (push) {
      window.history.pushState({}, '', url.href);
    }
    hydratePage(document);
    const nextKey = url.pathname + url.hash;
    const storedScroll = scrollMemory.get(nextKey) || 0;
    window.scrollTo(0, url.hash ? 0 : storedScroll);
    if (url.hash) {
      const target = document.querySelector(url.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } finally {
    if (!isMotionReduced()) {
      await animateMask('in');
    }
  }
}

function swapMainContent(newDoc) {
  const newMain = newDoc.querySelector('main');
  const currentMain = document.getElementById('main');
  if (newMain && currentMain) {
    currentMain.replaceWith(newMain);
    newMain.id = 'main';
  }
  const newView = newDoc.body?.dataset?.view;
  if (newView) {
    document.body.dataset.view = newView;
  }
}

function rebindRouterLinks() {
  document.querySelectorAll('a[data-router-link]').forEach((link) => {
    if (link.href.startsWith('http') && !link.href.includes(window.location.host)) return;
  });
}

function setupHeaderGlass() {
  const header = document.querySelector('header');
  if (!header) return;
  let lastKnownScroll = 0;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-glass', lastKnownScroll > 8);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    lastKnownScroll = window.scrollY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });
}

function setupMagneticButtons() {
  const cursor = document.querySelector('.cursor');
  const magnetics = document.querySelectorAll('[data-magnetic]');
  magnetics.forEach((btn) => {
    btn.addEventListener('pointerenter', () => {
      cursor?.classList.add('is-magnetic');
    });
    btn.addEventListener('pointerleave', () => {
      cursor?.classList.remove('is-magnetic');
      btn.style.transform = '';
    });
    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      const maxOffset = 6;
      const offsetX = clamp(relX * 0.05, -maxOffset, maxOffset);
      const offsetY = clamp(relY * 0.05, -maxOffset, maxOffset);
      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
}

function setupCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  document.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-active'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-active'));
  const updateView = () => {
    if (document.body.dataset.view === 'lab') {
      cursor.classList.add('is-brush');
    } else {
      cursor.classList.remove('is-brush');
    }
  };
  const observer = new MutationObserver(updateView);
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-view'] });
  updateView();
}

function setupContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.status-message');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = form.checkValidity();
    if (!isValid) {
      status.textContent = 'Revisa los campos: faltan datos para enviar.';
      status.style.color = '#d36b52';
      form.reportValidity();
      return;
    }
    status.textContent = 'Gracias, responderé en breve.';
    status.style.color = '#ff5da2';
    form.reset();
  });
}
