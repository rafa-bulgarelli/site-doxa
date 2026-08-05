import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { MotionButton } from '../components/ui/MotionButton';
import { COM, ITENS, SEM } from './dados';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Inclinação de repouso de cada peça, em graus.
 *
 * Fixa por índice, e não sorteada: sorteio muda a cada render e a página passa a
 * ter uma aparência diferente a cada visita, o que é o oposto de uma marca. Sete
 * ângulos escolhidos a dedo parecem espalhados e são sempre os mesmos.
 */
const INCLINACAO = [-3.5, 2.2, -1.4, 3.1, -2.6, 1.7, -4.2];

/**
 * Opção C — sete peças, uma peça.
 *
 * Metáfora física em vez de tabela: sete objetos contra um objeto, que é uma
 * comparação que se lê em um segundo sem ler nada.
 *
 * O movimento é disparado pelo visitante e acontece uma vez. É a diferença que
 * importa nesta seção: nada acontece porque a página rolou, tudo acontece porque
 * alguém apertou.
 */
export function OpcaoPecas() {
  const [derrubado, setDerrubado] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid items-stretch gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* As sete contratações. */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-doxa-surface p-6 md:p-8">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                {SEM.titulo}
              </span>
              <motion.button
                type="button"
                onClick={() => setDerrubado(false)}
                initial={false}
                animate={{ opacity: derrubado ? 1 : 0 }}
                className="flex items-center gap-1.5 text-[12px] text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                aria-hidden={!derrubado}
                tabIndex={derrubado ? 0 : -1}
              >
                <RotateCcw className="h-3 w-3" strokeWidth={2} />
                de novo
              </motion.button>
            </div>

            <div className="my-8 flex flex-1 flex-wrap content-center items-center gap-2.5">
              {ITENS.map(({ nome }, i) => (
                <motion.span
                  key={nome}
                  initial={false}
                  animate={
                    derrubado
                      ? { y: 90, rotate: INCLINACAO[i] * 4, opacity: 0 }
                      : { y: 0, rotate: INCLINACAO[i], opacity: 1 }
                  }
                  transition={{
                    duration: derrubado ? 0.7 : 0.5,
                    ease: derrubado ? [0.5, 0, 0.75, 0] : EASE,
                    delay: derrubado ? i * 0.07 : (ITENS.length - 1 - i) * 0.04,
                  }}
                  className="rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-2 text-[14px] text-white/80"
                >
                  {nome}
                </motion.span>
              ))}
            </div>

            <div className="border-t border-white/[0.09] pt-6">
              <span className="block font-serif text-3xl leading-none text-white/70 md:text-4xl">
                {SEM.valor}
              </span>
              <span className="mt-2 block text-[13px] text-white/35">{SEM.nota}</span>
            </div>
          </div>
        </div>

        {/* A peça única. Acende quando as outras caem — o card não muda de
            tamanho, muda de luz: layout que se mexe empurra o botão de lugar. */}
        <motion.div
          initial={false}
          animate={{
            borderColor: derrubado ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)',
          }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border bg-doxa-raised p-6 md:p-8"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(255,255,255,0.14),transparent_70%)]"
            initial={false}
            animate={{ opacity: derrubado ? 1 : 0.25 }}
            transition={{ duration: 0.8, ease: EASE, delay: derrubado ? 0.35 : 0 }}
          />

          <div className="relative flex h-full flex-col">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              {COM.titulo}
            </span>

            <div className="my-8 flex flex-1 items-center">
              <p className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
                Uma foto.
                <br />
                Um áudio de 30s.
              </p>
            </div>

            <div className="border-t border-white/[0.14] pt-6">
              <span className="block text-[13px] leading-relaxed text-white/70">{COM.nota}</span>
              <div className="mt-6">
                <MotionButton label="Quero viralizar" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setDerrubado(true)}
          className="rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-2.5 text-[13px] text-white/70 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          Substituir tudo isso
        </button>
      </div>
    </div>
  );
}
