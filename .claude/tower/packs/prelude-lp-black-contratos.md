# LP Black Scooto — PRELUDE P1: contrato + harness de verificação (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/prelude-lp-black-contratos`,
branch **`prelude-lp-black-contratos`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `prelude-lp-black-contratos` · `git status --porcelain`
vazio · você está na worktree, não no repo principal. **Guarda extra desta track:**
`test -f entregas/lp-black-scooto/figma/design-context.md` — se NÃO existir, sua branch
nasceu antes do prelude P0 entrar em main → **PARE e reporte**. Divergiu em qualquer
item → PARE e reporte.

## A VISÃO DO DONO

A LP do Figma vira blocos HTML colados em widgets do Elementor no WordPress da Scooto —
pixel perfect em desktop (~1440px), zero JavaScript, fonte Sora, imagens em
`raw.githubusercontent.com`, CTAs ancorando num formulário nativo do Elementor Pro que
o hook do Intercom capta. Esta track NÃO desenha nada: ela escreve o CONTRATO que as
quatro tracks paralelas vão obedecer e as FERRAMENTAS que provam que cada bloco está
certo.

## CONTEXTO (não perca tempo redescobrindo)

- Fonte da verdade visual (já em main, escrita pelo assento):
  `entregas/lp-black-scooto/figma/frame-completo.png` · `figma/secao-NN-*.png` ·
  `figma/design-context.md` (cores, tipografia, espaçamentos, textos literais) ·
  `assets/` (imagens de conteúdo exportadas).
- Decisões já tomadas pelo GESTOR (transcreva no contrato.md, não rediscuta):
  - Entrega = 3 widgets HTML empilhados (**bloco-a-topo**, **bloco-b-meio**,
    **bloco-c-final**) + **widget nativo Elementor Pro Form** estilizado por CSS
    (única arquitetura que o hook do Intercom capta — form HTML puro NÃO dispara).
  - Namespace CSS: todo seletor começa com **`.lpb-`** (o CSS precisa sobreviver ao
    tema/Elementor; seletor de tag nua é proibido). Única exceção global permitida:
    `html{scroll-behavior:smooth}` no bloco A.
  - Cada bloco é autocontido: `<style>` próprio + `@import` da fonte Sora próprio.
  - Âncora do form: o widget do form recebe CSS ID **`lpb-form`**; todo CTA é
    `href="#lpb-form"`.
  - Prefixo de imagem (default da pendência 3 do card, pode mudar por ordem do dono):
    `https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/`
    — constante única `RAW_PREFIX`, definida UMA vez em `servir.mjs` e citada no
    contrato.md.
  - Contrato do form (imposto pelo hook Intercom já instalado — transcreva SÓ isto,
    NUNCA nenhum script/token): custom IDs exatos `name` · `email` · `phone` ·
    `cargo` · `empresa` · `site`; `phone` aceita máscara (o hook limpa não-dígitos e
    prefixa `+55` — o campo NÃO deve pré-preencher código de país); UTMs vêm de
    cookies do PixelYourSite, nada a fazer além de não interferir; nome do form
    (pendência 5, default): **"Formulário LP Black"**.
- Armadilhas do repo que ESTA track pode pisar:
  - `entregas/**` está FORA do Tailwind (`tailwind.config.js` → content `./index.html`,
    `./src/**`), fora dos 3 `tsconfig` e fora do vite/prerender — mantenha assim: nada
    desta entrega importa/é importado por `src/**`.
  - Porta ocupada NÃO pode virar fallback silencioso (lição do `vite preview` no
    CLAUDE.md): `servir.mjs` deve FALHAR com erro claro se a porta estiver em uso,
    nunca escolher outra.
  - Sem dependência npm nova; `package.json` e configs são intocáveis (config
    protection). Scripts em Node puro (`node:http`, `node:fs`).
- **Estilo**: `.claude/STYLE-GOOGLE-TS.md` vale para os `.mjs` (nomes, comentários).

## A TASK

1. **`entregas/lp-black-scooto/contrato.md`** — o documento que as tracks A–D leem
   antes de qualquer linha. Seções obrigatórias:
   - **Fatiamento**: tabela seção-do-Figma → bloco (A/B/C), a partir dos
     `figma/secao-NN-*.png`. Corte em fronteiras visuais limpas; o form (widget
     nativo) fica ENTRE ou APÓS o bloco onde o Figma o desenha — anote onde.
   - **Tokens**: cores (hex), pesos/tamanhos Sora usados, espaçamentos-base, raios,
     sombras — extraídos de `figma/design-context.md`, com o snippet exato do
     `@import` do Google Fonts (só os pesos que o design usa).
   - **Imagens**: tabela asset → nome do arquivo em `assets/` → URL final
     (`RAW_PREFIX` + nome).
   - **Links permitidos**: `#lpb-form` (+ o que mais o Figma mostrar, se mostrar).
   - **Contrato do form** (transcrito do CONTEXTO acima, sem token).
   - **Regras dos blocos**: namespace `.lpb-`, autocontido, zero JS, mobile ~390 por
     media query própria (não há frame mobile; adaptação digna, sem fidelidade).
2. **`entregas/lp-black-scooto/verify/servir.mjs`** — servidor estático Node puro:
   - `node …/servir.mjs --porta NNNN`; porta ocupada = exit 1 com mensagem.
   - `GET /` → doctype + `<meta name="viewport" content="width=device-width, initial-scale=1">`
     + conteúdo de `blocos/*.html` em ordem alfabética + `form/form-mock.html` (se
     existir).
   - `GET /?bloco=<nome>` → só `blocos/<nome>.html` (ou `form/form-mock.html` para
     `form-mock`), no mesmo shell.
   - Ao servir, substitui `RAW_PREFIX` por `/assets/` (preview local funciona antes de
     o repo público existir; os blocos SEMPRE carregam a URL final).
   - `GET /assets/<arquivo>` → `entregas/lp-black-scooto/assets/<arquivo>` com
     content-type por extensão.
3. **`entregas/lp-black-scooto/verify/checar-bloco.mjs`** — gate estrutural,
   `node …/checar-bloco.mjs <arquivo.html> [--css <arquivo.css>]`, exit 0 só se TUDO
   passar, senão exit 1 listando cada falha com linha:
   - zero `<script`, zero atributo `on<evento>=`, zero `javascript:` (case-insensitive);
   - todo `src=` de `<img`/`<source` começa com `RAW_PREFIX`;
   - `<style>` presente; todo seletor começa com `.lpb-` (ignora `@import`/`@media`/
     `@font-face`; permite `html{scroll-behavior:smooth}` SÓ quando o arquivo é
     `bloco-a-topo.html`); com `--css`, o prefixo exigido no arquivo CSS é
     `.lpb-form-widget`;
   - `@import` com `fonts.googleapis.com/css2?family=Sora` presente (no HTML);
   - todo `href=` de `<a` está na lista "Links permitidos" do contrato.md;
   - grep de segredo: `bearer|authorization` (case-insensitive) = vazio.
4. **Fixtures de autoteste**: `verify/fixtures/ok.html` (mínimo que passa tudo) e
   `verify/fixtures/ruim.html` (viola várias regras — script inline, img fora do
   RAW_PREFIX, seletor sem prefixo).
5. Rodar o VERIFY, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/contrato.md
- entregas/lp-black-scooto/verify/servir.mjs
- entregas/lp-black-scooto/verify/checar-bloco.mjs
- entregas/lp-black-scooto/verify/fixtures/ok.html
- entregas/lp-black-scooto/verify/fixtures/ruim.html

## DEPENDS ON

Prelude P0 (`prelude-lp-black-figma`) mergeado em main — o STEP 0 confere.

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros (prova de que a entrega não vazou para o tsc)
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/verify/fixtures/ok.html; echo "exit=$?"` → `exit=0`
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/verify/fixtures/ruim.html; echo "exit=$?"` → `exit=1` e ≥ 3 falhas listadas
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5310 &` + `sleep 1` +
  `curl -sf "http://localhost:5310/?bloco=../../etc/passwd" -o /dev/null; echo "exit=$?"` → exit ≠ 0 (path traversal recusado) +
  `curl -s http://localhost:5310/ | grep -c viewport` → ≥ 1 — depois `kill %1`
- `grep -c 'name\|email\|phone\|cargo\|empresa\|site' entregas/lp-black-scooto/contrato.md` ≥ 6 e
  `grep -icE 'bearer|authorization' entregas/lp-black-scooto/contrato.md` = 0
- `git diff --name-only origin/main...HEAD` ⊆ SCOPE

## COMMIT + PUSH

`feat(lp-black #018): contrato do fatiamento + harness de verificação (servir/checar)` →
`git push -u origin prelude-lp-black-contratos`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
