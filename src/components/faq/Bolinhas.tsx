import { AnimatePresence, motion } from 'framer-motion';

/** Um ponto: o que ele marca e de que cor ele é. */
export interface Ponto {
  /** Estável e único — é a chave do React, não o rótulo de nada. */
  chave: string;
  cor: string;
}

/**
 * A mola de borracha: como cada ponto chega.
 *
 * `damping` baixo contra `stiffness` alto é o que faz o ponto passar do lugar,
 * voltar e assentar — a tal borracha. Com o amortecimento no valor de sempre
 * (30) a mesma mola vira um deslize educado, e o pedido era o contrário disso.
 *
 * `mass` abaixo de um para o repique ser CURTO. Uma bolinha de dois pixels que
 * balança por um segundo inteiro lê como algo quebrado, não como algo elástico:
 * o gesto tem de terminar quase junto com o olho que o pegou.
 */
const BORRACHA = { type: 'spring' as const, stiffness: 520, damping: 11, mass: 0.55 };

/**
 * Os pontos que contam o que já foi respondido.
 *
 * Substituem o "01 de 06" que havia aqui, e a troca vale pelo que um número não
 * faz: seis pontos dizem o total num relance, sem ninguém ter de ler nem
 * comparar dois algarismos. Quantos estão acesos é a resposta; quantos faltam
 * está no espaço vazio ao lado — e o vazio é o que convida a continuar
 * perguntando.
 *
 * Sobem de BAIXO para cima porque é de baixo que eles vêm: a pergunta é feita no
 * campo, que fica abaixo deste cabeçalho. O ponto entra pelo lado de onde a
 * causa dele estava.
 *
 * As cores são a exceção declarada em `cores.ts`. O que elas fazem aqui não é
 * enfeite: cada dúvida tem a SUA, e é a mesma que reaparece na lista de
 * respostas — é o que liga um ponto do cabeçalho a uma resposta lá embaixo sem
 * precisar de legenda.
 */
export function Bolinhas({
  pontos,
  parado,
  tamanho = 'h-2 w-2',
}: {
  pontos: readonly Ponto[];
  parado: boolean;
  tamanho?: string;
}) {
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      <AnimatePresence initial={false}>
        {pontos.map((ponto) => (
          <motion.span
            key={ponto.chave}
            layout={!parado}
            initial={parado ? undefined : { y: 10, scale: 0, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }}
            transition={parado ? { duration: 0 } : BORRACHA}
            className={`${tamanho} shrink-0 rounded-full`}
            /* A auréola é a própria cor a 45%, e não um branco por baixo: sobre
               preto, um ponto de dois pixels sem halo lê como sujeira na tela —
               com ele, lê como algo aceso. */
            style={{ backgroundColor: ponto.cor, boxShadow: `0 0 8px 0 ${ponto.cor}73` }}
          />
        ))}
      </AnimatePresence>
    </span>
  );
}
