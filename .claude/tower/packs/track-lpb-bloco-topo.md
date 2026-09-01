# LP Black Scooto — Track A: bloco do TOPO (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-bloco-topo`,
branch **`track-lpb-bloco-topo`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-bloco-topo` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

A LP "LP BLACK — Scooto" do Figma, publicada num widget HTML do Elementor, **pixel
perfect em desktop (~1440px)**: tipografia Sora, cores, espaçamentos e imagens idênticos
ao frame. Zero JavaScript. Os CTAs levam ao formulário da página. Este bloco é a
PRIMEIRA faixa vertical da página — a primeira impressão do visitante.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — a seção *Fatiamento* diz
  exatamente quais seções do Figma pertencem ao bloco A; *Tokens* dá cores/fontes/
  espaçamentos; *Imagens* dá a URL final de cada asset; *Links permitidos* fecha os
  `href`. O contrato manda; este pack não o repete.
- Fonte da verdade visual: `entregas/lp-black-scooto/figma/frame-completo.png` e os
  `figma/secao-NN-*.png` das suas seções; textos/medidas literais em
  `figma/design-context.md`. Copie os TEXTOS literalmente — não parafraseie copy.
- Decisões do GESTOR: bloco autocontido (um único arquivo HTML com `<style>` próprio e
  `@import` da Sora com os pesos do contrato); todo seletor com prefixo `.lpb-`
  (o CSS vai viver dentro do tema da Scooto + Elementor — tag nua vaza e é vazada);
  imagens SEMPRE pela URL final `RAW_PREFIX` do contrato (o preview local resolve via
  `servir.mjs`); CTAs `href="#lpb-form"`. **Só o bloco A** carrega a regra global
  `html{scroll-behavior:smooth}` — é a única exceção de escopo permitida.
- Mobile: não há frame mobile no Figma. Adaptação por `@media (max-width: 480px)` (ou o
  breakpoint que o contrato fixar) — sem fidelidade exigida, só dignidade: sem rolagem
  horizontal a 390px, texto legível, imagens contidas.
- Armadilhas:
  - `raw.githubusercontent.com` não tem CDN — não referencie asset que não esteja na
    tabela *Imagens* do contrato.
  - Porta do seu preview é **5311** (fixa desta track; outras worktrees usam outras).
    `servir.mjs` falha se ocupada — não troque de porta, mate o processo antigo.
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar (nomes,
  comentários com porquê); classes CSS em kebab-case `lpb-<coisa>`.

## A TASK

1. Criar `entregas/lp-black-scooto/blocos/bloco-a-topo.html` reproduzindo as seções do
   fatiamento do bloco A: estrutura HTML semântica + `<style>` escopado `.lpb-`.
2. Desktop primeiro, contra os PNGs do Figma a 1440px — bata tamanhos, pesos e
   espaçamentos com os números do design-context, não de olho.
3. Depois a media query mobile (~390px sem overflow).
4. Rodar o VERIFY completo, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/blocos/bloco-a-topo.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-a-topo.html; echo "exit=$?"` → `exit=0`
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5311 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5311/?bloco=bloco-a-topo" 390 /tmp/lpb-a-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5311/?bloco=bloco-a-topo" 1440 /tmp/lpb-a-1440.png` → print gerado (vai para o gate visual do assento)
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só o arquivo do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): bloco A — topo da LP, desktop 1440 + mobile` →
`git push -u origin track-lpb-bloco-topo`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY (inclua os dois
caminhos de PNG gerados).
