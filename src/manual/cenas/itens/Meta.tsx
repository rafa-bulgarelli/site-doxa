/**
 * ─── MINI-CENA: A META (GA-1) ────────────────────────────────────────────────
 *
 * O item: **1 milhão de visualizações somadas, em 90 dias, nas três redes.**
 *
 * O contador sobe. As barras crescem junto, as três redes acendem uma a uma, e
 * o número fecha em 1M com o visto. A soma é o ponto: nenhuma rede sozinha
 * precisa chegar lá — é o total que conta, e é por isso que os três fios
 * apontam para o MESMO número.
 *
 * ─── O QUE MUDOU NA RODADA DO POLIMENTO ──────────────────────────────────────
 *
 * 1. **A rede virou o ícone de verdade.** Antes era um glifo genérico (play,
 *    quadrado, anel) preso dentro de um círculo cinza, e o dono nomeou o defeito
 *    duas vezes: "afogado", "enforcado". O círculo era a jaula. Agora vem de
 *    `redes.tsx` — YouTube, TikTok, Instagram desenhados soltos, com o respiro
 *    que eles já têm, e mais espaçados um do outro.
 *
 * 2. **Acender virou uma passagem, não um estalo.** A rede apagada e a rede
 *    acesa são o MESMO glifo desenhado duas vezes, uma por cima da outra: o que
 *    anima é a opacidade da de cima. Trocar a cor no atributo mudaria o desenho
 *    entre dois quadros — cross-fade é o que faz a rede "acender" em vez de
 *    "trocar".
 *
 * 3. **O número ENTRA subindo.** O contador remonta a cada valor (`key`), então
 *    o valor novo nasce um pouco abaixo e sobe até o lugar. Um `<text>` que só
 *    troca de conteúdo pisca; este sobe, que é o gesto de um contador.
 */
import { Legenda, Marca, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, Faiscas, TracoDeLuz, corDoArco, useTintas } from '../luz';
import { MiniPalco } from './comuns';
import { IconeDaRede, REDES_REAIS } from '../redes';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

const FASES = [1200, 1400, 1600, 2400] as const;
const CHEIO = 2;
const VISTO = 3;

/** O que o contador mostra em cada fase — a soma das três redes. */
const VALORES = ['0', '320K', '1M', '1M'] as const;

/** Quantas redes já entraram na conta, por fase. */
const REDES_ACESAS = [0, 2, 3, 3] as const;

const BARRAS = [
  [14, 19, 16, 22, 20, 26],
  [22, 30, 26, 38, 34, 44],
  [28, 38, 33, 50, 45, 62],
  [28, 38, 33, 50, 45, 62],
] as const;

const BASE = 120;

/**
 * Onde a soma acontece: o número no meio do palco.
 *
 * O corpo é 48, e não os 54 de antes, por uma razão que só aparece na fase do
 * meio: "320K" tem quatro caracteres e, em 54, a perna do K entrava embaixo dos
 * fios que chegam em 322 — o número ficava rabiscado justamente no quadro em
 * que ele é a informação. Em 48, e com o centro 16 à esquerda, sobra folga.
 */
const SOMA_X = 244;
const SOMA_Y = 76;
const SOMA_CORPO = 48;

/**
 * A coluna das redes e a altura de cada uma.
 *
 * 43 de passo para um ícone de 32: sobra folga de 11 entre um glifo e o
 * seguinte, e 16 de margem para a borda de cima e a de baixo do palco. Com o
 * círculo de antes, o mesmo passo deixava dois anéis quase encostados — sem a
 * jaula, o espaço que sobra é o que faz os três respirarem.
 */
const REDE_X = 412;
const REDE_Y = [32, 75, 118] as const;
const REDE_TAMANHO = 32;

/** As barras do acumulado: sobem juntas e ganham cor do arco da esquerda à direita. */
function Barras({ fase, parado }: { fase: number; parado: boolean }) {
  const alturas = BARRAS[fase];
  return (
    <g>
      {alturas.map((altura, indice) => (
        <motion.rect
          key={indice}
          x={30 + indice * 24}
          width={15}
          rx={4}
          fill={corDoArco(indice / (alturas.length - 1))}
          initial={{ attrY: BASE - altura, height: altura }}
          animate={{ attrY: BASE - altura, height: altura }}
          transition={{
            duration: tempo(parado, 0.75),
            ease: EASE,
            delay: tempo(parado, indice * 0.08),
          }}
        />
      ))}
    </g>
  );
}

/** O contador da soma — o valor novo nasce embaixo e sobe até o lugar. */
function Contador({ valor, parado }: { valor: string; parado: boolean }) {
  return (
    <motion.g
      initial={{ opacity: parado ? 1 : 0, y: parado ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: tempo(parado, 0.55), ease: EASE }}
    >
      <Legenda x={SOMA_X} y={SOMA_Y + 14} corpo={SOMA_CORPO} tinta="arco">
        {valor}
      </Legenda>
    </motion.g>
  );
}

/** Uma rede: o glifo apagado, o mesmo glifo aceso por cima e o fio até a soma. */
function Rede({ indice, acesa, parado }: { indice: number; acesa: boolean; parado: boolean }) {
  const tintas = useTintas();
  const rede = REDES_REAIS[indice];
  const y = REDE_Y[indice];
  return (
    <g>
      {/*
       * O halo é curto (26) de propósito: três clarões de 40 empilhados nesta
       * coluna se somavam numa mancha quente só, e o que se via do lado direito
       * do palco era a mancha, não as três redes.
       */}
      <Brilho x={REDE_X} y={y} raio={26} tinta="luzQuente" aceso={acesa} parado={parado} />
      {acesa && (
        <TracoDeLuz
          d={`M ${REDE_X - 26} ${y} C 360 ${y}, 350 ${SOMA_Y}, 322 ${SOMA_Y}`}
          cor={tintas('arco')}
          largura={1.6}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.7}
          atraso={indice * 0.14}
        />
      )}
      <IconeDaRede rede={rede} x={REDE_X} y={y} tamanho={REDE_TAMANHO} cor={TRACO} acesa={false} />
      <motion.g
        initial={{ opacity: parado && acesa ? 1 : 0 }}
        animate={{ opacity: acesa ? 1 : 0 }}
        transition={{
          duration: tempo(parado, 0.55),
          ease: EASE,
          delay: tempo(parado, indice * 0.14),
        }}
      >
        <IconeDaRede rede={rede} x={REDE_X} y={y} tamanho={REDE_TAMANHO} cor={TRACO_ACESO} />
      </motion.g>
    </g>
  );
}

export default function Meta() {
  const { fase, parado } = useRoteiro(FASES, VISTO);
  const acesas = REDES_ACESAS[fase];

  return (
    <MiniPalco fase={fase}>
      <Barras fase={fase} parado={parado} />
      <Legenda x={102} y={143} corpo={17}>
        90 dias
      </Legenda>

      <Brilho x={SOMA_X} y={SOMA_Y - 6} raio={92} tinta="luz" aceso={fase >= CHEIO} parado={parado} />
      <Contador key={VALORES[fase]} valor={VALORES[fase]} parado={parado} />
      <Faiscas x={SOMA_X} y={SOMA_Y - 6} raio={78} ativo={fase === CHEIO} parado={parado} quantidade={9} />

      {REDES_REAIS.map((rede, indice) => (
        <Rede key={rede} indice={indice} acesa={indice < acesas} parado={parado} />
      ))}

      {fase === VISTO && (
        <g>
          <Brilho x={SOMA_X} y={126} raio={40} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={SOMA_X} y={126} cor={TINTA.protege} escala={0.95} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
