import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import wordmarkUrl from '../../brand/doxa-wordmark-white.png';
import { MotionButton } from './ui/MotionButton';
import { Blocos } from './comparacao/Blocos';
import { Cases } from './comparacao/Cases';
import {
  APOIO,
  CUSTO,
  CUSTO_NOTA,
  CUSTO_UNIDADE,
  ENVIO,
  GARANTIA,
  RECORRENCIA,
  TITULO,
} from './comparacao/config';

const EASE = [0.16, 1, 0.3, 1] as const;

/** A cor do papel do card vencedor — a mesma da marca d'água clara do site. */
const PAPEL = '#F4F1E8';

/**
 * A entrada da seção, em degraus.
 *
 * O dono pediu que a seção "carregasse" em vez de simplesmente estar lá. A
 * ordem é a ordem da leitura: título, card da conta, card da Doxa, e só então
 * as peças caem dentro do primeiro — a queda é o último degrau porque é ela que
 * chama a atenção, e chamar a atenção antes de haver o que ler é desperdiçar o
 * gesto.
 */
const SOBE = {
  oculto: { opacity: 0, y: 26 },
  visivel: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE, delay: 0.08 + i * 0.14 },
  }),
};

/** O logo no lugar da palavra, como o dono pediu: "Sem [DOXA]" e "Com [DOXA]". */
function Selo({ prefixo, escuro = false }: { prefixo: string; escuro?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span
        className={`text-[11px] uppercase tracking-[0.18em] ${escuro ? 'text-black/45' : 'text-white/40'}`}
      >
        {prefixo}
      </span>
      {/* A arte é branca sobre transparente — no card creme ela vira tinta com
          um `invert`, que é exato para um PNG de um só tom. Card 002 quer isto
          vetorizado; enquanto for bitmap, é assim que se consegue as duas cores
          a partir de um arquivo. */}
      <img
        src={wordmarkUrl}
        alt="Doxa"
        className={`h-[13px] w-auto ${escuro ? 'opacity-90 invert' : 'opacity-70'}`}
      />
    </span>
  );
}

/**
 * Sem Doxa / Com Doxa — a comparação, e o CTA da página.
 *
 * Sete objetos contra um objeto: uma comparação que se lê em um segundo sem ler
 * nada. Nada aqui acontece porque a página rolou — a seção entra quando entra na
 * tela e depois disso só se mexe o que a mão do visitante mexer.
 *
 * O peso é assimétrico de propósito. A conta antiga é uma superfície escura com
 * sete pastilhas coloridas de gente de fora; a Doxa é papel creme, a única coisa
 * clara da página inteira, com o pedido dentro. Comparação simétrica sugere que
 * as duas opções são comparáveis, e a tese da página é que uma substitui a
 * outra.
 */
export function Comparacao() {
  const secaoRef = useRef<HTMLElement>(null);
  const naTela = useInView(secaoRef, { amount: 0.15, once: true });

  return (
    <section ref={secaoRef} className="relative bg-doxa-bg px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-screen-2xl">
        <motion.div
          custom={0}
          variants={SOBE}
          initial="oculto"
          animate={naTela ? 'visivel' : 'oculto'}
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        >
          <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
            {TITULO[0]}
            <br />
            {TITULO[1]}
          </h2>
          <p className="max-w-md text-sm text-white/60 md:text-base">{APOIO}</p>
        </motion.div>

        <div className="mt-12 grid items-stretch gap-4 md:mt-16 lg:grid-cols-[1.15fr_1fr]">
          {/* ── A conta antiga. */}
          <motion.div
            custom={1}
            variants={SOBE}
            initial="oculto"
            animate={naTela ? 'visivel' : 'oculto'}
            className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-doxa-surface p-6 md:p-8"
          >
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative flex h-full flex-col">
              <Selo prefixo="Sem" />

              {/* O palco cresce com o card: a coluna da direita é mais alta por
                  causa dos cases, o grid estica esta aqui para acompanhar, e um
                  palco de altura fixa deixaria as peças descansando no meio do
                  nada com um vão embaixo delas. */}
              <div className="my-8 flex min-h-0 flex-1">
                <Blocos />
              </div>

              <div className="border-t border-white/[0.09] pt-6">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                  <span className="font-serif text-4xl leading-none text-white md:text-5xl">
                    {CUSTO}
                    <span className="ml-1 align-baseline text-2xl text-white/45 md:text-3xl">
                      {CUSTO_UNIDADE}
                    </span>
                  </span>
                  {/* A recorrência dita de novo, e em caixa alta: é a diferença
                      entre a conta parecer cara e parecer uma sangria. */}
                  <span className="rounded-full border border-white/[0.14] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/60">
                    {RECORRENCIA}
                  </span>
                </div>
                <span className="mt-3 block text-[13px] text-white/35">{CUSTO_NOTA}</span>
              </div>
            </div>
          </motion.div>

          {/* ── A Doxa. A única superfície clara do site: se a seção inteira é o
                pedido, o pedido tem de ser a coisa mais acesa da tela. */}
          <motion.div
            custom={2}
            variants={SOBE}
            initial="oculto"
            animate={naTela ? 'visivel' : 'oculto'}
            style={{ background: PAPEL }}
            className="relative overflow-hidden rounded-3xl p-6 shadow-[0_50px_120px_-50px_rgba(244,241,232,0.45)] md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(255,255,255,0.9),transparent_65%)]" />

            <div className="relative flex h-full flex-col">
              <Selo prefixo="Com" escuro />

              <p className="mt-7 font-serif text-[2.6rem] leading-[0.98] tracking-[-0.03em] text-[#0B0B0B] md:text-6xl">
                {ENVIO[0]}
                <br />
                {ENVIO[1]}
              </p>

              {/* O que sai disso, para a pergunta não ficar no ar. São os
                  mesmos arquivos da parede de prova — nada aqui é caso novo. */}
              <div className="mt-7">
                <Cases />
              </div>

              <div className="mt-auto border-t border-black/10 pt-6">
                <p className="font-serif text-2xl leading-[1.1] tracking-[-0.02em] text-[#0B0B0B] md:text-[1.75rem]">
                  {GARANTIA[0]}
                  <br />
                  <span className="text-black/55">{GARANTIA[1]}</span>
                </p>

                {/* PENDENTE-DONO: sem destino. Enquanto o dono não define
                    (Calendly, WhatsApp ou formulário) o botão não navega, o que
                    é melhor do que um `href="#"`, que parece pronto e não é. */}
                <div className="mt-6">
                  <MotionButton label="Quero viralizar" variant="inverse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
