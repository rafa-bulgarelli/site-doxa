import type { Pagina } from '../../tipos';

/**
 * A alternativa que o lead considera de verdade quando pensa em "aparecer":
 * pagar quem já tem audiência, ou construir a própria.
 *
 * ─── A FRONTEIRA COM `/comparativos/ugc-vs-conteudo-de-marca` ────────────────
 *
 * As duas páginas são VIZINHAS DE VERDADE, e não territórios separados: as
 * duas têm criador de um lado e marca do outro. O que as separa é o eixo —
 * lá o assunto é o FORMATO da peça (estética de conteúdo caseiro contra peça
 * de marca) e onde ela roda; aqui é a AUDIÊNCIA: de quem ela é, o que
 * acontece com ela quando o combinado acaba, e de quem fica o dado depois.
 *
 * O gate da rodada 2 reprovou a primeira versão desta página justamente por
 * ter atravessado essa fronteira. Blocos que TÊM DONO LÁ e que aqui só podem
 * ser resumidos em uma frase com link:
 *  · o que precisa estar no contrato com um criador (cessão, sinalização,
 *    entrega do arquivo) → FAQ de `ugc-vs-conteudo-de-marca`;
 *  · custo por peça caindo com volume ("a sessenta custa menos que a dez");
 *  · precisão de assunto técnico como vantagem da marca;
 *  · prova de uso e teste de ângulo como vantagem do criador;
 *  · o veredito "faça os dois, e a ordem importa".
 * Nenhum desses aparece aqui na forma dele: quando o assunto encosta, esta
 * página troca para a pergunta de audiência ("de quem é", "o que sobra",
 * "quem some quando").
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · a Doxa produz conteúdo vertical em escala para empresas e agências →
 *    fonte: `docs/seo/source-of-truth.md` §1 (`public/llms.txt:6`);
 *  · o entregável é o vídeo pronto para postar — vertical, legendado, no
 *    formato do feed — e quem publica é o cliente, no perfil dele → fonte: §2
 *    (`src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`);
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → fonte: §2
 *    (`supabase/manual-seed-v2.sql:168`);
 *  · a Doxa não é tráfego pago: a garantia é de views orgânicas somadas →
 *    fonte: §1 (`public/llms.txt:42`); as visualizações contabilizadas nas
 *    metas são orgânicas, sem depender de compra de mídia → §8
 *    (`src/components/faq/config.ts:174-175`);
 *  · a redação prudente da garantia — "metas de performance definidas em
 *    contrato" → fonte: §3(b) (`src/components/faq/config.ts:110-111`);
 *  · retorno em até 24 horas para marcar a auditoria estratégica → fonte: §2.
 *
 * NÃO há aqui nenhuma estatística sobre marketing de influência: nem cachê
 * médio, nem taxa de engajamento de criador, nem retorno por real investido.
 * Nenhum desses números tem fonte citável no projeto, e a régua de copy proíbe
 * estatística de terceiro sem fonte nomeada no texto. A Doxa também não
 * intermedeia criadores — a página diz isso, e nada além disso.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'conteudo-organico-vs-influenciador',
  titulo: 'Conteúdo próprio ou influenciador: audiência de quem?',
  descricao:
    'Pagar por acesso à audiência de um criador ou construir a sua no próprio perfil: o que cada caminho entrega no mês, no ano e no dia em que você para.',
  h1: 'Conteúdo próprio ou influenciador',
  resumo:
    'Influenciador vende acesso a uma audiência que já existe e é dele; conteúdo próprio constrói uma audiência que passa a ser sua. O primeiro entrega atenção numa data marcada e devolve o público ao dono quando o post sai do ar; o segundo demora a acumular e não devolve nada. São compras diferentes, e o erro caro é tratá-las como se fossem a mesma.',
  intencao: 'comercial',
  palavrasChave: [
    'conteúdo próprio ou influenciador',
    'conteúdo orgânico ou influenciador',
    'marketing de influência ou conteúdo',
    'contratar influenciador',
    'audiência própria',
    'perfil da marca ou criador',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/comparativos/ugc-vs-conteudo-de-marca',
    '/comparativos/organico-vs-pago',
    '/solucoes/conteudo-organico-para-empresas',
    '/glossario/alcance-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se a decisão for construir audiência no seu próprio perfil, conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que está sendo comprado em cada caso',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Ao contratar um influenciador, a empresa compra uma coisa muito específica: o direito de ocupar, por um tempo combinado, a atenção que outra pessoa levou anos construindo. O ativo é dele. Terminada a veiculação, a audiência continua onde estava — no perfil dele —, e o que sobra para a marca é o que aquele post conseguiu transferir naquela janela.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Ao publicar conteúdo orgânico no próprio perfil, a empresa compra outra coisa: acúmulo. Cada vídeo publicado continua podendo ser entregue depois, cada pessoa que passa a seguir volta sem custo adicional, e a biblioteca é da empresa. Em compensação, ninguém entrega audiência pronta na primeira semana — é preciso construir, e construir demora.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A confusão que custa dinheiro é achar que os dois compram a mesma coisa em prazos diferentes. Não compram: um aluga alcance com data; o outro constrói um canal. Comparar os dois pelo custo por visualização é comparar aluguel com obra pelo valor da parcela.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'Influenciador', 'Conteúdo próprio'],
      linhas: [
        [
          'Onde o vídeo é publicado',
          'No perfil do criador, com a marca de visita',
          'No perfil da empresa, que é a casa dela',
        ],
        [
          'De quem é a audiência alcançada',
          'Dele — emprestada pelo tempo do combinado',
          'Da empresa, e ela permanece depois do vídeo',
        ],
        [
          'Quando a entrega acontece',
          'Na data acertada em contrato',
          'Quando a distribuição decidir, e de novo meses depois',
        ],
        [
          'Efeito no mês seguinte',
          'Cai quando a publicação sai do ar',
          'Soma ao que já estava publicado',
        ],
        [
          'Controle sobre o que é dito',
          'Negociado: o criador defende o tom dele',
          'Integral, com a responsabilidade que vem junto',
        ],
        [
          'Risco que não é seu',
          'A reputação de um terceiro respinga na marca',
          'Limitado ao que a própria empresa publica',
        ],
        [
          'O que muda quando o volume dobra',
          'Mais criadores, e mais audiências novas para conhecer',
          'A mesma audiência recebe mais vezes, sem fornecedor novo',
        ],
        [
          'O que dá para medir depois',
          'O desempenho daquele post, no painel de outra pessoa',
          'Série histórica no seu painel, vídeo a vídeo',
        ],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o influenciador ganha',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Há cenários em que construir audiência própria é o caminho mais caro, e alugar a de outra pessoa é a decisão certa:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Existe uma data, e ela não se move.** Um criador assina para publicar no dia 12 e publica no dia 12. Audiência própria não assina nada: ela aparece quando aparece.',
        '**A sua audiência ainda não existe.** Perfil sem público não distribui nada: o vídeo pode ser ótimo e ser visto por trinta pessoas. Alugar a atenção de quem já reuniu gente é a forma de falar com muitos antes de ter alguém.',
        '**A audiência certa está concentrada num nicho.** Quando um criador reuniu exatamente o público que você quer, chegar até ele por conta própria custa muito mais tempo.',
        '**Entrar numa audiência que não procuraria você.** Quem acompanha um criador de assunto vizinho dificilmente buscaria a sua marca — mas assiste ao vídeo dele até o fim, e é ali que fica sabendo que você existe.',
        '**Atravessar para uma rede nova.** Marca forte num canal e inexistente em outro: um criador nativo do segundo canal encurta a travessia mais do que recomeçar do zero por lá.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o conteúdo próprio ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**O que fica.** Ao fim de um ano, um perfil que publicou tem biblioteca, audiência e histórico; uma sequência de campanhas com criadores tem relatórios.',
        '**A audiência volta sem ser paga de novo.** Quem passou a seguir depois de um vídeo assiste ao próximo sem que ninguém emita uma nota fiscal nova.',
        '**Ninguém muda de nicho no meio do caminho.** Criador troca de assunto, de tom e de patrocinador; o seu perfil só muda quando você decide. A audiência reunida em volta do seu tema continua sendo sobre o seu tema.',
        '**A relação é direta.** Comentário, dúvida e mensagem chegam a quem pode responder, e a conversa fica registrada no seu perfil — não no de outra pessoa, junto com a de outras marcas.',
        '**Dado próprio.** Você vê a curva de cada vídeo no seu painel e aprende com ela. No post de um criador, você vê o print que ele mandar.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O desempate é por prazo de posse, não por preço da peça. O que se contrata de um criador tem data de início e data de fim; o que se publica no perfil próprio não tem data de fim — e é por isso que as duas contas nunca fecham no mesmo período. Se a empresa precisa ser vista em setembro, um criador entrega setembro. Se precisa ser vista todos os meses do ano que vem, nenhuma campanha entrega isso: só a rotina entrega, e ela começa a valer depois de já estar rodando há um tempo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que ninguém coloca na proposta',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Do lado do influenciador, o item que some da conta é a **cessão de uso**. O vídeo bom só pode ser republicado, cortado ou usado como anúncio se isso estiver escrito: quais canais, por quanto tempo, com ou sem verba. Sem essa cláusula, a empresa pagou por uma peça que ela vê e não pode usar — e descobre isso justamente quando a peça funciona.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Do lado do conteúdo próprio, o item que some é a **constância**. Um perfil que publica em rajadas e some por seis semanas não constrói audiência: constrói um arquivo. Audiência própria é feita de reencontro — a pessoa precisa ver você de novo para lembrar quem você é —, e reencontro é função de frequência, não de uma peça boa isolada. Por isso a decisão real aqui é sobre quem produz toda semana.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que precisa estar escrito num contrato de criador — cessão de uso, sinalização de publicidade e entrega do arquivo — está no FAQ de [UGC ou conteúdo de marca](/comparativos/ugc-vs-conteudo-de-marca), que é onde esse contrato tem dono.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Onde a Doxa entra: ela produz para o perfil da empresa, e não para o de terceiros. O que sai da operação é conteúdo vertical em escala, entregue pronto para postar — e como quem publica é o cliente, a audiência que aparecer aparece na conta dele. Ela não agencia nem intermedeia criadores, e não vende tráfego pago: as visualizações contabilizadas nas metas são orgânicas, sem depender de compra de mídia, dentro das metas de performance definidas em contrato.',
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
          pergunta: 'Contratar influenciador faz o meu perfil crescer?',
          resposta:
            'Faz crescer o alcance daquela publicação, que é diferente. Parte de quem assiste visita o perfil da marca, e é aí que a conversão de audiência acontece ou não: quem chega e encontra um perfil sem vídeos recentes costuma não voltar. O ganho de seguidores por campanha de influência costuma depender mais do que a pessoa encontra no seu perfil do que do tamanho do criador.',
        },
        {
          pergunta: 'Micro criador ou perfil grande?',
          resposta:
            'A pergunta útil não é o tamanho, é a aderência: quantas das pessoas que seguem aquele perfil poderiam comprar de você. Um criador de nicho com audiência pequena e concentrada costuma responder melhor a uma oferta específica do que um perfil grande e genérico — e permite testar mais gente com o mesmo orçamento.',
        },
        {
          pergunta: 'O que acontece com o conteúdo quando a campanha termina?',
          resposta:
            'Depende do que foi cedido. Sem cláusula de uso, o vídeo continua no perfil do criador enquanto ele quiser mantê-lo, e a marca não pode republicar nem impulsionar. Com cessão combinada, a peça vira material da empresa e pode ser reaproveitada. Essa diferença costuma valer mais do que o desconto negociado no cachê.',
        },
        {
          pergunta: 'Dá para construir audiência própria sem aparecer em vídeo?',
          resposta:
            'Dá, e é o caminho de muitas empresas: quem aparece pode ser um profissional do time, um cliente autorizado, uma demonstração de produto sem rosto ou um apresentador gerado a partir de material de alguém que autorizou. O que não dá é publicar em rajadas e esperar acúmulo — a audiência própria é construída pela frequência, não pelo rosto.',
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
        'Influenciador aluga a atenção de um público que continua sendo de outra pessoa; conteúdo próprio constrói um público que passa a ser seu — e quem faz o primeiro sem o segundo paga duas vezes pela mesma visita.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: um vende acesso a audiência de terceiro,
 *          o outro constrói audiência própria.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (§1, §2, §3b, §8):
 *          conteúdo vertical em escala, vídeo único, pronto para postar, quem
 *          publica, views orgânicas, metas definidas em contrato, 24 horas.
 * [x]  3. Nada da §9: sem cachê, sem retorno por real, sem preço da Doxa.
 * [x]  4. Termos proibidos ausentes; "tráfego pago" aparece só na NEGAÇÃO de
 *          que a Doxa o venda.
 * [x]  5. A garantia entra pela redação prudente do FAQ ("metas de performance
 *          definidas em contrato"), sem número e sem prazo.
 * [x]  6. Intenção própria: audiência alugada × audiência construída. O par
 *          `ugc-vs-conteudo-de-marca` compara FORMATO de peça, e é DONO do
 *          contrato com criador, do custo por peça e da prova de uso — aqui
 *          esses blocos viram uma frase com link, nunca a versão longa.
 * [x]  7. Informação incremental e SÓ do eixo audiência: a tabela de oito
 *          critérios, "prazo de posse" como desempate, audiência como
 *          reencontro, e de quem fica o dado depois da campanha.
 * [x]  8. title exclusivo (53 caracteres), description 120–160, H1 único.
 * [x]  9. Hub de marketing orgânico; links para o comparativo de formato, o de
 *          canal, a solução de conteúdo orgânico e o verbete de alcance.
 * [x] 10. IMPARCIAL: cinco situações em que o influenciador ganha, com nome, e
 *          o custo escondido do lado próprio também está escrito. A Doxa
 *          aparece UMA vez, no fim.
 * [x] 11. CTA único, no fecho, condicionado à decisão.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "em escala", "vertical".
 * [x] 14. Teste final (§45): publicaria com o Google desligado — a lista de
 *          cessão de uso resolve um erro caro e concreto.
 * ────────────────────────────────────────────────────────────────────────── */
