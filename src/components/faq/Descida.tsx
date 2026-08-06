import { motion } from 'framer-motion';

/** O comprimento do percurso quando o sinal desce, em pixels. */
export const ALTURA = 36;

/**
 * Metade do vão entre as colunas, em pixels — o recuo que cada uma dá para a
 * divisória, e o percurso do sinal deitado.
 *
 * É `pr-16` na coluna da pergunta, `pl-16` na das respostas E o comprimento do
 * risco: um número só, exportado de um lugar só. Com valores separados, o dia em
 * que o vão mudar é o dia em que o risco passa a parar antes da divisória ou a
 * atravessar por cima dela.
 */
export const VAO = 64;

/** Quanto o sinal leva para atravessar, em segundos. */
export const VIAGEM = 0.42;

/** O comprimento do risco que corre. */
const RISCO = 14;

/** Por onde a resposta nasce, visto de onde a pergunta foi escrita. */
export type Sentido = 'baixo' | 'direita';

/**
 * O sinal que leva a pergunta até onde a resposta nasce.
 *
 * ─── POR QUE ELE TEM DOIS SENTIDOS ───────────────────────────────────────────
 *
 * Enquanto a seção era uma coluna só, a resposta nascia embaixo do campo e o
 * sinal descia. Com o painel de respostas aberto ao lado, ela nasce À DIREITA —
 * e um risco descendo para um lugar onde nada acontece deixa de ser causa e vira
 * enfeite. O sentido segue o layout, e por isso cada um se esconde no breakpoint
 * do outro: `baixo` some em `lg`, que é onde a seção se divide; `direita` só
 * existe a partir de `lg`, que é onde há um vão para atravessar.
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
 * já existe ao lado da lista, então nada se move para abrir espaço para ele. E o
 * que corre é um `transform`, que sobe para o compositor e é desenhado fora da
 * thread principal. A auréola é `box-shadow` de um elemento que não muda de
 * forma — rasterizada uma vez e depois só transportada.
 *
 * `linear`, e é a regra do site para sinal: um pulso que acelera e freia lê como
 * objeto sendo arrastado. Sinal não faz ease — ele apenas atravessa.
 */
export function Descida({ sentido, centro = 0 }: { sentido: Sentido; centro?: number }) {
  const deitado = sentido === 'direita';
  const percurso = deitado ? VAO : ALTURA;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      transition={{ duration: 0.1 }}
      className={`pointer-events-none absolute ${
        deitado ? 'top-0 hidden lg:block' : 'left-0 top-0 w-6 lg:hidden'
      }`}
      style={
        deitado
          ? // Dentro do recuo que a coluna da pergunta dá à divisória: começa na
            // borda do campo e termina encostando nela. O `marginTop` é o que
            // põe o risco na LINHA DO MEIO do campo — sem ele o sinal corre pelo
            // topo do box e lê como um traço solto boiando ao lado da caixa, em
            // vez de algo que saiu de dentro dela.
            { right: 0, width: VAO, height: 2, marginTop: centro - 1 }
          : // Pendurado ACIMA da lista, dentro do vão que a margem já abriu.
            { height: ALTURA, marginTop: -ALTURA }
      }
    >
      {/* O trilho. Sem ele o risco corre no vazio e não se lê como um caminho
          sendo percorrido — lê como um cisco atravessando a tela. */}
      <span
        className={`absolute left-0 top-0 rounded-full bg-white/[0.10] ${
          deitado ? 'h-[2px] w-full' : 'h-full w-[2px]'
        }`}
      />

      {/* O risco. Some pelas pontas por OPACIDADE e não por recorte: recortado,
          a auréola seria cortada junto no primeiro e no último quadro, e o
          brilho apareceria com uma quina. */}
      <motion.span
        className={`absolute left-0 top-0 rounded-full bg-[#F4F1E8] ${
          deitado ? 'h-[2px]' : 'w-[2px]'
        }`}
        style={{
          ...(deitado ? { width: RISCO } : { height: RISCO }),
          boxShadow: '0 0 10px 2px rgba(244,241,232,0.45)',
        }}
        initial={deitado ? { x: -RISCO, opacity: 0 } : { y: -RISCO, opacity: 0 }}
        animate={
          deitado
            ? { x: percurso, opacity: [0, 1, 1, 0] }
            : { y: percurso, opacity: [0, 1, 1, 0] }
        }
        transition={{
          [deitado ? 'x' : 'y']: { duration: VIAGEM, ease: 'linear' },
          opacity: { duration: VIAGEM, ease: 'linear', times: [0, 0.18, 0.78, 1] },
        }}
      />
    </motion.div>
  );
}
