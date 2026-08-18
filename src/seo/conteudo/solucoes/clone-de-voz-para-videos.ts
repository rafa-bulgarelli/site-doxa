import type { Pagina } from '../../tipos';

/**
 * A metade VOZ do clone, do lado comercial. O verbete
 * `/glossario/clone-de-voz` define o termo e a diferença para uma voz
 * sintética genérica; `/solucoes/clone-de-ia-para-videos` cobre as duas
 * metades juntas (imagem + voz) e a montagem do clone. Esta página fica com o
 * que sobra e é dela: o caminho da amostra até o vídeo publicado, o
 * consentimento dentro de uma empresa, a diferença para dublagem — e o §47,
 * dito com todas as letras: a Doxa NÃO vende clone de voz avulso.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · "Você manda uma foto e uma amostra da sua voz. A plataforma monta o clone
 *    que vai gravar os vídeos no seu lugar" → `docs/seo/source-of-truth.md` §2,
 *    fonte: `src/components/HowItWorks.tsx:84-92`; `public/llms.txt:6-9`;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · o entregável é o arquivo pronto para publicação — vertical, legendado, no
 *    formato do feed — e quem publica é o cliente → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`;
 *  · o que é necessário do cliente (imagens, vídeos, áudios ou participações) é
 *    mapeado no onboarding e varia conforme o formato → §2 "Processo depois de
 *    contratar", fonte: `src/components/faq/config.ts:431-432`;
 *  · identidade, posicionamento, público, linguagem e restrições orientam a
 *    produção → §2, fonte: `src/components/faq/config.ts:485-486`;
 *  · "não vende curso, ferramenta nem assinatura de software" e as outras
 *    negativas → §1, fonte: `public/llms.txt:40-49`. É esta linha, somada ao
 *    fato de o clone ser um COMPONENTE da entrega (§2), que autoriza a frase
 *    "a Doxa não vende clone de voz avulso" — a negativa é a direção segura;
 *  · ElevenLabs na stack, como FERRAMENTA usada e nunca parceira → §6, fonte:
 *    `src/components/tools.ts:3-13,18-24`;
 *  · retorno em até 24 horas para marcar a auditoria estratégica → §2 "O
 *    funil", fonte: `src/components/comparacao/config.ts:273,297`.
 *
 * O que NÃO está aqui: quantos minutos de amostra são necessários, quanto
 * custa, prazo, e de quem são os direitos do vídeo depois de pronto (pergunta
 * 10 de `PENDENTES`, §9.1). Nenhuma lei é citada pelo nome: o texto fala de
 * autorização e de responsabilidade, que é o que a página pode sustentar.
 *
 * Também NÃO está aqui, e saiu na revisão do collector: qualquer frase sobre
 * licenciar ou não licenciar o MODELO da voz por fora. Posse do modelo é
 * vizinha da pergunta 10 de `PENDENTES` e não tem fonte — a página para na
 * negativa que o `llms.txt` sustenta ("não é possível contratar a Doxa só
 * para clonar uma voz").
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'clone-de-voz-para-videos',
  titulo: 'Clone de voz para vídeos: da amostra à locução que grava',
  descricao:
    'Como uma amostra de voz vira a locução de todos os vídeos seguintes, o que o consentimento exige numa empresa e por que a Doxa não vende voz avulsa.',
  h1: 'Clone de voz para vídeos',
  resumo:
    'Clone de voz para vídeos é usar uma amostra da voz de uma pessoa para gerar a locução de tudo o que ela publicar depois, sem regravar a cada peça. Na Doxa isso não é um produto à parte: a amostra chega junto com a foto e vira o clone que grava os vídeos no lugar do cliente. Abaixo, o que acontece entre a amostra e o vídeo publicado, o que o consentimento exige e o que essa troca não resolve.',
  intencao: 'comercial',
  palavrasChave: [
    'clone de voz para vídeos',
    'clonagem de voz para vídeo',
    'locução com ia',
    'voz sintética para vídeo de empresa',
    'narração com clone de voz',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/glossario/clone-de-voz',
    '/solucoes/clone-de-ia-para-videos',
    '/solucoes/producao-de-videos-com-ia',
    '/glossario/avatar-de-ia',
    '/guias/ia-no-marketing',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o que a sua empresa precisa é publicar vídeo com a própria voz, com constância, conte o volume que ela precisa por mês. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O caminho entre a amostra e o vídeo publicado',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Todo o processo depende de uma gravação só, feita uma vez. A partir dela, cada vídeo novo é uma questão de texto: o que muda de uma peça para a outra é o roteiro, não a agenda de quem fala.',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'A amostra',
          texto:
            'Uma gravação da pessoa falando normalmente. Fala corrida costuma render mais do que frases soltas, e ruído de fundo, música e uma segunda pessoa no áudio costumam ser o que mais atrapalha o resultado.',
        },
        {
          titulo: 'O modelo da voz',
          texto:
            'A amostra vira um modelo capaz de ler qualquer texto naquela voz, com a entonação e o sotaque de quem falou. É a etapa que acontece uma vez e serve todos os vídeos seguintes.',
        },
        {
          titulo: 'O roteiro',
          texto:
            'A partir daqui, produzir um vídeo é escrever — e é aqui que a troca cobra o preço dela. Com a gravação fora do caminho, o limite da operação passa a ser ter o que dizer toda semana: a fila de roteiros vira o novo gargalo.',
        },
        {
          titulo: 'A locução e a montagem',
          texto:
            'O texto vira áudio, o áudio se junta à imagem de quem fala, e o arquivo é fechado com edição, legenda e capa. A metade da imagem está em [clone de IA para vídeos](/solucoes/clone-de-ia-para-videos).',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Voz de catálogo, clone e dublagem são três produtos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'As três aparecem na mesma busca e resolvem coisas diferentes. A definição formal do termo está no verbete [clone de voz](/glossario/clone-de-voz); o que interessa aqui é a consequência prática de escolher cada uma.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Recurso', 'O que ele faz', 'Onde ele encaixa'],
      linhas: [
        [
          'Voz sintética de catálogo',
          'Lê um texto com uma voz que não é de ninguém em particular',
          'Narração de apoio, quando não importa quem está falando',
        ],
        [
          'Clone da voz de uma pessoa',
          'Lê qualquer texto soando como alguém específico e reconhecível',
          'Conteúdo em que a marca é a pessoa que aparece',
        ],
        [
          'Dublagem',
          'Troca o áudio de um vídeo que já foi gravado, mantendo a imagem',
          'Material antigo que precisa de outra língua ou de outra fala',
        ],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença que decide a escolha é uma só: a voz de catálogo é intercambiável e a clonada não é. Uma empresa que troca de narrador a cada mês está pedindo à audiência que reconheça uma marca sem nunca ouvir a mesma voz duas vezes.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Consentimento não é formalidade',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Quem autoriza o uso de uma voz é a pessoa dona dela, e ninguém mais — não o chefe, não o sócio, não o departamento de marketing. A autorização vale para o uso que foi combinado, e é aí que o raciocínio costuma parar, cedo demais. Três perguntas evitam a conversa difícil depois.',
    },
    {
      tipo: 'lista',
      itens: [
        'Para quê: só os vídeos do perfil da empresa, ou também anúncio, treinamento interno e material de venda?',
        'Por quanto tempo: enquanto a pessoa estiver na empresa, ou os vídeos já publicados continuam no ar depois?',
        'Quem guarda a amostra e o modelo, e o que acontece com eles quando a relação termina.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'O caso que costuma pegar as empresas de surpresa é a saída de quem fala. Um perfil inteiro construído sobre a voz de uma pessoa que deixou a empresa vira um acervo que ninguém sabe se pode continuar publicando. Combinar isso no começo custa uma conversa; combinar depois custa o acervo.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'E vale o óbvio, porque o óbvio some quando a produção acelera: a responsabilidade pelo que é dito com aquela voz continua sendo de quem publica o vídeo. Por que a facilidade técnica não cria direito nenhum de uso está no verbete [clone de voz](/glossario/clone-de-voz).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que o clone de voz não resolve',
    },
    {
      tipo: 'lista',
      itens: [
        'Não escreve o roteiro. Ele lê o que existe, e é o texto que decide se alguém assiste até o fim.',
        'Não substitui a imagem. Locução perfeita sobre um vídeo sem ninguém aparecendo é rádio com legenda — e a lista do que o clone inteiro não resolve, do improviso à transmissão ao vivo, está em [clone de IA para vídeos](/solucoes/clone-de-ia-para-videos).',
        'Não resolve volume sozinho. Sem alguém decidindo os temas toda semana, o gargalo apenas muda de lugar.',
        'Não cria reconhecimento sozinho: mantém a mesma voz em todas as peças; quem constrói o reconhecimento é a repetição.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A Doxa não vende clone de voz avulso',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale dizer com todas as letras, porque é a pergunta que chega por esta busca: não é possível contratar a Doxa só para clonar uma voz. O clone é um componente da entrega, e a entrega é conteúdo em vídeo. Quem quer apenas gerar uma locução para usar por conta própria procura uma ferramenta de mercado, e isso não é o que esta página oferece.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'O que existe é o pacote inteiro: uma foto e uma amostra da voz viram o clone que grava os vídeos no lugar do cliente, e cada vídeo entregue é único — roteiro, voz clonada, edição e capa —, pronto para postar, vertical, legendado, no formato do feed. Quem publica é a empresa, no perfil dela.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que a empresa precisa mandar além da amostra — imagens, vídeos, áudios ou participações — é mapeado no onboarding e varia conforme o formato escolhido para a marca. Identidade, posicionamento, público, linguagem e restrições são levantados no início e passam a orientar o que o clone diz. A produção roda sobre ferramentas de mercado, entre elas o ElevenLabs, citadas aqui como ferramentas usadas e nada além disso: nenhuma é parceira da Doxa nem endossa este texto.',
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
          pergunta: 'Posso usar a voz de um sócio ou de um funcionário nos vídeos?',
          resposta:
            'Só com a autorização da própria pessoa, e para o uso que ela autorizou. O que acontece com os vídeos já publicados se ela sair da empresa é assunto de contrato, e está registrado em [clone digital](/glossario/clone-digital).',
        },
        {
          pergunta: 'Nome de produto e sigla saem com a pronúncia certa?',
          resposta:
            'Nome próprio, sigla e termo técnico são onde a locução sintética costuma tropeçar, porque a leitura depende de como a palavra está escrita. A correção mora no roteiro — escrever a palavra do jeito que ela é falada —, e custa uma linha de texto, não uma regravação.',
        },
        {
          pergunta: 'A locução clonada soa robótica?',
          resposta:
            'O que costuma denunciar uma locução não é a voz: é o texto. Frase longa demais, jargão escrito para ser lido no papel e ausência de pausa soam artificiais mesmo na boca de uma pessoa. Roteiro escrito para ser falado é o que mais muda a percepção de quem assiste.',
        },
      ],
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde o que é e já diz que a voz não é vendida
 *          separada — a informação que quem busca precisa antes de tudo.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§1, §2, §6).
 * [x]  3. Nada da §9: sem preço, sem prazo, sem minutos de amostra, sem
 *          direitos do vídeo (pergunta 10 de PENDENTES).
 * [x]  4. Termos proibidos ausentes; "assinatura", "curso" e "ferramenta"
 *          aparecem só dentro da negativa publicada do `llms.txt`.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: a VOZ do lado comercial. O verbete define, a
 *          solução de clone cobre as duas metades, e esta trata do caminho da
 *          amostra, do consentimento e da recusa do §47.
 * [x]  7. Incremental: a tabela catálogo × clone × dublagem, as três perguntas
 *          de consentimento e o caso da pessoa que sai da empresa.
 * [x]  8. Title, description e H1 exclusivos; H2 em hierarquia real.
 * [x]  9. Pertence a `/guias/ia-no-marketing`; linka o verbete e a solução
 *          irmã sem repetir o conteúdo de nenhum dos dois.
 * [x] 10. Não é comparativo; ainda assim a tabela admite onde a voz de
 *          catálogo e a dublagem são a escolha certa.
 * [x] 11. CTA único no fim.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "clone", "voz clonada", "pronto para postar".
 * [x] 14. Publicaria sem Google: sim — as três perguntas de consentimento são
 *          o que falta em toda página de fornecedor sobre o assunto.
 * ────────────────────────────────────────────────────────────────────────── */
