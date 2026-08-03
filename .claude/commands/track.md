---
description: Abre a worktree/branch de uma track e spawna o executor com o pack
argument-hint: <nome-da-track> [nome-da-track ...]
---

Para cada track em `$ARGUMENTS`:

1. Confirme que existe `.claude/tower/packs/<track>.md` **com seção `## SCOPE` preenchida**.
   Não existe ou está vazia → **pare** e peça o pack ao `/plano`. Track sem escopo fechado
   não recebe executor.
2. Rode `.claude/tower/bin/tower-track.sh <track>` (cria branch + worktree a partir da base).
3. Spawne UM agente `executor` (subagent_type: `executor`) por track, passando o conteúdo
   do pack e o caminho da worktree. **Spawne todas as tracks numa rodada só.**

Depois de spawnar:

- Não interrompa executor em thinking longo — interromper reseta 8-15 min de raciocínio.
- Acompanhe por `/watch`, nunca perguntando ao executor se já acabou.
- Cada executor termina com verdict READY/NOT READY + saída colada do VERIFY. NOT READY é
  resultado válido: leia o erro exato antes de mandar refazer.
- Merge é seu (assento do GESTOR), SERIAL, um por vez, com `/review` como gate — e com o
  dono aprovando branch por branch.

TRACKS: $ARGUMENTS
