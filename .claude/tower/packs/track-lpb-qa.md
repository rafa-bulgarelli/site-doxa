# LP Black Scooto — Track E: QA pixel/assets + guia de montagem (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-qa`,
branch **`track-lpb-qa`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-qa` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra** — esta track só nasce com TUDO mergeado:
```
test -f entregas/lp-black-scooto/blocos/bloco-a-topo.html && \
test -f entregas/lp-black-scooto/blocos/bloco-b-meio.html && \
test -f entregas/lp-black-scooto/blocos/bloco-c-final.html && \
test -f entregas/lp-black-scooto/form/form-mock.html
```
Se faltar qualquer um → **PARE e reporte**. Divergiu em qualquer item → PARE e reporte.

## A VISÃO DO DONO

"Pixel perfect" não é opinião: o dono quer abrir a página publicada ao lado do Figma e
não achar diferença. Esta track é a prova ANTES de publicar — compara o render dos
blocos com os PNGs do Figma, audita as imagens (peso, content-type, URL pública) e
escreve o guia único de montagem que o dono (ou quem tiver acesso ao wp-admin) segue
sem precisar perguntar nada.

## CONTEXTO (não perca tempo redescobrindo)

- Tudo já está em main: blocos em `entregas/lp-black-scooto/blocos/`, form em
  `form/`, referência visual em `figma/`, contrato em `contrato.md`, harness em
  `verify/servir.mjs` (porta fixa, monta a página completa em `GET /`, reescreve
  `RAW_PREFIX` → `/assets/`) e `verify/checar-bloco.mjs`.
- Decisões do GESTOR:
  - **Diff de pixel sem dependência nova**: capture screenshots via Chrome headless +
    DevTools Protocol (copie a abordagem de `.claude/tower/bin/mobile-shot.mjs` —
    WebSocket nativo do Node, zero deps) e compute o diff DENTRO do Chrome: carregue
    os dois PNGs como data URL numa página em branco, desenhe em `<canvas>`,
    `getImageData`, conte pixels divergentes (tolerância por canal ~8/255) e gere o
    PNG de diff pelo próprio canvas (`toDataURL`). Nada de pixelmatch/sharp —
    `package.json` é intocável.
  - Gate numérico: % de pixels divergentes por alvo; **falha dura se > 20%** (isso
    pega bloco montado errado/seção faltando; a fidelidade fina de verdade é o gate
    visual do assento com os PNGs de diff que você gera). Alturas Figma × render
    podem divergir — compare a região sobreposta e reporte o delta de altura.
  - Assets: cada imagem local ≤ 400 KB (raw.githubusercontent não tem CDN); se o repo
    público já existir (o assento publica em
    `https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/`),
    conferir por `HEAD`: status 200 + `content-type` de imagem para CADA URL da tabela
    *Imagens* do contrato.md; se ainda não existir, rode com `--local` e o script
    imprime `SKIP remoto` (o assento reroda sem a flag antes do VALIDAR-LIVE).
- Armadilhas:
  - Porta do seu preview é **5315** (fixa desta track). `servir.mjs` falha se ocupada —
    não troque de porta, mate o processo antigo.
  - Chrome em `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (mesmo
    caminho do mobile-shot).
  - Screenshot full-page de página alta: use `Page.captureScreenshot` com
    `captureBeyondViewport: true` e viewport 1440 — largura errada invalida o diff.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` nos `.mjs`.

## A TASK

1. `entregas/lp-black-scooto/verify/qa-pixel.mjs` — sobe nada (usa o `servir.mjs` que
   você inicia fora), recebe `--porta 5315`; captura a 1440px: página completa
   (`GET /`) e cada bloco (`/?bloco=…`); compara página completa vs
   `figma/frame-completo.png`; grava `qa/render-pagina-1440.png`,
   `qa/diff-pagina.png` e imprime tabela `{alvo, %divergente, alturaFigma,
   alturaRender}`; exit 1 se algum alvo > 20% ou se uma captura falhar.
2. `entregas/lp-black-scooto/verify/qa-assets.mjs` — audita a tabela *Imagens* do
   contrato.md: arquivo local existe, peso ≤ 400 KB, extensão×conteúdo coerentes;
   sem `--local`, faz `HEAD` em cada URL final (200 + content-type `image/*`);
   imprime tabela e exit 1 em qualquer violação.
3. `entregas/lp-black-scooto/MONTAGEM.md` — o guia único, na ordem de execução:
   pré-requisitos (Elementor Pro ativo, hook do Intercom já instalado — referência ao
   contrato, sem token); criar a página; colar bloco A, B, C (cada um num widget HTML,
   nessa ordem); inserir o widget Form onde o `contrato.md` § *Fatiamento* manda,
   seguindo `form/configuracao-form.md`; conferência final (checklist do critério de
   aceite do card 018: visual 1440, imagens raw, CTAs → form, submissão em
   Submissions, ticket no Intercom, mobile ~390, import da Sora).
4. Rodar o VERIFY completo (inclui os prints que vão para o gate do assento), gravar
   os artefatos em `qa/`, commit + push.

## SCOPE

- entregas/lp-black-scooto/verify/qa-pixel.mjs
- entregas/lp-black-scooto/verify/qa-assets.mjs
- entregas/lp-black-scooto/MONTAGEM.md
- entregas/lp-black-scooto/qa/**

## DEPENDS ON

Tracks A, B, C e D mergeadas em main (o STEP 0 confere). Roda DEPOIS da fila serial.

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros · `pnpm test` sem falha NOVA vs baseline do main ·
  `pnpm build` ok (prova final de que `entregas/**` não vaza no build do site)
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5315 &` + `sleep 1`, então:
  - `node entregas/lp-black-scooto/verify/qa-pixel.mjs --porta 5315; echo "exit=$?"` → `exit=0`, tabela impressa, `qa/diff-pagina.png` gerado
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5315/" 390 entregas/lp-black-scooto/qa/pagina-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []` (página COMPLETA, blocos+form juntos)
  - depois `kill %1`
- `node entregas/lp-black-scooto/verify/qa-assets.mjs --local; echo "exit=$?"` → `exit=0` (sem `--local` se o repo público já estiver no ar)
- `grep -icE 'bearer|authorization' entregas/lp-black-scooto/MONTAGEM.md` = 0
- `git diff --name-only origin/main...HEAD` ⊆ SCOPE

## COMMIT + PUSH

`feat(lp-black #018): QA pixel/assets + guia de montagem no Elementor` →
`git push -u origin track-lpb-qa`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY (tabelas do
qa-pixel e qa-assets incluídas).
