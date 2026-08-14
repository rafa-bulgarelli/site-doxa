/**
 * ─── A PORTA DA EQUIPE ───────────────────────────────────────────────────────
 *
 * `POST /api/manual/admin`. Convite (criar, revogar, regenerar), comprovante e
 * versão (rascunho, publicar) — tudo com a sessão do time no `Authorization`.
 *
 * Como a porta do cliente, este arquivo é só a moldura da Vercel: a lógica, e
 * os testes dela, ficam em `src/manual/servidor/admin.ts`.
 */
export const config = { runtime: 'edge' };

import { responderAdmin } from '../../src/manual/servidor/admin';

export default function handler(pedido: Request): Promise<Response> {
  return responderAdmin(pedido);
}
