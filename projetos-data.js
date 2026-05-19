/* ============================================================
   projetos-data.js — Fonte única de dados dos projetos DOOME.
   Carregado em todas as páginas que usam o lightbox.

   Para adicionar mais fotos a um projeto:
     1. Adicione os arquivos em /assets/projetos/{id}/02.webp, 03.webp, etc
     2. Aumente o número em `imagens` abaixo
   ============================================================ */

window.DOOME_PROJETOS = [
  {
    id: 'projeto-ar',
    n: '01',
    nome: 'Projeto A.R.',
    tag: 'Residencial',
    ano: '2025',
    local: 'Nova Odessa / SP',
    area: 'Projeto Residencial',
    imagens: 5,
    descricao: 'Residência contemporânea com fachada em vidro e integração entre arquitetura, jardim e área de acesso. Linhas limpas e materiais nobres traduzindo a identidade da família em cada ambiente. O programa foi pensado para a vida cotidiana com leveza — áreas sociais generosas, transição suave entre dentro e fora, e iluminação natural valorizada em todos os ambientes.',
    specs: {
      'Área construída': '~ Projeto residencial',
      'Local': 'Nova Odessa, SP',
      'Ano': '2025',
      'Tipo': 'Residencial unifamiliar',
      'Programa': 'Living integrado, suítes, área gourmet, garagem coberta',
      'Status': 'Concluído',
      'Escopo Doome': 'Arquitetura, Engenharia e Gestão de Obra',
    },
  },
  {
    id: 'tectron-paulinia',
    n: '02',
    nome: 'Tectron',
    tag: 'Comercial',
    ano: '2024',
    local: 'Paulínia / SP',
    area: 'Projeto Corporativo',
    imagens: 5,
    descricao: 'Fachada corporativa com vidro refletivo, volume marcante e leitura institucional para a marca Tectron. Projeto que comunica solidez e modernidade na entrada da empresa, com tratamento térmico e acústico calibrado para o conforto dos colaboradores.',
    specs: {
      'Local': 'Paulínia, SP',
      'Ano': '2024',
      'Tipo': 'Corporativo / Comercial',
      'Programa': 'Sede administrativa, recepção, salas de reunião',
      'Status': 'Concluído',
      'Escopo Doome': 'Arquitetura e Projeto de Fachada',
    },
  },
  {
    id: 'mr-carvalho-sbo',
    n: '03',
    nome: 'Mr. Carvalho',
    tag: 'Comercial',
    ano: '2024',
    local: 'Santa Bárbara d’Oeste / SP',
    area: 'Loja Comercial',
    imagens: 5,
    descricao: 'Fachada comercial valorizando vitrine, identidade visual e experiência de entrada do cliente. Projeto que destaca o produto desde o primeiro olhar do passante, com iluminação cenográfica e revestimentos que dialogam com a marca.',
    specs: {
      'Local': 'Santa Bárbara d’Oeste, SP',
      'Ano': '2024',
      'Tipo': 'Comercial / Varejo',
      'Programa': 'Loja, vitrine, área de atendimento',
      'Status': 'Concluído',
      'Escopo Doome': 'Arquitetura Comercial e Identidade Visual aplicada',
    },
  },
  {
    id: 'projeto-dp',
    n: '04',
    nome: 'Projeto D.P.',
    tag: 'Interiores',
    ano: '2025',
    local: 'Americana / SP',
    area: '280 m²',
    imagens: 5,
    descricao: 'Cozinha gourmet integrada ao living, marcenaria azul petróleo, bancada em quartzito branco e iluminação pendente articulada. Interiores pensados para conviver e receber com elegância — cada peça selecionada para criar atmosfera sem peso visual.',
    specs: {
      'Área': '280 m²',
      'Local': 'Americana, SP',
      'Ano': '2025',
      'Tipo': 'Interiores residenciais',
      'Programa': 'Living integrado, cozinha gourmet, jantar',
      'Status': 'Concluído',
      'Escopo Doome': 'Projeto de Interiores e Marcenaria',
    },
  },
  {
    id: 'residencia-fabiana-danilo',
    n: '05',
    nome: 'Residência F.D.',
    tag: 'Residencial',
    ano: '2024',
    local: 'Tupi / SP',
    area: '380 m²',
    imagens: 5,
    descricao: 'Terraço gourmet com churrasqueira em pedra travertino, área verde elevada e pergolado de vidro com vista panorâmica. Casa que abraça a paisagem em cada ambiente externo, valorizando os encontros e a vida ao ar livre.',
    specs: {
      'Área': '380 m²',
      'Local': 'Tupi, SP',
      'Ano': '2024',
      'Tipo': 'Residencial unifamiliar',
      'Programa': 'Terraço gourmet, área verde, pergolado, vista panorâmica',
      'Status': 'Concluído',
      'Escopo Doome': 'Arquitetura, Engenharia e Gestão de Obra',
    },
  },
  {
    id: 'residencia-rs',
    n: '06',
    nome: 'Residência R.S.',
    tag: 'Residencial',
    ano: '2024',
    local: 'Americana / SP',
    area: '900 m²',
    imagens: 5,
    descricao: 'Residência contemporânea com fachada em concreto aparente, revestimento em tijolo e volumetria marcante com cobertura plana. Projeto de grande porte com personalidade autoral — composição de volumes, jogo de cheios e vazios, e materialidade bruta refinada.',
    specs: {
      'Área': '900 m²',
      'Local': 'Americana, SP',
      'Ano': '2024',
      'Tipo': 'Residencial de alto padrão',
      'Programa': 'Múltiplas suítes, áreas sociais, espaço externo de eventos',
      'Status': 'Concluído',
      'Escopo Doome': 'Arquitetura, Engenharia e Gestão de Obra',
    },
  },
];

window.DOOME_PROJETOS_BY_ID = window.DOOME_PROJETOS.reduce(function(acc, p){
  acc[p.id] = p;
  return acc;
}, {});
