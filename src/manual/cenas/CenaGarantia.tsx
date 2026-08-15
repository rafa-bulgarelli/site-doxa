/**
 * ─── CENA: A GARANTIA ────────────────────────────────────────────────────────
 *
 * A lição: **a rotina é que sustenta o direito.**
 *
 * A semana inteira num quadro: um vídeo por dia útil, o mesmo vídeo subindo para
 * as três redes por três fios de luz, vinte e quatro horas entre um e o outro, e
 * o fim de semana livre. Cumprida a semana, o escudo acende inteiro. Aí a cena
 * mostra o outro lado — impulsionar, editar por fora, comprar seguidor — e o
 * escudo racha em vermelho. Fecha voltando ao certo, porque a última coisa que a
 * pessoa vê é a que ela leva para o dia seguinte.
 *
 * ─── A COR AQUI TEM DOIS PAPÉIS, E ELES NÃO SE MISTURAM ──────────────────────
 *
 * O arco Siri (`luz.tsx`) é TÊMPERA: ele pinta os fios que sobem para as redes,
 * o anel de quem está publicando, o "24h". É a energia da rotina acontecendo.
 *
 * Verde e vermelho são GRAMÁTICA: verde é o dia cumprido e o escudo inteiro,
 * vermelho é o ato que quebra e a rachadura. Um diz "isto mantém o seu direito",
 * o outro diz "isto o perde" — e essa distinção não pode depender de o leitor
 * ler nada.
 */
import { motion } from 'framer-motion';
import { Legenda, Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { ARCO, Brilho, CERTO, Faiscas, Poeira, QUEBRA, TracoDeLuz, useTintas } from './luz';
import { EASE, tempo, useRoteiro } from './tempo';

/**
 * A semana chega · cinco dias, um por vez · fim de semana livre · o que quebra
 * · e o conserto, que segura o quadro antes do loop.
 */
const FASES = [1200, 900, 900, 900, 900, 900, 1500, 2200, 2600] as const;
const PRIMEIRO_DIA = 1;
const ULTIMO_DIA = 5;
const CUMPRIDA = 6;
const QUEBRA_FASE = 7;

const UTEIS = 5;
const DIA_X = [44, 116, 188, 260, 332, 404, 476] as const;
const DIA_Y = 118;
const DIA_L = 56;
const DIA_A = 50;

const REDES_X = [200, 280, 360] as const;
const REDE_Y = 42;

const VERDE_FRACO = 'rgba(52,211,153,0.6)';

/** As três redes, no alto: para onde o mesmo vídeo do dia sobe. */
function Redes({ ativo, parado }: { ativo: boolean; parado: boolean }) {
  const cor = ativo ? TRACO_ACESO : TRACO;
  return (
    <g>
      {REDES_X.map((cx, indice) => (
        <g key={cx}>
          {ativo && (
            <Brilho x={cx} y={REDE_Y} raio={46} tinta="luzQuente" aceso parado={parado} />
          )}
          <motion.circle
            cx={cx}
            cy={REDE_Y}
            r={21}
            fill={TINTA.elevado}
            strokeWidth={1.8}
            initial={{ stroke: ativo ? ARCO[indice + 1] : cor }}
            animate={{ stroke: ativo ? ARCO[indice + 1] : cor }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          {indice === 0 && <path d="M 194 34 l 14 8 l -14 8 z" fill={cor} />}
          {indice === 1 && <rect x={272} y={34} width={16} height={16} rx={4.5} fill={cor} />}
          {indice === 2 && (
            <circle cx={360} cy={REDE_Y} r={7.5} fill="none" stroke={cor} strokeWidth={2.8} />
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
    <motion.g initial={false} animate={{ opacity: folga ? 0.45 : 1 }} transition={{ duration: 0.4 }}>
      {feito && (
        <Brilho x={x + DIA_L / 2} y={DIA_Y + DIA_A / 2} raio={46} tinta="luzCerta" aceso parado={parado} />
      )}
      <Painel
        x={x}
        y={DIA_Y}
        largura={DIA_L}
        altura={DIA_A}
        cor={folga ? TINTA.linha : cor}
        tinta={ativo && !folga ? 'arco' : undefined}
        vidro={ativo}
      />
      {/* A peça de vídeo do dia: some no fim de semana, que é folga de verdade. */}
      {!folga && !feito && <path d={`M ${x + 21} ${DIA_Y + 15} l 16 10 l -16 10 z`} fill={cor} />}
      {feito && (
        <Marca
          tipo="certo"
          x={x + DIA_L / 2}
          y={DIA_Y + DIA_A / 2}
          escala={0.85}
          cor={TINTA.protege}
          parado={parado}
        />
      )}
    </motion.g>
  );
}

/** O envio do dia: um vídeo, três destinos, três fios de luz subindo juntos. */
function Envio({ indice, parado }: { indice: number; parado: boolean }) {
  const origem = DIA_X[indice] + DIA_L / 2;
  const tintas = useTintas();
  return (
    <g>
      {REDES_X.map((cx, ordem) => {
        const curva = `M ${origem} ${DIA_Y} C ${origem} 86, ${cx} 86, ${cx} ${REDE_Y + 23}`;
        return (
          <g key={cx}>
            <TracoDeLuz
              d={curva}
              cor={tintas('arco')}
              largura={1.8}
              halo={2.6}
              parado={parado}
              riscando
              duracao={0.7}
              atraso={ordem * 0.08}
            />
            {!parado && (
              <motion.circle
                r={3}
                fill={ARCO[ordem + 1]}
                initial={{ cx: origem, cy: DIA_Y, opacity: 0 }}
                animate={{ cx, cy: REDE_Y + 23, opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: ordem * 0.08, ease: 'easeOut' }}
              />
            )}
          </g>
        );
      })}
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
      <path d={`M ${meio - 30} 200 h 60`} stroke={TRACO} strokeWidth={1.5} strokeDasharray="5 5" />
      <Legenda x={meio} y={192} corpo={24} tinta="arco">
        24h
      </Legenda>
    </motion.g>
  );
}

const GLIFOS = [
  // Impulsionar: a seta para cima do "turbinar".
  'M 0 10 v -20 m -8 8 l 8 -8 l 8 8',
  // Editar por fora: o lápis.
  'M -10 10 l 3 -9 l 10 -10 l 6 6 l -10 10 z',
  // Comprar seguidor: a sacola.
  'M -10 -3 h 20 v 15 h -20 z M -5 -3 a 5 5 0 0 1 10 0',
] as const;

/** Os três atos que quebram a garantia, cada um no seu selo. */
function Atos({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {GLIFOS.map((traco, indice) => {
        const cx = 96 + indice * 74;
        return (
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
            {visivel && <Brilho x={cx} y={252} raio={44} tinta="luzQuebra" aceso parado={parado} />}
            <circle cx={cx} cy={252} r={23} fill={TINTA.elevado} stroke={QUEBRA} strokeWidth={1.6} />
            <g transform={`translate(${cx} 252)`}>
              <TracoDeLuz d={traco} cor={QUEBRA} largura={2.2} halo={2.4} parado={parado} />
            </g>
          </motion.g>
        );
      })}
    </g>
  );
}

const ESCUDO = 'M 0 -50 L 42 -33 L 42 6 C 42 34 22 50 0 58 C -22 50 -42 34 -42 6 L -42 -33 Z';
const RACHADURA = 'M 2 -48 l -13 24 l 15 11 l -11 26 l 9 13';

/** O escudo: aceso enquanto a rotina se cumpre, rachado quando ela quebra. */
function Escudo({ quebrado, parado }: { quebrado: boolean; parado: boolean }) {
  const tintas = useTintas();
  const cor = quebrado ? QUEBRA : CERTO;
  return (
    <g>
      <Brilho
        x={438}
        y={248}
        raio={92}
        tinta={quebrado ? 'luzQuebra' : 'luzCerta'}
        aceso
        parado={parado}
      />
      <g transform="translate(438 248) scale(0.95)">
        <path d={ESCUDO} fill={tintas('vidro')} />
        <TracoDeLuz d={ESCUDO} cor={quebrado ? tintas('errado') : tintas('certo')} largura={2.8} parado={parado} />
        {quebrado ? (
          <TracoDeLuz d={RACHADURA} cor={cor} largura={3} parado={parado} riscando duracao={0.5} />
        ) : (
          <Marca tipo="certo" x={0} y={4} escala={1.6} cor={TINTA.protege} parado={parado} />
        )}
      </g>
      <Faiscas
        x={438}
        y={248}
        raio={78}
        ativo={!quebrado}
        parado={parado}
        quantidade={8}
        cores={[CERTO, ARCO[5]]}
        duracao={2.4}
      />
    </g>
  );
}

export default function CenaGarantia() {
  const { fase, parado } = useRoteiro(FASES, CUMPRIDA);
  const publicando = fase >= PRIMEIRO_DIA && fase <= ULTIMO_DIA;
  const diaAtivo = publicando ? fase - PRIMEIRO_DIA : -1;
  const feitos = fase >= CUMPRIDA ? UTEIS : Math.max(0, fase - PRIMEIRO_DIA);

  return (
    <Palco viewBox="0 0 560 320" altura="h-64 sm:h-80" fase={fase}>
      <Poeira x={60} largura={440} base={310} parado={parado} />
      <Redes ativo={publicando} parado={parado} />

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

      <Atos visivel={fase === QUEBRA_FASE} parado={parado} />
      <Escudo quebrado={fase === QUEBRA_FASE} parado={parado} />
    </Palco>
  );
}
