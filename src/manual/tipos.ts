/**
 * ─── O CONTRATO DO MANUAL ────────────────────────────────────────────────────
 *
 * A fronteira entre as três pontas do sistema: o fluxo público do cliente, a
 * área da equipe e a API em `api/manual/*`. As três só concordam porque olham
 * para os tipos daqui.
 *
 * As chaves em `snake_case` são deliberadas, pela mesma razão do contrato de
 * leads: é o nome da coluna no Postgres (`supabase/manual.sql`), e traduzir de
 * um lado para o outro seria uma tabela de-para a mais para esquecer de
 * atualizar.
 *
 * Este arquivo NÃO pode importar nada de DOM nem de React: ele compila também
 * no projeto da API (`tsconfig.api.json`), que roda na borda da Vercel.
 */

/* ─── O CONTEÚDO DO MANUAL ─────────────────────────────────────────────────── */

/** 'critica' = descumprir pode invalidar a garantia; a UI e o PDF destacam. */
export type Severidade = 'normal' | 'critica';

/** Uma regra: a unidade do aceite. O checkbox do cliente marca isto. */
export interface Regra {
  id: string;
  codigo: string;
  titulo: string;
  /** A regra em linguagem clara — o que fazer ou não fazer. */
  instrucao: string;
  /** Por que ela existe. Nunca vazio numa regra de verdade: regra sem porquê assusta em vez de ensinar. */
  porque: string;
  /** Como agir certo, concreto. */
  exemplo: string;
  severidade: Severidade;
  /** `false` = texto informativo, sem checkbox. */
  obrigatoria: boolean;
  ordem: number;
}

export interface Secao {
  id: string;
  slug: string;
  titulo: string;
  /** O parágrafo de abertura — o contexto antes da primeira regra. */
  descricao: string;
  ordem: number;
  regras: Regra[];
}

/** Uma versão inteira do manual, como a API a entrega montada. */
export interface Versao {
  id: string;
  numero: number;
  titulo: string;
  /** O texto da declaração final que o cliente confirma. Versionado junto: mudar a declaração É mudar o manual. */
  declaracao: string;
  secoes: Secao[];
}

/* ─── O FLUXO PÚBLICO (api/manual/publico) ─────────────────────────────────── */

/**
 * O que o link aberto revelou. 'valido' segue para o manual; cada um dos outros
 * tem a própria tela, porque "não deu" sem explicação vira ligação para o CX.
 */
export type EstadoDoConvite = 'valido' | 'invalido' | 'expirado' | 'revogado' | 'concluido';

/** O que o cliente vê preenchido e NÃO consegue trocar. */
export interface ConviteAberto {
  email: string;
  empresa: string;
  /** Preenchido pelo CX quando já se sabe quem assina; `null` = o cliente informa o próprio nome. */
  nome_cliente: string | null;
  expira_em: string | null;
}

/** Onde o cliente parou — para retomar pelo mesmo link. NUNCA é aceite. */
export interface Progresso {
  secao_ordem: number;
  regras_marcadas: string[];
  nome_informado: string | null;
}

/** O resumo de um aceite já feito, para a tela de "já concluído". */
export interface AceiteResumo {
  aceite_id: string;
  aceito_em: string;
  conteudo_sha256: string;
  versao_numero: number;
}

export interface PedidoAbrir {
  acao: 'abrir';
  token: string;
}

export interface PedidoProgresso {
  acao: 'progresso';
  token: string;
  secao_ordem: number;
  regras_marcadas: string[];
  nome_informado?: string;
}

export interface PedidoConcluir {
  acao: 'concluir';
  token: string;
  /** Só quando o convite não trazia `nome_cliente`. */
  nome?: string;
  regras_marcadas: string[];
  declaracao_confirmada: boolean;
}

/** Pede uma URL assinada nova para o PDF de um convite já concluído. */
export interface PedidoBaixar {
  acao: 'baixar';
  token: string;
}

/** Tudo POST, token sempre no CORPO: URL vai para log de servidor, corpo não. */
export type PedidoPublico = PedidoAbrir | PedidoProgresso | PedidoConcluir | PedidoBaixar;

export interface RespostaAbrir {
  estado: EstadoDoConvite;
  /** Presentes quando `estado` é 'valido' (e `aceite` quando 'concluido'). */
  convite?: ConviteAberto;
  versao?: Versao;
  progresso?: Progresso;
  aceite?: AceiteResumo;
}

export interface RespostaConcluir {
  aceite_id: string;
  aceito_em: string;
  conteudo_sha256: string;
  /**
   * URL assinada, de minutos. `null` quando a geração do PDF falhou DEPOIS do
   * aceite gravado — o aceite vale, e o botão de baixar regenera na hora.
   */
  pdf_url: string | null;
  pdf_sha256: string | null;
}

export interface RespostaBaixar {
  pdf_url: string;
}

/* ─── A ÁREA DA EQUIPE (api/manual/admin) ──────────────────────────────────── */

/** 'admin' publica versão; 'cx' cria, revoga e regenera convite. */
export type Papel = 'admin' | 'cx';

export interface PedidoConviteCriar {
  acao: 'convite_criar';
  email: string;
  empresa: string;
  nome_cliente?: string;
  expira_em?: string;
}

export interface PedidoConviteRevogar {
  acao: 'convite_revogar';
  convite_id: string;
}

/** Revoga o antigo e cria outro para o mesmo cliente, apontando a origem. */
export interface PedidoConviteRegenerar {
  acao: 'convite_regenerar';
  convite_id: string;
}

export interface PedidoPdfBaixar {
  acao: 'pdf_baixar';
  aceite_id: string;
}

export interface PedidoVersaoRascunho {
  acao: 'versao_rascunho';
  origem_id: string;
}

export interface PedidoVersaoPublicar {
  acao: 'versao_publicar';
  versao_id: string;
}

/** Sempre com `Authorization: Bearer <token da sessão do time>`. */
export type PedidoAdmin =
  | PedidoConviteCriar
  | PedidoConviteRevogar
  | PedidoConviteRegenerar
  | PedidoPdfBaixar
  | PedidoVersaoRascunho
  | PedidoVersaoPublicar;

export interface RespostaConviteCriado {
  convite_id: string;
  /**
   * O link completo, com o token dentro — a ÚNICA vez que ele existe fora do
   * navegador do cliente. O banco guarda só o hash; fechou a resposta, acabou.
   */
  link: string;
}

export interface RespostaPdf {
  pdf_url: string;
}

export interface RespostaVersao {
  versao_id: string;
  numero: number;
}

/* ─── AS LINHAS DO BANCO (a área admin lê o PostgREST direto, como a Central) ── */

export type StatusDoConvite = 'pendente' | 'aberto' | 'concluido' | 'revogado';
export type StatusDaVersao = 'rascunho' | 'publicada' | 'arquivada';

export interface ConviteLinha {
  id: string;
  email: string;
  empresa: string;
  nome_cliente: string | null;
  versao_id: string;
  status: StatusDoConvite;
  expira_em: string | null;
  criado_em: string;
  aberto_em: string | null;
  concluido_em: string | null;
  revogado_em: string | null;
  regenerado_de: string | null;
}

export interface VersaoLinha {
  id: string;
  numero: number;
  titulo: string;
  declaracao: string;
  status: StatusDaVersao;
  hash_conteudo: string | null;
  criado_em: string;
  publicado_em: string | null;
}

export interface SecaoLinha {
  id: string;
  versao_id: string;
  slug: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface RegraLinha {
  id: string;
  secao_id: string;
  codigo: string;
  titulo: string;
  instrucao: string;
  porque: string;
  exemplo: string;
  severidade: Severidade;
  obrigatoria: boolean;
  ordem: number;
}

export interface AceiteLinha {
  id: string;
  convite_id: string;
  versao_id: string;
  nome: string;
  empresa: string;
  email: string;
  declaracao: string;
  aceito_em: string;
  ip: string | null;
  user_agent: string | null;
  conteudo_sha256: string;
  pdf_caminho: string | null;
  pdf_sha256: string | null;
}

export interface AceiteItemLinha {
  id: string;
  aceite_id: string;
  regra_id: string;
  codigo: string;
  titulo: string;
  instrucao: string;
  porque: string;
  exemplo: string;
  severidade: Severidade;
  aceito_em: string;
}

export interface EventoLinha {
  id: string;
  convite_id: string | null;
  ator: 'cliente' | 'equipe' | 'sistema';
  ator_id: string | null;
  tipo: string;
  detalhes: Record<string, unknown>;
  criado_em: string;
}

/* ─── O QUE ATRAVESSA TUDO ─────────────────────────────────────────────────── */

/** O corpo de toda resposta de erro da API. O motivo de verdade fica no log. */
export interface RespostaErro {
  erro: string;
}

/** O que o roteador entrega a cada área: o caminho já fatiado e o navegar. */
export interface PropsDeRota {
  segmentos: string[];
  navegar: (destino: string) => void;
}
