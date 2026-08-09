/**
 * ─── O CONTRATO DO LEAD ──────────────────────────────────────────────────────
 *
 * Um lead é o que o formulário do painel claro entrega, e nada além disso. Este
 * arquivo é a fronteira entre a página e o painel: a página escreve, o painel
 * lê, e os dois só concordam porque olham para o mesmo tipo.
 *
 * As chaves em `snake_case` são deliberadas — é o nome da coluna no Postgres, e
 * traduzir de um lado para o outro seria uma tabela de-para a mais para
 * esquecer de atualizar. O preço é uma convenção estranha ao resto do repo, e
 * ele é menor do que o de dois vocabulários para a mesma coisa.
 */

/** As duas portas do primeiro passo. Decide a leitura do lead inteiro. */
export type Caminho = 'empresa' | 'agencia';

/**
 * O que a ficha opcional respondeu.
 *
 * Tudo é anulável porque tudo é pulável: a ficha é pedida DEPOIS de o contato
 * já ter chegado, e quem sai antes continua sendo um lead legítimo — com menos
 * informação, e o score dele diz isso.
 *
 * `trava` é lista porque a pergunta aceita várias marcações. As outras são uma
 * escolha só, mas cabem texto livre quando a pessoa escolheu "Outro".
 */
export interface Ficha {
  segmento: string | null;
  faturamento: string | null;
  trava: string[] | null;
}

/** O lead como ele sai do formulário — sem id, sem data, sem score. */
export interface LeadNovo extends Ficha {
  caminho: Caminho;
  nome: string;
  whatsapp: string;
  email: string | null;
  /**
   * Quanto a pessoa consegue investir por mês, por faixa.
   *
   * É a pergunta de CORTE, e a única do formulário que pode encerrá-lo: quem
   * marca a primeira faixa recebe um agradecimento e a conversa não continua.
   * Ver `INVESTIMENTO` em `comparacao/config.ts`.
   */
  investimento: string | null;
  /**
   * Se o corte pegou este lead.
   *
   * Ele é gravado assim mesmo, e de propósito: saber QUANTOS chegaram abaixo da
   * faixa mínima é a diferença entre "a página atrai a pessoa errada" e "a
   * página atrai pouca gente", e as duas se consertam de formas opostas. O
   * painel esconde estes por padrão — eles não são fila de trabalho, são
   * medida de tráfego.
   */
  desqualificado: boolean;
  /** Sempre com `@` na frente, ou `null` quando a pessoa declarou não ter. */
  arroba: string | null;
  /**
   * De onde ele veio. Hoje só existe uma origem, e o campo existe assim mesmo:
   * no dia em que houver uma campanha paga ou um segundo formulário, quem já
   * está no banco continua identificável.
   */
  origem: string;
}

/** O lead como ele volta do banco. */
export interface Lead extends LeadNovo {
  id: string;
  criado_em: string;
  /**
   * Se ele já saiu num CSV. É o que separa as duas abas do painel, e é um
   * estado do LEAD e não da exportação: baixar duas vezes não desmarca, e um
   * lead novo nunca nasce baixado.
   */
  baixado: boolean;
  /** Quando foi baixado, para a coluna do painel poder dizer "há 2 dias". */
  baixado_em: string | null;
}

/** O molde vazio, para o formulário começar de algum lugar. */
export const LEAD_VAZIO: Ficha = {
  segmento: null,
  faturamento: null,
  trava: null,
};
