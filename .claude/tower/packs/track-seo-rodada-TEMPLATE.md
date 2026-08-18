# SEO orgânico — Rodada de conteúdo N: <cluster> (task_seo_rodada_<n>_<cluster>)

<!-- TEMPLATE da FASE 2+ (loop noturno §61). O assento do GESTOR clona este arquivo para
     `.claude/tower/packs/track-seo-rodada-<n>-<cluster>.md`, preenche os <…>, e spawna
     até 3 rodadas em paralelo com DIRETÓRIOS DE CONTEÚDO DISJUNTOS. Antes de clonar:
     `pnpm seo:audit` na feature branch → escolher a maior oportunidade (hub com poucos
     membros, links planejados sem página, backlog P1 do keyword-map, órfãs). Depois
     de cada merge: `pnpm seo:audit` de novo → próxima rodada. -->

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = worktree, NÃO `~/orca/projects/site-doxa` ·
`git status --porcelain` vazio · depois: `git fetch origin && git checkout -B
track-seo-rodada-<n>-<cluster> origin/feat/seo-organico`. Divergiu → **PARE e reporte**.

Leia antes: `docs/seo/source-of-truth.md`, `docs/seo/regua-de-copy.md`,
`docs/seo/keyword-map.md` (linhas das suas URLs), `src/seo/README.md`,
`src/seo/tipos.ts`, duas páginas já publicadas do mesmo tipo (forma), e o brief
`.claude/tower/briefs/011-seo-missao-do-dono.md` §18–22, §38, §45–47.

## A VISÃO DO DONO
<2–3 frases: que buscas esta rodada cobre e por que agora — ex.: "o hub de TikTok tem
2 membros; esta rodada leva a 6 com guias que a SERP pede em formato de passo a passo".>

## CONTEXTO
- Só conteúdo: um arquivo por página em `src/seo/conteudo/<dir>/<slug>.ts`,
  `export const pagina: Pagina = {…}`. Motor NÃO se edita (necessidade → report).
- **URLs desta rodada** (todas já em `src/seo/rotas-planejadas.ts` OU listadas aqui —
  se não estiverem lá, quem adiciona é o GESTOR na feature branch ANTES do spawn,
  porque o arquivo é do motor):
  - `<url 1>` — <intent, 1 linha de diferenciação vs vizinhas>
  - `<url 2>` — …
- Mínimo: <n> páginas com padrão. Nunca página rasa para bater número.
- Fatos: só `docs/seo/source-of-truth.md`. NÃO PUBLICÁVEL: preço, fidelidade, prazo do
  primeiro vídeo, formas de pagamento, ranking prometido. Adjacências §47 nunca em
  `/solucoes/`. Estatística de terceiro só com fonte nomeada no texto.
- Conferir: `pnpm test src/seo` · `pnpm build` · `pnpm preview --port 5299` e ler
  `http://localhost:5299/<url>/` (COM barra local). `pnpm seo:audit` antes do READY.
- **Estilo OBRIGATÓRIO**: `.claude/STYLE-GOOGLE-TS.md`. Aspas simples (convenção do repo), sem `any`/`as`.

## A TASK
1. Por página: keyword-map → escrever → `pnpm test src/seo` → `pnpm build` → ler no
   preview → checklist da `regua-de-copy.md` + §45 + QA adversarial §63.
2. Canibalização (§38): uma linha por página no report.
3. Commit POR PÁGINA.

## SCOPE
- src/seo/conteudo/<dir-1>/**
- src/seo/conteudo/<dir-2>/**  <!-- só diretórios que NENHUMA outra rodada ativa usa -->

## DEPENDS ON
`feat/seo-organico` com FASE 1 mergeada (motor + fundação + hubs).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros · `pnpm test` verde · `pnpm build` ok · `pnpm seo:audit` sem ERRO (avisos listados no report)
- `for u in <slug-1> <slug-2> …; do test -f dist/<prefixo>/$u/index.html && echo "ok $u"; done` = todos ok
- `for f in dist/<prefixo>/{<slug-1>,<slug-2>}/index.html; do echo "$f $(grep -c '<h1' $f) $(grep -o '<title>[^<]*' $f)"; done` — `1` + title próprio
- `grep -rniE "lorem|no mundo digital|em constante evolução|nos dias de hoje|estudos mostram" src/seo/conteudo/<dir-1> src/seo/conteudo/<dir-2>` = vazio
- `git diff --name-only origin/feat/seo-organico...HEAD | grep -vE '^src/seo/conteudo/(<dir-1>|<dir-2>)/'` = vazio
- `git diff origin/feat/seo-organico...HEAD | grep -nE "as any|@ts-ignore|: any| as Pagina"` = vazio

## COMMIT + PUSH
Um commit por página → `git push -u origin track-seo-rodada-<n>-<cluster>`. **NÃO
mergeie.** Ao terminar: tabela `URL | palavras | hubs | canibalização` + NECESSIDADES
DE MOTOR + verdict READY/NOT READY + saída COLADA do VERIFY.
