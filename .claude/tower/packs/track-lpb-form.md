# LP Black Scooto — Track D: os DOIS forms Elementor Pro (CSS + spec + mocks) (card 018)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-lpb-form`,
branch **`track-lpb-form`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)

`git branch --show-current` = `track-lpb-form` · `git status --porcelain` vazio ·
worktree, não repo principal. **Guarda extra:**
`test -f entregas/lp-black-scooto/contrato.md && test -f entregas/lp-black-scooto/verify/servir.mjs`
— se faltar, a branch nasceu antes do prelude entrar em main → **PARE e reporte**.

## A VISÃO DO DONO

A LP tem DOIS formulários, e os dois são reais (decisão do dono após o P0): o
**mini-form do hero** (Nome, E-mail corporativo, anti-spam "Quanto é 5 + 7?", botão
"Quero avaliar minha operação") e o **form completo** da seção "Solicite o seu
orçamento" (6 campos, botão "Enviar"). Quem envia qualquer um dos dois vê confirmação
na tela, a submissão aparece em wp-admin → Elementor → Submissions com o nome do form,
e o hook do Intercom cria contato + ticket. Os dois têm que PARECER o Figma — por
baixo, são widgets nativos do Elementor Pro, porque é o único que o hook capta.

## CONTEXTO (não perca tempo redescobrindo)

- **Leia PRIMEIRO** `entregas/lp-black-scooto/contrato.md` — *Contrato dos DOIS
  forms*, *Montagem do hero*, *Tokens*, *Fatiamento*. Referência visual: seções 01
  (card do hero) e 10 (card do form completo) de `figma/design-context.md` — o dump
  da seção 10 traz medidas exatas de campos, labels, botão e nota — e os PNGs
  `figma/secao-01-hero.png` / `figma/secao-10-formulario-completo.png`.
- **Contrato imposto pelo hook do Intercom** (já no contrato.md; NUNCA transcreva
  script ou token): dispara para QUALQUER Elementor Pro Form; custom IDs `name` ·
  `email` · `phone` · `cargo` · `empresa` · `site`; `phone` com máscara ok (o hook
  limpa não-dígitos e prefixa `+55` — sem código de país no campo); UTMs via cookies
  do PixelYourSite — não interferir. No form do hero, os IDs ausentes vão vazios
  para o hook — comportamento aceito pelo dono.
- Decisões do GESTOR:
  - **Form completo — "Formulário LP Black"**: 6 campos na ordem visual do Figma
    (Seu Nome→`name`, E-mail→`email`, [Cargo→`cargo` | Nome da Empresa→`empresa`]
    lado a lado 50%, [Site→`site` | WhatsApp→`phone`] idem; placeholder do WhatsApp
    "(XX) XXXXX-XXXX"), botão "Enviar". Advanced → CSS ID **`lpb-form`** (âncora dos
    CTAs) + CSS Class **`lpb-form-widget`**. A nota "Seus dados ficam com a gente…"
    entra como campo HTML do próprio form (ou logo abaixo, na montagem) — decida e
    documente.
  - **Form hero — "Formulário LP Black Hero"**: campos Nome→`name`, E-mail
    corporativo→`email`, anti-spam "Quanto é 5 + 7?" (campo number/text do Elementor
    com Custom ID **`quiz`** — NUNCA um dos 6 reservados), botão "Quero avaliar
    minha operação". SEM CSS ID (a âncora `#lpb-form` é exclusiva do completo);
    CSS Class **`lpb-form-widget lpb-form-widget--hero`**. Limitação a documentar:
    o Elementor não valida o VALOR da resposta sem JS — o campo é obrigatório, mas
    qualquer número passa; registre isso no spec (o dono sabe o trade-off de zero
    JS).
  - Ambos: Actions After Submit = **Collect Submissions** (mínimo obrigatório) +
    mensagem de sucesso visível na tela.
  - `form.css`: base `.lpb-form-widget` (estiliza o DOM que o Elementor gera:
    `.elementor-form`, `.elementor-field-group`, `.elementor-field`,
    `.elementor-button`, `.elementor-message`) + variante `.lpb-form-widget--hero`
    (diferenças do card do hero). Todo seletor com prefixo `.lpb-` (regra do
    `checar-bloco.mjs --css`); nada de tag nua. O card do hero em si
    (`.lpb-hero-card`: moldura gradiente, badge, título) é da track A — você
    estiliza os CAMPOS/botão/mensagens dentro dele.
  - Mocks: `form-mock.html` e `form-mock-hero.html` replicam o DOM que o Elementor
    Pro gera (mesmas classes), com o CSS embutido em `<style>` (duplicado do
    `form.css` — anote em comentário no topo que o canônico é o `.css` e que o mock
    NÃO vai para o WordPress). O `servir.mjs` os injeta no preview: o mock do hero
    dentro do scaffold `?bloco=hero`, o completo entre `bloco-c-final` e
    `bloco-c-pos-form`.
- Armadilhas:
  - Especificidade: o CSS do Elementor vem forte; vença com seletor composto
    (`.lpb-form-widget .elementor-field`) e só use `!important` onde comprovadamente
    necessário — comente o porquê.
  - Porta do seu preview é **5314** (fixa). `servir.mjs` falha se ocupada — não
    troque de porta, mate o processo antigo.
  - Nada de dependência nova, nada em `src/**`, `package.json` ou configs.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md` no que se aplicar.

## A TASK

1. `entregas/lp-black-scooto/form/configuracao-form.md` — passo a passo NO
   ELEMENTOR, reproduzível por quem nunca viu o projeto, cobrindo OS DOIS forms
   (um capítulo cada): nome do form; tabela de campos com rótulo, tipo
   (`text`/`email`/`tel`/`url`/`number`), obrigatoriedade, largura (%) e a célula
   literal `Custom ID: <id>` por linha (o VERIFY greppa este formato); placeholder
   do phone sem `+55`; Actions After Submit; mensagem de sucesso; Advanced → CSS
   ID/Classes conforme CONTEXTO; onde colar o `form.css`; a limitação do anti-spam.
2. `entregas/lp-black-scooto/form/form.css` — os dois forms idênticos ao Figma
   (campos, labels, foco, botões com estados, erro/sucesso, desktop e mobile ~390).
3. `entregas/lp-black-scooto/form/form-mock.html` e
   `entregas/lp-black-scooto/form/form-mock-hero.html` — DOM fiel ao Elementor,
   wrappers com as classes reais dos widgets.
4. Rodar o VERIFY, colar a saída, commit + push.

## SCOPE

- entregas/lp-black-scooto/form/configuracao-form.md
- entregas/lp-black-scooto/form/form.css
- entregas/lp-black-scooto/form/form-mock.html
- entregas/lp-black-scooto/form/form-mock-hero.html

## DEPENDS ON

Preludes P0 + P1 mergeados em main (o STEP 0 confere).

## VERIFY (pass/fail executável — cole a saída no report)

- `pnpm typecheck` = 0 erros
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/form/form-mock.html --css entregas/lp-black-scooto/form/form.css; echo "exit=$?"` → `exit=0`
- `node entregas/lp-black-scooto/verify/checar-bloco.mjs entregas/lp-black-scooto/form/form-mock-hero.html; echo "exit=$?"` → `exit=0`
- `for id in name email phone cargo empresa site; do grep -q "Custom ID: $id" entregas/lp-black-scooto/form/configuracao-form.md || echo "FALTA custom ID: $id"; done` → nenhuma linha "FALTA"
- `grep -c "Custom ID: name" entregas/lp-black-scooto/form/configuracao-form.md` = 2 e `grep -c "Custom ID: email" entregas/lp-black-scooto/form/configuracao-form.md` = 2 (hero + completo) · `grep -c "Custom ID: quiz" entregas/lp-black-scooto/form/configuracao-form.md` = 1
- `grep -c 'Formulário LP Black' entregas/lp-black-scooto/form/configuracao-form.md` ≥ 2 e `grep -c 'Formulário LP Black Hero' entregas/lp-black-scooto/form/configuracao-form.md` ≥ 1 e `grep -c 'lpb-form-widget--hero' entregas/lp-black-scooto/form/configuracao-form.md` ≥ 1
- `grep -inE 'bearer|authorization' entregas/lp-black-scooto/form/*` = vazio
- `node entregas/lp-black-scooto/verify/servir.mjs --porta 5314 &` + `sleep 1`, então:
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5314/?bloco=form-mock" 390 /tmp/lpb-form-390.png` → `scrollWidth` == `clientWidth` e `overflowing: []`
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5314/?bloco=form-mock-hero" 390 /tmp/lpb-formhero-390.png` → idem
  - `node .claude/tower/bin/mobile-shot.mjs "http://localhost:5314/?bloco=form-mock" 1440 /tmp/lpb-form-1440.png` e `… form-mock-hero 1440 /tmp/lpb-formhero-1440.png` → prints para o gate visual do assento
  - depois `kill %1`
- `git diff --name-only origin/main...HEAD` = só os 4 arquivos do SCOPE

## COMMIT + PUSH

`feat(lp-black #018): forms Elementor Pro (hero + completo) — spec, CSS fiel ao Figma, mocks de QA` →
`git push -u origin track-lpb-form`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída colada do VERIFY.
