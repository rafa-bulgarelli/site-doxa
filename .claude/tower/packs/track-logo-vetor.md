# Doxa — Track B: vetorização do logo (task_track-logo-vetor)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-logo-vetor`,
branch **`track-logo-vetor`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-logo-vetor` · `git status --porcelain` vazio · você
está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
Só tenho o logo em PNG — quero o wordmark "DOXA" em vetor de verdade (não um PNG
esticado dentro de uma tag `<svg>`), pronto pra usar em qualquer tamanho sem borrar. O X
vazado (o traço em contorno, diferente das outras 3 letras que são sólidas) é a
assinatura gráfica da marca — quero ele isolado como favicon. **Este SVG é candidato, não
oficial** — preciso ver e aprovar antes de virar definitivo.

## CONTEXTO
- **Card:** `.claude/tower/cards/002-design-system-doxa-segmentacao-home.md`.
- **Fonte:** `brand/doxa-wordmark-white.png` — 657×173px, RGBA, wordmark "DOXA" branco
  sobre fundo transparente. Construção: D/O/A sólidos (preenchidos), **X vazado**
  (contorno/outline, interior transparente). Já existe no repo, não é seu escopo recriar.
- **Ferramentas já instaladas pelo prelude** (você **não roda `pnpm add`** — não toca
  `package.json`/`pnpm-lock.yaml`, isso preserva o paralelismo real com a track de design
  tokens que roda ao mesmo tempo que esta): `potrace` (traçado bitmap→vetor em Node puro,
  sem binário de sistema) e `jimp` (processamento de imagem em Node puro, sem
  dependência nativa — o ambiente **não tem** ImageMagick/potrace/vtracer como binário de
  sistema nem Homebrew instalado; use as libs Node, não tente `brew install`).
- **Por que compositar antes de traçar:** o PNG fonte tem fundo transparente. `potrace`
  traça por limiar de luminância — transparência pode ser interpretada de forma
  inconsistente. Componha o wordmark (branco) sobre um fundo **preto sólido** primeiro
  (com `jimp`), assim vira um verdadeiro branco-sobre-preto de alto contraste antes do
  traçado — e os "buracos" (interior do X vazado, interior do O) saem naturais no
  resultado.
- **Você tem acesso visual à imagem:** use a tool de leitura de arquivo para *abrir*
  `brand/doxa-wordmark-white.png` e ver o logo antes de recortar a região do X (task 4) —
  não tente adivinhar o bounding box só por matemática, olhe a imagem.
- **Armadilha — não fabrique o vetor:** o critério de aceite exige um SVG **vetorizado a
  partir do PNG existente**, não um redesenho de memória do que "DOXA" parece. Se a
  ferramenta de traçado falhar e a instalação de dependência alternativa também falhar,
  **PARE e reporte NOT READY** com o erro exato — não desenhe um SVG à mão de aproximação
  e passe como se fosse vetorização real.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga.

## A TASK
1. Escreva `scripts/vectorize-logo.mjs` (script Node committado, reprodutível — se o dono
   mandar uma fonte melhor depois, roda de novo): usa `jimp` para carregar
   `brand/doxa-wordmark-white.png`, cria um fundo preto sólido do mesmo tamanho, composita
   o wordmark por cima (branco sobre preto), exporta um PNG intermediário em memória/tmp.
2. No mesmo script, usa `potrace` (`potrace.trace(...)`) sobre o PNG compositado. Ajuste
   `turdSize` baixo (fonte é limpa/alto contraste) e confirme que o `threshold` padrão
   separa bem o traço branco do fundo preto.
3. Pós-processe o SVG que o `potrace` devolve: extraia o(s) `d` do(s) `<path>`, descarte o
   `fill="#000000"` fixo do potrace, e monte um SVG limpo:
   `<svg xmlns="..." viewBox="0 0 657 173" role="img" aria-label="Doxa"><path d="..."
   fill="currentColor" /></svg>` (ajuste `fill-rule` para `evenodd` se os buracos do O/X
   não aparecerem vazados com o `nonzero` padrão — confira contando quantos comandos `M`
   existem no `d`: deve haver claramente mais de 4, evidenciando os contornos internos das
   letras com buraco). Salve como `brand/doxa-wordmark-white.svg` (fonte de verdade) com
   um comentário no topo: `<!-- Vetorizado via potrace a partir de
   brand/doxa-wordmark-white.png — PENDENTE aval visual do dono antes de virar oficial -->`.
4. **X isolado (favicon):** abra `brand/doxa-wordmark-white.png` com a tool de leitura
   (ela renderiza a imagem) para localizar visualmente a região do glifo X (a última letra
   de "DOXA", a única com contorno vazado). Recorte essa região com `jimp` (`.crop(...)`)
   generosamente — melhor sobrar margem do que cortar o traço — e repita o traçado
   (tasks 1-3) só nessa região recortada. Salve como `app/icon.svg` com `viewBox` ajustado
   ao bounding box real do path resultante. **Se o recorte não sair limpo** (contorno
   cortado/incompleto), é aceitável usar o wordmark completo como favicon nesta rodada —
   documente essa decisão no report; não é bloqueante (o critério de aceite pede "o
   favicon usa o X vazado" como direção, não perfeição milimétrica neste ciclo).
4b. **APAGUE `app/favicon.ico`** (`git rm app/favicon.ico`) na mesma task. O prelude
   deixou o `.ico` padrão do `create-next-app` no lugar. No App Router o `favicon.ico`
   **tem precedência sobre `icon.svg`** — se os dois coexistirem, a aba continua mostrando
   o ícone do Next e o critério de aceite "o favicon usa o X vazado" falha no
   VALIDAR-LIVE, mesmo com o `icon.svg` correto no repo. Não é opcional.
5. **`components/ui/Logo.tsx`:** componente React que embute o SVG do wordmark
   (`brand/doxa-wordmark-white.svg`) como JSX inline (copie o `<path>` gerado — não use
   `<img src=".../logo.png">` nem referencie o PNG). Props: `className?` (tamanho/cor via
   Tailwind, usa `fill="currentColor"` para herdar cor do contexto), `aria-hidden` só se
   for decorativo dentro de um link que já tem texto acessível (ex. link "voltar para a
   home"), senão mantém `role="img" aria-label="Doxa"`. Teste `Logo.test.tsx`: renderiza
   um `<svg>` com `role="img"`, contém `<path`, **não** contém `<img` nem `data:image` (a
   garantia de que não é um PNG disfarçado).
6. `brand/README.md`: registre a origem (`doxa-wordmark-white.png`, ferramenta usada,
   `scripts/vectorize-logo.mjs` para reproduzir), o status **PENDENTE aval visual do
   dono**, a variante escura (para fundo claro) que ainda falta — fora do escopo deste
   ciclo, sem tema claro — e o X vazado como candidato a motivo gráfico recorrente
   (documentado, não implementado além do favicon nesta rodada).

## SCOPE
- scripts/vectorize-logo.mjs
- brand/doxa-wordmark-white.svg
- brand/README.md
- app/icon.svg
- app/favicon.ico
- components/ui/Logo.tsx
- components/ui/Logo.test.tsx

## DEPENDS ON
`prelude-scaffold-doxa` (precisa estar em `main`). Roda **em paralelo** com
`track-design-tokens` — arquivos disjuntos, confira: aquela track toca `app/globals.css`,
`lib/fonts.ts`, `public/fonts/*` e `components/ui/Button|Container|Section.tsx` — nenhum
desses é tocado por esta track (mesmo diretório `components/ui/`, arquivo `Logo.tsx`
diferente — zero overlap real).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (`Logo.test.tsx` incluso)
- `pnpm build` conclui sem erro
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/main...HEAD --stat -- package.json pnpm-lock.yaml` = vazio (não tocou
  esses dois arquivos)
- para cada SVG produzido (`brand/doxa-wordmark-white.svg`, `app/icon.svg`):
  - `python3 -c "import xml.etree.ElementTree as ET; ET.parse('<arquivo>')"` sem exceção
    (XML bem formado)
  - `grep -Eic "<image|base64" <arquivo>` = 0 (garantia de que não é PNG disfarçado)
  - `grep -c "<path" <arquivo>` > 0
- `grep -c "<img" components/ui/Logo.tsx || true` = 0 e
  `grep -c "currentColor" components/ui/Logo.tsx` > 0
  (o `|| true` é necessário: `grep -c` sai com código 1 quando o contador é 0)
- `test ! -e app/favicon.ico && echo "favicon.ico removido OK"` — precisa imprimir a
  mensagem. Se o `.ico` ainda existir, ele vence o `icon.svg` e a aba mostra o ícone do
  Next: **NOT READY**.
- **Manual (colar no report):** confirme que o texto `PENDENTE aval visual do dono`
  aparece em `brand/doxa-wordmark-white.svg` (comentário) e em `brand/README.md`.

## COMMIT + PUSH
`feat(brand): vetoriza wordmark Doxa em SVG + favicon do X vazado (pendente aval)` →
`git push -u origin track-logo-vetor`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR — **o merge desta track exige, além do gate normal, o
aval visual explícito do dono sobre o traço do SVG** (ver "A VISÃO DO DONO").
