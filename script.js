/* ═══════════════════════════════════════════════
   NAVBAR — Sticky blur + scroll state
═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);

  // Subtle parallax on hero grid
  const grid = document.getElementById('hero-grid');
  if (grid && y < window.innerHeight) {
    grid.style.transform = `translateY(${y * 0.12}px)`;
  }
}

/* ═══════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════ */
function toggleMobile() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  burger.classList.toggle('open');
  menu.classList.toggle('open');

  // Lock body scroll when open
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Close on outside click
document.addEventListener('click', (e) => {
  const menu   = document.getElementById('mobile-menu');
  const burger = document.getElementById('burger');
  if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ═══════════════════════════════════════════════
   LANGUAGE TOGGLE
═══════════════════════════════════════════════ */
function setLang(lang) {
  document.body.classList.toggle('en', lang === 'en');
  document.documentElement.lang = lang;

  document.querySelectorAll('[id^="lang-"]').forEach(btn => {
    btn.classList.toggle('active', btn.id.includes(lang + '-btn'));
  });

}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold:  0.1,
  rootMargin: '0px 0px -48px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start    = performance.now();

  function update(now) {
    const t       = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - t, 4); // ease-out quart
    const current = Math.round(eased * target);
    el.textContent = current;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Small stagger per stat item
      const idx = Array.from(entry.target.closest('.stats-grid')?.querySelectorAll('.counter') ?? []).indexOf(entry.target);
      setTimeout(() => animateCounter(entry.target), idx * 120);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(el => countObserver.observe(el));

/* ═══════════════════════════════════════════════
   FAQ ACCORDION — Smooth max-height transition
═══════════════════════════════════════════════ */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

  // Open clicked (if it was closed)
  if (!isOpen) item.classList.add('open');
}

/* ═══════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  // Animate out the form
  form.style.transition = 'opacity 0.3s, transform 0.3s';
  form.style.opacity    = '0';
  form.style.transform  = 'translateY(8px)';

  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
  }, 320);
}

/* ═══════════════════════════════════════════════
   CTA CURSOR GLOW — Track mouse for radial glow
═══════════════════════════════════════════════ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    btn.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — Anchor links with offset
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href   = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });

    // Close mobile menu if open
    const menu   = document.getElementById('mobile-menu');
    const burger = document.getElementById('burger');
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

/* ═══════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT on scroll
═══════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--primary)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
