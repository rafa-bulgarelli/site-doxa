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
  fit: 'O segmento e o objetivo batem com o que a Doxa faz.',
  dor: 'O tamanho e o tipo do que trava a empresa hoje.',
  verba: 'A faixa de faturamento declarada.',
  escala: 'Quanto a operação tem para crescer com vídeo.',
  intencao: 'Quanto da ficha a pessoa se deu ao trabalho de responder.',
  presenca: 'Se existe perfil para a gente olhar antes da conversa.',
  autoridade: 'Se há rosto para aparecer — e quem é ele no mercado.',
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
  'R$ 1.000 a R$ 1.500': 3,
  'R$ 1.500 a R$ 2.000': 4,
  'R$ 2.000 a R$ 2.500': 5,
  'R$ 2.500 a R$ 3.000': 6,
  'R$ 3.000 a R$ 4.000': 8,
  'R$ 4.000 a R$ 5.000': 9,
  'Mais de R$ 5.000': 10,
};

/** Faixa de faturamento → quanto de verba e de escala ela indica. */
const FATURAMENTO: Record<string, { verba: number; escala: number }> = {
  'Até R$ 20 mil': { verba: 3, escala: 4 },
  'R$ 20 a 50 mil': { verba: 6, escala: 6 },
  'R$ 50 a 200 mil': { verba: 8, escala: 8 },
  'Mais de R$ 200 mil': { verba: 10, escala: 10 },
  // Não é zero: recusar a faixa é comum em quem fatura bem e não é sinal ruim.
  // É a ausência do dado, e a ausência vale a média da tabela.
  'Prefiro não dizer': { verba: 5, escala: 5 },
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

/** Objetivo → fit e escala. Vender e lançar são as duas de maior escala. */
const OBJETIVO: Record<string, { fit: number; escala: number }> = {
  'Vender mais': { fit: 9, escala: 9 },
  'Autoridade no meu nicho': { fit: 8, escala: 6 },
  'Lançar algo novo': { fit: 8, escala: 9 },
  'Atrair gente boa para a equipe': { fit: 6, escala: 5 },
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

/** Aparecer → autoridade e presença. */
const APARECE: Record<string, { autoridade: number; presenca: number }> = {
  Apareço: { autoridade: 10, presenca: 8 },
  'Tanto faz': { autoridade: 6, presenca: 6 },
  // Não aparecer NÃO derruba o lead: a Doxa tem caminho para isso, e a própria
  // pergunta diz isso na dica. O que cai é a autoridade de rosto, não o lead.
  'Prefiro não aparecer': { autoridade: 3, presenca: 5 },
};

/** Quantas respostas da ficha existem — o denominador da intenção. */
const CAMPOS_DA_FICHA = 5;

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
  if (ficha.objetivo) n++;
  if (ficha.trava && ficha.trava.length > 0) n++;
  if (ficha.aparece) n++;
  return n;
}

/** Os sete eixos de um lead, cada um de 0 a 10. */
export function eixosDo(lead: LeadNovo): Record<Eixo, number> {
  const seg = lead.segmento ? SEGMENTO[lead.segmento] : undefined;
  const obj = lead.objetivo ? OBJETIVO[lead.objetivo] : undefined;
  const fat = lead.faturamento ? FATURAMENTO[lead.faturamento] : undefined;
  const apa = lead.aparece ? APARECE[lead.aparece] : undefined;
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

  return {
    fit: limita(((seg?.fit ?? 0) + (obj?.fit ?? 0)) / (seg && obj ? 2 : seg || obj ? 1 : 1)),
    dor: limita(dor),
    verba: limita(verba ?? 0),
    escala: limita(((fat?.escala ?? 0) + (obj?.escala ?? 0)) / (fat && obj ? 2 : fat || obj ? 1 : 1)),
    intencao: limita(intencao),
    presenca: limita(lead.arroba ? 6 + (apa?.presenca ?? 4) / 2 : 0),
    autoridade: limita(((seg?.autoridade ?? 0) + (apa?.autoridade ?? 0)) / (seg && apa ? 2 : seg || apa ? 1 : 1)),
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
