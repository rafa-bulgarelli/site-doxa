/**
 * ─── A DERIVAÇÃO DA ÁREA DA EQUIPE ───────────────────────────────────────────
 *
 * De uma lista de convites e do que a pessoa escolheu na tela, tudo que o
 * painel desenha: contadores, lista filtrada, página. Função PURA, sem React e
 * sem DOM — é o que permite provar a regra por teste em vez de por clique.
 *
 * ─── EXPIRADO NÃO É UM STATUS DO BANCO ───────────────────────────────────────
 *
 * O banco guarda 'pendente', 'aberto', 'concluido' e 'revogado', e mais nada:
 * "expirado" é a comparação de `expira_em` com o relógio, feita AQUI, toda vez
 * que a tela desenha (a razão está no `manual.sql` — um job para marcar
 * expirados seria uma peça a mais para falhar, e o relógio não falha). Por isso
 * `agora` entra por parâmetro: teste de tempo com `Date.now()` escondido dentro
 * da função é teste que passa hoje e quebra amanhã.
 */
import { simplificar } from '../../leads/filtrar';
import type { ConviteLinha, PedidoConviteCriar, StatusDoConvite } from '../tipos';

/** O que a lista mostra na coluna de status — o do banco mais o derivado. */
export type Situacao = StatusDoConvite | 'expirado';

export type OrdemDeConvite = 'recentes' | 'antigos' | 'empresa';

export interface EscolhasDeConvite {
  busca: string;
  /** 'todos' = sem filtro. */
  situacao: Situacao | 'todos';
  /** 'todas' = sem filtro. */
  versaoId: string;
  ordem: OrdemDeConvite;
  pagina: number;
  porPagina: number;
}

export const SITUACOES: readonly Situacao[] = [
  'pendente',
  'aberto',
  'concluido',
  'revogado',
  'expirado',
];

export const ROTULO_DA_SITUACAO: Record<Situacao, string> = {
  pendente: 'Pendente',
  aberto: 'Aberto',
  concluido: 'Concluído',
  revogado: 'Revogado',
  expirado: 'Expirado',
};

/**
 * A situação de um convite AGORA.
 *
 * Concluído e revogado vencem o relógio: um convite que já foi aceito não vira
 * "expirado" porque a data passou — o aceite aconteceu, e é o que vale.
 */
export function situacaoDo(convite: ConviteLinha, agora: number): Situacao {
  switch (convite.status) {
    case 'concluido':
    case 'revogado':
      return convite.status;
    case 'pendente':
    case 'aberto': {
      const vence = convite.expira_em == null ? null : new Date(convite.expira_em).getTime();
      return vence != null && vence < agora ? 'expirado' : convite.status;
    }
    default:
      // O banco tem `check` no status; um valor novo aqui é esquema à frente
      // do código, e mostrar o que veio é melhor do que mentir "pendente".
      return convite.status;
  }
}

/** Onde a busca procura. O que o CX teria na ponta da língua. */
function palheiro(convite: ConviteLinha): string {
  return simplificar([convite.empresa, convite.email, convite.nome_cliente ?? ''].join(' '));
}

export interface ContagemDeSituacoes extends Record<Situacao, number> {
  total: number;
}

export function contarSituacoes(
  convites: readonly ConviteLinha[],
  agora: number,
): ContagemDeSituacoes {
  const contagem: ContagemDeSituacoes = {
    total: convites.length,
    pendente: 0,
    aberto: 0,
    concluido: 0,
    revogado: 0,
    expirado: 0,
  };
  for (const convite of convites) contagem[situacaoDo(convite, agora)] += 1;
  return contagem;
}

export interface VisaoDeConvites {
  contagem: ContagemDeSituacoes;
  filtrados: ConviteLinha[];
  daPagina: ConviteLinha[];
  pagina: number;
  paginas: number;
}

export function derivarConvites(
  convites: readonly ConviteLinha[],
  escolhas: EscolhasDeConvite,
  agora: number,
): VisaoDeConvites {
  const { busca, situacao, versaoId, ordem, pagina, porPagina } = escolhas;
  const alvo = simplificar(busca);

  const filtrados = convites
    .filter((c) => (situacao === 'todos' ? true : situacaoDo(c, agora) === situacao))
    .filter((c) => (versaoId === 'todas' ? true : c.versao_id === versaoId))
    .filter((c) => (alvo.length === 0 ? true : palheiro(c).includes(alvo)))
    .sort((a, b) => {
      if (ordem === 'empresa') return a.empresa.localeCompare(b.empresa, 'pt-BR');
      const ta = new Date(a.criado_em).getTime();
      const tb = new Date(b.criado_em).getTime();
      return ordem === 'antigos' ? ta - tb : tb - ta;
    });

  const paginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  // A página é limitada aqui e não no estado: quem apagou a busca depois de
  // estar na página nove precisa ver alguma coisa, não uma lista vazia.
  const atual = Math.min(Math.max(1, pagina), paginas);

  return {
    contagem: contarSituacoes(convites, agora),
    filtrados,
    daPagina: filtrados.slice((atual - 1) * porPagina, atual * porPagina),
    pagina: atual,
    paginas,
  };
}

/* ─── O FORMULÁRIO DO CONVITE ──────────────────────────────────────────────── */

export interface RascunhoDeConvite {
  email: string;
  empresa: string;
  /** Vazio = o cliente informa o próprio nome no fluxo. */
  nomeCliente: string;
  /** `YYYY-MM-DD` do campo de data, ou vazio para convite sem prazo. */
  expiraEm: string;
}

export const CONVITE_EM_BRANCO: RascunhoDeConvite = {
  email: '',
  empresa: '',
  nomeCliente: '',
  expiraEm: '',
};

/*
 * O MESMO formato que o `check` do banco cobra em `manual_convites.email`.
 * Repetido aqui de propósito: a validação do navegador existe para avisar
 * ANTES do envio; quem decide continua sendo o banco.
 */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

/** Os problemas do formulário, por campo. Objeto vazio = pode enviar. */
export function validarConvite(
  rascunho: RascunhoDeConvite,
  agora: number,
): Partial<Record<keyof RascunhoDeConvite, string>> {
  const problemas: Partial<Record<keyof RascunhoDeConvite, string>> = {};
  if (!EMAIL.test(rascunho.email.trim())) problemas.email = 'Um e-mail de verdade, por favor.';
  const empresa = rascunho.empresa.trim();
  if (empresa.length < 2 || empresa.length > 160) {
    problemas.empresa = 'O nome da empresa tem de 2 a 160 letras.';
  }
  const nome = rascunho.nomeCliente.trim();
  if (nome.length > 0 && (nome.length < 2 || nome.length > 160)) {
    problemas.nomeCliente = 'O nome tem de 2 a 160 letras — ou deixe em branco.';
  }
  if (rascunho.expiraEm.length > 0) {
    const prazo = new Date(`${rascunho.expiraEm}T23:59:59`).getTime();
    if (Number.isNaN(prazo)) problemas.expiraEm = 'Data inválida.';
    else if (prazo < agora) problemas.expiraEm = 'Um convite que já nasce vencido não abre.';
  }
  return problemas;
}

/**
 * O pedido que vai para a API.
 *
 * O prazo vira o FIM do dia escolhido: quem digita "31/08" quer o convite
 * valendo o dia 31 inteiro, e a meia-noite o mataria vinte e quatro horas antes
 * do que a pessoa leu na tela.
 */
export function pedidoDeCriacao(rascunho: RascunhoDeConvite): PedidoConviteCriar {
  const pedido: PedidoConviteCriar = {
    acao: 'convite_criar',
    email: rascunho.email.trim(),
    empresa: rascunho.empresa.trim(),
  };
  const nome = rascunho.nomeCliente.trim();
  if (nome.length > 0) pedido.nome_cliente = nome;
  if (rascunho.expiraEm.length > 0) {
    pedido.expira_em = new Date(`${rascunho.expiraEm}T23:59:59`).toISOString();
  }
  return pedido;
}
