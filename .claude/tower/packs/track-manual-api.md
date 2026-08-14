# Manual DOXA — Track B: API pública/admin + PDF (task_manual_api)

Você é o EXECUTOR, numa worktree isolada criada pelo harness a partir de
`feat/manual-do-cliente`.

## STEP 0 (obrigatório, antes de qualquer edit)
`git status --porcelain` vazio · você está numa worktree, NÃO em
`~/orca/projects/site-doxa` (confira com `git rev-parse --show-toplevel`).
Depois: `git checkout -B track/manual-api`. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
O cliente abre um link de convite no celular, percorre o manual, aceita — e sai
com um PDF. A equipe cria convites e baixa os comprovantes. Esta track é o
SERVIDOR disso tudo: as duas funções em `api/manual/` e a lógica que elas usam.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é lei**: `src/manual/tipos.ts` define TODO request/response
  (`PedidoPublico`, `PedidoAdmin`, respostas, `RespostaErro`). Você NÃO edita o
  contrato — lacuna real nele → PARE e reporte.
- **O padrão de função serverless é `api/lead.ts`**: edge runtime
  (`export const config = { runtime: 'edge' }`), env vars
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`,
  fetch cru no PostgREST, erro sempre `{ erro: string }` sem vazar detalhe.
  Leia-o inteiro antes de escrever a primeira linha.
- **O schema é `supabase/manual.sql`** (JÁ aplicado no banco). Leia inteiro.
  Pontos que mudam o seu código:
  - As funções SQL (`manual_concluir`, `manual_publicar_versao`,
    `manual_criar_rascunho`, `manual_hash_versao`) têm `revoke` de todo papel —
    **só a `service_role` chama** (RPC via PostgREST `/rest/v1/rpc/<fn>`).
  - `manual_concluir` já é transacional e idempotente (`ja_existia` na volta) e
    NÃO confia na lista do navegador. Não reimplemente a conferência.
  - Aceite é travado por TRIGGER: a única mutação permitida é
    `pdf_caminho`/`pdf_sha256` saindo de null → valor, UMA vez.
  - Convite: `status` deriva 'expirado' de `expira_em < now()` com status
    pendente/aberto — nunca grave um status 'expirado'.
  - Token do convite NUNCA existe no banco — só `token_hash` (SHA-256 hex).
- **Decisões já tomadas pelo GESTOR:**
  - Token: `crypto.getRandomValues`, ≥32 bytes, base64url no link; SHA-256 hex
    (`crypto.subtle.digest`) para buscar por `token_hash`. Token sempre no
    CORPO do POST (o contrato já força).
  - Auth admin: `Authorization: Bearer <token da sessão do time>` → validar em
    `GET <url>/auth/v1/user` com a anon key + o bearer; papel em
    `manual_perfis` decide: 'admin' publica versão; 'cx' e 'admin' criam,
    revogam e regeneram convite e baixam PDF.
  - Primeiro `abrir` de convite 'pendente': marcar 'aberto' + `aberto_em`
    (via service_role; o trigger permite) e registrar evento.
  - Eventos (`manual_eventos`): `convite_criado`, `convite_aberto`,
    `progresso_salvo`, `convite_revogado`, `convite_regenerado`, `pdf_gerado`,
    `pdf_baixado` — ator 'equipe' ou 'cliente' conforme quem agiu
    (`aceite_concluido` a função SQL já grava sozinha).
  - PDF: **pdf-lib** (já em `package.json` — NÃO adicione dependência; se
    precisar de outra, PARE e reporte). A4, capa DOXA (texto, sem imagem),
    todas as seções/regras com porquê e exemplo A PARTIR DE
    `manual_aceite_itens` + snapshot do aceite (NUNCA das tabelas vivas),
    declaração exata, numeração de página, rodapé com hash de verificação.
    SHA-256 do arquivo → upload no bucket `manual-pdfs` (Storage API,
    service_role) → update do aceite com `pdf_caminho`/`pdf_sha256` → URL
    assinada de minutos (`/storage/v1/object/sign/...`).
  - Ordem do concluir: RPC `manual_concluir` → PDF → upload → update do par →
    URL assinada. PDF falhou DEPOIS do aceite? Responda `pdf_url: null`
    (o contrato prevê; a ação `baixar` regenera sob demanda).
  - `baixar` (público) e `pdf_baixar` (admin): se o aceite ainda não tem PDF,
    gere na hora, preencha o par, devolva a URL.
- Armadilhas do repo (CLAUDE.md):
  - **pnpm, não npm.** `pnpm typecheck` · `pnpm test` · `pnpm build`.
  - Env vars de produção são Sensitive — `vercel env pull` devolve
    `"[SENSITIVE]"`. Você NÃO precisa de segredo nenhum: testes mockam fetch.
  - pdf-lib com StandardFonts só cobre WinAnsi: acentos PT passam, mas em-dash,
    aspas curvas e afins podem quebrar glifo. Sanitize o texto para o PDF e
    TESTE acentuação num teste que abre o PDF gerado.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga. Comentários
  em PT, na voz do repo. Sem `any`, sem `@ts-ignore`.

## A TASK
1. `src/manual/servidor/` — módulos pequenos: token (gera/hasheia), banco
   (fetch PostgREST + RPC com service_role), auth (bearer → perfil/papel),
   versao (monta `Versao` com seções e regras na ordem), pdf (pdf-lib),
   storage (upload + URL assinada), eventos. Um arquivo por assunto, ≤800 linhas.
2. `api/manual/publico.ts` — POST, roteia `PedidoPublico` por `acao`:
   `abrir` / `progresso` / `concluir` / `baixar`. Estados do convite conforme
   `EstadoDoConvite`; IP (`x-forwarded-for` primeiro valor) e user-agent só no
   `concluir`.
3. `api/manual/admin.ts` — POST, roteia `PedidoAdmin` por `acao`:
   `convite_criar` (gera token, devolve link completo
   `https://www.doxaviral.com/manual-doxa/convite/<token>` — única vez),
   `convite_revogar`, `convite_regenerar` (revoga + cria apontando
   `regenerado_de`), `pdf_baixar`, `versao_rascunho`, `versao_publicar`.
4. Testes em `src/manual/servidor/*.test.ts` (vitest): token (formato, hash,
   unicidade), montagem de estados do convite (expirado derivado), validação
   dos pedidos, autorização por papel, PDF (gera, tem páginas, contém nome/
   empresa/versão/declaração/acentos, hash confere). Fetch sempre mockado —
   teste não fala com rede.

## SCOPE
- api/manual/publico.ts
- api/manual/admin.ts
- src/manual/servidor/token.ts
- src/manual/servidor/banco.ts
- src/manual/servidor/auth.ts
- src/manual/servidor/versao.ts
- src/manual/servidor/pdf.ts
- src/manual/servidor/storage.ts
- src/manual/servidor/eventos.ts
- src/manual/servidor/token.test.ts
- src/manual/servidor/publico.test.ts
- src/manual/servidor/admin.test.ts
- src/manual/servidor/pdf.test.ts

(Arquivos NOVOS dentro de `src/manual/servidor/` e `api/manual/` podem divergir
desta lista em nome/quantidade — a FRONTEIRA é que não se cria nem se toca nada
fora desses dois diretórios. `tipos.ts`, `config.ts`, `Rota.tsx`, `App.tsx`,
`package.json`, `vercel.json`, `tsconfig*`, `vitest*` são INTOCÁVEIS.)

## DEPENDS ON
Nada — prelude (contrato + tsconfig.api com `src/manual/servidor`) já está na base.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (os testes NOVOS desta track inclusos)
- `pnpm build` ok
- `git diff feat/manual-do-cliente...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-do-cliente...HEAD --name-only` — só arquivos do SCOPE
- `git diff feat/manual-do-cliente...HEAD | grep -niE "service_role.*=.*ey|eyJ[A-Za-z0-9_-]{20}"` = vazio (nenhum segredo)

## COMMIT + PUSH
`feat(manual): a api — convite, conclusao idempotente e o pdf que prova` (ajuste
o resumo ao que fez) → `git push -u origin track/manual-api`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
nome da branch + caminho da worktree. Merge/deploy/LIVE são do GESTOR.
