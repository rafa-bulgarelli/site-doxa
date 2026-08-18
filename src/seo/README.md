# `src/seo/` — o motor das páginas orgânicas

Páginas indexáveis do site, servidas como HTML pronto. Elas **não** carregam o
`main.tsx`: são geradas no build e não executam JS nenhum (só JSON-LD).

## Adicionar uma página

1. Crie `conteudo/<pasta>/<slug>.ts`. A pasta é a de `DIRETORIO` em `site.ts`
   (`solucoes`, `plataformas`, `guias`, `comparativos`, `dores`, `glossario`,
   `hubs`) e o nome do arquivo **é** o `slug`.
2. `export const pagina: Pagina = { … }` — anotação, nunca `as Pagina`.
   O contrato está em `tipos.ts`.
3. Pronto. Nada a registrar: `indice.ts` varre a pasta com `import.meta.glob`,
   a página entra no sitemap, no índice da seção e no hub que ela declarar.

A URL é `PREFIXO[tipo] + '/' + slug`. Em `texto`, só `**negrito**` e
`[rótulo](/rota)`. Link para rota que ainda não existe vira TEXTO, desde que a
rota esteja em `rotas-planejadas.ts`; fora dela, o teste reprova.

## Rodar

- `pnpm test` — invariantes de todas as páginas (`seo.test.ts`) e unidades.
- `pnpm build` — `tsc -b`, `vite build` e `node scripts/prerender.mjs`, que
  escreve `dist/<rota>/index.html` e `dist/sitemap.xml`.
- `pnpm preview` e abra `/solucoes/<slug>/` **com barra** — o sirv local serve
  assim; na Vercel a forma canônica é sem barra (`trailingSlash: false`).

## O que os testes cobram

URL, title, h1 e description únicos · slug `^[a-z0-9]+(-[a-z0-9]+)*$` ·
description entre 120 e 160 caracteres · title até 65 · pelo menos um hub
(exceto no próprio hub) · `atualizadoEm` em `AAAA-MM-DD` · todo link interno
existente ou planejado · sitemap com todas as URLs e só elas · um `<h1>` por
página · zero `<script type="module">` · canonical absoluto sem barra final ·
`<details>` na página se — e só se — ela tiver bloco `faq`.

## O que NÃO se faz aqui

Inventar cliente, número, resultado ou garantia. Todo fato vem do que já existe
no projeto (landing, FAQ, `public/llms.txt`, `hero/cases.ts`); sem fato, o texto
é institucional. O cabeçalho da página de conteúdo registra a origem de cada
afirmação — mantenha essa nota ao editar.
