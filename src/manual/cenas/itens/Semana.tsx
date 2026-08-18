/**
 * ─── MINI-CENA: A SEMANA (GA-4) ──────────────────────────────────────────────
 *
 * O item: **de segunda a sexta o feed é dos vídeos da DOXA; sábado e domingo
 * são seus.**
 *
 * A semana começa vazia, com os sete lugares marcados. A segunda é cumprida, a
 * terça também — e a quarta passa em branco: o lugar fica vazio e leva o xis
 * vermelho, que é o dia perdido. A rotina retoma na quinta e na sexta, e o
 * quadro final é a semana inteira legível: **seg✓ ter✓ qua✗ qui✓ sex✓**, com
 * sábado e domingo sem vídeo nenhum.
 *
 * ─── POR QUE ESTA HISTÓRIA, E NÃO A ANTERIOR ─────────────────────────────────
 *
 * A primeira versão contava outra coisa: o SEU vídeo tentava entrar na quarta,
 * era barrado em vermelho e deslizava para o sábado. O dono cortou a história —
 * ela ensinava um remanejamento que não existe, e o fim de semana aparecia como
 * destino de vídeo justamente no item que diz que fim de semana é folga.
 *
 * O que ficou de lá foi a QUALIDADE do movimento, que ele elogiou: os dias
 * entram um a um, o veredito se desenha em vez de aparecer pronto, e a cor só
 * entra onde ela significa alguma coisa.
 *
 * ─── AS TRÊS DECISÕES DO DESENHO ─────────────────────────────────────────────
 *
 * 1. **Vazio é ausência de VÍDEO, não ausência de lugar.** O dia por fazer, o
 *    dia perdido e a folga são todos o mesmo lugar tracejado; o que os separa é
 *    o que está dentro (o play) e o veredito embaixo. Apagar o lugar do fim de
 *    semana deixaria a semana com cinco casas, e a regra fala de sete dias.
 *
 * 2. **Três estados, três leituras de cor.** Cumprido pega a cor do arco (é a
 *    têmpera da cena), perdido é o único vermelho, folga é cinza e mais apagada
 *    que todo o resto — nem certo, nem errado: seu.
 *
 * 3. **O veredito mora FORA do cartão.** Um visto de 10 pixels dentro de um
 *    cartão de 52 ficaria afogado, que é o defeito que o dono nomeou duas
 *    vezes em outras cenas. Ele fica na faixa de baixo, entre o cartão e a
 *    letra do dia, com folga dos dois.
 */
import { Legenda, Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, corDoArco } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

/** A semana por fazer · seg e ter · a quarta perdida · qui e sex · o quadro. */
const FASES = [1100, 1400, 1600, 1400, 2600] as const;
const COMECOU = 1;
const PERDEU = 2;
const RETOMOU = 3;
const SEMANA = 4;

const DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const;
/** Os cinco primeiros são os dias úteis; do quinto em diante é folga. */
const UTEIS = 5;
const QUARTA = 2;
const SEXTA = 4;

const PASSO = 64;
const ESQUERDA = 22;
const LARGURA = 52;
const TOPO = 28;
const ALTURA = 46;
/**
 * A faixa do veredito e a faixa da letra — cada uma com o seu respiro.
 *
 * A letra desceu de 134 para 138 para abrir a faixa do fecho: entre o visto da
 * sexta e a letra dela passou a correr o degradê, e com 134 ele encostava nos
 * dois. Sobram 12 até a borda de baixo do palco, e nenhuma das sete letras
 * (S T Q Q S S D) tem perna que desça.
 */
const MARCA_Y = 97;
const LETRA_Y = 138;

/** O centro do enésimo dia — a única conta de posição desta cena. */
function centroDoDia(indice: number): number {
  return ESQUERDA + indice * PASSO + LARGURA / 2;
}

/** O play do dia cumprido, desenhado no centro do cartão daquele dia. */
function playDoDia(indice: number): string {
  const meioX = centroDoDia(indice);
  const meioY = TOPO + ALTURA / 2;
  const lado = ALTURA * 0.3;
  return `M ${meioX - lado * 0.5} ${meioY - lado} l ${lado * 1.5} ${lado} l ${-lado * 1.5} ${lado} z`;
}

/** O que aconteceu num dia: ainda nada, o vídeo saiu, o dia passou, é folga. */
type EstadoDoDia = 'espera' | 'cumprido' | 'perdido' | 'folga';

/**
 * O estado de cada dia na fase da vez — a narrativa inteira mora nesta função.
 *
 * Segunda e terça entram juntas, a quarta NUNCA vira cumprida (é o dia que se
 * perde), quinta e sexta retomam, e o fim de semana é folga em toda fase.
 */
function estadoDoDia(indice: number, fase: number): EstadoDoDia {
  if (indice >= UTEIS) return 'folga';
  if (indice === QUARTA) return fase >= PERDEU ? 'perdido' : 'espera';
  const entrou = indice < QUARTA ? COMECOU : RETOMOU;
  return fase >= entrou ? 'cumprido' : 'espera';
}

/**
 * A tinta do LUGAR: o arco para o dia cumprido, cinza para todo o resto.
 *
 * O dia perdido também fica cinza, e isso foi uma correção olhando o quadro
 * pronto: com a borda vermelha, ele ficava do lado da terça, que o arco pinta
 * de coral — dois vermelhos vizinhos, um significando "errado" e o outro não
 * significando nada. O vermelho desta cena é UM só, e é o xis embaixo da
 * quarta; o lugar vazio é o que ele julga, e lugar vazio é cinza.
 */
function corDoDia(indice: number, estado: EstadoDoDia): string {
  if (estado === 'cumprido') return corDoArco(indice / (UTEIS - 1));
  return TRACO;
}

interface DiaProps {
  readonly indice: number;
  readonly letra: string;
  readonly estado: EstadoDoDia;
  readonly parado: boolean;
}

/** Um dia da semana: o lugar, o vídeo (ou a falta dele), o veredito e a letra. */
function Dia({ indice, letra, estado, parado }: DiaProps) {
  const cumprido = estado === 'cumprido';
  const perdido = estado === 'perdido';
  const folga = estado === 'folga';
  const cor = corDoDia(indice, estado);
  const meio = centroDoDia(indice);
  return (
    // A folga é o mesmo desenho, mais apagado: ela não é um erro nem um acerto,
    // e qualquer cor ali seria cor sem significado.
    <g opacity={folga ? 0.5 : 1}>
      <Brilho
        x={meio}
        y={TOPO + ALTURA / 2}
        raio={38}
        tinta={perdido ? 'luzQuebra' : 'luzQuente'}
        aceso={cumprido || perdido}
        parado={parado}
      />
      <Painel
        x={ESQUERDA + indice * PASSO}
        y={TOPO}
        largura={LARGURA}
        altura={ALTURA}
        cor={cor}
        tracejado={!cumprido}
        vidro={cumprido}
        raio={10}
      />
      <motion.g
        initial={{ opacity: parado && cumprido ? 1 : 0 }}
        animate={{ opacity: cumprido ? 1 : 0 }}
        transition={{ duration: tempo(parado, 0.45), ease: EASE }}
      >
        <path d={playDoDia(indice)} fill={cor} />
      </motion.g>
      {cumprido && (
        <Marca tipo="certo" x={meio} y={MARCA_Y} cor={TINTA.protege} escala={0.7} parado={parado} />
      )}
      {perdido && (
        <Marca tipo="errado" x={meio} y={MARCA_Y} cor={QUEBRA} escala={0.7} parado={parado} />
      )}
      <Legenda x={meio} y={LETRA_Y} corpo={18} cor={folga ? TINTA.apagado : TRACO_ACESO}>
        {letra}
      </Legenda>
    </g>
  );
}

export default function Semana() {
  const { fase, parado } = useRoteiro(FASES, SEMANA);

  return (
    <MiniPalco fase={fase}>
      {DIAS.map((letra, indice) => (
        <Dia
          key={indice}
          indice={indice}
          letra={letra}
          estado={estadoDoDia(indice, fase)}
          parado={parado}
        />
      ))}

      {/*
       * As faíscas marcam o instante em que a rotina VOLTA, e só ele: o quadro
       * final é a semana para ler, e leitura com faísca em cima vira festa.
       */}
      {fase === RETOMOU && (
        <Faiscas
          x={centroDoDia(SEXTA)}
          y={TOPO + ALTURA / 2}
          raio={48}
          ativo
          parado={parado}
          quantidade={6}
          cores={[CERTO, ARCO[5]]}
        />
      )}

      {/*
       * O fecho sublinha a SEXTA, e não a semana inteira: o quadro final desta
       * cena tem um xis no meio dele — a quarta perdida —, e um degradê correndo
       * por baixo dos sete diria "deu tudo certo" por cima de um dia que não
       * deu. Embaixo da sexta ele diz o que de fato aconteceu: a rotina voltou e
       * fechou a semana.
       */}
      {fase >= SEMANA && (
        <FechoDoArco x={centroDoDia(SEXTA)} y={MARCA_Y + 10} escala={0.62} parado={parado} />
      )}
    </MiniPalco>
  );
}
