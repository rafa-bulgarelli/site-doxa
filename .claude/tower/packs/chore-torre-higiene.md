# Card 016 — Track 1: higiene da torre + regra de numeração (task_torre-higiene)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/chore-torre-higiene`,
branch **`chore-torre-higiene`** (JÁ criada pelo `tower-track.sh` a partir de `origin/main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `chore-torre-higiene` · `git status --porcelain` vazio ·
você está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO
Abrir `.claude/tower/` e ver só o que está VIVO: cards com status verdadeiro, packs
apenas dos trabalhos em curso, material entregue arquivado. E nunca mais nascer um
card com número duplicado — já aconteceu DUAS vezes (dois 013; e o próprio card 016
nasceu "015" colidindo com o 015-og).

## CONTEXTO (não perca tempo redescobrindo)
- Esta track mexe SÓ no harness (`.claude/`). Nada dela entra no build do site
  (vitest exclui `.claude/**` em `vite.config.ts`; o build não lê `.claude/`).
- **Decisão do GESTOR: ARQUIVAR, não deletar.** Packs de card entregue vão para
  `.claude/tower/packs/_entregues/<NNN>-<slug>/` via `git mv`. Precedente:
  `packs/_obsoleto-card-001/` (NÃO tocar nele — card 001 foi substituído, não entregue).
- **Cards NÃO se movem.** Memórias e docs apontam para `cards/<nome>.md`
  (ex.: memória `doutrina-animacao` → `cards/010-...`; `card-011-seo-estado` →
  `cards/011-...`). A higiene dos cards é corrigir o STATUS, não mudar de lugar.
- Cards entregues com status mentindo: 002 ("pronto para o GESTOR"), 003 e 005–010
  ("aberto"/"planejado"). O manual completo está em produção — os PRs estão no
  `git log --oneline` de main (squash carrega `(#N)` no título: #43–#47 e anteriores)
  e em `gh pr list --state merged --limit 100 --json number,title,mergedAt`.
- **Card 004 não tem linha de Status** — é o prompt-mestre cru. Adicione um cabeçalho
  mínimo no TOPO (3 linhas: título-comentário ou bloco `- **Status:** ENTREGUE …`)
  sem alterar o corpo.
- **Regra do status:** buscar a LINHA ATUAL do arquivo antes de editar (o fix #84
  existiu porque um replace foi feito contra uma linha imaginada e o status ficou
  mentindo). Nunca inventar número de PR: se não achar o PR exato de um card,
  cite o SHA do commit de merge.
- Ficam em `packs/` (NÃO mover): `.gitkeep` · `_backlog-motor-011.md` (backlog REAL
  do motor SEO) · `track-seo-rodada-TEMPLATE.md` (molde vivo) · `_obsoleto-card-001/`.
- Armadilha: `git stash` é PROIBIDO nesta worktree (já engoliu commit de executor).
  Commit por fatia, na hora.
- **Estilo**: arquivos são Markdown/shell-doc; siga o tom dos docs existentes (PT-BR,
  direto, o porquê junto da regra).

## A TASK
1. **Commit 1 — status dos cards (EDITAR, sem mover).** Corrigir a linha de Status de
   `cards/002…010` para `**Status:** ENTREGUE — PR #<n> (<data>)` (ou SHA, se PR
   ambíguo), com os números REAIS levantados no git/gh. 004 ganha cabeçalho novo no
   topo. NÃO tocar em 001 (já diz SUBSTITUÍDO), nem em 011–016.
2. **Commit 2 — arquivar packs (MOVER, sem editar).** `git mv` dos 53 packs consumidos
   para `packs/_entregues/<NNN>-<slug>/`, mapa FECHADO (decisão do GESTOR — não
   re-derive):
   - `002-design-system/`: prelude-scaffold-doxa, track-design-tokens, track-home-hero, track-logo-vetor
   - `003-sem-com/`: feat-sem-com
   - `004-manual/`: track-manual-admin, track-manual-api, track-manual-cenas, track-manual-cenas-vida, track-manual-fluxo-vida, track-manual-fluxo2, track-manual-previa, track-manual-publico
   - `005-conversor/`: prelude-conversor, track-conversor-pagina, track-conversor-servidor
   - `006-manual-imagens/`: track-manual-fotos-guia, track-manual-prints
   - `007-manual-feedback/`: track-manual-cenas-reveal, track-manual-etapas-fluxo
   - `008-manual-correcao/`: track-manual-correcao-cenas, track-manual-correcao-fluxo
   - `009-manual-animacoes/`: track-manual-passos-cenas-completa, track-manual-passos-cenas-piloto, track-manual-passos-fluxo
   - `010-manual-polimento/`: track-polimento-prelude, track-polimento-capitulos, track-polimento-itens-ajuste, track-polimento-itens-refazer, track-polimento-passos
   - `011-seo-organico/`: prelude-seo-motor, track-seo-fundacao, track-seo-hubs-nav, track-seo-conteudo-guias, track-seo-conteudo-solucoes, track-seo-docs, track-seo-correcao-1, track-seo-correcao-2, track-seo-correcao-3, track-seo-motor-2, track-seo-rodada-2-comparativos-glossario, track-seo-rodada-2-dores-solucoes, track-seo-rodada-2-guias, track-seo-rodada-3
   - `012-gsc/`: prelude-gsc-acesso, track-gsc-baseline, track-gsc-docs
   - `013-seo-limpeza/`: track-404-real, track-docs-pendentes, track-landing-porta-faq
   - `014-onboarding-voz/`: track-014-cena-mesmo-equipamento, track-014-conteudo-seed-v8, track-014-prints-etapas
3. **Commit 3 — as duas regras no RUNBOOK + `/intake`.** Em
   `.claude/tower/RUNBOOK.md`, duas seções novas:
   - **"Numeração de card (reserva por tag)"** — o número nasce do estado REMOTO e é
     reservado por tag ANTES de o card existir; tag rejeitada = outra sessão reservou
     no meio → recalcula. Número queimado (card descartado) NÃO se reusa. Snippet
     canônico (inclua no RUNBOOK como está):
     ```bash
     git fetch origin --tags -q
     ultimo=$(printf '%s\n' \
       "$(git ls-tree -r --name-only origin/main -- .claude/tower/cards/ | sed -nE 's|.*/([0-9]{3})-.*|\1|p')" \
       "$(git ls-remote --tags origin 'card-*' | sed -nE 's|.*refs/tags/card-([0-9]{3}).*|\1|p')" \
       | sort -n | tail -1)
     proximo=$(printf '%03d' $((10#${ultimo:-0} + 1)))
     git tag "card-$proximo" && git push origin "card-$proximo"
     # push rejeitado ("already exists") → refaça o fetch e repita: outra sessão reservou.
     ```
     Quem roda é a SESSÃO PRINCIPAL antes de spawnar o intake (o intake não tem Bash,
     de propósito) — o número chega reservado no prompt do intake.
   - **"Higiene na entrega"** — na hora do merge da última track de um card: status do
     card → `ENTREGUE — PR #<n>` (buscar a linha ATUAL do arquivo, não a imaginada);
     packs do card → `git mv` para `packs/_entregues/<NNN>-<slug>/` em commit próprio
     (mover ≠ editar); card FICA em `cards/` (memórias/docs apontam para lá).
     "Entregue" se marca NA HORA do merge, não depois.
4. **`.claude/commands/intake.md`:** trocar "(NNN = próximo número livre)" pelo fluxo
   novo: a sessão principal executa a reserva do RUNBOOK ("Numeração de card") e passa
   o número reservado ao agente; o intake não escolhe número.

## SCOPE
- .claude/tower/cards/002-design-system-doxa-segmentacao-home.md
- .claude/tower/cards/003-secao-sem-com.md
- .claude/tower/cards/004-manual-interativo-prompt-mestre.md
- .claude/tower/cards/005-conversor-pdf-word.md
- .claude/tower/cards/006-manual-imagens-reais.md
- .claude/tower/cards/007-manual-feedback-etapas.md
- .claude/tower/cards/008-manual-rodada-correcao.md
- .claude/tower/cards/009-manual-animacoes-por-passo.md
- .claude/tower/cards/010-manual-polimento-animacoes.md
- .claude/tower/packs/**
- .claude/tower/RUNBOOK.md
- .claude/commands/intake.md

## DEPENDS ON
nada (nasce de `origin/main`).

## VERIFY (pass/fail executável — cole a saída no report)
- `ls .claude/tower/packs/` = `_backlog-motor-011.md` · `_entregues` · `_obsoleto-card-001` · `track-seo-rodada-TEMPLATE.md` (e nada mais visível)
- `ls .claude/tower/packs/_entregues/ | wc -l` = 13 · `find .claude/tower/packs/_entregues -name '*.md' | wc -l` = 53
- `git diff -M --summary origin/main...HEAD | grep -c rename` = 53 (mover preservado como rename)
- `grep -H '\*\*Status:\*\*' .claude/tower/cards/00[2-9]*.md .claude/tower/cards/010*.md` → 9 linhas, todas com ENTREGUE + PR/SHA real
- `git diff --name-only origin/main...HEAD | grep -E 'cards/(001|011|012|013|014|015|016)'` = vazio (vivos e histórico intocados)
- `git diff --name-only origin/main...HEAD | grep -v '^\.claude/'` = vazio (nada fora do harness)
- `grep -c 'Numeração de card' .claude/tower/RUNBOOK.md` ≥ 1 · `grep -c 'git ls-tree' .claude/tower/RUNBOOK.md` ≥ 1 · `grep -c 'Higiene na entrega' .claude/tower/RUNBOOK.md` ≥ 1
- `grep -c 'reservad' .claude/commands/intake.md` ≥ 1 · `grep -c 'próximo número livre' .claude/commands/intake.md` = 0
- `pnpm typecheck && pnpm test` verdes (prova que o site não foi tocado)
- `git log --format='%s' origin/main..HEAD` = 3 commits: status · mv · regras

## COMMIT + PUSH
`chore(torre #016): <fatia>` — um commit por fatia (status / arquivamento / regras) →
`git push -u origin chore-torre-higiene`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
