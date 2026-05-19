# Doome Projetos e Obras — Site Institucional

Site institucional da Doome Projetos e Obras (Americana, SP) — escritório de arquitetura, engenharia e gestão de obras. Desenvolvido pela [MAVEI Digital](https://mavei.com.br/).

## Estrutura

```
/                  Home (SPA React inline)
/sobre/            Sobre a Doome (equipe, missão, estúdio)
/projetos/         Portfólio com lightbox de imagens
/servicos/         Lista de serviços + processo de trabalho
/contato/          Formulário + WhatsApp + Google Maps
/blog/             Blog (gerenciado pela plataforma MAVEI)
```

## Stack

- HTML estático com fonts Montserrat self-hostadas (latin + latin-ext)
- CSS vanilla com tokens da identidade DOOME (paleta cinza-azulada do logo)
- JavaScript vanilla sem build step
- Service Worker (cache-first pra assets, network-first pra HTML)
- PWA-ready com manifest.json

## Performance

- ~3 MB total de assets (32 imagens WebP otimizadas)
- Lazy GA4 (não bloqueia primeiro paint)
- Preload de fontes críticas
- Imagens com `loading="lazy"` + `decoding="async"`
- Cache headers via `.htaccess`

## SEO

- Schema.org JSON-LD rico (LocalBusiness, Organization, Service, AboutPage, ContactPage, CollectionPage, Blog)
- Open Graph + Twitter Card em todas as páginas
- Sitemap.xml + robots.txt
- Geo meta tags (Americana SP)
- Canonical URLs absolutas com www

## Desenvolvimento

Pra subir um servidor local:

```bash
python -m http.server 8989
# ou
npx serve -p 8989
```

Abrir [http://localhost:8989](http://localhost:8989).

## Manutenção

- **Adicionar fotos a um projeto:** colocar `.webp` em `/assets/projetos/{id}/0N.webp` e ajustar `imagens: N` no `projetos-data.js`
- **Atualizar GA4:** substituir `[GA4_ID]` por ID real no `main.js`
- **Blog:** gerenciado pela plataforma MAVEI — não editar manualmente

## Contato

Site: [doome.com.br](https://www.doome.com.br/) · WhatsApp: +55 19 99299-4853
