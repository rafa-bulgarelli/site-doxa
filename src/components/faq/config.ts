
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
  /** O rótulo do atalho. Curto: é um botão, não uma frase. */
  atalho: string;
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

export const DUVIDAS: readonly Duvida[] = [
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
    atalho: 'Como vocês geram',
    pergunta: 'Como a Doxa gera tantas visualizações?',
    resposta: [
      'Construímos uma operação proprietária de conteúdo baseada em volume, testes constantes, análise de dados e otimização.',
      'Em vez de depender de um único vídeo viral, criamos um sistema contínuo para aumentar as chances de distribuição e crescimento.',
    ],
    ancoras: ['como voces geram', 'como geram', 'como funciona', 'metodo', 'operacao', 'sistema'],
    termos: ['processo', 'etapas', 'estrategia', 'segredo', 'algoritmo'],
  },
  {
    chave: 'organico',
    atalho: 'É orgânico?',
    pergunta: 'As visualizações são orgânicas?',
    resposta: [
      'Sim. As visualizações geradas pela Doxa são 100% orgânicas, provenientes da distribuição dos conteúdos produzidos dentro da nossa operação.',
      'Sem depender da compra de mídia para atingir as metas contratadas.',
    ],
    /* `bot`, `robo` e `comprada` são âncoras de propósito, e são a razão de esta
       pergunta existir: quem desconfia não digita "orgânico", digita a acusação.
       A resposta tem de estar do outro lado da palavra que a pessoa realmente
       escreve. */
    ancoras: [
      'organico',
      'organicas',
      'trafego pago',
      'midia paga',
      'comprada',
      'compradas',
      'bot',
      'bots',
      'robo',
      'fake',
      'falsa',
      'falsas',
    ],
    termos: ['anuncio', 'anuncios', 'impulsionamento', 'verdadeira', 'real'],
  },
  {
    chave: 'prova',
    atalho: 'Quem já usou',
    pergunta: 'Quem já usou a plataforma?',
    resposta: [
      'A tecnologia e a operação da Doxa já foram utilizadas por mais de 1.500 clientes, incluindo empresas e marcas como Magalu, G4 e Natália Beauty.',
      'Além de operações no Brasil e nos Estados Unidos.',
    ],
    ancoras: ['quem usou', 'quem ja usou', 'cliente', 'clientes', 'caso', 'casos', 'exemplo'],
    termos: ['prova', 'resultado', 'funciona mesmo', 'confiavel', 'referencia'],
  },
  {
    chave: 'prazo',
    atalho: 'Em quanto tempo',
    pergunta: 'Em quanto tempo começo a ver resultados?',
    resposta: [
      'Os primeiros resultados podem aparecer já nas primeiras semanas, mas nossa estratégia é construída para performance consistente ao longo de todo o período contratado.',
      'Quanto mais conteúdo é publicado, mais dados temos para identificar os formatos com maior potencial e escalar os resultados.',
    ],
    ancoras: ['quanto tempo', 'prazo', 'demora', 'quando', 'primeiras semanas', 'resultados'],
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
];

/**
 * O que o campo responde quando não reconhece a pergunta.
 *
 * Dizer "não sei" é a feature, não a falha. Este campo responde do que a página
 * tem prova; o resto é conversa com gente, e mandar para lá é o objetivo da
 * página inteira. Um chat que improvisa para não parecer limitado é um chat que
 * inventa preço.
 */
export const SEM_RESPOSTA = {
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
export const ESPERA = {
  titulo: 'A resposta aparece aqui.',
  corpo: 'Escreva a pergunta ao lado, ou toque num assunto. Este lado da tela existe só para isso.',
};

export const ABERTURA = {
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
