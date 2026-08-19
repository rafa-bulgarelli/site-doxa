# 404 de verdade — o rewrite da SPA só para as rotas da SPA (track-404-real)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree · `git status --porcelain` vazio ·
`git fetch origin && git checkout -B track-404-real origin/main` · `pnpm install --frozen-lockfile`.
Leia antes: `CLAUDE.md` (Fatos do repo — Vercel atrás de Cloudflare; o rewrite do
`vercel.json`; a biblioteca prerenderizada; `vercel build` e o TS2835 pré-existente;
preview atrás de SSO), `vercel.json`, `vercel.README.md`, `scripts/prerender.mjs`,
`src/seo/prerender/entrada.tsx`, `src/seo/layout/{Casca,PaginaSecao}.tsx`,
`src/seo/seo.test.ts`, `src/App.tsx` (as 5 rotas: `/`, `/leads`, `/manual-doxa(/…)`,
`/conversor(/…)`, `/admin` exato — ~linhas 81–115), `.claude/STYLE-GOOGLE-TS.md`.

## A VISÃO DO DONO
`/guias/nao-existe` devolve 200 com a landing: soft-404 para o Google, e para a pessoa
uma home que não explica nada. Queremos 404 de verdade, com uma página da casa que
aponta para as seções — sem quebrar nenhuma das 5 rotas da SPA.

## CONTEXTO
- Hoje: `rewrites: [{ source: "/((?!api/)(?!.*\\.[a-zA-Z0-9]{1,8}$).*)", destination: "/index.html" }]`
  — tudo sem extensão vira landing. O Build Output já tem a rota de erro
  `{"status":404,"src":"^(?!/api).*$","dest":"/404.html"}` (preset Vite da Vercel) — só
  falta `dist/404.html` existir e o rewrite parar de engolir tudo.
- Filesystem vem ANTES do rewrite: `dist/solucoes/x/index.html` etc. continuam sendo
  servidos; `trailingSlash: false` continua dando 308.
- A SPA precisa do fallback SÓ para: `/leads`, `/admin`, `/conversor`(+sub),
  `/manual-doxa`(+sub). `/` é `index.html` no filesystem. Tudo o mais → 404.
- O motor SEO renderiza páginas com `renderToStaticMarkup` a partir de
  `src/seo/prerender/entrada.tsx`; há `PaginaSecao` (índice de seção) como forma
  simples. O 404 é uma página ESTÁTICA sem JS, na casca da biblioteca (cabeçalho com as
  seções, rodapé), H1 "Página não encontrada", uma frase, links para as 5 seções e para
  a home; `<meta name="robots" content="noindex">`; SEM entrar no sitemap; title
  próprio; canonical NÃO (página de erro).

## A TASK
1. `vercel.json`: trocar o rewrite por um que case SÓ as rotas da SPA:
   `{ "source": "/(leads|admin|conversor|manual-doxa)(/.*)?", "destination": "/index.html" }`
   (confira a sintaxe de path-to-regexp da Vercel — grupos com `(…)` e `(/.*)?`; se
   preferir dois rewrites, ok). Manter `api/` fora (já não casa). `vercel.README.md`:
   documentar o porquê e a tabela de casos (as 5 rotas → 200 landing; `/solucoes/x` →
   filesystem; `/guias/nao-existe` → 404 com `404.html`; `/qualquer.ext` → 404).
2. `src/seo/layout/Pagina404.tsx` (novo) + hook no `entrada.tsx`/`prerender.mjs` para
   escrever `dist/404.html` (na RAIZ do dist — é onde a Vercel procura) fora da lista
   de rotas do sitemap. Conteúdo em PT-BR, tom da casa (direto, sem gracinha). Sem
   classes Tailwind novas que exijam mexer no config (use as que já existem nos layouts).
3. `src/seo/seo.test.ts`: `dist/404.html`… não — o teste roda antes do build; então um
   teste de render da `Pagina404` (título, noindex, links para as 5 seções, sem
   canonical). E um caso no `sitemap.test.ts`? NÃO mexa — garanta que o 404 não entra
   no sitemap porque não é página do índice (explique no comentário).
4. Prova local: `pnpm build` → `test -f dist/404.html`; `grep -c 'noindex' dist/404.html` = 1;
   `grep -c '<h1' dist/404.html` = 1; `grep -c 'href="/guias"' dist/404.html` ≥ 1;
   `grep -c '404' dist/sitemap.xml` = 0. `vercel pull --yes --environment preview`
   (só settings; env é `[SENSITIVE]` e não importa) + `vercel build --yes` → ler
   `.vercel/output/config.json`: rotas com o rewrite novo e `handle: filesystem` antes;
   `.vercel/output/static/404.html` existe. (O TS2835 do builder é pré-existente — ignore.)
   `vite preview` NÃO reproduz a Vercel (sirv serve index.html para tudo) — a prova
   final é em produção, pela sessão principal, depois do merge.

## SCOPE
- vercel.json
- vercel.README.md
- scripts/prerender.mjs
- src/seo/prerender/entrada.tsx
- src/seo/layout/Pagina404.tsx
- src/seo/seo.test.ts
(INTOCÁVEIS: `src/App.tsx`, `src/seo/tipos.ts`, `src/seo/rotas-planejadas.ts`,
`src/seo/sitemap.ts`, `src/seo/conteudo/**`, `tailwind.config.js`. Precisou → PARE e reporte.)

## DEPENDS ON
`origin/main` @ `5b8bd73`+. Merge só com a sessão principal pronta para VALIDAR-LIVE
(as 5 rotas da SPA em produção logo após o deploy).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde · `pnpm build` ok (68 rotas + `dist/404.html`)
- `test -f dist/404.html && grep -c 'noindex' dist/404.html` = 1 · `grep -c '<h1' dist/404.html` = 1 · `grep -c 'href="/guias"' dist/404.html` ≥ 1 · `grep -c 'rel="canonical"' dist/404.html` = 0 · `grep -c '404' dist/sitemap.xml` = 0 · `grep -c '<loc>' dist/sitemap.xml` = 69
- `node -e "const c=require('./.vercel/output/config.json');console.log(JSON.stringify(c.routes))"` colado: o rewrite novo (só leads|admin|conversor|manual-doxa), `handle: filesystem` antes dele, a rota de erro para `/404.html`; `test -f .vercel/output/static/404.html`
- `git diff --name-only origin/main...HEAD | grep -vE '^(vercel\.json|vercel\.README\.md|scripts/prerender\.mjs|src/seo/prerender/entrada\.tsx|src/seo/layout/Pagina404\.tsx|src/seo/seo\.test\.ts)$'` = vazio
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
Um commit por item → `git push -u origin track-404-real`. **NÃO mergeie.** Report:
`vercel.json` final colado, rotas do `config.json` coladas, `head -30 dist/404.html`,
saída do VERIFY, verdict READY/NOT READY.
