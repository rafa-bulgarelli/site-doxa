# LP Black Scooto — Track A: bloco do TOPO / hero (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-bloco-topo`,
branch **`track-lpb-bloco-topo`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-bloco-topo` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

A LP "LP BLACK — Scooto" do Figma, publicada no Elementor, **pixel perfect em desktop
(~1440px)**. O hero é a primeira impressão: H1 "Você vai gerar demanda na Black
Friday. Quem vai dar conta?", prova social (XP, Cora, Boca Rosa) e, à direita, um card
branco com moldura em gradiente, badge "Avaliação gratuita" e título "Vamos entender
sua operação" — onde entra um formulário REAL. Zero JavaScript nos blocos.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — *Fatiamento*, *Montagem
  do hero*, *Tokens*, *Imagens*, *Links permitidos*. Depois a seção 01 de
  `figma/design-context.md` (dump verbatim do hero) e `figma/secao-01-hero.png`.
  Copie os TEXTOS literalmente — não parafraseie copy.
- **O mini-form do hero NÃO é seu**: é widget nativo Elementor Pro Form (track D) —
  decisão do dono; form HTML puro não dispara o hook do Intercom. **Você NÃO escreve
  `<form>` nem campos** (o `checar-bloco.mjs` reprova `<form>` em bloco). Sua parte é
  a MOLDURA, em dois arquivos que o Elementor monta em colunas (contrato § Montagem
  do hero):
  - `blocos/bloco-a-topo.html` — coluna esquerda do hero (H1, subtítulo, prova
    social, e o que mais o fatiamento atribuir) + a única regra global permitida
    `html{scroll-behavior:smooth}` (exclusiva deste arquivo).
  - `blocos/bloco-a-hero-form-topo.html` — o TOPO do card do hero: badge "Avaliação
    gratuita" + título "Vamos entender sua operação", MAIS as regras CSS da classe
    **`.lpb-hero-card`** (o card em si: fundo branco, moldura em gradiente, radius —
    a classe vai na COLUNA do Elementor e envolve este fragmento + o widget de form).
    Os campos/botão dentro do card são estilizados pela track D.
- Decisões do GESTOR: seletores SEMPRE com prefixo `.lpb-`; blocos autocontidos
  (`<style>` + `@import` próprio com **Sora E Roboto** nos pesos do contrato — Sora
  só em títulos, corpo é Roboto); imagens SEMPRE pela URL final `RAW_PREFIX` do
  contrato (preview local resolve via `servir.mjs`); CTAs de seção apontam para
  `#lpb-form` (o form COMPLETO — o form do hero submete, não ancora).
- Mobile: sem frame no Figma. `@media` própria no breakpoint do contrato — sem
  rolagem horizontal a 390px, texto legível, imagens contidas.
- Armadilhas:
  - Porta do seu preview é **5311** (fixa). `servir.mjs` falha se ocupada — não
    troque de porta, mate o processo antigo.
  - `GET /?bloco=hero` monta o scaffold do hero (seus dois fragmentos + o mock do
    form da track D, se já existir na sua base — se não existir, o servidor pula com
    aviso; o teste de overflow continua válido).
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar; classes
  CSS em kebab-case `lpb-<coisa>`.

## A TASK

1. Criar `entregas/lp-black-scooto/blocos/bloco-a-topo.html` (coluna esquerda do
   hero, fiel ao dump da seção 01 a 1440px — bata medidas com os números, não de
   olho).
2. Criar `entregas/lp-black-scooto/blocos/bloco-a-hero-form-topo.html` (badge +
   título do card + CSS de `.lpb-hero-card`).
3. Media queries mobile (~390px sem overflow) nos dois.
4. Rodar o VERIFY completo, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/blocos/bloco-a-topo.html
- entregas/lp-black-scooto/blocos/bloco-a-hero-form-topo.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-a-topo.html; echo "exit=$?"` → `exit=0`
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-a-hero-form-topo.html; echo "exit=$?"` → `exit=0`
- `grep -ci '<form' entregas/lp-black-scooto/blocos/bloco-a-topo.html entregas/lp-black-scooto/blocos/bloco-a-hero-form-topo.html` → 0 nos dois (o form do hero é widget nativo, track D)
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5311 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5311/?bloco=hero" 390 /tmp/lpb-a-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5311/?bloco=hero" 1440 /tmp/lpb-a-1440.png` → print gerado (gate visual do assento vs `figma/secao-01-hero.png`)
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só os 2 arquivos do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): bloco A — hero (coluna esquerda + moldura do card do form)` →
`git push -u origin track-lpb-bloco-topo`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY (inclua os
caminhos dos PNGs gerados).
