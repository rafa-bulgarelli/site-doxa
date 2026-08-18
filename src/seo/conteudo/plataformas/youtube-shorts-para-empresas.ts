import type { Pagina } from '../../tipos';

/**
 * A terceira rede da garantia — e a que mais empresa deixa vazia. O ângulo é
 * este e não se repete nas outras duas plataformas: o mesmo arquivo já
 * produzido custa quase nada para entrar aqui, e as views da meta são SOMADAS.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 * Sobre a DOXA:
 *  · as três redes da garantia — Instagram, TikTok e YouTube Shorts — e as
 *    "views somadas" → `supabase/manual-seed-v1.sql`; `src/components/Hero.tsx`;
 *    `public/llms.txt`;
 *  · o mesmo arquivo nas três redes, no mesmo dia → `RT-1`
 *    (`supabase/manual-seed-v1.sql`), com a ressalva do contrato;
 *  · a garantia na redação prudente → `src/components/faq/config.ts`, chave
 *    `nao-bater`; o público → chave `para-quem`;
 *  · o entregável pronto para postar, publicado pelo cliente →
 *    `src/components/HowItWorks.tsx`;
 *  · "a estratégia pode envolver TikTok, Instagram, YouTube e outras redes
 *    relevantes" → chave `redes` — e o source of truth §2 avisa: a GARANTIA
 *    conta as três redes fixas, a estratégia é que pode envolver outras. Esta
 *    página não diz que a garantia cobre rede fora das três.
 *
 * Sobre a PLATAFORMA: sem estatística, sem política interna do YouTube, sem
 * promessa de posição. Não há fonte para nada disso no projeto.
 */
export const pagina: Pagina = {
  tipo: 'plataforma',
  slug: 'youtube-shorts-para-empresas',
  titulo: 'YouTube Shorts para empresas: a terceira rede que sobra',
  descricao:
    'Por que o canal no YouTube costuma ficar parado enquanto TikTok e Instagram recebem tudo, o que muda no canal e como a Doxa soma as views das três redes.',
  h1: 'YouTube Shorts para empresas',
  resumo:
    'O vídeo vertical que a sua empresa já produziu serve ao YouTube Shorts sem retrabalho — é o mesmo arquivo. Ainda assim, é a rede que costuma ficar para depois, e por isso é onde o custo de aparecer tende a ser o mais baixo de uma operação de conteúdo.',
  intencao: 'comercial',
  palavrasChave: [
    'youtube shorts para empresas',
    'shorts para marca',
    'youtube shorts empresa',
    'vídeo curto no youtube',
    'canal de empresa no youtube',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/solucoes/videos-curtos-para-empresas',
    '/plataformas/tiktok-para-empresas',
    '/plataformas/instagram-reels-para-empresas',
    '/comparativos/tiktok-vs-instagram',
    '/glossario/short-form',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a sua empresa já publica vídeo vertical e o canal no YouTube está parado, o time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O canal que costuma ficar pela metade',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A sequência aparece com frequência: a empresa organiza a produção, publica com disciplina no Instagram e no TikTok, e o canal do YouTube fica com quatro vídeos de 2021 e um institucional. Não é falta de vontade — é ordem de prioridade. O Shorts foi o último a chegar, o canal parece exigir outro tipo de conteúdo, e ninguém tem tempo de descobrir se vale.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O detalhe que muda a conta é que **o arquivo é o mesmo**. Um vídeo vertical, curto e legendado já pronto para o feed não precisa de nova edição para entrar aqui. O trabalho adicional é de upload, não de produção — e é raro que ampliar a distribuição de uma operação de conteúdo custe tão pouco.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o YouTube tem que as outras duas não têm',
    },
    {
      tipo: 'lista',
      itens: [
        'Busca dentro da própria plataforma: no YouTube, muita gente chega escrevendo o que quer ver, e um vídeo publicado há meses continua podendo ser encontrado assim.',
        'Canal como acervo: os vídeos ficam organizados num lugar que parece um catálogo, e não uma linha do tempo que some.',
        'Convivência com vídeo longo: se a empresa um dia gravar algo mais fundo, o público do Shorts já está no mesmo endereço.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nada disso torna o YouTube melhor do que as outras duas redes — o TikTok costuma entregar desconhecidos com mais facilidade, e o Instagram é onde o perfil da empresa já tem histórico. A comparação entre as duas maiores está em [TikTok ou Instagram](/comparativos/tiktok-vs-instagram). O ponto aqui é outro: **não é uma escolha**. O Shorts é o incremento que já está pago.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O YouTube Shorts é a terceira das redes que a Doxa usa como referência da operação, ao lado do Instagram e do TikTok — e a meta é de **views somadas** entre elas, conforme as condições e o prazo do contrato. É por isso que a rotina combinada com quem já é cliente prevê o mesmo conteúdo nas três redes, no mesmo dia: deixar uma delas de fora não muda só o alcance daquela rede, muda a conta inteira.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que a empresa recebe é o arquivo pronto para postar — vertical, legendado, no formato do feed — e a publicação é feita por ela, no canal dela. A estratégia de cada operação pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa; as três da garantia, essas, são fixas.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto: 'Um milhão de views. Ou seu dinheiro de volta.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que muda no canal de uma empresa',
    },
    {
      tipo: 'lista',
      itens: [
        'O canal deixa de ser um arquivo morto e passa a receber publicação com regularidade, que é o que dá a alguém motivo para se inscrever.',
        'Vídeo institucional antigo não precisa sair: ele responde a quem já procurava a empresa. O Shorts atende quem ainda não procurava.',
        'A descrição e o nome do canal passam a importar mais, porque quem chega por busca lê antes de assistir.',
        'A leitura de resultado muda de ritmo: aqui é comum um vídeo continuar sendo visto tempo depois da estreia, e não só nos primeiros dias.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale um aviso de expectativa: canal com regularidade nova dificilmente vira audiência em duas semanas, e o número de inscritos costuma ser o último indicador a se mexer. O sinal que importa antes disso é outro — quantos vídeos passaram do começo, e quais deles trouxeram gente que não conhecia a empresa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quando o Shorts não deveria ser o primeiro passo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Se a empresa ainda não produz vídeo vertical nenhum, começar pelo YouTube é resolver o problema pela ponta errada: o gargalo é a produção, não a rede. O Shorts brilha quando já existe uma fila de conteúdo saindo — aí ele é distribuição adicional quase gratuita. Antes disso, o esforço deveria estar em [produzir com constância](/solucoes/producao-de-conteudo-em-escala).',
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
          pergunta: 'A meta de visualizações inclui o YouTube Shorts?',
          resposta:
            'As três redes da operação da Doxa são Instagram, TikTok e YouTube Shorts, e as visualizações da meta são somadas entre elas, conforme as condições e o prazo do contrato. A estratégia pode envolver outras redes relevantes para o público da empresa, mas as redes da meta são essas três.',
        },
        {
          pergunta: 'É o mesmo vídeo das outras redes?',
          resposta:
            'O arquivo é o mesmo, e isso é de propósito: a rotina combinada com quem já é cliente prevê o mesmo vídeo publicado nas três redes, no mesmo dia. A peça entregue é vertical, legendada, no formato do feed, e serve às três sem nova edição.',
        },
        {
          pergunta: 'O que acontece se vocês não baterem a quantidade de views prometida?',
          resposta:
            'A Doxa trabalha com metas de performance definidas em contrato. Caso a quantidade de visualizações acordada não seja atingida dentro do período estabelecido, são aplicadas as condições de garantia previstas no contrato. A garantia existe justamente para alinhar o nosso resultado ao resultado do cliente.',
        },
        {
          pergunta: 'Para quais empresas isso é indicado?',
          resposta:
            'A Doxa é indicada para empresas que querem transformar conteúdo em um canal previsível e escalável de crescimento. Trabalhamos especialmente com marcas que precisam ganhar relevância, aumentar audiência e ocupar espaço de forma consistente nas principais plataformas digitais.',
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
        'Abra o canal da sua empresa no YouTube e veja a data do último vídeo. Se a sua empresa já publica vertical em outra rede, a distância entre essa data e hoje é alcance que estava pago e não foi retirado. Para incluir a terceira rede na operação, quem preenche o formulário é chamado pelo time da Doxa em até 24 horas para marcar a auditoria estratégica.',
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
 * [x]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 * [x]  7. Informação incremental: pelo menos um bloco que a SERP não tem —
 *          mecanismo, número da metodologia, erro comum, exemplo concreto.
 * [x]  8. title exclusivo e orientado a intenção (nunca "Keyword | DOXA"),
 *          description exclusiva de 120–160 caracteres, H1 único, H2/H3 em
 *          hierarquia real.
 * [x]  9. Pertence a ≥1 hub, envia links contextuais e recebe do hub. Nenhum
 *          link decorativo: cada um é útil para quem lê, não para o crawler.
 * [x] 10. Comparativo é IMPARCIAL: admite onde a outra opção ganha. Não
 *          concluir artificialmente que a Doxa é sempre a resposta.
 * [x] 11. CTA por intenção — topo de funil: próximo conteúdo; meio:
 *          metodologia/prova; fundo: o formulário (#forms). Um só, no fim.
 * [x] 12. Sem keyword stuffing: a keyword-alvo aparece onde caberia se o
 *          Google não existisse. Sem sinônimo empilhado, sem lista de cidades.
 * [x] 13. Frases do dono usadas palavra por palavra quando existem ("pronto
 *          para postar", "views somadas", "clone"). Vocabulário do §10.
 * [x] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */
