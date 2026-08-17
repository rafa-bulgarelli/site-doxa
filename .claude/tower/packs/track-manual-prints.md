# Manual com imagens reais — Track A: prints da plataforma nos caps 1 e 2 (task_manual_prints)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-prints origin/feat/manual-imagens`
e confirme: `ls public/manual/prints/*.avif | wc -l` = **5** (o prelude de assets já
está na base). `git status --porcelain` vazio · worktree, não o repo principal.
Qualquer divergência → **PARE e reporte** (não conserte por conta própria).

## A VISÃO DO DONO
O manual hoje ilustra os capítulos com desenhos animados. O dono quer a coisa REAL
junto: prints verdadeiros da plataforma no capítulo 1 (O onboarding) e no capítulo 2
(A sua voz) — legíveis, sem estourar o layout, funcionando no celular. A cena animada
FICA; o print entra como prova de como a plataforma é de verdade.

## CONTEXTO (não perca tempo redescobrindo)
- **Caps 1–3 são capítulos de LEITURA** (nenhuma regra obrigatória nos seeds v2/v3;
  conferido em `supabase/manual-seed-v2.sql` — todas `false`): quem os desenha é
  `TelaDeLeitura` em `src/manual/publico/Capitulo.tsx` (cena + cartões). O bloco de
  prints entra DEPOIS dos cartões, com um título discreto ("Na plataforma é assim",
  ou melhor que isso, escrito no tom do manual).
- **`Leitura` é compartilhada** por `Fluxo.tsx` (convidado) e `Previa.tsx` (admin):
  mexeu em `Capitulo.tsx`, os DOIS fluxos ganham juntos. O critério "convidado vê o
  mesmo" vem de graça — não crie nada no admin.
- **Slug-driven, arquivo novo**: `src/manual/publico/Prints.tsx` exporta o bloco com
  um mapa slug→figuras (onboarding: 3, voz: 2, demais slugs: nada — o bloco nem
  renderiza). Decisão do GESTOR: arquivo próprio mantém `Capitulo.tsx` enxuto e o
  escopo desta track disjunto da track B (que está em `cenas/`).
- **Os assets (já commitados pelo prelude — você NÃO cria nem edita asset):**
  - `/manual/prints/onboarding-scan.avif` — página "Doxa Scan (onboarding)": score
    46/100, aviso "não é preciso nota máxima", Alcance de topo de funil 4/10
  - `/manual/prints/onboarding-negocio.avif` — card "Sobre o negócio", análise 4/10
  - `/manual/prints/onboarding-autoridade.avif` — card "Autoridade e diferencial", 3/10
  - `/manual/prints/voz-minha-voz.avif` — tela "Minha Voz", 3 etapas (upload →
    treinamento → pronta)
  - `/manual/prints/voz-clone-de-voz.avif` — formulário "Clone de Voz Profissional"
- **Aqui a imagem NÃO é decorativa.** As cenas do manual são `aria-hidden`; um print
  carrega INFORMAÇÃO: use `<figure>` + `<figcaption>` e `alt` de verdade descrevendo
  o conteúdo (ex.: "Página do Doxa Scan com score 46 de 100…"). Olhe cada .avif
  (a tool Read renderiza imagem) antes de escrever o alt.
- **Sem pulo de layout**: `loading="lazy"`, `decoding="async"`, e `width`/`height`
  com os pixels REAIS do arquivo — leia com
  `sips -g pixelWidth -g pixelHeight public/manual/prints/<arquivo>.avif`.
- **Motion**: reuse `Entrada`/`Revelacao` de `./pecas` — nada de animação nova;
  `prefers-reduced-motion` já é respeitado pelas peças existentes.
- **Moldura**: a gramática do manual — `rounded-3xl border border-doxa-line
  bg-doxa-surface` (veja `CartaoDeLeitura` no próprio `Capitulo.tsx`).
- **i18n**: o manual é PT hard-coded (não há dicionário no módulo — decisão do
  GESTOR, conferida por grep). Legendas em PT como todo o resto.
- Armadilhas do repo: **pnpm**, não npm · `tailwind.config.js` e `index.css`
  INTOCÁVEIS · opacidade fora da escala de 5 só na forma `[0.78]` · classe nunca
  montada por template string · `noUnusedLocals`/`noUnusedParameters` reprovam sobra ·
  `.focus(` só com `{ preventScroll: true }` (não deve aparecer nesta track).
- **INTOCÁVEIS**: `tipos.ts`, `Rota.tsx`, `config.ts`, `App.tsx`,
  `src/manual/cenas/**` (a track B está lá), `src/manual/admin/**`,
  `src/manual/servidor/**`, `public/**` (assets são do prelude — faltou asset, PARE
  e reporte), `package.json`, `index.css`, `tailwind.config.js`.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga. Comentários em PT.

## A TASK
1. `src/manual/publico/Prints.tsx` — o mapa slug→figuras e o componente do bloco:
   título discreto, figuras empilhadas (uma coluna; são prints largos e a página é
   mobile-first), `<figcaption>` curto por print, `alt` descritivo real.
2. `src/manual/publico/Capitulo.tsx` — `TelaDeLeitura` renderiza o bloco depois dos
   cartões (import de `./Prints`). Nenhuma outra tela muda.
3. `src/manual/publico/telas.test.tsx` — capítulo `onboarding` renderiza 3 `<img>`
   com src `/manual/prints/onboarding-`; `voz` renderiza 2; os 5 com `alt` não-vazio;
   capítulo sem print (ex.: `clone`, `garantia`) NÃO renderiza o bloco.

## SCOPE
- src/manual/publico/Prints.tsx
- src/manual/publico/Capitulo.tsx
- src/manual/publico/telas.test.tsx

## DEPENDS ON
Prelude de assets commitado em `feat/manual-imagens` (o STEP 0 confirma os 5 .avif).
A track B (`track/manual-fotos-guia`) roda em paralelo em `src/manual/cenas/` —
integração no merge serial, não aqui.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline (main hoje: 320/320) e com os testes
  novos desta track inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-imagens...HEAD` = exatamente os 3 arquivos
  do SCOPE
- `git diff origin/feat/manual-imagens...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-imagens...HEAD | grep -n 'alt=""'` = vazio (todo print
  tem alt de verdade)
- `ls public/manual/prints/*.avif | wc -l` = 5 (você não criou nem apagou asset)

## COMMIT + PUSH
`feat(manual): prints reais da plataforma nos capítulos 1 e 2` →
`git push -u origin track/manual-prints`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + saída colada do VERIFY + branch + worktree.
Merge/deploy/LIVE são do GESTOR.
