# LP Black Scooto — Track C: bloco FINAL (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-bloco-final`,
branch **`track-lpb-bloco-final`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-bloco-final` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

A LP "LP BLACK — Scooto" do Figma, publicada num widget HTML do Elementor, **pixel
perfect em desktop (~1440px)**: tipografia Sora, cores, espaçamentos e imagens idênticos
ao frame. Zero JavaScript. Os CTAs levam ao formulário da página. Este bloco é a faixa
FINAL — a moldura em volta do formulário (título/apoio da seção de conversão, rodapé e
o que mais o fatiamento disser), onde o visitante decide preencher.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — a seção *Fatiamento* diz
  exatamente quais seções do Figma pertencem ao bloco C e ONDE o widget nativo do form
  se encaixa (o form em si é da track D — o seu bloco só emoldura e ancora); *Tokens*,
  *Imagens* e *Links permitidos* fecham o resto. O contrato manda; este pack não o
  repete.
- Fonte da verdade visual: `entregas/lp-black-scooto/figma/frame-completo.png` e os
  `figma/secao-NN-*.png` das suas seções; textos/medidas literais em
  `figma/design-context.md`. Copie os TEXTOS literalmente — não parafraseie copy.
- Decisões do GESTOR: bloco autocontido (um único arquivo HTML com `<style>` próprio e
  `@import` da Sora com os pesos do contrato); todo seletor com prefixo `.lpb-`
  (o CSS vai viver dentro do tema da Scooto + Elementor — tag nua vaza e é vazada);
  imagens SEMPRE pela URL final `RAW_PREFIX` do contrato (o preview local resolve via
  `servir.mjs`); CTAs `href="#lpb-form"`. A regra global `html{scroll-behavior:smooth}`
  é EXCLUSIVA do bloco A — aqui é proibida (o checar-bloco reprova). **NÃO** escreva
  `<form>` nem campos: o formulário é widget nativo do Elementor Pro (track D) — form
  HTML puro não dispara o hook do Intercom e seria trabalho jogado fora.
- Mobile: não há frame mobile no Figma. Adaptação por `@media (max-width: 480px)` (ou o
  breakpoint que o contrato fixar) — sem fidelidade exigida, só dignidade: sem rolagem
  horizontal a 390px, texto legível, imagens contidas.
- Armadilhas:
  - `raw.githubusercontent.com` não tem CDN — não referencie asset que não esteja na
    tabela *Imagens* do contrato.
  - Porta do seu preview é **5313** (fixa desta track; outras worktrees usam outras).
    `servir.mjs` falha se ocupada — não troque de porta, mate o processo antigo.
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar (nomes,
  comentários com porquê); classes CSS em kebab-case `lpb-<coisa>`.

## A TASK

1. Criar `entregas/lp-black-scooto/blocos/bloco-c-final.html` reproduzindo as seções do
   fatiamento do bloco C: estrutura HTML semântica + `<style>` escopado `.lpb-`.
2. Desktop primeiro, contra os PNGs do Figma a 1440px — bata tamanhos, pesos e
   espaçamentos com os números do design-context, não de olho.
3. Depois a media query mobile (~390px sem overflow).
4. Rodar o VERIFY completo, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/blocos/bloco-c-final.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-c-final.html; echo "exit=$?"` → `exit=0`
- `grep -ci '<form' entregas/lp-black-scooto/blocos/bloco-c-final.html` = 0 (form é da track D, widget nativo)
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5313 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5313/?bloco=bloco-c-final" 390 /tmp/lpb-c-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5313/?bloco=bloco-c-final" 1440 /tmp/lpb-c-1440.png` → print gerado (vai para o gate visual do assento)
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só o arquivo do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): bloco C — final da LP com moldura do form, desktop 1440 + mobile` →
`git push -u origin track-lpb-bloco-final`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY (inclua os dois
caminhos de PNG gerados).
