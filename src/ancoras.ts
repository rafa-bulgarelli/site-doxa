/**
 * ─── AS ÂNCORAS DA PÁGINA ────────────────────────────────────────────────────
 *
 * Um id de âncora é um contrato entre dois arquivos que não se conhecem: um
 * escreve o `href`, o outro desenha o elemento. Escrito à mão dos dois lados,
 * ele quebra em SILÊNCIO — o clique rola zero pixel, não há erro no console e
 * nada na tela diz que o botão morreu. Este repositório já pagou por isso:
 * `#pedido` era apontado por dois botões enquanto elemento nenhum da página
 * tinha esse id.
 *
 * Aqui cada string existe uma vez só, e quem mantém as duas pontas juntas é o
 * compilador. Só entra neste arquivo o id que CRUZA arquivos.
 */

/**
 * ─── O DESTINO DE TODA CTA DE CONVERSÃO ──────────────────────────────────────
 *
 * O painel claro da comparação: a manchete, a garantia e o formulário. Todo
 * botão que existe para converter — o do topo, o da parede de prova, o escape
 * do FAQ, o fecho do rodapé e o atalho da barra de rolagem — aponta para cá, e
 * para mais lugar nenhum.
 *
 * A âncora é o PAINEL INTEIRO, e não o cartão do formulário, porque o salto
 * alinha o topo do alvo com o topo da janela: no painel, a pessoa cai numa tela
 * cheia que abre com a promessa ("Um milhão de views. Ou seu dinheiro de
 * volta.") e termina no campo do nome — o argumento e o pedido na mesma tela.
 * No cartão, ela cairia no formulário com o resto do painel cortado acima da
 * dobra, decidindo sem o motivo à vista.
 *
 * O id mora num elemento SEM transform (`Comparacao.tsx` explica), e é isso que
 * faz a conta do salto fechar.
 */
export const ANCORA_FORMS = 'forms';

/** O mesmo destino, na forma que um `href` aceita. */
export const HREF_FORMS = `#${ANCORA_FORMS}`;

/** A seção de perguntas. Só o rodapé aponta para ela. */
export const ANCORA_FAQ = 'faq';

/** @see ANCORA_FAQ */
export const HREF_FAQ = `#${ANCORA_FAQ}`;

/**
 * O cartão do formulário — HANDLE DE MEDIDA, e não âncora de botão.
 *
 * Ninguém navega para cá. O id existe porque o FAQ precisa do PÉ do cartão para
 * calcular o próprio recuo de topo (`Faq.tsx` explica a simetria), e as duas
 * seções são componentes irmãos sem ref em comum — `getElementById` é a ponte.
 */
export const ID_CARTAO_PEDIDO = 'pedido';
