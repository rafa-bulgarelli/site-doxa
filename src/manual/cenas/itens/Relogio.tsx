/**
 * ─── MINI-CENA: O RELÓGIO (GA-3) ─────────────────────────────────────────────
 *
 * O item: **24 horas entre um vídeo e o outro.**
 *
 * O primeiro vídeo já está publicado. O ponteiro varre a volta e o arco vai se
 * fechando em cor; enquanto ele não fecha, o segundo vídeo fica travado — o
 * cadeado é o desenho da regra. Fechada a volta, o cadeado sai, o segundo acende
 * em verde e a rotina segue.
 *
 * O que a cena não faz: contar as horas. Um mostrador com doze números viraria
 * papel de parede num desenho de 40 pixels de altura no celular — o arco que
 * fecha diz a mesma coisa e continua legível.
 */
import { Legenda, Marca, TINTA, TRACO } from '../pecas';
import { Brilho, CERTO, Faiscas, TracoDeLuz, useTintas } from '../luz';
import { Cartao, MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

const FASES = [1300, 1300, 1300, 2600] as const;
const FECHOU = 3;

/** Quanto da volta já correu, por fase. */
const VOLTA = [0.08, 0.4, 0.72, 1] as const;

const CENTRO_X = 240;
const CENTRO_Y = 70;
const RAIO = 46;

/** A volta inteira como um caminho — é o `pathLength` dela que conta as horas. */
const ARO = `M ${CENTRO_X} ${CENTRO_Y - RAIO} a ${RAIO} ${RAIO} 0 1 1 -0.1 0`;

/** O mostrador: o aro apagado, o arco aceso e o ponteiro girando. */
function Mostrador({ fracao, parado }: { fracao: number; parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      <circle cx={CENTRO_X} cy={CENTRO_Y} r={RAIO} fill="none" stroke={TINTA.linha} strokeWidth={5} />
      <motion.path
        d={ARO}
        fill="none"
        stroke={tintas('arco')}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: fracao }}
        animate={{ pathLength: fracao }}
        transition={{ duration: tempo(parado, 0.9), ease: EASE }}
      />
      <g transform={`translate(${CENTRO_X} ${CENTRO_Y})`}>
        <motion.g
          animate={parado ? { rotate: 250 } : { rotate: 360 }}
          transition={parado ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: 'linear' }}
        >
          <path d={`M 0 6 V ${-RAIO + 14}`} stroke={TINTA.branco} strokeWidth={2.4} strokeLinecap="round" />
        </motion.g>
        <circle cx={0} cy={0} r={3.4} fill={TINTA.branco} />
      </g>
    </g>
  );
}

/** O cadeado que segura o segundo vídeo até a volta fechar. */
function Cadeado({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visivel ? 1 : 0 }}
      transition={{ duration: tempo(parado, 0.4) }}
    >
      <circle cx={404} cy={75} r={22} fill={TINTA.superficie} stroke={TRACO} strokeWidth={1.5} />
      <g transform="translate(404 75)">
        <TracoDeLuz
          d="M -6 -2 v -4 a 6 6 0 0 1 12 0 v 4 M -9 -2 h 18 v 12 h -18 z"
          cor={TINTA.apagado}
          largura={2}
          halo={2.2}
          parado={parado}
        />
      </g>
    </motion.g>
  );
}

export default function Relogio() {
  const { fase, parado } = useRoteiro(FASES, FECHOU);
  const liberou = fase >= FECHOU;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={78} y={75} raio={70} tinta="luzCerta" aceso parado={parado} />
      <Cartao x={26} y={42} largura={104} altura={66} cor={CERTO} tinta="certo" vidro />

      <Brilho x={CENTRO_X} y={CENTRO_Y} raio={82} tinta="luz" aceso={liberou} parado={parado} />
      <Mostrador fracao={VOLTA[fase]} parado={parado} />
      <Legenda x={CENTRO_X} y={142} corpo={22} tinta="arco">
        24h
      </Legenda>

      <Brilho x={404} y={75} raio={74} tinta="luzCerta" aceso={liberou} parado={parado} />
      <Cartao
        x={352}
        y={42}
        largura={104}
        altura={66}
        cor={liberou ? CERTO : TINTA.linha}
        tinta={liberou ? 'certo' : undefined}
        tracejado={!liberou}
        vidro={liberou}
      />
      <Cadeado visivel={!liberou} parado={parado} />
      {liberou && (
        <>
          <Marca tipo="certo" x={442} y={98} cor={TINTA.protege} escala={0.85} parado={parado} />
          <Faiscas x={404} y={75} raio={62} ativo parado={parado} quantidade={8} cores={[CERTO]} />
        </>
      )}
    </MiniPalco>
  );
}
