# Site Orca — Track A: Header e Footer (task_track-site-chrome)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-site-chrome`,
branch **`track-site-chrome`** (JÁ criada pelo `tower-track.sh` a partir da base, que já
inclui o prelude mergeado em `main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-site-chrome` · `git status --porcelain` vazio · você
está na worktree, não no repo principal. Confirme que `components/ui/*` e
`app/layout.tsx` (versão bare, só `{children}`) já existem do prelude — se não existirem,
**PARE e reporte**.

## A VISÃO DO DONO
Quero ver o site com cabeçalho e rodapé de verdade — um menu no topo pra navegar entre
Home, Sobre e Contato, e um rodapé decente lá embaixo. Isso é o que faz parecer um site de
verdade, não uma página solta.

## CONTEXTO
- **O que já existe (do prelude, em `main`):** `components/ui/Button.tsx`,
  `Container.tsx` — use `Container` para o max-width do header/footer.
  `app/layout.tsx` existe e hoje só renderiza `{children}` — você vai EDITAR esse arquivo
  para inserir `<Header>` antes e `<Footer>` depois de `{children}`. É o ÚNICO arquivo de
  prelude que esta track toca.
- **Rotas do site (decididas pelo GESTOR, para o nav linkar):** `/` (home), `/sobre`,
  `/contato`. Essas rotas existem em `main` no momento em que ESTA track for mergeada
  porque a sequência de merge coloca esta track por ÚLTIMO — ver "DEPENDS ON" abaixo. Você
  pode desenvolver em paralelo sem esperar, só a ORDEM DE MERGE é a última.
- **Nome/marca ainda provisório** ("Orca" — `PENDENTE-DONO` confirmação de nome final,
  registrado no prelude). Use "Orca" no logo/texto do header, sem inventar tagline ao lado.
- **Convenção de placeholder:** se precisar de algum texto que dependa do dono (ex.: link
  de redes sociais no footer, endereço, CNPJ), use `components/ui/PlaceholderNote.tsx` ou
  texto `PENDENTE-DONO: <o que falta>` — nunca `TODO`/`FIXME`.
- **Armadilhas:** `app/page.tsx` e as rotas `/sobre`, `/contato` são de outras tracks — não
  as edite, não as crie você mesmo (mesmo que ainda não existam no momento em que você
  começar a trabalhar — elas chegam via merge antes do seu). `main` protegida — só commit
  e push.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Menu mobile (se usar toggle de
  estado) precisa de `"use client"` no topo do `Header.tsx`.

## A TASK
1. `components/layout/Header.tsx` (client component): logo/nome "Orca" à esquerda, nav com
   links para `/`, `/sobre`, `/contato` (use `next/link`), toggle de menu mobile
   (`useState`) em telas estreitas.
2. `components/layout/Footer.tsx`: copyright com ano atual, e um `PlaceholderNote` curto
   para links de redes sociais/contato adicional (`PENDENTE-DONO`).
3. `app/layout.tsx`: edite para envolver `{children}` com `<Header />` acima e
   `<Footer />` abaixo, dentro do `<body>`.
4. `components/layout/Header.test.tsx` + `components/layout/Footer.test.tsx`: smoke tests
   confirmando que os 3 links do nav existem e que o footer renderiza.

## SCOPE
- components/layout/Header.tsx
- components/layout/Footer.tsx
- components/layout/Header.test.tsx
- components/layout/Footer.test.tsx
- app/layout.tsx

## DEPENDS ON
`prelude-scaffold` já mergeado em `main` (precisa de `components/ui/*` e do
`app/layout.tsx` bare). Você pode implementar em paralelo com `track-home-page` e
`track-paginas-secundarias` (arquivos disjuntos) — mas o **GESTOR mergeia esta track por
ÚLTIMA das três**, depois de home e das páginas secundárias, para o nav nunca linkar para
uma rota que ainda não existe em `main`. Isso é decisão de ORDEM DE MERGE, não bloqueia seu
trabalho de implementação.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm lint` = 0 erros
- `pnpm test` verde (Header.test.tsx + Footer.test.tsx inclusos, resto da suíte também
  verde)
- `pnpm build` conclui sem erro
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/main...HEAD --name-only` = exatamente os 5 arquivos do SCOPE acima

## COMMIT + PUSH
`feat(chrome): header com nav e footer, wired no layout` →
`git push -u origin track-site-chrome`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
