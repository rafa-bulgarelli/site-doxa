import type { Pagina } from '../../tipos';

/**
 * O guia de execução do cluster de TikTok.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "nenhuma operação promete que um vídeo específico viralize" → fonte:
 *    `docs/seo/source-of-truth.md` §1 ("O que a Doxa NÃO é"), que cita
 *    `src/components/faq/config.ts:324-325`;
 *  · um vídeo por dia útil, sem compensar acumulando no mesmo dia → fonte:
 *    `docs/seo/source-of-truth.md` §8, regra `RT-2`
 *    (`supabase/manual-seed-v1.sql:187-191`);
 *  · as 24 horas de relógio entre publicações, com o exemplo da segunda às 22h
 *    → fonte: `docs/seo/source-of-truth.md` §8, regra `RH-1`
 *    (`supabase/manual-seed-v1.sql:205-207`);
 *  · 60 conteúdos únicos em 90 dias, nas três redes, com o mesmo arquivo no
 *    mesmo dia → fonte: `docs/seo/source-of-truth.md` §8, regra `RT-1`
 *    (`supabase/manual-seed-v1.sql:183`);
 *  · engajamento artificial contamina resultados e pode gerar penalização das
 *    redes → fonte: `docs/seo/source-of-truth.md` §8
 *    (`supabase/manual-seed-v1.sql:287`);
 *  · zero impulsionamento nos perfis com a estratégia ativa → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`supabase/manual-seed-v1.sql:241`);
 *  · "baixou, publicou" → fonte: `docs/seo/source-of-truth.md` §8 e §10
 *    (`supabase/manual-seed-v1.sql:263`);
 *  · os primeiros vídeos abaixo do esperado geram dados → fonte:
 *    `docs/seo/source-of-truth.md` §2 (`src/components/faq/config.ts`,
 *    resposta `primeiros-videos`);
 *  · views das metas 100% orgânicas, sem compra de mídia → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`src/components/faq/config.ts:174-175`);
 *  · retorno em até 24 horas e auditoria estratégica → fonte:
 *    `docs/seo/source-of-truth.md` §2 (`public/llms.txt:47-49`;
 *    `src/components/comparacao/config.ts:273,297`).
 *
 * O resto — como o feed distribui, o que é hook, o que é retenção — é mecânica
 * pública da plataforma, escrita sem número de terceiro: nenhuma estatística de
 * mercado entra aqui, porque não há fonte citável no repositório para nenhuma.
 *
 * O que NÃO está aqui de propósito: promessa de prazo para viralizar, preço,
 * volume de busca e qualquer número sobre o TikTok. Ver §9 do source of truth.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-viralizar-no-tiktok',
  titulo: 'Como viralizar no TikTok: o que dá para controlar',
  descricao:
    'Viralizar não é uma tática que se aplica: é consequência de hook, retenção, cadência e volume. O que dá para controlar no TikTok — e o que não dá.',
  h1: 'Como viralizar no TikTok',
  resumo:
    'Ninguém controla se um vídeo específico viraliza. O que se controla é o que entra: o hook dos primeiros segundos, a retenção até o fim, o intervalo entre uma publicação e a próxima, e o volume de testes. Abaixo, as quatro alavancas, na ordem em que mexer nelas costuma mudar o resultado.',
  intencao: 'informacional',
  palavrasChave: [
    'como viralizar no tiktok',
    'viralizar no tiktok',
    'ganhar views no tiktok',
    'vídeo viral no tiktok',
    'alcance no tiktok',
  ],
  hubs: ['/guias/marketing-no-tiktok'],
  relacionadas: [
    '/glossario/algoritmo-do-tiktok',
    '/glossario/hook',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/comparativos/tiktok-vs-instagram',
    '/plataformas/tiktok-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o problema não é o que publicar, e sim quem produz, conte quantos vídeos a sua empresa precisa por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que "viralizar" quer dizer na prática',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No TikTok, cada vídeo é distribuído por conta própria. A plataforma mostra a peça para um grupo pequeno, lê o que aquele grupo faz com ela — assiste até o fim, reassiste, comenta, compartilha, segue — e decide se amplia a entrega. "Viralizar" é o nome que se dá ao momento em que esses sinais se sustentam a cada nova leva de espectadores, e a entrega cresce sozinha. Não é um botão nem uma tática: é uma consequência.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Por isso a pergunta que rende resposta não é "como viralizar", e sim **o que faz um vídeo ser assistido até o fim** — porque é isso que a plataforma mede antes de decidir se mostra para mais gente. O mecanismo por trás dessa decisão está em [algoritmo do TikTok](/glossario/algoritmo-do-tiktok); aqui o assunto é o que fazer com ele.',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Nenhuma operação séria promete que um vídeo específico vai viralizar. O que se constrói é volume, dado e teste suficientes para aumentar as chances de alcançar grandes audiências.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que você não controla',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale começar pela lista curta do que não adianta tentar administrar, porque é nela que a maior parte do tempo de quem posta se perde:',
    },
    {
      tipo: 'lista',
      itens: [
        'Quem está na primeira leva de espectadores, e o humor dela naquele dia.',
        'O assunto que está em alta na semana — entrar nele atrasado costuma render menos do que publicar o que você já sabia dizer.',
        'O desempenho de um vídeo isolado. Um resultado, bom ou ruim, é um ponto, não uma curva.',
        'O número de seguidores como garantia de entrega: o tamanho do perfil pesa pouco na distribuição — não é passaporte nem teto.',
        'O resultado do vídeo de outra marca, produzido com outro contexto, outra audiência e outro histórico de perfil.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As quatro alavancas que você controla',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'O hook: os primeiros segundos',
          texto:
            'O começo do vídeo não é apresentação, é promessa. Diga o assunto antes de dizer quem você é, mostre a cena mais forte primeiro e corte tudo que vem antes dela. Um bom teste: se os três primeiros segundos, sozinhos, não dão ao espectador um motivo para ficar, o resto do vídeo não vai ser visto. O termo tem verbete próprio em [hook](/glossario/hook).',
        },
        {
          titulo: 'A retenção: o vídeo aguenta até o fim?',
          texto:
            'Depois de segurar, é preciso não soltar. Uma ideia por vídeo, tempos mortos cortados, nada de "antes de começar, se inscreve". O fim importa tanto quanto o começo: um fecho que responde ao que o hook prometeu evita a sensação de tempo perdido, e um fecho que emenda no início faz o espectador reassistir sem perceber. Como montar isso está em [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem).',
        },
        {
          titulo: 'A cadência: o intervalo entre uma publicação e a próxima',
          texto:
            'Publicar dois vídeos com poucas horas de diferença faz um disputar espaço com o outro na mesma audiência. É a alavanca mais barata de corrigir e a que quase ninguém usa — está detalhada na seção seguinte.',
        },
        {
          titulo: 'O volume: quantos testes por mês',
          texto:
            'Com quatro vídeos por mês, um resultado ruim custa uma semana de leitura e o mês inteiro de conclusão. Com volume, cada semana devolve dado sobre hook, formato e tema, e a decisão do que produzir em seguida deixa de ser opinião. Volume não é postar qualquer coisa: é ter matéria-prima suficiente para descartar rápido o que não funciona.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A cadência é a alavanca que quase ninguém usa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quem produz em lote tende a publicar em lote: três vídeos ficaram prontos na quinta, os três vão ao ar na quinta. O efeito é o oposto do pretendido — a distribuição de um vídeo continua acontecendo por horas depois da publicação, e o vídeo seguinte é oferecido para a mesma audiência que ainda estava recebendo o anterior.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa trata isso como regra escrita para os clientes, e a regra é simples de copiar mesmo por quem produz sozinho: **no máximo um vídeo por dia útil**, e nada de compensar publicando vários no mesmo dia — dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro. O intervalo é de relógio, não de calendário.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'Se um vídeo foi publicado segunda-feira às 22h, o próximo só pode ser publicado a partir das 22h de terça. A janela existe para preservar a distribuição orgânica do vídeo anterior.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A contrapartida é que a agenda deixa de depender de inspiração: com o intervalo fixo, o que decide a publicação de amanhã é a fila de vídeos prontos, não a vontade de postar. Fotos, carrosséis e stories não competem nessa janela — a regra é sobre vídeo curto.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Os quatro erros que derrubam o alcance de um perfil',
    },
    {
      tipo: 'lista',
      itens: [
        '**Comprar seguidores, curtidas, views ou comentários.** Além de contaminar a leitura do que funciona, engajamento artificial pode gerar penalização das redes — o vídeo passa a ser medido por uma audiência que nunca ia assisti-lo até o fim.',
        '**Impulsionar as publicações do perfil onde o trabalho orgânico está rodando.** É regra de operação orgânica: no perfil em que a estratégia está ativa, nada é impulsionado, turbinado ou promovido. Sem isso não há como saber se o alcance veio do conteúdo ou da verba.',
        '**Limitar ou desativar comentários.** Comentário é sinal de distribuição e é a única leitura gratuita do que a audiência entendeu. Apagar o ofensivo é diferente de fechar a porta.',
        '**Reeditar o vídeo depois de pronto.** Trocar corte, duração, música, legenda ou capa a cada publicação transforma cada peça num experimento diferente, e nenhum aprendizado se acumula. A regra prática cabe em três palavras: baixou, publicou.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quanto volume é volume suficiente',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Não existe número mágico, mas a régua da seção anterior dá a grandeza: **um vídeo por dia útil, sustentado por um trimestre** — o que dá algo em torno de sessenta peças. É volume desenhado para que os testes gerem dado antes de o trimestre acabar, e serve de referência mesmo para quem produz por conta própria.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O corolário desagradável é que os primeiros vídeos costumam performar abaixo do esperado, e isso faz parte: eles geram os dados de audiência, tema, formato e hook que orientam os próximos. Uma estratégia que depende de acertar todos os vídeos não é estratégia, é sorte com nome melhor.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Na Doxa, as visualizações contabilizadas nas metas são 100% orgânicas, vindas da distribuição dos conteúdos produzidos dentro da operação — sem depender da compra de mídia para atingir as metas contratadas.',
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
          pergunta: 'Quantos vídeos preciso publicar para viralizar no TikTok?',
          resposta:
            'Não há número que garanta viralização, e quem afirma um está vendendo. O que o volume compra é dado: quanto mais vídeos publicados com constância, mais rápido fica claro qual hook, qual tema e qual formato a sua audiência assiste até o fim. A régua de grandeza que esta página usa é um vídeo por dia útil, sustentado por um trimestre.',
        },
        {
          pergunta: 'Postar mais de uma vez por dia acelera o crescimento?',
          resposta:
            'Costuma fazer o contrário. A distribuição de um vídeo continua por horas depois da publicação, e o vídeo seguinte é oferecido à mesma audiência que ainda estava recebendo o anterior — é a leitura que a Doxa aplica na rotina de quem contrata, e que sustenta o intervalo de 24 horas de relógio entre publicações.',
        },
        {
          pergunta: 'Devo apagar os vídeos que foram mal?',
          resposta:
            'Apagar não devolve o alcance do que já passou e tira de você a única base de comparação existente: o registro do que foi testado. Se o vídeo tem erro de fato, de marca ou de informação, apague sem pensar; se ele tem só poucas visualizações, ele é dado — e é dele que sai a resposta sobre o que a sua audiência não quis assistir.',
        },
        {
          pergunta: 'Um vídeo foi bem. Repito o formato ou mudo de assunto?',
          resposta:
            'Repetir o formato com outro assunto é o teste que separa as duas hipóteses: se o segundo também vai bem, o ganho era do formato; se não vai, era do tema. Mudar formato e tema ao mesmo tempo apaga a informação e devolve você ao ponto de partida, com um vídeo a mais publicado e nada aprendido.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar amanhã',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Pegue os cinco últimos vídeos do perfil e responda três coisas: o assunto aparece nos três primeiros segundos? Existe algum vídeo publicado a menos de 24 horas de outro? Qual deles você produziria de novo, com outro hook? Se as respostas forem "não", "sim" e "nenhum", o problema não é o algoritmo — e as três correções cabem na semana que vem. Como esse mesmo material se comporta na outra rede é o assunto de [TikTok ou Instagram](/comparativos/tiktok-vs-instagram).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": preço, mensalidade, fidelidade, direitos do vídeo,
 *          agência licenciada, os 1.500 clientes, "parceiros".
 * [x]  4. Termos proibidos ausentes: "agência" como autodefinição, "parceiros"
 *          para as ferramentas, "assinatura", "curso", "tráfego pago" como
 *          serviço, "garantimos que vai viralizar".
 * [x]  5. Se cita a garantia, usa a redação prudente do FAQ; se usa os números
 *          do manual, vem com "conforme as condições e o prazo do contrato".
 *          (Esta página não cita a garantia: cita volume e cadência.)
 * [x]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 *          "Viralizar" é palavra deste guia; "algoritmo" é do verbete.
 * [x]  7. Informação incremental: a cadência de 24 horas de relógio, com o
 *          exemplo da segunda às 22h, e os quatro erros que derrubam alcance.
 *          Esta página é a DONA do bloco de cadência: as outras resumem e
 *          linkam. A FAQ de impulsionamento é de /comparativos/organico-vs-pago
 *          e a de "preciso aparecer" é do guia de vídeos curtos.
 * [x]  8. title exclusivo e orientado a intenção, description de 120–160
 *          caracteres, H1 único, H2 em hierarquia real.
 * [x]  9. Pertence ao hub de TikTok, envia links contextuais (verbetes, guia de
 *          vídeo curto, comparativo de redes) e recebe do hub.
 * [x] 10. Não é comparativo — mas admite o que não se controla, que é o
 *          equivalente aqui: a página não promete viralização.
 * [x] 11. CTA por intenção — topo de funil, um só, no fim, pelo campo `cta`.
 * [x] 12. Sem keyword stuffing: "viralizar no TikTok" aparece onde caberia se o
 *          Google não existisse.
 * [x] 13. Frases do dono usadas palavra por palavra: "baixou, publicou",
 *          "60 conteúdos", "auditoria estratégica", "views orgânicas".
 * [x] 14. Teste final (§45): sim, eu publicaria isso se o Google não existisse.
 * ────────────────────────────────────────────────────────────────────────── */
