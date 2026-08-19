# Landing — a porta da biblioteca e o #faq que chega (track-landing-porta-faq)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · `git fetch origin && git checkout -B track-landing-porta-faq origin/main` ·
`pnpm install --frozen-lockfile`. Leia antes: `CLAUDE.md` (Fatos do repo — armadilhas da
landing: `focus()` na montagem rola a página; `#forms` mora num elemento sem transform;
`--window-size` do Chrome mente; preview em porta ocupada), `src/ancoras.ts`,
`src/components/Rodape.tsx` (linhas ~400–456 e o comentário sobre `nowrap`),
`src/components/rodape/config.ts` (ATALHOS_PT/EN), `src/App.tsx` (bloco `#forms`,
~300–360), `src/fragmento.ts` + `.test.ts`, `.claude/STYLE-GOOGLE-TS.md`.

## A VISÃO DO DONO
A home é a página mais forte do site e não aponta para a biblioteca. E o rodapé de
toda página SEO diz "Perguntas" → `/#faq`, que hoje abre no topo da home. Duas
mudanças pequenas e cirúrgicas na landing (§68: mudança incremental, cada linha
justificada), nada de redesign.

## CONTEXTO
- Rodapé (`Rodape.tsx` ~430–452): uma linha `wordmark | nav(Perguntas · Falar com a gente) | © ANO Doxa`,
  tudo `nowrap`, fonte fluida `min(3.1vw,13px)` até ~420px. A 320px a linha tem ZERO
  folga (medido: 280/280) — "Guias" (+37px) estoura o copyright. O comentário diz que
  a quebra que o dono NÃO quer é "Falar com a gente" partido no meio. **Uma linha de
  flex quebrando em duas linhas inteiras não é isso.**
- `#forms`: `fragmento.ts` `deveManterFragmento` só deixa `HREF_FORMS` sobreviver ao
  boot; `App.tsx` na montagem, se `hash === HREF_FORMS`, faz `Promise.allSettled` dos
  imports das três seções acima do alvo e `rolarQuandoChegar(60)` (poll por quadro
  até `document.getElementById(ANCORA_FORMS)`).
- `Faq` é `lazy` (`App.tsx:37`); a seção FAQ fica ABAIXO da comparação (ordem: Hero,
  HowItWorks, ProofWall, Comparacao, Faq, Rodape — confira no JSX).
- `ancoras.ts` tem `ANCORA_FAQ`/`HREF_FAQ`.

## A TASK
1. **Porta no rodapé** — `src/components/rodape/config.ts`: `ATALHOS_PT` ganha
   `{ rotulo: 'Guias', destino: '/guias' }` como PRIMEIRO item (e `ATALHOS_EN` `'Guides'`
   → `/guias` — a biblioteca é só PT; decida se o EN mostra ou não e diga; default:
   mostra, é o mesmo destino). `destino` é rota, não âncora — se o tipo/comentário de
   `config.ts` disser "destinos vêm de ancoras.ts", ajuste o comentário (não o tipo).
   `src/components/Rodape.tsx`: abaixo de `sm`, o container da linha passa a
   `flex-wrap` com a `nav` em `basis-full order-last` (ou `w-full`), de modo que a
   linha vira DUAS: `wordmark … © ANO Doxa` em cima e a nav inteira embaixo
   (`justify-start` ou `justify-between` — escolha o que fica mais coerente com o
   resto do rodapé e descreva). Os links continuam `whitespace-nowrap` cada um (nada
   parte no meio). De `sm:` para cima: **idêntico ao de hoje** (uma linha, 3 links).
   Comentário do porquê no lugar do antigo (que fala só da linha única). Mudança
   mínima: nada de cor, tamanho, animação.
2. **`#faq` com o mesmo seguro do `#forms`** — `src/fragmento.ts`: `deveManterFragmento`
   passa a deixar sobreviver `HREF_FORMS` **e** `HREF_FAQ` (matriz: `navigate`/`prerender`
   com um dos dois → true; `reload`/`back_forward`/`undefined` → false; qualquer outro
   hash → false). `fragmento.test.ts`: casos `(navigate, '#faq')` → true,
   `(reload, '#faq')` → false, `(navigate, '#outro')` → false. `src/App.tsx`: o bloco
   da chegada vira genérico para os DOIS alvos — `rolarQuandoChegar` recebe o id do
   alvo (`ANCORA_FORMS` | `ANCORA_FAQ`); na chegada com `#faq`, `Promise.allSettled`
   dos imports de TODAS as seções acima do FAQ (`HowItWorks`, `ProofWall`, `Comparacao`,
   `Faq`) e depois rola até `ANCORA_FAQ`. O clique em `a[href="#forms"]` continua igual
   (se quiser estender o mesmo seguro ao clique em `#faq`, pode — diga). Diff de
   `App.tsx` ≤ 40 linhas; cada linha justificada em comentário; NENHUM `focus()`.
   Comentário do `main.tsx` NÃO precisa mudar (ele já diz que quem decide é
   `fragmento.ts`) — confira; se o texto dele ficar falso, ajuste só o comentário
   (`main.tsx` entra no SCOPE só para isso).
3. Prova: `pnpm build`; `pnpm preview --port 5441 --strictPort`; confira o hash do
   bundle servido vs `dist/index.html`;
   `node .claude/tower/bin/mobile-shot.mjs http://localhost:5441/ 320 <print>` e `390` →
   `scrollWidth == clientWidth`; print do rodapé a 320 descrito (duas linhas, "Falar
   com a gente" inteiro, "Guias" visível); print a 1280 do rodapé = uma linha com 3
   links. CDP (há um script em
   `/tmp/claude-501/-Users-rafaelfernandes-orca-projects-site-doxa/3d8c43a4-450b-40d7-a509-c438ec9b2133/scratchpad/forms-prod.mjs`
   — adapte para `#faq`, localhost e `ANCORA_FAQ`): `/#faq` → hash mantido, topo de `#faq`
   ≈ 0 após ~9 s; `/#forms` → continua (topo ≈ 0); `/` → scrollY 0. Feche o preview.

## SCOPE
- src/components/Rodape.tsx
- src/components/rodape/config.ts
- src/App.tsx
- src/main.tsx
- src/fragmento.ts
- src/fragmento.test.ts
(INTOCÁVEIS: `src/ancoras.ts`, `index.html`, `tailwind.config.js`, `src/seo/**`,
`src/components/**` fora dos dois acima. Precisou → PARE e reporte.)

## DEPENDS ON
`origin/main` @ `5b8bd73`+.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 · `pnpm test` verde (29 arquivos; `fragmento.test.ts` com os casos novos) · `pnpm build` ok (68 rotas)
- `grep -c "destino: '/guias'" src/components/rodape/config.ts` = 2 (PT e EN) — ou 1 se decidiu EN sem
- `git diff origin/main...HEAD -- src/App.tsx | grep -c '^[+-][^+-]'` ≤ 40 · `grep -c "focus(" <(git diff origin/main...HEAD)` = 0
- mobile-shot 320 e 390 da home: `scrollWidth == clientWidth`; a nav do rodapé inteira na tela (cole o `overflowing` = `[]`)
- CDP: `/#faq` hash `#faq`, `faqTop` ≈ 0 (|faqTop| ≤ 2); `/#forms` `formsTop` ≈ 0; `/` scrollY 0 — cole os 3 JSONs
- `git diff --name-only origin/main...HEAD | grep -vE '^src/(components/Rodape\.tsx|components/rodape/config\.ts|App\.tsx|main\.tsx|fragmento\.ts|fragmento\.test\.ts)$'` = vazio
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
Um commit por item (rodapé · fragmento/App) → `git push -u origin track-landing-porta-faq`. **NÃO mergeie.**
Report: diff de `App.tsx` e `fragmento.ts` colado inteiro, prints descritos, saída do VERIFY, verdict READY/NOT READY.
