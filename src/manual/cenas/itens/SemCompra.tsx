/**
 * ─── MINI-CENA: SEM COMPRA (GA-7) ────────────────────────────────────────────
 *
 * O item: **nada de curtida, seguidor ou visualização comprada.**
 *
 * A chuva de coraçõezinhos cai bonita e se desmancha antes de encostar em
 * qualquer coisa — número comprado não vira audiência, vira ruído que o
 * algoritmo desconta depois. Do lado direito, a linha do crescimento REAL segue
 * subindo, indiferente à chuva.
 *
 * As duas coisas acontecem na MESMA tela de propósito: a lição não é "não
 * compre", é "o que você compraria não muda a linha que importa".
 */
import { Marca, TINTA } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz } from '../luz';
import { MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1400, 1500, 1600, 2400] as const;
const CHUVA = 1;
const DESMANCHA = 2;
const FIRME = 3;

/** O coração comprado: bonito, e sempre a caminho do chão. */
const CORACAO = 'M 0 8 C -10 -1 -8 -11 0 -5 C 8 -11 10 -1 0 8 z';

/** Onde cada um cai — espalhados à mão, porque aleatório não recomeça igual. */
const GOTAS = [
  { x: 64, atraso: 0 },
  { x: 118, atraso: 0.45 },
  { x: 172, atraso: 0.9 },
  { x: 226, atraso: 0.25 },
  { x: 280, atraso: 1.2 },
  { x: 334, atraso: 1.6 },
] as const;

/** A linha do crescimento de verdade: sobe em degraus e não olha para a chuva. */
const LINHA = 'M 40 128 L 110 118 L 180 106 L 250 86 L 320 62 L 396 36';
const VERTICES = [
  [40, 128],
  [110, 118],
  [180, 106],
  [250, 86],
  [320, 62],
  [396, 36],
] as const;

/** A chuva de falsos: cai, some antes de encostar, e recomeça. */
function Chuva({ ativa, parado }: { ativa: boolean; parado: boolean }) {
  if (!ativa || parado) return null;
  return (
    <g>
      {GOTAS.map(({ x, atraso }) => (
        <motion.g
          key={x}
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: [-22, 46], opacity: [0, 0.9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: atraso, ease: 'easeIn' }}
        >
          <g transform={`translate(${x} 30)`}>
            <path d={CORACAO} fill={QUEBRA} />
          </g>
        </motion.g>
      ))}
    </g>
  );
}

export default function SemCompra() {
  const { fase, parado } = useRoteiro(FASES, FIRME);
  const chovendo = fase === CHUVA || fase === DESMANCHA;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={200} y={40} raio={150} tinta="luzQuebra" aceso={chovendo} parado={parado} achatar={0.45} />
      <Chuva ativa={chovendo} parado={parado} />

      {/* O X fica só na fase em que a chuva se desmancha: um xis pairando sobre
          nada, na fase seguinte, viraria uma reprovação sem réu. */}
      {fase === DESMANCHA && (
        <Marca tipo="errado" x={200} y={44} cor={QUEBRA} escala={1.3} parado={parado} />
      )}

      <Brilho x={240} y={86} raio={180} tinta="luz" aceso={fase >= FIRME} parado={parado} achatar={0.5} />
      <TracoDeLuz
        d={LINHA}
        cor={ARCO[4]}
        largura={2.6}
        halo={3}
        parado={parado}
        riscando
        duracao={1.1}
      />
      {VERTICES.map(([cx, cy], indice) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={cy}
          r={3.4}
          fill={ARCO[indice % ARCO.length]}
          initial={{ opacity: parado ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: tempo(parado, 0.3), delay: tempo(parado, indice * 0.14) }}
        />
      ))}

      {fase >= FIRME && (
        <g>
          <Brilho x={440} y={78} raio={48} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={440} y={78} cor={TINTA.protege} escala={1.05} parado={parado} />
          <Faiscas x={396} y={36} raio={54} ativo parado={parado} quantidade={7} cores={[CERTO, ARCO[5]]} />
        </g>
      )}
    </MiniPalco>
  );
}
