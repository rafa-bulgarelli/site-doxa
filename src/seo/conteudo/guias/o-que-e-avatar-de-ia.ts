import type { Pagina } from '../../tipos';

/**
 * ADJACÊNCIA (§47 do brief 011). "Avatar de IA" é uma busca vizinha do que a
 * Doxa faz, e não é o que a Doxa vende. A página é editorial: explica a
 * categoria inteira, inclusive usos que a Doxa não atende, e só no fim faz a
 * ponte legítima para o clone descrito em `HowItWorks.tsx`.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o clone da Doxa: uma foto e uma amostra da voz do cliente viram o clone
 *    que grava os vídeos no lugar dele → fonte: `docs/seo/source-of-truth.md`
 *    §1 e §2 (`src/components/HowItWorks.tsx:84-92`; `public/llms.txt:6-9`);
 *  · o entregável é o vídeo pronto para postar, vertical, legendado, no formato
 *    do feed, e quem publica é o cliente → fonte:
 *    `docs/seo/source-of-truth.md` §2 (`src/components/HowItWorks.tsx:92`);
 *  · a Doxa não vende curso, ferramenta nem assinatura de software → fonte:
 *    `docs/seo/source-of-truth.md` §1 (`public/llms.txt:43`);
 *  · gravação do cliente: a Doxa assume grande parte da operação, e o que é
 *    necessário varia conforme o formato, mapeado no onboarding → fonte:
 *    `docs/seo/source-of-truth.md` §2 (`src/components/faq/config.ts:431-432`);
 *  · retorno em até 24 horas, auditoria estratégica, sem checkout no site →
 *    fonte: `docs/seo/source-of-truth.md` §2 (`public/llms.txt:47-49`).
 *
 * Tudo o mais é descrição de uma categoria de software — como um avatar é
 * montado, onde o mercado usa, onde ele falha — sem citar produto, preço, marca
 * ou estatística de terceiro. Não há aqui nenhum número de mercado, porque não
 * há fonte citável para nenhum.
 *
 * O que NÃO está aqui de propósito: nome de ferramenta com juízo de valor
 * (`src/components/tools.ts` proíbe implicar endosso), preço de plataforma de
 * avatar e qualquer afirmação de que a Doxa comercialize avatar avulso.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'o-que-e-avatar-de-ia',
  titulo: 'O que é avatar de IA e quando ele substitui a câmera',
  descricao:
    'Avatar de IA é uma pessoa digital que apresenta um vídeo sem gravação. Como é construído, onde o mercado usa, onde ele falha e o que ele não substitui.',
  h1: 'O que é um avatar de IA',
  resumo:
    'Avatar de IA é uma representação digital de uma pessoa que apresenta um vídeo sem que ninguém precise gravar aquela cena: a imagem, a voz e a sincronia labial são geradas por software a partir de um roteiro em texto. Abaixo, como ele é construído, os usos que existem hoje, os limites que ninguém contorna e a diferença entre um avatar genérico e um clone da própria pessoa.',
  intencao: 'informacional',
  palavrasChave: [
    'o que é avatar de ia',
    'avatar de ia',
    'avatar digital para vídeo',
    'apresentador de ia',
    'clone digital',
  ],
  hubs: ['/guias/ia-no-marketing'],
  relacionadas: [
    '/glossario/avatar-de-ia',
    '/glossario/clone-de-voz',
    '/solucoes/clone-de-ia-para-videos',
    '/comparativos/ia-vs-producao-tradicional-de-video',
    '/guias/o-que-e-uma-agencia-de-marketing-com-ia',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o que você precisa não é uma ferramenta de avatar, e sim vídeo publicado com constância, conte o que a sua empresa precisa postar. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A definição, sem rodeio',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Um avatar de IA é uma figura humana gerada por software que apresenta um vídeo a partir de um roteiro escrito. Você digita o texto, escolhe a pessoa digital e a voz, e o sistema devolve um vídeo em que aquela figura fala o texto com movimento de boca, cabeça e expressão. Não há câmera, estúdio nem take — o que existe é um modelo treinado para produzir imagem e som coerentes com o que foi digitado.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Duas peças formam o avatar, e elas são independentes: a **imagem** de quem fala e a **voz** que sai. A imagem pode ser um personagem genérico de catálogo ou a reconstrução de uma pessoa real; a voz pode ser sintética ou clonada a partir de uma amostra. Os dois conceitos têm verbete próprio em [avatar de IA](/glossario/avatar-de-ia) e [clone de voz](/glossario/clone-de-voz).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como um avatar é construído',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'O material de origem',
          texto:
            'Uma foto, um curto vídeo de referência ou os dois. É desse material que sai a aparência: rosto, enquadramento, iluminação de base e a forma como a cabeça se move enquanto fala.',
        },
        {
          titulo: 'A voz',
          texto:
            'Uma amostra de áudio da pessoa gera um modelo de voz, ou escolhe-se uma voz pronta do catálogo. É a peça que mais denuncia pressa: voz de catálogo em vídeo de marca soa como narração de tutorial genérico.',
        },
        {
          titulo: 'O roteiro',
          texto:
            'O texto é o insumo real. O avatar não improvisa, não corrige uma frase mal escrita e não sabe o que a empresa não pode dizer — tudo isso continua sendo trabalho de quem escreve.',
        },
        {
          titulo: 'A geração e o acabamento',
          texto:
            'O sistema sincroniza fala e movimento e devolve o vídeo. Corte, legenda, capa, trilha e enquadramento vertical vêm depois, na edição, como em qualquer outra peça.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o mercado usa avatar de IA hoje',
    },
    {
      tipo: 'lista',
      itens: [
        '**Treinamento interno e comunicação corporativa** — o mesmo conteúdo precisa ser atualizado toda vez que uma política muda, e regravar é caro.',
        '**Localização em vários idiomas** — o mesmo roteiro apresentado em outra língua sem remarcar uma diária de gravação.',
        '**Documentação de produto e onboarding** — vídeos curtos que explicam uma tela, um passo, um recurso, com atualização frequente.',
        '**Conteúdo para redes sociais** — quando a limitação é a agenda de quem aparece, não a falta de assunto.',
        '**Testes de mensagem** — a mesma ideia em cinco aberturas diferentes, para descobrir qual prende, antes de gravar qualquer coisa de verdade.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Repare no que os cinco casos têm em comum: **repetição**. Avatar rende quando o mesmo formato precisa ser produzido muitas vezes. Para uma peça única, por ano, com direção de arte e trilha original, a conta não fecha — e nesse caso a câmera continua sendo a resposta certa.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde o avatar falha, e trocar de ferramenta não resolve',
    },
    {
      tipo: 'lista',
      itens: [
        '**Demonstração física.** Se o vídeo precisa mostrar o produto sendo montado, vestido, provado ou usado, é preciso filmar aquilo. O avatar fala sobre; ele não segura.',
        '**Espontaneidade.** Risada fora de hora, gesto que não estava no roteiro, resposta a algo que acabou de acontecer — é o que faz um vídeo parecer gente, e é justamente o que o roteiro não prevê.',
        '**Ambiente real.** A loja, a fábrica, o consultório, a obra. O cenário conta parte da história, e um fundo gerado não conta.',
        '**Confiança de quem já conhece a pessoa.** Se a audiência convive com o fundador, ela percebe. O avatar funciona melhor onde a relação ainda vai ser construída do que onde ela já existe.',
        '**Entonação de assunto delicado.** Comunicado de crise, pedido de desculpa, resposta a reclamação pública: são casos em que a presença humana é a mensagem.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Imagem e voz de uma pessoa são dela. Gerar um avatar a partir de alguém que não autorizou — cliente, funcionário, figura pública — não é um problema técnico, é um problema jurídico e de reputação. Autorização por escrito antes de qualquer geração.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Avatar genérico ou clone da própria pessoa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'É a distinção que mais muda o resultado, e a que menos aparece nas comparações de ferramenta. Um **avatar genérico** é um personagem de catálogo: resolve quando o rosto não precisa significar nada — treinamento, tutorial, aviso operacional. Um **clone** é a reconstrução de uma pessoa específica, com a aparência e a voz dela, e existe para que o conteúdo continue sendo dito por quem a audiência reconhece.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A diferença prática aparece no perfil de uma marca. Conteúdo apresentado por um personagem de catálogo é conteúdo sem dono; conteúdo apresentado pelo rosto de quem responde pela empresa carrega autoridade, mesmo quando o vídeo foi gerado. Por isso, para marketing, clone costuma render onde o avatar de catálogo não rende.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'É esse o caminho que a Doxa usa: o cliente manda uma foto e uma amostra da própria voz, a plataforma monta o clone que grava os vídeos no lugar dele, e o que chega é o vídeo pronto para postar — vertical, legendado, no formato do feed. Quem publica é o cliente, no perfil dele. A Doxa não comercializa avatar avulso nem licença de ferramenta: o que ela entrega é o conteúdo produzido.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que continua sendo trabalho humano',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Vale escrever com todas as letras, porque é a parte que a demonstração de qualquer ferramenta esconde: o avatar substitui a gravação, não a decisão. Continuam humanos o que a marca pode e não pode dizer, o ângulo de cada roteiro, a leitura do que a audiência assistiu até o fim e a escolha do que produzir em seguida. Uma ferramenta de avatar em mãos sem estratégia produz sessenta vídeos genéricos em vez de nenhum — e sessenta vídeos genéricos não são melhores do que nenhum.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Também continua humano — ou pelo menos continua sendo captado no mundo real — o material que só a câmera dá. Numa operação de conteúdo bem montada, os dois convivem: o avatar sustenta o volume, e a gravação entra onde a demonstração é a mensagem. A comparação entre os dois caminhos, com custo e prazo de cada um, está em [vídeo com IA ou produção tradicional](/comparativos/ia-vs-producao-tradicional-de-video).',
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
          pergunta: 'Dá para perceber que o vídeo foi feito com avatar de IA?',
          resposta:
            'Em muitos casos, sim — e isso importa menos do que parece. O que costuma denunciar não é a imagem, é o texto: roteiro sem opinião, entonação uniforme e a ausência de qualquer coisa fora do script. Vídeos com avatar que passam despercebidos são, em geral, os que têm roteiro bom, corte rápido e um assunto específico.',
        },
        {
          pergunta: 'Avatar de IA é a mesma coisa que deepfake?',
          resposta:
            'A tecnologia é vizinha, a diferença é o consentimento. Avatar de IA é gerado a partir de material cedido por quem autorizou o uso da própria imagem e voz. Deepfake é o uso da imagem de alguém sem autorização, normalmente para fazer a pessoa dizer o que ela não disse. Uma coisa é produção; a outra é fraude.',
        },
        {
          pergunta: 'Preciso aparecer em vídeo se uso um clone?',
          resposta:
            'O material de origem é uma foto e uma amostra de voz, e não uma agenda de gravações. O que ainda pode ser necessário — imagens de produto, cenas do ambiente, uma participação pontual — depende do formato escolhido para a marca e costuma ser definido no início da operação, não no meio dela.',
        },
        {
          pergunta: 'Avatar de IA serve para qualquer nicho?',
          resposta:
            'Serve melhor onde a informação é o produto — serviço, consultoria, educação, saúde, direito, tecnologia — e pior onde a experiência física é o produto, como gastronomia, moda e obra. Nesses casos ele não desaparece: assume a parte explicativa, enquanto a câmera fica com a demonstração.',
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
        'Avatar de IA resolve repetição, não resolve presença. Se o seu problema é publicar o mesmo tipo de vídeo muitas vezes sem depender da agenda de ninguém, ele é a ferramenta certa; se o seu problema é mostrar algo que só existe no mundo físico, nenhuma geração vai substituir a câmera.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase define o termo — é o que a busca "o que é" pede.
 * [x]  2. Todo fato sobre a Doxa vem do source of truth (clone, entregável,
 *          quem publica, o que a Doxa não vende, as 24 horas).
 * [x]  3. Nada da §9: sem preço, sem "1.500 clientes", sem "parceiros", sem
 *          direitos do vídeo, sem fidelidade.
 * [x]  4. Termos proibidos ausentes: nenhuma autodefinição como agência,
 *          nenhuma "assinatura", nenhuma ferramenta chamada de parceira.
 * [x]  5. A página não cita a garantia.
 * [x]  6. Intenção própria (§47): definição editorial da categoria. O verbete
 *          define em poucas linhas; a solução fala de contratar; esta explica.
 * [x]  7. Informação incremental: avatar genérico × clone, os cinco usos reais
 *          e a lista do que nenhuma ferramenta resolve.
 * [x]  8. title exclusivo, description 120–160, H1 único, H2 em hierarquia.
 * [x]  9. Hub de IA; links para os dois verbetes, para a solução e para o
 *          comparativo. Nenhum link decorativo.
 * [x] 10. Imparcial: diz onde o avatar falha e onde a câmera ganha, e nomeia
 *          usos que a Doxa não atende.
 * [x] 11. CTA único, no fim, pelo campo `cta`, e explicitamente não vende
 *          ferramenta.
 * [x] 12. Sem keyword stuffing.
 * [x] 13. Vocabulário do dono: "clone", "pronto para postar", "vertical,
 *          legendado, no formato do feed".
 * [x] 14. Teste final (§45): publicaria com o Google desligado.
 * ────────────────────────────────────────────────────────────────────────── */
