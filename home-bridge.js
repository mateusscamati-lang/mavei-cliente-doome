/* ============================================================
   Doome — URL Routing Bridge
   Intercepta cliques nos itens de nav do React e navega
   para as páginas estáticas reais em vez de mudar estado.
   ============================================================ */
(function () {
  // Mapeamento id-do-item → URL estática
  const ROUTES = {
    sobre:    '/sobre/',
    servicos: '/servicos/',
    projetos: '/projetos/',
    contato:  '/contato/',
    blog:     '/blog/',
    // 'home' e 'inicio' ficam no SPA (index.html)
  };

  function getRouteForItem(el) {
    // O .nav__item tem onClick que chama onNav('id')
    // O texto de nav__label contém o label visível
    const label = el.querySelector('.nav__label');
    if (!label) return null;
    const text = label.textContent.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, ''); // remove acentos
    // Match: "sobre", "servicos" (sem cedilha), "projetos", "contato"
    for (const [id, route] of Object.entries(ROUTES)) {
      const idNorm = id.normalize('NFD').replace(/[̀-ͯ]/g, '');
      if (text === idNorm || text.includes(idNorm)) return route;
    }
    return null;
  }

  // Capture phase: intercepta antes do onClick do React
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.nav__item');
    if (!btn) return;

    const route = getRouteForItem(btn);
    if (route) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = route;
    }
    // Se route === null → é 'Início', deixa React tratar normalmente
  }, true);

  // Também intercepta o botão .nav__cta ("Solicitar orçamento") → /contato/
  document.addEventListener('click', function (e) {
    const cta = e.target.closest('.nav__cta');
    if (cta) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = '/contato/';
    }
  }, true);

  // Intercepta botões do footer que chamam onNav()
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.footer__col button');
    if (!btn) return;
    const text = btn.textContent.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const [id, route] of Object.entries(ROUTES)) {
      if (text.includes(id)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = route;
        return;
      }
    }
  }, true);

  // Intercepta botões hero / CTA-band que chamam onNav('projetos') etc.
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-navto]');
    if (btn && ROUTES[btn.dataset.navto]) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = ROUTES[btn.dataset.navto];
    }
  }, true);

  // ──────────────────────────────────────────────────────────
  // INTERCEPTA CARDS DE PROJETO ANTES DO REACT
  // Bloqueia o ProjectOverlay nativo e delega pro DoomeLightbox
  // (que está em /lightbox.js — carregado depois, mas registra
  //  seu próprio handler em capture phase também).
  // ──────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    const card = e.target.closest('[data-project-id]');
    if (!card) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const id = card.dataset.projectId;
    function tryOpen(tries) {
      tries = tries || 0;
      if (window.DoomeLightbox && window.DoomeLightbox.open) {
        window.DoomeLightbox.open(id);
      } else if (tries < 50) {
        setTimeout(function(){ tryOpen(tries + 1); }, 50);
      }
    }
    tryOpen();
  }, true);

  // Após React montar: adiciona data-navto nos botões hero/CTA
  function tagButtons() {
    // "Ver projetos" e "Ver todos os projetos"
    document.querySelectorAll('.hero__actions button, .projects__more button').forEach(btn => {
      const t = btn.textContent.trim().toLowerCase();
      if (t.includes('projeto')) btn.dataset.navto = 'projetos';
    });
    // Botões CTA band / seção de contato
    document.querySelectorAll('.cta-band button, .cta button').forEach(btn => {
      btn.dataset.navto = 'contato';
    });
    // Botão "Falar com a Doome" no hero
    document.querySelectorAll('.hero__actions button').forEach(btn => {
      const t = btn.textContent.trim().toLowerCase();
      if (t.includes('contato') || t.includes('conversar') || t.includes('falar')) {
        btn.dataset.navto = 'contato';
      }
    });
  }

  // Roda após render inicial e observa mudanças
  setTimeout(tagButtons, 300);
  const mo = new MutationObserver(tagButtons);
  setTimeout(() => {
    const root = document.getElementById('root');
    if (root) mo.observe(root, { childList: true, subtree: false });
  }, 600);

})();
