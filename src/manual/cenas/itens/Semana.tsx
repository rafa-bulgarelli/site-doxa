/**
 * ─── MINI-CENA: A SEMANA (GA-4) ──────────────────────────────────────────────
 *
 * O item: **de segunda a sexta o feed é dos vídeos da DOXA; sábado e domingo
 * são seus.**
 *
 * Os cinco dias úteis acendem com o vídeo do dia. Aí o SEU vídeo aparece e tenta
 * entrar na quarta — e é barrado, em vermelho. Ele desliza para o sábado e é
 * recebido em verde. O mesmo objeto, dois destinos: é o deslize que ensina, não
 * o carimbo.
 *
 * Por que o vídeo que desliza é UM elemento só, e não dois desenhados em fases
 * diferentes: com dois, o cliente vê um sumir e outro aparecer, e a leitura vira
 * "existem dois vídeos". Com um, ele vê o SEU vídeo mudando de lugar.
 */
import { Legenda, Marca, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz, corDoArco } from '../luz';
import { Cartao, MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

const FASES = [1100, 1300, 1800, 2400] as const;
const CHEIA = 1;
const BARRADO = 2;
const LIVRE = 3;

const DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const;
const UTEIS = 5;
const QUARTA = 2;
const SABADO = 5;

const PASSO = 64;
const ESQUERDA = 22;
const LARGURA = 52;
const TOPO = 48;
const ALTURA = 46;

/** O centro do enésimo dia — a única conta de posição desta cena. */
function centroDoDia(indice: number): number {
  return ESQUERDA + indice * PASSO + LARGURA / 2;
}

/** O caminho que o seu vídeo faz da quarta barrada até o sábado livre. */
const DESLIZE = (SABADO - QUARTA) * PASSO;

/** A cor do dia: o fim de semana é traço solto, o dia útil acende no arco. */
function corDoDia(indice: number, cheia: boolean): string {
  if (indice >= UTEIS) return TRACO;
  if (!cheia) return TINTA.linha;
  return corDoArco(indice / (UTEIS - 1));
}

/** Os sete quadros da semana: cinco da DOXA, dois seus. */
function Dias({ cheia, parado }: { cheia: boolean; parado: boolean }) {
  return (
    <g>
      {DIAS.map((letra, indice) => {
        const folga = indice >= UTEIS;
        const cor = corDoDia(indice, cheia);
        return (
          <g key={indice}>
            {cheia && !folga && (
              <Brilho x={centroDoDia(indice)} y={TOPO + 23} raio={40} tinta="luzQuente" aceso parado={parado} />
            )}
            <Cartao
              x={ESQUERDA + indice * PASSO}
              y={TOPO}
              largura={LARGURA}
              altura={ALTURA}
              cor={cor}
              tracejado={folga}
              vidro={cheia && !folga}
            />
            <Legenda
              x={centroDoDia(indice)}
              y={128}
              corpo={18}
              cor={folga ? TINTA.apagado : TRACO_ACESO}
            >
              {letra}
            </Legenda>
          </g>
        );
      })}
    </g>
  );
}

/** O seu vídeo: barrado na quarta, recebido no sábado. */
function SeuVideo({ fase, parado }: { fase: number; parado: boolean }) {
  const aceito = fase >= LIVRE;
  const visivel = fase >= BARRADO;
  const cor = aceito ? CERTO : QUEBRA;
  return (
    /*
     * O lugar de PARTIDA é um `transform` comum, e o framer só carrega o
     * DESLOCAMENTO. Parece detalhe e não é: framer aplica a posição inicial em
     * `style`, e uma posição inicial que não seja zero simplesmente não existe
     * no primeiro desenho — o vídeo nasceria no canto da moldura e voaria até a
     * quarta. Com a quarta no `transform` de fora, o zero já é o lugar certo.
     */
    <g transform={`translate(${centroDoDia(QUARTA)} 0)`}>
      <motion.g
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: aceito ? DESLIZE : 0, opacity: visivel ? 1 : 0 }}
        transition={{ duration: tempo(parado, 0.7), ease: EASE }}
      >
        <rect
          x={-24}
          y={6}
          width={48}
          height={30}
          rx={8}
          fill={TINTA.elevado}
          stroke={cor}
          strokeWidth={1.6}
        />
        <path d="M -6 13 l 13 8 l -13 8 z" fill={cor} />
        <Marca tipo={aceito ? 'certo' : 'errado'} x={0} y={62} cor={cor} escala={0.9} parado={parado} />
      </motion.g>
    </g>
  );
}

export default function Semana() {
  const { fase, parado } = useRoteiro(FASES, LIVRE);

  return (
    <MiniPalco fase={fase}>
      <Dias cheia={fase >= CHEIA} parado={parado} />

      {fase === BARRADO && (
        <g>
          <Brilho x={centroDoDia(QUARTA)} y={TOPO + 23} raio={54} tinta="luzQuebra" aceso parado={parado} />
          <TracoDeLuz
            d={`M ${centroDoDia(QUARTA) - 30} ${TOPO + 46} L ${centroDoDia(QUARTA) + 30} ${TOPO}`}
            cor={QUEBRA}
            largura={2.6}
            halo={2.6}
            parado={parado}
            riscando
            duracao={0.4}
          />
        </g>
      )}

      {fase >= LIVRE && (
        <g>
          <Brilho x={centroDoDia(SABADO)} y={TOPO + 23} raio={54} tinta="luzCerta" aceso parado={parado} />
          <Faiscas
            x={centroDoDia(SABADO)}
            y={TOPO + 23}
            raio={52}
            ativo
            parado={parado}
            quantidade={7}
            cores={[CERTO, ARCO[5]]}
          />
        </g>
      )}

      <SeuVideo fase={fase} parado={parado} />
    </MiniPalco>
  );
}
