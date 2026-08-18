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
 *
 * ─── QUANDO ELE VIRA COLUNA ──────────────────────────────────────────────────
 *
 * A partir de QUATRO seções, e só no desktop, o índice sai do fluxo e vira uma
 * coluna `sticky` ao lado do texto. O motivo é o mesmo que o do índice existir:
 * num artigo de quatro seções ou mais, a pessoa que rolou até o meio perdeu o
 * mapa — e um índice que já rolou para fora da tela não é mapa nenhum. Com
 * três, a coluna custaria um terço da largura para listar três linhas.
 *
 * `position: sticky` e nada além disso: sem observador de rolagem, sem estado,
 * sem "seção ativa". No telefone o índice continua onde sempre esteve, em cima
 * do texto — `sticky` numa tela estreita cobriria o conteúdo que ele indexa.
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

/** O cartão do índice. O mesmo desenho nos dois lugares onde ele pode ficar. */
function Sumario({
  itens,
  lateral,
}: {
  itens: ReadonlyArray<{ id: string; texto: string }>;
  lateral: boolean;
}): ReactElement {
  return (
    <nav
      aria-label="Neste conteúdo"
      className={
        lateral
          ? 'mb-8 rounded-xl border border-doxa-line bg-doxa-surface p-5 lg:order-2 lg:mb-0 lg:sticky lg:top-8 md:p-6'
          : 'mb-8 max-w-3xl rounded-xl border border-doxa-line bg-doxa-surface p-5 md:p-6'
      }
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Neste conteúdo</p>
      <ol className="mt-3 space-y-2 text-[15px]">
        {itens.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-white/60 transition-colors hover:text-white">
              {item.texto}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PaginaArtigo({ pagina }: { pagina: Pagina }): ReactElement {
  const indice = ancoras(pagina);
  // Três seções: cartão em cima do texto. Quatro ou mais: coluna que acompanha
  // a rolagem. Menos de três: nenhum — um índice de duas linhas ocupa uma dobra
  // para poupar uma rolagem que ninguém ia dar.
  const temSumario = indice.length >= 3;
  const lateral = indice.length >= 4;
  return (
    <article className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
      <header className="max-w-3xl py-10 md:py-14">
        <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white md:text-5xl">
          {pagina.h1}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">{pagina.resumo}</p>
      </header>

      {/* `items-start` é o que faz o `sticky` funcionar: um item de grid é
          esticado até a altura da linha por padrão, e uma caixa da altura do
          artigo inteiro nunca tem para onde grudar. */}
      <div
        className={
          lateral
            ? 'lg:grid lg:grid-cols-[minmax(0,48rem)_minmax(0,17rem)] lg:items-start lg:gap-12'
            : undefined
        }
      >
        {temSumario ? <Sumario itens={indice} lateral={lateral} /> : null}

        <div className={lateral ? 'pb-4 lg:order-1' : 'max-w-3xl pb-4'}>
          <Corpo blocos={pagina.corpo} />
        </div>
      </div>

      {/* `<time>` com `dateTime`: por extenso para quem lê, em AAAA-MM-DD para
          quem indexa. É a mesma data que vira `dateModified` no JSON-LD, e é
          por isso que o schema não contradiz a página (§46). */}
      <p className="max-w-3xl border-t border-doxa-line py-6 text-[13px] text-white/30">
        Conteúdo atualizado em{' '}
        <time dateTime={pagina.atualizadoEm}>{porExtenso(pagina.atualizadoEm)}</time>.
      </p>
    </article>
  );
}
