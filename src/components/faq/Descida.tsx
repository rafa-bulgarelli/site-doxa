import { motion } from 'framer-motion';

/** O comprimento do percurso quando o sinal desce, em pixels. */
export const ALTURA = 36;

/**
 * Metade do vão entre as colunas, em pixels — o recuo que cada uma dá para a
 * divisória, e o percurso do sinal deitado.
 *
 * É `pr-16` na coluna da pergunta, `pl-16` na das respostas, e o dobro dele é o
 * percurso do risco — um número só, exportado de um lugar só. Com valores
 * separados, o dia em que o vão mudar é o dia em que o risco passa a parar antes
 * da resposta ou a entrar por cima do texto dela.
 */
export const VAO = 64;

/** Quanto o sinal leva para atravessar, em segundos. */
export const VIAGEM = 0.42;

/**
 * Quanto a barra leva varrendo o campo, em segundos — o primeiro trecho.
 *
 * Mora aqui, e não no campo, porque o campo e o sinal são um gesto só: a barra
 * termina no instante em que o risco parte. Com o número escrito nos dois
 * lugares, o dia em que um mudar é o dia em que aparece um buraco entre eles ou
 * os dois correm por cima um do outro.
 */
export const CARGA = 0.3;

/**
 * A espessura do sinal, em pixels.
 *
 * Três, e não dois: o risco atravessa um vão VAZIO de 128 pixels, e um fio de
 * dois pixels a 10% de branco não se lê como um objeto ali — se lê como sujeira
 * na tela. É a mesma espessura da barra que corre no campo, porque é a mesma
 * linha continuando.
 */
export const ESPESSURA = 3;

/**
 * O comprimento do risco que corre.
 *
 * Deitado ele é o dobro: o percurso é quase quatro vezes maior (128 contra 36),
 * e um risco curto num percurso longo lê como um ponto viajando, não como algo
 * sendo puxado. Em pé, 28 pixels num trilho de 36 seria o trilho inteiro coberto
 * — e aí não há percurso nenhum para ver.
 */
const RISCO_DEITADO = 28;
const RISCO_EM_PE = 14;

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
export function Descida({ sentido, linha = 0 }: { sentido: Sentido; linha?: number }) {
  const deitado = sentido === 'direita';
  /* O VÃO INTEIRO, e não metade dele.
     Parando na divisória, o risco morria no meio do caminho e a resposta nascia
     do outro lado sem nada tê-la levado até lá — que era, exatamente, o que
     fazia o traço parecer jogado na tela. Atravessando os 128, ele sai da borda
     do campo e chega na borda do texto: um percurso com as duas pontas em
     objetos que existem. A divisória deixa de ser o fim dele e passa a ser algo
     por onde ele passa. */
  const percurso = deitado ? VAO * 2 : ALTURA;
  const risco = deitado ? RISCO_DEITADO : RISCO_EM_PE;

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
          ? /*
             * Atravessado no vão inteiro: `right: -VAO` empurra a ponta direita
             * para dentro do recuo da OUTRA coluna, e a largura dobrada faz o
             * trilho ir da borda do campo até a borda do texto da resposta.
             *
             * `linha` é a altura em que ele corre, e ela é a MESMA linha em que
             * a barra do campo acabou de terminar — a base do campo. Um sinal
             * que sai numa altura diferente da que a barra terminou não é o
             * segundo trecho de um gesto: são duas animações que por acaso
             * aconteceram perto uma da outra, e é assim que o olho lê.
             */
            {
              right: -VAO,
              width: VAO * 2,
              height: ESPESSURA,
              marginTop: linha - ESPESSURA,
            }
          : // Pendurado ACIMA da lista, dentro do vão que a margem já abriu.
            { height: ALTURA, marginTop: -ALTURA }
      }
    >
      {/* O trilho. Sem ele o risco corre no vazio e não se lê como um caminho
          sendo percorrido — lê como um cisco atravessando a tela. */}
      <span
        className={`absolute left-0 top-0 rounded-full bg-white/[0.14] ${
          deitado ? 'w-full' : 'h-full'
        }`}
        style={deitado ? { height: ESPESSURA } : { width: ESPESSURA }}
      />

      {/* O risco, com RASTRO: transparente atrás, cheio na ponta. Um bloco de
          cor uniforme atravessando é um objeto sendo transportado; com a cauda
          se apagando, o mesmo movimento lê como algo CORRENDO — e essa é a
          diferença entre ver um traço e ver a pergunta indo embora.

          Some pelas pontas por OPACIDADE e não por recorte: recortado, a auréola
          seria cortada junto no primeiro e no último quadro, e o brilho
          apareceria com uma quina. */}
      <motion.span
        className="absolute left-0 top-0 rounded-full"
        style={{
          ...(deitado
            ? { width: risco, height: ESPESSURA }
            : { height: risco, width: ESPESSURA }),
          background: `linear-gradient(to ${
            deitado ? 'right' : 'bottom'
          }, rgba(244,241,232,0), #F4F1E8)`,
          boxShadow: '0 0 14px 3px rgba(244,241,232,0.55)',
        }}
        initial={deitado ? { x: -risco, opacity: 0 } : { y: -risco, opacity: 0 }}
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
