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
   merge SERIAL + VALIDAR-LIVE   ← assento do GESTOR (sessão principal), com o OK do dono
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
enquanto não houver. **Este repo ainda não tem remote** — por isso os executores só
commitam local; `git push` entra quando o remote existir.

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
- **Sem remote** — quando existir, os scripts passam a usar `origin/main` sozinhos, mas o
  `TRACK-TEMPLATE.md` precisa voltar a mandar `git push -u origin <branch>`.
