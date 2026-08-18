import type { Pagina } from '../../tipos';

/**
 * O guia de execução do cluster de vídeos curtos — o "como se monta a peça".
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · vertical, legendado, no formato do feed → fonte:
 *    `docs/seo/source-of-truth.md` §2, "Entregável"
 *    (`src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`);
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → fonte:
 *    `docs/seo/source-of-truth.md` §2 (`supabase/manual-seed-v2.sql:168`);
 *  · os primeiros vídeos abaixo do esperado geram dados sobre audiência, temas,
 *    formatos, hooks e narrativas → fonte: `docs/seo/source-of-truth.md` §2
 *    (`src/components/faq/config.ts`, resposta `primeiros-videos`);
 *  · "baixou, publicou" — publicar o arquivo sem alterar corte, duração,
 *    velocidade, proporção, música, legendas, capa → fonte:
 *    `docs/seo/source-of-truth.md` §8 (`supabase/manual-seed-v1.sql:263`);
 *  · o mesmo arquivo nas três redes, no mesmo dia → fonte:
 *    `docs/seo/source-of-truth.md` §8, regra `RT-1`;
 *  · retorno em até 24 horas e auditoria estratégica → fonte:
 *    `docs/seo/source-of-truth.md` §2.
 *
 * Tudo o mais é mecânica de formato — hook, corte, legenda, loop —, escrita sem
 * um único número de terceiro: não há, no repositório, fonte citável para
 * estatística de retenção de mercado, e inventar uma seria promessa alheia.
 *
 * O que NÃO está aqui de propósito: duração "ideal" com número fechado, taxa de
 * retenção "boa", horário de publicação. São afirmações que mudam por
 * plataforma e por nicho e nenhuma tem fonte no projeto.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-fazer-videos-curtos-que-prendem',
  titulo: 'Como fazer vídeos curtos que prendem até o fim',
  descricao:
    'Hook, ritmo e fecho: como montar um vídeo curto que segura o espectador nos primeiros segundos e o mantém até o fim, com uma revisão de cinco passos.',
  h1: 'Como fazer vídeos curtos que prendem',
  resumo:
    'Um vídeo curto prende por três decisões tomadas antes de gravar: qual é a promessa dos primeiros segundos, qual é a única ideia que a peça defende e como ela termina. O resto — corte, legenda, capa — é execução. Abaixo, cada decisão, os erros que as desfazem e uma revisão de cinco passos para rodar antes de publicar.',
  intencao: 'informacional',
  palavrasChave: [
    'como fazer vídeos curtos',
    'prender atenção no vídeo',
    'retenção de vídeo',
    'primeiros segundos do vídeo',
    'roteiro de vídeo curto',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/glossario/hook',
    '/glossario/retencao',
    '/glossario/watch-time',
    '/guias/por-que-meus-videos-nao-tem-views',
    '/solucoes/videos-curtos-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Quando o roteiro já está resolvido e o gargalo é produzir com constância, conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Prender não é uma técnica, é uma sequência',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A distribuição de vídeo curto funciona por leitura de comportamento: a plataforma mostra a peça para um grupo pequeno e observa quanto dela foi assistido antes de decidir se mostra para mais gente. Isso significa que a atenção não é medida uma vez, no começo — ela é medida o tempo todo. Um vídeo que segura três segundos e afrouxa no oitavo perde exatamente onde ninguém olha.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Por isso a montagem se organiza em três decisões, nesta ordem: a **promessa** do início, a **única ideia** que a peça defende e o **fecho** que devolve o que foi prometido. Os dois conceitos que a plataforma mede estão explicados em [retenção](/glossario/retencao) e [watch time](/glossario/watch-time); aqui o assunto é o que o roteiro faz com eles.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A promessa: os primeiros segundos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O começo do vídeo é a única parte que todo mundo vê. Ele não serve para se apresentar, situar o assunto ou agradecer: serve para dar ao espectador um motivo específico de ficar. Um hook funciona quando entrega uma das quatro coisas abaixo antes que o dedo decida.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Uma pergunta que a pessoa já se fez** — "por que o seu vídeo para de ter views depois do terceiro dia".',
        '**Uma contradição do senso comum** — "postar todo dia pode estar derrubando o seu alcance".',
        '**Um resultado visível na tela** — o antes e depois aparece antes de qualquer explicação.',
        '**Um custo evitado** — "o erro que faz uma gravação inteira ser refeita".',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O teste é mecânico: leia a primeira frase do roteiro em voz alta, sozinha, sem contexto. Se ela funciona como legenda de um print, ela é hook. Se precisa da frase seguinte para fazer sentido, ela é aquecimento — corte e comece pela seguinte. O termo tem verbete próprio em [hook](/glossario/hook).',
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'O hook mais caro é o que promete o que o vídeo não entrega. Ele até segura os primeiros segundos, mas ensina a audiência a desconfiar do perfil — e o efeito aparece no vídeo seguinte, não naquele.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A única ideia: o que a peça defende',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vídeo curto não comporta dois assuntos. Quando o roteiro tem "e também", o espectador precisa reiniciar a atenção no meio da peça, e é aí que a curva cai. Um vídeo, uma afirmação: o resto vira outro vídeo — o que, de quebra, resolve metade do problema de pauta do mês seguinte.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na prática isso muda a forma de escrever. Em vez de "cinco dicas de conteúdo", cinco vídeos, cada um defendendo uma dica com um exemplo concreto. A versão em lista parece mais eficiente e rende menos: ninguém assiste até a dica cinco, e nenhuma das cinco fica clara o suficiente para ser lembrada.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O fecho: como o vídeo termina',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Existem dois fechos que funcionam, e eles são opostos. O primeiro **responde** ao que o hook prometeu, de forma explícita, para que o espectador saia com a sensação de ter recebido algo. O segundo **emenda** no começo: a última frase reabre a primeira, e o vídeo se torna um pequeno loop que é reassistido sem que a pessoa perceba.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que não funciona é o fecho administrativo — "comenta aí", "salva esse vídeo", "segue o perfil". Ele ocupa o segundo mais valioso da peça com um pedido que só interessa a quem publicou, e quase sempre chega depois de a atenção já ter ido embora.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A execução: o que a peça precisa ter em tela',
    },
    {
      tipo: 'lista',
      itens: [
        '**Vertical e no formato do feed.** É o enquadramento que a rede entrega em tela cheia; qualquer coisa horizontal reduzida no meio da tela já começa perdendo.',
        '**Legendado.** Trate o som como opcional: a peça precisa se sustentar com ele desligado, porque o feed é consumido tanto em lugar público quanto em casa. A legenda ainda sustenta o ritmo — a palavra aparece junto com o corte.',
        '**Cortes que acompanham a fala.** Silêncio, respiração e correção de frase saem na edição. Não é pressa: é retirar o que não carrega informação.',
        '**Capa coerente com o hook.** A capa é o hook de quem chega pelo perfil, e ela não pode prometer outra coisa.',
        '**Um arquivo por peça.** Cada vídeo é único — roteiro, voz, edição e capa próprios. Reaproveitar o mesmo corte com legenda trocada é o caminho mais rápido para o perfil parecer um catálogo.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A revisão de cinco passos antes de publicar',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Assista sem som',
          texto:
            'Se você não entende o assunto pela imagem e pela legenda, quem está no transporte público também não entende. Corrija a legenda antes de mexer no roteiro.',
        },
        {
          titulo: 'Corte os três primeiros segundos e assista de novo',
          texto:
            'Se o vídeo continua fazendo sentido, os três segundos eram aquecimento. Publique a versão sem eles.',
        },
        {
          titulo: 'Procure o "e também"',
          texto:
            'Achou uma segunda ideia? Ela é o próximo vídeo. Tire da peça e guarde na fila de pauta em vez de descartar.',
        },
        {
          titulo: 'Leia a última frase logo depois da primeira',
          texto:
            'As duas juntas precisam formar uma unidade — ou respondendo, ou reabrindo. Se soarem como duas peças diferentes, o fecho está no lugar errado.',
        },
        {
          titulo: 'Confira o intervalo desde a última publicação',
          texto:
            'Vídeo bom publicado poucas horas depois do anterior disputa audiência com ele. Se o intervalo for curto, o melhor lugar da peça é a fila, não o feed.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que fazer quando a peça foi boa e o resultado não veio',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Acontece, e com frequência maior do que qualquer roteiro admite. Um vídeo isolado é um ponto, não uma curva: os primeiros conteúdos que performam abaixo do esperado fazem parte do processo, porque é deles que saem os dados sobre audiência, temas, formatos, hooks e narrativas. A leitura útil só aparece quando existem peças suficientes para comparar — e a pergunta muda de "por que este vídeo não foi" para "o que os três que foram tinham em comum".',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se o padrão for de queda generalizada, e não de um vídeo específico, o diagnóstico é outro: está em [por que os seus vídeos não têm views](/guias/por-que-meus-videos-nao-tem-views).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Na Doxa, cada vídeo entregue é único — roteiro, voz clonada, edição e capa — e chega vertical, legendado, no formato do feed. Uma regra de três palavras acompanha a entrega: baixou, publicou. O arquivo vai ao ar como está, porque é assim que a comparação entre uma peça e a próxima continua fazendo sentido.',
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
          pergunta: 'Qual é a duração ideal de um vídeo curto?',
          resposta:
            'A duração ideal é a menor duração em que a ideia inteira cabe. Não existe número que sirva a todo nicho: um vídeo de sete segundos que fecha o raciocínio rende mais do que um de quarenta que se arrasta, e o inverso também é verdade quando o assunto exige demonstração. O critério é a densidade — se dá para cortar sem perder informação, corte.',
        },
        {
          pergunta: 'Preciso aparecer em vídeo para prender a atenção?',
          resposta:
            'Rosto humano ajuda porque o olhar cria expectativa de fala, mas não é o único recurso: demonstração de produto, tela gravada, mão em cena, texto com ritmo e narração sustentam a atenção da mesma forma. O que não funciona é imagem parada com locução por cima, porque nada na tela renova o motivo de continuar assistindo.',
        },
        {
          pergunta: 'Legenda automática serve ou preciso legendar manualmente?',
          resposta:
            'A automática resolve a acessibilidade e costuma errar em nome próprio, número e termo técnico — que costumam ser justamente as palavras que carregam a informação. O caminho barato é gerar automático e revisar as palavras-chave da peça, cuidando também do posicionamento: legenda coberta pela interface da rede é legenda que ninguém leu.',
        },
        {
          pergunta: 'O mesmo vídeo pode ir para TikTok, Reels e Shorts?',
          resposta:
            'Pode, e é o que uma operação de volume faz: o mesmo arquivo vertical vai às três redes no mesmo dia. O cuidado é com a área segura da tela — cada rede põe interface em lugares diferentes —, e com a expectativa de resultado, que não é a mesma nas três.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O resumo em uma linha',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Prenda com uma promessa específica, defenda uma ideia só e termine devolvendo o que prometeu — nessa ordem, e antes de ligar a câmera. Todo o resto do vídeo curto é execução, e execução se conserta na edição; promessa e ideia, não.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca: as três decisões que fazem prender.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md
 *          (entregável, "cada vídeo é único", "baixou, publicou", 24 horas).
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL): sem preço, prazo, fidelidade, direitos.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A página não cita a garantia — logo, não precisa da ressalva.
 * [x]  6. Intenção própria: execução da peça. O verbete define retenção; o hub
 *          organiza o formato; esta página monta o vídeo.
 * [x]  7. Informação incremental: a revisão de cinco passos e o teste do hook
 *          lido em voz alta — nada disso está numa SERP de "vídeo curto".
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de vídeos curtos; links para os três verbetes que ela usa e para
 *          a dor de diagnóstico. Nenhum link decorativo.
 * [x] 10. Não é comparativo; ainda assim admite o caso em que a peça é boa e o
 *          resultado não vem.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "vertical, legendado, no formato do feed",
 *          "baixou, publicou".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
