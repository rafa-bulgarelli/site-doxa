# LP Black Scooto — Track D: formulário Elementor Pro (CSS + spec + mock) (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-form`,
branch **`track-lpb-form`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-form` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

Quem preenche o formulário da LP (nome, e-mail, WhatsApp, cargo, empresa, site) e envia
vê a confirmação na tela, a submissão aparece em wp-admin → Elementor → Submissions, e o
hook do Intercom já instalado no site cria contato + ticket. O formulário tem que
PARECER o do Figma — mas por baixo é o widget nativo do Elementor Pro, porque é o único
que o hook capta.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — seções *Contrato do form*
  (IDs, máscara do phone, nome do form), *Tokens* (cores/fontes do Figma) e
  *Fatiamento* (onde o form entra na página). A referência visual do form está nos
  `figma/secao-NN-*.png` correspondentes e em `figma/design-context.md`.
- **Contrato imposto pelo hook do Intercom** (já no contrato.md; NUNCA transcreva
  script ou token — só isto): dispara apenas para formulário do **Elementor Pro**;
  custom IDs exatos `name` · `email` · `phone` · `cargo` · `empresa` · `site`;
  `phone` pode ter máscara (o hook limpa não-dígitos e prefixa `+55` — o campo NÃO
  deve embutir código de país); UTMs vêm de cookies do PixelYourSite — não interferir;
  nome do form: **"Formulário LP Black"** (default do GESTOR, pendência 5 do card).
- Decisões do GESTOR:
  - O widget do form recebe, no Elementor: **CSS ID `lpb-form`** (âncora dos CTAs) e
    **CSS Class `lpb-form-widget`** (escopo do seu CSS).
  - `form.css` é para colar em Advanced → Custom CSS do widget (ou no CSS global do
    site): **todo seletor começa com `.lpb-form-widget`** — ele estiliza o DOM que o
    Elementor gera (`.elementor-form`, `.elementor-field-group`, `.elementor-field`,
    `.elementor-button`, `.elementor-message`), nunca tags nuas.
  - `form-mock.html` replica o DOM que o Elementor Pro gera (mesmas classes) SÓ para o
    preview/QA local — ele NÃO vai para o WordPress. Deixe isso escrito no topo do
    arquivo, em comentário HTML.
  - Zero JavaScript em tudo desta entrega.
- Armadilhas:
  - Especificidade: o CSS do Elementor vem com seletores fortes; vença com o prefixo
    `.lpb-form-widget` composto (ex.: `.lpb-form-widget .elementor-field`) e só use
    `!important` onde comprovadamente necessário — anote o porquê num comentário.
  - Porta do seu preview é **5314** (fixa desta track). `servir.mjs` falha se ocupada —
    não troque de porta, mate o processo antigo.
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar.

## A TASK

1. `entregas/lp-black-scooto/form/configuracao-form.md` — passo a passo NO ELEMENTOR,
   reproduzível por quem nunca viu o projeto: criar o widget Form; nome do form
   **"Formulário LP Black"**; os 6 campos NA ORDEM do Figma com rótulo visível,
   `required`, tipo (`text`/`email`/`tel`/`url`) e **Custom ID exato** — uma tabela
   em que cada linha traz a célula literal `Custom ID: name`, `Custom ID: email`,
   `Custom ID: phone`, `Custom ID: cargo`, `Custom ID: empresa`, `Custom ID: site`
   (o VERIFY greppa exatamente este formato); placeholder do phone
   no formato `(11) 91234-5678`, sem `+55`; Actions After Submit = **Collect
   Submissions** (mínimo obrigatório); mensagem de sucesso visível na tela (texto
   conforme Figma/contrato); Advanced → CSS ID `lpb-form` + CSS Class
   `lpb-form-widget`; onde colar o `form.css`.
2. `entregas/lp-black-scooto/form/form.css` — o form idêntico ao Figma: campos,
   rótulos, foco, botão de envio (estados hover/disabled), mensagens de erro e de
   sucesso, layout desktop e mobile (~390px). Todo seletor com `.lpb-form-widget`.
3. `entregas/lp-black-scooto/form/form-mock.html` — DOM fiel ao que o Elementor gera,
   com a classe `lpb-form-widget` no wrapper e o `form.css` embutido em `<style>`
   (duplicado do arquivo 2 — anote no comentário do topo que o canônico é o `.css`),
   para o `servir.mjs` renderizar no preview.
4. Rodar o VERIFY, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/form/configuracao-form.md
- entregas/lp-black-scooto/form/form.css
- entregas/lp-black-scooto/form/form-mock.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/form/form-mock.html --css entregas/lp-black-scooto/form/form.css; echo "exit=$?"` → `exit=0`
- `for id in name email phone cargo empresa site; do grep -q "Custom ID: $id" entregas/lp-black-scooto/form/configuracao-form.md || echo "FALTA custom ID: $id"; done` → nenhuma linha "FALTA"
- `grep -c 'Formulário LP Black' entregas/lp-black-scooto/form/configuracao-form.md` ≥ 1 e `grep -c 'lpb-form' entregas/lp-black-scooto/form/configuracao-form.md` ≥ 2 (CSS ID + classe)
- `grep -inE 'bearer|authorization' entregas/lp-black-scooto/form/*` = vazio
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5314 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5314/?bloco=form-mock" 390 /tmp/lpb-form-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5314/?bloco=form-mock" 1440 /tmp/lpb-form-1440.png` → print gerado (gate visual do assento)
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só os 3 arquivos do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): form Elementor Pro — spec de configuração, CSS fiel ao Figma, mock de QA` →
`git push -u origin track-lpb-form`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
