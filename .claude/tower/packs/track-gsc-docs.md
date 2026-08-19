# Medição SEO (card 012) — Track B: docs — keyword-map com a régua do GSC, "medir antes de escrever", Fatos do repo (track-gsc-docs)

Você é o EXECUTOR, numa worktree isolada criada pelo harness
(`~/orca/workspaces/site-doxa/track-gsc-docs`, branch **`track-gsc-docs`**, nascida de
`origin/main` JÁ com o prelude `prelude-gsc-acesso` mergeado).

## SEGURANÇA — leia antes de qualquer comando (não negociável)
- **A chave da service account é SEGREDO** e mora em
  `~/.config/doxa/gsc-service-account.json`. Você **NÃO LÊ o conteúdo** (nem `cat`, nem
  `Read`, nem `jq`). Esta track só DOCUMENTA o caminho, as env vars e os comandos —
  **nunca** um valor. Não copie, não mova, não cite campo da chave.
- Nada de `access_token`/`Bearer …`/`ya29.` em doc, report ou commit. Você só roda
  `pnpm gsc:prova` (leitura) para conferir o tipo da propriedade — a saída dele não tem
  token e pode ser colada.
- O que NÃO é segredo e PODE estar no `CLAUDE.md`: o e-mail
  `torre-seo@doxa-506016.iam.gserviceaccount.com`, o caminho da chave, `GSC_KEY_PATH`,
  `GSC_SITE_URL`, os scripts `pnpm gsc:*`, a quota, o atraso do GSC.
- Esta track não toca código nem `package.json`. Nenhuma dependência.

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = a worktree, NÃO `~/orca/projects/site-doxa` ·
`git branch --show-current` = `track-gsc-docs` · `git status --porcelain` vazio ·
`git fetch origin && git rebase origin/main` · `test -f scripts/gsc/prova.mjs` (o
prelude está na base; se não, PARE e reporte) · `pnpm install --frozen-lockfile` ·
`pnpm gsc:prova` roda: anote o **tipo da propriedade** (Domínio `sc-domain:…` ou
Prefixo `https://www.doxaviral.com/`) e o estado do sitemap — é o que você vai
escrever no `CLAUDE.md`.

Leia antes: `docs/seo/keyword-map.md` (inteiro), `docs/seo/COMO-ADICIONAR-UMA-PAGINA.md`,
`CLAUDE.md` (inteiro — você vai acrescentar UM bullet em "Fatos do repo" no tom dos
vizinhos), `scripts/gsc/auth.mjs` e `scripts/gsc/prova.mjs` (cabeçalhos: env vars,
escopos), `.claude/tower/packs/track-gsc-baseline.md` (a track A, em paralelo — os
títulos das 8 seções do relatório e a regra do gatilho estão lá; você documenta
EXATAMENTE com as mesmas palavras), `.claude/tower/cards/012-seo-medicao-gsc.md`.

## A VISÃO DO DONO
Quem abrir o `keyword-map.md` daqui a um mês tem de saber: o Search Console está ligado,
o baseline se gera com `pnpm gsc:baseline`, o último relatório mora em
`docs/seo/baseline-<data>.md`, e a rodada 4 de SEO dispara por UMA regra escrita
(posição 8–20 com impressão real), não por palpite. E quem for escrever a próxima página
mede antes de escrever. E quem abrir o repo pela primeira vez sabe onde a chave mora
(caminho), que não se lê, e que o GSC atrasa ~2 dias.

## CONTEXTO (não perca tempo redescobrindo)
- `docs/seo/keyword-map.md` hoje: blockquote de abertura (linhas 3–12) diz
  `BLOCKED_EXTERNAL_CREDENTIAL` — ficou falso com o card 012; o parágrafo "Sem GSC/GA
  (…)" em "Estado ao fim da noite" (linhas 186–188) idem. A tabela principal, o backlog,
  a canibalização e as rodadas 2–3 **não mudam** (regra do card: NÃO reescrever a
  tabela). A coluna "Search Opportunity" (SO) é qualitativa e é a que o GSC recalibra —
  mas SÓ com ≥ 28 dias de dado; hoje é dia zero.
- Track A (paralela, `track-gsc-baseline`) entrega `pnpm gsc:baseline` e o arquivo
  `docs/seo/baseline-2026-08-19.md` (ou a data UTC em que rodar). O relatório tem 8
  seções com estes títulos: `1. Propriedade e janela` · `2. Sitemap (API × ar × índice
  local)` · `3. Cobertura por URL (URL Inspection)` · `4. Queries com impressões
  (últimos N dias)` · `5. Desempenho por página` · `6. Posição média por tipo e por
  hub` · `7. Gatilho da rodada 4` · `8. Leitura honesta do dia zero`. Flags:
  `--dias N` (28) · `--sem-inspecao` · `--min-impressoes N` (30) · `--saida <dir>`.
  **Você não cola números** do baseline no keyword-map: o arquivo de baseline é a fonte
  (gerado; rodar de novo atualiza), e número copiado à mão envelhece. O keyword-map
  aponta para ele.
- Regra do gatilho (GESTOR; mesmas palavras na track A): **página com posição média
  entre 8 e 20 (inclusive) E impressões ≥ 30 nos últimos 28 dias**, com ≥ 28 dias de
  coleta. O que a rodada 4 faz com uma página no gatilho, nesta ordem: (1) reescrever
  title/description/H1 para a query que mais imprime (CTR), (2) reforçar links internos
  de hub e irmãs para ela, (3) ampliar o corpo só se a query pedir algo que a página
  não responde; **página nova só se a query não tiver dona** (seção 4 do baseline com
  `page` = `/` ou sem página do cluster). Isso é o que você escreve.
- Recalibração de SO (provisória, GESTOR — até 28 dias de dado): SO ← impressões da
  página-dona (ou do cluster, para backlog) em 28 dias: `≥ 500 → 5` · `100–499 → 4` ·
  `20–99 → 3` · `1–19 → 2` · `0 → 1`. Documente como "provisório — o dono recalibra
  quando houver dado"; NÃO aplique na tabela agora.
- `CLAUDE.md` → "Fatos do repo": bullet novo **depois** do de `Banco:` (linha ~77) e
  **antes** de `Armadilhas:`; ≤ 9 linhas, no tom dos vizinhos (fato não-inferível que
  previne erro caro). Conteúdo: Search Console ligado (card 012); propriedade `<tipo e
  siteUrl como o gsc:prova mostrou>`; service account `torre-seo@…` com permissão
  Total; **chave em `~/.config/doxa/gsc-service-account.json` (`chmod 600`), fora do
  repo, NUNCA se lê — só os scripts, em runtime**; env `GSC_KEY_PATH` (default esse
  caminho) e `GSC_SITE_URL` (opcional); `pnpm gsc:prova` (sites.list + sitemaps.list,
  `--submeter`) e `pnpm gsc:baseline` (→ `docs/seo/baseline-<data>.md`); URL Inspection
  tem quota de 2000/dia/propriedade e o baseline gasta ~69 — não rodar em loop; o GSC
  atrasa ~2 dias e `contents[].indexed` do sitemaps.list é deprecado (0 sempre); se a
  chave vazar, revogar em IAM → Contas de serviço → Chaves (org policy flexibilizada SÓ
  no projeto DOXA — não mexer no nível da organização).
- `docs/seo/COMO-ADICIONAR-UMA-PAGINA.md` → seção `## 0.` ganha UM bullet "Medir antes
  de escrever" (≤ 5 linhas): rodar `pnpm gsc:baseline`; se alguma página existente já
  imprime para a query, a resposta é reforçar a dona (título/links), não página nova;
  conferir a seção 7 (gatilho) e a 4 (queries sem dona) antes de propor slug.
- Armadilhas do repo que ESTA track pode pisar:
  - `CLAUDE.md` é lido por TODO agente em TODA sessão: frase a mais custa contexto em
    todas as sessões seguintes. Um bullet, denso, como os outros.
  - `.env.example` está sob deny-rule do harness (`**/.env*`) — não tente documentar
    lá; é no `CLAUDE.md` e no cabeçalho do `auth.mjs` (já feito pelo prelude).
  - `docs/seo/baseline-*.md` é da track A — **NÃO crie** um, nem placeholder. O link
    que você escreve no keyword-map (`docs/seo/baseline-2026-08-19.md`) só resolve
    depois que A mergear; a sessão principal mergeia A antes de você. Se a data da A
    for outra, a sessão principal ajusta 1 linha no merge (diga no report qual linha).
  - Domínio com **L** em todo lugar.

## A TASK
1. **`docs/seo/keyword-map.md`**:
   a. Blockquote de abertura (linhas 3–12): substituir o parágrafo
      `BLOCKED_EXTERNAL_CREDENTIAL` por 4–6 linhas: Search Console ligado em 2026-08-19
      (card 012); baseline em `docs/seo/baseline-<data>.md` via `pnpm gsc:baseline`; a
      coluna SO continua qualitativa **até haver ≥ 28 dias de dado** (site no ar desde
      2026-08-18, GSC atrasa ~2 dias); "ranking não é prometido" fica. Os dois
      parágrafos seguintes do blockquote (Contrato de conteúdo, Contrato de URL) não
      mudam.
   b. Linhas 186–188 ("Sem GSC/GA…"): substituir por 2 linhas apontando para a seção
      nova.
   c. Seção nova **`## Dados reais (GSC)`** logo ANTES de "Estado ao fim da noite" (ou
      logo depois — escolha uma e diga), com subseções: **Como se mede** (o comando, o
      arquivo, as 8 seções pelo nome, as flags, quota/atraso em 1 linha, "o arquivo
      mais recente é o válido"); **Gatilho da rodada 4** (a regra com as mesmas palavras
      do CONTEXTO + o que fazer com uma página no gatilho, na ordem); **Recalibrar
      Search Opportunity** (a tabela provisória de SO ← impressões + "não aplicada
      ainda"); **Dia zero** (2 linhas: "baseline de 2026-08-19 em
      `docs/seo/baseline-2026-08-19.md`; a leitura está na seção 8 dele" — sem copiar
      números).
   Tabelas principal/backlog/canibalização/rodadas: **intocadas** (o VERIFY confere).
2. **`docs/seo/COMO-ADICIONAR-UMA-PAGINA.md`**: bullet "Medir antes de escrever" na
   seção 0 (≤ 5 linhas, forma dos vizinhos — frase + motivo no parêntese). Na seção 4
   ("Depois do merge"), 1 linha: "na rodada seguinte, `pnpm gsc:baseline` mostra se a
   página entrou no gatilho".
3. **`CLAUDE.md`**: o bullet de "Fatos do repo" descrito no CONTEXTO, com o tipo real da
   propriedade que o `pnpm gsc:prova` mostrou.

## SCOPE
- docs/seo/keyword-map.md
- docs/seo/COMO-ADICIONAR-UMA-PAGINA.md
- CLAUDE.md
(INTOCÁVEIS: `docs/seo/baseline-*.md` (track A), `scripts/**`, `package.json`,
`src/**`, `.gitignore`, `.claude/**`, `.env.example`. Precisou → PARE e reporte.)

## DEPENDS ON
`prelude-gsc-acesso` mergeado em `main` (para rodar `pnpm gsc:prova`). Paralela a
`track-gsc-baseline` (arquivos disjuntos). **Merge SÓ DEPOIS de `track-gsc-baseline`**
(o link para o baseline tem de resolver em `main`).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm gsc:prova` do STEP 0 colado (tipo da propriedade + sitemap)
- `pnpm typecheck` = 0 · `pnpm test` verde (mesma contagem da base — você não mexe em
  teste) · `pnpm build` ok, `[prerender] 68 rota(s)` (docs não mudam o build; é o
  seguro)
- `grep -c "BLOCKED_EXTERNAL_CREDENTIAL" docs/seo/keyword-map.md` = 0
- `grep -n "^## Dados reais (GSC)" docs/seo/keyword-map.md` → 1 linha ·
  `grep -c "gsc:baseline" docs/seo/keyword-map.md` ≥ 2 ·
  `grep -n "8 e 20\|8–20" docs/seo/keyword-map.md` → a regra do gatilho ·
  `grep -n "baseline-2026-08-19.md" docs/seo/keyword-map.md` ≥ 1
- Tabelas intocadas: `git diff origin/main...HEAD -- docs/seo/keyword-map.md | grep -E
  "^[-+]\| /" ` = vazio (nenhuma linha de tabela de URL adicionada/removida)
- `grep -n "Medir antes de escrever\|gsc:baseline" docs/seo/COMO-ADICIONAR-UMA-PAGINA.md` ≥ 2
- `git diff origin/main...HEAD -- CLAUDE.md | grep -c "^+"` ≤ 10 (um bullet, ≤ 9
  linhas + cabeçalho do diff) · `grep -n "gsc-service-account.json\|GSC_KEY_PATH\|gsc:prova\|gsc:baseline\|2000" CLAUDE.md`
  → todos presentes · `grep -n "doxavira\.com" CLAUDE.md docs/seo/keyword-map.md
  docs/seo/COMO-ADICIONAR-UMA-PAGINA.md | grep -v doxaviral` = vazio (só com L)
- `git diff --name-only origin/main...HEAD | grep -vE '^(docs/seo/keyword-map\.md|docs/seo/COMO-ADICIONAR-UMA-PAGINA\.md|CLAUDE\.md)$'` = vazio
- `git diff origin/main...HEAD | grep -nE "BEGIN (RSA )?PRIVATE KEY|private_key|ya29\.|Bearer [A-Za-z0-9]"` = vazio
- `git ls-files | grep -iE "service-account|doxa-506016"` = vazio

## COMMIT + PUSH
Commits: `docs(seo): keyword-map — GSC ligado, gatilho da rodada 4 e régua de SO` ·
`docs(seo): medir antes de escrever` · `docs(claude): Fatos do repo — Search Console,
chave e scripts gsc` → `git push -u origin track-gsc-docs`. **NÃO mergeie.** Report:
diff resumido por arquivo, saída COLADA do VERIFY, a linha exata do keyword-map que
cita o nome do arquivo de baseline (para a sessão principal ajustar se a data da A for
outra), verdict READY/NOT READY.
