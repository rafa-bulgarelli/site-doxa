import type { Pagina } from '../../tipos';

/**
 * O recorte B2B — escrito só com o que o FAQ sustenta.
 *
 * Fronteira com as vizinhas: `/guias/como-produzir-conteudo-sem-equipe` é dona
 * do bloco "as quatro FONTES de conteúdo que já estão no seu negócio" (de onde
 * o material sai); os quatro itens desta página são TIPOS DE PEÇA para um
 * comprador corporativo, e não fontes de assunto. `/guias/marketing-organico`
 * é o hub; `/comparativos/agencia-vs-equipe-interna` trata do arranjo de quem
 * produz; `/guias/como-medir-resultado-de-conteudo-organico` é dona da medição.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "Empresas B2B também podem usar conteúdo para construir autoridade, gerar
 *    reconhecimento, educar o mercado e alcançar potenciais clientes. A
 *    estratégia, a linguagem e os formatos são adaptados ao público e ao
 *    processo comercial de cada negócio." → `docs/seo/source-of-truth.md` §7,
 *    fonte: `src/components/faq/config.ts:382-383` (usado verbatim);
 *  · público da Doxa: empresas que querem transformar conteúdo num canal
 *    previsível e escalável de crescimento → §7, fonte:
 *    `src/components/faq/config.ts:249-250`;
 *  · empresa pequena cabe, desde que exista potencial para transformar
 *    conteúdo num canal relevante de crescimento → §7, fonte:
 *    `src/components/faq/config.ts:364-365`;
 *  · "Serviços para empresas" está entre os nichos que o formulário lista —
 *    sinal de demanda, NÃO catálogo de páginas → §7, fonte:
 *    `src/components/comparacao/config.ts:369-377`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * O ciclo comercial mais longo do B2B entra como RACIOCÍNIO, nunca como
 * estatística: não há, no repositório, fonte para "o ciclo B2B dura X meses" ou
 * "Y% dos compradores pesquisam antes". Nenhuma página por indústria nasce daqui
 * — o keyword-map descarta a ideia explicitamente ("Não fazer").
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'marketing-de-conteudo-para-b2b',
  titulo: 'Marketing de conteúdo para B2B: o que muda de verdade',
  descricao:
    'Quem assiste não é uma empresa, é a pessoa que decide dentro dela. O que muda no assunto, em quem aparece, no que se mede — e quando conteúdo não compensa.',
  h1: 'Marketing de conteúdo para B2B',
  resumo:
    'A objeção de sempre — "meu cliente é empresa, não está rolando o feed" — confunde o comprador com o organograma. Quem decide a contratação é uma pessoa, e ela usa as mesmas redes que qualquer um fora do horário do expediente. O que muda em B2B não é o canal: é o assunto, quem aparece, o que se mede e o tempo até a conversa acontecer.',
  intencao: 'informacional',
  palavrasChave: [
    'marketing de conteúdo para b2b',
    'conteúdo b2b',
    'vídeo curto para empresas b2b',
    'redes sociais para b2b',
    'marketing b2b nas redes',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/solucoes/conteudo-organico-para-empresas',
    '/guias/como-medir-resultado-de-conteudo-organico',
    '/comparativos/agencia-vs-equipe-interna',
    '/guias/como-escrever-roteiro-de-video-curto',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a sua empresa vende para outras empresas e o gargalo é produzir vídeo com constância, conte o que ela precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quem assiste não é a empresa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Empresa nenhuma abre um aplicativo. Quem abre é o dono, o gerente de operações, o comprador, o sócio técnico — pessoas que, às nove da noite, rolam o mesmo feed que qualquer um. É por isso que a pergunta "meu público está nessa rede?" costuma estar mal formulada: a pergunta útil é se **a pessoa que assina o contrato** está, e ela está.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença real aparece depois do play. No B2C, o vídeo pode fechar a compra no mesmo dia. No B2B, ele quase nunca fecha nada: ele constrói reconhecimento antes da necessidade existir, para que, no dia em que ela existir, o nome da sua empresa já esteja na cabeça de quem vai procurar. Conteúdo aqui é trabalho de antecipação, não de conversão.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que muda em relação ao B2C',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Dimensão', 'O que muda quando o cliente é uma empresa'],
      linhas: [
        ['Quem decide', 'Raramente uma pessoa só: quem assiste pode ser quem indica, não quem assina'],
        ['Quando o conteúdo age', 'Meses antes da necessidade aparecer, e não no momento da compra'],
        ['O assunto que rende', 'O problema operacional do cliente, muito mais do que o seu produto'],
        ['O sinal de que funcionou', 'Conversa iniciada e nome lembrado, não venda atribuída a um vídeo'],
        ['O tom', 'Específico e técnico o bastante para o par reconhecer que você é do ramo'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A linha mais importante é a primeira. Em muitas compras corporativas, quem descobre a solução não é quem aprova o orçamento — é alguém da operação que leva o nome para a reunião. Conteúdo que só fala com o decisor final perde justamente quem faria a indicação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quatro tipos de peça que funcionam em B2B',
    },
    {
      tipo: 'lista',
      itens: [
        '**A objeção respondida sem rodeio.** Aquilo que o seu time comercial ouve toda semana e responde por telefone. Publicado, ele responde antes da ligação — e desqualifica sozinho quem não deveria entrar na fila.',
        '**O critério de decisão explicado.** O que olhar numa proposta do seu setor, o que costuma vir escondido, que pergunta separa fornecedor sério de folheto. Conteúdo útil mesmo para quem vai contratar o concorrente, e é isso que o torna crível.',
        '**O erro caro que o setor comete.** Não o erro genérico: o específico, com o número da conta ou a consequência concreta. É o formato que mais gera aquele comentário de "é exatamente isso que acontece aqui".',
        '**O processo por dentro.** Como o serviço é executado de verdade, com a etapa chata incluída. Em B2B, transparência de processo vale mais do que qualquer adjetivo sobre qualidade.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Repare no que ficou de fora: novidade da empresa, aniversário, prêmio, participação em feira. Conteúdo institucional tem lugar no site e no material comercial, e é sistematicamente o de pior desempenho num feed de recomendação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quem aparece nos vídeos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a decisão que trava mais empresa B2B, e ela tem três respostas legítimas. O **fundador ou sócio** costuma ser a mais forte, porque autoridade em mercados técnicos é pessoal antes de ser institucional. O **especialista técnico** funciona quando o assunto exige credibilidade demonstrável e a pessoa se sente à vontade. E a **marca sem rosto** — demonstração, tela gravada, processo em imagem — é a saída real para quem não quer expor ninguém, desde que a peça mostre algo concreto acontecendo.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que não funciona é o meio-termo: um vídeo com locução impessoal por cima de imagem de banco. Ele não tem pessoa nem tem demonstração, e o espectador não encontra motivo nenhum para acreditar naquilo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Medir quando o ciclo é longo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Aqui a honestidade custa barato e evita frustração: nenhum painel de rede social vai ligar um contrato assinado ao vídeo que plantou o nome seis meses antes. O que sobra é bom o suficiente — a fatia do alcance que veio de quem não segue o perfil, o volume de conversas iniciadas por trimestre e as buscas pelo nome da empresa ao longo dos meses. A rotina completa está em [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando conteúdo não é a alavanca certa',
    },
    {
      tipo: 'lista',
      itens: [
        'Quando o mercado inteiro cabe numa lista de poucas dezenas de empresas: abordagem direta chega mais rápido e mais barato do que audiência.',
        'Quando a empresa precisa de receita em semanas: conteúdo orgânico não é um canal de urgência, e forçá-lo a ser produz gasto sem resultado.',
        'Quando não há ninguém para responder às mensagens que o conteúdo gera. Demanda criada e não atendida é pior do que demanda não criada.',
        'Quando o produto ainda muda toda semana: o conteúdo publicado hoje continua no ar, e ele vai descrever algo que deixou de existir.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É a resposta que a Doxa dá quando perguntam se a operação serve a quem vende para empresas: "empresas B2B também podem usar conteúdo para construir autoridade, gerar reconhecimento, educar o mercado e alcançar potenciais clientes. A estratégia, a linguagem e os formatos são adaptados ao público e ao processo comercial de cada negócio." Não há oferta diferente por setor — o que muda é o conteúdo, não o pacote.',
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
          pergunta: 'Meu cliente não usa TikTok. Ainda faz sentido?',
          resposta:
            'A pergunta a fazer não é sobre a empresa, é sobre a pessoa: o comprador, o gerente e o sócio usam redes sociais fora do expediente como qualquer um. Ainda assim, se você tem razão e aquele público específico não está numa das redes, a resposta é publicar nas que ele usa — a peça vertical é a mesma, e a decisão é de distribuição, não de formato.',
        },
        {
          pergunta: 'Devo publicar só no LinkedIn, então?',
          resposta:
            'Publicar lá é razoável e o arquivo é o mesmo, mas trocar as redes de recomendação por ele costuma custar alcance: nelas, a peça é oferecida a quem ainda não conhece a empresa, o que é exatamente o trabalho que o conteúdo B2B precisa fazer. O caminho barato é publicar nos dois lugares, já que a produção é a mesma.',
        },
        {
          pergunta: 'E se o meu mercado tiver poucos clientes possíveis?',
          resposta:
            'Aí o cálculo muda. Quando o mercado inteiro cabe numa lista curta, o alcance atinge sobretudo gente que nunca poderá comprar, e abordagem direta chega antes. Conteúdo ainda pode valer como reforço — a pessoa reconhecer o nome antes da ligação muda a conversa —, mas como apoio ao comercial, não como canal principal de aquisição.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Peça ao seu time comercial as dez perguntas que mais aparecem numa reunião de venda e as três objeções que mais derrubam proposta. São treze vídeos, todos com roteiro pronto — a resposta que alguém da sua empresa já dá de improviso, escrita. Como transformá-la numa peça está em [como escrever roteiro de vídeo curto](/guias/como-escrever-roteiro-de-video-curto).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: quem assiste é a pessoa que decide, não a
 *          empresa; o que muda não é o canal.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2, §7). A
 *          resposta de B2B é citada VERBATIM.
 * [x]  3. Nada da §9: sem preço, sem prazo, sem "1.500 clientes", sem
 *          licenciamento.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: o recorte B2B. As FONTES de assunto são de
 *          /guias/como-produzir-conteudo-sem-equipe (aqui são TIPOS DE PEÇA); a
 *          medição é de /guias/como-medir-resultado-de-conteudo-organico.
 * [x]  7. Incremental: a tabela do que muda, quem aparece e a seção sobre
 *          quando conteúdo NÃO é a alavanca certa.
 * [x]  8. title (52 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/marketing-organico; links contextuais úteis.
 * [x] 10. Não é comparativo; ainda assim lista quatro situações em que a
 *          recomendação é não investir em conteúdo.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing; nenhuma página por indústria nasce daqui (keyword-map,
 *          "Não fazer").
 * [x] 13. Vocabulário do dono: "canal previsível", "operação", "auditoria
 *          estratégica".
 * [x] 14. Teste final (§45): sim — é o que eu diria a um sócio de empresa
 *          técnica que acha que rede social não é para ele.
 * ────────────────────────────────────────────────────────────────────────── */
