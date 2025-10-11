// Ultra-Minimal Scandinavian Editorial Portfolio Script

// State
let projects = [];
let currentProject = null;
let cursorPosition = { x: 0, y: 0 };
let previewPosition = { x: 0, y: 0 };
let isPreviewVisible = false;
let activeFilters = { years: [], roles: [], client: '' };
let filteredProjects = [];
let currentFocusIndex = -1;
let previewHideTimeout = null;

// Reduced motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadProjects();
  initializeView();
  setupCursor();
  setupScrollHeader();
  updateDate();
  updateWorkCount();
  setupKeyboardNav();
  
  if (!prefersReducedMotion) {
    requestAnimationFrame(updatePreviewPosition);
  }
});

// Load projects from JSON
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    projects = await response.json();
  } catch (error) {
    console.error('Error loading projects:', error);
    projects = [];
  }
}

// Initialize view based on body data-view attribute
function initializeView() {
  const view = document.body.dataset.view;
  
  switch (view) {
    case 'archive':
      buildArchive();
      buildFilters();
      setupArchivePreview();
      setupFilters();
      break;
    case 'detail':
      buildDetail();
      setupScrollProgress();
      setupLazyLoading();
      break;
    case 'about':
      // About page is static HTML, no dynamic content needed
      break;
    case 'contact':
      // Contact page is static HTML, no dynamic content needed
      break;
  }
}

// Build Archive List
function buildArchive() {
  const archiveList = document.querySelector('[data-archive-list]');
  if (!archiveList) return;
  
  archiveList.innerHTML = '';
  
  const projectsToShow = filteredProjects.length > 0 ? filteredProjects : projects;
  
  projectsToShow.forEach((project) => {
    const row = document.createElement('a');
    row.className = 'archive-row';
    row.href = `detail.html?project=${project.slug}`;
    row.dataset.slug = project.slug;
    row.dataset.thumb = project.thumb;
    row.tabIndex = 0;
    
    row.innerHTML = `
      <div class="archive-row-title">${project.title}</div>
      <div class="archive-row-year">${project.year}</div>
      <div class="archive-row-role">${project.role}</div>
      <div class="archive-row-client">${project.client}</div>
      <div class="archive-row-duration">${project.duration}</div>
    `;
    
    archiveList.appendChild(row);
  });
}

// Build Filter Chips
function buildFilters() {
  const filterChips = document.querySelector('[data-filter-chips]');
  if (!filterChips) return;
  
  // Extract unique years and roles
  const years = [...new Set(projects.map(p => p.year))].sort().reverse();
  const roles = [...new Set(projects.flatMap(p => p.role.split(',').map(r => r.trim())))];
  
  // Build year chips
  years.forEach(year => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.dataset.type = 'year';
    chip.dataset.value = year;
    chip.textContent = year;
    filterChips.appendChild(chip);
  });
  
  // Build role chips
  roles.forEach(role => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.dataset.type = 'role';
    chip.dataset.value = role;
    chip.textContent = role;
    filterChips.appendChild(chip);
  });
}

// Setup Filter Handlers
function setupFilters() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const clientSearch = document.querySelector('[data-client-search]');
  
  // Filter initialized with all projects
  filteredProjects = [...projects];
  
  // Chip click handler
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.type;
      const value = chip.dataset.value;
      
      chip.classList.toggle('is-active');
      
      if (type === 'year') {
        const index = activeFilters.years.indexOf(value);
        if (index > -1) {
          activeFilters.years.splice(index, 1);
        } else {
          activeFilters.years.push(value);
        }
      } else if (type === 'role') {
        const index = activeFilters.roles.indexOf(value);
        if (index > -1) {
          activeFilters.roles.splice(index, 1);
        } else {
          activeFilters.roles.push(value);
        }
      }
      
      applyFilters();
    });
  });
  
  // Client search handler
  if (clientSearch) {
    clientSearch.addEventListener('input', (e) => {
      activeFilters.client = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

// Apply Filters
function applyFilters() {
  filteredProjects = projects.filter(project => {
    // Year filter
    if (activeFilters.years.length > 0 && !activeFilters.years.includes(project.year)) {
      return false;
    }
    
    // Role filter
    if (activeFilters.roles.length > 0) {
      const projectRoles = project.role.split(',').map(r => r.trim());
      const hasRole = activeFilters.roles.some(role => projectRoles.includes(role));
      if (!hasRole) return false;
    }
    
    // Client filter
    if (activeFilters.client && !project.client.toLowerCase().includes(activeFilters.client)) {
      return false;
    }
    
    return true;
  });
  
  buildArchive();
  setupArchivePreview();
  updateWorkCount();
}

// Setup Archive Preview on Hover
function setupArchivePreview() {
  if (prefersReducedMotion) return;
  
  const previewFloat = document.querySelector('[data-preview-float]');
  const archiveRows = document.querySelectorAll('.archive-row');
  
  if (!previewFloat) return;
  
  archiveRows.forEach(row => {
    row.addEventListener('mouseenter', (e) => {
      const thumb = row.dataset.thumb;
      const img = previewFloat.querySelector('img');
      
      // Clear any pending hide timeout (hysteresis)
      if (previewHideTimeout) {
        clearTimeout(previewHideTimeout);
        previewHideTimeout = null;
      }
      
      if (img) {
        // Prefetch image
        const prefetchImg = new Image();
        prefetchImg.src = thumb;
        
        img.src = thumb;
        img.alt = row.querySelector('.archive-row-title').textContent;
      }
      
      isPreviewVisible = true;
      previewFloat.classList.add('is-visible');
      
      // Update cursor
      const cursor = document.querySelector('.cursor');
      if (cursor) {
        cursor.dataset.text = 'view';
        cursor.classList.add('is-hover');
      }
    });
    
    row.addEventListener('mouseleave', () => {
      // Add hysteresis delay to avoid flicker
      previewHideTimeout = setTimeout(() => {
        isPreviewVisible = false;
        previewFloat.classList.remove('is-visible');
        
        // Reset cursor
        const cursor = document.querySelector('.cursor');
        if (cursor) {
          cursor.dataset.text = '';
          cursor.classList.remove('is-hover');
        }
      }, 100);
    });
  });
}

// Build Detail Page
function buildDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('project');
  
  if (!slug) {
    window.location.href = 'index.html';
    return;
  }
  
  currentProject = projects.find(p => p.slug === slug);
  
  if (!currentProject) {
    window.location.href = 'index.html';
    return;
  }
  
  // Update document title
  document.title = `${currentProject.title} — Juana Saavedra`;
  
  // Populate meta
  const titleEl = document.querySelector('[data-project-title]');
  const yearEl = document.querySelector('[data-project-year]');
  const roleEl = document.querySelector('[data-project-role]');
  const clientEl = document.querySelector('[data-project-client]');
  const durationEl = document.querySelector('[data-project-duration]');
  
  if (titleEl) titleEl.textContent = currentProject.title;
  if (yearEl) yearEl.textContent = currentProject.year;
  if (roleEl) roleEl.textContent = currentProject.role;
  if (clientEl) clientEl.textContent = currentProject.client;
  if (durationEl) durationEl.textContent = currentProject.duration;
  
  // Setup navigation
  const prevLink = document.querySelector('[data-prev-project]');
  const nextLink = document.querySelector('[data-next-project]');
  
  if (prevLink && currentProject.prev) {
    prevLink.href = `detail.html?project=${currentProject.prev}`;
  }
  
  if (nextLink && currentProject.next) {
    nextLink.href = `detail.html?project=${currentProject.next}`;
  }
  
  // Build gallery
  const gallery = document.querySelector('[data-detail-gallery]');
  if (gallery && currentProject.images) {
    gallery.innerHTML = '';
    
    currentProject.images.forEach((image) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.dataset.width = image.width;
      
      figure.innerHTML = `
        <img src="${image.src}" alt="${image.caption}" loading="lazy" />
        <figcaption>${image.caption}</figcaption>
      `;
      
      gallery.appendChild(figure);
    });
  }
}

// Setup Lazy Loading with IntersectionObserver
function setupLazyLoading() {
  if (prefersReducedMotion) {
    // If reduced motion, load all images immediately
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.classList.add('is-loaded');
    });
    return;
  }
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Prefetch and load image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        // Add loaded class after image loads
        if (img.complete) {
          img.classList.add('is-loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('is-loaded');
          });
        }
        
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
  
  // Observe all gallery images
  document.querySelectorAll('.gallery-item img').forEach(img => {
    imageObserver.observe(img);
  });
}

// Setup Scroll Progress Bar
function setupScrollProgress() {
  const progressBar = document.querySelector('[data-progress-bar]');
  if (!progressBar) return;
  
  let ticking = false;
  
  const updateProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // Update progress bar based on screen size
    if (window.innerWidth <= 768) {
      // Mobile: horizontal progress at bottom
      progressBar.style.width = `${scrollPercent}%`;
    } else {
      // Desktop: vertical progress on right
      progressBar.style.height = `${scrollPercent}%`;
    }
    
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', requestTick, { passive: true });
  updateProgress();
}

// Custom Cursor
function setupCursor() {
  if (prefersReducedMotion || window.innerWidth <= 768) return;
  
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  document.addEventListener('mousemove', (e) => {
    cursorPosition.x = e.clientX;
    cursorPosition.y = e.clientY;
    
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.classList.add('is-visible');
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
  });
}

// Update Preview Position with Lerp
function updatePreviewPosition() {
  const previewFloat = document.querySelector('[data-preview-float]');
  
  if (previewFloat && isPreviewVisible) {
    // Lerp for smooth following
    const lerp = (start, end, factor) => start + (end - start) * factor;
    
    previewPosition.x = lerp(previewPosition.x, cursorPosition.x, 0.15);
    previewPosition.y = lerp(previewPosition.y, cursorPosition.y, 0.15);
    
    previewFloat.style.left = `${previewPosition.x + 20}px`;
    previewFloat.style.top = `${previewPosition.y + 20}px`;
  }
  
  requestAnimationFrame(updatePreviewPosition);
}

// Scroll Header State
function setupScrollHeader() {
  const header = document.querySelector('[data-scroll-header]');
  if (!header) return;
  
  let lastScroll = 0;
  let ticking = false;
  
  const updateHeader = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 0) {
      header.dataset.scrolled = 'true';
    } else {
      delete header.dataset.scrolled;
    }
    
    lastScroll = currentScroll;
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', requestTick, { passive: true });
}

// Update Current Date
function updateDate() {
  const dateEl = document.querySelector('[data-current-date]');
  if (!dateEl) return;
  
  const now = new Date();
  const formatted = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  dateEl.textContent = formatted;
}

// Update Work Count
function updateWorkCount() {
  const countEl = document.querySelector('[data-work-count]');
  if (!countEl) return;
  
  const count = filteredProjects.length > 0 ? filteredProjects.length : projects.length;
  countEl.textContent = `${count} trabajos`;
}

// Keyboard Navigation
function setupKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    const view = document.body.dataset.view;
    
    // Archive view keyboard navigation
    if (view === 'archive') {
      const archiveRows = Array.from(document.querySelectorAll('.archive-row'));
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocusIndex = Math.min(currentFocusIndex + 1, archiveRows.length - 1);
        if (archiveRows[currentFocusIndex]) {
          archiveRows[currentFocusIndex].focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
        if (archiveRows[currentFocusIndex]) {
          archiveRows[currentFocusIndex].focus();
        }
      } else if (e.key === 'Enter' && currentFocusIndex >= 0 && archiveRows[currentFocusIndex]) {
        archiveRows[currentFocusIndex].click();
      }
    }
    
    // ESC - Go back to archive
    if (e.key === 'Escape' && view === 'detail') {
      window.location.href = 'index.html';
    }
    
    // Arrow keys for detail navigation
    if (view === 'detail' && currentProject) {
      if (e.key === 'ArrowLeft' && currentProject.prev) {
        window.location.href = `detail.html?project=${currentProject.prev}`;
      }
      if (e.key === 'ArrowRight' && currentProject.next) {
        window.location.href = `detail.html?project=${currentProject.next}`;
      }
    }
  });
  
  // Track focus on archive rows
  document.addEventListener('focus', (e) => {
    if (e.target.classList.contains('archive-row')) {
      const archiveRows = Array.from(document.querySelectorAll('.archive-row'));
      currentFocusIndex = archiveRows.indexOf(e.target);
    }
  }, true);
}

// Page Transitions (optional, for enhanced experience)
function transitionToPage(url) {
  if (prefersReducedMotion) {
    window.location.href = url;
    return;
  }
  
  const mask = document.querySelector('.page-mask');
  if (!mask) {
    window.location.href = url;
    return;
  }
  
  mask.classList.add('is-transitioning');
  
  // Random timing between 420-520ms for organic feel
  const transitionDuration = 420 + Math.random() * 100;
  
  setTimeout(() => {
    window.location.href = url;
  }, transitionDuration);
}

// Handle link clicks for transitions
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  
  if (link && link.href && link.target !== '_blank' && !e.ctrlKey && !e.metaKey) {
    const url = new URL(link.href);
    const currentUrl = new URL(window.location.href);
    
    // Only transition for same-origin links
    if (url.origin === currentUrl.origin) {
      e.preventDefault();
      transitionToPage(link.href);
    }
  }
});

// Export for use in other modules if needed
export {
  projects,
  currentProject,
  loadProjects,
  transitionToPage
};
