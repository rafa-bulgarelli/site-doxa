import type { ReactElement } from 'react';
import { secoes } from '../indice';
import { HREF_CTA, WORDMARK } from '../site';

/**
 * O cabeçalho das páginas SEO. NÃO é o `components/Cabecalho.tsx` da landing.
 *
 * O de lá é uma peça com estado: pílula que abre no hover, troca de idioma,
 * esconde ao rolar. Nada disso pode existir aqui — a página SEO é HTML servido
 * sem `<script type="module">` (§28), e um cabeçalho que precisa de JS seria um
 * menu morto na tela. Então é o mesmo idioma visual com metade das peças: a
 * wordmark, os índices que já existem e o botão que leva ao mesmo funil da
 * landing.
 *
 * Os links vêm de `secoes()` — o que este build publicou —, pelo mesmo motivo
 * do rodapé: apontar para `/guias` antes de existir um guia coloca um 404 no
 * topo de todas as páginas.
 *
 * `<img>` com `width`/`height` porque sem eles a wordmark reserva zero altura
 * e empurra o conteúdo quando decodifica — CLS de graça no topo da página.
 *
 * ─── POR QUE ELE EMPILHA EM 320px ────────────────────────────────────────────
 *
 * Uma linha só com `flex-nowrap` + `whitespace-nowrap` não é um layout que
 * aperta: é um layout que ESTOURA. Com as cinco seções publicadas, a barra pede
 * cerca de 470px, e num telefone de 320px o excesso não some — ele vira rolagem
 * horizontal na página inteira, com o fim do menu fora da tela e sem nada
 * indicando que ele existe. O número de seções cresce sozinho (cada índice
 * novo entra aqui pelo `secoes()`), então a correção tem de ser estrutural e
 * não "cabe hoje".
 *
 * Então: coluna no telefone (wordmark em cima, menu embaixo) e a barra de uma
 * linha só a partir de `sm`. O `flex-wrap` do `<nav>` é o cinto de segurança —
 * com dez seções ele quebra em duas linhas em vez de estourar de novo.
 */
export function Cabecalho(): ReactElement {
  return (
    <header className="border-b border-doxa-line px-5 py-5 md:px-10 md:py-6">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <a href="/" className="shrink-0" aria-label="Doxa, página inicial">
          <img
            src={WORDMARK.src}
            alt="Doxa"
            width={WORDMARK.largura}
            height={WORDMARK.altura}
            className="h-5 w-auto md:h-6"
          />
        </a>

        <nav
          aria-label="Seções"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-7"
        >
          {secoes().map((secao) => (
            <a
              key={secao.url}
              href={secao.url}
              className="whitespace-nowrap text-[13px] text-white/45 transition-colors hover:text-white"
            >
              {secao.h1}
            </a>
          ))}
          {/* `hidden sm:inline-flex`: no telefone o botão sairia embaixo dos
              links, repetindo em cima o CTA que já fecha a página. Quem chega
              ao fim continua encontrando o funil, e o topo fica com o menu. */}
          <a
            href={HREF_CTA}
            className="hidden whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-bold text-black transition-colors hover:bg-white/85 sm:inline-flex"
          >
            Falar com a Doxa
          </a>
        </nav>
      </div>
    </header>
  );
}
