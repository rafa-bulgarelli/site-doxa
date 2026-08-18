/**
 * ─── MINI-CENA: SEM IMPULSO (GA-6) ───────────────────────────────────────────
 *
 * O item: **nada de impulsionar, e campanha que já roda tem de ser pausada
 * antes do primeiro vídeo.**
 *
 * O botão de impulsionar pulsa — ele é bonito, ele é a tentação, e a cena deixa
 * isso claro em cor quente antes de cortá-lo. No meio, a campanha que já rodava:
 * um anúncio com a barra de veiculação CORRENDO. Ela para, o símbolo vira pausa
 * e acende em verde — e só então o primeiro vídeo entra limpo.
 *
 * A pausa é VERDE de propósito: pausar não é castigo, é o que mantém o direito.
 * Vermelho fica só para o ato que quebra, que aqui é apertar o botão.
 *
 * ─── O QUE MUDOU NA RODADA DO POLIMENTO ──────────────────────────────────────
 *
 * O veredito do dono foi "ideia boa, simples demais; o 'pause com flechinha'
 * não faz sentido". E não fazia mesmo: no lugar da campanha havia um selo com
 * duas barrinhas — o símbolo de pausa de um controle de vídeo, parado desde o
 * primeiro quadro — e, ao lado dele, uma seta solta apontando para o vídeo, sem
 * nada de onde sair.
 *
 * O conserto é mostrar a campanha, e não o botão de um tocador:
 *
 * 1. **A campanha é um ANÚNCIO**: um cartão com o símbolo à esquerda, duas
 *    linhas de texto e a barra de veiculação embaixo.
 * 2. **A barra CORRE.** É ela que diz "está no ar agora" — pausa é um estado, e
 *    estado só se enxerga contra o movimento que ele interrompe.
 * 3. **O símbolo é uma PASSAGEM**: play quente enquanto roda, pausa verde
 *    quando para, em cross-fade. A pausa deixa de ser um desenho e vira um
 *    ato — que é o que a regra cobra.
 * 4. **A flechinha saiu.** A ordem de leitura já é da esquerda para a direita, e
 *    o vídeo que acende sozinho depois da barra parar diz a consequência sem
 *    precisar de uma seta apontando o caminho.
 */
import { Marca, Painel, TINTA, TRACO } from '../pecas';
import { ARCO, Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz } from '../luz';
import { FechoDoArco } from '../fecho';
import { Cartao, MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

const FASES = [1500, 1500, 1500, 2400] as const;
const CORTADO = 1;
const PAUSADA = 2;
const LIMPO = 3;

/**
 * A fileira dos três: o botão, a campanha e o vídeo.
 *
 * Ela desceu seis unidades nesta rodada. Os três objetos vivem numa faixa só, e
 * com a faixa em 40 o palco ficava com uma tira morta de 40 unidades embaixo —
 * o desenho inteiro encostado no topo. Agora o meio da fileira (78) fica a um
 * fio do meio do palco (75), e o visto embaixo do vídeo ocupa a sobra.
 */
const BOTAO_X = 28;
const BOTAO_Y = 50;
const BOTAO_L = 148;
const BOTAO_A = 56;
const BOTAO_MEIO = BOTAO_Y + BOTAO_A / 2;

/** O cartão da campanha, no meio do palco: 20 de folga para cada vizinho. */
const ANUNCIO = { x: 196, y: 44, largura: 112, altura: 68 } as const;
const SIMBOLO_X = ANUNCIO.x + 26;
const SIMBOLO_Y = ANUNCIO.y + 30;

/**
 * A barra de veiculação.
 *
 * `CORRIDA` é longa de propósito: a campanha pausa por volta dos três segundos
 * de cena, e uma volta de 5,6s deixa a barra perto de 55% nesse instante — que
 * é onde ela congela. A barra para ONDE estava; se o alvo da pausa fosse outro,
 * o congelamento viraria um pulinho para trás bem no gesto que a cena ensina.
 */
const TRILHO = { x: ANUNCIO.x + 14, y: ANUNCIO.y + 52, largura: 84, altura: 6 } as const;
const CORRIDA = 5.6;
const PAROU_EM = 0.55;

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

/** O play e a pausa no mesmo lugar: um sai enquanto o outro entra. */
function Simbolo({ pausada, parado }: { pausada: boolean; parado: boolean }) {
  const passagem = { duration: tempo(parado, 0.45), ease: EASE } as const;
  return (
    <g transform={`translate(${SIMBOLO_X} ${SIMBOLO_Y})`}>
      <motion.path
        d="M -7 -11 L 11 0 L -7 11 Z"
        fill={ARCO[0]}
        initial={{ opacity: parado && !pausada ? 1 : 0 }}
        animate={{ opacity: pausada ? 0 : 1 }}
        transition={passagem}
      />
      <motion.g
        initial={{ opacity: parado && pausada ? 1 : 0 }}
        animate={{ opacity: pausada ? 1 : 0 }}
        transition={passagem}
      >
        <rect x={-9} y={-11} width={6} height={22} rx={3} fill={CERTO} />
        <rect x={3} y={-11} width={6} height={22} rx={3} fill={CERTO} />
      </motion.g>
    </g>
  );
}

/** A barra de veiculação: corre enquanto a campanha roda, congela ao pausar. */
function Veiculacao({ pausada, parado }: { pausada: boolean; parado: boolean }) {
  const correndo = !pausada && !parado;
  const congelada = TRILHO.largura * PAROU_EM;
  return (
    <g>
      <rect
        x={TRILHO.x}
        y={TRILHO.y}
        width={TRILHO.largura}
        height={TRILHO.altura}
        rx={TRILHO.altura / 2}
        fill={TINTA.linha}
      />
      <motion.rect
        x={TRILHO.x}
        y={TRILHO.y}
        height={TRILHO.altura}
        rx={TRILHO.altura / 2}
        fill={pausada ? CERTO : ARCO[0]}
        initial={{ width: parado ? congelada : 0 }}
        animate={correndo ? { width: [0, TRILHO.largura] } : { width: congelada }}
        transition={
          correndo
            ? { duration: CORRIDA, repeat: Infinity, ease: 'linear' }
            : { duration: tempo(parado, 0.4), ease: EASE }
        }
      />
    </g>
  );
}

/** A campanha que já rodava: pausar é o gesto certo, então ele é verde. */
function Campanha({ pausada, parado }: { pausada: boolean; parado: boolean }) {
  const cor = pausada ? CERTO : ARCO[0];
  return (
    <g>
      <Brilho
        x={ANUNCIO.x + ANUNCIO.largura / 2}
        y={BOTAO_MEIO}
        raio={62}
        tinta="luzCerta"
        aceso={pausada}
        parado={parado}
      />
      <Painel {...ANUNCIO} cor={cor} tinta={pausada ? 'certo' : undefined} vidro={pausada} raio={12} />
      <Simbolo pausada={pausada} parado={parado} />
      {/* As duas linhas do anúncio: é texto sem texto, o mesmo recurso da `Barra`. */}
      <rect x={SIMBOLO_X + 24} y={SIMBOLO_Y - 11} width={52} height={6} rx={3} fill={TRACO} />
      <rect x={SIMBOLO_X + 24} y={SIMBOLO_Y + 1} width={34} height={6} rx={3} fill={TINTA.linha} />
      <Veiculacao pausada={pausada} parado={parado} />
    </g>
  );
}

/** O primeiro vídeo do plano, que só entra depois da campanha parada. */
function PrimeiroVideo({ limpo, parado }: { limpo: boolean; parado: boolean }) {
  return (
    <g>
      <Brilho x={388} y={BOTAO_MEIO} raio={74} tinta="luzCerta" aceso={limpo} parado={parado} />
      <Cartao
        x={330}
        y={48}
        largura={118}
        altura={60}
        cor={limpo ? CERTO : TINTA.linha}
        tinta={limpo ? 'certo' : undefined}
        tracejado={!limpo}
        vidro={limpo}
      />
      {limpo && (
        <g>
          <Marca tipo="certo" x={438} y={122} cor={TINTA.protege} escala={0.85} parado={parado} />
          {/* Embaixo do CARTÃO, não do visto: o carimbo desta cena mora na quina
              do palco e não tem chão sobrando. O que deu certo é o primeiro
              vídeo entrar limpo, e é ele que o degradê sublinha. */}
          <FechoDoArco x={389} y={112} escala={0.9} parado={parado} />
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
