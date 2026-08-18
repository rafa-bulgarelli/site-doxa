import type { Pagina } from '../../tipos';

/**
 * A money page do cluster de IA — e a primeira página do motor.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 * Nada aqui foi escrito de cabeça. A regra do §2 do brief do dono é que nenhum
 * cliente, número, resultado ou garantia pode nascer num arquivo de conteúdo, e
 * a lista abaixo é o rastro de cada afirmação, para quem for revisar:
 *
 *  · os três passos → `src/components/HowItWorks.tsx` (`STEPS_PT`);
 *  · R$ 8.000–10.500/mês e o inventário do jeito antigo →
 *    `src/components/comparacao/config.ts` (`CUSTO_DE`, `CUSTO_ATE`, `ITENS`);
 *  · "Um milhão de views. Ou seu dinheiro de volta." → `GARANTIA` no mesmo
 *    arquivo, que é a manchete do topo da landing;
 *  · a letra da garantia ("metas de performance definidas em contrato") →
 *    `src/components/faq/config.ts`, resposta `garantia`, palavra por palavra;
 *  · as quatro respostas do FAQ → o mesmo arquivo, chaves `gravar`, `organico`,
 *    `primeiros-videos` e `preco`, palavra por palavra. `volume` e `tom-de-voz`
 *    saíram daqui porque as donas dessas perguntas são
 *    `/solucoes/producao-de-conteudo-em-escala` e `/solucoes/marketing-com-ia`;
 *  · o parágrafo sobre complementar a estratégia com anúncios → chave
 *    `midia-extra` do mesmo arquivo, que virou prosa em vez de pergunta porque
 *    a dúvida "preciso de tráfego pago?" já está respondida no corpo;
 *  · 60 conteúdos em 90 dias, "o que a Doxa não é" e as 24 horas de retorno →
 *    `public/llms.txt`;
 *  · TikTok, Instagram e YouTube Shorts → `public/llms.txt` e a resposta
 *    `redes` do FAQ;
 *  · as ferramentas → `src/components/tools.ts`, e elas aparecem como
 *    ferramentas USADAS: nenhuma delas é parceira nem endossa a Doxa;
 *  · os três clientes e os números deles → `src/components/hero/cases.ts`,
 *    entre aspas e sem arredondar. Magalu não tem números no repositório, e
 *    por isso esta página não publica nenhum para ele.
 *
 * O que NÃO está aqui, e não está de propósito: NENHUM valor de mensalidade,
 * prazo do primeiro vídeo, fidelidade, formas de pagamento ou letra do contrato.
 * A pergunta de preço aparece no FAQ, mas com a única resposta autorizada — a
 * que manda para a conversa com o time e não diz número (§9.1 do source of
 * truth). As outras nove perguntas de `PENDENTES`, no `faq/config.ts`, não são
 * nem perguntadas: o dono ainda não respondeu, e uma resposta plausível
 * inventada aqui vira promessa comercial publicada.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'producao-de-videos-com-ia',
  titulo: 'Produção de vídeos com IA para empresas: como funciona',
  descricao:
    'Como uma empresa produz vídeo vertical com inteligência artificial: o que a IA gera, o que continua humano, quanto custa fazer por dentro e onde a Doxa entra.',
  h1: 'Produção de vídeos com IA para empresas',
  resumo:
    'Produzir vídeo com IA é gerar roteiro, locução e a imagem de quem fala por software, em vez de reunir equipe, câmera e estúdio a cada gravação. Na Doxa, uma foto e uma amostra de voz viram um clone que grava no seu lugar — vertical, legendado, pronto para postar.',
  intencao: 'comercial',
  palavrasChave: [
    'produção de vídeos com ia',
    'vídeos com inteligência artificial para empresas',
    'produzir vídeo com ia',
    'avatar de ia para vídeos',
    'clone de voz para vídeos',
    'conteúdo em vídeo com ia',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/solucoes/clone-de-ia-para-videos',
    '/solucoes/producao-de-conteudo-em-escala',
    '/comparativos/ia-vs-producao-tradicional-de-video',
    '/guias/o-que-e-avatar-de-ia',
    '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Conte quantos vídeos a sua empresa precisa publicar por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que é produção de vídeos com IA',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a produção de vídeo em que as partes mais caras da gravação — a pessoa na frente da câmera, a voz e o cenário — são geradas por software a partir de material que já existe. Em vez de marcar uma diária, montar luz e gravar de novo a cada peça, o material de origem é reaproveitado: uma foto vira a imagem de quem fala, uma amostra de voz vira a locução, e o roteiro é escrito e ajustado por texto.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que muda não é a estética do vídeo: é o **custo marginal do próximo vídeo**. Numa operação tradicional, o décimo vídeo do mês custa quase o mesmo que o primeiro, porque cada um exige gravação. Numa operação com IA, o caro é montar o clone uma vez; publicar todo dia deixa de ser uma questão de agenda e passa a ser uma questão de roteiro.',
    },
    {
      tipo: 'lista',
      itens: [
        'Gerado por software: a imagem de quem fala, a locução, as legendas e as variações de roteiro.',
        'Continua humano: a estratégia, o que a marca pode e não pode dizer, a leitura dos dados e a decisão sobre o que publicar de novo.',
        'Continua do cliente: a foto, a amostra de voz e o conhecimento do próprio negócio.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como funciona na Doxa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'São três passos, e só o primeiro pede o seu tempo.',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'A gente aprende o seu negócio',
          texto:
            'Uma reunião para preencher o que você faz, quem você quer atingir e o que espera dos vídeos.',
        },
        {
          titulo: 'Uma foto e um áudio viram o seu clone',
          texto:
            'Você manda uma foto e uma amostra da sua voz. A plataforma monta o clone que vai gravar os vídeos no seu lugar.',
        },
        {
          titulo: 'O vídeo pronto para postar',
          texto: 'Vertical, legendado, no formato do feed. Você recebe e publica no seu perfil.',
        },
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O volume não é um vídeo por semana: a referência da operação é **sessenta conteúdos em noventa dias**, conforme as condições e o prazo do contrato, publicados no TikTok, no Instagram e no YouTube Shorts. É esse volume que sustenta a lógica da coisa — testar hook, formato e narrativa em quantidade suficiente para descobrir o que a audiência da sua marca assiste até o fim, em vez de apostar num vídeo por mês.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que muda em relação ao jeito antigo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Montar essa operação por dentro custa entre **R$ 8.000 e R$ 10.500 por mês**, na conta que a Doxa publica na própria landing — o inventário de UMA operação, com produção, agência e tráfego somados. É ilustração do que uma empresa acumula para publicar com constância, não um levantamento de mercado, e não é o salário de uma pessoa.',
    },
    {
      tipo: 'lista',
      itens: [
        'Gente: video maker, roteirista, editor de vídeo, social media, diretor de criação.',
        'Equipamento: câmera, lentes, tripé, microfone de lapela, estabilizador, cartões de memória.',
        'Espaço: estúdio, iluminação, cenário e as horas de gravação.',
        'Pós: ilha de edição, licença de edição, banco de trilhas, banco de imagens, legendagem.',
        'Distribuição: agência, gestor de tráfego, verba de tráfego pago, calendário editorial, relatórios.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'E ainda assim, nenhuma garantia de viralizar. Esse é o ponto que a conta esconde: o custo é fixo e recorrente, e o resultado continua sendo uma aposta. A comparação entre os dois caminhos, com o que cada um resolve e onde cada um falha, é o assunto de [IA e produção tradicional de vídeo](/comparativos/ia-vs-producao-tradicional-de-video).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A garantia',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto: 'Um milhão de views. Ou seu dinheiro de volta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A letra dessa frase é esta: a Doxa trabalha com metas de performance definidas em contrato. A operação é estruturada para atingir o volume de visualizações acordado dentro do período estabelecido e, caso a meta não seja alcançada, aplicam-se as condições de garantia previstas no contrato.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A garantia é sobre a **performance total contratada**, não sobre um vídeo específico. Nenhuma operação séria promete que a peça número 14 vai viralizar; o que se pode construir é volume, dados e testes suficientes para aumentar as chances de alcançar grandes audiências.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra — e onde ela não entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A Doxa assume a produção e a estratégia de distribuição do conteúdo em vídeo. O que ela não é vale a mesma tinta, porque é o que evita a conversa errada:',
    },
    {
      tipo: 'lista',
      itens: [
        'Não é uma agência: não há equipe de gravação, estúdio nem calendário editorial do lado do cliente.',
        'Não é tráfego pago: a garantia é de views orgânicas somadas, não de anúncios.',
        'Não vende curso, ferramenta nem assinatura de software.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'As visualizações contabilizadas nas metas são orgânicas, vindas da distribuição dos conteúdos produzidos dentro da operação, sem depender da compra de mídia para atingir as metas contratadas. Se a empresa quiser complementar a estratégia com anúncios, isso é feito separadamente.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As ferramentas por trás da operação',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A produção roda sobre ferramentas de mercado: HeyGen, ChatGPT, Claude, Meta e ElevenLabs. São ferramentas usadas, e nada além disso — nenhuma delas é parceira da Doxa nem endossa o que está escrito aqui. O que a Doxa constrói em cima delas é o processo: o que entra em cada roteiro, o que é testado, o que é descartado e o que vira mais vinte vídeos.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O que decide o resultado não é a conta assinada, e sim o processo em volta dela. O mapa de onde a IA entra numa operação de marketing — e de onde ela não entra — está em [IA no marketing](/guias/ia-no-marketing).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três vídeos publicados por clientes',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Os números abaixo são os das publicações nos perfis dos próprios clientes, como estão registrados no site. Onde não há número registrado, não há número publicado aqui.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Cliente', 'O que foi produzido', 'O que o post fez'],
      linhas: [
        ['Core (@corealquimias)', 'Vídeo viral', '3,4M views · 170k curtidas · 3k comentários · 1.300 reposts'],
        ['Uninova (@uninovamotos)', 'Vídeo viral', '+2,5M views · +111k curtidas'],
        ['Magalu', 'Vídeo de SKU/produto', 'Números não publicados'],
      ],
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
          pergunta: 'Eu preciso gravar os vídeos ou vocês fazem tudo?',
          resposta:
            'A Doxa consegue assumir grande parte da operação de conteúdo. No onboarding entendemos quais materiais — imagens, vídeos, áudios ou participações — serão necessários. A necessidade de gravação do cliente varia conforme o formato escolhido para a marca.',
        },
        {
          pergunta: 'As visualizações são orgânicas?',
          resposta:
            'As visualizações contabilizadas nas metas da Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da nossa operação. Sem depender da compra de mídia para atingir as metas contratadas.',
        },
        {
          pergunta: 'E se os primeiros vídeos não performarem bem?',
          resposta:
            'Os primeiros conteúdos que performam abaixo do esperado fazem parte do processo: eles geram dados sobre audiência, temas, formatos, hooks e narrativas. A estratégia da Doxa não depende de acertar todos os vídeos. Quando identificamos padrões de maior performance, aumentamos a produção em torno do que funciona e descartamos rápido o que não funciona.',
        },
        {
          pergunta: 'Quanto custa para contratar a Doxa?',
          resposta:
            'O investimento varia de acordo com o volume de conteúdo, a meta de visualizações e o tamanho da operação. A Doxa desenvolve uma estratégia personalizada para cada empresa e, depois de entendermos seus objetivos, nosso time apresenta o plano mais adequado.',
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
        'O primeiro passo é uma conversa, não uma compra: quem preenche o formulário é chamado pelo time da Doxa em até 24 horas para marcar a auditoria estratégica. Não há checkout nem cobrança dentro do site.',
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
