import type { Pagina } from '../../tipos';

/**
 * O par do guia `/guias/o-que-e-ugc` (§47 do brief): lá a sigla é explicada,
 * aqui se decide entre dois formatos. A Doxa está de um lado — produz conteúdo
 * de marca — e a página só diz isso no fim, depois de dar ao UGC as situações
 * em que ele ganha, com nome e motivo.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa produz conteúdo vertical em escala para empresas e agências →
 *    fonte: `docs/seo/source-of-truth.md` §1 (`public/llms.txt:6`);
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → fonte: §2
 *    (`supabase/manual-seed-v2.sql:168`);
 *  · o entregável é o vídeo pronto para postar, e quem publica é o cliente, no
 *    perfil dele → fonte: §2 (`src/components/HowItWorks.tsx:92`);
 *  · identidade, posicionamento, público e restrições são mapeados no início e
 *    orientam a produção → fonte: §2 (`src/components/faq/config.ts:485-486`);
 *  · a Doxa não é tráfego pago e não vende curso, ferramenta nem assinatura →
 *    fonte: §1 (`public/llms.txt:42-43`);
 *  · retorno em até 24 horas → fonte: §2.
 *
 * Não há aqui nenhum número de mercado: nem cachê de criador, nem taxa de
 * conversão, nem comparação de CPA. Não existe fonte citável para nenhum deles
 * no projeto, e a régua de copy proíbe estatística sem fonte nomeada.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'ugc-vs-conteudo-de-marca',
  titulo: 'UGC ou conteúdo de marca: quando cada um converte',
  descricao:
    'Vídeo de criador com cara de cliente ou conteúdo produzido pela empresa: o que cada formato compra, quanto custa por peça e onde fica o direito de uso.',
  h1: 'UGC ou conteúdo de marca',
  resumo:
    'UGC de criador compra credibilidade emprestada e variedade de rosto; conteúdo de marca compra consistência, direito de uso e um repertório que se acumula. Os dois convertem, em momentos diferentes da decisão de compra — e a escolha erra quando é feita por preço da peça em vez de por função dela.',
  intencao: 'informacional',
  palavrasChave: [
    'ugc ou conteúdo de marca',
    'ugc vs branded content',
    'vídeo de criador ou da marca',
    'conteúdo de marca',
    'criativo de anúncio ugc',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/o-que-e-ugc',
    '/glossario/ugc',
    '/solucoes/videos-curtos-para-empresas',
    '/solucoes/producao-de-conteudo-em-escala',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a decisão for construir conteúdo próprio com constância, conte o que a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que está sendo comparado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'De um lado, o vídeo produzido por um criador contratado, com estética de conteúdo caseiro, que a marca usa como criativo — em anúncio ou no próprio perfil. Do outro, o conteúdo produzido pela empresa ou para ela, publicado no perfil dela, com a marca aparecendo como marca. Não é uma comparação entre amador e profissional: os dois são pagos, os dois têm briefing, e a diferença está no que cada um compra. Se a dúvida ainda é o que a sigla significa, ela está em [o que é UGC](/guias/o-que-e-ugc).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O critério que organiza a decisão é a **função da peça**: UGC serve para quebrar desconfiança de quem nunca comprou; conteúdo de marca serve para construir a razão de comprar e mantê-la de pé depois. Um trabalha o instante da dúvida, o outro trabalha o tempo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'UGC de criador', 'Conteúdo de marca'],
      linhas: [
        ['Quem aparece', 'Um criador, com cara de pessoa comum', 'A empresa, a equipe ou quem responde por ela'],
        ['O que a peça compra', 'Credibilidade emprestada', 'Autoridade e memória de marca'],
        ['Onde costuma render mais', 'Anúncio e teste de criativo', 'Perfil próprio e rotina de publicação'],
        ['Custo por peça', 'Negociado a cada vídeo e a cada criador', 'Concentrado no processo, e cai com volume'],
        ['Prazo de entrega', 'Depende da agenda de terceiros', 'Depende do processo de produção'],
        ['Consistência de discurso', 'Baixa: cada criador escreve do jeito dele', 'Alta: o repertório se acumula'],
        ['Direito de uso', 'Negociado — canal, prazo e mídia', 'Da empresa desde a origem'],
        ['O que fica no fim', 'Um lote de criativos com prazo de uso', 'Biblioteca própria e audiência no perfil'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando o UGC converte melhor',
    },
    {
      tipo: 'lista',
      itens: [
        '**Produto novo, marca desconhecida.** Quem nunca ouviu falar da empresa acredita mais em alguém parecido com ele do que na própria empresa.',
        '**Objeção de uso.** "Funciona mesmo?", "é difícil de montar?", "cabe em mim?". Mostrar uma pessoa comum usando responde o que nenhum texto responde.',
        '**Anúncio com fadiga de criativo.** Campanha que roda muito tempo cansa. Cinco criadores rendem cinco peças diferentes sem refazer produção.',
        '**Categorias de consumo cotidiano.** Beleza, alimentação, casa, vestuário — em que a experiência do outro é a informação que falta.',
        '**Teste rápido de ângulo.** Antes de investir numa produção maior, vale descobrir qual promessa segura a atenção, e isso sai barato com criador.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando o conteúdo de marca converte melhor',
    },
    {
      tipo: 'lista',
      itens: [
        '**Venda que depende de confiança na empresa.** Serviço, consultoria, saúde, direito, educação, B2B: quem compra quer saber quem está do outro lado.',
        '**Explicação que exige precisão.** Regra, prazo, condição, dado técnico. Um criador contratado dificilmente domina o assunto na profundidade necessária, e o erro é caro.',
        '**Rotina de publicação.** Perfil que publica todo dia útil não se sustenta com campanha: precisa de fila de conteúdo e de processo.',
        '**Posicionamento.** Ser lembrado por uma ideia específica exige repetir a mesma ideia com variação, coisa que só quem é dono do discurso faz.',
        '**Uso longo do material.** Peça própria pode ser reeditada, republicada e reaproveitada por anos, sem renegociar direito de imagem.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta depende de onde está o gargalo da sua venda. Se o obstáculo é desconfiança de quem nunca comprou, UGC resolve antes. Se o obstáculo é não ser conhecido nem lembrado, conteúdo de marca resolve — e demora mais. Fazer os dois é possível, e a ordem tem consequência: o conteúdo de marca é o que sustenta a rotina do perfil, e o UGC entra como campanha em cima dela — no arranjo inverso, o perfil fica vazio no dia em que a campanha termina.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O custo escondido de cada lado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No UGC, o custo que não aparece na proposta é o de **coordenação**: encontrar criadores, escrever briefing, aprovar, pedir refação, negociar cessão de uso e controlar prazo de veiculação — por peça, toda vez. Uma campanha com dez criadores é uma operação de dez fornecedores, e ela não fica mais barata quando cresce.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No conteúdo de marca, o custo escondido é o de **processo**: sem uma fila de pautas, um padrão de roteiro e alguém responsável por publicar, o perfil oscila entre semanas com cinco vídeos e meses com nenhum. É o formato que rende mais no longo prazo e o que mais depende de constância para render alguma coisa.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A Doxa está de um lado só desta comparação: produz conteúdo de marca em escala — cada vídeo único, com roteiro, voz, edição e capa, orientado pela identidade e pelo tom de voz mapeados no início da operação. Ela não produz UGC nem intermedeia criadores. O vídeo chega pronto para postar, e quem publica é o cliente, no perfil dele.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perguntas frequentes',
    },
    {
      tipo: 'faq',
      itens: [
        {
          pergunta: 'Dá para usar UGC no perfil da marca, e não só em anúncio?',
          resposta:
            'Dá, desde que a cessão de uso cubra esse canal e o vídeo não destoe do resto do perfil. O risco não é jurídico apenas: uma sequência de rostos diferentes falando pela empresa dilui quem é a empresa. Funciona melhor como intercalação — a voz da marca sustenta a rotina, o vídeo de criador entra como prova.',
        },
        {
          pergunta: 'Conteúdo de marca precisa ter aparência profissional?',
          resposta:
            'Precisa ter aparência coerente, que é diferente. Vídeo gravado no celular, com luz de escritório e corte simples, funciona bem em vídeo curto — o que não pode variar é o jeito de falar, a promessa e a qualidade da informação. Produção cara com roteiro fraco rende menos que o contrário.',
        },
        {
          pergunta: 'O que precisa estar no contrato com um criador de UGC?',
          resposta:
            'Três coisas, no mínimo: por quanto tempo e em quais canais o vídeo pode ser usado, se ele pode ser veiculado como anúncio pago, e a autorização de uso da imagem e da voz de quem aparece. Sem elas, a empresa tem um arquivo que não pode publicar, e descobre isso no dia em que a campanha ia subir.',
        },
        {
          pergunta: 'Qual dos dois escala melhor?',
          resposta:
            'Conteúdo de marca, porque o custo está no processo e não em cada fornecedor: definido o padrão, produzir a peça número sessenta custa menos que a número dez. UGC escala por soma — mais peças exigem mais criadores, mais briefings e mais contratos —, e o custo de coordenação cresce junto com o volume.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Em uma frase',
    },
    {
      tipo: 'paragrafo',
      texto:
        'UGC empresta a credibilidade de outra pessoa por um prazo contratado; conteúdo de marca constrói a sua e fica com ela — e quase nenhuma empresa deveria escolher o primeiro sem ter o segundo de pé.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o que cada formato compra.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (conteúdo vertical em
 *          escala, vídeo único, identidade mapeada, quem publica, 24 horas).
 * [x]  3. Nada da §9: sem cachê, sem CPA, sem preço.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada nesta página.
 * [x]  6. Intenção própria: decidir entre formatos. O verbete define; o guia
 *          explica os dois sentidos da sigla; aqui se escolhe.
 * [x]  7. Informação incremental: a tabela de oito critérios, os custos
 *          escondidos dos dois lados e os três pontos de contrato.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de vídeos curtos; links para o guia, o verbete e as duas soluções
 *          do cluster.
 * [x] 10. IMPARCIAL: cinco situações em que o UGC ganha, com nome e categoria,
 *          e o custo escondido do lado da Doxa também está escrito.
 * [x] 11. CTA único, no fim, condicionado.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "em escala", "cada vídeo
 *          é único".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
