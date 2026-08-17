# CARD 009 — Manual: animação contextual em cada passo + redes sociais como primeiro passo

- **Tipo:** feature
- **Aberto em:** 2026-08-17
- **Status:** aberto

## O que o dono quer ver funcionando

Cada passo do manual ("Passo X de Y") com uma **animação própria em cima do rótulo do
passo** — e não uma animação genérica bonita: ela tem que **contar o conteúdo daquele
passo**. Nas palavras dele: "devem fazer sentido com o contexto do passo e não serem
só animações bonitas, entendido?". Além disso, no capítulo 1, o passo dos links de
redes sociais vira o **primeiro** passo, não o último.

## O feedback, item a item (2026-08-17, sobre o fluxo por etapas no ar)

1. **Cap 1, "Passo 1 de 2"** (respostas do onboarding): adicionar animação acima do
   rótulo do passo comunicando que **as respostas que o cliente escreve são usadas
   para dar contexto à ferramenta e montar os roteiros** (resposta → contexto →
   roteiro).
2. **Cap 1, passo "Perfis de Redes Sociais"**: "esse aqui é o primeiro passo,
   preencher os links das redes sociais da forma correta, e não o último" —
   **reordenar**: redes sociais abre o capítulo 1. A legenda atual diz "No fim do
   onboarding entram os três perfis" — a copy precisa acompanhar a nova posição.
3. **Cap 2 (voz), passos 1–3**: animação para cada passo que está sem, em cima de
   "Passo X de 3":
   - Passo 1 "Grave num lugar silencioso" → animação sobre silêncio/ambiente limpo
   - Passo 2 "Fale natural" → animação sobre fala natural/ritmo de conversa
   - Passo 3 "Use o gravador do seu celular — e grave aos poucos" → animação sobre
     gravador do celular/trechos curtos
4. **Cap 3 (clone), passos 1–3**: "mesmo feedback para todos os itens do clone" —
   animação contextual em cada um (ex.: passo 1 "Foto nítida, de frente, em boa
   luz").

## Critério de aceite (observável, executável por humano)

- [ ] No manual publicado, capítulo 1 abre com o passo dos **Perfis de Redes
      Sociais**; a legenda não fala mais "no fim do onboarding"
- [ ] O passo das respostas do cap. 1 tem animação acima do rótulo "Passo X de Y"
      que, vista sem ler nada, comunica: o que o cliente escreve vira contexto e
      roteiro
- [ ] Cada passo dos caps. 2 e 3 tem animação própria acima do "Passo X de 3",
      tematicamente ligada ao título do passo (silêncio ≠ fala natural ≠ gravador;
      idem no clone)
- [ ] Nenhum passo de item dos caps. 1–3 fica sem animação
- [ ] **Gate visual com o dono antes do merge**: ele olha cada animação e confirma
      que "faz sentido com o contexto" — é critério dele, não do executor
- [ ] No celular, as animações não estouram o layout nem atrasam o carregamento do
      passo
- [ ] `prefers-reduced-motion` respeitado (padrão já existente nas cenas)

## Contexto do repo (caminhos exatos)

- **O padrão já existe**: `src/manual/cenas/itens/*` são exatamente isso — uma
  mini-animação POR ITEM da garantia (Relogio, Semana, SemCompra, SemImpulso,
  Sessenta, Intacto, Meta, PergunteAntes), montadas sobre `cenas/pecas.tsx` (Palco,
  Painel, Legenda…), `cenas/luz.tsx` (tintas/brilhos) e `cenas/tempo.ts`
  (`useRoteiro`, fases). Os passos dos caps. 1–3 precisam do MESMO tratamento — é
  estender o padrão, não inventar outro.
- `src/manual/publico/Capitulo.tsx` + `maquina.ts` (`etapasDo`) — onde o passo é
  montado e onde entra o slot da animação acima do rótulo; a ordem das etapas do
  cap. 1 (item 2) também nasce daqui/dos dados da seção.
- `src/manual/cenas/CenaOnboarding.tsx` · `CenaVoz.tsx` · `CenaClone.tsx` — cenas de
  abertura dos capítulos (continuam na abertura; este card é sobre os PASSOS).
- Legenda do passo de redes: hoje em `src/manual/publico/Prints.tsx` ou dados da
  seção — ajustar junto com a reordenação.
- i18n pt|en — qualquer copy nova/ajustada nas duas línguas.

## Armadilhas conhecidas

- **O dono já reprovou animação por ser "colorida demais" e por "não fazer nada"**
  (CenaClone, cards 007/008). As animações novas: sóbrias, com ARCO narrativo curto
  (começo → transformação → fim), não loop decorativo. O gate visual com ele existe
  para pegar isso cedo — mostrar 1-2 primeiras antes de produzir as 7-8.
- Reordenar etapas do cap. 1 mexe na `maquina.ts`/dados — conferir que progresso
  salvo/retomada de sessão do convidado não quebra com a ordem nova (testes de
  `maquina.test.ts`).
- `tailwind.config.js` sem hot-reload; validação live no domínio com **L**.
- Framer-motion em SVG dentro de seção lazy: cuidado com o custo no celular — as
  cenas existentes já resolvem isso; reusar as peças, não importar lib nova.

## Perguntas abertas para o GESTOR

1. **Ordem final do cap. 1**: redes sociais vira passo 1 — e o restante fica em que
   ordem? (Hoje: respostas "Passo 1 de 2" + telas "na plataforma é assim". O prelude
   percorre o fluxo no ar, enumera as etapas atuais e propõe a ordem nova; confirmar
   com o dono se sobrar dúvida.)
2. **Inventário exato de passos sem animação** (prelude): percorrer caps. 1–3 no
   fluxo do convidado e listar cada passo → cada um vira uma animação nomeada no
   pack, com a mensagem que ela deve comunicar em UMA frase (é o VERIFY conceitual
   do desenho).
3. As telas "NA PLATAFORMA, É ASSIM" (prints) também ganham animação? Leitura do
   intake: **não** — o pedido é "para cada item que está sem", e essas telas têm o
   print como protagonista. Confirmar de graça na aprovação.

## Conteúdo suspeito

Nenhum — feedback do dono com capturas do próprio site (as capturas estão em pasta
temporária do macOS, mas são só referência visual; nenhum asset novo é necessário
delas).

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <…>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <…>
- **VALIDAR-LIVE:** <…>
