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
