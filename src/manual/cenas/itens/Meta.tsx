/**
 * ─── MINI-CENA: A META (GA-1) ────────────────────────────────────────────────
 *
 * O item: **1 milhão de visualizações somadas, em 90 dias, nas três redes.**
 *
 * O contador sobe. As barras crescem junto, as três redes acendem uma a uma, e
 * o número fecha em 1M com o visto. A soma é o ponto: nenhuma rede sozinha
 * precisa chegar lá — é o total que conta, e é por isso que os três anéis
 * apontam para o MESMO número.
 */
import { Legenda, Marca, TINTA } from '../pecas';
import { ARCO, Brilho, Faiscas, TracoDeLuz, corDoArco, useTintas } from '../luz';
import { MiniPalco, Sinal, TRES_REDES } from './comuns';
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
const REDE_Y = [34, 75, 116] as const;

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
            duration: tempo(parado, 0.6),
            ease: EASE,
            delay: tempo(parado, indice * 0.06),
          }}
        />
      ))}
    </g>
  );
}

/** Os três anéis somando no mesmo número. */
function Redes({ acesas, parado }: { acesas: number; parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      {TRES_REDES.map((rede, indice) => {
        const acesa = indice < acesas;
        const cy = REDE_Y[indice];
        return (
          <g key={rede}>
            {acesa && (
              <TracoDeLuz
                d={`M 396 ${cy} C 360 ${cy}, 350 76, 322 76`}
                cor={tintas('arco')}
                largura={1.6}
                halo={2.6}
                parado={parado}
                riscando
                duracao={0.6}
                atraso={indice * 0.12}
              />
            )}
            <Sinal
              rede={rede}
              cx={418}
              cy={cy}
              raio={18}
              cor={acesa ? ARCO[indice + 2] : TINTA.linha}
            />
          </g>
        );
      })}
    </g>
  );
}

export default function Meta() {
  const { fase, parado } = useRoteiro(FASES, VISTO);

  return (
    <MiniPalco fase={fase}>
      <Barras fase={fase} parado={parado} />
      <Legenda x={102} y={143} corpo={17}>
        90 dias
      </Legenda>

      <Brilho x={264} y={70} raio={92} tinta="luz" aceso={fase >= CHEIO} parado={parado} />
      <Legenda x={264} y={90} corpo={54} tinta="arco">
        {VALORES[fase]}
      </Legenda>
      <Faiscas x={264} y={70} raio={78} ativo={fase === CHEIO} parado={parado} quantidade={9} />

      <Redes acesas={REDES_ACESAS[fase]} parado={parado} />

      {fase === VISTO && (
        <g>
          <Brilho x={264} y={126} raio={40} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={264} y={126} cor={TINTA.protege} escala={0.95} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
