/**
 * ─── A PORTA DO CLIENTE ──────────────────────────────────────────────────────
 *
 * `POST /api/manual/publico`. Abrir o convite, salvar onde parou, concluir e
 * baixar o comprovante — as quatro coisas que alguém faz com um link recebido
 * no WhatsApp, sem conta e sem senha.
 *
 * O arquivo é só a moldura da Vercel. A lógica mora em
 * `src/manual/servidor/publico.ts`, e mora lá por um motivo prático: o que está
 * dentro de `api/` não é alcançável pelo vitest sem simular o runtime de borda,
 * e uma regra de convite que ninguém testa é uma regra que se descobre errada
 * no celular do cliente.
 */
export const config = { runtime: 'edge' };

import { responderPublico } from '../../src/manual/servidor/publico';

export default function handler(pedido: Request): Promise<Response> {
  return responderPublico(pedido);
}
