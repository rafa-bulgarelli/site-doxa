/**
 * ─── A RÉGUA DO LEAD ─────────────────────────────────────────────────────────
 *
 * Sete eixos de zero a dez, lidos das respostas da ficha. É a mesma leitura que
 * o consultor faria olhando a ficha na mão — escrita, para ela ser igual para
 * todo lead e para poder ser discutida.
 *
 * ATENÇÃO ao que isto NÃO é: não há modelo, não há dado externo, não há nada
 * adivinhado sobre a pessoa. Cada ponto sai de uma resposta que ela mesma deu.
 * Um lead que pulou a ficha inteira tem os eixos da ficha em zero, e isso é
 * honesto — não sabemos, então não pontuamos.
 *
 * PENDENTE-DONO: os pesos e as tabelas abaixo são a minha leitura do negócio,
 * não a dele. Estão todos num lugar só, em português, para ele mexer olhando
 * para os leads reais depois da primeira semana. Nenhum número aqui é sagrado.
 */
import type { Ficha, LeadNovo } from './tipos';

/** Os sete eixos, na ordem em que o painel os desenha. */
export const EIXOS = [
  'fit',
  'dor',
  'verba',
  'escala',
  'intencao',
  'presenca',
  'autoridade',
] as const;

export type Eixo = (typeof EIXOS)[number];

/** O rótulo de cada eixo na tela. Curto porque o radar tem pouco espaço. */
export const ROTULO: Record<Eixo, string> = {
  fit: 'FIT',
  dor: 'DOR',
  verba: 'VERBA',
  escala: 'ESCALA',
  intencao: 'INTENÇÃO',
  presenca: 'PRESENÇA',
  autoridade: 'AUTORIDADE',
};

/**
 * O que cada eixo lê, em uma linha — para o painel poder explicar o número em
 * vez de só exibi-lo. Um score que ninguém sabe de onde veio não é usado.
 */
export const EXPLICACAO: Record<Eixo, string> = {
  fit: 'O quanto o nicho vive de vídeo curto.',
  dor: 'O tamanho e o tipo do que trava a empresa hoje.',
  verba: 'O budget mensal declarado — o faturamento entra só se ele faltar.',
  escala: 'O tamanho da operação, pela faixa de faturamento.',
  intencao: 'Quanto a pessoa se deu ao trabalho de responder e de se identificar.',
  presenca: 'Se existe um perfil para o consultor abrir antes de ligar.',
  autoridade: 'O quanto o nicho depende de um rosto conhecido.',
};

/**
 * O peso de cada eixo no total.
 *
 * Somam 100 de propósito: assim o total já sai em pontos e ninguém precisa
 * normalizar nada. VERBA e DOR pesam mais porque são as duas perguntas que
 * separam quem contrata de quem só quer saber o preço.
 */
const PESO: Record<Eixo, number> = {
  fit: 15,
  dor: 20,
  verba: 20,
  escala: 12,
  intencao: 13,
  presenca: 10,
  autoridade: 10,
};

/**
 * Faixa de INVESTIMENTO → verba. É o sinal mais forte que a ficha tem.
 *
 * Faturamento diz o tamanho da empresa; investimento diz o tamanho do que ela
 * está disposta a gastar NISTO. São coisas diferentes, e a segunda é a que
 * decide a conversa — por isso ela manda no eixo e o faturamento só entra
 * quando ela falta.
 *
 * A primeira faixa não é zero por piedade: ela nem chega ao painel como fila
 * de trabalho. O zero está aqui para o caso de alguém mexer no corte e passar
 * a deixar essa gente entrar — o score continua dizendo a verdade sozinho.
 */
const INVESTIMENTO: Record<string, number> = {
  'Abaixo de R$ 1.000': 0,
  'R$ 1.000 a R$ 2.000': 4,
  'R$ 2.000 a R$ 4.000': 7,
  'R$ 4.000 a R$ 5.000': 9,
  'Mais de R$ 5.000': 10,
};

/** Faixa de faturamento → quanto de verba e de escala ela indica. */
const FATURAMENTO: Record<string, { verba: number; escala: number }> = {
  'Até R$ 50 mil': { verba: 4, escala: 3 },
  'R$ 50 a 200 mil': { verba: 6, escala: 5 },
  'R$ 200 a 500 mil': { verba: 8, escala: 7 },
  'R$ 500 mil a R$ 1 milhão': { verba: 9, escala: 8 },
  'R$ 1 a 3 milhões': { verba: 10, escala: 9 },
  'R$ 3 a 5 milhões': { verba: 10, escala: 10 },
  'Mais de R$ 5 milhões': { verba: 10, escala: 10 },
};

/**
 * Segmento → fit e autoridade.
 *
 * `fit` é o quanto o segmento vive de vídeo curto; `autoridade` é o quanto ele
 * depende de um rosto conhecido. Advocacia e saúde pontuam alto nos dois: são
 * mercados em que a pessoa É a marca.
 */
const SEGMENTO: Record<string, { fit: number; autoridade: number }> = {
  Advocacia: { fit: 9, autoridade: 9 },
  'Saúde e estética': { fit: 10, autoridade: 8 },
  Imóveis: { fit: 9, autoridade: 7 },
  'Educação e cursos': { fit: 10, autoridade: 9 },
  Alimentação: { fit: 8, autoridade: 5 },
  'Varejo e e-commerce': { fit: 8, autoridade: 4 },
  'Serviços para empresas': { fit: 7, autoridade: 7 },
};

/**
 * Trava → dor.
 *
 * "Já paguei agência e não deu certo" é a mais alta da tabela, e não por
 * acaso: é a única que descreve dinheiro já gasto no problema. Quem gastou e
 * se frustrou tem a dor medida em reais.
 */
const TRAVA: Record<string, number> = {
  'Já paguei agência e não deu certo': 10,
  'Não tenho tempo': 7,
  'Não tenho equipe': 7,
  'Não sei o que falar': 6,
  'Não gosto de aparecer': 5,
};

/** Quantas respostas da ficha existem — o denominador da intenção. */
const CAMPOS_DA_FICHA = 3;

const limita = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

/**
 * Quantas das cinco perguntas da ficha foram respondidas.
 *
 * `trava` conta pela existência da lista e não pelo tamanho dela: marcar três
 * travas não é mais intenção do que marcar uma, é mais dor — e dor tem eixo
 * próprio.
 */
function respondidas(ficha: Ficha): number {
  let n = 0;
  if (ficha.segmento) n++;
  if (ficha.faturamento) n++;
  if (ficha.trava && ficha.trava.length > 0) n++;
  return n;
}

/** Os sete eixos de um lead, cada um de 0 a 10. */
export function eixosDo(lead: LeadNovo): Record<Eixo, number> {
  const seg = lead.segmento ? SEGMENTO[lead.segmento] : undefined;
  const fat = lead.faturamento ? FATURAMENTO[lead.faturamento] : undefined;
  const travas = lead.trava ?? [];

  /*
   * A dor é a MAIOR trava marcada, mais um ponto por trava extra.
   *
   * Média seria errado: quem marca "já paguei agência" e "não tenho tempo" não
   * tem uma dor média entre as duas, tem a maior das duas — e um pouco mais,
   * porque são dois problemas ao mesmo tempo.
   */
  const maiorTrava = travas.reduce((maior, t) => Math.max(maior, TRAVA[t] ?? 5), 0);
  const dor = travas.length === 0 ? 0 : maiorTrava + (travas.length - 1);

  /*
   * A intenção soma três coisas que a pessoa fez, e não que ela é: quanto da
   * ficha respondeu, se deixou um perfil e se deixou e-mail. É o único eixo que
   * mede ESFORÇO, e por isso é o que melhor prevê quem atende o telefone.
   */
  const intencao =
    (respondidas(lead) / CAMPOS_DA_FICHA) * 7 + (lead.arroba ? 2 : 0) + (lead.email ? 1 : 0);

  /*
   * A verba é o investimento declarado; o faturamento é o plano B.
   *
   * O investimento é passo obrigatório e o faturamento é ficha opcional, então
   * na prática a primeira linha quase sempre ganha. A segunda existe para o
   * lead que veio de outra origem um dia — um formulário de campanha, uma
   * importação — sem a pergunta do corte.
   */
  const verba = lead.investimento != null ? INVESTIMENTO[lead.investimento] : (fat?.verba ?? 0);

  /*
   * ─── COM DUAS PERGUNTAS A MENOS, TRÊS EIXOS TROCARAM DE FONTE ──────────────
   *
   * Saíram "o que você quer que os vídeos façam?" e "você aparece nos vídeos?".
   * Elas alimentavam metade de FIT, metade de ESCALA, metade de AUTORIDADE e a
   * segunda metade de PRESENÇA. Em vez de deixar os quatro pela metade — o que
   * derrubaria o score de todo lead sem que nada tivesse piorado —, cada um
   * passou a ser lido inteiro pela fonte que sobrou.
   *
   * PRESENÇA virou binária, e é honesto que seja: sem a pergunta do rosto, o
   * que a ficha sabe sobre presença digital é se existe um perfil para o
   * consultor abrir antes da conversa. Existe ou não existe.
   */
  return {
    fit: limita(seg?.fit ?? 0),
    dor: limita(dor),
    verba: limita(verba ?? 0),
    escala: limita(fat?.escala ?? 0),
    intencao: limita(intencao),
    presenca: limita(lead.arroba ? 9 : 0),
    autoridade: limita(seg?.autoridade ?? 0),
  };
}

/** O total em pontos, de 0 a 100. */
export function pontosDe(eixos: Record<Eixo, number>): number {
  return Math.round(EIXOS.reduce((soma, e) => soma + (eixos[e] / 10) * PESO[e], 0));
}

/**
 * As estrelas, de 1 a 5.
 *
 * Nunca zero: um lead na lista já é alguém que preencheu um formulário inteiro,
 * e nenhuma estrela lê como "ignore este", que não é o que a régua quer dizer.
 * O que ela diz é por onde começar.
 */
export function estrelasDe(pontos: number): number {
  return Math.max(1, Math.min(5, Math.ceil(pontos / 20)));
}

/** Tudo de uma vez, que é como o painel consome. */
export function scoreDo(lead: LeadNovo) {
  const eixos = eixosDo(lead);
  const pontos = pontosDe(eixos);
  return { eixos, pontos, estrelas: estrelasDe(pontos) };
}
