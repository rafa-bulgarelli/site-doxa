import type { ReactElement } from 'react';
import { slugificar } from '../inline';
import type { Pagina } from '../tipos';
import { Corpo } from './Blocos';
import { porExtenso } from './data';

/**
 * O layout do conteúdo editorial: `guia`, `dor`, `comparativo` e `glossario`.
 *
 * O índice é feito de ÂNCORAS `<a href="#...">`, não de um componente que
 * escuta rolagem. Ele funciona com o JS desligado, é o que o §28 pede, e de
 * quebra sobrevive a alguém copiar o link de uma seção — que é o uso real de
 * um índice em página longa.
 */

/** Os `<h2>` do corpo, na ordem em que aparecem. */
function ancoras(pagina: Pagina): ReadonlyArray<{ id: string; texto: string }> {
  return pagina.corpo
    .filter((bloco) => bloco.tipo === 'titulo' && bloco.nivel === 2)
    .map((bloco) => {
      if (bloco.tipo !== 'titulo') throw new Error('Filtro de título deixou passar outro bloco.');
      return { id: slugificar(bloco.texto), texto: bloco.texto };
    });
}

export function PaginaArtigo({ pagina }: { pagina: Pagina }): ReactElement {
  const indice = ancoras(pagina);
  return (
    <article className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
      <header className="max-w-3xl py-10 md:py-14">
        <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white md:text-5xl">
          {pagina.h1}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{pagina.resumo}</p>
      </header>

      {/* Só com três seções ou mais: um índice de duas linhas ocupa uma dobra
          para poupar uma rolagem que ninguém ia dar. */}
      {indice.length >= 3 ? (
        <nav
          aria-label="Neste conteúdo"
          className="mb-8 max-w-3xl rounded-xl border border-doxa-line bg-doxa-surface p-5 md:p-6"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Neste conteúdo</p>
          <ol className="mt-3 space-y-2 text-[15px]">
            {indice.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {item.texto}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="max-w-3xl pb-4">
        <Corpo blocos={pagina.corpo} />
      </div>

      <p className="max-w-3xl border-t border-doxa-line py-6 text-[13px] text-white/30">
        Conteúdo atualizado em {porExtenso(pagina.atualizadoEm)}.
      </p>
    </article>
  );
}
