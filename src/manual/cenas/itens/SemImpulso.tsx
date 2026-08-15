/**
 * ─── MINI-CENA: SEM IMPULSO (GA-6) ───────────────────────────────────────────
 *
 * O item: **nada de impulsionar, e campanha que já roda tem de ser pausada
 * antes do primeiro vídeo.**
 *
 * O botão de impulsionar pulsa — ele é bonito, ele é a tentação, e a cena deixa
 * isso claro em cor quente antes de cortá-lo. Depois a campanha que já rodava
 * pausa, e o primeiro vídeo entra limpo.
 *
 * A pausa é VERDE de propósito: pausar não é castigo, é o que mantém o direito.
 * Vermelho fica só para o ato que quebra, que aqui é apertar o botão.
 */
import { Marca, TINTA, TRACO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz } from '../luz';
import { Cartao, MiniPalco, Selo } from './comuns';
import { motion } from 'framer-motion';
import { useRoteiro } from '../tempo';

const FASES = [1500, 1500, 1500, 2400] as const;
const CORTADO = 1;
const PAUSADA = 2;
const LIMPO = 3;

const BOTAO_X = 30;
const BOTAO_Y = 48;
const BOTAO_L = 152;
const BOTAO_A = 54;
const BOTAO_MEIO = BOTAO_Y + BOTAO_A / 2;

/** O botão de impulsionar: a seta, as duas linhas do rótulo e o pulso. */
function Botao({ cortado, parado }: { cortado: boolean; parado: boolean }) {
  const cor = cortado ? QUEBRA : ARCO[0];
  return (
    <motion.g
      initial={false}
      animate={parado || cortado ? { opacity: 1 } : { opacity: [0.72, 1, 0.72] }}
      transition={{ duration: 1.8, repeat: parado || cortado ? 0 : Infinity, ease: 'easeInOut' }}
    >
      <rect
        x={BOTAO_X}
        y={BOTAO_Y}
        width={BOTAO_L}
        height={BOTAO_A}
        rx={16}
        fill={TINTA.elevado}
        stroke={cor}
        strokeWidth={1.8}
      />
      <g transform={`translate(${BOTAO_X + 34} ${BOTAO_MEIO})`}>
        <TracoDeLuz d="M 0 12 v -22 m -9 9 l 9 -9 l 9 9" cor={cor} largura={2.4} halo={2.6} parado={parado} />
      </g>
      <rect x={BOTAO_X + 60} y={BOTAO_MEIO - 9} width={68} height={6} rx={3} fill={cor} />
      <rect x={BOTAO_X + 60} y={BOTAO_MEIO + 3} width={44} height={6} rx={3} fill={TRACO} />
    </motion.g>
  );
}

/** A campanha que já rodava: pausar é o gesto certo, então ele é verde. */
function Campanha({ pausada, parado }: { pausada: boolean; parado: boolean }) {
  const cor = pausada ? CERTO : TINTA.linha;
  return (
    <g>
      <Brilho x={244} y={BOTAO_MEIO} raio={54} tinta="luzCerta" aceso={pausada} parado={parado} />
      <Selo
        x={244}
        y={BOTAO_MEIO}
        glifo="M -5 -10 v 20 M 5 -10 v 20"
        cor={cor}
        raio={24}
        parado={parado}
      />
      <TracoDeLuz
        d="M 278 75 h 32 m -11 -8 l 11 8 l -11 8"
        cor={cor}
        largura={1.8}
        halo={2.4}
        parado={parado}
      />
    </g>
  );
}

/** O primeiro vídeo do plano, que só entra depois da campanha parada. */
function PrimeiroVideo({ limpo, parado }: { limpo: boolean; parado: boolean }) {
  return (
    <g>
      <Brilho x={388} y={BOTAO_MEIO} raio={78} tinta="luzCerta" aceso={limpo} parado={parado} />
      <Cartao
        x={330}
        y={44}
        largura={116}
        altura={62}
        cor={limpo ? CERTO : TINTA.linha}
        tinta={limpo ? 'certo' : undefined}
        tracejado={!limpo}
        vidro={limpo}
      />
      {limpo && (
        <g>
          <Marca tipo="certo" x={436} y={116} cor={TINTA.protege} escala={0.85} parado={parado} />
          <Faiscas
            x={388}
            y={BOTAO_MEIO}
            raio={64}
            ativo
            parado={parado}
            quantidade={7}
            cores={[CERTO]}
          />
        </g>
      )}
    </g>
  );
}

export default function SemImpulso() {
  const { fase, parado } = useRoteiro(FASES, LIMPO);
  const cortado = fase >= CORTADO;
  const pausada = fase >= PAUSADA;
  const limpo = fase >= LIMPO;

  return (
    <MiniPalco fase={fase}>
      <Brilho
        x={BOTAO_X + BOTAO_L / 2}
        y={BOTAO_MEIO}
        raio={104}
        tinta={cortado ? 'luzQuebra' : 'luzQuente'}
        aceso
        parado={parado}
        achatar={0.6}
      />
      <Botao cortado={cortado} parado={parado} />

      {cortado && (
        <TracoDeLuz
          d={`M ${BOTAO_X + 10} ${BOTAO_Y + BOTAO_A + 8} L ${BOTAO_X + BOTAO_L - 10} ${BOTAO_Y - 8}`}
          cor={QUEBRA}
          largura={3}
          halo={2.6}
          parado={parado}
          riscando
          duracao={0.4}
        />
      )}

      <Campanha pausada={pausada} parado={parado} />
      <PrimeiroVideo limpo={limpo} parado={parado} />
    </MiniPalco>
  );
}
