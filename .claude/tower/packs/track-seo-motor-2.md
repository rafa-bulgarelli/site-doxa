# SEO orgânico — Motor 2: gates que faltam e o contraste do cabeçalho (track-seo-motor-2)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-motor-2 origin/feat/seo-organico`. Divergiu → **PARE e reporte**.
`pnpm install --frozen-lockfile`. Package manager **pnpm**.

Leia antes: `src/seo/README.md`, `src/seo/seo.test.ts` (o gate — leia inteiro),
`src/seo/layout/Blocos.tsx`, `src/seo/layout/Cabecalho.tsx`, `src/seo/layout/Rodape.tsx`,
`src/seo/auditoria.ts`, `.claude/STYLE-GOOGLE-TS.md`, `CLAUDE.md` (Fatos do repo).

## A VISÃO DO DONO
A biblioteca tem 61 páginas e os collectors da noite acharam, à mão, três classes de
defeito que o teste do motor devia pegar sozinho: FAQ repetida entre páginas (FAQPage
duplicado), negrito nos 40 primeiros caracteres derrubando um teste que devia comparar
texto achatado, e `key` de célula de tabela duplicando quando duas células têm o mesmo
texto. Além disso o Lighthouse local deu A11Y 95–96 nas páginas SEO por UM achado: os
links do cabeçalho `text-white/45` a 13px não passam de contraste 4,5:1. Esta track fecha
esses gates no motor — sem tocar em conteúdo.

## CONTEXTO
- Só motor: `src/seo/**` FORA de `conteudo/`. `src/seo/conteudo/**` é da track de
  correção que roda em paralelo — NÃO toque. `tipos.ts` e `rotas-planejadas.ts` são
  contrato — NÃO toque. Landing (`src/App.tsx`, `src/main.tsx`, `index.html`,
  `src/components/**`), `tailwind.config.js`, `vite.config.ts`: NÃO.
- Testes novos que reprovarem conteúdo já mergeado: NÃO afrouxe o teste e NÃO edite o
  conteúdo — reporte a lista (a track de correção-1 já está removendo as 7 FAQs
  repetidas conhecidas; se o seu teste achar outras, é achado, vai para o report).
  Como a correção-1 ainda não mergeou, o teste de FAQ única VAI ficar vermelho na sua
  branch por causa das 7 duplicatas conhecidas — isso é esperado: escreva o teste,
  cole a saída vermelha listando exatamente as duplicatas, e a sessão principal
  mergeia a correção-1 antes da sua (a ordem é: correção-1 → motor-2). Verdict READY
  é permitido com ESSE vermelho, e só esse, documentado.

## A TASK
1. **Contraste (A11Y):** `src/seo/layout/Cabecalho.tsx:58` e `src/seo/layout/Rodape.tsx:35,40,43`
   — `text-white/45` a 13px → `text-white/60` (≈ 6.5:1 sobre `#000`; ou o token que dê
   ≥ 4.5:1 mantendo a hierarquia; NÃO mexa na landing, que tem a mesma classe no
   rodapé — é decisão de design do dono). Prove com Lighthouse local (abaixo).
2. **`Blocos.tsx:156,166`** — `key={celula}` nas células (`th`/`td`) → `key` por índice
   da coluna (duas células iguais na mesma linha = key duplicada = warning do React e,
   em SSR, risco silencioso). Idem `:164` `key={linha.join('|')}` → índice da linha
   (duas linhas iguais também colidem). Comentário de uma linha explicando o porquê.
3. **`seo.test.ts:230`** — o teste "primeiro parágrafo aparece no HTML" pega 40
   caracteres e tira `**`; negrito nos primeiros 40 caracteres reprova porque o layout
   quebra em `<strong>`. Corrigir: comparar contra o TEXTO do HTML sem tags (strip de
   tags no trecho do `<main>`) OU achatar o parágrafo com `tokens()`/o mesmo caminho do
   `Inline` e comparar texto com texto. O teste continua pegando parágrafo que não
   renderiza; deixa de reprovar negrito legítimo. Adicione um caso de teste com
   parágrafo que começa em `**negrito**`.
4. **Teste de FAQ única no corpus** (`seo.test.ts`, novo `it`): a mesma `pergunta`
   (normalizada: trim, minúsculas, sem pontuação final) não pode aparecer em 2+
   páginas — FAQPage duplicado é penalidade de schema. Mensagem de erro lista pergunta
   → arquivos. (Vai ficar vermelho até a correção-1 mergear — ver CONTEXTO.)
5. **`auditoria.ts`** — acrescentar ao relatório do `pnpm seo:audit`: (a) contagem de
   palavras do CORPO por página já existe — acrescente AVISO quando fora da faixa do
   tipo (solução/guia/dor 900–1400 · comparativo 1000–1500 · hub 400–800 · verbete
   150–400), medido no corpo (não no `<main>`); é AVISO, não erro; (b) AVISO para
   `pergunta` de FAQ repetida (mesma normalização do item 4) — redundante com o teste,
   mas o audit é o que o gestor lê entre rodadas. Teste em `auditoria.test.ts`.
6. **`README.md` de `src/seo/`** — seção "O que os testes cobram" atualizada (FAQ
   única, trecho achatado) e "Faixas de palavras (medidas no corpo, pelo audit)".

## SCOPE
- src/seo/layout/Cabecalho.tsx  <!-- SCOPE ampliado às 03:05: os 4 layouts abaixo entraram porque o contraste tinha 26 nós em 5 arquivos, não 1 -->
- src/seo/layout/Rodape.tsx
- src/seo/layout/Blocos.tsx
- src/seo/seo.test.ts
- src/seo/auditoria.ts
- src/seo/auditoria.test.ts
- src/seo/README.md
- src/seo/layout/Casca.tsx
- src/seo/layout/PaginaArtigo.tsx
- src/seo/layout/PaginaSolucao.tsx
- src/seo/layout/PaginaHub.tsx
(INTOCÁVEIS: `src/seo/conteudo/**`, `src/seo/tipos.ts`, `src/seo/rotas-planejadas.ts`,
landing, tailwind/vite config. Precisou → PARE e reporte.)

## DEPENDS ON
`feat/seo-organico` @ `c4cc777`+ (rodada 2 mergeada). Merge SÓ DEPOIS de
`track-seo-correcao-1` (que remove as FAQs repetidas que o seu teste 4 vai acusar).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` — verde EXCETO, no máximo, o `it` de FAQ única, cuja saída vermelha lista
  SÓ as 7 perguntas já conhecidas (`Eu preciso gravar…`, `identidade e o tom de voz…`,
  `Quantos vídeos vocês produzem…`, `investir em mídia…`, `acompanhar quantas
  visualizações…`, `Em quais redes sociais…`, `E se os primeiros vídeos…`); qualquer
  OUTRA duplicata = achado novo no report. Cole a saída.
- `pnpm build` ok (66 rotas) · `pnpm seo:audit` roda, imprime os avisos novos de faixa
  de palavras e de FAQ repetida (cole)
- Contraste: `(pnpm preview --port 5421 --strictPort >/dev/null 2>&1 &); sleep 3;
  CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" pnpm dlx
  lighthouse http://localhost:5421/guias/como-viralizar-no-tiktok/ --only-categories=accessibility
  --preset=desktop --quiet --chrome-flags="--headless=new --no-sandbox" --output=json
  --output-path=/tmp/claude-501/lh-motor2.json` → `accessibility.score` = 1 (100) e
  `color-contrast` score 1. Cole. Depois `pkill -f "vite preview --port 5421"`.
- `node .claude/tower/bin/mobile-shot.mjs http://localhost:5421/comparativos/organico-vs-pago/ 320` → `scrollWidth == clientWidth` (a mudança de key não muda layout; a de cor não muda largura)
- caso novo do teste 3 (parágrafo começando em negrito) verde
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/(layout/(Cabecalho|Rodape|Blocos)\.tsx|seo\.test\.ts|auditoria(\.test)?\.ts|README\.md)$'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
Um commit por item → `git push -u origin track-seo-motor-2`. **NÃO mergeie.** Report:
item a item, saída COLADA do VERIFY (com a lista exata das FAQs que o teste 4 acusa),
verdict READY/NOT READY.
