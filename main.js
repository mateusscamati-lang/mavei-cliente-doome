/* ============================================================
   main.js — comportamentos compartilhados em todas as páginas
   DOOME · Padrão MAVEI · Sem dependências.

   Inclui:
     1. Lazy GA4 (dispara no primeiro evento ou após 5s)
     2. Nav scroll detection (sentinel-based, zero rAF cost)
     3. Smooth scroll pra âncoras internas
     4. Reveal on-scroll (IntersectionObserver)
     5. Tracking de cliques WhatsApp e envios de formulário
   ============================================================ */

// ── 1. GA4 lazy load ────────────────────────────────────────────
(function lazyGA4() {
  var GA4_ID = 'G-1MMRFBELDX';
  if (!GA4_ID || GA4_ID === '[GA4_ID]') return;
  var loaded = false;
  var events = ['scroll','mousemove','touchstart','keydown','click'];
  var opts = { passive: true, once: true };

  function load() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID, { send_page_view: true });
    events.forEach(function(ev){ window.removeEventListener(ev, load, opts); });
  }

  events.forEach(function(ev){ window.addEventListener(ev, load, opts); });
  setTimeout(load, 5000);
})();

// ── 2. Nav scroll detection ────────────────────────────────────
(function navScroll() {
  var nav = document.getElementById('nav') || document.querySelector('.nav');
  if (!nav) return;
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:50px;left:0;width:1px;height:1px;pointer-events:none';
  document.body.prepend(sentinel);
  var io = new IntersectionObserver(function(entries){
    nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
  }, { threshold: 0 });
  io.observe(sentinel);
})();

// ── 3. Smooth scroll pra âncoras internas ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── 4. Reveal on-scroll ────────────────────────────────────────
(function revealOnScroll() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();

// ── 5. Track de cliques WhatsApp ───────────────────────────────
(function trackWhatsApp() {
  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(function(a){
    a.addEventListener('click', function(){
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_whatsapp', {
          event_category: 'CTA',
          event_label: a.dataset.cta || a.textContent.trim().slice(0, 40),
        });
      }
    }, { passive: true });
  });
})();

// ── 6. Track de envios de formulário ───────────────────────────
(function trackForms() {
  document.querySelectorAll('form').forEach(function(form){
    form.addEventListener('submit', function(){
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Formulário',
          event_label: form.dataset.form || form.name || 'contato',
        });
      }
    }, { passive: true });
  });
})();

// ── 7. Service Worker: registra após load (não bloqueia 1ª pintura) ──
(function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  // Não registra em localhost via servidor Python (file:// também não funciona)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js').catch(function(err){
      console.warn('[sw] registro falhou:', err);
    });
  });
})();

// ── 8. Nav: classe nav--scrolled após primeira rolagem (desktop dark→light) ──
(function navScrolled() {
  var nav = document.getElementById('nav') || document.querySelector('.nav');
  if (!nav) return;
  var ticking = false;
  function update(){
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ── 9. Drawer mobile: burger abre/fecha + trava scroll ──
(function drawerMobile() {
  var burger = document.querySelector('.nav__burger');
  var drawer = document.getElementById('drawer') || document.querySelector('.drawer');
  var nav    = document.getElementById('nav') || document.querySelector('.nav');
  if (!burger || !drawer) return;
  function setOpen(open) {
    burger.classList.toggle('is-open', open);
    drawer.classList.toggle('drawer--open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (nav) nav.classList.toggle('nav--menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function(){
    setOpen(!drawer.classList.contains('drawer--open'));
  });
  // Fecha ao clicar em item do drawer (link interno já navega — só limpa estado)
  drawer.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });
  // Esc fecha
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && drawer.classList.contains('drawer--open')) setOpen(false);
  });
})();

// ── 10. Hero parallax (desktop): translateY + scale baseado no scroll ──
(function heroParallax() {
  var bg = document.getElementById('hero-bg');
  if (!bg) return;
  if (window.matchMedia('(max-width: 800px)').matches) return; // sem parallax no mobile
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  function update(){
    var t = Math.min(window.scrollY / 600, 1);
    bg.style.transform = 'translateY(' + (t * 80) + 'px) scale(' + (1 + t * 0.05) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// ── 11. Cursor customizado (desktop apenas) ──
(function customCursor() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  var dot  = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var label = ring && ring.querySelector('.cursor-label');
  if (!dot || !ring) return;
  var dx=0, dy=0, rx=0, ry=0, raf;
  function move(e){
    dx = e.clientX; dy = e.clientY;
    dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0) translate(-50%,-50%)';
  }
  function tick(){
    rx += (dx - rx) * 0.18;
    ry += (dy - ry) * 0.18;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
    raf = requestAnimationFrame(tick);
  }
  function over(e){
    var t = e.target.closest('[data-cursor]');
    var variant = t ? t.dataset.cursor : 'default';
    var lbl = t ? (t.dataset.cursorLabel || '') : '';
    dot.className = 'cursor-dot cursor-' + variant;
    ring.className = 'cursor-ring cursor-' + variant;
    if (label) { label.textContent = lbl; }
  }
  window.addEventListener('mousemove', move, { passive: true });
  window.addEventListener('mouseover', over, { passive: true });
  tick();
})();
