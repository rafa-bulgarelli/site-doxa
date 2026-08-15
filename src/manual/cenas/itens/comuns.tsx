/**
 * ─── O QUE AS OITO MINI-CENAS DIVIDEM ────────────────────────────────────────
 *
 * Cada item da garantia abre com a SUA animação, e as oito são diferentes de
 * propósito: item explicado por desenho genérico é desenho que ninguém olha
 * duas vezes. O que elas dividem é só a caixa e três glifos que apareceriam
 * iguais em qualquer jeito — o vídeo, a rede e o selo redondo.
 *
 * A caixa é mais baixa e mais larga que a de um capítulo: a mini-cena abre uma
 * ETAPA, não um capítulo, e ela divide a tela com o texto do item logo abaixo.
 */
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Painel, Palco, TINTA } from '../pecas';
import type { Tinta } from '../luz';
import { TracoDeLuz } from '../luz';

/** A caixa das mini-cenas: 3,2 para 1, quase a proporção da tira na tela. */
const CAIXA = '0 0 480 150';

export function MiniPalco({ fase, children }: { fase: number; children: ReactNode }) {
  return (
    <Palco viewBox={CAIXA} altura="h-32 sm:h-40" fase={fase}>
      {children}
    </Palco>
  );
}

interface CartaoProps {
  readonly x: number;
  readonly y: number;
  readonly largura: number;
  readonly altura: number;
  readonly cor: string;
  readonly tinta?: Tinta;
  readonly tracejado?: boolean;
  readonly vidro?: boolean;
}

/** Um vídeo: a caixa e o triângulo de play, do tamanho que couber. */
export function Cartao({
  x,
  y,
  largura,
  altura,
  cor,
  tinta,
  tracejado = false,
  vidro = false,
}: CartaoProps) {
  const meioX = x + largura / 2;
  const meioY = y + altura / 2;
  const lado = Math.min(largura, altura) * 0.3;
  return (
    <g>
      <Painel
        x={x}
        y={y}
        largura={largura}
        altura={altura}
        cor={cor}
        tinta={tinta}
        tracejado={tracejado}
        vidro={vidro}
        raio={10}
      />
      <path
        d={`M ${meioX - lado * 0.5} ${meioY - lado} l ${lado * 1.5} ${lado} l ${-lado * 1.5} ${lado} z`}
        fill={cor}
      />
    </g>
  );
}

/** Os três desenhos de rede: o play, o quadrado e o anel. */
const REDES = ['play', 'quadrado', 'anel'] as const;
export type Rede = (typeof REDES)[number];

interface SinalProps {
  readonly rede: Rede;
  readonly cx: number;
  readonly cy: number;
  readonly cor: string;
  readonly raio?: number;
}

/** Uma rede, no anel de sempre — o mesmo vocabulário da cena da garantia. */
export function Sinal({ rede, cx, cy, cor, raio = 20 }: SinalProps) {
  const marca = raio * 0.35;
  return (
    <g>
      <circle cx={cx} cy={cy} r={raio} fill={TINTA.elevado} stroke={cor} strokeWidth={1.6} />
      {rede === 'play' && (
        <path
          d={`M ${cx - marca * 0.6} ${cy - marca} l ${marca * 1.7} ${marca} l ${-marca * 1.7} ${marca} z`}
          fill={cor}
        />
      )}
      {rede === 'quadrado' && (
        <rect
          x={cx - marca}
          y={cy - marca}
          width={marca * 2}
          height={marca * 2}
          rx={marca * 0.5}
          fill={cor}
        />
      )}
      {rede === 'anel' && (
        <circle cx={cx} cy={cy} r={marca} fill="none" stroke={cor} strokeWidth={2.4} />
      )}
    </g>
  );
}

export const TRES_REDES: readonly Rede[] = REDES;

interface SeloProps {
  readonly x: number;
  readonly y: number;
  readonly glifo: string;
  readonly cor: string;
  readonly raio?: number;
  readonly parado: boolean;
  readonly opacidade?: number;
}

/**
 * Um selo redondo com um glifo dentro — a tesoura, a nota, o cifrão.
 *
 * O glifo é desenhado na origem e o selo o desloca: framer escreve `transform`
 * no elemento que anima, e um `translate` no mesmo nó seria apagado no primeiro
 * quadro da animação.
 */
export function Selo({ x, y, glifo, cor, raio = 21, parado, opacidade = 1 }: SeloProps) {
  return (
    <motion.g initial={false} animate={{ opacity: opacidade }} transition={{ duration: 0.4 }}>
      <circle cx={x} cy={y} r={raio} fill={TINTA.elevado} stroke={cor} strokeWidth={1.6} />
      <g transform={`translate(${x} ${y})`}>
        <TracoDeLuz d={glifo} cor={cor} largura={2.1} halo={2.4} parado={parado} />
      </g>
    </motion.g>
  );
}
