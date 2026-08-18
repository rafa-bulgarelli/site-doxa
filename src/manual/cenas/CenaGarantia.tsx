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
 *
 * ─── O QUE A REVISÃO DO DONO DERRUBOU DESTA CENA ─────────────────────────────
 *
 * A história passou; a execução não. Foram três defeitos nomeados, e os três
 * eram a mesma doença — desenho gritando no lugar de hierarquia:
 *
 * 1. **"Quadrado verde sem significado".** O dia cumprido pintava a BORDA de
 *    verde e ainda soltava um halo verde do tamanho da caixa. Quem julga o dia
 *    é o VISTO; a caixa é só onde ele mora. Agora a caixa cumprida volta ao
 *    traço comum e o verde fica no visto e no clarão curto atrás dele — o mesmo
 *    verde, num lugar só, valendo mais.
 * 2. **"Ícone afogado no círculo cinza".** As redes eram glifos genéricos
 *    dentro de um `circle` r=21, e o círculo enforcava o desenho. Saíram os
 *    três: no lugar entram os ícones REAIS de `redes.tsx`, soltos, com 100 de
 *    distância entre um e outro em vez de 80.
 * 3. **"O 24 colado nos quadrados".** A legenda encostava na fileira dos dias.
 *    Agora o intervalo tem faixa própria: a linha tracejada 24px abaixo das
 *    caixas, ligando o centro de um dia ao centro do outro, e o número mais
 *    abaixo ainda.
 *
 * O que NÃO mudou: o arco continua sendo a têmpera dos fios que sobem, e é ele
 * que carrega a cor da cena. Os ícones acesos ficam brancos de propósito — a
 * cor tem de estar no MOVIMENTO (o vídeo subindo), não parada no destino.
 */
import { motion } from 'framer-motion';
import { Legenda, Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { ARCO, Brilho, CERTO, Faiscas, Poeira, QUEBRA, TracoDeLuz, useTintas } from './luz';
import { FechoDoArco } from './fecho';
import { IconeDaRede, REDES_REAIS } from './redes';
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
/**
 * Os sete dias. O sábado abre o dobro da distância que separa dois dias úteis
 * (40 contra 20): a semana de trabalho é um bloco, e o fim de semana é OUTRO —
 * a fileira igualmente espaçada dizia que domingo era só mais um dia.
 */
const DIA_X = [24, 96, 168, 240, 312, 404, 476] as const;
const DIA_Y = 112;
const DIA_L = 52;
const DIA_A = 50;
const DIA_FIM = DIA_Y + DIA_A;

const REDES_X = [180, 280, 380] as const;
const REDE_Y = 46;
/** O lado da caixa do ícone. Meia caixa (19) é a folga que os fios respeitam. */
const REDE_TAMANHO = 38;
/** Onde o fio de luz encosta: 7px abaixo do glifo, sem tocá-lo. */
const REDE_BASE = REDE_Y + REDE_TAMANHO / 2 + 7;

/** A faixa do intervalo, abaixo da fileira dos dias — a linha e o número. */
const INTERVALO_Y = DIA_FIM + 24;

/** As três redes, no alto: para onde o mesmo vídeo do dia sobe. */
function Redes({ ativo, parado }: { ativo: boolean; parado: boolean }) {
  return (
    <g>
      {REDES_X.map((cx, indice) => (
        <g key={cx}>
          {ativo && (
            <Brilho x={cx} y={REDE_Y} raio={44} tinta="luzQuente" aceso parado={parado} />
          )}
          {/* Duas camadas do MESMO ícone, uma apagada por baixo e a acesa
              esmaecendo por cima. Trocar a cor num atributo só seria um corte
              seco no meio da cena; o cruzamento das duas é o "smooth" pedido, e
              custa três `path` a mais. */}
          <IconeDaRede
            rede={REDES_REAIS[indice]}
            x={cx}
            y={REDE_Y}
            tamanho={REDE_TAMANHO}
            cor={TRACO}
            acesa={false}
          />
          <motion.g
            initial={false}
            animate={{ opacity: ativo ? 1 : 0 }}
            transition={{ duration: tempo(parado, 0.45), ease: EASE }}
          >
            <IconeDaRede
              rede={REDES_REAIS[indice]}
              x={cx}
              y={REDE_Y}
              tamanho={REDE_TAMANHO}
              cor={TRACO_ACESO}
            />
          </motion.g>
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

/**
 * Um quadrado da semana: por fazer, publicando, publicado — ou de folga.
 *
 * A hierarquia é o assunto desta peça, e ela tem três degraus: o dia que TEM A
 * VEZ é o mais aceso do palco (borda em arco, vidro, clarão quente); o dia
 * CUMPRIDO volta ao traço comum e entrega o verde ao visto; o dia por fazer é
 * só contorno. Antes os cumpridos eram cinco caixas verdes brilhando ao mesmo
 * tempo, e nenhuma delas dizia mais do que a outra.
 */
function Dia({ indice, ativo, feito, parado }: DiaProps) {
  const x = DIA_X[indice];
  const meio = x + DIA_L / 2;
  const folga = indice >= UTEIS;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: folga ? 0.4 : 1 }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE }}
    >
      {ativo && !folga && (
        <Brilho x={meio} y={DIA_Y + DIA_A / 2} raio={52} tinta="luzQuente" aceso parado={parado} />
      )}
      {/* O clarão do dia cumprido é do tamanho do VISTO, não da caixa: raio 24
          apaga antes de chegar à borda, e o que fica verde é o carimbo. */}
      {feito && !folga && (
        <Brilho x={meio} y={DIA_Y + DIA_A / 2} raio={24} tinta="luzCerta" aceso parado={parado} />
      )}
      <Painel
        x={x}
        y={DIA_Y}
        largura={DIA_L}
        altura={DIA_A}
        cor={feito ? TRACO : TINTA.linha}
        tinta={ativo && !folga ? 'arco' : undefined}
        vidro={ativo && !folga}
      />
      {/* A peça de vídeo do dia: some no fim de semana, que é folga de verdade. */}
      {!folga && !feito && (
        <path
          d={`M ${x + 19} ${DIA_Y + 15} l 16 10 l -16 10 z`}
          fill={ativo ? TRACO_ACESO : TRACO}
        />
      )}
      {feito && !folga && (
        <Marca
          tipo="certo"
          x={meio}
          y={DIA_Y + DIA_A / 2}
          escala={0.9}
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
        const curva = `M ${origem} ${DIA_Y} C ${origem} 84, ${cx} 84, ${cx} ${REDE_BASE}`;
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
                animate={{ cx, cy: REDE_BASE, opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: ordem * 0.08, ease: 'easeOut' }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * O intervalo entre dois vídeos, dito com a única palavra que a cena carrega.
 *
 * A medida é DESENHADA como medida: a linha vai do centro do dia anterior ao
 * centro do dia da vez, com um tique em cada ponta, e o número mora abaixo
 * dela. O "24h" antes flutuava encostado na quina dos quadrados, sem dizer
 * entre o quê e o quê — colado e mudo ao mesmo tempo.
 */
function Vinte4Horas({ indice, parado }: { indice: number; parado: boolean }) {
  const anterior = DIA_X[indice - 1] + DIA_L / 2;
  const atual = DIA_X[indice] + DIA_L / 2;
  const meio = (anterior + atual) / 2;
  return (
    <motion.g
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.45), ease: EASE }}
    >
      <path
        d={`M ${anterior} ${INTERVALO_Y} H ${atual}`}
        stroke={TRACO}
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
      <path
        d={`M ${anterior} ${INTERVALO_Y - 6} v 12 M ${atual} ${INTERVALO_Y - 6} v 12`}
        stroke={TRACO}
        strokeWidth={1.5}
      />
      <Legenda x={meio} y={INTERVALO_Y + 30} corpo={22} tinta="arco">
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

/** A linha dos três atos e a distância entre eles. */
const ATO_Y = 254;
const ATO_X = [92, 180, 268] as const;

/**
 * Os três atos que quebram a garantia — soltos, sem anel em volta.
 *
 * O anel era o mesmo defeito das redes com outra roupa: um `circle` r=23 em
 * torno de um glifo de 20 de largura deixa três pixels de folga, e o desenho
 * fica preso. O vermelho já diz que aquilo derruba o direito, e o halo por trás
 * é a moldura de que ele precisa.
 */
function Atos({ visivel, parado }: { visivel: boolean; parado: boolean }) {
  return (
    <g>
      {GLIFOS.map((traco, indice) => {
        const cx = ATO_X[indice];
        return (
          <motion.g
            key={traco}
            initial={false}
            animate={{ opacity: visivel ? 1 : 0 }}
            transition={{
              duration: tempo(parado, 0.45),
              ease: EASE,
              delay: tempo(parado, visivel ? indice * 0.16 : 0),
            }}
          >
            {visivel && (
              <Brilho x={cx} y={ATO_Y} raio={42} tinta="luzQuebra" aceso parado={parado} />
            )}
            {/* Escala no grupo de FORA, animação no de dentro: framer escreve o
                `transform` do nó que anima e apagaria este `translate`. */}
            <g transform={`translate(${cx} ${ATO_Y}) scale(1.3)`}>
              <TracoDeLuz d={traco} cor={QUEBRA} largura={2.1} halo={2.4} parado={parado} />
            </g>
          </motion.g>
        );
      })}
    </g>
  );
}

const ESCUDO = 'M 0 -50 L 42 -33 L 42 6 C 42 34 22 50 0 58 C -22 50 -42 34 -42 6 L -42 -33 Z';
const RACHADURA = 'M 2 -48 l -13 24 l 15 11 l -11 26 l 9 13';

/** Os três estados do escudo, na ordem em que a cena os visita. */
type EstadoDoEscudo = 'esperando' | 'inteiro' | 'quebrado';

/** A cor do contorno em cada estado — cinza enquanto ninguém ganhou nada. */
function tracoDoEscudo(
  estado: EstadoDoEscudo,
  tintas: (nome: 'certo' | 'errado') => string,
): string {
  switch (estado) {
    case 'quebrado':
      return tintas('errado');
    case 'inteiro':
      return tintas('certo');
    case 'esperando':
      return TRACO;
    default:
      throw new Error(`estado de escudo desconhecido: ${String(estado)}`);
  }
}

/**
 * O escudo: cinza enquanto a semana corre, verde quando ela fecha, rachado
 * quando um dos três atos acontece.
 *
 * O `esperando` é novo e é a mesma regra do dia por fazer: o direito ainda não
 * foi conquistado, então ele é contorno, não prêmio. O escudo aceso desde o
 * primeiro quadro gastava o verde antes de a rotina ter feito por merecer, e
 * era mais um verde que não julgava nada.
 */
function Escudo({ estado, parado }: { estado: EstadoDoEscudo; parado: boolean }) {
  const tintas = useTintas();
  const quebrado = estado === 'quebrado';
  const inteiro = estado === 'inteiro';
  return (
    <g>
      <Brilho
        x={438}
        y={248}
        raio={92}
        tinta={quebrado ? 'luzQuebra' : 'luzCerta'}
        aceso={estado !== 'esperando'}
        parado={parado}
      />
      <g transform="translate(438 248) scale(0.95)">
        <path d={ESCUDO} fill={tintas('vidro')} />
        <TracoDeLuz
          d={ESCUDO}
          cor={tracoDoEscudo(estado, tintas)}
          largura={2.8}
          parado={parado}
        />
        {quebrado && (
          <TracoDeLuz
            d={RACHADURA}
            cor={QUEBRA}
            largura={3}
            parado={parado}
            riscando
            duracao={0.5}
          />
        )}
        {/*
         * O visto subiu seis unidades para abrir a faixa do fecho. O escudo
         * afina para a ponta, então o degradê só cabe embaixo do carimbo se o
         * carimbo não estiver no meio geométrico — e um visto centrado num
         * escudo já puxava para baixo por causa da barriga da forma.
         */}
        {inteiro && (
          <Marca tipo="certo" x={0} y={-2} escala={1.6} cor={TINTA.protege} parado={parado} />
        )}
        {/* Dentro do grupo do escudo: o degradê acompanha a escala da forma que
            ele fecha, em vez de virar uma medida solta no palco. */}
        {inteiro && <FechoDoArco x={0} y={19} escala={0.82} parado={parado} />}
      </g>
      <Faiscas
        x={438}
        y={248}
        raio={78}
        ativo={inteiro}
        parado={parado}
        quantidade={8}
        cores={[CERTO, ARCO[5]]}
        duracao={2.4}
      />
    </g>
  );
}

/** Qual escudo a fase pede. */
function escudoDaFase(fase: number): EstadoDoEscudo {
  if (fase === QUEBRA_FASE) return 'quebrado';
  return fase >= CUMPRIDA ? 'inteiro' : 'esperando';
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
      <Escudo estado={escudoDaFase(fase)} parado={parado} />
    </Palco>
  );
}
