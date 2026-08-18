import type { Pagina } from '../../tipos';

/**
 * O comparativo de estrutura — e o mais delicado da série, porque a Doxa não é
 * nenhuma das duas opções comparadas. A regra que a página segue: comparar os
 * dois caminhos com honestidade até o fim, e só então, UMA vez, dizer que
 * existe um terceiro arranjo e o que ele é.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o inventário do "jeito antigo" (gente, equipamento, espaço, pós-produção,
 *    distribuição) e o custo de R$ 8.000 a R$ 10.500 por mês → fonte:
 *    `docs/seo/source-of-truth.md` §4 (`src/components/comparacao/config.ts:44-70,100-101`).
 *    O arquivo de origem avisa que a lista é ILUSTRAÇÃO do que uma operação
 *    interna acumula, não levantamento de mercado — a página escreve isso.
 *    ATENÇÃO registrada pelo gate: a faixa soma produção E distribuição
 *    (agência, gestor de tráfego, verba) — `src/components/semcom/config.ts:22`
 *    e `public/llms.txt:11-15`. Por isso a lista aqui inclui a distribuição e a
 *    página diz que a faixa é da operação completa: creditar o total só ao
 *    lado "equipe interna" infla um dos lados desta comparação;
 *  · 18 dias até o primeiro vídeo pelo jeito antigo → fonte: §4
 *    (`src/components/semcom/config.ts:26`);
 *  · a Doxa não é agência: não há equipe de gravação, estúdio nem calendário
 *    editorial do lado do cliente → fonte: `docs/seo/source-of-truth.md` §1
 *    (`public/llms.txt:40-41`);
 *  · o entregável é o vídeo pronto para postar e quem publica é o cliente →
 *    fonte: §2 (`src/components/HowItWorks.tsx:92`);
 *  · a Doxa não vende curso, ferramenta nem assinatura → fonte: §1;
 *  · retorno em até 24 horas e auditoria estratégica → fonte: §2.
 *
 * O que NÃO está aqui de propósito: faixa salarial de mercado, fee de agência,
 * preço da Doxa e a quebra suposta do custo mensal (§9). Nenhum desses números
 * tem fonte no projeto, e um deles inventado é conta sobre o dinheiro de quem
 * lê. "Agência licenciada" também não aparece: está em PENDENTES.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'agencia-vs-equipe-interna',
  titulo: 'Agência ou equipe interna: quem faz o quê e a que custo',
  descricao:
    'Contratar uma agência ou montar time próprio: o que muda em custo, prazo, contexto do negócio e onde fica o aprendizado. E o terceiro arranjo que existe.',
  h1: 'Agência ou equipe interna',
  resumo:
    'Agência entra pronta e traz repertório; equipe interna conhece o negócio e responde no mesmo dia. A escolha costuma ser decidida pelo item errado — o preço na proposta — quando os dois itens que realmente pesam são onde fica o aprendizado e quanto a empresa precisa publicar por mês. Abaixo, os dois caminhos por critério, e um terceiro arranjo que não é nenhum dos dois.',
  intencao: 'comercial',
  palavrasChave: [
    'agência ou equipe interna',
    'montar time de conteúdo',
    'terceirizar marketing',
    'custo de equipe de conteúdo',
    'agência de conteúdo ou time próprio',
  ],
  hubs: ['/guias/marketing-organico'],
  relacionadas: [
    '/solucoes/producao-de-conteudo-em-escala',
    '/guias/como-produzir-conteudo-sem-equipe',
    '/comparativos/organico-vs-pago',
    '/solucoes/conteudo-organico-para-empresas',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o que falta é volume de vídeo publicado, e não mais uma estrutura para administrar, conte o que a sua empresa precisa postar por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A pergunta que decide antes do preço',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de comparar propostas, vale responder duas coisas. A primeira: quanto conteúdo a empresa precisa publicar por semana, de verdade, para o canal existir? A segunda: quem vai ficar com o que for aprendido no caminho? A resposta da primeira decide o tamanho da estrutura; a da segunda decide quem deve ser o dono dela. Preço é a terceira pergunta, e ela muda de resposta conforme as duas primeiras.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale também desfazer uma confusão comum: **agência não é sinônimo de produção**. Boa parte das agências entrega estratégia, planejamento e gestão, e costuma subcontratar a produção do vídeo. Se o gargalo da empresa é ter o que publicar amanhã, contratar planejamento resolve o item errado da lista.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'Equipe interna', 'Agência'],
      linhas: [
        ['Conhecimento do negócio', 'Alto e cresce a cada mês', 'Transferido no onboarding, e refeito a cada troca'],
        ['Tempo até começar', 'Meses: contratar, treinar, montar', 'Semanas: a estrutura já existe'],
        ['Tempo de resposta no dia a dia', 'Curto — a pessoa senta ao lado', 'Depende da fila e do time alocado'],
        ['Repertório criativo', 'Limitado ao que o time já viveu', 'Amplo: vários clientes e formatos por ano'],
        ['Custo', 'Fixo: salários, encargos, equipamento, ferramentas', 'Contratado: escopo definido, sem encargo trabalhista'],
        ['Escala de volume', 'Limitada pelas horas de quem está lá', 'Limitada pelo escopo negociado'],
        ['Risco de parada', 'Uma saída pode travar o canal', 'Fim de contrato leva o time embora'],
        ['Onde fica o aprendizado', 'Dentro de casa', 'Na agência, em boa parte'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O custo da equipe interna não é o salário',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A conta que costuma faltar na planilha é a do que uma operação de vídeo acumula. Como ilustração — e é ilustração, não pesquisa de mercado —, o inventário do "jeito antigo" publicado pela Doxa reúne cerca de 25 itens: video maker, roteirista, editor, social media e diretor de criação; câmera, lentes, tripé, microfone, estabilizador e cartões; estúdio, iluminação, cenário e horas de gravação; ilha e licença de edição, banco de trilhas, banco de imagens e legendagem; e, na ponta da distribuição, uma agência, um gestor de tráfego, verba de tráfego pago, calendário editorial e relatórios. Somado, isso custa de **R$ 8.000 a R$ 10.500 por mês**.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Repare no que a faixa cobre: a **operação completa**, produção por dentro e distribuição terceirizada juntas — a agência e o gestor de tráfego estão na mesma soma. Ou seja, não é o preço de montar só o time interno, nem o de contratar só uma agência: é o que a empresa gasta quando decide ter os dois, que costuma ser o cenário de quem chega a esta comparação. Comparar a faixa inteira contra uma proposta de agência sozinha infla um dos lados.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Há ainda o custo de calendário. Pelo caminho tradicional, uma peça passa por briefing, roteiro, aprovação, agenda, estúdio, filmmaker, captação, edição e publicação — e o primeiro vídeo leva **18 dias** para ir ao ar. Nenhuma dessas etapas é supérflua; o problema é que todas se repetem a cada peça, e é isso que trava o volume.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a agência ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Ela já existe.** Não há processo seletivo, período de adaptação nem compra de equipamento antes da primeira entrega.',
        '**Repertório.** Quem trabalha com vários clientes viu formatos, erros e soluções que um time de uma empresa só levaria anos para ver.',
        '**Absorve pico.** Lançamento, sazonalidade e campanha extraordinária não exigem contratar gente que sobra no mês seguinte.',
        '**Especialista sob demanda.** Direção de arte, redação, mídia, edição — cargos que a maioria das empresas não sustenta em tempo integral.',
        '**Olhar de fora.** Quem está dentro da empresa acha óbvio justamente o que o cliente não sabe. A distância ajuda a ver isso.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a equipe interna ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Contexto.** Quem convive com o comercial sabe qual objeção derruba a venda, e conteúdo que responde objeção é o que gera conversa.',
        '**Disponibilidade.** Aconteceu hoje, grava hoje. Nenhum fluxo de aprovação entre empresa e fornecedor vence isso.',
        '**Acúmulo.** O que se aprende sobre a audiência fica na empresa, e continua valendo quando a estrutura muda.',
        '**Alinhamento com a venda.** Um time interno responde pela mesma meta que o comercial, e não pelo relatório de entregáveis do mês.',
        '**Assuntos sensíveis.** Preço, jurídico, crise, dado de cliente: há conteúdo que dá menos trabalho quando não precisa sair de casa.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta depende de qual escassez dói mais. Falta de repertório e de mão de obra pede agência; falta de contexto e de velocidade pede time interno. Se as duas doem ao mesmo tempo, o critério de desempate costuma ser o prazo: a agência entrega antes, o time interno acumula depois.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O arranjo híbrido que costuma funcionar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na prática, a divisão mais estável que se vê não é "tudo dentro" nem "tudo fora". É esta: a **estratégia e a relação com a audiência ficam dentro** — quem responde comentário e mensagem é a empresa —, e a **produção repetitiva fica fora**, com quem a faz em volume. Assim o aprendizado fica em casa, e a fila de conteúdo não depende de uma agenda de gravação.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É o mesmo raciocínio de quem produz sozinho, com uma pessoa só: separar o que exige contexto do que exige braço. O caso extremo — sem agência, sem time e sem orçamento para nenhum dos dois — está em [como produzir conteúdo sem equipe](/guias/como-produzir-conteudo-sem-equipe).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Existe um terceiro arranjo, e a Doxa é ele: não é agência — não há equipe de gravação, estúdio nem calendário editorial do lado do cliente — e também não substitui o time interno. O que ela entrega é o vídeo pronto para postar, vertical e legendado; quem publica e responde a audiência continua sendo a empresa, e a estratégia e a análise dos resultados são feitas junto — mapeadas no onboarding e acompanhadas ao longo da operação.',
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
          pergunta: 'Qual sai mais barato: agência ou equipe interna?',
          resposta:
            'Depende do volume e do prazo em que a conta é fechada. Time interno tem custo fixo que não cai em mês fraco, e leva meses até a primeira entrega madura; agência tem custo contratado e começa antes, mas o aprendizado sai junto com o contrato. Comparar só a proposta mensal contra o salário de uma pessoa é o erro mais comum — falta equipamento, ferramenta, encargo e o tempo até a operação andar.',
        },
        {
          pergunta: 'Dá para começar com agência e internalizar depois?',
          resposta:
            'Dá, e é um caminho razoável, desde que a transferência de conhecimento esteja combinada desde o início: quem é dono dos arquivos, dos acessos, dos aprendizados e do que já foi testado. Sem isso, internalizar é recomeçar, e o segundo começo custa o mesmo que o primeiro.',
        },
        {
          pergunta: 'Agência resolve a falta de conteúdo para publicar?',
          resposta:
            'Só se o contrato incluir produção, e muitos incluem planejamento e gestão com produção terceirizada por fora. Se a empresa precisa publicar vídeo todo dia útil, o item a negociar é o volume de peças entregues por mês, não o número de reuniões de estratégia.',
        },
        {
          pergunta: 'Uma pessoa só consegue tocar a operação de conteúdo?',
          resposta:
            'Consegue conduzir a estratégia, a relação com a audiência e a leitura dos dados. O que não cabe numa pessoa é a produção em volume: roteiro, gravação, edição, legenda e capa, todo dia, para três redes. É nesse ponto que a decisão deixa de ser entre agência e time interno e passa a ser sobre quem produz.',
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
        'Contrate fora o que se repete e mantenha dentro o que exige contexto — e escolha pela pergunta "quem fica com o aprendizado", não pela linha final da proposta.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: as duas perguntas que decidem antes do preço.
 * [x]  2. Todo fato com número vem do source of truth (25 itens, R$ 8.000–10.500,
 *          18 dias, nove etapas), com a ressalva de ILUSTRAÇÃO.
 * [x]  3. Nada da §9: sem salário de mercado, sem fee de agência, sem preço da
 *          Doxa, sem "agência licenciada".
 * [x]  4. Termos proibidos ausentes: a Doxa não se autodefine como agência —
 *          a página diz o contrário, com a redação pública do `llms.txt`.
 * [x]  5. A garantia não é citada nesta página.
 * [x]  6. Intenção própria: estrutura de time. O comparativo de orgânico e pago
 *          trata de canal; a solução de escala trata de contratar.
 * [x]  7. Informação incremental: a conta do que uma operação interna acumula,
 *          os 18 dias e o arranjo híbrido — nada disso está numa SERP genérica.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de marketing orgânico; links para a dor de produzir sem equipe,
 *          para as soluções e para o outro comparativo.
 * [x] 10. IMPARCIAL: cinco vantagens de cada lado, e a Doxa só aparece no fim,
 *          UMA vez, declarando que não é nenhuma das duas opções.
 * [x] 11. CTA único, no fim, condicionado ao gargalo de produção.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "pronto para postar", "vertical", "legendado".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
