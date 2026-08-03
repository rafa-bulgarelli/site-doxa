# Control Tower — runbook operacional

Como uma demanda atravessa a torre, do que o dono falou até "entregue".
Papéis e alocação de modelo: `.claude/TOWER-ROLES.md`.

## O ciclo

```
/intake  <demanda>      → card em .claude/tower/cards/
/plano   <card>         → prelude + tracks disjuntas + packs em .claude/tower/packs/
/track   <a> <b> <c>    → worktree+branch por track, executores spawnados numa rodada
/watch                  → tick de git-state enquanto rodam
/review  <branch>       → gate adversarial antes de cada merge
   PR + merge SERIAL + VALIDAR-LIVE  ← assento do GESTOR (sessão principal), com o OK do dono
tower-close.sh <branch> → fecha a worktree da track entregue
/handoff                → fim de sessão: funcionou / NÃO funcionou / próximo passo
```

## Scripts

| Script | O que faz |
|---|---|
| `bin/tower-track.sh <track>` | branch nova a partir da base + worktree em `~/orca/workspaces/site-doxa/<track>`. Avisa se o pack não existe. |
| `bin/tower-watch.sh [branch…]` | tick do watchdog: commits, ociosidade, escopo vs `## SCOPE` do pack, config protection, higiene do diff, segredo (aponta linha, omite valor). Sai 0 sempre. |
| `bin/tower-close.sh <track>` | remove worktree + apaga branch. **Recusa** se a track não estiver mergeada. |

Os três detectam a base sozinhos: `origin/main` quando houver remote, `main` local
enquanto não houver. Remote configurado: `github.com/rafa-bulgarelli/site-doxa` (privado),
então a base é `origin/main` e o executor termina com `git push -u origin <branch>`.

Rode `git fetch` antes do tick quando as tracks já estiverem no remote — o watchdog compara
contra `origin/main`, e ref desatualizado dá alerta falso.

## Merge: só por PR

`main` é protegida com `enforce_admins` ligado — **push direto não passa pra ninguém,
inclusive o dono**. Verificado: `[remote rejected] (protected branch hook declined)`.
Histórico linear obrigatório, sem force push, sem deleção.

Uma track por vez, na ordem que o GESTOR definiu:

```bash
gh pr create --base main --head <branch> --title "<tipo>(<escopo>): <resumo>" --body "…"
# gate: /review <branch>  →  VERDICT do collector  →  OK do dono
gh pr merge <branch> --squash --delete-branch
git checkout main && git pull
# então: VALIDAR-LIVE  →  tower-close.sh <branch>
```

`--squash` ou `--rebase`: merge commit é recusado pelo histórico linear.
Merge da próxima track só depois do VALIDAR-LIVE da anterior — é isso que "serial" quer
dizer, e é o que manteve 25+ PRs sem conflito de integração no DOXA original.

Para relaxar o gate (não recomendado — vira proteção decorativa, que é pior que nenhuma
porque só falha no dia em que importava):
`gh api -X DELETE repos/rafa-bulgarelli/site-doxa/branches/main/protection/enforce_admins`

## Os pontos onde a torre trava de propósito

- **Pack sem `## SCOPE`** → não spawne executor. O watchdog lê essa seção; sem ela o escopo
  não é verificável e a track vira fake parallelism silencioso.
- **Track sem VERIFY executável** → não spawne. "Executor disse pronto, feature quebrada"
  é o modo de falha nº 1.
- **Verdict sem saída colada** → NOT READY. Afirmação não é evidência.
- **Config tocado dentro de track** → para tudo até o dono aprovar. Conserta-se o código,
  não o gate.
- **Merge feito** → ainda não acabou. Falta VALIDAR-LIVE no ambiente real, no papel do
  usuário afetado.

## Limites que valem obedecer

- 3-4 tracks simultâneas no máximo. Acima disso a coordenação come o ganho.
- Executor em thinking longo **não se interrompe** — reseta 8-15 min de raciocínio.
  Branch parada é fato a reportar, não diagnóstico de travamento.
- Executor com track mergeada **se fecha**. Worktree ociosa acumulando é anti-pattern.
- Merge é **serial**, com gate entre cada um. Nunca em lote.

## Ainda pendente neste repo

- **Stack a definir** (`CLAUDE.md`) — primeira decisão do GESTOR, precisa do dono.
- **Package manager / test runner** — confirmar no `package.json` antes de escrever
  qualquer bloco VERIFY. Não assumir npm.
- **Nome do produto** — repo/diretório é `site-doxa`, o dono chama de "site da Orca".
  Não resolvido; ver card `001-site-orca.md`.
- **Git via HTTPS** — a chave SSH local é idêntica à registrada no GitHub, mas está com
  passphrase e o `ssh-agent` está vazio. O remote usa HTTPS + credential helper do `gh`.
  Para voltar ao SSH: `ssh-add ~/.ssh/id_ed25519` e
  `git remote set-url origin git@github.com:rafa-bulgarelli/site-doxa.git`.
