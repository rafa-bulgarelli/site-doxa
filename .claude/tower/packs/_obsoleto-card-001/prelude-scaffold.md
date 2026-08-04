# Site Orca — PRELUDE: scaffold Next.js + TS + Tailwind (task_prelude-scaffold)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/prelude-scaffold`,
branch **`prelude-scaffold`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `prelude-scaffold` · `git status --porcelain` vazio · você
está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
Quero abrir este repo e ver o projeto do site nascendo de verdade — um `pnpm dev` rodando,
uma página abrindo no navegador, já com a cara visual que a Orca vai ter (cores, tipografia,
espaçamento consistentes), mesmo que o texto ainda seja placeholder. Quero que isso já suba
pro ar numa URL que eu consiga abrir do celular, e quero PR aberto pra eu poder aprovar.

## CONTEXTO
- **Repo hoje:** vazio de produto. Só existe `.claude/` (harness), `CLAUDE.md` e `.gitignore`
  na raiz. Não existe `package.json`, não existe diretório de app. Você está criando o
  projeto do zero.
- **Decisão de stack do GESTOR (já aprovada pelo dono antes deste spawn):**
  - Framework: **Next.js (App Router) + TypeScript**, sem diretório `src/` (rotas em
    `app/` na raiz, componentes em `components/` na raiz).
  - Estilo: **Tailwind CSS** (versão que o `create-next-app` instalar — confirme a exata
    no `package.json` gerado e registre em `CLAUDE.md`).
  - Package manager: **pnpm** (não use npm/yarn — se o `create-next-app` perguntar,
    responda pnpm; se ele gerar lockfile de outro gerenciador, apague e rode
    `pnpm install` para gerar `pnpm-lock.yaml`).
  - Test runner: **Vitest + @testing-library/react + jsdom** (não Jest).
  - Deploy: **Vercel** (conexão da conta é feita pela sessão principal depois do merge —
    você só garante que `pnpm build` funciona local).
  - Node: fixe em `.nvmrc` a versão LTS ativa no momento (registre a versão exata usada).
- **Nome do produto ainda não decidido** (repo = `site-doxa`, dono fala "site da Orca").
  Use **"Orca" como nome PROVISÓRIO** em título/metadata, mas deixe explícito no próprio
  texto visível que é provisório (ver task 6). NÃO invente slogan, tagline ou descrição de
  produto — isso é conteúdo bloqueado, não seu.
- **Convenção de placeholder de conteúdo desta torre:** todo texto que depende do dono
  (copy, posicionamento, descrição) usa o texto literal `PENDENTE-DONO: <o que falta>` —
  NUNCA as palavras `TODO`/`FIXME` (o watchdog trata essas duas como débito de código, não
  débito de conteúdo, e viraria alerta confuso). Crie um componente
  `components/ui/PlaceholderNote.tsx` que renderiza esse texto visualmente destacado
  (borda tracejada, fundo diferenciado) para qualquer bloco de conteúdo pendente — as
  próximas tracks vão importar esse componente.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga (aspas duplas,
  `export default` em páginas/componentes React, sem `any`/`as any`/`@ts-ignore`,
  `interface` para shapes de objeto, etc.). Esse arquivo já tem `pnpm check`/`pnpm test`
  como exemplo genérico de um outro repo — ignore os exemplos de comando, os comandos
  REAIS deste repo são os que você mesmo vai criar nos scripts abaixo.

## Armadilhas conhecidas deste repo
- `main` tem `enforce_admins` ligado + PR obrigatório + histórico linear + sem force push.
  Você **não abre PR e não mergeia** — só commit + push. Isso é da sessão principal.
- O watchdog (`tower-watch.sh`) alerta **CONFIG** sempre que `package.json`, `tsconfig*`,
  `eslint*`, `tailwind*`, `next.config.*`, `.prettierrc`, `.github/workflows/*` mudam
  dentro de uma track. **Nesta track isso é ESPERADO** (é o scaffold inicial criando esses
  arquivos pela primeira vez) — não é afrouxamento de gate, não pare por causa disso.
  Tracks futuras (depois deste prelude) NÃO devem tocar esses arquivos de novo sem
  aprovação — se alguma precisar, ela para e reporta.
- Não existe `CLAUDE.md` com stack preenchida ainda — você é quem vai preenchê-la (task 7).

## A TASK
1. Rode `pnpm create next-app@latest .` (ou equivalente) na raiz do worktree, com:
   TypeScript = sim, ESLint = sim, Tailwind CSS = sim, `src/` directory = **não**,
   App Router = sim, import alias = `@/*` padrão. Se o wizard perguntar coisa não listada
   aqui, escolha o default e registre a escolha no report final.
2. Limpe o boilerplate default do Next: apague o conteúdo de exemplo em `app/page.tsx` e
   os SVGs de demo em `public/` (`next.svg`, `vercel.svg`, etc. — mantenha só o favicon
   padrão por enquanto, logo real é `PENDENTE-DONO`).
3. `app/layout.tsx`: layout BASE, só renderiza `{children}` dentro de `<html><body>` (SEM
   header/footer — isso é de uma track futura). Preencha `metadata` com título/descrição
   honestos e marcados como provisórios, ex.:
   `title: "Orca (nome provisório) — site em construção"`,
   `description: "PENDENTE-DONO: descrição do produto ainda não definida."`
4. `app/globals.css`: diretivas Tailwind + tokens base (cor primária provisória, fonte —
   escolha algo neutro e profissional, documente que é placeholder de design final).
5. `app/page.tsx`: página HOME mínima só para o build passar — um `<Container>` com um
   `<PlaceholderNote>` dizendo que o conteúdo real está pendente. A track de home vai
   REESCREVER este arquivo por completo depois.
6. Crie os primitivos de design em `components/ui/`:
   - `Button.tsx` (variantes primary/secondary via prop, usa `<button>` ou `<a>` conforme
     prop `href`)
   - `Container.tsx` (max-width + padding horizontal responsivo)
   - `Section.tsx` (espaçamento vertical consistente entre seções de página)
   - `PlaceholderNote.tsx` (ver task/contexto acima)
   Cada um com um teste de smoke em `.test.tsx` correspondente (renderiza, confere que o
   texto/aria essencial aparece).
7. Configure `vitest.config.ts` + arquivo de setup (`vitest.setup.ts`) com jsdom e
   `@testing-library/jest-dom`. Adicione ao `package.json` os scripts:
   `dev`, `build`, `start`, `lint` (next lint), `typecheck` (`tsc --noEmit`),
   `test` (`vitest run`), `test:watch` (`vitest`). Adicione campo `"packageManager"` com a
   versão exata de pnpm instalada (`pnpm --version`).
8. `.github/workflows/ci.yml`: roda em `pull_request` e `push` para `main` —
   `pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm lint` → `pnpm test` →
   `pnpm build`. Use `actions/setup-node` + cache pnpm (ou `pnpm/action-setup`).
9. `.prettierrc`: aspas duplas (deviação já documentada em `STYLE-GOOGLE-TS.md`); some com
   `prettier-plugin-tailwindcss` se quiser ordenar classes (opcional, não obrigatório).
10. `.nvmrc` com a versão de Node usada.
11. Atualize `CLAUDE.md` → seção "Fatos do repo": preencha **Stack**, **Package manager /
    test runner / build** e **Deploy** com os fatos REAIS (versões exatas resolvidas,
    comandos exatos). Preencha também uma linha em **Armadilhas** registrando o alerta
    CONFIG esperado do item acima (para a próxima sessão não se assustar de novo).
12. Atualize `README.md` com: como rodar (`pnpm install`, `pnpm dev`), como testar, como
    buildar — 10 linhas, não um manifesto.

## SCOPE
- package.json
- pnpm-lock.yaml
- next.config.ts
- tsconfig.json
- tailwind.config.ts
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
- components/ui/Button.tsx
- components/ui/Button.test.tsx
- components/ui/Container.tsx
- components/ui/Section.tsx
- components/ui/PlaceholderNote.tsx
- components/ui/PlaceholderNote.test.tsx
- vitest.config.ts
- vitest.setup.ts
- .github/workflows/ci.yml
- README.md
- CLAUDE.md

<!-- Se o create-next-app gerar nomes de arquivo de config diferentes dos listados acima
     (ex.: eslint.config.js em vez de .mjs, postcss.config.js), isso está OK — é a mesma
     categoria de arquivo, não é escopo novo. Se ele criar arquivo de categoria DIFERENTE
     da listada aqui (ex.: um diretório app/ inteiro extra que não faz parte do scaffold
     básico), PARE e reporte antes de prosseguir. -->

## DEPENDS ON
Nada — é o prelude, primeiro a rodar, parte de `origin/main` puro.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm lint` = 0 erros
- `pnpm test` verde (Button.test.tsx + PlaceholderNote.test.tsx incluídos)
- `pnpm build` conclui sem erro
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `pnpm dev` sobe local e a home (`/`) abre sem erro 500 (confirme manualmente, cole que
  rodou)
- `cat CLAUDE.md | grep -A1 "Stack:"` mostra a stack preenchida (não mais "a definir")

## COMMIT + PUSH
`chore(scaffold): projeto Next.js + TS + Tailwind + tooling do site da Orca` →
`git push -u origin prelude-scaffold`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
