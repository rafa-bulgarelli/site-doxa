/**
 * ─── O QUE AS MINI-CENAS DE PASSO DIVIDEM ────────────────────────────────────
 *
 * Só o que apareceria IGUAL em mais de uma cena, e mais nada: o rosto e a onda
 * de fala. Cena de passo é para ser diferente da vizinha — passo explicado por
 * desenho genérico é desenho que ninguém olha duas vezes —, então o que mora
 * aqui é a forma que, desenhada duas vezes, divergiria em raio, espessura e tom
 * e faria as três cenas do capítulo do clone parecerem de sites diferentes.
 *
 * ─── POR QUE O ROSTO É COPIADO DE `CenaClone`, E NÃO IMPORTADO ───────────────
 *
 * O `Rosto` de `CenaClone.tsx` é local àquele arquivo e foi desenhado para um
 * palco de 560 × 240. Aqui o palco tem 480 × 150 e o rosto divide a faixa com
 * uma moldura, um veredito e o que mais a cena precisar: a cabeça precisa ser
 * menor em relação aos ombros, e o traço, mais fino. O que se mantém é a
 * GRAMÁTICA, que é o que o capítulo inteiro apoia:
 *
 *   · traço contínuo = você, a pessoa de verdade;
 *   · traço TRACEJADO = o clone, uma aproximação — nunca uma cópia.
 *
 * Os óculos escuros NÃO moram aqui de propósito, ainda que sejam o desenho de
 * uma regra inteira: na cena que os usa eles precisam ter cor própria (ficam
 * vermelhos quando são recusados) e sair de cena sozinhos, sem levar o rosto
 * junto. Peça que uma cena só anima é peça daquela cena.
 */
import { motion } from 'framer-motion';
import { TINTA } from '../pecas';
import { EASE, tempo } from '../tempo';

/** As passadas que dão halo a um traço: larga e fraca, média, cheia. */
const COM_BRILHO = [
  { largura: 8, opacidade: 0.1 },
  { largura: 4, opacidade: 0.26 },
  { largura: 2, opacidade: 1 },
] as const;
const SEM_BRILHO = [{ largura: 2, opacidade: 1 }] as const;

interface RostoProps {
  readonly cor: string;
  readonly tracejado?: boolean;
  readonly brilho?: boolean;
}

/**
 * Cabeça e ombros, o retrato mínimo que ainda lê como pessoa.
 *
 * Desenhado na ORIGEM: quem chama o coloca com um `translate` no grupo de fora,
 * que é a mesma regra da `Marca` e do `Selo`. Framer escreve o atributo
 * `transform` do elemento que anima, e um deslocamento no mesmo nó seria apagado
 * no primeiro quadro.
 */
export function Rosto({ cor, tracejado = false, brilho = false }: RostoProps) {
  const risca = tracejado ? '7 6' : undefined;
  const camadas = brilho ? COM_BRILHO : SEM_BRILHO;
  return (
    <g fill="none" stroke={cor} strokeLinecap="round">
      {camadas.map(({ largura, opacidade }) => (
        <g key={largura} strokeWidth={largura} opacity={opacidade}>
          <circle cx={0} cy={-13} r={20} strokeDasharray={risca} />
          <path d="M -31 38 a 31 28 0 0 1 62 0" strokeDasharray={risca} />
        </g>
      ))}
    </g>
  );
}

interface OndaProps {
  readonly alturas: readonly number[];
  readonly x: number;
  readonly eixo: number;
  readonly passo: number;
  readonly largura?: number;
  readonly cor: string;
  readonly parado: boolean;
  readonly atraso?: number;
}

/**
 * A fala desenhada em barras — o mesmo vocabulário da cena da voz.
 *
 * As alturas vêm da cena, e é nisso que está a história de cada uma: a fala
 * natural tem picos e vales, a fala processada é uma fileira quase reta, e o
 * trecho curto é uma fala inteira em cinco barras.
 */
export function OndaDeFala({
  alturas,
  x,
  eixo,
  passo,
  largura = 6,
  cor,
  parado,
  atraso = 0,
}: OndaProps) {
  return (
    <g>
      {alturas.map((altura, indice) => (
        <motion.rect
          key={indice}
          x={x + indice * passo}
          width={largura}
          rx={largura / 2}
          fill={cor}
          /*
           * `attrY`, e não `y`: para o framer, `y` é sempre DESLOCAMENTO — com
           * `y` a onda inteira nasce colada no topo, porque o atributo do
           * retângulo fica em zero e o translate só entra depois. `attrY` mira o
           * atributo mesmo, que é o que o primeiro desenho já escreve.
           *
           * A barra sobe metade da própria altura porque a onda cresce para os
           * dois lados a partir do eixo, do jeito que um áudio se desenha.
           */
          initial={{ attrY: eixo - altura / 2, height: altura }}
          animate={{ attrY: eixo - altura / 2, height: altura }}
          transition={{
            duration: tempo(parado, 0.5),
            ease: EASE,
            delay: tempo(parado, atraso + indice * 0.03),
          }}
        />
      ))}
    </g>
  );
}

/** O ponto de gravação de um app: um disco, e nada em volta dele. */
export function PontoDeGravar({ x, y, aceso }: { x: number; y: number; aceso: boolean }) {
  return <circle cx={x} cy={y} r={7} fill={aceso ? TINTA.branco : TINTA.apagado} />;
}
