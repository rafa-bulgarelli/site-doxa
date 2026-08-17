/**
 * ─── A PORTA DO CONVERSOR ────────────────────────────────────────────────────
 *
 * `POST /api/conversor`. Sobe um documento com a sessão do time no
 * `Authorization`, desce o mesmo documento no outro formato.
 *
 * Como as portas do manual, este arquivo é só a moldura da Vercel: a lógica, e
 * os testes dela, ficam em `src/conversor/servidor/converter.ts`, porque o que
 * está dentro de `api/` não é alcançável pelo vitest sem simular o runtime de
 * borda — e uma regra de upload que ninguém testa é uma regra que se descobre
 * errada com o contrato do cliente na tela.
 */
export const config = { runtime: 'edge' };

import { responderConversor } from '../src/conversor/servidor/converter';

export default function handler(pedido: Request): Promise<Response> {
  return responderConversor(pedido);
}
