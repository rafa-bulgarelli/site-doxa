# Site Orca — Track B: Home page (task_track-home-page)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-home-page`,
branch **`track-home-page`** (JÁ criada pelo `tower-track.sh` a partir da base, que já
inclui o prelude mergeado em `main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-home-page` · `git status --porcelain` vazio · você
está na worktree, não no repo principal. Confirme que `components/ui/Button.tsx`,
`Container.tsx`, `Section.tsx` e `PlaceholderNote.tsx` já existem (vêm do prelude
mergeado) — se não existirem, o prelude não foi mergeado ainda: **PARE e reporte**, não
recrie esses arquivos.

## A VISÃO DO DONO
Quero abrir a home e ver ela contando alguma coisa — um destaque no topo (título grande +
uma chamada visual), alguns blocos explicando pontos-chave, e uma seção de call-to-action
no fim — mesmo que o TEXTO ainda seja um rascunho esperando eu escrever o de verdade. Quero
ver a estrutura visual pronta, não uma página em branco.

## CONTEXTO
- **O que já existe (do prelude, em `main`):** `components/ui/Button.tsx`,
  `Container.tsx`, `Section.tsx`, `PlaceholderNote.tsx` — USE esses primitivos, não crie
  os seus. `app/layout.tsx` já existe (bare, só `{children}` — NÃO toque nele, é escopo de
  outra track). `app/globals.css` já tem os tokens de cor/tipografia base — reaproveite as
  classes Tailwind já configuradas em `tailwind.config.ts`, não invente nova paleta.
- **`app/page.tsx` já existe** — é um placeholder mínimo do prelude (só um
  `<PlaceholderNote>`). Você vai **REESCREVER esse arquivo por completo**.
- **Conteúdo é bloqueado, estrutura não é.** Você NÃO sabe o que a Orca faz — não existe
  copy, posicionamento ou prova social neste repo. Não invente proposta de valor real.
  Toda frase de conteúdo real (manchete, descrição de feature, texto de CTA) é
  `PENDENTE-DONO: <o que falta>` dentro de um `<PlaceholderNote>` ou como texto visível
  claramente marcado — nunca fingir um texto de marketing final.
- **Convenção de placeholder:** use `components/ui/PlaceholderNote.tsx` (do prelude) para
  marcar cada bloco de conteúdo pendente. Não use `TODO`/`FIXME` no texto visível (watchdog
  trata como débito de código, não de conteúdo).
- **Armadilhas:** `app/layout.tsx` e `app/globals.css` são de outra track/já mergeados —
  não edite. `main` protegida — você só commita e dá push, não abre PR nem mergeia.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`.

## A TASK
1. `components/home/Hero.tsx`: título grande (placeholder honesto de manchete) + subtítulo
   + um `<Button>` de CTA (destino ainda indefinido — use `href="#"` com nota de que o
   destino é `PENDENTE-DONO`).
2. `components/home/Features.tsx`: grade de 3 blocos "o que a empresa oferece" — cada
   bloco com `PlaceholderNote` explicando que o conteúdo real depende do dono descrever o
   produto.
3. `components/home/CtaSection.tsx`: seção final de chamada para ação, mesmo padrão de
   placeholder honesto no texto e no destino do botão.
4. `app/page.tsx`: reescreva usando `<Container>`/`<Section>` do design system + os três
   componentes acima, nesta ordem: Hero → Features → CtaSection.
5. `components/home/HomeSections.test.tsx`: um teste por componente (ou um arquivo cobrindo
   os três) confirmando que cada seção renderiza e que o texto de placeholder está visível
   (prova que ninguém vai confundir com copy final).

## SCOPE
- app/page.tsx
- components/home/Hero.tsx
- components/home/Features.tsx
- components/home/CtaSection.tsx
- components/home/HomeSections.test.tsx

## DEPENDS ON
`prelude-scaffold` já mergeado em `main` (precisa de `components/ui/*` e
`tailwind.config.ts` existindo). Nenhuma outra track em paralelo — `track-site-chrome` e
`track-paginas-secundarias` não tocam nenhum arquivo desta lista.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm lint` = 0 erros
- `pnpm test` verde (HomeSections.test.tsx incluso, resto da suíte também verde)
- `pnpm build` conclui sem erro
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/main...HEAD --name-only` = exatamente os 5 arquivos do SCOPE acima
  (nenhum outro tocado)

## COMMIT + PUSH
`feat(home): estrutura da home (hero, features, cta) com conteúdo placeholder` →
`git push -u origin track-home-page`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
