# LP Black Scooto — Track C: bloco FINAL — FAQ, moldura do form, footer (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-bloco-final`,
branch **`track-lpb-bloco-final`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-bloco-final` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

A reta final da LP: o FAQ com as 10 perguntas ("Perguntas que a gente sempre recebe"),
a seção rosa "Solicite o seu orçamento" onde vive o formulário completo, o CTA "Falar
pelo WhatsApp" e o footer. **Pixel perfect em desktop (~1440px)**, zero JavaScript —
inclusive o acordeão do FAQ, que abre e fecha sem uma linha de script.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — *Fatiamento* (seções
  09–11 são suas), **FAQ R01–R10** (as respostas 2–10 foram redigidas no prelude —
  use-as LITERALMENTE, não reescreva), *Links permitidos*, *Footer*, *Tokens*,
  *Imagens*. Depois as seções 09, 10 e 11 de `figma/design-context.md` e os PNGs
  `figma/secao-09..11-*.png`. Copie os TEXTOS do Figma literalmente.
- **Sua entrega são DOIS arquivos** — o widget nativo do form completo (track D)
  entra ENTRE eles na página:
  - `blocos/bloco-c-final.html` — FAQ completo (seção 09) + o TOPO da seção 10:
    fundo `#f12d64`, H2 "Solicite o seu orçamento", subtítulo. O card de campos NÃO
    é seu.
  - `blocos/bloco-c-pos-form.html` — o resto da seção 10 (texto "Prefere falar
    direto?", CTA pill "Falar pelo WhatsApp" com o href do contrato, linha de selos
    "Mais de 150 empresas · …") + o footer (seção 11).
- **FAQ zero JS**: acordeão com `<details>/<summary>` nativo — item 1 com `open`,
  demais fechados, TODOS com resposta (R01–R10 do contrato). Chevron/disco do Figma
  reproduzidos em CSS (estados via `details[open]`), sem os SVGs se o CSS bastar.
- **Footer, decisões do dono (já no contrato)**: a linha do CNPJ placeholder SAI;
  "Política de Privacidade" → URL do contrato; "Termos de Uso" só entra se o
  contrato registrar URL (senão o link sai); ícones sociais só os que têm perfil
  real registrado no contrato — os demais saem.
- Decisões do GESTOR: **NÃO** escreva `<form>` nem campos (o `checar-bloco.mjs`
  reprova; form HTML puro não dispara o hook do Intercom). Seletores SEMPRE `.lpb-`;
  blocos autocontidos (`<style>` + `@import` com **Sora E Roboto** nos pesos do
  contrato); imagens pela URL final `RAW_PREFIX`; a regra global
  `html{scroll-behavior:smooth}` é EXCLUSIVA do bloco A — aqui é proibida. A âncora
  `#lpb-form` fica no WIDGET do form (CSS ID, montagem) — seus arquivos não a
  declaram, só CTAs que apontam para ela se o Figma os tiver.
- Mobile: sem frame no Figma. `@media` própria no breakpoint do contrato — sem
  rolagem horizontal a 390px, texto legível.
- Armadilhas:
  - Porta do seu preview é **5313** (fixa). `servir.mjs` falha se ocupada — não
    troque de porta, mate o processo antigo.
  - O PNG decorativo da seção 10 sangra para fora à direita (`left-[1040px]`) —
    contenha com `overflow:hidden` no wrapper `.lpb-` da seção, senão vira rolagem
    horizontal no mobile.
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar; classes
  CSS em kebab-case `lpb-<coisa>`.

## A TASK

1. Criar `entregas/lp-black-scooto/blocos/bloco-c-final.html` (FAQ com R01–R10 +
   topo da seção 10), fiel aos dumps a 1440px.
2. Criar `entregas/lp-black-scooto/blocos/bloco-c-pos-form.html` (CTA WhatsApp +
   selos + footer conforme contrato — sem CNPJ, links fechados).
3. Media queries mobile (~390px sem overflow) nos dois.
4. Rodar o VERIFY completo, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/blocos/bloco-c-final.html
- entregas/lp-black-scooto/blocos/bloco-c-pos-form.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-c-final.html; echo "exit=$?"` → `exit=0`
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/blocos/bloco-c-pos-form.html; echo "exit=$?"` → `exit=0`
- `grep -ci '<form' entregas/lp-black-scooto/blocos/bloco-c-final.html entregas/lp-black-scooto/blocos/bloco-c-pos-form.html` → 0 nos dois (form é widget nativo, track D)
- `grep -c '<details' entregas/lp-black-scooto/blocos/bloco-c-final.html` = 10 e `grep -c '<details open' entregas/lp-black-scooto/blocos/bloco-c-final.html` = 1 (FAQ completo, item 1 aberto)
- `grep -c 'CNPJ' entregas/lp-black-scooto/blocos/bloco-c-pos-form.html` = 0 (decisão do dono)
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5313 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5313/?bloco=bloco-c-final" 390 /tmp/lpb-c1-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5313/?bloco=bloco-c-pos-form" 390 /tmp/lpb-c2-390.png` → idem
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5313/?bloco=bloco-c-final" 1440 /tmp/lpb-c1-1440.png` e `… bloco-c-pos-form 1440 /tmp/lpb-c2-1440.png` → prints para o gate visual do assento
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só os 2 arquivos do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): bloco C — FAQ (10 respostas), moldura do form completo e footer` →
`git push -u origin track-lpb-bloco-final`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY (inclua os
caminhos dos PNGs gerados).
