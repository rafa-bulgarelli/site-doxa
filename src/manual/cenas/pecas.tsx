/**
 * ─── AS PEÇAS DAS CENAS ──────────────────────────────────────────────────────
 *
 * O palco, as tintas e os dois ou três traços que aparecem em mais de uma cena.
 * Não é uma biblioteca de ilustração: é o mínimo que impede uma dúzia de cenas
 * de divergirem em raio de canto, espessura de traço e tom — que é como um
 * conjunto de desenhos deixa de parecer o mesmo site.
 *
 * A COR mora em `luz.tsx` (o arco Siri, os clarões, as faíscas). Aqui ficam a
 * forma e o cinza: uma peça pede uma tinta pelo nome e o palco entrega.
 */
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE, tempo } from './tempo';
import { Paleta, ProvedorDaCena, useIdDaCena, useTintas } from './luz';
import type { Tinta } from './luz';

/**
 * As tintas chapadas.
 *
 * Dentro do SVG a cor vai no atributo `fill`/`stroke`, então os tokens de
 * `tailwind.config.js` reaparecem aqui como literal. São os MESMOS valores —
 * mudou um preto lá, muda aqui. (O palco, esse sim, usa as classes.)
 *
 * `protege` e `quebra` continuam sendo GRAMÁTICA, não enfeite: verde é o que
 * mantém o direito, vermelho é o que o perde. O arco Siri de `luz.tsx` é outra
 * coisa — é a têmpera da cena, e não um semáforo. Uma cena pode ser inteira
 * colorida e ainda assim ter um único verde, no lugar certo.
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
   *
   * A proporção do `viewBox` deve ficar perto da proporção da caixa: com
   * `meet`, o que sobra vira margem vazia, e foi assim que a primeira leva de
   * cenas acabou desenhando pequeno no meio de um retângulo largo.
   */
  readonly viewBox: string;
  /** A altura, em classes do Tailwind. */
  readonly altura?: string;
  /**
   * A fase em cartaz. Vira `data-fase` na moldura, e é por ela que o teste
   * prova que a preferência por menos movimento entrega OUTRO quadro — sem ela,
   * a única prova possível seria comparar dois blobs de SVG e torcer.
   */
  readonly fase?: number;
  readonly children: ReactNode;
}

/**
 * A moldura de toda cena.
 *
 * O `aria-hidden` mora AQUI, e é por isso que ele não pode ser esquecido em
 * nenhuma cena: o desenho é decorativo por definição — quem lê por leitor de
 * tela recebe o texto do capítulo, que diz a mesma coisa em palavras. Um
 * desenho narrado vira ruído duplicado.
 *
 * A paleta também mora aqui, e por um motivo prático: `id` de gradiente é
 * global no documento, então cada palco gera o seu e o distribui por contexto.
 * Cena nova ganha cor sem herdar essa armadilha.
 */
export function Palco({ viewBox, altura = 'h-56 sm:h-72', fase, children }: PalcoProps) {
  const id = useIdDaCena();
  return (
    <div
      aria-hidden
      data-fase={fase}
      className={`w-full overflow-hidden rounded-2xl border border-doxa-line bg-doxa-surface ${altura}`}
    >
      <svg
        viewBox={viewBox}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <ProvedorDaCena value={id}>
          <Paleta id={id} />
          {children}
        </ProvedorDaCena>
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
  /** A tinta da borda — vence `cor` e `aceso` quando vem. */
  readonly tinta?: Tinta;
  /** Vidro é o fundo com um degradê de luz por cima do elevado. */
  readonly vidro?: boolean;
  readonly tracejado?: boolean;
  readonly raio?: number;
}

/** A caixa de sempre: canto arredondado, fundo elevado, borda de uma linha. */
export function Painel({
  x,
  y,
  largura,
  altura,
  aceso = false,
  cor,
  tinta,
  vidro = false,
  tracejado = false,
  raio = 14,
}: PainelProps) {
  const tintas = useTintas();
  const traco = tinta != null ? tintas(tinta) : (cor ?? (aceso ? TRACO_ACESO : TINTA.linha));
  const comum = { x, y, width: largura, height: altura, rx: raio } as const;
  return (
    <g>
      <rect {...comum} fill={TINTA.elevado} />
      {vidro && <rect {...comum} fill={tintas('vidro')} />}
      <motion.rect
        {...comum}
        fill="none"
        strokeWidth={1.5}
        strokeDasharray={tracejado ? '6 5' : undefined}
        // A borda vai por `initial`+`animate`, nunca também como atributo solto:
        // com os dois, o React escreve o valor novo de uma vez e o framer anima
        // por cima a partir do velho — um quadro trocado, de graça.
        initial={{ stroke: traco }}
        animate={{ stroke: traco }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </g>
  );
}

interface BarraProps {
  readonly x: number;
  readonly y: number;
  /** A largura de destino. A barra cresce da esquerda até ela. */
  readonly largura: number;
  readonly altura?: number;
  readonly cor?: string;
  readonly tinta?: Tinta;
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
export function Barra({
  x,
  y,
  largura,
  altura = 6,
  cor = TRACO,
  tinta,
  parado,
  atraso = 0,
}: BarraProps) {
  const tintas = useTintas();
  const pintura = tinta != null ? tintas(tinta) : cor;
  return (
    <motion.rect
      x={x}
      y={y}
      height={altura}
      rx={altura / 2}
      fill={pintura}
      // `initial` com o valor da vez: é ele que o React escreve no primeiro
      // desenho. Sem isso a barra nasce com largura zero e só aparece depois
      // que o framer monta — um piscar de campo vazio a cada visita.
      initial={{ width: largura }}
      animate={{ width: largura }}
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

/**
 * O visto e o xis, desenhados riscando — não aparecendo prontos.
 *
 * Três passadas do mesmo traço (larga e fraca, média, cheia) dão o halo: sobre
 * preto, um visto verde com brilho lê como um carimbo aceso, e é ele que fecha
 * quase toda cena. Custa três `path` e nenhum filtro.
 */
export function Marca({ tipo, x, y, cor, escala = 1, parado }: MarcaProps) {
  const traco = tipo === 'certo' ? 'M -8 0 L -2 7 L 9 -8' : 'M -7 -7 L 7 7 M 7 -7 L -7 7';
  // O deslocamento no grupo de fora: framer manda no atributo `transform` do
  // elemento que anima, e o traço acabaria desenhado na origem do palco.
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      {[12, 6, 3].map((largura, indice) => (
        <motion.path
          key={largura}
          d={traco}
          fill="none"
          stroke={cor}
          strokeWidth={largura}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={[0.12, 0.3, 1][indice]}
          initial={{ pathLength: parado ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: tempo(parado, 0.45), ease: EASE }}
        />
      ))}
    </g>
  );
}

interface LegendaProps {
  readonly x: number;
  readonly y: number;
  readonly corpo?: number;
  readonly cor?: string;
  readonly tinta?: Tinta;
  readonly ancora?: 'start' | 'middle' | 'end';
  readonly children: string;
}

/**
 * A palavra ou o número que a cena carrega.
 *
 * Cena não conta história em texto — mas "1M", "24h" e "60" são números, e
 * número não tem tradução nem depende de leitura. Vão na serifa do site, em
 * corpo grande: no celular a cena inteira encolhe, e legenda pequena vira
 * borrão.
 */
export function Legenda({
  x,
  y,
  corpo = 22,
  cor = TINTA.apagado,
  tinta,
  ancora = 'middle',
  children,
}: LegendaProps) {
  const tintas = useTintas();
  return (
    <text
      x={x}
      y={y}
      className="font-serif"
      fontSize={corpo}
      fill={tinta != null ? tintas(tinta) : cor}
      textAnchor={ancora}
    >
      {children}
    </text>
  );
}
