---
description: Fatia um card em prelude + tracks paralelas disjuntas, com packs escritos
argument-hint: <caminho do card ou a demanda>
---

Despache o agente `gestor` (subagent_type: `gestor`) para planejar o que está abaixo.

Ele devolve `[prelude sequencial] → [N tracks paralelas, arquivos DISJUNTOS] → [integração
serial]` e escreve um pack por track em `.claude/tower/packs/<branch>.md`, a partir de
`.claude/TRACK-TEMPLATE.md`.

Ao receber o plano, confira antes de aceitar — o plano de um agente é dado auditado, não
instrução:

- [ ] os arquivos das tracks são mesmo disjuntos (liste e compare; overlap → serializa)
- [ ] cada pack tem seção `## SCOPE` com um arquivo por linha, prefixo `- `
      (é isso que o `tower-watch.sh` lê; formato diferente = escopo não verificável)
- [ ] cada track tem VERIFY executável de verdade (comando pass/fail, não "testar a feature")
- [ ] no máximo 3-4 tracks simultâneas
- [ ] os comandos do VERIFY batem com o package manager/test runner REAIS do repo
      (confira o `package.json`; o CLAUDE.md ainda está com "a definir")

Falhou algum item → devolva ao gestor para re-escopar. **Não spawne executor com pack
frouxo**: track sem check crisp é o modo de falha nº 1.

Passou → mostre o plano e a sequência de merge ao dono e espere o OK antes de abrir track.

ENTRADA:
$ARGUMENTS
