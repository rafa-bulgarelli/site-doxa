/**
 * ─── AS PEÇAS DAS CENAS ──────────────────────────────────────────────────────
 *
 * O palco, as tintas e os dois ou três traços que aparecem em mais de uma cena.
 * Não é uma biblioteca de ilustração: é o mínimo que impede as quatro cenas de
 * divergirem em raio de canto, espessura de traço e tom de cinza — que é como
 * um conjunto de desenhos deixa de parecer o mesmo site.
 */
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE, tempo } from './tempo';

/**
 * As tintas.
 *
 * Dentro do SVG a cor vai no atributo `fill`/`stroke`, então os tokens de
 * `tailwind.config.js` reaparecem aqui como literal. São os MESMOS valores —
 * mudou um preto lá, muda aqui. (O palco, esse sim, usa as classes.)
 *
 * O site é monocromático por regra, e as cenas seguem: `protege` e `quebra`
 * existem porque na cena da garantia a COR é a informação — verde é o que
 * mantém o direito, vermelho é o que o perde. Fora disso, cinza.
 */
export const TINTA = {
  superficie: '#0D0D0D',
  elevado: '#141414',
  linha: '#1F1F1F',
  apagado: '#6B6B6B',
  branco: '#FFFFFF',
  protege: '#34D399',
  quebra: '#F87171',
} as const;

/** O cinza de um traço secundário, na opacidade que o site usa nas bordas. */
export const TRACO = 'rgba(255,255,255,0.16)';
/** O cinza de um traço que está aceso — a linha que tem a vez. */
export const TRACO_ACESO = 'rgba(255,255,255,0.55)';

interface PalcoProps {
  /**
   * O `viewBox` da cena. Fixo de propósito: é ele que faz o desenho escalar
   * sozinho do celular ao desktop sem uma única media query.
   */
  readonly viewBox: string;
  /** A altura, em classes do Tailwind. Fluida entre ~10rem e ~16rem. */
  readonly altura?: string;
  readonly children: ReactNode;
}

/**
 * A moldura de toda cena.
 *
 * O `aria-hidden` mora AQUI, e é por isso que ele não pode ser esquecido em
 * nenhuma das quatro: a cena é decorativa por definição — quem lê por leitor
 * de tela recebe o texto do capítulo, que diz a mesma coisa em palavras. Um
 * desenho narrado vira ruído duplicado.
 */
export function Palco({ viewBox, altura = 'h-40 sm:h-48', children }: PalcoProps) {
  return (
    <div
      aria-hidden
      className={`w-full overflow-hidden rounded-2xl border border-doxa-line bg-doxa-surface ${altura}`}
    >
      <svg
        viewBox={viewBox}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {children}
      </svg>
    </div>
  );
}

interface PainelProps {
  readonly x: number;
  readonly y: number;
  readonly largura: number;
  readonly altura: number;
  /** Aceso é o painel que tem a vez: borda clara em vez de borda de linha. */
  readonly aceso?: boolean;
  readonly cor?: string;
  readonly tracejado?: boolean;
}

/** A caixa de sempre: canto arredondado, fundo elevado, borda de uma linha. */
export function Painel({
  x,
  y,
  largura,
  altura,
  aceso = false,
  cor,
  tracejado = false,
}: PainelProps) {
  const traco = cor ?? (aceso ? TRACO_ACESO : TINTA.linha);
  return (
    <motion.rect
      x={x}
      y={y}
      width={largura}
      height={altura}
      rx={14}
      fill={TINTA.elevado}
      strokeWidth={1.5}
      strokeDasharray={tracejado ? '6 5' : undefined}
      // A borda vai por `initial`+`animate`, nunca também como atributo solto:
      // com os dois, o React escreve o valor novo de uma vez e o framer anima
      // por cima a partir do velho — um quadro trocado, de graça.
      initial={{ stroke: traco }}
      animate={{ stroke: traco }}
      transition={{ duration: 0.4, ease: EASE }}
    />
  );
}

interface BarraProps {
  readonly x: number;
  readonly y: number;
  /** A largura de destino. A barra cresce da esquerda até ela. */
  readonly largura: number;
  readonly altura?: number;
  readonly cor?: string;
  readonly parado: boolean;
  readonly atraso?: number;
}

/**
 * Uma linha de texto sem texto.
 *
 * A cena não escreve frases: uma frase dentro do desenho vira letra de 8px no
 * celular, ilegível e sem tradução. A barra diz o que precisa — resposta curta
 * é uma barra curta, resposta com contexto é a linha inteira preenchida.
 */
export function Barra({ x, y, largura, altura = 6, cor = TRACO, parado, atraso = 0 }: BarraProps) {
  return (
    <motion.rect
      x={x}
      y={y}
      height={altura}
      rx={altura / 2}
      // `initial` com o valor da vez: é ele que o React escreve no primeiro
      // desenho. Sem isso a barra nasce com largura zero e só aparece depois
      // que o framer monta — um piscar de campo vazio a cada visita.
      initial={{ width: largura, fill: cor }}
      animate={{ width: largura, fill: cor }}
      transition={{ duration: tempo(parado, 0.5), ease: EASE, delay: tempo(parado, atraso) }}
    />
  );
}

interface MarcaProps {
  readonly tipo: 'certo' | 'errado';
  readonly x: number;
  readonly y: number;
  readonly cor: string;
  readonly escala?: number;
  readonly parado: boolean;
}

/** O visto e o xis, desenhados riscando — não aparecendo prontos. */
export function Marca({ tipo, x, y, cor, escala = 1, parado }: MarcaProps) {
  const traco = tipo === 'certo' ? 'M -8 0 L -2 7 L 9 -8' : 'M -7 -7 L 7 7 M 7 -7 L -7 7';
  // O deslocamento no grupo de fora: framer manda no atributo `transform` do
  // elemento que anima, e o traço acabaria desenhado na origem do palco.
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <motion.path
        key={tipo}
        d={traco}
        fill="none"
        stroke={cor}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: parado ? 1 : 0, opacity: parado ? 1 : 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: tempo(parado, 0.45), ease: EASE }}
      />
    </g>
  );
}
