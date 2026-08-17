# Conversor PDF↔Word — Track B: página do conversor (task_conversor_pagina)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track/conversor-pagina origin/feat/conversor` (o prelude JÁ está lá — confirme que
`src/conversor/tipos.ts` existe; não existe → **PARE e reporte**).

## A VISÃO DO DONO
Ele abre `/conversor`, encontra o mesmo portão de senha da Central, entra, e vê uma área
clara de upload que aceita PDF e Word. Sobe o arquivo, a página MOSTRA que está
trabalhando (não parece travada), e o documento convertido desce. Arquivo de tipo errado
→ mensagem de erro visível, sem quebrar a página.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é lei**: `src/conversor/tipos.ts` (códigos de erro) e
  `src/conversor/config.ts` (teto de bytes, MIMEs, `CAMPO_ARQUIVO`, `ROTA_BASE`). Você
  NÃO edita os dois — lacuna real → PARE e reporte.
- **Contrato da API (a track do servidor implementa em paralelo — você mocka fetch):**
  `POST /api/conversor` · `Authorization: Bearer <token>` · `multipart/form-data`,
  campo `arquivo`. Sucesso: 200 binário (`Content-Disposition` traz o nome). Erro: JSON
  `RespostaErro` — 401 volta ao portão, 413 `arquivo_grande`, 415 `tipo_nao_aceito`,
  502/504 falha do provedor/tempo. Caminho RELATIVO (`/api/conversor`), mesma origem,
  sem CORS — como `src/leads/dados/supabase.ts` faz com `/api/lead`.
- **Login REUSADO da Central, sem editar nada em `src/leads/`:** importe `entrar`,
  `sessaoAtiva`, `sair` de `src/leads/deposito.ts` e `tokenGuardado` de
  `src/leads/dados/supabase.ts` (é o token que vai no `Authorization`). O portão da
  Central (`src/leads/central/Portao.tsx`) é o MODELO visual — copie o desenho num
  portão próprio do módulo (títulos desta página), não o importe: os textos são da
  Central e o arquivo é de outro módulo.
- **Roteamento**: `src/conversor/Rota.tsx` existe como STUB do prelude — você o
  reescreve. Padrão: export default; decide portão vs página por `sessaoAtiva()`;
  `App.tsx` (INTOCÁVEL) já monta o módulo em `/conversor`.
- **Estados da página** (decisão do GESTOR): `parado` (dropzone + clique, deixa claro
  que aceita `.pdf` e `.docx`) → `convertendo` (indicador vivo + nome do arquivo; o
  upload e a conversão são UMA espera) → `pronto` (dispara o download do blob e oferece
  "baixar de novo" + "converter outro") → `erro` (mensagem em português por código do
  contrato, com altura reservada — o portão da Central mostra por quê). Validação de
  tipo e tamanho ANTES do fetch: erro instantâneo, sem gastar rede.
- **Download**: blob da resposta → `URL.createObjectURL` → `<a download>` programático
  → `URL.revokeObjectURL`. Nome do arquivo: o original com a extensão trocada.
- Armadilhas do repo (desta track):
  - `focus()` na montagem SEM `{ preventScroll: true }` faz o site rolar sozinho —
    o portão da Central mostra o jeito certo.
  - Opacidade do Tailwind de 5 em 5: `bg-x/78` não gera classe. Fora da escala, só
    `bg-x/[0.78]`.
  - NÃO toque em `tailwind.config.js` — use os tokens que já existem (`bg-doxa-bg`
    etc.). Token novo exigiria reiniciar o dev server e não é necessário aqui.
  - `noUnusedLocals`/`noUnusedParameters` ligados.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga. Visual na linha da
  Central: fundo `bg-doxa-bg`, serifada no título, componentes contidos — é ferramenta
  do time, não landing.

## A TASK
1. `src/conversor/enviar.ts` — a fachada do fetch: valida extensão+MIME+tamanho contra
   `config.ts` (erro local com os MESMOS códigos do contrato), monta o `FormData`,
   manda com `tokenGuardado()` no header, devolve `{ blob, nomeSugerido }` ou o
   `CodigoDeErro`. Sem sessão → código `sem_sessao` (a página volta ao portão).
2. `src/conversor/Portao.tsx` — portão do módulo no desenho do da Central, texto desta
   página ("Conversor de contratos" ou similar sóbrio), usando `entrar` do depósito.
3. `src/conversor/Pagina.tsx` — a máquina de estados acima: dropzone (drag +
   `<input type="file" accept=".pdf,.docx">`), indicador de trabalho, download, erros
   em português, botão "sair" discreto (usa `sair`).
4. `src/conversor/Rota.tsx` — reescreva o stub: `sessaoAtiva()` decide Portao vs
   Pagina; 401 vindo de `enviar` derruba a sessão de volta ao portão.
5. `src/conversor/enviar.test.ts` — com fetch mockado: `.png` reprova ANTES do fetch
   (415 local) · arquivo acima do teto reprova antes do fetch · caminho feliz monta
   `FormData` com o campo certo e o `Authorization` presente · resposta 401 vira
   `sem_sessao` · resposta binária devolve blob + nome com extensão trocada.

## SCOPE
- src/conversor/Rota.tsx
- src/conversor/Portao.tsx
- src/conversor/Pagina.tsx
- src/conversor/enviar.ts
- src/conversor/enviar.test.ts

## DEPENDS ON
Prelude (`track/conversor-prelude`) mergeado em `feat/conversor`.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test src/conversor` verde (os testes novos DESTA track inclusos)
- `pnpm test` sem falha NOVA vs baseline
- `pnpm build` ok
- `git diff --name-only origin/feat/conversor...HEAD` = exatamente os 5 arquivos do SCOPE
- `git diff origin/feat/conversor...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `grep -n "focus(" src/conversor/*.tsx | grep -v preventScroll` = vazio
  (todo focus na montagem leva `{ preventScroll: true }`)

## COMMIT + PUSH
`feat(conversor): página do conversor — portão do time, upload e download` →
`git push -u origin track/conversor-pagina`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
