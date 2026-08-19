import type { ReactElement } from 'react';
import { secoes } from '../indice';
import { IDIOMA, NOME } from '../site';
import { Cabecalho } from './Cabecalho';
import { Rodape } from './Rodape';

/**
 * O DOCUMENTO de 404 — `dist/404.html`, servido pela Vercel em todo caminho
 * que não existe.
 *
 * ─── POR QUE ELE NÃO USA A `Casca` ───────────────────────────────────────────
 *
 * A `Casca` emite SEMPRE um `<link rel="canonical">` e uma trilha de migalhas,
 * e as duas coisas estão erradas aqui. Canonical é a página dizendo "este é o
 * meu endereço definitivo" — mas este documento é servido em `/guias/nao-existe`,
 * em `/xpto` e em qualquer outro caminho morto: um canonical apontaria todos
 * eles para a mesma URL e pediria ao Google que indexasse o erro. Migalha é
 * "por onde você veio"; ninguém veio por lugar nenhum. Então o `<head>` é
 * escrito aqui, curto e com `noindex`, e o que se reaproveita são as duas peças
 * que fazem esta página parecer a mesma casa: `Cabecalho` e `Rodape`.
 *
 * Ele também NÃO entra em `rotas()` nem no `sitemap.xml`. As duas listas
 * descrevem o que o site publica e quer indexado; uma página de erro é o
 * contrário disso. Quem o escreve é o `prerender.mjs`, direto na raiz de
 * `dist/`, que é onde a Vercel procura o arquivo de 404.
 *
 * Zero JS, como toda página do motor SEO: o servidor responde 404 e o HTML já
 * está legível — inclusive para quem chegou com o JS bloqueado.
 */

export interface PropsPagina404 {
  /** O `href` do CSS do build cliente, extraído de `dist/index.html`. */
  cssHref: string;
}

const TITULO = `Página não encontrada — ${NOME}`;

/**
 * Os atalhos: os índices de seção e a home.
 *
 * Saem de `secoes()` — o que ESTE build publicou — pelo mesmo motivo do
 * cabeçalho e do rodapé. Uma lista escrita à mão aqui apontaria para uma seção
 * ainda sem página, e a página que existe para consertar um link quebrado
 * ofereceria cinco novos.
 */
function Atalhos(): ReactElement {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {secoes().map((secao) => (
        <li key={secao.url}>
          <a
            href={secao.url}
            className="block h-full rounded-xl border border-doxa-line bg-doxa-surface p-6 transition-colors hover:border-white/25"
          >
            <span className="font-serif text-xl text-white">{secao.h1}</span>
            <span className="mt-3 block text-[14px] leading-relaxed text-white/50">
              {secao.resumo}
            </span>
          </a>
        </li>
      ))}
      <li>
        <a
          href="/"
          className="block h-full rounded-xl border border-doxa-line bg-doxa-surface p-6 transition-colors hover:border-white/25"
        >
          <span className="font-serif text-xl text-white">Página inicial</span>
          <span className="mt-3 block text-[14px] leading-relaxed text-white/50">
            O que a Doxa faz, para quem faz e como começar uma conversa.
          </span>
        </a>
      </li>
    </ul>
  );
}

export function Pagina404({ cssHref }: PropsPagina404): ReactElement {
  return (
    <html lang={IDIOMA}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{TITULO}</title>
        {/* `noindex` e nada de canonical: o mesmo arquivo responde por todo
            caminho morto do site, e o que ele pede ao buscador é para esquecer
            o endereço, não para indexá-lo. */}
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#0B0B0B" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin=""
          href="/fonts/InstrumentSerif-400-normal-latin.woff2"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin=""
          href="/fonts/Almarai-400-normal-latin.woff2"
        />
        <link rel="stylesheet" href={cssHref} />
      </head>
      <body className="bg-doxa-bg text-white">
        <Cabecalho />
        <main>
          <div className="mx-auto w-full max-w-screen-2xl px-5 md:px-10">
            <header className="max-w-3xl py-10 md:py-14">
              <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white md:text-6xl">
                Página não encontrada
              </h1>
              <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
                O endereço que você abriu não existe neste site — ou deixou de existir. O conteúdo
                está nas seções abaixo.
              </p>
            </header>
            <Atalhos />
          </div>
        </main>
        <Rodape />
      </body>
    </html>
  );
}
