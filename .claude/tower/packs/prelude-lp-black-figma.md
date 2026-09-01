# LP Black Scooto — PRELUDE P0: extração do Figma (card 018)

> **EXECUTADO PELO ASSENTO (sessão principal). NÃO SPAWNAR EXECUTOR.**
> Motivo: só a sessão principal tem o MCP do Figma — executores não têm acesso.
> Este pack existe para o assento seguir passo a passo e para o watchdog verificar escopo.

Branch **`prelude-lp-black-figma`** a partir de `origin/main`, worktree ou checkout do
assento. Merge por PR com OK do dono, ANTES de spawnar qualquer track do card 018.

## A VISÃO DO DONO

A LP "LP BLACK — Scooto" do Figma vai virar HTML pixel perfect. Tudo que os executores
vão usar como fonte da verdade visual — screenshots, textos, cores, tipografia,
espaçamentos, imagens de conteúdo — precisa estar gravado em disco, porque eles não
enxergam o Figma.

## A TASK (assento, via MCP do Figma)

Fonte: `https://www.figma.com/design/0wu66LVRV9sntibU4BV36V/LP-BLACK---Scooto?node-id=1-3`

1. `get_metadata` do frame `node-id=1-3` → inventário das seções (nome, ordem, bounds).
2. `get_screenshot` do frame inteiro → `entregas/lp-black-scooto/figma/frame-completo.png`.
3. `get_screenshot` de CADA seção de topo → `entregas/lp-black-scooto/figma/secao-NN-<nome>.png`
   (NN = ordem visual, duas casas).
4. `get_design_context` do frame (e das seções, se o retorno do frame vier truncado) →
   gravar TUDO que voltar de útil em `entregas/lp-black-scooto/figma/design-context.md`:
   textos literais, cores (hex), família/pesos/tamanhos de fonte, espaçamentos, raios,
   sombras, larguras. Sem editar/resumir — é dump de referência.
5. Exportar as imagens de CONTEÚDO (fotos, logos, ilustrações — não os retângulos de
   layout) → `entregas/lp-black-scooto/assets/<nome-descritivo>.{png,jpg,svg,webp}`.
   Se o MCP não exportar o binário original, `get_screenshot` do nó da imagem em 2x
   serve como fallback — registrar no design-context.md quais são fallback.
6. Conferir peso: nenhuma imagem > 400 KB sem motivo (raw.githubusercontent não tem CDN).
   Reexportar/comprimir o que passar.
7. Commit + push + PR.

## SCOPE

- entregas/lp-black-scooto/figma/**
- entregas/lp-black-scooto/assets/**

## DEPENDS ON

nada — é o primeiro passo do card 018.

## VERIFY (gate do PR, executado pelo assento)

- `ls entregas/lp-black-scooto/figma/frame-completo.png` existe; `file entregas/lp-black-scooto/figma/*.png` = todos "PNG image data"
- `ls entregas/lp-black-scooto/figma/secao-*.png | wc -l` ≥ número de seções do inventário do passo 1
- `grep -icE 'bearer|authorization' entregas/lp-black-scooto/figma/design-context.md` = 0 (nenhum segredo do chat vazou)
- `du -sk entregas/lp-black-scooto/assets/* | sort -rn | head` — nenhum item > 400 KB sem justificativa anotada
- `git diff --name-only origin/main...HEAD` ⊆ SCOPE acima

## COMMIT + PUSH

`chore(lp-black #018): material do Figma — screenshots, design-context, assets` →
PR → OK do dono → merge squash. Só depois disso o prelude P1 é spawnado.
