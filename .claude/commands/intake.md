---
description: Recebe uma demanda e vira card com critério de aceite observável
argument-hint: <a demanda, do jeito que o dono falou>
---

Despache o agente `intake` (subagent_type: `intake`) com a demanda abaixo.

O intake deve ler `.claude/tower/CARD-TEMPLATE.md`, escrever o card em
`.claude/tower/cards/<NNN>-<slug>.md` (NNN = próximo número livre) e devolver o caminho, o
que o dono quer ver funcionando, a classificação e as perguntas abertas.

Ele NÃO decide arquitetura, NÃO fatia tracks e NÃO implementa. Se a demanda tem mais de um
caminho possível, isso vira pergunta aberta no card — não escolha por ele.

Quando o card voltar, mostre o resumo ao dono e pergunte se pode seguir para o `/plano`.

DEMANDA:
$ARGUMENTS
