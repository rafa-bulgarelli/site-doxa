# Seção Sem Doxa / Com Doxa — Track única (card 003)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/feat-sem-com`,
branch **`feat-sem-com`** (já criada a partir de `origin/main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `feat-sem-com` · `git status --porcelain` vazio · você está no
diretório da worktree, não no repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO

O visitante já entendeu o mecanismo no "Como funciona". Aí bate a objeção: *"por que eu não
contrato um filmmaker e pronto?"*. Esta seção responde ela **antes de qualquer texto ser
lido** — mostrando o mesmo sinal atravessando dois caminhos: uma tubulação de 9 etapas onde
ele trava toda hora, e um salto único onde ele passa de primeira.

O dono aprovou o motion e disse "ficou legal pra caramba". A estrutura está fechada.

## A ESPECIFICAÇÃO É UM PROTÓTIPO FUNCIONAL

`/private/tmp/claude-501/-Users-rafaelfernandes-orca-projects-site-doxa/dd609af1-7215-4f85-8fc4-cf7d5982a55b/scratchpad/sem-com.html`

**Leia esse arquivo inteiro antes de escrever qualquer linha.** Ele é HTML/JS puro e tem o
motion completo, os tokens, os textos e os comentários explicando cada decisão. Aqui ele
vira React + framer-motion. Fases, tempos e ordem: copie do protótipo, não reinvente.

## CONTEXTO (não perca tempo redescobrindo)

- Vite + React 18 + TS + Tailwind + framer-motion. **Não é Next.**
- `src/components/hero/ConnectorLines.tsx` (180 linhas) já desenha fio e pulso —
  **avalie reuso antes de escrever SVG novo.** Se não servir, diga no report POR QUÊ.
- `src/components/ui/MotionButton.tsx` já existe: **o CTA reusa esse componente**, só ganha
  o glow disparado pelo pulso (não por hover).
- `src/index.css` tem as regras de motion da casa. Duas gramáticas, e elas são lei:
  **texto = ease expo-out** (`[0.16,1,0.3,1]`), **sinal = LINEAR** — o próprio CSS diz
  *"a signal doesn't ease"*.
- Paleta: `#000000`, creme `#DEDBC8`, cinzas `#242424`/`#1F1F1F`/`#6B6B6B`.
  **PROIBIDO vermelho/verde semântico.** No site `#ff3040`, `#22c55e` e `#3897f0` já
  significam TikTok, métrica e Instagram — usar como bom/ruim colide com a ProofWall.
  Contraste vem de **luz e peso**, só.

## DECISÕES DO DONO (não reabra)

- Lado SEM mostra **só o total: R$ 10.500/mês**. A quebra em produção/agência/tráfego é
  suposição não validada — deixe as três linhas **comentadas** em `config.ts` para o dono
  preencher. Não invente contabilidade dele na tela.
- Lado COM **não mostra valor nenhum**. Termina no CTA "Agendar diagnóstico estratégico".
- O destino do CTA ainda não existe. Isole em `CONTATO_URL` no `config.ts`, com
  `PENDENTE-DONO` visível abaixo do botão enquanto estiver vazio. **Não use `href="#"` solto**
  — CTA morto é o problema nº 1 do site hoje.
- Posição: entre `HowItWorks` e `ProofWall` no `src/App.tsx`.

## A TASK

1. `src/components/semcom/config.ts` — etapas, total, e `CONTATO_URL` (vazio por ora).
2. `src/components/semcom/Pipeline.tsx` — a tubulação: nós entrando em stagger, pulso
   linear que anda 55% do trecho e **trava** no nó. Nove vezes.
3. `src/components/semcom/CostStack.tsx` — o total acumulando enquanto o sinal está preso.
4. `src/components/semcom/DoxaHop.tsx` — dois nós, fio curto, pulso atravessando de uma vez,
   e o CTA (via `MotionButton`) acendendo quando o pulso chega.
5. `src/components/SemCom.tsx` — a seção sticky que orquestra as fases por scroll.
6. `src/App.tsx` — montar entre `HowItWorks` e `ProofWall`.
7. Mobile: a tubulação vira **vertical**. O comprimento deixa de ser metáfora e vira
   esforço real de rolagem — é a versão mais forte, não a degradada.
8. `prefers-reduced-motion`: tubulação inteira desenhada estática, sem pulso. A história
   continua sendo contada.

## SCOPE
- src/components/SemCom.tsx
- src/components/semcom/config.ts
- src/components/semcom/Pipeline.tsx
- src/components/semcom/CostStack.tsx
- src/components/semcom/DoxaHop.tsx
- src/App.tsx

Precisa tocar arquivo fora daqui — inclusive `src/index.css` — → **PARE e reporte.**

## DEPENDS ON
Nada. `origin/main` já tem o site inteiro.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm build` ok
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff --name-only origin/main...HEAD` = exatamente os 6 arquivos do SCOPE
- `pnpm dev` + `curl -s localhost:<porta> | grep -c "Agendar diagnóstico"` ≥ 1
- Confira no navegador as 5 fases do protótipo e **descreva o que viu em cada uma**.
  Não existe test runner neste repo — a conferência visual É o teste, então seja específico.

## COMMIT + PUSH
`feat(sem-com #003): seção comparativa Sem Doxa / Com Doxa` →
`git push -u origin feat-sem-com`. **NÃO abra PR, NÃO mergeie.**
Report final: verdict READY/NOT READY + saída colada do VERIFY + o que NÃO funcionou com
erro exato. NOT READY honesto vale mais que READY otimista.
