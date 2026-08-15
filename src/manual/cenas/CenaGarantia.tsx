/**
 * ─── CENA: A GARANTIA ────────────────────────────────────────────────────────
 *
 * A lição: **a rotina é que sustenta o direito.**
 *
 * A semana inteira num quadro: um vídeo por dia útil, o mesmo vídeo indo para
 * as três redes, vinte e quatro horas entre um e o outro, e o fim de semana
 * livre. Cumprida a semana, o escudo fica inteiro. Aí a cena mostra o outro
 * lado — impulsionar, editar por fora, comprar seguidor — e o escudo racha.
 * Fecha voltando ao certo, porque a última coisa que a pessoa vê é a que ela
 * leva para o dia seguinte.
 *
 * ─── POR QUE ESTA CENA TEM COR ───────────────────────────────────────────────
 *
 * O site é monocromático por regra (veja o comentário longo em
 * `tailwind.config.js`), e as outras três cenas obedecem. Aqui verde e vermelho
 * não são enfeite: eles SÃO a informação — um diz "isto mantém o seu direito",
 * o outro diz "isto o perde", e é a única distinção da cena inteira que não
 * pode depender de o leitor ler nada. Duas famílias, dois significados, zero
 * cor decorativa.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { EASE, tempo, useRoteiro } from './tempo';

/**
 * A semana chega · cinco dias, um por vez · fim de semana livre · o que quebra
 * · e o conserto, que segura o quadro antes do loop.
 */
const FASES = [1200, 900, 900, 900, 900, 900, 1400, 2000, 2400] as const;
const PRIMEIRO_DIA = 1;
const ULTIMO_DIA = 5;
const CUMPRIDA = 6;
const QUEBRA = 7;

const UTEIS = 5;
const DIA_X = [38, 98, 158, 218, 278, 338, 398] as const;
const DIA_Y = 120;
const DIA_L = 44;
const DIA_A = 42;

const REDES_X = [180, 240, 300] as const;
const REDE_Y = 40;

const VERDE_FRACO = 'rgba(52,211,153,0.55)';

/** As três redes, no alto: para onde o mesmo vídeo do dia sobe. */
function Redes({ ativo }: { ativo: boolean }) {
  const cor = ativo ? TRACO_ACESO : TRACO;
  return (
    <g>
      {REDES_X.map((cx, indice) => (
        <g key={cx}>
          <motion.circle
            cx={cx}
            cy={REDE_Y}
            r={19}
            fill={TINTA.elevado}
            strokeWidth={1.5}
            initial={{ stroke: cor }}
            animate={{ stroke: cor }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          {indice === 0 && <path d="M 175 33 l 12 7 l -12 7 z" fill={cor} />}
          {indice === 1 && <rect x={233} y={33} width={14} height={14} rx={4} fill={cor} />}
          {indice === 2 && (
            <circle cx={300} cy={REDE_Y} r={6.5} fill="none" stroke={cor} strokeWidth={2.5} />
          )}
        </g>
      ))}
    </g>
  );
}

interface DiaProps {
  readonly indice: number;
  readonly ativo: boolean;
  readonly feito: boolean;
  readonly parado: boolean;
}

/** Um quadrado da semana: por fazer, publicando, publicado — ou de folga. */
function Dia({ indice, ativo, feito, parado }: DiaProps) {
  const x = DIA_X[indice];
  const folga = indice >= UTEIS;
  const cor = feito ? VERDE_FRACO : ativo ? TRACO_ACESO : TINTA.linha;
  return (
    <motion.g initial={false} animate={{ opacity: folga ? 0.4 : 1 }} transition={{ duration: 0.4 }}>
      <Painel x={x} y={DIA_Y} largura={DIA_L} altura={DIA_A} cor={folga ? TINTA.linha : cor} />
      {/* A peça de vídeo do dia: some no fim de semana, que é folga de verdade. */}
      {!folga && !feito && <path d={`M ${x + 17} ${DIA_Y + 13} l 13 8 l -13 8 z`} fill={cor} />}
      {feito && (
        <Marca tipo="certo" x={x + 22} y={DIA_Y + 21} escala={0.7} cor={TINTA.protege} parado={parado} />
      )}
    </motion.g>
  );
}

/** O envio do dia: um vídeo, três destinos, desenhados subindo ao mesmo tempo. */
function Envio({ indice, parado }: { indice: number; parado: boolean }) {
  const origem = DIA_X[indice] + DIA_L / 2;
  return (
    <g>
      {REDES_X.map((cx) => (
        <motion.path
          key={`${indice}-${cx}`}
          d={`M ${origem} ${DIA_Y} C ${origem} 88, ${cx} 88, ${cx} ${REDE_Y + 21}`}
          fill="none"
          stroke={TRACO_ACESO}
          strokeWidth={1.5}
          initial={{ pathLength: parado ? 1 : 0, opacity: parado ? 1 : 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: tempo(parado, 0.6), ease: EASE }}
        />
      ))}
    </g>
  );
}

/** O intervalo entre dois vídeos, dito com a única palavra que a cena carrega. */
function Vinte4Horas({ indice, parado }: { indice: number; parado: boolean }) {
  const meio = DIA_X[indice] - 8;
  return (
    <motion.g
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.4), ease: EASE }}
    >
      <path
        d={`M ${meio - 26} 198 h 52`}
        stroke={TRACO}
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
      <text
        x={meio}
        y={190}
        className="font-serif"
        fontSize={22}
        fill={TINTA.apagado}
        textAnchor="middle"
      >
        24h
      </text>
    </motion.g>
  );
}

const GLIFOS = [
  // Impulsionar: a seta para cima do "turbinar".
  'M 0 9 v -18 m -7 7 l 7 -7 l 7 7',
  // Editar por fora: o lápis.
  'M -9 9 l 3 -8 l 9 -9 l 5 5 l -9 9 z',
  // Comprar seguidor: a sacola.
  'M -9 -3 h 18 v 13 h -18 z M -4 -3 a 4 5 0 0 1 8 0',
] as const;

/** Os três atos que quebram a garantia, cada um no seu selo. */
function Atos({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {GLIFOS.map((traco, indice) => (
        <motion.g
          key={traco}
          initial={false}
          animate={{ opacity: visivel ? 1 : 0 }}
          transition={{
            duration: tempo(parado, 0.4),
            ease: EASE,
            delay: tempo(parado, visivel ? indice * 0.18 : 0),
          }}
        >
          <circle
            cx={72 + indice * 60}
            cy={250}
            r={20}
            fill={TINTA.elevado}
            stroke={TINTA.quebra}
            strokeWidth={1.5}
          />
          <g transform={`translate(${72 + indice * 60} 250)`}>
            <path
              d={traco}
              fill="none"
              stroke={TINTA.quebra}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </motion.g>
      ))}
    </g>
  );
}

const ESCUDO = 'M 0 -46 L 38 -30 L 38 6 C 38 32 20 46 0 54 C -20 46 -38 32 -38 6 L -38 -30 Z';
const RACHADURA = 'M 2 -44 l -12 22 l 14 10 l -10 24 l 8 12';

/** O escudo: inteiro enquanto a rotina se cumpre, rachado quando ela quebra. */
function Escudo({ quebrado, parado }: { quebrado: boolean; parado: boolean }) {
  const cor = quebrado ? TINTA.quebra : TINTA.protege;
  return (
    <g transform="translate(348 246) scale(0.92)">
      <motion.path
        d={ESCUDO}
        fill={TINTA.elevado}
        strokeWidth={2.5}
        strokeLinejoin="round"
        initial={{ stroke: cor }}
        animate={{ stroke: cor }}
        transition={{ duration: tempo(parado, 0.4), ease: EASE }}
      />
      {quebrado ? (
        <motion.path
          key="racha"
          d={RACHADURA}
          fill="none"
          stroke={TINTA.quebra}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: parado ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: tempo(parado, 0.5), ease: EASE }}
        />
      ) : (
        <Marca tipo="certo" x={0} y={4} escala={1.4} cor={TINTA.protege} parado={parado} />
      )}
    </g>
  );
}

export default function CenaGarantia() {
  const { fase, parado } = useRoteiro(FASES, CUMPRIDA);
  const publicando = fase >= PRIMEIRO_DIA && fase <= ULTIMO_DIA;
  const diaAtivo = publicando ? fase - PRIMEIRO_DIA : -1;
  const feitos = fase >= CUMPRIDA ? UTEIS : Math.max(0, fase - PRIMEIRO_DIA);

  return (
    <Palco viewBox="0 0 480 300" altura="h-52 sm:h-64">
      <Redes ativo={publicando} />

      {DIA_X.map((_, indice) => (
        <Dia
          key={indice}
          indice={indice}
          ativo={indice === diaAtivo}
          feito={indice < feitos}
          parado={parado}
        />
      ))}

      {publicando && <Envio indice={diaAtivo} parado={parado} />}
      {publicando && diaAtivo > 0 && <Vinte4Horas indice={diaAtivo} parado={parado} />}

      <Atos visivel={fase === QUEBRA} parado={parado} />
      <Escudo quebrado={fase === QUEBRA} parado={parado} />
    </Palco>
  );
}
