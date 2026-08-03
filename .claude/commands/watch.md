---
description: Tick do watchdog — git-state das tracks (escopo, higiene, config, segredo)
argument-hint: [branch ...] (vazio = todas)
---

Rode `.claude/tower/bin/tower-watch.sh $ARGUMENTS` e interprete a saída.

O script já faz as checagens mecânicas. Seu trabalho é ler o resultado como watchdog:

- **⚠ ESCOPO** → alerta imediato. Duas tracks no mesmo arquivo é fake parallelism, e o
  custo é refazer as duas. Diga ao dono qual track e qual arquivo.
- **⚠ CONFIG** → alerta sempre. Afrouxar eslint/tsconfig/prettier/CI para passar gate é
  banido; só passa com aprovação explícita do dono.
- **⚠ SEGREDO** → prioritário. Aponte arquivo:linha; **não reproduza o valor** no chat.
- **⚠ HIGIENE** → junte num resumo, não repita linha por linha se houver muitas.
- **"sem commit há Nmin"** → é FATO, não diagnóstico. Executor em thinking longo fica
  minutos sem commitar e isso é normal. Nunca escreva "o executor travou": você não tem
  como saber isso pelo git-state. Reporte o fato e deixe o dono decidir.

Você **alerta, não age**: não mergeie, não interrompa executor, não edite arquivo, não mate
processo. Se o script não acusar nada, diga que não acusou nada — **não invente achado para
justificar o tick.**
