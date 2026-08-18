import type { Pagina } from '../../tipos';

/**
 * O COMPONENTE, não a operação: como a imagem e a voz de quem fala são
 * construídas, o que isso resolve e o que continua fora do alcance.
 * `/solucoes/producao-de-videos-com-ia` cobre a operação inteira.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "uma foto e uma amostra da sua voz… a plataforma monta o clone que vai
 *    gravar os vídeos no seu lugar" → `src/components/HowItWorks.tsx`
 *    (`STEPS_PT`) e `public/llms.txt`, palavra por palavra;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa →
 *    `supabase/manual-seed-v2.sql`;
 *  · as travas que os leads declaram no formulário ("Não tenho tempo", "Não sei
 *    o que falar", "Não gosto de aparecer", "Já paguei agência e não deu
 *    certo", "Não tenho equipe") → `src/components/comparacao/config.ts`;
 *  · as ferramentas (HeyGen, ChatGPT, Claude, Meta, ElevenLabs) →
 *    `src/components/tools.ts`, citadas SEM atribuir função a cada uma: o
 *    arquivo lista a pipeline, não o papel de cada marca, e inferir isso aqui
 *    seria inventar;
 *  · identidade e tom de voz mapeados no início → `src/components/faq/config.ts`,
 *    chave `tom-de-voz`; materiais necessários e gravação do cliente → chave
 *    `gravar`; validação antes de publicar → chave `aprovacao`;
 *  · o que a Doxa não é → `public/llms.txt`.
 *
 * ATENÇÃO ao que esta página NÃO responde: "preciso aparecer no vídeo?" é a
 * pergunta 9 de `PENDENTES` (§9.1) e não tem resposta autorizada. A página
 * chega perto do assunto — é a busca de quem não quer gravar — e para na
 * redação da chave `gravar`: o que é necessário varia conforme o formato e é
 * mapeado no onboarding. Prometer "você nunca precisa aparecer" seria inventar
 * a resposta que o dono ainda não deu.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'clone-de-ia-para-videos',
  titulo: 'Clone de IA para vídeos: uma foto, um áudio e o resto',
  descricao:
    'Como um clone de IA é montado a partir de uma foto e de uma amostra de voz, o que ele resolve numa operação de conteúdo e onde ele não substitui a pessoa real.',
  h1: 'Clone de IA para vídeos',
  resumo:
    'Um clone de IA é a imagem e a voz de uma pessoa reconstruídas por software a partir de material que ela mesma enviou — na Doxa, uma foto e uma amostra da própria voz. A partir daí, o clone grava os vídeos no lugar dela, quantas vezes forem necessárias, sem marcar diária, montar luz nem repetir take.',
  intencao: 'comercial',
  palavrasChave: [
    'clone de ia',
    'clone digital para vídeos',
    'avatar de ia para empresa',
    'clone de voz para vídeo',
    'clone de ia para gravar vídeos',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/solucoes/producao-de-videos-com-ia',
    '/guias/o-que-e-avatar-de-ia',
    '/glossario/avatar-de-ia',
    '/glossario/clone-de-voz',
    '/comparativos/ia-vs-producao-tradicional-de-video',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Quer ver como o seu clone ficaria e o que ele conseguiria publicar por mês? O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como o clone é montado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'São duas metades, e as duas saem de material do próprio cliente: a **imagem** de quem fala e a **voz**. Você manda uma foto e uma amostra da sua voz, e a plataforma monta o clone que vai gravar os vídeos no seu lugar. Não há captação, não há estúdio e não há um segundo dia de gravação quando o roteiro muda — o roteiro muda e o clone regrava.',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'A imagem',
          texto:
            'A foto vira a pessoa que aparece no vídeo. É o que substitui a câmera, a luz e a agenda de quem fala — as três coisas que, numa produção comum, decidem quantos vídeos cabem no mês.',
        },
        {
          titulo: 'A voz',
          texto:
            'A amostra de áudio vira a locução. É a metade que costuma ser subestimada: reconhecer a voz de quem fala é o que faz o vídeo parecer da empresa, e não de um narrador genérico contratado por peça.',
        },
        {
          titulo: 'O roteiro',
          texto:
            'É o que sobra de trabalho de verdade. O clone entrega o que estiver escrito — e um roteiro morno entregue com voz perfeita continua sendo um vídeo morno.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Clone, avatar genérico e dublagem não são a mesma coisa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'As três palavras aparecem juntas nas buscas e descrevem produtos diferentes. Um **avatar genérico** é uma pessoa que não existe, escolhida de uma biblioteca: serve para narrar, e qualquer concorrente pode escolher o mesmo rosto. Uma **dublagem** troca só o áudio de um vídeo que já foi gravado. Um **clone** parte de alguém real e específico — a sua imagem, a sua voz — e é o único dos três que faz o vídeo continuar sendo da sua empresa quando a pessoa não está na frente da câmera.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o clone resolve',
    },
    {
      tipo: 'paragrafo',
      texto:
        'No formulário da Doxa, as travas que as empresas declaram são sempre as mesmas cinco: não tenho tempo, não sei o que falar, não gosto de aparecer, já paguei agência e não deu certo, não tenho equipe. O clone ataca diretamente a primeira e a última, e muda a natureza da segunda.',
    },
    {
      tipo: 'lista',
      itens: [
        'Tempo: gravar deixa de ser um compromisso de agenda. O que sobra para a pessoa é ler e aprovar, não bloquear uma manhã.',
        'Repetição: corrigir uma frase não custa um novo dia de gravação. É por isso que testar dez aberturas diferentes deixa de ser absurdo.',
        'Consistência: a mesma imagem e a mesma voz em todas as peças, sem variação de luz, de humor ou de cabelo entre uma gravação e outra.',
        'Volume: cada vídeo é único — roteiro, voz clonada, edição e capa —, e ainda assim o custo do próximo não cresce como cresceria numa diária.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o clone não resolve',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esta é a parte que raramente aparece em página de fornecedor, e é a que decide se a expectativa vai bater com a entrega.',
    },
    {
      tipo: 'lista',
      itens: [
        'Não improvisa. O clone entrega o que está no roteiro; a graça de uma resposta na hora continua sendo humana.',
        'Não vai ao vivo, não participa de evento e não responde comentário. Onde a presença é o produto, a pessoa vai.',
        'Não cria autoridade que não existe. Ele multiplica o que a empresa tem a dizer — se não há o que dizer, multiplica o vazio.',
        'Não decide. O que publicar, o que descartar e o que a marca não vai afirmar continuam sendo escolhas de gente.',
        'Não dispensa material do cliente em todo formato: o que é necessário — imagens, vídeos, áudios ou participações — é mapeado no onboarding e varia conforme o formato escolhido para a marca.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Clone não é disfarce. Ele é a sua imagem e a sua voz, montadas a partir do que você enviou, para gravar o que você aprovou — e a responsabilidade pelo que é dito continua sendo da empresa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde a Doxa entra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O clone é a segunda das três etapas da operação: primeiro uma reunião para entender o negócio, depois a foto e o áudio que viram o clone, e então o vídeo pronto para postar — vertical, legendado, no formato do feed, publicado pela empresa no perfil dela. A operação inteira, com volume, garantia e o que muda em relação ao jeito antigo, está em [produção de vídeos com IA](/solucoes/producao-de-videos-com-ia).',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Antes de qualquer roteiro, o time mapeia identidade, posicionamento, público, linguagem e restrições da empresa, e é isso que orienta o que o clone diz. A pipeline roda sobre ferramentas de mercado — HeyGen, ChatGPT, Claude, Meta e ElevenLabs —, citadas aqui como ferramentas usadas: nenhuma delas é parceira da Doxa nem endossa este texto.',
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
          pergunta: 'A Doxa consegue seguir a identidade e o tom de voz da minha marca?',
          resposta:
            'No início da operação, nosso time entende a identidade, o posicionamento, o público, a linguagem e as restrições da empresa. Essas informações passam a orientar a produção, para que o conteúdo mantenha consistência com a marca.',
        },
        {
          pergunta: 'Os vídeos precisam ser aprovados por mim antes de serem publicados?',
          resposta:
            'Quando o fluxo do cliente exige aprovação, os conteúdos passam por etapas de validação antes da publicação. A empresa pode acompanhar temas, roteiros, versões e materiais para garantir que tudo esteja alinhado às diretrizes da marca.',
        },
        {
          pergunta: 'Quais ferramentas estão por trás da produção?',
          resposta:
            'A pipeline roda sobre HeyGen, ChatGPT, Claude, Meta e ElevenLabs. Elas aparecem como ferramentas usadas na produção, e nada além disso: nenhuma é parceira da Doxa nem endossa o serviço.',
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
        'Se a dúvida é se o clone se parece com você o suficiente, a resposta útil não vem de texto nenhum: vem de ver o seu. É o que a conversa inicial resolve — quem preenche o formulário é chamado pelo time da Doxa em até 24 horas para marcar a auditoria estratégica.',
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
