/**
 * ─── AS REGRAS DO CONTEÚDO ───────────────────────────────────────────────────
 *
 * As contas do editor de rascunho, sem React e sem banco: o endereço de uma
 * seção nova, o código de uma regra nova, a próxima posição da lista e a troca
 * de duas posições vizinhas.
 *
 * Elas são puras porque cada uma tem um formato que o BANCO cobra por `check`
 * (`manual.sql`) — e um slug com acento ou um código minúsculo só apareceriam
 * como "400 Bad Request" na cara de quem estava escrevendo um manual.
 */
import type { RegraLinha, SecaoLinha, Versao, VersaoLinha } from '../tipos';

/**
 * O que todo pedaço do editor recebe: como recarregar e onde reclamar.
 *
 * Depois de gravar, quem manda na tela é o BANCO — recarregar em vez de mexer
 * no estado local é o que garante que a ordem, o slug e o que o trigger recusou
 * apareçam como estão gravados, e não como a tela imaginou.
 */
export interface FerramentasDoEditor {
  aoRecarregar: () => Promise<void>;
  aoErro: (mensagem: string) => void;
}

/** O que uma reordenação manda para o banco: o par que trocou de lugar. */
export interface NovaOrdem {
  id: string;
  ordem: number;
}

interface Ordenavel {
  id: string;
  ordem: number;
}

/**
 * O endereço da seção a partir do título.
 *
 * `check` do banco: `^[a-z0-9]+(-[a-z0-9]+)*$`, até 80 caracteres. Título vazio
 * ou só de símbolos devolve `secao`, que é um slug válido — deixar vazio faria
 * o INSERT quebrar por uma razão que a tela não explicaria.
 */
export function slugDe(titulo: string): string {
  const limpo = titulo
    .normalize('NFD')
    // `NFD` separa a letra do acento; a faixa combinatória apaga o acento.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return limpo.length > 0 ? limpo : 'secao';
}

/** Um slug que ainda não existe nesta versão — o par (versão, slug) é único. */
export function slugLivre(titulo: string, existentes: readonly string[]): string {
  const base = slugDe(titulo);
  if (!existentes.includes(base)) return base;
  let sufixo = 2;
  while (existentes.includes(`${base}-${sufixo}`)) sufixo += 1;
  return `${base}-${sufixo}`;
}

/** A posição do fim da fila. Vazio começa em zero — o `check` é `ordem >= 0`. */
export function proximaOrdem(itens: readonly Ordenavel[]): number {
  return itens.reduce((maior, item) => Math.max(maior, item.ordem + 1), 0);
}

/**
 * O código da próxima regra: R1, R2, R3…
 *
 * `check` do banco: maiúsculas, números e hífen. O par (seção, código) é único,
 * então o número salta o que já existe em vez de contar quantas regras há — uma
 * regra apagada no meio deixaria a contagem repetir um código vivo.
 */
export function proximoCodigo(regras: readonly RegraLinha[]): string {
  const usados = new Set(regras.map((regra) => regra.codigo));
  let numero = 1;
  while (usados.has(`R${numero}`)) numero += 1;
  return `R${numero}`;
}

/**
 * Troca um item de lugar com o vizinho.
 *
 * Devolve só o par que mudou — são dois PATCH, e mandar a lista inteira a cada
 * clique de seta reescreveria linhas que ninguém mexeu. Lista vazia = não há
 * para onde ir (já é o primeiro, ou já é o último).
 */
export function trocarOrdem(
  itens: readonly Ordenavel[],
  id: string,
  direcao: -1 | 1,
): NovaOrdem[] {
  const fila = [...itens].sort((a, b) => a.ordem - b.ordem);
  const onde = fila.findIndex((item) => item.id === id);
  const vizinho = onde + direcao;
  if (onde < 0 || vizinho < 0 || vizinho >= fila.length) return [];
  const atual = fila[onde];
  const outro = fila[vizinho];
  /* As posições podem estar empatadas (duas seções com `ordem` 0 depois de uma
     importação torta). Trocar valores iguais não mudaria nada, então o vizinho
     recebe a posição do atual e o atual, a do vizinho MAIS o empate desfeito. */
  if (atual.ordem === outro.ordem) {
    return [
      { id: atual.id, ordem: direcao === -1 ? atual.ordem : atual.ordem + 1 },
      { id: outro.id, ordem: direcao === -1 ? outro.ordem + 1 : outro.ordem },
    ];
  }
  return [
    { id: atual.id, ordem: outro.ordem },
    { id: outro.id, ordem: atual.ordem },
  ];
}

/** As regras de uma seção, na ordem em que o cliente as vê. */
export function regrasDaSecao(
  regras: readonly RegraLinha[],
  secao: SecaoLinha,
): RegraLinha[] {
  return regras
    .filter((regra) => regra.secao_id === secao.id)
    .sort((a, b) => a.ordem - b.ordem || a.codigo.localeCompare(b.codigo));
}

/** Se o rascunho pode ser publicado. O banco cobra o mesmo, e é ele que decide. */
export function podePublicar(regras: readonly RegraLinha[]): boolean {
  return regras.some((regra) => regra.obrigatoria);
}

/* ─── DAS LINHAS DO BANCO PARA O MANUAL DO CLIENTE ─────────────────────────── */

/**
 * A versão inteira no formato que o fluxo do cliente entende.
 *
 * A área do time lê LINHAS do PostgREST (`VersaoLinha`, `SecaoLinha`,
 * `RegraLinha`), planas e com as chaves estrangeiras à mostra; o cliente recebe
 * da API uma `Versao` já montada, com as regras dentro de cada seção. A prévia
 * é o único lugar em que os dois mundos se encontram, e é aqui que a costura
 * acontece — pura, para ser provada sem banco e sem tela.
 *
 * Campo a campo, e não por espalhamento: `versao_id` e `secao_id` são do banco
 * e não do contrato público. Um `...secao` levaria a chave estrangeira para
 * dentro da prévia e, no dia em que a prévia virasse fonte de outra coisa,
 * levaria junto para onde ela não deve ir.
 *
 * A ordem é a mesma que o cliente vê: `ordem` manda, e o desempate repete o do
 * editor (slug para seção, código para regra) para que a prévia e a tela de
 * conteúdo nunca mostrem a mesma versão em ordens diferentes.
 */
export function montarVersao(
  versao: VersaoLinha,
  secoes: readonly SecaoLinha[],
  regras: readonly RegraLinha[],
): Versao {
  const emOrdem = [...secoes].sort((a, b) => a.ordem - b.ordem || a.slug.localeCompare(b.slug));
  return {
    id: versao.id,
    numero: versao.numero,
    titulo: versao.titulo,
    declaracao: versao.declaracao,
    secoes: emOrdem.map((secao) => ({
      id: secao.id,
      slug: secao.slug,
      titulo: secao.titulo,
      descricao: secao.descricao,
      ordem: secao.ordem,
      regras: regrasDaSecao(regras, secao).map((regra) => ({
        id: regra.id,
        codigo: regra.codigo,
        titulo: regra.titulo,
        instrucao: regra.instrucao,
        porque: regra.porque,
        exemplo: regra.exemplo,
        severidade: regra.severidade,
        obrigatoria: regra.obrigatoria,
        ordem: regra.ordem,
      })),
    })),
  };
}
