# Medição SEO (card 012) — Track A: `pnpm gsc:baseline` e o relatório do dia zero (track-gsc-baseline)

Você é o EXECUTOR, numa worktree isolada criada pelo harness
(`~/orca/workspaces/site-doxa/track-gsc-baseline`, branch **`track-gsc-baseline`**,
nascida de `origin/main` JÁ com o prelude `prelude-gsc-acesso` mergeado).

## SEGURANÇA — leia antes de qualquer comando (não negociável)
- **A chave da service account é SEGREDO** e mora em
  `~/.config/doxa/gsc-service-account.json` (env `GSC_KEY_PATH`). Você **NÃO LÊ o
  conteúdo** (nem `cat`, nem `Read`, nem `jq`, nem `node -e` que imprima campo). Só
  `scripts/gsc/auth.mjs` a lê, em runtime. Não a copie, não a mova, não a cite em teste.
- Nenhum trecho dela — nem `access_token`/`Bearer …`/`ya29.` — vai para report, commit,
  fixture, log ou para o `docs/seo/baseline-*.md` que você gera. O relatório gerado é
  VERSIONADO: ele só contém dados de busca (URLs, queries, números) e o nome da
  propriedade.
- O que NÃO é segredo: o e-mail `torre-seo@doxa-506016.iam.gserviceaccount.com`, o
  caminho da chave, as env vars, respostas de `sites.list`/`sitemaps.list`/
  `searchAnalytics`/`urlInspection`.
- Zero dependência nova (sem `googleapis`, sem MCP do Google). `fetch` + `crypto` do
  Node 24 já estão no `auth.mjs`/`api.mjs` do prelude — **reuse-os, não reimplemente**.
- Quota da URL Inspection: **2000 chamadas/dia/propriedade, 600/min**. O baseline gasta
  ~69 por execução (uma por URL do sitemap). Não rode em loop; não paralelize acima de
  1 chamada por vez.

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = a worktree, NÃO `~/orca/projects/site-doxa` ·
`git branch --show-current` = `track-gsc-baseline` · `git status --porcelain` vazio ·
`git fetch origin && git rebase origin/main` · `test -f scripts/gsc/auth.mjs && test -f
scripts/gsc/api.mjs && test -f scripts/gsc/prova.mjs` (o prelude está na base; se não,
PARE e reporte) · `pnpm install --frozen-lockfile` · `pnpm gsc:prova` roda e mostra a
propriedade (é a sua prova de que a chave está no lugar; cole no report).

Leia antes: `scripts/gsc/auth.mjs`, `scripts/gsc/api.mjs`, `scripts/gsc/prova.mjs` (o
contrato — você importa deles), `scripts/seo-audit.mjs` (o truque do `vite build --ssr`
para usar módulo TS com `import.meta.glob` a partir de `.mjs` — você vai copiá-lo),
`src/seo/indice.ts` (`paginas()`, `urlDe()`, `secoes()`), `src/seo/tipos.ts` (`Tipo`,
`Hub`), `src/seo/site.ts` (`HUBS`, `PREFIXO`, `SECOES`), `docs/seo/keyword-map.md`
(só para entender "cluster" = hub e "tipo"), `.claude/STYLE-GOOGLE-TS.md`, `CLAUDE.md`
→ "Fatos do repo".

## A VISÃO DO DONO
Um comando — `pnpm gsc:baseline` — que escreve em `docs/seo/baseline-<data>.md` o que o
Google já vê da biblioteca: o sitemap foi processado? quantas das 69 URLs ele já
rastreou/indexou? que queries mostram o site, em que posição, com quantas impressões?
E a lista que dispara a rodada 4: páginas em posição 8–20 com impressão real. O site
entrou no ar em 2026-08-18 e o GSC atrasa ~2 dias: o relatório de hoje é o **dia zero**,
e tem de ser honesto — onde não há dado, diz "sem dado ainda", não inventa.

## CONTEXTO (não perca tempo redescobrindo)
- O prelude deixou prontos: `obterToken({ escopo })`, `ESCOPO_LEITURA`,
  `listarPropriedades`, `escolherPropriedade`, `listarSitemaps`, `consultarBusca(token,
  siteUrl, corpo)`, `inspecionarUrl(token, siteUrl, url)`, `SITEMAP_DA_DOXA`. O baseline
  só LÊ (escopo de leitura). Se precisar de ajuste em `api.mjs` (ex.: um parâmetro), é
  permitido — está no seu SCOPE; `auth.mjs` NÃO.
- Search Analytics: `POST …/searchAnalytics/query` com
  `{ startDate, endDate, dimensions, rowLimit, dataState: 'all' }`. Datas `YYYY-MM-DD`;
  `dataState: 'all'` inclui os dias "frescos" (ainda não finais). Duas consultas:
  (1) `dimensions: ['page']`, `rowLimit: 1000`; (2) `dimensions: ['query','page']`,
  `rowLimit: 5000`. Linhas: `{ keys: [...], clicks, impressions, ctr, position }`.
  Propriedade nova pode devolver `{}` (sem `rows`) — trate como lista vazia.
- URL Inspection: resposta em `inspectionResult.indexStatusResult` com `verdict`
  (`PASS|PARTIAL|FAIL|NEUTRAL|VERDICT_UNSPECIFIED`), `coverageState` (texto, ex.
  "Submitted and indexed", "Discovered - currently not indexed", "URL is unknown to
  Google"), `indexingState`, `lastCrawlTime`, `pageFetchState`, `robotsTxtState`,
  `sitemap[]`, `referringUrls[]`. Para a Doxa, `inspectionUrl` = a URL do sitemap
  (`https://www.doxaviral.com/...`); `siteUrl` = a propriedade exatamente como veio do
  `sites.list` (`sc-domain:doxaviral.com` ou `https://www.doxaviral.com/`). Uma chamada
  por URL, sequencial.
- `sitemaps.list`: `contents[].indexed` é **DEPRECADO, devolve 0** — não imprima como
  "indexadas". Use `submitted`, `lastSubmitted`, `lastDownloaded`, `isPending`, `errors`,
  `warnings`.
- **Mapa URL → tipo/hub** sem importar TS no Node: copie o padrão de
  `scripts/seo-audit.mjs` — `build({ publicDir: false, build: { ssr:
  'src/seo/indice.ts', outDir: '.vite/gsc-mapa', emptyOutDir: true }, logLevel: 'warn' })`
  e `import(pathToFileURL('.vite/gsc-mapa/indice.js'))` → `paginas()` (cada uma tem
  `tipo`, `hubs`, `titulo`, `slug`), `urlDe(pagina)`, `secoes()` (os 5 índices →
  tipo `indice`). A home `/` → tipo `home`. Tudo prefixado com
  `https://www.doxaviral.com` para casar com as `keys[].page` do GSC (que vêm
  absolutas, sem barra final — é a canônica). `.vite/` já está no `.gitignore`.
- O sitemap NO AR (o que o Google vê) é a lista de URLs a inspecionar: `fetch
  https://www.doxaviral.com/sitemap.xml` (público, sem auth) e extraia os `<loc>` (regex
  basta; hoje são 69). Divergência entre sitemap no ar e índice local (URL num e não
  no outro) vai para a seção 2 do relatório — é achado, não erro.
- Decisões do GESTOR:
  - Dois arquivos: `scripts/gsc/baseline.mjs` (I/O: token, fetches, vite build,
    escrita do arquivo, flags) e `scripts/gsc/relatorio.mjs` (**puro**: agrega, decide,
    renderiza Markdown — é o que o teste cobre). Nada de I/O em `relatorio.mjs`.
  - Flags do CLI: `--dias N` (default 28) · `--sem-inspecao` (pula a URL Inspection) ·
    `--min-impressoes N` (default **30**, gatilho) · `--saida <dir>` (default
    `docs/seo`). Nome do arquivo: `baseline-<YYYY-MM-DD>.md` com a data de hoje em UTC
    (`new Date().toISOString().slice(0, 10)`); rodar de novo no mesmo dia sobrescreve.
  - Janela: `endDate` = hoje (UTC), `startDate` = hoje − `dias`. O GSC só devolve o que
    tem; a seção 1 declara a janela pedida E a primeira/última data com linha, se houver
    (terceira consulta opcional `dimensions: ['date']` — faça, é barata e é o que prova
    o "atrasa ~2 dias").
  - **Gatilho da rodada 4** (regra fixa, documentada pela track de docs com estas
    mesmas palavras): página com `position` média entre **8 e 20** (inclusive) E
    `impressions ≥ --min-impressoes` na janela. Lista ordenada por impressões, com as 3
    queries de maior impressão da página. Se vazio: "nenhuma página no gatilho ainda".
  - Seções do relatório, com ESTES títulos exatos (a track de docs referencia por
    nome), sempre as 8, mesmo vazias:
    1. `## 1. Propriedade e janela` — siteUrl, tipo (Domínio/Prefixo), permissão,
       janela pedida, primeira/última data com dado ou "sem dado ainda", aviso fixo:
       "o GSC atrasa ~2 dias; site no ar desde 2026-08-18".
    2. `## 2. Sitemap (API × ar × índice local)` — estado no GSC (lastSubmitted,
       lastDownloaded, isPending, errors/warnings, `submitted`), contagem de `<loc>` no
       ar, contagem do índice local (páginas + índices + home), divergências.
    3. `## 3. Cobertura por URL (URL Inspection)` — tabela-resumo `verdict ×
       coverageState → contagem` + tabela por URL (url, tipo, verdict, coverageState,
       lastCrawlTime ou "—"). Com `--sem-inspecao`: "não inspecionado nesta execução".
    4. `## 4. Queries com impressões (últimos N dias)` — top 50 por impressões
       (query, page, impressões, cliques, CTR, posição). Vazio → "sem dado ainda (…)".
    5. `## 5. Desempenho por página` — tabela por page (impressões, cliques, CTR,
       posição, tipo, hub principal), ordenada por impressões. Páginas do índice local
       SEM linha no GSC contadas numa frase ("N páginas sem impressão registrada").
    6. `## 6. Posição média por tipo e por hub` — duas tabelas: por `tipo`
       (solucao/plataforma/guia/dor/comparativo/glossario/hub/indice/home) e por `hub`
       (os 5 de `HUBS`; página com 2 hubs conta nos 2), com páginas-com-dado,
       impressões, cliques, posição média **ponderada por impressões**.
    7. `## 7. Gatilho da rodada 4` — a regra escrita + a lista (ou "nenhuma página no
       gatilho ainda").
    8. `## 8. Leitura honesta do dia zero` — 3–6 linhas geradas por regra, não por
       prosa livre: quantas URLs o Google conhece/indexou (da seção 3), se o sitemap
       está processado, quantos dias de dado existem, e a frase fixa "baseline útil
       pede ~4 semanas de coleta; este é o dia zero".
  - Números: `position` com 1 casa, `ctr` em % com 1 casa, inteiros sem separador.
    Estilo de tabela Markdown simples (`| a | b |`).
  - Falha alto: token/propriedade/sitemap-no-ar indisponíveis → `morrer()` exit 1 e
    **nenhum arquivo escrito pela metade** (monte a string inteira, escreva no fim).
    Falha NUMA inspeção de URL (ex.: 429) → registra "erro: <status>" na linha e
    continua; ≥ 10 erros seguidos → aborta a inspeção e diz isso na seção 3.
- Armadilhas do repo que ESTA track pode pisar:
  - `package.json` é `"type": "module"`; `.mjs` com `import` nativo. Só acrescente
    `"gsc:baseline": "node scripts/gsc/baseline.mjs"` — `build` não muda, e
    `pnpm build` tem de seguir em 68 rotas.
  - O `vite build --ssr` escreve em `.vite/` (ignorado). Não aponte `outDir` para
    `dist/`.
  - Vitest: include default pega `scripts/gsc/*.test.mjs`; `.claude/**` é excluído.
    Seu teste NÃO faz rede, NÃO roda o vite build, NÃO lê a chave — testa
    `relatorio.mjs` com fixtures inventadas (URLs `https://www.doxaviral.com/...`
    fictícias são ok).
  - Domínio com **L**. `keys[].page` do GSC vem sem barra final; o índice local
    (`urlDe`) também — não normalize "à toa" (mas tolere `/` final ao casar: a home é
    `https://www.doxaviral.com/`).
  - `docs/seo/baseline-*.md` é o ÚNICO arquivo em `docs/` que você toca. `keyword-map.md`,
    `COMO-ADICIONAR-UMA-PAGINA.md` e `CLAUDE.md` são da track B, em paralelo — **NÃO
    toque**.

## A TASK
1. `scripts/gsc/relatorio.mjs` — funções puras exportadas (nomes sugeridos):
   `extrairLocs(xml)` · `montarMapa({ paginas, secoes, urlDe, dominio })` →
   `Map<url, { tipo, hubs, titulo }>` (+ home) · `agregarPor(linhasPorPagina, mapa,
   'tipo' | 'hub')` · `gatilhoRodada4(linhasQueryPage, { posicaoMin: 8, posicaoMax: 20,
   minImpressoes })` · `resumirInspecao(resultados)` · `divergencias(locs, mapa)` ·
   `renderizarBaseline(dados)` → string com as 8 seções. Cada uma com JSDoc de 1–3
   linhas.
2. `scripts/gsc/relatorio.test.mjs` — ≥ 10 casos: `extrairLocs` (69 de um XML
   fixture pequeno com 3); `montarMapa` inclui home e índices; `agregarPor('tipo')` e
   `('hub')` com posição ponderada (prove a ponderação com 2 páginas de impressões
   diferentes); página com 2 hubs conta nos 2; `gatilhoRodada4` respeita 8–20 inclusive
   e o mínimo de impressões (casos na borda: 7.9, 8.0, 20.0, 20.1; 29 e 30
   impressões); `resumirInspecao` conta `verdict × coverageState`; `divergencias` nos
   dois sentidos; `renderizarBaseline` com tudo vazio contém as 8 `## N.` e a frase
   "sem dado ainda"; com dados contém a linha do gatilho; sem inspeção contém "não
   inspecionado nesta execução"; o texto gerado NÃO contém `ya29.` nem `Bearer`
   (teste-sentinela barato).
3. `scripts/gsc/baseline.mjs` — cabeçalho no padrão da casa (o quê, por quê, o custo em
   quota, as flags, o que é "dia zero"); `parseArgs` de `node:util` para as flags;
   sequência: token → propriedades → `escolherPropriedade` → sitemaps.list → sitemap no
   ar → vite build do mapa → searchAnalytics (page; query+page; date) → inspeção (salvo
   `--sem-inspecao`) → `renderizarBaseline` → `writeFile`. Log de progresso no stderr
   (`[gsc] inspecionando 12/69 …`) sem token. Ao fim, imprime o caminho do arquivo e
   um resumo de 3 linhas.
4. `package.json` — `"gsc:baseline": "node scripts/gsc/baseline.mjs"`.
5. Rodar **de verdade**: `pnpm gsc:baseline` → commita o `docs/seo/baseline-<hoje>.md`
   gerado (ele é o entregável do dia zero). Leia-o inteiro antes de commitar: nada de
   token, nada inventado, seções vazias dizendo "sem dado ainda".
6. Rodar `pnpm gsc:baseline --sem-inspecao --dias 7 --saida /tmp/claude-501/gsc-teste`
   (ou no scratchpad) para provar as flags; não commite esse.

## SCOPE
- scripts/gsc/baseline.mjs
- scripts/gsc/relatorio.mjs
- scripts/gsc/relatorio.test.mjs
- scripts/gsc/api.mjs
- package.json
- docs/seo/baseline-2026-08-19.md
(Se a execução cair em outro dia UTC, o nome muda para `baseline-<aquela-data>.md` —
um único arquivo de baseline, o da sua execução; reporte o nome. INTOCÁVEIS:
`scripts/gsc/auth.mjs`, `scripts/gsc/prova.mjs`, `scripts/gsc/auth.test.mjs`,
`scripts/gsc/api.test.mjs` (se alterar `api.mjs`, os testes existentes têm de
continuar verdes — não os edite; acrescente caso novo em `relatorio.test.mjs` se
precisar), `docs/seo/keyword-map.md`, `docs/seo/COMO-ADICIONAR-UMA-PAGINA.md`,
`CLAUDE.md`, `src/**`, `api/**`, `.gitignore`, `vercel.json`, `tsconfig*`.
Precisou → PARE e reporte.)

## DEPENDS ON
`prelude-gsc-acesso` mergeado em `main` (chave em `~/.config/doxa/`, `auth.mjs`,
`api.mjs`, `pnpm gsc:prova`). Paralela a `track-gsc-docs` (arquivos disjuntos).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm gsc:prova` no STEP 0 colado (propriedade + sitemap)
- `pnpm typecheck` = 0 erros · `pnpm test` verde, **29 arquivos** (28 da base +
  `relatorio.test.mjs`), cole o resumo · `pnpm build` ok, `[prerender] 68 rota(s)`
- `pnpm gsc:baseline` — stdout/stderr colados (sem token); termina com o caminho do
  arquivo; `echo "exit $?"` = 0
- `ls docs/seo/baseline-*.md` → exatamente 1 arquivo, da data de hoje (UTC)
- `grep -c "^## [1-8]\. " docs/seo/baseline-*.md` = 8
- `grep -nE "ya29\.|Bearer |BEGIN (RSA )?PRIVATE|private_key" docs/seo/baseline-*.md` = vazio
- `grep -n "69" docs/seo/baseline-*.md | head -3` → a contagem de `<loc>` no ar (69)
  aparece na seção 2; se o número no ar for outro, cole o que é e por quê
- Seção 3: a soma das contagens do resumo = número de URLs inspecionadas (cole as
  linhas); stderr tem `inspecionadas N URLs` com N ≤ 69
- `head -40 docs/seo/baseline-*.md` colado
- `GSC_KEY_PATH=/nao/existe pnpm gsc:baseline --saida /tmp/claude-501/gsc-neg; echo "exit $?"`
  → `exit 1`, mensagem com o caminho, e `ls /tmp/claude-501/gsc-neg` vazio/inexistente
  (nada escrito pela metade)
- `pnpm gsc:baseline --sem-inspecao --dias 7 --saida <scratchpad>` → exit 0, arquivo
  contém "não inspecionado nesta execução"; esse arquivo NÃO é commitado
- `git diff --name-only origin/main...HEAD | grep -vE '^(scripts/gsc/(baseline|relatorio|api)\.mjs|scripts/gsc/relatorio\.test\.mjs|package\.json|docs/seo/baseline-[0-9]{4}-[0-9]{2}-[0-9]{2}\.md)$'` = vazio
- `git diff origin/main...HEAD -- package.json` = exatamente 1 linha adicionada
- `git diff origin/main...HEAD | grep -nE "BEGIN (RSA )?PRIVATE KEY|private_key_id|ya29\.|Bearer [A-Za-z0-9]|as any|@ts-ignore|: any"` = vazio
- `git ls-files | grep -iE "service-account|doxa-506016"` = vazio

## COMMIT + PUSH
Commits: `feat(gsc): relatorio.mjs — agregação, gatilho da rodada 4 e render (puro) +
testes` · `feat(gsc): pnpm gsc:baseline — o relatório do dia zero` · `docs(seo):
baseline GSC <data> (dia zero)` → `git push -u origin track-gsc-baseline`. **NÃO
mergeie.** Report: item a item, saída COLADA do VERIFY (sem tokens), os números-chave
do baseline em 5 linhas (URLs conhecidas/indexadas, dias de dado, queries com
impressão, páginas no gatilho, estado do sitemap), verdict READY/NOT READY.
