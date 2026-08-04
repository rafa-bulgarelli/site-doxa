# Site Orca — Track C: Páginas Sobre e Contato (task_track-paginas-secundarias)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-paginas-secundarias`,
branch **`track-paginas-secundarias`** (JÁ criada pelo `tower-track.sh` a partir da base,
que já inclui o prelude mergeado em `main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-paginas-secundarias` · `git status --porcelain`
vazio · você está na worktree, não no repo principal. Confirme que `components/ui/*` já
existem (vêm do prelude mergeado) — se não existirem, **PARE e reporte**.

## A VISÃO DO DONO
Quero uma página "Sobre" e uma página de "Contato" existindo e abrindo de verdade — com um
formulário de contato que eu consiga preencher pra testar, mesmo que ele ainda não envie
pra lugar nenhum de verdade (isso depende de decidir e-mail/CMS depois). Não quero um
formulário que finge que enviou — quero que ele seja honesto sobre não estar conectado
ainda.

## CONTEXTO
- **O que já existe (do prelude, em `main`):** `components/ui/Button.tsx`,
  `Container.tsx`, `Section.tsx`, `PlaceholderNote.tsx` — USE, não recrie.
  `app/layout.tsx` e `app/page.tsx` são de outra track — **não toque**.
- **Rotas que você cria:** `/sobre` e `/contato` (slugs em português — já decididos pelo
  GESTOR, não precisa confirmar com o dono).
- **Sem backend, sem CMS, sem serviço de e-mail decidido ainda.** O formulário de contato
  NÃO deve fingir que envia. Ao submeter, mostre uma mensagem honesta tipo "Formulário
  ainda não conectado a um destino — pendente de decisão do dono sobre e-mail/CMS." Não
  crie uma API route que finge sucesso. Não invente integração com serviço externo.
- **Conteúdo da página Sobre é bloqueado** (não existe descrição da empresa) — use
  `PlaceholderNote` para o texto institucional, mesmo padrão das outras tracks. NÃO invente
  história/missão/valores da Orca.
- **Convenção de placeholder:** `components/ui/PlaceholderNote.tsx`, nunca `TODO`/`FIXME`
  no texto visível.
- **Armadilhas:** `main` protegida, PR obrigatório — você só commita e dá push.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`.

## A TASK
1. `app/sobre/page.tsx`: página com `<Container>`/`<Section>`, um título "Sobre" e um
   `PlaceholderNote` no lugar do texto institucional real.
2. `components/contact/ContactForm.tsx` (client component): campos nome, e-mail, mensagem;
   `onSubmit` faz `preventDefault` e mostra a mensagem honesta de "não conectado ainda"
   (ver contexto acima) em vez de simular sucesso. Validação básica de campo obrigatório
   client-side é ok (não é "fingir enviar", é UX de formulário).
3. `app/contato/page.tsx`: usa `<ContactForm>` dentro de `<Container>`/`<Section>`.
4. `components/contact/ContactForm.test.tsx`: testa que os campos existem, que submeter
   sem preencher não "envia" nada, e que a mensagem honesta de "não conectado" aparece ao
   submeter com campos preenchidos.

## SCOPE
- app/sobre/page.tsx
- app/contato/page.tsx
- components/contact/ContactForm.tsx
- components/contact/ContactForm.test.tsx

## DEPENDS ON
`prelude-scaffold` já mergeado em `main` (precisa de `components/ui/*`). Nenhuma outra
track em paralelo — `track-site-chrome` e `track-home-page` não tocam nenhum arquivo desta
lista.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm lint` = 0 erros
- `pnpm test` verde (ContactForm.test.tsx incluso, resto da suíte também verde)
- `pnpm build` conclui sem erro (confirme que `/sobre` e `/contato` aparecem na saída do
  build como rotas geradas)
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/main...HEAD --name-only` = exatamente os 4 arquivos do SCOPE acima

## COMMIT + PUSH
`feat(paginas): páginas Sobre e Contato com formulário honesto (sem backend ainda)` →
`git push -u origin track-paginas-secundarias`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
