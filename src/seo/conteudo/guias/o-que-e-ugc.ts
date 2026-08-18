import type { Pagina } from '../../tipos';

/**
 * ADJACÊNCIA (§47 do brief 011). "UGC" é busca vizinha e NÃO é o que a Doxa
 * produz. A página é editorial do começo ao fim: explica os dois sentidos da
 * sigla, o mercado que nasceu do segundo, e diz com todas as letras que a Doxa
 * não trabalha nesse formato. A ponte é o comparativo, não uma oferta.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa produz conteúdo vertical em escala para empresas e agências, e o
 *    vídeo é publicado pelo cliente no perfil dele → fonte:
 *    `docs/seo/source-of-truth.md` §1 e §2 (`public/llms.txt:6`;
 *    `src/components/HowItWorks.tsx:92`);
 *  · o entregável é o vídeo pronto para postar, vertical, legendado, no formato
 *    do feed → fonte: `docs/seo/source-of-truth.md` §2;
 *  · a Doxa não é agência, não é tráfego pago e não vende curso, ferramenta nem
 *    assinatura → fonte: `docs/seo/source-of-truth.md` §1 (`public/llms.txt:40-43`);
 *  · nos perfis com a estratégia ativa é proibido impulsionar publicações →
 *    fonte: `docs/seo/source-of-truth.md` §8 (`supabase/manual-seed-v1.sql:241`);
 *  · engajamento artificial contamina resultados → fonte: §8 do mesmo arquivo;
 *  · retorno em até 24 horas → fonte: `docs/seo/source-of-truth.md` §2.
 *
 * O resto descreve um mercado — o que é um criador de UGC, o que costuma estar
 * num contrato de cessão de uso, como a publicidade é sinalizada — sem citar
 * preço de cachê, número de criadores ou qualquer estatística: não há fonte
 * citável para nenhum desses números no projeto.
 *
 * O que NÃO está aqui de propósito: tabela de preço de UGC, nome de plataforma
 * de intermediação e qualquer sugestão de que a Doxa atenda esse formato.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'o-que-e-ugc',
  titulo: 'O que é UGC e por que a sigla virou duas coisas',
  descricao:
    'UGC começou como conteúdo espontâneo de usuário e virou também um formato pago com estética caseira. Os dois sentidos, o que muda no contrato e nos direitos.',
  h1: 'O que é UGC',
  resumo:
    'UGC é a sigla de user generated content — conteúdo gerado pelo usuário — e hoje ela nomeia duas coisas diferentes: o conteúdo espontâneo que um cliente publica por vontade própria e o conteúdo pago que um criador produz para a marca usar, com aparência de vídeo caseiro. Confundir os dois é o que faz uma campanha inteira sair errada, porque o valor de cada um vem de lugares opostos.',
  intencao: 'informacional',
  palavrasChave: [
    'o que é ugc',
    'user generated content',
    'ugc creator',
    'conteúdo gerado pelo usuário',
    'ugc para marcas',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/glossario/ugc',
    '/comparativos/ugc-vs-conteudo-de-marca',
    '/solucoes/videos-curtos-para-empresas',
    '/guias/estrategia-de-conteudo-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o que a sua empresa precisa não é uma campanha com criadores, e sim vídeo próprio publicado com constância, conte o que precisa ir ao ar. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O sentido original: conteúdo que o cliente fez porque quis',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No sentido em que a sigla nasceu, UGC é qualquer conteúdo publicado por quem consome a marca sem ter sido contratado para isso: a foto do prato, o vídeo do desembrulho, a reclamação, o comentário, a avaliação com nota. O valor dele vem de uma coisa só — **ninguém pagou**. É prova social no sentido literal, e é por isso que uma marca não fabrica esse tipo de conteúdo: ela só cria as condições para que ele aconteça.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esse UGC não é uma tática de produção, é uma consequência de produto e de atendimento. As alavancas reais são banais: um produto que rende foto, uma embalagem que rende vídeo, um pedido explícito no pós-venda, um espaço na loja que convida a gravar, e alguém respondendo quem publicou. Nenhuma delas passa pelo time de conteúdo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O segundo sentido: o criador de UGC',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nos últimos anos a sigla passou a nomear também um serviço: o **criador de UGC** é contratado pela marca para produzir vídeos com aparência de conteúdo caseiro — celular na mão, luz de casa, fala direta — que a própria marca depois usa nos canais dela, com ou sem verba de mídia por trás. Não há espontaneidade nenhuma nesse arranjo. Há briefing, prazo, aprovação e pagamento.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Não é a mesma coisa que marketing de influência, e a confusão custa caro. Quando uma marca contrata um influenciador, ela está comprando **audiência**: o vídeo vai ao ar no perfil dele, para os seguidores dele. Quando contrata um criador de UGC, ela está comprando **produção**: o vídeo é entregue como arquivo e vai ao ar nos canais da marca. O primeiro tem alcance embutido; o segundo, não.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['', 'UGC espontâneo', 'Criador de UGC', 'Influenciador'],
      linhas: [
        ['Quem produz', 'O cliente, por vontade própria', 'Um criador contratado', 'Um criador com audiência'],
        ['Quem publica', 'O cliente, no perfil dele', 'A marca, nos canais dela', 'O criador, no perfil dele'],
        ['O que a marca compra', 'Nada — não se compra', 'Produção do vídeo', 'Acesso à audiência'],
        ['De onde vem o alcance', 'Da rede do cliente', 'Dos canais da própria marca', 'Dos seguidores do criador'],
        ['Precisa sinalizar publicidade', 'Não', 'Sim, quando publicado como anúncio', 'Sim'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que precisa estar no contrato',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A parte que mais gera problema em campanha com criador não é criativa, é contratual. Três pontos costumam ser esquecidos e resolvidos tarde:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Cessão de uso e prazo.** O vídeo entregue pode ser usado por quanto tempo, em quais canais e em anúncio pago? Uso ilimitado e uso por noventa dias não custam a mesma coisa e não deveriam ser tratados como se custassem.',
        '**Imagem e voz da pessoa.** O criador aparece no vídeo, e a autorização de imagem é separada da entrega do arquivo. Sem ela, a marca tem um vídeo que não pode veicular.',
        '**Exclusividade.** O mesmo criador pode gravar para um concorrente na semana seguinte? Se a resposta importa, ela precisa estar escrita.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Conteúdo pago com aparência de espontâneo precisa ser sinalizado como publicidade quando é veiculado como anúncio ou como conteúdo patrocinado. A estética caseira é uma escolha de linguagem; ela não dispensa a marcação.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que UGC resolve — e o que ele não resolve',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Resolve credibilidade e resolve variedade de rosto: cinco criadores diferentes dizendo a mesma coisa em cinco casas diferentes rendem cinco criativos que não parecem a mesma peça. Por isso o formato encontrou lugar natural em campanha de performance, em que a fadiga de criativo é um problema mensurável.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que ele **não** resolve é a operação de conteúdo do perfil da marca. Uma campanha com criadores tem começo, meio e fim; o perfil da empresa precisa publicar depois que a campanha termina. Também não resolve consistência de discurso — cada criador escreve do jeito dele, e o repertório da marca não se acumula em lugar nenhum. E não resolve custo por peça em volume alto: o preço é por vídeo, e ele não cai porque você pediu mais.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A decisão entre os dois caminhos, com os critérios lado a lado, está em [UGC ou conteúdo de marca](/comparativos/ugc-vs-conteudo-de-marca).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Duas coisas que não são UGC, por mais que pareçam',
    },
    {
      tipo: 'lista',
      itens: [
        '**Comentário e engajamento comprados.** Além de não ser conteúdo de usuário nenhum, engajamento artificial contamina a leitura do que funciona e pode gerar penalização das redes. É o oposto de prova social: é ruído comprado.',
        '**Depoimento escrito pela marca e lido por um cliente.** Vira anúncio testemunhal, com as obrigações de um anúncio. Continua sendo uma peça legítima — só não é espontânea, e tratá-la como se fosse é o que gera crise quando alguém descobre.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Para deixar claro de que lado desta página a Doxa está: ela não produz UGC nem intermedeia criadores. O que ela faz é conteúdo vertical em escala para o perfil da própria empresa — o vídeo chega pronto para postar, e quem publica é o cliente, no canal dele. São coisas diferentes, e nem sempre concorrentes.',
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
          pergunta: 'Criador de UGC precisa ter seguidores?',
          resposta:
            'Não, e essa é a diferença que define o serviço. O que a marca contrata é a produção do vídeo, não o acesso à audiência de quem gravou — a peça vai ao ar nos canais da marca. Quem cobra por audiência está vendendo outro serviço, e a conta é outra.',
        },
        {
          pergunta: 'Posso republicar no perfil da empresa o vídeo que um cliente postou?',
          resposta:
            'Só com autorização de quem publicou. A postagem ser pública não transfere direito de uso, e a imagem da pessoa que aparece continua sendo dela. O caminho seguro é pedir por escrito, combinar onde o vídeo será usado e por quanto tempo, e guardar a resposta.',
        },
        {
          pergunta: 'UGC funciona melhor do que vídeo produzido pela marca?',
          resposta:
            'Depende do que a peça precisa fazer. Para quebrar desconfiança de quem nunca comprou, a estética de pessoa comum costuma render mais; para explicar um produto complexo, sustentar posicionamento ou publicar todo dia no perfil da empresa, o conteúdo produzido pela marca é mais previsível e mais barato por peça em volume.',
        },
        {
          pergunta: 'Dá para montar uma operação só com UGC?',
          resposta:
            'Dá para alimentar uma campanha, não uma rotina de publicação. Um perfil que publica com constância precisa de fila de conteúdo, e fila de conteúdo com criadores externos significa briefing, negociação e aprovação a cada peça — o custo de coordenação cresce mais rápido do que o volume.',
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
        'UGC espontâneo você conquista; UGC de criador você contrata; e nenhum dos dois substitui o conteúdo que a sua empresa precisa publicar no próprio perfil na semana que vem.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase define a sigla e já anuncia os dois sentidos.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (o que ela produz, quem
 *          publica, o que ela não é, engajamento artificial, 24 horas).
 * [x]  3. Nada da §9: sem preço de cachê, sem direitos do vídeo da Doxa, sem
 *          número de clientes.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A página não cita a garantia.
 * [x]  6. Intenção própria: o verbete define em poucas linhas, o comparativo
 *          decide entre formatos, esta página explica os dois sentidos.
 * [x]  7. Informação incremental: a tabela de três colunas separando UGC
 *          espontâneo, criador e influenciador, e os três pontos de contrato.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de vídeos curtos; links para o verbete, o comparativo e a solução
 *          de formato. Nenhum link decorativo.
 * [x] 10. Imparcial: diz onde UGC ganha e onde ele não resolve, e declara que
 *          a Doxa não atua nesse formato (§47).
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "conteúdo vertical em
 *          escala", "quem publica é o cliente".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
