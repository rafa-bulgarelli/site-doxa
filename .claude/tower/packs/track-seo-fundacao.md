# SEO orgânico — Track FUNDAÇÃO: OG, schema, robots, testes SEO, CTA que chega (task_seo_fundacao)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-fundacao origin/feat/seo-organico` — e confirme que
`src/seo/tipos.ts` e `scripts/prerender.mjs` EXISTEM (o prelude já está na base).
Divergiu → **PARE e reporte**.

Leia antes: `src/seo/README.md`, `src/seo/tipos.ts`, `src/seo/head.ts`,
`src/seo/schema.ts`, `src/seo/seo.test.ts` (o que o prelude deixou), `CLAUDE.md`
(Fatos do repo — inteiro), `.claude/STYLE-GOOGLE-TS.md`.

## A VISÃO DO DONO
Link da Doxa colado no WhatsApp mostra cartão com imagem. O Google enxerga a
Organização, o site e cada artigo com dados estruturados que não mentem. Rotas
privadas fora do índice. Um teste roda no `pnpm test` e reprova title/H1/description
duplicados, canonical errado, link quebrado, sitemap incompleto. E o botão "Falar
com a Doxa" de qualquer página nova CHEGA no formulário da landing — hoje o
`main.tsx` apaga o `#forms` no load e o link cai no topo da home.

## CONTEXTO (não perca tempo redescobrindo)
- **Você é a ÚNICA track que toca o motor (`src/seo/**` fora de `conteudo/`) e a
  landing (`index.html`, `src/main.tsx`, `src/App.tsx`).** Três tracks de conteúdo
  rodam em paralelo só em `src/seo/conteudo/<dir>/**` — NÃO edite nada lá; se um
  teste seu reprovar conteúdo delas, o teste está certo e o report lista os arquivos
  (a sessão principal manda corrigir).
- **og:image / og:url:** `index.html` tem as duas linhas COMENTADAS com a nota
  "domínio ainda não existe" — existe: `https://www.doxaviral.com`. Não há
  `public/og.png`. Você gera: `scripts/og-imagem.mjs` escreve um HTML 1200×630
  (fundo `#000`, wordmark `brand/doxa-wordmark-white-96.avif` — use o
  `brand/doxa-wordmark-white.png` de 13 KB se precisar de mais resolução —, a
  promessa "Um milhão de views. Ou seu dinheiro de volta." em Instrument Serif,
  linha menor "Uma foto e um áudio viram sessenta conteúdos em noventa dias.")
  e roda `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --screenshot=public/og.png --window-size=1200,630 --hide-scrollbars
  file://…` (Chrome existe nesta máquina). Fontes: `file://` para
  `public/fonts/*.woff2`. PNG (não AVIF/WebP — leitores de link não leem). Commit do
  script + do PNG. Depois: descomente `og:image` (URL ABSOLUTA
  `https://www.doxaviral.com/og.png`), `og:image:alt`, `og:image:width/height`,
  `og:url`, e acrescente `<link rel="canonical" href="https://www.doxaviral.com/">`
  e `twitter:image`. Atualize o comentário do `index.html` (ele narra a história;
  troque "PENDENTE-DONO" pelo que aconteceu). Em `src/seo/site.ts`, `OG_IMAGEM =
  'https://www.doxaviral.com/og.png'` — o `head.ts` do prelude já emite quando não
  é null (confira).
- **JSON-LD:** na landing, `Organization` (name Doxa, url, logo = og.png ou wordmark,
  `sameAs` SÓ se houver perfis oficiais no repo — não achou, não põe) + `WebSite`
  (sem `SearchAction`: o site não tem busca), como `<script type="application/ld+
  json">` estático no `index.html`. No motor (`src/seo/schema.ts`): `Organization`
  (o mesmo objeto, uma função só), `WebPage`/`Article` (guia, dor, comparativo,
  glossário: `headline`, `datePublished`/`dateModified` = `atualizadoEm`,
  `author`/`publisher` = Organization), `BreadcrumbList` (já do prelude), `FAQPage`
  SÓ quando a página tem bloco `faq` e com as MESMAS perguntas/respostas visíveis
  (§24: nunca marcar o que não aparece). Cada builder com teste que valida a forma
  (`@context`, `@type`, campos obrigatórios, sem `undefined` serializado).
- **Robots:** `public/robots.txt` — acrescente `Disallow` para `/leads`, `/admin`,
  `/conversor`, `/manual-doxa/`, `/api/` (rotas privadas/por token; §26) mantendo o
  comentário-história do arquivo e a linha `Sitemap:`. ARMADILHA: o servido ≠ o do
  repo (o Cloudflare prepende um bloco de IA-crawlers) — não tente "consertar" isso;
  o VERIFY compara só o seu arquivo.
- **`llms.txt`:** acrescente uma seção `## Biblioteca` com os 5 índices (`/solucoes`,
  `/plataformas`, `/guias`, `/comparativos`, `/glossario`) e uma linha cada. Não
  liste páginas individuais (elas mudam toda noite; o índice não).
- **O CTA que chega (`/#forms`):** `src/main.tsx` faz `history.replaceState` apagando
  QUALQUER hash antes do primeiro render, por dois motivos documentados no próprio
  arquivo (restauração de rolagem e âncora herdada no RELOAD). A regra nova, mínima:
  apagar só quando `performance.getEntriesByType('navigation')[0]?.type` for
  `reload` ou `back_forward` (ou indisponível → comportamento de hoje); numa
  navegação `navigate` com `#forms`, manter o hash. Extraia a decisão para
  `src/fragmento.ts` (`function deveManterFragmento(tipo: string | undefined, hash:
  string): boolean`) com `src/fragmento.test.ts`. Em `src/App.tsx`, o efeito do
  "SEGURO DA ÂNCORA" já tem `rolarQuandoChegar(60)`: acrescente, NO MESMO efeito, a
  checagem na montagem — se `window.location.hash === HREF_FORMS`, importa a
  `Comparacao` e chama `rolarQuandoChegar(60)`. Só isso muda em `App.tsx`; NENHUMA
  outra linha. Atualize os comentários dos dois arquivos (eles contam a história —
  o "link profundo vindo de fora, que este site ainda não usa" agora existe).
- **Testes SEO (`src/seo/seo.test.ts` + `src/seo/auditoria.ts`):** o prelude cobre
  unicidade/slug/links/sitemap/h1. Você acrescenta: canonical de CADA página gerada
  bate com a URL; description sem duplicata "quase igual" (normalizada); todo `hub`
  do union `Hub` tem página de tipo `hub` OU está em `ROTAS_PLANEJADAS` (aviso, não
  falha, até a track de hubs mergear); JSON-LD de cada página parseia e o
  `BreadcrumbList` tem os itens do breadcrumb visível; nenhuma página com `corpo`
  < 300 palavras fora de `glossario` (glossário ≥ 120); ninguém abre com "No mundo
  digital"/"Em um mundo"/"Atualmente,"/"Nos dias de hoje" (§19). Órfãs no sentido
  estrito (recebe link só do índice de seção) = `auditar()` devolve AVISO listado
  no report, não falha (as tracks de conteúdo mergeiam em ordem imprevisível; a
  auditoria estrita entra como gate da FASE 2). Um `pnpm seo:audit`
  (`scripts/seo-audit.mjs` importando o bundle do prerender, ou vitest com
  `--reporter`; você decide) que imprime avisos + o grafo (páginas, links de ida e
  volta, hubs sem membro).
- **Layout (só refinamento, sem redesenho):** TOC sticky no desktop para artigos
  com ≥ 4 títulos nível 2 (`position: sticky`, sem JS), `<time>` no `atualizadoEm`,
  breadcrumb com o mesmo JSON-LD, `alt` real na wordmark, `loading="lazy"` em
  qualquer `<img>` abaixo da dobra. Nada de animação nem cor.
- Armadilhas do repo (desta track): **pnpm** · `App.tsx`/`main.tsx` são a landing —
  mudança incremental, cada linha justificada em comentário; `focus()` na montagem
  rola a página sozinha; o `#forms` mora num elemento SEM transform (`ancoras.ts`
  explica) · o hash de `dist/assets/index-*.js` NÃO é critério (muda por cascata de CSS —
  provado no prelude); a não-regressão da landing é medida por diff de `src/App.tsx`
  e `src/main.tsx` SÓ com o bloco do fragmento, e pelo executor colar
  `git diff origin/feat/seo-organico...HEAD -- src/App.tsx src/main.tsx` inteiro no
  report · robots servido ≠ repo · `verbatimModuleSyntax` só no projeto api (não é o
  seu) · `noUnusedLocals`.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`.

## A TASK
0. **PRIMEIRO — ressalvas do collector do prelude (PR #49), você é dono do motor:**
   a. `src/seo/layout/Cabecalho.tsx` — nav `flex-nowrap` + `whitespace-nowrap` estoura
      em 320/375px com 3+ seções (~470px). Conserto: só **Soluções · Guias** no
      cabeçalho (o resto vai no rodapé, que já lista tudo) OU `flex-wrap`; prove com o
      medidor de mobile abaixo em 320px com as 5 seções simuladas no teste.
   b. `src/seo/indice.ts` `resolverLink` (~:148) — `/`, `/#forms`, `/#faq` (a landing)
      têm de resolver como `existe`; hoje viram `desconhecida` e `Blocos.tsx:47-50`
      lança no render. Teste cobrindo os três.
   c. Âncoras à mão: `src/seo/site.ts:150` (`'/#forms'`) e `src/seo/layout/Rodape.tsx:41`
      (`'/#faq'`) → importar de `src/ancoras.ts` (`HREF_FORMS`, `HREF_FAQ`; é puro, só
      leitura — NÃO edite `ancoras.ts`).
   d. `src/seo/indice.ts:119-120` — tirar o `.sort()` de `Object.keys(SECOES)`; a ordem
      de inserção em `SECOES` já é a ordem editorial (Soluções primeiro).
   e. `src/seo/README.md` — apontar a fonte de fatos para `docs/seo/source-of-truth.md`
      (não "landing, FAQ, llms.txt"); dizer que `Hub` é union fechada (hub novo =
      `tipos.ts` + `HUBS` em `site.ts` + `rotas-planejadas.ts`, decisão do gestor).
   f. NITs do motor: `head.ts:77` `twitter:card` = `summary` enquanto `OG_IMAGEM` for
      null (você vai criar a og.png nesta track — então vira `summary_large_image`
      junto); `Cta.tsx:21` passar `cta.texto` por `Inline` (o contrato promete marcação
      em todo `texto`); `schema.ts:79-90` `faqPage` achata `resposta` via `tokens()`
      antes de ir ao JSON-LD; `seo.test.ts:147,162` escapar HTML antes de comparar
      title/description (`&`, `'`, `"`); `scripts/prerender.mjs` build SSR com
      `publicDir: false` (hoje copia 27 MB de `public/` a cada build).
   g. `docs/seo/regua-de-copy.md` item 11 ("CTA um só, no fim") vs layout (CTA no hero
      + no fecho + botão do cabeçalho): decisão do gestor = **layout fica**; ajuste a
      régua para "CTA no hero e no fecho, nunca no meio do corpo" (1 linha).
1. `scripts/og-imagem.mjs` + `public/og.png` (1200×630, < 300 KB).
2. `index.html`: og:image/og:image:alt/width/height, og:url, canonical, twitter:image,
   JSON-LD Organization + WebSite; comentário atualizado.
3. `src/seo/site.ts` (`OG_IMAGEM`), `src/seo/schema.ts` (+ `schema.test.ts`),
   `src/seo/head.ts` (twitter:image, og:image dims), `src/seo/layout/*` (TOC/time/
   breadcrumb schema/lazy), `src/seo/prerender/entrada.tsx` se o JSON-LD por página
   precisar (provável: `Article`/`FAQPage` dependem do tipo).
4. `src/seo/seo.test.ts` (regras novas), `src/seo/auditoria.ts` (+ teste),
   `scripts/seo-audit.mjs`, `package.json` (`"seo:audit"`), `src/seo/README.md`
   (seção "o que os testes cobram" e "auditoria").
5. `src/fragmento.ts` + `src/fragmento.test.ts`; `src/main.tsx`; `src/App.tsx` (só o
   bloco descrito).
6. `public/robots.txt`, `public/llms.txt`.

## SCOPE
- docs/seo/regua-de-copy.md
- index.html
- public/og.png
- public/robots.txt
- public/llms.txt
- scripts/og-imagem.mjs
- scripts/seo-audit.mjs
- scripts/prerender.mjs
- package.json
- src/main.tsx
- src/App.tsx
- src/fragmento.ts
- src/fragmento.test.ts
- src/seo/site.ts
- src/seo/head.ts
- src/seo/head.test.ts
- src/seo/schema.ts
- src/seo/schema.test.ts
- src/seo/auditoria.ts
- src/seo/auditoria.test.ts
- src/seo/seo.test.ts
- src/seo/README.md
- src/seo/indice.ts
- src/seo/sitemap.ts
- src/seo/sitemap.test.ts
- src/seo/prerender/entrada.tsx
- src/seo/layout/** (refinamento; arquivos do prelude)

(INTOCÁVEIS: `src/seo/conteudo/**` — é das tracks de conteúdo; `src/seo/tipos.ts` e
`src/seo/rotas-planejadas.ts` — o contrato: precisou mudar → PARE e reporte;
`vercel.json`, `tailwind.config.js`, `vite.config.ts`, `src/components/**`.)

## DEPENDS ON
`prelude-seo-motor` mergeado em `feat/seo-organico`. Roda em PARALELO com
`track-seo-conteudo-solucoes`, `track-seo-conteudo-guias`, `track-seo-hubs-nav`.

**Medidor de mobile (use no VERIFY, não confie em `--window-size=390`):**
`(pnpm preview --port 5299 >/dev/null 2>&1 &); sleep 2; node .claude/tower/bin/mobile-shot.mjs http://localhost:5299/<rota>/ 320 <print.png>` — imprime `scrollWidth`/`clientWidth` (têm de ser iguais) e os elementos que passam da borda (só a tabela dentro de `overflow-x-auto` é aceitável). Print vai para o scratchpad e é descrito no report.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde (baseline main 19/504 + prelude +
  os seus) · `pnpm build` ok · `pnpm seo:audit` roda e imprime o grafo (avisos ≠ falha)
- `test -f public/og.png && file public/og.png | grep -c 'PNG image data, 1200 x 630'` = 1 · `stat -f%z public/og.png` < 300000
- `grep -c 'property="og:image" content="https://www.doxaviral.com/og.png"' index.html` = 1 · `grep -c 'property="og:url" content="https://www.doxaviral.com/"' index.html` = 1 · `grep -c 'rel="canonical" href="https://www.doxaviral.com/"' index.html` = 1 · `grep -c 'application/ld+json' dist/index.html` ≥ 1 · `grep -o '"@type":"\(Organization\|WebSite\)"' dist/index.html | sort -u | wc -l` = 2 (após `pnpm build`)
- `P=dist/solucoes/producao-de-videos-com-ia/index.html; grep -c 'og:image' $P` ≥ 1 · `grep -o '"@type":"[A-Za-z]*"' $P | sort -u` inclui `BreadcrumbList` e `WebPage`
- `grep -cE '^Disallow: /(leads|admin|conversor|manual-doxa/|api/)$' public/robots.txt` = 5 · `grep -c '^Sitemap: https://www.doxaviral.com/sitemap.xml' public/robots.txt` = 1 · `grep -c '^## Biblioteca' public/llms.txt` = 1
- `pnpm test src/fragmento.test.ts` verde com casos: (`reload`, `#forms`)→false ·
  (`back_forward`, `#faq`)→false · (`navigate`, `#forms`)→true · (`undefined`,
  `#forms`)→false · (`navigate`, `''`)→false
- `git diff origin/feat/seo-organico...HEAD -- src/App.tsx | grep -c '^[+-]' ` ≤ 40
  (mudança pequena e localizada) e `git diff origin/feat/seo-organico...HEAD -- src/App.tsx | grep -E '^\+' | grep -c 'rolarQuandoChegar'` ≥ 1
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -E '^src/seo/conteudo/|^src/seo/tipos\.ts|^src/seo/rotas-planejadas\.ts|^vercel\.json|^tailwind'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- Prova manual (Chrome headless): `(pnpm preview --port 5299 >/dev/null 2>&1 &); sleep 2; "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --dump-dom "http://localhost:5299/#forms" 2>/dev/null | grep -c 'id="forms"'` ≥ 1 (a seção montou) — e descreva no report como validou que a rolagem acontece (ex.: `--screenshot` após `--virtual-time-budget=5000`). `pkill -f "vite preview --port 5299"`.

## RESUMO DO BRIEF QUE VALE AQUI (`.claude/tower/briefs/011-seo-missao-do-dono.md`)
§1 corrigir og:image/og:url com o domínio real · §23–24 schemas aplicáveis,
centralizados, nunca contradizendo a página nem marcando conteúdo invisível ·
§25–27 sitemap só canônicas; robots audita rotas privadas; canonical por página ·
§39–41 automatizar duplicados/canonical/slug/links/órfãs/schema/sitemap; nenhum
batch sem build+typecheck+tests · §59 OG é prioridade rápida, URL absoluta · §68
não destruir o que funciona (landing: mudança mínima, comentada).

## COMMIT + PUSH
`feat(seo): fundação — OG com imagem, JSON-LD, robots, testes SEO e o CTA que chega
no formulário` → `git push -u origin track-seo-fundacao`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY + a lista de
avisos do `seo:audit` (órfãs, hubs sem membro, links planejados ainda sem página).
