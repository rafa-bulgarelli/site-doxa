/**
 * ─── O RELÓGIO DAS CENAS ─────────────────────────────────────────────────────
 *
 * Toda cena do manual é um roteiro curto que recomeça: a história anda por
 * fases, a última fase segura o quadro final por uns segundos e a coisa volta
 * ao começo. Quem olha a página de longe vê um desenho parado; quem para para
 * ler pega a explicação inteira sem clicar em nada.
 *
 * Duas decisões moram aqui, e as duas existem para não repetir bug em quatro
 * arquivos:
 *
 * 1. **A fase é derivada, nunca acumulada.** O relógio guarda um número e cada
 *    peça da cena lê esse número para saber o que desenhar. Nada de guardar
 *    "já apareceu" em estado separado — dois estados sobre o mesmo instante é
 *    como uma cena fica meio no quadro velho e meio no novo depois de um loop.
 *
 * 2. **Quem pediu menos movimento recebe um DESENHO, não um filme parado no
 *    começo.** `useReducedMotion` congela a cena na fase que ENSINA — a do fim
 *    da história, com a resposta boa preenchida e o certo no lugar. Parar na
 *    fase 0 entregaria uma tela vazia, que é pior do que não ter cena.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** A curva do site para fade e deslize — a mesma de `HowItWorks`. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export interface Roteiro {
  /** A fase em cartaz. Com movimento reduzido, é sempre a fase parada. */
  readonly fase: number;
  /** Verdadeiro quando o sistema pediu menos movimento. */
  readonly parado: boolean;
}

/**
 * Toca `duracoes` em círculo e devolve a fase da vez.
 *
 * `duracoes` precisa ser uma constante de módulo: o array entra na dependência
 * do efeito, e um literal criado a cada render reiniciaria o timer toda vez —
 * a cena travaria na fase 0 sem erro nenhum no console.
 *
 * @param duracoes Milissegundos de cada fase, na ordem da história.
 * @param faseParada A fase servida a quem pediu menos movimento.
 */
export function useRoteiro(duracoes: readonly number[], faseParada: number): Roteiro {
  const parado = useReducedMotion() ?? false;
  const [fase, setFase] = useState(0);

  useEffect(() => {
    if (parado) return;
    const espera = duracoes[fase % duracoes.length];
    const id = setTimeout(() => {
      setFase((atual) => (atual + 1) % duracoes.length);
    }, espera);
    return () => clearTimeout(id);
  }, [fase, parado, duracoes]);

  return { fase: parado ? faseParada : fase, parado };
}

/**
 * A duração de uma transição, em segundos — zero quando a cena está parada.
 *
 * Zerar a duração é o que faz a versão sem movimento nascer JÁ no quadro certo,
 * em vez de fazer o percurso todo numa tacada só na primeira pintura.
 */
export function tempo(parado: boolean, segundos: number): number {
  return parado ? 0 : segundos;
}
