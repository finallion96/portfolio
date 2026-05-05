/* ═══════════════════════════════════════════════════════════════
   ROBOTICS PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════════ */

// ── Footer year ─────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Mobile hamburger menu ────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Active nav link on scroll ────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const links    = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => observer.observe(s));

// ── Animated dots canvas (hero background) ──────────────────────
(function initDots() {
  const canvas = document.getElementById('dotsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SPACING = 40;
  const RADIUS  = 1.5;
  const COLOR   = '#00d4ff';

  let dots = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(canvas.width  / SPACING) + 1;
    const rows = Math.ceil(canvas.height / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ x: c * SPACING, y: r * SPACING, ox: c * SPACING, oy: r * SPACING });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const glow = Math.max(0, 1 - dist / 120);
      ctx.beginPath();
      ctx.arc(d.x, d.y, RADIUS + glow * 2, 0, Math.PI * 2);
      ctx.fillStyle = COLOR;
      ctx.globalAlpha = 0.25 + glow * 0.75;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  canvas.closest('.hero').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.closest('.hero').addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Scroll-reveal animation ──────────────────────────────────────
(function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.project-card, .skill-category, .stat-card, .timeline-item, .contact-card'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => revealObserver.observe(el));
})();

// ── Contact form (placeholder handler) ──────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  btn.textContent = 'Sent!';
  btn.disabled = true;
  // ✏️  Wire up to Formspree / EmailJS / your own backend here.
  // Example with Formspree:
  //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //     method: 'POST',
  //     headers: { 'Accept': 'application/json' },
  //     body: new FormData(e.target)
  //   });
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}
