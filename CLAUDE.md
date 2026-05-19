# Doome Projetos e Obras — Site institucional

## Quem é o cliente

- **Nome:** Doome Projetos e Obras
- **Slug:** doome
- **Segmento:** Arquitetura e Engenharia
- **Cidade:** Americana, SP
- **Endereço:** Rua Orlando Dei Santi, 2154 — CEP 13469-000
- **Site:** www.doome.com.br
- **WhatsApp:** +55 (19) 99299-4853
- **E-mail:** renan@doome.com.br
- **Instagram:** @doomeprojetos
- **Facebook:** /doomeprojetos
- **Fundação:** 2021

## Equipe

- **Leonardo Matsui** — Coordenador de Engenharia e Gestão de Obra (CREA-SP 5070436125)
- **Renan Dias** — Coordenador de Arquitetura e Setor Comercial (CAU/SP A144736-0)

## Proposta de valor

Arquitetura, engenharia e gestão de obras integradas sob o mesmo teto — do conceito à entrega, com coerência técnica e estética em cada etapa.

## Manifesto

> Transformar ideias em espaços reais.

## Público

Clientes residenciais e comerciais entre 26 e 55 anos em Americana, Campinas e região metropolitana, que buscam projeto e obra integrados com acompanhamento próximo.

## Diferenciais

- Arquitetura, engenharia civil e gestão de obras desenvolvidas internamente — sem terceirização
- 180+ projetos entregues em 23 cidades desde 2021
- 94 mil m² construídos e acompanhados
- Processo estruturado em 5 fases: briefing, estudo preliminar, anteprojeto, aprovações e execução
- Fiscalização semanal com relatório fotográfico e comunicação direta com o cliente

## Tom de voz

Profissional, editorial, sereno. Frases curtas. Confiança técnica sem rebuscamento.

## Paleta

Paleta real da marca (extraída do site atual da DOOME):

- `--paper #F2EFEA` — off-white quente, fundo principal
- `--paper-warm #EDE8E0`
- `--paper-cool #E6E8EB`
- `--mist #B8C2C9` — cinza-azulado do logo
- `--mist-deep #8A98A2`
- `--graphite #2A2F33` — texto principal
- `--ink #14181B` — preto profundo (seções escuras, header)
- `--petrol #1F3A47` — acento azul-petróleo (CTAs, links)
- `--petrol-soft #2C4E5E`

No `brand.json`, a paleta resumida usa: primária `#14181B` · destaque `#1F3A47` · fundo `#F2EFEA`. As cores extras ficam em `cores_extras`.

## Tipografia

- **Títulos e corpo:** Montserrat (200 / 300 / 400 / 500 / 600 + italic 300 / 400) — self-hosted em `/fonts`
- **Mono / eyebrows:** JetBrains Mono (400 / 500) — self-hosted

A "cara editorial" da DOOME vem de Montserrat 300 em tamanho grande com `letter-spacing: -0.02em` e `line-height: 0.95` (classe utilitária `.serif`). Itálicos usam `<em>` com `opacity: 0.75-0.8`.

## Estilo visual

- Editorial luxuoso, minimalista
- Imagens em P&B (grayscale + leve contraste) que ganham cor no hover
- Reveals on-scroll via IntersectionObserver
- Nav fixa com numeração (00 Home, 01 Sobre, 02 Projetos, 03 Serviços, 04 Contato)
- Page-header escuro `--ink` no topo de cada página interna
- Footer escuro `--ink` com manifesto em escala display

## Estrutura de páginas

URLs em pastas (igual ao site atual da DOOME — preserva SEO):

- `/` (home — `index.html`)
- `/sobre/` (`sobre/index.html`)
- `/projetos/` (`projetos/index.html`)
- `/servicos/` (`servicos/index.html`)
- `/contato/` (`contato/index.html`)
- `/blog/` (`blog/index.html` — gerenciado pela plataforma MAVEI)

## Regras deste projeto

- Linguagem: português do Brasil
- Não usar emojis no código ou textos
- CTA principal sempre WhatsApp
- Performance mobile é prioridade
- Fontes self-hosted (não carregar do Google Fonts CDN)
- Imagens em `.webp` com `loading="lazy"` exceto a primeira do hero

## O que NÃO alterar

- `blog/` — gerenciado pela plataforma MAVEI
