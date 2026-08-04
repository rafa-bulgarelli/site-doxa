# Doxa — Track A: design tokens + componentes base (task_track-design-tokens)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-design-tokens`,
branch **`track-design-tokens`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-design-tokens` · `git status --porcelain` vazio ·
você está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
Quero um sistema de design de primeira classe, não um enfeite depois do fato: fundo preto
profundo, texto branco, e a única variação de "cor" é a escala de cinza usada como
iluminação (glow, vinheta, borda que capta luz) — zero cor cromática na UI. A tipografia
de texto é serifada, editorial, com o caráter denso da Plantin (a fonte que eu amo é a
Francisco Serial, um clone da Plantin, mas não posso publicar o `.ttf` dela — uso uma
substituta de licença aberta por enquanto, trocável depois numa linha só). E quero que
"UI e UX impecáveis" seja levado a sério: contraste de verdade, foco visível pra quem
navega por teclado, e respeito a quem pediu menos animação no sistema.

## CONTEXTO
- **Card:** `.claude/tower/cards/002-design-system-doxa-segmentacao-home.md`.
- **O que já existe (criado pelo prelude, merged em main antes desta track começar):**
  `app/globals.css` (só diretivas Tailwind, sem tokens), `app/layout.tsx` (bare,
  `{children}`, sem fonte aplicada), `components/ui/PlaceholderNote.tsx` (não é seu
  escopo). As dependências `@fontsource-variable/newsreader` e `vitest`/RTL já estão
  instaladas em `package.json` — **você não roda `pnpm add`**, essa track não toca
  `package.json`/`pnpm-lock.yaml` (decisão do GESTOR: mantém paralelismo real com a track
  de vetorização do logo, que roda ao mesmo tempo que esta).
- **Onde os tokens vivem:** confirme em `CLAUDE.md` → "Fatos do repo" → Stack o que o
  prelude registrou. Este pack assume **Tailwind v4 CSS-first**: os tokens de tema vivem
  num bloco `@theme` dentro de `app/globals.css`, sem `tailwind.config.ts`. Se o CLAUDE.md
  registrar que saiu Tailwind v3 (com `tailwind.config.ts` gerado), os tokens de cor/fonte
  vão em `theme.extend` desse arquivo em vez do `@theme` — mesmo espírito, arquivo
  diferente; registre a mudança no report. Se a divergência for grande o bastante para
  parecer um SCOPE diferente do listado abaixo, **PARE e reporte** antes de prosseguir.
- **Referências visuais do dono** (já lidas pelo GESTOR, resumo — não é conteúdo a
  extrair de novo): `21st.dev` — dark denso, hierarquia tipográfica grande, grid com
  bordas finas de baixo contraste, prova social por número grande. Essa é a referência
  mais próxima do alvo; use como bússola de "peso" visual (não copie layout, ainda não há
  conteúdo pra isso — esta track é só tokens + primitivos).
- **Decisão de fonte do GESTOR:** **Newsreader** (variable, SIL OFL) — família editorial,
  contraste moderado, eixo óptico (`opsz`), mais perto do caráter denso/transicional da
  Plantin do que uma sans. Alternativa registrada (Source Serif 4) fica como plano B se o
  dono não gostar depois de ver renderizado — a troca é uma linha em `lib/fonts.ts`.
- **Armadilhas do repo (só as que ESTA track pode pisar):**
  - `.gitignore` bloqueia `*.ttf`/`*.otf`/`Francisco*` — você só commita `.woff2`. Se
    algum arquivo `.ttf` aparecer no seu `git status`, é sinal de que copiou a pasta
    errada do `node_modules` — apague e refaça.
  - A licença SIL OFL exige que o texto da licença acompanhe a fonte redistribuída — não
    pule a cópia do arquivo de licença (task 2).
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga.

## A TASK
1. **Fonte (arquivos estáticos):** rode
   `ls node_modules/@fontsource-variable/newsreader/files/` e identifique os dois
   arquivos do subset `latin` (peso variável, um normal e um itálico — nome típico
   `newsreader-latin-wght-normal.woff2` / `newsreader-latin-wght-italic.woff2`; confirme
   o nome real listado, pode variar por versão). Copie os dois para
   `public/fonts/newsreader-variable.woff2` e
   `public/fonts/newsreader-variable-italic.woff2`. Copie o arquivo de licença do pacote
   (`LICENSE` ou `OFL.txt` dentro de `node_modules/@fontsource-variable/newsreader/`)
   para `public/fonts/OFL.txt`.
2. **`lib/fonts.ts`:** use `next/font/local` para declarar a família a partir dos dois
   arquivos copiados, com `weight: "200 800"` em cada (`normal`/`italic`) e
   `variable: "--font-serif"` — esse nome de variável CSS **é o token único e trocável**
   que o critério de aceite pede. Exporte a constante (ex. `export const fontSerif = …`).
   Comente no topo do arquivo: `// Token trocável: para usar a Francisco Serial (licença
   comprada) no lugar da Newsreader, troque só o "src" abaixo.`
3. **`app/globals.css`:** dentro do bloco de tema (`@theme` em v4 — ver CONTEXTO acima),
   declare:
   - escala de cinza P&B (`--color-bg`, `--color-fg`, e uma escala `--color-gray-100`
     até `--color-gray-900` ou equivalente) — fundo preto profundo, texto branco, sem
     nenhuma cor cromática (nenhum token com matiz — só preto/branco/cinza).
   - `--font-serif: var(--font-serif);` (ponte para o CSS var que o `next/font/local`
     aplica via `className`/`variable` no elemento raiz — a track do Hero é quem aplica
     essa classe no `<html>`/`<body>`; aqui você só declara o token do lado do Tailwind).
   - utilitário(s) de "iluminação": um gradiente radial em tons de cinza (ex. classe
     `.glow-radial` ou token `--gradient-glow`) para ser usado como destaque decorativo —
     não crie o componente que o usa ainda, isso é da track do Hero.
   Fora do bloco de tema, no CSS global:
   - `body { background-color: var(--color-bg); color: var(--color-fg); }` — dark por
     padrão, sem toggle de tema claro (não existe neste ciclo).
   - anel de foco visível e consistente: defina o estilo de `:focus-visible` (outline
     claro, alto contraste sobre fundo escuro, `outline-offset`) como token reutilizável.
   - bloco `@media (prefers-reduced-motion: reduce)` reduzindo/zerando duração de
     animação e transição globalmente.
4. **`components/ui/Button.tsx`:** primitivo com variantes `primary`/`secondary` via prop,
   renderiza `<button>` ou `<a>` conforme receber `href`. Usa só tokens P&B/cinza (sem
   cor cromática). Estado `:focus-visible` obrigatório e visível (usa o token da task 3).
   Teste `Button.test.tsx`: renderiza como botão por padrão, renderiza como link quando
   `href` é passado, texto/aria essencial presente, classe de foco presente no markup.
5. **`components/ui/Container.tsx`:** max-width + padding horizontal responsivo.
   Teste de smoke (`Container.test.tsx`): renderiza `children`.
6. **`components/ui/Section.tsx`:** espaçamento vertical consistente entre seções de
   página. Teste de smoke (`Section.test.tsx`): renderiza `children`.
7. Não crie `tailwind.config.ts` se o repo já estiver em v4 (ver CONTEXTO). Não toque
   `package.json`/`pnpm-lock.yaml` — as dependências já foram instaladas pelo prelude.

## SCOPE
- app/globals.css
- lib/fonts.ts
- public/fonts/newsreader-variable.woff2
- public/fonts/newsreader-variable-italic.woff2
- public/fonts/OFL.txt
- components/ui/Button.tsx
- components/ui/Button.test.tsx
- components/ui/Container.tsx
- components/ui/Container.test.tsx
- components/ui/Section.tsx
- components/ui/Section.test.tsx

## DEPENDS ON
`prelude-scaffold-doxa` (precisa estar em `main`). Roda **em paralelo** com
`track-logo-vetor` — arquivos disjuntos, confira: aquela track toca `brand/*`,
`app/icon.svg`, `scripts/vectorize-logo.mjs` e `components/ui/Logo.tsx` — nenhum desses é
tocado por esta track.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (Button/Container/Section `.test.tsx` inclusos)
- `pnpm build` conclui sem erro
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/main...HEAD --stat -- package.json pnpm-lock.yaml` = vazio (não tocou
  esses dois arquivos)
- `git ls-files | grep -E "\.(ttf|otf)$"` = vazio (nenhuma fonte de licença restrita
  commitada)
- `file public/fonts/*.woff2` reporta "Web Open Font Format" para os dois arquivos (não
  estão vazios/corrompidos)
- `grep -q "OFL" public/fonts/OFL.txt` confirma a licença presente
- **Monocromia (pass/fail, cole a saída):** rode o bloco abaixo. Ele extrai todo hex do
  CSS e falha em qualquer cor onde R, G e B não sejam iguais — `#1a1a1a` passa,
  `#1a1a2e` (matiz azul disfarçado) falha. Não use `grep -E` com backreference (`\1`)
  para isso: o grep do macOS é BSD e não a suporta, o que dá "vazio" falso.
  ```bash
  python3 - <<'PY'
  import re, sys
  css = open('app/globals.css').read()
  bad = []
  for h in re.findall(r'#([0-9a-fA-F]{3,8})\b', css):
      if len(h) in (3, 4):
          h = ''.join(c * 2 for c in h)
      r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
      if not r == g == b:
          bad.append(f'#{h} -> r={r} g={g} b={b}')
  print('\n'.join(bad) if bad else 'OK: todos os hex sao cinza puro (R=G=B)')
  sys.exit(1 if bad else 0)
  PY
  ```
- **Manual (colar no report):** abra `pnpm dev`, uma página qualquer com o `Button`
  renderizado, navegue até ele só com Tab — confirme visualmente o anel de foco aparece;
  ative "reduzir movimento" no SO e confirme que não há animação abrupta.

## COMMIT + PUSH
`feat(design-system): tokens P&B/cinza, tipografia Newsreader self-hosted, primitivos ui` →
`git push -u origin track-design-tokens`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.
