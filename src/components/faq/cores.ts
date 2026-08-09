/**
 * A ÚNICA cor da interface — e ela mora sozinha neste arquivo de propósito.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O CONFLITO, declarado aqui para quem vier depois não achar que foi descuido.
 *
 * `tailwind.config.js` diz, por escrito: "Doxa is strictly monochrome: every
 * value here has R=G=B, so no hue can leak into the UI. Colour is only allowed
 * to come from assets." Este arquivo é uma exceção pedida pelo dono, e ela vale
 * para TRÊS objetos e nada mais:
 *
 *   1. os pontos que marcam quantas respostas já foram lidas;
 *   2. o anel que acende na borda do campo sob a mão;
 *   3. o brilho do convite "Pergunte o que quiser.", que é o rótulo do campo —
 *      `.texto-aceso-siri`, em `index.css`.
 *
 * O terceiro não IMPORTA daqui, e é a única trinca do arranjo: como ele é um
 * `text-shadow`, as seis cores estão escritas à mão nos keyframes, do mesmo
 * jeito que o clarão do `.anel-siri` logo abaixo dele já estava — e na MESMA
 * ordem desta lista, porque as seis sombras do halo remontam, em volta das
 * letras, o mesmo arco que o cônico do anel desenha em volta do campo. Recolher
 * a exceção é apagar este arquivo, seguir os erros do compilador e varrer
 * `texto-aceso-siri` no CSS.
 *
 * Estar num arquivo próprio é o que mantém a exceção auditável: para devolver a
 * seção ao monocromático, apaga-se este arquivo e o compilador aponta os três
 * lugares que dependiam dele. Espalhadas em classes pelo JSX, as mesmas cores
 * levariam meio dia para serem recolhidas.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A ordem é do quente ao frio, e não é aleatória: é o arco que o anel percorre
 * quando gira, e um salto de matiz no meio da volta apareceria como uma emenda
 * girando junto. Do âmbar ao verde-água, cada passo é vizinho do anterior.
 *
 * Todas em saturação média e claridade alta — sobre preto, cor pura vibra e
 * suja; estas leem como luz, que é o que um ponto aceso deve parecer.
 */
export const CORES = [
  '#F2A65A', // âmbar
  '#E8735A', // coral
  '#DE5C7E', // rosa
  '#9B7BE0', // violeta
  '#5AA0E0', // azul
  '#4FC9A8', // verde-água
] as const;

/**
 * A cor de quem perguntou o que a página não sabe responder.
 *
 * Creme, e não uma sétima cor: as seis dizem "isto tem resposta escrita aqui".
 * A pergunta que cai no consultor é outra categoria de coisa, e dar a ela mais
 * uma cor do arco faria as sete lerem como sete respostas.
 */
export const SEM_COR = '#F4F1E8';

/** A cor da enésima dúvida, na ordem em que elas estão escritas. */
export function corDaDuvida(indice: number) {
  return CORES[indice % CORES.length] ?? SEM_COR;
}
