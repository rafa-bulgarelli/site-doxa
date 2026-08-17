/**
 * ─── CENA: O CLONE ───────────────────────────────────────────────────────────
 *
 * A lição: **foto nítida, de frente — e o clone é uma aproximação.**
 *
 * ─── POR QUE ESTA CENA FOI REFEITA DUAS VEZES ────────────────────────────────
 *
 * A primeira versão tinha varredura em loop, faíscas coloridas, poeira subindo e
 * um ponto correndo na esteira. O dono olhou e resumiu: "fica escaneando e não
 * faz nada". O diagnóstico é o certo — quatro coisas se mexendo ao mesmo tempo,
 * e nenhuma delas AVANÇANDO a história, lê como tela de carregamento, não como
 * explicação. Movimento que não conta nada é ruído caro: ele rouba a atenção do
 * único gesto que importa.
 *
 * A segunda versão consertou isso e passou do ponto para o outro lado: um gesto
 * por fase, fases longas, e um começo em que NADA acontecia por quase dois
 * segundos — duas fotos já paradas no palco esperando a vez. O veredito da
 * terceira revisão foi "muito lenta, mais ação: os dois retratos sendo subidos,
 * mais viva". É o meio que esta versão procura, e o meio tem duas partes:
 *
 * - **os retratos ENTRAM em cena** em vez de já estarem lá. Eles sobem alguns
 *   pixels e acendem dentro de molduras que já estavam no palco, um logo depois
 *   do outro — o gesto de quem acabou de enviá-los, e a única coisa que a
 *   história ainda não tinha contado;
 * - **as fases encurtaram** de 10,2s para 7,1s no total. Nenhum gesto foi
 *   picotado: o que caiu foi a espera entre eles.
 *
 * Os quatro momentos, na ordem:
 *
 *   0. **O envio.** Duas molduras vazias; os retratos sobem para dentro delas,
 *      escalonados.
 *   1. **O veredito.** A foto de óculos, meio de lado, apaga e leva o xis; a
 *      foto frontal ACENDE — clarão branco atrás, traço claro, visto verde.
 *   2. **O caminho.** Um traço só, desenhado uma vez, viaja da foto aprovada
 *      até o quadro vazio do clone. É o "vira dado" da história.
 *   3. **O clone.** O rosto se completa dentro do quadro e SEGURA numa pausa
 *      longa — o quadro final é o que a pessoa leva embora.
 *
 * ─── AS DUAS REGRAS DE COR ───────────────────────────────────────────────────
 *
 * O site é monocromático, e aqui isso volta a valer: o desenho é branco e
 * grafite, e a luz é branca. **Verde e vermelho aparecem só como VEREDITO da
 * foto** — a borda e o carimbo. Cor que não julga nada é enfeite, e enfeite foi
 * o que reprovou a versão anterior.
 *
 * O detalhe que carrega o resto do capítulo: o rosto do clone é desenhado em
 * TRACEJADO, e é a única figura da cena assim. Traço interrompido é o jeito de
 * dizer, sem uma linha de texto, que aquilo é uma aproximação de você — não uma
 * cópia. Prometer semelhança perfeita aqui custa caro depois.
 */
import { motion } from 'framer-motion';
import { Marca, Painel, Palco, TINTA, TRACO, TRACO_ACESO } from './pecas';
import { Brilho, QUEBRA, TracoDeLuz } from './luz';
import { EASE, tempo, useRoteiro } from './tempo';

/**
 * O envio · as duas no palco · o veredito · o caminho · o clone segura.
 *
 * Cada fase continua tendo UM gesto — o que mudou foi a espera entre eles. A
 * primeira é curta de propósito: nela as duas molduras estão no palco e VAZIAS,
 * e a transição de entrada (0,62s) atravessa a fronteira e termina já dentro da
 * fase seguinte — o olho vê os retratos CHEGANDO. A última segue sendo a mais
 * longa: é o quadro que ensina, e é nele que quem passa os olhos precisa cair.
 */
const FASES = [520, 1450, 1500, 1000, 2700] as const;
const CHEGADAS = 1;
const VEREDITO = 2;
const CAMINHO = 3;
const CLONE = 4;

/** Quanto uma foto sobe ao entrar, e o atraso entre a primeira e a segunda. */
const SUBIDA = 26;
const ENTRE_AS_FOTOS = 0.18;

/** As passadas que dão halo a um traço: larga e fraca, média, cheia. */
const COM_BRILHO = [
  { largura: 11, opacidade: 0.1 },
  { largura: 5.5, opacidade: 0.28 },
  { largura: 2.6, opacidade: 1 },
] as const;
const SEM_BRILHO = [{ largura: 2.6, opacidade: 1 }] as const;

/** A geometria do palco, num lugar só — mexer aqui não desalinha o resto. */
const FOTO = { largura: 124, altura: 152, topo: 44, meio: 120 } as const;
const RUIM_X = 40;
const BOA_X = 180;
const QUADRO = { x: 362, y: 32, largura: 168, altura: 176 } as const;
const CLONE_X = QUADRO.x + QUADRO.largura / 2;

interface RostoProps {
  readonly cor: string;
  readonly oculos: boolean;
  readonly tracejado: boolean;
  readonly brilho?: boolean;
}

/** Cabeça, ombros e — só na foto que não serve — os óculos. */
function Rosto({ cor, oculos, tracejado, brilho = false }: RostoProps) {
  const risca = tracejado ? '8 7' : undefined;
  const camadas = brilho ? COM_BRILHO : SEM_BRILHO;
  return (
    <g fill="none" stroke={cor} strokeLinecap="round">
      {camadas.map(({ largura, opacidade }) => (
        <g key={largura} strokeWidth={largura} opacity={opacidade}>
          <circle cx={0} cy={-16} r={28} strokeDasharray={risca} />
          <path d="M -43 56 a 43 39 0 0 1 86 0" strokeDasharray={risca} />
          {oculos && (
            <>
              <circle cx={-12} cy={-18} r={10} />
              <circle cx={12} cy={-18} r={10} />
              <path d="M -2 -18 h 4" />
            </>
          )}
        </g>
      ))}
    </g>
  );
}

/**
 * A borda da foto: linha comum enquanto ninguém julgou, verde ou vermelha
 * depois. Antes do veredito ela é MUDA de propósito — uma borda acesa na fase
 * 0 já estaria dando a resposta que a cena vai levar dois segundos para dar.
 */
function bordaDaFoto(julgada: boolean, serve: boolean): string {
  if (!julgada) return TRACO;
  return serve ? TINTA.protege : QUEBRA;
}

interface FotoProps {
  readonly x: number;
  readonly serve: boolean;
  /** Enquanto falso, a foto ainda não recebeu veredito nenhum. */
  readonly julgada: boolean;
  /** Falso enquanto a foto ainda está subindo: fora do palco e apagada. */
  readonly dentro: boolean;
  /** O atraso da entrada, em segundos — é ele que escalona as duas. */
  readonly atraso: number;
  readonly parado: boolean;
}

/**
 * Uma das duas fotos enviadas, com o veredito quando ele chega.
 *
 * São dois grupos animados, e a divisão é o assunto: o de FORA carrega o
 * veredito (a recusada apaga para 0.28), o de DENTRO carrega a ENTRADA — o
 * retrato sobe 26px e acende dentro de uma moldura que já estava lá. Foi assim
 * que a cena ganhou o gesto que faltava sem ganhar um piscar de palco vazio: o
 * quadro fica, o conteúdo é que é subido.
 */
function Foto({ x, serve, julgada, dentro, atraso, parado }: FotoProps) {
  const recusada = julgada && !serve;
  const aprovada = julgada && serve;
  const meio = x + FOTO.largura / 2;
  return (
    // `initial={false}` é o que faz a foto NASCER no valor da fase, em vez de
    // fazer o percurso inteiro na primeira pintura.
    <motion.g
      initial={false}
      animate={{ opacity: recusada ? 0.28 : 1 }}
      transition={{ duration: tempo(parado, 0.6), ease: EASE }}
    >
      {/* O clarão da foto aprovada é BRANCO: "acender" aqui é luz, e o verde
          fica reservado ao carimbo, que é quem de fato julga. */}
      {aprovada && <Brilho x={meio} y={FOTO.meio} raio={104} tinta="luz" aceso parado={parado} />}
      <Painel
        x={x}
        y={FOTO.topo}
        largura={FOTO.largura}
        altura={FOTO.altura}
        cor={bordaDaFoto(julgada, serve)}
        vidro={aprovada}
        tracejado={recusada}
      />
      {/* A subida mora no grupo de FORA da que desenha: framer escreve o
          `transform` deste nó, e o `translate` do rosto fica no filho. */}
      <motion.g
        initial={false}
        animate={{ opacity: dentro ? 1 : 0, y: dentro ? 0 : SUBIDA }}
        transition={{
          duration: tempo(parado, 0.62),
          ease: EASE,
          delay: tempo(parado, dentro ? atraso : 0),
        }}
      >
        <g transform={`translate(${meio} 116)`}>
          <Rosto
            cor={aprovada ? TRACO_ACESO : TINTA.apagado}
            oculos={!serve}
            tracejado={false}
            brilho={aprovada}
          />
        </g>
        {julgada && (
          <Marca
            tipo={serve ? 'certo' : 'errado'}
            x={x + FOTO.largura - 24}
            y={FOTO.topo + FOTO.altura - 14}
            escala={0.9}
            cor={serve ? TINTA.protege : QUEBRA}
            parado={parado}
          />
        )}
      </motion.g>
    </motion.g>
  );
}

/**
 * O caminho da foto aprovada até o quadro do clone.
 *
 * Um traço, desenhado UMA vez quando a fase entra — e não um ponto correndo em
 * loop. A seta na ponta é o que dá direção sem escrever "vira dado" em cima.
 */
function Caminho({ parado }: { parado: boolean }) {
  return (
    <TracoDeLuz
      d="M 312 120 H 350 m -11 -8 l 11 8 l -11 8"
      cor={TRACO_ACESO}
      largura={2.4}
      halo={2.4}
      parado={parado}
      riscando
      duracao={0.7}
    />
  );
}

/**
 * O quadro do clone: chega vazio junto com o traço e se completa depois.
 *
 * O rosto entra por opacidade, não por `pathLength`: o clone é TRACEJADO, e
 * framer desenha `pathLength` mexendo no próprio `stroke-dasharray` — os dois
 * juntos brigam pelo mesmo atributo e o tracejado se perde no caminho.
 */
function QuadroDoClone({ completo, parado }: { completo: boolean; parado: boolean }) {
  return (
    <g>
      {completo && (
        <Brilho x={CLONE_X} y={FOTO.meio} raio={118} tinta="luz" aceso parado={parado} />
      )}
      <Painel
        x={QUADRO.x}
        y={QUADRO.y}
        largura={QUADRO.largura}
        altura={QUADRO.altura}
        cor={completo ? TRACO_ACESO : TRACO}
        vidro={completo}
      />
      {completo && (
        <motion.g
          initial={{ opacity: parado ? 1 : 0, y: parado ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: tempo(parado, 0.7), ease: EASE }}
        >
          {/* O deslocamento fica no grupo de DENTRO: framer manda no atributo
              `transform` do elemento que anima, e o rosto acabaria desenhado na
              origem do palco. */}
          <g transform={`translate(${CLONE_X} 124)`}>
            <Rosto cor={TINTA.branco} oculos={false} tracejado brilho />
          </g>
        </motion.g>
      )}
    </g>
  );
}

export default function CenaClone() {
  const { fase, parado } = useRoteiro(FASES, CLONE);

  return (
    <Palco viewBox="0 0 560 240" fase={fase}>
      {/* A de óculos entra primeiro e a boa logo atrás: duas fotos subindo ao
          mesmo tempo leem como um bloco só, e o escalonamento é o que dá a
          sensação de envio — uma, depois a outra. */}
      <Foto
        x={RUIM_X}
        serve={false}
        julgada={fase >= VEREDITO}
        dentro={fase >= CHEGADAS}
        atraso={0}
        parado={parado}
      />
      <Foto
        x={BOA_X}
        serve
        julgada={fase >= VEREDITO}
        dentro={fase >= CHEGADAS}
        atraso={ENTRE_AS_FOTOS}
        parado={parado}
      />

      {/* O caminho e o quadro só existem quando há para onde ir: a foto
          aprovada virando clone. */}
      {fase >= CAMINHO && <Caminho parado={parado} />}
      {fase >= CAMINHO && <QuadroDoClone completo={fase >= CLONE} parado={parado} />}
    </Palco>
  );
}
