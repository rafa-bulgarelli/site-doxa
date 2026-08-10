# CARD 003 — Seção "Sem Doxa / Com Doxa"

- **Tipo:** feature
- **Aberto em:** 2026-08-04
- **Status:** aberto

## O que o dono quer ver funcionando

Uma seção nova, entre "Como funciona" e a prova social, contando a mesma história em dois
lados: **Sem Doxa** (a tubulação de 9 etapas do jeito antigo, travando etapa por etapa, até
a conta acumulada — hoje R$ 10.500/mês, custo que o cliente já paga, não preço da Doxa) e
**Com Doxa** (1 etapa, foto + áudio → vídeo pronto). O lado Com Doxa **não mostra valor** —
termina num botão "Agendar diagnóstico estratégico". O design e o motion já estão 100%
aprovados: o protótipo funcional em
`/private/tmp/claude-501/-Users-rafaelfernandes-orca-projects-site-doxa/dd609af1-7215-4f85-8fc4-cf7d5982a55b/scratchpad/sem-com.html`
é a especificação exata — layout, easing, sequência de fases, textos — e precisa virar
React + framer-motion no site real, sem reinterpretar decisão nenhuma dele.

## Critério de aceite (observável, executável por humano)

- [ ] Rodar `npm run dev`, abrir a home: a nova seção aparece **depois de "Como funciona"
  e antes da prova social** (`ProofWall`), nunca em outra posição.
- [ ] Ao entrar na seção por scroll: aparece a abertura ("O mesmo vídeo, dois caminhos" /
  headline / "Role") — igual à `.intro` do protótipo, sem cor além de preto/creme/cinza.
- [ ] Seguir rolando dentro do palco (a seção é sticky/scrollytelling, ~520vh como no
  protótipo): a tubulação do lado **Sem Doxa** se desenha nó a nó (9 etapas: Briefing,
  Roteiro, Aprovação, Agenda, Estúdio, Filmmaker, Captação, Edição, Publicação) — cansativa
  de propósito, não instantânea.
- [ ] Continuando a rolagem: o sinal (pulso) percorre o fio e **trava visivelmente em cada
  um dos 9 nós** — o movimento entre nós é linear (sem ease), igual à regra "a signal
  doesn't ease" documentada em `src/index.css`. Comparar side-by-side com o pulso do Hero
  (`.connector-pulse` / `ConnectorLines`) para confirmar que é a mesma gramática de sinal.
- [ ] Continuando: as 3 linhas de custo (produção/agência/tráfego) sobem uma a uma e o
  total acumulado aparece: **"R$ 10.500 / por mês, todo mês"** e **"18 dias / até o
  primeiro vídeo"** — os números batem exatamente com esses, sem arredondar nem trocar por
  outro valor.
- [ ] Continuando: o lado Sem Doxa colapsa (perde opacidade, sobe, borra) e o lado **Com
  Doxa** entra: "Você envia → Uma foto / Um áudio de 30s" → fio → "Vídeo pronto", com
  "Hoje / até o primeiro vídeo" e o botão **"Agendar diagnóstico estratégico →"** visível.
- [ ] No lado Com Doxa, o pulso atravessa o fio periodicamente e o **botão acende** (glow)
  a cada chegada do pulso — não é um glow estático.
- [ ] Em nenhum ponto da seção aparece vermelho (#ff3040), verde (#22c55e) ou azul do
  Instagram (#3897f0) — só preto, `#DEDBC8` (creme) e cinzas.
- [ ] Reduzir movimento no SO (`prefers-reduced-motion: reduce`) e repetir o scroll: a
  seção ainda é legível e completa (fases visíveis, valores finais visíveis), sem travar
  nem quebrar layout — sem exigir a animação para entender o conteúdo.
- [ ] Testar em mobile width (~375px, no protótipo o layout vira coluna/vertical): a seção
  não quebra, os hops do lado Com Doxa empilham em vez de ficarem lado a lado.
- [ ] `npm run typecheck` e `npm run build` passam limpos (não há test runner no projeto —
  ver "Armadilhas conhecidas").
- [ ] O botão de diagnóstico tem um destino real definido e funcional (ver pergunta aberta
  (b) — sem resposta, este item fica bloqueado ou aponta para placeholder marcado
  explicitamente).

## Contexto do repo (caminhos exatos)

- `src/App.tsx` — monta `<Hero /> <HowItWorks /> <ProofWall />` nessa ordem dentro de
  `<main className="bg-black">`. A nova seção entra entre `HowItWorks` e `ProofWall`.
- `src/components/hero/ConnectorLines.tsx` (180 linhas) — já desenha fio + pulso via SVG
  `<path>` com geometria lida do DOM a cada frame (não via React state). Candidato a reuso
  ou referência de padrão para os fios desta seção — não reescrever do zero sem antes
  avaliar se serve.
- `src/index.css` — já contém a gramática de motion do site: `@keyframes connector-pulse`
  (linear, "a signal doesn't ease", comentário explícito linhas 62-77) e
  `@keyframes connector-in` (traço se desenhando). A seção nova deve seguir essa mesma
  gramática, não inventar uma nova curva para sinal.
- `src/components/ui/MotionButton.tsx` — botão pill reusável (`variant="primary"` preenche
  branco no hover, disco cresce). Candidato natural para o CTA "Agendar diagnóstico
  estratégico", mas o visual do protótipo (`.cta`) é levemente diferente (creme sólido,
  glow por chegada de pulso, não por hover) — decisão de reuso vs. variante nova é do
  GESTOR/executor, não travada aqui.
- `src/components/HowItWorks.tsx` — vizinho imediato acima da nova seção; usa
  `useInView` do framer-motion e `useIsDesktop` (`src/hooks/useIsDesktop.ts`) para
  desktop/mobile — mesmo padrão provavelmente serve aqui.
- `src/components/ProofWall.tsx` — vizinho imediato abaixo; usa `useScroll`/`useTransform`/
  `useSpring` do framer-motion para efeito de scroll com profundidade (3 eixos) — mostra
  que scrollytelling já é padrão estabelecido no repo, não uma técnica nova.
- Protótipo de referência (fora do repo, ler antes de implementar):
  `/private/tmp/claude-501/-Users-rafaelfernandes-orca-projects-site-doxa/dd609af1-7215-4f85-8fc4-cf7d5982a55b/scratchpad/sem-com.html`
  — HTML/JS puro, ~800 linhas, com CONFIG isolado (steps + costs), 5 fases de scroll
  mapeadas por `range(p, a, b)`, e comentários explicando cada decisão de motion. É a
  especificação, não um mockup para "se inspirar".

## Armadilhas conhecidas

- **Sem test runner no projeto** (`package.json`: só `dev`, `build`, `typecheck`,
  `preview`). Verificação é `npm run typecheck` + `npm run build` + inspeção visual — não
  inventar `npm test`.
- `main` é protegida (PR obrigatório, histórico linear, `enforce_admins`). Merge só via
  `gh pr create` + `gh pr merge --rebase`.
- O protótipo usa `viewBox="0 0 1000 60"` com coordenadas fixas para os 9 nós — ao portar
  para React, cuidado para não hardcodar em pixels de tela real (ver o comentário em
  `ConnectorLines.tsx` sobre por que a geometria é lida do DOM, não adivinhada em
  percentual).

## Perguntas abertas para o GESTOR

1. **Quebra dos R$ 10.500 entre produção/agência/tráfego** é suposição do intake anterior
   (R$ 6.000 / R$ 2.500 / R$ 2.000, ver comentário `CONFIG.costs` no protótipo) — o Rafa só
   confirmou o total. Precisa validação do dono antes de virar texto final do site (a soma
   pode ir pro card, a divisão em 3 linhas não é fato dado).
2. **Destino do botão "Agendar diagnóstico estratégico"** não foi definido — link externo
   (Calendly?), WhatsApp, formulário interno, âncora para seção de contato? Sem isso o
   botão não tem `href` real; não inventar destino.
3. Fora do escopo desta seção mas relevante para o plano: o card não define se o reuso do
   `MotionButton` existente é obrigatório ou se o CTA desta seção pode ter estilo próprio
   (o protótipo tem visual e comportamento de glow diferentes do botão atual) — decisão de
   arquitetura, fica para o GESTOR.

## Conteúdo suspeito

Nenhum. O protótipo HTML foi lido inteiro; contém apenas markup, CSS, JS e comentários
explicativos do próprio processo de design — nenhuma instrução embutida endereçada a um
agente, nenhum dado sensível (token, senha, URL privada).

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <A: … | B: … | C: …>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <ordem + gate de cada etapa>
- **VALIDAR-LIVE:** <o que conferir no ambiente real, no papel de qual usuário>
