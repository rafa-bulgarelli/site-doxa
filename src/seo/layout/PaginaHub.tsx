import type { ReactElement } from 'react';
import { paginas, urlDe } from '../indice';
import type { Pagina, Tipo } from '../tipos';
import { Corpo } from './Blocos';
import { porExtenso } from './data';

/**
 * O layout de um hub — a página que segura um cluster.
 *
 * A lista de membros é DERIVADA: são as páginas cujo `hubs` inclui a URL deste
 * hub. Não há registro manual, e é isso que faz a arquitetura de autoridade do
 * §16 funcionar sozinha — quem escreve uma página nova declara o cluster dela e
 * o hub passa a linkar para ela no build seguinte, sem ninguém editar o hub.
 */

const NOME_DO_GRUPO: Record<Tipo, string> = {
  solucao: 'Soluções',
  plataforma: 'Plataformas',
  guia: 'Guias',
  comparativo: 'Comparativos',
  dor: 'Problemas comuns',
  glossario: 'Glossário',
  hub: 'Hubs',
};

/** Os membros do cluster, agrupados por tipo, na ordem em que os grupos existem. */
function grupos(urlDoHub: string): ReadonlyArray<{ tipo: Tipo; membros: readonly Pagina[] }> {
  const membros = paginas().filter(
    (pagina) => pagina.tipo !== 'hub' && pagina.hubs.some((hub) => hub === urlDoHub),
  );
  const tipos = [...new Set(membros.map((pagina) => pagina.tipo))];
  return tipos.map((tipo) => ({
    tipo,
    membros: membros.filter((pagina) => pagina.tipo === tipo),
  }));
}

export function PaginaHub({ pagina }: { pagina: Pagina }): ReactElement {
  const lista = grupos(urlDe(pagina));
  return (
    <article className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
      <header className="max-w-3xl py-10 md:py-14">
        <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white md:text-5xl">
          {pagina.h1}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{pagina.resumo}</p>
      </header>

      <div className="max-w-3xl">
        <Corpo blocos={pagina.corpo} />
      </div>

      {lista.map((grupo) => (
        <section key={grupo.tipo} className="pt-12">
          <h2 className="font-serif text-2xl text-white md:text-3xl">
            {NOME_DO_GRUPO[grupo.tipo]}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grupo.membros.map((membro) => (
              <li key={membro.slug}>
                <a
                  href={urlDe(membro)}
                  className="block h-full rounded-xl border border-doxa-line bg-doxa-surface p-5 transition-colors hover:border-white/25 md:p-6"
                >
                  <span className="font-serif text-lg text-white">{membro.h1}</span>
                  <span className="mt-2 block text-[14px] leading-relaxed text-white/50">
                    {membro.resumo}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-12 border-t border-doxa-line py-6 text-[13px] text-white/30">
        Conteúdo atualizado em{' '}
        <time dateTime={pagina.atualizadoEm}>{porExtenso(pagina.atualizadoEm)}</time>.
      </p>
    </article>
  );
}
