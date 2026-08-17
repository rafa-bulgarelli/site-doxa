/**
 * ─── MINI-CENA: O CONTADOR QUE NÃO SE COMPRA (GA-7) ──────────────────────────
 *
 * O item: **nada de curtida, seguidor ou visualização comprada.**
 *
 * Começo: o contador de audiência sobe firme, e a curva ao lado dele é a do
 * crescimento real. Meio: uma sacola de compra desce e despeja um bloco de
 * números cinza embaixo do contador, que infla de 4.310 para 52.400 — e o
 * número perde a cor no mesmo instante, porque deixou de ser verdade. O bloco
 * acende o X vermelho e se desmancha. Fim: o contador volta ao número REAL,
 * agora 4.630 — maior do que era antes, porque o crescimento de verdade não
 * parou enquanto a fraude acontecia — e fecha em verde.
 *
 * Os três números são o roteiro em si: 4.310 → 52.400 → 4.630. Comprado sobe
 * mais alto e some; o real sobe pouco e fica.
 *
 * ─── POR QUE ESTA VERSÃO EXISTE (a anterior foi reprovada) ───────────────────
 *
 * A primeira SemCompra tinha uma chuva de coraçõezinhos vermelhos caindo sobre
 * uma linha que subia, e o veredito do dono foi "sem pé nem cabeça, nem meio,
 * nem final". Ele estava certo: a chuva caía em loop desde o primeiro quadro,
 * não encostava em nada, e no fim nada tinha MUDADO — não havia história, só
 * dois efeitos dividindo a mesma tela. Aqui cada fase muda um estado que a fase
 * seguinte herda, e a prova disso é o número: ele sobe, ele infla, ele volta.
 */
import { Legenda, Marca, Painel, TINTA } from '../pecas';
import { Brilho, CERTO, Faiscas, QUEBRA, TracoDeLuz, corDoArco, useTintas } from '../luz';
import { MiniPalco } from './comuns';
import { motion } from 'framer-motion';
import { EASE, tempo, useRoteiro } from '../tempo';

/** Sobe real · sobe de novo · a sacola despeja · o X recusa · a verdade fica. */
const FASES = [1200, 1100, 1500, 1400, 2600] as const;
const DESPEJA = 2;
const RECUSA = 3;
const VERDADE = 4;

/** O número em cartaz, fase a fase — o inflado repete porque ele resiste um tempo. */
const NUMEROS = ['4.120', '4.310', '52.400', '52.400', '4.630'] as const;

/** O cartão do contador: um só, largo, com o número à esquerda e a curva à direita. */
const PLACAR_X = 96;
const PLACAR_Y = 42;
const PLACAR_L = 288;
const PLACAR_A = 86;

/** A curva do crescimento real, dentro do cartão e longe do número. */
const CURVA = 'M 258 102 L 285 94 L 312 86 L 339 70 L 366 56';
/** O último ponto da curva acima — mexeu num, mexe no outro. */
const PONTA_X = 366;
const PONTA_Y = 56;

/** O bloco comprado: onde ele encosta no contador, e do tamanho de uma linha. */
const BLOCO_X = 170;
const BLOCO_Y = 108;
const BLOCO_L = 100;
const BLOCO_A = 22;

/** Os cinco riscos cinzentos dentro do bloco — números que não querem dizer nada. */
const RISCOS = [-38, -19, 0, 19, 38] as const;

/**
 * A sacola de compra: o corpo de papel, mais estreito embaixo, e a alça em
 * meia-lua por cima.
 *
 * A alça é um arco SOLTO, e não um "n" com duas pernas descendo: com as pernas
 * o glifo vira um CADEADO em qualquer tamanho pequeno — e cadeado já é o
 * desenho de outro item da garantia.
 */
const SACOLA = 'M -14 -2 h 28 l -2 18 h -24 z M -7 -2 a 7 7 0 0 1 14 0';

/**
 * O bloco de números comprados.
 *
 * Ele cai da sacola e encosta no contador por baixo: é o desenho de "somaram
 * isto ao seu número". A borda tracejada e o cinza chapado são a diferença que
 * a cena inteira depende — o real tem luz e cor, o comprado não tem nenhuma das
 * duas.
 */
function BlocoComprado({
  visivel,
  caiu,
  parado,
}: {
  readonly visivel: boolean;
  /**
   * Verdadeiro a partir da fase em que o bloco cai — inclusive DEPOIS de ele
   * sumir. É o que faz a saída ser um desmanche no lugar e não uma volta para
   * dentro da sacola: o caminho de entrada só é percorrido uma vez.
   */
  readonly caiu: boolean;
  readonly parado: boolean;
}) {
  // `initial` com o estado da vez: dentro de um SVG o framer só escreve o
  // `transform` depois de medir o nó, então quem desenha sem medida (o
  // `renderToStaticMarkup` do teste) veria o bloco já pousado no contador
  // desde a primeira fase. Com o valor em `initial`, o estado está no código.
  const alvo = { opacity: visivel ? 1 : 0, x: caiu ? 0 : -6, y: caiu ? 0 : -68 };
  return (
    <motion.g
      initial={alvo}
      animate={alvo}
      transition={{ duration: tempo(parado, 0.55), ease: EASE }}
    >
      <rect
        x={BLOCO_X - BLOCO_L / 2}
        y={BLOCO_Y - BLOCO_A / 2}
        width={BLOCO_L}
        height={BLOCO_A}
        rx={7}
        fill={TINTA.linha}
        stroke={TINTA.apagado}
        strokeWidth={1.3}
        strokeDasharray="5 4"
      />
      {RISCOS.map((deslocamento) => (
        <rect
          key={deslocamento}
          x={BLOCO_X + deslocamento - 6}
          y={BLOCO_Y - 4}
          width={12}
          height={8}
          rx={2}
          fill={TINTA.apagado}
        />
      ))}
    </motion.g>
  );
}

/** A sacola desce, larga o bloco e vai embora — só aparece no meio da história. */
function Sacola({ despejando, parado }: { despejando: boolean; parado: boolean }) {
  const alvo = { opacity: despejando ? 1 : 0, y: despejando ? 0 : -30 };
  return (
    // O `translate` no grupo de FORA — o de dentro é o que o framer escreve.
    // Ela fica na vertical do bloco: o despejo cai reto, e não em diagonal
    // para um canto que ninguém estava olhando.
    <g transform={`translate(${BLOCO_X} 20)`}>
      <motion.g
        initial={alvo}
        animate={alvo}
        transition={{ duration: tempo(parado, 0.5), ease: EASE }}
      >
        <TracoDeLuz d={SACOLA} cor={TINTA.apagado} largura={2} halo={2.2} parado={parado} />
      </motion.g>
    </g>
  );
}

/** A curva real: o traço no arco inteiro e o ponto da vez respirando na ponta. */
function CurvaReal({ parado }: { parado: boolean }) {
  const tintas = useTintas();
  return (
    <g>
      <TracoDeLuz
        d={CURVA}
        cor={tintas('arco')}
        largura={2.6}
        halo={2.8}
        parado={parado}
        riscando
        duracao={0.9}
      />
      <motion.circle
        cx={PONTA_X}
        cy={PONTA_Y}
        r={4}
        fill={corDoArco(1)}
        // O raio, e não `scale`: escala em SVG depende da origem do transform.
        animate={parado ? { opacity: 1 } : { opacity: [1, 0.5, 1], r: [4, 5.6, 4] }}
        transition={{ duration: 2.2, repeat: parado ? 0 : Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

/**
 * A cor do número: branco enquanto é verdade, cinza no instante em que está
 * inflado (número comprado não é número), verde quando o veredito chega.
 */
function corDoNumero(inflado: boolean, verdade: boolean): string {
  if (inflado) return TINTA.apagado;
  if (verdade) return CERTO;
  return TINTA.branco;
}

interface NumeroProps {
  readonly numero: string;
  readonly cor: string;
  readonly parado: boolean;
}

/**
 * O número do contador.
 *
 * A `key` no número faz o grupo renascer a cada troca, e é o renascimento que
 * dá o pisca de entrada — trocar o texto no mesmo nó seria um número que muda
 * sem ninguém ver que mudou. O `initial` olha o `parado`: com movimento
 * reduzido não há transição para tirar a opacidade do zero.
 */
function Numero({ numero, cor, parado }: NumeroProps) {
  return (
    <motion.g
      key={numero}
      initial={{ opacity: parado ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: tempo(parado, 0.35), ease: EASE }}
    >
      <Legenda x={118} y={90} corpo={40} ancora="start" cor={cor}>
        {numero}
      </Legenda>
    </motion.g>
  );
}

/** A recusa: o clarão vermelho e o carimbo sobre o bloco comprado. */
function Recusa({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho
        x={BLOCO_X}
        y={BLOCO_Y}
        raio={78}
        tinta="luzQuebra"
        aceso
        parado={parado}
        achatar={0.5}
      />
      {/* O xis é MAIOR que a altura do bloco de propósito: dentro dele viraria
          só mais um risco na fileira, e o que se quer é um carimbo por cima —
          o bloco INTEIRO é que foi recusado. */}
      <Marca tipo="errado" x={BLOCO_X} y={BLOCO_Y} cor={QUEBRA} escala={1.5} parado={parado} />
    </g>
  );
}

/** O veredito, ao lado do contador que voltou a ser verdade. */
function Veredito({ parado }: { parado: boolean }) {
  return (
    <g>
      <Brilho x={428} y={86} raio={54} tinta="luzCerta" aceso parado={parado} />
      <Marca tipo="certo" x={428} y={86} cor={TINTA.protege} escala={1.15} parado={parado} />
      <Faiscas x={428} y={86} raio={50} ativo parado={parado} quantidade={7} cores={[CERTO]} />
    </g>
  );
}

export default function SemCompra() {
  const { fase, parado } = useRoteiro(FASES, VERDADE);
  const inflado = fase === DESPEJA || fase === RECUSA;
  const verdade = fase >= VERDADE;

  return (
    <MiniPalco fase={fase}>
      <Brilho x={240} y={84} raio={180} tinta="luz" aceso={verdade} parado={parado} achatar={0.5} />
      <Painel
        x={PLACAR_X}
        y={PLACAR_Y}
        largura={PLACAR_L}
        altura={PLACAR_A}
        raio={16}
        tinta={verdade ? 'certo' : undefined}
        aceso
        vidro
      />
      <Numero numero={NUMEROS[fase]} cor={corDoNumero(inflado, verdade)} parado={parado} />
      <CurvaReal parado={parado} />

      <Sacola despejando={fase === DESPEJA} parado={parado} />
      <BlocoComprado visivel={inflado} caiu={fase >= DESPEJA} parado={parado} />
      {fase === RECUSA && <Recusa parado={parado} />}

      {verdade && <Veredito parado={parado} />}
    </MiniPalco>
  );
}
