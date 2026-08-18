import type { ReactElement, ReactNode } from 'react';
import type { Cabeca } from '../head';
import { paraScript } from '../schema';
import type { Migalha, NoJsonLd } from '../schema';
import { IDIOMA } from '../site';
import type { Cta as DadosCta } from '../tipos';
import { Cabecalho } from './Cabecalho';
import { Cta } from './Cta';
import { Relacionadas } from './Relacionadas';
import { Rodape } from './Rodape';

/**
 * O DOCUMENTO inteiro de uma página SEO — `<html>` a `</html>`.
 *
 * Ela renderiza o `<head>` em vez de deixá-lo no `index.html` porque não há
 * `index.html` aqui: cada rota é um arquivo próprio escrito pelo prerender, com
 * title, description e canonical próprios. É a diferença entre um site com uma
 * URL indexável e um site com uma rede delas.
 *
 * O que NÃO existe neste documento: `<script type="module">`. Nenhuma linha de
 * JS da aplicação entra — o conteúdo tem de estar legível sem executar nada
 * (§28), e o único `<script>` da página é o JSON-LD, que não executa.
 */

export interface PropsCasca {
  cabeca: Cabeca;
  /** O `href` do CSS do build cliente, extraído de `dist/index.html`. */
  cssHref: string;
  jsonLd: readonly NoJsonLd[];
  migalhas: readonly Migalha[];
  relacionadas: readonly string[];
  cta?: DadosCta;
  children: ReactNode;
}

/** `Início › Seção › [Hub ›] Página` — o mesmo caminho que o BreadcrumbList. */
function Migalhas({ migalhas }: { migalhas: readonly Migalha[] }): ReactElement {
  return (
    <nav
      aria-label="Você está aqui"
      className="mx-auto w-full max-w-screen-2xl px-5 pt-8 md:px-10"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/40">
        {migalhas.map((migalha, indice) => {
          const ultima = indice === migalhas.length - 1;
          return (
            <li key={migalha.url} className="flex items-center gap-x-2">
              {indice > 0 ? <span aria-hidden="true">›</span> : null}
              {ultima ? (
                <span aria-current="page" className="text-white/70">
                  {migalha.nome}
                </span>
              ) : (
                <a href={migalha.url} className="transition-colors hover:text-white">
                  {migalha.nome}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Casca(props: PropsCasca): ReactElement {
  const { cabeca, cssHref, jsonLd, migalhas, relacionadas, cta, children } = props;
  return (
    <html lang={IDIOMA}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{cabeca.titulo}</title>
        <link rel="canonical" href={cabeca.canonical} />
        {cabeca.metas.map((meta) =>
          meta.atributo === 'property' ? (
            <meta key={meta.chave} property={meta.chave} content={meta.conteudo} />
          ) : (
            <meta key={meta.chave} name={meta.chave} content={meta.conteudo} />
          ),
        )}
        <meta name="theme-color" content="#0B0B0B" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* As duas fontes da primeira dobra, precarregadas como no `index.html`
            da landing: um `@font-face` dentro do CSS só é descoberto depois de o
            CSS baixar. `crossOrigin` é obrigatório mesmo em mesma origem, senão
            o navegador baixa o arquivo duas vezes. */}
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
        {jsonLd.map((no) => (
          <script
            key={no['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: paraScript(no) }}
          />
        ))}
      </head>
      <body className="bg-doxa-bg text-white">
        <Cabecalho />
        <Migalhas migalhas={migalhas} />
        <main>{children}</main>
        <Relacionadas urls={relacionadas} />
        <Cta dados={cta} />
        <Rodape />
      </body>
    </html>
  );
}
