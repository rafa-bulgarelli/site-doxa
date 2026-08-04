# Doxa — PRELUDE: scaffold Next.js + TS + Tailwind + tooling (task_prelude-scaffold-doxa)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/prelude-scaffold-doxa`,
branch **`prelude-scaffold-doxa`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `prelude-scaffold-doxa` · `git status --porcelain` vazio ·
você está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte**
(não conserte por conta própria: outra track pode estar nela).

## A VISÃO DO DONO
Quero abrir este repo e ver o projeto do site da Doxa nascendo de verdade — um `pnpm dev`
rodando, uma página abrindo no navegador (ainda que placeholder), já com o nome certo
("Doxa", nunca "Orca") em toda superfície visível, idioma PT-BR, e a esteira de qualidade
(typecheck/lint/test/build/CI) funcionando desde o primeiro commit. Isso é fundação — as
próximas tracks (design system, logo, Hero) constroem em cima do que você entrega aqui.

## CONTEXTO
- **Repo hoje:** vazio de produto. Só existe `.claude/` (harness), `CLAUDE.md`,
  `.gitignore` e `brand/doxa-wordmark-white.png` (logo em PNG, não é seu escopo tocar —
  outra track vetoriza). Você cria o projeto do zero.
- **Card:** `.claude/tower/cards/002-design-system-doxa-segmentacao-home.md` — leia se
  quiser o histórico completo; os fatos que importam para VOCÊ já estão resumidos aqui.
- **Decisão de stack do GESTOR** (recomendação não vetada pelo dono; card 001, obsoleto,
  já tinha essa mesma recomendação):
  - Framework: **Next.js (App Router) + TypeScript**, sem diretório `src/` (rotas em
    `app/` na raiz).
  - Estilo: **Tailwind CSS v4** — a versão atual do `create-next-app` já vem com Tailwind
    v4, que é **CSS-first**: tokens de tema vivem num bloco `@theme { … }` dentro de
    `app/globals.css`, **sem** `tailwind.config.ts`. É isso que este pack assume. Depois
    de rodar o scaffold, confirme (`pnpm ls tailwindcss`): se vier v3 (e o wizard gerar
    `tailwind.config.ts`), documente exatamente isso na seção "Fatos do repo" do
    `CLAUDE.md` (task 10) — as tracks seguintes (design tokens) leem esse registro antes
    de decidir em qual arquivo os tokens vão.
  - Package manager: **pnpm** — não use npm/yarn. Se o `create-next-app` gerar lockfile de
    outro gerenciador, apague e rode `pnpm install` para gerar `pnpm-lock.yaml`.
  - Test runner: **Vitest + @testing-library/react + jsdom** (não Jest).
  - Deploy: **Vercel** — a conexão da conta/projeto é feita pela sessão principal depois
    do merge. Você só garante que `pnpm build` funciona local.
  - Node: fixe em `.nvmrc` a versão ativa (`node --version`).
- **Nome do produto: "Doxa" — FINAL**, não provisório (isto muda em relação ao card 001
  obsoleto, que usava "Orca"). Nunca escreva "Orca" em nenhum texto visível ao usuário
  (título, metadata, conteúdo de página). "site-doxa" como nome de pacote é seguro.
- **Idioma: só PT-BR.** `<html lang="pt-BR">`.
- **Dependências que TRACKS FUTURAS vão precisar — instale AQUI, mesmo sem usar ainda:**
  `potrace` (traçar o logo em SVG a partir do PNG) e `jimp` (pré-processar a imagem antes
  de traçar) para a track de vetorização do logo; `@fontsource-variable/newsreader` (fonte
  de licença aberta, arquivos `.woff2` prontos) para a track de design tokens. **Por quê
  aqui e não nas tracks que vão usar:** `package.json`/`pnpm-lock.yaml` são arquivos
  compartilhados — se duas tracks paralelas (design tokens e logo) precisassem rodar
  `pnpm add` cada uma, elas colidiriam nesses dois arquivos e deixariam de ser
  paralelizáveis de verdade. Instalando tudo aqui, as tracks seguintes nunca tocam
  `package.json`/`pnpm-lock.yaml`.
- **Convenção de placeholder de conteúdo desta torre:** todo texto que depende do dono
  usa o texto literal `PENDENTE-DONO: <o que falta>` — **nunca** `TODO`/`FIXME` (o
  watchdog trata essas duas como débito de código, não de conteúdo). Crie
  `components/ui/PlaceholderNote.tsx`: renderiza esse texto com destaque visual (borda
  tracejada, fundo levemente diferenciado) — estilo neutro, não depende dos tokens de
  design que a próxima track ainda vai criar. As próximas tracks importam este
  componente para as rotas-stub.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga (aspas duplas,
  `export default` em páginas/componentes React, sem `any`/`as any`/`@ts-ignore`,
  `interface` para shapes de objeto, etc.). O exemplo de comando `pnpm check` nesse
  arquivo é de OUTRO repo — ignore; os comandos REAIS são os que você cria abaixo.

## Armadilhas conhecidas
- `main` tem `enforce_admins` ligado + PR obrigatório + histórico linear + sem force push.
  Você **não abre PR e não mergeia** — só commit + push. Isso é da sessão principal.
- O watchdog (`tower-watch.sh`) alerta **CONFIG** sempre que `package.json`, `tsconfig*`,
  `eslint*`, `postcss*`, `next.config.*`, `.prettierrc`, `.github/workflows/*` mudam
  dentro de uma track. **Nesta track isso é ESPERADO** (scaffold inicial criando esses
  arquivos pela primeira vez) — não pare por causa disso. Tracks futuras não devem tocar
  esses arquivos de novo sem aprovação explícita; se alguma precisar, ela para e reporta.
- Fonte `Francisco Serial` (`.ttf`) **não entra no repo** — já bloqueada pelo
  `.gitignore` (`Francisco*`, `*.ttf`, `*.otf`). Você não mexe com ela; é conhecimento
  para as próximas tracks, registre em CLAUDE.md → Armadilhas (task 10).

## A TASK
1. Rode `pnpm create next-app@latest .` na raiz do worktree com: TypeScript = sim,
   ESLint = sim, Tailwind CSS = sim, `src/` directory = **não**, App Router = sim, import
   alias = `@/*` padrão, use pnpm. Se o wizard perguntar algo não listado aqui, escolha o
   default e registre a escolha no report final.
2. Limpe o boilerplate: apague o conteúdo de exemplo em `app/page.tsx` e os SVGs de demo
   em `public/` (`next.svg`, `vercel.svg`). Mantenha o `app/favicon.ico` padrão por
   enquanto — ele é temporário e a `track-logo-vetor` vai **apagá-lo** ao criar o
   `app/icon.svg` com o X vazado. (Não "convivem": no App Router o `favicon.ico` tem
   precedência sobre o `icon.svg`, então deixar os dois faria a aba continuar mostrando
   o ícone do Next.) Não crie nenhum outro arquivo de ícone.
3. `app/layout.tsx`: layout BASE. `<html lang="pt-BR">`, `<body>{children}</body>`, **sem**
   header/footer (isso é de uma track futura). `metadata`:
   `title: "Doxa"`, `description: "PENDENTE-DONO: descrição/tagline do site."`.
4. `app/globals.css`: só as diretivas Tailwind padrão do scaffold (`@import "tailwindcss";`
   em v4, ou as 3 diretivas `@tailwind` em v3) — **sem** tokens de cor/tipografia ainda,
   isso é da próxima track. Não crie `@theme` aqui.
5. `app/page.tsx`: página HOME mínima só para o build passar — um parágrafo com
   `<PlaceholderNote texto="Home da Doxa em construção — ver card 002." />`. A track do
   Hero REESCREVE este arquivo por completo depois.
6. Instale as dependências de tooling e das tracks futuras (uma única rodada de
   `pnpm add`, ver "CONTEXTO" acima):
   - runtime: nenhuma extra além do que o `create-next-app` já traz.
   - dev: `vitest @vitejs/plugin-react jsdom @testing-library/react
     @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths prettier
     potrace jimp @fontsource-variable/newsreader`.
7. `vitest.config.ts` + `vitest.setup.ts` (jsdom, `@testing-library/jest-dom`, plugin
   `vite-tsconfig-paths` para resolver o alias `@/*`). Scripts em `package.json`:
   `dev`, `build`, `start`, `lint` (`next lint`), `typecheck` (`tsc --noEmit`),
   `test` (`vitest run`), `test:watch` (`vitest`). Adicione `"packageManager"` com a
   versão exata de pnpm instalada (`pnpm --version`). Confirme `"name"` em `package.json`
   não contém "orca" (ex.: `"site-doxa"`).
8. `.github/workflows/ci.yml`: roda em `pull_request` e `push` para `main` —
   `pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm lint` → `pnpm test` →
   `pnpm build`. Use `actions/setup-node` + cache pnpm (ou `pnpm/action-setup`).
9. `.prettierrc`: aspas duplas (desvio já documentado em `STYLE-GOOGLE-TS.md`).
10. `.nvmrc` com a versão de Node usada (`node --version`).
11. Atualize `CLAUDE.md` → seção "Fatos do repo": preencha **Stack** (inclua a versão
    exata do Tailwind resolvida e ONDE os tokens devem viver — `app/globals.css` via
    `@theme` se v4, ou `tailwind.config.ts` se v3), **Package manager / test runner /
    build** e **Deploy** com os fatos REAIS (comandos exatos). Em **Armadilhas**,
    registre: (a) o alerta CONFIG esperado neste prelude, (b) a Francisco Serial
    (`fsType=2`, não pode ser embarcada — já no `.gitignore`), (c) a decisão de manter
    `package.json`/`pnpm-lock.yaml` só nesta track para preservar paralelismo real entre
    as próximas duas tracks.
12. Crie `README.md` com: como rodar (`pnpm install`, `pnpm dev`), como testar, como
    buildar — 10 linhas, não um manifesto.

## SCOPE
- package.json
- pnpm-lock.yaml
- next.config.ts
- tsconfig.json
- postcss.config.mjs
- eslint.config.mjs
- .prettierrc
- .gitignore
- .nvmrc
- next-env.d.ts
- app/layout.tsx
- app/page.tsx
- app/globals.css
- app/favicon.ico
- public/next.svg
- public/vercel.svg
- components/ui/PlaceholderNote.tsx
- components/ui/PlaceholderNote.test.tsx
- vitest.config.ts
- vitest.setup.ts
- .github/workflows/ci.yml
- README.md
- CLAUDE.md

<!-- Se o create-next-app gerar nomes de arquivo de config diferentes dos listados acima
     (ex.: eslint.config.js em vez de .mjs, tailwind.config.ts se vier v3), isso está OK —
     mesma categoria de arquivo, não é escopo novo; registre em CLAUDE.md. Se ele criar
     arquivo de categoria DIFERENTE da listada aqui, PARE e reporte antes de prosseguir. -->

## DEPENDS ON
Nada — é o prelude, primeiro a rodar, parte de `origin/main` puro.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm lint` = 0 erros
- `pnpm test` verde (PlaceholderNote.test.tsx incluído)
- `pnpm build` conclui sem erro
- `pnpm ls potrace jimp @fontsource-variable/newsreader vitest 2>&1` mostra as 4
  instaladas (confirma a task 6)
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `grep -ri "orca" package.json app/layout.tsx app/page.tsx README.md` = vazio
- `pnpm dev` sobe local e a home (`/`) abre sem erro 500, com o `<title>` mostrando "Doxa"
  (confirme manualmente, cole que rodou)
- `grep -A3 "Stack:" CLAUDE.md` mostra a stack preenchida (não mais "a definir")

## COMMIT + PUSH
`chore(scaffold): projeto Next.js + TS + Tailwind + tooling do site Doxa` →
`git push -u origin prelude-scaffold-doxa`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
