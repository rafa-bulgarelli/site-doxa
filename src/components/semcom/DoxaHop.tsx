import { forwardRef } from 'react';
import { MotionButton } from '../ui/MotionButton';
import { CONTATO_URL } from './config';

export interface HopHandles {
  wire: SVGPathElement | null;
  pulse: SVGCircleElement | null;
  cta: HTMLDivElement | null;
}

interface DoxaHopProps {
  handles: React.MutableRefObject<HopHandles>;
}

/**
 * O lado Doxa: dois nós e um salto.
 *
 * Nenhum valor aparece aqui — a seção fecha no diagnóstico, não no preço. O
 * contraste com o lado de cima é feito por luz e ar, nunca por verde contra
 * vermelho: no site essas duas cores já pertencem ao TikTok e à métrica de
 * crescimento, e reusá-las como "bom" e "ruim" atropela a ProofWall.
 */
export const DoxaHop = forwardRef<HTMLDivElement, DoxaHopProps>(function DoxaHop(
  { handles },
  ref,
) {
  return (
    <div ref={ref} className="opacity-0">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="text-lg font-medium tracking-tight text-primary">Com Doxa</span>
        <span className="text-xs uppercase tracking-[0.18em] text-doxa-muted">1 etapa</span>
      </div>

      <div className="mb-12 grid items-center gap-4 md:grid-cols-[auto_1fr_auto] md:gap-10">
        <div className="flex flex-col gap-1 rounded-sm border border-primary/25 bg-primary/[0.045] px-5 py-4">
          <span className="text-[0.68rem] uppercase tracking-[0.1em] text-doxa-muted">
            Você envia
          </span>
          <span className="text-sm text-primary">Uma foto</span>
          <span className="text-sm text-primary">Um áudio de 30s</span>
        </div>

        <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="h-5 w-full" aria-hidden>
          <path
            ref={(el) => {
              handles.current.wire = el;
            }}
            d="M 0 10 L 400 10"
            fill="none"
            stroke="#DEDBC8"
            strokeWidth={1.4}
          />
          <circle
            ref={(el) => {
              handles.current.pulse = el;
            }}
            cx={0}
            cy={10}
            r={3.4}
            fill="#DEDBC8"
            opacity={0}
          />
        </svg>

        <div className="justify-self-start rounded-sm bg-primary px-5 py-4 text-sm font-medium text-doxa-bg">
          Vídeo pronto
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-10">
        <div>
          <span className="block text-5xl font-medium leading-none tracking-[-0.06em] text-primary md:text-7xl">
            Hoje
          </span>
          <span className="mt-3 block text-[0.68rem] uppercase tracking-[0.16em] text-doxa-muted">
            até o primeiro vídeo
          </span>
        </div>

        <div
          ref={(el) => {
            handles.current.cta = el;
          }}
          className="flex flex-col gap-3 rounded-full"
        >
          <MotionButton
            label="Agendar diagnóstico estratégico"
            {...(CONTATO_URL === '' ? {} : { href: CONTATO_URL })}
          />
          <span className="max-w-[30ch] text-sm leading-relaxed text-doxa-muted">
            {CONTATO_URL === ''
              ? 'PENDENTE-DONO: destino do botão (Calendly, WhatsApp ou formulário).'
              : '30 minutos. A gente olha o seu caso e diz o que dá pra fazer.'}
          </span>
        </div>
      </div>
    </div>
  );
});
