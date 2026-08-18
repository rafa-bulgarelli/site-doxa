import type { Pagina } from '../../tipos';

/**
 * ADJACÊNCIA EDITORIAL (§47): a busca é de quem está decidindo contratar
 * alguém, e a página responde a pergunta do cargo inteira antes de mencionar a
 * Doxa — que entra UMA vez, no destaque, dizendo o que ela faz (produção de
 * vídeo) e o que ela não faz (gestão de rede), mais o `cta`.
 *
 * Fronteira real com as vizinhas (medida, não afirmada):
 *  · `/comparativos/agencia-vs-equipe-interna` é dono da comparação DENTRO ×
 *    FORA (e do inventário do "jeito antigo", com os números de custo);
 *    `/comparativos/freelancer-vs-agencia-de-conteudo` é dono de PESSOA ×
 *    ESTRUTURA e do bloco "a cadeia de um vídeo não cabe num cargo só". Esta
 *    página não repete nenhuma das duas tabelas: a daqui tem por eixo as
 *    FRENTES DE TRABALHO do cargo (pauta, produção diária, conversa, leitura,
 *    o que trava primeiro), que não aparecem em nenhuma das outras;
 *  · `/guias/como-produzir-conteudo-sem-equipe` é dono do inventário de
 *    assuntos e `/guias/como-postar-todos-os-dias-sem-equipe` é dono da rotina
 *    de produção (lote, fila, padrão). Aqui os dois viram coluna de tabela e
 *    link, nunca bloco;
 *  · `/guias/como-medir-resultado-de-conteudo-organico` é dono das métricas: a
 *    leitura de número entra só como frente do cargo, com link.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa produz conteúdo vertical em escala para empresas e agências →
 *    `docs/seo/source-of-truth.md` §1, fonte: `public/llms.txt:6`;
 *  · a Doxa NÃO é agência — não há equipe de gravação, estúdio nem calendário
 *    editorial do lado do cliente → §1, fonte: `public/llms.txt:40-41`;
 *  · o entregável é o arquivo do vídeo pronto para postar, vertical e
 *    legendado, e quem publica é o cliente, no perfil dele → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`;
 *  · retorno em até 24 horas para marcar a auditoria estratégica → §2, fonte:
 *    `public/llms.txt:47-49`; `src/components/comparacao/config.ts:273,297`.
 *
 * O que foi DEIXADO DE FORA de propósito:
 *  · qualquer faixa de remuneração, piso, média de mercado ou tabela de
 *    sindicato. Não há fonte para nenhuma no repositório, e a página que
 *    responde "o que faz" com um número de remuneração está adivinhando;
 *  · o inventário das 25 contratações e o custo de operação interna. O social
 *    media aparece naquela lista, mas o bloco tem dono
 *    (`/comparativos/agencia-vs-equipe-interna`) e citá-lo aqui só para ter um
 *    número seria repetir o bloco de outra página — e uma segunda menção à
 *    Doxa numa página que deve mencioná-la uma vez;
 *  · quantificador sobre o cargo ("tantos por cento fazem X"): nada
 *    disso é observável a partir deste repositório. O que a página afirma sobre
 *    o cargo é raciocínio declarado como tal, ou está hedgeado.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'o-que-faz-um-social-media',
  titulo: 'O que faz um social media: o escopo real do cargo',
  descricao:
    'O que entra e o que não entra no cargo, como o trabalho mudou quando o feed virou vídeo e as três saídas quando a fila de peças não cabe numa pessoa.',
  h1: 'O que faz um social media',
  resumo:
    'Um social media cuida do que acontece em volta da publicação: decide o assunto da semana, escreve o texto que vai junto do post, publica, responde quem aparece nos comentários e nas mensagens e lê os números para decidir o mês seguinte. O que o cargo raramente inclui — e é aí que a contratação frustra — é produzir o vídeo em volume. Abaixo, o escopo real do trabalho, o que mudou quando o feed virou vídeo, e as três saídas quando a fila de peças não cabe numa pessoa.',
  intencao: 'informacional',
  palavrasChave: [
    'o que faz um social media',
    'funções do social media',
    'social media o que é',
    'contratar social media',
    'gestor de redes sociais funções',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/guias/marketing-organico',
    '/comparativos/agencia-vs-equipe-interna',
    '/comparativos/freelancer-vs-agencia-de-conteudo',
    '/guias/como-produzir-conteudo-sem-equipe',
    '/guias/como-postar-todos-os-dias-sem-equipe',
    '/guias/como-medir-resultado-de-conteudo-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a cadeira do social media já tem dono e o que falta é a peça de todo dia útil, conte para a Doxa quanto a sua empresa precisa publicar por mês; o retorno vem em até 24 horas, e serve para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A semana da pessoa, não a lista de verbos da vaga',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A descrição de vaga costuma ser uma fileira de verbos — planejar, criar, engajar, monitorar — que não ajuda ninguém a decidir uma contratação. O que ajuda é olhar a semana: o que essa pessoa entrega de segunda a sexta, e o que fica sem dono quando ela falta.',
    },
    {
      tipo: 'lista',
      itens: [
        '**A pauta.** O que a empresa vai dizer nesta semana e por quê — a partir do que o comercial ouviu, do que a audiência perguntou e do que já saiu.',
        '**O texto que acompanha a peça.** Legenda, descrição, chamada, primeira linha. É o único conteúdo que o cargo costuma escrever do começo ao fim.',
        '**A publicação.** Subir a peça no lugar certo, na hora combinada, com a capa certa. Parece trivial até faltar quem faça isso todo dia.',
        '**A conversa.** Comentários, mensagens e menções — e a decisão do que responder, do que encaminhar ao comercial e do que deixar quieto.',
        '**A leitura.** Que peça segurou atenção, que assunto morreu, o que repetir no mês seguinte — o item que some primeiro quando a semana aperta. O que fazer com esses números está em [como medir resultado de conteúdo orgânico](/guias/como-medir-resultado-de-conteudo-organico).',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Somadas, as cinco frentes descrevem uma função de coordenação e de relacionamento, bem mais do que de produção — e é por isso que ela entra em crise quando a empresa passa a depender de vídeo diário.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que costuma ficar de fora, e vira surpresa depois',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A frustração mais comum com o cargo nasce de uma expectativa que ninguém escreveu: contrata-se alguém para cuidar das redes esperando que a fila de vídeos venha junto. Ela não vem. As quatro frentes abaixo são outros ofícios, e cada uma pode ou não estar na pessoa contratada — o que muda tudo é perguntar antes.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Gravar e editar em volume.** Câmera, corte, legenda gravada na imagem e capa, todo dia útil. Há quem acumule isso muito bem — mas é acúmulo, não escopo padrão.',
        '**Design.** Peça gráfica, identidade visual, apresentação. Quem escreve o texto do post nem sempre desenha o que aparece nele.',
        '**Mídia paga.** Montar campanha, distribuir verba e responder por custo por resultado é outra cadeira, confundida com esta em muito anúncio de vaga.',
        '**Atendimento comercial.** Quando a mensagem vira pedido de orçamento, a conversa deixa de ser de rede social e vira venda. Combine essa fronteira antes do primeiro pedido.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Que a cadeia inteira de um vídeo curto não cabe num cargo só é o assunto de [freelancer ou agência de conteúdo](/comparativos/freelancer-vs-agencia-de-conteudo). O efeito prático é outro: quando as quatro frentes caem sobre a mesma pessoa, o que ela sacrifica primeiro é o que não tem prazo diário — a leitura dos resultados e a resposta às mensagens.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que mudou quando o feed virou vídeo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O cargo nasceu num feed de foto e de texto, onde produzir a peça era barato e o trabalho difícil era o resto: o que dizer, quando dizer, como responder. Com vídeo curto a conta se inverteu — a peça passou a custar caro e a exigir uma habilidade que não estava na vaga original.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Três coisas se deslocaram junto. O gargalo saiu do calendário e foi para a produção: não falta o que agendar, falta o que subir. O padrão da marca passou a ser decidido na edição, e não na organização do perfil. E a pergunta que interessa deixou de ser sobre quem já segue. Nada disso torna o cargo dispensável — torna o cargo insuficiente sozinho.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Contratar, terceirizar ou tocar sem equipe',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quando a fila de vídeo aperta, costumam estar na mesa três saídas — e elas não resolvem o mesmo problema, que é o que a tabela deixa ver:',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Frente', 'Contratar um social media', 'Terceirizar a produção', 'Tocar sem equipe'],
      linhas: [
        [
          'Pauta e assunto',
          'Passa a ter dono e método',
          'Continua dentro de casa, com apoio de fora',
          'Fica com quem toca o negócio, sem intermediário',
        ],
        [
          'Gravação e edição diárias',
          'Depende do que a pessoa acumula',
          'É exatamente o que se compra',
          'Vira lote de fim de semana',
        ],
        [
          'Comentário e mensagem',
          'Ganham horário e responsável',
          'Seguem com a empresa, sem mudança',
          'Caem no meio do expediente de quem vende',
        ],
        [
          'Leitura dos números',
          'Entra na rotina da semana',
          'Divide-se entre quem produz e quem vende',
          'Acontece quando sobra tempo, ou seja, raramente',
        ],
        [
          'O que trava primeiro',
          'A produção, assim que o volume sobe',
          'A pauta, se ninguém de dentro alimentar',
          'Tudo, já no primeiro mês corrido',
        ],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Montar a estrutura dentro ou fora é o assunto de [agência ou equipe interna](/comparativos/agencia-vs-equipe-interna). Quem não vai contratar ninguém agora começa por [como produzir conteúdo sem equipe](/guias/como-produzir-conteudo-sem-equipe), e a rotina que faz o lote caber na semana está em [como postar todos os dias sem equipe](/guias/como-postar-todos-os-dias-sem-equipe).',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O diagnóstico cabe numa pergunta. Se a empresa tem o que publicar e ninguém organiza, falta um social media. Se tem quem organize e nada para publicar, falta produção. Contratar o cargo para o segundo caso é o erro que se paga por meses: a pessoa entra, organiza tudo — e continua sem peça para subir.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que perguntar antes de contratar',
    },
    {
      tipo: 'lista',
      itens: [
        '**"Me mostre um número que você mudou."** Não o print do post que estourou: o que a pessoa decidiu, o que aconteceu depois e como ela soube.',
        '**"O que você parou de fazer no último trabalho?"** Quem nunca cortou nada nunca priorizou, e o cargo vive de escolher o que fica de fora.',
        '**"Como era a sua semana, hora a hora?"** A resposta separa quem coordenou de quem executou — as duas são legítimas, e você contrata uma.',
        '**"Você grava e edita?"** Pergunte explicitamente e peça exemplo publicado. É a linha que mais gera mal-entendido depois.',
        '**"O que você faria no primeiro mês aqui?"** Plano que não menciona o comercial nem os clientes atuais já veio pronto de casa.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde termina o cargo e começa a produção',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Mesmo com a cadeira bem ocupada, a fila de vídeo continua sendo um problema separado, e é ele que costuma sobrar no fim do mês. Quem já tem quem organize precisa decidir de onde vem a peça de todo dia útil — e essa decisão não é sobre contratar mais uma pessoa para a mesma cadeira.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É essa fronteira que descreve o lugar da Doxa: ela produz vídeo vertical em escala, e não faz gestão de rede. Não responde comentário, não escreve a legenda do dia, não cuida do perfil — e não é agência: do lado do cliente não existe estúdio, equipe de gravação nem calendário editorial. À empresa chega o arquivo pronto para postar — vertical, legendado —, e é ela quem publica, no perfil dela. O trabalho descrito nesta página continua sendo de quem está dentro.',
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
          pergunta: 'Social media, gestor de tráfego e produtor de conteúdo são a mesma função?',
          resposta:
            'São três cadeiras distintas que um anúncio de vaga costuma juntar numa só. O social media organiza, publica e conversa; o gestor de tráfego opera campanha paga e responde por custo por resultado; quem produz grava, edita e entrega a peça. Acumular duas delas por um período às vezes é o certo a fazer — o que não dá é fingir que o acúmulo sai de graça.',
        },
        {
          pergunta: 'Preciso de um social media se a produção dos vídeos já é terceirizada?',
          resposta:
            'De alguém, sim, mesmo que não em tempo integral. Terceirizar a produção resolve de onde vem a peça; não resolve quem escolhe o assunto, quem responde a mensagem que chega depois do vídeo e quem olha o resultado para pedir o próximo. Sem esse lado, a operação vira uma esteira que publica e não aprende nada.',
        },
        {
          pergunta: 'A pessoa do social media deve ser o rosto dos vídeos da empresa?',
          resposta:
            'Pode ser, e costuma ser a saída mais rápida — mas é decisão de identidade, não de escala de trabalho. O rosto que a audiência aprende a reconhecer fica associado à marca por muito tempo, e uma cadeira de trabalho muda de ocupante mais rápido do que isso. No dia em que a pessoa sair, a marca troca de cara.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A pergunta que sobra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de abrir a vaga, escreva a semana que você espera dessa pessoa, hora a hora, com as cinco frentes do começo desta página ao lado. Se couber numa pessoa, contrate; se não couber, o que falta não é um social media: é decidir quem produz.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o cargo cuida do que acontece em volta da
 *          publicação, e a lista das cinco frentes vem logo em seguida.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1, §2):
 *          produz vertical em escala, não é agência, entrega o arquivo pronto
 *          para postar, quem publica é o cliente, retorno em até 24 horas.
 * [x]  3. Nada da §9: sem remuneração, sem preço, sem fidelidade, sem "agência
 *          licenciada", sem a lista de clientes que a §9.2 barra.
 * [x]  4. Termos proibidos ausentes: a Doxa não se autodefine como agência —
 *          a página afirma o contrário, com a redação pública do `llms.txt`.
 * [x]  5. A garantia não é citada nesta página, nem em número nem em prazo.
 * [x]  6. Intenção própria: o CARGO por dentro. Dentro × fora é de
 *          /comparativos/agencia-vs-equipe-interna; pessoa × estrutura é de
 *          /comparativos/freelancer-vs-agencia-de-conteudo; o inventário de
 *          assuntos é de /guias/como-produzir-conteudo-sem-equipe; a rotina de
 *          lote é de /guias/como-postar-todos-os-dias-sem-equipe. Todos entram
 *          como uma frase + link, nunca como bloco repetido.
 * [x]  7. Incremental: as cinco frentes da semana, as quatro que ficam de fora,
 *          a tabela por frente de trabalho, o diagnóstico de uma pergunta e as
 *          cinco perguntas de entrevista.
 * [x]  8. title (49 caracteres), description (149) e H1 exclusivos; H2 em
 *          hierarquia real; nenhuma célula repetida na mesma linha da tabela.
 * [x]  9. Hub /guias/marketing-organico; cinco links contextuais no corpo,
 *          cada um no ponto em que a dúvida aparece.
 * [x] 10. Não é comparativo, mas a tabela é imparcial: as três saídas têm o que
 *          trava primeiro, inclusive a de terceirizar.
 * [x] 11. CTA único, no fecho, condicionado à cadeira já ter dono.
 * [x] 12. Sem stuffing: "social media" aparece onde a frase pedia.
 * [x] 13. Vocabulário do dono: "pronto para postar", "vertical", "legendado",
 *          "em escala", "auditoria estratégica".
 * [x] 14. Teste final (§45): sim — é o que eu diria a quem está prestes a abrir
 *          uma vaga esperando que ela resolva a falta de vídeo.
 * ────────────────────────────────────────────────────────────────────────── */
