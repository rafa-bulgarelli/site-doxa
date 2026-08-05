import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { INVENTARIO, TEMPO } from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * De quanto em quanto tempo entra a próxima linha, em segundos.
 *
 * Vinte e cinco linhas a vinte e dois milésimos dão pouco mais de meio segundo
 * de cascata: rápido o bastante para não fazer ninguém esperar e lento o
 * bastante para a lista parecer que está sendo escrita. É a diferença entre uma
 * lista que aparece e uma lista que se acumula — e o argumento desta seção é o
 * acúmulo.
 */
const CASCATA = 0.022;

/**
 * O inventário do jeito antigo, como uma ficha técnica.
 *
 * Substituiu oito pastilhas com física. A troca é de argumento, não de enfeite:
 * sete formas coloridas mostram sete coisas, e vinte e cinco linhas em cinco
 * colunas mostram um problema. Ninguém precisa ler item a item — a seção quer
 * que a pessoa VEJA que são vinte e cinco, e uma ficha técnica é a forma que
 * comunica quantidade sem pedir leitura.
 *
 * Tipografia e fio, nada mais. É o vocabulário do resto do site, e é o que
 * permite encher uma tela inteira sem decorar nada.
 */
export function Inventario() {
  const ref = useRef<HTMLDivElement>(null);
  const naTela = useInView(ref, { amount: 0.25, once: true });

  // A ordem da cascata é a de leitura: coluna por coluna, de cima para baixo. O
  // índice corre por todas as colunas, e não reinicia em cada uma, senão as
  // cinco primeiras linhas entram juntas e a cascata vira um piscar.
  let indice = 0;

  return (
    <div
      ref={ref}
      className="grid w-full grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8"
    >
      {INVENTARIO.map(({ nome, itens }, coluna) => (
        <div
          key={nome}
          className={
            coluna > 0 ? 'lg:border-l lg:border-white/[0.07] lg:pl-8' : undefined
          }
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">{nome}</span>
            <span className="text-[11px] tabular-nums text-white/20">{itens.length}</span>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {itens.map((item) => {
              const atraso = indice * CASCATA;
              indice += 1;
              return (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={naTela ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.5, ease: EASE, delay: atraso }}
                  className="text-[15px] leading-snug text-white/70"
                >
                  {item}
                </motion.li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* A vigésima sexta linha, do outro lado de um fio, em creme: a lista toda
          é de coisas que se compram, e esta é a que não tem preço. Ocupa a
          largura inteira porque não pertence a nenhuma das cinco colunas. */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={naTela ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay: indice * CASCATA + 0.15 }}
        className="col-span-2 border-t border-white/[0.09] pt-5 font-serif text-2xl text-[#F4F1E8] sm:col-span-3 md:text-3xl lg:col-span-5"
      >
        {TEMPO}
      </motion.p>
    </div>
  );
}
