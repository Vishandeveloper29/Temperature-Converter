
/* ════════════════════════════════════════════
   MAIN SCRIPT — GSAP + ScrollTrigger + All FX
════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ── Utils ── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const isTouch = () => window.matchMedia("(hover:none)").matches;

/* ══ 1. LOADER ══ */
const loaderWords = $$('.ldr-word span');
const loaderNum = $('.ldr-num span');
const loader = $('#loader');

const loaderTl = gsap.timeline({
  onComplete: () => {
    gsap.to(loader, { opacity: 0, duration: 0.7, ease: 'power2.inOut', onComplete: () => {
      loader.style.display = 'none';
      initAfterLoad();
    }});
  }
});

loaderTl
  .to(loaderWords, { y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' })
  .to(loaderNum, { y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');

// Simulate progress
let ldrProgress = 0;
const ldrInterval = setInterval(() => {
  ldrProgress = Math.min(ldrProgress + Math.random() * 15 + 5, 100);
  if (ldrProgress >= 100) { clearInterval(ldrInterval); loaderTl.play(); }
}, 60);
loaderTl.pause();

/* ══ 2. CURSOR ══ */
const dot = $('#cursor-dot');
const ring = $('#cursor-ring');
let ringX = 0, ringY = 0, dotTargX = 0, dotTargY = 0;

if (!isTouch() && dot && ring) {
  document.addEventListener('mousemove', e => {
    dotTargX = e.clientX; dotTargY = e.clientY;
    gsap.to(dot, { left: e.clientX, top: e.clientY, duration: 0.07, ease: 'none' });
  }, { passive: true });

  (function ringLoop() {
    ringX += (dotTargX - ringX) * 0.1;
    ringY += (dotTargY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(ringLoop);
  })();

  const hoverEls = 'a,button,input,select,textarea,.pill,.svc,.proj-card,.skill-card,.testi-card,.blog-card,.price-card,.step,.tl-card';
  $$(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
  $$('p,.about-text,.blog-excerpt,.tl-desc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
  });
}

/* ══ 3. SCROLL PROGRESS ══ */
const progress = $('#scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progress.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ══ 4. THEME TOGGLE ══ */
const themeBtn = $('#theme-toggle');
const htmlEl = document.documentElement;
const savedTheme = localStorage.getItem('vr-theme') || 'dark';
if (savedTheme === 'light') { htmlEl.setAttribute('data-theme', 'light'); themeBtn.textContent = '☀️'; }

themeBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('vr-theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  gsap.fromTo(themeBtn, { rotate: 0, scale: 0.8 }, { rotate: 360, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
});

/* ══ 5. NAV + HAMBURGER ══ */
const nav = $('#nav');
const hamburger = $('#hamburger');
const mobMenu = $('#mob-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  $('#back-top').classList.toggle('show', window.scrollY > 500);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = mobMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

$$('[data-close]').forEach(a => a.addEventListener('click', () => {
  mobMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

// Active nav
const sections = $$('section[id]');
const navLinks = $$('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

/* ══ 6. SMOOTH SCROLL ══ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});

$('#back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══ 7. INIT AFTER LOAD ══ */
function initAfterLoad() {
  // Reveal nav logo and hire
  gsap.to('.nav-logo', { opacity: 1, duration: 0.8, delay: 0.1 });
  gsap.to('.nav-hire', { opacity: 1, duration: 0.8, delay: 0.3 });

  // Hero animation sequence
  const heroTl = gsap.timeline();
  heroTl
    .fromTo('.hero-line', 
      { y: '110%', skewY: 3 }, 
      { y: 0, skewY: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }
    )
    .fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
    .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-ctas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-meta', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .fromTo('.hero-scroll-hint', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .fromTo('#codeCard', { opacity: 0, y: 40, rotateY: -15 }, { opacity: 1, y: 0, rotateY: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8')
    .fromTo('.hero-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)' }, '-=0.5');

  // Counter animation
  $$('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2.5,
      delay: 1.2,
      ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.floor(this.targets()[0].val); }
    });
  });

  initScrollAnimations();
  initParallax();
  initMagnetic();
  initHorizontalScroll();
}

/* ══ 8. SCROLL ANIMATIONS ══ */
function initScrollAnimations() {
  // Generic reveal
  $$('.reveal').forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  $$('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -70 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  $$('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 70 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // Skill bars
  $$('.skill-card').forEach(card => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => {
        const bar = card.querySelector('.sbar-fill');
        const pctEl = card.querySelector('.sbar-pct');
        const target = parseInt(bar.dataset.w);
        bar.style.width = bar.dataset.w;
        if (pctEl) {
          gsap.to({ v: 0 }, {
            v: target, duration: 1.6, ease: 'power2.out',
            onUpdate: function() { pctEl.textContent = Math.floor(this.targets()[0].v) + '%'; }
          });
        }
        setTimeout(() => card.classList.add('animated'), 900);
      }
    });
  });

  // Timeline items stagger
  const tlItems = $$('.tl-item');
  tlItems.forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // Stagger grids
  ['.services-grid', '.process-steps', '.pricing-grid', '.blog-grid', '.skills-grid'].forEach(sel => {
    const parent = $(sel);
    if (!parent) return;
    ScrollTrigger.create({
      trigger: parent, start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(parent.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });
  });
}

/* ══ 9. PARALLAX ══ */
function initParallax() {
  if (isTouch()) return;

  // Hero grid
  gsap.to('.hero-grid', {
    y: '15%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
  });

  // Section background nums
  $$('.sec-num').forEach(el => {
    gsap.fromTo(el,
      { y: 40 },
      { y: -40, ease: 'none',
        scrollTrigger: { trigger: el.closest('section'), scrub: 1.5, start: 'top bottom', end: 'bottom top' }
      }
    );
  });

  // Mouse parallax on hero
  const heroSection = $('.hero');
  document.addEventListener('mousemove', e => {
    if (!heroSection) return;
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to('.hero-code', { x: mx * 20, y: my * 12, duration: 1.2, ease: 'power2.out' });
    gsap.to('.hero-badge.b1', { x: mx * -12, y: my * -8, duration: 1.4, ease: 'power2.out' });
    gsap.to('.hero-badge.b2', { x: mx * 16, y: my * -10, duration: 1.1, ease: 'power2.out' });
    gsap.to('.hero-badge.b3', { x: mx * -10, y: my * 14, duration: 1.3, ease: 'power2.out' });
  }, { passive: true });
}

/* ══ 10. MAGNETIC BUTTONS ══ */
function initMagnetic() {
  if (isTouch()) return;
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ══ 11. HORIZONTAL PROJECT SCROLL ══ */
function initHorizontalScroll() {
  const track = $('#horizTrack');
  if (!track) return;
  let startX = 0, scrollLeft = 0, isDown = false;

  // Drag scroll
  track.addEventListener('mousedown', e => {
    isDown = true; track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.parentElement.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.parentElement.scrollLeft = scrollLeft - walk;
  });
  track.style.cursor = 'grab';

  // Touch scroll (native)
  track.parentElement.style.overflowX = 'auto';
  track.parentElement.style.scrollbarWidth = 'none';
  track.parentElement.style.msOverflowStyle = 'none';

  // Animate cards in with stagger as they come into view
  $$('.proj-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '#projects', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══ 12. SPOTLIGHT ON CARDS ══ */
if (!isTouch()) {
  $$('.svc,.skill-card,.step,.proj-card,.price-card,.tl-card,.blog-card,.testi-card').forEach(el => {
    el.style.setProperty('--sx','50%');
    el.style.setProperty('--sy','50%');
    el.style.backgroundImage = `radial-gradient(200px circle at var(--sx) var(--sy),rgba(184,255,87,.04),transparent 60%)`;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* ══ 13. RIPPLE ══ */
function addRipple(el) {
  el.style.overflow = 'hidden';
  el.addEventListener('click', e => {
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;position:absolute;z-index:0;`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}
$$('.btn-primary,.btn-ghost,.btn-submit,.ov-btn,.nav-hire').forEach(addRipple);

/* ══ 14. 3D CARD TILT ══ */
if (!isTouch()) {
  // Code card tilt
  const cc = $('#codeCard');
  if (cc) {
    cc.addEventListener('mousemove', e => {
      const r = cc.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
      gsap.to(cc, { rotateX: y, rotateY: x, scale: 1.02, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
    });
    cc.addEventListener('mouseleave', () => {
      gsap.to(cc, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  }

  $$('.proj-card,.price-card,.id-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 7;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -7;
      gsap.to(card, { rotateX: y, rotateY: x, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ══ 15. TYPEWRITER ══ */
const twWords = ['Landing Pages','Web Apps','UI/UX Interfaces','E-Commerce Sites','API Experiences','Pixel-Perfect Designs'];
let twIdx = 0, twChar = 0, twDeleting = false;
const twEl = $('#tw-text');

function typeWriter() {
  if (!twEl) return;
  const word = twWords[twIdx];
  const prefix = 'Available for Freelance · ';
  if (!twDeleting) {
    twEl.textContent = prefix + word.slice(0, ++twChar);
    if (twChar === word.length) { twDeleting = true; setTimeout(typeWriter, 1800); return; }
  } else {
    twEl.textContent = prefix + word.slice(0, --twChar);
    if (twChar === 0) { twDeleting = false; twIdx = (twIdx + 1) % twWords.length; }
  }
  setTimeout(typeWriter, twDeleting ? 45 : 85);
}
setTimeout(typeWriter, 3000);

/* ══ 16. TESTIMONIALS ══ */
(function() {
  const track = $('#testiTrack');
  const dotsWrap = $('#testiDots');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  if (!track) return;
  const cards = $$('.testi-card', track);
  let current = 0, autoplay;

  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap && dotsWrap.appendChild(dot);
  });

  function getW() { return (cards[0]?.getBoundingClientRect().width || 0) + 24; }
  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    gsap.to(track, { x: -current * getW(), duration: 0.6, ease: 'power3.out' });
    $$('.testi-dot', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === current));
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 4500);
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  let tStartX = 0;
  track.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = tStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(current + (dx > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('resize', () => gsap.to(track, { x: -current * getW(), duration: 0 }), { passive: true });

  goTo(0);
  autoplay = setInterval(() => goTo(current + 1), 4500);
})();

/* ══ 17. FAQ ══ */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans = btn.closest('.faq-item').querySelector('.faq-a');
    const open = btn.getAttribute('aria-expanded') === 'true';
    $$('.faq-q[aria-expanded="true"]').forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      q.closest('.faq-item').querySelector('.faq-a').setAttribute('hidden', '');
    });
    if (!open) { btn.setAttribute('aria-expanded', 'true'); ans.removeAttribute('hidden'); }
  });
});

/* ══ 18. CONTACT FORM ══ */
const contactForm = $('#contactForm');
const formContent = $('#formContent');
const formSuccess = $('#formSuccess');
const formError = $('#formError');
const submitBtn = $('#submitBtn');
const submitText = $('#submitText');
const successEmail = $('#successEmail');

$('#msg')?.addEventListener('input', () => {
  const len = $('#msg').value.length;
  const cc = $('#charCounter');
  if (cc) { cc.textContent = len + ' / 500'; cc.className = 'char-counter' + (len > 450 ? ' warn' : '') + (len >= 500 ? ' limit' : ''); }
});

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const fname = contactForm.fname.value.trim();
  const email = contactForm.femail.value.trim();
  const msg = contactForm.message.value.trim();
  const consent = contactForm.consent.checked;
  formError?.setAttribute('hidden', '');
  let valid = true;
  if (!fname || fname.length < 2) { contactForm.fname.classList.add('error'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { contactForm.femail.classList.add('error'); valid = false; }
  if (!msg || msg.length < 10) { contactForm.message.classList.add('error'); valid = false; }
  if (!consent) valid = false;
  if (!valid) { formError?.removeAttribute('hidden'); if (formError) formError.textContent = 'Please fill in all required fields.'; return; }
  submitBtn.disabled = true; submitText.textContent = 'Sending…';
  try {
    const resp = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
    if (resp.ok) {
      if (successEmail) successEmail.textContent = email;
      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.removeAttribute('hidden');
      launchConfetti();
    } else throw new Error();
  } catch {
    submitText.textContent = 'Send Message'; submitBtn.disabled = false;
    formError?.removeAttribute('hidden');
    if (formError) formError.textContent = 'Failed to send. Please email rabarivishan2@gmail.com directly.';
  }
});

function launchConfetti() {
  const container = $('#confetti');
  if (!container) return;
  const colors = ['#b8ff57','#57ffe8','#ff4d6d','#f5c842','#a78bfa'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'piece';
    p.style.cssText = `left:${Math.random()*100}%;top:-10px;background:${colors[i%colors.length]};--tx:${(Math.random()-.5)*220}px;animation-delay:${Math.random()*.8}s;width:${Math.random()*6+4}px;height:${Math.random()*6+4}px;border-radius:${Math.random()>.5?'50%':'2px'}`;
    container.appendChild(p);
  }
}

/* ══ 19. PREVIEW MODAL ══ */
const modal = $('#previewModal');
const previewIframe = $('#previewIframe');
const previewLoader = $('#previewLoader');
const previewTitle = $('#previewTitle');
const previewExtLink = $('#previewExtLink');

$$('.preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    const name = btn.closest('.proj-card')?.querySelector('.proj-name')?.textContent || 'Project';
    previewTitle.textContent = name + ' — Preview';
    previewExtLink && (previewExtLink.href = url);
    previewIframe.src = '';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    previewLoader?.classList.remove('hide');
    requestAnimationFrame(() => { previewIframe.src = url; });
    previewIframe.onload = () => previewLoader?.classList.add('hide');
    setTimeout(() => previewLoader?.classList.add('hide'), 5000);
  });
});
function closeModal() {
  modal?.setAttribute('hidden', '');
  document.body.style.overflow = '';
  if (previewIframe) previewIframe.src = '';
}
$('#previewClose')?.addEventListener('click', closeModal);
$('#previewBack')?.addEventListener('click', closeModal);

/* ══ 20. KEYBOARD ══ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    if (mobMenu.classList.contains('open')) {
      mobMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* ══ 21. TOUCH CARD FEEDBACK ══ */
if (isTouch()) {
  $$('.proj-card,.svc,.skill-card,.blog-card,.price-card').forEach(card => {
    card.addEventListener('touchstart', () => { card.style.opacity = '.88'; }, { passive: true });
    card.addEventListener('touchend', () => { setTimeout(() => { card.style.opacity = ''; }, 150); }, { passive: true });
  });
}

/* ══ 22. SECTION TRANSITIONS ══ */
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: self => {
    // subtle hue shift on scroll
    const hue = self.progress * 30;
    document.documentElement.style.setProperty('--scroll-hue', hue);
  }
});

/* ══ 23. HERO TITLE LETTER HOVER ══ */
$$('.hero-line').forEach(line => {
  if (line.children.length > 0) return;
  const text = line.textContent;
  line.innerHTML = text.split('').map(c => c === ' ' ? ' ' : `<span class="hl" style="display:inline-block">${c}</span>`).join('');
  line.querySelectorAll('.hl').forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      gsap.to(letter, { y: -6, color: 'var(--accent)', duration: 0.2, ease: 'power2.out' });
    });
    letter.addEventListener('mouseleave', () => {
      gsap.to(letter, { y: 0, color: '', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    });
  });
});

/* ══ 24. FLOATING BADGE ANIMATION ══ */
(function floatBadges() {
  const badges = $$('.hero-badge');
  const offs = badges.map(() => Math.random() * Math.PI * 2);
  function tick() {
    const t = performance.now() * 0.001;
    badges.forEach((b, i) => {
      const dy = Math.sin(t + offs[i]) * 5;
      b.style.setProperty('--dy', dy + 'px');
      gsap.set(b, { y: dy });
    });
    requestAnimationFrame(tick);
  }
  tick();
})();