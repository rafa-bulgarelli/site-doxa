import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ITENS, TEMPO } from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * De quanto em quanto tempo entra o próximo item, em segundos.
 *
 * Vinte e cinco itens a trinta e cinco milésimos dão pouco menos de um segundo:
 * rápido o bastante para ninguém esperar, lento o bastante para a conta parecer
 * que está sendo somada na frente da pessoa. É a diferença entre uma lista que
 * aparece e uma lista que se ACUMULA — e o acúmulo é o argumento inteiro.
 */
const CASCATA = 0.035;

/**
 * A conta do jeito antigo, escrita como uma ladainha.
 *
 * Substituiu cinco colunas de ficha técnica, e a troca é de tom. Colunas com
 * rótulo — Equipe, Equipamento, Estrutura — organizam um inventário e leem como
 * catálogo de fornecedor. O dono pediu que a lista doesse no empresário, não que
 * ela catalogasse equipamento: em corrido, com o artigo na frente de cada item,
 * ela vira o que é — uma coisa depois da outra depois da outra, que é como a
 * conta chega no fim do mês.
 *
 * Tipo grande e corrido também é o que enche a metade de cima da tela sem
 * decorar nada, e encher só a metade de cima é requisito: o painel claro entra
 * girado e cobre o terço de baixo, então o terço de baixo não pode ter conteúdo.
 */
export function Ladainha() {
  const ref = useRef<HTMLParagraphElement>(null);
  const naTela = useInView(ref, { amount: 0.2, once: true });

  return (
    <p
      ref={ref}
      className="max-w-6xl font-serif text-[22px] leading-[1.45] tracking-[-0.01em] text-white/45 md:text-[2.25rem] md:leading-[1.42]"
    >
      {ITENS.map((item, i) => (
        <motion.span
          key={item}
          initial={{ opacity: 0 }}
          animate={naTela ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, ease: EASE, delay: i * CASCATA }}
          className="mr-[0.4em] inline-block"
        >
          {item}
        </motion.span>
      ))}

      {/* A última, em creme e cheia: as vinte e cinco são coisas que se compram,
          e esta é a que não tem preço. É também a ponte para o painel claro, que
          é a única outra coisa creme da página. */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={naTela ? { opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE, delay: ITENS.length * CASCATA + 0.2 }}
        className="inline-block text-[#F4F1E8]"
      >
        {TEMPO}
      </motion.span>
    </p>
  );
}
