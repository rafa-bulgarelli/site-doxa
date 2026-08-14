/**
 * ─── A MÁQUINA DO FLUXO ──────────────────────────────────────────────────────
 *
 * Tudo que decide ALGUMA COISA no caminho do cliente mora aqui, e nada aqui
 * conhece React, DOM ou `fetch`. É de propósito: o gate que impede avançar com
 * uma regra obrigatória por marcar é a única linha do fluxo que, se errar,
 * grava um aceite falso no banco — e uma coisa dessas se prova com teste, não
 * com clique.
 *
 * As duas invariantes que os testes protegem:
 *  1. só avança de seção quem marcou TODAS as `obrigatoria` daquela seção;
 *  2. o pedido de conclusão nunca sai sem declaração confirmada, sem nome e
 *     sem o manual inteiro marcado.
 */
import type {
  AceiteResumo,
  ConviteAberto,
  EstadoDoConvite,
  PedidoConcluir,
  PedidoProgresso,
  Progresso,
  Regra,
  RespostaAbrir,
  Secao,
  Versao,
} from '../tipos';
import type { FalhaDaApi, Resultado } from './api';

/**
 * Onde o cliente está. A ordem é a do dono: abertura → identificação → seções
 * → revisão. A conclusão não é passo daqui — ela é OUTRA rota (`/concluido`),
 * porque depois do aceite não existe "voltar".
 */
export type Passo =
  | { tipo: 'abertura' }
  | { tipo: 'identificacao' }
  | { tipo: 'secao'; indice: number }
  | { tipo: 'revisao' };

/** Um nome com duas letras já é um nome; um espaço em branco não é. */
export const MINIMO_DO_NOME = 2;

/* ─── LEITURA DA VERSÃO ────────────────────────────────────────────────────── */

/**
 * As seções na ordem do manual.
 *
 * A API entrega ordenado, mas ordenar de novo custa nada e tira do fluxo a
 * dependência de um `order by` que mora em outro repositório de decisões — se
 * um dia a query mudar, o cliente não lê o manual embaralhado.
 */
export function secoesEmOrdem(versao: Versao): Secao[] {
  return [...versao.secoes].sort((uma, outra) => uma.ordem - outra.ordem);
}

export function regrasEmOrdem(secao: Secao): Regra[] {
  return [...secao.regras].sort((uma, outra) => uma.ordem - outra.ordem);
}

/** As regras com checkbox. As outras são texto informativo e não travam nada. */
export function obrigatoriasDa(secao: Secao): Regra[] {
  return regrasEmOrdem(secao).filter((regra) => regra.obrigatoria);
}

export function obrigatoriasDaVersao(versao: Versao): Regra[] {
  return secoesEmOrdem(versao).flatMap(obrigatoriasDa);
}

/** O que ainda falta marcar NESTA seção, na ordem em que aparece na tela. */
export function faltamNa(secao: Secao, marcadas: readonly string[]): Regra[] {
  return obrigatoriasDa(secao).filter((regra) => !marcadas.includes(regra.id));
}

/** O gate. Sem isto o aceite pode nascer incompleto — é a linha mais cara daqui. */
export function podeAvancarDa(secao: Secao, marcadas: readonly string[]): boolean {
  return faltamNa(secao, marcadas).length === 0;
}

/** O que falta no manual INTEIRO — o que a revisão final cobra. */
export function faltamNaVersao(versao: Versao, marcadas: readonly string[]): Regra[] {
  return obrigatoriasDaVersao(versao).filter((regra) => !marcadas.includes(regra.id));
}

export interface Andamento {
  feitas: number;
  total: number;
  /** 0 a 1. Vale 1 quando a versão não tem nenhuma regra obrigatória. */
  fracao: number;
}

export function andamentoDe(versao: Versao, marcadas: readonly string[]): Andamento {
  const total = obrigatoriasDaVersao(versao).length;
  const feitas = total - faltamNaVersao(versao, marcadas).length;
  return { feitas, total, fracao: total === 0 ? 1 : feitas / total };
}

/* ─── RETOMADA (o servidor é a memória entre visitas) ──────────────────────── */

/**
 * As marcações que sobrevivem à retomada.
 *
 * Filtra pelo que existe NESTA versão: id de regra que não está mais no manual
 * é lixo de uma versão anterior, e mandá-lo de volta no aceite sujaria a prova.
 */
export function marcadasDeRetomada(versao: Versao, progresso?: Progresso): string[] {
  if (progresso == null) return [];
  const existem = new Set(secoesEmOrdem(versao).flatMap((secao) => secao.regras.map((r) => r.id)));
  return progresso.regras_marcadas.filter((id) => existem.has(id));
}

/**
 * Onde reabrir.
 *
 * `secao_ordem` é o campo `ordem` da seção, NÃO o índice do array — o schema
 * só garante `ordem >= 0`, e casar por índice quebraria em silêncio se a
 * numeração começasse em 1. Ordem que não bate com seção nenhuma (o `default 0`
 * de quem nunca começou, por exemplo) devolve a abertura.
 */
export function passoDeRetomada(versao: Versao, progresso?: Progresso): Passo {
  if (progresso == null) return { tipo: 'abertura' };
  const indice = secoesEmOrdem(versao).findIndex((secao) => secao.ordem === progresso.secao_ordem);
  if (indice < 0) return { tipo: 'abertura' };
  return { tipo: 'secao', indice };
}

/** O nome que o campo mostra ao reabrir: o do convite manda, o digitado guarda. */
export function nomeDeRetomada(convite: ConviteAberto, progresso?: Progresso): string {
  return convite.nome_cliente ?? progresso?.nome_informado ?? '';
}

/* ─── NAVEGAÇÃO ────────────────────────────────────────────────────────────── */

export function proximoPasso(passo: Passo, versao: Versao): Passo {
  const secoes = secoesEmOrdem(versao);
  switch (passo.tipo) {
    case 'abertura':
      return { tipo: 'identificacao' };
    case 'identificacao':
      return secoes.length === 0 ? { tipo: 'revisao' } : { tipo: 'secao', indice: 0 };
    case 'secao':
      return passo.indice + 1 < secoes.length
        ? { tipo: 'secao', indice: passo.indice + 1 }
        : { tipo: 'revisao' };
    case 'revisao':
      // Depois da revisão vem o aceite, e quem o dispara é o `Fluxo` — não há
      // passo seguinte para onde caminhar sozinho.
      return passo;
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** Voltar é SEMPRE permitido: reler não é risco, é o que se quer que aconteça. */
export function passoAnterior(passo: Passo, versao: Versao): Passo {
  const secoes = secoesEmOrdem(versao);
  switch (passo.tipo) {
    case 'abertura':
      return passo;
    case 'identificacao':
      return { tipo: 'abertura' };
    case 'secao':
      return passo.indice === 0 ? { tipo: 'identificacao' } : { tipo: 'secao', indice: passo.indice - 1 };
    case 'revisao':
      return secoes.length === 0 ? { tipo: 'identificacao' } : { tipo: 'secao', indice: secoes.length - 1 };
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** A seção do passo, ou `undefined` nos passos que não são seção. */
export function secaoDoPasso(passo: Passo, versao: Versao): Secao | undefined {
  if (passo.tipo !== 'secao') return undefined;
  return secoesEmOrdem(versao)[passo.indice];
}

/* ─── OS PEDIDOS ───────────────────────────────────────────────────────────── */

/**
 * Que `secao_ordem` gravar para este passo.
 *
 * A revisão grava a ÚLTIMA seção, não um número próprio: quem reabre o link
 * cai na última seção e chega à declaração de novo por vontade própria.
 * Declaração pré-confirmada por retomada não seria aceite, seria acidente.
 */
export function ordemDoPasso(passo: Passo, versao: Versao): number {
  const secoes = secoesEmOrdem(versao);
  if (secoes.length === 0) return 0;
  switch (passo.tipo) {
    case 'abertura':
    case 'identificacao':
      return 0;
    case 'secao': {
      const secao = secoes[passo.indice];
      return secao == null ? 0 : secao.ordem;
    }
    case 'revisao':
      return secoes[secoes.length - 1].ordem;
    default:
      throw new Error(`passo desconhecido: ${JSON.stringify(passo)}`);
  }
}

/** As marcações na ordem canônica do manual, sem id estranho e sem repetição. */
export function marcadasCanonicas(versao: Versao, marcadas: readonly string[]): string[] {
  const escolhidas = new Set(marcadas);
  return secoesEmOrdem(versao)
    .flatMap(regrasEmOrdem)
    .filter((regra) => escolhidas.has(regra.id))
    .map((regra) => regra.id);
}

export interface EstadoDoAceite {
  versao: Versao;
  convite: ConviteAberto;
  marcadas: readonly string[];
  /** O que o cliente digitou. Ignorado quando o convite já traz o nome. */
  nomeInformado: string;
  declaracaoConfirmada: boolean;
}

/** `true` quando o convite não trouxe nome e o cliente precisa se identificar. */
export function precisaDeNome(convite: ConviteAberto): boolean {
  return convite.nome_cliente == null;
}

export function nomeValido(nome: string): boolean {
  return nome.trim().length >= MINIMO_DO_NOME;
}

/** O nome que vai para o aceite: o do convite manda; senão, o digitado, limpo. */
export function nomeParaAceite(convite: ConviteAberto, nomeInformado: string): string {
  return convite.nome_cliente ?? nomeInformado.trim();
}

export function montarPedidoProgresso(
  token: string,
  passo: Passo,
  estado: Pick<EstadoDoAceite, 'versao' | 'convite' | 'marcadas' | 'nomeInformado'>,
): PedidoProgresso {
  const pedido: PedidoProgresso = {
    acao: 'progresso',
    token,
    secao_ordem: ordemDoPasso(passo, estado.versao),
    regras_marcadas: marcadasCanonicas(estado.versao, estado.marcadas),
  };
  // O nome só viaja quando é o cliente quem o informa: mandar de volta o nome
  // que o CX digitou daria ao navegador do cliente uma caneta sobre um dado
  // que não é dele.
  const nome = estado.nomeInformado.trim();
  if (precisaDeNome(estado.convite) && nome.length > 0) pedido.nome_informado = nome;
  return pedido;
}

/** O que ainda impede o aceite. Vazio = pode concluir. Vira texto na revisão. */
export function impedimentosDoAceite(estado: EstadoDoAceite): string[] {
  const impedimentos: string[] = [];
  const faltam = faltamNaVersao(estado.versao, estado.marcadas);
  if (faltam.length > 0) {
    impedimentos.push(
      faltam.length === 1
        ? 'Falta marcar 1 regra do manual.'
        : `Faltam marcar ${faltam.length} regras do manual.`,
    );
  }
  if (precisaDeNome(estado.convite) && !nomeValido(estado.nomeInformado)) {
    impedimentos.push('Falta informar seu nome completo.');
  }
  if (!estado.declaracaoConfirmada) {
    impedimentos.push('Falta confirmar a declaração final.');
  }
  return impedimentos;
}

export function podeConcluir(estado: EstadoDoAceite): boolean {
  return impedimentosDoAceite(estado).length === 0;
}

/**
 * Monta o pedido de conclusão — e recusa montar o que não pode ser aceito.
 *
 * O gate está DUAS vezes no caminho (o botão desabilitado e este `throw`) de
 * propósito: o botão é aparência e some num refactor de UI; isto aqui é a
 * última porta antes de uma linha imutável no banco.
 */
export function montarPedidoConcluir(token: string, estado: EstadoDoAceite): PedidoConcluir {
  const impedimentos = impedimentosDoAceite(estado);
  if (impedimentos.length > 0) {
    throw new Error(`conclusão bloqueada: ${impedimentos.join(' ')}`);
  }
  const pedido: PedidoConcluir = {
    acao: 'concluir',
    token,
    regras_marcadas: marcadasCanonicas(estado.versao, estado.marcadas),
    declaracao_confirmada: true,
  };
  if (precisaDeNome(estado.convite)) pedido.nome = estado.nomeInformado.trim();
  return pedido;
}

/* ─── MARCAR E DESMARCAR ───────────────────────────────────────────────────── */

/** Alterna uma regra sem duplicar id — a lista é o que vira prova no aceite. */
export function alternarRegra(marcadas: readonly string[], id: string): string[] {
  return marcadas.includes(id) ? marcadas.filter((outro) => outro !== id) : [...marcadas, id];
}

/* ─── O QUE A TELA MOSTRA DEPOIS DE ABRIR O LINK ───────────────────────────── */

/** Tudo que o fluxo carrega enquanto o cliente lê. */
export interface Sessao {
  convite: ConviteAberto;
  versao: Versao;
  passo: Passo;
  marcadas: string[];
  nome: string;
  declaracaoConfirmada: boolean;
}

/**
 * A resposta do `abrir` traduzida em UMA tela.
 *
 * Existe como tipo puro — sem React — porque é aqui que se decide se o cliente
 * vê o manual, um recado de link morto ou o comprovante que ele voltou buscar.
 * Essa decisão é testável, e um `if` perdido dentro de JSX não é.
 */
export type Situacao =
  | { tipo: 'falha'; falha: FalhaDaApi }
  | { tipo: 'bloqueado'; estado: Exclude<EstadoDoConvite, 'valido' | 'concluido'> }
  | { tipo: 'concluido'; aceite?: AceiteResumo }
  | { tipo: 'fluxo'; sessao: Sessao };

const CONTRATO_QUEBRADO =
  'O convite abriu, mas veio sem o manual. Isso é um problema nosso, não seu.';

function sessaoDe(resposta: RespostaAbrir): Situacao {
  const { convite, versao, progresso } = resposta;
  if (convite == null || versao == null) {
    // Servidor respondeu 'valido' sem o conteúdo: não dá para ler manual
    // nenhum, e insistir repetiria a mesma resposta.
    return { tipo: 'falha', falha: { mensagem: CONTRATO_QUEBRADO, recuperavel: false } };
  }
  return {
    tipo: 'fluxo',
    sessao: {
      convite,
      versao,
      passo: passoDeRetomada(versao, progresso),
      marcadas: marcadasDeRetomada(versao, progresso),
      nome: nomeDeRetomada(convite, progresso),
      // Nunca retomada: confirmar a declaração é ato do cliente NESTA visita.
      declaracaoConfirmada: false,
    },
  };
}

export function situacaoDe(resultado: Resultado<RespostaAbrir>): Situacao {
  if (!resultado.ok) return { tipo: 'falha', falha: resultado.falha };
  switch (resultado.dados.estado) {
    case 'valido':
      return sessaoDe(resultado.dados);
    case 'concluido':
      return { tipo: 'concluido', aceite: resultado.dados.aceite };
    case 'invalido':
    case 'expirado':
    case 'revogado':
      return { tipo: 'bloqueado', estado: resultado.dados.estado };
    default:
      // Estado que não está no contrato veio da rede, não do nosso código: o
      // link não serve, e tratar como inválido é a resposta honesta.
      return { tipo: 'bloqueado', estado: 'invalido' };
  }
}

/** O recorte da sessão que a máquina do aceite entende. */
export function aceiteDaSessao(sessao: Sessao): EstadoDoAceite {
  return {
    versao: sessao.versao,
    convite: sessao.convite,
    marcadas: sessao.marcadas,
    nomeInformado: sessao.nome,
    declaracaoConfirmada: sessao.declaracaoConfirmada,
  };
}

/** Identidade do passo em texto: serve de `key` no React e de comparação aqui. */
export function chaveDoPasso(passo: Passo): string {
  return passo.tipo === 'secao' ? `secao-${passo.indice}` : passo.tipo;
}
