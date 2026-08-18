import type { ReactElement } from 'react';
import { urlDe } from '../indice';
import type { Secao } from '../tipos';

/**
 * O índice de uma seção (`/solucoes`, `/guias`…).
 *
 * Ele não tem corpo escrito à mão de propósito: um índice cujo texto é maior do
 * que a lista que ele indexa vira uma página de keyword com um menu no fim. O
 * que ele deve é o `h1`, uma frase que explica o que está listado e os links —
 * e ele só é GERADO se houver o que listar (ver `secoes()` em `indice.ts`).
 */
export function PaginaSecao({ secao }: { secao: Secao }): ReactElement {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
      <header className="max-w-3xl py-10 md:py-14">
        <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white md:text-6xl">
          {secao.h1}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{secao.resumo}</p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {secao.paginas.map((pagina) => (
          <li key={pagina.slug}>
            <a
              href={urlDe(pagina)}
              className="block h-full rounded-xl border border-doxa-line bg-doxa-surface p-6 transition-colors hover:border-white/25"
            >
              <span className="font-serif text-xl text-white">{pagina.h1}</span>
              <span className="mt-3 block text-[14px] leading-relaxed text-white/50">
                {pagina.resumo}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
