import type { Pagina } from '../../tipos';

/**
 * ADJACÊNCIA §47: a busca é capturada editorialmente, sem a Doxa se dizer
 * agência. A página é neutra de ponta a ponta — inclusive sobre arranjos que a
 * Doxa não vende — e a empresa aparece UMA vez, dizendo o que NÃO é.
 *
 * Fronteira com as vizinhas: `/solucoes/marketing-com-ia` é a página COMERCIAL
 * e já tem a seção "A Doxa não é uma agência de marketing com IA"; aqui a
 * negação não é repetida com as mesmas palavras nem vira FAQ, porque a FAQ
 * "A Doxa é uma agência de marketing com IA?" já existe lá (FAQPage duplicado).
 * `/guias/ia-no-marketing` é dono do bloco "como avaliar uma OPERAÇÃO com IA"
 * (processo); as sete perguntas daqui são de CONTRATO, e não se sobrepõem.
 * `/comparativos/agencia-vs-equipe-interna` é dono da comparação de arranjos e
 * recebe a ponte no fim.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "não é agência: não há equipe de gravação, estúdio nem calendário
 *    editorial do lado do cliente" → `docs/seo/source-of-truth.md` §1, fonte:
 *    `public/llms.txt:40-41`;
 *  · "não é tráfego pago" → §1, fonte: `public/llms.txt:42`;
 *  · "não vende curso, ferramenta nem assinatura de software" → §1, fonte:
 *    `public/llms.txt:43`;
 *  · produz conteúdo vertical em escala para empresas e agências → §1, fonte:
 *    `public/llms.txt:6`;
 *  · o funil termina em conversa humana, sem checkout → §1, fonte:
 *    `public/llms.txt:47-49`;
 *  · retorno em até 24 horas para marcar a auditoria estratégica → §2, fonte:
 *    `public/llms.txt:47-49`; `src/components/comparacao/config.ts:273,297`.
 *
 * As ferramentas de mercado NÃO são nomeadas aqui: `src/components/tools.ts:3-13`
 * proíbe implicar endosso ou parceria, e citar marcas numa página sobre como
 * avaliar fornecedores é exatamente o contexto em que a implicação nasce.
 * Nenhuma estatística de mercado entra: não há fonte citável para nenhuma.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'o-que-e-uma-agencia-de-marketing-com-ia',
  titulo: 'O que é uma agência de marketing com IA e como avaliar',
  descricao:
    'O termo cobre três arranjos bem diferentes de empresa. O que cada um entrega de fato, sete perguntas para a reunião de proposta e os sinais de proposta fraca.',
  h1: 'O que é uma agência de marketing com IA',
  resumo:
    'Agência de marketing com IA não é uma categoria nova de empresa: é uma agência cujo custo de produzir a próxima peça caiu, porque parte da cadeia passou a ser feita por software. O problema é que o mesmo nome cobre três arranjos muito diferentes, com entregas e riscos distintos. Abaixo, quais são, o que cada um entrega de fato e as perguntas que separam proposta séria de folheto.',
  intencao: 'informacional',
  palavrasChave: [
    'agência de marketing com ia',
    'o que é agência de ia',
    'agência de conteúdo com inteligência artificial',
    'contratar agência de ia',
    'como avaliar agência de marketing',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/guias/ia-no-marketing',
    '/comparativos/agencia-vs-equipe-interna',
    '/solucoes/marketing-com-ia',
    '/comparativos/ia-vs-producao-tradicional-de-video',
    '/guias/como-medir-resultado-de-conteudo-organico',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se as sete perguntas acima já estão respondidas e falta decidir com quem produzir, conte quantas peças a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por que a definição escorrega',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Não há certificação reconhecida que restrinja o uso do nome: qualquer empresa de serviço de marketing pode imprimir "com IA" na apresentação no dia em que passar a usar um modelo para escrever legenda. O que resta de estável na expressão é pouco, e é isto: uma empresa que planeja e/ou produz marketing para terceiros, com modelos generativos em algum ponto da cadeia.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Como "algum ponto da cadeia" vai de um estagiário usando um assistente a uma linha de produção inteira automatizada, a única pergunta que separa uma coisa da outra é onde exatamente a IA entra — e é ela que a próxima seção responde.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três arranjos com o mesmo nome',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Arranjo', 'Onde a IA entra', 'O risco de contratá-lo sem saber'],
      linhas: [
        [
          'Agência tradicional que adotou IA',
          'Nos bastidores: rascunho de texto, referência visual, transcrição',
          'A conta continua a de sempre — o ganho de custo ficou com quem produz, não com quem contrata',
        ],
        [
          'Operação de produção com IA no centro',
          'Na peça em si: locução, imagem de quem fala, versões, legenda',
          'Volume sem critério vira publicação diária que ninguém lembra no dia seguinte',
        ],
        [
          'Revenda de ferramenta com camada de serviço',
          'A ferramenta é o produto; o serviço é configurá-la e treinar você',
          'Você assinou um software e achou que tinha contratado uma equipe',
        ],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nenhum dos três é desonesto por natureza, e cada um resolve um problema diferente. O erro caro é contratar o primeiro esperando o segundo — ou o terceiro esperando qualquer um dos dois.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que costuma estar dentro da entrega',
    },
    {
      tipo: 'lista',
      itens: [
        'Estratégia e definição de temas, com algum grau de participação da empresa contratante.',
        'Roteiro e variações de texto, que costumam ser gerados com apoio de modelo e revisados por gente.',
        'Produção da peça — locução, imagem, edição, legenda, capa —, que é onde a diferença de custo aparece.',
        'Publicação, ou entrega do arquivo para a empresa publicar, dependendo do contrato.',
        'Leitura de resultado, que varia de um relatório mensal automático a uma reunião com decisão.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O item que mais varia é o quarto, e ele muda tudo: quem publica também responde comentário, também recebe mensagem e também é a marca. Vale saber, antes de assinar, de quem é essa parte.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Sete perguntas para a reunião de proposta',
    },
    {
      tipo: 'lista',
      itens: [
        '**Quantas peças, por mês, no contrato?** Volume medido em entregáveis, não em reuniões nem em "posts e stories".',
        '**A produção é sua ou subcontratada?** Muita proposta de planejamento vem com produção terceirizada por fora, e o gargalo da empresa costuma ser exatamente a produção.',
        '**Existe meta de performance escrita?** Se existe, ela é sobre o quê, em quanto tempo, e o que acontece se não for atingida.',
        '**De quem é o material ao fim do contrato?** Arquivos, acessos, aprendizados e o que já foi testado. É o item mais esquecido e o mais caro de descobrir depois.',
        '**Quem responde por erro factual num vídeo?** Modelo generativo erra número, nome e data com naturalidade; a pergunta é quem confere antes de publicar.',
        '**O que acontece se a ferramenta usada mudar ou sumir?** Depender de um fornecedor único é risco operacional, e a resposta honesta é "trocamos por outra", não "isso não acontece".',
        '**O que vocês precisam de mim, e com que frequência?** Toda operação séria precisa de matéria-prima da empresa. Proposta que promete zero envolvimento está prometendo conteúdo genérico.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Quatro sinais de proposta fraca',
    },
    {
      tipo: 'lista',
      itens: [
        '**O portfólio é o mesmo vídeo com marcas diferentes.** Se o formato, o enquadramento e o ritmo se repetem de cliente para cliente, o que está sendo vendido é o molde.',
        '**A apresentação fala de ferramentas, não de entregáveis.** Ferramenta não diferencia fornecedor — o porquê está em [IA no marketing](/guias/ia-no-marketing). Numa proposta, o que precisa aparecer é o que chega pronto no fim do mês.',
        '**Volume prometido sem cadência.** "Cem vídeos por mês" sem dizer como eles serão distribuídos ao longo do mês é um número para impressionar, não um plano.',
        '**Garantia de viralizar.** Ninguém controla se um vídeo específico viraliza, e quem afirma o contrário está vendendo previsão de loteria.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A pergunta anterior a todas: agência é mesmo o formato?',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de comparar propostas, vale checar se o arranjo certo é uma agência. Montar time por dentro, contratar uma agência ou terceirizar só a produção repetitiva resolvem escassezes diferentes — falta de repertório, falta de contexto, falta de braço —, e a comparação lado a lado está em [agência, equipe interna ou operação terceirizada](/comparativos/agencia-vs-equipe-interna).',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Uma nota de transparência, porque esta página está publicada no site de uma empresa do setor: a Doxa **não é uma agência**, e diz isso em público — não há equipe de gravação, estúdio nem calendário editorial do lado do cliente. Também não vende tráfego pago, curso, ferramenta nem assinatura de software, e não tem checkout: o funil termina em conversa humana. O que ela faz é produzir conteúdo vertical em escala para empresas e agências.',
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
          pergunta: 'Uma agência de marketing com IA custa menos?',
          resposta:
            'Custa menos para produzir, o que não é a mesma coisa que cobrar menos. A economia de gerar locução e imagem por software é real, mas ela fica com quem escolher — pode virar preço menor, pode virar mais peças pelo mesmo valor, pode virar margem do fornecedor. O jeito de saber é comparar propostas por peça entregue, e não por mensalidade.',
        },
        {
          pergunta: 'Ela substitui o meu time de marketing?',
          resposta:
            'Costuma substituir a parte repetível — produzir, versionar, editar, legendar — e não a parte que depende de contexto: o que a empresa pode prometer, qual é a oferta do trimestre, que assunto é sensível. Quem terceiriza a produção e mantém a decisão em casa tende a sair melhor do que quem terceiriza as duas coisas.',
        },
        {
          pergunta: 'O que acontece com o conteúdo se o contrato acabar?',
          resposta:
            'Depende inteiramente do que estiver escrito, e é por isso que a pergunta precisa ser feita antes. Arquivos originais, acessos às contas, o histórico do que foi testado e o direito de continuar usando as peças são itens separados, e um contrato pode conceder uns e não outros. Descobrir isso no encerramento significa recomeçar do zero.',
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
        'O nome não diz nada sobre a qualidade do fornecedor — diz apenas que parte da produção virou software. Contrate pelo que está no contrato em peças, prazos e responsabilidades, e trate "com IA" como uma informação sobre o método, não como um argumento.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: não é categoria nova; é custo de produção
 *          que caiu, e o nome cobre três arranjos.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1, §2).
 * [x]  3. Nada da §9: sem preço, sem mensalidade, sem "1.500 clientes", sem
 *          "parceiros" — e nenhuma ferramenta é nomeada nesta página.
 * [x]  4. "Agência" NUNCA é autodefinição da Doxa: aparece como categoria de
 *          mercado, e a única menção à empresa é a negação de §1.
 * [x]  5. A garantia não é citada; a página diz que ninguém controla se um
 *          vídeo específico viraliza.
 * [x]  6. Intenção própria (§47): captura a busca editorialmente. A negação
 *          comercial é de /solucoes/marketing-com-ia; a avaliação de PROCESSO
 *          é de /guias/ia-no-marketing; a comparação de arranjos é de
 *          /comparativos/agencia-vs-equipe-interna.
 * [x]  7. Incremental: os três arranjos com o mesmo nome, as sete perguntas de
 *          CONTRATO e os quatro sinais de proposta fraca.
 * [x]  8. title (52 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/ia-no-marketing; links contextuais úteis.
 * [x] 10. Página neutra: nenhum dos três arranjos é apresentado como errado, e
 *          a nota da Doxa diz o que ela NÃO é, sem se propor como resposta.
 * [x] 11. CTA único, no fim, pelo campo `cta`, condicionado.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "conteúdo vertical em escala", "conversa
 *          humana", "auditoria estratégica".
 * [x] 14. Teste final (§45): sim — é o que eu mandaria para um amigo que
 *          recebeu três propostas e não sabe compará-las.
 * ────────────────────────────────────────────────────────────────────────── */
