/**
 * ─── MINI-CENA DO PASSO: A APROXIMAÇÃO (CL-3) ────────────────────────────────
 *
 * O passo: **o clone é uma aproximação.**
 *
 * A história em uma frase: do seu retrato nasce um retrato PARECIDO — o mesmo
 * desenho, em traço interrompido, honesto sobre o que ele é.
 *
 * O arco: você está no palco, em traço cheio · um traço único sai de você e
 * atravessa · o quadro do clone se completa em TRACEJADO · o par fecha com o
 * visto. Quatro fases, um gesto em cada.
 *
 * ─── AS DECISÕES ─────────────────────────────────────────────────────────────
 *
 * 1. **O tracejado é o argumento inteiro.** É a linguagem que a cena do
 *    capítulo do clone criou: traço interrompido = aproximação, não cópia. Aqui
 *    ele aparece LADO A LADO com o traço cheio, que é o único jeito de a
 *    diferença ser lida — sozinho, um rosto tracejado é só um rosto pontilhado.
 * 2. **O visto não promete perfeição.** Ele fecha o PAR, e não o clone: o que
 *    está certo é a relação entre os dois, que é exatamente o que a regra pede
 *    para a pessoa entender antes do primeiro vídeo.
 * 3. **Nada de morfar um no outro.** Uma transformação animada prometeria
 *    igualdade, e o passo existe para dizer o contrário. Os dois ficam no
 *    palco, um do lado do outro, até o loop recomeçar.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, TracoDeLuz } from '../luz';
import { MiniPalco } from '../itens/comuns';
import { Rosto } from './comuns';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Você · o caminho · o clone se completa · o par e a pausa. */
const FASES = [1500, 1500, 1800, 3600] as const;
const CAMINHO = 1;
const CLONE = 2;
const PAR = 3;

const EIXO = 75;
const ROSTO_Y = 74;

/** A moldura de um retrato no palco. */
interface Caixa {
  readonly x: number;
  readonly y: number;
  readonly largura: number;
  readonly altura: number;
}

const VOCE: Caixa = { x: 28, y: 16, largura: 140, altura: 118 };
const ESPELHO: Caixa = { x: 232, y: 16, largura: 140, altura: 118 };

/** Uma das duas molduras, com o rosto dentro dela. */
interface QuadroProps {
  readonly caixa: Caixa;
  readonly tracejado: boolean;
  readonly aceso: boolean;
  readonly parado: boolean;
}

function Quadro({ caixa, tracejado, aceso, parado }: QuadroProps) {
  const meioX = caixa.x + caixa.largura / 2;
  return (
    <g>
      <Brilho x={meioX} y={ROSTO_Y} raio={112} tinta="luz" aceso={aceso} parado={parado} achatar={0.8} />
      <Painel
        x={caixa.x}
        y={caixa.y}
        largura={caixa.largura}
        altura={caixa.altura}
        cor={aceso ? TRACO_ACESO : TRACO}
        vidro={aceso}
        raio={12}
      />
      {/* O rosto entra por OPACIDADE, e nunca por `pathLength`: o clone é
          tracejado, e framer desenha `pathLength` mexendo no próprio
          `stroke-dasharray` — os dois brigam pelo mesmo atributo e o tracejado
          se perde no meio do caminho. */}
      <motion.g
        initial={{ opacity: parado ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: tempo(parado, 0.9), ease: EASE }}
      >
        <g transform={`translate(${meioX} ${ROSTO_Y})`}>
          <Rosto cor={aceso ? TINTA.branco : TINTA.apagado} tracejado={tracejado} brilho={aceso} />
        </g>
      </motion.g>
    </g>
  );
}

export default function Aproximacao() {
  const { fase, parado } = useRoteiro(FASES, PAR);
  const fechou = fase >= PAR;

  return (
    <MiniPalco fase={fase}>
      <Quadro caixa={VOCE} tracejado={false} aceso parado={parado} />

      {fase >= CAMINHO && (
        <TracoDeLuz
          d={`M 180 ${EIXO} H 222 m -12 -9 l 12 9 l -12 9`}
          cor={TRACO_ACESO}
          largura={2.4}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.8}
        />
      )}

      {fase >= CLONE && <Quadro caixa={ESPELHO} tracejado aceso={fechou} parado={parado} />}

      {fechou && (
        <g>
          <Brilho x={424} y={EIXO} raio={46} tinta="luzCerta" aceso parado={parado} />
          <Marca tipo="certo" x={424} y={EIXO} cor={TINTA.protege} escala={1} parado={parado} />
        </g>
      )}
    </MiniPalco>
  );
}
