import { forwardRef } from 'react';
import { STEPS } from './config';

/** Coordenadas em unidades do viewBox, com folga nas pontas. */
const VIEW_W = 1000;
const MARGIN = 10;

export const NODE_XS = STEPS.map(
  (_, index) => MARGIN + ((VIEW_W - MARGIN * 2) * index) / (STEPS.length - 1),
);

export interface PipelineHandles {
  wire: SVGPathElement | null;
  nodes: (SVGCircleElement | null)[];
  labels: (HTMLSpanElement | null)[];
  pulse: SVGCircleElement | null;
}

interface PipelineProps {
  handles: React.MutableRefObject<PipelineHandles>;
}

/**
 * A tubulação do jeito antigo: nove nós em série.
 *
 * O desenho do fio é uma animação de `stroke-dasharray` direta, não o
 * `pathLength` do framer-motion — `pathLength` emite dasharray em unidades de
 * viewBox e borra quando o viewBox é medido em pixels, que é exatamente o caso
 * aqui (a mesma armadilha já documentada no `connector-in` do index.css).
 *
 * Tudo é dirigido imperativamente pelo pai via refs: são 9 nós, 9 rótulos e um
 * pulso atualizados a cada frame, e passar isso por estado do React re-renderiza
 * a árvore inteira 60 vezes por segundo sem nenhum ganho.
 */
export const Pipeline = forwardRef<HTMLDivElement, PipelineProps>(function Pipeline(
  { handles },
  ref,
) {
  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} 60`}
        preserveAspectRatio="none"
        className="block w-full overflow-visible"
        aria-hidden
      >
        <path
          ref={(el) => {
            handles.current.wire = el;
          }}
          d={`M ${MARGIN} 30 L ${VIEW_W - MARGIN} 30`}
          fill="none"
          stroke="#1F1F1F"
          strokeWidth={1}
        />

        {NODE_XS.map((x, index) => (
          <circle
            key={STEPS[index]}
            ref={(el) => {
              handles.current.nodes[index] = el;
            }}
            cx={x}
            cy={30}
            r={4}
            fill="#000000"
            stroke="#DEDBC8"
            strokeWidth={1}
            opacity={0}
          />
        ))}

        <circle
          ref={(el) => {
            handles.current.pulse = el;
          }}
          cx={MARGIN}
          cy={30}
          r={3.2}
          fill="#DEDBC8"
          opacity={0}
        />
      </svg>

      {STEPS.map((step, index) => (
        <span
          key={step}
          ref={(el) => {
            handles.current.labels[index] = el;
          }}
          className="absolute top-10 -translate-x-1/2 whitespace-nowrap text-[0.62rem] tracking-wide text-primary/40 opacity-0 md:text-[0.66rem]"
          style={{ left: `${(NODE_XS[index] / VIEW_W) * 100}%` }}
        >
          {step}
        </span>
      ))}
    </div>
  );
});
