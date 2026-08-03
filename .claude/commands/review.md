---
description: Gate adversarial de uma branch antes do merge
argument-hint: <branch>
---

Despache o agente `collector` (subagent_type: `collector`) para auditar a branch
`$ARGUMENTS` antes do merge.

Passe a ele:
- o diff: `git diff origin/main...$ARGUMENTS` (rode `git fetch` antes)
- o pack da track: `.claude/tower/packs/$ARGUMENTS.md`
- o report do executor (verdict + saída do VERIFY), se você o tem

Ele devolve `VERDICT: APROVA / NÃO APROVA` com findings ordenados por severidade, cada um
com arquivo:linha e o cenário concreto de falha.

Ao receber:

- **Afirmação sem saída colada de comando = NÃO APROVA**, independente do resto do diff.
  "Os testes passaram" não é evidência; a saída do comando é.
- **Zero findings é resultado válido.** Se o collector voltou limpo, não peça para ele
  "olhar de novo até achar algo" — finding fabricado enterra o real.
- APROVA → o merge ainda é seu, SERIAL, e ainda precisa do OK do dono para ESTA branch.
- Depois do merge: `merge ≠ resolvido`. Falta o **VALIDAR-LIVE** — conferir o comportamento
  no ambiente real, no papel do usuário afetado. Só aí a demanda está entregue.
- Track mergeada e validada → `.claude/tower/bin/tower-close.sh $ARGUMENTS`.
