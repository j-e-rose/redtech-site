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
  { name: 'Faculty Flow', id: 'faculty-flow', image: 'facultyflow', alt: 'Faculty Flow credentialing dashboard', category: '01 / A simpler workflow', outcome: 'From credentials\nto a clear decision.', proof: 'Supporting 400+ faculty' },
  { name: 'Portfolio Engine', id: 'portfolio', image: 'portfolio', alt: 'Portfolio Engine program analytics dashboard', category: '02 / A shared view', outcome: 'The whole portfolio.\nA clearer perspective.', proof: '269 programs · 62 peer institutions' },
  { name: 'Course Evaluations', id: 'course-eval', image: 'course-eval', alt: 'Course Evaluations teaching feedback dashboard', category: '03 / More useful feedback', outcome: 'Years of feedback.\nInsights you can use.', proof: '218K responses in one experience' },
];
document.querySelector('.hero-selectors').hidden = false;
document.querySelectorAll('[data-feature]').forEach(button => {
  button.addEventListener('click', () => {
    const project = featuredProjects[Number(button.dataset.feature)];
    const image = document.getElementById('hero-image');
    image.src = `img/${project.image}.webp`;
    image.alt = project.alt;
    document.getElementById('hero-project-name').textContent = project.name;
    document.getElementById('hero-category').textContent = project.category;
    document.getElementById('hero-outcome').textContent = project.outcome;
    document.getElementById('hero-proof').textContent = project.proof;
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
  target.querySelector('details').open = true;
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
  // Observe the hero and unlisted sections too, so a previous link does not
  // remain highlighted after scrolling outside its section.
  document.querySelectorAll('main > section').forEach(section => sectionObserver.observe(section));
}
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-track]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      const eventName = link.getAttribute('href').startsWith('#') ? 'explore_click' : 'contact_click';
      window.gtag('event', eventName, { placement: link.dataset.track });
    }
  });
});

// Each route pairs a visitor's challenge with a concrete example from the portfolio.
const challengeRoutes = {
  workflows: {
    title: 'Less chasing.\nMore moving forward.',
    description: 'Bring the people, documents, and decisions into one workflow, with automation for the repetitive parts and people in control of the important ones.',
    output: 'Where work gets stuck, who needs to act, and which steps can happen automatically.',
    project: 'Faculty Flow', id: 'faculty-flow', detail: 'Credential review in one workspace', cta: 'Let’s untangle your workflow',
  },
  data: {
    title: 'A shared picture.\nA more confident decision.',
    description: 'Connect scattered reports and data sources into a clear view of what is happening, with the context your team needs to decide what comes next.',
    output: 'The decisions you need to make, the evidence behind them, and the data you can trust.',
    project: 'Portfolio Engine', id: 'portfolio', detail: '269 programs, one decision workspace', cta: 'Let’s make your data useful',
  },
  platform: {
    title: 'A system that fits\nthe way you work.',
    description: 'Shape a platform around your team’s real responsibilities, with connected records and handoffs that make sense to the people using it.',
    output: 'What to keep, what to connect, and where a custom experience would make the biggest difference.',
    project: 'Network Partner Hub', id: 'network', detail: 'Relationships and agreements, connected', cta: 'Let’s shape your platform',
  },
  strategy: {
    title: 'A big ambition.\nA practical next step.',
    description: 'Turn an open question into a shared direction for technology or learning, grounded in your mission, your people, and the resources you actually have.',
    output: 'The outcome that matters, the constraints to work within, and a first step worth taking.',
    project: 'LiFT Assessment', id: 'lift', detail: 'A ten-year vision made visible', cta: 'Let’s find a way forward',
  },
};
const challengeChoices = document.querySelector('.challenge-choices');
challengeChoices.hidden = false;
challengeChoices.addEventListener('change', event => {
  const route = challengeRoutes[event.target.value];
  if (!route) return;
  document.getElementById('finder-title').textContent = route.title;
  document.getElementById('finder-description').textContent = route.description;
  document.getElementById('finder-output').textContent = route.output;
  document.getElementById('finder-case').href = `#case-${route.id}`;
  document.getElementById('finder-case-name').textContent = `${route.project} →`;
  document.getElementById('finder-case-detail').textContent = route.detail;
  const contactLink = document.getElementById('finder-contact');
  contactLink.firstChild.textContent = `${route.cta} `;
  contactLink.dataset.interest = event.target.value;
  document.getElementById('finder-status').textContent = `${route.title.replace('\n', ' ')} See ${route.project} for a related example.`;
});

// Briefs stay in page memory. Only the visitor's email app sends the message.
const briefForm = document.getElementById('brief-form');
const briefReview = document.getElementById('brief-review');
const briefInterest = document.getElementById('brief-interest');
const briefStage = document.getElementById('brief-stage');
const briefChallenge = document.getElementById('brief-challenge');
const briefContext = document.getElementById('brief-context');
const briefText = document.getElementById('brief-text');
const briefStatus = document.getElementById('brief-status');
let relatedProject = '';
let briefEmailUrl = 'mailto:justin.edw.rose@gmail.com';
document.querySelector('.brief-builder').hidden = false;

function editBrief(focus = false) {
  briefForm.hidden = false;
  briefReview.hidden = true;
  briefStatus.textContent = '';
  if (focus) briefChallenge.focus();
}

function setProjectContext(name = '') {
  relatedProject = name;
  briefContext.hidden = !name;
  briefContext.querySelector('span').textContent = name ? `Inspired by ${name}` : '';
}

document.querySelectorAll('[data-interest], [data-engagement]').forEach(link => {
  link.href = '#brief-form';
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    editBrief();
    if (link.dataset.interest) briefInterest.value = link.dataset.interest;
    if (link.dataset.engagement) briefStage.value = link.dataset.engagement;
    setProjectContext(link.dataset.project);
    briefInterest.focus({ preventScroll: true });
  });
});
document.getElementById('clear-context').addEventListener('click', () => {
  setProjectContext();
  briefInterest.focus();
});
briefInterest.addEventListener('change', () => setProjectContext());
briefChallenge.addEventListener('input', () => {
  briefChallenge.setCustomValidity('');
  document.getElementById('brief-count').textContent = `${briefChallenge.value.length} / 600`;
});
briefForm.addEventListener('submit', event => {
  event.preventDefault();
  const challenge = briefChallenge.value.trim();
  if (!challenge) {
    briefChallenge.setCustomValidity('Add a sentence about what you would like to improve.');
    briefChallenge.reportValidity();
    return;
  }
  const topic = briefInterest.selectedOptions[0].textContent;
  const stage = briefStage.selectedOptions[0].textContent;
  const lines = [
    'Hi Justin,', '', 'I’d like to explore a project with REDTech.', '',
    `Focus: ${topic}`, `Starting point: ${stage}`,
    ...(relatedProject ? [`Portfolio reference: ${relatedProject}`] : []),
    '', 'What we’d like to improve:', challenge, '', 'Let’s talk about a useful next step.',
  ];
  const text = lines.join('\n');
  briefText.value = text;
  briefEmailUrl = `mailto:justin.edw.rose@gmail.com?subject=${encodeURIComponent(`REDTech project — ${topic}`)}&body=${encodeURIComponent(text)}`;
  briefForm.hidden = true;
  briefReview.hidden = false;
  briefStatus.textContent = '';
  document.getElementById('brief-review-title').focus({ preventScroll: true });
  document.getElementById('brief-review-title').scrollIntoView({ block: 'start', behavior: 'instant' });
});
// Keep the generated message out of link attributes, where automatic outbound
// analytics could collect it. Opening the email draft remains a visitor action.
document.getElementById('brief-email').addEventListener('click', event => {
  event.preventDefault();
  window.location.assign(briefEmailUrl);
});
document.getElementById('edit-brief').addEventListener('click', () => editBrief(true));
document.getElementById('copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(briefText.value);
    briefStatus.textContent = 'Brief copied. Paste it into an email to Justin.';
  } catch {
    briefText.focus();
    briefText.select();
    briefStatus.textContent = 'Your brief is selected. Use your device’s Copy command, then paste it into your email.';
  }
});
