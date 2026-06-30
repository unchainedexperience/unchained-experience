/* ============================================
   UNCHAINED EXPERIENCE — Main JS
   ============================================ */

const WHATSAPP_NUMBER = '254750625490';
const PHONE_NUMBER = '+254750625490';
const EMAIL = 'official.unchainedexperience@gmail.com';

// ——— NAV scroll effect ———
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks?.classList.contains('open');
  spans.forEach(s => s.style.cssText = '');
  if (isOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  }
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// ——— Hero loaded class ———
window.addEventListener('load', () => {
  document.querySelector('.hero')?.classList.add('loaded');
});

// ——— Active nav link ———
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
})();

// ——— Gallery lightbox ———
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('img');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (lightboxImg) lightboxImg.src = img.src.replace(/w=\d+/, 'w=1400');
    lightbox?.classList.add('open');
  });
});
lightbox?.querySelector('.lightbox__close')?.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

// ——— Enquiry form (Home / Contact / Flight) ———
document.querySelectorAll('.js-enquiry-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Server error');
      showToast('✅ Enquiry sent! We\'ll reply within 24 hours.');
      form.reset();
    } catch {
      // Fallback to WhatsApp with prefilled message
      const lines = Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      const msg = encodeURIComponent(`New enquiry from website:\n${lines}`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
      showToast('📱 Opening WhatsApp to send your enquiry…');
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
});

// ——— Toast helper ———
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 4500);
}

// ——— Scroll reveal ———
const revealEls = document.querySelectorAll('.tour-card, .why-card, .testimonial, .gallery-item, .blog-card, .flight-feature, .team-card');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ——— Flight tab switching ———
document.querySelectorAll('.flight-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.flight-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tripType = document.getElementById('tripType');
    if (tripType) tripType.value = tab.dataset.type;
  });
});

// ——— Flight swap ———
document.querySelector('.flight-swap')?.addEventListener('click', () => {
  const from = document.getElementById('fromCity');
  const to = document.getElementById('toCity');
  if (from && to) { const tmp = from.value; from.value = to.value; to.value = tmp; }
});
