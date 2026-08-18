import type { ReactElement } from 'react';
import { HREF_CTA } from '../site';
import type { Pagina } from '../tipos';
import { Corpo } from './Blocos';
import { porExtenso } from './data';

/**
 * O layout de uma página de intenção comercial: `solucao` e `plataforma`.
 *
 * A diferença para `PaginaArtigo` é a ORDEM do que a pessoa vê primeiro. Quem
 * busca "produção de vídeos com IA para empresas" já sabe o que quer e está
 * comparando fornecedores: o h1, a frase que responde e o caminho para falar
 * com alguém vêm antes de qualquer explicação. Quem busca "o que é UGC" está
 * lendo, e ali o índice vale mais do que o botão (§37).
 *
 * O layout não escreve copy. "Onde a Doxa entra" é um `titulo` no corpo da
 * página, escrito por quem escreveu o resto — um bloco fixo aqui apareceria
 * idêntico em todas as soluções, que é a repetição que o §29 proíbe.
 */
export function PaginaSolucao({ pagina }: { pagina: Pagina }): ReactElement {
  return (
    <article className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
      <header className="border-b border-doxa-line py-10 md:py-14">
        <h1 className="max-w-4xl font-serif text-[2.6rem] leading-[1.05] text-white md:text-6xl">
          {pagina.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          {pagina.resumo}
        </p>
        <a
          href={HREF_CTA}
          className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-bold text-black transition-colors hover:bg-white/85"
        >
          Falar com a Doxa
        </a>
      </header>

      {/* `max-w-3xl` e não a caixa inteira: a medida de leitura confortável é de
          65 a 75 caracteres, e um parágrafo atravessando 1536px cansa na
          terceira linha. O cabeçalho acima usa a caixa toda de propósito — ele
          é manchete, não leitura. */}
      <div className="max-w-3xl pb-4">
        <Corpo blocos={pagina.corpo} />
      </div>

      <p className="border-t border-doxa-line py-6 text-[13px] text-white/30">
        Conteúdo atualizado em{' '}
        <time dateTime={pagina.atualizadoEm}>{porExtenso(pagina.atualizadoEm)}</time>.
      </p>
    </article>
  );
}
