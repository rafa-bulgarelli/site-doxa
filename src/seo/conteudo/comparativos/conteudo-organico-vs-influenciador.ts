import type { Pagina } from '../../tipos';

/**
 * A alternativa que o lead considera de verdade quando pensa em "aparecer":
 * pagar quem já tem audiência, ou construir a própria. O ângulo que separa
 * esta página de `/comparativos/ugc-vs-conteudo-de-marca` é o EIXO da
 * comparação: lá o assunto é o FORMATO da peça (estética de criador contra
 * peça de marca) e onde ela roda; aqui o assunto é a AUDIÊNCIA — alugada por
 * publicação contra construída no próprio perfil. Nenhum critério da tabela
 * daquela página se repete nesta.
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
        'Ao publicar conteúdo no próprio perfil, a empresa compra outra coisa: acúmulo. Cada vídeo publicado continua podendo ser entregue depois, cada pessoa que passa a seguir volta sem custo adicional, e a biblioteca é da empresa. Em compensação, ninguém entrega audiência pronta na primeira semana — é preciso construir, e construir demora.',
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
          'Cai junto com o fim da veiculação',
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
          'Como o custo se comporta com volume',
          'Sobe a cada publicação e a cada novo criador',
          'Concentrado no processo, e dilui conforme cresce',
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
        'Esta seção existe porque comparativo com um vencedor só não é comparativo. Há situações em que insistir no perfil próprio é teimosia cara:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Você precisa de atenção numa data.** Lançamento, inauguração, temporada. Audiência própria não se agenda; a agenda de um criador, sim.',
        '**Ninguém conhece a marca ainda.** Ser apresentado por alguém em quem a pessoa já confia encurta anos de construção — é confiança emprestada, e ela funciona.',
        '**A audiência certa está concentrada num nicho.** Quando um criador reuniu exatamente o público que você quer, chegar até ele por conta própria custa muito mais tempo.',
        '**Prova de uso.** Ver alguém real usando o produto responde o que nenhuma peça institucional responde, principalmente em consumo cotidiano.',
        '**Teste de mensagem.** Descobrir qual promessa segura a atenção sai mais rápido na audiência de outra pessoa do que num perfil que ainda não tem alcance.',
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
        '**Custo do próximo vídeo.** Definido o processo, a peça número sessenta custa menos que a número dez. Com criadores, cada peça é uma negociação nova.',
        '**Precisão.** Prazo, condição, regra técnica, restrição do setor: assunto que exige exatidão dá menos trabalho — e menos risco — quando quem fala responde pela empresa.',
        '**Independência.** Um perfil que publica não depende da agenda, do humor nem da tabela de ninguém para chegar até o público.',
        '**Dado próprio.** Você vê a curva de cada vídeo no seu painel e aprende com ela. No post de um criador, você vê o print que ele mandar.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta depende de qual escassez dói mais. Falta de conhecimento da marca no curto prazo pede influenciador; falta de canal próprio pede publicação constante. Fazer os dois é comum, e a ordem tem consequência: o perfil próprio sustenta a rotina, e a campanha com criador entra em cima dela — no arranjo inverso, quem chegar pelo vídeo do criador vai encontrar um perfil vazio, que é onde a compra costuma morrer.',
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
        'Do lado do conteúdo próprio, o item que some é a **constância**. Um perfil que publica em rajadas e some por seis semanas não constrói audiência: constrói um arquivo. É o formato que mais rende no longo prazo e o que mais depende de rotina para render alguma coisa — por isso a decisão real, aqui, é sobre quem produz toda semana, e não sobre ter ou não uma ideia boa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Se for contratar um criador, combine isto por escrito',
    },
    {
      tipo: 'lista',
      itens: [
        '**Sinalização de publicidade.** Conteúdo pago apresentado como opinião espontânea é problema de publicidade, e as plataformas têm regras próprias de marcação.',
        '**Cessão de uso.** Canais, prazo e se a peça pode ser veiculada como anúncio.',
        '**Aprovação de roteiro.** O que a marca pode ajustar, e o que fica a critério de quem grava — sem isso, a discussão acontece com o vídeo já gravado.',
        '**Exclusividade de categoria.** Por quanto tempo o mesmo criador não anuncia um concorrente direto.',
        '**Entrega do arquivo.** Receber o vídeo em alta, e não só o link do post, é o que permite reaproveitar o material depois.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'A Doxa está de um lado só desta comparação: produz conteúdo vertical em escala para o perfil da própria empresa — cada vídeo único, com roteiro, voz, edição e capa, entregue pronto para postar. Ela não intermedeia criadores, não agencia influenciadores e não vende tráfego pago: as visualizações contabilizadas nas metas são orgânicas, sem depender de compra de mídia, dentro das metas de performance definidas em contrato. Quem publica é o cliente, no perfil dele.',
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
            'Faz crescer o alcance daquela publicação, que é diferente. Parte de quem assiste visita o perfil da marca, e é aí que a conversão de audiência acontece ou não: quem chega e encontra um perfil sem vídeos recentes costuma não voltar. O ganho de seguidores por campanha de influência depende muito mais do que existe no seu perfil do que do tamanho do criador.',
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
 *          `ugc-vs-conteudo-de-marca` compara FORMATO de peça, não audiência.
 * [x]  7. Informação incremental: a tabela de oito critérios por audiência, os
 *          dois itens que somem das propostas e a lista do que combinar por
 *          escrito com um criador.
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
