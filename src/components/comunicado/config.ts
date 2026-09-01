/**
 * Conteúdo do dono do comunicado — o aviso de que o formulário passou dos mil
 * pedidos de contato (ordem do dono, 2026-09-01). Tudo que é número ou texto
 * de negócio mora aqui; `Comunicado.tsx` só sabe desenhar.
 *
 * Em português só, por DECISÃO do dono no gate (2026-09-01) — não por padrão:
 * as seções já falam pt|en via `useIdioma`, e um visitante em `en` vê este
 * aviso em PT. Aceito pela urgência e pelo prazo curto de vida do aviso; se
 * ele viver o bastante para merecer tradução, vira `PorIdioma` e a chave sobe
 * para `v2`.
 */

/**
 * `?comunicado` na URL força o aviso sem a espera.
 *
 * Sobrou um uso desde que o dono mandou o aviso estourar em TODO load
 * (2026-09-01, fim da marca de "já vi" no `localStorage`): o screenshot da
 * torre (`mobile-shot.mjs` fotografa 1,5 s depois do load; a espera normal de
 * 1,6 s perderia a foto por um décimo).
 */
export const PARAM_FORCA = 'comunicado';

/** Quanto o visitante lê do hero antes de o aviso entrar, em ms. */
export const ESPERA_MS = 1600;

/** O número do título — sobe de zero até aqui quando o cartão pousa. */
export const TOTAL_DE_PEDIDOS = 1000;

export const COPY = {
  /** O selo no topo, ao lado do ponto que pulsa. */
  selo: 'Respondendo agora',
  /**
   * O título em duas partes, porque o número entre elas é um `Contador` e
   * sobe sozinho. Juntas: "Mais de 1.000 pedidos de contato."
   */
  tituloAntes: 'Mais de',
  tituloDepois: 'pedidos de contato.',
  corpo:
    'O formulário passou dos mil. Estamos falando com todo mundo — um por um, ' +
    'na ordem de chegada, no ritmo mais rápido que conseguimos manter sem ' +
    'abrir mão do padrão que trouxe você até aqui.',
  /** A linha para quem já está na fila — a ansiedade que o aviso existe para desarmar. */
  garantia: 'Já preencheu? Seu lugar está guardado. Não precisa enviar de novo.',
  /**
   * Os dois botões, em linha — um por leitor (pedido do dono, 2026-09-01):
   * quem JÁ preencheu fecha no transparente; quem AINDA NÃO preencheu vai ao
   * formulário pelo preto de flecha — o único aceso, porque é a ação que o
   * cartão existe para provocar. Nada de link apagado embaixo.
   */
  botao: 'Entendi',
  botaoFila: 'Garanta seu lugar na fila',
  fechar: 'Fechar aviso',
} as const;
