/* ============================================================
   lightbox.js — Modal editorial de projetos DOOME.

   Layout:
     - Hero: foto principal grande (trocável via thumbs)
     - Filmstrip: tira horizontal de thumbnails clicáveis
     - Info: numeração + título + locline
     - Body: descrição (2/3) + specs (1/3)
     - CTA: WhatsApp com mensagem contextualizada

   Interações:
     - Click no thumb → cross-fade da hero
     - Setas ← → no teclado navegam entre fotos
     - ESC fecha
     - Deep-link via #project-id
   ============================================================ */

(function lightbox() {
  if (!window.DOOME_PROJETOS_BY_ID) return;

  // ── DOM do modal ──────────────────────────────────────────
  var modal = document.createElement('div');
  modal.className = 'lb';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = [
    '<button class="lb__close" type="button" data-lb-close aria-label="Fechar projeto">',
    '  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">',
    '    <path d="M6 6L18 18M18 6L6 18"/>',
    '  </svg>',
    '</button>',
    '<div class="lb__scroll">',
    '  <article class="lb__article">',
    // HERO com 2 imgs sobrepostas pra fazer cross-fade
    '    <header class="lb__hero">',
    '      <img class="lb__hero-img lb__hero-img--a is-on" alt="" />',
    '      <img class="lb__hero-img lb__hero-img--b" alt="" />',
    '    </header>',
    // FILMSTRIP de thumbnails
    '    <nav class="lb__strip" aria-label="Galeria de imagens"></nav>',
    // INTRO
    '    <section class="lb__intro">',
    '      <p class="lb__eyebrow">',
    '        <span class="lb__n"></span>',
    '        <span class="lb__sep">·</span>',
    '        <span class="lb__tag"></span>',
    '      </p>',
    '      <h2 class="lb__title"></h2>',
    '      <p class="lb__locline"></p>',
    '    </section>',
    // BODY
    '    <section class="lb__body">',
    '      <div class="lb__body-text">',
    '        <p class="lb__desc"></p>',
    '      </div>',
    '      <aside class="lb__specs"></aside>',
    '    </section>',
    // CTA
    '    <section class="lb__cta">',
    '      <p class="lb__cta-eyebrow">Gostou desse projeto?</p>',
    '      <h3 class="lb__cta-title">Vamos conversar<br><em>sobre o seu.</em></h3>',
    '      <a class="lb__cta-btn" href="https://api.whatsapp.com/send?phone=5519992994853" target="_blank" rel="noopener noreferrer" data-cta="lightbox-projeto" aria-label="Falar com a Doome pelo WhatsApp">',
    '        <span>Falar com a Doome</span>',
    '        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>',
    '      </a>',
    '    </section>',
    '  </article>',
    '</div>'
  ].join('\n');
  document.body.appendChild(modal);

  // Referências
  var scrollEl = modal.querySelector('.lb__scroll');
  var heroImgA = modal.querySelector('.lb__hero-img--a');
  var heroImgB = modal.querySelector('.lb__hero-img--b');
  var stripEl = modal.querySelector('.lb__strip');
  var nEl = modal.querySelector('.lb__n');
  var tagEl = modal.querySelector('.lb__tag');
  var titleEl = modal.querySelector('.lb__title');
  var loclineEl = modal.querySelector('.lb__locline');
  var descEl = modal.querySelector('.lb__desc');
  var specsEl = modal.querySelector('.lb__specs');
  var ctaBtn = modal.querySelector('.lb__cta-btn');

  var current = null;       // projeto atual
  var currentIdx = 0;       // índice da foto principal
  var activeHero = 'a';     // qual img está visível agora ('a' ou 'b')
  var prevScroll = 0;
  var fadeBusy = false;

  // ── Helpers ────────────────────────────────────────────────
  function imgPath(p, i) {
    return '/assets/projetos/' + p.id + '/' + String(i + 1).padStart(2, '0') + '.webp';
  }

  function renderSpecs(specs) {
    if (!specs || typeof specs !== 'object') {
      specsEl.innerHTML = '';
      return;
    }
    var keys = Object.keys(specs);
    if (!keys.length) {
      specsEl.innerHTML = '';
      return;
    }
    var html = '<dl class="lb__specs-list">';
    keys.forEach(function(k){
      html += '<div class="lb__specs-row">';
      html +=   '<dt>' + k + '</dt>';
      html +=   '<dd>' + specs[k] + '</dd>';
      html += '</div>';
    });
    html += '</dl>';
    specsEl.innerHTML = html;
  }

  function renderStrip(p) {
    stripEl.innerHTML = '';
    if (p.imagens <= 1) {
      stripEl.style.display = 'none';
      return;
    }
    stripEl.style.display = '';
    for (var i = 0; i < p.imagens; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lb__thumb' + (i === currentIdx ? ' is-on' : '');
      btn.setAttribute('aria-label', 'Imagem ' + (i + 1) + ' de ' + p.imagens);
      btn.dataset.lbThumb = String(i);
      var img = document.createElement('img');
      img.src = imgPath(p, i);
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      stripEl.appendChild(btn);
    }
  }

  function updateThumbActive() {
    var thumbs = stripEl.querySelectorAll('.lb__thumb');
    thumbs.forEach(function(t, i){
      t.classList.toggle('is-on', i === currentIdx);
    });
    // Garante que o thumb ativo esteja visível (scroll horizontal)
    var active = thumbs[currentIdx];
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  function swapHeroTo(newSrc, newAlt) {
    if (fadeBusy) return;

    var visibleEl = activeHero === 'a' ? heroImgA : heroImgB;
    var hiddenEl  = activeHero === 'a' ? heroImgB : heroImgA;

    // Se nada mudou, ignora
    if (visibleEl.src && visibleEl.src.endsWith(newSrc)) return;

    fadeBusy = true;
    // Pré-carrega antes de fazer o swap
    var pre = new Image();
    pre.onload = function() {
      hiddenEl.src = newSrc;
      hiddenEl.alt = newAlt;
      // Próximo frame: aplica o fade
      requestAnimationFrame(function(){
        hiddenEl.classList.add('is-on');
        visibleEl.classList.remove('is-on');
        activeHero = activeHero === 'a' ? 'b' : 'a';
        setTimeout(function(){ fadeBusy = false; }, 600);
      });
    };
    pre.onerror = function() {
      fadeBusy = false;
    };
    pre.src = newSrc;
  }

  function goTo(idx) {
    if (!current) return;
    if (idx < 0) idx = current.imagens - 1;
    if (idx >= current.imagens) idx = 0;
    if (idx === currentIdx) return;
    currentIdx = idx;
    swapHeroTo(imgPath(current, idx), current.nome + ' — imagem ' + (idx + 1));
    updateThumbActive();
  }

  function buildWhatsAppLink(p) {
    var msg = 'Olá, Doome! Vi o projeto "' + p.nome + '" no site e gostaria de conversar sobre um projeto parecido.';
    return 'https://api.whatsapp.com/send?phone=5519992994853&text=' + encodeURIComponent(msg);
  }

  // ── Abrir / Fechar ────────────────────────────────────────
  function open(id) {
    var p = window.DOOME_PROJETOS_BY_ID[id];
    if (!p) return;
    current = p;
    currentIdx = 0;

    // Reset visibilidade dos heros pra começar do A
    heroImgA.classList.add('is-on');
    heroImgB.classList.remove('is-on');
    activeHero = 'a';

    heroImgA.src = imgPath(p, 0);
    heroImgA.alt = p.nome + ' — imagem 1';
    heroImgB.src = '';
    heroImgB.alt = '';

    nEl.textContent = p.n;
    tagEl.textContent = p.tag.toUpperCase();
    titleEl.textContent = p.nome;
    loclineEl.textContent = p.local + ' · ' + p.ano + (p.area ? ' · ' + p.area : '');
    descEl.textContent = p.descricao || '';

    renderSpecs(p.specs);
    renderStrip(p);

    ctaBtn.href = buildWhatsAppLink(p);

    // Trava scroll do body
    prevScroll = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + prevScroll + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // Reset scroll interno
    if (scrollEl) scrollEl.scrollTop = 0;

    modal.classList.add('is-on');
    modal.setAttribute('aria-hidden', 'false');

    // Deep-link
    if (history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  }

  function close() {
    modal.classList.remove('is-on');
    modal.setAttribute('aria-hidden', 'true');
    current = null;
    fadeBusy = false;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, prevScroll);

    if (history.replaceState && location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  // ── Eventos ───────────────────────────────────────────────
  modal.addEventListener('click', function(e) {
    if (e.target.closest('[data-lb-close]')) {
      e.preventDefault();
      close();
      return;
    }
    var thumb = e.target.closest('[data-lb-thumb]');
    if (thumb) {
      goTo(parseInt(thumb.dataset.lbThumb, 10));
    }
  });

  // Click na própria hero avança pra próxima foto
  heroImgA.addEventListener('click', function(){ goTo(currentIdx + 1); });
  heroImgB.addEventListener('click', function(){ goTo(currentIdx + 1); });

  // Teclas: ESC fecha, ← → navegam
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('is-on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') goTo(currentIdx + 1);
    else if (e.key === 'ArrowLeft') goTo(currentIdx - 1);
  });

  // Captura cliques em cards [data-project-id] em capture phase
  document.addEventListener('click', function(e) {
    var card = e.target.closest('[data-project-id]');
    if (!card) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open(card.dataset.projectId);
  }, true);

  // Deep-link inicial
  function tryOpenFromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (h && window.DOOME_PROJETOS_BY_ID[h]) {
      open(h);
    }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(tryOpenFromHash, 50);
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(tryOpenFromHash, 50);
    });
  }
  window.addEventListener('hashchange', tryOpenFromHash);

  // API pública
  window.DoomeLightbox = { open: open, close: close, goTo: goTo };
})();
