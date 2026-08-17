# Conversor PDF↔Word — Track A: servidor de conversão (task_conversor_servidor)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track/conversor-servidor origin/feat/conversor` (o prelude JÁ está lá — confirme que
`src/conversor/tipos.ts` existe; não existe → **PARE e reporte**).

## A VISÃO DO DONO
O time sobe um contrato em PDF e recebe o MESMO documento em Word editável — 1:1 a olho
nu. Sobe um Word, recebe em PDF. Atrás do login do time. A chave do provedor nunca chega
ao navegador: quem conversa com a Adobe é este servidor.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é lei**: `src/conversor/tipos.ts` (códigos de erro, `RespostaErro`) e
  `src/conversor/config.ts` (`TAMANHO_MAXIMO_BYTES`, MIMEs, `CAMPO_ARQUIVO`). Você NÃO
  edita os dois — lacuna real → PARE e reporte.
- **Contrato da API (a track da página programa contra isto em paralelo):**
  `POST /api/conversor` · `Authorization: Bearer <token da sessão Supabase>` · corpo
  `multipart/form-data`, campo `arquivo`. Sucesso: 200 binário, `Content-Type` do formato
  de saída, `Content-Disposition: attachment; filename="<original>.<ext-nova>"`.
  Erro: JSON `RespostaErro` com status: 401 `sem_sessao`/`sessao_invalida` · 413
  `arquivo_grande` · 415 `tipo_nao_aceito` · 502 `conversao_falhou`/
  `provedor_indisponivel` · 504 `conversao_demorou`. Direção INFERIDA do arquivo:
  PDF entra → DOCX sai; DOCX entra → PDF sai.
- **Padrão do repo para endpoint** (siga à risca): a moldura em `api/` tem ~15 linhas —
  `export const config = { runtime: 'edge' };` + delega para `src/<módulo>/servidor/`
  (veja `api/manual/admin.ts`). A lógica fica em `src/conversor/servidor/` porque o
  vitest NÃO alcança `api/` (comentário em `api/manual/publico.ts` explica).
- **Auth — decisão do GESTOR**: sessão Supabase VÁLIDA = autorizado. Valide o token com
  `GET <url>/auth/v1/user` (espelhe `usuarioDaSessao` em
  `src/manual/servidor/auth.ts` — mas NÃO importe `autorizar` de lá: ele exige linha em
  `manual_perfis`, e a conta do time da Central não tem). Env do Supabase: espelhe
  `ambiente()`/`chavePublica()` de `src/manual/servidor/banco.ts` (pode importar de lá —
  leitura, sem editar).
- **Adobe PDF Services, REST puro, sem SDK** (SDK Node não roda em edge; cultura do repo
  é fetch puro). Mapa validado pela prova do prelude (`scripts/conversor-prova.mjs` —
  LEIA o script: ele é o fluxo que funcionou de verdade no gate de fidelidade):
  token → asset (`POST /assets` + `PUT uploadUri`) → `operation/exportpdf` (PDF→DOCX,
  `targetFormat: "docx"`) ou `operation/createpdf` (DOCX→PDF) → poll do `location` até
  `done` → download → `DELETE /assets/{assetID}` (entrada E saída — é contrato com dados
  pessoais, nada fica retido no provedor além do job).
- **Env vars**: `ADOBE_CLIENT_ID`, `ADOBE_CLIENT_SECRET` via `process.env` (edge da
  Vercel expõe). Ausentes → 502 `provedor_indisponivel` com mensagem no log, nunca crash.
  São **Sensitive** na Vercel — você nunca as verá; nos testes, mocke.
- **Teto de tempo**: edge precisa COMEÇAR a responder em <25 s. Poll a cada 2 s com teto
  de ~18 s do início do job; estourou → 504 `conversao_demorou`. Token pedido por
  conversão, sem cache (são ~10/dia).
- Armadilhas do repo (desta track):
  - `verbatimModuleSyntax` no projeto api: import de tipo é `import type`.
  - `noUnusedLocals`/`noUnusedParameters` — tsc reprova sobra.
  - `src/conversor/servidor/` compila nos DOIS projetos (`app` inclui `src` inteiro):
    nada de API só-DOM nem só-Node fora do que `src/manual/servidor` já usa.
  - Config não se afrouxa (tsconfig/eslint) para passar gate — conserta-se o código.
  - Testes: espelhe `src/manual/servidor/admin.test.ts` para mockar `fetch` e env.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga.

## A TASK
1. `src/conversor/servidor/auth.ts` — `sessaoValida(pedido: Request)`: token do
   `Authorization`, valida em `/auth/v1/user`; falta/inválido → erro que o handler
   traduz em 401.
2. `src/conversor/servidor/adobe.ts` — cliente REST: `converter(bytes, direcao)`
   devolve os bytes convertidos; encapsula token/asset/job/poll/download/delete.
   Nomes em português no padrão do repo.
3. `src/conversor/servidor/converter.ts` — `responderConversor(pedido)`: método POST,
   auth, `formData()`, valida MIME+extensão e `TAMANHO_MAXIMO_BYTES` (413/415 ANTES de
   tocar a Adobe), infere direção, chama `adobe.converter`, responde binário com os
   headers do contrato. Todo caminho de erro devolve `RespostaErro` do contrato.
4. `api/conversor.ts` — moldura edge de ~15 linhas delegando para `responderConversor`,
   idêntica em forma a `api/manual/admin.ts`.
5. `src/conversor/servidor/converter.test.ts` — com fetch mockado: sem `Authorization`
   → 401 `sem_sessao` · token inválido → 401 `sessao_invalida` · `.png` → 415 · arquivo
   acima do teto → 413 · caminho feliz PDF→DOCX (mocka o ciclo Adobe, confere
   `Content-Type` e `Content-Disposition`) · confere que `DELETE /assets` foi chamado.

## SCOPE
- api/conversor.ts
- src/conversor/servidor/auth.ts
- src/conversor/servidor/adobe.ts
- src/conversor/servidor/converter.ts
- src/conversor/servidor/converter.test.ts

## DEPENDS ON
Prelude (`track/conversor-prelude`) mergeado em `feat/conversor` + gate de fidelidade
aprovado pelo dono.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test src/conversor/servidor` verde (os testes novos DESTA track inclusos)
- `pnpm test` sem falha NOVA vs baseline
- `pnpm build` ok
- `git diff --name-only origin/feat/conversor...HEAD` = exatamente os 5 arquivos do SCOPE
- `git diff origin/feat/conversor...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `grep -rln "ADOBE_CLIENT" src api | grep -v "src/conversor/servidor"` = vazio
  (a credencial não existe fora do servidor)

## COMMIT + PUSH
`feat(conversor): servidor de conversão — auth de sessão + Adobe PDF Services` →
`git push -u origin track/conversor-servidor`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
