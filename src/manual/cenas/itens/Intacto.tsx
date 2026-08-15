/**
 * ─── MINI-CENA: INTACTO (GA-5) ───────────────────────────────────────────────
 *
 * O item: **o vídeo vai no ar exatamente como foi entregue.**
 *
 * O arquivo sai da DOXA e chega publicado do outro lado — e o sinal de igual
 * entre os dois é a regra inteira. Aí a tesoura, a música e a marca d'água
 * tentam encostar, e as três são recusadas em vermelho.
 *
 * O igual acende ANTES das ferramentas aparecerem de propósito: primeiro a
 * pessoa vê o que é para acontecer, depois o que não é. Na ordem contrária, a
 * cena vira uma lista de proibições, e proibição sem promessa não convence
 * ninguém.
 */
import { Marca, TINTA } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz } from '../luz';
import { Cartao, MiniPalco, Selo } from './comuns';
import { motion } from 'framer-motion';
import { tempo, useRoteiro } from '../tempo';

const FASES = [1200, 1500, 1800, 2400] as const;
const IGUAL = 1;
const TENTAM = 2;
const INTACTO = 3;

/** A tesoura, a música e a marca d'água: os três jeitos de encostar no vídeo. */
const FERRAMENTAS = [
  {
    x: 168,
    glifo: 'M -9 -10 L 7 7 M 9 -10 L -7 7 M -9 10 a 3.2 3.2 0 1 0 0.1 0 M 9 10 a 3.2 3.2 0 1 0 0.1 0',
  },
  { x: 240, glifo: 'M -4 8 v -17 l 13 -3 v 17 M -4 8 a 4 3.2 0 1 0 0.1 0 M 9 5 a 4 3.2 0 1 0 0.1 0' },
  { x: 312, glifo: 'M -9 -9 h 18 v 18 h -18 z M 1 1 h 6 v 6 h -6 z' },
] as const;

interface RecusadasProps {
  readonly visivel: boolean;
  /** Depois do veredito elas continuam na tela, mas fracas: já foram negadas. */
  readonly esmaecendo: boolean;
  readonly parado: boolean;
}

/** As três recusadas, cada uma com o seu corte. */
function Recusadas({ visivel, esmaecendo, parado }: RecusadasProps) {
  const forca = esmaecendo ? 0.3 : 1;
  return (
    <g>
      {FERRAMENTAS.map(({ x, glifo }, indice) => (
        <motion.g
          key={x}
          initial={false}
          animate={{ opacity: visivel ? forca : 0, y: visivel ? 0 : -12 }}
          transition={{ duration: tempo(parado, 0.45), delay: tempo(parado, indice * 0.12) }}
        >
          <Selo x={x} y={30} glifo={glifo} cor={QUEBRA} raio={22} parado={parado} />
          <TracoDeLuz
            d={`M ${x - 20} ${48} L ${x + 20} ${12}`}
            cor={QUEBRA}
            largura={2.4}
            halo={2.4}
            parado={parado}
          />
        </motion.g>
      ))}
    </g>
  );
}

/**
 * O caminho do arquivo: seta, igual, seta.
 *
 * O igual é DESENHADO, e não escrito: em serifa, num corpo que caiba entre as
 * duas setas, o glifo "=" vira dois fiapos de dois pixels.
 */
function Trilho({ publicou, parado }: { publicou: boolean; parado: boolean }) {
  return (
    <g>
      {publicou && (
        <TracoDeLuz
          d="M 142 84 h 48 m -14 -9 l 14 9 l -14 9"
          cor={ARCO[3]}
          largura={2}
          halo={2.4}
          parado={parado}
          riscando
          duracao={0.6}
        />
      )}
      <motion.g
        initial={false}
        animate={{ opacity: publicou ? 1 : 0.25 }}
        transition={{ duration: tempo(parado, 0.5) }}
      >
        <rect x={218} y={76} width={44} height={7} rx={3.5} fill={ARCO[1]} />
        <rect x={218} y={92} width={44} height={7} rx={3.5} fill={ARCO[4]} />
      </motion.g>
      {publicou && (
        <TracoDeLuz
          d="M 290 84 h 48 m -14 -9 l 14 9 l -14 9"
          cor={ARCO[4]}
          largura={2}
          halo={2.4}
          parado={parado}
          riscando
          duracao={0.6}
          atraso={0.2}
        />
      )}
    </g>
  );
}

export default function Intacto() {
  const { fase, parado } = useRoteiro(FASES, INTACTO);
  const publicou = fase >= IGUAL;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={78} y={92} raio={72} tinta="luzQuente" aceso parado={parado} />
      <Cartao x={26} y={62} largura={104} altura={62} cor={ARCO[0]} tinta="arco" vidro />

      <Trilho publicou={publicou} parado={parado} />

      <Brilho x={402} y={92} raio={76} tinta="luzCerta" aceso={fase >= INTACTO} parado={parado} />
      <Cartao
        x={350}
        y={62}
        largura={104}
        altura={62}
        cor={fase >= INTACTO ? CERTO : TINTA.linha}
        tinta={fase >= INTACTO ? 'certo' : undefined}
        vidro={publicou}
      />

      <Recusadas visivel={fase >= TENTAM} esmaecendo={fase >= INTACTO} parado={parado} />

      {fase >= INTACTO && (
        <g>
          <Marca tipo="certo" x={440} y={116} cor={TINTA.protege} escala={0.85} parado={parado} />
          <Faiscas x={402} y={92} raio={62} ativo parado={parado} quantidade={7} cores={[CERTO]} />
        </g>
      )}
    </MiniPalco>
  );
}
