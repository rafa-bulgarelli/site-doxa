import { useRef } from 'react';
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion';
import { NODE_XS, Pipeline, type PipelineHandles } from './semcom/Pipeline';
import { DoxaHop, type HopHandles } from './semcom/DoxaHop';
import { PaintDrop } from './semcom/PaintDrop';
import { CUSTO_SEM, PRAZO_SEM, STEPS } from './semcom/config';

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * Que fatia da seção pertence à travessia da gota.
 *
 * A seção tem 640vh: 120 para a travessia (`0.1875`) e 520 para o conteúdo — os
 * mesmos 520 de antes. É por isso que o progresso do conteúdo é remapeado em vez
 * de as fases serem reescritas: cada número de fase abaixo continua querendo
 * dizer o que queria, e a travessia entra na frente sem custar um frame delas.
 *
 * O conteúdo não aparece durante a travessia — o roteiro do dono pede isso — e
 * é o remapeamento que garante: em `p` menor que isto, o `pc` das fases é zero,
 * e no zero das fases nada foi desenhado ainda.
 */
const TRAVESSIA = 0.1875;

/** Mapeia `p` do intervalo [a, b] para [0, 1]. */
function range(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a));
}

/**
 * O sinal do lado "sem": anda e TRAVA em cada nó.
 *
 * Linear dentro do trecho, porque um sinal não tem ease — a regra já está
 * escrita no `connector-pulse` do index.css. A travada é o argumento da seção,
 * não um efeito: são nove paradas antes do vídeo existir.
 */
function stalled(t: number, segments: number) {
  const seg = 1 / segments;
  const index = Math.min(Math.floor(t / seg), segments - 1);
  const local = (t - index * seg) / seg;
  const moveFraction = 0.55;
  const advance = local < moveFraction ? local / moveFraction : 1;
  return (index + advance) / segments;
}

/**
 * Sem Doxa / Com Doxa — o comparativo.
 *
 * Fica entre o "Como funciona" e a prova social de propósito: o Como funciona
 * cria a objeção ("por que eu não contrato um filmmaker?"), esta seção responde,
 * e a ProofWall fecha. Invertendo, a prova chega antes da dúvida existir.
 *
 * A animação é imperativa (refs + `useAnimationFrame`) em vez de estado do
 * React: são 9 nós, 9 rótulos e 2 pulsos redesenhados a cada frame, e passar
 * isso por `useState` re-renderiza a árvore 60 vezes por segundo à toa.
 */
export function SemCom() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const semRef = useRef<HTMLDivElement>(null);
  const comRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const custoRef = useRef<HTMLDivElement>(null);
  const prazoRef = useRef<HTMLDivElement>(null);
  const conteudoRef = useRef<HTMLDivElement>(null);

  const pipeline = useRef<PipelineHandles>({
    wire: null,
    nodes: [],
    labels: [],
    pulse: null,
  });
  const hop = useRef<HopHandles>({ wire: null, pulse: null, cta: null });

  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  useAnimationFrame((time) => {
    const bruto = scrollYProgress.get();
    // O relógio do conteúdo começa onde a travessia termina. Todas as fases
    // abaixo leem `p`, que aqui já é o progresso remapeado — ver `TRAVESSIA`.
    const p = range(bruto, TRAVESSIA, 1);
    const clock = time / 1000;
    const n = STEPS.length;

    // O conteúdo só existe depois que a tinta cobriu a tela. As fases começam
    // apagadas por conta própria, mas os dois rótulos de cima ("Sem Doxa" e a
    // contagem de etapas) são estáticos: sem isto eles ficam legíveis no preto
    // durante a travessia inteira, que é exatamente o que o roteiro proíbe.
    if (conteudoRef.current != null) {
      conteudoRef.current.style.opacity = `${range(bruto, TRAVESSIA * 0.93, TRAVESSIA * 0.965)}`;
    }

    // Fase 1 — a tubulação se desenha, nó a nó. Longa de propósito.
    const build = range(p, 0.02, 0.4);
    const wire = pipeline.current.wire;
    if (wire != null) {
      const len = wire.getTotalLength();
      wire.style.strokeDasharray = `${len}`;
      wire.style.strokeDashoffset = `${len * (1 - build)}`;
    }

    pipeline.current.nodes.forEach((node, index) => {
      const on = clamp01((build - index / n) * 9);
      if (node != null) node.setAttribute('opacity', `${on}`);
      const label = pipeline.current.labels[index];
      if (label != null) {
        label.style.opacity = `${on * 0.95}`;
        label.style.transform = `translate(-50%, ${(1 - on) * 6}px)`;
      }
    });

    // Fase 2 — o pulso tenta atravessar e trava nove vezes.
    const crawling = p > 0.38 && p < 0.72;
    const semPulse = pipeline.current.pulse;
    if (semPulse != null) {
      if (crawling && reduced !== true) {
        const t = stalled((clock / 6.2) % 1, n);
        semPulse.setAttribute('cx', `${NODE_XS[0] + (NODE_XS[n - 1] - NODE_XS[0]) * t}`);
        semPulse.setAttribute('opacity', '1');
      } else {
        semPulse.setAttribute('opacity', crawling && reduced === true ? '1' : '0');
      }
    }

    // Fase 3 — a conta aparece enquanto o sinal ainda está preso.
    if (custoRef.current != null) custoRef.current.style.opacity = `${range(p, 0.46, 0.62)}`;
    if (prazoRef.current != null) prazoRef.current.style.opacity = `${range(p, 0.54, 0.68)}`;

    // Fase 4 — colapso: a tubulação perde luz e recua.
    const collapse = range(p, 0.72, 0.84);
    if (semRef.current != null) {
      semRef.current.style.opacity = `${1 - collapse}`;
      semRef.current.style.transform = `translateY(${collapse * -34}px) scale(${1 - collapse * 0.06})`;
    }

    // Fase 5 — dois nós, um fio, ar em volta.
    const reveal = range(p, 0.8, 0.92);
    if (comRef.current != null) {
      comRef.current.style.opacity = `${reveal}`;
      comRef.current.style.transform = `translateY(${(1 - reveal) * 22}px)`;
    }
    if (bloomRef.current != null) bloomRef.current.style.opacity = `${reveal * 0.9}`;

    const hopWire = hop.current.wire;
    if (hopWire != null) {
      const len = hopWire.getTotalLength();
      hopWire.style.strokeDasharray = `${len}`;
      hopWire.style.strokeDashoffset = `${len * (1 - range(p, 0.84, 0.95))}`;
    }

    const hopPulse = hop.current.pulse;
    if (hopPulse != null) {
      if (p > 0.86 && reduced !== true) {
        const cycle = (clock / 2.6) % 1;
        const t = cycle < 0.45 ? cycle / 0.45 : 1;
        hopPulse.setAttribute('cx', `${400 * t}`);
        hopPulse.setAttribute('opacity', cycle < 0.45 ? '1' : '0');

        // O sinal chega e o CTA acende: o fio existe para entregar a pessoa no
        // botão. Sem isso o pulso seria enfeite terminando em nada.
        if (hop.current.cta != null) {
          const landing = cycle >= 0.4 && cycle < 0.72 ? 1 - (cycle - 0.4) / 0.32 : 0;
          hop.current.cta.style.boxShadow = `0 0 ${18 + landing * 44}px rgba(222,219,200,${landing * 0.34})`;
        }
      } else {
        hopPulse.setAttribute('opacity', '0');
        if (hop.current.cta != null) hop.current.cta.style.boxShadow = '';
      }
    }
  });

  return (
    <section ref={wrapRef} className="relative h-[640vh] bg-doxa-bg">
      {/* O fundo é repetido aqui, e não só na `section`, porque `position:
          sticky` abre um contexto de empilhamento: o `difference` lá embaixo só
          enxerga o que foi pintado DENTRO deste div. Sem este preto ele
          inverteria o conteúdo sobre nada e a seção ficaria com texto escuro em
          fundo preto. */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-doxa-bg">
        <div
          ref={bloomRef}
          className="pointer-events-none absolute left-1/2 top-[58%] h-[520px] w-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(222,219,200,0.16), rgba(222,219,200,0) 62%)',
          }}
        />

        <div
          ref={conteudoRef}
          className="relative mx-auto w-full max-w-screen-2xl px-5 opacity-0 md:px-10"
        >
          <div ref={semRef}>
            <div className="mb-10 flex items-baseline gap-4">
              <span className="text-lg font-medium tracking-tight text-primary/40">Sem Doxa</span>
              <span className="text-xs uppercase tracking-[0.18em] text-doxa-muted">
                {STEPS.length} etapas
              </span>
            </div>

            <Pipeline handles={pipeline} />

            <div className="mt-24 flex flex-wrap items-end gap-12">
              <div ref={custoRef} className="opacity-0">
                <span className="block text-4xl font-medium leading-none tracking-[-0.045em] text-primary/60 tabular-nums md:text-5xl">
                  {CUSTO_SEM}
                </span>
                <span className="mt-2 block text-[0.68rem] uppercase tracking-[0.14em] text-doxa-muted">
                  por mês, todo mês
                </span>
              </div>
              <div ref={prazoRef} className="opacity-0">
                <span className="block text-4xl font-medium leading-none tracking-[-0.045em] text-primary/60 tabular-nums md:text-5xl">
                  {PRAZO_SEM}
                </span>
                <span className="mt-2 block text-[0.68rem] uppercase tracking-[0.14em] text-doxa-muted">
                  até o primeiro vídeo
                </span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-5 top-0 md:inset-x-10">
            <DoxaHop ref={comRef} handles={hop} />
          </div>
        </div>

        {/* O último filho, porque as duas camadas dele dependem de já estar tudo
            pintado: o papel inverte o que veio antes e a tinta cobre o que veio
            antes. Nenhum filho desta seção sabe que existe um modo claro, e
            nenhuma classe de cor precisou mudar. */}
        <PaintDrop progress={scrollYProgress} until={TRAVESSIA} />
      </div>
    </section>
  );
}
