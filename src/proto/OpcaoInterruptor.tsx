import { useState } from 'react';
import { motion } from 'framer-motion';
import { MotionButton } from '../components/ui/MotionButton';
import { COM, ITENS, SEM } from './dados';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Opção A — o interruptor.
 *
 * Um card só, e a comparação acontece nos mesmos pixels: a lista fica parada e
 * o mundo em volta dela é que troca. O olho não viaja de uma coluna para a
 * outra tentando parear sete linhas — ele fica onde está e a realidade muda
 * embaixo dele.
 *
 * O botão é a única coisa que não se mexe em nenhum dos dois estados. Numa
 * seção que É o CTA, o elemento de conversão parado enquanto o resto muda é
 * vantagem de conversão, não de estética.
 */
export function OpcaoInterruptor() {
  const [com, setCom] = useState(false);
  const n = ITENS.length;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-doxa-surface p-6 md:p-10">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative">
          {/* O mesmo vocabulário do controle play/pause do HowItWorks. */}
          <div
            role="tablist"
            aria-label="Comparação"
            className="mx-auto flex w-fit rounded-full border border-white/[0.12] bg-white/[0.04] p-1"
          >
            {[
              { rotulo: SEM.titulo, ativo: !com },
              { rotulo: COM.titulo, ativo: com },
            ].map(({ rotulo, ativo }) => (
              <button
                key={rotulo}
                type="button"
                role="tab"
                aria-selected={ativo}
                onClick={() => setCom(rotulo === COM.titulo)}
                className="relative rounded-full px-5 py-2 text-[13px] font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              >
                {ativo && (
                  <motion.span
                    layoutId="interruptor"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className={`relative ${ativo ? 'text-black' : 'text-white/60'}`}>
                  {rotulo}
                </span>
              </button>
            ))}
          </div>

          <ul className="mt-9 flex flex-col">
            {ITENS.map(({ nome, sem, com: comLabel }, i) => (
              <li
                key={nome}
                className="flex h-12 items-center justify-between gap-4 border-b border-white/[0.07] last:border-0"
              >
                <span className="relative text-[15px] text-white md:text-base">
                  <motion.span
                    animate={{ opacity: com ? 0.4 : 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {nome}
                  </motion.span>
                  {/* O risco desenha na ida e desdesenha na volta, e a ordem se
                      inverte junto: entra de cima para baixo, sai de baixo para
                      cima. Uma lista que se desmonta na mesma ordem em que se
                      montou parece um vídeo rebobinando. */}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-white/70"
                    initial={false}
                    animate={{ scaleX: com ? 1 : 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: com ? i * 0.055 : (n - 1 - i) * 0.035,
                    }}
                  />
                </span>

                <span className="relative h-5 min-w-[9rem] text-right">
                  <motion.span
                    className="absolute inset-0 text-[13px] tracking-tight text-white/45"
                    initial={false}
                    animate={{ opacity: com ? 0 : 1, y: com ? -6 : 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: i * 0.04 }}
                  >
                    {sem}
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 text-[13px] tracking-tight text-white"
                    initial={false}
                    animate={{ opacity: com ? 1 : 0, y: com ? 0 : 6 }}
                    transition={{ duration: 0.35, ease: EASE, delay: com ? i * 0.055 : 0 }}
                  >
                    {comLabel}
                  </motion.span>
                </span>
              </li>
            ))}
          </ul>

          <div className="relative mt-8 h-[4.5rem] border-t border-white/[0.12] pt-6">
            <motion.div
              className="absolute inset-x-0 top-6"
              initial={false}
              animate={{ opacity: com ? 0 : 1, y: com ? -10 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="block font-serif text-3xl leading-none text-white md:text-4xl">
                {SEM.valor}
              </span>
              <span className="mt-2 block text-[13px] text-white/45">{SEM.nota}</span>
            </motion.div>

            <motion.div
              className="absolute inset-x-0 top-6"
              initial={false}
              animate={{ opacity: com ? 1 : 0, y: com ? 0 : 10 }}
              transition={{ duration: 0.4, ease: EASE, delay: com ? 0.42 : 0 }}
            >
              <span className="block font-serif text-3xl leading-none text-white md:text-4xl">
                {COM.valor}
              </span>
              <span className="mt-2 block text-[13px] text-white/70">{COM.nota}</span>
            </motion.div>
          </div>

          <div className="mt-10 flex justify-center">
            <MotionButton label="Quero viralizar" />
          </div>
        </div>
      </div>
    </div>
  );
}
