---
description: Grava o handoff de fim de sessão (funcionou / NÃO funcionou / próximo passo)
---

Escreva o handoff desta sessão em `.claude/tower/handoffs/<YYYY-MM-DD>-<slug>.md`,
seguindo `.claude/tower/HANDOFF-TEMPLATE.md`. As três seções são obrigatórias:

1. **O que funcionou** — com evidência (comando + saída, caminho de arquivo, SHA).
2. **O que NÃO funcionou** — o **erro exato e a causa**. Nunca "não deu certo", nunca
   "tive problema com X". Sem isso, a próxima sessão repete a mesma tentativa do zero — é
   exatamente esse retrabalho amnésico que o handoff existe para matar.
3. **Próximo passo exato** — o comando ou a decisão que vem a seguir, não "continuar".

Inclua o estado da torre: tracks abertas, branches vivas, o que está mergeado, o que falta
VALIDAR-LIVE. Rode `.claude/tower/bin/tower-watch.sh` e anexe o tick.

Não escreva segredo, token ou URL privada no handoff.
