import type { Pagina } from '../../tipos';

/**
 * O roteiro como DOCUMENTO: o que se escreve antes de gravar, em que formato,
 * e como saber que ele tem o tamanho certo.
 *
 * Fronteira com as vizinhas: `/guias/como-fazer-videos-curtos-que-prendem` é
 * dono das três DECISÕES da peça (promessa, única ideia, fecho) e da revisão
 * de cinco passos; `/guias/como-fazer-hook-de-video-curto` é dono da abertura;
 * `/solucoes/marketing-com-ia` e `/guias/ia-no-marketing` são donos da divisão
 * geral entre o que a IA gera e o que continua humano. Aqui a IA aparece só no
 * recorte do roteiro, e a página não repete a tabela de camadas de nenhuma.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · roteiro é entregável nomeado: "cada vídeo é único, com roteiro, voz
 *    clonada, edição e capa" → `docs/seo/source-of-truth.md` §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · a empresa acompanha temas, ROTEIROS, versões e materiais quando o fluxo
 *    exige aprovação → §2, fonte: `src/components/faq/config.ts:466-467`;
 *  · identidade, posicionamento, público, linguagem e restrições são mapeados
 *    no início e orientam a produção → §2, fonte:
 *    `src/components/faq/config.ts:485-486`;
 *  · entregável vertical, legendado, no formato do feed → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * Não há aqui nenhum número de "palavras por segundo" nem duração ideal: são
 * afirmações que mudam por locutor e por idioma e não têm fonte no projeto. No
 * lugar delas, a página dá o método de medição (ler em voz alta, cronometrar).
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-escrever-roteiro-de-video-curto',
  titulo: 'Como escrever roteiro de vídeo curto: estrutura e ritmo',
  descricao:
    'Um roteiro de vídeo curto tem cinco campos e cabe em meia página. A estrutura, a coluna que costuma ficar de fora e como medir a duração antes de gravar.',
  h1: 'Como escrever roteiro de vídeo curto',
  resumo:
    'Roteiro de vídeo curto não se parece com roteiro: são cinco campos numa folha — abertura, afirmação, desenvolvimento, fecho e a coluna do que aparece na tela — e ele cabe em meia página. Abaixo, o modelo, o jeito de medir a duração antes de gravar, as cinco frases que sempre saem no corte e onde um modelo de IA ajuda de verdade nesta etapa.',
  intencao: 'informacional',
  palavrasChave: [
    'roteiro de vídeo curto',
    'como escrever roteiro para reels',
    'modelo de roteiro de vídeo',
    'estrutura de roteiro para tiktok',
    'roteiro de vídeo vertical',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/guias/videos-curtos',
    '/guias/como-fazer-hook-de-video-curto',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/roteiro-de-video-curto',
    '/guias/como-produzir-60-videos-em-90-dias',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se escrever não é o gargalo e o que falta é quem transforme sessenta roteiros em sessenta vídeos publicados, conte o que a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Cinco campos, meia página',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O documento que serve a um vídeo de trinta segundos não tem cabeçalho de cena, não tem descrição de plano e não tem rubrica. Ele tem cinco campos, e cada um responde uma pergunta que só se responde antes de ligar a câmera:',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Campo', 'A pergunta que ele responde', 'Tamanho'],
      linhas: [
        ['Abertura', 'Por que a pessoa não vai deslizar para o próximo?', 'Uma frase'],
        ['Afirmação', 'Qual é a única coisa que este vídeo defende?', 'Uma frase, escrita antes do resto'],
        ['Desenvolvimento', 'Que exemplo, número ou demonstração sustenta a afirmação?', 'Três a seis frases faladas'],
        ['Fecho', 'O que a pessoa leva daqui?', 'Uma frase, que fecha o que a abertura abriu'],
        ['Tela', 'O que está escrito e o que aparece em cada trecho?', 'Uma coluna ao lado, do começo ao fim'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A ordem de escrita não é a ordem da tabela. Comece pela **afirmação** — a frase que o vídeo existe para defender —, depois escreva o fecho, depois o desenvolvimento, e a abertura por último. Escrever a abertura primeiro é o que produz vídeos que prometem uma coisa e entregam outra: o começo foi decidido quando ninguém sabia ainda o que a peça ia dizer.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A coluna que costuma ficar de fora',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A quinta linha da tabela é a que separa um roteiro de um texto. Vídeo curto é consumido com o som desligado numa parte considerável do tempo, e a legenda embutida, o texto de apoio e o que está sendo mostrado carregam metade do recado. Se isso não estiver escrito, será improvisado na edição — e improviso na edição custa mais caro do que planejamento na escrita.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na prática, o documento vira duas colunas: à esquerda o que é dito, à direita o que se vê e o que está escrito, alinhados trecho a trecho. Leva dois minutos a mais por roteiro e elimina a pergunta "e agora, o que eu mostro aqui?" no meio da montagem.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'A duração se mede com um cronômetro, não com uma regra',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Não existe número de palavras por segundo que sirva a qualquer pessoa: o ritmo muda com o locutor, com o assunto e com o quanto o vídeo tem de pausa. O único método confiável é banal e ninguém faz — **leia o roteiro em voz alta, no ritmo em que você vai gravar, com o cronômetro do celular na mão**. O número que aparecer é a duração real; qualquer estimativa feita lendo com os olhos vem curta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Feita a leitura, corte. Não porque exista uma duração ideal, mas porque a primeira versão sempre tem gordura: a régua que funciona é tirar cerca de um quinto do texto e ler de novo. Se o sentido não se perdeu, aquele quinto não estava fazendo nada.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O vídeo termina quando a ideia termina. Esticar para chegar a um número redondo cria exatamente o trecho arrastado que faz a curva de retenção cair no meio — e encurtar à força corta o exemplo, que costuma ser a parte que fez a pessoa ficar.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'As cinco frases que sempre saem no corte',
    },
    {
      tipo: 'lista',
      itens: [
        '**"Antes de começar…"** — se vem antes de começar, não faz parte do vídeo.',
        '**"Como eu falei no vídeo anterior…"** — boa parte de quem está assistindo pode não ter visto o anterior, e a frase avisa isso.',
        '**"Vou explicar direitinho…"** — anuncia a explicação em vez de explicar.',
        '**"Bom, então…"** e as outras muletas de transição — elas existem para dar tempo a quem fala, não informação a quem ouve.',
        '**"Se você gostou, comenta aqui embaixo"** no meio da peça — pedido administrativo que interrompe a única coisa que estava segurando a atenção.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Onde um modelo de IA ajuda nesta etapa',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A régua é uma só: **um modelo é bom a partir do seu material e ruim a partir de um tema**. Pedir "escreva um roteiro sobre marketing" devolve o texto médio da internet sobre marketing. Colar a sua afirmação, o seu exemplo e a sua transcrição e pedir trabalho em cima disso é outra conversa — e é aí que a economia de tempo aparece.',
    },
    {
      tipo: 'lista',
      itens: [
        'Gerar dez variações da **sua** abertura, para você escolher uma e descartar nove.',
        'Apontar onde o texto tem duas ideias em vez de uma, que é a pergunta mais difícil de responder sobre o próprio roteiro.',
        'Reescrever um parágrafo formal em ritmo de fala, mantendo as palavras que você faz questão de manter.',
        'Transformar a transcrição de uma conversa real — uma dúvida de cliente respondida por áudio — em quatro roteiros distintos.',
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'O que continua sendo seu: o exemplo concreto que só existe dentro da empresa e a decisão do que a marca pode afirmar. A divisão geral entre as duas coisas está em [IA no marketing](/guias/ia-no-marketing); aqui basta a régua do parágrafo acima.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Numa operação de volume, o roteiro é entregável nomeado, e não rascunho: na Doxa, cada vídeo é único — com roteiro, voz clonada, edição e capa próprios — e a peça chega vertical, legendada, no formato do feed. Identidade, posicionamento, público e restrições da empresa são mapeados no início e passam a orientar a escrita; quando o fluxo do cliente exige aprovação, a empresa acompanha temas, roteiros e versões antes da publicação.',
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
          pergunta: 'Preciso decorar o roteiro antes de gravar?',
          resposta:
            'Decorar palavra por palavra costuma piorar a gravação: a fala fica com cara de texto lido e o olhar denuncia. O que compensa memorizar são quatro coisas — a primeira frase, a afirmação, o exemplo e a última frase. O meio pode sair com as palavras que vierem, porque o roteiro já garantiu que ele tem uma coisa só para dizer.',
        },
        {
          pergunta: 'Quantas palavras cabem em trinta segundos?',
          resposta:
            'Não há um número que sirva a qualquer pessoa: quem fala rápido cabe muito mais do que quem faz pausa, e o mesmo texto muda de duração conforme o assunto exija ênfase. Em vez de contar palavras, leia em voz alta com cronômetro no ritmo em que vai gravar. É a medida que não erra, e leva menos tempo do que procurar a regra.',
        },
        {
          pergunta: 'Vale escrever roteiro para vídeo de demonstração, sem fala?',
          resposta:
            'Vale, e nesse caso o roteiro é sobretudo a coluna da direita: a sequência de imagens, o que está escrito em cada trecho e em que ordem as coisas aparecem. Sem fala, a ordem visual é a única estrutura que existe, e improvisá-la na edição costuma produzir uma peça que mostra tudo e não afirma nada.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O modelo, em cinco linhas',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra um documento em branco e escreva estas cinco linhas, nesta ordem: **afirmação**, **fecho**, **desenvolvimento**, **abertura**, **tela**. Preencha, leia em voz alta com cronômetro, corte um quinto e leia de novo. Repita cinco vezes numa sentada e você terá a semana escrita — que é o único jeito de sustentar volume, como mostra [como produzir 60 vídeos em 90 dias](/guias/como-produzir-60-videos-em-90-dias).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: cinco campos, meia página.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2).
 * [x]  3. Nada da §9.
 * [x]  4. Termos proibidos ausentes.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: o DOCUMENTO. As três decisões da peça são de
 *          /guias/como-fazer-videos-curtos-que-prendem; a abertura é de
 *          /guias/como-fazer-hook-de-video-curto; a divisão IA × humano é dos
 *          hubs de IA, e aqui só aparece o recorte do roteiro.
 * [x]  7. Incremental: a ordem invertida de escrita, a coluna de tela, a
 *          medição por cronômetro e as cinco frases que saem no corte.
 * [x]  8. title (54 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/videos-curtos; links contextuais úteis.
 * [x] 10. Não é comparativo; recusa dar uma duração ideal em vez de inventar
 *          um número que soaria mais útil.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "cada vídeo é único", "roteiro", "vertical,
 *          legendado, no formato do feed".
 * [x] 14. Teste final (§45): sim — é o modelo que eu daria a alguém que
 *          travasse na folha em branco.
 * ────────────────────────────────────────────────────────────────────────── */
