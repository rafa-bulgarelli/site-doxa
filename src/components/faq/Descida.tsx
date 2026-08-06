import { motion } from 'framer-motion';

/** A altura do trilho, em pixels. */
export const ALTURA = 36;

/** Quanto o sinal leva para descer, em segundos. */
export const VIAGEM = 0.42;

/** O comprimento do risco que desce. */
const RISCO = 14;

/**
 * O sinal que leva a pergunta até onde a resposta nasce.
 *
 * ─── POR QUE ESTA VERSÃO É A SEGUNDA ─────────────────────────────────────────
 *
 * A primeira travava, e o dono viu. Ela era um SVG com `stroke-dashoffset`
 * animado, auréola de `drop-shadow` e — o pior dos três — a caixa abrindo de
 * zero a 44 pixels de ALTURA enquanto tudo isso acontecia. Cada um desses é um
 * problema por si:
 *
 *  1. animar `height` obriga o navegador a refazer o layout da página a cada
 *     quadro, e a esta altura da seção há uma lista inteira embaixo para
 *     reposicionar;
 *  2. `drop-shadow` é filtro, e filtro repinta na CPU em todo quadro em que o
 *     que está por baixo muda — e o que estava por baixo mudava, porque era o
 *     traço andando;
 *  3. o pior: a animação do traço começava junto com a abertura da caixa, e a
 *     caixa era `overflow-hidden`. Os primeiros 40% da descida aconteciam
 *     DENTRO de uma caixa que ainda estava crescendo, ou seja, recortados. O que
 *     se via era um sinal que engasgava no começo e destravava no meio.
 *
 * Esta versão não anima layout nenhum: o trilho é absoluto, pendurado no vão que
 * já existe acima da lista, então nada se move para abrir espaço para ele. E o
 * que desce é um `transform`, que sobe para o compositor e é desenhado fora da
 * thread principal. A auréola é `box-shadow` de um elemento que não muda de
 * forma — rasterizada uma vez e depois só transportada.
 *
 * `linear`, e é a regra do site para sinal: um pulso que acelera e freia lê como
 * objeto sendo arrastado. Sinal não faz ease — ele apenas atravessa.
 */
export function Descida() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none absolute left-0 top-0 w-6"
      style={{ height: ALTURA, marginTop: -ALTURA }}
    >
      {/* O trilho. Sem ele o risco corre no vazio e não se lê como um caminho
          sendo percorrido — lê como um cisco atravessando a tela. */}
      <span className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-white/[0.10]" />

      {/* O risco. Some pelas pontas por OPACIDADE e não por recorte: recortado,
          a auréola seria cortada junto no primeiro e no último quadro, e o
          brilho apareceria com uma quina. */}
      <motion.span
        className="absolute left-0 top-0 w-[2px] rounded-full bg-[#F4F1E8]"
        style={{ height: RISCO, boxShadow: '0 0 10px 2px rgba(244,241,232,0.45)' }}
        initial={{ y: -RISCO, opacity: 0 }}
        animate={{ y: ALTURA, opacity: [0, 1, 1, 0] }}
        transition={{
          y: { duration: VIAGEM, ease: 'linear' },
          opacity: { duration: VIAGEM, ease: 'linear', times: [0, 0.18, 0.78, 1] },
        }}
      />
    </motion.div>
  );
}
