import { useState } from 'react';
import { motion } from 'framer-motion';
import { MotionButton } from '../components/ui/MotionButton';
import { COM, ITENS, SEM } from './dados';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Altura de linha comum às três colunas — é ela que mantém os pares alinhados. */
const LINHA = 'h-11';

/**
 * Opção B — a conta riscada.
 *
 * Os dois estados coexistem: a esquerda é um orçamento, a direita é o mesmo
 * orçamento cancelado. Ninguém precisa tocar em nada para entender.
 *
 * O que a mão faz aqui é parear: o ponteiro sobre uma linha da esquerda acende
 * a linha correspondente da direita e desenha o fio entre as duas. Sete pares,
 * um de cada vez.
 *
 * A coluna do meio existe só para o fio, e ela repete as mesmas linhas de altura
 * fixa das outras duas. É o que garante o alinhamento sem conta de pixel: se as
 * três colunas têm as mesmas sete alturas, o fio da linha `i` nasce onde o item
 * `i` está, em qualquer largura de tela.
 */
export function OpcaoConta() {
  const [ativo, setAtivo] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_5rem_1fr] lg:gap-0">
        {/* Coluna apagada: o que se paga hoje. */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-doxa-surface p-6 md:p-8">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              {SEM.titulo}
            </span>

            <ul className="mt-6 flex flex-col" onMouseLeave={() => setAtivo(null)}>
              {ITENS.map(({ nome, sem }, i) => (
                <li
                  key={nome}
                  onMouseEnter={() => setAtivo(i)}
                  className={`${LINHA} flex cursor-default items-center justify-between gap-4 border-b border-white/[0.06] transition-colors duration-300 last:border-0 ${
                    ativo === i ? 'text-white' : 'text-white/45'
                  }`}
                >
                  <span className="text-[15px]">{nome}</span>
                  <span className="text-[13px] tabular-nums opacity-70">{sem}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/[0.09] pt-6">
              <span className="block font-serif text-3xl leading-none text-white/70 md:text-4xl">
                {SEM.valor}
              </span>
              <span className="mt-2 block text-[13px] text-white/35">{SEM.nota}</span>
            </div>
          </div>
        </div>

        {/* O vão, e os fios. Some no empilhamento do mobile: sem as duas colunas
            lado a lado não há o que ligar. */}
        <div className="relative hidden lg:block">
          <div className="flex flex-col pt-[4.5rem]">
            {ITENS.map(({ nome }, i) => (
              <div key={nome} className={`${LINHA} flex items-center`}>
                <motion.div
                  className="h-px w-full origin-left bg-gradient-to-r from-white/50 to-white/50"
                  initial={false}
                  animate={{ scaleX: ativo === i ? 1 : 0, opacity: ativo === i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna acesa: a mesma conta, cancelada. */}
        <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-doxa-raised p-6 shadow-[0_40px_90px_-40px_rgba(255,255,255,0.18)] md:p-8">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_-20%,rgba(255,255,255,0.10),transparent_70%)]" />
          <div className="relative">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              {COM.titulo}
            </span>

            <ul className="mt-6 flex flex-col">
              {ITENS.map(({ nome, com }, i) => (
                <li
                  key={nome}
                  className={`${LINHA} flex items-center justify-between gap-4 border-b border-white/[0.08] transition-colors duration-300 last:border-0 ${
                    ativo === i ? 'text-white' : 'text-white/55'
                  }`}
                >
                  <span className="relative text-[15px]">
                    {nome}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-px w-full bg-current opacity-60"
                    />
                  </span>
                  <span className="text-[13px] opacity-80">{com}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/[0.14] pt-6">
              <span className="block font-serif text-3xl leading-none text-white md:text-4xl">
                {COM.valor}
              </span>
              <span className="mt-2 block text-[13px] text-white/70">{COM.nota}</span>
            </div>

            <div className="mt-8">
              <MotionButton label="Quero viralizar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
