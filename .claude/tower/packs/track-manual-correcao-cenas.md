# Correção do manual — Track B: exemplos sempre abertos e a conta certa dos 60 (task_manual_correcao_cenas)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-correcao-cenas origin/feat/manual-correcao`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls public/manual/fotos/*.avif | wc -l` = **12**. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 008 — rodada de CORREÇÃO sobre o 007)
Duas reversões pontuais, ambas em `src/manual/cenas/`:
- **D — "Deixe essa seção sempre aberta."** O quadro serve/não-serve dos exemplos de
  foto NÃO ganha reveal por clique: aparece inteiro, direto. (Reverte o item 5 do
  007.) O quadro em si ele elogiou — layout, cartões e rótulos ficam como estão.
- **B3 — "são 60 conteúdos em todas as plataformas, e não vinte em cada."** A cena da
  garantia (GA-2) desenha hoje 20+20+20=60 — fato ERRADO. São **60 vídeos ÚNICOS, e
  cada um é publicado nas 3 redes** (o mesmo arquivo nas três). O texto da regra no
  banco já diz isso certo ("60 vídeos únicos, cada um nas três redes") — é só o
  desenho que conta a história errada.

## CONTEXTO (não perca tempo redescobrindo — diagnóstico do GESTOR)

### D — `ExemplosDeFotos.tsx`
- Remova o estado `revelado`/`useState` e o componente `Convite` ("Ver os 12
  exemplos de fotos"). O default export vira `<Quadro />` + `<GuiaEmPdf />`, direto.
- MANTENHA o `useReducedMotion` e a entrada escalonada dos cartões na montagem
  (`PASSO`, delays) — a etapa `fotos` monta quando o cliente chega nela, então o
  escalonamento continua fazendo sentido sem o clique.
- **NÃO adicione `focus()`** — o comentário no próprio arquivo explica por quê (foco
  na montagem faz a página rolar sozinha neste site).
- Os 12 cartões, rótulos, alt e o guia em PDF ficam intocados.

### B3 — `Sessenta.tsx`
- O que MORRE: o componente `Vintes` (os três "20") e qualquer leitura 20+20+20 —
  inclusive no comentário de bloco do arquivo, que hoje afirma "20 em cada uma das
  três redes" como se fosse o item (não é; confira o seed: a regra GA-2 diz "60
  vídeos únicos, cada um nas três redes").
- O que FICA: um vídeo → três fios → as três redes. Essa parte do desenho conta a
  história CERTA (o mesmo arquivo vai para os três destinos) — não a refaça.
- O fecho: o **60** como total de vídeos ÚNICOS, com a multiplicação nas redes lida
  como distribuição, nunca como divisão. Direção sugerida (ajuste a seu critério de
  cena, mantendo o vocabulário do módulo — `Legenda`, `Marca`, `Brilho`, fases do
  `useRoteiro`): a fase que acendia os vintes pode virar um pulso/aceso das três
  redes recebendo o MESMO vídeo; o 60 continua sendo o clímax. Nenhum número além
  do 60 precisa aparecer.
- A cena é `aria-hidden` (decorativa): a informação canônica é o texto da regra ao
  lado; o desenho só não pode CONTRADIZÊ-LO.

### Testes — `cenas.test.tsx`
- A asserção `expect(inicial).toContain('Ver os 12 exemplos de fotos')` (linha ~294)
  descreve o reveal que você está matando → inverta para o mundo novo: o quadro
  nasce aberto (contém "Assim serve" e "Assim não serve", 12 `<img>` com alt, sem o
  botão-convite).
- Teste novo do Sessenta: o markup renderizado contém `>60<` e NÃO contém `>20<`.
- `renderToStaticMarkup`, sem clique — como os testes do arquivo já fazem.

### Armadilhas do repo (já morderam)
**pnpm**, não npm · `.focus(` só com `{ preventScroll: true }` (aqui: simplesmente
não foque nada) · `tailwind.config.js` e `index.css` INTOCÁVEIS · opacidade fora da
escala de 5 só `[0.78]` · classe nunca montada por template string · StrictMode roda
efeito 2× · caminho de asset sempre literal, nunca template.

### INTOCÁVEIS
Tudo em `src/manual/publico/**` (track A está lá — importar pode, editar não),
`src/manual/cenas/contrato.tsx`, `pecas.tsx`, `luz.tsx`, `tempo.ts`,
`CenaClone.tsx`, `CenaGarantia.tsx`, `CenaOnboarding.tsx`, `CenaVoz.tsx`,
`itens/comuns.tsx` e os demais `itens/*` que não são o Sessenta,
`src/manual/servidor/**`, `src/manual/admin/**`, `tipos.ts`, `api/**`, `public/**`,
`index.css`, `tailwind.config.js`, `package.json`, `supabase/**`. Precisou tocar →
**PARE e reporte.**

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`, sem `@ts-ignore`, sem
dependência nova. Atualize os comentários de bloco dos dois arquivos — o do
`ExemplosDeFotos` narra o reveal e o do `Sessenta` narra o 20+20+20; os dois viram
mentira documentada se ficarem.

## A TASK
1. `ExemplosDeFotos.tsx`: quadro sempre aberto — sem `Convite`, sem `useState`.
2. `Sessenta.tsx`: sem `Vintes`, sem "20" — 60 vídeos únicos, cada um nas 3 redes.
3. `cenas.test.tsx`: asserções do mundo novo (quadro aberto; Sessenta com 60 e sem 20).

## SCOPE
- src/manual/cenas/ExemplosDeFotos.tsx
- src/manual/cenas/itens/Sessenta.tsx
- src/manual/cenas/cenas.test.tsx

## DEPENDS ON
Só a base `feat/manual-correcao` (o prelude de assets não toca `cenas/`). A track A
(`track/manual-correcao-fluxo`) roda em paralelo em `publico/` — integração no merge
serial, não aqui.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**358/358**), testes novos
  desta track inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-correcao...HEAD` = exatamente os 3
  arquivos do SCOPE
- `grep -rn "Ver os 12 exemplos" src/manual/` = vazio
- `grep -n "useState" src/manual/cenas/ExemplosDeFotos.tsx` = vazio
- `grep -nE '^\s+20$' src/manual/cenas/itens/Sessenta.tsx` = vazio e
  `grep -n "Vintes\|20 em cada" src/manual/cenas/itens/Sessenta.tsx` = vazio
- `git diff origin/feat/manual-correcao...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
`fix(manual): quadro de exemplos sempre aberto e a cena dos 60 sem o 20+20+20` →
`git push -u origin track/manual-correcao-cenas`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + saída colada do VERIFY + uma frase
descrevendo o desenho novo do Sessenta (o que o dono vai VER na fase final) — entra
no gate de copy junto com a track A. Merge/deploy/LIVE são do GESTOR.
