# Card 016 — Track 3: coerência RUNBOOK/TOWER-ROLES/commands/CLAUDE.md (task_torre-coerencia)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/chore-torre-coerencia`,
branch **`chore-torre-coerencia`** (JÁ criada pelo `tower-track.sh` a partir de
`origin/main` — **DEPOIS** do merge das tracks 1 e 2; confirme no STEP 0).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `chore-torre-coerencia` · `git status --porcelain` vazio ·
`git log --oneline -5` mostra os merges das tracks 1 e 2 do card 016 (higiene e
agentes). Se NÃO mostrar, a base está errada → **PARE e reporte.**

## A VISÃO DO DONO
Depois de limpar a torre e reescrever os agentes, nenhum documento pode contradizer
outro: uma rodada de `/intake` de teste tem de percorrer o fluxo novo sem tropeçar em
texto velho ("stack a definir", "próximo número livre", caminho que não existe mais).

## CONTEXTO (não perca tempo redescobrindo)
- Staleness JÁ LOCALIZADA pelo GESTOR (conserte estas e o que mais achar do MESMO tipo):
  - `.claude/tower/RUNBOOK.md` → seção "Ainda pendente neste repo" está podre:
    "Stack a definir" (a stack está em produção — `CLAUDE.md` → Fatos do repo),
    "Package manager confirmar" (é pnpm, fixado), "Nome do produto — ver card
    001" (001 foi substituído). Reescrever a seção com o que AINDA é pendente de
    verdade (ex.: o item do SSH/HTTPS segue válido) ou removê-la.
  - `.claude/TRACK-TEMPLATE.md` → comentário final "Package manager/test runner ainda
    'a definir' no CLAUDE.md" — mentira desde que a stack entrou no CLAUDE.md.
  - `.claude/commands/plano.md` → "(confira o package.json; o CLAUDE.md ainda está
    com 'a definir')" — idem.
  - `.claude/TOWER-ROLES.md` → conferir contra os prompts NOVOS de
    `.claude/agents/*.md` (mergeados pela track 2): descrições de papel, limites e
    fluxo têm de bater com o texto que valeu no gate do dono. A tabela de alocação
    de modelo (Fable/Opus/haiku) NÃO muda.
  - `CLAUDE.md` (raiz) → a tabela do harness continua apontando caminhos verdadeiros;
    se citar packs, refletir que entregues vivem em `packs/_entregues/` (1 linha, não
    reescreva a tabela).
- A track 1 criou as seções "Numeração de card" e "Higiene na entrega" no RUNBOOK e
  atualizou `.claude/commands/intake.md` — NÃO as reescreva; só garanta que nada as
  contradiz.
- Mudança de conteúdo aqui é AJUSTE de coerência, não redesenho: papéis, pipeline e
  regras duras ficam como estão.
- `git stash` PROIBIDO na worktree. Commit por fatia (um por arquivo ou por assunto).
- Nada desta track entra no build do site (vitest exclui `.claude/**`; o build não lê
  `.claude/`; `CLAUDE.md` raiz é doc).

## A TASK
1. RUNBOOK: refazer "Ainda pendente neste repo" (só pendências reais) e varrer o resto
   do arquivo por afirmações que os merges das tracks 1–2 tornaram falsas.
2. TRACK-TEMPLATE e commands (`plano.md`, `track.md`, `review.md`, `watch.md`,
   `handoff.md`): remover os "a definir" e qualquer instrução que contradiga RUNBOOK
   ou os agentes novos.
3. TOWER-ROLES: alinhar as descrições dos 5 papéis ao texto novo dos agentes
   (referência, não cópia — TOWER-ROLES é a doutrina, o agente é o prompt).
4. CLAUDE.md raiz: conferir a tabela do harness; ajustar só o que ficou falso.

## SCOPE
- .claude/tower/RUNBOOK.md
- .claude/TOWER-ROLES.md
- .claude/TRACK-TEMPLATE.md
- .claude/commands/**
- CLAUDE.md

## DEPENDS ON
Tracks 1 e 2 do card 016 mergeadas em `main` (esta track lê o estado final delas).

## VERIFY (pass/fail executável — cole a saída no report)
- `grep -rn 'a definir' .claude/tower/RUNBOOK.md .claude/TRACK-TEMPLATE.md .claude/commands/` = vazio
- `grep -n 'Stack a definir' .claude/tower/RUNBOOK.md` = vazio · `grep -n 'ver card .001' .claude/tower/RUNBOOK.md` = vazio
- `for p in $(grep -oE '\.claude/[A-Za-z0-9_./-]+' CLAUDE.md | sed 's/[.,;]$//' | sort -u); do [ -e "$p" ] || echo "FALTA $p"; done` = vazio (toda referência da tabela existe)
- `grep -c 'Numeração de card' .claude/tower/RUNBOOK.md` ≥ 1 e `grep -c 'Higiene na entrega' .claude/tower/RUNBOOK.md` ≥ 1 (as seções da track 1 sobreviveram)
- Alocação intacta: `for f in intake gestor watchdog collector executor; do grep -H '^model:' .claude/agents/$f.md; done` = fable · fable · haiku · fable · opus (agentes NÃO estão no seu escopo — isto só prova que você não os tocou)
- `git diff --name-only origin/main...HEAD | grep -vE '^\.claude/|^CLAUDE\.md$'` = vazio
- `pnpm typecheck && pnpm test` verdes

## COMMIT + PUSH
`chore(torre #016): coerência — <fatia>` →
`git push -u origin chore-torre-coerencia`. **NÃO mergeie.**
Ao terminar: lista do que estava contradizendo o quê (arquivo:linha → correção) +
verdict READY/NOT READY + saída colada do VERIFY.
