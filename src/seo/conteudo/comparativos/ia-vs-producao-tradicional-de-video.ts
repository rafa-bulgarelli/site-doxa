import type { Pagina } from '../../tipos';

/**
 * O comparativo do cluster de IA. A régua do §11: a produção tradicional tem
 * vantagens reais e elas estão nomeadas aqui, com situação e motivo — não como
 * concessão de fachada antes da conclusão já escrita.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · R$ 8.000 a R$ 10.500 por mês para montar a operação por dentro → fonte:
 *    `docs/seo/source-of-truth.md` §4 (`src/components/comparacao/config.ts:100-101`,
 *    `CUSTO_DE`/`CUSTO_ATE`; redação já publicada em `public/llms.txt:11-15`);
 *  · as 25 contratações do "jeito antigo", agrupadas → fonte:
 *    `docs/seo/source-of-truth.md` §4 (`src/components/comparacao/config.ts:44-70`);
 *    o próprio arquivo avisa que a lista é ILUSTRAÇÃO do que uma operação
 *    interna acumula, e não levantamento de mercado — a página diz isso;
 *  · 18 dias até o primeiro vídeo pelo jeito antigo → fonte:
 *    `docs/seo/source-of-truth.md` §4 (`src/components/semcom/config.ts:26`,
 *    `PRAZO_SEM`);
 *  · as nove etapas (briefing, roteiro, aprovação, agenda, estúdio, filmmaker,
 *    captação, edição, publicação) → fonte: `docs/seo/source-of-truth.md` §4
 *    (`src/components/semcom/config.ts:10-20`);
 *  · o clone da Doxa (foto + amostra de voz) e o vídeo pronto para postar →
 *    fonte: `docs/seo/source-of-truth.md` §2 (`src/components/HowItWorks.tsx:84-92`);
 *  · a Doxa não vende curso, ferramenta nem assinatura → fonte: §1
 *    (`public/llms.txt:43`);
 *  · retorno em até 24 horas e auditoria estratégica → fonte: §2.
 *
 * O que NÃO está aqui de propósito: a quebra do custo mensal entre produção,
 * agência e tráfego pago (é SUPOSIÇÃO, comentada fora da tela em
 * `src/components/semcom/config.ts:28-38`), preço da Doxa e qualquer diária de
 * mercado — não há fonte citável para nenhum desses números.
 */
export const pagina: Pagina = {
  tipo: 'comparativo',
  slug: 'ia-vs-producao-tradicional-de-video',
  titulo: 'Vídeo com IA ou produção tradicional: custo e prazo',
  descricao:
    'Gravar ou gerar: o que cada caminho custa por mês, quantas etapas tem, quanto demora até o primeiro vídeo e o que só a câmera resolve. Comparação por critério.',
  h1: 'Vídeo com IA ou produção tradicional',
  resumo:
    'A diferença entre os dois caminhos não está na qualidade da imagem: está no custo do próximo vídeo. Gravar mantém o custo de cada peça quase constante, porque toda peça exige uma gravação; gerar concentra o custo no início e barateia a repetição. Abaixo, os dois lados por custo, prazo, etapas e — principalmente — o que cada um não faz.',
  intencao: 'informacional',
  palavrasChave: [
    'vídeo com ia ou produtora',
    'produção tradicional de vídeo',
    'custo de produção de vídeo',
    'gravar ou gerar vídeo',
    'ia na produção de vídeo',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/solucoes/producao-de-videos-com-ia',
    '/guias/o-que-e-avatar-de-ia',
    '/solucoes/clone-de-ia-para-videos',
    '/comparativos/agencia-vs-equipe-interna',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o gargalo é volume, e não uma peça só, conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O custo que interessa é o do próximo vídeo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Boa parte das comparações entre gravar e gerar erra o alvo porque compara o custo do primeiro vídeo. O número que decide a operação de uma empresa é outro: quanto custa o **décimo vídeo do mês**. Na produção tradicional ele custa quase o mesmo que o primeiro, porque cada peça exige agenda, equipe e captação. Na produção com IA o caro é montar uma vez — depois disso, publicar mais vira uma questão de roteiro.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É por isso que a pergunta certa não é "qual dos dois é melhor", e sim "quantos vídeos a minha empresa precisa publicar por mês". Abaixo de um punhado por trimestre, a câmera resolve. Acima de um por dia útil, a conta da câmera deixa de fechar antes de qualquer discussão sobre estética.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que a produção tradicional realmente exige',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A conta que a Doxa publica no próprio site serve de ilustração do que uma operação interna acumula quando decide gravar com constância — não é levantamento de mercado, é o inventário de uma operação montada por dentro. São **cerca de 25 contratações**, entre gente, equipamento, espaço, pós-produção e distribuição, somando de **R$ 8.000 a R$ 10.500 por mês** — é a faixa da operação completa, produção e distribuição, e a parte de distribuição é igual nos dois caminhos:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Gente:** video maker, roteirista, editor de vídeo, social media, diretor de criação.',
        '**Equipamento:** câmera, lentes, tripé, microfone de lapela, estabilizador, cartões de memória.',
        '**Espaço:** estúdio, iluminação, cenário e as horas de gravação.',
        '**Pós-produção:** ilha de edição, licença de edição, banco de trilhas, banco de imagens, legendagem.',
        '**Distribuição:** agência, gestor de tráfego, verba de mídia, calendário editorial, relatórios.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Além do custo, há o caminho: pelo jeito antigo, uma peça passa por nove etapas — briefing, roteiro, aprovação, agenda, estúdio, filmmaker, captação, edição e publicação —, e o primeiro vídeo leva **18 dias** para ir ao ar. Cada uma dessas etapas é também um ponto onde o cronograma pode parar, e normalmente o que para é a agenda de quem precisa aparecer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A comparação, critério a critério',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Critério', 'Produção tradicional', 'Produção com IA'],
      linhas: [
        ['Etapas até publicar', 'Nove, do briefing à publicação', 'Roteiro, geração e acabamento'],
        ['Prazo do primeiro vídeo', '18 dias, na conta do jeito antigo', 'Depende do preparo inicial, não da agenda'],
        ['Custo do décimo vídeo do mês', 'Quase o mesmo do primeiro', 'Bem menor: o caro foi montar uma vez'],
        ['Dependência de agenda', 'Alta — equipe, estúdio e quem aparece', 'Baixa: o roteiro destrava a produção'],
        ['Variações da mesma ideia', 'Caras: cada versão é um novo take', 'Baratas: cinco aberturas do mesmo texto'],
        ['Demonstração física do produto', 'Resolve: a câmera mostra o objeto', 'Não resolve — fala sobre, não segura'],
        ['Ambiente e pessoas reais', 'Loja, fábrica, equipe, cliente em cena', 'Fora do alcance sem captação'],
        ['Custo mensal para manter', 'R$ 8.000 a R$ 10.500 na operação completa do inventário acima — a distribuição, igual nos dois caminhos, está dentro', 'Depende do volume, não da diária'],
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a produção tradicional ganha',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Há trabalho que nenhuma geração faz, e insistir no caminho errado por economia sai mais caro do que a diária que se tentou evitar:',
    },
    {
      tipo: 'lista',
      itens: [
        '**Quando o produto precisa ser mostrado.** Textura, escala, montagem, uso, prova de funcionamento. A câmera não está sendo usada por estética: ela é a evidência.',
        '**Quando o lugar é parte da mensagem.** A obra, a cozinha, a linha de produção, o consultório. O cenário responde a uma pergunta que o texto não responde.',
        '**Quando há gente real em cena.** Cliente falando por vontade própria, equipe trabalhando, o dia da inauguração. Isso não se reproduz.',
        '**Quando a peça é única e importante.** Filme institucional, campanha de marca, vídeo que vai rodar por dois anos. Custo alto diluído em muito tempo é custo baixo.',
        '**Quando a direção de arte é o diferencial.** Fotografia, movimento de câmera, trilha original e um acabamento que a audiência percebe como investimento.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a produção com IA ganha',
    },
    {
      tipo: 'lista',
      itens: [
        '**Volume com constância.** Publicar todo dia útil deixa de depender de marcar dia, hora e estúdio com cinco pessoas.',
        '**Teste de mensagem.** A mesma ideia em cinco aberturas diferentes custa quase o mesmo que uma, e é assim que se descobre qual prende antes de investir em produção pesada.',
        '**Atualização.** Mudou o preço, a regra ou o nome do plano? O roteiro é corrigido e a peça é refeita, sem remarcar nada.',
        '**Independência da agenda de quem aparece.** O gargalo de uma operação de conteúdo costuma ser uma pessoa só — normalmente a que decide.',
        '**Idiomas e versões.** O mesmo conteúdo em outra língua não vira outra produção.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'A resposta depende de quantas peças e de que tipo. Poucas peças por trimestre, com demonstração física ou presença real: grave. Muitas peças por mês, explicativas, com o mesmo rosto e a mesma marca: gerar costuma sair mais barato e mais previsível. Boa parte das empresas precisa das duas coisas, em proporções diferentes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Tratar como escolha binária é o erro mais caro',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Operação madura raramente escolhe um lado: usa a geração para sustentar o volume — o conteúdo explicativo, recorrente, que precisa sair toda semana — e guarda a câmera para o que só ela faz. Um dia de captação por trimestre rende material de apoio para dezenas de peças, e a produção diária deixa de brigar por espaço na agenda com a gravação especial.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A parte que não muda em nenhum dos dois caminhos é a decisão: o que a marca pode dizer, qual ângulo vale a pena, o que a audiência assistiu até o fim e o que produzir em seguida. Nenhuma ferramenta assume isso, e é essa a diferença entre sessenta vídeos e sessenta vídeos genéricos. O que um avatar faz e não faz está em [o que é um avatar de IA](/guias/o-que-e-avatar-de-ia).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Na Doxa, o caminho é o segundo: uma foto e uma amostra da própria voz viram o clone que grava os vídeos no lugar do cliente, e o que chega é o vídeo pronto para postar — vertical, legendado, no formato do feed. Não é venda de ferramenta nem de licença de software: o que a empresa recebe é o conteúdo produzido. Como isso funciona por dentro está em [produção de vídeos com IA](/solucoes/producao-de-videos-com-ia).',
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
          pergunta: 'A qualidade do vídeo gerado é pior que a do vídeo gravado?',
          resposta:
            'A comparação justa não é entre um vídeo gerado e um comercial com direção de arte: é entre um vídeo gerado e o vídeo que a empresa realmente conseguiria gravar toda semana, com celular, luz de escritório e a agenda de quem decide. Para peça publicitária de alto acabamento, a produção tradicional continua à frente; para conteúdo recorrente de perfil, a diferença que a audiência percebe está no roteiro.',
        },
        {
          pergunta: 'Gravação e geração por IA cabem no mesmo perfil?',
          resposta:
            'Os dois cabem no mesmo perfil, e tende a ser o arranjo mais estável. O material captado — produto, ambiente, equipe, cliente — entra como apoio nas peças geradas, e a rotina de publicação deixa de depender de novas gravações. O que precisa ser combinado é o padrão visual, para que as duas origens não pareçam dois perfis diferentes.',
        },
        {
          pergunta: 'Vídeo com IA funciona para produto físico?',
          resposta:
            'Funciona para a parte explicativa — o que o produto resolve, para quem serve, como se usa, o que responder à objeção mais comum — e não substitui a demonstração. O caminho prático é gravar o produto uma vez, com calma, e usar esse material dentro das peças geradas durante meses.',
        },
        {
          pergunta: 'Preciso demitir a equipe de conteúdo para fazer essa troca?',
          resposta:
            'A troca é de gargalo, não de gente. O que a geração elimina é a dependência da captação a cada peça; o que continua sendo trabalho humano é decidir o assunto, escrever, ler dados e escolher o que produzir em seguida. Por isso a troca costuma ser avaliada errado quando entra na planilha como corte de pessoal: o que ela libera é o tempo que ia para a captação, e tempo liberado só vira resultado se for gasto em decisão.',
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
        'Grave o que precisa ser visto e gere o que precisa ser repetido — e desconfie de qualquer comparação que responda antes de perguntar quantos vídeos você precisa publicar por mês.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: a diferença é o custo do próximo vídeo.
 * [x]  2. Todo fato sobre a Doxa e sobre a conta do jeito antigo vem do source
 *          of truth (R$ 8.000–10.500, 25 contratações, 18 dias, nove etapas),
 *          com a ressalva de ILUSTRAÇÃO que o próprio arquivo de origem exige.
 * [x]  3. Nada da §9: sem a quebra suposta do custo mensal, sem preço da Doxa.
 * [x]  4. Termos proibidos ausentes: nenhuma ferramenta chamada de parceira,
 *          nenhuma "assinatura", nenhuma autodefinição como agência.
 * [x]  5. A garantia não é citada nesta página.
 * [x]  6. Intenção própria: decide entre dois caminhos de produção. A solução
 *          fala de contratar; o guia de avatar define; aqui se compara.
 * [x]  7. Informação incremental: as nove etapas, os 18 dias e a tabela de oito
 *          critérios — nenhum deles está numa SERP genérica de "vídeo com IA".
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de IA; links para as duas soluções do cluster, para o guia de
 *          avatar e para o comparativo de estrutura.
 * [x] 10. IMPARCIAL: cinco situações em que a produção tradicional ganha, com
 *          motivo, e um veredito que manda gravar em parte dos casos.
 * [x] 11. CTA único, no fim, condicionado ao volume.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "clone", "pronto para postar", "jeito antigo".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
