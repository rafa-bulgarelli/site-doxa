/**
 * ─── O JEITO DE RESPONDER ────────────────────────────────────────────────────
 *
 * Uma resposta de erro da API do manual tem exatamente uma forma:
 * `{ erro: '<palavra>' }`. A palavra é curta e de propósito — nome de coluna,
 * mensagem de constraint e corpo do PostgREST são o mapa do banco para quem
 * estiver sondando, e ficam no log, do nosso lado.
 *
 * O que NÃO é `ErroHttp` vira 500 com 'falhou'. Um erro que o código não previu
 * não sabe o que é seguro contar.
 */
import type { RespostaErro } from '../tipos';

/** Erro que a API sabe responder: o status e a palavra que pode ir para fora. */
export class ErroHttp extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    detalhe?: string,
  ) {
    super(detalhe ?? codigo);
    this.name = 'ErroHttp';
  }
}

export function responder(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      'content-type': 'application/json',
      // Convite, progresso e URL assinada são todos de vida curta: nada aqui
      // pode encostar em cache de CDN.
      'cache-control': 'no-store',
    },
  });
}

export function responderErro(erro: unknown): Response {
  if (erro instanceof ErroHttp) {
    if (erro.status >= 500) console.error('manual:', erro.status, erro.codigo, erro.message);
    const corpo: RespostaErro = { erro: erro.codigo };
    return responder(corpo, erro.status);
  }
  console.error('manual: falha inesperada', erro);
  const corpo: RespostaErro = { erro: 'falhou' };
  return responder(corpo, 500);
}

/** O corpo do POST, ou 400. JSON quebrado não merece stack trace. */
export async function lerJson(pedido: Request): Promise<unknown> {
  try {
    return await pedido.json();
  } catch {
    throw new ErroHttp(400, 'json_invalido');
  }
}
