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
- `pnpm seo:audit` — o mapa da rede interna. **Avisa, não reprova** (abaixo).
- `pnpm og:imagem` — regera `public/og.png`. Só quando a promessa da landing
  muda; a imagem carrega uma cópia do `og:title` e da `og:description`.
- `pnpm preview` e abra `/solucoes/<slug>/` **com barra** — o sirv local serve
  assim; na Vercel a forma canônica é sem barra (`trailingSlash: false`).

## O que os testes cobram

**A página, como dado:** URL, title, h1 e description únicos · slug
`^[a-z0-9]+(-[a-z0-9]+)*$` · description entre 120 e 160 caracteres, e nenhuma
"quase igual" à de outra página (comparação normalizada e por sobreposição de
palavras) · title até 65 · pelo menos um hub (exceto no próprio hub) ·
`atualizadoEm` em `AAAA-MM-DD` · todo link interno existente ou planejado · todo
hub do union `Hub` com página publicada ou rota planejada.

**O texto:** corpo com ≥ 300 palavras (verbete de glossário, ≥ 120) · nenhuma
página abrindo com "no mundo digital", "em um mundo", "atualmente", "nos dias de
hoje" ou "cada vez mais" (§19) · o primeiro parágrafo VISÍVEL no `<main>`,
comparado como TEXTO ACHATADO — o teste passa o parágrafo pelo mesmo `tokens()`
que o layout usa e tira as tags do HTML, então `**negrito**` e `[link](/rota)`
na abertura são ênfase legítima e não reprovação · a mesma **pergunta de FAQ**
não pode aparecer em duas páginas (normalizada: sem acento, sem caixa, sem
pontuação — `normalizarPergunta` em `auditoria.ts`), porque cada bloco `faq`
vira um nó `FAQPage` e dois deles com a mesma pergunta disputam o mesmo rich
result. A mensagem de erro lista pergunta → páginas.

**O HTML gerado:** um `<h1>` por página · zero `<script type="module">` ·
canonical absoluto sem barra final e igual ao `og:url` · `og:image` absoluta com
`width`/`height` · sitemap com todas as URLs e só elas.

**O JSON-LD:** todo nó parseia, tem `@context`, não serializa `undefined` e não
repete `@type` na mesma página · exatamente um `Article` **ou** um `WebPage` ·
`BreadcrumbList` com os mesmos nomes que o breadcrumb desenha na tela e a última
migalha igual ao canonical · `FAQPage` e `<details>` na página se — e só se —
ela tiver bloco `faq` (§46: nunca marcar o que não aparece) · o bloco estático
do `index.html` idêntico ao que `organization()` e `webSite()` montam.

## A auditoria (`pnpm seo:audit`)

Ela imprime o grafo — quem recebe link de quem, quem envia, quantas palavras
cada página tem — e uma lista de avisos: página **órfã** (só recebe link do
índice da seção), página **sem saída**, **hub sem página**, **hub sem membro**,
**rota citada antes de existir**, **corpo fora da faixa de palavras** do tipo e
**FAQ repetida** entre páginas.

### Faixas de palavras (medidas no CORPO, pelo audit)

| Tipo | Faixa |
|---|---|
| `solucao`, `plataforma`, `guia`, `dor` | 900 – 1400 |
| `comparativo` | 1000 – 1500 |
| `hub` | 400 – 800 |
| `glossario` | 150 – 400 |

A medida é a de `palavrasDe()`: o `corpo` da página depois de `tokens()` — não o
`<main>` renderizado. Cabeçalho, breadcrumb, TOC e rodapé somam algumas centenas
de palavras IGUAIS em toda página, e contá-las faria a faixa medir o layout em
vez do texto. Marcação também não conta: `**escala**` é uma palavra.

A faixa **avisa**; quem REPROVA é o piso de 300 palavras do `seo.test.ts`. São
réguas diferentes de propósito — o piso separa página de resumo de título, a
faixa é calibragem editorial, e um guia de 1.600 palavras não está errado, está
fora do formato que este site combinou. A tabela mora em `FAIXA_DE_PALAVRAS`
(`auditoria.ts`), tipada como `Record<Tipo, Faixa>`: tipo novo em `tipos.ts` não
compila sem alguém decidir a faixa dele.

Ela **não reprova o build**, e é decisão: o que ela mede depende do que as
OUTRAS páginas escreveram, e conteúdo mergeia em ordem imprevisível. Reprovar a
primeira página de um cluster por ela ser a única dele ensina todo mundo a
ignorar a reprovação. O que reprova mora em `seo.test.ts`.

## Hub novo é mudança de arquitetura

`Hub` é uma union FECHADA em `tipos.ts`, e de propósito: quem cria um cluster
decide onde ele entra no grafo de links do site. Se `hubs` fosse `string[]`, uma
página inventaria `/guias/qualquer-coisa`, nasceria órfã e ninguém veria até a
auditoria. Criar um hub são três arquivos no mesmo commit — `Hub` em `tipos.ts`,
`HUBS` em `site.ts`, a URL em `rotas-planejadas.ts` — e a decisão é do gestor,
não da track de conteúdo.

## O que NÃO se faz aqui

Inventar cliente, número, resultado ou garantia. **A fonte de fatos é uma só:
`docs/seo/source-of-truth.md`.** Só entra em página o fato que aparece lá com
`fonte:`; o que não tem fonte não vira frase, nem parafraseado. Sem fato, o
texto é institucional. O checklist que fecha cada arquivo está em
`docs/seo/regua-de-copy.md` — cole-o no fim do arquivo de conteúdo e marque item
a item.
