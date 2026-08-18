import type { Pagina } from '../../tipos';

/**
 * O guia de EXECUÇÃO do hook — só os dois ou três primeiros segundos.
 *
 * Fronteira com as vizinhas: `/glossario/hook` DEFINE o termo e diz por que ele
 * decide o alcance; `/guias/como-fazer-videos-curtos-que-prendem` monta a PEÇA
 * inteira (promessa, única ideia, fecho) e é dono do teste da primeira frase
 * lida em voz alta. Esta página é a oficina do começo: os três canais
 * simultâneos, os pares fraco × forte e o método de reescrita. Nenhum bloco das
 * outras duas é reproduzido aqui: onde o assunto encosta no da dona (o custo de
 * uma promessa não cumprida), esta página fica com o sintoma na curva e manda o
 * leitor para lá com link.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · os primeiros conteúdos que performam abaixo do esperado geram dados sobre
 *    audiência, temas, formatos, hooks e narrativas → `docs/seo/
 *    source-of-truth.md` §2, fonte: `src/components/faq/config.ts` (resposta
 *    `primeiros-videos`);
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa → §2, fonte:
 *    `supabase/manual-seed-v2.sql:168`;
 *  · entregável vertical, legendado, no formato do feed → §2, fonte:
 *    `src/components/HowItWorks.tsx:92`;
 *  · retorno em até 24 horas → §2, fonte: `public/llms.txt:47-49`.
 *
 * Os exemplos de abertura são inventados para ilustrar a reescrita e estão
 * rotulados como tal na própria tabela: nenhum é fala de cliente da Doxa, e
 * nenhum vem acompanhado de resultado. Não há número de retenção aqui, de
 * mercado ou próprio — não existe fonte citável para nenhum no repositório.
 */
export const pagina: Pagina = {
  tipo: 'guia',
  slug: 'como-fazer-hook-de-video-curto',
  titulo: 'Como fazer o hook de um vídeo curto: os primeiros segundos',
  descricao:
    'O hook não é uma frase: são três coisas ao mesmo tempo — o que se diz, o que se vê e o que está escrito na tela. Oito pares de abertura fraca e forte.',
  h1: 'Como fazer o hook de um vídeo curto',
  resumo:
    'O hook fraco costuma ter uma causa só: quem escreveu cuidou apenas da fala e deixou a imagem e o texto na tela por conta do acaso. Nos dois primeiros segundos os três canais chegam juntos, e a pessoa decide com os três. Abaixo, o que cada um deve carregar, oito pares de abertura fraca e forte, e um método de cinco minutos para reescrever qualquer começo.',
  intencao: 'informacional',
  palavrasChave: [
    'como fazer hook de vídeo',
    'hook para vídeo curto',
    'exemplos de hook',
    'abertura de vídeo curto',
    'reescrever hook',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/glossario/hook',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/retencao',
    '/guias/como-escrever-roteiro-de-video-curto',
    '/guias/por-que-meus-videos-nao-tem-views',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Se o problema não é escrever a abertura e sim ter quem produza vídeo suficiente para testá-la, conte o volume que a sua empresa precisa por mês. O time da Doxa responde em até 24 horas.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O hook chega por três canais ao mesmo tempo',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nos dois primeiros segundos a pessoa recebe três informações ao mesmo tempo: o que a voz diz, o que a imagem mostra e o que está escrito na tela. A decisão de ficar é tomada com as três juntas. Quem escreve só a fala aposta um terço da mão — e é por isso que existem aberturas com uma boa frase que mesmo assim não seguram ninguém.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Canal', 'O que ele carrega', 'O erro típico'],
      linhas: [
        ['Fala', 'O assunto, declarado sem preâmbulo', 'Começar por "oi, gente" ou pelo nome da empresa'],
        ['Imagem', 'A cena mais forte do vídeo, já em movimento', 'Abrir com plano parado de alguém tomando ar'],
        ['Texto na tela', 'A promessa em três a cinco palavras, legível de longe', 'Nada escrito, ou o título do vídeo em fonte miúda'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'A régua prática: os três canais dizem a **mesma** coisa, de formas diferentes. Se a fala anuncia um erro comum, a imagem mostra o erro e o texto na tela o nomeia. Redundância aqui não é desperdício — é o que faz o recado sobreviver ao som desligado e ao meio segundo de atenção.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Oito pares: a mesma ideia, aberta de dois jeitos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'As frases abaixo são inventadas para ilustrar a reescrita — não são de cliente nenhum e não vêm com resultado. O que muda entre as colunas não é o conteúdo do vídeo: é só onde ele começa.',
    },
    {
      tipo: 'tabela',
      cabecalho: ['Abertura fraca', 'Abertura forte'],
      linhas: [
        ['"Hoje vou falar sobre alimentação"', '"Você está tomando água demais na hora errada"'],
        ['"Bem-vindos a mais um vídeo"', '"Esse contrato tem uma cláusula que ninguém lê"'],
        ['"Vamos falar de organização financeira"', '"Existe um jeito de pagar boleto que sai mais caro"'],
        ['"Dicas para melhorar seu treino"', '"Se dói no joelho, o problema costuma ser o quadril"'],
        ['"Sobre o novo produto da loja"', '"Testei o mais barato e o mais caro lado a lado"'],
        ['"Como funciona o nosso serviço"', '"O pedido chega em três dias porque não passa por estoque"'],
        ['"Deixa eu me apresentar rapidinho"', '"Já perdi cliente por causa dessa frase no orçamento"'],
        ['"Você sabia que existem várias formas?"', '"Tem duas formas, e uma delas cobra o dobro"'],
      ],
    },
    {
      tipo: 'paragrafo',
      texto:
        'Repare no padrão da coluna da direita: toda frase é **específica**, toda frase é sobre quem assiste, e nenhuma faz sentido pela metade — o vídeo precisa continuar para que a informação feche, e é essa dívida aberta que segura o dedo.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'E quando não há nada para dizer nos primeiros segundos',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Nem toda peça começa com fala. Demonstração, tela gravada, antes e depois, mão em cena: aí a imagem faz o trabalho inteiro, e a exigência é maior. O quadro de abertura precisa mostrar o estado mais estranho ou mais quebrado da sequência — nunca o começo cronológico dela.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Comece pelo resultado, não pelo processo.** O bolo pronto abre; a farinha na tigela entra no segundo cinco.',
        '**Corte o enquadramento até restar o que interessa.** Se a mesa inteira aparece, ninguém sabe onde olhar.',
        '**Ponha o texto na tela nesse caso, sempre.** Sem fala, ele passa a ser o único canal que declara o assunto.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Três hooks que funcionam uma vez e cobram depois',
    },
    {
      tipo: 'lista',
      itens: [
        '**A promessa maior que o vídeo.** O preço que ele cobra do perfil está em [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem); do lado da abertura, o sintoma é a curva — ela não cai no começo, cai onde a promessa deixa de vir.',
        '**A urgência inventada.** "Últimas horas", "só hoje" em conteúdo que não tem prazo nenhum. Funciona até a pessoa notar que é o mesmo aviso de sempre.',
        '**O "olha isso" sem assunto.** Chamar atenção sem declarar sobre o quê atrai qualquer um — e qualquer um sai no terceiro segundo, devolvendo à plataforma o pior sinal possível sobre a peça.',
      ],
    },
    {
      tipo: 'destaque',
      variante: 'atencao',
      texto:
        'Um hook que atrai a pessoa errada é pior do que um hook fraco. Ele consome a amostra inicial com gente que nunca ia ficar, e a leitura que sobra sugere que o assunto não interessa — quando o problema era a porta de entrada.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Reescrever um hook em cinco minutos',
    },
    {
      tipo: 'passos',
      itens: [
        {
          titulo: 'Escreva a conclusão do vídeo primeiro',
          texto:
            'Uma frase: o que a pessoa vai saber no fim. Muitas vezes é essa frase, invertida ou pela metade, que vira a melhor abertura possível.',
        },
        {
          titulo: 'Comece na primeira frase que se entende sozinha',
          texto:
            'Ache a primeira linha que já faz sentido sem a anterior e, ainda assim, deixa uma pergunta aberta. O vídeo começa ali; o que veio antes era aquecimento.',
        },
        {
          titulo: 'Troque a palavra genérica pela específica',
          texto:
            '"Alimentação" vira "o iogurte que você toma de manhã". "Processo" vira "a assinatura que trava o orçamento". Especificidade é o que faz a pessoa se reconhecer na frase.',
        },
        {
          titulo: 'Escreva o texto de tela em até cinco palavras',
          texto:
            'Se não couber em cinco palavras, o hook ainda tem duas ideias dentro. Uma delas é o próximo vídeo.',
        },
        {
          titulo: 'Escolha o quadro de abertura de propósito',
          texto:
            'Percorra o material bruto e escolha o instante mais forte para ser o primeiro. Esse item leva trinta segundos e é o mais pulado da lista.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Como saber se o hook era o problema',
    },
    {
      tipo: 'paragrafo',
      texto:
        'A resposta está na curva de [retenção](/glossario/retencao): se a queda mais violenta está nos primeiros segundos, o começo não segurou; se a curva se mantém alta e cai no meio, o hook cumpriu o papel e o problema é outro. Um vídeo isolado não decide nada — os conteúdos que performam abaixo do esperado são os que geram dado sobre audiência, tema, formato e hook.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O jeito barato de testar é republicar o mesmo conteúdo com outra abertura, sem mexer em mais nada. Duas aberturas, mesma peça, uma variável — responde a pergunta dentro de uma semana.',
    },
    {
      tipo: 'destaque',
      variante: 'doxa',
      texto:
        'Numa operação de volume, o hook deixa de ser inspiração e vira etapa: na Doxa, cada vídeo entregue é único — roteiro, voz clonada, edição e capa próprios — e sai vertical, legendado, no formato do feed. Testar dezenas de aberturas por trimestre é o que troca "achamos que funciona" por "sabemos qual ficou".',
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
          pergunta: 'Quantos segundos dura um hook?',
          resposta:
            'Ele dura até a pessoa decidir, o que costuma acontecer entre o primeiro e o terceiro segundo. Por isso a pergunta útil não é de duração, e sim de conteúdo: se aos dois segundos o espectador ainda não sabe sobre o que é o vídeo, a abertura já falhou, tenha ela um segundo ou seis.',
        },
        {
          pergunta: 'Dá para reaproveitar o mesmo hook em vários vídeos?',
          resposta:
            'O formato, sim: uma estrutura que funciona pode virar padrão da série. A frase literal, não — repetida, ela vira vinheta, e vinheta é a primeira coisa que o espectador aprende a pular. Mantenha a estrutura, troque o específico.',
        },
        {
          pergunta: 'Texto na tela conta como hook mesmo sem fala?',
          resposta:
            'Conta, e às vezes é o canal que mais trabalha: há muita situação em que ligar o som não é opção, e o texto é o que declara o assunto para quem está nessa situação. A condição é que seja legível numa tela pequena e fique longe das bordas, onde a interface passa por cima.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O exercício de hoje',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra os seus cinco últimos vídeos e transcreva só a primeira frase de cada um, numa lista. Leia tudo de uma vez. Se todas começarem do mesmo jeito, você não tem cinco aberturas — tem uma, repetida cinco vezes. Reescreva as duas piores e publique como teste. O resto da peça está em [como fazer vídeos curtos que prendem](/guias/como-fazer-videos-curtos-que-prendem).',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase responde: o hook fraco costuma ser hook escrito só
 *          na fala. Sem aquecimento.
 * [x]  2. Todo fato sobre a Doxa tem entrada no source of truth (§2).
 * [x]  3. Nada da §9.
 * [x]  4. Termos proibidos ausentes; nenhuma promessa de viralização.
 * [x]  5. A garantia não é citada.
 * [x]  6. Intenção própria: SÓ o começo do vídeo. O verbete /glossario/hook
 *          define; /guias/como-fazer-videos-curtos-que-prendem monta a peça
 *          inteira e é dono do teste da frase lida em voz alta.
 * [x]  7. Incremental: os três canais simultâneos, os oito pares e o método de
 *          reescrita em cinco passos.
 * [x]  8. title (58 caracteres), description e H1 exclusivos.
 * [x]  9. Hub /guias/videos-curtos; links contextuais, nenhum decorativo.
 * [x] 10. Não é comparativo; nomeia três hooks que funcionam uma vez e cobram
 *          depois, em vez de vender técnica infalível.
 * [x] 11. CTA único, no fim, pelo campo `cta`.
 * [x] 12. Sem stuffing.
 * [x] 13. Vocabulário do dono: "vertical, legendado, no formato do feed",
 *          "cada vídeo é único".
 * [x] 14. Teste final (§45): sim — a tabela de pares é o que eu mostraria numa
 *          folha para quem está travado na primeira frase.
 * ────────────────────────────────────────────────────────────────────────── */
