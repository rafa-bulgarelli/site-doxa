/**
 * ─── A VERSÃO MONTADA ────────────────────────────────────────────────────────
 *
 * O banco guarda versão, seção e regra em três tabelas; o cliente recebe UMA
 * árvore. A montagem é aqui.
 *
 * São três consultas e uma junção em memória, e não um `select` embutido do
 * PostgREST, por uma razão prática: a ordenação de recurso embutido depende de
 * o PostgREST enxergar a chave estrangeira com o nome certo, e uma seção que
 * volta com as regras fora de ordem é um manual embaralhado que ninguém percebe
 * revisando código. Aqui a ordem é `order=ordem.asc` explícito, duas vezes.
 */
import type { Regra, RegraLinha, Secao, SecaoLinha, Versao, VersaoLinha } from '../tipos';
import { consultar, primeira } from './banco';
import { ErroHttp } from './http';

function paraRegra(linha: RegraLinha): Regra {
  return {
    id: linha.id,
    codigo: linha.codigo,
    titulo: linha.titulo,
    instrucao: linha.instrucao,
    porque: linha.porque,
    exemplo: linha.exemplo,
    severidade: linha.severidade,
    obrigatoria: linha.obrigatoria,
    ordem: linha.ordem,
  };
}

function paraSecao(linha: SecaoLinha, regras: RegraLinha[]): Secao {
  return {
    id: linha.id,
    slug: linha.slug,
    titulo: linha.titulo,
    descricao: linha.descricao,
    ordem: linha.ordem,
    regras: regras.filter((regra) => regra.secao_id === linha.id).map(paraRegra),
  };
}

/** A versão vigente para convite novo. O índice único do banco garante que é uma só. */
export function versaoPublicada(): Promise<VersaoLinha | null> {
  return primeira<VersaoLinha>('manual_versoes?status=eq.publicada&select=*');
}

export async function montarVersao(versaoId: string): Promise<Versao> {
  const versao = await primeira<VersaoLinha>(`manual_versoes?id=eq.${versaoId}&select=*`);
  if (versao == null) throw new ErroHttp(404, 'versao_inexistente');

  const secoes = await consultar<SecaoLinha>(
    `manual_secoes?versao_id=eq.${versaoId}&select=*&order=ordem.asc`,
  );
  const ids = secoes.map((secao) => secao.id).join(',');
  const regras =
    ids.length === 0
      ? []
      : await consultar<RegraLinha>(
          `manual_regras?secao_id=in.(${ids})&select=*&order=ordem.asc,codigo.asc`,
        );

  return {
    id: versao.id,
    numero: versao.numero,
    titulo: versao.titulo,
    declaracao: versao.declaracao,
    secoes: secoes.map((secao) => paraSecao(secao, regras)),
  };
}
