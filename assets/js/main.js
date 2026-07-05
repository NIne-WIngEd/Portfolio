const D = window.PORTFOLIO_DATA;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function currentPage() {
  const page = location.pathname.split('/').pop();
  return page || 'index.html';
}

function tagList(items = []) {
  return items.map(item => `<span class="pill">${item}</span>`).join('');
}

function detailList(items = []) {
  if (!items.length) return '';
  return `<ul class="detail-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function renderNav() {
  const nav = $('[data-nav-links]');
  if (!nav) return;
  const page = currentPage();
  nav.innerHTML = D.nav.map(item => {
    const active = page === item.href ? 'active' : '';
    return `<a class="${active}" href="${item.href}">${item.label}</a>`;
  }).join('') + `<a class="resume-link" href="${D.person.resume}" target="_blank" rel="noreferrer">Resume</a>`;
}

function wireNav() {
  const btn = $('[data-nav-toggle]');
  const nav = $('[data-nav-links]');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function renderMetrics() {
  const el = $('[data-metrics]');
  if (!el) return;
  el.innerHTML = D.metrics.map(metric => `
    <article class="metric reveal">
      <strong>${metric.value}</strong>
      <span>${metric.label}</span>
      <small>${metric.context}</small>
    </article>
  `).join('');
}

function renderCapabilities() {
  const el = $('[data-capabilities]');
  if (!el) return;
  el.innerHTML = D.capabilities.map((cap, index) => `
    <article class="cap-card reveal">
      <small>${String(index + 1).padStart(2, '0')}</small>
      <h3>${cap.title}</h3>
      <p>${cap.body}</p>
      <div class="stackline">${tagList(cap.tags)}</div>
    </article>
  `).join('');
}

function renderLayers() {
  const el = $('[data-layers]');
  if (!el) return;
  el.innerHTML = D.layers.map((layer, index) => `
    <a class="layer-card reveal" href="${layer.href}">
      <small>${String(index + 1).padStart(2, '0')} · ${layer.kicker}</small>
      <h3>${layer.title}</h3>
      <p>${layer.desc}</p>
      <span>Open layer →</span>
    </a>
  `).join('');
}

function renderProjectPreview() {
  const el = $('[data-project-preview]');
  if (!el) return;
  el.innerHTML = D.projects.slice(0, 4).map(project => `
    <article class="mini-project reveal">
      <small>${project.category}</small>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="mini-impact">${project.impact}</div>
    </article>
  `).join('');
}

function renderProjects() {
  const el = $('[data-projects]');
  if (!el) return;
  el.innerHTML = D.projects.map(project => `
    <article class="project-card reveal">
      <div class="project-media"><img src="assets/img/${project.image}" alt="Abstract visual for ${project.title}"></div>
      <div class="project-body">
        <small>${project.category}</small>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="impact"><strong>Impact:</strong> ${project.impact}</div>
        ${detailList(project.details)}
        <div class="project-meta">${tagList(project.stack)}</div>
        ${project.link ? `<a class="text-link" href="${project.link}" target="_blank" rel="noreferrer">Open repository →</a>` : ''}
      </div>
    </article>
  `).join('');
}

function renderExperience() {
  const el = $('[data-experience]');
  if (!el) return;
  el.innerHTML = D.experience.map(exp => `
    <article class="timeline-card reveal">
      <small>${exp.time}</small>
      <h3>${exp.role}</h3>
      <p class="timeline-org">${exp.org}</p>
      <p>${exp.text}</p>
      ${detailList(exp.bullets)}
    </article>
  `).join('');
}

function renderResearch() {
  const el = $('[data-research]');
  if (el) {
    el.innerHTML = D.research.map((item, index) => `
      <article class="cap-card reveal">
        <small>${String(index + 1).padStart(2, '0')}</small>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `).join('');
  }
  const pub = $('[data-publications]');
  if (pub) {
    pub.innerHTML = D.publications.map(item => `
      <article class="publication-card reveal">
        <small>${item.year}</small>
        <h3>${item.title}</h3>
        <p>${item.venue}</p>
        <p>${item.note}</p>
      </article>
    `).join('');
  }
}

function renderJourney() {
  const el = $('[data-journey]');
  if (!el) return;
  const storyMode = el.classList.contains('story-flow');
  if (storyMode) {
    el.innerHTML = D.journey.map((item, index) => `
      <article class="story-node reveal">
        <div class="story-index">${item.symbol || String(index + 1).padStart(2, '0')}</div>
        <div class="story-card">
          <small>${item.tag}</small>
          <h3>${item.place}</h3>
          <p>${item.text}</p>
        </div>
      </article>
    `).join('');
    return;
  }
  el.innerHTML = D.journey.map(item => `
    <article class="timeline-card reveal">
      <small>${item.tag}</small>
      <h3>${item.place}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderEducation() {
  const el = $('[data-education]');
  if (!el) return;
  el.innerHTML = D.education.map(item => `
    <article class="publication-card reveal">
      <small>${item.program}</small>
      <h3>${item.school}</h3>
      <p>${item.detail}</p>
    </article>
  `).join('');
}

function renderAwards() {
  const el = $('[data-achievements]');
  if (!el) return;
  el.innerHTML = D.achievements.map(item => `
    <article class="award-card reveal">
      <small>${item.type}</small>
      <h3>${item.name}</h3>
      <p>${item.details}</p>
    </article>
  `).join('');
}

function renderSkills() {
  const el = $('[data-skills]');
  if (!el) return;
  el.innerHTML = D.skills.map(skill => `<span class="pill">${skill}</span>`).join('');
}

function renderContact() {
  const el = $('[data-contact]');
  if (!el) return;
  el.innerHTML = `
    <a class="btn btn-primary" href="mailto:${D.person.email}">Email</a>
    <a class="btn btn-ghost" href="${D.person.github}" target="_blank" rel="noreferrer">GitHub</a>
    <a class="btn btn-muted" href="${D.person.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
  `;
}

function reveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(item => observer.observe(item));
}

function init() {
  renderNav();
  wireNav();
  renderMetrics();
  renderCapabilities();
  renderLayers();
  renderProjectPreview();
  renderProjects();
  renderExperience();
  renderResearch();
  renderJourney();
  renderEducation();
  renderAwards();
  renderSkills();
  renderContact();
  reveal();
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

init();
