import type { PorIdioma } from '../../idioma';

/**
 * Conteúdo do dono do FAQ. Aqui mora TODA pergunta e TODA resposta — o resto
 * dos arquivos só sabe procurar e desenhar.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A REGRA DESTE ARQUIVO, e ela não é estilística.
 *
 * Cada resposta daqui é uma afirmação comercial publicada, feita por escrito,
 * para alguém que está decidindo se paga. Uma frase inventada sobre prazo,
 * preço, fidelidade ou garantia não é um bug de conteúdo: é uma promessa que a
 * empresa passa a dever. Por isso só existe resposta aqui em dois casos:
 *
 *   1. o fato já está no repositório — e então ele é IMPORTADO, nunca copiado;
 *   2. o fato é a ausência dele ("este número não está nesta página"), que é
 *      verdade e continua sendo verdade depois.
 *
 * O que não cabe em nenhum dos dois vai para `PENDENTES`, lá embaixo, e NÃO É
 * RENDERIZADO. Uma pergunta sem resposta some da tela; uma pergunta com resposta
 * inventada vira o contrato.
 *
 * ATENÇÃO — ESTE ARQUIVO DEIXOU DE IMPORTAR DE `comparacao/config`.
 *
 * Ele importava `FILTRO`, `GARANTIA`, `RETORNO` e `TROCA_DEPOIS`, e a disciplina
 * era esta: uma cópia que o compilador mantém é melhor do que duas que um humano
 * promete manter. As seis respostas novas são texto do dono e não derivam mais
 * de nada, então o vínculo caiu.
 *
 * O preço disso é concreto e vale saber onde ele cobra: a GARANTIA agora existe
 * em duas redações independentes. O topo da página promete "Um milhão de views.
 * Ou seu dinheiro de volta." (`GARANTIA`, em `comparacao/config`), e a resposta
 * daqui fala em "metas de performance definidas em contrato" e "condições de
 * garantia previstas no contrato". As duas são compatíveis — a segunda é a letra
 * da primeira —, mas nada no código força isso a continuar verdade. Se a
 * promessa do topo mudar, esta resposta tem de mudar no mesmo commit, e agora é
 * um humano quem lembra.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Duvida {
  chave: string;
  /**
   * O rótulo do atalho. Curto: é um botão, não uma frase.
   *
   * OPCIONAL, e a ausência é o que separa as duas metades deste arquivo.
   *
   * Com atalho, a dúvida vira um botão na bandeja do campo — são as seis "que
   * todo mundo tem", exatamente como a linha acima do campo promete. Sem atalho,
   * ela existe SÓ para a busca: ninguém a vê, e quem digita a pergunta recebe a
   * resposta.
   *
   * A distinção resolve uma tensão real. Vinte e três botões não são atalhos,
   * são um índice — e um índice na frente de um campo de conversa diz à pessoa
   * para procurar em vez de perguntar, que é o contrário do que esta seção faz.
   * Mas as dezessete de baixo respondem coisas que custam venda quando ficam
   * sem resposta. As duas coisas ao mesmo tempo: seis na tela, vinte e três no
   * que o campo sabe.
   */
  atalho?: string;
  /** A pergunta como uma pessoa a faria — é ela que aparece na conversa. */
  pergunta: string;
  /** A resposta, em parágrafos. Dois, no máximo: isto é um FAQ, não um artigo. */
  resposta: readonly string[];
  /**
   * As palavras que SÓ podem ser sobre isto.
   *
   * "garantia", "mensalidade", "whatsapp" — quem escreve uma delas já disse
   * qual é o assunto, e nenhuma outra dúvida deveria ganhar dela. Âncora vale
   * três vezes um termo comum, e é essa diferença que resolve a pergunta que
   * fala de dois assuntos ao mesmo tempo: em "como funciona a garantia?", a
   * âncora `garantia` tem de vencer o `como funciona` da outra dúvida.
   */
  ancoras: readonly string[];
  /**
   * As palavras que sugerem isto, mas também poderiam ser outra coisa.
   *
   * Valem pouco de propósito. Elas existem para dar resposta a quem foi vago —
   * "como funciona", sozinho, tem de achar alguma coisa —, e não para disputar
   * com quem foi específico.
   *
   * Palavra genérica DEMAIS não entra nem aqui. "quanto" morava nesta lista e
   * mandava "quantos vídeos por mês?" para a resposta do preço: uma pergunta
   * sem resposta escrita recebendo uma resposta errada, que é o pior resultado
   * que este arquivo pode produzir.
   */
  termos: readonly string[];
}

const DUVIDAS_PT: readonly Duvida[] = [
  /*
   * ─── AS SEIS, DITADAS PELO DONO ─────────────────────────────────────────────
   *
   * O conjunto anterior foi substituído inteiro. Ele tinha seis também, mas
   * outras seis: como funciona, os R$ 100, o preço, depois que eu pago, a
   * garantia e quem já usou — três delas sobre DINHEIRO. Estas falam de
   * operação, prova e resultado.
   *
   * As respostas são do dono, palavra por palavra, e é assim que tem de ser:
   * cada uma afirma um fato sobre o negócio dele que a página passa a sustentar
   * publicamente. Eu escrevo `ancoras` e `termos`, que são busca e não conteúdo.
   *
   * O que se perdeu está registrado embaixo, em `PENDENTES`.
   */
  {
    chave: 'garantia',
    atalho: 'A garantia',
    pergunta: 'Como funciona a garantia?',
    resposta: [
      'A Doxa trabalha com metas de performance definidas em contrato.',
      'Nossa operação é estruturada para atingir o volume de visualizações acordado dentro do período estabelecido e, caso a meta não seja alcançada, aplicam-se as condições de garantia previstas no contrato.',
    ],
    ancoras: [
      'garantia',
      'garantido',
      'dinheiro de volta',
      'reembolso',
      'milhao',
      'meta',
      'contrato',
    ],
    termos: ['devolve', 'devolucao', 'nao der certo', 'e se nao'],
  },
  {
    chave: 'como-gera',
    /* "Como vocês viralizam?" e não "Como vocês geram", a pedido do dono. O
       rótulo passou a usar o verbo da página inteira — a manchete promete
       viralizar, o botão do hero diz "Quero viralizar", e o atalho que pergunta
       COMO isso acontece falava de "gerar". Duas palavras para a mesma coisa,
       com a segunda mais fraca. */
    atalho: 'Como vocês viralizam?',
    pergunta: 'Como a Doxa gera tantas visualizações?',
    resposta: [
      'Construímos uma operação proprietária de conteúdo baseada em volume, testes constantes, análise de dados e otimização.',
      'Em vez de depender de um único vídeo viral, criamos um sistema contínuo para aumentar as chances de distribuição e crescimento.',
    ],
    ancoras: [
      'como voces viralizam',
      'como viralizam',
      'como voces geram',
      'como geram',
      'como funciona',
      'metodo',
      'operacao',
      'sistema',
    ],
    termos: ['processo', 'etapas', 'estrategia', 'segredo', 'algoritmo'],
  },
  {
    chave: 'organico',
    atalho: 'É orgânico?',
    pergunta: 'As visualizações são orgânicas?',
    /* ── NENHUMA RESPOSTA COMEÇA COM UM "SIM" SOLTO, e este arquivo aprendeu
       isso do jeito caro.

       Ela abria com "Sim. As visualizações geradas pela Doxa são 100%
       orgânicas". Perfeito para a pergunta escrita aqui — e o dono digitou
       "Preciso de tráfego pago?", que a busca mandou para cá pela âncora
       `trafego pago`. O que apareceu na tela foi "Sim." embaixo de "Preciso de
       tráfego pago?": a resposta exatamente invertida, dita pela própria marca.

       A causa não é a frase, é a arquitetura: UMA resposta serve MUITAS
       formulações, e "sim" só significa alguma coisa colado na pergunta que o
       autor tinha em mente. A regra que fica: a primeira frase de toda resposta
       carrega o próprio sujeito e se sustenta sozinha, lida debaixo de qualquer
       pergunta que a busca tenha roteado para ela.

       E as âncoras de mídia paga saíram daqui inteiras — foram para
       `midia-extra`, que é onde "preciso de tráfego pago" pertence. Esta
       pergunta é sobre a ORIGEM das views; aquela é sobre o que o cliente
       precisa gastar. As palavras que sobraram aqui são as da desconfiança:
       quem duvida não digita "orgânico", digita a acusação. */
    resposta: [
      'As visualizações contabilizadas nas metas da Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da nossa operação.',
      'Sem depender da compra de mídia para atingir as metas contratadas.',
    ],
    ancoras: [
      'organico',
      'organicas',
      'comprada',
      'compradas',
      'bot',
      'bots',
      'robo',
      'fake',
      'falsa',
      'falsas',
      'sao reais',
    ],
    termos: ['verdadeira', 'real', 'de verdade'],
  },
  {
    chave: 'prova',
    atalho: 'Quem já usou',
    pergunta: 'Quem já usou a plataforma?',
    resposta: [
      'A tecnologia e a operação da Doxa já foram utilizadas por mais de 1.500 clientes, incluindo empresas e marcas como Magalu, G4 e Natália Beauty.',
      'Além de operações no Brasil e nos Estados Unidos.',
    ],
    ancoras: [
      'quem usou',
      'quem ja usou',
      'quais empresas',
      'que empresas',
      'trabalharam com voces',
      'cliente',
      'clientes',
      'caso',
      'casos',
      'exemplo',
    ],
    termos: ['prova', 'resultado', 'funciona mesmo', 'confiavel', 'referencia'],
  },
  {
    chave: 'prazo',
    /* "Em quanto tempo" sozinho não é pergunta — o dono leu e perguntou "em
       quanto tempo o quê?". Era o único rótulo dos seis que dependia da pergunta
       inteira para significar alguma coisa: "A garantia", "Quem já usou" e "Para
       quem é" são incompletos mas se fecham na cabeça de quem lê; aquele ficava
       pendurado no ar.

       O botão continua abrindo a MESMA pergunta ("Em quanto tempo começo a ver
       resultados?"). O que mudou foi só a etiqueta dela. */
    atalho: 'Quando vejo resultado?',
    pergunta: 'Em quanto tempo começo a ver resultados?',
    resposta: [
      'Os primeiros resultados podem aparecer já nas primeiras semanas, mas nossa estratégia é construída para performance consistente ao longo de todo o período contratado.',
      'Quanto mais conteúdo é publicado, mais dados temos para identificar os formatos com maior potencial e escalar os resultados.',
    ],
    ancoras: [
      'quanto tempo',
      'prazo',
      'demora',
      'quando',
      'primeiras semanas',
      'resultados',
      'comeco a ver resultado',
      'ver resultado',
      'quando vejo',
      'quando vejo resultado',
    ],
    termos: ['rapido', 'comeca', 'inicio', 'primeiro video'],
  },
  {
    chave: 'para-quem',
    atalho: 'Para quem é',
    pergunta: 'Para quais empresas a Doxa é indicada?',
    resposta: [
      'A Doxa é indicada para empresas que querem transformar conteúdo em um canal previsível e escalável de crescimento.',
      'Trabalhamos especialmente com marcas que precisam ganhar relevância, aumentar audiência e ocupar espaço de forma consistente nas principais plataformas digitais.',
    ],
    ancoras: [
      'para quem',
      'que tipo de empresa',
      'serve para mim',
      'meu nicho',
      'nicho',
      'segmento',
      'indicada',
    ],
    termos: ['pequena', 'pequenas', 'grande', 'iniciante', 'atendem'],
  },

  /*
   * ─── AS DEZESSETE SEM ATALHO: o que o campo sabe e não mostra ───────────────
   *
   * Ditadas pelo dono, e nenhuma delas vira botão. Elas existem para o momento
   * em que a pessoa DIGITA — e é o momento que mais importa, porque quem digita
   * já tem uma objeção formada, enquanto quem toca num atalho ainda está
   * passeando.
   *
   * Todas obedecem a regra que a `organico` pagou caro para escrever: a primeira
   * frase carrega o próprio sujeito. "Sim" e "Não" sozinhos são respostas à
   * pergunta que o autor imaginou, não à que a busca roteou.
   *
   * Três das vinte que ele mandou não estão aqui, e é de propósito: "em quanto
   * tempo começo a ver resultado", "as views vêm de tráfego pago" e "quais
   * empresas já trabalharam com vocês" repetem as visíveis palavra por palavra.
   * O que entrou dessas três foram as ÂNCORAS, nas entradas de cima — duas
   * respostas quase iguais disputando a mesma pergunta é como uma busca começa a
   * devolver a errada.
   */
  {
    chave: 'preco',
    pergunta: 'Quanto custa para contratar a Doxa?',
    resposta: [
      'O investimento varia de acordo com o volume de conteúdo, a meta de visualizações e o tamanho da operação.',
      'A Doxa desenvolve uma estratégia personalizada para cada empresa e, depois de entendermos seus objetivos, nosso time apresenta o plano mais adequado.',
    ],
    ancoras: [
      'quanto custa',
      'preco',
      'valor',
      'mensalidade',
      'orcamento',
      'investimento',
      'quanto e',
      'quanto fica',
    ],
    termos: ['plano', 'pacote', 'contratar', 'caro', 'barato'],
  },
  {
    chave: 'nao-bater',
    pergunta: 'O que acontece se vocês não baterem a quantidade de views prometida?',
    resposta: [
      'A Doxa trabalha com metas de performance definidas em contrato. Caso a quantidade de visualizações acordada não seja atingida dentro do período estabelecido, são aplicadas as condições de garantia previstas no contrato.',
      'A garantia existe justamente para alinhar o nosso resultado ao resultado do cliente.',
    ],
    ancoras: [
      'nao bater',
      'nao baterem',
      'nao atingir',
      'nao alcancar',
      'nao entregar',
      'nao der certo',
      'e se nao',
    ],
    termos: ['falhar', 'furar', 'prometida'],
  },
  {
    chave: 'viralizar-garantido',
    pergunta: 'Vocês conseguem garantir que meu conteúdo vai viralizar?',
    resposta: [
      'Não garantimos que um vídeo específico vai viralizar. O que fazemos é construir uma operação com volume, dados e testes suficientes para aumentar significativamente as chances de alcançar grandes audiências.',
      'Nossa garantia está relacionada à performance total contratada, e não ao desempenho de um único conteúdo.',
    ],
    ancoras: [
      'garantir que vai viralizar',
      'vai viralizar',
      'viraliza mesmo',
      'garantem viralizacao',
      'todo video viraliza',
    ],
    termos: ['certeza', 'promete', 'prometem'],
  },
  {
    chave: 'midia-extra',
    pergunta: 'Preciso investir em mídia além do valor pago para a Doxa?',
    /* As âncoras de tráfego pago moram AQUI, e não em `organico`. Ver a nota
       lá em cima: "preciso de tráfego pago?" é uma pergunta sobre o que o
       cliente vai gastar, e mandá-la para a resposta sobre a origem das views
       foi o que produziu um "Sim." embaixo dela. */
    resposta: [
      'Para atingir as metas orgânicas contratadas com a Doxa, não é preciso investir em mídia. Nossa operação é desenvolvida para gerar distribuição sem depender de mídia paga.',
      'Se a empresa quiser complementar a estratégia com anúncios, isso pode ser feito separadamente.',
    ],
    ancoras: [
      'trafego pago',
      'midia paga',
      'preciso de trafego',
      'preciso investir',
      'preciso pagar',
      'alem do valor',
      'investir em midia',
      'gastar com anuncio',
      'verba',
    ],
    termos: ['anuncio', 'anuncios', 'impulsionamento', 'impulsionar', 'ads'],
  },
  {
    chave: 'pequenas',
    pergunta: 'A Doxa funciona para empresas pequenas também?',
    resposta: [
      'Empresas pequenas também podem trabalhar com a Doxa, desde que exista potencial para transformar conteúdo em um canal relevante de crescimento.',
      'O mais importante não é o tamanho da empresa, e sim os objetivos, o mercado, o produto e a capacidade de aproveitar a audiência gerada pela operação.',
    ],
    ancoras: [
      'empresa pequena',
      'empresas pequenas',
      'pequeno negocio',
      'sou pequeno',
      'sou pequena',
      'microempresa',
      'mei',
    ],
    termos: ['iniciante', 'comecando', 'pouco faturamento'],
  },
  {
    chave: 'b2b',
    pergunta: 'Minha empresa é B2B, a Doxa funciona para mim?',
    resposta: [
      'Empresas B2B também podem usar conteúdo para construir autoridade, gerar reconhecimento, educar o mercado e alcançar potenciais clientes.',
      'A estratégia, a linguagem e os formatos são adaptados ao público e ao processo comercial de cada negócio.',
    ],
    ancoras: ['b2b', 'business to business', 'vendo para empresas', 'industria', 'atacado'],
    termos: ['corporativo', 'servico para empresas'],
  },
  {
    chave: 'redes',
    pergunta: 'Em quais redes sociais vocês publicam os conteúdos?',
    resposta: [
      'A estratégia pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa.',
      'A distribuição é definida de acordo com o comportamento da audiência e os objetivos de cada operação.',
    ],
    ancoras: [
      'quais redes',
      'redes sociais',
      'tiktok',
      'instagram',
      'youtube',
      'shorts',
      'reels',
      'onde publica',
      'onde posta',
      'plataformas',
    ],
    termos: ['publicam', 'canais', 'rede'],
  },
  {
    chave: 'volume',
    pergunta: 'Quantos vídeos vocês produzem por mês?',
    resposta: [
      'O volume depende do plano contratado. A Doxa trabalha com operações de alta frequência, podendo produzir e publicar múltiplos conteúdos por dia.',
      'O volume exato é definido de acordo com a estratégia e a meta de performance de cada cliente.',
    ],
    ancoras: [
      'quantos videos',
      'quantos conteudos',
      'quantos posts',
      'por mes',
      'por dia',
      'volume',
      'frequencia',
    ],
    termos: ['producao', 'quantidade', 'quantos'],
  },
  {
    chave: 'gravar',
    pergunta: 'Eu preciso gravar os vídeos ou vocês fazem tudo?',
    resposta: [
      'A Doxa consegue assumir grande parte da operação de conteúdo. No onboarding entendemos quais materiais — imagens, vídeos, áudios ou participações — serão necessários.',
      'A necessidade de gravação do cliente varia conforme o formato escolhido para a marca.',
    ],
    ancoras: [
      'preciso gravar',
      'eu gravo',
      'quem grava',
      'aparecer no video',
      'mostrar o rosto',
      'gravacao',
      'nao gosto de aparecer',
    ],
    termos: ['camera', 'filmar', 'estudio', 'rosto'],
  },
  {
    chave: 'escala',
    pergunta: 'Como vocês conseguem produzir tanto conteúdo para uma empresa?',
    resposta: [
      'Usamos tecnologia, inteligência artificial, processos próprios e uma operação especializada em produção de conteúdo em escala.',
      'Isso permite criar, testar e otimizar diferentes formatos muito mais rápido do que uma operação tradicional de conteúdo.',
    ],
    ancoras: [
      'produzir tanto',
      'tanto conteudo',
      'inteligencia artificial',
      'ia',
      'como produzem',
      'em escala',
    ],
    termos: ['tecnologia', 'rapido', 'equipe', 'time'],
  },
  {
    chave: 'aprovacao',
    pergunta: 'Os vídeos precisam ser aprovados por mim antes de serem publicados?',
    resposta: [
      'Quando o fluxo do cliente exige aprovação, os conteúdos passam por etapas de validação antes da publicação.',
      'A empresa pode acompanhar temas, roteiros, versões e materiais para garantir que tudo esteja alinhado às diretrizes da marca.',
    ],
    ancoras: [
      'aprovar',
      'aprovacao',
      'aprovado',
      'aprovados',
      'antes de publicar',
      'antes de postar',
      'validar',
      'reviso',
    ],
    termos: ['publicacao', 'controle', 'aprovo'],
  },
  {
    chave: 'tom-de-voz',
    pergunta: 'A Doxa consegue seguir a identidade e o tom de voz da minha marca?',
    resposta: [
      'No início da operação, nosso time entende a identidade, o posicionamento, o público, a linguagem e as restrições da empresa.',
      'Essas informações passam a orientar a produção, para que o conteúdo mantenha consistência com a marca.',
    ],
    ancoras: [
      'tom de voz',
      'identidade',
      'identidade visual',
      'minha marca',
      'posicionamento',
      'branding',
      'manual da marca',
    ],
    termos: ['linguagem', 'estilo', 'cara da marca'],
  },
  {
    chave: 'direitos',
    pergunta: 'Quem é dono dos conteúdos produzidos pela Doxa?',
    resposta: [
      'Os conteúdos são desenvolvidos exclusivamente para a operação da marca.',
      'Os direitos de utilização, propriedade e demais condições são estabelecidos no contrato de cada cliente, de acordo com o escopo contratado.',
    ],
    ancoras: [
      'dono dos videos',
      'dono do conteudo',
      'direitos',
      'direito autoral',
      'propriedade',
      'quem e dono',
    ],
    termos: ['posse', 'meu ou de voces', 'autoral'],
  },
  {
    chave: 'reuso',
    pergunta: 'Posso usar os vídeos produzidos por vocês em outras redes ou campanhas?',
    resposta: [
      'Em geral sim: os conteúdos produzidos para a marca podem ser aproveitados em diferentes canais próprios, respeitando as condições estabelecidas no contrato.',
      'Um mesmo conteúdo também pode ser adaptado para diferentes plataformas e formatos.',
    ],
    ancoras: [
      'usar em outras redes',
      'outras campanhas',
      'reaproveitar',
      'posso usar',
      'reutilizar',
      'usar em anuncio',
    ],
    termos: ['campanha', 'aproveitar', 'republicar'],
  },
  {
    chave: 'processo',
    pergunta: 'Como funciona o processo depois que eu contrato?',
    resposta: [
      'O processo começa com um onboarding, para entendermos a empresa, os objetivos, o público, o posicionamento e as referências. Em seguida estruturamos a estratégia, iniciamos a produção, passamos pelas aprovações necessárias e começamos a publicar.',
      'A partir daí, os resultados são analisados continuamente para orientar os próximos conteúdos.',
    ],
    ancoras: [
      'depois que eu contrato',
      'depois de contratar',
      'onboarding',
      'como comeca',
      'primeiros passos',
      'passo a passo',
    ],
    termos: ['processo', 'etapas', 'inicio', 'comeco'],
  },
  {
    chave: 'acompanhar',
    pergunta: 'Eu consigo acompanhar quantas visualizações os conteúdos estão tendo?',
    resposta: [
      'A performance é acompanhada durante toda a operação: visualizações e outros indicadores relevantes são monitorados o tempo todo.',
      'Assim, tanto a Doxa quanto o cliente acompanham a evolução da estratégia e o progresso em relação às metas contratadas.',
    ],
    ancoras: [
      'acompanhar',
      'relatorio',
      'relatorios',
      'dashboard',
      'metricas',
      'ver os numeros',
      'como sei',
    ],
    termos: ['transparencia', 'monitorar', 'painel'],
  },
  {
    chave: 'primeiros-videos',
    pergunta: 'E se os primeiros vídeos não performarem bem?',
    resposta: [
      'Os primeiros conteúdos que performam abaixo do esperado fazem parte do processo: eles geram dados sobre audiência, temas, formatos, hooks e narrativas. A estratégia da Doxa não depende de acertar todos os vídeos.',
      'Quando identificamos padrões de maior performance, aumentamos a produção em torno do que funciona e descartamos rápido o que não funciona.',
    ],
    ancoras: [
      'primeiros videos',
      'nao performarem',
      'nao performar',
      'flopar',
      'nao viralizar no comeco',
      'comeco ruim',
    ],
    termos: ['ruim', 'fracasso', 'nao funcionar'],
  },
];

/**
 * As que viram BOTÃO. O resto responde, mas não aparece.
 *
 * Derivado e não escrito à mão: uma segunda lista com as seis repetidas seria
 * uma promessa de manter duas coisas em sincronia, e é exatamente o tipo de
 * promessa que este arquivo já quebrou uma vez.
 *
 * A ordem importa e ela é a de `DUVIDAS`: as seis com atalho vêm PRIMEIRO no
 * array, e é isso que faz o índice de uma dúvida em `DESTAQUES` ser o mesmo que
 * em `DUVIDAS`. As cores dos pontos do cabeçalho e a cor da resposta na conversa
 * saem desse índice — separadas, o ponto sairia âmbar e a bolha coral para a
 * mesma pergunta.
 */
const destacar = (lista: readonly Duvida[]) => lista.filter((d) => d.atalho != null);

/**
 * O que o campo responde quando não reconhece a pergunta.
 *
 * Dizer "não sei" é a feature, não a falha. Este campo responde do que a página
 * tem prova; o resto é conversa com gente, e mandar para lá é o objetivo da
 * página inteira. Um chat que improvisa para não parecer limitado é um chat que
 * inventa preço.
 */
const SEM_RESPOSTA_PT = {
  titulo: 'Essa eu não sei responder.',
  corpo: 'Quem responde é um consultor do time Doxa, e é rápido: deixa o contato aqui em cima que ele fala com você em até 24 horas.',
  /* O rótulo diz o destino, e não o objeto. "Ir para o formulário" descreve um
     campo de texto; quem está lendo isto quer saber com quem vai falar. O link
     continua sendo o mesmo formulário — a promessa é que ele leva a uma pessoa,
     que é o que a resposta acima acabou de dizer. */
  acao: 'Falar com o consultor',
};

/**
 * O que a coluna das respostas diz enquanto ainda não há resposta nenhuma.
 *
 * Ela nasce no CLIQUE do campo, não na primeira pergunta, e é isso que a torna
 * necessária: sem ela, clicar para escrever abriria metade da tela em branco, e
 * uma metade em branco lê como coisa quebrada. Dizendo o que vai acontecer ali,
 * o mesmo espaço vazio vira promessa — e a caixa crescendo do outro lado passa
 * a ter consequência visível, que é a razão de ela crescer.
 *
 * Nenhuma afirmação comercial aqui, e por isso este texto pode ser escrito e não
 * importado: ele fala do comportamento da tela, não do que a empresa entrega.
 */
const ESPERA_PT = {
  titulo: 'A resposta aparece aqui.',
  corpo: 'Escreva a pergunta ao lado, ou toque num assunto. Este lado da tela existe só para isso.',
};

const ABERTURA_PT = {
  /* "FAQ" e não "Perguntas": o título logo abaixo já pergunta, e um rótulo que
     repete o que o título faz é uma linha a menos de informação na tela. A sigla
     é o nome do objeto — quem chega sabe na hora o que esta seção é. */
  rotulo: 'FAQ',
  titulo: 'O que você quer saber?',
  /*
   * O CONVITE e o ATALHO, e são duas linhas porque são dois caminhos.
   *
   * O convite voltou a pedido do dono, e ele estava certo sobre o que faltava:
   * a seção tinha um campo de escrever e uma frase que só falava do que ele NÃO
   * faz. Ninguém digita numa caixa que se apresenta pelo teto.
   *
   * A segunda linha era o LIMITE ("Seis respostas estão aqui. A sétima é com o
   * consultor.") e o dono a trocou pelo atalho. As duas linhas agora são as
   * duas maneiras de usar o campo — escrever, ou tocar numa dúvida pronta —, e
   * quem não quer formular nada descobre que não precisa.
   *
   * O que se perdeu com a troca, e onde ele foi parar: o teto continua
   * verdadeiro, e não está mais escrito. Quem cobre a conta são duas coisas que
   * já existiam — o campo passa o tempo todo escrevendo sozinho as SEIS
   * perguntas que ele sabe responder, então o repertório se anuncia sem ser
   * declarado; e uma pergunta fora dele cai em `SEM_RESPOSTA`, que é o desvio
   * para o consultor. A promessa não ficou maior do que a entrega; ela ficou
   * implícita.
   *
   * Os atalhos moram DENTRO da caixa e só aparecem quando ela abre. A frase é,
   * portanto, o que revela que eles existem — sem ela, ninguém clica num campo
   * para descobrir uma gaveta.
   */
  dica: 'Pergunte o que quiser.',
  limite: 'Ou comece por uma das dúvidas que todo mundo tem.',
  exemplo: 'Escreva a sua pergunta…',
};

/**
 * ─── PENDENTE-DONO ───────────────────────────────────────────────────────────
 *
 * As perguntas que os visitantes VÃO fazer e que este arquivo ainda não pode
 * responder. Não são renderizadas: enquanto a resposta não vier do dono, quem
 * pergunta cai no consultor, que é o comportamento correto.
 *
 * Cada uma delas vira uma entrada de `DUVIDAS` no dia em que a resposta existir.
 * A ordem abaixo é a de quanto elas custam em conversão, da mais cara para a
 * mais barata:
 *
 *  1. Quanto custa a mensalidade, de verdade.
 *  2. POR QUE OS R$ 100, e o que eles são. Havia resposta escrita aqui e ela
 *     saiu com a troca das seis — não por falta de resposta, por escolha de
 *     quais seis aparecem. É a que mais custa da lista: a pessoa lê o preço no
 *     cartão do pedido, hesita, vem ao FAQ perguntar "por que cobrar cem reais",
 *     e hoje cai no "não sei responder" a um toque do botão de pagar. O texto
 *     existe em `FILTRO`, em `comparacao/config`.
 *  3. O que acontece DEPOIS de pagar. Mesma história: a resposta existe em
 *     `RETORNO` e não está mais aqui.
 *  4. Quantos vídeos por mês, e em quanto tempo o primeiro fica pronto.
 *  5. Tem fidelidade? Como cancela?
 *  6. A garantia por escrito: em quanto tempo, em quais plataformas, o que conta
 *     como view, e como o reembolso é pedido. A resposta nova fala em "condições
 *     previstas no contrato" — o que é mais prudente do que a manchete do topo,
 *     mas o contrato ainda não existe em lugar nenhum que a página possa citar.
 *  7. Formas de pagamento. Agora dá para responder: cartão, no checkout do
 *     Stripe, para onde o formulário leva.
 *  8. AGÊNCIA LICENCIADA. O primeiro passo do formulário abriu essa porta, e o
 *     FAQ não tem uma linha sobre ela — quem entra por ali e pergunta cai no
 *     "não sei responder".
 *  9. Preciso aparecer no vídeo? E se eu não quiser mostrar o rosto?
 * 10. De quem são os direitos do vídeo depois de pronto?
 */
export const PENDENTES: readonly string[] = [
  'Quanto custa a mensalidade?',
  'Por que os R$ 100? O que eles são?',
  'O que acontece depois que eu pago?',
  'Quantos vídeos por mês? Em quanto tempo sai o primeiro?',
  'Tem fidelidade? Como cancela?',
  'A garantia por escrito: prazo, plataformas, o que conta como view.',
  'Quais formas de pagamento?',
  'Como funciona ser uma agência licenciada?',
  'Preciso aparecer no vídeo?',
  'De quem são os direitos do vídeo?',
];

/*
 * ─── O MESMO FAQ, EM INGLÊS ──────────────────────────────────────────────────
 *
 * As `chave`s são IDÊNTICAS às do português de propósito: elas são o contrato
 * com a cor do ponto e da bolha (`DESTAQUES` deriva por índice) e com qualquer
 * código que roteie por chave. O que muda de idioma é o que a pessoa lê — e o
 * que ela DIGITA: `ancoras` e `termos` são o índice da busca, e quem pergunta
 * em inglês escreve "guarantee", não "garantia". Um FAQ traduzido sem o índice
 * traduzido é um FAQ que responde "não sei" para tudo.
 *
 * A regra das respostas atravessa a tradução intacta: cada uma é afirmação
 * comercial publicada, e a versão inglesa afirma EXATAMENTE o que a portuguesa
 * afirma — mesmos números, mesmas reservas ("as set out in the contract"),
 * nenhuma promessa nova. A primeira frase continua carregando o próprio
 * sujeito, pela mesma razão cara que a nota da `organico` conta.
 *
 * O espanhol aponta para o português até o card ES existir — o mesmo contrato
 * do `comparacao/config`.
 */
const DUVIDAS_EN: readonly Duvida[] = [
  {
    chave: 'garantia',
    atalho: 'The guarantee',
    pergunta: 'How does the guarantee work?',
    resposta: [
      'Doxa works with performance targets defined in the contract.',
      'Our operation is built to reach the agreed volume of views within the established period and, if the target is not met, the guarantee conditions set out in the contract apply.',
    ],
    ancoras: ['guarantee', 'guaranteed', 'money back', 'refund', 'million', 'target', 'contract'],
    termos: ['give back', 'does not work', 'what if'],
  },
  {
    chave: 'como-gera',
    atalho: 'How do you go viral?',
    pergunta: 'How does Doxa generate so many views?',
    resposta: [
      'We build a proprietary content operation based on volume, constant testing, data analysis and optimization.',
      'Instead of depending on a single viral video, we create a continuous system to increase the odds of distribution and growth.',
    ],
    ancoras: [
      'how do you go viral', 'how do you generate', 'how does it work', 'method', 'operation', 'system',
    ],
    termos: ['process', 'steps', 'strategy', 'secret', 'algorithm'],
  },
  {
    chave: 'organico',
    atalho: 'Is it organic?',
    pergunta: 'Are the views organic?',
    resposta: [
      'The views counted toward Doxa targets are 100% organic, coming from the distribution of the content produced inside our operation.',
      'No media buying is needed to reach the contracted targets.',
    ],
    ancoras: ['organic', 'bought', 'bot', 'bots', 'fake', 'are they real'],
    termos: ['real', 'genuine', 'actually real'],
  },
  {
    chave: 'prova',
    atalho: 'Who has used it',
    pergunta: 'Who has used the platform?',
    resposta: [
      'Doxa technology and operations have been used by more than 1,500 clients, including companies and brands such as Magalu, G4 and Natália Beauty.',
      'With operations in Brazil and in the United States.',
    ],
    ancoras: [
      'who used', 'who has used', 'which companies', 'worked with you', 'client', 'clients',
      'case', 'cases', 'example',
    ],
    termos: ['proof', 'results', 'does it really work', 'trustworthy', 'reference'],
  },
  {
    chave: 'prazo',
    atalho: 'When do I see results?',
    pergunta: 'How soon do I start seeing results?',
    resposta: [
      'The first results can show up within the first few weeks, but our strategy is built for consistent performance across the whole contracted period.',
      'The more content is published, the more data we have to identify the formats with the highest potential and scale the results.',
    ],
    ancoras: [
      'how long', 'timeline', 'takes', 'when', 'first weeks', 'results', 'start seeing results',
      'see results', 'when do i see',
    ],
    termos: ['fast', 'starts', 'beginning', 'first video'],
  },
  {
    chave: 'para-quem',
    atalho: 'Who it is for',
    pergunta: 'Which businesses is Doxa right for?',
    resposta: [
      'Doxa is built for businesses that want to turn content into a predictable, scalable growth channel.',
      'We work especially with brands that need to gain relevance, grow an audience and consistently claim space on the main digital platforms.',
    ],
    ancoras: ['who is it for', 'what kind of business', 'is it for me', 'my niche', 'niche', 'segment', 'right for'],
    termos: ['small', 'big', 'beginner', 'serve'],
  },
  {
    chave: 'preco',
    pergunta: 'How much does it cost to hire Doxa?',
    resposta: [
      'The investment varies with the volume of content, the views target and the size of the operation.',
      'Doxa builds a custom strategy for each business and, once we understand your goals, our team presents the plan that fits best.',
    ],
    ancoras: ['how much', 'price', 'cost', 'pricing', 'monthly fee', 'budget', 'investment'],
    termos: ['plan', 'package', 'hire', 'expensive', 'cheap'],
  },
  {
    chave: 'nao-bater',
    pergunta: 'What happens if you do not hit the promised view count?',
    resposta: [
      'Doxa works with performance targets defined in the contract. If the agreed volume of views is not reached within the established period, the guarantee conditions set out in the contract apply.',
      'The guarantee exists precisely to align our result with the client result.',
    ],
    ancoras: ['not hit', 'miss the target', 'do not reach', 'do not deliver', 'what if it fails'],
    termos: ['fail', 'fall short', 'promised'],
  },
  {
    chave: 'viralizar-garantido',
    pergunta: 'Can you guarantee my content will go viral?',
    resposta: [
      'We do not guarantee that a specific video will go viral. What we do is build an operation with enough volume, data and testing to significantly increase the odds of reaching large audiences.',
      'Our guarantee is tied to the total contracted performance, not to the performance of a single piece of content.',
    ],
    ancoras: ['guarantee it goes viral', 'will it go viral', 'every video viral'],
    termos: ['certainty', 'promise'],
  },
  {
    chave: 'midia-extra',
    pergunta: 'Do I need to invest in media on top of what I pay Doxa?',
    resposta: [
      'To reach the organic targets contracted with Doxa, no media spend is needed. Our operation is built to generate distribution without depending on paid media.',
      'If the business wants to complement the strategy with ads, that can be done separately.',
    ],
    ancoras: [
      'paid traffic', 'paid media', 'do i need ads', 'need to invest', 'need to pay',
      'on top of', 'media budget', 'spend on ads',
    ],
    termos: ['ad', 'ads', 'boost', 'boosting'],
  },
  {
    chave: 'pequenas',
    pergunta: 'Does Doxa work for small businesses too?',
    resposta: [
      'Small businesses can also work with Doxa, as long as there is potential to turn content into a relevant growth channel.',
      'What matters most is not the size of the business, but the goals, the market, the product and the ability to capture the audience the operation generates.',
    ],
    ancoras: ['small business', 'small businesses', 'i am small', 'micro business'],
    termos: ['beginner', 'starting out', 'low revenue'],
  },
  {
    chave: 'b2b',
    pergunta: 'My business is B2B — does Doxa work for me?',
    resposta: [
      'B2B businesses can also use content to build authority, generate awareness, educate the market and reach potential clients.',
      'The strategy, the language and the formats are adapted to the audience and the sales process of each business.',
    ],
    ancoras: ['b2b', 'business to business', 'sell to companies', 'industry', 'wholesale'],
    termos: ['corporate', 'services for companies'],
  },
  {
    chave: 'redes',
    pergunta: 'Which social networks do you publish on?',
    resposta: [
      'The strategy can involve TikTok, Instagram, YouTube and other networks relevant to the business audience.',
      'Distribution is defined by the audience behavior and the goals of each operation.',
    ],
    ancoras: [
      'which networks', 'social networks', 'tiktok', 'instagram', 'youtube', 'shorts', 'reels',
      'where do you post', 'platforms',
    ],
    termos: ['publish', 'channels', 'network'],
  },
  {
    chave: 'volume',
    pergunta: 'How many videos do you produce per month?',
    resposta: [
      'Volume depends on the contracted plan. Doxa runs high-frequency operations and can produce and publish multiple pieces of content per day.',
      'The exact volume is defined by the strategy and the performance target of each client.',
    ],
    ancoras: ['how many videos', 'how many posts', 'per month', 'per day', 'volume', 'frequency'],
    termos: ['production', 'quantity', 'how many'],
  },
  {
    chave: 'gravar',
    pergunta: 'Do I need to record the videos, or do you handle everything?',
    resposta: [
      'Doxa can take on most of the content operation. During onboarding we map which materials — images, videos, audio or appearances — will be needed.',
      'How much the client needs to record varies with the format chosen for the brand.',
    ],
    ancoras: [
      'do i record', 'who records', 'appear in the video', 'show my face', 'recording',
      'do not like being on camera',
    ],
    termos: ['camera', 'film', 'studio', 'face'],
  },
  {
    chave: 'escala',
    pergunta: 'How can you produce so much content for one business?',
    resposta: [
      'We use technology, artificial intelligence, proprietary processes and an operation specialized in content production at scale.',
      'That lets us create, test and optimize different formats much faster than a traditional content operation.',
    ],
    ancoras: ['produce so much', 'so much content', 'artificial intelligence', 'ai', 'how do you produce', 'at scale'],
    termos: ['technology', 'fast', 'team'],
  },
  {
    chave: 'aprovacao',
    pergunta: 'Do the videos need my approval before they are published?',
    resposta: [
      'When the client workflow requires approval, content goes through validation steps before publishing.',
      'The business can follow themes, scripts, versions and materials to make sure everything is aligned with the brand guidelines.',
    ],
    ancoras: ['approve', 'approval', 'approved', 'before publishing', 'before posting', 'validate', 'review'],
    termos: ['publishing', 'control'],
  },
  {
    chave: 'tom-de-voz',
    pergunta: 'Can Doxa follow my brand identity and tone of voice?',
    resposta: [
      'At the start of the operation, our team maps the identity, the positioning, the audience, the language and the restrictions of the business.',
      'That information then guides production, so the content stays consistent with the brand.',
    ],
    ancoras: ['tone of voice', 'identity', 'visual identity', 'my brand', 'positioning', 'branding', 'brand guidelines'],
    termos: ['language', 'style', 'brand look'],
  },
  {
    chave: 'direitos',
    pergunta: 'Who owns the content Doxa produces?',
    resposta: [
      'The content is developed exclusively for the brand operation.',
      'Usage rights, ownership and other conditions are established in each client contract, according to the contracted scope.',
    ],
    ancoras: ['who owns', 'content ownership', 'rights', 'copyright', 'ownership'],
    termos: ['possession', 'mine or yours'],
  },
  {
    chave: 'reuso',
    pergunta: 'Can I use the videos you produce on other networks or campaigns?',
    resposta: [
      'In general, yes: content produced for the brand can be used across its own channels, respecting the conditions established in the contract.',
      'The same piece of content can also be adapted to different platforms and formats.',
    ],
    ancoras: ['use on other networks', 'other campaigns', 'reuse', 'can i use', 'use in ads'],
    termos: ['campaign', 'repurpose', 'repost'],
  },
  {
    chave: 'processo',
    pergunta: 'How does the process work after I sign?',
    resposta: [
      'The process starts with onboarding, so we understand the business, the goals, the audience, the positioning and the references. Then we structure the strategy, start production, go through the necessary approvals and begin publishing.',
      'From there, results are analyzed continuously to guide the next pieces of content.',
    ],
    ancoras: ['after i sign', 'after hiring', 'onboarding', 'how does it start', 'first steps', 'step by step'],
    termos: ['process', 'stages', 'start', 'beginning'],
  },
  {
    chave: 'acompanhar',
    pergunta: 'Can I track how many views the content is getting?',
    resposta: [
      'Performance is tracked throughout the operation: views and other relevant indicators are monitored the whole time.',
      'That way both Doxa and the client follow the evolution of the strategy and the progress toward the contracted targets.',
    ],
    ancoras: ['track', 'report', 'reports', 'dashboard', 'metrics', 'see the numbers', 'how do i know'],
    termos: ['transparency', 'monitor', 'panel'],
  },
  {
    chave: 'primeiros-videos',
    pergunta: 'What if the first videos do not perform well?',
    resposta: [
      'Early content that performs below expectations is part of the process: it generates data about audience, themes, formats, hooks and narratives. The Doxa strategy does not depend on getting every video right.',
      'When we identify higher-performance patterns, we scale production around what works and quickly discard what does not.',
    ],
    ancoras: ['first videos', 'do not perform', 'flop', 'bad start', 'not go viral at first'],
    termos: ['bad', 'failure', 'not work'],
  },
];

const SEM_RESPOSTA_EN = {
  titulo: "That one I can't answer.",
  corpo:
    "A consultant from the Doxa team can, and it's quick: leave your contact up above and they'll talk to you within 24 hours.",
  acao: 'Talk to the consultant',
};

const ESPERA_EN = {
  titulo: 'The answer shows up here.',
  corpo:
    'Type the question on the other side, or tap a topic. This half of the screen exists just for that.',
};

const ABERTURA_EN = {
  rotulo: 'FAQ',
  titulo: 'What do you want to know?',
  dica: 'Ask anything.',
  limite: 'Or start with one of the questions everyone asks.',
  exemplo: 'Type your question…',
};

/* ─── OS PARES EXPORTADOS ───────────────────────────────────────────────────── */

export const DUVIDAS: PorIdioma<readonly Duvida[]> = {
  pt: DUVIDAS_PT, en: DUVIDAS_EN, es: DUVIDAS_PT,
};
export const DESTAQUES: PorIdioma<readonly Duvida[]> = {
  pt: destacar(DUVIDAS_PT), en: destacar(DUVIDAS_EN), es: destacar(DUVIDAS_PT),
};
export const SEM_RESPOSTA: PorIdioma<typeof SEM_RESPOSTA_PT> = {
  pt: SEM_RESPOSTA_PT, en: SEM_RESPOSTA_EN, es: SEM_RESPOSTA_PT,
};
export const ESPERA: PorIdioma<typeof ESPERA_PT> = { pt: ESPERA_PT, en: ESPERA_EN, es: ESPERA_PT };
export const ABERTURA: PorIdioma<typeof ABERTURA_PT> = {
  pt: ABERTURA_PT, en: ABERTURA_EN, es: ABERTURA_PT,
};
