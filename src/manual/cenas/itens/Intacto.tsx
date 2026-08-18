/**
 * ─── MINI-CENA: O LACRE (GA-5) ───────────────────────────────────────────────
 *
 * O item: **o vídeo vai no ar exatamente como foi entregue.**
 *
 * O vídeo sai da tela da DOXA com um lacre aceso e atravessa até a tela do
 * publicado. No meio do caminho UMA tesoura desce para encostar nele e bate num
 * arco vermelho: não passa. O vídeo chega ao ar com o MESMO lacre — nem um
 * traço diferente — e o visto verde fecha a cena. Baixou, publicou, não mexeu.
 *
 * O lacre não muda de cor em nenhum instante, e isso é o argumento inteiro: o
 * verde do fim está na moldura do publicado e no visto, não nele. Um lacre que
 * troca de cor no fim seria um lacre que foi mexido.
 *
 * ─── POR QUE ESTA VERSÃO EXISTE (a anterior foi reprovada) ───────────────────
 *
 * A primeira Intacto punha TRÊS ferramentas ao mesmo tempo, cada uma presa
 * dentro de um selo redondo apertado, sobre setas em degradê e duas barras
 * coloridas — e o veredito do dono foi "grossa, junta, sem hierarquia, tudo
 * colorido, horrível; clássico exemplo do que não fazer". O conserto não é de
 * traço, é de QUANTIDADE: uma ferramenta só, o ícone solto (sem a jaula do
 * círculo em volta), base inteira em cinza e branco, VERMELHO só no instante da
 * recusa e VERDE só no veredito. O que sobra respira, e é por isso que sobra.
 */
import { Marca, Painel, TINTA, TRACO, TRACO_ACESO } from '../pecas';
import { Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz, useTintas } from '../luz';
import { FechoDoArco } from '../fecho';
import { MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Sai da DOXA · atravessa · a tesoura é barrada · chega ao ar. */
const FASES = [1200, 1400, 1800, 2600] as const;
const ATRAVESSA = 1;
const BARRADA = 2;
const NO_AR = 3;

/**
 * A altura do percurso: as duas telas e o vídeo vivem todos nesta linha.
 *
 * Ela desce um pouco abaixo do meio do palco de propósito — a faixa de cima
 * é onde a tesoura desce, e ela precisa caber inteira, com folga do arco que a
 * barra e da borda da moldura.
 */
const LINHA_Y = 84;
const MEIO_X = 240;

/** As duas telas: a da DOXA e a do publicado, do mesmo tamanho, bem afastadas. */
const TELA_Y = 46;
const TELA_L = 112;
const TELA_A = 76;
const ORIGEM_X = 14;
const DESTINO_X = 354;
const ORIGEM_CENTRO = ORIGEM_X + TELA_L / 2;
const DESTINO_CENTRO = DESTINO_X + TELA_L / 2;

/**
 * Onde o vídeo está em cada fase, e quanto do trilho já ficou aceso atrás dele.
 *
 * O meio do caminho é a parada de DUAS fases: o vídeo chega nele e fica parado
 * enquanto a tesoura tenta. Uma posição intermediária a mais faria o cartão
 * encostar na moldura da origem e cobrir o trecho aceso do trilho — o percurso
 * sumiria justo na fase que existe para mostrá-lo.
 */
const PARADA = [ORIGEM_CENTRO, MEIO_X, MEIO_X, DESTINO_CENTRO] as const;
const PERCORRIDO = [0, 0.5, 0.5, 1] as const;

/** O trilho entre as duas telas — começa e termina longe das molduras. */
const TRILHO = 'M 134 84 H 346';

/**
 * O cartão do vídeo é bem menor que a moldura das telas: caixa dentro de caixa
 * com dois dedos de folga lê como erro de alinhamento, e com quinze lê como um
 * vídeo DENTRO de uma tela.
 */
const CARTAO_L = 78;
const CARTAO_A = 46;

/** O play do vídeo, à esquerda do cartão. */
const PLAY = `M -27 ${LINHA_Y - 10} L -12 ${LINHA_Y} L -27 ${LINHA_Y + 10} z`;

/**
 * O lacre: o anel, o ponto no meio e as duas fitas caindo.
 *
 * É o selo de cera de sempre, e não um cadeado: o cadeado já é o desenho da
 * GA-3 ("travado até dar a hora"), e o mesmo glifo com dois sentidos em dois
 * itens vizinhos confunde mais do que ilustra.
 */
const LACRE = 'M 0 -11 a 11 11 0 1 1 -0.1 0 M -5.5 10 v 8 l 5.5 -4 l 5.5 4 v -8';

/**
 * A tesoura, de lâmina para baixo: as argolas em cima, o corte descendo.
 *
 * O halo dela é magro (menos de duas vezes o traço) porque num glifo deste
 * tamanho um halo gordo fecha o vão das argolas e o cruzamento das lâminas — o
 * que sobra é uma mancha vermelha em forma de nada, e a cena perde a única
 * ferramenta que tem.
 */
const TESOURA =
  'M -10.4 11.5 L 8 -8 M 10.4 11.5 L -8 -8 M -10.4 -11.5 a 3.7 3.7 0 1 0 0.1 0 ' +
  'M 10.4 -11.5 a 3.7 3.7 0 1 0 0.1 0';

/** O arco que barra a tesoura: um escudo curto, logo acima do cartão. */
const BARREIRA = 'M 202 52 Q 240 32 278 52';

/**
 * O caminho, em duas passadas: o pontilhado do trajeto todo e o traço aceso do
 * que já foi andado.
 *
 * São dois `path` separados de propósito: `pathLength` e `strokeDasharray`
 * disputam o mesmo atributo, e animar o comprimento de uma linha pontilhada
 * devolve um pontilhado que anda, não uma linha que cresce.
 */
function Trilho({ percorrido, parado }: { percorrido: number; parado: boolean }) {
  return (
    <g>
      <path
        d={TRILHO}
        fill="none"
        stroke={TRACO}
        strokeWidth={1.6}
        strokeDasharray="5 9"
        strokeLinecap="round"
      />
      <motion.path
        d={TRILHO}
        fill="none"
        stroke={TRACO_ACESO}
        strokeWidth={1.8}
        strokeLinecap="round"
        initial={{ pathLength: percorrido }}
        animate={{ pathLength: percorrido }}
        transition={{ duration: tempo(parado, 0.9), ease: EASE }}
      />
    </g>
  );
}

/**
 * O vídeo lacrado, viajando.
 *
 * O deslocamento é a PRÓPRIA animação, então o desenho nasce todo em volta do
 * zero horizontal: um `translate` no mesmo nó que anima seria apagado pelo
 * `transform` que o framer escreve no primeiro quadro.
 */
function VideoLacrado({ x, parado }: { x: number; parado: boolean }) {
  const tintas = useTintas();
  const caixa = {
    x: -CARTAO_L / 2,
    y: LINHA_Y - CARTAO_A / 2,
    width: CARTAO_L,
    height: CARTAO_A,
    rx: 11,
  } as const;
  return (
    <motion.g
      // `initial` com a posição da vez, e não `initial={false}`: dentro de um
      // SVG o framer só escreve o `transform` depois de MEDIR o nó, e quem
      // desenha o mesmo componente sem medida — o `renderToStaticMarkup` do
      // teste, e qualquer conferência por SSR — recebe o cartão na origem do
      // palco, metade dele fora da moldura. Com o valor em `initial` a
      // intenção fica no código, e não só no navegador.
      initial={{ x }}
      animate={{ x }}
      transition={{ duration: tempo(parado, 0.9), ease: EASE }}
    >
      <rect {...caixa} fill={TINTA.superficie} />
      <rect {...caixa} fill={tintas('vidro')} />
      <rect {...caixa} fill="none" stroke={TRACO_ACESO} strokeWidth={1.5} />
      <path d={PLAY} fill={TRACO_ACESO} />
      <g transform={`translate(16 ${LINHA_Y - 5})`}>
        <TracoDeLuz d={LACRE} cor={TINTA.branco} largura={2} halo={2.4} parado={parado} />
        <circle cx={0} cy={0} r={3.3} fill={TINTA.branco} />
      </g>
    </motion.g>
  );
}

/** A tesoura desce, encosta no arco e some — a única ferramenta da cena. */
function Tesoura({ tentando, parado }: { tentando: boolean; parado: boolean }) {
  const alvo = { opacity: tentando ? 1 : 0, y: tentando ? 0 : -32 };
  return (
    // O `translate` fica no grupo de FORA: o framer escreve `transform` no nó
    // que anima, e o deslocamento seria apagado no primeiro quadro.
    <g transform={`translate(${MEIO_X} 22)`}>
      <motion.g
        initial={alvo}
        animate={alvo}
        transition={{ duration: tempo(parado, 0.5), ease: EASE }}
      >
        <TracoDeLuz d={TESOURA} cor={QUEBRA} largura={2.1} halo={1.9} parado={parado} />
      </motion.g>
    </g>
  );
}

/**
 * A tela da DOXA.
 *
 * Ela esmaece quando o vídeo sai dela: a atenção anda junto com o que está
 * acontecendo, e uma caixa vazia acesa no canto disputaria o olho com a tela
 * que importa.
 */
function TelaDaDoxa({ fase, parado }: { fase: number; parado: boolean }) {
  return (
    <g>
      <Brilho
        x={ORIGEM_CENTRO}
        y={LINHA_Y}
        raio={74}
        tinta="luz"
        aceso={fase <= ATRAVESSA}
        parado={parado}
      />
      <Painel
        x={ORIGEM_X}
        y={TELA_Y}
        largura={TELA_L}
        altura={TELA_A}
        raio={12}
        cor={fase === 0 ? TRACO_ACESO : TRACO}
        vidro
      />
    </g>
  );
}

/** A tela do publicado: um contorno tracejado esperando, e verde quando enche. */
function TelaDoPublicado({ chegou, parado }: { chegou: boolean; parado: boolean }) {
  return (
    <g>
      <Brilho
        x={DESTINO_CENTRO}
        y={LINHA_Y}
        raio={78}
        tinta="luzCerta"
        aceso={chegou}
        parado={parado}
      />
      <Painel
        x={DESTINO_X}
        y={TELA_Y}
        largura={TELA_L}
        altura={TELA_A}
        raio={12}
        cor={chegou ? undefined : TINTA.linha}
        tinta={chegou ? 'certo' : undefined}
        tracejado={!chegou}
        vidro={chegou}
      />
    </g>
  );
}

/** O arco vermelho — o único vermelho da cena, e só enquanto a tesoura tenta. */
function Barreira({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={MEIO_X} y={44} raio={68} tinta="luzQuebra" aceso parado={parado} achatar={0.6} />
      <TracoDeLuz
        d={BARREIRA}
        cor={QUEBRA}
        largura={3}
        halo={2.6}
        parado={parado}
        riscando
        duracao={0.45}
        atraso={0.3}
      />
    </g>
  );
}

/**
 * O veredito: o visto no canto da tela que recebeu o vídeo, e as faíscas.
 *
 * O degradê fica embaixo da TELA, e não embaixo do visto: aqui o carimbo mora na
 * quina inferior direita do palco, e um sublinhado ali sairia pela borda. O que
 * deu certo é o vídeo ter chegado ao ar do jeito que saiu — então é a tela do
 * publicado que ganha o chão colorido.
 */
function Veredito({ parado }: { parado: boolean }) {
  return (
    <g>
      <Marca tipo="certo" x={464} y={128} cor={TINTA.protege} escala={0.9} parado={parado} />
      <FechoDoArco x={DESTINO_CENTRO} y={126} escala={0.85} parado={parado} />
      <Faiscas
        x={DESTINO_CENTRO}
        y={LINHA_Y}
        raio={64}
        ativo
        parado={parado}
        quantidade={8}
        cores={[CERTO]}
      />
    </g>
  );
}

export default function Intacto() {
  const { fase, parado } = useRoteiro(FASES, NO_AR);
  const chegou = fase >= NO_AR;

  return (
    <MiniPalco fase={fase}>
      <TelaDaDoxa fase={fase} parado={parado} />
      <Trilho percorrido={PERCORRIDO[fase]} parado={parado} />
      <TelaDoPublicado chegou={chegou} parado={parado} />
      <VideoLacrado x={PARADA[fase]} parado={parado} />
      {fase === BARRADA && <Barreira parado={parado} />}
      <Tesoura tentando={fase === BARRADA} parado={parado} />
      {chegou && <Veredito parado={parado} />}
    </MiniPalco>
  );
}
