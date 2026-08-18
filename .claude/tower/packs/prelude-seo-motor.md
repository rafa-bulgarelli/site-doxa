# SEO orgânico — PRELUDE: o motor provado com UMA página (task_seo_prelude)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
prelude-seo-motor origin/feat/seo-organico`. Divergiu → **PARE e reporte**.

Leia antes de codar: `CLAUDE.md` (Fatos do repo), `.claude/STYLE-GOOGLE-TS.md`, e o
brief do dono `.claude/tower/briefs/011-seo-missao-do-dono.md` §2, §19–22, §28, §29,
§45, §46 (resumidos no fim deste pack).

## A VISÃO DO DONO
O site deixa de ter uma URL indexável e vira uma rede de páginas que o Google lê SEM
executar JavaScript — cada uma com title, description, canonical, H1 e texto de
verdade no HTML. Este prelude prova a arquitetura com UMA página real
(`/solucoes/producao-de-videos-com-ia`) antes de escalar para dezenas: motor de
conteúdo em arquivos tipados, layouts por tipo, prerender no build. A landing atual
não muda um byte (§68).

## CONTEXTO (não perca tempo redescobrindo)
- **Decisão de arquitetura do GESTOR (§69, fechada):** prerender estático pós-build,
  sem hidratação. `pnpm build` = `tsc -b && vite build && node scripts/prerender.mjs`.
  O script faz um `vite build --ssr` da entrada `src/seo/prerender/entrada.tsx` para
  `.vite/prerender/` (diretório já ignorado no `.gitignore`), importa o bundle e
  escreve `dist/<rota>/index.html` para cada página SEO com `renderToStaticMarkup`
  (react-dom/server, já é dependência — **zero dependência nova**). As páginas SEO
  NÃO carregam `main.tsx`: nenhum `<script type="module">`, só JSON-LD. FAQ vira
  `<details>`, TOC vira âncoras, CTA vira `<a href="/#forms">`. `App.tsx`, `main.tsx`,
  `index.html`, `tailwind.config.js` são INTOCÁVEIS neste prelude.
- **Por que serve na Vercel:** o filesystem tem precedência sobre o `rewrite` do
  `vercel.json` (o próprio `vercel.README.md` documenta isso — assets e robots já
  passam por aí). `dist/solucoes/x/index.html` é servido em `/solucoes/x`. Prova
  local: `vite preview` (sirv) serve `dist/x/index.html` **em `/x/` com barra**; o
  `/x` sem barra cai na SPA localmente — comportamento do sirv, não da Vercel. Sua
  prova local usa a forma com barra; a prova sem barra é no Preview da Vercel, feita
  pela sessão principal. Para as duas formas convergirem em produção, o
  `vercel.json` ganha `"trailingSlash": false` (a Vercel redireciona `/x/` → `/x` com
  308) e `"buildCommand": "pnpm build"` (garante que o prerender roda lá, seja qual
  for o preset).
- **CSS:** o Tailwind já varre `src/**/*.tsx` (`tailwind.config.js` → `content`), então
  as classes dos layouts em `src/seo/` entram no `dist/assets/index-<hash>.css` do
  build normal. O prerender lê `dist/index.html`, extrai o `href` desse CSS e o
  linka em cada página gerada. NÃO edite o `tailwind.config.js` (sem hot-reload,
  token novo é conversa com o dono; opacidade fora da escala de 5 só como
  `bg-x/[0.78]`).
- **Wordmark:** `brand/doxa-wordmark-white-96.avif` (3,8 KB, fora de `public/`). O
  cabeçalho da SEO usa uma CÓPIA em `public/brand/doxa-wordmark-white-96.avif`
  (`<img src="/brand/…" width=364 height=96 alt="Doxa">`) — copiar é mais honesto
  do que depender de o hash do asset coincidir entre o build cliente e o SSR.
- **Visual = produto DOXA, não blog:** monocromático (`bg-doxa-bg #000`, `surface
  #0D0D0D`, `raised #141414`, `line #1F1F1F`, `muted #6B6B6B`), títulos em
  `font-serif` (Instrument Serif), corpo no sans do site (Almarai via `index.css`),
  caixa `max-w-screen-2xl` centrada com o recuo das seções. Leia
  `src/components/Cabecalho.tsx` (linhas 180–231), `src/components/Rodape.tsx`
  (425–459) e `src/tipografia.ts` para absorver o idioma visual. Cor só do menu da
  landing; aqui NADA colorido. Sem animação neste prelude (doutrina do dono; entra
  depois com ele acordado).
- **Sitemap:** `public/sitemap.xml` tem UMA URL e uma regra escrita nele — `lastmod`
  é data de mudança de CONTEÚDO, não de deploy. Este prelude REMOVE o arquivo de
  `public/` e passa a gerar `dist/sitemap.xml` no prerender: home com `lastmod`
  fixo `2026-08-10` (constante com o comentário da regra transplantado), cada
  página com o próprio `atualizadoEm`, e os índices de seção com o maior
  `atualizadoEm` das páginas listadas. `robots.txt` já aponta para `/sitemap.xml`
  e não muda.
- **Fatos para a página do prelude (§2 — nada além disto):** garantia "Um milhão de
  views. Ou seu dinheiro de volta." (`src/components/comparacao/config.ts`
  `GARANTIA`, `CUSTO_DE`/`CUSTO_ATE` = R$ 8.000–10.500/mês do jeito antigo, `ITENS`);
  os três passos (`src/components/HowItWorks.tsx` linhas 60–140: reunião → uma foto
  e um áudio viram o clone → vídeo pronto, vertical, legendado); FAQ com respostas
  do dono (`src/components/faq/config.ts` `DUVIDAS_PT`; o que está em `PENDENTES`
  é NÃO PUBLICÁVEL: preço, fidelidade, prazo do primeiro vídeo, formas de
  pagamento); "o que a Doxa não é" e "60 conteúdos em 90 dias" (`public/llms.txt`);
  plataformas TikTok/Instagram/YouTube Shorts (`src/components/proof/reels.ts`);
  ferramentas (`src/components/tools.ts`: HeyGen, ChatGPT, Claude, Meta,
  ElevenLabs — só como "ferramentas usadas", nunca como parceria); clientes reais
  só os três de `src/components/hero/cases.ts` (Core, Magalu, Uninova) e SÓ com os
  números que estão lá, entre aspas. Nenhum outro número, cliente ou depoimento.
- Armadilhas do repo (desta track): **pnpm, não npm** · `verbatimModuleSyntax` não
  vale no projeto app, mas `import type` sempre que só tipo · `noUnusedLocals` ligado
  · `tsc -b` é composto (app/api/node): `src/seo/**` cai no `tsconfig.app.json`
  (lib DOM), o `scripts/prerender.mjs` fica FORA do tsc como o
  `scripts/conversor-prova.mjs` · o `dist/` está no `.gitignore` — nada gerado entra
  em commit · `import.meta.glob` é tipado por `vite/client` (já referenciado em
  `src/vite-env.d.ts`) e funciona no vitest e no build SSR.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Comentários em PT, o porquê.

## A TASK

### 1. O contrato — `src/seo/tipos.ts` (as tracks de conteúdo programam CONTRA isto)
```ts
export type Tipo = 'solucao' | 'plataforma' | 'guia' | 'comparativo' | 'dor' | 'glossario' | 'hub';
export type Intencao = 'informacional' | 'comercial' | 'transacional' | 'navegacional';
/** As URLs dos hubs, fechadas: hub novo = mudança de motor, não de conteúdo. */
export type Hub =
  | '/guias/marketing-no-tiktok' | '/guias/reels-no-instagram' | '/guias/ia-no-marketing'
  | '/guias/marketing-organico' | '/guias/videos-curtos';
export interface Faq { pergunta: string; resposta: string }
/** Marcação inline permitida em `texto`: **negrito** e [rótulo](/rota-ou-https). Só isso. */
export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'titulo'; nivel: 2 | 3; texto: string }          // id = slug do texto (para TOC)
  | { tipo: 'lista'; itens: readonly string[]; ordenada?: boolean }
  | { tipo: 'destaque'; texto: string; variante: 'nota' | 'atencao' | 'doxa' }
  | { tipo: 'tabela'; cabecalho: readonly string[]; linhas: ReadonlyArray<readonly string[]> }
  | { tipo: 'passos'; itens: ReadonlyArray<{ titulo: string; texto: string }> }
  | { tipo: 'faq'; itens: readonly Faq[] }                     // <details> + FAQPage
  | { tipo: 'cta'; texto: string; rotulo?: string };            // contextual → /#forms
export interface Pagina {
  tipo: Tipo; slug: string;                 // URL = PREFIXO[tipo] + '/' + slug
  titulo: string;                           // <title>, exclusivo, orientado a intenção
  descricao: string;                        // meta description, 120–160 chars
  h1: string; resumo: string;               // lead: responde a intenção na 1ª frase
  intencao: Intencao; palavrasChave: readonly string[];
  hubs: readonly Hub[];                     // ≥1 exceto tipo 'hub'
  relacionadas: readonly string[];          // URLs internas (existentes ou planejadas)
  corpo: readonly Bloco[];
  atualizadoEm: string;                     // 'AAAA-MM-DD' — data do CONTEÚDO
  cta?: { texto: string; rotulo: string };  // fecho; default do motor se ausente
}
```
Cada arquivo de conteúdo exporta `export const pagina: Pagina = {…}` (anotação, não `as`).

### 2. O motor — `src/seo/`
- `site.ts` — `DOMINIO = 'https://www.doxaviral.com'`, `NOME = 'Doxa'`, `PREFIXO:
  Record<Tipo, string>` (`solucao→/solucoes`, `plataforma→/plataformas`,
  `guia|dor|hub→/guias`, `comparativo→/comparativos`, `glossario→/glossario`),
  `DIRETORIO: Record<Tipo,string>` (`solucoes, plataformas, guias, comparativos,
  dores, glossario, hubs`), `HUBS` (título/descrição curta por `Hub`), `SECOES`
  (title/description/h1/resumo institucionais dos 5 índices `/solucoes`,
  `/plataformas`, `/guias`, `/comparativos`, `/glossario` — texto sem claim),
  `OG_IMAGEM: string | null = null` (a track de fundação liga), `HREF_CTA = '/#forms'`.
- `rotas-planejadas.ts` — `ROTAS_PLANEJADAS: readonly string[]` = a lista abaixo
  (URLs que as tracks de conteúdo PODEM linkar antes de existirem). Link para URL
  planejada-mas-inexistente vira TEXTO no HTML (sem `<a>`); link para URL que não é
  nem existente nem planejada = teste falha.
- `inline.ts` (+ `inline.test.ts`) — parser da marcação inline → tokens
  `{texto}|{negrito}|{link href, texto}`; escapa HTML no render.
- `indice.ts` — `import.meta.glob<{ pagina: Pagina }>('./conteudo/*/*.ts', { eager: true })`;
  valida cada módulo (`validarPagina`, erro claro com o caminho); expõe `paginas()`,
  `urlDe(p)`, `porUrl(url)`, `existe(url)`, `resolverLink(url)`, `secoes()` (índices
  gerados). Diretório ↔ `tipo` divergente = erro na validação.
- `head.ts` (+ teste) — monta as tags: `<title>`, description, canonical absoluto sem
  barra final, `og:type` (`website` para solução/plataforma/hub/índice, `article`
  para o resto), `og:title/description/url/site_name/locale`, `twitter:card`,
  `og:image` só se `OG_IMAGEM` não for null.
- `schema.ts` (+ teste) — builders JSON-LD `WebPage` e `BreadcrumbList` (Organization/
  WebSite/Article/FAQPage entram na track de fundação; deixe a função assinada e o
  arquivo pronto para crescer). Nunca marcar o que não está visível.
- `sitemap.ts` (+ teste) — gera o XML (regra do `lastmod` acima).
- `layout/` — `Casca.tsx` (documento inteiro: `<html lang="pt-BR">`, head, preload
  das duas fontes como no `index.html`, `<body class="bg-doxa-bg text-white">`,
  cabeçalho, breadcrumb, `<main>`, relacionadas, CTA de fecho, rodapé),
  `Cabecalho.tsx` (wordmark → `/`, links Soluções `/solucoes` · Guias `/guias`, botão
  "Falar com a Doxa" → `/#forms`; sem JS, cabe em 320px), `Rodape.tsx` (links das 5
  seções + `Perguntas /#faq` + © ano), `Blocos.tsx` (renderiza `Bloco[]`; `faq` como
  `<details><summary>`), `Relacionadas.tsx`, `Cta.tsx`, e as páginas
  `PaginaSolucao.tsx` (solução/plataforma: hero com h1+resumo+CTA, corpo, "onde a
  Doxa entra"), `PaginaArtigo.tsx` (guia/dor/comparativo/glossário: h1, resumo, TOC
  por âncora dos `titulo` nível 2, corpo, data), `PaginaHub.tsx` (h1, resumo, corpo
  curto, lista dos membros = páginas cujo `hubs` inclui a URL do hub, agrupadas por
  tipo), `PaginaSecao.tsx` (índice: lista todas as páginas do prefixo). Breadcrumb:
  `Início › Seção › [Hub ›] Página`.
- `prerender/entrada.tsx` — `rotas(): string[]` (páginas + índices), `renderizar(url,
  { cssHref }): string` (doctype + `renderToStaticMarkup(<Casca…/>)`), `sitemap()`.
  Puro: sem `fs`, sem `process`.
- `seo.test.ts` — invariantes sobre TODAS as páginas do índice: URL única, title/h1/
  description únicos, slug `^[a-z0-9]+(-[a-z0-9]+)*$`, description 120–160, título ≤
  65 chars, `hubs.length ≥ 1` (exceto hub), hub de tipo `hub` tem URL no union
  `Hub`, `atualizadoEm` válido, todo link inline/relacionada existe OU está em
  `ROTAS_PLANEJADAS`, sitemap contém todas as URLs e só elas, render de cada página
  contém exatamente um `<h1`, zero `<script type="module"`, canonical certo.
- `README.md` — 30 linhas: como adicionar uma página (arquivo em
  `conteudo/<dir>/<slug>.ts`, exporta `pagina`), como rodar, o que os testes cobram.

### 3. O prerender — `scripts/prerender.mjs`
Node ≥ 20, sem dependência nova. `import { build } from 'vite'` →
`build({ build: { ssr: 'src/seo/prerender/entrada.tsx', outDir: '.vite/prerender',
emptyOutDir: true }, logLevel: 'warn' })` (herda `vite.config.ts`, plugin react
incluído) → `import('../.vite/prerender/entrada.js')` → lê `dist/index.html`, extrai
`href="/assets/index-….css"` (falha alto se não achar) → para cada rota escreve
`dist<rota>/index.html` → escreve `dist/sitemap.xml` → imprime a lista. Falha = exit 1.

### 4. A página — `src/seo/conteudo/solucoes/producao-de-videos-com-ia.ts`
Money page "Produção de vídeos com IA para empresas". Régua §19: começa respondendo
(o que é, para quem, como funciona aqui), explica o mecanismo (uma foto e um áudio →
clone → vídeos verticais legendados prontos para postar), o que muda em relação ao
jeito antigo (a conta dos R$ 8.000–10.500/mês, importada como fato da comparação),
a garantia (redação do FAQ do dono: "metas de performance definidas em contrato"),
FAQ com 4–6 dúvidas SÓ das respondidas em `DUVIDAS_PT`, "o que a Doxa não é"
(llms.txt), CTA. 900–1400 palavras. `hubs: ['/guias/ia-no-marketing']`,
`relacionadas` com 3–5 URLs planejadas. Teste do §45: você publicaria isto se o
Google não existisse?

### 5. Configuração
- `package.json`: `"build": "tsc -b && vite build && node scripts/prerender.mjs"`.
  Nada mais muda ali.
- `vercel.json`: adicionar `"buildCommand": "pnpm build"` e `"trailingSlash": false`;
  explicar os dois em `vercel.README.md` (o schema recusa comentário no JSON) —
  inclusive os quatro casos da tabela de lá que continuam valendo, mais dois novos:
  `/solucoes/<slug>` → 200 com o HTML pré-gerado; `/solucoes/<slug>/` → 308.
- `git rm public/sitemap.xml` (o gerado substitui) · `public/brand/doxa-wordmark-white-96.avif`.

## ROTAS PLANEJADAS (cole em `rotas-planejadas.ts`, sem inventar outras)
`/solucoes/producao-de-videos-com-ia` `/solucoes/marketing-com-ia`
`/solucoes/conteudo-organico-para-empresas` `/solucoes/producao-de-conteudo-em-escala`
`/solucoes/videos-curtos-para-empresas` `/solucoes/clone-de-ia-para-videos`
`/plataformas/tiktok-para-empresas` `/plataformas/instagram-reels-para-empresas`
`/plataformas/youtube-shorts-para-empresas`
`/guias/marketing-no-tiktok` `/guias/reels-no-instagram` `/guias/ia-no-marketing`
`/guias/marketing-organico` `/guias/videos-curtos` (os 5 hubs)
`/guias/como-viralizar-no-tiktok` `/guias/como-crescer-no-instagram-organicamente`
`/guias/como-fazer-videos-curtos-que-prendem` `/guias/estrategia-de-conteudo-para-empresas`
`/guias/como-usar-ia-no-marketing` `/guias/o-que-e-avatar-de-ia` `/guias/o-que-e-ugc`
`/comparativos/organico-vs-pago` `/comparativos/tiktok-vs-instagram`
`/comparativos/ia-vs-producao-tradicional-de-video` `/comparativos/agencia-vs-equipe-interna`
`/comparativos/ugc-vs-conteudo-de-marca`
`/guias/por-que-meus-videos-nao-tem-views` `/guias/como-postar-todos-os-dias-sem-equipe`
`/guias/como-produzir-conteudo-sem-equipe` `/guias/como-aumentar-o-alcance-organico`
`/glossario/alcance-organico` `/glossario/conteudo-organico` `/glossario/hook`
`/glossario/retencao` `/glossario/watch-time` `/glossario/ugc` `/glossario/short-form`
`/glossario/avatar-de-ia` `/glossario/clone-de-voz` `/glossario/algoritmo-do-tiktok`
`/glossario/conteudo-evergreen`
Mais os índices `/solucoes` `/plataformas` `/guias` `/comparativos` `/glossario`.

## SCOPE
- src/seo/**
- scripts/prerender.mjs
- package.json
- vercel.json
- vercel.README.md
- public/sitemap.xml (remoção)
- public/brand/doxa-wordmark-white-96.avif

(INTOCÁVEIS: `src/App.tsx`, `src/main.tsx`, `index.html`, `tailwind.config.js`,
`vite.config.ts`, `tsconfig*.json`, `public/robots.txt`, `public/llms.txt`, tudo em
`src/components/`. Precisou → PARE e reporte.)

## DEPENDS ON
Branch `feat/seo-organico` criada a partir de main pela sessão principal. Nada mais.
(`track-seo-docs` roda em paralelo, só em `docs/seo/` — não colide.)

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — baseline do main: 19 arquivos / 504 testes; os seus são a mais
- `pnpm build` ok (inclui o prerender) e imprime a lista de rotas geradas
- `test -f dist/solucoes/producao-de-videos-com-ia/index.html && test -f dist/solucoes/index.html && test -f dist/sitemap.xml && test ! -f public/sitemap.xml && echo OK`
- `P=dist/solucoes/producao-de-videos-com-ia/index.html; grep -c '<h1' $P` = 1 ·
  `grep -o '<title>[^<]*' $P` = o title da página (não o da landing) ·
  `grep -c 'rel="canonical" href="https://www.doxaviral.com/solucoes/producao-de-videos-com-ia"' $P` = 1 ·
  `grep -c 'type="module"' $P` = 0 · `grep -c 'name="description"' $P` = 1
- `CSS=$(grep -o 'href="/assets/index-[^"]*\.css"' $P | head -1 | cut -d'"' -f2); test -f "dist$CSS" && echo CSS-OK`
- `grep -c '<loc>' dist/sitemap.xml` = 3 (home + `/solucoes` + a página) e
  `grep -c '<lastmod>2026-08-10</lastmod>' dist/sitemap.xml` = 1 (a home mantém a data)
- `ls dist/assets/index-*.js` = `dist/assets/index-pvBkohFb.js` (MESMO hash do main:
  a landing não mudou; se mudou, explique — o esperado é `git diff --name-only
  origin/feat/seo-organico...HEAD | grep -E '^src/(App|main)\.tsx|^index\.html'` vazio)
- `(pnpm preview --port 5299 >/dev/null 2>&1 &) ; sleep 2; curl -s localhost:5299/solucoes/producao-de-videos-com-ia/ | grep -c '<h1'` = 1 · `curl -s localhost:5299/ | grep -o '<title>[^<]*'` = title da landing · depois `pkill -f "vite preview --port 5299"`
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^(src/seo/|scripts/prerender\.mjs|package\.json|vercel\.json|vercel\.README\.md|public/sitemap\.xml|public/brand/)'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -niE "lorem|no mundo digital|em constante evolução"` = vazio

## RESUMO DO BRIEF QUE VALE AQUI (caminho: `.claude/tower/briefs/011-seo-missao-do-dono.md`)
§2 nunca inventar cliente, número, resultado, garantia, depoimento, tecnologia — sem
fato, texto institucional · §19 copy direta, começa respondendo, sem "no mundo
digital…", sem superlativo vazio, sem keyword stuffing · §22 title exclusivo (não
`Keyword | DOXA` em tudo), description exclusiva, canonical, H1 único, hierarquia
H2/H3, links internos, breadcrumb, schema correto · §28 HTML pronto sem JS · §29
sistema de conteúdo sustentável, zero repetição de layout · §45 "publicaria se o
Google não existisse?" · §46 proibido doorway, duplicata, FAQ falso, schema
enganoso, placeholder · §68 não destruir o que funciona.

## COMMIT + PUSH
`feat(seo): prelude — motor de conteúdo, prerender no build e a primeira página` →
`git push -u origin prelude-seo-motor`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY + o que você
descobriu do comportamento do prerender que o GESTOR precisa saber (ex.: qualquer
ajuste no shape do `Pagina` — as tracks de conteúdo vão ler o `tipos.ts` real).
