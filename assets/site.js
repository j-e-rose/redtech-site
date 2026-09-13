'use strict';
document.documentElement.classList.remove('no-js');

// The full portfolio, case details, contact links, and FAQs work without JavaScript.
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('nav-links');
const mobileQuery = window.matchMedia('(max-width: 760px)');

function closeMenu(returnFocus = false) {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
mobileQuery.addEventListener('change', () => closeMenu());

// User-controlled previews: no autoplay, timers, or motion required to read the hero.
const featuredProjects = [
  { name: 'Faculty Flow', id: 'faculty-flow', image: 'facultyflow', alt: 'Faculty Flow credentialing dashboard' },
  { name: 'Portfolio Engine', id: 'portfolio', image: 'portfolio', alt: 'Portfolio Engine program analytics dashboard' },
  { name: 'Course Evaluations', id: 'course-eval', image: 'course-eval', alt: 'Course Evaluations teaching feedback dashboard' },
];
document.querySelector('.hero-selectors').hidden = false;
document.querySelectorAll('[data-feature]').forEach(button => {
  button.addEventListener('click', () => {
    const project = featuredProjects[Number(button.dataset.feature)];
    const image = document.getElementById('hero-image');
    image.src = `img/${project.image}.webp`;
    image.alt = project.alt;
    document.getElementById('hero-project-name').textContent = project.name;
    document.getElementById('hero-window-label').textContent = `${project.name} / Overview`;
    ['hero-window', 'hero-project-link'].forEach(id => {
      const link = document.getElementById(id);
      link.href = `#case-${project.id}`;
      link.setAttribute('aria-label', `Explore ${project.name}`);
    });
    document.querySelectorAll('[data-feature]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    document.getElementById('feature-status').textContent = `Featured project: ${project.name}`;
  });
});

const projects = [...document.querySelectorAll('.project')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
document.querySelector('.work-toolbar').hidden = false;

function filterProjects(category) {
  let count = 0;
  projects.forEach(project => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) count++;
  });
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  document.querySelector('.filter-count').textContent = category === 'all' ? 'Showing all 5 projects' : `Showing ${count} projects`;
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));

// Preserve existing case-study URLs, including when a category has hidden a case.
function revealLinkedProject(hash, scroll = false) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target?.classList.contains('project')) return;
  if (target.hidden) filterProjects('all');
  if (scroll) target.scrollIntoView({ block: 'start', behavior: 'instant' });
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => revealLinkedProject(link.hash));
});
window.addEventListener('hashchange', () => revealLinkedProject(location.hash, true));
revealLinkedProject(location.hash, true);

// Native modal supplies focus containment, Escape, and accessible dialog semantics.
const dialog = document.querySelector('.preview-dialog');
let previewOpener;
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-preview]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      previewOpener = link;
      document.getElementById('preview-title').textContent = `${link.dataset.preview} — project preview`;
      const image = document.getElementById('preview-image');
      image.src = link.href;
      image.alt = `${link.dataset.preview} dashboard, full-size portfolio screenshot`;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('modal-open');
    });
  });
  dialog.querySelector('.preview-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    previewOpener?.focus({ preventScroll: true });
  });
}

const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  navLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-track]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'contact_click', { placement: link.dataset.track });
    }
  });
});
