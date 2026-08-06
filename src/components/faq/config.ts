import { FILTRO, GARANTIA, RETORNO, TROCA_DEPOIS } from '../comparacao/config';

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
 * Importar de `comparacao/config` em vez de reescrever é a mesma disciplina que
 * aquele arquivo já cobra de si: a garantia mudou de lugar uma vez e o comentário
 * dela pede que as duas cópias mudem no mesmo commit. Uma cópia que o compilador
 * mantém é melhor do que duas que um humano promete manter.
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
  {
    chave: 'como-funciona',
    atalho: 'Como funciona',
    pergunta: 'O que eu preciso fazer?',
    resposta: [
      `${TROCA_DEPOIS} Você manda os dois, e o vídeo volta pronto para publicar.`,
      'O resto — roteiro, edição, trilha, legenda — é o que a Doxa põe no lugar das vinte e cinco contratações que a conta aqui em cima lista.',
    ],
    ancoras: ['preciso fazer', 'gravar', 'gravacao', 'foto e audio', 'passo a passo'],
    termos: ['como funciona', 'processo', 'etapas'],
  },
  {
    chave: 'filtro',
    atalho: 'Os R$ 100',
    pergunta: 'Por que cobrar R$ 100 só para conversar?',
    resposta: [
      `${FILTRO.corpo}`,
      'Não é mensalidade, não é sinal e não é o preço do serviço. É a catraca da agenda do consultor.',
    ],
    ancoras: ['100', 'cem reais', 'filtro', 'simbolico', 'simbolicos'],
    termos: ['cobrar', 'cobram', 'taxa'],
  },
  {
    chave: 'preco',
    atalho: 'O preço',
    pergunta: 'Quanto custa o serviço?',
    resposta: [
      'Esse número não está nesta página. Quem passa é o consultor, na conversa.',
      `Se você chegou aqui pelos ${FILTRO.valor} do filtro: aqueles cem reais não são a mensalidade.`,
    ],
    ancoras: ['preco', 'custa', 'custo', 'valor', 'mensalidade', 'orcamento', 'investimento'],
    termos: ['plano', 'pacote'],
  },
  {
    chave: 'depois-do-pagamento',
    atalho: 'Depois que eu pago',
    pergunta: 'O que acontece depois que eu pago?',
    resposta: [RETORNO, 'No WhatsApp que você deixar no formulário — não por e-mail, não por ligação.'],
    ancoras: ['whatsapp', 'consultor', 'retorno', 'entra em contato', 'depois que eu pago'],
    termos: ['depois', 'contato', 'responde', 'resposta'],
  },
  {
    chave: 'garantia',
    atalho: 'A garantia',
    pergunta: 'Como funciona a garantia?',
    resposta: [
      `${GARANTIA[0]} ${GARANTIA[1]} É o que está escrito no topo desta página, e é para valer.`,
      'Os termos — prazo, plataformas, o que entra na contagem — quem detalha é o consultor, antes de você contratar qualquer coisa.',
    ],
    ancoras: ['garantia', 'garantido', 'dinheiro de volta', 'reembolso', 'milhao', 'views', 'viralizar', 'viraliza'],
    termos: ['devolve', 'devolucao'],
  },
  {
    chave: 'prova',
    atalho: 'Quem já usou',
    pergunta: 'Vocês têm caso real?',
    resposta: [
      'Tem, e está nesta página: os posts da parede de prova são de clientes, com os números que eles fizeram.',
      'Os perfis aparecem com arroba de propósito — dá para abrir e conferir por fora.',
    ],
    ancoras: ['caso', 'casos', 'cliente', 'clientes', 'resultado', 'resultados', 'prova', 'portfolio', 'depoimento'],
    termos: ['exemplo', 'ja usou', 'funcionou'],
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
  corpo: 'Quem responde é o consultor, e é rápido: deixa o contato aqui em cima que ele fala com você em até 24 horas.',
  /* O rótulo diz o destino, e não o objeto. "Ir para o formulário" descreve um
     campo de texto; quem está lendo isto quer saber com quem vai falar. O link
     continua sendo o mesmo formulário — a promessa é que ele leva a uma pessoa,
     que é o que a resposta acima acabou de dizer. */
  acao: 'Falar com o consultor',
};

export const ABERTURA = {
  /* "FAQ" e não "Perguntas": o título logo abaixo já pergunta, e um rótulo que
     repete o que o título faz é uma linha a menos de informação na tela. A sigla
     é o nome do objeto — quem chega sabe na hora o que esta seção é. */
  rotulo: 'FAQ',
  titulo: 'O que você quer saber?',
  /*
   * A dica não é mais um convite, é um limite — e o limite é que vende.
   *
   * "Pergunte o que quiser" prometia um chat que responde tudo, e este campo
   * responde seis coisas. Dizer o número na cara faz três trabalhos de uma vez:
   * cumpre o que a seção pode cumprir, transforma os atalhos em um percurso com
   * fim visível, e nomeia a saída — a pergunta que não está aqui é a razão de
   * falar com alguém, que é o que a página inteira existe para conseguir.
   *
   * O "Seis" acompanha `DUVIDAS` logo acima: a sétima resposta escrita torna
   * esta frase falsa, e ela muda no mesmo commit.
   */
  dica: 'Seis respostas. A sétima é com o consultor.',
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
 *  2. Quantos vídeos por mês, e em quanto tempo o primeiro fica pronto.
 *  3. Tem fidelidade? Como cancela?
 *  4. A garantia por escrito: em quanto tempo, em quais plataformas, o que conta
 *     como view, e como o reembolso é pedido. É a promessa mais cara da página e
 *     hoje ela só existe como manchete.
 *  5. Formas de pagamento — só depois que o checkout estiver ligado de verdade.
 *     `PAGAMENTOS` existe em `comparacao/config`, mas o próprio comentário de lá
 *     diz que a lista foi escrita antes de a coisa existir.
 *  6. Preciso aparecer no vídeo? E se eu não quiser mostrar o rosto?
 *  7. Vocês atendem qual tipo de empresa? Tem nicho que não dá certo?
 *  8. De quem são os direitos do vídeo depois de pronto?
 */
export const PENDENTES: readonly string[] = [
  'Quanto custa a mensalidade?',
  'Quantos vídeos por mês? Em quanto tempo sai o primeiro?',
  'Tem fidelidade? Como cancela?',
  'A garantia por escrito: prazo, plataformas, o que conta como view.',
  'Quais formas de pagamento?',
  'Preciso aparecer no vídeo?',
  'Vocês atendem que tipo de empresa?',
  'De quem são os direitos do vídeo?',
];
