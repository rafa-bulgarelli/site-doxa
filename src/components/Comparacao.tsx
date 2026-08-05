import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { MotionButton } from './ui/MotionButton';
import {
  APOIO,
  CUSTO,
  CUSTO_NOTA,
  ENVIO,
  GARANTIA,
  GESTO,
  PECAS,
  TITULO,
} from './comparacao/config';

const EASE = [0.16, 1, 0.3, 1] as const;
/** A queda tem aceleração: sai devagar e chega rápido, ao contrário de tudo o mais aqui. */
const EASE_QUEDA = [0.5, 0, 0.75, 0] as const;

/**
 * Inclinação de repouso de cada peça, em graus.
 *
 * Fixa por índice, e não sorteada: sorteio muda a cada render e a página passa
 * a ter uma aparência diferente a cada visita, o que é o oposto de uma marca.
 * Sete ângulos escolhidos a dedo parecem espalhados e são sempre os mesmos.
 */
const INCLINACAO = [-3.5, 2.2, -1.4, 3.1, -2.6, 1.7, -4.2];

/**
 * Sem Doxa / Com Doxa — a comparação, e o CTA da página.
 *
 * Substituiu uma linha do tempo de 640vh presa ao scroll. O diagnóstico do dono
 * foi que o site tinha animação demais, e o argumento que sustenta a troca é
 * mais forte do que gosto: esta é a seção onde se decide, e decidir exige poder
 * parar, reler as duas colunas e voltar o olho para cima. Scroll-jacking impede
 * exatamente isso. Aqui nada acontece porque a página rolou — o que se mexe se
 * mexe porque alguém apertou.
 *
 * Sete objetos contra um objeto: é uma comparação que se lê em um segundo sem
 * ler nada. E ela já está inteira em pé antes de qualquer clique, porque uma
 * seção de conversão não pode depender de um gesto para fazer sentido.
 */
export function Comparacao() {
  const [substituido, setSubstituido] = useState(false);
  const parado = useReducedMotion() === true;

  /** Quanto tempo cada peça espera para cair. Zero para quem pediu menos movimento. */
  const atraso = (i: number) => (parado ? 0 : substituido ? i * 0.07 : (PECAS.length - 1 - i) * 0.04);

  return (
    <section className="relative bg-doxa-bg px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
            {TITULO[0]}
            <br />
            {TITULO[1]}
          </h2>
          <p className="max-w-md text-sm text-white/60 md:text-base">{APOIO}</p>
        </div>

        <div className="mt-12 grid items-stretch gap-4 md:mt-16 lg:grid-cols-[1.25fr_1fr]">
          {/* ── A conta antiga. */}
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-doxa-surface p-6 md:p-8">
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Sem Doxa
                </span>
                <button
                  type="button"
                  onClick={() => setSubstituido(false)}
                  aria-hidden={!substituido}
                  tabIndex={substituido ? 0 : -1}
                  className={`flex items-center gap-1.5 text-[12px] text-white/45 transition-opacity duration-500 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                    substituido ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={2} />
                  de novo
                </button>
              </div>

              {/*
                O palco, e o único lugar do card que muda.

                As peças e a conta ocupam o MESMO slot, uma sobre a outra. É o
                que resolve o buraco que a queda deixava: derrubados os sete
                chips, o card não vira uma caixa vazia com um preço solto lá
                embaixo — a conta sobe para o lugar deles, em corpo de display e
                riscada. Sete contratos saem, um número cancelado entra, e o
                card diz a mesma coisa nos dois estados sem nunca ficar oco.

                `min-h` em vez de altura fixa: as peças embrulham em três linhas
                no telefone e em duas no desktop, e o palco tem de caber a maior
                das duas sem que ninguém tenha de decorar um número.
              */}
              <div className="relative my-8 flex min-h-[10.5rem] flex-1 items-center md:min-h-[9rem]">
                <div className="flex flex-wrap content-center items-center gap-2.5">
                  {PECAS.map(({ nome }, i) => (
                    <motion.span
                      key={nome}
                      initial={false}
                      animate={
                        substituido
                          ? { y: parado ? 0 : 90, rotate: parado ? 0 : INCLINACAO[i] * 4, opacity: 0 }
                          : { y: 0, rotate: INCLINACAO[i], opacity: 1 }
                      }
                      transition={{
                        duration: parado ? 0.2 : substituido ? 0.7 : 0.5,
                        ease: substituido ? EASE_QUEDA : EASE,
                        delay: atraso(i),
                      }}
                      className="rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-2 text-[14px] text-white/80"
                    >
                      {nome}
                    </motion.span>
                  ))}
                </div>

              </div>

              {/* A conta em repouso: some quando ela sobe para o palco, para não
                  existirem dois preços na mesma coluna. */}
              <motion.div
                className="border-t border-white/[0.09] pt-6"
                initial={false}
                animate={{ opacity: substituido ? 0 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="block font-serif text-3xl leading-none text-white/70 md:text-4xl">
                  {CUSTO}
                </span>
                <span className="mt-2 block text-[13px] text-white/35">{CUSTO_NOTA}</span>
              </motion.div>

              {/*
                A conta cancelada, e ela é medida contra o CARD inteiro, não
                contra o palco.

                Foi a primeira tentativa e estava errada: centrada no palco, ela
                sobe para onde as peças estavam e deixa embaixo o buraco do
                bloco que acabou de se apagar — invisível, mas ainda ocupando
                lugar. Sobre o card inteiro, ela cai no meio óptico do que se vê,
                e não sobra canto oco. `pointer-events-none` para não roubar o
                clique do "de novo", que fica logo acima dela.
              */}
              <motion.div
                aria-hidden={!substituido}
                className="pointer-events-none absolute inset-0 flex items-center"
                initial={false}
                animate={{ opacity: substituido ? 1 : 0, y: substituido ? 0 : 14 }}
                transition={{ duration: 0.6, ease: EASE, delay: substituido && !parado ? 0.45 : 0 }}
              >
                <div>
                  <span className="relative inline-block font-serif text-4xl leading-none text-white/55 md:text-5xl">
                    {CUSTO}
                    <motion.span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-white/55"
                      initial={false}
                      animate={{ scaleX: substituido ? 1 : 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                        delay: substituido && !parado ? 0.7 : 0,
                      }}
                    />
                  </span>
                  <span className="mt-3 block text-[13px] text-white/30">{CUSTO_NOTA}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── A peça única. Não muda de tamanho, muda de luz: layout que se
                mexe empurra o botão de lugar, e o botão é o que a seção existe
                para entregar. */}
          <motion.div
            initial={false}
            animate={{
              borderColor: substituido ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)',
            }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border bg-doxa-raised p-6 md:p-8"
          >
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(255,255,255,0.14),transparent_70%)]"
              initial={false}
              animate={{ opacity: substituido ? 1 : 0.25 }}
              transition={{ duration: 0.8, ease: EASE, delay: substituido && !parado ? 0.35 : 0 }}
            />

            <div className="relative flex h-full flex-col">
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">Com Doxa</span>

              <div className="my-8 flex flex-1 items-center">
                <p className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
                  {ENVIO[0]}
                  <br />
                  {ENVIO[1]}
                </p>
              </div>

              <div className="border-t border-white/[0.14] pt-6">
                <span className="block text-[13px] leading-relaxed text-white/70">{GARANTIA}</span>
                {/* PENDENTE-DONO: sem destino. O `CONTATO_URL` da seção antiga
                    também está vazio — enquanto o dono não define (Calendly,
                    WhatsApp ou formulário) o botão não navega, o que é melhor do
                    que um `href="#"`, que parece pronto e não é. */}
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
            onClick={() => setSubstituido(true)}
            disabled={substituido}
            className="rounded-full border border-white/[0.14] bg-white/[0.04] px-5 py-2.5 text-[13px] text-white/70 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-30"
          >
            {GESTO}
          </button>
        </div>
      </div>
    </section>
  );
}
